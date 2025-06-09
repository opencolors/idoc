---
title: Node.js Buffer 문서
description: Node.js Buffer 문서는 Node.js에서 이진 데이터를 다루는 방법에 대한 상세한 정보를 제공합니다. 버퍼의 생성, 조작 및 변환을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js Buffer 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js Buffer 문서는 Node.js에서 이진 데이터를 다루는 방법에 대한 상세한 정보를 제공합니다. 버퍼의 생성, 조작 및 변환을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js Buffer 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js Buffer 문서는 Node.js에서 이진 데이터를 다루는 방법에 대한 상세한 정보를 제공합니다. 버퍼의 생성, 조작 및 변환을 포함합니다.
---


# Buffer {#buffer}

::: tip [안정성: 2 - 안정됨]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

`Buffer` 객체는 고정 길이의 바이트 시퀀스를 나타내는 데 사용됩니다. 많은 Node.js API가 `Buffer`를 지원합니다.

`Buffer` 클래스는 JavaScript의 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 클래스의 하위 클래스이며 추가적인 사용 사례를 다루는 메서드를 사용하여 확장되었습니다. Node.js API는 `Buffer`가 지원되는 곳이면 어디든 일반 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)를 허용합니다.

`Buffer` 클래스는 전역 범위 내에서 사용할 수 있지만 import 또는 require 문을 통해 명시적으로 참조하는 것이 좋습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 길이가 10인 0으로 채워진 Buffer를 만듭니다.
const buf1 = Buffer.alloc(10);

// 길이가 10인 Buffer를 만듭니다.
// 모든 바이트가 `1` 값을 가집니다.
const buf2 = Buffer.alloc(10, 1);

// 길이가 10인 초기화되지 않은 버퍼를 만듭니다.
// Buffer.alloc()을 호출하는 것보다 빠르지만 반환된
// Buffer 인스턴스에는 이전 데이터가 포함될 수 있으므로
// fill(), write() 또는 Buffer의
// 내용을 채우는 다른 함수를 사용하여 덮어써야 합니다.
const buf3 = Buffer.allocUnsafe(10);

// 바이트 [1, 2, 3]을 포함하는 Buffer를 만듭니다.
const buf4 = Buffer.from([1, 2, 3]);

// 바이트 [1, 1, 1, 1]을 포함하는 Buffer를 만듭니다.
// 항목은 모두 `(value & 255)`를 사용하여 0–255 범위에 맞게 잘립니다.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 문자열 'tést'에 대한 UTF-8로 인코딩된 바이트를 포함하는 Buffer를 만듭니다.
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (16진수 표기법)
// [116, 195, 169, 115, 116] (10진수 표기법)
const buf6 = Buffer.from('tést');

// Latin-1 바이트 [0x74, 0xe9, 0x73, 0x74]를 포함하는 Buffer를 만듭니다.
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 길이가 10인 0으로 채워진 Buffer를 만듭니다.
const buf1 = Buffer.alloc(10);

// 길이가 10인 Buffer를 만듭니다.
// 모든 바이트가 `1` 값을 가집니다.
const buf2 = Buffer.alloc(10, 1);

// 길이가 10인 초기화되지 않은 버퍼를 만듭니다.
// Buffer.alloc()을 호출하는 것보다 빠르지만 반환된
// Buffer 인스턴스에는 이전 데이터가 포함될 수 있으므로
// fill(), write() 또는 Buffer의
// 내용을 채우는 다른 함수를 사용하여 덮어써야 합니다.
const buf3 = Buffer.allocUnsafe(10);

// 바이트 [1, 2, 3]을 포함하는 Buffer를 만듭니다.
const buf4 = Buffer.from([1, 2, 3]);

// 바이트 [1, 1, 1, 1]을 포함하는 Buffer를 만듭니다.
// 항목은 모두 `(value & 255)`를 사용하여 0–255 범위에 맞게 잘립니다.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 문자열 'tést'에 대한 UTF-8로 인코딩된 바이트를 포함하는 Buffer를 만듭니다.
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (16진수 표기법)
// [116, 195, 169, 115, 116] (10진수 표기법)
const buf6 = Buffer.from('tést');

