---
title: Node.js Web Crypto API
description: Node.js Web Crypto API는 안전한 통신과 데이터 무결성을 위한 암호화 기능을 제공합니다. 키 생성, 암호화, 복호화, 서명, 검증이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js Web Crypto API는 안전한 통신과 데이터 무결성을 위한 암호화 기능을 제공합니다. 키 생성, 암호화, 복호화, 서명, 검증이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js Web Crypto API는 안전한 통신과 데이터 무결성을 위한 암호화 기능을 제공합니다. 키 생성, 암호화, 복호화, 서명, 검증이 포함됩니다.
---


# Web Crypto API {#web-crypto-api}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | `Ed25519` 및 `X25519` 알고리즘이 이제 안정화되었습니다. |
| v19.0.0 | `Ed25519`, `Ed448`, `X25519` 및 `X448` 알고리즘을 제외하고 더 이상 실험적이지 않습니다. |
| v20.0.0, v18.17.0 | 인수는 이제 다른 Web Crypto API 구현에서와 같이 해당 WebIDL 정의에 따라 강제 변환되고 유효성이 검사됩니다. |
| v18.4.0, v16.17.0 | 독점적인 `'node.keyObject'` 가져오기/내보내기 형식을 제거했습니다. |
| v18.4.0, v16.17.0 | 독점적인 `'NODE-DSA'`, `'NODE-DH'` 및 `'NODE-SCRYPT'` 알고리즘을 제거했습니다. |
| v18.4.0, v16.17.0 | `'Ed25519'`, `'Ed448'`, `'X25519'` 및 `'X448'` 알고리즘을 추가했습니다. |
| v18.4.0, v16.17.0 | 독점적인 `'NODE-ED25519'` 및 `'NODE-ED448'` 알고리즘을 제거했습니다. |
| v18.4.0, v16.17.0 | `'ECDH'` 알고리즘에서 독점적인 `'NODE-X25519'` 및 `'NODE-X448'` 명명된 곡선을 제거했습니다. |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

Node.js는 표준 [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/)의 구현을 제공합니다.

`globalThis.crypto` 또는 `require('node:crypto').webcrypto`를 사용하여 이 모듈에 액세스합니다.

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
## 예제 {#examples}

### 키 생성 {#generating-keys}

