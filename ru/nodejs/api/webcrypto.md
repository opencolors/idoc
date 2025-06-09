---
title: API Web Crypto в Node.js
description: API Web Crypto в Node.js предоставляет набор криптографических функций для безопасной коммуникации и целостности данных, включая генерацию ключей, шифрование, дешифрование, подписывание и проверку.
head:
  - - meta
    - name: og:title
      content: API Web Crypto в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: API Web Crypto в Node.js предоставляет набор криптографических функций для безопасной коммуникации и целостности данных, включая генерацию ключей, шифрование, дешифрование, подписывание и проверку.
  - - meta
    - name: twitter:title
      content: API Web Crypto в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: API Web Crypto в Node.js предоставляет набор криптографических функций для безопасной коммуникации и целостности данных, включая генерацию ключей, шифрование, дешифрование, подписывание и проверку.
---


# Web Crypto API {#web-crypto-api}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Алгоритмы `Ed25519` и `X25519` теперь стабильны. |
| v19.0.0 | Больше не является экспериментальным, за исключением алгоритмов `Ed25519`, `Ed448`, `X25519` и `X448`. |
| v20.0.0, v18.17.0 | Аргументы теперь приводятся и проверяются в соответствии с их определениями WebIDL, как и в других реализациях Web Crypto API. |
| v18.4.0, v16.17.0 | Удален проприетарный формат импорта/экспорта `'node.keyObject'`. |
| v18.4.0, v16.17.0 | Удалены проприетарные алгоритмы `'NODE-DSA'`, `'NODE-DH'` и `'NODE-SCRYPT'`. |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'Ed25519'`, `'Ed448'`, `'X25519'` и `'X448'`. |
| v18.4.0, v16.17.0 | Удалены проприетарные алгоритмы `'NODE-ED25519'` и `'NODE-ED448'`. |
| v18.4.0, v16.17.0 | Удалены проприетарные именованные кривые `'NODE-X25519'` и `'NODE-X448'` из алгоритма `'ECDH'`. |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Node.js предоставляет реализацию стандартного [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/).

Используйте `globalThis.crypto` или `require('node:crypto').webcrypto` для доступа к этому модулю.

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
## Примеры {#examples}

### Генерация ключей {#generating-keys}

Класс [\<SubtleCrypto\>](/ru/nodejs/api/webcrypto#class-subtlecrypto) может использоваться для генерации симметричных (секретных) ключей или асимметричных пар ключей (открытый ключ и закрытый ключ).

#### AES ключи {#aes-keys}

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

#### Пары ключей ECDSA {#ecdsa-key-pairs}

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
#### Пары ключей Ed25519/X25519 {#ed25519/x25519-key-pairs}

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
#### Ключи HMAC {#hmac-keys}

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
#### Пары ключей RSA {#rsa-key-pairs}

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
### Шифрование и дешифрование {#encryption-and-decryption}

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
### Экспорт и импорт ключей {#exporting-and-importing-keys}

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

### Упаковка и распаковка ключей {#wrapping-and-unwrapping-keys}

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
### Подпись и проверка {#sign-and-verify}

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
### Получение битов и ключей {#deriving-bits-and-keys}

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

Таблица подробно описывает алгоритмы, поддерживаемые реализацией Node.js Web Crypto API, и API, поддерживаемые для каждого из них:

| Алгоритм | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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

**Добавлено в: v15.0.0**

`globalThis.crypto` является экземпляром класса `Crypto`. `Crypto` - это синглтон, который предоставляет доступ к остальной части криптографического API.

### `crypto.subtle` {#cryptosubtle}

**Добавлено в: v15.0.0**

- Тип: [\<SubtleCrypto\>](/ru/nodejs/api/webcrypto#class-subtlecrypto)

Предоставляет доступ к API `SubtleCrypto`.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Добавлено в: v15.0.0**

- `typedArray` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Генерирует криптографически стойкие случайные значения. Данный `typedArray` заполняется случайными значениями и возвращается ссылка на `typedArray`.

Данный `typedArray` должен быть целочисленным экземпляром [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), т.е. `Float32Array` и `Float64Array` не принимаются.

Будет выдана ошибка, если данный `typedArray` больше 65 536 байт.


### `crypto.randomUUID()` {#cryptorandomuuid}

**Добавлено в: v16.7.0**

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Генерирует случайный UUID версии 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt). UUID генерируется с использованием криптографического генератора псевдослучайных чисел.

## Класс: `CryptoKey` {#class-cryptokey}

**Добавлено в: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Добавлено в: v15.0.0**

- Тип: [\<AesKeyGenParams\>](/ru/nodejs/api/webcrypto#class-keygenparams) | [\<RsaHashedKeyGenParams\>](/ru/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ru/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ru/nodejs/api/webcrypto#class-hmackeygenparams)

Объект, детализирующий алгоритм, для которого может использоваться ключ, вместе с дополнительными параметрами, специфичными для алгоритма.

Только для чтения.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Добавлено в: v15.0.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `true`, [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) может быть извлечен с использованием `subtleCrypto.exportKey()` или `subtleCrypto.wrapKey()`.

Только для чтения.

### `cryptoKey.type` {#cryptokeytype}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из `'secret'`, `'private'` или `'public'`.

Строка, определяющая, является ли ключ симметричным (`'secret'`) или асимметричным (`'private'` или `'public'`) ключом.

### `cryptoKey.usages` {#cryptokeyusages}

**Добавлено в: v15.0.0**

- Тип: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Массив строк, определяющих операции, для которых может использоваться ключ.

Возможные варианты использования:

- `'encrypt'` - Ключ может использоваться для шифрования данных.
- `'decrypt'` - Ключ может использоваться для дешифрования данных.
- `'sign'` - Ключ может использоваться для создания цифровых подписей.
- `'verify'` - Ключ может использоваться для проверки цифровых подписей.
- `'deriveKey'` - Ключ может использоваться для получения нового ключа.
- `'deriveBits'` - Ключ может использоваться для получения битов.
- `'wrapKey'` - Ключ может использоваться для обертывания другого ключа.
- `'unwrapKey'` - Ключ может использоваться для распаковки другого ключа.

Допустимые варианты использования ключа зависят от алгоритма ключа (определяется `cryptokey.algorithm.name`).

| Тип ключа | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
|---|---|---|---|---|---|---|---|---|
| `'AES-CBC'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'AES-CTR'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'AES-GCM'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'AES-KW'` ||||||| ✔ | ✔ |
| `'ECDH'` ||||| ✔ | ✔ |||
| `'X25519'` ||||| ✔ | ✔ |||
| `'X448'` ||||| ✔ | ✔ |||
| `'ECDSA'` ||| ✔ | ✔ |||||
| `'Ed25519'` ||| ✔ | ✔ |||||
| `'Ed448'` ||| ✔ | ✔ |||||
| `'HDKF'` ||||| ✔ | ✔ |||
| `'HMAC'` ||| ✔ | ✔ |||||
| `'PBKDF2'` ||||| ✔ | ✔ |||
| `'RSA-OAEP'` | ✔ | ✔ ||||| ✔ | ✔ |
| `'RSA-PSS'` ||| ✔ | ✔ |||||
| `'RSASSA-PKCS1-v1_5'` ||| ✔ | ✔ |||||

## Class: `CryptoKeyPair` {#class-cryptokeypair}

**Добавлено в версии: v15.0.0**

`CryptoKeyPair` — это простой объект-словарь со свойствами `publicKey` и `privateKey`, представляющий асимметричную пару ключей.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Добавлено в версии: v15.0.0**

- Тип: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) A [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey), у которого `type` будет `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Добавлено в версии: v15.0.0**