// Latin-1 바이트 [0x74, 0xe9, 0x73, 0x74]를 포함하는 Buffer를 만듭니다.
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Buffers and character encodings {#buffers-and-character-encodings}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.7.0, v14.18.0 | `base64url` 인코딩을 도입했습니다. |
| v6.4.0 | `latin1`을 `binary`의 별칭으로 도입했습니다. |
| v5.0.0 | 더 이상 사용되지 않는 `raw` 및 `raws` 인코딩을 제거했습니다. |
:::

`Buffer`와 문자열 간에 변환할 때 문자 인코딩을 지정할 수 있습니다. 문자 인코딩을 지정하지 않으면 UTF-8이 기본값으로 사용됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Node.js 버퍼는 수신하는 인코딩 문자열의 모든 대소문자 변형을 허용합니다. 예를 들어 UTF-8은 `'utf8'`, `'UTF8'` 또는 `'uTf8'`로 지정할 수 있습니다.

현재 Node.js에서 지원하는 문자 인코딩은 다음과 같습니다.

-  `'utf8'` (alias: `'utf-8'`): 다중 바이트로 인코딩된 유니코드 문자. 많은 웹 페이지 및 기타 문서 형식에서 [UTF-8](https://en.wikipedia.org/wiki/UTF-8)을 사용합니다. 이것이 기본 문자 인코딩입니다. `Buffer`를 유효한 UTF-8 데이터만 포함하지 않는 문자열로 디코딩할 때 유니코드 대체 문자 `U+FFFD` �가 해당 오류를 나타내는 데 사용됩니다.
-  `'utf16le'` (alias: `'utf-16le'`): 다중 바이트로 인코딩된 유니코드 문자. `'utf8'`과 달리 문자열의 각 문자는 2바이트 또는 4바이트를 사용하여 인코딩됩니다. Node.js는 [리틀 엔디안](https://en.wikipedia.org/wiki/Endianness) 변형의 [UTF-16](https://en.wikipedia.org/wiki/UTF-16)만 지원합니다.
-  `'latin1'`: Latin-1은 [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1)을 의미합니다. 이 문자 인코딩은 `U+0000`에서 `U+00FF`까지의 유니코드 문자만 지원합니다. 각 문자는 단일 바이트를 사용하여 인코딩됩니다. 해당 범위에 맞지 않는 문자는 잘리고 해당 범위의 문자에 매핑됩니다.

위의 인코딩 중 하나를 사용하여 `Buffer`를 문자열로 변환하는 것을 디코딩이라고 하고, 문자열을 `Buffer`로 변환하는 것을 인코딩이라고 합니다.

Node.js는 다음 이진-텍스트 인코딩도 지원합니다. 이진-텍스트 인코딩의 경우 명명 규칙이 반전됩니다. `Buffer`를 문자열로 변환하는 것을 일반적으로 인코딩이라고 하고, 문자열을 `Buffer`로 변환하는 것을 디코딩이라고 합니다.

-  `'base64'`: [Base64](https://en.wikipedia.org/wiki/Base64) 인코딩. 문자열에서 `Buffer`를 생성할 때 이 인코딩은 [RFC 4648, 섹션 5](https://tools.ietf.org/html/rfc4648#section-5)에 지정된 대로 "URL 및 파일 이름 안전 알파벳"도 올바르게 허용합니다. base64로 인코딩된 문자열 내에 포함된 공백 문자(예: 공백, 탭 및 새 줄)는 무시됩니다.
-  `'base64url'`: [RFC 4648, 섹션 5](https://tools.ietf.org/html/rfc4648#section-5)에 지정된 대로 [base64url](https://tools.ietf.org/html/rfc4648#section-5) 인코딩. 문자열에서 `Buffer`를 생성할 때 이 인코딩은 일반 base64로 인코딩된 문자열도 올바르게 허용합니다. `Buffer`를 문자열로 인코딩할 때 이 인코딩은 패딩을 생략합니다.
-  `'hex'`: 각 바이트를 두 개의 16진수 문자로 인코딩합니다. 16진수 문자로만 구성되지 않은 문자열을 디코딩할 때 데이터 잘림이 발생할 수 있습니다. 아래 예시를 참조하십시오.

다음 레거시 문자 인코딩도 지원됩니다.

-  `'ascii'`: 7비트 [ASCII](https://en.wikipedia.org/wiki/ASCII) 데이터 전용. 문자열을 `Buffer`로 인코딩할 때 이것은 `'latin1'`을 사용하는 것과 같습니다. `Buffer`를 문자열로 디코딩할 때 이 인코딩을 사용하면 `'latin1'`로 디코딩하기 전에 각 바이트의 최상위 비트가 추가로 설정 해제됩니다. 일반적으로 이 인코딩을 사용할 이유가 없습니다. `'utf8'`(또는 데이터가 항상 ASCII 전용인 것으로 알려진 경우 `'latin1'`)이 ASCII 전용 텍스트를 인코딩하거나 디코딩할 때 더 나은 선택이기 때문입니다. 레거시 호환성을 위해서만 제공됩니다.
-  `'binary'`: `'latin1'`의 별칭. 여기에 나열된 모든 인코딩이 문자열과 이진 데이터 간에 변환되므로 이 인코딩의 이름은 매우 오해의 소지가 있을 수 있습니다. 문자열과 `Buffer` 간에 변환할 때는 일반적으로 `'utf8'`이 올바른 선택입니다.
-  `'ucs2'`, `'ucs-2'`: `'utf16le'`의 별칭. UCS-2는 U+FFFF보다 큰 코드 포인트를 가진 문자를 지원하지 않는 UTF-16의 변형을 나타내는 데 사용되었습니다. Node.js에서는 이러한 코드 포인트가 항상 지원됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, 첫 번째 16진수가 아닌 값('g')이 발견되면 데이터가 잘립니다.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, 데이터가 단일 자리('7')로 끝나면 데이터가 잘립니다.

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, 모든 데이터가 표현됩니다.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, 첫 번째 16진수가 아닌 값('g')이 발견되면 데이터가 잘립니다.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, 데이터가 단일 자리('7')로 끝나면 데이터가 잘립니다.

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, 모든 데이터가 표현됩니다.
```
:::

최신 웹 브라우저는 [WHATWG 인코딩 표준](https://encoding.spec.whatwg.org/)을 따르며 `'latin1'`과 `'ISO-8859-1'`을 모두 `'win-1252'`로 별칭 처리합니다. 즉, `http.get()`과 같은 작업을 수행하는 동안 반환된 문자 집합이 WHATWG 사양에 나열된 문자 집합 중 하나인 경우 서버가 실제로 `'win-1252'`로 인코딩된 데이터를 반환했을 수 있으며 `'latin1'` 인코딩을 사용하면 문자가 올바르게 디코딩되지 않을 수 있습니다.


## Buffers 및 TypedArrays {#buffers-and-typedarrays}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v3.0.0 | 이제 `Buffer` 클래스가 `Uint8Array`에서 상속됩니다. |
:::

`Buffer` 인스턴스는 JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 및 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 인스턴스이기도 합니다. 모든 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 메서드는 `Buffer`에서 사용할 수 있습니다. 그러나 `Buffer` API와 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) API 간에는 미묘한 비호환성이 있습니다.

특히:

- [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice)는 `TypedArray`의 일부를 복사본으로 생성하지만, [`Buffer.prototype.slice()`](/ko/nodejs/api/buffer#bufslicestart-end)는 복사하지 않고 기존 `Buffer`에 대한 뷰를 만듭니다. 이 동작은 놀라울 수 있으며 레거시 호환성을 위해서만 존재합니다. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray)는 `Buffer`와 다른 `TypedArray` 모두에서 [`Buffer.prototype.slice()`](/ko/nodejs/api/buffer#bufslicestart-end)의 동작을 달성하는 데 사용할 수 있으며 선호되어야 합니다.
- [`buf.toString()`](/ko/nodejs/api/buffer#buftostringencoding-start-end)은 해당 `TypedArray`와 호환되지 않습니다.
- [`buf.indexOf()`](/ko/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)와 같은 여러 메서드는 추가 인수를 지원합니다.

`Buffer`에서 새로운 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 인스턴스를 만드는 방법에는 두 가지가 있습니다.

- `Buffer`를 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 생성자에 전달하면 `Buffer` 내용이 정수 배열로 해석되어 대상 유형의 바이트 시퀀스가 아닌 정수 배열로 복사됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- `Buffer`의 기본 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)를 전달하면 `Buffer`와 메모리를 공유하는 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)가 생성됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 객체의 `.buffer` 속성을 같은 방식으로 사용하여 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 인스턴스와 동일한 할당된 메모리를 공유하는 새 `Buffer`를 만들 수 있습니다. [`Buffer.from()`](/ko/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)는 이 컨텍스트에서 `new Uint8Array()`처럼 동작합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)의 `.buffer`를 사용하여 `Buffer`를 만들 때 `byteOffset` 및 `length` 매개변수를 전달하여 기본 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)의 일부만 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

`Buffer.from()` 및 [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from)은 서로 다른 서명과 구현을 가지고 있습니다. 특히, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 변형은 typed array의 모든 요소에서 호출되는 매핑 함수인 두 번째 인수를 허용합니다.

- `TypedArray.from(source[, mapFn[, thisArg]])`

그러나 `Buffer.from()` 메서드는 매핑 함수 사용을 지원하지 않습니다.

- [`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/ko/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ko/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## 버퍼 및 반복 {#buffers-and-iteration}

`Buffer` 인스턴스는 `for..of` 구문을 사용하여 반복할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```
:::

또한 [`buf.values()`](/ko/nodejs/api/buffer#bufvalues), [`buf.keys()`](/ko/nodejs/api/buffer#bufkeys) 및 [`buf.entries()`](/ko/nodejs/api/buffer#bufentries) 메서드를 사용하여 반복기를 만들 수 있습니다.

## 클래스: `Blob` {#class-blob}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0, v16.17.0 | 더 이상 실험적이지 않습니다. |
| v15.7.0, v14.18.0 | 추가됨: v15.7.0, v14.18.0 |
:::

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)은 여러 작업자 스레드 간에 안전하게 공유할 수 있는 변경 불가능한 원시 데이터를 캡슐화합니다.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.7.0 | 표준 `endings` 옵션을 추가하여 줄 바꿈을 대체하고, 비표준 `encoding` 옵션을 제거했습니다. |
| v15.7.0, v14.18.0 | 추가됨: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ko/nodejs/api/buffer#class-blob) 문자열, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 또는 [\<Blob\>](/ko/nodejs/api/buffer#class-blob) 객체의 배열 또는 이러한 객체의 혼합으로, `Blob` 내부에 저장됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'transparent'` 또는 `'native'` 중 하나입니다. `'native'`로 설정되면 문자열 소스 부분의 줄 바꿈이 `require('node:os').EOL`에 지정된 대로 플랫폼 기본 줄 바꿈으로 변환됩니다.
  - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob 콘텐츠 유형입니다. `type`은 데이터의 MIME 미디어 유형을 전달하기 위한 것이지만 유형 형식에 대한 유효성 검사는 수행되지 않습니다.

주어진 소스의 연결을 포함하는 새 `Blob` 객체를 만듭니다.

[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 및 [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 소스는 'Blob'에 복사되므로 'Blob'이 생성된 후 안전하게 수정할 수 있습니다.

문자열 소스는 UTF-8 바이트 시퀀스로 인코딩되어 Blob에 복사됩니다. 각 문자열 부분 내의 일치하지 않는 서로게이트 쌍은 유니코드 U+FFFD 대체 문자로 대체됩니다.


### `blob.arrayBuffer()` {#blobarraybuffer}

**추가된 버전: v15.7.0, v14.18.0**

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`Blob` 데이터의 복사본을 포함하는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 이행하는 프로미스를 반환합니다.

#### `blob.bytes()` {#blobbytes}

**추가된 버전: v22.3.0, v20.16.0**

`blob.bytes()` 메서드는 `Blob` 객체의 바이트를 `Promise\<Uint8Array\>`로 반환합니다.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // 출력: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**추가된 버전: v15.7.0, v14.18.0**

`Blob`의 총 크기(바이트)입니다.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**추가된 버전: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 시작 인덱스.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 종료 인덱스.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 새 `Blob`의 콘텐츠 유형

이 `Blob` 객체 데이터의 하위 집합을 포함하는 새 `Blob`을 생성하고 반환합니다. 원래 `Blob`은 변경되지 않습니다.

### `blob.stream()` {#blobstream}

**추가된 버전: v16.7.0**

- 반환: [\<ReadableStream\>](/ko/nodejs/api/webstreams#class-readablestream)

`Blob`의 내용을 읽을 수 있도록 하는 새 `ReadableStream`을 반환합니다.

### `blob.text()` {#blobtext}

**추가된 버전: v15.7.0, v14.18.0**

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

UTF-8 문자열로 디코딩된 `Blob`의 내용으로 이행하는 프로미스를 반환합니다.

### `blob.type` {#blobtype}

**추가된 버전: v15.7.0, v14.18.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`Blob`의 콘텐츠 유형입니다.


### `Blob` 객체와 `MessageChannel` {#blob-objects-and-messagechannel}

[\<Blob\>](/ko/nodejs/api/buffer#class-blob) 객체가 생성되면 데이터를 전송하거나 즉시 복사하지 않고도 `MessagePort`를 통해 여러 대상으로 보낼 수 있습니다. `Blob`에 포함된 데이터는 `arrayBuffer()` 또는 `text()` 메서드가 호출될 때만 복사됩니다.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// Blob은 게시 후에도 계속 사용할 수 있습니다.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// Blob은 게시 후에도 계속 사용할 수 있습니다.
blob.text().then(console.log);
```
:::

## 클래스: `Buffer` {#class-buffer}

`Buffer` 클래스는 바이너리 데이터를 직접 처리하기 위한 전역 유형입니다. 다양한 방식으로 생성할 수 있습니다.

### 정적 메서드: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 잘못된 입력 인수에 대해 ERR_INVALID_ARG_VALUE 대신 ERR_INVALID_ARG_TYPE 또는 ERR_OUT_OF_RANGE를 throw합니다. |
| v15.0.0 | 잘못된 입력 인수에 대해 ERR_INVALID_OPT_VALUE 대신 ERR_INVALID_ARG_VALUE를 throw합니다. |
| v10.0.0 | 길이가 0이 아닌 버퍼를 길이가 0인 버퍼로 채우려고 하면 예외가 발생합니다. |
| v10.0.0 | `fill`에 대해 잘못된 문자열을 지정하면 예외가 발생합니다. |
| v8.9.3 | `fill`에 대해 잘못된 문자열을 지정하면 이제 0으로 채워진 버퍼가 생성됩니다. |
| v5.10.0 | v5.10.0에 추가됨 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`의 원하는 길이입니다.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`를 미리 채울 값입니다. **기본값:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `fill`이 문자열인 경우 인코딩입니다. **기본값:** `'utf8'`.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`size` 바이트의 새 `Buffer`를 할당합니다. `fill`이 `undefined`이면 `Buffer`가 0으로 채워집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

`size`가 [`buffer.constants.MAX_LENGTH`](/ko/nodejs/api/buffer#bufferconstantsmax_length)보다 크거나 0보다 작으면 [`ERR_OUT_OF_RANGE`](/ko/nodejs/api/errors#err_out_of_range)가 throw됩니다.

`fill`이 지정되면 할당된 `Buffer`는 [`buf.fill(fill)`](/ko/nodejs/api/buffer#buffillvalue-offset-end-encoding)을 호출하여 초기화됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

`fill` 및 `encoding`이 모두 지정되면 할당된 `Buffer`는 [`buf.fill(fill, encoding)`](/ko/nodejs/api/buffer#buffillvalue-offset-end-encoding)을 호출하여 초기화됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

[`Buffer.alloc()`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 호출은 대안인 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)보다 측정 가능하게 느릴 수 있지만 새로 생성된 `Buffer` 인스턴스 내용이 `Buffer`에 할당되지 않았을 수 있는 데이터를 포함하여 이전 할당의 중요한 데이터를 포함하지 않도록 보장합니다.

`size`가 숫자가 아니면 `TypeError`가 throw됩니다.


### 정적 메서드: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 잘못된 입력 인수에 대해 ERR_INVALID_ARG_VALUE 대신 ERR_INVALID_ARG_TYPE 또는 ERR_OUT_OF_RANGE를 던집니다. |
| v15.0.0 | 잘못된 입력 인수에 대해 ERR_INVALID_OPT_VALUE 대신 ERR_INVALID_ARG_VALUE를 던집니다. |
| v7.0.0 | 음수 `size`를 전달하면 이제 오류가 발생합니다. |
| v5.10.0 | v5.10.0에 추가됨 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`의 원하는 길이입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`size` 바이트의 새 `Buffer`를 할당합니다. `size`가 [`buffer.constants.MAX_LENGTH`](/ko/nodejs/api/buffer#bufferconstantsmax_length)보다 크거나 0보다 작으면 [`ERR_OUT_OF_RANGE`](/ko/nodejs/api/errors#err_out_of_range)가 발생합니다.

이러한 방식으로 생성된 `Buffer` 인스턴스에 대한 기본 메모리는 *초기화되지 않습니다*. 새로 생성된 `Buffer`의 내용은 알 수 없으며 *민감한 데이터가 포함될 수 있습니다*. 0으로 `Buffer` 인스턴스를 초기화하려면 대신 [`Buffer.alloc()`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)을 사용하십시오.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// 출력 (내용은 다를 수 있음): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// 출력: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// 출력 (내용은 다를 수 있음): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// 출력: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

`size`가 숫자가 아니면 `TypeError`가 발생합니다.

`Buffer` 모듈은 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding) 및 [`Buffer.concat()`](/ko/nodejs/api/buffer#static-method-bufferconcatlist-totallength)를 사용하여 생성된 새 `Buffer` 인스턴스의 빠른 할당을 위한 풀로 사용되는 크기 [`Buffer.poolSize`](/ko/nodejs/api/buffer#class-property-bufferpoolsize)의 내부 `Buffer` 인스턴스를 미리 할당합니다. 단, `size`가 `Buffer.poolSize \>\>\> 1`보다 작은 경우에만 해당합니다 ([`Buffer.poolSize`](/ko/nodejs/api/buffer#class-property-bufferpoolsize)를 2로 나눈 값의 내림).

이 미리 할당된 내부 메모리 풀의 사용은 `Buffer.alloc(size, fill)` 호출과 `Buffer.allocUnsafe(size).fill(fill)` 호출 간의 중요한 차이점입니다. 특히 `Buffer.alloc(size, fill)`은 내부 `Buffer` 풀을 *절대* 사용하지 않는 반면, `Buffer.allocUnsafe(size).fill(fill)`은 `size`가 [`Buffer.poolSize`](/ko/nodejs/api/buffer#class-property-bufferpoolsize)의 절반 이하인 경우 내부 `Buffer` 풀을 *사용합니다*. 차이는 미묘하지만 애플리케이션에서 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)가 제공하는 추가 성능을 요구하는 경우 중요할 수 있습니다.


### 정적 메서드: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 잘못된 입력 인수에 대해 ERR_INVALID_ARG_VALUE 대신 ERR_INVALID_ARG_TYPE 또는 ERR_OUT_OF_RANGE를 발생시킵니다. |
| v15.0.0 | 잘못된 입력 인수에 대해 ERR_INVALID_OPT_VALUE 대신 ERR_INVALID_ARG_VALUE를 발생시킵니다. |
| v5.12.0 | v5.12.0에 추가됨 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`의 원하는 길이입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

새 `Buffer`를 `size` 바이트만큼 할당합니다. `size`가 [`buffer.constants.MAX_LENGTH`](/ko/nodejs/api/buffer#bufferconstantsmax_length)보다 크거나 0보다 작으면 [`ERR_OUT_OF_RANGE`](/ko/nodejs/api/errors#err_out_of_range)가 발생합니다. `size`가 0이면 길이가 0인 `Buffer`가 생성됩니다.

이러한 방식으로 생성된 `Buffer` 인스턴스의 기본 메모리는 *초기화되지 않습니다*. 새로 생성된 `Buffer`의 내용은 알 수 없으며 *민감한 데이터가 포함될 수 있습니다*. 이러한 `Buffer` 인스턴스를 0으로 초기화하려면 [`buf.fill(0)`](/ko/nodejs/api/buffer#buffillvalue-offset-end-encoding)을 사용하십시오.

[`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)를 사용하여 새 `Buffer` 인스턴스를 할당할 때 `Buffer.poolSize \>\>\> 1` (기본 poolSize를 사용하는 경우 4KiB)보다 작은 할당은 미리 할당된 단일 `Buffer`에서 조각화됩니다. 이를 통해 응용 프로그램은 개별적으로 할당된 `Buffer` 인스턴스를 많이 생성하는 데 따른 가비지 컬렉션 오버헤드를 방지할 수 있습니다. 이 접근 방식은 개별 `ArrayBuffer` 객체를 많이 추적하고 정리할 필요성을 없애 성능과 메모리 사용량을 모두 향상시킵니다.

그러나 개발자가 풀에서 작은 메모리 청크를 무기한으로 유지해야 하는 경우 `Buffer.allocUnsafeSlow()`를 사용하여 풀링되지 않은 `Buffer` 인스턴스를 만든 다음 관련 비트를 복사하는 것이 적절할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 몇 개의 작은 메모리 청크를 유지해야 합니다.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 유지된 데이터에 대해 할당합니다.
    const sb = Buffer.allocUnsafeSlow(10);

    // 데이터를 새 할당에 복사합니다.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 몇 개의 작은 메모리 청크를 유지해야 합니다.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 유지된 데이터에 대해 할당합니다.
    const sb = Buffer.allocUnsafeSlow(10);

    // 데이터를 새 할당에 복사합니다.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

`size`가 숫자가 아니면 `TypeError`가 발생합니다.


### 정적 메서드: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.0.0 | 유효하지 않은 입력을 전달하면 이제 오류가 발생합니다. |
| v5.10.0 | 이제 `string` 매개변수는 모든 `TypedArray`, `DataView` 또는 `ArrayBuffer`가 될 수 있습니다. |
| v0.1.90 | v0.1.90에 추가됨 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 길이를 계산할 값입니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string`이 문자열인 경우, 이것은 인코딩입니다. **기본값:** `'utf8'`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `string` 내에 포함된 바이트 수입니다.

`encoding`을 사용하여 인코딩되었을 때 문자열의 바이트 길이를 반환합니다. 이것은 문자열을 바이트로 변환하는 데 사용되는 인코딩을 고려하지 않는 [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length)와 같지 않습니다.

`'base64'`, `'base64url'` 및 `'hex'`의 경우, 이 함수는 유효한 입력을 가정합니다. 비-base64/hex 인코딩 데이터를 포함하는 문자열 (예: 공백)의 경우, 반환 값은 문자열에서 생성된 `Buffer`의 길이보다 클 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```
:::

`string`이 `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)인 경우, `.byteLength`에서 보고한 바이트 길이가 반환됩니다.


### 정적 메서드: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 이제 인수가 `Uint8Array`일 수 있습니다. |
| v0.11.13 | 추가됨: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- 반환: [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비교 결과에 따라 `-1`, `0` 또는 `1` 중 하나입니다. 자세한 내용은 [`buf.compare()`](/ko/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend)를 참조하세요.

일반적으로 `Buffer` 인스턴스의 배열을 정렬하기 위해 `buf1`을 `buf2`와 비교합니다. 이는 [`buf1.compare(buf2)`](/ko/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend)를 호출하는 것과 같습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// 출력: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (이 결과는 [buf2, buf1]과 같습니다.)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// 출력: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (이 결과는 [buf2, buf1]과 같습니다.)
```
:::

### 정적 메서드: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 이제 `list`의 요소가 `Uint8Array`일 수 있습니다. |
| v0.7.11 | 추가됨: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 연결할 `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 인스턴스 목록입니다.
- `totalLength` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 연결 시 `list`의 `Buffer` 인스턴스의 총 길이입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`list`에 있는 모든 `Buffer` 인스턴스를 함께 연결한 결과인 새 `Buffer`를 반환합니다.

목록에 항목이 없거나 `totalLength`가 0이면 새 길이가 0인 `Buffer`가 반환됩니다.

`totalLength`가 제공되지 않으면 `list`에 있는 `Buffer` 인스턴스의 길이를 더하여 계산됩니다.

`totalLength`가 제공되면 부호 없는 정수로 강제 변환됩니다. `list`에 있는 `Buffer`의 결합된 길이가 `totalLength`를 초과하면 결과는 `totalLength`로 잘립니다. `list`에 있는 `Buffer`의 결합된 길이가 `totalLength`보다 작으면 나머지 공간은 0으로 채워집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 세 개의 `Buffer` 인스턴스 목록에서 단일 `Buffer`를 만듭니다.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// 출력: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// 출력: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// 출력: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 세 개의 `Buffer` 인스턴스 목록에서 단일 `Buffer`를 만듭니다.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// 출력: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// 출력: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// 출력: 42
```
:::

`Buffer.concat()`는 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)와 마찬가지로 내부 `Buffer` 풀을 사용할 수도 있습니다.


### 정적 메서드: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**추가된 버전: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 복사할 [\<TypedArray\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type) `view` 내에서의 시작 오프셋입니다. **기본값:**: `0`.
- `length` [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type) 복사할 `view`의 요소 수입니다. **기본값:** `view.length - offset`.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`view`의 기본 메모리를 새 `Buffer`로 복사합니다.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### 정적 메서드: `Buffer.from(array)` {#static-method-bufferfromarray}

**추가된 버전: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`0` – `255` 범위의 바이트 `array`를 사용하여 새 `Buffer`를 할당합니다. 해당 범위 밖의 배열 항목은 잘려서 범위 내에 맞게 됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 문자열 'buffer'의 UTF-8 바이트를 포함하는 새 Buffer를 만듭니다.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 문자열 'buffer'의 UTF-8 바이트를 포함하는 새 Buffer를 만듭니다.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

`array`가 `Array`와 유사한 객체(즉, `number` 유형의 `length` 속성을 가진 객체)인 경우, `Buffer` 또는 `Uint8Array`가 아닌 한 배열인 것처럼 처리됩니다. 이는 다른 모든 `TypedArray` 변형이 `Array`로 처리됨을 의미합니다. `TypedArray`를 지원하는 바이트에서 `Buffer`를 생성하려면 [`Buffer.copyBytesFrom()`](/ko/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length)을 사용하세요.

`array`가 `Array`가 아니거나 `Buffer.from()` 변형에 적합한 다른 유형이 아닌 경우 `TypeError`가 발생합니다.

`Buffer.from(array)` 및 [`Buffer.from(string)`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding)은 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)와 마찬가지로 내부 `Buffer` 풀을 사용할 수도 있습니다.


### 정적 메서드: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**추가된 버전: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 또는 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)의 `.buffer` 속성입니다.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 노출할 첫 번째 바이트의 인덱스입니다. **기본값:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 노출할 바이트 수입니다. **기본값:** `arrayBuffer.byteLength - byteOffset`.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

이는 기본 메모리를 복사하지 않고 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)의 뷰를 만듭니다. 예를 들어, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 인스턴스의 `.buffer` 속성에 대한 참조를 전달하면 새로 생성된 `Buffer`는 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)의 기본 `ArrayBuffer`와 동일한 할당된 메모리를 공유합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// `arr`와 메모리를 공유합니다.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// 원래 Uint16Array를 변경하면 Buffer도 변경됩니다.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// `arr`와 메모리를 공유합니다.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// 원래 Uint16Array를 변경하면 Buffer도 변경됩니다.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```
:::

선택적 `byteOffset` 및 `length` 인수는 `Buffer`에서 공유할 `arrayBuffer` 내의 메모리 범위를 지정합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```
:::

`arrayBuffer`가 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 또는 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 또는 `Buffer.from()` 변형에 적합한 다른 유형이 아니면 `TypeError`가 발생합니다.

백업 `ArrayBuffer`는 `TypedArray` 뷰의 범위를 벗어나는 메모리 범위를 포함할 수 있다는 점을 기억하는 것이 중요합니다. `TypedArray`의 `buffer` 속성을 사용하여 생성된 새 `Buffer`는 `TypedArray`의 범위를 벗어날 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```
:::


### 정적 메서드: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**추가된 버전: v5.10.0**

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 데이터를 복사할 기존 `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

전달된 `buffer` 데이터를 새로운 `Buffer` 인스턴스에 복사합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```
:::

`buffer`가 `Buffer`가 아니거나 `Buffer.from()` 변형에 적합한 다른 유형이 아닌 경우 `TypeError`가 발생합니다.

### 정적 메서드: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**추가된 버전: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `Symbol.toPrimitive` 또는 `valueOf()`를 지원하는 객체입니다.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 바이트 오프셋 또는 인코딩입니다.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 길이입니다.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`valueOf()` 함수가 `object`와 엄격하게 같지 않은 값을 반환하는 객체의 경우, `Buffer.from(object.valueOf(), offsetOrEncoding, length)`를 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

`Symbol.toPrimitive`을 지원하는 객체의 경우, `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`를 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

`object`에 언급된 메서드가 없거나 `Buffer.from()` 변형에 적합한 다른 유형이 아닌 경우 `TypeError`가 발생합니다.


### 정적 메서드: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**추가된 버전: v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인코딩할 문자열입니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string`의 인코딩입니다. **기본값:** `'utf8'`.
- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`string`을 포함하는 새로운 `Buffer`를 만듭니다. `encoding` 매개변수는 `string`을 바이트로 변환할 때 사용할 문자 인코딩을 식별합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```
:::

`string`이 문자열이 아니거나 `Buffer.from()` 변형에 적합한 다른 유형이 아니면 `TypeError`가 발생합니다.

[`Buffer.from(string)`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding)은 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)와 마찬가지로 내부 `Buffer` 풀을 사용할 수도 있습니다.

### 정적 메서드: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**추가된 버전: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`obj`가 `Buffer`이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### 정적 메서드: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**추가된 버전: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 문자 인코딩 이름입니다.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`encoding`이 지원되는 문자 인코딩 이름이면 `true`를, 그렇지 않으면 `false`를 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```
:::

### 클래스 속성: `Buffer.poolSize` {#class-property-bufferpoolsize}

**추가된 버전: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `8192`

이것은 풀링에 사용되는 미리 할당된 내부 `Buffer` 인스턴스의 크기(바이트)입니다. 이 값은 수정할 수 있습니다.

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

인덱스 연산자 `[index]`는 `buf`의 `index` 위치에 있는 옥텟을 가져오고 설정하는 데 사용할 수 있습니다. 값은 개별 바이트를 나타내므로 유효한 값 범위는 `0x00`과 `0xFF`(16진수) 또는 `0`과 `255`(10진수) 사이입니다.

이 연산자는 `Uint8Array`에서 상속되므로 범위를 벗어난 접근에 대한 동작은 `Uint8Array`와 동일합니다. 즉, `index`가 음수이거나 `buf.length`보다 크거나 같으면 `buf[index]`는 `undefined`를 반환하고, `index`가 음수이거나 `\>= buf.length`이면 `buf[index] = value`는 버퍼를 수정하지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// ASCII 문자열을 한 번에 한 바이트씩 `Buffer`에 복사합니다.
// (이것은 ASCII 전용 문자열에만 작동합니다. 일반적으로 이 변환을 수행하려면
// `Buffer.from()`을 사용해야 합니다.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// ASCII 문자열을 한 번에 한 바이트씩 `Buffer`에 복사합니다.
// (이것은 ASCII 전용 문자열에만 작동합니다. 일반적으로 이 변환을 수행하려면
// `Buffer.from()`을 사용해야 합니다.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 이 `Buffer` 객체가 생성된 기반이 되는 기본 `ArrayBuffer` 객체입니다.

이 `ArrayBuffer`는 원래 `Buffer`에 정확히 일치한다고 보장되지 않습니다. 자세한 내용은 `buf.byteOffset`에 대한 참고 사항을 참조하세요.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Buffer`의 기본 `ArrayBuffer` 객체의 `byteOffset`입니다.

`Buffer.from(ArrayBuffer, byteOffset, length)`에서 `byteOffset`을 설정하거나, 때로는 `Buffer.poolSize`보다 작은 `Buffer`를 할당할 때, 버퍼는 기본 `ArrayBuffer`에서 0 오프셋부터 시작하지 않습니다.

이는 `ArrayBuffer`의 다른 부분이 `Buffer` 객체 자체와 관련이 없을 수 있으므로 `buf.buffer`를 사용하여 기본 `ArrayBuffer`에 직접 액세스할 때 문제를 일으킬 수 있습니다.

`Buffer`와 메모리를 공유하는 `TypedArray` 객체를 생성할 때의 일반적인 문제는 이 경우 `byteOffset`을 올바르게 지정해야 한다는 것입니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer.poolSize`보다 작은 버퍼를 생성합니다.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Node.js Buffer를 Int8Array로 캐스팅할 때 byteOffset을 사용하여
// `nodeBuffer`에 대한 메모리가 포함된 `nodeBuffer.buffer` 부분만 참조합니다.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer.poolSize`보다 작은 버퍼를 생성합니다.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Node.js Buffer를 Int8Array로 캐스팅할 때 byteOffset을 사용하여
// `nodeBuffer`에 대한 메모리가 포함된 `nodeBuffer.buffer` 부분만 참조합니다.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [기록]
| 버전    | 변경 사항                                                    |
| :------- | :---------------------------------------------------------- |
| v8.0.0   | 이제 `target` 매개변수가 `Uint8Array`가 될 수 있습니다.       |
| v5.11.0  | 오프셋 지정을 위한 추가 매개변수가 이제 지원됩니다.            |
| v0.11.13 | 추가됨: v0.11.13                                           |
:::

- `target` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `buf`와 비교할 `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)입니다.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비교를 시작할 `target` 내의 오프셋입니다. **기본값:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비교를 종료할 `target` 내의 오프셋입니다(포함하지 않음). **기본값:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비교를 시작할 `buf` 내의 오프셋입니다. **기본값:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비교를 종료할 `buf` 내의 오프셋입니다(포함하지 않음). **기본값:** [`buf.length`](/ko/nodejs/api/buffer#buflength).
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf`를 `target`과 비교하고 정렬 순서에서 `buf`가 `target`보다 앞, 뒤 또는 같은지를 나타내는 숫자를 반환합니다. 비교는 각 `Buffer`의 실제 바이트 시퀀스를 기반으로 합니다.

- `target`이 `buf`와 같으면 `0`이 반환됩니다.
- 정렬할 때 `target`이 `buf` *앞*에 와야 하면 `1`이 반환됩니다.
- 정렬할 때 `target`이 `buf` *뒤*에 와야 하면 `-1`이 반환됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```
:::

선택적 `targetStart`, `targetEnd`, `sourceStart` 및 `sourceEnd` 인수를 사용하여 비교를 각각 `target` 및 `buf` 내의 특정 범위로 제한할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```
:::

`targetStart < 0`, `sourceStart < 0`, `targetEnd > target.byteLength` 또는 `sourceEnd > source.byteLength`인 경우 [`ERR_OUT_OF_RANGE`](/ko/nodejs/api/errors#err_out_of_range)가 발생합니다.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Added in: v0.1.90**

- `target` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 복사할 대상 `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 입니다.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `target` 내에서 쓰기를 시작할 오프셋입니다. **기본값:** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 내에서 복사를 시작할 오프셋입니다. **기본값:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 내에서 복사를 중지할 오프셋입니다 (포함하지 않음). **기본값:** [`buf.length`](/ko/nodejs/api/buffer#buflength).
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사된 바이트 수입니다.

`target` 메모리 영역이 `buf`와 겹치는 경우에도 `buf`의 영역에서 `target`의 영역으로 데이터를 복사합니다.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set)도 동일한 작업을 수행하며, Node.js `Buffer`를 포함한 모든 TypedArray에서 사용할 수 있지만, 함수 인수는 다릅니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 두 개의 `Buffer` 인스턴스를 만듭니다.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf1[i] = i + 97;
}

// `buf1` 바이트 16부터 19까지를 `buf2`의 바이트 8부터 시작하여 복사합니다.
buf1.copy(buf2, 8, 16, 20);
// 이는 다음과 같습니다:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 두 개의 `Buffer` 인스턴스를 만듭니다.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf1[i] = i + 97;
}

// `buf1` 바이트 16부터 19까지를 `buf2`의 바이트 8부터 시작하여 복사합니다.
buf1.copy(buf2, 8, 16, 20);
// 이는 다음과 같습니다:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer`를 만들고 한 영역에서 동일한 `Buffer` 내의 겹치는 영역으로 데이터를 복사합니다.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer`를 만들고 한 영역에서 동일한 `Buffer` 내의 겹치는 영역으로 데이터를 복사합니다.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**추가된 버전: v1.1.0**

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

`buf`의 내용에서 `[index, byte]` 쌍의 [이터레이터](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)를 생성하여 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer`의 전체 내용을 기록합니다.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer`의 전체 내용을 기록합니다.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 이제 인수로 `Uint8Array`를 사용할 수 있습니다. |
| v0.11.13 | 추가된 버전: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `buf`와 비교할 `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)입니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`buf`와 `otherBuffer`가 정확히 동일한 바이트를 가지면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다. [`buf.compare(otherBuffer) === 0`](/ko/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend)과 동일합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | `ERR_INDEX_OUT_OF_RANGE` 대신 `ERR_OUT_OF_RANGE`를 던집니다. |
| v10.0.0 | 음수 `end` 값은 `ERR_INDEX_OUT_OF_RANGE` 오류를 던집니다. |
| v10.0.0 | 길이가 0인 버퍼로 0이 아닌 길이의 버퍼를 채우려고 하면 예외가 발생합니다. |
| v10.0.0 | `value`에 유효하지 않은 문자열을 지정하면 예외가 발생합니다. |
| v5.7.0 | 이제 `encoding` 매개변수가 지원됩니다. |
| v0.5.0 | v0.5.0에 추가됨 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`를 채울 값입니다. 빈 값(string, Uint8Array, Buffer)은 `0`으로 강제 변환됩니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 채우기를 시작하기 전에 건너뛸 바이트 수입니다. **기본값:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 채우기를 중지할 위치입니다(포함하지 않음). **기본값:** [`buf.length`](/ko/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value`가 문자열인 경우 `value`에 대한 인코딩입니다. **기본값:** `'utf8'`.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `buf`에 대한 참조입니다.

`buf`를 지정된 `value`로 채웁니다. `offset`과 `end`가 제공되지 않으면 전체 `buf`가 채워집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer`를 ASCII 문자 'h'로 채웁니다.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// 빈 문자열로 버퍼 채우기
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer`를 ASCII 문자 'h'로 채웁니다.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// 빈 문자열로 버퍼 채우기
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```
:::

`value`가 문자열, `Buffer` 또는 정수가 아니면 `uint32` 값으로 강제 변환됩니다. 결과 정수가 `255`(10진수)보다 크면 `buf`는 `value & 255`로 채워집니다.

`fill()` 작업의 최종 쓰기가 멀티바이트 문자에 해당하면 `buf`에 맞는 해당 문자의 바이트만 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// UTF-8에서 2바이트를 차지하는 문자로 `Buffer`를 채웁니다.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// UTF-8에서 2바이트를 차지하는 문자로 `Buffer`를 채웁니다.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
```
:::

`value`에 유효하지 않은 문자가 포함되어 있으면 잘립니다. 유효한 채우기 데이터가 남아 있지 않으면 예외가 발생합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Throws an exception.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Throws an exception.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**추가된 버전: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 검색할 항목.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에서 검색을 시작할 위치. 음수인 경우, 오프셋은 `buf`의 끝에서 계산됩니다. **기본값:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value`가 문자열인 경우, 이것은 해당 인코딩입니다. **기본값:** `'utf8'`.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `value`가 `buf`에서 발견되면 `true`, 그렇지 않으면 `false`.

[`buf.indexOf() !== -1`](/ko/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)과 동일합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 이제 `value`가 `Uint8Array`일 수 있습니다. |
| v5.7.0, v4.4.0 | `encoding`이 전달되면 `byteOffset` 매개변수가 더 이상 필요하지 않습니다. |
| v1.5.0 | v1.5.0에서 추가됨 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 검색할 내용입니다.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에서 검색을 시작할 위치입니다. 음수이면 오프셋은 `buf`의 끝에서 계산됩니다. **기본값:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value`가 문자열인 경우, 이는 `buf`에서 검색될 문자열의 이진 표현을 결정하는 데 사용되는 인코딩입니다. **기본값:** `'utf8'`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에서 `value`가 처음 나타나는 인덱스이거나, `buf`에 `value`가 포함되어 있지 않으면 `-1`입니다.

`value`가 다음과 같은 경우:

- 문자열인 경우 `value`는 `encoding`의 문자 인코딩에 따라 해석됩니다.
- `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)인 경우, `value`는 전체적으로 사용됩니다. 부분 `Buffer`를 비교하려면 [`buf.subarray`](/ko/nodejs/api/buffer#bufsubarraystart-end)를 사용하세요.
- 숫자인 경우, `value`는 `0`과 `255` 사이의 부호 없는 8비트 정수 값으로 해석됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```
:::

`value`가 문자열, 숫자 또는 `Buffer`가 아니면 이 메서드는 `TypeError`를 발생시킵니다. `value`가 숫자이면 유효한 바이트 값인 0과 255 사이의 정수로 강제 변환됩니다.

`byteOffset`이 숫자가 아니면 숫자로 강제 변환됩니다. 강제 변환의 결과가 `NaN` 또는 `0`이면 전체 버퍼가 검색됩니다. 이 동작은 [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)와 일치합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

`value`가 빈 문자열 또는 빈 `Buffer`이고 `byteOffset`이 `buf.length`보다 작으면 `byteOffset`이 반환됩니다. `value`가 비어 있고 `byteOffset`이 `buf.length` 이상이면 `buf.length`가 반환됩니다.


### `buf.keys()` {#bufkeys}

**추가된 버전: v1.1.0**

- 반환값: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

`buf` 키(인덱스)의 [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)를 생성하여 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 이제 `value`가 `Uint8Array`일 수 있습니다. |
| v6.0.0 | 추가된 버전: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 검색할 대상입니다.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에서 검색을 시작할 위치입니다. 음수이면 오프셋은 `buf`의 끝에서 계산됩니다. **기본값:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value`가 문자열인 경우, 이는 `buf`에서 검색될 문자열의 이진 표현을 결정하는 데 사용되는 인코딩입니다. **기본값:** `'utf8'`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에서 `value`의 마지막 발생 인덱스이거나, `buf`에 `value`가 포함되어 있지 않으면 `-1`입니다.

첫 번째 발생이 아닌 `value`의 마지막 발생이 발견된다는 점을 제외하고는 [`buf.indexOf()`](/ko/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)와 동일합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```
:::

`value`가 문자열, 숫자 또는 `Buffer`가 아니면 이 메서드는 `TypeError`를 발생시킵니다. `value`가 숫자이면 유효한 바이트 값, 즉 0과 255 사이의 정수로 강제 변환됩니다.

`byteOffset`이 숫자가 아니면 숫자로 강제 변환됩니다. `{}` 또는 `undefined`와 같이 `NaN`으로 강제 변환되는 모든 인수는 전체 버퍼를 검색합니다. 이 동작은 [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf)와 일치합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

`value`가 빈 문자열이거나 빈 `Buffer`이면 `byteOffset`이 반환됩니다.


### `buf.length` {#buflength}

**추가된 버전: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf`의 바이트 수를 반환합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer`를 만들고 UTF-8을 사용하여 더 짧은 문자열을 씁니다.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer`를 만들고 UTF-8을 사용하여 더 짧은 문자열을 씁니다.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
```
:::

### `buf.parent` {#bufparent}

**더 이상 사용되지 않음: v8.0.0부터**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`buf.buffer`](/ko/nodejs/api/buffer#bufbuffer)를 사용하세요.
:::

`buf.parent` 속성은 더 이상 사용되지 않는 `buf.buffer`의 별칭입니다.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**추가된 버전: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. 다음을 충족해야 합니다. `0 \<= offset \<= buf.length - 8`. **기본값:** `0`.
- 반환: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

지정된 `offset`에서 `buf`로부터 부호 있는 big-endian 64비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**추가된 버전: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. 다음을 충족해야 합니다. `0 \<= offset \<= buf.length - 8`. **기본값:** `0`.
- 반환: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

지정된 `offset`에서 `buf`로부터 부호 있는 little-endian 64비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.10.0, v12.19.0 | 이 함수는 `buf.readBigUint64BE()`로도 사용할 수 있습니다. |
| v12.0.0, v10.20.0 | 추가됨: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

지정된 `offset`에서 `buf`로부터 부호 없는 big-endian 64비트 정수를 읽습니다.

이 함수는 `readBigUint64BE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.10.0, v12.19.0 | 이 함수는 `buf.readBigUint64LE()`로도 사용할 수 있습니다. |
| v12.0.0, v10.20.0 | 추가됨: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

지정된 `offset`에서 `buf`로부터 부호 없는 little-endian 64비트 정수를 읽습니다.

이 함수는 `readBigUint64LE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` 제거 및 오프셋의 `uint32`로의 암묵적 강제 변환이 더 이상 없음. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작하기 전에 건너뛸 바이트 수. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 64비트 빅 엔디안 double을 읽습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` 제거 및 오프셋의 `uint32`로의 암묵적 강제 변환이 더 이상 없음. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작하기 전에 건너뛸 바이트 수. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 64비트 리틀 엔디안 double을 읽습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [연혁]
| 버전     | 변경 사항                                                      |
| :------- | :------------------------------------------------------------- |
| v10.0.0  | `noAssert` 제거 및 더 이상 offset을 `uint32`로 암묵적으로 강제 변환하지 않음. |
| v0.11.15 | 추가됨: v0.11.15                                              |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 32비트, 빅 엔디안 float를 읽습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Prints: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Prints: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [연혁]
| 버전     | 변경 사항                                                      |
| :------- | :------------------------------------------------------------- |
| v10.0.0  | `noAssert` 제거 및 더 이상 offset을 `uint32`로 암묵적으로 강제 변환하지 않음. |
| v0.11.15 | 추가됨: v0.11.15                                              |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 32비트, 리틀 엔디안 float를 읽습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Prints: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Prints: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않습니다. |
| v0.5.0 | 추가됨: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 1`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 있는 8비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 있는 빅 엔디안 16비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert` 제거 및 오프셋의 암시적 강제 변환이 더 이상 `uint32`로 수행되지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`에서 부호 있는 little-endian 16비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// 출력: 1280
console.log(buf.readInt16LE(1));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// 출력: 1280
console.log(buf.readInt16LE(1));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert` 제거 및 오프셋의 암시적 강제 변환이 더 이상 `uint32`로 수행되지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`에서 부호 있는 big-endian 32비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// 출력: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// 출력: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 오프셋을 더 이상 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 <= offset <= buf.length - 4`를 만족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 있는 little-endian 32비트 정수를 읽습니다.

`Buffer`에서 읽은 정수는 2의 보수 부호 있는 값으로 해석됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 오프셋과 `byteLength`를 더 이상 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 <= offset <= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. `0 < byteLength <= 6`을 만족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 `byteLength` 바이트 수를 읽고 결과를 최대 48비트 정확도를 지원하는 big-endian, 2의 보수 부호 있는 값으로 해석합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
console.log(buf.readIntBE(1, 0).toString(16));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
console.log(buf.readIntBE(1, 0).toString(16));
// ERR_OUT_OF_RANGE 오류를 발생시킵니다.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 offset 및 `byteLength`의 암시적 uint32로의 강제 변환이 더 이상 없습니다. |
| v0.11.15 | v0.11.15에 추가됨 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. `0 \< byteLength \<= 6`를 만족해야 합니다.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf`의 지정된 `offset`에서 `byteLength` 바이트 수를 읽고 결과를 최대 48비트의 정확도를 지원하는 리틀 엔디안, 2의 보수 부호 있는 값으로 해석합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUint8()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 offset의 암시적 uint32로의 강제 변환이 더 이상 없습니다. |
| v0.5.0 | v0.5.0에 추가됨 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 1`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf`의 지정된 `offset`에서 부호 없는 8비트 정수를 읽습니다.

이 함수는 `readUint8` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUint16BE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | v0.5.5에 추가됨 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 없는 빅 엔디안 16비트 정수를 읽습니다.

이 함수는 `readUint16BE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUint16LE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | v0.5.5에 추가됨 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 없는 리틀 엔디안 16비트 정수를 읽습니다.

이 함수는 `readUint16LE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUint32BE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 없는 big-endian 32비트 정수를 읽습니다.

이 함수는 `readUint32BE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Prints: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Prints: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUint32LE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 부호 없는 little-endian 32비트 정수를 읽습니다.

이 함수는 `readUint32LE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Prints: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Prints: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUintBE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고, 오프셋과 `byteLength`이 더 이상 `uint32`로 암시적으로 강제 변환되지 않습니다. |
| v0.11.15 | v0.11.15에 추가됨 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작 전 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. `0 \< byteLength \<= 6`을 만족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 `byteLength` 바이트 수를 읽고 그 결과를 최대 48비트의 정확도를 지원하는 부호 없는 빅 엔디안 정수로 해석합니다.

이 함수는 `readUintBE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// ERR_OUT_OF_RANGE를 발생시킵니다.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// ERR_OUT_OF_RANGE를 발생시킵니다.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.readUintLE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고, 오프셋과 `byteLength`이 더 이상 `uint32`로 암시적으로 강제 변환되지 않습니다. |
| v0.11.15 | v0.11.15에 추가됨 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기 시작 전 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽을 바이트 수입니다. `0 \< byteLength \<= 6`을 만족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 `offset`에서 `buf`로부터 `byteLength` 바이트 수를 읽고 그 결과를 최대 48비트의 정확도를 지원하는 부호 없는 리틀 엔디안 정수로 해석합니다.

이 함수는 `readUintLE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**Added in: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`가 시작될 위치입니다. **기본값:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`가 끝날 위치입니다(포함하지 않음). **기본값:** [`buf.length`](/ko/nodejs/api/buffer#buflength).
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

원래 `Buffer`와 동일한 메모리를 참조하지만 `start` 및 `end` 인덱스에 의해 오프셋 및 잘린 새 `Buffer`를 반환합니다.

`end`를 [`buf.length`](/ko/nodejs/api/buffer#buflength)보다 크게 지정하면 `end`가 [`buf.length`](/ko/nodejs/api/buffer#buflength)와 같은 결과가 반환됩니다.

이 메서드는 [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray)에서 상속됩니다.

새 `Buffer` 슬라이스를 수정하면 두 객체의 할당된 메모리가 겹치기 때문에 원래 `Buffer`의 메모리가 수정됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// ASCII 알파벳으로 `Buffer`를 만들고, 슬라이스를 가져와서 원래 `Buffer`에서 한 바이트를 수정합니다.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// ASCII 알파벳으로 `Buffer`를 만들고, 슬라이스를 가져와서 원래 `Buffer`에서 한 바이트를 수정합니다.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```
:::

음수 인덱스를 지정하면 슬라이스가 시작이 아닌 `buf`의 끝을 기준으로 생성됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (buf.subarray(0, 5)와 동일합니다.)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (buf.subarray(0, 4)와 동일합니다.)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (buf.subarray(1, 4)와 동일합니다.)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (buf.subarray(0, 5)와 동일합니다.)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (buf.subarray(0, 4)와 동일합니다.)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (buf.subarray(1, 4)와 동일합니다.)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.5.0, v16.15.0 | buf.slice() 메서드가 더 이상 사용되지 않습니다. |
| v7.0.0 | 모든 오프셋은 이제 계산을 수행하기 전에 정수로 강제 변환됩니다. |
| v7.1.0, v6.9.2 | 오프셋을 정수로 강제 변환하는 기능은 이제 32비트 정수 범위를 벗어나는 값을 올바르게 처리합니다. |
| v0.3.0 | 추가됨: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`가 시작될 위치입니다. **기본값:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`가 끝날 위치입니다(포함하지 않음). **기본값:** [`buf.length`](/ko/nodejs/api/buffer#buflength).
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`buf.subarray`](/ko/nodejs/api/buffer#bufsubarraystart-end)를 사용하세요.
:::

원래 `Buffer`와 동일한 메모리를 참조하지만 `start` 및 `end` 인덱스에 의해 오프셋되고 잘린 새 `Buffer`를 반환합니다.

이 메서드는 `Buffer`의 슈퍼클래스인 `Uint8Array.prototype.slice()`와 호환되지 않습니다. 슬라이스를 복사하려면 `Uint8Array.prototype.slice()`를 사용하세요.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// 출력: cuffer

console.log(buf.toString());
// 출력: buffer

// buf.slice()를 사용하면 원래 버퍼가 수정됩니다.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// 출력: cuffer
console.log(buf.toString());
// 또한 출력: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// 출력: cuffer

console.log(buf.toString());
// 출력: buffer

// buf.slice()를 사용하면 원래 버퍼가 수정됩니다.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// 출력: cuffer
console.log(buf.toString());
// 또한 출력: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**추가된 버전: v5.10.0**

- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `buf`에 대한 참조입니다.

`buf`를 부호 없는 16비트 정수 배열로 해석하고 바이트 순서를 *제자리에서* 바꿉니다. [`buf.length`](/ko/nodejs/api/buffer#buflength)가 2의 배수가 아니면 [`ERR_INVALID_BUFFER_SIZE`](/ko/nodejs/api/errors#err_invalid_buffer_size)를 발생시킵니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

`buf.swap16()`의 편리한 사용법 중 하나는 UTF-16 little-endian과 UTF-16 big-endian 간의 빠른 제자리 변환을 수행하는 것입니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**추가된 버전: v5.10.0**

- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `buf`에 대한 참조입니다.

`buf`를 부호 없는 32비트 정수 배열로 해석하고 바이트 순서를 *제자리에서* 바꿉니다. [`buf.length`](/ko/nodejs/api/buffer#buflength)가 4의 배수가 아니면 [`ERR_INVALID_BUFFER_SIZE`](/ko/nodejs/api/errors#err_invalid_buffer_size)를 발생시킵니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::


### `buf.swap64()` {#bufswap64}

**Added in: v6.3.0**

- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `buf`에 대한 참조.

`buf`를 64비트 숫자 배열로 해석하고 바이트 순서를 *제자리에서* 바꿉니다. [`buf.length`](/ko/nodejs/api/buffer#buflength)가 8의 배수가 아니면 [`ERR_INVALID_BUFFER_SIZE`](/ko/nodejs/api/errors#err_invalid_buffer_size)를 던집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**Added in: v0.9.2**

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`buf`의 JSON 표현을 반환합니다. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)는 `Buffer` 인스턴스를 문자열화할 때 이 함수를 암시적으로 호출합니다.

`Buffer.from()`은 이 메서드에서 반환된 형식의 객체를 허용합니다. 특히 `Buffer.from(buf.toJSON())`은 `Buffer.from(buf)`처럼 작동합니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**Added in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 문자 인코딩입니다. **기본값:** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 디코딩을 시작할 바이트 오프셋입니다. **기본값:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 디코딩을 중지할 바이트 오프셋입니다 (포함하지 않음). **기본값:** [`buf.length`](/ko/nodejs/api/buffer#buflength).
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`encoding`에 지정된 문자 인코딩에 따라 `buf`를 문자열로 디코딩합니다. `start` 및 `end`를 전달하여 `buf`의 하위 집합만 디코딩할 수 있습니다.

`encoding`이 `'utf8'`이고 입력의 바이트 시퀀스가 유효한 UTF-8이 아니면 각 유효하지 않은 바이트는 대체 문자 `U+FFFD`로 대체됩니다.

문자열 인스턴스의 최대 길이(UTF-16 코드 단위)는 [`buffer.constants.MAX_STRING_LENGTH`](/ko/nodejs/api/buffer#bufferconstantsmax_string_length)로 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97은 'a'에 대한 십진수 ASCII 값입니다.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```
:::


### `buf.values()` {#bufvalues}

**Added in: v1.1.0**

- 반환값: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

`buf` 값 (바이트)에 대한 [이터레이터](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)를 생성하고 반환합니다. 이 함수는 `Buffer`가 `for..of` 구문에서 사용될 때 자동으로 호출됩니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**Added in: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buf`에 쓸 문자열입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `string` 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. **기본값:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓸 최대 바이트 수입니다 (쓰여진 바이트는 `buf.length - offset`을 초과하지 않습니다). **기본값:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string`의 문자 인코딩입니다. **기본값:** `'utf8'`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰여진 바이트 수입니다.

`encoding`의 문자 인코딩에 따라 `offset`에서 `buf`에 `string`을 씁니다. `length` 매개변수는 쓸 바이트 수입니다. `buf`에 전체 문자열을 맞출 공간이 충분하지 않으면 `string`의 일부만 쓰여집니다. 그러나 부분적으로 인코딩된 문자는 쓰여지지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**추가된 버전: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 big-endian으로 `buf`에 씁니다.

`value`는 2의 보수 부호 있는 정수로 해석되어 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**추가된 버전: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 little-endian으로 `buf`에 씁니다.

`value`는 2의 보수 부호 있는 정수로 해석되어 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.10.0, v12.19.0 | 이 함수는 `buf.writeBigUint64BE()`로도 사용할 수 있습니다. |
| v12.0.0, v10.20.0 | 추가됨: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf`에 쓸 숫자.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 기록된 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 빅 엔디안으로 `buf`에 씁니다.

이 함수는 `writeBigUint64BE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.10.0, v12.19.0 | 이 함수는 `buf.writeBigUint64LE()`로도 사용할 수 있습니다. |
| v12.0.0, v10.20.0 | 추가됨: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf`에 쓸 숫자.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 기록된 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 리틀 엔디안으로 `buf`에 씁니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```
:::

이 함수는 `writeBigUint64LE` 별칭으로도 사용할 수 있습니다.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋이 `uint32`로 암시적으로 강제 변환되지 않습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 기록된 바이트 수를 더한 값입니다.

`value`를 지정된 `offset`에서 big-endian으로 `buf`에 씁니다. `value`는 JavaScript 숫자여야 합니다. `value`가 JavaScript 숫자가 아닌 경우 동작은 정의되지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋이 `uint32`로 암시적으로 강제 변환되지 않습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 8`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 기록된 바이트 수를 더한 값입니다.

`value`를 지정된 `offset`에서 little-endian으로 `buf`에 씁니다. `value`는 JavaScript 숫자여야 합니다. `value`가 JavaScript 숫자가 아닌 경우 동작은 정의되지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋이 `uint32`로 암묵적으로 강제 변환되지 않습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

`value`를 지정된 `offset`에서 `buf`에 big-endian으로 씁니다. `value`가 JavaScript 숫자가 아닌 다른 값인 경우 동작은 정의되지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋이 `uint32`로 암묵적으로 강제 변환되지 않습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

`value`를 지정된 `offset`에서 `buf`에 little-endian으로 씁니다. `value`가 JavaScript 숫자가 아닌 다른 값인 경우 동작은 정의되지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` 제거 및 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않음. |
| v0.5.0 | 추가됨: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 1`을 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 `buf`에 씁니다. `value`는 유효한 부호 있는 8비트 정수여야 합니다. `value`가 부호 있는 8비트 정수가 아닌 경우 동작은 정의되지 않습니다.

`value`는 2의 보수 부호 있는 정수로 해석되고 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` 제거 및 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않음. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 만족해야 합니다. **기본값:** `0`.
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 big-endian으로 `buf`에 씁니다. `value`는 유효한 부호 있는 16비트 정수여야 합니다. `value`가 부호 있는 16비트 정수가 아닌 경우 동작은 정의되지 않습니다.

`value`는 2의 보수 부호 있는 정수로 해석되고 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되고 오프셋이 더 이상 `uint32`로 암묵적으로 강제 변환되지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓴 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 little-endian으로 `buf`에 씁니다. `value`는 유효한 부호 있는 16비트 정수여야 합니다. `value`가 부호 있는 16비트 정수가 아닌 다른 값이면 동작이 정의되지 않습니다.

`value`는 2의 보수 부호 있는 정수로 해석되어 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되고 오프셋이 더 이상 `uint32`로 암묵적으로 강제 변환되지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓴 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 big-endian으로 `buf`에 씁니다. `value`는 유효한 부호 있는 32비트 정수여야 합니다. `value`가 부호 있는 32비트 정수가 아닌 다른 값이면 동작이 정의되지 않습니다.

`value`는 2의 보수 부호 있는 정수로 해석되어 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않습니다. |
| v0.5.5 | v0.5.5에 추가됨 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 <= offset <= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 little-endian으로 `buf`에 씁니다. `value`는 유효한 부호 있는 32비트 정수여야 합니다. `value`가 부호 있는 32비트 정수가 아닌 경우 동작은 정의되지 않습니다.

`value`는 2의 보수 부호 있는 정수로 해석되어 쓰여집니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋과 `byteLength`를 `uint32`로 암묵적으로 강제 변환하지 않습니다. |
| v0.11.15 | v0.11.15에 추가됨 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 <= offset <= buf.length - byteLength`를 충족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓸 바이트 수입니다. `0 < byteLength <= 6`을 충족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `byteLength` 바이트의 `value`를 big-endian으로 `buf`에 씁니다. 최대 48비트의 정확도를 지원합니다. `value`가 부호 있는 정수가 아닌 경우 동작은 정의되지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `noAssert`가 제거되었고 `offset`과 `byteLength`에 대한 암묵적인 `uint32` 강제 변환이 더 이상 없습니다. |
| v0.11.15 | 추가됨: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓸 바이트 수입니다. `0 \< byteLength \<= 6`을 만족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓴 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`의 `byteLength` 바이트를 리틀 엔디언으로 `buf`에 씁니다. 최대 48비트의 정확도를 지원합니다. `value`가 부호 있는 정수가 아닌 경우 동작이 정의되지 않습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUint8()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 `offset`에 대한 암묵적인 `uint32` 강제 변환이 더 이상 없습니다. |
| v0.5.0 | 추가됨: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 1`을 만족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓴 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 `buf`에 씁니다. `value`는 유효한 부호 없는 8비트 정수여야 합니다. `value`가 부호 없는 8비트 정수가 아닌 경우 동작이 정의되지 않습니다.

이 함수는 `writeUint8` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUint16BE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 big-endian으로 `buf`에 씁니다. `value`는 유효한 부호 없는 16비트 정수여야 합니다. `value`가 부호 없는 16비트 정수가 아닌 경우 동작이 정의되지 않습니다.

이 함수는 `writeUint16BE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUint16LE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | 추가됨: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 2`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`를 little-endian으로 `buf`에 씁니다. `value`는 유효한 부호 없는 16비트 정수여야 합니다. `value`가 부호 없는 16비트 정수가 아닌 경우 동작이 정의되지 않습니다.

이 함수는 `writeUint16LE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUint32BE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않습니다. |
| v0.5.5 | v0.5.5에서 추가됨 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

`value`를 빅 엔디안으로 지정된 `offset`에서 `buf`에 씁니다. `value`는 유효한 부호 없는 32비트 정수여야 합니다. `value`가 부호 없는 32비트 정수가 아닌 경우 동작은 정의되지 않습니다.

이 함수는 `writeUint32BE` 별칭으로도 사용할 수 있습니다.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUint32LE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋을 `uint32`로 암묵적으로 강제 변환하지 않습니다. |
| v0.5.5 | v0.5.5에서 추가됨 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - 4`를 충족해야 합니다. **기본값:** `0`.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓰여진 바이트 수를 더한 값입니다.

`value`를 리틀 엔디안으로 지정된 `offset`에서 `buf`에 씁니다. `value`는 유효한 부호 없는 32비트 정수여야 합니다. `value`가 부호 없는 32비트 정수가 아닌 경우 동작은 정의되지 않습니다.

이 함수는 `writeUint32LE` 별칭으로도 사용할 수 있습니다.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUintBE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋 및 `byteLength`를 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓸 바이트 수입니다. `0 \< byteLength \<= 6`를 만족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓴 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`의 `byteLength` 바이트를 빅 엔디안으로 `buf`에 씁니다. 최대 48비트의 정확도를 지원합니다. `value`가 부호 없는 정수가 아닌 경우 동작은 정의되지 않습니다.

이 함수는 `writeUintBE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0, v12.19.0 | 이 함수는 `buf.writeUintLE()`로도 사용할 수 있습니다. |
| v10.0.0 | `noAssert`가 제거되었고 더 이상 오프셋 및 `byteLength`를 `uint32`로 암시적으로 강제 변환하지 않습니다. |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`에 쓸 숫자입니다.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓰기를 시작하기 전에 건너뛸 바이트 수입니다. `0 \<= offset \<= buf.length - byteLength`를 만족해야 합니다.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쓸 바이트 수입니다. `0 \< byteLength \<= 6`를 만족해야 합니다.
- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`에 쓴 바이트 수를 더한 값입니다.

지정된 `offset`에서 `value`의 `byteLength` 바이트를 리틀 엔디안으로 `buf`에 씁니다. 최대 48비트의 정확도를 지원합니다. `value`가 부호 없는 정수가 아닌 경우 동작은 정의되지 않습니다.

이 함수는 `writeUintLE` 별칭으로도 사용할 수 있습니다.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 이 생성자를 호출하면 `node_modules` 디렉터리 외부의 코드에서 실행될 때 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v7.2.1 | 이 생성자를 호출하면 더 이상 사용되지 않는다는 경고가 표시되지 않습니다. |
| v7.0.0 | 이 생성자를 호출하면 이제 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v6.0.0 | 더 이상 사용되지 않음: v6.0.0 이후 |
:::

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray)를 사용하세요.
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 복사할 바이트 배열입니다.

[`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray)를 참조하세요.

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 이 생성자를 호출하면 `node_modules` 디렉터리 외부의 코드에서 실행될 때 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v7.2.1 | 이 생성자를 호출하면 더 이상 사용되지 않는다는 경고가 표시되지 않습니다. |
| v7.0.0 | 이 생성자를 호출하면 이제 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v6.0.0 | 이제 `byteOffset` 및 `length` 매개변수가 지원됩니다. |
| v6.0.0 | 더 이상 사용되지 않음: v6.0.0 이후 |
| v3.0.0 | 추가됨: v3.0.0 |
:::

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ko/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)를 사용하세요.
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 또는 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)의 `.buffer` 속성입니다.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 노출할 첫 번째 바이트의 인덱스입니다. **기본값:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 노출할 바이트 수입니다. **기본값:** `arrayBuffer.byteLength - byteOffset`.

[`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ko/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)를 참조하세요.


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `node_modules` 디렉터리 외부의 코드에서 실행될 때 이 생성자를 호출하면 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v7.2.1 | 이 생성자를 호출해도 더 이상 사용되지 않는다는 경고가 표시되지 않습니다. |
| v7.0.0 | 이 생성자를 호출하면 이제 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v6.0.0 | 더 이상 사용되지 않음: v6.0.0부터 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`Buffer.from(buffer)`](/ko/nodejs/api/buffer#static-method-bufferfrombuffer)를 사용하세요.
:::

- `buffer` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 데이터를 복사할 기존 `Buffer` 또는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)입니다.

[`Buffer.from(buffer)`](/ko/nodejs/api/buffer#static-method-bufferfrombuffer)를 참조하세요.

### `new Buffer(size)` {#new-buffersize}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `node_modules` 디렉터리 외부의 코드에서 실행될 때 이 생성자를 호출하면 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v8.0.0 | `new Buffer(size)`는 기본적으로 0으로 채워진 메모리를 반환합니다. |
| v7.2.1 | 이 생성자를 호출해도 더 이상 사용되지 않는다는 경고가 표시되지 않습니다. |
| v7.0.0 | 이 생성자를 호출하면 이제 더 이상 사용되지 않는다는 경고가 표시됩니다. |
| v6.0.0 | 더 이상 사용되지 않음: v6.0.0부터 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`Buffer.alloc()`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)를 사용하세요(또한 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize) 참조).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `Buffer`의 원하는 길이입니다.

[`Buffer.alloc()`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 및 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)를 참조하세요. 이 생성자의 변형은 [`Buffer.alloc()`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)와 동일합니다.


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v10.0.0 | 이 생성자를 `node_modules` 디렉터리 외부 코드에서 호출하면 폐기 경고가 발생합니다. |
| v7.2.1 | 이 생성자를 호출해도 더 이상 폐기 경고가 발생하지 않습니다. |
| v7.0.0 | 이제 이 생성자를 호출하면 폐기 경고가 발생합니다. |
| v6.0.0 | 폐기된 버전: v6.0.0 |
:::

::: danger [안정성: 0 - 폐기됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 폐기됨: 대신 [`Buffer.from(string[, encoding])`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding)을 사용하세요.
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인코딩할 문자열입니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string`의 인코딩입니다. **기본값:** `'utf8'`.

[`Buffer.from(string[, encoding])`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding)을 참조하세요.

## 클래스: `File` {#class-file}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v23.0.0 | File 인스턴스를 복제 가능하게 만듭니다. |
| v20.0.0 | 더 이상 실험적이지 않습니다. |
| v19.2.0, v18.13.0 | 추가됨: v19.2.0, v18.13.0 |
:::

- 확장: [\<Blob\>](/ko/nodejs/api/buffer#class-blob)

[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)은 파일에 대한 정보를 제공합니다.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**추가됨: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ko/nodejs/api/buffer#class-blob) | [\<File[]\>](/ko/nodejs/api/buffer#class-file) 문자열, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/ko/nodejs/api/buffer#class-file) 또는 [\<Blob\>](/ko/nodejs/api/buffer#class-blob) 객체의 배열 또는 이러한 객체의 혼합으로, `File` 내부에 저장됩니다.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파일 이름입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'transparent'` 또는 `'native'` 중 하나입니다. `'native'`로 설정하면 문자열 소스 부분의 줄 바꿈이 `require('node:os').EOL`에 지정된 플랫폼 기본 줄 바꿈으로 변환됩니다.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파일 콘텐츠 유형입니다.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일의 마지막 수정 날짜입니다. **기본값:** `Date.now()`.


### `file.name` {#filename}

**추가된 버전: v19.2.0, v18.13.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`File`의 이름입니다.

### `file.lastModified` {#filelastmodified}

**추가된 버전: v19.2.0, v18.13.0**

- 타입: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`File`의 마지막 수정 날짜입니다.

## `node:buffer` 모듈 API {#nodebuffer-module-apis}

`Buffer` 객체는 전역으로 사용할 수 있지만, `Buffer` 관련 추가 API는 `require('node:buffer')`를 사용하여 접근하는 `node:buffer` 모듈을 통해서만 사용할 수 있습니다.

### `buffer.atob(data)` {#bufferatobdata}

**추가된 버전: v15.13.0, v14.17.0**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시. 대신 `Buffer.from(data, 'base64')`를 사용하세요.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Base64로 인코딩된 입력 문자열.

Base64로 인코딩된 데이터 문자열을 바이트로 디코딩하고, 해당 바이트를 Latin-1 (ISO-8859-1)을 사용하여 문자열로 인코딩합니다.

`data`는 문자열로 강제 변환될 수 있는 모든 JavaScript 값일 수 있습니다.

**이 함수는 레거시 웹 플랫폼 API와의 호환성을 위해서만 제공되며, 새로운 코드에서는 절대 사용해서는 안 됩니다. 왜냐하면 문자열을 사용하여 이진 데이터를 나타내고 JavaScript의 타입 배열 도입 이전의 것이기 때문입니다. Node.js API를 사용하여 실행되는 코드의 경우, base64로 인코딩된 문자열과 이진 데이터 간의 변환은 <code>Buffer.from(str, 'base64')</code>와 <code>buf.toString('base64')</code>를 사용하여 수행해야 합니다.**

### `buffer.btoa(data)` {#bufferbtoadata}

**추가된 버전: v15.13.0, v14.17.0**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시. 대신 `buf.toString('base64')`를 사용하세요.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ASCII (Latin1) 문자열.

Latin-1 (ISO-8859)을 사용하여 문자열을 바이트로 디코딩하고, 해당 바이트를 Base64를 사용하여 문자열로 인코딩합니다.

`data`는 문자열로 강제 변환될 수 있는 모든 JavaScript 값일 수 있습니다.

**이 함수는 레거시 웹 플랫폼 API와의 호환성을 위해서만 제공되며, 새로운 코드에서는 절대 사용해서는 안 됩니다. 왜냐하면 문자열을 사용하여 이진 데이터를 나타내고 JavaScript의 타입 배열 도입 이전의 것이기 때문입니다. Node.js API를 사용하여 실행되는 코드의 경우, base64로 인코딩된 문자열과 이진 데이터 간의 변환은 <code>Buffer.from(str, 'base64')</code>와 <code>buf.toString('base64')</code>를 사용하여 수행해야 합니다.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Added in: v19.6.0, v18.15.0**

- input [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 유효성을 검사할 입력.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 함수는 `input`이 비어 있는 경우를 포함하여 유효한 ASCII 인코딩 데이터만 포함하는 경우 `true`를 반환합니다.

`input`이 분리된 array buffer인 경우 오류를 던집니다.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Added in: v19.4.0, v18.14.0**

- input [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 유효성을 검사할 입력.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 함수는 `input`이 비어 있는 경우를 포함하여 유효한 UTF-8 인코딩 데이터만 포함하는 경우 `true`를 반환합니다.

`input`이 분리된 array buffer인 경우 오류를 던집니다.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Added in: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `50`

`buf.inspect()`가 호출될 때 반환될 최대 바이트 수를 반환합니다. 이는 사용자 모듈에서 재정의할 수 있습니다. `buf.inspect()` 동작에 대한 자세한 내용은 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)를 참조하십시오.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Added in: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 단일 `Buffer` 인스턴스에 허용되는 최대 크기입니다.

[`buffer.constants.MAX_LENGTH`](/ko/nodejs/api/buffer#bufferconstantsmax_length)의 별칭입니다.

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Added in: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 단일 `string` 인스턴스에 허용되는 최대 길이입니다.

[`buffer.constants.MAX_STRING_LENGTH`](/ko/nodejs/api/buffer#bufferconstantsmax_string_length)의 별칭입니다.


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Added in: v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `URL.createObjectURL()`에 대한 이전 호출에서 반환된 `'blob:nodedata:...` URL 문자열입니다.
- 반환: [\<Blob\>](/ko/nodejs/api/buffer#class-blob)

`URL.createObjectURL()`에 대한 이전 호출을 사용하여 등록된 연결된 [\<Blob\>](/ko/nodejs/api/buffer#class-blob) 객체인 `'blob:nodedata:...'`를 확인합니다.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 이제 `source` 매개변수가 `Uint8Array`일 수 있습니다. |
| v7.1.0 | Added in: v7.1.0 |
:::

- `source` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` 또는 `Uint8Array` 인스턴스입니다.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 인코딩입니다.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 대상 인코딩입니다.
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

주어진 `Buffer` 또는 `Uint8Array` 인스턴스를 한 문자 인코딩에서 다른 문자 인코딩으로 다시 인코딩합니다. 새 `Buffer` 인스턴스를 반환합니다.

`fromEnc` 또는 `toEnc`가 유효하지 않은 문자 인코딩을 지정하거나 `fromEnc`에서 `toEnc`로의 변환이 허용되지 않는 경우 오류를 발생시킵니다.

`buffer.transcode()`에서 지원하는 인코딩은 `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` 및 `'binary'`입니다.

트랜스코딩 프로세스는 주어진 바이트 시퀀스가 대상 인코딩으로 적절하게 표현될 수 없는 경우 대체 문자를 사용합니다. 예를 들어:

::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

유로(`€`) 기호는 US-ASCII로 표현할 수 없기 때문에 트랜스코딩된 `Buffer`에서 `?`로 대체됩니다.


### 클래스: `SlowBuffer` {#class-slowbuffer}

**지원 중단: v6.0.0 이후**

::: danger [안정성: 0 - 지원 중단]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단: 대신 [`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)를 사용하세요.
:::

[`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)를 참조하세요. 이것은 생성자가 `SlowBuffer` 인스턴스 대신 항상 `Buffer` 인스턴스를 반환한다는 의미에서 클래스가 아니었습니다.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**지원 중단: v6.0.0 이후**

::: danger [안정성: 0 - 지원 중단]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단: 대신 [`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)를 사용하세요.
:::

- `size` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새 `SlowBuffer`의 원하는 길이입니다.

[`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)를 참조하세요.

### Buffer 상수 {#buffer-constants}

**추가됨: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 64비트 아키텍처에서 값이 2 - 1로 변경되었습니다. |
| v15.0.0 | 64비트 아키텍처에서 값이 2로 변경되었습니다. |
| v14.0.0 | 64비트 아키텍처에서 값이 2 - 1에서 2 - 1로 변경되었습니다. |
| v8.2.0 | 추가됨: v8.2.0 |
:::

- [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 단일 `Buffer` 인스턴스에 허용되는 최대 크기입니다.

32비트 아키텍처에서 이 값은 현재 2 - 1(약 1GiB)입니다.

64비트 아키텍처에서 이 값은 현재 2 - 1(약 8PiB)입니다.

내부적으로 [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0)를 반영합니다.

이 값은 [`buffer.kMaxLength`](/ko/nodejs/api/buffer#bufferkmaxlength)로도 사용할 수 있습니다.

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**추가됨: v8.2.0**

- [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 단일 `string` 인스턴스에 허용되는 최대 길이입니다.

`string` 기본 형식이 가질 수 있는 최대 `length`를 UTF-16 코드 단위로 계산하여 나타냅니다.

이 값은 사용 중인 JS 엔진에 따라 달라질 수 있습니다.


## `Buffer.from()`, `Buffer.alloc()`, 및 `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

Node.js 6.0.0 이전 버전에서는 `Buffer` 인스턴스가 `Buffer` 생성자 함수를 사용하여 생성되었으며, 반환된 `Buffer`는 제공된 인수에 따라 다르게 할당되었습니다.

- 숫자를 `Buffer()`에 대한 첫 번째 인수로 전달하면 (예: `new Buffer(10)`) 지정된 크기의 새 `Buffer` 객체가 할당됩니다. Node.js 8.0.0 이전에는 이러한 `Buffer` 인스턴스에 할당된 메모리가 *초기화되지 않으며 민감한 데이터를 포함할 수 있습니다*. 이러한 `Buffer` 인스턴스는 [`buf.fill(0)`](/ko/nodejs/api/buffer#buffillvalue-offset-end-encoding)을 사용하거나 `Buffer`에서 데이터를 읽기 전에 전체 `Buffer`에 써서 초기화해야 합니다. 이 동작은 성능 향상을 위한 *의도적인* 것이지만, 개발 경험상 빠르지만 초기화되지 않은 `Buffer`를 만드는 것과 느리지만 더 안전한 `Buffer`를 만드는 것 사이에는 더 명확한 구분이 필요합니다. Node.js 8.0.0부터는 `Buffer(num)` 및 `new Buffer(num)`이 초기화된 메모리를 가진 `Buffer`를 반환합니다.
- 문자열, 배열 또는 `Buffer`를 첫 번째 인수로 전달하면 전달된 객체의 데이터가 `Buffer`에 복사됩니다.
- [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 또는 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)를 전달하면 주어진 배열 버퍼와 할당된 메모리를 공유하는 `Buffer`가 반환됩니다.

`new Buffer()`의 동작은 첫 번째 인수의 유형에 따라 다르기 때문에 인수 유효성 검사 또는 `Buffer` 초기화가 수행되지 않으면 보안 및 안정성 문제가 애플리케이션에 부주의하게 도입될 수 있습니다.

예를 들어 공격자가 애플리케이션이 문자열이 예상되는 곳에서 숫자를 수신하도록 만들 수 있는 경우 애플리케이션은 `new Buffer("100")` 대신 `new Buffer(100)`을 호출하여 내용 `"100"`이 있는 3바이트 버퍼를 할당하는 대신 100바이트 버퍼를 할당하게 될 수 있습니다. 이는 일반적으로 JSON API 호출을 사용하여 가능합니다. JSON은 숫자 및 문자열 유형을 구별하므로 입력을 충분히 검증하지 않는 순진하게 작성된 애플리케이션이 항상 문자열을 수신할 것으로 예상하는 경우 숫자를 주입할 수 있습니다. Node.js 8.0.0 이전에는 100바이트 버퍼에 임의의 기존 메모리 내 데이터가 포함될 수 있으므로 메모리 내 비밀을 원격 공격자에게 노출하는 데 사용될 수 있습니다. Node.js 8.0.0부터는 데이터가 0으로 채워지기 때문에 메모리 노출이 발생할 수 없습니다. 그러나 서버에서 매우 큰 버퍼를 할당하게 하여 성능 저하나 메모리 고갈로 인한 충돌과 같은 다른 공격이 여전히 가능합니다.

`Buffer` 인스턴스 생성을 더 안정적이고 오류가 덜 발생하도록 하기 위해 `new Buffer()` 생성자의 다양한 형태는 **더 이상 사용되지 않으며** 별도의 `Buffer.from()`, [`Buffer.alloc()`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 및 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize) 메서드로 대체되었습니다.

*개발자는 <code>new Buffer()</code> 생성자의 기존 사용법을 모두
이러한 새로운 API 중 하나로 마이그레이션해야 합니다.*

- [`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray)는 제공된 옥텟의 *복사본을 포함하는* 새 `Buffer`를 반환합니다.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ko/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)는 주어진 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)와 *동일한 할당된 메모리를 공유하는* 새 `Buffer`를 반환합니다.
- [`Buffer.from(buffer)`](/ko/nodejs/api/buffer#static-method-bufferfrombuffer)는 주어진 `Buffer`의 내용의 *복사본을 포함하는* 새 `Buffer`를 반환합니다.
- [`Buffer.from(string[, encoding])`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding)는 제공된 문자열의 *복사본을 포함하는* 새 `Buffer`를 반환합니다.
- [`Buffer.alloc(size[, fill[, encoding]])`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)는 지정된 크기의 새로 초기화된 `Buffer`를 반환합니다. 이 메서드는 [`Buffer.allocUnsafe(size)`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)보다 느리지만 새로 생성된 `Buffer` 인스턴스가 잠재적으로 민감한 이전 데이터를 포함하지 않도록 보장합니다. `size`가 숫자가 아니면 `TypeError`가 발생합니다.
- [`Buffer.allocUnsafe(size)`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize) 및 [`Buffer.allocUnsafeSlow(size)`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)는 각각 지정된 `size`의 새로 초기화되지 않은 `Buffer`를 반환합니다. `Buffer`가 초기화되지 않았기 때문에 할당된 메모리 세그먼트에 잠재적으로 민감한 이전 데이터가 포함될 수 있습니다.

[`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/ko/nodejs/api/buffer#static-method-bufferconcatlist-totallength) 및 [`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray)에서 반환된 `Buffer` 인스턴스는 `size`가 [`Buffer.poolSize`](/ko/nodejs/api/buffer#class-property-bufferpoolsize)의 절반 이하인 경우 공유 내부 메모리 풀에서 할당될 *수 있습니다*. [`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)에서 반환된 인스턴스는 공유 내부 메모리 풀을 *절대* 사용하지 않습니다.


### `--zero-fill-buffers` 명령줄 옵션 {#the---zero-fill-buffers-command-line-option}

**추가된 버전: v5.10.0**

Node.js는 `--zero-fill-buffers` 명령줄 옵션을 사용하여 시작할 수 있으며, 이렇게 하면 새로 할당된 모든 `Buffer` 인스턴스가 생성 시 기본적으로 0으로 채워집니다. 옵션이 없으면 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) 및 `new SlowBuffer(size)`로 생성된 버퍼는 0으로 채워지지 않습니다. 이 플래그를 사용하면 성능에 상당한 부정적인 영향을 미칠 수 있습니다. 새로 할당된 `Buffer` 인스턴스에 잠재적으로 민감한 이전 데이터가 포함될 수 없도록 해야 하는 경우에만 `--zero-fill-buffers` 옵션을 사용하십시오.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### `Buffer.allocUnsafe()` 및 `Buffer.allocUnsafeSlow()`가 "안전하지 않은" 이유는 무엇입니까? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

[`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize) 및 [`Buffer.allocUnsafeSlow()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)를 호출할 때 할당된 메모리 세그먼트는 *초기화되지 않습니다*(0으로 채워지지 않음). 이 설계로 인해 메모리 할당이 매우 빠르지만 할당된 메모리 세그먼트에는 잠재적으로 민감한 이전 데이터가 포함될 수 있습니다. 메모리를 *완전히* 덮어쓰지 않고 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)로 생성된 `Buffer`를 사용하면 `Buffer` 메모리를 읽을 때 이 이전 데이터가 유출될 수 있습니다.

[`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)를 사용하면 명확한 성능상의 이점이 있지만 애플리케이션에 보안 취약점을 도입하지 않도록 각별한 주의를 기울여야 *합니다*.