[\<SubtleCrypto\>](/ko/nodejs/api/webcrypto#class-subtlecrypto) 클래스를 사용하여 대칭 (비밀) 키 또는 비대칭 키 쌍 (공개 키 및 개인 키)을 생성할 수 있습니다.

#### AES 키 {#aes-keys}

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

#### ECDSA 키 쌍 {#ecdsa-key-pairs}

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
#### Ed25519/X25519 키 쌍 {#ed25519/x25519-key-pairs}

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
#### HMAC 키 {#hmac-keys}

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
#### RSA 키 쌍 {#rsa-key-pairs}

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
### 암호화 및 복호화 {#encryption-and-decryption}

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
### 키 내보내기 및 가져오기 {#exporting-and-importing-keys}

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

### 키 래핑 및 언래핑 {#wrapping-and-unwrapping-keys}

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
### 서명 및 검증 {#sign-and-verify}

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
### 비트 및 키 파생 {#deriving-bits-and-keys}

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

### 다이제스트 {#digest}

```js [ESM]
const { subtle } = globalThis.crypto;

async function digest(data, algorithm = 'SHA-512') {
  const ec = new TextEncoder();
  const digest = await subtle.digest(algorithm, ec.encode(data));
  return digest;
}
```
## 알고리즘 매트릭스 {#algorithm-matrix}

다음 표는 Node.js Web Crypto API 구현에서 지원하는 알고리즘과 각 알고리즘에 대해 지원되는 API를 자세히 설명합니다.

| 알고리즘 | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'RSA-PSS'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'RSA-OAEP'` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ ||||||
| `'ECDSA'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'Ed25519'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'Ed448'` | ✔ | ✔ | ✔ ||||||| ✔ | ✔ ||
| `'ECDH'` | ✔ | ✔ | ✔ ||||| ✔ | ✔ ||||
| `'X25519'` | ✔ | ✔ | ✔ ||||| ✔ | ✔ ||||
| `'X448'` | ✔ | ✔ | ✔ ||||| ✔ | ✔ ||||
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
## 클래스: `Crypto` {#class-crypto}

**추가됨: v15.0.0**

`globalThis.crypto`는 `Crypto` 클래스의 인스턴스입니다. `Crypto`는 나머지 암호화 API에 대한 액세스를 제공하는 싱글톤입니다.

### `crypto.subtle` {#cryptosubtle}

**추가됨: v15.0.0**

- 유형: [\<SubtleCrypto\>](/ko/nodejs/api/webcrypto#class-subtlecrypto)

`SubtleCrypto` API에 대한 액세스를 제공합니다.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**추가됨: v15.0.0**

- `typedArray` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

암호화적으로 강력한 임의 값을 생성합니다. 주어진 `typedArray`는 임의 값으로 채워지고 `typedArray`에 대한 참조가 반환됩니다.

주어진 `typedArray`는 [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)의 정수 기반 인스턴스여야 합니다. 즉, `Float32Array` 및 `Float64Array`는 허용되지 않습니다.

주어진 `typedArray`가 65,536바이트보다 크면 오류가 발생합니다.


### `crypto.randomUUID()` {#cryptorandomuuid}

**추가된 버전: v16.7.0**

- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

임의의 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) 버전 4 UUID를 생성합니다. UUID는 암호화 의사 난수 생성기를 사용하여 생성됩니다.

## 클래스: `CryptoKey` {#class-cryptokey}

**추가된 버전: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**추가된 버전: v15.0.0**

- 유형: [\<AesKeyGenParams\>](/ko/nodejs/api/webcrypto#class-keygenparams) | [\<RsaHashedKeyGenParams\>](/ko/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ko/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ko/nodejs/api/webcrypto#class-hmackeygenparams)

키를 사용할 수 있는 알고리즘과 추가 알고리즘 관련 매개변수를 자세히 설명하는 객체입니다.

읽기 전용입니다.

### `cryptoKey.extractable` {#cryptokeyextractable}

**추가된 버전: v15.0.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`인 경우 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)는 `subtleCrypto.exportKey()` 또는 `subtleCrypto.wrapKey()`를 사용하여 추출할 수 있습니다.

읽기 전용입니다.

### `cryptoKey.type` {#cryptokeytype}

