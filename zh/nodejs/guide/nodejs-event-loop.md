---
title: 了解 Node.js 事件循环
description: 事件循环是 Node.js 的核心，允许它执行非阻塞 I/O 操作。它是一个单线程循环，当可能时将操作卸载到系统内核。
head:
  - - meta
    - name: og:title
      content: 了解 Node.js 事件循环 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 事件循环是 Node.js 的核心，允许它执行非阻塞 I/O 操作。它是一个单线程循环，当可能时将操作卸载到系统内核。
  - - meta
    - name: twitter:title
      content: 了解 Node.js 事件循环 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 事件循环是 Node.js 的核心，允许它执行非阻塞 I/O 操作。它是一个单线程循环，当可能时将操作卸载到系统内核。
---


# Node.js 事件循环

## 什么是事件循环？

事件循环使 Node.js 能够执行非阻塞 I/O 操作——尽管默认情况下使用单个 JavaScript 线程——通过尽可能将操作卸载到系统内核。

由于大多数现代内核都是多线程的，因此它们可以处理在后台执行的多个操作。当其中一项操作完成时，内核会告诉 Node.js，以便将适当的回调添加到轮询队列中，以便最终执行。我们将在本主题的后面详细解释这一点。

## 事件循环详解

当 Node.js 启动时，它会初始化事件循环，处理提供的输入脚本（或进入 REPL，本文档未涵盖），该脚本可能会发出异步 API 调用、安排计时器或调用 process.nextTick()，然后开始处理事件循环。

下图显示了事件循环操作顺序的简化概述。

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
每个框都将被称为事件循环的“阶段”。
:::

每个阶段都有一个 FIFO 回调队列来执行。虽然每个阶段都有其特殊之处，但通常，当事件循环进入给定阶段时，它将执行特定于该阶段的任何操作，然后执行该阶段队列中的回调，直到队列耗尽或执行了最大数量的回调。当队列耗尽或达到回调限制时，事件循环将移动到下一个阶段，依此类推。

由于这些操作中的任何一个都可能调度更多的操作，并且内核会将**轮询**阶段中处理的新事件排队，因此可以在处理轮询事件时将轮询事件排队。因此，长时间运行的回调可以使轮询阶段的运行时间比计时器的阈值长得多。有关更多详细信息，请参见计时器和轮询部分。

::: tip
Windows 和 Unix/Linux 实现之间存在细微的差异，但这对于本次演示并不重要。最重要的部分在这里。实际上有七个或八个步骤，但我们关心的步骤——Node.js 实际使用的步骤——是上面的那些。
:::


## 阶段概述
- **定时器**: 此阶段执行由 `setTimeout()` 和 `setInterval()` 调度的回调。
- **待定回调**: 执行延迟到下一次循环迭代的 I/O 回调。
- **空闲，准备**: 仅在内部使用。
- **轮询**: 检索新的 I/O 事件；执行与 I/O 相关的回调（几乎所有，除了关闭回调、由定时器调度的回调和 `setImmediate()` 调度的回调）；在适当的时候，Node 将在此处阻塞。
- **检查**: `setImmediate()` 回调在此处被调用。
- **关闭回调**: 一些关闭回调，例如 `socket.on('close', ...)`。

在事件循环的每次运行之间，Node.js 会检查它是否正在等待任何异步 I/O 或定时器，如果没有，则会干净地关闭。

## 阶段详情

### 定时器

定时器指定一个**阈值**，超过该阈值后，可以执行提供的回调，而不是人们*希望执行的**确切**时间。 定时器回调会在指定的时间量过去后，尽快被调度执行；但是，操作系统调度或其他回调的运行可能会延迟它们。

