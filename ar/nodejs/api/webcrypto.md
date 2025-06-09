---
title: توثيق Node.js - واجهة برمجة تطبيقات Web Crypto
description: توفر واجهة برمجة تطبيقات Web Crypto في Node.js مجموعة من الوظائف التشفيرية للتواصل الآمن وسلامة البيانات، بما في ذلك توليد المفاتيح، والتشفير، وفك التشفير، والتوقيع، والتحقق.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - واجهة برمجة تطبيقات Web Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر واجهة برمجة تطبيقات Web Crypto في Node.js مجموعة من الوظائف التشفيرية للتواصل الآمن وسلامة البيانات، بما في ذلك توليد المفاتيح، والتشفير، وفك التشفير، والتوقيع، والتحقق.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - واجهة برمجة تطبيقات Web Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر واجهة برمجة تطبيقات Web Crypto في Node.js مجموعة من الوظائف التشفيرية للتواصل الآمن وسلامة البيانات، بما في ذلك توليد المفاتيح، والتشفير، وفك التشفير، والتوقيع، والتحقق.
---


# Web Crypto API {#web-crypto-api}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | أصبحت الخوارزميات `Ed25519` و `X25519` الآن مستقرة. |
| v19.0.0 | لم تعد تجريبية باستثناء الخوارزميات `Ed25519` و `Ed448` و `X25519` و `X448`. |
| v20.0.0, v18.17.0 | يتم الآن إجبار المعلمات والتحقق من صحتها وفقًا لتعريفات WebIDL الخاصة بها كما هو الحال في تطبيقات Web Crypto API الأخرى. |
| v18.4.0, v16.17.0 | تمت إزالة تنسيق الاستيراد/التصدير الاحتكاري `'node.keyObject'`. |
| v18.4.0, v16.17.0 | تمت إزالة الخوارزميات الاحتكارية `'NODE-DSA'` و `'NODE-DH'` و `'NODE-SCRYPT'`. |
| v18.4.0, v16.17.0 | تمت إضافة الخوارزميات `'Ed25519'` و `'Ed448'` و `'X25519'` و `'X448'`. |
| v18.4.0, v16.17.0 | تمت إزالة الخوارزميات الاحتكارية `'NODE-ED25519'` و `'NODE-ED448'`. |
| v18.4.0, v16.17.0 | تمت إزالة المنحنيات المسماة الاحتكارية `'NODE-X25519'` و `'NODE-X448'` من خوارزمية `'ECDH'`. |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يوفر Node.js تطبيقًا لمعيار [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/).

استخدم `globalThis.crypto` أو `require('node:crypto').webcrypto` للوصول إلى هذه الوحدة.

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
## أمثلة {#examples}

### إنشاء المفاتيح {#generating-keys}