**추가된 버전: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'secret'`, `'private'`, 또는 `'public'` 중 하나입니다.

키가 대칭(`'secret'`)인지 비대칭(`'private'` 또는 `'public'`) 키인지 식별하는 문자열입니다.

### `cryptoKey.usages` {#cryptokeyusages}

**추가된 버전: v15.0.0**

- 유형: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

키를 사용할 수 있는 작업을 식별하는 문자열 배열입니다.

가능한 용도는 다음과 같습니다.

- `'encrypt'` - 키를 사용하여 데이터를 암호화할 수 있습니다.
- `'decrypt'` - 키를 사용하여 데이터를 복호화할 수 있습니다.
- `'sign'` - 키를 사용하여 디지털 서명을 생성할 수 있습니다.
- `'verify'` - 키를 사용하여 디지털 서명을 확인할 수 있습니다.
- `'deriveKey'` - 키를 사용하여 새 키를 파생시킬 수 있습니다.
- `'deriveBits'` - 키를 사용하여 비트를 파생시킬 수 있습니다.
- `'wrapKey'` - 키를 사용하여 다른 키를 래핑할 수 있습니다.
- `'unwrapKey'` - 키를 사용하여 다른 키의 래핑을 해제할 수 있습니다.

유효한 키 용도는 키 알고리즘( `cryptokey.algorithm.name`으로 식별됨)에 따라 다릅니다.

| 키 유형 | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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

`CryptoKeyPair`는 비대칭 키 쌍을 나타내는 `publicKey` 및 `privateKey` 속성이 있는 간단한 딕셔너리 객체입니다.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) `type`이 `'private'`인 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)입니다.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Added in: v15.0.0**

- Type: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) `type`이 `'public'`인 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)입니다.

## Class: `SubtleCrypto` {#class-subtlecrypto}

**Added in: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Added in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ko/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ko/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ko/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ko/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 완료됩니다.

`algorithm`에 지정된 방법과 매개변수 및 `key`에서 제공된 키 자료를 사용하여 `subtle.decrypt()`는 제공된 `data`를 해독하려고 시도합니다. 성공하면 반환된 Promise는 일반 텍스트 결과가 포함된 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 해결됩니다.

현재 지원되는 알고리즘은 다음과 같습니다.

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.5.0, v20.17.0 | 이제 `'ECDH'`, `'X25519'`, `'X448'`에 대해 length 매개변수가 선택 사항입니다. |
| v18.4.0, v16.17.0 | `'X25519'`, `'X448'` 알고리즘이 추가되었습니다. |
| v15.0.0 | 추가됨: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ko/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ko/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ko/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **기본값:** `null`
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 이행합니다.

`algorithm`에 지정된 방법 및 매개변수와 `baseKey`에서 제공하는 키 재료를 사용하여 `subtle.deriveBits()`는 `length` 비트를 생성하려고 시도합니다.

`length`가 제공되지 않거나 `null`인 경우 주어진 알고리즘에 대한 최대 비트 수가 생성됩니다. 이는 `'ECDH'`, `'X25519'`, `'X448'` 알고리즘에 대해 허용되며, 다른 알고리즘의 경우 `length`는 숫자여야 합니다.

성공하면 반환된 Promise는 생성된 데이터를 포함하는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 확인됩니다.

현재 지원되는 알고리즘은 다음과 같습니다.

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0, v16.17.0 | `'X25519'`, `'X448'` 알고리즘이 추가되었습니다. |
| v15.0.0 | 추가됨: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ko/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ko/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ko/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/ko/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ko/nodejs/api/webcrypto#class-aeskeygenparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [키 사용법](/ko/nodejs/api/webcrypto#cryptokeyusages)을 참조하십시오.
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)로 이행합니다.

`algorithm`에 지정된 방법 및 매개변수와 `baseKey`에서 제공하는 키 재료를 사용하여 `subtle.deriveKey()`는 `derivedKeyAlgorithm`의 방법 및 매개변수를 기반으로 새 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)를 생성하려고 시도합니다.

`subtle.deriveKey()`를 호출하는 것은 `subtle.deriveBits()`를 호출하여 원시 키 재료를 생성한 다음 `deriveKeyAlgorithm`, `extractable` 및 `keyUsages` 매개변수를 입력으로 사용하여 결과를 `subtle.importKey()` 메서드에 전달하는 것과 같습니다.

현재 지원되는 알고리즘은 다음과 같습니다.

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**추가된 버전: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 이행합니다.

`algorithm`으로 식별된 메서드를 사용하여 `subtle.digest()`는 `data`의 다이제스트를 생성하려고 시도합니다. 성공하면 반환된 Promise는 계산된 다이제스트를 포함하는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 해결됩니다.

`algorithm`이 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 제공되는 경우 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

`algorithm`이 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 제공되는 경우 해당 값은 위의 값 중 하나인 `name` 속성이 있어야 합니다.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**추가된 버전: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ko/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ko/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ko/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ko/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 이행합니다.

`algorithm`으로 지정된 방법 및 매개변수와 `key`로 제공된 키 자료를 사용하여 `subtle.encrypt()`는 `data`를 암호화하려고 시도합니다. 성공하면 반환된 Promise는 암호화된 결과를 포함하는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 해결됩니다.

현재 지원되는 알고리즘은 다음과 같습니다.

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'`, `'Ed448'`, `'X25519'`, 및 `'X448'` 알고리즘이 추가되었습니다. |
| v15.9.0 | `'NODE-DSA'` JWK 내보내기가 제거되었습니다. |
| v15.0.0 | 추가됨: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'`, 또는 `'jwk'` 중 하나여야 합니다.
- `key`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 이행합니다.

