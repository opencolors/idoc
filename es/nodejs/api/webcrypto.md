---
title: API Web Crypto de Node.js
description: La API Web Crypto de Node.js proporciona un conjunto de funciones criptográficas para la comunicación segura y la integridad de datos, incluyendo la generación de claves, cifrado, descifrado, firma y verificación.
head:
  - - meta
    - name: og:title
      content: API Web Crypto de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La API Web Crypto de Node.js proporciona un conjunto de funciones criptográficas para la comunicación segura y la integridad de datos, incluyendo la generación de claves, cifrado, descifrado, firma y verificación.
  - - meta
    - name: twitter:title
      content: API Web Crypto de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La API Web Crypto de Node.js proporciona un conjunto de funciones criptográficas para la comunicación segura y la integridad de datos, incluyendo la generación de claves, cifrado, descifrado, firma y verificación.
---


# Web Crypto API {#web-crypto-api}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | Los algoritmos `Ed25519` y `X25519` ahora son estables. |
| v19.0.0 | Ya no es experimental excepto por los algoritmos `Ed25519`, `Ed448`, `X25519` y `X448`. |
| v20.0.0, v18.17.0 | Los argumentos ahora se coaccionan y validan según sus definiciones WebIDL como en otras implementaciones de Web Crypto API. |
| v18.4.0, v16.17.0 | Se eliminó el formato de importación/exportación propietario `'node.keyObject'`. |
| v18.4.0, v16.17.0 | Se eliminaron los algoritmos propietarios `'NODE-DSA'`, `'NODE-DH'` y `'NODE-SCRYPT'`. |
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'Ed25519'`, `'Ed448'`, `'X25519'` y `'X448'`. |
| v18.4.0, v16.17.0 | Se eliminaron los algoritmos propietarios `'NODE-ED25519'` y `'NODE-ED448'`. |
| v18.4.0, v16.17.0 | Se eliminaron las curvas con nombre propietarias `'NODE-X25519'` y `'NODE-X448'` del algoritmo `'ECDH'`. |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Node.js proporciona una implementación de la [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) estándar.

Use `globalThis.crypto` o `require('node:crypto').webcrypto` para acceder a este módulo.

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
## Ejemplos {#examples}

### Generando claves {#generating-keys}

La clase [\<SubtleCrypto\>](/es/nodejs/api/webcrypto#class-subtlecrypto) se puede usar para generar claves simétricas (secretas) o pares de claves asimétricas (clave pública y clave privada).

#### Claves AES {#aes-keys}

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

#### Pares de claves ECDSA {#ecdsa-key-pairs}

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
#### Pares de claves Ed25519/X25519 {#ed25519/x25519-key-pairs}

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
#### Claves HMAC {#hmac-keys}

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
#### Pares de claves RSA {#rsa-key-pairs}

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
### Cifrado y descifrado {#encryption-and-decryption}

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
### Exportación e importación de claves {#exporting-and-importing-keys}

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

### Envolver y desenvolver claves {#wrapping-and-unwrapping-keys}

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
### Firmar y verificar {#sign-and-verify}

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
### Derivar bits y claves {#deriving-bits-and-keys}

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
## Matriz de algoritmos {#algorithm-matrix}

La tabla detalla los algoritmos compatibles con la implementación de la API de Crypto Web de Node.js y las API compatibles para cada uno:

| Algoritmo | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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
## Clase: `Crypto` {#class-crypto}

**Agregado en: v15.0.0**

`globalThis.crypto` es una instancia de la clase `Crypto`. `Crypto` es un singleton que proporciona acceso al resto de la API de crypto.

### `crypto.subtle` {#cryptosubtle}

**Agregado en: v15.0.0**

- Tipo: [\<SubtleCrypto\>](/es/nodejs/api/webcrypto#class-subtlecrypto)

Proporciona acceso a la API `SubtleCrypto`.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Agregado en: v15.0.0**

- `typedArray` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Genera valores aleatorios criptográficamente seguros. El `typedArray` dado se llena con valores aleatorios, y se devuelve una referencia a `typedArray`.

El `typedArray` dado debe ser una instancia basada en enteros de [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), es decir, `Float32Array` y `Float64Array` no se aceptan.

Se lanzará un error si el `typedArray` dado es mayor que 65,536 bytes.


### `crypto.randomUUID()` {#cryptorandomuuid}

**Añadido en: v16.7.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera un UUID aleatorio versión 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt). El UUID se genera utilizando un generador de números pseudoaleatorios criptográfico.

## Clase: `CryptoKey` {#class-cryptokey}

**Añadido en: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Añadido en: v15.0.0**

- Tipo: [\<AesKeyGenParams\>](/es/nodejs/api/webcrypto#class-aeskeygenassistparams) | [\<RsaHashedKeyGenParams\>](/es/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/es/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/es/nodejs/api/webcrypto#class-hmackeygenparams)

Un objeto que detalla el algoritmo para el cual se puede utilizar la clave junto con parámetros adicionales específicos del algoritmo.

De solo lectura.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Añadido en: v15.0.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cuando es `true`, la [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) puede extraerse usando `subtleCrypto.exportKey()` o `subtleCrypto.wrapKey()`.

De solo lectura.

### `cryptoKey.type` {#cryptokeytype}

**Añadido en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de `'secret'`, `'private'` o `'public'`.

Una cadena que identifica si la clave es simétrica (`'secret'`) o asimétrica (`'private'` o `'public'`).

### `cryptoKey.usages` {#cryptokeyusages}

**Añadido en: v15.0.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una matriz de cadenas que identifican las operaciones para las que se puede utilizar la clave.

Los posibles usos son:

- `'encrypt'` - La clave se puede utilizar para cifrar datos.
- `'decrypt'` - La clave se puede utilizar para descifrar datos.
- `'sign'` - La clave se puede utilizar para generar firmas digitales.
- `'verify'` - La clave se puede utilizar para verificar firmas digitales.
- `'deriveKey'` - La clave se puede utilizar para derivar una nueva clave.
- `'deriveBits'` - La clave se puede utilizar para derivar bits.
- `'wrapKey'` - La clave se puede utilizar para envolver otra clave.
- `'unwrapKey'` - La clave se puede utilizar para desenvolver otra clave.

Los usos válidos de la clave dependen del algoritmo de la clave (identificado por `cryptokey.algorithm.name`).

| Tipo de Clave | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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

## Clase: `CryptoKeyPair` {#class-cryptokeypair}

**Agregada en: v15.0.0**

`CryptoKeyPair` es un objeto de diccionario simple con propiedades `publicKey` y `privateKey`, que representa un par de claves asimétricas.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Agregada en: v15.0.0**

- Tipo: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) Una [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) cuyo `type` será `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Agregada en: v15.0.0**

