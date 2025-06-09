---
title: API Web Crypto de Node.js
description: L'API Web Crypto de Node.js fournit un ensemble de fonctions cryptographiques pour la communication sécurisée et l'intégrité des données, incluant la génération de clés, le chiffrement, le déchiffrement, la signature et la vérification.
head:
  - - meta
    - name: og:title
      content: API Web Crypto de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: L'API Web Crypto de Node.js fournit un ensemble de fonctions cryptographiques pour la communication sécurisée et l'intégrité des données, incluant la génération de clés, le chiffrement, le déchiffrement, la signature et la vérification.
  - - meta
    - name: twitter:title
      content: API Web Crypto de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: L'API Web Crypto de Node.js fournit un ensemble de fonctions cryptographiques pour la communication sécurisée et l'intégrité des données, incluant la génération de clés, le chiffrement, le déchiffrement, la signature et la vérification.
---


# API Web Crypto {#web-crypto-api}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.5.0 | Les algorithmes `Ed25519` et `X25519` sont maintenant stables. |
| v19.0.0 | N'est plus expérimental, sauf pour les algorithmes `Ed25519`, `Ed448`, `X25519` et `X448`. |
| v20.0.0, v18.17.0 | Les arguments sont désormais forcés et validés conformément à leurs définitions WebIDL comme dans les autres implémentations de l'API Web Crypto. |
| v18.4.0, v16.17.0 | Suppression du format d'import/export propriétaire `'node.keyObject'`. |
| v18.4.0, v16.17.0 | Suppression des algorithmes propriétaires `'NODE-DSA'`, `'NODE-DH'` et `'NODE-SCRYPT'`. |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'Ed25519'`, `'Ed448'`, `'X25519'` et `'X448'`. |
| v18.4.0, v16.17.0 | Suppression des algorithmes propriétaires `'NODE-ED25519'` et `'NODE-ED448'`. |
| v18.4.0, v16.17.0 | Suppression des courbes nommées propriétaires `'NODE-X25519'` et `'NODE-X448'` de l'algorithme `'ECDH'`. |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Node.js fournit une implémentation de l'API standard [Web Crypto](https://www.w3.org/TR/WebCryptoAPI/).

Utilisez `globalThis.crypto` ou `require('node:crypto').webcrypto` pour accéder à ce module.

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
## Exemples {#examples}

### Génération de clés {#generating-keys}

La classe [\<SubtleCrypto\>](/fr/nodejs/api/webcrypto#class-subtlecrypto) peut être utilisée pour générer des clés symétriques (secrètes) ou des paires de clés asymétriques (clé publique et clé privée).

#### Clés AES {#aes-keys}

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

#### Paires de clés ECDSA {#ecdsa-key-pairs}

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
#### Paires de clés Ed25519/X25519 {#ed25519/x25519-key-pairs}

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
#### Clés HMAC {#hmac-keys}

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
#### Paires de clés RSA {#rsa-key-pairs}

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
### Chiffrement et déchiffrement {#encryption-and-decryption}

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
### Exportation et importation de clés {#exporting-and-importing-keys}

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

### Encapsulation et désencapsulation de clés {#wrapping-and-unwrapping-keys}

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
### Signature et vérification {#sign-and-verify}

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
### Dérivation de bits et de clés {#deriving-bits-and-keys}

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
## Matrice des algorithmes {#algorithm-matrix}

Le tableau détaille les algorithmes pris en charge par l'implémentation de l'API Web Crypto de Node.js et les API prises en charge pour chacun :

| Algorithme | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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
## Classe : `Crypto` {#class-crypto}

**Ajouté dans : v15.0.0**

`globalThis.crypto` est une instance de la classe `Crypto`. `Crypto` est un singleton qui fournit un accès au reste de l’API crypto.

### `crypto.subtle` {#cryptosubtle}

**Ajouté dans : v15.0.0**

- Type : [\<SubtleCrypto\>](/fr/nodejs/api/webcrypto#class-subtlecrypto)

Fournit un accès à l’API `SubtleCrypto`.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Ajouté dans : v15.0.0**

- `typedArray` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Génère des valeurs aléatoires cryptographiquement fortes. Le `typedArray` donné est rempli de valeurs aléatoires, et une référence à `typedArray` est retournée.

Le `typedArray` donné doit être une instance basée sur des entiers de [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), c’est-à-dire que `Float32Array` et `Float64Array` ne sont pas acceptés.

Une erreur sera levée si le `typedArray` donné est supérieur à 65 536 octets.


### `crypto.randomUUID()` {#cryptorandomuuid}

**Ajouté dans : v16.7.0**

- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Génère un UUID aléatoire [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4. L’UUID est généré à l’aide d’un générateur de nombres pseudo-aléatoires cryptographiques.

## Class : `CryptoKey` {#class-cryptokey}

**Ajouté dans : v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Ajouté dans : v15.0.0**

- Type : [\<AesKeyGenParams\>](/fr/nodejs/api/webcrypto#class-aeskeygenassistparams) | [\<RsaHashedKeyGenParams\>](/fr/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/fr/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/fr/nodejs/api/webcrypto#class-hmackeygenparams)

Un objet détaillant l’algorithme pour lequel la clé peut être utilisée ainsi que des paramètres supplémentaires spécifiques à l’algorithme.

Lecture seule.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Ajouté dans : v15.0.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Lorsque `true`, la [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) peut être extraite à l’aide de `subtleCrypto.exportKey()` ou de `subtleCrypto.wrapKey()`.

Lecture seule.

### `cryptoKey.type` {#cryptokeytype}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un parmi `'secret'`, `'private'` ou `'public'`.

Une chaîne identifiant si la clé est une clé symétrique (`'secret'`) ou asymétrique (`'private'` ou `'public'`).

### `cryptoKey.usages` {#cryptokeyusages}

**Ajouté dans : v15.0.0**

- Type : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un tableau de chaînes identifiant les opérations pour lesquelles la clé peut être utilisée.

Les utilisations possibles sont :

- `'encrypt'` - La clé peut être utilisée pour chiffrer des données.
- `'decrypt'` - La clé peut être utilisée pour déchiffrer des données.
- `'sign'` - La clé peut être utilisée pour générer des signatures numériques.
- `'verify'` - La clé peut être utilisée pour vérifier les signatures numériques.
- `'deriveKey'` - La clé peut être utilisée pour dériver une nouvelle clé.
- `'deriveBits'` - La clé peut être utilisée pour dériver des bits.
- `'wrapKey'` - La clé peut être utilisée pour encapsuler une autre clé.
- `'unwrapKey'` - La clé peut être utilisée pour désencapsuler une autre clé.

Les utilisations valides de la clé dépendent de l’algorithme de clé (identifié par `cryptokey.algorithm.name`).

| Type de clé | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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

**Ajouté dans : v15.0.0**

`CryptoKeyPair` est un simple objet de dictionnaire avec des propriétés `publicKey` et `privateKey`, représentant une paire de clés asymétriques.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Ajouté dans : v15.0.0**

- Type : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) Un [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) dont le `type` sera `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Ajouté dans : v15.0.0**

