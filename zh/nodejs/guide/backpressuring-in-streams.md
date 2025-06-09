---
title: 理解 Node.js 流中的背压
description: 了解如何在 Node.js 中实现自定义的可读和可写流，同时尊重背压以确保高效的数据流并避免常见的陷阱。
head:
  - - meta
    - name: og:title
      content: 理解 Node.js 流中的背压 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何在 Node.js 中实现自定义的可读和可写流，同时尊重背压以确保高效的数据流并避免常见的陷阱。
  - - meta
    - name: twitter:title
      content: 理解 Node.js 流中的背压 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何在 Node.js 中实现自定义的可读和可写流，同时尊重背压以确保高效的数据流并避免常见的陷阱。
---


# 流中的反压

在数据处理过程中，存在一个普遍的问题，称为反压，它描述了数据传输过程中缓冲区后方数据的堆积。当传输的接收端有复杂的操作，或者由于某种原因速度较慢时，来自传入源的数据往往会累积，就像堵塞一样。

为了解决这个问题，必须建立一个委托系统，以确保数据从一个源到另一个源的平稳流动。不同的社区已经针对他们的程序以独特的方式解决了这个问题，Unix 管道和 TCP 套接字就是很好的例子，并且通常被称为流量控制。在 Node.js 中，流已被采用作为解决方案。

本指南的目的是进一步详细说明什么是反压，以及流如何在 Node.js 的源代码中解决这个问题。本指南的第二部分将介绍建议的最佳实践，以确保您应用程序的代码在实现流时是安全和优化的。

我们假设您对 Node.js 中的 `反压`、`Buffer` 和 `EventEmitter` 的一般定义有一些了解，并且有一些使用 `Stream` 的经验。如果您还没有阅读过这些文档，建议您先查看 [API 文档](/zh/nodejs/api/stream)，这将有助于您在阅读本指南时扩展您的理解。

## 数据处理的问题

在计算机系统中，数据通过管道、套接字和信号从一个进程传输到另一个进程。在 Node.js 中，我们发现了一种类似的机制，称为 `Stream`。流很棒！它们为 Node.js 做了很多事情，几乎所有内部代码库都使用该模块。作为开发人员，我们非常鼓励您也使用它们！

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('为什么要使用流？ ', answer => {
    console.log(`也许是 ${answer}，也许是因为它们很棒！`);
});

rl.close();
```

通过比较 Node.js 的 Stream 实现中的内部系统工具，可以很好地展示通过流实现的反压机制为何是一种出色的优化。

在一种情况下，我们将获取一个大文件（大约 -9 GB）并使用熟悉的 `zip(1)` 工具对其进行压缩。

```bash
zip The.Matrix.1080p.mkv
```

虽然这需要几分钟才能完成，但在另一个 shell 中，我们可以运行一个脚本，该脚本使用 Node.js 的 `zlib` 模块，该模块包装了另一个压缩工具 `gzip(1)`。

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

要测试结果，请尝试打开每个压缩文件。由 `zip(1)` 工具压缩的文件会通知您该文件已损坏，而由 Stream 完成的压缩将解压缩而不会出错。

::: tip Note
在此示例中，我们使用 `.pipe()` 将数据源从一端传输到另一端。但是，请注意没有附加适当的错误处理程序。如果一块数据未能正确接收，则 Readable 源或 `gzip` 流将不会被销毁。`pump` 是一个实用工具，如果其中一个流失败或关闭，它可以正确销毁管道中的所有流，在这种情况下是必不可少的！
:::

`pump` 仅在 Node.js 8.x 或更早版本中是必需的，因为对于 Node.js 10.x 或更高版本，引入了 `pipeline` 来替代 `pump`。这是一个模块方法，用于在流之间进行管道传输，转发错误并正确清理，并在管道完成时提供回调。

以下是使用 pipeline 的示例：

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// 使用 pipeline API 可以轻松地将一系列流
// 连接在一起，并在管道完全完成时收到通知。
// 一个高效地 gzip 压缩潜在的巨大视频文件的管道：
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

您还可以使用 `stream/promises` 模块将 pipeline 与 `async / await` 一起使用：

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}
```


## 数据过多，速度过快

在某些情况下，`Readable` 流可能会以过快的速度向 `Writable` 流提供数据——远超消费者能够处理的速度！

当这种情况发生时，消费者将开始对所有数据块进行排队，以便稍后消费。写入队列将变得越来越长，因此，必须在内存中保存更多数据，直到整个过程完成。

