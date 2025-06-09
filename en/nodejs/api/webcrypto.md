---
title: Node.js Web Crypto API
description: The Node.js Web Crypto API provides a set of cryptographic functions for secure communication and data integrity, including key generation, encryption, decryption, signing, and verification.
head:
  - - meta
    - name: og:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Node.js Web Crypto API provides a set of cryptographic functions for secure communication and data integrity, including key generation, encryption, decryption, signing, and verification.
  - - meta
    - name: twitter:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Node.js Web Crypto API provides a set of cryptographic functions for secure communication and data integrity, including key generation, encryption, decryption, signing, and verification.
---

# Web Crypto API {#web-crypto-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.5.0 | Algorithms `Ed25519` and `X25519` are now stable. |
| v19.0.0 | No longer experimental except for the `Ed25519`, `Ed448`, `X25519`, and `X448` algorithms. |
| v20.0.0, v18.17.0 | Arguments are now coerced and validated as per their WebIDL definitions like in other Web Crypto API implementations. |
| v18.4.0, v16.17.0 | Removed proprietary `'node.keyObject'` import/export format. |
| v18.4.0, v16.17.0 | Removed proprietary `'NODE-DSA'`, `'NODE-DH'`, and `'NODE-SCRYPT'` algorithms. |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, `'Ed448'`, `'X25519'`, and `'X448'` algorithms. |
| v18.4.0, v16.17.0 | Removed proprietary `'NODE-ED25519'` and `'NODE-ED448'` algorithms. |
| v18.4.0, v16.17.0 | Removed proprietary `'NODE-X25519'` and `'NODE-X448'` named curves from the `'ECDH'` algorithm. |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

Node.js provides an implementation of the standard [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/).

Use `globalThis.crypto` or `require('node:crypto').webcrypto` to access this module.

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
## Examples {#examples}

### Generating keys {#generating-keys}

