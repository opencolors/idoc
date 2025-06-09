---
title: Node.js 스트림 API 문서
description: Node.js 스트림 API에 대한 상세 문서로, 읽기 가능, 쓰기 가능, 이중, 변환 스트림과 그들의 메서드, 이벤트 및 사용 예제를 다룹니다.
head:
  - - meta
    - name: og:title
      content: Node.js 스트림 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 스트림 API에 대한 상세 문서로, 읽기 가능, 쓰기 가능, 이중, 변환 스트림과 그들의 메서드, 이벤트 및 사용 예제를 다룹니다.
  - - meta
    - name: twitter:title
      content: Node.js 스트림 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 스트림 API에 대한 상세 문서로, 읽기 가능, 쓰기 가능, 이중, 변환 스트림과 그들의 메서드, 이벤트 및 사용 예제를 다룹니다.
---


# 스트림 {#stream}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

스트림은 Node.js에서 스트리밍 데이터를 처리하기 위한 추상 인터페이스입니다. `node:stream` 모듈은 스트림 인터페이스를 구현하기 위한 API를 제공합니다.

Node.js에서는 다양한 스트림 객체가 제공됩니다. 예를 들어, [HTTP 서버에 대한 요청](/ko/nodejs/api/http#class-httpincomingmessage)과 [`process.stdout`](/ko/nodejs/api/process#processstdout)는 모두 스트림 인스턴스입니다.

스트림은 읽기 가능, 쓰기 가능 또는 둘 다일 수 있습니다. 모든 스트림은 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)의 인스턴스입니다.

`node:stream` 모듈에 접근하려면:

```js [ESM]
const stream = require('node:stream');
```
`node:stream` 모듈은 새로운 유형의 스트림 인스턴스를 만드는 데 유용합니다. 스트림을 소비하기 위해 `node:stream` 모듈을 사용할 필요는 일반적으로 없습니다.

## 이 문서의 구성 {#organization-of-this-document}

이 문서는 두 개의 주요 섹션과 노트를 위한 세 번째 섹션으로 구성됩니다. 첫 번째 섹션에서는 애플리케이션 내에서 기존 스트림을 사용하는 방법을 설명합니다. 두 번째 섹션에서는 새로운 유형의 스트림을 만드는 방법을 설명합니다.

## 스트림 유형 {#types-of-streams}

Node.js에는 네 가지 기본 스트림 유형이 있습니다.

- [`Writable`](/ko/nodejs/api/stream#class-streamwritable): 데이터를 쓸 수 있는 스트림 (예: [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/ko/nodejs/api/stream#class-streamreadable): 데이터를 읽을 수 있는 스트림 (예: [`fs.createReadStream()`](/ko/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/ko/nodejs/api/stream#class-streamduplex): `Readable`과 `Writable` 둘 다인 스트림 (예: [`net.Socket`](/ko/nodejs/api/net#class-netsocket)).
- [`Transform`](/ko/nodejs/api/stream#class-streamtransform): 쓰기와 읽기를 할 때 데이터를 수정하거나 변환할 수 있는 `Duplex` 스트림 (예: [`zlib.createDeflate()`](/ko/nodejs/api/zlib#zlibcreatedeflateoptions)).

또한, 이 모듈에는 유틸리티 함수 [`stream.duplexPair()`](/ko/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/ko/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/ko/nodejs/api/stream#streamfinishedstream-options-callback) [`stream.Readable.from()`](/ko/nodejs/api/stream#streamreadablefromiterable-options) 및 [`stream.addAbortSignal()`](/ko/nodejs/api/stream#streamaddabortsignalsignal-stream)이 포함되어 있습니다.


### 스트림 프로미스 API {#streams-promises-api}

**추가됨: v15.0.0**

`stream/promises` API는 콜백 대신 `Promise` 객체를 반환하는 스트림을 위한 대체 비동기 유틸리티 함수 세트를 제공합니다. API는 `require('node:stream/promises')` 또는 `require('node:stream').promises`를 통해 액세스할 수 있습니다.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | 소스가 종료될 때 대상 스트림이 자동으로 닫히는 것을 방지하기 위해 `end` 옵션을 추가했습니다. `false`로 설정할 수 있습니다. |
| v15.0.0 | 추가됨: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/ko/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 파이프라인 옵션
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 소스 스트림이 끝나면 대상 스트림을 종료합니다. 변환 스트림은 이 값이 `false`인 경우에도 항상 종료됩니다. **기본값:** `true`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 파이프라인이 완료되면 처리됩니다.



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
  console.log('파이프라인에 성공했습니다.');
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
console.log('파이프라인에 성공했습니다.');
```
:::

`AbortSignal`을 사용하려면 옵션 객체 내부의 마지막 인수로 전달합니다. 신호가 중단되면 기본 파이프라인에서 `destroy`가 호출되고 `AbortError`가 발생합니다.



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

`pipeline` API는 비동기 생성기도 지원합니다.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // `Buffer` 대신 문자열로 작업합니다.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('파이프라인에 성공했습니다.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // `Buffer` 대신 문자열로 작업합니다.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('파이프라인에 성공했습니다.');
```
:::

비동기 생성기로 전달된 `signal` 인수를 처리해야 합니다. 특히 비동기 생성기가 파이프라인의 소스인 경우(즉, 첫 번째 인수) 파이프라인이 완료되지 않습니다.



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
  console.log('파이프라인에 성공했습니다.');
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
console.log('파이프라인에 성공했습니다.');
```
:::

`pipeline` API는 [콜백 버전](/ko/nodejs/api/stream#streampipelinesource-transforms-destination-callback)을 제공합니다.


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.5.0, v18.14.0 | `ReadableStream` 및 `WritableStream` 지원이 추가되었습니다. |
| v19.1.0, v18.13.0 | `cleanup` 옵션이 추가되었습니다. |
| v15.0.0 | 추가됨: v15.0.0 |
:::

- `stream` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 읽기 가능 및/또는 쓰기 가능한 스트림/웹 스트림입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`인 경우, 프로미스가 완료되기 전에 이 함수에 의해 등록된 리스너를 제거합니다. **기본값:** `false`.
  
 
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림이 더 이상 읽거나 쓸 수 없을 때 완료됩니다.



::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('스트림 읽기가 완료되었습니다.');
}

run().catch(console.error);
rs.resume(); // 스트림을 비웁니다.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('스트림 읽기가 완료되었습니다.');
}

run().catch(console.error);
rs.resume(); // 스트림을 비웁니다.
```
:::

`finished` API는 [콜백 버전](/ko/nodejs/api/stream#streamfinishedstream-options-callback)도 제공합니다.

`stream.finished()`는 반환된 프로미스가 확인되거나 거부된 후에도 매달린 이벤트 리스너(`'error'`, `'end'`, `'finish'` 및 `'close'`)를 남겨 둡니다. 이렇게 하는 이유는 예기치 않은 `'error'` 이벤트(잘못된 스트림 구현으로 인해)로 인해 예기치 않은 충돌이 발생하지 않도록 하기 위함입니다. 원치 않는 동작이라면 `options.cleanup`을 `true`로 설정해야 합니다.

```js [ESM]
await finished(rs, { cleanup: true });
```

### 객체 모드 {#object-mode}

Node.js API에서 생성된 모든 스트림은 문자열, [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 및 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 객체만 사용합니다.

- `Strings` 및 `Buffers`는 스트림에서 가장 일반적으로 사용되는 유형입니다.
- `TypedArray` 및 `DataView`를 사용하면 `Int32Array` 또는 `Uint8Array`와 같은 유형으로 이진 데이터를 처리할 수 있습니다. TypedArray 또는 DataView를 스트림에 쓰면 Node.js가 원시 바이트를 처리합니다.

그러나 스트림 구현이 다른 JavaScript 값 유형(스트림 내에서 특수한 용도로 사용되는 `null` 제외)을 사용할 수 있습니다. 이러한 스트림은 "객체 모드"에서 작동하는 것으로 간주됩니다.

스트림 인스턴스는 스트림이 생성될 때 `objectMode` 옵션을 사용하여 객체 모드로 전환됩니다. 기존 스트림을 객체 모드로 전환하려고 시도하는 것은 안전하지 않습니다.

### 버퍼링 {#buffering}

[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 및 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 모두 내부 버퍼에 데이터를 저장합니다.

버퍼링될 수 있는 데이터의 양은 스트림의 생성자에 전달된 `highWaterMark` 옵션에 따라 다릅니다. 일반 스트림의 경우 `highWaterMark` 옵션은 [총 바이트 수](/ko/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding)를 지정합니다. 객체 모드에서 작동하는 스트림의 경우 `highWaterMark`는 총 객체 수를 지정합니다. 문자열에서 작동하는 (디코딩하지 않는) 스트림의 경우 `highWaterMark`는 총 UTF-16 코드 단위 수를 지정합니다.

데이터는 구현이 [`stream.push(chunk)`](/ko/nodejs/api/stream#readablepushchunk-encoding)를 호출할 때 `Readable` 스트림에 버퍼링됩니다. 스트림의 소비자가 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize)를 호출하지 않으면 데이터는 소비될 때까지 내부 대기열에 남아 있습니다.

내부 읽기 버퍼의 총 크기가 `highWaterMark`로 지정된 임계값에 도달하면 스트림은 현재 버퍼링된 데이터를 소비할 수 있을 때까지 기본 리소스에서 데이터 읽기를 일시적으로 중단합니다(즉, 스트림은 읽기 버퍼를 채우는 데 사용되는 내부 [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드 호출을 중단합니다).

데이터는 [`writable.write(chunk)`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback) 메서드가 반복적으로 호출될 때 `Writable` 스트림에 버퍼링됩니다. 내부 쓰기 버퍼의 총 크기가 `highWaterMark`로 설정된 임계값 미만인 동안 `writable.write()` 호출은 `true`를 반환합니다. 내부 버퍼의 크기가 `highWaterMark`에 도달하거나 초과하면 `false`가 반환됩니다.

`stream` API, 특히 [`stream.pipe()`](/ko/nodejs/api/stream#readablepipedestination-options) 메서드의 주요 목표는 서로 다른 속도의 소스와 대상이 사용 가능한 메모리를 압도하지 않도록 데이터 버퍼링을 허용 가능한 수준으로 제한하는 것입니다.

`highWaterMark` 옵션은 제한이 아닌 임계값입니다. 스트림이 더 많은 데이터를 요청하기 전에 버퍼링하는 데이터의 양을 나타냅니다. 일반적으로 엄격한 메모리 제한을 적용하지 않습니다. 특정 스트림 구현은 더 엄격한 제한을 적용하도록 선택할 수 있지만 이는 선택 사항입니다.

[`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 및 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림은 모두 `Readable` 및 `Writable`이므로 각각 읽기 및 쓰기에 사용되는 *두 개의* 개별 내부 버퍼를 유지 관리하여 각 측면이 적절하고 효율적인 데이터 흐름을 유지하면서 서로 독립적으로 작동할 수 있도록 합니다. 예를 들어, [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 인스턴스는 소켓 *에서* 받은 데이터의 소비를 허용하는 `Readable` 측면과 소켓 *에* 데이터를 쓰는 것을 허용하는 `Writable` 측면을 갖는 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림입니다. 데이터가 수신되는 속도보다 빠르거나 느린 속도로 소켓에 쓸 수 있으므로 각 측면은 서로 독립적으로 작동(및 버퍼링)해야 합니다.

내부 버퍼링의 메커니즘은 내부 구현 세부 사항이며 언제든지 변경될 수 있습니다. 그러나 특정 고급 구현의 경우 내부 버퍼는 `writable.writableBuffer` 또는 `readable.readableBuffer`를 사용하여 검색할 수 있습니다. 이러한 문서화되지 않은 속성의 사용은 권장되지 않습니다.


## 스트림 소비자용 API {#api-for-stream-consumers}

거의 모든 Node.js 애플리케이션은 아무리 간단하더라도 어떤 방식으로든 스트림을 사용합니다. 다음은 HTTP 서버를 구현하는 Node.js 애플리케이션에서 스트림을 사용하는 예입니다.

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req`는 읽기 가능한 스트림인 http.IncomingMessage입니다.
  // `res`는 쓰기 가능한 스트림인 http.ServerResponse입니다.

  let body = '';
  // 데이터를 utf8 문자열로 가져옵니다.
  // 인코딩이 설정되지 않으면 Buffer 객체를 받게 됩니다.
  req.setEncoding('utf8');

  // 읽기 가능한 스트림은 리스너가 추가되면 'data' 이벤트를 발생시킵니다.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 'end' 이벤트는 전체 본문이 수신되었음을 나타냅니다.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // 사용자에게 흥미로운 내용을 다시 씁니다.
      res.write(typeof data);
      res.end();
    } catch (er) {
      // 어라! 잘못된 JSON입니다!
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
[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림(예제의 `res`와 같은)은 스트림에 데이터를 쓰는 데 사용되는 `write()` 및 `end()`와 같은 메서드를 노출합니다.

[`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 스트림에서 읽을 수 있는 데이터가 있을 때 애플리케이션 코드에 알리기 위해 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter) API를 사용합니다. 사용 가능한 데이터는 여러 가지 방법으로 스트림에서 읽을 수 있습니다.

[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 및 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 모두 스트림의 현재 상태를 전달하기 위해 다양한 방식으로 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter) API를 사용합니다.

[`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 및 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림은 모두 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 및 [`Readable`](/ko/nodejs/api/stream#class-streamreadable)입니다.

스트림에서 데이터를 쓰거나 스트림에서 데이터를 소비하는 애플리케이션은 스트림 인터페이스를 직접 구현할 필요가 없으며 일반적으로 `require('node:stream')`을 호출할 이유가 없습니다.

새로운 유형의 스트림을 구현하려는 개발자는 [스트림 구현자용 API](/ko/nodejs/api/stream#api-for-stream-implementers) 섹션을 참조해야 합니다.


### 쓰기 가능 스트림 {#writable-streams}

쓰기 가능 스트림은 데이터를 쓸 *대상*에 대한 추상화입니다.

[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림의 예는 다음과 같습니다.

- [클라이언트의 HTTP 요청](/ko/nodejs/api/http#class-httpclientrequest)
- [서버의 HTTP 응답](/ko/nodejs/api/http#class-httpserverresponse)
- [fs 쓰기 스트림](/ko/nodejs/api/fs#class-fswritestream)
- [zlib 스트림](/ko/nodejs/api/zlib)
- [crypto 스트림](/ko/nodejs/api/crypto)
- [TCP 소켓](/ko/nodejs/api/net#class-netsocket)
- [자식 프로세스 stdin](/ko/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/ko/nodejs/api/process#processstdout), [`process.stderr`](/ko/nodejs/api/process#processstderr)

이러한 예 중 일부는 실제로 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 인터페이스를 구현하는 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림입니다.

모든 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림은 `stream.Writable` 클래스에 의해 정의된 인터페이스를 구현합니다.

[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림의 특정 인스턴스는 여러 면에서 다를 수 있지만, 모든 `Writable` 스트림은 아래 예에서 설명된 것과 동일한 기본적인 사용 패턴을 따릅니다.

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### 클래스: `stream.Writable` {#class-streamwritable}

**추가된 버전: v0.9.4**

##### 이벤트: `'close'` {#event-close}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `'close'`가 destroy 시에 방출되는지 여부를 지정하는 `emitClose` 옵션 추가 |
| v0.9.4 | 추가된 버전: v0.9.4 |
:::

스트림과 기본 리소스(예: 파일 디스크립터)가 모두 닫히면 `'close'` 이벤트가 방출됩니다. 이 이벤트는 더 이상 이벤트가 방출되지 않고 더 이상 계산이 수행되지 않음을 나타냅니다.

[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림은 `emitClose` 옵션으로 생성된 경우 항상 `'close'` 이벤트를 방출합니다.

##### 이벤트: `'drain'` {#event-drain}

**추가된 버전: v0.9.4**

[`stream.write(chunk)`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 대한 호출이 `false`를 반환하면 스트림에 데이터 쓰기를 재개하는 것이 적절할 때 `'drain'` 이벤트가 방출됩니다.

```js [ESM]
// 제공된 쓰기 가능 스트림에 백만 번 데이터를 씁니다.
// 역압에 주의하십시오.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // 마지막!
        writer.write(data, encoding, callback);
      } else {
        // 계속해야 하는지, 아니면 기다려야 하는지 확인합니다.
        // 아직 완료되지 않았으므로 콜백을 전달하지 마십시오.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // 일찍 중단해야 했습니다!
      // 드레인이 되면 좀 더 쓰십시오.
      writer.once('drain', write);
    }
  }
}
```

##### 이벤트: `'error'` {#event-error}

**추가된 버전: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

데이터를 쓰거나 파이핑하는 동안 오류가 발생하면 `'error'` 이벤트가 발생합니다. 리스너 콜백은 호출될 때 단일 `Error` 인수가 전달됩니다.

스트림을 만들 때 [`autoDestroy`](/ko/nodejs/api/stream#new-streamwritableoptions) 옵션이 `false`로 설정되지 않은 경우 `'error'` 이벤트가 발생하면 스트림이 닫힙니다.

`'error'` 이후에는 `'close'` 이벤트 외에 다른 이벤트 ( `'error'` 이벤트 포함)가 *발생해서는 안 됩니다*.

##### 이벤트: `'finish'` {#event-finish}

**추가된 버전: v0.9.4**

[`stream.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback) 메서드가 호출되고 모든 데이터가 기본 시스템으로 플러시된 후에 `'finish'` 이벤트가 발생합니다.

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
##### 이벤트: `'pipe'` {#event-pipe}