- Tipo: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) Una [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) cuyo `type` será `'public'`.

## Clase: `SubtleCrypto` {#class-subtlecrypto}

**Agregada en: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Agregada en: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/es/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/es/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/es/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/es/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando el método y los parámetros especificados en `algorithm` y el material de clave proporcionado por `key`, `subtle.decrypt()` intenta descifrar los `data` proporcionados. Si tiene éxito, la promesa devuelta se resolverá con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene el resultado del texto plano.

Los algoritmos actualmente admitidos incluyen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.5.0, v20.17.0 | El parámetro length ahora es opcional para `'ECDH'`, `'X25519'` y `'X448'`. |
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'X25519'` y `'X448'`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/es/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/es/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/es/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando el método y los parámetros especificados en `algorithm` y el material de clave proporcionado por `baseKey`, `subtle.deriveBits()` intenta generar `length` bits.

Cuando `length` no se proporciona o es `null`, se genera el número máximo de bits para un algoritmo dado. Esto está permitido para los algoritmos `'ECDH'`, `'X25519'` y `'X448'`, para otros algoritmos se requiere que `length` sea un número.

Si tiene éxito, la promesa devuelta se resolverá con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene los datos generados.

Los algoritmos actualmente admitidos incluyen:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'X25519'` y `'X448'`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/es/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/es/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/es/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/es/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/es/nodejs/api/webcrypto#class-aeskeygenparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [Usos de claves](/es/nodejs/api/webcrypto#cryptokeyusages).
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)

Usando el método y los parámetros especificados en `algorithm`, y el material de clave proporcionado por `baseKey`, `subtle.deriveKey()` intenta generar una nueva [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) basada en el método y los parámetros en `derivedKeyAlgorithm`.

Llamar a `subtle.deriveKey()` es equivalente a llamar a `subtle.deriveBits()` para generar material de clave sin procesar, luego pasar el resultado al método `subtle.importKey()` usando los parámetros `deriveKeyAlgorithm`, `extractable` y `keyUsages` como entrada.

