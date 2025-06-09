---
title: Node.js 文档 - 加密
description: Node.js 的 Crypto 模块提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名和验证函数的封装。它支持多种加密算法、密钥派生和数字签名，使开发者能够在 Node.js 应用程序中保护数据和通信。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 加密 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的 Crypto 模块提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名和验证函数的封装。它支持多种加密算法、密钥派生和数字签名，使开发者能够在 Node.js 应用程序中保护数据和通信。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 加密 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的 Crypto 模块提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名和验证函数的封装。它支持多种加密算法、密钥派生和数字签名，使开发者能够在 Node.js 应用程序中保护数据和通信。
---


# Crypto {#crypto}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

`node:crypto` 模块提供加密功能，其中包括 OpenSSL 的哈希、HMAC、密码、解密、签名和验证函数的一组包装器。

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

## 确定是否无法使用 crypto 支持 {#determining-if-crypto-support-is-unavailable}

Node.js 可能在构建时未包含对 `node:crypto` 模块的支持。 在这种情况下，尝试从 `crypto` 进行 `import` 或调用 `require('node:crypto')` 将导致抛出错误。

使用 CommonJS 时，可以使用 try/catch 捕获抛出的错误：

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
使用词法 ESM `import` 关键字时，只有在 *尝试* 加载模块之前注册了 `process.on('uncaughtException')` 的处理程序（例如，使用预加载模块）时，才能捕获该错误。

使用 ESM 时，如果代码有可能在未启用 crypto 支持的 Node.js 版本上运行，请考虑使用 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 函数而不是词法 `import` 关键字：

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## 类: `Certificate` {#class-certificate}

**添加于: v0.11.8**

SPKAC 是一种证书签名请求机制，最初由 Netscape 实现，并被正式指定为 HTML5 `keygen` 元素的一部分。

`\<keygen\>` 自 [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) 以来已被弃用，新项目不应再使用此元素。

`node:crypto` 模块提供了 `Certificate` 类来处理 SPKAC 数据。最常见的用法是处理 HTML5 `\<keygen\>` 元素生成的输出。Node.js 内部使用 [OpenSSL 的 SPKAC 实现](https://www.openssl.org/docs/man3.0/man1/openssl-spkac)。

### 静态方法: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `spkac` 参数可以是 ArrayBuffer。限制 `spkac` 参数的大小，最大为 2**31 - 1 字节。 |
| v9.0.0 | 添加于: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `spkac` 数据结构的 challenge 组件，其中包括一个公钥和一个 challenge。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```
:::


### 静态方法：`Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `spkac` 参数可以是 ArrayBuffer。限制了 `spkac` 参数的大小，最大为 2**31 - 1 字节。 |
| v9.0.0 | 添加于: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `spkac` 数据结构的公钥组件，其中包含公钥和质询。

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// 打印：公钥，格式为 <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// 打印：公钥，格式为 <Buffer ...>
```
:::

### 静态方法：`Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `spkac` 参数可以是 ArrayBuffer。添加了 encoding。限制了 `spkac` 参数的大小，最大为 2**31 - 1 字节。 |
| v9.0.0 | 添加于: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果给定的 `spkac` 数据结构有效，则为 `true`，否则为 `false`。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// 打印：true 或 false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// 打印：true 或 false
```
:::


### 遗留 API {#legacy-api}

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

作为一个遗留接口，可以创建 `crypto.Certificate` 类的新实例，如下面的例子所示。

#### `new crypto.Certificate()` {#new-cryptocertificate}

`Certificate` 类的实例可以使用 `new` 关键字创建，也可以通过将 `crypto.Certificate()` 作为函数调用来创建：

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

**加入于: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `spkac` 数据结构的 challenge 组件，包括一个公钥和一个 challenge。

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

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) `spkac` 数据结构的公钥组件，包括公钥和一个挑战。

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

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `spkac` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果给定的 `spkac` 数据结构有效，则为 `true`，否则为 `false`。

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


## 类：`Cipher` {#class-cipher}

**添加于: v0.1.94**

- 继承自: [\<stream.Transform\>](/zh/nodejs/api/stream#class-streamtransform)

`Cipher` 类的实例用于加密数据。该类可以通过两种方式使用：

- 作为可读写的 [流](/zh/nodejs/api/stream)，其中写入未加密的明文数据，以在可读端生成加密数据，或者
- 使用 [`cipher.update()`](/zh/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) 和 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding) 方法生成加密数据。

[`crypto.createCipheriv()`](/zh/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) 方法用于创建 `Cipher` 实例。 不得使用 `new` 关键字直接创建 `Cipher` 对象。

示例：将 `Cipher` 对象用作流：

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// 首先，我们将生成密钥。 密钥长度取决于算法。
// 在 aes192 的情况下，它是 24 字节（192 位）。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 然后，我们将生成一个随机初始化向量
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // 一旦我们有了密钥和 iv，我们就可以创建和使用密码...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
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
const password = 'Password used to generate key';

// 首先，我们将生成密钥。 密钥长度取决于算法。
// 在 aes192 的情况下，它是 24 字节（192 位）。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 然后，我们将生成一个随机初始化向量
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // 一旦我们有了密钥和 iv，我们就可以创建和使用密码...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```
:::

示例：使用 `Cipher` 和管道流：

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
const password = 'Password used to generate key';

// 首先，我们将生成密钥。 密钥长度取决于算法。
// 在 aes192 的情况下，它是 24 字节（192 位）。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 然后，我们将生成一个随机初始化向量
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
const password = 'Password used to generate key';

// 首先，我们将生成密钥。 密钥长度取决于算法。
// 在 aes192 的情况下，它是 24 字节（192 位）。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 然后，我们将生成一个随机初始化向量
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

示例：使用 [`cipher.update()`](/zh/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) 和 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding) 方法：

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// 首先，我们将生成密钥。 密钥长度取决于算法。
// 在 aes192 的情况下，它是 24 字节（192 位）。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 然后，我们将生成一个随机初始化向量
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
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
const password = 'Password used to generate key';

// 首先，我们将生成密钥。 密钥长度取决于算法。
// 在 aes192 的情况下，它是 24 字节（192 位）。
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // 然后，我们将生成一个随机初始化向量
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**Added in: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 任何剩余的加密内容。 如果指定了 `outputEncoding`，则返回一个字符串。 如果没有提供 `outputEncoding`，则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

一旦调用了 `cipher.final()` 方法，`Cipher` 对象将不能再用于加密数据。 尝试多次调用 `cipher.final()` 将导致抛出错误。

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Added in: v1.0.0**

- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 当使用经过身份验证的加密模式（目前支持 `GCM`、`CCM`、`OCB` 和 `chacha20-poly1305`）时，`cipher.getAuthTag()` 方法返回一个包含从给定数据计算出的*认证标签*的 [`Buffer`](/zh/nodejs/api/buffer)。

`cipher.getAuthTag()` 方法应该只在使用 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding) 方法完成加密后调用。

如果在 `cipher` 实例创建期间设置了 `authTagLength` 选项，则此函数将精确返回 `authTagLength` 个字节。

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Added in: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/zh/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `buffer` 是一个字符串时要使用的字符串编码。


- 返回: [\<Cipher\>](/zh/nodejs/api/crypto#class-cipher) 用于方法链的同一个 `Cipher` 实例。

当使用经过身份验证的加密模式（目前支持 `GCM`、`CCM`、`OCB` 和 `chacha20-poly1305`）时，`cipher.setAAD()` 方法设置用于*附加认证数据*（AAD）输入参数的值。

`plaintextLength` 选项对于 `GCM` 和 `OCB` 是可选的。 当使用 `CCM` 时，必须指定 `plaintextLength` 选项，并且其值必须与明文的字节长度匹配。 参见 [CCM 模式](/zh/nodejs/api/crypto#ccm-mode)。

`cipher.setAAD()` 方法必须在 [`cipher.update()`](/zh/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) 之前调用。


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Added in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `true`
- 返回值: [\<Cipher\>](/zh/nodejs/api/crypto#class-cipher) 用于方法链的同一个 `Cipher` 实例。

当使用块加密算法时，`Cipher` 类将自动向输入数据添加填充，使其达到合适的块大小。 要禁用默认填充，请调用 `cipher.setAutoPadding(false)`。

当 `autoPadding` 为 `false` 时，整个输入数据的长度必须是密码块大小的倍数，否则 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding) 将抛出错误。 禁用自动填充对于非标准填充很有用，例如使用 `0x0` 代替 PKCS 填充。

`cipher.setAutoPadding()` 方法必须在 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding) 之前调用。

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 默认的 `inputEncoding` 从 `binary` 更改为 `utf8`。 |
| v0.1.94 | 添加于: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 数据的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回值: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

用 `data` 更新密码。 如果给出了 `inputEncoding` 参数，则 `data` 参数是一个使用指定编码的字符串。 如果没有给出 `inputEncoding` 参数，则 `data` 必须是一个 [`Buffer`](/zh/nodejs/api/buffer)，`TypedArray` 或 `DataView`。 如果 `data` 是一个 [`Buffer`](/zh/nodejs/api/buffer)，`TypedArray` 或 `DataView`，则忽略 `inputEncoding`。

`outputEncoding` 指定了加密数据的输出格式。 如果指定了 `outputEncoding`，则返回使用指定编码的字符串。 如果没有提供 `outputEncoding`，则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

`cipher.update()` 方法可以使用新数据多次调用，直到调用 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding)。 在 [`cipher.final()`](/zh/nodejs/api/crypto#cipherfinaloutputencoding) 之后调用 `cipher.update()` 将导致抛出一个错误。


## 类：`Decipher` {#class-decipher}

**添加于：v0.1.94**

- 继承自：[\<stream.Transform\>](/zh/nodejs/api/stream#class-streamtransform)

`Decipher` 类的实例用于解密数据。该类可以通过两种方式使用：

- 作为可读写的 [stream](/zh/nodejs/api/stream)，其中写入加密的纯数据，在可读端生成未加密的数据，或者
- 使用 [`decipher.update()`](/zh/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 和 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 方法来生成未加密的数据。

[`crypto.createDecipheriv()`](/zh/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) 方法用于创建 `Decipher` 实例。不应使用 `new` 关键字直接创建 `Decipher` 对象。

示例：将 `Decipher` 对象用作流：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// 密钥长度取决于算法。 在这种情况下，对于 aes192，它是
// 24 字节（192 位）。
// 使用异步 `crypto.scrypt()` 代替。
const key = scryptSync(password, 'salt', 24);
// IV 通常与密文一起传递。
const iv = Buffer.alloc(16, 0); // 初始化向量。

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
  // 打印：some clear text data
});

// 使用相同的算法、密钥和 IV 加密。
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
// 密钥长度取决于算法。 在这种情况下，对于 aes192，它是
// 24 字节（192 位）。
// 使用异步 `crypto.scrypt()` 代替。
const key = scryptSync(password, 'salt', 24);
// IV 通常与密文一起传递。
const iv = Buffer.alloc(16, 0); // 初始化向量。

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
  // 打印：some clear text data
});

// 使用相同的算法、密钥和 IV 加密。
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

示例：使用 `Decipher` 和管道流：

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
// 使用异步 `crypto.scrypt()` 代替。
const key = scryptSync(password, 'salt', 24);
// IV 通常与密文一起传递。
const iv = Buffer.alloc(16, 0); // 初始化向量。

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
// 使用异步 `crypto.scrypt()` 代替。
const key = scryptSync(password, 'salt', 24);
// IV 通常与密文一起传递。
const iv = Buffer.alloc(16, 0); // 初始化向量。

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

