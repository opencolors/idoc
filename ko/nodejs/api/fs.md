---
title: Node.js 파일 시스템 API 문서
description: Node.js 파일 시스템 모듈에 대한 포괄적인 가이드로, 파일 읽기, 쓰기, 열기, 닫기 및 파일 권한과 통계 정보 관리 방법을 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 파일 시스템 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 파일 시스템 모듈에 대한 포괄적인 가이드로, 파일 읽기, 쓰기, 열기, 닫기 및 파일 권한과 통계 정보 관리 방법을 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 파일 시스템 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 파일 시스템 모듈에 대한 포괄적인 가이드로, 파일 읽기, 쓰기, 열기, 닫기 및 파일 권한과 통계 정보 관리 방법을 자세히 설명합니다.
---


# 파일 시스템 {#file-system}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

`node:fs` 모듈은 표준 POSIX 함수를 모델로 한 방식으로 파일 시스템과 상호 작용할 수 있도록 합니다.

Promise 기반 API를 사용하려면:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

콜백 및 동기 API를 사용하려면:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

모든 파일 시스템 작업에는 동기, 콜백 및 Promise 기반 형식이 있으며 CommonJS 구문과 ES6 모듈(ESM)을 모두 사용하여 액세스할 수 있습니다.

## Promise 예제 {#promise-example}

Promise 기반 작업은 비동기 작업이 완료되면 이행되는 Promise를 반환합니다.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## 콜백 예제 {#callback-example}

콜백 형식은 완료 콜백 함수를 마지막 인수로 사용하고 작업을 비동기적으로 호출합니다. 완료 콜백에 전달되는 인수는 메서드에 따라 다르지만 첫 번째 인수는 항상 예외를 위해 예약됩니다. 작업이 성공적으로 완료되면 첫 번째 인수는 `null` 또는 `undefined`입니다.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

최대 성능(실행 시간 및 메모리 할당 모두 측면에서)이 필요한 경우 `node:fs` 모듈 API의 콜백 기반 버전을 Promise API를 사용하는 것보다 선호합니다.


## 동기 예제 {#synchronous-example}

동기 API는 작업이 완료될 때까지 Node.js 이벤트 루프와 추가 JavaScript 실행을 차단합니다. 예외는 즉시 발생하며 `try…catch`를 사용하여 처리하거나 버블링되도록 할 수 있습니다.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
:::

## Promises API {#promises-api}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | `require('fs/promises')`로 노출되었습니다. |
| v11.14.0, v10.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v10.1.0 | API는 `require('fs').promises`를 통해서만 액세스할 수 있습니다. |
| v10.0.0 | v10.0.0에 추가됨 |
:::

`fs/promises` API는 프로미스를 반환하는 비동기 파일 시스템 메서드를 제공합니다.

프로미스 API는 기본 Node.js 스레드 풀을 사용하여 이벤트 루프 스레드 외부에서 파일 시스템 작업을 수행합니다. 이러한 작업은 동기화되거나 스레드로부터 안전하지 않습니다. 동일한 파일에 여러 동시 수정 작업을 수행할 때 주의해야 하며, 그렇지 않으면 데이터 손상이 발생할 수 있습니다.

### 클래스: `FileHandle` {#class-filehandle}

**v10.0.0에 추가됨**

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 객체는 숫자 파일 디스크립터에 대한 객체 래퍼입니다.

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 객체의 인스턴스는 `fsPromises.open()` 메서드에 의해 생성됩니다.

모든 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 객체는 [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)입니다.

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)이 `filehandle.close()` 메서드를 사용하여 닫히지 않으면 파일 디스크립터를 자동으로 닫고 프로세스 경고를 발생시켜 메모리 누수를 방지하려고 시도합니다. 이는 신뢰할 수 없고 파일이 닫히지 않을 수 있으므로 이 동작에 의존하지 마십시오. 대신 항상 명시적으로 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)을 닫으십시오. Node.js는 향후 이 동작을 변경할 수 있습니다.


#### 이벤트: `'close'` {#event-close}

**추가된 버전: v15.4.0**

`'close'` 이벤트는 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)이 닫혀 더 이상 사용할 수 없을 때 발생합니다.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.1.0, v20.10.0 | 이제 `flush` 옵션이 지원됩니다. |
| v15.14.0, v14.18.0 | `data` 인수가 `AsyncIterable`, `Iterable` 및 `Stream`을 지원합니다. |
| v14.0.0 | `data` 매개변수가 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ko/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기본 파일 디스크립터가 닫히기 전에 플러시됩니다. **기본값:** `false`.

- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행됩니다.

[`filehandle.writeFile()`](/ko/nodejs/api/fs#filehandlewritefiledata-options)의 별칭입니다.

파일 핸들에서 작업할 때 모드는 [`fsPromises.open()`](/ko/nodejs/api/fs#fspromisesopenpath-flags-mode)으로 설정된 것에서 변경할 수 없습니다. 따라서 이것은 [`filehandle.writeFile()`](/ko/nodejs/api/fs#filehandlewritefiledata-options)과 동일합니다.


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Added in: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 모드 비트 마스크.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행됩니다.

파일의 권한을 수정합니다. [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2)를 참조하세요.

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Added in: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 새로운 소유자의 사용자 ID.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 새로운 그룹의 그룹 ID.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행됩니다.

파일의 소유권을 변경합니다. [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2)의 래퍼입니다.

#### `filehandle.close()` {#filehandleclose}

**Added in: v10.0.0**

- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행됩니다.

핸들에 대한 보류 중인 작업이 완료될 때까지 기다린 후 파일 핸들을 닫습니다.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Added in: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **기본값:** `undefined`
  
 
- Returns: [\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)

`options`는 전체 파일 대신 파일에서 바이트 범위를 읽기 위한 `start` 및 `end` 값을 포함할 수 있습니다. `start`와 `end` 모두 포함되며 0부터 계산을 시작하고 허용되는 값은 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 범위에 있습니다. `start`가 생략되거나 `undefined`인 경우 `filehandle.createReadStream()`은 현재 파일 위치에서 순차적으로 읽습니다. `encoding`은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)에서 허용하는 모든 값일 수 있습니다.

`FileHandle`이 키보드나 사운드 카드와 같이 차단 읽기만 지원하는 문자 장치를 가리키는 경우, 데이터가 사용 가능할 때까지 읽기 작업이 완료되지 않습니다. 이로 인해 프로세스가 종료되지 않고 스트림이 자연스럽게 닫히지 않을 수 있습니다.

기본적으로 스트림은 파괴된 후 `'close'` 이벤트를 발생시킵니다. 이 동작을 변경하려면 `emitClose` 옵션을 `false`로 설정하세요.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// 일부 문자 장치에서 스트림을 만듭니다.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // 스트림이 닫히지 않을 수 있습니다.
  // 기본 리소스가 파일의 끝을 스스로 나타낸 것처럼 스트림의 끝을 인위적으로 표시하면 스트림을 닫을 수 있습니다.
  // 이는 보류 중인 읽기 작업을 취소하지 않으며 그러한 작업이 있는 경우 프로세스는 완료될 때까지 성공적으로 종료되지 못할 수 있습니다.
  stream.push(null);
  stream.read(0);
}, 100);
```
`autoClose`가 false이면 오류가 발생하더라도 파일 디스크립터가 닫히지 않습니다. 파일 디스크립터 누수가 발생하지 않도록 닫는 것은 애플리케이션의 책임입니다. `autoClose`가 true(기본 동작)로 설정되면 `'error'` 또는 `'end'`에서 파일 디스크립터가 자동으로 닫힙니다.

길이가 100바이트인 파일의 마지막 10바이트를 읽는 예:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0, v20.10.0 | `flush` 옵션이 이제 지원됩니다. |
| v16.11.0 | 추가됨: v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기본 파일 설명자가 닫히기 전에 플러시됩니다. **기본값:** `false`.


- 반환: [\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)

`options`는 파일 시작 이후의 특정 위치에 데이터를 쓸 수 있도록 `start` 옵션을 포함할 수도 있으며, 허용되는 값은 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 범위에 있습니다. 파일을 교체하는 대신 수정하려면 `flags` `open` 옵션을 기본값인 `r` 대신 `r+`로 설정해야 할 수 있습니다. `encoding`은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)에서 허용하는 모든 인코딩 중 하나일 수 있습니다.

`autoClose`가 true(기본 동작)로 설정된 경우 `'error'` 또는 `'finish'`에서 파일 설명자가 자동으로 닫힙니다. `autoClose`가 false이면 오류가 발생하더라도 파일 설명자가 닫히지 않습니다. 이를 닫고 파일 설명자 누수가 없는지 확인하는 것은 애플리케이션의 책임입니다.

기본적으로 스트림은 삭제된 후 `'close'` 이벤트를 발생시킵니다. 이 동작을 변경하려면 `emitClose` 옵션을 `false`로 설정하십시오.


#### `filehandle.datasync()` {#filehandledatasync}

**Added in: v10.0.0**

- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

파일과 관련된 현재 대기 중인 모든 I/O 작업을 운영 체제의 동기화된 I/O 완료 상태로 강제합니다. 자세한 내용은 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) 문서를 참조하세요.

`filehandle.sync`와 달리 이 메서드는 수정된 메타데이터를 플러시하지 않습니다.

#### `filehandle.fd` {#filehandlefd}

**Added in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 객체로 관리되는 숫자 파일 디스크립터입니다.

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0 | `position`으로 bigint 값을 허용합니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 읽은 파일 데이터로 채워질 버퍼입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 버퍼에서 채우기를 시작할 위치입니다. **기본값:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. **기본값:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 파일에서 데이터 읽기를 시작할 위치입니다. `null` 또는 `-1`이면 현재 파일 위치에서 데이터를 읽고 위치를 업데이트합니다. `position`이 음수가 아닌 정수이면 현재 파일 위치는 변경되지 않습니다. **기본값:**: `null`
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 두 가지 속성이 있는 객체로 이행합니다.
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽은 바이트 수
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 전달된 `buffer` 인수에 대한 참조입니다.

파일에서 데이터를 읽어 지정된 버퍼에 저장합니다.

파일이 동시에 수정되지 않은 경우 읽은 바이트 수가 0일 때 파일의 끝에 도달합니다.


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [연혁]
| 버전 | 변경 사항 |
|---|---|
| v21.0.0 | bigint 값을 `position`으로 허용합니다. |
| v13.11.0, v12.17.0 | 추가됨: v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 읽은 파일 데이터로 채워질 버퍼입니다. **기본값:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 채우기를 시작할 버퍼의 위치입니다. **기본값:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. **기본값:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 파일에서 데이터를 읽기 시작할 위치입니다. `null` 또는 `-1`이면 현재 파일 위치에서 데이터를 읽고 위치가 업데이트됩니다. `position`이 음수가 아닌 정수이면 현재 파일 위치는 변경되지 않습니다. **기본값**: `null`


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 다음 두 속성을 가진 객체로 이행됩니다.
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽은 바이트 수
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 전달된 `buffer` 인수에 대한 참조입니다.


파일에서 데이터를 읽고 주어진 버퍼에 저장합니다.

파일이 동시에 수정되지 않으면 읽은 바이트 수가 0일 때 파일 끝에 도달합니다.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0 | `position`으로 bigint 값을 허용합니다. |
| v18.2.0, v16.17.0 | v18.2.0, v16.17.0에 추가됨 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 읽은 파일 데이터로 채워질 버퍼입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 버퍼에서 채우기를 시작할 위치입니다. **기본값:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. **기본값:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 파일에서 데이터를 읽기 시작할 위치입니다. `null` 또는 `-1`인 경우, 데이터는 현재 파일 위치에서 읽히고 위치가 업데이트됩니다. `position`이 음수가 아닌 정수이면 현재 파일 위치는 변경되지 않습니다. **기본값:** `null`
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 다음 두 속성이 있는 객체로 이행합니다.
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽은 바이트 수
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 전달된 `buffer` 인수에 대한 참조입니다.
  
 

파일에서 데이터를 읽어 지정된 버퍼에 저장합니다.

파일이 동시에 수정되지 않은 경우, 읽은 바이트 수가 0일 때 파일의 끝에 도달합니다.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0, v18.17.0 | 'bytes' 스트림을 생성하는 옵션이 추가되었습니다. |
| v17.0.0 | v17.0.0에 추가됨 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 일반 스트림 또는 `'bytes'` 스트림을 열지 여부. **기본값:** `undefined`


- 반환: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

파일 데이터를 읽는 데 사용할 수 있는 `ReadableStream`을 반환합니다.

이 메서드가 두 번 이상 호출되거나 `FileHandle`이 닫히거나 닫히는 후에 호출되면 오류가 발생합니다.

::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

`ReadableStream`은 파일을 끝까지 읽지만 `FileHandle`을 자동으로 닫지는 않습니다. 사용자 코드는 여전히 `fileHandle.close()` 메서드를 호출해야 합니다.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**v10.0.0에 추가됨**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 readFile을 중단할 수 있습니다.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 파일 내용을 성공적으로 읽으면 이행됩니다. 인코딩이 지정되지 않은 경우(`options.encoding` 사용), 데이터는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 반환됩니다. 그렇지 않으면 데이터는 문자열이 됩니다.

파일의 전체 내용을 비동기적으로 읽습니다.

`options`가 문자열이면 `encoding`을 지정합니다.

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)은 읽기를 지원해야 합니다.

파일 핸들에서 하나 이상의 `filehandle.read()` 호출이 이루어진 다음 `filehandle.readFile()` 호출이 이루어지면 현재 위치에서 파일 끝까지 데이터가 읽혀집니다. 항상 파일의 시작 부분부터 읽는 것은 아닙니다.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Added in: v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `64 * 1024`


- 반환값: [\<readline.InterfaceConstructor\>](/ko/nodejs/api/readline#class-interfaceconstructor)

`readline` 인터페이스를 생성하고 파일을 스트리밍하는 편리한 메서드입니다. 옵션은 [`filehandle.createReadStream()`](/ko/nodejs/api/fs#filehandlecreatereadstreamoptions)을 참조하세요.

::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Added in: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 데이터를 읽어올 파일의 시작 부분으로부터의 오프셋입니다. `position`이 `number`가 아니면 현재 위치에서 데이터를 읽어옵니다. **기본값:** `null`
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 두 가지 속성이 포함된 객체를 반환합니다:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽은 바이트 수
    - `buffers` [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `buffers` 입력에 대한 참조를 포함하는 속성

파일에서 읽어와 [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s 배열에 씁니다.


#### `filehandle.stat([options])` {#filehandlestatoptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.5.0 | 숫자 값이 bigint여야 하는지 여부를 지정하기 위해 추가 `options` 객체를 허용합니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부. **기본값:** `false`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 파일에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)로 이행합니다.

#### `filehandle.sync()` {#filehandlesync}

**Added in: v10.0.0**

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

열린 파일 디스크립터의 모든 데이터를 저장 장치로 플러시하도록 요청합니다. 특정 구현은 운영 체제 및 장치에 따라 다릅니다. 자세한 내용은 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) 설명서를 참조하세요.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Added in: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

파일을 자릅니다.

파일이 `len`바이트보다 크면 파일에 처음 `len`바이트만 유지됩니다.

다음 예제에서는 파일의 처음 4바이트만 유지합니다.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
이전에 파일이 `len`바이트보다 짧은 경우 확장되고 확장된 부분은 널 바이트(`'\0'`)로 채워집니다.

`len`이 음수이면 `0`이 사용됩니다.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Added in: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)에서 참조하는 객체의 파일 시스템 타임스탬프를 변경한 다음 성공 시 인수가 없는 프로미스를 이행합니다.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | `buffer` 매개변수는 더 이상 지원되지 않는 입력을 버퍼로 강제 변환하지 않습니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buffer` 내에서 쓰기 시작할 데이터의 시작 위치입니다.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buffer`에서 쓸 바이트 수입니다. **기본값:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `buffer`의 데이터를 써야 하는 파일 시작 부분에서의 오프셋입니다. `position`이 `number`가 아니면 데이터는 현재 위치에 쓰여집니다. 자세한 내용은 POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) 문서를 참조하세요. **기본값:** `null`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`buffer`를 파일에 씁니다.

프로미스는 두 가지 속성을 포함하는 객체로 이행됩니다.

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 쓰여진 `buffer`에 대한 참조입니다.

프로미스가 이행되거나 거부될 때까지 기다리지 않고 동일한 파일에서 `filehandle.write()`를 여러 번 사용하는 것은 안전하지 않습니다. 이 시나리오에서는 [`filehandle.createWriteStream()`](/ko/nodejs/api/fs#filehandlecreatewritestreamoptions)을 사용하세요.

Linux에서 파일이 추가 모드로 열려 있으면 위치 쓰기가 작동하지 않습니다. 커널은 위치 인수를 무시하고 항상 파일 끝에 데이터를 추가합니다.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**추가된 버전: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `null`


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`buffer`를 파일에 씁니다.

위의 `filehandle.write` 함수와 유사하게 이 버전은 선택적 `options` 객체를 사용합니다. `options` 객체가 지정되지 않으면 위의 값으로 기본 설정됩니다.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | `string` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `string`의 데이터를 써야 하는 파일 시작 부분으로부터의 오프셋입니다. `position`이 `number`가 아니면 데이터는 현재 위치에 쓰여집니다. 자세한 내용은 POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) 문서를 참조하십시오. **기본값:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 예상되는 문자열 인코딩입니다. **기본값:** `'utf8'`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`string`을 파일에 씁니다. `string`이 문자열이 아니면 프로미스는 오류와 함께 거부됩니다.

프로미스는 두 가지 속성이 있는 객체로 이행됩니다.

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 쓰여진 `string`에 대한 참조입니다.

프로미스가 이행(또는 거부)될 때까지 기다리지 않고 동일한 파일에서 `filehandle.write()`를 여러 번 사용하는 것은 안전하지 않습니다. 이 시나리오의 경우 [`filehandle.createWriteStream()`](/ko/nodejs/api/fs#filehandlecreatewritestreamoptions)을 사용하십시오.

Linux에서 파일이 추가 모드로 열려 있으면 위치 쓰기가 작동하지 않습니다. 커널은 위치 인수를 무시하고 항상 파일 끝에 데이터를 추가합니다.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.14.0, v14.18.0 | `data` 인수가 `AsyncIterable`, `Iterable` 및 `Stream`을 지원합니다. |
| v14.0.0 | `data` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.0.0 | v10.0.0에 추가됨 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ko/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `data`가 문자열일 때 예상되는 문자 인코딩입니다. **기본값:** `'utf8'`


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

비동기적으로 파일에 데이터를 쓰고 파일이 이미 있는 경우 파일을 대체합니다. `data`는 문자열, 버퍼, [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) 또는 [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 객체일 수 있습니다. 프로미스는 성공 시 인수가 없이 수행됩니다.

`options`가 문자열이면 `encoding`을 지정합니다.

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)은 쓰기를 지원해야 합니다.

프로미스가 수행(또는 거부)될 때까지 기다리지 않고 동일한 파일에서 `filehandle.writeFile()`을 여러 번 사용하는 것은 안전하지 않습니다.

하나 이상의 `filehandle.write()` 호출이 파일 핸들에서 이루어진 다음 `filehandle.writeFile()` 호출이 이루어지면 데이터는 파일의 현재 위치에서 파일 끝까지 기록됩니다. 항상 파일의 시작 부분에서 쓰지는 않습니다.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Added in: v12.9.0**

- `buffers` [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `buffers`의 데이터가 쓰여질 파일 시작 위치로부터의 오프셋입니다. `position`이 `number`가 아니면 데이터는 현재 위치에 쓰여집니다. **기본값:** `null`
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) 배열을 파일에 씁니다.

프로미스는 다음 두 개의 속성을 포함하는 객체로 이행됩니다.

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수
- `buffers` [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `buffers` 입력에 대한 참조입니다.

프로미스가 이행(또는 거부)될 때까지 기다리지 않고 동일한 파일에서 `writev()`를 여러 번 호출하는 것은 안전하지 않습니다.

Linux에서는 파일을 추가 모드로 열면 위치 지정 쓰기가 작동하지 않습니다. 커널은 위치 인수를 무시하고 항상 파일 끝에 데이터를 추가합니다.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Added in: v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

`filehandle.close()`의 별칭입니다.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `fs.constants.F_OK`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`path`로 지정된 파일 또는 디렉터리에 대한 사용자의 권한을 테스트합니다. `mode` 인수는 수행할 접근성 검사를 지정하는 선택적 정수입니다. `mode`는 `fs.constants.F_OK` 값 또는 `fs.constants.R_OK`, `fs.constants.W_OK` 및 `fs.constants.X_OK`의 비트 OR로 구성된 마스크여야 합니다(예: `fs.constants.W_OK | fs.constants.R_OK`). `mode`의 가능한 값은 [파일 접근 상수](/ko/nodejs/api/fs#file-access-constants)를 확인하십시오.

접근성 검사가 성공하면 Promise는 값 없이 이행됩니다. 접근성 검사가 실패하면 Promise는 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 객체와 함께 거부됩니다. 다음 예제는 현재 프로세스에서 `/etc/passwd` 파일을 읽고 쓸 수 있는지 확인합니다.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```

`fsPromises.open()`을 호출하기 전에 파일의 접근성을 확인하기 위해 `fsPromises.access()`를 사용하는 것은 권장되지 않습니다. 그렇게 하면 다른 프로세스가 두 호출 사이에 파일의 상태를 변경할 수 있으므로 경합 상태가 발생합니다. 대신 사용자 코드는 파일을 직접 열고/읽고/쓰고 파일에 접근할 수 없는 경우 발생하는 오류를 처리해야 합니다.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.1.0, v20.10.0 | 이제 `flush` 옵션이 지원됩니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 파일 이름 또는 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **Default:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기본 파일 디스크립터가 닫히기 전에 플러시됩니다. **Default:** `false`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

파일에 데이터를 비동기적으로 추가하고, 파일이 아직 존재하지 않으면 파일을 만듭니다. `data`는 문자열 또는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)일 수 있습니다.

`options`가 문자열이면 `encoding`을 지정합니다.

`mode` 옵션은 새로 생성된 파일에만 영향을 줍니다. 자세한 내용은 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback)을 참조하십시오.

`path`는 추가를 위해 열린 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) ( `fsPromises.open()` 사용)으로 지정할 수 있습니다.


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**추가된 버전: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

파일의 권한을 변경합니다.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**추가된 버전: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

파일의 소유권을 변경합니다.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | `flags` 인수를 `mode`로 변경하고 더 엄격한 유형 유효성 검사를 적용했습니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 소스 파일 이름
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사 작업의 대상 파일 이름
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사 작업의 동작을 지정하는 선택적 수정자입니다. 둘 이상의 값의 비트 OR로 구성된 마스크를 만들 수 있습니다(예: `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`). **기본값:** `0`.
    - `fs.constants.COPYFILE_EXCL`: `dest`가 이미 존재하는 경우 복사 작업이 실패합니다.
    - `fs.constants.COPYFILE_FICLONE`: 복사 작업은 copy-on-write reflink를 생성하려고 시도합니다. 플랫폼이 copy-on-write를 지원하지 않으면 대체 복사 메커니즘이 사용됩니다.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: 복사 작업은 copy-on-write reflink를 생성하려고 시도합니다. 플랫폼이 copy-on-write를 지원하지 않으면 작업이 실패합니다.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

비동기적으로 `src`를 `dest`로 복사합니다. 기본적으로 `dest`가 이미 존재하는 경우 덮어씁니다.

복사 작업의 원자성에 대한 보장은 없습니다. 대상 파일을 쓰기 위해 연 후 오류가 발생하면 대상을 제거하려고 시도합니다.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt가 destination.txt로 복사되었습니다.');
} catch {
  console.error('파일을 복사할 수 없습니다.');
}