- Тип: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) A [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey), у которого `type` будет `'public'`.

## Class: `SubtleCrypto` {#class-subtlecrypto}

**Добавлено в версии: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Добавлено в версии: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ru/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ru/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ru/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ru/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Используя метод и параметры, указанные в `algorithm`, и ключевой материал, предоставленный `key`, `subtle.decrypt()` пытается расшифровать предоставленные `data`. В случае успеха возвращаемый промис будет разрешен с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим результирующий открытый текст.

В настоящее время поддерживаются следующие алгоритмы:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.5.0, v20.17.0 | Параметр length теперь необязателен для `'ECDH'`, `'X25519'` и `'X448'`. |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'X25519'` и `'X448'`. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ru/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ru/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ru/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Используя метод и параметры, указанные в `algorithm`, и ключевой материал, предоставленный `baseKey`, `subtle.deriveBits()` пытается сгенерировать `length` бит.

Когда `length` не указан или `null`, генерируется максимальное количество битов для данного алгоритма. Это разрешено для алгоритмов `'ECDH'`, `'X25519'` и `'X448'`, для других алгоритмов `length` должен быть числом.

В случае успеха возвращенный промис будет разрешен с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим сгенерированные данные.

В настоящее время поддерживаются следующие алгоритмы:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'X25519'` и `'X448'`. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ru/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ru/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ru/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/ru/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ru/nodejs/api/webcrypto#class-aeskeygenassistparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [Использование ключей](/ru/nodejs/api/webcrypto#cryptokeyusages).
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)