The [\<SubtleCrypto\>](/nodejs/api/webcrypto#class-subtlecrypto) class can be used to generate symmetric (secret) keys or asymmetric key pairs (public key and private key).

#### AES keys {#aes-keys}

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
### Wrapping and unwrapping keys {#wrapping-and-unwrapping-keys}

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
### Sign and verify {#sign-and-verify}

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
### Deriving bits and keys {#deriving-bits-and-keys}

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

The table details the algorithms supported by the Node.js Web Crypto API implementation and the APIs supported for each:

| Algorithm | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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

`globalThis.crypto` is an instance of the `Crypto` class. `Crypto` is a singleton that provides access to the remainder of the crypto API.

### `crypto.subtle` {#cryptosubtle}

**Added in: v15.0.0**

- Type: [\<SubtleCrypto\>](/nodejs/api/webcrypto#class-subtlecrypto)

Provides access to the `SubtleCrypto` API.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Added in: v15.0.0**

- `typedArray` [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Returns: [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Generates cryptographically strong random values. The given `typedArray` is filled with random values, and a reference to `typedArray` is returned.

The given `typedArray` must be an integer-based instance of [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), i.e. `Float32Array` and `Float64Array` are not accepted.

An error will be thrown if the given `typedArray` is larger than 65,536 bytes.

### `crypto.randomUUID()` {#cryptorandomuuid}

**Added in: v16.7.0**

- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Generates a random [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID. The UUID is generated using a cryptographic pseudorandom number generator.

## Class: `CryptoKey` {#class-cryptokey}

**Added in: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Added in: v15.0.0**

- Type: [\<AesKeyGenParams\>](/nodejs/api/webcrypto#class-aeskeygenparams) | [\<RsaHashedKeyGenParams\>](/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/nodejs/api/webcrypto#class-hmackeygenparams)

An object detailing the algorithm for which the key can be used along with additional algorithm-specific parameters.

Read-only.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Added in: v15.0.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

When `true`, the [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) can be extracted using either `subtleCrypto.exportKey()` or `subtleCrypto.wrapKey()`.

Read-only.

### `cryptoKey.type` {#cryptokeytype}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) One of `'secret'`, `'private'`, or `'public'`.

A string identifying whether the key is a symmetric (`'secret'`) or asymmetric (`'private'` or `'public'`) key.

### `cryptoKey.usages` {#cryptokeyusages}

**Added in: v15.0.0**

- Type: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

An array of strings identifying the operations for which the key may be used.

The possible usages are:

- `'encrypt'` - The key may be used to encrypt data.
- `'decrypt'` - The key may be used to decrypt data.
- `'sign'` - The key may be used to generate digital signatures.
- `'verify'` - The key may be used to verify digital signatures.
- `'deriveKey'` - The key may be used to derive a new key.
- `'deriveBits'` - The key may be used to derive bits.
- `'wrapKey'` - The key may be used to wrap another key.
- `'unwrapKey'` - The key may be used to unwrap another key.

Valid key usages depend on the key algorithm (identified by `cryptokey.algorithm.name`).

| Key Type | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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
## Class: `CryptoKeyPair` {#class-cryptokeypair}

**Added in: v15.0.0**

The `CryptoKeyPair` is a simple dictionary object with `publicKey` and `privateKey` properties, representing an asymmetric key pair.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) A [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) whose `type` will be `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) A [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) whose `type` will be `'public'`.

## Class: `SubtleCrypto` {#class-subtlecrypto}

**Added in: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Added in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Using the method and parameters specified in `algorithm` and the keying material provided by `key`, `subtle.decrypt()` attempts to decipher the provided `data`. If successful, the returned promise will be resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the plaintext result.

The algorithms currently supported include:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`

### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.5.0, v20.17.0 | The length parameter is now optional for `'ECDH'`, `'X25519'`, and `'X448'`. |
| v18.4.0, v16.17.0 | Added `'X25519'`, and `'X448'` algorithms. |
| v15.0.0 | Added in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Using the method and parameters specified in `algorithm` and the keying material provided by `baseKey`, `subtle.deriveBits()` attempts to generate `length` bits.

When `length` is not provided or `null` the maximum number of bits for a given algorithm is generated. This is allowed for the `'ECDH'`, `'X25519'`, and `'X448'` algorithms, for other algorithms `length` is required to be a number.

If successful, the returned promise will be resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the generated data.

The algorithms currently supported include:

- `'ECDH'`
- `'X25519'`
- `'X448'` 
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0, v16.17.0 | Added `'X25519'`, and `'X448'` algorithms. |
| v15.0.0 | Added in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/nodejs/api/webcrypto#class-aeskeygenparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) See [Key usages](/nodejs/api/webcrypto#cryptokeyusages).
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)

Using the method and parameters specified in `algorithm`, and the keying material provided by `baseKey`, `subtle.deriveKey()` attempts to generate a new [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) based on the method and parameters in `derivedKeyAlgorithm`.

Calling `subtle.deriveKey()` is equivalent to calling `subtle.deriveBits()` to generate raw keying material, then passing the result into the `subtle.importKey()` method using the `deriveKeyAlgorithm`, `extractable`, and `keyUsages` parameters as input.

The algorithms currently supported include:

- `'ECDH'`
- `'X25519'`
- `'X448'` 
- `'HKDF'`
- `'PBKDF2'`

### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Added in: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Using the method identified by `algorithm`, `subtle.digest()` attempts to generate a digest of `data`. If successful, the returned promise is resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the computed digest.

If `algorithm` is provided as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), it must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If `algorithm` is provided as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), it must have a `name` property whose value is one of the above.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Added in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Using the method and parameters specified by `algorithm` and the keying material provided by `key`, `subtle.encrypt()` attempts to encipher `data`. If successful, the returned promise is resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the encrypted result.

The algorithms currently supported include:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`

### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, `'Ed448'`, `'X25519'`, and `'X448'` algorithms. |
| v15.9.0 | Removed `'NODE-DSA'` JWK export. |
| v15.0.0 | Added in: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, or `'jwk'`.
- `key`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Exports the given key into the specified format, if supported.

If the [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) is not extractable, the returned promise will reject.

When `format` is either `'pkcs8'` or `'spki'` and the export is successful, the returned promise will be resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the exported key data.

When `format` is `'jwk'` and the export is successful, the returned promise will be resolved with a JavaScript object conforming to the [JSON Web Key](https://tools.ietf.org/html/rfc7517) specification.

| Key Type | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

- `algorithm`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) See [Key usages](/nodejs/api/webcrypto#cryptokeyusages).
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/nodejs/api/webcrypto#class-cryptokeypair)

Using the method and parameters provided in `algorithm`, `subtle.generateKey()` attempts to generate new keying material. Depending the method used, the method may generate either a single [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) or a [\<CryptoKeyPair\>](/nodejs/api/webcrypto#class-cryptokeypair).

The [\<CryptoKeyPair\>](/nodejs/api/webcrypto#class-cryptokeypair) (public and private key) generating algorithms supported include:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'ECDH'`
- `'X25519'`
- `'X448'` 

The [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) (secret key) generating algorithms supported include:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, `'Ed448'`, `'X25519'`, and `'X448'` algorithms. |
| v15.9.0 | Removed `'NODE-DSA'` JWK import. |
| v15.0.0 | Added in: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, or `'jwk'`.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) See [Key usages](/nodejs/api/webcrypto#cryptokeyusages).
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)

The `subtle.importKey()` method attempts to interpret the provided `keyData` as the given `format` to create a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) instance using the provided `algorithm`, `extractable`, and `keyUsages` arguments. If the import is successful, the returned promise will be resolved with the created [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey).