// COPYFILE_EXCL을 사용하면 destination.txt가 존재하는 경우 작업이 실패합니다.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt가 destination.txt로 복사되었습니다.');
} catch {
  console.error('파일을 복사할 수 없습니다.');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v22.3.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v20.1.0, v18.17.0 | `fs.copyFile()`의 `mode` 인수로 복사 동작을 지정하기 위한 추가 `mode` 옵션을 허용합니다. |
| v17.6.0, v16.15.0 | 심볼릭 링크에 대한 경로 확인을 수행할지 여부를 지정하기 위한 추가 `verbatimSymlinks` 옵션을 허용합니다. |
| v16.7.0 | v16.7.0에서 추가됨 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 소스 경로입니다.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 대상 경로입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 심볼릭 링크를 역참조합니다. **기본값:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `force`가 `false`이고 대상이 존재할 때 오류를 throw합니다. **기본값:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 복사된 파일/디렉터리를 필터링하는 함수입니다. 항목을 복사하려면 `true`를 반환하고 무시하려면 `false`를 반환합니다. 디렉터리를 무시하면 해당 콘텐츠도 모두 건너뜁니다. `true` 또는 `false`로 확인되는 `Promise`를 반환할 수도 있습니다. **기본값:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 복사할 소스 경로입니다.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 복사할 대상 경로입니다.
    - 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `boolean`으로 강제 변환할 수 있는 값 또는 그러한 값으로 이행되는 `Promise`입니다.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 기존 파일 또는 디렉터리를 덮어씁니다. 이 값을 false로 설정하고 대상이 존재하는 경우 복사 작업은 오류를 무시합니다. 이 동작을 변경하려면 `errorOnExist` 옵션을 사용하십시오. **기본값:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사 작업에 대한 수정자입니다. **기본값:** `0`. [`fsPromises.copyFile()`](/ko/nodejs/api/fs#fspromisescopyfilesrc-dest-mode)의 `mode` 플래그를 참조하십시오.
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `src`의 타임스탬프가 유지됩니다. **기본값:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 디렉터리를 재귀적으로 복사합니다. **기본값:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 심볼릭 링크에 대한 경로 확인을 건너뜁니다. **기본값:** `false`
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`src`에서 `dest`로 하위 디렉터리 및 파일을 포함한 전체 디렉터리 구조를 비동기적으로 복사합니다.

디렉터리를 다른 디렉터리로 복사할 때 glob은 지원되지 않으며 동작은 `cp dir1/ dir2/`와 유사합니다.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v22.2.0 | `withFileTypes`를 옵션으로 지원하도록 추가되었습니다. |
| v22.0.0 | v22.0.0에서 추가됨 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 작업 디렉토리. **기본값:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 파일/디렉토리를 필터링하는 함수. 항목을 제외하려면 `true`를 반환하고, 포함하려면 `false`를 반환합니다. **기본값:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) glob이 경로를 Dirent로 반환해야 하면 `true`, 그렇지 않으면 `false`. **기본값:** `false`.
  
 
- 반환: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) 패턴과 일치하는 파일의 경로를 생성하는 AsyncIterator입니다.



::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**다음 버전부터 지원 중단됨: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

심볼릭 링크의 권한을 변경합니다.

이 메서드는 macOS에서만 구현되었습니다.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.6.0 | 이 API는 더 이상 사용되지 않습니다. |
| v10.0.0 | 추가됨: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

심볼릭 링크의 소유권을 변경합니다.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**추가됨: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

[`fsPromises.utimes()`](/ko/nodejs/api/fs#fspromisesutimespath-atime-mtime)와 동일한 방식으로 파일의 접근 및 수정 시간을 변경합니다. 차이점은 경로가 심볼릭 링크를 참조하는 경우 링크가 역참조되지 않는다는 것입니다. 대신 심볼릭 링크 자체의 타임스탬프가 변경됩니다.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Added in: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`existingPath`에서 `newPath`로 새 링크를 만듭니다. 자세한 내용은 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) 문서를 참조하십시오.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.5.0 | 반환되는 숫자 값이 bigint인지 여부를 지정하기 위해 추가적인 `options` 객체를 허용합니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부입니다. **기본값:** `false`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 주어진 심볼릭 링크 `path`에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체로 이행합니다.

`path`가 심볼릭 링크를 참조하는 경우가 아니면 [`fsPromises.stat()`](/ko/nodejs/api/fs#fspromisesstatpath-options)와 동일합니다. 이 경우 링크가 참조하는 파일이 아니라 링크 자체가 stat됩니다. 자세한 내용은 POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) 문서를 참조하십시오.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows에서는 지원되지 않습니다. **기본값:** `0o777`.
  
 
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `recursive`가 `false`이면 `undefined`로, `recursive`가 `true`이면 생성된 첫 번째 디렉터리 경로로 이행합니다.

디렉터리를 비동기적으로 생성합니다.

선택 사항인 `options` 인수는 `mode`(권한 및 스티키 비트)를 지정하는 정수이거나 `mode` 속성과 상위 디렉터리를 생성해야 하는지 여부를 나타내는 `recursive` 속성이 있는 객체일 수 있습니다. `path`가 존재하는 디렉터리인 경우 `fsPromises.mkdir()`을 호출하면 `recursive`가 false인 경우에만 거부됩니다.

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.6.0, v18.19.0 | 이제 `prefix` 매개변수가 버퍼와 URL을 허용합니다. |
| v16.5.0, v14.18.0 | 이제 `prefix` 매개변수가 빈 문자열을 허용합니다. |
| v10.0.0 | 추가됨: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 새로 생성된 임시 디렉터리의 파일 시스템 경로를 포함하는 문자열로 완료됩니다.

고유한 임시 디렉터리를 만듭니다. 고유한 디렉터리 이름은 제공된 `prefix` 끝에 6개의 임의 문자를 추가하여 생성됩니다. 플랫폼 불일치로 인해 `prefix`에서 후행 `X` 문자는 피하십시오. 일부 플랫폼(특히 BSD)은 6개 이상의 임의 문자를 반환하고 `prefix`의 후행 `X` 문자를 임의 문자로 바꿀 수 있습니다.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
`fsPromises.mkdtemp()` 메서드는 6개의 임의로 선택된 문자를 `prefix` 문자열에 직접 추가합니다. 예를 들어 디렉터리 `/tmp`가 주어지고 `/tmp` *내*에 임시 디렉터리를 만들려는 경우 `prefix`는 후행 플랫폼 특정 경로 구분 기호(`require('node:path').sep`)로 끝나야 합니다.


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.1.0 | 이제 `flags` 인수는 선택 사항이며 기본값은 `'r'`입니다. |
| v10.0.0 | v10.0.0에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하세요. **기본값:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일이 생성된 경우 파일 모드(권한 및 스티키 비트)를 설정합니다. **기본값:** `0o666` (읽기 및 쓰기 가능)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 객체로 완료됩니다.

[\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)을 엽니다.

자세한 내용은 POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) 문서를 참조하세요.

일부 문자(`\< \> : " / \ | ? *`)는 [파일, 경로 및 네임스페이스 이름 지정](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file)에 문서화된 대로 Windows에서 예약되어 있습니다. NTFS에서 파일 이름에 콜론이 포함된 경우 Node.js는 [이 MSDN 페이지](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams)에 설명된 대로 파일 시스템 스트림을 엽니다.

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` 옵션이 추가되었습니다. |
| v13.1.0, v12.16.0 | `bufferSize` 옵션이 도입되었습니다. |
| v12.12.0 | v12.12.0에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 디렉터리에서 읽을 때 내부적으로 버퍼링되는 디렉터리 항목 수입니다. 값이 높을수록 성능이 향상되지만 메모리 사용량이 높아집니다. **기본값:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 확인된 `Dir`는 모든 하위 파일과 디렉터리를 포함하는 [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)이 됩니다. **기본값:** `false`

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)로 완료됩니다.

반복 스캔을 위해 디렉터리를 비동기적으로 엽니다. 자세한 내용은 POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) 문서를 참조하세요.

[\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)를 생성합니다. 여기에는 디렉터리에서 읽고 정리하기 위한 모든 추가 기능이 포함되어 있습니다.

`encoding` 옵션은 디렉터리를 열고 후속 읽기 작업을 수행하는 동안 `path`에 대한 인코딩을 설정합니다.

비동기 반복을 사용하는 예:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```

비동기 반복기를 사용하면 반복기가 종료된 후 [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir) 객체가 자동으로 닫힙니다.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [내역]
| 버전 | 변경사항 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` 옵션이 추가되었습니다. |
| v10.11.0 | 새 옵션 `withFileTypes`가 추가되었습니다. |
| v10.0.0 | 추가됨: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 디렉터리의 내용을 재귀적으로 읽습니다. 재귀 모드에서는 모든 파일, 하위 파일 및 디렉터리를 나열합니다. **기본값:** `false`.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 디렉터리에서 `'.'` 및 `'..'`를 제외한 파일 이름의 배열로 이행합니다.

디렉터리의 내용을 읽습니다.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 파일 이름에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환된 파일 이름은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

`options.withFileTypes`가 `true`로 설정되면 반환된 배열에는 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 포함됩니다.

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.2.0, v14.17.0 | 옵션 인수에 진행 중인 readFile 요청을 중단하는 AbortSignal이 포함될 수 있습니다. |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 파일 이름 또는 `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하세요. **기본값:** `'r'`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 readFile을 중단할 수 있습니다.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 파일 내용으로 이행됩니다.

파일의 전체 내용을 비동기적으로 읽습니다.

인코딩이 지정되지 않은 경우(`options.encoding` 사용), 데이터는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 반환됩니다. 그렇지 않으면 데이터는 문자열이 됩니다.

`options`가 문자열이면 인코딩을 지정합니다.

`path`가 디렉터리인 경우, `fsPromises.readFile()`의 동작은 플랫폼에 따라 다릅니다. macOS, Linux 및 Windows에서는 프로미스가 오류와 함께 거부됩니다. FreeBSD에서는 디렉터리 내용의 표현이 반환됩니다.

실행 중인 코드와 동일한 디렉터리에 있는 `package.json` 파일을 읽는 예:

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

[\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)을 사용하여 진행 중인 `readFile`을 중단할 수 있습니다. 요청이 중단되면 반환된 프로미스는 `AbortError`로 거부됩니다.

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // 프로미스가 해결되기 전에 요청을 중단합니다.
  controller.abort();

  await promise;
} catch (err) {
  // 요청이 중단되면 - err은 AbortError입니다.
  console.error(err);
}
```
진행 중인 요청을 중단해도 개별 운영 체제 요청이 중단되는 것이 아니라 `fs.readFile`이 수행하는 내부 버퍼링이 중단됩니다.

지정된 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)은 읽기를 지원해야 합니다.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `linkString`으로 이행합니다.

`path`가 참조하는 심볼릭 링크의 내용을 읽습니다. 자세한 내용은 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) 문서를 참조하세요. 프로미스는 성공 시 `linkString`으로 이행됩니다.

선택 사항인 `options` 인수는 인코딩을 지정하는 문자열이거나 반환된 링크 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환된 링크 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 해결된 경로로 이행합니다.

`fs.realpath.native()` 함수와 동일한 의미 체계를 사용하여 `path`의 실제 위치를 결정합니다.

UTF8 문자열로 변환할 수 있는 경로만 지원됩니다.

선택 사항인 `options` 인수는 인코딩을 지정하는 문자열이거나 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환된 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

Linux에서 Node.js가 musl libc에 연결된 경우 이 함수가 작동하려면 procfs 파일 시스템이 `/proc`에 마운트되어야 합니다. Glibc에는 이러한 제한이 없습니다.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Added in: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`oldPath`를 `newPath`로 이름을 바꿉니다.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 파일인 `path`에서 `fsPromises.rmdir(path, { recursive: true })`를 사용하는 것은 더 이상 허용되지 않으며 Windows에서는 `ENOENT` 오류가 발생하고 POSIX에서는 `ENOTDIR` 오류가 발생합니다. |
| v16.0.0 | 존재하지 않는 `path`에서 `fsPromises.rmdir(path, { recursive: true })`를 사용하는 것은 더 이상 허용되지 않으며 `ENOENT` 오류가 발생합니다. |
| v16.0.0 | `recursive` 옵션은 더 이상 사용되지 않으며, 사용하면 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v14.14.0 | `recursive` 옵션은 더 이상 사용되지 않습니다. 대신 `fsPromises.rm`을 사용하세요. |
| v13.3.0, v12.16.0 | `maxBusyTries` 옵션이 `maxRetries`로 이름이 바뀌었고, 기본값은 0입니다. `emfileWait` 옵션이 제거되었으며, `EMFILE` 오류는 다른 오류와 동일한 재시도 로직을 사용합니다. `retryDelay` 옵션이 이제 지원됩니다. `ENFILE` 오류가 이제 재시도됩니다. |
| v12.10.0 | 이제 `recursive`, `maxBusyTries` 및 `emfileWait` 옵션이 지원됩니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` 또는 `EPERM` 오류가 발생하면 Node.js는 각 시도마다 `retryDelay` 밀리초 더 길게 선형 백오프 대기를 사용하여 작업을 재시도합니다. 이 옵션은 재시도 횟수를 나타냅니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 재귀 디렉터리 제거를 수행합니다. 재귀 모드에서는 작업 실패 시 재시도됩니다. **기본값:** `false`. **더 이상 사용되지 않습니다.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재시도 간에 대기할 시간(밀리초)입니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `100`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`path`로 식별되는 디렉터리를 제거합니다.

파일(디렉터리가 아님)에서 `fsPromises.rmdir()`을 사용하면 Windows에서는 `ENOENT` 오류가 발생하고 POSIX에서는 `ENOTDIR` 오류가 발생하여 프로미스가 거부됩니다.

`rm -rf` Unix 명령어와 유사한 동작을 얻으려면 옵션 `{ recursive: true, force: true }`를 사용하여 [`fsPromises.rm()`](/ko/nodejs/api/fs#fspromisesrmpath-options)을 사용하십시오.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**추가된 버전: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `path`가 존재하지 않으면 예외가 무시됩니다. **기본값:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` 또는 `EPERM` 오류가 발생하면 Node.js는 각 시도마다 `retryDelay` 밀리초만큼 더 긴 선형 백오프 대기 시간으로 작업을 재시도합니다. 이 옵션은 재시도 횟수를 나타냅니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 재귀적 디렉터리 제거를 수행합니다. 재귀 모드에서는 실패 시 작업이 재시도됩니다. **기본값:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재시도 간 대기 시간(밀리초)입니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `100`.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

파일 및 디렉터리를 제거합니다(표준 POSIX `rm` 유틸리티를 모델로 함).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.5.0 | 반환된 숫자 값이 bigint여야 하는지 여부를 지정하는 추가 `options` 객체를 허용합니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부입니다. **기본값:** `false`.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 주어진 `path`에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체로 이행합니다.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**추가된 버전: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs) 객체의 숫자 값이 `bigint`여야 하는지 여부. **기본값:** `false`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 지정된 `path`에 대한 [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs) 객체로 이행합니다.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | `type` 인수가 `null`이거나 생략된 경우, Node.js는 `target` 유형을 자동으로 감지하고 자동으로 `dir` 또는 `file`을 선택합니다. |
| v10.0.0 | 추가된 버전: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

심볼릭 링크를 만듭니다.

`type` 인수는 Windows 플랫폼에서만 사용되며 `'dir'`, `'file'`, 또는 `'junction'` 중 하나일 수 있습니다. `type` 인수가 `null`인 경우, Node.js는 `target` 유형을 자동으로 감지하고 `'file'` 또는 `'dir'`을 사용합니다. `target`이 존재하지 않으면 `'file'`이 사용됩니다. Windows Junction 포인트는 대상 경로가 절대 경로여야 합니다. `'junction'`을 사용하는 경우, `target` 인수는 자동으로 절대 경로로 정규화됩니다. NTFS 볼륨의 Junction 포인트는 디렉터리만 가리킬 수 있습니다.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**추가된 버전: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`path`에 있는 콘텐츠의 길이를 `len` 바이트로 자릅니다 (줄이거나 늘립니다).

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**추가된 버전: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`path`가 심볼릭 링크를 참조하는 경우, 해당 링크가 참조하는 파일 또는 디렉터리에 영향을 주지 않고 링크가 제거됩니다. `path`가 심볼릭 링크가 아닌 파일 경로를 참조하는 경우 파일이 삭제됩니다. 자세한 내용은 POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) 문서를 참조하세요.

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**추가된 버전: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

`path`로 참조되는 객체의 파일 시스템 타임스탬프를 변경합니다.

`atime` 및 `mtime` 인수는 다음 규칙을 따릅니다.

- 값은 Unix 에포크 시간을 나타내는 숫자, `Date` 또는 `'123456789.0'`과 같은 숫자 문자열일 수 있습니다.
- 값을 숫자로 변환할 수 없거나 `NaN`, `Infinity` 또는 `-Infinity`인 경우 `Error`가 발생합니다.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**추가된 버전: v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 파일을 감시하는 동안 프로세스를 계속 실행할지 여부를 나타냅니다. **기본값:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모든 하위 디렉토리를 감시할지, 아니면 현재 디렉토리만 감시할지를 나타냅니다. 디렉토리가 지정된 경우에 적용되며 지원되는 플랫폼에서만 적용됩니다([주의 사항](/ko/nodejs/api/fs#caveats) 참조). **기본값:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 리스너에 전달되는 파일 이름에 사용할 문자 인코딩을 지정합니다. **기본값:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 감시자가 중지해야 할 시기를 알리는 데 사용되는 [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)입니다.
  
 
- 반환: 다음 속성을 가진 객체의 [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface):
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 변경 유형
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 변경된 파일 이름입니다.
  
 

`filename`에서 변경 사항을 감시하는 비동기 이터레이터를 반환합니다. 여기서 `filename`은 파일 또는 디렉토리입니다.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
대부분의 플랫폼에서 파일 이름이 디렉토리에 나타나거나 사라질 때마다 `'rename'`이 발생합니다.

`fs.watch()`에 대한 모든 [주의 사항](/ko/nodejs/api/fs#caveats)은 `fsPromises.watch()`에도 적용됩니다.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0, v20.10.0 | 이제 `flush` 옵션이 지원됩니다. |
| v15.14.0, v14.18.0 | `data` 인수가 `AsyncIterable`, `Iterable` 및 `Stream`을 지원합니다. |
| v15.2.0, v14.17.0 | 옵션 인수는 진행 중인 writeFile 요청을 중단하기 위한 AbortSignal을 포함할 수 있습니다. |
| v14.0.0 | `data` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.0.0 | v10.0.0에서 추가됨 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 파일 이름 또는 `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ko/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모든 데이터가 파일에 성공적으로 기록되고 `flush`가 `true`이면 `filehandle.sync()`가 데이터를 플러시하는 데 사용됩니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 writeFile을 중단할 수 있습니다.


- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행됩니다.

파일에 데이터를 비동기적으로 쓰고 파일이 이미 있는 경우 파일을 바꿉니다. `data`는 문자열, 버퍼, [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) 또는 [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 객체일 수 있습니다.

`data`가 버퍼인 경우 `encoding` 옵션은 무시됩니다.

`options`가 문자열이면 인코딩을 지정합니다.

`mode` 옵션은 새로 생성된 파일에만 영향을 줍니다. 자세한 내용은 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback)을 참조하십시오.

지정된 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)은 쓰기를 지원해야 합니다.

프로미스가 처리될 때까지 기다리지 않고 동일한 파일에서 `fsPromises.writeFile()`을 여러 번 사용하는 것은 안전하지 않습니다.

`fsPromises.readFile`과 유사하게 `fsPromises.writeFile`은 전달된 버퍼를 쓰기 위해 내부적으로 여러 `write` 호출을 수행하는 편의 메서드입니다. 성능에 민감한 코드는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options) 또는 [`filehandle.createWriteStream()`](/ko/nodejs/api/fs#filehandlecreatewritestreamoptions)을 사용하는 것이 좋습니다.

[\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)을 사용하여 `fsPromises.writeFile()`을 취소할 수 있습니다. 취소는 "최선의 노력"이며 약간의 데이터가 여전히 기록될 가능성이 큽니다.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // 프로미스가 처리되기 전에 요청을 중단합니다.
  controller.abort();

  await promise;
} catch (err) {
  // 요청이 중단되면 err는 AbortError입니다.
  console.error(err);
}
```
진행 중인 요청을 중단해도 개별 운영 체제 요청이 중단되는 것이 아니라 내부 버퍼링 `fs.writeFile`이 수행됩니다.


### `fsPromises.constants` {#fspromisesconstants}

**추가된 버전: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

파일 시스템 작업에 일반적으로 사용되는 상수를 포함하는 객체를 반환합니다. 이 객체는 `fs.constants`와 동일합니다. 자세한 내용은 [FS 상수](/ko/nodejs/api/fs#fs-constants)를 참조하세요.

## 콜백 API {#callback-api}

콜백 API는 이벤트 루프를 차단하지 않고 모든 작업을 비동기적으로 수행한 다음 완료 또는 오류 시 콜백 함수를 호출합니다.

콜백 API는 기본 Node.js 스레드 풀을 사용하여 이벤트 루프 스레드 외부에서 파일 시스템 작업을 수행합니다. 이러한 작업은 동기화되거나 스레드로부터 안전하지 않습니다. 동일한 파일에 대해 여러 동시 수정 작업을 수행할 때는 주의해야 하며, 그렇지 않으면 데이터 손상이 발생할 수 있습니다.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.8.0 | `fs`에 직접 있던 상수 `fs.F_OK`, `fs.R_OK`, `fs.W_OK` 및 `fs.X_OK`가 더 이상 사용되지 않습니다. |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_ARG_TYPE`이 `ERR_INVALID_CALLBACK` 대신 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v6.3.0 | `fs`에 직접 있던 `fs.R_OK` 등과 같은 상수는 소프트 지원 중단으로 `fs.constants`로 이동되었습니다. 따라서 Node.js `\< v6.3.0`의 경우 이러한 상수에 액세스하려면 `fs`를 사용하거나 모든 버전에서 작동하도록 `(fs.constants || fs).R_OK`와 같이 수행합니다. |
| v0.11.15 | 추가된 버전: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`path`로 지정된 파일 또는 디렉터리에 대한 사용자의 권한을 테스트합니다. `mode` 인수는 수행할 접근성 검사를 지정하는 선택적 정수입니다. `mode`는 값 `fs.constants.F_OK`이거나 `fs.constants.R_OK`, `fs.constants.W_OK` 및 `fs.constants.X_OK`의 비트 OR로 구성된 마스크여야 합니다(예: `fs.constants.W_OK | fs.constants.R_OK`). 가능한 `mode` 값은 [파일 액세스 상수](/ko/nodejs/api/fs#file-access-constants)를 확인하세요.

마지막 인수 `callback`은 가능한 오류 인수와 함께 호출되는 콜백 함수입니다. 접근성 검사가 실패하면 오류 인수는 `Error` 객체가 됩니다. 다음 예제에서는 `package.json`이 존재하는지, 읽을 수 있는지 또는 쓸 수 있는지 확인합니다.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// 현재 디렉터리에 파일이 있는지 확인합니다.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? '존재하지 않습니다' : '존재합니다'}`);
});

// 파일을 읽을 수 있는지 확인합니다.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? '읽을 수 없습니다' : '읽을 수 있습니다'}`);
});

// 파일에 쓸 수 있는지 확인합니다.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? '쓸 수 없습니다' : '쓸 수 있습니다'}`);
});