示例：使用 [`decipher.update()`](/zh/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 和 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 方法：

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// 使用异步 `crypto.scrypt()` 代替。
const key = scryptSync(password, 'salt', 24);
// IV 通常与密文一起传递。
const iv = Buffer.alloc(16, 0); // 初始化向量。

const decipher = createDecipheriv(algorithm, key, iv);

// 使用相同的算法、密钥和 IV 加密。
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// 打印：some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// 使用异步 `crypto.scrypt()` 代替。
const key = scryptSync(password, 'salt', 24);
// IV 通常与密文一起传递。
const iv = Buffer.alloc(16, 0); // 初始化向量。

const decipher = createDecipheriv(algorithm, key, iv);

// 使用相同的算法、密钥和 IV 加密。
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// 打印：some clear text data
```
:::

### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**添加于: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [encoding](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 任何剩余的已解密内容。 如果指定了 `outputEncoding`，则返回字符串。 如果未提供 `outputEncoding`，则返回 [`Buffer`](/zh/nodejs/api/buffer)。

一旦调用了 `decipher.final()` 方法，`Decipher` 对象将不再能用于解密数据。 尝试多次调用 `decipher.final()` 将导致抛出错误。

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}

::: info [历史记录]
| 版本    | 更改                                                                                             |
| :------ | :----------------------------------------------------------------------------------------------- |
| v15.0.0 | buffer 参数可以是字符串或 ArrayBuffer，并且限制为不超过 2 ** 31 - 1 个字节。                      |
| v7.2.0  | 此方法现在返回对 `decipher` 的引用。                                                               |
| v1.0.0  | 添加于: v1.0.0                                                                                |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 选项](/zh/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `buffer` 是字符串时使用的字符串编码。
  
 
- 返回: [\<Decipher\>](/zh/nodejs/api/crypto#class-decipher) 用于方法链的同一个 Decipher。

当使用认证加密模式（目前支持 `GCM`、`CCM`、`OCB` 和 `chacha20-poly1305`）时，`decipher.setAAD()` 方法设置用于*附加认证数据* (AAD) 输入参数的值。

`options` 参数对于 `GCM` 是可选的。 当使用 `CCM` 时，必须指定 `plaintextLength` 选项，并且其值必须与密文的长度（以字节为单位）匹配。 参见 [CCM 模式](/zh/nodejs/api/crypto#ccm-mode)。

`decipher.setAAD()` 方法必须在 [`decipher.update()`](/zh/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 之前调用。

当将字符串作为 `buffer` 传递时，请考虑 [将字符串用作加密 API 的输入时的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | 使用 GCM 标签长度不是 128 位，并且在创建 `decipher` 时未指定 `authTagLength` 选项已被弃用。 |
| v15.0.0 | `buffer` 参数可以是字符串或 ArrayBuffer，并且限制为不超过 2 ** 31 - 1 字节。 |
| v11.0.0 | 如果 GCM 标签长度无效，此方法现在会抛出异常。 |
| v7.2.0 | 此方法现在返回对 `decipher` 的引用。 |
| v1.0.0 | 添加于: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `buffer` 是字符串时要使用的字符串编码。
- 返回: [\<Decipher\>](/zh/nodejs/api/crypto#class-decipher) 用于方法链的同一个 Decipher。

当使用认证加密模式（当前支持 `GCM`、`CCM`、`OCB` 和 `chacha20-poly1305`）时，`decipher.setAuthTag()` 方法用于传入接收到的*认证标签*。 如果未提供标签，或者密文已被篡改，则 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 将会抛出异常，表明由于认证失败，应丢弃密文。 如果标签长度根据 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) 无效或与 `authTagLength` 选项的值不匹配，则 `decipher.setAuthTag()` 将抛出错误。

`decipher.setAuthTag()` 方法必须在 `CCM` 模式下于 [`decipher.update()`](/zh/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) 之前调用，或者在 `GCM` 和 `OCB` 模式以及 `chacha20-poly1305` 模式下于 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 之前调用。 `decipher.setAuthTag()` 只能被调用一次。

当传递字符串作为身份验证标签时，请考虑[使用字符串作为加密 API 输入的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**添加于: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`
- 返回: [\<Decipher\>](/zh/nodejs/api/crypto#class-decipher) 用于方法链的同一个 Decipher。

当数据在加密时没有使用标准块填充时，调用 `decipher.setAutoPadding(false)` 将禁用自动填充，以防止 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 检查和移除填充。

关闭自动填充只有在输入数据的长度是密码块大小的倍数时才有效。

`decipher.setAutoPadding()` 方法必须在 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 之前调用。

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 默认的 `inputEncoding` 从 `binary` 更改为 `utf8`。 |
| v0.1.94 | 添加于: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

用 `data` 更新 decipher。 如果给出了 `inputEncoding` 参数，则 `data` 参数是一个使用指定编码的字符串。 如果未给出 `inputEncoding` 参数，则 `data` 必须是 [`Buffer`](/zh/nodejs/api/buffer)。 如果 `data` 是一个 [`Buffer`](/zh/nodejs/api/buffer)，则忽略 `inputEncoding`。

`outputEncoding` 指定了加密数据的输出格式。 如果指定了 `outputEncoding`，则返回一个使用指定编码的字符串。 如果没有提供 `outputEncoding`，则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

可以多次使用新数据调用 `decipher.update()` 方法，直到调用 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding)。 在 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 之后调用 `decipher.update()` 将导致抛出一个错误。

即使底层密码实现了身份验证，此时从该函数返回的明文的真实性和完整性也可能是不确定的。 对于经过身份验证的加密算法，通常只有当应用程序调用 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 时才能确定真实性。


## 类: `DiffieHellman` {#class-diffiehellman}

**加入于: v0.5.0**

`DiffieHellman` 类是一个用于创建 Diffie-Hellman 密钥交换的实用工具。

可以使用 [`crypto.createDiffieHellman()`](/zh/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding) 函数创建 `DiffieHellman` 类的实例。

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// 生成 Alice 的密钥...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// 生成 Bob 的密钥...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 交换并生成密钥...
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

// 生成 Alice 的密钥...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// 生成 Bob 的密钥...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// 交换并生成密钥...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**加入于: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `otherPublicKey` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 `otherPublicKey` 作为对方的公钥计算共享密钥，并返回计算出的共享密钥。 提供的密钥使用指定的 `inputEncoding` 解释，并且密钥使用指定的 `outputEncoding` 编码。 如果未提供 `inputEncoding`，则 `otherPublicKey` 预计为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

如果给定了 `outputEncoding`，则返回一个字符串； 否则，返回一个 [`Buffer`](/zh/nodejs/api/buffer)。


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**添加于: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生成 Diffie-Hellman 私钥和公钥值（除非它们已经被生成或计算），并以指定的 `encoding` 返回公钥。此密钥应传输给另一方。如果提供了 `encoding`，则返回字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

此函数是 [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key) 的一个薄封装。 特别是，一旦生成或设置了私钥，调用此函数只会更新公钥，而不会生成新的私钥。

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**添加于: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

以指定的 `encoding` 返回 Diffie-Hellman 生成器。如果提供了 `encoding`，则返回字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**添加于: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

以指定的 `encoding` 返回 Diffie-Hellman 素数。如果提供了 `encoding`，则返回字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**新增于: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

以指定的 `encoding` 返回 Diffie-Hellman 私钥。 如果提供了 `encoding`，则返回一个字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**新增于: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

以指定的 `encoding` 返回 Diffie-Hellman 公钥。 如果提供了 `encoding`，则返回一个字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**新增于: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `privateKey` 字符串的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

设置 Diffie-Hellman 私钥。 如果提供了 `encoding` 参数，则 `privateKey` 应该是一个字符串。 如果未提供 `encoding`，则 `privateKey` 应该是一个 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

此函数不会自动计算关联的公钥。 可以使用 [`diffieHellman.setPublicKey()`](/zh/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) 或 [`diffieHellman.generateKeys()`](/zh/nodejs/api/crypto#diffiehellmangeneratekeysencoding) 手动提供公钥或自动派生公钥。


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**加入于: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `publicKey` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

设置 Diffie-Hellman 公钥。 如果提供了 `encoding` 参数，则 `publicKey` 应为字符串。 如果未提供 `encoding`，则 `publicKey` 应为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**加入于: v0.11.12**

一个位域，包含在 `DiffieHellman` 对象初始化期间执行的检查所产生的任何警告和/或错误。

以下值对此属性有效（定义在 `node:constants` 模块中）：

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## 类: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**加入于: v0.7.5**

`DiffieHellmanGroup` 类接受一个著名的 modp 组作为其参数。 它的工作方式与 `DiffieHellman` 相同，只是它不允许在创建后更改其密钥。 换句话说，它不实现 `setPublicKey()` 或 `setPrivateKey()` 方法。

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

支持以下组：

- `'modp14'` (2048 位, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 第 3 节)
- `'modp15'` (3072 位, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 第 4 节)
- `'modp16'` (4096 位, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 第 5 节)
- `'modp17'` (6144 位, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 第 6 节)
- `'modp18'` (8192 位, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 第 7 节)

以下组仍然受支持但已弃用（参见 [注意事项](/zh/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)）：

- `'modp1'` (768 位, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) 第 6.1 节)
- `'modp2'` (1024 位, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) 第 6.2 节)
- `'modp5'` (1536 位, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) 第 2 节)

这些已弃用的组可能会在 Node.js 的未来版本中删除。


## 类: `ECDH` {#class-ecdh}

**添加于: v0.11.14**

`ECDH` 类是一个用于创建椭圆曲线 Diffie-Hellman (ECDH) 密钥交换的实用工具。

