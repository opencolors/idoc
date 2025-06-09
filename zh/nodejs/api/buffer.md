---
title: Node.js Buffer 文档
description: Node.js Buffer 文档详细介绍了如何在 Node.js 中处理二进制数据，包括创建、操作和转换缓冲区。
head:
  - - meta
    - name: og:title
      content: Node.js Buffer 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js Buffer 文档详细介绍了如何在 Node.js 中处理二进制数据，包括创建、操作和转换缓冲区。
  - - meta
    - name: twitter:title
      content: Node.js Buffer 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js Buffer 文档详细介绍了如何在 Node.js 中处理二进制数据，包括创建、操作和转换缓冲区。
---


# Buffer {#buffer}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

`Buffer` 对象用于表示固定长度的字节序列。 许多 Node.js API 支持 `Buffer`。

`Buffer` 类是 JavaScript 的 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 类的子类，并通过涵盖其他用例的方法对其进行扩展。 Node.js API 接受普通的 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)，只要支持 `Buffer`。

虽然 `Buffer` 类在全局范围内可用，但仍然建议通过导入或 require 语句显式引用它。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 创建一个长度为 10 的零填充 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10 的 Buffer，
// 填充的字节都具有值 `1`。
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10 的未初始化 buffer。
// 这比调用 Buffer.alloc() 更快，但返回的
// Buffer 实例可能包含旧数据，需要使用 fill()、write() 或其他填充 Buffer
// 内容的函数覆盖。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含字节 [1, 2, 3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含字节 [1, 1, 1, 1] 的 Buffer – 这些条目
// 都使用 `(value & 255)` 截断以适应 0–255 的范围。
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 创建一个包含字符串“tést”的 UTF-8 编码字节的 Buffer：
// [0x74, 0xc3, 0xa9, 0x73, 0x74]（十六进制表示法）
// [116, 195, 169, 115, 116]（十进制表示法）
const buf6 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 创建一个长度为 10 的零填充 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10 的 Buffer，
// 填充的字节都具有值 `1`。
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10 的未初始化 buffer。
// 这比调用 Buffer.alloc() 更快，但返回的
// Buffer 实例可能包含旧数据，需要使用 fill()、write() 或其他填充 Buffer
// 内容的函数覆盖。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含字节 [1, 2, 3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含字节 [1, 1, 1, 1] 的 Buffer – 这些条目
// 都使用 `(value & 255)` 截断以适应 0–255 的范围。
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 创建一个包含字符串“tést”的 UTF-8 编码字节的 Buffer：
// [0x74, 0xc3, 0xa9, 0x73, 0x74]（十六进制表示法）
// [116, 195, 169, 115, 116]（十进制表示法）
const buf6 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## 缓冲区和字符编码 {#buffers-and-character-encodings}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.7.0, v14.18.0 | 引入了 `base64url` 编码。 |
| v6.4.0 | 引入了 `latin1` 作为 `binary` 的别名。 |
| v5.0.0 | 移除了已弃用的 `raw` 和 `raws` 编码。 |
:::

在 `Buffer` 和字符串之间转换时，可以指定字符编码。 如果未指定字符编码，则默认使用 UTF-8。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// 打印: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// 打印: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// 打印: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// 打印: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// 打印: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// 打印: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// 打印: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// 打印: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Node.js 缓冲区接受它们收到的编码字符串的所有大小写变体。 例如，UTF-8 可以指定为 `'utf8'`、`'UTF8'` 或 `'uTf8'`。

Node.js 当前支持的字符编码如下：