يمكن استخدام الفئة [\<SubtleCrypto\>](/ar/nodejs/api/webcrypto#class-subtlecrypto) لإنشاء مفاتيح متماثلة (سرية) أو أزواج مفاتيح غير متماثلة (مفتاح عام ومفتاح خاص).

#### مفاتيح AES {#aes-keys}

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

#### أزواج مفاتيح ECDSA {#ecdsa-key-pairs}

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
#### أزواج مفاتيح Ed25519/X25519 {#ed25519/x25519-key-pairs}

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
#### مفاتيح HMAC {#hmac-keys}

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
#### أزواج مفاتيح RSA {#rsa-key-pairs}

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
### التشفير وفك التشفير {#encryption-and-decryption}

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
### تصدير واستيراد المفاتيح {#exporting-and-importing-keys}

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

### تغليف وفك تغليف المفاتيح {#wrapping-and-unwrapping-keys}

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
### التوقيع والتحقق {#sign-and-verify}

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
### اشتقاق البتات والمفاتيح {#deriving-bits-and-keys}

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

### ملخص {#digest}

```js [ESM]
const { subtle } = globalThis.crypto;

async function digest(data, algorithm = 'SHA-512') {
  const ec = new TextEncoder();
  const digest = await subtle.digest(algorithm, ec.encode(data));
  return digest;
}
```
## مصفوفة الخوارزميات {#algorithm-matrix}

يوضح الجدول الخوارزميات التي يدعمها تطبيق Web Crypto API الخاص بـ Node.js وواجهات برمجة التطبيقات المدعومة لكل منها:

| الخوارزمية | `generateKey` | `exportKey` | `importKey` | `encrypt` | `decrypt` | `wrapKey` | `unwrapKey` | `deriveBits` | `deriveKey` | `sign` | `verify` | `digest` |
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
## الصنف: `Crypto` {#class-crypto}

**أضيف في: v15.0.0**

`globalThis.crypto` هو نسخة من الصنف `Crypto`. `Crypto` هو صنف أحادي يوفر الوصول إلى بقية واجهة برمجة تطبيقات التشفير.

### `crypto.subtle` {#cryptosubtle}

**أضيف في: v15.0.0**

- النوع: [\<SubtleCrypto\>](/ar/nodejs/api/webcrypto#class-subtlecrypto)

يوفر الوصول إلى واجهة برمجة تطبيقات `SubtleCrypto`.

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**أضيف في: v15.0.0**

- `typedArray` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

يقوم بإنشاء قيم عشوائية قوية مشفرة. يتم ملء `typedArray` المعطى بقيم عشوائية، ويتم إرجاع مرجع إلى `typedArray`.

يجب أن يكون `typedArray` المعطى نسخة قائمة على الأعداد الصحيحة من [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)، أي أنه لا يتم قبول `Float32Array` و `Float64Array`.

سيتم طرح خطأ إذا كان `typedArray` المعطى أكبر من 65536 بايت.


### `crypto.randomUUID()` {#cryptorandomuuid}

**تمت الإضافة في: الإصدار v16.7.0**

- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُنشئ معرّف UUID عشوائيًا [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) الإصدار 4. يتم إنشاء UUID باستخدام مولد أرقام عشوائية مشفرة.

## الصنف: `CryptoKey` {#class-cryptokey}

**تمت الإضافة في: الإصدار v15.0.0**

### `cryptoKey.algorithm` {#cryptokeyalgorithm}

**تمت الإضافة في: الإصدار v15.0.0**

- النوع: [\<AesKeyGenParams\>](/ar/nodejs/api/webcrypto#class- генералparams) | [\<RsaHashedKeyGenParams\>](/ar/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ar/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ar/nodejs/api/webcrypto#class-hmackeygenparams)

كائن يوضح بالتفصيل الخوارزمية التي يمكن استخدام المفتاح من أجلها جنبًا إلى جنب مع معلمات إضافية خاصة بالخوارزمية.

للقراءة فقط.

### `cryptoKey.extractable` {#cryptokeyextractable}

**تمت الإضافة في: الإصدار v15.0.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

عندما تكون القيمة `true`، يمكن استخراج [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) باستخدام إما `subtleCrypto.exportKey()` أو `subtleCrypto.wrapKey()`.

للقراءة فقط.

### `cryptoKey.type` {#cryptokeytype}

**تمت الإضافة في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أحد القيم التالية: `'secret'` أو `'private'` أو `'public'`.

سلسلة تحدد ما إذا كان المفتاح متماثلًا (`'secret'`) أو غير متماثل (`'private'` أو `'public'`).

### `cryptoKey.usages` {#cryptokeyusages}

**تمت الإضافة في: الإصدار v15.0.0**

- النوع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مصفوفة من السلاسل تحدد العمليات التي يمكن استخدام المفتاح من أجلها.

الاستخدامات المحتملة هي:

- `'encrypt'` - يمكن استخدام المفتاح لتشفير البيانات.
- `'decrypt'` - يمكن استخدام المفتاح لفك تشفير البيانات.
- `'sign'` - يمكن استخدام المفتاح لإنشاء تواقيع رقمية.
- `'verify'` - يمكن استخدام المفتاح للتحقق من التواقيع الرقمية.
- `'deriveKey'` - يمكن استخدام المفتاح لاشتقاق مفتاح جديد.
- `'deriveBits'` - يمكن استخدام المفتاح لاشتقاق البتات.
- `'wrapKey'` - يمكن استخدام المفتاح لتغليف مفتاح آخر.
- `'unwrapKey'` - يمكن استخدام المفتاح لفك تغليف مفتاح آخر.

تعتمد الاستخدامات الصالحة للمفتاح على خوارزمية المفتاح (التي يتم تحديدها بواسطة `cryptokey.algorithm.name`).

| نوع المفتاح | `'encrypt'` | `'decrypt'` | `'sign'` | `'verify'` | `'deriveKey'` | `'deriveBits'` | `'wrapKey'` | `'unwrapKey'` |
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

## الفئة: `CryptoKeyPair` {#class-cryptokeypair}

**تمت إضافتها في: v15.0.0**

`CryptoKeyPair` هو كائن قاموس بسيط مع خصائص `publicKey` و `privateKey` ، ويمثل زوج مفاتيح غير متماثل.

### `cryptoKeyPair.privateKey` {#cryptokeypairprivatekey}

**تمت إضافتها في: v15.0.0**

- النوع: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) سيكون `type` الخاص بها `'private'`.

### `cryptoKeyPair.publicKey` {#cryptokeypairpublickey}

**تمت إضافتها في: v15.0.0**

- النوع: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) سيكون `type` الخاص بها `'public'`.

## الفئة: `SubtleCrypto` {#class-subtlecrypto}

**تمت إضافتها في: v15.0.0**

### `subtle.decrypt(algorithm, key, data)` {#subtledecryptalgorithm-key-data}

**تمت إضافتها في: v15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ar/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ar/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ar/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ar/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

باستخدام الطريقة والمعلمات المحددة في `algorithm` ومواد المفاتيح التي توفرها `key`، تحاول `subtle.decrypt()` فك تشفير `data` المقدمة. إذا نجح الأمر، فسيتم حل الوعد المرتجع باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) الذي يحتوي على نتيجة النص العادي.