지원되는 경우 지정된 형식으로 주어진 키를 내보냅니다.

[\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)를 추출할 수 없으면 반환된 Promise가 거부됩니다.

`format`이 `'pkcs8'` 또는 `'spki'`이고 내보내기가 성공하면 반환된 Promise는 내보낸 키 데이터를 포함하는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 확인됩니다.

`format`이 `'jwk'`이고 내보내기가 성공하면 반환된 Promise는 [JSON Web Key](https://tools.ietf.org/html/rfc7517) 사양을 준수하는 JavaScript 객체로 확인됩니다.

| 키 유형 | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**추가된 버전: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/ko/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ko/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ko/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ko/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [키 용도](/ko/nodejs/api/webcrypto#cryptokeyusages)를 참조하십시오.
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/ko/nodejs/api/webcrypto#class-cryptokeypair)로 이행합니다.

`algorithm`에 제공된 메서드 및 매개 변수를 사용하여 `subtle.generateKey()`는 새로운 키 재료를 생성하려고 시도합니다. 사용된 메서드에 따라 메서드는 단일 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) 또는 [\<CryptoKeyPair\>](/ko/nodejs/api/webcrypto#class-cryptokeypair)를 생성할 수 있습니다.

지원되는 [\<CryptoKeyPair\>](/ko/nodejs/api/webcrypto#class-cryptokeypair) (공개 및 개인 키) 생성 알고리즘은 다음과 같습니다.

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'ECDH'`
- `'X25519'`
- `'X448'` 

지원되는 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) (비밀 키) 생성 알고리즘은 다음과 같습니다.

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'`, `'Ed448'`, `'X25519'`, 및 `'X448'` 알고리즘이 추가되었습니다. |
| v15.9.0 | `'NODE-DSA'` JWK 가져오기가 제거되었습니다. |
| v15.0.0 | 다음에서 추가됨: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'`, 또는 `'jwk'` 중 하나여야 합니다.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ko/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ko/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ko/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [키 용도](/ko/nodejs/api/webcrypto#cryptokeyusages)를 참조하십시오.
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)로 이행합니다.

`subtle.importKey()` 메서드는 제공된 `keyData`를 지정된 `format`으로 해석하여 제공된 `algorithm`, `extractable` 및 `keyUsages` 인수를 사용하여 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) 인스턴스를 생성하려고 시도합니다. 가져오기가 성공하면 반환된 프로미스는 생성된 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)로 해결됩니다.

`'PBKDF2'` 키를 가져오는 경우 `extractable`은 `false`여야 합니다.

현재 지원되는 알고리즘은 다음과 같습니다.

| 키 유형 | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'` 및 `'Ed448'` 알고리즘이 추가되었습니다. |
| v15.0.0 | 다음 버전부터 추가되었습니다: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ko/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ko/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ko/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 이행합니다.

`algorithm`에 주어진 방법 및 매개변수와 `key`에서 제공하는 키 자료를 사용하여 `subtle.sign()`은 `data`의 암호화 서명을 생성하려고 시도합니다. 성공하면 생성된 서명이 포함된 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 반환된 프로미스가 해결됩니다.

현재 지원되는 알고리즘은 다음과 같습니다.

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**다음 버전부터 추가되었습니다: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'` 또는 `'jwk'` 중 하나여야 합니다.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ko/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ko/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ko/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ko/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ko/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ko/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ko/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [키 용도](/ko/nodejs/api/webcrypto#cryptokeyusages)를 참조하십시오.
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)로 이행합니다.