- `'utf8'`（别名：`'utf-8'`）：多字节编码的 Unicode 字符。 许多网页和其他文档格式都使用 [UTF-8](https://en.wikipedia.org/wiki/UTF-8)。 这是默认的字符编码。 当将 `Buffer` 解码为不完全包含有效 UTF-8 数据的字符串时，Unicode 替换字符 `U+FFFD` � 将用于表示这些错误。
- `'utf16le'`（别名：`'utf-16le'`）：多字节编码的 Unicode 字符。 与 `'utf8'` 不同，字符串中的每个字符都将使用 2 个或 4 个字节进行编码。 Node.js 仅支持 [UTF-16](https://en.wikipedia.org/wiki/UTF-16) 的 [小端](https://en.wikipedia.org/wiki/Endianness) 变体。
- `'latin1'`：Latin-1 代表 [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1)。 此字符编码仅支持从 `U+0000` 到 `U+00FF` 的 Unicode 字符。 每个字符都使用单个字节进行编码。 不符合该范围的字符将被截断，并将映射到该范围内的字符。

使用上述方法之一将 `Buffer` 转换为字符串称为解码，将字符串转换为 `Buffer` 称为编码。

Node.js 还支持以下二进制到文本的编码。 对于二进制到文本的编码，命名约定是相反的：将 `Buffer` 转换为字符串通常称为编码，而将字符串转换为 `Buffer` 称为解码。

- `'base64'`：[Base64](https://en.wikipedia.org/wiki/Base64) 编码。 从字符串创建 `Buffer` 时，此编码也将正确地接受 [RFC 4648，第 5 节](https://tools.ietf.org/html/rfc4648#section-5) 中指定的“URL 和文件名安全字母”。 空格字符（如空格、制表符和换行符）包含在 base64 编码的字符串中，将被忽略。
- `'base64url'`： [base64url](https://tools.ietf.org/html/rfc4648#section-5) 编码，如 [RFC 4648，第 5 节](https://tools.ietf.org/html/rfc4648#section-5) 中指定。 从字符串创建 `Buffer` 时，此编码也将正确地接受常规的 base64 编码字符串。 将 `Buffer` 编码为字符串时，此编码将省略填充。
- `'hex'`：将每个字节编码为两个十六进制字符。 当解码不完全由偶数个十六进制字符组成的字符串时，可能会发生数据截断。 请参见下面的示例。

以下旧版字符编码也受支持：

- `'ascii'`：仅适用于 7 位 [ASCII](https://en.wikipedia.org/wiki/ASCII) 数据。 将字符串编码为 `Buffer` 时，这等效于使用 `'latin1'`。 将 `Buffer` 解码为字符串时，使用此编码还会额外取消设置每个字节的最高位，然后再解码为 `'latin1'`。 通常，不应该有理由使用此编码，因为 `'utf8'`（或者，如果已知数据始终仅为 ASCII，则 `'latin1'`）将在编码或解码仅为 ASCII 的文本时是更好的选择。 仅提供用于旧版兼容性。
- `'binary'`：`'latin1'` 的别名。 此编码的名称可能非常具有误导性，因为此处列出的所有编码都在字符串和二进制数据之间进行转换。 对于在字符串和 `Buffer` 之间进行转换，通常 `'utf8'` 是正确的选择。
- `'ucs2'`、`'ucs-2'`：`'utf16le'` 的别名。 UCS-2 过去指的是 UTF-16 的一种变体，该变体不支持代码点大于 U+FFFF 的字符。 在 Node.js 中，始终支持这些代码点。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// 打印 <Buffer 1a>，当遇到第一个非十六进制值 ('g') 时数据被截断。

Buffer.from('1a7', 'hex');
// 打印 <Buffer 1a>，当数据以单个数字 ('7') 结尾时数据被截断。

Buffer.from('1634', 'hex');
// 打印 <Buffer 16 34>，所有数据都表示出来。
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// 打印 <Buffer 1a>，当遇到第一个非十六进制值 ('g') 时数据被截断。

Buffer.from('1a7', 'hex');
// 打印 <Buffer 1a>，当数据以单个数字 ('7') 结尾时数据被截断。

Buffer.from('1634', 'hex');
// 打印 <Buffer 16 34>，所有数据都表示出来。
```
:::

现代 Web 浏览器遵循 [WHATWG 编码标准](https://encoding.spec.whatwg.org/)，该标准将 `'latin1'` 和 `'ISO-8859-1'` 都别名为 `'win-1252'`。 这意味着在执行类似 `http.get()` 的操作时，如果返回的字符集是 WHATWG 规范中列出的字符集之一，则服务器实际上可能返回了 `'win-1252'` 编码的数据，并且使用 `'latin1'` 编码可能会错误地解码字符。


## Buffers 和类型化数组 {#buffers-and-typedarrays}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v3.0.0 | `Buffer` 类现在继承自 `Uint8Array`。 |
:::

`Buffer` 实例也是 JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 和 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例。所有 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 方法都可在 `Buffer` 上使用。 然而，`Buffer` API 和 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) API 之间存在细微的不兼容之处。

特别是：

- 虽然 [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) 创建 `TypedArray` 部分的副本，但 [`Buffer.prototype.slice()`](/zh/nodejs/api/buffer#bufslicestart-end) 创建对现有 `Buffer` 的视图，而不进行复制。 这种行为可能会令人惊讶，并且仅存在于旧版兼容性。 [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) 可用于在 `Buffer` 和其他 `TypedArray` 上实现 [`Buffer.prototype.slice()`](/zh/nodejs/api/buffer#bufslicestart-end) 的行为，应优先使用。
- [`buf.toString()`](/zh/nodejs/api/buffer#buftostringencoding-start-end) 与其 `TypedArray` 等效项不兼容。
- 许多方法，例如 [`buf.indexOf()`](/zh/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)，支持额外的参数。

有两种方法可以从 `Buffer` 创建新的 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例：

- 将 `Buffer` 传递给 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 构造函数将复制 `Buffer` 的内容，将其解释为整数数组，而不是目标类型的字节序列。



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

- 传递 `Buffer` 的底层 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 将创建一个 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，它与 `Buffer` 共享其内存。



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

可以通过以相同的方式使用 `TypedArray` 对象的 `.buffer` 属性来创建一个新的 `Buffer`，该 `Buffer` 与 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例共享相同的分配内存。 在此上下文中，[`Buffer.from()`](/zh/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) 的行为类似于 `new Uint8Array()`。



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

使用 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 的 `.buffer` 创建 `Buffer` 时，可以通过传入 `byteOffset` 和 `length` 参数来仅使用底层 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 的一部分。



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

`Buffer.from()` 和 [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) 具有不同的签名和实现。 具体来说，[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 变体接受第二个参数，该参数是映射函数，该函数在类型化数组的每个元素上调用：

- `TypedArray.from(source[, mapFn[, thisArg]])`

但是，`Buffer.from()` 方法不支持使用映射函数：

- [`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/zh/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/zh/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## 缓冲区和迭代 {#buffers-and-iteration}

可以使用 `for..of` 语法迭代 `Buffer` 实例：

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

此外，可以使用 [`buf.values()`](/zh/nodejs/api/buffer#bufvalues)、[`buf.keys()`](/zh/nodejs/api/buffer#bufkeys) 和 [`buf.entries()`](/zh/nodejs/api/buffer#bufentries) 方法来创建迭代器。

## 类：`Blob` {#class-blob}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0, v16.17.0 | 不再是实验性的。 |
| v15.7.0, v14.18.0 | 添加于：v15.7.0, v14.18.0 |
:::

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) 封装了不可变的原始数据，可以在多个工作线程之间安全地共享。

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.7.0 | 添加了标准的 `endings` 选项来替换行尾，并删除了非标准的 `encoding` 选项。 |
| v15.7.0, v14.18.0 | 添加于：v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/zh/nodejs/api/buffer#class-blob) 字符串，[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)，[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 或 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 对象的数组，或此类对象的任意组合，将存储在 `Blob` 中。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'transparent'` 或 `'native'` 之一。 当设置为 `'native'` 时，字符串源部分中的行尾将转换为平台原生行尾，如 `require('node:os').EOL` 所指定。
  - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob 内容类型。 `type` 的目的是传达数据的 MIME 媒体类型，但是不执行类型格式的验证。

创建一个新的 `Blob` 对象，其中包含给定源的串联。

[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)，[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 和 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 源被复制到 'Blob' 中，因此可以在创建 'Blob' 后安全地修改它们。

字符串源被编码为 UTF-8 字节序列并复制到 Blob 中。 每个字符串部分中不匹配的代理对将被替换为 Unicode U+FFFD 替换字符。


### `blob.arrayBuffer()` {#blobarraybuffer}

**新增于: v15.7.0, v14.18.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

返回一个 promise，其结果为一个包含 `Blob` 数据副本的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

#### `blob.bytes()` {#blobbytes}

**新增于: v22.3.0, v20.16.0**

`blob.bytes()` 方法将 `Blob` 对象的字节作为 `Promise\<Uint8Array\>` 返回。

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // 输出: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**新增于: v15.7.0, v14.18.0**

`Blob` 的总大小，以字节为单位。

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**新增于: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 起始索引。
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 结束索引。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新 `Blob` 的内容类型。

创建并返回一个新的 `Blob`，其中包含此 `Blob` 对象数据的子集。 原始 `Blob` 不会被更改。

### `blob.stream()` {#blobstream}

**新增于: v16.7.0**

- 返回: [\<ReadableStream\>](/zh/nodejs/api/webstreams#class-readablestream)

返回一个新的 `ReadableStream`，允许读取 `Blob` 的内容。

### `blob.text()` {#blobtext}

**新增于: v15.7.0, v14.18.0**

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

返回一个 promise，其结果为 `Blob` 的内容，解码为 UTF-8 字符串。

### `blob.type` {#blobtype}

**新增于: v15.7.0, v14.18.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`Blob` 的内容类型。


### `Blob` 对象和 `MessageChannel` {#blob-objects-and-messagechannel}

一旦创建了 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 对象，它就可以通过 `MessagePort` 发送到多个目的地，而无需传输或立即复制数据。`Blob` 包含的数据仅在调用 `arrayBuffer()` 或 `text()` 方法时才会被复制。

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

// The Blob is still usable after posting.
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

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## 类: `Buffer` {#class-buffer}

`Buffer` 类是一个全局类型，用于直接处理二进制数据。它可以通过多种方式构造。

### 静态方法: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [历史]
| 版本    | 变更                                                                                                                                                                                                                                                                                                 |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v20.0.0 | 对于无效的输入参数，抛出 ERR_INVALID_ARG_TYPE 或 ERR_OUT_OF_RANGE，而不是 ERR_INVALID_ARG_VALUE。                                                                                                                                                                                                        |
| v15.0.0 | 对于无效的输入参数，抛出 ERR_INVALID_ARG_VALUE，而不是 ERR_INVALID_OPT_VALUE。                                                                                                                                                                                                                         |
| v10.0.0 | 尝试用零长度的 buffer 填充非零长度的 buffer 会触发抛出异常。                                                                                                                                                                                                                                               |
| v10.0.0 | 为 `fill` 指定无效的字符串会触发抛出异常。                                                                                                                                                                                                                                                          |
| v8.9.3  | 现在为 `fill` 指定无效的字符串将导致零填充的 buffer。                                                                                                                                                                                                                                                 |
| v5.10.0 | 添加于: v5.10.0                                                                                                                                                                                                                                                                                         |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 所需的长度。
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于预填充新 `Buffer` 的值。 **默认:** `0`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `fill` 是一个字符串，则这是它的编码。 **默认:** `'utf8'`。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

分配一个 `size` 字节的新 `Buffer`。 如果 `fill` 是 `undefined`，则 `Buffer` 将被零填充。

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

如果 `size` 大于 [`buffer.constants.MAX_LENGTH`](/zh/nodejs/api/buffer#bufferconstantsmax_length) 或小于 0，则抛出 [`ERR_OUT_OF_RANGE`](/zh/nodejs/api/errors#err_out_of_range)。

如果指定了 `fill`，则将通过调用 [`buf.fill(fill)`](/zh/nodejs/api/buffer#buffillvalue-offset-end-encoding) 来初始化已分配的 `Buffer`。

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

如果同时指定了 `fill` 和 `encoding`，则将通过调用 [`buf.fill(fill, encoding)`](/zh/nodejs/api/buffer#buffillvalue-offset-end-encoding) 来初始化已分配的 `Buffer`。

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

调用 [`Buffer.alloc()`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 可能比替代方法 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 慢得多，但可以确保新创建的 `Buffer` 实例的内容永远不会包含来自先前分配的敏感数据，包括可能尚未分配给 `Buffer` 的数据。

如果 `size` 不是一个数字，则会抛出 `TypeError`。


### 静态方法: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 对于无效的输入参数，抛出 ERR_INVALID_ARG_TYPE 或 ERR_OUT_OF_RANGE，而不是 ERR_INVALID_ARG_VALUE。 |
| v15.0.0 | 对于无效的输入参数，抛出 ERR_INVALID_ARG_VALUE，而不是 ERR_INVALID_OPT_VALUE。 |
| v7.0.0 | 传入负数 `size` 现在会抛出错误。 |
| v5.10.0 | 添加于: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 期望的长度。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

分配一个 `size` 字节的新 `Buffer`。 如果 `size` 大于 [`buffer.constants.MAX_LENGTH`](/zh/nodejs/api/buffer#bufferconstantsmax_length) 或小于 0，则会抛出 [`ERR_OUT_OF_RANGE`](/zh/nodejs/api/errors#err_out_of_range)。

以这种方式创建的 `Buffer` 实例的底层内存*未被初始化*。 新创建的 `Buffer` 的内容是未知的，并且*可能包含敏感数据*。 使用 [`Buffer.alloc()`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 来用零初始化 `Buffer` 实例。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// 打印（内容可能不同）: <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// 打印: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// 打印（内容可能不同）: <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// 打印: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

如果 `size` 不是数字，则会抛出 `TypeError`。

`Buffer` 模块预先分配一个大小为 [`Buffer.poolSize`](/zh/nodejs/api/buffer#class-property-bufferpoolsize) 的内部 `Buffer` 实例，该实例用作快速分配新 `Buffer` 实例的池，仅当 `size` 小于 `Buffer.poolSize \>\>\> 1`（[`Buffer.poolSize`](/zh/nodejs/api/buffer#class-property-bufferpoolsize) 除以 2 向下取整）时，才使用 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize)、[`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray)、[`Buffer.from(string)`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding) 和 [`Buffer.concat()`](/zh/nodejs/api/buffer#static-method-bufferconcatlist-totallength) 创建。

调用 `Buffer.alloc(size, fill)` 与 `Buffer.allocUnsafe(size).fill(fill)` 之间的主要区别在于使用此预分配的内部内存池。 具体来说，`Buffer.alloc(size, fill)` 将*永远不会*使用内部 `Buffer` 池，而如果 `size` 小于或等于一半的 [`Buffer.poolSize`](/zh/nodejs/api/buffer#class-property-bufferpoolsize)，则 `Buffer.allocUnsafe(size).fill(fill)` *将*使用内部 `Buffer` 池。 这种差异很细微，但当应用程序需要 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 提供的额外性能时，它可能很重要。


### 静态方法：`Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [历史记录]
| 版本     | 更改                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------- |
| v20.0.0  | 对于无效的输入参数，抛出 ERR_INVALID_ARG_TYPE 或 ERR_OUT_OF_RANGE，而不是 ERR_INVALID_ARG_VALUE。 |
| v15.0.0  | 对于无效的输入参数，抛出 ERR_INVALID_ARG_VALUE，而不是 ERR_INVALID_OPT_VALUE。                       |
| v5.12.0  | 添加于：v5.12.0                                                                                     |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 所需的长度。
- 返回：[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

分配一个新的 `Buffer`，大小为 `size` 字节。 如果 `size` 大于 [`buffer.constants.MAX_LENGTH`](/zh/nodejs/api/buffer#bufferconstantsmax_length) 或小于 0，则会抛出 [`ERR_OUT_OF_RANGE`](/zh/nodejs/api/errors#err_out_of_range)。 如果 `size` 为 0，则会创建一个长度为零的 `Buffer`。

以这种方式创建的 `Buffer` 实例的底层内存*未初始化*。 新创建的 `Buffer` 的内容未知，并且*可能包含敏感数据*。 使用 [`buf.fill(0)`](/zh/nodejs/api/buffer#buffillvalue-offset-end-encoding) 以用零初始化此类 `Buffer` 实例。

当使用 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 来分配新的 `Buffer` 实例时，小于 `Buffer.poolSize \>\>\> 1`（当使用默认 poolSize 时为 4KiB）的分配会从单个预先分配的 `Buffer` 中切片出来。 这允许应用程序避免创建许多单独分配的 `Buffer` 实例的垃圾回收开销。 这种方法通过消除跟踪和清理尽可能多的单独 `ArrayBuffer` 对象的需求，提高了性能和内存使用率。

但是，如果开发人员可能需要将一小块来自池的内存保留不确定的时间，则使用 `Buffer.allocUnsafeSlow()` 创建一个非池化的 `Buffer` 实例，然后复制出相关的位可能是合适的。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 需要保留一些小的内存块。
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 为保留的数据分配。
    const sb = Buffer.allocUnsafeSlow(10);

    // 将数据复制到新的分配中。
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 需要保留一些小的内存块。
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 为保留的数据分配。
    const sb = Buffer.allocUnsafeSlow(10);

    // 将数据复制到新的分配中。
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

如果 `size` 不是数字，则会抛出 `TypeError`。


### 静态方法: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.0.0 | 传入无效输入现在会抛出错误。 |
| v5.10.0 | `string` 参数现在可以是任何 `TypedArray`、`DataView` 或 `ArrayBuffer`。 |
| v0.1.90 | 添加于: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 要计算长度的值。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `string` 是字符串，则是其编码。 **默认值:** `'utf8'`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `string` 中包含的字节数。

返回使用 `encoding` 编码字符串时的字节长度。 这与 [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length) 不同，后者不考虑用于将字符串转换为字节的编码。

对于 `'base64'`、`'base64url'` 和 `'hex'`，此函数假定输入有效。 对于包含非 base64/hex 编码数据（例如空格）的字符串，返回值可能大于从字符串创建的 `Buffer` 的长度。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} 个字符, ` +
            `${Buffer.byteLength(str, 'utf8')} 个字节`);
// 打印: ½ + ¼ = ¾: 9 个字符, 12 个字节
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} 个字符, ` +
            `${Buffer.byteLength(str, 'utf8')} 个字节`);
// 打印: ½ + ¼ = ¾: 9 个字符, 12 个字节
```
:::

当 `string` 是 `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 时，返回 `.byteLength` 报告的字节长度。


### 静态方法：`Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 现在参数可以是 `Uint8Array`。 |
| v0.11.13 | 添加于：v0.11.13 |
:::

- `buf1` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- 返回：[\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `-1`、`0` 或 `1`，取决于比较的结果。详见 [`buf.compare()`](/zh/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend)。

比较 `buf1` 和 `buf2`，通常用于排序 `Buffer` 实例的数组。 这相当于调用 [`buf1.compare(buf2)`](/zh/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend)。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// 打印: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (这个结果等于: [buf2, buf1]. )
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// 打印: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (这个结果等于: [buf2, buf1]. )
```
:::

### 静态方法：`Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | `list` 的元素现在可以是 `Uint8Array`。 |
| v0.7.11 | 添加于：v0.7.11 |
:::

- `list` [\<Buffer[]\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 要连接的 `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 实例的列表。
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 连接时 `list` 中 `Buffer` 实例的总长度。
- 返回：[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

返回一个新的 `Buffer`，它是将 `list` 中所有 `Buffer` 实例连接在一起的结果。

如果列表没有条目，或者 `totalLength` 为 0，则返回一个新的零长度 `Buffer`。

如果未提供 `totalLength`，则通过将 `list` 中 `Buffer` 实例的长度相加来计算它。

如果提供了 `totalLength`，它将被强制转换为无符号整数。 如果 `list` 中 `Buffer` 的组合长度超过 `totalLength`，则结果将被截断为 `totalLength`。 如果 `list` 中 `Buffer` 的组合长度小于 `totalLength`，则剩余空间将填充零。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 从三个 `Buffer` 实例的列表中创建一个 `Buffer`。

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// 打印: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// 打印: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// 打印: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 从三个 `Buffer` 实例的列表中创建一个 `Buffer`。

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// 打印: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// 打印: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// 打印: 42
```
:::

`Buffer.concat()` 也可以像 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 一样使用内部 `Buffer` 池。


### 静态方法：`Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**添加于: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 要复制的 [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `view` 中的起始偏移量。 **默认值:**: `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 从 `view` 复制的元素数量。 **默认值:** `view.length - offset`。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

将 `view` 的底层内存复制到新的 `Buffer` 中。

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### 静态方法：`Buffer.from(array)` {#static-method-bufferfromarray}

**添加于: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

使用范围 `0` – `255` 中的字节 `array` 分配一个新的 `Buffer`。 该范围之外的数组条目将被截断以适应它。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 创建一个新的 Buffer，其中包含字符串“buffer”的 UTF-8 字节。
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 创建一个新的 Buffer，其中包含字符串“buffer”的 UTF-8 字节。
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

如果 `array` 是一个类 `Array` 对象（也就是说，一个具有 `length` 属性类型为 `number` 的对象），则它被视为一个数组，除非它是一个 `Buffer` 或一个 `Uint8Array`。 这意味着所有其他的 `TypedArray` 变体都被视为 `Array`。 要从支持 `TypedArray` 的字节创建 `Buffer`，请使用 [`Buffer.copyBytesFrom()`](/zh/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length)。

如果 `array` 不是 `Array` 或另一种适合 `Buffer.from()` 变体的类型，则将抛出 `TypeError`。

`Buffer.from(array)` 和 [`Buffer.from(string)`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding) 也可能像 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 一样使用内部 `Buffer` 池。


### 静态方法: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**加入于: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 一个 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)，例如 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 的 `.buffer` 属性。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要公开的第一个字节的索引。 **默认:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要公开的字节数。 **默认:** `arrayBuffer.byteLength - byteOffset`。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

这会创建一个 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 的视图，而无需复制底层内存。 例如，当传递对 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例的 `.buffer` 属性的引用时，新创建的 `Buffer` 将与 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 的底层 `ArrayBuffer` 共享相同的已分配内存。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// 与 `arr` 共享内存。
const buf = Buffer.from(arr.buffer);

console.log(buf);
// 打印: <Buffer 88 13 a0 0f>

// 更改原始 Uint16Array 也会更改 Buffer。
arr[1] = 6000;

console.log(buf);
// 打印: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// 与 `arr` 共享内存。
const buf = Buffer.from(arr.buffer);

console.log(buf);
// 打印: <Buffer 88 13 a0 0f>

// 更改原始 Uint16Array 也会更改 Buffer。
arr[1] = 6000;

console.log(buf);
// 打印: <Buffer 88 13 70 17>
```
:::

可选的 `byteOffset` 和 `length` 参数指定 `arrayBuffer` 中将由 `Buffer` 共享的内存范围。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// 打印: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// 打印: 2
```
:::

如果 `arrayBuffer` 不是 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 或另一种适合 `Buffer.from()` 变体的类型，则会抛出一个 `TypeError`。

重要的是要记住，后备 `ArrayBuffer` 可以覆盖超出 `TypedArray` 视图范围的内存范围。 使用 `TypedArray` 的 `buffer` 属性创建的新 `Buffer` 可能会超出 `TypedArray` 的范围：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 个元素
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 个元素
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// 打印: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 个元素
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 个元素
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// 打印: <Buffer 63 64 65 66>
```
:::


### 静态方法: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**新增于: v5.10.0**

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 要复制数据的现有 `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

将传入的 `buffer` 数据复制到新的 `Buffer` 实例上。

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

如果 `buffer` 不是 `Buffer` 或其他适用于 `Buffer.from()` 变体的类型，则会抛出 `TypeError`。

### 静态方法: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**新增于: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 支持 `Symbol.toPrimitive` 或 `valueOf()` 的对象。
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 字节偏移量或编码。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 长度。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

对于 `valueOf()` 函数返回的值不严格等于 `object` 的对象，返回 `Buffer.from(object.valueOf(), offsetOrEncoding, length)`。

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

对于支持 `Symbol.toPrimitive` 的对象，返回 `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`。

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

如果 `object` 没有提到的方法或不属于适用于 `Buffer.from()` 变体的另一种类型，则会抛出 `TypeError`。


### 静态方法：`Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**加入于：v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编码的字符串。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` 的编码。 **默认值：** `'utf8'`。
- 返回：[\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

创建一个包含 `string` 的新 `Buffer`。`encoding` 参数标识将 `string` 转换为字节时要使用的字符编码。

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

如果 `string` 不是字符串或另一种适用于 `Buffer.from()` 变体的类型，则会抛出一个 `TypeError`。

[`Buffer.from(string)`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding) 也可以像 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 那样使用内部 `Buffer` 池。

### 静态方法：`Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**加入于：v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回：[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `obj` 是一个 `Buffer`，则返回 `true`，否则返回 `false`。

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


### 静态方法：`Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**添加于: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要检查的字符编码名称。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `encoding` 是受支持的字符编码的名称，则返回 `true`，否则返回 `false`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// 打印: true

console.log(Buffer.isEncoding('hex'));
// 打印: true

console.log(Buffer.isEncoding('utf/8'));
// 打印: false

console.log(Buffer.isEncoding(''));
// 打印: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// 打印: true

console.log(Buffer.isEncoding('hex'));
// 打印: true

console.log(Buffer.isEncoding('utf/8'));
// 打印: false

console.log(Buffer.isEncoding(''));
// 打印: false
```
:::

### 类属性：`Buffer.poolSize` {#class-property-bufferpoolsize}

**添加于: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `8192`

这是用于池化的预分配内部 `Buffer` 实例的大小（以字节为单位）。 这个值可以被修改。

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

索引运算符 `[index]` 可用于获取和设置 `buf` 中位置 `index` 的八位字节。 这些值指的是单个字节，因此合法值的范围在 `0x00` 和 `0xFF` (十六进制) 或 `0` 和 `255` (十进制) 之间。

此运算符继承自 `Uint8Array`，因此它对越界访问的行为与 `Uint8Array` 相同。 换句话说，当 `index` 为负数或大于等于 `buf.length` 时，`buf[index]` 返回 `undefined`，如果 `index` 为负数或 `\>= buf.length`，则 `buf[index] = value` 不会修改缓冲区。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 一次一个字节地将 ASCII 字符串复制到 `Buffer` 中。
// （这仅适用于仅 ASCII 字符串。通常，应使用
// `Buffer.from()` 来执行此转换。）

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// 打印: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 一次一个字节地将 ASCII 字符串复制到 `Buffer` 中。
// （这仅适用于仅 ASCII 字符串。通常，应使用
// `Buffer.from()` 来执行此转换。）

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// 打印: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 此 `Buffer` 对象创建所基于的底层 `ArrayBuffer` 对象。

无法保证此 `ArrayBuffer` 与原始 `Buffer` 完全对应。 有关详细信息，请参阅关于 `buf.byteOffset` 的说明。

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

- [\<integer\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) `Buffer` 的底层 `ArrayBuffer` 对象的 `byteOffset`。

在 `Buffer.from(ArrayBuffer, byteOffset, length)` 中设置 `byteOffset` 时，或者有时在分配小于 `Buffer.poolSize` 的 `Buffer` 时，该缓冲区不会从底层 `ArrayBuffer` 的零偏移量开始。

当直接使用 `buf.buffer` 访问底层 `ArrayBuffer` 时，这可能会导致问题，因为 `ArrayBuffer` 的其他部分可能与 `Buffer` 对象本身无关。

创建与其内存与 `Buffer` 共享的 `TypedArray` 对象时，一个常见的问题是，在这种情况下，需要正确指定 `byteOffset`：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | `target` 参数现在可以是 `Uint8Array`。 |
| v5.11.0 | 现在支持指定偏移量的其他参数。 |
| v0.11.13 | 添加于: v0.11.13 |
:::

- `target` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 要与 `buf` 进行比较的 `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `target` 中开始比较的偏移量。 **默认:** `0`。
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `target` 中结束比较的偏移量（不包含）。 **默认:** `target.length`。
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `buf` 中开始比较的偏移量。 **默认:** `0`。
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `buf` 中结束比较的偏移量（不包含）。 **默认:** [`buf.length`](/zh/nodejs/api/buffer#buflength)。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

将 `buf` 与 `target` 进行比较，并返回一个数字，指示在排序顺序中 `buf` 是在 `target` 之前、之后还是与 `target` 相同。 比较基于每个 `Buffer` 中的实际字节序列。

- 如果 `target` 与 `buf` 相同，则返回 `0`。
- 如果 `target` 在排序时应位于 `buf` *之前*，则返回 `1`。
- 如果 `target` 在排序时应位于 `buf` *之后*，则返回 `-1`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// 打印: 0
console.log(buf1.compare(buf2));
// 打印: -1
console.log(buf1.compare(buf3));
// 打印: -1
console.log(buf2.compare(buf1));
// 打印: 1
console.log(buf2.compare(buf3));
// 打印: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// 打印: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (此结果等于: [buf1, buf3, buf2]。)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// 打印: 0
console.log(buf1.compare(buf2));
// 打印: -1
console.log(buf1.compare(buf3));
// 打印: -1
console.log(buf2.compare(buf1));
// 打印: 1
console.log(buf2.compare(buf3));
// 打印: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// 打印: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (此结果等于: [buf1, buf3, buf2]。)
```
:::

可选的 `targetStart`、`targetEnd`、`sourceStart` 和 `sourceEnd` 参数可用于将比较限制在 `target` 和 `buf` 中的特定范围内。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// 打印: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// 打印: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// 打印: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// 打印: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// 打印: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// 打印: 1
```
:::

如果 `targetStart \< 0`、`sourceStart \< 0`、`targetEnd \> target.byteLength` 或 `sourceEnd \> source.byteLength`，则抛出 [`ERR_OUT_OF_RANGE`](/zh/nodejs/api/errors#err_out_of_range)。


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**新增于: v0.1.90**

- `target` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 要复制到的 `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入的 `target` 中的偏移量。 **默认:** `0`。
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始复制的 `buf` 中的偏移量。 **默认:** `0`。
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 停止复制的 `buf` 中的偏移量（不包括）。 **默认:** [`buf.length`](/zh/nodejs/api/buffer#buflength)。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 复制的字节数。

将 `buf` 区域中的数据复制到 `target` 区域中，即使 `target` 内存区域与 `buf` 重叠。

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) 执行相同的操作，并且适用于所有 TypedArray，包括 Node.js `Buffer`，尽管它采用不同的函数参数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 创建两个 `Buffer` 实例。
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

// 将 `buf1` 的字节 16 到 19 复制到 `buf2`，从 `buf2` 的字节 8 开始。
buf1.copy(buf2, 8, 16, 20);
// 这等效于：
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// 打印: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 创建两个 `Buffer` 实例。
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

// 将 `buf1` 的字节 16 到 19 复制到 `buf2`，从 `buf2` 的字节 8 开始。
buf1.copy(buf2, 8, 16, 20);
// 这等效于：
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// 打印: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 创建一个 `Buffer`，并将数据从一个区域复制到同一 `Buffer` 内的重叠区域。

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// 打印: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 创建一个 `Buffer`，并将数据从一个区域复制到同一 `Buffer` 内的重叠区域。

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// 打印: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Added in: v1.1.0**

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

创建并返回一个 `[index, byte]` 键值对的[迭代器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)，该迭代器从 `buf` 的内容生成。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 记录 `Buffer` 的全部内容。

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// 打印:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 记录 `Buffer` 的全部内容。

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// 打印:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 现在参数可以是 `Uint8Array`。 |
| v0.11.13 | 添加于: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 一个 `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)，用于与 `buf` 进行比较。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `buf` 和 `otherBuffer` 具有完全相同的字节，则返回 `true`，否则返回 `false`。 相当于 [`buf.compare(otherBuffer) === 0`](/zh/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend)。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// 打印: true
console.log(buf1.equals(buf3));
// 打印: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// 打印: true
console.log(buf1.equals(buf3));
// 打印: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 抛出 `ERR_OUT_OF_RANGE` 而不是 `ERR_INDEX_OUT_OF_RANGE`。 |
| v10.0.0 | 负数 `end` 值会抛出 `ERR_INDEX_OUT_OF_RANGE` 错误。 |
| v10.0.0 | 尝试用零长度的缓冲区填充非零长度的缓冲区会触发异常。 |
| v10.0.0 | 为 `value` 指定无效字符串会触发异常。 |
| v5.7.0 | 现在支持 `encoding` 参数。 |
| v0.5.0 | 添加于: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于填充 `buf` 的值。 空值（字符串、Uint8Array、Buffer）会被强制转换为 `0`。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始填充 `buf` 之前要跳过的字节数。 **默认值:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 停止填充 `buf` 的位置（不包括）。 **默认值:** [`buf.length`](/zh/nodejs/api/buffer#buflength)。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `value` 是字符串，则为 `value` 的编码。 **默认值:** `'utf8'`。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 对 `buf` 的引用。

用指定的 `value` 填充 `buf`。 如果未给定 `offset` 和 `end`，则将填充整个 `buf`：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 用 ASCII 字符 'h' 填充 `Buffer`。

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// 打印: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// 用空字符串填充缓冲区
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// 打印: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 用 ASCII 字符 'h' 填充 `Buffer`。

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// 打印: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// 用空字符串填充缓冲区
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// 打印: <Buffer 00 00 00 00 00>
```
:::

如果 `value` 不是字符串、`Buffer` 或整数，则会被强制转换为 `uint32` 值。 如果生成的整数大于 `255`（十进制），则 `buf` 将填充 `value & 255`。

如果 `fill()` 操作的最后一次写入落在多字节字符上，则仅写入适合 `buf` 的该字符的字节：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 用在 UTF-8 中占用两个字节的字符填充 `Buffer`。

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// 打印: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 用在 UTF-8 中占用两个字节的字符填充 `Buffer`。

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// 打印: <Buffer c8 a2 c8 a2 c8>
```
:::

如果 `value` 包含无效字符，则会被截断； 如果没有剩余的有效填充数据，则会抛出异常：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// 打印: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// 打印: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// 抛出异常。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// 打印: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// 打印: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// 抛出异常。
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Added in: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要搜索的内容。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `buf` 中开始搜索的位置。 如果是负数，则偏移量从 `buf` 的末尾计算。 **默认:** `0`。
- `encoding` [\<string\>](https://developer.mozilla.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `value` 是字符串，则这是它的编码。 **默认:** `'utf8'`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果在 `buf` 中找到 `value`，则为 `true`，否则为 `false`。

等效于 [`buf.indexOf() !== -1`](/zh/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)。

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
// Prints: true (97 是 'a' 的十进制 ASCII 值)
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
// Prints: true (97 是 'a' 的十进制 ASCII 值)
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 现在 `value` 可以是 `Uint8Array`。 |
| v5.7.0, v4.4.0 | 当传递 `encoding` 时，不再需要 `byteOffset` 参数。 |
| v1.5.0 | 添加于: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要搜索的内容。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `buf` 中开始搜索的位置。 如果为负数，则偏移量从 `buf` 的末尾计算。 **默认:** `0`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `value` 是字符串，则此编码用于确定字符串的二进制表示形式，该二进制表示形式将在 `buf` 中搜索。 **默认:** `'utf8'`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `value` 在 `buf` 中第一次出现的索引，如果 `buf` 不包含 `value`，则返回 `-1`。

如果 `value` 是：

- 字符串，则根据 `encoding` 中的字符编码解释 `value`。
- `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)，将完整使用 `value`。 要比较 `Buffer` 的一部分，请使用 [`buf.subarray`](/zh/nodejs/api/buffer#bufsubarraystart-end)。
- 数字，则 `value` 将被解释为介于 `0` 和 `255` 之间的无符号 8 位整数值。

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
// Prints: 8 (97 是 'a' 的十进制 ASCII 值)
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
// Prints: 8 (97 是 'a' 的十进制 ASCII 值)
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

如果 `value` 不是字符串、数字或 `Buffer`，则此方法将抛出 `TypeError`。 如果 `value` 是一个数字，它将被强制转换为有效的字节值，即 0 到 255 之间的整数。

如果 `byteOffset` 不是一个数字，它将被强制转换为一个数字。 如果强制转换的结果是 `NaN` 或 `0`，那么将搜索整个缓冲区。 此行为与 [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) 匹配。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// 传递一个数字值，但不是一个有效的字节。
// Prints: 2, 相当于搜索 99 或 'c'。
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// 传递一个强制转换为 NaN 或 0 的 byteOffset。
// Prints: 1, 搜索整个缓冲区。
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// 传递一个数字值，但不是一个有效的字节。
// Prints: 2, 相当于搜索 99 或 'c'。
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// 传递一个强制转换为 NaN 或 0 的 byteOffset。
// Prints: 1, 搜索整个缓冲区。
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

如果 `value` 是一个空字符串或空 `Buffer` 并且 `byteOffset` 小于 `buf.length`，则将返回 `byteOffset`。 如果 `value` 为空且 `byteOffset` 至少为 `buf.length`，则将返回 `buf.length`。


### `buf.keys()` {#bufkeys}

**Added in: v1.1.0**

- 返回: [\<迭代器\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

创建并返回一个 `buf` 键（索引）的[迭代器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | `value` 现在可以是 `Uint8Array`。 |
| v6.0.0 | 添加于: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要搜索的内容。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `buf` 中开始搜索的位置。如果为负数，则偏移量从 `buf` 的末尾开始计算。**默认值:** `buf.length - 1`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 `value` 是字符串，则此编码用于确定将在 `buf` 中搜索的字符串的二进制表示形式。**默认值:** `'utf8'`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `value` 在 `buf` 中最后一次出现的索引，如果 `buf` 不包含 `value`，则返回 `-1`。

与 [`buf.indexOf()`](/zh/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding) 相同，不同之处在于查找的是 `value` 最后一次出现的位置，而不是第一次出现的位置。

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

如果 `value` 不是字符串、数字或 `Buffer`，则此方法将抛出 `TypeError`。 如果 `value` 是一个数字，它将被强制转换为一个有效的字节值，一个介于 0 到 255 之间的整数。

如果 `byteOffset` 不是数字，它将被强制转换为数字。 任何强制转换为 `NaN` 的参数，如 `{}` 或 `undefined`，都将搜索整个缓冲区。 这种行为与 [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf) 匹配。

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

如果 `value` 是一个空字符串或空的 `Buffer`，将返回 `byteOffset`。


### `buf.length` {#buflength}

**加入版本: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回 `buf` 中的字节数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 创建一个 `Buffer` 并使用 UTF-8 向其中写入一个较短的字符串。

const buf = Buffer.alloc(1234);

console.log(buf.length);
// 打印: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// 打印: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 创建一个 `Buffer` 并使用 UTF-8 向其中写入一个较短的字符串。

const buf = Buffer.alloc(1234);

console.log(buf.length);
// 打印: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// 打印: 1234
```
:::

### `buf.parent` {#bufparent}

**弃用版本: v8.0.0**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`buf.buffer`](/zh/nodejs/api/buffer#bufbuffer) 代替。
:::

`buf.parent` 属性是 `buf.buffer` 的已弃用别名。

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**加入版本: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前要跳过的字节数。 必须满足: `0 <= offset <= buf.length - 8`。 **默认:** `0`。
- 返回: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

从 `buf` 中指定的 `offset` 处读取一个带符号的、大端序的 64 位整数。

从 `Buffer` 读取的整数被解释为二的补码带符号值。

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**加入版本: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前要跳过的字节数。 必须满足: `0 <= offset <= buf.length - 8`。 **默认:** `0`。
- 返回: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

从 `buf` 中指定的 `offset` 处读取一个带符号的、小端序的 64 位整数。

从 `Buffer` 读取的整数被解释为二的补码带符号值。


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.10.0, v12.19.0 | 此函数也可作为 `buf.readBigUint64BE()` 使用。 |
| v12.0.0, v10.20.0 | 添加于: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前要跳过的字节数。 必须满足：`0 <= offset <= buf.length - 8`。**默认值:** `0`。
- 返回: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

从 `buf` 中指定的 `offset` 位置读取一个无符号的、大端序的 64 位整数。

此函数也可以通过别名 `readBigUint64BE` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// 打印: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// 打印: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.10.0, v12.19.0 | 此函数也可作为 `buf.readBigUint64LE()` 使用。 |
| v12.0.0, v10.20.0 | 添加于: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前要跳过的字节数。 必须满足：`0 <= offset <= buf.length - 8`。**默认值:** `0`。
- 返回: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

从 `buf` 中指定的 `offset` 位置读取一个无符号的、小端序的 64 位整数。

此函数也可以通过别名 `readBigUint64LE` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// 打印: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// 打印: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert`，且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 8`。 **默认:** `0`。
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个 64 位的、大端序的双精度浮点数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// 打印: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// 打印: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert`，且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 8`。 **默认:** `0`。
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个 64 位的、小端序的双精度浮点数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// 打印: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// 抛出 ERR_OUT_OF_RANGE 错误。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// 打印: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// 抛出 ERR_OUT_OF_RANGE 错误。
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前要跳过的字节数。 必须满足 `0 <= offset <= buf.length - 4`。 **默认:** `0`。
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 处读取一个 32 位大端序浮点数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// 打印: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// 打印: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前要跳过的字节数。 必须满足 `0 <= offset <= buf.length - 4`。 **默认:** `0`。
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 处读取一个 32 位小端序浮点数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// 打印: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// 打印: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// 抛出 ERR_OUT_OF_RANGE。
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.0 | 添加于: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 1`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个有符号的 8 位整数。

从 `Buffer` 中读取的整数被解释为二补码有符号值。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// 打印: -1
console.log(buf.readInt8(1));
// 打印: 5
console.log(buf.readInt8(2));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// 打印: -1
console.log(buf.readInt8(1));
// 打印: 5
console.log(buf.readInt8(2));
// 抛出 ERR_OUT_OF_RANGE。
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个有符号的大端序 16 位整数。

从 `Buffer` 中读取的整数被解释为二补码有符号值。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// 打印: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// 打印: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。必须满足 `0 \<= offset \<= buf.length - 2`。**默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个有符号的、小端序的 16 位整数。

从 `Buffer` 读取的整数会被解释为二进制补码的有符号值。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// 打印: 1280
console.log(buf.readInt16LE(1));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// 打印: 1280
console.log(buf.readInt16LE(1));
// 抛出 ERR_OUT_OF_RANGE。
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。必须满足 `0 \<= offset \<= buf.length - 4`。**默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个有符号的、大端序的 32 位整数。

从 `Buffer` 读取的整数会被解释为二进制补码的有符号值。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// 打印: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// 打印: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。必须满足 `0 \<= offset \<= buf.length - 4`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个有符号的、小端序的 32 位整数。

从 `Buffer` 读取的整数被解释为二的补码有符号值。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// 打印: 83886080
console.log(buf.readInt32LE(1));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// 打印: 83886080
console.log(buf.readInt32LE(1));
// 抛出 ERR_OUT_OF_RANGE。
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 且不再隐式地将 offset 和 `byteLength` 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 必须满足 `0 \< byteLength \<= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取 `byteLength` 数量的字节，并将结果解释为大端序、二的补码有符号值，支持高达 48 位的精度。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// 打印: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
console.log(buf.readIntBE(1, 0).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// 打印: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
console.log(buf.readIntBE(1, 0).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert`，并且不再隐式地将 offset 和 `byteLength` 强制转换为 `uint32`。 |
| v0.11.15 | 加入于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 必须满足 `0 \< byteLength \<= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取 `byteLength` 个字节数，并将结果解释为小端序的、支持高达 48 位精度的二进制补码有符号值。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// 打印: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// 打印: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.readUint8()` 使用。 |
| v10.0.0 | 移除 `noAssert`，并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.0 | 加入于: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取前跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 1`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个无符号的 8 位整数。

此函数也可以通过别名 `readUint8` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// 打印: 1
console.log(buf.readUInt8(1));
// 打印: 254
console.log(buf.readUInt8(2));
// 抛出 ERR_OUT_OF_RANGE 错误。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// 打印: 1
console.log(buf.readUInt8(1));
// 打印: 254
console.log(buf.readUInt8(2));
// 抛出 ERR_OUT_OF_RANGE 错误。
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可以作为 `buf.readUint16BE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再将 offset 隐式强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个无符号、大端序的 16 位整数。

此函数也可以通过别名 `readUint16BE` 使用。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// 打印: 1234
console.log(buf.readUInt16BE(1).toString(16));
// 打印: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// 打印: 1234
console.log(buf.readUInt16BE(1).toString(16));
// 打印: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可以作为 `buf.readUint16LE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再将 offset 隐式强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个无符号、小端序的 16 位整数。

此函数也可以通过别名 `readUint16LE` 使用。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// 打印: 3412
console.log(buf.readUInt16LE(1).toString(16));
// 打印: 5634
console.log(buf.readUInt16LE(2).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// 打印: 3412
console.log(buf.readUInt16LE(1).toString(16));
// 打印: 5634
console.log(buf.readUInt16LE(2).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.readUint32BE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个无符号的、大端序的 32 位整数。

此函数也可通过 `readUint32BE` 别名使用。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// 打印: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// 打印: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.readUint32LE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取一个无符号的、小端序的 32 位整数。

此函数也可通过 `readUint32LE` 别名使用。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// 打印: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// 打印: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可以用作 `buf.readUintBE()`。 |
| v10.0.0 | 删除了 `noAssert`，并且不再将 offset 和 `byteLength` 隐式强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 <= offset <= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 必须满足 `0 < byteLength <= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取 `byteLength` 个字节，并将结果解释为支持高达 48 位精度的无符号大端整数。

此函数也可以通过别名 `readUintBE` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// 打印: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// 打印: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// 抛出 ERR_OUT_OF_RANGE。
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可以用作 `buf.readUintLE()`。 |
| v10.0.0 | 删除了 `noAssert`，并且不再将 offset 和 `byteLength` 隐式强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始读取之前要跳过的字节数。 必须满足 `0 <= offset <= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要读取的字节数。 必须满足 `0 < byteLength <= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

从 `buf` 中指定的 `offset` 读取 `byteLength` 个字节，并将结果解释为支持高达 48 位精度的无符号小端整数。

此函数也可以通过别名 `readUintLE` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// 打印: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// 打印: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**添加于: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 的起始位置。 **默认:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 的结束位置（不包含）。 **默认:** [`buf.length`](/zh/nodejs/api/buffer#buflength)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

返回一个新的 `Buffer`，它引用与原始 `Buffer` 相同的内存，但通过 `start` 和 `end` 索引进行偏移和裁剪。

指定大于 [`buf.length`](/zh/nodejs/api/buffer#buflength) 的 `end` 将返回与 `end` 等于 [`buf.length`](/zh/nodejs/api/buffer#buflength) 相同的结果。

此方法继承自 [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray)。

修改新的 `Buffer` 切片将修改原始 `Buffer` 中的内存，因为这两个对象分配的内存重叠。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 创建一个包含 ASCII 字母表的 `Buffer`，获取一个切片，并修改来自原始 `Buffer` 的一个字节。

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 创建一个包含 ASCII 字母表的 `Buffer`，获取一个切片，并修改来自原始 `Buffer` 的一个字节。

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: !bc
```
:::

指定负索引会导致切片相对于 `buf` 的末尾而不是开头生成。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// 打印: buffe
// (等效于 buf.subarray(0, 5).)。

console.log(buf.subarray(-6, -2).toString());
// 打印: buff
// (等效于 buf.subarray(0, 4).)。

console.log(buf.subarray(-5, -2).toString());
// 打印: uff
// (等效于 buf.subarray(1, 4).)。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// 打印: buffe
// (等效于 buf.subarray(0, 5).)。

console.log(buf.subarray(-6, -2).toString());
// 打印: buff
// (等效于 buf.subarray(0, 4).)。

console.log(buf.subarray(-5, -2).toString());
// 打印: uff
// (等效于 buf.subarray(1, 4).)。
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.5.0, v16.15.0 | `buf.slice()` 方法已被弃用。 |
| v7.0.0 | 所有偏移量现在都会被强制转换为整数，然后再进行任何计算。 |
| v7.1.0, v6.9.2 | 将偏移量强制转换为整数现在可以正确处理 32 位整数范围之外的值。 |
| v0.3.0 | 加入于：v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 的起始位置。 **默认值:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 的结束位置（不包含）。 **默认值:** [`buf.length`](/zh/nodejs/api/buffer#buflength)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定度: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`buf.subarray`](/zh/nodejs/api/buffer#bufsubarraystart-end)。
:::

返回一个新的 `Buffer`，它引用与原始 `Buffer` 相同的内存，但通过 `start` 和 `end` 索引进行偏移和裁剪。

此方法与 `Uint8Array.prototype.slice()` 不兼容，后者是 `Buffer` 的超类。 要复制切片，请使用 `Uint8Array.prototype.slice()`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// 打印: cuffer

console.log(buf.toString());
// 打印: buffer

// 使用 buf.slice()，原始缓冲区被修改。
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// 打印: cuffer
console.log(buf.toString());
// 也打印: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// 打印: cuffer

console.log(buf.toString());
// 打印: buffer

// 使用 buf.slice()，原始缓冲区被修改。
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// 打印: cuffer
console.log(buf.toString());
// 也打印: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**新增于: v5.10.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 指向 `buf` 的引用。

将 `buf` 解释为无符号 16 位整数数组，并 *就地* 交换字节顺序。 如果 [`buf.length`](/zh/nodejs/api/buffer#buflength) 不是 2 的倍数，则抛出 [`ERR_INVALID_BUFFER_SIZE`](/zh/nodejs/api/errors#err_invalid_buffer_size)。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// 打印: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// 打印: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// 抛出 ERR_INVALID_BUFFER_SIZE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// 打印: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// 打印: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// 抛出 ERR_INVALID_BUFFER_SIZE。
```
:::

`buf.swap16()` 的一个便捷用法是在 UTF-16 小端序和 UTF-16 大端序之间执行快速的就地转换：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // 转换为大端序 UTF-16 文本。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // 转换为大端序 UTF-16 文本。
```
:::

### `buf.swap32()` {#bufswap32}

**新增于: v5.10.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 指向 `buf` 的引用。

将 `buf` 解释为无符号 32 位整数数组，并 *就地* 交换字节顺序。 如果 [`buf.length`](/zh/nodejs/api/buffer#buflength) 不是 4 的倍数，则抛出 [`ERR_INVALID_BUFFER_SIZE`](/zh/nodejs/api/errors#err_invalid_buffer_size)。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// 打印: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// 打印: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// 抛出 ERR_INVALID_BUFFER_SIZE。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// 打印: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// 打印: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// 抛出 ERR_INVALID_BUFFER_SIZE。
```
:::


### `buf.swap64()` {#bufswap64}

**Added in: v6.3.0**

- Returns: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `buf` 的引用。

将 `buf` 解释为 64 位数字的数组并 *就地* 交换字节顺序。如果 [`buf.length`](/zh/nodejs/api/buffer#buflength) 不是 8 的倍数，则抛出 [`ERR_INVALID_BUFFER_SIZE`](/zh/nodejs/api/errors#err_invalid_buffer_size)。

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

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回 `buf` 的 JSON 表示形式。 对 `Buffer` 实例进行字符串化时，[`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 隐式调用此函数。

`Buffer.from()` 接受从此方法返回的格式的对象。 特别是，`Buffer.from(buf.toJSON())` 的作用类似于 `Buffer.from(buf)`。

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

**新增于: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的字符编码。**默认:** `'utf8'`。
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始解码的字节偏移量。**默认:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 停止解码的字节偏移量（不包括）。**默认:** [`buf.length`](/zh/nodejs/api/buffer#buflength)。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

根据 `encoding` 中指定的字符编码将 `buf` 解码为字符串。 可以传递 `start` 和 `end` 以仅解码 `buf` 的子集。

如果 `encoding` 是 `'utf8'` 并且输入中的字节序列不是有效的 UTF-8，则每个无效字节都将替换为替换字符 `U+FFFD`。

字符串实例的最大长度（以 UTF-16 代码单元为单位）可用作 [`buffer.constants.MAX_STRING_LENGTH`](/zh/nodejs/api/buffer#bufferconstantsmax_string_length)。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
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
  // 97 is the decimal ASCII value for 'a'.
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

**添加于: v1.1.0**

- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

为 `buf` 值（字节）创建并返回一个 [迭代器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)。 当在 `for..of` 语句中使用 `Buffer` 时，会自动调用此函数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// 打印:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// 打印:
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
// 打印:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// 打印:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**添加于: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要写入 `buf` 的字符串。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入 `string` 之前要跳过的字节数。 **默认值:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入的最大字节数（写入的字节数不会超过 `buf.length - offset`）。 **默认值:** `buf.length - offset`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` 的字符编码。 **默认值:** `'utf8'`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数。

根据 `encoding` 中的字符编码，将 `string` 写入到 `buf` 的 `offset` 位置。 `length` 参数是要写入的字节数。 如果 `buf` 没有足够的空间来容纳整个字符串，则只会写入 `string` 的一部分。 但是，不会写入部分编码的字符。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// 打印: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// 打印: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// 打印: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// 打印: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**新增于: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 要写入 `buf` 的数值。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足：`0 \<= offset \<= buf.length - 8`。 **默认值:** `0`。
- 返回：[\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

将 `value` 作为大端序写入 `buf` 的指定 `offset` 处。

`value` 被解释并写入为二进制补码有符号整数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// 打印: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// 打印: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**新增于: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 要写入 `buf` 的数值。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足：`0 \<= offset \<= buf.length - 8`。 **默认值:** `0`。
- 返回：[\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

将 `value` 作为小端序写入 `buf` 的指定 `offset` 处。

`value` 被解释并写入为二进制补码有符号整数。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// 打印: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// 打印: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.10.0, v12.19.0 | 此函数也可作为 `buf.writeBigUint64BE()` 使用。 |
| v12.0.0, v10.20.0 | 添加于: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足：`0 \<= offset \<= buf.length - 8`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

将 `value` 以大端字节序写入到 `buf` 中指定的 `offset` 处。

此函数也可通过别名 `writeBigUint64BE` 使用。

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.10.0, v12.19.0 | 此函数也可作为 `buf.writeBigUint64LE()` 使用。 |
| v12.0.0, v10.20.0 | 添加于: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足：`0 \<= offset \<= buf.length - 8`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

将 `value` 以小端字节序写入到 `buf` 中指定的 `offset` 处。

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

此函数也可通过别名 `writeBigUint64LE` 使用。


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 8`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端序将 `value` 写入到 `buf` 的指定 `offset` 处。 `value` 必须是 JavaScript 数字。 当 `value` 不是 JavaScript 数字时的行为是未定义的。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// 打印: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// 打印: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 8`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端序将 `value` 写入到 `buf` 的指定 `offset` 处。 `value` 必须是 JavaScript 数字。 当 `value` 不是 JavaScript 数字时的行为是未定义的。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// 打印: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// 打印: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert`，并且不再隐式地将偏移量强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认值:** `0`。
- 返回值: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端字节序将 `value` 写入到 `buf` 中指定的 `offset` 处。 当 `value` 不是 JavaScript 数字时，行为未定义。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// 打印: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// 打印: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert`，并且不再隐式地将偏移量强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认值:** `0`。
- 返回值: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端字节序将 `value` 写入到 `buf` 中指定的 `offset` 处。 当 `value` 不是 JavaScript 数字时，行为未定义。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// 打印: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// 打印: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将偏移量强制转换为 `uint32`。 |
| v0.5.0 | 加入于: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 1`。 **默认值:** `0`。
- 返回值: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

在指定的 `offset` 处将 `value` 写入 `buf`。 `value` 必须是有效的有符号 8 位整数。 当 `value` 不是有符号 8 位整数时，行为未定义。

`value` 被解释并写入为二进制补码有符号整数。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将偏移量强制转换为 `uint32`。 |
| v0.5.5 | 加入于: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认值:** `0`。
- 返回值: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端字节序在指定的 `offset` 处将 `value` 写入 `buf`。 `value` 必须是有效的有符号 16 位整数。 当 `value` 不是有符号 16 位整数时，行为未定义。

`value` 被解释并写入为二进制补码有符号整数。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端序将 `value` 写入到 `buf` 指定的 `offset` 处。 `value` 必须是有效的带符号 16 位整数。 当 `value` 不是带符号 16 位整数时，行为是未定义的。

`value` 被解释并写入为二进制补码带符号整数。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端序将 `value` 写入到 `buf` 指定的 `offset` 处。 `value` 必须是有效的带符号 32 位整数。 当 `value` 不是带符号 32 位整数时，行为是未定义的。

`value` 被解释并写入为二进制补码带符号整数。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 且不再将 offset 隐式强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端序将 `value` 写入到 `buf` 的指定 `offset` 处。 `value` 必须是有效的有符号 32 位整数。 当 `value` 不是有符号 32 位整数时，行为未定义。

`value` 被解释并写为二进制补码有符号整数。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert` 且不再将 offset 和 `byteLength` 隐式强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入的字节数。 必须满足 `0 \< byteLength \<= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端序将 `value` 的 `byteLength` 字节写入到 `buf` 的指定 `offset` 处。 支持高达 48 位的精度。 当 `value` 不是有符号整数时，行为未定义。

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 移除 `noAssert`，且不再隐式地将 offset 和 `byteLength` 强制转换为 `uint32`。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数值。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入的字节数。 必须满足 `0 \< byteLength \<= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端序将 `value` 的 `byteLength` 个字节写入到 `buf` 的指定 `offset`。 支持高达 48 位的精度。 当 `value` 不是有符号整数时，行为未定义。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// 打印: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// 打印: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUint8()` 使用。 |
| v10.0.0 | 移除 `noAssert`，且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.0 | 添加于: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数值。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 1`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

将 `value` 写入 `buf` 的指定 `offset`。 `value` 必须是有效的无符号 8 位整数。 当 `value` 不是无符号 8 位整数时，行为未定义。

此函数也可以使用别名 `writeUint8`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// 打印: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// 打印: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUint16BE()` 使用。 |
| v10.0.0 | 删除了 `noAssert` 且不再将 offset 隐式强制转换为 `uint32`。 |
| v0.5.5 | 添加于：v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端字节序将 `value` 写入到 `buf` 中指定的 `offset` 处。 `value` 必须是有效的无符号 16 位整数。 当 `value` 不是无符号 16 位整数时，行为是未定义的。

此函数也可通过别名 `writeUint16BE` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// 打印: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// 打印: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUint16LE()` 使用。 |
| v10.0.0 | 删除了 `noAssert` 且不再将 offset 隐式强制转换为 `uint32`。 |
| v0.5.5 | 添加于：v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 2`。 **默认值:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端字节序将 `value` 写入到 `buf` 中指定的 `offset` 处。 `value` 必须是有效的无符号 16 位整数。 当 `value` 不是无符号 16 位整数时，行为是未定义的。

此函数也可通过别名 `writeUint16LE` 访问。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// 打印: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// 打印: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUint32BE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数值。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端序将 `value` 写入到 `buf` 指定的 `offset` 处。 `value` 必须是有效的无符号 32 位整数。 当 `value` 不是无符号 32 位整数时，行为未定义。

此函数也可使用别名 `writeUint32BE`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// 打印: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// 打印: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUint32LE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 强制转换为 `uint32`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数值。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - 4`。 **默认:** `0`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端序将 `value` 写入到 `buf` 指定的 `offset` 处。 `value` 必须是有效的无符号 32 位整数。 当 `value` 不是无符号 32 位整数时，行为未定义。

此函数也可使用别名 `writeUint32LE`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// 打印: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// 打印: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUintBE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 和 `byteLength` 强制转换为 `uint32`。 |
| v0.5.5 | 添加于：v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入的字节数。 必须满足 `0 \< byteLength \<= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以大端序将 `value` 的 `byteLength` 字节写入到 `buf` 的指定 `offset`。 支持高达 48 位的精度。 当 `value` 不是无符号整数时，行为未定义。

此函数也可以使用别名 `writeUintBE`。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0, v12.19.0 | 此函数也可作为 `buf.writeUintLE()` 使用。 |
| v10.0.0 | 移除 `noAssert` 并且不再隐式地将 offset 和 `byteLength` 强制转换为 `uint32`。 |
| v0.5.5 | 添加于：v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入 `buf` 的数字。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入之前要跳过的字节数。 必须满足 `0 \<= offset \<= buf.length - byteLength`。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入的字节数。 必须满足 `0 \< byteLength \<= 6`。
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` 加上写入的字节数。

以小端序将 `value` 的 `byteLength` 字节写入到 `buf` 的指定 `offset`。 支持高达 48 位的精度。 当 `value` 不是无符号整数时，行为未定义。

此函数也可以使用别名 `writeUintLE`。

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 从 `node_modules` 目录外的代码调用此构造函数会发出弃用警告。 |
| v7.2.1 | 调用此构造函数不再发出弃用警告。 |
| v7.0.0 | 现在调用此构造函数会发出弃用警告。 |
| v6.0.0 | 自 v6.0.0 起已弃用 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray) 代替。
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要从中复制的字节数组。

参见 [`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray)。

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 从 `node_modules` 目录外的代码调用此构造函数会发出弃用警告。 |
| v7.2.1 | 调用此构造函数不再发出弃用警告。 |
| v7.0.0 | 现在调用此构造函数会发出弃用警告。 |
| v6.0.0 | 现在支持 `byteOffset` 和 `length` 参数。 |
| v6.0.0 | 自 v6.0.0 起已弃用 |
| v3.0.0 | 在 v3.0.0 中添加 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/zh/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) 代替。
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 一个 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)，[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 或 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 的 `.buffer` 属性。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要暴露的第一个字节的索引。 **默认:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要暴露的字节数。 **默认:** `arrayBuffer.byteLength - byteOffset`。

参见 [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/zh/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)。


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 从 `node_modules` 目录外的代码调用此构造函数会发出弃用警告。 |
| v7.2.1 | 调用此构造函数不再发出弃用警告。 |
| v7.0.0 | 现在调用此构造函数会发出弃用警告。 |
| v6.0.0 | 自 v6.0.0 起已弃用 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`Buffer.from(buffer)`](/zh/nodejs/api/buffer#static-method-bufferfrombuffer) 代替。
:::

- `buffer` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 要从中复制数据的现有 `Buffer` 或 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。

参见 [`Buffer.from(buffer)`](/zh/nodejs/api/buffer#static-method-bufferfrombuffer)。

### `new Buffer(size)` {#new-buffersize}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 从 `node_modules` 目录外的代码调用此构造函数会发出弃用警告。 |
| v8.0.0 | 默认情况下，`new Buffer(size)` 将返回零填充的内存。 |
| v7.2.1 | 调用此构造函数不再发出弃用警告。 |
| v7.0.0 | 现在调用此构造函数会发出弃用警告。 |
| v6.0.0 | 自 v6.0.0 起已弃用 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`Buffer.alloc()`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 代替 (另见 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize))。
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `Buffer` 的所需长度。

参见 [`Buffer.alloc()`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 和 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize)。 构造函数的此变体等效于 [`Buffer.alloc()`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)。


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 从 `node_modules` 目录之外的代码调用此构造函数会发出弃用警告。 |
| v7.2.1 | 调用此构造函数不再发出弃用警告。 |
| v7.0.0 | 现在调用此构造函数会发出弃用警告。 |
| v6.0.0 | 弃用时间：v6.0.0 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`Buffer.from(string[, encoding])`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding)。
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编码的字符串。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` 的编码。 **默认值:** `'utf8'`。

参阅 [`Buffer.from(string[, encoding])`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding)。

## 类: `File` {#class-file}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 使 File 实例可克隆。 |
| v20.0.0 | 不再是实验性的。 |
| v19.2.0, v18.13.0 | 添加于: v19.2.0, v18.13.0 |
:::

- 继承自: [\<Blob\>](/zh/nodejs/api/buffer#class-blob)

[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) 提供关于文件的信息。

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**添加于: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/zh/nodejs/api/buffer#class-blob) | [\<File[]\>](/zh/nodejs/api/buffer#class-file) 字符串数组、[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)、[\<File\>](/zh/nodejs/api/buffer#class-file) 或 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 对象，或这些对象的任何组合，将存储在 `File` 中。
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文件的名称。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'transparent'` 或 `'native'` 之一。 当设置为 `'native'` 时，字符串源部分中的行尾将转换为平台原生行尾，如 `require('node:os').EOL` 所指定。
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文件内容类型。
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 文件的最后修改日期。 **默认值:** `Date.now()`。


### `file.name` {#filename}

**添加于: v19.2.0, v18.13.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`File` 的名称。

### `file.lastModified` {#filelastmodified}

**添加于: v19.2.0, v18.13.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`File` 的最后修改日期。

## `node:buffer` 模块 API {#nodebuffer-module-apis}

虽然 `Buffer` 对象作为全局对象可用，但还有其他与 `Buffer` 相关的 API 只能通过使用 `require('node:buffer')` 访问的 `node:buffer` 模块获得。

### `buffer.atob(data)` {#bufferatobdata}

**添加于: v15.13.0, v14.17.0**

::: info [稳定度: 3 - 遗留]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留。请改用 `Buffer.from(data, 'base64')`。
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Base64 编码的输入字符串。

将 Base64 编码的数据字符串解码为字节，并使用 Latin-1 (ISO-8859-1) 将这些字节编码为字符串。

`data` 可以是任何可以强制转换为字符串的 JavaScript 值。

**此函数仅为了与旧版 Web 平台 API 兼容而提供，不应在新代码中使用，因为它们使用字符串表示二进制数据，并且早于 JavaScript 中类型化数组的引入。对于使用 Node.js API 运行的代码，应使用 <code>Buffer.from(str, 'base64')</code> 和 <code>buf.toString('base64')</code> 在 base64 编码的字符串和二进制数据之间进行转换。**

### `buffer.btoa(data)` {#bufferbtoadata}

**添加于: v15.13.0, v14.17.0**

::: info [稳定度: 3 - 遗留]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留。请改用 `buf.toString('base64')`。
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 一个 ASCII (Latin1) 字符串。

使用 Latin-1 (ISO-8859) 将字符串解码为字节，并使用 Base64 将这些字节编码为字符串。

`data` 可以是任何可以强制转换为字符串的 JavaScript 值。

**此函数仅为了与旧版 Web 平台 API 兼容而提供，不应在新代码中使用，因为它们使用字符串表示二进制数据，并且早于 JavaScript 中类型化数组的引入。对于使用 Node.js API 运行的代码，应使用 <code>Buffer.from(str, 'base64')</code> 和 <code>buf.toString('base64')</code> 在 base64 编码的字符串和二进制数据之间进行转换。**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**新增于: v19.6.0, v18.15.0**

- input [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 要验证的输入。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `input` 仅包含有效的 ASCII 编码数据，则此函数返回 `true`，包括 `input` 为空的情况。

如果 `input` 是分离的数组缓冲区，则抛出错误。

### `buffer.isUtf8(input)` {#bufferisutf8input}

**新增于: v19.4.0, v18.14.0**

- input [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 要验证的输入。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `input` 仅包含有效的 UTF-8 编码数据，则此函数返回 `true`，包括 `input` 为空的情况。

如果 `input` 是分离的数组缓冲区，则抛出错误。

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**新增于: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `50`

返回调用 `buf.inspect()` 时将返回的最大字节数。 这可以被用户模块覆盖。 有关 `buf.inspect()` 行为的更多详细信息，请参阅 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options)。

### `buffer.kMaxLength` {#bufferkmaxlength}

**新增于: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 单个 `Buffer` 实例允许的最大大小。

[`buffer.constants.MAX_LENGTH`](/zh/nodejs/api/buffer#bufferconstantsmax_length) 的别名。

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**新增于: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 单个 `string` 实例允许的最大长度。

[`buffer.constants.MAX_STRING_LENGTH`](/zh/nodejs/api/buffer#bufferconstantsmax_string_length) 的别名。


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**添加于: v16.7.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 由先前调用 `URL.createObjectURL()` 返回的 `'blob:nodedata:...` URL 字符串。
- 返回: [\<Blob\>](/zh/nodejs/api/buffer#class-blob)

解析一个 `'blob:nodedata:...'`，它是使用先前调用 `URL.createObjectURL()` 注册的关联 [\<Blob\>](/zh/nodejs/api/buffer#class-blob) 对象。

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v8.0.0 | `source` 参数现在可以是 `Uint8Array`。 |
| v7.1.0 | 添加于: v7.1.0 |
:::

- `source` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 一个 `Buffer` 或 `Uint8Array` 实例。
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当前编码。
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 目标编码。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

将给定的 `Buffer` 或 `Uint8Array` 实例从一种字符编码重新编码为另一种字符编码。 返回一个新的 `Buffer` 实例。

如果 `fromEnc` 或 `toEnc` 指定了无效的字符编码，或者不允许从 `fromEnc` 转换为 `toEnc`，则抛出异常。

`buffer.transcode()` 支持的编码有：`'ascii'`、`'utf8'`、`'utf16le'`、`'ucs2'`、`'latin1'` 和 `'binary'`。

如果给定的字节序列无法在目标编码中充分表示，则转码过程将使用替换字符。 例如：

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

因为欧元符号 (`€`) 无法用 US-ASCII 表示，所以在转码后的 `Buffer` 中它被替换为 `?`。


### 类: `SlowBuffer` {#class-slowbuffer}

**自 v6.0.0 起已弃用**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)。
:::

参见 [`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)。 这从来都不是一个真正的类，因为构造函数总是返回一个 `Buffer` 实例，而不是一个 `SlowBuffer` 实例。

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**自 v6.0.0 起已弃用**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)。
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新 `SlowBuffer` 的所需长度。

参见 [`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)。

### Buffer 常量 {#buffer-constants}

**新增于: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 在 64 位架构上，值已更改为 2<sup>31</sup> - 1。 |
| v15.0.0 | 在 64 位架构上，值已更改为 2<sup>32</sup>。 |
| v14.0.0 | 在 64 位架构上，值已从 2<sup>32</sup> - 1 更改为 2<sup>31</sup> - 1。 |
| v8.2.0 | 新增于: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 单个 `Buffer` 实例允许的最大大小。

在 32 位架构上，此值目前为 2<sup>31</sup> - 1（约 1 GiB）。

在 64 位架构上，此值目前为 2<sup>50</sup> - 1（约 8 PiB）。

它反映了底层的 [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0)。

此值也可作为 [`buffer.kMaxLength`](/zh/nodejs/api/buffer#bufferkmaxlength) 使用。

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**新增于: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 单个 `string` 实例允许的最大长度。

表示 `string` 原始类型可以拥有的最大 `length`，以 UTF-16 代码单元计数。

此值可能取决于正在使用的 JS 引擎。


## `Buffer.from()`、`Buffer.alloc()` 和 `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

在 Node.js 6.0.0 之前的版本中，`Buffer` 实例是使用 `Buffer` 构造函数创建的，该构造函数根据提供的参数以不同的方式分配返回的 `Buffer`：

- 将一个数字作为第一个参数传递给 `Buffer()`（例如 `new Buffer(10)`）会分配一个指定大小的新 `Buffer` 对象。 在 Node.js 8.0.0 之前的版本中，为此类 `Buffer` 实例分配的内存 *未* 初始化，并且 *可能包含敏感数据*。 此类 `Buffer` 实例*必须*随后使用 [`buf.fill(0)`](/zh/nodejs/api/buffer#buffillvalue-offset-end-encoding) 或通过写入整个 `Buffer` 来初始化，然后再从 `Buffer` 读取数据。 虽然此行为*有意*旨在提高性能，但开发经验表明，在创建快速但未初始化的 `Buffer` 与创建较慢但更安全的 `Buffer` 之间需要更明确地区分。 自 Node.js 8.0.0 起，`Buffer(num)` 和 `new Buffer(num)` 返回一个具有初始化内存的 `Buffer`。
- 将字符串、数组或 `Buffer` 作为第一个参数传递会将传递的对象的数据复制到 `Buffer` 中。
- 传递一个 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或一个 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 会返回一个 `Buffer`，该 `Buffer` 与给定的数组缓冲区共享分配的内存。

由于 `new Buffer()` 的行为因第一个参数的类型而异，因此当未执行参数验证或 `Buffer` 初始化时，可能会无意中将安全性和可靠性问题引入到应用程序中。

例如，如果攻击者可以导致应用程序接收到期望字符串的数字，则应用程序可能会调用 `new Buffer(100)` 而不是 `new Buffer("100")`，从而导致它分配一个 100 字节的缓冲区，而不是分配一个包含 `"100"` 内容的 3 字节缓冲区。 这通常可以使用 JSON API 调用实现。 由于 JSON 区分数字类型和字符串类型，因此它允许注入数字，而在天真编写的应用程序中，该应用程序未充分验证其输入，可能期望始终接收字符串。 在 Node.js 8.0.0 之前，100 字节的缓冲区可能包含任意预先存在的内存数据，因此可能用于向远程攻击者公开内存中的密钥。 自 Node.js 8.0.0 起，不会发生内存暴露，因为数据已填充为零。 但是，仍然可能存在其他攻击，例如导致服务器分配非常大的缓冲区，从而导致性能下降或因内存耗尽而崩溃。

为了使 `Buffer` 实例的创建更加可靠且不易出错，已**弃用** `new Buffer()` 构造函数的各种形式，并替换为单独的 `Buffer.from()`、[`Buffer.alloc()`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 和 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 方法。

*开发人员应将所有现有对 <code>new Buffer()</code> 构造函数的使用迁移到这些新 API 之一。*

- [`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray) 返回一个新的 `Buffer`，它*包含提供的八位字节的副本*。
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/zh/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) 返回一个新的 `Buffer`，它*与给定的 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 共享相同的已分配内存*。
- [`Buffer.from(buffer)`](/zh/nodejs/api/buffer#static-method-bufferfrombuffer) 返回一个新的 `Buffer`，它*包含给定的 `Buffer` 内容的副本*。
- [`Buffer.from(string[, encoding])`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding) 返回一个新的 `Buffer`，它*包含提供的字符串的副本*。
- [`Buffer.alloc(size[, fill[, encoding]])`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) 返回一个指定大小的新初始化 `Buffer`。 此方法比 [`Buffer.allocUnsafe(size)`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 慢，但保证新创建的 `Buffer` 实例永远不会包含可能敏感的旧数据。 如果 `size` 不是数字，将抛出 `TypeError`。
- [`Buffer.allocUnsafe(size)`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 和 [`Buffer.allocUnsafeSlow(size)`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) 各自返回一个指定 `size` 的新未初始化 `Buffer`。 由于 `Buffer` 未初始化，因此分配的内存段可能包含可能敏感的旧数据。

如果 `size` 小于或等于 [`Buffer.poolSize`](/zh/nodejs/api/buffer#class-property-bufferpoolsize) 的一半，则由 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize)、[`Buffer.from(string)`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding)、[`Buffer.concat()`](/zh/nodejs/api/buffer#static-method-bufferconcatlist-totallength) 和 [`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray) 返回的 `Buffer` 实例*可能*从共享的内部内存池中分配。 由 [`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) 返回的实例*从不*使用共享的内部内存池。


### `--zero-fill-buffers` 命令行选项 {#the---zero-fill-buffers-command-line-option}

**添加于: v5.10.0**

可以使用 `--zero-fill-buffers` 命令行选项启动 Node.js，以使所有新分配的 `Buffer` 实例在默认情况下在创建时都进行零填充。 如果不使用该选项，则使用 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize)、[`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) 和 `new SlowBuffer(size)` 创建的缓冲区不会进行零填充。 使用此标志可能会对性能产生明显的负面影响。 仅在必要时使用 `--zero-fill-buffers` 选项，以强制新分配的 `Buffer` 实例不能包含可能敏感的旧数据。

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### 是什么使 `Buffer.allocUnsafe()` 和 `Buffer.allocUnsafeSlow()` "不安全"? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

当调用 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 和 [`Buffer.allocUnsafeSlow()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) 时，分配的内存段是 *未初始化的*（它没有被置零）。 虽然此设计使内存分配非常快，但分配的内存段可能包含可能敏感的旧数据。 使用通过 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 创建的 `Buffer` 而不 *完全* 覆盖内存可能会在读取 `Buffer` 内存时泄露此旧数据。

虽然使用 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 具有明显的性能优势，但 *必须* 格外小心，以避免将安全漏洞引入到应用程序中。