写入磁盘的速度比从磁盘读取的速度慢得多，因此，当我们尝试压缩文件并将其写入硬盘时，会发生背压，因为写入磁盘的速度将无法跟上读取的速度。

```javascript
// 实际上，流正在说：“哇，哇！等等，这太多了！”
// 数据将开始在数据缓冲区的读取端积累，因为
// write 尝试跟上输入数据流的速度。
inp.pipe(gzip).pipe(outputFile);
```

这就是背压机制如此重要的原因。如果没有背压系统，该进程将耗尽系统的内存，从而有效地减慢其他进程的速度，并在完成之前垄断系统的大部分资源。

这会导致以下几件事：
- 减慢所有其他当前进程的速度
- 垃圾回收器工作过度
- 内存耗尽

在下面的示例中，我们将取出 `.write()` 函数的返回值并将其更改为 `true`，这实际上禁用了 Node.js 核心中的背压支持。 在任何提及 `'modified'` 二进制文件的地方，我们都在谈论运行没有 `return ret;` 行的节点二进制文件，而是替换为 `return true;`。

## 垃圾回收的过度拖累

让我们看一个快速的基准测试。 使用上面的相同示例，我们运行了一些时间试验，以获得两个二进制文件的中间时间。

```bash
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

两者都需要大约一分钟才能运行，因此几乎没有区别，但是让我们仔细看一下，以确认我们的怀疑是否正确。 我们使用 Linux 工具 `dtrace` 来评估 V8 垃圾回收器中发生的情况。

GC（垃圾回收器）测量的时间表示垃圾回收器完成的单个扫描周期的间隔：

```bash
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

虽然两个进程的启动方式相同，并且似乎以相同的速率运行 GC，但很明显，在正确工作的背压系统存在几秒钟后，它会将 GC 负载分散到 4-8 毫秒的持续间隔中，直到数据传输结束。

但是，当没有背压系统时，V8 垃圾回收开始拖延。 普通二进制文件在一分钟内大约调用 GC 75 次，而修改后的二进制文件仅调用 36 次。

这是由于不断增长的内存使用而累积的缓慢而渐进的债务。 随着数据的传输，在没有背压系统的情况下，每次块传输都会使用更多的内存。

分配的内存越多，GC 在一次扫描中需要处理的就越多。 扫描越大，GC 需要决定释放哪些内容就越多，并且在更大的内存空间中扫描分离的指针将消耗更多的计算能力。


## 内存耗尽

为了确定每个二进制文件的内存消耗，我们分别使用 `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js` 记录了每个进程的时间。

这是正常二进制文件的输出：

```bash
遵循 .write() 的返回值
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
     19427  page reclaims
      3134  page faults
         0  swaps
         5  block input operations
       194  block output operations
         0  messages sent
         0  messages received
         1  signals received
        12  voluntary context switches
    666037  involuntary context switches
```

虚拟内存占用的最大字节数约为 87.81 mb。

现在更改 `.write()` 函数的返回值，我们得到：

```bash
不遵循 .write() 的返回值：
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    373617  page reclaims
      3139  page faults
         0  swaps
        18  block input operations
       199  block output operations
         0  messages sent
         0  messages received
         1  signals received
        25  voluntary context switches
    629566  involuntary context switches
```

虚拟内存占用的最大字节数约为 1.52 gb。

如果没有流来委托背压，那么分配的内存空间将会大一个数量级——同一个进程之间存在巨大的差异！

这个实验展示了 Node.js 的背压机制对于你的计算系统来说是多么的优化和经济高效。现在，让我们来分解一下它的工作原理！


## 背压如何解决这些问题？

有不同的函数可以将数据从一个进程传输到另一个进程。在 Node.js 中，有一个内置的内部函数叫做 `.pipe()`。你也可以使用其他的包！但最终，在这个过程的最基本层面上，我们有两个独立的组件：数据的源头和消费者。

当从源头调用 `.pipe()` 时，它会向消费者发出信号，表明有数据要传输。pipe 函数有助于为事件触发器设置适当的背压闭包。

在 Node.js 中，源是 `Readable` 流，消费者是 `Writable` 流（这两个流都可以与 Duplex 或 Transform 流互换，但这超出了本指南的范围）。

背压触发的时刻可以精确地缩小到 `Writable` 的 `.write()` 函数的返回值。当然，这个返回值是由一些条件决定的。

