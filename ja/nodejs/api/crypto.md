---
title: Node.js ドキュメント - Crypto
description: Node.jsのCryptoモジュールは、OpenSSLのハッシュ、HMAC、暗号化、復号化、署名、検証機能のラッパーを含む暗号化機能を提供します。さまざまな暗号化アルゴリズム、鍵導出、デジタル署名をサポートし、開発者がNode.jsアプリケーション内でデータと通信を保護できるようにします。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのCryptoモジュールは、OpenSSLのハッシュ、HMAC、暗号化、復号化、署名、検証機能のラッパーを含む暗号化機能を提供します。さまざまな暗号化アルゴリズム、鍵導出、デジタル署名をサポートし、開発者がNode.jsアプリケーション内でデータと通信を保護できるようにします。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのCryptoモジュールは、OpenSSLのハッシュ、HMAC、暗号化、復号化、署名、検証機能のラッパーを含む暗号化機能を提供します。さまざまな暗号化アルゴリズム、鍵導出、デジタル署名をサポートし、開発者がNode.jsアプリケーション内でデータと通信を保護できるようにします。
---


# Crypto {#crypto}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

`node:crypto` モジュールは、OpenSSL のハッシュ、HMAC、暗号化、復号化、署名、および検証関数のラッパーセットを含む暗号化機能を提供します。

::: code-group
```js [ESM]
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```js [CJS]
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```
:::

## crypto サポートが利用できないかどうかを判断する {#determining-if-crypto-support-is-unavailable}

Node.js は、`node:crypto` モジュールのサポートを含めずに構築される可能性があります。そのような場合、`crypto` から `import` しようとしたり、`require('node:crypto')` を呼び出したりすると、エラーが発生します。

CommonJS を使用している場合、スローされるエラーは try/catch を使用してキャッチできます。

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
字句 ESM `import` キーワードを使用する場合、エラーは、モジュールのロードを試みる *前に* `process.on('uncaughtException')` のハンドラが登録されている場合にのみキャッチできます（たとえば、プリロードモジュールを使用）。

ESM を使用する場合、crypto サポートが有効になっていない Node.js のビルドでコードが実行される可能性がある場合は、字句 `import` キーワードの代わりに [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 関数を使用することを検討してください。

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## クラス: `Certificate` {#class-certificate}

**追加: v0.11.8**

SPKAC は、元々 Netscape によって実装された証明書署名要求メカニズムで、HTML5 の `<keygen>` 要素の一部として正式に仕様化されました。

`<keygen>` は [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) 以降、非推奨となっており、新しいプロジェクトではこの要素を使用すべきではありません。

`node:crypto` モジュールは、SPKAC データを扱うための `Certificate` クラスを提供します。最も一般的な使用法は、HTML5 の `<keygen>` 要素によって生成された出力を処理することです。Node.js は内部的に [OpenSSL の SPKAC 実装](https://www.openssl.org/docs/man3.0/man1/openssl-spkac)を使用します。

### 静的メソッド: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | spkac 引数は ArrayBuffer にすることができます。spkac 引数のサイズを最大 2**31 - 1 バイトに制限しました。 |
| v9.0.0 | 追加: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 文字列の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 公開鍵とチャレンジを含む `spkac` データ構造のチャレンジコンポーネント。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// 出力: チャレンジを UTF8 文字列として
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// 出力: チャレンジを UTF8 文字列として
```
:::


### 静的メソッド: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v15.0.0 | `spkac` 引数は ArrayBuffer にできます。`spkac` 引数のサイズは最大 2**31 - 1 バイトに制限されました。 |
| v9.0.0 | Added in: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 公開鍵とチャレンジを含む、`spkac` データ構造の公開鍵コンポーネント。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```
:::

### 静的メソッド: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v15.0.0 | `spkac` 引数は ArrayBuffer にできます。エンコーディングを追加しました。`spkac` 引数のサイズは最大 2**31 - 1 バイトに制限されました。 |
| v9.0.0 | Added in: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指定された `spkac` データ構造が有効な場合は `true`、それ以外の場合は `false`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```
:::


### レガシーAPI {#legacy-api}

::: danger [Stable: 0 - 非推奨]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

レガシーインターフェースとして、以下の例に示すように、`crypto.Certificate` クラスの新しいインスタンスを作成できます。

#### `new crypto.Certificate()` {#new-cryptocertificate}

`Certificate`クラスのインスタンスは、`new`キーワードを使用するか、関数として`crypto.Certificate()`を呼び出すことによって作成できます。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```js [CJS]
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```
:::

#### `certificate.exportChallenge(spkac[, encoding])` {#certificateexportchallengespkac-encoding}

**Added in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac`文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 公開鍵とチャレンジを含む`spkac`データ構造のチャレンジコンポーネント。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```
:::


#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**Added in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 公開鍵とチャレンジを含む `spkac` データ構造の公開鍵コンポーネント。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Added in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 指定された `spkac` データ構造が有効な場合は `true` 、そうでない場合は `false` 。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```
:::


## クラス: `Cipher` {#class-cipher}

**追加: v0.1.94**

