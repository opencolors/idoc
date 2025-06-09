---
title: Node.js Web Crypto API
description: Die Node.js Web Crypto API bietet eine Reihe von kryptographischen Funktionen für sichere Kommunikation und Datenintegrität, einschließlich Schlüsselerzeugung, Verschlüsselung, Entschlüsselung, Signierung und Verifizierung.
head:
  - - meta
    - name: og:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js Web Crypto API bietet eine Reihe von kryptographischen Funktionen für sichere Kommunikation und Datenintegrität, einschließlich Schlüsselerzeugung, Verschlüsselung, Entschlüsselung, Signierung und Verifizierung.
  - - meta
    - name: twitter:title
      content: Node.js Web Crypto API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js Web Crypto API bietet eine Reihe von kryptographischen Funktionen für sichere Kommunikation und Datenintegrität, einschließlich Schlüsselerzeugung, Verschlüsselung, Entschlüsselung, Signierung und Verifizierung.
---


# Web Crypto API {#web-crypto-api}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Die Algorithmen `Ed25519` und `X25519` sind jetzt stabil. |
| v19.0.0 | Mit Ausnahme der Algorithmen `Ed25519`, `Ed448`, `X25519` und `X448` nicht mehr experimentell. |
| v20.0.0, v18.17.0 | Argumente werden jetzt gemäß ihren WebIDL-Definitionen wie in anderen Web Crypto API-Implementierungen erzwungen und validiert. |
| v18.4.0, v16.17.0 | Proprietäres Import-/Exportformat `'node.keyObject'` entfernt. |
| v18.4.0, v16.17.0 | Proprietäre Algorithmen `'NODE-DSA'`, `'NODE-DH'` und `'NODE-SCRYPT'` entfernt. |
| v18.4.0, v16.17.0 | Algorithmen `'Ed25519'`, `'Ed448'`, `'X25519'` und `'X448'` hinzugefügt. |
| v18.4.0, v16.17.0 | Proprietäre Algorithmen `'NODE-ED25519'` und `'NODE-ED448'` entfernt. |
| v18.4.0, v16.17.0 | Proprietäre benannte Kurven `'NODE-X25519'` und `'NODE-X448'` aus dem Algorithmus `'ECDH'` entfernt. |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Node.js bietet eine Implementierung der Standard [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/).

Verwenden Sie `globalThis.crypto` oder `require('node:crypto').webcrypto`, um auf dieses Modul zuzugreifen.

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
## Beispiele {#examples}

### Schlüssel generieren {#generating-keys}