在任何数据缓冲区超过 `highwaterMark` 或写入队列当前繁忙的情况下，`.write()` 将 `返回 false`。

当返回 `false` 值时，背压系统启动。它将暂停传入的 `Readable` 流发送任何数据，并等待消费者再次准备好。一旦数据缓冲区被清空，将发出一个 `'drain'` 事件，并恢复传入的数据流。

一旦队列完成，背压将允许再次发送数据。正在使用的内存空间将被释放，并为下一批数据做准备。

这有效地允许在任何给定时间为 `.pipe()` 函数使用固定数量的内存。不会有内存泄漏，也不会有无限缓冲，垃圾收集器只需要处理内存中的一个区域！

那么，如果背压如此重要，为什么你（可能）没有听说过它呢？嗯，答案很简单：Node.js 会自动为你完成所有这些。

这太棒了！但当我们试图理解如何实现我们的自定义流时，这又不是那么好。

::: info NOTE
在大多数机器中，都有一个字节大小来确定缓冲区何时已满（这在不同的机器上会有所不同）。Node.js 允许你设置自定义的 `highWaterMark`，但通常，默认设置为 16kb（16384，或者对于 objectMode 流为 16）。在某些你可能想要提高该值的情况下，可以这样做，但要小心！
:::


## `.pipe()` 的生命周期

为了更好地理解背压，这里有一个流程图，展示了 `Readable` 流被 [管道](/zh/nodejs/api/stream) 传输到 `Writable` 流的生命周期：

```bash
                                                     +===================+
                         x-->  管道功能           +-->   src.pipe(dest)  |
                         x     在 .pipe 方法期间被设置    |===================|
                         x     。                    |  事件回调函数  |
  +===============+      x                           |-------------------|
  |   你的数据   |      x     它们存在于数据流之外， | .on('close', cb)  |
  +=======+=======+      x     但重要的是附加事件，   | .on('data', cb)   |
          |              x     以及它们各自的回调函数。  | .on('drain', cb)  |
          |              x                           | .on('unpipe', cb) |
+---------v---------+    x                           | .on('error', cb)  |
|  Readable Stream  +----+                           | .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Writable Stream  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       |       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |    这个 chunk 太大吗？    |
  ^       |       |     emit .end();             |    队列是否繁忙？         |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  否  |        |  是  |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            当队列为空时     +============+                         |
  ^------------^-----------------------<  缓冲中 |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   将 chunk 添加到队列    |
                                       |            <---^---------------------<
                                       +============+
```

::: tip NOTE
如果您正在设置管道以将几个流链接在一起以操作您的数据，您很可能会实现 Transform 流。
:::

在这种情况下，来自 `Readable` 流的输出将进入 `Transform` 流，并被管道传输到 `Writable` 流。

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

背压将自动应用，但请注意，`Transform` 流的传入和传出 `highwaterMark` 都可以被操作，并且会影响背压系统。


## 背压指南

自 Node.js v0.10 以来，Stream 类提供了通过使用这些函数的下划线版本（`._read()` 和 `._write()`）来修改 `.read()` 或 `.write()` 行为的能力。

针对实现可读流和实现可写流，都有相关指南文档。 我们假设您已经阅读过这些文档，下一节将更深入地探讨。

## 实现自定义流时要遵守的规则

流的黄金法则是始终尊重背压。 最佳实践的构成是非矛盾的实践。 只要您注意避免与内部背压支持相冲突的行为，您就可以确保遵循良好的实践。

一般来说，

1. 如果没有被要求，永远不要 `.push()`。
2. 永远不要在 `.write()` 返回 false 后调用它，而是等待 'drain' 事件。
3. 流在不同的 Node.js 版本和您使用的库之间会发生变化。 小心并测试。

::: tip NOTE
关于第 3 点，一个用于构建浏览器流的极其有用的包是 `readable-stream`。 Rodd Vagg 撰写了一篇 [很棒的博文](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) 描述了这个库的实用性。 简而言之，它为可读流提供了一种自动化的优雅降级，并支持旧版本的浏览器和 Node.js。
:::

## 可读流特有的规则

到目前为止，我们已经了解了 `.write()` 如何影响背压，并且主要关注可写流。 由于 Node.js 的功能，数据从技术上讲是从可读流向下游流动到可写流的。 然而，正如我们可以在任何数据、物质或能量的传输中观察到的那样，源头与目的地同样重要，并且可读流对于如何处理背压至关重要。