// 파일을 읽고 쓸 수 있는지 확인합니다.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? '읽고 쓸 수 없습니다' : '읽고 쓸 수 있습니다'}`);
});
```
`fs.open()`, `fs.readFile()` 또는 `fs.writeFile()`을 호출하기 전에 파일의 접근성을 확인하기 위해 `fs.access()`를 사용하지 마세요. 그렇게 하면 다른 프로세스가 두 호출 사이에 파일 상태를 변경할 수 있으므로 경쟁 조건이 발생합니다. 대신 사용자 코드는 파일을 직접 열고/읽고/쓰고 파일에 액세스할 수 없는 경우 발생하는 오류를 처리해야 합니다.

**쓰기(권장하지 않음)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile이 이미 존재합니다');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**쓰기(권장)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile이 이미 존재합니다');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**읽기(권장하지 않음)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile이 존재하지 않습니다');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**읽기(권장)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile이 존재하지 않습니다');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
위의 "권장하지 않음" 예제는 접근성을 확인한 다음 파일을 사용합니다. "권장" 예제는 파일을 직접 사용하고 오류가 있는 경우 오류를 처리하므로 더 좋습니다.

일반적으로 파일이 직접 사용되지 않는 경우(예: 접근성이 다른 프로세스의 신호인 경우)에만 파일의 접근성을 확인합니다.

Windows에서는 디렉터리의 액세스 제어 정책(ACL)이 파일 또는 디렉터리에 대한 액세스를 제한할 수 있습니다. 그러나 `fs.access()` 함수는 ACL을 확인하지 않으므로 ACL이 사용자의 읽기 또는 쓰기를 제한하더라도 경로가 액세스 가능하다고 보고할 수 있습니다.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.1.0, v20.10.0 | 이제 `flush` 옵션이 지원됩니다. |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_ARG_TYPE`이 발생합니다 (대신 `ERR_INVALID_CALLBACK`). |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 id DEP0013으로 더 이상 사용되지 않는 경고가 표시됩니다. |
| v7.0.0 | 전달된 `options` 객체는 수정되지 않습니다. |
| v5.0.0 | 이제 `file` 매개변수가 파일 설명자가 될 수 있습니다. |
| v0.6.7 | v0.6.7에서 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 이름 또는 파일 설명자
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하세요. **기본값:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기본 파일 설명자가 닫히기 전에 플러시됩니다. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

파일에 데이터를 비동기적으로 추가하고, 파일이 아직 없는 경우 파일을 만듭니다. `data`는 문자열 또는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)일 수 있습니다.

`mode` 옵션은 새로 생성된 파일에만 영향을 줍니다. 자세한 내용은 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback)을 참조하세요.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
`options`가 문자열인 경우 인코딩을 지정합니다.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
`path`는 추가를 위해 열린 숫자 파일 설명자 ( `fs.open()` 또는 `fs.openSync()` 사용)로 지정될 수 있습니다. 파일 설명자는 자동으로 닫히지 않습니다.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 throw합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 id DEP0013으로 사용 중단 경고가 발생합니다. |
| v0.1.30 | v0.1.30에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

파일의 권한을 비동기적으로 변경합니다. 가능한 예외 외에는 완료 콜백에 인수가 제공되지 않습니다.

자세한 내용은 POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) 문서를 참조하십시오.

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('파일 "my_file.txt"의 권한이 변경되었습니다!');
});
```
#### 파일 모드 {#file-modes}

`fs.chmod()` 및 `fs.chmodSync()` 메서드 모두에서 사용되는 `mode` 인수는 다음 상수의 논리적 OR을 사용하여 생성된 숫자 비트 마스크입니다.

| 상수 | 8진수 | 설명 |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | 소유자 읽기 |
| `fs.constants.S_IWUSR` | `0o200` | 소유자 쓰기 |
| `fs.constants.S_IXUSR` | `0o100` | 소유자 실행/검색 |
| `fs.constants.S_IRGRP` | `0o40` | 그룹 읽기 |
| `fs.constants.S_IWGRP` | `0o20` | 그룹 쓰기 |
| `fs.constants.S_IXGRP` | `0o10` | 그룹 실행/검색 |
| `fs.constants.S_IROTH` | `0o4` | 다른 사람 읽기 |
| `fs.constants.S_IWOTH` | `0o2` | 다른 사람 쓰기 |
| `fs.constants.S_IXOTH` | `0o1` | 다른 사람 실행/검색 |
`mode`를 구성하는 더 쉬운 방법은 세 개의 8진수 숫자 시퀀스(예: `765`)를 사용하는 것입니다. 가장 왼쪽 숫자(`7` 예제에서)는 파일 소유자에 대한 권한을 지정합니다. 가운데 숫자(`6` 예제에서)는 그룹에 대한 권한을 지정합니다. 가장 오른쪽 숫자(`5` 예제에서)는 다른 사람에 대한 권한을 지정합니다.

| 숫자 | 설명 |
| --- | --- |
| `7` | 읽기, 쓰기 및 실행 |
| `6` | 읽기 및 쓰기 |
| `5` | 읽기 및 실행 |
| `4` | 읽기 전용 |
| `3` | 쓰기 및 실행 |
| `2` | 쓰기 전용 |
| `1` | 실행 전용 |
| `0` | 권한 없음 |
예를 들어 8진수 값 `0o765`는 다음을 의미합니다.

- 소유자는 파일을 읽고 쓰고 실행할 수 있습니다.
- 그룹은 파일을 읽고 쓸 수 있습니다.
- 다른 사람은 파일을 읽고 실행할 수 있습니다.

파일 모드가 예상되는 원시 숫자를 사용할 때 `0o777`보다 큰 값은 일관되게 작동하도록 지원되지 않는 플랫폼별 동작을 초래할 수 있습니다. 따라서 `S_ISVTX`, `S_ISGID` 또는 `S_ISUID`와 같은 상수는 `fs.constants`에 노출되지 않습니다.

주의 사항: Windows에서는 쓰기 권한만 변경할 수 있으며 그룹, 소유자 또는 다른 사람의 권한 간의 구별은 구현되지 않습니다.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013의 더 이상 사용되지 않는 경고가 표시됩니다. |
| v0.1.97 | 추가됨: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

비동기적으로 파일의 소유자 및 그룹을 변경합니다. 가능한 예외 외에는 완료 콜백에 제공되는 인수가 없습니다.

자세한 내용은 POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) 문서를 참조하십시오.

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.9.0, v14.17.0 | 콜백이 제공되지 않으면 기본 콜백이 사용됩니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013의 더 이상 사용되지 않는 경고가 표시됩니다. |
| v0.0.2 | 추가됨: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

파일 디스크립터를 닫습니다. 가능한 예외 외에는 완료 콜백에 제공되는 인수가 없습니다.

다른 `fs` 작업을 통해 현재 사용 중인 파일 디스크립터(`fd`)에서 `fs.close()`를 호출하면 정의되지 않은 동작이 발생할 수 있습니다.

자세한 내용은 POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) 문서를 참조하십시오.


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v14.0.0 | `flags` 인수가 `mode`로 변경되었고 더 엄격한 유형 유효성 검사가 적용되었습니다. |
| v8.5.0 | v8.5.0에서 추가됨 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 소스 파일 이름
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사 작업의 대상 파일 이름
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사 작업에 대한 수정자. **기본값:** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

비동기적으로 `src`를 `dest`로 복사합니다. 기본적으로 `dest`가 이미 존재하는 경우 덮어씁니다. 가능한 예외 외에는 콜백 함수에 인수가 주어지지 않습니다. Node.js는 복사 작업의 원자성을 보장하지 않습니다. 대상 파일을 쓰기 위해 연 후에 오류가 발생하면 Node.js는 대상을 제거하려고 시도합니다.

`mode`는 복사 작업의 동작을 지정하는 선택적 정수입니다. 둘 이상의 값의 비트 OR로 구성된 마스크를 만들 수 있습니다(예: `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: `dest`가 이미 존재하면 복사 작업이 실패합니다.
- `fs.constants.COPYFILE_FICLONE`: 복사 작업은 쓰기 시 복사(copy-on-write) reflink를 만들려고 시도합니다. 플랫폼이 쓰기 시 복사를 지원하지 않으면 대체 복사 메커니즘이 사용됩니다.
- `fs.constants.COPYFILE_FICLONE_FORCE`: 복사 작업은 쓰기 시 복사(copy-on-write) reflink를 만들려고 시도합니다. 플랫폼이 쓰기 시 복사를 지원하지 않으면 작업이 실패합니다.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt는 기본적으로 생성되거나 덮어씌워집니다.
copyFile('source.txt', 'destination.txt', callback);

// COPYFILE_EXCL을 사용하면 destination.txt가 존재할 경우 작업이 실패합니다.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v22.3.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v20.1.0, v18.17.0 | `fs.copyFile()`의 `mode` 인수로 복사 동작을 지정하는 추가 `mode` 옵션을 허용합니다. |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v17.6.0, v16.15.0 | 심볼릭 링크에 대한 경로 확인을 수행할지 여부를 지정하는 추가 `verbatimSymlinks` 옵션을 허용합니다. |
| v16.7.0 | v16.7.0에 추가됨 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 소스 경로입니다.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 대상 경로입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 심볼릭 링크를 역참조합니다. **기본값:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `force`가 `false`이고 대상이 존재하면 오류를 발생시킵니다. **기본값:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 복사된 파일/디렉터리를 필터링하는 함수입니다. 항목을 복사하려면 `true`를 반환하고 무시하려면 `false`를 반환합니다. 디렉터리를 무시하면 해당 콘텐츠도 모두 건너뜁니다. `true` 또는 `false`로 확인되는 `Promise`를 반환할 수도 있습니다. **기본값:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 복사할 소스 경로입니다.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 복사할 대상 경로입니다.
    - 반환 값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `boolean`으로 강제 변환할 수 있는 값 또는 해당 값으로 이행하는 `Promise`입니다.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 기존 파일 또는 디렉터리를 덮어씁니다. 이 값을 false로 설정하고 대상이 존재하면 복사 작업은 오류를 무시합니다. 이 동작을 변경하려면 `errorOnExist` 옵션을 사용하세요. **기본값:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사 작업에 대한 수정자입니다. **기본값:** `0`. [`fs.copyFile()`](/ko/nodejs/api/fs#fscopyfilesrc-dest-mode-callback)의 `mode` 플래그를 참조하세요.
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `src`의 타임스탬프가 보존됩니다. **기본값:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 디렉터리를 재귀적으로 복사합니다. **기본값:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 심볼릭 링크에 대한 경로 확인이 건너뜁니다. **기본값:** `false`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

`src`에서 `dest`로 하위 디렉터리 및 파일을 포함한 전체 디렉터리 구조를 비동기적으로 복사합니다.

디렉터리를 다른 디렉터리로 복사할 때 glob은 지원되지 않으며 동작은 `cp dir1/ dir2/`와 유사합니다.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v16.10.0 | `fd`가 제공된 경우 `fs` 옵션에 `open` 메서드가 필요하지 않습니다. |
| v16.10.0 | `autoClose`가 `false`인 경우 `fs` 옵션에 `close` 메서드가 필요하지 않습니다. |
| v15.5.0 | `AbortSignal` 지원이 추가되었습니다. |
| v15.4.0 | `fd` 옵션이 FileHandle 인수를 허용합니다. |
| v14.0.0 | `emitClose` 기본값을 `true`로 변경합니다. |
| v13.6.0, v12.17.0 | `fs` 옵션을 통해 사용된 `fs` 구현을 재정의할 수 있습니다. |
| v12.10.0 | `emitClose` 옵션을 활성화합니다. |
| v11.0.0 | `start` 및 `end`에 새로운 제한을 적용하여 입력 값을 합리적으로 처리할 수 없는 경우 더 적절한 오류를 발생시킵니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | 전달된 `options` 객체는 수정되지 않습니다. |
| v2.3.0 | 전달된 `options` 객체는 이제 문자열일 수 있습니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) **기본값:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`


- 반환: [\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)

`options`에는 전체 파일 대신 파일에서 바이트 범위를 읽기 위한 `start` 및 `end` 값을 포함할 수 있습니다. `start` 및 `end`는 모두 포함되며 0부터 계산을 시작하며 허용되는 값은 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 범위에 있습니다. `fd`가 지정되고 `start`가 생략되거나 `undefined`인 경우 `fs.createReadStream()`은 현재 파일 위치에서 순차적으로 읽습니다. `encoding`은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)에서 허용하는 모든 값일 수 있습니다.

`fd`가 지정되면 `ReadStream`은 `path` 인수를 무시하고 지정된 파일 디스크립터를 사용합니다. 즉, `'open'` 이벤트가 발생하지 않습니다. `fd`는 블로킹이어야 합니다. 비블로킹 `fd`는 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)에 전달되어야 합니다.

`fd`가 키보드 또는 사운드 카드와 같이 블로킹 읽기만 지원하는 문자 장치를 가리키는 경우 데이터가 사용 가능해질 때까지 읽기 작업이 완료되지 않습니다. 이로 인해 프로세스가 종료되지 않고 스트림이 자연스럽게 닫히지 않을 수 있습니다.

기본적으로 스트림은 삭제된 후 `'close'` 이벤트를 발생시킵니다. 이 동작을 변경하려면 `emitClose` 옵션을 `false`로 설정하십시오.

`fs` 옵션을 제공하면 `open`, `read` 및 `close`에 대한 해당 `fs` 구현을 재정의할 수 있습니다. `fs` 옵션을 제공할 때 `read`에 대한 재정의가 필요합니다. `fd`가 제공되지 않으면 `open`에 대한 재정의도 필요합니다. `autoClose`가 `true`이면 `close`에 대한 재정의도 필요합니다.

```js [ESM]
import { createReadStream } from 'node:fs';

// 일부 문자 장치에서 스트림을 만듭니다.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // 스트림이 닫히지 않을 수 있습니다.
  // 기본 리소스가 파일의 끝을 스스로 나타낸 것처럼 스트림의 끝을 인위적으로 표시하면 스트림이 닫힐 수 있습니다.
  // 이는 보류 중인 읽기 작업을 취소하지 않으며 그러한 작업이 있는 경우 프로세스는 완료될 때까지 성공적으로 종료되지 못할 수 있습니다.
  stream.push(null);
  stream.read(0);
}, 100);
```
`autoClose`가 false이면 오류가 발생하더라도 파일 디스크립터가 닫히지 않습니다. 파일 디스크립터를 닫고 파일 디스크립터 누수가 없는지 확인하는 것은 애플리케이션의 책임입니다. `autoClose`가 true(기본 동작)로 설정된 경우 `'error'` 또는 `'end'`에서 파일 디스크립터가 자동으로 닫힙니다.

`mode`는 파일 모드(권한 및 스티키 비트)를 설정하지만 파일이 생성된 경우에만 설정합니다.

길이가 100바이트인 파일의 마지막 10바이트를 읽는 예:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
`options`가 문자열이면 인코딩을 지정합니다.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0, v20.10.0 | 이제 `flush` 옵션이 지원됩니다. |
| v16.10.0 | `fd`가 제공된 경우 `fs` 옵션에 `open` 메서드가 필요하지 않습니다. |
| v16.10.0 | `autoClose`가 `false`인 경우 `fs` 옵션에 `close` 메서드가 필요하지 않습니다. |
| v15.5.0 | `AbortSignal`에 대한 지원을 추가합니다. |
| v15.4.0 | `fd` 옵션이 FileHandle 인수를 허용합니다. |
| v14.0.0 | `emitClose` 기본값을 `true`로 변경합니다. |
| v13.6.0, v12.17.0 | `fs` 옵션을 통해 사용된 `fs` 구현을 재정의할 수 있습니다. |
| v12.10.0 | `emitClose` 옵션을 활성화합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v7.0.0 | 전달된 `options` 객체는 수정되지 않습니다. |
| v5.5.0 | 이제 `autoClose` 옵션이 지원됩니다. |
| v2.3.0 | 이제 전달된 `options` 객체가 문자열일 수 있습니다. |
| v0.1.31 | v0.1.31에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) **기본값:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기본 파일 설명자가 닫히기 전에 플러시됩니다. **기본값:** `false`.
 
- 반환: [\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)

`options`에는 파일 시작 위치 이후의 특정 위치에 데이터를 쓸 수 있도록 `start` 옵션이 포함될 수도 있습니다. 허용되는 값은 [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 범위에 있습니다. 파일을 바꾸는 대신 수정하려면 `flags` 옵션을 기본값 `w` 대신 `r+`로 설정해야 할 수 있습니다. `encoding`은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)에서 허용하는 모든 값일 수 있습니다.

`autoClose`가 true(기본 동작)로 설정된 경우 `'error'` 또는 `'finish'` 시에 파일 설명자가 자동으로 닫힙니다. `autoClose`가 false이면 오류가 발생하더라도 파일 설명자가 닫히지 않습니다. 파일 설명자를 닫고 누수가 없는지 확인하는 것은 애플리케이션의 책임입니다.

기본적으로 스트림은 소멸된 후 `'close'` 이벤트를 발생시킵니다. 이 동작을 변경하려면 `emitClose` 옵션을 `false`로 설정하십시오.

`fs` 옵션을 제공하면 `open`, `write`, `writev` 및 `close`에 해당하는 `fs` 구현을 재정의할 수 있습니다. `writev()` 없이 `write()`를 재정의하면 일부 최적화(`_writev()`)가 비활성화되므로 성능이 저하될 수 있습니다. `fs` 옵션을 제공하는 경우 `write` 및 `writev` 중 적어도 하나에 대한 재정의가 필요합니다. `fd` 옵션이 제공되지 않으면 `open`에 대한 재정의도 필요합니다. `autoClose`가 `true`이면 `close`에 대한 재정의도 필요합니다.

[\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)과 마찬가지로 `fd`가 지정되면 [\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)은 `path` 인수를 무시하고 지정된 파일 설명자를 사용합니다. 즉, `'open'` 이벤트가 발생하지 않습니다. `fd`는 차단되어야 합니다. 비차단 `fd`는 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)에 전달되어야 합니다.

`options`가 문자열인 경우 인코딩을 지정합니다.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 throw합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v1.0.0 | 더 이상 사용되지 않음: v1.0.0부터 |
| v0.0.2 | v0.0.2에서 추가됨 |
:::

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`fs.stat()`](/ko/nodejs/api/fs#fsstatpath-options-callback) 또는 [`fs.access()`](/ko/nodejs/api/fs#fsaccesspath-mode-callback)를 사용하십시오.
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

파일 시스템을 확인하여 지정된 `path`에 요소가 있는지 여부를 테스트합니다. 그런 다음 `callback` 인수를 true 또는 false로 호출합니다.

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**이 콜백에 대한 매개변수는 다른 Node.js 콜백과 일치하지 않습니다.** 일반적으로 Node.js 콜백에 대한 첫 번째 매개변수는 `err` 매개변수이며, 선택적으로 다른 매개변수가 뒤따릅니다. `fs.exists()` 콜백에는 부울 매개변수가 하나만 있습니다. 이것이 `fs.exists()` 대신 `fs.access()`가 권장되는 이유 중 하나입니다.

`path`가 심볼릭 링크인 경우 따라갑니다. 따라서 `path`가 존재하지만 존재하지 않는 요소를 가리키는 경우 콜백은 값 `false`를 받습니다.

`fs.open()`, `fs.readFile()` 또는 `fs.writeFile()`을 호출하기 전에 `fs.exists()`를 사용하여 파일의 존재 여부를 확인하는 것은 권장되지 않습니다. 이렇게 하면 다른 프로세스가 두 호출 사이에 파일의 상태를 변경할 수 있으므로 경쟁 조건이 발생합니다. 대신 사용자 코드는 파일을 직접 열고/읽고/쓰고 파일이 존재하지 않으면 발생하는 오류를 처리해야 합니다.

**쓰기(권장하지 않음)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**쓰기(권장)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**읽기(권장하지 않음)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```
**읽기(권장)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
위의 "권장하지 않음" 예제는 존재 여부를 확인한 다음 파일을 사용합니다. "권장" 예제는 파일을 직접 사용하고 오류가 있으면 처리하므로 더 좋습니다.

일반적으로 파일의 존재가 다른 프로세스의 신호인 경우와 같이 파일을 직접 사용하지 않는 경우에만 파일의 존재 여부를 확인하십시오.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.4.7 | 추가됨: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

파일의 권한을 설정합니다. 가능한 예외를 제외하고는 완료 콜백에 인수가 제공되지 않습니다.

자세한 내용은 POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) 문서를 참조하십시오.

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.4.7 | 추가됨: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

파일의 소유자를 설정합니다. 가능한 예외를 제외하고는 완료 콜백에 인수가 제공되지 않습니다.

자세한 내용은 POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) 문서를 참조하십시오.


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.1.96 | v0.1.96에 추가됨 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

파일과 관련된 현재 큐에 대기 중인 모든 I/O 작업을 운영 체제의 동기화된 I/O 완료 상태로 강제합니다. 자세한 내용은 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) 설명서를 참조하십시오. 가능한 예외 외에 완료 콜백에 제공되는 인수는 없습니다.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.5.0 | 반환된 숫자 값이 bigint인지 여부를 지정하기 위해 추가 `options` 객체를 허용합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.1.95 | v0.1.95에 추가됨 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`인지 여부. **기본값:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)

파일 디스크립터에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)를 사용하여 콜백을 호출합니다.

자세한 내용은 POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) 설명서를 참조하십시오.


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.1.96 | v0.1.96에 추가됨 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

개방된 파일 디스크립터의 모든 데이터를 저장 장치로 플러시하도록 요청합니다. 특정 구현은 운영 체제 및 장치에 따라 다릅니다. 자세한 내용은 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) 설명서를 참조하십시오. 가능한 예외 외에 다른 인수는 완료 콜백에 제공되지 않습니다.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.8.6 | v0.8.6에 추가됨 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

파일 디스크립터를 자릅니다. 가능한 예외 외에 다른 인수는 완료 콜백에 제공되지 않습니다.

자세한 내용은 POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) 설명서를 참조하십시오.

파일 디스크립터가 참조하는 파일이 `len`바이트보다 크면 파일에서 처음 `len`바이트만 유지됩니다.

예를 들어 다음 프로그램은 파일의 처음 4바이트만 유지합니다.

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
이전에 파일이 `len`바이트보다 짧았던 경우 확장되고 확장된 부분은 널 바이트(`'\0'`)로 채워집니다.

`len`이 음수이면 `0`이 사용됩니다.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 사용 중단 경고가 표시됩니다. |
| v4.1.0 | 숫자 문자열, `NaN` 및 `Infinity`가 이제 허용되는 시간 지정자입니다. |
| v0.4.2 | v0.4.2에 추가됨 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

제공된 파일 디스크립터로 참조되는 객체의 파일 시스템 타임스탬프를 변경합니다. [`fs.utimes()`](/ko/nodejs/api/fs#fsutimespath-atime-mtime-callback)를 참조하세요.

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v22.2.0 | `withFileTypes`에 대한 지원을 옵션으로 추가합니다. |
| v22.0.0 | v22.0.0에 추가됨 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

-  `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 작업 디렉토리. **기본값:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 파일/디렉토리를 필터링하는 함수입니다. 항목을 제외하려면 `true`를 반환하고, 포함하려면 `false`를 반환합니다. **기본값:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) glob이 경로를 Dirent로 반환해야 하는 경우 `true`, 그렇지 않으면 `false`입니다. **기본값:** `false`.
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 
- 지정된 패턴과 일치하는 파일을 검색합니다.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v16.0.0 | 둘 이상의 오류가 반환되면 반환되는 오류는 `AggregateError`일 수 있습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.4.7 | 버전: v0.4.7 이후로 더 이상 사용되지 않습니다. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

심볼릭 링크의 권한을 변경합니다. 가능한 예외를 제외한 다른 인수는 완료 콜백에 제공되지 않습니다.

이 메서드는 macOS에서만 구현됩니다.

자세한 내용은 POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) 문서를 참조하십시오.

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.6.0 | 이 API는 더 이상 사용되지 않습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.4.7 | 문서 전용 더 이상 사용되지 않음. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

심볼릭 링크의 소유자를 설정합니다. 가능한 예외를 제외한 다른 인수는 완료 콜백에 제공되지 않습니다.

