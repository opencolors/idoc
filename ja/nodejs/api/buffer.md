---
title: Node.js Buffer ドキュメント
description: Node.jsのBufferドキュメントは、Node.jsでバイナリデータを扱う方法について詳細な情報を提供します。バッファの作成、操作、変換を含みます。
head:
  - - meta
    - name: og:title
      content: Node.js Buffer ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのBufferドキュメントは、Node.jsでバイナリデータを扱う方法について詳細な情報を提供します。バッファの作成、操作、変換を含みます。
  - - meta
    - name: twitter:title
      content: Node.js Buffer ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのBufferドキュメントは、Node.jsでバイナリデータを扱う方法について詳細な情報を提供します。バッファの作成、操作、変換を含みます。
---


# Buffer {#buffer}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

`Buffer` オブジェクトは、固定長のバイトシーケンスを表すために使用されます。 多くの Node.js API は `Buffer` をサポートしています。

`Buffer` クラスは、JavaScript の [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) クラスのサブクラスであり、追加のユースケースをカバーするメソッドで拡張されています。 Node.js API は、`Buffer` がサポートされている場所であればどこでも、プレーンな [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) も受け入れます。

`Buffer` クラスはグローバルスコープ内で利用できますが、インポートまたは require ステートメントを介して明示的に参照することをお勧めします。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 長さ 10 のゼロ埋め Buffer を作成します。
const buf1 = Buffer.alloc(10);

// 長さ 10 の Buffer を作成します。
// バイトはすべて値 `1` で埋められます。
const buf2 = Buffer.alloc(10, 1);

// 長さ 10 の初期化されていない Buffer を作成します。
// これは Buffer.alloc() を呼び出すよりも高速ですが、返される
// Buffer インスタンスには古いデータが含まれている可能性があるため、
// fill()、write()、または Buffer の内容を埋めるその他の関数を使用して
// 上書きする必要があります。
const buf3 = Buffer.allocUnsafe(10);

// バイト [1, 2, 3] を含む Buffer を作成します。
const buf4 = Buffer.from([1, 2, 3]);

// バイト [1, 1, 1, 1] を含む Buffer を作成します – エントリはすべて
// `(value & 255)` を使用して 0–255 の範囲に収まるように切り捨てられます。
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 文字列 'tést' の UTF-8 エンコードされたバイトを含む Buffer を作成します。
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (16進表記)
// [116, 195, 169, 115, 116] (10進表記)
const buf6 = Buffer.from('tést');

// Latin-1 バイト [0x74, 0xe9, 0x73, 0x74] を含む Buffer を作成します。
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 長さ 10 のゼロ埋め Buffer を作成します。
const buf1 = Buffer.alloc(10);

// 長さ 10 の Buffer を作成します。
// バイトはすべて値 `1` で埋められます。
const buf2 = Buffer.alloc(10, 1);

// 長さ 10 の初期化されていない Buffer を作成します。
// これは Buffer.alloc() を呼び出すよりも高速ですが、返される
// Buffer インスタンスには古いデータが含まれている可能性があるため、
// fill()、write()、または Buffer の内容を埋めるその他の関数を使用して
// 上書きする必要があります。
const buf3 = Buffer.allocUnsafe(10);

// バイト [1, 2, 3] を含む Buffer を作成します。
const buf4 = Buffer.from([1, 2, 3]);

// バイト [1, 1, 1, 1] を含む Buffer を作成します – エントリはすべて
// `(value & 255)` を使用して 0–255 の範囲に収まるように切り捨てられます。
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 文字列 'tést' の UTF-8 エンコードされたバイトを含む Buffer を作成します。
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (16進表記)
// [116, 195, 169, 115, 116] (10進表記)
const buf6 = Buffer.from('tést');

// Latin-1 バイト [0x74, 0xe9, 0x73, 0x74] を含む Buffer を作成します。
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## バッファと文字エンコーディング {#buffers-and-character-encodings}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.7.0, v14.18.0 | `base64url` エンコーディングを導入。 |
| v6.4.0 | `latin1` を `binary` のエイリアスとして導入。 |
| v5.0.0 | 非推奨の `raw` および `raws` エンコーディングを削除。 |
:::

`Buffer` と文字列の間で変換する際、文字エンコーディングを指定できます。文字エンコーディングが指定されていない場合、UTF-8 がデフォルトとして使用されます。

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

Node.js のバッファは、受信するエンコーディング文字列の大文字小文字のすべてのバリエーションを受け入れます。たとえば、UTF-8 は `'utf8'`、`'UTF8'`、または `'uTf8'` として指定できます。

Node.js で現在サポートされている文字エンコーディングは次のとおりです。