**추가된 버전: v0.9.4**

- `src` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) 이 쓰기 가능 스트림으로 파이핑되는 소스 스트림

`'pipe'` 이벤트는 읽기 가능 스트림에서 [`stream.pipe()`](/ko/nodejs/api/stream#readablepipedestination-options) 메서드가 호출되어 이 쓰기 가능 스트림을 대상 집합에 추가할 때 발생합니다.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### 이벤트: `'unpipe'` {#event-unpipe}

**추가된 버전: v0.9.4**

- `src` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) 이 쓰기 가능 스트림을 [언파이프](/ko/nodejs/api/stream#readableunpipedestination)한 소스 스트림

`'unpipe'` 이벤트는 [`stream.unpipe()`](/ko/nodejs/api/stream#readableunpipedestination) 메서드가 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림에서 호출되어 이 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림을 대상 집합에서 제거할 때 발생합니다.

이 이벤트는 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림이 파이핑될 때 이 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림에서 오류가 발생한 경우에도 발생합니다.

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

**추가된 버전: v0.11.2**

`writable.cork()` 메서드는 쓰여진 모든 데이터를 메모리에 버퍼링하도록 강제합니다. 버퍼링된 데이터는 [`stream.uncork()`](/ko/nodejs/api/stream#writableuncork) 또는 [`stream.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback) 메서드가 호출될 때 플러시됩니다.

`writable.cork()`의 주요 목적은 여러 개의 작은 청크가 빠르게 스트림에 쓰여지는 상황을 처리하기 위한 것입니다. 즉시 기본 대상으로 전달하는 대신, `writable.cork()`는 `writable.uncork()`가 호출될 때까지 모든 청크를 버퍼링하고, 존재하는 경우 `writable._writev()`로 모두 전달합니다. 이는 첫 번째 작은 청크가 처리되는 동안 데이터가 버퍼링되는 head-of-line 차단 상황을 방지합니다. 그러나 `writable._writev()`를 구현하지 않고 `writable.cork()`를 사용하면 처리량에 부정적인 영향을 미칠 수 있습니다.

참고: [`writable.uncork()`](/ko/nodejs/api/stream#writableuncork), [`writable._writev()`](/ko/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 이미 파괴된 스트림에서 아무 작업도 수행하지 않습니다. |
| v8.0.0 | 추가된 버전: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 선택 사항, `'error'` 이벤트와 함께 발생시킬 오류입니다.
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

스트림을 파괴합니다. 선택적으로 `'error'` 이벤트를 발생시키고, `'close'` 이벤트를 발생시킵니다 (단, `emitClose`가 `false`로 설정되지 않은 경우). 이 호출 후 쓰기 가능한 스트림은 종료되고, 이후의 `write()` 또는 `end()` 호출은 `ERR_STREAM_DESTROYED` 오류를 발생시킵니다. 이는 스트림을 파괴하는 파괴적이고 즉각적인 방법입니다. 이전의 `write()` 호출이 비워지지 않았을 수 있으며, `ERR_STREAM_DESTROYED` 오류를 트리거할 수 있습니다. 닫기 전에 데이터를 플러시해야 하거나 스트림을 파괴하기 전에 `'drain'` 이벤트를 기다려야 하는 경우 `destroy()` 대신 `end()`를 사용하십시오.

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

`destroy()`가 호출되면 더 이상의 호출은 아무 작업도 수행하지 않으며 `_destroy()`에서 발생하는 오류를 제외하고 더 이상의 오류는 `'error'`로 발생하지 않을 수 있습니다.

구현자는 이 메서드를 재정의해서는 안 되며, 대신 [`writable._destroy()`](/ko/nodejs/api/stream#writable_destroyerr-callback)를 구현해야 합니다.


##### `writable.closed` {#writableclosed}

**Added in: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'close'`가 발생한 후 `true`입니다.

##### `writable.destroyed` {#writabledestroyed}

**Added in: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`writable.destroy()`](/ko/nodejs/api/stream#writabledestroyerror)가 호출된 후 `true`입니다.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 이제 `chunk` 인수가 `TypedArray` 또는 `DataView` 인스턴스일 수 있습니다. |
| v15.0.0 | 'finish' 또는 오류 발생 전에 `callback`이 호출됩니다. |
| v14.0.0 | 'finish' 또는 'error'가 발생하면 `callback`이 호출됩니다. |
| v10.0.0 | 이제 이 메서드는 `writable`에 대한 참조를 반환합니다. |
| v8.0.0 | 이제 `chunk` 인수가 `Uint8Array` 인스턴스일 수 있습니다. |
| v0.9.4 | Added in: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 선택적 쓰기 데이터. 객체 모드에서 작동하지 않는 스트림의 경우 `chunk`는 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 또는 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)여야 합니다. 객체 모드 스트림의 경우 `chunk`는 `null`을 제외한 모든 JavaScript 값일 수 있습니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `chunk`가 문자열인 경우 인코딩입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 스트림이 완료될 때의 콜백입니다.
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`writable.end()` 메서드를 호출하면 더 이상 데이터가 [`Writable`](/ko/nodejs/api/stream#class-streamwritable)에 쓰여지지 않음을 알립니다. 선택적 `chunk` 및 `encoding` 인수를 사용하면 스트림을 닫기 직전에 마지막 추가 데이터 청크를 쓸 수 있습니다.

[`stream.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback)를 호출한 후 [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback) 메서드를 호출하면 오류가 발생합니다.

```js [ESM]
// 'hello, '를 쓰고 'world!'로 끝냅니다.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// 이제 더 쓰는 것은 허용되지 않습니다!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v6.1.0 | 이제 이 메서드는 `writable`에 대한 참조를 반환합니다. |
| v0.11.15 | v0.11.15에 추가되었습니다. |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 새로운 기본 인코딩
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`writable.setDefaultEncoding()` 메서드는 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림에 대한 기본 `encoding`을 설정합니다.

##### `writable.uncork()` {#writableuncork}

**추가됨: v0.11.2**

`writable.uncork()` 메서드는 [`stream.cork()`](/ko/nodejs/api/stream#writablecork)가 호출된 이후 버퍼링된 모든 데이터를 플러시합니다.

[`writable.cork()`](/ko/nodejs/api/stream#writablecork) 및 `writable.uncork()`를 사용하여 스트림에 대한 쓰기 버퍼링을 관리할 때 `process.nextTick()`을 사용하여 `writable.uncork()`에 대한 호출을 연기합니다. 이렇게 하면 지정된 Node.js 이벤트 루프 단계에서 발생하는 모든 `writable.write()` 호출을 일괄 처리할 수 있습니다.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
[`writable.cork()`](/ko/nodejs/api/stream#writablecork) 메서드가 스트림에서 여러 번 호출되면 버퍼링된 데이터를 플러시하기 위해 `writable.uncork()`에 대한 동일한 횟수의 호출을 호출해야 합니다.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // uncork()가 두 번째로 호출될 때까지 데이터가 플러시되지 않습니다.
  stream.uncork();
});
```
참고 항목: [`writable.cork()`](/ko/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**추가됨: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`writable.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)를 호출해도 안전하면 `true`입니다. 즉, 스트림이 소멸되거나 오류가 발생하거나 종료되지 않았습니다.

##### `writable.writableAborted` {#writablewritableaborted}

**추가됨: v18.0.0, v16.17.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

스트림이 `'finish'`를 내보내기 전에 소멸되거나 오류가 발생했는지 여부를 반환합니다.


##### `writable.writableEnded` {#writablewritableended}

**추가됨: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`writable.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback)가 호출된 후 `true`입니다. 이 속성은 데이터가 플러시되었는지 여부를 나타내지 않습니다. 대신 [`writable.writableFinished`](/ko/nodejs/api/stream#writablewritablefinished)를 사용하십시오.

##### `writable.writableCorked` {#writablewritablecorked}

**추가됨: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

스트림을 완전히 언코크하기 위해 [`writable.uncork()`](/ko/nodejs/api/stream#writableuncork)를 호출해야 하는 횟수입니다.

##### `writable.errored` {#writableerrored}

**추가됨: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

스트림이 오류와 함께 소멸된 경우 오류를 반환합니다.

##### `writable.writableFinished` {#writablewritablefinished}

**추가됨: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`'finish'`](/ko/nodejs/api/stream#event-finish) 이벤트가 발생하기 직전에 `true`로 설정됩니다.

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**추가됨: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 `Writable`을 만들 때 전달된 `highWaterMark` 값을 반환합니다.

##### `writable.writableLength` {#writablewritablelength}

**추가됨: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 쓰기 준비가 된 큐의 바이트 수(또는 객체 수)를 포함합니다. 값은 `highWaterMark`의 상태에 대한 내부 정보 데이터를 제공합니다.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**추가됨: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

스트림의 버퍼가 가득 차고 스트림이 `'drain'`을 발생시키면 `true`입니다.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**추가된 버전: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

주어진 `Writable` 스트림의 `objectMode` 속성에 대한 Getter입니다.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**추가된 버전: v22.4.0, v20.16.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`writable.destroy()`](/ko/nodejs/api/stream#writabledestroyerror)를 `AbortError`와 함께 호출하고 스트림이 완료될 때 이행되는 프로미스를 반환합니다.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 인수가 이제 `TypedArray` 또는 `DataView` 인스턴스가 될 수 있습니다. |
| v8.0.0 | `chunk` 인수가 이제 `Uint8Array` 인스턴스가 될 수 있습니다. |
| v6.0.0 | `chunk` 매개변수로 `null`을 전달하는 것은 이제 객체 모드에서도 항상 유효하지 않은 것으로 간주됩니다. |
| v0.9.4 | 추가된 버전: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 선택적 쓰기 데이터. 객체 모드로 작동하지 않는 스트림의 경우 `chunk`는 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 또는 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)여야 합니다. 객체 모드 스트림의 경우 `chunk`는 `null`이 아닌 모든 JavaScript 값이 될 수 있습니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `chunk`가 문자열인 경우 인코딩입니다. **기본값:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이 데이터 청크가 플러시될 때의 콜백입니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림이 추가 데이터를 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하는 경우 `false`이고, 그렇지 않으면 `true`입니다.

`writable.write()` 메서드는 스트림에 일부 데이터를 쓰고 데이터가 완전히 처리되면 제공된 `callback`을 호출합니다. 오류가 발생하면 오류가 첫 번째 인수로 포함된 `callback`이 호출됩니다. `callback`은 비동기적으로 호출되고 `'error'`가 발생하기 전에 호출됩니다.

반환 값은 `chunk`를 수용한 후 내부 버퍼가 스트림이 생성될 때 구성된 `highWaterMark`보다 작으면 `true`입니다. `false`가 반환되면 [`'drain'`](/ko/nodejs/api/stream#event-drain) 이벤트가 발생할 때까지 스트림에 데이터를 쓰는 추가 시도를 중단해야 합니다.

스트림이 드레인되지 않는 동안 `write()`를 호출하면 `chunk`가 버퍼링되고 false가 반환됩니다. 현재 버퍼링된 모든 청크가 드레인되면(운영 체제에서 전달하기 위해 수락됨) `'drain'` 이벤트가 발생합니다. `write()`가 false를 반환하면 `'drain'` 이벤트가 발생할 때까지 더 이상 청크를 쓰지 마십시오. 드레인되지 않는 스트림에서 `write()`를 호출하는 것은 허용되지만 Node.js는 최대 메모리 사용량이 발생할 때까지 작성된 모든 청크를 버퍼링합니다. 이 시점에서 무조건 중단됩니다. 중단되기 전에도 높은 메모리 사용량은 가비지 수집기 성능 저하와 높은 RSS(일반적으로 메모리가 더 이상 필요하지 않은 후에도 시스템으로 다시 릴리스되지 않음)를 유발합니다. TCP 소켓은 원격 피어가 데이터를 읽지 않으면 드레인되지 않을 수 있으므로 드레인되지 않는 소켓을 쓰면 원격으로 악용 가능한 취약점으로 이어질 수 있습니다.

스트림이 드레인되지 않는 동안 데이터를 쓰는 것은 [`Transform`](/ko/nodejs/api/stream#class-streamtransform)의 경우 특히 문제가 됩니다. `Transform` 스트림은 파이프되거나 `'data'` 또는 `'readable'` 이벤트 핸들러가 추가될 때까지 기본적으로 일시 중지되기 때문입니다.

쓸 데이터가 주문형으로 생성되거나 가져올 수 있는 경우 로직을 [`Readable`](/ko/nodejs/api/stream#class-streamreadable)에 캡슐화하고 [`stream.pipe()`](/ko/nodejs/api/stream#readablepipedestination-options)를 사용하는 것이 좋습니다. 그러나 `write()`를 호출하는 것이 선호되는 경우 [`'drain'`](/ko/nodejs/api/stream#event-drain) 이벤트를 사용하여 백프레셔를 존중하고 메모리 문제를 피할 수 있습니다.

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// cb가 호출될 때까지 기다린 후 다른 쓰기를 수행하십시오.
write('hello', () => {
  console.log('쓰기가 완료되었습니다. 지금 더 많은 쓰기를 수행하십시오.');
});
```

객체 모드의 `Writable` 스트림은 항상 `encoding` 인수를 무시합니다.


### 읽기 가능한 스트림 {#readable-streams}

읽기 가능한 스트림은 데이터를 소비하는 *소스*에 대한 추상화입니다.

`Readable` 스트림의 예는 다음과 같습니다.

- [클라이언트의 HTTP 응답](/ko/nodejs/api/http#class-httpincomingmessage)
- [서버의 HTTP 요청](/ko/nodejs/api/http#class-httpincomingmessage)
- [fs 읽기 스트림](/ko/nodejs/api/fs#class-fsreadstream)
- [zlib 스트림](/ko/nodejs/api/zlib)
- [crypto 스트림](/ko/nodejs/api/crypto)
- [TCP 소켓](/ko/nodejs/api/net#class-netsocket)
- [자식 프로세스 stdout 및 stderr](/ko/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/ko/nodejs/api/process#processstdin)

모든 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 `stream.Readable` 클래스에 의해 정의된 인터페이스를 구현합니다.

#### 두 가지 읽기 모드 {#two-reading-modes}

`Readable` 스트림은 효과적으로 흐름 모드와 일시 중지 모드 중 하나로 작동합니다. 이러한 모드는 [객체 모드](/ko/nodejs/api/stream#object-mode)와는 별개입니다. [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 흐름 모드인지 일시 중지 모드인지에 관계없이 객체 모드일 수도 있고 아닐 수도 있습니다.

- 흐름 모드에서 데이터는 기본 시스템에서 자동으로 읽혀지고 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter) 인터페이스를 통해 이벤트를 사용하여 가능한 한 빨리 애플리케이션에 제공됩니다.
- 일시 중지 모드에서 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize) 메서드를 명시적으로 호출하여 스트림에서 데이터 청크를 읽어야 합니다.

모든 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 일시 중지 모드에서 시작되지만 다음 방법 중 하나로 흐름 모드로 전환할 수 있습니다.

- [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트 핸들러 추가.
- [`stream.resume()`](/ko/nodejs/api/stream#readableresume) 메서드 호출.
- [`stream.pipe()`](/ko/nodejs/api/stream#readablepipedestination-options) 메서드를 호출하여 데이터를 [`Writable`](/ko/nodejs/api/stream#class-streamwritable)로 보냅니다.

`Readable`은 다음 중 하나를 사용하여 다시 일시 중지 모드로 전환할 수 있습니다.

- 파이프 대상이 없는 경우 [`stream.pause()`](/ko/nodejs/api/stream#readablepause) 메서드를 호출합니다.
- 파이프 대상이 있는 경우 모든 파이프 대상을 제거합니다. [`stream.unpipe()`](/ko/nodejs/api/stream#readableunpipedestination) 메서드를 호출하여 여러 파이프 대상을 제거할 수 있습니다.

기억해야 할 중요한 개념은 `Readable`은 해당 데이터를 소비하거나 무시하는 메커니즘이 제공될 때까지 데이터를 생성하지 않는다는 것입니다. 소비 메커니즘이 비활성화되거나 제거되면 `Readable`은 데이터를 생성하는 것을 *시도*합니다.

이전 버전과의 호환성을 위해 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트 핸들러를 제거해도 스트림이 자동으로 일시 중지되지는 **않습니다**. 또한 파이프된 대상이 있는 경우 [`stream.pause()`](/ko/nodejs/api/stream#readablepause)를 호출해도 해당 대상이 소모되어 더 많은 데이터를 요청하면 스트림이 *유지*되는 것은 아닙니다.

[`Readable`](/ko/nodejs/api/stream#class-streamreadable)이 흐름 모드로 전환되었지만 데이터를 처리할 수 있는 소비자가 없는 경우 해당 데이터는 손실됩니다. 예를 들어 `'data'` 이벤트에 연결된 리스너 없이 `readable.resume()` 메서드가 호출되거나 스트림에서 `'data'` 이벤트 핸들러가 제거될 때 발생할 수 있습니다.

[`'readable'`](/ko/nodejs/api/stream#event-readable) 이벤트 핸들러를 추가하면 스트림이 자동으로 흐름을 멈추고 [`readable.read()`](/ko/nodejs/api/stream#readablereadsize)를 통해 데이터를 소비해야 합니다. [`'readable'`](/ko/nodejs/api/stream#event-readable) 이벤트 핸들러가 제거되면 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트 핸들러가 있는 경우 스트림이 다시 흐르기 시작합니다.


#### 세 가지 상태 {#three-states}

`Readable` 스트림의 "두 가지 모드" 작동 방식은 `Readable` 스트림 구현 내에서 발생하는 더 복잡한 내부 상태 관리를 단순화한 추상화입니다.

특히, 주어진 시점에서 모든 `Readable`은 다음 세 가지 가능한 상태 중 하나에 있습니다.

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

`readable.readableFlowing`이 `null`이면 스트림의 데이터를 소비하는 메커니즘이 제공되지 않습니다. 따라서 스트림은 데이터를 생성하지 않습니다. 이 상태에서 `'data'` 이벤트에 대한 리스너를 연결하거나 `readable.pipe()` 메서드를 호출하거나 `readable.resume()` 메서드를 호출하면 `readable.readableFlowing`이 `true`로 전환되어 `Readable`이 데이터가 생성될 때 이벤트를 적극적으로 내보내기 시작합니다.

`readable.pause()`, `readable.unpipe()`를 호출하거나 백프레셔를 받으면 `readable.readableFlowing`이 `false`로 설정되어 이벤트 흐름이 일시적으로 중단되지만 데이터 생성이 중단되지는 *않습니다*. 이 상태에서 `'data'` 이벤트에 대한 리스너를 연결해도 `readable.readableFlowing`이 `true`로 전환되지 않습니다.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing은 이제 false입니다.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing은 여전히 false입니다.
pass.write('ok');  // 'data'를 내보내지 않습니다.
pass.resume();     // 스트림이 'data'를 내보내도록 하려면 호출해야 합니다.
// readableFlowing은 이제 true입니다.
```
`readable.readableFlowing`이 `false`인 동안 데이터가 스트림의 내부 버퍼에 누적될 수 있습니다.

#### 하나의 API 스타일 선택 {#choose-one-api-style}

`Readable` 스트림 API는 여러 Node.js 버전에서 발전했으며 스트림 데이터를 소비하는 여러 가지 방법을 제공합니다. 일반적으로 개발자는 데이터 소비 방법 중 *하나*를 선택해야 하며 단일 스트림에서 데이터를 소비하기 위해 여러 방법을 *절대 사용해서는 안 됩니다*. 특히 `on('data')`, `on('readable')`, `pipe()`, 또는 비동기 이터레이터를 조합하여 사용하면 직관적이지 않은 동작이 발생할 수 있습니다.


#### 클래스: `stream.Readable` {#class-streamreadable}

**추가됨: v0.9.4**

##### 이벤트: `'close'` {#event-close_1}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `emitClose` 옵션을 추가하여 destroy 시 `'close'`가 발생하는지 여부를 지정합니다. |
| v0.9.4 | 추가됨: v0.9.4 |
:::

`'close'` 이벤트는 스트림과 기본 리소스(예: 파일 디스크립터)가 모두 닫힐 때 발생합니다. 이 이벤트는 더 이상 이벤트가 발생하지 않고 더 이상 계산이 수행되지 않음을 나타냅니다.

[`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림은 `emitClose` 옵션으로 생성된 경우 항상 `'close'` 이벤트를 발생시킵니다.

##### 이벤트: `'data'` {#event-data}

**추가됨: v0.9.4**

- `chunk` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types) 데이터 청크. 객체 모드에서 작동하지 않는 스트림의 경우 청크는 문자열 또는 `Buffer`입니다. 객체 모드에 있는 스트림의 경우 청크는 `null` 이외의 모든 JavaScript 값이 될 수 있습니다.

`'data'` 이벤트는 스트림이 데이터 청크의 소유권을 소비자에게 양도할 때마다 발생합니다. 이는 `readable.pipe()`, `readable.resume()`을 호출하거나 `'data'` 이벤트에 리스너 콜백을 첨부하여 스트림이 흐름 모드로 전환될 때마다 발생할 수 있습니다. `'data'` 이벤트는 `readable.read()` 메서드가 호출되고 반환할 데이터 청크가 사용 가능한 경우에도 발생합니다.

명시적으로 일시 중지되지 않은 스트림에 `'data'` 이벤트 리스너를 연결하면 스트림이 흐름 모드로 전환됩니다. 그러면 데이터는 사용 가능해지는 즉시 전달됩니다.

`readable.setEncoding()` 메서드를 사용하여 스트림에 대한 기본 인코딩이 지정된 경우 리스너 콜백에 데이터 청크가 문자열로 전달됩니다. 그렇지 않으면 데이터가 `Buffer`로 전달됩니다.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Event: `'end'` {#event-end}

**Added in: v0.9.4**

`'end'` 이벤트는 스트림에서 더 이상 소비할 데이터가 없을 때 발생합니다.

`'end'` 이벤트는 데이터가 완전히 소비되지 않으면 **발생하지 않습니다**. 이는 스트림을 흐름 모드로 전환하거나 모든 데이터가 소비될 때까지 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize)를 반복적으로 호출하여 달성할 수 있습니다.

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

`'error'` 이벤트는 `Readable` 구현에 의해 언제든지 발생할 수 있습니다. 일반적으로 이는 기본 스트림이 기본 내부 오류로 인해 데이터를 생성할 수 없거나 스트림 구현이 유효하지 않은 데이터 청크를 푸시하려고 할 때 발생할 수 있습니다.

리스너 콜백에는 단일 `Error` 객체가 전달됩니다.

##### Event: `'pause'` {#event-pause}

**Added in: v0.9.4**

`'pause'` 이벤트는 [`stream.pause()`](/ko/nodejs/api/stream#readablepause)가 호출되고 `readableFlowing`이 `false`가 아닐 때 발생합니다.

##### Event: `'readable'` {#event-readable}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | The `'readable'` is always emitted in the next tick after `.push()` is called. |
| v10.0.0 | Using `'readable'` requires calling `.read()`. |
| v0.9.4 | Added in: v0.9.4 |
:::

`'readable'` 이벤트는 구성된 높은 워터마크(`state.highWaterMark`)까지 스트림에서 읽을 수 있는 데이터가 있을 때 발생합니다. 효과적으로 스트림에 버퍼 내에 새로운 정보가 있음을 나타냅니다. 이 버퍼 내에 데이터가 있으면 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize)를 호출하여 해당 데이터를 검색할 수 있습니다. 또한 `'readable'` 이벤트는 스트림의 끝에 도달했을 때에도 발생할 수 있습니다.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
스트림의 끝에 도달한 경우 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize)를 호출하면 `null`이 반환되고 `'end'` 이벤트가 트리거됩니다. 이는 읽을 데이터가 전혀 없는 경우에도 마찬가지입니다. 예를 들어 다음 예제에서 `foo.txt`는 빈 파일입니다.

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
이 스크립트를 실행한 출력은 다음과 같습니다.

```bash [BASH]
$ node test.js
readable: null
end
```
경우에 따라 `'readable'` 이벤트에 대한 리스너를 연결하면 내부 버퍼에 어느 정도의 데이터가 읽혀질 수 있습니다.

일반적으로 `readable.pipe()` 및 `'data'` 이벤트 메커니즘은 `'readable'` 이벤트보다 이해하기 쉽습니다. 그러나 `'readable'`을 처리하면 처리량이 증가할 수 있습니다.

`'readable'`과 [`'data'`](/ko/nodejs/api/stream#event-data)가 동시에 사용되는 경우 `'readable'`이 흐름 제어에서 우선 순위를 갖습니다. 즉, `'data'`는 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize)가 호출될 때만 발생합니다. `readableFlowing` 속성은 `false`가 됩니다. `'readable'`이 제거될 때 `'data'` 리스너가 있으면 스트림이 흐르기 시작합니다. 즉, `.resume()`을 호출하지 않고도 `'data'` 이벤트가 발생합니다.


##### Event: `'resume'` {#event-resume}

**추가된 버전: v0.9.4**

`'resume'` 이벤트는 [`stream.resume()`](/ko/nodejs/api/stream#readableresume)이 호출되고 `readableFlowing`이 `true`가 아닐 때 발생합니다.

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 이미 파괴된 스트림에서 아무것도 수행하지 않습니다. |
| v8.0.0 | 추가된 버전: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) `'error'` 이벤트에서 페이로드로 전달될 오류
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

스트림을 파괴합니다. 선택적으로 `'error'` 이벤트를 발생시키고 `'close'` 이벤트를 발생시킵니다(단, `emitClose`가 `false`로 설정되지 않은 경우). 이 호출 후, 읽을 수 있는 스트림은 모든 내부 리소스를 해제하고 `push()`에 대한 후속 호출은 무시됩니다.

`destroy()`가 호출되면 추가 호출은 아무것도 수행하지 않으며 `_destroy()`에서 발생하는 오류 외에는 `'error'`로 더 이상 오류가 발생하지 않을 수 있습니다.

구현자는 이 메서드를 재정의하지 말고 대신 [`readable._destroy()`](/ko/nodejs/api/stream#readable_destroyerr-callback)를 구현해야 합니다.

##### `readable.closed` {#readableclosed}

**추가된 버전: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'close'`가 발생한 후 `true`입니다.

##### `readable.destroyed` {#readabledestroyed}

**추가된 버전: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`readable.destroy()`](/ko/nodejs/api/stream#readabledestroyerror)가 호출된 후 `true`입니다.

##### `readable.isPaused()` {#readableispaused}

**추가된 버전: v0.11.14**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`readable.isPaused()` 메서드는 `Readable`의 현재 작동 상태를 반환합니다. 이는 주로 `readable.pipe()` 메서드의 기본 메커니즘에서 사용됩니다. 대부분의 일반적인 경우, 이 메서드를 직접 사용할 이유는 없습니다.

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

- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.pause()` 메서드는 흐름 모드(flowing mode)의 스트림이 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트를 내보내는 것을 중단하고, 흐름 모드에서 벗어나도록 합니다. 사용 가능한 데이터는 내부 버퍼에 남아 있습니다.

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
`'readable'` 이벤트 리스너가 있는 경우 `readable.pause()` 메서드는 아무런 효과가 없습니다.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Added in: v0.9.4**

- `destination` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) 데이터를 쓸 목적지
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 파이프 옵션
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 리더가 끝나면 작성기를 종료합니다. **기본값:** `true`.
  
 
- 반환: [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) *destination* (`Duplex` 스트림 또는 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림인 경우 파이프 체인을 구성할 수 있도록 함)

`readable.pipe()` 메서드는 `readable`에 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림을 연결하여 자동으로 흐름 모드로 전환하고 연결된 [`Writable`](/ko/nodejs/api/stream#class-streamwritable)에 모든 데이터를 푸시합니다. 데이터 흐름은 대상 `Writable` 스트림이 더 빠른 `Readable` 스트림에 압도되지 않도록 자동으로 관리됩니다.

다음 예제는 `readable`의 모든 데이터를 `file.txt`라는 파일에 파이프합니다.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```
여러 개의 `Writable` 스트림을 단일 `Readable` 스트림에 연결할 수 있습니다.

`readable.pipe()` 메서드는 *destination* 스트림에 대한 참조를 반환하여 파이프된 스트림 체인을 설정할 수 있도록 합니다.

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
기본적으로, 소스 `Readable` 스트림이 [`'end'`](/ko/nodejs/api/stream#event-end)를 내보낼 때 대상 `Writable` 스트림에서 [`stream.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback)가 호출되어 대상이 더 이상 쓸 수 없게 됩니다. 이 기본 동작을 비활성화하려면 `end` 옵션을 `false`로 전달하여 대상 스트림이 열린 상태로 유지되도록 할 수 있습니다.

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
한 가지 중요한 주의 사항은 `Readable` 스트림이 처리 중에 오류를 내보내는 경우 `Writable` 대상은 자동으로 *닫히지 않습니다*. 오류가 발생하면 메모리 누수를 방지하기 위해 각 스트림을 *수동으로* 닫아야 합니다.

[`process.stderr`](/ko/nodejs/api/process#processstderr) 및 [`process.stdout`](/ko/nodejs/api/process#processstdout) `Writable` 스트림은 지정된 옵션에 관계없이 Node.js 프로세스가 종료될 때까지 닫히지 않습니다.


##### `readable.read([size])` {#readablereadsize}

**추가된 버전: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 데이터의 양을 지정하는 선택적 인자입니다.
- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`readable.read()` 메서드는 내부 버퍼에서 데이터를 읽어 반환합니다. 읽을 수 있는 데이터가 없으면 `null`이 반환됩니다. 기본적으로 데이터는 `Buffer` 객체로 반환됩니다. 단, `readable.setEncoding()` 메서드를 사용하여 인코딩이 지정되었거나 스트림이 객체 모드로 작동 중인 경우는 예외입니다.

선택적 `size` 인자는 읽을 특정 바이트 수를 지정합니다. 읽을 `size` 바이트가 없는 경우 `null`이 반환됩니다. *단*, 스트림이 종료된 경우 내부 버퍼에 남아 있는 모든 데이터가 반환됩니다.

`size` 인자가 지정되지 않은 경우 내부 버퍼에 포함된 모든 데이터가 반환됩니다.

`size` 인자는 1GiB보다 작거나 같아야 합니다.

`readable.read()` 메서드는 일시 중지 모드로 작동하는 `Readable` 스트림에서만 호출해야 합니다. 흐름 모드에서는 내부 버퍼가 완전히 비워질 때까지 `readable.read()`가 자동으로 호출됩니다.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable'은 데이터가 버퍼링될 때 여러 번 트리거될 수 있습니다.
readable.on('readable', () => {
  let chunk;
  console.log('스트림을 읽을 수 있습니다 (새 데이터가 버퍼에 수신됨)');
  // 루프를 사용하여 현재 사용 가능한 모든 데이터를 읽도록 합니다.
  while (null !== (chunk = readable.read())) {
    console.log(`데이터 ${chunk.length} 바이트 읽음...`);
  }
});

// 'end'는 더 이상 사용 가능한 데이터가 없을 때 한 번 트리거됩니다.
readable.on('end', () => {
  console.log('스트림의 끝에 도달했습니다.');
});
```
`readable.read()`를 호출할 때마다 데이터 청크 또는 `null`이 반환되며, 이는 해당 시점에 읽을 데이터가 더 이상 없음을 나타냅니다. 이러한 청크는 자동으로 연결되지 않습니다. 단일 `read()` 호출이 모든 데이터를 반환하지 않으므로 while 루프를 사용하여 모든 데이터를 검색할 때까지 청크를 계속 읽어야 할 수 있습니다. 큰 파일을 읽을 때 `.read()`는 버퍼링된 모든 콘텐츠를 소비했지만 아직 버퍼링할 데이터가 더 있을 수 있음을 나타내는 `null`을 일시적으로 반환할 수 있습니다. 이러한 경우 버퍼에 더 많은 데이터가 있으면 새 `'readable'` 이벤트가 발생하고 `'end'` 이벤트는 데이터 전송의 끝을 나타냅니다.

따라서 `readable`에서 파일의 전체 내용을 읽으려면 여러 `'readable'` 이벤트에서 청크를 수집해야 합니다.

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
객체 모드의 `Readable` 스트림은 `size` 인자의 값에 관계없이 [`readable.read(size)`](/ko/nodejs/api/stream#readablereadsize) 호출에서 항상 단일 항목을 반환합니다.

`readable.read()` 메서드가 데이터 청크를 반환하면 `'data'` 이벤트도 발생합니다.

[`'end'`](/ko/nodejs/api/stream#event-end) 이벤트가 발생한 후 [`stream.read([size])`](/ko/nodejs/api/stream#readablereadsize)를 호출하면 `null`이 반환됩니다. 런타임 오류는 발생하지 않습니다.


##### `readable.readable` {#readablereadable}

**추가된 버전: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`readable.read()`](/ko/nodejs/api/stream#readablereadsize)를 안전하게 호출할 수 있으면 `true`입니다. 이는 스트림이 소멸되지 않았거나 `'error'` 또는 `'end'`가 발생하지 않았음을 의미합니다.

##### `readable.readableAborted` {#readablereadableaborted}

**추가된 버전: v16.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

스트림이 `'end'`를 발생시키기 전에 소멸되었거나 오류가 발생했는지 여부를 반환합니다.

##### `readable.readableDidRead` {#readablereadabledidread}

**추가된 버전: v16.7.0, v14.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'data'`가 발생했는지 여부를 반환합니다.

##### `readable.readableEncoding` {#readablereadableencoding}

**추가된 버전: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지정된 `Readable` 스트림의 `encoding` 속성에 대한 Getter입니다. `encoding` 속성은 [`readable.setEncoding()`](/ko/nodejs/api/stream#readablesetencodingencoding) 메서드를 사용하여 설정할 수 있습니다.

##### `readable.readableEnded` {#readablereadableended}

**추가된 버전: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`'end'`](/ko/nodejs/api/stream#event-end) 이벤트가 발생하면 `true`가 됩니다.

##### `readable.errored` {#readableerrored}

**추가된 버전: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

스트림이 오류와 함께 소멸된 경우 오류를 반환합니다.

##### `readable.readableFlowing` {#readablereadableflowing}

**추가된 버전: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 속성은 [세 가지 상태](/ko/nodejs/api/stream#three-states) 섹션에 설명된 대로 `Readable` 스트림의 현재 상태를 반영합니다.


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**추가된 버전: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 `Readable`을 만들 때 전달된 `highWaterMark`의 값을 반환합니다.

##### `readable.readableLength` {#readablereadablelength}

**추가된 버전: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 읽을 준비가 된 큐에 있는 바이트 수(또는 객체 수)를 포함합니다. 이 값은 `highWaterMark`의 상태에 대한 내부 관찰 데이터를 제공합니다.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**추가된 버전: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

주어진 `Readable` 스트림의 `objectMode` 속성에 대한 getter입니다.

##### `readable.resume()` {#readableresume}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `'readable'` 이벤트 리스너가 있는 경우 `resume()`은 아무런 효과가 없습니다. |
| v0.9.4 | 추가된 버전: v0.9.4 |
:::

- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.resume()` 메서드는 명시적으로 일시 중지된 `Readable` 스트림이 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트를 다시 내보내도록 하여 스트림을 흐름 모드로 전환합니다.

`readable.resume()` 메서드는 실제로 데이터를 처리하지 않고 스트림에서 데이터를 완전히 소비하는 데 사용할 수 있습니다.

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('끝에 도달했지만 아무것도 읽지 않았습니다.');
  });
```
`'readable'` 이벤트 리스너가 있는 경우 `readable.resume()` 메서드는 아무런 효과가 없습니다.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**추가된 버전: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 인코딩입니다.
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.setEncoding()` 메서드는 `Readable` 스트림에서 읽은 데이터의 문자 인코딩을 설정합니다.

기본적으로 인코딩은 할당되지 않으며 스트림 데이터는 `Buffer` 객체로 반환됩니다. 인코딩을 설정하면 스트림 데이터가 `Buffer` 객체가 아닌 지정된 인코딩의 문자열로 반환됩니다. 예를 들어 `readable.setEncoding('utf8')`을 호출하면 출력 데이터가 UTF-8 데이터로 해석되어 문자열로 전달됩니다. `readable.setEncoding('hex')`를 호출하면 데이터가 16진수 문자열 형식으로 인코딩됩니다.

`Readable` 스트림은 스트림에서 단순히 `Buffer` 객체로 가져올 경우 부적절하게 디코딩될 수 있는 스트림을 통해 전달되는 멀티 바이트 문자를 적절하게 처리합니다.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('문자열 데이터 %d자를 받았습니다:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**추가된 버전: v0.9.4**

- `destination` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) 선택 사항, unpipe할 특정 스트림
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.unpipe()` 메서드는 [`stream.pipe()`](/ko/nodejs/api/stream#readablepipedestination-options) 메서드를 사용하여 이전에 연결된 `Writable` 스트림을 분리합니다.

`destination`이 지정되지 않으면 *모든* 파이프가 분리됩니다.

`destination`이 지정되었지만 해당 파이프가 설정되지 않은 경우 메서드는 아무것도 수행하지 않습니다.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// readable의 모든 데이터가 'file.txt'로 이동합니다.
// 하지만 처음 1초 동안만 그렇습니다.
readable.pipe(writable);
setTimeout(() => {
  console.log('file.txt에 쓰기 중지.');
  readable.unpipe(writable);
  console.log('파일 스트림을 수동으로 닫습니다.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 이제 `chunk` 인수가 `TypedArray` 또는 `DataView` 인스턴스일 수 있습니다. |
| v8.0.0 | 이제 `chunk` 인수가 `Uint8Array` 인스턴스일 수 있습니다. |
| v0.9.11 | 추가된 버전: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 읽기 큐에 unshift할 데이터 청크입니다. 객체 모드에서 작동하지 않는 스트림의 경우 `chunk`는 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 또는 `null`이어야 합니다. 객체 모드 스트림의 경우 `chunk`는 모든 JavaScript 값일 수 있습니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 청크의 인코딩입니다. `'utf8'` 또는 `'ascii'`와 같은 유효한 `Buffer` 인코딩이어야 합니다.

`chunk`를 `null`로 전달하면 스트림의 끝(EOF)을 알리고 `readable.push(null)`과 동일하게 동작하며, 그 후에는 더 이상 데이터를 쓸 수 없습니다. EOF 신호는 버퍼의 끝에 배치되고 버퍼링된 데이터는 여전히 플러시됩니다.

`readable.unshift()` 메서드는 데이터 청크를 내부 버퍼로 다시 푸시합니다. 이는 스트림이 소스에서 낙관적으로 가져온 데이터의 일부 양을 "언컨슘"해야 하는 코드에 의해 소비되고 있어 데이터를 다른 당사자에게 전달할 수 있는 특정 상황에서 유용합니다.

`stream.unshift(chunk)` 메서드는 [`'end'`](/ko/nodejs/api/stream#event-end) 이벤트가 발생한 후에는 호출할 수 없으며, 런타임 오류가 발생합니다.

`stream.unshift()`를 사용하는 개발자는 대신 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림을 사용하는 것을 고려해야 합니다. 자세한 내용은 [스트림 구현자를 위한 API](/ko/nodejs/api/stream#api-for-stream-implementers) 섹션을 참조하십시오.

```js [ESM]
// \n\n으로 구분된 헤더를 가져옵니다.
// 너무 많이 가져온 경우 unshift()를 사용합니다.
// (error, header, stream)으로 콜백을 호출합니다.
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
        // 헤더 경계를 찾았습니다.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // unshifting하기 전에 'readable' 리스너를 제거합니다.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // 이제 메시지 본문을 스트림에서 읽을 수 있습니다.
        callback(null, header, stream);
        return;
      }
      // 여전히 헤더를 읽고 있습니다.
      header += str;
    }
  }
}
```
[`stream.push(chunk)`](/ko/nodejs/api/stream#readablepushchunk-encoding)와 달리 `stream.unshift(chunk)`는 스트림의 내부 읽기 상태를 재설정하여 읽기 프로세스를 종료하지 않습니다. 이는 `readable.unshift()`가 읽기 중에 호출되는 경우(즉, 사용자 정의 스트림의 [`stream._read()`](/ko/nodejs/api/stream#readable_readsize) 구현 내에서) 예기치 않은 결과를 초래할 수 있습니다. `readable.unshift()`를 호출한 후 즉시 [`stream.push('')`](/ko/nodejs/api/stream#readablepushchunk-encoding)를 호출하면 읽기 상태가 적절하게 재설정되지만, 읽기를 수행하는 과정에서 `readable.unshift()`를 호출하지 않는 것이 가장 좋습니다.


##### `readable.wrap(stream)` {#readablewrapstream}

**추가된 버전: v0.9.4**

- `stream` [\<Stream\>](/ko/nodejs/api/stream#stream) "구식" 읽기 가능 스트림
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Node.js 0.10 이전에는 스트림이 현재 정의된 대로 전체 `node:stream` 모듈 API를 구현하지 않았습니다. 자세한 내용은 [호환성](/ko/nodejs/api/stream#compatibility-with-older-nodejs-versions)을 참조하세요.

[`'data'`](/ko/nodejs/api/stream#event-data) 이벤트를 발생시키고 자문 전용인 [`stream.pause()`](/ko/nodejs/api/stream#readablepause) 메서드를 가진 이전 Node.js 라이브러리를 사용하는 경우 `readable.wrap()` 메서드를 사용하여 이전 스트림을 데이터 소스로 사용하는 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림을 만들 수 있습니다.

`readable.wrap()`을 사용할 필요는 거의 없지만 이전 Node.js 애플리케이션 및 라이브러리와 상호 작용할 수 있도록 편의를 위해 제공되었습니다.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // 기타.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.14.0 | Symbol.asyncIterator 지원이 더 이상 실험적이지 않습니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- 반환: 스트림을 완전히 소비하는 [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)。

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
루프가 `break`, `return` 또는 `throw`로 종료되면 스트림이 파괴됩니다. 즉, 스트림을 반복하면 스트림이 완전히 소비됩니다. 스트림은 `highWaterMark` 옵션과 같은 크기의 청크로 읽혀집니다. 위의 코드 예제에서 [`fs.createReadStream()`](/ko/nodejs/api/fs#fscreatereadstreampath-options)에 `highWaterMark` 옵션이 제공되지 않았기 때문에 파일에 64KiB 미만의 데이터가 있는 경우 데이터는 단일 청크로 제공됩니다.


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**추가된 버전: v20.4.0, v18.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`readable.destroy()`](/ko/nodejs/api/stream#readabledestroyerror)를 `AbortError`와 함께 호출하고 스트림이 완료되면 이행되는 프로미스를 반환합니다.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**추가된 버전: v19.1.0, v18.13.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `stream` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 시그널이 중단되면 스트림 파기를 허용합니다.


- 반환: [\<Duplex\>](/ko/nodejs/api/stream#class-streamduplex) 스트림 `stream`으로 구성된 스트림입니다.

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
자세한 내용은 [`stream.compose`](/ko/nodejs/api/stream#streamcomposestreams)를 참조하십시오.

##### `readable.iterator([options])` {#readableiteratoroptions}

**추가된 버전: v16.3.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 비동기 이터레이터에서 `return`을 호출하거나 `break`, `return` 또는 `throw`를 사용하여 `for await...of` 반복을 종료해도 스트림이 파기되지 않습니다. **기본값:** `true`.


- 반환: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) 스트림을 소비합니다.

이 메서드로 생성된 이터레이터는 사용자가 `return`, `break` 또는 `throw`로 `for await...of` 루프를 종료하거나 이터레이션 중에 스트림이 오류를 방출하는 경우 이터레이터가 스트림을 파기해야 하는 경우 스트림의 파기를 취소할 수 있는 옵션을 제공합니다.

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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.7.0, v18.19.0 | 옵션에 `highWaterMark` 추가. |
| v17.4.0, v16.14.0 | 추가됨: v17.4.0, v16.14.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 모든 청크를 매핑하는 함수.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 소멸되면 중단되어 `fn` 호출을 조기에 중단할 수 있습니다.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림에서 한 번에 호출할 `fn`의 최대 동시 호출 수입니다. **기본값:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 매핑된 항목의 사용자 소비를 기다리는 동안 버퍼링할 항목 수입니다. **기본값:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 소멸시킬 수 있습니다.


- 반환: [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) 함수 `fn`으로 매핑된 스트림입니다.

이 메서드를 사용하면 스트림을 매핑할 수 있습니다. `fn` 함수는 스트림의 모든 청크에 대해 호출됩니다. `fn` 함수가 프로미스를 반환하면 해당 프로미스는 결과 스트림에 전달되기 전에 `await`됩니다.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 동기 매퍼 사용.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// 비동기 매퍼를 사용하여 한 번에 최대 2개의 쿼리를 만듭니다.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // resolver.resolve4의 DNS 결과를 기록합니다.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v20.7.0, v18.19.0 | options에 `highWaterMark` 추가됨. |
| v17.4.0, v16.14.0 | 다음 버전에서 추가됨: v17.4.0, v16.14.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림에서 청크를 필터링하는 함수입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림에서 가져온 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 소멸되면 중단되어 `fn` 호출을 조기에 중단할 수 있습니다.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림에서 한 번에 호출할 `fn`의 최대 동시 호출 횟수입니다. **기본값:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 필터링된 항목의 사용자 소비를 기다리는 동안 버퍼링할 항목 수입니다. **기본값:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 소멸할 수 있습니다.


- 반환: [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) 조건자 `fn`으로 필터링된 스트림입니다.

이 메서드를 사용하면 스트림을 필터링할 수 있습니다. 스트림의 각 청크에 대해 `fn` 함수가 호출되고 truthy 값을 반환하면 청크가 결과 스트림으로 전달됩니다. `fn` 함수가 Promise를 반환하면 해당 Promise는 `await`됩니다.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 동기 조건자를 사용합니다.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 비동기 조건자를 사용하여 한 번에 최대 2개의 쿼리를 만듭니다.
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
  // 확인된 DNS 레코드에서 60초 이상인 도메인을 기록합니다.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 각 청크에서 호출할 함수입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 파괴되면 중단되어 `fn` 호출을 조기에 중단할 수 있습니다.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림에서 한 번에 호출할 `fn`의 최대 동시 호출 수입니다. **기본값:** `1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림 파괴를 허용합니다.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림이 완료되었을 때의 프로미스입니다.

이 메서드는 스트림을 반복할 수 있습니다. 스트림의 각 청크에 대해 `fn` 함수가 호출됩니다. `fn` 함수가 프로미스를 반환하면 해당 프로미스가 `await`됩니다.

이 메서드는 청크를 선택적으로 동시에 처리할 수 있다는 점에서 `for await...of` 루프와 다릅니다. 또한 `forEach` 반복은 `signal` 옵션을 전달하고 관련 `AbortController`를 중단시켜서만 중단할 수 있는 반면 `for await...of`는 `break` 또는 `return`으로 중단할 수 있습니다. 어느 경우든 스트림은 파괴됩니다.

이 메서드는 기본 메커니즘에서 [`readable`](/ko/nodejs/api/stream#class-streamreadable) 이벤트를 사용하고 동시 `fn` 호출 수를 제한할 수 있다는 점에서 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트를 수신하는 것과 다릅니다.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 동기적 술어를 사용합니다.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 비동기적 술어를 사용하여 한 번에 최대 2개의 쿼리를 수행합니다.
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
  // `for await (const result of dnsResults)`와 유사한 결과를 기록합니다.
  console.log(result);
});
console.log('done'); // 스트림이 완료되었습니다.
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**다음 버전에서 추가됨: v17.5.0, v16.15.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단된 경우 toArray 작업을 취소할 수 있습니다.


- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 스트림의 내용을 포함하는 배열을 포함하는 프로미스입니다.

이 메서드를 사용하면 스트림의 내용을 쉽게 얻을 수 있습니다.

이 메서드는 전체 스트림을 메모리로 읽기 때문에 스트림의 이점을 무효화합니다. 이는 스트림을 소비하는 주요 방법이 아니라 상호 운용성 및 편의성을 위한 것입니다.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// .map을 사용하여 DNS 쿼리를 동시에 만들고
// toArray를 사용하여 결과를 배열로 수집합니다.
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

**다음 버전에서 추가됨: v17.5.0, v16.15.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 각 청크에서 호출할 함수입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 소멸되어 `fn` 호출을 조기에 중단할 수 있도록 중단되었습니다.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림에서 한 번에 호출할 `fn`의 최대 동시 호출입니다. **기본값:** `1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 소멸시킬 수 있습니다.


- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `fn`이 청크 중 하나 이상에 대해 참 값을 반환한 경우 `true`로 평가되는 프로미스입니다.

이 메서드는 `Array.prototype.some`과 유사하며 대기 반환 값이 `true`(또는 참 값)가 될 때까지 스트림의 각 청크에서 `fn`을 호출합니다. 청크에서 `fn` 호출의 대기 반환 값이 참이면 스트림이 소멸되고 프로미스가 `true`로 이행됩니다. 청크에서 `fn` 호출 중 어느 것도 참 값을 반환하지 않으면 프로미스는 `false`로 이행됩니다.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 동기 술어를 사용합니다.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// 비동기 술어를 사용하여 한 번에 최대 2개의 파일 검사를 수행합니다.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // 목록의 파일이 1MB보다 크면 `true`
console.log('done'); // 스트림이 완료되었습니다.
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Added in: v17.5.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 각 청크에서 호출할 함수입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) `fn` 호출을 조기에 중단할 수 있도록 스트림이 소멸되면 중단됩니다.

 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 한 번에 스트림에서 호출할 `fn`의 최대 동시 호출 수입니다. **기본값:** `1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 소멸할 수 있습니다.

 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `fn`이 참 값을 사용하여 평가된 첫 번째 청크 또는 요소를 찾을 수 없는 경우 `undefined`로 평가되는 프로미스입니다.

이 메서드는 `Array.prototype.find`와 유사하며 스트림의 각 청크에서 `fn`을 호출하여 `fn`에 대한 참 값을 가진 청크를 찾습니다. `fn` 호출의 대기 반환 값이 참이면 스트림이 소멸되고 `fn`이 참 값을 반환한 값으로 프로미스가 이행됩니다. 청크에 대한 모든 `fn` 호출이 거짓 값을 반환하면 프로미스가 `undefined`로 이행됩니다.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 동기 술어를 사용합니다.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// 비동기 술어를 사용하여 한 번에 최대 2개의 파일 검사를 수행합니다.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // 목록에 1MB보다 큰 파일이 있는 경우 큰 파일의 파일 이름
console.log('done'); // 스트림이 완료되었습니다.
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 각 청크에 대해 호출할 함수입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 소멸되면 중단되어 `fn` 호출을 조기에 중단할 수 있습니다.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림에서 한 번에 호출할 `fn`의 최대 동시 호출 수입니다. **기본값:** `1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 소멸할 수 있습니다.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `fn`이 모든 청크에 대해 truthy 값을 반환한 경우 `true`로 평가되는 프로미스입니다.

이 메서드는 `Array.prototype.every`와 유사하며 스트림의 각 청크에 대해 `fn`을 호출하여 모든 대기 반환 값이 `fn`에 대해 truthy 값인지 확인합니다. 청크에 대한 `fn` 호출 대기 반환 값이 falsy이면 스트림이 소멸되고 프로미스가 `false`로 이행됩니다. 청크에 대한 모든 `fn` 호출이 truthy 값을 반환하면 프로미스가 `true`로 이행됩니다.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 동기 술어 사용.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// 비동기 술어를 사용하여 한 번에 최대 2개의 파일 검사 수행.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// 목록의 모든 파일이 1MiB보다 크면 `true`
console.log(allBigFiles);
console.log('done'); // 스트림이 완료되었습니다.
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 모든 청크에 매핑할 함수입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 소멸되면 중단되어 `fn` 호출을 조기에 중단할 수 있습니다.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림에서 한 번에 호출할 `fn`의 최대 동시 호출 수입니다. **기본값:** `1`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 소멸시킬 수 있습니다.


- 반환: [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) 함수 `fn`으로 플랫 매핑된 스트림입니다.

이 메서드는 스트림의 각 청크에 주어진 콜백을 적용한 다음 결과를 평탄화하여 새 스트림을 반환합니다.

`fn`에서 스트림 또는 다른 iterable 또는 async iterable을 반환할 수 있으며 결과 스트림은 반환된 스트림으로 병합(평탄화)됩니다.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// 동기 매퍼를 사용합니다.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// 비동기 매퍼를 사용하여 4개 파일의 내용을 결합합니다.
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // 여기에는 4개 파일 모두의 내용(모든 청크)이 포함됩니다.
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**추가된 버전: v17.5.0, v16.15.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 가능 스트림에서 삭제할 청크 수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 파괴할 수 있습니다.


- 반환: [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) `limit` 청크가 삭제된 스트림입니다.

이 메서드는 처음 `limit` 청크가 삭제된 새 스트림을 반환합니다.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**추가된 버전: v17.5.0, v16.15.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 가능 스트림에서 가져올 청크 수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 파괴할 수 있습니다.


- 반환: [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) `limit` 청크가 가져온 스트림입니다.

이 메서드는 처음 `limit` 청크가 포함된 새 스트림을 반환합니다.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**추가된 버전: v17.5.0, v16.15.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 스트림의 모든 청크에 대해 호출할 리듀서 함수입니다.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `fn`에 대한 마지막 호출에서 얻은 값 또는 지정된 경우 `initial` 값, 그렇지 않으면 스트림의 첫 번째 청크입니다.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스트림의 데이터 청크입니다.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림이 파괴되면 중단되어 `fn` 호출을 일찍 중단할 수 있습니다.



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 감소에 사용할 초기 값입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 신호가 중단되면 스트림을 파괴할 수 있습니다.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 감소의 최종 값에 대한 프로미스입니다.

이 메서드는 스트림의 각 청크에 대해 순서대로 `fn`을 호출하여 이전 요소에 대한 계산 결과를 전달합니다. 감소의 최종 값에 대한 프로미스를 반환합니다.

`initial` 값이 제공되지 않으면 스트림의 첫 번째 청크가 초기 값으로 사용됩니다. 스트림이 비어 있으면 프로미스는 `ERR_INVALID_ARGS` 코드 속성이 있는 `TypeError`로 거부됩니다.

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
리듀서 함수는 스트림 요소를 요소별로 반복합니다. 즉, `concurrency` 매개변수 또는 병렬 처리가 없습니다. `reduce`를 동시에 수행하려면 비동기 함수를 [`readable.map`](/ko/nodejs/api/stream#readablemapfn-options) 메서드에 추출할 수 있습니다.

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

### 이중 스트림 및 변환 스트림 {#duplex-and-transform-streams}

#### 클래스: `stream.Duplex` {#class-streamduplex}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.8.0 | 이제 `Duplex` 인스턴스는 `instanceof stream.Writable`을 확인할 때 `true`를 반환합니다. |
| v0.9.4 | 추가됨: v0.9.4 |
:::

이중 스트림은 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 및 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 인터페이스를 모두 구현하는 스트림입니다.

`Duplex` 스트림의 예는 다음과 같습니다.

- [TCP 소켓](/ko/nodejs/api/net#class-netsocket)
- [zlib 스트림](/ko/nodejs/api/zlib)
- [암호화 스트림](/ko/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**추가됨: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`false`인 경우 스트림은 읽기 가능한 쪽이 끝나면 쓰기 가능한 쪽을 자동으로 종료합니다. 기본적으로 `true`인 `allowHalfOpen` 생성자 옵션에 의해 초기에 설정됩니다.

기존 `Duplex` 스트림 인스턴스의 반만 열린 동작을 변경하기 위해 수동으로 변경할 수 있지만 `'end'` 이벤트가 발생하기 전에 변경해야 합니다.

#### 클래스: `stream.Transform` {#class-streamtransform}

**추가됨: v0.9.4**

변환 스트림은 출력이 입력과 어떤 방식으로든 관련된 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림입니다. 모든 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림과 마찬가지로 `Transform` 스트림은 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 및 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 인터페이스를 모두 구현합니다.

`Transform` 스트림의 예는 다음과 같습니다.

- [zlib 스트림](/ko/nodejs/api/zlib)
- [암호화 스트림](/ko/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 이미 파괴된 스트림에서 아무 작업도 수행하지 않습니다. |
| v8.0.0 | 추가됨: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

스트림을 파괴하고 선택적으로 `'error'` 이벤트를 발생시킵니다. 이 호출 후 변환 스트림은 모든 내부 리소스를 해제합니다. 구현자는 이 메서드를 재정의하지 말고 대신 [`readable._destroy()`](/ko/nodejs/api/stream#readable_destroyerr-callback)를 구현해야 합니다. `Transform`의 `_destroy()`의 기본 구현은 `emitClose`가 false로 설정되지 않은 경우 `'close'`도 발생시킵니다.

`destroy()`가 호출되면 추가 호출은 아무 작업도 수행하지 않으며 `_destroy()`에서 발생하는 오류를 제외하고 더 이상 `'error'`로 발생하지 않습니다.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Added in: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 생성자 모두에 전달하여 버퍼링과 같은 옵션을 설정하는 값입니다.
- Returns: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 두 개의 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 인스턴스.

유틸리티 함수 `duplexPair`는 두 개의 항목이 있는 배열을 반환하며, 각 항목은 다른 쪽에 연결된 `Duplex` 스트림입니다.

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
한 스트림에 작성된 내용은 다른 스트림에서 읽을 수 있게 됩니다. 클라이언트가 작성한 데이터가 서버에서 읽을 수 있게 되는 네트워크 연결과 유사한 동작을 제공합니다.

Duplex 스트림은 대칭적입니다. 어느 한쪽을 사용해도 동작에 차이가 없습니다.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.5.0 | `ReadableStream` 및 `WritableStream`에 대한 지원이 추가되었습니다. |
| v15.11.0 | `signal` 옵션이 추가되었습니다. |
| v14.0.0 | `finished(stream, cb)`는 콜백을 호출하기 전에 `'close'` 이벤트가 발생할 때까지 기다립니다. 구현은 레거시 스트림을 감지하고 `'close'`를 발생시킬 것으로 예상되는 스트림에만 이 동작을 적용하려고 합니다. |
| v14.0.0 | `Readable` 스트림에서 `'end'` 전에 `'close'`를 발생시키면 `ERR_STREAM_PREMATURE_CLOSE` 오류가 발생합니다. |
| v14.0.0 | 콜백은 `finished(stream, cb)` 호출 전에 이미 완료된 스트림에서 호출됩니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `stream` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 읽기 가능 및/또는 쓰기 가능한 스트림/웹 스트림입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 `emit('error', err)` 호출이 완료된 것으로 간주되지 않습니다. **기본값:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 스트림이 아직 읽을 수 있더라도 스트림이 종료될 때 콜백이 호출됩니다. **기본값:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정하면 스트림이 아직 쓸 수 있더라도 스트림이 종료될 때 콜백이 호출됩니다. **기본값:** `true`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 스트림 종료 대기를 중단할 수 있습니다. 신호가 중단되더라도 기본 스트림은 *중단되지 않습니다*. 콜백은 `AbortError`와 함께 호출됩니다. 이 함수에 의해 추가된 모든 등록된 리스너도 제거됩니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 선택적 오류 인수를 사용하는 콜백 함수입니다.
- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 등록된 모든 리스너를 제거하는 정리 함수입니다.

스트림이 더 이상 읽기 가능하거나 쓰기 가능하지 않거나 오류 또는 조기 닫힘 이벤트가 발생했을 때 알림을 받는 함수입니다.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // Drain the stream.
```
특히 스트림이 조기에 파괴되는 (중단된 HTTP 요청과 같은) 오류 처리 시나리오에서 유용하며 `'end'` 또는 `'finish'`를 발생시키지 않습니다.

`finished` API는 [프로미스 버전](/ko/nodejs/api/stream#streamfinishedstream-options)을 제공합니다.

`stream.finished()`는 `callback`이 호출된 후에도 매달린 이벤트 리스너(특히 `'error'`, `'end'`, `'finish'` 및 `'close'`)를 남깁니다. 이는 예기치 않은 `'error'` 이벤트(잘못된 스트림 구현으로 인해)가 예기치 않은 충돌을 일으키지 않도록 하기 위한 것입니다. 원치 않는 동작인 경우 콜백에서 반환된 정리 함수를 호출해야 합니다.

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.7.0, v18.16.0 | 웹 스트림 지원 추가. |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 throw합니다. |
| v14.0.0 | `pipeline(..., cb)`는 콜백을 호출하기 전에 `'close'` 이벤트가 발생할 때까지 기다립니다. 구현은 레거시 스트림을 감지하고 `'close'`를 방출할 것으로 예상되는 스트림에만 이 동작을 적용하려고 합니다. |
| v13.10.0 | 비동기 제너레이터 지원 추가. |
| v10.0.0 | v10.0.0에 추가됨 |
:::

- `streams` [\<Stream[]\>](/ko/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ko/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ko/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
    - 반환값: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)

 
- `...transforms` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/ko/nodejs/api/webstreams#class-transformstream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 반환값: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)

 
- `destination` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 반환값: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 파이프라인이 완전히 완료되면 호출됩니다.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` `destination`에서 반환된 `Promise`의 해결된 값입니다.

 
- 반환값: [\<Stream\>](/ko/nodejs/api/stream#stream)

오류를 전달하고 적절하게 정리하고 파이프라인이 완료되면 콜백을 제공하는 스트림과 제너레이터 간에 파이프하는 모듈 메서드입니다.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// 파이프라인 API를 사용하여 일련의 스트림을 쉽게 파이프할 수 있습니다.
// 함께 연결하고 파이프라인이 완전히 완료되면 알림을 받습니다.

// 잠재적으로 거대한 tar 파일을 효율적으로 gzip하는 파이프라인:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('파이프라인 실패.', err);
    } else {
      console.log('파이프라인 성공.');
    }
  },
);
```
`pipeline` API는 [약속 버전](/ko/nodejs/api/stream#streampipelinesource-transforms-destination-options)을 제공합니다.

`stream.pipeline()`은 다음을 제외한 모든 스트림에서 `stream.destroy(err)`를 호출합니다.

- `'end'` 또는 `'close'`를 방출한 `Readable` 스트림.
- `'finish'` 또는 `'close'`를 방출한 `Writable` 스트림.

`stream.pipeline()`은 `callback`이 호출된 후 스트림에 매달린 이벤트 리스너를 남깁니다. 실패 후 스트림을 재사용하는 경우 이벤트 리스너 누출 및 숨겨진 오류가 발생할 수 있습니다. 마지막 스트림이 읽을 수 있는 경우 마지막 스트림을 나중에 사용할 수 있도록 매달린 이벤트 리스너가 제거됩니다.

`stream.pipeline()`은 오류가 발생하면 모든 스트림을 닫습니다. `pipeline`과 함께 `IncomingRequest`를 사용하면 예상되는 응답을 보내지 않고 소켓을 파괴하므로 예기치 않은 동작이 발생할 수 있습니다. 아래 예시를 참조하세요.

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // 해당 파일 없음
      // `pipeline`이 이미 소켓을 파괴했기 때문에 이 메시지를 보낼 수 없습니다.
      return res.end('오류!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.1.0, v20.10.0 | 스트림 클래스 지원 추가. |
| v19.8.0, v18.16.0 | 웹 스트림 지원 추가. |
| v16.9.0 | 추가 위치: v16.9.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - `stream.compose`는 실험적입니다.
:::

- `streams` [\<Stream[]\>](/ko/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ko/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ko/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/ko/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

둘 이상의 스트림을 첫 번째 스트림에 쓰고 마지막 스트림에서 읽는 `Duplex` 스트림으로 결합합니다. 제공된 각 스트림은 `stream.pipeline`을 사용하여 다음 스트림으로 파이프됩니다. 스트림 중 하나에서 오류가 발생하면 외부 `Duplex` 스트림을 포함하여 모두 제거됩니다.

`stream.compose`는 차례로 다른 스트림으로 파이프될 수 있는 (그리고 그래야 하는) 새 스트림을 반환하므로 구성이 가능합니다. 대조적으로, 스트림을 `stream.pipeline`에 전달할 때 일반적으로 첫 번째 스트림은 읽기 가능한 스트림이고 마지막 스트림은 쓰기 가능한 스트림이 되어 폐쇄 회로를 형성합니다.

`Function`이 전달되면 `source` `Iterable`을 사용하는 팩토리 메서드여야 합니다.

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
`stream.compose`는 비동기 이터러블, 제너레이터 및 함수를 스트림으로 변환하는 데 사용할 수 있습니다.

- `AsyncIterable`은 읽기 가능한 `Duplex`로 변환됩니다. `null`을 생성할 수 없습니다.
- `AsyncGeneratorFunction`은 읽기/쓰기 변환 `Duplex`로 변환됩니다. 소스 `AsyncIterable`을 첫 번째 매개변수로 사용해야 합니다. `null`을 생성할 수 없습니다.
- `AsyncFunction`은 쓰기 가능한 `Duplex`로 변환됩니다. `null` 또는 `undefined`를 반환해야 합니다.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// AsyncIterable을 읽기 가능한 Duplex로 변환합니다.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// AsyncGenerator를 변환 Duplex로 변환합니다.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// AsyncFunction을 쓰기 가능한 Duplex로 변환합니다.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // prints 'HELLOWORLD'
```
`stream.compose`를 연산자로 사용하려면 [`readable.compose(stream)`](/ko/nodejs/api/stream#readablecomposestream-options)을 참조하십시오.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Added in: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) `Symbol.asyncIterator` 또는 `Symbol.iterator` iterable 프로토콜을 구현하는 객체입니다. null 값이 전달되면 'error' 이벤트를 발생시킵니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `new stream.Readable([options])`에 제공되는 옵션입니다. 기본적으로 `Readable.from()`은 `options.objectMode`를 `true`로 설정합니다. `options.objectMode`를 `false`로 설정하여 명시적으로 선택 해제하지 않는 한 그렇습니다.
- 반환: [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)

이터레이터에서 읽기 가능한 스트림을 만드는 유틸리티 메서드입니다.

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
`Readable.from(string)` 또는 `Readable.from(buffer)`를 호출하면 성능상의 이유로 다른 스트림 의미 체계와 일치하도록 문자열 또는 버퍼가 반복되지 않습니다.

프로미스를 포함하는 `Iterable` 객체가 인수로 전달되면 처리되지 않은 거부가 발생할 수 있습니다.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unhandled rejection
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `readableStream` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
  
 
- 반환: [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**추가됨: v16.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `stream` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
- 반환: `boolean`

스트림을 읽었거나 취소했는지 여부를 반환합니다.

### `stream.isErrored(stream)` {#streamiserroredstream}

**추가됨: v17.3.0, v16.14.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `stream` [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/ko/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/ko/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

스트림에서 오류가 발생했는지 여부를 반환합니다.

### `stream.isReadable(stream)` {#streamisreadablestream}

**추가됨: v17.4.0, v16.14.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `stream` [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/ko/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

스트림이 읽을 수 있는지 여부를 반환합니다.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**추가됨: v17.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `streamReadable` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 지정된 `stream.Readable`에서 읽을 때 역압이 적용되기 전 생성된 `ReadableStream`의 최대 내부 큐 크기입니다. 값이 제공되지 않으면 지정된 `stream.Readable`에서 가져옵니다.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 주어진 데이터 청크의 크기를 계산하는 함수입니다. 값이 제공되지 않으면 모든 청크에 대해 크기가 `1`이 됩니다.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
  
 
- 반환: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `writableStream` [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
  
 
- 반환: [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `streamWritable` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
- 반환: [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v19.5.0, v18.17.0 | `src` 인수는 이제 `ReadableStream` 또는 `WritableStream`일 수 있습니다. |
| v16.8.0 | Added in: v16.8.0 |
:::

- `src` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<Blob\>](/ko/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)

듀플렉스 스트림을 생성하기 위한 유틸리티 메서드입니다.

- `Stream`은 쓰기 가능한 스트림을 쓰기 가능한 `Duplex`로, 읽기 가능한 스트림을 `Duplex`로 변환합니다.
- `Blob`은 읽기 가능한 `Duplex`로 변환합니다.
- `string`은 읽기 가능한 `Duplex`로 변환합니다.
- `ArrayBuffer`는 읽기 가능한 `Duplex`로 변환합니다.
- `AsyncIterable`은 읽기 가능한 `Duplex`로 변환합니다. `null`을 생성할 수 없습니다.
- `AsyncGeneratorFunction`은 읽기/쓰기 가능한 변환 `Duplex`로 변환합니다. 소스 `AsyncIterable`을 첫 번째 매개변수로 사용해야 합니다. `null`을 생성할 수 없습니다.
- `AsyncFunction`은 쓰기 가능한 `Duplex`로 변환합니다. `null` 또는 `undefined`를 반환해야 합니다.
- `Object ({ writable, readable })`은 `readable` 및 `writable`을 `Stream`으로 변환한 다음, `Duplex`가 `writable`에 쓰고 `readable`에서 읽는 방식으로 결합하여 `Duplex`를 만듭니다.
- `Promise`는 읽기 가능한 `Duplex`로 변환합니다. 값 `null`은 무시됩니다.
- `ReadableStream`은 읽기 가능한 `Duplex`로 변환합니다.
- `WritableStream`은 쓰기 가능한 `Duplex`로 변환합니다.
- 반환: [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

약속을 포함하는 `Iterable` 객체가 인수로 전달되면 처리되지 않은 거부가 발생할 수 있습니다.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // 처리되지 않은 거부
]);
```

### `stream.Duplex.fromWeb(쌍[, 옵션])` {#streamduplexfromwebpair-options}

**추가된 버전: v17.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `쌍` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)
  
 
- `옵션` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
  
 
- 반환: [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)



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

**추가된 버전: v17.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `streamDuplex` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `readable` [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream)
  
 



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


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.7.0, v18.16.0 | `ReadableStream` 및 `WritableStream`에 대한 지원이 추가되었습니다. |
| v15.4.0 | 추가된 버전: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 가능한 취소를 나타내는 시그널
- `stream` [\<Stream\>](/ko/nodejs/api/stream#stream) | [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ko/nodejs/api/webstreams#class-writablestream) 시그널을 연결할 스트림입니다.

AbortSignal을 읽기 가능하거나 쓰기 가능한 스트림에 연결합니다. 이를 통해 코드는 `AbortController`를 사용하여 스트림 파괴를 제어할 수 있습니다.

전달된 `AbortSignal`에 해당하는 `AbortController`에서 `abort`를 호출하는 것은 스트림에서 `.destroy(new AbortError())`를 호출하는 것과 동일하게 동작하며, 웹 스트림의 경우 `controller.error(new AbortError())`와 동일하게 동작합니다.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// 나중에 스트림을 닫는 작업을 중단합니다.
controller.abort();
```
또는 async iterable로 읽기 가능한 스트림과 함께 `AbortSignal`을 사용합니다.

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // 시간 제한 설정
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
      // 작업이 취소되었습니다.
    } else {
      throw e;
    }
  }
})();
```
또는 ReadableStream과 함께 `AbortSignal`을 사용합니다.

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
      // 작업이 취소되었습니다.
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

**Added in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

스트림에서 사용하는 기본 `highWaterMark`를 반환합니다. 기본값은 `65536` (64KiB)이거나 `objectMode`의 경우 `16`입니다.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Added in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `highWaterMark` 값

스트림에서 사용하는 기본 `highWaterMark`를 설정합니다.

## 스트림 구현자를 위한 API {#api-for-stream-implementers}

`node:stream` 모듈 API는 JavaScript의 프로토타입 상속 모델을 사용하여 스트림을 쉽게 구현할 수 있도록 설계되었습니다.

먼저 스트림 개발자는 네 가지 기본 스트림 클래스(`stream.Writable`, `stream.Readable`, `stream.Duplex` 또는 `stream.Transform`) 중 하나를 확장하는 새로운 JavaScript 클래스를 선언하고 적절한 부모 클래스 생성자를 호출해야 합니다.

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
스트림을 확장할 때 사용자가 기본 생성자로 전달하기 전에 어떤 옵션을 제공할 수 있고 제공해야 하는지 염두에 두세요. 예를 들어 구현에서 `autoDestroy` 및 `emitClose` 옵션에 대한 가정을 하는 경우 사용자가 이를 재정의하도록 허용하지 마세요. 모든 옵션을 암시적으로 전달하는 대신 전달되는 옵션에 대해 명시적으로 설명하세요.

새 스트림 클래스는 생성되는 스트림 유형에 따라 아래 차트에 자세히 설명된 대로 하나 이상의 특정 메서드를 구현해야 합니다.

| 사용 사례 | 클래스 | 구현할 메서드 |
| --- | --- | --- |
| 읽기 전용 | [`Readable`](/ko/nodejs/api/stream#class-streamreadable) | [`_read()`](/ko/nodejs/api/stream#readable_readsize) |
| 쓰기 전용 | [`Writable`](/ko/nodejs/api/stream#class-streamwritable) | [`_write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/ko/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/ko/nodejs/api/stream#writable_finalcallback) |
| 읽기 및 쓰기 | [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) | [`_read()`](/ko/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/ko/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/ko/nodejs/api/stream#writable_finalcallback) |
| 쓰여진 데이터에 대해 작동한 다음 결과를 읽기 | [`Transform`](/ko/nodejs/api/stream#class-streamtransform) | [`_transform()`](/ko/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/ko/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/ko/nodejs/api/stream#writable_finalcallback) |
스트림 구현 코드는 소비자가 사용하도록 의도된 스트림의 "공용" 메서드를 *절대* 호출해서는 안 됩니다([스트림 소비자용 API](/ko/nodejs/api/stream#api-for-stream-consumers) 섹션에 설명됨). 그렇게 하면 스트림을 소비하는 애플리케이션 코드에서 부작용이 발생할 수 있습니다.

`write()`, `end()`, `cork()`, `uncork()`, `read()` 및 `destroy()`와 같은 공용 메서드를 재정의하거나 `.emit()`을 통해 `'error'`, `'data'`, `'end'`, `'finish'` 및 `'close'`와 같은 내부 이벤트를 발생시키지 마세요. 그렇게 하면 현재 및 미래의 스트림 불변성을 깨뜨려 다른 스트림, 스트림 유틸리티 및 사용자 기대와의 동작 및/또는 호환성 문제가 발생할 수 있습니다.


### 간소화된 생성 {#simplified-construction}

**추가된 버전: v1.2.0**

많은 간단한 경우에 상속에 의존하지 않고 스트림을 생성할 수 있습니다. 이는 `stream.Writable`, `stream.Readable`, `stream.Duplex` 또는 `stream.Transform` 객체의 인스턴스를 직접 생성하고 적절한 메서드를 생성자 옵션으로 전달하여 수행할 수 있습니다.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // 상태 초기화 및 리소스 로드...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // 리소스 해제...
  },
});
```
### 쓰기 가능한 스트림 구현 {#implementing-a-writable-stream}

`stream.Writable` 클래스는 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림을 구현하기 위해 확장됩니다.

사용자 지정 `Writable` 스트림은 *반드시* `new stream.Writable([options])` 생성자를 호출하고 `writable._write()` 및/또는 `writable._writev()` 메서드를 구현해야 합니다.

#### `new stream.Writable([options])` {#new-streamwritableoptions}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 기본 highWaterMark를 높입니다. |
| v15.5.0 | AbortSignal 전달을 지원합니다. |
| v14.0.0 | `autoDestroy` 옵션의 기본값을 `true`로 변경합니다. |
| v11.2.0, v10.16.0 | `'finish'` 또는 오류를 발생시킬 때 스트림을 자동으로 `destroy()`하는 `autoDestroy` 옵션을 추가합니다. |
| v10.0.0 | destroy 시에 `'close'`가 발생되는지 지정하는 `emitClose` 옵션을 추가합니다. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)가 `false`를 반환하기 시작하는 버퍼 레벨입니다. **기본값:** `65536` (64 KiB) 또는 `objectMode` 스트림의 경우 `16`입니다.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 전달된 `string`을 [`stream._write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback)에 전달하기 전에 ([`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback) 호출에 지정된 인코딩으로) `Buffer`로 인코딩할지 여부입니다. 다른 유형의 데이터는 변환되지 않습니다 (예: `Buffer`는 `string`으로 디코딩되지 않음). false로 설정하면 `string`이 변환되지 않습니다. **기본값:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인코딩이 [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 대한 인수로 지정되지 않은 경우 사용되는 기본 인코딩입니다. **기본값:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`stream.write(anyObj)`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)가 유효한 작업인지 여부입니다. 설정되면 스트림 구현에서 지원하는 경우 문자열, [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 또는 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 이외의 JavaScript 값을 쓸 수 있습니다. **기본값:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림이 삭제된 후 `'close'`를 발생시켜야 하는지 여부입니다. **기본값:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback) 메서드 구현입니다.
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._writev()`](/ko/nodejs/api/stream#writable_writevchunks-callback) 메서드 구현입니다.
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._destroy()`](/ko/nodejs/api/stream#writable_destroyerr-callback) 메서드 구현입니다.
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._final()`](/ko/nodejs/api/stream#writable_finalcallback) 메서드 구현입니다.
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._construct()`](/ko/nodejs/api/stream#writable_constructcallback) 메서드 구현입니다.
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 스트림이 종료된 후 자동으로 `.destroy()`를 호출해야 하는지 여부입니다. **기본값:** `true`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 가능한 취소를 나타내는 신호입니다.
  
 

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // stream.Writable() 생성자를 호출합니다.
    super(options);
    // ...
  }
}
```
또는 ES6 이전 스타일 생성자를 사용하는 경우:

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
또는 간소화된 생성자 방식을 사용하는 경우:

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
전달된 `AbortSignal`에 해당하는 `AbortController`에서 `abort`를 호출하는 것은 쓰기 가능한 스트림에서 `.destroy(new AbortError())`를 호출하는 것과 동일하게 작동합니다.

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
// 나중에 작업을 중단하여 스트림을 닫습니다.
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**다음 버전부터 추가됨: v15.0.0**

- `callback` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 스트림 초기화가 완료되면 이 함수를 호출합니다 (오류 인수를 선택적으로 사용).

`_construct()` 메서드는 직접 호출하면 안 됩니다. 자식 클래스에서 구현할 수 있으며, 구현된 경우 내부 `Writable` 클래스 메서드에서만 호출됩니다.

이 선택적 함수는 스트림 생성자가 반환된 후 틱에서 호출되어 `_write()`, `_final()` 및 `_destroy()` 호출이 `callback`이 호출될 때까지 지연됩니다. 이는 스트림을 사용하기 전에 상태를 초기화하거나 비동기적으로 리소스를 초기화하는 데 유용합니다.

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


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.11.0 | _writev()를 제공하는 경우 _write()는 선택 사항입니다. |
:::

- `chunk` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 쓸 `Buffer`입니다. [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 전달된 `string`에서 변환됩니다. 스트림의 `decodeStrings` 옵션이 `false`이거나 스트림이 객체 모드로 작동하는 경우 청크는 변환되지 않으며 [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 전달된 내용이 됩니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 청크가 문자열인 경우 `encoding`은 해당 문자열의 문자 인코딩입니다. 청크가 `Buffer`이거나 스트림이 객체 모드로 작동하는 경우 `encoding`은 무시될 수 있습니다.
- `callback` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 제공된 청크에 대한 처리가 완료되면 이 함수를 호출합니다 (오류 인수를 선택적으로 사용).

모든 `Writable` 스트림 구현은 기본 리소스로 데이터를 보내기 위해 [`writable._write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback) 및/또는 [`writable._writev()`](/ko/nodejs/api/stream#writable_writevchunks-callback) 메서드를 제공해야 합니다.

[`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림은 [`writable._write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback)의 자체 구현을 제공합니다.

이 함수는 애플리케이션 코드에서 직접 호출하면 안 됩니다. 자식 클래스에서 구현하고 내부 `Writable` 클래스 메서드에서만 호출해야 합니다.

`callback` 함수는 쓰기가 성공적으로 완료되었거나 오류로 실패했음을 알리기 위해 `writable._write()` 내부에서 동기적으로 또는 비동기적으로 (즉, 다른 틱) 호출해야 합니다. `callback`에 전달된 첫 번째 인수는 호출이 실패한 경우 `Error` 객체여야 하고 쓰기가 성공한 경우 `null`이어야 합니다.

`writable._write()`가 호출된 시간과 `callback`이 호출된 시간 사이에 발생하는 모든 `writable.write()` 호출은 쓰여진 데이터를 버퍼링합니다. `callback`이 호출되면 스트림은 [`'drain'`](/ko/nodejs/api/stream#event-drain) 이벤트를 발생시킬 수 있습니다. 스트림 구현이 여러 개의 데이터 청크를 한 번에 처리할 수 있는 경우 `writable._writev()` 메서드를 구현해야 합니다.

`decodeStrings` 속성이 생성자 옵션에서 명시적으로 `false`로 설정된 경우 `chunk`는 `.write()`에 전달된 것과 동일한 객체로 유지되며 `Buffer` 대신 문자열일 수 있습니다. 이는 특정 문자열 데이터 인코딩에 대한 최적화된 처리가 있는 구현을 지원하기 위한 것입니다. 이 경우 `encoding` 인수는 문자열의 문자 인코딩을 나타냅니다. 그렇지 않으면 `encoding` 인수는 안전하게 무시할 수 있습니다.

`writable._write()` 메서드는 정의하는 클래스 내부에서 사용되며 사용자 프로그램에서 직접 호출해서는 안 되기 때문에 밑줄로 시작합니다.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 작성할 데이터입니다. 값은 작성할 개별 데이터 청크를 나타내는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)의 배열입니다. 이러한 객체의 속성은 다음과 같습니다.
    - `chunk` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 작성할 데이터가 포함된 버퍼 인스턴스 또는 문자열입니다. `Writable`이 `decodeStrings` 옵션을 `false`로 설정하여 생성되었고 문자열이 `write()`에 전달된 경우 `chunk`는 문자열이 됩니다.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `chunk`의 문자 인코딩입니다. `chunk`가 `Buffer`인 경우 `encoding`은 `'buffer'`가 됩니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 제공된 청크에 대한 처리가 완료되면 호출될 콜백 함수입니다 (선택적으로 오류 인수를 포함).

이 함수는 애플리케이션 코드에서 직접 호출하면 안 됩니다. 하위 클래스에서 구현해야 하며 내부 `Writable` 클래스 메서드에서만 호출해야 합니다.

여러 데이터 청크를 한 번에 처리할 수 있는 스트림 구현에서 `writable._write()` 대신 또는 추가적으로 `writable._writev()` 메서드를 구현할 수 있습니다. 구현되었고 이전 쓰기에서 버퍼링된 데이터가 있는 경우 `_write()` 대신 `_writev()`가 호출됩니다.

`writable._writev()` 메서드는 정의하는 클래스의 내부 메서드이며 사용자 프로그램에서 직접 호출해서는 안 되기 때문에 밑줄로 시작합니다.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**추가된 버전: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 가능한 오류입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 선택적 오류 인수를 사용하는 콜백 함수입니다.

`_destroy()` 메서드는 [`writable.destroy()`](/ko/nodejs/api/stream#writabledestroyerror)에 의해 호출됩니다. 하위 클래스에서 재정의할 수 있지만 직접 호출해서는 **안 됩니다**.


#### `writable._final(callback)` {#writable_finalcallback}

**다음 버전부터 추가됨: v8.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 남은 데이터를 모두 쓰는 작업을 마치면 이 함수를 호출합니다 (선택적으로 오류 인수를 포함).

`_final()` 메서드는 직접 호출하면 **안 됩니다**. 하위 클래스에서 구현할 수 있으며, 구현된 경우 내부 `Writable` 클래스 메서드에서만 호출됩니다.

이 선택적 함수는 스트림이 닫히기 전에 호출되어 `callback`이 호출될 때까지 `'finish'` 이벤트를 지연시킵니다. 이는 스트림이 끝나기 전에 리소스를 닫거나 버퍼링된 데이터를 쓰는 데 유용합니다.

#### 쓰기 중 오류 {#errors-while-writing}

[`writable._write()`](/ko/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/ko/nodejs/api/stream#writable_writevchunks-callback) 및 [`writable._final()`](/ko/nodejs/api/stream#writable_finalcallback) 메서드 처리 중에 발생하는 오류는 콜백을 호출하고 오류를 첫 번째 인수로 전달하여 전파해야 합니다. 이러한 메서드 내에서 `Error`를 던지거나 수동으로 `'error'` 이벤트를 발생시키면 정의되지 않은 동작이 발생합니다.

`Writable` 스트림이 오류를 발생시킬 때 `Readable` 스트림이 `Writable` 스트림으로 파이프되면 `Readable` 스트림은 언파이프됩니다.

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
#### 쓰기 가능 스트림의 예 {#an-example-writable-stream}

다음은 다소 단순하고 (약간 무의미한) 사용자 정의 `Writable` 스트림 구현을 보여줍니다. 이 특정 `Writable` 스트림 인스턴스는 실제로 특별히 유용하지는 않지만, 이 예는 사용자 정의 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림 인스턴스의 필요한 각 요소를 보여줍니다.

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

#### 쓰기 가능한 스트림에서 버퍼 디코딩하기 {#decoding-buffers-in-a-writable-stream}

버퍼 디코딩은 일반적인 작업입니다. 예를 들어 입력이 문자열인 변환기를 사용할 때 그렇습니다. 이는 UTF-8과 같은 멀티바이트 문자 인코딩을 사용할 때 간단한 과정이 아닙니다. 다음 예제는 `StringDecoder`와 [`Writable`](/ko/nodejs/api/stream#class-streamwritable)을 사용하여 멀티바이트 문자열을 디코딩하는 방법을 보여줍니다.

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
### 읽기 가능한 스트림 구현하기 {#implementing-a-readable-stream}

`stream.Readable` 클래스는 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림을 구현하기 위해 확장됩니다.

사용자 정의 `Readable` 스트림은 *반드시* `new stream.Readable([options])` 생성자를 호출하고 [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드를 구현해야 합니다.

#### `new stream.Readable([options])` {#new-streamreadableoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 기본 highWaterMark를 높입니다. |
| v15.5.0 | AbortSignal 전달을 지원합니다. |
| v14.0.0 | `autoDestroy` 옵션 기본값을 `true`로 변경합니다. |
| v11.2.0, v10.16.0 | `'end'`를 발생시키거나 오류가 발생할 때 스트림을 자동으로 `destroy()`하는 `autoDestroy` 옵션을 추가합니다. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 기본 리소스에서 읽기를 중단하기 전에 내부 버퍼에 저장할 최대 [바이트 수](/ko/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding)입니다. **기본값:** `65536` (64 KiB) 또는 `objectMode` 스트림의 경우 `16`입니다.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지정된 경우 버퍼는 지정된 인코딩을 사용하여 문자열로 디코딩됩니다. **기본값:** `null`입니다.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 스트림이 객체 스트림으로 동작해야 하는지 여부입니다. 즉, [`stream.read(n)`](/ko/nodejs/api/stream#readablereadsize)은 크기 `n`의 `Buffer` 대신 단일 값을 반환합니다. **기본값:** `false`입니다.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림이 파괴된 후 `'close'`를 발생시켜야 하는지 여부입니다. **기본값:** `true`입니다.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드의 구현입니다.
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._destroy()`](/ko/nodejs/api/stream#readable_destroyerr-callback) 메서드의 구현입니다.
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._construct()`](/ko/nodejs/api/stream#readable_constructcallback) 메서드의 구현입니다.
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 스트림이 종료 후 자동으로 `.destroy()`를 호출해야 하는지 여부입니다. **기본값:** `true`입니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 가능한 취소를 나타내는 신호입니다.

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // stream.Readable(options) 생성자를 호출합니다.
    super(options);
    // ...
  }
}
```
또는 ES6 이전 스타일 생성자를 사용하는 경우:

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
또는 단순화된 생성자 접근 방식을 사용하는 경우:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
전달된 `AbortSignal`에 해당하는 `AbortController`에서 `abort`를 호출하면 생성된 읽기 가능에서 `.destroy(new AbortError())`를 호출하는 것과 동일하게 동작합니다.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// 나중에 스트림을 닫는 작업을 중단합니다.
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**다음 버전부터 추가됨: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 스트림 초기화가 완료되면 이 함수를 호출합니다 (선택적으로 오류 인수를 포함할 수 있습니다).

`_construct()` 메서드는 직접 호출하면 안 됩니다. 자식 클래스에서 구현할 수 있으며, 구현된 경우 내부 `Readable` 클래스 메서드에서만 호출됩니다.

이 선택적 함수는 스트림 생성자에 의해 다음 틱에 예약되어 `callback`이 호출될 때까지 `_read()` 및 `_destroy()` 호출을 지연시킵니다. 이는 스트림을 사용하기 전에 상태를 초기화하거나 비동기적으로 리소스를 초기화하는 데 유용합니다.

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

**다음 버전부터 추가됨: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비동기적으로 읽을 바이트 수

이 함수는 애플리케이션 코드에서 직접 호출하면 안 됩니다. 자식 클래스에서 구현해야 하며, 내부 `Readable` 클래스 메서드에서만 호출됩니다.

모든 `Readable` 스트림 구현은 기본 리소스에서 데이터를 가져오기 위해 [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드를 구현해야 합니다.

[`readable._read()`](/ko/nodejs/api/stream#readable_readsize)가 호출될 때 리소스에서 데이터를 사용할 수 있는 경우 구현은 [`this.push(dataChunk)`](/ko/nodejs/api/stream#readablepushchunk-encoding) 메서드를 사용하여 해당 데이터를 읽기 큐에 푸시하기 시작해야 합니다. 스트림이 더 많은 데이터를 수락할 준비가 되면 [`this.push(dataChunk)`](/ko/nodejs/api/stream#readablepushchunk-encoding)를 호출할 때마다 `_read()`가 다시 호출됩니다. `readable.push()`가 `false`를 반환할 때까지 `_read()`는 리소스에서 계속 읽고 데이터를 푸시할 수 있습니다. 중지된 후 `_read()`가 다시 호출될 때만 큐에 추가 데이터를 푸시하기 시작해야 합니다.

[`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드가 호출되면 [`readable.push()`](/ko/nodejs/api/stream#readablepushchunk-encoding) 메서드를 통해 더 많은 데이터가 푸시될 때까지 다시 호출되지 않습니다. 빈 버퍼 및 문자열과 같은 빈 데이터는 [`readable._read()`](/ko/nodejs/api/stream#readable_readsize)가 호출되도록 하지 않습니다.

`size` 인수는 참고용입니다. "읽기"가 데이터를 반환하는 단일 작업인 구현의 경우 `size` 인수를 사용하여 가져올 데이터의 양을 결정할 수 있습니다. 다른 구현에서는 이 인수를 무시하고 사용 가능할 때마다 데이터를 제공할 수 있습니다. [`stream.push(chunk)`](/ko/nodejs/api/stream#readablepushchunk-encoding)를 호출하기 전에 `size` 바이트를 사용할 수 있을 때까지 "기다릴" 필요가 없습니다.

[`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드는 해당 메서드를 정의하는 클래스 내부에서 사용되며 사용자 프로그램에서 직접 호출해서는 안 되므로 밑줄이 접두사로 붙습니다.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**추가된 버전: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 발생 가능한 오류입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 선택적 오류 인수를 취하는 콜백 함수입니다.

`_destroy()` 메서드는 [`readable.destroy()`](/ko/nodejs/api/stream#readabledestroyerror)에 의해 호출됩니다. 자식 클래스에서 재정의할 수 있지만 직접 호출해서는 **안 됩니다**.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 이제 `chunk` 인수는 `TypedArray` 또는 `DataView` 인스턴스일 수 있습니다. |
| v8.0.0 | 이제 `chunk` 인수는 `Uint8Array` 인스턴스일 수 있습니다. |
:::

- `chunk` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 읽기 큐에 푸시할 데이터 청크입니다. 객체 모드에서 작동하지 않는 스트림의 경우 `chunk`는 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 또는 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)여야 합니다. 객체 모드 스트림의 경우 `chunk`는 모든 JavaScript 값일 수 있습니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 청크의 인코딩입니다. `'utf8'` 또는 `'ascii'`와 같은 유효한 `Buffer` 인코딩이어야 합니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 추가 데이터 청크를 계속 푸시할 수 있으면 `true`이고, 그렇지 않으면 `false`입니다.

`chunk`가 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 또는 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)인 경우 데이터 `chunk`는 스트림 사용자가 소비할 수 있도록 내부 큐에 추가됩니다. `chunk`를 `null`로 전달하면 스트림의 끝(EOF)을 알리고 그 후에는 더 이상 데이터를 쓸 수 없습니다.

`Readable`이 일시 중지 모드로 작동하는 경우 [`'readable'`](/ko/nodejs/api/stream#event-readable) 이벤트가 발생할 때 [`readable.read()`](/ko/nodejs/api/stream#readablereadsize) 메서드를 호출하여 `readable.push()`로 추가된 데이터를 읽을 수 있습니다.

`Readable`이 흐름 모드로 작동하는 경우 `readable.push()`로 추가된 데이터는 `'data'` 이벤트를 발생시켜 전달됩니다.

`readable.push()` 메서드는 최대한 유연하게 설계되었습니다. 예를 들어, 일부 형태의 일시 중지/재개 메커니즘과 데이터 콜백을 제공하는 하위 수준 소스를 래핑할 때 사용자 정의 `Readable` 인스턴스로 하위 수준 소스를 래핑할 수 있습니다.

```js [ESM]
// `_source`는 readStop() 및 readStart() 메서드와
// 데이터가 있을 때 호출되는 `ondata` 멤버와
// 데이터가 끝났을 때 호출되는 `onend` 멤버가 있는 객체입니다.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // 데이터가 있을 때마다 내부 버퍼에 푸시합니다.
    this._source.ondata = (chunk) => {
      // push()가 false를 반환하면 소스에서 읽기를 중지합니다.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // 소스가 끝나면 EOF 신호인 `null` 청크를 푸시합니다.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // 스트림이 더 많은 데이터를 가져오려고 할 때 _read()가 호출됩니다.
  // 이 경우 권고 크기 인수는 무시됩니다.
  _read(size) {
    this._source.readStart();
  }
}
```

`readable.push()` 메서드는 콘텐츠를 내부 버퍼에 푸시하는 데 사용됩니다. [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드에 의해 구동될 수 있습니다.

객체 모드에서 작동하지 않는 스트림의 경우 `readable.push()`의 `chunk` 매개변수가 `undefined`이면 빈 문자열 또는 버퍼로 처리됩니다. 자세한 내용은 [`readable.push('')`](/ko/nodejs/api/stream#readablepush)를 참조하세요.


#### 읽기 중 오류 {#errors-while-reading}

[`readable._read()`](/ko/nodejs/api/stream#readable_readsize)를 처리하는 동안 발생하는 오류는 [`readable.destroy(err)`](/ko/nodejs/api/stream#readable_destroyerr-callback) 메서드를 통해 전파되어야 합니다. [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 내에서 `Error`를 발생시키거나 수동으로 `'error'` 이벤트를 발생시키면 정의되지 않은 동작이 발생합니다.

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
#### 카운팅 스트림 예제 {#an-example-counting-stream}

다음은 숫자를 1부터 1,000,000까지 오름차순으로 내보낸 다음 종료하는 `Readable` 스트림의 기본 예제입니다.

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
### 이중 스트림 구현 {#implementing-a-duplex-stream}

[`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림은 TCP 소켓 연결과 같이 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 및 [`Writable`](/ko/nodejs/api/stream#class-streamwritable)을 모두 구현하는 스트림입니다.

JavaScript는 다중 상속을 지원하지 않으므로 `stream.Duplex` 클래스는 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림을 구현하기 위해 확장됩니다(`stream.Readable` *및* `stream.Writable` 클래스를 확장하는 것과 반대).

`stream.Duplex` 클래스는 `stream.Readable`에서 프로토타입 방식으로 상속하고 `stream.Writable`에서 기생적으로 상속하지만, `instanceof`는 `stream.Writable`에서 [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)를 재정의하여 두 기본 클래스 모두에 대해 제대로 작동합니다.

사용자 지정 `Duplex` 스트림은 `new stream.Duplex([options])` 생성자를 호출하고 [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 및 `writable._write()` 메서드 *모두*를 구현해야 합니다.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v8.4.0 | `readableHighWaterMark` 및 `writableHighWaterMark` 옵션이 이제 지원됩니다. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `Writable` 및 `Readable` 생성자 모두에 전달됩니다. 또한 다음 필드가 있습니다.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`로 설정되면 스트림은 읽기 가능한 쪽이 끝나면 쓰기 가능한 쪽을 자동으로 종료합니다. **기본값:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Duplex`가 읽기 가능해야 하는지 설정합니다. **기본값:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Duplex`가 쓰기 가능해야 하는지 설정합니다. **기본값:** `true`.
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림의 읽기 가능한 쪽에 대해 `objectMode`를 설정합니다. `objectMode`가 `true`인 경우 효과가 없습니다. **기본값:** `false`.
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림의 쓰기 가능한 쪽에 대해 `objectMode`를 설정합니다. `objectMode`가 `true`인 경우 효과가 없습니다. **기본값:** `false`.
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림의 읽기 가능한 쪽에 대해 `highWaterMark`를 설정합니다. `highWaterMark`가 제공된 경우 효과가 없습니다.
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림의 쓰기 가능한 쪽에 대해 `highWaterMark`를 설정합니다. `highWaterMark`가 제공된 경우 효과가 없습니다.
  
 

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
또는, pre-ES6 스타일 생성자를 사용하는 경우:

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
또는, 단순화된 생성자 접근 방식을 사용하는 경우:

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
파이프라인을 사용하는 경우:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // 문자열 입력을 버퍼 대신 허용합니다.
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
        // 유효한 json인지 확인합니다.
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

#### 이중 스트림 예제 {#an-example-duplex-stream}

다음은 데이터를 쓸 수 있고 데이터를 읽을 수 있는 가상 하위 수준 소스 객체를 래핑하는 간단한 `Duplex` 스트림의 예입니다. 단, Node.js 스트림과 호환되지 않는 API를 사용합니다. 다음은 [`Writable`](/ko/nodejs/api/stream#class-streamwritable) 인터페이스를 통해 들어오는 쓰기 데이터를 버퍼링하여 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 인터페이스를 통해 다시 읽어오는 간단한 `Duplex` 스트림의 예입니다.

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // 기본 소스는 문자열만 처리합니다.
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
`Duplex` 스트림의 가장 중요한 측면은 `Readable` 및 `Writable` 측면이 단일 객체 인스턴스 내에 함께 존재하지만 서로 독립적으로 작동한다는 것입니다.

#### 객체 모드 이중 스트림 {#object-mode-duplex-streams}

`Duplex` 스트림의 경우 `objectMode`는 각각 `readableObjectMode` 및 `writableObjectMode` 옵션을 사용하여 `Readable` 또는 `Writable` 측면에만 단독으로 설정할 수 있습니다.

예를 들어 다음 예에서는 객체 모드 `Writable` 측면을 갖는 새로운 `Transform` 스트림(일종의 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림)이 생성되어 `Readable` 측면에서 16진수 문자열로 변환되는 JavaScript 숫자를 허용합니다.

```js [ESM]
const { Transform } = require('node:stream');

// 모든 Transform 스트림은 Duplex 스트림이기도 합니다.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // 필요한 경우 청크를 숫자로 강제 변환합니다.
    chunk |= 0;

    // 청크를 다른 것으로 변환합니다.
    const data = chunk.toString(16);

    // 데이터를 읽기 가능 대기열로 푸시합니다.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Prints: 01
myTransform.write(10);
// Prints: 0a
myTransform.write(100);
// Prints: 64
```

### 변환 스트림 구현하기 {#implementing-a-transform-stream}

[`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림은 출력이 입력으로부터 어떤 방식으로든 계산되는 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림입니다. 예로는 데이터를 압축, 암호화 또는 해독하는 [zlib](/ko/nodejs/api/zlib) 스트림 또는 [crypto](/ko/nodejs/api/crypto) 스트림이 있습니다.

출력이 입력과 크기가 같거나, 청크 수가 같거나, 동시에 도착해야 한다는 요구 사항은 없습니다. 예를 들어, `Hash` 스트림은 입력이 종료될 때 제공되는 단일 출력 청크만 갖습니다. `zlib` 스트림은 입력보다 훨씬 작거나 훨씬 큰 출력을 생성합니다.

`stream.Transform` 클래스는 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림을 구현하기 위해 확장됩니다.

`stream.Transform` 클래스는 `stream.Duplex`에서 프로토타입 방식으로 상속되고 `writable._write()` 및 [`readable._read()`](/ko/nodejs/api/stream#readable_readsize) 메서드의 자체 버전을 구현합니다. 사용자 지정 `Transform` 구현은 [`transform._transform()`](/ko/nodejs/api/stream#transform_transformchunk-encoding-callback) 메서드를 *반드시* 구현해야 하며 [`transform._flush()`](/ko/nodejs/api/stream#transform_flushcallback) 메서드를 구현할 수도 있습니다.

`Transform` 스트림을 사용할 때 주의해야 할 점은 스트림에 쓰여진 데이터로 인해 `Readable` 측의 출력이 소비되지 않으면 스트림의 `Writable` 측이 일시 중지될 수 있다는 것입니다.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `Writable` 및 `Readable` 생성자 모두에 전달됩니다. 다음과 같은 필드도 있습니다.
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._transform()`](/ko/nodejs/api/stream#transform_transformchunk-encoding-callback) 메서드의 구현입니다.
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._flush()`](/ko/nodejs/api/stream#transform_flushcallback) 메서드의 구현입니다.
  
 

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
또는 ES6 이전 스타일의 생성자를 사용하는 경우:

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
또는 단순화된 생성자 접근 방식을 사용하는 경우:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### 이벤트: `'end'` {#event-end_1}

[`'end'`](/ko/nodejs/api/stream#event-end) 이벤트는 `stream.Readable` 클래스에서 발생합니다. `'end'` 이벤트는 모든 데이터가 출력된 후, 즉 [`transform._flush()`](/ko/nodejs/api/stream#transform_flushcallback)의 콜백이 호출된 후에 발생합니다. 오류가 발생한 경우 `'end'`는 발생하지 않아야 합니다.

#### 이벤트: `'finish'` {#event-finish_1}

[`'finish'`](/ko/nodejs/api/stream#event-finish) 이벤트는 `stream.Writable` 클래스에서 발생합니다. `'finish'` 이벤트는 [`stream.end()`](/ko/nodejs/api/stream#writableendchunk-encoding-callback)가 호출되고 모든 청크가 [`stream._transform()`](/ko/nodejs/api/stream#transform_transformchunk-encoding-callback)에 의해 처리된 후에 발생합니다. 오류가 발생한 경우 `'finish'`는 발생하지 않아야 합니다.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 남아있는 데이터를 플러시할 때 호출될 콜백 함수 (선택적으로 오류 인수 및 데이터 포함).

이 함수는 응용 프로그램 코드에서 직접 호출해서는 안 됩니다. 하위 클래스에서 구현해야 하며 내부 `Readable` 클래스 메서드에서만 호출해야 합니다.

경우에 따라 변환 작업은 스트림의 끝에 추가 데이터를 내보내야 할 수 있습니다. 예를 들어, `zlib` 압축 스트림은 출력을 최적으로 압축하는 데 사용되는 내부 상태의 양을 저장합니다. 그러나 스트림이 끝나면 압축된 데이터가 완전하도록 해당 추가 데이터를 플러시해야 합니다.

사용자 정의 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 구현은 `transform._flush()` 메서드를 구현 *할 수 있습니다*. 이는 더 이상 소비할 기록 데이터가 없지만 [`'end'`](/ko/nodejs/api/stream#event-end) 이벤트가 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 스트림의 끝을 알리기 전에 호출됩니다.

`transform._flush()` 구현 내에서 `transform.push()` 메서드를 적절하게 0번 이상 호출할 수 있습니다. 플러시 작업이 완료되면 `callback` 함수를 호출해야 합니다.

`transform._flush()` 메서드는 밑줄로 시작합니다. 이는 이를 정의하는 클래스 내부용이며 사용자 프로그램에서 직접 호출해서는 안 되기 때문입니다.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 변환될 `Buffer`로, [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 전달된 `string`에서 변환됩니다. 스트림의 `decodeStrings` 옵션이 `false`이거나 스트림이 객체 모드로 작동하는 경우, 청크는 변환되지 않으며 [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)에 전달된 것이 무엇이든 됩니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 청크가 문자열인 경우, 이는 인코딩 유형입니다. 청크가 버퍼인 경우, 이는 특수한 값 `'buffer'`입니다. 이 경우에는 무시하십시오.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 제공된 `chunk`가 처리된 후 호출될 콜백 함수입니다 (선택적으로 오류 인수 및 데이터 포함).

이 함수는 애플리케이션 코드에서 직접 호출해서는 안 됩니다. 자식 클래스에 의해 구현되어야 하며, 내부 `Readable` 클래스 메서드에 의해서만 호출되어야 합니다.

모든 `Transform` 스트림 구현은 입력을 받아 출력을 생성하는 `_transform()` 메서드를 제공해야 합니다. `transform._transform()` 구현은 기록되는 바이트를 처리하고, 출력을 계산한 다음, `transform.push()` 메서드를 사용하여 읽기 가능한 부분으로 해당 출력을 전달합니다.

`transform.push()` 메서드는 청크의 결과로 출력될 양에 따라 단일 입력 청크에서 출력을 생성하기 위해 0번 이상 호출될 수 있습니다.

주어진 입력 데이터 청크에서 출력이 생성되지 않을 수도 있습니다.

`callback` 함수는 현재 청크가 완전히 소비된 경우에만 호출해야 합니다. `callback`에 전달되는 첫 번째 인수는 입력을 처리하는 동안 오류가 발생한 경우 `Error` 객체여야 하고, 그렇지 않으면 `null`이어야 합니다. 두 번째 인수가 `callback`에 전달되면 `transform.push()` 메서드에 전달되지만, 첫 번째 인수가 falsy인 경우에만 전달됩니다. 즉, 다음은 동일합니다.

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```

`transform._transform()` 메서드는 정의하는 클래스 내부에서 사용되며 사용자 프로그램에서 직접 호출해서는 안 되므로 밑줄이 접두사로 붙습니다.

`transform._transform()`은 병렬로 호출되지 않습니다. 스트림은 큐 메커니즘을 구현하고 다음 청크를 받으려면 `callback`이 동기식 또는 비동기식으로 호출되어야 합니다.


#### 클래스: `stream.PassThrough` {#class-streampassthrough}

`stream.PassThrough` 클래스는 단순히 입력 바이트를 출력으로 전달하는 [`Transform`](/ko/nodejs/api/stream#class-streamtransform) 스트림의 간단한 구현입니다. 그 목적은 주로 예제 및 테스트를 위한 것이지만, `stream.PassThrough`가 새로운 종류의 스트림을 위한 빌딩 블록으로 유용한 몇 가지 사용 사례가 있습니다.

## 추가 참고 사항 {#additional-notes}

### 비동기 생성기 및 비동기 반복자와의 스트림 호환성 {#streams-compatibility-with-async-generators-and-async-iterators}

JavaScript에서 비동기 생성기 및 반복자에 대한 지원으로 인해 비동기 생성기는 이제 효과적으로 최상위 수준의 언어 수준 스트림 구성 요소입니다.

아래에는 Node.js 스트림을 비동기 생성기 및 비동기 반복기와 함께 사용하는 몇 가지 일반적인 상호 운용 사례가 제공됩니다.

#### 비동기 반복자로 읽을 수 있는 스트림 소비 {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
비동기 반복자는 제거 후 처리되지 않은 오류를 방지하기 위해 스트림에 영구 오류 처리기를 등록합니다.

#### 비동기 생성기로 읽을 수 있는 스트림 생성 {#creating-readable-streams-with-async-generators}

Node.js 읽을 수 있는 스트림은 `Readable.from()` 유틸리티 메서드를 사용하여 비동기 생성기에서 만들 수 있습니다.

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
#### 비동기 반복자에서 쓸 수 있는 스트림으로 파이프 {#piping-to-writable-streams-from-async-iterators}

비동기 반복자에서 쓸 수 있는 스트림에 쓸 때 백프레셔와 오류를 올바르게 처리해야 합니다. [`stream.pipeline()`](/ko/nodejs/api/stream#streampipelinesource-transforms-destination-callback)은 백프레셔 및 백프레셔 관련 오류 처리를 추상화합니다.

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// 콜백 패턴
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise 패턴
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### 이전 Node.js 버전과의 호환성 {#compatibility-with-older-nodejs-versions}

Node.js 0.10 이전에는 `Readable` 스트림 인터페이스가 더 간단했지만, 덜 강력하고 유용성도 떨어졌습니다.

- [`stream.read()`](/ko/nodejs/api/stream#readablereadsize) 메서드 호출을 기다리는 대신, [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트가 즉시 방출되기 시작했습니다. 데이터를 처리하는 방법을 결정하기 위해 어느 정도의 작업을 수행해야 하는 애플리케이션은 데이터를 버퍼에 저장하여 데이터가 손실되지 않도록 해야 했습니다.
- [`stream.pause()`](/ko/nodejs/api/stream#readablepause) 메서드는 보장된 것이 아니라 권고 사항이었습니다. 즉, 스트림이 일시 중지된 상태에서도 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트를 받을 준비가 되어 있어야 했습니다.

Node.js 0.10에서 [`Readable`](/ko/nodejs/api/stream#class-streamreadable) 클래스가 추가되었습니다. 이전 Node.js 프로그램과의 이전 버전과의 호환성을 위해 `Readable` 스트림은 [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트 핸들러가 추가되거나 [`stream.resume()`](/ko/nodejs/api/stream#readableresume) 메서드가 호출될 때 "흐름 모드"로 전환됩니다. 그 결과, 새로운 [`stream.read()`](/ko/nodejs/api/stream#readablereadsize) 메서드와 [`'readable'`](/ko/nodejs/api/stream#event-readable) 이벤트를 사용하지 않더라도 더 이상 [`'data'`](/ko/nodejs/api/stream#event-data) 청크 손실에 대해 걱정할 필요가 없습니다.

대부분의 애플리케이션은 정상적으로 계속 작동하지만, 다음과 같은 조건에서는 예외적인 경우가 발생합니다.

- [`'data'`](/ko/nodejs/api/stream#event-data) 이벤트 리스너가 추가되지 않았습니다.
- [`stream.resume()`](/ko/nodejs/api/stream#readableresume) 메서드가 호출되지 않았습니다.
- 스트림이 쓰기 가능한 대상으로 파이프되지 않았습니다.

예를 들어, 다음 코드를 고려해 보세요.

```js [ESM]
// 경고! 깨졌습니다!
net.createServer((socket) => {

  // 'end' 리스너를 추가했지만 데이터를 사용하지 않습니다.
  socket.on('end', () => {
    // 여기에는 절대 도달하지 않습니다.
    socket.end('메시지를 받았지만 처리되지 않았습니다.\n');
  });

}).listen(1337);
```
Node.js 0.10 이전에는 들어오는 메시지 데이터가 단순히 삭제되었습니다. 그러나 Node.js 0.10 이상에서는 소켓이 영원히 일시 중지된 상태로 유지됩니다.

이러한 상황에서 해결 방법은 [`stream.resume()`](/ko/nodejs/api/stream#readableresume) 메서드를 호출하여 데이터 흐름을 시작하는 것입니다.

```js [ESM]
// 해결 방법.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('메시지를 받았지만 처리되지 않았습니다.\n');
  });

  // 데이터 흐름을 시작하고 삭제합니다.
  socket.resume();
}).listen(1337);
```
흐름 모드로 전환되는 새로운 `Readable` 스트림 외에도, [`readable.wrap()`](/ko/nodejs/api/stream#readablewrapstream) 메서드를 사용하여 0.10 이전 스타일의 스트림을 `Readable` 클래스로 래핑할 수 있습니다.


### `readable.read(0)` {#readableread0}

실제로 데이터를 소비하지 않고도 기본 읽기 가능 스트림 메커니즘의 새로 고침을 트리거해야 하는 경우가 있습니다. 이러한 경우 `readable.read(0)`을 호출할 수 있으며, 이는 항상 `null`을 반환합니다.

내부 읽기 버퍼가 `highWaterMark`보다 낮고 스트림이 현재 읽고 있지 않은 경우 `stream.read(0)`을 호출하면 낮은 수준의 [`stream._read()`](/ko/nodejs/api/stream#readable_readsize) 호출이 트리거됩니다.

대부분의 애플리케이션에서는 거의 필요하지 않지만 Node.js 내, 특히 `Readable` 스트림 클래스 내부에서 수행되는 경우가 있습니다.

### `readable.push('')` {#readablepush}

`readable.push('')`의 사용은 권장되지 않습니다.

개체 모드가 아닌 스트림에 0바이트 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 또는 [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)를 푸시하면 흥미로운 부작용이 있습니다. 이는 [`readable.push()`](/ko/nodejs/api/stream#readablepushchunk-encoding) 호출이므로 호출은 읽기 프로세스를 종료합니다. 그러나 인수가 빈 문자열이므로 읽기 가능한 버퍼에 데이터가 추가되지 않아 사용자가 소비할 데이터가 없습니다.

### `readable.setEncoding()` 호출 후 `highWaterMark` 불일치 {#highwatermark-discrepancy-after-calling-readablesetencoding}

`readable.setEncoding()`을 사용하면 개체 모드가 아닌 경우 `highWaterMark`가 작동하는 방식이 변경됩니다.

일반적으로 현재 버퍼의 크기는 *바이트* 단위로 `highWaterMark`와 비교됩니다. 그러나 `setEncoding()`이 호출된 후 비교 함수는 버퍼의 크기를 *문자* 단위로 측정하기 시작합니다.

이는 `latin1` 또는 `ascii`의 일반적인 경우에는 문제가 되지 않습니다. 그러나 멀티바이트 문자를 포함할 수 있는 문자열로 작업할 때는 이 동작에 유의하는 것이 좋습니다.