자세한 내용은 POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) 문서를 참조하십시오.


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v14.5.0, v12.19.0 | 추가됨: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`fs.utimes()`](/ko/nodejs/api/fs#fsutimespath-atime-mtime-callback)와 같은 방식으로 파일의 액세스 및 수정 시간을 변경합니다. 차이점은 경로가 심볼릭 링크를 참조하는 경우 링크가 역참조되지 않고 심볼릭 링크 자체의 타임스탬프가 변경된다는 점입니다.

가능한 예외를 제외하고는 완료 콜백에 제공되는 인수가 없습니다.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.6.0 | `existingPath` 및 `newPath` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. 현재 지원은 여전히 *실험적*입니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 사용 중단 경고가 발생합니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`existingPath`에서 `newPath`로 새 링크를 만듭니다. 자세한 내용은 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) 문서를 참조하십시오. 가능한 예외를 제외하고는 완료 콜백에 제공되는 인수가 없습니다.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.5.0 | 반환된 숫자 값이 bigint인지 여부를 지정하기 위해 추가 `options` 객체를 허용합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 id DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.1.30 | v0.1.30에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부입니다. **기본값:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)



경로가 참조하는 심볼릭 링크에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)를 검색합니다. 콜백은 두 개의 인수 `(err, stats)`를 가져오며 여기서 `stats`는 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체입니다. `lstat()`는 `stat()`과 동일하지만 `path`가 심볼릭 링크인 경우 참조하는 파일이 아닌 링크 자체가 stat-ed됩니다.

자세한 내용은 POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) 문서를 참조하십시오.


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v13.11.0, v12.17.0 | `recursive` 모드에서 콜백은 이제 처음 생성된 경로를 인수로 받습니다. |
| v10.12.0 | 두 번째 인수는 이제 `recursive` 및 `mode` 속성이 있는 `options` 객체일 수 있습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 id DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.1.8 | v0.1.8에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows에서는 지원되지 않습니다. **기본값:** `0o777`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `recursive`가 `true`로 설정된 상태에서 디렉토리가 생성된 경우에만 존재합니다.



디렉토리를 비동기적으로 만듭니다.

콜백은 가능한 예외와, `recursive`가 `true`인 경우 생성된 첫 번째 디렉토리 경로인 `(err[, path])`를 받습니다. 디렉토리가 생성되지 않은 경우(예: 이전에 생성된 경우) `recursive`가 `true`인 경우에도 `path`는 여전히 `undefined`일 수 있습니다.

선택적 `options` 인수는 `mode`(권한 및 스티키 비트)를 지정하는 정수이거나, `mode` 속성 및 상위 디렉토리를 생성해야 하는지 여부를 나타내는 `recursive` 속성이 있는 객체일 수 있습니다. `path`가 존재하는 디렉토리인 경우 `fs.mkdir()`을 호출하면 `recursive`가 false인 경우에만 오류가 발생합니다. `recursive`가 false이고 디렉토리가 존재하는 경우 `EEXIST` 오류가 발생합니다.

```js [ESM]
import { mkdir } from 'node:fs';

// ./tmp 및 ./tmp/a가 존재하는지 여부에 관계없이 ./tmp/a/apple을 생성합니다.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
Windows에서는 재귀를 사용하더라도 루트 디렉토리에서 `fs.mkdir()`을 사용하면 오류가 발생합니다.

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: 작업이 허용되지 않습니다, mkdir 'C:\']
});
```
자세한 내용은 POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) 문서를 참조하십시오.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v20.6.0, v18.19.0 | 이제 `prefix` 매개변수가 버퍼와 URL을 허용합니다. |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v16.5.0, v14.18.0 | 이제 `prefix` 매개변수가 빈 문자열을 허용합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않음 경고가 발생합니다. |
| v6.2.1 | 이제 `callback` 매개변수는 선택 사항입니다. |
| v5.10.0 | v5.10.0에 추가됨 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

고유한 임시 디렉터리를 만듭니다.

고유한 임시 디렉터리를 만들기 위해 필수 `prefix` 뒤에 추가할 6개의 임의 문자를 생성합니다. 플랫폼 불일치로 인해 `prefix`에 후행 `X` 문자를 피하십시오. 특히 BSD와 같은 일부 플랫폼은 6개 이상의 임의 문자를 반환하고 `prefix`의 후행 `X` 문자를 임의 문자로 바꿀 수 있습니다.

생성된 디렉터리 경로는 콜백의 두 번째 매개변수로 문자열로 전달됩니다.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // 출력: /tmp/foo-itXde2 또는 C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
`fs.mkdtemp()` 메서드는 6개의 임의로 선택된 문자를 `prefix` 문자열에 직접 추가합니다. 예를 들어 디렉터리 `/tmp`가 주어지고 `/tmp` *내*에 임시 디렉터리를 만들려는 경우 `prefix`는 후행 플랫폼별 경로 구분 기호(`require('node:path').sep`)로 끝나야 합니다.

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// 새 임시 디렉터리의 상위 디렉터리
const tmpDir = tmpdir();

// 이 방법은 *잘못되었습니다*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // `/tmpabc123`과 유사한 내용을 출력합니다.
  // 새 임시 디렉터리가 /tmp 디렉터리 *내*가 아니라
  // 파일 시스템 루트에 생성됩니다.
});

// 이 방법은 *올바릅니다*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // `/tmp/abc123`과 유사한 내용을 출력합니다.
  // 새 임시 디렉터리가
  // /tmp 디렉터리 내에 생성됩니다.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v11.1.0 | `flags` 인수는 이제 선택 사항이며 기본값은 `'r'`입니다. |
| v9.9.0 | 이제 `as` 및 `as+` 플래그가 지원됩니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.0.2 | 추가됨: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666` (읽기 및 쓰기 가능)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

비동기 파일 열기. 자세한 내용은 POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) 설명서를 참조하십시오.

`mode`는 파일 모드(권한 및 스티키 비트)를 설정하지만 파일이 생성된 경우에만 가능합니다. Windows에서는 쓰기 권한만 조작할 수 있습니다. [`fs.chmod()`](/ko/nodejs/api/fs#fschmodpath-mode-callback)을 참조하십시오.

콜백은 두 개의 인수 `(err, fd)`를 받습니다.

일부 문자(`\< \> : " / \ | ? *`)는 [파일, 경로 및 이름 공간 이름 지정](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file)에 문서화된 대로 Windows에서 예약되어 있습니다. NTFS에서 파일 이름에 콜론이 포함된 경우 Node.js는 [이 MSDN 페이지](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams)에 설명된 대로 파일 시스템 스트림을 엽니다.

`fs.open()`을 기반으로 하는 함수도 이와 같은 동작을 보입니다: `fs.writeFile()`, `fs.readFile()` 등.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Added in: v19.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob의 선택적 MIME 타입입니다.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 [\<Blob\>](/ko/nodejs/api/buffer#class-blob)으로 이행됩니다.

데이터가 주어진 파일에 의해 지원되는 [\<Blob\>](/ko/nodejs/api/buffer#class-blob)을 반환합니다.

[\<Blob\>](/ko/nodejs/api/buffer#class-blob)이 생성된 후에는 파일을 수정해서는 안 됩니다. 수정하면 [\<Blob\>](/ko/nodejs/api/buffer#class-blob) 데이터 읽기가 `DOMException` 오류와 함께 실패합니다. 파일 데이터가 디스크에서 수정되었는지 감지하기 위해 `Blob`이 생성될 때와 각 읽기 전에 파일에 대한 동기 통계 작업이 수행됩니다.

::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` 옵션이 추가되었습니다. |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v13.1.0, v12.16.0 | `bufferSize` 옵션이 도입되었습니다. |
| v12.12.0 | Added in: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 디렉터리에서 읽을 때 내부적으로 버퍼링되는 디렉터리 항목 수입니다. 값이 높을수록 성능이 향상되지만 메모리 사용량이 높아집니다. **기본값:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)
  
 

디렉터리를 비동기적으로 엽니다. 자세한 내용은 POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) 문서를 참조하세요.

디렉터리에서 읽고 정리하기 위한 모든 추가 함수를 포함하는 [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)을 생성합니다.

`encoding` 옵션은 디렉터리를 열고 후속 읽기 작업을 수행하는 동안 `path`에 대한 인코딩을 설정합니다.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.10.0 | 이제 `buffer` 매개변수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v7.4.0 | 이제 `buffer` 매개변수는 `Uint8Array`가 될 수 있습니다. |
| v6.0.0 | 이제 `length` 매개변수는 `0`이 될 수 있습니다. |
| v0.0.2 | 추가됨: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 데이터가 쓰여질 버퍼입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 데이터를 쓸 `buffer`의 위치입니다.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 파일에서 읽기를 시작할 위치를 지정합니다. `position`이 `null` 또는 `-1`이면 데이터는 현재 파일 위치에서 읽혀지고 파일 위치가 업데이트됩니다. `position`이 음수가 아닌 정수이면 파일 위치는 변경되지 않습니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`fd`로 지정된 파일에서 데이터를 읽습니다.

콜백에는 세 가지 인수 `(err, bytesRead, buffer)`가 제공됩니다.

파일이 동시에 수정되지 않으면 읽은 바이트 수가 0일 때 파일 끝에 도달합니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)로 프로미스화된 버전으로 호출되면 `bytesRead` 및 `buffer` 속성이 있는 `Object`에 대한 프로미스를 반환합니다.

`fs.read()` 메서드는 파일 설명자(`fd`)로 지정된 파일에서 데이터를 읽습니다. `length` 인수는 Node.js가 커널에서 읽으려고 시도하는 최대 바이트 수를 나타냅니다. 그러나 실제 읽은 바이트 수(`bytesRead`)는 여러 가지 이유로 지정된 `length`보다 낮을 수 있습니다.

예를 들어:

- 파일이 지정된 `length`보다 짧으면 `bytesRead`는 실제 읽은 바이트 수로 설정됩니다.
- 버퍼를 채우기 전에 파일이 EOF(파일 끝)를 만나면 Node.js는 EOF가 발생할 때까지 사용 가능한 모든 바이트를 읽고 콜백의 `bytesRead` 매개변수는 실제 읽은 바이트 수를 나타냅니다. 이는 지정된 `length`보다 작을 수 있습니다.
- 파일이 느린 네트워크 `filesystem`에 있거나 읽기 중에 다른 문제가 발생하면 `bytesRead`는 지정된 `length`보다 낮을 수 있습니다.

따라서 `fs.read()`를 사용할 때 파일에서 실제로 읽은 바이트 수를 확인하려면 `bytesRead` 값을 확인하는 것이 중요합니다. 애플리케이션 논리에 따라 `bytesRead`가 지정된 `length`보다 낮은 경우를 처리해야 할 수 있습니다. 예를 들어 최소 바이트 수가 필요한 경우 읽기 호출을 루프로 래핑하는 방법이 있습니다.

이 동작은 POSIX `preadv2` 함수와 유사합니다.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.11.0, v12.17.0 | buffer, offset, length 및 position을 선택 사항으로 만들기 위해 옵션 객체를 전달할 수 있습니다. |
| v13.11.0, v12.17.0 | 추가됨: v13.11.0, v12.17.0 |
:::

- `fd` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<객체\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **기본값:** `Buffer.alloc(16384)`
    - `offset` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `length` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.byteLength - offset`
    - `position` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`


- `callback` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)


[`fs.read()`](/ko/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 함수와 유사하게, 이 버전은 선택적 `options` 객체를 사용합니다. `options` 객체가 지정되지 않은 경우 위의 값으로 기본 설정됩니다.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**추가된 버전: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 데이터를 쓸 버퍼입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **기본값:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)



[`fs.read()`](/ko/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 함수와 유사하며, 이 버전은 선택적 `options` 객체를 취합니다. `options` 객체가 지정되지 않은 경우 위의 값으로 기본 설정됩니다.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` 옵션이 추가되었습니다. |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_ARG_TYPE`이 `ERR_INVALID_CALLBACK` 대신 발생합니다. |
| v10.10.0 | 새로운 옵션 `withFileTypes`가 추가되었습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 사용 중단 경고가 발생합니다. |
| v6.0.0 | `options` 매개변수가 추가되었습니다. |
| v0.1.8 | 추가된 버전: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 디렉터리의 내용을 재귀적으로 읽습니다. 재귀 모드에서는 모든 파일, 하위 파일 및 디렉터리를 나열합니다. **기본값:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ko/nodejs/api/fs#class-fsdirent)



디렉터리의 내용을 읽습니다. 콜백은 두 개의 인수 `(err, files)`를 받습니다. 여기서 `files`는 디렉터리의 파일 이름 배열이며 `'.'`과 `'..'`는 제외됩니다.

자세한 내용은 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 문서를 참조하십시오.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 콜백에 전달되는 파일 이름에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정된 경우 반환된 파일 이름은 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

`options.withFileTypes`가 `true`로 설정되면 `files` 배열에는 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 포함됩니다.


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v16.0.0 | 반환된 오류가 둘 이상의 오류가 반환된 경우 `AggregateError`일 수 있습니다. |
| v15.2.0, v14.17.0 | options 인수는 진행 중인 readFile 요청을 중단하기 위해 AbortSignal을 포함할 수 있습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는 경고가 발생합니다. |
| v5.1.0 | `callback`은 성공적인 경우 항상 `error` 매개변수로 `null`과 함께 호출됩니다. |
| v5.0.0 | `path` 매개변수는 이제 파일 설명자가 될 수 있습니다. |
| v0.1.29 | v0.1.29에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 이름 또는 파일 설명자
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하세요. **기본값:** `'r'`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 readFile 중단을 허용합니다.
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
 

파일의 전체 내용을 비동기적으로 읽습니다.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
콜백에는 두 개의 인수 `(err, data)`가 전달되며, 여기서 `data`는 파일의 내용입니다.

인코딩이 지정되지 않은 경우 원시 버퍼가 반환됩니다.

`options`가 문자열이면 인코딩을 지정합니다.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
경로가 디렉터리인 경우 `fs.readFile()` 및 [`fs.readFileSync()`](/ko/nodejs/api/fs#fsreadfilesyncpath-options)의 동작은 플랫폼에 따라 다릅니다. macOS, Linux 및 Windows에서는 오류가 반환됩니다. FreeBSD에서는 디렉터리 내용의 표현이 반환됩니다.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux 및 Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
`AbortSignal`을 사용하여 진행 중인 요청을 중단할 수 있습니다. 요청이 중단되면 콜백은 `AbortError`와 함께 호출됩니다.

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// 요청을 중단하려는 경우
controller.abort();
```
`fs.readFile()` 함수는 전체 파일을 버퍼링합니다. 메모리 비용을 최소화하려면 가능한 경우 `fs.createReadStream()`을 통해 스트리밍하는 것이 좋습니다.

진행 중인 요청을 중단해도 개별 운영 체제 요청이 중단되는 것이 아니라 `fs.readFile`이 수행하는 내부 버퍼링이 중단됩니다.


#### 파일 디스크립터 {#file-descriptors}

#### 성능 고려 사항 {#performance-considerations}

`fs.readFile()` 메서드는 파일 내용을 한 번에 하나의 청크씩 메모리로 비동기적으로 읽어 들이며, 각 청크 사이에서 이벤트 루프가 전환될 수 있도록 합니다. 이를 통해 읽기 작업이 기본 libuv 스레드 풀을 사용하는 다른 활동에 미치는 영향을 줄일 수 있지만, 전체 파일을 메모리로 읽어 들이는 데 시간이 더 오래 걸립니다.

추가적인 읽기 오버헤드는 시스템에 따라 크게 다를 수 있으며 읽고 있는 파일 유형에 따라 달라집니다. 파일 유형이 일반 파일이 아니고 (예: 파이프) Node.js가 실제 파일 크기를 확인할 수 없는 경우, 각 읽기 작업은 64KiB의 데이터를 로드합니다. 일반 파일의 경우 각 읽기는 512KiB의 데이터를 처리합니다.

파일 내용을 가능한 한 빨리 읽어야 하는 애플리케이션의 경우 `fs.read()`를 직접 사용하고 애플리케이션 코드가 파일의 전체 내용을 직접 관리하는 것이 좋습니다.

Node.js GitHub 이슈 [#25741](https://github.com/nodejs/node/issues/25741)은 다양한 Node.js 버전에서 여러 파일 크기에 대한 `fs.readFile()` 성능에 대한 자세한 정보와 상세한 분석을 제공합니다.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 사용 중단 경고가 발생합니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)


`path`가 가리키는 심볼릭 링크의 내용을 읽습니다. 콜백은 두 개의 인수를 받습니다 `(err, linkString)`.

자세한 내용은 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) 문서를 참조하십시오.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 콜백에 전달되는 링크 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환되는 링크 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v13.13.0, v12.17.0 | 추가됨: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

`fd`로 지정된 파일에서 읽고 `readv()`를 사용하여 `ArrayBufferView` 배열에 씁니다.

`position`은 데이터를 읽어야 하는 파일 시작 부분에서부터의 오프셋입니다. `typeof position !== 'number'`이면 현재 위치에서 데이터를 읽습니다.

콜백에는 세 개의 인수인 `err`, `bytesRead` 및 `buffers`가 제공됩니다. `bytesRead`는 파일에서 읽은 바이트 수입니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal) 버전으로 호출되면 `bytesRead` 및 `buffers` 속성이 있는 `Object`에 대한 프로미스를 반환합니다.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v8.0.0 | 파이프/소켓 확인 지원이 추가되었습니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v6.4.0 | Windows의 다양한 엣지 케이스에 대해 `realpath` 호출이 다시 작동합니다. |
| v6.0.0 | `cache` 매개변수가 제거되었습니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`.`, `..` 및 심볼릭 링크를 확인하여 표준 경로 이름을 비동기적으로 계산합니다.

표준 경로 이름이 반드시 고유한 것은 아닙니다. 하드 링크 및 바인드 마운트를 통해 여러 경로 이름을 통해 파일 시스템 엔터티를 노출할 수 있습니다.

이 함수는 몇 가지 예외 사항을 제외하고 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)와 유사하게 작동합니다.

`callback`은 두 개의 인수 `(err, resolvedPath)`를 가져옵니다. 상대 경로를 확인하기 위해 `process.cwd`를 사용할 수 있습니다.

UTF8 문자열로 변환할 수 있는 경로만 지원됩니다.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 콜백에 전달되는 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환된 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

`path`가 소켓 또는 파이프로 확인되면 함수는 해당 객체에 대한 시스템 종속 이름을 반환합니다.

존재하지 않는 경로는 ENOENT 오류를 발생시킵니다. `error.path`는 절대 파일 경로입니다.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v9.2.0 | 추가됨: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)


비동기 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

`callback`은 두 개의 인자 `(err, resolvedPath)`를 받습니다.

UTF8 문자열로 변환할 수 있는 경로만 지원됩니다.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 콜백에 전달되는 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정된 경우 반환된 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

Linux에서 Node.js가 musl libc와 연결된 경우 이 함수가 작동하려면 procfs 파일 시스템이 `/proc`에 마운트되어야 합니다. Glibc는 이러한 제한이 없습니다.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.6.0 | `oldPath` 및 `newPath` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. 지원은 현재 여전히 *실험적*입니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는 경고가 발생합니다. |
| v0.0.2 | 추가됨: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


`oldPath`에 있는 파일 이름을 `newPath`로 제공된 경로 이름으로 비동기적으로 바꿉니다. `newPath`가 이미 존재하는 경우 덮어씁니다. `newPath`에 디렉토리가 있는 경우 대신 오류가 발생합니다. 가능한 예외 외에 완료 콜백에 제공되는 인수는 없습니다.

참조: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('이름 변경 완료!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v16.0.0 | 파일인 `path`에서 `fs.rmdir(path, { recursive: true })`을 사용하는 것은 더 이상 허용되지 않으며 Windows에서는 `ENOENT` 오류가 발생하고 POSIX에서는 `ENOTDIR` 오류가 발생합니다. |
| v16.0.0 | 존재하지 않는 `path`에서 `fs.rmdir(path, { recursive: true })`을 사용하는 것은 더 이상 허용되지 않으며 `ENOENT` 오류가 발생합니다. |
| v16.0.0 | `recursive` 옵션은 더 이상 사용되지 않으며, 사용하면 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v14.14.0 | `recursive` 옵션은 더 이상 사용되지 않으며, 대신 `fs.rm`을 사용하십시오. |
| v13.3.0, v12.16.0 | `maxBusyTries` 옵션의 이름이 `maxRetries`로 변경되었으며 기본값은 0입니다. `emfileWait` 옵션이 제거되었으며 `EMFILE` 오류는 다른 오류와 동일한 재시도 논리를 사용합니다. `retryDelay` 옵션이 이제 지원됩니다. `ENFILE` 오류가 이제 재시도됩니다. |
| v12.10.0 | 이제 `recursive`, `maxBusyTries` 및 `emfileWait` 옵션이 지원됩니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.0.2 | v0.0.2에서 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` 또는 `EPERM` 오류가 발생하면 Node.js는 각 시도마다 `retryDelay` 밀리초 더 길게 선형 백오프 대기 시간으로 작업을 재시도합니다. 이 옵션은 재시도 횟수를 나타냅니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 재귀적 디렉터리 제거를 수행합니다. 재귀적 모드에서는 오류 시 작업이 재시도됩니다. **기본값:** `false`. **더 이상 사용되지 않습니다.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재시도 간에 대기하는 시간(밀리초)입니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


비동기 [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). 가능한 예외 외에는 완료 콜백에 제공되는 인수가 없습니다.

파일(디렉터리가 아님)에서 `fs.rmdir()`을 사용하면 Windows에서는 `ENOENT` 오류가 발생하고 POSIX에서는 `ENOTDIR` 오류가 발생합니다.

`rm -rf` Unix 명령과 유사한 동작을 얻으려면 옵션 `{ recursive: true, force: true }`와 함께 [`fs.rm()`](/ko/nodejs/api/fs#fsrmpath-options-callback)을 사용하십시오.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.3.0, v16.14.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v14.14.0 | 추가됨: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `path`가 존재하지 않으면 예외가 무시됩니다. **기본값:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` 또는 `EPERM` 오류가 발생하면 Node.js는 각 시도마다 `retryDelay` 밀리초 더 긴 선형 백오프 대기 시간으로 작업을 다시 시도합니다. 이 옵션은 재시도 횟수를 나타냅니다. 이 옵션은 `recursive` 옵션이 `true`가 아닌 경우 무시됩니다. **기본값:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 재귀적 제거를 수행합니다. 재귀 모드에서 작업은 실패 시 다시 시도됩니다. **기본값:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재시도 사이의 대기 시간(밀리초)입니다. 이 옵션은 `recursive` 옵션이 `true`가 아닌 경우 무시됩니다. **기본값:** `100`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

비동기적으로 파일 및 디렉토리를 제거합니다(표준 POSIX `rm` 유틸리티를 모델로 함). 가능한 예외 외에 다른 인수는 완료 콜백에 제공되지 않습니다.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 더 이상 `ERR_INVALID_CALLBACK`이 아닌 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.5.0 | 반환되는 숫자 값이 bigint인지 여부를 지정하는 추가 `options` 객체를 허용합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 id DEP0013과 함께 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.0.2 | v0.0.2에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)
  
 

비동기식 [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2). 콜백은 두 개의 인수 `(err, stats)`를 가져오고 여기서 `stats`는 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체입니다.

