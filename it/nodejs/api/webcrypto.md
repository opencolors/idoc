---
title: API Web Crypto di Node.js
description: L'API Web Crypto di Node.js fornisce un insieme di funzioni crittografiche per la comunicazione sicura e l'integrità dei dati, inclusa la generazione di chiavi, cifratura, decifratura, firma e verifica.
head:
  - - meta
    - name: og:title
      content: API Web Crypto di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: L'API Web Crypto di Node.js fornisce un insieme di funzioni crittografiche per la comunicazione sicura e l'integrità dei dati, inclusa la generazione di chiavi, cifratura, decifratura, firma e verifica.
  - - meta
    - name: twitter:title
      content: API Web Crypto di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: L'API Web Crypto di Node.js fornisce un insieme di funzioni crittografiche per la comunicazione sicura e l'integrità dei dati, inclusa la generazione di chiavi, cifratura, decifratura, firma e verifica.
---


# API Web Crypto {#web-crypto-api}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Gli algoritmi `Ed25519` e `X25519` sono ora stabili. |
| v19.0.0 | Non è più sperimentale, ad eccezione degli algoritmi `Ed25519`, `Ed448`, `X25519` e `X448`. |
| v20.0.0, v18.17.0 | Gli argomenti sono ora forzati e convalidati secondo le loro definizioni WebIDL come in altre implementazioni Web Crypto API. |
| v18.4.0, v16.17.0 | Rimosso il formato proprietario di importazione/esportazione `'node.keyObject'`. |
| v18.4.0, v16.17.0 | Rimossi gli algoritmi proprietari `'NODE-DSA'`, `'NODE-DH'` e `'NODE-SCRYPT'`. |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'Ed25519'`, `'Ed448'`, `'X25519'` e `'X448'`. |
| v18.4.0, v16.17.0 | Rimossi gli algoritmi proprietari `'NODE-ED25519'` e `'NODE-ED448'`. |
| v18.4.0, v16.17.0 | Rimossi le curve denominate proprietarie `'NODE-X25519'` e `'NODE-X448'` dall'algoritmo `'ECDH'`. |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Node.js fornisce un'implementazione dello standard [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/).

Usa `globalThis.crypto` o `require('node:crypto').webcrypto` per accedere a questo modulo.

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
## Esempi {#examples}

### Generazione di chiavi {#generating-keys}

La classe [\<SubtleCrypto\>](/it/nodejs/api/webcrypto#class-subtlecrypto) può essere utilizzata per generare chiavi simmetriche (segrete) o coppie di chiavi asimmetriche (chiave pubblica e chiave privata).

#### Chiavi AES {#aes-keys}

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

#### Coppie di chiavi ECDSA {#ecdsa-key-pairs}

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
#### Coppie di chiavi Ed25519/X25519 {#ed25519/x25519-key-pairs}

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
#### Chiavi HMAC {#hmac-keys}

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
#### Coppie di chiavi RSA {#rsa-key-pairs}

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
### Crittografia e decrittografia {#encryption-and-decryption}

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
### Esportazione e importazione di chiavi {#exporting-and-importing-keys}

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

### Wrapping e unwrapping delle chiavi {#wrapping-and-unwrapping-keys}

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
### Firma e verifica {#sign-and-verify}

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
### Derivazione di bit e chiavi {#deriving-bits-and-keys}

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
## Matrice degli algoritmi {#algorithm-matrix}

La tabella descrive in dettaglio gli algoritmi supportati dall'implementazione dell'API Web Crypto di Node.js e le API supportate per ciascuno:

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
## Classe: `Crypto` {#class-crypto}

**Aggiunto in: v15.0.0**

`globalThis.crypto` è un'istanza della classe `Crypto`. `Crypto` è un singleton che fornisce l'accesso al resto dell'API crypto.

### `crypto.subtle` {#cryptosubtle}

**Aggiunto in: v15.0.0**

- Tipo: [\<SubtleCrypto\>](/it/nodejs/api/webcrypto#class-subtlecrypto)

Fornisce l'accesso all'API `SubtleCrypto`.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Aggiunto in: v15.0.0**

- `typedArray` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Genera valori casuali crittograficamente sicuri. Il `typedArray` fornito viene riempito con valori casuali e viene restituito un riferimento a `typedArray`.

Il `typedArray` fornito deve essere un'istanza basata su interi di [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), ad es. `Float32Array` e `Float64Array` non sono accettati.

Verrà generato un errore se il `typedArray` fornito è più grande di 65.536 byte.


### `crypto.randomUUID()` {#cryptorandomuuid}

**Aggiunto in: v16.7.0**

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera un UUID casuale versione 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt). L'UUID viene generato utilizzando un generatore di numeri pseudocasuali crittografici.

## Classe: `CryptoKey` {#class-cryptokey}

**Aggiunto in: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Aggiunto in: v15.0.0**

- Tipo: [\<AesKeyGenParams\>](/it/nodejs/api/webcrypto#class-sendPluginResultparams) | [\<RsaHashedKeyGenParams\>](/it/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/it/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/it/nodejs/api/webcrypto#class-hmackeygenparams)

Un oggetto che descrive in dettaglio l'algoritmo per il quale la chiave può essere utilizzata insieme a parametri aggiuntivi specifici dell'algoritmo.

Sola lettura.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Aggiunto in: v15.0.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando `true`, la [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) può essere estratta utilizzando `subtleCrypto.exportKey()` o `subtleCrypto.wrapKey()`.

Sola lettura.

### `cryptoKey.type` {#cryptokeytype}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra `'secret'`, `'private'` o `'public'`.

Una stringa che identifica se la chiave è una chiave simmetrica (`'secret'`) o asimmetrica (`'private'` o `'public'`).

### `cryptoKey.usages` {#cryptokeyusages}

**Aggiunto in: v15.0.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un array di stringhe che identifica le operazioni per le quali la chiave può essere utilizzata.

Gli usi possibili sono:

- `'encrypt'` - La chiave può essere utilizzata per crittografare i dati.
- `'decrypt'` - La chiave può essere utilizzata per decrittografare i dati.
- `'sign'` - La chiave può essere utilizzata per generare firme digitali.
- `'verify'` - La chiave può essere utilizzata per verificare le firme digitali.
- `'deriveKey'` - La chiave può essere utilizzata per derivare una nuova chiave.
- `'deriveBits'` - La chiave può essere utilizzata per derivare bit.
- `'wrapKey'` - La chiave può essere utilizzata per avvolgere un'altra chiave.
- `'unwrapKey'` - La chiave può essere utilizzata per svolgere un'altra chiave.

Gli usi validi della chiave dipendono dall'algoritmo della chiave (identificato da `cryptokey.algorithm.name`).

| Tipo di chiave | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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

## Classe: `CryptoKeyPair` {#class-cryptokeypair}

**Aggiunta in: v15.0.0**

`CryptoKeyPair` è un semplice oggetto dizionario con le proprietà `publicKey` e `privateKey`, che rappresentano una coppia di chiavi asimmetriche.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Aggiunta in: v15.0.0**

- Tipo: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) Un [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) il cui `type` sarà `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Aggiunta in: v15.0.0**

