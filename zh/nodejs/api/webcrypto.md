---
title: Node.js Web Crypto API
description: Node.js Web Crypto API 提供了一套用于安全通信和数据完整性的加密功能，包括密钥生成、加密、解密、签名和验证。
head:
  - - meta
    - name: og:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js Web Crypto API 提供了一套用于安全通信和数据完整性的加密功能，包括密钥生成、加密、解密、签名和验证。
  - - meta
    - name: twitter:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js Web Crypto API 提供了一套用于安全通信和数据完整性的加密功能，包括密钥生成、加密、解密、签名和验证。
---


# Web Crypto API {#web-crypto-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 算法 `Ed25519` 和 `X25519` 现在已稳定。 |
| v19.0.0 | 除了 `Ed25519`、`Ed448`、`X25519` 和 `X448` 算法之外，不再是实验性的。 |
| v20.0.0, v18.17.0 | 参数现在根据其 WebIDL 定义进行强制转换和验证，就像在其他 Web Crypto API 实现中一样。 |
| v18.4.0, v16.17.0 | 删除了专有的 `'node.keyObject'` 导入/导出格式。 |
| v18.4.0, v16.17.0 | 删除了专有的 `'NODE-DSA'`、`'NODE-DH'` 和 `'NODE-SCRYPT'` 算法。 |
| v18.4.0, v16.17.0 | 添加了 `'Ed25519'`、`'Ed448'`、`'X25519'` 和 `'X448'` 算法。 |
| v18.4.0, v16.17.0 | 删除了专有的 `'NODE-ED25519'` 和 `'NODE-ED448'` 算法。 |
| v18.4.0, v16.17.0 | 从 `'ECDH'` 算法中删除了专有的 `'NODE-X25519'` 和 `'NODE-X448'` 命名曲线。 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

Node.js 提供了标准 [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) 的实现。

使用 `globalThis.crypto` 或 `require('node:crypto').webcrypto` 访问此模块。

```js [ESM]
const { subtle } = globalThis.crypto;

(async function() {

  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const enc = new TextEncoder();
  const message = enc.encode('I love cupcakes');

  const digest = await subtle.sign({
    name: 'HMAC',
  }, key, message);

})();
```
## 示例 {#examples}

### 生成密钥 {#generating-keys}

