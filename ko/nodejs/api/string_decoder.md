---
title: Node.js 문서 - 문자열 디코더
description: 문자열 디코더 모듈은 Buffer 객체를 문자열로 디코딩하기 위한 API를 제공하며, 문자열의 내부 문자 인코딩에 최적화되어 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 문자열 디코더 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 문자열 디코더 모듈은 Buffer 객체를 문자열로 디코딩하기 위한 API를 제공하며, 문자열의 내부 문자 인코딩에 최적화되어 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 문자열 디코더 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 문자열 디코더 모듈은 Buffer 객체를 문자열로 디코딩하기 위한 API를 제공하며, 문자열의 내부 문자 인코딩에 최적화되어 있습니다.
---


# 문자열 디코더 {#string-decoder}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

`node:string_decoder` 모듈은 인코딩된 멀티바이트 UTF-8 및 UTF-16 문자를 보존하는 방식으로 `Buffer` 객체를 문자열로 디코딩하기 위한 API를 제공합니다. 다음과 같이 접근할 수 있습니다.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

다음 예제는 `StringDecoder` 클래스의 기본 사용법을 보여줍니다.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```
:::

`Buffer` 인스턴스가 `StringDecoder` 인스턴스에 쓰여지면 디코딩된 문자열에 불완전한 멀티바이트 문자가 포함되지 않도록 내부 버퍼가 사용됩니다. 이들은 다음 `stringDecoder.write()` 호출 또는 `stringDecoder.end()` 호출까지 버퍼에 보관됩니다.

다음 예에서는 유럽 유로 기호(`€`)의 3개의 UTF-8 인코딩된 바이트가 3개의 개별 작업으로 쓰여집니다.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```
:::


## 클래스: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**추가된 버전: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `StringDecoder`가 사용할 문자 [인코딩](/ko/nodejs/api/buffer#buffers-and-character-encodings)입니다. **기본값:** `'utf8'`.

새로운 `StringDecoder` 인스턴스를 만듭니다.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**추가된 버전: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 디코딩할 바이트입니다.
- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

내부 버퍼에 저장된 나머지 입력을 문자열로 반환합니다. 불완전한 UTF-8 및 UTF-16 문자를 나타내는 바이트는 문자 인코딩에 적절한 대체 문자로 대체됩니다.

`buffer` 인수가 제공되면 나머지 입력을 반환하기 전에 `stringDecoder.write()`에 대한 마지막 호출이 수행됩니다. `end()`가 호출된 후에는 새 입력에 대해 `stringDecoder` 객체를 재사용할 수 있습니다.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 각 유효하지 않은 문자는 이제 각 개별 바이트 대신 단일 대체 문자로 대체됩니다. |
| v0.1.99 | 추가된 버전: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 디코딩할 바이트입니다.
- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

디코딩된 문자열을 반환하며, `Buffer`, `TypedArray` 또는 `DataView` 끝에 있는 불완전한 멀티바이트 문자는 반환된 문자열에서 생략되고 `stringDecoder.write()` 또는 `stringDecoder.end()`에 대한 다음 호출을 위해 내부 버퍼에 저장됩니다.

