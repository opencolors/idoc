---
title: توثيق واجهة برمجة التطبيقات (API) لنظام الملفات في Node.js
description: دليل شامل لوحدة نظام الملفات في Node.js، يتناول الأساليب المتعلقة بعمليات الملفات مثل القراءة، والكتابة، والفتح، والإغلاق، وإدارة أذونات الملفات والإحصائيات.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات (API) لنظام الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: دليل شامل لوحدة نظام الملفات في Node.js، يتناول الأساليب المتعلقة بعمليات الملفات مثل القراءة، والكتابة، والفتح، والإغلاق، وإدارة أذونات الملفات والإحصائيات.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات (API) لنظام الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: دليل شامل لوحدة نظام الملفات في Node.js، يتناول الأساليب المتعلقة بعمليات الملفات مثل القراءة، والكتابة، والفتح، والإغلاق، وإدارة أذونات الملفات والإحصائيات.
---


# نظام الملفات {#file-system}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**الكود المصدري:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

تُمكّن وحدة `node:fs` من التفاعل مع نظام الملفات بطريقة مُصممة على غرار وظائف POSIX القياسية.

لاستخدام واجهات برمجة التطبيقات المستندة إلى الوعد:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

لاستخدام واجهات برمجة التطبيقات المستندة إلى معاودة الاتصال والمتزامنة:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

تتمتع جميع عمليات نظام الملفات بأشكال متزامنة ومعتمدة على معاودة الاتصال ومعتمدة على الوعد، ويمكن الوصول إليها باستخدام كل من بناء جملة CommonJS ووحدات ES6 (ESM).

## مثال الوعد {#promise-example}

تُرجع العمليات المستندة إلى الوعد وعدًا يتم تنفيذه عند اكتمال العملية غير المتزامنة.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## مثال معاودة الاتصال {#callback-example}

يأخذ نموذج معاودة الاتصال دالة معاودة اتصال الإكمال كوسيطة أخيرة له ويستدعي العملية بشكل غير متزامن. تعتمد الوسائط التي تم تمريرها إلى معاودة اتصال الإكمال على الطريقة، ولكن الوسيطة الأولى محجوزة دائمًا للاستثناء. إذا اكتملت العملية بنجاح، فإن الوسيطة الأولى هي `null` أو `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

يفضل استخدام الإصدارات المستندة إلى معاودة الاتصال من واجهات برمجة التطبيقات الخاصة بوحدة `node:fs` على استخدام واجهات برمجة التطبيقات المستندة إلى الوعد عندما تكون هناك حاجة إلى أقصى أداء (سواء من حيث وقت التنفيذ أو تخصيص الذاكرة).


## مثال متزامن {#synchronous-example}

تقوم واجهات برمجة التطبيقات المتزامنة بحظر حلقة أحداث Node.js وتنفيذ JavaScript الإضافي حتى اكتمال العملية. يتم طرح الاستثناءات على الفور ويمكن التعامل معها باستخدام `try…catch`، أو يمكن السماح لها بالارتفاع.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('تم حذف /tmp/hello بنجاح');
} catch (err) {
  // معالجة الخطأ
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('تم حذف /tmp/hello بنجاح');
} catch (err) {
  // معالجة الخطأ
}
```
:::

## واجهة برمجة تطبيقات الوعود (Promises) {#promises-api}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | تم عرضه كـ `require('fs/promises')`. |
| v11.14.0, v10.17.0 | واجهة برمجة التطبيقات هذه لم تعد تجريبية. |
| v10.1.0 | يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('fs').promises` فقط. |
| v10.0.0 | تمت إضافته في: v10.0.0 |
:::

توفر واجهة برمجة التطبيقات `fs/promises` طرق نظام ملفات غير متزامنة تُرجع وعودًا.

تستخدم واجهات برمجة تطبيقات الوعود مجمع مؤشرات ترابط Node.js الأساسي لتنفيذ عمليات نظام الملفات خارج مؤشر ترابط حلقة الأحداث. هذه العمليات ليست متزامنة أو آمنة للمؤشرات. يجب توخي الحذر عند إجراء تعديلات متزامنة متعددة على نفس الملف أو قد يحدث تلف للبيانات.

### الفئة: `FileHandle` {#class-filehandle}

**تمت إضافته في: v10.0.0**

كائن [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) هو غلاف كائن لواصف ملف رقمي.

يتم إنشاء مثيلات كائن [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) بواسطة طريقة `fsPromises.open()`.

جميع كائنات [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) هي [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)s.

إذا لم يتم إغلاق [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) باستخدام طريقة `filehandle.close()`، فسوف يحاول إغلاق واصف الملف تلقائيًا وإصدار تحذير العملية، مما يساعد على منع تسرب الذاكرة. يرجى عدم الاعتماد على هذا السلوك لأنه قد يكون غير موثوق به وقد لا يتم إغلاق الملف. بدلاً من ذلك، قم دائمًا بإغلاق [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle)s بشكل صريح. قد يغير Node.js هذا السلوك في المستقبل.


#### الحدث: `'close'` {#event-close}

**تمت إضافته في: الإصدار v15.4.0**

يتم إصدار حدث `'close'` عندما يتم إغلاق [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) ولم يعد من الممكن استخدامه.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.1.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v15.14.0, v14.18.0 | تدعم وسيطة `data` الآن `AsyncIterable` و `Iterable` و `Stream`. |
| v14.0.0 | لن تجبر معلمة `data` المدخلات غير المدعومة على سلاسل نصية بعد الآن. |
| v10.0.0 | تمت إضافته في: الإصدار v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ar/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، فسيتم تفريغ واصف الملف الأساسي قبل إغلاقه. **الافتراضي:** `false`.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقه مع `undefined` عند النجاح.

اسم مستعار لـ [`filehandle.writeFile()`](/ar/nodejs/api/fs#filehandlewritefiledata-options).

عند التشغيل على مقابض الملفات، لا يمكن تغيير الوضع عن ما تم تعيينه باستخدام [`fsPromises.open()`](/ar/nodejs/api/fs#fspromisesopenpath-flags-mode). لذلك، هذا يعادل [`filehandle.writeFile()`](/ar/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**تمت الإضافة في: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قناع بت وضع الملف.
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه مع `undefined` عند النجاح.

يعدل الأذونات على الملف. انظر [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**تمت الإضافة في: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف المستخدم الجديد لمالك الملف.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف المجموعة الجديد لمجموعة الملف.
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه مع `undefined` عند النجاح.

يغير ملكية الملف. وهو عبارة عن غلاف لـ [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**تمت الإضافة في: v10.0.0**

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه مع `undefined` عند النجاح.

يغلق مؤشر الملف بعد انتظار اكتمال أي عملية معلقة على المؤشر.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**تمت الإضافة في: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **الافتراضي:** `undefined`


- الإرجاع: [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream)

يمكن أن تتضمن `options` قيم `start` و `end` لقراءة نطاق من البايتات من الملف بدلاً من الملف بأكمله. كل من `start` و `end` شاملتان وتبدآن العد من 0، والقيم المسموح بها في النطاق [0، [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. إذا تم حذف `start` أو كانت `undefined`، فستقرأ `filehandle.createReadStream()` بالتتابع من موضع الملف الحالي. يمكن أن يكون `encoding` أيًا من تلك المقبولة بواسطة [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا كان `FileHandle` يشير إلى جهاز أحرف يدعم فقط عمليات القراءة المحظورة (مثل لوحة المفاتيح أو بطاقة الصوت)، فلن تنتهي عمليات القراءة حتى تصبح البيانات متاحة. يمكن أن يمنع هذا العملية من الخروج وتدفق الإغلاق بشكل طبيعي.

بشكل افتراضي، سيصدر التدفق حدث `'close'` بعد تدميره. قم بتعيين الخيار `emitClose` على `false` لتغيير هذا السلوك.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Create a stream from some character device.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
```
إذا كانت `autoClose` خطأ، فلن يتم إغلاق واصف الملف، حتى إذا كان هناك خطأ. تقع على عاتق التطبيق مسؤولية إغلاقه والتأكد من عدم وجود تسرب لواصف الملف. إذا تم تعيين `autoClose` على true (السلوك الافتراضي)، فسيتم إغلاق واصف الملف تلقائيًا عند `'error'` أو `'end'`.

مثال لقراءة آخر 10 بايتات من ملف طوله 100 بايت:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v16.11.0 | أضيف في: v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة `true`، فسيتم تنظيف واصف الملف الأساسي قبل إغلاقه. **الافتراضي:** `false`.
  
 
- إرجاع: [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream)

قد تتضمن `options` أيضًا خيار `start` للسماح بكتابة البيانات في موضع ما بعد بداية الملف، والقيم المسموح بها موجودة في النطاق [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. قد يتطلب تعديل ملف بدلاً من استبداله تعيين خيار `flags` `open` إلى `r+` بدلاً من `r` الافتراضي. يمكن أن يكون `encoding` أيًا من تلك المقبولة بواسطة [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم تعيين `autoClose` إلى true (السلوك الافتراضي) عند `'error'` أو `'finish'`، فسيتم إغلاق واصف الملف تلقائيًا. إذا كانت `autoClose` false، فلن يتم إغلاق واصف الملف، حتى إذا كان هناك خطأ. تقع على عاتق التطبيق مسؤولية إغلاقه والتأكد من عدم وجود تسرب لواصف الملف.

بشكل افتراضي، سيصدر التدفق حدث `'close'` بعد تدميره. قم بتعيين خيار `emitClose` إلى `false` لتغيير هذا السلوك.


#### `filehandle.datasync()` {#filehandledatasync}

**تمت الإضافة في: v10.0.0**

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق بـ `undefined` عند النجاح.

يجبر جميع عمليات الإدخال/الإخراج (I/O) المنتظرة حاليًا المرتبطة بالملف على حالة إكمال الإدخال/الإخراج المتزامنة لنظام التشغيل. راجع وثائق POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) للحصول على التفاصيل.

بخلاف `filehandle.sync`، لا تقوم هذه الطريقة بتفريغ البيانات الوصفية المعدلة.

#### `filehandle.fd` {#filehandlefd}

**تمت الإضافة في: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف الملف الرقمي الذي تتم إدارته بواسطة كائن [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle).

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | يقبل قيم bigint كـ `position`. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مخزن مؤقت سيتم ملؤه ببيانات الملف المقروءة.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الموقع في المخزن المؤقت الذي سيبدأ الملء عنده. **افتراضي:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها. **افتراضي:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الموقع الذي ستبدأ عنده قراءة البيانات من الملف. إذا كانت القيمة `null` أو `-1`، فستتم قراءة البيانات من موضع الملف الحالي، وسيتم تحديث الموضع. إذا كان `position` عددًا صحيحًا غير سالب، فسيظل موضع الملف الحالي دون تغيير. **افتراضي:** `null`
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق عند النجاح بكائن له خاصيتان:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تمت قراءتها
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مرجع إلى وسيطة `buffer` التي تم تمريرها.
  
 

يقرأ البيانات من الملف ويخزنها في المخزن المؤقت المحدد.

إذا لم يتم تعديل الملف بشكل متزامن، فسيتم الوصول إلى نهاية الملف عندما يكون عدد البايتات المقروءة صفرًا.


#### `filehandle.read([options])` {#filehandlereadoptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 21.0.0 | يقبل قيم bigint كـ `position`. |
| الإصداران 13.11.0، 12.17.0 | تمت إضافته في: الإصدار 13.11.0، 12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مخزن مؤقت سيتم ملؤه ببيانات الملف المقروءة. **افتراضي:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الموقع في المخزن المؤقت الذي سيبدأ فيه الملء. **افتراضي:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها. **افتراضي:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الموقع الذي تبدأ منه قراءة البيانات من الملف. إذا كان `null` أو `-1`، فسيتم قراءة البيانات من موضع الملف الحالي، وسيتم تحديث الموضع. إذا كان `position` عددًا صحيحًا غير سالب، فسيظل موضع الملف الحالي دون تغيير. **افتراضي**: `null`


- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق عند النجاح مع كائن له خاصيتان:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المقروءة
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مرجع إلى وسيطة `buffer` التي تم تمريرها.



يقرأ البيانات من الملف ويخزنها في المخزن المؤقت المحدد.

إذا لم يتم تعديل الملف في نفس الوقت، يتم الوصول إلى نهاية الملف عندما يكون عدد البايتات المقروءة صفرًا.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | يقبل قيم bigint كـ `position`. |
| v18.2.0, v16.17.0 | تمت إضافتها في: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مُخزن مؤقت سيتم ملؤه ببيانات الملف المقروءة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الموقع في المخزن المؤقت الذي سيتم بدء الملء عنده. **الافتراضي:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها. **الافتراضي:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الموقع الذي سيتم بدء قراءة البيانات من الملف عنده. إذا كانت `null` أو `-1`، فسيتم قراءة البيانات من موقع الملف الحالي، وسيتم تحديث الموقع. إذا كان `position` عددًا صحيحًا غير سالب، فسيظل موقع الملف الحالي دون تغيير. **الافتراضي:**: `null`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقه عند النجاح بكائن له خاصيتان:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تمت قراءتها
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مرجع إلى وسيطة `buffer` التي تم تمريرها.


يقرأ البيانات من الملف ويخزنها في المخزن المؤقت المحدد.

إذا لم يتم تعديل الملف بشكل متزامن، يتم الوصول إلى نهاية الملف عندما يكون عدد البايتات المقروءة صفرًا.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v20.0.0، v18.17.0 | تمت إضافة خيار لإنشاء تدفق 'bytes'. |
| الإصدار v17.0.0 | تمت الإضافة في: الإصدار v17.0.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

-  `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<غير معرف\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) ما إذا كان سيتم فتح تدفق عادي أو تدفق `'bytes'`. **الافتراضي:** `غير معرف`
  
 
-  إرجاع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) 

إرجاع `ReadableStream` يمكن استخدامه لقراءة بيانات الملفات.

سيتم طرح خطأ إذا تم استدعاء هذا الأسلوب أكثر من مرة أو تم استدعاؤه بعد إغلاق أو إغلاق `FileHandle`.



::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

بينما سيقرأ `ReadableStream` الملف حتى الاكتمال، فلن يغلق `FileHandle` تلقائيًا. يجب على كود المستخدم الاستمرار في استدعاء أسلوب `fileHandle.close()`.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**تمت الإضافة في: الإصدار v10.0.0**

- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<فارغ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `فارغ`
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء عملية readFile قيد التقدم
  
 
- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق عند القراءة الناجحة لمحتويات الملف. إذا لم يتم تحديد ترميز (باستخدام `options.encoding`)، فسيتم إرجاع البيانات كـ [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) كائن. بخلاف ذلك، ستكون البيانات عبارة عن سلسلة.

يقوم بقراءة محتويات الملف بالكامل بشكل غير متزامن.

إذا كانت `options` عبارة عن سلسلة، فإنها تحدد `encoding`.

يجب أن يدعم [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) القراءة.

إذا تم إجراء مكالمة واحدة أو أكثر لـ `filehandle.read()` على مقبض ملف ثم تم إجراء مكالمة `filehandle.readFile()`، فسيتم قراءة البيانات من الموضع الحالي حتى نهاية الملف. لا يقرأ دائمًا من بداية الملف.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**أضيف في: الإصدار v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `64 * 1024`
  
 
- القيمة المُعادة: [\<readline.InterfaceConstructor\>](/ar/nodejs/api/readline#class-interfaceconstructor)

طريقة مُيسرة لإنشاء واجهة `readline` وتدفق عبر الملف. راجع [`filehandle.createReadStream()`](/ar/nodejs/api/fs#filehandlecreatereadstreamoptions) للاطلاع على الخيارات.



::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**أضيف في: الإصدار v13.13.0، v12.17.0**

- `buffers` [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الإزاحة من بداية الملف التي يجب قراءة البيانات منها. إذا لم يكن `position` رقمًا، فستتم قراءة البيانات من الموضع الحالي. **الافتراضي:** `null`
- القيمة المُعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم الوفاء بها عند النجاح بكائن يحتوي على خاصيتين:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تمت قراءتها
    - `buffers` [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) خاصية تحتوي على مرجع إلى إدخال `buffers`.
  
 

القراءة من ملف والكتابة إلى مصفوفة من [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي تم إرجاعها يجب أن تكون bigint. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون `bigint`. **الافتراضي:** `false`.


- الإرجاع: [\<وعد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه باستخدام [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) للملف.

#### `filehandle.sync()` {#filehandlesync}

**تمت الإضافة في: v10.0.0**

- الإرجاع: [\<وعد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه مع `undefined` عند النجاح.

اطلب تفريغ جميع البيانات لواصف الملف المفتوح إلى جهاز التخزين. التنفيذ المحدد خاص بنظام التشغيل والجهاز. راجع وثائق POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) لمزيد من التفاصيل.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**تمت الإضافة في: v10.0.0**

- `len` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
- الإرجاع: [\<وعد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه مع `undefined` عند النجاح.

يقطع الملف.

إذا كان الملف أكبر من `len` بايت، فسيتم الاحتفاظ فقط بأول `len` بايت في الملف.

يحافظ المثال التالي على أول أربعة بايتات فقط من الملف:

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
إذا كان الملف أقصر في السابق من `len` بايت، فسيتم تمديده، ويتم ملء الجزء الممتد ببايتات فارغة (`'\0'`):

إذا كانت `len` سالبة، فسيتم استخدام `0`.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**أُضيف في: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

تغيير الطوابع الزمنية لنظام الملفات للكائن المشار إليه بواسطة [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) ثم يفي بالوعد بدون وسائط عند النجاح.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | لن يجبر المعامل `buffer` الإدخال غير المدعوم على المخازن المؤقتة بعد الآن. |
| v10.0.0 | أُضيف في: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) موضع البداية من داخل `buffer` حيث تبدأ البيانات المراد كتابتها.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد كتابتها من `buffer`. **افتراضي:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الإزاحة من بداية الملف حيث يجب كتابة البيانات من `buffer`. إذا لم يكن `position` رقمًا، فستتم كتابة البيانات في الموضع الحالي. انظر وثائق POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) لمزيد من التفاصيل. **افتراضي:** `null`
- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

اكتب `buffer` إلى الملف.

يتم استيفاء الوعد بكائن يحتوي على خاصيتين:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المكتوبة
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مرجع إلى `buffer` المكتوب.

من غير الآمن استخدام `filehandle.write()` عدة مرات على نفس الملف دون انتظار استيفاء (أو رفض) الوعد. لهذا السيناريو، استخدم [`filehandle.createWriteStream()`](/ar/nodejs/api/fs#filehandlecreatewritestreamoptions).

في Linux، لا تعمل الكتابات الموضعية عندما يتم فتح الملف في وضع الإلحاق. تتجاهل النواة وسيطة الموضع وتقوم دائمًا بإلحاق البيانات بنهاية الملف.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**أُضيف في: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `null`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

كتابة `buffer` إلى الملف.

على غرار الدالة `filehandle.write` أعلاه، تأخذ هذه النسخة كائن `options` اختياري. إذا لم يتم تحديد كائن `options`، فسيتم افتراض القيم المذكورة أعلاه.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | لن يقوم المعامل `string` بعد الآن بتحويل المدخلات غير المدعومة إلى سلاسل نصية. |
| v10.0.0 | أُضيف في: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الإزاحة من بداية الملف حيث يجب كتابة البيانات من `string`. إذا لم يكن `position` عبارة عن `number`، فسيتم كتابة البيانات في الموضع الحالي. راجع وثائق POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) لمزيد من التفاصيل. **الافتراضي:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز السلسلة النصية المتوقع. **الافتراضي:** `'utf8'`
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

اكتب `string` إلى الملف. إذا لم يكن `string` سلسلة نصية، فسيتم رفض الوعد بخطأ.

يتم استيفاء الوعد بكائن يحتوي على خاصيتين:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تم كتابتها
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مرجع إلى `string` المكتوبة.

من غير الآمن استخدام `filehandle.write()` عدة مرات على نفس الملف دون انتظار استيفاء الوعد (أو رفضه). لهذا السيناريو، استخدم [`filehandle.createWriteStream()`](/ar/nodejs/api/fs#filehandlecreatewritestreamoptions).

في Linux، لا تعمل عمليات الكتابة الموضعية عندما يتم فتح الملف في وضع الإلحاق. تتجاهل النواة وسيطة الموضع وتلحق البيانات دائمًا بنهاية الملف.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.14.0, v14.18.0 | تدعم وسيطة `data` كل من `AsyncIterable` و `Iterable` و `Stream`. |
| v14.0.0 | لن تجبر معلمة `data` الإدخال غير المدعوم على سلاسل نصية بعد الآن. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ar/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) ترميز الأحرف المتوقع عندما تكون `data` سلسلة نصية. **الافتراضي:** `'utf8'`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

يكتب البيانات بشكل غير متزامن إلى ملف، ويستبدل الملف إذا كان موجودًا بالفعل. يمكن أن تكون `data` سلسلة نصية أو مخزن مؤقت أو [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) أو كائن [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol). يتم استيفاء الوعد بدون وسيطات عند النجاح.

إذا كانت `options` سلسلة نصية، فإنها تحدد `encoding`.

يجب أن يدعم [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) الكتابة.

من غير الآمن استخدام `filehandle.writeFile()` عدة مرات على نفس الملف دون انتظار استيفاء الوعد (أو رفضه).

إذا تم إجراء مكالمة أو أكثر لـ `filehandle.write()` على مؤشر ملف ثم تم إجراء مكالمة `filehandle.writeFile()`، فسيتم كتابة البيانات من الموضع الحالي حتى نهاية الملف. لا يكتب دائمًا من بداية الملف.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**أُضيف في:** v12.9.0

- `buffers` [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الإزاحة من بداية الملف حيث يجب كتابة البيانات من `buffers`. إذا لم يكن `position` رقمًا، فسيتم كتابة البيانات في الموضع الحالي. **الافتراضي:** `null`
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

اكتب مصفوفة من [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s إلى الملف.

يتم استيفاء الوعد بكائن يحتوي على خاصيتين:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تمت كتابتها
- `buffers` [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مرجع إلى مدخلات `buffers`.

من غير الآمن استدعاء `writev()` عدة مرات على نفس الملف دون انتظار استيفاء (أو رفض) الوعد.

في Linux، الكتابات الموضعية لا تعمل عند فتح الملف في وضع الإلحاق. تتجاهل النواة وسيطة الموضع وتلحق دائمًا البيانات بنهاية الملف.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**أُضيف في:** v20.4.0, v18.18.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

اسم بديل لـ `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**أُضيف في: الإصدار v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `fs.constants.F_OK`
- القيمة المعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقها مع `undefined` عند النجاح.

يختبر أذونات المستخدم للملف أو الدليل المحدد بواسطة `path`. الوسيط `mode` هو عدد صحيح اختياري يحدد فحوصات الوصول التي سيتم إجراؤها. يجب أن تكون `mode` إما القيمة `fs.constants.F_OK` أو قناعًا يتكون من OR المنطقي لأي من `fs.constants.R_OK` و `fs.constants.W_OK` و `fs.constants.X_OK` (مثل `fs.constants.W_OK | fs.constants.R_OK`). تحقق من [ثوابت الوصول إلى الملفات](/ar/nodejs/api/fs#file-access-constants) لمعرفة القيم المحتملة لـ `mode`.

إذا نجح فحص إمكانية الوصول، يتم تحقيق الوعد بدون أي قيمة. إذا فشل أي من فحوصات إمكانية الوصول، فسيتم رفض الوعد باستخدام كائن [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). يتحقق المثال التالي مما إذا كان يمكن قراءة الملف `/etc/passwd` وكتابته بواسطة العملية الحالية.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('يمكن الوصول');
} catch {
  console.error('لا يمكن الوصول');
}
```
لا يوصى باستخدام `fsPromises.access()` للتحقق من إمكانية الوصول إلى ملف قبل استدعاء `fsPromises.open()`. القيام بذلك يُدخل حالة سباق، حيث قد تغير العمليات الأخرى حالة الملف بين الاستدعاءين. بدلاً من ذلك، يجب على كود المستخدم فتح/قراءة/كتابة الملف مباشرةً ومعالجة الخطأ الذي يتم رفعه إذا كان الملف غير قابل للوصول.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.1.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v10.0.0 | أُضيف في: الإصدار v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) اسم الملف أو [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) راجع [دعم علامات نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم مسح واصف الملف الأساسي قبل إغلاقه. **الافتراضي:** `false`.
  
 
- القيمة المعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقها مع `undefined` عند النجاح.

إلحاق البيانات بشكل غير متزامن بملف، وإنشاء الملف إذا لم يكن موجودًا بعد. يمكن أن تكون `data` سلسلة أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا كانت `options` سلسلة، فإنها تحدد `encoding`.

يؤثر خيار `mode` فقط على الملف الذي تم إنشاؤه حديثًا. راجع [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) لمزيد من التفاصيل.

يمكن تحديد `path` على أنه [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) الذي تم فتحه للإلحاق (باستخدام `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**أُضيف في: الإصدار v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع `undefined` عند النجاح.

لتغيير أذونات الملف.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**أُضيف في: الإصدار v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع `undefined` عند النجاح.

لتغيير ملكية الملف.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.0.0 | تم تغيير وسيطة `flags` إلى `mode` وفرض التحقق من النوع الأكثر صرامة. |
| الإصدار v10.0.0 | أُضيف في: الإصدار v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم ملف المصدر المراد نسخه
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم ملف الوجهة لعملية النسخ
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معدِّلات اختيارية تحدد سلوك عملية النسخ. من الممكن إنشاء قناع يتكون من OR المنطقي الثنائي لقيمتين أو أكثر (مثل `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **الافتراضي:** `0`.
    - `fs.constants.COPYFILE_EXCL`: ستفشل عملية النسخ إذا كان `dest` موجودًا بالفعل.
    - `fs.constants.COPYFILE_FICLONE`: ستحاول عملية النسخ إنشاء إعادة ارتباط للنسخ عند الكتابة. إذا كانت المنصة لا تدعم النسخ عند الكتابة، فسيتم استخدام آلية نسخ احتياطية.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: ستحاول عملية النسخ إنشاء إعادة ارتباط للنسخ عند الكتابة. إذا كانت المنصة لا تدعم النسخ عند الكتابة، فستفشل العملية.
  
 
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع `undefined` عند النجاح.

ينسخ `src` إلى `dest` بشكل غير متزامن. بشكل افتراضي، تتم الكتابة فوق `dest` إذا كان موجودًا بالفعل.

لا توجد ضمانات بشأن ذرية عملية النسخ. إذا حدث خطأ بعد فتح ملف الوجهة للكتابة، فستتم محاولة إزالة الوجهة.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('تم نسخ source.txt إلى destination.txt');
} catch {
  console.error('تعذر نسخ الملف');
}

// باستخدام COPYFILE_EXCL، ستفشل العملية إذا كان destination.txt موجودًا.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('تم نسخ source.txt إلى destination.txt');
} catch {
  console.error('تعذر نسخ الملف');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.3.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| v20.1.0, v18.17.0 | قبول خيار `mode` إضافي لتحديد سلوك النسخ كمعامل `mode` لـ `fs.copyFile()`. |
| v17.6.0, v16.15.0 | يقبل خيار `verbatimSymlinks` إضافي لتحديد ما إذا كان سيتم إجراء تحليل المسار للروابط الرمزية أم لا. |
| v16.7.0 | أُضيف في: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار المصدر المراد نسخه.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار الوجهة المراد النسخ إليها.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) فك الروابط الرمزية. **الافتراضي:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `force` هي `false`، وكانت الوجهة موجودة، يتم طرح خطأ. **الافتراضي:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتصفية الملفات/الدلائل المنسوخة. أرجع `true` لنسخ العنصر، `false` لتجاهله. عند تجاهل دليل، سيتم تخطي جميع محتوياته أيضًا. يمكن أيضًا إرجاع `Promise` التي تحل إلى `true` أو `false` **الافتراضي:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار المصدر المراد نسخه.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الوجهة المراد النسخ إليها.
    - Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) قيمة قابلة للإجبار إلى `boolean` أو `Promise` تتحقق بهذه القيمة.


    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) الكتابة فوق الملف أو الدليل الموجود. ستتجاهل عملية النسخ الأخطاء إذا قمت بتعيين هذا إلى false وكانت الوجهة موجودة. استخدم خيار `errorOnExist` لتغيير هذا السلوك. **الافتراضي:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معدِّلات لعملية النسخ. **الافتراضي:** `0`. راجع علامة `mode` الخاصة بـ [`fsPromises.copyFile()`](/ar/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true` سيتم الحفاظ على الطوابع الزمنية من `src`. **الافتراضي:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) نسخ الدلائل بشكل متكرر **الافتراضي:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، سيتم تخطي تحليل المسار للروابط الرمزية. **الافتراضي:** `false`


- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق بـ `undefined` عند النجاح.

ينسخ بشكل غير متزامن هيكل الدليل بأكمله من `src` إلى `dest`، بما في ذلك الدلائل الفرعية والملفات.

عند نسخ دليل إلى دليل آخر، لا يتم دعم الأنماط العامة ويكون السلوك مشابهًا لـ `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v22.2.0 | إضافة دعم لـ `withFileTypes` كخيار. |
| v22.0.0 | أُضيف في: v22.0.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `pattern` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<سلسلة نصية[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دليل العمل الحالي. **الافتراضي:** `process.cwd()`
    - `exclude` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتصفية الملفات/المجلدات. تُرجع `true` لاستبعاد العنصر، و `false` لتضمينه. **الافتراضي:** `undefined`.
    - `withFileTypes` [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان يجب أن تُرجع glob المسارات كـ Dirents، و `false` بخلاف ذلك. **الافتراضي:** `false`.


- الإرجاع: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) مُكرِّر غير متزامن يُنتج مسارات الملفات التي تتطابق مع النمط.



::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**تم الإلغاء منذ: v10.0.0**

- `path` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يفي بـ `undefined` عند النجاح.

يغير الأذونات على رابط رمزي.

يتم تنفيذ هذه الطريقة فقط على نظام التشغيل macOS.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.6.0 | لم تعد واجهة برمجة التطبيقات هذه مهملة. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع `undefined` عند النجاح.

لتغيير ملكية رابط رمزي.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**تمت الإضافة في: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع `undefined` عند النجاح.

يقوم بتغيير أوقات الوصول والتعديل لملف بنفس الطريقة التي تعمل بها [`fsPromises.utimes()`](/ar/nodejs/api/fs#fspromisesutimespath-atime-mtime)، مع الاختلاف أنه إذا كان المسار يشير إلى رابط رمزي، فلن يتم إلغاء الإشارة إلى الرابط: بدلاً من ذلك، يتم تغيير الطوابع الزمنية للرابط الرمزي نفسه.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**أُضيف في: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يفي بـ `undefined` عند النجاح.

ينشئ رابطًا جديدًا من `existingPath` إلى `newPath`. راجع وثائق POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) لمزيد من التفاصيل.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية المرجعة يجب أن تكون bigint. |
| v10.0.0 | أُضيف في: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سواء كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) المرجع يجب أن تكون `bigint`. **الافتراضي:** `false`.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يفي بكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) لمسار الارتباط الرمزي المحدد `path`.

يعادل [`fsPromises.stat()`](/ar/nodejs/api/fs#fspromisesstatpath-options) ما لم يشر `path` إلى ارتباط رمزي، وفي هذه الحالة يتم فحص الارتباط نفسه، وليس الملف الذي يشير إليه. راجع مستند POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) لمزيد من التفاصيل.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**تمت إضافتها في: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) غير مدعوم في نظام التشغيل Windows. **الافتراضي:** `0o777`.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) عند النجاح، تتحقق القيمة مع `undefined` إذا كانت قيمة `recursive` هي `false`، أو مسار الدليل الأول الذي تم إنشاؤه إذا كانت قيمة `recursive` هي `true`.

يقوم بإنشاء دليل بشكل غير متزامن.

يمكن أن تكون الوسيطة `options` الاختيارية عددًا صحيحًا يحدد `mode` (إذن ووحدات بت لاصقة)، أو كائنًا يحتوي على خاصية `mode` وخاصية `recursive` تشير إلى ما إذا كان يجب إنشاء الدلائل الأصلية. تؤدي استدعاء `fsPromises.mkdir()` عندما يكون `path` هو دليل موجود إلى رفض فقط عندما تكون `recursive` خطأ.



::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### ‏`fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.6.0, v18.19.0 | تقبل الآن المعلمة `prefix` المخازن المؤقتة وعنوان URL. |
| v16.5.0, v14.18.0 | تقبل الآن المعلمة `prefix` سلسلة فارغة. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تنفيذه بسلسلة تحتوي على مسار نظام الملفات للدليل المؤقت الذي تم إنشاؤه حديثًا.

ينشئ دليلًا مؤقتًا فريدًا. يتم إنشاء اسم دليل فريد عن طريق إلحاق ستة أحرف عشوائية بنهاية `prefix` المتوفرة. نظرًا لعدم اتساق النظام الأساسي، تجنب الأحرف `X` الزائدة في `prefix`. يمكن لبعض الأنظمة الأساسية، ولا سيما BSDs، إرجاع أكثر من ستة أحرف عشوائية، واستبدال الأحرف `X` الزائدة في `prefix` بأحرف عشوائية.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا مع خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
ستقوم طريقة `fsPromises.mkdtemp()` بإلحاق الأحرف الستة المحددة عشوائيًا مباشرةً بسلسلة `prefix`. على سبيل المثال، بالنظر إلى دليل `/tmp`، إذا كانت النية هي إنشاء دليل مؤقت *داخل* `/tmp`، فيجب أن ينتهي `prefix` بفاصل مسار خاص بالنظام الأساسي (`require('node:path').sep`).


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.1.0 | أصبح الوسيط `flags` اختياريًا الآن ويأخذ القيمة الافتراضية `'r'`. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) انظر [دعم علامات نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **افتراضي:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد وضع الملف (الأذونات والبتات الثابتة) إذا تم إنشاء الملف. **افتراضي:** `0o666` (قابل للقراءة والكتابة)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع كائن [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle).

يفتح [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle).

راجع وثائق POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) لمزيد من التفاصيل.