- Type : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) Un [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) dont le `type` sera `'public'`.

## Class: `SubtleCrypto` {#class-subtlecrypto}

**Ajouté dans : v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Ajouté dans : v15.0.0**

- `algorithm` : [\<RsaOaepParams\>](/fr/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/fr/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/fr/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/fr/nodejs/api/webcrypto#class-aesgcmparams)
- `key` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `data` : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Satisfait avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En utilisant la méthode et les paramètres spécifiés dans `algorithm` et le matériel de clé fourni par `key`, `subtle.decrypt()` tente de déchiffrer les `data` fournis. Si elle réussit, la promesse retournée sera résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant le résultat en texte clair.

Les algorithmes actuellement pris en charge incluent :

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.5.0, v20.17.0 | Le paramètre length est désormais optionnel pour `'ECDH'`, `'X25519'` et `'X448'`. |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'X25519'` et `'X448'`. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/fr/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/fr/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/fr/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résout avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En utilisant la méthode et les paramètres spécifiés dans `algorithm` et le matériel de clé fourni par `baseKey`, `subtle.deriveBits()` tente de générer `length` bits.

Lorsque `length` n'est pas fourni ou est `null`, le nombre maximal de bits pour un algorithme donné est généré. Ceci est autorisé pour les algorithmes `'ECDH'`, `'X25519'` et `'X448'`, pour les autres algorithmes, `length` doit être un nombre.

En cas de succès, la promesse renvoyée sera résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant les données générées.

Les algorithmes actuellement pris en charge sont les suivants :

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'X25519'` et `'X448'`. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/fr/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/fr/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/fr/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/fr/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/fr/nodejs/api/webcrypto#class-aeskeygenassistparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [Utilisations de clés](/fr/nodejs/api/webcrypto#cryptokeyusages).
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résout avec une [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)

En utilisant la méthode et les paramètres spécifiés dans `algorithm`, et le matériel de clé fourni par `baseKey`, `subtle.deriveKey()` tente de générer une nouvelle [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) basée sur la méthode et les paramètres dans `derivedKeyAlgorithm`.

Appeler `subtle.deriveKey()` équivaut à appeler `subtle.deriveBits()` pour générer du matériel de clé brut, puis à passer le résultat dans la méthode `subtle.importKey()` en utilisant les paramètres `deriveKeyAlgorithm`, `extractable` et `keyUsages` comme entrée.

Les algorithmes actuellement pris en charge sont les suivants :

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Ajouté dans : v15.0.0**

- `algorithm` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data` : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En utilisant la méthode identifiée par `algorithm`, `subtle.digest()` tente de générer un condensé de `data`. Si elle réussit, la promesse renvoyée est résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant le condensé calculé.

Si `algorithm` est fourni en tant que [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il doit s'agir de l'un des éléments suivants :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si `algorithm` est fourni en tant que [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), il doit avoir une propriété `name` dont la valeur est l'une de celles ci-dessus.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Ajouté dans : v15.0.0**

- `algorithm` : [\<RsaOaepParams\>](/fr/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/fr/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/fr/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/fr/nodejs/api/webcrypto#class-aesgcmparams)
- `key` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `data` : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En utilisant la méthode et les paramètres spécifiés par `algorithm` et le matériel de clé fourni par `key`, `subtle.encrypt()` tente de chiffrer `data`. Si elle réussit, la promesse renvoyée est résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant le résultat chiffré.

Les algorithmes actuellement pris en charge incluent :

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'Ed25519'`, `'Ed448'`, `'X25519'` et `'X448'`. |
| v15.9.0 | Suppression de l'exportation JWK `'NODE-DSA'`. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l'un des suivants : `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `key`: [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Exporte la clé donnée dans le format spécifié, si pris en charge.

Si la [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) n'est pas extractible, la promesse renvoyée sera rejetée.

Lorsque `format` est soit `'pkcs8'` soit `'spki'` et que l'exportation réussit, la promesse renvoyée sera résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant les données de la clé exportée.

Lorsque `format` est `'jwk'` et que l'exportation réussit, la promesse renvoyée sera résolue avec un objet JavaScript conforme à la spécification [JSON Web Key](https://tools.ietf.org/html/rfc7517).

| Type de clé | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**Ajouté dans : v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/fr/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/fr/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/fr/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/fr/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [Utilisations de la clé](/fr/nodejs/api/webcrypto#cryptokeyusages).
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec une [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/fr/nodejs/api/webcrypto#class-cryptokeypair)

En utilisant la méthode et les paramètres fournis dans `algorithm`, `subtle.generateKey()` tente de générer un nouveau matériel de clés. Selon la méthode utilisée, la méthode peut générer soit une seule [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) soit une [\<CryptoKeyPair\>](/fr/nodejs/api/webcrypto#class-cryptokeypair).

Les algorithmes de génération [\<CryptoKeyPair\>](/fr/nodejs/api/webcrypto#class-cryptokeypair) (clé publique et privée) pris en charge incluent :

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'` 
- `'ECDH'`
- `'X25519'`
- `'X448'` 

Les algorithmes de génération [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) (clé secrète) pris en charge incluent :

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'Ed25519'`, `'Ed448'`, `'X25519'` et `'X448'`. |
| v15.9.0 | Suppression de l'importation JWK `'NODE-DSA'`. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `format` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l'un des éléments suivants : `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `keyData` : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/fr/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/fr/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/fr/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable` : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages` : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [Utilisations de la clé](/fr/nodejs/api/webcrypto#cryptokeyusages).
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)

La méthode `subtle.importKey()` tente d'interpréter les `keyData` fournis au `format` donné pour créer une instance [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) en utilisant les arguments `algorithm`, `extractable` et `keyUsages` fournis. Si l'importation réussit, la promesse retournée sera résolue avec le [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) créé.

Si vous importez une clé `'PBKDF2'`, `extractable` doit être `false`.

Les algorithmes actuellement pris en charge sont les suivants :

| Type de clé | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'Ed25519'` et `'Ed448'`. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `algorithm` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/fr/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/fr/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/fr/nodejs/api/webcrypto#class-ed448params)
- `key` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `data` : [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En utilisant la méthode et les paramètres donnés par `algorithm` et le matériel de clé fourni par `key`, `subtle.sign()` tente de générer une signature cryptographique de `data`. En cas de succès, la promesse retournée est résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant la signature générée.

Les algorithmes actuellement pris en charge incluent :

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Ajouté dans : v15.0.0**

- `format` : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Doit être l’un des éléments suivants : `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `wrappedKey` : [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- `unwrappingKey` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/fr/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/fr/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/fr/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/fr/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/fr/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/fr/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/fr/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable` : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages` : [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Voir [Utilisations de la clé](/fr/nodejs/api/webcrypto#cryptokeyusages).
- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec une [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)

En cryptographie, « encapsuler une clé » fait référence à l’exportation puis au cryptage du matériel de clé. La méthode `subtle.unwrapKey()` tente de décrypter une clé encapsulée et de créer une instance de [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey). Cela équivaut à appeler d’abord `subtle.decrypt()` sur les données de clé cryptées (en utilisant les arguments `wrappedKey`, `unwrapAlgo` et `unwrappingKey` en entrée), puis à transmettre les résultats à la méthode `subtle.importKey()` en utilisant les arguments `unwrappedKeyAlgo`, `extractable` et `keyUsages` en entrée. En cas de succès, la promesse retournée est résolue avec un objet [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey).

Les algorithmes d’encapsulation actuellement pris en charge incluent :

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

Les algorithmes de clé déballée pris en charge incluent :

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


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0, v16.17.0 | Ajout des algorithmes `'Ed25519'` et `'Ed448'`. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `algorithm` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/fr/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/fr/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/fr/nodejs/api/webcrypto#class-ed448params)
- `key` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `signature` : [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- `data` : [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

En utilisant la méthode et les paramètres donnés dans `algorithm` et le matériel de clé fourni par `key`, `subtle.verify()` tente de vérifier que `signature` est une signature cryptographique valide de `data`. La promesse retournée est résolue avec `true` ou `false`.

Les algorithmes actuellement pris en charge incluent :

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Ajouté dans : v15.0.0**

- `format` : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Doit être l'un des éléments suivants : `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `key` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey` : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/fr/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/fr/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/fr/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/fr/nodejs/api/webcrypto#class-aesgcmparams)
- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

En cryptographie, « encapsuler une clé » signifie exporter, puis chiffrer le matériel de clé. La méthode `subtle.wrapKey()` exporte le matériel de clé dans le format identifié par `format`, puis le chiffre en utilisant la méthode et les paramètres spécifiés par `wrapAlgo` et le matériel de clé fourni par `wrappingKey`. Cela équivaut à appeler `subtle.exportKey()` en utilisant `format` et `key` comme arguments, puis à passer le résultat à la méthode `subtle.encrypt()` en utilisant `wrappingKey` et `wrapAlgo` comme entrées. En cas de succès, la promesse retournée sera résolue avec un [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant les données de clé chiffrées.

Les algorithmes d'encapsulation actuellement pris en charge incluent :

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## Paramètres d'algorithme {#algorithm-parameters}

Les objets de paramètres d'algorithme définissent les méthodes et les paramètres utilisés par les différentes méthodes de [\<SubtleCrypto\>](/fr/nodejs/api/webcrypto#class-subtlecrypto). Bien que décrits ici comme des "classes", ce sont de simples objets de dictionnaire JavaScript.

### Classe : `AlgorithmIdentifier` {#class-algorithmidentifier}

**Ajouté dans : v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Ajouté dans : v18.4.0, v16.17.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Classe : `AesCbcParams` {#class-aescbcparams}

**Ajouté dans : v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Ajouté dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Fournit le vecteur d'initialisation. Il doit avoir exactement 16 octets de long et doit être imprévisible et cryptographiquement aléatoire.

#### `aesCbcParams.name` {#aescbcparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'AES-CBC'`.

### Classe : `AesCtrParams` {#class-aesctrparams}

**Ajouté dans : v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Ajouté dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

La valeur initiale du bloc compteur. Il doit avoir exactement 16 octets de long.

La méthode `AES-CTR` utilise les bits les plus à droite `length` du bloc comme compteur et les bits restants comme nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Ajouté dans : v15.0.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de bits dans le `aesCtrParams.counter` qui doivent être utilisés comme compteur.


#### `aesCtrParams.name` {#aesctrparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'AES-CTR'`.

### Classe : `AesGcmParams` {#class-aesgcmparams}

**Ajouté dans : v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Ajouté dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Avec la méthode AES-GCM, `additionalData` est une entrée supplémentaire qui n'est pas chiffrée mais qui est incluse dans l'authentification des données. L'utilisation de `additionalData` est facultative.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Ajouté dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Le vecteur d'initialisation doit être unique pour chaque opération de chiffrement utilisant une clé donnée.

Idéalement, il s'agit d'une valeur déterministe de 12 octets qui est calculée de manière à garantir son caractère unique dans toutes les invocations qui utilisent la même clé. Alternativement, le vecteur d'initialisation peut être constitué d'au moins 12 octets cryptographiquement aléatoires. Pour plus d'informations sur la construction de vecteurs d'initialisation pour AES-GCM, reportez-vous à la section 8 de [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'AES-GCM'`.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Ajouté dans: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille en bits de la balise d'authentification générée. Ces valeurs doivent être l'une des suivantes : `32`, `64`, `96`, `104`, `112`, `120` ou `128`. **Par défaut:** `128`.

### Classe: `AesKeyGenParams` {#class-aeskeygenparams}

**Ajouté dans: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Ajouté dans: v15.0.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La longueur de la clé AES à générer. Celle-ci doit être `128`, `192` ou `256`.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Ajouté dans: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l'une des valeurs suivantes : `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` ou `'AES-KW'`

### Classe: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Ajouté dans: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Ajouté dans: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'ECDH'`, `'X25519'` ou `'X448'`.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Ajouté dans: v15.0.0**

- Type: [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)

La dérivation de clé ECDH fonctionne en prenant comme entrée la clé privée d'une partie et la clé publique d'une autre partie -- en utilisant les deux pour générer un secret partagé commun. La propriété `ecdhKeyDeriveParams.public` est définie sur la clé publique de l'autre partie.

### Classe: `EcdsaParams` {#class-ecdsaparams}

**Ajouté dans: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Ajouté dans: v15.0.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si elle est représentée sous forme de [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l'une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si elle est représentée sous forme de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'objet doit avoir une propriété `name` dont la valeur est l'une des valeurs énumérées ci-dessus.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'ECDSA'`.

### Class: `EcKeyGenParams` {#class-eckeygenparams}

**Ajouté dans : v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'ECDSA'` ou `'ECDH'`.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'P-256'`, `'P-384'`, `'P-521'`.

### Class: `EcKeyImportParams` {#class-eckeyimportparams}

**Ajouté dans : v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'ECDSA'` ou `'ECDH'`.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'P-256'`, `'P-384'`, `'P-521'`.

### Class: `Ed448Params` {#class-ed448params}

**Ajouté dans : v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Ajouté dans : v18.4.0, v16.17.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'Ed448'`.

#### `ed448Params.context` {#ed448paramscontext}

**Ajouté dans : v18.4.0, v16.17.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Le membre `context` représente les données de contexte optionnelles à associer au message. L'implémentation de l'API Web Crypto de Node.js ne prend en charge que le contexte de longueur nulle, ce qui équivaut à ne pas fournir de contexte du tout.


### Classe : `HkdfParams` {#class-hkdfparams}

**Ajoutée dans : v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Ajoutée dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si elle est représentée sous forme de [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l’une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si elle est représentée sous forme de [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object), l’objet doit avoir une propriété `name` dont la valeur est l’une des valeurs répertoriées ci-dessus.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Ajoutée dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Fournit une entrée contextuelle spécifique à l’application à l’algorithme HKDF. Elle peut être de longueur nulle, mais doit être fournie.

#### `hkdfParams.name` {#hkdfparamsname}

**Ajoutée dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Doit être `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Ajoutée dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

La valeur de sel améliore considérablement la force de l’algorithme HKDF. Elle doit être aléatoire ou pseudo-aléatoire et doit avoir la même longueur que la sortie de la fonction de hachage (par exemple, si vous utilisez `'SHA-256'` comme hachage, le sel doit être constitué de 256 bits de données aléatoires).


### Classe : `HmacImportParams` {#class-hmacimportparams}

**Ajoutée dans : v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Ajoutée dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si elle est représentée sous forme de [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l’une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si elle est représentée sous forme de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l’objet doit avoir une propriété `name` dont la valeur est l’une des valeurs listées ci-dessus.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Ajoutée dans : v15.0.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre optionnel de bits dans la clé HMAC. Ceci est optionnel et doit être omis dans la plupart des cas.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Ajoutée dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'HMAC'`.

### Classe : `HmacKeyGenParams` {#class-hmackeygenparams}

**Ajoutée dans : v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Ajoutée dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si elle est représentée sous forme de [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l’une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si elle est représentée sous forme de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l’objet doit avoir une propriété `name` dont la valeur est l’une des valeurs listées ci-dessus.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Ajoutée dans : v15.0.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre de bits à générer pour la clé HMAC. Si elle est omise, la longueur sera déterminée par l’algorithme de hachage utilisé. Ceci est optionnel et doit être omis dans la plupart des cas.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'HMAC'`.

### Classe : `Pbkdf2Params` {#class-pbkdf2params}

**Ajouté dans : v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

S'il est représenté sous forme de [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l'une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

S'il est représenté sous forme de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'objet doit avoir une propriété `name` dont la valeur est l'une des valeurs énumérées ci-dessus.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Ajouté dans : v15.0.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre d'itérations que l'algorithme PBKDF2 doit effectuer lors de la dérivation des bits.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'PBKDF2'`.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Ajouté dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Doit comporter au moins 16 octets aléatoires ou pseudo-aléatoires.

### Classe : `RsaHashedImportParams` {#class-rsahashedimportparams}

**Ajouté dans : v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

S'il est représenté sous forme de [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l'une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

S'il est représenté sous forme de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l'objet doit avoir une propriété `name` dont la valeur est l'une des valeurs énumérées ci-dessus.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l’une des valeurs suivantes : `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` ou `'RSA-OAEP'`.

### Classe : `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Ajouté dans : v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si elle est représentée par une [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), la valeur doit être l’une des suivantes :

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Si elle est représentée par un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), l’objet doit avoir une propriété `name` dont la valeur est l’une des valeurs répertoriées ci-dessus.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Ajouté dans : v15.0.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La longueur en bits du module RSA. En bonne pratique, elle doit être d’au moins `2048`.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l’une des valeurs suivantes : `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` ou `'RSA-OAEP'`.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Ajouté dans : v15.0.0**

- Type : [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

L’exposant public RSA. Il doit s’agir d’un [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) contenant un entier non signé big-endian qui doit tenir dans 32 bits. Le [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) peut contenir un nombre arbitraire de bits zéro de début. La valeur doit être un nombre premier. Sauf s’il y a une raison d’utiliser une valeur différente, utilisez `new Uint8Array([1, 0, 1])` (65537) comme exposant public.


### Classe : `RsaOaepParams` {#class-rsaoaepparams}

**Ajouté dans : v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Ajouté dans : v15.0.0**

- Type : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Une collection supplémentaire d’octets qui ne sera pas chiffrée, mais qui sera liée au texte chiffré généré.

Le paramètre `rsaOaepParams.label` est facultatif.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) doit être `'RSA-OAEP'`.

### Classe : `RsaPssParams` {#class-rsapssparams}

**Ajouté dans : v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Ajouté dans : v15.0.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Ajouté dans : v15.0.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La longueur (en octets) du sel aléatoire à utiliser.

## Notes de bas de page {#footnotes}