오류가 발생하면 `err.code`는 [일반 시스템 오류](/ko/nodejs/api/errors#common-system-errors) 중 하나가 됩니다.

[`fs.stat()`](/ko/nodejs/api/fs#fsstatpath-options-callback)은 심볼릭 링크를 따릅니다. 링크 자체를 보려면 [`fs.lstat()`](/ko/nodejs/api/fs#fslstatpath-options-callback)을 사용하세요.

`fs.stat()`을 사용하여 `fs.open()`, `fs.readFile()` 또는 `fs.writeFile()`을 호출하기 전에 파일 존재 여부를 확인하는 것은 권장되지 않습니다. 대신 사용자 코드는 파일을 직접 열거나/읽거나/쓰고 파일을 사용할 수 없는 경우 발생하는 오류를 처리해야 합니다.

이후 조작 없이 파일이 존재하는지 확인하려면 [`fs.access()`](/ko/nodejs/api/fs#fsaccesspath-mode-callback)를 사용하는 것이 좋습니다.

예를 들어 다음과 같은 디렉터리 구조가 있다고 가정합니다.

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
다음 프로그램은 주어진 경로의 통계를 확인합니다.

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
결과 출력은 다음과 같습니다.

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**추가된 버전: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs) 객체의 숫자 값이 `bigint`여야 하는지 여부. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs)
  
 

비동기 [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). `path`를 포함하는 마운트된 파일 시스템에 대한 정보를 반환합니다. 콜백은 두 개의 인수인 `(err, stats)`를 받으며, 여기서 `stats`는 [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs) 객체입니다.

오류가 발생하면 `err.code`는 [일반 시스템 오류](/ko/nodejs/api/errors#common-system-errors) 중 하나가 됩니다.

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.0.0 | `type` 인수를 정의되지 않은 상태로 두면 Node는 `target` 유형을 자동 감지하고 자동으로 `dir` 또는 `file`을 선택합니다. |
| v7.6.0 | `target` 및 `path` 매개변수는 `file:` 프로토콜을 사용하여 WHATWG `URL` 객체일 수 있습니다. 현재 지원은 여전히 *실험적*입니다. |
| v0.1.31 | 추가된 버전: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

`target`을 가리키는 `path`라는 링크를 만듭니다. 가능한 예외를 제외하고는 완료 콜백에 다른 인수가 제공되지 않습니다.

자세한 내용은 POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) 설명서를 참조하십시오.

`type` 인수는 Windows에서만 사용할 수 있으며 다른 플랫폼에서는 무시됩니다. `'dir'`, `'file'` 또는 `'junction'`으로 설정할 수 있습니다. `type` 인수가 `null`인 경우 Node.js는 `target` 유형을 자동 감지하고 `'file'` 또는 `'dir'`을 사용합니다. `target`이 존재하지 않으면 `'file'`이 사용됩니다. Windows 연결 지점은 대상 경로가 절대 경로여야 합니다. `'junction'`을 사용하는 경우 `target` 인수는 자동으로 절대 경로로 정규화됩니다. NTFS 볼륨의 연결 지점은 디렉터리만 가리킬 수 있습니다.

상대 대상은 링크의 부모 디렉터리를 기준으로 합니다.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
위의 예제는 동일한 디렉터리에서 `mew`를 가리키는 심볼릭 링크 `mewtwo`를 만듭니다.

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v16.0.0 | 둘 이상의 오류가 반환되면 반환되는 오류는 `AggregateError`일 수 있습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v0.8.6 | v0.8.6에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

파일을 자릅니다. 완료 콜백에 예외 외에 다른 인수가 제공되지 않습니다. 파일 디스크립터를 첫 번째 인수로 전달할 수도 있습니다. 이 경우 `fs.ftruncate()`가 호출됩니다.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// 'path/file.txt'가 일반 파일이라고 가정합니다.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt가 잘렸습니다');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// 'path/file.txt'가 일반 파일이라고 가정합니다.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt가 잘렸습니다');
});
```
:::

파일 디스크립터를 전달하는 것은 더 이상 사용되지 않으며 향후 오류가 발생할 수 있습니다.

자세한 내용은 POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) 설명서를 참조하십시오.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는 경고가 표시됩니다. |
| v0.0.2 | v0.0.2에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

파일 또는 심볼릭 링크를 비동기적으로 제거합니다. 가능한 예외 외에는 완료 콜백에 인수가 제공되지 않습니다.

```js [ESM]
import { unlink } from 'node:fs';
// 'path/file.txt'가 일반 파일이라고 가정합니다.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
```
`fs.unlink()`는 디렉터리(비어 있든 아니든)에서 작동하지 않습니다. 디렉터리를 제거하려면 [`fs.rmdir()`](/ko/nodejs/api/fs#fsrmdirpath-options-callback)를 사용하세요.

자세한 내용은 POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) 문서를 참조하세요.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**추가된 버전: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 선택 사항, 이전에 `fs.watchFile()`을 사용하여 연결된 리스너입니다.

`filename`에 대한 변경 감시를 중지합니다. `listener`가 지정된 경우 해당 특정 리스너만 제거됩니다. 그렇지 않으면 *모든* 리스너가 제거되어 `filename` 감시가 효과적으로 중지됩니다.

감시되지 않는 파일 이름으로 `fs.unwatchFile()`을 호출하는 것은 오류가 아닌 무작위 연산입니다.

[`fs.watch()`](/ko/nodejs/api/fs#fswatchfilename-options-listener)는 `fs.watchFile()` 및 `fs.unwatchFile()`보다 효율적입니다. 가능하면 `fs.watchFile()` 및 `fs.unwatchFile()` 대신 `fs.watch()`를 사용해야 합니다.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임 시 `TypeError`가 발생합니다. |
| v8.0.0 | `NaN`, `Infinity` 및 `-Infinity`는 더 이상 유효한 시간 지정자가 아닙니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v4.1.0 | 숫자 문자열, `NaN` 및 `Infinity`가 이제 허용되는 시간 지정자입니다. |
| v0.4.2 | v0.4.2에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`path`에서 참조하는 객체의 파일 시스템 타임스탬프를 변경합니다.

`atime` 및 `mtime` 인수는 다음 규칙을 따릅니다.

- 값은 Unix epoch 시간을 초 단위로 나타내는 숫자, `Date` 또는 `'123456789.0'`과 같은 숫자 문자열일 수 있습니다.
- 값을 숫자로 변환할 수 없거나 `NaN`, `Infinity` 또는 `-Infinity`인 경우 `Error`가 발생합니다.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.1.0 | Linux, AIX 및 IBMi에 대한 재귀적 지원 추가. |
| v15.9.0, v14.17.0 | AbortSignal을 사용하여 감시자를 닫는 기능 지원 추가. |
| v7.6.0 | `filename` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v7.0.0 | 전달된 `options` 객체는 수정되지 않습니다. |
| v0.5.10 | v0.5.10에 추가됨 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 파일이 감시되는 동안 프로세스가 계속 실행되어야 하는지 여부를 나타냅니다. **기본값:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모든 하위 디렉터리를 감시해야 하는지, 아니면 현재 디렉터리만 감시해야 하는지 여부를 나타냅니다. 디렉터리가 지정된 경우에 적용되며 지원되는 플랫폼에서만 적용됩니다( [주의 사항](/ko/nodejs/api/fs#caveats) 참조). **기본값:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 리스너에 전달되는 파일 이름에 사용할 문자 인코딩을 지정합니다. **기본값:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) AbortSignal을 사용하여 감시자를 닫을 수 있습니다.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **기본값:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

- 반환: [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)

`filename`의 변경 사항을 감시합니다. 여기서 `filename`은 파일 또는 디렉터리입니다.

두 번째 인수는 선택 사항입니다. `options`가 문자열로 제공되면 `encoding`을 지정합니다. 그렇지 않으면 `options`를 객체로 전달해야 합니다.

리스너 콜백은 두 개의 인수 `(eventType, filename)`을 받습니다. `eventType`은 `'rename'` 또는 `'change'`이고, `filename`은 이벤트를 트리거한 파일의 이름입니다.

대부분의 플랫폼에서 `'rename'`은 파일 이름이 디렉터리에 나타나거나 사라질 때마다 발생합니다.

리스너 콜백은 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)에서 발생하는 `'change'` 이벤트에 연결되지만 `eventType`의 `'change'` 값과 동일하지 않습니다.

`signal`이 전달되면 해당 AbortController를 중단하면 반환된 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)가 닫힙니다.


#### 주의 사항 {#caveats}

`fs.watch` API는 플랫폼 간에 100% 일관성이 없으며, 일부 상황에서는 사용할 수 없습니다.

Windows에서는 감시 대상 디렉터리가 이동하거나 이름이 바뀌면 이벤트가 발생하지 않습니다. 감시 대상 디렉터리가 삭제되면 `EPERM` 오류가 보고됩니다.

##### 사용 가능성 {#availability}

이 기능은 파일 시스템 변경 사항을 알리는 기본 운영 체제에 따라 달라집니다.

- Linux 시스템에서는 [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7)를 사용합니다.
- BSD 시스템에서는 [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2)를 사용합니다.
- macOS에서는 파일의 경우 [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2)를 사용하고 디렉터리의 경우 [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events)를 사용합니다.
- SunOS 시스템(Solaris 및 SmartOS 포함)에서는 [`event ports`](https://illumos.org/man/port_create)를 사용합니다.
- Windows 시스템에서는 이 기능이 [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw)에 따라 달라집니다.
- AIX 시스템에서는 이 기능이 활성화해야 하는 [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/)에 따라 달라집니다.
- IBM i 시스템에서는 이 기능이 지원되지 않습니다.

어떤 이유로 기본 기능을 사용할 수 없는 경우 `fs.watch()`는 작동하지 않고 예외를 발생시킬 수 있습니다. 예를 들어 가상화 소프트웨어(예: Vagrant 또는 Docker)를 사용할 때 네트워크 파일 시스템(NFS, SMB 등) 또는 호스트 파일 시스템에서 파일 또는 디렉터리 감시가 불안정하거나 불가능할 수 있습니다.

stat 폴링을 사용하는 `fs.watchFile()`을 여전히 사용할 수 있지만 이 방법은 느리고 덜 안정적입니다.

##### 아이노드 {#inodes}

Linux 및 macOS 시스템에서 `fs.watch()`는 경로를 [아이노드](https://en.wikipedia.org/wiki/Inode)로 확인하고 아이노드를 감시합니다. 감시 대상 경로가 삭제되고 다시 생성되면 새 아이노드가 할당됩니다. 감시는 삭제에 대한 이벤트를 발생시키지만 *원래* 아이노드를 계속 감시합니다. 새 아이노드에 대한 이벤트는 발생하지 않습니다. 이는 예상된 동작입니다.

AIX 파일은 파일의 수명 동안 동일한 아이노드를 유지합니다. AIX에서 감시 대상 파일을 저장하고 닫으면 두 개의 알림(새 콘텐츠 추가에 대한 알림과 잘림에 대한 알림)이 발생합니다.


##### Filename argument {#filename-argument}

콜백에서 `filename` 인수를 제공하는 것은 Linux, macOS, Windows 및 AIX에서만 지원됩니다. 지원되는 플랫폼에서도 `filename`이 항상 제공된다는 보장은 없습니다. 따라서 콜백에서 `filename` 인수가 항상 제공된다고 가정하지 말고 `null`인 경우를 대비한 대체 로직을 준비하십시오.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`이벤트 유형: ${eventType}`);
  if (filename) {
    console.log(`제공된 파일 이름: ${filename}`);
  } else {
    console.log('파일 이름이 제공되지 않았습니다.');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.5.0 | `bigint` 옵션이 지원됩니다. |
| v7.6.0 | `filename` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.31 | v0.1.31에 추가됨 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `5007`


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `current` [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)


- 반환: [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher)

`filename`의 변경 사항을 감시합니다. 파일에 액세스할 때마다 콜백 `listener`가 호출됩니다.

`options` 인수는 생략할 수 있습니다. 제공되는 경우 객체여야 합니다. `options` 객체는 파일이 감시되는 동안 프로세스가 계속 실행되어야 하는지 여부를 나타내는 `persistent`라는 부울을 포함할 수 있습니다. `options` 객체는 대상 폴링 빈도를 밀리초 단위로 나타내는 `interval` 속성을 지정할 수 있습니다.

`listener`는 현재 stat 객체와 이전 stat 객체의 두 가지 인수를 받습니다.

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`현재 수정 시간: ${curr.mtime}`);
  console.log(`이전 수정 시간: ${prev.mtime}`);
});
```
이러한 stat 객체는 `fs.Stat`의 인스턴스입니다. `bigint` 옵션이 `true`이면 이러한 객체의 숫자 값은 `BigInt`로 지정됩니다.

단순히 액세스한 것이 아니라 파일이 수정되었을 때 알림을 받으려면 `curr.mtimeMs`와 `prev.mtimeMs`를 비교해야 합니다.

`fs.watchFile` 작업으로 인해 `ENOENT` 오류가 발생하면 모든 필드가 0(또는 날짜의 경우 Unix Epoch)으로 설정된 상태로 리스너가 한 번 호출됩니다. 파일이 나중에 생성되면 최신 stat 객체를 사용하여 리스너가 다시 호출됩니다. 이는 v0.10 이후의 기능 변경 사항입니다.

[`fs.watch()`](/ko/nodejs/api/fs#fswatchfilename-options-listener)를 사용하는 것이 `fs.watchFile` 및 `fs.unwatchFile`보다 효율적입니다. 가능하면 `fs.watchFile` 및 `fs.unwatchFile` 대신 `fs.watch`를 사용해야 합니다.

`fs.watchFile()`로 감시하는 파일이 사라졌다 다시 나타나면 두 번째 콜백 이벤트(파일이 다시 나타남)에서 `previous`의 내용은 첫 번째 콜백 이벤트(파일이 사라짐)에서 `previous`의 내용과 동일합니다.

이는 다음과 같은 경우에 발생합니다.

- 파일이 삭제된 후 복원되는 경우
- 파일 이름이 변경된 후 원래 이름으로 다시 변경되는 경우


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v14.0.0 | `buffer` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.10.0 | `buffer` 매개변수는 이제 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.4.0 | `buffer` 매개변수는 이제 `Uint8Array`일 수 있습니다. |
| v7.2.0 | `offset` 및 `length` 매개변수는 이제 선택 사항입니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는다는 경고가 발생합니다. |
| v0.0.2 | Added in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

`buffer`를 `fd`로 지정된 파일에 씁니다.

`offset`은 쓸 버퍼의 부분을 결정하고, `length`는 쓸 바이트 수를 지정하는 정수입니다.

`position`은 이 데이터가 쓰여질 파일의 시작 부분에서 오프셋을 나타냅니다. `typeof position !== 'number'`인 경우 데이터는 현재 위치에 쓰여집니다. [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2)를 참조하십시오.

콜백에는 세 개의 인수 `(err, bytesWritten, buffer)`가 제공되며, `bytesWritten`은 `buffer`에서 쓰여진 *바이트* 수를 지정합니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)ed 버전으로 호출되면 `bytesWritten` 및 `buffer` 속성을 가진 `Object`에 대한 프로미스를 반환합니다.

콜백을 기다리지 않고 동일한 파일에서 `fs.write()`를 여러 번 사용하는 것은 안전하지 않습니다. 이 시나리오에서는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)를 사용하는 것이 좋습니다.

Linux에서는 파일을 추가 모드로 열면 위치 지정 쓰기가 작동하지 않습니다. 커널은 위치 인수를 무시하고 항상 파일 끝에 데이터를 추가합니다.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**추가된 버전: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)



`fd`로 지정된 파일에 `buffer`를 씁니다.

위의 `fs.write` 함수와 유사하게 이 버전은 선택적 `options` 객체를 사용합니다. `options` 객체가 지정되지 않은 경우 위의 값으로 기본 설정됩니다.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 자체 `toString` 함수가 있는 객체를 `string` 매개변수에 전달하는 것은 더 이상 지원되지 않습니다. |
| v17.8.0 | 자체 `toString` 함수가 있는 객체를 `string` 매개변수에 전달하는 것은 더 이상 사용되지 않습니다. |
| v14.12.0 | `string` 매개변수는 명시적 `toString` 함수가 있는 객체를 문자열화합니다. |
| v14.0.0 | `string` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.2.0 | 이제 `position` 매개변수는 선택 사항입니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 ID DEP0013으로 더 이상 사용되지 않는 경고를 보냅니다. |
| v0.11.5 | 추가된 버전: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



`fd`로 지정된 파일에 `string`을 씁니다. `string`이 문자열이 아니면 예외가 발생합니다.

`position`은 이 데이터를 써야 하는 파일 시작 부분으로부터의 오프셋을 나타냅니다. `typeof position !== 'number'`이면 데이터가 현재 위치에 쓰여집니다. [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2)를 참조하십시오.

`encoding`은 예상되는 문자열 인코딩입니다.

콜백은 `(err, written, string)` 인수를 받습니다. 여기서 `written`은 전달된 문자열을 쓰는 데 필요한 *바이트* 수를 지정합니다. 쓴 바이트 수는 반드시 쓴 문자열 문자와 같지 않습니다. [`Buffer.byteLength`](/ko/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding)를 참조하십시오.

콜백을 기다리지 않고 동일한 파일에서 `fs.write()`를 여러 번 사용하는 것은 안전하지 않습니다. 이 시나리오에서는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)이 권장됩니다.

Linux에서는 파일이 추가 모드로 열려 있을 때 위치 쓰기가 작동하지 않습니다. 커널은 위치 인수를 무시하고 항상 파일 끝에 데이터를 추가합니다.

Windows에서는 파일 설명자가 콘솔에 연결되어 있는 경우(예: `fd == 1` 또는 `stdout`) 사용된 인코딩에 관계없이 ASCII가 아닌 문자를 포함하는 문자열은 기본적으로 올바르게 렌더링되지 않습니다. `chcp 65001` 명령으로 활성 코드 페이지를 변경하여 UTF-8을 올바르게 렌더링하도록 콘솔을 구성할 수 있습니다. 자세한 내용은 [chcp](https://ss64.com/nt/chcp) 문서를 참조하십시오.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0, v20.10.0 | 이제 `flush` 옵션이 지원됩니다. |
| v19.0.0 | 자체 `toString` 함수가 있는 객체를 `string` 매개변수에 전달하는 것은 더 이상 지원되지 않습니다. |
| v18.0.0 | 유효하지 않은 콜백을 `callback` 인수에 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v17.8.0 | 자체 `toString` 함수가 있는 객체를 `string` 매개변수에 전달하는 것은 더 이상 사용되지 않습니다. |
| v16.0.0 | 둘 이상의 오류가 반환되면 반환되는 오류는 `AggregateError`일 수 있습니다. |
| v15.2.0, v14.17.0 | 옵션 인수에 진행 중인 writeFile 요청을 중단하는 AbortSignal이 포함될 수 있습니다. |
| v14.12.0 | `data` 매개변수는 명시적인 `toString` 함수가 있는 객체를 문자열화합니다. |
| v14.0.0 | `data` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.10.0 | `data` 매개변수는 이제 모든 `TypedArray` 또는 `DataView`일 수 있습니다. |
| v10.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 런타임에 `TypeError`가 발생합니다. |
| v7.4.0 | `data` 매개변수는 이제 `Uint8Array`일 수 있습니다. |
| v7.0.0 | `callback` 매개변수는 더 이상 선택 사항이 아닙니다. 전달하지 않으면 id DEP0013으로 더 이상 사용되지 않는 경고가 발생합니다. |
| v5.0.0 | 이제 `file` 매개변수가 파일 디스크립터일 수 있습니다. |
| v0.1.29 | v0.1.29에 추가됨 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 이름 또는 파일 디스크립터
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모든 데이터가 파일에 성공적으로 기록되고 `flush`가 `true`이면 `fs.fsync()`가 데이터를 플러시하는 데 사용됩니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 writeFile을 중단할 수 있습니다.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)


`file`이 파일 이름인 경우 데이터를 파일에 비동기적으로 쓰고 파일이 이미 존재하는 경우 파일을 바꿉니다. `data`는 문자열 또는 버퍼일 수 있습니다.

`file`이 파일 디스크립터인 경우 동작은 `fs.write()`를 직접 호출하는 것과 유사합니다(권장). 파일 디스크립터 사용에 대한 아래 참고 사항을 참조하십시오.

`data`가 버퍼이면 `encoding` 옵션은 무시됩니다.

`mode` 옵션은 새로 생성된 파일에만 영향을 미칩니다. 자세한 내용은 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback)을 참조하십시오.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
`options`가 문자열이면 인코딩을 지정합니다.

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
콜백을 기다리지 않고 동일한 파일에서 `fs.writeFile()`을 여러 번 사용하는 것은 안전하지 않습니다. 이 시나리오에서는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)을 사용하는 것이 좋습니다.

`fs.readFile`과 마찬가지로 `fs.writeFile`은 전달된 버퍼를 쓰기 위해 내부적으로 여러 `write` 호출을 수행하는 편의 메서드입니다. 성능에 민감한 코드의 경우 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)을 사용하는 것이 좋습니다.

[\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)을 사용하여 `fs.writeFile()`을 취소할 수 있습니다. 취소는 "최선을 다하는 것"이며 어느 정도의 데이터가 여전히 기록될 가능성이 큽니다.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // 요청이 중단되면 콜백은 AbortError로 호출됩니다.
});
// 요청을 중단해야 하는 경우
controller.abort();
```
진행 중인 요청을 중단해도 개별 운영 체제 요청이 중단되는 것이 아니라 `fs.writeFile`이 수행하는 내부 버퍼링이 중단됩니다.


#### 파일 디스크립터와 함께 `fs.writeFile()` 사용하기 {#using-fswritefile-with-file-descriptors}

`file`이 파일 디스크립터일 때 동작은 다음과 같이 `fs.write()`를 직접 호출하는 것과 거의 동일합니다.

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
`fs.write()`를 직접 호출하는 것과의 차이점은 몇 가지 특이한 조건에서 `fs.write()`는 버퍼의 일부만 쓰고 나머지 데이터를 쓰기 위해 재시도해야 할 수 있는 반면, `fs.writeFile()`는 데이터가 완전히 쓰여질 때까지 (또는 오류가 발생할 때까지) 재시도한다는 것입니다.

이러한 의미는 일반적인 혼란의 원인입니다. 파일 디스크립터의 경우 파일이 대체되지 않습니다! 데이터가 반드시 파일의 시작 부분에 쓰여지는 것은 아니며, 파일의 원래 데이터가 새로 쓰여진 데이터의 앞이나 뒤에 남아 있을 수 있습니다.

예를 들어 `fs.writeFile()`이 연속으로 두 번 호출되어 먼저 문자열 `'Hello'`를 쓰고, 그 다음에 문자열 `', World'`를 쓰면 파일에는 `'Hello, World'`가 포함되고 파일의 원래 데이터 일부가 포함될 수 있습니다 (원래 파일의 크기 및 파일 디스크립터의 위치에 따라 다름). 파일 디스크립터 대신 파일 이름을 사용했으면 파일에는 `', World'`만 포함되도록 보장됩니다.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.9.0 | 추가됨: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

`writev()`를 사용하여 `fd`로 지정된 파일에 `ArrayBufferView` 배열을 씁니다.

`position`은 이 데이터가 쓰여져야 하는 파일 시작 부분에서부터의 오프셋입니다. `typeof position !== 'number'`인 경우 데이터는 현재 위치에 쓰여집니다.

콜백에는 세 가지 인수 `err`, `bytesWritten` 및 `buffers`가 제공됩니다. `bytesWritten`은 `buffers`에서 쓰여진 바이트 수입니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)로 프로미스화되면 `bytesWritten` 및 `buffers` 속성이 있는 `Object`에 대한 프로미스를 반환합니다.

콜백을 기다리지 않고 동일한 파일에서 `fs.writev()`를 여러 번 사용하는 것은 안전하지 않습니다. 이 시나리오에서는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)을 사용하세요.

Linux에서는 파일을 추가 모드로 열면 위치 쓰기가 작동하지 않습니다. 커널은 position 인수를 무시하고 항상 데이터를 파일 끝에 추가합니다.


## 동기 API {#synchronous-api}

동기 API는 모든 작업을 동기적으로 수행하며, 작업이 완료되거나 실패할 때까지 이벤트 루프를 차단합니다.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.11.15 | v0.11.15에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `fs.constants.F_OK`

`path`로 지정된 파일 또는 디렉토리에 대한 사용자의 권한을 동기적으로 테스트합니다. `mode` 인수는 수행할 접근성 검사를 지정하는 선택적 정수입니다. `mode`는 값 `fs.constants.F_OK` 또는 `fs.constants.R_OK`, `fs.constants.W_OK`, `fs.constants.X_OK`의 비트 OR로 구성된 마스크여야 합니다(예: `fs.constants.W_OK | fs.constants.R_OK`). `mode`의 가능한 값은 [파일 접근 상수](/ko/nodejs/api/fs#file-access-constants)를 확인하십시오.

접근성 검사 중 하나라도 실패하면 `Error`가 발생합니다. 그렇지 않으면 메서드는 `undefined`를 반환합니다.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.1.0, v20.10.0 | `flush` 옵션이 이제 지원됩니다. |
| v7.0.0 | 전달된 `options` 객체는 수정되지 않습니다. |
| v5.0.0 | `file` 매개변수는 이제 파일 디스크립터가 될 수 있습니다. |
| v0.6.7 | v0.6.7에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 이름 또는 파일 디스크립터
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기본 파일 디스크립터는 닫히기 전에 플러시됩니다. **기본값:** `false`.
  
 

파일에 데이터를 동기적으로 추가하고, 파일이 아직 존재하지 않으면 파일을 만듭니다. `data`는 문자열 또는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)일 수 있습니다.

`mode` 옵션은 새로 생성된 파일에만 영향을 줍니다. 자세한 내용은 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback)을 참조하십시오.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```
`options`가 문자열이면 인코딩을 지정합니다.

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
`path`는 추가를 위해 열린 숫자 파일 디스크립터로 지정될 수 있습니다(`fs.open()` 또는 `fs.openSync()` 사용). 파일 디스크립터는 자동으로 닫히지 않습니다.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.6.7 | 추가됨: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

