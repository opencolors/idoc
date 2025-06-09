---
title: Node.js Web Streams API
description: Documentation for the Web Streams API in Node.js, detailing how to work with streams for efficient data handling, including readable, writable, and transform streams.
head:
  - - meta
    - name: og:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentation for the Web Streams API in Node.js, detailing how to work with streams for efficient data handling, including readable, writable, and transform streams.
  - - meta
    - name: twitter:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentation for the Web Streams API in Node.js, detailing how to work with streams for efficient data handling, including readable, writable, and transform streams.
---

# Web Streams API {#web-streams-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | Use of this API no longer emit a runtime warning. |
| v16.5.0 | Added in: v16.5.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

An implementation of the [WHATWG Streams Standard](https://streams.spec.whatwg.org/).

## Overview {#overview}

The [WHATWG Streams Standard](https://streams.spec.whatwg.org/) (or "web streams") defines an API for handling streaming data. It is similar to the Node.js [Streams](/nodejs/api/stream) API but emerged later and has become the "standard" API for streaming data across many JavaScript environments.

There are three primary types of objects:

- `ReadableStream` - Represents a source of streaming data.
- `WritableStream` - Represents a destination for streaming data.
- `TransformStream` - Represents an algorithm for transforming streaming data.

### Example `ReadableStream` {#example-readablestream}

This example creates a simple `ReadableStream` that pushes the current `performance.now()` timestamp once every second forever. An async iterable is used to read the data from the stream.



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

### Class: `ReadableStream` {#class-readablestream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Added in: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is invoked immediately when the `ReadableStream` is created. 
    - `controller` [\<ReadableStreamDefaultController\>](/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Returns: `undefined` or a promise fulfilled with `undefined`.
  
 
    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is called repeatedly when the `ReadableStream` internal queue is not full. The operation may be sync or async. If async, the function will not be called again until the previously returned promise is fulfilled. 
    - `controller` [\<ReadableStreamDefaultController\>](/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is called when the `ReadableStream` is canceled. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'bytes'` or `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Used only when `type` is equal to `'bytes'`. When set to a non-zero value a view buffer is automatically allocated to `ReadableByteStreamController.byobRequest`. When not set one must use stream's internal queues to transfer data via the default reader `ReadableStreamDefaultReader`.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The maximum internal queue size before backpressure is applied.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function used to identify the size of each chunk of data. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 

#### `readableStream.locked` {#readablestreamlocked}

**Added in: v16.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Set to `true` if there is an active reader for this [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream).

The `readableStream.locked` property is `false` by default, and is switched to `true` while there is an active reader consuming the stream's data.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: A promise fulfilled with `undefined` once cancelation has been completed.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Added in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` or `undefined`
  
 
- Returns: [\<ReadableStreamDefaultReader\>](/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/nodejs/api/webstreams#class-readablestreambyobreader)



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

Causes the `readableStream.locked` to be `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Added in: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `readable` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) The `ReadableStream` to which `transform.writable` will push the potentially modified data it receives from this `ReadableStream`.
    - `writable` [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) The `WritableStream` to which this `ReadableStream`'s data will be written.
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, errors in this `ReadableStream` will not cause `transform.writable` to be aborted.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, errors in the destination `transform.writable` do not cause this `ReadableStream` to be canceled.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, closing this `ReadableStream` does not cause `transform.writable` to be closed.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows the transfer of data to be canceled using an [\<AbortController\>](/nodejs/api/globals#class-abortcontroller).
  
 
- Returns: [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) From `transform.readable`.

Connects this [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) to the pair of [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) and [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) provided in the `transform` argument such that the data from this [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) is written in to `transform.writable`, possibly transformed, then pushed to `transform.readable`. Once the pipeline is configured, `transform.readable` is returned.

Causes the `readableStream.locked` to be `true` while the pipe operation is active.



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

**Added in: v16.5.0**

- `destination` [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) A [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) to which this `ReadableStream`'s data will be written.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, errors in this `ReadableStream` will not cause `destination` to be aborted.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, errors in the `destination` will not cause this `ReadableStream` to be canceled.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, closing this `ReadableStream` does not cause `destination` to be closed.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows the transfer of data to be canceled using an [\<AbortController\>](/nodejs/api/globals#class-abortcontroller).
  
 
- Returns: A promise fulfilled with `undefined`

Causes the `readableStream.locked` to be `true` while the pipe operation is active.

#### `readableStream.tee()` {#readablestreamtee}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.10.0, v16.18.0 | Support teeing a readable byte stream. |
| v16.5.0 | Added in: v16.5.0 |
:::

- Returns: [\<ReadableStream[]\>](/nodejs/api/webstreams#class-readablestream)

Returns a pair of new [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) instances to which this `ReadableStream`'s data will be forwarded. Each will receive the same data.

Causes the `readableStream.locked` to be `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Added in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, prevents the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) from being closed when the async iterator abruptly terminates. **Default**: `false`.
  
 

Creates and returns an async iterator usable for consuming this `ReadableStream`'s data.

Causes the `readableStream.locked` to be `true` while the async iterator is active.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```
#### Async Iteration {#async-iteration}

The [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) object supports the async iterator protocol using `for await` syntax.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
The async iterator will consume the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) until it terminates.

By default, if the async iterator exits early (via either a `break`, `return`, or a `throw`), the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) will be closed. To prevent automatic closing of the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream), use the `readableStream.values()` method to acquire the async iterator and set the `preventCancel` option to `true`.

The [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) must not be locked (that is, it must not have an existing active reader). During the async iteration, the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) will be locked.

#### Transferring with `postMessage()` {#transferring-with-postmessage}

A [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) instance can be transferred using a [\<MessagePort\>](/nodejs/api/worker_threads#class-messageport).

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

**Added in: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Object implementing the `Symbol.asyncIterator` or `Symbol.iterator` iterable protocol.

A utility method that creates a new [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) from an iterable.



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

To pipe the resulting [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) into a [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) the [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) should yield a sequence of [\<Buffer\>](/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), or [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) objects.



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';
import { Buffer } from 'node:buffer';

async function* asyncIterableGenerator() {
  yield Buffer.from('a');
  yield Buffer.from('b');
  yield Buffer.from('c');
}

const stream = ReadableStream.from(asyncIterableGenerator());

await stream.pipeTo(createWritableStreamSomehow());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');
const { Buffer } = require('node:buffer');

async function* asyncIterableGenerator() {
  yield Buffer.from('a');
  yield Buffer.from('b');
  yield Buffer.from('c');
}

const stream = ReadableStream.from(asyncIterableGenerator());

(async () => {
  await stream.pipeTo(createWritableStreamSomehow());
})();
```
:::

### Class: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

By default, calling `readableStream.getReader()` with no arguments will return an instance of `ReadableStreamDefaultReader`. The default reader treats the chunks of data passed through the stream as opaque values, which allows the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) to work with generally any JavaScript value.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Added in: v16.5.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

Creates a new [\<ReadableStreamDefaultReader\>](/nodejs/api/webstreams#class-readablestreamdefaultreader) that is locked to the given [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: A promise fulfilled with `undefined`.

Cancels the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) and returns a promise that is fulfilled when the underlying stream has been canceled.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Added in: v16.5.0**

- Type: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with `undefined` when the associated [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) is closed or rejected if the stream errors or the reader's lock is released before the stream finishes closing.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Added in: v16.5.0**

- Returns: A promise fulfilled with an object: 
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Requests the next chunk of data from the underlying [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) and returns a promise that is fulfilled with the data once it is available.

#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Added in: v16.5.0**

Releases this reader's lock on the underlying [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream).

### Class: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

The `ReadableStreamBYOBReader` is an alternative consumer for byte-oriented [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)s (those that are created with `underlyingSource.type` set equal to `'bytes'` when the `ReadableStream` was created).

The `BYOB` is short for "bring your own buffer". This is a pattern that allows for more efficient reading of byte-oriented data that avoids extraneous copying.

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

**Added in: v16.5.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

Creates a new `ReadableStreamBYOBReader` that is locked to the given [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream).

#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: A promise fulfilled with `undefined`.

Cancels the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) and returns a promise that is fulfilled when the underlying stream has been canceled.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Added in: v16.5.0**

- Type: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with `undefined` when the associated [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) is closed or rejected if the stream errors or the reader's lock is released before the stream finishes closing.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.7.0, v20.17.0 | Added `min` option. |
| v16.5.0 | Added in: v16.5.0 |
:::

- `view` [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) When set, the returned promise will only be fulfilled as soon as `min` number of elements are available. When not set, the promise fulfills when at least one element is available.
  
 
- Returns: A promise fulfilled with an object: 
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Requests the next chunk of data from the underlying [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) and returns a promise that is fulfilled with the data once it is available.

Do not pass a pooled [\<Buffer\>](/nodejs/api/buffer#class-buffer) object instance in to this method. Pooled `Buffer` objects are created using `Buffer.allocUnsafe()`, or `Buffer.from()`, or are often returned by various `node:fs` module callbacks. These types of `Buffer`s use a shared underlying [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) object that contains all of the data from all of the pooled `Buffer` instances. When a `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), or [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) is passed in to `readableStreamBYOBReader.read()`, the view's underlying `ArrayBuffer` is *detached*, invalidating all existing views that may exist on that `ArrayBuffer`. This can have disastrous consequences for your application.

#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Added in: v16.5.0**

Releases this reader's lock on the underlying [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream).

### Class: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Added in: v16.5.0**

Every [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) has a controller that is responsible for the internal state and management of the stream's queue. The `ReadableStreamDefaultController` is the default controller implementation for `ReadableStream`s that are not byte-oriented.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Added in: v16.5.0**

Closes the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) to which this controller is associated.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Returns the amount of data remaining to fill the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)'s queue.

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Appends a new chunk of data to the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)'s queue.

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signals an error that causes the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) to error and close.