If importing a `'PBKDF2'` key, `extractable` must be `false`.

The algorithms currently supported include:

| Key Type | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, and `'Ed448'` algorithms. |
| v15.0.0 | Added in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Using the method and parameters given by `algorithm` and the keying material provided by `key`, `subtle.sign()` attempts to generate a cryptographic signature of `data`. If successful, the returned promise is resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the generated signature.

The algorithms currently supported include:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Added in: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, or `'jwk'`.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) See [Key usages](/nodejs/api/webcrypto#cryptokeyusages).
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)

In cryptography, "wrapping a key" refers to exporting and then encrypting the keying material. The `subtle.unwrapKey()` method attempts to decrypt a wrapped key and create a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) instance. It is equivalent to calling `subtle.decrypt()` first on the encrypted key data (using the `wrappedKey`, `unwrapAlgo`, and `unwrappingKey` arguments as input) then passing the results in to the `subtle.importKey()` method using the `unwrappedKeyAlgo`, `extractable`, and `keyUsages` arguments as inputs. If successful, the returned promise is resolved with a [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey) object.

The wrapping algorithms currently supported include:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

The unwrapped key algorithms supported include:

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


::: info [History]
| Version | Changes |
| --- | --- |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, and `'Ed448'` algorithms. |
| v15.0.0 | Added in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Using the method and parameters given in `algorithm` and the keying material provided by `key`, `subtle.verify()` attempts to verify that `signature` is a valid cryptographic signature of `data`. The returned promise is resolved with either `true` or `false`.

The algorithms currently supported include:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Added in: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, or `'jwk'`.
- `key`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/nodejs/api/webcrypto#class-aesgcmparams)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