자세한 내용은 이 API의 비동기 버전의 설명서를 참조하십시오: [`fs.chmod()`](/ko/nodejs/api/fs#fschmodpath-mode-callback).

자세한 내용은 POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) 문서를 참조하십시오.

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.97 | 추가됨: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

파일의 소유자 및 그룹을 동기적으로 변경합니다. `undefined`를 반환합니다. 이는 [`fs.chown()`](/ko/nodejs/api/fs#fschownpath-uid-gid-callback)의 동기 버전입니다.

자세한 내용은 POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) 문서를 참조하십시오.

### `fs.closeSync(fd)` {#fsclosesyncfd}

**추가됨: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

파일 디스크립터를 닫습니다. `undefined`를 반환합니다.

다른 `fs` 작업을 통해 현재 사용 중인 모든 파일 디스크립터(`fd`)에서 `fs.closeSync()`를 호출하면 정의되지 않은 동작이 발생할 수 있습니다.

자세한 내용은 POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) 문서를 참조하십시오.


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `flags` 인수를 `mode`로 변경하고 더 엄격한 유형 유효성 검사를 적용했습니다. |
| v8.5.0 | Added in: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 소스 파일 이름
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사 작업의 대상 파일 이름
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사 작업에 대한 수정자입니다. **기본값:** `0`.

`src`를 `dest`로 동기적으로 복사합니다. 기본적으로 `dest`가 이미 존재하는 경우 덮어씁니다. `undefined`를 반환합니다. Node.js는 복사 작업의 원자성을 보장하지 않습니다. 쓰기를 위해 대상 파일이 열린 후 오류가 발생하면 Node.js는 대상을 제거하려고 시도합니다.

`mode`는 복사 작업의 동작을 지정하는 선택적 정수입니다. 둘 이상의 값의 비트 OR로 구성된 마스크를 만들 수 있습니다(예: `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: `dest`가 이미 존재하는 경우 복사 작업이 실패합니다.
- `fs.constants.COPYFILE_FICLONE`: 복사 작업은 쓰기 시 복사 리플링크를 생성하려고 시도합니다. 플랫폼이 쓰기 시 복사를 지원하지 않으면 대체 복사 메커니즘이 사용됩니다.
- `fs.constants.COPYFILE_FICLONE_FORCE`: 복사 작업은 쓰기 시 복사 리플링크를 생성하려고 시도합니다. 플랫폼이 쓰기 시 복사를 지원하지 않으면 작업이 실패합니다.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt는 기본적으로 생성되거나 덮어쓰여집니다.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt가 destination.txt로 복사되었습니다.');

// COPYFILE_EXCL을 사용하면 destination.txt가 존재하는 경우 작업이 실패합니다.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.3.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v20.1.0, v18.17.0 | `fs.copyFile()`의 `mode` 인수로 복사 동작을 지정하는 추가 `mode` 옵션을 허용합니다. |
| v17.6.0, v16.15.0 | 심볼릭 링크의 경로 확인을 수행할지 여부를 지정하는 추가 `verbatimSymlinks` 옵션을 허용합니다. |
| v16.7.0 | v16.7.0에 추가됨 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 소스 경로입니다.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 복사할 대상 경로입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 심볼릭 링크를 역참조합니다. **기본값:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `force`가 `false`이고 대상이 존재하면 오류를 발생시킵니다. **기본값:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 복사된 파일/디렉터리를 필터링하는 함수입니다. 항목을 복사하려면 `true`를 반환하고, 무시하려면 `false`를 반환합니다. 디렉터리를 무시하면 해당 콘텐츠도 모두 건너뜁니다. **기본값:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 복사할 소스 경로입니다.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 복사할 대상 경로입니다.
    - 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `boolean`으로 강제 변환될 수 있는 `Promise`가 아닌 모든 값입니다.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 기존 파일 또는 디렉터리를 덮어씁니다. 이 값을 false로 설정하고 대상이 존재하면 복사 작업에서 오류를 무시합니다. 이 동작을 변경하려면 `errorOnExist` 옵션을 사용하세요. **기본값:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사 작업에 대한 수정자입니다. **기본값:** `0`. [`fs.copyFileSync()`](/ko/nodejs/api/fs#fscopyfilesyncsrc-dest-mode)의 `mode` 플래그를 참조하세요.
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `src`의 타임스탬프가 보존됩니다. **기본값:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 디렉터리를 재귀적으로 복사합니다. **기본값:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 심볼릭 링크의 경로 확인이 건너뜁니다. **기본값:** `false`

`src`에서 `dest`로 하위 디렉터리 및 파일을 포함한 전체 디렉터리 구조를 동기적으로 복사합니다.

디렉터리를 다른 디렉터리로 복사할 때 glob은 지원되지 않으며 동작은 `cp dir1/ dir2/`와 유사합니다.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

경로가 존재하면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.exists()`](/ko/nodejs/api/fs#fsexistspath-callback)의 설명서를 참조하십시오.

`fs.exists()`는 더 이상 사용되지 않지만 `fs.existsSync()`는 그렇지 않습니다. `fs.exists()`에 대한 `callback` 매개변수는 다른 Node.js 콜백과 일치하지 않는 매개변수를 허용합니다. `fs.existsSync()`는 콜백을 사용하지 않습니다.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('경로가 존재합니다.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**추가됨: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

파일의 권한을 설정합니다. `undefined`를 반환합니다.

자세한 내용은 POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) 문서를 참조하십시오.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**추가됨: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 새 소유자의 사용자 ID입니다.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 새 그룹의 그룹 ID입니다.

파일의 소유자를 설정합니다. `undefined`를 반환합니다.

자세한 내용은 POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) 문서를 참조하십시오.


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**추가된 버전: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

현재 파일과 관련된 대기 중인 모든 I/O 작업을 운영 체제의 동기화된 I/O 완료 상태로 강제합니다. 자세한 내용은 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) 문서를 참조하세요. `undefined`를 반환합니다.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.5.0 | 반환되는 숫자 값이 bigint여야 하는지 여부를 지정하는 추가 `options` 객체를 허용합니다. |
| v0.1.95 | 추가된 버전: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부입니다. **기본값:** `false`.
  
 
- 반환값: [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)

파일 디스크립터에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)를 검색합니다.

자세한 내용은 POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) 문서를 참조하세요.

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**추가된 버전: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

열린 파일 디스크립터에 대한 모든 데이터를 저장 장치로 플러시하도록 요청합니다. 특정 구현은 운영 체제 및 장치에 따라 다릅니다. 자세한 내용은 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) 문서를 참조하세요. `undefined`를 반환합니다.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**추가된 버전: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`

파일 디스크립터를 자릅니다. `undefined`를 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.ftruncate()`](/ko/nodejs/api/fs#fsftruncatefd-len-callback)의 문서를 참조하세요.


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v4.1.0 | 숫자 문자열, `NaN`, `Infinity`가 이제 시간 지정자로 허용됩니다. |
| v0.4.2 | v0.4.2에 추가됨 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

[`fs.futimes()`](/ko/nodejs/api/fs#fsfutimesfd-atime-mtime-callback)의 동기 버전입니다. `undefined`를 반환합니다.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.2.0 | `withFileTypes`에 대한 지원을 옵션으로 추가합니다. |
| v22.0.0 | v22.0.0에 추가됨 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 작업 디렉터리. **기본값:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 파일/디렉터리를 필터링하는 함수. 항목을 제외하려면 `true`를 반환하고, 포함하려면 `false`를 반환합니다. **기본값:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) glob이 경로를 Dirent로 반환해야 하면 `true`, 그렇지 않으면 `false`입니다. **기본값:** `false`.

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 패턴과 일치하는 파일의 경로입니다.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**다음 버전부터 사용 중단됨: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

심볼릭 링크의 권한을 변경합니다. `undefined`를 반환합니다.

이 메서드는 macOS에서만 구현됩니다.

자세한 내용은 POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man/man2/lchmod.2) 문서를 참조하십시오.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.6.0 | 이 API는 더 이상 사용 중단되지 않습니다. |
| v0.4.7 | 문서에서만 사용 중단됨. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 새로운 소유자의 사용자 ID입니다.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 새로운 그룹의 그룹 ID입니다.

경로의 소유자를 설정합니다. `undefined`를 반환합니다.

자세한 내용은 POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) 문서를 참조하십시오.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**다음 버전에서 추가됨: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

`path`가 참조하는 심볼릭 링크의 파일 시스템 타임스탬프를 변경합니다. 매개변수가 올바르지 않거나 작업이 실패하면 `undefined`를 반환하거나 예외를 발생시킵니다. 이는 [`fs.lutimes()`](/ko/nodejs/api/fs#fslutimespath-atime-mtime-callback)의 동기 버전입니다.


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `existingPath` 및 `newPath` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. 현재 지원은 여전히 *실험적*입니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)

`existingPath`에서 `newPath`로 새로운 링크를 만듭니다. 자세한 내용은 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) 문서를 참조하세요. `undefined`를 반환합니다.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.3.0, v14.17.0 | 항목이 존재하지 않을 경우 예외를 발생시켜야 하는지 여부를 지정하는 `throwIfNoEntry` 옵션을 허용합니다. |
| v10.5.0 | 반환되는 숫자 값이 bigint인지 여부를 지정하기 위해 추가 `options` 객체를 허용합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.30 | 추가됨: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부. **기본값:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 파일 시스템 항목이 존재하지 않을 경우 `undefined`를 반환하는 대신 예외가 발생되는지 여부. **기본값:** `true`.

- 반환값: [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)

`path`가 참조하는 심볼릭 링크에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)를 검색합니다.

자세한 내용은 POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) 문서를 참조하세요.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v13.11.0, v12.17.0 | `recursive` 모드에서 이제 처음 생성된 경로가 반환됩니다. |
| v10.12.0 | 두 번째 인수는 이제 `recursive` 및 `mode` 속성이 있는 `options` 객체가 될 수 있습니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.21 | v0.1.21에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows에서는 지원되지 않습니다. **기본값:** `0o777`.
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

디렉터리를 동기적으로 생성합니다. `undefined`를 반환하거나, `recursive`가 `true`이면 처음 생성된 디렉터리 경로를 반환합니다. 이는 [`fs.mkdir()`](/ko/nodejs/api/fs#fsmkdirpath-options-callback)의 동기적 버전입니다.

자세한 내용은 POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) 설명서를 참조하세요.

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v20.6.0, v18.19.0 | 이제 `prefix` 매개변수가 버퍼와 URL을 허용합니다. |
| v16.5.0, v14.18.0 | 이제 `prefix` 매개변수가 빈 문자열을 허용합니다. |
| v5.10.0 | v5.10.0에 추가됨 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

생성된 디렉터리 경로를 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.mkdtemp()`](/ko/nodejs/api/fs#fsmkdtempprefix-options-callback) 설명서를 참조하세요.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` 옵션 추가. |
| v13.1.0, v12.16.0 | `bufferSize` 옵션이 도입되었습니다. |
| v12.12.0 | v12.12.0에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 디렉터리에서 읽을 때 내부적으로 버퍼링되는 디렉터리 항목 수입니다. 값이 높을수록 성능이 향상되지만 메모리 사용량이 늘어납니다. **기본값:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`


- 반환값: [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)

디렉터리를 동기적으로 엽니다. [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3)을 참조하세요.

[\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)을 생성합니다. 이 클래스에는 디렉터리에서 읽고 정리하기 위한 모든 추가 함수가 포함되어 있습니다.

`encoding` 옵션은 디렉터리를 열고 후속 읽기 작업을 수행하는 동안 `path`에 대한 인코딩을 설정합니다.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v11.1.0 | `flags` 인수는 이제 선택 사항이며 기본값은 `'r'`입니다. |
| v9.9.0 | 이제 `as` 및 `as+` 플래그가 지원됩니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v0.1.21 | v0.1.21에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `'r'`. [파일 시스템 `플래그` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하세요.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

파일 디스크립터를 나타내는 정수를 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback) 문서를 참조하세요.


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` 옵션이 추가되었습니다. |
| v10.10.0 | 새로운 옵션 `withFileTypes`가 추가되었습니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 디렉터리의 내용을 재귀적으로 읽습니다. 재귀 모드에서는 모든 파일, 하위 파일 및 디렉터리를 나열합니다. **기본값:** `false`.
  
 
- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ko/nodejs/api/fs#class-fsdirent)

디렉터리의 내용을 읽습니다.

자세한 내용은 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 문서를 참조하십시오.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 반환된 파일 이름에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환된 파일 이름이 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

`options.withFileTypes`가 `true`로 설정되면 결과에는 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 포함됩니다.


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수가 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v5.0.0 | 이제 `path` 매개변수가 파일 디스크립터일 수 있습니다. |
| v0.1.8 | 추가됨: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 이름 또는 파일 디스크립터
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'r'`.
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`path`의 내용을 반환합니다.

자세한 내용은 이 API의 비동기 버전 문서인 [`fs.readFile()`](/ko/nodejs/api/fs#fsreadfilepath-options-callback)을 참조하십시오.

`encoding` 옵션이 지정되면 이 함수는 문자열을 반환합니다. 그렇지 않으면 버퍼를 반환합니다.

[`fs.readFile()`](/ko/nodejs/api/fs#fsreadfilepath-options-callback)과 유사하게, 경로가 디렉터리인 경우 `fs.readFileSync()`의 동작은 플랫폼에 따라 다릅니다.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux 및 Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

// FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수가 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

심볼릭 링크의 문자열 값을 반환합니다.

자세한 내용은 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) 문서를 참조하십시오.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 반환된 링크 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정된 경우 반환된 링크 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.10.0 | 이제 `buffer` 매개변수가 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v6.0.0 | 이제 `length` 매개변수가 `0`이 될 수 있습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`bytesRead`의 수를 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.read()`](/ko/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)의 문서를 참조하십시오.


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.13.0, v12.17.0 | 오프셋, 길이 및 위치를 선택 사항으로 만들기 위해 옵션 객체를 전달할 수 있습니다. |
| v13.13.0, v12.17.0 | 추가됨: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
  
 
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`bytesRead`의 수를 반환합니다.

위의 `fs.readSync` 함수와 유사하게 이 버전은 선택적 `options` 객체를 사용합니다. `options` 객체가 지정되지 않은 경우 위의 값으로 기본 설정됩니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.read()`](/ko/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)의 문서를 참조하십시오.

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**추가됨: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽은 바이트 수입니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.readv()`](/ko/nodejs/api/fs#fsreadvfd-buffers-position-callback)의 문서를 참조하십시오.


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 파이프/소켓 해결 지원이 추가되었습니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v6.4.0 | 이제 Windows에서 다양한 엣지 케이스에 대해 `realpathSync` 호출이 다시 작동합니다. |
| v6.0.0 | `cache` 매개변수가 제거되었습니다. |
| v0.1.31 | 추가됨: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

해결된 경로명을 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.realpath()`](/ko/nodejs/api/fs#fsrealpathpath-options-callback)의 문서를 참조하십시오.

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**추가됨: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

동기식 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

UTF8 문자열로 변환할 수 있는 경로만 지원됩니다.

선택적 `options` 인수는 인코딩을 지정하는 문자열이거나 반환된 경로에 사용할 문자 인코딩을 지정하는 `encoding` 속성이 있는 객체일 수 있습니다. `encoding`이 `'buffer'`로 설정되면 반환된 경로는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 객체로 전달됩니다.

Linux에서 Node.js가 musl libc에 연결된 경우 이 함수가 작동하려면 procfs 파일 시스템이 `/proc`에 마운트되어야 합니다. Glibc에는 이러한 제한이 없습니다.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `oldPath` 및 `newPath` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. 현재는 여전히 *실험적*입니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)

파일 이름을 `oldPath`에서 `newPath`로 바꿉니다. `undefined`를 반환합니다.

자세한 내용은 POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) 문서를 참조하십시오.

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 파일인 `path`에서 `fs.rmdirSync(path, { recursive: true })`를 사용하는 것은 더 이상 허용되지 않으며 Windows에서는 `ENOENT` 오류가 발생하고 POSIX에서는 `ENOTDIR` 오류가 발생합니다. |
| v16.0.0 | 존재하지 않는 `path`에서 `fs.rmdirSync(path, { recursive: true })`를 사용하는 것은 더 이상 허용되지 않으며 `ENOENT` 오류가 발생합니다. |
| v16.0.0 | `recursive` 옵션은 더 이상 사용되지 않으며 사용하면 더 이상 사용되지 않는다는 경고가 트리거됩니다. |
| v14.14.0 | `recursive` 옵션은 더 이상 사용되지 않으며 대신 `fs.rmSync`를 사용하십시오. |
| v13.3.0, v12.16.0 | `maxBusyTries` 옵션의 이름이 `maxRetries`로 변경되었고 기본값은 0입니다. `emfileWait` 옵션이 제거되었으며 `EMFILE` 오류는 다른 오류와 동일한 재시도 로직을 사용합니다. 이제 `retryDelay` 옵션이 지원됩니다. 이제 `ENFILE` 오류가 재시도됩니다. |
| v12.10.0 | 이제 `recursive`, `maxBusyTries` 및 `emfileWait` 옵션이 지원됩니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` 또는 `EPERM` 오류가 발생하면 Node.js는 각 시도마다 `retryDelay` 밀리초만큼 더 긴 선형 백오프 대기 시간으로 작업을 재시도합니다. 이 옵션은 재시도 횟수를 나타냅니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 재귀적 디렉터리 제거를 수행합니다. 재귀 모드에서는 실패 시 작업이 재시도됩니다. **기본값:** `false`. **더 이상 사용되지 않습니다.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재시도 간에 대기하는 시간(밀리초)입니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `100`.

동기식 [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). `undefined`를 반환합니다.

파일(디렉터리가 아님)에서 `fs.rmdirSync()`를 사용하면 Windows에서는 `ENOENT` 오류가 발생하고 POSIX에서는 `ENOTDIR` 오류가 발생합니다.

`rm -rf` Unix 명령과 유사한 동작을 얻으려면 옵션 `{ recursive: true, force: true }`를 사용하여 [`fs.rmSync()`](/ko/nodejs/api/fs#fsrmsyncpath-options)를 사용하십시오.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.3.0, v16.14.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v14.14.0 | 추가됨: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `path`가 존재하지 않으면 예외가 무시됩니다. **기본값:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` 또는 `EPERM` 오류가 발생하면 Node.js는 각 시도마다 `retryDelay` 밀리초 더 길게 선형 백오프 대기 시간을 사용하여 작업을 재시도합니다. 이 옵션은 재시도 횟수를 나타냅니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 재귀 디렉터리 제거를 수행합니다. 재귀 모드에서 작업은 실패 시 재시도됩니다. **기본값:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 재시도 간에 대기하는 시간(밀리초)입니다. `recursive` 옵션이 `true`가 아니면 이 옵션은 무시됩니다. **기본값:** `100`.

표준 POSIX `rm` 유틸리티를 모델로 하여 파일 및 디렉터리를 동기적으로 제거합니다. `undefined`를 반환합니다.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.3.0, v14.17.0 | 항목이 존재하지 않을 경우 예외를 발생시킬지 여부를 지정하는 `throwIfNoEntry` 옵션을 허용합니다. |
| v10.5.0 | 반환되는 숫자 값이 bigint인지 여부를 지정하는 추가 `options` 객체를 허용합니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 숫자 값이 `bigint`여야 하는지 여부입니다. **기본값:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 파일 시스템 항목이 존재하지 않을 경우 `undefined`를 반환하는 대신 예외가 발생할지 여부입니다. **기본값:** `true`.

- 반환: [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)

경로에 대한 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats)를 검색합니다.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**추가된 버전: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반환된 [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs) 객체의 숫자 값이 `bigint`여야 하는지 여부. **기본값:** `false`.
  
 
- 반환값: [\<fs.StatFs\>](/ko/nodejs/api/fs#class-fsstatfs)

동기식 [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). `path`를 포함하는 마운트된 파일 시스템에 대한 정보를 반환합니다.

오류가 발생하면 `err.code`는 [일반 시스템 오류](/ko/nodejs/api/errors#common-system-errors) 중 하나가 됩니다.

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | `type` 인수가 정의되지 않은 경우 Node는 `target` 유형을 자동으로 감지하고 `dir` 또는 `file`을 자동으로 선택합니다. |
| v7.6.0 | `target` 및 `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. 현재 지원은 여전히 *실험적*입니다. |
| v0.1.31 | 추가된 버전: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`

반환값: `undefined`.

자세한 내용은 이 API의 비동기 버전인 [`fs.symlink()`](/ko/nodejs/api/fs#fssymlinktarget-path-type-callback) 문서를 참조하세요.


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**추가된 버전: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`

파일을 자릅니다. `undefined`를 반환합니다. 파일 디스크립터 또한 첫 번째 인수로 전달될 수 있습니다. 이 경우, `fs.ftruncateSync()`가 호출됩니다.

파일 디스크립터를 전달하는 것은 더 이상 사용되지 않으며, 향후 오류가 발생할 수 있습니다.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v0.1.21 | 추가된 버전: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)

동기식 [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2). `undefined`를 반환합니다.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` 및 `-Infinity`는 더 이상 유효한 시간 지정자가 아닙니다. |
| v7.6.0 | `path` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v4.1.0 | 숫자 문자열, `NaN` 및 `Infinity`가 이제 허용되는 시간 지정자입니다. |
| v0.4.2 | 추가된 버전: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

`undefined`를 반환합니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.utimes()`](/ko/nodejs/api/fs#fsutimespath-atime-mtime-callback)의 문서를 참조하세요.


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0, v20.10.0 | `flush` 옵션이 지원됩니다. |
| v19.0.0 | 자체 `toString` 함수가 있는 객체를 `data` 매개변수에 전달하는 것이 더 이상 지원되지 않습니다. |
| v17.8.0 | 자체 `toString` 함수가 있는 객체를 `data` 매개변수에 전달하는 것은 더 이상 사용되지 않습니다. |
| v14.12.0 | `data` 매개변수는 명시적인 `toString` 함수가 있는 객체를 문자열화합니다. |
| v14.0.0 | `data` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.10.0 | 이제 `data` 매개변수는 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v7.4.0 | 이제 `data` 매개변수는 `Uint8Array`가 될 수 있습니다. |
| v5.0.0 | 이제 `file` 매개변수는 파일 설명자가 될 수 있습니다. |
| v0.1.29 | 추가됨: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 이름 또는 파일 설명자
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [파일 시스템 `flags` 지원](/ko/nodejs/api/fs#file-system-flags)을 참조하십시오. **기본값:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모든 데이터가 파일에 성공적으로 기록되고 `flush`가 `true`인 경우, `fs.fsyncSync()`가 데이터를 플러시하는 데 사용됩니다.

반환값: `undefined`.

`mode` 옵션은 새로 생성된 파일에만 영향을 줍니다. 자세한 내용은 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback)을 참조하십시오.

자세한 내용은 이 API의 비동기 버전인 [`fs.writeFile()`](/ko/nodejs/api/fs#fswritefilefile-data-options-callback)의 문서를 참조하십시오.


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `buffer` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v10.10.0 | `buffer` 매개변수는 이제 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v7.4.0 | `buffer` 매개변수는 이제 `Uint8Array`가 될 수 있습니다. |
| v7.2.0 | `offset` 및 `length` 매개변수는 이제 선택 사항입니다. |
| v0.1.21 | Added in: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수입니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.write(fd, buffer...)`](/ko/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback) 문서를 참조하십시오.

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Added in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `null`
  
 
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수입니다.

자세한 내용은 이 API의 비동기 버전인 [`fs.write(fd, buffer...)`](/ko/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback) 문서를 참조하십시오.


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | `string` 매개변수는 더 이상 지원되지 않는 입력을 문자열로 강제 변환하지 않습니다. |
| v7.2.0 | `position` 매개변수는 이제 선택 사항입니다. |
| v0.11.5 | 추가됨: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수.

자세한 내용은 이 API의 비동기 버전 설명서를 참조하십시오. [`fs.write(fd, string...)`](/ko/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**추가됨: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수.

자세한 내용은 이 API의 비동기 버전 설명서를 참조하십시오. [`fs.writev()`](/ko/nodejs/api/fs#fswritevfd-buffers-position-callback).

## 공통 객체 {#common-objects}

공통 객체는 모든 파일 시스템 API 변형 (프로미스, 콜백 및 동기)에서 공유됩니다.


### 클래스: `fs.Dir` {#class-fsdir}

**추가된 버전: v12.12.0**

디렉터리 스트림을 나타내는 클래스입니다.

[`fs.opendir()`](/ko/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/ko/nodejs/api/fs#fsopendirsyncpath-options) 또는 [`fsPromises.opendir()`](/ko/nodejs/api/fs#fspromisesopendirpath-options)에 의해 생성됩니다.

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
비동기 이터레이터를 사용하면 [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir) 객체가 이터레이터가 종료된 후 자동으로 닫힙니다.

#### `dir.close()` {#dirclose}

**추가된 버전: v12.12.0**

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

디렉터리의 기본 리소스 핸들을 비동기적으로 닫습니다. 이후 읽기는 오류를 발생시킵니다.

리소스가 닫힌 후 완료될 Promise가 반환됩니다.

#### `dir.close(callback)` {#dirclosecallback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.12.0 | 추가된 버전: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

디렉터리의 기본 리소스 핸들을 비동기적으로 닫습니다. 이후 읽기는 오류를 발생시킵니다.

리소스 핸들이 닫힌 후 `callback`이 호출됩니다.

#### `dir.closeSync()` {#dirclosesync}

**추가된 버전: v12.12.0**

디렉터리의 기본 리소스 핸들을 동기적으로 닫습니다. 이후 읽기는 오류를 발생시킵니다.

#### `dir.path` {#dirpath}

**추가된 버전: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`fs.opendir()`](/ko/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/ko/nodejs/api/fs#fsopendirsyncpath-options) 또는 [`fsPromises.opendir()`](/ko/nodejs/api/fs#fspromisesopendirpath-options)에 제공된 이 디렉터리의 읽기 전용 경로입니다.


#### `dir.read()` {#dirread}

**Added in: v12.12.0**

- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)로 이행 | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)로 이행

비동기적으로 [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)을 통해 다음 디렉터리 항목을 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)로 읽습니다.

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)로 이행될 Promise가 반환되거나, 읽을 디렉터리 항목이 더 이상 없으면 `null`이 반환됩니다.

이 함수에서 반환된 디렉터리 항목은 운영 체제의 기본 디렉터리 메커니즘에서 제공하는 순서와 관계없이 반환됩니다. 디렉터리를 반복하는 동안 추가되거나 제거된 항목은 반복 결과에 포함되지 않을 수 있습니다.

#### `dir.read(callback)` {#dirreadcallback}

**Added in: v12.12.0**

- `callback` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<오류\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

비동기적으로 [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)을 통해 다음 디렉터리 항목을 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)로 읽습니다.

읽기가 완료된 후 `callback`은 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)로 호출되거나, 읽을 디렉터리 항목이 더 이상 없으면 `null`로 호출됩니다.