암호화에서 "키 래핑"은 키 자료를 내보낸 다음 암호화하는 것을 의미합니다. `subtle.unwrapKey()` 메서드는 래핑된 키를 해독하고 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) 인스턴스를 생성하려고 시도합니다. 이는 암호화된 키 데이터에 대해 먼저 `subtle.decrypt()`를 호출한 다음(`wrappedKey`, `unwrapAlgo` 및 `unwrappingKey` 인수를 입력으로 사용) 결과를 `unwrappedKeyAlgo`, `extractable` 및 `keyUsages` 인수를 입력으로 사용하여 `subtle.importKey()` 메서드에 전달하는 것과 같습니다. 성공하면 반환된 프로미스는 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey) 객체로 해결됩니다.

현재 지원되는 래핑 알고리즘은 다음과 같습니다.

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

지원되는 래핑 해제된 키 알고리즘은 다음과 같습니다.

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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'` 및 `'Ed448'` 알고리즘 추가. |
| v15.0.0 | v15.0.0에 추가됨 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ko/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ko/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ko/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)으로 이행합니다.

`algorithm`에 주어진 방법 및 매개변수와 `key`에서 제공하는 키 재료를 사용하여 `subtle.verify()`는 `signature`가 `data`의 유효한 암호화 서명인지 확인하려고 시도합니다. 반환된 프로미스는 `true` 또는 `false`로 해결됩니다.

현재 지원되는 알고리즘은 다음과 같습니다.

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**추가됨: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'raw'`, `'pkcs8'`, `'spki'` 또는 `'jwk'` 중 하나여야 합니다.
- `key`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/ko/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ko/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ko/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ko/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ko/nodejs/api/webcrypto#class-aesgcmparams)
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 이행합니다.

암호화에서 "키 래핑"은 키 재료를 내보낸 다음 암호화하는 것을 의미합니다. `subtle.wrapKey()` 메서드는 키 재료를 `format`으로 식별된 형식으로 내보낸 다음 `wrapAlgo`로 지정된 방법 및 매개변수와 `wrappingKey`로 제공된 키 재료를 사용하여 암호화합니다. 이는 인수로 `format` 및 `key`를 사용하여 `subtle.exportKey()`를 호출한 다음 결과를 입력으로 `wrappingKey` 및 `wrapAlgo`를 사용하여 `subtle.encrypt()` 메서드에 전달하는 것과 같습니다. 성공하면 반환된 프로미스는 암호화된 키 데이터를 포함하는 [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)로 해결됩니다.

현재 지원되는 래핑 알고리즘은 다음과 같습니다.

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## 알고리즘 매개변수 {#algorithm-parameters}

알고리즘 매개변수 객체는 다양한 [\<SubtleCrypto\>](/ko/nodejs/api/webcrypto#class-subtlecrypto) 메서드에서 사용되는 메서드와 매개변수를 정의합니다. 여기서 "클래스"로 설명되지만, 단순한 JavaScript 사전 객체입니다.

### 클래스: `AlgorithmIdentifier` {#class-algorithmidentifier}

**추가된 버전: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**추가된 버전: v18.4.0, v16.17.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### 클래스: `AesCbcParams` {#class-aescbcparams}

**추가된 버전: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**추가된 버전: v15.0.0**

- 타입: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

초기화 벡터를 제공합니다. 정확히 16바이트 길이여야 하며 예측 불가능하고 암호학적으로 안전한 임의의 값이어야 합니다.

#### `aesCbcParams.name` {#aescbcparamsname}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-CBC'`여야 합니다.

### 클래스: `AesCtrParams` {#class-aesctrparams}

**추가된 버전: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**추가된 버전: v15.0.0**

- 타입: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

카운터 블록의 초기 값입니다. 정확히 16바이트여야 합니다.

`AES-CTR` 메서드는 블록의 가장 오른쪽 `length` 비트를 카운터로 사용하고 나머지 비트를 nonce로 사용합니다.

#### `aesCtrParams.length` {#aesctrparamslength}

**추가된 버전: v15.0.0**

- 타입: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `aesCtrParams.counter`에서 카운터로 사용할 비트 수입니다.


#### `aesCtrParams.name` {#aesctrparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-CTR'`이어야 합니다.

