---
title: توثيق Node.js - التشفير
description: توفر وحدة Crypto في Node.js وظائف تشفير تشمل مجموعة من التغليفات لوظائف OpenSSL مثل التجزئة، HMAC، التشفير، فك التشفير، التوقيع، والتحقق. تدعم مجموعة متنوعة من خوارزميات التشفير، واستخراج المفاتيح، والتوقيعات الرقمية، مما يمكن المطورين من تأمين البيانات والاتصالات داخل تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - التشفير | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة Crypto في Node.js وظائف تشفير تشمل مجموعة من التغليفات لوظائف OpenSSL مثل التجزئة، HMAC، التشفير، فك التشفير، التوقيع، والتحقق. تدعم مجموعة متنوعة من خوارزميات التشفير، واستخراج المفاتيح، والتوقيعات الرقمية، مما يمكن المطورين من تأمين البيانات والاتصالات داخل تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - التشفير | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة Crypto في Node.js وظائف تشفير تشمل مجموعة من التغليفات لوظائف OpenSSL مثل التجزئة، HMAC، التشفير، فك التشفير، التوقيع، والتحقق. تدعم مجموعة متنوعة من خوارزميات التشفير، واستخراج المفاتيح، والتوقيعات الرقمية، مما يمكن المطورين من تأمين البيانات والاتصالات داخل تطبيقات Node.js.
---


# Crypto {#crypto}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**الكود المصدري:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

توفر وحدة `node:crypto` وظائف تشفير تتضمن مجموعة من الأغلفة لوظائف التجزئة و HMAC والتشفير وفك التشفير والتوقيع والتحقق الخاصة بـ OpenSSL.

::: code-group
```js [ESM]
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```js [CJS]
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```
:::

## تحديد ما إذا كان دعم التشفير غير متاح {#determining-if-crypto-support-is-unavailable}

من الممكن إنشاء Node.js بدون تضمين دعم وحدة `node:crypto`. في مثل هذه الحالات ، ستؤدي محاولة `import` من `crypto` أو استدعاء `require('node:crypto')` إلى حدوث خطأ.

عند استخدام CommonJS ، يمكن التقاط الخطأ الذي تم إرجاعه باستخدام try/catch:

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
عند استخدام كلمة `import` المعجمية ESM ، لا يمكن التقاط الخطأ إلا إذا تم تسجيل معالج لـ `process.on('uncaughtException')` *قبل* أي محاولة لتحميل الوحدة النمطية (باستخدام ، على سبيل المثال ، وحدة تحميل مسبق).

عند استخدام ESM ، إذا كانت هناك فرصة لتشغيل التعليمات البرمجية على إصدار من Node.js حيث لم يتم تمكين دعم التشفير ، ففكر في استخدام الدالة [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) بدلاً من كلمة `import` المعجمية:

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## الصنف: `Certificate` {#class-certificate}

**أضيف في: v0.11.8**

SPKAC هي آلية طلب توقيع الشهادة تم تنفيذها في الأصل بواسطة Netscape وتم تحديدها رسميًا كجزء من عنصر `keygen` في HTML5.

تم إهمال `\<keygen\>` منذ [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) ولا ينبغي للمشاريع الجديدة استخدام هذا العنصر بعد الآن.

توفر الوحدة `node:crypto` الصنف `Certificate` للعمل مع بيانات SPKAC. الاستخدام الأكثر شيوعًا هو معالجة الإخراج الذي تم إنشاؤه بواسطة عنصر HTML5 `\<keygen\>`. يستخدم Node.js [تنفيذ SPKAC الخاص بـ OpenSSL](https://www.openssl.org/docs/man3.0/man1/openssl-spkac) داخليًا.

### الطريقة الثابتة: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن تكون وسيطة spkac عبارة عن ArrayBuffer. تم تقييد حجم وسيطة spkac بحد أقصى 2**31 - 1 بايت. |
| v9.0.0 | أضيف في: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `spkac`.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مكون التحدي في بنية بيانات `spkac` ، والذي يتضمن مفتاحًا عامًا وتحديًا.



::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// طباعة: التحدي كسلسلة UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// طباعة: التحدي كسلسلة UTF8
```
:::


### طريقة ثابتة: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | يمكن أن تكون وسيطة spkac هي ArrayBuffer. تم تحديد حجم وسيطة spkac بحد أقصى 2**31 - 1 بايت. |
| الإصدار 9.0.0 | تمت الإضافة في: الإصدار 9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `spkac`.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مكون المفتاح العام لهيكل البيانات `spkac`، والذي يتضمن مفتاحًا عامًا وتحديًا.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// طباعة: المفتاح العام كـ <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// طباعة: المفتاح العام كـ <Buffer ...>
```
:::

### طريقة ثابتة: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | يمكن أن تكون وسيطة spkac هي ArrayBuffer. تمت إضافة الترميز. تم تحديد حجم وسيطة spkac بحد أقصى 2**31 - 1 بايت. |
| الإصدار 9.0.0 | تمت الإضافة في: الإصدار 9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `spkac`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `صحيح` إذا كان هيكل بيانات `spkac` المعطى صالحًا، و `خطأ` خلاف ذلك.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// طباعة: صحيح أو خطأ
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// طباعة: صحيح أو خطأ
```
:::


### واجهة برمجة التطبيقات القديمة {#legacy-api}