[\<SubtleCrypto\>](/zh/nodejs/api/webcrypto#class-subtlecrypto) 类可用于生成对称（秘密）密钥或非对称密钥对（公钥和私钥）。

#### AES 密钥 {#aes-keys}

```js [ESM]
const { subtle } = globalThis.crypto;

async function generateAesKey(length = 256) {
  const key = await subtle.generateKey({
    name: 'AES-CBC',
    length,
  }, true, ['encrypt', 'decrypt']);

  return key;
}
```

#### ECDSA 密钥对 {#ecdsa-key-pairs}

```js [ESM]
const { subtle } = globalThis.crypto;

async function generateEcKey(namedCurve = 'P-521') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'ECDSA',
    namedCurve,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}
```
#### Ed25519/X25519 密钥对 {#ed25519/x25519-key-pairs}

```js [ESM]
const { subtle } = globalThis.crypto;

async function generateEd25519Key() {
  return subtle.generateKey({
    name: 'Ed25519',
  }, true, ['sign', 'verify']);
}

async function generateX25519Key() {
  return subtle.generateKey({
    name: 'X25519',
  }, true, ['deriveKey']);
}
```
#### HMAC 密钥 {#hmac-keys}

```js [ESM]
const { subtle } = globalThis.crypto;

async function generateHmacKey(hash = 'SHA-256') {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return key;
}
```
#### RSA 密钥对 {#rsa-key-pairs}

```js [ESM]
const { subtle } = globalThis.crypto;
const publicExponent = new Uint8Array([1, 0, 1]);

async function generateRsaKey(modulusLength = 2048, hash = 'SHA-256') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength,
    publicExponent,
    hash,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}
```
### 加密和解密 {#encryption-and-decryption}

```js [ESM]
const crypto = globalThis.crypto;

async function aesEncrypt(plaintext) {
  const ec = new TextEncoder();
  const key = await generateAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const ciphertext = await crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv,
  }, key, ec.encode(plaintext));

  return {
    key,
    iv,
    ciphertext,
  };
}

async function aesDecrypt(ciphertext, key, iv) {
  const dec = new TextDecoder();
  const plaintext = await crypto.subtle.decrypt({
    name: 'AES-CBC',
    iv,
  }, key, ciphertext);

  return dec.decode(plaintext);
}
```
### 导出和导入密钥 {#exporting-and-importing-keys}

```js [ESM]
const { subtle } = globalThis.crypto;

async function generateAndExportHmacKey(format = 'jwk', hash = 'SHA-512') {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return subtle.exportKey(format, key);
}

async function importHmacKey(keyData, format = 'jwk', hash = 'SHA-512') {
  const key = await subtle.importKey(format, keyData, {
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return key;
}
```

### 包装和解包密钥 {#wrapping-and-unwrapping-keys}

```js [ESM]
const { subtle } = globalThis.crypto;

async function generateAndWrapHmacKey(format = 'jwk', hash = 'SHA-512') {
  const [
    key,
    wrappingKey,
  ] = await Promise.all([
    subtle.generateKey({
      name: 'HMAC', hash,
    }, true, ['sign', 'verify']),
    subtle.generateKey({
      name: 'AES-KW',
      length: 256,
    }, true, ['wrapKey', 'unwrapKey']),
  ]);

  const wrappedKey = await subtle.wrapKey(format, key, wrappingKey, 'AES-KW');

  return { wrappedKey, wrappingKey };
}

async function unwrapHmacKey(
  wrappedKey,
  wrappingKey,
  format = 'jwk',
  hash = 'SHA-512') {

  const key = await subtle.unwrapKey(
    format,
    wrappedKey,
    wrappingKey,
    'AES-KW',
    { name: 'HMAC', hash },
    true,
    ['sign', 'verify']);

  return key;
}
```
### 签名和验证 {#sign-and-verify}

```js [ESM]
const { subtle } = globalThis.crypto;

async function sign(key, data) {
  const ec = new TextEncoder();
  const signature =
    await subtle.sign('RSASSA-PKCS1-v1_5', key, ec.encode(data));
  return signature;
}

async function verify(key, signature, data) {
  const ec = new TextEncoder();
  const verified =
    await subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature,
      ec.encode(data));
  return verified;
}
```
### 派生位和密钥 {#deriving-bits-and-keys}

```js [ESM]
const { subtle } = globalThis.crypto;

async function pbkdf2(pass, salt, iterations = 1000, length = 256) {
  const ec = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveBits']);
  const bits = await subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-512',
    salt: ec.encode(salt),
    iterations,
  }, key, length);
  return bits;
}

async function pbkdf2Key(pass, salt, iterations = 1000, length = 256) {
  const ec = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveKey']);
  const key = await subtle.deriveKey({
    name: 'PBKDF2',
    hash: 'SHA-512',
    salt: ec.encode(salt),
    iterations,
  }, keyMaterial, {
    name: 'AES-GCM',
    length,
  }, true, ['encrypt', 'decrypt']);
  return key;
}
```

### 摘要 {#digest}

```js [ESM]
const { subtle } = globalThis.crypto;

async function digest(data, algorithm = 'SHA-512') {
  const ec = new TextEncoder();
  const digest = await subtle.digest(algorithm, ec.encode(data));
  return digest;
}
```
## 算法矩阵 {#algorithm-matrix}

下表详细列出了 Node.js Web Crypto API 实现支持的算法以及每个算法支持的 API：

| 算法 | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'RSA-PSS'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'RSA-OAEP'` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ ||||||
| `'ECDSA'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'Ed25519'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'Ed448'`        | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'ECDH'` | ✔ | ✔ | ✔ ||||| ✔ | ✔ ||||
| `'X25519'` | ✔ | ✔ | ✔ ||||| ✔ | ✔ ||||
| `'X448'`        | ✔ | ✔ | ✔ ||||| ✔ | ✔ ||||
| `'AES-CTR'` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ ||||||
| `'AES-CBC'` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ ||||||
| `'AES-GCM'` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ ||||||
| `'AES-KW'` | ✔ | ✔ | ✔ ||| ✔ | ✔ ||||||
| `'HMAC'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'HKDF'` || ✔ | ✔ ||||| ✔ | ✔ ||||
| `'PBKDF2'` || ✔ | ✔ ||||| ✔ | ✔ ||||
| `'SHA-1'` |||||||||||| ✔ |
| `'SHA-256'` |||||||||||| ✔ |
| `'SHA-384'` |||||||||||| ✔ |
| `'SHA-512'` |||||||||||| ✔ |
## 类：`Crypto` {#class-crypto}

**添加于: v15.0.0**

`globalThis.crypto` 是 `Crypto` 类的一个实例。`Crypto` 是一个单例，它提供对 crypto API 其余部分的访问。

### `crypto.subtle` {#cryptosubtle}

**添加于: v15.0.0**

- 类型: [\<SubtleCrypto\>](/zh/nodejs/api/webcrypto#class-subtlecrypto)

提供对 `SubtleCrypto` API 的访问。

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**添加于: v15.0.0**

- `typedArray` [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- 返回: [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

生成密码学上强随机的值。 给定的 `typedArray` 填充了随机值，并返回对 `typedArray` 的引用。

给定的 `typedArray` 必须是基于整数的 [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 实例，即不接受 `Float32Array` 和 `Float64Array`。

如果给定的 `typedArray` 大于 65,536 字节，则会抛出一个错误。


### `crypto.randomUUID()` {#cryptorandomuuid}

**Added in: v16.7.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

生成一个随机的 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID。 该 UUID 使用加密伪随机数生成器生成。

## 类: `CryptoKey` {#class-cryptokey}

**Added in: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Added in: v15.0.0**

- 类型: [\<AesKeyGenParams\>](/zh/nodejs/api/webcrypto#class-aeskeygenparams) | [\<RsaHashedKeyGenParams\>](/zh/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/zh/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/zh/nodejs/api/webcrypto#class-hmackeygenparams)

一个对象，详细说明了密钥可使用的算法以及其他特定于算法的参数。

只读。

### `cryptoKey.extractable` {#cryptokeyextractable}

**Added in: v15.0.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

当 `true` 时，可以使用 `subtleCrypto.exportKey()` 或 `subtleCrypto.wrapKey()` 提取 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)。

只读。

### `cryptoKey.type` {#cryptokeytype}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'secret'`、`'private'` 或 `'public'` 之一。

一个字符串，用于标识密钥是对称密钥 (`'secret'`) 还是非对称密钥 (`'private'` 或 `'public'`)。

### `cryptoKey.usages` {#cryptokeyusages}

**Added in: v15.0.0**

- 类型: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

一个字符串数组，用于标识密钥可以使用的操作。

可能的用法有：

- `'encrypt'` - 密钥可用于加密数据。
- `'decrypt'` - 密钥可用于解密数据。
- `'sign'` - 密钥可用于生成数字签名。
- `'verify'` - 密钥可用于验证数字签名。
- `'deriveKey'` - 密钥可用于派生新密钥。
- `'deriveBits'` - 密钥可用于派生位。
- `'wrapKey'` - 密钥可用于包装另一个密钥。
- `'unwrapKey'` - 密钥可用于解包另一个密钥。

有效的密钥用法取决于密钥算法（由 `cryptokey.algorithm.name` 标识）。

| 密钥类型 | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `'AES-CBC'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'AES-CTR'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'AES-GCM'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'AES-KW'` ||||||| ✔ | ✔ |
| `'ECDH'` ||||| ✔ | ✔ |||
| `'X25519'` ||||| ✔ | ✔ |||
| `'X448'`        ||||| ✔ | ✔ |||
| `'ECDSA'` ||| ✔ | ✔ |||||
| `'Ed25519'` ||| ✔ | ✔ |||||
| `'Ed448'`        ||| ✔ | ✔ |||||
| `'HDKF'` ||||| ✔ | ✔ |||
| `'HMAC'` ||| ✔ | ✔ |||||
| `'PBKDF2'` ||||| ✔ | ✔ |||
| `'RSA-OAEP'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'RSA-PSS'` ||| ✔ | ✔ |||||
| `'RSASSA-PKCS1-v1_5'` ||| ✔ | ✔ |||||

## 类: `CryptoKeyPair` {#class-cryptokeypair}

**添加于: v15.0.0**

`CryptoKeyPair` 是一个简单的字典对象，包含 `publicKey` 和 `privateKey` 属性，表示非对称密钥对。

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**添加于: v15.0.0**

- 类型: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)，其 `type` 将为 `'private'`。

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**添加于: v15.0.0**

- 类型: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)，其 `type` 将为 `'public'`。

## 类: `SubtleCrypto` {#class-subtlecrypto}

**添加于: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**添加于: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/zh/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/zh/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/zh/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/zh/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 返回一个解决后的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

使用 `algorithm` 中指定的方法和参数，以及 `key` 提供的密钥材料，`subtle.decrypt()` 尝试解密提供的 `data`。 如果成功，返回的 promise 将被解析为一个包含明文结果的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

目前支持的算法包括：

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(算法, baseKey[, 长度])` {#subtlederivebitsalgorithm-basekey-length}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.5.0, v20.17.0 | 对于 `'ECDH'`、`'X25519'` 和 `'X448'`，长度参数现在是可选的。 |
| v18.4.0, v16.17.0 | 添加了 `'X25519'` 和 `'X448'` 算法。 |
| v15.0.0 | 添加于：v15.0.0 |
:::

- `算法`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/zh/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/zh/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/zh/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `长度`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **默认:** `null`
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功解析为一个 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

使用 `算法` 中指定的方法和参数，以及 `baseKey` 提供的密钥材料，`subtle.deriveBits()` 尝试生成 `长度` 位。

当未提供 `长度` 或 `长度` 为 `null` 时，将为给定的算法生成最大位数的位。 这允许用于 `'ECDH'`、`'X25519'` 和 `'X448'` 算法，对于其他算法，`长度` 必须是一个数字。

如果成功，返回的 promise 将解析为一个包含生成数据的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

目前支持的算法包括：

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(算法, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.4.0, v16.17.0 | 添加了 `'X25519'` 和 `'X448'` 算法。 |
| v15.0.0 | 添加于：v15.0.0 |
:::

- `算法`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/zh/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/zh/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/zh/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/zh/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/zh/nodejs/api/webcrypto#class-aeskeygenassistparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请参阅 [密钥用法](/zh/nodejs/api/webcrypto#cryptokeyusages)。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功解析为一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)

使用 `算法` 中指定的方法和参数，以及 `baseKey` 提供的密钥材料，`subtle.deriveKey()` 尝试基于 `derivedKeyAlgorithm` 中的方法和参数生成一个新的 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)。

调用 `subtle.deriveKey()` 相当于调用 `subtle.deriveBits()` 生成原始密钥材料，然后使用 `deriveKeyAlgorithm`、`extractable` 和 `keyUsages` 参数作为输入，将结果传递到 `subtle.importKey()` 方法中。

目前支持的算法包括：

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**新增于: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会返回一个包含计算出的摘要的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

`subtle.digest()` 尝试使用 `algorithm` 标识的方法来生成 `data` 的摘要。 如果成功，返回的 promise 会解析为一个包含计算出的摘要的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

如果 `algorithm` 以 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 形式提供，则它必须是以下之一：

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果 `algorithm` 以 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 形式提供，则它必须具有一个 `name` 属性，其值是上述之一。

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**新增于: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/zh/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/zh/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/zh/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/zh/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会返回一个包含加密结果的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

`subtle.encrypt()` 尝试使用 `algorithm` 指定的方法和参数以及 `key` 提供的密钥材料来加密 `data`。 如果成功，返回的 promise 会解析为一个包含加密结果的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

目前支持的算法包括：

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.4.0, v16.17.0 | 添加了 `'Ed25519'`、`'Ed448'`、`'X25519'` 和 `'X448'` 算法。 |
| v15.9.0 | 移除 `'NODE-DSA'` JWK 导出。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'raw'`、`'pkcs8'`、`'spki'` 或 `'jwk'` 之一。
- `key`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- 返回值: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 使用 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 完成。

如果支持，将给定的密钥导出为指定的格式。

如果 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 不可提取，则返回的 promise 将会被拒绝。

当 `format` 为 `'pkcs8'` 或 `'spki'` 并且导出成功时，返回的 promise 将会使用包含导出密钥数据的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 来解决。

当 `format` 为 `'jwk'` 并且导出成功时，返回的 promise 将会使用符合 [JSON Web Key](https://tools.ietf.org/html/rfc7517) 规范的 JavaScript 对象来解决。

| 密钥类型 | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
| --- | --- | --- | --- | --- |
| `'AES-CBC'` ||| ✔ | ✔ |
| `'AES-CTR'` ||| ✔ | ✔ |
| `'AES-GCM'` ||| ✔ | ✔ |
| `'AES-KW'` ||| ✔ | ✔ |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed448'`        | ✔ | ✔ | ✔ | ✔ |
| `'HDKF'` |||||
| `'HMAC'` ||| ✔ | ✔ |
| `'PBKDF2'` |||||
| `'RSA-OAEP'` | ✔ | ✔ | ✔ ||
| `'RSA-PSS'` | ✔ | ✔ | ✔ ||
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ ||
### `subtle.generateKey(algorithm, extractable, keyUsages)` {#subtlegeneratekeyalgorithm-extractable-keyusages}

**添加于: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/zh/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/zh/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/zh/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/zh/nodejs/api/webcrypto#class-aeskeygenassistparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [密钥用途](/zh/nodejs/api/webcrypto#cryptokeyusages)。
- 返回值: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 使用 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/zh/nodejs/api/webcrypto#class-cryptokeypair) 完成。

使用 `algorithm` 中提供的方法和参数，`subtle.generateKey()` 尝试生成新的密钥材料。 根据所使用的方法，该方法可能生成单个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 或 [\<CryptoKeyPair\>](/zh/nodejs/api/webcrypto#class-cryptokeypair)。

支持生成 [\<CryptoKeyPair\>](/zh/nodejs/api/webcrypto#class-cryptokeypair)（公钥和私钥）的算法包括：

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

支持生成 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)（密钥）的算法包括：

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.4.0, v16.17.0 | 添加了 `'Ed25519'`、`'Ed448'`、`'X25519'` 和 `'X448'` 算法。 |
| v15.9.0 | 移除 `'NODE-DSA'` JWK 导入。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'raw'`、`'pkcs8'`、`'spki'` 或 `'jwk'` 之一。
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/zh/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/zh/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/zh/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [密钥用途](/zh/nodejs/api/webcrypto#cryptokeyusages)。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会返回一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)

`subtle.importKey()` 方法尝试将提供的 `keyData` 解释为给定的 `format`，以使用提供的 `algorithm`、`extractable` 和 `keyUsages` 参数创建一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 实例。 如果导入成功，返回的 promise 将被解析为创建的 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)。

如果导入 `'PBKDF2'` 密钥，则 `extractable` 必须为 `false`。

当前支持的算法包括：

| 密钥类型 | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
| --- | --- | --- | --- | --- |
| `'AES-CBC'` ||| ✔ | ✔ |
| `'AES-CTR'` ||| ✔ | ✔ |
| `'AES-GCM'` ||| ✔ | ✔ |
| `'AES-KW'` ||| ✔ | ✔ |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |
| `'X25519'` | ✔ | ✔ | ✔ | ✔ |
| `'X448'` | ✔ | ✔ | ✔ | ✔ |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed448'` | ✔ | ✔ | ✔ | ✔ |
| `'HDKF'` |||| ✔ |
| `'HMAC'` ||| ✔ | ✔ |
| `'PBKDF2'` |||| ✔ |
| `'RSA-OAEP'` | ✔ | ✔ | ✔ ||
| `'RSA-PSS'` | ✔ | ✔ | ✔ ||
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ ||

### `subtle.sign(algorithm, key, data)` {#subtlesignalgorithm-key-data}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.4.0, v16.17.0 | 添加了 `'Ed25519'` 和 `'Ed448'` 算法。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/zh/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/zh/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/zh/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会返回一个包含生成的签名的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

`subtle.sign()` 使用 `algorithm` 给定的方法和参数以及 `key` 提供的密钥材料，尝试生成 `data` 的密码签名。 如果成功，则返回的 promise 会解析为一个包含生成的签名的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

目前支持的算法包括:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**添加于: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'raw'`、`'pkcs8'`、`'spki'` 或 `'jwk'` 之一。
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/zh/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/zh/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/zh/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/zh/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/zh/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/zh/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/zh/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 参见 [密钥用途](/zh/nodejs/api/webcrypto#cryptokeyusages)。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成时会返回一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)。

在密码学中，“包装密钥”指的是导出然后加密密钥材料。 `subtle.unwrapKey()` 方法尝试解密包装的密钥并创建一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 实例。 它等效于首先对加密的密钥数据调用 `subtle.decrypt()`（使用 `wrappedKey`、`unwrapAlgo` 和 `unwrappingKey` 参数作为输入），然后使用 `unwrappedKeyAlgo`、`extractable` 和 `keyUsages` 参数作为输入将结果传递给 `subtle.importKey()` 方法。 如果成功，则返回的 promise 会解析为一个 [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 对象。

当前支持的包装算法包括:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

支持的解包密钥算法包括:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.verify(algorithm, key, signature, data)` {#subtleverifyalgorithm-key-signature-data}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.4.0, v16.17.0 | 添加了 `'Ed25519'` 和 `'Ed448'` 算法。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/zh/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/zh/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/zh/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会返回一个 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`subtle.verify()` 使用 `algorithm` 中给定的方法和参数以及 `key` 提供的密钥材料，尝试验证 `signature` 是否为 `data` 的有效加密签名。返回的 Promise 将解析为 `true` 或 `false`。

当前支持的算法包括：

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**添加于: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'raw'`、`'pkcs8'`、`'spki'` 或 `'jwk'` 之一。
- `key`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/zh/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/zh/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/zh/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/zh/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/zh/nodejs/api/webcrypto#class-aesgcmparams)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功时会返回一个 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

在密码学中，“包装密钥”是指导出然后加密密钥材料。`subtle.wrapKey()` 方法将密钥材料导出为 `format` 标识的格式，然后使用 `wrapAlgo` 指定的方法和参数以及 `wrappingKey` 提供的密钥材料对其进行加密。它等效于使用 `format` 和 `key` 作为参数调用 `subtle.exportKey()`，然后将结果传递给 `subtle.encrypt()` 方法，使用 `wrappingKey` 和 `wrapAlgo` 作为输入。如果成功，返回的 Promise 将解析为一个包含加密密钥数据的 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

当前支持的包装算法包括：

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## 算法参数 {#algorithm-parameters}

算法参数对象定义了各种 [\<SubtleCrypto\>](/zh/nodejs/api/webcrypto#class-subtlecrypto) 方法使用的方法和参数。虽然此处描述为“类”，但它们是简单的 JavaScript 字典对象。

### 类: `AlgorithmIdentifier` {#class-algorithmidentifier}

**新增于: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**新增于: v18.4.0, v16.17.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### 类: `AesCbcParams` {#class-aescbcparams}

**新增于: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

提供初始化向量。它必须恰好是 16 字节长，并且应该是不可预测的并且是密码学安全的随机数。

#### `aesCbcParams.name` {#aescbcparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'AES-CBC'`。

### 类: `AesCtrParams` {#class-aesctrparams}

**新增于: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

计数器块的初始值。这必须是 16 字节长。

`AES-CTR` 方法使用块的最右边的 `length` 位作为计数器，其余位作为 nonce。

#### `aesCtrParams.length` {#aesctrparamslength}

**新增于: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `aesCtrParams.counter` 中用作计数器的位数。


#### `aesCtrParams.name` {#aesctrparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'AES-CTR'`。

### 类: `AesGcmParams` {#class-aesgcmparams}

**新增于: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

使用 AES-GCM 方法时，`additionalData` 是额外的输入，它不会被加密，但会包含在数据的认证中。 `additionalData` 的使用是可选的。

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

对于使用给定密钥的每次加密操作，初始化向量都必须是唯一的。

理想情况下，这是一个确定的 12 字节值，其计算方式应确保在使用相同密钥的所有调用中都是唯一的。或者，初始化向量可以由至少 12 个密码学上随机的字节组成。 有关构建 AES-GCM 的初始化向量的更多信息，请参阅 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) 的第 8 节。

#### `aesGcmParams.name` {#aesgcmparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'AES-GCM'`。


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Added in: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成的认证标签的大小（以位为单位）。此值必须是 `32`、`64`、`96`、`104`、`112`、`120` 或 `128` 之一。**默认值:** `128`。

### 类: `AesKeyGenParams` {#class-aeskeygenparams}

**Added in: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Added in: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

要生成的 AES 密钥的长度。这必须是 `128`、`192` 或 `256` 之一。

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'AES-CBC'`、`'AES-CTR'`、`'AES-GCM'` 或 `'AES-KW'` 之一

### 类: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Added in: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'ECDH'`、`'X25519'` 或 `'X448'`。

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Added in: v15.0.0**

- 类型: [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)

ECDH 密钥派生通过将一方的私钥和另一方的公钥作为输入来进行操作 -- 使用两者来生成一个共同的共享密钥。`ecdhKeyDeriveParams.public` 属性设置为另一方的公钥。

### 类: `EcdsaParams` {#class-ecdsaparams}

**Added in: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须是以下之一：

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。


#### `ecdsaParams.name` {#ecdsaparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'ECDSA'`。

### 类: `EcKeyGenParams` {#class-eckeygenparams}

**新增于: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'ECDSA'` 或 `'ECDH'` 之一。

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'P-256'`、`'P-384'` 或 `'P-521'` 之一。

### 类: `EcKeyImportParams` {#class-eckeyimportparams}

**新增于: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'ECDSA'` 或 `'ECDH'` 之一。

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'P-256'`、`'P-384'` 或 `'P-521'` 之一。

### 类: `Ed448Params` {#class-ed448params}

**新增于: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**新增于: v18.4.0, v16.17.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'Ed448'`。

#### `ed448Params.context` {#ed448paramscontext}

**新增于: v18.4.0, v16.17.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`context` 成员表示与消息关联的可选上下文数据。 Node.js Web Crypto API 实现仅支持零长度上下文，这等效于根本不提供上下文。


### 类: `HkdfParams` {#class-hkdfparams}

**新增于: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须是以下之一：

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。

#### `hkdfParams.info` {#hkdfparamsinfo}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

为 HKDF 算法提供特定于应用程序的上下文输入。这可以是零长度，但必须提供。

#### `hkdfParams.name` {#hkdfparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'HKDF'`。

#### `hkdfParams.salt` {#hkdfparamssalt}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

salt 值可显著提高 HKDF 算法的强度。它应该是随机或伪随机的，并且长度应与摘要函数的输出长度相同（例如，如果使用 `'SHA-256'` 作为摘要，则 salt 应该是 256 位的随机数据）。


### 类: `HmacImportParams` {#class-hmacimportparams}

**添加于: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**添加于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须为以下之一:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。

#### `hmacImportParams.length` {#hmacimportparamslength}

**添加于: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HMAC 密钥的可选位数。 这是可选的，在大多数情况下应该省略。

#### `hmacImportParams.name` {#hmacimportparamsname}

**添加于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'HMAC'`。

### 类: `HmacKeyGenParams` {#class-hmackeygenparams}

**添加于: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**添加于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须为以下之一:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**添加于: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

为 HMAC 密钥生成的位数。 如果省略，长度将由使用的哈希算法决定。 这是可选的，在大多数情况下应该省略。


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'HMAC'`。

### 类: `Pbkdf2Params` {#class-pbkdf2params}

**Added in: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须为以下之一：

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Added in: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

PBKDF2 算法在派生位时应进行的迭代次数。

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'PBKDF2'`。

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Added in: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

应该至少是 16 个随机或伪随机字节。

### 类: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Added in: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Added in: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须为以下之一：

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` 或 `'RSA-OAEP'` 之一。

### 类: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**新增于: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果表示为 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)，则该值必须是以下之一：

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

如果表示为 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则该对象必须具有一个 `name` 属性，其值是上面列出的值之一。

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**新增于: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

RSA 模数的位长。 作为最佳实践，它应至少为 `2048`。

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须是 `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` 或 `'RSA-OAEP'` 之一。

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**新增于: v15.0.0**

- 类型: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

RSA 公钥指数。 这必须是一个包含大端、无符号整数的 [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)，并且必须适合 32 位。 [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 可以包含任意数量的前导零位。 该值必须是一个素数。 除非有理由使用不同的值，否则请使用 `new Uint8Array([1, 0, 1])` (65537) 作为公钥指数。


### 类: `RsaOaepParams` {#class-rsaoaepparams}

**新增于: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**新增于: v15.0.0**

- 类型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer)

一个额外的字节集合，它不会被加密，但会绑定到生成的密文。

`rsaOaepParams.label` 参数是可选的。

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'RSA-OAEP'`。

### 类: `RsaPssParams` {#class-rsapssparams}

**新增于: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**新增于: v15.0.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必须为 `'RSA-PSS'`。

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**新增于: v15.0.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

要使用的随机盐的长度（以字节为单位）。

## 脚注 {#footnotes}