- 拡張: [\<stream.Transform\>](/ja/nodejs/api/stream#class-streamtransform)

`Cipher` クラスのインスタンスは、データを暗号化するために使用されます。このクラスは、次の 2 つの方法で使用できます。

- 読み取り可能で書き込み可能な [ストリーム](/ja/nodejs/api/stream) として。この場合、暗号化されていないプレーンデータが書き込まれ、読み取り側で暗号化されたデータが生成されます。または、
- [`cipher.update()`](/ja/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) および [`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) メソッドを使用して、暗号化されたデータを生成します。

[`crypto.createCipheriv()`](/ja/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) メソッドは、`Cipher` インスタンスを作成するために使用されます。`Cipher` オブジェクトは、`new` キーワードを使用して直接作成することはできません。

例: `Cipher` オブジェクトをストリームとして使用する:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '鍵の生成に使用するパスワード';

// まず、鍵を生成します。鍵の長さはアルゴリズムによって異なります。
// この場合、aes192 では 24 バイト (192 ビット) です。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 次に、ランダムな初期化ベクトルを生成します
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // 鍵と iv が揃ったら、暗号を作成して使用できます...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('暗号化するテキストデータ');
    cipher.end();
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '鍵の生成に使用するパスワード';

// まず、鍵を生成します。鍵の長さはアルゴリズムによって異なります。
// この場合、aes192 では 24 バイト (192 ビット) です。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 次に、ランダムな初期化ベクトルを生成します
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // 鍵と iv が揃ったら、暗号を作成して使用できます...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('暗号化するテキストデータ');
    cipher.end();
  });
});
```
:::

例: `Cipher` とパイプされたストリームを使用する:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '鍵の生成に使用するパスワード';

// まず、鍵を生成します。鍵の長さはアルゴリズムによって異なります。
// この場合、aes192 では 24 バイト (192 ビット) です。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 次に、ランダムな初期化ベクトルを生成します
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '鍵の生成に使用するパスワード';

// まず、鍵を生成します。鍵の長さはアルゴリズムによって異なります。
// この場合、aes192 では 24 バイト (192 ビット) です。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 次に、ランダムな初期化ベクトルを生成します
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```
:::

例: [`cipher.update()`](/ja/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) および [`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) メソッドを使用する:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '鍵の生成に使用するパスワード';

// まず、鍵を生成します。鍵の長さはアルゴリズムによって異なります。
// この場合、aes192 では 24 バイト (192 ビット) です。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 次に、ランダムな初期化ベクトルを生成します
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('暗号化するテキストデータ', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = '鍵の生成に使用するパスワード';

// まず、鍵を生成します。鍵の長さはアルゴリズムによって異なります。
// この場合、aes192 では 24 バイト (192 ビット) です。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 次に、ランダムな初期化ベクトルを生成します
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('暗号化するテキストデータ', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**Added in: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 残りの暗号化されたコンテンツ。 `outputEncoding` が指定された場合は、文字列が返されます。 `outputEncoding` が指定されていない場合は、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

`cipher.final()` メソッドが呼び出されると、`Cipher` オブジェクトはデータを暗号化するために使用できなくなります。 `cipher.final()` を複数回呼び出そうとすると、エラーが発生します。

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Added in: v1.0.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 認証付き暗号化モード（現在、`GCM`、`CCM`、`OCB`、および `chacha20-poly1305` がサポートされています）を使用している場合、`cipher.getAuthTag()` メソッドは、与えられたデータから計算された*認証タグ*を含む [`Buffer`](/ja/nodejs/api/buffer) を返します。

`cipher.getAuthTag()` メソッドは、[`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) メソッドを使用して暗号化が完了した後にのみ呼び出す必要があります。

`cipher` インスタンスの作成時に `authTagLength` オプションが設定された場合、この関数は正確に `authTagLength` バイトを返します。

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Added in: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` オプション](/ja/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer` が文字列の場合に使用する文字列エンコーディング。

- 戻り値: [\<Cipher\>](/ja/nodejs/api/crypto#class-cipher) メソッドチェーンのための同じ `Cipher` インスタンス。

認証付き暗号化モード（現在、`GCM`、`CCM`、`OCB`、および `chacha20-poly1305` がサポートされています）を使用している場合、`cipher.setAAD()` メソッドは、*追加認証データ* (AAD) 入力パラメータに使用される値を設定します。

`plaintextLength` オプションは `GCM` および `OCB` ではオプションです。 `CCM` を使用する場合、`plaintextLength` オプションを指定する必要があり、その値は平文の長さにバイト単位で一致する必要があります。[CCMモード](/ja/nodejs/api/crypto#ccm-mode) を参照してください。

`cipher.setAAD()` メソッドは、[`cipher.update()`](/ja/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) の前に呼び出す必要があります。


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Added in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
- 戻り値: [\<Cipher\>](/ja/nodejs/api/crypto#class-cipher) メソッドチェーンのために同じ `Cipher` インスタンスを返します。

ブロック暗号アルゴリズムを使用する場合、`Cipher` クラスは、入力データを適切なブロックサイズに自動的にパディングします。デフォルトのパディングを無効にするには、`cipher.setAutoPadding(false)` を呼び出します。

`autoPadding` が `false` の場合、入力データ全体の長さは暗号のブロックサイズの倍数でなければなりません。そうでない場合、[`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) はエラーをスローします。自動パディングの無効化は、PKCS パディングの代わりに `0x0` を使用するなど、非標準のパディングに役立ちます。

`cipher.setAutoPadding()` メソッドは、[`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) の前に呼び出す必要があります。

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.0.0 | デフォルトの `inputEncoding` が `binary` から `utf8` に変更されました。 |
| v0.1.94 | Added in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) データの[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 戻り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`data` で暗号を更新します。`inputEncoding` 引数が指定されている場合、`data` 引数は指定されたエンコーディングを使用する文字列です。`inputEncoding` 引数が指定されていない場合、`data` は [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` である必要があります。`data` が [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` の場合、`inputEncoding` は無視されます。

`outputEncoding` は、暗号化されたデータの出力形式を指定します。`outputEncoding` が指定されている場合、指定されたエンコーディングを使用する文字列が返されます。`outputEncoding` が指定されていない場合、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

`cipher.update()` メソッドは、[`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) が呼び出されるまで、新しいデータで複数回呼び出すことができます。[`cipher.final()`](/ja/nodejs/api/crypto#cipherfinaloutputencoding) の後に `cipher.update()` を呼び出すと、エラーがスローされます。


## クラス: `Decipher` {#class-decipher}

**追加: v0.1.94**

- 拡張: [\<stream.Transform\>](/ja/nodejs/api/stream#class-streamtransform)

`Decipher`クラスのインスタンスは、データを復号化するために使用されます。このクラスは、次の2つの方法で使用できます。

- 可読ストリームと書込可能ストリームの両方である[ストリーム](/ja/nodejs/api/stream)として。プレーンな暗号化されたデータを書き込むと、可読側で暗号化されていないデータが生成されます。または、
- [`decipher.update()`](/ja/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding)および[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding)メソッドを使用して、暗号化されていないデータを生成します。

[`crypto.createDecipheriv()`](/ja/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options)メソッドは、`Decipher`インスタンスを作成するために使用されます。`Decipher`オブジェクトは、`new`キーワードを使用して直接作成しないでください。

例:`Decipher`オブジェクトをストリームとして使用する:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

例:`Decipher`とパイプされたストリームを使用する:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

例: [`decipher.update()`](/ja/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) および [`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) メソッドを使用する:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```
:::


### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**Added in: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 復号された残りのコンテンツ。 `outputEncoding` が指定された場合は、文字列が返されます。 `outputEncoding` が指定されていない場合は、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

`decipher.final()` メソッドが呼び出されると、`Decipher` オブジェクトはデータを復号化するために使用できなくなります。 `decipher.final()` を複数回呼び出そうとすると、エラーがスローされます。

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | buffer 引数は文字列または ArrayBuffer にでき、2 ** 31 - 1 バイト以下に制限されます。 |
| v7.2.0 | このメソッドは `decipher` への参照を返すようになりました。 |
| v1.0.0 | Added in: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` オプション](/ja/nodejs/api/stream#new-streamtransformoptions) 
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer` が文字列の場合に使用する文字列エンコーディング。
  
 
- 戻り値: [\<Decipher\>](/ja/nodejs/api/crypto#class-decipher) メソッドチェーン用の同じ Decipher。

認証された暗号化モード (`GCM`、`CCM`、`OCB`、および `chacha20-poly1305` は現在サポートされています) を使用する場合、`decipher.setAAD()` メソッドは、*追加認証データ* (AAD) 入力パラメーターに使用される値を設定します。

`options` 引数は `GCM` ではオプションです。 `CCM` を使用する場合、`plaintextLength` オプションを指定する必要があり、その値は暗号文の長さにバイト単位で一致する必要があります。[CCM モード](/ja/nodejs/api/crypto#ccm-mode) を参照してください。

`decipher.setAAD()` メソッドは、[`decipher.update()`](/ja/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) の前に呼び出す必要があります。

文字列を `buffer` として渡す場合は、[暗号 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0, v20.13.0 | `decipher` の作成時に `authTagLength` オプションを指定せずに 128 ビット以外の GCM タグ長を使用することは非推奨になりました。 |
| v15.0.0 | buffer 引数は文字列または ArrayBuffer にすることができ、最大 2 ** 31 - 1 バイトに制限されます。 |
| v11.0.0 | GCM タグ長が無効な場合、このメソッドは例外をスローするようになりました。 |
| v7.2.0 | このメソッドは `decipher` への参照を返すようになりました。 |
| v1.0.0 | 追加: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer` が文字列の場合に使用する文字列エンコーディング。
- 戻り値: [\<Decipher\>](/ja/nodejs/api/crypto#class-decipher) メソッドチェーンのための同じ Decipher。

認証付き暗号化モード（現在 `GCM`、`CCM`、`OCB`、および `chacha20-poly1305` がサポートされています）を使用する場合、`decipher.setAuthTag()` メソッドは受信した*認証タグ*を渡すために使用されます。 タグが提供されていない場合、または暗号テキストが改ざんされている場合、[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) は、認証に失敗したため暗号テキストを破棄する必要があることを示す例外をスローします。 タグ長が [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) に準拠していない場合、または `authTagLength` オプションの値と一致しない場合、`decipher.setAuthTag()` はエラーをスローします。

`decipher.setAuthTag()` メソッドは、`CCM` モードの場合は [`decipher.update()`](/ja/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) の前、`GCM` および `OCB` モードと `chacha20-poly1305` の場合は [`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) の前に呼び出す必要があります。 `decipher.setAuthTag()` は一度しか呼び出すことができません。

認証タグとして文字列を渡す場合は、[暗号 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Added in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
- 戻り値: [\<Decipher\>](/ja/nodejs/api/crypto#class-decipher) メソッドチェーンのために同じ Decipher を返します。

データが標準のブロックパディングなしで暗号化されている場合、`decipher.setAutoPadding(false)`を呼び出すと、[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) がパディングのチェックと削除を行わないように、自動パディングが無効になります。

自動パディングをオフにすると、入力データの長さが暗号のブロックサイズの倍数である場合にのみ機能します。

`decipher.setAutoPadding()` メソッドは、[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) の前に呼び出す必要があります。

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.0.0 | デフォルトの `inputEncoding` が `binary` から `utf8` に変更されました。 |
| v0.1.94 | Added in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 文字列の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 戻り値の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`data` で復号器を更新します。`inputEncoding` 引数が指定されている場合、`data` 引数は指定されたエンコーディングを使用する文字列です。`inputEncoding` 引数が指定されていない場合、`data` は [`Buffer`](/ja/nodejs/api/buffer) でなければなりません。`data` が [`Buffer`](/ja/nodejs/api/buffer) の場合、`inputEncoding` は無視されます。

`outputEncoding` は、暗号化されたデータの出力形式を指定します。`outputEncoding` が指定されている場合、指定されたエンコーディングを使用する文字列が返されます。`outputEncoding` が指定されていない場合、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) が呼び出されるまで、`decipher.update()` メソッドを新しいデータで複数回呼び出すことができます。[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) の後に `decipher.update()` を呼び出すと、エラーが発生します。

基盤となる暗号が認証を実装している場合でも、この関数から返されるプレーンテキストの信頼性と整合性は、現時点では不確かな場合があります。認証された暗号化アルゴリズムの場合、認証は通常、アプリケーションが [`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) を呼び出したときにのみ確立されます。


## クラス: `DiffieHellman` {#class-diffiehellman}

**追加: v0.5.0**

`DiffieHellman`クラスは、Diffie-Hellman鍵交換を作成するためのユーティリティです。

`DiffieHellman`クラスのインスタンスは、[`crypto.createDiffieHellman()`](/ja/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding)関数を使用して作成できます。

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Aliceの鍵を生成...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Bobの鍵を生成...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 交換して秘密鍵を生成...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```js [CJS]
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Aliceの鍵を生成...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Bobの鍵を生成...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 交換して秘密鍵を生成...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**追加: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `otherPublicKey`文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 戻り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`otherPublicKey`を相手側の公開鍵として使用して、共有秘密鍵を計算し、計算された共有秘密鍵を返します。 提供された鍵は、指定された`inputEncoding`を使用して解釈され、秘密鍵は指定された`outputEncoding`を使用してエンコードされます。 `inputEncoding`が提供されない場合、`otherPublicKey`は[`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または`DataView`であると想定されます。

`outputEncoding`が指定されている場合は文字列が返されます。それ以外の場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Added in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

まだ生成または計算されていない場合、秘密鍵と公開Diffie-Hellman鍵の値を生成し、指定された`encoding`で公開鍵を返します。この鍵は相手に転送する必要があります。`encoding`が提供された場合、文字列が返されます。そうでない場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。

この関数は、[`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key)の薄いラッパーです。特に、秘密鍵が生成または設定されると、この関数を呼び出すと公開鍵のみが更新され、新しい秘密鍵は生成されません。

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Added in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指定された`encoding`でDiffie-Hellmanジェネレーターを返します。`encoding`が提供された場合、文字列が返されます。そうでない場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Added in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指定された`encoding`でDiffie-Hellman素数を返します。`encoding`が提供された場合、文字列が返されます。そうでない場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Added in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指定された `encoding` で Diffie-Hellman の秘密鍵を返します。 `encoding` が指定された場合、文字列が返されます。それ以外の場合は、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Added in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指定された `encoding` で Diffie-Hellman の公開鍵を返します。 `encoding` が指定された場合、文字列が返されます。それ以外の場合は、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Added in: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `privateKey` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

Diffie-Hellman の秘密鍵を設定します。 `encoding` 引数が指定されている場合、`privateKey` は文字列であると想定されます。 `encoding` が指定されていない場合、`privateKey` は [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であると想定されます。

この関数は、関連する公開鍵を自動的に計算しません。 [`diffieHellman.setPublicKey()`](/ja/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) または [`diffieHellman.generateKeys()`](/ja/nodejs/api/crypto#diffiehellmangeneratekeysencoding) のいずれかを使用して、公開鍵を手動で提供するか、自動的に導出することができます。


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Added in: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `publicKey` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

Diffie-Hellmanの公開鍵を設定します。`encoding` 引数が指定されている場合、`publicKey` は文字列であることが期待されます。`encoding` が指定されていない場合、`publicKey` は [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であることが期待されます。

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Added in: v0.11.12**

`DiffieHellman` オブジェクトの初期化中に実行されたチェックの結果として発生した警告やエラーを含むビットフィールド。

このプロパティには、次の値が有効です（`node:constants` モジュールで定義されているとおり）。

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Class: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Added in: v0.7.5**

`DiffieHellmanGroup` クラスは、既知の modp グループを引数として取ります。これは `DiffieHellman` と同じように動作しますが、作成後にキーを変更できない点が異なります。つまり、`setPublicKey()` メソッドや `setPrivateKey()` メソッドを実装していません。

::: code-group
```js [ESM]
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```js [CJS]
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```
:::

次のグループがサポートされています。

- `'modp14'` (2048 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 3)
- `'modp15'` (3072 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 4)
- `'modp16'` (4096 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 5)
- `'modp17'` (6144 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 6)
- `'modp18'` (8192 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 7)

次のグループはまだサポートされていますが、非推奨です（[注意点](/ja/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)を参照）。

- `'modp1'` (768 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Section 6.1) 
- `'modp2'` (1024 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Section 6.2) 
- `'modp5'` (1536 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 2) 

これらの非推奨グループは、今後のバージョンの Node.js で削除される可能性があります。


## クラス: `ECDH` {#class-ecdh}

**追加: v0.11.14**

`ECDH` クラスは、楕円曲線 Diffie-Hellman (ECDH) 鍵交換を作成するためのユーティリティです。

`ECDH` クラスのインスタンスは、[`crypto.createECDH()`](/ja/nodejs/api/crypto#cryptocreateecdhcurvename) 関数を使用して作成できます。

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// アリスの鍵を生成...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// ボブの鍵を生成...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// 交換して秘密鍵を生成...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

```js [CJS]
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// アリスの鍵を生成...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// ボブの鍵を生成...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// 交換して秘密鍵を生成...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### 静的メソッド: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**追加: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` 文字列の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 戻り値の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'uncompressed'`
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`key` および `curve` で指定された EC Diffie-Hellman 公開鍵を `format` で指定された形式に変換します。`format` 引数は点のエンコーディングを指定し、`'compressed'`、`'uncompressed'`、または `'hybrid'` にできます。指定されたキーは、指定された `inputEncoding` を使用して解釈され、返されたキーは、指定された `outputEncoding` を使用してエンコードされます。

[`crypto.getCurves()`](/ja/nodejs/api/crypto#cryptogetcurves) を使用して、使用可能な曲線名のリストを取得します。最近の OpenSSL リリースでは、`openssl ecparam -list_curves` でも、使用可能な各楕円曲線の名前と説明が表示されます。

`format` が指定されていない場合、点は `'uncompressed'` 形式で返されます。

`inputEncoding` が指定されていない場合、`key` は [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であることが期待されます。

例 (キーの圧縮解除):

::: code-group
```js [ESM]
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// 変換されたキーと非圧縮公開鍵は同じである必要があります
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```js [CJS]
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// 変換されたキーと非圧縮公開鍵は同じである必要があります
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::

### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | 無効な公開鍵エラーをより適切にサポートするようにエラー形式を変更しました。 |
| v6.0.0 | デフォルトの `inputEncoding` が `binary` から `utf8` に変更されました。 |
| v0.11.14 | v0.11.14 で追加されました |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `otherPublicKey` 文字列の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 戻り値の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`otherPublicKey`を相手の公開鍵として使用して共有秘密鍵を計算し、計算された共有秘密鍵を返します。 指定された鍵は、指定された`inputEncoding`を使用して解釈され、返された秘密鍵は、指定された`outputEncoding`を使用してエンコードされます。 `inputEncoding`が提供されない場合、`otherPublicKey`は[`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または`DataView`であると想定されます。

`outputEncoding`に文字列が指定された場合、文字列が返されます。そうでない場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。

`ecdh.computeSecret`は、`otherPublicKey`が楕円曲線外にある場合、`ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY`エラーをスローします。 `otherPublicKey`は通常、安全でないネットワークを介してリモートユーザーから提供されるため、この例外に適切に対処してください。


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Added in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'uncompressed'`
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

秘密鍵と公開EC Diffie-Hellman鍵の値を生成し、指定された`format`と`encoding`で公開鍵を返します。この鍵は相手に転送されるべきです。

`format`引数は点符号化を指定し、`'compressed'`または`'uncompressed'`にできます。`format`が指定されていない場合、点は`'uncompressed'`形式で返されます。

`encoding`が提供された場合は文字列が返されます。それ以外の場合は[`Buffer`](/ja/nodejs/api/buffer)が返されます。

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Added in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定された`encoding`でのEC Diffie-Hellman。

`encoding`が指定された場合、文字列が返されます。それ以外の場合は[`Buffer`](/ja/nodejs/api/buffer)が返されます。

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Added in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'uncompressed'`
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定された`encoding`と`format`でのEC Diffie-Hellman公開鍵。

`format`引数は点符号化を指定し、`'compressed'`または`'uncompressed'`にできます。`format`が指定されていない場合、点は`'uncompressed'`形式で返されます。

`encoding`が指定された場合、文字列が返されます。それ以外の場合は[`Buffer`](/ja/nodejs/api/buffer)が返されます。


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Added in: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `privateKey` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

EC Diffie-Hellman のプライベートキーを設定します。`encoding` が提供されている場合、`privateKey` は文字列であると想定されます。それ以外の場合、`privateKey` は [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であると想定されます。

`privateKey` が `ECDH` オブジェクトの作成時に指定された曲線に対して有効でない場合、エラーがスローされます。プライベートキーを設定すると、関連付けられた公開ポイント（キー）も生成され、`ECDH` オブジェクトに設定されます。

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Added in: v0.11.14**

**Deprecated since: v5.2.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `publicKey` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

EC Diffie-Hellman の公開キーを設定します。`encoding` が提供されている場合、`publicKey` は文字列であると想定されます。それ以外の場合、[`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であると想定されます。

`ECDH` は共有シークレットを計算するためにプライベートキーと相手の公開キーのみを必要とするため、通常、このメソッドを呼び出す理由はありません。通常、[`ecdh.generateKeys()`](/ja/nodejs/api/crypto#ecdhgeneratekeysencoding-format) または [`ecdh.setPrivateKey()`](/ja/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) のいずれかが呼び出されます。[`ecdh.setPrivateKey()`](/ja/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) メソッドは、設定されているプライベートキーに関連付けられた公開ポイント/キーを生成しようとします。

例（共有シークレットの取得）：

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// これは、アリスの以前のプライベートキーの1つを指定する簡単な方法です。
// 実際のアプリケーションでこのような予測可能なプライベートキーを使用するのは賢明ではありません。
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bobは、暗号学的に強力な新しく生成された
// 擬似乱数キーペアを使用します
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret と bobSecret は同じ共有シークレット値である必要があります
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// これは、アリスの以前のプライベートキーの1つを指定する簡単な方法です。
// 実際のアプリケーションでこのような予測可能なプライベートキーを使用するのは賢明ではありません。
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bobは、暗号学的に強力な新しく生成された
// 擬似乱数キーペアを使用します
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret と bobSecret は同じ共有シークレット値である必要があります
console.log(aliceSecret === bobSecret);
```
:::


## クラス: `Hash` {#class-hash}

**追加: v0.1.92**

- 拡張: [\<stream.Transform\>](/ja/nodejs/api/stream#class-streamtransform)

`Hash` クラスは、データのハッシュダイジェストを作成するためのユーティリティです。これは次の2つの方法で使用できます。

- 可読かつ書き込み可能な[ストリーム](/ja/nodejs/api/stream)として。データが書き込まれると、可読側で計算されたハッシュダイジェストが生成されます。
- [`hash.update()`](/ja/nodejs/api/crypto#hashupdatedata-inputencoding) と [`hash.digest()`](/ja/nodejs/api/crypto#hashdigestencoding) メソッドを使用して、計算されたハッシュを生成します。

[`crypto.createHash()`](/ja/nodejs/api/crypto#cryptocreatehashalgorithm-options) メソッドは、`Hash` インスタンスを作成するために使用されます。`Hash` オブジェクトは、`new` キーワードを使用して直接作成することはできません。

例: `Hash` オブジェクトをストリームとして使用する:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // ハッシュストリームによって生成される要素は1つだけです。
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // ハッシュストリームによって生成される要素は1つだけです。
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

例: `Hash` とパイプされたストリームを使用する:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```
:::

例: [`hash.update()`](/ja/nodejs/api/crypto#hashupdatedata-inputencoding) と [`hash.digest()`](/ja/nodejs/api/crypto#hashdigestencoding) メソッドを使用する:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**Added in: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ja/nodejs/api/stream#new-streamtransformoptions)
- 戻り値: [\<Hash\>](/ja/nodejs/api/crypto#class-hash)

現在の `Hash` オブジェクトの内部状態のディープコピーを含む新しい `Hash` オブジェクトを作成します。

オプションの `options` 引数はストリームの動作を制御します。 `'shake256'` などの XOF ハッシュ関数では、`outputLength` オプションを使用して、必要な出力長をバイト単位で指定できます。

[`hash.digest()`](/ja/nodejs/api/crypto#hashdigestencoding) メソッドが呼び出された後、`Hash` オブジェクトをコピーしようとすると、エラーがスローされます。

::: code-group
```js [ESM]
// ローリングハッシュを計算します。
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// その他
```

```js [CJS]
// ローリングハッシュを計算します。
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// その他
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**Added in: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 戻り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ハッシュ化されるように渡されたすべてのデータのダイジェストを計算します（[`hash.update()`](/ja/nodejs/api/crypto#hashupdatedata-inputencoding) メソッドを使用）。 `encoding` が指定された場合は文字列が返されます。そうでない場合は、[`Buffer`](/ja/nodejs/api/buffer) が返されます。

`Hash` オブジェクトは、`hash.digest()` メソッドが呼び出された後は再度使用できません。 複数回呼び出すと、エラーがスローされます。


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.0.0 | デフォルトの `inputEncoding` が `binary` から `utf8` に変更されました。 |
| v0.1.92 | 追加: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 文字列の[エンコード](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

与えられた `data` でハッシュの内容を更新します。`data` のエンコードは `inputEncoding` で与えられます。`encoding` が提供されず、`data` が文字列の場合、`'utf8'` のエンコードが強制されます。`data` が [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` の場合、`inputEncoding` は無視されます。

これはストリーミングされるため、新しいデータで何度も呼び出すことができます。

## クラス: `Hmac` {#class-hmac}

**追加: v0.1.94**

- 拡張: [\<stream.Transform\>](/ja/nodejs/api/stream#class-streamtransform)

`Hmac` クラスは、暗号論的 HMAC ダイジェストを作成するためのユーティリティです。次の2つの方法で使用できます。

- 読み取り可能かつ書き込み可能な [ストリーム](/ja/nodejs/api/stream)として。データは、読み取り可能側で計算された HMAC ダイジェストを生成するために書き込まれます。または、
- [`hmac.update()`](/ja/nodejs/api/crypto#hmacupdatedata-inputencoding) および [`hmac.digest()`](/ja/nodejs/api/crypto#hmacdigestencoding) メソッドを使用して、計算された HMAC ダイジェストを生成します。

[`crypto.createHmac()`](/ja/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) メソッドは、`Hmac` インスタンスを作成するために使用されます。`Hmac` オブジェクトは、`new` キーワードを使用して直接作成しないでください。

例: ストリームとして `Hmac` オブジェクトを使用する:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // ハッシュストリームによって生成される要素は1つだけです。
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // 出力:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // ハッシュストリームによって生成される要素は1つだけです。
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // 出力:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

例: `Hmac` とパイプされたストリームを使用する:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```
:::

例: [`hmac.update()`](/ja/nodejs/api/crypto#hmacupdatedata-inputencoding) および [`hmac.digest()`](/ja/nodejs/api/crypto#hmacdigestencoding) メソッドを使用する:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// 出力:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// 出力:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**Added in: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`hmac.update()`](/ja/nodejs/api/crypto#hmacupdatedata-inputencoding)を使って渡されたすべてのデータのHMACダイジェストを計算します。`encoding`が指定された場合は文字列が返されます。そうでない場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。

`Hmac`オブジェクトは、`hmac.digest()`が呼び出された後は再度使用できません。`hmac.digest()`を複数回呼び出すと、エラーがスローされます。

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.0.0 | デフォルトの`inputEncoding`が`binary`から`utf8`に変更されました。 |
| v0.1.94 | Added in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data`文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

指定された`data`で`Hmac`コンテンツを更新します。`data`のエンコーディングは`inputEncoding`で指定されます。`encoding`が指定されておらず、`data`が文字列の場合、`'utf8'`のエンコーディングが適用されます。`data`が[`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または`DataView`の場合、`inputEncoding`は無視されます。

これは、ストリームとして新しいデータを使用して何度も呼び出すことができます。

## Class: `KeyObject` {#class-keyobject}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.5.0, v12.19.0 | このクラスのインスタンスは、`postMessage`を使用してワーカースレッドに渡すことができるようになりました。 |
| v11.13.0 | このクラスがエクスポートされるようになりました。 |
| v11.6.0 | Added in: v11.6.0 |
:::

Node.jsは、対称キーまたは非対称キーを表すために`KeyObject`クラスを使用し、各種類のキーは異なる関数を公開します。[`crypto.createSecretKey()`](/ja/nodejs/api/crypto#cryptocreatesecretkeykey-encoding)、[`crypto.createPublicKey()`](/ja/nodejs/api/crypto#cryptocreatepublickeykey)、および[`crypto.createPrivateKey()`](/ja/nodejs/api/crypto#cryptocreateprivatekeykey)メソッドは、`KeyObject`インスタンスを作成するために使用されます。`KeyObject`オブジェクトは、`new`キーワードを使用して直接作成することはできません。

ほとんどのアプリケーションは、セキュリティ機能が向上しているため、キーを文字列または`Buffer`として渡す代わりに、新しい`KeyObject` APIを使用することを検討する必要があります。

`KeyObject`インスタンスは、[`postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist)を介して他のスレッドに渡すことができます。レシーバーはクローンされた`KeyObject`を取得し、`KeyObject`は`transferList`引数にリストする必要はありません。


### 静的メソッド: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**追加: v15.0.0**

- `key` [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- 戻り値: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)

例: `CryptoKey` インスタンスを `KeyObject` に変換する:

::: code-group
```js [ESM]
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Prints: 32 (symmetric key size in bytes)
```

```js [CJS]
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.9.0 | RSA-PSSキーの`RSASSA-PSS-params`シーケンスパラメータを公開します。 |
| v15.7.0 | 追加: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) キーサイズ (ビット単位) (RSA, DSA)。
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 公開指数 (RSA)。
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) メッセージダイジェストの名前 (RSA-PSS)。
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1 で使用されるメッセージダイジェストの名前 (RSA-PSS)。
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最小ソルト長 (バイト単位) (RSA-PSS)。
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `q` のサイズ (ビット単位) (DSA)。
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) カーブの名前 (EC)。

このプロパティは、非対称キーにのみ存在します。キーの種類に応じて、このオブジェクトにはキーに関する情報が含まれています。このプロパティを通じて取得された情報は、キーを一意に識別したり、キーのセキュリティを侵害したりするために使用することはできません。

RSA-PSSキーの場合、キーマテリアルに `RSASSA-PSS-params` シーケンスが含まれている場合、`hashAlgorithm`、`mgf1HashAlgorithm`、および `saltLength` プロパティが設定されます。

その他のキーの詳細が、追加の属性を使用してこのAPIを通じて公開される場合があります。


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.9.0, v12.17.0 | `'dh'` のサポートが追加されました。 |
| v12.0.0 | `'rsa-pss'` のサポートが追加されました。 |
| v12.0.0 | このプロパティは、認識されない型の KeyObject インスタンスに対して、中止する代わりに `undefined` を返すようになりました。 |
| v12.0.0 | `'x25519'` と `'x448'` のサポートが追加されました。 |
| v12.0.0 | `'ed25519'` と `'ed448'` のサポートが追加されました。 |
| v11.6.0 | 追加: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

非対称鍵の場合、このプロパティは鍵の型を表します。サポートされている鍵の型は次のとおりです。

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

このプロパティは、認識されない `KeyObject` 型と対称鍵の場合は `undefined` です。

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**追加: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) `keyObject` と比較する `KeyObject`。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

鍵の型、値、およびパラメータが完全に同じであるかどうかに応じて、`true` または `false` を返します。このメソッドは [一定時間](https://en.wikipedia.org/wiki/Timing_attack)ではありません。

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.9.0 | `'jwk'` 形式のサポートが追加されました。 |
| v11.6.0 | 追加: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

対称鍵の場合、次のエンコードオプションを使用できます。

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'buffer'` (デフォルト) または `'jwk'` である必要があります。

公開鍵の場合、次のエンコードオプションを使用できます。

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'` (RSA のみ) または `'spki'` のいずれかである必要があります。
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'`、または `'jwk'` である必要があります。

秘密鍵の場合、次のエンコードオプションを使用できます。

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'` (RSA のみ)、`'pkcs8'` または `'sec1'` (EC のみ) のいずれかである必要があります。
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'`、または `'jwk'` である必要があります。
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定された場合、秘密鍵は PKCS#5 v2.0 パスワードベースの暗号化を使用して、指定された `cipher` および `passphrase` で暗号化されます。
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 暗号化に使用するパスフレーズ。`cipher` を参照してください。

結果の型は、選択されたエンコード形式によって異なります。PEM の場合、結果は文字列になり、DER の場合、DER としてエンコードされたデータを含むバッファーになり、[JWK](https://tools.ietf.org/html/rfc7517) の場合、オブジェクトになります。

[JWK](https://tools.ietf.org/html/rfc7517) エンコード形式が選択された場合、他のすべてのエンコードオプションは無視されます。

PKCS#1、SEC1、および PKCS#8 型の鍵は、`cipher` と `format` オプションの組み合わせを使用して暗号化できます。PKCS#8 `type` は、`cipher` を指定することにより、任意の `format` で任意の鍵アルゴリズム (RSA、EC、または DH) で使用できます。PKCS#1 と SEC1 は、PEM `format` が使用されている場合に `cipher` を指定することによってのみ暗号化できます。最大限の互換性を得るには、暗号化された秘密鍵に PKCS#8 を使用します。PKCS#8 は独自の暗号化メカニズムを定義しているため、PKCS#8 鍵を暗号化する場合、PEM レベルの暗号化はサポートされていません。PKCS#8 暗号化については [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) を、PKCS#1 および SEC1 暗号化については [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) を参照してください。


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Added in: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

秘密鍵の場合、このプロパティは鍵のサイズをバイト単位で表します。非対称鍵の場合、このプロパティは `undefined` です。

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Added in: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ja/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ja/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ja/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [鍵の使用法](/ja/nodejs/api/webcrypto#cryptokeyusages) を参照してください。
- 戻り値: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)

`KeyObject` インスタンスを `CryptoKey` に変換します。

### `keyObject.type` {#keyobjecttype}

**Added in: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この `KeyObject` の種類に応じて、このプロパティは、秘密（対称）鍵の場合は `'secret'`、公開（非対称）鍵の場合は `'public'`、秘密（非対称）鍵の場合は `'private'` になります。

## Class: `Sign` {#class-sign}

**Added in: v0.1.92**

- 継承元: [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)

`Sign` クラスは、署名を生成するためのユーティリティです。次の 2 つの方法で使用できます。

- 書き込み可能な [ストリーム](/ja/nodejs/api/stream) として、署名するデータが書き込まれ、[`sign.sign()`](/ja/nodejs/api/crypto#signsignprivatekey-outputencoding) メソッドを使用して署名を生成して返すか、
- [`sign.update()`](/ja/nodejs/api/crypto#signupdatedata-inputencoding) および [`sign.sign()`](/ja/nodejs/api/crypto#signsignprivatekey-outputencoding) メソッドを使用して署名を生成します。

[`crypto.createSign()`](/ja/nodejs/api/crypto#cryptocreatesignalgorithm-options) メソッドは、`Sign` インスタンスの作成に使用されます。引数は、使用するハッシュ関数の文字列名です。`Sign` オブジェクトは、`new` キーワードを使用して直接作成しないでください。

例: `Sign` および [`Verify`](/ja/nodejs/api/crypto#class-verify) オブジェクトをストリームとして使用する:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```
:::

例: [`sign.update()`](/ja/nodejs/api/crypto#signupdatedata-inputencoding) および [`verify.update()`](/ja/nodejs/api/crypto#verifyupdatedata-inputencoding) メソッドの使用:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```
:::


### `sign.sign(privateKey[, outputEncoding])` {#signsignprivatekey-outputencoding}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | privateKeyはArrayBufferとCryptoKeyにもなりえます。 |
| v13.2.0, v12.16.0 | この関数はIEEE-P1363 DSAおよびECDSA署名をサポートするようになりました。 |
| v12.0.0 | この関数はRSA-PSSキーをサポートするようになりました。 |
| v11.6.0 | この関数はキーオブジェクトをサポートするようになりました。 |
| v8.0.0 | RSASSA-PSSおよび追加オプションのサポートが追加されました。 |
| v0.1.92 | Added in: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) 
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返り値の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`sign.update()`](/ja/nodejs/api/crypto#signupdatedata-inputencoding)または[`sign.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)のいずれかを使用して渡されたすべてのデータの署名を計算します。

`privateKey`が[`KeyObject`](/ja/nodejs/api/crypto#class-keyobject)でない場合、この関数は`privateKey`が[`crypto.createPrivateKey()`](/ja/nodejs/api/crypto#cryptocreateprivatekeykey)に渡されたかのように動作します。 オブジェクトである場合、次の追加プロパティを渡すことができます。

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSAおよびECDSAの場合、このオプションは生成された署名の形式を指定します。 次のいずれかになります。
    - `'der'` (default): DERエンコードされたASN.1署名構造体は、`(r, s)`をエンコードします。
    - `'ieee-p1363'`: IEEE-P1363で提案されている署名形式`r || s`。
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSAのオプションのパディング値。次のいずれかです。
    - `crypto.constants.RSA_PKCS1_PADDING` (default)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING`は、[RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)のセクション3.1で指定されているメッセージの署名に使用されるものと同じハッシュ関数を使用してMGF1を使用します。[RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)のセクション3.3に準拠してキーの一部としてMGF1ハッシュ関数が指定されていない限り。
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) パディングが`RSA_PKCS1_PSS_PADDING`の場合のソルト長。 特殊な値`crypto.constants.RSA_PSS_SALTLEN_DIGEST`は、ソルト長をダイジェストサイズに設定し、`crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (default) は、ソルト長を許容される最大値に設定します。

`outputEncoding`が指定されている場合は文字列が返されます。それ以外の場合は、[`Buffer`](/ja/nodejs/api/buffer)が返されます。

`Sign`オブジェクトは、`sign.sign()`メソッドが呼び出された後は再度使用できません。 `sign.sign()`を複数回呼び出すと、エラーがスローされます。


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.0.0 | デフォルトの `inputEncoding` が `binary` から `utf8` に変更されました。 |
| v0.1.92 | 追加: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 文字列の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

`Sign` のコンテンツを与えられた `data` で更新します。そのエンコーディングは `inputEncoding` で与えられます。`encoding` が与えられず、`data` が文字列の場合、`'utf8'` のエンコーディングが適用されます。`data` が [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` の場合、`inputEncoding` は無視されます。

これはストリームとして新しいデータが流れてくるたびに、何度も呼び出すことができます。

## Class: `Verify` {#class-verify}

**追加: v0.1.92**

- 継承元: [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)

`Verify` クラスは、署名を検証するためのユーティリティです。次の2つの方法のいずれかで使用できます。

- 書き込み可能な [ストリーム](/ja/nodejs/api/stream) として。書き込まれたデータは、提供された署名に対して検証するために使用されます。
- [`verify.update()`](/ja/nodejs/api/crypto#verifyupdatedata-inputencoding) および [`verify.verify()`](/ja/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) メソッドを使用して署名を検証します。

[`crypto.createVerify()`](/ja/nodejs/api/crypto#cryptocreateverifyalgorithm-options) メソッドは、`Verify` インスタンスを作成するために使用されます。`Verify` オブジェクトは、`new` キーワードを使用して直接作成することはできません。

例については、[`Sign`](/ja/nodejs/api/crypto#class-sign) を参照してください。

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.0.0 | デフォルトの `inputEncoding` が `binary` から `utf8` に変更されました。 |
| v0.1.92 | 追加: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 文字列の [エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。

`Verify` のコンテンツを与えられた `data` で更新します。そのエンコーディングは `inputEncoding` で与えられます。`inputEncoding` が与えられず、`data` が文字列の場合、`'utf8'` のエンコーディングが適用されます。`data` が [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` の場合、`inputEncoding` は無視されます。

これはストリームとして新しいデータが流れてくるたびに、何度も呼び出すことができます。


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | オブジェクトは、ArrayBufferとCryptoKeyにもなり得ます。 |
| v13.2.0, v12.16.0 | この関数は、IEEE-P1363のDSAおよびECDSA署名をサポートするようになりました。 |
| v12.0.0 | この関数は、RSA-PSS鍵をサポートするようになりました。 |
| v11.7.0 | 鍵は秘密鍵にもなりえます。 |
| v8.0.0 | RSASSA-PSSのサポートと追加オプションが追加されました。 |
| v0.1.92 | Added in: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `signature` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) データと公開鍵に対する署名の有効性に応じて `true` または `false`。

指定された `object` と `signature` を使用して、提供されたデータを検証します。

`object` が [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) でない場合、この関数は `object` が [`crypto.createPublicKey()`](/ja/nodejs/api/crypto#cryptocreatepublickeykey) に渡されたかのように動作します。 オブジェクトの場合、次の追加プロパティを渡すことができます。

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSAおよびECDSAの場合、このオプションは署名の形式を指定します。 次のいずれかになります。
    - `'der'` (デフォルト): DERエンコードされたASN.1署名構造エンコーディング `(r, s)`。
    - `'ieee-p1363'`: IEEE-P1363で提案されている署名形式 `r || s`。

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSAのオプションのパディング値。次のいずれかです。
    - `crypto.constants.RSA_PKCS1_PADDING` (デフォルト)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` は、[RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) のセクション3.1で指定されているメッセージの検証に使用されるハッシュ関数と同じMGF1を使用します。ただし、MGF1ハッシュ関数が [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) のセクション3.3に準拠してキーの一部として指定されている場合は除きます。
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) パディングが `RSA_PKCS1_PSS_PADDING` の場合のソルト長。 特別な値 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` はソルト長をダイジェストサイズに設定し、`crypto.constants.RSA_PSS_SALTLEN_AUTO` (デフォルト) は自動的に決定されるようにします。

`signature` 引数は、以前に計算されたデータの署名であり、`signatureEncoding` で表されます。 `signatureEncoding` が指定されている場合、`signature` は文字列であると想定されます。それ以外の場合、`signature` は [`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であると想定されます。

`verify` オブジェクトは、`verify.verify()` が呼び出された後は再利用できません。 `verify.verify()` を複数回呼び出すと、エラーがスローされます。

公開鍵は秘密鍵から派生できるため、公開鍵の代わりに秘密鍵を渡すことができます。


## クラス: `X509Certificate` {#class-x509certificate}

**追加: v15.6.0**

X509証明書をカプセル化し、その情報への読み取り専用アクセスを提供します。

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**追加: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PEMまたはDERエンコードされたX509証明書。

### `x509.ca` {#x509ca}

**追加: v15.6.0**

- 型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) これが認証局 (CA) 証明書の場合、`true`になります。

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}


::: info [履歴]
| バージョン | 変更 |
|---|---|
| v18.0.0 | subject オプションのデフォルトが `'default'` になりました。 |
| v17.5.0, v16.15.0 | subject オプションを `'default'` に設定できるようになりました。 |
| v17.5.0, v16.14.1 | `wildcards`、`partialWildcards`、`multiLabelWildcards`、および `singleLabelSubdomains` オプションは効果がなかったため削除されました。 |
| v15.6.0 | 追加: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`、`'always'`、または `'never'`。 **デフォルト:** `'default'`。


- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 証明書が一致する場合は `email` を返し、一致しない場合は `undefined` を返します。

証明書が指定されたメールアドレスと一致するかどうかを確認します。

`'subject'` オプションが未定義であるか、`'default'` に設定されている場合、証明書のサブジェクトは、サブジェクト代替名拡張が存在しないか、メールアドレスが含まれていない場合にのみ考慮されます。

`'subject'` オプションが `'always'` に設定されており、サブジェクト代替名拡張が存在しないか、一致するメールアドレスが含まれていない場合、証明書のサブジェクトが考慮されます。

`'subject'` オプションが `'never'` に設定されている場合、証明書にサブジェクト代替名が含まれていない場合でも、証明書のサブジェクトは考慮されません。


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `subject` オプションのデフォルトが `'default'` になりました。 |
| v17.5.0, v16.15.0 | `subject` オプションに `'default'` を設定できるようになりました。 |
| v15.6.0 | 追加: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'`, または `'never'`。 **デフォルト:** `'default'`。
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`。
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`。
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`。
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`。


- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `name` に一致するサブジェクト名を返します。`name` に一致するサブジェクト名がない場合は `undefined` を返します。

証明書が指定されたホスト名に一致するかどうかを確認します。

証明書が指定されたホスト名に一致する場合、一致するサブジェクト名が返されます。返される名前は、完全一致 (例: `foo.example.com`) である場合もあれば、ワイルドカードを含む (例: `*.example.com`) 場合もあります。ホスト名の比較は大文字と小文字を区別しないため、返されるサブジェクト名の大文字と小文字が、指定された `name` と異なる場合もあります。

`'subject'` オプションが未定義であるか、`'default'` に設定されている場合、証明書のサブジェクトは、サブジェクト代替名拡張が存在しないか、DNS 名が含まれていない場合にのみ考慮されます。この動作は、[RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS") と一貫性があります。

`'subject'` オプションが `'always'` に設定されており、サブジェクト代替名拡張が存在しないか、一致する DNS 名が含まれていない場合、証明書のサブジェクトが考慮されます。

`'subject'` オプションが `'never'` に設定されている場合、証明書にサブジェクト代替名が含まれていない場合でも、証明書のサブジェクトは考慮されません。


### `x509.checkIP(ip)` {#x509checkipip}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.5.0, v16.14.1 | `options` 引数は効果がなかったため削除されました。 |
| v15.6.0 | 追加: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 証明書が一致する場合は `ip` を返し、一致しない場合は `undefined` を返します。

証明書が指定された IP アドレス（IPv4 または IPv6）と一致するかどうかを確認します。

[RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) の `iPAddress` のサブジェクト代替名のみが考慮され、それらは指定された `ip` アドレスと正確に一致する必要があります。その他のサブジェクト代替名と証明書のサブジェクトフィールドは無視されます。

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**追加: v15.6.0**

- `otherCert` [\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この証明書が、指定された `otherCert` によって発行されたかどうかを確認します。

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**追加: v15.6.0**

- `privateKey` [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) 秘密鍵。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この証明書の公開鍵が、指定された秘密鍵と一致するかどうかを確認します。

### `x509.extKeyUsage` {#x509extkeyusage}

**追加: v15.6.0**

- 型: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書のキー拡張使用法を詳しく説明する配列。

### `x509.fingerprint` {#x509fingerprint}

**追加: v15.6.0**

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書の SHA-1 フィンガープリント。

SHA-1 は暗号学的に破られており、SHA-1 のセキュリティは証明書の署名によく使用されるアルゴリズムよりも大幅に劣るため、代わりに [`x509.fingerprint256`](/ja/nodejs/api/crypto#x509fingerprint256) を使用することを検討してください。


### `x509.fingerprint256` {#x509fingerprint256}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書の SHA-256 フィンガープリント。

### `x509.fingerprint512` {#x509fingerprint512}

**Added in: v17.2.0, v16.14.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書の SHA-512 フィンガープリント。

SHA-256 フィンガープリントの計算は通常より高速で、SHA-512 フィンガープリントの半分のサイズしかないため、[`x509.fingerprint256`](/ja/nodejs/api/crypto#x509fingerprint256) の方が適している場合があります。 SHA-512 は一般的に高レベルのセキュリティを提供すると考えられますが、SHA-256 のセキュリティは、証明書の署名に一般的に使用されるほとんどのアルゴリズムのセキュリティと一致します。

### `x509.infoAccess` {#x509infoaccess}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.3.1, v16.13.2 | CVE-2021-44532 への対応として、この文字列の一部が JSON 文字列リテラルとしてエンコードされる場合があります。 |
| v15.6.0 | Added in: v15.6.0 |
:::

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

証明書の認証局情報アクセス拡張機能のテキスト表現。

これは、アクセス記述を改行で区切ったリストです。 各行は、アクセス方法とアクセス場所の種類で始まり、コロンとアクセス場所に関連付けられた値が続きます。

アクセス方法とアクセス場所の種類を示すプレフィックスの後、各行の残りの部分は、値が JSON 文字列リテラルであることを示すために引用符で囲まれている場合があります。 下位互換性のため、Node.js はあいまいさを避ける必要がある場合にのみ、このプロパティ内で JSON 文字列リテラルを使用します。 サードパーティのコードは、両方の可能なエントリ形式を処理できるように準備する必要があります。

### `x509.issuer` {#x509issuer}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書に含まれる発行者識別情報。


### `x509.issuerCertificate` {#x509issuercertificate}

**Added in: v15.9.0**

- Type: [\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate)

発行者証明書、または発行者証明書が利用できない場合は `undefined`。

### `x509.publicKey` {#x509publickey}

**Added in: v15.6.0**

- Type: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)

この証明書の公開鍵[\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)。

### `x509.raw` {#x509raw}

**Added in: v15.6.0**

- Type: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

この証明書の DER エンコーディングを含む `Buffer`。

### `x509.serialNumber` {#x509serialnumber}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書のシリアル番号。

シリアル番号は認証局によって割り当てられ、証明書を一意に識別するものではありません。 代わりに、一意の識別子として [`x509.fingerprint256`](/ja/nodejs/api/crypto#x509fingerprint256) の使用を検討してください。

### `x509.subject` {#x509subject}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書の完全なサブジェクト。

### `x509.subjectAltName` {#x509subjectaltname}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.3.1, v16.13.2 | CVE-2021-44532 に対応して、この文字列の一部が JSON 文字列リテラルとしてエンコードされる場合があります。 |
| v15.6.0 | Added in: v15.6.0 |
:::

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書に指定されたサブジェクト代替名。

これは、サブジェクト代替名のカンマ区切りのリストです。 各エントリは、サブジェクト代替名の種類を識別する文字列で始まり、その後にコロンとエントリに関連付けられた値が続きます。

Node.js の以前のバージョンでは、2 文字のシーケンス `', '` でこのプロパティを分割しても安全であると誤って想定していました ( [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532) を参照)。 ただし、悪意のある証明書と正当な証明書の両方に、文字列として表される場合にこのシーケンスを含むサブジェクト代替名を含めることができます。

エントリのタイプを示すプレフィックスの後、各エントリの残りの部分は、値が JSON 文字列リテラルであることを示すために引用符で囲まれている場合があります。 後方互換性のため、Node.js はあいまいさを回避する必要がある場合にのみ、このプロパティ内で JSON 文字列リテラルを使用します。 サードパーティのコードは、可能な両方のエントリ形式を処理できるように準備する必要があります。


### `x509.toJSON()` {#x509tojson}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

X509証明書に対する標準のJSONエンコーディングはありません。`toJSON()`メソッドは、PEMエンコードされた証明書を含む文字列を返します。

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Added in: v15.6.0**

- Type: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

レガシーな[証明書オブジェクト](/ja/nodejs/api/tls#certificate-object)エンコーディングを使用して、この証明書に関する情報を返します。

### `x509.toString()` {#x509tostring}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

PEMエンコードされた証明書を返します。

### `x509.validFrom` {#x509validfrom}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書が有効になる日付/時刻。

### `x509.validFromDate` {#x509validfromdate}

**Added in: v23.0.0**

- Type: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

この証明書が有効になる日付/時刻。`Date`オブジェクトにカプセル化されています。

### `x509.validTo` {#x509validto}

**Added in: v15.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この証明書が有効な日付/時刻。

### `x509.validToDate` {#x509validtodate}

**Added in: v23.0.0**

- Type: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

この証明書が有効な日付/時刻。`Date`オブジェクトにカプセル化されています。

### `x509.verify(publicKey)` {#x509verifypublickey}

**Added in: v15.6.0**

- `publicKey` [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) 公開鍵。
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この証明書が与えられた公開鍵によって署名されたことを検証します。証明書に対する他の検証チェックは実行しません。


## `node:crypto` モジュールメソッドとプロパティ {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.8.0 | 追加: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 任意の長さのビッグエンディアンオクテットのシーケンスとしてエンコードされた素数の候補。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行するミラー-ラビンの確率的素数判定イテレーションの回数。 値が `0` (ゼロ) の場合、ランダム入力に対して最大 2 の誤検出率を生成する回数のチェックが使用されます。 チェックの回数を選択するときは注意が必要です。 詳細については、OpenSSLドキュメントの [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) 関数の `nchecks` オプションを参照してください。 **デフォルト:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) チェック中にエラーが発生した場合に [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) オブジェクトに設定されます。
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 候補が `0.25 ** options.checks` 未満のエラー確率の素数である場合は `true`。
  
 

`candidate` の素数性をチェックします。


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Added in: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 任意の長さのビッグエンディアンオクテットのシーケンスとしてエンコードされた、素数である可能性のある数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行するミラー–ラビン確率的素数判定の反復回数。 値が `0`（ゼロ）の場合、ランダムな入力に対して最大2の誤検出率が得られるチェック回数が使用されます。 チェック回数を選択する際は注意が必要です。 詳細については、OpenSSLドキュメントの[`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex)関数の`nchecks`オプションを参照してください。 **Default:** `0`


- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `candidate` が `0.25 ** options.checks` 未満のエラー確率で素数である場合は `true`。

`candidate`の素数性をチェックします。

### `crypto.constants` {#cryptoconstants}

**Added in: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

暗号およびセキュリティ関連の操作で一般的に使用される定数を含むオブジェクト。 現在定義されている特定の定数については、[Crypto constants](/ja/nodejs/api/crypto#crypto-constants)で説明されています。


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v17.9.0, v16.17.0 | `authTagLength` オプションは、`chacha20-poly1305` 暗号を使用する場合にオプションになり、デフォルトは 16 バイトになりました。 |
| v15.0.0 | `password` と `iv` 引数は `ArrayBuffer` にでき、それぞれ最大 2 ** 31 - 1 バイトに制限されています。 |
| v11.6.0 | `key` 引数は `KeyObject` にできるようになりました。 |
| v11.2.0, v10.17.0 | 暗号 `chacha20-poly1305` (ChaCha20-Poly1305 の IETF バリアント) がサポートされるようになりました。 |
| v10.10.0 | OCB モードの暗号がサポートされるようになりました。 |
| v10.2.0 | `authTagLength` オプションを使用して、GCM モードでより短い認証タグを生成できるようになり、デフォルトは 16 バイトになりました。 |
| v9.9.0 | 初期化ベクトルを必要としない暗号の場合、`iv` パラメータは `null` にできるようになりました。 |
| v0.1.94 | Added in: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ja/nodejs/api/stream#new-streamtransformoptions)
- 戻り値: [\<Cipher\>](/ja/nodejs/api/crypto#class-cipher)

指定された `algorithm`、`key` および初期化ベクトル (`iv`) を持つ `Cipher` オブジェクトを作成して返します。

`options` 引数はストリームの動作を制御し、CCM または OCB モード (例: `'aes-128-ccm'`) の暗号が使用される場合を除いてオプションです。 その場合、`authTagLength` オプションは必須であり、認証タグの長さをバイト単位で指定します。 [CCM モード](/ja/nodejs/api/crypto#ccm-mode) を参照してください。 GCM モードでは、`authTagLength` オプションは必須ではありませんが、`getAuthTag()` によって返される認証タグの長さを設定するために使用でき、デフォルトは 16 バイトです。 `chacha20-poly1305` の場合、`authTagLength` オプションのデフォルトは 16 バイトです。

`algorithm` は OpenSSL に依存します。例は `'aes192'` などです。 最新の OpenSSL リリースでは、`openssl list -cipher-algorithms` で使用可能な暗号アルゴリズムが表示されます。

`key` は `algorithm` によって使用される生のキーであり、`iv` は[初期化ベクトル](https://en.wikipedia.org/wiki/Initialization_vector)です。 両方の引数は、`'utf8'` エンコードされた文字列、[Buffer](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` である必要があります。 `key` はオプションで `secret` 型の [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) にすることができます。 暗号が初期化ベクトルを必要としない場合、`iv` は `null` にすることができます。

`key` または `iv` に文字列を渡す場合は、[暗号化 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。

初期化ベクトルは予測不可能で一意である必要があります。理想的には、暗号論的にランダムになります。 それらは秘密である必要はありません: IV は通常、暗号化されていない暗号文メッセージに追加されるだけです。 何かが予測不可能で一意である必要があるが、秘密である必要はないというのは矛盾しているように聞こえるかもしれません。攻撃者は特定の IV がどうなるかを事前に予測できないことを忘れないでください。


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.9.0, v16.17.0 | `chacha20-poly1305` 暗号を使用する場合、`authTagLength` オプションがオプションになり、デフォルトで 16 バイトになります。 |
| v11.6.0 | `key` 引数が `KeyObject` になりました。 |
| v11.2.0, v10.17.0 | 暗号 `chacha20-poly1305` (ChaCha20-Poly1305 の IETF バリアント) がサポートされるようになりました。 |
| v10.10.0 | OCB モードの暗号がサポートされるようになりました。 |
| v10.2.0 | `authTagLength` オプションを使用して、許可される GCM 認証タグの長さを制限できるようになりました。 |
| v9.9.0 | 初期化ベクトルを必要としない暗号の場合、`iv` パラメーターが `null` になる場合があります。 |
| v0.1.94 | 追加: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ja/nodejs/api/stream#new-streamtransformoptions)
- 戻り値: [\<Decipher\>](/ja/nodejs/api/crypto#class-decipher)

指定された `algorithm`、`key` および初期化ベクトル (`iv`) を使用する `Decipher` オブジェクトを作成して返します。

`options` 引数はストリームの動作を制御し、CCM または OCB モード (例: `'aes-128-ccm'`) の暗号が使用される場合を除き、オプションです。
その場合、`authTagLength` オプションが必要であり、認証タグの長さをバイト単位で指定します。
[CCM モード](/ja/nodejs/api/crypto#ccm-mode)を参照してください。
AES-GCM および `chacha20-poly1305` の場合、`authTagLength` オプションはデフォルトで 16 バイトになり、異なる長さを使用する場合は異なる値を設定する必要があります。

`algorithm` は OpenSSL に依存し、例としては `'aes192'` などがあります。
最近の OpenSSL リリースでは、`openssl list -cipher-algorithms` を実行すると、利用可能な暗号アルゴリズムが表示されます。

`key` は `algorithm` によって使用される生のキーであり、`iv` は [初期化ベクトル](https://en.wikipedia.org/wiki/Initialization_vector) です。
両方の引数は `'utf8'` でエンコードされた文字列、[Buffer](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` である必要があります。
`key` はオプションで `secret` タイプの [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) にすることができます。
暗号が初期化ベクトルを必要としない場合、`iv` は `null` にすることができます。

`key` または `iv` に文字列を渡す場合は、[暗号 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。

初期化ベクトルは予測不可能で一意である必要があり、理想的には暗号論的にランダムになります。
それらは秘密である必要はありません。IV は通常、暗号化されていない暗号化されたメッセージに追加されるだけです。
何かが予測不可能で一意でなければならないが、秘密である必要はないというのは矛盾しているように聞こえるかもしれません。攻撃者は特定の IV がどうなるかを事前に予測できないことを忘れないでください。


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | `prime` 引数は、任意の `TypedArray` または `DataView` になりました。 |
| v8.0.0 | `prime` 引数は、`Uint8Array` になりました。 |
| v6.0.0 | エンコーディングパラメーターのデフォルトが `binary` から `utf8` に変更されました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `prime` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **デフォルト:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `generator` 文字列の[エンコーディング](/ja/nodejs/api/buffer#buffers-and-character-encodings)。
- 戻り値: [\<DiffieHellman\>](/ja/nodejs/api/crypto#class-diffiehellman)

提供された `prime` とオプションの特定の `generator` を使用して、`DiffieHellman` 鍵交換オブジェクトを作成します。

`generator` 引数は、数値、文字列、または [`Buffer`](/ja/nodejs/api/buffer) にすることができます。 `generator` が指定されていない場合、値 `2` が使用されます。

`primeEncoding` が指定されている場合、`prime` は文字列であると想定されます。それ以外の場合は、[`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であると想定されます。

`generatorEncoding` が指定されている場合、`generator` は文字列であると想定されます。それ以外の場合は、数値、[`Buffer`](/ja/nodejs/api/buffer)、`TypedArray`、または `DataView` であると想定されます。


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Added in: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `2`
- 戻り値: [\<DiffieHellman\>](/ja/nodejs/api/crypto#class-diffiehellman)

`DiffieHellman`鍵交換オブジェクトを作成し、オプションの特定の数値`generator`を使用して`primeLength`ビットの素数を生成します。`generator`が指定されていない場合は、値`2`が使用されます。

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Added in: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<DiffieHellmanGroup\>](/ja/nodejs/api/crypto#class-diffiehellmangroup)

[`crypto.getDiffieHellman()`](/ja/nodejs/api/crypto#cryptogetdiffiehellmangroupname) のエイリアス

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Added in: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<ECDH\>](/ja/nodejs/api/crypto#class-ecdh)

`curveName`文字列で指定された事前定義された曲線を使用して、楕円曲線Diffie-Hellman（`ECDH`）鍵交換オブジェクトを作成します。利用可能な曲線名のリストを取得するには、[`crypto.getCurves()`](/ja/nodejs/api/crypto#cryptogetcurves)を使用します。最近のOpenSSLリリースでは、`openssl ecparam -list_curves`も、利用可能な各楕円曲線の名前と説明を表示します。

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.8.0 | `outputLength`オプションがXOFハッシュ関数に追加されました。 |
| v0.1.92 | Added in: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ja/nodejs/api/stream#new-streamtransformoptions)
- 戻り値: [\<Hash\>](/ja/nodejs/api/crypto#class-hash)

指定された`algorithm`を使用してハッシュダイジェストを生成するために使用できる`Hash`オブジェクトを作成して返します。オプションの`options`引数は、ストリームの動作を制御します。 `'shake256'`などのXOFハッシュ関数では、`outputLength`オプションを使用して、必要な出力長をバイト単位で指定できます。

`algorithm`は、プラットフォーム上のOpenSSLのバージョンでサポートされている利用可能なアルゴリズムに依存します。例としては、`'sha256'`、`'sha512'`などがあります。最近のOpenSSLのリリースでは、`openssl list -digest-algorithms`は利用可能なダイジェストアルゴリズムを表示します。

例: ファイルのsha256サムを生成する

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createHmac(algorithm, key[, options])` {#cryptocreatehmacalgorithm-key-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | キーは ArrayBuffer または CryptoKey にもなり得ます。 encoding オプションが追加されました。キーに 2 ** 32 - 1 バイトを超えるバイト数を含めることはできません。 |
| v11.6.0 | `key` 引数は `KeyObject` になりました。 |
| v0.1.94 | 追加: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ja/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` が文字列の場合に使用する文字列エンコーディング。
  
 
- 戻り値: [\<Hmac\>](/ja/nodejs/api/crypto#class-hmac)

指定された `algorithm` と `key` を使用する `Hmac` オブジェクトを作成して返します。オプションの `options` 引数は、ストリームの動作を制御します。

`algorithm` は、プラットフォーム上の OpenSSL のバージョンでサポートされている利用可能なアルゴリズムに依存します。例としては、`'sha256'`、`'sha512'` などがあります。OpenSSL の最近のリリースでは、`openssl list -digest-algorithms` で利用可能なダイジェストアルゴリズムが表示されます。

`key` は、暗号 HMAC ハッシュの生成に使用される HMAC キーです。[`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) の場合、そのタイプは `secret` である必要があります。文字列の場合は、[文字列を暗号 API への入力として使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。[`crypto.randomBytes()`](/ja/nodejs/api/crypto#cryptorandombytessize-callback) や [`crypto.generateKey()`](/ja/nodejs/api/crypto#cryptogeneratekeytype-options-callback) などの暗号学的に安全なエントロピー源から取得した場合、その長さは `algorithm` のブロックサイズ (SHA-256 の場合は 512 ビットなど) を超えないようにする必要があります。

例: ファイルの sha256 HMAC を生成する

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createPrivateKey(key)` {#cryptocreateprivatekeykey}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.12.0 | キーは JWK オブジェクトでも構いません。 |
| v15.0.0 | キーは ArrayBuffer でも構いません。 encoding オプションが追加されました。 キーは 2 ** 32 - 1 バイトを超えることはできません。 |
| v11.6.0 | Added in: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM、DER、または JWK 形式のキーマテリアル。
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`, `'der'`、または `'jwk'` である必要があります。 **デフォルト:** `'pem'`。
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'`、`'pkcs8'`、または `'sec1'` である必要があります。 このオプションは、`format` が `'der'` の場合にのみ必須であり、それ以外の場合は無視されます。
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 復号化に使用するパスフレーズ。
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` が文字列の場合に使用する文字列エンコーディング。
  
 
- 戻り値: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)

秘密鍵を含む新しいキーオブジェクトを作成して返します。 `key` が文字列または `Buffer` の場合、`format` は `'pem'` であると想定されます。それ以外の場合、`key` は上記のプロパティを持つオブジェクトである必要があります。

秘密鍵が暗号化されている場合は、`passphrase` を指定する必要があります。 パスフレーズの長さは 1024 バイトに制限されています。


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.12.0 | `key` は JWK オブジェクトでも構いません。 |
| v15.0.0 | `key` は ArrayBuffer でも構いません。 `encoding` オプションが追加されました。 `key` は 2 ** 32 - 1 バイトを超えることはできません。 |
| v11.13.0 | `key` 引数は、型が `private` の `KeyObject` でも構いません。 |
| v11.7.0 | `key` 引数は秘密鍵でも構いません。 |
| v11.6.0 | Added in: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PEM、DER、または JWK 形式の鍵素材。
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pem'`、`'der'`、または `'jwk'` である必要があります。 **デフォルト:** `'pem'`。
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'pkcs1'` または `'spki'` である必要があります。 このオプションは、`format` が `'der'` の場合にのみ必要であり、それ以外の場合は無視されます。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` が文字列の場合に使用する文字列エンコーディング。

- 戻り値: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)

公開鍵を含む新しい鍵オブジェクトを作成して返します。 `key` が文字列または `Buffer` の場合、`format` は `'pem'` であると想定されます。 `key` が型 `'private'` の `KeyObject` の場合、公開鍵は指定された秘密鍵から導出されます。 それ以外の場合、`key` は上記で説明したプロパティを持つオブジェクトである必要があります。

フォーマットが `'pem'` の場合、`'key'` は X.509 証明書である場合もあります。

公開鍵は秘密鍵から導出できるため、公開鍵の代わりに秘密鍵を渡すことができます。 その場合、この関数は [`crypto.createPrivateKey()`](/ja/nodejs/api/crypto#cryptocreateprivatekeykey) が呼び出されたかのように動作します。ただし、返される `KeyObject` の型は `'public'` であり、秘密鍵は返される `KeyObject` から抽出できません。 同様に、型 `'private'` の `KeyObject` が指定された場合、型 `'public'` の新しい `KeyObject` が返され、返されたオブジェクトから秘密鍵を抽出することはできません。


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.8.0, v16.18.0 | キーをゼロ長にできるようになりました。 |
| v15.0.0 | キーを ArrayBuffer または string にすることもできます。encoding 引数が追加されました。キーに 2 ** 32 - 1 バイトを超えるバイトを含めることはできません。 |
| v11.6.0 | 追加: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` が文字列の場合の文字列エンコーディング。
- 戻り値: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)

対称暗号化または `Hmac` の秘密鍵を含む新しいキーオブジェクトを作成して返します。

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**追加: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/ja/nodejs/api/stream#new-streamwritableoptions)
- 戻り値: [\<Sign\>](/ja/nodejs/api/crypto#class-sign)

指定された `algorithm` を使用する `Sign` オブジェクトを作成して返します。 利用可能なダイジェストアルゴリズムの名前を取得するには、[`crypto.getHashes()`](/ja/nodejs/api/crypto#cryptogethashes) を使用します。 オプションの `options` 引数は、`stream.Writable` の動作を制御します。

場合によっては、ダイジェストアルゴリズムの代わりに、`'RSA-SHA256'` などの署名アルゴリズムの名前を使用して `Sign` インスタンスを作成できます。 これは、対応するダイジェストアルゴリズムを使用します。 これは `'ecdsa-with-SHA256'` などのすべての署名アルゴリズムで動作するわけではないため、常にダイジェストアルゴリズム名を使用するのが最適です。


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Added in: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/ja/nodejs/api/stream#new-streamwritableoptions)
- 戻り値: [\<Verify\>](/ja/nodejs/api/crypto#class-verify)

指定されたアルゴリズムを使用する `Verify` オブジェクトを作成して返します。 利用可能な署名アルゴリズムの名前の配列を取得するには、[`crypto.getHashes()`](/ja/nodejs/api/crypto#cryptogethashes) を使用してください。 オプションの `options` 引数は、`stream.Writable` の動作を制御します。

場合によっては、ダイジェストアルゴリズムの代わりに `'RSA-SHA256'` などの署名アルゴリズムの名前を使用して `Verify` インスタンスを作成できます。 これは、対応するダイジェストアルゴリズムを使用します。 これは `'ecdsa-with-SHA256'` など、すべての署名アルゴリズムに対して機能するわけではないため、常にダイジェストアルゴリズム名を使用するのが最適です。

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Added in: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `privateKey`: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)
  
 
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`privateKey` と `publicKey` に基づいて Diffie-Hellman シークレットを計算します。 両方のキーは同じ `asymmetricKeyType` を持っている必要があり、それは `'dh'` (Diffie-Hellman の場合)、`'ec'`、`'x448'`、または `'x25519'` (ECDH の場合) のいずれかである必要があります。

### `crypto.fips` {#cryptofips}

**Added in: v6.0.0**

**Deprecated since: v10.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

FIPS 準拠の暗号プロバイダーが現在使用されているかどうかを確認および制御するためのプロパティ。 true に設定するには、Node.js の FIPS ビルドが必要です。

このプロパティは非推奨です。 代わりに `crypto.setFips()` および `crypto.getFips()` を使用してください。


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v15.0.0 | v15.0.0で追加。 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 生成された秘密鍵の意図された用途。現在、受け入れられる値は`'hmac'`と`'aes'`です。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成するキーのビット長。これは0より大きい値でなければなりません。
    - `type`が`'hmac'`の場合、最小は8で、最大長は2-1です。値が8の倍数でない場合、生成されたキーは`Math.floor(length / 8)`に切り捨てられます。
    - `type`が`'aes'`の場合、lengthは`128`、`192`、または`256`のいずれかでなければなりません。
  
 
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)
  
 

指定された`length`の新しいランダムな秘密鍵を非同期的に生成します。`type`は、`length`に対して実行される検証を決定します。

::: code-group
```js [ESM]
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```js [CJS]
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```
:::

生成されたHMACキーのサイズは、基礎となるハッシュ関数のブロックサイズを超えてはなりません。詳細については、[`crypto.createHmac()`](/ja/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options)を参照してください。


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v16.10.0 | RSA-PSS キーペアの `RSASSA-PSS-params` シーケンスパラメータを定義する機能を追加しました。 |
| v13.9.0, v12.17.0 | Diffie-Hellman のサポートを追加しました。 |
| v12.0.0 | RSA-PSS キーペアのサポートを追加しました。 |
| v12.0.0 | X25519 および X448 キーペアを生成する機能を追加しました。 |
| v12.0.0 | Ed25519 および Ed448 キーペアを生成する機能を追加しました。 |
| v11.6.0 | エンコーディングが指定されていない場合、`generateKeyPair` および `generateKeyPairSync` 関数はキーオブジェクトを生成するようになりました。 |
| v10.12.0 | 追加: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'`, または `'dh'` である必要があります。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ビット単位のキーサイズ (RSA, DSA)。
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公開指数 (RSA)。**デフォルト:** `0x10001`。
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) メッセージダイジェストの名前 (RSA-PSS)。
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1 によって使用されるメッセージダイジェストの名前 (RSA-PSS)。
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) バイト単位の最小ソルト長 (RSA-PSS)。
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ビット単位の `q` のサイズ (DSA)。
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するカーブの名前 (EC)。
    - `prime`: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 素数パラメータ (DH)。
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ビット単位の素数の長さ (DH)。
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カスタムジェネレータ (DH)。**デフォルト:** `2`。
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman グループ名 (DH)。[`crypto.getDiffieHellman()`](/ja/nodejs/api/crypto#cryptogetdiffiehellmangroupname) を参照してください。
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'named'` または `'explicit'` である必要があります (EC)。**デフォルト:** `'named'`。
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ja/nodejs/api/crypto#keyobjectexportoptions) を参照してください。
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ja/nodejs/api/crypto#keyobjectexportoptions) を参照してください。


- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)


指定された `type` の新しい非対称キーペアを生成します。現在、RSA、RSA-PSS、DSA、EC、Ed25519、Ed448、X25519、X448、および DH がサポートされています。

`publicKeyEncoding` または `privateKeyEncoding` が指定されている場合、この関数は [`keyObject.export()`](/ja/nodejs/api/crypto#keyobjectexportoptions) がその結果に対して呼び出されたかのように動作します。それ以外の場合、キーのそれぞれの部分は [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) として返されます。

長期保存のためには、公開鍵を `'spki'` として、秘密鍵を暗号化された `'pkcs8'` としてエンコードすることをお勧めします。

::: code-group
```js [ESM]
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // エラーを処理し、生成されたキーペアを使用します。
});
```

```js [CJS]
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // エラーを処理し、生成されたキーペアを使用します。
});
```
:::

完了すると、`callback` は `err` が `undefined` に設定され、生成されたキーペアを表す `publicKey` / `privateKey` とともに呼び出されます。

このメソッドが [`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal) されたバージョンとして呼び出される場合、`publicKey` および `privateKey` プロパティを持つ `Object` の `Promise` を返します。


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v16.10.0 | RSA-PSS鍵ペアの`RSASSA-PSS-params`シーケンスパラメータを定義する機能を追加。 |
| v13.9.0, v12.17.0 | Diffie-Hellmanのサポートを追加。 |
| v12.0.0 | RSA-PSS鍵ペアのサポートを追加。 |
| v12.0.0 | X25519およびX448鍵ペアを生成する機能を追加。 |
| v12.0.0 | Ed25519およびEd448鍵ペアを生成する機能を追加。 |
| v11.6.0 | エンコーディングが指定されていない場合、`generateKeyPair`および`generateKeyPairSync`関数はキーオブジェクトを生成するようになりました。 |
| v10.12.0 | 追加: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'`, または `'dh'` である必要があります。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ビット単位の鍵サイズ (RSA、DSA)。
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公開指数 (RSA)。**デフォルト:** `0x10001`。
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) メッセージダイジェストの名前 (RSA-PSS)。
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1で使用されるメッセージダイジェストの名前 (RSA-PSS)。
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) バイト単位の最小ソルト長 (RSA-PSS)。
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ビット単位の `q` のサイズ (DSA)。
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するカーブの名前 (EC)。
    - `prime`: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 素数パラメーター (DH)。
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ビット単位の素数の長さ (DH)。
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カスタムジェネレーター (DH)。**デフォルト:** `2`。
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellmanグループ名 (DH)。 [`crypto.getDiffieHellman()`](/ja/nodejs/api/crypto#cryptogetdiffiehellmangroupname) を参照してください。
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'named'` または `'explicit'` である必要があります (EC)。**デフォルト:** `'named'`。
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ja/nodejs/api/crypto#keyobjectexportoptions) を参照してください。
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`keyObject.export()`](/ja/nodejs/api/crypto#keyobjectexportoptions) を参照してください。
  
 
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)
  
 

指定された`type`の新しい非対称鍵ペアを生成します。 現在、RSA、RSA-PSS、DSA、EC、Ed25519、Ed448、X25519、X448、およびDHがサポートされています。

`publicKeyEncoding`または`privateKeyEncoding`が指定された場合、この関数は結果に対して[`keyObject.export()`](/ja/nodejs/api/crypto#keyobjectexportoptions)が呼び出されたかのように動作します。 それ以外の場合、キーのそれぞれの部分は[`KeyObject`](/ja/nodejs/api/crypto#class-keyobject)として返されます。

公開鍵をエンコードする場合、`'spki'`を使用することをお勧めします。 秘密鍵をエンコードする場合は、強力なパスフレーズを使用して`'pkcs8'`を使用し、パスフレーズを秘密にしておくことをお勧めします。

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```js [CJS]
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```
:::

戻り値 `{ publicKey, privateKey }` は、生成されたキーペアを表します。 PEMエンコーディングが選択されている場合、それぞれのキーは文字列になり、それ以外の場合はDERとしてエンコードされたデータを含むバッファーになります。


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Added in: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 生成される秘密鍵の使用目的。現在受け入れられる値は `'hmac'` および `'aes'` です。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成する鍵のビット長。
    - `type` が `'hmac'` の場合、最小値は 8 で、最大長は 2-1 です。値が 8 の倍数でない場合、生成された鍵は `Math.floor(length / 8)` に切り捨てられます。
    - `type` が `'aes'` の場合、長さは `128`、`192`、または `256` のいずれかである必要があります。
  
 
  
 
- 戻り値: [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)

指定された `length` の新しいランダムな秘密鍵を同期的に生成します。`type` は、`length` に対して実行される検証を決定します。

::: code-group
```js [ESM]
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```js [CJS]
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```
:::

生成された HMAC 鍵のサイズは、基になるハッシュ関数のブロック サイズを超えてはなりません。詳細については、[`crypto.createHmac()`](/ja/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) を参照してください。

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.8.0 | Added in: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成する素数のサイズ（ビット単位）。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`。
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、生成された素数は `bigint` として返されます。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  
 

`size` ビットの疑似乱数素数を生成します。

`options.safe` が `true` の場合、素数は安全な素数になります。つまり、`(prime - 1) / 2` も素数になります。

`options.add` および `options.rem` パラメーターを使用して、Diffie-Hellman など、追加の要件を強制できます。

- `options.add` と `options.rem` の両方が設定されている場合、素数は `prime % add = rem` という条件を満たします。
- `options.add` のみが設定され、`options.safe` が `true` でない場合、素数は `prime % add = 1` という条件を満たします。
- `options.add` のみが設定され、`options.safe` が `true` に設定されている場合、素数は代わりに `prime % add = 3` という条件を満たします。これは、`options.add \> 2` の場合、`prime % add = 1` が `options.safe` によって強制される条件と矛盾するためです。
- `options.add` が指定されていない場合、`options.rem` は無視されます。

`options.add` と `options.rem` の両方が、`ArrayBuffer`、`SharedArrayBuffer`、`TypedArray`、`Buffer`、または `DataView` として指定されている場合、ビッグエンディアンのシーケンスとしてエンコードする必要があります。

デフォルトでは、素数は [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 内のオクテットのビッグエンディアンシーケンスとしてエンコードされます。`bigint` オプションが `true` の場合、[\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) が提供されます。


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Added in: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成する素数のサイズ（ビット単位）。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、生成された素数は`bigint`として返されます。
  
 
- 戻り値: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`size`ビットの擬似乱数素数を生成します。

`options.safe`が`true`の場合、素数は安全な素数になります。つまり、`(prime - 1) / 2`も素数になります。

`options.add`と`options.rem`パラメータを使用すると、Diffie-Hellmanなどの追加要件を強制できます。

- `options.add`と`options.rem`の両方が設定されている場合、素数は`prime % add = rem`という条件を満たします。
- `options.add`のみが設定され、`options.safe`が`true`でない場合、素数は`prime % add = 1`という条件を満たします。
- `options.add`のみが設定され、`options.safe`が`true`に設定されている場合、素数は代わりに`prime % add = 3`という条件を満たします。これは、`options.add > 2`の場合の`prime % add = 1`が`options.safe`によって強制される条件と矛盾するため、必要です。
- `options.add`が指定されていない場合、`options.rem`は無視されます。

`options.add`と`options.rem`は、`ArrayBuffer`、`SharedArrayBuffer`、`TypedArray`、`Buffer`、または`DataView`として指定された場合、ビッグエンディアンシーケンスとしてエンコードする必要があります。

デフォルトでは、素数は[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)内のオクテットのビッグエンディアンシーケンスとしてエンコードされます。 `bigint`オプションが`true`の場合、[\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)が提供されます。


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Added in: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) クエリ対象の暗号の名前または NID。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テスト用の鍵長。
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テスト用の IV 長。
  
 
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 暗号の名前
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 暗号の NID
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 暗号のブロックサイズ（バイト単位）。 `mode` が `'stream'` の場合、このプロパティは省略されます。
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 予想される、またはデフォルトの初期化ベクトルの長さ（バイト単位）。 暗号が初期化ベクトルを使用しない場合、このプロパティは省略されます。
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 予想される、またはデフォルトの鍵長（バイト単位）。
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 暗号モード。 `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'` のいずれか。
  
 

指定された暗号に関する情報を返します。

一部の暗号は可変長の鍵と初期化ベクトルを受け入れます。 デフォルトでは、`crypto.getCipherInfo()` メソッドは、これらの暗号のデフォルト値を返します。 指定された鍵長または IV 長が指定された暗号に対して許容されるかどうかをテストするには、`keyLength` および `ivLength` オプションを使用します。 指定された値が許容できない場合、`undefined` が返されます。


### `crypto.getCiphers()` {#cryptogetciphers}

**追加:** v0.9.3

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サポートされている暗号アルゴリズムの名前の配列。

::: code-group
```js [ESM]
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```js [CJS]
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```
:::

### `crypto.getCurves()` {#cryptogetcurves}

**追加:** v2.3.0

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サポートされている楕円曲線の名前の配列。

::: code-group
```js [ESM]
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```js [CJS]
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```
:::

### `crypto.getDiffieHellman(groupName)` {#cryptogetdiffiehellmangroupname}

**追加:** v0.7.5

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<DiffieHellmanGroup\>](/ja/nodejs/api/crypto#class-diffiehellmangroup)

定義済みの `DiffieHellmanGroup` 鍵交換オブジェクトを作成します。サポートされているグループは、[`DiffieHellmanGroup`](/ja/nodejs/api/crypto#class-diffiehellmangroup) のドキュメントにリストされています。

返されるオブジェクトは、[`crypto.createDiffieHellman()`](/ja/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding) で作成されたオブジェクトのインターフェースを模倣していますが、鍵の変更（たとえば、[`diffieHellman.setPublicKey()`](/ja/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) を使用）は許可されません。このメソッドを使用する利点は、当事者が事前にグループの法を生成したり交換したりする必要がなく、プロセッサと通信時間の両方を節約できることです。

例（共有秘密鍵の取得）:

::: code-group
```js [ESM]
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret と bobSecret は同じであるはずです */
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret と bobSecret は同じであるはずです */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Added in: v10.0.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) FIPS準拠の暗号プロバイダーが現在使用されている場合にのみ`1`、それ以外の場合は`0`を返します。将来のセマンティックバージョンのメジャーリリースでは、このAPIの戻り値の型が[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)に変更される可能性があります。

### `crypto.getHashes()` {#cryptogethashes}

**Added in: v0.9.3**

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サポートされているハッシュアルゴリズムの名前の配列（`'RSA-SHA256'`など）。ハッシュアルゴリズムは「ダイジェスト」アルゴリズムとも呼ばれます。

::: code-group
```js [ESM]
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```js [CJS]
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```
:::

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Added in: v17.4.0**

- `typedArray` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) `typedArray`を返します。

[`crypto.webcrypto.getRandomValues()`](/ja/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray)の便利なエイリアス。この実装はWeb Crypto仕様に準拠していません。Web互換コードを記述するには、代わりに[`crypto.webcrypto.getRandomValues()`](/ja/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray)を使用してください。


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data` が文字列の場合、ハッシュされる前に UTF-8 としてエンコードされます。文字列入力に対して別の入力エンコーディングが必要な場合は、`TextEncoder` または `Buffer.from()` を使用して文字列を `TypedArray` にエンコードし、エンコードされた `TypedArray` をこのAPIに渡すことができます。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  返されるダイジェストのエンコードに使用される [Encoding](/ja/nodejs/api/buffer#buffers-and-character-encodings)。**デフォルト:** `'hex'`。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

データのワンショットハッシュダイジェストを作成するためのユーティリティ。少量のデータ（\<= 5MB）をハッシュする場合で、すぐに利用できる場合は、オブジェクトベースの `crypto.createHash()` よりも高速になる場合があります。データが大きい場合、またはストリーミングされる場合は、代わりに `crypto.createHash()` を使用することをお勧めします。

`algorithm` は、プラットフォーム上の OpenSSL のバージョンでサポートされている利用可能なアルゴリズムに依存します。例としては、`'sha256'`、`'sha512'` などがあります。OpenSSL の最近のリリースでは、`openssl list -digest-algorithms` を実行すると、利用可能なダイジェストアルゴリズムが表示されます。

例：

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// 文字列をハッシュし、結果を16進数エンコードされた文字列として返します。
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// base64エンコードされた文字列をBufferにエンコードし、ハッシュして
// 結果をbufferとして返します。
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// 文字列をハッシュし、結果を16進数エンコードされた文字列として返します。
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// base64エンコードされた文字列をBufferにエンコードし、ハッシュして
// 結果をbufferとして返します。
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v18.8.0, v16.18.0 | 入力キーマテリアルをゼロ長にできるようになりました。 |
| v15.0.0 | Added in: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するダイジェストアルゴリズム。
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) 入力キーマテリアル。必須ですが、ゼロ長にできます。
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ソルト値。必須ですが、ゼロ長にできます。
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 追加のinfo値。必須ですが、ゼロ長にでき、1024バイトを超えることはできません。
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成するキーの長さ。0より大きい必要があります。許容される最大値は、選択されたダイジェスト関数によって生成されるバイト数の`255`倍です（例：`sha512`は64バイトのハッシュを生成するため、最大HKDF出力は16320バイトになります）。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

HKDFは、RFC 5869で定義されている単純な鍵導出関数です。指定された`ikm`、`salt`、および`info`が`digest`とともに使用され、`keylen`バイトの鍵を導出します。

指定された`callback`関数は、`err`と`derivedKey`の2つの引数で呼び出されます。鍵の導出中にエラーが発生した場合、`err`が設定されます。それ以外の場合、`err`は`null`になります。正常に生成された`derivedKey`は、[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)としてコールバックに渡されます。入力引数のいずれかが無効な値または型を指定した場合、エラーがスローされます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```js [CJS]
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```
:::


### `crypto.hkdfSync(digest, ikm, salt, info, keylen)` {#cryptohkdfsyncdigest-ikm-salt-info-keylen}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.8.0, v16.18.0 | 入力キーイングマテリアルをゼロ長にできるようになりました。 |
| v15.0.0 | Added in: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するダイジェストアルゴリズム。
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) 入力キーイングマテリアル。 提供する必要がありますが、ゼロ長にすることができます。
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ソルト値。 提供する必要がありますが、ゼロ長にすることができます。
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 追加の info 値。 提供する必要がありますが、ゼロ長にすることができ、1024 バイトを超えることはできません。
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成するキーの長さ。 0 より大きくなければなりません。 許容される最大値は、選択したダイジェスト関数によって生成されるバイト数の `255` 倍です (例: `sha512` は 64 バイトのハッシュを生成するため、HKDF の最大出力は 16320 バイトになります)。
- 戻り値: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

RFC 5869 で定義されているように、同期 HKDF 鍵導出関数を提供します。 指定された `ikm`、`salt`、および `info` は、`digest` とともに使用され、`keylen` バイトの鍵を導出します。

正常に生成された `derivedKey` は、[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) として返されます。

入力引数のいずれかが無効な値または型を指定した場合、または導出されたキーを生成できない場合は、エラーがスローされます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```js [CJS]
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```
:::


### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` {#cryptopbkdf2password-salt-iterations-keylen-digest-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.0.0 | `password` および `salt` 引数は、ArrayBuffer インスタンスにもできます。 |
| v14.0.0 | `iterations` パラメーターが正の値に制限されました。以前のリリースでは、他の値は 1 として扱われていました。 |
| v8.0.0 | `digest` パラメーターが常に必須になりました。 |
| v6.0.0 | `digest` パラメーターを渡さずにこの関数を呼び出すことは非推奨になり、警告が表示されます。 |
| v6.0.0 | 文字列である場合の `password` のデフォルトのエンコーディングが `binary` から `utf8` に変更されました。 |
| v0.5.5 | 追加: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

非同期の Password-Based Key Derivation Function 2 (PBKDF2) の実装を提供します。`digest` で指定された選択された HMAC ダイジェストアルゴリズムが適用され、`password`、`salt`、および `iterations` から要求されたバイト長 (`keylen`) のキーが導出されます。

指定された `callback` 関数は、`err` および `derivedKey` の 2 つの引数で呼び出されます。キーの導出中にエラーが発生した場合、`err` が設定されます。それ以外の場合、`err` は `null` になります。デフォルトでは、正常に生成された `derivedKey` は [`Buffer`](/ja/nodejs/api/buffer) としてコールバックに渡されます。入力引数のいずれかが無効な値または型を指定すると、エラーがスローされます。

`iterations` 引数は、できるだけ高く設定された数値である必要があります。反復回数が多いほど、派生キーはより安全になりますが、完了するまでに時間がかかります。

`salt` は、できるだけ一意である必要があります。salt はランダムで、少なくとも 16 バイトの長さであることが推奨されます。詳細については、[NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) を参照してください。

`password` または `salt` に文字列を渡す場合は、[暗号 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。

::: code-group
```js [ESM]
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```js [CJS]
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```
:::

サポートされているダイジェスト関数の配列は、[`crypto.getHashes()`](/ja/nodejs/api/crypto#cryptogethashes) を使用して取得できます。

この API は libuv のスレッドプールを使用しますが、一部のアプリケーションではパフォーマンスに驚くほど否定的な影響を与える可能性があります。詳細については、[`UV_THREADPOOL_SIZE`](/ja/nodejs/api/cli#uv_threadpool_sizesize) のドキュメントを参照してください。


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [沿革]
| バージョン | 変更 |
|---|---|
| v14.0.0 | `iterations` パラメーターは正の値に制限されるようになりました。以前のリリースでは、他の値は 1 として扱われていました。 |
| v6.0.0 | `digest` パラメーターを渡さずにこの関数を呼び出すことは推奨されなくなり、警告が表示されるようになりました。 |
| v6.0.0 | 文字列である場合の `password` のデフォルトのエンコーディングが `binary` から `utf8` に変更されました。 |
| v0.9.3 | 追加: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

同期的なパスワードベース鍵導出関数 2（PBKDF2）の実装を提供します。`digest` で指定された選択された HMAC ダイジェストアルゴリズムが適用され、`password`、`salt`、`iterations` から要求されたバイト長 (`keylen`) の鍵を導出します。

エラーが発生した場合、`Error` がスローされます。それ以外の場合、導出された鍵は [`Buffer`](/ja/nodejs/api/buffer) として返されます。

`iterations` 引数は、できるだけ高い数値に設定する必要があります。イテレーションの回数が多いほど、導出された鍵はより安全になりますが、完了するまでに時間がかかります。

`salt` は可能な限り一意である必要があります。salt はランダムで少なくとも 16 バイトの長さであることが推奨されます。詳細については、[NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) を参照してください。

`password` または `salt` に文字列を渡す場合は、[暗号化 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。

::: code-group
```js [ESM]
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```js [CJS]
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```
:::

サポートされているダイジェスト関数の配列は、[`crypto.getHashes()`](/ja/nodejs/api/crypto#cryptogethashes) を使用して取得できます。


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | OpenSSLビルドが暗黙的な拒否をサポートしていない場合、`RSA_PKCS1_PADDING`パディングは無効になりました。 |
| v15.0.0 | 文字列、ArrayBuffer、およびCryptoKeyが許可されるキータイプとして追加されました。oaepLabelはArrayBufferにすることができます。bufferは文字列またはArrayBufferにすることができます。バッファーを受け入れるすべての型は、最大2 ** 31 - 1バイトに制限されます。 |
| v12.11.0 | `oaepLabel`オプションが追加されました。 |
| v12.9.0 | `oaepHash`オプションが追加されました。 |
| v11.6.0 | この関数はキーオブジェクトをサポートするようになりました。 |
| v0.11.14 | Added in: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OAEPパディングおよびMGF1に使用するハッシュ関数。**デフォルト:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) OAEPパディングに使用するラベル。指定しない場合、ラベルは使用されません。
    - `padding` [\<crypto.constants\>](/ja/nodejs/api/crypto#cryptoconstants) `crypto.constants`で定義されたオプションのパディング値。`crypto.constants.RSA_NO_PADDING`、`crypto.constants.RSA_PKCS1_PADDING`、または`crypto.constants.RSA_PKCS1_OAEP_PADDING`のいずれかです。
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 復号化されたコンテンツを含む新しい`Buffer`。

`buffer`を`privateKey`で復号化します。`buffer`は、以前に対応する公開鍵を使用して暗号化されました。たとえば、[`crypto.publicEncrypt()`](/ja/nodejs/api/crypto#cryptopublicencryptkey-buffer)を使用します。

`privateKey`が[`KeyObject`](/ja/nodejs/api/crypto#class-keyobject)でない場合、この関数は`privateKey`が[`crypto.createPrivateKey()`](/ja/nodejs/api/crypto#cryptocreateprivatekeykey)に渡されたかのように動作します。オブジェクトの場合、`padding`プロパティを渡すことができます。それ以外の場合、この関数は`RSA_PKCS1_OAEP_PADDING`を使用します。

[`crypto.privateDecrypt()`](/ja/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer)で`crypto.constants.RSA_PKCS1_PADDING`を使用するには、OpenSSLが暗黙的な拒否(`rsa_pkcs1_implicit_rejection`)をサポートしている必要があります。Node.jsで使用されるOpenSSLのバージョンがこの機能をサポートしていない場合、`RSA_PKCS1_PADDING`を使用しようとすると失敗します。


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | 文字列、ArrayBuffer、および CryptoKey を許可されるキーの型として追加。パスフレーズは ArrayBuffer にすることができます。バッファーは文字列または ArrayBuffer にすることができます。バッファーを受け入れるすべての型は、最大 2 ** 31 - 1 バイトに制限されます。 |
| v11.6.0 | この関数はキーオブジェクトをサポートするようになりました。 |
| v1.1.0 | Added in: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) PEM エンコードされた秘密鍵。
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 秘密鍵のオプションのパスフレーズ。
    - `padding` [\<crypto.constants\>](/ja/nodejs/api/crypto#cryptoconstants) `crypto.constants` で定義されているオプションのパディング値。`crypto.constants.RSA_NO_PADDING` または `crypto.constants.RSA_PKCS1_PADDING` があります。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`、`key`、または `passphrase` が文字列の場合に使用する文字列エンコーディング。
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 暗号化されたコンテンツを含む新しい `Buffer`。

`buffer` を `privateKey` で暗号化します。返されたデータは、対応する公開鍵を使用して復号できます。たとえば、[`crypto.publicDecrypt()`](/ja/nodejs/api/crypto#cryptopublicdecryptkey-buffer) を使用します。

`privateKey` が [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) でない場合、この関数は `privateKey` が [`crypto.createPrivateKey()`](/ja/nodejs/api/crypto#cryptocreateprivatekeykey) に渡されたかのように動作します。オブジェクトの場合、`padding` プロパティを渡すことができます。それ以外の場合、この関数は `RSA_PKCS1_PADDING` を使用します。


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | string、ArrayBuffer、CryptoKey を許容される key タイプとして追加しました。パスフレーズは ArrayBuffer にすることができます。buffer は string または ArrayBuffer にすることができます。buffer を受け入れるすべての型は、最大 2 ** 31 - 1 バイトに制限されます。 |
| v11.6.0 | この関数は key オブジェクトをサポートするようになりました。 |
| v1.1.0 | 追加: v1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 秘密鍵のオプションのパスフレーズ。
    - `padding` [\<crypto.constants\>](/ja/nodejs/api/crypto#cryptoconstants) `crypto.constants` で定義されたオプションのパディング値。`crypto.constants.RSA_NO_PADDING` または `crypto.constants.RSA_PKCS1_PADDING` になります。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`、`key`、または `passphrase` が string の場合に使用する string エンコード。

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 復号化されたコンテンツを含む新しい `Buffer`。

`key` を使用して `buffer` を復号化します。`buffer` は、たとえば [`crypto.privateEncrypt()`](/ja/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer) を使用して、対応する秘密鍵を使用して以前に暗号化されました。

`key` が [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) でない場合、この関数は `key` が [`crypto.createPublicKey()`](/ja/nodejs/api/crypto#cryptocreatepublickeykey) に渡されたかのように動作します。オブジェクトの場合、`padding` プロパティを渡すことができます。それ以外の場合、この関数は `RSA_PKCS1_PADDING` を使用します。

RSA 公開鍵は秘密鍵から派生できるため、公開鍵の代わりに秘密鍵を渡すことができます。


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | string、ArrayBuffer、CryptoKey を許容されるキータイプとして追加しました。oaepLabel と passphrase は ArrayBuffer にできます。buffer は string または ArrayBuffer にできます。buffer を受け入れるすべてのタイプは最大 2 ** 31 - 1 バイトに制限されます。 |
| v12.11.0 | `oaepLabel` オプションが追加されました。 |
| v12.9.0 | `oaepHash` オプションが追加されました。 |
| v11.6.0 | この関数はキーオブジェクトをサポートするようになりました。 |
| v0.11.14 | Added in: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) PEM エンコードされた公開鍵または秘密鍵、[\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)、または[\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)。
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OAEP パディングと MGF1 に使用するハッシュ関数。**デフォルト:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) OAEP パディングに使用するラベル。指定しない場合、ラベルは使用されません。
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 秘密鍵のオプションのパスフレーズ。
    - `padding` [\<crypto.constants\>](/ja/nodejs/api/crypto#cryptoconstants) `crypto.constants` で定義されたオプションのパディング値。`crypto.constants.RSA_NO_PADDING`、`crypto.constants.RSA_PKCS1_PADDING`、または `crypto.constants.RSA_PKCS1_OAEP_PADDING` を指定できます。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `buffer`、`key`、`oaepLabel`、または `passphrase` が文字列の場合に使用する文字列エンコーディング。


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 暗号化されたコンテンツを含む新しい `Buffer`。

`buffer` の内容を `key` で暗号化し、暗号化されたコンテンツを含む新しい [`Buffer`](/ja/nodejs/api/buffer) を返します。返されたデータは、たとえば [`crypto.privateDecrypt()`](/ja/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) を使用して、対応する秘密鍵を使用して復号化できます。

`key` が [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) でない場合、この関数は `key` が [`crypto.createPublicKey()`](/ja/nodejs/api/crypto#cryptocreatepublickeykey) に渡されたかのように動作します。オブジェクトである場合、`padding` プロパティを渡すことができます。それ以外の場合、この関数は `RSA_PKCS1_OAEP_PADDING` を使用します。

RSA 公開鍵は秘密鍵から導出できるため、公開鍵の代わりに秘密鍵を渡すことができます。


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v9.0.0 | `callback` 引数に `null` を渡すと、`ERR_INVALID_CALLBACK` がスローされるようになりました。 |
| v0.5.8 | 追加: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成するバイト数。`size` は `2**31 - 1` より大きくすることはできません。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)


- 戻り値: `callback` 関数が指定されていない場合は、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)。

暗号学的に強い擬似乱数データを生成します。`size` 引数は、生成するバイト数を示す数値です。

`callback` 関数が指定された場合、バイトは非同期的に生成され、`callback` 関数は 2 つの引数 `err` と `buf` で呼び出されます。エラーが発生した場合、`err` は `Error` オブジェクトになります。それ以外の場合は `null` です。`buf` 引数は、生成されたバイトを含む [`Buffer`](/ja/nodejs/api/buffer) です。

::: code-group
```js [ESM]
// 非同期
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} バイトのランダムデータ: ${buf.toString('hex')}`);
});
```

```js [CJS]
// 非同期
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} バイトのランダムデータ: ${buf.toString('hex')}`);
});
```
:::

`callback` 関数が指定されていない場合、ランダムバイトは同期的に生成され、[`Buffer`](/ja/nodejs/api/buffer) として返されます。バイトの生成に問題がある場合は、エラーがスローされます。

::: code-group
```js [ESM]
// 同期
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} バイトのランダムデータ: ${buf.toString('hex')}`);
```

```js [CJS]
// 同期
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} バイトのランダムデータ: ${buf.toString('hex')}`);
```
:::

`crypto.randomBytes()` メソッドは、十分なエントロピーが利用可能になるまで完了しません。通常、これには数ミリ秒以上かかることはありません。ランダムバイトの生成が長時間ブロックされる可能性があるのは、システム全体のエントロピーが低い起動直後のみです。

この API は libuv のスレッドプールを使用しており、一部のアプリケーションでは驚くほどネガティブなパフォーマンス上の影響を与える可能性があります。詳細については、[`UV_THREADPOOL_SIZE`](/ja/nodejs/api/cli#uv_threadpool_sizesize) のドキュメントを参照してください。

`crypto.randomBytes()` の非同期バージョンは、単一のスレッドプールのリクエストで実行されます。スレッドプールのタスク長の変動を最小限に抑えるために、クライアントリクエストの実行の一部として大きな `randomBytes` リクエストを行う場合は、パーティション分割してください。


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v9.0.0 | `buffer` 引数は、任意の `TypedArray` または `DataView` にできます。 |
| v7.10.0, v6.13.0 | 追加: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 必須。 指定された `buffer` のサイズは、`2**31 - 1` を超えてはなりません。
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `buffer.length - offset`. `size` は `2**31 - 1` を超えてはなりません。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

この関数は [`crypto.randomBytes()`](/ja/nodejs/api/crypto#cryptorandombytessize-callback) と似ていますが、最初の引数に、値を設定する [`Buffer`](/ja/nodejs/api/buffer) を指定する必要があります。 また、コールバックを渡す必要もあります。

`callback` 関数が提供されない場合、エラーがスローされます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

任意の `ArrayBuffer`、`TypedArray`、または `DataView` インスタンスを `buffer` として渡すことができます。

これには `Float32Array` と `Float64Array` のインスタンスが含まれますが、この関数はランダムな浮動小数点数を生成するために使用しないでください。 結果には `+Infinity`、`-Infinity`、および `NaN` が含まれる可能性があり、配列に有限数のみが含まれている場合でも、それらは一様ランダム分布から描画されず、意味のある上限または下限はありません。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```
:::

このAPIはlibuvのthreadpoolを使用します。これは、一部のアプリケーションにとって驚くほどネガティブなパフォーマンス上の影響を与える可能性があります。詳細については、[`UV_THREADPOOL_SIZE`](/ja/nodejs/api/cli#uv_threadpool_sizesize)のドキュメントを参照してください。

`crypto.randomFill()` の非同期バージョンは、単一のスレッドプールリクエストで実行されます。 スレッドプールのタスク長の変動を最小限に抑えるために、クライアントリクエストの実行の一部として `randomFill` を大規模に行う場合は、パーティション分割してください。


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | The `buffer` argument may be any `TypedArray` or `DataView`. |
| v7.10.0, v6.13.0 | Added in: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 必須。 提供される `buffer` のサイズは、`2**31 - 1` より大きくすることはできません。
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `buffer.length - offset`。 `size` は `2**31 - 1` より大きくすることはできません。
- 戻り値: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `buffer` 引数として渡されたオブジェクト。

[`crypto.randomFill()`](/ja/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback) の同期版。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

任意の `ArrayBuffer`、`TypedArray`、または `DataView` インスタンスを `buffer` として渡すことができます。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```
:::


### `crypto.randomInt([min, ]max[, callback])` {#cryptorandomintmin-max-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v14.10.0, v12.19.0 | Added in: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ランダム範囲の開始 (包括的)。**デフォルト:** `0`。
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ランダム範囲の終了 (排他的)。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`。

`min \<= n \< max` となるランダムな整数 `n` を返します。 この実装は、[剰余バイアス](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias) を回避します。

範囲 (`max - min`) は 2 未満でなければなりません。 `min` と `max` は [安全な整数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) でなければなりません。

`callback` 関数が指定されていない場合、ランダムな整数は同期的に生成されます。

::: code-group
```js [ESM]
// 非同期
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```

```js [CJS]
// 非同期
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// 同期
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```

```js [CJS]
// 同期
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// `min` 引数あり
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```

```js [CJS]
// `min` 引数あり
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**追加:** v15.6.0, v14.17.0

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) デフォルトでは、パフォーマンスを向上させるために、Node.js は最大 128 個のランダム UUID を生成するのに十分なランダムデータを生成し、キャッシュします。 キャッシュを使用せずに UUID を生成するには、`disableEntropyCache` を `true` に設定します。 **デフォルト:** `false`.


- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ランダムな [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) バージョン 4 UUID を生成します。 UUID は、暗号論的に安全な擬似乱数ジェネレーターを使用して生成されます。

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.0.0 | password と salt 引数は ArrayBuffer インスタンスにすることもできます。 |
| v12.8.0, v10.17.0 | `maxmem` 値は任意の安全な整数にすることができます。 |
| v10.9.0 | `cost`、`blockSize`、および `parallelization` オプション名が追加されました。 |
| v10.5.0 | 追加: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/メモリコストパラメータ。 2 より大きい 2 のべき乗でなければなりません。 **デフォルト:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブロックサイズパラメータ。 **デフォルト:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 並列処理パラメータ。 **デフォルト:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `cost` のエイリアス。 両方のうち 1 つだけを指定できます。
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `blockSize` のエイリアス。 両方のうち 1 つだけを指定できます。
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `parallelization` のエイリアス。 両方のうち 1 つだけを指定できます。
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メモリ上限。 (およそ) `128 * N * r \> maxmem` の場合、エラーになります。 **デフォルト:** `32 * 1024 * 1024`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)



非同期の [scrypt](https://en.wikipedia.org/wiki/Scrypt) 実装を提供します。 Scrypt はパスワードベースの鍵導出関数であり、ブルートフォース攻撃を無意味にするために、計算とメモリの両面でコストがかかるように設計されています。

`salt` は可能な限り一意である必要があります。 salt はランダムで少なくとも 16 バイトの長さであることが推奨されます。 詳細は [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) を参照してください。

`password` または `salt` に文字列を渡す場合は、[暗号 API への入力として文字列を使用する場合の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。

`callback` 関数は、`err` と `derivedKey` の 2 つの引数で呼び出されます。 `err` はキー導出が失敗した場合の例外オブジェクトであり、そうでない場合は `err` は `null` です。 `derivedKey` は [`Buffer`](/ja/nodejs/api/buffer) としてコールバックに渡されます。

入力引数のいずれかが無効な値または型を指定すると、例外がスローされます。



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// ファクトリのデフォルトを使用します。
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// カスタム N パラメータを使用します。 2 のべき乗でなければなりません。
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// ファクトリのデフォルトを使用します。
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// カスタム N パラメータを使用します。 2 のべき乗でなければなりません。
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::

### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v12.8.0, v10.17.0 | `maxmem` の値は安全な整数であればどのような値でも指定できるようになりました。 |
| v10.9.0 | `cost`, `blockSize`, および `parallelization` オプション名が追加されました。 |
| v10.5.0 | Added in: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/メモリのコストパラメータ。2より大きい2の累乗でなければなりません。**デフォルト:** `16384`。
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブロックサイズのパラメータ。**デフォルト:** `8`。
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 並列化のパラメータ。**デフォルト:** `1`。
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `cost` のエイリアス。どちらか一方のみ指定できます。
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `blockSize` のエイリアス。どちらか一方のみ指定できます。
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `parallelization` のエイリアス。どちらか一方のみ指定できます。
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メモリの上限。 (おおよそ) `128 * N * r \> maxmem` の場合、エラーになります。 **デフォルト:** `32 * 1024 * 1024`。

- Returns: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

同期的な [scrypt](https://en.wikipedia.org/wiki/Scrypt) 実装を提供します。 Scrypt は、総当たり攻撃を無意味にするために、計算量とメモリ消費量が大きく設計された、パスワードベースの鍵導出関数です。

`salt` は可能な限り一意である必要があります。 salt はランダムで少なくとも 16 バイトの長さであることが推奨されます。 詳細は [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) を参照してください。

`password` または `salt` に文字列を渡す場合は、[暗号 API への入力として文字列を使用する際の注意点](/ja/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis) を考慮してください。

鍵の導出に失敗した場合は例外がスローされ、そうでない場合は導出された鍵が [`Buffer`](/ja/nodejs/api/buffer) として返されます。

入力引数のいずれかが無効な値または型を指定した場合、例外がスローされます。

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Added in: v15.6.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `--secure-heap=n` コマンドラインフラグを使って指定された、割り当てられたセキュアヒープの合計サイズ。
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `--secure-heap-min` コマンドラインフラグを使って指定された、セキュアヒープからの最小割り当て。
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) セキュアヒープから現在割り当てられているバイトの合計数。
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 割り当てられたバイトの `total` に対する `used` の計算された比率。

### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | OpenSSL 3 におけるカスタムエンジンのサポートは非推奨です。 |
| v0.11.11 | Added in: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/ja/nodejs/api/crypto#cryptoconstants) **デフォルト:** `crypto.constants.ENGINE_METHOD_ALL`

OpenSSL関数の一部またはすべて（フラグで選択）に対して`engine`をロードして設定します。 OpenSSLのカスタムエンジンのサポートは、OpenSSL 3以降では非推奨になりました。

`engine`は、IDまたはエンジンの共有ライブラリへのパスのいずれかです。

オプションの`flags`引数は、デフォルトで`ENGINE_METHOD_ALL`を使用します。 `flags`は、次のフラグ（`crypto.constants`で定義）の1つまたは組み合わせを取得するビットフィールドです。

- `crypto.constants.ENGINE_METHOD_RSA`
- `crypto.constants.ENGINE_METHOD_DSA`
- `crypto.constants.ENGINE_METHOD_DH`
- `crypto.constants.ENGINE_METHOD_RAND`
- `crypto.constants.ENGINE_METHOD_EC`
- `crypto.constants.ENGINE_METHOD_CIPHERS`
- `crypto.constants.ENGINE_METHOD_DIGESTS`
- `crypto.constants.ENGINE_METHOD_PKEY_METHS`
- `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
- `crypto.constants.ENGINE_METHOD_ALL`
- `crypto.constants.ENGINE_METHOD_NONE`


### `crypto.setFips(bool)` {#cryptosetfipsbool}

**Added in: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` を指定すると FIPS モードを有効にします。

FIPS が有効な Node.js ビルドで、FIPS 準拠の crypto プロバイダーを有効にします。FIPS モードが利用できない場合はエラーをスローします。

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` をスローするようになりました。 |
| v15.12.0 | オプションのコールバック引数が追加されました。 |
| v13.2.0, v12.16.0 | この関数は、IEEE-P1363 DSA および ECDSA 署名をサポートするようになりました。 |
| v12.0.0 | Added in: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
  
 
- 戻り値: `callback` 関数が提供されていない場合は [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

指定された秘密鍵とアルゴリズムを使用して、`data` の署名を計算して返します。`algorithm` が `null` または `undefined` の場合、アルゴリズムは鍵の種類に依存します (特に Ed25519 および Ed448)。

`key` が [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) でない場合、この関数は `key` が [`crypto.createPrivateKey()`](/ja/nodejs/api/crypto#cryptocreateprivatekeykey) に渡されたかのように動作します。オブジェクトの場合、次の追加のプロパティを渡すことができます。

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSA および ECDSA の場合、このオプションは生成された署名の形式を指定します。次のいずれかを指定できます。 
    - `'der'` (デフォルト): DER エンコードされた ASN.1 署名構造のエンコード `(r, s)`。
    - `'ieee-p1363'`: IEEE-P1363 で提案されている署名形式 `r || s`。
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA のオプションのパディング値。次のいずれかです。 
    - `crypto.constants.RSA_PKCS1_PADDING` (デフォルト)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` は、[RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) のセクション 3.1 で指定されているように、メッセージの署名に使用されるのと同じハッシュ関数で MGF1 を使用します。 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) パディングが `RSA_PKCS1_PSS_PADDING` の場合のソルト長。特殊な値 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` はソルト長をダイジェストサイズに設定し、`crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (デフォルト) はソルト長を許容される最大値に設定します。 

`callback` 関数が指定されている場合、この関数は libuv のスレッドプールを使用します。


### `crypto.subtle` {#cryptosubtle}

**Added in: v17.4.0**

- Type: [\<SubtleCrypto\>](/ja/nodejs/api/webcrypto#class-subtlecrypto)

[`crypto.webcrypto.subtle`](/ja/nodejs/api/webcrypto#class-subtlecrypto) の便利なエイリアスです。

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | `a` と `b` 引数は ArrayBuffer でも可能です。 |
| v6.6.0 | Added in: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

この関数は、与えられた `ArrayBuffer`、`TypedArray`、または `DataView` インスタンスを表す基礎となるバイトを、一定時間アルゴリズムを使用して比較します。

この関数は、攻撃者が値を推測できるタイミング情報をリークしません。 これは、HMACダイジェストまたは認証クッキーや[ケイパビリティURL](https://www.w3.org/TR/capability-urls/)のような秘密値を比較するのに適しています。

`a` と `b` は、どちらも `Buffer`、`TypedArray`、または `DataView` でなければならず、それらは同じバイト長を持たなければなりません。 `a` と `b` のバイト長が異なる場合は、エラーがスローされます。

`a` と `b` の少なくとも一方が、`Uint16Array` のようにエントリあたり複数のバイトを持つ `TypedArray` である場合、結果はプラットフォームのバイト順を使用して計算されます。

**両方の入力が <code>Float32Array</code> または
<code>Float64Array</code> の場合、この関数は浮動小数点数の IEEE 754 エンコードにより、予期しない結果を返す可能性があります。 特に、<code>x === y</code> も <code>Object.is(x, y)</code> も、2つの浮動小数点数 <code>x</code> と <code>y</code> のバイト表現が等しいことを意味しません。**

`crypto.timingSafeEqual` を使用しても、*周辺の*コードがタイミングセーフであることは保証されません。 周辺のコードがタイミングの脆弱性を導入しないように注意する必要があります。


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.12.0 | オプションのコールバック引数が追加されました。 |
| v15.0.0 | data、key、および signature 引数は ArrayBuffer でも使用できるようになりました。 |
| v13.2.0, v12.16.0 | この関数は、IEEE-P1363 DSA および ECDSA 署名をサポートするようになりました。 |
| v12.0.0 | 追加: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `callback` 関数が提供されていない場合、データと公開鍵の署名の有効性に応じて `true` または `false`。

指定された鍵とアルゴリズムを使用して、`data` の指定された署名を検証します。 `algorithm` が `null` または `undefined` の場合、アルゴリズムは鍵のタイプに依存します (特に Ed25519 および Ed448)。

`key` が [`KeyObject`](/ja/nodejs/api/crypto#class-keyobject) でない場合、この関数は、`key` が [`crypto.createPublicKey()`](/ja/nodejs/api/crypto#cryptocreatepublickeykey) に渡されたかのように動作します。 オブジェクトの場合、次の追加プロパティを渡すことができます。

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) DSA および ECDSA の場合、このオプションは署名の形式を指定します。 次のいずれかになります。
    - `'der'` (デフォルト): DER エンコードされた ASN.1 署名構造体で `(r, s)` をエンコードします。
    - `'ieee-p1363'`: IEEE-P1363 で提案されている署名形式 `r || s`。

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA のオプションのパディング値。次のいずれかです。
    - `crypto.constants.RSA_PKCS1_PADDING` (デフォルト)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` は、[RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) のセクション 3.1 で指定されているように、メッセージの署名に使用されるのと同じハッシュ関数を使用して MGF1 を使用します。
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) パディングが `RSA_PKCS1_PSS_PADDING` の場合のソルト長。 特別な値 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` はソルト長をダイジェスト サイズに設定し、`crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (デフォルト) はソルト長を許容される最大値に設定します。

`signature` 引数は、`data` に対して以前に計算された署名です。

公開鍵は秘密鍵から導出できるため、秘密鍵または公開鍵を `key` に渡すことができます。

`callback` 関数が提供されている場合、この関数は libuv のスレッドプールを使用します。


### `crypto.webcrypto` {#cryptowebcrypto}

**Added in: v15.0.0**

Type: [\<Crypto\>](/ja/nodejs/api/webcrypto#class-crypto) Web Crypto API標準の実装。

詳細は[Web Crypto APIドキュメント](/ja/nodejs/api/webcrypto)を参照してください。

## 注記 {#notes}

### 暗号APIへの入力として文字列を使用する {#using-strings-as-inputs-to-cryptographic-apis}

歴史的な理由から、Node.jsによって提供される多くの暗号APIは、基盤となる暗号アルゴリズムがバイトシーケンスで動作する場合に、文字列を入力として受け入れます。これらのインスタンスには、平文、暗号文、対称鍵、初期化ベクトル、パスフレーズ、ソルト、認証タグ、および追加の認証データが含まれます。

文字列を暗号APIに渡す場合は、次の要素を考慮してください。

- すべてのバイトシーケンスが有効なUTF-8文字列であるとは限りません。したがって、長さ`n`のバイトシーケンスが文字列から派生した場合、そのエントロピーは通常、ランダムまたは擬似ランダムな`n`バイトシーケンスのエントロピーよりも低くなります。たとえば、UTF-8文字列では、バイトシーケンス`c0 af`は生成されません。秘密鍵は、ほぼ排他的にランダムまたは擬似ランダムなバイトシーケンスである必要があります。
- 同様に、ランダムまたは擬似ランダムなバイトシーケンスをUTF-8文字列に変換する場合、有効なコードポイントを表さないサブシーケンスは、Unicode置換文字（`U+FFFD`）に置き換えられる場合があります。したがって、結果として得られるUnicode文字列のバイト表現は、文字列の作成元のバイトシーケンスと等しくない場合があります。暗号、ハッシュ関数、署名アルゴリズム、および鍵導出関数の出力は、擬似ランダムなバイトシーケンスであり、Unicode文字列として使用しないでください。
- 文字列がユーザー入力から取得された場合、一部のUnicode文字は、異なるバイトシーケンスをもたらす複数の同等の方法で表現できます。たとえば、ユーザーのパスフレーズをPBKDF2やscryptなどの鍵導出関数に渡す場合、鍵導出関数の結果は、文字列が合成文字を使用しているか、分解文字を使用しているかによって異なります。Node.jsは文字表現を正規化しません。開発者は、ユーザー入力を暗号APIに渡す前に、[`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)を使用することを検討する必要があります。


### レガシーストリームAPI (Node.js 0.10以前) {#legacy-streams-api-prior-to-nodejs-010}

Cryptoモジュールは、統一されたStream APIの概念がなく、バイナリデータを扱う[`Buffer`](/ja/nodejs/api/buffer)オブジェクトがないNode.jsに追加されました。そのため、多くの`crypto`クラスには、[streams](/ja/nodejs/api/stream) APIを実装する他のNode.jsクラスには通常見られないメソッド（例：`update()`, `final()`, `digest()`）があります。また、多くのメソッドは、デフォルトで`Buffer`ではなく`'latin1'`エンコードされた文字列を受け取り、返しました。このデフォルトはNode.js v0.8以降で変更され、デフォルトで[`Buffer`](/ja/nodejs/api/buffer)オブジェクトを使用するようになりました。

### 脆弱または侵害されたアルゴリズムのサポート {#support-for-weak-or-compromised-algorithms}

`node:crypto`モジュールは、すでに侵害されており、使用が推奨されないアルゴリズムをまだいくつかサポートしています。また、APIでは、安全に使用するには弱すぎる小さな鍵サイズの暗号とハッシュを使用できます。

ユーザーは、セキュリティ要件に応じて暗号アルゴリズムと鍵サイズを選択する責任を完全に負う必要があります。

[NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf)の推奨事項に基づきます。

- MD5とSHA-1は、デジタル署名など、衝突耐性が要求される場所では使用できなくなりました。
- RSA、DSA、DHアルゴリズムで使用される鍵は、少なくとも2048ビット、ECDSAとECDHの曲線は、安全に長年使用するためには少なくとも224ビットであることが推奨されます。
- `modp1`、`modp2`、`modp5`のDHグループは、鍵サイズが2048ビット未満であり、推奨されません。

他の推奨事項と詳細については、リファレンスを参照してください。

既知の脆弱性があり、実際にはほとんど関係のない一部のアルゴリズムは、デフォルトでは有効になっていない[レガシプロバイダー](/ja/nodejs/api/cli#--openssl-legacy-provider)を通じてのみ利用できます。

### CCMモード {#ccm-mode}

CCMは、サポートされている[AEADアルゴリズム](https://en.wikipedia.org/wiki/Authenticated_encryption)の1つです。このモードを使用するアプリケーションは、暗号APIを使用する際に特定の制限に従う必要があります。

- 認証タグの長さは、`authTagLength`オプションを設定して暗号作成時に指定する必要があり、4、6、8、10、12、14、または16バイトのいずれかである必要があります。
- 初期化ベクトルの長さ（nonce）`N`は、7〜13バイトの間である必要があります（`7 ≤ N ≤ 13`）。
- プレーンテキストの長さは、`2 ** (8 * (15 - N))`バイトに制限されています。
- 復号化する場合、`update()`を呼び出す前に`setAuthTag()`を使用して認証タグを設定する必要があります。そうしないと、復号化は失敗し、[RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt)のセクション2.6に準拠して`final()`がエラーをスローします。
- CCMモードで`write(data)`、`end(data)`、`pipe()`などのストリームメソッドを使用すると、CCMがインスタンスあたり複数のデータのチャンクを処理できないため、失敗する可能性があります。
- 追加の認証データ（AAD）を渡す場合、実際のメッセージの長さをバイト単位で`plaintextLength`オプションを介して`setAAD()`に渡す必要があります。多くの暗号ライブラリは、認証タグを暗号テキストに含めています。つまり、`plaintextLength + authTagLength`の長さの暗号テキストを生成します。Node.jsは認証タグを含めないため、暗号テキストの長さは常に`plaintextLength`です。AADを使用しない場合、これは必要ありません。
- CCMはメッセージ全体を一度に処理するため、`update()`は正確に1回呼び出す必要があります。
- `update()`を呼び出すだけでメッセージを暗号化/復号化できますが、アプリケーションは認証タグを計算または検証するために*必ず*`final()`を呼び出す必要があります。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```js [CJS]
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```
:::


### FIPS モード {#fips-mode}

OpenSSL 3 を使用する場合、Node.js は、[OpenSSL 3 の FIPS プロバイダー](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider)などの適切な OpenSSL 3 プロバイダーと共に使用すると、FIPS 140-2 をサポートします。このプロバイダーは、[OpenSSL の FIPS README ファイル](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md)の手順に従ってインストールできます。

Node.js で FIPS をサポートするには、以下が必要です。

- 正しくインストールされた OpenSSL 3 FIPS プロバイダー。
- OpenSSL 3 [FIPS モジュール構成ファイル](https://www.openssl.org/docs/man3.0/man5/fips_config)。
- FIPS モジュール構成ファイルを参照する OpenSSL 3 構成ファイル。

Node.js は、FIPS プロバイダーを指す OpenSSL 構成ファイルで構成する必要があります。構成ファイルの例を以下に示します。

```text [TEXT]
nodejs_conf = nodejs_init

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# fips セクション名は、 {#the-fips-section-name-should-match-the-section-name-inside-the}
# 含まれている fipsmodule.cnf 内のセクション名と一致する必要があります。
fips = fips_sect

[default_sect]
activate = 1
```
ここで、`fipsmodule.cnf` は、FIPS プロバイダーのインストール手順で生成された FIPS モジュール構成ファイルです。

```bash [BASH]
openssl fipsinstall
```
`OPENSSL_CONF` 環境変数を構成ファイルを指すように設定し、`OPENSSL_MODULES` を FIPS プロバイダーの動的ライブラリの場所を指すように設定します。例:

```bash [BASH]
export OPENSSL_CONF=/<path to configuration file>/nodejs.cnf
export OPENSSL_MODULES=/<path to openssl lib>/ossl-modules
```
FIPS モードは、次のいずれかの方法で Node.js で有効にできます。

- `--enable-fips` または `--force-fips` コマンドラインフラグを指定して Node.js を起動する。
- プログラムで `crypto.setFips(true)` を呼び出す。

必要に応じて、OpenSSL 構成ファイルを介して Node.js で FIPS モードを有効にできます。例:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# fips セクション名は、 {#included-fipsmodulecnf}
# 含まれている fipsmodule.cnf 内のセクション名と一致する必要があります。
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Crypto 定数 {#the-fips-section-name-should-match-the-section-name-inside-the_1}

`crypto.constants` によってエクスポートされる以下の定数は、`node:crypto`、`node:tls`、および `node:https` モジュールのさまざまな用途に適用され、一般的に OpenSSL に固有のものです。

### OpenSSL オプション {#included-fipsmodulecnf_1}

詳細については、[SSL OP フラグのリスト](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options)を参照してください。

| 定数 | 説明 |
| --- | --- |
| `SSL_OP_ALL` | OpenSSL 内の複数のバグの回避策を適用します。詳細については、[https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options) を参照してください。 |
| `SSL_OP_ALLOW_NO_DHE_KEX` | OpenSSL に TLS v1.3 の非 [EC]DHE ベースの鍵交換モードを許可するように指示します。 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | OpenSSL と未修正のクライアントまたはサーバー間のレガシーの安全でない再ネゴシエーションを許可します。 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html) を参照してください。 |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | 暗号を選択する際に、クライアントの設定ではなくサーバーの設定を使用しようとします。動作はプロトコルバージョンによって異なります。 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html) を参照してください。 |
| `SSL_OP_CISCO_ANYCONNECT` | OpenSSL に Cisco の DTLS_BAD_VER のバージョン識別子を使用するように指示します。 |
| `SSL_OP_COOKIE_EXCHANGE` | OpenSSL に Cookie Exchange をオンにするように指示します。 |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | OpenSSL に cryptopro ドラフトの初期バージョンから server-hello 拡張機能を追加するように指示します。 |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | OpenSSL に OpenSSL 0.9.6d で追加された SSL 3.0/TLS 1.0 の脆弱性の回避策を無効にするように指示します。 |
| `SSL_OP_LEGACY_SERVER_CONNECT` | RI をサポートしていないサーバーへの初期接続を許可します。 |
| `SSL_OP_NO_COMPRESSION` | OpenSSL に SSL/TLS 圧縮のサポートを無効にするように指示します。 |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | OpenSSL に encrypt-then-MAC を無効にするように指示します。 |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | OpenSSL に再ネゴシエーションを無効にするように指示します。 |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | OpenSSL に再ネゴシエーションを実行するときは常に新しいセッションを開始するように指示します。 |
| `SSL_OP_NO_SSLv2` | OpenSSL に SSL v2 をオフにするように指示します。 |
| `SSL_OP_NO_SSLv3` | OpenSSL に SSL v3 をオフにするように指示します。 |
| `SSL_OP_NO_TICKET` | OpenSSL に RFC4507bis チケットの使用を無効にするように指示します。 |
| `SSL_OP_NO_TLSv1` | OpenSSL に TLS v1 をオフにするように指示します。 |
| `SSL_OP_NO_TLSv1_1` | OpenSSL に TLS v1.1 をオフにするように指示します。 |
| `SSL_OP_NO_TLSv1_2` | OpenSSL に TLS v1.2 をオフにするように指示します。 |
| `SSL_OP_NO_TLSv1_3` | OpenSSL に TLS v1.3 をオフにするように指示します。 |
| `SSL_OP_PRIORITIZE_CHACHA` | クライアントが ChaCha20-Poly1305 を行う場合、OpenSSL サーバーに ChaCha20-Poly1305 を優先するように指示します。 `SSL_OP_CIPHER_SERVER_PREFERENCE` が有効になっていない場合、このオプションは効果がありません。 |
| `SSL_OP_TLS_ROLLBACK_BUG` | OpenSSL にバージョンロールバック攻撃の検出を無効にするように指示します。 |

### OpenSSL エンジン定数 {#crypto-constants}

| 定数 | 説明 |
| --- | --- |
| `ENGINE_METHOD_RSA` | エンジンの使用を RSA に制限 |
| `ENGINE_METHOD_DSA` | エンジンの使用を DSA に制限 |
| `ENGINE_METHOD_DH` | エンジンの使用を DH に制限 |
| `ENGINE_METHOD_RAND` | エンジンの使用を RAND に制限 |
| `ENGINE_METHOD_EC` | エンジンの使用を EC に制限 |
| `ENGINE_METHOD_CIPHERS` | エンジンの使用を CIPHERS に制限 |
| `ENGINE_METHOD_DIGESTS` | エンジンの使用を DIGESTS に制限 |
| `ENGINE_METHOD_PKEY_METHS` | エンジンの使用を PKEY_METHS に制限 |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | エンジンの使用を PKEY_ASN1_METHS に制限 |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### その他の OpenSSL 定数 {#openssl-options}

| 定数 | 説明 |
| --- | --- |
| `DH_CHECK_P_NOT_SAFE_PRIME` ||
| `DH_CHECK_P_NOT_PRIME` ||
| `DH_UNABLE_TO_CHECK_GENERATOR` ||
| `DH_NOT_SUITABLE_GENERATOR` ||
| `RSA_PKCS1_PADDING` ||
| `RSA_SSLV23_PADDING` ||
| `RSA_NO_PADDING` ||
| `RSA_PKCS1_OAEP_PADDING` ||
| `RSA_X931_PADDING` ||
| `RSA_PKCS1_PSS_PADDING` ||
| `RSA_PSS_SALTLEN_DIGEST` | 署名または検証時に、`RSA_PKCS1_PSS_PADDING` のソルト長をダイジェストサイズに設定します。 |
| `RSA_PSS_SALTLEN_MAX_SIGN` | データに署名するときに、`RSA_PKCS1_PSS_PADDING` のソルト長を許容される最大値に設定します。 |
| `RSA_PSS_SALTLEN_AUTO` | 署名を検証するときに、`RSA_PKCS1_PSS_PADDING` のソルト長を自動的に決定するようにします。 |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Node.js crypto 定数 {#openssl-engine-constants}

| 定数 | 説明 |
| --- | --- |
| `defaultCoreCipherList` | Node.js によって使用される組み込みのデフォルト暗号リストを指定します。 |
| `defaultCipherList` | 現在の Node.js プロセスで使用されるアクティブなデフォルト暗号リストを指定します。 |

