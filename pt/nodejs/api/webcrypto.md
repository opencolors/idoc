---
title: API Web Crypto do Node.js
description: A API Web Crypto do Node.js oferece um conjunto de funções criptográficas para comunicação segura e integridade de dados, incluindo geração de chaves, criptografia, descriptografia, assinatura e verificação.
head:
  - - meta
    - name: og:title
      content: API Web Crypto do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A API Web Crypto do Node.js oferece um conjunto de funções criptográficas para comunicação segura e integridade de dados, incluindo geração de chaves, criptografia, descriptografia, assinatura e verificação.
  - - meta
    - name: twitter:title
      content: API Web Crypto do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A API Web Crypto do Node.js oferece um conjunto de funções criptográficas para comunicação segura e integridade de dados, incluindo geração de chaves, criptografia, descriptografia, assinatura e verificação.
---


# API Web Crypto {#web-crypto-api}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | Os algoritmos `Ed25519` e `X25519` agora são estáveis. |
| v19.0.0 | Não é mais experimental, exceto para os algoritmos `Ed25519`, `Ed448`, `X25519` e `X448`. |
| v20.0.0, v18.17.0 | Os argumentos agora são forçados e validados de acordo com suas definições WebIDL como em outras implementações da API Web Crypto. |
| v18.4.0, v16.17.0 | Formato de importação/exportação proprietário `'node.keyObject'` removido. |
| v18.4.0, v16.17.0 | Algoritmos proprietários `'NODE-DSA'`, `'NODE-DH'` e `'NODE-SCRYPT'` removidos. |
| v18.4.0, v16.17.0 | Algoritmos `'Ed25519'`, `'Ed448'`, `'X25519'` e `'X448'` adicionados. |
| v18.4.0, v16.17.0 | Algoritmos proprietários `'NODE-ED25519'` e `'NODE-ED448'` removidos. |
| v18.4.0, v16.17.0 | Curvas nomeadas proprietárias `'NODE-X25519'` e `'NODE-X448'` removidas do algoritmo `'ECDH'`. |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