Los algoritmos actualmente admitidos incluyen:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Añadido en: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando el método identificado por `algorithm`, `subtle.digest()` intenta generar un resumen de `data`. Si tiene éxito, la promesa devuelta se resuelve con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene el resumen calculado.

Si `algorithm` se proporciona como un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), debe ser uno de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si `algorithm` se proporciona como un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), debe tener una propiedad `name` cuyo valor sea uno de los anteriores.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Añadido en: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/es/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/es/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/es/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/es/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando el método y los parámetros especificados por `algorithm` y el material de clave proporcionado por `key`, `subtle.encrypt()` intenta cifrar `data`. Si tiene éxito, la promesa devuelta se resuelve con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene el resultado cifrado.

Los algoritmos actualmente compatibles incluyen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'Ed25519'`, `'Ed448'`, `'X25519'` y `'X448'`. |
| v15.9.0 | Se eliminó la exportación JWK `'NODE-DSA'`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `key`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Exporta la clave dada al formato especificado, si es compatible.

Si el [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) no es extraíble, la promesa devuelta se rechazará.

Cuando `format` es `'pkcs8'` o `'spki'` y la exportación es exitosa, la promesa devuelta se resolverá con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene los datos de la clave exportada.

Cuando `format` es `'jwk'` y la exportación es exitosa, la promesa devuelta se resolverá con un objeto JavaScript que cumple con la especificación [JSON Web Key](https://tools.ietf.org/html/rfc7517).

| Tipo de clave | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**Agregado en: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/es/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/es/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/es/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/es/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [Usos de clave](/es/nodejs/api/webcrypto#cryptokeyusages).
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/es/nodejs/api/webcrypto#class-cryptokeypair)

Usando el método y los parámetros proporcionados en `algorithm`, `subtle.generateKey()` intenta generar nuevo material de claves. Dependiendo del método utilizado, el método puede generar un solo [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) o un [\<CryptoKeyPair\>](/es/nodejs/api/webcrypto#class-cryptokeypair).

Los algoritmos de generación de [\<CryptoKeyPair\>](/es/nodejs/api/webcrypto#class-cryptokeypair) (clave pública y privada) admitidos incluyen:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

Los algoritmos de generación de [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) (clave secreta) admitidos incluyen:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'Ed25519'`, `'Ed448'`, `'X25519'` y `'X448'`. |
| v15.9.0 | Se eliminó la importación JWK `'NODE-DSA'`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/es/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/es/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/es/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ver [Usos de la clave](/es/nodejs/api/webcrypto#cryptokeyusages).
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)

El método `subtle.importKey()` intenta interpretar los `keyData` proporcionados como el `format` dado para crear una instancia [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) utilizando los argumentos `algorithm`, `extractable` y `keyUsages` proporcionados. Si la importación es exitosa, la promesa devuelta se resolverá con el [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) creado.

Si se importa una clave `'PBKDF2'`, `extractable` debe ser `false`.

Los algoritmos admitidos actualmente incluyen:

| Tipo de clave | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
|---|---|---|---|---|
| `'AES-CBC'` | | | ✔ | ✔ |
| `'AES-CTR'` | | | ✔ | ✔ |
| `'AES-GCM'` | | | ✔ | ✔ |
| `'AES-KW'` | | | ✔ | ✔ |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |
| `'X25519'` | ✔ | ✔ | ✔ | ✔ |
| `'X448'` | ✔ | ✔ | ✔ | ✔ |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed448'` | ✔ | ✔ | ✔ | ✔ |
| `'HDKF'` | | | | ✔ |
| `'HMAC'` | | | ✔ | ✔ |
| `'PBKDF2'` | | | | ✔ |
| `'RSA-OAEP'` | ✔ | ✔ | ✔ | |
| `'RSA-PSS'` | ✔ | ✔ | ✔ | |
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ | |


### `subtle.sign(algorithm, key, data)` {#subtlesignalgorithm-key-data}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'Ed25519'` y `'Ed448'`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/es/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/es/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/es/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando el método y los parámetros dados por `algorithm` y el material de clave provisto por `key`, `subtle.sign()` intenta generar una firma criptográfica de `data`. Si tiene éxito, la promesa devuelta se resuelve con un [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene la firma generada.

