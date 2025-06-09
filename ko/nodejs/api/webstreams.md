---
title: Node.js Web Streams API
description: Node.js에서 Web Streams API에 대한 문서로, 효율적인 데이터 처리를 위한 스트림 작업 방법을 설명하며, 읽기 가능, 쓰기 가능, 변환 스트림을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 Web Streams API에 대한 문서로, 효율적인 데이터 처리를 위한 스트림 작업 방법을 설명하며, 읽기 가능, 쓰기 가능, 변환 스트림을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 Web Streams API에 대한 문서로, 효율적인 데이터 처리를 위한 스트림 작업 방법을 설명하며, 읽기 가능, 쓰기 가능, 변환 스트림을 포함합니다.
---


# Web Streams API {#web-streams-api}

::: info [History]
| 버전 | 변경 사항 |
|---|---|
| v21.0.0 | 더 이상 실험적이지 않습니다. |
| v18.0.0 | 이 API를 사용해도 더 이상 런타임 경고가 발생하지 않습니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::

::: tip [Stable: 2 - 안정적]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

[WHATWG Streams Standard](https://streams.spec.whatwg.org/)의 구현입니다.

## 개요 {#overview}

[WHATWG Streams Standard](https://streams.spec.whatwg.org/) (또는 "웹 스트림")는 스트리밍 데이터 처리를 위한 API를 정의합니다. 이는 Node.js [Streams](/ko/nodejs/api/stream) API와 유사하지만 나중에 등장했으며 여러 JavaScript 환경에서 스트리밍 데이터를 위한 "표준" API가 되었습니다.

다음과 같은 세 가지 주요 유형의 객체가 있습니다.

- `ReadableStream` - 스트리밍 데이터의 소스를 나타냅니다.
- `WritableStream` - 스트리밍 데이터의 대상을 나타냅니다.
- `TransformStream` - 스트리밍 데이터 변환 알고리즘을 나타냅니다.

### `ReadableStream` 예제 {#example-readablestream}

이 예제는 현재 `performance.now()` 타임스탬프를 1초마다 영원히 푸시하는 간단한 `ReadableStream`을 만듭니다. 비동기 반복기는 스트림에서 데이터를 읽는 데 사용됩니다.

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

### 클래스: `ReadableStream` {#class-readablestream}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스가 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**추가됨: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `ReadableStream`이 생성될 때 즉시 호출되는 사용자 정의 함수입니다.
    - `controller` [\<ReadableStreamDefaultController\>](/ko/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ko/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - 반환: `undefined` 또는 `undefined`로 이행되는 프로미스.
  
 
    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `ReadableStream` 내부 큐가 가득 차지 않았을 때 반복적으로 호출되는 사용자 정의 함수입니다. 작업은 동기 또는 비동기일 수 있습니다. 비동기인 경우 이전에 반환된 프로미스가 이행될 때까지 함수가 다시 호출되지 않습니다.
    - `controller` [\<ReadableStreamDefaultController\>](/ko/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ko/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - 반환: `undefined`로 이행되는 프로미스.
  
 
    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `ReadableStream`이 취소될 때 호출되는 사용자 정의 함수입니다.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: `undefined`로 이행되는 프로미스.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'bytes'` 또는 `undefined`여야 합니다.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `type`이 `'bytes'`와 같을 때만 사용됩니다. 0이 아닌 값으로 설정하면 보기 버퍼가 `ReadableByteStreamController.byobRequest`에 자동으로 할당됩니다. 설정하지 않으면 스트림의 내부 큐를 사용하여 기본 판독기 `ReadableStreamDefaultReader`를 통해 데이터를 전송해야 합니다.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 배압이 적용되기 전의 최대 내부 큐 크기입니다.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 각 데이터 청크의 크기를 식별하는 데 사용되는 사용자 정의 함수입니다.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `readableStream.locked` {#readablestreamlocked}

**추가된 버전: v16.5.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에 활성 판독기가 있으면 `true`로 설정됩니다.

`readableStream.locked` 속성은 기본적으로 `false`이며 스트림의 데이터를 소비하는 활성 판독기가 있는 동안 `true`로 전환됩니다.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**추가된 버전: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: 취소가 완료되면 `undefined`로 이행되는 프로미스.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**추가된 버전: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` 또는 `undefined`
  
 
- 반환: [\<ReadableStreamDefaultReader\>](/ko/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/ko/nodejs/api/webstreams#class-readablestreambyobreader)



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

`readableStream.locked`가 `true`가 되도록 합니다.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**추가된 버전: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) `transform.writable`이 이 `ReadableStream`에서 수신하는 잠재적으로 수정된 데이터를 푸시할 `ReadableStream`.
    - `writable` [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 이 `ReadableStream`의 데이터가 기록될 `WritableStream`.
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 이 `ReadableStream`의 오류로 인해 `transform.writable`이 중단되지 않습니다.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 대상 `transform.writable`의 오류로 인해 이 `ReadableStream`이 취소되지 않습니다.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 이 `ReadableStream`을 닫아도 `transform.writable`이 닫히지 않습니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) [\<AbortController\>](/ko/nodejs/api/globals#class-abortcontroller)를 사용하여 데이터 전송을 취소할 수 있습니다.
  
 
- 반환: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) `transform.readable`에서.

이 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 `transform` 인수에 제공된 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) 및 [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 쌍에 연결하여 이 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)의 데이터가 `transform.writable`에 기록되고, 잠재적으로 변환된 다음 `transform.readable`로 푸시됩니다. 파이프라인이 구성되면 `transform.readable`이 반환됩니다.

파이프 작업이 활성 상태인 동안 `readableStream.locked`가 `true`가 되도록 합니다.



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

- `destination` [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 이 `ReadableStream`의 데이터가 쓰여질 [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 이 `ReadableStream`의 오류는 `destination`을 중단시키지 않습니다.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `destination`의 오류는 이 `ReadableStream`을 취소시키지 않습니다.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 이 `ReadableStream`을 닫는다고 해서 `destination`이 닫히지는 않습니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) [\<AbortController\>](/ko/nodejs/api/globals#class-abortcontroller)를 사용하여 데이터 전송을 취소할 수 있습니다.
  
 
- 반환: `undefined`로 이행되는 프로미스

파이프 작동이 활성인 동안 `readableStream.locked`가 `true`가 되게 합니다.

#### `readableStream.tee()` {#readablestreamtee}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.10.0, v16.18.0 | 읽을 수 있는 바이트 스트림 티 지원. |
| v16.5.0 | Added in: v16.5.0 |
:::

- 반환: [\<ReadableStream[]\>](/ko/nodejs/api/webstreams#class-readablestream)

이 `ReadableStream`의 데이터가 전달될 새로운 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) 인스턴스 쌍을 반환합니다. 각 인스턴스는 동일한 데이터를 받게 됩니다.

`readableStream.locked`가 `true`가 되게 합니다.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Added in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 비동기 반복자가 갑자기 종료될 때 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 닫히지 않도록 합니다. **기본값**: `false`.
  
 

이 `ReadableStream`의 데이터를 사용하는 데 사용할 수 있는 비동기 반복기를 생성하고 반환합니다.

비동기 반복기가 활성인 동안 `readableStream.locked`가 `true`가 되게 합니다.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### 비동기 반복 {#async-iteration}

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) 객체는 `for await` 구문을 사용하여 비동기 반복기 프로토콜을 지원합니다.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
비동기 반복기는 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 종료될 때까지 소비합니다.

기본적으로 비동기 반복기가 일찍 종료되면 (`break`, `return` 또는 `throw`를 통해) [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 닫힙니다. [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)의 자동 닫힘을 방지하려면 `readableStream.values()` 메서드를 사용하여 비동기 반복기를 획득하고 `preventCancel` 옵션을 `true`로 설정하세요.

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)은 잠겨서는 안 됩니다 (즉, 기존 활성 판독기가 없어야 합니다). 비동기 반복 중에 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 잠깁니다.

#### `postMessage()`로 전송하기 {#transferring-with-postmessage}

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) 인스턴스는 [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)를 사용하여 전송할 수 있습니다.

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

**추가된 버전: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) `Symbol.asyncIterator` 또는 `Symbol.iterator` 반복기 프로토콜을 구현하는 객체입니다.

반복기에서 새 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 만드는 유틸리티 메서드입니다.

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


### 클래스: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::

기본적으로, 인수 없이 `readableStream.getReader()`를 호출하면 `ReadableStreamDefaultReader`의 인스턴스가 반환됩니다. 기본 리더는 스트림을 통해 전달되는 데이터 청크를 불투명한 값으로 취급하여 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 일반적으로 모든 JavaScript 값과 함께 작동할 수 있도록 합니다.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**추가됨: v16.5.0**

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

주어진 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에 잠긴 새로운 [\<ReadableStreamDefaultReader\>](/ko/nodejs/api/webstreams#class-readablestreamdefaultreader)를 생성합니다.

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**추가됨: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: `undefined`로 이행되는 프로미스.

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 취소하고 기본 스트림이 취소되었을 때 이행되는 프로미스를 반환합니다.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**추가됨: v16.5.0**

- 유형: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 연결된 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 닫힐 때 `undefined`로 이행되거나 스트림 오류가 발생하거나 스트림이 닫히기 전에 리더의 잠금이 해제되면 거부됩니다.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**추가됨: v16.5.0**

- 반환: 객체로 이행되는 프로미스:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

기본 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에서 다음 데이터 청크를 요청하고 사용 가능해지면 데이터로 이행되는 프로미스를 반환합니다.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Added in: v16.5.0**

기본 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에서 이 리더의 잠금을 해제합니다.

### Class: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | 이 클래스가 이제 전역 객체에 노출됩니다. |
| v16.5.0 | Added in: v16.5.0 |
:::

`ReadableStreamBYOBReader`는 바이트 지향 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에 대한 대안적인 소비자입니다 ([\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 생성될 때 `underlyingSource.type`이 `'bytes'`로 설정되어 생성된 스트림).

`BYOB`는 "bring your own buffer"의 약자입니다. 이는 불필요한 복사를 피하면서 바이트 지향 데이터를 보다 효율적으로 읽을 수 있도록 하는 패턴입니다.

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

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

주어진 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에 잠긴 새 `ReadableStreamBYOBReader`를 만듭니다.


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: `undefined`로 이행되는 Promise를 반환합니다.

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 취소하고, 기본 스트림이 취소되었을 때 이행되는 Promise를 반환합니다.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Added in: v16.5.0**

- 타입: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 연결된 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)이 닫히면 `undefined`로 이행되고, 스트림에 오류가 발생하거나 스트림이 닫히기 전에 리더의 잠금이 해제되면 거부됩니다.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.7.0, v20.17.0 | `min` 옵션이 추가되었습니다. |
| v16.5.0 | Added in: v16.5.0 |
:::

- `view` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 설정되면 반환된 Promise는 `min` 개수의 요소가 사용 가능해지는 즉시 이행됩니다. 설정되지 않으면 Promise는 최소한 하나의 요소를 사용할 수 있을 때 이행됩니다.
  
 
- 반환: 객체로 이행되는 Promise를 반환합니다.
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

기본 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에서 다음 데이터 청크를 요청하고 데이터가 사용 가능해지면 해당 데이터로 이행되는 Promise를 반환합니다.

풀링된 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체 인스턴스를 이 메서드에 전달하지 마십시오. 풀링된 `Buffer` 객체는 `Buffer.allocUnsafe()` 또는 `Buffer.from()`을 사용하여 생성되거나 다양한 `node:fs` 모듈 콜백에 의해 반환되는 경우가 많습니다. 이러한 유형의 `Buffer`는 모든 풀링된 `Buffer` 인스턴스의 모든 데이터를 포함하는 공유 기본 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 객체를 사용합니다. `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 또는 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)가 `readableStreamBYOBReader.read()`에 전달되면 뷰의 기본 `ArrayBuffer`가 *분리*되어 해당 `ArrayBuffer`에 존재할 수 있는 기존 뷰가 모두 무효화됩니다. 이는 애플리케이션에 치명적인 결과를 초래할 수 있습니다.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Added in: v16.5.0**

기본 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에 대한 이 판독기의 잠금을 해제합니다.

### 클래스: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Added in: v16.5.0**

모든 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에는 스트림 큐의 내부 상태 및 관리를 담당하는 컨트롤러가 있습니다. `ReadableStreamDefaultController`는 바이트 지향이 아닌 `ReadableStream`에 대한 기본 컨트롤러 구현입니다.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Added in: v16.5.0**

이 컨트롤러가 연결된 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 닫습니다.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Added in: v16.5.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) 큐를 채우는 데 남은 데이터 양을 반환합니다.

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) 큐에 새로운 데이터 청크를 추가합니다.

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에서 오류가 발생하여 닫히도록 하는 오류를 알립니다.

### 클래스: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v18.10.0 | 릴리스된 판독기에서 BYOB 풀 요청 처리를 지원합니다. |
| v16.5.0 | Added in: v16.5.0 |
:::

모든 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에는 스트림 큐의 내부 상태 및 관리를 담당하는 컨트롤러가 있습니다. `ReadableByteStreamController`는 바이트 지향 `ReadableStream`을 위한 것입니다.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Added in: v16.5.0**

- 유형: [\<ReadableStreamBYOBRequest\>](/ko/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Added in: v16.5.0**

이 컨트롤러가 연결된 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 닫습니다.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Added in: v16.5.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)의 큐를 채우기 위해 남아 있는 데이터 양을 반환합니다.

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk`: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

새로운 데이터 청크를 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)의 큐에 추가합니다.

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)을 오류 발생시키고 닫히게 하는 오류를 알립니다.

### 클래스: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | Added in: v16.5.0 |
:::

바이트 지향 스트림에서 `ReadableByteStreamController`를 사용하고 `ReadableStreamBYOBReader`를 사용할 때, `readableByteStreamController.byobRequest` 속성은 현재 읽기 요청을 나타내는 `ReadableStreamBYOBRequest` 인스턴스에 대한 액세스를 제공합니다. 이 객체는 채우기 위해 읽기 요청에 제공된 `ArrayBuffer`/`TypedArray`에 대한 액세스를 얻고 데이터가 제공되었음을 알리는 메서드를 제공하는 데 사용됩니다.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**추가된 버전: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`bytesWritten` 바이트 수가 `readableStreamBYOBRequest.view`에 쓰여졌음을 알립니다.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**추가된 버전: v16.5.0**

- `view` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

새 `Buffer`, `TypedArray` 또는 `DataView`에 쓰여진 바이트로 요청이 완료되었음을 알립니다.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**추가된 버전: v16.5.0**

- 유형: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### 클래스: `WritableStream` {#class-writablestream}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가된 버전: v16.5.0 |
:::

`WritableStream`은 스트림 데이터가 전송되는 대상입니다.

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

**추가된 버전: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `WritableStream`이 생성될 때 즉시 호출되는 사용자 정의 함수입니다. 
    - `controller` [\<WritableStreamDefaultController\>](/ko/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - 반환 값: `undefined` 또는 `undefined`로 완료된 Promise입니다.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 데이터 덩어리가 `WritableStream`에 쓰여질 때 호출되는 사용자 정의 함수입니다. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/ko/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - 반환 값: `undefined`로 완료된 Promise입니다.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `WritableStream`이 닫힐 때 호출되는 사용자 정의 함수입니다. 
    - 반환 값: `undefined`로 완료된 Promise입니다.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `WritableStream`을 갑자기 닫기 위해 호출되는 사용자 정의 함수입니다. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환 값: `undefined`로 완료된 Promise입니다.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `type` 옵션은 나중을 위해 예약되어 있으며 *반드시* undefined여야 합니다.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 백프레셔가 적용되기 전의 최대 내부 큐 크기입니다.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 각 데이터 덩어리의 크기를 식별하는 데 사용되는 사용자 정의 함수입니다. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환 값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**추가된 버전: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환값: `undefined`로 이행되는 프로미스.

`WritableStream`을 갑자기 종료합니다. 대기열에 있는 모든 쓰기가 취소되고 관련 프로미스가 거부됩니다.

#### `writableStream.close()` {#writablestreamclose}

**추가된 버전: v16.5.0**

- 반환값: `undefined`로 이행되는 프로미스.

더 이상 쓰기가 예상되지 않을 때 `WritableStream`을 닫습니다.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**추가된 버전: v16.5.0**

- 반환값: [\<WritableStreamDefaultWriter\>](/ko/nodejs/api/webstreams#class-writablestreamdefaultwriter)

`WritableStream`에 데이터를 쓰는 데 사용할 수 있는 새 writer 인스턴스를 만들고 반환합니다.

#### `writableStream.locked` {#writablestreamlocked}

**추가된 버전: v16.5.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`writableStream.locked` 속성은 기본적으로 `false`이며, 이 `WritableStream`에 연결된 활성 writer가 있는 동안 `true`로 전환됩니다.

#### postMessage()를 사용한 전송 {#transferring-with-postmessage_1}

[\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 인스턴스는 [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)를 사용하여 전송할 수 있습니다.

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### 클래스: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가된 버전: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**추가된 버전: v16.5.0**

- `stream` [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

지정된 `WritableStream`에 잠긴 새 `WritableStreamDefaultWriter`를 만듭니다.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**추가된 버전: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환값: `undefined`로 이행되는 프로미스.

`WritableStream`을 갑자기 종료합니다. 대기열에 있는 모든 쓰기가 취소되고 관련 프로미스가 거부됩니다.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**추가된 버전: v16.5.0**

- 반환값: `undefined`로 이행되는 Promise.

추가 쓰기가 예상되지 않을 때 `WritableStream`을 닫습니다.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**추가된 버전: v16.5.0**

- 타입: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 연결된 [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)이 닫힐 때 `undefined`로 이행되거나 스트림 오류가 발생하거나 스트림이 닫히기 전에 작성기의 잠금이 해제되면 거부됩니다.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**추가된 버전: v16.5.0**

- 타입: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)의 큐를 채우는 데 필요한 데이터 양입니다.

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**추가된 버전: v16.5.0**

- 타입: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 작성기를 사용할 준비가 되면 `undefined`로 이행됩니다.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**추가된 버전: v16.5.0**

기본 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)에 대한 이 작성기의 잠금을 해제합니다.

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**추가된 버전: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환값: `undefined`로 이행되는 Promise.

[\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)의 큐에 새로운 데이터 청크를 추가합니다.

### 클래스: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가된 버전: v16.5.0 |
:::

`WritableStreamDefaultController`는 [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)의 내부 상태를 관리합니다.

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**추가된 버전: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

사용자 코드가 `WritableStream` 데이터를 처리하는 동안 오류가 발생했음을 알리기 위해 호출됩니다. 호출되면 [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)이 중단되고 현재 보류 중인 쓰기가 취소됩니다.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- 유형: [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)이 중단될 때 보류 중인 쓰기 또는 닫기 작업을 취소하는 데 사용할 수 있는 `AbortSignal`입니다.

### 클래스: `TransformStream` {#class-transformstream}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 이 클래스는 전역 객체에 노출됩니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::

`TransformStream`은 [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)과 [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)으로 구성되며, `WritableStream`에 쓰여진 데이터가 수신되어 잠재적으로 변환된 후 `ReadableStream`의 큐에 푸시되도록 연결되어 있습니다.

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

**추가됨: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `TransformStream`이 생성될 때 즉시 호출되는 사용자 정의 함수입니다.
    - `controller` [\<TransformStreamDefaultController\>](/ko/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 반환: `undefined` 또는 `undefined`로 이행된 프로미스
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `transformStream.writable`에 쓰여진 데이터 청크를 수신하고 잠재적으로 수정하여 `transformStream.readable`로 전달하기 전에 수행하는 사용자 정의 함수입니다.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/ko/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 반환: `undefined`로 이행된 프로미스.
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `TransformStream`의 쓰기 가능한 측면이 닫히기 직전에 호출되어 변환 프로세스의 끝을 알리는 사용자 정의 함수입니다.
    - `controller` [\<TransformStreamDefaultController\>](/ko/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 반환: `undefined`로 이행된 프로미스.
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `readableType` 옵션은 나중에 사용하기 위해 예약되어 있으며 *반드시* `undefined`여야 합니다.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `writableType` 옵션은 나중에 사용하기 위해 예약되어 있으며 *반드시* `undefined`여야 합니다.
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 배압이 적용되기 전의 최대 내부 큐 크기입니다.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 각 데이터 청크의 크기를 식별하는 데 사용되는 사용자 정의 함수입니다.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 배압이 적용되기 전의 최대 내부 큐 크기입니다.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 각 데이터 청크의 크기를 식별하는 데 사용되는 사용자 정의 함수입니다.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `transformStream.readable` {#transformstreamreadable}

**Added in: v16.5.0**

- 유형: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Added in: v16.5.0**

- 유형: [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

#### postMessage()를 사용하여 전송하기 {#transferring-with-postmessage_2}

[\<TransformStream\>](/ko/nodejs/api/webstreams#class-transformstream) 인스턴스는 [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)를 사용하여 전송할 수 있습니다.

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### 클래스: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::

`TransformStreamDefaultController`는 `TransformStream`의 내부 상태를 관리합니다.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Added in: v16.5.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

읽기 가능한 쪽 큐를 채우는 데 필요한 데이터 양입니다.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

읽기 가능한 쪽 큐에 데이터 청크를 추가합니다.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

변환 데이터를 처리하는 동안 오류가 발생했음을 읽기 가능 및 쓰기 가능 양쪽에 신호를 보내 양쪽이 갑자기 닫히도록 합니다.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Added in: v16.5.0**

전송의 읽기 가능한 쪽을 닫고 쓰기 가능한 쪽이 오류와 함께 갑자기 닫히도록 합니다.

### 클래스: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Added in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Added in: v16.5.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Added in: v16.5.0**

- 유형: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Class: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.5.0 | 추가됨: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Added in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Added in: v16.5.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Added in: v16.5.0**

- 유형: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Class: `TextEncoderStream` {#class-textencoderstream}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이 클래스는 이제 전역 객체에 노출됩니다. |
| v16.6.0 | 추가됨: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Added in: v16.6.0**

새로운 `TextEncoderStream` 인스턴스를 생성합니다.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Added in: v16.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextEncoderStream` 인스턴스에서 지원하는 인코딩입니다.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Added in: v16.6.0**

- Type: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Added in: v16.6.0**

- Type: [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

### Class: `TextDecoderStream` {#class-textdecoderstream}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 이 클래스가 전역 객체에 노출됩니다. |
| v16.6.0 | Added in: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Added in: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 `TextDecoder` 인스턴스에서 지원하는 `encoding`을 식별합니다. **기본값:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 디코딩 실패가 치명적인 경우 `true`입니다.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `TextDecoderStream`은 디코딩된 결과에 바이트 순서 표시를 포함합니다. `false`인 경우 바이트 순서 표시는 출력에서 제거됩니다. 이 옵션은 `encoding`이 `'utf-8'`, `'utf-16be'` 또는 `'utf-16le'`인 경우에만 사용됩니다. **기본값:** `false`.
  
 

새로운 `TextDecoderStream` 인스턴스를 생성합니다.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Added in: v16.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextDecoderStream` 인스턴스에서 지원하는 인코딩입니다.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Added in: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

디코딩 오류로 인해 `TypeError`가 발생하는 경우 값은 `true`가 됩니다.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Added in: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

디코딩 결과에 바이트 순서 표시가 포함될 경우 값은 `true`가 됩니다.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Added in: v16.6.0**

- Type: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Added in: v16.6.0**

- Type: [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

### Class: `CompressionStream` {#class-compressionstream}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 이 클래스가 전역 객체에 노출됩니다. |
| v17.0.0 | Added in: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.2.0, v20.12.0 | 이제 format에서 `deflate-raw` 값을 허용합니다. |
| v17.0.0 | Added in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'deflate'`, `'deflate-raw'`, 또는 `'gzip'` 중 하나입니다.

#### `compressionStream.readable` {#compressionstreamreadable}

**Added in: v17.0.0**

- Type: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Added in: v17.0.0**

- Type: [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

### Class: `DecompressionStream` {#class-decompressionstream}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 이 클래스가 전역 객체에 노출됩니다. |
| v17.0.0 | Added in: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.2.0, v20.12.0 | 이제 format에서 `deflate-raw` 값을 허용합니다. |
| v17.0.0 | Added in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'deflate'`, `'deflate-raw'`, 또는 `'gzip'` 중 하나입니다.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Added in: v17.0.0**

- Type: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Added in: v17.0.0**

- Type: [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)


### 유틸리티 소비자 {#utility-consumers}

**추가된 버전: v16.7.0**

유틸리티 소비자 함수는 스트림을 소비하기 위한 일반적인 옵션을 제공합니다.

다음과 같이 접근할 수 있습니다.

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

**추가된 버전: v16.7.0**

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림의 전체 내용을 포함하는 `ArrayBuffer`로 이행됩니다.

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

**추가된 버전: v16.7.0**

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림의 전체 내용을 포함하는 [\<Blob\>](/ko/nodejs/api/buffer#class-blob)으로 이행됩니다.

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

**추가됨: v16.7.0**

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림의 전체 내용을 담은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)로 이행됩니다.

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
const { Buffer } = require('node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**추가됨: v16.7.0**

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림의 내용을 UTF-8로 인코딩된 문자열로 파싱한 다음 `JSON.parse()`를 통과시킨 결과로 이행됩니다.

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

**추가된 버전: v16.7.0**

- `stream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) UTF-8 인코딩 문자열로 구문 분석된 스트림의 내용으로 이행됩니다.

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