可以使用 [`crypto.createECDH()`](/zh/nodejs/api/crypto#cryptocreateecdhcurvename) 函数创建 `ECDH` 类的实例。

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// 生成 Alice 的密钥...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// 生成 Bob 的密钥...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// 交换并生成密钥...
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

// 生成 Alice 的密钥...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// 生成 Bob 的密钥...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// 交换并生成密钥...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### 静态方法: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**添加于: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `key` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'uncompressed'`
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

将 `key` 和 `curve` 指定的 EC Diffie-Hellman 公钥转换为 `format` 指定的格式。 `format` 参数指定点编码，可以是 `'compressed'`、`'uncompressed'` 或 `'hybrid'`。 提供的密钥使用指定的 `inputEncoding` 解释，返回的密钥使用指定的 `outputEncoding` 编码。

使用 [`crypto.getCurves()`](/zh/nodejs/api/crypto#cryptogetcurves) 获取可用曲线名称的列表。 在最近的 OpenSSL 版本中，`openssl ecparam -list_curves` 也会显示每个可用椭圆曲线的名称和描述。

如果未指定 `format`，则该点将以 `'uncompressed'` 格式返回。

如果未提供 `inputEncoding`，则 `key` 应为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

示例（解压密钥）：

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

// 转换后的密钥和未压缩的公钥应该相同
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

// 转换后的密钥和未压缩的公钥应该相同
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 更改了错误格式，以更好地支持无效的公钥错误。 |
| v6.0.0 | 默认的 `inputEncoding` 从 `binary` 更改为 `utf8`。 |
| v0.11.14 | 添加于: v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `otherPublicKey` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 `otherPublicKey` 作为对方的公钥来计算共享密钥，并返回计算出的共享密钥。 提供的密钥使用指定的 `inputEncoding` 进行解释，并且返回的密钥使用指定的 `outputEncoding` 进行编码。 如果未提供 `inputEncoding`，则 `otherPublicKey` 应为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

如果给定了 `outputEncoding`，将返回一个字符串；否则，将返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

当 `otherPublicKey` 位于椭圆曲线之外时，`ecdh.computeSecret` 将抛出一个 `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` 错误。 由于 `otherPublicKey` 通常通过不安全的网络从远程用户提供，请务必相应地处理此异常。


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**添加于: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'uncompressed'`
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生成私有和公共 EC Diffie-Hellman 密钥值，并以指定的 `format` 和 `encoding` 返回公钥。 此密钥应传输给另一方。

`format` 参数指定点编码，可以是 `'compressed'` 或 `'uncompressed'`。 如果未指定 `format`，则将以 `'uncompressed'` 格式返回点。

如果提供了 `encoding`，则返回一个字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**添加于: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 以指定的 `encoding` 返回 EC Diffie-Hellman。

如果指定了 `encoding`，则返回一个字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**添加于: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认:** `'uncompressed'`
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 以指定的 `encoding` 和 `format` 返回 EC Diffie-Hellman 公钥。

`format` 参数指定点编码，可以是 `'compressed'` 或 `'uncompressed'`。 如果未指定 `format`，则将以 `'uncompressed'` 格式返回点。

如果指定了 `encoding`，则返回一个字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)。


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Added in: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `privateKey` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

设置 EC Diffie-Hellman 私钥。 如果提供了 `encoding`，则 `privateKey` 预计为字符串；否则，`privateKey` 预计为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

如果 `privateKey` 对于创建 `ECDH` 对象时指定的曲线无效，则会抛出错误。 设置私钥后，也会生成关联的公共点（密钥）并将其设置在 `ECDH` 对象中。

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Added in: v0.11.14**

**Deprecated since: v5.2.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `publicKey` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

设置 EC Diffie-Hellman 公钥。 如果提供了 `encoding`，则 `publicKey` 预计为字符串；否则，预计为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

通常没有理由调用此方法，因为 `ECDH` 只需要私钥和对方的公钥即可计算共享密钥。 通常会调用 [`ecdh.generateKeys()`](/zh/nodejs/api/crypto#ecdhgeneratekeysencoding-format) 或 [`ecdh.setPrivateKey()`](/zh/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding)。 [`ecdh.setPrivateKey()`](/zh/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) 方法尝试生成与要设置的私钥关联的公共点/密钥。

示例（获取共享密钥）：

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// 这是一种指定 Alice 之前私钥的快捷方法。
// 在实际应用中使用如此可预测的私钥是不明智的。
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob 使用新生成的密码学上强大的
// 伪随机密钥对
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret 和 bobSecret 应该是相同的共享密钥值
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// 这是一种指定 Alice 之前私钥的快捷方法。
// 在实际应用中使用如此可预测的私钥是不明智的。
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob 使用新生成的密码学上强大的
// 伪随机密钥对
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret 和 bobSecret 应该是相同的共享密钥值
console.log(aliceSecret === bobSecret);
```
:::


## 类: `Hash` {#class-hash}

**新增于: v0.1.92**

- 继承自: [\<stream.Transform\>](/zh/nodejs/api/stream#class-streamtransform)

`Hash` 类是一个用于创建数据哈希摘要的实用程序。它可以通过两种方式使用：

- 作为可读写的 [流](/zh/nodejs/api/stream)，其中写入数据以在可读端生成计算出的哈希摘要，或者
- 使用 [`hash.update()`](/zh/nodejs/api/crypto#hashupdatedata-inputencoding) 和 [`hash.digest()`](/zh/nodejs/api/crypto#hashdigestencoding) 方法来生成计算出的哈希值。

[`crypto.createHash()`](/zh/nodejs/api/crypto#cryptocreatehashalgorithm-options) 方法用于创建 `Hash` 实例。 不得使用 `new` 关键字直接创建 `Hash` 对象。

示例：将 `Hash` 对象用作流：

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // 哈希流只会生成一个元素。
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // 打印:
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
  // 哈希流只会生成一个元素。
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // 打印:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

示例：使用 `Hash` 和管道流：

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

示例：使用 [`hash.update()`](/zh/nodejs/api/crypto#hashupdatedata-inputencoding) 和 [`hash.digest()`](/zh/nodejs/api/crypto#hashdigestencoding) 方法：

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// 打印:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// 打印:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**新增于: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 选项](/zh/nodejs/api/stream#new-streamtransformoptions)
- 返回: [\<Hash\>](/zh/nodejs/api/crypto#class-hash)

创建一个新的 `Hash` 对象，其中包含当前 `Hash` 对象内部状态的深拷贝。

可选的 `options` 参数控制流的行为。对于像 `'shake256'` 这样的 XOF 哈希函数，`outputLength` 选项可用于指定所需的输出长度（以字节为单位）。

如果在调用 [`hash.digest()`](/zh/nodejs/api/crypto#hashdigestencoding) 方法后尝试复制 `Hash` 对象，则会抛出错误。

::: code-group
```js [ESM]
// 计算滚动哈希。
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

// 等等
```

```js [CJS]
// 计算滚动哈希。
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

// 等等
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**新增于: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

计算传递给哈希的所有数据（使用 [`hash.update()`](/zh/nodejs/api/crypto#hashupdatedata-inputencoding) 方法）的摘要。 如果提供了 `encoding`，则返回一个字符串； 否则，返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

在调用 `hash.digest()` 方法后，`Hash` 对象不能再次使用。 多次调用会导致抛出错误。


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 默认的 `inputEncoding` 从 `binary` 更改为 `utf8`。 |
| v0.1.92 | 添加于: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

使用给定的 `data` 更新哈希内容，其编码在 `inputEncoding` 中给出。 如果未提供 `encoding`，并且 `data` 是字符串，则强制使用 `'utf8'` 编码。 如果 `data` 是 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`，则忽略 `inputEncoding`。

可以多次调用此方法，并传入流式传输的新数据。

## 类: `Hmac` {#class-hmac}

**添加于: v0.1.94**

- 继承自: [\<stream.Transform\>](/zh/nodejs/api/stream#class-streamtransform)

`Hmac` 类是用于创建加密 HMAC 摘要的实用工具。 它可以通过两种方式使用：

- 作为可读写的 [流](/zh/nodejs/api/stream)，数据被写入以在可读端生成计算出的 HMAC 摘要，或者
- 使用 [`hmac.update()`](/zh/nodejs/api/crypto#hmacupdatedata-inputencoding) 和 [`hmac.digest()`](/zh/nodejs/api/crypto#hmacdigestencoding) 方法来生成计算出的 HMAC 摘要。

[`crypto.createHmac()`](/zh/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) 方法用于创建 `Hmac` 实例。 不得使用 `new` 关键字直接创建 `Hmac` 对象。

示例：将 `Hmac` 对象用作流：

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // 哈希流只会生成一个元素。
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // 打印:
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
  // 哈希流只会生成一个元素。
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // 打印:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

示例：使用 `Hmac` 和管道流：

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

示例：使用 [`hmac.update()`](/zh/nodejs/api/crypto#hmacupdatedata-inputencoding) 和 [`hmac.digest()`](/zh/nodejs/api/crypto#hmacdigestencoding) 方法：

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// 打印:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// 打印:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**加入于: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

计算使用 [`hmac.update()`](/zh/nodejs/api/crypto#hmacupdatedata-inputencoding) 传递的所有数据的 HMAC 摘要。 如果提供了 `encoding`，则返回一个字符串；否则返回一个 [`Buffer`](/zh/nodejs/api/buffer)；

`Hmac` 对象在调用 `hmac.digest()` 后不能再次使用。 多次调用 `hmac.digest()` 将导致抛出错误。

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 默认的 `inputEncoding` 从 `binary` 更改为 `utf8`。 |
| v0.1.94 | 加入于: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 字符串的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

使用给定的 `data` 更新 `Hmac` 的内容，其编码在 `inputEncoding` 中给出。 如果未提供 `encoding`，并且 `data` 是字符串，则强制使用 `'utf8'` 编码。 如果 `data` 是 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`，则 `inputEncoding` 将被忽略。

可以多次调用此方法来传递流式的新数据。

## 类: `KeyObject` {#class-keyobject}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.5.0, v12.19.0 | 此类的实例现在可以使用 `postMessage` 传递给工作线程。 |
| v11.13.0 | 此类现在已导出。 |
| v11.6.0 | 加入于: v11.6.0 |
:::

Node.js 使用 `KeyObject` 类来表示对称或非对称密钥，并且每种密钥都公开不同的函数。 [`crypto.createSecretKey()`](/zh/nodejs/api/crypto#cryptocreatesecretkeykey-encoding)、[`crypto.createPublicKey()`](/zh/nodejs/api/crypto#cryptocreatepublickeykey) 和 [`crypto.createPrivateKey()`](/zh/nodejs/api/crypto#cryptocreateprivatekeykey) 方法用于创建 `KeyObject` 实例。 不应使用 `new` 关键字直接创建 `KeyObject` 对象。

由于改进的安全功能，大多数应用程序应考虑使用新的 `KeyObject` API，而不是将密钥作为字符串或 `Buffer` 传递。

`KeyObject` 实例可以通过 [`postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 传递给其他线程。 接收器获得克隆的 `KeyObject`，并且不需要在 `transferList` 参数中列出 `KeyObject`。


### 静态方法: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**新增于: v15.0.0**

- `key` [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- 返回: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)

例子: 将 `CryptoKey` 实例转换为 `KeyObject`:

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.9.0 | 为 RSA-PSS 密钥公开 `RSASSA-PSS-params` 序列参数。 |
| v15.7.0 | 新增于: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 密钥大小，以位为单位 (RSA, DSA)。
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 公共指数 (RSA)。
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 消息摘要的名称 (RSA-PSS)。
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1 使用的消息摘要的名称 (RSA-PSS)。
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最小盐长度，以字节为单位 (RSA-PSS)。
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `q` 的大小，以位为单位 (DSA)。
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 曲线的名称 (EC)。

此属性仅存在于非对称密钥上。 根据密钥的类型，此对象包含有关密钥的信息。 通过此属性获得的任何信息都不能用于唯一标识密钥或损害密钥的安全性。

对于 RSA-PSS 密钥，如果密钥材料包含 `RSASSA-PSS-params` 序列，则将设置 `hashAlgorithm`、`mgf1HashAlgorithm` 和 `saltLength` 属性。

其他密钥详细信息可能会通过此 API 使用其他属性公开。


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.9.0, v12.17.0 | 增加了对 `'dh'` 的支持。 |
| v12.0.0 | 增加了对 `'rsa-pss'` 的支持。 |
| v12.0.0 | 对于无法识别类型的 KeyObject 实例，此属性现在返回 `undefined` 而不是中止。 |
| v12.0.0 | 增加了对 `'x25519'` 和 `'x448'` 的支持。 |
| v12.0.0 | 增加了对 `'ed25519'` 和 `'ed448'` 的支持。 |
| v11.6.0 | 添加于: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

对于非对称密钥，此属性表示密钥的类型。 支持的密钥类型有：

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

对于无法识别的 `KeyObject` 类型和对称密钥，此属性为 `undefined`。

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**添加于: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) 要与 `keyObject` 进行比较的 `KeyObject`。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

根据密钥是否具有完全相同的类型、值和参数，返回 `true` 或 `false`。 此方法不是[恒定时间](https://en.wikipedia.org/wiki/Timing_attack)。

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.9.0 | 增加了对 `'jwk'` 格式的支持。 |
| v11.6.0 | 添加于: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

对于对称密钥，可以使用以下编码选项：

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'buffer'`（默认）或 `'jwk'`。

对于公钥，可以使用以下编码选项：

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'pkcs1'`（仅限 RSA）或 `'spki'` 之一。
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'pem'`、`'der'` 或 `'jwk'`。

对于私钥，可以使用以下编码选项：

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'pkcs1'`（仅限 RSA）、`'pkcs8'` 或 `'sec1'`（仅限 EC）之一。
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'pem'`、`'der'` 或 `'jwk'`。
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果指定，私钥将使用给定的 `cipher` 和 `passphrase`，使用基于 PKCS#5 v2.0 密码的加密进行加密。
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 用于加密的密码，请参阅 `cipher`。

结果类型取决于所选的编码格式，当 PEM 时，结果是一个字符串，当 DER 时，它将是一个包含编码为 DER 的数据的缓冲区，当 [JWK](https://tools.ietf.org/html/rfc7517) 时，它将是一个对象。

当选择了 [JWK](https://tools.ietf.org/html/rfc7517) 编码格式时，所有其他编码选项都将被忽略。

PKCS#1、SEC1 和 PKCS#8 类型的密钥可以通过组合 `cipher` 和 `format` 选项进行加密。 PKCS#8 `type` 可以与任何 `format` 一起使用，通过指定 `cipher` 来加密任何密钥算法（RSA、EC 或 DH）。 仅当使用 PEM `format` 时，才能通过指定 `cipher` 来加密 PKCS#1 和 SEC1。 为了获得最大的兼容性，请使用 PKCS#8 加密私钥。 由于 PKCS#8 定义了自己的加密机制，因此在加密 PKCS#8 密钥时不支持 PEM 级别的加密。 有关 PKCS#8 加密，请参阅 [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt)；有关 PKCS#1 和 SEC1 加密，请参阅 [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt)。


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**添加于: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

对于密钥，此属性表示密钥的大小（以字节为单位）。 对于非对称密钥，此属性为 `undefined`。

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**添加于: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/zh/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/zh/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/zh/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [密钥用法](/zh/nodejs/api/webcrypto#cryptokeyusages)。
- 返回: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)

将 `KeyObject` 实例转换为 `CryptoKey`。

### `keyObject.type` {#keyobjecttype}

**添加于: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

根据此 `KeyObject` 的类型，此属性对于密钥（对称）密钥为 `'secret'`，对于公钥（非对称）密钥为 `'public'`，对于私钥（非对称）密钥为 `'private'`。

## 类: `Sign` {#class-sign}

**添加于: v0.1.92**

- 继承自: [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)

`Sign` 类是一个用于生成签名的实用程序。 它可以以下两种方式之一使用：

- 作为可写[流](/zh/nodejs/api/stream)，在其中写入要签名的数据，并使用 [`sign.sign()`](/zh/nodejs/api/crypto#signsignprivatekey-outputencoding) 方法生成并返回签名，或
- 使用 [`sign.update()`](/zh/nodejs/api/crypto#signupdatedata-inputencoding) 和 [`sign.sign()`](/zh/nodejs/api/crypto#signsignprivatekey-outputencoding) 方法来生成签名。

[`crypto.createSign()`](/zh/nodejs/api/crypto#cryptocreatesignalgorithm-options) 方法用于创建 `Sign` 实例。 参数是要使用的哈希函数的字符串名称。 不得使用 `new` 关键字直接创建 `Sign` 对象。

示例：将 `Sign` 和 [`Verify`](/zh/nodejs/api/crypto#class-verify) 对象用作流：

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

示例：使用 [`sign.update()`](/zh/nodejs/api/crypto#signupdatedata-inputencoding) 和 [`verify.update()`](/zh/nodejs/api/crypto#verifyupdatedata-inputencoding) 方法：

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | privateKey 也可以是 ArrayBuffer 和 CryptoKey。 |
| v13.2.0, v12.16.0 | 此函数现在支持 IEEE-P1363 DSA 和 ECDSA 签名。 |
| v12.0.0 | 此函数现在支持 RSA-PSS 密钥。 |
| v11.6.0 | 此函数现在支持密钥对象。 |
| v8.0.0 | 添加了对 RSASSA-PSS 和其他选项的支持。 |
| v0.1.92 | 添加于: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用 [`sign.update()`](/zh/nodejs/api/crypto#signupdatedata-inputencoding) 或 [`sign.write()`](/zh/nodejs/api/stream#writablewritechunk-encoding-callback) 计算通过的所有数据的签名。

如果 `privateKey` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `privateKey` 已传递给 [`crypto.createPrivateKey()`](/zh/nodejs/api/crypto#cryptocreateprivatekeykey) 一样。 如果它是一个对象，则可以传递以下附加属性：

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 对于 DSA 和 ECDSA，此选项指定生成的签名的格式。 它可以是以下之一：
    - `'der'`（默认）：DER 编码的 ASN.1 签名结构，编码 `(r, s)`。
    - `'ieee-p1363'`：IEEE-P1363 中提出的签名格式 `r || s`。


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA 的可选填充值，可以是以下之一：
    - `crypto.constants.RSA_PKCS1_PADDING` (默认)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` 将使用 MGF1 和用于对消息进行签名的相同哈希函数，如 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) 第 3.1 节中所述，除非 MGF1 哈希函数已按照 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) 第 3.3 节的规定指定为密钥的一部分。
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当填充为 `RSA_PKCS1_PSS_PADDING` 时的盐长度。 特殊值 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` 将盐长度设置为摘要大小，`crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN`（默认）将其设置为允许的最大值。

如果提供了 `outputEncoding`，则返回一个字符串；否则，返回一个 [`Buffer`](/zh/nodejs/api/buffer)。

在调用 `sign.sign()` 方法后，`Sign` 对象不能再次使用。 多次调用 `sign.sign()` 将导致抛出错误。


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 默认 `inputEncoding` 从 `binary` 变更为 `utf8`。 |
| v0.1.92 | 加入于: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 字符串的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

使用给定的 `data` 更新 `Sign` 的内容，其编码在 `inputEncoding` 中给出。 如果未提供 `encoding`，并且 `data` 是字符串，则强制使用 `'utf8'` 编码。 如果 `data` 是 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`，则忽略 `inputEncoding`。

可以多次使用新数据调用此方法，因为它是流式的。

## 类: `Verify` {#class-verify}

**加入于: v0.1.92**

- 继承: [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)

`Verify` 类是用于验证签名的实用程序。 它可以通过两种方式使用：

- 作为可写[流](/zh/nodejs/api/stream)，其中写入的数据用于针对提供的签名进行验证，或者
- 使用 [`verify.update()`](/zh/nodejs/api/crypto#verifyupdatedata-inputencoding) 和 [`verify.verify()`](/zh/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) 方法来验证签名。

[`crypto.createVerify()`](/zh/nodejs/api/crypto#cryptocreateverifyalgorithm-options) 方法用于创建 `Verify` 实例。 不应使用 `new` 关键字直接创建 `Verify` 对象。

有关示例，请参见 [`Sign`](/zh/nodejs/api/crypto#class-sign)。

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 默认 `inputEncoding` 从 `binary` 变更为 `utf8`。 |
| v0.1.92 | 加入于: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `data` 字符串的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。

使用给定的 `data` 更新 `Verify` 的内容，其编码在 `inputEncoding` 中给出。 如果未提供 `inputEncoding`，并且 `data` 是字符串，则强制使用 `'utf8'` 编码。 如果 `data` 是 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`，则忽略 `inputEncoding`。

可以多次使用新数据调用此方法，因为它是流式的。


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 对象也可以是 ArrayBuffer 和 CryptoKey。 |
| v13.2.0, v12.16.0 | 此函数现在支持 IEEE-P1363 DSA 和 ECDSA 签名。 |
| v12.0.0 | 此函数现在支持 RSA-PSS 密钥。 |
| v11.7.0 | 密钥现在可以是私钥。 |
| v8.0.0 | 添加了对 RSASSA-PSS 和其他选项的支持。 |
| v0.1.92 | 添加于: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `signature` 字符串的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 或 `false`，取决于数据和公钥的签名的有效性。

使用给定的 `object` 和 `signature` 验证所提供的数据。

如果 `object` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `object` 已传递给 [`crypto.createPublicKey()`](/zh/nodejs/api/crypto#cryptocreatepublickeykey) 一样。 如果它是一个对象，则可以传递以下附加属性：

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 对于 DSA 和 ECDSA，此选项指定签名的格式。 它可以是以下之一：
    - `'der'` (默认): DER 编码的 ASN.1 签名结构编码 `(r, s)`。
    - `'ieee-p1363'`: IEEE-P1363 中提出的签名格式 `r || s`。


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA 的可选填充值，可以是以下之一：
    - `crypto.constants.RSA_PKCS1_PADDING` (默认)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` 将使用 MGF1 和用于验证消息的相同哈希函数，如 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) 的第 3.1 节中所指定，除非 MGF1 哈希函数已作为密钥的一部分指定，符合 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) 的第 3.3 节。
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当填充为 `RSA_PKCS1_PSS_PADDING` 时的盐长度。 特殊值 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` 将盐长度设置为摘要大小，`crypto.constants.RSA_PSS_SALTLEN_AUTO`（默认）导致自动确定。

`signature` 参数是先前计算的数据签名，采用 `signatureEncoding`。 如果指定了 `signatureEncoding`，则 `signature` 预计为字符串；否则 `signature` 预计为 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

在调用 `verify.verify()` 之后，无法再次使用 `verify` 对象。 多次调用 `verify.verify()` 将导致抛出错误。

由于公钥可以从私钥派生，因此可以传递私钥而不是公钥。


## 类: `X509Certificate` {#class-x509certificate}

**加入于: v15.6.0**

封装一个 X509 证书并提供对其信息的只读访问。

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

**加入于: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 一个 PEM 或 DER 编码的 X509 证书。

### `x509.ca` {#x509ca}

**加入于: v15.6.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果这是一个证书颁发机构 (CA) 证书，则为 `true`。

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | `subject` 选项现在默认为 `'default'`。 |
| v17.5.0, v16.15.0 | `subject` 选项现在可以设置为 `'default'`。 |
| v17.5.0, v16.14.1 | `wildcards`，`partialWildcards`，`multiLabelWildcards` 和 `singleLabelSubdomains` 选项已被删除，因为它们不起作用。 |
| v15.6.0 | 加入于: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`、`'always'` 或 `'never'`。 **默认值:** `'default'`。

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果证书匹配，则返回 `email`，否则返回 `undefined`。

检查证书是否与给定的电子邮件地址匹配。

如果未定义 `'subject'` 选项或将其设置为 `'default'`，则只有当主题备用名称扩展不存在或不包含任何电子邮件地址时，才会考虑证书主题。

如果 `'subject'` 选项设置为 `'always'` 并且如果主题备用名称扩展不存在或不包含匹配的电子邮件地址，则考虑证书主题。

如果将 `'subject'` 选项设置为 `'never'`，则永远不会考虑证书主题，即使证书不包含任何主题备用名称。


### `x509.checkHost(name[, options])` {#x509checkhostname-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | `subject` 选项现在默认为 `'default'`。 |
| v17.5.0, v16.15.0 | `subject` 选项现在可以设置为 `'default'`。 |
| v15.6.0 | 添加于: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`、`'always'` 或 `'never'`。 **默认:** `'default'`。
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`。
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `true`。
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`。
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 返回与 `name` 匹配的主题名，如果没有任何主题名与 `name` 匹配，则返回 `undefined`。

检查证书是否与给定的主机名匹配。

如果证书与给定的主机名匹配，则返回匹配的主题名。返回的名称可能完全匹配（例如，`foo.example.com`），或者可能包含通配符（例如，`*.example.com`）。由于主机名比较不区分大小写，因此返回的主题名在大小写方面也可能与给定的 `name` 不同。

如果 `'subject'` 选项未定义或设置为 `'default'`，则仅当主题备用名称扩展不存在或不包含任何 DNS 名称时，才考虑证书主题。此行为与 [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS") 一致。

如果 `'subject'` 选项设置为 `'always'` 并且主题备用名称扩展不存在或不包含匹配的 DNS 名称，则会考虑证书主题。

如果 `'subject'` 选项设置为 `'never'`，即使证书不包含任何主题备用名称，也永远不会考虑证书主题。


### `x509.checkIP(ip)` {#x509checkipip}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.5.0, v16.14.1 | `options` 参数已被移除，因为它不起作用。 |
| v15.6.0 | 添加于: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果证书匹配，则返回 `ip`；如果不匹配，则返回 `undefined`。

检查证书是否与给定的 IP 地址（IPv4 或 IPv6）匹配。

仅考虑 [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) `iPAddress` 主题备用名称，并且它们必须与给定的 `ip` 地址完全匹配。 忽略其他主题备用名称以及证书的主题字段。

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**添加于: v15.6.0**

- `otherCert` [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

检查此证书是否由给定的 `otherCert` 颁发。

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**添加于: v15.6.0**

- `privateKey` [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) 一个私钥。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

检查此证书的公钥是否与给定的私钥一致。

### `x509.extKeyUsage` {#x509extkeyusage}

**添加于: v15.6.0**

- 类型: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

一个数组，详细说明了此证书的密钥扩展用途。

### `x509.fingerprint` {#x509fingerprint}

**添加于: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书的 SHA-1 指纹。

由于 SHA-1 在密码学上已被破解，并且 SHA-1 的安全性远低于通常用于签署证书的算法，因此请考虑改用 [`x509.fingerprint256`](/zh/nodejs/api/crypto#x509fingerprint256)。


### `x509.fingerprint256` {#x509fingerprint256}

**Added in: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书的 SHA-256 指纹。

### `x509.fingerprint512` {#x509fingerprint512}

**Added in: v17.2.0, v16.14.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书的 SHA-512 指纹。

由于计算 SHA-256 指纹通常更快，并且大小只有 SHA-512 指纹的一半，[`x509.fingerprint256`](/zh/nodejs/api/crypto#x509fingerprint256) 可能是更好的选择。 虽然 SHA-512 大概提供更高的安全级别，但 SHA-256 的安全性与大多数用于签署证书的算法的安全性相匹配。

### `x509.infoAccess` {#x509infoaccess}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.3.1, v16.13.2 | 为了响应 CVE-2021-44532，此字符串的某些部分可能会被编码为 JSON 字符串字面量。 |
| v15.6.0 | 添加于: v15.6.0 |
:::

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

证书的授权信息访问扩展的文本表示形式。

这是一个以换行符分隔的访问描述列表。 每行都以访问方法和访问位置的种类开头，后跟一个冒号和与访问位置关联的值。

在表示访问方法和访问位置种类的之后，每行剩余的部分可能用引号引起来，以表明该值是 JSON 字符串字面量。 为了向后兼容，Node.js 仅在此属性内使用 JSON 字符串字面量，以避免歧义。 第三方代码应准备好处理两种可能的条目格式。

### `x509.issuer` {#x509issuer}

**Added in: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书中包含的颁发者标识。


### `x509.issuerCertificate` {#x509issuercertificate}

**添加于: v15.9.0**

- 类型: [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate)

颁发者证书，如果颁发者证书不可用，则为 `undefined`。

### `x509.publicKey` {#x509publickey}

**添加于: v15.6.0**

- 类型: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)

此证书的公钥 [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)。

### `x509.raw` {#x509raw}

**添加于: v15.6.0**

- 类型: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

包含此证书的 DER 编码的 `Buffer`。

### `x509.serialNumber` {#x509serialnumber}

**添加于: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书的序列号。

序列号由证书颁发机构分配，并不能唯一标识证书。 考虑使用 [`x509.fingerprint256`](/zh/nodejs/api/crypto#x509fingerprint256) 作为唯一的标识符。

### `x509.subject` {#x509subject}

**添加于: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书的完整主题。

### `x509.subjectAltName` {#x509subjectaltname}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.3.1, v16.13.2 | 为了响应 CVE-2021-44532，此字符串的某些部分可能会被编码为 JSON 字符串字面量。 |
| v15.6.0 | 添加于: v15.6.0 |
:::

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

为此证书指定的主题备用名称。

这是以逗号分隔的主题备用名称列表。 每个条目都以一个字符串开头，该字符串标识主题备用名称的类型，后跟一个冒号和与该条目关联的值。

早期版本的 Node.js 错误地认为在双字符序列 `', '` 处拆分此属性是安全的（请参阅 [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)）。 但是，恶意和合法的证书都可能包含在表示为字符串时包含此序列的主题备用名称。

在表示条目类型的​​前缀之后，每个条目的其余部分可以用引号引起来，以表明该值是 JSON 字符串字面量。 为了向后兼容，Node.js 仅在必要时才在此属性中使用 JSON 字符串字面量以避免歧义。 应该准备好第三方代码来处理两种可能的条目格式。


### `x509.toJSON()` {#x509tojson}

**Added in: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

X509 证书没有标准的 JSON 编码。 `toJSON()` 方法返回一个包含 PEM 编码证书的字符串。

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Added in: v15.6.0**

- 类型: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

使用旧式的[证书对象](/zh/nodejs/api/tls#certificate-object)编码返回有关此证书的信息。

### `x509.toString()` {#x509tostring}

**Added in: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回 PEM 编码的证书。

### `x509.validFrom` {#x509validfrom}

**Added in: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书生效的起始日期/时间。

### `x509.validFromDate` {#x509validfromdate}

**Added in: v23.0.0**

- 类型: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

此证书生效的起始日期/时间，封装在一个 `Date` 对象中。

### `x509.validTo` {#x509validto}

**Added in: v15.6.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

此证书有效的截止日期/时间。

### `x509.validToDate` {#x509validtodate}

**Added in: v23.0.0**

- 类型: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

此证书有效的截止日期/时间，封装在一个 `Date` 对象中。

### `x509.verify(publicKey)` {#x509verifypublickey}

**Added in: v15.6.0**

- `publicKey` [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) 一个公钥。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

验证此证书是否由给定的公钥签名。 不对证书执行任何其他验证检查。


## `node:crypto` 模块方法和属性 {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.8.0 | 添加于: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 一个可能的质数，编码为任意长度的大端字节序列。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要执行的 Miller-Rabin 概率素性迭代次数。 当值为 `0` (零) 时，使用的检查次数对于随机输入产生的误报率最多为 2。 选择检查次数时必须小心。 有关更多详细信息，请参阅 OpenSSL 文档中的 [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) 函数 `nchecks` 选项。 **默认:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 如果检查期间发生错误，则设置为 [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 对象。
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果候选者是质数，并且错误概率小于 `0.25 ** options.checks`，则为 `true`。
  
 

检查 `candidate` 的素性。


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**新增于: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 一个可能的素数，编码为任意长度的大端字节序列。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要执行的 Miller-Rabin 概率素性迭代的次数。 当值为 `0`（零）时，使用的检查次数产生的随机输入的误报率最高为 2。 选择检查次数时必须小心。 有关更多详细信息，请参阅 OpenSSL 文档中的 [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) 函数 `nchecks` 选项。 **默认值:** `0`
  
 
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果候选者是素数，且错误概率小于 `0.25 ** options.checks`，则返回 `true`。

检查 `candidate` 的素性。

### `crypto.constants` {#cryptoconstants}

**新增于: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个包含加密和安全相关操作的常用常量的对象。 当前定义的特定常量在[加密常量](/zh/nodejs/api/crypto#crypto-constants)中描述。


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.9.0, v16.17.0 | 现在，当使用 `chacha20-poly1305` 密码时，`authTagLength` 选项是可选的，并且默认为 16 字节。 |
| v15.0.0 | 密码和 iv 参数可以是 ArrayBuffer，并且每个参数的最大长度限制为 2 ** 31 - 1 字节。 |
| v11.6.0 | `key` 参数现在可以是 `KeyObject`。 |
| v11.2.0, v10.17.0 | 现在支持密码 `chacha20-poly1305` (ChaCha20-Poly1305 的 IETF 变体)。 |
| v10.10.0 | 现在支持 OCB 模式的密码。 |
| v10.2.0 | `authTagLength` 选项现在可用于在 GCM 模式下生成更短的身份验证标签，默认为 16 字节。 |
| v9.9.0 | 对于不需要初始化向量的密码，`iv` 参数现在可以为 `null`。 |
| v0.1.94 | 添加于: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 选项](/zh/nodejs/api/stream#new-streamtransformoptions)
- 返回: [\<Cipher\>](/zh/nodejs/api/crypto#class-cipher)

创建并返回一个 `Cipher` 对象，具有给定的 `algorithm`、`key` 和初始化向量 (`iv`)。

`options` 参数控制流的行为，并且是可选的，除非使用 CCM 或 OCB 模式（例如 `'aes-128-ccm'`）的密码。 在这种情况下，`authTagLength` 选项是必需的，并以字节为单位指定身份验证标签的长度，请参阅 [CCM 模式](/zh/nodejs/api/crypto#ccm-mode)。 在 GCM 模式下，`authTagLength` 选项不是必需的，但可用于设置 `getAuthTag()` 将返回的身份验证标签的长度，默认为 16 字节。 对于 `chacha20-poly1305`，`authTagLength` 选项默认为 16 字节。

`algorithm` 依赖于 OpenSSL，例如 `'aes192'` 等。 在最近的 OpenSSL 版本中，`openssl list -cipher-algorithms` 将显示可用的密码算法。

`key` 是 `algorithm` 使用的原始密钥，`iv` 是一个[初始化向量](https://en.wikipedia.org/wiki/Initialization_vector)。 这两个参数都必须是 `'utf8'` 编码的字符串、[Buffers](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。 `key` 可以选择是类型为 `secret` 的 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)。 如果密码不需要初始化向量，则 `iv` 可以为 `null`。

当为 `key` 或 `iv` 传递字符串时，请考虑[使用字符串作为加密 API 的输入时的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。

初始化向量应该是不可预测和唯一的； 理想情况下，它们将是密码学上随机的。 它们不必是秘密的：IV 通常只是以未加密的方式添加到密文消息中。 某些东西必须是不可预测和唯一的，但不必是秘密的，这听起来可能自相矛盾； 请记住，攻击者不能提前预测给定的 IV 会是什么。


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.9.0, v16.17.0 | 当使用 `chacha20-poly1305` 密码时，`authTagLength` 选项现在是可选的，默认为 16 字节。 |
| v11.6.0 | `key` 参数现在可以是 `KeyObject`。 |
| v11.2.0, v10.17.0 | 现在支持密码 `chacha20-poly1305`（ChaCha20-Poly1305 的 IETF 变体）。 |
| v10.10.0 | 现在支持 OCB 模式下的密码。 |
| v10.2.0 | `authTagLength` 选项现在可用于限制接受的 GCM 身份验证标签长度。 |
| v9.9.0 | 对于不需要初始化向量的密码，`iv` 参数现在可以为 `null`。 |
| v0.1.94 | 添加于: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 的选项](/zh/nodejs/api/stream#new-streamtransformoptions)
- 返回: [\<Decipher\>](/zh/nodejs/api/crypto#class-decipher)

创建并返回一个 `Decipher` 对象，该对象使用给定的 `algorithm`、`key` 和初始化向量 (`iv`)。

`options` 参数控制流的行为，除了使用 CCM 或 OCB 模式（例如 `'aes-128-ccm'`）的密码时，它是可选的。 在这种情况下，`authTagLength` 选项是必需的，并以字节为单位指定身份验证标签的长度，请参阅 [CCM 模式](/zh/nodejs/api/crypto#ccm-mode)。 对于 AES-GCM 和 `chacha20-poly1305`，`authTagLength` 选项默认为 16 字节，如果使用不同的长度，则必须将其设置为不同的值。

`algorithm` 依赖于 OpenSSL，例如 `'aes192'` 等。 在最近的 OpenSSL 版本中，`openssl list -cipher-algorithms` 将显示可用的密码算法。

`key` 是 `algorithm` 使用的原始密钥，`iv` 是一个[初始化向量](https://en.wikipedia.org/wiki/Initialization_vector)。 这两个参数都必须是 `'utf8'` 编码的字符串、[Buffers](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。 `key` 可以选择是 `secret` 类型的 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)。 如果密码不需要初始化向量，则 `iv` 可以为 `null`。

当为 `key` 或 `iv` 传递字符串时，请考虑[使用字符串作为加密 API 输入时的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。

初始化向量应该是不可预测且唯一的； 理想情况下，它们将是密码学上随机的。 它们不必是秘密的：IV 通常只是以未加密的方式添加到密文消息中。 听起来可能很矛盾，某些东西必须是不可预测且唯一的，但不必是秘密的； 请记住，攻击者不得能够提前预测给定的 IV 将是什么。


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | `prime` 参数现在可以是任何 `TypedArray` 或 `DataView`。 |
| v8.0.0 | `prime` 参数现在可以是 `Uint8Array`。 |
| v6.0.0 | 编码参数的默认值从 `binary` 更改为 `utf8`。 |
| v0.11.12 | 添加于: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `prime` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **默认:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `generator` 字符串的 [编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。
- 返回: [\<DiffieHellman\>](/zh/nodejs/api/crypto#class-diffiehellman)

使用提供的 `prime` 和可选的特定 `generator` 创建 `DiffieHellman` 密钥交换对象。

`generator` 参数可以是数字、字符串或 [`Buffer`](/zh/nodejs/api/buffer)。 如果未指定 `generator`，则使用值 `2`。

如果指定了 `primeEncoding`，则 `prime` 预计是字符串； 否则，预计是 [`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。

如果指定了 `generatorEncoding`，则 `generator` 预计是字符串； 否则，预计是数字、[`Buffer`](/zh/nodejs/api/buffer)、`TypedArray` 或 `DataView`。


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Added in: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `2`
- 返回: [\<DiffieHellman\>](/zh/nodejs/api/crypto#class-diffiehellman)

创建一个 `DiffieHellman` 密钥交换对象，并使用可选的特定数字 `generator` 生成 `primeLength` 位的素数。 如果未指定 `generator`，则使用值 `2`。

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Added in: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<DiffieHellmanGroup\>](/zh/nodejs/api/crypto#class-diffiehellmangroup)

[`crypto.getDiffieHellman()`](/zh/nodejs/api/crypto#cryptogetdiffiehellmangroupname) 的别名

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Added in: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<ECDH\>](/zh/nodejs/api/crypto#class-ecdh)

使用由 `curveName` 字符串指定的预定义曲线创建一个椭圆曲线 Diffie-Hellman (`ECDH`) 密钥交换对象。 使用 [`crypto.getCurves()`](/zh/nodejs/api/crypto#cryptogetcurves) 获取可用曲线名称的列表。 在最近的 OpenSSL 版本中，`openssl ecparam -list_curves` 也会显示每个可用椭圆曲线的名称和描述。

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v12.8.0 | 添加了 XOF 哈希函数的 `outputLength` 选项。 |
| v0.1.92 | 添加于: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 选项](/zh/nodejs/api/stream#new-streamtransformoptions)
- 返回: [\<Hash\>](/zh/nodejs/api/crypto#class-hash)

创建并返回一个 `Hash` 对象，该对象可用于使用给定的 `algorithm` 生成哈希摘要。 可选的 `options` 参数控制流的行为。 对于 XOF 哈希函数（例如 `'shake256'`），可以使用 `outputLength` 选项指定所需的输出长度（以字节为单位）。

`algorithm` 取决于平台上 OpenSSL 版本支持的可用算法。 示例包括 `'sha256'`、`'sha512'` 等。 在 OpenSSL 的最新版本中，`openssl list -digest-algorithms` 将显示可用的摘要算法。

示例：生成文件的 sha256 总和

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 密钥也可以是 ArrayBuffer 或 CryptoKey。添加了 encoding 选项。密钥不能包含超过 2 ** 32 - 1 个字节。 |
| v11.6.0 | `key` 参数现在可以是 `KeyObject`。 |
| v0.1.94 | 添加于: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` 选项](/zh/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `key` 是字符串时要使用的字符串编码。


- 返回: [\<Hmac\>](/zh/nodejs/api/crypto#class-hmac)

创建并返回一个使用给定 `algorithm` 和 `key` 的 `Hmac` 对象。可选的 `options` 参数控制流的行为。

`algorithm` 取决于平台上 OpenSSL 版本支持的可用算法。例如 `'sha256'`、`'sha512'` 等。在 OpenSSL 的最新版本中，`openssl list -digest-algorithms` 将显示可用的摘要算法。

`key` 是用于生成加密 HMAC 哈希的 HMAC 密钥。如果它是一个 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，它的类型必须是 `secret`。如果它是一个字符串，请考虑[将字符串用作加密 API 输入时的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。如果它是从密码学上安全的熵源获得的，例如 [`crypto.randomBytes()`](/zh/nodejs/api/crypto#cryptorandombytessize-callback) 或 [`crypto.generateKey()`](/zh/nodejs/api/crypto#cryptogeneratekeytype-options-callback)，则其长度不应超过 `algorithm` 的块大小（例如，SHA-256 为 512 位）。

示例：生成文件的 sha256 HMAC

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.12.0 | 密钥也可以是 JWK 对象。 |
| v15.0.0 | 密钥也可以是 ArrayBuffer。 添加了 encoding 选项。 密钥不能包含超过 2 ** 32 - 1 个字节。 |
| v11.6.0 | 添加于: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 密钥材料，可以是 PEM、DER 或 JWK 格式。
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'pem'`、`'der'` 或 `'jwk'`。 **默认:** `'pem'`。
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'pkcs1'`、`'pkcs8'` 或 `'sec1'`。 仅当 `format` 为 `'der'` 时才需要此选项，否则将被忽略。
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 用于解密的密码。
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `key` 是字符串时要使用的字符串编码。

- 返回: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)

创建并返回包含私钥的新密钥对象。 如果 `key` 是字符串或 `Buffer`，则假定 `format` 为 `'pem'`； 否则，`key` 必须是具有上述属性的对象。

如果私钥已加密，则必须指定 `passphrase`。 密码的长度限制为 1024 字节。


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.12.0 | 密钥也可以是 JWK 对象。 |
| v15.0.0 | 密钥也可以是 ArrayBuffer。添加了 encoding 选项。密钥不能包含超过 2 ** 32 - 1 字节。 |
| v11.13.0 | `key` 参数现在可以是类型为 `private` 的 `KeyObject`。 |
| v11.7.0 | `key` 参数现在可以是私钥。 |
| v11.6.0 | 加入于: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 密钥材料，可以是 PEM、DER 或 JWK 格式。
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'pem'`、`'der'` 或 `'jwk'`。 **默认:** `'pem'`。
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'pkcs1'` 或 `'spki'`。 只有当 `format` 是 `'der'` 时才需要此选项，否则将被忽略。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `key` 是字符串时要使用的字符串编码。
  
 
- 返回: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)

创建并返回包含公钥的新密钥对象。 如果 `key` 是字符串或 `Buffer`，则假定 `format` 为 `'pem'`； 如果 `key` 是类型为 `'private'` 的 `KeyObject`，则公钥是从给定的私钥派生的； 否则，`key` 必须是具有上述属性的对象。

如果格式为 `'pem'`，则 `'key'` 也可以是 X.509 证书。

由于公钥可以从私钥派生，因此可以传递私钥而不是公钥。 在这种情况下，此函数的作用类似于调用了 [`crypto.createPrivateKey()`](/zh/nodejs/api/crypto#cryptocreateprivatekeykey)，不同之处在于返回的 `KeyObject` 的类型将为 `'public'` 并且无法从返回的 `KeyObject` 中提取私钥。 类似地，如果给定了类型为 `'private'` 的 `KeyObject`，则将返回类型为 `'public'` 的新 `KeyObject`，并且无法从返回的对象中提取私钥。


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.8.0, v16.18.0 | 现在密钥可以为零长度。 |
| v15.0.0 | 密钥也可以是 ArrayBuffer 或字符串。 添加了 encoding 参数。 密钥不能包含超过 2 ** 32 - 1 个字节。 |
| v11.6.0 | 添加于: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `key` 是一个字符串时，字符串的编码。
- 返回: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)

创建并返回一个新的密钥对象，其中包含用于对称加密或 `Hmac` 的密钥。

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**添加于: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` 选项](/zh/nodejs/api/stream#new-streamwritableoptions)
- 返回: [\<Sign\>](/zh/nodejs/api/crypto#class-sign)

创建并返回一个使用给定 `algorithm` 的 `Sign` 对象。 使用 [`crypto.getHashes()`](/zh/nodejs/api/crypto#cryptogethashes) 来获取可用摘要算法的名称。 可选的 `options` 参数控制 `stream.Writable` 的行为。

在某些情况下，可以使用签名算法的名称（例如 `'RSA-SHA256'`）而不是摘要算法来创建 `Sign` 实例。 这将使用相应的摘要算法。 这不适用于所有签名算法，例如 `'ecdsa-with-SHA256'`，因此最好始终使用摘要算法名称。


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**已加入版本: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/zh/nodejs/api/stream#new-streamwritableoptions)
- 返回: [\<Verify\>](/zh/nodejs/api/crypto#class-verify)

创建并返回一个使用给定算法的 `Verify` 对象。 使用 [`crypto.getHashes()`](/zh/nodejs/api/crypto#cryptogethashes) 获取可用签名算法名称的数组。 可选的 `options` 参数控制 `stream.Writable` 的行为。

在某些情况下，可以使用签名算法的名称（例如 `'RSA-SHA256'`）而不是摘要算法来创建 `Verify` 实例。 这将使用相应的摘要算法。 这不适用于所有签名算法，例如 `'ecdsa-with-SHA256'`，因此最好始终使用摘要算法名称。

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**已加入版本: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `privateKey`: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)


- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

基于 `privateKey` 和 `publicKey` 计算 Diffie-Hellman 密钥。 两个密钥必须具有相同的 `asymmetricKeyType`，它必须是 `'dh'`（用于 Diffie-Hellman）、`'ec'`、`'x448'` 或 `'x25519'`（用于 ECDH）之一。

### `crypto.fips` {#cryptofips}

**已加入版本: v6.0.0**

**自版本: v10.0.0 弃用**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

用于检查和控制当前是否正在使用符合 FIPS 的加密提供程序的属性。 设置为 true 需要 Node.js 的 FIPS 构建。

此属性已弃用。 请改用 `crypto.setFips()` 和 `crypto.getFips()`。


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.0.0 | 在 v15.0.0 中添加 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 生成的密钥的预期用途。当前接受的值为 `'hmac'` 和 `'aes'`。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的密钥的位长度。这必须是大于 0 的值。
    - 如果 `type` 是 `'hmac'`，则最小值为 8，最大长度为 2-1。如果该值不是 8 的倍数，则生成的密钥将被截断为 `Math.floor(length / 8)`。
    - 如果 `type` 是 `'aes'`，则长度必须是 `128`、`192` 或 `256` 之一。
  
 
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)
  
 

异步生成给定 `length` 的新随机密钥。 `type` 将确定对 `length` 执行哪些验证。



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

生成的 HMAC 密钥的大小不应超过底层哈希函数的块大小。 有关更多信息，请参阅 [`crypto.createHmac()`](/zh/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options)。


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v16.10.0 | 增加为 RSA-PSS 密钥对定义 `RSASSA-PSS-params` 序列参数的能力。 |
| v13.9.0, v12.17.0 | 增加对 Diffie-Hellman 的支持。 |
| v12.0.0 | 增加对 RSA-PSS 密钥对的支持。 |
| v12.0.0 | 增加生成 X25519 和 X448 密钥对的能力。 |
| v12.0.0 | 增加生成 Ed25519 和 Ed448 密钥对的能力。 |
| v11.6.0 | 如果未指定编码，则 `generateKeyPair` 和 `generateKeyPairSync` 函数现在生成密钥对象。 |
| v10.12.0 | 添加于: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'rsa'`、`'rsa-pss'`、`'dsa'`、`'ec'`、`'ed25519'`、`'ed448'`、`'x25519'`、`'x448'` 或 `'dh'`。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 密钥大小，以位为单位 (RSA, DSA)。
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公共指数 (RSA)。 **默认值:** `0x10001`。
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 消息摘要的名称 (RSA-PSS)。
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1 使用的消息摘要的名称 (RSA-PSS)。
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最小盐长度，以字节为单位 (RSA-PSS)。
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `q` 的大小，以位为单位 (DSA)。
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的曲线的名称 (EC)。
    - `prime`: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 素数参数 (DH)。
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 素数长度，以位为单位 (DH)。
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 自定义生成器 (DH)。 **默认值:** `2`。
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman 组名称 (DH)。 参见 [`crypto.getDiffieHellman()`](/zh/nodejs/api/crypto#cryptogetdiffiehellmangroupname)。
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'named'` 或 `'explicit'` (EC)。 **默认值:** `'named'`。
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`keyObject.export()`](/zh/nodejs/api/crypto#keyobjectexportoptions)。
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`keyObject.export()`](/zh/nodejs/api/crypto#keyobjectexportoptions)。
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)
  
 

生成给定 `type` 的新非对称密钥对。 目前支持 RSA、RSA-PSS、DSA、EC、Ed25519、Ed448、X25519、X448 和 DH。

如果指定了 `publicKeyEncoding` 或 `privateKeyEncoding`，则此函数的行为就像已在其结果上调用了 [`keyObject.export()`](/zh/nodejs/api/crypto#keyobjectexportoptions) 一样。 否则，密钥的相应部分将作为 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject) 返回。

建议将公钥编码为 `'spki'`，并将私钥编码为 `'pkcs8'`，并使用加密进行长期存储：

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
  // 处理错误并使用生成的密钥对。
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
  // 处理错误并使用生成的密钥对。
});
```
:::

完成时，将调用 `callback`，其中 `err` 设置为 `undefined`，`publicKey` / `privateKey` 表示生成的密钥对。

如果此方法作为其 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) ed 版本调用，则它将返回一个 `Promise`，该 `Promise` 对应于具有 `publicKey` 和 `privateKey` 属性的 `Object`。


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.10.0 | 为 RSA-PSS 密钥对添加定义 `RSASSA-PSS-params` 序列参数的能力。 |
| v13.9.0, v12.17.0 | 添加对 Diffie-Hellman 的支持。 |
| v12.0.0 | 添加对 RSA-PSS 密钥对的支持。 |
| v12.0.0 | 添加生成 X25519 和 X448 密钥对的能力。 |
| v12.0.0 | 添加生成 Ed25519 和 Ed448 密钥对的能力。 |
| v11.6.0 | 如果未指定编码，`generateKeyPair` 和 `generateKeyPairSync` 函数现在会生成密钥对象。 |
| v10.12.0 | 加入于: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` 或 `'dh'`。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 密钥大小，以位为单位 (RSA, DSA)。
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 公共指数 (RSA)。 **默认:** `0x10001`。
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 消息摘要的名称 (RSA-PSS)。
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MGF1 使用的消息摘要的名称 (RSA-PSS)。
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 盐的最小长度，以字节为单位 (RSA-PSS)。
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `q` 的大小，以位为单位 (DSA)。
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的曲线的名称 (EC)。
    - `prime`: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 素数参数 (DH)。
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 素数长度，以位为单位 (DH)。
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 自定义生成器 (DH)。 **默认:** `2`。
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman 组名 (DH)。 参见 [`crypto.getDiffieHellman()`](/zh/nodejs/api/crypto#cryptogetdiffiehellmangroupname)。
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'named'` 或 `'explicit'` (EC)。 **默认:** `'named'`。
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`keyObject.export()`](/zh/nodejs/api/crypto#keyobjectexportoptions)。
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`keyObject.export()`](/zh/nodejs/api/crypto#keyobjectexportoptions)。
  
 
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)
  
 

生成给定 `type` 的新的非对称密钥对。 目前支持 RSA、RSA-PSS、DSA、EC、Ed25519、Ed448、X25519、X448 和 DH。

如果指定了 `publicKeyEncoding` 或 `privateKeyEncoding`，则此函数的行为就好像已在其结果上调用了 [`keyObject.export()`](/zh/nodejs/api/crypto#keyobjectexportoptions)。 否则，密钥的相应部分将作为 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject) 返回。

在编码公钥时，建议使用 `'spki'`。 在编码私钥时，建议使用带有强密码的 `'pkcs8'`，并保持密码的机密性。

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

返回值 `{ publicKey, privateKey }` 表示生成的密钥对。 当选择 PEM 编码时，相应的密钥将是一个字符串，否则它将是一个包含编码为 DER 的数据的缓冲区。


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**添加于: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 生成的密钥的预期用途。目前接受的值为 `'hmac'` 和 `'aes'`。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的密钥的位长度。
    - 如果 `type` 为 `'hmac'`，则最小值是 8，最大长度是 2-1。如果该值不是 8 的倍数，则生成的密钥将被截断为 `Math.floor(length / 8)`。
    - 如果 `type` 为 `'aes'`，则长度必须是 `128`、`192` 或 `256` 之一。



- 返回: [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)

同步生成给定 `length` 的新随机密钥。`type` 将决定对 `length` 执行哪些验证。

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

生成的 HMAC 密钥的大小不应超过底层哈希函数的块大小。 更多信息请参见 [`crypto.createHmac()`](/zh/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options)。

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.8.0 | 添加于: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的素数的大小（以位为单位）。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`。
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，生成的素数作为 `bigint` 返回。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



生成 `size` 位的伪随机素数。

如果 `options.safe` 为 `true`，则素数将是安全素数——也就是说，`(prime - 1) / 2` 也将是一个素数。

`options.add` 和 `options.rem` 参数可用于强制执行其他要求，例如，对于 Diffie-Hellman：

- 如果 `options.add` 和 `options.rem` 都设置了，则素数将满足条件 `prime % add = rem`。
- 如果仅设置了 `options.add` 并且 `options.safe` 不是 `true`，则素数将满足条件 `prime % add = 1`。
- 如果仅设置了 `options.add` 并且 `options.safe` 设置为 `true`，则素数将改为满足条件 `prime % add = 3`。 这是必要的，因为对于 `options.add \> 2`，`prime % add = 1` 将与 `options.safe` 强制执行的条件相矛盾。
- 如果未给出 `options.add`，则忽略 `options.rem`。

如果 `options.add` 和 `options.rem` 作为 `ArrayBuffer`、`SharedArrayBuffer`、`TypedArray`、`Buffer` 或 `DataView` 给出，则必须将它们编码为大端序列。

默认情况下，素数在 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 中编码为八位字节的大端序列。 如果 `bigint` 选项为 `true`，则提供 [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**已加入版本: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的素数的大小（以位为单位）。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认:** `false`。
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当为 `true` 时，生成的素数将作为 `bigint` 返回。
  
 
- 返回: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

生成一个 `size` 位的伪随机素数。

如果 `options.safe` 为 `true`，则该素数将是一个安全素数——也就是说，`(prime - 1) / 2` 也将是一个素数。

`options.add` 和 `options.rem` 参数可用于强制执行其他要求，例如，对于 Diffie-Hellman：

- 如果 `options.add` 和 `options.rem` 都已设置，则该素数将满足条件 `prime % add = rem`。
- 如果仅设置了 `options.add` 且 `options.safe` 不是 `true`，则该素数将满足条件 `prime % add = 1`。
- 如果仅设置了 `options.add` 且 `options.safe` 设置为 `true`，则该素数将满足条件 `prime % add = 3`。 这是必要的，因为对于 `options.add \> 2`，`prime % add = 1` 将与 `options.safe` 强制执行的条件相矛盾。
- 如果未给出 `options.add`，则 `options.rem` 将被忽略。

如果 `options.add` 和 `options.rem` 作为 `ArrayBuffer`、`SharedArrayBuffer`、`TypedArray`、`Buffer` 或 `DataView` 给出，则必须将它们编码为大端序列。

默认情况下，素数被编码为 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 中的八位字节的大端序列。 如果 `bigint` 选项为 `true`，则提供 [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**新增于: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要查询的密码的名称或 nid。
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个测试用的密钥长度。
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个测试用的 IV 长度。
  
 
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 密码的名称
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 密码的 nid
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 密码的块大小，以字节为单位。当 `mode` 为 `'stream'` 时，此属性被省略。
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 期望的或默认的初始化向量长度，以字节为单位。如果密码不使用初始化向量，则省略此属性。
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 期望的或默认的密钥长度，以字节为单位。
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 密码模式。 以下之一： `'cbc'`、`'ccm'`、`'cfb'`、`'ctr'`、`'ecb'`、`'gcm'`、`'ocb'`、`'ofb'`、`'stream'`、`'wrap'`、`'xts'`。
  
 

返回有关给定密码的信息。

一些密码接受可变长度的密钥和初始化向量。 默认情况下，`crypto.getCipherInfo()` 方法将返回这些密码的默认值。 要测试给定的密钥长度或 iv 长度对于给定的密码是否可接受，请使用 `keyLength` 和 `ivLength` 选项。 如果给定的值不可接受，将返回 `undefined`。


### `crypto.getCiphers()` {#cryptogetciphers}

**Added in: v0.9.3**

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 包含支持的密码算法名称的数组。

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

**Added in: v2.3.0**

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 包含支持的椭圆曲线名称的数组。

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

**Added in: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<DiffieHellmanGroup\>](/zh/nodejs/api/crypto#class-diffiehellmangroup)

创建一个预定义的 `DiffieHellmanGroup` 密钥交换对象。 支持的组在 [`DiffieHellmanGroup`](/zh/nodejs/api/crypto#class-diffiehellmangroup) 的文档中列出。

返回的对象模仿由 [`crypto.createDiffieHellman()`](/zh/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding) 创建的对象的接口，但不允许更改密钥（例如，使用 [`diffieHellman.setPublicKey()`](/zh/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding)）。 使用此方法的优点是，各方不必事先生成或交换组模数，从而节省了处理器和通信时间。

例子（获取共享密钥）：

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

/* aliceSecret 和 bobSecret 应该相同 */
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

/* aliceSecret 和 bobSecret 应该相同 */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**新增于: v10.0.0**

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 仅当当前使用符合 FIPS 标准的加密提供程序时返回 `1`，否则返回 `0`。未来的 semver 主要版本可能会将此 API 的返回类型更改为 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)。

### `crypto.getHashes()` {#cryptogethashes}

**新增于: v0.9.3**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 支持的哈希算法名称数组，例如 `'RSA-SHA256'`。 哈希算法也称为“摘要”算法。

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

**新增于: v17.4.0**

- `typedArray` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 返回 `typedArray`。

[`crypto.webcrypto.getRandomValues()`](/zh/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray) 的便捷别名。 此实现不符合 Web Crypto 规范，要编写与 Web 兼容的代码，请改用 [`crypto.webcrypto.getRandomValues()`](/zh/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray)。


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**加入于: v21.7.0, v20.12.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 当 `data` 是一个字符串时，它将在哈希之前被编码为 UTF-8。如果希望字符串输入采用不同的输入编码，用户可以使用 `TextEncoder` 或 `Buffer.from()` 将字符串编码为 `TypedArray`，并将编码后的 `TypedArray` 传递给此 API。
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  用于编码返回摘要的[编码](/zh/nodejs/api/buffer#buffers-and-character-encodings)。**默认值:** `'hex'`。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

一个用于创建数据的一次性哈希摘要的实用工具。当哈希较小量的数据（<= 5MB）且数据已准备就绪时，它可能比基于对象的 `crypto.createHash()` 更快。如果数据可能很大或正在流式传输，仍然建议使用 `crypto.createHash()`。

`algorithm` 取决于平台上 OpenSSL 版本支持的可用算法。例如 `'sha256'`, `'sha512'` 等。在最新版本的 OpenSSL 上，`openssl list -digest-algorithms` 将显示可用的摘要算法。

示例:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// 哈希一个字符串并将结果作为十六进制编码的字符串返回。
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// 将 base64 编码的字符串编码为 Buffer，对其进行哈希处理并返回
// 结果作为缓冲区。
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// 哈希一个字符串并将结果作为十六进制编码的字符串返回。
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// 将 base64 编码的字符串编码为 Buffer，对其进行哈希处理并返回
// 结果作为缓冲区。
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v18.8.0, v16.18.0 | 输入密钥材料现在可以是零长度。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的摘要算法。
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) 输入密钥材料。 必须提供，但可以为零长度。
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) salt 值。 必须提供，但可以为零长度。
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 附加信息值。 必须提供，但可以为零长度，并且不能超过 1024 字节。
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的密钥的长度。 必须大于 0。 允许的最大值是所选摘要函数产生的字节数的 `255` 倍（例如，`sha512` 生成 64 字节的哈希值，使最大 HKDF 输出为 16320 字节）。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
  
 

HKDF 是 RFC 5869 中定义的简单密钥派生函数。 给定的 `ikm`、`salt` 和 `info` 与 `digest` 一起用于派生 `keylen` 字节的密钥。

提供的 `callback` 函数使用两个参数调用：`err` 和 `derivedKey`。 如果在派生密钥时发生错误，则将设置 `err`； 否则 `err` 将为 `null`。 成功生成的 `derivedKey` 将作为 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 传递给回调。 如果任何输入参数指定无效值或类型，则会抛出错误。

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

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v18.8.0, v16.18.0 | 输入密钥材料现在可以是零长度。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要使用的摘要算法。
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) 输入密钥材料。 必须提供，但可以是零长度。
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) salt 值。 必须提供，但可以是零长度。
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 附加信息值。 必须提供，但可以是零长度，并且不能超过 1024 字节。
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的密钥的长度。 必须大于 0。 最大允许值是所选摘要函数产生的字节数的 `255` 倍（例如，`sha512` 生成 64 字节哈希，使最大 HKDF 输出为 16320 字节）。
- 返回: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

提供如 RFC 5869 中定义的同步 HKDF 密钥派生函数。 给定的 `ikm`、`salt` 和 `info` 与 `digest` 一起用于派生 `keylen` 字节的密钥。

成功生成的 `derivedKey` 将作为 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 返回。

如果任何输入参数指定了无效的值或类型，或者无法生成派生密钥，则会抛出错误。

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.0.0 | `password` 和 `salt` 参数也可以是 ArrayBuffer 实例。 |
| v14.0.0 | `iterations` 参数现在被限制为正值。 早期版本将其他值视为 1。 |
| v8.0.0 | 现在始终需要 `digest` 参数。 |
| v6.0.0 | 现在不传递 `digest` 参数调用此函数已被弃用，并且会发出警告。 |
| v6.0.0 | 如果 `password` 是字符串，则其默认编码已从 `binary` 更改为 `utf8`。 |
| v0.5.5 | 添加于: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

提供基于密码的密钥派生函数 2 (PBKDF2) 的异步实现。 由 `digest` 指定的选定 HMAC 摘要算法用于从 `password`、`salt` 和 `iterations` 派生出请求的字节长度 (`keylen`) 的密钥。

提供的 `callback` 函数被调用时带有两个参数：`err` 和 `derivedKey`。 如果在派生密钥时发生错误，将设置 `err`； 否则 `err` 将为 `null`。 默认情况下，成功生成的 `derivedKey` 将作为 [`Buffer`](/zh/nodejs/api/buffer) 传递给回调。 如果任何输入参数指定了无效的值或类型，则会抛出错误。

`iterations` 参数必须设置为尽可能高的数字。 迭代次数越高，派生的密钥就越安全，但是完成的时间也会越长。

`salt` 应该尽可能唯一。 建议 salt 是随机的，并且至少 16 个字节长。 有关详细信息，请参见 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)。

当为 `password` 或 `salt` 传递字符串时，请考虑[使用字符串作为加密 API 的输入的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。

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

可以使用 [`crypto.getHashes()`](/zh/nodejs/api/crypto#cryptogethashes) 检索支持的摘要函数的数组。

此 API 使用 libuv 的线程池，这可能会对某些应用程序产生令人惊讶和消极的性能影响； 有关更多信息，请参见 [`UV_THREADPOOL_SIZE`](/zh/nodejs/api/cli#uv_threadpool_sizesize) 文档。


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | `iterations` 参数现在被限制为正值。早期版本将其他值视为 1。 |
| v6.0.0 | 现在不传递 `digest` 参数调用此函数已被弃用，并将发出警告。 |
| v6.0.0 | 如果 `password` 是字符串，则其默认编码已从 `binary` 更改为 `utf8`。 |
| v0.9.3 | 添加于: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

提供同步的基于密码的密钥派生函数 2 (PBKDF2) 实现。 应用由 `digest` 指定的选定的 HMAC 摘要算法，以从 `password`、`salt` 和 `iterations` 派生请求的字节长度 (`keylen`) 的密钥。

如果发生错误，将抛出 `Error`，否则派生的密钥将作为 [`Buffer`](/zh/nodejs/api/buffer) 返回。

`iterations` 参数必须设置为尽可能高的数字。 迭代次数越高，派生的密钥就越安全，但完成需要更长的时间。

`salt` 应尽可能唯一。 建议 salt 是随机的并且至少 16 字节长。 有关详细信息，请参见 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)。

当传递字符串作为 `password` 或 `salt` 时，请考虑[使用字符串作为加密 API 输入时的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。

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

可以使用 [`crypto.getHashes()`](/zh/nodejs/api/crypto#cryptogethashes) 检索受支持的摘要函数数组。


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | `RSA_PKCS1_PADDING` 填充已禁用，除非 OpenSSL 构建支持隐式拒绝。 |
| v15.0.0 | 添加了字符串、ArrayBuffer 和 CryptoKey 作为允许的密钥类型。oaepLabel 可以是 ArrayBuffer。buffer 可以是字符串或 ArrayBuffer。所有接受缓冲区的类型都限制为最大 2 ** 31 - 1 字节。 |
| v12.11.0 | 添加了 `oaepLabel` 选项。 |
| v12.9.0 | 添加了 `oaepHash` 选项。 |
| v11.6.0 | 此函数现在支持密钥对象。 |
| v0.11.14 | 添加于: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于 OAEP 填充和 MGF1 的哈希函数。 **默认值:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 用于 OAEP 填充的标签。 如果未指定，则不使用标签。
    - `padding` [\<crypto.constants\>](/zh/nodejs/api/crypto#cryptoconstants) `crypto.constants` 中定义的可选填充值，可以是：`crypto.constants.RSA_NO_PADDING`、`crypto.constants.RSA_PKCS1_PADDING` 或 `crypto.constants.RSA_PKCS1_OAEP_PADDING`。


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 包含解密内容的新 `Buffer`。

使用 `privateKey` 解密 `buffer`。 `buffer` 之前使用相应的公钥加密，例如使用 [`crypto.publicEncrypt()`](/zh/nodejs/api/crypto#cryptopublicencryptkey-buffer)。

如果 `privateKey` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `privateKey` 已被传递给 [`crypto.createPrivateKey()`](/zh/nodejs/api/crypto#cryptocreateprivatekeykey)。 如果它是一个对象，则可以传递 `padding` 属性。 否则，此函数使用 `RSA_PKCS1_OAEP_PADDING`。

在 [`crypto.privateDecrypt()`](/zh/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) 中使用 `crypto.constants.RSA_PKCS1_PADDING` 需要 OpenSSL 支持隐式拒绝 (`rsa_pkcs1_implicit_rejection`)。 如果 Node.js 使用的 OpenSSL 版本不支持此功能，则尝试使用 `RSA_PKCS1_PADDING` 将会失败。


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 添加了 string、ArrayBuffer 和 CryptoKey 作为允许的密钥类型。 密码可以是 ArrayBuffer。 缓冲区可以是字符串或 ArrayBuffer。 所有接受缓冲区的类型都限制为最大 2 ** 31 - 1 字节。 |
| v11.6.0 | 此函数现在支持密钥对象。 |
| v1.1.0 | 添加于: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) PEM 编码的私钥。
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 私钥的可选密码。
    - `padding` [\<crypto.constants\>](/zh/nodejs/api/crypto#cryptoconstants) 在 `crypto.constants` 中定义的可选填充值，可以是：`crypto.constants.RSA_NO_PADDING` 或 `crypto.constants.RSA_PKCS1_PADDING`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `buffer`、`key` 或 `passphrase` 是字符串时，要使用的字符串编码。


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 包含加密内容的新 `Buffer`。

使用 `privateKey` 加密 `buffer`。 返回的数据可以使用相应的公钥解密，例如使用 [`crypto.publicDecrypt()`](/zh/nodejs/api/crypto#cryptopublicdecryptkey-buffer)。

如果 `privateKey` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `privateKey` 已传递给 [`crypto.createPrivateKey()`](/zh/nodejs/api/crypto#cryptocreateprivatekeykey) 一样。 如果它是一个对象，则可以传递 `padding` 属性。 否则，此函数使用 `RSA_PKCS1_PADDING`。


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 添加了 string、ArrayBuffer 和 CryptoKey 作为允许的密钥类型。 密码可以是 ArrayBuffer。 缓冲区可以是字符串或 ArrayBuffer。 所有接受缓冲区的类型都限制为最大 2 ** 31 - 1 个字节。 |
| v11.6.0 | 此函数现在支持密钥对象。 |
| v1.1.0 | 添加于: v1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
  - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 私钥的可选密码。
  - `padding` [\<crypto.constants\>](/zh/nodejs/api/crypto#cryptoconstants) `crypto.constants` 中定义的可选填充值，可以是：`crypto.constants.RSA_NO_PADDING` 或 `crypto.constants.RSA_PKCS1_PADDING`。
  - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `buffer`、`key` 或 `passphrase` 是字符串时要使用的字符串编码。
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 包含解密内容的新 `Buffer`。

使用 `key` 解密 `buffer`。 `buffer` 之前已使用相应的私钥加密，例如使用 [`crypto.privateEncrypt()`](/zh/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer)。

如果 `key` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `key` 已传递给 [`crypto.createPublicKey()`](/zh/nodejs/api/crypto#cryptocreatepublickeykey) 一样。 如果它是一个对象，则可以传递 `padding` 属性。 否则，此函数使用 `RSA_PKCS1_PADDING`。

由于 RSA 公钥可以从私钥派生，因此可以传递私钥而不是公钥。


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 添加了字符串、ArrayBuffer 和 CryptoKey 作为允许的键类型。oaepLabel 和 passphrase 可以是 ArrayBuffer。buffer 可以是字符串或 ArrayBuffer。所有接受缓冲区的类型都限制为最大 2 ** 31 - 1 字节。 |
| v12.11.0 | 添加了 `oaepLabel` 选项。 |
| v12.9.0 | 添加了 `oaepHash` 选项。 |
| v11.6.0 | 此函数现在支持键对象。 |
| v0.11.14 | 加入于: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 一个 PEM 编码的公钥或私钥、[\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) 或 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)。
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于 OAEP 填充和 MGF1 的哈希函数。 **默认:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 用于 OAEP 填充的标签。 如果未指定，则不使用标签。
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 私钥的可选密码。
    - `padding` [\<crypto.constants\>](/zh/nodejs/api/crypto#cryptoconstants) `crypto.constants` 中定义的可选填充值，可以是：`crypto.constants.RSA_NO_PADDING`、`crypto.constants.RSA_PKCS1_PADDING` 或 `crypto.constants.RSA_PKCS1_OAEP_PADDING`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `buffer`、`key`、`oaepLabel` 或 `passphrase` 是字符串时要使用的字符串编码。

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 带有加密内容的新 `Buffer`。

使用 `key` 加密 `buffer` 的内容，并返回带有加密内容的新 [`Buffer`](/zh/nodejs/api/buffer)。 返回的数据可以使用相应的私钥解密，例如使用 [`crypto.privateDecrypt()`](/zh/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer)。

如果 `key` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `key` 已传递给 [`crypto.createPublicKey()`](/zh/nodejs/api/crypto#cryptocreatepublickeykey) 一样。 如果它是一个对象，则可以传递 `padding` 属性。 否则，此函数使用 `RSA_PKCS1_OAEP_PADDING`。

由于 RSA 公钥可以从私钥派生，因此可以传递私钥而不是公钥。


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v9.0.0 | 现在将 `null` 作为 `callback` 参数传递会抛出 `ERR_INVALID_CALLBACK`。 |
| v0.5.8 | 在 v0.5.8 中添加。 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要生成的字节数。`size` 不得大于 `2**31 - 1`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
  
 
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) 如果未提供 `callback` 函数。

生成加密强度高的伪随机数据。 `size` 参数是一个数字，表示要生成的字节数。

如果提供了 `callback` 函数，则字节是异步生成的，并且使用两个参数调用 `callback` 函数：`err` 和 `buf`。 如果发生错误，`err` 将是一个 `Error` 对象；否则为 `null`。 `buf` 参数是一个包含生成的字节的 [`Buffer`](/zh/nodejs/api/buffer)。

::: code-group
```js [ESM]
// 异步
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

```js [CJS]
// 异步
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```
:::

如果未提供 `callback` 函数，则随机字节是同步生成的，并作为 [`Buffer`](/zh/nodejs/api/buffer) 返回。 如果生成字节时出现问题，将抛出一个错误。

::: code-group
```js [ESM]
// 同步
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

```js [CJS]
// 同步
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```
:::

在有足够的熵可用之前，`crypto.randomBytes()` 方法不会完成。 这通常不应超过几毫秒。 唯一可能长时间阻塞生成随机字节的情况是在启动之后，当整个系统的熵仍然很低时。

此 API 使用 libuv 的线程池，这可能会对某些应用程序产生令人惊讶的负面性能影响； 有关更多信息，请参阅 [`UV_THREADPOOL_SIZE`](/zh/nodejs/api/cli#uv_threadpool_sizesize) 文档。

`crypto.randomBytes()` 的异步版本在单个线程池请求中执行。 为了最大限度地减少线程池任务长度的变化，在满足客户端请求时，对较大的 `randomBytes` 请求进行分区。


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v9.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v7.10.0, v6.13.0 | 添加于: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 必须提供。 提供的 `buffer` 的大小不得大于 `2**31 - 1`。
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.length - offset`。 `size` 不得大于 `2**31 - 1`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`。

此函数类似于 [`crypto.randomBytes()`](/zh/nodejs/api/crypto#cryptorandombytessize-callback)，但需要将第一个参数作为要填充的 [`Buffer`](/zh/nodejs/api/buffer)。 它还要求传入一个回调。

如果未提供 `callback` 函数，则会抛出一个错误。

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

// 上述代码等效于以下代码：
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

// 上述代码等效于以下代码：
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

任何 `ArrayBuffer`、`TypedArray` 或 `DataView` 实例都可以作为 `buffer` 传入。

虽然这包括 `Float32Array` 和 `Float64Array` 的实例，但不应使用此函数生成随机浮点数。 结果可能包含 `+Infinity`、`-Infinity` 和 `NaN`，即使数组仅包含有限数字，它们也不是从均匀随机分布中抽取的，并且没有有意义的下限或上限。

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

此 API 使用 libuv 的线程池，对于某些应用程序，这可能会产生令人惊讶的负面性能影响； 有关更多信息，请参见 [`UV_THREADPOOL_SIZE`](/zh/nodejs/api/cli#uv_threadpool_sizesize) 文档。

`crypto.randomFill()` 的异步版本在单个线程池请求中执行。 为了最大限度地减少线程池任务长度的变化，在作为满足客户端请求的一部分执行时，请对大型 `randomFill` 请求进行分区。


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | `buffer` 参数可以是任何 `TypedArray` 或 `DataView`。 |
| v7.10.0, v6.13.0 | 添加于: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 必须提供。 所提供的 `buffer` 的大小不能大于 `2**31 - 1`。
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `buffer.length - offset`。 `size` 不能大于 `2**31 - 1`。
- 返回: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 作为 `buffer` 参数传递的对象。

[`crypto.randomFill()`](/zh/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback) 的同步版本。

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// 上面等价于以下内容：
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

// 上面等价于以下内容：
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

任何 `ArrayBuffer`、`TypedArray` 或 `DataView` 实例都可以作为 `buffer` 传递。

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE`，而不是 `ERR_INVALID_CALLBACK`。 |
| v14.10.0, v12.19.0 | 添加于: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 随机范围的起始（包含）。 **默认:** `0`。
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 随机范围的结束（不包含）。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`。

返回一个随机整数 `n`，使得 `min \<= n \< max`。 此实现避免了[模偏差](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias)。

范围 (`max - min`) 必须小于 2。 `min` 和 `max` 必须是[安全整数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)。

如果未提供 `callback` 函数，则同步生成随机整数。

::: code-group
```js [ESM]
// 异步
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`从 (0, 1, 2) 中选择的随机数: ${n}`);
});
```

```js [CJS]
// 异步
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`从 (0, 1, 2) 中选择的随机数: ${n}`);
});
```
:::

::: code-group
```js [ESM]
// 同步
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`从 (0, 1, 2) 中选择的随机数: ${n}`);
```

```js [CJS]
// 同步
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`从 (0, 1, 2) 中选择的随机数: ${n}`);
```
:::

::: code-group
```js [ESM]
// 带有 `min` 参数
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`骰子掷出: ${n}`);
```

```js [CJS]
// 带有 `min` 参数
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`骰子掷出: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Added in: v15.6.0, v14.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 默认情况下，为了提高性能，Node.js 会生成并缓存足够的随机数据，以生成最多 128 个随机 UUID。 要生成不使用缓存的 UUID，请将 `disableEntropyCache` 设置为 `true`。 **Default:** `false`。
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生成一个随机的 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) 版本 4 UUID。 UUID 使用加密伪随机数生成器生成。

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | 将无效的回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.0.0 | `password` 和 `salt` 参数也可以是 ArrayBuffer 实例。 |
| v12.8.0, v10.17.0 | `maxmem` 值现在可以是任何安全整数。 |
| v10.9.0 | 已添加 `cost`、`blockSize` 和 `parallelization` 选项名称。 |
| v10.5.0 | Added in: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/内存成本参数。 必须是大于 1 的 2 的幂。 **Default:** `16384`。
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 块大小参数。 **Default:** `8`。
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 并行化参数。 **Default:** `1`。
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `cost` 的别名。 只能指定两者之一。
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `blockSize` 的别名。 只能指定两者之一。
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `parallelization` 的别名。 只能指定两者之一。
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 内存上限。 当（大约）`128 * N * r \> maxmem` 时会出错。 **Default:** `32 * 1024 * 1024`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
  
 

提供异步的 [scrypt](https://en.wikipedia.org/wiki/Scrypt) 实现。 Scrypt 是一种基于密码的密钥派生函数，旨在在计算和内存方面都很昂贵，以使暴力攻击得不偿失。

`salt` 应该尽可能唯一。 建议 salt 是随机的并且至少 16 个字节长。 有关详细信息，请参见 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)。

当为 `password` 或 `salt` 传递字符串时，请考虑[使用字符串作为加密 API 的输入的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。

使用两个参数调用 `callback` 函数：`err` 和 `derivedKey`。 当密钥派生失败时，`err` 是一个异常对象，否则 `err` 为 `null`。 `derivedKey` 作为 [`Buffer`](/zh/nodejs/api/buffer) 传递给回调。

当任何输入参数指定无效值或类型时，会抛出异常。



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::


### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.8.0, v10.17.0 | `maxmem` 值现在可以是任何安全整数。 |
| v10.9.0 | 增加了 `cost`、`blockSize` 和 `parallelization` 选项名称。 |
| v10.5.0 | 添加于: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/内存成本参数。 必须是大于 1 的 2 的幂。 **默认值:** `16384`。
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 块大小参数。 **默认值:** `8`。
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 并行化参数。 **默认值:** `1`。
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `cost` 的别名。 只能指定两者中的一个。
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `blockSize` 的别名。 只能指定两者中的一个。
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `parallelization` 的别名。 只能指定两者中的一个。
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 内存上限。 当（近似地）`128 * N * r \> maxmem` 时会报错。 **默认值:** `32 * 1024 * 1024`。
  
 
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

提供同步的 [scrypt](https://en.wikipedia.org/wiki/Scrypt) 实现。 Scrypt 是一种基于密码的密钥派生函数，它在计算上和内存上都设计得非常昂贵，以使暴力攻击无法获得回报。

`salt` 应该尽可能唯一。 建议 salt 是随机的，并且至少 16 字节长。 详见 [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)。

当为 `password` 或 `salt` 传递字符串时，请考虑[使用字符串作为加密 API 输入时的注意事项](/zh/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis)。

当密钥派生失败时，会抛出一个异常，否则派生的密钥会以 [`Buffer`](/zh/nodejs/api/buffer) 的形式返回。

当任何输入参数指定无效的值或类型时，会抛出一个异常。

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// 使用出厂默认值。

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// 使用自定义 N 参数。 必须是 2 的幂。
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// 使用出厂默认值。

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// 使用自定义 N 参数。 必须是 2 的幂。
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Added in: v15.6.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 使用 `--secure-heap=n` 命令行标志指定的总分配安全堆大小。
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 使用 `--secure-heap-min` 命令行标志指定的安全堆的最小分配量。
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当前从安全堆分配的总字节数。
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 计算出的 `used` 与 `total` 分配字节数的比率。



### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | OpenSSL 3 中的自定义引擎支持已弃用。 |
| v0.11.11 | 添加于: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/zh/nodejs/api/crypto#cryptoconstants) **默认:** `crypto.constants.ENGINE_METHOD_ALL`

加载并为某些或所有 OpenSSL 函数（由 flags 选择）设置 `engine`。 从 OpenSSL 3 开始，对 OpenSSL 中自定义引擎的支持已弃用。

`engine` 可以是引擎共享库的 ID 或路径。

可选的 `flags` 参数默认使用 `ENGINE_METHOD_ALL`。 `flags` 是一个位字段，采用以下标志之一或组合（在 `crypto.constants` 中定义）：

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

**新增于: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` 以启用 FIPS 模式。

在启用 FIPS 的 Node.js 构建中启用符合 FIPS 的加密提供程序。如果 FIPS 模式不可用，则抛出错误。

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.12.0 | 添加了可选的回调参数。 |
| v13.2.0, v12.16.0 | 此函数现在支持 IEEE-P1363 DSA 和 ECDSA 签名。 |
| v12.0.0 | 新增于: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
  
 
- 返回: 如果未提供 `callback` 函数，则返回 [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)。

使用给定的私钥和算法计算并返回 `data` 的签名。 如果 `algorithm` 为 `null` 或 `undefined`，则算法取决于密钥类型（尤其是 Ed25519 和 Ed448）。

如果 `key` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就好像 `key` 已传递给 [`crypto.createPrivateKey()`](/zh/nodejs/api/crypto#cryptocreateprivatekeykey) 一样。 如果它是一个对象，则可以传递以下附加属性：

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 对于 DSA 和 ECDSA，此选项指定生成的签名的格式。 它可以是以下之一：
    - `'der'`（默认）：DER 编码的 ASN.1 签名结构，编码 `(r, s)`。
    - `'ieee-p1363'`：IEEE-P1363 中提出的签名格式 `r || s`。
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA 的可选填充值，以下之一：
    - `crypto.constants.RSA_PKCS1_PADDING`（默认）
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` 将使用 MGF1 和用于对消息进行签名的相同哈希函数，如 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) 的第 3.1 节中所述。
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 填充为 `RSA_PKCS1_PSS_PADDING` 时的盐长度。 特殊值 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` 将盐长度设置为摘要大小，`crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN`（默认）将其设置为允许的最大值。

如果提供了 `callback` 函数，则此函数使用 libuv 的线程池。


### `crypto.subtle` {#cryptosubtle}

**Added in: v17.4.0**

- 类型: [\<SubtleCrypto\>](/zh/nodejs/api/webcrypto#class-subtlecrypto)

[`crypto.webcrypto.subtle`](/zh/nodejs/api/webcrypto#class-subtlecrypto) 的便捷别名。

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | `a` 和 `b` 参数也可以是 ArrayBuffer。 |
| v6.6.0 | 添加于: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

此函数使用恒定时间算法比较表示给定 `ArrayBuffer`、`TypedArray` 或 `DataView` 实例的底层字节。

此函数不会泄漏定时信息，这些信息可能允许攻击者猜测其中一个值。 它适用于比较 HMAC 摘要或秘密值，如身份验证 cookie 或[能力网址](https://www.w3.org/TR/capability-urls/)。

`a` 和 `b` 必须都是 `Buffer`、`TypedArray` 或 `DataView`，并且它们必须具有相同的字节长度。 如果 `a` 和 `b` 具有不同的字节长度，则会抛出错误。

如果 `a` 和 `b` 中至少有一个是每个条目超过一个字节的 `TypedArray`，例如 `Uint16Array`，则结果将使用平台字节顺序计算。

**当两个输入都是 <code>Float32Array</code> 或
<code>Float64Array</code> 时，由于浮点数的 IEEE 754 编码，此函数可能会返回意外的结果。 特别是，<code>x === y</code> 和
<code>Object.is(x, y)</code> 都不意味着两个浮点数 <code>x</code> 和 <code>y</code> 的字节表示形式相等。**

使用 `crypto.timingSafeEqual` 并不能保证 *周围的* 代码是时间安全的。 应注意确保周围的代码不会引入时间漏洞。


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v15.12.0 | 添加了可选的回调函数参数。 |
| v15.0.0 | 数据、密钥和签名参数也可以是 ArrayBuffer。 |
| v13.2.0, v12.16.0 | 此函数现在支持 IEEE-P1363 DSA 和 ECDSA 签名。 |
| v12.0.0 | 添加于: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果未提供 `callback` 函数，则根据数据和公钥的签名的有效性返回 `true` 或 `false`。

使用给定的密钥和算法验证给定 `data` 的签名。 如果 `algorithm` 为 `null` 或 `undefined`，则该算法取决于密钥类型（尤其是 Ed25519 和 Ed448）。

如果 `key` 不是 [`KeyObject`](/zh/nodejs/api/crypto#class-keyobject)，则此函数的行为就像 `key` 已被传递给 [`crypto.createPublicKey()`](/zh/nodejs/api/crypto#cryptocreatepublickeykey) 一样。 如果它是一个对象，则可以传递以下附加属性：

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 对于 DSA 和 ECDSA，此选项指定签名的格式。 它可以是以下之一：
    - `'der'`（默认）：DER 编码的 ASN.1 签名结构，编码 `(r, s)`。
    - `'ieee-p1363'`: IEEE-P1363 中提出的签名格式 `r || s`。


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) RSA 的可选填充值，以下之一：
    - `crypto.constants.RSA_PKCS1_PADDING` (默认)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` 将使用 MGF1 以及与用于签名消息的相同的哈希函数，如 [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) 的第 3.1 节中所述。
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当填充为 `RSA_PKCS1_PSS_PADDING` 时的盐长度。 特殊值 `crypto.constants.RSA_PSS_SALTLEN_DIGEST` 将盐长度设置为摘要大小，`crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN`（默认）将其设置为最大允许值。

`signature` 参数是先前计算出的 `data` 的签名。

由于公钥可以从私钥派生，因此可以为 `key` 传递私钥或公钥。

如果提供了 `callback` 函数，则此函数使用 libuv 的线程池。


### `crypto.webcrypto` {#cryptowebcrypto}

**加入于: v15.0.0**

类型: [\<Crypto\>](/zh/nodejs/api/webcrypto#class-crypto) Web Crypto API 标准的实现。

有关详细信息，请参阅 [Web Crypto API 文档](/zh/nodejs/api/webcrypto)。

## 注释 {#notes}

### 使用字符串作为加密 API 的输入 {#using-strings-as-inputs-to-cryptographic-apis}

由于历史原因，Node.js 提供的许多加密 API 接受字符串作为输入，而底层加密算法则处理字节序列。这些实例包括明文、密文、对称密钥、初始化向量、密码、盐、身份验证标签和附加的身份验证数据。

当将字符串传递给加密 API 时，请考虑以下因素。

- 并非所有字节序列都是有效的 UTF-8 字符串。因此，当长度为 `n` 的字节序列从字符串派生时，其熵通常低于随机或伪随机 `n` 字节序列的熵。例如，没有 UTF-8 字符串会导致字节序列 `c0 af`。密钥几乎应专门使用随机或伪随机字节序列。
- 同样，当将随机或伪随机字节序列转换为 UTF-8 字符串时，不表示有效代码点的子序列可能会被 Unicode 替换字符 (`U+FFFD`) 替换。因此，生成的 Unicode 字符串的字节表示可能与创建该字符串的字节序列不相等。密码、哈希函数、签名算法和密钥派生函数的输出是伪随机字节序列，不应将其用作 Unicode 字符串。
- 当从用户输入获取字符串时，某些 Unicode 字符可以用多种等效方式表示，从而导致不同的字节序列。例如，当将用户密码传递给密钥派生函数（例如 PBKDF2 或 scrypt）时，密钥派生函数的结果取决于字符串是使用组合字符还是分解字符。Node.js 不会对字符表示进行规范化。开发人员应考虑在使用 [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) 将用户输入传递给加密 API 之前对其进行处理。


### 遗留流 API (Node.js 0.10 之前) {#legacy-streams-api-prior-to-nodejs-010}

Crypto 模块在 Node.js 中添加的时候，还没有统一的 Stream API 的概念，也没有用于处理二进制数据的 [`Buffer`](/zh/nodejs/api/buffer) 对象。 因此，许多 `crypto` 类都有在实现 [streams](/zh/nodejs/api/stream) API 的其他 Node.js 类上通常找不到的方法（例如 `update()`、`final()` 或 `digest()`）。 此外，许多方法默认接受和返回 `'latin1'` 编码的字符串，而不是 `Buffer`。 在 Node.js v0.8 之后，此默认设置已更改为默认使用 [`Buffer`](/zh/nodejs/api/buffer) 对象。

### 支持弱算法或已泄露的算法 {#support-for-weak-or-compromised-algorithms}

`node:crypto` 模块仍然支持一些已经泄露且不建议使用的算法。 该 API 还允许使用密钥长度过小而无法安全使用的密码和哈希。

用户应根据其安全要求完全负责选择加密算法和密钥长度。

基于 [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf) 的建议：

- 在需要抗冲突性的地方（如数字签名），不再接受 MD5 和 SHA-1。
- 建议与 RSA、DSA 和 DH 算法一起使用的密钥至少有 2048 位，而 ECDSA 和 ECDH 曲线的密钥至少有 224 位，以便安全使用几年。
- `modp1`、`modp2` 和 `modp5` 的 DH 组的密钥大小小于 2048 位，不建议使用。

请参阅参考资料以获取其他建议和详细信息。

一些具有已知弱点并且在实践中几乎不相关的算法只能通过[遗留提供程序](/zh/nodejs/api/cli#--openssl-legacy-provider)获得，该提供程序默认情况下未启用。

### CCM 模式 {#ccm-mode}

CCM 是受支持的 [AEAD 算法](https://en.wikipedia.org/wiki/Authenticated_encryption) 之一。 使用此模式的应用程序在使用密码 API 时必须遵守某些限制：

- 身份验证标签长度必须在密码创建期间通过设置 `authTagLength` 选项来指定，并且必须是 4、6、8、10、12、14 或 16 字节之一。
- 初始化向量 (nonce) `N` 的长度必须在 7 到 13 字节之间 (`7 ≤ N ≤ 13`)。
- 明文的长度限制为 `2 ** (8 * (15 - N))` 字节。
- 解密时，必须在调用 `update()` 之前通过 `setAuthTag()` 设置身份验证标签。 否则，解密将失败，并且 `final()` 将按照 [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt) 的第 2.6 节中的规定抛出错误。
- 在 CCM 模式下使用 `write(data)`、`end(data)` 或 `pipe()` 等流方法可能会失败，因为 CCM 无法处理每个实例的多个数据块。
- 传递附加的身份验证数据 (AAD) 时，消息的实际长度（以字节为单位）必须通过 `plaintextLength` 选项传递给 `setAAD()`。 许多加密库在密文中包含身份验证标签，这意味着它们生成的密文长度为 `plaintextLength + authTagLength`。 Node.js 不包含身份验证标签，因此密文长度始终为 `plaintextLength`。 如果未使用 AAD，则不需要这样做。
- 由于 CCM 一次处理整个消息，因此必须恰好调用一次 `update()`。
- 即使调用 `update()` 足以加密/解密消息，应用程序*必须*调用 `final()` 来计算或验证身份验证标签。

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


### FIPS 模式 {#fips-mode}

当使用 OpenSSL 3 时，如果与适当的 OpenSSL 3 提供程序一起使用，Node.js 支持 FIPS 140-2，例如来自 [OpenSSL 3 的 FIPS 提供程序](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider)，可以通过遵循 [OpenSSL 的 FIPS README 文件](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md) 中的说明进行安装。

要在 Node.js 中获得 FIPS 支持，您需要：

- 正确安装的 OpenSSL 3 FIPS 提供程序。
- OpenSSL 3 [FIPS 模块配置文件](https://www.openssl.org/docs/man3.0/man5/fips_config)。
- 引用 FIPS 模块配置文件的 OpenSSL 3 配置文件。

需要使用指向 FIPS 提供程序的 OpenSSL 配置文件来配置 Node.js。一个示例配置文件如下所示：

```text [TEXT]
nodejs_conf = nodejs_init

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# fips 节的名称应与 {#the-fips-section-name-should-match-the-section-name-inside-the}
# 包含的 fipsmodule.cnf 中的节名称匹配。
fips = fips_sect

[default_sect]
activate = 1
```
其中 `fipsmodule.cnf` 是从 FIPS 提供程序安装步骤生成的 FIPS 模块配置文件：

```bash [BASH]
openssl fipsinstall
```
设置 `OPENSSL_CONF` 环境变量以指向您的配置文件，并将 `OPENSSL_MODULES` 设置为 FIPS 提供程序动态库的位置。例如：

```bash [BASH]
export OPENSSL_CONF=/<path to configuration file>/nodejs.cnf
export OPENSSL_MODULES=/<path to openssl lib>/ossl-modules
```
然后可以通过以下方式在 Node.js 中启用 FIPS 模式：

- 使用 `--enable-fips` 或 `--force-fips` 命令行标志启动 Node.js。
- 以编程方式调用 `crypto.setFips(true)`。

或者，可以通过 OpenSSL 配置文件在 Node.js 中启用 FIPS 模式。例如：

```text [TEXT]
nodejs_conf = nodejs_init

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# fips 节的名称应与 {#included-fipsmodulecnf}
# 包含的 fipsmodule.cnf 中的节名称匹配。
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## 加密常量 {#the-fips-section-name-should-match-the-section-name-inside-the_1}

以下由 `crypto.constants` 导出的常量适用于 `node:crypto`、`node:tls` 和 `node:https` 模块的各种用途，并且通常特定于 OpenSSL。

### OpenSSL 选项 {#included-fipsmodulecnf_1}

有关详细信息，请参阅 [SSL OP 标志列表](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options)。

| 常量 | 描述 |
| --- | --- |
| `SSL_OP_ALL` | 在 OpenSSL 中应用多个错误修复。 有关详细信息，请参阅 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)。 |
| `SSL_OP_ALLOW_NO_DHE_KEX` | 指示 OpenSSL 允许 TLS v1.3 使用非 [EC]DHE 的密钥交换模式。 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | 允许 OpenSSL 和未打补丁的客户端或服务器之间进行旧版不安全重协商。 有关详细信息，请参阅 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)。 |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | 尝试在使用密码时使用服务器的偏好而不是客户端的偏好。 行为取决于协议版本。 有关详细信息，请参阅 [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)。 |
| `SSL_OP_CISCO_ANYCONNECT` | 指示 OpenSSL 使用 Cisco 的 DTLS_BAD_VER 版本标识符。 |
| `SSL_OP_COOKIE_EXCHANGE` | 指示 OpenSSL 开启 Cookie 交换。 |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | 指示 OpenSSL 从早期版本的 cryptopro 草案中添加 server-hello 扩展。 |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | 指示 OpenSSL 禁用 OpenSSL 0.9.6d 中添加的 SSL 3.0/TLS 1.0 漏洞修复。 |
| `SSL_OP_LEGACY_SERVER_CONNECT` | 允许初始连接到不支持 RI 的服务器。 |
| `SSL_OP_NO_COMPRESSION` | 指示 OpenSSL 禁用对 SSL/TLS 压缩的支持。 |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | 指示 OpenSSL 禁用 encrypt-then-MAC。 |
| `SSL_OP_NO_QUERY_MTU` |  |
| `SSL_OP_NO_RENEGOTIATION` | 指示 OpenSSL 禁用重新协商。 |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | 指示 OpenSSL 在执行重新协商时始终启动一个新会话。 |
| `SSL_OP_NO_SSLv2` | 指示 OpenSSL 关闭 SSL v2。 |
| `SSL_OP_NO_SSLv3` | 指示 OpenSSL 关闭 SSL v3。 |
| `SSL_OP_NO_TICKET` | 指示 OpenSSL 禁用 RFC4507bis 票证的使用。 |
| `SSL_OP_NO_TLSv1` | 指示 OpenSSL 关闭 TLS v1。 |
| `SSL_OP_NO_TLSv1_1` | 指示 OpenSSL 关闭 TLS v1.1。 |
| `SSL_OP_NO_TLSv1_2` | 指示 OpenSSL 关闭 TLS v1.2。 |
| `SSL_OP_NO_TLSv1_3` | 指示 OpenSSL 关闭 TLS v1.3。 |
| `SSL_OP_PRIORITIZE_CHACHA` | 指示 OpenSSL 服务器在客户端这样做时优先使用 ChaCha20-Poly1305。 如果未启用 `SSL_OP_CIPHER_SERVER_PREFERENCE`，则此选项无效。 |
| `SSL_OP_TLS_ROLLBACK_BUG` | 指示 OpenSSL 禁用版本回滚攻击检测。 |


### OpenSSL 引擎常量 {#crypto-constants}

| 常量 | 描述 |
| --- | --- |
| `ENGINE_METHOD_RSA` | 限制引擎使用于 RSA |
| `ENGINE_METHOD_DSA` | 限制引擎使用于 DSA |
| `ENGINE_METHOD_DH` | 限制引擎使用于 DH |
| `ENGINE_METHOD_RAND` | 限制引擎使用于 RAND |
| `ENGINE_METHOD_EC` | 限制引擎使用于 EC |
| `ENGINE_METHOD_CIPHERS` | 限制引擎使用于 CIPHERS |
| `ENGINE_METHOD_DIGESTS` | 限制引擎使用于 DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | 限制引擎使用于 PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | 限制引擎使用于 PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### 其他 OpenSSL 常量 {#openssl-options}

| 常量 | 描述 |
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
| `RSA_PSS_SALTLEN_DIGEST` | 为 `RSA_PKCS1_PSS_PADDING` 设置盐长度为签名或验证时的摘要大小。 |
| `RSA_PSS_SALTLEN_MAX_SIGN` | 为 `RSA_PKCS1_PSS_PADDING` 设置盐长度为签名数据时允许的最大值。 |
| `RSA_PSS_SALTLEN_AUTO` | 使 `RSA_PKCS1_PSS_PADDING` 的盐长度在验证签名时自动确定。 |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Node.js crypto 常量 {#openssl-engine-constants}

| 常量 | 描述 |
| --- | --- |
| `defaultCoreCipherList` | 指定 Node.js 使用的内置默认密码列表。 |
| `defaultCipherList` | 指定当前 Node.js 进程使用的活动默认密码列表。 |