Los algoritmos actualmente admitidos incluyen:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Agregado en: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'raw'`, `'pkcs8'`, `'spki'`, o `'jwk'`.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/es/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/es/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/es/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/es/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/es/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/es/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/es/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Ver [Usos de clave](/es/nodejs/api/webcrypto#cryptokeyusages).
- Devuelve: [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)

En criptografía, "envolver una clave" se refiere a exportar y luego cifrar el material de la clave. El método `subtle.unwrapKey()` intenta descifrar una clave envuelta y crear una instancia de [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey). Es equivalente a llamar primero a `subtle.decrypt()` en los datos de la clave cifrada (usando los argumentos `wrappedKey`, `unwrapAlgo` y `unwrappingKey` como entrada) y luego pasar los resultados al método `subtle.importKey()` usando los argumentos `unwrappedKeyAlgo`, `extractable` y `keyUsages` como entradas. Si tiene éxito, la promesa devuelta se resuelve con un objeto [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey).

Los algoritmos de envoltura actualmente admitidos incluyen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

Los algoritmos de clave desenvuelta admitidos incluyen:

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


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.4.0, v16.17.0 | Se agregaron los algoritmos `'Ed25519'` y `'Ed448'`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/es/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/es/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/es/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Usando el método y los parámetros dados en `algorithm` y el material de claves proporcionado por `key`, `subtle.verify()` intenta verificar que `signature` sea una firma criptográfica válida de `data`. La promesa devuelta se resuelve con `true` o `false`.

Los algoritmos actualmente admitidos incluyen:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Agregado en: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `key`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/es/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/es/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/es/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/es/nodejs/api/webcrypto#class-aesgcmparams)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En criptografía, "envolver una clave" se refiere a exportar y luego cifrar el material de la clave. El método `subtle.wrapKey()` exporta el material de la clave al formato identificado por `format`, luego lo cifra utilizando el método y los parámetros especificados por `wrapAlgo` y el material de la clave proporcionado por `wrappingKey`. Es equivalente a llamar a `subtle.exportKey()` usando `format` y `key` como argumentos, luego pasar el resultado al método `subtle.encrypt()` usando `wrappingKey` y `wrapAlgo` como entradas. Si tiene éxito, la promesa devuelta se resolverá con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene los datos de clave cifrados.

Los algoritmos de envoltura actualmente admitidos incluyen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## Parámetros del algoritmo {#algorithm-parameters}

Los objetos de parámetros del algoritmo definen los métodos y parámetros utilizados por los diversos métodos [\<SubtleCrypto\>](/es/nodejs/api/webcrypto#class-subtlecrypto). Si bien aquí se describen como "clases", son simples objetos de diccionario de JavaScript.

### Clase: `AlgorithmIdentifier` {#class-algorithmidentifier}

**Agregado en: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Agregado en: v18.4.0, v16.17.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Clase: `AesCbcParams` {#class-aescbcparams}

**Agregado en: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Proporciona el vector de inicialización. Debe tener exactamente 16 bytes de longitud y debe ser impredecible y criptográficamente aleatorio.

#### `aesCbcParams.name` {#aescbcparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'AES-CBC'`.

### Clase: `AesCtrParams` {#class-aesctrparams}

**Agregado en: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

El valor inicial del bloque contador. Esto debe tener exactamente 16 bytes de longitud.

El método `AES-CTR` utiliza los `length` bits más a la derecha del bloque como contador y los bits restantes como nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bits en `aesCtrParams.counter` que se utilizarán como contador.


#### `aesCtrParams.name` {#aesctrparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'AES-CTR'`.

### Clase: `AesGcmParams` {#class-aesgcmparams}

**Agregado en: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Con el método AES-GCM, `additionalData` es una entrada extra que no se cifra, pero se incluye en la autenticación de los datos. El uso de `additionalData` es opcional.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

El vector de inicialización debe ser único para cada operación de cifrado que utilice una clave determinada.

Idealmente, este es un valor determinista de 12 bytes que se calcula de tal manera que se garantice que sea único en todas las invocaciones que utilizan la misma clave. Alternativamente, el vector de inicialización puede consistir en al menos 12 bytes criptográficamente aleatorios. Para obtener más información sobre la construcción de vectores de inicialización para AES-GCM, consulte la Sección 8 de [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'AES-GCM'`.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño en bits de la etiqueta de autenticación generada. Estos valores deben ser uno de `32`, `64`, `96`, `104`, `112`, `120`, o `128`. **Predeterminado:** `128`.

### Clase: `AesKeyGenParams` {#class-aeskeygenparams}

**Agregado en: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La longitud de la clave AES que se generará. Debe ser `128`, `192` o `256`.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` o `'AES-KW'`

### Clase: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Agregado en: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'ECDH'`, `'X25519'` o `'X448'`.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Agregado en: v15.0.0**

- Tipo: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)