::: tip
从技术上讲，[轮询](/zh/nodejs/guide/nodejs-event-loop#poll)阶段控制着定时器的执行时机。
:::

例如，假设您安排一个超时在 100 毫秒的阈值后执行，然后您的脚本开始异步读取一个文件，该文件需要 95 毫秒：

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // 假设这需要 95 毫秒才能完成
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`自预定以来已经过去了 ${delay}ms`);
}, 100);
// 执行一些需要 95 毫秒才能完成的 someAsyncOperation
someAsyncOperation(() => {
  const startCallback = Date.now();
  // 做一些需要 10 毫秒的事情...
  while (Date.now() - startCallback < 10) {
    // 什么也不做
  }
});
```

当事件循环进入**轮询**阶段时，它有一个空队列（`fs.readFile()` 尚未完成），因此它将等待直到达到最早定时器阈值剩余的毫秒数。在等待的 95 毫秒过去后，`fs.readFile()` 完成读取文件，并且其需要 10 毫秒才能完成的回调被添加到轮询队列并执行。 当回调完成时，队列中没有更多的回调，因此事件循环将看到已达到最早定时器的阈值，然后回绕到定时器阶段以执行定时器的回调。 在这个例子中，您会看到定时器被安排到其回调被执行之间的总延迟将是 105 毫秒。

::: tip
为了防止轮询阶段使事件循环陷入饥饿，[libuv](https://libuv.org/)（实现 Node.js 事件循环和平台所有异步行为的 C 库）也有一个硬性最大值（取决于系统），超过此值它将停止轮询更多事件。
:::


## 待定回调

此阶段执行一些系统操作的回调，例如 TCP 错误类型。 例如，如果 TCP 套接字在尝试连接时收到 `ECONNREFUSED`，则某些 *nix 系统希望等待报告错误。 这将被排队以在**待定回调**阶段执行。

### 轮询

**轮询**阶段有两个主要功能：

1. 计算它应该阻塞和轮询 I/O 的时间，然后
2. 处理**轮询**队列中的事件。

当事件循环进入**轮询**阶段并且没有安排任何计时器时，将会发生以下两种情况之一：

- 如果***轮询***队列***不为空***，则事件循环将迭代其回调队列，同步执行它们，直到队列耗尽或达到系统相关的硬性限制。

- 如果***轮询***队列***为空***，则还会发生以下两种情况之一：

    - 如果脚本已由 `setImmediate()` 安排，则事件循环将结束**轮询**阶段并继续到检查阶段以执行那些安排好的脚本。

    - 如果脚本**尚未**由 `setImmediate()` 安排，则事件循环将等待将回调添加到队列，然后立即执行它们。

一旦**轮询**队列为空，事件循环将检查*时间阈值*已达到的计时器。 如果一个或多个计时器准备就绪，则事件循环将返回到**计时器**阶段以执行这些计时器的回调。

### 检查

此阶段允许人们在**轮询**阶段完成后立即执行回调。 如果**轮询**阶段变为空闲并且已使用 `setImmediate()` 将脚本排队，则事件循环可能会继续进入检查阶段，而不是等待。

`setImmediate()` 实际上是一个特殊的计时器，它在事件循环的单独阶段运行。 它使用 libuv API 来安排回调在**轮询**阶段完成后执行。

通常，随着代码的执行，事件循环最终将到达**轮询**阶段，并在该阶段等待传入的连接、请求等。但是，如果已使用 `setImmediate()` 安排了回调并且**轮询**阶段变为空闲，它将结束并继续进入**检查**阶段，而不是等待**轮询**事件。


### 关闭回调

如果套接字或句柄被突然关闭（例如，`socket.destroy()`），`'close'` 事件将在此阶段发出。否则，它将通过 `process.nextTick()` 发出。

## `setImmediate()` vs `setTimeout()`

`setImmediate()` 和 `setTimeout()` 类似，但它们的行为取决于何时被调用。

- `setImmediate()` 被设计为在当前**轮询**阶段完成后执行一个脚本。
- `setTimeout()` 安排一个脚本在经过最少 ms 的阈值后运行。

计时器执行的顺序将根据它们被调用的上下文而变化。如果两者都从主模块中调用，那么计时将受到进程性能的限制（这可能会受到运行在机器上的其他应用程序的影响）。

例如，如果我们运行以下不在 I/O 循环中的脚本（即主模块），那么两个计时器执行的顺序是不确定的，因为它受到进程性能的限制：

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

但是，如果将两个调用都移动到 I/O 循环中，则立即回调始终首先执行：

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

在 I/O 循环中调度时，使用 `setImmediate()` 而不是 `setTimeout()` 的主要优点是 `setImmediate()` 总是会在任何计时器之前执行，而不管存在多少计时器。


## `process.nextTick()`

### 理解 `process.nextTick()`

你可能已经注意到，即使 `process.nextTick()` 是异步 API 的一部分，它也没有显示在图中。这是因为 `process.nextTick()` 从技术上讲并不是事件循环的一部分。相反，无论事件循环的当前阶段如何，`nextTickQueue` 都会在当前操作完成后处理。在这里，一个操作被定义为从底层 C/C++ 处理程序过渡，并处理需要执行的 JavaScript。

回顾我们的图表，任何时候你在给定阶段调用 `process.nextTick()`，传递给 `process.nextTick()` 的所有回调都会在事件循环继续之前被解析。这可能会造成一些糟糕的情况，因为**它允许你通过递归调用** `process.nextTick()` **来“饿死”你的 I/O**，这会阻止事件循环到达 **poll** 阶段。

### 为什么允许这样做？

为什么类似的东西会被包含在 Node.js 中？部分原因是设计理念，即 API 应该始终是异步的，即使它不必是。例如，以下代码片段：

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

该片段进行参数检查，如果参数不正确，它会将错误传递给回调。该 API 最近进行了更新，允许将参数传递给 `process.nextTick()`，从而允许它接受在回调之后传递的任何参数，并将它们作为回调的参数传播，因此你不必嵌套函数。

我们正在做的是将错误返回给用户，但仅在我们允许用户代码的其余部分执行之后。通过使用 `process.nextTick()`，我们保证 `apiCall()` 始终在用户代码的其余部分之后且在事件循环允许继续之前运行其回调。为了实现这一点，允许 JS 调用堆栈展开，然后立即执行提供的回调，这允许一个人递归调用 `process.nextTick()`，而不会从 v8 达到 `RangeError: Maximum call stack size exceeded`。

这种理念可能会导致一些潜在的问题情况。例如，以下代码片段：

```js
let bar;
// 这具有异步签名，但同步调用回调
function someAsyncApiCall(callback) {
  callback();
}
// 回调在 `someAsyncApiCall` 完成之前被调用。
someAsyncApiCall(() => {
  // 由于 someAsyncApiCall 尚未完成，bar 尚未被分配任何值
  console.log('bar', bar); // undefined
});
bar = 1;
```

用户定义 `someAsyncApiCall()` 具有异步签名，但它实际上是同步操作的。当调用它时，提供给 `someAsyncApiCall()` 的回调在事件循环的同一阶段被调用，因为 `someAsyncApiCall()` 实际上没有异步执行任何操作。因此，回调尝试引用 bar，即使它可能还没有该变量的作用域，因为脚本尚未能够运行到完成。

通过将回调放在 `process.nextTick()` 中，脚本仍然有能力运行到完成，从而允许在调用回调之前初始化所有变量、函数等。它还具有不允许事件循环继续的优势。在允许事件循环继续之前，提醒用户注意错误可能很有用。以下是使用 `process.nextTick()` 的先前示例：

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

这是另一个真实的例子：

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

当只传递一个端口时，该端口会立即绑定。因此，`'listening'` 回调可以立即调用。问题是 `.on('listening')` 回调那时还没有设置。

为了解决这个问题，`'listening'` 事件被排队到 `nextTick()` 中，以允许脚本运行到完成。这允许用户设置他们想要的任何事件处理程序。


## `process.nextTick()` vs `setImmediate()`

我们有两个调用，从用户的角度来看很相似，但它们的名称容易混淆。

- `process.nextTick()` 在同一阶段立即触发
- `setImmediate()` 在事件循环的下一次迭代或 “tick” 时触发

本质上，这些名称应该互换。`process.nextTick()` 比 `setImmediate()` 更快地触发，但这仅仅是过去的遗留问题，不太可能改变。进行这种切换会破坏 npm 上很大一部分软件包。每天都有更多新模块被添加，这意味着我们每等待一天，就可能发生更多潜在的破坏。虽然它们令人困惑，但名称本身不会改变。

::: tip
我们建议开发人员在所有情况下都使用 `setImmediate()`，因为它更容易理解。
:::

## 为什么要使用 `process.nextTick()`？

主要有两个原因：

1. 允许用户在事件循环继续之前处理错误、清理任何不再需要的资源，或者可能再次尝试请求。

2. 有时需要允许回调在调用堆栈展开之后但在事件循环继续之前运行。

一个例子是匹配用户的期望。 简单示例：

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

假设 `listen()` 在事件循环的开始时运行，但 listening 回调被放置在 `setImmediate()` 中。 除非传递主机名，否则绑定到端口将立即发生。 为了使事件循环继续进行，它必须到达 poll 阶段，这意味着很有可能在 listening 事件触发之前就已经收到连接，从而允许 connection 事件被触发。

另一个例子是扩展 `EventEmitter` 并在构造函数中发出事件：

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

你不能立即从构造函数中发出事件，因为脚本还没有处理到用户为该事件分配回调的地步。 因此，在构造函数本身中，你可以使用 `process.nextTick()` 设置一个回调，以便在构造函数完成后发出该事件，这将提供预期的结果：

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // 使用 nextTick 在分配处理程序后发出事件
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