Die Klasse [\<SubtleCrypto\>](/de/nodejs/api/webcrypto#class-subtlecrypto) kann verwendet werden, um symmetrische (geheime) Schlüssel oder asymmetrische Schlüsselpaare (öffentlicher Schlüssel und privater Schlüssel) zu generieren.

#### AES-Schlüssel {#aes-keys}

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

#### ECDSA-Schlüsselpaare {#ecdsa-key-pairs}

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
#### Ed25519/X25519-Schlüsselpaare {#ed25519/x25519-key-pairs}

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
#### HMAC-Schlüssel {#hmac-keys}

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
#### RSA-Schlüsselpaare {#rsa-key-pairs}

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
### Verschlüsselung und Entschlüsselung {#encryption-and-decryption}

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
### Exportieren und Importieren von Schlüsseln {#exporting-and-importing-keys}

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

### Schlüssel einwickeln und auspacken {#wrapping-and-unwrapping-keys}

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
### Signieren und verifizieren {#sign-and-verify}

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
### Ableiten von Bits und Schlüsseln {#deriving-bits-and-keys}

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
## Algorithm Matrix {#algorithm-matrix}

Die Tabelle listet die von der Node.js Web Crypto API-Implementierung unterstützten Algorithmen und die für jeden unterstützten APIs auf:

| Algorithmus | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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
## Klasse: `Crypto` {#class-crypto}

**Hinzugefügt in: v15.0.0**

`globalThis.crypto` ist eine Instanz der Klasse `Crypto`. `Crypto` ist ein Singleton, das Zugriff auf den Rest der Crypto-API bietet.

### `crypto.subtle` {#cryptosubtle}

**Hinzugefügt in: v15.0.0**

- Typ: [\<SubtleCrypto\>](/de/nodejs/api/webcrypto#class-subtlecrypto)

Bietet Zugriff auf die `SubtleCrypto`-API.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Hinzugefügt in: v15.0.0**

- `typedArray` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Generiert kryptografisch starke Zufallswerte. Das gegebene `typedArray` wird mit Zufallswerten gefüllt, und eine Referenz auf `typedArray` wird zurückgegeben.

Das gegebene `typedArray` muss eine Integer-basierte Instanz von [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) sein, d. h. `Float32Array` und `Float64Array` werden nicht akzeptiert.

Ein Fehler wird ausgelöst, wenn das gegebene `typedArray` größer als 65.536 Bytes ist.


### `crypto.randomUUID()` {#cryptorandomuuid}

**Hinzugefügt in: v16.7.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Generiert eine zufällige [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) Version 4 UUID. Die UUID wird mit einem kryptografischen Pseudozufallszahlengenerator erzeugt.

## Klasse: `CryptoKey` {#class-cryptokey}

**Hinzugefügt in: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Hinzugefügt in: v15.0.0**

- Typ: [\<AesKeyGenParams\>](/de/nodejs/api/webcrypto#class-keygenparams) | [\<RsaHashedKeyGenParams\>](/de/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/de/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/de/nodejs/api/webcrypto#class-hmackeygenparams)

Ein Objekt, das den Algorithmus beschreibt, für den der Schlüssel verwendet werden kann, zusammen mit zusätzlichen algorithmusspezifischen Parametern.

Schreibgeschützt.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Hinzugefügt in: v15.0.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `true`, kann der [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) entweder mit `subtleCrypto.exportKey()` oder `subtleCrypto.wrapKey()` extrahiert werden.

Schreibgeschützt.

### `cryptoKey.type` {#cryptokeytype}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Einer von `'secret'`, `'private'` oder `'public'`.

Eine Zeichenkette, die angibt, ob es sich bei dem Schlüssel um einen symmetrischen (`'secret'`) oder asymmetrischen (`'private'` oder `'public'`) Schlüssel handelt.

### `cryptoKey.usages` {#cryptokeyusages}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ein Array von Zeichenketten, die die Operationen identifizieren, für die der Schlüssel verwendet werden darf.

Die möglichen Verwendungen sind:

- `'encrypt'` - Der Schlüssel darf zum Verschlüsseln von Daten verwendet werden.
- `'decrypt'` - Der Schlüssel darf zum Entschlüsseln von Daten verwendet werden.
- `'sign'` - Der Schlüssel darf zum Erzeugen digitaler Signaturen verwendet werden.
- `'verify'` - Der Schlüssel darf zum Verifizieren digitaler Signaturen verwendet werden.
- `'deriveKey'` - Der Schlüssel darf zum Ableiten eines neuen Schlüssels verwendet werden.
- `'deriveBits'` - Der Schlüssel darf zum Ableiten von Bits verwendet werden.
- `'wrapKey'` - Der Schlüssel darf zum Umhüllen eines anderen Schlüssels verwendet werden.
- `'unwrapKey'` - Der Schlüssel darf zum Entpacken eines anderen Schlüssels verwendet werden.

Gültige Schlüsselverwendungen hängen vom Schlüsselalgorithmus ab (identifiziert durch `cryptokey.algorithm.name`).

| Schlüsseltyp | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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


## Klasse: `CryptoKeyPair` {#class-cryptokeypair}

**Hinzugefügt in: v15.0.0**

`CryptoKeyPair` ist ein einfaches Dictionary-Objekt mit den Eigenschaften `publicKey` und `privateKey`, das ein asymmetrisches Schlüsselpaar darstellt.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Hinzugefügt in: v15.0.0**

- Typ: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) Ein [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey), dessen `type` `'private'` ist.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Hinzugefügt in: v15.0.0**

- Typ: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) Ein [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey), dessen `type` `'public'` ist.

## Klasse: `SubtleCrypto` {#class-subtlecrypto}

**Hinzugefügt in: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Hinzugefügt in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/de/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/de/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/de/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/de/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt.

Unter Verwendung der in `algorithm` angegebenen Methode und Parameter sowie des von `key` bereitgestellten Schlüsselmaterials versucht `subtle.decrypt()` die bereitgestellten `data` zu entschlüsseln. Wenn dies erfolgreich ist, wird das zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das das Klartext-Ergebnis enthält.

Die aktuell unterstützten Algorithmen umfassen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.5.0, v20.17.0 | Der Parameter `length` ist jetzt optional für `'ECDH'`, `'X25519'` und `'X448'`. |
| v18.4.0, v16.17.0 | Die Algorithmen `'X25519'` und `'X448'` wurden hinzugefügt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/de/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/de/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/de/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt

Mithilfe der in `algorithm` angegebenen Methode und Parameter sowie des von `baseKey` bereitgestellten Schlüsselmaterials versucht `subtle.deriveBits()` `length` Bits zu generieren.

Wenn `length` nicht angegeben oder `null` ist, wird die maximale Anzahl von Bits für einen bestimmten Algorithmus generiert. Dies ist für die Algorithmen `'ECDH'`, `'X25519'` und `'X448'` zulässig. Für andere Algorithmen muss `length` eine Zahl sein.

Wenn der Vorgang erfolgreich ist, wird die zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das die generierten Daten enthält.

Die aktuell unterstützten Algorithmen umfassen:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.4.0, v16.17.0 | Die Algorithmen `'X25519'` und `'X448'` wurden hinzugefügt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/de/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/de/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/de/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/de/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/de/nodejs/api/webcrypto#class-aeskeygenassistparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Key usages](/de/nodejs/api/webcrypto#cryptokeyusages).
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) erfüllt