La derivación de claves ECDH opera tomando como entrada la clave privada de una de las partes y la clave pública de la otra parte, utilizando ambas para generar un secreto compartido común. La propiedad `ecdhKeyDeriveParams.public` se establece en la clave pública de la otra parte.

### Clase: `EcdsaParams` {#class-ecdsaparams}

**Agregado en: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'ECDSA'`.

### Clase: `EcKeyGenParams` {#class-eckeygenparams}

**Agregado en: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'ECDSA'` o `'ECDH'`.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'P-256'`, `'P-384'`, `'P-521'`.

### Clase: `EcKeyImportParams` {#class-eckeyimportparams}

**Agregado en: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'ECDSA'` o `'ECDH'`.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'P-256'`, `'P-384'`, `'P-521'`.

### Clase: `Ed448Params` {#class-ed448params}

**Agregado en: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Agregado en: v18.4.0, v16.17.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'Ed448'`.

#### `ed448Params.context` {#ed448paramscontext}

**Agregado en: v18.4.0, v16.17.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El miembro `context` representa los datos de contexto opcionales que se asociarán con el mensaje. La implementación de la API Web Crypto de Node.js solo admite un contexto de longitud cero, que es equivalente a no proporcionar ningún contexto.


### Clase: `HkdfParams` {#class-hkdfparams}

**Agregado en: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Proporciona una entrada contextual específica de la aplicación al algoritmo HKDF. Esto puede tener longitud cero, pero debe proporcionarse.

#### `hkdfParams.name` {#hkdfparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

El valor de salt mejora significativamente la solidez del algoritmo HKDF. Debe ser aleatorio o pseudoaleatorio y debe tener la misma longitud que la salida de la función de resumen (por ejemplo, si se usa `'SHA-256'` como resumen, el salt debe tener 256 bits de datos aleatorios).


### Clase: `HmacImportParams` {#class-hmacimportparams}

**Agregado en: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de los siguientes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número opcional de bits en la clave HMAC. Esto es opcional y debe omitirse en la mayoría de los casos.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'HMAC'`.

### Clase: `HmacKeyGenParams` {#class-hmackeygenparams}

**Agregado en: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de los siguientes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número de bits para generar para la clave HMAC. Si se omite, la longitud estará determinada por el algoritmo hash utilizado. Esto es opcional y debe omitirse en la mayoría de los casos.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'HMAC'`.

### Clase: `Pbkdf2Params` {#class-pbkdf2params}

**Agregado en: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número de iteraciones que el algoritmo PBKDF2 debe realizar al derivar bits.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'PBKDF2'`.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Debe tener al menos 16 bytes aleatorios o pseudoaleatorios.

### Clase: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Agregado en: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` o `'RSA-OAEP'`.

### Clase: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Agregado en: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si se representa como un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el valor debe ser uno de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si se representa como un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), el objeto debe tener una propiedad `name` cuyo valor sea uno de los valores enumerados anteriormente.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La longitud en bits del módulo RSA. Como mejor práctica, esto debería ser al menos `2048`.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` o `'RSA-OAEP'`.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Agregado en: v15.0.0**

- Tipo: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

El exponente público RSA. Esto debe ser un [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) que contenga un entero sin signo big-endian que debe caber dentro de 32 bits. El [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) puede contener un número arbitrario de bits cero iniciales. El valor debe ser un número primo. A menos que haya una razón para usar un valor diferente, use `new Uint8Array([1, 0, 1])` (65537) como exponente público.


### Clase: `RsaOaepParams` {#class-rsaoaepparams}

**Agregado en: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Agregado en: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Una colección adicional de bytes que no se cifrará, pero se vinculará al texto cifrado generado.

El parámetro `rsaOaepParams.label` es opcional.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) debe ser `'RSA-OAEP'`.

### Clase: `RsaPssParams` {#class-rsapssparams}

**Agregado en: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Agregado en: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Agregado en: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La longitud (en bytes) de la sal aleatoria a utilizar.

## Notas al pie {#footnotes}

