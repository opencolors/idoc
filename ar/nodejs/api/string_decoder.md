---
title: توثيق Node.js - String Decoder
description: توفر وحدة String Decoder واجهة برمجة تطبيقات لفك تشفير كائنات Buffer إلى سلاسل بطريقة محسنّة لترميز الأحرف الداخلي للسلاسل.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - String Decoder | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة String Decoder واجهة برمجة تطبيقات لفك تشفير كائنات Buffer إلى سلاسل بطريقة محسنّة لترميز الأحرف الداخلي للسلاسل.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - String Decoder | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة String Decoder واجهة برمجة تطبيقات لفك تشفير كائنات Buffer إلى سلاسل بطريقة محسنّة لترميز الأحرف الداخلي للسلاسل.
---


# فك ترميز السلاسل النصية {#string-decoder}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

توفر وحدة `node:string_decoder` واجهة برمجة تطبيقات لفك ترميز كائنات `Buffer` إلى سلاسل نصية بطريقة تحافظ على أحرف UTF-8 و UTF-16 المشفرة متعددة البايت. يمكن الوصول إليها باستخدام:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

يوضح المثال التالي الاستخدام الأساسي للفئة `StringDecoder`.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // يطبع: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // يطبع: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // يطبع: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // يطبع: €
```
:::

عندما تتم كتابة مثيل `Buffer` إلى مثيل `StringDecoder`, يتم استخدام مخزن مؤقت داخلي لضمان أن السلسلة النصية التي تم فك ترميزها لا تحتوي على أي أحرف متعددة البايت غير مكتملة. يتم الاحتفاظ بها في المخزن المؤقت حتى الاستدعاء التالي لـ `stringDecoder.write()` أو حتى يتم استدعاء `stringDecoder.end()`.

في المثال التالي، تتم كتابة البايتات الثلاثة المشفرة بـ UTF-8 لرمز اليورو الأوروبي (`€`) عبر ثلاث عمليات منفصلة:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // يطبع: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // يطبع: €
```
:::

## الصنف: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**تمت إضافته في: الإصدار v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز الأحرف [encoding](/ar/nodejs/api/buffer#buffers-and-character-encodings) الذي سيستخدمه `StringDecoder`. **افتراضي:** `'utf8'`.

ينشئ نسخة جديدة من `StringDecoder`.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**تمت إضافته في: الإصدار v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) البايتات لفك ترميزها.
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع أي مدخل متبقي مخزن في المخزن المؤقت الداخلي كسلسلة نصية. سيتم استبدال البايتات التي تمثل أحرف UTF-8 وUTF-16 غير المكتملة بأحرف استبدال مناسبة لترميز الأحرف.

إذا تم توفير وسيط `buffer`، فسيتم إجراء استدعاء نهائي لـ `stringDecoder.write()` قبل إرجاع المدخل المتبقي. بعد استدعاء `end()`، يمكن إعادة استخدام كائن `stringDecoder` لمدخلات جديدة.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يتم الآن استبدال كل حرف غير صالح بحرف استبدال واحد بدلاً من حرف واحد لكل بايت على حدة. |
| v0.1.99 | تمت إضافته في: الإصدار v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) البايتات لفك ترميزها.
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع سلسلة نصية مفكوكة الترميز، مع التأكد من أن أي أحرف متعددة البايتات غير مكتملة في نهاية `Buffer` أو `TypedArray` أو `DataView` يتم حذفها من السلسلة النصية التي تم إرجاعها وتخزينها في مخزن مؤقت داخلي للاستدعاء التالي لـ `stringDecoder.write()` أو `stringDecoder.end()`.