### Class: `AesGcmParams` {#class-aesgcmparams}

**Added in: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

AES-GCM 메서드를 사용하면 `additionalData`는 암호화되지 않지만 데이터 인증에 포함되는 추가 입력입니다. `additionalData`의 사용은 선택 사항입니다.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

초기화 벡터는 주어진 키를 사용하는 모든 암호화 작업에 대해 고유해야 합니다.

이상적으로, 이는 동일한 키를 사용하는 모든 호출에서 고유성이 보장되도록 계산된 결정적 12바이트 값입니다. 또는 초기화 벡터는 최소 12개의 암호화 방식으로 임의적인 바이트로 구성될 수 있습니다. AES-GCM에 대한 초기화 벡터 구성에 대한 자세한 내용은 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)의 섹션 8을 참조하십시오.

#### `aesGcmParams.name` {#aesgcmparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-GCM'`이어야 합니다.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**추가된 버전: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 인증 태그의 비트 단위 크기입니다. 이 값은 `32`, `64`, `96`, `104`, `112`, `120` 또는 `128` 중 하나여야 합니다. **기본값:** `128`.

### 클래스: `AesKeyGenParams` {#class-aeskeygenparams}

**추가된 버전: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**추가된 버전: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

생성될 AES 키의 길이입니다. `128`, `192` 또는 `256` 중 하나여야 합니다.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**추가된 버전: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` 또는 `'AES-KW'` 중 하나여야 합니다.

### 클래스: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**추가된 버전: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**추가된 버전: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDH'`, `'X25519'` 또는 `'X448'` 중 하나여야 합니다.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**추가된 버전: v15.0.0**

- Type: [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)

ECDH 키 파생은 한쪽 당사자의 개인 키와 다른 쪽 당사자의 공개 키를 입력으로 받아 공통 공유 비밀을 생성하여 작동합니다. `ecdhKeyDeriveParams.public` 속성은 다른 당사자의 공개 키로 설정됩니다.

### 클래스: `EcdsaParams` {#class-ecdsaparams}

**추가된 버전: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**추가된 버전: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)으로 표현되는 경우 객체는 값이 위에 나열된 값 중 하나인 `name` 속성을 가져야 합니다.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Added in: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDSA'`여야 합니다.

### 클래스: `EcKeyGenParams` {#class-eckeygenparams}

**Added in: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Added in: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDSA'` 또는 `'ECDH'` 중 하나여야 합니다.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Added in: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'P-256'`, `'P-384'`, `'P-521'` 중 하나여야 합니다.

### 클래스: `EcKeyImportParams` {#class-eckeyimportparams}

**Added in: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Added in: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ECDSA'` 또는 `'ECDH'` 중 하나여야 합니다.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Added in: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'P-256'`, `'P-384'`, `'P-521'` 중 하나여야 합니다.

### 클래스: `Ed448Params` {#class-ed448params}

**Added in: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Added in: v18.4.0, v16.17.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'Ed448'`여야 합니다.

#### `ed448Params.context` {#ed448paramscontext}

**Added in: v18.4.0, v16.17.0**

- 유형: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`context` 멤버는 메시지와 연결할 선택적 컨텍스트 데이터를 나타냅니다. Node.js Web Crypto API 구현은 컨텍스트를 전혀 제공하지 않는 것과 동일한 길이 0의 컨텍스트만 지원합니다.


### Class: `HkdfParams` {#class-hkdfparams}

**Added in: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우, 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 표현되는 경우, 객체는 위 나열된 값 중 하나인 `name` 속성을 가져야 합니다.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

HKDF 알고리즘에 대한 응용 프로그램별 컨텍스트 입력을 제공합니다. 길이는 0일 수 있지만 반드시 제공되어야 합니다.

#### `hkdfParams.name` {#hkdfparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'HKDF'`여야 합니다.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Added in: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