이 함수에서 반환된 디렉터리 항목은 운영 체제의 기본 디렉터리 메커니즘에서 제공하는 순서와 관계없이 반환됩니다. 디렉터리를 반복하는 동안 추가되거나 제거된 항목은 반복 결과에 포함되지 않을 수 있습니다.

#### `dir.readSync()` {#dirreadsync}

**Added in: v12.12.0**

- 반환값: [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

동기적으로 다음 디렉터리 항목을 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)로 읽습니다. 자세한 내용은 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 문서를 참조하십시오.

읽을 디렉터리 항목이 더 이상 없으면 `null`이 반환됩니다.

이 함수에서 반환된 디렉터리 항목은 운영 체제의 기본 디렉터리 메커니즘에서 제공하는 순서와 관계없이 반환됩니다. 디렉터리를 반복하는 동안 추가되거나 제거된 항목은 반복 결과에 포함되지 않을 수 있습니다.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Added in: v12.12.0**

- 반환값: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)의 AsyncIterator

모든 항목을 읽을 때까지 디렉터리를 비동기적으로 반복합니다. 자세한 내용은 POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) 문서를 참조하세요.

async iterator에서 반환된 항목은 항상 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent)입니다. `dir.read()`의 `null` 케이스는 내부적으로 처리됩니다.

예제는 [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)을 참조하세요.

이 iterator에서 반환된 디렉터리 항목은 운영 체제의 기본 디렉터리 메커니즘에 의해 제공되는 특정 순서가 없습니다. 디렉터리를 반복하는 동안 추가되거나 제거된 항목은 반복 결과에 포함되지 않을 수 있습니다.

### Class: `fs.Dirent` {#class-fsdirent}

**Added in: v10.10.0**