O Node.js fornece uma implementação da [API Web Crypto](https://www.w3.org/TR/WebCryptoAPI/) padrão.

Use `globalThis.crypto` ou `require('node:crypto').webcrypto` para acessar este módulo.

```js [ESM]
const { subtle } = globalThis.crypto;

(async function() {

  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const enc = new TextEncoder();
  const message = enc.encode('Eu amo cupcakes');

  const digest = await subtle.sign({
    name: 'HMAC',
  }, key, message);

})();
```
## Exemplos {#examples}

### Gerando chaves {#generating-keys}

A classe [\<SubtleCrypto\>](/pt/nodejs/api/webcrypto#class-subtlecrypto) pode ser usada para gerar chaves simétricas (secretas) ou pares de chaves assimétricas (chave pública e chave privada).

#### Chaves AES {#aes-keys}

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

#### Pares de chaves ECDSA {#ecdsa-key-pairs}

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
#### Pares de chaves Ed25519/X25519 {#ed25519/x25519-key-pairs}

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
#### Chaves HMAC {#hmac-keys}

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
#### Pares de chaves RSA {#rsa-key-pairs}

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
### Criptografia e descriptografia {#encryption-and-decryption}

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
### Exportando e importando chaves {#exporting-and-importing-keys}

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

### Wrapping e unwrapping de chaves {#wrapping-and-unwrapping-keys}

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
### Assinar e verificar {#sign-and-verify}

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
### Derivando bits e chaves {#deriving-bits-and-keys}

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
## Matriz de Algoritmos {#algorithm-matrix}

A tabela detalha os algoritmos suportados pela implementação da API Web Crypto do Node.js e as APIs suportadas para cada um:

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

**Adicionado em: v15.0.0**

`globalThis.crypto` é uma instância da classe `Crypto`. `Crypto` é um singleton que fornece acesso ao restante da API de criptografia.

### `crypto.subtle` {#cryptosubtle}

**Adicionado em: v15.0.0**

- Tipo: [\<SubtleCrypto\>](/pt/nodejs/api/webcrypto#class-subtlecrypto)

Fornece acesso à API `SubtleCrypto`.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Adicionado em: v15.0.0**

- `typedArray` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Gera valores aleatórios criptograficamente fortes. O `typedArray` fornecido é preenchido com valores aleatórios e uma referência a `typedArray` é retornada.

O `typedArray` fornecido deve ser uma instância baseada em inteiros de [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), ou seja, `Float32Array` e `Float64Array` não são aceitos.

Um erro será lançado se o `typedArray` fornecido for maior que 65.536 bytes.


### `crypto.randomUUID()` {#cryptorandomuuid}

**Adicionado em: v16.7.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gera um UUID versão 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) aleatório. O UUID é gerado usando um gerador de números pseudoaleatórios criptográfico.

## Classe: `CryptoKey` {#class-cryptokey}

**Adicionado em: v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**Adicionado em: v15.0.0**

- Tipo: [\<AesKeyGenParams\>](/pt/nodejs/api/webcrypto#class-ெழுparams) | [\<RsaHashedKeyGenParams\>](/pt/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/pt/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/pt/nodejs/api/webcrypto#class-hmackeygenparams)

Um objeto detalhando o algoritmo para o qual a chave pode ser usada, juntamente com parâmetros adicionais específicos do algoritmo.

Somente leitura.

### `cryptoKey.extractable` {#cryptokeyextractable}

**Adicionado em: v15.0.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando `true`, a [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) pode ser extraída usando `subtleCrypto.exportKey()` ou `subtleCrypto.wrapKey()`.

Somente leitura.

### `cryptoKey.type` {#cryptokeytype}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de `'secret'`, `'private'` ou `'public'`.

Uma string identificando se a chave é simétrica (`'secret'`) ou assimétrica (`'private'` ou `'public'`).

### `cryptoKey.usages` {#cryptokeyusages}

**Adicionado em: v15.0.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Um array de strings identificando as operações para as quais a chave pode ser usada.

Os usos possíveis são:

- `'encrypt'` - A chave pode ser usada para criptografar dados.
- `'decrypt'` - A chave pode ser usada para descriptografar dados.
- `'sign'` - A chave pode ser usada para gerar assinaturas digitais.
- `'verify'` - A chave pode ser usada para verificar assinaturas digitais.
- `'deriveKey'` - A chave pode ser usada para derivar uma nova chave.
- `'deriveBits'` - A chave pode ser usada para derivar bits.
- `'wrapKey'` - A chave pode ser usada para envolver outra chave.
- `'unwrapKey'` - A chave pode ser usada para desembrulhar outra chave.

Os usos válidos da chave dependem do algoritmo da chave (identificado por `cryptokey.algorithm.name`).

| Tipo de Chave | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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

**Adicionado em: v15.0.0**

O `CryptoKeyPair` é um objeto de dicionário simples com propriedades `publicKey` e `privateKey`, representando um par de chaves assimétricas.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**Adicionado em: v15.0.0**

- Tipo: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) Um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) cujo `type` será `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**Adicionado em: v15.0.0**

- Tipo: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) Um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) cujo `type` será `'public'`.

## Classe: `SubtleCrypto` {#class-subtlecrypto}

**Adicionado em: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**Adicionado em: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/pt/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/pt/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/pt/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/pt/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando o método e os parâmetros especificados em `algorithm` e o material de chaveamento fornecido por `key`, `subtle.decrypt()` tenta decifrar os `data` fornecidos. Se bem-sucedido, a promise retornada será resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo o resultado do texto simples.

Os algoritmos atualmente suportados incluem:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.5.0, v20.17.0 | O parâmetro length agora é opcional para `'ECDH'`, `'X25519'` e `'X448'`. |
| v18.4.0, v16.17.0 | Adicionados os algoritmos `'X25519'` e `'X448'`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/pt/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/pt/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/pt/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Padrão:** `null`
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando o método e os parâmetros especificados em `algorithm` e o material de chave fornecido por `baseKey`, `subtle.deriveBits()` tenta gerar `length` bits.

Quando `length` não é fornecido ou é `null`, o número máximo de bits para um determinado algoritmo é gerado. Isso é permitido para os algoritmos `'ECDH'`, `'X25519'` e `'X448'`, para outros algoritmos, `length` deve ser um número.

Se bem-sucedida, a promessa retornada será resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo os dados gerados.

Os algoritmos atualmente suportados incluem:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0, v16.17.0 | Adicionados os algoritmos `'X25519'` e `'X448'`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/pt/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/pt/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/pt/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/pt/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/pt/nodejs/api/webcrypto#class-aeskeygenparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [Usos de chave](/pt/nodejs/api/webcrypto#cryptokeyusages).
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)

Usando o método e os parâmetros especificados em `algorithm`, e o material de chave fornecido por `baseKey`, `subtle.deriveKey()` tenta gerar um novo [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) com base no método e parâmetros em `derivedKeyAlgorithm`.

Chamar `subtle.deriveKey()` é equivalente a chamar `subtle.deriveBits()` para gerar material de chave bruto, e então passar o resultado para o método `subtle.importKey()` usando os parâmetros `deriveKeyAlgorithm`, `extractable` e `keyUsages` como entrada.

Os algoritmos atualmente suportados incluem:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### `subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**Adicionado em: v15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando o método identificado por `algorithm`, `subtle.digest()` tenta gerar um resumo de `data`. Se bem-sucedido, a promise retornada é resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo o resumo computado.

Se `algorithm` for fornecido como uma [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), deve ser um dos seguintes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se `algorithm` for fornecido como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), ele deve ter uma propriedade `name` cujo valor seja um dos acima.