::: danger [ثابت: 0 - مهمل]
[ثابت: 0](/ar/nodejs/api/documentation#stability-index) [الثبات: 0](/ar/nodejs/api/documentation#stability-index) - مهمل
:::

باعتبارها واجهة قديمة، من الممكن إنشاء مثيلات جديدة لفئة `crypto.Certificate` كما هو موضح في الأمثلة أدناه.

#### `new crypto.Certificate()` {#new-cryptocertificate}

يمكن إنشاء مثيلات لفئة `Certificate` باستخدام الكلمة المفتاحية `new` أو عن طريق استدعاء `crypto.Certificate()` كدالة:

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```js [CJS]
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```
:::

#### `certificate.exportChallenge(spkac[, encoding])` {#certificateexportchallengespkac-encoding}

**أضيف في: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [الترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) لسلسلة `spkac`.
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مكون التحدي في هيكل بيانات `spkac`، والذي يتضمن مفتاحًا عامًا وتحديًا.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// طباعة: التحدي كسلسلة UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// طباعة: التحدي كسلسلة UTF8
```
:::

#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**أُضيف في: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `spkac`.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مكون المفتاح العام في هيكل بيانات `spkac`، والذي يتضمن مفتاحًا عامًا وتحديًا.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// يطبع: المفتاح العام كـ <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// يطبع: المفتاح العام كـ <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**أُضيف في: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `spkac`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان هيكل بيانات `spkac` المعطى صالحًا، وإلا `false`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// يطبع: true أو false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// يطبع: true أو false
```
:::


## الفئة: `Cipher` {#class-cipher}

**تمت إضافتها في: v0.1.94**

- تمتد: [\<stream.Transform\>](/ar/nodejs/api/stream#class-streamtransform)

تُستخدم مثيلات الفئة `Cipher` لتشفير البيانات. يمكن استخدام الفئة بإحدى طريقتين:

- كـ [دفق](/ar/nodejs/api/stream) قابل للقراءة والكتابة، حيث تتم كتابة بيانات واضحة غير مشفرة لإنتاج بيانات مشفرة على الجانب القابل للقراءة، أو
- باستخدام الطرق [`cipher.update()`](/ar/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) و [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding) لإنتاج البيانات المشفرة.

يتم استخدام الطريقة [`crypto.createCipheriv()`](/ar/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) لإنشاء مثيلات `Cipher`. يجب عدم إنشاء كائنات `Cipher` مباشرةً باستخدام الكلمة الأساسية `new`.

مثال: استخدام كائنات `Cipher` كتدفقات:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```
:::

مثال: استخدام `Cipher` وتدفقات الأنابيب:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```
:::

مثال: استخدام الطرق [`cipher.update()`](/ar/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) و [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding):

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**تمت الإضافة في: الإصدار v0.1.94**

- `outputEncoding` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المرجعة.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أي محتويات مشفرة متبقية. إذا تم تحديد `outputEncoding`، فسيتم إرجاع سلسلة. إذا لم يتم توفير `outputEncoding`، فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

بمجرد استدعاء الطريقة `cipher.final()`، لا يمكن استخدام كائن `Cipher` لتشفير البيانات. ستؤدي محاولات استدعاء `cipher.final()` أكثر من مرة إلى حدوث خطأ.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**تمت الإضافة في: الإصدار v1.0.0**

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) عند استخدام وضع التشفير المصادق عليه (يتم دعم `GCM` و `CCM` و `OCB` و `chacha20-poly1305` حاليًا)، تُرجع الطريقة `cipher.getAuthTag()` [`Buffer`](/ar/nodejs/api/buffer) تحتوي على *علامة المصادقة* التي تم حسابها من البيانات المعطاة.

يجب استدعاء الطريقة `cipher.getAuthTag()` فقط بعد اكتمال التشفير باستخدام الطريقة [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding).

إذا تم تعيين الخيار `authTagLength` أثناء إنشاء مثيل `cipher`، فسترجع هذه الدالة بالضبط `authTagLength` بايت.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**تمت الإضافة في: الإصدار v1.0.0**

- `buffer` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` خيارات](/ar/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما يكون `buffer` سلسلة.


- الإرجاع: [\<Cipher\>](/ar/nodejs/api/crypto#class-cipher) نفس مثيل `Cipher` لتسلسل الطريقة.

عند استخدام وضع التشفير المصادق عليه (يتم دعم `GCM` و `CCM` و `OCB` و `chacha20-poly1305` حاليًا)، تحدد الطريقة `cipher.setAAD()` القيمة المستخدمة لمعامل إدخال *البيانات المصادق عليها الإضافية* (AAD).

الخيار `plaintextLength` اختياري لـ `GCM` و `OCB`. عند استخدام `CCM`، يجب تحديد الخيار `plaintextLength` ويجب أن تتطابق قيمته مع طول النص العادي بالبايت. انظر [وضع CCM](/ar/nodejs/api/crypto#ccm-mode).

يجب استدعاء الطريقة `cipher.setAAD()` قبل [`cipher.update()`](/ar/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding).


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**أضيف في: الإصدار 0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
- الإرجاع: [\<Cipher\>](/ar/nodejs/api/crypto#class-cipher) نفس نسخة `Cipher` لتسلسل العمليات.

عند استخدام خوارزميات تشفير الكتل، ستضيف فئة `Cipher` تلقائيًا حشوًا إلى بيانات الإدخال لتتناسب مع حجم الكتلة المناسب. لتعطيل الحشو الافتراضي، استدعِ `cipher.setAutoPadding(false)`.

عندما تكون قيمة `autoPadding` هي `false`، يجب أن يكون طول بيانات الإدخال بأكملها من مضاعفات حجم كتلة التشفير أو سيرمي [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding) خطأً. تعطيل الحشو التلقائي مفيد للحشو غير القياسي، على سبيل المثال استخدام `0x0` بدلاً من حشو PKCS.

يجب استدعاء طريقة `cipher.setAutoPadding()` قبل [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding).

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| الإصدار 0.1.94 | أضيف في: الإصدار 0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) البيانات.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) قيمة الإرجاع.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم بتحديث الشيفرة باستخدام `data`. إذا تم توفير وسيطة `inputEncoding`، فإن وسيطة `data` هي سلسلة تستخدم التشفير المحدد. إذا لم يتم توفير وسيطة `inputEncoding`، فيجب أن تكون `data` إما [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`. إذا كانت `data` هي [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`، فسيتم تجاهل `inputEncoding`.

تحدد `outputEncoding` تنسيق الإخراج للبيانات المشفرة. إذا تم تحديد `outputEncoding`، فسيتم إرجاع سلسلة تستخدم التشفير المحدد. إذا لم يتم توفير `outputEncoding`، فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

يمكن استدعاء طريقة `cipher.update()` عدة مرات ببيانات جديدة حتى يتم استدعاء [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding). سيؤدي استدعاء `cipher.update()` بعد [`cipher.final()`](/ar/nodejs/api/crypto#cipherfinaloutputencoding) إلى حدوث خطأ.


## الفئة: `Decipher` {#class-decipher}

**أضيف في: v0.1.94**

- يمتد: [\<stream.Transform\>](/ar/nodejs/api/stream#class-streamtransform)

تُستخدم مثيلات الفئة `Decipher` لفك تشفير البيانات. يمكن استخدام الفئة بإحدى طريقتين:

- كـ [تدفق](/ar/nodejs/api/stream) قابل للقراءة والكتابة، حيث تتم كتابة البيانات المشفرة العادية لإنتاج بيانات غير مشفرة على الجانب القابل للقراءة، أو
- باستخدام الأسلوبين [`decipher.update()`](/ar/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) و [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding) لإنتاج البيانات غير المشفرة.

يتم استخدام الأسلوب [`crypto.createDecipheriv()`](/ar/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) لإنشاء مثيلات `Decipher`. لا يجوز إنشاء كائنات `Decipher` مباشرةً باستخدام الكلمة الأساسية `new`.

مثال: استخدام كائنات `Decipher` كتدفقات:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

مثال: استخدام `Decipher` وتدفقات الأنابيب:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

مثال: استخدام الأسلوبين [`decipher.update()`](/ar/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) و [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding):

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```
:::

### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**أُضيف في: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز [\<encoding\>](/ar/nodejs/api/buffer#buffers-and-character-encodings) للقيمة المعادة.
- يُعيد: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أي محتويات باقية تم فك تشفيرها. إذا تم تحديد `outputEncoding`، فسيتم إرجاع سلسلة نصية. إذا لم يتم توفير `outputEncoding`، فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

بمجرد استدعاء الدالة `decipher.final()`، لا يمكن استخدام الكائن `Decipher` لفك تشفير البيانات. ستؤدي محاولات استدعاء `decipher.final()` أكثر من مرة إلى حدوث خطأ.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن تكون وسيطة المخزن المؤقت سلسلة نصية أو ArrayBuffer ولا تتجاوز 2 ** 31 - 1 بايت. |
| v7.2.0 | تُعيد هذه الدالة الآن مرجعًا إلى `decipher`. |
| v1.0.0 | أُضيف في: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات [`stream.transform`](/ar/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة النصية المراد استخدامه عندما تكون `buffer` سلسلة نصية.

- يُعيد: [\<Decipher\>](/ar/nodejs/api/crypto#class-decipher) نفس Decipher لسلسلة الدوال.

عند استخدام وضع تشفير مصادق عليه (يتم دعم `GCM` و `CCM` و `OCB` و `chacha20-poly1305` حاليًا)، تحدد الدالة `decipher.setAAD()` القيمة المستخدمة لمعامل الإدخال *بيانات المصادقة الإضافية* (AAD).

وسيطة `options` اختيارية لـ `GCM`. عند استخدام `CCM`، يجب تحديد خيار `plaintextLength` ويجب أن تتطابق قيمته مع طول النص المشفر بالبايت. انظر [وضع CCM](/ar/nodejs/api/crypto#ccm-mode).

يجب استدعاء الدالة `decipher.setAAD()` قبل [`decipher.update()`](/ar/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding).

عند تمرير سلسلة نصية كوسيطة `buffer`، يرجى مراعاة [المحاذير عند استخدام السلاسل النصية كمدخلات لواجهات برمجة تطبيقات التشفير](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | استخدام أطوال علامات GCM بخلاف 128 بت بدون تحديد خيار `authTagLength` عند إنشاء `decipher` أصبح مهجورًا. |
| v15.0.0 | يمكن أن يكون وسيطة buffer عبارة عن سلسلة أو ArrayBuffer وتقتصر على عدم تجاوز 2 ** 31 - 1 بايت. |
| v11.0.0 | يطرح هذا الأسلوب الآن إذا كان طول علامة GCM غير صالح. |
| v7.2.0 | يُرجع هذا الأسلوب الآن مرجعًا إلى `decipher`. |
| v1.0.0 | تمت إضافته في: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما تكون `buffer` سلسلة.
- الإرجاع: [\<Decipher\>](/ar/nodejs/api/crypto#class-decipher) نفس Decipher لتسلسل الأساليب.

عند استخدام وضع تشفير مصادق عليه (يتم دعم `GCM` و `CCM` و `OCB` و `chacha20-poly1305` حاليًا)، يتم استخدام الأسلوب `decipher.setAuthTag()` لتمرير *علامة المصادقة* المستلمة. إذا لم يتم توفير أي علامة، أو إذا تم العبث بالنص المشفر، فسيتم طرح [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding)، مما يشير إلى أنه يجب التخلص من النص المشفر بسبب فشل المصادقة. إذا كان طول العلامة غير صالح وفقًا لـ [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) أو لا يتطابق مع قيمة خيار `authTagLength`، فسيتم طرح `decipher.setAuthTag()` خطأ.

يجب استدعاء الأسلوب `decipher.setAuthTag()` قبل [`decipher.update()`](/ar/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) لوضع `CCM` أو قبل [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding) لأوضاع `GCM` و `OCB` و `chacha20-poly1305`. يمكن استدعاء `decipher.setAuthTag()` مرة واحدة فقط.

عند تمرير سلسلة كعلامة مصادقة، يرجى مراعاة [المحاذير عند استخدام السلاسل كمدخلات إلى واجهات برمجة التطبيقات المشفرة](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**إضافة في: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `true`
- الإرجاع: [\<Decipher\>](/ar/nodejs/api/crypto#class-decipher) نفس Decipher لتسلسل العمليات.

عندما يتم تشفير البيانات بدون حشو الكتلة القياسي، فإن استدعاء `decipher.setAutoPadding(false)` سيعطل الحشو التلقائي لمنع [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding) من التحقق من الحشو وإزالته.

تعطيل الحشو التلقائي سيعمل فقط إذا كان طول بيانات الإدخال مضاعفًا لحجم كتلة التشفير.

يجب استدعاء الطريقة `decipher.setAutoPadding()` قبل [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding).

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| v0.1.94 | إضافة في: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `data`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المرجعة.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم بتحديث فك التشفير باستخدام `data`. إذا تم إعطاء وسيطة `inputEncoding`، فإن وسيطة `data` هي سلسلة تستخدم الترميز المحدد. إذا لم يتم إعطاء وسيطة `inputEncoding`، فيجب أن تكون `data` هي [`Buffer`](/ar/nodejs/api/buffer). إذا كانت `data` هي [`Buffer`](/ar/nodejs/api/buffer) فسيتم تجاهل `inputEncoding`.

يحدد `outputEncoding` تنسيق الإخراج للبيانات المشفرة. إذا تم تحديد `outputEncoding`، فسيتم إرجاع سلسلة تستخدم الترميز المحدد. إذا لم يتم توفير `outputEncoding`، فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

يمكن استدعاء الطريقة `decipher.update()` عدة مرات مع بيانات جديدة حتى يتم استدعاء [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding). سيؤدي استدعاء `decipher.update()` بعد [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding) إلى ظهور خطأ.

حتى إذا كان التشفير الأساسي ينفذ المصادقة، فقد تكون أصالة وسلامة النص الواضح الذي يتم إرجاعه من هذه الوظيفة غير مؤكدة في هذا الوقت. بالنسبة لخوارزميات التشفير المصادق عليها، يتم عادةً إثبات الأصالة فقط عندما يستدعي التطبيق [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding).


## الفئة: `DiffieHellman` {#class-diffiehellman}

**أُضيفت في: الإصدار v0.5.0**

الفئة `DiffieHellman` هي أداة لإنشاء تبادلات مفاتيح ديفي-هيلمان.

يمكن إنشاء مثيلات للفئة `DiffieHellman` باستخدام الدالة [`crypto.createDiffieHellman()`](/ar/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```js [CJS]
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**أُضيفت في: الإصدار v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [الترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) لسلسلة `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [الترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) للقيمة المعادة.
- تُعيد: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تحسب السر المشترك باستخدام `otherPublicKey` كمفتاح عام للطرف الآخر وتُعيد السر المشترك المحسوب. يتم تفسير المفتاح المُزوّد باستخدام `inputEncoding` المحدد، ويتم ترميز السر باستخدام `outputEncoding` المحدد. إذا لم يتم توفير `inputEncoding`، فمن المتوقع أن يكون `otherPublicKey` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

إذا تم إعطاء `outputEncoding` سلسلة، فسيتم إرجاع سلسلة؛ وإلا، فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**تمت الإضافة في: الإصدار v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المرجعة.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم بإنشاء قيم مفاتيح Diffie-Hellman الخاصة والعامة ما لم يتم إنشاؤها أو حسابها بالفعل، ويعيد المفتاح العام في `encoding` المحدد. يجب نقل هذا المفتاح إلى الطرف الآخر. إذا تم توفير `encoding`، يتم إرجاع سلسلة؛ وإلا يتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

هذه الدالة عبارة عن غلاف بسيط حول [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). على وجه الخصوص، بمجرد إنشاء أو تعيين مفتاح خاص، فإن استدعاء هذه الدالة يقوم فقط بتحديث المفتاح العام ولكن لا يقوم بإنشاء مفتاح خاص جديد.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**تمت الإضافة في: الإصدار v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المرجعة.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع مولد Diffie-Hellman في `encoding` المحدد. إذا تم توفير `encoding`، يتم إرجاع سلسلة؛ وإلا يتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**تمت الإضافة في: الإصدار v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المرجعة.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع عدد Diffie-Hellman الأولي في `encoding` المحدد. إذا تم توفير `encoding`، يتم إرجاع سلسلة؛ وإلا يتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**إضافة في: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The [encoding](/ar/nodejs/api/buffer#buffers-and-character-encodings) لقيمة الإرجاع.
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع المفتاح الخاص بـ Diffie-Hellman بالتشفير `encoding` المحدد. إذا تم توفير `encoding`، فسيتم إرجاع سلسلة نصية؛ وإلا فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**إضافة في: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The [encoding](/ar/nodejs/api/buffer#buffers-and-character-encodings) لقيمة الإرجاع.
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع المفتاح العام بـ Diffie-Hellman بالتشفير `encoding` المحدد. إذا تم توفير `encoding`، فسيتم إرجاع سلسلة نصية؛ وإلا فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**إضافة في: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The [encoding](/ar/nodejs/api/buffer#buffers-and-character-encodings) لسلسلة `privateKey`.

يضبط المفتاح الخاص بـ Diffie-Hellman. إذا تم توفير وسيط `encoding`، فمن المتوقع أن تكون `privateKey` سلسلة نصية. إذا لم يتم توفير `encoding`، فمن المتوقع أن تكون `privateKey` [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

لا تحسب هذه الدالة تلقائيًا المفتاح العام المرتبط. يمكن استخدام إما [`diffieHellman.setPublicKey()`](/ar/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) أو [`diffieHellman.generateKeys()`](/ar/nodejs/api/crypto#diffiehellmangeneratekeysencoding) لتوفير المفتاح العام يدويًا أو لاشتقاقه تلقائيًا.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**تمت إضافته في: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `publicKey`.

تعيين المفتاح العام لـ Diffie-Hellman. إذا تم توفير وسيطة `encoding`، فمن المتوقع أن تكون `publicKey` سلسلة. إذا لم يتم توفير `encoding`، فمن المتوقع أن تكون `publicKey` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**تمت إضافته في: v0.11.12**

حقل بت يحتوي على أي تحذيرات و/أو أخطاء ناتجة عن فحص تم إجراؤه أثناء تهيئة كائن `DiffieHellman`.

القيم التالية صالحة لهذه الخاصية (كما هو محدد في وحدة `node:constants`):

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## صنف: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**تمت إضافته في: v0.7.5**

يأخذ صنف `DiffieHellmanGroup` مجموعة modp معروفة كمعامل له. إنه يعمل بنفس طريقة `DiffieHellman`، باستثناء أنه لا يسمح بتغيير مفاتيحه بعد الإنشاء. بمعنى آخر، فإنه لا ينفذ طرق `setPublicKey()` أو `setPrivateKey()`.

::: code-group
```js [ESM]
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```js [CJS]
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```
:::

المجموعات التالية مدعومة:

- `'modp14'` (2048 بت، [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) القسم 3)
- `'modp15'` (3072 بت، [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) القسم 4)
- `'modp16'` (4096 بت، [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) القسم 5)
- `'modp17'` (6144 بت، [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) القسم 6)
- `'modp18'` (8192 بت، [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) القسم 7)

المجموعات التالية لا تزال مدعومة ولكنها مهملة (انظر [المحاذير](/ar/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)):

- `'modp1'` (768 بت، [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) القسم 6.1)
- `'modp2'` (1024 بت، [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) القسم 6.2)
- `'modp5'` (1536 بت، [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) القسم 2)

قد تتم إزالة هذه المجموعات المهملة في الإصدارات المستقبلية من Node.js.


## الفئة: `ECDH` {#class-ecdh}

**أُضيف في: الإصدار v0.11.14**

الفئة `ECDH` هي أداة لإنشاء عمليات تبادل مفاتيح Diffie-Hellman للمنحنى الإهليلجي (ECDH).

يمكن إنشاء مثيلات للفئة `ECDH` باستخدام الدالة [`crypto.createECDH()`](/ar/nodejs/api/crypto#cryptocreateecdhcurvename).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// إنشاء مفاتيح أليس...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// إنشاء مفاتيح بوب...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// تبادل وإنشاء السر...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// موافق
```

```js [CJS]
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// إنشاء مفاتيح أليس...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// إنشاء مفاتيح بوب...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// تبادل وإنشاء السر...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// موافق
```
:::

### طريقة ثابتة: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**أُضيف في: الإصدار v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `key`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المُرجَعة.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'uncompressed'`
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحوّل مفتاح EC Diffie-Hellman العام المحدد بواسطة `key` و `curve` إلى التنسيق المحدد بواسطة `format`. تحدد الوسيطة `format` ترميز النقطة ويمكن أن تكون `'compressed'` أو `'uncompressed'` أو `'hybrid'`. يتم تفسير المفتاح المقدم باستخدام `inputEncoding` المحدد، ويتم ترميز المفتاح المُرجع باستخدام `outputEncoding` المحدد.

استخدم [`crypto.getCurves()`](/ar/nodejs/api/crypto#cryptogetcurves) للحصول على قائمة بأسماء المنحنيات المتاحة. في إصدارات OpenSSL الحديثة، سيعرض `openssl ecparam -list_curves` أيضًا اسم ووصف كل منحنى إهليلجي متاح.

إذا لم يتم تحديد `format`، فسيتم إرجاع النقطة بتنسيق `'uncompressed'`.

إذا لم يتم توفير `inputEncoding`، فمن المتوقع أن يكون `key` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

مثال (فك ضغط مفتاح):

::: code-group
```js [ESM]
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// يجب أن يكون المفتاح المحول والمفتاح العام غير المضغوط متماثلين
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```js [CJS]
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// يجب أن يكون المفتاح المحول والمفتاح العام غير المضغوط متماثلين
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تم تغيير تنسيق الخطأ لدعم خطأ المفتاح العام غير الصالح بشكل أفضل. |
| v6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| v0.11.14 | تمت إضافته في: v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) لسلسلة `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) للقيمة المرجعة.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

لحساب السر المشترك باستخدام `otherPublicKey` كمفتاح عام للطرف الآخر وإرجاع السر المشترك المحسوب. يتم تفسير المفتاح المقدم باستخدام `inputEncoding` المحدد، ويتم ترميز السر المرتجع باستخدام `outputEncoding` المحدد. إذا لم يتم توفير `inputEncoding`، فمن المتوقع أن يكون `otherPublicKey` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

إذا تم إعطاء `outputEncoding` سلسلة، فسيتم إرجاعها؛ وإلا سيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

سيؤدي `ecdh.computeSecret` إلى ظهور خطأ `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` عندما يقع `otherPublicKey` خارج المنحنى الإهليلجي. نظرًا لأن `otherPublicKey` يتم توفيره عادةً من مستخدم بعيد عبر شبكة غير آمنة، فتأكد من التعامل مع هذا الاستثناء وفقًا لذلك.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**تمت الإضافة في: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) قيمة الإرجاع.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'uncompressed'`
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم بإنشاء قيم مفاتيح تبادل مفتاح ديفي-هيلمان (EC Diffie-Hellman) الخاصة والعامة، ويعيد المفتاح العام بالتنسيق `format` والترميز `encoding` المحددين. يجب نقل هذا المفتاح إلى الطرف الآخر.

تحدد وسيطة `format` ترميز النقطة ويمكن أن تكون `'compressed'` أو `'uncompressed'`. إذا لم يتم تحديد `format`، فستتم إعادة النقطة بتنسيق `'uncompressed'`.

إذا تم توفير `encoding`، فسيتم إرجاع سلسلة؛ وإلا سيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**تمت الإضافة في: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) قيمة الإرجاع.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تبادل مفتاح ديفي-هيلمان (EC Diffie-Hellman) بالترميز `encoding` المحدد.

إذا تم تحديد `encoding`، فسيتم إرجاع سلسلة؛ وإلا سيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**تمت الإضافة في: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) قيمة الإرجاع.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'uncompressed'`
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المفتاح العام لتبادل مفتاح ديفي-هيلمان (EC Diffie-Hellman) بالترميز `encoding` والتنسيق `format` المحددين.

تحدد وسيطة `format` ترميز النقطة ويمكن أن تكون `'compressed'` أو `'uncompressed'`. إذا لم يتم تحديد `format`، فستتم إعادة النقطة بتنسيق `'uncompressed'`.

إذا تم تحديد `encoding`، فسيتم إرجاع سلسلة؛ وإلا سيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**أُضيف في: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `privateKey`.

يُعيِّن مفتاح EC Diffie-Hellman الخاص. إذا تم توفير `encoding`، فمن المتوقع أن تكون `privateKey` سلسلة؛ وإلا، فمن المتوقع أن تكون `privateKey` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

إذا لم يكن `privateKey` صالحًا للمنحنى المحدد عند إنشاء كائن `ECDH`، فسيتم طرح خطأ. عند تعيين المفتاح الخاص، يتم أيضًا إنشاء النقطة (المفتاح) العامة المرتبطة وتعيينها في كائن `ECDH`.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**أُضيف في: v0.11.14**

**تم إهماله منذ: v5.2.0**

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `publicKey`.

يُعيِّن المفتاح العام لـ EC Diffie-Hellman. إذا تم توفير `encoding`، فمن المتوقع أن تكون `publicKey` سلسلة؛ وإلا، فمن المتوقع أن تكون [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

ليس هناك عادةً سبب لاستدعاء هذه الطريقة لأن `ECDH` يتطلب فقط مفتاحًا خاصًا والمفتاح العام للطرف الآخر لحساب السر المشترك. عادةً ما يتم استدعاء [`ecdh.generateKeys()`](/ar/nodejs/api/crypto#ecdhgeneratekeysencoding-format) أو [`ecdh.setPrivateKey()`](/ar/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding). تحاول الطريقة [`ecdh.setPrivateKey()`](/ar/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) إنشاء النقطة/المفتاح العام المرتبط بالمفتاح الخاص الذي يتم تعيينه.

مثال (الحصول على سر مشترك):

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// هذه طريقة مختصرة لتحديد أحد المفاتيح الخاصة السابقة لأليس.
// سيكون من غير الحكمة استخدام مثل هذا المفتاح الخاص الذي يمكن التنبؤ به في تطبيق حقيقي.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// يستخدم بوب زوج مفاتيح تم إنشاؤه حديثًا وقويًا من الناحية التشفيرية
// شبه عشوائي
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// يجب أن تكون aliceSecret و bobSecret هي نفس قيمة السر المشترك
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// هذه طريقة مختصرة لتحديد أحد المفاتيح الخاصة السابقة لأليس.
// سيكون من غير الحكمة استخدام مثل هذا المفتاح الخاص الذي يمكن التنبؤ به في تطبيق حقيقي.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// يستخدم بوب زوج مفاتيح تم إنشاؤه حديثًا وقويًا من الناحية التشفيرية
// شبه عشوائي
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// يجب أن تكون aliceSecret و bobSecret هي نفس قيمة السر المشترك
console.log(aliceSecret === bobSecret);
```
:::


## الفئة: `Hash` {#class-hash}

**تمت إضافتها في: الإصدار v0.1.92**

- توسع: [\<stream.Transform\>](/ar/nodejs/api/stream#class-streamtransform)

الفئة `Hash` هي أداة لإنشاء ملخصات تجزئة للبيانات. يمكن استخدامها بإحدى طريقتين:

- كـ [تدفق](/ar/nodejs/api/stream) قابل للقراءة والكتابة، حيث تتم كتابة البيانات لإنتاج ملخص تجزئة محسوب على الجانب القابل للقراءة، أو
- باستخدام الأسلوبين [`hash.update()`](/ar/nodejs/api/crypto#hashupdatedata-inputencoding) و [`hash.digest()`](/ar/nodejs/api/crypto#hashdigestencoding) لإنتاج التجزئة المحسوبة.

يتم استخدام الأسلوب [`crypto.createHash()`](/ar/nodejs/api/crypto#cryptocreatehashalgorithm-options) لإنشاء مثيلات `Hash`. لا يجوز إنشاء كائنات `Hash` مباشرة باستخدام الكلمة المفتاحية `new`.

مثال: استخدام كائنات `Hash` كتدفقات:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // سيتم إنتاج عنصر واحد فقط بواسطة
  // تدفق التجزئة.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // يطبع:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // سيتم إنتاج عنصر واحد فقط بواسطة
  // تدفق التجزئة.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // يطبع:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

مثال: استخدام `Hash` وتدفقات الأنابيب:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```
:::

مثال: استخدام الأسلوبين [`hash.update()`](/ar/nodejs/api/crypto#hashupdatedata-inputencoding) و [`hash.digest()`](/ar/nodejs/api/crypto#hashdigestencoding):

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// يطبع:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// يطبع:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**أُضيف في: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` خيارات](/ar/nodejs/api/stream#new-streamtransformoptions)
- الإرجاع: [\<Hash\>](/ar/nodejs/api/crypto#class-hash)

ينشئ كائن `Hash` جديد يحتوي على نسخة طبق الأصل وعميقة للحالة الداخلية لكائن `Hash` الحالي.

تتحكم وسيطة `options` الاختيارية في سلوك التدفق. بالنسبة لوظائف تجزئة XOF مثل `'shake256'`، يمكن استخدام خيار `outputLength` لتحديد طول الإخراج المطلوب بالبايت.

يتم طرح خطأ عند محاولة نسخ كائن `Hash` بعد استدعاء التابع [`hash.digest()`](/ar/nodejs/api/crypto#hashdigestencoding) الخاص به.



::: code-group
```js [ESM]
// حساب تجزئة متجددة.
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// إلخ.
```

```js [CJS]
// حساب تجزئة متجددة.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// إلخ.
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**أُضيف في: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المعادة.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحسب ملخص جميع البيانات التي تم تمريرها ليتم تجزئتها (باستخدام التابع [`hash.update()`](/ar/nodejs/api/crypto#hashupdatedata-inputencoding)). إذا تم توفير `encoding`، فسيتم إرجاع سلسلة؛ وإلا فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

لا يمكن استخدام كائن `Hash` مرة أخرى بعد استدعاء التابع `hash.digest()`. ستؤدي الاستدعاءات المتعددة إلى حدوث خطأ.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| الإصدار v0.1.92 | تمت إضافته في: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `data`.

يقوم بتحديث محتوى الهاش بالبيانات المعطاة `data`، والتي يتم تحديد ترميزها في `inputEncoding`. إذا لم يتم توفير `encoding` وكانت `data` سلسلة، فسيتم فرض ترميز `'utf8'`. إذا كانت `data` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`، فسيتم تجاهل `inputEncoding`.

يمكن استدعاء هذا عدة مرات ببيانات جديدة أثناء دفقها.

## الفئة: `Hmac` {#class-hmac}

**تمت الإضافة في: v0.1.94**

- يمتد: [\<stream.Transform\>](/ar/nodejs/api/stream#class-streamtransform)

الفئة `Hmac` هي أداة لإنشاء ملخصات HMAC مشفرة. يمكن استخدامه بإحدى طريقتين:

- كـ [دفق](/ar/nodejs/api/stream) قابل للقراءة والكتابة على حد سواء، حيث تتم كتابة البيانات لإنتاج ملخص HMAC محسوب على الجانب القابل للقراءة، أو
- باستخدام الأسلوبين [`hmac.update()`](/ar/nodejs/api/crypto#hmacupdatedata-inputencoding) و [`hmac.digest()`](/ar/nodejs/api/crypto#hmacdigestencoding) لإنتاج ملخص HMAC المحسوب.

يتم استخدام الأسلوب [`crypto.createHmac()`](/ar/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) لإنشاء مثيلات `Hmac`. لا يجوز إنشاء كائنات `Hmac` مباشرةً باستخدام الكلمة الأساسية `new`.

مثال: استخدام كائنات `Hmac` كدفق:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

مثال: استخدام `Hmac` ودفقات الأنابيب:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```
:::

مثال: استخدام الأسلوبين [`hmac.update()`](/ar/nodejs/api/crypto#hmacupdatedata-inputencoding) و [`hmac.digest()`](/ar/nodejs/api/crypto#hmacdigestencoding):

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::

### `hmac.digest([encoding])` {#hmacdigestencoding}

**أُضيف في: الإصدار v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المُعادة.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

لحساب ملخص HMAC لجميع البيانات التي تم تمريرها باستخدام [`hmac.update()`](/ar/nodejs/api/crypto#hmacupdatedata-inputencoding). إذا تم توفير `encoding`، فسيتم إرجاع سلسلة؛ وإلا فسيتم إرجاع [`Buffer`](/ar/nodejs/api/buffer)؛

لا يمكن استخدام كائن `Hmac` مرة أخرى بعد استدعاء `hmac.digest()`. ستؤدي المكالمات المتعددة لـ `hmac.digest()` إلى ظهور خطأ.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| v0.1.94 | أُضيف في: الإصدار v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `data`.

لتحديث محتوى `Hmac` بالبيانات `data` المُعطاة، والتي يتم تحديد تشفيرها في `inputEncoding`. إذا لم يتم توفير `encoding`، وكانت `data` سلسلة، فسيتم فرض تشفير `'utf8'`. إذا كانت `data` هي [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`، فسيتم تجاهل `inputEncoding`.

يمكن استدعاء هذا عدة مرات ببيانات جديدة أثناء تدفقها.

## الفئة: `KeyObject` {#class-keyobject}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.5.0, v12.19.0 | يمكن الآن تمرير مثيلات هذه الفئة إلى سلاسل العامل باستخدام `postMessage`. |
| v11.13.0 | يتم الآن تصدير هذه الفئة. |
| v11.6.0 | أُضيف في: الإصدار v11.6.0 |
:::

يستخدم Node.js فئة `KeyObject` لتمثيل مفتاح متماثل أو غير متماثل، ويكشف كل نوع من المفاتيح عن وظائف مختلفة. يتم استخدام الطرق [`crypto.createSecretKey()`](/ar/nodejs/api/crypto#cryptocreatesecretkeykey-encoding) و [`crypto.createPublicKey()`](/ar/nodejs/api/crypto#cryptocreatepublickeykey) و [`crypto.createPrivateKey()`](/ar/nodejs/api/crypto#cryptocreateprivatekeykey) لإنشاء مثيلات `KeyObject`. لا يجوز إنشاء كائنات `KeyObject` مباشرةً باستخدام الكلمة الأساسية `new`.

يجب على معظم التطبيقات التفكير في استخدام واجهة برمجة التطبيقات `KeyObject` الجديدة بدلاً من تمرير المفاتيح كسلاسل أو `Buffer`s نظرًا لميزات الأمان المحسّنة.

يمكن تمرير مثيلات `KeyObject` إلى سلاسل أخرى عبر [`postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist). يحصل المستلم على `KeyObject` مستنسخ، ولا يلزم إدراج `KeyObject` في وسيطة `transferList`.


### طريقة ثابتة: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**أُضيفت في: v15.0.0**

- `key` [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- الإرجاع: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)

مثال: تحويل نسخة `CryptoKey` إلى `KeyObject`:

::: code-group
```js [ESM]
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Prints: 32 (symmetric key size in bytes)
```

```js [CJS]
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.9.0 | كشف معلمات تسلسل `RSASSA-PSS-params` لمفاتيح RSA-PSS. |
| v15.7.0 | أُضيفت في: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم المفتاح بالبت (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) الأس العام (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم ملخص الرسالة (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم ملخص الرسالة المستخدم بواسطة MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأدنى لطول الملح بالبايت (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم `q` بالبت (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المنحنى (EC).

هذه الخاصية موجودة فقط على المفاتيح غير المتماثلة. اعتمادًا على نوع المفتاح، يحتوي هذا الكائن على معلومات حول المفتاح. لا يمكن استخدام أي من المعلومات التي تم الحصول عليها من خلال هذه الخاصية لتحديد مفتاح بشكل فريد أو لتعريض أمان المفتاح للخطر.

بالنسبة لمفاتيح RSA-PSS، إذا كانت مادة المفتاح تحتوي على تسلسل `RSASSA-PSS-params`، فسيتم تعيين خصائص `hashAlgorithm` و `mgf1HashAlgorithm` و `saltLength`.

قد يتم كشف تفاصيل المفتاح الأخرى عبر واجهة برمجة التطبيقات هذه باستخدام سمات إضافية.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.9.0, v12.17.0 | تمت إضافة دعم لـ `'dh'`. |
| v12.0.0 | تمت إضافة دعم لـ `'rsa-pss'`. |
| v12.0.0 | تُرجع هذه الخاصية الآن `undefined` لمثيل KeyObject من النوع غير المعروف بدلاً من الإجهاض. |
| v12.0.0 | تمت إضافة دعم لـ `'x25519'` و `'x448'`. |
| v12.0.0 | تمت إضافة دعم لـ `'ed25519'` و `'ed448'`. |
| v11.6.0 | أضيفت في: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

بالنسبة للمفاتيح غير المتماثلة، تمثل هذه الخاصية نوع المفتاح. أنواع المفاتيح المدعومة هي:

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

هذه الخاصية هي `undefined` لأنواع `KeyObject` غير المعروفة والمفاتيح المتماثلة.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**أضيفت في: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) كائن `KeyObject` للمقارنة مع `keyObject`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` أو `false` اعتمادًا على ما إذا كانت المفاتيح لها نفس النوع والقيمة والمعلمات تمامًا. هذه الطريقة ليست [وقتًا ثابتًا](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.9.0 | تمت إضافة دعم لتنسيق `'jwk'`. |
| v11.6.0 | أضيفت في: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

بالنسبة للمفاتيح المتماثلة، يمكن استخدام خيارات الترميز التالية:

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'buffer'` (افتراضي) أو `'jwk'`.

بالنسبة للمفاتيح العامة، يمكن استخدام خيارات الترميز التالية:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد `'pkcs1'` (RSA فقط) أو `'spki'`.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'pem'` أو `'der'` أو `'jwk'`.

بالنسبة للمفاتيح الخاصة، يمكن استخدام خيارات الترميز التالية:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون أحد `'pkcs1'` (RSA فقط) أو `'pkcs8'` أو `'sec1'` (EC فقط).
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'pem'` أو `'der'` أو `'jwk'`.
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تحديده، فسيتم تشفير المفتاح الخاص باستخدام `cipher` و `passphrase` المحدد باستخدام تشفير قائم على كلمة مرور PKCS#5 v2.0.
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) عبارة المرور المستخدمة للتشفير، راجع `cipher`.

يعتمد نوع النتيجة على تنسيق الترميز المحدد، عندما يكون PEM تكون النتيجة سلسلة، وعندما يكون DER فسيكون مخزنًا مؤقتًا يحتوي على البيانات المشفرة بتنسيق DER، وعندما يكون [JWK](https://tools.ietf.org/html/rfc7517) فسيكون كائنًا.

عندما تم تحديد تنسيق ترميز [JWK](https://tools.ietf.org/html/rfc7517)، يتم تجاهل جميع خيارات الترميز الأخرى.

يمكن تشفير مفاتيح نوع PKCS#1 و SEC1 و PKCS#8 باستخدام مجموعة من خياري `cipher` و `format`. يمكن استخدام `type` الخاص بـ PKCS#8 مع أي `format` لتشفير أي خوارزمية مفتاح (RSA أو EC أو DH) عن طريق تحديد `cipher`. لا يمكن تشفير PKCS#1 و SEC1 إلا عن طريق تحديد `cipher` عند استخدام `format` الخاص بـ PEM. لتحقيق أقصى قدر من التوافق، استخدم PKCS#8 للمفاتيح الخاصة المشفرة. نظرًا لأن PKCS#8 يحدد آلية التشفير الخاصة به، فإن تشفير مستوى PEM غير مدعوم عند تشفير مفتاح PKCS#8. راجع [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) لتشفير PKCS#8 و [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) لتشفير PKCS#1 و SEC1.


### ‏`keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**تمت الإضافة في: الإصدار v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

بالنسبة للمفاتيح السرية، يمثل هذا الخاصية حجم المفتاح بالبايت. هذه الخاصية `undefined` للمفاتيح غير المتماثلة.

### ‏`keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**تمت الإضافة في: الإصدار v23.0.0**

- ‏`algorithm`: [\<AlgorithmIdentifier\>](/ar/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/ar/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/ar/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/ar/nodejs/api/webcrypto#class-hmacimportparams)

- ‏`extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- ‏`keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) راجع [استخدامات المفاتيح](/ar/nodejs/api/webcrypto#cryptokeyusages).
- الإرجاع: [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)

يحول مثيل ‏`KeyObject` إلى ‏`CryptoKey`.

### ‏`keyObject.type` {#keyobjecttype}

**تمت الإضافة في: الإصدار v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اعتمادًا على نوع ‏`KeyObject` هذا، تكون هذه الخاصية إما `'secret'` للمفاتيح السرية (المتماثلة)، أو `'public'` للمفاتيح العامة (غير المتماثلة)، أو `'private'` للمفاتيح الخاصة (غير المتماثلة).

## الفئة: ‏`Sign` {#class-sign}

**تمت الإضافة في: الإصدار v0.1.92**

- يمتد: [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)

الفئة ‏`Sign` هي أداة لإنشاء التواقيع. يمكن استخدامه بإحدى طريقتين:

- كـ [تدفق](/ar/nodejs/api/stream) قابل للكتابة، حيث تتم كتابة البيانات المراد توقيعها ويتم استخدام الطريقة [`sign.sign()`](/ar/nodejs/api/crypto#signsignprivatekey-outputencoding) لإنشاء التوقيع وإرجاعه، أو
- باستخدام الطريقتين [`sign.update()`](/ar/nodejs/api/crypto#signupdatedata-inputencoding) و [`sign.sign()`](/ar/nodejs/api/crypto#signsignprivatekey-outputencoding) لإنتاج التوقيع.

يتم استخدام الطريقة [`crypto.createSign()`](/ar/nodejs/api/crypto#cryptocreatesignalgorithm-options) لإنشاء مثيلات ‏`Sign`. الوسيطة هي اسم سلسلة دالة التجزئة المراد استخدامها. لا يجوز إنشاء كائنات ‏`Sign` مباشرةً باستخدام الكلمة المفتاحية `new`.

مثال: استخدام كائنات ‏`Sign` و [`Verify`](/ar/nodejs/api/crypto#class-verify) كتدفقات:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```
:::

مثال: استخدام الطريقتين [`sign.update()`](/ar/nodejs/api/crypto#signupdatedata-inputencoding) و [`verify.update()`](/ar/nodejs/api/crypto#verifyupdatedata-inputencoding):

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```
:::


### `sign.sign(privateKey[, outputEncoding])` {#signsignprivatekey-outputencoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن يكون privateKey أيضًا ArrayBuffer و CryptoKey. |
| v13.2.0, v12.16.0 | تدعم هذه الوظيفة الآن توقيعات IEEE-P1363 DSA و ECDSA. |
| v12.0.0 | تدعم هذه الوظيفة الآن مفاتيح RSA-PSS. |
| v11.6.0 | تدعم هذه الوظيفة الآن كائنات المفاتيح. |
| v8.0.0 | تمت إضافة دعم RSASSA-PSS وخيارات إضافية. |
| v0.1.92 | تمت الإضافة في: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) القيمة المرجعة.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحسب التوقيع على جميع البيانات التي تم تمريرها باستخدام إما [`sign.update()`](/ar/nodejs/api/crypto#signupdatedata-inputencoding) أو [`sign.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback).

إذا لم يكن `privateKey` [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الوظيفة تتصرف كما لو تم تمرير `privateKey` إلى [`crypto.createPrivateKey()`](/ar/nodejs/api/crypto#cryptocreateprivatekeykey). إذا كان كائنًا، فيمكن تمرير الخصائص الإضافية التالية:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) بالنسبة إلى DSA و ECDSA، يحدد هذا الخيار تنسيق التوقيع الذي تم إنشاؤه. يمكن أن يكون واحدًا مما يلي:
    - `'der'` (افتراضي): هيكل توقيع ASN.1 المشفر DER الذي يشفر `(r, s)`.
    - `'ieee-p1363'`: تنسيق التوقيع `r || s` كما هو مقترح في IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الحشو الاختيارية لـ RSA، واحدة مما يلي:
    - `crypto.constants.RSA_PKCS1_PADDING` (افتراضي)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

سيستخدم `RSA_PKCS1_PSS_PADDING` MGF1 مع نفس دالة التجزئة المستخدمة لتوقيع الرسالة كما هو محدد في القسم 3.1 من [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)، ما لم يتم تحديد دالة تجزئة MGF1 كجزء من المفتاح وفقًا للقسم 3.3 من [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول الملح عندما يكون الحشو `RSA_PKCS1_PSS_PADDING`. القيمة الخاصة `crypto.constants.RSA_PSS_SALTLEN_DIGEST` تعين طول الملح إلى حجم الملخص، `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (افتراضي) يعينه إلى القيمة القصوى المسموح بها.

إذا تم توفير `outputEncoding`، فسيتم إرجاع سلسلة؛ وإلا يتم إرجاع [`Buffer`](/ar/nodejs/api/buffer).

لا يمكن استخدام كائن `Sign` مرة أخرى بعد استدعاء طريقة `sign.sign()`. ستؤدي الاستدعاءات المتعددة لـ `sign.sign()` إلى حدوث خطأ.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| v0.1.92 | تمت الإضافة في: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `data`.

يقوم بتحديث محتوى `Sign` بالبيانات `data` المحددة، والتي يتم تحديد تشفيرها في `inputEncoding`. إذا لم يتم توفير `encoding`، وكانت `data` عبارة عن سلسلة، فسيتم فرض تشفير `'utf8'`. إذا كانت `data` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`، فسيتم تجاهل `inputEncoding`.

يمكن استدعاء هذا عدة مرات ببيانات جديدة أثناء تدفقها.

## الفئة: `Verify` {#class-verify}

**تمت الإضافة في: v0.1.92**

- يمتد: [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)

الفئة `Verify` هي أداة للتحقق من التوقيعات. يمكن استخدامه بإحدى طريقتين:

- كـ [تدفق](/ar/nodejs/api/stream) قابل للكتابة حيث تُستخدم البيانات المكتوبة للتحقق من صحة التوقيع المقدم، أو
- باستخدام الطرق [`verify.update()`](/ar/nodejs/api/crypto#verifyupdatedata-inputencoding) و [`verify.verify()`](/ar/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) للتحقق من التوقيع.

تُستخدم الطريقة [`crypto.createVerify()`](/ar/nodejs/api/crypto#cryptocreateverifyalgorithm-options) لإنشاء مثيلات `Verify`. لا يجوز إنشاء كائنات `Verify` مباشرةً باستخدام الكلمة الأساسية `new`.

انظر [`Sign`](/ar/nodejs/api/crypto#class-sign) للأمثلة.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | تم تغيير `inputEncoding` الافتراضي من `binary` إلى `utf8`. |
| v0.1.92 | تمت الإضافة في: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `data`.

يقوم بتحديث محتوى `Verify` بالبيانات `data` المحددة، والتي يتم تحديد تشفيرها في `inputEncoding`. إذا لم يتم توفير `inputEncoding`، وكانت `data` عبارة عن سلسلة، فسيتم فرض تشفير `'utf8'`. إذا كانت `data` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`، فسيتم تجاهل `inputEncoding`.

يمكن استدعاء هذا عدة مرات ببيانات جديدة أثناء تدفقها.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن يكون الكائن أيضًا ArrayBuffer و CryptoKey. |
| v13.2.0, v12.16.0 | تدعم هذه الدالة الآن تواقيع IEEE-P1363 DSA و ECDSA. |
| v12.0.0 | تدعم هذه الدالة الآن مفاتيح RSA-PSS. |
| v11.7.0 | يمكن أن يكون المفتاح الآن مفتاحًا خاصًا. |
| v8.0.0 | تمت إضافة دعم لـ RSASSA-PSS وخيارات إضافية. |
| v0.1.92 | تمت الإضافة في: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [تشفير](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `signature`.
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` أو `false` اعتمادًا على صلاحية التوقيع للبيانات والمفتاح العام.

للتحقق من البيانات المقدمة باستخدام `object` و `signature` المحددتين.

إذا لم يكن `object` هو [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، تتصرف هذه الدالة كما لو تم تمرير `object` إلى [`crypto.createPublicKey()`](/ar/nodejs/api/crypto#cryptocreatepublickeykey). إذا كان كائنًا، يمكن تمرير الخصائص الإضافية التالية:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) بالنسبة لـ DSA و ECDSA، يحدد هذا الخيار تنسيق التوقيع. يمكن أن يكون أحد ما يلي:
    - `'der'` (افتراضي): بنية توقيع ASN.1 المشفرة بـ DER لتشفير `(r, s)`.
    - `'ieee-p1363'`: تنسيق التوقيع `r || s` كما هو مقترح في IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الحشو الاختيارية لـ RSA، إحدى القيم التالية:
    - `crypto.constants.RSA_PKCS1_PADDING` (افتراضي)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

سيستخدم `RSA_PKCS1_PSS_PADDING` MGF1 مع نفس دالة التجزئة المستخدمة للتحقق من الرسالة كما هو محدد في القسم 3.1 من [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt)، ما لم يتم تحديد دالة تجزئة MGF1 كجزء من المفتاح بما يتوافق مع القسم 3.3 من [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول الملح عندما يكون الحشو `RSA_PKCS1_PSS_PADDING`. تحدد القيمة الخاصة `crypto.constants.RSA_PSS_SALTLEN_DIGEST` طول الملح لحجم الملخص، `crypto.constants.RSA_PSS_SALTLEN_AUTO` (افتراضي) يتسبب في تحديده تلقائيًا.

الوسيطة `signature` هي التوقيع المحسوب مسبقًا للبيانات، في `signatureEncoding`. إذا تم تحديد `signatureEncoding`، فمن المتوقع أن يكون `signature` سلسلة؛ وإلا فمن المتوقع أن يكون `signature` عبارة عن [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

لا يمكن استخدام كائن `verify` مرة أخرى بعد استدعاء `verify.verify()`. ستؤدي المكالمات المتعددة إلى `verify.verify()` إلى حدوث خطأ.

نظرًا لأنه يمكن اشتقاق المفاتيح العامة من المفاتيح الخاصة، يمكن تمرير مفتاح خاص بدلاً من مفتاح عام.


## الفئة: `X509Certificate` {#class-x509certificate}

**تمت إضافتها في: الإصدار 15.6.0**

تغلف شهادة X509 وتوفر وصولًا للقراءة فقط إلى معلوماتها.

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... شهادة مشفرة بتنسيق pem ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... شهادة مشفرة بتنسيق pem ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**تمت إضافتها في: الإصدار 15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) شهادة X509 مشفرة بتنسيق PEM أو DER.

### `x509.ca` {#x509ca}

**تمت إضافتها في: الإصدار 15.6.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سيكون `true` إذا كانت هذه شهادة سلطة مصدقة (CA).

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | خيار الموضوع يعتمد الآن على `'default'`. |
| الإصدار 17.5.0, الإصدار 16.15.0 | يمكن الآن تعيين خيار الموضوع إلى `'default'`. |
| الإصدار 17.5.0, الإصدار 16.14.1 | تمت إزالة خيارات `wildcards` و `partialWildcards` و `multiLabelWildcards` و `singleLabelSubdomains` لأنها لم يكن لها أي تأثير. |
| الإصدار 15.6.0 | تمت إضافتها في: الإصدار 15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`، أو `'always'`، أو `'never'`. **الافتراضي:** `'default'`.

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) تُرجع `email` إذا كانت الشهادة متطابقة، و `undefined` إذا لم تكن كذلك.

تتحقق مما إذا كانت الشهادة تطابق عنوان البريد الإلكتروني المحدد.

إذا كان خيار `'subject'` غير محدد أو تم تعيينه على `'default'`، فسيتم أخذ موضوع الشهادة في الاعتبار فقط إذا كان ملحق اسم الموضوع البديل إما غير موجود أو لا يحتوي على أي عناوين بريد إلكتروني.

إذا تم تعيين خيار `'subject'` على `'always'` وإذا كان ملحق اسم الموضوع البديل إما غير موجود أو لا يحتوي على عنوان بريد إلكتروني مطابق، فسيتم أخذ موضوع الشهادة في الاعتبار.

إذا تم تعيين خيار `'subject'` على `'never'`، فلن يتم أخذ موضوع الشهادة في الاعتبار أبدًا، حتى إذا كانت الشهادة لا تحتوي على أي أسماء موضوع بديلة.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | تم تعيين خيار الموضوع الآن على `'default'` افتراضيًا. |
| v17.5.0, v16.15.0 | يمكن الآن تعيين خيار الموضوع على `'default'`. |
| v15.6.0 | تمت الإضافة في: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'` أو `'always'` أو `'never'`. **افتراضي:** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`.


- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) يُرجع اسم موضوع يطابق `name` ، أو `undefined` إذا لم يتطابق أي اسم موضوع مع `name`.

للتحقق مما إذا كانت الشهادة تطابق اسم المضيف المحدد.

إذا كانت الشهادة تطابق اسم المضيف المحدد، فسيتم إرجاع اسم الموضوع المطابق. قد يكون الاسم الذي تم إرجاعه مطابقًا تمامًا (على سبيل المثال، `foo.example.com`) أو قد يحتوي على أحرف بدل (على سبيل المثال، `*.example.com`). نظرًا لأن مقارنات اسم المضيف غير حساسة لحالة الأحرف، فقد يختلف اسم الموضوع الذي تم إرجاعه أيضًا عن `name` المحدد في حالة الأحرف.

إذا كان خيار `'subject'` غير محدد أو تم تعيينه على `'default'`، فسيتم اعتبار موضوع الشهادة فقط إذا كان ملحق اسم الموضوع البديل إما غير موجود أو لا يحتوي على أي أسماء DNS. يتوافق هذا السلوك مع [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS").

إذا تم تعيين خيار `'subject'` على `'always'` وإذا كان ملحق اسم الموضوع البديل إما غير موجود أو لا يحتوي على اسم DNS مطابق، فسيتم اعتبار موضوع الشهادة.

إذا تم تعيين خيار `'subject'` على `'never'`، فلن يتم اعتبار موضوع الشهادة أبدًا، حتى إذا كانت الشهادة لا تحتوي على أي أسماء موضوع بديلة.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v17.5.0, v16.14.1 | تمت إزالة وسيطة `options` لأنه ليس لها أي تأثير. |
| v15.6.0 | أُضيف في: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) يُرجع `ip` إذا تطابقت الشهادة، أو `undefined` إذا لم تتطابق.

يتحقق مما إذا كانت الشهادة تطابق عنوان IP المحدد (IPv4 أو IPv6).

يتم فقط النظر في أسماء البدائل للموضوع `iPAddress` من [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt)، ويجب أن تتطابق تمامًا مع عنوان `ip` المحدد. يتم تجاهل أسماء البدائل الأخرى للموضوع بالإضافة إلى حقل الموضوع في الشهادة.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**أُضيف في: v15.6.0**

- `otherCert` [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتحقق مما إذا كانت هذه الشهادة قد تم إصدارها بواسطة `otherCert` المحددة.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**أُضيف في: v15.6.0**

- `privateKey` [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) مفتاح خاص.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتحقق مما إذا كان المفتاح العام لهذه الشهادة متوافقًا مع المفتاح الخاص المحدد.

### `x509.extKeyUsage` {#x509extkeyusage}

**أُضيف في: v15.6.0**

- النوع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مصفوفة تفصل استخدامات المفتاح الموسعة لهذه الشهادة.

### `x509.fingerprint` {#x509fingerprint}

**أُضيف في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

بصمة SHA-1 لهذه الشهادة.

نظرًا لأن SHA-1 معطلة من الناحية المشفرة ولأن أمان SHA-1 أسوأ بكثير من أمان الخوارزميات المستخدمة بشكل شائع لتوقيع الشهادات، ففكر في استخدام [`x509.fingerprint256`](/ar/nodejs/api/crypto#x509fingerprint256) بدلاً من ذلك.


### `x509.fingerprint256` {#x509fingerprint256}

**تمت الإضافة في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

بصمة SHA-256 لهذه الشهادة.

### `x509.fingerprint512` {#x509fingerprint512}

**تمت الإضافة في: v17.2.0, v16.14.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

بصمة SHA-512 لهذه الشهادة.

نظرًا لأن حساب بصمة SHA-256 عادةً ما يكون أسرع ولأنه يمثل نصف حجم بصمة SHA-512 فقط، فقد يكون [`x509.fingerprint256`](/ar/nodejs/api/crypto#x509fingerprint256) خيارًا أفضل. على الرغم من أن SHA-512 من المفترض أن توفر مستوى أمان أعلى بشكل عام، إلا أن أمان SHA-256 يطابق أمان معظم الخوارزميات المستخدمة بشكل شائع لتوقيع الشهادات.

### `x509.infoAccess` {#x509infoaccess}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.3.1, v16.13.2 | قد يتم ترميز أجزاء من هذا السلسلة كسلاسل JSON حرفية استجابةً لـ CVE-2021-44532. |
| v15.6.0 | تمت الإضافة في: v15.6.0 |
:::

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تمثيل نصي لامتداد معلومات الوصول إلى سلطة الشهادة.

هذه قائمة بوصف الوصول مفصولة بفواصل الأسطر. يبدأ كل سطر بطريقة الوصول ونوع موقع الوصول، متبوعًا بنقطتين والقيمة المرتبطة بموقع الوصول.

بعد البادئة التي تدل على طريقة الوصول ونوع موقع الوصول، قد يتم تضمين بقية كل سطر بين علامتي اقتباس للإشارة إلى أن القيمة عبارة عن سلسلة JSON حرفية. لتحقيق التوافق مع الإصدارات السابقة، يستخدم Node.js فقط سلاسل JSON حرفية داخل هذه الخاصية عند الضرورة لتجنب الغموض. يجب أن يكون رمز الطرف الثالث مستعدًا للتعامل مع كلا تنسيقات الإدخال المحتملة.

### `x509.issuer` {#x509issuer}

**تمت الإضافة في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

معرف الجهة المُصدرة المدرج في هذه الشهادة.


### `x509.issuerCertificate` {#x509issuercertificate}

**أُضيف في: الإصدار v15.9.0**

- النوع: [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate)

شهادة المُصدر أو `undefined` إذا لم تكن شهادة المُصدر متاحة.

### `x509.publicKey` {#x509publickey}

**أُضيف في: الإصدار v15.6.0**

- النوع: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)

المفتاح العام [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) لهذه الشهادة.

### `x509.raw` {#x509raw}

**أُضيف في: الإصدار v15.6.0**

- النوع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

`Buffer` يحتوي على ترميز DER لهذه الشهادة.

### `x509.serialNumber` {#x509serialnumber}

**أُضيف في: الإصدار v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الرقم التسلسلي لهذه الشهادة.

يتم تعيين الأرقام التسلسلية من قبل سلطات الشهادات ولا تحدد الشهادات بشكل فريد. ضع في اعتبارك استخدام [`x509.fingerprint256`](/ar/nodejs/api/crypto#x509fingerprint256) كمعرف فريد بدلاً من ذلك.

### `x509.subject` {#x509subject}

**أُضيف في: الإصدار v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الموضوع الكامل لهذه الشهادة.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v17.3.1, v16.13.2 | قد يتم ترميز أجزاء من هذه السلسلة كنصوص JSON حرفية استجابةً لـ CVE-2021-44532. |
| v15.6.0 | أُضيف في: الإصدار v15.6.0 |
:::

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الاسم البديل للموضوع المحدد لهذه الشهادة.

هذه قائمة مفصولة بفواصل للأسماء البديلة للموضوع. يبدأ كل إدخال بسلسلة تحدد نوع الاسم البديل للموضوع متبوعًا بنقطتين والقيمة المرتبطة بالإدخال.

افترضت الإصدارات السابقة من Node.js بشكل غير صحيح أنه من الآمن تقسيم هذه الخاصية عند التسلسل المكون من حرفين `', '` (انظر [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). ومع ذلك، يمكن أن تحتوي الشهادات الخبيثة والشرعية على حد سواء على أسماء بديلة للموضوع تتضمن هذا التسلسل عند تمثيلها كسلسلة.

بعد البادئة التي تدل على نوع الإدخال، قد يتم تضمين بقية كل إدخال بين علامتي اقتباس للإشارة إلى أن القيمة عبارة عن نص JSON حرفي. من أجل التوافق مع الإصدارات السابقة، يستخدم Node.js نصوص JSON الحرفية فقط داخل هذه الخاصية عند الضرورة لتجنب الغموض. يجب أن يكون كود الطرف الثالث مستعدًا للتعامل مع كلا تنسيقي الإدخال المحتملين.


### `x509.toJSON()` {#x509tojson}

**تمت إضافته في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

لا يوجد ترميز JSON قياسي لشهادات X509. تُرجع طريقة `toJSON()` سلسلة تحتوي على الشهادة المشفرة PEM.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**تمت إضافته في: v15.6.0**

- النوع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تُرجع معلومات حول هذه الشهادة باستخدام ترميز [كائن الشهادة](/ar/nodejs/api/tls#certificate-object) القديم.

### `x509.toString()` {#x509tostring}

**تمت إضافته في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع الشهادة المشفرة PEM.

### `x509.validFrom` {#x509validfrom}

**تمت إضافته في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تاريخ/وقت بدء صلاحية هذه الشهادة.

### `x509.validFromDate` {#x509validfromdate}

**تمت إضافته في: v23.0.0**

- النوع: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

تاريخ/وقت بدء صلاحية هذه الشهادة، مُغلفًا في كائن `Date`.

### `x509.validTo` {#x509validto}

**تمت إضافته في: v15.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تاريخ/وقت انتهاء صلاحية هذه الشهادة.

### `x509.validToDate` {#x509validtodate}

**تمت إضافته في: v23.0.0**

- النوع: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

تاريخ/وقت انتهاء صلاحية هذه الشهادة، مُغلفًا في كائن `Date`.

### `x509.verify(publicKey)` {#x509verifypublickey}

**تمت إضافته في: v15.6.0**

- `publicKey` [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) مفتاح عام.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتحقق مما إذا كانت هذه الشهادة قد تم توقيعها بواسطة المفتاح العام المحدد. لا يجري أي فحوصات تحقق أخرى على الشهادة.


## طرق وخصائص وحدة `node:crypto` {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.8.0 | تمت الإضافة في: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) أولي محتمل مشفر كسلسلة من الثمانيات ذات النهاية الكبيرة ذات طول عشوائي.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد تكرارات اختبار أولية ميلر-رابين الاحتمالية التي يجب إجراؤها. عندما تكون القيمة `0` (صفر)، يتم استخدام عدد من الفحوصات التي تؤدي إلى معدل إيجابي خاطئ لا يزيد عن 2 للإدخال العشوائي. يجب توخي الحذر عند تحديد عدد من الفحوصات. ارجع إلى وثائق OpenSSL لوظيفة [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) خيارات `nchecks` لمزيد من التفاصيل. **الافتراضي:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) تم التعيين إلى كائن [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) إذا حدث خطأ أثناء الفحص.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان المرشح أوليًا باحتمالية خطأ أقل من `0.25 ** options.checks`.
  
 

للتحقق من أولية `candidate`.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**أضيف في: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) عدد أولي محتمل مُشفر كتسلسل لـ big endian octets من طول اعتباطي.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد تكرارات اختبار Miller-Rabin لاحتمالية الأعداد الأولية التي سيتم إجراؤها. عندما تكون القيمة `0` (صفر)، يتم استخدام عدد من الفحوصات التي تعطي معدل إيجابية كاذبة لا يزيد عن 2 للإدخال العشوائي. يجب توخي الحذر عند تحديد عدد من الفحوصات. ارجع إلى وثائق OpenSSL الخاصة بـ [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) للخيارات `nchecks` لمزيد من التفاصيل. **الافتراضي:** `0`
  
 
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان المرشح عددًا أوليًا مع احتمال خطأ أقل من `0.25 ** options.checks`.

يتحقق من أوليّة `candidate`.

### `crypto.constants` {#cryptoconstants}

**أضيف في: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن يحتوي على ثوابت شائعة الاستخدام لعمليات التشفير والأمان ذات الصلة. يتم وصف الثوابت المحددة حاليًا في [ثوابت التشفير](/ar/nodejs/api/crypto#crypto-constants).


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.9.0, v16.17.0 | الآن خيار `authTagLength` اختياري عند استخدام الشيفرة `chacha20-poly1305` ويأخذ القيمة الافتراضية 16 بايت. |
| v15.0.0 | يمكن أن تكون وسيطات كلمة المرور و iv عبارة عن ArrayBuffer وتقتصر كل منها على 2 ** 31 - 1 بايت كحد أقصى. |
| v11.6.0 | يمكن أن تكون وسيطة `key` الآن `KeyObject`. |
| v11.2.0, v10.17.0 | الآن الشيفرة `chacha20-poly1305` (المتغير IETF من ChaCha20-Poly1305) مدعومة. |
| v10.10.0 | الآن الشيفرات في وضع OCB مدعومة. |
| v10.2.0 | يمكن الآن استخدام خيار `authTagLength` لإنتاج علامات مصادقة أقصر في وضع GCM ويأخذ القيمة الافتراضية 16 بايت. |
| v9.9.0 | قد تكون الآن المعلمة `iv` قيمة `null` للشيفرات التي لا تحتاج إلى متجه تهيئة. |
| v0.1.94 | تمت إضافته في: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ar/nodejs/api/stream#new-streamtransformoptions)
- Returns: [\<Cipher\>](/ar/nodejs/api/crypto#class-cipher)

ينشئ ويعيد كائن `Cipher`، مع `algorithm` و`key` ومتجه التهيئة (`iv`) المحدد.

تتحكم وسيطة `options` في سلوك الدفق وهي اختيارية إلا عند استخدام شيفرة في وضع CCM أو OCB (على سبيل المثال `'aes-128-ccm'`). في هذه الحالة، يكون خيار `authTagLength` مطلوبًا ويحدد طول علامة المصادقة بالبايت، انظر [وضع CCM](/ar/nodejs/api/crypto#ccm-mode). في وضع GCM، خيار `authTagLength` ليس مطلوبًا ولكن يمكن استخدامه لتعيين طول علامة المصادقة التي سيتم إرجاعها بواسطة `getAuthTag()` ويأخذ القيمة الافتراضية 16 بايت. بالنسبة إلى `chacha20-poly1305`، يأخذ خيار `authTagLength` القيمة الافتراضية 16 بايت.

يعتمد `algorithm` على OpenSSL، والأمثلة هي `'aes192'`، إلخ. في إصدارات OpenSSL الحديثة، ستعرض `openssl list -cipher-algorithms` خوارزميات الشيفرة المتاحة.

`key` هو المفتاح الخام المستخدم بواسطة `algorithm` و `iv` هو [متجه تهيئة](https://en.wikipedia.org/wiki/Initialization_vector). يجب أن تكون كلتا الوسيطتين عبارة عن سلاسل مشفرة بـ `'utf8'` أو [Buffers](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`. قد يكون `key` اختياريًا [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject) من النوع `secret`. إذا كانت الشيفرة لا تحتاج إلى متجه تهيئة، فقد يكون `iv` قيمة `null`.

عند تمرير سلاسل لـ `key` أو `iv`، يرجى مراعاة [المحاذير عند استخدام السلاسل كمدخلات لواجهات برمجة التطبيقات المشفرة](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

يجب أن تكون متجهات التهيئة غير قابلة للتنبؤ وفريدة؛ من الناحية المثالية، ستكون عشوائية مشفرة. ليس من الضروري أن تكون سرية: تتم إضافة IVs عادةً إلى رسائل النص المشفر غير مشفرة. قد يبدو الأمر متناقضًا أن شيئًا ما يجب أن يكون غير متوقع وفريدًا، ولكن ليس من الضروري أن يكون سريًا؛ تذكر أنه يجب ألا يكون المهاجم قادرًا على التنبؤ مسبقًا بما سيكون عليه IV معين.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.9.0, v16.17.0 | أصبح الخيار `authTagLength` اختياريًا الآن عند استخدام شيفرة `chacha20-poly1305` ويأخذ القيمة الافتراضية 16 بايت. |
| v11.6.0 | يمكن أن تكون الوسيطة `key` الآن `KeyObject`. |
| v11.2.0, v10.17.0 | يتم دعم الشيفرة `chacha20-poly1305` (متغير IETF من ChaCha20-Poly1305) الآن. |
| v10.10.0 | يتم دعم الشيفرات في وضع OCB الآن. |
| v10.2.0 | يمكن الآن استخدام الخيار `authTagLength` لتقييد أطوال علامة مصادقة GCM المقبولة. |
| v9.9.0 | قد تكون المعلمة `iv` الآن `null` للشيفرات التي لا تحتاج إلى متجه تهيئة. |
| v0.1.94 | تمت الإضافة في: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات [`stream.transform`](/ar/nodejs/api/stream#new-streamtransformoptions)
- Returns: [\<Decipher\>](/ar/nodejs/api/crypto#class-decipher)

يقوم بإنشاء وإرجاع كائن `Decipher` يستخدم `algorithm` و `key` ومتجه التهيئة (`iv`) المحدد.

تتحكم الوسيطة `options` في سلوك التدفق وهي اختيارية باستثناء عند استخدام شيفرة في وضع CCM أو OCB (مثل `'aes-128-ccm'`). في هذه الحالة، يكون الخيار `authTagLength` مطلوبًا ويحدد طول علامة المصادقة بالبايت، انظر [وضع CCM](/ar/nodejs/api/crypto#ccm-mode). بالنسبة إلى AES-GCM و `chacha20-poly1305`، يأخذ الخيار `authTagLength` القيمة الافتراضية 16 بايت ويجب تعيينه على قيمة مختلفة إذا تم استخدام طول مختلف.

يعتمد `algorithm` على OpenSSL، والأمثلة هي `'aes192'`، وما إلى ذلك. في إصدارات OpenSSL الحديثة، ستعرض `openssl list -cipher-algorithms` خوارزميات الشيفرة المتاحة.

`key` هو المفتاح الخام المستخدم بواسطة `algorithm` و `iv` هو [متجه تهيئة](https://en.wikipedia.org/wiki/Initialization_vector). يجب أن تكون كلتا الوسيطتين سلاسل مشفرة `'utf8'` أو [Buffers](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`s. يمكن أن يكون `key` اختياريًا [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject) من النوع `secret`. إذا كانت الشيفرة لا تحتاج إلى متجه تهيئة، فقد يكون `iv` هو `null`.

عند تمرير سلاسل لـ `key` أو `iv`، يرجى مراعاة [محاذير استخدام السلاسل كمدخلات لواجهات برمجة تطبيقات التشفير](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

يجب أن تكون متجهات التهيئة غير قابلة للتنبؤ وفريدة من نوعها؛ من الناحية المثالية، ستكون عشوائية مشفرة. لا يجب أن تكون سرية: عادةً ما تتم إضافة IVs إلى رسائل النص المشفر غير المشفرة. قد يبدو الأمر متناقضًا أن شيئًا ما يجب أن يكون غير متوقع وفريدًا، ولكن ليس من الضروري أن يكون سريًا؛ تذكر أنه يجب ألا يكون المهاجم قادرًا على التنبؤ مسبقًا بمتجه تهيئة معين.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن يكون المعامل `prime` الآن أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `prime` الآن `Uint8Array`. |
| v6.0.0 | تم تغيير الإعداد الافتراضي لمعلمات الترميز من `binary` إلى `utf8`. |
| v0.11.12 | تمت إضافته في: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `prime`.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **افتراضي:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) سلسلة `generator`.
- الإرجاع: [\<DiffieHellman\>](/ar/nodejs/api/crypto#class-diffiehellman)

ينشئ كائن تبادل مفاتيح `DiffieHellman` باستخدام `prime` الموفر و`مولد` اختياري محدد.

يمكن أن يكون المعامل `generator` رقمًا أو سلسلة أو [`Buffer`](/ar/nodejs/api/buffer). إذا لم يتم تحديد `مولد`، فسيتم استخدام القيمة `2`.

إذا تم تحديد `primeEncoding`، فمن المتوقع أن يكون `prime` سلسلة؛ وإلا فمن المتوقع أن يكون [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.

إذا تم تحديد `generatorEncoding`، فمن المتوقع أن يكون `مولد` سلسلة؛ وإلا فمن المتوقع أن يكون رقمًا أو [`Buffer`](/ar/nodejs/api/buffer) أو `TypedArray` أو `DataView`.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**تمت الإضافة في: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `2`
- الإرجاع: [\<DiffieHellman\>](/ar/nodejs/api/crypto#class-diffiehellman)

ينشئ كائن تبادل مفاتيح `DiffieHellman` ويولد عددًا أوليًا بطول `primeLength` من البتات باستخدام `generator` رقمي اختياري محدد. إذا لم يتم تحديد `generator`، فسيتم استخدام القيمة `2`.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**تمت الإضافة في: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<DiffieHellmanGroup\>](/ar/nodejs/api/crypto#class-diffiehellmangroup)

اسم مستعار لـ [`crypto.getDiffieHellman()`](/ar/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**تمت الإضافة في: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<ECDH\>](/ar/nodejs/api/crypto#class-ecdh)

ينشئ كائن تبادل مفاتيح منحنى إهليلجي ديفي-هيلمان (`ECDH`) باستخدام منحنى محدد مسبقًا تحدده سلسلة `curveName`. استخدم [`crypto.getCurves()`](/ar/nodejs/api/crypto#cryptogetcurves) للحصول على قائمة بأسماء المنحنيات المتاحة. في إصدارات OpenSSL الحديثة، سيعرض `openssl ecparam -list_curves` أيضًا اسم ووصف كل منحنى إهليلجي متاح.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.8.0 | تمت إضافة خيار `outputLength` لدوال تجزئة XOF. |
| v0.1.92 | تمت الإضافة في: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ar/nodejs/api/stream#new-streamtransformoptions)
- الإرجاع: [\<Hash\>](/ar/nodejs/api/crypto#class-hash)

ينشئ ويُرجع كائن `Hash` يمكن استخدامه لإنشاء ملخصات تجزئة باستخدام `algorithm` المحدد. تتحكم وسيطة `options` الاختيارية في سلوك الدفق. بالنسبة لوظائف تجزئة XOF مثل `'shake256'`، يمكن استخدام الخيار `outputLength` لتحديد طول الإخراج المطلوب بالبايت.

تعتمد `algorithm` على الخوارزميات المتاحة التي تدعمها نسخة OpenSSL على النظام الأساسي. ومن الأمثلة `'sha256'`، `'sha512'`، إلخ. في الإصدارات الحديثة من OpenSSL، سيعرض `openssl list -digest-algorithms` خوارزميات التجزئة المتاحة.

مثال: إنشاء مجموع sha256 لملف

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createHmac(algorithm, key[, options])` {#cryptocreatehmacalgorithm-key-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.0.0 | يمكن أن يكون المفتاح أيضًا ArrayBuffer أو CryptoKey. تمت إضافة خيار الترميز. لا يمكن أن يحتوي المفتاح على أكثر من 2 ** 32 - 1 بايت. |
| v11.6.0 | يمكن أن تكون وسيطة `key` الآن `KeyObject`. |
| v0.1.94 | تمت الإضافة في: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/ar/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما تكون `key` سلسلة.


- الإرجاع: [\<Hmac\>](/ar/nodejs/api/crypto#class-hmac)

ينشئ ويرجع كائن `Hmac` الذي يستخدم `algorithm` و `key` المحددين. تتحكم وسيطة `options` الاختيارية في سلوك التدفق.

يعتمد `algorithm` على الخوارزميات المتاحة التي تدعمها نسخة OpenSSL على النظام الأساسي. ومن الأمثلة على ذلك `'sha256'` و `'sha512'` وما إلى ذلك. في الإصدارات الحديثة من OpenSSL، ستعرض `openssl list -digest-algorithms` خوارزميات التلخيص المتاحة.

`key` هو مفتاح HMAC المستخدم لإنشاء تجزئة HMAC المشفرة. إذا كان [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فيجب أن يكون نوعه `secret`. إذا كانت سلسلة، فيرجى مراعاة [المحاذير عند استخدام السلاسل كمدخلات لواجهات برمجة التطبيقات المشفرة](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). إذا تم الحصول عليه من مصدر إنتروبيا آمن مشفر، مثل [`crypto.randomBytes()`](/ar/nodejs/api/crypto#cryptorandombytessize-callback) أو [`crypto.generateKey()`](/ar/nodejs/api/crypto#cryptogeneratekeytype-options-callback)، فيجب ألا يتجاوز طوله حجم الكتلة `algorithm` (على سبيل المثال، 512 بت لـ SHA-256).

مثال: إنشاء sha256 HMAC لملف

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createPrivateKey(key)` {#cryptocreateprivatekeykey}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v15.12.0 | يمكن أن يكون المفتاح أيضًا كائن JWK. |
| v15.0.0 | يمكن أن يكون المفتاح أيضًا ArrayBuffer. تمت إضافة خيار الترميز. لا يمكن أن يحتوي المفتاح على أكثر من 2 ** 32 - 1 بايت. |
| v11.6.0 | تمت إضافته في: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مادة المفتاح، إما بتنسيق PEM أو DER أو JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'pem'` أو `'der'` أو `'jwk'`. **الافتراضي:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'pkcs1'` أو `'pkcs8'` أو `'sec1'`. هذا الخيار مطلوب فقط إذا كان `format` هو `'der'` ويتم تجاهله بخلاف ذلك.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) عبارة المرور المستخدمة لفك التشفير.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما يكون `key` سلسلة.


- Returns: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)

ينشئ ويعيد كائن مفتاح جديد يحتوي على مفتاح خاص. إذا كان `key` عبارة عن سلسلة أو `Buffer`، فسيُفترض أن `format` هو `'pem'`؛ بخلاف ذلك، يجب أن يكون `key` كائنًا بالخصائص الموضحة أعلاه.

إذا كان المفتاح الخاص مشفرًا، فيجب تحديد `passphrase`. يقتصر طول عبارة المرور على 1024 بايت.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.12.0 | يمكن أن يكون المفتاح أيضًا كائن JWK. |
| v15.0.0 | يمكن أن يكون المفتاح أيضًا ArrayBuffer. تمت إضافة خيار الترميز. لا يمكن أن يحتوي المفتاح على أكثر من 2 ** 32 - 1 بايت. |
| v11.13.0 | يمكن أن تكون وسيطة `key` الآن `KeyObject` من النوع `private`. |
| v11.7.0 | يمكن أن تكون وسيطة `key` الآن مفتاحًا خاصًا. |
| v11.6.0 | أُضيف في: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مادة المفتاح، إما بتنسيق PEM أو DER أو JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'pem'` أو `'der'` أو `'jwk'`. **الافتراضي:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'pkcs1'` أو `'spki'`. هذا الخيار مطلوب فقط إذا كان `format` هو `'der'` ويتم تجاهله بخلاف ذلك.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما يكون `key` سلسلة.


- Returns: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)

يقوم بإنشاء وإرجاع كائن مفتاح جديد يحتوي على مفتاح عام. إذا كان `key` سلسلة أو `Buffer`، فيُفترض أن يكون `format` هو `'pem'`؛ إذا كان `key` هو `KeyObject` من النوع `'private'`، فسيتم اشتقاق المفتاح العام من المفتاح الخاص المحدد؛ بخلاف ذلك، يجب أن يكون `key` كائنًا بالخصائص الموضحة أعلاه.

إذا كان التنسيق `'pem'`، فقد يكون `'key'` أيضًا شهادة X.509.

نظرًا لأنه يمكن اشتقاق المفاتيح العامة من المفاتيح الخاصة، فيمكن تمرير مفتاح خاص بدلاً من المفتاح العام. في هذه الحالة، تتصرف هذه الدالة كما لو تم استدعاء [`crypto.createPrivateKey()`](/ar/nodejs/api/crypto#cryptocreateprivatekeykey)، باستثناء أن نوع `KeyObject` المُرجع سيكون `'public'` وأنه لا يمكن استخراج المفتاح الخاص من `KeyObject` المُرجع. وبالمثل، إذا تم إعطاء `KeyObject` من النوع `'private'`، فسيتم إرجاع `KeyObject` جديد من النوع `'public'` وسيكون من المستحيل استخراج المفتاح الخاص من الكائن المُرجع.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.8.0, v16.18.0 | يمكن أن يكون المفتاح الآن بطول صفر. |
| v15.0.0 | يمكن أن يكون المفتاح أيضًا ArrayBuffer أو سلسلة. تمت إضافة وسيطة الترميز. لا يمكن أن يحتوي المفتاح على أكثر من 2 ** 32 - 1 بايت. |
| v11.6.0 | تمت الإضافة في: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة عندما تكون `key` سلسلة.
- إرجاع: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)

ينشئ ويرجع كائن مفتاح جديد يحتوي على مفتاح سري للتشفير المتماثل أو `Hmac`.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**تمت الإضافة في: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/ar/nodejs/api/stream#new-streamwritableoptions)
- إرجاع: [\<Sign\>](/ar/nodejs/api/crypto#class-sign)

ينشئ ويرجع كائن `Sign` يستخدم `algorithm` المحدد. استخدم [`crypto.getHashes()`](/ar/nodejs/api/crypto#cryptogethashes) للحصول على أسماء خوارزميات التلخيص المتاحة. تتحكم وسيطة `options` الاختيارية في سلوك `stream.Writable`.

في بعض الحالات، يمكن إنشاء مثيل `Sign` باستخدام اسم خوارزمية توقيع، مثل `'RSA-SHA256'`، بدلاً من خوارزمية تلخيص. سيؤدي ذلك إلى استخدام خوارزمية التلخيص المقابلة. هذا لا يعمل مع جميع خوارزميات التوقيع، مثل `'ecdsa-with-SHA256'`، لذلك من الأفضل دائمًا استخدام أسماء خوارزميات التلخيص.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**أضيف في: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/ar/nodejs/api/stream#new-streamwritableoptions)
- Returns: [\<Verify\>](/ar/nodejs/api/crypto#class-verify)

ينشئ ويعيد كائن `Verify` يستخدم الخوارزمية المعطاة. استخدم [`crypto.getHashes()`](/ar/nodejs/api/crypto#cryptogethashes) للحصول على مصفوفة بأسماء خوارزميات التوقيع المتاحة. تتحكم وسيطة `options` الاختيارية في سلوك `stream.Writable`.

في بعض الحالات، يمكن إنشاء مثيل `Verify` باستخدام اسم خوارزمية التوقيع، مثل `'RSA-SHA256'`، بدلاً من خوارزمية الملخص. سيؤدي هذا إلى استخدام خوارزمية الملخص المقابلة. لا يعمل هذا مع جميع خوارزميات التوقيع، مثل `'ecdsa-with-SHA256'`، لذا فمن الأفضل دائمًا استخدام أسماء خوارزميات الملخص.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**أضيف في: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `privateKey`: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)
  
 
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يحسب سر Diffie-Hellman بناءً على `privateKey` و `publicKey`. يجب أن يكون لكلا المفتاحين نفس `asymmetricKeyType`، والتي يجب أن تكون واحدة من `'dh'` (لـ Diffie-Hellman)، أو `'ec'`، أو `'x448'`، أو `'x25519'` (لـ ECDH).

### `crypto.fips` {#cryptofips}

**أضيف في: v6.0.0**

**تم الإيقاف منذ: v10.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ar/nodejs/api/documentation#stability-index) [Stability: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف
:::

خاصية للتحقق والتحكم فيما إذا كان مزود تشفير متوافق مع FIPS قيد الاستخدام حاليًا. يتطلب الضبط على true بناءً FIPS من Node.js.

تم إيقاف هذه الخاصية. يرجى استخدام `crypto.setFips()` و `crypto.getFips()` بدلاً من ذلك.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.0.0 | تمت إضافته في: v15.0.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الاستخدام المقصود للمفتاح السري الذي تم إنشاؤه. القيم المقبولة حاليًا هي `'hmac'` و `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول بت المفتاح المراد إنشاؤه. يجب أن تكون هذه قيمة أكبر من 0.
    - إذا كان `type` هو `'hmac'`، فإن الحد الأدنى هو 8، والطول الأقصى هو 2-1. إذا لم تكن القيمة من مضاعفات 8، فسيتم اقتطاع المفتاح الذي تم إنشاؤه إلى `Math.floor(length / 8)`.
    - إذا كان `type` هو `'aes'`، فيجب أن يكون الطول واحدًا من `128` أو `192` أو `256`.




- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)



يقوم بشكل غير متزامن بإنشاء مفتاح سري عشوائي جديد بالطول المحدد. سيحدد `type` عمليات التحقق التي سيتم إجراؤها على `length`.



::: code-group
```js [ESM]
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```js [CJS]
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```
:::

يجب ألا يتجاوز حجم مفتاح HMAC الذي تم إنشاؤه حجم الكتلة لوظيفة التجزئة الأساسية. راجع [`crypto.createHmac()`](/ar/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) لمزيد من المعلومات.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | يؤدي تمرير استدعاء غير صالح إلى وسيطة `callback` الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v16.10.0 | إضافة القدرة على تحديد معلمات تسلسل `RSASSA-PSS-params` لأزواج مفاتيح RSA-PSS. |
| v13.9.0, v12.17.0 | إضافة دعم لـ Diffie-Hellman. |
| v12.0.0 | إضافة دعم لأزواج مفاتيح RSA-PSS. |
| v12.0.0 | إضافة القدرة على إنشاء أزواج مفاتيح X25519 و X448. |
| v12.0.0 | إضافة القدرة على إنشاء أزواج مفاتيح Ed25519 و Ed448. |
| v11.6.0 | تنتج الدالتان `generateKeyPair` و `generateKeyPairSync` الآن كائنات مفاتيح إذا لم يتم تحديد أي ترميز. |
| v10.12.0 | تمت الإضافة في: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'rsa'` أو `'rsa-pss'` أو `'dsa'` أو `'ec'` أو `'ed25519'` أو `'ed448'` أو `'x25519'` أو `'x448'` أو `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم المفتاح بالبت (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الأس العام (RSA). **افتراضي:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم خلاصة الرسالة (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم خلاصة الرسالة المستخدمة بواسطة MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأدنى لطول الملح بالبايت (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم `q` بالبت (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المنحنى المراد استخدامه (EC).
    - `prime`: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) معلمة العدد الأولي (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول العدد الأولي بالبت (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مولد مخصص (DH). **افتراضي:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مجموعة Diffie-Hellman (DH). انظر [`crypto.getDiffieHellman()`](/ar/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'named'` أو `'explicit'` (EC). **افتراضي:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`keyObject.export()`](/ar/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`keyObject.export()`](/ar/nodejs/api/crypto#keyobjectexportoptions).


- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)



ينشئ زوج مفاتيح غير متماثل جديد من النوع المحدد `type`. يتم دعم RSA و RSA-PSS و DSA و EC و Ed25519 و Ed448 و X25519 و X448 و DH حاليًا.

إذا تم تحديد `publicKeyEncoding` أو `privateKeyEncoding`، فسلوك هذه الدالة كما لو تم استدعاء [`keyObject.export()`](/ar/nodejs/api/crypto#keyobjectexportoptions) على نتيجتها. بخلاف ذلك، يتم إرجاع الجزء الخاص بالمفتاح كـ [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject).

يوصى بترميز المفاتيح العامة كـ `'spki'` والمفاتيح الخاصة كـ `'pkcs8'` مع التشفير للتخزين طويل الأجل:

::: code-group
```js [ESM]
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // معالجة الأخطاء واستخدام زوج المفاتيح الذي تم إنشاؤه.
});
```

```js [CJS]
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // معالجة الأخطاء واستخدام زوج المفاتيح الذي تم إنشاؤه.
});
```
:::

عند الاكتمال، سيتم استدعاء `callback` مع تعيين `err` على `undefined` و `publicKey` / `privateKey` تمثل زوج المفاتيح الذي تم إنشاؤه.

إذا تم استدعاء هذه الطريقة كنسختها [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed، فإنها ترجع `Promise` لـ `Object` بخصائص `publicKey` و `privateKey`.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v16.10.0 | إضافة القدرة على تحديد معلمات تسلسل `RSASSA-PSS-params` لأزواج مفاتيح RSA-PSS. |
| v13.9.0, v12.17.0 | إضافة دعم Diffie-Hellman. |
| v12.0.0 | إضافة دعم أزواج مفاتيح RSA-PSS. |
| v12.0.0 | إضافة القدرة على إنشاء أزواج مفاتيح X25519 و X448. |
| v12.0.0 | إضافة القدرة على إنشاء أزواج مفاتيح Ed25519 و Ed448. |
| v11.6.0 | تُنتج الآن وظائف `generateKeyPair` و `generateKeyPairSync` كائنات مفاتيح إذا لم يتم تحديد أي ترميز. |
| v10.12.0 | تمت إضافته في: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'rsa'`، أو `'rsa-pss'`، أو `'dsa'`، أو `'ec'`، أو `'ed25519'`، أو `'ed448'`، أو `'x25519'`، أو `'x448'`، أو `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم المفتاح بالبت (RSA، DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الأس العام (RSA). **الافتراضي:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم خلاصة الرسالة (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم خلاصة الرسالة المستخدمة بواسطة MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأدنى لطول الملح بالبايت (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم `q` بالبت (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المنحنى المراد استخدامه (EC).
    - `prime`: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) معلمة الأولي (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول الأولي بالبت (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مولد مخصص (DH). **الافتراضي:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مجموعة Diffie-Hellman (DH). انظر [`crypto.getDiffieHellman()`](/ar/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'named'` أو `'explicit'` (EC). **الافتراضي:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`keyObject.export()`](/ar/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`keyObject.export()`](/ar/nodejs/api/crypto#keyobjectexportoptions).


- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)



ينشئ زوج مفاتيح غير متماثل جديد من `type` المحدد. يتم دعم RSA و RSA-PSS و DSA و EC و Ed25519 و Ed448 و X25519 و X448 و DH حاليًا.

إذا تم تحديد `publicKeyEncoding` أو `privateKeyEncoding`، فسيكون سلوك هذه الوظيفة كما لو تم استدعاء [`keyObject.export()`](/ar/nodejs/api/crypto#keyobjectexportoptions) على نتيجتها. وإلا، فسيتم إرجاع الجزء الخاص بالمفتاح كـ [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject).

عند ترميز المفاتيح العامة، يوصى باستخدام `'spki'`. عند ترميز المفاتيح الخاصة، يوصى باستخدام `'pkcs8'` مع عبارة مرور قوية، والحفاظ على سرية عبارة المرور.

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```js [CJS]
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```
:::

تمثل القيمة المرجعة `{ publicKey, privateKey }` زوج المفاتيح الذي تم إنشاؤه. عند تحديد ترميز PEM، سيكون المفتاح المقابل سلسلة، وإلا فسيكون مخزنًا مؤقتًا يحتوي على البيانات المشفرة بتنسيق DER.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**تمت الإضافة في: الإصدار 15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الاستخدام المقصود للمفتاح السري الذي تم إنشاؤه. القيم المقبولة حاليًا هي `'hmac'` و `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول البت للمفتاح المراد إنشاؤه.
    - إذا كان `type` هو `'hmac'`، فإن الحد الأدنى هو 8، والطول الأقصى هو 2-1. إذا لم تكن القيمة من مضاعفات 8، فسيتم اقتطاع المفتاح الذي تم إنشاؤه إلى `Math.floor(length / 8)`.
    - إذا كان `type` هو `'aes'`، فيجب أن يكون الطول واحدًا من `128` أو `192` أو `256`.




- الإرجاع: [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)

ينشئ بشكل متزامن مفتاحًا سريًا عشوائيًا جديدًا بالطول المحدد. سيحدد `type` عمليات التحقق التي سيتم إجراؤها على `length`.



::: code-group
```js [ESM]
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```js [CJS]
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```
:::

يجب ألا يتجاوز حجم مفتاح HMAC الذي تم إنشاؤه حجم الكتلة لدالة التجزئة الأساسية. راجع [`crypto.createHmac()`](/ar/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) لمزيد من المعلومات.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى الوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.8.0 | تمت الإضافة في: الإصدار 15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم (بالبتات) العدد الأولي المراد إنشاؤه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، يتم إرجاع العدد الأولي الذي تم إنشاؤه كـ `bigint`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



ينشئ عددًا أوليًا شبه عشوائي بحجم `size` بت.

إذا كانت `options.safe` هي `true`، فسيكون العدد الأولي عددًا أوليًا آمنًا - أي أن `(prime - 1) / 2` سيكون أيضًا عددًا أوليًا.

يمكن استخدام المعلمات `options.add` و `options.rem` لفرض متطلبات إضافية، على سبيل المثال، لـ Diffie-Hellman:

- إذا تم تعيين كل من `options.add` و `options.rem`، فسوف يفي العدد الأولي بالشرط `prime % add = rem`.
- إذا تم تعيين `options.add` فقط ولم تكن `options.safe` هي `true`، فسوف يفي العدد الأولي بالشرط `prime % add = 1`.
- إذا تم تعيين `options.add` فقط وتم تعيين `options.safe` على `true`، فسوف يفي العدد الأولي بدلاً من ذلك بالشرط `prime % add = 3`. هذا ضروري لأن `prime % add = 1` لـ `options.add \> 2` سيتعارض مع الشرط الذي تفرضه `options.safe`.
- يتم تجاهل `options.rem` إذا لم يتم إعطاء `options.add`.

يجب ترميز كل من `options.add` و `options.rem` كسلاسل كبيرة النهاية إذا تم إعطاؤهما كـ `ArrayBuffer` أو `SharedArrayBuffer` أو `TypedArray` أو `Buffer` أو `DataView`.

بشكل افتراضي، يتم ترميز العدد الأولي كسلسلة كبيرة النهاية من الثمانيات في [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). إذا كان الخيار `bigint` هو `true`، فسيتم توفير [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**تمت إضافتها في: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم (بالبت) العدد الأولي المراد إنشاؤه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، يتم إرجاع العدد الأولي الذي تم إنشاؤه كـ `bigint`.


- الإرجاع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

يقوم بإنشاء عدد أولي شبه عشوائي بحجم `size` من البتات.

إذا كانت `options.safe` هي `true`، فسيكون العدد الأولي آمنًا - أي أن `(prime - 1) / 2` سيكون أيضًا عددًا أوليًا.

يمكن استخدام المعاملات `options.add` و `options.rem` لفرض متطلبات إضافية، على سبيل المثال، لـ Diffie-Hellman:

- إذا تم تعيين كل من `options.add` و `options.rem`، فسوف يفي العدد الأولي بالشرط `prime % add = rem`.
- إذا تم تعيين `options.add` فقط وكانت `options.safe` ليست `true`، فسوف يفي العدد الأولي بالشرط `prime % add = 1`.
- إذا تم تعيين `options.add` فقط وتم تعيين `options.safe` على `true`، فسوف يفي العدد الأولي بدلاً من ذلك بالشرط `prime % add = 3`. هذا ضروري لأن `prime % add = 1` لـ `options.add \> 2` سيتعارض مع الشرط الذي تفرضه `options.safe`.
- يتم تجاهل `options.rem` إذا لم يتم إعطاء `options.add`.

يجب ترميز كل من `options.add` و `options.rem` كتسلسلات كبيرة النهاية إذا تم إعطاؤها كـ `ArrayBuffer` أو `SharedArrayBuffer` أو `TypedArray` أو `Buffer` أو `DataView`.

بشكل افتراضي، يتم ترميز العدد الأولي كتسلسل كبير النهاية من الثمانيات في [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). إذا كان خيار `bigint` هو `true`، فسيتم توفير [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**تمت إضافته في: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم أو معرف التشفير المراد الاستعلام عنه.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول مفتاح اختبار.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول متجه تهيئة (IV) اختبار.

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم التشفير
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف التشفير
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم كتلة التشفير بالبايت. يتم حذف هذه الخاصية عندما يكون `mode` هو `'stream'`.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المتوقع أو الافتراضي لمتجه التهيئة بالبايت. يتم حذف هذه الخاصية إذا لم يستخدم التشفير متجه تهيئة.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المتوقع أو الافتراضي للمفتاح بالبايت.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) وضع التشفير. أحد `'cbc'` أو `'ccm'` أو `'cfb'` أو `'ctr'` أو `'ecb'` أو `'gcm'` أو `'ocb'` أو `'ofb'` أو `'stream'` أو `'wrap'` أو `'xts'`.

إرجاع معلومات حول تشفير معين.

تقبل بعض التشفيرات مفاتيح ومتجهات تهيئة متغيرة الطول. بشكل افتراضي، ستُرجع طريقة `crypto.getCipherInfo()` القيم الافتراضية لهذه التشفيرات. لاختبار ما إذا كان طول مفتاح أو طول متجه تهيئة معين مقبولًا لتشفير معين، استخدم الخيارات `keyLength` و `ivLength`. إذا كانت القيم المعطاة غير مقبولة، فسيتم إرجاع `undefined`.


### `crypto.getCiphers()` {#cryptogetciphers}

**تمت الإضافة في: v0.9.3**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة تحتوي على أسماء خوارزميات التشفير المدعومة.

::: code-group
```js [ESM]
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```js [CJS]
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```
:::

### `crypto.getCurves()` {#cryptogetcurves}

**تمت الإضافة في: v2.3.0**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة تحتوي على أسماء المنحنيات الإهليلجية المدعومة.

::: code-group
```js [ESM]
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```js [CJS]
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```
:::

### `crypto.getDiffieHellman(groupName)` {#cryptogetdiffiehellmangroupname}

**تمت الإضافة في: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<DiffieHellmanGroup\>](/ar/nodejs/api/crypto#class-diffiehellmangroup)

يقوم بإنشاء كائن تبادل مفاتيح `DiffieHellmanGroup` محدد مسبقًا. يتم سرد المجموعات المدعومة في الوثائق الخاصة بـ [`DiffieHellmanGroup`](/ar/nodejs/api/crypto#class-diffiehellmangroup).

يحاكي الكائن الذي تم إرجاعه واجهة الكائنات التي تم إنشاؤها بواسطة [`crypto.createDiffieHellman()`](/ar/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding)، ولكنه لن يسمح بتغيير المفاتيح (باستخدام [`diffieHellman.setPublicKey()`](/ar/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding)، على سبيل المثال). ميزة استخدام هذه الطريقة هي أن الأطراف ليسوا مضطرين إلى إنشاء أو تبادل معامل المجموعة مسبقًا، مما يوفر وقت المعالج ووقت الاتصال.

مثال (الحصول على سر مشترك):

::: code-group
```js [ESM]
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
```
:::

### `crypto.getFips()` {#cryptogetfips}

**أُضيف في: v10.0.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` إذا وفقط إذا كان مُزوِّد التشفير المتوافق مع معيار FIPS قيد الاستخدام حاليًا، و `0` خلاف ذلك. قد يؤدي إصدار رئيسي semver مستقبلي إلى تغيير نوع الإرجاع لواجهة برمجة التطبيقات هذه إلى [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `crypto.getHashes()` {#cryptogethashes}

**أُضيف في: v0.9.3**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة بأسماء خوارزميات التجزئة المدعومة، مثل `'RSA-SHA256'`. تُسمى خوارزميات التجزئة أيضًا خوارزميات "التلخيص".



::: code-group
```js [ESM]
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```js [CJS]
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```
:::

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**أُضيف في: v17.4.0**

- `typedArray` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) تُرجع `typedArray`.

اسم مستعار مناسب لـ [`crypto.webcrypto.getRandomValues()`](/ar/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). هذا التنفيذ غير متوافق مع مواصفات Web Crypto، لكتابة كود متوافق مع الويب، استخدم [`crypto.webcrypto.getRandomValues()`](/ar/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray) بدلاً من ذلك.


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**تمت الإضافة في: v21.7.0, v20.12.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح للإصدار
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) عندما تكون `data` سلسلة، سيتم ترميزها كـ UTF-8 قبل تجزئتها. إذا كانت هناك حاجة إلى ترميز إدخال مختلف لسلسلة الإدخال، يمكن للمستخدم ترميز السلسلة في `TypedArray` باستخدام `TextEncoder` أو `Buffer.from()` وتمرير `TypedArray` المشفر إلى واجهة برمجة التطبيقات هذه بدلاً من ذلك.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  [ترميز](/ar/nodejs/api/buffer#buffers-and-character-encodings) يستخدم لترميز الملخص الذي تم إرجاعه. **الافتراضي:** `'hex'`.
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

أداة لإنشاء ملخصات تجزئة لمرة واحدة للبيانات. يمكن أن تكون أسرع من `crypto.createHash()` المستندة إلى الكائنات عند تجزئة كمية أصغر من البيانات (\<= 5 ميجابايت) المتوفرة بسهولة. إذا كانت البيانات كبيرة أو إذا تم بثها، فلا يزال يوصى باستخدام `crypto.createHash()` بدلاً من ذلك.

تعتمد `algorithm` على الخوارزميات المتاحة التي تدعمها نسخة OpenSSL على المنصة. الأمثلة هي `'sha256'` و `'sha512'` وما إلى ذلك. في الإصدارات الحديثة من OpenSSL، ستقوم `openssl list -digest-algorithms` بعرض خوارزميات التجزئة المتاحة.

مثال:



::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// تجزئة سلسلة وإرجاع النتيجة كسلسلة مرمزة بنظام hex.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// ترميز سلسلة مرمزة بنظام base64 في Buffer وتجزئتها وإرجاع
// النتيجة كـ buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// تجزئة سلسلة وإرجاع النتيجة كسلسلة مرمزة بنظام hex.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// ترميز سلسلة مرمزة بنظام base64 في Buffer وتجزئتها وإرجاع
// النتيجة كـ buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::

### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد اتصال غير صالح إلى وسيطة `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | يمكن أن تكون مادة التأشير المدخلة الآن ذات طول صفري. |
| v15.0.0 | تمت إضافته في: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خوارزمية الملخص المراد استخدامها.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) مادة التأشير المدخلة. يجب توفيرها ولكن يمكن أن تكون ذات طول صفري.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) قيمة الملح. يجب توفيرها ولكن يمكن أن تكون ذات طول صفري.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) قيمة معلومات إضافية. يجب توفيرها ولكن يمكن أن تكون ذات طول صفري، ولا يمكن أن يزيد حجمها عن 1024 بايت.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول المفتاح المراد إنشاؤه. يجب أن يكون أكبر من 0. القيمة القصوى المسموح بها هي `255` ضعف عدد البايتات التي تنتجها وظيفة الملخص المحددة (على سبيل المثال، `sha512` تنتج تجزئات 64 بايت، مما يجعل الحد الأقصى لإخراج HKDF هو 16320 بايت).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

HKDF هي دالة اشتقاق مفتاح بسيطة معرفة في RFC 5869. يتم استخدام `ikm` و `salt` و `info` المعطاة مع `digest` لاشتقاق مفتاح بطول `keylen` بايت.

يتم استدعاء دالة `callback` المتوفرة مع وسيطتين: `err` و `derivedKey`. إذا حدث خطأ أثناء اشتقاق المفتاح، فسيتم تعيين `err`؛ وإلا سيكون `err` هو `null`. سيتم تمرير `derivedKey` الذي تم إنشاؤه بنجاح إلى رد الاتصال كـ [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). سيتم طرح خطأ إذا كانت أي من وسيطات الإدخال تحدد قيمًا أو أنواعًا غير صالحة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```js [CJS]
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```
:::


### `crypto.hkdfSync(digest, ikm, salt, info, keylen)` {#cryptohkdfsyncdigest-ikm-salt-info-keylen}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.8.0, v16.18.0 | يمكن أن تكون مادة مفتاح الإدخال الآن ذات طول صفري. |
| v15.0.0 | تمت الإضافة في: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خوارزمية التلخيص المراد استخدامها.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) مادة مفتاح الإدخال. يجب توفيرها ولكن يمكن أن يكون طولها صفريًا.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) قيمة الملح. يجب توفيرها ولكن يمكن أن يكون طولها صفريًا.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) قيمة معلومات إضافية. يجب توفيرها ولكن يمكن أن يكون طولها صفريًا، ولا يمكن أن يزيد عن 1024 بايت.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول المفتاح المراد إنشاؤه. يجب أن يكون أكبر من 0. القيمة القصوى المسموح بها هي `255` ضعف عدد البايتات التي تنتجها وظيفة التلخيص المحددة (على سبيل المثال، `sha512` ينتج خلاصات بحجم 64 بايت، مما يجعل أقصى إخراج HKDF هو 16320 بايت).
- Returns: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

يوفر وظيفة اشتقاق مفتاح HKDF متزامنة كما هو محدد في RFC 5869. يتم استخدام `ikm` و `salt` و `info` المحدد مع `digest` لاشتقاق مفتاح بطول `keylen` بايت.

سيتم إرجاع `derivedKey` الذي تم إنشاؤه بنجاح كـ [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

سيتم طرح خطأ إذا كانت أي من وسيطات الإدخال تحدد قيمًا أو أنواعًا غير صالحة، أو إذا تعذر إنشاء المفتاح المشتق.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```js [CJS]
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```
:::


### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` {#cryptopbkdf2password-salt-iterations-keylen-digest-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` الآن يطرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.0.0 | يمكن أن تكون وسيطات كلمة المرور والملح أيضًا مثيلات ArrayBuffer. |
| v14.0.0 | يتم الآن تقييد معلمة `iterations` بالقيم الموجبة. كانت الإصدارات السابقة تعامل القيم الأخرى على أنها واحدة. |
| v8.0.0 | معلمة `digest` مطلوبة دائمًا الآن. |
| v6.0.0 | استدعاء هذه الدالة بدون تمرير معلمة `digest` مهمل الآن وسيصدر تحذيرًا. |
| v6.0.0 | الترميز الافتراضي لـ `password` إذا كان سلسلة قد تغير من `binary` إلى `utf8`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يوفر تطبيقًا غير متزامن لوظيفة اشتقاق المفتاح المستندة إلى كلمة المرور 2 (PBKDF2). يتم تطبيق خوارزمية تجزئة HMAC محددة بواسطة `digest` لاشتقاق مفتاح بطول البايت المطلوب (`keylen`) من `password` و `salt` و `iterations`.

يتم استدعاء دالة `callback` المتوفرة بوسيطتين: `err` و `derivedKey`. إذا حدث خطأ أثناء اشتقاق المفتاح، فسيتم تعيين `err`؛ وإلا فسيكون `err` هو `null`. بشكل افتراضي، سيتم تمرير `derivedKey` الذي تم إنشاؤه بنجاح إلى رد النداء كـ [`Buffer`](/ar/nodejs/api/buffer). سيتم طرح خطأ إذا كانت أي من وسيطات الإدخال تحدد قيمًا أو أنواعًا غير صالحة.

يجب أن تكون وسيطة `iterations` رقمًا يتم تعيينه بأعلى قدر ممكن. كلما زاد عدد التكرارات، زاد أمان المفتاح المشتق، ولكنه سيستغرق وقتًا أطول لإكماله.

يجب أن يكون `salt` فريدًا قدر الإمكان. يوصى بأن يكون الملح عشوائيًا وطوله 16 بايتًا على الأقل. راجع [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) للحصول على التفاصيل.

عند تمرير سلاسل لـ `password` أو `salt`، يرجى مراعاة [المحاذير عند استخدام السلاسل كمدخلات لواجهات برمجة التطبيقات المشفرة](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```js [CJS]
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```
:::

يمكن استرداد مصفوفة من وظائف التجزئة المدعومة باستخدام [`crypto.getHashes()`](/ar/nodejs/api/crypto#cryptogethashes).

تستخدم واجهة برمجة التطبيقات هذه مجموعة مؤشرات الترابط الخاصة بـ libuv، والتي يمكن أن يكون لها آثار أداء مفاجئة وسلبية على بعض التطبيقات؛ راجع وثائق [`UV_THREADPOOL_SIZE`](/ar/nodejs/api/cli#uv_threadpool_sizesize) لمزيد من المعلومات.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | تم تقييد المعامل `iterations` الآن بالقيم الموجبة. الإصدارات السابقة تعاملت مع القيم الأخرى على أنها واحد. |
| v6.0.0 | استدعاء هذه الدالة بدون تمرير المعامل `digest` مهمل الآن وسيصدر تحذيرًا. |
| v6.0.0 | الترميز الافتراضي لـ `password` إذا كان سلسلة نصية تغير من `binary` إلى `utf8`. |
| v0.9.3 | تمت الإضافة في: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

توفر تطبيقًا متزامنًا لوظيفة اشتقاق المفتاح المستندة إلى كلمة المرور 2 (PBKDF2). يتم تطبيق خوارزمية تجزئة HMAC محددة بواسطة `digest` لاشتقاق مفتاح بطول البايت المطلوب (`keylen`) من `password` و `salt` و `iterations`.

إذا حدث خطأ، فسيتم طرح `Error`، وإلا سيتم إرجاع المفتاح المشتق كـ [`Buffer`](/ar/nodejs/api/buffer).

يجب أن يكون الوسيطة `iterations` رقمًا يتم تعيينه بأعلى قيمة ممكنة. كلما زاد عدد التكرارات، زاد أمان المفتاح المشتق، ولكنه سيستغرق وقتًا أطول لإكماله.

يجب أن يكون `salt` فريدًا قدر الإمكان. يوصى بأن يكون الملح عشوائيًا وطوله 16 بايت على الأقل. انظر [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) للحصول على التفاصيل.

عند تمرير سلاسل نصية لـ `password` أو `salt`، يرجى مراعاة [المحاذير عند استخدام السلاسل النصية كمدخلات إلى واجهات برمجة تطبيقات التشفير](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```js [CJS]
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```
:::

يمكن استرداد مجموعة من دوال التجزئة المدعومة باستخدام [`crypto.getHashes()`](/ar/nodejs/api/crypto#cryptogethashes).


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v21.6.2, v20.11.1, v18.19.1 | تم تعطيل الحشو `RSA_PKCS1_PADDING` ما لم يكن إصدار OpenSSL يدعم الرفض الضمني. |
| v15.0.0 | تمت إضافة string و ArrayBuffer و CryptoKey كأنواع مفاتيح مسموح بها. يمكن أن يكون oaepLabel عبارة عن ArrayBuffer. يمكن أن يكون المخزن المؤقت عبارة عن string أو ArrayBuffer. جميع الأنواع التي تقبل المخازن المؤقتة تقتصر على حد أقصى 2 ** 31 - 1 بايت. |
| v12.11.0 | تمت إضافة خيار `oaepLabel`. |
| v12.9.0 | تمت إضافة خيار `oaepHash`. |
| v11.6.0 | تدعم هذه الوظيفة الآن كائنات المفاتيح. |
| v0.11.14 | تمت إضافتها في: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دالة التجزئة المراد استخدامها لـ OAEP padding و MGF1. **افتراضي:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) العلامة المراد استخدامها لـ OAEP padding. إذا لم يتم تحديدها، فلن يتم استخدام أي علامة.
    - `padding` [\<crypto.constants\>](/ar/nodejs/api/crypto#cryptoconstants) قيمة حشو اختيارية محددة في `crypto.constants`، والتي قد تكون: `crypto.constants.RSA_NO_PADDING` أو `crypto.constants.RSA_PKCS1_PADDING` أو `crypto.constants.RSA_PKCS1_OAEP_PADDING`.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) `Buffer` جديد مع المحتوى الذي تم فك تشفيره.

يفك تشفير `buffer` باستخدام `privateKey`. تم تشفير `buffer` مسبقًا باستخدام المفتاح العام المقابل، على سبيل المثال باستخدام [`crypto.publicEncrypt()`](/ar/nodejs/api/crypto#cryptopublicencryptkey-buffer).

إذا لم يكن `privateKey` عبارة عن [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الوظيفة تتصرف كما لو تم تمرير `privateKey` إلى [`crypto.createPrivateKey()`](/ar/nodejs/api/crypto#cryptocreateprivatekeykey). إذا كان كائنًا، فيمكن تمرير الخاصية `padding`. بخلاف ذلك، تستخدم هذه الوظيفة `RSA_PKCS1_OAEP_PADDING`.

يتطلب استخدام `crypto.constants.RSA_PKCS1_PADDING` في [`crypto.privateDecrypt()`](/ar/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) أن يدعم OpenSSL الرفض الضمني (`rsa_pkcs1_implicit_rejection`). إذا كان إصدار OpenSSL الذي تستخدمه Node.js لا يدعم هذه الميزة، فستفشل محاولة استخدام `RSA_PKCS1_PADDING`.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | تمت إضافة السلسلة و ArrayBuffer و CryptoKey كأنواع مفاتيح مسموح بها. يمكن أن تكون عبارة المرور ArrayBuffer. يمكن أن يكون المخزن المؤقت سلسلة أو ArrayBuffer. تقتصر جميع الأنواع التي تقبل المخازن المؤقتة على 2 ** 31 - 1 بايت كحد أقصى. |
| v11.6.0 | تدعم هذه الدالة الآن كائنات المفاتيح. |
| v1.1.0 | تمت إضافتها في: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) مفتاح خاص مشفر بـ PEM.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) عبارة مرور اختيارية للمفتاح الخاص.
    - `padding` [\<crypto.constants\>](/ar/nodejs/api/crypto#cryptoconstants) قيمة حشو اختيارية محددة في `crypto.constants`، والتي قد تكون: `crypto.constants.RSA_NO_PADDING` أو `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما تكون `buffer` أو `key` أو `passphrase` سلاسل.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) `Buffer` جديد مع المحتوى المشفر.

يقوم بتشفير `buffer` باستخدام `privateKey`. يمكن فك تشفير البيانات التي تم إرجاعها باستخدام المفتاح العام المقابل، على سبيل المثال باستخدام [`crypto.publicDecrypt()`](/ar/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

إذا لم يكن `privateKey` عبارة عن [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الدالة تتصرف كما لو تم تمرير `privateKey` إلى [`crypto.createPrivateKey()`](/ar/nodejs/api/crypto#cryptocreateprivatekeykey). إذا كان كائنًا، فيمكن تمرير خاصية `padding`. بخلاف ذلك، تستخدم هذه الدالة `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | تمت إضافة السلسلة، و ArrayBuffer، و CryptoKey كأنواع مفاتيح مسموح بها. يمكن أن تكون عبارة المرور ArrayBuffer. يمكن أن تكون المخزن المؤقت سلسلة أو ArrayBuffer. تقتصر جميع الأنواع التي تقبل المخازن المؤقتة على حد أقصى يبلغ 2 ** 31 - 1 بايت. |
| الإصدار 11.6.0 | تدعم هذه الوظيفة الآن كائنات المفاتيح. |
| الإصدار 1.1.0 | تمت الإضافة في: الإصدار 1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) عبارة مرور اختيارية للمفتاح الخاص.
    - `padding` [\<crypto.constants\>](/ar/nodejs/api/crypto#cryptoconstants) قيمة حشو اختيارية محددة في `crypto.constants`، والتي قد تكون: `crypto.constants.RSA_NO_PADDING` أو `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما تكون `buffer` أو `key` أو `passphrase` عبارة عن سلاسل.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) `Buffer` جديد بالمحتوى الذي تم فك تشفيره.

يفك تشفير `buffer` باستخدام `key`. تم تشفير `buffer` مسبقًا باستخدام المفتاح الخاص المقابل، على سبيل المثال باستخدام [`crypto.privateEncrypt()`](/ar/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

إذا لم يكن `key` هو [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الوظيفة تتصرف كما لو تم تمرير `key` إلى [`crypto.createPublicKey()`](/ar/nodejs/api/crypto#cryptocreatepublickeykey). إذا كان كائنًا، فيمكن تمرير خاصية `padding`. بخلاف ذلك، تستخدم هذه الوظيفة `RSA_PKCS1_PADDING`.

نظرًا لأنه يمكن اشتقاق المفاتيح العمومية RSA من المفاتيح الخاصة، فيمكن تمرير مفتاح خاص بدلاً من المفتاح العام.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.0.0 | تمت إضافة السلسلة و ArrayBuffer و CryptoKey كأنواع مفاتيح مسموح بها. يمكن أن يكون oaepLabel و passphrase من النوع ArrayBuffers. يمكن أن يكون المخزن المؤقت سلسلة أو ArrayBuffer. تقتصر جميع الأنواع التي تقبل المخازن المؤقتة على 2 ** 31 - 1 بايت كحد أقصى. |
| v12.11.0 | تمت إضافة خيار `oaepLabel`. |
| v12.9.0 | تمت إضافة خيار `oaepHash`. |
| v11.6.0 | تدعم هذه الدالة الآن كائنات المفاتيح. |
| v0.11.14 | تمت إضافتها في: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey) مفتاح عام أو خاص مشفر بتنسيق PEM، أو [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)، أو [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دالة التجزئة لاستخدامها لحشو OAEP و MGF1. **الافتراضي:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) التسمية المراد استخدامها لحشو OAEP. إذا لم يتم تحديدها، فلن يتم استخدام أي تسمية.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) عبارة مرور اختيارية للمفتاح الخاص.
    - `padding` [\<crypto.constants\>](/ar/nodejs/api/crypto#cryptoconstants) قيمة حشو اختيارية محددة في `crypto.constants`، والتي قد تكون: `crypto.constants.RSA_NO_PADDING` أو `crypto.constants.RSA_PKCS1_PADDING` أو `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة المراد استخدامه عندما تكون `buffer` أو `key` أو `oaepLabel` أو `passphrase` سلاسل.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) `Buffer` جديد يحتوي على المحتوى المشفر.

يقوم بتشفير محتوى `buffer` باستخدام `key` ويعيد [`Buffer`](/ar/nodejs/api/buffer) جديدًا يحتوي على المحتوى المشفر. يمكن فك تشفير البيانات التي تم إرجاعها باستخدام المفتاح الخاص المقابل، على سبيل المثال باستخدام [`crypto.privateDecrypt()`](/ar/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

إذا لم يكن `key` من النوع [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الدالة تتصرف كما لو تم تمرير `key` إلى [`crypto.createPublicKey()`](/ar/nodejs/api/crypto#cryptocreatepublickeykey). إذا كان كائنًا، فيمكن تمرير الخاصية `padding`. وإلا، فإن هذه الدالة تستخدم `RSA_PKCS1_OAEP_PADDING`.

نظرًا لأنه يمكن اشتقاق المفاتيح العامة RSA من المفاتيح الخاصة، فيمكن تمرير مفتاح خاص بدلاً من مفتاح عام.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` سيؤدي الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v9.0.0 | تمرير `null` كوسيط `callback` سيؤدي الآن إلى طرح `ERR_INVALID_CALLBACK`. |
| v0.5.8 | تمت إضافته في: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم إنشاؤها. يجب ألا يكون `size` أكبر من `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
  
 
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إذا لم يتم توفير دالة `callback`.

يولد بيانات عشوائية زائفة قوية مشفرة. الوسيط `size` هو رقم يشير إلى عدد البايتات التي سيتم إنشاؤها.

إذا تم توفير دالة `callback`، فسيتم إنشاء البايتات بشكل غير متزامن وسيتم استدعاء دالة `callback` بوسيطين: `err` و `buf`. إذا حدث خطأ، فسيكون `err` كائن `Error`؛ وإلا فإنه سيكون `null`. الوسيط `buf` هو [`Buffer`](/ar/nodejs/api/buffer) يحتوي على البايتات التي تم إنشاؤها.

::: code-group
```js [ESM]
// غير متزامن
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

```js [CJS]
// غير متزامن
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```
:::

إذا لم يتم توفير دالة `callback`، فسيتم إنشاء البايتات العشوائية بشكل متزامن وإرجاعها كـ [`Buffer`](/ar/nodejs/api/buffer). سيتم طرح خطأ إذا كانت هناك مشكلة في إنشاء البايتات.

::: code-group
```js [ESM]
// متزامن
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

```js [CJS]
// متزامن
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```
:::

لن تكتمل طريقة `crypto.randomBytes()` حتى تتوفر إنتروبيا كافية. هذا عادة لا يستغرق أكثر من بضعة أجزاء من الثانية. الوقت الوحيد الذي قد يستغرق فيه إنشاء البايتات العشوائية فترة أطول هو مباشرة بعد التشغيل، عندما يكون النظام بأكمله لا يزال يعاني من نقص في الإنتروبيا.

يستخدم هذا الـ API مجمع سلاسل عمليات libuv، والذي قد يكون له آثار أداء مفاجئة وسلبية على بعض التطبيقات؛ راجع وثائق [`UV_THREADPOOL_SIZE`](/ar/nodejs/api/cli#uv_threadpool_sizesize) لمزيد من المعلومات.

يتم تنفيذ النسخة غير المتزامنة من `crypto.randomBytes()` في طلب واحد لمجمع سلاسل العمليات. لتقليل الاختلاف في طول مهام مجمع سلاسل العمليات، قم بتقسيم طلبات `randomBytes` الكبيرة عند القيام بذلك كجزء من تلبية طلب العميل.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | يؤدي تمرير دالة رد اتصال غير صالحة إلى وسيطة `callback` الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v9.0.0 | يمكن أن تكون وسيطة `buffer` أي `TypedArray` أو `DataView`. |
| الإصدار v7.10.0, v6.13.0 | تمت إضافته في: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يجب توفيره. يجب ألا يتجاوز حجم `buffer` المقدم `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `buffer.length - offset`. يجب ألا يتجاوز `size` القيمة `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

تشبه هذه الدالة [`crypto.randomBytes()`](/ar/nodejs/api/crypto#cryptorandombytessize-callback) ولكنها تتطلب أن تكون الوسيطة الأولى [`Buffer`](/ar/nodejs/api/buffer) سيتم ملؤها. كما أنها تتطلب تمرير دالة رد اتصال.

إذا لم يتم توفير دالة `callback`، فسيتم طرح خطأ.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

يمكن تمرير أي مثيل `ArrayBuffer` أو `TypedArray` أو `DataView` كـ `buffer`.

في حين أن هذا يتضمن مثيلات `Float32Array` و `Float64Array`، يجب عدم استخدام هذه الدالة لإنشاء أرقام عشوائية ذات فاصلة عائمة. قد تحتوي النتيجة على `+Infinity` و `-Infinity` و `NaN`، وحتى إذا كانت المصفوفة تحتوي على أرقام محدودة فقط، فإنها لا يتم سحبها من توزيع عشوائي موحد وليس لها حدود دنيا أو عليا ذات معنى.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```
:::

تستخدم واجهة برمجة التطبيقات هذه تجمع مؤشرات ترابط libuv، والتي يمكن أن يكون لها آثار أداء مفاجئة وسلبية على بعض التطبيقات؛ راجع وثائق [`UV_THREADPOOL_SIZE`](/ar/nodejs/api/cli#uv_threadpool_sizesize) لمزيد من المعلومات.

يتم تنفيذ الإصدار غير المتزامن من `crypto.randomFill()` في طلب واحد لمجمع مؤشرات الترابط. لتقليل التباين في طول مهمة تجمع مؤشرات الترابط، قم بتقسيم طلبات `randomFill` الكبيرة عند القيام بذلك كجزء من تلبية طلب العميل.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | يمكن أن تكون الوسيطة `buffer` أي `TypedArray` أو `DataView`. |
| v7.10.0, v6.13.0 | تمت الإضافة في: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يجب توفيره. يجب ألا يتجاوز حجم `buffer` المتوفر `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `buffer.length - offset`. يجب ألا يتجاوز `size` قيمة `2**31 - 1`.
- الإرجاع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) الكائن الذي تم تمريره كوسيطة `buffer`.

نسخة متزامنة من [`crypto.randomFill()`](/ar/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

يمكن تمرير أي مثيل `ArrayBuffer` أو `TypedArray` أو `DataView` كوسيطة `buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```
:::


### `crypto.randomInt([min, ]max[, callback])` {#cryptorandomintmin-max-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى الوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | تمت إضافته في: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بداية النطاق العشوائي (شاملة). **الافتراضي:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) نهاية النطاق العشوائي (غير شاملة).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

إرجاع عدد صحيح عشوائي `n` بحيث يكون `min \<= n \< max`. يتجنب هذا التنفيذ [تحيز القسمة](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

يجب أن يكون النطاق (`max - min`) أقل من 2. يجب أن يكون `min` و `max` [أعدادًا صحيحة آمنة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

إذا لم يتم توفير دالة `callback`، يتم إنشاء العدد الصحيح العشوائي بشكل متزامن.

::: code-group
```js [ESM]
// غير متزامن
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```

```js [CJS]
// غير متزامن
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// متزامن
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```

```js [CJS]
// متزامن
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// مع الوسيطة `min`
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```

```js [CJS]
// مع الوسيطة `min`
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**تمت الإضافة في: الإصدار v15.6.0، v14.17.0**

- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) بشكل افتراضي، لتحسين الأداء، يقوم Node.js بإنشاء وتخزين بيانات عشوائية كافية لإنشاء ما يصل إلى 128 UUID عشوائي. لإنشاء UUID بدون استخدام ذاكرة التخزين المؤقت، قم بتعيين `disableEntropyCache` إلى `true`. **افتراضي:** `false`.
  
 
- الإرجاع: [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُنشئ RFC 4122 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) الإصدار 4 UUID عشوائي. يتم إنشاء UUID باستخدام مولد أرقام عشوائية زائفة مشفرة.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير دالة استدعاء غير صالحة إلى وسيطة `callback` الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.0.0 | يمكن أن تكون وسيطات كلمة المرور والملح أيضًا مثيلات ArrayBuffer. |
| v12.8.0, v10.17.0 | يمكن أن تكون قيمة `maxmem` الآن أي عدد صحيح آمن. |
| v10.9.0 | تمت إضافة أسماء الخيارات `cost` و`blockSize` و`parallelization`. |
| v10.5.0 | تمت الإضافة في: v10.5.0 |
:::

- `password` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معلمة تكلفة وحدة المعالجة المركزية/الذاكرة. يجب أن يكون قوة للرقم اثنين أكبر من واحد. **افتراضي:** `16384`.
    - `blockSize` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معلمة حجم الكتلة. **افتراضي:** `8`.
    - `parallelization` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معلمة الموازاة. **افتراضي:** `1`.
    - `N` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم بديل لـ `cost`. يمكن تحديد واحد فقط من الاثنين.
    - `r` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم بديل لـ `blockSize`. يمكن تحديد واحد فقط من الاثنين.
    - `p` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم بديل لـ `parallelization`. يمكن تحديد واحد فقط من الاثنين.
    - `maxmem` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأعلى للذاكرة. من الخطأ أن يكون (تقريبًا) `128 * N * r > maxmem`. **افتراضي:** `32 * 1024 * 1024`.
  
 
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
  
 

يوفر تطبيق [scrypt](https://en.wikipedia.org/wiki/Scrypt) غير متزامن. Scrypt هي دالة اشتقاق مفتاح تعتمد على كلمة المرور وهي مصممة لتكون مكلفة حسابيًا ومن حيث الذاكرة من أجل جعل هجمات القوة الغاشمة غير مجدية.

يجب أن يكون `salt` فريدًا قدر الإمكان. يوصى بأن يكون الملح عشوائيًا وطوله 16 بايت على الأقل. راجع [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) للحصول على التفاصيل.

عند تمرير سلاسل نصية لـ `password` أو `salt`، يرجى مراعاة [المحاذير عند استخدام السلاسل النصية كمدخلات لواجهات برمجة التطبيقات المشفرة](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

يتم استدعاء دالة `callback` مع وسيطتين: `err` و `derivedKey`. `err` هو كائن استثناء عند فشل اشتقاق المفتاح، وإلا فإن `err` هو `null`. يتم تمرير `derivedKey` إلى رد الاتصال كـ [`Buffer`](/ar/nodejs/api/buffer).

يتم طرح استثناء عندما تحدد أي من وسيطات الإدخال قيمًا أو أنواعًا غير صالحة.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// استخدام الإعدادات الافتراضية للمصنع.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// استخدام معلمة N مخصصة. يجب أن تكون قوة للرقم اثنين.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// استخدام الإعدادات الافتراضية للمصنع.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// استخدام معلمة N مخصصة. يجب أن تكون قوة للرقم اثنين.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::


### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.8.0, v10.17.0 | يمكن أن تكون قيمة `maxmem` الآن أي عدد صحيح آمن. |
| v10.9.0 | تمت إضافة أسماء الخيارات `cost` و `blockSize` و `parallelization`. |
| v10.5.0 | أُضيف في: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معامل تكلفة وحدة المعالجة المركزية (CPU)/الذاكرة. يجب أن يكون قوة للرقم اثنين أكبر من واحد. **افتراضي:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معامل حجم الكتلة. **افتراضي:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معامل التوازي. **افتراضي:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم مستعار لـ `cost`. يمكن تحديد واحد فقط من الاثنين.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم مستعار لـ `blockSize`. يمكن تحديد واحد فقط من الاثنين.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم مستعار لـ `parallelization`. يمكن تحديد واحد فقط من الاثنين.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأعلى للذاكرة. يعتبر خطأ عندما (تقريبًا) `128 * N * r \> maxmem`. **افتراضي:** `32 * 1024 * 1024`.
 
 
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يوفر تطبيق [scrypt](https://en.wikipedia.org/wiki/Scrypt) متزامن. Scrypt هي دالة اشتقاق مفتاح تعتمد على كلمة المرور ومصممة لتكون مكلفة حسابيًا وذاكرة من أجل جعل هجمات القوة الغاشمة غير مجدية.

يجب أن يكون `salt` فريدًا قدر الإمكان. يوصى بأن يكون الملح عشوائيًا وطوله 16 بايتًا على الأقل. راجع [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) للحصول على التفاصيل.

عند تمرير سلاسل نصية لـ `password` أو `salt`، يرجى مراعاة [المحاذير عند استخدام السلاسل النصية كمدخلات إلى واجهات برمجة تطبيقات التشفير](/ar/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

يتم طرح استثناء عند فشل اشتقاق المفتاح، وإلا يتم إرجاع المفتاح المشتق كـ [`Buffer`](/ar/nodejs/api/buffer).

يتم طرح استثناء عندما تحدد أي من وسيطات الإدخال قيمًا أو أنواعًا غير صالحة.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// استخدام الإعدادات الافتراضية للمصنع.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// استخدام معلمة N مخصصة. يجب أن تكون قوة للرقم اثنين.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// استخدام الإعدادات الافتراضية للمصنع.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// استخدام معلمة N مخصصة. يجب أن تكون قوة للرقم اثنين.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::

### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**أُضيف في: v15.6.0**

- القيمة المعادة: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحجم الكلي المخصص للكومة الآمنة كما هو محدد باستخدام علامة سطر الأوامر `--secure-heap=n`.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأدنى للتخصيص من الكومة الآمنة كما هو محدد باستخدام علامة سطر الأوامر `--secure-heap-min`.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للبايتات المخصصة حاليًا من الكومة الآمنة.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المحسوبة لـ `used` إلى `total` البايتات المخصصة.

### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | دعم المحركات المخصصة في OpenSSL 3 مهمل. |
| v0.11.11 | أُضيف في: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/ar/nodejs/api/crypto#cryptoconstants) **الافتراضي:** `crypto.constants.ENGINE_METHOD_ALL`

قم بتحميل وتعيين `engine` لبعض أو كل وظائف OpenSSL (يتم اختيارها بواسطة العلامات). دعم المحركات المخصصة في OpenSSL مهمل بدءًا من OpenSSL 3.

يمكن أن يكون `engine` إما معرفًا أو مسارًا إلى المكتبة المشتركة للمحرك.

تستخدم وسيطة `flags` الاختيارية `ENGINE_METHOD_ALL` بشكل افتراضي. `flags` عبارة عن حقل بت يأخذ واحدًا أو مزيجًا من العلامات التالية (المحددة في `crypto.constants`):

- `crypto.constants.ENGINE_METHOD_RSA`
- `crypto.constants.ENGINE_METHOD_DSA`
- `crypto.constants.ENGINE_METHOD_DH`
- `crypto.constants.ENGINE_METHOD_RAND`
- `crypto.constants.ENGINE_METHOD_EC`
- `crypto.constants.ENGINE_METHOD_CIPHERS`
- `crypto.constants.ENGINE_METHOD_DIGESTS`
- `crypto.constants.ENGINE_METHOD_PKEY_METHS`
- `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
- `crypto.constants.ENGINE_METHOD_ALL`
- `crypto.constants.ENGINE_METHOD_NONE`


### `crypto.setFips(bool)` {#cryptosetfipsbool}

**تمت الإضافة في: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` لتمكين وضع FIPS.

يقوم بتمكين موفر التشفير المتوافق مع FIPS في إصدار Node.js المُمكن لـ FIPS. يطرح خطأ إذا لم يكن وضع FIPS متاحًا.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.12.0 | تمت إضافة وسيطة استدعاء اختيارية. |
| v13.2.0, v12.16.0 | تدعم هذه الدالة الآن توقيعات IEEE-P1363 DSA و ECDSA. |
| v12.0.0 | تمت الإضافة في: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
  
 
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إذا لم يتم توفير دالة `callback`.

يحسب ويرجع التوقيع لـ `data` باستخدام المفتاح الخاص والخوارزمية المحددين. إذا كانت `algorithm` هي `null` أو `undefined`، فإن الخوارزمية تعتمد على نوع المفتاح (خاصة Ed25519 و Ed448).

إذا لم يكن `key` عبارة عن [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الدالة تتصرف كما لو تم تمرير `key` إلى [`crypto.createPrivateKey()`](/ar/nodejs/api/crypto#cryptocreateprivatekeykey). إذا كان كائنًا، فيمكن تمرير الخصائص الإضافية التالية:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) بالنسبة إلى DSA و ECDSA، يحدد هذا الخيار تنسيق التوقيع الذي تم إنشاؤه. يمكن أن يكون واحدًا مما يلي: 
    - `'der'` (افتراضي): بنية توقيع ASN.1 مشفرة بـ DER تشفير `(r, s)`.
    - `'ieee-p1363'`: تنسيق التوقيع `r || s` كما هو مقترح في IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الحشو الاختيارية لـ RSA، واحدة مما يلي: 
    - `crypto.constants.RSA_PKCS1_PADDING` (افتراضي)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` سيستخدم MGF1 مع نفس دالة التجزئة المستخدمة لتوقيع الرسالة كما هو محدد في القسم 3.1 من [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt). 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول الملح عندما يكون الحشو هو `RSA_PKCS1_PSS_PADDING`. تحدد القيمة الخاصة `crypto.constants.RSA_PSS_SALTLEN_DIGEST` طول الملح لحجم الملخص، بينما تحدد `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (افتراضي) القيمة القصوى المسموح بها. 

إذا تم توفير دالة `callback`، تستخدم هذه الدالة مجمع مؤشرات الترابط الخاص بـ libuv.


### ‏`crypto.subtle` {#cryptosubtle}

**تمت الإضافة في: v17.4.0**

- النوع: [\<SubtleCrypto\>](/ar/nodejs/api/webcrypto#class-subtlecrypto)

اسم مستعار مناسب لـ [`crypto.webcrypto.subtle`](/ar/nodejs/api/webcrypto#class-subtlecrypto).

### ‏`crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن تكون الوسيطتان a و b أيضًا ArrayBuffer. |
| v6.6.0 | تمت الإضافة في: v6.6.0 |
:::

- ‏`a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- ‏`b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تقارن هذه الدالة البايتات الأساسية التي تمثل مثيلات ‏`ArrayBuffer` أو `TypedArray` أو `DataView` المحددة باستخدام خوارزمية ذات وقت ثابت.

لا تسرب هذه الدالة معلومات التوقيت التي قد تسمح للمهاجم بتخمين إحدى القيم. هذا مناسب لمقارنة ملخصات HMAC أو القيم السرية مثل ملفات تعريف الارتباط الخاصة بالمصادقة أو [عناوين URL للقدرات](https://www.w3.org/TR/capability-urls/).

يجب أن يكون كل من `a` و `b` من النوع `Buffer` أو `TypedArray` أو `DataView`، ويجب أن يكون لهما نفس طول البايت. يتم طرح خطأ إذا كان لـ `a` و `b` أطوال بايت مختلفة.

إذا كان أحد `a` و `b` على الأقل من النوع `TypedArray` مع أكثر من بايت واحد لكل إدخال، مثل `Uint16Array`، فسيتم حساب النتيجة باستخدام ترتيب بايتات النظام الأساسي.

**عندما يكون كلا المدخلين عبارة عن <code>Float32Array</code> أو
<code>Float64Array</code>، قد تُرجع هذه الدالة نتائج غير متوقعة بسبب ترميز IEEE 754
للأرقام العشرية. على وجه الخصوص، لا يعني أي من <code>x === y</code> أو
<code>Object.is(x, y)</code> أن التمثيلات البايتية لرقمين عشريين
<code>x</code> و <code>y</code> متساويتان.**

لا يضمن استخدام ‏`crypto.timingSafeEqual` أن يكون الكود *المحيط* آمنًا من حيث التوقيت. يجب توخي الحذر للتأكد من أن الكود المحيط لا يقدم ثغرات أمنية تتعلق بالتوقيت.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` سيؤدي الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.12.0 | تمت إضافة وسيطة رد النداء الاختيارية. |
| v15.0.0 | يمكن أن تكون وسائط البيانات والمفتاح والتوقيع أيضًا ArrayBuffer. |
| v13.2.0, v12.16.0 | تدعم هذه الدالة الآن تواقيع IEEE-P1363 DSA و ECDSA. |
| v12.0.0 | تمت إضافته في: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` أو `false` اعتمادًا على صلاحية التوقيع للبيانات والمفتاح العام إذا لم يتم توفير دالة `callback`.

للتحقق من التوقيع المحدد لـ `data` باستخدام المفتاح والخوارزمية المحددين. إذا كانت `algorithm` هي `null` أو `undefined`، فإن الخوارزمية تعتمد على نوع المفتاح (خاصة Ed25519 و Ed448).

إذا لم يكن `key` هو [`KeyObject`](/ar/nodejs/api/crypto#class-keyobject)، فإن هذه الدالة تتصرف كما لو تم تمرير `key` إلى [`crypto.createPublicKey()`](/ar/nodejs/api/crypto#cryptocreatepublickeykey). إذا كان كائنًا، فيمكن تمرير الخصائص الإضافية التالية:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) بالنسبة إلى DSA و ECDSA، يحدد هذا الخيار تنسيق التوقيع. يمكن أن يكون واحدًا مما يلي:
    - `'der'` (افتراضي): بنية توقيع ASN.1 المشفرة بـ DER والتي تشفر `(r, s)`.
    - `'ieee-p1363'`: تنسيق التوقيع `r || s` كما هو مقترح في IEEE-P1363.


-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة حشو اختيارية لـ RSA، واحدة مما يلي:
    - `crypto.constants.RSA_PKCS1_PADDING` (افتراضي)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

سيستخدم `RSA_PKCS1_PSS_PADDING` MGF1 بنفس وظيفة التجزئة المستخدمة لتوقيع الرسالة كما هو محدد في القسم 3.1 من [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول الملح عندما يكون الحشو هو `RSA_PKCS1_PSS_PADDING`. القيمة الخاصة `crypto.constants.RSA_PSS_SALTLEN_DIGEST` تحدد طول الملح لحجم الملخص، و `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (افتراضي) تحدده للقيمة القصوى المسموح بها.

وسيطة `signature` هي التوقيع الذي تم حسابه مسبقًا لـ `data`.

نظرًا لأنه يمكن اشتقاق المفاتيح العامة من المفاتيح الخاصة، فيمكن تمرير مفتاح خاص أو مفتاح عام لـ `key`.

إذا تم توفير دالة `callback`، فستستخدم هذه الدالة تجمع مؤشرات الترابط الخاص بـ libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**أضيف في: الإصدار 15.0.0**

النوع: [\<Crypto\>](/ar/nodejs/api/webcrypto#class-crypto) تطبيق لمعيار Web Crypto API.

راجع [وثائق Web Crypto API](/ar/nodejs/api/webcrypto) للحصول على التفاصيل.

## ملاحظات {#notes}

### استخدام السلاسل كمدخلات لواجهات برمجة تطبيقات التشفير {#using-strings-as-inputs-to-cryptographic-apis}

لأسباب تاريخية، تقبل العديد من واجهات برمجة تطبيقات التشفير التي توفرها Node.js السلاسل كمدخلات حيث تعمل خوارزمية التشفير الأساسية على تسلسلات البايت. تتضمن هذه الحالات النصوص العادية، والنصوص المشفرة، والمفاتيح المتماثلة، ومتجهات التهيئة، وعبارات المرور، والأملاح، وعلامات المصادقة، والبيانات الأصلية الإضافية.

عند تمرير السلاسل إلى واجهات برمجة تطبيقات التشفير، ضع في اعتبارك العوامل التالية.

- ليست كل تسلسلات البايت سلاسل UTF-8 صالحة. لذلك، عندما يتم اشتقاق تسلسل بايت بطول `n` من سلسلة، يكون إنتروبيها بشكل عام أقل من إنتروبيا تسلسل بايت عشوائي أو شبه عشوائي بطول `n`. على سبيل المثال، لن تؤدي أي سلسلة UTF-8 إلى تسلسل البايت `c0 af`. يجب أن تكون المفاتيح السرية بشكل حصري تقريبًا تسلسلات بايت عشوائية أو شبه عشوائية.
- وبالمثل، عند تحويل تسلسلات البايت العشوائية أو شبه العشوائية إلى سلاسل UTF-8، قد يتم استبدال التسلسلات الفرعية التي لا تمثل نقاط رمز صالحة بحرف الاستبدال Unicode (`U+FFFD`). قد لا يكون تمثيل البايت لسلسلة Unicode الناتجة مساويًا لتسلسل البايت الذي تم إنشاء السلسلة منه. إن مخرجات الخوارزميات المشفرة، ووظائف التجزئة، وخوارزميات التوقيع، ووظائف اشتقاق المفاتيح هي تسلسلات بايت شبه عشوائية ولا ينبغي استخدامها كسلاسل Unicode.
- عندما يتم الحصول على السلاسل من إدخال المستخدم، يمكن تمثيل بعض أحرف Unicode بطرق مكافئة متعددة تؤدي إلى تسلسلات بايت مختلفة. على سبيل المثال، عند تمرير عبارة مرور مستخدم إلى وظيفة اشتقاق مفتاح، مثل PBKDF2 أو scrypt، تعتمد نتيجة وظيفة اشتقاق المفتاح على ما إذا كانت السلسلة تستخدم أحرفًا مركبة أو مفككة. لا تقوم Node.js بتطبيع تمثيلات الأحرف. يجب على المطورين التفكير في استخدام [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) على مدخلات المستخدم قبل تمريرها إلى واجهات برمجة تطبيقات التشفير.


### واجهة برمجة تطبيقات التدفقات القديمة (قبل Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

تمت إضافة وحدة Crypto إلى Node.js قبل وجود مفهوم واجهة برمجة تطبيقات التدفقات الموحدة، وقبل وجود كائنات [`Buffer`](/ar/nodejs/api/buffer) للتعامل مع البيانات الثنائية. على هذا النحو، تحتوي العديد من فئات `crypto` على طرق غير موجودة عادةً في فئات Node.js الأخرى التي تنفذ واجهة برمجة تطبيقات [التدفقات](/ar/nodejs/api/stream) (مثل `update()` أو `final()` أو `digest()`). أيضًا، قبلت العديد من الطرق وأرجعت سلاسل مشفرة بـ `'latin1'` افتراضيًا بدلاً من `Buffer`s. تم تغيير هذا الافتراضي بعد Node.js v0.8 لاستخدام كائنات [`Buffer`](/ar/nodejs/api/buffer) افتراضيًا بدلاً من ذلك.

### دعم الخوارزميات الضعيفة أو المخترقة {#support-for-weak-or-compromised-algorithms}

لا تزال وحدة `node:crypto` تدعم بعض الخوارزميات التي تم اختراقها بالفعل ولا يُنصح باستخدامها. تسمح واجهة برمجة التطبيقات أيضًا باستخدام الأصفار والتجزئة بأحجام مفاتيح صغيرة جدًا وهي ضعيفة جدًا للاستخدام الآمن.

يجب على المستخدمين تحمل المسؤولية الكاملة عن تحديد خوارزمية التشفير وحجم المفتاح وفقًا لمتطلباتهم الأمنية.

بناءً على توصيات [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf):

- لم يعد MD5 و SHA-1 مقبولين حيث تكون مقاومة التصادم مطلوبة مثل التوقيعات الرقمية.
- يوصى بأن يكون للمفتاح المستخدم مع خوارزميات RSA و DSA و DH 2048 بتًا على الأقل وأن يكون لمنحنى ECDSA و ECDH 224 بتًا على الأقل، ليكون آمنًا للاستخدام لعدة سنوات.
- مجموعات DH الخاصة بـ `modp1` و `modp2` و `modp5` لها حجم مفتاح أصغر من 2048 بتًا ولا يُنصح بها.

راجع المرجع للحصول على توصيات وتفاصيل أخرى.

بعض الخوارزميات التي لها نقاط ضعف معروفة وليس لها أهمية كبيرة في الممارسة العملية متاحة فقط من خلال [موفر الإرث](/ar/nodejs/api/cli#--openssl-legacy-provider)، والذي لم يتم تمكينه افتراضيًا.

### وضع CCM {#ccm-mode}

CCM هي إحدى [خوارزميات AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption) المدعومة. يجب على التطبيقات التي تستخدم هذا الوضع الالتزام بقيود معينة عند استخدام واجهة برمجة تطبيقات التشفير:

- يجب تحديد طول علامة المصادقة أثناء إنشاء التشفير عن طريق تعيين خيار `authTagLength` ويجب أن يكون أحد القيم 4 أو 6 أو 8 أو 10 أو 12 أو 14 أو 16 بايت.
- يجب أن يكون طول متجه التهيئة (nonce) `N` بين 7 و 13 بايت (`7 ≤ N ≤ 13`).
- يقتصر طول النص العادي على `2 ** (8 * (15 - N))` بايت.
- عند فك التشفير، يجب تعيين علامة المصادقة عبر `setAuthTag()` قبل استدعاء `update()`. وإلا، فسيفشل فك التشفير وستطرح `final()` خطأً امتثالاً للقسم 2.6 من [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt).
- قد تفشل طرق التدفق مثل `write(data)` أو `end(data)` أو `pipe()` في وضع CCM لأن CCM لا يمكنه التعامل مع أكثر من قطعة بيانات واحدة لكل مثيل.
- عند تمرير بيانات مصادقة إضافية (AAD)، يجب تمرير طول الرسالة الفعلية بالبايت إلى `setAAD()` عبر خيار `plaintextLength`. تتضمن العديد من مكتبات التشفير علامة المصادقة في النص المشفر، مما يعني أنها تنتج نصوصًا مشفرة بطول `plaintextLength + authTagLength`. لا تتضمن Node.js علامة المصادقة، لذا فإن طول النص المشفر هو دائمًا `plaintextLength`. هذا ليس ضروريًا إذا لم يتم استخدام AAD.
- نظرًا لأن CCM يعالج الرسالة بأكملها مرة واحدة، يجب استدعاء `update()` مرة واحدة بالضبط.
- على الرغم من أن استدعاء `update()` يكفي لتشفير/فك تشفير الرسالة، إلا أنه *يجب* على التطبيقات استدعاء `final()` لحساب علامة المصادقة أو التحقق منها.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```js [CJS]
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```
:::


### وضع FIPS {#fips-mode}

عند استخدام OpenSSL 3، يدعم Node.js معيار FIPS 140-2 عند استخدامه مع موفر OpenSSL 3 مناسب، مثل [موفر FIPS من OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider) الذي يمكن تثبيته باتباع التعليمات الواردة في [ملف README الخاص بـ FIPS من OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md).

لدعم FIPS في Node.js، ستحتاج إلى:

- موفر OpenSSL 3 FIPS مثبت بشكل صحيح.
- [ملف تكوين وحدة FIPS](https://www.openssl.org/docs/man3.0/man5/fips_config) الخاص بـ OpenSSL 3.
- ملف تكوين OpenSSL 3 يشير إلى ملف تكوين وحدة FIPS.

يجب تكوين Node.js بملف تكوين OpenSSL يشير إلى موفر FIPS. يبدو ملف التكوين النموذجي كما يلي:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<المسار المطلق>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# يجب أن يتطابق اسم قسم fips مع اسم القسم داخل {#the-fips-section-name-should-match-the-section-name-inside-the}
# fipsmodule.cnf المضمن.
fips = fips_sect

[default_sect]
activate = 1
```
حيث `fipsmodule.cnf` هو ملف تكوين وحدة FIPS الذي تم إنشاؤه من خطوة تثبيت موفر FIPS:

```bash [BASH]
openssl fipsinstall
```
عيّن متغير البيئة `OPENSSL_CONF` للإشارة إلى ملف التكوين الخاص بك و `OPENSSL_MODULES` إلى موقع المكتبة الديناميكية لموفر FIPS. على سبيل المثال

```bash [BASH]
export OPENSSL_CONF=/<المسار إلى ملف التكوين>/nodejs.cnf
export OPENSSL_MODULES=/<المسار إلى مكتبة openssl>/ossl-modules
```
يمكن بعد ذلك تمكين وضع FIPS في Node.js إما عن طريق:

- بدء Node.js باستخدام علامات سطر الأوامر `--enable-fips` أو `--force-fips`.
- استدعاء `crypto.setFips(true)` برمجيًا.

اختياريًا، يمكن تمكين وضع FIPS في Node.js عبر ملف تكوين OpenSSL. على سبيل المثال

```text [TEXT]
nodejs_conf = nodejs_init

.include /<المسار المطلق>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# يجب أن يتطابق اسم قسم fips مع اسم القسم داخل {#included-fipsmodulecnf}
# fipsmodule.cnf المضمن.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## ثوابت التشفير {#the-fips-section-name-should-match-the-section-name-inside-the_1}

تنطبق الثوابت التالية التي يتم تصديرها بواسطة `crypto.constants` على استخدامات متنوعة لوحدات `node:crypto` و `node:tls` و `node:https` وهي بشكل عام خاصة بـ OpenSSL.

### خيارات OpenSSL {#included-fipsmodulecnf_1}

راجع [قائمة علامات SSL OP](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options) للحصول على التفاصيل.

| ثابت | الوصف |
| --- | --- |
| `SSL_OP_ALL` | يطبق العديد من الحلول البديلة للأخطاء داخل OpenSSL. انظر       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)       للحصول على التفاصيل. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | يعطي تعليمات لـ OpenSSL للسماح بوضع تبادل المفاتيح غير القائم على [EC]DHE     لـ TLS v1.3 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | يسمح بإعادة التفاوض غير الآمنة القديمة بين OpenSSL والعملاء أو الخوادم     غير المصححة. انظر       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | يحاول استخدام تفضيلات الخادم بدلاً من تفضيلات العميل عند     تحديد الشفرة. يعتمد السلوك على إصدار البروتوكول. انظر       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CISCO_ANYCONNECT` | يعطي تعليمات لـ OpenSSL لاستخدام مُعرّف إصدار Cisco لـ DTLS_BAD_VER. |
| `SSL_OP_COOKIE_EXCHANGE` | يعطي تعليمات لـ OpenSSL لتشغيل تبادل ملفات تعريف الارتباط. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | يعطي تعليمات لـ OpenSSL لإضافة ملحق ترحيب الخادم من إصدار مبكر     من مسودة cryptopro. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | يعطي تعليمات لـ OpenSSL لتعطيل حل بديل لثغرة أمنية في SSL 3.0/TLS 1.0     تمت إضافته في OpenSSL 0.9.6d. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | يسمح بالاتصال الأولي بالخوادم التي لا تدعم RI. |
| `SSL_OP_NO_COMPRESSION` | يعطي تعليمات لـ OpenSSL لتعطيل دعم ضغط SSL/TLS. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | يعطي تعليمات لـ OpenSSL لتعطيل التشفير ثم MAC. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | يعطي تعليمات لـ OpenSSL لتعطيل إعادة التفاوض. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | يعطي تعليمات لـ OpenSSL لبدء جلسة جديدة دائمًا عند إجراء     إعادة التفاوض. |
| `SSL_OP_NO_SSLv2` | يعطي تعليمات لـ OpenSSL لإيقاف تشغيل SSL v2 |
| `SSL_OP_NO_SSLv3` | يعطي تعليمات لـ OpenSSL لإيقاف تشغيل SSL v3 |
| `SSL_OP_NO_TICKET` | يعطي تعليمات لـ OpenSSL لتعطيل استخدام تذاكر RFC4507bis. |
| `SSL_OP_NO_TLSv1` | يعطي تعليمات لـ OpenSSL لإيقاف تشغيل TLS v1 |
| `SSL_OP_NO_TLSv1_1` | يعطي تعليمات لـ OpenSSL لإيقاف تشغيل TLS v1.1 |
| `SSL_OP_NO_TLSv1_2` | يعطي تعليمات لـ OpenSSL لإيقاف تشغيل TLS v1.2 |
| `SSL_OP_NO_TLSv1_3` | يعطي تعليمات لـ OpenSSL لإيقاف تشغيل TLS v1.3 |
| `SSL_OP_PRIORITIZE_CHACHA` | يعطي تعليمات لخادم OpenSSL لإعطاء الأولوية لـ ChaCha20-Poly1305     عندما يقوم العميل بذلك.     ليس لهذا الخيار أي تأثير إذا       لم يتم تمكين `SSL_OP_CIPHER_SERVER_PREFERENCE`. |
| `SSL_OP_TLS_ROLLBACK_BUG` | يعطي تعليمات لـ OpenSSL لتعطيل الكشف عن هجوم التراجع في الإصدار. |

### ثوابت محرك OpenSSL {#crypto-constants}

| الثابت | الوصف |
| --- | --- |
| `ENGINE_METHOD_RSA` | تقييد استخدام المحرك بـ RSA |
| `ENGINE_METHOD_DSA` | تقييد استخدام المحرك بـ DSA |
| `ENGINE_METHOD_DH` | تقييد استخدام المحرك بـ DH |
| `ENGINE_METHOD_RAND` | تقييد استخدام المحرك بـ RAND |
| `ENGINE_METHOD_EC` | تقييد استخدام المحرك بـ EC |
| `ENGINE_METHOD_CIPHERS` | تقييد استخدام المحرك بـ CIPHERS |
| `ENGINE_METHOD_DIGESTS` | تقييد استخدام المحرك بـ DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | تقييد استخدام المحرك بـ PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | تقييد استخدام المحرك بـ PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### ثوابت OpenSSL أخرى {#openssl-options}

| الثابت | الوصف |
| --- | --- |
| `DH_CHECK_P_NOT_SAFE_PRIME` ||
| `DH_CHECK_P_NOT_PRIME` ||
| `DH_UNABLE_TO_CHECK_GENERATOR` ||
| `DH_NOT_SUITABLE_GENERATOR` ||
| `RSA_PKCS1_PADDING` ||
| `RSA_SSLV23_PADDING` ||
| `RSA_NO_PADDING` ||
| `RSA_PKCS1_OAEP_PADDING` ||
| `RSA_X931_PADDING` ||
| `RSA_PKCS1_PSS_PADDING` ||
| `RSA_PSS_SALTLEN_DIGEST` | يعين طول الملح لـ  `RSA_PKCS1_PSS_PADDING`  إلى حجم التلخيص عند التوقيع أو التحقق. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | يعين طول الملح لـ  `RSA_PKCS1_PSS_PADDING`  إلى القيمة القصوى المسموح بها عند توقيع البيانات. |
| `RSA_PSS_SALTLEN_AUTO` | يتسبب في تحديد طول الملح لـ  `RSA_PKCS1_PSS_PADDING`  تلقائيًا عند التحقق من التوقيع. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### ثوابت تشفير Node.js {#openssl-engine-constants}

| الثابت | الوصف |
| --- | --- |
| `defaultCoreCipherList` | يحدد قائمة الشفرات الافتراضية المضمنة المستخدمة بواسطة Node.js. |
| `defaultCipherList` | يحدد قائمة الشفرات الافتراضية النشطة المستخدمة بواسطة عملية Node.js الحالية. |

