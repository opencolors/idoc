---
title: Node.js Web Crypto API
description: Node.jsのWeb Crypto APIは、安全な通信とデータの完全性のための暗号化機能を提供します。鍵生成、暗号化、復号化、署名、検証が含まれます。
head:
  - - meta
    - name: og:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのWeb Crypto APIは、安全な通信とデータの完全性のための暗号化機能を提供します。鍵生成、暗号化、復号化、署名、検証が含まれます。
  - - meta
    - name: twitter:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのWeb Crypto APIは、安全な通信とデータの完全性のための暗号化機能を提供します。鍵生成、暗号化、復号化、署名、検証が含まれます。
---


# Web Crypto API {#web-crypto-api}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.5.0 | アルゴリズム `Ed25519` および `X25519` が安定版になりました。 |
| v19.0.0 | `Ed25519`、`Ed448`、`X25519`、および `X448` アルゴリズムを除き、実験的ではなくなりました。 |
| v20.0.0, v18.17.0 | 引数は、他の Web Crypto API の実装と同様に、WebIDL の定義に従って強制され、検証されるようになりました。 |
| v18.4.0, v16.17.0 | 独自の `'node.keyObject'` インポート/エクスポート形式を削除しました。 |
| v18.4.0, v16.17.0 | 独自の `'NODE-DSA'`、`'NODE-DH'`、および `'NODE-SCRYPT'` アルゴリズムを削除しました。 |
| v18.4.0, v16.17.0 | `'Ed25519'`、`'Ed448'`、`'X25519'`、および `'X448'` アルゴリズムを追加しました。 |
| v18.4.0, v16.17.0 | 独自の `'NODE-ED25519'` および `'NODE-ED448'` アルゴリズムを削除しました。 |
| v18.4.0, v16.17.0 | 独自の `'NODE-X25519'` および `'NODE-X448'` という名前のカーブを `'ECDH'` アルゴリズムから削除しました。 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

Node.js は、標準の [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) の実装を提供します。

このモジュールにアクセスするには、`globalThis.crypto` または `require('node:crypto').webcrypto` を使用します。

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
## 例 {#examples}

### 鍵の生成 {#generating-keys}