### `subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**Adicionado em: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/pt/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/pt/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/pt/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/pt/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando o método e os parâmetros especificados por `algorithm` e o material de chaveamento fornecido por `key`, `subtle.encrypt()` tenta criptografar `data`. Se bem-sucedido, a promise retornada é resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo o resultado criptografado.

Os algoritmos atualmente suportados incluem:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0, v16.17.0 | Adicionados algoritmos `'Ed25519'`, `'Ed448'`, `'X25519'` e `'X448'`. |
| v15.9.0 | Removida a exportação JWK `'NODE-DSA'`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `key`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Exporta a chave fornecida para o formato especificado, se suportado.

Se o [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) não for extraível, a promise retornada será rejeitada.

Quando `format` é `'pkcs8'` ou `'spki'` e a exportação for bem-sucedida, a promise retornada será resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo os dados da chave exportada.

Quando `format` é `'jwk'` e a exportação for bem-sucedida, a promise retornada será resolvida com um objeto JavaScript em conformidade com a especificação [JSON Web Key](https://tools.ietf.org/html/rfc7517).

| Tipo de Chave | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
| --- | --- | --- | --- | --- |
| `'AES-CBC'` ||| ✔ | ✔ |
| `'AES-CTR'` ||| ✔ | ✔ |
| `'AES-GCM'` ||| ✔ | ✔ |
| `'AES-KW'` ||| ✔ | ✔ |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed448'` | ✔ | ✔ | ✔ | ✔ |
| `'HDKF'` |||||
| `'HMAC'` ||| ✔ | ✔ |
| `'PBKDF2'` |||||
| `'RSA-OAEP'` | ✔ | ✔ | ✔ ||
| `'RSA-PSS'` | ✔ | ✔ | ✔ ||
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ ||
### `subtle.generateKey(algorithm, extractable, keyUsages)` {#subtlegeneratekeyalgorithm-extractable-keyusages}

**Adicionado em: v15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/pt/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/pt/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/pt/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/pt/nodejs/api/webcrypto#class-aeskeygenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [Usos de Chave](/pt/nodejs/api/webcrypto#cryptokeyusages).
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/pt/nodejs/api/webcrypto#class-cryptokeypair)

Usando o método e os parâmetros fornecidos em `algorithm`, `subtle.generateKey()` tenta gerar um novo material de chave. Dependendo do método usado, o método pode gerar um único [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) ou um [\<CryptoKeyPair\>](/pt/nodejs/api/webcrypto#class-cryptokeypair).

Os algoritmos de geração de [\<CryptoKeyPair\>](/pt/nodejs/api/webcrypto#class-cryptokeypair) (chave pública e privada) suportados incluem:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

Os algoritmos de geração de [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) (chave secreta) suportados incluem:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0, v16.17.0 | Adicionados os algoritmos `'Ed25519'`, `'Ed448'`, `'X25519'` e `'X448'`. |
| v15.9.0 | Removida a importação JWK `'NODE-DSA'`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/pt/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/pt/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/pt/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [Usos de chaves](/pt/nodejs/api/webcrypto#cryptokeyusages).
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)

O método `subtle.importKey()` tenta interpretar o `keyData` fornecido como o `format` fornecido para criar uma instância [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) usando os argumentos `algorithm`, `extractable` e `keyUsages` fornecidos. Se a importação for bem-sucedida, a promise retornada será resolvida com o [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) criado.

Se importar uma chave `'PBKDF2'`, `extractable` deve ser `false`.

Os algoritmos atualmente suportados incluem:

| Tipo de Chave | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.4.0, v16.17.0 | Adicionados os algoritmos `'Ed25519'` e `'Ed448'`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/pt/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/pt/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/pt/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Usando o método e os parâmetros fornecidos por `algorithm` e o material de chaveamento fornecido por `key`, `subtle.sign()` tenta gerar uma assinatura criptográfica de `data`. Se bem-sucedido, a promessa retornada é resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo a assinatura gerada.

Os algoritmos atualmente suportados incluem:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**Adicionado em: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/pt/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/pt/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/pt/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/pt/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/pt/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/pt/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/pt/nodejs/api/webcrypto#class-hmacimportparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [Usos de Chave](/pt/nodejs/api/webcrypto#cryptokeyusages).
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)

Em criptografia, "empacotar uma chave" refere-se a exportar e, em seguida, criptografar o material de chaveamento. O método `subtle.unwrapKey()` tenta descriptografar uma chave empacotada e criar uma instância de [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey). É equivalente a chamar `subtle.decrypt()` primeiro nos dados da chave criptografada (usando os argumentos `wrappedKey`, `unwrapAlgo` e `unwrappingKey` como entrada) e, em seguida, passar os resultados para o método `subtle.importKey()` usando os argumentos `unwrappedKeyAlgo`, `extractable` e `keyUsages` como entradas. Se bem-sucedido, a promessa retornada é resolvida com um objeto [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey).

Os algoritmos de empacotamento atualmente suportados incluem:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

Os algoritmos de chave desembrulhada suportados incluem:

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


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0, v16.17.0 | Adicionados algoritmos `'Ed25519'` e `'Ed448'`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/pt/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/pt/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/pt/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Usando o método e os parâmetros fornecidos em `algorithm` e o material de chave fornecido por `key`, `subtle.verify()` tenta verificar se `signature` é uma assinatura criptográfica válida de `data`. A promessa retornada é resolvida com `true` ou `false`.

Os algoritmos atualmente suportados incluem:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**Adicionado em: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'raw'`, `'pkcs8'`, `'spki'` ou `'jwk'`.
- `key`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/pt/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/pt/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/pt/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/pt/nodejs/api/webcrypto#class-aesgcmparams)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Em criptografia, "envolver uma chave" refere-se a exportar e, em seguida, criptografar o material da chave. O método `subtle.wrapKey()` exporta o material da chave para o formato identificado por `format` e, em seguida, criptografa-o usando o método e os parâmetros especificados por `wrapAlgo` e o material da chave fornecido por `wrappingKey`. É o equivalente a chamar `subtle.exportKey()` usando `format` e `key` como argumentos e, em seguida, passar o resultado para o método `subtle.encrypt()` usando `wrappingKey` e `wrapAlgo` como entradas. Se bem-sucedida, a promessa retornada será resolvida com um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo os dados da chave criptografada.

Os algoritmos de encapsulamento atualmente suportados incluem:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## Parâmetros do Algoritmo {#algorithm-parameters}

Os objetos de parâmetros do algoritmo definem os métodos e parâmetros usados pelos vários métodos [\<SubtleCrypto\>](/pt/nodejs/api/webcrypto#class-subtlecrypto). Embora sejam descritos aqui como "classes", eles são objetos de dicionário JavaScript simples.

### Classe: `AlgorithmIdentifier` {#class-algorithmidentifier}

**Adicionado em: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**Adicionado em: v18.4.0, v16.17.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Classe: `AesCbcParams` {#class-aescbcparams}

**Adicionado em: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Fornece o vetor de inicialização. Deve ter exatamente 16 bytes de comprimento e deve ser imprevisível e criptograficamente aleatório.

#### `aesCbcParams.name` {#aescbcparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'AES-CBC'`.

### Classe: `AesCtrParams` {#class-aesctrparams}

**Adicionado em: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

O valor inicial do bloco do contador. Isso deve ter exatamente 16 bytes de comprimento.

O método `AES-CTR` usa os `length` bits mais à direita do bloco como contador e os bits restantes como nonce.

#### `aesCtrParams.length` {#aesctrparamslength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bits em `aesCtrParams.counter` que devem ser usados como contador.


#### `aesCtrParams.name` {#aesctrparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'AES-CTR'`.

### Classe: `AesGcmParams` {#class-aesgcmparams}

**Adicionado em: v15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Com o método AES-GCM, o `additionalData` é uma entrada extra que não é criptografada, mas é incluída na autenticação dos dados. O uso de `additionalData` é opcional.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

O vetor de inicialização deve ser único para cada operação de criptografia usando uma determinada chave.

Idealmente, este é um valor determinístico de 12 bytes que é computado de forma que seja garantido que seja único em todas as invocações que usam a mesma chave. Alternativamente, o vetor de inicialização pode consistir em pelo menos 12 bytes criptograficamente aleatórios. Para obter mais informações sobre como construir vetores de inicialização para AES-GCM, consulte a Seção 8 do [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'AES-GCM'`.


#### `aesGcmParams.tagLength` {#aesgcmparamstaglength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho em bits da tag de autenticação gerada. Este valor deve ser um de `32`, `64`, `96`, `104`, `112`, `120` ou `128`. **Padrão:** `128`.

### Classe: `AesKeyGenParams` {#class-aeskeygenparams}

**Adicionado em: v15.0.0**

#### `aesKeyGenParams.length` {#aeskeygenparamslength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O comprimento da chave AES a ser gerada. Deve ser `128`, `192` ou `256`.

#### `aesKeyGenParams.name` {#aeskeygenparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'` ou `'AES-KW'`

### Classe: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**Adicionado em: v15.0.0**

#### `ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'ECDH'`, `'X25519'` ou `'X448'`.

#### `ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**Adicionado em: v15.0.0**

- Tipo: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)

A derivação de chaves ECDH opera tomando como entrada a chave privada de uma parte e a chave pública de outra parte -- usando ambas para gerar um segredo compartilhado comum. A propriedade `ecdhKeyDeriveParams.public` é definida para a chave pública da outra parte.

### Classe: `EcdsaParams` {#class-ecdsaparams}

**Adicionado em: v15.0.0**

#### `ecdsaParams.hash` {#ecdsaparamshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como uma [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.


#### `ecdsaParams.name` {#ecdsaparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'ECDSA'`.

### Classe: `EcKeyGenParams` {#class-eckeygenparams}

**Adicionado em: v15.0.0**

#### `ecKeyGenParams.name` {#eckeygenparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'ECDSA'` ou `'ECDH'`.

#### `ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'P-256'`, `'P-384'`, `'P-521'`.

### Classe: `EcKeyImportParams` {#class-eckeyimportparams}

**Adicionado em: v15.0.0**

#### `ecKeyImportParams.name` {#eckeyimportparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'ECDSA'` ou `'ECDH'`.

#### `ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'P-256'`, `'P-384'`, `'P-521'`.

### Classe: `Ed448Params` {#class-ed448params}

**Adicionado em: v15.0.0**

#### `ed448Params.name` {#ed448paramsname}

**Adicionado em: v18.4.0, v16.17.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'Ed448'`.

#### `ed448Params.context` {#ed448paramscontext}

**Adicionado em: v18.4.0, v16.17.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O membro `context` representa os dados de contexto opcionais a serem associados à mensagem. A implementação da API Web Crypto do Node.js suporta apenas contexto de comprimento zero, que é equivalente a não fornecer contexto algum.


### Classe: `HkdfParams` {#class-hkdfparams}

**Adicionado em: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como uma [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um dos seguintes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.

#### `hkdfParams.info` {#hkdfparamsinfo}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Fornece entrada contextual específica da aplicação para o algoritmo HKDF. Pode ter comprimento zero, mas deve ser fornecido.

#### `hkdfParams.name` {#hkdfparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

O valor do salt melhora significativamente a força do algoritmo HKDF. Deve ser aleatório ou pseudoaleatório e deve ter o mesmo comprimento da saída da função de digest (por exemplo, se usar `'SHA-256'` como o digest, o salt deve ter 256 bits de dados aleatórios).


### Classe: `HmacImportParams` {#class-hmacimportparams}

**Adicionado em: v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um dos seguintes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.

#### `hmacImportParams.length` {#hmacimportparamslength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número opcional de bits na chave HMAC. Isso é opcional e deve ser omitido na maioria dos casos.

#### `hmacImportParams.name` {#hmacimportparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'HMAC'`.

### Classe: `HmacKeyGenParams` {#class-hmackeygenparams}

**Adicionado em: v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um dos seguintes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de bits a serem gerados para a chave HMAC. Se omitido, o comprimento será determinado pelo algoritmo de hash usado. Isso é opcional e deve ser omitido na maioria dos casos.


#### `hmacKeyGenParams.name` {#hmackeygenparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'HMAC'`.

### Classe: `Pbkdf2Params` {#class-pbkdf2params}

**Adicionado em: v15.0.0**

#### `pbkdb2Params.hash` {#pbkdb2paramshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como uma [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um dos seguintes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.

#### `pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de iterações que o algoritmo PBKDF2 deve fazer ao derivar bits.

#### `pbkdf2Params.name` {#pbkdf2paramsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'PBKDF2'`.

#### `pbkdf2Params.salt` {#pbkdf2paramssalt}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Deve ter pelo menos 16 bytes aleatórios ou pseudoaleatórios.

### Classe: `RsaHashedImportParams` {#class-rsahashedimportparams}

**Adicionado em: v15.0.0**

#### `rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como uma [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um dos seguintes:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.


#### `rsaHashedImportParams.name` {#rsahashedimportparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` ou `'RSA-OAEP'`.

### Classe: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**Adicionado em: v15.0.0**

#### `rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se representado como um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o valor deve ser um de:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

Se representado como um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), o objeto deve ter uma propriedade `name` cujo valor seja um dos valores listados acima.

#### `rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O comprimento em bits do módulo RSA. Como prática recomendada, isso deve ser pelo menos `2048`.

#### `rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'` ou `'RSA-OAEP'`.

#### `rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**Adicionado em: v15.0.0**

- Tipo: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

O expoente público RSA. Isso deve ser um [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) contendo um inteiro não assinado big-endian que deve caber em 32 bits. O [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) pode conter um número arbitrário de bits zero à esquerda. O valor deve ser um número primo. A menos que haja um motivo para usar um valor diferente, use `new Uint8Array([1, 0, 1])` (65537) como o expoente público.


### Classe: `RsaOaepParams` {#class-rsaoaepparams}

**Adicionado em: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**Adicionado em: v15.0.0**

- Tipo: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Uma coleção adicional de bytes que não serão criptografados, mas serão vinculados ao texto cifrado gerado.

O parâmetro `rsaOaepParams.label` é opcional.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) deve ser `'RSA-OAEP'`.

### Classe: `RsaPssParams` {#class-rsapssparams}

**Adicionado em: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**Adicionado em: v15.0.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**Adicionado em: v15.0.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O comprimento (em bytes) do salt aleatório a ser usado.

## Notas de rodapé {#footnotes}

