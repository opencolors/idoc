---
title: Node.js Web Streams API
description: Node.js 中 Web Streams API 的文档，详细介绍如何使用流来高效处理数据，包括可读流、可写流和转换流。
head:
  - - meta
    - name: og:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中 Web Streams API 的文档，详细介绍如何使用流来高效处理数据，包括可读流、可写流和转换流。
  - - meta
    - name: twitter:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中 Web Streams API 的文档，详细介绍如何使用流来高效处理数据，包括可读流、可写流和转换流。
---


# Web Streams API {#web-streams-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 不再是实验性的。 |
| v18.0.0 | 使用此 API 不再发出运行时警告。 |
| v16.5.0 | 添加于：v16.5.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

[WHATWG Streams 标准](https://streams.spec.whatwg.org/) 的一个实现。

## 概述 {#overview}

[WHATWG Streams 标准](https://streams.spec.whatwg.org/) (或 "web streams") 定义了一个用于处理流数据的 API。它类似于 Node.js 的 [Streams](/zh/nodejs/api/stream) API，但是出现得较晚，并且已经成为跨越多个 JavaScript 环境的流数据的 "标准" API。

有三种主要的对象类型：

- `ReadableStream` - 代表流式数据的源。
- `WritableStream` - 代表流式数据的目标。
- `TransformStream` - 代表用于转换流式数据的算法。

### `ReadableStream` 示例 {#example-readablestream}

此示例创建了一个简单的 `ReadableStream`，它每秒无限次地推送当前的 `performance.now()` 时间戳。一个异步可迭代对象用于从流中读取数据。

::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### 类: `ReadableStream` {#class-readablestream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 添加于: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**添加于: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，在创建 `ReadableStream` 时立即调用。
    - `controller` [\<ReadableStreamDefaultController\>](/zh/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/zh/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - 返回: `undefined` 或者一个以 `undefined` 状态完成的 promise。


    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，当 `ReadableStream` 内部队列未满时重复调用。 该操作可以是同步或异步的。 如果是异步的，则在该函数先前返回的 promise 完成之前，不会再次调用该函数。
    - `controller` [\<ReadableStreamDefaultController\>](/zh/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/zh/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - 返回: 以 `undefined` 状态完成的 promise。


    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，当 `ReadableStream` 被取消时调用。
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: 以 `undefined` 状态完成的 promise。


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'bytes'` 或 `undefined`。
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 仅当 `type` 等于 `'bytes'` 时使用。 当设置为非零值时，将自动为 `ReadableByteStreamController.byobRequest` 分配视图缓冲区。 如果未设置，则必须使用流的内部队列，通过默认读取器 `ReadableStreamDefaultReader` 传输数据。


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 施加背压之前的最大内部队列大小。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，用于标识每个数据块的大小。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `readableStream.locked` {#readablestreamlocked}

**新增于: v16.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果此 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 有活动的读取器，则设置为 `true`。

`readableStream.locked` 属性默认为 `false`，并且在有活动的读取器消耗流的数据时切换为 `true`。

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**新增于: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: 一个 promise，在取消完成后以 `undefined` 兑现。

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**新增于: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` 或 `undefined`
  
 
- 返回: [\<ReadableStreamDefaultReader\>](/zh/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/zh/nodejs/api/webstreams#class-readablestreambyobreader)



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

导致 `readableStream.locked` 变为 `true`。

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**新增于: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) `transform.writable` 将把从此 `ReadableStream` 接收的可能修改的数据推送到此 `ReadableStream`。
    - `writable` [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 此 `ReadableStream` 的数据将写入的 `WritableStream`。
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，此 `ReadableStream` 中的错误不会导致 `transform.writable` 被中止。
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，目标 `transform.writable` 中的错误不会导致此 `ReadableStream` 被取消。
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，关闭此 `ReadableStream` 不会导致 `transform.writable` 被关闭。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 [\<AbortController\>](/zh/nodejs/api/globals#class-abortcontroller) 取消数据传输。
  
 
- 返回: 来自 `transform.readable` 的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。

将此 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 连接到 `transform` 参数中提供的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 和 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 对，使得来自此 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 的数据被写入到 `transform.writable`，可能被转换，然后被推送到 `transform.readable`。 配置管道后，将返回 `transform.readable`。

在管道操作处于活动状态时，导致 `readableStream.locked` 变为 `true`。



::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::


#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**新增于: v16.5.0**

- `destination` [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 一个 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)，此 `ReadableStream` 的数据将被写入到该流中。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，此 `ReadableStream` 中的错误不会导致 `destination` 中止。
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，`destination` 中的错误不会导致此 `ReadableStream` 被取消。
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，关闭此 `ReadableStream` 不会导致 `destination` 被关闭。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 允许使用 [\<AbortController\>](/zh/nodejs/api/globals#class-abortcontroller) 取消数据传输。
  
 
- 返回: 一个 fulfilled 状态的 Promise，值为 `undefined`

当管道操作处于活动状态时，会导致 `readableStream.locked` 为 `true`。

#### `readableStream.tee()` {#readablestreamtee}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.10.0, v16.18.0 | 支持对可读字节流进行 tee 操作。 |
| v16.5.0 | 新增于: v16.5.0 |
:::

- 返回: [\<ReadableStream[]\>](/zh/nodejs/api/webstreams#class-readablestream)

返回一对新的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 实例，此 `ReadableStream` 的数据将被转发到这两个实例。 每个实例都将收到相同的数据。

导致 `readableStream.locked` 为 `true`。

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**新增于: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，防止在异步迭代器突然终止时关闭 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。 **默认值**: `false`。
  
 

创建并返回一个异步迭代器，可用于消费此 `ReadableStream` 的数据。

当异步迭代器处于活动状态时，会导致 `readableStream.locked` 为 `true`。

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### 异步迭代 {#async-iteration}

[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 对象使用 `for await` 语法支持异步迭代器协议。

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
异步迭代器将消费 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 直到其终止。

默认情况下，如果异步迭代器提前退出（通过 `break`、`return` 或 `throw`），[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 将被关闭。 要阻止自动关闭 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)，请使用 `readableStream.values()` 方法获取异步迭代器并将 `preventCancel` 选项设置为 `true`。

[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 不能被锁定（即，它不能有现有的活动读取器）。 在异步迭代期间，[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 将被锁定。

#### 使用 `postMessage()` 传输 {#transferring-with-postmessage}

可以使用 [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) 传输 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 实例。

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**添加于: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 实现 `Symbol.asyncIterator` 或 `Symbol.iterator` 可迭代协议的对象。

一个实用方法，用于从可迭代对象创建一个新的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### 类: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 这个类现在暴露在全局对象上。 |
| v16.5.0 | 添加于: v16.5.0 |
:::

默认情况下，在不带参数的情况下调用 `readableStream.getReader()` 将返回一个 `ReadableStreamDefaultReader` 的实例。 默认读取器将通过流传递的数据块视为不透明值，这允许 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 通常与任何 JavaScript 值一起使用。

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**添加于: v16.5.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

创建一个新的 [\<ReadableStreamDefaultReader\>](/zh/nodejs/api/webstreams#class-readablestreamdefaultreader)，它被锁定到给定的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**添加于: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: 一个以 `undefined` 履行的 Promise。

取消 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 并返回一个 Promise，该 Promise 在底层流已取消时履行。

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**添加于: v16.5.0**

- 类型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当相关的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 关闭时以 `undefined` 履行，如果流出错或者在流完成关闭之前释放了读取器的锁，则会被拒绝。

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**添加于: v16.5.0**

- 返回: 一个以对象履行的 Promise:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

 

从底层 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 请求下一个数据块，并返回一个 Promise，该 Promise 在数据可用后履行。


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**新增于: v16.5.0**

释放此读取器在底层[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)上的锁定。

### 类: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 新增于: v16.5.0 |
:::

`ReadableStreamBYOBReader` 是面向字节的[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)的另一种使用者（这些流是在创建 `ReadableStream` 时，将 `underlyingSource.type` 设置为 `'bytes'` 而创建的）。

`BYOB` 是 "bring your own buffer"（自带缓冲区）的缩写。 这是一种允许更高效地读取面向字节的数据，从而避免不必要的复制的模式。

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**新增于: v16.5.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

创建一个新的 `ReadableStreamBYOBReader`，它被锁定到给定的[\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: 一个 fulfilled 状态的 promise，其值为 `undefined`。

取消 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 并返回一个 promise，该 promise 在底层流被取消时变为 fulfilled 状态。

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Added in: v16.5.0**

- 类型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当关联的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 关闭时变为 fulfilled 状态，其值为 `undefined`；如果流出错或在流完成关闭之前释放了 reader 的锁，则变为 rejected 状态。

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.7.0, v20.17.0 | 添加了 `min` 选项。 |
| v16.5.0 | Added in: v16.5.0 |
:::

- `view` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 如果设置了该值，则只有在 `min` 个元素可用时，返回的 promise 才会变为 fulfilled 状态。 如果未设置，则 promise 在至少一个元素可用时变为 fulfilled 状态。

- 返回: 一个 fulfilled 状态的 promise，其值为一个对象：
  - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

从底层 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 请求下一个数据块，并返回一个 promise，该 promise 在数据可用时变为 fulfilled 状态。

不要将池化的 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对象实例传递给此方法。 池化的 `Buffer` 对象是使用 `Buffer.allocUnsafe()` 或 `Buffer.from()` 创建的，或者通常由各种 `node:fs` 模块回调返回。 这些类型的 `Buffer` 使用一个共享的底层 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 对象，该对象包含所有池化的 `Buffer` 实例中的所有数据。 当一个 `Buffer`、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 或 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 被传递给 `readableStreamBYOBReader.read()` 时，该 view 的底层 `ArrayBuffer` 会被*分离 (detached)*，从而使可能存在于该 `ArrayBuffer` 上的所有现有视图都失效。 这可能会给您的应用程序带来灾难性的后果。


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**添加于: v16.5.0**

释放此读取器在底层 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 上的锁。

### 类: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**添加于: v16.5.0**

每个 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 都有一个控制器，负责流的队列的内部状态和管理。`ReadableStreamDefaultController` 是非面向字节的 `ReadableStream` 的默认控制器实现。

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**添加于: v16.5.0**

关闭此控制器关联的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**添加于: v16.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回剩余填充 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 队列的数据量。

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**添加于: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

将新的数据块追加到 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 的队列。

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**添加于: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

发出一个错误信号，导致 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 报错并关闭。

### 类: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.10.0 | 支持处理来自已释放读取器的 BYOB 拉取请求。 |
| v16.5.0 | 添加于: v16.5.0 |
:::

每个 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 都有一个控制器，负责流的队列的内部状态和管理。`ReadableByteStreamController` 用于面向字节的 `ReadableStream`。


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Added in: v16.5.0**

- Type: [\<ReadableStreamBYOBRequest\>](/zh/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Added in: v16.5.0**

关闭与此控制器关联的 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)。

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回填充 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 队列所需的剩余数据量。

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk`: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

将新的数据块追加到 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 的队列中。

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

发出错误信号，导致 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 发生错误并关闭。

### Class: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 添加于: v16.5.0 |
:::

当在面向字节的流中使用 `ReadableByteStreamController`，并且在使用 `ReadableStreamBYOBReader` 时，`readableByteStreamController.byobRequest` 属性提供对表示当前读取请求的 `ReadableStreamBYOBRequest` 实例的访问。 该对象用于获取对已提供的 `ArrayBuffer`/`TypedArray` 的访问权限，以便填充读取请求，并提供用于指示已提供数据的方法。


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**新增于: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

表示已经向 `readableStreamBYOBRequest.view` 写入了 `bytesWritten` 个字节。

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**新增于: v16.5.0**

- `view` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

表示请求已通过写入新的 `Buffer`、`TypedArray` 或 `DataView` 的字节来完成。

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**新增于: v16.5.0**

- 类型: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### 类: `WritableStream` {#class-writablestream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 新增于: v16.5.0 |
:::

`WritableStream` 是流数据发送到的目标。

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**新增于: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，在创建 `WritableStream` 时立即调用。
    - `controller` [\<WritableStreamDefaultController\>](/zh/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - 返回: `undefined` 或使用 `undefined` 履行的 promise。


    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，当数据块已写入 `WritableStream` 时调用。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/zh/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - 返回: 使用 `undefined` 履行的 promise。


    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，在 `WritableStream` 关闭时调用。
    - 返回: 使用 `undefined` 履行的 promise。


    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，用于突然关闭 `WritableStream`。
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: 使用 `undefined` 履行的 promise。


    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `type` 选项保留供将来使用，*必须*未定义。


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 应用背压之前的最大内部队列大小。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用户定义的函数，用于标识每个数据块的大小。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**新增于: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: 一个 fulfilled 状态的 promise，值为 `undefined`。

突然终止 `WritableStream`。 所有排队的写入都将被取消，并且它们相关的 promise 将被拒绝。

#### `writableStream.close()` {#writablestreamclose}

**新增于: v16.5.0**

- 返回: 一个 fulfilled 状态的 promise，值为 `undefined`。

在不再需要额外写入时关闭 `WritableStream`。

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**新增于: v16.5.0**

- 返回: [\<WritableStreamDefaultWriter\>](/zh/nodejs/api/webstreams#class-writablestreamdefaultwriter)

创建并返回一个新的 writer 实例，该实例可用于将数据写入 `WritableStream`。

#### `writableStream.locked` {#writablestreamlocked}

**新增于: v16.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

默认情况下，`writableStream.locked` 属性为 `false`，并且当此 `WritableStream` 附加了活动的 writer 时，该属性将切换为 `true`。

#### 使用 postMessage() 传输 {#transferring-with-postmessage_1}

可以使用 [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) 传输 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 实例。

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### 类: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 新增于: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**新增于: v16.5.0**

- `stream` [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

创建一个新的 `WritableStreamDefaultWriter`，该 writer 锁定到给定的 `WritableStream`。

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**新增于: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: 一个 fulfilled 状态的 promise，值为 `undefined`。

突然终止 `WritableStream`。 所有排队的写入都将被取消，并且它们相关的 promise 将被拒绝。


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**添加于: v16.5.0**

- 返回: 一个 fulfilled 的 Promise，其值为 `undefined`。

当不再预期有额外的写入时，关闭 `WritableStream`。

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**添加于: v16.5.0**

- 类型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当关联的 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 关闭时，fulfilled 值为 `undefined`；如果流发生错误或在流完成关闭之前释放了 writer 的锁，则会被 rejected。

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**添加于: v16.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

填充 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 队列所需的数据量。

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**添加于: v16.5.0**

- 类型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当 writer 准备好使用时，fulfilled 值为 `undefined`。

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**添加于: v16.5.0**

释放此 writer 在底层 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 上的锁。

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**添加于: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: 一个 fulfilled 的 Promise，其值为 `undefined`。

将新的数据块追加到 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 的队列中。

### 类: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 添加于: v16.5.0 |
:::

`WritableStreamDefaultController` 管理 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 的内部状态。

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**添加于: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

由用户代码调用，以表明在处理 `WritableStream` 数据时发生了错误。 调用后，[\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 将被中止，当前挂起的写入将被取消。


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- 类型: [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 当 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 被中止时，可以用于取消挂起的写入或关闭操作的 `AbortSignal`。

### 类: `TransformStream` {#class-transformstream}

::: info [历史记录]
| 版本    | 变更                                         |
| ------- | -------------------------------------------- |
| v18.0.0 | 此类现在在全局对象上公开。                       |
| v16.5.0 | 添加于: v16.5.0                             |
:::

`TransformStream` 由一个 [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) 和一个 [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream) 组成，它们连接在一起，以便写入 `WritableStream` 的数据在被推入 `ReadableStream` 的队列之前被接收，并可能被转换。

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**添加于: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在 `TransformStream` 创建时立即调用的用户定义函数。
    - `controller` [\<TransformStreamDefaultController\>](/zh/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 返回: `undefined` 或一个 fulfilled 状态的、值为 `undefined` 的 Promise
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个用户定义的函数，它接收并可能修改写入 `transformStream.writable` 的数据块，然后再将其转发到 `transformStream.readable`。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/zh/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 返回: 一个 fulfilled 状态的、值为 `undefined` 的 Promise。
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个用户定义的函数，在 `TransformStream` 的可写端关闭之前立即调用，标志着转换过程的结束。
    - `controller` [\<TransformStreamDefaultController\>](/zh/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 返回: 一个 fulfilled 状态的、值为 `undefined` 的 Promise。
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `readableType` 选项保留供将来使用，*必须*为 `undefined`。
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `writableType` 选项保留供将来使用，*必须*为 `undefined`。
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 施加背压之前的最大内部队列大小。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于标识每个数据块大小的用户定义函数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 施加背压之前的最大内部队列大小。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 用于标识每个数据块大小的用户定义函数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `transformStream.readable` {#transformstreamreadable}

**添加于: v16.5.0**

- 类型: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**添加于: v16.5.0**

- 类型: [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

#### 使用 postMessage() 传输 {#transferring-with-postmessage_2}

[\<TransformStream\>](/zh/nodejs/api/webstreams#class-transformstream) 实例可以使用 [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) 进行传输。

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### 类: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 添加于: v16.5.0 |
:::

`TransformStreamDefaultController` 管理 `TransformStream` 的内部状态。

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**添加于: v16.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

填充可读端队列所需的数据量。

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**添加于: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

将数据块追加到可读端的队列。

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**添加于: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

向可读端和可写端发出信号，表明在处理转换数据时发生了错误，导致两端突然关闭。

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**添加于: v16.5.0**

关闭传输的可读端，并导致可写端因错误而突然关闭。

### 类: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 添加于: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**新增于: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**新增于: v16.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**新增于: v16.5.0**

- 类型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### 类: `CountQueuingStrategy` {#class-countqueuingstrategy}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.5.0 | 新增于: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**新增于: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**新增于: v16.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**新增于: v16.5.0**

- 类型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### 类: `TextEncoderStream` {#class-textencoderstream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.6.0 | 新增于: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**新增于: v16.6.0**

创建一个新的 `TextEncoderStream` 实例。

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**新增于: v16.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextEncoderStream` 实例支持的编码。

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**新增于: v16.6.0**

- 类型: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**新增于: v16.6.0**

- 类型: [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

### 类: `TextDecoderStream` {#class-textdecoderstream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在暴露在全局对象上。 |
| v16.6.0 | 新增于: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**新增于: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 标识此 `TextDecoder` 实例支持的 `encoding`。 **默认值:** `'utf-8'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果解码失败是致命的，则为 `true`。
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时, `TextDecoderStream` 将在解码结果中包含字节顺序标记。 当为 `false` 时，字节顺序标记将从输出中删除。 此选项仅在 `encoding` 为 `'utf-8'`, `'utf-16be'` 或 `'utf-16le'` 时使用。 **默认值:** `false`。

创建一个新的 `TextDecoderStream` 实例。

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**新增于: v16.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextDecoderStream` 实例支持的编码。

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**新增于: v16.6.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果解码错误导致抛出 `TypeError`，则该值为 `true`。


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**新增于: v16.6.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果解码结果将包含字节顺序标记，则该值为 `true`。

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**新增于: v16.6.0**

- 类型: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**新增于: v16.6.0**

- 类型: [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

### 类: `CompressionStream` {#class-compressionstream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在在全局对象上公开。 |
| v17.0.0 | 新增于: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.2.0, v20.12.0 | format 现在接受 `deflate-raw` 值。 |
| v17.0.0 | 新增于: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'deflate'`、`'deflate-raw'` 或 `'gzip'` 之一。

#### `compressionStream.readable` {#compressionstreamreadable}

**新增于: v17.0.0**

- 类型: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**新增于: v17.0.0**

- 类型: [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)

### 类: `DecompressionStream` {#class-decompressionstream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 此类现在在全局对象上公开。 |
| v17.0.0 | 新增于: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.2.0, v20.12.0 | format 现在接受 `deflate-raw` 值。 |
| v17.0.0 | 新增于: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'deflate'`、`'deflate-raw'` 或 `'gzip'` 之一。

#### `decompressionStream.readable` {#decompressionstreamreadable}

**新增于: v17.0.0**

- 类型: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**新增于: v17.0.0**

- 类型: [\<WritableStream\>](/zh/nodejs/api/webstreams#class-writablestream)


### 实用程序消费者 {#utility-consumers}

**加入于: v16.7.0**

实用程序消费者函数为消费流提供通用选项。

它们可以通过以下方式访问：

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**加入于: v16.7.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 以包含流完整内容的 `ArrayBuffer` 履行。

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**加入于: v16.7.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 以包含流完整内容的 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 履行。

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**新增于: v16.7.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会得到一个包含流完整内容的 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**新增于: v16.7.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会得到流的内容，该内容会被解析为 UTF-8 编码的字符串，然后通过 `JSON.parse()` 传递。

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**新增于: v16.7.0**

- `stream` [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  使用解析为 UTF-8 编码字符串的流的内容来兑现。

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// 打印: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // 打印: from readable: 27
});
```
:::