[\<SubtleCrypto\>](/ja/nodejs/api/webcrypto#class-subtlecrypto) クラスを使用して、対称（秘密）鍵または非対称鍵ペア（公開鍵と秘密鍵）を生成できます。

#### AES 鍵 {#aes-keys}

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

#### ECDSA key pairs {#ecdsa-key-pairs}

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
#### Ed25519/X25519 key pairs {#ed25519/x25519-key-pairs}

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
#### HMAC keys {#hmac-keys}

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
#### RSA key pairs {#rsa-key-pairs}

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
### Encryption and decryption {#encryption-and-decryption}

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
### Exporting and importing keys {#exporting-and-importing-keys}

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

### キーのラッピングとアンラッピング {#wrapping-and-unwrapping-keys}

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
### 署名と検証 {#sign-and-verify}

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
### ビットとキーの導出 {#deriving-bits-and-keys}

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

### Digest {#digest}

```js [ESM]
const { subtle } = globalThis.crypto;

async function digest(data, algorithm = 'SHA-512') {
  const ec = new TextEncoder();
  const digest = await subtle.digest(algorithm, ec.encode(data));
  return digest;
}
```
## Algorithm matrix {#algorithm-matrix}

Node.js Web Crypto API の実装でサポートされているアルゴリズムと、各アルゴリズムでサポートされている API の詳細を以下の表に示します。

| アルゴリズム | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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
## Class: `Crypto` {#class-crypto}

**Added in: v15.0.0**

`globalThis.crypto` は `Crypto` クラスのインスタンスです。`Crypto` は、暗号 API の残りの部分へのアクセスを提供するシングルトンです。

### `crypto.subtle` {#cryptosubtle}

**Added in: v15.0.0**

- Type: [\<SubtleCrypto\>](/ja/nodejs/api/webcrypto#class-subtlecrypto)

`SubtleCrypto` API へのアクセスを提供します。

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Added in: v15.0.0**

- `typedArray` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Returns: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

暗号学的に強い乱数を生成します。指定された `typedArray` は乱数値で埋められ、`typedArray` への参照が返されます。

指定された `typedArray` は、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) の整数ベースのインスタンスでなければなりません。つまり、`Float32Array` と `Float64Array` は受け入れられません。

指定された `typedArray` が 65,536 バイトを超える場合、エラーがスローされます。


### `crypto.randomUUID()` {#cryptorandomuuid}

**追加:** v16.7.0 以降

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ランダムな [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) バージョン 4 UUID を生成します。UUID は、暗号論的に安全な擬似乱数ジェネレーターを使用して生成されます。

## Class: `CryptoKey` {#class-cryptokey}

**追加:** v15.0.0 以降

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**追加:** v15.0.0 以降

- 型: [\<AesKeyGenParams\>](/ja/nodejs/api/webcrypto#class-managerpage) | [\<RsaHashedKeyGenParams\>](/ja/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ja/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ja/nodejs/api/webcrypto#class-hmackeygenparams)

キーを使用できるアルゴリズムの詳細と、アルゴリズム固有の追加パラメーターを含むオブジェクト。

読み取り専用。

### `cryptoKey.extractable` {#cryptokeyextractable}

**追加:** v15.0.0 以降

- 型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` の場合、[\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) は `subtleCrypto.exportKey()` または `subtleCrypto.wrapKey()` のいずれかを使用して抽出できます。

読み取り専用。

### `cryptoKey.type` {#cryptokeytype}

**追加:** v15.0.0 以降

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'secret'`, `'private'`, または `'public'` のいずれか。

キーが対称 (`'secret'`) キーか、非対称 (`'private'` または `'public'`) キーかを識別する文字列。

### `cryptoKey.usages` {#cryptokeyusages}

**追加:** v15.0.0 以降

- 型: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

キーを使用できる操作を識別する文字列の配列。

可能な使用法は次のとおりです。

- `'encrypt'` - キーを使用してデータを暗号化できます。
- `'decrypt'` - キーを使用してデータを復号化できます。
- `'sign'` - キーを使用してデジタル署名を生成できます。
- `'verify'` - キーを使用してデジタル署名を検証できます。
- `'deriveKey'` - キーを使用して新しいキーを派生させることができます。
- `'deriveBits'` - キーを使用してビットを派生させることができます。
- `'wrapKey'` - キーを使用して別のキーをラップできます。
- `'unwrapKey'` - キーを使用して別のキーをアンラップできます。

有効なキーの使用法は、キーアルゴリズム（`cryptokey.algorithm.name` で識別される）によって異なります。

| キーの種類 | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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


## クラス: `CryptoKeyPair` {#class-cryptokeypair}

**Added in: v15.0.0**

`CryptoKeyPair` は、非対称鍵ペアを表す `publicKey` プロパティと `privateKey` プロパティを持つシンプルな辞書オブジェクトです。

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) `type` が `'private'` となる [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)。

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) `type` が `'public'` となる [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)。

## クラス: `SubtleCrypto` {#class-subtlecrypto}

**Added in: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Added in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ja/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ja/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ja/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ja/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決される Promise。

`algorithm` で指定されたメソッドとパラメータ、および `key` によって提供される鍵素材を使用して、`subtle.decrypt()` は提供された `data` の解読を試みます。成功した場合、返される Promise は、プレーンテキストの結果を含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

現在サポートされているアルゴリズムは次のとおりです。

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.5.0, v20.17.0 | `length` パラメーターが `'ECDH'`, `'X25519'`, および `'X448'` でオプションになりました。 |
| v18.4.0, v16.17.0 | `'X25519'` および `'X448'` アルゴリズムが追加されました。 |
| v15.0.0 | v15.0.0 で追加されました。 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ja/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ja/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ja/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

`algorithm` で指定されたメソッドとパラメーター、および `baseKey` で提供される鍵素材を使用して、`subtle.deriveBits()` は `length` ビットの生成を試みます。

`length` が提供されないか `null` の場合、特定のアルゴリズムの最大ビット数が生成されます。 これは、`'ECDH'`, `'X25519'`, および `'X448'` アルゴリズムで許可されています。他のアルゴリズムでは、`length` は数値である必要があります。

成功した場合、返される Promise は、生成されたデータを含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

現在サポートされているアルゴリズムは次のとおりです。

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0, v16.17.0 | `'X25519'` および `'X448'` アルゴリズムが追加されました。 |
| v15.0.0 | v15.0.0 で追加されました。 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ja/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ja/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ja/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/ja/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ja/nodejs/api/webcrypto#class-aeskeygenparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Key usages](/ja/nodejs/api/webcrypto#cryptokeyusages) を参照してください。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) で解決されます。