- Tipo: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) Un [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) il cui `type` sarà `'public'`.

## Classe: `SubtleCrypto` {#class-subtlecrypto}

**Aggiunta in: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Aggiunta in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/it/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/it/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/it/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/it/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Utilizzando il metodo e i parametri specificati in `algorithm` e il materiale di chiavi fornito da `key`, `subtle.decrypt()` tenta di decifrare i `data` forniti. In caso di successo, la promise restituita verrà risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente il risultato in testo chiaro.

Gli algoritmi attualmente supportati includono:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.5.0, v20.17.0 | Il parametro length è ora opzionale per `'ECDH'`, `'X25519'` e `'X448'`. |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'X25519'` e `'X448'`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/it/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/it/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/it/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando il metodo e i parametri specificati in `algorithm` e il materiale di chiave fornito da `baseKey`, `subtle.deriveBits()` tenta di generare `length` bit.

Quando `length` non viene fornito o è `null` viene generato il numero massimo di bit per un dato algoritmo. Questo è consentito per gli algoritmi `'ECDH'`, `'X25519'` e `'X448'`, per gli altri algoritmi è necessario che `length` sia un numero.

Se ha esito positivo, la promise restituita verrà risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente i dati generati.

Gli algoritmi attualmente supportati includono:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'X25519'` e `'X448'`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/it/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/it/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/it/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/it/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/it/nodejs/api/webcrypto#class-keygenparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [Usi delle chiavi](/it/nodejs/api/webcrypto#cryptokeyusages).
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza con una [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)

Usando il metodo e i parametri specificati in `algorithm` e il materiale di chiave fornito da `baseKey`, `subtle.deriveKey()` tenta di generare una nuova [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) basata sul metodo e sui parametri in `derivedKeyAlgorithm`.

