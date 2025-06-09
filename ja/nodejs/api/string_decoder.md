---
title: Node.js ドキュメント - 文字列デコーダ
description: 文字列デコーダモジュールは、Bufferオブジェクトを文字列にデコードするためのAPIを提供し、文字列の内部文字エンコーディングに最適化されています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - 文字列デコーダ | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 文字列デコーダモジュールは、Bufferオブジェクトを文字列にデコードするためのAPIを提供し、文字列の内部文字エンコーディングに最適化されています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - 文字列デコーダ | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 文字列デコーダモジュールは、Bufferオブジェクトを文字列にデコードするためのAPIを提供し、文字列の内部文字エンコーディングに最適化されています。
---


# String decoder {#string-decoder}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

`node:string_decoder` モジュールは、エンコードされたマルチバイトの UTF-8 および UTF-16 文字を保持する方法で、`Buffer` オブジェクトを文字列にデコードするための API を提供します。これは以下を使用してアクセスできます:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

次の例は、`StringDecoder` クラスの基本的な使用法を示しています。

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

`Buffer` インスタンスが `StringDecoder` インスタンスに書き込まれると、デコードされた文字列に不完全なマルチバイト文字が含まれないようにするために、内部バッファーが使用されます。これらは、`stringDecoder.write()` の次の呼び出しまで、または `stringDecoder.end()` が呼び出されるまで、バッファーに保持されます。

次の例では、ヨーロッパのユーロ記号 (`€`) の 3 つの UTF-8 エンコードされたバイトが、3 つの別々の操作で書き込まれています。

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


## クラス: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Added in: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `StringDecoder` が使用する文字 [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。 **デフォルト:** `'utf8'`。

新しい `StringDecoder` インスタンスを生成します。

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Added in: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) デコードするバイト列。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

内部バッファに格納されている残りの入力を文字列として返します。 不完全な UTF-8 および UTF-16 文字を表すバイト列は、文字エンコーディングに適した代替文字に置き換えられます。

`buffer` 引数が指定されている場合、残りの入力が返される前に、`stringDecoder.write()` への最後の呼び出しが 1 回実行されます。 `end()` が呼び出されると、`stringDecoder` オブジェクトを新しい入力に再利用できます。

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | 各無効な文字は、個々のバイトごとに 1 つではなく、単一の代替文字で置き換えられるようになりました。 |
| v0.1.99 | Added in: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) デコードするバイト列。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

デコードされた文字列を返します。`Buffer`、`TypedArray`、または `DataView` の末尾にある不完全なマルチバイト文字は、返された文字列から省略され、`stringDecoder.write()` または `stringDecoder.end()` の次回の呼び出しのために内部バッファに格納されます。

