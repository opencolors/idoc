---
title: Node.js 文档 - 字符串解码器
description: 字符串解码器模块提供了一个 API，用于将 Buffer 对象解码成字符串，优化了字符串的内部字符编码。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 字符串解码器 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 字符串解码器模块提供了一个 API，用于将 Buffer 对象解码成字符串，优化了字符串的内部字符编码。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 字符串解码器 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 字符串解码器模块提供了一个 API，用于将 Buffer 对象解码成字符串，优化了字符串的内部字符编码。
---


# 字符串解码器 {#string-decoder}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

`node:string_decoder` 模块提供了一个 API，用于以保留编码的多字节 UTF-8 和 UTF-16 字符的方式将 `Buffer` 对象解码为字符串。 它可以使用以下方式访问：

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

以下示例展示了 `StringDecoder` 类的基本用法。

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // 打印: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // 打印: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // 打印: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // 打印: €
```
:::

当 `Buffer` 实例被写入 `StringDecoder` 实例时，会使用一个内部缓冲区来确保解码后的字符串不包含任何不完整的多字节字符。 这些字符会保存在缓冲区中，直到下次调用 `stringDecoder.write()` 或调用 `stringDecoder.end()`。

在以下示例中，欧洲欧元符号 (`€`) 的三个 UTF-8 编码字节通过三个单独的操作写入：

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // 打印: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // 打印: €
```
:::


## 类: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**添加于: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `StringDecoder` 将使用的字符[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。 **默认值:** `'utf8'`。

创建一个新的 `StringDecoder` 实例。

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**添加于: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 要解码的字节。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

将存储在内部缓冲区中的任何剩余输入作为字符串返回。 表示不完整的 UTF-8 和 UTF-16 字符的字节将被替换为适合字符编码的替换字符。

如果提供了 `buffer` 参数，则在返回剩余输入之前，将执行对 `stringDecoder.write()` 的最后一次调用。 在调用 `end()` 之后，`stringDecoder` 对象可以重用于新的输入。

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 现在，每个无效字符都由单个替换字符替换，而不是每个单独的字节一个。 |
| v0.1.99 | 添加于: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 要解码的字节。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回一个解码后的字符串，确保 `Buffer`、`TypedArray` 或 `DataView` 末尾的任何不完整的多字节字符都从返回的字符串中省略，并存储在内部缓冲区中，以供下次调用 `stringDecoder.write()` 或 `stringDecoder.end()` 时使用。