솔트 값은 HKDF 알고리즘의 강도를 크게 향상시킵니다. 임의적이거나 유사 임의적이어야 하며 다이제스트 함수의 출력과 길이가 같아야 합니다(예: `'SHA-256'`을 다이제스트로 사용하는 경우 솔트는 256비트의 임의 데이터여야 함).


### 클래스: `HmacImportParams` {#class-hmacimportparams}

**추가된 버전: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**추가된 버전: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우, 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 표현되는 경우, 객체는 `name` 속성을 가져야 하며, 그 값은 위에 나열된 값 중 하나여야 합니다.

#### `hmacImportParams.length` {#hmacimportparamslength}

**추가된 버전: v15.0.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HMAC 키의 선택적 비트 수입니다. 선택 사항이며 대부분의 경우 생략해야 합니다.

#### `hmacImportParams.name` {#hmacimportparamsname}

**추가된 버전: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'HMAC'`여야 합니다.

### 클래스: `HmacKeyGenParams` {#class-hmackeygenparams}

**추가된 버전: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**추가된 버전: v15.0.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우, 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 표현되는 경우, 객체는 `name` 속성을 가져야 하며, 그 값은 위에 나열된 값 중 하나여야 합니다.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**추가된 버전: v15.0.0**

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HMAC 키에 대해 생성할 비트 수입니다. 생략하면 길이는 사용된 해시 알고리즘에 따라 결정됩니다. 선택 사항이며 대부분의 경우 생략해야 합니다.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'HMAC'` 이어야 합니다.

### 클래스: `Pbkdf2Params` {#class-pbkdf2params}

**추가된 버전: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우, 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 표현되는 경우, 객체는 값이 위에 나열된 값 중 하나인 `name` 속성을 가져야 합니다.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**추가된 버전: v15.0.0**

- 타입: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

PBKDF2 알고리즘이 비트를 파생할 때 수행해야 하는 반복 횟수입니다.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'PBKDF2'` 이어야 합니다.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**추가된 버전: v15.0.0**

- 타입: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

최소 16바이트의 임의 또는 유사 난수 바이트여야 합니다.

### 클래스: `RsaHashedImportParams` {#class-rsahashedimportparams}

**추가된 버전: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우, 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 표현되는 경우, 객체는 값이 위에 나열된 값 중 하나인 `name` 속성을 가져야 합니다.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, 또는 `'RSA-OAEP'` 중 하나여야 합니다.

### 클래스: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Added in: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)으로 표현되는 경우, 값은 다음 중 하나여야 합니다.

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)로 표현되는 경우, 객체는 위에 나열된 값 중 하나인 `name` 속성을 가져야 합니다.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Added in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

RSA 모듈러스의 비트 단위 길이입니다. 모범 사례로서, 최소 `2048`이어야 합니다.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Added in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, 또는 `'RSA-OAEP'` 중 하나여야 합니다.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Added in: v15.0.0**

- Type: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

RSA 공개 지수입니다. 이것은 32비트 내에 들어맞아야 하는 빅 엔디안, 부호 없는 정수를 포함하는 [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)여야 합니다. [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)는 임의의 수의 선행 0비트를 포함할 수 있습니다. 값은 소수여야 합니다. 다른 값을 사용할 이유가 없으면 `new Uint8Array([1, 0, 1])` (65537)을 공개 지수로 사용하십시오.


### 클래스: `RsaOaepParams` {#class-rsaoaepparams}

**추가된 버전: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**추가된 버전: v15.0.0**

- 타입: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

암호화되지 않지만 생성된 암호문에 바인딩될 추가 바이트 컬렉션입니다.

`rsaOaepParams.label` 매개변수는 선택 사항입니다.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSA-OAEP'`여야 합니다.

### 클래스: `RsaPssParams` {#class-rsapssparams}

**추가된 버전: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**추가된 버전: v15.0.0**

- 타입: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'RSA-PSS'`여야 합니다.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**추가된 버전: v15.0.0**

- 타입: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

사용할 임의 솔트의 길이(바이트)입니다.

## 각주 {#footnotes}

