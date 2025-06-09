---
title: توثيق Buffer في Node.js
description: يوفر توثيق Buffer في Node.js معلومات مفصلة حول كيفية التعامل مع البيانات الثنائية في Node.js، بما في ذلك إنشاء الـ buffers، والتلاعب بها، وتحويلها.
head:
  - - meta
    - name: og:title
      content: توثيق Buffer في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يوفر توثيق Buffer في Node.js معلومات مفصلة حول كيفية التعامل مع البيانات الثنائية في Node.js، بما في ذلك إنشاء الـ buffers، والتلاعب بها، وتحويلها.
  - - meta
    - name: twitter:title
      content: توثيق Buffer في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يوفر توثيق Buffer في Node.js معلومات مفصلة حول كيفية التعامل مع البيانات الثنائية في Node.js، بما في ذلك إنشاء الـ buffers، والتلاعب بها، وتحويلها.
---


# Buffer {#buffer}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

تُستخدم كائنات `Buffer` لتمثيل سلسلة ذات طول ثابت من البايتات. تدعم العديد من واجهات برمجة التطبيقات (APIs) الخاصة بـ Node.js كائنات `Buffer`.

فئة `Buffer` هي فئة فرعية من فئة JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) وتوسعها بطرق تغطي حالات استخدام إضافية. تقبل واجهات برمجة التطبيقات (APIs) الخاصة بـ Node.js كائنات [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) العادية حيث يتم دعم كائنات `Buffer` أيضًا.

في حين أن فئة `Buffer` متاحة ضمن النطاق العام، إلا أنه لا يزال من المستحسن الرجوع إليها بشكل صريح عبر عبارة استيراد أو طلب.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// إنشاء Buffer مملوءة بالأصفار بطول 10.
const buf1 = Buffer.alloc(10);

// إنشاء Buffer بطول 10،
// مملوءة ببايتات لها القيمة `1`.
const buf2 = Buffer.alloc(10, 1);

// إنشاء buffer غير مهيأة بطول 10.
// هذا أسرع من استدعاء Buffer.alloc() ولكن المثيل
// Buffer الذي تم إرجاعه قد يحتوي على بيانات قديمة يجب
// الكتابة فوقها باستخدام fill() أو write() أو وظائف أخرى تملأ محتويات Buffer.
const buf3 = Buffer.allocUnsafe(10);

// إنشاء Buffer تحتوي على البايتات [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// إنشاء Buffer تحتوي على البايتات [1, 1, 1, 1] – الإدخالات
// يتم اقتطاعها جميعًا باستخدام `(value & 255)` لتناسب النطاق 0-255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// إنشاء Buffer تحتوي على البايتات المشفرة بـ UTF-8 للسلسلة 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (بالتدوين الست عشري)
// [116, 195, 169, 115, 116] (بالتدوين العشري)
const buf6 = Buffer.from('tést');

// إنشاء Buffer تحتوي على بايتات Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// إنشاء Buffer مملوءة بالأصفار بطول 10.
const buf1 = Buffer.alloc(10);

// إنشاء Buffer بطول 10،
// مملوءة ببايتات لها القيمة `1`.
const buf2 = Buffer.alloc(10, 1);

// إنشاء buffer غير مهيأة بطول 10.
// هذا أسرع من استدعاء Buffer.alloc() ولكن المثيل
// Buffer الذي تم إرجاعه قد يحتوي على بيانات قديمة يجب
// الكتابة فوقها باستخدام fill() أو write() أو وظائف أخرى تملأ محتويات Buffer.
const buf3 = Buffer.allocUnsafe(10);

// إنشاء Buffer تحتوي على البايتات [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// إنشاء Buffer تحتوي على البايتات [1, 1, 1, 1] – الإدخالات
// يتم اقتطاعها جميعًا باستخدام `(value & 255)` لتناسب النطاق 0-255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// إنشاء Buffer تحتوي على البايتات المشفرة بـ UTF-8 للسلسلة 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (بالتدوين الست عشري)
// [116, 195, 169, 115, 116] (بالتدوين العشري)
const buf6 = Buffer.from('tést');

// إنشاء Buffer تحتوي على بايتات Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## المخازن المؤقتة وتشفيرات الأحرف {#buffers-and-character-encodings}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.7.0، الإصدار 14.18.0 | تم تقديم تشفير `base64url`. |
| الإصدار 6.4.0 | تم تقديم `latin1` كاسم مستعار لـ `binary`. |
| الإصدار 5.0.0 | تمت إزالة التشفيرين المهملين `raw` و `raws`. |
:::

عند التحويل بين `Buffer` والسلاسل النصية، يمكن تحديد تشفير الأحرف. إذا لم يتم تحديد تشفير الأحرف، فسيتم استخدام UTF-8 كإعداد افتراضي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

تقبل مخازن Node.js المؤقتة جميع اختلافات حالة سلاسل التشفير التي تتلقاها. على سبيل المثال، يمكن تحديد UTF-8 كـ `'utf8'` أو `'UTF8'` أو `'uTf8'`.

تشفيرات الأحرف المدعومة حاليًا بواسطة Node.js هي:

-  `'utf8'` (اسم مستعار: `'utf-8'`): أحرف Unicode مشفرة متعددة البايت. تستخدم العديد من صفحات الويب وتنسيقات المستندات الأخرى [UTF-8](https://en.wikipedia.org/wiki/UTF-8). هذا هو تشفير الأحرف الافتراضي. عند فك ترميز `Buffer` إلى سلسلة لا تحتوي حصريًا على بيانات UTF-8 صالحة، سيتم استخدام حرف استبدال Unicode `U+FFFD` � لتمثيل تلك الأخطاء.
-  `'utf16le'` (اسم مستعار: `'utf-16le'`): أحرف Unicode مشفرة متعددة البايت. على عكس `'utf8'`، سيتم ترميز كل حرف في السلسلة باستخدام 2 أو 4 بايتات. يدعم Node.js فقط البديل [little-endian](https://en.wikipedia.org/wiki/Endianness) لـ [UTF-16](https://en.wikipedia.org/wiki/UTF-16).
-  `'latin1'`: يرمز Latin-1 إلى [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1). يدعم هذا التشفير الأحرف Unicode فقط من `U+0000` إلى `U+00FF`. يتم ترميز كل حرف باستخدام بايت واحد. يتم اقتطاع الأحرف التي لا تتناسب مع هذا النطاق وسيتم تعيينها على أحرف في هذا النطاق.

يشار إلى تحويل `Buffer` إلى سلسلة باستخدام أحد الخيارات المذكورة أعلاه باسم فك التشفير، ويشار إلى تحويل سلسلة إلى `Buffer` باسم التشفير.

يدعم Node.js أيضًا تشفيرات ثنائية إلى نص التالية. بالنسبة إلى التشفيرات الثنائية إلى النص، يتم عكس اصطلاح التسمية: يشار عادةً إلى تحويل `Buffer` إلى سلسلة باسم التشفير، ويشار إلى تحويل سلسلة إلى `Buffer` باسم فك التشفير.

-  `'base64'`: ترميز [Base64](https://en.wikipedia.org/wiki/Base64). عند إنشاء `Buffer` من سلسلة، سيقبل هذا التشفير أيضًا بشكل صحيح "أبجدية آمنة لعنوان URL واسم الملف" كما هو محدد في [RFC 4648، القسم 5](https://tools.ietf.org/html/rfc4648#section-5). يتم تجاهل أحرف المسافة البيضاء مثل المسافات وعلامات التبويب والأسطر الجديدة الموجودة داخل سلسلة base64 المشفرة.
-  `'base64url'`: ترميز [base64url](https://tools.ietf.org/html/rfc4648#section-5) كما هو محدد في [RFC 4648، القسم 5](https://tools.ietf.org/html/rfc4648#section-5). عند إنشاء `Buffer` من سلسلة، سيقبل هذا التشفير أيضًا بشكل صحيح سلاسل base64 المشفرة العادية. عند ترميز `Buffer` إلى سلسلة، سيحذف هذا التشفير الحشو.
-  `'hex'`: ترميز كل بايت كحرفين سداسيين عشريين. قد يحدث اقتطاع البيانات عند فك ترميز السلاسل التي لا تتكون حصريًا من عدد زوجي من الأحرف السداسية العشرية. انظر أدناه للحصول على مثال.

تشفيرات الأحرف القديمة التالية مدعومة أيضًا:

-  `'ascii'`: لبيانات [ASCII](https://en.wikipedia.org/wiki/ASCII) ذات 7 بت فقط. عند ترميز سلسلة إلى `Buffer`، يكون هذا مكافئًا لاستخدام `'latin1'`. عند فك ترميز `Buffer` إلى سلسلة، سيؤدي استخدام هذا التشفير أيضًا إلى إلغاء تعيين البت الأعلى من كل بايت قبل فك الترميز كـ `'latin1'`. بشكل عام، لا ينبغي أن يكون هناك سبب لاستخدام هذا التشفير، لأن `'utf8'` (أو، إذا كان من المعروف أن البيانات دائمًا ASCII فقط، `'latin1'`) سيكون خيارًا أفضل عند ترميز أو فك ترميز نص ASCII فقط. يتم توفيره فقط للتوافق القديم.
-  `'binary'`: اسم مستعار لـ `'latin1'`. يمكن أن يكون اسم هذا التشفير مضللاً للغاية، حيث أن جميع التشفيرات المدرجة هنا تحول بين السلاسل والبيانات الثنائية. للتحويل بين السلاسل و `Buffer`s، عادةً ما يكون `'utf8'` هو الخيار الصحيح.
-  `'ucs2'`, `'ucs-2'`: أسماء مستعارة لـ `'utf16le'`. اعتادت UCS-2 الإشارة إلى متغير من UTF-16 لم يدعم الأحرف التي تحتوي على نقاط رمز أكبر من U+FFFF. في Node.js، يتم دائمًا دعم نقاط الرمز هذه.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>، يتم اقتطاع البيانات عند أول قيمة غير سداسية عشرية
// ('g') تمت مواجهتها.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>، يتم اقتطاع البيانات عندما تنتهي البيانات برقم فردي ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>، يتم تمثيل جميع البيانات.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>، يتم اقتطاع البيانات عند أول قيمة غير سداسية عشرية
// ('g') تمت مواجهتها.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>، يتم اقتطاع البيانات عندما تنتهي البيانات برقم فردي ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>، يتم تمثيل جميع البيانات.
```
:::

تتبع متصفحات الويب الحديثة [معيار ترميز WHATWG](https://encoding.spec.whatwg.org/) الذي يربط كلا من `'latin1'` و `'ISO-8859-1'` بـ `'win-1252'`. هذا يعني أنه أثناء القيام بشيء مثل `http.get()`، إذا كانت مجموعة الأحرف التي تم إرجاعها هي إحدى تلك المدرجة في مواصفات WHATWG، فمن المحتمل أن يكون الخادم قد أرجع بالفعل بيانات مشفرة بـ `'win-1252'`، وقد يؤدي استخدام ترميز `'latin1'` إلى فك ترميز الأحرف بشكل غير صحيح.


## المخازن المؤقتة والمصفوفات المكتوبة {#buffers-and-typedarrays}


::: info [تاريخ]
| الإصدار | التغييرات |
|---|---|
| الإصدار 3.0.0 | يرث صنف `Buffer` الآن من `Uint8Array`. |
:::

تعتبر مثيلات `Buffer` أيضًا مثيلات JavaScript لـ [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) و [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). تتوفر جميع طرق [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) على `Buffer`s. ومع ذلك، هناك اختلافات دقيقة بين واجهة برمجة تطبيقات `Buffer` وواجهة برمجة تطبيقات [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

على وجه الخصوص:

- بينما [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) تنشئ نسخة من جزء من `TypedArray`، فإن [`Buffer.prototype.slice()`](/ar/nodejs/api/buffer#bufslicestart-end) تنشئ عرضًا على `Buffer` الموجودة بدون نسخ. قد يكون هذا السلوك مفاجئًا، ولا يوجد إلا للتوافق مع الإصدارات القديمة. يمكن استخدام [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) لتحقيق سلوك [`Buffer.prototype.slice()`](/ar/nodejs/api/buffer#bufslicestart-end) على كل من `Buffer`s و `TypedArray`s الأخرى ويجب تفضيلها.
- [`buf.toString()`](/ar/nodejs/api/buffer#buftostringencoding-start-end) غير متوافق مع مكافئه في `TypedArray`.
- يدعم عدد من الطرق، على سبيل المثال [`buf.indexOf()`](/ar/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)، وسائط إضافية.

هناك طريقتان لإنشاء مثيلات [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) جديدة من `Buffer`:

- سيؤدي تمرير `Buffer` إلى مُنشئ [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) إلى نسخ محتويات `Buffer`، وتفسيرها كمجموعة من الأعداد الصحيحة، وليس كسلسلة بايت من النوع الهدف.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- سيؤدي تمرير [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) الأساسي لـ `Buffer` إلى إنشاء [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) تشترك في ذاكرتها مع `Buffer`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

من الممكن إنشاء `Buffer` جديد يشارك نفس الذاكرة المخصصة مثل مثيل [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) باستخدام خاصية `.buffer` لكائن `TypedArray` بنفس الطريقة. يتصرف [`Buffer.from()`](/ar/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) مثل `new Uint8Array()` في هذا السياق.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

عند إنشاء `Buffer` باستخدام `.buffer` الخاص بـ [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)، من الممكن استخدام جزء فقط من [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) الأساسي عن طريق تمرير معلمات `byteOffset` و `length`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

لدى `Buffer.from()` و [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) تواقيع وتنفيذات مختلفة. على وجه التحديد، تقبل متغيرات [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) وسيطة ثانية هي دالة تعيين يتم استدعاؤها على كل عنصر من عناصر المصفوفة المكتوبة:

- `TypedArray.from(source[, mapFn[, thisArg]])`

ومع ذلك، لا تدعم طريقة `Buffer.from()` استخدام دالة التعيين:

- [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/ar/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ar/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## المخازن المؤقتة والتكرار {#buffers-and-iteration}

يمكن تكرار مثيلات `Buffer` باستخدام بناء الجملة `for..of`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```
:::

بالإضافة إلى ذلك، يمكن استخدام الطرق [`buf.values()`](/ar/nodejs/api/buffer#bufvalues) و [`buf.keys()`](/ar/nodejs/api/buffer#bufkeys) و [`buf.entries()`](/ar/nodejs/api/buffer#bufentries) لإنشاء مكررات.

## الفئة: `Blob` {#class-blob}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0, v16.17.0 | لم تعد تجريبية. |
| v15.7.0, v14.18.0 | تمت الإضافة في: v15.7.0, v14.18.0 |
:::

تغلف [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) بيانات أولية غير قابلة للتغيير يمكن مشاركتها بأمان عبر سلاسل عامل متعددة.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.7.0 | تمت إضافة خيار `endings` القياسي لاستبدال نهايات الأسطر، وإزالة خيار `encoding` غير القياسي. |
| v15.7.0, v14.18.0 | تمت الإضافة في: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ar/nodejs/api/buffer#class-blob) مصفوفة من الكائنات string أو [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) أو [\<Blob\>](/ar/nodejs/api/buffer#class-blob)، أو أي مزيج من هذه الكائنات، والتي سيتم تخزينها داخل `Blob`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'transparent'` أو `'native'`. عند التعيين إلى `'native'`، سيتم تحويل نهايات الأسطر في أجزاء مصدر السلسلة إلى نهاية السطر الأصلية للنظام الأساسي كما هو محدد بواسطة `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع محتوى Blob. الغرض هو أن ينقل `type` نوع وسائط MIME للبيانات، ولكن لا يتم إجراء أي تحقق من صحة تنسيق النوع.

ينشئ كائن `Blob` جديدًا يحتوي على تسلسل للمصادر المحددة.

يتم نسخ مصادر [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) و [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) و [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) و [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إلى 'Blob' وبالتالي يمكن تعديلها بأمان بعد إنشاء 'Blob'.

يتم ترميز مصادر السلسلة كسلاسل بايت UTF-8 ونسخها إلى Blob. سيتم استبدال أزواج الاستبدال غير المتطابقة داخل كل جزء سلسلة بأحرف الاستبدال Unicode U+FFFD.


### `blob.arrayBuffer()` {#blobarraybuffer}

**أُضيف في: v15.7.0, v14.18.0**

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

يُرجع وعدًا يتحقق مع [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) يحتوي على نسخة من بيانات `Blob`.

#### `blob.bytes()` {#blobbytes}

**أُضيف في: v22.3.0, v20.16.0**

تُرجع الطريقة `blob.bytes()` بايتات كائن `Blob` كـ `Promise\<Uint8Array\>`.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Outputs: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**أُضيف في: v15.7.0, v14.18.0**

الحجم الكلي لـ `Blob` بالبايت.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**أُضيف في: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس البداية.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس النهاية.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع المحتوى لـ `Blob` الجديد

يُنشئ ويُرجع `Blob` جديدًا يحتوي على مجموعة فرعية من بيانات كائن `Blob` هذا. لا يتم تغيير `Blob` الأصلي.

### `blob.stream()` {#blobstream}

**أُضيف في: v16.7.0**

- الإرجاع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

يُرجع `ReadableStream` جديدًا يسمح بقراءة محتوى `Blob`.

### `blob.text()` {#blobtext}

**أُضيف في: v15.7.0, v14.18.0**

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

يُرجع وعدًا يتحقق مع محتويات `Blob` التي تم فك ترميزها كسلسلة UTF-8.

### `blob.type` {#blobtype}

**أُضيف في: v15.7.0, v14.18.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

نوع المحتوى لـ `Blob`.


### كائنات `Blob` و `MessageChannel` {#blob-objects-and-messagechannel}

بمجرد إنشاء كائن [\<Blob\>](/ar/nodejs/api/buffer#class-blob)، يمكن إرساله عبر `MessagePort` إلى وجهات متعددة دون نقل أو نسخ البيانات فورًا. يتم نسخ البيانات التي يحتوي عليها `Blob` فقط عند استدعاء الطرق `arrayBuffer()` أو `text()`.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## الصنف: `Buffer` {#class-buffer}

الصنف `Buffer` هو نوع عام للتعامل مع البيانات الثنائية مباشرة. يمكن إنشاؤه بعدة طرق.

### الطريقة الثابتة: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | رمي ERR_INVALID_ARG_TYPE أو ERR_OUT_OF_RANGE بدلاً من ERR_INVALID_ARG_VALUE لوسائط الإدخال غير الصالحة. |
| v15.0.0 | رمي ERR_INVALID_ARG_VALUE بدلاً من ERR_INVALID_OPT_VALUE لوسائط الإدخال غير الصالحة. |
| v10.0.0 | محاولة ملء مخزن مؤقت غير صفري بمخزن مؤقت بطول صفري يؤدي إلى استثناء يتم رميه. |
| v10.0.0 | تحديد سلسلة غير صالحة لـ `fill` يؤدي إلى استثناء يتم رميه. |
| v8.9.3 | تحديد سلسلة غير صالحة لـ `fill` يؤدي الآن إلى مخزن مؤقت مملوء بالأصفار. |
| v5.10.0 | تمت الإضافة في: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المطلوب لـ `Buffer` الجديد.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة لملء `Buffer` الجديد بها مسبقًا. **الافتراضي:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `fill` سلسلة، فهذا هو ترميزها. **الافتراضي:** `'utf8'`.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يخصص `Buffer` جديدًا بحجم `size` بايت. إذا كانت `fill` غير معرّفة، فسيتم ملء `Buffer` بالأصفار.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

إذا كان `size` أكبر من [`buffer.constants.MAX_LENGTH`](/ar/nodejs/api/buffer#bufferconstantsmax_length) أو أصغر من 0، فسيتم رمي [`ERR_OUT_OF_RANGE`](/ar/nodejs/api/errors#err_out_of_range).

إذا تم تحديد `fill`، فسيتم تهيئة `Buffer` المخصص عن طريق استدعاء [`buf.fill(fill)`](/ar/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

إذا تم تحديد كل من `fill` و `encoding`، فسيتم تهيئة `Buffer` المخصص عن طريق استدعاء [`buf.fill(fill, encoding)`](/ar/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

قد يكون استدعاء [`Buffer.alloc()`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) أبطأ بشكل ملحوظ من البديل [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) ولكنه يضمن أن محتويات مثيل `Buffer` الذي تم إنشاؤه حديثًا لن تحتوي أبدًا على بيانات حساسة من التخصيصات السابقة، بما في ذلك البيانات التي قد لا تكون مخصصة لـ `Buffer`s.

سيتم رمي `TypeError` إذا لم يكن `size` رقمًا.


### طريقة ثابتة: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | إلقاء ERR_INVALID_ARG_TYPE أو ERR_OUT_OF_RANGE بدلاً من ERR_INVALID_ARG_VALUE لوسائط إدخال غير صالحة. |
| v15.0.0 | إلقاء ERR_INVALID_ARG_VALUE بدلاً من ERR_INVALID_OPT_VALUE لوسائط إدخال غير صالحة. |
| v7.0.0 | تمرير `size` سالبة سيؤدي الآن إلى إلقاء خطأ. |
| v5.10.0 | تمت إضافتها في: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المطلوب لـ `Buffer` الجديد.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يخصص `Buffer` جديدًا بحجم `size` بايت. إذا كان `size` أكبر من [`buffer.constants.MAX_LENGTH`](/ar/nodejs/api/buffer#bufferconstantsmax_length) أو أصغر من 0، فسيتم إلقاء [`ERR_OUT_OF_RANGE`](/ar/nodejs/api/errors#err_out_of_range).

الذاكرة الأساسية لمثيلات `Buffer` التي تم إنشاؤها بهذه الطريقة *غير مهيأة*. محتويات `Buffer` التي تم إنشاؤها حديثًا غير معروفة و *قد تحتوي على بيانات حساسة*. استخدم [`Buffer.alloc()`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) بدلاً من ذلك لتهيئة مثيلات `Buffer` بالأصفار.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// طباعة (قد تختلف المحتويات): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// طباعة: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// طباعة (قد تختلف المحتويات): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// طباعة: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

سيتم إلقاء `TypeError` إذا لم يكن `size` رقمًا.

تقوم وحدة `Buffer` بتخصيص مسبق لمثيل `Buffer` داخلي بحجم [`Buffer.poolSize`](/ar/nodejs/api/buffer#class-property-bufferpoolsize) يتم استخدامه كمجمع للتخصيص السريع لمثيلات `Buffer` الجديدة التي تم إنشاؤها باستخدام [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) و [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray) و [`Buffer.from(string)`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding) و [`Buffer.concat()`](/ar/nodejs/api/buffer#static-method-bufferconcatlist-totallength) فقط عندما يكون `size` أقل من `Buffer.poolSize \>\>\> 1` (أرضية [`Buffer.poolSize`](/ar/nodejs/api/buffer#class-property-bufferpoolsize) مقسومة على اثنين).

يعد استخدام مجمع الذاكرة الداخلية المخصص مسبقًا فرقًا رئيسيًا بين استدعاء `Buffer.alloc(size, fill)` مقابل `Buffer.allocUnsafe(size).fill(fill)`. على وجه التحديد، `Buffer.alloc(size, fill)` *لن* يستخدم مجمع `Buffer` الداخلي أبدًا، بينما `Buffer.allocUnsafe(size).fill(fill)` *سيستخدم* مجمع `Buffer` الداخلي إذا كان `size` أقل من أو يساوي نصف [`Buffer.poolSize`](/ar/nodejs/api/buffer#class-property-bufferpoolsize). الفرق دقيق ولكنه قد يكون مهمًا عندما يتطلب التطبيق الأداء الإضافي الذي توفره [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize).


### طريقة ثابتة: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | يتم إرسال ERR_INVALID_ARG_TYPE أو ERR_OUT_OF_RANGE بدلاً من ERR_INVALID_ARG_VALUE لإدخال وسيطات غير صالحة. |
| v15.0.0 | يتم إرسال ERR_INVALID_ARG_VALUE بدلاً من ERR_INVALID_OPT_VALUE لإدخال وسيطات غير صالحة. |
| v5.12.0 | تمت الإضافة في: v5.12.0 |
:::

- `size` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المطلوب لـ `Buffer` الجديد.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يقوم بتخصيص `Buffer` جديد بحجم `size` بايت. إذا كان `size` أكبر من [`buffer.constants.MAX_LENGTH`](/ar/nodejs/api/buffer#bufferconstantsmax_length) أو أصغر من 0، يتم إرسال [`ERR_OUT_OF_RANGE`](/ar/nodejs/api/errors#err_out_of_range). يتم إنشاء `Buffer` ذو طول صفر إذا كان `size` هو 0.

الذاكرة الأساسية لمثيلات `Buffer` التي تم إنشاؤها بهذه الطريقة *غير مهيأة*. محتويات `Buffer` التي تم إنشاؤها حديثًا غير معروفة و *قد تحتوي على بيانات حساسة*. استخدم [`buf.fill(0)`](/ar/nodejs/api/buffer#buffillvalue-offset-end-encoding) لتهيئة مثيلات `Buffer` هذه بالأصفار.

عند استخدام [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) لتخصيص مثيلات `Buffer` جديدة، يتم تقسيم التخصيصات الأقل من `Buffer.poolSize \>\>\> 1` (4 كيلوبايت عند استخدام poolSize الافتراضي) من `Buffer` واحد مخصص مسبقًا. يتيح ذلك للتطبيقات تجنب الحمل الزائد لتجميع البيانات المهملة الناتج عن إنشاء العديد من مثيلات `Buffer` المخصصة بشكل فردي. يحسن هذا النهج كلاً من الأداء واستخدام الذاكرة عن طريق إلغاء الحاجة إلى تتبع وتنظيف العديد من كائنات `ArrayBuffer` الفردية.

ومع ذلك، في الحالة التي قد يحتاج فيها المطور إلى الاحتفاظ بجزء صغير من الذاكرة من تجمع لفترة غير محددة، قد يكون من المناسب إنشاء مثيل `Buffer` غير مجمع باستخدام `Buffer.allocUnsafeSlow()` ثم نسخ الأجزاء ذات الصلة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

سيتم إرسال `TypeError` إذا لم يكن `size` رقمًا.


### طريقة ثابتة: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v7.0.0 | سيؤدي تمرير إدخال غير صالح الآن إلى إطلاق خطأ. |
| v5.10.0 | يمكن الآن أن تكون المعلمة `string` أي `TypedArray` أو `DataView` أو `ArrayBuffer`. |
| v0.1.90 | أُضيف في: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) قيمة لحساب الطول.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `string` سلسلة، فهذا هو ترميزها. **الافتراضي:** `'utf8'`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات الموجودة داخل `string`.

تُرجع طول البايت لسلسلة عند ترميزها باستخدام `encoding`. هذا ليس نفس [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length)، والذي لا يأخذ في الاعتبار الترميز المستخدم لتحويل السلسلة إلى بايتات.

بالنسبة إلى `'base64'` و `'base64url'` و `'hex'`، تفترض هذه الدالة إدخالاً صالحًا. بالنسبة إلى السلاسل التي تحتوي على بيانات غير مشفرة بـ base64/hex (على سبيل المثال، مساحة بيضاء)، قد تكون القيمة المرجعة أكبر من طول `Buffer` التي تم إنشاؤها من السلسلة.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```
:::

عندما تكون `string` عبارة عن `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)، يتم إرجاع طول البايت كما تم الإبلاغ عنه بواسطة `.byteLength`.


### طريقة ثابتة: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن تكون الوسيطات الآن `Uint8Array`s. |
| v0.11.13 | تمت الإضافة في: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إما `-1` أو `0` أو `1` ، اعتمادًا على نتيجة المقارنة. راجع [`buf.compare()`](/ar/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) للحصول على التفاصيل.

يقارن `buf1` بـ `buf2` ، عادةً لغرض فرز صفائف مثيلات `Buffer`. هذا يعادل استدعاء [`buf1.compare(buf2)`](/ar/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// يطبع: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (هذه النتيجة تساوي: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// يطبع: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (هذه النتيجة تساوي: [buf2, buf1].)
```
:::

### طريقة ثابتة: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن تكون عناصر `list` الآن `Uint8Array`s. |
| v0.7.11 | تمت الإضافة في: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) قائمة مثيلات `Buffer` أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) لربطها.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول الإجمالي لمثيلات `Buffer` في `list` عند ربطها.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع `Buffer` جديد وهو نتيجة ربط جميع مثيلات `Buffer` في `list` معًا.

إذا كانت القائمة لا تحتوي على عناصر ، أو إذا كان `totalLength` هو 0 ، فسيتم إرجاع `Buffer` جديد بطول صفري.

إذا لم يتم توفير `totalLength` ، فسيتم حسابه من مثيلات `Buffer` في `list` عن طريق إضافة أطوالها.

إذا تم توفير `totalLength` ، فسيتم تحويله إلى عدد صحيح غير موقع. إذا تجاوز الطول المجمع لـ `Buffer`s في `list` `totalLength` ، فسيتم اقتطاع النتيجة إلى `totalLength`. إذا كان الطول المجمع لـ `Buffer`s في `list` أقل من `totalLength` ، فسيتم ملء المساحة المتبقية بالأصفار.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// إنشاء `Buffer` واحد من قائمة من ثلاث مثيلات `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// يطبع: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// يطبع: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// يطبع: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// إنشاء `Buffer` واحد من قائمة من ثلاث مثيلات `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// يطبع: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// يطبع: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// يطبع: 42
```
:::

قد تستخدم `Buffer.concat()` أيضًا تجمع `Buffer` الداخلي مثل [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize).


### طريقة ثابتة: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**أضيفت في: الإصدار v19.8.0، الإصدار v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) المراد نسخه.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة الأولية داخل `view`. **افتراضي**: `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد العناصر المراد نسخها من `view`. **افتراضي**: `view.length - offset`.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

ينسخ الذاكرة الأساسية لـ `view` إلى `Buffer` جديدة.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### طريقة ثابتة: `Buffer.from(array)` {#static-method-bufferfromarray}

**أضيفت في: الإصدار v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يخصص `Buffer` جديدة باستخدام `array` من البايتات في النطاق `0` - `255`. سيتم اقتطاع إدخالات المصفوفة خارج هذا النطاق لتناسبه.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// ينشئ Buffer جديدة تحتوي على بايتات UTF-8 للسلسلة 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// ينشئ Buffer جديدة تحتوي على بايتات UTF-8 للسلسلة 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

إذا كان `array` كائنًا يشبه `Array` (أي، كائنًا له خاصية `length` من النوع `number`)، فسيتم التعامل معه كما لو كان مصفوفة، إلا إذا كان `Buffer` أو `Uint8Array`. هذا يعني أن جميع متغيرات `TypedArray` الأخرى يتم التعامل معها على أنها `Array`. لإنشاء `Buffer` من البايتات التي تدعم `TypedArray`، استخدم [`Buffer.copyBytesFrom()`](/ar/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

سيتم طرح `TypeError` إذا لم تكن `array` عبارة عن `Array` أو نوع آخر مناسب لمتغيرات `Buffer.from()`.

قد تستخدم `Buffer.from(array)` و [`Buffer.from(string)`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding) أيضًا مجمع `Buffer` الداخلي مثلما تفعل [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize).


### طريقة ثابتة: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**أُضيف في: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)، على سبيل المثال خاصية `.buffer` الخاصة بـ [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس أول بايت ليتم عرضه. **افتراضي:** `0`.
- `length` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد عرضها. **افتراضي:** `arrayBuffer.byteLength - byteOffset`.
- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يقوم هذا بإنشاء عرض لـ [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) بدون نسخ الذاكرة الأساسية. على سبيل المثال، عند تمرير مرجع إلى الخاصية `.buffer` لمثيل [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)، ستشارك `Buffer` التي تم إنشاؤها حديثًا نفس الذاكرة المخصصة مثل `ArrayBuffer` الأساسية لـ [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// تشارك الذاكرة مع `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// يطبع: <Buffer 88 13 a0 0f>

// تغيير Uint16Array الأصلي يغير Buffer أيضًا.
arr[1] = 6000;

console.log(buf);
// يطبع: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// تشارك الذاكرة مع `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// يطبع: <Buffer 88 13 a0 0f>

// تغيير Uint16Array الأصلي يغير Buffer أيضًا.
arr[1] = 6000;

console.log(buf);
// يطبع: <Buffer 88 13 70 17>
```
:::

تحدد الوسيطتان الاختياريتان `byteOffset` و `length` نطاق ذاكرة داخل `arrayBuffer` سيتم مشاركته بواسطة `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// يطبع: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// يطبع: 2
```
:::

سيتم طرح `TypeError` إذا لم يكن `arrayBuffer` هو [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) أو نوع آخر مناسب لمتغيرات `Buffer.from()`.

من المهم أن نتذكر أن `ArrayBuffer` الداعم يمكن أن يغطي نطاقًا من الذاكرة يمتد خارج حدود عرض `TypedArray`. قد يمتد `Buffer` جديد تم إنشاؤه باستخدام الخاصية `buffer` الخاصة بـ `TypedArray` خارج نطاق `TypedArray`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 عناصر
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 عناصر
console.log(arrA.buffer === arrB.buffer); // صحيح

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// يطبع: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 عناصر
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 عناصر
console.log(arrA.buffer === arrB.buffer); // صحيح

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// يطبع: <Buffer 63 64 65 66>
```
:::

### طريقة ثابتة: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**أضيفت في: v5.10.0**

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` موجود أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) لنسخ البيانات منه.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

ينسخ بيانات `buffer` التي تم تمريرها إلى نسخة `Buffer` جديدة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```
:::

سيتم طرح `TypeError` إذا لم يكن `buffer` هو `Buffer` أو نوع آخر مناسب لمتغيرات `Buffer.from()`.

### طريقة ثابتة: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**أضيفت في: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يدعم `Symbol.toPrimitive` أو `valueOf()`.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إزاحة بايت أو ترميز.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طول.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

بالنسبة للكائنات التي تُرجع دالة `valueOf()` الخاصة بها قيمة لا تساوي `object` تمامًا، تُرجع `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

بالنسبة للكائنات التي تدعم `Symbol.toPrimitive`، تُرجع `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

سيتم طرح `TypeError` إذا لم يكن لدى `object` الطرق المذكورة أو لم يكن من نوع آخر مناسب لمتغيرات `Buffer.from()`.


### طريقة ثابتة: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**أُضيفت في: v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة نصية لترميزها.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز `string`. **افتراضي:** `'utf8'`.
- يُرجع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

ينشئ `Buffer` جديدًا يحتوي على `string`. تحدد المعلمة `encoding` ترميز الأحرف الذي سيتم استخدامه عند تحويل `string` إلى بايتات.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```
:::

سيتم طرح `TypeError` إذا لم تكن `string` سلسلة نصية أو نوعًا آخر مناسبًا لمتغيرات `Buffer.from()`.

قد تستخدم [`Buffer.from(string)`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding) أيضًا مجموعة `Buffer` الداخلية مثلما يفعل [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize).

### طريقة ثابتة: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**أُضيفت في: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- يُرجع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان `obj` هو `Buffer`، و `false` بخلاف ذلك.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### طريقة ثابتة: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**أُضيفت في: v0.9.1**

- `encoding` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم ترميز حروف للتحقق منه.
- الإرجاع: [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان `encoding` هو اسم ترميز حروف مدعوم، أو `false` بخلاف ذلك.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// يطبع: true

console.log(Buffer.isEncoding('hex'));
// يطبع: true

console.log(Buffer.isEncoding('utf/8'));
// يطبع: false

console.log(Buffer.isEncoding(''));
// يطبع: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// يطبع: true

console.log(Buffer.isEncoding('hex'));
// يطبع: true

console.log(Buffer.isEncoding('utf/8'));
// يطبع: false

console.log(Buffer.isEncoding(''));
// يطبع: false
```
:::

### خاصية الصنف: `Buffer.poolSize` {#class-property-bufferpoolsize}

**أُضيفت في: v0.11.3**

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `8192`

هذا هو حجم (بالبايت) مثيلات `Buffer` الداخلية المُخصصة مسبقًا والمستخدمة للتجميع. يمكن تعديل هذه القيمة.

### `buf[index]` {#bufindex}

- `index` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يمكن استخدام عامل الفهرس `[index]` للحصول على وتعيين الثمانية الموجودة في الموضع `index` في `buf`. تشير القيم إلى بايتات فردية، لذا فإن النطاق القانوني للقيمة هو بين `0x00` و `0xFF` (ست عشري) أو `0` و `255` (عشري).

هذا العامل موروث من `Uint8Array`، لذا فإن سلوكه في الوصول خارج النطاق هو نفسه سلوك `Uint8Array`. بمعنى آخر، تُرجع `buf[index]` قيمة `undefined` عندما تكون `index` سالبة أو أكبر من أو تساوي `buf.length`، ولا تعدل `buf[index] = value` المخزن المؤقت إذا كانت `index` سالبة أو `\>= buf.length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// انسخ سلسلة ASCII إلى `Buffer` بايت واحد في كل مرة.
// (هذا يعمل فقط مع سلاسل ASCII فقط. بشكل عام، يجب على المرء استخدام
// `Buffer.from()` لإجراء هذا التحويل.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// يطبع: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// انسخ سلسلة ASCII إلى `Buffer` بايت واحد في كل مرة.
// (هذا يعمل فقط مع سلاسل ASCII فقط. بشكل عام، يجب على المرء استخدام
// `Buffer.from()` لإجراء هذا التحويل.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// يطبع: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) كائن `ArrayBuffer` الأساسي الذي تم إنشاء كائن `Buffer` هذا استنادًا إليه.

لا يُضمن أن يتطابق `ArrayBuffer` هذا تمامًا مع `Buffer` الأصلي. راجع الملاحظات حول `buf.byteOffset` للحصول على التفاصيل.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `byteOffset` لكائن `ArrayBuffer` الأساسي لـ `Buffer`.

عند تعيين `byteOffset` في `Buffer.from(ArrayBuffer, byteOffset, length)`، أو أحيانًا عند تخصيص `Buffer` أصغر من `Buffer.poolSize`، لا يبدأ المخزن المؤقت من إزاحة صفرية في `ArrayBuffer` الأساسي.

قد يتسبب هذا في حدوث مشكلات عند الوصول إلى `ArrayBuffer` الأساسي مباشرةً باستخدام `buf.buffer`، حيث قد تكون أجزاء أخرى من `ArrayBuffer` غير مرتبطة بكائن `Buffer` نفسه.

تتمثل إحدى المشكلات الشائعة عند إنشاء كائن `TypedArray` يشارك ذاكرته مع `Buffer` في أنه في هذه الحالة يجب تحديد `byteOffset` بشكل صحيح:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن يكون المعامل `target` الآن `Uint8Array`. |
| v5.11.0 | يتم الآن دعم المعاملات الإضافية لتحديد الإزاحات. |
| v0.11.13 | تمت الإضافة في: v0.11.13 |
:::

- `target` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) ‏`Buffer` أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) للمقارنة مع `buf`.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `target` التي يجب أن تبدأ المقارنة عندها. **افتراضي:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `target` التي يجب أن تنتهي المقارنة عندها (غير شاملة). **افتراضي:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `buf` التي يجب أن تبدأ المقارنة عندها. **افتراضي:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `buf` التي يجب أن تنتهي المقارنة عندها (غير شاملة). **افتراضي:** [`buf.length`](/ar/nodejs/api/buffer#buflength).
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقارن `buf` مع `target` ويعيد رقمًا يشير إلى ما إذا كان `buf` يأتي قبل أو بعد أو هو نفسه `target` في ترتيب الفرز. تعتمد المقارنة على التسلسل الفعلي للبايتات في كل `Buffer`.

- يتم إرجاع `0` إذا كان `target` هو نفسه `buf`.
- يتم إرجاع `1` إذا كان يجب أن يأتي `target` *قبل* `buf` عند الفرز.
- يتم إرجاع `-1` إذا كان يجب أن يأتي `target` *بعد* `buf` عند الفرز.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```
:::

يمكن استخدام المعاملات الاختيارية `targetStart` و `targetEnd` و `sourceStart` و `sourceEnd` لتقييد المقارنة بنطاقات محددة داخل `target` و `buf` على التوالي.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```
:::

يتم طرح [`ERR_OUT_OF_RANGE`](/ar/nodejs/api/errors#err_out_of_range) إذا كان `targetStart \< 0` أو `sourceStart \< 0` أو `targetEnd \> target.byteLength` أو `sourceEnd \> source.byteLength`.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**أُضيف في: v0.1.90**

- `target` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) ‏`Buffer` أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) لنسخ البيانات إليها.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `target` التي سيتم بدء الكتابة منها. **افتراضي:** ‏`0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `buf` التي سيتم بدء النسخ منها. **افتراضي:** ‏`0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة داخل `buf` التي سيتم إيقاف النسخ عندها (غير شاملة). **افتراضي:** ‏[`buf.length`](/ar/nodejs/api/buffer#buflength).
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تم نسخها.

ينسخ البيانات من منطقة في `buf` إلى منطقة في `target`، حتى إذا تداخلت منطقة الذاكرة `target` مع `buf`.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) ينفذ نفس العملية، وهو متاح لجميع TypedArrays، بما في ذلك `Buffer`s في Node.js، على الرغم من أنه يأخذ وسيطات دالة مختلفة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```
:::


### ‏`buf.entries()` {#bufentries}

**تمت الإضافة في: الإصدار v1.1.0**

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

يقوم بإنشاء وإرجاع [مكرر](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) لأزواج `[index, byte]` من محتويات `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// تسجيل المحتويات الكاملة لـ `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// طباعة:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// تسجيل المحتويات الكاملة لـ `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// طباعة:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### ‏`buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن تكون الوسيطات الآن `Uint8Array`s. |
| v0.11.13 | تمت الإضافة في: v0.11.13 |
:::

- ‏`otherBuffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) ‏`Buffer` أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) للمقارنة مع `buf`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان لكل من `buf` و `otherBuffer` نفس البايتات تمامًا، وإلا `false`. يكافئ [`buf.compare(otherBuffer) === 0`](/ar/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// طباعة: true
console.log(buf1.equals(buf3));
// طباعة: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// طباعة: true
console.log(buf1.equals(buf3));
// طباعة: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v11.0.0 | يطرح `ERR_OUT_OF_RANGE` بدلاً من `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | القيم السالبة لـ `end` تطرح خطأ `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | محاولة ملء مخزن مؤقت غير صفري الطول بمخزن مؤقت صفري الطول يؤدي إلى طرح استثناء. |
| v10.0.0 | تحديد سلسلة غير صالحة لـ `value` يؤدي إلى طرح استثناء. |
| v5.7.0 | معلمة `encoding` مدعومة الآن. |
| v0.5.0 | تمت الإضافة في: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) القيمة التي سيتم ملء `buf` بها. القيمة الفارغة (سلسلة، Uint8Array، Buffer) يتم تحويلها قسراً إلى `0`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في ملء `buf`. **افتراضي:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مكان التوقف عن ملء `buf` (غير شامل). **افتراضي:** [`buf.length`](/ar/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز `value` إذا كانت `value` عبارة عن سلسلة. **افتراضي:** `'utf8'`.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مرجع إلى `buf`.

يملأ `buf` بالقيمة `value` المحددة. إذا لم يتم إعطاء `offset` و `end`، فسيتم ملء `buf` بالكامل:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// املأ `Buffer` بحرف ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// يطبع: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// املأ مخزن مؤقت بسلسلة فارغة
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// يطبع: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// املأ `Buffer` بحرف ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// يطبع: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// املأ مخزن مؤقت بسلسلة فارغة
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// يطبع: <Buffer 00 00 00 00 00>
```
:::

يتم تحويل `value` قسراً إلى قيمة `uint32` إذا لم تكن سلسلة أو `Buffer` أو عددًا صحيحًا. إذا كان العدد الصحيح الناتج أكبر من `255` (عشري)، فسيتم ملء `buf` بـ `value & 255`.

إذا كانت الكتابة النهائية لعملية `fill()` تقع على حرف متعدد البايتات، فسيتم كتابة البايتات الخاصة بهذا الحرف فقط التي تتناسب مع `buf`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// املأ `Buffer` بحرف يستغرق بايتين في UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// يطبع: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// املأ `Buffer` بحرف يستغرق بايتين في UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// يطبع: <Buffer c8 a2 c8 a2 c8>
```
:::

إذا كانت `value` تحتوي على أحرف غير صالحة، فسيتم اقتطاعها؛ إذا لم تتبق أي بيانات ملء صالحة، فسيتم طرح استثناء:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// يطبع: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// يطبع: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// يطرح استثناء.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// يطبع: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// يطبع: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// يطرح استثناء.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**تمت الإضافة في: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ما الذي سيتم البحث عنه.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) من أين يبدأ البحث في `buf`. إذا كانت القيمة سالبة، فسيتم حساب الإزاحة من نهاية `buf`. **الافتراضي:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `value` سلسلة نصية، فهذا هو ترميزها. **الافتراضي:** `'utf8'`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم العثور على `value` في `buf`، و`false` بخلاف ذلك.

معادل لـ [`buf.indexOf() !== -1`](/ar/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن يكون `value` الآن `Uint8Array`. |
| v5.7.0, v4.4.0 | عند تمرير `encoding`، لم تعد معلمة `byteOffset` مطلوبة. |
| v1.5.0 | تمت الإضافة في: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ما الذي تبحث عنه.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) من أين تبدأ البحث في `buf`. إذا كانت سالبة، فسيتم حساب الإزاحة من نهاية `buf`. **افتراضي:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كان `value` سلسلة، فهذا هو الترميز المستخدم لتحديد التمثيل الثنائي للسلسلة التي سيتم البحث عنها في `buf`. **افتراضي:** `'utf8'`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس أول ظهور لـ `value` في `buf`، أو `-1` إذا لم يحتوِ `buf` على `value`.

إذا كان `value`:

- سلسلة، يتم تفسير `value` وفقًا لترميز الأحرف في `encoding`.
- `Buffer` أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)، سيتم استخدام `value` بالكامل. لمقارنة `Buffer` جزئي، استخدم [`buf.subarray`](/ar/nodejs/api/buffer#bufsubarraystart-end).
- رقم، سيتم تفسير `value` على أنه قيمة عدد صحيح غير موقعة 8 بت بين `0` و `255`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```
:::

إذا لم يكن `value` سلسلة أو رقمًا أو `Buffer`، فستطرح هذه الطريقة `TypeError`. إذا كان `value` رقمًا، فسيتم تحويله إلى قيمة بايت صالحة، وهي عدد صحيح بين 0 و 255.

إذا لم يكن `byteOffset` رقمًا، فسيتم تحويله إلى رقم. إذا كانت نتيجة التحويل هي `NaN` أو `0`، فسيتم البحث في المخزن المؤقت بأكمله. يتطابق هذا السلوك مع [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

إذا كان `value` سلسلة فارغة أو `Buffer` فارغ وكان `byteOffset` أقل من `buf.length`، فسيتم إرجاع `byteOffset`. إذا كان `value` فارغًا وكان `byteOffset` على الأقل `buf.length`، فسيتم إرجاع `buf.length`.


### `buf.keys()` {#bufkeys}

**أُضيف في: v1.1.0**

- إرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

إنشاء وإرجاع [مُكرِّر](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) لمفاتيح (فهارس) `buf`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن يكون `value` الآن `Uint8Array`. |
| v6.0.0 | أُضيف في: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ما الذي سيتم البحث عنه.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) من أين تبدأ البحث في `buf`. إذا كان سالبًا، فسيتم حساب الإزاحة من نهاية `buf`. **الافتراضي:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كان `value` سلسلة نصية، فهذا هو الترميز المستخدم لتحديد التمثيل الثنائي للسلسلة النصية التي سيتم البحث عنها في `buf`. **الافتراضي:** `'utf8'`.
- إرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس آخر ظهور لـ `value` في `buf`، أو `-1` إذا لم يحتوي `buf` على `value`.

مطابق لـ [`buf.indexOf()`](/ar/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding)، باستثناء أنه يتم العثور على آخر ظهور لـ `value` بدلاً من أول ظهور.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```
:::

إذا لم يكن `value` سلسلة نصية أو رقمًا أو `Buffer`، فسوف تطرح هذه الطريقة `TypeError`. إذا كان `value` رقمًا، فسيتم إجباره على قيمة بايت صالحة، وهي عدد صحيح بين 0 و 255.

إذا لم يكن `byteOffset` رقمًا، فسيتم إجباره على رقم. أي وسيطات يتم إجبارها على `NaN`، مثل `{}` أو `undefined`، ستبحث في المخزن المؤقت بأكمله. يتطابق هذا السلوك مع [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf).



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

إذا كانت `value` سلسلة نصية فارغة أو `Buffer` فارغ، فسيتم إرجاع `byteOffset`.


### `buf.length` {#buflength}

**تمت الإضافة في: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع عدد البايتات في `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// إنشاء `Buffer` وكتابة سلسلة نصية أقصر إليها باستخدام UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// يطبع: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// يطبع: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// إنشاء `Buffer` وكتابة سلسلة نصية أقصر إليها باستخدام UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// يطبع: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// يطبع: 1234
```
:::

### `buf.parent` {#bufparent}

**تم الإلغاء منذ: v8.0.0**

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء: استخدم [`buf.buffer`](/ar/nodejs/api/buffer#bufbuffer) بدلاً من ذلك.
:::

خاصية `buf.parent` هي اسم مستعار مهجور لـ `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**تمت الإضافة في: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن تحقق: `0 \<= offset \<= buf.length - 8`. **افتراضي:** `0`.
- الإرجاع: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

يقرأ عددًا صحيحًا 64 بت موقعًا بتنسيق big-endian من `buf` عند `offset` المحدد.

تُفسَّر الأعداد الصحيحة المقروءة من `Buffer` على أنها قيم موقعة بمكملات العدد اثنين.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**تمت الإضافة في: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن تحقق: `0 \<= offset \<= buf.length - 8`. **افتراضي:** `0`.
- الإرجاع: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

يقرأ عددًا صحيحًا 64 بت موقعًا بتنسيق little-endian من `buf` عند `offset` المحدد.

تُفسَّر الأعداد الصحيحة المقروءة من `Buffer` على أنها قيم موقعة بمكملات العدد اثنين.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.10.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.readBigUint64BE()`. |
| v12.0.0, v10.20.0 | تمت إضافتها في: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن تحقق الشرط: `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

يقرأ عددًا صحيحًا غير موقع بحجم 64 بت بترتيب النهاية الكبيرة (big-endian) من `buf` عند `offset` المحدد.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.10.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.readBigUint64LE()`. |
| v12.0.0, v10.20.0 | تمت إضافتها في: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن تحقق الشرط: `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

يقرأ عددًا صحيحًا غير موقع بحجم 64 بت بترتيب النهاية الصغيرة (little-endian) من `buf` عند `offset` المحدد.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readBigUint64LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن تحقق الشرط `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا عشريًا مزدوج الدقة (64 بت) بترتيب النهاية الكبيرة (big-endian) من `buf` عند `offset` المحدد.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن تحقق الشرط `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا عشريًا مزدوج الدقة (64 بت) بترتيب النهاية الصغيرة (little-endian) من `buf` عند `offset` المحدد.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت إضافته في: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في القراءة. يجب أن يستوفي الشرط `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ قيمة فاصلة عائمة (float) ذات 32 بت بنظام النهاية الكبيرة (big-endian) من `buf` عند `offset` المحدد.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// يطبع: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// يطبع: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت إضافته في: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في القراءة. يجب أن يستوفي الشرط `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ قيمة فاصلة عائمة (float) ذات 32 بت بنظام النهاية الصغيرة (little-endian) من `buf` عند `offset` المحدد.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// يطبع: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// يطرح ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// يطبع: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// يطرح ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.0 | تمت الإضافة في: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل بدء القراءة. يجب أن تستوفي الشرط `0 \<= offset \<= buf.length - 1`. **افتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا موقعًا 8 بت من `buf` عند `offset` المحدد.

تُفسَّر الأعداد الصحيحة المقروءة من `Buffer` كقيم موقعة بنظام المتمم الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل بدء القراءة. يجب أن تستوفي الشرط `0 \<= offset \<= buf.length - 2`. **افتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا موقعًا 16 بت بنظام النهاية الكبيرة (big-endian) من `buf` عند `offset` المحدد.

تُفسَّر الأعداد الصحيحة المقروءة من `Buffer` كقيم موقعة بنظام المتمم الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولا يوجد بعد الآن إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في القراءة. يجب أن تحقق `0 \<= offset \<= buf.length - 2`. **الافتراضي:** `0`.
- إرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا موقعًا صغير النهاية 16 بت من `buf` عند `offset` المحدد.

تُفسر الأعداد الصحيحة المقروءة من `Buffer` على أنها قيم موقعة مكملة للاثنين.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// طباعة: 1280
console.log(buf.readInt16LE(1));
// يطرح ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// طباعة: 1280
console.log(buf.readInt16LE(1));
// يطرح ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولا يوجد بعد الآن إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في القراءة. يجب أن تحقق `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- إرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا موقعًا كبير النهاية 32 بت من `buf` عند `offset` المحدد.

تُفسر الأعداد الصحيحة المقروءة من `Buffer` على أنها قيم موقعة مكملة للاثنين.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// طباعة: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// طباعة: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل بدء القراءة. يجب أن تحقق `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا موقعًا بحجم 32 بت بنظام little-endian من `buf` عند `offset` المحدد.

تُفسَّر الأعداد الصحيحة المقروءة من `Buffer` على أنها قيم موقعة بنظام المتمم الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// يطبع: 83886080
console.log(buf.readInt32LE(1));
// يطرح ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// يطبع: 83886080
console.log(buf.readInt32LE(1));
// يطرح ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة و `byteLength` إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل بدء القراءة. يجب أن تحقق `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها. يجب أن تحقق `0 \< byteLength \<= 6`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عدد `byteLength` من البايتات من `buf` عند `offset` المحدد ويفسر النتيجة على أنها قيمة موقعة بنظام big-endian، ونظام المتمم الثنائي يدعم ما يصل إلى 48 بت من الدقة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// يطبع: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// يطرح ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// يطرح ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// يطبع: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// يطرح ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// يطرح ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة و `byteLength` إلى `uint32`. |
| v0.11.15 | أُضيف في: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): عدد البايتات التي يجب تخطيها قبل البدء في القراءة. يجب أن تحقق `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): عدد البايتات المراد قراءتها. يجب أن تحقق `0 \< byteLength \<= 6`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عدد `byteLength` من البايتات من `buf` في `offset` المحدد ويفسر النتيجة كقيمة موقعة بترميز المكمل الثنائي ذات ترتيب البايتات الأصغر (little-endian) تدعم ما يصل إلى 48 بت من الدقة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// يطبع: ‎-546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// يطبع: ‎-546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.readUint8()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.0 | أُضيف في: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): عدد البايتات التي يجب تخطيها قبل البدء في القراءة. يجب أن تحقق `0 \<= offset \<= buf.length - 1`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا غير موقع 8 بت من `buf` في `offset` المحدد.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// يطبع: 1
console.log(buf.readUInt8(1));
// يطبع: 254
console.log(buf.readUInt8(2));
// يطلق ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// يطبع: 1
console.log(buf.readUInt8(1));
// يطبع: 254
console.log(buf.readUInt8(2));
// يطلق ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الوظيفة متاحة أيضًا باسم `buf.readUint16BE()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت إضافتها في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن يستوفي الشرط `0 \<= offset \<= buf.length - 2`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا غير موقَّع 16 بتًا بنظام النهاية الكبيرة من `buf` عند `offset` المحدد.

هذه الوظيفة متاحة أيضًا تحت الاسم المستعار `readUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// يطبع: 1234
console.log(buf.readUInt16BE(1).toString(16));
// يطبع: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// يطبع: 1234
console.log(buf.readUInt16BE(1).toString(16));
// يطبع: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الوظيفة متاحة أيضًا باسم `buf.readUint16LE()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت إضافتها في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في القراءة. يجب أن يستوفي الشرط `0 \<= offset \<= buf.length - 2`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا غير موقَّع 16 بتًا بنظام النهاية الصغيرة من `buf` عند `offset` المحدد.

هذه الوظيفة متاحة أيضًا تحت الاسم المستعار `readUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// يطبع: 3412
console.log(buf.readUInt16LE(1).toString(16));
// يطبع: 5634
console.log(buf.readUInt16LE(2).toString(16));
// يطرح ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// يطبع: 3412
console.log(buf.readUInt16LE(1).toString(16));
// يطبع: 5634
console.log(buf.readUInt16LE(2).toString(16));
// يطرح ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا كـ `buf.readUint32BE()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل بدء القراءة. يجب أن يفي بالشرط `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا غير موقع 32 بت بترتيب النهاية الكبيرة من `buf` عند `offset` المحدد.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// يطبع: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// يطبع: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا كـ `buf.readUint32LE()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل بدء القراءة. يجب أن يفي بالشرط `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عددًا صحيحًا غير موقع 32 بت بترتيب النهاية الصغيرة من `buf` عند `offset` المحدد.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// يطبع: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// يطرح ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// يطبع: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// يطرح ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.readUintBE()`. |
| v10.0.0 | تمت إزالة `noAssert` وعدم الإكراه الضمني للإزاحة و `byteLength` إلى `uint32` بعد الآن. |
| v0.11.15 | تمت إضافتها في: v0.11.15 |
:::

- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في القراءة. يجب أن تفي بالشرط `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها. يجب أن تفي بالشرط `0 \< byteLength \<= 6`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عدد `byteLength` من البايتات من `buf` عند `offset` المحدد ويفسر النتيجة كعدد صحيح كبير النهاية غير موقع يدعم ما يصل إلى 48 بت من الدقة.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// يطبع: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// يلقي ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// يطبع: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// يلقي ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.readUintLE()`. |
| v10.0.0 | تمت إزالة `noAssert` وعدم الإكراه الضمني للإزاحة و `byteLength` إلى `uint32` بعد الآن. |
| v0.11.15 | تمت إضافتها في: v0.11.15 |
:::

- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في القراءة. يجب أن تفي بالشرط `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها. يجب أن تفي بالشرط `0 \< byteLength \<= 6`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقرأ عدد `byteLength` من البايتات من `buf` عند `offset` المحدد ويفسر النتيجة كعدد صحيح صغير النهاية غير موقع يدعم ما يصل إلى 48 بت من الدقة.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `readUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// يطبع: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// يطبع: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**تمت الإضافة في: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المكان الذي سيبدأ فيه `Buffer` الجديد. **افتراضي:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المكان الذي سينتهي فيه `Buffer` الجديد (غير شامل). **افتراضي:** [`buf.length`](/ar/nodejs/api/buffer#buflength).
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع `Buffer` جديد يشير إلى نفس الذاكرة مثل الأصل، ولكن مع إزاحة واقتطاع بواسطة فهرسي `start` و `end`.

يؤدي تحديد `end` أكبر من [`buf.length`](/ar/nodejs/api/buffer#buflength) إلى إرجاع نفس نتيجة `end` مساوية لـ [`buf.length`](/ar/nodejs/api/buffer#buflength).

هذه الطريقة موروثة من [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray).

سيؤدي تعديل شريحة `Buffer` الجديدة إلى تعديل الذاكرة في `Buffer` الأصلي لأن الذاكرة المخصصة للكائنين متداخلة.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// إنشاء `Buffer` باستخدام الأبجدية ASCII، وأخذ شريحة، وتعديل بايت واحد
// من `Buffer` الأصلي.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 هي القيمة العشرية ASCII للحرف 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// إنشاء `Buffer` باستخدام الأبجدية ASCII، وأخذ شريحة، وتعديل بايت واحد
// من `Buffer` الأصلي.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 هي القيمة العشرية ASCII للحرف 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```
:::

يؤدي تحديد الفهارس السالبة إلى إنشاء الشريحة بالنسبة إلى نهاية `buf` بدلاً من البداية.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
```
:::

### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| الإصدار v17.5.0، v16.15.0 | تم إهمال الأسلوب buf.slice(). |
| الإصدار v7.0.0 | يتم الآن إجبار جميع الإزاحات إلى أعداد صحيحة قبل إجراء أي حسابات عليها. |
| الإصدار v7.1.0، v6.9.2 | معالجة إجبار الإزاحات إلى أعداد صحيحة الآن قيم خارج نطاق العدد الصحيح 32 بت بشكل صحيح. |
| الإصدار v0.3.0 | تمت إضافته في: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حيث سيبدأ `Buffer` الجديد. **افتراضي:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حيث سينتهي `Buffer` الجديد (غير شامل). **افتراضي:** [`buf.length`](/ar/nodejs/api/buffer#buflength).
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم [`buf.subarray`](/ar/nodejs/api/buffer#bufsubarraystart-end) بدلاً من ذلك.
:::

يُرجع `Buffer` جديدًا يشير إلى نفس الذاكرة الأصلية، ولكنه مُزاح ومُقتطع بفهرسي `start` و `end`.

هذا الأسلوب غير متوافق مع `Uint8Array.prototype.slice()`، وهو فئة عليا لـ `Buffer`. لنسخ الشريحة، استخدم `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**أضيف في:** v5.10.0

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إشارة إلى `buf`.

يفسر `buf` على أنه مصفوفة من الأعداد الصحيحة غير الموقعة ذات 16 بت ويتبادل ترتيب البايتات *في المكان*. يطرح [`ERR_INVALID_BUFFER_SIZE`](/ar/nodejs/api/errors#err_invalid_buffer_size) إذا لم يكن [`buf.length`](/ar/nodejs/api/buffer#buflength) مضاعفًا للرقم 2.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

أحد الاستخدامات المريحة لـ `buf.swap16()` هو إجراء تحويل سريع في المكان بين UTF-16 little-endian و UTF-16 big-endian:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**أضيف في:** v5.10.0

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إشارة إلى `buf`.

يفسر `buf` على أنه مصفوفة من الأعداد الصحيحة غير الموقعة ذات 32 بت ويتبادل ترتيب البايتات *في المكان*. يطرح [`ERR_INVALID_BUFFER_SIZE`](/ar/nodejs/api/errors#err_invalid_buffer_size) إذا لم يكن [`buf.length`](/ar/nodejs/api/buffer#buflength) مضاعفًا للرقم 4.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::


### `buf.swap64()` {#bufswap64}

**أضيف في:** v6.3.0

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مرجع إلى `buf`.

يفسر `buf` على أنه مجموعة من الأرقام ذات 64 بت ويقوم بتبديل ترتيب البايت *في المكان*. يطرح [`ERR_INVALID_BUFFER_SIZE`](/ar/nodejs/api/errors#err_invalid_buffer_size) إذا لم يكن [`buf.length`](/ar/nodejs/api/buffer#buflength) من مضاعفات 8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**أضيف في:** v0.9.2

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع تمثيل JSON لـ `buf`. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) يستدعي هذا الأمر ضمنيًا عند تحويل مثيل `Buffer` إلى سلسلة نصية.

يقبل `Buffer.from()` الكائنات بالصيغة المرجعة من هذه الطريقة. على وجه الخصوص، يعمل `Buffer.from(buf.toJSON())` مثل `Buffer.from(buf)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**تمت الإضافة في: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز الأحرف المراد استخدامه. **افتراضي:** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة البايت لبدء فك التشفير عندها. **افتراضي:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة البايت لإيقاف فك التشفير عندها (غير شامل). **افتراضي:** [`buf.length`](/ar/nodejs/api/buffer#buflength).
- إرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم بفك تشفير `buf` إلى سلسلة وفقًا لترميز الأحرف المحدد في `encoding`. يمكن تمرير `start` و `end` لفك تشفير مجموعة فرعية فقط من `buf`.

إذا كان `encoding` هو `'utf8'` وكان تسلسل البايت في الإدخال غير صالح UTF-8، فسيتم استبدال كل بايت غير صالح بحرف الاستبدال `U+FFFD`.

الحد الأقصى لطول مثيل السلسلة (بوحدات رمز UTF-16) متاح كـ [`buffer.constants.MAX_STRING_LENGTH`](/ar/nodejs/api/buffer#bufferconstantsmax_string_length).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```
:::


### `buf.values()` {#bufvalues}

**أضيف في:** v1.1.0

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

ينشئ ويعيد [مكررًا](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) لقيم `buf` (بايتات). يتم استدعاء هذه الدالة تلقائيًا عندما يتم استخدام `Buffer` في عبارة `for..of`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**أضيف في:** v0.1.90

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة نصية للكتابة إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في كتابة `string`. **الافتراضي:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أقصى عدد من البايتات للكتابة (لن تتجاوز البايتات المكتوبة `buf.length - offset`). **الافتراضي:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز الأحرف لـ `string`. **الافتراضي:** `'utf8'`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المكتوبة.

يكتب `string` إلى `buf` عند `offset` وفقًا لترميز الأحرف في `encoding`. المعامل `length` هو عدد البايتات التي يجب كتابتها. إذا لم يحتوي `buf` على مساحة كافية لاحتواء السلسلة النصية بأكملها، فسيتم كتابة جزء فقط من `string`. ومع ذلك، لن يتم كتابة الأحرف المشفرة جزئيًا.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**أضيف في:** v12.0.0, v10.20.0

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) الرقم المراد كتابته في `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في الكتابة. يجب أن تستوفي الشرط: `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات التي تم كتابتها.

يكتب `value` إلى `buf` عند `offset` المحدد كـ big-endian.

يتم تفسير `value` وكتابته كعدد صحيح مُوقَّع بتمثيل المتمم الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**أضيف في:** v12.0.0, v10.20.0

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) الرقم المراد كتابته في `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في الكتابة. يجب أن تستوفي الشرط: `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات التي تم كتابتها.

يكتب `value` إلى `buf` عند `offset` المحدد كـ little-endian.

يتم تفسير `value` وكتابته كعدد صحيح مُوقَّع بتمثيل المتمم الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.10.0, v12.19.0 | هذه الوظيفة متاحة أيضًا باسم `buf.writeBigUint64BE()`. |
| v12.0.0, v10.20.0 | تمت الإضافة في: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) الرقم المراد كتابته في `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن تستوفي الشرط: `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد كـ big-endian.

هذه الوظيفة متاحة أيضًا تحت الاسم المستعار `writeBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.10.0, v12.19.0 | هذه الوظيفة متاحة أيضًا باسم `buf.writeBigUint64LE()`. |
| v12.0.0, v10.20.0 | تمت الإضافة في: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) الرقم المراد كتابته في `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن تستوفي الشرط: `0 \<= offset \<= buf.length - 8`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد كـ little-endian.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```
:::

هذه الوظيفة متاحة أيضًا تحت الاسم المستعار `writeBigUint64LE`.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في الكتابة. يجب أن يفي بـ `0 \<= offset \<= buf.length - 8`. **افتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` في `offset` المحدد كـ big-endian. يجب أن يكون `value` رقم JavaScript. السلوك غير محدد عندما يكون `value` أي شيء بخلاف رقم JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في الكتابة. يجب أن يفي بـ `0 \<= offset \<= buf.length - 8`. **افتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` في `offset` المحدد كـ little-endian. يجب أن يكون `value` رقم JavaScript. السلوك غير محدد عندما يكون `value` أي شيء بخلاف رقم JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن تحقق `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بنظام النهاية الكبيرة (big-endian). السلوك غير محدد عندما يكون `value` أي شيء آخر غير رقم JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | إزالة `noAssert` ولم يعد هناك قسر ضمني للإزاحة إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن تحقق `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بنظام النهاية الصغيرة (little-endian). السلوك غير محدد عندما يكون `value` أي شيء آخر غير رقم JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.0 | تمت الإضافة في: v0.5.0 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن يفي بالشرط `0 \<= offset \<= buf.length - 1`. **افتراضي:** `0`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد. يجب أن يكون `value` عددًا صحيحًا موقعًا صالحًا بحجم 8 بت. السلوك غير محدد عندما يكون `value` أي شيء بخلاف عدد صحيح موقع بحجم 8 بت.

يتم تفسير `value` وكتابته كعدد صحيح موقع بمتمم ثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن يفي بالشرط `0 \<= offset \<= buf.length - 2`. **افتراضي:** `0`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بنظام النهاية الكبيرة (big-endian). يجب أن يكون `value` عددًا صحيحًا موقعًا صالحًا بحجم 16 بت. السلوك غير محدد عندما يكون `value` أي شيء بخلاف عدد صحيح موقع بحجم 16 بت.

يتم تفسير `value` وكتابته كعدد صحيح موقع بمتمم ثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن يستوفي `0 \<= offset \<= buf.length - 2`. **افتراضي:** `0`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات التي تمت كتابتها.

يكتب `value` إلى `buf` في `offset` المحدد بصيغة little-endian. يجب أن تكون `value` عددًا صحيحًا صالحًا موقّعًا بطول 16 بت. السلوك غير محدد عندما تكون `value` أي شيء آخر غير عدد صحيح موقّع بطول 16 بت.

يتم تفسير `value` وكتابتها كعدد صحيح موقّع بنظام المكمل الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن يستوفي `0 \<= offset \<= buf.length - 4`. **افتراضي:** `0`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات التي تمت كتابتها.

يكتب `value` إلى `buf` في `offset` المحدد بصيغة big-endian. يجب أن تكون `value` عددًا صحيحًا صالحًا موقّعًا بطول 32 بت. السلوك غير محدد عندما تكون `value` أي شيء آخر غير عدد صحيح موقّع بطول 32 بت.

يتم تفسير `value` وكتابتها كعدد صحيح موقّع بنظام المكمل الثنائي.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته في `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في الكتابة. يجب أن تحقق `0 \<= offset \<= buf.length - 4`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بصيغة little-endian. يجب أن تكون `value` عددًا صحيحًا موقعًا صالحًا مكونًا من 32 بت. السلوك غير محدد عندما تكون `value` أي شيء بخلاف عدد صحيح موقع مكون من 32 بت.

يتم تفسير `value` وكتابته كعدد صحيح موقع بمكمل الاثنان.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة و `byteLength` إلى `uint32`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته في `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في الكتابة. يجب أن تحقق `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد كتابتها. يجب أن تحقق `0 < byteLength \<= 6`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `byteLength` بايتات من `value` إلى `buf` عند `offset` المحدد بصيغة big-endian. يدعم ما يصل إلى 48 بت من الدقة. السلوك غير محدد عندما تكون `value` أي شيء بخلاف عدد صحيح موقع.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة و `byteLength` إلى `uint32`. |
| v0.11.15 | تمت إضافته في: v0.11.15 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في الكتابة. يجب أن تستوفي الشرط `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد كتابتها. يجب أن تستوفي الشرط `0 \< byteLength \<= 6`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات التي تمت كتابتها.

يكتب `byteLength` بايت من `value` إلى `buf` عند `offset` المحدد ك little-endian. يدعم ما يصل إلى 48 بت من الدقة. السلوك غير محدد عندما يكون `value` أي شيء بخلاف عدد صحيح موقّع.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// يطبع: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// يطبع: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.writeUint8()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إجبار ضمني للإزاحة إلى `uint32`. |
| v0.5.0 | تمت إضافته في: v0.5.0 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب تخطيها قبل البدء في الكتابة. يجب أن تستوفي الشرط `0 \<= offset \<= buf.length - 1`. **الافتراضي:** `0`.
- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات التي تمت كتابتها.

يكتب `value` إلى `buf` عند `offset` المحدد. يجب أن يكون `value` عددًا صحيحًا غير موقّع صالحًا مكونًا من 8 بتات. السلوك غير محدد عندما يكون `value` أي شيء بخلاف عدد صحيح غير موقّع مكون من 8 بتات.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `writeUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// يطبع: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// يطبع: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.writeUint16BE()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إكراه ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في الكتابة. يجب أن يفي بـ `0 \<= offset \<= buf.length - 2`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بتنسيق big-endian. يجب أن تكون `value` عددًا صحيحًا صالحًا غير موقّع 16 بت. السلوك غير محدد عندما تكون `value` أي شيء بخلاف عدد صحيح غير موقّع 16 بت.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `writeUint16BE`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.writeUint16LE()`. |
| v10.0.0 | تمت إزالة `noAssert` ولم يعد هناك إكراه ضمني للإزاحة إلى `uint32`. |
| v0.5.5 | تمت الإضافة في: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في الكتابة. يجب أن يفي بـ `0 \<= offset \<= buf.length - 2`. **الافتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بتنسيق little-endian. يجب أن تكون `value` عددًا صحيحًا صالحًا غير موقّع 16 بت. السلوك غير محدد عندما تكون `value` أي شيء بخلاف عدد صحيح غير موقّع 16 بت.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `writeUint16LE`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.writeUint32BE()`. |
| v10.0.0 | تمت إزالة `noAssert` وعدم الإكراه الضمني للإزاحة إلى `uint32` بعد الآن. |
| v0.5.5 | تمت إضافتها في: v0.5.5 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في الكتابة. يجب أن يفي بالشرط `0 <= offset <= buf.length - 4`. **افتراضي:** `0`.
- العائدات: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بنظام big-endian. يجب أن تكون `value` عددًا صحيحًا 32 بت غير مُوقَّع صالحًا. يكون السلوك غير محدد عندما تكون `value` أي شيء بخلاف عدد صحيح 32 بت غير مُوقَّع.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `writeUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.9.0, v12.19.0 | هذه الدالة متاحة أيضًا باسم `buf.writeUint32LE()`. |
| v10.0.0 | تمت إزالة `noAssert` وعدم الإكراه الضمني للإزاحة إلى `uint32` بعد الآن. |
| v0.5.5 | تمت إضافتها في: v0.5.5 |
:::

- `value` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد المراد كتابته إلى `buf`.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي سيتم تخطيها قبل البدء في الكتابة. يجب أن يفي بالشرط `0 <= offset <= buf.length - 4`. **افتراضي:** `0`.
- العائدات: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `value` إلى `buf` عند `offset` المحدد بنظام little-endian. يجب أن تكون `value` عددًا صحيحًا 32 بت غير مُوقَّع صالحًا. يكون السلوك غير محدد عندما تكون `value` أي شيء بخلاف عدد صحيح 32 بت غير مُوقَّع.

هذه الدالة متاحة أيضًا تحت الاسم المستعار `writeUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.9.0, v12.19.0 | هذه الوظيفة متاحة أيضًا باسم `buf.writeUintBE()`. |
| v10.0.0 | تمت إزالة `noAssert` وعدم الإكراه الضمني للإزاحة و `byteLength` إلى `uint32` بعد الآن. |
| v0.5.5 | تمت إضافتها في: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن يستوفي الشرط `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد كتابتها. يجب أن يستوفي الشرط `0 \< byteLength \<= 6`.
- العائدات: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `byteLength` بايت من `value` إلى `buf` في `offset` المحدد بصيغة النهاية الكبيرة. يدعم ما يصل إلى 48 بت من الدقة. السلوك غير محدد عندما يكون `value` أي شيء بخلاف عدد صحيح غير موقع.

هذه الوظيفة متاحة أيضًا تحت الاسم المستعار `writeUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.9.0, v12.19.0 | هذه الوظيفة متاحة أيضًا باسم `buf.writeUintLE()`. |
| v10.0.0 | تمت إزالة `noAssert` وعدم الإكراه الضمني للإزاحة و `byteLength` إلى `uint32` بعد الآن. |
| v0.5.5 | تمت إضافتها في: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم المراد كتابته إلى `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد تخطيها قبل البدء في الكتابة. يجب أن يستوفي الشرط `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد كتابتها. يجب أن يستوفي الشرط `0 \< byteLength \<= 6`.
- العائدات: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` بالإضافة إلى عدد البايتات المكتوبة.

يكتب `byteLength` بايت من `value` إلى `buf` في `offset` المحدد بصيغة النهاية الصغيرة. يدعم ما يصل إلى 48 بت من الدقة. السلوك غير محدد عندما يكون `value` أي شيء بخلاف عدد صحيح غير موقع.

هذه الوظيفة متاحة أيضًا تحت الاسم المستعار `writeUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | استدعاء هذا المنشئ يرسل تحذيرًا بالإهمال عند التشغيل من التعليمات البرمجية خارج دليل `node_modules`. |
| v7.2.1 | استدعاء هذا المنشئ لم يعد يرسل تحذيرًا بالإهمال. |
| v7.0.0 | استدعاء هذا المنشئ يرسل تحذيرًا بالإهمال الآن. |
| v6.0.0 | تم الإهمال منذ: v6.0.0 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray) بدلاً من ذلك.
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مصفوفة من البايتات المراد نسخها.

انظر [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | استدعاء هذا المنشئ يرسل تحذيرًا بالإهمال عند التشغيل من التعليمات البرمجية خارج دليل `node_modules`. |
| v7.2.1 | استدعاء هذا المنشئ لم يعد يرسل تحذيرًا بالإهمال. |
| v7.0.0 | استدعاء هذا المنشئ يرسل تحذيرًا بالإهمال الآن. |
| v6.0.0 | يتم دعم المعلمات `byteOffset` و `length` الآن. |
| v6.0.0 | تم الإهمال منذ: v6.0.0 |
| v3.0.0 | تمت الإضافة في: v3.0.0 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ar/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) بدلاً من ذلك.
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) أو الخاصية `.buffer` لـ [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس البايت الأول المراد عرضه. **الافتراضي:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد عرضها. **الافتراضي:** `arrayBuffer.byteLength - byteOffset`.

انظر [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ar/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 10.0.0 | استدعاء هذا المُنشئ يصدر تحذيرًا بالتقادم عند تشغيله من التعليمات البرمجية خارج دليل `node_modules`. |
| الإصدار 7.2.1 | استدعاء هذا المُنشئ لم يعد يصدر تحذيرًا بالتقادم. |
| الإصدار 7.0.0 | استدعاء هذا المُنشئ يصدر تحذيرًا بالتقادم الآن. |
| الإصدار 6.0.0 | تم الإيقاف منذ: الإصدار 6.0.0 |
:::

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم [`Buffer.from(buffer)`](/ar/nodejs/api/buffer#static-method-bufferfrombuffer) بدلاً من ذلك.
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` موجود أو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) لنسخ البيانات منه.

انظر [`Buffer.from(buffer)`](/ar/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 10.0.0 | استدعاء هذا المُنشئ يصدر تحذيرًا بالتقادم عند تشغيله من التعليمات البرمجية خارج دليل `node_modules`. |
| الإصدار 8.0.0 | `new Buffer(size)` سيعيد ذاكرة مملوءة بالأصفار افتراضيًا. |
| الإصدار 7.2.1 | استدعاء هذا المُنشئ لم يعد يصدر تحذيرًا بالتقادم. |
| الإصدار 7.0.0 | استدعاء هذا المُنشئ يصدر تحذيرًا بالتقادم الآن. |
| الإصدار 6.0.0 | تم الإيقاف منذ: الإصدار 6.0.0 |
:::

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم [`Buffer.alloc()`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) بدلاً من ذلك (انظر أيضًا [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المطلوب لـ `Buffer` الجديد.

انظر [`Buffer.alloc()`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) و [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize). هذا المتغير من المُنشئ يعادل [`Buffer.alloc()`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | يؤدي استدعاء هذا المُنشئ إلى إصدار تحذير إهمال عند تشغيله من التعليمات البرمجية خارج دليل `node_modules`. |
| v7.2.1 | لم يعد استدعاء هذا المُنشئ يصدر تحذير إهمال. |
| v7.0.0 | يؤدي استدعاء هذا المُنشئ إلى إصدار تحذير إهمال الآن. |
| v6.0.0 | مُهمل منذ: v6.0.0 |
:::

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم [`Buffer.from(string[, encoding])`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding) بدلاً من ذلك.
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) السلسلة المراد ترميزها.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز `string`. **الافتراضي:** `'utf8'`.

راجع [`Buffer.from(string[, encoding])`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## الصنف: `File` {#class-file}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | يجعل نسخ مثيلات الملف ممكنًا. |
| v20.0.0 | لم يعد تجريبيًا. |
| v19.2.0, v18.13.0 | تمت الإضافة في: v19.2.0, v18.13.0 |
:::

- يمتد: [\<Blob\>](/ar/nodejs/api/buffer#class-blob)

يوفر [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) معلومات حول الملفات.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**تمت الإضافة في: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ar/nodejs/api/buffer#class-blob) | [\<File[]\>](/ar/nodejs/api/buffer#class-file)  مصفوفة من كائنات السلاسل، أو [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)، أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)، أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)، أو [\<File\>](/ar/nodejs/api/buffer#class-file)، أو [\<Blob\>](/ar/nodejs/api/buffer#class-blob)، أو أي مزيج من هذه الكائنات، والتي سيتم تخزينها داخل `File`.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الملف.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) واحد من `'transparent'` أو `'native'`. عند التعيين إلى `'native'`، سيتم تحويل نهايات الأسطر في أجزاء مصدر السلسلة إلى نهاية السطر الأصلية للنظام الأساسي كما هو محدد بواسطة `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع محتوى الملف.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) تاريخ آخر تعديل للملف. **الافتراضي:** `Date.now()`.


### `file.name` {#filename}

**أُضيف في: v19.2.0, v18.13.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم `الملف` (`File`).

### `file.lastModified` {#filelastmodified}

**أُضيف في: v19.2.0, v18.13.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تاريخ آخر تعديل لـ `الملف` (`File`).

## واجهات برمجة تطبيقات الوحدة النمطية `node:buffer` {#nodebuffer-module-apis}

في حين أن كائن `Buffer` متاح ككائن عام، توجد واجهات برمجة تطبيقات إضافية متعلقة بـ `Buffer` وهي متاحة فقط عبر الوحدة النمطية `node:buffer` التي يتم الوصول إليها باستخدام `require('node:buffer')`.

### `buffer.atob(data)` {#bufferatobdata}

**أُضيف في: v15.13.0, v14.17.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم. استخدم `Buffer.from(data, 'base64')` بدلاً من ذلك.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) سلسلة الإدخال المشفرة بـ Base64.

فك ترميز سلسلة من البيانات المشفرة بـ Base64 إلى بايتات، وتشفير تلك البايتات إلى سلسلة باستخدام Latin-1 (ISO-8859-1).

يمكن أن تكون `data` أي قيمة JavaScript يمكن تحويلها إلى سلسلة.

**يتم توفير هذه الدالة فقط للتوافق مع واجهات برمجة تطبيقات منصة الويب القديمة
ويجب عدم استخدامها أبدًا في التعليمات البرمجية الجديدة، لأنها تستخدم سلاسل لتمثيل
بيانات ثنائية وتسبق إدخال المصفوفات المكتوبة في JavaScript.
بالنسبة إلى التعليمات البرمجية التي تعمل باستخدام واجهات برمجة تطبيقات Node.js، فإن التحويل بين السلاسل المشفرة بـ base64
والبيانات الثنائية يجب أن يتم باستخدام <code>Buffer.from(str, 'base64')</code> و
<code>buf.toString('base64')</code>.**

### `buffer.btoa(data)` {#bufferbtoadata}

**أُضيف في: v15.13.0, v14.17.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم. استخدم `buf.toString('base64')` بدلاً من ذلك.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) سلسلة ASCII (Latin1).

يفك ترميز سلسلة إلى بايتات باستخدام Latin-1 (ISO-8859)، ويشفر تلك البايتات إلى سلسلة باستخدام Base64.

يمكن أن تكون `data` أي قيمة JavaScript يمكن تحويلها إلى سلسلة.

**يتم توفير هذه الدالة فقط للتوافق مع واجهات برمجة تطبيقات منصة الويب القديمة
ويجب عدم استخدامها أبدًا في التعليمات البرمجية الجديدة، لأنها تستخدم سلاسل لتمثيل
بيانات ثنائية وتسبق إدخال المصفوفات المكتوبة في JavaScript.
بالنسبة إلى التعليمات البرمجية التي تعمل باستخدام واجهات برمجة تطبيقات Node.js، فإن التحويل بين السلاسل المشفرة بـ base64
والبيانات الثنائية يجب أن يتم باستخدام <code>Buffer.from(str, 'base64')</code> و
<code>buf.toString('base64')</code>.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**تمت الإضافة في: v19.6.0, v18.15.0**

- input [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) الإدخال المراد التحقق منه.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع هذه الدالة `true` إذا كان `input` يحتوي فقط على بيانات مرمزة بـ ASCII صالحة، بما في ذلك الحالة التي يكون فيها `input` فارغًا.

تطرح خطأً إذا كان `input` عبارة عن مخزن مؤقت منفصل للصفيف.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**تمت الإضافة في: v19.4.0, v18.14.0**

- input [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) الإدخال المراد التحقق منه.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع هذه الدالة `true` إذا كان `input` يحتوي فقط على بيانات مرمزة بـ UTF-8 صالحة، بما في ذلك الحالة التي يكون فيها `input` فارغًا.

تطرح خطأً إذا كان `input` عبارة عن مخزن مؤقت منفصل للصفيف.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**تمت الإضافة في: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `50`

تُرجع الحد الأقصى لعدد البايتات التي سيتم إرجاعها عند استدعاء `buf.inspect()`. يمكن تجاوز ذلك بواسطة وحدات المستخدم. راجع [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) لمزيد من التفاصيل حول سلوك `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**تمت الإضافة في: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر حجم مسموح به لمثيل `Buffer` واحد.

اسم مستعار لـ [`buffer.constants.MAX_LENGTH`](/ar/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**تمت الإضافة في: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أقصى طول مسموح به لمثيل `string` واحد.

اسم مستعار لـ [`buffer.constants.MAX_STRING_LENGTH`](/ar/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**أضيف في: الإصدار v16.7.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة عنوان URL `'blob:nodedata:...'` تم إرجاعها بواسطة استدعاء سابق لـ `URL.createObjectURL()`.
- إرجاع: [\<Blob\>](/ar/nodejs/api/buffer#class-blob)

يقوم بحل `'blob:nodedata:...'` وكائن [\<Blob\>](/ar/nodejs/api/buffer#class-blob) مرتبط مسجل باستخدام استدعاء سابق لـ `URL.createObjectURL()`.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن الآن أن يكون المعامل `source` عبارة عن `Uint8Array`. |
| v7.1.0 | أضيف في: الإصدار v7.1.0 |
:::

- `source` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) مثيل `Buffer` أو `Uint8Array`.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز الحالي.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز الهدف.
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يقوم بإعادة ترميز مثيل `Buffer` أو `Uint8Array` المحدد من ترميز أحرف إلى آخر. يُرجع مثيل `Buffer` جديد.

يُطلق خطأ إذا حددت `fromEnc` أو `toEnc` ترميزات أحرف غير صالحة أو إذا لم يكن التحويل من `fromEnc` إلى `toEnc` مسموحًا به.

الترميزات المدعومة بواسطة `buffer.transcode()` هي: `'ascii'` و `'utf8'` و `'utf16le'` و `'ucs2'` و `'latin1'` و `'binary'`.

ستستخدم عملية التحويل رموز الاستبدال إذا كان لا يمكن تمثيل تسلسل بايت معين بشكل كاف في ترميز الهدف. على سبيل المثال:



::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

نظرًا لأن علامة اليورو (`€`) غير قابلة للتمثيل في US-ASCII، فسيتم استبدالها بـ `؟` في `Buffer` الذي تم تحويل ترميزه.


### الفئة: `SlowBuffer` {#class-slowbuffer}

**تم الإيقاف منذ: الإصدار 6.0.0**

::: danger [ثابت: 0 - تم الإيقاف]
[ثابت: 0](/ar/nodejs/api/documentation#stability-index) [الثبات: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف: استخدم [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) بدلاً من ذلك.
:::

راجع [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). لم تكن هذه فئة بالمعنى الذي أعاده فيه المنشئ دائمًا مثيل `Buffer`، بدلاً من مثيل `SlowBuffer`.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**تم الإيقاف منذ: الإصدار 6.0.0**

::: danger [ثابت: 0 - تم الإيقاف]
[ثابت: 0](/ar/nodejs/api/documentation#stability-index) [الثبات: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف: استخدم [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) بدلاً من ذلك.
:::

- `size` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول المطلوب لـ `SlowBuffer` الجديد.

راجع [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### ثوابت Buffer {#buffer-constants}

**تمت الإضافة في: الإصدار 8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | تم تغيير القيمة إلى 2<sup>32</sup> - 1 في معماريات 64 بت. |
| v15.0.0 | تم تغيير القيمة إلى 2<sup>31</sup> في معماريات 64 بت. |
| v14.0.0 | تم تغيير القيمة من 2<sup>32</sup> - 1 إلى 2<sup>31</sup> - 1 في معماريات 64 بت. |
| v8.2.0 | تمت الإضافة في: الإصدار 8.2.0 |
:::

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر حجم مسموح به لمثيل `Buffer` واحد.

في معماريات 32 بت، هذه القيمة حاليًا 2<sup>31</sup> - 1 (حوالي 1 جيجابايت).

في معماريات 64 بت، هذه القيمة حاليًا 2<sup>53</sup> - 1 (حوالي 8 بيتابايت).

وهي تعكس [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) في الخلفية.

تتوفر هذه القيمة أيضًا كـ [`buffer.kMaxLength`](/ar/nodejs/api/buffer#bufferkmaxlength).

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**تمت الإضافة في: الإصدار 8.2.0**

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر طول مسموح به لمثيل `string` واحد.

يمثل أكبر `length` يمكن أن يمتلكه بدائي `string`، ويتم حسابه بوحدات رمز UTF-16.

قد تعتمد هذه القيمة على محرك JS المستخدم.


## ‏‎`Buffer.from()‎`‎‏، ‏‎`Buffer.alloc()‎`‎‏، و ‏‎`Buffer.allocUnsafe()`‎‏ {#bufferfrom-bufferalloc-and-bufferallocunsafe}

في إصدارات Node.js قبل 6.0.0، تم إنشاء مثيلات `Buffer` باستخدام وظيفة البناء `Buffer`، والتي تخصص `Buffer` المرتجع بشكل مختلف بناءً على الوسائط المقدمة:

- تمرير رقم كأول وسيط إلى `Buffer()` (على سبيل المثال `new Buffer(10)`) يخصص كائن `Buffer` جديد بالحجم المحدد. قبل Node.js 8.0.0، الذاكرة المخصصة لمثل هذه المثيلات `Buffer` *غير* مهيأة *وقد تحتوي على بيانات حساسة*. يجب *تهيئة* مثيلات `Buffer` هذه لاحقًا إما باستخدام [`buf.fill(0)`](/ar/nodejs/api/buffer#buffillvalue-offset-end-encoding) أو عن طريق الكتابة إلى `Buffer` بأكمله قبل قراءة البيانات من `Buffer`. بينما هذا السلوك *مقصود* لتحسين الأداء، فقد أظهرت تجربة التطوير أن هناك حاجة إلى تمييز أكثر وضوحًا بين إنشاء `Buffer` سريع ولكنه غير مهيأ مقابل إنشاء `Buffer` أبطأ ولكنه أكثر أمانًا. منذ Node.js 8.0.0، تقوم `Buffer(num)` و `new Buffer(num)` بإرجاع `Buffer` بذاكرة مهيأة.
- تمرير سلسلة أو مصفوفة أو `Buffer` كأول وسيط ينسخ بيانات الكائن الذي تم تمريره إلى `Buffer`.
- تمرير [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) يُرجع `Buffer` يشارك الذاكرة المخصصة مع مخزن المصفوفة المحدد.

نظرًا لأن سلوك `new Buffer()` يختلف اعتمادًا على نوع الوسيط الأول، فقد يتم إدخال مشكلات أمنية وموثوقية عن غير قصد في التطبيقات عند عدم إجراء التحقق من صحة الوسيط أو تهيئة `Buffer`.

على سبيل المثال، إذا تمكن مهاجم من جعل تطبيق ما يتلقى رقمًا حيث يُتوقع وجود سلسلة، فقد يستدعي التطبيق `new Buffer(100)` بدلاً من `new Buffer("100")`، مما يؤدي إلى تخصيص مخزن مؤقت بحجم 100 بايت بدلاً من تخصيص مخزن مؤقت بحجم 3 بايت بالمحتوى `"100"`. هذا ممكن بشكل شائع باستخدام استدعاءات JSON API. نظرًا لأن JSON يميز بين الأنواع الرقمية والسلاسل، فإنه يسمح بحقن الأرقام حيث قد يتوقع تطبيق مكتوب ببساطة لا يتحقق من صحة مدخلاته بشكل كافٍ أن يتلقى دائمًا سلسلة. قبل Node.js 8.0.0، قد يحتوي المخزن المؤقت الذي يبلغ حجمه 100 بايت على بيانات عشوائية موجودة مسبقًا في الذاكرة، لذلك يمكن استخدامه للكشف عن أسرار في الذاكرة لمهاجم بعيد. منذ Node.js 8.0.0، لا يمكن أن يحدث الكشف عن الذاكرة لأن البيانات مملوءة بالصفر. ومع ذلك، لا تزال الهجمات الأخرى ممكنة، مثل التسبب في تخصيص مخازن مؤقتة كبيرة جدًا بواسطة الخادم، مما يؤدي إلى تدهور الأداء أو التعطل بسبب استنفاد الذاكرة.

لجعل إنشاء مثيلات `Buffer` أكثر موثوقية وأقل عرضة للخطأ، تم **إهمال** الأشكال المختلفة لمنشئ `new Buffer()` واستبدالها بطرق منفصلة `Buffer.from()` و [`Buffer.alloc()`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) و [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize).

*يجب على المطورين ترحيل جميع الاستخدامات الحالية لمنشئات <code>new Buffer()</code>
إلى إحدى واجهات برمجة التطبيقات الجديدة هذه.*

- [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray) تُرجع `Buffer` جديدًا *يحتوي على نسخة* من الثمانيات المتوفرة.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ar/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) تُرجع `Buffer` جديدًا *يشارك نفس الذاكرة المخصصة* مثل [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) المحدد.
- [`Buffer.from(buffer)`](/ar/nodejs/api/buffer#static-method-bufferfrombuffer) تُرجع `Buffer` جديدًا *يحتوي على نسخة* من محتويات `Buffer` المحدد.
- [`Buffer.from(string[, encoding])`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding) تُرجع `Buffer` جديدًا *يحتوي على نسخة* من السلسلة المتوفرة.
- [`Buffer.alloc(size[, fill[, encoding]])`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) تُرجع `Buffer` مهيأة جديدة بالحجم المحدد. هذه الطريقة أبطأ من [`Buffer.allocUnsafe(size)`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) ولكنها تضمن أن مثيلات `Buffer` التي تم إنشاؤها حديثًا لا تحتوي أبدًا على بيانات قديمة يحتمل أن تكون حساسة. سيتم طرح `TypeError` إذا لم يكن `size` رقمًا.
- [`Buffer.allocUnsafe(size)`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) و [`Buffer.allocUnsafeSlow(size)`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) تُرجع كل منهما `Buffer` غير مهيأة جديدة بالحجم المحدد `size`. نظرًا لأن `Buffer` غير مهيأة، فقد يحتوي الجزء المخصص من الذاكرة على بيانات قديمة يحتمل أن تكون حساسة.

قد يتم تخصيص مثيلات `Buffer` التي تم إرجاعها بواسطة [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) و [`Buffer.from(string)`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding) و [`Buffer.concat()`](/ar/nodejs/api/buffer#static-method-bufferconcatlist-totallength) و [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray) من مجموعة ذاكرة داخلية مشتركة إذا كان `size` أقل من أو يساوي نصف [`Buffer.poolSize`](/ar/nodejs/api/buffer#class-property-bufferpoolsize). المثيلات التي تم إرجاعها بواسطة [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) *لا* تستخدم أبدًا مجموعة الذاكرة الداخلية المشتركة.


### خيار سطر الأوامر `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**أضيف في: v5.10.0**

يمكن بدء تشغيل Node.js باستخدام خيار سطر الأوامر `--zero-fill-buffers` لجعل جميع مثيلات `Buffer` المخصصة حديثًا مملوءة بالصفر افتراضيًا عند الإنشاء. بدون هذا الخيار، فإن المخازن المؤقتة التي تم إنشاؤها باستخدام [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) و [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) و `new SlowBuffer(size)` ليست مملوءة بالصفر. قد يكون لاستخدام هذا العلم تأثير سلبي قابل للقياس على الأداء. استخدم الخيار `--zero-fill-buffers` فقط عند الضرورة لفرض أن مثيلات `Buffer` المخصصة حديثًا لا يمكن أن تحتوي على بيانات قديمة يحتمل أن تكون حساسة.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### ما الذي يجعل `Buffer.allocUnsafe()` و `Buffer.allocUnsafeSlow()` "غير آمنين"؟ {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

عند استدعاء [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) و [`Buffer.allocUnsafeSlow()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)، يكون جزء الذاكرة المخصص *غير مهيأ* (غير مملوء بالأصفار). في حين أن هذا التصميم يجعل تخصيص الذاكرة سريعًا جدًا، فقد يحتوي جزء الذاكرة المخصص على بيانات قديمة يحتمل أن تكون حساسة. يمكن أن يسمح استخدام `Buffer` تم إنشاؤه بواسطة [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) دون الكتابة *الكاملة* فوق الذاكرة بتسريب هذه البيانات القديمة عند قراءة ذاكرة `Buffer`.

في حين أن هناك مزايا أداء واضحة لاستخدام [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize)، يجب توخي الحذر *الإضافي* لتجنب إدخال نقاط ضعف أمنية في التطبيق.