In cryptography, "wrapping a key" refers to exporting and then encrypting the keying material. The `subtle.wrapKey()` method exports the keying material into the format identified by `format`, then encrypts it using the method and parameters specified by `wrapAlgo` and the keying material provided by `wrappingKey`. It is the equivalent to calling `subtle.exportKey()` using `format` and `key` as the arguments, then passing the result to the `subtle.encrypt()` method using `wrappingKey` and `wrapAlgo` as inputs. If successful, the returned promise will be resolved with an [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the encrypted key data.

The wrapping algorithms currently supported include:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

## Algorithm parameters {#algorithm-parameters}

The algorithm parameter objects define the methods and parameters used by the various [\<SubtleCrypto\>](/nodejs/api/webcrypto#class-subtlecrypto) methods. While described here as "classes", they are simple JavaScript dictionary objects.

### Class: `AlgorithmIdentifier` {#class-algorithmidentifier}

**Added in: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Added in: v18.4.0, v16.17.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Class: `AesCbcParams` {#class-aescbcparams}

**Added in: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

Provides the initialization vector. It must be exactly 16-bytes in length and should be unpredictable and cryptographically random.

#### `aesCbcParams.name` {#aescbcparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'AES-CBC'`.

### Class: `AesCtrParams` {#class-aesctrparams}

**Added in: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

The initial value of the counter block. This must be exactly 16 bytes long.

The `AES-CTR` method uses the rightmost `length` bits of the block as the counter and the remaining bits as the nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of bits in the `aesCtrParams.counter` that are to be used as the counter.

#### `aesCtrParams.name` {#aesctrparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'AES-CTR'`.

### Class: `AesGcmParams` {#class-aesgcmparams}

**Added in: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

With the AES-GCM method, the `additionalData` is extra input that is not encrypted but is included in the authentication of the data. The use of `additionalData` is optional.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

The initialization vector must be unique for every encryption operation using a given key.

Ideally, this is a deterministic 12-byte value that is computed in such a way that it is guaranteed to be unique across all invocations that use the same key. Alternatively, the initialization vector may consist of at least 12 cryptographically random bytes. For more information on constructing initialization vectors for AES-GCM, refer to Section 8 of [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'AES-GCM'`.

#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The size in bits of the generated authentication tag. This values must be one of `32`, `64`, `96`, `104`, `112`, `120`, or `128`. **Default:** `128`.

### Class: `AesKeyGenParams` {#class-aeskeygenparams}

**Added in: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The length of the AES key to be generated. This must be either `128`, `192`, or `256`.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, or `'AES-KW'`

### Class: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Added in: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'ECDH'`, `'X25519'`, or `'X448'`.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey)

ECDH key derivation operates by taking as input one parties private key and another parties public key -- using both to generate a common shared secret. The `ecdhKeyDeriveParams.public` property is set to the other parties public key.

### Class: `EcdsaParams` {#class-ecdsaparams}

**Added in: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `ecdsaParams.name` {#ecdsaparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'ECDSA'`.

### Class: `EcKeyGenParams` {#class-eckeygenparams}

**Added in: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'ECDSA'` or `'ECDH'`.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'P-256'`, `'P-384'`, `'P-521'`.

### Class: `EcKeyImportParams` {#class-eckeyimportparams}

**Added in: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'ECDSA'` or `'ECDH'`.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'P-256'`, `'P-384'`, `'P-521'`.

### Class: `Ed448Params` {#class-ed448params}

**Added in: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Added in: v18.4.0, v16.17.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'Ed448'`.

#### `ed448Params.context` {#ed448paramscontext}

**Added in: v18.4.0, v16.17.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

The `context` member represents the optional context data to associate with the message. The Node.js Web Crypto API implementation only supports zero-length context which is equivalent to not providing context at all.

### Class: `HkdfParams` {#class-hkdfparams}

**Added in: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

Provides application-specific contextual input to the HKDF algorithm. This can be zero-length but must be provided.

#### `hkdfParams.name` {#hkdfparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

The salt value significantly improves the strength of the HKDF algorithm. It should be random or pseudorandom and should be the same length as the output of the digest function (for instance, if using `'SHA-256'` as the digest, the salt should be 256-bits of random data).

### Class: `HmacImportParams` {#class-hmacimportparams}

**Added in: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The optional number of bits in the HMAC key. This is optional and should be omitted for most cases.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'HMAC'`.

### Class: `HmacKeyGenParams` {#class-hmackeygenparams}

**Added in: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The number of bits to generate for the HMAC key. If omitted, the length will be determined by the hash algorithm used. This is optional and should be omitted for most cases.

#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'HMAC'`.

### Class: `Pbkdf2Params` {#class-pbkdf2params}

**Added in: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The number of iterations the PBKDF2 algorithm should make when deriving bits.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'PBKDF2'`.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

Should be at least 16 random or pseudorandom bytes.

### Class: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Added in: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, or `'RSA-OAEP'`.

### Class: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Added in: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

If represented as a [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

If represented as an [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), the object must have a `name` property whose value is one of the above listed values.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The length in bits of the RSA modulus. As a best practice, this should be at least `2048`.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be one of `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, or `'RSA-OAEP'`.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Added in: v15.0.0**

- Type: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The RSA public exponent. This must be a [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) containing a big-endian, unsigned integer that must fit within 32-bits. The [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) may contain an arbitrary number of leading zero-bits. The value must be a prime number. Unless there is reason to use a different value, use `new Uint8Array([1, 0, 1])` (65537) as the public exponent.

### Class: `RsaOaepParams` {#class-rsaoaepparams}

**Added in: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/nodejs/api/buffer#class-buffer)

An additional collection of bytes that will not be encrypted, but will be bound to the generated ciphertext.

The `rsaOaepParams.label` parameter is optional.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) must be `'RSA-OAEP'`.

### Class: `RsaPssParams` {#class-rsapssparams}

**Added in: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Must be `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The length (in bytes) of the random salt to use.

## Footnotes {#footnotes}