بعض الأحرف (`\< \> : " / \ | ? *`) محجوزة تحت نظام التشغيل Windows كما هو موثق في [تسمية الملفات والمسارات والمساحات الاسمية](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). ضمن NTFS، إذا كان اسم الملف يحتوي على نقطتين، فسيفتح Node.js دفق نظام ملفات، كما هو موضح في [صفحة MSDN هذه](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0, v18.17.0 | تمت إضافة الخيار `recursive`. |
| v13.1.0, v12.16.0 | تم تقديم الخيار `bufferSize`. |
| v12.12.0 | تمت الإضافة في: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إدخالات الدليل التي يتم تخزينها مؤقتًا داخليًا عند القراءة من الدليل. تؤدي القيم الأعلى إلى أداء أفضل ولكن استخدام أعلى للذاكرة. **افتراضي:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سيتم حل `Dir` كـ [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) يحتوي على جميع الملفات والدلائل الفرعية. **افتراضي:** `false`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir).

يفتح بشكل غير متزامن دليلًا للمسح التكراري. راجع وثائق POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) لمزيد من التفاصيل.

ينشئ [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir)، والذي يحتوي على جميع الوظائف الإضافية للقراءة من الدليل وتنظيفه.

يحدد الخيار `encoding` ترميز `path` أثناء فتح الدليل وعمليات القراءة اللاحقة.

مثال باستخدام التكرار غير المتزامن:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
عند استخدام المكرر غير المتزامن، سيتم إغلاق كائن [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir) تلقائيًا بعد خروج المكرر.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v20.1.0, v18.17.0 | تمت إضافة الخيار `recursive`. |
| الإصدار v10.11.0 | تمت إضافة خيار جديد `withFileTypes`. |
| الإصدار v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، فإنه يقرأ محتويات دليل بشكل تكراري. في الوضع التكراري، سيتم سرد جميع الملفات والملفات الفرعية والأدلة. **افتراضي:** `false`.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم التحقيق بمجموعة من أسماء الملفات في الدليل باستثناء `'.'` و `'..'`.

يقرأ محتويات الدليل.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد الترميز، أو كائنًا يحتوي على خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه لأسماء الملفات. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير أسماء الملفات التي تم إرجاعها ككائنات [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم تعيين `options.withFileTypes` على `true`، فستحتوي المصفوفة التي تم إرجاعها على كائنات [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent).

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.2.0, v14.17.0 | يمكن أن تتضمن وسيطة الخيارات `AbortSignal` لإلغاء طلب `readFile` قيد التنفيذ. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) اسم الملف أو `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم `flags` نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'r'`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء `readFile` قيد التقدم

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع محتويات الملف.

يقرأ بشكل غير متزامن محتويات ملف بأكملها.

إذا لم يتم تحديد ترميز (باستخدام `options.encoding`)، فسيتم إرجاع البيانات ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer). بخلاف ذلك، ستكون البيانات سلسلة.

إذا كانت `options` سلسلة، فسيحدد الترميز.

عندما يكون `path` دليلًا، يكون سلوك `fsPromises.readFile()` خاصًا بالنظام الأساسي. على macOS و Linux و Windows، سيتم رفض الوعد بخطأ. على FreeBSD، سيتم إرجاع تمثيل لمحتويات الدليل.

مثال على قراءة ملف `package.json` الموجود في نفس دليل تشغيل التعليمات البرمجية:

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

من الممكن إلغاء `readFile` قيد التنفيذ باستخدام [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal). إذا تم إلغاء طلب، فسيتم رفض الوعد الذي تم إرجاعه مع `AbortError`:

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

لا يؤدي إلغاء طلب قيد التنفيذ إلى إلغاء طلبات نظام التشغيل الفردية، بل يؤدي إلى إلغاء التخزين المؤقت الداخلي الذي تقوم به `fs.readFile`.

يجب أن يدعم أي [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) محدد القراءة.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**تمت إضافته في: الإصدار v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع `linkString` عند النجاح.

يقرأ محتويات الرابط الرمزي المشار إليه بواسطة `path`. راجع توثيق POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) لمزيد من التفاصيل. يتم تحقيق الوعد مع `linkString` عند النجاح.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا مع خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه لمسار الرابط الذي تم إرجاعه. إذا تم تعيين `encoding` إلى `'buffer'`، فسيتم تمرير مسار الرابط الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**تمت إضافته في: الإصدار v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع المسار الذي تم حله عند النجاح.

يحدد الموقع الفعلي لـ `path` باستخدام نفس دلالات وظيفة `fs.realpath.native()`.

يتم دعم المسارات التي يمكن تحويلها إلى سلاسل UTF8 فقط.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا مع خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه للمسار. إذا تم تعيين `encoding` إلى `'buffer'`، فسيتم تمرير المسار الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

في نظام Linux، عندما يتم ربط Node.js بمكتبة musl libc، يجب تثبيت نظام الملفات procfs على `/proc` لكي تعمل هذه الوظيفة. لا يحتوي Glibc على هذا القيد.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**تمت الإضافة في: الإصدار 10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- القيمة المُرجعة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم استيفاؤها بـ `undefined` عند النجاح.

إعادة تسمية `oldPath` إلى `newPath`.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | لم يعد مسموحًا باستخدام `fsPromises.rmdir(path, { recursive: true })` على `path` وهو ملف، ويؤدي إلى خطأ `ENOENT` على نظام التشغيل Windows وخطأ `ENOTDIR` على نظام التشغيل POSIX. |
| v16.0.0 | لم يعد مسموحًا باستخدام `fsPromises.rmdir(path, { recursive: true })` على `path` غير موجود، ويؤدي إلى خطأ `ENOENT`. |
| v16.0.0 | تم إهمال الخيار `recursive`، ويؤدي استخدامه إلى ظهور تحذير بالإهمال. |
| v14.14.0 | تم إهمال الخيار `recursive`، استخدم `fsPromises.rm` بدلاً من ذلك. |
| v13.3.0, v12.16.0 | تمت إعادة تسمية الخيار `maxBusyTries` إلى `maxRetries`، وقيمته الافتراضية هي 0. تمت إزالة الخيار `emfileWait`، وتستخدم أخطاء `EMFILE` نفس منطق إعادة المحاولة مثل الأخطاء الأخرى. الخيار `retryDelay` مدعوم الآن. تتم الآن إعادة محاولة أخطاء `ENFILE`. |
| v12.10.0 | الخيارات `recursive` و `maxBusyTries` و `emfileWait` مدعومة الآن. |
| v10.0.0 | تمت الإضافة في: الإصدار 10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تمت مصادفة خطأ `EBUSY` أو `EMFILE` أو `ENFILE` أو `ENOTEMPTY` أو `EPERM`، فإن Node.js يعيد محاولة العملية بانتظار تراجع خطي قدره `retryDelay` ميلي ثانية أطول في كل محاولة. يمثل هذا الخيار عدد مرات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` هو `true`. **القيمة الافتراضية:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فقم بإجراء إزالة دليل متكررة. في الوضع المتكرر، تتم إعادة محاولة العمليات عند الفشل. **القيمة الافتراضية:** `false`. **تم الإهمال.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت بالمللي ثانية للانتظار بين عمليات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` هو `true`. **القيمة الافتراضية:** `100`.
  
 
- القيمة المُرجعة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم استيفاؤها بـ `undefined` عند النجاح.

إزالة الدليل الذي تم تحديده بواسطة `path`.

يؤدي استخدام `fsPromises.rmdir()` على ملف (وليس دليل) إلى رفض الوعد بخطأ `ENOENT` على نظام التشغيل Windows وخطأ `ENOTDIR` على نظام التشغيل POSIX.

للحصول على سلوك مشابه لأمر Unix `rm -rf`، استخدم [`fsPromises.rm()`](/ar/nodejs/api/fs#fspromisesrmpath-options) مع الخيارات `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**تمت الإضافة في: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، سيتم تجاهل الاستثناءات إذا كان `path` غير موجود. **افتراضي:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تمت مصادفة خطأ `EBUSY` أو `EMFILE` أو `ENFILE` أو `ENOTEMPTY` أو `EPERM`، فسيعيد Node.js محاولة العملية مع فترة انتظار خطية متزايدة قدرها `retryDelay` مللي ثانية في كل محاولة. يمثل هذا الخيار عدد مرات إعادة المحاولة. يتم تجاهل هذا الخيار إذا كان الخيار `recursive` ليس `true`. **افتراضي:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة `true`، فقم بإجراء إزالة دليل متكررة. في الوضع المتكرر، تتم إعادة محاولة العمليات عند الفشل. **افتراضي:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت بالمللي ثانية للانتظار بين عمليات إعادة المحاولة. يتم تجاهل هذا الخيار إذا كان الخيار `recursive` ليس `true`. **افتراضي:** `100`.
  
 
- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم الوفاء به مع `undefined` عند النجاح.

يزيل الملفات والأدلة (على غرار الأداة المساعدة POSIX القياسية `rm`).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي يتم إرجاعها يجب أن تكون bigint. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون `bigint`. **افتراضي:** `false`.
  
 
- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم الوفاء به مع كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) للمسار `path` المحدد.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**تمت الإضافة في: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم العددية في كائن [\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs) المرتجع يجب أن تكون `bigint`. **الافتراضي:** `false`.

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع كائن [\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs) للمسار `path` المحدد.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | إذا كانت قيمة الوسيطة `type` هي `null` أو تم حذفها، فسيكتشف Node.js تلقائيًا نوع `target` ويختار تلقائيًا `dir` أو `file`. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع `undefined` عند النجاح.

ينشئ رابطًا رمزيًا.

تُستخدم الوسيطة `type` فقط على منصات Windows ويمكن أن تكون واحدة من `'dir'` أو `'file'` أو `'junction'`. إذا كانت الوسيطة `type` هي `null`، فسيكتشف Node.js تلقائيًا نوع `target` ويستخدم `'file'` أو `'dir'`. إذا كان `target` غير موجود، فسيتم استخدام `'file'`. تتطلب نقاط التقاطع في Windows أن يكون مسار الوجهة مطلقًا. عند استخدام `'junction'`، سيتم تطبيع الوسيطة `target` تلقائيًا إلى مسار مطلق. يمكن لنقاط التقاطع على وحدات تخزين NTFS أن تشير فقط إلى الدلائل.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**تمت إضافتها في: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق بـ `undefined` عند النجاح.

يقوم بتقصير (أو إطالة الطول) للمحتوى في `path` إلى `len` بايت.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**تمت إضافتها في: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق بـ `undefined` عند النجاح.

إذا كان `path` يشير إلى رابط رمزي، فسيتم إزالة الرابط دون التأثير على الملف أو الدليل الذي يشير إليه هذا الرابط. إذا كان `path` يشير إلى مسار ملف ليس رابطًا رمزيًا، فسيتم حذف الملف. انظر وثائق POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) لمزيد من التفاصيل.

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**تمت إضافتها في: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق بـ `undefined` عند النجاح.

تغيير الطوابع الزمنية لنظام الملفات للكائن المشار إليه بواسطة `path`.

تتبع وسيطات `atime` و `mtime` هذه القواعد:

- يمكن أن تكون القيم إما أرقامًا تمثل وقت Unix epoch، أو `Date`s، أو سلسلة رقمية مثل `'123456789.0'`.
- إذا تعذر تحويل القيمة إلى رقم، أو كانت `NaN` أو `Infinity` أو `-Infinity`، فسيتم طرح `Error`.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**تمت الإضافة في: الإصدار v15.9.0، v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان يجب أن تستمر العملية في العمل طالما تتم مراقبة الملفات. **الافتراضي:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان يجب مراقبة جميع الدلائل الفرعية، أو الدليل الحالي فقط. ينطبق هذا عند تحديد دليل، وفقط على الأنظمة الأساسية المدعومة (راجع [المحاذير](/ar/nodejs/api/fs#caveats)). **الافتراضي:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد ترميز الأحرف الذي سيتم استخدامه لاسم الملف الذي تم تمريره إلى المستمع. **الافتراضي:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) المستخدم للإشارة إلى متى يجب أن تتوقف أداة المراقبة.


- الإرجاع: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) للكائنات ذات الخصائص:
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع التغيير
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) اسم الملف الذي تم تغييره.


إرجاع مكرر غير متزامن يراقب التغييرات في `filename`، حيث يكون `filename` إما ملفًا أو دليلًا.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
في معظم الأنظمة الأساسية، يتم إصدار `'rename'` عندما يظهر اسم ملف أو يختفي في الدليل.

تنطبق جميع [المحاذير](/ar/nodejs/api/fs#caveats) الخاصة بـ `fs.watch()` أيضًا على `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v21.0.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v15.14.0, v14.18.0 | وسيطة `data` تدعم `AsyncIterable`، `Iterable`، و `Stream`. |
| v15.2.0, v14.17.0 | يمكن أن تتضمن وسيطة الخيارات AbortSignal لإلغاء طلب writeFile قيد التقدم. |
| v14.0.0 | لم تعد المعلمة `data` تجبر الإدخال غير المدعوم على سلاسل نصية. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) اسم الملف أو `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ar/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم أعلام نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تمت كتابة جميع البيانات بنجاح إلى الملف، و `flush` هي `true`، يتم استخدام `filehandle.sync()` لدفق البيانات. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء writeFile قيد التقدم

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع `undefined` عند النجاح.

يكتب البيانات بشكل غير متزامن إلى ملف، ويستبدل الملف إذا كان موجودًا بالفعل. يمكن أن تكون `data` سلسلة نصية أو مخزن مؤقت أو [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) أو كائن [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

يتم تجاهل خيار `encoding` إذا كانت `data` عبارة عن مخزن مؤقت.

إذا كانت `options` عبارة عن سلسلة نصية، فإنها تحدد الترميز.

يؤثر خيار `mode` فقط على الملف الذي تم إنشاؤه حديثًا. انظر [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) لمزيد من التفاصيل.

يجب أن يدعم أي [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) محدد الكتابة.

من غير الآمن استخدام `fsPromises.writeFile()` عدة مرات على نفس الملف دون انتظار تسوية الوعد.

وبالمثل لـ `fsPromises.readFile` - `fsPromises.writeFile` هي طريقة ملائمة تنفذ عدة استدعاءات `write` داخليًا لكتابة المخزن المؤقت الذي تم تمريره إليها. بالنسبة للتعليمات البرمجية الحساسة للأداء، ضع في اعتبارك استخدام [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options) أو [`filehandle.createWriteStream()`](/ar/nodejs/api/fs#filehandlecreatewritestreamoptions).

من الممكن استخدام [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) لإلغاء `fsPromises.writeFile()`. الإلغاء هو "أفضل جهد"، ومن المحتمل أن تظل كمية معينة من البيانات مكتوبة.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```
لا يؤدي إلغاء طلب قيد التقدم إلى إلغاء طلبات نظام التشغيل الفردية ولكن التخزين المؤقت الداخلي الذي تقوم به `fs.writeFile`.


### `fsPromises.constants` {#fspromisesconstants}

**أُضيف في:** v18.4.0, v16.17.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تُرجع كائنًا يحتوي على الثوابت شائعة الاستخدام لعمليات نظام الملفات. الكائن هو نفسه `fs.constants`. انظر [ثوابت FS](/ar/nodejs/api/fs#fs-constants) لمزيد من التفاصيل.

## واجهة برمجة تطبيقات الاستدعاء (Callback API) {#callback-api}

تقوم واجهات برمجة تطبيقات الاستدعاء بتنفيذ جميع العمليات بشكل غير متزامن، دون حظر حلقة الأحداث، ثم تستدعي دالة استدعاء عند الانتهاء أو الخطأ.

تستخدم واجهات برمجة تطبيقات الاستدعاء مجموعة مؤشرات ترابط Node.js الأساسية لتنفيذ عمليات نظام الملفات خارج مؤشر ترابط حلقة الأحداث. هذه العمليات ليست متزامنة أو آمنة لسير العمليات المتعددة. يجب توخي الحذر عند إجراء تعديلات متزامنة متعددة على نفس الملف أو قد يحدث تلف للبيانات.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.8.0 | الثوابت `fs.F_OK` و `fs.R_OK` و `fs.W_OK` و `fs.X_OK` التي كانت موجودة مباشرة في `fs` أصبحت مهجورة. |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v6.3.0 | تم نقل الثوابت مثل `fs.R_OK` وما إلى ذلك والتي كانت موجودة مباشرة في `fs` إلى `fs.constants` كإهلاك ناعم. وبالتالي بالنسبة إلى Node.js `\< v6.3.0` استخدم `fs` للوصول إلى هذه الثوابت، أو قم بعمل شيء مثل `(fs.constants || fs).R_OK` للعمل مع جميع الإصدارات. |
| v0.11.15 | أُضيف في: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يختبر أذونات المستخدم للملف أو الدليل المحدد بواسطة `path`. الوسيطة `mode` هي عدد صحيح اختياري يحدد فحوصات إمكانية الوصول التي سيتم إجراؤها. يجب أن تكون `mode` إما القيمة `fs.constants.F_OK` أو قناعًا يتكون من OR المنطقية الثنائية لأي من `fs.constants.R_OK` و `fs.constants.W_OK` و `fs.constants.X_OK` (مثل `fs.constants.W_OK | fs.constants.R_OK`). تحقق من [ثوابت الوصول إلى الملفات](/ar/nodejs/api/fs#file-access-constants) لمعرفة القيم المحتملة لـ `mode`.

الوسيطة الأخيرة، `callback`، هي دالة استدعاء يتم استدعاؤها مع وسيطة خطأ محتملة. إذا فشل أي من فحوصات إمكانية الوصول، فستكون وسيطة الخطأ عبارة عن كائن `Error`. تتحقق الأمثلة التالية مما إذا كان `package.json` موجودًا، وما إذا كان قابلاً للقراءة أو الكتابة.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// تحقق مما إذا كان الملف موجودًا في الدليل الحالي.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'غير موجود' : 'موجود'}`);
});

// تحقق مما إذا كان الملف قابلاً للقراءة.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'غير قابل للقراءة' : 'قابل للقراءة'}`);
});

// تحقق مما إذا كان الملف قابلاً للكتابة.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'غير قابل للكتابة' : 'قابل للكتابة'}`);
});