-  `'utf8'` (エイリアス: `'utf-8'`): マルチバイトでエンコードされた Unicode 文字。多くの Web ページやその他のドキュメント形式は [UTF-8](https://en.wikipedia.org/wiki/UTF-8) を使用します。これはデフォルトの文字エンコーディングです。有効な UTF-8 データのみを含まない `Buffer` を文字列にデコードすると、Unicode 置換文字 `U+FFFD` � がエラーを表すために使用されます。
-  `'utf16le'` (エイリアス: `'utf-16le'`): マルチバイトでエンコードされた Unicode 文字。`'utf8'` とは異なり、文字列内の各文字は 2 バイトまたは 4 バイトを使用してエンコードされます。Node.js は [UTF-16](https://en.wikipedia.org/wiki/UTF-16) の [リトルエンディアン](https://en.wikipedia.org/wiki/Endianness) バリアントのみをサポートしています。
-  `'latin1'`: Latin-1 は [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1) を表します。この文字エンコーディングは、`U+0000` から `U+00FF` までの Unicode 文字のみをサポートします。各文字は単一のバイトを使用してエンコードされます。その範囲に収まらない文字は切り捨てられ、その範囲内の文字にマップされます。

上記のいずれかを使用して `Buffer` を文字列に変換することをデコードといい、文字列を `Buffer` に変換することをエンコードといいます。

Node.js は、次のバイナリからテキストへのエンコーディングもサポートしています。バイナリからテキストへのエンコーディングの場合、命名規則は逆になります: `Buffer` を文字列に変換することは通常エンコードと呼ばれ、文字列を `Buffer` に変換することはデコードと呼ばれます。

-  `'base64'`: [Base64](https://en.wikipedia.org/wiki/Base64) エンコーディング。文字列から `Buffer` を作成する場合、このエンコーディングは、[RFC 4648, Section 5](https://tools.ietf.org/html/rfc4648#section-5) で指定されている "URL and Filename Safe Alphabet" も正しく受け入れます。base64 エンコードされた文字列内に含まれるスペース、タブ、改行などの空白文字は無視されます。
-  `'base64url'`: [RFC 4648, Section 5](https://tools.ietf.org/html/rfc4648#section-5) で指定されている [base64url](https://tools.ietf.org/html/rfc4648#section-5) エンコーディング。文字列から `Buffer` を作成する場合、このエンコーディングは通常の base64 エンコードされた文字列も正しく受け入れます。`Buffer` を文字列にエンコードする場合、このエンコーディングはパディングを省略します。
-  `'hex'`: 各バイトを 2 つの 16 進文字としてエンコードします。16 進文字の偶数のみで構成されていない文字列をデコードすると、データが切り捨てられる場合があります。以下の例を参照してください。

次のレガシー文字エンコーディングもサポートされています。

-  `'ascii'`: 7 ビットの [ASCII](https://en.wikipedia.org/wiki/ASCII) データのみ。文字列を `Buffer` にエンコードする場合、これは `'latin1'` を使用するのと同じです。`Buffer` を文字列にデコードする場合、このエンコーディングを使用すると、`'latin1'` としてデコードする前に各バイトの最上位ビットが設定解除されます。通常、このエンコーディングを使用する理由はありません。`'utf8'`（または、データが常に ASCII のみであることがわかっている場合は `'latin1'`）が、ASCII のみのテキストをエンコードまたはデコードする場合に適しています。レガシー互換性のためだけに提供されています。
-  `'binary'`: `'latin1'` のエイリアス。ここにリストされているすべてのエンコーディングは文字列とバイナリデータの間の変換を行うため、このエンコーディングの名前は非常に誤解を招く可能性があります。文字列と `Buffer` の間の変換には、通常 `'utf8'` が適切な選択です。
-  `'ucs2'`, `'ucs-2'`: `'utf16le'` のエイリアス。UCS-2 は、U+FFFF より大きいコードポイントを持つ文字をサポートしていない UTF-16 のバリアントを指していました。Node.js では、これらのコードポイントは常にサポートされています。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, data truncated when first non-hexadecimal value
// ('g') encountered.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, data truncated when data ends in single digit ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, all data represented.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, data truncated when first non-hexadecimal value
// ('g') encountered.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, data truncated when data ends in single digit ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, all data represented.
```
:::

最新の Web ブラウザは、`'latin1'` と `'ISO-8859-1'` の両方を `'win-1252'` にエイリアスする [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) に従います。つまり、`http.get()` などの処理を行う際に、返された charset が WHATWG 仕様にリストされているもののいずれかである場合、サーバーが実際には `'win-1252'` でエンコードされたデータを返している可能性があり、`'latin1'` エンコーディングを使用すると文字が誤ってデコードされる可能性があります。


## Buffers と TypedArrays {#buffers-and-typedarrays}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v3.0.0 | `Buffer` クラスが `Uint8Array` を継承するようになりました。 |
:::

`Buffer` インスタンスは、JavaScript の [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) および [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) インスタンスでもあります。 すべての [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) メソッドは `Buffer` で利用できます。 ただし、`Buffer` API と [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) API の間には、微妙な非互換性があります。

特に:

- [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) は `TypedArray` の一部のコピーを作成しますが、[`Buffer.prototype.slice()`](/ja/nodejs/api/buffer#bufslicestart-end) はコピーせずに既存の `Buffer` 上のビューを作成します。 この動作は驚くべきものであり、レガシー互換性のためだけに存在します。 [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) を使用すると、`Buffer` と他の `TypedArray` の両方で [`Buffer.prototype.slice()`](/ja/nodejs/api/buffer#bufslicestart-end) の動作を実現でき、推奨されます。
- [`buf.toString()`](/ja/nodejs/api/buffer#buftostringencoding-start-end) は、対応する `TypedArray` と互換性がありません。
- 多数のメソッド（例えば、[`buf.indexOf()`](/ja/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)）は、追加の引数をサポートしています。

`Buffer` から新しい [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) インスタンスを作成する方法は2つあります。

- `Buffer` を [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) コンストラクターに渡すと、`Buffer` の内容がコピーされ、整数の配列として解釈されます。ターゲット型のバイトシーケンスとしては解釈されません。

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

- `Buffer` の基になる [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) を渡すと、`Buffer` とメモリを共有する [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) が作成されます。

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

同様の方法で `TypedArray` オブジェクトの `.buffer` プロパティを使用すると、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) インスタンスと同じ割り当てられたメモリを共有する新しい `Buffer` を作成できます。 [`Buffer.from()`](/ja/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) は、このコンテキストでは `new Uint8Array()` のように動作します。

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

[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) の `.buffer` を使用して `Buffer` を作成する場合、`byteOffset` および `length` パラメーターを渡すことによって、基になる [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) の一部のみを使用できます。

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

`Buffer.from()` と [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) は、シグネチャと実装が異なります。 特に、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) バリアントは、型付き配列のすべての要素に対して呼び出されるマッピング関数である2番目の引数を受け入れます。

- `TypedArray.from(source[, mapFn[, thisArg]])`

ただし、`Buffer.from()` メソッドは、マッピング関数の使用をサポートしていません。

- [`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/ja/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ja/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## バッファとイテレーション {#buffers-and-iteration}

`Buffer` インスタンスは `for..of` 構文を使用して反復処理できます:

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

さらに、[`buf.values()`](/ja/nodejs/api/buffer#bufvalues), [`buf.keys()`](/ja/nodejs/api/buffer#bufkeys), および [`buf.entries()`](/ja/nodejs/api/buffer#bufentries) メソッドを使用してイテレーターを作成できます。

## Class: `Blob` {#class-blob}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0, v16.17.0 | 実験的ではなくなりました。 |
| v15.7.0, v14.18.0 | 追加: v15.7.0, v14.18.0 |
:::

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) は、複数のワーカースレッド間で安全に共有できる不変の生のデータをカプセル化します。

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.7.0 | 行末を置き換える標準の `endings` オプションが追加され、非標準の `encoding` オプションが削除されました。 |
| v15.7.0, v14.18.0 | 追加: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ja/nodejs/api/buffer#class-blob) 文字列、[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)、または [\<Blob\>](/ja/nodejs/api/buffer#class-blob) オブジェクトの配列、またはそのようなオブジェクトの任意の組み合わせ。`Blob` 内に保存されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'transparent'` または `'native'` のいずれか。 `'native'` に設定すると、文字列ソース部分の行末は、`require('node:os').EOL` で指定されているプラットフォームネイティブの行末に変換されます。
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob コンテンツタイプ。 `type` はデータの MIME メディアタイプを伝達することを意図していますが、タイプ形式の検証は実行されません。

指定されたソースの連結を含む新しい `Blob` オブジェクトを作成します。

[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), および [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) ソースは 'Blob' にコピーされるため、'Blob' の作成後に安全に変更できます。

文字列ソースは UTF-8 バイトシーケンスとしてエンコードされ、Blob にコピーされます。 各文字列部分内の不一致のサロゲートペアは、Unicode U+FFFD 置換文字に置き換えられます。


### `blob.arrayBuffer()` {#blobarraybuffer}

**Added in: v15.7.0, v14.18.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`Blob`データのコピーを含む[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)で解決されるPromiseを返します。

#### `blob.bytes()` {#blobbytes}

**Added in: v22.3.0, v20.16.0**

`blob.bytes()`メソッドは、`Blob`オブジェクトのバイトを`Promise\<Uint8Array\>`として返します。

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // 出力: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Added in: v15.7.0, v14.18.0**

`Blob`の合計サイズ（バイト単位）。

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Added in: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 開始インデックス。
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 終了インデックス。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新しい`Blob`のコンテンツタイプ

この`Blob`オブジェクトのデータのサブセットを含む新しい`Blob`を作成して返します。 元の`Blob`は変更されません。

### `blob.stream()` {#blobstream}

**Added in: v16.7.0**

- 戻り値: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

`Blob`のコンテンツの読み取りを可能にする新しい`ReadableStream`を返します。

### `blob.text()` {#blobtext}

**Added in: v15.7.0, v14.18.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

UTF-8文字列としてデコードされた`Blob`のコンテンツで解決されるPromiseを返します。

### `blob.type` {#blobtype}

**Added in: v15.7.0, v14.18.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`Blob`のコンテンツタイプ。


### `Blob` オブジェクトと `MessageChannel` {#blob-objects-and-messagechannel}

[\<Blob\>](/ja/nodejs/api/buffer#class-blob) オブジェクトが作成されると、データを転送または即座にコピーすることなく、`MessagePort` 経由で複数の宛先に送信できます。`Blob` に含まれるデータは、`arrayBuffer()` または `text()` メソッドが呼び出された場合にのみコピーされます。

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

## クラス: `Buffer` {#class-buffer}

`Buffer` クラスは、バイナリデータを直接扱うためのグローバル型です。さまざまな方法で構築できます。

### 静的メソッド: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | 無効な入力引数に対して、ERR_INVALID_ARG_VALUE の代わりに ERR_INVALID_ARG_TYPE または ERR_OUT_OF_RANGE をスローします。 |
| v15.0.0 | 無効な入力引数に対して、ERR_INVALID_OPT_VALUE の代わりに ERR_INVALID_ARG_VALUE をスローします。 |
| v10.0.0 | 長さがゼロでないバッファーを長さがゼロのバッファーで埋めようとすると、例外がスローされます。 |
| v10.0.0 | `fill` に無効な文字列を指定すると、例外がスローされます。 |
| v8.9.3 | `fill` に無効な文字列を指定すると、ゼロで埋められたバッファーになります。 |
| v5.10.0 | 追加: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` の希望する長さ。
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` を事前に埋める値。**デフォルト:** `0`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `fill` が文字列の場合、これはそのエンコーディングです。**デフォルト:** `'utf8'`。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`size` バイトの新しい `Buffer` を割り当てます。`fill` が `undefined` の場合、`Buffer` はゼロで埋められます。

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

`size` が [`buffer.constants.MAX_LENGTH`](/ja/nodejs/api/buffer#bufferconstantsmax_length) より大きいか、0 より小さい場合、[`ERR_OUT_OF_RANGE`](/ja/nodejs/api/errors#err_out_of_range) がスローされます。

`fill` が指定されている場合、割り当てられた `Buffer` は [`buf.fill(fill)`](/ja/nodejs/api/buffer#buffillvalue-offset-end-encoding) を呼び出して初期化されます。

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

`fill` と `encoding` の両方が指定されている場合、割り当てられた `Buffer` は [`buf.fill(fill, encoding)`](/ja/nodejs/api/buffer#buffillvalue-offset-end-encoding) を呼び出して初期化されます。

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

[`Buffer.alloc()`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) の呼び出しは、代替の [`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) よりも測定可能に遅くなる可能性がありますが、新しく作成された `Buffer` インスタンスの内容に、`Buffer` に割り当てられていない可能性のあるデータを含め、以前の割り当てからの機密データが絶対に格納されないようにします。

`size` が数値でない場合、`TypeError` がスローされます。


### 静的メソッド: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | 無効な入力引数に対して、ERR_INVALID_ARG_VALUE ではなく ERR_INVALID_ARG_TYPE または ERR_OUT_OF_RANGE をスローするようになりました。 |
| v15.0.0 | 無効な入力引数に対して、ERR_INVALID_OPT_VALUE ではなく ERR_INVALID_ARG_VALUE をスローするようになりました。 |
| v7.0.0 | 負の `size` を渡すとエラーがスローされるようになりました。 |
| v5.10.0 | 追加: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` の必要な長さ。
- 返却値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`size` バイトの新しい `Buffer` を割り当てます。`size` が [`buffer.constants.MAX_LENGTH`](/ja/nodejs/api/buffer#bufferconstantsmax_length) より大きいか、0 より小さい場合、[`ERR_OUT_OF_RANGE`](/ja/nodejs/api/errors#err_out_of_range) がスローされます。

この方法で作成された `Buffer` インスタンスの基になるメモリは *初期化されていません*。新しく作成された `Buffer` の内容は不明であり、*機密データが含まれている可能性があります*。`Buffer` インスタンスをゼロで初期化するには、代わりに [`Buffer.alloc()`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) を使用してください。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Prints (内容は異なる場合があります): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Prints (内容は異なる場合があります): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

`size` が数値でない場合、`TypeError` がスローされます。

`Buffer` モジュールは、[`Buffer.poolSize`](/ja/nodejs/api/buffer#class-property-bufferpoolsize) のサイズの内部 `Buffer` インスタンスを事前に割り当てます。これは、[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)、[`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray)、[`Buffer.from(string)`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding)、および [`Buffer.concat()`](/ja/nodejs/api/buffer#static-method-bufferconcatlist-totallength) を使用して作成された新しい `Buffer` インスタンスを高速に割り当てるためのプールとして使用されます。ただし、`size` が `Buffer.poolSize \>\>\> 1` ([`Buffer.poolSize`](/ja/nodejs/api/buffer#class-property-bufferpoolsize) を 2 で割った数のfloor) より小さい場合に限ります。

この事前に割り当てられた内部メモリプールの使用は、`Buffer.alloc(size, fill)` を呼び出す場合と `Buffer.allocUnsafe(size).fill(fill)` を呼び出す場合の重要な違いです。具体的には、`Buffer.alloc(size, fill)` は内部 `Buffer` プールを *決して* 使用しませんが、`Buffer.allocUnsafe(size).fill(fill)` は `size` が [`Buffer.poolSize`](/ja/nodejs/api/buffer#class-property-bufferpoolsize) の半分以下である場合に内部 `Buffer` プールを *使用します*。違いは微妙ですが、アプリケーションが [`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) が提供する追加のパフォーマンスを必要とする場合には重要になる可能性があります。


### 静的メソッド: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | 無効な入力引数に対して、ERR_INVALID_ARG_VALUE の代わりに ERR_INVALID_ARG_TYPE または ERR_OUT_OF_RANGE をスローします。 |
| v15.0.0 | 無効な入力引数に対して、ERR_INVALID_OPT_VALUE の代わりに ERR_INVALID_ARG_VALUE をスローします。 |
| v5.12.0 | 追加: v5.12.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` の必要な長さ。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`size` バイトの新しい `Buffer` を割り当てます。 `size` が [`buffer.constants.MAX_LENGTH`](/ja/nodejs/api/buffer#bufferconstantsmax_length) より大きいか、0 より小さい場合、[`ERR_OUT_OF_RANGE`](/ja/nodejs/api/errors#err_out_of_range) がスローされます。 `size` が 0 の場合、長さ 0 の `Buffer` が作成されます。

この方法で作成された `Buffer` インスタンスの基になるメモリは *初期化されません*。 新しく作成された `Buffer` の内容は不明であり、*機密データが含まれている可能性があります*。 このような `Buffer` インスタンスをゼロで初期化するには、[`buf.fill(0)`](/ja/nodejs/api/buffer#buffillvalue-offset-end-encoding) を使用します。

[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) を使用して新しい `Buffer` インスタンスを割り当てる場合、`Buffer.poolSize \>\>\> 1` 未満の割り当て（デフォルトの poolSize が使用されている場合は 4KiB）は、事前に割り当てられた単一の `Buffer` からスライスされます。 これにより、アプリケーションは、個別に割り当てられた多数の `Buffer` インスタンスを作成する際のガベージコレクションのオーバーヘッドを回避できます。 このアプローチは、個々の `ArrayBuffer` オブジェクトを追跡およびクリーンアップする必要性を排除することにより、パフォーマンスとメモリ使用量の両方を改善します。

ただし、開発者がプールからの小さなメモリチャンクを不定期間保持する必要がある場合は、`Buffer.allocUnsafeSlow()` を使用してプールされていない `Buffer` インスタンスを作成し、関連するビットをコピーアウトすることが適切な場合があります。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 少数の小さなメモリチャンクを保持する必要があります。
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 保持されたデータ用に割り当てます。
    const sb = Buffer.allocUnsafeSlow(10);

    // データを新しい割り当てにコピーします。
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 少数の小さなメモリチャンクを保持する必要があります。
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 保持されたデータ用に割り当てます。
    const sb = Buffer.allocUnsafeSlow(10);

    // データを新しい割り当てにコピーします。
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

`size` が数値でない場合、`TypeError` がスローされます。


### 静的メソッド: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v7.0.0 | 無効な入力を渡すとエラーが発生するようになりました。 |
| v5.10.0 | `string` パラメーターは、任意の `TypedArray`、`DataView`、または `ArrayBuffer` になりました。 |
| v0.1.90 | v0.1.90 で追加 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 長さを計算する値。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` が文字列の場合、これはそのエンコーディングです。 **デフォルト:** `'utf8'`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `string` 内に含まれるバイト数。

`encoding` を使用してエンコードされた文字列のバイト長を返します。 これは、文字列をバイトに変換するために使用されるエンコーディングを考慮しない [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length) とは異なります。

`'base64'`、`'base64url'`、および `'hex'` の場合、この関数は有効な入力を想定しています。 非 base64/hex エンコードデータ (空白など) を含む文字列の場合、戻り値は文字列から作成された `Buffer` の長さよりも大きくなる可能性があります。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} 文字, ` +
            `${Buffer.byteLength(str, 'utf8')} バイト`);
// Prints: ½ + ¼ = ¾: 9 文字, 12 バイト
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} 文字, ` +
            `${Buffer.byteLength(str, 'utf8')} バイト`);
// Prints: ½ + ¼ = ¾: 9 文字, 12 バイト
```
:::

`string` が `Buffer` / [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) / [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) / [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) / [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) の場合、`.byteLength` によって報告されるバイト長が返されます。


### 静的メソッド: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | 引数に `Uint8Array` を使用できるようになりました。 |
| v0.11.13 | Added in: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 比較の結果に応じて、`-1`、`0`、または `1` のいずれか。詳細については、[`buf.compare()`](/ja/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) を参照してください。

通常は `Buffer` インスタンスの配列をソートする目的で、`buf1` を `buf2` と比較します。これは、[`buf1.compare(buf2)`](/ja/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) を呼び出すのと同じです。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (This result is equal to: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (This result is equal to: [buf2, buf1].)
```
:::

### 静的メソッド: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | `list` の要素に `Uint8Array` を使用できるようになりました。 |
| v0.7.11 | Added in: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 連結する `Buffer` または [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) インスタンスのリスト。
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 連結時の `list` 内の `Buffer` インスタンスの合計長。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`list` 内のすべての `Buffer` インスタンスを連結した結果である新しい `Buffer` を返します。

リストにアイテムがない場合、または `totalLength` が 0 の場合は、新しいゼロ長の `Buffer` が返されます。

`totalLength` が提供されない場合、`list` 内の `Buffer` インスタンスの長さを加算して計算されます。

`totalLength` が提供される場合、符号なし整数に強制されます。`list` 内の `Buffer` の合計長が `totalLength` を超える場合、結果は `totalLength` に切り捨てられます。`list` 内の `Buffer` の合計長が `totalLength` より小さい場合、残りのスペースはゼロで埋められます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 3 つの `Buffer` インスタンスのリストから単一の `Buffer` を作成します。

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 3 つの `Buffer` インスタンスのリストから単一の `Buffer` を作成します。

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```
:::

`Buffer.concat()` は、[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) と同様に、内部 `Buffer` プールを使用する場合があります。


### 静的メソッド: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**追加:** v19.8.0, v18.16.0

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) コピーする[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `view` 内の開始オフセット。**デフォルト:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `view` からコピーする要素の数。**デフォルト:** `view.length - offset`。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`view` の基になるメモリを新しい `Buffer` にコピーします。

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### 静的メソッド: `Buffer.from(array)` {#static-method-bufferfromarray}

**追加:** v5.10.0

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`0` – `255` の範囲のバイトの `array` を使用して、新しい `Buffer` を割り当てます。 その範囲外の配列エントリは、それに合わせて切り捨てられます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 文字列 'buffer' の UTF-8 バイトを含む新しい Buffer を作成します。
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 文字列 'buffer' の UTF-8 バイトを含む新しい Buffer を作成します。
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

`array` が `Array` ライクなオブジェクト (つまり、型 `number` の `length` プロパティを持つオブジェクト) の場合、`Buffer` または `Uint8Array` でない限り、配列であるかのように扱われます。 これは、他のすべての `TypedArray` バリアントが `Array` として扱われることを意味します。 `TypedArray` をバッキングするバイトから `Buffer` を作成するには、[`Buffer.copyBytesFrom()`](/ja/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length) を使用します。

`array` が `Array` でない場合、または `Buffer.from()` バリアントに適した別の型でない場合は、`TypeError` がスローされます。

`Buffer.from(array)` と [`Buffer.from(string)`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding) は、[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) と同様に、内部の `Buffer` プールも使用する場合があります。


### 静的メソッド: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**追加: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)。例えば、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) の `.buffer` プロパティなどです。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公開する最初のバイトのインデックス。**デフォルト:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公開するバイト数。**デフォルト:** `arrayBuffer.byteLength - byteOffset`。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

これは、基になるメモリをコピーせずに、[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) のビューを作成します。例えば、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) インスタンスの `.buffer` プロパティへの参照を渡すと、新しく作成された `Buffer` は、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) の基になる `ArrayBuffer` と同じ割り当てられたメモリを共有します。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```
:::

オプションの `byteOffset` および `length` 引数は、`Buffer` によって共有される `arrayBuffer` 内のメモリ範囲を指定します。

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

`arrayBuffer` が [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) または [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) ではない場合、または `Buffer.from()` バリアントに適した別の型ではない場合、`TypeError` がスローされます。

バッキング `ArrayBuffer` は、`TypedArray` ビューの範囲を超えるメモリ範囲をカバーできることを覚えておくことが重要です。`TypedArray` の `buffer` プロパティを使用して作成された新しい `Buffer` は、`TypedArray` の範囲を超える可能性があります。

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


### 静的メソッド: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**追加: v5.10.0**

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) データをコピーする既存の `Buffer` または [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

渡された `buffer` データを新しい `Buffer` インスタンスにコピーします。

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

`buffer` が `Buffer` ではない場合、または `Buffer.from()` のバリアントに適した別の型ではない場合、`TypeError` がスローされます。

### 静的メソッド: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**追加: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `Symbol.toPrimitive` または `valueOf()` をサポートするオブジェクト。
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) バイトオフセットまたはエンコーディング。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 長さ。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`valueOf()` 関数が `object` と厳密に等しくない値を返すオブジェクトの場合、`Buffer.from(object.valueOf(), offsetOrEncoding, length)` を返します。

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

`Symbol.toPrimitive` をサポートするオブジェクトの場合、`Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)` を返します。

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

`object` が上記のメソッドを持たない場合、または `Buffer.from()` のバリアントに適した別の型ではない場合、`TypeError` がスローされます。


### 静的メソッド: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**追加:** v5.10.0

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エンコードする文字列。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` のエンコーディング。 **デフォルト:** `'utf8'`。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`string` を含む新しい `Buffer` を作成します。 `encoding` パラメーターは、`string` をバイトに変換する際に使用する文字エンコーディングを識別します。

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

`string` が文字列ではない場合、または `Buffer.from()` バリアントに適切な別の型ではない場合、`TypeError` がスローされます。

[`Buffer.from(string)`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding) は、[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) と同様に、内部 `Buffer` プールを使用する場合もあります。

### 静的メソッド: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**追加:** v0.1.101

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`obj` が `Buffer` の場合 `true` を返し、それ以外の場合は `false` を返します。

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


### 静的メソッド: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**追加: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) チェックする文字エンコーディングの名前。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`encoding` がサポートされている文字エンコーディングの名前である場合は `true`、そうでない場合は `false` を返します。

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

### クラスプロパティ: `Buffer.poolSize` {#class-property-bufferpoolsize}

**追加: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `8192`

これは、プーリングに使用される事前に割り当てられた内部 `Buffer` インスタンスのサイズ（バイト単位）です。この値は変更できます。

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

インデックス演算子 `[index]` を使用して、`buf` 内の位置 `index` にあるオクテットを取得および設定できます。値は個々のバイトを参照するため、有効な値の範囲は `0x00` から `0xFF`（16進数）または `0` から `255`（10進数）です。

この演算子は `Uint8Array` から継承されているため、範囲外アクセスでの動作は `Uint8Array` と同じです。言い換えると、`index` が負の場合、または `buf.length` 以上の場合、`buf[index]` は `undefined` を返し、`index` が負の場合、または `\>= buf.length` の場合、`buf[index] = value` はバッファーを変更しません。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// ASCII 文字列を一度に 1 バイトずつ `Buffer` にコピーします。
// (これは ASCII のみの文字列でのみ機能します。一般的には、この変換を実行するには
// `Buffer.from()` を使用する必要があります。)

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

// ASCII 文字列を一度に 1 バイトずつ `Buffer` にコピーします。
// (これは ASCII のみの文字列でのみ機能します。一般的には、この変換を実行するには
// `Buffer.from()` を使用する必要があります。)

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

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) この `Buffer` オブジェクトの作成元となる、基になる `ArrayBuffer` オブジェクト。

この `ArrayBuffer` が、元の `Buffer` と正確に対応することは保証されていません。詳細については `buf.byteOffset` の注記を参照してください。

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

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Buffer` の基になる `ArrayBuffer` オブジェクトの `byteOffset`。

`Buffer.from(ArrayBuffer, byteOffset, length)` で `byteOffset` を設定する場合や、`Buffer.poolSize` よりも小さい `Buffer` を割り当てる場合、バッファは基になる `ArrayBuffer` のゼロオフセットから開始されないことがあります。

`buf.buffer` を使用して基になる `ArrayBuffer` に直接アクセスすると、`ArrayBuffer` の他の部分が `Buffer` オブジェクト自体とは無関係である可能性があるため、問題が発生する可能性があります。

`Buffer` とメモリを共有する `TypedArray` オブジェクトを作成する際の一般的な問題は、この場合、`byteOffset` を正しく指定する必要があることです。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer.poolSize` よりも小さいバッファを作成します。
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Node.js の Buffer を Int8Array にキャストするときは、`nodeBuffer.buffer` の `nodeBuffer` のメモリを含む部分のみを参照するために byteOffset を使用します。
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer.poolSize` よりも小さいバッファを作成します。
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Node.js の Buffer を Int8Array にキャストするときは、`nodeBuffer.buffer` の `nodeBuffer` のメモリを含む部分のみを参照するために byteOffset を使用します。
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | `target` パラメータは `Uint8Array` になれるようになりました。 |
| v5.11.0 | オフセットを指定するための追加パラメータがサポートされるようになりました。 |
| v0.11.13 | 追加: v0.11.13 |
:::

- `target` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `buf` と比較する `Buffer` または [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 比較を開始する `target` 内のオフセット。**デフォルト:** `0`。
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 比較を終了する `target` 内のオフセット（排他的）。**デフォルト:** `target.length`。
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 比較を開始する `buf` 内のオフセット。**デフォルト:** `0`。
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 比較を終了する `buf` 内のオフセット（排他的）。**デフォルト:** [`buf.length`](/ja/nodejs/api/buffer#buflength)。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf` を `target` と比較し、ソート順で `buf` が `target` の前、後、または同じであるかを示す数値を返します。比較は、各 `Buffer` 内の実際のバイトシーケンスに基づいています。

- `target` が `buf` と同じ場合は `0` が返されます。
- `target` がソートされたときに `buf` の *前* に来るはずの場合は `1` が返されます。
- `target` がソートされたときに `buf` の *後* に来るはずの場合は `-1` が返されます。

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

オプションの引数 `targetStart`、`targetEnd`、`sourceStart`、および `sourceEnd` を使用して、比較をそれぞれ `target` および `buf` 内の特定の範囲に制限できます。

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

`targetStart \< 0`、`sourceStart \< 0`、`targetEnd \> target.byteLength`、または `sourceEnd \> source.byteLength` の場合、[`ERR_OUT_OF_RANGE`](/ja/nodejs/api/errors#err_out_of_range) がスローされます。


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Added in: v0.1.90**

- `target` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) コピー先の`Buffer`または[`Uint8Array`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- `targetStart` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する`target`内のオフセット。**デフォルト:** `0`。
- `sourceStart` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) コピーを開始する`buf`内のオフセット。**デフォルト:** `0`。
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) コピーを停止する`buf`内のオフセット（含まれません）。**デフォルト:** [`buf.length`](/ja/nodejs/api/buffer#buflength)。
- 戻り値: [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) コピーされたバイト数。

`target`内の領域に`buf`の領域からデータをコピーします。`target`メモリ領域が`buf`とオーバーラップする場合でも同様です。

[`TypedArray.prototype.set()`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) は同じ操作を実行し、Node.js `Buffer` を含むすべての TypedArray で利用できますが、関数の引数が異なります。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// 2つの`Buffer`インスタンスを作成します。
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97は'a'の10進数のASCII値です。
  buf1[i] = i + 97;
}

// `buf1`のバイト16から19までを、`buf2`のバイト8から`buf2`にコピーします。
buf1.copy(buf2, 8, 16, 20);
// これは以下と同等です:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// 2つの`Buffer`インスタンスを作成します。
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97は'a'の10進数のASCII値です。
  buf1[i] = i + 97;
}

// `buf1`のバイト16から19までを、`buf2`のバイト8から`buf2`にコピーします。
buf1.copy(buf2, 8, 16, 20);
// これは以下と同等です:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer`を作成し、同じ`Buffer`内のオーバーラップする領域間でデータをコピーします。

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97は'a'の10進数のASCII値です。
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer`を作成し、同じ`Buffer`内のオーバーラップする領域間でデータをコピーします。

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97は'a'の10進数のASCII値です。
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Added in: v1.1.0**

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

`buf` の内容から `[index, byte]` ペアの [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) を生成して返します。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer` の内容全体をログ出力します。

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

// `Buffer` の内容全体をログ出力します。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | 引数は `Uint8Array` を指定できるようになりました。 |
| v0.11.13 | Added in: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `buf` と比較する `Buffer` または [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`buf` と `otherBuffer` の両方が完全に同じバイトを持っている場合は `true`、そうでない場合は `false` を返します。 [`buf.compare(otherBuffer) === 0`](/ja/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) と同じです。

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

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | `ERR_INDEX_OUT_OF_RANGE` ではなく `ERR_OUT_OF_RANGE` をスローします。 |
| v10.0.0 | 負の `end` の値は `ERR_INDEX_OUT_OF_RANGE` エラーをスローします。 |
| v10.0.0 | 長さがゼロでないバッファーを長さゼロのバッファーで埋めようとすると、例外が発生します。 |
| v10.0.0 | `value` に無効な文字列を指定すると、例外が発生します。 |
| v5.7.0 | `encoding` パラメーターがサポートされるようになりました。 |
| v0.5.0 | Added in: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` を埋める値。 空の値（文字列、Uint8Array、Buffer）は `0` に変換されます。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` を埋め始める前にスキップするバイト数。 **デフォルト:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` を埋めるのを停止する場所（含まない）。 **デフォルト:** [`buf.length`](/ja/nodejs/api/buffer#buflength)。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value` が文字列の場合の `value` のエンコーディング。 **デフォルト:** `'utf8'`。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) `buf` への参照。

`buf` を指定された `value` で埋めます。 `offset` と `end` が指定されていない場合、`buf` 全体が埋められます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer` を ASCII 文字 'h' で埋めます。

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// バッファーを空の文字列で埋めます
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer` を ASCII 文字 'h' で埋めます。

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// バッファーを空の文字列で埋めます
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```
:::

`value` が文字列、`Buffer`、または整数でない場合、`uint32` 値に強制されます。 結果の整数が `255` (10進数) より大きい場合、`buf` は `value & 255` で埋められます。

`fill()` 操作の最後の書き込みがマルチバイト文字に該当する場合、`buf` に収まるその文字のバイトのみが書き込まれます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// UTF-8 で 2 バイトを占める文字で `Buffer` を埋めます。

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// UTF-8 で 2 バイトを占める文字で `Buffer` を埋めます。

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
```
:::

`value` に無効な文字が含まれている場合、切り捨てられます。 有効なフィルデータが残っていない場合は、例外がスローされます。

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

**Added in: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 検索対象。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 内での検索開始位置。負数の場合、オフセットは `buf` の末尾から計算されます。**デフォルト:** `0`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value` が文字列の場合、これはそのエンコーディングです。**デフォルト:** `'utf8'`。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `value` が `buf` 内で見つかった場合は `true`、そうでない場合は `false`。

[`buf.indexOf() !== -1`](/ja/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding) と同等。

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
// Prints: true (97 は 'a' の10進数の ASCII 値)
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
// Prints: true (97 は 'a' の10進数の ASCII 値)
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | `value` に `Uint8Array` が使用可能になりました。 |
| v5.7.0, v4.4.0 | `encoding` が渡される場合、`byteOffset` パラメータは必須ではなくなりました。 |
| v1.5.0 | 追加: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 検索する対象。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` での検索を開始する位置。 負の場合、オフセットは `buf` の末尾から計算されます。 **デフォルト:** `0`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value` が文字列の場合、これは `buf` で検索される文字列のバイナリ表現を決定するために使用されるエンコーディングです。 **デフォルト:** `'utf8'`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 内の `value` の最初の出現箇所のインデックス。`buf` に `value` が含まれていない場合は `-1`。

`value` が以下の場合:

- 文字列の場合、`value` は `encoding` の文字エンコーディングに従って解釈されます。
- `Buffer` または [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) の場合、`value` は全体として使用されます。 部分的な `Buffer` を比較するには、[`buf.subarray`](/ja/nodejs/api/buffer#bufsubarraystart-end) を使用します。
- 数値の場合、`value` は `0` から `255` までの符号なし 8 ビット整数値として解釈されます。

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

`value` が文字列、数値、または `Buffer` でない場合、このメソッドは `TypeError` をスローします。 `value` が数値の場合、有効なバイト値、つまり 0 から 255 の間の整数に強制変換されます。

`byteOffset` が数値でない場合、数値に強制変換されます。 強制変換の結果が `NaN` または `0` の場合、バッファー全体が検索されます。 この動作は [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) と一致します。

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

`value` が空の文字列または空の `Buffer` であり、`byteOffset` が `buf.length` より小さい場合、`byteOffset` が返されます。 `value` が空で、`byteOffset` が少なくとも `buf.length` である場合、`buf.length` が返されます。


### `buf.keys()` {#bufkeys}

**Added in: v1.1.0**

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

`buf` のキー（インデックス）の[イテレーター](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)を作成して返します。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | `value` は `Uint8Array` になりました。 |
| v6.0.0 | Added in: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 検索する対象。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 内で検索を開始する位置。 負の数の場合、オフセットは `buf` の末尾から計算されます。 **デフォルト:** `buf.length - 1`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `value` が文字列の場合、これは `buf` で検索される文字列のバイナリ表現を決定するために使用されるエンコーディングです。 **デフォルト:** `'utf8'`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` 内の `value` の最後の出現箇所のインデックス。`buf` に `value` が含まれていない場合は `-1`。

[`buf.indexOf()`](/ja/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding) と同じですが、最初に出現する場所ではなく、`value` の最後の出現箇所が見つかります。

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

`value` が文字列、数値、または `Buffer` でない場合、このメソッドは `TypeError` をスローします。 `value` が数値の場合、0 から 255 の間の整数である有効なバイト値に強制変換されます。

`byteOffset` が数値でない場合、数値に強制変換されます。 `{}` や `undefined` のように `NaN` に強制変換される引数は、バッファー全体を検索します。 この動作は、[`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf) と一致します。

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

`value` が空の文字列または空の `Buffer` の場合、`byteOffset` が返されます。


### `buf.length` {#buflength}

**追加:** v0.1.90

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf` 内のバイト数を返します。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// `Buffer` を作成し、UTF-8 を使用してより短い文字列を書き込みます。

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// `Buffer` を作成し、UTF-8 を使用してより短い文字列を書き込みます。

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
```
:::

### `buf.parent` {#bufparent}

**非推奨:** v8.0.0以降

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`buf.buffer`](/ja/nodejs/api/buffer#bufbuffer) を使用してください。
:::

`buf.parent` プロパティは、非推奨の `buf.buffer` のエイリアスです。

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**追加:** v12.0.0, v10.20.0

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

指定された `offset` の `buf` から符号付きビッグエンディアン 64 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数符号付き値として解釈されます。

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**追加:** v12.0.0, v10.20.0

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

指定された `offset` の `buf` から符号付きリトルエンディアン 64 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数符号付き値として解釈されます。


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.10.0, v12.19.0 | この関数は `buf.readBigUint64BE()` としても利用可能です。 |
| v12.0.0, v10.20.0 | 追加: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

指定された `offset` で、`buf` から符号なしビッグエンディアン 64 ビット整数を読み取ります。

この関数は、エイリアス `readBigUint64BE` でも利用可能です。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.10.0, v12.19.0 | この関数は `buf.readBigUint64LE()` としても利用可能です。 |
| v12.0.0, v10.20.0 | 追加: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

指定された `offset` で、`buf` から符号なしリトルエンディアン 64 ビット整数を読み取ります。

この関数は、エイリアス `readBigUint64LE` でも利用可能です。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 8` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から 64 ビットのビッグエンディアンの倍精度浮動小数点数を読み取ります。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 8` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から 64 ビットのリトルエンディアンの倍精度浮動小数点数を読み取ります。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、オフセットの `uint32` への暗黙的な強制型変換を廃止しました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。`0 <= offset <= buf.length - 4` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` の `buf` から 32 ビットのビッグエンディアン浮動小数点数を読み取ります。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、オフセットの `uint32` への暗黙的な強制型変換を廃止しました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。`0 <= offset <= buf.length - 4` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` の `buf` から 32 ビットのリトルエンディアン浮動小数点数を読み取ります。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.0 | Added in: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。`0 <= offset <= buf.length - 1` を満たす必要があります。 **Default:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号付き 8 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数による符号付きの値として解釈されます。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。`0 <= offset <= buf.length - 2` を満たす必要があります。 **Default:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号付きビッグエンディアン 16 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数による符号付きの値として解釈されます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、オフセットの `uint32` への暗黙的な型強制を廃止しました。 |
| v0.5.5 | 追加: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 2` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号付きリトルエンディアン 16 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数付き符号付きの値として解釈されます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Prints: 1280
console.log(buf.readInt16LE(1));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Prints: 1280
console.log(buf.readInt16LE(1));
// Throws ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、オフセットの `uint32` への暗黙的な型強制を廃止しました。 |
| v0.5.5 | 追加: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 4` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号付きビッグエンディアン 32 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数付き符号付きの値として解釈されます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Prints: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Prints: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、offset の `uint32` への暗黙的な型強制処理もなくなりました。 |
| v0.5.5 | 追加: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。\`0 \<= offset \<= buf.length - 4\` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号付きの、リトルエンディアンの 32 ビット整数を読み取ります。

`Buffer` から読み取られた整数は、2 の補数符号付きの値として解釈されます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// ERR_OUT_OF_RANGE がスローされます。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// ERR_OUT_OF_RANGE がスローされます。
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、offset と `byteLength` の `uint32` への暗黙的な型強制処理もなくなりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。\`0 \<= offset \<= buf.length - byteLength\` を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) 読み込むバイト数。\`0 \< byteLength \<= 6\` を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から `byteLength` バイト数を読み取り、結果をビッグエンディアンの 2 の補数符号付きの値として解釈します。最大 48 ビットの精度をサポートします。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// ERR_OUT_OF_RANGE がスローされます。
console.log(buf.readIntBE(1, 0).toString(16));
// ERR_OUT_OF_RANGE がスローされます。
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// ERR_OUT_OF_RANGE がスローされます。
console.log(buf.readIntBE(1, 0).toString(16));
// ERR_OUT_OF_RANGE がスローされます。
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、offset と `byteLength` の `uint32` への暗黙的な型強制を廃止しました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - byteLength` を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取るバイト数。`0 \< byteLength \<= 6` を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf` の指定された `offset` から `byteLength` バイト数を読み取り、最大 48 ビットの精度をサポートするリトルエンディアンの 2 の補数付き符号付き値として結果を解釈します。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUint8()` としても利用できます。 |
| v10.0.0 | `noAssert` を削除し、offset の `uint32` への暗黙的な型強制を廃止しました。 |
| v0.5.0 | 追加: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取りを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 1` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`buf` の指定された `offset` から符号なし 8 ビット整数を読み取ります。

この関数は、`readUint8` エイリアスでも利用できます。

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

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUint16BE()` としても利用可能です。 |
| v10.0.0 | `noAssert` と、オフセットの `uint32` への暗黙的な型変換が削除されました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 2` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` の `buf` から、符号なしビッグエンディアン 16 ビット整数を読み取ります。

この関数は `readUint16BE` エイリアスでも利用可能です。

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

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUint16LE()` としても利用可能です。 |
| v10.0.0 | `noAssert` と、オフセットの `uint32` への暗黙的な型変換が削除されました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 2` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` の `buf` から、符号なしリトルエンディアン 16 ビット整数を読み取ります。

この関数は `readUint16LE` エイリアスでも利用可能です。

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

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUint32BE()` としても利用可能です。 |
| v10.0.0 | `noAssert` が削除され、offset の `uint32` への暗黙的な型強制はなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 4` を満たす必要があります。 **Default:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号なしビッグエンディアン 32 ビット整数を読み取ります。

この関数は、`readUint32BE` エイリアスでも利用できます。

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

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUint32LE()` としても利用可能です。 |
| v10.0.0 | `noAssert` が削除され、offset の `uint32` への暗黙的な型強制はなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 4` を満たす必要があります。 **Default:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から符号なしリトルエンディアン 32 ビット整数を読み取ります。

この関数は、`readUint32LE` エイリアスでも利用できます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUintBE()` としても利用できます。 |
| v10.0.0 | `noAssert` が削除され、オフセットと `byteLength` の `uint32` への暗黙的な型強制はなくなりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - byteLength` を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込むバイト数。`0 \< byteLength \<= 6` を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から `byteLength` バイト数を読み取り、結果を最大 48 ビットの精度をサポートする符号なしビッグエンディアン整数として解釈します。

この関数は `readUintBE` エイリアスでも利用できます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.readUintLE()` としても利用できます。 |
| v10.0.0 | `noAssert` が削除され、オフセットと `byteLength` の `uint32` への暗黙的な型強制はなくなりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - byteLength` を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込むバイト数。`0 \< byteLength \<= 6` を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定された `offset` で `buf` から `byteLength` バイト数を読み取り、結果を最大 48 ビットの精度をサポートする符号なしリトルエンディアン整数として解釈します。

この関数は `readUintLE` エイリアスでも利用できます。

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

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい`Buffer`が開始される場所。 **デフォルト:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい`Buffer`が終了する場所（非包括的）。 **デフォルト:** [`buf.length`](/ja/nodejs/api/buffer#buflength)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

元のものと同じメモリを参照する新しい `Buffer` を返しますが、`start` および `end` インデックスによってオフセットおよびトリミングされています。

[`buf.length`](/ja/nodejs/api/buffer#buflength) より大きい `end` を指定すると、[`buf.length`](/ja/nodejs/api/buffer#buflength) と等しい `end` と同じ結果が返されます。

このメソッドは、[`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) から継承されます。

新しい `Buffer` スライスを変更すると、2 つのオブジェクトの割り当てられたメモリがオーバーラップするため、元の `Buffer` のメモリが変更されます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// ASCII アルファベットで `Buffer` を作成し、スライスを取り、元の `Buffer` から 1 バイトを変更します。

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 は 'a' の 10 進数の ASCII 値です。
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

// ASCII アルファベットで `Buffer` を作成し、スライスを取り、元の `Buffer` から 1 バイトを変更します。

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 は 'a' の 10 進数の ASCII 値です。
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

負のインデックスを指定すると、スライスは先頭ではなく `buf` の末尾を基準にして生成されます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (buf.subarray(0, 5) と同等です。)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (buf.subarray(0, 4) と同等です。)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (buf.subarray(1, 4) と同等です。)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (buf.subarray(0, 5) と同等です。)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (buf.subarray(0, 4) と同等です。)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (buf.subarray(1, 4) と同等です。)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.5.0, v16.15.0 | `buf.slice()` メソッドは非推奨になりました。 |
| v7.0.0 | オフセットはすべて、それらを使った計算を行う前に整数に強制変換されるようになりました。 |
| v7.1.0, v6.9.2 | オフセットを整数に強制変換する処理で、32 ビット整数の範囲外の値が正しく処理されるようになりました。 |
| v0.3.0 | Added in: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` が開始する位置。 **デフォルト:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` が終了する位置 (終端は含まれません)。 **デフォルト:** [`buf.length`](/ja/nodejs/api/buffer#buflength)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`buf.subarray`](/ja/nodejs/api/buffer#bufsubarraystart-end) を使用してください。
:::

元のメモリと同じメモリを参照する新しい `Buffer` を返しますが、`start` および `end` インデックスによってオフセットおよび切り取られています。

このメソッドは、`Buffer` のスーパークラスである `Uint8Array.prototype.slice()` と互換性がありません。 スライスをコピーするには、`Uint8Array.prototype.slice()` を使用してください。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Added in: v5.10.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) `buf`への参照。

`buf`を符号なし16ビット整数の配列として解釈し、バイト順を*インプレース*で入れ替えます。[`buf.length`](/ja/nodejs/api/buffer#buflength)が2の倍数でない場合、[`ERR_INVALID_BUFFER_SIZE`](/ja/nodejs/api/errors#err_invalid_buffer_size)をスローします。

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

`buf.swap16()`の便利な使い方の1つは、UTF-16リトルエンディアンとUTF-16ビッグエンディアンの間の高速なインプレース変換を実行することです。

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

**Added in: v5.10.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) `buf`への参照。

`buf`を符号なし32ビット整数の配列として解釈し、バイト順を*インプレース*で入れ替えます。[`buf.length`](/ja/nodejs/api/buffer#buflength)が4の倍数でない場合、[`ERR_INVALID_BUFFER_SIZE`](/ja/nodejs/api/errors#err_invalid_buffer_size)をスローします。

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

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) `buf` への参照。

`buf` を 64 ビット数の配列として解釈し、バイト順を*インプレース*で入れ替えます。[`buf.length`](/ja/nodejs/api/buffer#buflength) が 8 の倍数でない場合、[`ERR_INVALID_BUFFER_SIZE`](/ja/nodejs/api/errors#err_invalid_buffer_size) を投げます。

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

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`buf` の JSON 表現を返します。[`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) は、`Buffer` インスタンスを文字列化するときに、この関数を暗黙的に呼び出します。

`Buffer.from()` は、このメソッドから返される形式のオブジェクトを受け入れます。特に、`Buffer.from(buf.toJSON())` は `Buffer.from(buf)` のように動作します。

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

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用する文字エンコーディング。**デフォルト:** `'utf8'`。
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) デコードを開始するバイトオフセット。**デフォルト:** `0`。
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) デコードを停止するバイトオフセット（含みません）。**デフォルト:** [`buf.length`](/ja/nodejs/api/buffer#buflength)。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`buf` を `encoding` で指定された文字エンコーディングに従って文字列にデコードします。`start` と `end` を渡して、`buf` のサブセットのみをデコードできます。

`encoding` が `'utf8'` で、入力のバイトシーケンスが有効な UTF-8 でない場合、無効な各バイトは置換文字 `U+FFFD` に置き換えられます。

文字列インスタンスの最大長（UTF-16 コードユニット）は、[`buffer.constants.MAX_STRING_LENGTH`](/ja/nodejs/api/buffer#bufferconstantsmax_string_length) として利用可能です。

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

**追加:** v1.1.0

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

`buf` の値 (バイト) の [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) を作成して返します。この関数は、`Buffer` が `for..of` ステートメントで使用されるときに自動的に呼び出されます。

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

**追加:** v0.1.90

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buf` に書き込む文字列。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `string` の書き込みを開始する前にスキップするバイト数。**デフォルト:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込む最大バイト数 (書き込まれたバイト数は `buf.length - offset` を超えません)。**デフォルト:** `buf.length - offset`。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` の文字エンコーディング。**デフォルト:** `'utf8'`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数。

`encoding` の文字エンコーディングに従って、`string` を `offset` の `buf` に書き込みます。`length` パラメータは書き込むバイト数です。`buf` に文字列全体を収めるのに十分なスペースがない場合、`string` の一部のみが書き込まれます。ただし、部分的にエンコードされた文字は書き込まれません。

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

**Added in: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 8` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をビッグエンディアンとして、指定された `offset` で `buf` に書き込みます。

`value` は、2 の補数付き符号付き整数として解釈され、書き込まれます。

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

**Added in: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 8` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をリトルエンディアンとして、指定された `offset` で `buf` に書き込みます。

`value` は、2 の補数付き符号付き整数として解釈され、書き込まれます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.10.0, v12.19.0 | この関数は `buf.writeBigUint64BE()` としても利用できます。 |
| v12.0.0, v10.20.0 | 追加: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えた値。

`value` をビッグエンディアンとして指定された `offset` の `buf` に書き込みます。

この関数は `writeBigUint64BE` エイリアスでも利用可能です。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.10.0, v12.19.0 | この関数は `buf.writeBigUint64LE()` としても利用できます。 |
| v12.0.0, v10.20.0 | 追加: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えた値。

`value` をリトルエンディアンとして指定された `offset` の `buf` に書き込みます。

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

この関数は `writeBigUint64LE` エイリアスでも利用可能です。


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、オフセットの `uint32` への暗黙的な型強制を廃止しました。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をビッグエンディアンとして、指定された `offset` の位置にある `buf` に書き込みます。 `value` は JavaScript の数値でなければなりません。 `value` が JavaScript の数値以外の場合の動作は未定義です。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` を削除し、オフセットの `uint32` への暗黙的な型強制を廃止しました。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 8` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をリトルエンディアンとして、指定された `offset` の位置にある `buf` に書き込みます。 `value` は JavaScript の数値でなければなりません。 `value` が JavaScript の数値以外の場合の動作は未定義です。

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
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制がなくなりました。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 4` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をビッグエンディアンとして、指定された `offset` の `buf` に書き込みます。 `value` が JavaScript の数値以外の場合、動作は未定義です。

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
| Version | Changes |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制がなくなりました。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 4` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をリトルエンディアンとして、指定された `offset` の `buf` に書き込みます。 `value` が JavaScript の数値以外の場合、動作は未定義です。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.0 | 追加: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 1` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えた値。

指定された `offset` で `buf` に `value` を書き込みます。`value` は有効な符号付き 8 ビット整数である必要があります。`value` が符号付き 8 ビット整数以外の場合、動作は未定義です。

`value` は、2 の補数符号付き整数として解釈され、書き込まれます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.5 | 追加: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。`0 \<= offset \<= buf.length - 2` を満たす必要があります。**デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えた値。

指定された `offset` で `buf` に `value` をビッグエンディアンとして書き込みます。`value` は有効な符号付き 16 ビット整数である必要があります。`value` が符号付き 16 ビット整数以外の場合、動作は未定義です。

`value` は、2 の補数符号付き整数として解釈され、書き込まれます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.5 | v0.5.5 で追加されました |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 2` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えた値。

`value` をリトルエンディアンとして指定された `offset` の位置にある `buf` に書き込みます。 `value` は有効な符号付き 16 ビット整数でなければなりません。 `value` が符号付き 16 ビット整数以外の場合、動作は未定義です。

`value` は 2 の補数符号付き整数として解釈され、書き込まれます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.5 | v0.5.5 で追加されました |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 4` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えた値。

`value` をビッグエンディアンとして指定された `offset` の位置にある `buf` に書き込みます。 `value` は有効な符号付き 32 ビット整数でなければなりません。 `value` が符号付き 32 ビット整数以外の場合、動作は未定義です。

`value` は 2 の補数符号付き整数として解釈され、書き込まれます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な強制変換もなくなりました。 |
| v0.5.5 | v0.5.5 で追加 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 4` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をリトルエンディアンで、指定された `offset` の位置に `buf` に書き込みます。 `value` は有効な符号付き 32 ビット整数である必要があります。 `value` が符号付き 32 ビット整数以外の値である場合、動作は未定義です。

`value` は2の補数符号付き整数として解釈され、書き込まれます。

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

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、オフセットと `byteLength` の `uint32` への暗黙的な強制変換もなくなりました。 |
| v0.11.15 | v0.11.15 で追加 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - byteLength` を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込むバイト数。 `0 \< byteLength \<= 6` を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` の `byteLength` バイトをビッグエンディアンで、指定された `offset` の位置に `buf` に書き込みます。 最大48ビットの精度をサポートします。 `value` が符号付き整数以外の値である場合、動作は未定義です。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | `noAssert` が削除され、`offset` と `byteLength` の `uint32` への暗黙的な型強制がなくなりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込まれる数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - byteLength` を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込むバイト数。 `0 \< byteLength \<= 6` を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` の `byteLength` バイトを、リトルエンディアンとして指定された `offset` の `buf` に書き込みます。 最大 48 ビットの精度をサポートします。 `value` が符号付き整数以外の場合、動作は未定義です。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.writeUint8()` としても利用できます。 |
| v10.0.0 | `noAssert` が削除され、`offset` の `uint32` への暗黙的な型強制がなくなりました。 |
| v0.5.0 | 追加: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込まれる数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - 1` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` を指定された `offset` の `buf` に書き込みます。 `value` は有効な符号なし 8 ビット整数である必要があります。 `value` が符号なし 8 ビット整数以外の場合、動作は未定義です。

この関数は、`writeUint8` エイリアスでも利用できます。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.writeUint16BE()` としても利用可能です。 |
| v10.0.0 | `noAssert` が削除され、offset の `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 2` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をビッグエンディアンとして、指定された `offset` の位置に `buf` へ書き込みます。 `value` は有効な符号なし 16 ビット整数でなければなりません。 `value` が符号なし 16 ビット整数以外の場合、動作は未定義です。

この関数は `writeUint16BE` という別名でも利用可能です。

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
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.writeUint16LE()` としても利用可能です。 |
| v10.0.0 | `noAssert` が削除され、offset の `uint32` への暗黙的な型強制もなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込む数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 2` を満たす必要があります。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をリトルエンディアンとして、指定された `offset` の位置に `buf` へ書き込みます。 `value` は有効な符号なし 16 ビット整数でなければなりません。 `value` が符号なし 16 ビット整数以外の場合、動作は未定義です。

この関数は `writeUint16LE` という別名でも利用可能です。

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
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.writeUint32BE()` としても利用可能です。 |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制はなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込まれる数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 4` を満たす必要があります。 **Default:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をビッグエンディアンとして指定された `offset` で `buf` に書き込みます。 `value` は有効な符号なし 32 ビット整数でなければなりません。 `value` が符号なし 32 ビット整数以外の場合、動作は未定義です。

この関数は `writeUint32BE` エイリアスでも利用できます。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は `buf.writeUint32LE()` としても利用可能です。 |
| v10.0.0 | `noAssert` が削除され、オフセットの `uint32` への暗黙的な型強制はなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf` に書き込まれる数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 <= offset <= buf.length - 4` を満たす必要があります。 **Default:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` に書き込まれたバイト数を加えたもの。

`value` をリトルエンディアンとして指定された `offset` で `buf` に書き込みます。 `value` は有効な符号なし 32 ビット整数でなければなりません。 `value` が符号なし 32 ビット整数以外の場合、動作は未定義です。

この関数は `writeUint32LE` エイリアスでも利用できます。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は`buf.writeUintBE()`としても利用できます。 |
| v10.0.0 | `noAssert`の削除と、offsetと`byteLength`の`uint32`への暗黙的な型強制はなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`に書き込まれる数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - byteLength`を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込むバイト数。 `0 \< byteLength \<= 6`を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`に書き込まれたバイト数を加えたもの。

`byteLength` バイトの `value` を、指定された `offset` の `buf` にビッグエンディアンとして書き込みます。 最大48ビットの精度をサポートします。 `value` が符号なし整数以外の場合の動作は未定義です。

この関数は、`writeUintBE`エイリアスでも利用できます。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v14.9.0, v12.19.0 | この関数は`buf.writeUintLE()`としても利用できます。 |
| v10.0.0 | `noAssert`の削除と、offsetと`byteLength`の`uint32`への暗黙的な型強制はなくなりました。 |
| v0.5.5 | Added in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `buf`に書き込まれる数値。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する前にスキップするバイト数。 `0 \<= offset \<= buf.length - byteLength`を満たす必要があります。
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込むバイト数。 `0 \< byteLength \<= 6`を満たす必要があります。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset`に書き込まれたバイト数を加えたもの。

`byteLength` バイトの `value` を、指定された `offset` の `buf` にリトルエンディアンとして書き込みます。 最大48ビットの精度をサポートします。 `value` が符号なし整数以外の場合の動作は未定義です。

この関数は、`writeUintLE`エイリアスでも利用できます。

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

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | このコンストラクタの呼び出しは、`node_modules` ディレクトリ外のコードから実行された場合に、非推奨の警告を発行します。 |
| v7.2.1 | このコンストラクタの呼び出しは、非推奨の警告を発行しなくなりました。 |
| v7.0.0 | このコンストラクタの呼び出しは、現在、非推奨の警告を発行します。 |
| v6.0.0 | Deprecated since: v6.0.0 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated: 代わりに [`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray) を使用してください。
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー元のバイト配列。

[`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray) を参照してください。

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | このコンストラクタの呼び出しは、`node_modules` ディレクトリ外のコードから実行された場合に、非推奨の警告を発行します。 |
| v7.2.1 | このコンストラクタの呼び出しは、非推奨の警告を発行しなくなりました。 |
| v7.0.0 | このコンストラクタの呼び出しは、現在、非推奨の警告を発行します。 |
| v6.0.0 | `byteOffset` および `length` パラメータがサポートされるようになりました。 |
| v6.0.0 | Deprecated since: v6.0.0 |
| v3.0.0 | Added in: v3.0.0 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated: 代わりに [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ja/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) を使用してください。
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), または [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) の `.buffer` プロパティ。
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公開する最初のバイトのインデックス。**デフォルト:** `0`。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公開するバイト数。**デフォルト:** `arrayBuffer.byteLength - byteOffset`。

[`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ja/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) を参照してください。


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | このコンストラクターを `node_modules` ディレクトリー外のコードから実行すると、非推奨の警告が発生します。 |
| v7.2.1 | このコンストラクターを呼び出しても、非推奨の警告は発生しなくなりました。 |
| v7.0.0 | このコンストラクターを呼び出すと、非推奨の警告が発生するようになりました。 |
| v6.0.0 | 非推奨: v6.0.0 以降 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`Buffer.from(buffer)`](/ja/nodejs/api/buffer#static-method-bufferfrombuffer) を使用してください。
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) データをコピーする既存の `Buffer` または [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。

[`Buffer.from(buffer)`](/ja/nodejs/api/buffer#static-method-bufferfrombuffer) を参照してください。

### `new Buffer(size)` {#new-buffersize}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | このコンストラクターを `node_modules` ディレクトリー外のコードから実行すると、非推奨の警告が発生します。 |
| v8.0.0 | `new Buffer(size)` はデフォルトでゼロ埋めされたメモリを返します。 |
| v7.2.1 | このコンストラクターを呼び出しても、非推奨の警告は発生しなくなりました。 |
| v7.0.0 | このコンストラクターを呼び出すと、非推奨の警告が発生するようになりました。 |
| v6.0.0 | 非推奨: v6.0.0 以降 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`Buffer.alloc()`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) を使用してください ([`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) も参照してください)。
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `Buffer` の希望する長さ。

[`Buffer.alloc()`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) および [`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) を参照してください。 このコンストラクターのバリアントは、[`Buffer.alloc()`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) と同等です。


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | このコンストラクターを `node_modules` ディレクトリー外のコードから実行すると、非推奨の警告が出力されるようになりました。 |
| v7.2.1 | このコンストラクターを呼び出しても、非推奨の警告は出力されなくなりました。 |
| v7.0.0 | このコンストラクターを呼び出すと、非推奨の警告が出力されるようになりました。 |
| v6.0.0 | 非推奨: v6.0.0 以降 |
:::

::: danger [安定度: 0 - 非推奨]
[安定度: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`Buffer.from(string[, encoding])`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding) を使用してください。
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エンコードする文字列。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `string` のエンコーディング。 **デフォルト:** `'utf8'`。

[`Buffer.from(string[, encoding])`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding) を参照してください。

## Class: `File` {#class-file}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | File インスタンスが複製可能になりました。 |
| v20.0.0 | 実験的ではなくなりました。 |
| v19.2.0, v18.13.0 | 追加: v19.2.0, v18.13.0 |
:::

- 拡張: [\<Blob\>](/ja/nodejs/api/buffer#class-blob)

[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) はファイルに関する情報を提供します。

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**追加: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ja/nodejs/api/buffer#class-blob) | [\<File[]\>](/ja/nodejs/api/buffer#class-file) 文字列、[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/ja/nodejs/api/buffer#class-file), または [\<Blob\>](/ja/nodejs/api/buffer#class-blob) オブジェクト、またはそのようなオブジェクトの任意の組み合わせの配列。これらは `File` 内に格納されます。
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ファイルの名前。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'transparent'` または `'native'` のいずれか。 `'native'` に設定すると、文字列ソース部分の改行は、`require('node:os').EOL` で指定されたプラットフォームネイティブの改行に変換されます。
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ファイルの content-type。
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの最終更新日。 **デフォルト:** `Date.now()`。


### `file.name` {#filename}

**追加: v19.2.0, v18.13.0**

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`File`の名前。

### `file.lastModified` {#filelastmodified}

**追加: v19.2.0, v18.13.0**

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`File`の最終更新日。

## `node:buffer` モジュール API {#nodebuffer-module-apis}

`Buffer`オブジェクトはグローバルとして利用可能ですが、`require('node:buffer')`を使用してアクセスする`node:buffer`モジュールからのみ利用可能な追加の`Buffer`関連APIがあります。

### `buffer.atob(data)` {#bufferatobdata}

**追加: v15.13.0, v14.17.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー。代わりに `Buffer.from(data, 'base64')` を使用してください。
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Base64エンコードされた入力文字列。

Base64エンコードされたデータの文字列をバイトにデコードし、それらのバイトをLatin-1（ISO-8859-1）を使用して文字列にエンコードします。

`data`は文字列に強制変換できる任意のJavaScript値にすることができます。

**この関数は、レガシーWebプラットフォームAPIとの互換性のためだけに提供されており、新しいコードでは絶対に使用しないでください。これは、バイナリデータを表現するために文字列を使用し、JavaScriptの型付き配列の導入よりも前に存在していたためです。Node.js APIを使用して実行するコードの場合、base64エンコードされた文字列とバイナリデータ間の変換は、<code>Buffer.from(str, 'base64')</code>および<code>buf.toString('base64')</code>を使用して実行する必要があります。**

### `buffer.btoa(data)` {#bufferbtoadata}

**追加: v15.13.0, v14.17.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー。代わりに `buf.toString('base64')` を使用してください。
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ASCII（Latin1）文字列。

Latin-1（ISO-8859）を使用して文字列をバイトにデコードし、それらのバイトをBase64を使用して文字列にエンコードします。

`data`は文字列に強制変換できる任意のJavaScript値にすることができます。

**この関数は、レガシーWebプラットフォームAPIとの互換性のためだけに提供されており、新しいコードでは絶対に使用しないでください。これは、バイナリデータを表現するために文字列を使用し、JavaScriptの型付き配列の導入よりも前に存在していたためです。Node.js APIを使用して実行するコードの場合、base64エンコードされた文字列とバイナリデータ間の変換は、<code>Buffer.from(str, 'base64')</code>および<code>buf.toString('base64')</code>を使用して実行する必要があります。**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**追加: v19.6.0, v18.15.0**

- input [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 検証する入力。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`input`が空の場合を含め、有効なASCIIエンコードされたデータのみを含む場合、この関数は`true`を返します。

`input`が分離された配列バッファーの場合、例外を投げます。

### `buffer.isUtf8(input)` {#bufferisutf8input}

**追加: v19.4.0, v18.14.0**

- input [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 検証する入力。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`input`が空の場合を含め、有効なUTF-8エンコードされたデータのみを含む場合、この関数は`true`を返します。

`input`が分離された配列バッファーの場合、例外を投げます。

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**追加: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `50`

`buf.inspect()`が呼び出されたときに返される最大バイト数を返します。 これは、ユーザーモジュールによって上書きできます。 `buf.inspect()`の動作の詳細については、[`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options)を参照してください。

### `buffer.kMaxLength` {#bufferkmaxlength}

**追加: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 単一の`Buffer`インスタンスに対して許可される最大のサイズ。

[`buffer.constants.MAX_LENGTH`](/ja/nodejs/api/buffer#bufferconstantsmax_length)のエイリアス。

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**追加: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 単一の`string`インスタンスに対して許可される最大の長さ。

[`buffer.constants.MAX_STRING_LENGTH`](/ja/nodejs/api/buffer#bufferconstantsmax_string_length)のエイリアス。


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Added in: v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `URL.createObjectURL()` の以前の呼び出しによって返された `'blob:nodedata:...` URL 文字列。
- 戻り値: [\<Blob\>](/ja/nodejs/api/buffer#class-blob)

`URL.createObjectURL()` の以前の呼び出しを使用して登録された、関連する[\<Blob\>](/ja/nodejs/api/buffer#class-blob)オブジェクトである`'blob:nodedata:...'`を解決します。

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | `source` パラメーターは `Uint8Array` になりました。 |
| v7.1.0 | Added in: v7.1.0 |
:::

- `source` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` または `Uint8Array` インスタンス。
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のエンコーディング。
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ターゲットのエンコーディング。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

指定された `Buffer` または `Uint8Array` インスタンスを、ある文字エンコーディングから別の文字エンコーディングに再エンコードします。 新しい `Buffer` インスタンスを返します。

`fromEnc` または `toEnc` が無効な文字エンコーディングを指定した場合、または `fromEnc` から `toEnc` への変換が許可されていない場合は、例外をスローします。

`buffer.transcode()` でサポートされているエンコーディングは、`'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'`, および `'binary'` です。

トランスコーディングプロセスでは、特定のバイトシーケンスをターゲットエンコーディングで適切に表現できない場合に、置換文字が使用されます。 例えば：

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

ユーロ（`€`）記号は US-ASCII で表現できないため、トランスコードされた `Buffer` では `?` に置き換えられます。


### クラス: `SlowBuffer` {#class-slowbuffer}

**非推奨: v6.0.0 以降**

::: danger [安定度: 0 - 非推奨]
[安定度: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) を使用してください。
:::

[`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) を参照してください。 これはコンストラクタが `SlowBuffer` インスタンスではなく、常に `Buffer` インスタンスを返すという意味で、決してクラスではありませんでした。

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**非推奨: v6.0.0 以降**

::: danger [安定度: 0 - 非推奨]
[安定度: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) を使用してください。
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 新しい `SlowBuffer` の目的の長さ。

[`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) を参照してください。

### Buffer 定数 {#buffer-constants}

**追加: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v22.0.0 | 64 ビットアーキテクチャでは値が 2<sup>31</sup> - 1 に変更されました。 |
| v15.0.0 | 64 ビットアーキテクチャでは値が 2<sup>31</sup> に変更されました。 |
| v14.0.0 | 64 ビットアーキテクチャでは値が 2<sup>30</sup> - 1 から 2<sup>31</sup> - 1 に変更されました。 |
| v8.2.0 | 追加: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 単一の `Buffer` インスタンスに対して許可される最大サイズ。

32 ビットアーキテクチャでは、この値は現在 2<sup>31</sup> - 1 (約 1 GiB) です。

64 ビットアーキテクチャでは、この値は現在 2<sup>50</sup> - 1 (約 8 PiB) です。

これは内部で [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) を反映しています。

この値は [`buffer.kMaxLength`](/ja/nodejs/api/buffer#bufferkmaxlength) としても利用可能です。

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**追加: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 単一の `string` インスタンスに対して許可される最大の長さ。

`string` プリミティブが持つことができる最大の `length` を表し、UTF-16 コードユニットで数えられます。

この値は使用されている JS エンジンに依存する場合があります。


## `Buffer.from()`、`Buffer.alloc()`、および `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

Node.jsの6.0.0より前のバージョンでは、`Buffer`インスタンスは`Buffer`コンストラクタ関数を使用して作成されていました。この関数は、提供される引数に基づいて返される`Buffer`を異なる方法で割り当てます。

- `Buffer()`に最初の引数として数値を渡す（例：`new Buffer(10)`）と、指定されたサイズの新しい`Buffer`オブジェクトが割り当てられます。Node.js 8.0.0より前では、このような`Buffer`インスタンスに割り当てられたメモリは*初期化されておらず*、*機密データが含まれている可能性があります*。このような`Buffer`インスタンスは、[`buf.fill(0)`](/ja/nodejs/api/buffer#buffillvalue-offset-end-encoding)を使用するか、`Buffer`からデータを読み取る前に`Buffer`全体に書き込むことによって、後で初期化*する必要があります*。この動作は、パフォーマンスを向上させるための*意図的なもの*ですが、開発経験から、高速だが初期化されていない`Buffer`の作成と、低速だが安全な`Buffer`の作成との間には、より明確な区別が必要であることが示されています。Node.js 8.0.0以降、`Buffer(num)`と`new Buffer(num)`は、初期化されたメモリを持つ`Buffer`を返します。
- 文字列、配列、または`Buffer`を最初の引数として渡すと、渡されたオブジェクトのデータが`Buffer`にコピーされます。
- [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)または[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)を渡すと、与えられた配列バッファと割り当てられたメモリを共有する`Buffer`が返されます。

`new Buffer()`の動作は最初の引数の型によって異なるため、引数の検証または`Buffer`の初期化が実行されない場合、セキュリティと信頼性の問題がアプリケーションに不注意に導入される可能性があります。

たとえば、攻撃者がアプリケーションに文字列が予期される場所に数値を受け取らせることができた場合、アプリケーションは`new Buffer("100")`の代わりに`new Buffer(100)`を呼び出し、コンテンツ`"100"`を持つ3バイトのバッファを割り当てる代わりに、100バイトのバッファを割り当てる可能性があります。これは通常、JSON API呼び出しを使用して可能です。JSONは数値型と文字列型を区別するため、入力を十分に検証しない単純なアプリケーションが常に文字列を受け取ることを期待している可能性がある場所に数値を注入できます。Node.js 8.0.0より前では、100バイトのバッファには任意の既存のインメモリデータが含まれている可能性があるため、インメモリシークレットをリモート攻撃者に公開するために使用される可能性があります。Node.js 8.0.0以降、データはゼロで埋められるため、メモリの公開は発生しません。ただし、サーバーによって非常に大きなバッファが割り当てられ、パフォーマンスの低下やメモリ枯渇によるクラッシュが発生するなど、他の攻撃も可能です。

`Buffer`インスタンスの作成をより信頼性が高く、エラーが発生しにくくするために、`new Buffer()`コンストラクタのさまざまな形式は**非推奨**となり、個別の`Buffer.from()`、[`Buffer.alloc()`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)、および[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)メソッドに置き換えられました。

*開発者は、<code>new Buffer()</code>コンストラクタの既存のすべての使用箇所を、
これらの新しいAPIのいずれかに移行する必要があります。*

- [`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray)は、提供されたオクテットの*コピーを含む*新しい`Buffer`を返します。
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ja/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)は、与えられた[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) *と同じ割り当てられたメモリを共有する*新しい`Buffer`を返します。
- [`Buffer.from(buffer)`](/ja/nodejs/api/buffer#static-method-bufferfrombuffer)は、与えられた`Buffer`の内容の*コピーを含む*新しい`Buffer`を返します。
- [`Buffer.from(string[, encoding])`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding)は、提供された文字列の*コピーを含む*新しい`Buffer`を返します。
- [`Buffer.alloc(size[, fill[, encoding]])`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)は、指定されたサイズの新しい初期化された`Buffer`を返します。このメソッドは[`Buffer.allocUnsafe(size)`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)よりも遅いですが、新しく作成された`Buffer`インスタンスに、潜在的に機密性の高い古いデータが含まれないことを保証します。`size`が数値でない場合は、`TypeError`がスローされます。
- [`Buffer.allocUnsafe(size)`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)と[`Buffer.allocUnsafeSlow(size)`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)はそれぞれ、指定された`size`の新しい初期化されていない`Buffer`を返します。`Buffer`は初期化されていないため、割り当てられたメモリセグメントには、潜在的に機密性の高い古いデータが含まれている可能性があります。

[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)、[`Buffer.from(string)`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding)、[`Buffer.concat()`](/ja/nodejs/api/buffer#static-method-bufferconcatlist-totallength)、および[`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray)によって返される`Buffer`インスタンスは、`size`が[`Buffer.poolSize`](/ja/nodejs/api/buffer#class-property-bufferpoolsize)の半分以下の場合、共有の内部メモリプールから割り当てられる*可能性があります*。[`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)によって返されるインスタンスは、共有の内部メモリプールを*決して*使用しません。


### `--zero-fill-buffers` コマンドラインオプション {#the---zero-fill-buffers-command-line-option}

**追加: v5.10.0**

Node.js は、`--zero-fill-buffers` コマンドラインオプションを使用して起動し、新しく割り当てられたすべての `Buffer` インスタンスがデフォルトで作成時にゼロで埋められるようにすることができます。このオプションがない場合、[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)、[`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)、および `new SlowBuffer(size)` で作成されたバッファはゼロで埋められません。このフラグを使用すると、パフォーマンスに測定可能な悪影響を与える可能性があります。新しく割り当てられた `Buffer` インスタンスに、潜在的に機密性の高い古いデータが含まれないようにする必要がある場合にのみ、`--zero-fill-buffers` オプションを使用してください。

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### `Buffer.allocUnsafe()` および `Buffer.allocUnsafeSlow()` が "unsafe" である理由 {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) および [`Buffer.allocUnsafeSlow()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) を呼び出すと、割り当てられたメモリのセグメントは *初期化されていません* (ゼロで埋められていません)。この設計により、メモリの割り当てが非常に高速になりますが、割り当てられたメモリのセグメントには、潜在的に機密性の高い古いデータが含まれている可能性があります。メモリを *完全に* 上書きせずに [`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) で作成された `Buffer` を使用すると、`Buffer` メモリが読み取られたときに、この古いデータがリークする可能性があります。

[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) を使用することには明確なパフォーマンス上の利点がありますが、アプリケーションにセキュリティの脆弱性が導入されないようにするために、特別な注意を *払う必要* があります。