### Class: `ReadableByteStreamController` {#class-readablebytestreamcontroller}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.10.0 | Support handling a BYOB pull request from a released reader. |
| v16.5.0 | Added in: v16.5.0 |
:::

Every [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) has a controller that is responsible for the internal state and management of the stream's queue. The `ReadableByteStreamController` is for byte-oriented `ReadableStream`s.

#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Added in: v16.5.0**

- Type: [\<ReadableStreamBYOBRequest\>](/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Added in: v16.5.0**

Closes the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) to which this controller is associated.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Returns the amount of data remaining to fill the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)'s queue.

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk`: [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Appends a new chunk of data to the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)'s queue.

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signals an error that causes the [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) to error and close.

### Class: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

When using `ReadableByteStreamController` in byte-oriented streams, and when using the `ReadableStreamBYOBReader`, the `readableByteStreamController.byobRequest` property provides access to a `ReadableStreamBYOBRequest` instance that represents the current read request. The object is used to gain access to the `ArrayBuffer`/`TypedArray` that has been provided for the read request to fill, and provides methods for signaling that the data has been provided.

#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Added in: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Signals that a `bytesWritten` number of bytes have been written to `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Added in: v16.5.0**

- `view` [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Signals that the request has been fulfilled with bytes written to a new `Buffer`, `TypedArray`, or `DataView`.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Added in: v16.5.0**

- Type: [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Class: `WritableStream` {#class-writablestream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

The `WritableStream` is a destination to which stream data is sent.

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

**Added in: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is invoked immediately when the `WritableStream` is created. 
    - `controller` [\<WritableStreamDefaultController\>](/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Returns: `undefined` or a promise fulfilled with `undefined`.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is invoked when a chunk of data has been written to the `WritableStream`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is called when the `WritableStream` is closed. 
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is called to abruptly close the `WritableStream`. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The `type` option is reserved for future use and *must* be undefined.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The maximum internal queue size before backpressure is applied.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function used to identify the size of each chunk of data. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 

#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: A promise fulfilled with `undefined`.

Abruptly terminates the `WritableStream`. All queued writes will be canceled with their associated promises rejected.

#### `writableStream.close()` {#writablestreamclose}

**Added in: v16.5.0**

- Returns: A promise fulfilled with `undefined`.

Closes the `WritableStream` when no additional writes are expected.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Added in: v16.5.0**

- Returns: [\<WritableStreamDefaultWriter\>](/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Creates and returns a new writer instance that can be used to write data into the `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**Added in: v16.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

The `writableStream.locked` property is `false` by default, and is switched to `true` while there is an active writer attached to this `WritableStream`.

#### Transferring with postMessage() {#transferring-with-postmessage_1}

A [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) instance can be transferred using a [\<MessagePort\>](/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Class: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Added in: v16.5.0**

- `stream` [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)

Creates a new `WritableStreamDefaultWriter` that is locked to the given `WritableStream`.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: A promise fulfilled with `undefined`.

Abruptly terminates the `WritableStream`. All queued writes will be canceled with their associated promises rejected.

#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Added in: v16.5.0**

- Returns: A promise fulfilled with `undefined`.

Closes the `WritableStream` when no additional writes are expected.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Added in: v16.5.0**

- Type: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with `undefined` when the associated [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) is closed or rejected if the stream errors or the writer's lock is released before the stream finishes closing.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The amount of data required to fill the [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)'s queue.

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Added in: v16.5.0**

- Type: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with `undefined` when the writer is ready to be used.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Added in: v16.5.0**

Releases this writer's lock on the underlying [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream).

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Added in: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: A promise fulfilled with `undefined`.

Appends a new chunk of data to the [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)'s queue.

### Class: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

The `WritableStreamDefaultController` manages the [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)'s internal state.

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Called by user-code to signal that an error has occurred while processing the `WritableStream` data. When called, the [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) will be aborted, with currently pending writes canceled.

#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Type: [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An `AbortSignal` that can be used to cancel pending write or close operations when a [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) is aborted.

### Class: `TransformStream` {#class-transformstream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

A `TransformStream` consists of a [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) and a [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream) that are connected such that the data written to the `WritableStream` is received, and potentially transformed, before being pushed into the `ReadableStream`'s queue.

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

**Added in: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is invoked immediately when the `TransformStream` is created. 
    - `controller` [\<TransformStreamDefaultController\>](/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Returns: `undefined` or a promise fulfilled with `undefined`
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that receives, and potentially modifies, a chunk of data written to `transformStream.writable`, before forwarding that on to `transformStream.readable`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function that is called immediately before the writable side of the `TransformStream` is closed, signaling the end of the transformation process. 
    - `controller` [\<TransformStreamDefaultController\>](/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Returns: A promise fulfilled with `undefined`.
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) the `readableType` option is reserved for future use and *must* be `undefined`.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) the `writableType` option is reserved for future use and *must* be `undefined`.
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The maximum internal queue size before backpressure is applied.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function used to identify the size of each chunk of data. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The maximum internal queue size before backpressure is applied.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A user-defined function used to identify the size of each chunk of data. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 

#### `transformStream.readable` {#transformstreamreadable}

**Added in: v16.5.0**

- Type: [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Added in: v16.5.0**

- Type: [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)

#### Transferring with postMessage() {#transferring-with-postmessage_2}

A [\<TransformStream\>](/nodejs/api/webstreams#class-transformstream) instance can be transferred using a [\<MessagePort\>](/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Class: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

The `TransformStreamDefaultController` manages the internal state of the `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The amount of data required to fill the readable side's queue.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Appends a chunk of data to the readable side's queue.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signals to both the readable and writable side that an error has occurred while processing the transform data, causing both sides to be abruptly closed.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Added in: v16.5.0**

Closes the readable side of the transport and causes the writable side to be abruptly closed with an error.

### Class: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Added in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Added in: v16.5.0**

- Type: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Class: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Added in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Added in: v16.5.0**

- Type: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Class: `TextEncoderStream` {#class-textencoderstream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.6.0 | Added in: v16.6.0 |
:::

#### `new TextEncoderStream()` {#new-textencoderstream}

**Added in: v16.6.0**

Creates a new `TextEncoderStream` instance.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Added in: v16.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The encoding supported by the `TextEncoderStream` instance.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Added in: v16.6.0**

- Type: [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Added in: v16.6.0**

- Type: [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)

### Class: `TextDecoderStream` {#class-textdecoderstream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.6.0 | Added in: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Added in: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifies the `encoding` that this `TextDecoder` instance supports. **Default:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` if decoding failures are fatal.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the `TextDecoderStream` will include the byte order mark in the decoded result. When `false`, the byte order mark will be removed from the output. This option is only used when `encoding` is `'utf-8'`, `'utf-16be'`, or `'utf-16le'`. **Default:** `false`.
  
 

Creates a new `TextDecoderStream` instance.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Added in: v16.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The encoding supported by the `TextDecoderStream` instance.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Added in: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

The value will be `true` if decoding errors result in a `TypeError` being thrown.

#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Added in: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

The value will be `true` if the decoding result will include the byte order mark.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Added in: v16.6.0**

- Type: [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Added in: v16.6.0**

- Type: [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)

### Class: `CompressionStream` {#class-compressionstream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v17.0.0 | Added in: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.2.0, v20.12.0 | format now accepts `deflate-raw` value. |
| v17.0.0 | Added in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) One of `'deflate'`, `'deflate-raw'`, or `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Added in: v17.0.0**

- Type: [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Added in: v17.0.0**

- Type: [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)

### Class: `DecompressionStream` {#class-decompressionstream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v17.0.0 | Added in: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.2.0, v20.12.0 | format now accepts `deflate-raw` value. |
| v17.0.0 | Added in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) One of `'deflate'`, `'deflate-raw'`, or `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Added in: v17.0.0**

- Type: [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Added in: v17.0.0**

- Type: [\<WritableStream\>](/nodejs/api/webstreams#class-writablestream)

### Utility Consumers {#utility-consumers}

**Added in: v16.7.0**

The utility consumer functions provide common options for consuming streams.

They are accessed using:



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

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an `ArrayBuffer` containing the full contents of the stream.



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

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<Blob\>](/nodejs/api/buffer#class-blob) containing the full contents of the stream.



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

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<Buffer\>](/nodejs/api/buffer#class-buffer) containing the full contents of the stream.



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

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with the contents of the stream parsed as a UTF-8 encoded string that is then passed through `JSON.parse()`.



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

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with the contents of the stream parsed as a UTF-8 encoded string.



::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