디렉터리 항목의 표현으로, [\<fs.Dir\>](/ko/nodejs/api/fs#class-fsdir)에서 읽어 반환될 수 있는 디렉터리 내의 파일 또는 하위 디렉터리일 수 있습니다. 디렉터리 항목은 파일 이름과 파일 유형 쌍의 조합입니다.

또한 [`fs.readdir()`](/ko/nodejs/api/fs#fsreaddirpath-options-callback) 또는 [`fs.readdirSync()`](/ko/nodejs/api/fs#fsreaddirsyncpath-options)가 `withFileTypes` 옵션을 `true`로 설정하여 호출되면 결과 배열은 문자열 또는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 대신 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체로 채워집니다.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Added in: v10.10.0**

- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 블록 장치를 설명하면 `true`를 반환합니다.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Added in: v10.10.0**

- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 문자 장치를 설명하면 `true`를 반환합니다.


#### `dirent.isDirectory()` {#direntisdirectory}

**추가된 버전: v10.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 파일 시스템 디렉터리를 설명하는 경우 `true`를 반환합니다.

#### `dirent.isFIFO()` {#direntisfifo}

**추가된 버전: v10.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 FIFO(선입선출) 파이프를 설명하는 경우 `true`를 반환합니다.

#### `dirent.isFile()` {#direntisfile}

**추가된 버전: v10.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 일반 파일을 설명하는 경우 `true`를 반환합니다.

#### `dirent.isSocket()` {#direntissocket}

**추가된 버전: v10.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 소켓을 설명하는 경우 `true`를 반환합니다.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**추가된 버전: v10.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 심볼릭 링크를 설명하는 경우 `true`를 반환합니다.

#### `dirent.name` {#direntname}

**추가된 버전: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

이 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 참조하는 파일 이름입니다. 이 값의 유형은 [`fs.readdir()`](/ko/nodejs/api/fs#fsreaddirpath-options-callback) 또는 [`fs.readdirSync()`](/ko/nodejs/api/fs#fsreaddirsyncpath-options)에 전달된 `options.encoding`에 따라 결정됩니다.

#### `dirent.parentPath` {#direntparentpath}

**추가된 버전: v21.4.0, v20.12.0, v18.20.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 [\<fs.Dirent\>](/ko/nodejs/api/fs#class-fsdirent) 객체가 참조하는 파일의 상위 디렉터리 경로입니다.


#### `dirent.path` {#direntpath}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.2.0 | 속성이 더 이상 읽기 전용이 아닙니다. |
| v23.0.0 | 이 속성에 액세스하면 경고가 발생합니다. 이제 읽기 전용입니다. |
| v21.5.0, v20.12.0, v18.20.0 | 사용 중단: v21.5.0, v20.12.0, v18.20.0 이후 |
| v20.1.0, v18.17.0 | 추가됨: v20.1.0, v18.17.0 |
:::

::: danger [안정성: 0 - 사용 중단]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단: 대신 [`dirent.parentPath`](/ko/nodejs/api/fs#direntparentpath)를 사용하세요.
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`dirent.parentPath`의 별칭입니다.

### 클래스: `fs.FSWatcher` {#class-fsfswatcher}

**추가됨: v0.5.8**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

[`fs.watch()`](/ko/nodejs/api/fs#fswatchfilename-options-listener) 메서드에 대한 성공적인 호출은 새로운 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체를 반환합니다.

모든 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체는 특정 감시 파일이 수정될 때마다 `'change'` 이벤트를 발생시킵니다.

#### 이벤트: `'change'` {#event-change}

**추가됨: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 발생한 변경 이벤트 유형
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 변경된 파일 이름(관련/사용 가능한 경우)

감시 디렉터리 또는 파일에서 무언가가 변경될 때 발생합니다. [`fs.watch()`](/ko/nodejs/api/fs#fswatchfilename-options-listener)에서 자세한 내용을 확인하세요.

`filename` 인수는 운영 체제 지원에 따라 제공되지 않을 수 있습니다. `filename`이 제공되는 경우 `fs.watch()`가 `encoding` 옵션을 `'buffer'`로 설정하여 호출되면 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)로 제공되고, 그렇지 않으면 `filename`은 UTF-8 문자열이 됩니다.

```js [ESM]
import { watch } from 'node:fs';
// fs.watch() 리스너를 통해 처리되는 경우의 예
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // 출력: <Buffer ...>
  }
});
```

#### 이벤트: `'close'` {#event-close_1}

**추가된 버전: v10.0.0**

감시자가 변경 사항 감시를 중단할 때 발생합니다. 닫힌 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체는 이벤트 핸들러에서 더 이상 사용할 수 없습니다.

#### 이벤트: `'error'` {#event-error}

**추가된 버전: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)

파일을 감시하는 동안 오류가 발생하면 발생합니다. 오류가 발생한 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체는 이벤트 핸들러에서 더 이상 사용할 수 없습니다.

#### `watcher.close()` {#watcherclose}

**추가된 버전: v0.5.8**

지정된 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)에서 변경 사항 감시를 중단합니다. 중단되면 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체는 더 이상 사용할 수 없습니다.

#### `watcher.ref()` {#watcherref}

**추가된 버전: v14.3.0, v12.20.0**

- 반환: [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)

호출되면 Node.js 이벤트 루프가 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)가 활성 상태인 동안에는 종료되지 않도록 요청합니다. `watcher.ref()`를 여러 번 호출해도 아무런 효과가 없습니다.

기본적으로 모든 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체는 "ref'ed"되므로 일반적으로 `watcher.unref()`가 이전에 호출되지 않은 한 `watcher.ref()`를 호출할 필요가 없습니다.

#### `watcher.unref()` {#watcherunref}

**추가된 버전: v14.3.0, v12.20.0**

- 반환: [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher)

호출되면 활성 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체는 Node.js 이벤트 루프가 활성 상태를 유지하도록 요구하지 않습니다. 이벤트 루프를 계속 실행하는 다른 활동이 없으면 [\<fs.FSWatcher\>](/ko/nodejs/api/fs#class-fsfswatcher) 객체의 콜백이 호출되기 전에 프로세스가 종료될 수 있습니다. `watcher.unref()`를 여러 번 호출해도 아무런 효과가 없습니다.

### 클래스: `fs.StatWatcher` {#class-fsstatwatcher}

**추가된 버전: v14.3.0, v12.20.0**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`fs.watchFile()` 메서드를 성공적으로 호출하면 새로운 [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher) 객체가 반환됩니다.

#### `watcher.ref()` {#watcherref_1}

**추가된 버전: v14.3.0, v12.20.0**

- 반환: [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher)

호출되면 Node.js 이벤트 루프가 [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher)가 활성 상태인 동안에는 종료되지 않도록 요청합니다. `watcher.ref()`를 여러 번 호출해도 아무런 효과가 없습니다.

기본적으로 모든 [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher) 객체는 "ref'ed"되므로 일반적으로 `watcher.unref()`가 이전에 호출되지 않은 한 `watcher.ref()`를 호출할 필요가 없습니다.


#### `watcher.unref()` {#watcherunref_1}

**추가된 버전: v14.3.0, v12.20.0**

- 반환값: [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher)

호출되면 활성 [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher) 객체는 Node.js 이벤트 루프가 활성 상태를 유지하는 데 필요하지 않습니다. 이벤트 루프를 계속 실행하는 다른 활동이 없으면 [\<fs.StatWatcher\>](/ko/nodejs/api/fs#class-fsstatwatcher) 객체의 콜백이 호출되기 전에 프로세스가 종료될 수 있습니다. `watcher.unref()`를 여러 번 호출해도 아무런 효과가 없습니다.

### 클래스: `fs.ReadStream` {#class-fsreadstream}

**추가된 버전: v0.1.93**

- 확장: [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)

[\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)의 인스턴스는 [`fs.createReadStream()`](/ko/nodejs/api/fs#fscreatereadstreampath-options) 함수를 사용하여 생성되고 반환됩니다.

#### 이벤트: `'close'` {#event-close_2}

**추가된 버전: v0.1.93**

[\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)의 기본 파일 디스크립터가 닫힐 때 발생합니다.

#### 이벤트: `'open'` {#event-open}

**추가된 버전: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)에서 사용하는 정수 파일 디스크립터입니다.

[\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)의 파일 디스크립터가 열릴 때 발생합니다.

#### 이벤트: `'ready'` {#event-ready}

**추가된 버전: v9.11.0**

[\<fs.ReadStream\>](/ko/nodejs/api/fs#class-fsreadstream)를 사용할 준비가 되면 발생합니다.

`'open'` 직후에 발생합니다.

#### `readStream.bytesRead` {#readstreambytesread}

**추가된 버전: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지금까지 읽은 바이트 수입니다.

#### `readStream.path` {#readstreampath}

**추가된 버전: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

스트림이 읽고 있는 파일의 경로로, `fs.createReadStream()`의 첫 번째 인수로 지정됩니다. `path`가 문자열로 전달되면 `readStream.path`는 문자열이 됩니다. `path`가 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)로 전달되면 `readStream.path`는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)가 됩니다. `fd`가 지정되면 `readStream.path`는 `undefined`가 됩니다.


#### `readStream.pending` {#readstreampending}

**추가된 버전: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

기본 파일이 아직 열리지 않았으면 이 속성은 `true`입니다. 즉, `'ready'` 이벤트가 발생하기 전입니다.

### Class: `fs.Stats` {#class-fsstats}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 공용 생성자는 더 이상 사용되지 않습니다. |
| v8.1.0 | 시간을 숫자로 추가했습니다. |
| v0.1.21 | 추가된 버전: v0.1.21 |
:::

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체는 파일에 대한 정보를 제공합니다.

[`fs.stat()`](/ko/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/ko/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/ko/nodejs/api/fs#fsfstatfd-options-callback) 및 동기 대응 항목에서 반환된 객체는 이 유형입니다. 이러한 메서드에 전달된 `options`의 `bigint`가 true이면 숫자 값은 `number` 대신 `bigint`가 되고 객체에는 `Ns` 접미사가 붙은 추가 나노초 정밀도 속성이 포함됩니다. `Stat` 객체는 `new` 키워드를 사용하여 직접 생성할 수 없습니다.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
`bigint` 버전:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 블록 장치를 설명하는 경우 `true`를 반환합니다.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 문자 장치를 설명하는 경우 `true`를 반환합니다.

#### `stats.isDirectory()` {#statsisdirectory}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 파일 시스템 디렉터리를 설명하는 경우 `true`를 반환합니다.

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 디렉터리로 해석되는 심볼릭 링크에 대해 [`fs.lstat()`](/ko/nodejs/api/fs#fslstatpath-options-callback)를 호출하여 얻은 경우, 이 메서드는 `false`를 반환합니다. 이는 [`fs.lstat()`](/ko/nodejs/api/fs#fslstatpath-options-callback)가 해석되는 경로가 아닌 심볼릭 링크 자체에 대한 정보를 반환하기 때문입니다.

#### `stats.isFIFO()` {#statsisfifo}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 선입선출 (FIFO) 파이프를 설명하는 경우 `true`를 반환합니다.

#### `stats.isFile()` {#statsisfile}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 일반 파일을 설명하는 경우 `true`를 반환합니다.

#### `stats.isSocket()` {#statsissocket}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 소켓을 설명하는 경우 `true`를 반환합니다.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Added in: v0.1.10**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체가 심볼릭 링크를 설명하는 경우 `true`를 반환합니다.

이 메서드는 [`fs.lstat()`](/ko/nodejs/api/fs#fslstatpath-options-callback)를 사용하는 경우에만 유효합니다.


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일이 포함된 장치의 숫자 식별자입니다.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 시스템 특정 파일의 "Inode" 번호입니다.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 유형 및 모드를 설명하는 비트 필드입니다.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일에 존재하는 하드 링크 수입니다.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 소유자인 사용자의 숫자 사용자 식별자입니다(POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 소유자인 그룹의 숫자 그룹 식별자입니다(POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일이 장치를 나타내는 경우의 숫자 장치 식별자입니다.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 크기(바이트)입니다.

기본 파일 시스템에서 파일 크기 가져오기를 지원하지 않으면 `0`입니다.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

i/o 작업을 위한 파일 시스템 블록 크기입니다.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

이 파일에 할당된 블록 수입니다.

#### `stats.atimeMs` {#statsatimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

POSIX 에포크 이후 밀리초 단위로 표현된 이 파일에 마지막으로 액세스한 시간을 나타내는 타임스탬프입니다.

#### `stats.mtimeMs` {#statsmtimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

POSIX 에포크 이후 밀리초 단위로 표현된 이 파일이 마지막으로 수정된 시간을 나타내는 타임스탬프입니다.

#### `stats.ctimeMs` {#statsctimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

POSIX 에포크 이후 밀리초 단위로 표현된 파일 상태가 마지막으로 변경된 시간을 나타내는 타임스탬프입니다.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

POSIX 에포크 이후 밀리초 단위로 표현된 이 파일의 생성 시간을 나타내는 타임스탬프입니다.

#### `stats.atimeNs` {#statsatimens}

**Added in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

객체를 생성하는 메서드에 `bigint: true`가 전달된 경우에만 존재합니다. POSIX Epoch 이후 나노초 단위로 표현된 이 파일에 마지막으로 액세스한 시간을 나타내는 타임스탬프입니다.


#### `stats.mtimeNs` {#statsmtimens}

**추가된 버전: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

객체를 생성하는 메서드에 `bigint: true`가 전달된 경우에만 존재합니다. 이 파일이 마지막으로 수정된 시간을 POSIX Epoch 이후 나노초로 표현한 타임스탬프입니다.

#### `stats.ctimeNs` {#statsctimens}

**추가된 버전: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

객체를 생성하는 메서드에 `bigint: true`가 전달된 경우에만 존재합니다. 파일 상태가 마지막으로 변경된 시간을 POSIX Epoch 이후 나노초로 표현한 타임스탬프입니다.

#### `stats.birthtimeNs` {#statsbirthtimens}

**추가된 버전: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

객체를 생성하는 메서드에 `bigint: true`가 전달된 경우에만 존재합니다. 이 파일의 생성 시간을 POSIX Epoch 이후 나노초로 표현한 타임스탬프입니다.

#### `stats.atime` {#statsatime}

**추가된 버전: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

이 파일에 마지막으로 액세스한 시간을 나타내는 타임스탬프입니다.

#### `stats.mtime` {#statsmtime}

**추가된 버전: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

이 파일이 마지막으로 수정된 시간을 나타내는 타임스탬프입니다.

#### `stats.ctime` {#statsctime}

**추가된 버전: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

파일 상태가 마지막으로 변경된 시간을 나타내는 타임스탬프입니다.

#### `stats.birthtime` {#statsbirthtime}

**추가된 버전: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

이 파일의 생성 시간을 나타내는 타임스탬프입니다.

#### Stat 시간 값 {#stat-time-values}

`atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` 속성은 해당 시간을 밀리초 단위로 보유하는 숫자 값입니다. 해당 정밀도는 플랫폼에 따라 다릅니다. 객체를 생성하는 메서드에 `bigint: true`가 전달되면 속성은 [bigint](https://tc39.github.io/proposal-bigint)가 되고, 그렇지 않으면 [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)가 됩니다.

`atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` 속성은 해당 시간을 나노초 단위로 보유하는 [bigint](https://tc39.github.io/proposal-bigint)입니다. 객체를 생성하는 메서드에 `bigint: true`가 전달된 경우에만 존재합니다. 해당 정밀도는 플랫폼에 따라 다릅니다.

`atime`, `mtime`, `ctime`, `birthtime`은 다양한 시간의 [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 객체 대체 표현입니다. `Date` 및 숫자 값은 연결되지 않습니다. 새 숫자 값을 할당하거나 `Date` 값을 변경해도 해당 대체 표현에 반영되지 않습니다.

stat 객체의 시간은 다음과 같은 의미를 갖습니다.

- `atime` "액세스 시간": 파일 데이터가 마지막으로 액세스된 시간입니다. [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) 및 [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) 시스템 호출에 의해 변경됩니다.
- `mtime` "수정 시간": 파일 데이터가 마지막으로 수정된 시간입니다. [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) 및 [`write(2)`](http://man7.org/linux/man-pages/man2/write.2) 시스템 호출에 의해 변경됩니다.
- `ctime` "변경 시간": 파일 상태가 마지막으로 변경된 시간(inode 데이터 수정)입니다. [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) 및 [`write(2)`](http://man7.org/linux/man-pages/man2/write.2) 시스템 호출에 의해 변경됩니다.
- `birthtime` "생성 시간": 파일 생성 시간입니다. 파일이 생성될 때 한 번 설정됩니다. birthtime을 사용할 수 없는 파일 시스템에서는 이 필드 대신 `ctime` 또는 `1970-01-01T00:00Z`(예: Unix epoch 타임스탬프 `0`)를 보유할 수 있습니다. 이 경우 이 값은 `atime` 또는 `mtime`보다 클 수 있습니다. Darwin 및 기타 FreeBSD 변형에서는 [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) 시스템 호출을 사용하여 `atime`이 현재 `birthtime`보다 이전 값으로 명시적으로 설정된 경우에도 설정됩니다.

Node.js 0.12 이전에는 `ctime`이 Windows 시스템에서 `birthtime`을 보유했습니다. 0.12부터 `ctime`은 "생성 시간"이 아니며 Unix 시스템에서는 결코 그렇지 않았습니다.


### 클래스: `fs.StatFs` {#class-fsstatfs}

**추가된 버전: v19.6.0, v18.15.0**

마운트된 파일 시스템에 대한 정보를 제공합니다.

[`fs.statfs()`](/ko/nodejs/api/fs#fsstatfspath-options-callback) 및 동기식 대응 항목에서 반환된 객체는 이 유형입니다. 이러한 메서드에 전달된 `options`의 `bigint`가 `true`이면 숫자 값은 `number` 대신 `bigint`가 됩니다.

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
`bigint` 버전:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

권한이 없는 사용자가 사용할 수 있는 여유 블록입니다.

#### `statfs.bfree` {#statfsbfree}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 시스템의 여유 블록입니다.

#### `statfs.blocks` {#statfsblocks}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 시스템의 총 데이터 블록입니다.

#### `statfs.bsize` {#statfsbsize}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

최적의 전송 블록 크기입니다.

#### `statfs.ffree` {#statfsffree}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 시스템의 여유 파일 노드입니다.


#### `statfs.files` {#statfsfiles}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 시스템 내 총 파일 노드 수입니다.

#### `statfs.type` {#statfstype}

**추가된 버전: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

파일 시스템의 유형입니다.

### Class: `fs.WriteStream` {#class-fswritestream}

**추가된 버전: v0.1.93**

- Extends [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)

[\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream) 인스턴스는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options) 함수를 사용하여 생성되고 반환됩니다.

#### Event: `'close'` {#event-close_3}

**추가된 버전: v0.1.93**

[\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)의 기본 파일 디스크립터가 닫힐 때 발생합니다.

#### Event: `'open'` {#event-open_1}

**추가된 버전: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)에서 사용하는 정수 파일 디스크립터입니다.

[\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)의 파일이 열릴 때 발생합니다.

#### Event: `'ready'` {#event-ready_1}

**추가된 버전: v9.11.0**

[\<fs.WriteStream\>](/ko/nodejs/api/fs#class-fswritestream)을 사용할 준비가 되면 발생합니다.

`'open'` 직후에 발생합니다.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**추가된 버전: v0.4.7**

지금까지 기록된 바이트 수입니다. 쓰기를 위해 대기열에 있는 데이터는 포함하지 않습니다.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**추가된 버전: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

`writeStream`을 닫습니다. 선택적으로 `writeStream`이 닫히면 실행될 콜백을 허용합니다.


#### `writeStream.path` {#writestreampath}

**Added in: v0.1.93**

`writeStream.path`는 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options)의 첫 번째 인수로 지정된 스트림이 쓰고 있는 파일의 경로입니다. `path`가 문자열로 전달되면 `writeStream.path`는 문자열이 됩니다. `path`가 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)로 전달되면 `writeStream.path`는 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)가 됩니다.

#### `writeStream.pending` {#writestreampending}

**Added in: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 속성은 기본 파일이 아직 열리지 않았는지 여부, 즉 `'ready'` 이벤트가 발생하기 전에 `true`입니다.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

파일 시스템 작업에 일반적으로 사용되는 상수를 포함하는 객체를 반환합니다.

#### FS 상수 {#fs-constants}

다음 상수는 `fs.constants` 및 `fsPromises.constants`에서 내보냅니다.

모든 운영 체제에서 모든 상수를 사용할 수 있는 것은 아닙니다. 이는 Windows의 경우 특히 중요한데, 많은 POSIX 특정 정의를 사용할 수 없기 때문입니다. 이식 가능한 애플리케이션의 경우 사용하기 전에 존재 여부를 확인하는 것이 좋습니다.

둘 이상의 상수를 사용하려면 비트 OR `|` 연산자를 사용하세요.

예:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### 파일 액세스 상수 {#file-access-constants}

다음 상수는 [`fsPromises.access()`](/ko/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/ko/nodejs/api/fs#fsaccesspath-mode-callback) 및 [`fs.accessSync()`](/ko/nodejs/api/fs#fsaccesssyncpath-mode)에 전달되는 `mode` 매개변수로 사용하기 위한 것입니다.

| 상수 | 설명 |
| --- | --- |
| `F_OK` | 파일이 호출 프로세스에 표시됨을 나타내는 플래그입니다. 이는 파일 존재 여부를 확인하는 데 유용하지만   `rwx`   권한에 대해서는 아무 것도 알려주지 않습니다. 모드가 지정되지 않은 경우 기본값입니다. |
| `R_OK` | 파일이 호출 프로세스에서 읽을 수 있음을 나타내는 플래그입니다. |
| `W_OK` | 파일이 호출 프로세스에서 쓸 수 있음을 나타내는 플래그입니다. |
| `X_OK` | 파일이 호출 프로세스에서 실행될 수 있음을 나타내는 플래그입니다. 이는 Windows에서는 효과가 없습니다   ( `fs.constants.F_OK`  와 같이 작동함). |

정의는 Windows에서도 사용할 수 있습니다.


##### 파일 복사 상수 {#file-copy-constants}

다음 상수는 [`fs.copyFile()`](/ko/nodejs/api/fs#fscopyfilesrc-dest-mode-callback)과 함께 사용하기 위한 것입니다.

| 상수 | 설명 |
| --- | --- |
| `COPYFILE_EXCL` | 이 값이 있으면 대상 경로가 이미 존재하는 경우 복사 작업이 오류와 함께 실패합니다. |
| `COPYFILE_FICLONE` | 이 값이 있으면 복사 작업에서 copy-on-write reflink 생성을 시도합니다. 기본 플랫폼에서 copy-on-write를 지원하지 않는 경우 대체 복사 메커니즘이 사용됩니다. |
| `COPYFILE_FICLONE_FORCE` | 이 값이 있으면 복사 작업에서 copy-on-write reflink 생성을 시도합니다. 기본 플랫폼에서 copy-on-write를 지원하지 않는 경우 작업이 오류와 함께 실패합니다. |

이러한 정의는 Windows에서도 사용할 수 있습니다.

##### 파일 열기 상수 {#file-open-constants}

다음 상수는 `fs.open()`과 함께 사용하기 위한 것입니다.

| 상수 | 설명 |
| --- | --- |
| `O_RDONLY` | 파일을 읽기 전용으로 열도록 지정하는 플래그입니다. |
| `O_WRONLY` | 파일을 쓰기 전용으로 열도록 지정하는 플래그입니다. |
| `O_RDWR` | 파일을 읽기-쓰기로 열도록 지정하는 플래그입니다. |
| `O_CREAT` | 파일이 아직 존재하지 않는 경우 파일을 만들도록 지정하는 플래그입니다. |
| `O_EXCL` | `O_CREAT` 플래그가 설정되어 있고 파일이 이미 존재하는 경우 파일 열기가 실패하도록 지정하는 플래그입니다. |
| `O_NOCTTY` | 경로가 터미널 장치를 식별하는 경우 경로를 열어도 해당 터미널이 프로세스의 제어 터미널이 되지 않도록 지정하는 플래그입니다(프로세스에 이미 제어 터미널이 없는 경우). |
| `O_TRUNC` | 파일이 존재하고 일반 파일이며 쓰기 액세스를 위해 파일을 성공적으로 연 경우 해당 길이가 0으로 잘리도록 지정하는 플래그입니다. |
| `O_APPEND` | 데이터가 파일의 끝에 추가되도록 지정하는 플래그입니다. |
| `O_DIRECTORY` | 경로가 디렉터리가 아닌 경우 열기가 실패하도록 지정하는 플래그입니다. |
| `O_NOATIME` | 파일 시스템에 대한 읽기 액세스로 인해 파일과 연결된 `atime` 정보가 더 이상 업데이트되지 않도록 지정하는 플래그입니다. 이 플래그는 Linux 운영 체제에서만 사용할 수 있습니다. |
| `O_NOFOLLOW` | 경로가 심볼릭 링크인 경우 열기가 실패하도록 지정하는 플래그입니다. |
| `O_SYNC` | 파일 무결성을 기다리는 쓰기 작업과 함께 동기화된 I/O를 위해 파일을 열도록 지정하는 플래그입니다. |
| `O_DSYNC` | 데이터 무결성을 기다리는 쓰기 작업과 함께 동기화된 I/O를 위해 파일을 열도록 지정하는 플래그입니다. |
| `O_SYMLINK` | 가리키는 리소스 대신 심볼릭 링크 자체를 열도록 지정하는 플래그입니다. |
| `O_DIRECT` | 설정하면 파일 I/O의 캐싱 효과를 최소화하려는 시도가 이루어집니다. |
| `O_NONBLOCK` | 가능한 경우 파일을 비차단 모드로 열도록 지정하는 플래그입니다. |
| `UV_FS_O_FILEMAP` | 설정하면 메모리 파일 매핑이 파일을 액세스하는 데 사용됩니다. 이 플래그는 Windows 운영 체제에서만 사용할 수 있습니다. 다른 운영 체제에서는 이 플래그가 무시됩니다. |

Windows에서는 `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` 및 `UV_FS_O_FILEMAP`만 사용할 수 있습니다.


##### 파일 타입 상수 {#file-type-constants}

다음 상수는 파일의 유형을 결정하기 위해 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 `mode` 속성과 함께 사용하기 위한 것입니다.

| 상수 | 설명 |
| --- | --- |
| `S_IFMT` | 파일 유형 코드를 추출하는 데 사용되는 비트 마스크입니다. |
| `S_IFREG` | 일반 파일에 대한 파일 유형 상수입니다. |
| `S_IFDIR` | 디렉터리에 대한 파일 유형 상수입니다. |
| `S_IFCHR` | 문자 지향 장치 파일에 대한 파일 유형 상수입니다. |
| `S_IFBLK` | 블록 지향 장치 파일에 대한 파일 유형 상수입니다. |
| `S_IFIFO` | FIFO/파이프에 대한 파일 유형 상수입니다. |
| `S_IFLNK` | 심볼릭 링크에 대한 파일 유형 상수입니다. |
| `S_IFSOCK` | 소켓에 대한 파일 유형 상수입니다. |
Windows에서는 `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` 및 `S_IFREG`만 사용할 수 있습니다.

##### 파일 모드 상수 {#file-mode-constants}

다음 상수는 파일에 대한 액세스 권한을 결정하기 위해 [\<fs.Stats\>](/ko/nodejs/api/fs#class-fsstats) 객체의 `mode` 속성과 함께 사용하기 위한 것입니다.

| 상수 | 설명 |
| --- | --- |
| `S_IRWXU` | 소유자가 읽고 쓰고 실행할 수 있음을 나타내는 파일 모드입니다. |
| `S_IRUSR` | 소유자가 읽을 수 있음을 나타내는 파일 모드입니다. |
| `S_IWUSR` | 소유자가 쓸 수 있음을 나타내는 파일 모드입니다. |
| `S_IXUSR` | 소유자가 실행할 수 있음을 나타내는 파일 모드입니다. |
| `S_IRWXG` | 그룹이 읽고 쓰고 실행할 수 있음을 나타내는 파일 모드입니다. |
| `S_IRGRP` | 그룹이 읽을 수 있음을 나타내는 파일 모드입니다. |
| `S_IWGRP` | 그룹이 쓸 수 있음을 나타내는 파일 모드입니다. |
| `S_IXGRP` | 그룹이 실행할 수 있음을 나타내는 파일 모드입니다. |
| `S_IRWXO` | 다른 사람이 읽고 쓰고 실행할 수 있음을 나타내는 파일 모드입니다. |
| `S_IROTH` | 다른 사람이 읽을 수 있음을 나타내는 파일 모드입니다. |
| `S_IWOTH` | 다른 사람이 쓸 수 있음을 나타내는 파일 모드입니다. |
| `S_IXOTH` | 다른 사람이 실행할 수 있음을 나타내는 파일 모드입니다. |
Windows에서는 `S_IRUSR` 및 `S_IWUSR`만 사용할 수 있습니다.

## 참고 사항 {#notes}

### 콜백 및 프로미스 기반 작업의 순서 지정 {#ordering-of-callback-and-promise-based-operations}

기본 스레드 풀에서 비동기적으로 실행되기 때문에 콜백 또는 프로미스 기반 메서드를 사용할 때 보장된 순서가 없습니다.

예를 들어 다음은 `fs.stat()` 작업이 `fs.rename()` 작업보다 먼저 완료될 수 있으므로 오류가 발생하기 쉽습니다.

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('이름 변경 완료');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`통계: ${JSON.stringify(stats)}`);
});
```
다른 항목을 호출하기 전에 먼저 결과가 나올 때까지 기다려 작업을 올바르게 정렬하는 것이 중요합니다.



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`통계: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('오류가 발생했습니다:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`통계: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('오류가 발생했습니다:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

또는 콜백 API를 사용할 때 `fs.stat()` 호출을 `fs.rename()` 작업의 콜백으로 이동합니다.



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`통계: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`통계: ${JSON.stringify(stats)}`);
  });
});
```
:::


### 파일 경로 {#file-paths}

대부분의 `fs` 작업은 문자열, [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 또는 `file:` 프로토콜을 사용하는 [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 객체 형식으로 지정될 수 있는 파일 경로를 허용합니다.

#### 문자열 경로 {#string-paths}

문자열 경로는 절대 또는 상대 파일 이름을 식별하는 UTF-8 문자 시퀀스로 해석됩니다. 상대 경로는 `process.cwd()`를 호출하여 결정된 현재 작업 디렉터리를 기준으로 확인됩니다.

POSIX에서 절대 경로를 사용하는 예:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // 파일로 작업하기
} finally {
  await fd?.close();
}
```
POSIX에서 상대 경로를 사용하는 예(`process.cwd()` 기준):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // 파일로 작업하기
} finally {
  await fd?.close();
}
```
#### 파일 URL 경로 {#file-url-paths}

**추가된 버전: v7.6.0**

대부분의 `node:fs` 모듈 함수의 경우 `path` 또는 `filename` 인수를 `file:` 프로토콜을 사용하는 [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 객체로 전달할 수 있습니다.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
`file:` URL은 항상 절대 경로입니다.

##### 플랫폼별 고려 사항 {#platform-specific-considerations}

Windows에서 호스트 이름이 있는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 UNC 경로로 변환되는 반면, 드라이브 문자가 있는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 로컬 절대 경로로 변환됩니다. 호스트 이름과 드라이브 문자가 없는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 오류를 발생시킵니다.

```js [ESM]
import { readFileSync } from 'node:fs';
// Windows에서:

// - 호스트 이름이 있는 WHATWG 파일 URL은 UNC 경로로 변환됩니다.
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - 드라이브 문자가 있는 WHATWG 파일 URL은 절대 경로로 변환됩니다.
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - 호스트 이름이 없는 WHATWG 파일 URL에는 드라이브 문자가 있어야 합니다.
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: 파일 URL 경로는 절대 경로여야 합니다.
```
드라이브 문자가 있는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 드라이브 문자 바로 뒤에 `:`를 구분 기호로 사용해야 합니다. 다른 구분 기호를 사용하면 오류가 발생합니다.

다른 모든 플랫폼에서 호스트 이름이 있는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 지원되지 않으며 오류를 발생시킵니다.

```js [ESM]
import { readFileSync } from 'node:fs';
// 다른 플랫폼에서:

// - 호스트 이름이 있는 WHATWG 파일 URL은 지원되지 않습니다.
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: 절대 경로여야 합니다.

// - WHATWG 파일 URL은 절대 경로로 변환됩니다.
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
인코딩된 슬래시 문자가 있는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 모든 플랫폼에서 오류를 발생시킵니다.

```js [ESM]
import { readFileSync } from 'node:fs';

// Windows에서
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: 파일 URL 경로에 인코딩된
\ 또는 / 문자가 포함되어서는 안 됩니다. */

// POSIX에서
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: 파일 URL 경로에 인코딩된
/ 문자가 포함되어서는 안 됩니다. */
```
Windows에서 인코딩된 백슬래시가 있는 `file:` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)은 오류를 발생시킵니다.

```js [ESM]
import { readFileSync } from 'node:fs';

// Windows에서
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: 파일 URL 경로에 인코딩된
\ 또는 / 문자가 포함되어서는 안 됩니다. */
```

#### Buffer 경로 {#buffer-paths}

[\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)를 사용하여 지정된 경로는 파일 경로를 불투명한 바이트 시퀀스로 취급하는 특정 POSIX 운영 체제에서 주로 유용합니다. 이러한 시스템에서는 단일 파일 경로에 여러 문자 인코딩을 사용하는 하위 시퀀스가 포함될 수 있습니다. 문자열 경로와 마찬가지로 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 경로는 상대적 또는 절대적일 수 있습니다.

POSIX에서 절대 경로를 사용하는 예:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // 파일로 작업 수행
} finally {
  await fd?.close();
}
```
#### Windows의 드라이브별 작업 디렉터리 {#per-drive-working-directories-on-windows}

Windows에서 Node.js는 드라이브별 작업 디렉터리 개념을 따릅니다. 이 동작은 백슬래시 없이 드라이브 경로를 사용할 때 관찰할 수 있습니다. 예를 들어 `fs.readdirSync('C:\\')`는 `fs.readdirSync('C:')`와 다른 결과를 반환할 수 있습니다. 자세한 내용은 [이 MSDN 페이지](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths)를 참조하세요.

### 파일 디스크립터 {#file-descriptors_1}

POSIX 시스템에서 각 프로세스에 대해 커널은 현재 열려 있는 파일 및 리소스 테이블을 유지 관리합니다. 각 열린 파일에는 *파일 디스크립터*라는 간단한 숫자 식별자가 할당됩니다. 시스템 수준에서 모든 파일 시스템 작업은 이러한 파일 디스크립터를 사용하여 각 특정 파일을 식별하고 추적합니다. Windows 시스템은 리소스 추적에 대해 개념적으로 유사하지만 다른 메커니즘을 사용합니다. 사용자를 위해 Node.js는 운영 체제 간의 차이점을 추상화하고 열려 있는 모든 파일에 숫자 파일 디스크립터를 할당합니다.

콜백 기반 `fs.open()` 및 동기식 `fs.openSync()` 메서드는 파일을 열고 새 파일 디스크립터를 할당합니다. 할당되면 파일 디스크립터를 사용하여 파일에서 데이터를 읽거나, 파일에 데이터를 쓰거나, 파일에 대한 정보를 요청할 수 있습니다.

운영 체제는 특정 시점에 열 수 있는 파일 디스크립터 수를 제한하므로 작업이 완료되면 디스크립터를 닫는 것이 매우 중요합니다. 그렇지 않으면 메모리 누수가 발생하여 결국 애플리케이션이 충돌합니다.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // stat 사용

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
Promise 기반 API는 숫자 파일 디스크립터 대신 [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 객체를 사용합니다. 이러한 객체는 리소스가 누출되지 않도록 시스템에서 더 잘 관리합니다. 그러나 작업이 완료되면 닫아야 합니다.

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // stat 사용
} finally {
  await file.close();
}
```

### 스레드 풀 사용법 {#threadpool-usage}

모든 콜백 및 Promise 기반 파일 시스템 API(`fs.FSWatcher()` 제외)는 libuv의 스레드 풀을 사용합니다. 이는 일부 애플리케이션에 예상치 못한 부정적인 성능 영향을 미칠 수 있습니다. 자세한 내용은 [`UV_THREADPOOL_SIZE`](/ko/nodejs/api/cli#uv_threadpool_sizesize) 문서를 참조하십시오.

### 파일 시스템 플래그 {#file-system-flags}

`flag` 옵션이 문자열을 취하는 모든 곳에서 다음 플래그를 사용할 수 있습니다.

-  `'a'`: 추가를 위해 파일을 엽니다. 파일이 존재하지 않으면 생성됩니다.
-  `'ax'`: `'a'`와 유사하지만 경로가 존재하면 실패합니다.
-  `'a+'`: 읽기 및 추가를 위해 파일을 엽니다. 파일이 존재하지 않으면 생성됩니다.
-  `'ax+'`: `'a+'`와 유사하지만 경로가 존재하면 실패합니다.
-  `'as'`: 동기 모드에서 추가를 위해 파일을 엽니다. 파일이 존재하지 않으면 생성됩니다.
-  `'as+'`: 동기 모드에서 읽기 및 추가를 위해 파일을 엽니다. 파일이 존재하지 않으면 생성됩니다.
-  `'r'`: 읽기 위해 파일을 엽니다. 파일이 존재하지 않으면 예외가 발생합니다.
-  `'rs'`: 동기 모드에서 읽기 위해 파일을 엽니다. 파일이 존재하지 않으면 예외가 발생합니다.
-  `'r+'`: 읽기 및 쓰기를 위해 파일을 엽니다. 파일이 존재하지 않으면 예외가 발생합니다.
-  `'rs+'`: 동기 모드에서 읽기 및 쓰기를 위해 파일을 엽니다. 운영 체제에 로컬 파일 시스템 캐시를 무시하도록 지시합니다. 이는 잠재적으로 오래된 로컬 캐시를 건너뛸 수 있도록 NFS 마운트에서 파일을 여는 데 주로 유용합니다. I/O 성능에 매우 큰 영향을 미치므로 필요한 경우가 아니면 이 플래그를 사용하지 않는 것이 좋습니다. 이는 `fs.open()` 또는 `fsPromises.open()`을 동기 차단 호출로 전환하지 않습니다. 동기 작업이 필요한 경우 `fs.openSync()`와 같은 것을 사용해야 합니다.
-  `'w'`: 쓰기를 위해 파일을 엽니다. 파일이 생성되지 않으면 생성되고, 존재하는 경우 잘립니다.
-  `'wx'`: `'w'`와 유사하지만 경로가 존재하면 실패합니다.
-  `'w+'`: 읽기 및 쓰기를 위해 파일을 엽니다. 파일이 생성되지 않으면 생성되고, 존재하는 경우 잘립니다.
-  `'wx+'`: `'w+'`와 유사하지만 경로가 존재하면 실패합니다.

`flag`는 [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)에 문서화된 대로 숫자일 수도 있습니다. 일반적으로 사용되는 상수는 `fs.constants`에서 사용할 수 있습니다. Windows에서는 플래그가 해당하는 플래그로 변환됩니다. 예를 들어 `O_WRONLY`는 `FILE_GENERIC_WRITE`로, `O_EXCL|O_CREAT`는 `CreateFileW`에서 허용하는 대로 `CREATE_NEW`로 변환됩니다.

배타적 플래그 `'x'`([`open(2)`](http://man7.org/linux/man-pages/man2/open.2)의 `O_EXCL` 플래그)는 경로가 이미 존재하는 경우 작업이 오류를 반환하도록 합니다. POSIX에서 경로는 심볼릭 링크인 경우 링크가 존재하지 않는 경로를 가리키더라도 `O_EXCL`을 사용하면 오류가 반환됩니다. 배타적 플래그는 네트워크 파일 시스템에서 작동하지 않을 수 있습니다.

Linux에서 파일이 추가 모드로 열려 있으면 위치 쓰기가 작동하지 않습니다. 커널은 위치 인수를 무시하고 항상 파일 끝에 데이터를 추가합니다.

파일을 대체하는 대신 수정하려면 `flag` 옵션을 기본값 `'w'` 대신 `'r+'`로 설정해야 할 수 있습니다.

일부 플래그의 동작은 플랫폼에 따라 다릅니다. 따라서 아래 예와 같이 macOS 및 Linux에서 `'a+'` 플래그로 디렉터리를 열면 오류가 반환됩니다. 반대로 Windows 및 FreeBSD에서는 파일 설명자 또는 `FileHandle`이 반환됩니다.

```js [ESM]
// macOS 및 Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows 및 FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```

Windows에서 `'w'` 플래그를 사용하여 기존 숨김 파일을 열면(`fs.open()`, `fs.writeFile()`, `fsPromises.open()` 중 하나를 통해) `EPERM`과 함께 실패합니다. 기존 숨김 파일은 `'r+'` 플래그를 사용하여 쓰기를 위해 열 수 있습니다.

`fs.ftruncate()` 또는 `filehandle.truncate()`에 대한 호출을 사용하여 파일 내용을 재설정할 수 있습니다.