// تحقق مما إذا كان الملف قابلاً للقراءة والكتابة.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'ليس' : 'هو'} قابلاً للقراءة والكتابة`);
});
```
لا تستخدم `fs.access()` للتحقق من إمكانية الوصول إلى ملف قبل استدعاء `fs.open()` أو `fs.readFile()` أو `fs.writeFile()`. القيام بذلك يدخل حالة سباق، حيث قد تغير العمليات الأخرى حالة الملف بين الاستدعاءين. بدلاً من ذلك، يجب أن يفتح كود المستخدم/يقرأ/يكتب الملف مباشرةً ويتعامل مع الخطأ الذي يتم رفعه إذا لم يكن الملف قابلاً للوصول.

**الكتابة (غير موصى به)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile موجود بالفعل');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**الكتابة (موصى به)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile موجود بالفعل');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**القراءة (غير موصى به)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile غير موجود');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**القراءة (موصى به)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile غير موجود');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
الأمثلة "غير الموصى بها" أعلاه تتحقق من إمكانية الوصول ثم تستخدم الملف؛ الأمثلة "الموصى بها" أفضل لأنها تستخدم الملف مباشرةً وتعالج الخطأ، إن وجد.

بشكل عام، تحقق من إمكانية الوصول إلى ملف فقط إذا لم يتم استخدام الملف مباشرةً، على سبيل المثال عندما تكون إمكانية الوصول إليه إشارة من عملية أخرى.

في نظام التشغيل Windows، قد تحد سياسات التحكم في الوصول (ACLs) على دليل من الوصول إلى ملف أو دليل. ومع ذلك، لا تتحقق دالة `fs.access()` من ACL وبالتالي قد تُبلغ عن أن المسار يمكن الوصول إليه حتى لو كان ACL يقيد المستخدم من قراءته أو الكتابة إليه.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.1.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يطلق الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيطلق `TypeError` في وقت التشغيل. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا بالإهمال مع المعرف DEP0013. |
| v7.0.0 | لن يتم تعديل كائن `options` الذي تم تمريره أبدًا. |
| v5.0.0 | يمكن أن يكون المعامل `file` واصف ملف الآن. |
| v0.6.7 | تمت إضافته في: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم الملف أو واصف الملف
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم أعلام نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم مسح واصف الملف الأساسي قبل إغلاقه. **الافتراضي:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


إلحاق البيانات بملف بشكل غير متزامن، وإنشاء الملف إذا لم يكن موجودًا بعد. يمكن أن تكون `data` سلسلة أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

يؤثر خيار `mode` فقط على الملف الذي تم إنشاؤه حديثًا. انظر [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) لمزيد من التفاصيل.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
إذا كان `options` سلسلة، فإنه يحدد الترميز:

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
يمكن تحديد `path` كواصف ملف رقمي تم فتحه للإلحاق (باستخدام `fs.open()` أو `fs.openSync()`). لن يتم إغلاق واصف الملف تلقائيًا.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد نداء غير صالح إلى وسيطة `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` من نوع WHATWG باستخدام بروتوكول `file:`. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى إصدار تحذير إهمال مع المعرّف DEP0013. |
| v0.1.30 | تمت إضافته في: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

لتغيير أذونات الملف بشكل غير متزامن. لا يتم إعطاء أي حجج أخرى بخلاف استثناء محتمل لرد نداء الاكتمال.

راجع وثائق POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) لمزيد من التفاصيل.

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('تم تغيير أذونات الملف "my_file.txt"!');
});
```
#### أوضاع الملف {#file-modes}

الوسيطة `mode` المستخدمة في كل من الطريقتين `fs.chmod()` و `fs.chmodSync()` هي قناع بت رقمي تم إنشاؤه باستخدام OR منطقي للثوابت التالية:

| ثابت | ثماني | الوصف |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | القراءة بواسطة المالك |
| `fs.constants.S_IWUSR` | `0o200` | الكتابة بواسطة المالك |
| `fs.constants.S_IXUSR` | `0o100` | التنفيذ/البحث بواسطة المالك |
| `fs.constants.S_IRGRP` | `0o40` | القراءة بواسطة المجموعة |
| `fs.constants.S_IWGRP` | `0o20` | الكتابة بواسطة المجموعة |
| `fs.constants.S_IXGRP` | `0o10` | التنفيذ/البحث بواسطة المجموعة |
| `fs.constants.S_IROTH` | `0o4` | القراءة بواسطة الآخرين |
| `fs.constants.S_IWOTH` | `0o2` | الكتابة بواسطة الآخرين |
| `fs.constants.S_IXOTH` | `0o1` | التنفيذ/البحث بواسطة الآخرين |
طريقة أسهل لإنشاء `mode` هي استخدام تسلسل من ثلاثة أرقام ثمانية (مثل `765`). الرقم الموجود في أقصى اليسار (`7` في المثال)، يحدد الأذونات لمالك الملف. الرقم الأوسط (`6` في المثال)، يحدد الأذونات للمجموعة. الرقم الموجود في أقصى اليمين (`5` في المثال)، يحدد الأذونات للآخرين.

| الرقم | الوصف |
| --- | --- |
| `7` | القراءة والكتابة والتنفيذ |
| `6` | القراءة والكتابة |
| `5` | القراءة والتنفيذ |
| `4` | القراءة فقط |
| `3` | الكتابة والتنفيذ |
| `2` | الكتابة فقط |
| `1` | التنفيذ فقط |
| `0` | لا يوجد إذن |
على سبيل المثال، القيمة الثمانية `0o765` تعني:

- يجوز للمالك قراءة الملف وكتابته وتنفيذه.
- يجوز للمجموعة قراءة الملف وكتابته.
- يجوز للآخرين قراءة الملف وتنفيذه.

عند استخدام أرقام أولية حيث يتم توقع أوضاع الملفات، قد تؤدي أي قيمة أكبر من `0o777` إلى سلوكيات خاصة بالنظام الأساسي غير مدعومة للعمل باستمرار. لذلك، لا يتم عرض ثوابت مثل `S_ISVTX` أو `S_ISGID` أو `S_ISUID` في `fs.constants`.

تنبيهات: في نظام التشغيل Windows، يمكن تغيير إذن الكتابة فقط، ولا يتم تنفيذ التمييز بين أذونات المجموعة أو المالك أو الآخرين.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى الوسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون المعلمة `path` كائن `URL` لـ WHATWG باستخدام بروتوكول `file:`. |
| v7.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى إصدار تحذير إهمال بالمعرف DEP0013. |
| v0.1.97 | تمت الإضافة في: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يغير بشكل غير متزامن مالك ومجموعة ملف. لا يتم إعطاء أي وسيطات بخلاف استثناء محتمل لرد نداء الاكتمال.

راجع وثائق POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) لمزيد من التفاصيل.

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى الوسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | يتم الآن استخدام رد نداء افتراضي إذا لم يتم توفير رد نداء. |
| v10.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| v7.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى إصدار تحذير إهمال بالمعرف DEP0013. |
| v0.0.2 | تمت الإضافة في: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يغلق واصف الملف. لا يتم إعطاء أي وسيطات بخلاف استثناء محتمل لرد نداء الاكتمال.

قد يؤدي استدعاء `fs.close()` على أي واصف ملف (`fd`) قيد الاستخدام حاليًا من خلال أي عملية `fs` أخرى إلى سلوك غير محدد.

راجع وثائق POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) لمزيد من التفاصيل.


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v14.0.0 | تم تغيير وسيط `flags` إلى `mode` وتم فرض التحقق من النوع الأكثر صرامة. |
| v8.5.0 | تمت الإضافة في: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم ملف المصدر المراد نسخه
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم ملف الوجهة لعملية النسخ
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعدِّلات لعملية النسخ. **الافتراضي:** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ينسخ `src` إلى `dest` بشكل غير متزامن. بشكل افتراضي، تتم الكتابة فوق `dest` إذا كان موجودًا بالفعل. لا يتم إعطاء أي وسيطات أخرى بخلاف استثناء محتمل لدالة رد النداء. لا تقدم Node.js أي ضمانات بشأن ذرية عملية النسخ. إذا حدث خطأ بعد فتح ملف الوجهة للكتابة، فستحاول Node.js إزالة الوجهة.

`mode` هو عدد صحيح اختياري يحدد سلوك عملية النسخ. من الممكن إنشاء قناع يتكون من OR المنطقي الثنائي لقيمتين أو أكثر (مثل `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: ستفشل عملية النسخ إذا كان `dest` موجودًا بالفعل.
- `fs.constants.COPYFILE_FICLONE`: ستحاول عملية النسخ إنشاء إعادة ربط نسخ عند الكتابة. إذا كانت المنصة لا تدعم النسخ عند الكتابة، فسيتم استخدام آلية نسخ احتياطية.
- `fs.constants.COPYFILE_FICLONE_FORCE`: ستحاول عملية النسخ إنشاء إعادة ربط نسخ عند الكتابة. إذا كانت المنصة لا تدعم النسخ عند الكتابة، فسوف تفشل العملية.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt تم نسخه إلى destination.txt');
}

// destination.txt سيتم إنشاؤه أو الكتابة فوقه بشكل افتراضي.
copyFile('source.txt', 'destination.txt', callback);

// باستخدام COPYFILE_EXCL، ستفشل العملية إذا كان destination.txt موجودًا.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.3.0 | هذا الـ API لم يعد تجريبيًا. |
| v20.1.0, v18.17.0 | قبول خيار `mode` إضافي لتحديد سلوك النسخ كوسيطة `mode` في `fs.copyFile()`. |
| v18.0.0 | تمرير استدعاء غير صالح للوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | قبول خيار `verbatimSymlinks` إضافي لتحديد ما إذا كان سيتم إجراء تحليل المسار للروابط الرمزية. |
| v16.7.0 | تمت إضافته في: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار المصدر المراد نسخه.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار الوجهة المراد النسخ إليها.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إلغاء الإشارة إلى الروابط الرمزية. **الافتراضي:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `force` هو `false`، وكانت الوجهة موجودة، قم بإلقاء خطأ. **الافتراضي:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتصفية الملفات/المجلدات المنسوخة. قم بإرجاع `true` لنسخ العنصر، و `false` لتجاهله. عند تجاهل مجلد، سيتم تخطي جميع محتوياته أيضًا. يمكن أيضًا إرجاع `Promise` تحل إلى `true` أو `false` **الافتراضي:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار المصدر المراد نسخه.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الوجهة المراد النسخ إليها.
    - الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) قيمة قابلة للتحويل إلى `boolean` أو `Promise` تتحقق بقيمة مماثلة.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) الكتابة فوق ملف أو مجلد موجود. ستتجاهل عملية النسخ الأخطاء إذا قمت بتعيين هذا إلى خطأ وكانت الوجهة موجودة. استخدم خيار `errorOnExist` لتغيير هذا السلوك. **الافتراضي:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معدّلات لعملية النسخ. **الافتراضي:** `0`. انظر علامة `mode` في [`fs.copyFile()`](/ar/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `true` سيتم الحفاظ على الطوابع الزمنية من `src`. **الافتراضي:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) نسخ المجلدات بشكل متكرر **الافتراضي:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `true`، سيتم تخطي تحليل المسار للروابط الرمزية. **الافتراضي:** `false`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

نسخ هيكل المجلد بأكمله بشكل غير متزامن من `src` إلى `dest`، بما في ذلك المجلدات الفرعية والملفات.

عند نسخ مجلد إلى مجلد آخر، لا يتم دعم الرموز النجمية ويكون السلوك مشابهًا لـ `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.10.0 | لا يحتاج خيار `fs` إلى طريقة `open` إذا تم توفير `fd`. |
| v16.10.0 | لا يحتاج خيار `fs` إلى طريقة `close` إذا كانت `autoClose` تساوي `false`. |
| v15.5.0 | إضافة دعم لـ `AbortSignal`. |
| v15.4.0 | يقبل خيار `fd` وسيطات FileHandle. |
| v14.0.0 | تغيير القيمة الافتراضية لـ `emitClose` إلى `true`. |
| v13.6.0, v12.17.0 | تسمح خيارات `fs` بتجاوز تطبيق `fs` المستخدم. |
| v12.10.0 | تمكين خيار `emitClose`. |
| v11.0.0 | فرض قيود جديدة على `start` و `end`، وإصدار أخطاء أكثر ملاءمة في الحالات التي لا يمكننا فيها معالجة قيم الإدخال بشكل معقول. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لن يتم تعديل كائن `options` الذي تم تمريره أبدًا. |
| v2.3.0 | يمكن أن يكون كائن `options` الذي تم تمريره عبارة عن سلسلة الآن. |
| v0.1.31 | تمت إضافته في: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم علامات نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) **الافتراضي:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
  
 
- Returns: [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream)

يمكن أن تتضمن `options` قيم `start` و `end` لقراءة نطاق من البايتات من الملف بدلاً من الملف بأكمله. كل من `start` و `end` شاملة وتبدأ العد عند 0، والقيم المسموح بها في النطاق [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. إذا تم تحديد `fd` وتم حذف `start` أو `undefined`، فإن `fs.createReadStream()` يقرأ بالتسلسل من موضع الملف الحالي. يمكن أن يكون `encoding` أيًا من تلك التي يقبلها [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم تحديد `fd`، فسيتجاهل `ReadStream` وسيطة `path` وسيستخدم واصف الملف المحدد. هذا يعني أنه لن يتم إصدار أي حدث `'open'`. يجب أن يكون `fd` حاصراً; يجب تمرير `fd`s غير الحاصرة إلى [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

إذا كان `fd` يشير إلى جهاز حرف يدعم القراءات الحاصرة فقط (مثل لوحة المفاتيح أو بطاقة الصوت)، فلن تنتهي عمليات القراءة حتى تتوفر البيانات. هذا يمكن أن يمنع العملية من الخروج وتدفق الإغلاق بشكل طبيعي.

بشكل افتراضي، سيصدر الدفق حدث `'close'` بعد تدميره. قم بتعيين الخيار `emitClose` إلى `false` لتغيير هذا السلوك.

من خلال توفير خيار `fs`، من الممكن تجاوز تطبيقات `fs` المقابلة لـ `open` و `read` و `close`. عند توفير خيار `fs`، يلزم تجاوز `read`. إذا لم يتم توفير `fd`، يلزم أيضًا تجاوز `open`. إذا كانت `autoClose` هي `true`، فمن الضروري أيضًا تجاوز `close`.

```js [ESM]
import { createReadStream } from 'node:fs';

// إنشاء دفق من بعض أجهزة الأحرف.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // قد لا يؤدي هذا إلى إغلاق الدفق.
  // وضع علامة مصطنعة لنهاية الدفق، كما لو أن المورد الأساسي أشار إلى
  // نهاية الملف بنفسه، يسمح بإغلاق الدفق.
  // هذا لا يلغي عمليات القراءة المعلقة، وإذا كانت هناك مثل هذه العملية،
  // فقد لا تتمكن العملية من الخروج بنجاح
  // حتى تنتهي.
  stream.push(null);
  stream.read(0);
}, 100);
```
إذا كانت `autoClose` خاطئة، فلن يتم إغلاق واصف الملف، حتى إذا كان هناك خطأ. تقع على عاتق التطبيق مسؤولية إغلاقه والتأكد من عدم وجود تسرب لواصف الملف. إذا تم تعيين `autoClose` على true (السلوك الافتراضي)، فسيتم إغلاق واصف الملف تلقائيًا عند `'error'` أو `'end'`.

يقوم `mode` بتعيين وضع الملف (إذن وبِتات لزجة)، ولكن فقط إذا تم إنشاء الملف.

مثال لقراءة آخر 10 بايتات من ملف طوله 100 بايت:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
إذا كانت `options` عبارة عن سلسلة، فإنها تحدد الترميز.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v16.10.0 | لا يحتاج خيار `fs` إلى طريقة `open` إذا تم توفير `fd`. |
| v16.10.0 | لا يحتاج خيار `fs` إلى طريقة `close` إذا كانت `autoClose` هي `false`. |
| v15.5.0 | إضافة دعم لـ `AbortSignal`. |
| v15.4.0 | يقبل خيار `fd` وسيطات FileHandle. |
| v14.0.0 | تغيير القيمة الافتراضية لـ `emitClose` إلى `true`. |
| v13.6.0, v12.17.0 | تسمح خيارات `fs` بتجاوز تنفيذ `fs` المستخدم. |
| v12.10.0 | تمكين خيار `emitClose`. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` من WHATWG باستخدام بروتوكول `file:`. |
| v7.0.0 | لن يتم تعديل كائن `options` الذي تم تمريره أبدًا. |
| v5.5.0 | خيار `autoClose` مدعوم الآن. |
| v2.3.0 | يمكن أن يكون كائن `options` الذي تم تمريره سلسلة الآن. |
| v0.1.31 | تمت إضافته في: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم أعلام نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) **الافتراضي:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تفريغ واصف الملف الأساسي قبل إغلاقه. **الافتراضي:** `false`.


- الإرجاع: [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream)

قد تتضمن `options` أيضًا خيار `start` للسماح بكتابة البيانات في موضع ما بعد بداية الملف، والقيم المسموح بها هي في نطاق [0، [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. قد يتطلب تعديل ملف بدلاً من استبداله تعيين خيار `flags` على `r+` بدلاً من `w` الافتراضي. يمكن أن تكون `encoding` أيًا من تلك المقبولة بواسطة [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم تعيين `autoClose` على true (السلوك الافتراضي) في `'error'` أو `'finish'`، فسيتم إغلاق واصف الملف تلقائيًا. إذا كانت `autoClose` خاطئة، فلن يتم إغلاق واصف الملف، حتى إذا كان هناك خطأ. تقع على عاتق التطبيق مسؤولية إغلاقه والتأكد من عدم وجود تسرب لواصف الملف.

بشكل افتراضي، سيصدر الدفق حدث `'close'` بعد تدميره. قم بتعيين خيار `emitClose` على `false` لتغيير هذا السلوك.

من خلال توفير خيار `fs`، من الممكن تجاوز تطبيقات `fs` المقابلة لـ `open` و `write` و `writev` و `close`. يمكن أن يؤدي تجاوز `write()` بدون `writev()` إلى تقليل الأداء حيث سيتم تعطيل بعض التحسينات (`_writev()`). عند توفير خيار `fs`، يلزم تجاوز واحد على الأقل لـ `write` و `writev`. إذا لم يتم توفير خيار `fd`، فستكون هناك حاجة أيضًا إلى تجاوز لـ `open`. إذا كانت `autoClose` هي `true`، فستكون هناك حاجة أيضًا إلى تجاوز لـ `close`.

مثل [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream)، إذا تم تحديد `fd`، فسيتجاهل [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream) وسيطة `path` وسيستخدم واصف الملف المحدد. هذا يعني أنه لن يتم إصدار حدث `'open'`. يجب أن يكون `fd` حظرًا؛ يجب تمرير `fd` غير الحظر إلى [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

إذا كانت `options` سلسلة، فإنها تحدد الترميز.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يطلق الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v7.6.0 | يمكن أن يكون وسيط `path` كائن `URL` من WHATWG باستخدام بروتوكول `file:`. |
| الإصدار v1.0.0 | تم الإلغاء منذ: الإصدار v1.0.0 |
| الإصدار v0.0.2 | تمت الإضافة في: الإصدار v0.0.2 |
:::

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء: استخدم [`fs.stat()`](/ar/nodejs/api/fs#fsstatpath-options-callback) أو [`fs.access()`](/ar/nodejs/api/fs#fsaccesspath-mode-callback) بدلاً من ذلك.
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

اختبر ما إذا كان العنصر في `path` المحدد موجودًا عن طريق التحقق من نظام الملفات. ثم استدعِ وسيط `callback` إما بالقيمة true أو false:

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**معلمات دالة رد النداء هذه غير متسقة مع دوال رد النداء الأخرى في Node.js.** عادةً، تكون المعلمة الأولى لدالة رد نداء Node.js هي معلمة `err`، متبوعة اختياريًا بمعلمات أخرى. تحتوي دالة رد النداء `fs.exists()` على معلمة منطقية واحدة فقط. هذا أحد الأسباب التي تجعل `fs.access()` موصى بها بدلاً من `fs.exists()`.

إذا كان `path` رابطًا رمزيًا، فسيتم اتباعه. وبالتالي، إذا كان `path` موجودًا ولكنه يشير إلى عنصر غير موجود، فستتلقى دالة رد النداء القيمة `false`.

لا يوصى باستخدام `fs.exists()` للتحقق من وجود ملف قبل استدعاء `fs.open()` أو `fs.readFile()` أو `fs.writeFile()`. القيام بذلك يقدم حالة تسابق، حيث قد تغير العمليات الأخرى حالة الملف بين الاستدعاءين. بدلاً من ذلك، يجب على كود المستخدم فتح/قراءة/كتابة الملف مباشرة والتعامل مع الخطأ الذي يثار إذا كان الملف غير موجود.

**write (غير موصى به)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**write (موصى به)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**read (غير موصى به)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```
**read (موصى به)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
تتحقق الأمثلة "غير الموصى بها" أعلاه من الوجود ثم تستخدم الملف؛ الأمثلة "الموصى بها" أفضل لأنها تستخدم الملف مباشرة وتتعامل مع الخطأ، إن وجد.

بشكل عام، تحقق من وجود ملف فقط إذا لم يتم استخدام الملف مباشرةً، على سبيل المثال عندما يكون وجوده إشارة من عملية أخرى.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا للإهمال مع المعرّف DEP0013. |
| v0.4.7 | تمت إضافته في: v0.4.7 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يُعيّن أذونات الملف. لا تُعطى وسائط أخرى غير استثناء محتمل لرد نداء الإكمال.

راجع وثائق POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) لمزيد من التفاصيل.

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا للإهمال مع المعرّف DEP0013. |
| v0.4.7 | تمت إضافته في: v0.4.7 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يُعيّن مالك الملف. لا تُعطى وسائط أخرى غير استثناء محتمل لرد نداء الإكمال.

راجع وثائق POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) لمزيد من التفاصيل.


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة لوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد وسيطة `callback` اختيارية. عدم تمريرها سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.0.0 | لم تعد وسيطة `callback` اختيارية. عدم تمريرها سيصدر تحذيرًا بالإهلاك مع المعرف DEP0013. |
| v0.1.96 | تمت الإضافة في: v0.1.96 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يقوم بفرض جميع عمليات الإدخال/الإخراج المنتظرة المرتبطة بالملف إلى حالة إكمال الإدخال/الإخراج المتزامن لنظام التشغيل. راجع وثائق POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) للحصول على التفاصيل. لا يتم إعطاء أي وسيطات أخرى بخلاف استثناء محتمل لدالة رد النداء الخاصة بالإكمال.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة لوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي تم إرجاعها يجب أن تكون bigint. |
| v10.0.0 | لم تعد وسيطة `callback` اختيارية. عدم تمريرها سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.0.0 | لم تعد وسيطة `callback` اختيارية. عدم تمريرها سيصدر تحذيرًا بالإهلاك مع المعرف DEP0013. |
| v0.1.95 | تمت الإضافة في: v0.1.95 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون `bigint`. **افتراضي:** `false`.

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)

يستدعي دالة رد النداء مع [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) لواصف الملف.

راجع وثائق POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) للحصول على مزيد من التفاصيل.


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد المعامل `callback` اختيارية. عدم تمريرها سيؤدي إلى إطلاق `TypeError` في وقت التشغيل. |
| v7.0.0 | لم تعد المعامل `callback` اختيارية. عدم تمريرها سيصدر تحذير إهمال مع المعرف DEP0013. |
| v0.1.96 | تمت الإضافة في: v0.1.96 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

طلب تفريغ جميع البيانات لواصف الملف المفتوح إلى جهاز التخزين. التنفيذ المحدد خاص بنظام التشغيل والجهاز. راجع وثائق POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) للحصول على مزيد من التفاصيل. لا يتم إعطاء أي وسائط لنداء الإكمال بخلاف استثناء محتمل.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد المعامل `callback` اختيارية. عدم تمريرها سيؤدي إلى إطلاق `TypeError` في وقت التشغيل. |
| v7.0.0 | لم تعد المعامل `callback` اختيارية. عدم تمريرها سيصدر تحذير إهمال مع المعرف DEP0013. |
| v0.8.6 | تمت الإضافة في: v0.8.6 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

يقوم بقطع واصف الملف. لا يتم إعطاء أي وسائط لنداء الإكمال بخلاف استثناء محتمل.

راجع وثائق POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) للحصول على مزيد من التفاصيل.

إذا كان الملف المشار إليه بواسطة واصف الملف أكبر من `len` بايت، فسيتم الاحتفاظ فقط بأول `len` بايت في الملف.

على سبيل المثال، يحتفظ البرنامج التالي بأول أربعة بايتات فقط من الملف:

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
إذا كان الملف أقصر في السابق من `len` بايت، فسيتم تمديده، ويتم ملء الجزء الممتد بأحرف فارغة (`'\0'`):

إذا كانت `len` سالبة فسيتم استخدام `0`.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى إصدار تحذير إهمال بالمعرّف DEP0013. |
| v4.1.0 | يُسمح الآن بالسلاسل الرقمية و `NaN` و `Infinity` كمحددات للوقت. |
| v0.4.2 | تمت الإضافة في: v0.4.2 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<تاريخ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<تاريخ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

تغيير الطوابع الزمنية لنظام الملفات للكائن المشار إليه بواسطة واصف الملف المورد. انظر [`fs.utimes()`](/ar/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.2.0 | إضافة دعم لـ `withFileTypes` كخيار. |
| v22.0.0 | تمت الإضافة في: v22.0.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `pattern` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<سلسلة[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دليل العمل الحالي. **الافتراضي:** `process.cwd()`
    - `exclude` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتصفية الملفات/المجلدات. أرجع `true` لاستبعاد العنصر، و `false` لتضمينه. **الافتراضي:** `undefined`.
    - `withFileTypes` [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان يجب أن يُرجع glob المسارات كـ Dirents، و `false` بخلاف ذلك. **الافتراضي:** `false`.

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

- يسترجع الملفات المطابقة للنمط المحدد.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يؤدي الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v16.0.0 | قد يكون الخطأ الذي تم إرجاعه `AggregateError` إذا تم إرجاع أكثر من خطأ واحد. |
| الإصدار v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| الإصدار v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى إصدار تحذير الإهمال مع المعرّف DEP0013. |
| الإصدار v0.4.7 | تم إهماله منذ: v0.4.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

تغيير الأذونات على رابط رمزي. لا يتم تمرير أي وسيطات باستثناء استثناء محتمل إلى استدعاء الإكمال.

يتم تنفيذ هذه الطريقة فقط على macOS.

راجع وثائق POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) لمزيد من التفاصيل.

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يؤدي الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v10.6.0 | هذا الـ API لم يعد مهملاً. |
| الإصدار v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| الإصدار v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى إصدار تحذير الإهمال مع المعرّف DEP0013. |
| الإصدار v0.4.7 | إهمال خاص بالوثائق فقط. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

تعيين مالك الرابط الرمزي. لا يتم تمرير أي وسيطات باستثناء استثناء محتمل إلى استدعاء الإكمال.

راجع وثائق POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) لمزيد من التفاصيل.


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يؤدي الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | أُضيف في: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يغير أوقات الوصول والتعديل لملف بنفس الطريقة التي تعمل بها [`fs.utimes()`](/ar/nodejs/api/fs#fsutimespath-atime-mtime-callback)، مع الاختلاف أنه إذا كان المسار يشير إلى رابط رمزي، فلن يتم إلغاء الإشارة إلى الرابط: بدلاً من ذلك، يتم تغيير الطوابع الزمنية للرابط الرمزي نفسه.

لا يتم إعطاء أي وسيطات أخرى بخلاف استثناء محتمل لرد نداء الاكتمال.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يؤدي الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى إطلاق `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون المعلمات `existingPath` و `newPath` كائنات `URL` لـ WHATWG باستخدام بروتوكول `file:`. الدعم حاليًا لا يزال *تجريبيًا*. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا بالتقادم مع المعرف DEP0013. |
| v0.1.31 | أُضيف في: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ينشئ رابطًا جديدًا من `existingPath` إلى `newPath`. راجع وثائق POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) لمزيد من التفاصيل. لا يتم إعطاء أي وسيطات أخرى بخلاف استثناء محتمل لرد نداء الاكتمال.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي يتم إرجاعها يجب أن تكون bigint. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيثير `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذير إهمال بالمعرف DEP0013. |
| v0.1.30 | تمت إضافته في: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون `bigint`. **الافتراضي:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)
  
 

يسترد [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) للرابط الرمزي المشار إليه بواسطة المسار. يحصل رد النداء على وسيطتين `(err, stats)` حيث `stats` هو كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats). `lstat()` مطابق لـ `stat()` ، باستثناء أنه إذا كان `path` رابطًا رمزيًا ، فسيتم فحص الرابط نفسه ، وليس الملف الذي يشير إليه.