Используя метод и параметры, указанные в `algorithm`, и ключевой материал, предоставленный `baseKey`, `subtle.deriveKey()` пытается сгенерировать новый [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) на основе метода и параметров в `derivedKeyAlgorithm`.

Вызов `subtle.deriveKey()` эквивалентен вызову `subtle.deriveBits()` для генерации необработанного ключевого материала, а затем передаче результата в метод `subtle.importKey()`, используя параметры `deriveKeyAlgorithm`, `extractable` и `keyUsages` в качестве входных данных.

В настоящее время поддерживаются следующие алгоритмы:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Добавлено в: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), разрешается с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Используя метод, указанный в `algorithm`, `subtle.digest()` пытается сгенерировать дайджест `data`. В случае успеха возвращаемый промис разрешается с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим вычисленный дайджест.

Если `algorithm` предоставлен как [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), то он должен быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если `algorithm` предоставлен как [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), то он должен иметь свойство `name`, значение которого является одним из вышеперечисленных.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Добавлено в: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ru/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ru/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ru/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ru/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), разрешается с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Используя метод и параметры, указанные в `algorithm`, и ключевой материал, предоставленный `key`, `subtle.encrypt()` пытается зашифровать `data`. В случае успеха возвращаемый промис разрешается с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим зашифрованный результат.

В настоящее время поддерживаются следующие алгоритмы:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'Ed25519'`, `'Ed448'`, `'X25519'` и `'X448'`. |
| v15.9.0 | Удален экспорт `'NODE-DSA'` JWK. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть одним из `'raw'`, `'pkcs8'`, `'spki'` или `'jwk'`.
- `key`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Экспортирует данный ключ в указанный формат, если поддерживается.

Если [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) не является извлекаемым, возвращенный promise будет отклонен.

Когда `format` является либо `'pkcs8'`, либо `'spki'`, и экспорт успешен, возвращенный promise будет разрешен с помощью [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащего экспортированные данные ключа.

Когда `format` равен `'jwk'`, и экспорт успешен, возвращенный promise будет разрешен с помощью объекта JavaScript, соответствующего спецификации [JSON Web Key](https://tools.ietf.org/html/rfc7517).

| Тип ключа | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**Добавлено в: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/ru/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ru/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ru/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ru/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [Использование ключей](/ru/nodejs/api/webcrypto#cryptokeyusages).
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/ru/nodejs/api/webcrypto#class-cryptokeypair)

Используя метод и параметры, указанные в `algorithm`, `subtle.generateKey()` пытается сгенерировать новый ключевой материал. В зависимости от используемого метода, метод может генерировать либо один [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey), либо [\<CryptoKeyPair\>](/ru/nodejs/api/webcrypto#class-cryptokeypair).

Поддерживаемые алгоритмы генерации [\<CryptoKeyPair\>](/ru/nodejs/api/webcrypto#class-cryptokeypair) (открытый и закрытый ключ) включают:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'ECDH'`
- `'X25519'`
- `'X448'` 