Chiamare `subtle.deriveKey()` equivale a chiamare `subtle.deriveBits()` per generare materiale di chiave grezzo, quindi passare il risultato nel metodo `subtle.importKey()` usando i parametri `deriveKeyAlgorithm`, `extractable` e `keyUsages` come input.

Gli algoritmi attualmente supportati includono:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Aggiunto in: v15.0.0**

- `algorithm`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Utilizzando il metodo identificato da `algorithm`, `subtle.digest()` tenta di generare un digest di `data`. Se ha successo, la promise restituita viene risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente il digest calcolato.

Se `algorithm` è fornito come una [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), deve essere uno tra:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se `algorithm` è fornito come un [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), deve avere una proprietà `name` il cui valore sia uno dei precedenti.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Aggiunto in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/it/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/it/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/it/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/it/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Utilizzando il metodo e i parametri specificati da `algorithm` e il materiale di chiavi fornito da `key`, `subtle.encrypt()` tenta di cifrare `data`. Se ha successo, la promise restituita viene risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente il risultato crittografato.

Gli algoritmi attualmente supportati includono:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'Ed25519'`, `'Ed448'`, `'X25519'` e `'X448'`. |
| v15.9.0 | Rimossa l'esportazione JWK `'NODE-DSA'`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `format`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `key`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Soddisfa con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Esporta la chiave fornita nel formato specificato, se supportato.

Se la [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) non è estraibile, la promise restituita verrà rifiutata.

Quando `format` è `'pkcs8'` o `'spki'` e l'esportazione ha successo, la promise restituita verrà risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente i dati della chiave esportata.

Quando `format` è `'jwk'` e l'esportazione ha successo, la promise restituita verrà risolta con un oggetto JavaScript conforme alla specifica [JSON Web Key](https://tools.ietf.org/html/rfc7517).

| Tipo di chiave | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**Aggiunto in: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/it/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/it/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/it/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/it/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [Utilizzi della chiave](/it/nodejs/api/webcrypto#cryptokeyusages).
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Soddisfa con una [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/it/nodejs/api/webcrypto#class-cryptokeypair)

Utilizzando il metodo e i parametri forniti in `algorithm`, `subtle.generateKey()` tenta di generare nuovo materiale di chiave. A seconda del metodo utilizzato, il metodo può generare una singola [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) o una [\<CryptoKeyPair\>](/it/nodejs/api/webcrypto#class-cryptokeypair).

Gli algoritmi di generazione [\<CryptoKeyPair\>](/it/nodejs/api/webcrypto#class-cryptokeypair) (chiave pubblica e privata) supportati includono:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

Gli algoritmi di generazione [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) (chiave segreta) supportati includono:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'Ed25519'`, `'Ed448'`, `'X25519'` e `'X448'`. |
| v15.9.0 | Rimosso l'importazione JWK `'NODE-DSA'`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `format`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/it/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/it/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/it/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedere [Utilizzi della chiave](/it/nodejs/api/webcrypto#cryptokeyusages).
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)

Il metodo `subtle.importKey()` tenta di interpretare i `keyData` forniti come il `format` dato per creare un'istanza [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) utilizzando gli argomenti `algorithm`, `extractable` e `keyUsages` forniti. Se l'importazione ha successo, la promise restituita verrà risolta con il [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) creato.

Se si importa una chiave `'PBKDF2'`, `extractable` deve essere `false`.

Gli algoritmi attualmente supportati includono:

| Tipo di chiave | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'Ed25519'` e `'Ed448'`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/it/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/it/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/it/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Utilizzando il metodo e i parametri forniti da `algorithm` e il materiale di codifica fornito da `key`, `subtle.sign()` tenta di generare una firma crittografica di `data`. In caso di successo, la promise restituita viene risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente la firma generata.

Gli algoritmi attualmente supportati includono:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Aggiunto in: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/it/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/it/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/it/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/it/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/it/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/it/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/it/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedere [Utilizzi della chiave](/it/nodejs/api/webcrypto#cryptokeyusages).
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza con un [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)

In crittografia, "wrapping di una chiave" si riferisce all'esportazione e quindi alla crittografia del materiale della chiave. Il metodo `subtle.unwrapKey()` tenta di decrittografare una chiave wrapped e creare un'istanza di [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey). È equivalente a chiamare prima `subtle.decrypt()` sui dati della chiave crittografata (utilizzando gli argomenti `wrappedKey`, `unwrapAlgo` e `unwrappingKey` come input), quindi passare i risultati al metodo `subtle.importKey()` utilizzando gli argomenti `unwrappedKeyAlgo`, `extractable` e `keyUsages` come input. In caso di successo, la promise restituita viene risolta con un oggetto [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey).

Gli algoritmi di wrapping attualmente supportati includono:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

Gli algoritmi chiave unwrapped supportati includono:

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0, v16.17.0 | Aggiunti gli algoritmi `'Ed25519'` e `'Ed448'`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/it/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/it/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/it/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Utilizzando il metodo e i parametri forniti in `algorithm` e il materiale chiave fornito da `key`, `subtle.verify()` tenta di verificare che `signature` sia una firma crittografica valida di `data`. La promessa restituita viene risolta con `true` o `false`.

Gli algoritmi attualmente supportati includono:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Aggiunto in: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'raw'`, `'pkcs8'`, `'spki'` o `'jwk'`.
- `key`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/it/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/it/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/it/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/it/nodejs/api/webcrypto#class-aesgcmparams)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