تتضمن الخوارزميات المدعومة حاليًا ما يلي:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.deriveBits(algorithm, baseKey[, length])` {#subtlederivebitsalgorithm-basekey-length}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.5.0, v20.17.0 | أصبح الآن المعامل length اختياريًا لـ `'ECDH'` و `'X25519'` و `'X448'`. |
| v18.4.0, v16.17.0 | تمت إضافة الخوارزميات `'X25519'` و `'X448'`. |
| v15.0.0 | تمت إضافته في: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ar/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ar/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ar/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقه باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

باستخدام الطريقة والمعلمات المحددة في `algorithm` والمادة الأساسية المتوفرة بواسطة `baseKey`، تحاول `subtle.deriveBits()` إنشاء `length` من البتات.

عندما لا يتم توفير `length` أو كانت `null`، يتم إنشاء الحد الأقصى لعدد البتات لخوارزمية معينة. هذا مسموح به لخوارزميات `'ECDH'` و `'X25519'` و `'X448'`، أما بالنسبة للخوارزميات الأخرى، فيجب أن يكون `length` رقمًا.

إذا نجحت العملية، فسيتم حل الوعد المرتجع باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) يحتوي على البيانات التي تم إنشاؤها.

تتضمن الخوارزميات المدعومة حاليًا ما يلي:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`