راجع وثائق POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) لمزيد من التفاصيل.


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة كوسيطة `callback` يطلق الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | في وضع `recursive`، تتلقى دالة رد النداء الآن المسار الأول الذي تم إنشاؤه كوسيطة. |
| v10.12.0 | يمكن أن تكون الوسيطة الثانية الآن كائن `options` مع خصائص `recursive` و `mode`. |
| v10.0.0 | لم تعد معلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى إطلاق `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون معلمة `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم تعد معلمة `callback` اختيارية. عدم تمريرها سيصدر تحذيرًا بالإهلاك مع المعرف DEP0013. |
| v0.1.8 | تمت إضافته في: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) غير مدعوم على Windows. **افتراضي:** `0o777`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود فقط إذا تم إنشاء دليل باستخدام `recursive` تم تعيينه على `true`.
  
 

ينشئ دليل بشكل غير متزامن.

يتم إعطاء دالة رد النداء استثناءً محتملاً، وإذا كانت `recursive` هي `true`، فسيتم إعطاء مسار الدليل الأول الذي تم إنشاؤه، `(err[, path])`. يمكن أن يظل `path` هو `undefined` عندما تكون `recursive` هي `true`، إذا لم يتم إنشاء أي دليل (على سبيل المثال، إذا تم إنشاؤه مسبقًا).

يمكن أن تكون وسيطة `options` الاختيارية عددًا صحيحًا يحدد `mode` (أذونات وبِتّات لاصقة)، أو كائنًا يحتوي على خاصية `mode` وخاصية `recursive` تشير إلى ما إذا كان يجب إنشاء الدلائل الأصلية. تؤدي استدعاء `fs.mkdir()` عندما يكون `path` هو دليل موجود إلى حدوث خطأ فقط عندما تكون `recursive` خاطئة. إذا كانت `recursive` خاطئة وكان الدليل موجودًا، فسيحدث خطأ `EEXIST`.

```js [ESM]
import { mkdir } from 'node:fs';

// قم بإنشاء ./tmp/a/apple، بغض النظر عما إذا كان ./tmp و ./tmp/a موجودين أم لا.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
في نظام التشغيل Windows، سيؤدي استخدام `fs.mkdir()` على الدليل الجذر حتى مع التكرار إلى حدوث خطأ:

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
راجع وثائق POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) لمزيد من التفاصيل.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v20.6.0, v18.19.0 | تقبل الآن المعلمة `prefix` المخازن المؤقتة وعنوان URL. |
| الإصدار v18.0.0 | يؤدي تمرير رد نداء غير صالح إلى الوسيطة `callback` الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v16.5.0, v14.18.0 | تقبل الآن المعلمة `prefix` سلسلة فارغة. |
| الإصدار v10.0.0 | لم تعد المعلمة `callback` اختيارية. سيؤدي عدم تمريرها إلى ظهور `TypeError` في وقت التشغيل. |
| الإصدار v7.0.0 | لم تعد المعلمة `callback` اختيارية. سيؤدي عدم تمريرها إلى إصدار تحذير إهمال بمعرف DEP0013. |
| الإصدار v6.2.1 | المعلمة `callback` اختيارية الآن. |
| الإصدار v5.10.0 | تمت الإضافة في: الإصدار v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



لإنشاء دليل مؤقت فريد.

يتم إنشاء ستة أحرف عشوائية لإضافتها خلف `prefix` مطلوب لإنشاء دليل مؤقت فريد. نظرًا للاختلافات في الأنظمة الأساسية، تجنب الأحرف `X` اللاحقة في `prefix`. يمكن لبعض الأنظمة الأساسية، وعلى الأخص أنظمة BSD، إرجاع أكثر من ستة أحرف عشوائية، واستبدال الأحرف `X` اللاحقة في `prefix` بأحرف عشوائية.

يتم تمرير مسار الدليل الذي تم إنشاؤه كسلسلة إلى المعلمة الثانية لرد النداء.

يمكن أن تكون الوسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا بخاصية `encoding` تحدد ترميز الأحرف المراد استخدامه.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
ستقوم طريقة `fs.mkdtemp()` بإلحاق الأحرف الستة المحددة عشوائيًا مباشرةً بسلسلة `prefix`. على سبيل المثال، بالنظر إلى دليل `/tmp`، إذا كان الهدف هو إنشاء دليل مؤقت *داخل* `/tmp`، فيجب أن ينتهي `prefix` بفاصل مسار خاص بالنظام الأساسي (`require('node:path').sep`).

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// الدليل الأصل للدليل المؤقت الجديد
const tmpDir = tmpdir();

// هذه الطريقة *غير صحيحة*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // سيطبع شيئًا مشابهًا لـ `/tmpabc123`.
  // يتم إنشاء دليل مؤقت جديد في جذر نظام الملفات
  // بدلاً من *داخل* دليل /tmp.
});

// هذه الطريقة *صحيحة*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // سيطبع شيئًا مشابهًا لـ `/tmp/abc123`.
  // يتم إنشاء دليل مؤقت جديد داخل
  // دليل /tmp.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | يؤدي تمرير دالة رد اتصال غير صالحة إلى وسيطة `callback` الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v11.1.0 | أصبحت وسيطة `flags` اختيارية الآن وتأخذ القيمة الافتراضية `'r'`. |
| v9.9.0 | يتم دعم علامات `as` و `as+` الآن. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v0.0.2 | تمت الإضافة في: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) انظر [دعم `flags` لنظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666` (قابل للقراءة والكتابة)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

فتح الملف غير المتزامن. راجع وثائق POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) لمزيد من التفاصيل.

يحدد `mode` وضع الملف (إذن ووحدات البت الثابتة)، ولكن فقط إذا تم إنشاء الملف. في نظام التشغيل Windows، يمكن معالجة إذن الكتابة فقط؛ راجع [`fs.chmod()`](/ar/nodejs/api/fs#fschmodpath-mode-callback).

تحصل دالة رد الاتصال على وسيطتين `(err, fd)`.

بعض الأحرف (`\< \> : " / \ | ? *`) محجوزة في نظام التشغيل Windows كما هو موثق في [تسمية الملفات والمسارات ومساحات الأسماء](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). في نظام NTFS، إذا كان اسم الملف يحتوي على نقطتين، فسيفتح Node.js دفق نظام ملفات، كما هو موضح في [صفحة MSDN هذه](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

تُظهر الدوال المستندة إلى `fs.open()` هذا السلوك أيضًا: `fs.writeFile()` و `fs.readFile()` وما إلى ذلك.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**تمت إضافته في: v19.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع MIME اختياري للكائن الثنائي الكبير (blob).
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق مع [\<Blob\>](/ar/nodejs/api/buffer#class-blob) عند النجاح.

يُرجع [\<Blob\>](/ar/nodejs/api/buffer#class-blob) تكون بياناته مدعومة بالملف المحدد.

يجب عدم تعديل الملف بعد إنشاء [\<Blob\>](/ar/nodejs/api/buffer#class-blob). أي تعديلات ستتسبب في فشل قراءة بيانات [\<Blob\>](/ar/nodejs/api/buffer#class-blob) مع ظهور خطأ `DOMException`. يتم إجراء عمليات stat متزامنة على الملف عند إنشاء `Blob`، وقبل كل قراءة من أجل الكشف عما إذا كانت بيانات الملف قد تم تعديلها على القرص.



::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0, v18.17.0 | تمت إضافة خيار `recursive`. |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى الوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | تم تقديم خيار `bufferSize`. |
| v12.12.0 | تمت إضافته في: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إدخالات الدليل التي يتم تخزينها مؤقتًا داخليًا عند القراءة من الدليل. تؤدي القيم الأعلى إلى أداء أفضل ولكن استخدام أعلى للذاكرة. **افتراضي:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir)
  
 

يفتح دليلاً بشكل غير متزامن. راجع وثائق POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) لمزيد من التفاصيل.

ينشئ [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir)، الذي يحتوي على جميع الوظائف الإضافية للقراءة من الدليل وتنظيفه.

يحدد الخيار `encoding` الترميز لـ `path` أثناء فتح الدليل وعمليات القراءة اللاحقة.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.10.0 | يمكن أن يكون وسيط `buffer` الآن أي `TypedArray` أو `DataView`. |
| v7.4.0 | يمكن أن يكون وسيط `buffer` الآن `Uint8Array`. |
| v6.0.0 | يمكن أن يكون وسيط `length` الآن `0`. |
| v0.0.2 | أُضيف في: v0.0.2 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) المخزن المؤقت الذي ستُكتب البيانات إليه.
- `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الموضع في `buffer` لكتابة البيانات إليه.
- `length` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد قراءتها.
- `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) يحدد مكان البدء في القراءة من الملف. إذا كان `position` هو `null` أو `-1`، فستُقرأ البيانات من موضع الملف الحالي، وسيُحدَّث موضع الملف. إذا كان `position` عددًا صحيحًا غير سالب، فسيظل موضع الملف دون تغيير.
- `callback` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

قراءة البيانات من الملف المحدد بواسطة `fd`.

تتلقى دالة رد النداء ثلاثة وسائط، `(err, bytesRead, buffer)`.

إذا لم يُعدَّل الملف في نفس الوقت، فسيُوصل إلى نهاية الملف عندما يكون عدد البايتات المقروءة صفرًا.

إذا استُدعي هذا الأسلوب كإصدار [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed الخاص به، فإنه يُرجع وعدًا بـ `Object` مع خصائص `bytesRead` و `buffer`.

يقرأ الأسلوب `fs.read()` البيانات من الملف المحدد بواسطة واصف الملف (`fd`). يشير الوسيط `length` إلى الحد الأقصى لعدد البايتات التي سيحاول Node.js قراءتها من النواة. ومع ذلك، يمكن أن يكون العدد الفعلي للبايتات المقروءة (`bytesRead`) أقل من `length` المحدد لأسباب مختلفة.

على سبيل المثال:

- إذا كان الملف أقصر من `length` المحدد، فسيُعيَّن `bytesRead` على العدد الفعلي للبايتات المقروءة.
- إذا صادف الملف EOF (نهاية الملف) قبل أن يمتلئ المخزن المؤقت، فسيقرأ Node.js جميع البايتات المتاحة حتى تُصادف EOF، وسيشير الوسيط `bytesRead` في دالة رد النداء إلى العدد الفعلي للبايتات المقروءة، والذي قد يكون أقل من `length` المحدد.
- إذا كان الملف موجودًا على `filesystem` شبكة بطيئة أو واجه أي مشكلة أخرى أثناء القراءة، فيمكن أن يكون `bytesRead` أقل من `length` المحدد.

لذلك، عند استخدام `fs.read()`، من المهم التحقق من قيمة `bytesRead` لتحديد عدد البايتات التي قُرئت بالفعل من الملف. بناءً على منطق التطبيق الخاص بك، قد تحتاج إلى التعامل مع الحالات التي يكون فيها `bytesRead` أقل من `length` المحدد، مثل تضمين استدعاء القراءة في حلقة إذا كنت تحتاج إلى حد أدنى من البايتات.

يشبه هذا السلوك وظيفة POSIX `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 13.11.0، الإصدار 12.17.0 | يمكن تمرير كائن الخيارات لجعل المخزن المؤقت والإزاحة والطول والموضع اختياريين. |
| الإصدار 13.11.0، الإصدار 12.17.0 | تمت الإضافة في: الإصدار 13.11.0، الإصدار 12.17.0 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **افتراضي:** `Buffer.alloc(16384)`
    - `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
    - `length` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `buffer.byteLength - offset`
    - `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `null`


- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)



على غرار الدالة [`fs.read()`](/ar/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)، يأخذ هذا الإصدار كائن `options` اختياريًا. إذا لم يتم تحديد كائن `options`، فسيكون افتراضيًا بالقيم المذكورة أعلاه.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**أضيف في: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) المخزن المؤقت الذي ستتم كتابة البيانات إليه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **افتراضي:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)



مشابهة لوظيفة [`fs.read()`](/ar/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)، تأخذ هذه النسخة كائن `options` اختياري. إذا لم يتم تحديد كائن `options`، فسوف يعود إلى القيم الافتراضية المذكورة أعلاه.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0, v18.17.0 | تمت إضافة خيار `recursive`. |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.10.0 | تمت إضافة خيار جديد `withFileTypes`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيطرح `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا بالإهمال مع المعرف DEP0013. |
| v6.0.0 | تمت إضافة المعامل `options`. |
| v0.1.8 | أضيف في: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، فإنه يقرأ محتويات الدليل بشكل متكرر. في الوضع المتكرر، سيقوم بإدراج جميع الملفات والملفات الفرعية والأدلة. **افتراضي:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ar/nodejs/api/fs#class-fsdirent)



يقرأ محتويات الدليل. يحصل رد النداء على وسيطتين `(err, files)` حيث `files` عبارة عن مصفوفة من أسماء الملفات في الدليل باستثناء `'.'` و `'..'`.

راجع توثيق POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) لمزيد من التفاصيل.

يمكن أن يكون الوسيط `options` الاختياري عبارة عن سلسلة تحدد ترميزًا، أو كائنًا بخاصية `encoding` تحدد ترميز الأحرف المراد استخدامه لأسماء الملفات التي تم تمريرها إلى رد النداء. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير أسماء الملفات التي تم إرجاعها ككائنات [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم تعيين `options.withFileTypes` على `true`، فستحتوي مصفوفة `files` على كائنات [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent).


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| الإصدار v18.0.0 | الآن يؤدي تمرير دالة رد نداء غير صالحة إلى الوسيطة `callback` إلى ظهور الخطأ `ERR_INVALID_ARG_TYPE` بدلًا من `ERR_INVALID_CALLBACK`. |
| الإصدار v16.0.0 | قد يكون الخطأ المُعاد `AggregateError` إذا تم إرجاع أكثر من خطأ واحد. |
| الإصدار v15.2.0، v14.17.0 | قد تتضمن وسيطة `options` كائن `AbortSignal` لإلغاء طلب `readFile` قيد التقدم. |
| الإصدار v10.0.0 | لم تعد المعلمة `callback` اختيارية. وعدم تمريرها سيؤدي إلى ظهور الخطأ `TypeError` في وقت التشغيل. |
| الإصدار v7.6.0 | يمكن أن تكون المعلمة `path` كائن `URL` من نوع WHATWG باستخدام البروتوكول `file:`. |
| الإصدار v7.0.0 | لم تعد المعلمة `callback` اختيارية. وعدم تمريرها سيؤدي إلى إصدار تحذير إهمال بالمعرف DEP0013. |
| الإصدار v5.1.0 | سيتم دائمًا استدعاء `callback` مع `null` كمعلمة `error` في حالة النجاح. |
| الإصدار v5.0.0 | يمكن أن تكون المعلمة `path` الآن واصف ملف. |
| الإصدار v0.1.29 | تمت إضافته في: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم الملف أو واصف الملف
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم `علامات` نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'r'`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء طلب readFile قيد التقدم


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)


يقرأ بشكل غير متزامن محتويات الملف بالكامل.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
يتم تمرير وسيطتين إلى دالة رد النداء `(err, data)`، حيث `data` هي محتويات الملف.

إذا لم يتم تحديد ترميز، فسيتم إرجاع المخزن المؤقت الخام.

إذا كانت `options` سلسلة، فإنها تحدد الترميز:

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
عندما يكون المسار عبارة عن دليل، فإن سلوك `fs.readFile()` و [`fs.readFileSync()`](/ar/nodejs/api/fs#fsreadfilesyncpath-options) يعتمد على النظام الأساسي. في macOS و Linux و Windows، سيتم إرجاع خطأ. في FreeBSD، سيتم إرجاع تمثيل لمحتويات الدليل.

```js [ESM]
import { readFile } from 'node:fs';

// macOS و Linux و Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
من الممكن إلغاء طلب قيد التقدم باستخدام `AbortSignal`. إذا تم إلغاء طلب، فسيتم استدعاء دالة رد النداء مع `AbortError`:

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// When you want to abort the request
controller.abort();
```
تقوم الدالة `fs.readFile()` بتخزين الملف بالكامل مؤقتًا. لتقليل تكاليف الذاكرة، يفضل عند الإمكان البث عبر `fs.createReadStream()`.

لا يؤدي إلغاء طلب قيد التقدم إلى إلغاء طلبات نظام التشغيل الفردية، بل يؤدي إلى إلغاء التخزين المؤقت الداخلي الذي تقوم به `fs.readFile`.


#### واصفات الملفات {#file-descriptors}

#### اعتبارات الأداء {#performance-considerations}

تقرأ الطريقة `fs.readFile()` محتويات الملف بشكل غير متزامن في الذاكرة على هيئة أجزاء في كل مرة، مما يسمح لدورة الأحداث بالانتقال بين كل جزء. يسمح هذا للعملية بالقراءة بأن يكون لها تأثير أقل على الأنشطة الأخرى التي قد تستخدم مجموعة مؤشرات libuv الأساسية، ولكنه يعني أنها ستستغرق وقتًا أطول لقراءة ملف كامل في الذاكرة.

يمكن أن يختلف العبء الزائد للقراءة الإضافية على نطاق واسع على الأنظمة المختلفة ويعتمد على نوع الملف الذي تتم قراءته. إذا كان نوع الملف ليس ملفًا عاديًا (مثل أنبوب) وكان Node.js غير قادر على تحديد حجم الملف الفعلي، فستقوم كل عملية قراءة بتحميل 64 كيلوبايت من البيانات. بالنسبة للملفات العادية، ستقوم كل قراءة بمعالجة 512 كيلوبايت من البيانات.

بالنسبة للتطبيقات التي تتطلب قراءة محتويات الملف بأسرع ما يمكن، فمن الأفضل استخدام `fs.read()` مباشرةً ولكي يقوم كود التطبيق بإدارة قراءة المحتويات الكاملة للملف بنفسه.

توفر مشكلة Node.js GitHub [#25741](https://github.com/nodejs/node/issues/25741) مزيدًا من المعلومات وتحليلًا تفصيليًا لأداء `fs.readFile()` لأحجام ملفات متعددة في إصدارات Node.js المختلفة.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد اتصال غير صالح إلى وسيطة `callback` الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد معلمة `callback` اختيارية. سيؤدي عدم تمريرها إلى ظهور `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون معلمة `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم تعد معلمة `callback` اختيارية. سيؤدي عدم تمريرها إلى إصدار تحذير إهمال مع المعرف DEP0013. |
| v0.1.31 | تمت الإضافة في: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
  
 

يقرأ محتويات الرابط الرمزي المشار إليه بواسطة `path`. يحصل رد الاتصال على وسيطتين `(err, linkString)`.

راجع وثائق POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) لمزيد من التفاصيل.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا مع خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه لمسار الارتباط الذي تم تمريره إلى رد الاتصال. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير مسار الارتباط الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة استدعاء غير صالحة إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | تمت الإضافة في: v13.13.0, v12.17.0 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)



القراءة من ملف محدد بواسطة `fd` والكتابة إلى مصفوفة من `ArrayBufferView`s باستخدام `readv()`.

`position` هو الإزاحة من بداية الملف من حيث يجب قراءة البيانات. إذا كان `typeof position !== 'number'`، فستتم قراءة البيانات من الموضع الحالي.

سيتم إعطاء دالة الاستدعاء ثلاثة وسائط: `err` و `bytesRead` و `buffers`. `bytesRead` هو عدد البايتات التي تمت قراءتها من الملف.

إذا تم استدعاء هذه الطريقة كنسخة [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed الخاصة بها، فإنها تُرجع وعدًا لـ `Object` مع خصائص `bytesRead` و `buffers`.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة استدعاء غير صالحة إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد معلمة `callback` اختيارية. عدم تمريرها سيطرح `TypeError` في وقت التشغيل. |
| v8.0.0 | تمت إضافة دعم حل الأنابيب/المقبس. |
| v7.6.0 | يمكن أن تكون معلمة `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم تعد معلمة `callback` اختيارية. عدم تمريرها سيصدر تحذيرًا بشأن الإهمال بمعرف DEP0013. |
| v6.4.0 | يعمل استدعاء `realpath` الآن مرة أخرى لحالات الحافة المختلفة على Windows. |
| v6.0.0 | تمت إزالة معلمة `cache`. |
| v0.1.31 | تمت الإضافة في: v0.1.31 |
:::

- `path` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`


- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)



يحسب بشكل غير متزامن اسم المسار القانوني عن طريق حل `.` و `..` والوصلات الرمزية.

اسم المسار القانوني ليس فريدًا بالضرورة. يمكن للوصلات الصلبة وعمليات ربط التركيب عرض كيان نظام ملفات من خلال العديد من أسماء المسارات.

تتصرف هذه الوظيفة مثل [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)، مع بعض الاستثناءات:

تحصل `callback` على وسيطتين `(err, resolvedPath)`. قد تستخدم `process.cwd` لحل المسارات النسبية.

يتم دعم المسارات التي يمكن تحويلها إلى سلاسل UTF8 فقط.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا له خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه للمسار الذي تم تمريره إلى دالة الاستدعاء. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير المسار الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم حل `path` إلى مقبس أو أنبوب، فسترجع الوظيفة اسمًا يعتمد على النظام لهذا الكائن.

يؤدي المسار غير الموجود إلى حدوث خطأ ENOENT. `error.path` هو مسار الملف المطلق.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى الوسيطة `callback` يؤدي الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v9.2.0 | تمت إضافته في: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)


غير متزامن [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

يحصل `callback` على وسيطتين `(err, resolvedPath)`.

يتم دعم المسارات التي يمكن تحويلها إلى سلاسل UTF8 فقط.

يمكن أن تكون الوسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا بخاصية `encoding` تحدد ترميز الأحرف المراد استخدامه للمسار الذي تم تمريره إلى دالة رد النداء. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير المسار الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

في نظام Linux، عندما يتم ربط Node.js بـ musl libc، يجب تحميل نظام ملفات procfs على `/proc` حتى تعمل هذه الوظيفة. لا يوجد هذا القيد في Glibc.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى الوسيطة `callback` يؤدي الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون المعلمات `oldPath` و `newPath` كائنات WHATWG `URL` باستخدام بروتوكول `file:`. الدعم حاليًا *تجريبي*. |
| v7.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيصدر تحذيرًا بالتقادم مع المعرف DEP0013. |
| v0.0.2 | تمت إضافته في: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


إعادة تسمية الملف بشكل غير متزامن في `oldPath` إلى اسم المسار المقدم كـ `newPath`. في حالة وجود `newPath` بالفعل، سيتم استبداله. إذا كان هناك دليل في `newPath`، فسيتم رفع خطأ بدلاً من ذلك. لا يتم إعطاء أي وسيطات بخلاف استثناء محتمل لدالة رد النداء عند الاكتمال.

انظر أيضًا: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` سيؤدي الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v16.0.0 | لم يعد مسموحًا باستخدام `fs.rmdir(path, { recursive: true })` على `path` وهو ملف، وسيؤدي إلى ظهور خطأ `ENOENT` على نظام التشغيل Windows وخطأ `ENOTDIR` على نظام POSIX. |
| v16.0.0 | لم يعد مسموحًا باستخدام `fs.rmdir(path, { recursive: true })` على `path` غير موجود، وسيؤدي إلى ظهور خطأ `ENOENT`. |
| v16.0.0 | تم إهمال الخيار `recursive`، واستخدامه يؤدي إلى ظهور تحذير إهمال. |
| v14.14.0 | تم إهمال الخيار `recursive`، استخدم `fs.rm` بدلاً من ذلك. |
| v13.3.0, v12.16.0 | تمت إعادة تسمية الخيار `maxBusyTries` إلى `maxRetries`، وقيمته الافتراضية هي 0. تمت إزالة الخيار `emfileWait`، وتستخدم أخطاء `EMFILE` نفس منطق إعادة المحاولة مثل الأخطاء الأخرى. الخيار `retryDelay` مدعوم الآن. يتم الآن إعادة محاولة أخطاء `ENFILE`. |
| v12.10.0 | الخيارات `recursive` و `maxBusyTries` و `emfileWait` مدعومة الآن. |
| v10.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون معلمات `path` كائن `URL` WHATWG باستخدام بروتوكول `file:`. |
| v7.0.0 | لم تعد المعلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى ظهور تحذير إهمال مع المعرف DEP0013. |
| v0.0.2 | تمت إضافته في: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تمت مصادفة خطأ `EBUSY` أو `EMFILE` أو `ENFILE` أو `ENOTEMPTY` أو `EPERM`، فإن Node.js يعيد محاولة العملية بانتظار تراجع خطي أطول بمقدار `retryDelay` مللي ثانية في كل محاولة. يمثل هذا الخيار عدد مرات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` هو `true`. **الافتراضي:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، قم بإجراء إزالة دليل متكررة. في الوضع المتكرر، تتم إعادة محاولة العمليات عند الفشل. **الافتراضي:** `false`. **تم الإهمال.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت بالمللي ثانية للانتظار بين عمليات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` هو `true`. **الافتراضي:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



غير متزامن [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). لا يتم إعطاء أي وسيطات أخرى بخلاف استثناء محتمل إلى رد نداء الإكمال.

يؤدي استخدام `fs.rmdir()` على ملف (وليس دليلًا) إلى ظهور خطأ `ENOENT` على نظام التشغيل Windows وخطأ `ENOTDIR` على نظام POSIX.

للحصول على سلوك مشابه لأمر Unix `rm -rf`، استخدم [`fs.rm()`](/ar/nodejs/api/fs#fsrmpath-options-callback) مع الخيارات `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v17.3.0, v16.14.0 | يمكن أن يكون المعامل `path` كائن `URL` من نوع WHATWG باستخدام البروتوكول `file:`. |
| الإصدار v14.14.0 | تمت إضافته في: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عند القيمة `true`, سيتم تجاهل الاستثناءات إذا كان `path` غير موجود. **الافتراضي:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تمت مصادفة خطأ `EBUSY` أو `EMFILE` أو `ENFILE` أو `ENOTEMPTY` أو `EPERM`, فستعيد Node.js محاولة العملية مع فترة انتظار خطية (`retryDelay`) ميلي ثانية أطول في كل محاولة. يمثل هذا الخيار عدد محاولات إعادة التنفيذ. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` بقيمة `true`. **الافتراضي:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`, قم بإجراء إزالة متكررة. في الوضع المتكرر، تتم إعادة محاولة العمليات عند الفشل. **الافتراضي:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت بالمللي ثانية للانتظار بين محاولات إعادة التنفيذ. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` بقيمة `true`. **الافتراضي:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



يزيل الملفات والمجلدات بشكل غير متزامن (على غرار الأداة القياسية POSIX `rm`). لا يتم إعطاء أي وسيطات باستثناء استثناء محتمل لرد الاتصال عند الانتهاء.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` يؤدي الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي تم إرجاعها يجب أن تكون bigint. |
| v10.0.0 | لم تعد معلمة `callback` اختيارية. عدم تمريرها سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن تكون معلمة `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم تعد معلمة `callback` اختيارية. عدم تمريرها سيصدر تحذيرًا بالتقادم مع المعرف DEP0013. |
| v0.0.2 | تمت إضافته في: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون `bigint`. **الافتراضي:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)
  
 

غير متزامن [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2). تحصل دالة رد النداء على وسيطتين `(err, stats)` حيث `stats` هو كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats).

في حالة حدوث خطأ، سيكون `err.code` واحدًا من [أخطاء النظام الشائعة](/ar/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/ar/nodejs/api/fs#fsstatpath-options-callback) يتبع الروابط الرمزية. استخدم [`fs.lstat()`](/ar/nodejs/api/fs#fslstatpath-options-callback) لإلقاء نظرة على الروابط نفسها.

لا يُنصح باستخدام `fs.stat()` للتحقق من وجود ملف قبل استدعاء `fs.open()` أو `fs.readFile()` أو `fs.writeFile()`. بدلاً من ذلك، يجب على كود المستخدم فتح/قراءة/كتابة الملف مباشرةً والتعامل مع الخطأ الذي يتم رفعه إذا كان الملف غير متاح.

للتحقق مما إذا كان الملف موجودًا دون معالجته بعد ذلك، يوصى باستخدام [`fs.access()`](/ar/nodejs/api/fs#fsaccesspath-mode-callback).

على سبيل المثال، بالنظر إلى هيكل الدليل التالي:

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
سيتحقق البرنامج التالي من إحصائيات المسارات المحددة:

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
سيكون الناتج الناتج مشابهًا لما يلي:

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**تمت إضافته في: الإصدار v19.6.0، v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سواء كانت القيم الرقمية في كائن [\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs) المُرجع يجب أن تكون `bigint`. **افتراضي:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs)



[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) غير متزامن. يُرجع معلومات حول نظام الملفات المُحمَّل الذي يحتوي على `path`. يحصل الاستدعاء على وسيطتين `(err, stats)` حيث `stats` هو كائن [\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs).

في حالة حدوث خطأ، سيكون `err.code` واحدًا من [أخطاء النظام الشائعة](/ar/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.0.0 | إذا تركت وسيطة `type` غير محددة، فسيقوم Node بالكشف التلقائي عن نوع `target` وتحديد `dir` أو `file` تلقائيًا. |
| v7.6.0 | يمكن أن تكون معاملات `target` و `path` كائنات WHATWG `URL` باستخدام بروتوكول `file:`. الدعم حاليًا لا يزال *تجريبيًا*. |
| v0.1.31 | تمت إضافته في: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



ينشئ الرابط المسمى `path` الذي يشير إلى `target`. لا يتم إعطاء أي وسيطات بخلاف استثناء محتمل لاستدعاء الإكمال.

راجع وثائق POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) لمزيد من التفاصيل.

تتوفر وسيطة `type` فقط على نظام التشغيل Windows ويتم تجاهلها على الأنظمة الأساسية الأخرى. يمكن تعيينها إلى `'dir'` أو `'file'` أو `'junction'`. إذا كانت وسيطة `type` هي `null`، فسيقوم Node.js بالكشف التلقائي عن نوع `target` واستخدام `'file'` أو `'dir'`. إذا كان `target` غير موجود، فسيتم استخدام `'file'`. تتطلب نقاط تقاطع Windows أن يكون المسار الوجهة مطلقًا. عند استخدام `'junction'`، سيتم تطبيع وسيطة `target` تلقائيًا إلى مسار مطلق. يمكن لنقاط التقاطع على وحدات تخزين NTFS أن تشير فقط إلى الدلائل.

تكون الأهداف النسبية بالنسبة إلى الدليل الأصلي للرابط.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
ينشئ المثال أعلاه رابطًا رمزيًا `mewtwo` يشير إلى `mew` في نفس الدليل:

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح لوسيط `callback` يؤدي الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v16.0.0 | الخطأ المُرجع قد يكون `AggregateError` إذا تم إرجاع أكثر من خطأ واحد. |
| v10.0.0 | المعامل `callback` لم يعد اختياريًا. عدم تمريره سيؤدي إلى إطلاق `TypeError` في وقت التشغيل. |
| v7.0.0 | المعامل `callback` لم يعد اختياريًا. عدم تمريره سيؤدي إلى إصدار تحذير إهمال بالمعرف DEP0013. |
| v0.8.6 | تمت إضافته في: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

يقتطع الملف. لا يتم إعطاء أي وسيطات أخرى بخلاف استثناء محتمل لرد نداء الاكتمال. يمكن أيضًا تمرير واصف ملف كوسيط أول. في هذه الحالة، يتم استدعاء `fs.ftruncate()`.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// بافتراض أن 'path/file.txt' هو ملف عادي.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt تم اقتطاعه');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// بافتراض أن 'path/file.txt' هو ملف عادي.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt تم اقتطاعه');
});
```
:::

تمرير واصف ملف مهمل وقد يؤدي إلى إطلاق خطأ في المستقبل.

راجع وثائق POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) لمزيد من التفاصيل.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يلقي الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيؤدي إلى طرح `TypeError` في وقت التشغيل. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` لـ WHATWG باستخدام بروتوكول `file:`. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذير إهمال مع المعرف DEP0013. |
| v0.0.2 | تمت إضافته في: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

يزيل ملفًا أو رابطًا رمزيًا بشكل غير متزامن. لا يتم تمرير أي وسائط بخلاف استثناء محتمل إلى دالة رد الاتصال للإكمال.

```js [ESM]
import { unlink } from 'node:fs';
// بافتراض أن 'path/file.txt' هو ملف عادي.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('تم حذف path/file.txt');
});
```
لن يعمل `fs.unlink()` على دليل، فارغًا كان أم لا. لإزالة دليل، استخدم [`fs.rmdir()`](/ar/nodejs/api/fs#fsrmdirpath-options-callback).

راجع وثائق POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) لمزيد من التفاصيل.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**تمت إضافته في: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) اختياري، مستمع تم إرفاقه مسبقًا باستخدام `fs.watchFile()`

توقف عن مراقبة التغييرات في `filename`. إذا تم تحديد `listener`، تتم إزالة هذا المستمع المحدد فقط. وإلا، تتم إزالة *جميع* المستمعين، مما يوقف فعليًا مراقبة `filename`.

استدعاء `fs.unwatchFile()` باسم ملف لا تتم مراقبته هو عملية فارغة، وليس خطأً.

يعد استخدام [`fs.watch()`](/ar/nodejs/api/fs#fswatchfilename-options-listener) أكثر كفاءة من `fs.watchFile()` و `fs.unwatchFile()`. يجب استخدام `fs.watch()` بدلاً من `fs.watchFile()` و `fs.unwatchFile()` كلما أمكن ذلك.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيطرح `TypeError` في وقت التشغيل. |
| v8.0.0 | لم تعد `NaN` و `Infinity` و `-Infinity` محددات وقت صالحة. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا بالإهمال مع المعرف DEP0013. |
| v4.1.0 | يُسمح الآن بسلاسل الأرقام و `NaN` و `Infinity` كمحددات للوقت. |
| v0.4.2 | تمت الإضافة في: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

تغيير الطوابع الزمنية لنظام الملفات للكائن المشار إليه بواسطة `path`.

تتبع وسيطات `atime` و `mtime` هذه القواعد:

- يمكن أن تكون القيم إما أرقامًا تمثل وقت Unix الحقبة بالثواني، أو `Date`، أو سلسلة رقمية مثل `'123456789.0'`.
- إذا تعذر تحويل القيمة إلى رقم، أو كانت `NaN` أو `Infinity` أو `-Infinity`، فسيتم طرح `Error`.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v19.1.0 | تمت إضافة دعم تكراري لنظام التشغيل Linux و AIX و IBMi. |
| v15.9.0, v14.17.0 | تمت إضافة دعم لإغلاق المراقب باستخدام AbortSignal. |
| v7.6.0 | يمكن أن يكون المعامل `filename` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v7.0.0 | لن يتم تعديل كائن `options` الذي تم تمريره أبدًا. |
| v0.5.10 | تمت الإضافة في: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان يجب أن تستمر العملية في العمل طالما تتم مراقبة الملفات. **الافتراضي:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان يجب مراقبة جميع الدلائل الفرعية، أو الدليل الحالي فقط. يتم تطبيق هذا عند تحديد دليل، وعلى الأنظمة الأساسية المدعومة فقط (راجع [المحاذير](/ar/nodejs/api/fs#caveats)). **الافتراضي:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد ترميز الأحرف الذي سيتم استخدامه لاسم الملف الذي تم تمريره إلى المستمع. **الافتراضي:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإغلاق المراقب باستخدام AbortSignal.


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **الافتراضي:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)


- Returns: [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher)

راقب التغييرات في `filename`، حيث `filename` إما ملف أو دليل.

الوسيطة الثانية اختيارية. إذا تم توفير `options` كسلسلة نصية، فإنه يحدد `encoding`. وإلا يجب تمرير `options` ككائن.

يحصل رد الاتصال المستمع على وسيطتين `(eventType, filename)`. `eventType` إما `'rename'` أو `'change'`، و `filename` هو اسم الملف الذي أثار الحدث.

في معظم الأنظمة الأساسية، يتم إصدار `'rename'` عندما يظهر اسم ملف أو يختفي في الدليل.

يتم إرفاق رد الاتصال المستمع بحدث `'change'` الذي تم إطلاقه بواسطة [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher)، ولكنه ليس نفس قيمة `'change'` الخاصة بـ `eventType`.

إذا تم تمرير `signal`، فإن إلغاء AbortController المقابل سيؤدي إلى إغلاق [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) الذي تم إرجاعه.


#### محاذير {#caveats}

واجهة برمجة التطبيقات `fs.watch` ليست متسقة بنسبة 100% عبر الأنظمة الأساسية، وغير متوفرة في بعض الحالات.

في نظام التشغيل Windows، لن يتم إصدار أي أحداث إذا تم نقل الدليل الذي تتم مراقبته أو إعادة تسميته. يتم الإبلاغ عن خطأ `EPERM` عند حذف الدليل الذي تتم مراقبته.

##### التوفر {#availability}

تعتمد هذه الميزة على نظام التشغيل الأساسي الذي يوفر طريقة للإعلام بتغييرات نظام الملفات.

- في أنظمة Linux، يستخدم هذا [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7).
- في أنظمة BSD، يستخدم هذا [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2).
- في نظام التشغيل macOS، يستخدم هذا [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) للملفات و [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events) للدلائل.
- في أنظمة SunOS (بما في ذلك Solaris و SmartOS)، يستخدم هذا [`event ports`](https://illumos.org/man/port_create).
- في أنظمة Windows، تعتمد هذه الميزة على [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw).
- في أنظمة AIX، تعتمد هذه الميزة على [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/)، والتي يجب تمكينها.
- في أنظمة IBM i، هذه الميزة غير مدعومة.

إذا كانت الوظيفة الأساسية غير متوفرة لسبب ما، فلن تتمكن `fs.watch()` من العمل وقد تطرح استثناءً. على سبيل المثال، يمكن أن تكون مراقبة الملفات أو الدلائل غير موثوقة، وفي بعض الحالات مستحيلة، على أنظمة ملفات الشبكة (NFS و SMB وما إلى ذلك) أو أنظمة ملفات المضيف عند استخدام برامج المحاكاة الافتراضية مثل Vagrant أو Docker.

لا يزال من الممكن استخدام `fs.watchFile()`، الذي يستخدم استطلاع الرأي stat، ولكن هذه الطريقة أبطأ وأقل موثوقية.

##### Inodes {#inodes}

في أنظمة Linux و macOS، تحل `fs.watch()` المسار إلى [inode](https://en.wikipedia.org/wiki/Inode) وتراقب inode. إذا تم حذف المسار الذي تتم مراقبته وإعادة إنشائه، فسيتم تعيين inode جديد له. ستصدر المراقبة حدثًا للحذف ولكنها ستستمر في مراقبة inode *الأصلي*. لن يتم إصدار أحداث لـ inode الجديد. هذا هو السلوك المتوقع.

تحتفظ ملفات AIX بنفس inode طوال فترة بقاء الملف. سيؤدي حفظ وإغلاق ملف تتم مراقبته على AIX إلى ظهور إشعارين (أحدهما لإضافة محتوى جديد، والآخر للاقتطاع).


##### وسيط اسم الملف {#filename-argument}

توفير وسيط `filename` في الاستدعاء مدعوم فقط على Linux و macOS و Windows و AIX. حتى على المنصات المدعومة، ليس من المضمون دائمًا توفير `filename`. لذلك، لا تفترض أنه يتم توفير وسيط `filename` دائمًا في الاستدعاء، واحتفظ ببعض المنطق الاحتياطي إذا كان `null`.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.5.0 | خيار `bigint` مدعوم الآن. |
| v7.6.0 | يمكن أن يكون المعامل `filename` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v0.1.31 | تمت الإضافة في: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `current` [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)
  
 
- الإرجاع: [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher)

يراقب التغييرات على `filename`. سيتم استدعاء `listener` في كل مرة يتم فيها الوصول إلى الملف.

يمكن حذف وسيط `options`. إذا تم توفيره، فيجب أن يكون كائنًا. قد يحتوي كائن `options` على قيمة منطقية تسمى `persistent` تشير إلى ما إذا كان يجب أن تستمر العملية في العمل طالما يتم مراقبة الملفات. قد يحدد كائن `options` خاصية `interval` تشير إلى عدد المرات التي يجب فيها استطلاع الهدف بالمللي ثانية.

يحصل `listener` على وسيطين، كائن الحالة الحالي وكائن الحالة السابق:

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```
تعد كائنات الحالة هذه مثيلات لـ `fs.Stat`. إذا كان خيار `bigint` هو `true`، فسيتم تحديد القيم الرقمية في هذه الكائنات على أنها `BigInt`s.