Mithilfe der in `algorithm` angegebenen Methode und Parameter sowie des von `baseKey` bereitgestellten Schlüsselmaterials versucht `subtle.deriveKey()` einen neuen [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) basierend auf der Methode und den Parametern in `derivedKeyAlgorithm` zu generieren.

Der Aufruf von `subtle.deriveKey()` entspricht dem Aufruf von `subtle.deriveBits()`, um rohes Schlüsselmaterial zu generieren, und der anschließenden Übergabe des Ergebnisses an die Methode `subtle.importKey()` unter Verwendung der Parameter `deriveKeyAlgorithm`, `extractable` und `keyUsages` als Eingabe.

Die aktuell unterstützten Algorithmen umfassen:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Hinzugefügt in: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt

Mit der durch `algorithm` identifizierten Methode versucht `subtle.digest()` einen Hash von `data` zu generieren. Bei Erfolg wird das zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das den berechneten Hash enthält.

Wenn `algorithm` als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) bereitgestellt wird, muss es eines der Folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn `algorithm` als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) bereitgestellt wird, muss es eine `name`-Eigenschaft haben, deren Wert einer der oben genannten ist.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Hinzugefügt in: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/de/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/de/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/de/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/de/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt

Mit der durch `algorithm` angegebenen Methode und Parametern und dem durch `key` bereitgestellten Schlüsselmaterial versucht `subtle.encrypt()` `data` zu verschlüsseln. Bei Erfolg wird das zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das das verschlüsselte Ergebnis enthält.

Die derzeit unterstützten Algorithmen umfassen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.4.0, v16.17.0 | Algorithmen `'Ed25519'`, `'Ed448'`, `'X25519'` und `'X448'` hinzugefügt. |
| v15.9.0 | `'NODE-DSA'` JWK-Export entfernt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'raw'`, `'pkcs8'`, `'spki'` oder `'jwk'` sein.
- `key`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) erfüllt.

Exportiert den gegebenen Schlüssel in das angegebene Format, falls unterstützt.

Wenn der [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) nicht extrahierbar ist, wird das zurückgegebene Promise abgelehnt.

Wenn `format` entweder `'pkcs8'` oder `'spki'` ist und der Export erfolgreich ist, wird das zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das die exportierten Schlüsseldaten enthält.

Wenn `format` `'jwk'` ist und der Export erfolgreich ist, wird das zurückgegebene Promise mit einem JavaScript-Objekt aufgelöst, das der [JSON Web Key](https://tools.ietf.org/html/rfc7517)-Spezifikation entspricht.

| Schlüsseltyp | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**Hinzugefügt in: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/de/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/de/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/de/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/de/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Key usages](/de/nodejs/api/webcrypto#cryptokeyusages).
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/de/nodejs/api/webcrypto#class-cryptokeypair) erfüllt.

Mit der in `algorithm` bereitgestellten Methode und den Parametern versucht `subtle.generateKey()`, neues Schlüsselmaterial zu generieren. Abhängig von der verwendeten Methode kann die Methode entweder einen einzelnen [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) oder ein [\<CryptoKeyPair\>](/de/nodejs/api/webcrypto#class-cryptokeypair) generieren.

Die unterstützten Algorithmen zur Generierung von [\<CryptoKeyPair\>](/de/nodejs/api/webcrypto#class-cryptokeypair) (öffentlicher und privater Schlüssel) sind:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

Die unterstützten Algorithmen zur Generierung von [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) (geheimer Schlüssel) sind:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.4.0, v16.17.0 | Die Algorithmen `'Ed25519'`, `'Ed448'`, `'X25519'` und `'X448'` wurden hinzugefügt. |
| v15.9.0 | Der JWK-Import von `'NODE-DSA'` wurde entfernt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'raw'`, `'pkcs8'`, `'spki'` oder `'jwk'` sein.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/de/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/de/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/de/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Key usages](/de/nodejs/api/webcrypto#cryptokeyusages).
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) erfüllt.