### `subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages)` {#subtlederivekeyalgorithm-basekey-derivedkeyalgorithm-extractable-keyusages}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.4.0, v16.17.0 | تمت إضافة الخوارزميات `'X25519'` و `'X448'`. |
| v15.0.0 | تمت إضافته في: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<EcdhKeyDeriveParams\>](/ar/nodejs/api/webcrypto#class-ecdhkeyderiveparams) | [\<HkdfParams\>](/ar/nodejs/api/webcrypto#class-hkdfparams) | [\<Pbkdf2Params\>](/ar/nodejs/api/webcrypto#class-pbkdf2params)
- `baseKey`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `derivedKeyAlgorithm`: [\<HmacKeyGenParams\>](/ar/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ar/nodejs/api/webcrypto#class-aeskeygenassistparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [Key usages](/ar/nodejs/api/webcrypto#cryptokeyusages).
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقه باستخدام [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)

باستخدام الطريقة والمعلمات المحددة في `algorithm` والمادة الأساسية المتوفرة بواسطة `baseKey`، تحاول `subtle.deriveKey()` إنشاء [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) جديد بناءً على الطريقة والمعلمات الموجودة في `derivedKeyAlgorithm`.

يُعادل استدعاء `subtle.deriveKey()` استدعاء `subtle.deriveBits()` لإنشاء مادة أساسية أولية، ثم تمرير النتيجة إلى طريقة `subtle.importKey()` باستخدام معلمات `deriveKeyAlgorithm` و `extractable` و `keyUsages` كمدخلات.

تتضمن الخوارزميات المدعومة حاليًا ما يلي:

- `'ECDH'`
- `'X25519'`
- `'X448'`
- `'HKDF'`
- `'PBKDF2'`


### ‏`subtle.digest(algorithm, data)` {#subtledigestalgorithm-data}

**تمت الإضافة في: الإصدار 15.0.0**

- `algorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

باستخدام الطريقة المحددة بواسطة `algorithm`، تحاول `subtle.digest()` إنشاء ملخص لـ `data`. إذا نجحت، فسيتم حل الوعد الذي تم إرجاعه باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) الذي يحتوي على الملخص المحسوب.

إذا تم توفير `algorithm` كسلسلة [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، فيجب أن تكون إحدى القيم التالية:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا تم توفير `algorithm` كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، فيجب أن يحتوي على خاصية `name` تكون قيمتها إحدى القيم المذكورة أعلاه.

### ‏`subtle.encrypt(algorithm, key, data)` {#subtleencryptalgorithm-key-data}

**تمت الإضافة في: الإصدار 15.0.0**

- `algorithm`: [\<RsaOaepParams\>](/ar/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ar/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ar/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ar/nodejs/api/webcrypto#class-aesgcmparams)
- `key`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

باستخدام الطريقة والمعلمات المحددة بواسطة `algorithm` والمواد الرئيسية التي توفرها `key`، تحاول `subtle.encrypt()` تشفير `data`. إذا نجحت، فسيتم حل الوعد الذي تم إرجاعه باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) الذي يحتوي على النتيجة المشفرة.

تتضمن الخوارزميات المدعومة حاليًا ما يلي:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`


### `subtle.exportKey(format, key)` {#subtleexportkeyformat-key}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.4.0، الإصدار 16.17.0 | تمت إضافة خوارزميات `'Ed25519'` و `'Ed448'` و `'X25519'` و `'X448'`. |
| الإصدار 15.9.0 | تمت إزالة تصدير `'NODE-DSA'` JWK. |
| الإصدار 15.0.0 | تمت الإضافة في: الإصدار 15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون واحدًا من `'raw'` أو `'pkcs8'` أو `'spki'` أو `'jwk'`.
- `key`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

يُصدِّر المفتاح المحدد إلى التنسيق المحدد، إذا كان مدعومًا.

إذا كان [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) غير قابل للاستخراج، فسيتم رفض الوعد الذي تم إرجاعه.

عندما يكون `format` إما `'pkcs8'` أو `'spki'` ويكون التصدير ناجحًا، فسيتم حل الوعد الذي تم إرجاعه باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) الذي يحتوي على بيانات المفتاح المصدرة.

عندما يكون `format` هو `'jwk'` ويكون التصدير ناجحًا، فسيتم حل الوعد الذي تم إرجاعه باستخدام كائن JavaScript يتوافق مع مواصفات [JSON Web Key](https://tools.ietf.org/html/rfc7517).

| نوع المفتاح | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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

**تمت الإضافة في: الإصدار 15.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedKeyGenParams\>](/ar/nodejs/api/webcrypto#class-rsahashedkeygenparams) | [\<EcKeyGenParams\>](/ar/nodejs/api/webcrypto#class-eckeygenparams) | [\<HmacKeyGenParams\>](/ar/nodejs/api/webcrypto#class-hmackeygenparams) | [\<AesKeyGenParams\>](/ar/nodejs/api/webcrypto#class-aeskeygenassistgenparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [استخدامات المفتاح](/ar/nodejs/api/webcrypto#cryptokeyusages).
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) | [\<CryptoKeyPair\>](/ar/nodejs/api/webcrypto#class-cryptokeypair)

باستخدام الطريقة والمعلمات المقدمة في `algorithm`، تحاول `subtle.generateKey()` إنشاء مواد مفاتيح جديدة. اعتمادًا على الطريقة المستخدمة، قد تنشئ الطريقة إما [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) واحدًا أو [\<CryptoKeyPair\>](/ar/nodejs/api/webcrypto#class-cryptokeypair).

تتضمن خوارزميات إنشاء [\<CryptoKeyPair\>](/ar/nodejs/api/webcrypto#class-cryptokeypair) (المفتاح العام والخاص) المدعومة ما يلي:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'RSA-OAEP'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'ECDH'`
- `'X25519'`
- `'X448'`

تتضمن خوارزميات إنشاء [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) (المفتاح السري) المدعومة ما يلي:

- `'HMAC'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` {#subtleimportkeyformat-keydata-algorithm-extractable-keyusages}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.4.0, v16.17.0 | تمت إضافة الخوارزميات `'Ed25519'` و `'Ed448'` و `'X25519'` و `'X448'`. |
| v15.9.0 | تمت إزالة استيراد `'NODE-DSA'` JWK. |
| v15.0.0 | تمت الإضافة في: v15.0.0 |
:::

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون واحدًا من `'raw'` أو `'pkcs8'` أو `'spki'` أو `'jwk'`.
- `keyData`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ar/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ar/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ar/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [استخدامات المفتاح](/ar/nodejs/api/webcrypto#cryptokeyusages).
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)

تحاول الطريقة `subtle.importKey()` تفسير `keyData` المقدمة باعتبارها `format` معينة لإنشاء مثيل [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) باستخدام وسيطات `algorithm` و `extractable` و `keyUsages` المقدمة. إذا كان الاستيراد ناجحًا، فسيتم حل الوعد الذي تم إرجاعه باستخدام [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) الذي تم إنشاؤه.

إذا تم استيراد مفتاح `'PBKDF2'`، فيجب أن يكون `extractable` هو `false`.

تتضمن الخوارزميات المدعومة حاليًا:

| نوع المفتاح | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` |
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


::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصداران v18.4.0 و v16.17.0 | تمت إضافة الخوارزميات `'Ed25519'` و `'Ed448'`. |
| الإصدار v15.0.0 | تمت إضافته في الإصدار: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ar/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ar/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ar/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- القيمة المُعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) يحتوي على التوقيع المُنشأ.

باستخدام الطريقة والمعلمات التي قدمتها `algorithm` ومواد المفاتيح التي قدمتها `key`، تحاول `subtle.sign()` إنشاء توقيع تشفيري لـ `data`. إذا نجحت العملية، يتم حل الوعد المُعاد مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) يحتوي على التوقيع المُنشأ.

تتضمن الخوارزميات المدعومة حاليًا ما يلي:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, extractable, keyUsages)` {#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgo-unwrappedkeyalgo-extractable-keyusages}

**تمت إضافته في الإصدار: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد القيم التالية: `'raw'` أو `'pkcs8'` أو `'spki'` أو `'jwk'`.
- `wrappedKey`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- `unwrappingKey`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)

- `unwrapAlgo`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ar/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ar/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ar/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ar/nodejs/api/webcrypto#class-aesgcmparams)
- `unwrappedKeyAlgo`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ar/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ar/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ar/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) راجع [استخدامات المفاتيح](/ar/nodejs/api/webcrypto#cryptokeyusages).
- القيمة المُعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)

في علم التشفير، تشير عبارة "تغليف مفتاح" إلى تصدير ثم تشفير مادة المفاتيح. تحاول طريقة `subtle.unwrapKey()` فك تشفير مفتاح مُغلف وإنشاء مثيل [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey). وهو ما يعادل استدعاء `subtle.decrypt()` أولاً على بيانات المفتاح المشفرة (باستخدام وسائط `wrappedKey` و`unwrapAlgo` و`unwrappingKey` كمدخلات) ثم تمرير النتائج إلى طريقة `subtle.importKey()` باستخدام وسائط `unwrappedKeyAlgo` و`extractable` و`keyUsages` كمدخلات. إذا نجحت العملية، يتم حل الوعد المُعاد مع كائن [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey).

تتضمن خوارزميات التغليف المدعومة حاليًا ما يلي:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`

تتضمن خوارزميات المفاتيح غير المُغلفة المدعومة ما يلي:

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

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.4.0، 16.17.0 | تمت إضافة خوارزميات `'Ed25519'`، و `'Ed448'`. |
| الإصدار 15.0.0 | تمت الإضافة في: v15.0.0 |
:::

- `algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaPssParams\>](/ar/nodejs/api/webcrypto#class-rsapssparams) | [\<EcdsaParams\>](/ar/nodejs/api/webcrypto#class-ecdsaparams) | [\<Ed448Params\>](/ar/nodejs/api/webcrypto#class-ed448params)
- `key`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `signature`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- `data`: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

باستخدام الطريقة والمعلمات المحددة في `algorithm` ومواد المفاتيح التي توفرها `key`، تحاول `subtle.verify()` التحقق من أن `signature` هو توقيع تشفير صالح لـ `data`. يتم حل الوعد الذي تم إرجاعه إما بـ `true` أو `false`.

تتضمن الخوارزميات المدعومة حاليًا:

- `'RSASSA-PKCS1-v1_5'`
- `'RSA-PSS'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`
- `'HMAC'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgo)` {#subtlewrapkeyformat-key-wrappingkey-wrapalgo}

**تمت الإضافة في: v15.0.0**

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون واحدًا من `'raw'`، أو `'pkcs8'`، أو `'spki'`، أو `'jwk'`.
- `key`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `wrappingKey`: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `wrapAlgo`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaOaepParams\>](/ar/nodejs/api/webcrypto#class-rsaoaepparams) | [\<AesCtrParams\>](/ar/nodejs/api/webcrypto#class-aesctrparams) | [\<AesCbcParams\>](/ar/nodejs/api/webcrypto#class-aescbcparams) | [\<AesGcmParams\>](/ar/nodejs/api/webcrypto#class-aesgcmparams)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

في علم التشفير، تشير "تغليف المفتاح" إلى تصدير ثم تشفير مادة المفتاح. تقوم الطريقة `subtle.wrapKey()` بتصدير مادة المفتاح إلى التنسيق المحدد بواسطة `format`، ثم تقوم بتشفيرها باستخدام الطريقة والمعلمات المحددة بواسطة `wrapAlgo` ومادة المفتاح التي توفرها `wrappingKey`. إنه يعادل استدعاء `subtle.exportKey()` باستخدام `format` و `key` كوسيطات، ثم تمرير النتيجة إلى الطريقة `subtle.encrypt()` باستخدام `wrappingKey` و `wrapAlgo` كمدخلات. إذا نجح الأمر، فسيتم حل الوعد الذي تم إرجاعه باستخدام [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) يحتوي على بيانات المفتاح المشفرة.

تتضمن خوارزميات التغليف المدعومة حاليًا:

- `'RSA-OAEP'`
- `'AES-CTR'`
- `'AES-CBC'`
- `'AES-GCM'`
- `'AES-KW'`


## معلمات الخوارزمية {#algorithm-parameters}

تحدد كائنات معلمات الخوارزمية الأساليب والمعلمات التي تستخدمها طرق [\<SubtleCrypto\>](/ar/nodejs/api/webcrypto#class-subtlecrypto) المختلفة. على الرغم من وصفها هنا بأنها "فئات"، إلا أنها مجرد كائنات قاموس JavaScript بسيطة.

### الفئة: `AlgorithmIdentifier` {#class-algorithmidentifier}

**تمت الإضافة في: v18.4.0, v16.17.0**

#### `algorithmIdentifier.name` {#algorithmidentifiername}

**تمت الإضافة في: v18.4.0, v16.17.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### الفئة: `AesCbcParams` {#class-aescbcparams}

**تمت الإضافة في: v15.0.0**

#### `aesCbcParams.iv` {#aescbcparamsiv}

**تمت الإضافة في: v15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يوفر متجه التهيئة. يجب أن يكون طوله 16 بايتًا بالضبط ويجب أن يكون غير متوقع وعشوائيًا مشفرًا.

#### `aesCbcParams.name` {#aescbcparamsname}

**تمت الإضافة في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'AES-CBC'`.

### الفئة: `AesCtrParams` {#class-aesctrparams}

**تمت الإضافة في: v15.0.0**

#### `aesCtrParams.counter` {#aesctrparamscounter}

**تمت الإضافة في: v15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

القيمة الأولية لكتلة العداد. يجب أن يكون هذا الطول 16 بايتًا بالضبط.

تستخدم طريقة `AES-CTR` أقصى `length` بتات على اليمين من الكتلة كعداد والباقي كقيمة عشوائية.

#### `aesCtrParams.length` {#aesctrparamslength}

**تمت الإضافة في: v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البتات في `aesCtrParams.counter` التي سيتم استخدامها كعداد.


#### `aesCtrParams.name` {#aesctrparamsname}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'AES-CTR'`.

### الفئة: `AesGcmParams` {#class-aesgcmparams}

**تمت الإضافة في: الإصدار 15.0.0**

#### `aesGcmParams.additionalData` {#aesgcmparamsadditionaldata}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

باستخدام طريقة AES-GCM، تكون `additionalData` مدخلات إضافية غير مشفرة ولكنها مضمنة في مصادقة البيانات. استخدام `additionalData` اختياري.

#### `aesGcmParams.iv` {#aesgcmparamsiv}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يجب أن يكون متجه التهيئة فريدًا لكل عملية تشفير باستخدام مفتاح معين.

من الناحية المثالية، هذه قيمة حتمية مكونة من 12 بايت يتم حسابها بطريقة تضمن أنها فريدة عبر جميع الاستدعاءات التي تستخدم نفس المفتاح. بدلاً من ذلك، قد يتكون متجه التهيئة من 12 بايت عشوائية مشفرة على الأقل. لمزيد من المعلومات حول إنشاء متجهات تهيئة لـ AES-GCM، راجع القسم 8 من [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

#### `aesGcmParams.name` {#aesgcmparamsname}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'AES-GCM'`.


#### ‏`aesGcmParams.tagLength` {#aesgcmparamstaglength}

**أُضيف في: v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم علامة المصادقة التي تم إنشاؤها بالبت. يجب أن تكون هذه القيم إحدى القيم التالية: `32` أو `64` أو `96` أو `104` أو `112` أو `120` أو `128`. **افتراضي:** `128`.

### ‏Class: `AesKeyGenParams` {#class-aeskeygenparams}

**أُضيف في: v15.0.0**

#### ‏`aesKeyGenParams.length` {#aeskeygenparamslength}

**أُضيف في: v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

طول مفتاح AES المراد إنشاؤه. يجب أن يكون إما `128` أو `192` أو `256`.

#### ‏`aesKeyGenParams.name` {#aeskeygenparamsname}

**أُضيف في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد هذه القيم: `'AES-CBC'` أو `'AES-CTR'` أو `'AES-GCM'` أو `'AES-KW'`

### ‏Class: `EcdhKeyDeriveParams` {#class-ecdhkeyderiveparams}

**أُضيف في: v15.0.0**

#### ‏`ecdhKeyDeriveParams.name` {#ecdhkeyderiveparamsname}

**أُضيف في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'ECDH'` أو `'X25519'` أو `'X448'`.

#### ‏`ecdhKeyDeriveParams.public` {#ecdhkeyderiveparamspublic}

**أُضيف في: v15.0.0**

- النوع: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)

تعمل اشتقاق مفتاح ECDH عن طريق أخذ المفتاح الخاص لأحد الطرفين والمفتاح العام للطرف الآخر كمدخلات - باستخدام كليهما لإنشاء سر مشترك. يتم تعيين الخاصية `ecdhKeyDeriveParams.public` على المفتاح العام للطرف الآخر.

### ‏Class: `EcdsaParams` {#class-ecdsaparams}

**أُضيف في: v15.0.0**

#### ‏`ecdsaParams.hash` {#ecdsaparamshash}

**أُضيف في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا تم تمثيلها على أنها [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، فيجب أن تكون القيمة إحدى القيم التالية:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا تم تمثيلها على أنها [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، فيجب أن يكون للكائن خاصية `name` تكون قيمتها إحدى القيم المذكورة أعلاه.


#### ‏`ecdsaParams.name` {#ecdsaparamsname}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'ECDSA'`.

### ‏Class: ‏`EcKeyGenParams` {#class-eckeygenparams}

**تمت الإضافة في: الإصدار 15.0.0**

#### ‏`ecKeyGenParams.name` {#eckeygenparamsname}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد `'ECDSA'` أو `'ECDH'`.

#### ‏`ecKeyGenParams.namedCurve` {#eckeygenparamsnamedcurve}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد `'P-256'` أو `'P-384'` أو `'P-521'`.

### ‏Class: ‏`EcKeyImportParams` {#class-eckeyimportparams}

**تمت الإضافة في: الإصدار 15.0.0**

#### ‏`ecKeyImportParams.name` {#eckeyimportparamsname}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد `'ECDSA'` أو `'ECDH'`.

#### ‏`ecKeyImportParams.namedCurve` {#eckeyimportparamsnamedcurve}

**تمت الإضافة في: الإصدار 15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد `'P-256'` أو `'P-384'` أو `'P-521'`.

### ‏Class: ‏`Ed448Params` {#class-ed448params}

**تمت الإضافة في: الإصدار 15.0.0**

#### ‏`ed448Params.name` {#ed448paramsname}

**تمت الإضافة في: الإصدار 18.4.0، الإصدار 16.17.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'Ed448'`.

#### ‏`ed448Params.context` {#ed448paramscontext}

**تمت الإضافة في: الإصدار 18.4.0، الإصدار 16.17.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

يمثل العضو `context` بيانات السياق الاختيارية المراد ربطها بالرسالة. يدعم تطبيق Node.js Web Crypto API سياقًا بطول صفري فقط وهو ما يعادل عدم توفير سياق على الإطلاق.


### الفئة: `HkdfParams` {#class-hkdfparams}

**أُضيفت في: v15.0.0**

#### `hkdfParams.hash` {#hkdfparamshash}

**أُضيفت في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا مُثّلت كـ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، يجب أن تكون القيمة واحدة من:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا مُثّلت كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، يجب أن يكون للكائن الخاصية `name` التي تكون قيمتها واحدة من القيم المذكورة أعلاه.

#### `hkdfParams.info` {#hkdfparamsinfo}

**أُضيفت في: v15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يوفر مدخلات سياقية خاصة بالتطبيق لخوارزمية HKDF. يمكن أن يكون هذا الطول صفرًا ولكن يجب توفيره.

#### `hkdfParams.name` {#hkdfparamsname}

**أُضيفت في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'HKDF'`.

#### `hkdfParams.salt` {#hkdfparamssalt}

**أُضيفت في: v15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

تعمل قيمة الملح بشكل كبير على تحسين قوة خوارزمية HKDF. يجب أن تكون عشوائية أو شبه عشوائية ويجب أن يكون لها نفس طول إخراج دالة التلخيص (على سبيل المثال، إذا تم استخدام `'SHA-256'` كملخص، فيجب أن يكون الملح عبارة عن 256 بت من البيانات العشوائية).


### الصنف: `HmacImportParams` {#class-hmacimportparams}

**أُضيف في: الإصدار v15.0.0**

#### `hmacImportParams.hash` {#hmacimportparamshash}

**أُضيف في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا مُثِّل كـ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، فيجب أن تكون القيمة واحدة من:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا مُثِّل كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، فيجب أن يكون للكائن الخاصية `name` التي تكون قيمتها واحدة من القيم المدرجة أعلاه.

#### `hmacImportParams.length` {#hmacimportparamslength}

**أُضيف في: الإصدار v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

العدد الاختياري للبتات في مفتاح HMAC. هذا اختياري ويجب حذفه في معظم الحالات.

#### `hmacImportParams.name` {#hmacimportparamsname}

**أُضيف في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'HMAC'`.

### الصنف: `HmacKeyGenParams` {#class-hmackeygenparams}

**أُضيف في: الإصدار v15.0.0**

#### `hmacKeyGenParams.hash` {#hmackeygenparamshash}

**أُضيف في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا مُثِّل كـ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، فيجب أن تكون القيمة واحدة من:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا مُثِّل كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، فيجب أن يكون للكائن الخاصية `name` التي تكون قيمتها واحدة من القيم المدرجة أعلاه.

#### `hmacKeyGenParams.length` {#hmackeygenparamslength}

**أُضيف في: الإصدار v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد البتات التي سيتم إنشاؤها لمفتاح HMAC. إذا تم حذفه، فسيتم تحديد الطول بواسطة خوارزمية التجزئة المستخدمة. هذا اختياري ويجب حذفه في معظم الحالات.


#### ‏`hmacKeyGenParams.name` {#hmackeygenparamsname}

**تمت إضافته في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'HMAC'`.

### الصنف: `Pbkdf2Params` {#class-pbkdf2params}

**تمت إضافته في: v15.0.0**

#### ‏`pbkdb2Params.hash` {#pbkdb2paramshash}

**تمت إضافته في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا مُثِّل كـ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، يجب أن تكون القيمة إحدى القيم التالية:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا مُثِّل كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، يجب أن يكون للكائن خاصية `name` وتكون قيمتها إحدى القيم المذكورة أعلاه.

#### ‏`pbkdf2Params.iterations` {#pbkdf2paramsiterations}

**تمت إضافته في: v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد التكرارات التي يجب أن تقوم بها خوارزمية PBKDF2 عند استخلاص البتات.

#### ‏`pbkdf2Params.name` {#pbkdf2paramsname}

**تمت إضافته في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'PBKDF2'`.

#### ‏`pbkdf2Params.salt` {#pbkdf2paramssalt}

**تمت إضافته في: v15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يجب أن يكون على الأقل 16 بايت عشوائية أو شبه عشوائية.

### الصنف: `RsaHashedImportParams` {#class-rsahashedimportparams}

**تمت إضافته في: v15.0.0**

#### ‏`rsaHashedImportParams.hash` {#rsahashedimportparamshash}

**تمت إضافته في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا مُثِّل كـ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، يجب أن تكون القيمة إحدى القيم التالية:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا مُثِّل كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، يجب أن يكون للكائن خاصية `name` وتكون قيمتها إحدى القيم المذكورة أعلاه.


#### ‏`rsaHashedImportParams.name` {#rsahashedimportparamsname}

**أضيف في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون واحدًا من `'RSASSA-PKCS1-v1_5'` أو `'RSA-PSS'` أو `'RSA-OAEP'`.

### الصنف: `RsaHashedKeyGenParams` {#class-rsahashedkeygenparams}

**أضيف في: الإصدار v15.0.0**

#### ‏`rsaHashedKeyGenParams.hash` {#rsahashedkeygenparamshash}

**أضيف في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا تم تمثيلها كـ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، يجب أن تكون القيمة واحدة من:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`

إذا تم تمثيلها كـ [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، يجب أن يحتوي الكائن على خاصية `name` تكون قيمتها واحدة من القيم المذكورة أعلاه.

#### ‏`rsaHashedKeyGenParams.modulusLength` {#rsahashedkeygenparamsmoduluslength}

**أضيف في: الإصدار v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

طول نموذج RSA بالبتات. كأفضل ممارسة، يجب أن يكون هذا على الأقل `2048`.

#### ‏`rsaHashedKeyGenParams.name` {#rsahashedkeygenparamsname}

**أضيف في: الإصدار v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون واحدًا من `'RSASSA-PKCS1-v1_5'` أو `'RSA-PSS'` أو `'RSA-OAEP'`.

#### ‏`rsaHashedKeyGenParams.publicExponent` {#rsahashedkeygenparamspublicexponent}

**أضيف في: الإصدار v15.0.0**

- النوع: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

أس RSA العام. يجب أن يكون هذا [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) يحتوي على عدد صحيح كبير النهاية وغير موقع يجب أن يتناسب مع 32 بت. قد يحتوي [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) على عدد عشوائي من البتات الصفرية البادئة. يجب أن تكون القيمة عددًا أوليًا. ما لم يكن هناك سبب لاستخدام قيمة مختلفة، استخدم `new Uint8Array([1, 0, 1])` (65537) كأس العام.


### الفئة: `RsaOaepParams` {#class-rsaoaepparams}

**أُضيفت في: v15.0.0**

#### `rsaOaepParams.label` {#rsaoaepparamslabel}

**أُضيفت في: v15.0.0**

- النوع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

مجموعة إضافية من البايتات التي لن يتم تشفيرها، ولكن سيتم ربطها بالنص المشفر الذي تم إنشاؤه.

المعلمة `rsaOaepParams.label` اختيارية.

#### `rsaOaepParams.name` {#rsaoaepparamsname}

**أُضيفت في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن تكون `'RSA-OAEP'`.

### الفئة: `RsaPssParams` {#class-rsapssparams}

**أُضيفت في: v15.0.0**

#### `rsaPssParams.name` {#rsapssparamsname}

**أُضيفت في: v15.0.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن تكون `'RSA-PSS'`.

#### `rsaPssParams.saltLength` {#rsapssparamssaltlength}

**أُضيفت في: v15.0.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

طول (بالبايت) الملح العشوائي المراد استخدامه.

## حواشي سفلية {#footnotes}