这两个过程都依赖于彼此进行有效通信，如果可读流忽略可写流要求它停止发送数据的时间，那么这可能与 `.write()` 的返回值不正确一样成问题。

因此，除了尊重 `.write()` 的返回值之外，我们还必须尊重 `._read()` 方法中使用的 `.push()` 的返回值。 如果 `.push()` 返回 false 值，则流将停止从源读取。 否则，它将继续而不会暂停。

以下是一个使用 `.push()` 的不良实践示例：

```javascript
// 这是有问题的，因为它完全忽略了 push 的返回值，
// 这可能是来自目标流的背压信号！
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

此外，从自定义流外部，忽略背压也存在陷阱。 在这个良好的反例中，应用程序的代码会在数据可用时（由 `'data'` 事件发出信号）强制数据通过：

```javascript
// 这忽略了 Node.js 设置的背压机制，
// 并无条件地推送数据，无论
// 目标流是否已准备好接收它。
readable.on('data', data => writable.write(data));
```

这是一个使用 `.push()` 和可读流的示例。

```javascript
const { Readable } = require('node:stream');

// 创建一个自定义的可读流
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // 将一些数据推送到流中
    this.push({ message: 'Hello, world!' });
    this.push(null); // 标记流的结束
  },
});

// 消费流
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// 输出:
// { message: 'Hello, world!' }
```

## Writable Stream 的特定规则

回想一下，`.write()` 可能会根据一些条件返回 true 或 false。幸运的是，在构建我们自己的 Writable stream 时，stream 状态机将处理我们的回调，并确定何时处理背压和优化数据流。但是，当我们想直接使用 Writable 时，我们必须尊重 `.write()` 的返回值，并密切关注以下条件：
- 如果写入队列繁忙，`.write()` 将返回 false。
- 如果数据块太大，`.write()` 将返回 false（限制由变量 highWaterMark 指示）。

在此示例中，我们创建一个自定义 Readable stream，它使用 `.push()` 将单个对象推送到 stream 上。当 stream 准备好消耗数据时，将调用 `._read()` 方法，在这种情况下，我们立即将一些数据推送到 stream 上，并通过推送 `null` 来标记 stream 的结束。
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: 'Hello, world!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
然后，我们通过监听 'data' 事件并记录推送到 stream 上的每个数据块来消耗 stream。 在这种情况下，我们只将单个数据块推送到 stream 上，因此我们只看到一条日志消息。

## Writable Stream 的特定规则

回想一下，`.write()` 可能会根据一些条件返回 true 或 false。幸运的是，在构建我们自己的 Writable stream 时，stream 状态机将处理我们的回调，并确定何时处理背压和优化数据流。

但是，当我们想直接使用 Writable 时，我们必须尊重 `.write()` 的返回值，并密切关注以下条件：
- 如果写入队列繁忙，`.write()` 将返回 false。
- 如果数据块太大，`.write()` 将返回 false（限制由变量 highWaterMark 指示）。

```javascript
class MyWritable extends Writable {
  // 由于 JavaScript 回调的异步特性，此 writable 无效。
  // 在最后一个回调之前，每个回调都没有返回语句，
  // 很有可能调用多个回调。
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

在实现 `._writev()` 时，还有一些需要注意的事项。 该函数与 `.cork()` 耦合，但在编写时有一个常见的错误：

```javascript
// 在这里使用 .uncork() 两次会在 C++ 层进行两次调用，从而使
// cork/uncork 技术无用。
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// 编写此代码的正确方法是利用 process.nextTick()，它会在下一个事件循环中触发。
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// 作为全局函数。
function doUncork(stream) {
  stream.uncork();
}
```

`.cork()` 可以被调用任意次数，我们只需要小心地调用 `.uncork()` 相同的次数，使其再次流动。


## 结论

流（Streams）是 Node.js 中一个经常使用的模块。它们对于内部结构很重要，对于开发者来说，也很重要，可以扩展和连接 Node.js 模块生态系统。

希望现在你能够排查故障，并安全地编写你自己的 `Writable` 和 `Readable` 流，同时考虑到背压，并将你的知识分享给同事和朋友。

请务必阅读更多关于 `Stream` 的信息，了解其他 API 函数，以帮助你提高和释放在使用 Node.js 构建应用程序时的流处理能力。