`algorithm` で指定されたメソッドとパラメーター、および `baseKey` で提供される鍵素材を使用して、`subtle.deriveKey()` は、`derivedKeyAlgorithm` のメソッドとパラメーターに基づいて、新しい [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) の生成を試みます。

`subtle.deriveKey()` の呼び出しは、`subtle.deriveBits()` を呼び出して生の鍵素材を生成し、その結果を `subtle.importKey()` メソッドに `deriveKeyAlgorithm`、`extractable`、および `keyUsages` パラメーターを入力として渡すことと同等です。

現在サポートされているアルゴリズムは次のとおりです。

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Added in: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

`algorithm` で識別されるメソッドを使用し、`subtle.digest()` は `data` のダイジェストを生成しようとします。成功した場合、返される promise は、計算されたダイジェストを含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

`algorithm` が [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として提供されている場合、次のいずれかでなければなりません。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

`algorithm` が [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として提供されている場合、その値が上記のいずれかである `name` プロパティが必要です。

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Added in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ja/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ja/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ja/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ja/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

`algorithm` で指定されたメソッドとパラメータ、および `key` で提供されたキー素材を使用して、`subtle.encrypt()` は `data` を暗号化しようとします。成功した場合、返される promise は、暗号化された結果を含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

現在サポートされているアルゴリズムは次のとおりです。

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'`, `'Ed448'`, `'X25519'`, および `'X448'` アルゴリズムが追加されました。 |
| v15.9.0 | `'NODE-DSA'` JWK エクスポートを削除しました。 |
| v15.0.0 | 次のバージョンで追加: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'`, または `'jwk'` のいずれかである必要があります。
- `key`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) で解決されます。

指定された形式で指定されたキーをエクスポートします（サポートされている場合）。

[\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) が抽出可能でない場合、返される Promise は reject されます。

`format` が `'pkcs8'` または `'spki'` のいずれかで、エクスポートが成功した場合、返される Promise は、エクスポートされたキーデータを含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

`format` が `'jwk'` で、エクスポートが成功した場合、返される Promise は、[JSON Web Key](https://tools.ietf.org/html/rfc7517) 仕様に準拠する JavaScript オブジェクトで解決されます。

| キータイプ | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**Added in: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/ja/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ja/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ja/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ja/nodejs/api/webcrypto#class-aeskeygenassistgenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [キー用途](/ja/nodejs/api/webcrypto#cryptokeyusages) を参照してください。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/ja/nodejs/api/webcrypto#class-cryptokeypair) で解決されます。

`algorithm` で提供されるメソッドとパラメーターを使用して、`subtle.generateKey()` は新しいキーマテリアルの生成を試みます。使用されるメソッドに応じて、このメソッドは単一の [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) または [\<CryptoKeyPair\>](/ja/nodejs/api/webcrypto#class-cryptokeypair) を生成する場合があります。

[\<CryptoKeyPair\>](/ja/nodejs/api/webcrypto#class-cryptokeypair)（公開鍵と秘密鍵）の生成がサポートされているアルゴリズムは次のとおりです。

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

[\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) (秘密鍵) の生成がサポートされているアルゴリズムは次のとおりです。

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'`, `'Ed448'`, `'X25519'`, および `'X448'` アルゴリズムを追加しました。 |
| v15.9.0 | `'NODE-DSA'` JWK インポートを削除しました。 |
| v15.0.0 | v15.0.0 で追加されました。 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'`, または `'jwk'` のいずれかである必要があります。
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ja/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ja/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ja/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Key usages](/ja/nodejs/api/webcrypto#cryptokeyusages) を参照してください。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) で解決される Promise。

`subtle.importKey()` メソッドは、指定された `keyData` を指定された `format` として解釈し、提供された `algorithm`、`extractable`、および `keyUsages` 引数を使用して [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) インスタンスを作成しようとします。インポートが成功すると、返される Promise は作成された [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) で解決されます。

`'PBKDF2'` キーをインポートする場合、`extractable` は `false` である必要があります。

現在サポートされているアルゴリズムは次のとおりです。

| キーの種類 | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
| --- | --- | --- | --- | --- |
| `'AES-CBC'` ||| ✔ | ✔ |
| `'AES-CTR'` ||| ✔ | ✔ |
| `'AES-GCM'` ||| ✔ | ✔ |
| `'AES-KW'` ||| ✔ | ✔ |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |
| `'X25519'` | ✔ | ✔ | ✔ | ✔ |
| `'X448'`        | ✔ | ✔ | ✔ | ✔ |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed448'`        | ✔ | ✔ | ✔ | ✔ |
| `'HDKF'` |||| ✔ |
| `'HMAC'` ||| ✔ | ✔ |
| `'PBKDF2'` |||| ✔ |
| `'RSA-OAEP'` | ✔ | ✔ | ✔ ||
| `'RSA-PSS'` | ✔ | ✔ | ✔ ||
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ ||

### `subtle.sign(algorithm, key, data)` {#subtlesignalgorithm-key-data}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'` および `'Ed448'` アルゴリズムが追加されました。 |
| v15.0.0 | v15.0.0 で追加されました。 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ja/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ja/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ja/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で履行されます

`algorithm` で与えられたメソッドとパラメータ、および `key` で提供された鍵素材を使用して、`subtle.sign()` は `data` の暗号署名を生成しようとします。成功した場合、返された Promise は、生成された署名を含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

現在サポートされているアルゴリズムは次のとおりです。

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**追加:** v15.0.0

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'`, または `'jwk'` のいずれかである必要があります。
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ja/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ja/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ja/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ja/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ja/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ja/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ja/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [鍵の使用法](/ja/nodejs/api/webcrypto#cryptokeyusages)を参照してください。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) で履行されます

暗号化において、「鍵をラップする」とは、鍵素材をエクスポートしてから暗号化することを指します。`subtle.unwrapKey()` メソッドは、ラップされた鍵を復号化し、[\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) インスタンスを作成しようとします。これは、最初に暗号化された鍵データに対して `subtle.decrypt()` を呼び出し (`wrappedKey`、`unwrapAlgo`、および `unwrappingKey` 引数を入力として使用)、次に結果を `subtle.importKey()` メソッドに渡し、`unwrappedKeyAlgo`、`extractable`、および `keyUsages` 引数を入力として使用するのと同じです。成功した場合、返された Promise は [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) オブジェクトで解決されます。

現在サポートされているラッピングアルゴリズムは次のとおりです。

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

サポートされているアンラップされた鍵アルゴリズムは次のとおりです。

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

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'` と `'Ed448'` アルゴリズムを追加。 |
| v15.0.0 | v15.0.0 で追加 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ja/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ja/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ja/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) で履行

`algorithm` に与えられたメソッドとパラメータ、および `key` によって提供される鍵素材を使用して、`subtle.verify()` は `signature` が `data` の有効な暗号署名であることを検証しようとします。返される Promise は、`true` または `false` で解決されます。

現在サポートされているアルゴリズムは次のとおりです。

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**追加: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'`, または `'jwk'` のいずれかである必要があります。
- `key`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/ja/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ja/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ja/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ja/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ja/nodejs/api/webcrypto#class-aesgcmparams)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で履行

暗号化において、「キーのラッピング」とは、鍵素材をエクスポートしてから暗号化することを指します。`subtle.wrapKey()` メソッドは、鍵素材を `format` によって識別される形式にエクスポートし、`wrapAlgo` によって指定されたメソッドとパラメータ、および `wrappingKey` によって提供された鍵素材を使用して暗号化します。これは、`format` と `key` を引数として使用して `subtle.exportKey()` を呼び出し、その結果を `wrappingKey` と `wrapAlgo` を入力として使用して `subtle.encrypt()` メソッドに渡すことと同じです。成功した場合、返される Promise は、暗号化されたキーデータを含む [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) で解決されます。

現在サポートされているラッピングアルゴリズムは次のとおりです。

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## アルゴリズムパラメータ {#algorithm-parameters}

アルゴリズムパラメータオブジェクトは、様々な[\<SubtleCrypto\>](/ja/nodejs/api/webcrypto#class-subtlecrypto)メソッドで使用されるメソッドとパラメータを定義します。ここでは「クラス」として説明されていますが、これらは単純なJavaScriptの辞書オブジェクトです。

### クラス: `AlgorithmIdentifier` {#class-algorithmidentifier}

**追加: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**追加: v18.4.0, v16.17.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### クラス: `AesCbcParams` {#class-aescbcparams}

**追加: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**追加: v15.0.0**

- タイプ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

初期化ベクトルを提供します。 これは正確に16バイトの長さでなければならず、予測不可能で暗号学的にランダムである必要があります。

#### `aesCbcParams.name` {#aescbcparamsname}

**追加: v15.0.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-CBC'` でなければなりません。

### クラス: `AesCtrParams` {#class-aesctrparams}

**追加: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**追加: v15.0.0**

- タイプ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

カウンタブロックの初期値。 これは正確に16バイトの長さでなければなりません。

`AES-CTR`メソッドは、ブロックの一番右の`length`ビットをカウンタとして使用し、残りのビットをナンスとして使用します。

#### `aesCtrParams.length` {#aesctrparamslength}

**追加: v15.0.0**

- タイプ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `aesCtrParams.counter`の中でカウンタとして使用されるビット数。


#### `aesCtrParams.name` {#aesctrparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-CTR'` である必要があります。

### Class: `AesGcmParams` {#class-aesgcmparams}

**Added in: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

AES-GCM メソッドでは、`additionalData` は暗号化されませんが、データの認証に含まれる追加の入力です。`additionalData` の使用は任意です。

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

初期化ベクトルは、特定の鍵を使用したすべての暗号化操作で一意である必要があります。

理想的には、これは決定論的な 12 バイトの値であり、同じ鍵を使用するすべての呼び出しで一意であることが保証されるように計算されます。あるいは、初期化ベクトルは少なくとも 12 バイトの暗号論的にランダムなバイトで構成されていても構いません。AES-GCM の初期化ベクトルの構築に関する詳細については、[NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) のセクション 8 を参照してください。

#### `aesGcmParams.name` {#aesgcmparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-GCM'` である必要があります。


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成される認証タグのサイズ（ビット単位）。この値は、`32`、`64`、`96`、`104`、`112`、`120`、または `128` のいずれかでなければなりません。**デフォルト:** `128`。

### Class: `AesKeyGenParams` {#class-aeskeygenparams}

**Added in: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

生成される AES 鍵の長さ。これは `128`、`192`、または `256` のいずれかでなければなりません。

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-CBC'`、`'AES-CTR'`、`'AES-GCM'`、または `'AES-KW'` のいずれかでなければなりません。

### Class: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Added in: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDH'`、`'X25519'`、または `'X448'` のいずれかでなければなりません。

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)

ECDH 鍵導出は、一方の当事者の秘密鍵と他方の当事者の公開鍵を入力として受け取り、それらを使用して共通の共有秘密を生成することによって機能します。`ecdhKeyDeriveParams.public` プロパティは、相手方の公開鍵に設定されます。

### Class: `EcdsaParams` {#class-ecdsaparams}

**Added in: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表される場合、値は次のいずれかでなければなりません。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表される場合、オブジェクトは `name` プロパティを持ち、その値は上記のリストされた値のいずれかでなければなりません。


#### `ecdsaParams.name` {#ecdsaparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDSA'` である必要があります。

### Class: `EcKeyGenParams` {#class-eckeygenparams}

**Added in: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDSA'` または `'ECDH'` のいずれかである必要があります。

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'P-256'`, `'P-384'`, `'P-521'` のいずれかである必要があります。

### Class: `EcKeyImportParams` {#class-eckeyimportparams}

**Added in: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDSA'` または `'ECDH'` のいずれかである必要があります。

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'P-256'`, `'P-384'`, `'P-521'` のいずれかである必要があります。

### Class: `Ed448Params` {#class-ed448params}

**Added in: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Added in: v18.4.0, v16.17.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'Ed448'` である必要があります。

#### `ed448Params.context` {#ed448paramscontext}

**Added in: v18.4.0, v16.17.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`context` メンバは、メッセージに関連付けるオプションのコンテキストデータを表します。Node.js Web Crypto API の実装は、長さゼロのコンテキストのみをサポートしており、これはコンテキストをまったく提供しないのと同じです。


### クラス: `HkdfParams` {#class-hkdfparams}

**追加:** v15.0.0

#### `hkdfParams.hash` {#hkdfparamshash}

**追加:** v15.0.0

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表される場合、値は次のいずれかである必要があります。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表される場合、オブジェクトは `name` プロパティを持ち、その値は上記のリストの値のいずれかである必要があります。

#### `hkdfParams.info` {#hkdfparamsinfo}

**追加:** v15.0.0

- 型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

HKDFアルゴリズムにアプリケーション固有のコンテキスト入力を提供します。 これは長さがゼロでも構いませんが、提供する必要があります。

#### `hkdfParams.name` {#hkdfparamsname}

**追加:** v15.0.0

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'HKDF'` である必要があります。

#### `hkdfParams.salt` {#hkdfparamssalt}

**追加:** v15.0.0

- 型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

ソルト値は、HKDFアルゴリズムの強度を大幅に向上させます。 ランダムまたは擬似ランダムである必要があり、ダイジェスト関数の出力と同じ長さである必要があります（たとえば、`'SHA-256'`をダイジェストとして使用する場合、ソルトは256ビットのランダムデータである必要があります）。


### クラス: `HmacImportParams` {#class-hmacimportparams}

**Added in: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Added in: v15.0.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表される場合、値は次のいずれかである必要があります。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表される場合、オブジェクトは上記のリストされた値のいずれかである `name` プロパティを持つ必要があります。

#### `hmacImportParams.length` {#hmacimportparamslength}

**Added in: v15.0.0**

- タイプ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HMACキーのオプションのビット数。これはオプションであり、ほとんどの場合省略する必要があります。

#### `hmacImportParams.name` {#hmacimportparamsname}

**Added in: v15.0.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'HMAC'` である必要があります。

### クラス: `HmacKeyGenParams` {#class-hmackeygenparams}

**Added in: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Added in: v15.0.0**

- タイプ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表される場合、値は次のいずれかである必要があります。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表される場合、オブジェクトは上記のリストされた値のいずれかである `name` プロパティを持つ必要があります。

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Added in: v15.0.0**

- タイプ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HMACキー用に生成するビット数。省略した場合、長さは使用されるハッシュアルゴリズムによって決定されます。これはオプションであり、ほとんどの場合省略する必要があります。


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'HMAC'` である必要があります。

### クラス: `Pbkdf2Params` {#class-pbkdf2params}

**Added in: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表現される場合、値は次のいずれかである必要があります。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表現される場合、オブジェクトは上記のリストされた値のいずれかを値とする `name` プロパティを持っている必要があります。

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

PBKDF2 アルゴリズムがビットを導出する際に実行する反復回数。

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'PBKDF2'` である必要があります。

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

少なくとも 16 バイトのランダムまたは疑似ランダムなバイトである必要があります。

### クラス: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Added in: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表現される場合、値は次のいずれかである必要があります。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表現される場合、オブジェクトは上記のリストされた値のいずれかを値とする `name` プロパティを持っている必要があります。


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, または `'RSA-OAEP'` のいずれかである必要があります。

### クラス: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Added in: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) として表現される場合、値は次のいずれかである必要があります。

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) として表現される場合、オブジェクトは `name` プロパティを持ち、その値は上記のリストされた値のいずれかである必要があります。

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

RSA モジュラスのビット単位の長さ。 ベストプラクティスとして、これは少なくとも `2048` である必要があります。

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, または `'RSA-OAEP'` のいずれかである必要があります。

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Added in: v15.0.0**

- Type: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

RSA 公開指数。 これは、32 ビット以内に収まるビッグエンディアンの符号なし整数を含む [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) である必要があります。 [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) には、任意の数の先頭のゼロビットを含めることができます。 値は素数でなければなりません。 別の値を使用する理由がない限り、公開指数として `new Uint8Array([1, 0, 1])` (65537) を使用します。


### クラス: `RsaOaepParams` {#class-rsaoaepparams}

**追加: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**追加: v15.0.0**

- 型: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

暗号化されませんが、生成された暗号テキストにバインドされるバイトの追加コレクション。

`rsaOaepParams.label` パラメーターはオプションです。

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**追加: v15.0.0**

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) は `'RSA-OAEP'` である必要があります。

### クラス: `RsaPssParams` {#class-rsapssparams}

**追加: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**追加: v15.0.0**

- 型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) は `'RSA-PSS'` である必要があります。

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**追加: v15.0.0**

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

使用するランダムソルトの長さ（バイト単位）。

## 脚注 {#footnotes}