Поддерживаемые алгоритмы генерации [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey) (секретный ключ) включают:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'Ed25519'`, `'Ed448'`, `'X25519'` и `'X448'`. |
| v15.9.0 | Удален импорт `'NODE-DSA'` JWK. |
| v15.0.0 | Добавлено в версии: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'raw'`, `'pkcs8'`, `'spki'` или `'jwk'`.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ru/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ru/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ru/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [Использование ключей](/ru/nodejs/api/webcrypto#cryptokeyusages).
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Завершается экземпляром [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)

Метод `subtle.importKey()` пытается интерпретировать предоставленные `keyData` как заданный `format`, чтобы создать экземпляр [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey), используя предоставленные аргументы `algorithm`, `extractable` и `keyUsages`. Если импорт успешен, возвращаемый промис будет разрешен созданным [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey).

При импорте ключа `'PBKDF2'` `extractable` должно быть `false`.

В настоящее время поддерживаемые алгоритмы включают:

| Тип ключа | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'Ed25519'` и `'Ed448'`. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ru/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ru/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ru/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим сгенерированную подпись.

Используя метод и параметры, заданные `algorithm`, и ключевой материал, предоставленный `key`, `subtle.sign()` пытается сгенерировать криптографическую подпись `data`. В случае успеха возвращаемый промис разрешается с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим сгенерированную подпись.

В настоящее время поддерживаются следующие алгоритмы:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Добавлено в: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть одним из: `'raw'`, `'pkcs8'`, `'spki'` или `'jwk'`.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ru/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ru/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ru/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ru/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ru/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ru/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ru/nodejs/api/webcrypto#class-hmacimportparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [Key usages](/ru/nodejs/api/webcrypto#cryptokeyusages).
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)

В криптографии "обертывание ключа" относится к экспорту и последующему шифрованию ключевого материала. Метод `subtle.unwrapKey()` пытается расшифровать обернутый ключ и создать экземпляр [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey). Это эквивалентно сначала вызову `subtle.decrypt()` для зашифрованных данных ключа (с использованием аргументов `wrappedKey`, `unwrapAlgo` и `unwrappingKey` в качестве входных данных), а затем передаче результатов в метод `subtle.importKey()`, используя аргументы `unwrappedKeyAlgo`, `extractable` и `keyUsages` в качестве входных данных. В случае успеха возвращаемый промис разрешается с объектом [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey).

В настоящее время поддерживаются следующие алгоритмы обертывания:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

Поддерживаемые алгоритмы для развернутого ключа включают:

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

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0, v16.17.0 | Добавлены алгоритмы `'Ed25519'` и `'Ed448'`. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ru/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ru/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ru/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Используя метод и параметры, указанные в `algorithm`, и ключевой материал, предоставленный `key`, `subtle.verify()` пытается проверить, является ли `signature` действительной криптографической подписью `data`. Возвращенный промис разрешается либо `true`, либо `false`.

В настоящее время поддерживаются следующие алгоритмы:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Добавлено в: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть одним из `'raw'`, `'pkcs8'`, `'spki'` или `'jwk'`.
- `key`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/ru/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ru/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ru/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ru/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ru/nodejs/api/webcrypto#class-aesgcmparams)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

В криптографии "упаковка ключа" относится к экспорту и последующему шифрованию ключевого материала. Метод `subtle.wrapKey()` экспортирует ключевой материал в формат, идентифицированный `format`, затем шифрует его с использованием метода и параметров, указанных в `wrapAlgo`, и ключевого материала, предоставленного `wrappingKey`. Это эквивалентно вызову `subtle.exportKey()` с использованием `format` и `key` в качестве аргументов, а затем передаче результата методу `subtle.encrypt()` с использованием `wrappingKey` и `wrapAlgo` в качестве входных данных. В случае успеха возвращенный промис будет разрешен с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим зашифрованные данные ключа.

В настоящее время поддерживаются следующие алгоритмы упаковки:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## Параметры алгоритма {#algorithm-parameters}

Объекты параметров алгоритма определяют методы и параметры, используемые различными методами [\<SubtleCrypto\>](/ru/nodejs/api/webcrypto#class-subtlecrypto). Хотя здесь они описываются как «классы», они являются простыми объектами словаря JavaScript.

### Класс: `AlgorithmIdentifier` {#class-algorithmidentifier}

**Добавлено в: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Добавлено в: v18.4.0, v16.17.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Класс: `AesCbcParams` {#class-aescbcparams}

**Добавлено в: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Добавлено в: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Предоставляет вектор инициализации. Он должен быть ровно 16 байт в длину и должен быть непредсказуемым и криптографически случайным.

#### `aesCbcParams.name` {#aescbcparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть `'AES-CBC'`.

### Класс: `AesCtrParams` {#class-aesctrparams}

**Добавлено в: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Добавлено в: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Начальное значение блока счетчика. Он должен быть ровно 16 байт в длину.

Метод `AES-CTR` использует самые правые `length` биты блока в качестве счетчика, а остальные биты в качестве nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Добавлено в: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество битов в `aesCtrParams.counter`, которые будут использоваться в качестве счетчика.


#### `aesCtrParams.name` {#aesctrparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'AES-CTR'`.

### Class: `AesGcmParams` {#class-aesgcmparams}

**Добавлено в: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Добавлено в: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

В методе AES-GCM `additionalData` является дополнительным входом, который не шифруется, но включается в аутентификацию данных. Использование `additionalData` необязательно.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Добавлено в: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Вектор инициализации должен быть уникальным для каждой операции шифрования с использованием данного ключа.

В идеале это детерминированное 12-байтное значение, которое вычисляется таким образом, чтобы гарантированно быть уникальным для всех вызовов, использующих один и тот же ключ. В качестве альтернативы вектор инициализации может состоять как минимум из 12 криптографически случайных байтов. Для получения дополнительной информации о построении векторов инициализации для AES-GCM см. Раздел 8 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'AES-GCM'`.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Добавлено в версии: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер в битах сгенерированного тега аутентификации. Это значение должно быть одним из `32`, `64`, `96`, `104`, `112`, `120` или `128`. **По умолчанию:** `128`.

### Класс: `AesKeyGenParams` {#class-aeskeygenparams}

**Добавлено в версии: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Добавлено в версии: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Длина AES ключа для генерации. Должна быть `128`, `192` или `256`.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Добавлено в версии: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` или `'AES-KW'`

### Класс: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Добавлено в версии: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Добавлено в версии: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'ECDH'`, `'X25519'` или `'X448'`.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Добавлено в версии: v15.0.0**

- Тип: [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)

Производное ключа ECDH работает, принимая в качестве входных данных закрытый ключ одной стороны и открытый ключ другой стороны — используя оба для генерации общего секретного ключа. Свойству `ecdhKeyDeriveParams.public` присваивается открытый ключ другой стороны.

### Класс: `EcdsaParams` {#class-ecdsaparams}

**Добавлено в версии: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Добавлено в версии: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено как [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено как [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из перечисленных выше значений.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'ECDSA'`.

### Класс: `EcKeyGenParams` {#class-eckeygenparams}

**Добавлено в: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'ECDSA'` или `'ECDH'`.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'P-256'`, `'P-384'`, `'P-521'`.

### Класс: `EcKeyImportParams` {#class-eckeyimportparams}

**Добавлено в: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'ECDSA'` или `'ECDH'`.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'P-256'`, `'P-384'`, `'P-521'`.

### Класс: `Ed448Params` {#class-ed448params}

**Добавлено в: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Добавлено в: v18.4.0, v16.17.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'Ed448'`.

#### `ed448Params.context` {#ed448paramscontext}

**Добавлено в: v18.4.0, v16.17.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Элемент `context` представляет собой дополнительные контекстные данные, связанные с сообщением. Реализация Node.js Web Crypto API поддерживает только контекст нулевой длины, что эквивалентно полному отсутствию контекста.


### Класс: `HkdfParams` {#class-hkdfparams}

**Добавлено в версии: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Добавлено в версии: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено в виде [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено в виде [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из вышеперечисленных значений.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Добавлено в версии: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Предоставляет контекстно-зависимый ввод для алгоритма HKDF, специфичный для приложения. Может быть нулевой длины, но должен быть предоставлен.

#### `hkdfParams.name` {#hkdfparamsname}

**Добавлено в версии: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Добавлено в версии: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Значение соли значительно повышает устойчивость алгоритма HKDF. Оно должно быть случайным или псевдослучайным и иметь ту же длину, что и выходные данные дайджест-функции (например, при использовании `'SHA-256'` в качестве дайджеста, соль должна содержать 256 бит случайных данных).


### Класс: `HmacImportParams` {#class-hmacimportparams}

**Добавлено в: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено как [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено как [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из вышеперечисленных значений.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Добавлено в: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Необязательное количество бит в ключе HMAC. Это необязательно и в большинстве случаев должно быть опущено.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'HMAC'`.

### Класс: `HmacKeyGenParams` {#class-hmackeygenparams}

**Добавлено в: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено как [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено как [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из вышеперечисленных значений.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Добавлено в: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество бит для генерации ключа HMAC. Если опущено, длина будет определяться используемым алгоритмом хеширования. Это необязательно и в большинстве случаев должно быть опущено.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Добавлено в: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'HMAC'`.

### Класс: `Pbkdf2Params` {#class-pbkdf2params}

**Добавлено в: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Добавлено в: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено как [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), то значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено как [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из вышеперечисленных значений.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Добавлено в: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество итераций, которые алгоритм PBKDF2 должен выполнить при получении битов.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Добавлено в: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть `'PBKDF2'`.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Добавлено в: v15.0.0**

- Type: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Должно быть не менее 16 случайных или псевдослучайных байтов.

### Класс: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Добавлено в: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Добавлено в: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено как [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), то значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено как [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из вышеперечисленных значений.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` или `'RSA-OAEP'`.

### Класс: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Добавлено в: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если представлено в виде [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), значение должно быть одним из:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Если представлено в виде [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), объект должен иметь свойство `name`, значение которого является одним из вышеперечисленных значений.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Добавлено в: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Длина в битах RSA модуля. В качестве наилучшей практики, должно быть не менее `2048`.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должно быть одним из `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` или `'RSA-OAEP'`.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Добавлено в: v15.0.0**

- Тип: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Открытый показатель RSA. Это должен быть [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), содержащий большое конечное, беззнаковое целое число, которое должно помещаться в 32 бита. [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) может содержать произвольное количество ведущих нулевых битов. Значение должно быть простым числом. Если нет причин использовать другое значение, используйте `new Uint8Array([1, 0, 1])` (65537) в качестве открытого показателя.


### Класс: `RsaOaepParams` {#class-rsaoaepparams}

**Добавлено в: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Добавлено в: v15.0.0**

- Тип: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Дополнительный набор байтов, который не будет зашифрован, но будет привязан к сгенерированному зашифрованному тексту.

Параметр `rsaOaepParams.label` является необязательным.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) должен быть `'RSA-OAEP'`.

### Класс: `RsaPssParams` {#class-rsapssparams}

**Добавлено в: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Добавлено в: v15.0.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Добавлено в: v15.0.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Длина (в байтах) случайной соли для использования.

## Сноски {#footnotes}