Die Methode `subtle.importKey()` versucht, die bereitgestellten `keyData` als das gegebene `format` zu interpretieren, um eine [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)-Instanz unter Verwendung der bereitgestellten Argumente `algorithm`, `extractable` und `keyUsages` zu erstellen. Wenn der Import erfolgreich ist, wird die zurückgegebene Promise mit dem erstellten [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) aufgelöst.

Beim Importieren eines `'PBKDF2'`-Schlüssels muss `extractable` `false` sein.

Die derzeit unterstützten Algorithmen umfassen:

| Schlüsseltyp | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.4.0, v16.17.0 | Die Algorithmen `'Ed25519'` und `'Ed448'` wurden hinzugefügt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/de/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/de/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/de/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt, das die generierte Signatur enthält.

Mithilfe der Methode und der Parameter, die von `algorithm` angegeben werden, und des Schlüsselmaterials, das von `key` bereitgestellt wird, versucht `subtle.sign()` eine kryptografische Signatur von `data` zu generieren. Wenn dies erfolgreich ist, wird das zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das die generierte Signatur enthält.

Die derzeit unterstützten Algorithmen umfassen:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Hinzugefügt in: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'raw'`, `'pkcs8'`, `'spki'` oder `'jwk'` sein.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/de/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/de/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/de/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/de/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/de/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/de/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/de/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Key usages](/de/nodejs/api/webcrypto#cryptokeyusages).
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) erfüllt.

In der Kryptografie bezieht sich das "Verpacken eines Schlüssels" auf das Exportieren und anschließende Verschlüsseln des Schlüsselmaterials. Die Methode `subtle.unwrapKey()` versucht, einen verpackten Schlüssel zu entschlüsseln und eine [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)-Instanz zu erstellen. Dies entspricht dem Aufruf von `subtle.decrypt()` zuerst auf den verschlüsselten Schlüsseldaten (unter Verwendung der Argumente `wrappedKey`, `unwrapAlgo` und `unwrappingKey` als Eingabe) und dem anschließenden Übergeben der Ergebnisse an die Methode `subtle.importKey()` unter Verwendung der Argumente `unwrappedKeyAlgo`, `extractable` und `keyUsages` als Eingaben. Wenn dies erfolgreich ist, wird das zurückgegebene Promise mit einem [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)-Objekt aufgelöst.

Die derzeit unterstützten Verpackungsalgorithmen umfassen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

Die unterstützten Algorithmen für entpackte Schlüssel umfassen:

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.4.0, v16.17.0 | `'Ed25519'` und `'Ed448'` Algorithmen hinzugefügt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/de/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/de/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/de/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) erfüllt

Mit der in `algorithm` angegebenen Methode und Parametern sowie dem von `key` bereitgestellten Schlüsselmaterial versucht `subtle.verify()` zu überprüfen, ob `signature` eine gültige kryptografische Signatur von `data` ist. Das zurückgegebene Promise wird entweder mit `true` oder `false` aufgelöst.

Die derzeit unterstützten Algorithmen umfassen:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Hinzugefügt in: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'raw'`, `'pkcs8'`, `'spki'` oder `'jwk'` sein.
- `key`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/de/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/de/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/de/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/de/nodejs/api/webcrypto#class-aesgcmparams)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt

In der Kryptographie bezieht sich "Einhüllen eines Schlüssels" auf das Exportieren und anschließende Verschlüsseln des Schlüsselmaterials. Die Methode `subtle.wrapKey()` exportiert das Schlüsselmaterial in das durch `format` identifizierte Format und verschlüsselt es anschließend mit der durch `wrapAlgo` angegebenen Methode und den Parametern sowie dem von `wrappingKey` bereitgestellten Schlüsselmaterial. Sie entspricht dem Aufruf von `subtle.exportKey()` mit `format` und `key` als Argumente und dem anschließenden Übergeben des Ergebnisses an die Methode `subtle.encrypt()` mit `wrappingKey` und `wrapAlgo` als Eingaben. Wenn erfolgreich, wird das zurückgegebene Promise mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) aufgelöst, das die verschlüsselten Schlüsseldaten enthält.

Die derzeit unterstützten Wrapping-Algorithmen umfassen:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## Algorithmparameter {#algorithm-parameters}

Die Algorithmusparameter-Objekte definieren die Methoden und Parameter, die von den verschiedenen [\<SubtleCrypto\>](/de/nodejs/api/webcrypto#class-subtlecrypto)-Methoden verwendet werden. Obwohl sie hier als "Klassen" beschrieben werden, sind sie einfache JavaScript-Dictionary-Objekte.

### Klasse: `AlgorithmIdentifier` {#class-algorithmidentifier}

**Hinzugefügt in: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Hinzugefügt in: v18.4.0, v16.17.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Klasse: `AesCbcParams` {#class-aescbcparams}

**Hinzugefügt in: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Stellt den Initialisierungsvektor bereit. Er muss genau 16 Byte lang sein und sollte unvorhersehbar und kryptografisch zufällig sein.

#### `aesCbcParams.name` {#aescbcparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'AES-CBC'` sein.

### Klasse: `AesCtrParams` {#class-aesctrparams}

**Hinzugefügt in: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Der Anfangswert des Zählerblocks. Dieser muss genau 16 Byte lang sein.

Die `AES-CTR`-Methode verwendet die rechtesten `length`-Bits des Blocks als Zähler und die verbleibenden Bits als Nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Bits in `aesCtrParams.counter`, die als Zähler verwendet werden sollen.


#### `aesCtrParams.name` {#aesctrparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'AES-CTR'` sein.

### Klasse: `AesGcmParams` {#class-aesgcmparams}

**Hinzugefügt in: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Bei der AES-GCM-Methode sind die `additionalData` zusätzliche Eingaben, die nicht verschlüsselt werden, aber in die Authentifizierung der Daten einbezogen werden. Die Verwendung von `additionalData` ist optional.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Der Initialisierungsvektor muss für jede Verschlüsselungsoperation mit einem bestimmten Schlüssel eindeutig sein.

Idealerweise ist dies ein deterministischer 12-Byte-Wert, der so berechnet wird, dass seine Eindeutigkeit über alle Aufrufe hinweg gewährleistet ist, die denselben Schlüssel verwenden. Alternativ kann der Initialisierungsvektor aus mindestens 12 kryptografisch zufälligen Bytes bestehen. Weitere Informationen zum Erstellen von Initialisierungsvektoren für AES-GCM finden Sie in Abschnitt 8 von [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'AES-GCM'` sein.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Größe des generierten Authentifizierungs-Tags in Bits. Dieser Wert muss einer von `32`, `64`, `96`, `104`, `112`, `120` oder `128` sein. **Standard:** `128`.

### Klasse: `AesKeyGenParams` {#class-aeskeygenparams}

**Hinzugefügt in: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Länge des zu generierenden AES-Schlüssels. Dies muss entweder `128`, `192` oder `256` sein.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` oder `'AES-KW'` sein.

### Klasse: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Hinzugefügt in: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'ECDH'`, `'X25519'` oder `'X448'` sein.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Hinzugefügt in: v15.0.0**

- Typ: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)

Die ECDH-Schlüsselableitung funktioniert, indem der private Schlüssel einer Partei und der öffentliche Schlüssel einer anderen Partei als Eingabe verwendet werden – wobei beide verwendet werden, um ein gemeinsames Shared Secret zu generieren. Die Eigenschaft `ecdhKeyDeriveParams.public` wird auf den öffentlichen Schlüssel der anderen Partei gesetzt.

### Klasse: `EcdsaParams` {#class-ecdsaparams}

**Hinzugefügt in: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'ECDSA'` sein.

### Klasse: `EcKeyGenParams` {#class-eckeygenparams}

**Hinzugefügt in: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss entweder `'ECDSA'` oder `'ECDH'` sein.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss entweder `'P-256'`, `'P-384'` oder `'P-521'` sein.

### Klasse: `EcKeyImportParams` {#class-eckeyimportparams}

**Hinzugefügt in: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss entweder `'ECDSA'` oder `'ECDH'` sein.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss entweder `'P-256'`, `'P-384'` oder `'P-521'` sein.

### Klasse: `Ed448Params` {#class-ed448params}

**Hinzugefügt in: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Hinzugefügt in: v18.4.0, v16.17.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'Ed448'` sein.

#### `ed448Params.context` {#ed448paramscontext}

**Hinzugefügt in: v18.4.0, v16.17.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Das `context`-Element repräsentiert die optionalen Kontextdaten, die der Nachricht zugeordnet werden sollen. Die Node.js Web Crypto API-Implementierung unterstützt nur Kontext mit der Länge Null, was dem Fehlen von Kontext gleichkommt.


### Klasse: `HkdfParams` {#class-hkdfparams}

**Hinzugefügt in: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Bietet anwendungsspezifische kontextbezogene Eingaben für den HKDF-Algorithmus. Dies kann eine Länge von Null haben, muss aber angegeben werden.

#### `hkdfParams.name` {#hkdfparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'HKDF'` sein.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Der Salt-Wert verbessert die Stärke des HKDF-Algorithmus erheblich. Er sollte zufällig oder pseudozufällig sein und die gleiche Länge wie die Ausgabe der Digest-Funktion haben (wenn beispielsweise `'SHA-256'` als Digest verwendet wird, sollte der Salt 256 Bit an Zufallsdaten sein).


### Klasse: `HmacImportParams` {#class-hmacimportparams}

**Hinzugefügt in: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die optionale Anzahl von Bits im HMAC-Schlüssel. Dies ist optional und sollte in den meisten Fällen weggelassen werden.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'HMAC'` sein.

### Klasse: `HmacKeyGenParams` {#class-hmackeygenparams}

**Hinzugefügt in: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der Bits, die für den HMAC-Schlüssel generiert werden sollen. Wenn ausgelassen, wird die Länge durch den verwendeten Hash-Algorithmus bestimmt. Dies ist optional und sollte in den meisten Fällen weggelassen werden.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'HMAC'` sein.

### Klasse: `Pbkdf2Params` {#class-pbkdf2params}

**Hinzugefügt in: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der Iterationen, die der PBKDF2-Algorithmus beim Ableiten von Bits durchführen soll.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'PBKDF2'` sein.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Sollte mindestens 16 zufällige oder pseudozufällige Bytes sein.

### Klasse: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Hinzugefügt in: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Hinzugefügt in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` oder `'RSA-OAEP'` sein.

### Klasse: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Hinzugefügt in: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Hinzugefügt in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn als [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dargestellt, muss der Wert einer der folgenden sein:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Wenn als [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) dargestellt, muss das Objekt eine `name`-Eigenschaft haben, deren Wert einer der oben aufgeführten Werte ist.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Hinzugefügt in: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Länge des RSA-Modulus in Bits. Als Best Practice sollte dies mindestens `2048` sein.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Hinzugefügt in: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss einer von `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` oder `'RSA-OAEP'` sein.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Hinzugefügt in: v15.0.0**

- Type: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Der öffentliche RSA-Exponent. Dies muss ein [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) sein, das eine Big-Endian, vorzeichenlose Ganzzahl enthält, die in 32-Bit passen muss. Das [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) kann eine beliebige Anzahl von führenden Null-Bits enthalten. Der Wert muss eine Primzahl sein. Sofern kein Grund besteht, einen anderen Wert zu verwenden, verwenden Sie `new Uint8Array([1, 0, 1])` (65537) als öffentlichen Exponenten.


### Klasse: `RsaOaepParams` {#class-rsaoaepparams}

**Hinzugefügt in: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Hinzugefügt in: v15.0.0**

- Typ: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Eine zusätzliche Sammlung von Bytes, die nicht verschlüsselt werden, aber an den generierten Chiffretext gebunden werden.

Der Parameter `rsaOaepParams.label` ist optional.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) muss `'RSA-OAEP'` sein.

### Klasse: `RsaPssParams` {#class-rsapssparams}

**Hinzugefügt in: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Hinzugefügt in: v15.0.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'RSA-PSS'` sein.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Hinzugefügt in: v15.0.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Länge (in Bytes) des zu verwendenden zufälligen Salzes.

## Fußnoten {#footnotes}

