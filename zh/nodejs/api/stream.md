---
title: Node.js 流 API 文档
description: 关于 Node.js 流 API 的详细文档，涵盖可读流、可写流、双工流和转换流及其方法、事件和使用示例。
head:
  - - meta
    - name: og:title
      content: Node.js 流 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 关于 Node.js 流 API 的详细文档，涵盖可读流、可写流、双工流和转换流及其方法、事件和使用示例。
  - - meta
    - name: twitter:title
      content: Node.js 流 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 关于 Node.js 流 API 的详细文档，涵盖可读流、可写流、双工流和转换流及其方法、事件和使用示例。
---


# Stream {#stream}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

流是用于在 Node.js 中处理流式数据的抽象接口。 `node:stream` 模块提供了一个用于实现流接口的 API。

Node.js 提供了许多流对象。 例如，[对 HTTP 服务器的请求](/zh/nodejs/api/http#class-httpincomingmessage) 和 [`process.stdout`](/zh/nodejs/api/process#processstdout) 都是流的实例。

流可以是可读的、可写的，或者两者兼有。 所有流都是 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 的实例。

要访问 `node:stream` 模块：

```js [ESM]
const stream = require('node:stream');
```

`node:stream` 模块对于创建新型流实例很有用。 通常不需要使用 `node:stream` 模块来使用流。

## 本文档的组织 {#organization-of-this-document}

本文档包含两个主要部分和一个用于注释的第三部分。 第一部分解释了如何在应用程序中使用现有流。 第二部分解释了如何创建新型流。

## 流的类型 {#types-of-streams}

Node.js 中有四种基本流类型：

- [`Writable`](/zh/nodejs/api/stream#class-streamwritable)：可以写入数据的流（例如，[`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options)）。
- [`Readable`](/zh/nodejs/api/stream#class-streamreadable)：可以从中读取数据的流（例如，[`fs.createReadStream()`](/zh/nodejs/api/fs#fscreatereadstreampath-options)）。
- [`Duplex`](/zh/nodejs/api/stream#class-streamduplex)：既是 `Readable` 又是 `Writable` 的流（例如，[`net.Socket`](/zh/nodejs/api/net#class-netsocket)）。
- [`Transform`](/zh/nodejs/api/stream#class-streamtransform)：可以在写入和读取数据时修改或转换数据的 `Duplex` 流（例如，[`zlib.createDeflate()`](/zh/nodejs/api/zlib#zlibcreatedeflateoptions)）。

此外，此模块还包括实用函数 [`stream.duplexPair()`](/zh/nodejs/api/stream#streamduplexpairoptions)、[`stream.pipeline()`](/zh/nodejs/api/stream#streampipelinesource-transforms-destination-callback)、[`stream.finished()`](/zh/nodejs/api/stream#streamfinishedstream-options-callback)、[`stream.Readable.from()`](/zh/nodejs/api/stream#streamreadablefromiterable-options) 和 [`stream.addAbortSignal()`](/zh/nodejs/api/stream#streamaddabortsignalsignal-stream)。


### Streams Promises API {#streams-promises-api}

**添加于: v15.0.0**

`stream/promises` API 提供了一组替代的异步实用函数，用于返回 `Promise` 对象而不是使用回调的流。可以通过 `require('node:stream/promises')` 或 `require('node:stream').promises` 访问该 API。

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | 添加了 `end` 选项，可以将其设置为 `false`，以防止在源结束时自动关闭目标流。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/zh/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pipeline 选项
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当源流结束时结束目标流。即使此值为 `false`，转换流也始终会结束。**默认值:** `true`。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当 pipeline 完成时 fulfill。

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

要使用 `AbortSignal`，请将其作为选项对象传递，作为最后一个参数。当信号中止时，将使用 `AbortError` 在底层 pipeline 上调用 `destroy`。

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

`pipeline` API 也支持异步生成器：

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

请记住处理传递给异步生成器的 `signal` 参数。特别是在异步生成器是 pipeline 的源（即第一个参数）的情况下，否则 pipeline 将永远不会完成。

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

`pipeline` API 提供了 [回调版本](/zh/nodejs/api/stream#streampipelinesource-transforms-destination-callback)：


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.5.0, v18.14.0 | 增加了对 `ReadableStream` 和 `WritableStream` 的支持。 |
| v19.1.0, v18.13.0 | 增加了 `cleanup` 选项。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `stream` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 可读和/或可写流/webstream。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果为 `true`，则在 promise 完成之前删除此函数注册的监听器。 **默认值:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当流不再可读或可写时完成。

::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```
:::

`finished` API 也提供了一个 [回调版本](/zh/nodejs/api/stream#streamfinishedstream-options-callback)。

`stream.finished()` 在返回的 promise 被解决或拒绝后，会留下悬空的事件监听器（特别是 `'error'`、`'end'`、`'finish'` 和 `'close'`）。 这样做的原因是，意外的 `'error'` 事件（由于不正确的流实现）不会导致意外的崩溃。 如果不希望出现此行为，则应将 `options.cleanup` 设置为 `true`：

```js [ESM]
await finished(rs, { cleanup: true });
```

### 对象模式 {#object-mode}

所有由 Node.js API 创建的流都只操作字符串、[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 和 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对象：

- `Strings` 和 `Buffers` 是流中最常用的类型。
- `TypedArray` 和 `DataView` 允许你处理具有 `Int32Array` 或 `Uint8Array` 等类型的二进制数据。 当你将 TypedArray 或 DataView 写入流时，Node.js 会处理原始字节。

但是，流的实现可以使用其他类型的 JavaScript 值（除了 `null`，它在流中具有特殊用途）。 这种流被认为以“对象模式”运行。

流实例在使用流创建时使用 `objectMode` 选项切换到对象模式。 尝试将现有流切换到对象模式是不安全的。

### 缓冲 {#buffering}

[`Writable`](/zh/nodejs/api/stream#class-streamwritable) 和 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流都将数据存储在内部缓冲区中。

潜在缓冲的数据量取决于传递到流构造函数的 `highWaterMark` 选项。 对于普通流，`highWaterMark` 选项指定了 [总字节数](/zh/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding)。 对于以对象模式运行的流，`highWaterMark` 指定了对象的总数。 对于在字符串上运行（但不解码）的流，`highWaterMark` 指定了 UTF-16 代码单元的总数。

当实现调用 [`stream.push(chunk)`](/zh/nodejs/api/stream#readablepushchunk-encoding) 时，数据会在 `Readable` 流中缓冲。 如果流的使用者不调用 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize)，则数据将保留在内部队列中，直到它被使用。

一旦内部读取缓冲区的总大小达到 `highWaterMark` 指定的阈值，流将暂时停止从底层资源读取数据，直到当前缓冲的数据可以被使用（也就是说，流将停止调用内部的 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法，该方法用于填充读取缓冲区）。

当重复调用 [`writable.write(chunk)`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 方法时，数据会在 `Writable` 流中缓冲。 当内部写入缓冲区的总大小低于 `highWaterMark` 设置的阈值时，对 `writable.write()` 的调用将返回 `true`。 一旦内部缓冲区的大小达到或超过 `highWaterMark`，将返回 `false`。

`stream` API 的一个关键目标，尤其是 [`stream.pipe()`](/zh/nodejs/api/stream#readablepipedestination-options) 方法，是将数据缓冲限制在可接受的水平，这样不同速度的源和目标就不会压垮可用的内存。

`highWaterMark` 选项是一个阈值，而不是一个限制：它决定了流在停止请求更多数据之前缓冲的数据量。 它通常不强制执行严格的内存限制。 特定的流实现可能会选择实施更严格的限制，但这样做是可选的。

因为 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 和 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流既是 `Readable` 又是 `Writable`，所以每个流都维护 *两个* 独立的内部缓冲区，用于读取和写入，允许每一侧独立于另一侧运行，同时保持适当和高效的数据流。 例如，[`net.Socket`](/zh/nodejs/api/net#class-netsocket) 实例是 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流，其 `Readable` 端允许使用 *来自* 套接字的数据，其 `Writable` 端允许将数据写入 *到* 套接字。 因为将数据写入套接字的速度可能快于或慢于接收数据的速度，所以每一侧都应独立于另一侧运行（和缓冲）。

内部缓冲的机制是一个内部实现细节，可以随时更改。 但是，对于某些高级实现，可以使用 `writable.writableBuffer` 或 `readable.readableBuffer` 检索内部缓冲区。 不建议使用这些未记录的属性。


## 用于流消费者的 API {#api-for-stream-consumers}

几乎所有 Node.js 应用程序，无论多么简单，都会以某种方式使用流。以下是在实现 HTTP 服务器的 Node.js 应用程序中使用流的示例：

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` 是一个 http.IncomingMessage，它是一个可读流。
  // `res` 是一个 http.ServerResponse，它是一个可写流。

  let body = '';
  // 以 utf8 字符串获取数据。
  // 如果未设置编码，将收到 Buffer 对象。
  req.setEncoding('utf8');

  // 添加侦听器后，可读流会发出 'data' 事件。
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 'end' 事件表示已收到整个正文。
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // 将一些有趣的东西写回给用户：
      res.write(typeof data);
      res.end();
    } catch (er) {
      // 糟糕！错误的 json！
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```

[`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流（例如示例中的 `res`）公开了 `write()` 和 `end()` 等方法，这些方法用于将数据写入流。

[`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流使用 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) API 来通知应用程序代码何时可以从流中读取数据。 可以通过多种方式从流中读取可用数据。

[`Writable`](/zh/nodejs/api/stream#class-streamwritable) 和 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流都以各种方式使用 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) API 来传达流的当前状态。

[`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 和 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流都是 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 和 [`Readable`](/zh/nodejs/api/stream#class-streamreadable)。

无论是将数据写入流还是从流中消费数据，应用程序都不需要直接实现流接口，并且通常没有理由调用 `require('node:stream')`。

希望实现新型流的开发人员应参阅[用于流实现者的 API](/zh/nodejs/api/stream#api-for-stream-implementers) 部分。


### 可写流 {#writable-streams}

可写流是一种*目的地*的抽象，数据会被写入到该目的地。

[`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流的例子包括：

- [客户端上的 HTTP 请求](/zh/nodejs/api/http#class-httpclientrequest)
- [服务器上的 HTTP 响应](/zh/nodejs/api/http#class-httpserverresponse)
- [fs 写入流](/zh/nodejs/api/fs#class-fswritestream)
- [zlib 流](/zh/nodejs/api/zlib)
- [crypto 流](/zh/nodejs/api/crypto)
- [TCP 套接字](/zh/nodejs/api/net#class-netsocket)
- [子进程 stdin](/zh/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/zh/nodejs/api/process#processstdout)，[`process.stderr`](/zh/nodejs/api/process#processstderr)

其中一些例子实际上是实现了 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 接口的 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流。

所有 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流都实现了由 `stream.Writable` 类定义的接口。

虽然 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流的特定实例可能在各种方面有所不同，但所有 `Writable` 流都遵循与以下示例中所示的相同基本使用模式：

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### 类：`stream.Writable` {#class-streamwritable}

**加入于: v0.9.4**

##### 事件: `'close'` {#event-close}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 添加了 `emitClose` 选项，用于指定是否在销毁时触发 `'close'`。 |
| v0.9.4 | 加入于: v0.9.4 |
:::

当流及其任何底层资源（例如，文件描述符）已关闭时，会触发 `'close'` 事件。 该事件表明不会再触发更多事件，也不会再发生进一步的计算。

如果使用 `emitClose` 选项创建 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流，则它将始终触发 `'close'` 事件。

##### 事件: `'drain'` {#event-drain}

**加入于: v0.9.4**

如果调用 [`stream.write(chunk)`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 返回 `false`，则在适合恢复向流写入数据时，将触发 `'drain'` 事件。

```js [ESM]
// 将数据写入提供的可写流一百万次。
// 注意背压。
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // 最后一次!
        writer.write(data, encoding, callback);
      } else {
        // 查看我们是否应该继续，或者等待。
        // 不要传递回调，因为我们还没有完成。
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // 不得不过早停止!
      // 一旦耗尽，再写一些。
      writer.once('drain', write);
    }
  }
}
```

##### 事件: `'error'` {#event-error}

**加入于: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

如果在写入或管道传输数据时发生错误，则会触发 `'error'` 事件。调用监听器回调时，会传递一个 `Error` 参数。

当触发 `'error'` 事件时，流会关闭，除非在创建流时将 [`autoDestroy`](/zh/nodejs/api/stream#new-streamwritableoptions) 选项设置为 `false`。

在 `'error'` 事件之后，*应该*不再触发其他事件（包括 `'error'` 事件），除了 `'close'`。

##### 事件: `'finish'` {#event-finish}

**加入于: v0.9.4**

当 [`stream.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback) 方法被调用，并且所有数据都已刷新到底层系统后，会触发 `'finish'` 事件。

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### 事件: `'pipe'` {#event-pipe}

**加入于: v0.9.4**

- `src` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) 管道传输到此可写流的源流

当在可读流上调用 [`stream.pipe()`](/zh/nodejs/api/stream#readablepipedestination-options) 方法，将此可写流添加到其目标集合中时，会触发 `'pipe'` 事件。

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### 事件: `'unpipe'` {#event-unpipe}

**加入于: v0.9.4**

- `src` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) [取消管道传输](/zh/nodejs/api/stream#readableunpipedestination) 此可写流的源流

当在 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流上调用 [`stream.unpipe()`](/zh/nodejs/api/stream#readableunpipedestination) 方法，从其目标集合中移除此 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流时，会触发 `'unpipe'` 事件。

如果此 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流在 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流管道传输到它时发出错误，也会触发此事件。

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**新增于: v0.11.2**

`writable.cork()` 方法强制将所有写入的数据缓冲在内存中。当调用 [`stream.uncork()`](/zh/nodejs/api/stream#writableuncork) 或 [`stream.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback) 方法时，缓冲的数据将被刷新。

`writable.cork()` 的主要目的是适应这样一种情况：多个小块以快速连续的方式写入流。`writable.cork()` 不是立即将它们转发到底层目标，而是缓冲所有块，直到调用 `writable.uncork()`，这将把所有块传递给 `writable._writev()`（如果存在）。这可以防止队头阻塞的情况，即在等待处理第一个小块时，数据被缓冲。然而，在不实现 `writable._writev()` 的情况下使用 `writable.cork()` 可能会对吞吐量产生不利影响。

另请参阅：[`writable.uncork()`](/zh/nodejs/api/stream#writableuncork)，[`writable._writev()`](/zh/nodejs/api/stream#writable_writevchunks-callback)。

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 在已销毁的流上作为空操作。 |
| v8.0.0 | 新增于: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 可选，与 `'error'` 事件一起发出的错误。
- 返回: [\<this\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

销毁流。可以选择发出一个 `'error'` 事件，并发出一个 `'close'` 事件（除非 `emitClose` 设置为 `false`）。在此调用之后，可写流已经结束，随后对 `write()` 或 `end()` 的调用将导致 `ERR_STREAM_DESTROYED` 错误。这是一种破坏性的和立即销毁流的方式。先前对 `write()` 的调用可能尚未耗尽，并可能触发 `ERR_STREAM_DESTROYED` 错误。如果数据应在关闭前刷新，请使用 `end()` 代替 destroy，或者在销毁流之前等待 `'drain'` 事件。

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
一旦调用了 `destroy()`，任何进一步的调用都将是空操作，并且除了来自 `_destroy()` 的错误之外，不会发出进一步的 `'error'`。

实现者不应该覆盖此方法，而应该实现 [`writable._destroy()`](/zh/nodejs/api/stream#writable_destroyerr-callback)。


##### `writable.closed` {#writableclosed}

**添加于: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在发出 `'close'` 事件后为 `true`。

##### `writable.destroyed` {#writabledestroyed}

**添加于: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在调用 [`writable.destroy()`](/zh/nodejs/api/stream#writabledestroyerror) 之后为 `true`。

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 参数现在可以是 `TypedArray` 或 `DataView` 实例。 |
| v15.0.0 | `callback` 在 'finish' 之前或出错时调用。 |
| v14.0.0 | 如果发出 'finish' 或 'error'，则调用 `callback`。 |
| v10.0.0 | 此方法现在返回对 `writable` 的引用。 |
| v8.0.0 | `chunk` 参数现在可以是 `Uint8Array` 实例。 |
| v0.9.4 | 添加于: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 可选的要写入的数据。 对于不在对象模式下运行的流，`chunk` 必须是 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)，[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 或 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)。 对于对象模式流，`chunk` 可以是除 `null` 之外的任何 JavaScript 值。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `chunk` 是字符串，则为编码
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 流完成时的回调函数。
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

调用 `writable.end()` 方法表示将不再有数据写入到 [`Writable`](/zh/nodejs/api/stream#class-streamwritable)。 可选的 `chunk` 和 `encoding` 参数允许在关闭流之前立即写入最后一块额外的数据。

在调用 [`stream.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback) 之后调用 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 方法将引发错误。

```js [ESM]
// 写入 'hello, ' 然后以 'world!' 结束。
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// 现在不允许写入更多内容!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.1.0 | 此方法现在返回对 `writable` 的引用。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新的默认编码
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`writable.setDefaultEncoding()` 方法设置 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流的默认 `encoding`。

##### `writable.uncork()` {#writableuncork}

**添加于: v0.11.2**

`writable.uncork()` 方法刷新自调用 [`stream.cork()`](/zh/nodejs/api/stream#writablecork) 以来缓冲的所有数据。

当使用 [`writable.cork()`](/zh/nodejs/api/stream#writablecork) 和 `writable.uncork()` 来管理对流的写入缓冲时，请使用 `process.nextTick()` 延迟对 `writable.uncork()` 的调用。 这样做可以批量处理在给定的 Node.js 事件循环阶段中发生的所有 `writable.write()` 调用。

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
如果 [`writable.cork()`](/zh/nodejs/api/stream#writablecork) 方法在流上被多次调用，则必须调用相同数量的 `writable.uncork()` 才能刷新缓冲的数据。

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // 在第二次调用 uncork() 之前，数据不会被刷新。
  stream.uncork();
});
```
另见：[`writable.cork()`](/zh/nodejs/api/stream#writablecork)。

##### `writable.writable` {#writablewritable}

**添加于: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果调用 [`writable.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 是安全的，则为 `true`，这意味着流尚未被销毁、出错或结束。

##### `writable.writableAborted` {#writablewritableaborted}

**添加于: v18.0.0, v16.17.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

返回流是否在发出 `'finish'` 之前被销毁或出错。


##### `writable.writableEnded` {#writablewritableended}

**新增于: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在 [`writable.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback) 被调用后为 `true`。 此属性不指示数据是否已被刷新，为此请使用 [`writable.writableFinished`](/zh/nodejs/api/stream#writablewritablefinished) 代替。

##### `writable.writableCorked` {#writablewritablecorked}

**新增于: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

为了完全解除流的阻塞状态，需要调用 [`writable.uncork()`](/zh/nodejs/api/stream#writableuncork) 的次数。

##### `writable.errored` {#writableerrored}

**新增于: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

如果流已因错误而被销毁，则返回错误。

##### `writable.writableFinished` {#writablewritablefinished}

**新增于: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在发出 [`'finish'`](/zh/nodejs/api/stream#event-finish) 事件之前立即设置为 `true`。

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**新增于: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回创建此 `Writable` 时传递的 `highWaterMark` 的值。

##### `writable.writableLength` {#writablewritablelength}

**新增于: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性包含队列中准备写入的字节数（或对象数）。 该值提供了有关 `highWaterMark` 状态的内省数据。

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**新增于: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果流的缓冲区已满，并且流将发出 `'drain'`，则为 `true`。


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**新增于: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

获取给定 `Writable` 流的 `objectMode` 属性的 getter。

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**新增于: v22.4.0, v20.16.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

使用 `AbortError` 调用 [`writable.destroy()`](/zh/nodejs/api/stream#writabledestroyerror) 并返回一个 Promise，该 Promise 在流完成时实现。

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 参数现在可以是 `TypedArray` 或 `DataView` 实例。 |
| v8.0.0 | `chunk` 参数现在可以是 `Uint8Array` 实例。 |
| v6.0.0 | 即使在对象模式下，将 `null` 作为 `chunk` 参数传递也将始终被视为无效。 |
| v0.9.4 | 新增于: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 可选的要写入的数据。 对于不在对象模式下运行的流，`chunk` 必须是 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 或 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)。 对于对象模式流，`chunk` 可以是 `null` 之外的任何 JavaScript 值。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 如果 `chunk` 是字符串，则为编码。 **默认:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当此数据块被刷新时执行的回调。
- 返回值: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果在允许 `chunk` 之后，内部缓冲区小于创建流时配置的 `highWaterMark`，则为 `false`，表示流希望调用代码在继续写入其他数据之前等待发出 `'drain'` 事件； 否则为 `true`。

`writable.write()` 方法将一些数据写入流，并在数据被完全处理后调用提供的 `callback`。 如果发生错误，将调用 `callback` 并将错误作为其第一个参数。 `callback` 是异步调用的，并在发出 `'error'` 之前调用。

如果内部缓冲区小于创建流时配置的 `highWaterMark` 并且已经接受了 `chunk`，则返回值为 `true`。 如果返回 `false`，则应停止进一步尝试向流写入数据，直到发出 [`'drain'`](/zh/nodejs/api/stream#event-drain) 事件。

当流未排空时，调用 `write()` 将缓冲 `chunk` 并返回 false。 一旦所有当前缓冲的块都被排空（被操作系统接受以进行传递），将发出 `'drain'` 事件。 一旦 `write()` 返回 false，在发出 `'drain'` 事件之前，不要写入更多的块。 虽然允许在未排空的流上调用 `write()`，但 Node.js 将缓冲所有写入的块，直到达到最大内存使用量，此时它将无条件中止。 即使在中止之前，高内存使用率也会导致较差的垃圾收集器性能和高 RSS（即使在不再需要内存之后，通常也不会将其释放回系统）。 由于如果远程对等方不读取数据，TCP 套接字可能永远不会排空，因此写入未排空的套接字可能会导致可远程利用的漏洞。

当流未排空时写入数据对于 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 来说尤其成问题，因为 `Transform` 流默认情况下处于暂停状态，直到它们被管道连接或添加了 `'data'` 或 `'readable'` 事件处理程序。

如果要写入的数据可以按需生成或获取，建议将逻辑封装到 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 中，并使用 [`stream.pipe()`](/zh/nodejs/api/stream#readablepipedestination-options)。 但是，如果首选调用 `write()`，则可以使用 [`'drain'`](/zh/nodejs/api/stream#event-drain) 事件来遵守反压并避免内存问题：

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// 等待 cb 被调用之后再进行任何其他写入。
write('hello', () => {
  console.log('写入完成，现在进行更多写入。');
});
```
对象模式下的 `Writable` 流将始终忽略 `encoding` 参数。


### 可读流 {#readable-streams}

可读流是数据被消费的*源*的抽象。

`Readable` 流的例子包括：

- [客户端上的 HTTP 响应](/zh/nodejs/api/http#class-httpincomingmessage)
- [服务器上的 HTTP 请求](/zh/nodejs/api/http#class-httpincomingmessage)
- [fs 读取流](/zh/nodejs/api/fs#class-fsreadstream)
- [zlib 流](/zh/nodejs/api/zlib)
- [crypto 流](/zh/nodejs/api/crypto)
- [TCP 套接字](/zh/nodejs/api/net#class-netsocket)
- [子进程 stdout 和 stderr](/zh/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/zh/nodejs/api/process#processstdin)

所有 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流都实现了由 `stream.Readable` 类定义的接口。

#### 两种读取模式 {#two-reading-modes}

`Readable` 流实际上在两种模式之一中运行：流动模式和暂停模式。这些模式与[对象模式](/zh/nodejs/api/stream#object-mode)分离。一个 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流可以处于对象模式或不处于对象模式，无论它处于流动模式还是暂停模式。

- 在流动模式下，数据从底层系统自动读取，并使用 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 接口通过事件尽可能快地提供给应用程序。
- 在暂停模式下，必须显式调用 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 方法才能从流中读取数据块。

所有 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流都以暂停模式开始，但可以通过以下方式之一切换到流动模式：

- 添加一个 [`'data'`](/zh/nodejs/api/stream#event-data) 事件处理程序。
- 调用 [`stream.resume()`](/zh/nodejs/api/stream#readableresume) 方法。
- 调用 [`stream.pipe()`](/zh/nodejs/api/stream#readablepipedestination-options) 方法将数据发送到 [`Writable`](/zh/nodejs/api/stream#class-streamwritable)。

可以使用以下方法之一将 `Readable` 切换回暂停模式：

- 如果没有管道目标，则调用 [`stream.pause()`](/zh/nodejs/api/stream#readablepause) 方法。
- 如果有管道目标，则删除所有管道目标。可以通过调用 [`stream.unpipe()`](/zh/nodejs/api/stream#readableunpipedestination) 方法删除多个管道目标。

要记住的重要概念是，`Readable` 在提供用于消耗或忽略该数据的机制之前，不会生成数据。如果禁用或删除消耗机制，`Readable` 将*尝试*停止生成数据。

出于向后兼容的原因，删除 [`'data'`](/zh/nodejs/api/stream#event-data) 事件处理程序**不会**自动暂停流。此外，如果存在管道目标，则调用 [`stream.pause()`](/zh/nodejs/api/stream#readablepause) 不能保证一旦这些目标耗尽并请求更多数据，流将*保持*暂停状态。

如果将 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 切换到流动模式，并且没有可用的消费者来处理数据，则该数据将丢失。例如，当在没有附加到 `'data'` 事件的侦听器的情况下调用 `readable.resume()` 方法时，或者当从流中删除 `'data'` 事件处理程序时，可能会发生这种情况。

添加 [`'readable'`](/zh/nodejs/api/stream#event-readable) 事件处理程序会自动使流停止流动，并且必须通过 [`readable.read()`](/zh/nodejs/api/stream#readablereadsize) 消耗数据。如果删除了 [`'readable'`](/zh/nodejs/api/stream#event-readable) 事件处理程序，那么如果存在 [`'data'`](/zh/nodejs/api/stream#event-data) 事件处理程序，流将再次开始流动。


#### 三种状态 {#three-states}

`Readable` 流的“两种模式”是对 `Readable` 流实现内部发生的更复杂状态管理的简化抽象。

具体来说，在任何给定的时间点，每个 `Readable` 流都处于以下三种可能状态之一：

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

当 `readable.readableFlowing` 为 `null` 时，没有提供消费流数据的机制。因此，流不会生成数据。在此状态下，附加 `'data'` 事件的监听器、调用 `readable.pipe()` 方法或调用 `readable.resume()` 方法会将 `readable.readableFlowing` 切换为 `true`，从而使 `Readable` 开始在生成数据时主动发出事件。

调用 `readable.pause()`、`readable.unpipe()` 或接收到背压会导致 `readable.readableFlowing` 设置为 `false`，从而暂时停止事件的流动，但 *不会* 停止数据的生成。在此状态下，附加 `'data'` 事件的监听器不会将 `readable.readableFlowing` 切换为 `true`。

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing 现在是 false。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing 仍然是 false。
pass.write('ok');  // 不会发出 'data'。
pass.resume();     // 必须调用才能使流发出 'data'。
// readableFlowing 现在是 true。
```

当 `readable.readableFlowing` 为 `false` 时，数据可能会在流的内部缓冲区中累积。

#### 选择一种 API 风格 {#choose-one-api-style}

`Readable` 流 API 在多个 Node.js 版本中不断发展，并提供了多种消费流数据的方法。一般来说，开发人员应该选择 *一种* 消费数据的方法，*并且绝不应该* 使用多种方法来消费来自单个流的数据。具体来说，使用 `on('data')`、`on('readable')`、`pipe()` 或异步迭代器的组合可能会导致违反直觉的行为。


#### 类: `stream.Readable` {#class-streamreadable}

**添加于: v0.9.4**

##### 事件: `'close'` {#event-close_1}


::: info [历史]
| 版本    | 更改                                                                |
| ------- | ------------------------------------------------------------------- |
| v10.0.0 | 添加 `emitClose` 选项以指定是否在销毁时触发 `'close'`。          |
| v0.9.4  | 添加于: v0.9.4                                                     |
:::

当流及其任何底层资源（例如，文件描述符）已关闭时，将触发 `'close'` 事件。 该事件表明不会再触发任何事件，也不会再发生任何计算。

如果使用 `emitClose` 选项创建了 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流，它将始终触发 `'close'` 事件。

##### 事件: `'data'` {#event-data}

**添加于: v0.9.4**

- `chunk` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 数据块。 对于不在对象模式下运行的流，块将是字符串或 `Buffer`。 对于处于对象模式的流，块可以是除 `null` 之外的任何 JavaScript 值。

每当流将数据块的所有权放弃给消费者时，都会触发 `'data'` 事件。 当通过调用 `readable.pipe()`、`readable.resume()` 或通过将侦听器回调附加到 `'data'` 事件来将流切换到流动模式时，可能会发生这种情况。 每当调用 `readable.read()` 方法并且有可用的数据块要返回时，也会触发 `'data'` 事件。

将 `'data'` 事件侦听器附加到未显式暂停的流会将流切换到流动模式。 然后，数据将在可用时立即传递。

如果使用 `readable.setEncoding()` 方法为流指定了默认编码，则侦听器回调将作为字符串传递数据块； 否则，数据将作为 `Buffer` 传递。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Event: `'end'` {#event-end}

**Added in: v0.9.4**

当流中没有更多数据可供消费时，会触发 `'end'` 事件。

**除非数据被完全消费，否则不会触发 `'end'` 事件。** 这可以通过将流切换到流动模式，或者重复调用 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 直到所有数据都被消费来实现。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```
##### Event: `'error'` {#event-error_1}

**Added in: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`Readable` 实现可以在任何时候触发 `'error'` 事件。通常，如果底层流由于底层内部故障而无法生成数据，或者当流实现尝试推送无效的数据块时，可能会发生这种情况。

监听器回调将传递一个 `Error` 对象。

##### Event: `'pause'` {#event-pause}

**Added in: v0.9.4**

当调用 [`stream.pause()`](/zh/nodejs/api/stream#readablepause) 且 `readableFlowing` 不是 `false` 时，会触发 `'pause'` 事件。

##### Event: `'readable'` {#event-readable}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | 调用 `.push()` 后，`'readable'` 总是会在下一个 tick 中触发。 |
| v10.0.0 | 使用 `'readable'` 需要调用 `.read()`。 |
| v0.9.4 | Added in: v0.9.4 |
:::

当有数据可以从流中读取时，最多可以读取到配置的高水位线（`state.highWaterMark`），此时会触发 `'readable'` 事件。 实际上，它表明流的缓冲区中有新信息。 如果此缓冲区中有可用数据，则可以调用 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 来检索该数据。 此外，当到达流的末尾时，也可能会触发 `'readable'` 事件。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // 现在有一些数据可以读取。
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
如果已到达流的末尾，则调用 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 将返回 `null` 并触发 `'end'` 事件。 如果从来没有任何数据可读，情况也是如此。 例如，在以下示例中，`foo.txt` 是一个空文件：

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
运行此脚本的输出是：

```bash [BASH]
$ node test.js
readable: null
end
```
在某些情况下，附加 `'readable'` 事件的监听器会导致将一些数据读取到内部缓冲区中。

一般来说，`readable.pipe()` 和 `'data'` 事件机制比 `'readable'` 事件更容易理解。 但是，处理 `'readable'` 可能会提高吞吐量。

如果同时使用 `'readable'` 和 [`'data'`](/zh/nodejs/api/stream#event-data)，则 `'readable'` 在控制流方面优先，即只有在调用 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 时才会触发 `'data'`。 `readableFlowing` 属性将变为 `false`。 如果在删除 `'readable'` 时存在 `'data'` 监听器，则流将开始流动，即会在不调用 `.resume()` 的情况下触发 `'data'` 事件。


##### 事件: `'resume'` {#event-resume}

**加入于: v0.9.4**

当调用 [`stream.resume()`](/zh/nodejs/api/stream#readableresume) 且 `readableFlowing` 不是 `true` 时，会触发 `'resume'` 事件。

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 在已经销毁的流上作为空操作。 |
| v8.0.0 | 加入于: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 错误，将在 `'error'` 事件中作为有效负载传递
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

销毁流。 可选地触发一个 `'error'` 事件，并触发一个 `'close'` 事件（除非 `emitClose` 设置为 `false`）。 在此调用之后，可读流将释放任何内部资源，并且后续对 `push()` 的调用将被忽略。

一旦 `destroy()` 被调用，任何进一步的调用都将是一个空操作，并且除了来自 `_destroy()` 的错误之外，不会再有 `'error'` 事件被触发。

实现者不应覆盖此方法，而应实现 [`readable._destroy()`](/zh/nodejs/api/stream#readable_destroyerr-callback)。

##### `readable.closed` {#readableclosed}

**加入于: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在 `'close'` 事件触发后为 `true`。

##### `readable.destroyed` {#readabledestroyed}

**加入于: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

在 [`readable.destroy()`](/zh/nodejs/api/stream#readabledestroyerror) 被调用后为 `true`。

##### `readable.isPaused()` {#readableispaused}

**加入于: v0.11.14**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`readable.isPaused()` 方法返回 `Readable` 的当前操作状态。 这主要由 `readable.pipe()` 方法的基础机制使用。 在大多数典型情况下，没有理由直接使用此方法。

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**Added in: v0.9.4**

- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.pause()` 方法会导致流动模式下的流停止发出 [`'data'`](/zh/nodejs/api/stream#event-data) 事件，从而退出流动模式。任何可用的数据都将保留在内部缓冲区中。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```
如果存在 `'readable'` 事件监听器，则 `readable.pause()` 方法无效。

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Added in: v0.9.4**

- `destination` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) 用于写入数据的目标
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 管道选项
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当读取器结束时结束写入器。**默认值:** `true`。
  
 
- 返回: [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) *destination*，如果它是一个 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 或一个 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流，则允许管道链

`readable.pipe()` 方法将一个 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流附加到 `readable`，导致它自动切换到流动模式并将它的所有数据推送到附加的 [`Writable`](/zh/nodejs/api/stream#class-streamwritable)。数据流将被自动管理，以便目标 `Writable` 流不会被更快的 `Readable` 流淹没。

以下示例将来自 `readable` 的所有数据管道化到一个名为 `file.txt` 的文件中：

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```
可以将多个 `Writable` 流附加到单个 `Readable` 流。

`readable.pipe()` 方法返回对 *destination* 流的引用，从而可以设置管道流链：

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
默认情况下，当源 `Readable` 流发出 [`'end'`](/zh/nodejs/api/stream#event-end) 时，将在目标 `Writable` 流上调用 [`stream.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback)，以便目的地不再可写。要禁用此默认行为，可以将 `end` 选项作为 `false` 传递，从而使目标流保持打开状态：

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
一个重要的注意事项是，如果在处理过程中 `Readable` 流发出错误，则 `Writable` 目标*不会自动关闭*。 如果发生错误，将需要*手动*关闭每个流以防止内存泄漏。

无论指定的选项如何，[`process.stderr`](/zh/nodejs/api/process#processstderr) 和 [`process.stdout`](/zh/nodejs/api/process#processstdout) `Writable` 流都不会关闭，直到 Node.js 进程退出。


##### `readable.read([size])` {#readablereadsize}

**Added in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可选参数，用于指定要读取的数据量。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`readable.read()` 方法从内部缓冲区读取数据并返回。 如果没有可读取的数据，则返回 `null`。 默认情况下，除非使用 `readable.setEncoding()` 方法指定了编码，或者流以对象模式运行，否则数据将作为 `Buffer` 对象返回。

可选的 `size` 参数指定要读取的特定字节数。 如果没有 `size` 字节可供读取，则返回 `null` *除非* 流已结束，在这种情况下，将返回内部缓冲区中剩余的所有数据。

如果未指定 `size` 参数，则将返回内部缓冲区中包含的所有数据。

`size` 参数必须小于或等于 1 GiB。

`readable.read()` 方法只能在以暂停模式运行的 `Readable` 流上调用。 在流动模式下，会自动调用 `readable.read()`，直到内部缓冲区完全耗尽。

```js [ESM]
const readable = getReadableStreamSomehow();

// 当数据在缓冲区中缓冲时，可能会多次触发 'readable'
readable.on('readable', () => {
  let chunk;
  console.log('流是可读的（缓冲区中收到新数据）');
  // 使用循环确保我们读取所有当前可用的数据
  while (null !== (chunk = readable.read())) {
    console.log(`读取了 ${chunk.length} 字节的数据...`);
  }
});

// 当没有更多数据可用时，'end' 将被触发一次
readable.on('end', () => {
  console.log('到达流的末尾。');
});
```
每次调用 `readable.read()` 都会返回一个数据块或 `null`，表示此时没有更多数据可读。 这些数据块不会自动连接。 因为单个 `read()` 调用不会返回所有数据，所以可能需要使用 while 循环来持续读取数据块，直到检索到所有数据。 读取大型文件时，`.read()` 可能会暂时返回 `null`，表明它已消耗所有缓冲的内容，但可能还有更多数据需要缓冲。 在这种情况下，一旦缓冲区中有更多数据，就会发出新的 `'readable'` 事件，而 `'end'` 事件表示数据传输的结束。

因此，要从 `readable` 读取文件的全部内容，需要跨多个 `'readable'` 事件收集数据块：

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```

无论 `size` 参数的值如何，对象模式下的 `Readable` 流将始终从调用 [`readable.read(size)`](/zh/nodejs/api/stream#readablereadsize) 返回单个项。

如果 `readable.read()` 方法返回一个数据块，也会发出一个 `'data'` 事件。

在发出 [`'end'`](/zh/nodejs/api/stream#event-end) 事件后调用 [`stream.read([size])`](/zh/nodejs/api/stream#readablereadsize) 将返回 `null`。 不会引发运行时错误。


##### `readable.readable` {#readablereadable}

**加入于: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果调用 [`readable.read()`](/zh/nodejs/api/stream#readablereadsize) 是安全的，则为 `true`，这意味着流尚未被销毁或发出 `'error'` 或 `'end'`。

##### `readable.readableAborted` {#readablereadableaborted}

**加入于: v16.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

返回流是否在发出 `'end'` 之前被销毁或出错。

##### `readable.readableDidRead` {#readablereadabledidread}

**加入于: v16.7.0, v14.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

返回是否已发出 `'data'`。

##### `readable.readableEncoding` {#readablereadableencoding}

**加入于: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

给定 `Readable` 流的属性 `encoding` 的 getter。 `encoding` 属性可以使用 [`readable.setEncoding()`](/zh/nodejs/api/stream#readablesetencodingencoding) 方法设置。

##### `readable.readableEnded` {#readablereadableended}

**加入于: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

当发出 [`'end'`](/zh/nodejs/api/stream#event-end) 事件时变为 `true`。

##### `readable.errored` {#readableerrored}

**加入于: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

如果流已因错误而被销毁，则返回错误。

##### `readable.readableFlowing` {#readablereadableflowing}

**加入于: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

此属性反映了 `Readable` 流的当前状态，如[三种状态](/zh/nodejs/api/stream#three-states)部分中所述。


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**添加于: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回创建此 `Readable` 时传递的 `highWaterMark` 的值。

##### `readable.readableLength` {#readablereadablelength}

**添加于: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性包含队列中准备好读取的字节（或对象）的数量。 该值提供有关 `highWaterMark` 状态的自检数据。

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**添加于: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

给定 `Readable` 流的属性 `objectMode` 的 getter。

##### `readable.resume()` {#readableresume}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v10.0.0 | 如果有 `'readable'` 事件监听器，则 `resume()` 无效。 |
| v0.9.4 | 添加于: v0.9.4 |
:::

- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.resume()` 方法使显式暂停的 `Readable` 流恢复发出 [`'data'`](/zh/nodejs/api/stream#event-data) 事件，从而将流切换到流动模式。

`readable.resume()` 方法可用于完全消耗流中的数据，而无需实际处理任何这些数据：

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('到达末尾，但没有读取任何内容。');
  });
```
如果存在 `'readable'` 事件监听器，则 `readable.resume()` 方法无效。

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**添加于: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的编码。
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.setEncoding()` 方法设置从 `Readable` 流读取的数据的字符编码。

默认情况下，未分配编码，并且流数据将作为 `Buffer` 对象返回。 设置编码会导致流数据作为指定编码的字符串而不是作为 `Buffer` 对象返回。 例如，调用 `readable.setEncoding('utf8')` 将导致输出数据被解释为 UTF-8 数据，并作为字符串传递。 调用 `readable.setEncoding('hex')` 将导致数据以十六进制字符串格式编码。

`Readable` 流将正确处理通过流传递的多字节字符，否则如果仅从流中作为 `Buffer` 对象拉取这些字符，则这些字符将被不正确地解码。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('获得了 %d 个字符串数据字符：', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**加入于: v0.9.4**

- `destination` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable) 可选的要取消连接的特定流
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.unpipe()` 方法会分离先前使用 [`stream.pipe()`](/zh/nodejs/api/stream#readablepipedestination-options) 方法连接的 `Writable` 流。

如果未指定 `destination`，则会分离*所有*管道。

如果指定了 `destination`，但未为其设置管道，则该方法不执行任何操作。

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// 来自 readable 的所有数据都进入 'file.txt'，
// 但仅限第一秒。
readable.pipe(writable);
setTimeout(() => {
  console.log('停止写入 file.txt。');
  readable.unpipe(writable);
  console.log('手动关闭文件流。');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 参数现在可以是 `TypedArray` 或 `DataView` 实例。 |
| v8.0.0 | `chunk` 参数现在可以是 `Uint8Array` 实例。 |
| v0.9.11 | 加入于: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要取消移入读取队列的数据块。 对于未在对象模式下运行的流，`chunk` 必须是 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 或 `null`。 对于对象模式流，`chunk` 可以是任何 JavaScript 值。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串块的编码。 必须是有效的 `Buffer` 编码，例如 `'utf8'` 或 `'ascii'`。

将 `chunk` 作为 `null` 传递表示流的结束（EOF），并且其行为与 `readable.push(null)` 相同，之后不能再写入更多数据。 EOF 信号置于缓冲区的末尾，任何缓冲的数据仍将被刷新。

`readable.unshift()` 方法将数据块推回内部缓冲区。 这在某些情况下很有用，在这些情况下，流正被需要“取消消耗”它已乐观地从源中提取的某些数据量的代码消耗，以便可以将数据传递给其他方。

在发出 [`'end'`](/zh/nodejs/api/stream#event-end) 事件后不能调用 `stream.unshift(chunk)` 方法，否则会引发运行时错误。

使用 `stream.unshift()` 的开发者通常应考虑切换到使用 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流。 有关更多信息，请参见 [流实现者的 API](/zh/nodejs/api/stream#api-for-stream-implementers) 部分。

```js [ESM]
// 拉出以 \n\n 分隔的标头。
// 如果我们得到太多，请使用 unshift()。
// 使用 (error, header, stream) 调用回调。
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // 找到标头边界。
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // 在取消移入之前移除 'readable' 监听器。
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // 现在可以从流中读取消息的正文。
        callback(null, header, stream);
        return;
      }
      // 仍在读取标头。
      header += str;
    }
  }
}
```
与 [`stream.push(chunk)`](/zh/nodejs/api/stream#readablepushchunk-encoding) 不同，`stream.unshift(chunk)` 不会通过重置流的内部读取状态来结束读取过程。 如果在读取期间（即从自定义流上的 [`stream._read()`](/zh/nodejs/api/stream#readable_readsize) 实现中）调用 `readable.unshift()`，这可能会导致意外的结果。 在调用 `readable.unshift()` 之后立即调用 [`stream.push('')`](/zh/nodejs/api/stream#readablepushchunk-encoding) 将适当地重置读取状态，但是最好在执行读取的过程中避免调用 `readable.unshift()`。


##### `readable.wrap(stream)` {#readablewrapstream}

**新增于: v0.9.4**

- `stream` [\<Stream\>](/zh/nodejs/api/stream#stream) 一个“老式”可读流
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

在 Node.js 0.10 之前，流没有实现整个 `node:stream` 模块 API，因为它目前已被定义。（有关更多信息，请参阅[兼容性](/zh/nodejs/api/stream#compatibility-with-older-nodejs-versions)）。

当使用一个较旧的 Node.js 库，该库会触发 [`'data'`](/zh/nodejs/api/stream#event-data) 事件，并且有一个 [`stream.pause()`](/zh/nodejs/api/stream#readablepause) 方法，该方法仅作建议时，`readable.wrap()` 方法可用于创建一个 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流，该流使用旧流作为其数据源。

很少需要使用 `readable.wrap()`，但为了方便与旧的 Node.js 应用程序和库进行交互，提供了该方法。

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // 等等。
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.14.0 | 对 Symbol.asyncIterator 的支持不再是实验性的。 |
| v10.0.0 | 新增于: v10.0.0 |
:::

- 返回: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) 以完全消耗该流。

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
如果循环以 `break`、`return` 或 `throw` 终止，则该流将被销毁。 换句话说，迭代一个流将完全消耗该流。 将以等于 `highWaterMark` 选项的大小的块读取流。 在上面的代码示例中，如果文件具有少于 64 KiB 的数据，则数据将位于单个块中，因为没有为 [`fs.createReadStream()`](/zh/nodejs/api/fs#fscreatereadstreampath-options) 提供 `highWaterMark` 选项。


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**添加于: v20.4.0, v18.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

使用 `AbortError` 调用 [`readable.destroy()`](/zh/nodejs/api/stream#readabledestroyerror) 并返回一个 Promise，该 Promise 在流完成后兑现。

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**添加于: v19.1.0, v18.13.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `stream` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。
  
 
- 返回: [\<Duplex\>](/zh/nodejs/api/stream#class-streamduplex) 一个与流 `stream` 组合的流。

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['this', 'is', 'compose', 'as', 'operator']
```
有关更多信息，请参阅 [`stream.compose`](/zh/nodejs/api/stream#streamcomposestreams)。

##### `readable.iterator([options])` {#readableiteratoroptions}

**添加于: v16.3.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当设置为 `false` 时，调用异步迭代器的 `return`，或使用 `break`、`return` 或 `throw` 退出 `for await...of` 迭代将不会销毁流。 **默认值:** `true`。
  
 
- 返回: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) 用于消费流的异步迭代器。

由此方法创建的迭代器让用户可以选择取消流的销毁，如果 `for await...of` 循环由 `return`、`break` 或 `throw` 退出，或者如果流在迭代期间发出错误，则迭代器应该销毁流。

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.7.0, v18.19.0 | 在选项中添加了 `highWaterMark`。 |
| v17.4.0, v16.14.0 | 添加于：v17.4.0, v16.14.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个函数，用于映射流中的每个块。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的数据块。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁，则中止，允许提前中止 `fn` 调用。




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一次在流上调用的 `fn` 的最大并发调用次数。**默认值:** `1`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在等待用户消费映射项时，要缓冲多少项。**默认值:** `concurrency * 2 - 1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。


- 返回: [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) 使用函数 `fn` 映射的流。

此方法允许映射流。 将为流中的每个块调用 `fn` 函数。 如果 `fn` 函数返回一个 promise，则该 promise 将在传递到结果流之前被 `await`。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 使用同步映射器。
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// 使用异步映射器，一次最多进行 2 个查询。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // 记录 resolver.resolve4 的 DNS 结果。
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.7.0, v18.19.0 | 在选项中添加了 `highWaterMark`。 |
| v17.4.0, v16.14.0 | 添加于: v17.4.0, v16.14.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个函数，用于从流中过滤块。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的一块数据。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁，则中止，允许提前中止 `fn` 调用。




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一次对流调用 `fn` 的最大并发调用次数。 **默认值:** `1`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在等待用户消费过滤后的条目时要缓冲多少条目。 **默认值:** `concurrency * 2 - 1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果信号中止，则允许销毁流。


- 返回: [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) 使用谓词 `fn` 过滤的流。

此方法允许过滤流。 对于流中的每个块，将调用 `fn` 函数，如果它返回真值，则该块将传递到结果流。 如果 `fn` 函数返回一个 promise - 该 promise 将被 `await`。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 使用同步谓词。
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 使用异步谓词，一次最多进行 2 个查询。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // 记录已解析 DNS 记录上超过 60 秒的域名。
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**添加于: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个在流的每个块上调用的函数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的数据块。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁则中止，允许提前中止 `fn` 调用。




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一次在流上调用的 `fn` 的最大并发调用次数。 **默认值:** `1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 流完成时的 Promise。

此方法允许迭代流。 对于流中的每个块，将调用 `fn` 函数。 如果 `fn` 函数返回一个 Promise - 该 Promise 将被 `await`。

此方法与 `for await...of` 循环的不同之处在于它可以选择并发处理块。 此外，`forEach` 迭代只能通过传递 `signal` 选项并中止相关的 `AbortController` 来停止，而 `for await...of` 可以用 `break` 或 `return` 停止。 在任何一种情况下，流都将被销毁。

此方法与监听 [`'data'`](/zh/nodejs/api/stream#event-data) 事件的不同之处在于，它在底层机制中使用 [`readable`](/zh/nodejs/api/stream#class-streamreadable) 事件，并且可以限制并发 `fn` 调用的数量。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 使用同步谓词。
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 使用异步谓词，一次最多进行 2 个查询。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // 记录结果，类似于 `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // 流已完成
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**添加于: v17.5.0, v16.15.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时取消 toArray 操作。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个包含流内容的数组的 Promise。

此方法允许轻松获取流的内容。

由于此方法将整个流读取到内存中，因此它否定了流的优势。它旨在用于互操作性和便利性，而不是作为使用流的主要方式。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// 使用 .map 并发地进行 DNS 查询，并使用 toArray 将结果收集到数组中
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**添加于: v17.5.0, v16.15.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个在流的每个块上调用的函数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的一块数据。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁则中止，允许提前中止 `fn` 调用。
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要在流上同时调用的 `fn` 的最大并发调用次数。**默认值:** `1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 如果 `fn` 为至少一个块返回真值，则 Promise 的计算结果为 `true`。

此方法类似于 `Array.prototype.some`，并在流中的每个块上调用 `fn`，直到等待的返回值是 `true`（或任何真值）。一旦对块的 `fn` 调用等待的返回值是真值，流将被销毁，并且 Promise 将以 `true` 履行。如果对块的 `fn` 调用都没有返回真值，则 Promise 将以 `false` 履行。

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 使用同步谓词。
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// 使用异步谓词，一次最多进行 2 次文件检查。
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // 如果列表中的任何文件大于 1MB，则为 `true`
console.log('done'); // 流已完成
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**添加于: v17.5.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 对流的每个块调用的函数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的一个数据块。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁，则中止，允许提前中止 `fn` 调用。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一次对流调用的 `fn` 的最大并发调用次数。 **默认:** `1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个 promise，解析为 `fn` 评估为真值的第一个块；如果未找到任何元素，则解析为 `undefined`。

此方法类似于 `Array.prototype.find`，并在流中的每个块上调用 `fn`，以查找 `fn` 的真值的块。 一旦 `fn` 调用的等待返回值是真值，流就会被销毁，并且 promise 会以 `fn` 返回真值的值来完成。 如果所有块上的 `fn` 调用都返回一个假值，则 promise 会以 `undefined` 来完成。

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 具有同步谓词。
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// 具有异步谓词，一次最多进行 2 次文件检查。
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // 大文件的文件名，如果列表中的任何文件大于 1MB
console.log('done'); // 流已完成
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**新增于: v17.5.0, v16.15.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个在流的每个块上调用的函数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的数据块。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁，则中止，允许提前中止 `fn` 调用。
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一次在流上调用 `fn` 的最大并发调用次数。**默认:** `1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 如果 `fn` 为所有块返回真值，则 promise 的计算结果为 `true`。

此方法类似于 `Array.prototype.every`，并在流中的每个块上调用 `fn`，以检查所有等待的返回值对于 `fn` 是否为真值。一旦对块的 `fn` 调用等待的返回值是假值，流将被销毁，并且 promise 将以 `false` 完成。如果块上的所有 `fn` 调用都返回真值，则 promise 将以 `true` 完成。

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 使用同步谓词。
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// 使用异步谓词，一次最多进行 2 个文件检查。
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// 如果列表中的所有文件都大于 1MiB，则为 `true`
console.log(allBigFiles);
console.log('done'); // 流已完成
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 用于映射流中每个块的函数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的一块数据。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁，则中止，允许提前中止 `fn` 调用。




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一次在流上调用 `fn` 的最大并发调用数。 **默认值:** `1`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。


- 返回: [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) 一个使用函数 `fn` 进行扁平映射的流。

此方法通过将给定的回调应用于流的每个块，然后展平结果来返回一个新流。

可以从 `fn` 返回一个流或另一个可迭代对象或异步可迭代对象，并且结果流将被合并（展平）到返回的流中。

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// 使用同步映射器。
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// 使用异步映射器，合并 4 个文件的内容
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // 这将包含所有 4 个文件的内容（所有块）
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**新增于: v17.5.0, v16.15.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要从可读流中删除的块的数量。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。


- 返回: [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) 删除 `limit` 个块后的流。

此方法返回一个新流，其中删除了前 `limit` 个块。

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**新增于: v17.5.0, v16.15.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要从可读流中获取的块的数量。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。


- 返回: [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) 获取 `limit` 个块后的流。

此方法返回一个新流，其中包含前 `limit` 个块。

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**新增于: v17.5.0, v16.15.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 一个 reducer 函数，用于在流中的每个块上调用。
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 从上次调用 `fn` 获得的值，如果指定了 `initial` 值，则为该值，否则为流的第一个块。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自流的一个数据块。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 如果流被销毁，则中止，允许提前中止 `fn` 调用。



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 在归约中使用的初始值。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许在信号中止时销毁流。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个 promise，用于归约的最终值。

此方法按顺序在流的每个块上调用 `fn`，并传递前一个元素计算的结果。 它返回一个 promise，用于归约的最终值。

如果没有提供 `initial` 值，则流的第一个块将用作初始值。 如果流为空，则 promise 将被拒绝，并显示一个带有 `ERR_INVALID_ARGS` 代码属性的 `TypeError`。

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
reducer 函数迭代流元素，这意味着没有 `concurrency` 参数或并行性。 要并发地执行 `reduce`，您可以将异步函数提取到 [`readable.map`](/zh/nodejs/api/stream#readablemapfn-options) 方法。

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Duplex 和转换流 {#duplex-and-transform-streams}

#### 类：`stream.Duplex` {#class-streamduplex}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.8.0 | 现在当检查 `instanceof stream.Writable` 时，`Duplex` 的实例会返回 `true`。 |
| v0.9.4 | 添加于: v0.9.4 |
:::

Duplex 流是同时实现了 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 和 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 接口的流。

`Duplex` 流的示例包括：

- [TCP 套接字](/zh/nodejs/api/net#class-netsocket)
- [zlib 流](/zh/nodejs/api/zlib)
- [crypto 流](/zh/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**添加于: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 `false`，则当可读端结束时，流将自动结束可写端。 最初由 `allowHalfOpen` 构造函数选项设置，默认为 `true`。

可以手动更改此设置以更改现有 `Duplex` 流实例的半开行为，但必须在发出 `'end'` 事件之前进行更改。

#### 类：`stream.Transform` {#class-streamtransform}

**添加于: v0.9.4**

转换流是 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流，其中输出在某种程度上与输入相关。 像所有 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流一样，`Transform` 流实现了 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 和 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 接口。

`Transform` 流的示例包括：

- [zlib 流](/zh/nodejs/api/zlib)
- [crypto 流](/zh/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 在已经销毁的流上作为空操作。 |
| v8.0.0 | 添加于: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- 返回: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

销毁流，并可以选择发出 `'error'` 事件。 在调用此方法之后，转换流将释放任何内部资源。 实现者不应覆盖此方法，而应实现 [`readable._destroy()`](/zh/nodejs/api/stream#readable_destroyerr-callback)。 `Transform` 的 `_destroy()` 的默认实现也会发出 `'close'`，除非 `emitClose` 设置为 false。

一旦调用了 `destroy()`，任何进一步的调用都将是空操作，并且除了 `_destroy()` 之外，不会再发出任何错误作为 `'error'`。


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**新增于: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 传递给两个 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 构造函数的值，用于设置诸如缓冲之类的选项。
- 返回: 两个 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 实例的[\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)。

实用程序函数 `duplexPair` 返回一个包含两项的数组，每一项都是连接到另一端的 `Duplex` 流：

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```

写入一个流的任何内容都可以在另一个流上读取。 它提供的行为类似于网络连接，客户端写入的数据可被服务器读取，反之亦然。

Duplex 流是对称的； 其中一个可以被使用，而行为没有任何差异。

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.5.0 | 添加了对 `ReadableStream` 和 `WritableStream` 的支持。 |
| v15.11.0 | 添加了 `signal` 选项。 |
| v14.0.0 | `finished(stream, cb)` 将在调用回调之前等待 `'close'` 事件。 该实现尝试检测传统流，并且仅将此行为应用于预期会发出 `'close'` 的流。 |
| v14.0.0 | 在 `Readable` 流上在 `'end'` 之前发出 `'close'` 将导致 `ERR_STREAM_PREMATURE_CLOSE` 错误。 |
| v14.0.0 | 回调将在调用 `finished(stream, cb)` 之前已完成的流上调用。 |
| v10.0.0 | 新增于: v10.0.0 |
:::

- `stream` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 可读和/或可写流/webstream。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `false`，则调用 `emit('error', err)` 不会被视为已完成。 **默认:** `true`。
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当设置为 `false` 时，即使流可能仍然可读，回调也会在流结束时被调用。 **默认:** `true`。
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当设置为 `false` 时，即使流可能仍然可写，回调也会在流结束时被调用。 **默认:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许中止等待流完成。 如果信号中止，则不会中止底层流。 回调将被调用并传入一个 `AbortError`。 此函数添加的所有注册监听器也将被删除。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，它接受一个可选的错误参数。
- 返回: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个清除函数，它删除所有已注册的监听器。

一个函数，用于在流不再可读、可写或遇到错误或过早关闭事件时得到通知。

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('流失败。', err);
  } else {
    console.log('流已完成读取。');
  }
});

rs.resume(); // 排空流。
```
在错误处理场景中特别有用，在这种情况下，流会过早地销毁（例如中止的 HTTP 请求），并且不会发出 `'end'` 或 `'finish'`。

`finished` API 提供 [Promise 版本](/zh/nodejs/api/stream#streamfinishedstream-options)。

在 `callback` 被调用后，`stream.finished()` 会留下悬空的事件监听器（特别是 `'error'`、`'end'`、`'finish'` 和 `'close'`）。 这样做的原因是，意外的 `'error'` 事件（由于不正确的流实现）不会导致意外崩溃。 如果不需要此行为，则需要在回调中调用返回的清除函数：

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.7.0, v18.16.0 | 增加对 webstreams 的支持。 |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v14.0.0 | `pipeline(..., cb)` 将等待 `'close'` 事件，然后再调用回调函数。 该实现尝试检测旧版流，并且仅将此行为应用于期望发出 `'close'` 的流。 |
| v13.10.0 | 增加对异步生成器的支持。 |
| v10.0.0 | 添加于: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/zh/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/zh/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/zh/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
    - 返回: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/zh/nodejs/api/webstreams#class-transformstream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 返回: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 返回: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在管道完全完成后调用。
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` 由 `destination` 返回的 `Promise` 的已解析值。
  
 
- 返回: [\<Stream\>](/zh/nodejs/api/stream#stream)

一个用于在流和生成器之间进行管道传输的模块方法，转发错误并正确清理，并在管道完成时提供回调。

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// 使用 pipeline API 可以轻松地将一系列流
// 管道连接在一起，并在管道完全完成后收到通知。

// 一个高效地压缩可能非常大的 tar 文件的管道：

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('管道失败。', err);
    } else {
      console.log('管道成功。');
    }
  },
);
```
`pipeline` API 提供了一个 [promise 版本](/zh/nodejs/api/stream#streampipelinesource-transforms-destination-options)。

`stream.pipeline()` 将在所有流上调用 `stream.destroy(err)`，但以下情况除外：

- 已发出 `'end'` 或 `'close'` 的 `Readable` 流。
- 已发出 `'finish'` 或 `'close'` 的 `Writable` 流。

在调用 `callback` 之后，`stream.pipeline()` 会在流上留下悬空的事件监听器。 如果在失败后重复使用流，这可能会导致事件监听器泄漏和错误被吞噬。 如果最后一个流是可读的，则将删除悬空的事件监听器，以便以后可以使用最后一个流。

当引发错误时，`stream.pipeline()` 会关闭所有流。 将 `IncomingRequest` 与 `pipeline` 一起使用可能会导致意外行为，因为它会在不发送预期响应的情况下破坏套接字。 请参阅以下示例：

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // No such file
      // 一旦 `pipeline` 已经销毁了套接字，就无法发送此消息
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.1.0, v20.10.0 | 添加了对流类的支持。 |
| v19.8.0, v18.16.0 | 添加了对 webstreams 的支持。 |
| v16.9.0 | 添加于: v16.9.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - `stream.compose` 是实验性的。
:::

- `streams` [\<Stream[]\>](/zh/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/zh/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/zh/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/zh/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

将两个或多个流组合成一个 `Duplex` 流，该流写入第一个流并从最后一个流读取。 每个提供的流都使用 `stream.pipeline` 管道连接到下一个流。 如果任何一个流发生错误，则所有流都会被销毁，包括外部 `Duplex` 流。

因为 `stream.compose` 返回一个新的流，而该流又可以（并且应该）被管道连接到其他流中，所以它启用了组合。 相比之下，当将流传递给 `stream.pipeline` 时，通常第一个流是可读流，最后一个流是可写流，形成一个闭合回路。

如果传递一个 `Function`，它必须是一个接受 `source` `Iterable` 的工厂方法。

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // prints 'HELLOWORLD'
```
`stream.compose` 可用于将异步可迭代对象、生成器和函数转换为流。

- `AsyncIterable` 转换为可读的 `Duplex`。 不能产生 `null`。
- `AsyncGeneratorFunction` 转换为可读/可写的转换 `Duplex`。 必须将源 `AsyncIterable` 作为第一个参数。 不能产生 `null`。
- `AsyncFunction` 转换为可写的 `Duplex`。 必须返回 `null` 或 `undefined`。

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// 将 AsyncIterable 转换为可读的 Duplex。
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// 将 AsyncGenerator 转换为转换 Duplex。
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// 将 AsyncFunction 转换为可写的 Duplex。
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // prints 'HELLOWORLD'
```
有关 `stream.compose` 作为运算符的信息，请参见 [`readable.compose(stream)`](/zh/nodejs/api/stream#readablecomposestream-options)。


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**加入于: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 实现 `Symbol.asyncIterator` 或 `Symbol.iterator` 可迭代协议的对象。 如果传递 null 值，则发出 'error' 事件。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 提供给 `new stream.Readable([options])` 的选项。 默认情况下，`Readable.from()` 会将 `options.objectMode` 设置为 `true`，除非通过将 `options.objectMode` 设置为 `false` 显式选择退出。
- 返回: [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)

一种用于从迭代器创建可读流的实用方法。

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
调用 `Readable.from(string)` 或 `Readable.from(buffer)` 将不会迭代字符串或缓冲区，以匹配其他流的语义，以提高性能。

如果传递包含 Promise 的 `Iterable` 对象作为参数，则可能导致未处理的拒绝。

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // 未处理的拒绝
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**加入于: v17.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `readableStream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)
  
 
- 返回: [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**已添加: v16.8.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `stream` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
- 返回: `boolean`

返回流是否已被读取或取消。

### `stream.isErrored(stream)` {#streamiserroredstream}

**已添加: v17.3.0, v16.14.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `stream` [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/zh/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/zh/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

返回流是否遇到错误。

### `stream.isReadable(stream)` {#streamisreadablestream}

**已添加: v17.4.0, v16.14.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `stream` [\<Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/zh/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

返回流是否可读。

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**已添加: v17.0.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `streamReadable` [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在从给定的 `stream.Readable` 读取时应用反压之前，创建的 `ReadableStream` 的最大内部队列大小。 如果没有提供值，它将从给定的 `stream.Readable` 中获取。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个计算给定数据块大小的函数。 如果没有提供值，则所有块的大小都将为 `1`。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- 返回: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**加入于: v17.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `writableStream` [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)


- 返回: [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**加入于: v17.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `streamWritable` [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)
- 返回: [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.5.0, v18.17.0 | `src` 参数现在可以是 `ReadableStream` 或 `WritableStream`。 |
| v16.8.0 | 加入于: v16.8.0 |
:::

- `src` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<Blob\>](/zh/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

用于创建双工流的实用方法。

- `Stream` 将可写流转换为可写的 `Duplex`，并将可读流转换为 `Duplex`。
- `Blob` 转换为可读的 `Duplex`。
- `string` 转换为可读的 `Duplex`。
- `ArrayBuffer` 转换为可读的 `Duplex`。
- `AsyncIterable` 转换为可读的 `Duplex`。 不能产生 `null`。
- `AsyncGeneratorFunction` 转换为可读/可写的转换 `Duplex`。 必须将源 `AsyncIterable` 作为第一个参数。 不能产生 `null`。
- `AsyncFunction` 转换为可写的 `Duplex`。 必须返回 `null` 或 `undefined`
- `Object ({ writable, readable })` 将 `readable` 和 `writable` 转换为 `Stream`，然后将它们组合成 `Duplex`，其中 `Duplex` 将写入 `writable` 并从 `readable` 读取。
- `Promise` 转换为可读的 `Duplex`。 值 `null` 将被忽略。
- `ReadableStream` 转换为可读的 `Duplex`。
- `WritableStream` 转换为可写的 `Duplex`。
- 返回: [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)

如果将包含 promise 的 `Iterable` 对象作为参数传递，则可能导致未处理的拒绝。

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unhandled rejection
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**新增于: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)


- 返回: [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**新增于: v17.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `streamDuplex` [\<stream.Duplex\>](/zh/nodejs/api/stream#class-streamduplex)
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)
  
 

::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.7.0, v18.16.0 | 增加了对 `ReadableStream` 和 `WritableStream` 的支持。 |
| v15.4.0 | 新增于: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 表示可能取消的信号
- `stream` [\<Stream\>](/zh/nodejs/api/stream#stream) | [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 要附加信号的流。

将 AbortSignal 附加到可读或可写流。 这允许代码使用 `AbortController` 控制流的销毁。

在与传递的 `AbortSignal` 对应的 `AbortController` 上调用 `abort` 将以与在流上调用 `.destroy(new AbortError())` 相同的方式运行，对于 webstreams，相当于 `controller.error(new AbortError())`。

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// 稍后，中止操作以关闭流
controller.abort();
```
或者将 `AbortSignal` 与可读流一起用作异步可迭代对象：

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // 设置超时
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // 该操作已取消
    } else {
      throw e;
    }
  }
})();
```
或者将 `AbortSignal` 与 ReadableStream 一起使用：

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // 该操作已取消
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**新增于: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回流使用的默认 highWaterMark。 默认为 `65536` (64 KiB)，对于 `objectMode` 则为 `16`。

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**新增于: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) highWaterMark 值

设置流使用的默认 highWaterMark。

## 流实现者的 API {#api-for-stream-implementers}

`node:stream` 模块 API 的设计使得可以使用 JavaScript 的原型继承模型轻松实现流。

首先，流开发者会声明一个新的 JavaScript 类，该类扩展了四个基本流类之一（`stream.Writable`、`stream.Readable`、`stream.Duplex` 或 `stream.Transform`），确保他们调用了适当的父类构造函数：

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
扩展流时，请记住用户可以并且应该提供哪些选项，然后再将这些选项转发到基类构造函数。 例如，如果实现对 `autoDestroy` 和 `emitClose` 选项做出假设，请不要允许用户覆盖这些选项。 显式说明要转发哪些选项，而不是隐式转发所有选项。

然后，新的流类必须实现一个或多个特定的方法，具体取决于要创建的流的类型，如下表所示：

| 用例 | 类 | 要实现的方法 |
| --- | --- | --- |
| 只读 | [`Readable`](/zh/nodejs/api/stream#class-streamreadable) | [`_read()`](/zh/nodejs/api/stream#readable_readsize) |
| 只写 | [`Writable`](/zh/nodejs/api/stream#class-streamwritable) | [`_write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/zh/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/zh/nodejs/api/stream#writable_finalcallback) |
| 读写 | [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) | [`_read()`](/zh/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/zh/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/zh/nodejs/api/stream#writable_finalcallback) |
| 操作写入的数据，然后读取结果 | [`Transform`](/zh/nodejs/api/stream#class-streamtransform) | [`_transform()`](/zh/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/zh/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/zh/nodejs/api/stream#writable_finalcallback) |
流的实现代码*永远不应*调用流的“公共”方法，这些方法旨在供消费者使用（如[流消费者 API](/zh/nodejs/api/stream#api-for-stream-consumers) 部分所述）。 这样做可能会导致使用流的应用程序代码中产生不利的副作用。

避免覆盖公共方法，例如 `write()`、`end()`、`cork()`、`uncork()`、`read()` 和 `destroy()`，或通过 `.emit()` 发出内部事件，例如 `'error'`、`'data'`、`'end'`、`'finish'` 和 `'close'`。 这样做可能会破坏当前和未来的流不变性，从而导致与其他流、流实用程序和用户期望的行为和/或兼容性问题。


### 简化构造 {#simplified-construction}

**新增于: v1.2.0**

对于许多简单的情况，无需依赖继承即可创建流。 这可以通过直接创建 `stream.Writable`、`stream.Readable`、`stream.Duplex` 或 `stream.Transform` 对象的实例并将适当的方法作为构造函数选项传递来实现。

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // 初始化状态和加载资源...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // 释放资源...
  },
});
```
### 实现一个可写流 {#implementing-a-writable-stream}

`stream.Writable` 类被扩展以实现一个 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流。

自定义 `Writable` 流*必须*调用 `new stream.Writable([options])` 构造函数并实现 `writable._write()` 和/或 `writable._writev()` 方法。

#### `new stream.Writable([options])` {#new-streamwritableoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 提升默认 highWaterMark。 |
| v15.5.0 | 支持传入 AbortSignal。 |
| v14.0.0 | 将 `autoDestroy` 选项的默认值更改为 `true`。 |
| v11.2.0, v10.16.0 | 添加 `autoDestroy` 选项，以便在流发出 `'finish'` 或错误时自动 `destroy()` 流。 |
| v10.0.0 | 添加 `emitClose` 选项以指定是否在销毁时发出 `'close'`。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 开始返回 `false` 时的缓冲区级别。 **默认值:** `65536` (64 KiB)，或 `objectMode` 流为 `16`。
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否在将 `string` 传递给 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 之前将其编码为 `Buffer`（使用 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 调用中指定的编码），然后再将其传递给 [`stream._write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback)。 其他类型的数据不会被转换（即 `Buffer` 不会被解码为 `string`）。 设置为 false 将阻止 `string` 被转换。 **默认值:** `true`。
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当没有将编码指定为 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 的参数时使用的默认编码。 **默认值:** `'utf8'`。
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`stream.write(anyObj)`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 是否为有效操作。 设置后，如果流实现支持，则可以写入字符串、[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 或 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 之外的 JavaScript 值。 **默认值:** `false`。
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 流在销毁后是否应发出 `'close'`。 **默认值:** `true`。
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback) 方法的实现。
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._writev()`](/zh/nodejs/api/stream#writable_writevchunks-callback) 方法的实现。
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._destroy()`](/zh/nodejs/api/stream#writable_destroyerr-callback) 方法的实现。
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._final()`](/zh/nodejs/api/stream#writable_finalcallback) 方法的实现。
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._construct()`](/zh/nodejs/api/stream#writable_constructcallback) 方法的实现。
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 此流是否应在结束后自动对其自身调用 `.destroy()`。 **默认值:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 表示可能取消的信号。

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // 调用 stream.Writable() 构造函数。
    super(options);
    // ...
  }
}
```
或者，当使用 pre-ES6 风格的构造函数时：

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
或者，使用简化的构造方法：

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
对与传递的 `AbortSignal` 相对应的 `AbortController` 调用 `abort` 将与对可写流调用 `.destroy(new AbortError())` 的行为相同。

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// 稍后，中止操作以关闭流
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**加入于: v15.0.0**

- `callback` [\<函数\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当流完成初始化后，调用此函数（可以选择带一个错误参数）。

`_construct()` 方法不能直接调用。 它可以由子类实现，如果实现，则只能由内部 `Writable` 类方法调用。

这个可选函数将在流构造函数返回后的一个 tick 中被调用，延迟任何 `_write()`、`_final()` 和 `_destroy()` 调用，直到 `callback` 被调用。 这对于在流可以使用之前初始化状态或异步初始化资源很有用。

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.11.0 | 当提供 _writev() 时，_write() 是可选的。 |
:::

- `chunk` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要写入的 `Buffer`，从传递给 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 的 `string` 转换而来。 如果流的 `decodeStrings` 选项为 `false` 或流以对象模式运行，则块将不会被转换，并将是传递给 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 的任何内容。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果块是字符串，则 `encoding` 是该字符串的字符编码。 如果 chunk 是一个 `Buffer`，或者如果流以对象模式运行，则可以忽略 `encoding`。
- `callback` [\<函数\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当完成对提供的块的处理时，调用此函数（可以选择带一个错误参数）。

所有 `Writable` 流实现都必须提供一个 [`writable._write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback) 和/或 [`writable._writev()`](/zh/nodejs/api/stream#writable_writevchunks-callback) 方法来将数据发送到底层资源。

[`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流提供了它们自己的 [`writable._write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback) 实现。

此函数不能由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 `Writable` 类方法调用。

必须在 `writable._write()` 内部同步地调用 `callback` 函数，或者异步地（即不同的 tick）调用，以表明写入成功完成或因错误而失败。 传递给 `callback` 的第一个参数必须是 `Error` 对象（如果调用失败），如果写入成功，则为 `null`。

在调用 `writable._write()` 和调用 `callback` 之间发生的所有对 `writable.write()` 的调用都会导致写入的数据被缓冲。 当调用 `callback` 时，流可能会发出一个 [`'drain'`](/zh/nodejs/api/stream#event-drain) 事件。 如果流实现能够一次处理多个数据块，则应该实现 `writable._writev()` 方法。

如果 `decodeStrings` 属性在构造函数选项中显式设置为 `false`，那么 `chunk` 将保持与传递给 `.write()` 的对象相同，并且可能是字符串而不是 `Buffer`。 这是为了支持对某些字符串数据编码进行优化处理的实现。 在这种情况下，`encoding` 参数将指示字符串的字符编码。 否则，可以安全地忽略 `encoding` 参数。

`writable._write()` 方法以一个下划线作为前缀，因为它对于定义它的类是内部的，并且永远不应该被用户程序直接调用。


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 要写入的数据。 该值是[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)的数组，每个对象代表要写入的离散数据块。 这些对象的属性是：
    - `chunk` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 包含要写入的数据的 Buffer 实例或字符串。 如果使用设置为 `false` 的 `decodeStrings` 选项创建了 `Writable`，并且将字符串传递给 `write()`，则 `chunk` 将是一个字符串。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `chunk` 的字符编码。 如果 `chunk` 是 `Buffer`，则 `encoding` 将是 `'buffer'`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数（可以选择带有错误参数），当完成提供的块的处理时调用。

此函数不能由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 `Writable` 类方法调用。

在能够一次处理多个数据块的流实现中，可以作为 `writable._write()` 的补充或替代来实现 `writable._writev()` 方法。 如果实现了，并且存在来自先前写入的缓冲数据，则将调用 `_writev()` 而不是 `_write()`。

`writable._writev()` 方法以一个下划线为前缀，因为它对于定义它的类是内部的，并且永远不应该由用户程序直接调用。

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Added in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 一个可能的错误。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，它接受一个可选的错误参数。

`_destroy()` 方法由 [`writable.destroy()`](/zh/nodejs/api/stream#writabledestroyerror) 调用。 它可以被子类重写，但它**不能**被直接调用。


#### `writable._final(callback)` {#writable_finalcallback}

**新增于: v8.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 完成写入任何剩余数据时，调用此函数（可以选择带一个错误参数）。

`_final()` 方法**不能**被直接调用。它可以被子类实现，如果实现了，它将只会被 `Writable` 类的内部方法调用。

这个可选的函数会在流关闭前被调用，延迟 `'finish'` 事件直到 `callback` 被调用。这在流结束前关闭资源或写入缓冲的数据时很有用。

#### 写入时发生的错误 {#errors-while-writing}

在处理 [`writable._write()`](/zh/nodejs/api/stream#writable_writechunk-encoding-callback)， [`writable._writev()`](/zh/nodejs/api/stream#writable_writevchunks-callback) 和 [`writable._final()`](/zh/nodejs/api/stream#writable_finalcallback) 方法期间发生的错误必须通过调用回调并将错误作为第一个参数来传播。在这些方法中抛出 `Error` 或手动触发 `'error'` 事件会导致未定义的行为。

如果一个 `Readable` 流通过管道连接到一个 `Writable` 流，当 `Writable` 触发一个错误时，`Readable` 流将会被取消管道连接。

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### 一个可写流的例子 {#an-example-writable-stream}

下面的例子展示了一个相当简单（而且有点无意义）的自定义 `Writable` 流实现。虽然这个特定的 `Writable` 流实例没有任何实际的用处，但这个例子说明了一个自定义 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 流实例的每个必需元素：

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### 解码可写流中的缓冲区 {#decoding-buffers-in-a-writable-stream}

解码缓冲区是一项常见的任务，例如，当使用输入为字符串的转换器时。当使用多字节字符编码（如 UTF-8）时，这不是一个简单的过程。以下示例展示了如何使用 `StringDecoder` 和 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 解码多字节字符串。

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### 实现可读流 {#implementing-a-readable-stream}

扩展 `stream.Readable` 类以实现一个 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流。

自定义 `Readable` 流 *必须* 调用 `new stream.Readable([options])` 构造函数并实现 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法。

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 提升默认 highWaterMark。 |
| v15.5.0 | 支持传入一个 AbortSignal。 |
| v14.0.0 | 将 `autoDestroy` 选项默认值更改为 `true`。 |
| v11.2.0, v10.16.0 | 添加 `autoDestroy` 选项，以便在流发出 `'end'` 或发生错误时自动 `destroy()` 流。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在停止从底层资源读取之前，存储在内部缓冲区中的最大[字节数](/zh/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding)。 **默认值:** `65536` (64 KiB)，或 `objectMode` 流为 `16`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果指定，则缓冲区将使用指定的编码解码为字符串。 **默认值:** `null`。
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 此流是否应表现为对象流。意味着 [`stream.read(n)`](/zh/nodejs/api/stream#readablereadsize) 返回单个值，而不是大小为 `n` 的 `Buffer`。 **默认值:** `false`。
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 流在销毁后是否应发出 `'close'`。 **默认值:** `true`。
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._read()`](/zh/nodejs/api/stream#readable_readsize) 方法的实现。
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._destroy()`](/zh/nodejs/api/stream#readable_destroyerr-callback) 方法的实现。
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._construct()`](/zh/nodejs/api/stream#readable_constructcallback) 方法的实现。
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 此流是否应在结束后自动调用 `.destroy()` 自身。 **默认值:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 表示可能取消的信号。
  
 

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // 调用 stream.Readable(options) 构造函数。
    super(options);
    // ...
  }
}
```
或者，当使用 pre-ES6 风格的构造函数时：

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
或者，使用简化的构造函数方法：

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
在与传递的 `AbortSignal` 对应的 `AbortController` 上调用 `abort` 的行为，与在创建的可读流上调用 `.destroy(new AbortError())` 的行为相同。

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// 稍后，中止操作以关闭流
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**新增于: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当流完成初始化时，调用此函数（可以选择带一个错误参数）。

`_construct()` 方法不能直接调用。它可以由子类实现，如果实现了，则只能由内部 `Readable` 类方法调用。

这个可选函数将在流构造函数中安排在下一个 tick 中执行，延迟任何 `_read()` 和 `_destroy()` 调用，直到调用 `callback`。 这对于在可以使用流之前初始化状态或异步初始化资源很有用。

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**新增于: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 异步读取的字节数

此函数不能由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 `Readable` 类方法调用。

所有 `Readable` 流的实现都必须提供 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法的实现，以从底层资源获取数据。

当调用 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 时，如果资源中有可用数据，则实现应开始使用 [`this.push(dataChunk)`](/zh/nodejs/api/stream#readablepushchunk-encoding) 方法将数据推入读取队列。 在每次调用 [`this.push(dataChunk)`](/zh/nodejs/api/stream#readablepushchunk-encoding) 之后，一旦流准备好接受更多数据，就会再次调用 `_read()`。 `_read()` 可以继续从资源读取和推送数据，直到 `readable.push()` 返回 `false`。 只有在停止后再次调用 `_read()` 时，它才应恢复将其他数据推入队列。

一旦调用了 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法，在通过 [`readable.push()`](/zh/nodejs/api/stream#readablepushchunk-encoding) 方法推送更多数据之前，不会再次调用它。 空数据（例如空缓冲区和字符串）不会导致调用 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize)。

`size` 参数是建议性的。 对于“读取”是返回数据的单个操作的实现，可以使用 `size` 参数来确定要获取多少数据。 其他实现可能会忽略此参数，并且只要有数据可用就简单地提供数据。 无需“等待”直到 `size` 字节可用，然后再调用 [`stream.push(chunk)`](/zh/nodejs/api/stream#readablepushchunk-encoding)。

[`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法以以下划线为前缀，因为它对于定义它的类是内部的，并且永远不应由用户程序直接调用。


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**添加于: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 可能的错误。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数，接受一个可选的错误参数。

`_destroy()` 方法由 [`readable.destroy()`](/zh/nodejs/api/stream#readabledestroyerror) 调用。它可以被子类覆盖，但**不能**直接调用。

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 参数现在可以是 `TypedArray` 或 `DataView` 实例。 |
| v8.0.0 | `chunk` 参数现在可以是 `Uint8Array` 实例。 |
:::

- `chunk` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要推入读取队列的数据块。对于不在对象模式下运行的流，`chunk` 必须是 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 或 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)。对于对象模式的流，`chunk` 可以是任何 JavaScript 值。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字符串块的编码。必须是有效的 `Buffer` 编码，例如 `'utf8'` 或 `'ascii'`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果可以继续推送额外的数据块，则为 `true`；否则为 `false`。

当 `chunk` 是 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 或 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 时，数据块将被添加到内部队列中，供流的用户消费。将 `chunk` 作为 `null` 传递表示流的结束 (EOF)，之后不能再写入更多数据。

当 `Readable` 以暂停模式运行时，可以通过在发出 [`'readable'`](/zh/nodejs/api/stream#event-readable) 事件时调用 [`readable.read()`](/zh/nodejs/api/stream#readablereadsize) 方法读取使用 `readable.push()` 添加的数据。

当 `Readable` 以流动模式运行时，通过 `readable.push()` 添加的数据将通过发出 `'data'` 事件来传递。

`readable.push()` 方法的设计尽可能灵活。例如，当包装一个提供某种形式的暂停/恢复机制和数据回调的底层源时，可以通过自定义的 `Readable` 实例来包装底层源：

```js [ESM]
// `_source` 是一个具有 readStop() 和 readStart() 方法的对象，
// 以及一个在有数据时被调用的 `ondata` 成员，以及一个在数据结束时被调用的 `onend` 成员。

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // 每次有数据时，将其推入内部缓冲区。
    this._source.ondata = (chunk) => {
      // 如果 push() 返回 false，则停止从源读取。
      if (!this.push(chunk))
        this._source.readStop();
    };

    // 当源结束时，推送 EOF 信号 `null` 块。
    this._source.onend = () => {
      this.push(null);
    };
  }
  // 当流想要提取更多数据时，将调用 _read()。
  // 在这种情况下，咨询性的 size 参数将被忽略。
  _read(size) {
    this._source.readStart();
  }
}
```
`readable.push()` 方法用于将内容推入内部缓冲区。它可以由 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法驱动。

对于不在对象模式下运行的流，如果 `readable.push()` 的 `chunk` 参数是 `undefined`，它将被视为空字符串或缓冲区。有关更多信息，请参见 [`readable.push('')`](/zh/nodejs/api/stream#readablepush)。


#### 读取时的错误 {#errors-while-reading}

在处理 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 期间发生的错误必须通过 [`readable.destroy(err)`](/zh/nodejs/api/stream#readable_destroyerr-callback) 方法传播。从 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 中抛出一个 `Error` 或手动触发一个 `'error'` 事件会导致未定义的行为。

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### 一个计数流的例子 {#an-example-counting-stream}

以下是一个 `Readable` 流的基本示例，它按升序发出从 1 到 1,000,000 的数字，然后结束。

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### 实现一个双工流 {#implementing-a-duplex-stream}

[`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流是一个同时实现 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 和 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 的流，例如 TCP 套接字连接。

由于 JavaScript 不支持多重继承，因此扩展 `stream.Duplex` 类来实现 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流（而不是扩展 `stream.Readable` *和* `stream.Writable` 类）。

`stream.Duplex` 类以原型方式继承自 `stream.Readable`，并以寄生方式继承自 `stream.Writable`，但由于重写了 `stream.Writable` 上的 [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)，`instanceof` 将对两个基类正常工作。

自定义 `Duplex` 流*必须*调用 `new stream.Duplex([options])` 构造函数并实现* [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 和 `writable._write()` 方法。


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.4.0 | 现在支持 `readableHighWaterMark` 和 `writableHighWaterMark` 选项。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 传递给 `Writable` 和 `Readable` 构造函数。 也有以下字段：
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `false`，则当可读端结束时，流将自动结束可写端。 **默认值:** `true`。
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置 `Duplex` 是否应该是可读的。 **默认值:** `true`。
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置 `Duplex` 是否应该是可写的。 **默认值:** `true`。
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置流的可读端的 `objectMode`。 如果 `objectMode` 为 `true`，则无效。 **默认值:** `false`。
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置流的可写端的 `objectMode`。 如果 `objectMode` 为 `true`，则无效。 **默认值:** `false`。
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置流的可读端的 `highWaterMark`。 如果提供了 `highWaterMark`，则无效。
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置流的可写端的 `highWaterMark`。 如果提供了 `highWaterMark`，则无效。

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
或者，当使用 pre-ES6 风格的构造函数时：

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
或者，使用简化的构造函数方法：

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
当使用管道时：

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // 接受字符串输入而不是 Buffer
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // 确保是有效的 json。
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### 双工流示例 {#an-example-duplex-stream}

以下示例展示了一个简单的 `Duplex` 流，它封装了一个假设的底层源对象，数据可以写入该对象，也可以从中读取数据，尽管使用的是与 Node.js 流不兼容的 API。 以下示例展示了一个简单的 `Duplex` 流，它通过 [`Writable`](/zh/nodejs/api/stream#class-streamwritable) 接口缓冲传入的写入数据，然后通过 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 接口将其读回。

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // 底层源只处理字符串。
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
`Duplex` 流最重要的方面是 `Readable` 和 `Writable` 端彼此独立运行，尽管它们共存于单个对象实例中。

#### 对象模式双工流 {#object-mode-duplex-streams}

对于 `Duplex` 流，可以使用 `readableObjectMode` 和 `writableObjectMode` 选项分别专门为 `Readable` 或 `Writable` 端设置 `objectMode`。

例如，在以下示例中，创建一个新的 `Transform` 流（这是一种 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流），它具有一个对象模式 `Writable` 端，该端接受 JavaScript 数字，这些数字在 `Readable` 端转换为十六进制字符串。

```js [ESM]
const { Transform } = require('node:stream');

// 所有 Transform 流也是 Duplex 流。
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // 必要时将块强制转换为数字。
    chunk |= 0;

    // 将块转换为其他内容。
    const data = chunk.toString(16);

    // 将数据推送到可读队列。
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// 打印：01
myTransform.write(10);
// 打印：0a
myTransform.write(100);
// 打印：64
```

### 实现一个转换流 {#implementing-a-transform-stream}

一个 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流是一个 [`Duplex`](/zh/nodejs/api/stream#class-streamduplex) 流，其中输出以某种方式从输入计算得出。 例如，[zlib](/zh/nodejs/api/zlib) 流或 [crypto](/zh/nodejs/api/crypto) 流会压缩、加密或解密数据。

不要求输出与输入大小相同、块数相同或同时到达。 例如，`Hash` 流将始终只有一个输出块，该块在输入结束时提供。 `zlib` 流产生的输出将远小于或远大于其输入。

扩展 `stream.Transform` 类以实现 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流。

`stream.Transform` 类原型继承自 `stream.Duplex` 并实现其自身的 `writable._write()` 和 [`readable._read()`](/zh/nodejs/api/stream#readable_readsize) 方法。 自定义 `Transform` 实现*必须*实现 [`transform._transform()`](/zh/nodejs/api/stream#transform_transformchunk-encoding-callback) 方法，并且*可以*实现 [`transform._flush()`](/zh/nodejs/api/stream#transform_flushcallback) 方法。

在使用 `Transform` 流时必须小心，写入流的数据可能会导致流的 `Writable` 端暂停，如果 `Readable` 端的输出未被消耗。

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 传递给 `Writable` 和 `Readable` 构造函数。 也有以下字段：
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._transform()`](/zh/nodejs/api/stream#transform_transformchunk-encoding-callback) 方法的实现。
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._flush()`](/zh/nodejs/api/stream#transform_flushcallback) 方法的实现。

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
或者，当使用 pre-ES6 风格的构造函数时：

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
或者，使用简化的构造函数方法：

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### 事件: `'end'` {#event-end_1}

[`'end'`](/zh/nodejs/api/stream#event-end) 事件来自 `stream.Readable` 类。在所有数据都已输出后，将发出 `'end'` 事件，该事件在 [`transform._flush()`](/zh/nodejs/api/stream#transform_flushcallback) 中的回调被调用后发生。如果发生错误，则不应发出 `'end'`。

#### 事件: `'finish'` {#event-finish_1}

[`'finish'`](/zh/nodejs/api/stream#event-finish) 事件来自 `stream.Writable` 类。在调用 [`stream.end()`](/zh/nodejs/api/stream#writableendchunk-encoding-callback) 并且所有块都已由 [`stream._transform()`](/zh/nodejs/api/stream#transform_transformchunk-encoding-callback) 处理后，将发出 `'finish'` 事件。如果发生错误，则不应发出 `'finish'`。

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个回调函数（可以选择带有一个错误参数和数据），用于在剩余数据被刷新后调用。

此函数绝不能由应用程序代码直接调用。它应该由子类实现，并且只能由内部 `Readable` 类方法调用。

在某些情况下，转换操作可能需要在流的末尾发出额外的少量数据。 例如，`zlib` 压缩流将存储一定数量的内部状态，用于优化压缩输出。 但是，当流结束时，需要刷新该额外数据，以便压缩数据是完整的。

自定义 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 实现 *可以* 实现 `transform._flush()` 方法。 当没有更多要消耗的写入数据时，但在发出 [`'end'`](/zh/nodejs/api/stream#event-end) 事件以指示 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 流的结束之前，将调用此方法。

在 `transform._flush()` 实现中，可以根据需要零次或多次调用 `transform.push()` 方法。 刷新操作完成后，必须调用 `callback` 函数。

`transform._flush()` 方法以一个下划线作为前缀，因为它在定义它的类中是内部的，并且永远不应该被用户程序直接调用。


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要转换的 `Buffer`，从传递给 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 的 `string` 转换而来。 如果流的 `decodeStrings` 选项为 `false` 或流以对象模式运行，则块将不会被转换，并且将是传递给 [`stream.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 的任何内容。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果块是字符串，则这是编码类型。 如果块是缓冲区，则这是特殊值 `'buffer'`。 在这种情况下忽略它。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在提供的 `chunk` 处理完毕后要调用的回调函数（可以选择带有错误参数和数据）。

此函数不能由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 `Readable` 类方法调用。

所有 `Transform` 流实现都必须提供一个 `_transform()` 方法来接受输入并产生输出。 `transform._transform()` 实现处理正在写入的字节，计算输出，然后使用 `transform.push()` 方法将该输出传递到可读部分。

可以调用 `transform.push()` 方法零次或多次，以从单个输入块生成输出，具体取决于作为块的结果要输出多少。

可能不会从任何给定的输入数据块生成任何输出。

仅当当前块被完全消耗时才必须调用 `callback` 函数。 传递给 `callback` 的第一个参数必须是 `Error` 对象（如果在处理输入时发生错误），否则为 `null`。 如果将第二个参数传递给 `callback`，它将被转发到 `transform.push()` 方法，但前提是第一个参数为 falsy。 换句话说，以下是等效的：

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
`transform._transform()` 方法以一个下划线为前缀，因为它在定义它的类中是内部的，并且永远不应该被用户程序直接调用。

`transform._transform()` 永远不会并行调用； 流实现了一个队列机制，并且要接收下一个块，必须同步或异步调用 `callback`。


#### 类: `stream.PassThrough` {#class-streampassthrough}

`stream.PassThrough` 类是一个 [`Transform`](/zh/nodejs/api/stream#class-streamtransform) 流的简单实现，它只是将输入字节传递到输出。它的目的主要是用于示例和测试，但也有一些用例，其中 `stream.PassThrough` 可以用作新型流的构建块。

## 补充说明 {#additional-notes}

### 流与异步生成器和异步迭代器的兼容性 {#streams-compatibility-with-async-generators-and-async-iterators}

由于 JavaScript 中对异步生成器和迭代器的支持，异步生成器实际上成为了第一类语言级别的流结构。

下面提供了一些将 Node.js 流与异步生成器和异步迭代器一起使用的常见互操作案例。

#### 使用异步迭代器消费可读流 {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
异步迭代器在流上注册一个永久的错误处理程序，以防止任何未处理的销毁后错误。

#### 使用异步生成器创建可读流 {#creating-readable-streams-with-async-generators}

可以使用 `Readable.from()` 实用程序方法从异步生成器创建 Node.js 可读流：

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### 从异步迭代器管道到可写流 {#piping-to-writable-streams-from-async-iterators}

从异步迭代器写入可写流时，请确保正确处理背压和错误。 [`stream.pipeline()`](/zh/nodejs/api/stream#streampipelinesource-transforms-destination-callback) 抽象出背压和与背压相关的错误的处理：

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// 回调模式
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise 模式
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### 与旧版本 Node.js 的兼容性 {#compatibility-with-older-nodejs-versions}

在 Node.js 0.10 之前，`Readable` 流接口更简单，但也功能较弱，用处较小。

- 不需要等待对 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 方法的调用，[`'data'`](/zh/nodejs/api/stream#event-data) 事件会立即开始触发。 需要执行一定量的工作来决定如何处理数据的应用程序需要将读取的数据存储到缓冲区中，这样数据才不会丢失。
- [`stream.pause()`](/zh/nodejs/api/stream#readablepause) 方法是建议性的，而不是有保证的。 这意味着即使在流处于暂停状态时，仍然需要准备好接收 [`'data'`](/zh/nodejs/api/stream#event-data) 事件。

在 Node.js 0.10 中，添加了 [`Readable`](/zh/nodejs/api/stream#class-streamreadable) 类。 为了与旧的 Node.js 程序向后兼容，当添加 [`'data'`](/zh/nodejs/api/stream#event-data) 事件处理程序或调用 [`stream.resume()`](/zh/nodejs/api/stream#readableresume) 方法时，`Readable` 流会切换到“流动模式”。 效果是，即使不使用新的 [`stream.read()`](/zh/nodejs/api/stream#readablereadsize) 方法和 [`'readable'`](/zh/nodejs/api/stream#event-readable) 事件，也不再需要担心丢失 [`'data'`](/zh/nodejs/api/stream#event-data) 数据块。

虽然大多数应用程序将继续正常运行，但这在以下情况下引入了一个边缘情况：

- 没有添加 [`'data'`](/zh/nodejs/api/stream#event-data) 事件监听器。
- 从未调用 [`stream.resume()`](/zh/nodejs/api/stream#readableresume) 方法。
- 流没有通过管道输送到任何可写目的地。

例如，考虑以下代码：

```js [ESM]
// 警告！ 损坏！
net.createServer((socket) => {

  // 我们添加了一个 'end' 监听器，但从不使用数据。
  socket.on('end', () => {
    // 它永远不会到达这里。
    socket.end('消息已收到但未处理。\n');
  });

}).listen(1337);
```
在 Node.js 0.10 之前，传入的消息数据将被简单地丢弃。 但是，在 Node.js 0.10 及更高版本中，套接字将永远保持暂停状态。

在这种情况下，解决方法是调用 [`stream.resume()`](/zh/nodejs/api/stream#readableresume) 方法以开始数据流动：

```js [ESM]
// 解决方法。
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('消息已收到但未处理。\n');
  });

  // 开始数据流动，丢弃它。
  socket.resume();
}).listen(1337);
```
除了切换到流动模式的新 `Readable` 流之外，还可以使用 [`readable.wrap()`](/zh/nodejs/api/stream#readablewrapstream) 方法将 0.10 之前的样式流包装在 `Readable` 类中。


### `readable.read(0)` {#readableread0}

在某些情况下，可能需要触发底层可读流机制的刷新，而无需实际消耗任何数据。在这种情况下，可以调用 `readable.read(0)`，它将始终返回 `null`。

如果内部读取缓冲区低于 `highWaterMark`，并且流当前未在读取，则调用 `stream.read(0)` 将触发底层 [`stream._read()`](/zh/nodejs/api/stream#readable_readsize) 调用。

虽然大多数应用程序几乎永远不需要这样做，但在 Node.js 中存在一些情况会这样做，特别是在 `Readable` 流类内部。

### `readable.push('')` {#readablepush}

不建议使用 `readable.push('')`。

向非对象模式的流推送零字节的 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)，[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 或 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 会产生一个有趣的副作用。因为它是对 [`readable.push()`](/zh/nodejs/api/stream#readablepushchunk-encoding) 的调用，所以该调用将结束读取过程。但是，由于参数是一个空字符串，因此没有数据添加到可读缓冲区，因此用户无法消耗任何数据。

### 调用 `readable.setEncoding()` 后 `highWaterMark` 的差异 {#highwatermark-discrepancy-after-calling-readablesetencoding}

使用 `readable.setEncoding()` 将改变 `highWaterMark` 在非对象模式下的运行方式。

通常，当前缓冲区的大小是根据 `highWaterMark` 以*字节*为单位来衡量的。但是，在调用 `setEncoding()` 之后，比较函数将开始以*字符*为单位来衡量缓冲区的大小。

这在 `latin1` 或 `ascii` 的常见情况下不是问题。但是，建议在处理可能包含多字节字符的字符串时注意此行为。