In crittografia, "wrapping una chiave" si riferisce all'esportazione e alla successiva crittografia del materiale chiave. Il metodo `subtle.wrapKey()` esporta il materiale chiave nel formato identificato da `format`, quindi lo crittografa utilizzando il metodo e i parametri specificati da `wrapAlgo` e il materiale chiave fornito da `wrappingKey`. È l'equivalente di chiamare `subtle.exportKey()` utilizzando `format` e `key` come argomenti, quindi passare il risultato al metodo `subtle.encrypt()` utilizzando `wrappingKey` e `wrapAlgo` come input. Se ha successo, la promessa restituita verrà risolta con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente i dati della chiave crittografata.

Gli algoritmi di wrapping attualmente supportati includono:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## Parametri dell'algoritmo {#algorithm-parameters}

Gli oggetti parametro dell'algoritmo definiscono i metodi e i parametri utilizzati dai vari metodi [\<SubtleCrypto\>](/it/nodejs/api/webcrypto#class-subtlecrypto). Sebbene qui descritti come "classi", sono semplici oggetti dizionario JavaScript.

### Classe: `AlgorithmIdentifier` {#class-algorithmidentifier}

**Aggiunto in: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Aggiunto in: v18.4.0, v16.17.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Classe: `AesCbcParams` {#class-aescbcparams}

**Aggiunto in: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Fornisce il vettore di inizializzazione. Deve avere una lunghezza esatta di 16 byte e deve essere imprevedibile e crittograficamente casuale.

#### `aesCbcParams.name` {#aescbcparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'AES-CBC'`.

### Classe: `AesCtrParams` {#class-aesctrparams}

**Aggiunto in: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Il valore iniziale del blocco contatore. Questo deve essere esattamente lungo 16 byte.

Il metodo `AES-CTR` utilizza i bit più a destra di `length` del blocco come contatore e i bit rimanenti come nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Aggiunto in: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di bit in `aesCtrParams.counter` che devono essere utilizzati come contatore.


#### `aesCtrParams.name` {#aesctrparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'AES-CTR'`.

### Classe: `AesGcmParams` {#class-aesgcmparams}

**Aggiunto in: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Con il metodo AES-GCM, `additionalData` sono input extra che non vengono crittografati ma sono inclusi nell'autenticazione dei dati. L'uso di `additionalData` è facoltativo.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Il vettore di inizializzazione deve essere univoco per ogni operazione di crittografia che utilizza una determinata chiave.

Idealmente, questo è un valore deterministico di 12 byte che viene calcolato in modo tale da garantire che sia univoco in tutte le invocazioni che utilizzano la stessa chiave. In alternativa, il vettore di inizializzazione può essere costituito da almeno 12 byte crittograficamente casuali. Per ulteriori informazioni sulla costruzione di vettori di inizializzazione per AES-GCM, fare riferimento alla Sezione 8 di [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'AES-GCM'`.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Aggiunto in: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione in bit del tag di autenticazione generato. Questo valore deve essere uno tra `32`, `64`, `96`, `104`, `112`, `120` o `128`. **Predefinito:** `128`.

### Classe: `AesKeyGenParams` {#class-aeskeygenparams}

**Aggiunto in: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Aggiunto in: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La lunghezza della chiave AES da generare. Deve essere `128`, `192` o `256`.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` o `'AES-KW'`

### Classe: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Aggiunto in: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'ECDH'`, `'X25519'` o `'X448'`.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Aggiunto in: v15.0.0**

- Tipo: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)

La derivazione della chiave ECDH opera prendendo come input la chiave privata di una parte e la chiave pubblica di un'altra parte, utilizzandole entrambe per generare un segreto condiviso comune. La proprietà `ecdhKeyDeriveParams.public` è impostata sulla chiave pubblica dell'altra parte.

### Classe: `EcdsaParams` {#class-ecdsaparams}

**Aggiunto in: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno tra:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore è uno dei valori sopra elencati.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'ECDSA'`.

### Classe: `EcKeyGenParams` {#class-eckeygenparams}

**Aggiunto in: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'ECDSA'` o `'ECDH'`.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'P-256'`, `'P-384'`, `'P-521'`.

### Classe: `EcKeyImportParams` {#class-eckeyimportparams}

**Aggiunto in: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'ECDSA'` o `'ECDH'`.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'P-256'`, `'P-384'`, `'P-521'`.

### Classe: `Ed448Params` {#class-ed448params}

**Aggiunto in: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Aggiunto in: v18.4.0, v16.17.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'Ed448'`.

#### `ed448Params.context` {#ed448paramscontext}

**Aggiunto in: v18.4.0, v16.17.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Il membro `context` rappresenta i dati di contesto opzionali da associare al messaggio. L'implementazione dell'API Web Crypto di Node.js supporta solo un contesto di lunghezza zero, il che equivale a non fornire affatto il contesto.


### Classe: `HkdfParams` {#class-hkdfparams}

**Aggiunto in: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno tra:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore sia uno dei valori sopra elencati.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Fornisce input contestuale specifico dell'applicazione all'algoritmo HKDF. Può essere di lunghezza zero ma deve essere fornito.

#### `hkdfParams.name` {#hkdfparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Il valore salt migliora significativamente la forza dell'algoritmo HKDF. Dovrebbe essere casuale o pseudocasuale e dovrebbe avere la stessa lunghezza dell'output della funzione di digest (ad esempio, se si utilizza `'SHA-256'` come digest, il salt dovrebbe essere 256 bit di dati casuali).


### Classe: `HmacImportParams` {#class-hmacimportparams}

**Aggiunto in: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come una [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno tra:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come un [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore è uno dei valori elencati sopra.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Aggiunto in: v15.0.0**

- Tipo: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero opzionale di bit nella chiave HMAC. Questo è opzionale e dovrebbe essere omesso nella maggior parte dei casi.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'HMAC'`.

### Classe: `HmacKeyGenParams` {#class-hmackeygenparams}

**Aggiunto in: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come una [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno tra:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come un [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore è uno dei valori elencati sopra.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Aggiunto in: v15.0.0**

- Tipo: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di bit da generare per la chiave HMAC. Se omesso, la lunghezza sarà determinata dall'algoritmo hash utilizzato. Questo è opzionale e dovrebbe essere omesso nella maggior parte dei casi.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'HMAC'`.

### Classe: `Pbkdf2Params` {#class-pbkdf2params}

**Aggiunto in: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno dei seguenti:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore è uno dei valori sopra elencati.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Aggiunto in: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di iterazioni che l'algoritmo PBKDF2 deve effettuare durante la derivazione dei bit.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'PBKDF2'`.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Dovrebbe essere composto da almeno 16 byte casuali o pseudocasuali.

### Classe: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Aggiunto in: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno dei seguenti:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore è uno dei valori sopra elencati.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, o `'RSA-OAEP'`.

### Classe: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Aggiunto in: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se rappresentato come [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il valore deve essere uno tra:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se rappresentato come [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'oggetto deve avere una proprietà `name` il cui valore è uno dei valori elencati sopra.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Aggiunto in: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La lunghezza in bit del modulo RSA. Come buona pratica, questo dovrebbe essere almeno `2048`.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, o `'RSA-OAEP'`.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Aggiunto in: v15.0.0**

- Tipo: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

L'esponente pubblico RSA. Questo deve essere un [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) contenente un intero senza segno big-endian che deve rientrare in 32 bit. Il [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) può contenere un numero arbitrario di bit zero iniziali. Il valore deve essere un numero primo. A meno che non ci sia motivo di usare un valore diverso, usa `new Uint8Array([1, 0, 1])` (65537) come esponente pubblico.


### Classe: `RsaOaepParams` {#class-rsaoaepparams}

**Aggiunto in: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Aggiunto in: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Una raccolta aggiuntiva di byte che non verrà crittografata, ma sarà vincolata al testo cifrato generato.

Il parametro `rsaOaepParams.label` è opzionale.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) deve essere `'RSA-OAEP'`.

### Classe: `RsaPssParams` {#class-rsapssparams}

**Aggiunto in: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Aggiunto in: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Aggiunto in: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La lunghezza (in byte) del salt casuale da utilizzare.

## Note a piè di pagina {#footnotes}