لكي يتم إعلامك عندما تم تعديل الملف، وليس مجرد الوصول إليه، من الضروري مقارنة `curr.mtimeMs` و `prev.mtimeMs`.

عندما تؤدي عملية `fs.watchFile` إلى خطأ `ENOENT`، فسيتم استدعاء المستمع مرة واحدة، مع تصفير جميع الحقول (أو، بالنسبة للتواريخ، Epoch Unix). إذا تم إنشاء الملف لاحقًا، فسيتم استدعاء المستمع مرة أخرى، مع أحدث كائنات الحالة. هذا تغيير في الوظائف منذ الإصدار v0.10.

يعد استخدام [`fs.watch()`](/ar/nodejs/api/fs#fswatchfilename-options-listener) أكثر كفاءة من `fs.watchFile` و `fs.unwatchFile`. يجب استخدام `fs.watch` بدلاً من `fs.watchFile` و `fs.unwatchFile` قدر الإمكان.

عندما يختفي ملف تتم مراقبته بواسطة `fs.watchFile()` ثم يظهر مرة أخرى، فسيكون محتوى `previous` في حدث الاستدعاء الثاني (إعادة ظهور الملف) هو نفس محتوى `previous` في حدث الاستدعاء الأول (اختفائه).

يحدث هذا عندما:

- يتم حذف الملف، يليه استعادة
- تتم إعادة تسمية الملف ثم إعادة تسميته مرة ثانية إلى اسمه الأصلي


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | الآن يؤدي تمرير رد نداء غير صالح إلى الوسيطة `callback` إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v14.0.0 | لم يعد الوسيط `buffer` يجبر الإدخال غير المدعوم على السلاسل النصية. |
| v10.10.0 | يمكن أن يكون الوسيط `buffer` الآن أي `TypedArray` أو `DataView`. |
| v10.0.0 | لم يعد الوسيط `callback` اختياريًا. عدم تمريره سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| v7.4.0 | يمكن أن يكون الوسيط `buffer` الآن `Uint8Array`. |
| v7.2.0 | الوسيطتان `offset` و `length` اختياريتان الآن. |
| v7.0.0 | لم يعد الوسيط `callback` اختياريًا. عدم تمريره سيصدر تحذيرًا بالتقادم مع المعرف DEP0013. |
| v0.0.2 | تمت الإضافة في: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

اكتب `buffer` إلى الملف المحدد بواسطة `fd`.

يحدد `offset` جزءًا من المخزن المؤقت المراد كتابته، و `length` هو عدد صحيح يحدد عدد البايتات المراد كتابتها.

يشير `position` إلى الإزاحة من بداية الملف حيث يجب كتابة هذه البيانات. إذا كان `typeof position !== 'number'`، فسيتم كتابة البيانات في الموضع الحالي. راجع [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

سيتم إعطاء رد النداء ثلاث وسيطات `(err, bytesWritten, buffer)` حيث تحدد `bytesWritten` عدد *البايتات* التي تمت كتابتها من `buffer`.

إذا تم استدعاء هذه الطريقة كإصدار [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed الخاص بها، فستعيد وعدًا بـ `Object` مع خصائص `bytesWritten` و `buffer`.

من غير الآمن استخدام `fs.write()` عدة مرات في نفس الملف دون انتظار رد النداء. لهذا السيناريو، يوصى باستخدام [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options).

في Linux، لا تعمل الكتابات الموضعية عندما يتم فتح الملف في وضع الإلحاق. تتجاهل النواة وسيطة الموضع وتلحق البيانات دائمًا بنهاية الملف.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**أضيف في: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

اكتب `buffer` في الملف المحدد بواسطة `fd`.

على غرار دالة `fs.write` المذكورة أعلاه، تأخذ هذه النسخة كائن `options` اختياريًا. إذا لم يتم تحديد كائن `options`، فسوف يأخذ القيم الافتراضية المذكورة أعلاه.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | لم يعد دعم تمرير كائن بدالة `toString` خاصة به إلى معامل `string`. |
| v17.8.0 | تمرير كائن بدالة `toString` خاصة به إلى معامل `string` يعتبر مهملاً. |
| v14.12.0 | سيحول معامل `string` الكائن بدالة `toString` صريحة إلى سلسلة. |
| v14.0.0 | لن يجبر معامل `string` المدخلات غير المدعومة إلى سلاسل بعد الآن. |
| v10.0.0 | معامل `callback` لم يعد اختياريًا. عدم تمريره سيؤدي إلى ظهور `TypeError` في وقت التشغيل. |
| v7.2.0 | معامل `position` اختياري الآن. |
| v7.0.0 | معامل `callback` لم يعد اختياريًا. عدم تمريره سيصدر تحذير إهمال بمعرف DEP0013. |
| v0.11.5 | تمت إضافته في: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

اكتب `string` في الملف المحدد بواسطة `fd`. إذا لم يكن `string` سلسلة نصية، فسيتم طرح استثناء.

يشير `position` إلى الإزاحة من بداية الملف حيث يجب كتابة هذه البيانات. إذا كان `typeof position !== 'number'`، فسيتم كتابة البيانات في الموضع الحالي. راجع [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` هو ترميز السلسلة المتوقع.

سيتلقى الاستدعاء الوسيطات `(err, written, string)` حيث تحدد `written` عدد *البايتات* التي تطلبتها السلسلة التي تم تمريرها للكتابة. البايتات المكتوبة ليست بالضرورة هي نفسها الأحرف المكتوبة في السلسلة. راجع [`Buffer.byteLength`](/ar/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

من غير الآمن استخدام `fs.write()` عدة مرات على نفس الملف دون انتظار الاستدعاء. لهذا السيناريو، يوصى باستخدام [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options).

في نظام Linux، لا تعمل عمليات الكتابة الموضعية عندما يتم فتح الملف في وضع الإلحاق. تتجاهل النواة وسيطة الموضع وتلحق دائمًا البيانات بنهاية الملف.

في نظام Windows، إذا كان واصف الملف متصلاً بوحدة التحكم (مثل `fd == 1` أو `stdout`)، فلن يتم عرض سلسلة تحتوي على أحرف غير ASCII بشكل صحيح افتراضيًا، بغض النظر عن الترميز المستخدم. من الممكن تكوين وحدة التحكم لعرض UTF-8 بشكل صحيح عن طريق تغيير صفحة التعليمات البرمجية النشطة باستخدام الأمر `chcp 65001`. راجع مستندات [chcp](https://ss64.com/nt/chcp) لمزيد من التفاصيل.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v19.0.0 | لم يعد تمرير كائن له دالة `toString` خاصة به إلى المعامل `string` مدعومًا. |
| v18.0.0 | يؤدي تمرير رد نداء غير صالح إلى الوسيط `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v17.8.0 | تم إهمال تمرير كائن له دالة `toString` خاصة به إلى المعامل `string`. |
| v16.0.0 | قد يكون الخطأ الذي تم إرجاعه `AggregateError` إذا تم إرجاع أكثر من خطأ واحد. |
| v15.2.0, v14.17.0 | قد تتضمن وسيطة الخيارات `AbortSignal` لإلغاء طلب writeFile قيد التقدم. |
| v14.12.0 | سيقوم المعامل `data` بتحويل كائن بدالة `toString` صريحة إلى سلسلة. |
| v14.0.0 | لن يقوم المعامل `data` بتحويل الإدخال غير المدعوم إلى سلاسل بعد الآن. |
| v10.10.0 | يمكن أن يكون المعامل `data` الآن أي `TypedArray` أو `DataView`. |
| v10.0.0 | لم يعد المعامل `callback` اختياريًا. سيؤدي عدم تمريره إلى طرح `TypeError` في وقت التشغيل. |
| v7.4.0 | يمكن أن يكون المعامل `data` الآن `Uint8Array`. |
| v7.0.0 | لم يعد المعامل `callback` اختياريًا. سيؤدي عدم تمريره إلى إصدار تحذير إهمال بمعرف DEP0013. |
| v5.0.0 | يمكن أن يكون المعامل `file` الآن واصف ملف. |
| v0.1.29 | تمت إضافته في: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم الملف أو واصف الملف
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم نظام الملفات `flags`](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تمت كتابة جميع البيانات بنجاح في الملف، وكان `flush` هو `true`، فسيتم استخدام `fs.fsync()` لدفع البيانات. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء writeFile قيد التقدم

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

عندما يكون `file` اسم ملف، يكتب البيانات بشكل غير متزامن إلى الملف، ويستبدل الملف إذا كان موجودًا بالفعل. يمكن أن تكون `data` سلسلة أو مخزن مؤقت.

عندما يكون `file` واصف ملف، يكون السلوك مشابهًا لاستدعاء `fs.write()` مباشرةً (وهو مستحسن). راجع الملاحظات أدناه حول استخدام واصف الملف.

يتم تجاهل خيار `encoding` إذا كانت `data` مخزنًا مؤقتًا.

يؤثر خيار `mode` فقط على الملف الذي تم إنشاؤه حديثًا. راجع [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) لمزيد من التفاصيل.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
إذا كانت `options` سلسلة، فإنها تحدد الترميز:

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
من غير الآمن استخدام `fs.writeFile()` عدة مرات على نفس الملف دون انتظار رد النداء. لهذا السيناريو، يوصى باستخدام [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options).

على غرار `fs.readFile` - `fs.writeFile` هي طريقة ملائمة تنفذ عدة استدعاءات `write` داخليًا لكتابة المخزن المؤقت الذي تم تمريره إليها. بالنسبة للتعليمات البرمجية الحساسة للأداء، ضع في اعتبارك استخدام [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options).

من الممكن استخدام [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) لإلغاء `fs.writeFile()`. الإلغاء هو "أفضل جهد"، ومن المحتمل أن يتم كتابة بعض البيانات.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // عند إلغاء طلب - يتم استدعاء رد النداء باستخدام AbortError
});
// عندما يجب إلغاء الطلب
controller.abort();
```
لا يؤدي إلغاء طلب قيد التقدم إلى إلغاء طلبات نظام التشغيل الفردية، بل يؤدي إلى إلغاء التخزين المؤقت الداخلي الذي يقوم به `fs.writeFile`.


#### استخدام `fs.writeFile()` مع واصفات الملفات {#using-fswritefile-with-file-descriptors}

عندما يكون `file` واصف ملف، فإن السلوك يكاد يكون مطابقًا للاتصال المباشر بـ `fs.write()` كما يلي:

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
الفرق عن الاتصال المباشر بـ `fs.write()` هو أنه في بعض الحالات غير العادية، قد تكتب `fs.write()` جزءًا فقط من المخزن المؤقت وتحتاج إلى إعادة المحاولة لكتابة البيانات المتبقية، في حين أن `fs.writeFile()` تعيد المحاولة حتى تتم كتابة البيانات بالكامل (أو يحدث خطأ).

تداعيات هذا هي مصدر شائع للارتباك. في حالة واصف الملف، لا يتم استبدال الملف! لا يتم بالضرورة كتابة البيانات في بداية الملف، وقد تظل البيانات الأصلية للملف قبل و/أو بعد البيانات المكتوبة حديثًا.

على سبيل المثال، إذا تم استدعاء `fs.writeFile()` مرتين على التوالي، أولاً لكتابة السلسلة `'Hello'`، ثم لكتابة السلسلة `', World'`، فسيحتوي الملف على `'Hello, World'`، وقد يحتوي على بعض البيانات الأصلية للملف (اعتمادًا على حجم الملف الأصلي، وموضع واصف الملف). إذا تم استخدام اسم ملف بدلاً من واصف، فسيتم ضمان احتواء الملف على `', World'` فقط.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد اتصال غير صالح إلى وسيطة `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.9.0 | تمت الإضافة في: v12.9.0 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

اكتب مجموعة من `ArrayBufferView` إلى الملف المحدد بواسطة `fd` باستخدام `writev()`.

`position` هو الإزاحة من بداية الملف حيث يجب كتابة هذه البيانات. إذا كان `typeof position !== 'number'`، فسيتم كتابة البيانات في الموضع الحالي.

سيتم إعطاء رد الاتصال ثلاث وسائط: `err` و `bytesWritten` و `buffers`. `bytesWritten` هو عدد البايتات التي تمت كتابتها من `buffers`.

إذا كانت هذه الطريقة [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed، فإنها تُرجع وعدًا لـ `Object` مع خصائص `bytesWritten` و `buffers`.

من غير الآمن استخدام `fs.writev()` عدة مرات على نفس الملف دون انتظار رد الاتصال. لهذا السيناريو، استخدم [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options).

في Linux، لا تعمل الكتابات الموضعية عندما يتم فتح الملف في وضع الإلحاق. تتجاهل النواة وسيطة الموضع وتلحق البيانات دائمًا بنهاية الملف.


## واجهة برمجة التطبيقات المتزامنة {#synchronous-api}

تقوم واجهات برمجة التطبيقات المتزامنة بتنفيذ جميع العمليات بشكل متزامن، مما يعيق حلقة الأحداث حتى تكتمل العملية أو تفشل.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` من نوع WHATWG باستخدام بروتوكول `file:`. |
| v0.11.15 | تمت إضافته في: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `fs.constants.F_OK`

يختبر بشكل متزامن أذونات المستخدم للملف أو الدليل المحدد بواسطة `path`. المعامل `mode` هو عدد صحيح اختياري يحدد فحوصات إمكانية الوصول التي سيتم إجراؤها. يجب أن يكون `mode` إما القيمة `fs.constants.F_OK` أو قناعًا يتكون من OR الثنائية لأي من `fs.constants.R_OK` و `fs.constants.W_OK` و `fs.constants.X_OK` (على سبيل المثال `fs.constants.W_OK | fs.constants.R_OK`). تحقق من [ثوابت الوصول إلى الملفات](/ar/nodejs/api/fs#file-access-constants) لمعرفة القيم المحتملة لـ `mode`.

إذا فشل أي من فحوصات إمكانية الوصول، فسيتم طرح `Error`. خلاف ذلك، ستعيد الطريقة `undefined`.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('يمكن القراءة/الكتابة');
} catch (err) {
  console.error('لا يوجد وصول!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.1.0, v20.10.0 | يتم دعم الخيار `flush` الآن. |
| v7.0.0 | لن يتم تعديل كائن `options` الذي تم تمريره أبدًا. |
| v5.0.0 | يمكن أن يكون المعامل `file` واصف ملف الآن. |
| v0.6.7 | تمت إضافته في: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم الملف أو واصف الملف
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم علامات نظام الملفات`](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تفريغ واصف الملف الأساسي قبل إغلاقه. **الافتراضي:** `false`.
  
 

يقوم بإلحاق البيانات بشكل متزامن بملف، وإنشاء الملف إذا لم يكن موجودًا بالفعل. يمكن أن تكون `data` سلسلة أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

يؤثر الخيار `mode` فقط على الملف الذي تم إنشاؤه حديثًا. راجع [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) لمزيد من التفاصيل.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('تم إلحاق "data to append" بالملف!');
} catch (err) {
  /* قم بمعالجة الخطأ */
}
```
إذا كان `options` عبارة عن سلسلة، فإنه يحدد الترميز:

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
يمكن تحديد `path` كواصف ملف رقمي تم فتحه للإلحاق (باستخدام `fs.open()` أو `fs.openSync()`). لن يتم إغلاق واصف الملف تلقائيًا.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* قم بمعالجة الخطأ */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` الخاص بـ WHATWG باستخدام البروتوكول `file:`. |
| v0.6.7 | أُضيف في: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

للحصول على معلومات مفصلة، راجع الوثائق الخاصة بالإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.chmod()`](/ar/nodejs/api/fs#fschmodpath-mode-callback).

راجع وثائق POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) للحصول على مزيد من التفاصيل.

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` الخاص بـ WHATWG باستخدام البروتوكول `file:`. |
| v0.1.97 | أُضيف في: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقوم بتغيير مالك ومجموعة ملف بشكل متزامن. يُرجع `undefined`. هذا هو الإصدار المتزامن من [`fs.chown()`](/ar/nodejs/api/fs#fschownpath-uid-gid-callback).

راجع وثائق POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) للحصول على مزيد من التفاصيل.

### `fs.closeSync(fd)` {#fsclosesyncfd}

**أُضيف في: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يغلق واصف الملف. يُرجع `undefined`.

قد يؤدي استدعاء `fs.closeSync()` على أي واصف ملف (`fd`) قيد الاستخدام حاليًا من خلال أي عملية `fs` أخرى إلى سلوك غير محدد.

راجع وثائق POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) للحصول على مزيد من التفاصيل.


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار 14.0.0 | تم تغيير وسيطة `flags` إلى `mode` وفرض التحقق الأكثر صرامة من النوع. |
| الإصدار 8.5.0 | تمت الإضافة في: الإصدار 8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم ملف المصدر المراد نسخه
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم ملف الوجهة لعملية النسخ
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معدِّلات لعملية النسخ. **افتراضي:** `0`.

يقوم بنسخ `src` إلى `dest` بشكل متزامن. بشكل افتراضي، تتم الكتابة فوق `dest` إذا كانت موجودة بالفعل. يُرجع `undefined`. لا تقدم Node.js أي ضمانات بشأن ذرية عملية النسخ. إذا حدث خطأ بعد فتح ملف الوجهة للكتابة، ستحاول Node.js إزالة الوجهة.

`mode` هو عدد صحيح اختياري يحدد سلوك عملية النسخ. من الممكن إنشاء قناع يتكون من OR على مستوى البت لقيمتين أو أكثر (مثل `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: ستفشل عملية النسخ إذا كانت `dest` موجودة بالفعل.
- `fs.constants.COPYFILE_FICLONE`: ستحاول عملية النسخ إنشاء إعادة ارتباط نسخ عند الكتابة. إذا كانت المنصة لا تدعم النسخ عند الكتابة، فسيتم استخدام آلية نسخ احتياطية.
- `fs.constants.COPYFILE_FICLONE_FORCE`: ستحاول عملية النسخ إنشاء إعادة ارتباط نسخ عند الكتابة. إذا كانت المنصة لا تدعم النسخ عند الكتابة، فسوف تفشل العملية.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// سيتم إنشاء destination.txt أو الكتابة فوقه بشكل افتراضي.
copyFileSync('source.txt', 'destination.txt');
console.log('تم نسخ source.txt إلى destination.txt');

// باستخدام COPYFILE_EXCL، ستفشل العملية إذا كان destination.txt موجودًا.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.3.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| v20.1.0, v18.17.0 | قبول خيار `mode` إضافي لتحديد سلوك النسخ كـ `mode` وسيطة `fs.copyFile()`. |
| v17.6.0, v16.15.0 | يقبل خيار `verbatimSymlinks` إضافي لتحديد ما إذا كان سيتم إجراء تحليل المسار للوصلات الرمزية. |
| v16.7.0 | تمت الإضافة في: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار المصدر المراد نسخه.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار الوجهة المراد النسخ إليه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إلغاء الإشارة إلى الوصلات الرمزية. **الافتراضي:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `force` تساوي `false`، والوجهة موجودة، قم بإصدار خطأ. **الافتراضي:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتصفية الملفات/المجلدات المنسوخة. أرجع `true` لنسخ العنصر، و `false` لتجاهله. عند تجاهل مجلد، سيتم تخطي جميع محتوياته أيضًا. **الافتراضي:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار المصدر المراد نسخه.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الوجهة المراد النسخ إليه.
    - Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) أي قيمة غير `Promise` قابلة للإجبار إلى `boolean`.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) الكتابة فوق ملف أو مجلد موجود. ستتجاهل عملية النسخ الأخطاء إذا قمت بتعيين هذا إلى false وكانت الوجهة موجودة. استخدم خيار `errorOnExist` لتغيير هذا السلوك. **الافتراضي:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعدِّلات لعملية النسخ. **الافتراضي:** `0`. راجع علامة `mode` في [`fs.copyFileSync()`](/ar/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، سيتم الحفاظ على الطوابع الزمنية من `src`. **الافتراضي:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) نسخ المجلدات بشكل متكرر **الافتراضي:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، سيتم تخطي تحليل المسار للوصلات الرمزية. **الافتراضي:** `false`
  
 

ينسخ بشكل متزامن بنية الدليل بأكملها من `src` إلى `dest`، بما في ذلك الدلائل الفرعية والملفات.

عند نسخ دليل إلى دليل آخر، لا يتم دعم الأنماط العامة ويكون السلوك مشابهًا لـ `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` الخاص بـ WHATWG باستخدام بروتوكول `file:`. |
| v0.1.21 | أُضيف في: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان المسار موجودًا، وإلا `false`.

للحصول على معلومات مفصلة، راجع الوثائق الخاصة بالإصدار غير المتزامن من هذا API: [`fs.exists()`](/ar/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` مهمل، لكن `fs.existsSync()` ليس كذلك. يقبل المعامل `callback` في `fs.exists()` معلمات غير متوافقة مع استدعاءات Node.js الأخرى. لا تستخدم `fs.existsSync()` استدعاءً.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('المسار موجود.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**أُضيف في: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يضبط أذونات الملف. يُرجع `undefined`.

راجع وثائق POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) لمزيد من التفاصيل.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**أُضيف في: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف المستخدم للمالك الجديد للملف.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف المجموعة للمجموعة الجديدة للملف.

يضبط مالك الملف. يُرجع `undefined`.

راجع وثائق POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) لمزيد من التفاصيل.


### ‏`fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**تمت إضافتها في: الإصدار v0.1.96**

- ‏`fd` ‏[\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تُجبر جميع عمليات الإدخال/الإخراج المُدرجة حاليًا والمرتبطة بالملف على حالة إكمال الإدخال/الإخراج المتزامنة لنظام التشغيل. راجع وثائق POSIX ‏[`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2)‎ للحصول على التفاصيل. تُرجع `غير مُعرَّفة`.

### ‏`fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.5.0 | تقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي تم إرجاعها يجب أن تكون ذات نوع `bigint`. |
| v0.1.95 | تمت إضافتها في: الإصدار v0.1.95 |
:::

- ‏`fd` ‏[\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- ‏`options` ‏[\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ‏`bigint` ‏[\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن ‏[\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون من نوع `bigint`. ‏**الافتراضي:** ‏`false`.

- تُرجع: ‏[\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)

تسترجع ‏[\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) لواصف الملف.

راجع وثائق POSIX ‏[`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2)‎ للحصول على مزيد من التفاصيل.

### ‏`fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**تمت إضافتها في: الإصدار v0.1.96**

- ‏`fd` ‏[\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تطلب إرسال جميع البيانات الخاصة بواصف الملف المفتوح إلى جهاز التخزين. التنفيذ المحدد خاص بنظام التشغيل والجهاز. راجع وثائق POSIX ‏[`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2)‎ للحصول على مزيد من التفاصيل. تُرجع `غير مُعرَّفة`.

### ‏`fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**تمت إضافتها في: الإصدار v0.8.6**

- ‏`fd` ‏[\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- ‏`len` ‏[\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ‏**الافتراضي:** ‏`0`

تقتطع واصف الملف. تُرجع `غير مُعرَّفة`.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: ‏[`fs.ftruncate()`](/ar/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v4.1.0 | تم السماح الآن باستخدام السلاسل الرقمية و `NaN` و `Infinity` كمحددات للوقت. |
| v0.4.2 | تمت الإضافة في: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

الإصدار المتزامن من [`fs.futimes()`](/ar/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). تقوم بإرجاع `undefined`.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v22.2.0 | إضافة دعم لـ `withFileTypes` كخيار. |
| v22.0.0 | تمت الإضافة في: v22.0.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دليل العمل الحالي. **افتراضي:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتصفية الملفات/المجلدات. قم بإرجاع `true` لاستبعاد العنصر، و `false` لتضمينه. **افتراضي:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان يجب على glob إرجاع المسارات كـ Dirents، و `false` بخلاف ذلك. **افتراضي:** `false`.
  
 
- تُرجع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسارات الملفات التي تطابق النمط.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**مهملة منذ: الإصدار v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُغير الأذونات على رابط رمزي. يُرجع `غير معرّف`.

هذه الطريقة مُطبقة فقط على نظام التشغيل macOS.

راجع توثيق POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) لمزيد من التفاصيل.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.6.0 | لم تعد واجهة برمجة التطبيقات هذه مهملة. |
| v0.4.7 | الإهمال خاص بالتوثيق فقط. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف المستخدم لمالك الملف الجديد.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف المجموعة لمجموعة الملف الجديدة.

تعيين المالك للمسار. يُرجع `غير معرّف`.

راجع توثيق POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) لمزيد من التفاصيل.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**أُضيف في: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

تغيير الطوابع الزمنية لنظام ملفات الرابط الرمزي المُشار إليه بواسطة `path`. يُرجع `غير معرّف`، أو يطرح استثناءً عندما تكون المعلمات غير صحيحة أو تفشل العملية. هذا هو الإصدار المتزامن من [`fs.lutimes()`](/ar/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v7.6.0 | يمكن أن تكون المعلمات `existingPath` و `newPath` كائنات `URL` من WHATWG باستخدام بروتوكول `file:`. الدعم حاليًا لا يزال *تجريبيًا*. |
| v0.1.31 | تمت إضافته في: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)

ينشئ رابطًا جديدًا من `existingPath` إلى `newPath`. راجع وثائق POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) لمزيد من التفاصيل. يعيد `undefined`.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.3.0, v14.17.0 | يقبل خيار `throwIfNoEntry` لتحديد ما إذا كان سيتم طرح استثناء إذا لم يكن الإدخال موجودًا. |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي تم إرجاعها يجب أن تكون bigint. |
| v7.6.0 | يمكن أن تكون المعلمة `path` كائن `URL` من WHATWG باستخدام بروتوكول `file:`. |
| v0.1.30 | تمت إضافته في: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سواء كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي تم إرجاعه يجب أن تكون `bigint`. **الافتراضي:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان سيتم طرح استثناء إذا لم يكن هناك إدخال نظام ملفات موجودًا، بدلاً من إرجاع `undefined`. **الافتراضي:** `true`.

- الإرجاع: [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)

يسترد [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) للرابط الرمزي المشار إليه بواسطة `path`.

راجع وثائق POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) لمزيد من التفاصيل.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.11.0, v12.17.0 | في وضع `recursive`، يتم الآن إرجاع المسار الأول الذي تم إنشاؤه. |
| v10.12.0 | يمكن أن تكون الوسيطة الثانية الآن كائن `options` مع خصائص `recursive` و `mode`. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` وفقًا لـ WHATWG باستخدام بروتوكول `file:`. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) غير مدعوم على نظام Windows. **الافتراضي:** `0o777`.
  
 
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

يقوم بإنشاء دليل بشكل متزامن. يُرجع `undefined`، أو إذا كانت قيمة `recursive` هي `true`، فسيتم إرجاع مسار الدليل الأول الذي تم إنشاؤه. هذا هو الإصدار المتزامن من [`fs.mkdir()`](/ar/nodejs/api/fs#fsmkdirpath-options-callback).

راجع وثائق POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) للحصول على مزيد من التفاصيل.

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.6.0, v18.19.0 | يقبل المعامل `prefix` الآن المخازن المؤقتة وعنوان URL. |
| v16.5.0, v14.18.0 | يقبل المعامل `prefix` الآن سلسلة فارغة. |
| v5.10.0 | تمت الإضافة في: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
  
 
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع مسار الدليل الذي تم إنشاؤه.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.mkdtemp()`](/ar/nodejs/api/fs#fsmkdtempprefix-options-callback).

يمكن أن تكون الوسيطة الاختيارية `options` عبارة عن سلسلة تحدد ترميزًا، أو كائنًا يحتوي على خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0, v18.17.0 | تمت إضافة خيار `recursive`. |
| v13.1.0, v12.16.0 | تم تقديم خيار `bufferSize`. |
| v12.12.0 | تمت إضافته في: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إدخالات الدليل التي يتم تخزينها مؤقتًا داخليًا عند القراءة من الدليل. تؤدي القيم الأعلى إلى أداء أفضل ولكن استخدام ذاكرة أعلى. **الافتراضي:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `false`


- الإرجاع: [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir)

افتح دليلًا بشكل متزامن. انظر [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

ينشئ [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir)، والذي يحتوي على جميع الوظائف الأخرى للقراءة من الدليل وتنظيفه.

يحدد خيار `encoding` الترميز لـ `path` أثناء فتح الدليل وعمليات القراءة اللاحقة.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.1.0 | الوسيطة `flags` اختيارية الآن وتأخذ القيمة الافتراضية `'r'`. |
| v9.9.0 | يتم الآن دعم العلامات `as` و `as+`. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v0.1.21 | تمت إضافته في: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `'r'`. انظر [دعم `flags` نظام الملفات](/ar/nodejs/api/fs#file-system-flags).
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0o666`
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع عدد صحيح يمثل واصف الملف.

للحصول على معلومات مفصلة، انظر وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v20.1.0, v18.17.0 | تمت إضافة الخيار `recursive`. |
| v10.10.0 | تمت إضافة الخيار الجديد `withFileTypes`. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة `true`، فسيقرأ محتويات الدليل بشكل متكرر. في الوضع التكراري، سيسرد جميع الملفات والملفات الفرعية والأدلة. **الافتراضي:** `false`.
  
 
- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ar/nodejs/api/fs#class-fsdirent)

يقرأ محتويات الدليل.

راجع وثائق POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) لمزيد من التفاصيل.

يمكن أن تكون الوسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا له خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه لأسماء الملفات التي تم إرجاعها. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير أسماء الملفات التي تم إرجاعها ككائنات [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

إذا تم تعيين `options.withFileTypes` على `true`، فستحتوي النتيجة على كائنات [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent).


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام البروتوكول `file:`. |
| v5.0.0 | يمكن أن يكون المعامل `path` واصف ملف الآن. |
| v0.1.8 | تمت الإضافة في: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم الملف أو واصف الملف
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم نظام الملفات `flags`](/ar/nodejs/api/fs#file-system-flags). **الافتراضي:** `'r'`.
  
 
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع محتويات `path`.

للحصول على معلومات مفصلة، راجع توثيق الإصدار غير المتزامن من هذا الـ API: [`fs.readFile()`](/ar/nodejs/api/fs#fsreadfilepath-options-callback).

إذا تم تحديد خيار `encoding`، فإن هذه الدالة ترجع سلسلة نصية. وإلا فإنها ترجع buffer.

على غرار [`fs.readFile()`](/ar/nodejs/api/fs#fsreadfilepath-options-callback)، عندما يكون المسار عبارة عن دليل، فإن سلوك `fs.readFileSync()` خاص بالنظام الأساسي.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux, و Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` لـ WHATWG باستخدام بروتوكول `file:`. |
| v0.1.31 | تمت الإضافة في: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`


- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع القيمة النصية للرابط الرمزي.

راجع توثيق POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) لمزيد من التفاصيل.

يمكن أن تكون وسيطة `options` الاختيارية عبارة عن سلسلة تحدد ترميزًا، أو كائنًا له الخاصية `encoding` تحدد ترميز الأحرف لاستخدامه لمسار الارتباط الذي تم إرجاعه. إذا تم تعيين `encoding` على `'buffer'`، فسيتم تمرير مسار الارتباط الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.10.0 | يمكن أن يكون المعامل `buffer` الآن أي `TypedArray` أو `DataView`. |
| v6.0.0 | يمكن أن يكون المعامل `length` الآن `0`. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع عدد `bytesRead`.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.read()`](/ar/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.13.0, v12.17.0 | يمكن تمرير كائن الخيارات لجعل الإزاحة والطول والموضع اختيارية. |
| v13.13.0, v12.17.0 | تمت إضافتها في: v13.13.0, v12.17.0 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
    - `length` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `buffer.byteLength - offset`
    - `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
  
 
- الإرجاع: [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع عدد `bytesRead`.

على غرار دالة `fs.readSync` المذكورة أعلاه، تأخذ هذه النسخة كائن `options` اختياري. إذا لم يتم تحديد كائن `options`، فسيتم الافتراض بالقيم المذكورة أعلاه.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن لواجهة برمجة التطبيقات هذه: [`fs.read()`](/ar/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**تمت إضافتها في: v13.13.0, v12.17.0**

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- الإرجاع: [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي تمت قراءتها.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن لواجهة برمجة التطبيقات هذه: [`fs.readv()`](/ar/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v8.0.0 | تمت إضافة دعم تحليل الأنابيب/المقبس. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` الخاص بـ WHATWG باستخدام بروتوكول `file:`. |
| v6.4.0 | تعمل الآن استدعاء `realpathSync` مرة أخرى لحالات حافة مختلفة في نظام التشغيل Windows. |
| v6.0.0 | تمت إزالة المعامل `cache`. |
| v0.1.31 | تمت الإضافة في: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'utf8'`


- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع اسم المسار الذي تم تحليله.

للحصول على معلومات تفصيلية، راجع وثائق الإصدار غير المتزامن لواجهة برمجة التطبيقات هذه: [`fs.realpath()`](/ar/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**تمت الإضافة في: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'utf8'`


- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

متزامن [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

يتم دعم المسارات التي يمكن تحويلها إلى سلاسل UTF8 فقط.

يمكن أن تكون وسيطة `options` الاختيارية سلسلة تحدد ترميزًا، أو كائنًا مع خاصية `encoding` تحدد ترميز الأحرف المراد استخدامه للمسار الذي تم إرجاعه. إذا تم تعيين `encoding` إلى `'buffer'`، فسيتم تمرير المسار الذي تم إرجاعه ككائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

في نظام التشغيل Linux، عندما يتم ربط Node.js بـ musl libc، يجب تركيب نظام الملفات procfs على `/proc` حتى تعمل هذه الوظيفة. لا يحتوي Glibc على هذا القيد.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v7.6.0 | يمكن أن تكون المعلمات `oldPath` و `newPath` كائنات `URL` WHATWG باستخدام بروتوكول `file:`. الدعم حاليًا لا يزال *تجريبيًا*. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)

يعيد تسمية الملف من `oldPath` إلى `newPath`. يُرجع `undefined`.

راجع وثائق POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) لمزيد من التفاصيل.

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | لم يعد مسموحًا باستخدام `fs.rmdirSync(path, { recursive: true })` على `path` وهو ملف، ويؤدي إلى خطأ `ENOENT` في Windows وخطأ `ENOTDIR` في POSIX. |
| v16.0.0 | لم يعد مسموحًا باستخدام `fs.rmdirSync(path, { recursive: true })` على `path` غير موجود، ويؤدي إلى خطأ `ENOENT`. |
| v16.0.0 | الخيار `recursive` مهمل، واستخدامه يثير تحذيرًا بالإهمال. |
| v14.14.0 | الخيار `recursive` مهمل، استخدم `fs.rmSync` بدلاً من ذلك. |
| v13.3.0, v12.16.0 | تمت إعادة تسمية الخيار `maxBusyTries` إلى `maxRetries`، وقيمته الافتراضية هي 0. تمت إزالة الخيار `emfileWait`، وتستخدم أخطاء `EMFILE` نفس منطق إعادة المحاولة مثل الأخطاء الأخرى. الخيار `retryDelay` مدعوم الآن. تتم الآن إعادة محاولة أخطاء `ENFILE`. |
| v12.10.0 | الخيارات `recursive` و `maxBusyTries` و `emfileWait` مدعومة الآن. |
| v7.6.0 | يمكن أن تكون معلمات `path` كائن `URL` WHATWG باستخدام بروتوكول `file:`. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تمت مصادفة خطأ `EBUSY` أو `EMFILE` أو `ENFILE` أو `ENOTEMPTY` أو `EPERM`، فإن Node.js يعيد محاولة العملية مع انتظار تراجعي خطي يزيد `retryDelay` بالمللي ثانية في كل محاولة. يمثل هذا الخيار عدد مرات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` هو `true`. **الافتراضي:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فقم بإزالة الدليل بشكل متكرر. في الوضع المتكرر، تتم إعادة محاولة العمليات عند الفشل. **الافتراضي:** `false`. **مهمل.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت بالمللي ثانية للانتظار بين عمليات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` هو `true`. **الافتراضي:** `100`.

 

[`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2) متزامن. يُرجع `undefined`.

يؤدي استخدام `fs.rmdirSync()` على ملف (وليس دليل) إلى حدوث خطأ `ENOENT` على نظام التشغيل Windows وخطأ `ENOTDIR` على نظام التشغيل POSIX.

للحصول على سلوك مشابه لأمر Unix `rm -rf`، استخدم [`fs.rmSync()`](/ar/nodejs/api/fs#fsrmsyncpath-options) مع الخيارات `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.3.0, v16.14.0 | يمكن أن يكون المعامل `path` كائن `URL` من WHATWG باستخدام بروتوكول `file:`. |
| v14.14.0 | تمت الإضافة في: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، سيتم تجاهل الاستثناءات إذا لم يكن `path` موجودًا. **الافتراضي:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تمت مصادفة خطأ `EBUSY` أو `EMFILE` أو `ENFILE` أو `ENOTEMPTY` أو `EPERM`، فستعيد Node.js محاولة العملية بانتظار خطي متزايد قدره `retryDelay` بالمللي ثانية أطول في كل محاولة. يمثل هذا الخيار عدد المحاولات. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` بقيمة `true`. **الافتراضي:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، قم بإجراء إزالة دليل متكرر. في الوضع المتكرر، تتم إعادة محاولة العمليات عند الفشل. **الافتراضي:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت بالمللي ثانية للانتظار بين عمليات إعادة المحاولة. يتم تجاهل هذا الخيار إذا لم يكن الخيار `recursive` بقيمة `true`. **الافتراضي:** `100`.

يزيل الملفات والأدلة بشكل متزامن (على غرار أداة `rm` القياسية في نظام POSIX). يُرجع `undefined`.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.3.0, v14.17.0 | يقبل خيار `throwIfNoEntry` لتحديد ما إذا كان ينبغي إطلاق استثناء إذا لم يكن الإدخال موجودًا. |
| v10.5.0 | يقبل كائن `options` إضافي لتحديد ما إذا كانت القيم الرقمية التي يتم إرجاعها يجب أن تكون bigint. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن `URL` من WHATWG باستخدام بروتوكول `file:`. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) الذي يتم إرجاعه يجب أن تكون `bigint`. **الافتراضي:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان سيتم إطلاق استثناء إذا لم يكن هناك إدخال نظام ملفات موجود، بدلاً من إرجاع `undefined`. **الافتراضي:** `true`.

- يُرجع: [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats)

يسترجع [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) للمسار.


### ‏`fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**تمت إضافتها في: v19.6.0، v18.15.0**

- `path` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | ‏[\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | ‏[\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` ‏[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` ‏[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت القيم الرقمية في الكائن [\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs) التي تم إرجاعها يجب أن تكون `bigint`. **افتراضي:** ‏`false`.


- الإرجاع: ‏[\<fs.StatFs\>](/ar/nodejs/api/fs#class-fsstatfs)

تزامن [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). يتم إرجاع معلومات حول نظام الملفات المثبت الذي يحتوي على `path`.

في حالة وجود خطأ، سيكون `err.code` واحدًا من [أخطاء النظام الشائعة](/ar/nodejs/api/errors#common-system-errors).

### ‏`fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


:::info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | إذا تُركت وسيطة `type` غير محددة، فستكتشف Node تلقائيًا نوع `target` وتختار `dir` أو `file` تلقائيًا. |
| v7.6.0 | يمكن أن تكون معلمات `target` و`path` كائنات WHATWG ‏`URL` باستخدام بروتوكول `file:`. لا يزال الدعم حاليًا *تجريبيًا*. |
| v0.1.31 | تمت إضافتها في: v0.1.31 |
:::

- `target` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | ‏[\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | ‏[\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `path` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | ‏[\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | ‏[\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `type` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | ‏[\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** ‏`null`

إرجاع `undefined`.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.symlink()`](/ar/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**تمت الإضافة في: الإصدار v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **القيمة الافتراضية:** `0`

يقطع الملف. يعيد `undefined`. يمكن أيضًا تمرير واصف الملف كأول وسيط. في هذه الحالة، يتم استدعاء `fs.ftruncateSync()`.

تجاوز واصف الملف يعتبر مهجورًا وقد يؤدي إلى ظهور خطأ في المستقبل.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v0.1.21 | تمت الإضافة في: الإصدار v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)

متزامن [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2). يعيد `undefined`.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | لم تعد `NaN` و `Infinity` و `-Infinity` محددات زمنية صالحة. |
| v7.6.0 | يمكن أن يكون المعامل `path` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v4.1.0 | السلاسل الرقمية و `NaN` و `Infinity` هي الآن محددات زمنية مسموح بها. |
| v0.4.2 | تمت الإضافة في: الإصدار v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

يعيد `undefined`.

للحصول على معلومات مفصلة، راجع توثيق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.utimes()`](/ar/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0, v20.10.0 | خيار `flush` مدعوم الآن. |
| v19.0.0 | لم يعد دعم تمرير كائن مع دالة `toString` خاصة به إلى المعامل `data`. |
| v17.8.0 | تم إهمال تمرير كائن مع دالة `toString` خاصة به إلى المعامل `data`. |
| v14.12.0 | سيقوم المعامل `data` بتحويل كائن بدالة `toString` صريحة إلى سلسلة نصية. |
| v14.0.0 | لن يقوم المعامل `data` بعد الآن بإجبار المدخلات غير المدعومة إلى سلاسل نصية. |
| v10.10.0 | يمكن أن يكون المعامل `data` الآن أي `TypedArray` أو `DataView`. |
| v7.4.0 | يمكن أن يكون المعامل `data` الآن `Uint8Array`. |
| v5.0.0 | يمكن أن يكون المعامل `file` الآن واصف ملف. |
| v0.1.29 | تمت إضافته في: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم الملف أو واصف الملف
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **افتراضي:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [دعم علامات نظام الملفات](/ar/nodejs/api/fs#file-system-flags). **افتراضي:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تمت كتابة جميع البيانات بنجاح في الملف، وكان `flush` هو `true`، فسيتم استخدام `fs.fsyncSync()` لتدفق البيانات.
  
 

إرجاع `undefined`.

يؤثر خيار `mode` فقط على الملف الذي تم إنشاؤه حديثًا. انظر [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) لمزيد من التفاصيل.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.writeFile()`](/ar/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v14.0.0 | لن يجبر المعامل `buffer` المدخلات غير المدعومة إلى سلاسل بعد الآن. |
| v10.10.0 | يمكن أن يكون المعامل `buffer` الآن أي `TypedArray` أو `DataView`. |
| v7.4.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v7.2.0 | المعاملات `offset` و `length` اختيارية الآن. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المكتوبة.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.write(fd, buffer...)`](/ar/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**تمت الإضافة في: v18.3.0، v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `null`


- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المكتوبة.

للحصول على معلومات مفصلة، راجع وثائق الإصدار غير المتزامن من واجهة برمجة التطبيقات هذه: [`fs.write(fd, buffer...)`](/ar/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v14.0.0 | لن يقوم المعامل `string` بعد الآن بإجبار الإدخال غير المدعوم إلى سلاسل نصية. |
| v7.2.0 | المعامل `position` اختياري الآن. |
| v0.11.5 | أُضيف في: v0.11.5 |
:::

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<فارغ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- `encoding` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
- الإرجاع: [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المكتوبة.

للحصول على معلومات مفصلة، راجع وثائق النسخة غير المتزامنة من هذا الـ API: [`fs.write(fd, string...)`](/ar/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**أُضيف في: v12.9.0**

- `fd` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<فارغ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **الافتراضي:** `null`
- الإرجاع: [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المكتوبة.

للحصول على معلومات مفصلة، راجع وثائق النسخة غير المتزامنة من هذا الـ API: [`fs.writev()`](/ar/nodejs/api/fs#fswritevfd-buffers-position-callback).

## الكائنات الشائعة {#common-objects}

تتم مشاركة الكائنات الشائعة بواسطة جميع متغيرات واجهة برمجة تطبيقات نظام الملفات (الوعد، معاودة الاتصال، والمتزامنة).


### الصنف: `fs.Dir` {#class-fsdir}

**أُضيف في: الإصدار v12.12.0**

صنف يمثل دفق دليل.

تم إنشاؤه بواسطة [`fs.opendir()`](/ar/nodejs/api/fs#fsopendirpath-options-callback) أو [`fs.opendirSync()`](/ar/nodejs/api/fs#fsopendirsyncpath-options) أو [`fsPromises.opendir()`](/ar/nodejs/api/fs#fspromisesopendirpath-options).

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
عند استخدام المكرر غير المتزامن، سيتم إغلاق كائن [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir) تلقائيًا بعد خروج المكرر.

#### `dir.close()` {#dirclose}

**أُضيف في: الإصدار v12.12.0**

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

إغلاق غير متزامن لمقبض المورد الأساسي للدليل. ستؤدي القراءات اللاحقة إلى حدوث أخطاء.

يتم إرجاع وعد سيتحقق بعد إغلاق المورد.

#### `dir.close(callback)` {#dirclosecallback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد اتصال غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.12.0 | أُضيف في: الإصدار v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

إغلاق غير متزامن لمقبض المورد الأساسي للدليل. ستؤدي القراءات اللاحقة إلى حدوث أخطاء.

سيتم استدعاء `callback` بعد إغلاق مقبض المورد.

#### `dir.closeSync()` {#dirclosesync}

**أُضيف في: الإصدار v12.12.0**

إغلاق متزامن لمقبض المورد الأساسي للدليل. ستؤدي القراءات اللاحقة إلى حدوث أخطاء.

#### `dir.path` {#dirpath}

**أُضيف في: الإصدار v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

المسار للقراءة فقط لهذا الدليل كما تم توفيره إلى [`fs.opendir()`](/ar/nodejs/api/fs#fsopendirpath-options-callback) أو [`fs.opendirSync()`](/ar/nodejs/api/fs#fsopendirsyncpath-options) أو [`fsPromises.opendir()`](/ar/nodejs/api/fs#fspromisesopendirpath-options).


#### `dir.read()` {#dirread}

**أُضيف في: v12.12.0**

- القيمة المعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم استيفاءها بـ [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

تقرأ بشكل غير متزامن إدخال الدليل التالي عبر [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) كـ [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent).

يتم إرجاع وعد سيتم استيفاؤه بـ [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent)، أو `null` إذا لم يكن هناك المزيد من إدخالات الدليل للقراءة.

إدخالات الدليل التي يتم إرجاعها بواسطة هذه الدالة ليست بترتيب معين كما هو موفر بواسطة آليات الدليل الأساسية لنظام التشغيل. قد لا يتم تضمين الإدخالات التي تمت إضافتها أو إزالتها أثناء التكرار على الدليل في نتائج التكرار.

#### `dir.read(callback)` {#dirreadcallback}

**أُضيف في: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

تقرأ بشكل غير متزامن إدخال الدليل التالي عبر [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) كـ [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent).

بعد اكتمال القراءة، سيتم استدعاء `callback` مع [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent)، أو `null` إذا لم يكن هناك المزيد من إدخالات الدليل للقراءة.

إدخالات الدليل التي يتم إرجاعها بواسطة هذه الدالة ليست بترتيب معين كما هو موفر بواسطة آليات الدليل الأساسية لنظام التشغيل. قد لا يتم تضمين الإدخالات التي تمت إضافتها أو إزالتها أثناء التكرار على الدليل في نتائج التكرار.

#### `dir.readSync()` {#dirreadsync}

**أُضيف في: v12.12.0**

- القيمة المعادة: [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

تقرأ بشكل متزامن إدخال الدليل التالي كـ [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent). راجع وثائق POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) لمزيد من التفاصيل.

إذا لم يكن هناك المزيد من إدخالات الدليل للقراءة، فسيتم إرجاع `null`.

إدخالات الدليل التي يتم إرجاعها بواسطة هذه الدالة ليست بترتيب معين كما هو موفر بواسطة آليات الدليل الأساسية لنظام التشغيل. قد لا يتم تضمين الإدخالات التي تمت إضافتها أو إزالتها أثناء التكرار على الدليل في نتائج التكرار.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**تمت الإضافة في: v12.12.0**

- الإرجاع: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) مُكرِّر غير متزامن لـ [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent)

يقوم بالتكرار غير المتزامن عبر الدليل حتى يتم قراءة جميع الإدخالات. راجع وثائق POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) لمزيد من التفاصيل.

الإدخالات التي يتم إرجاعها بواسطة المكرر غير المتزامن هي دائمًا [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent). تتم معالجة حالة `null` من `dir.read()` داخليًا.

راجع [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir) للحصول على مثال.

إدخالات الدليل التي يتم إرجاعها بواسطة هذا المكرر ليست بترتيب معين كما توفرها آليات الدليل الأساسية لنظام التشغيل. قد لا يتم تضمين الإدخالات التي تمت إضافتها أو إزالتها أثناء التكرار على الدليل في نتائج التكرار.

### الفئة: `fs.Dirent` {#class-fsdirent}

**تمت الإضافة في: v10.10.0**

تمثيل لإدخال دليل، والذي يمكن أن يكون ملفًا أو دليلًا فرعيًا داخل الدليل، كما يتم إرجاعه عن طريق القراءة من [\<fs.Dir\>](/ar/nodejs/api/fs#class-fsdir). إدخال الدليل هو مزيج من اسم الملف وأزواج نوع الملف.

بالإضافة إلى ذلك، عند استدعاء [`fs.readdir()`](/ar/nodejs/api/fs#fsreaddirpath-options-callback) أو [`fs.readdirSync()`](/ar/nodejs/api/fs#fsreaddirsyncpath-options) مع تعيين الخيار `withFileTypes` على `true`، يتم ملء المصفوفة الناتجة بكائنات [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent)، بدلاً من سلاسل أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)s.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**تمت الإضافة في: v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان كائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف جهاز كتلة.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**تمت الإضافة في: v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان كائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف جهاز أحرف.


#### `dirent.isDirectory()` {#direntisdirectory}

**تمت الإضافة في: الإصدار v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف دليل نظام ملفات.

#### `dirent.isFIFO()` {#direntisfifo}

**تمت الإضافة في: الإصدار v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف أنبوب FIFO (الوارد أولاً يصرف أولاً).

#### `dirent.isFile()` {#direntisfile}

**تمت الإضافة في: الإصدار v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف ملفًا عاديًا.

#### `dirent.isSocket()` {#direntissocket}

**تمت الإضافة في: الإصدار v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف مقبسًا.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**تمت الإضافة في: الإصدار v10.10.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent) يصف رابطًا رمزيًا.

#### `dirent.name` {#direntname}

**تمت الإضافة في: الإصدار v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

اسم الملف الذي يشير إليه الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent). يتم تحديد نوع هذه القيمة بواسطة `options.encoding` التي تم تمريرها إلى [`fs.readdir()`](/ar/nodejs/api/fs#fsreaddirpath-options-callback) أو [`fs.readdirSync()`](/ar/nodejs/api/fs#fsreaddirsyncpath-options).

#### `dirent.parentPath` {#direntparentpath}

**تمت الإضافة في: الإصدار v21.4.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مسار الدليل الأصل للملف الذي يشير إليه الكائن [\<fs.Dirent\>](/ar/nodejs/api/fs#class-fsdirent).


#### `dirent.path` {#direntpath}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.2.0 | لم يعد هذا الخاصية للقراءة فقط. |
| v23.0.0 | الوصول إلى هذه الخاصية يصدر تحذيرًا. الآن هي للقراءة فقط. |
| v21.5.0, v20.12.0, v18.20.0 | مهمل منذ: v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | تمت إضافته في: v20.1.0, v18.17.0 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`dirent.parentPath`](/ar/nodejs/api/fs#direntparentpath) بدلاً من ذلك.
:::

- [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم مستعار لـ `dirent.parentPath`.

### الصنف: `fs.FSWatcher` {#class-fsfswatcher}

**تمت إضافته في: v0.5.8**

- يمتد [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

ستعيد المكالمة الناجحة لطريقة [`fs.watch()`](/ar/nodejs/api/fs#fswatchfilename-options-listener) كائن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) جديد.

تصدر جميع كائنات [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) حدث `'change'` كلما تم تعديل ملف معين تتم مراقبته.

#### الحدث: `'change'` {#event-change}

**تمت إضافته في: v0.5.8**

- `eventType` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع حدث التغيير الذي حدث
- `filename` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) اسم الملف الذي تم تغييره (إذا كان ذا صلة/متاحًا)

يتم إصداره عندما يتغير شيء ما في دليل أو ملف تتم مراقبته. انظر المزيد من التفاصيل في [`fs.watch()`](/ar/nodejs/api/fs#fswatchfilename-options-listener).

قد لا يتم توفير وسيطة `filename` اعتمادًا على دعم نظام التشغيل. إذا تم توفير `filename`، فسيتم توفيره كـ [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إذا تم استدعاء `fs.watch()` مع تعيين خيار `encoding` الخاص به على `'buffer'`، وإلا فسيكون `filename` سلسلة UTF-8.

```js [ESM]
import { watch } from 'node:fs';
// مثال عند التعامل معه من خلال مستمع fs.watch()
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // طباعة: <Buffer ...>
  }
});
```

#### الحدث: `'close'` {#event-close_1}

**تمت إضافته في: v10.0.0**

يتم إطلاقه عندما يتوقف المراقب عن مراقبة التغييرات. يصبح كائن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) المغلق غير قابل للاستخدام في معالج الأحداث.

#### الحدث: `'error'` {#event-error}

**تمت إضافته في: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إطلاقه عند حدوث خطأ أثناء مراقبة الملف. يصبح كائن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) الذي حدث فيه خطأ غير قابل للاستخدام في معالج الأحداث.

#### `watcher.close()` {#watcherclose}

**تمت إضافته في: v0.5.8**

إيقاف مراقبة التغييرات على [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) المحدد. بمجرد إيقافه، يصبح كائن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) غير قابل للاستخدام.

#### `watcher.ref()` {#watcherref}

**تمت إضافته في: v14.3.0, v12.20.0**

- الإرجاع: [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher)

عند استدعائه، يطلب من حلقة أحداث Node.js *عدم* الخروج طالما أن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) نشط. لن يكون لاستدعاء `watcher.ref()` عدة مرات أي تأثير.

افتراضيًا، يتم "الإشارة" إلى جميع كائنات [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher)، مما يجعل استدعاء `watcher.ref()` غير ضروري عادةً ما لم يتم استدعاء `watcher.unref()` مسبقًا.

#### `watcher.unref()` {#watcherunref}

**تمت إضافته في: v14.3.0, v12.20.0**

- الإرجاع: [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher)

عند استدعائه، لن يتطلب كائن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher) النشط أن تظل حلقة أحداث Node.js نشطة. إذا لم يكن هناك نشاط آخر يحافظ على تشغيل حلقة الأحداث، فقد يخرج العملية قبل استدعاء رد نداء الكائن [\<fs.FSWatcher\>](/ar/nodejs/api/fs#class-fsfswatcher). لن يكون لاستدعاء `watcher.unref()` عدة مرات أي تأثير.

### الفئة: `fs.StatWatcher` {#class-fsstatwatcher}

**تمت إضافته في: v14.3.0, v12.20.0**

- يمتد [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

سيؤدي الاستدعاء الناجح لطريقة `fs.watchFile()` إلى إرجاع كائن [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher) جديد.

#### `watcher.ref()` {#watcherref_1}

**تمت إضافته في: v14.3.0, v12.20.0**

- الإرجاع: [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher)

عند استدعائه، يطلب من حلقة أحداث Node.js *عدم* الخروج طالما أن [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher) نشط. لن يكون لاستدعاء `watcher.ref()` عدة مرات أي تأثير.

افتراضيًا، يتم "الإشارة" إلى جميع كائنات [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher)، مما يجعل استدعاء `watcher.ref()` غير ضروري عادةً ما لم يتم استدعاء `watcher.unref()` مسبقًا.


#### `watcher.unref()` {#watcherunref_1}

**أُضيف في:** الإصدار v14.3.0، الإصدار v12.20.0

- يُعيد: [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher)

عند استدعائه، لن يتطلب كائن [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher) النشط حلقة أحداث Node.js لتبقى نشطة. إذا لم يكن هناك نشاط آخر يحافظ على تشغيل حلقة الأحداث، فقد يخرج العملية قبل استدعاء رد نداء كائن [\<fs.StatWatcher\>](/ar/nodejs/api/fs#class-fsstatwatcher). لن يكون لاستدعاء `watcher.unref()` عدة مرات أي تأثير.

### الفئة: `fs.ReadStream` {#class-fsreadstream}

**أُضيف في:** الإصدار v0.1.93

- يمتد: [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)

يتم إنشاء وإرجاع مثيلات [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream) باستخدام الدالة [`fs.createReadStream()`](/ar/nodejs/api/fs#fscreatereadstreampath-options).

#### الحدث: `'close'` {#event-close_2}

**أُضيف في:** الإصدار v0.1.93

يصدر عندما يتم إغلاق واصف الملف الأساسي لـ [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream).

#### الحدث: `'open'` {#event-open}

**أُضيف في:** الإصدار v0.1.93

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف ملف عدد صحيح يستخدمه [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream).

يصدر عندما يتم فتح واصف ملف [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream).

#### الحدث: `'ready'` {#event-ready}

**أُضيف في:** الإصدار v9.11.0

يصدر عندما يكون [\<fs.ReadStream\>](/ar/nodejs/api/fs#class-fsreadstream) جاهزًا للاستخدام.

يتم إطلاقه مباشرة بعد `'open'`.

#### `readStream.bytesRead` {#readstreambytesread}

**أُضيف في:** الإصدار v6.4.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد البايتات التي تمت قراءتها حتى الآن.

#### `readStream.path` {#readstreampath}

**أُضيف في:** الإصدار v0.1.93

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

مسار الملف الذي يقرأ منه الدفق كما هو محدد في الوسيطة الأولى لـ `fs.createReadStream()`. إذا تم تمرير `path` كسلسلة، فسيكون `readStream.path` سلسلة. إذا تم تمرير `path` كـ [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)، فسيكون `readStream.path` هو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer). إذا تم تحديد `fd`، فسيكون `readStream.path` غير معرّف `undefined`.


#### `readStream.pending` {#readstreampending}

**تمت الإضافة في: v11.2.0، v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون هذه الخاصية `true` إذا لم يتم فتح الملف الأساسي بعد، أي قبل انبعاث حدث `'ready'`.

### الفئة: `fs.Stats` {#class-fsstats}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0، v20.13.0 | تم إهمال المُنشئ العام. |
| v8.1.0 | تمت إضافة الأوقات كأرقام. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

يوفر كائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) معلومات حول ملف.

الكائنات التي يتم إرجاعها من [`fs.stat()`](/ar/nodejs/api/fs#fsstatpath-options-callback) و [`fs.lstat()`](/ar/nodejs/api/fs#fslstatpath-options-callback) و [`fs.fstat()`](/ar/nodejs/api/fs#fsfstatfd-options-callback) ونظائرها المتزامنة هي من هذا النوع. إذا كانت `bigint` في `options` التي تم تمريرها إلى هذه الطرق صحيحة، فستكون القيم الرقمية `bigint` بدلاً من `number`، وسيتضمن الكائن خصائص إضافية بدقة نانو ثانية لاحقتها `Ns`. لا يجوز إنشاء كائنات `Stat` مباشرةً باستخدام الكلمة الأساسية `new`.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
إصدار `bigint`:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف جهاز حظر.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف جهاز أحرف.

#### `stats.isDirectory()` {#statsisdirectory}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف دليل نظام ملفات.

إذا تم الحصول على الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) من استدعاء [`fs.lstat()`](/ar/nodejs/api/fs#fslstatpath-options-callback) على رابط رمزي يؤدي إلى دليل، فسوف تُرجع هذه الطريقة `false`. وذلك لأن [`fs.lstat()`](/ar/nodejs/api/fs#fslstatpath-options-callback) تُرجع معلومات حول الرابط الرمزي نفسه وليس المسار الذي يؤدي إليه.

#### `stats.isFIFO()` {#statsisfifo}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف أنبوب أولوية الدخول أولوية الخروج (FIFO).

#### `stats.isFile()` {#statsisfile}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف ملفًا عاديًا.

#### `stats.isSocket()` {#statsissocket}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف مأخذ توصيل.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**أُضيف في: v0.1.10**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كان الكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) يصف رابطًا رمزيًا.

هذه الطريقة صالحة فقط عند استخدام [`fs.lstat()`](/ar/nodejs/api/fs#fslstatpath-options-callback).


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

المعرّف الرقمي للجهاز الذي يحتوي على الملف.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

رقم "Inode" الخاص بالنظام للملف.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

حقل بت يصف نوع الملف ووضعه.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

عدد الروابط الصلبة الموجودة للملف.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

المعرف الرقمي للمستخدم الذي يملك الملف (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

المعرف الرقمي للمجموعة التي تملك الملف (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

معرّف جهاز رقمي إذا كان الملف يمثل جهازًا.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

حجم الملف بالبايت.

إذا كان نظام الملفات الأساسي لا يدعم الحصول على حجم الملف، فسيكون هذا `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

حجم كتلة نظام الملفات لعمليات الإدخال/الإخراج.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

عدد الكتل المخصصة لهذا الملف.

#### `stats.atimeMs` {#statsatimems}

**أضيف في: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

الطابع الزمني الذي يشير إلى آخر مرة تم فيها الوصول إلى هذا الملف معبرًا عنه بالملي ثانية منذ عصر POSIX.

#### `stats.mtimeMs` {#statsmtimems}

**أضيف في: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

الطابع الزمني الذي يشير إلى آخر مرة تم فيها تعديل هذا الملف معبرًا عنه بالملي ثانية منذ عصر POSIX.

#### `stats.ctimeMs` {#statsctimems}

**أضيف في: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

الطابع الزمني الذي يشير إلى آخر مرة تم فيها تغيير حالة الملف معبرًا عنه بالملي ثانية منذ عصر POSIX.

#### `stats.birthtimeMs` {#statsbirthtimems}

**أضيف في: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

الطابع الزمني الذي يشير إلى وقت إنشاء هذا الملف معبرًا عنه بالملي ثانية منذ عصر POSIX.

#### `stats.atimeNs` {#statsatimens}

**أضيف في: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

موجود فقط عند تمرير `bigint: true` إلى الطريقة التي تولد الكائن. الطابع الزمني الذي يشير إلى آخر مرة تم فيها الوصول إلى هذا الملف معبرًا عنه بالنانو ثانية منذ عصر POSIX.


#### `stats.mtimeNs` {#statsmtimens}

**تمت الإضافة في: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

موجود فقط عند تمرير `bigint: true` إلى الطريقة التي تُنشئ الكائن. الطابع الزمني الذي يشير إلى آخر وقت تم فيه تعديل هذا الملف مُعبَّرًا عنه بالنانو ثانية منذ حقبة POSIX.

#### `stats.ctimeNs` {#statsctimens}

**تمت الإضافة في: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

موجود فقط عند تمرير `bigint: true` إلى الطريقة التي تُنشئ الكائن. الطابع الزمني الذي يشير إلى آخر وقت تم فيه تغيير حالة الملف مُعبَّرًا عنه بالنانو ثانية منذ حقبة POSIX.

#### `stats.birthtimeNs` {#statsbirthtimens}

**تمت الإضافة في: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

موجود فقط عند تمرير `bigint: true` إلى الطريقة التي تُنشئ الكائن. الطابع الزمني الذي يشير إلى وقت إنشاء هذا الملف مُعبَّرًا عنه بالنانو ثانية منذ حقبة POSIX.

#### `stats.atime` {#statsatime}

**تمت الإضافة في: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

الطابع الزمني الذي يشير إلى آخر وقت تم فيه الوصول إلى هذا الملف.

#### `stats.mtime` {#statsmtime}

**تمت الإضافة في: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

الطابع الزمني الذي يشير إلى آخر وقت تم فيه تعديل هذا الملف.

#### `stats.ctime` {#statsctime}

**تمت الإضافة في: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

الطابع الزمني الذي يشير إلى آخر وقت تم فيه تغيير حالة الملف.

#### `stats.birthtime` {#statsbirthtime}

**تمت الإضافة في: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

الطابع الزمني الذي يشير إلى وقت إنشاء هذا الملف.

#### قيم وقت الحالة (`Stat time values`) {#stat-time-values}

الخصائص `atimeMs` و `mtimeMs` و `ctimeMs` و `birthtimeMs` هي قيم رقمية تحمل الأوقات المقابلة بالمللي ثانية. دقتها خاصة بالنظام الأساسي. عند تمرير `bigint: true` إلى الطريقة التي تُنشئ الكائن، ستكون الخصائص عبارة عن [bigints](https://tc39.github.io/proposal-bigint)، وإلا ستكون [أرقامًا](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

الخصائص `atimeNs` و `mtimeNs` و `ctimeNs` و `birthtimeNs` هي [bigints](https://tc39.github.io/proposal-bigint) تحمل الأوقات المقابلة بالنانو ثانية. وهي موجودة فقط عند تمرير `bigint: true` إلى الطريقة التي تُنشئ الكائن. دقتها خاصة بالنظام الأساسي.

`atime` و `mtime` و `ctime` و `birthtime` هي تمثيلات بديلة لكائن [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) للأوقات المختلفة. قيم `Date` والرقم غير متصلة. لن ينعكس تعيين قيمة رقمية جديدة، أو تغيير قيمة `Date`، في التمثيل البديل المقابل.

الأوقات في كائن الحالة لها الدلالات التالية:

- `atime` "وقت الوصول": الوقت الذي تم فيه آخر وصول إلى بيانات الملف. يتم تغييره بواسطة استدعاءات النظام [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2) و [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) و [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "وقت التعديل": الوقت الذي تم فيه آخر تعديل لبيانات الملف. يتم تغييره بواسطة استدعاءات النظام [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2) و [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) و [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "وقت التغيير": الوقت الذي تم فيه آخر تغيير لحالة الملف (تعديل بيانات inode). يتم تغييره بواسطة استدعاءات النظام [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) و [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) و [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) و [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2) و [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) و [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) و [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) و [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) و [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "وقت الإنشاء": وقت إنشاء الملف. يتم تعيينه مرة واحدة عند إنشاء الملف. في أنظمة الملفات حيث يكون وقت الإنشاء غير متوفر، قد يحتوي هذا الحقل بدلاً من ذلك على `ctime` أو `1970-01-01T00:00Z` (أي، الطابع الزمني لحقبة Unix `0`). قد تكون هذه القيمة أكبر من `atime` أو `mtime` في هذه الحالة. في Darwin ومتغيرات FreeBSD الأخرى، يتم تعيينه أيضًا إذا تم تعيين `atime` صراحةً إلى قيمة سابقة لوقت `birthtime` الحالي باستخدام استدعاء النظام [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2).

قبل Node.js 0.12، كان `ctime` يحمل `birthtime` على أنظمة Windows. اعتبارًا من 0.12، `ctime` ليس "وقت الإنشاء"، ولم يكن كذلك أبدًا على أنظمة Unix.


### الفئة: `fs.StatFs` {#class-fsstatfs}

**أُضيفت في: الإصدار 19.6.0، و 18.15.0**

توفِّر معلومات حول نظام ملفات مُثبَّت.

الكائنات المُعادة من [`fs.statfs()`](/ar/nodejs/api/fs#fsstatfspath-options-callback) ونظيرتها المتزامنة هي من هذا النوع. إذا كان `bigint` في `options` التي تم تمريرها إلى تلك الطرق هو `true`، فستكون القيم الرقمية `bigint` بدلاً من `number`.

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
نسخة `bigint`:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**أُضيفت في: الإصدار 19.6.0، و 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

كتل حرة متاحة للمستخدمين غير المتميزين.

#### `statfs.bfree` {#statfsbfree}

**أُضيفت في: الإصدار 19.6.0، و 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

كتل حرة في نظام الملفات.

#### `statfs.blocks` {#statfsblocks}

**أُضيفت في: الإصدار 19.6.0، و 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

إجمالي كتل البيانات في نظام الملفات.

#### `statfs.bsize` {#statfsbsize}

**أُضيفت في: الإصدار 19.6.0، و 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

حجم كتلة النقل الأمثل.

#### `statfs.ffree` {#statfsffree}

**أُضيفت في: الإصدار 19.6.0، و 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

عقد الملفات الحرة في نظام الملفات.


#### `statfs.files` {#statfsfiles}

**أضيف في: الإصدار 19.6.0، الإصدار 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

إجمالي عدد عقد الملفات في نظام الملفات.

#### `statfs.type` {#statfstype}

**أضيف في: الإصدار 19.6.0، الإصدار 18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

نوع نظام الملفات.

### الصنف: `fs.WriteStream` {#class-fswritestream}

**أضيف في: الإصدار 0.1.93**

- يمتد [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)

يتم إنشاء وإرجاع نسخ [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream) باستخدام الدالة [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options).

#### الحدث: `'close'` {#event-close_3}

**أضيف في: الإصدار 0.1.93**

يصدر عندما يتم إغلاق واصف الملف الأساسي لـ [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream).

#### الحدث: `'open'` {#event-open_1}

**أضيف في: الإصدار 0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف ملف عدد صحيح تستخدمه [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream).

يصدر عندما يتم فتح ملف [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream).

#### الحدث: `'ready'` {#event-ready_1}

**أضيف في: الإصدار 9.11.0**

يصدر عندما يكون [\<fs.WriteStream\>](/ar/nodejs/api/fs#class-fswritestream) جاهزًا للاستخدام.

يطلق مباشرة بعد `'open'`.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**أضيف في: الإصدار 0.4.7**

عدد البايتات التي تمت كتابتها حتى الآن. لا يتضمن البيانات التي لا تزال في قائمة الانتظار للكتابة.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**أضيف في: الإصدار 0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



يغلق `writeStream`. يقبل اختياريًا رد نداء سيتم تنفيذه بمجرد إغلاق `writeStream`.


#### `writeStream.path` {#writestreampath}

**أضيف في: v0.1.93**

المسار إلى الملف الذي يكتب إليه الدفق كما هو محدد في الوسيطة الأولى لـ [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options). إذا تم تمرير `path` كسلسلة، فسيكون `writeStream.path` سلسلة. إذا تم تمرير `path` كـ [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)، فسيكون `writeStream.path` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**أضيف في: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون هذه الخاصية `true` إذا لم يتم فتح الملف الأساسي بعد، أي قبل انبعاث حدث `'ready'`.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع كائن يحتوي على الثوابت شائعة الاستخدام لعمليات نظام الملفات.

#### ثوابت FS {#fs-constants}

يتم تصدير الثوابت التالية بواسطة `fs.constants` و `fsPromises.constants`.

لن يكون كل ثابت متاحًا على كل نظام تشغيل؛ هذا مهم بشكل خاص لنظام التشغيل Windows، حيث لا تتوفر العديد من التعريفات الخاصة بـ POSIX. بالنسبة للتطبيقات المحمولة، يوصى بالتحقق من وجودها قبل الاستخدام.

لاستخدام أكثر من ثابت واحد، استخدم عامل التشغيل OR الثنائي `|`.

مثال:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### ثوابت الوصول إلى الملف {#file-access-constants}

الثوابت التالية مخصصة للاستخدام كمعامل `mode` الذي تم تمريره إلى [`fsPromises.access()`](/ar/nodejs/api/fs#fspromisesaccesspath-mode) و [`fs.access()`](/ar/nodejs/api/fs#fsaccesspath-mode-callback) و [`fs.accessSync()`](/ar/nodejs/api/fs#fsaccesssyncpath-mode).

| ثابت | الوصف |
| --- | --- |
| `F_OK` | علامة تشير إلى أن الملف مرئي للعملية المستدعِية. هذا مفيد لتحديد ما إذا كان الملف موجودًا، ولكنه لا يقول شيئًا عن أذونات `rwx`. الافتراضي إذا لم يتم تحديد أي وضع. |
| `R_OK` | علامة تشير إلى أنه يمكن قراءة الملف بواسطة العملية المستدعِية. |
| `W_OK` | علامة تشير إلى أنه يمكن كتابة الملف بواسطة العملية المستدعِية. |
| `X_OK` | علامة تشير إلى أنه يمكن تنفيذ الملف بواسطة العملية المستدعِية. ليس لهذا أي تأثير على نظام التشغيل Windows (سيتصرف مثل `fs.constants.F_OK`). |
التعريفات متاحة أيضًا على نظام التشغيل Windows.


##### ثوابت نسخ الملفات {#file-copy-constants}

الثوابت التالية مخصصة للاستخدام مع [`fs.copyFile()`](/ar/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).

| ثابت | الوصف |
| --- | --- |
| `COPYFILE_EXCL` | في حالة وجوده، ستفشل عملية النسخ مع وجود خطأ إذا كان مسار الوجهة موجودًا بالفعل. |
| `COPYFILE_FICLONE` | في حالة وجوده، ستحاول عملية النسخ إنشاء إعادة ارتباط نسخ عند الكتابة. إذا كانت المنصة الأساسية لا تدعم النسخ عند الكتابة، فسيتم استخدام آلية نسخ احتياطية. |
| `COPYFILE_FICLONE_FORCE` | في حالة وجوده، ستحاول عملية النسخ إنشاء إعادة ارتباط نسخ عند الكتابة. إذا كانت المنصة الأساسية لا تدعم النسخ عند الكتابة، فستفشل العملية مع وجود خطأ. |
التعريفات متاحة أيضًا على نظام التشغيل Windows.

##### ثوابت فتح الملفات {#file-open-constants}

الثوابت التالية مخصصة للاستخدام مع `fs.open()`.

| ثابت | الوصف |
| --- | --- |
| `O_RDONLY` | علامة تشير إلى فتح ملف للوصول للقراءة فقط. |
| `O_WRONLY` | علامة تشير إلى فتح ملف للوصول للكتابة فقط. |
| `O_RDWR` | علامة تشير إلى فتح ملف للوصول للقراءة والكتابة. |
| `O_CREAT` | علامة تشير إلى إنشاء الملف إذا لم يكن موجودًا بالفعل. |
| `O_EXCL` | علامة تشير إلى أن فتح ملف يجب أن يفشل إذا تم تعيين العلامة `O_CREAT` وكان الملف موجودًا بالفعل. |
| `O_NOCTTY` | علامة تشير إلى أنه إذا كان المسار يحدد جهاز طرفي، فإن فتح المسار لا يجب أن يتسبب في أن يصبح هذا الطرفي هو الطرفي المتحكم في العملية (إذا لم يكن لدى العملية بالفعل واحد). |
| `O_TRUNC` | علامة تشير إلى أنه إذا كان الملف موجودًا وكان ملفًا عاديًا، وتم فتح الملف بنجاح للوصول للكتابة، فسيتم اقتطاع طوله إلى الصفر. |
| `O_APPEND` | علامة تشير إلى أنه سيتم إلحاق البيانات بنهاية الملف. |
| `O_DIRECTORY` | علامة تشير إلى أن الفتح يجب أن يفشل إذا لم يكن المسار عبارة عن دليل. |
| `O_NOATIME` | علامة تشير إلى أن قراءة الوصول إلى نظام الملفات لن تؤدي بعد ذلك إلى تحديث معلومات `atime` المرتبطة بالملف. هذه العلامة متاحة فقط على أنظمة تشغيل Linux. |
| `O_NOFOLLOW` | علامة تشير إلى أن الفتح يجب أن يفشل إذا كان المسار عبارة عن رابط رمزي. |
| `O_SYNC` | علامة تشير إلى أن الملف مفتوح للإدخال والإخراج المتزامنين مع عمليات الكتابة التي تنتظر سلامة الملف. |
| `O_DSYNC` | علامة تشير إلى أن الملف مفتوح للإدخال والإخراج المتزامنين مع عمليات الكتابة التي تنتظر سلامة البيانات. |
| `O_SYMLINK` | علامة تشير إلى فتح الرابط الرمزي نفسه بدلاً من المورد الذي يشير إليه. |
| `O_DIRECT` | عند التعيين، سيتم بذل محاولة لتقليل تأثيرات التخزين المؤقت لملف الإدخال والإخراج. |
| `O_NONBLOCK` | علامة تشير إلى فتح الملف في وضع عدم الحظر عندما يكون ذلك ممكنًا. |
| `UV_FS_O_FILEMAP` | عند التعيين، يتم استخدام تعيين ملف الذاكرة للوصول إلى الملف. هذه العلامة متاحة فقط على أنظمة تشغيل Windows. على أنظمة التشغيل الأخرى، يتم تجاهل هذه العلامة. |
في نظام التشغيل Windows، تتوفر فقط `O_APPEND` و `O_CREAT` و `O_EXCL` و `O_RDONLY` و `O_RDWR` و `O_TRUNC` و `O_WRONLY` و `UV_FS_O_FILEMAP`.


##### ثوابت نوع الملف {#file-type-constants}

تهدف الثوابت التالية للاستخدام مع خاصية `mode` للكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) لتحديد نوع الملف.

| ثابت | الوصف |
| --- | --- |
| `S_IFMT` | قناع بت يستخدم لاستخراج رمز نوع الملف. |
| `S_IFREG` | ثابت نوع الملف لملف عادي. |
| `S_IFDIR` | ثابت نوع الملف لدليل. |
| `S_IFCHR` | ثابت نوع الملف لملف جهاز موجه بالأحرف. |
| `S_IFBLK` | ثابت نوع الملف لملف جهاز موجه بالكتل. |
| `S_IFIFO` | ثابت نوع الملف لـ FIFO/pipe. |
| `S_IFLNK` | ثابت نوع الملف لوصلة رمزية. |
| `S_IFSOCK` | ثابت نوع الملف لمقبس. |
في Windows، تتوفر `S_IFCHR` و `S_IFDIR` و `S_IFLNK` و `S_IFMT` و `S_IFREG` فقط.

##### ثوابت وضع الملف {#file-mode-constants}

تهدف الثوابت التالية للاستخدام مع خاصية `mode` للكائن [\<fs.Stats\>](/ar/nodejs/api/fs#class-fsstats) لتحديد أذونات الوصول لملف.

| ثابت | الوصف |
| --- | --- |
| `S_IRWXU` | وضع الملف يشير إلى قابلية القراءة والكتابة والتنفيذ من قبل المالك. |
| `S_IRUSR` | وضع الملف يشير إلى قابلية القراءة من قبل المالك. |
| `S_IWUSR` | وضع الملف يشير إلى قابلية الكتابة من قبل المالك. |
| `S_IXUSR` | وضع الملف يشير إلى قابلية التنفيذ من قبل المالك. |
| `S_IRWXG` | وضع الملف يشير إلى قابلية القراءة والكتابة والتنفيذ من قبل المجموعة. |
| `S_IRGRP` | وضع الملف يشير إلى قابلية القراءة من قبل المجموعة. |
| `S_IWGRP` | وضع الملف يشير إلى قابلية الكتابة من قبل المجموعة. |
| `S_IXGRP` | وضع الملف يشير إلى قابلية التنفيذ من قبل المجموعة. |
| `S_IRWXO` | وضع الملف يشير إلى قابلية القراءة والكتابة والتنفيذ من قبل الآخرين. |
| `S_IROTH` | وضع الملف يشير إلى قابلية القراءة من قبل الآخرين. |
| `S_IWOTH` | وضع الملف يشير إلى قابلية الكتابة من قبل الآخرين. |
| `S_IXOTH` | وضع الملف يشير إلى قابلية التنفيذ من قبل الآخرين. |
في Windows، تتوفر `S_IRUSR` و `S_IWUSR` فقط.

## ملاحظات {#notes}

### ترتيب عمليات الاستدعاء والوعد {#ordering-of-callback-and-promise-based-operations}

نظرًا لأنها تُنفذ بشكل غير متزامن بواسطة تجمع مؤشرات الترابط الأساسي، فلا يوجد ترتيب مضمون عند استخدام أي من طرق الاستدعاء أو الطرق المستندة إلى الوعد.

على سبيل المثال، ما يلي عرضة للخطأ لأن عملية `fs.stat()` قد تكتمل قبل عملية `fs.rename()`:

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
من المهم ترتيب العمليات بشكل صحيح عن طريق انتظار نتائج إحداها قبل استدعاء الأخرى:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

أو، عند استخدام واجهات برمجة تطبيقات الاستدعاء، انقل استدعاء `fs.stat()` إلى الاستدعاء الخلفي لعملية `fs.rename()`:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### مسارات الملفات {#file-paths}

تقبل معظم عمليات `fs` مسارات الملفات التي يمكن تحديدها في شكل سلسلة نصية أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو كائن [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) باستخدام بروتوكول `file:`.

#### مسارات السلاسل النصية {#string-paths}

تُفسر مسارات السلاسل النصية على أنها تسلسلات أحرف UTF-8 تحدد اسم الملف المطلق أو النسبي. سيتم حل المسارات النسبية بالنسبة لدليل العمل الحالي كما هو محدد عن طريق استدعاء `process.cwd()`.

مثال على استخدام مسار مطلق على نظام POSIX:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // افعل شيئًا بالملف
} finally {
  await fd?.close();
}
```
مثال على استخدام مسار نسبي على نظام POSIX (بالنسبة إلى `process.cwd()`):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // افعل شيئًا بالملف
} finally {
  await fd?.close();
}
```
#### مسارات URL للملف {#file-url-paths}

**تمت إضافتها في: v7.6.0**

بالنسبة لمعظم وظائف وحدة `node:fs`، يمكن تمرير وسيطة `path` أو `filename` ككائن [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) باستخدام بروتوكول `file:`.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
دائمًا ما تكون عناوين URL من النوع `file:` عبارة عن مسارات مطلقة.

##### اعتبارات خاصة بالنظام الأساسي {#platform-specific-considerations}

في نظام التشغيل Windows، يتم تحويل [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي تحمل اسم مضيف إلى مسارات UNC، بينما يتم تحويل [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي تحمل أحرف محركات أقراص إلى مسارات مطلقة محلية. ستؤدي [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي لا تحمل اسم مضيف ولا حرف محرك أقراص إلى حدوث خطأ:

```js [ESM]
import { readFileSync } from 'node:fs';
// على نظام التشغيل Windows:

// - يتم تحويل عناوين URL لملفات WHATWG التي تحمل اسم مضيف إلى مسار UNC
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - يتم تحويل عناوين URL لملفات WHATWG التي تحمل أحرف محركات أقراص إلى مسار مطلق
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - يجب أن تحتوي عناوين URL لملفات WHATWG التي لا تحمل اسم مضيف على أحرف محركات أقراص
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: يجب أن يكون مسار عنوان URL للملف مطلقًا
```
يجب أن تستخدم [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي تحمل أحرف محركات أقراص `:` كفاصل مباشرة بعد حرف محرك الأقراص. سيؤدي استخدام فاصل آخر إلى حدوث خطأ.

في جميع الأنظمة الأساسية الأخرى، فإن [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي تحمل اسم مضيف غير مدعومة وستؤدي إلى حدوث خطأ:

```js [ESM]
import { readFileSync } from 'node:fs';
// على الأنظمة الأساسية الأخرى:

// - عناوين URL لملفات WHATWG التي تحمل اسم مضيف غير مدعومة
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: يجب أن يكون مطلقًا

// - يتم تحويل عناوين URL لملفات WHATWG إلى مسار مطلق
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
سيؤدي [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي تحتوي على أحرف شرطة مائلة مشفرة إلى حدوث خطأ على جميع الأنظمة الأساسية:

```js [ESM]
import { readFileSync } from 'node:fs';

// على نظام التشغيل Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: يجب ألا يشتمل مسار عنوان URL للملف على أحرف
\ أو / مشفرة */

// على نظام POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: يجب ألا يشتمل مسار عنوان URL للملف على أحرف
/ مشفرة */
```
في نظام التشغيل Windows، سيؤدي [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) من النوع `file:` التي تحتوي على شرطة مائلة عكسية مشفرة إلى حدوث خطأ:

```js [ESM]
import { readFileSync } from 'node:fs';

// على نظام التشغيل Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: يجب ألا يشتمل مسار عنوان URL للملف على أحرف
\ أو / مشفرة */
```

#### مسارات المخزن المؤقت {#buffer-paths}

تعد المسارات المحددة باستخدام [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مفيدة بشكل أساسي في بعض أنظمة تشغيل POSIX التي تتعامل مع مسارات الملفات كسلاسل بايت مبهمة. في مثل هذه الأنظمة، من الممكن أن يحتوي مسار ملف واحد على تسلسلات فرعية تستخدم ترميزات أحرف متعددة. كما هو الحال مع مسارات السلاسل، قد تكون مسارات [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) نسبية أو مطلقة:

مثال باستخدام مسار مطلق على نظام POSIX:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```
#### دلائل العمل لكل محرك أقراص على نظام Windows {#per-drive-working-directories-on-windows}

في نظام Windows، يتبع Node.js مفهوم دليل العمل لكل محرك أقراص. يمكن ملاحظة هذا السلوك عند استخدام مسار محرك أقراص بدون شرطة مائلة عكسية. على سبيل المثال، يمكن أن تُرجع `fs.readdirSync('C:\\')` نتيجة مختلفة عن `fs.readdirSync('C:')`. لمزيد من المعلومات، راجع [صفحة MSDN هذه](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### واصفات الملفات {#file-descriptors_1}

في أنظمة POSIX، يحتفظ kernel لكل عملية بجدول للملفات والموارد المفتوحة حاليًا. يتم تعيين مُعرّف رقمي بسيط لكل ملف مفتوح يسمى *واصف الملف*. على مستوى النظام، تستخدم جميع عمليات نظام الملفات واصفات الملفات هذه لتحديد وتتبع كل ملف محدد. تستخدم أنظمة Windows آلية مختلفة ولكنها متشابهة من الناحية المفاهيمية لتتبع الموارد. لتبسيط الأمور على المستخدمين، يقوم Node.js بتجريد الاختلافات بين أنظمة التشغيل ويعين واصف ملف رقمي لجميع الملفات المفتوحة.

تقوم الأساليب القائمة على رد الاتصال `fs.open()` والمتزامنة `fs.openSync()` بفتح ملف وتخصيص واصف ملف جديد. بمجرد التخصيص، يمكن استخدام واصف الملف لقراءة البيانات من الملف أو الكتابة فيه أو طلب معلومات حول الملف.

تقيد أنظمة التشغيل عدد واصفات الملفات التي يمكن فتحها في أي وقت معين، لذلك من الضروري إغلاق الواصف عند اكتمال العمليات. سيؤدي عدم القيام بذلك إلى حدوث تسرب للذاكرة سيؤدي في النهاية إلى تعطل التطبيق.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
تستخدم واجهات برمجة التطبيقات المستندة إلى الوعد كائن [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) بدلاً من واصف الملف الرقمي. تتم إدارة هذه الكائنات بشكل أفضل بواسطة النظام لضمان عدم تسريب الموارد. ومع ذلك، لا يزال من المطلوب إغلاقها عند اكتمال العمليات:

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
```

### استخدام تجمع الخيوط {#threadpool-usage}

تستخدم جميع واجهات برمجة تطبيقات نظام الملفات المستندة إلى معاودة الاتصال والوعد (باستثناء `fs.FSWatcher()`) تجمع الخيوط الخاص بـ libuv. قد يكون لهذا آثار أداء مفاجئة وسلبية لبعض التطبيقات. راجع وثائق [`UV_THREADPOOL_SIZE`](/ar/nodejs/api/cli#uv_threadpool_sizesize) لمزيد من المعلومات.

### علامات نظام الملفات {#file-system-flags}

العلامات التالية متاحة أينما تأخذ خيار `flag` سلسلة.

-  `'a'`: فتح الملف للإلحاق. يتم إنشاء الملف إذا لم يكن موجودًا.
-  `'ax'`: مثل `'a'` لكن يفشل إذا كان المسار موجودًا.
-  `'a+'`: فتح الملف للقراءة والإلحاق. يتم إنشاء الملف إذا لم يكن موجودًا.
-  `'ax+'`: مثل `'a+'` لكن يفشل إذا كان المسار موجودًا.
-  `'as'`: فتح الملف للإلحاق في الوضع المتزامن. يتم إنشاء الملف إذا لم يكن موجودًا.
-  `'as+'`: فتح الملف للقراءة والإلحاق في الوضع المتزامن. يتم إنشاء الملف إذا لم يكن موجودًا.
-  `'r'`: فتح الملف للقراءة. يحدث استثناء إذا كان الملف غير موجود.
-  `'rs'`: فتح الملف للقراءة في الوضع المتزامن. يحدث استثناء إذا كان الملف غير موجود.
-  `'r+'`: فتح الملف للقراءة والكتابة. يحدث استثناء إذا كان الملف غير موجود.
-  `'rs+'`: فتح الملف للقراءة والكتابة في الوضع المتزامن. يوجه نظام التشغيل لتجاوز ذاكرة التخزين المؤقت لنظام الملفات المحلي. هذا مفيد بشكل أساسي لفتح الملفات على تركيبات NFS لأنه يسمح بتخطي ذاكرة التخزين المؤقت المحلية التي يحتمل أن تكون قديمة. له تأثير حقيقي للغاية على أداء الإدخال/الإخراج، لذا لا يوصى باستخدام هذه العلامة إلا إذا كانت هناك حاجة إليها. هذا لا يحول `fs.open()` أو `fsPromises.open()` إلى استدعاء حظر متزامن. إذا كانت العملية المتزامنة مرغوبة، فيجب استخدام شيء مثل `fs.openSync()`.
-  `'w'`: فتح الملف للكتابة. يتم إنشاء الملف (إذا لم يكن موجودًا) أو اقتطاعه (إذا كان موجودًا).
-  `'wx'`: مثل `'w'` لكن يفشل إذا كان المسار موجودًا.
-  `'w+'`: فتح الملف للقراءة والكتابة. يتم إنشاء الملف (إذا لم يكن موجودًا) أو اقتطاعه (إذا كان موجودًا).
-  `'wx+'`: مثل `'w+'` لكن يفشل إذا كان المسار موجودًا.

يمكن أن تكون `flag` أيضًا رقمًا كما هو موثق في [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)؛ الثوابت المستخدمة بشكل شائع متاحة من `fs.constants`. على نظام التشغيل Windows، تتم ترجمة العلامات إلى العلامات المكافئة لها حيثما ينطبق ذلك، على سبيل المثال، `O_WRONLY` إلى `FILE_GENERIC_WRITE`، أو `O_EXCL|O_CREAT` إلى `CREATE_NEW`، كما هو مقبول بواسطة `CreateFileW`.

تتسبب العلامة الحصرية `'x'` (علامة `O_EXCL` في [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) في إرجاع العملية لخطأ إذا كان المسار موجودًا بالفعل. على نظام POSIX، إذا كان المسار عبارة عن رابط رمزي، فإن استخدام `O_EXCL` يُرجع خطأً حتى إذا كان الرابط يشير إلى مسار غير موجود. قد لا تعمل العلامة الحصرية مع أنظمة ملفات الشبكة.

في نظام Linux، لا تعمل الكتابات الموضعية عندما يتم فتح الملف في وضع الإلحاق. تتجاهل kernel وسيطة الموضع وتلحق دائمًا البيانات بنهاية الملف.

قد يتطلب تعديل ملف بدلاً من استبداله تعيين خيار `flag` على `'r+'` بدلاً من الوضع الافتراضي `'w'`.

يختلف سلوك بعض العلامات باختلاف النظام الأساسي. على هذا النحو، سيؤدي فتح دليل على نظامي التشغيل macOS و Linux بالعلامة `'a+'`، كما في المثال أدناه، إلى إرجاع خطأ. في المقابل، على نظامي التشغيل Windows و FreeBSD، سيتم إرجاع واصف ملف أو `FileHandle`.

```js [ESM]
// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```

على نظام التشغيل Windows، سيؤدي فتح ملف مخفي موجود باستخدام العلامة `'w'` (سواء من خلال `fs.open()` أو `fs.writeFile()` أو `fsPromises.open()`) إلى الفشل مع `EPERM`. يمكن فتح الملفات المخفية الموجودة للكتابة باستخدام العلامة `'r+'`.

يمكن استخدام استدعاء `fs.ftruncate()` أو `filehandle.truncate()` لإعادة تعيين محتويات الملف.

