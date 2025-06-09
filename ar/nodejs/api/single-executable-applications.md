---
title: تطبيقات Node.js القابلة للتنفيذ الفردي
description: تعلم كيفية إنشاء وإدارة التطبيقات القابلة للتنفيذ الفردي باستخدام Node.js، بما في ذلك كيفية تجميع تطبيقك، وإدارة التبعيات، ومعالجة اعتبارات الأمان.
head:
  - - meta
    - name: og:title
      content: تطبيقات Node.js القابلة للتنفيذ الفردي | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية إنشاء وإدارة التطبيقات القابلة للتنفيذ الفردي باستخدام Node.js، بما في ذلك كيفية تجميع تطبيقك، وإدارة التبعيات، ومعالجة اعتبارات الأمان.
  - - meta
    - name: twitter:title
      content: تطبيقات Node.js القابلة للتنفيذ الفردي | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية إنشاء وإدارة التطبيقات القابلة للتنفيذ الفردي باستخدام Node.js، بما في ذلك كيفية تجميع تطبيقك، وإدارة التبعيات، ومعالجة اعتبارات الأمان.
---


# تطبيقات قابلة للتنفيذ المفردة {#single-executable-applications}


::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v20.6.0 | تمت إضافة دعم "useSnapshot". |
| v20.6.0 | تمت إضافة دعم "useCodeCache". |
| v19.7.0, v18.16.0 | تمت إضافتها في: v19.7.0, v18.16.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

**كود المصدر:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

تتيح هذه الميزة توزيع تطبيق Node.js بسهولة على نظام لا يحتوي على Node.js مثبتًا.

يدعم Node.js إنشاء [تطبيقات قابلة للتنفيذ المفردة](https://github.com/nodejs/single-executable) عن طريق السماح بحقن كتلة مُعدة بواسطة Node.js، والتي يمكن أن تحتوي على نص برمجي مجمّع، في ثنائي `node`. أثناء بدء التشغيل، يتحقق البرنامج مما إذا كان قد تم حقن أي شيء. إذا تم العثور على الكتلة، فإنه ينفذ النص البرمجي الموجود في الكتلة. بخلاف ذلك، يعمل Node.js كما يفعل عادةً.

تدعم ميزة التطبيق القابل للتنفيذ المفرد حاليًا تشغيل نص برمجي مضمن واحد فقط باستخدام نظام الوحدة [CommonJS](/ar/nodejs/api/modules#modules-commonjs-modules).

يمكن للمستخدمين إنشاء تطبيق قابل للتنفيذ المفرد من النص البرمجي المجمّع الخاص بهم باستخدام ثنائي `node` نفسه وأي أداة يمكنها حقن الموارد في الثنائي.

فيما يلي خطوات إنشاء تطبيق قابل للتنفيذ المفرد باستخدام إحدى هذه الأدوات، [postject](https://github.com/nodejs/postject):

## إنشاء كتل تحضير قابلة للتنفيذ المفردة {#generating-single-executable-preparation-blobs}

يمكن إنشاء كتل تحضير قابلة للتنفيذ المفردة التي يتم حقنها في التطبيق باستخدام علامة `--experimental-sea-config` لثنائي Node.js الذي سيتم استخدامه لإنشاء التنفيذ القابل للتنفيذ المفرد. تأخذ مسارًا إلى ملف تكوين بتنسيق JSON. إذا لم يكن المسار الذي تم تمريره إليه مطلقًا، فسيستخدم Node.js المسار نسبيًا إلى دليل العمل الحالي.

يقرأ التكوين حاليًا الحقول ذات المستوى الأعلى التالية:

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // افتراضي: false
  "useSnapshot": false,  // افتراضي: false
  "useCodeCache": true, // افتراضي: false
  "assets": {  // اختياري
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
إذا لم تكن المسارات مطلقة، فسيستخدم Node.js المسار نسبيًا إلى دليل العمل الحالي. يجب أن يكون إصدار ثنائي Node.js المستخدم لإنتاج الكتلة هو نفسه الإصدار الذي سيتم حقن الكتلة فيه.

ملاحظة: عند إنشاء SEAs متعددة المنصات (على سبيل المثال، إنشاء SEA لـ `linux-x64` على `darwin-arm64`)، يجب تعيين `useCodeCache` و `useSnapshot` على false لتجنب إنشاء ملفات تنفيذية غير متوافقة. نظرًا لأنه لا يمكن تحميل ذاكرة التخزين المؤقت للكود واللقطات إلا على نفس النظام الأساسي الذي تم تجميعها عليه، فقد يتعطل التنفيذ الذي تم إنشاؤه عند بدء التشغيل عند محاولة تحميل ذاكرة التخزين المؤقت للكود أو اللقطات التي تم إنشاؤها على نظام أساسي مختلف.


### الأصول {#assets}

يمكن للمستخدمين تضمين الأصول عن طريق إضافة قاموس مفتاح-مسار إلى التكوين كحقل `assets`. في وقت الإنشاء، سيقرأ Node.js الأصول من المسارات المحددة ويحزمها في نقطة التحضير الثنائية الكبيرة (blob). في الملف التنفيذي الذي تم إنشاؤه، يمكن للمستخدمين استرداد الأصول باستخدام واجهات برمجة التطبيقات [`sea.getAsset()`](/ar/nodejs/api/single-executable-applications#seagetassetkey-encoding) و [`sea.getAssetAsBlob()`](/ar/nodejs/api/single-executable-applications#seagetassetasblobkey-options).

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
يمكن للتطبيق ذي الملف التنفيذي الواحد الوصول إلى الأصول على النحو التالي:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// يُرجع نسخة من البيانات في ArrayBuffer.
const image = getAsset('a.jpg');
// يُرجع سلسلة تم فك ترميزها من الأصل بتنسيق UTF8.
const text = getAsset('b.txt', 'utf8');
// يُرجع Blob يحتوي على الأصل.
const blob = getAssetAsBlob('a.jpg');
// يُرجع ArrayBuffer يحتوي على الأصل الخام دون نسخ.
const raw = getRawAsset('a.jpg');
```
راجع وثائق واجهات برمجة التطبيقات [`sea.getAsset()`](/ar/nodejs/api/single-executable-applications#seagetassetkey-encoding) و [`sea.getAssetAsBlob()`](/ar/nodejs/api/single-executable-applications#seagetassetasblobkey-options) و [`sea.getRawAsset()`](/ar/nodejs/api/single-executable-applications#seagetrawassetkey) لمزيد من المعلومات.

### دعم لقطة بدء التشغيل {#startup-snapshot-support}

يمكن استخدام الحقل `useSnapshot` لتمكين دعم لقطة بدء التشغيل. في هذه الحالة، لن يتم تشغيل البرنامج النصي `main` عند إطلاق الملف التنفيذي النهائي. بدلاً من ذلك، سيتم تشغيله عند إنشاء نقطة التحضير الثنائية الكبيرة (blob) لتطبيق الملف التنفيذي الواحد على جهاز الإنشاء. ستتضمن نقطة التحضير الثنائية الكبيرة (blob) التي تم إنشاؤها بعد ذلك لقطة تلتقط الحالات التي تم تهيئتها بواسطة البرنامج النصي `main`. سيقوم الملف التنفيذي النهائي مع نقطة التحضير الثنائية الكبيرة (blob) المحقونة بإلغاء تسلسل اللقطة في وقت التشغيل.

عندما تكون `useSnapshot` صحيحة، يجب أن يستدعي البرنامج النصي الرئيسي واجهة برمجة التطبيقات [`v8.startupSnapshot.setDeserializeMainFunction()`](/ar/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) لتكوين التعليمات البرمجية التي يجب تشغيلها عند إطلاق الملف التنفيذي النهائي من قبل المستخدمين.

النمط النموذجي لتطبيق لاستخدام اللقطة في تطبيق ملف تنفيذي واحد هو:

تنطبق القيود العامة لبرامج لقطة بدء التشغيل أيضًا على البرنامج النصي الرئيسي عند استخدامه لإنشاء لقطة لتطبيق الملف التنفيذي الواحد، ويمكن للبرنامج النصي الرئيسي استخدام [`v8.startupSnapshot` API](/ar/nodejs/api/v8#startup-snapshot-api) للتكيف مع هذه القيود. راجع [وثائق حول دعم لقطة بدء التشغيل في Node.js](/ar/nodejs/api/cli#--build-snapshot).


### دعم ذاكرة التخزين المؤقت للشفرة V8 {#v8-code-cache-support}

عندما يتم تعيين `useCodeCache` إلى `true` في الإعدادات، أثناء إنشاء كتلة تحضير التطبيق التنفيذي الفردي، سيقوم Node.js بتجميع البرنامج النصي `main` لإنشاء ذاكرة التخزين المؤقت للشفرة V8. ستكون ذاكرة التخزين المؤقت للشفرة التي تم إنشاؤها جزءًا من كتلة التحضير وسيتم حقنها في الملف التنفيذي النهائي. عند تشغيل تطبيق تنفيذي فردي، بدلاً من تجميع البرنامج النصي `main` من البداية، سيستخدم Node.js ذاكرة التخزين المؤقت للشفرة لتسريع التجميع، ثم تنفيذ البرنامج النصي، مما يحسن أداء بدء التشغيل.

**ملاحظة:** `import()` لا يعمل عندما تكون `useCodeCache` هي `true`.

## في البرنامج النصي الرئيسي المحقون {#in-the-injected-main-script}

### واجهة برمجة تطبيقات التطبيق التنفيذي الفردي {#single-executable-application-api}

يسمح `node:sea` المدمج بالتفاعل مع التطبيق التنفيذي الفردي من البرنامج النصي الرئيسي JavaScript المضمن في الملف التنفيذي.

#### `sea.isSea()` {#seaissea}

**تمت الإضافة في: الإصدار v21.7.0، الإصدار v20.12.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان هذا البرنامج النصي قيد التشغيل داخل تطبيق تنفيذي فردي.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**تمت الإضافة في: الإصدار v21.7.0، الإصدار v20.12.0**

يمكن استخدام هذه الطريقة لاسترداد الأصول التي تم تكوينها لتجميعها في التطبيق التنفيذي الفردي في وقت الإنشاء. يتم طرح خطأ عند عدم العثور على أصل مطابق.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مفتاح الأصل في القاموس المحدد بواسطة حقل `assets` في تكوين التطبيق التنفيذي الفردي.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تحديده، فسيتم فك ترميز الأصل كسلسلة. يتم قبول أي ترميز مدعوم بواسطة `TextDecoder`. إذا لم يتم تحديده، فسيتم إرجاع `ArrayBuffer` يحتوي على نسخة من الأصل بدلاً من ذلك.
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**أُضيف في: v21.7.0, v20.12.0**

مشابهة لـ [`sea.getAsset()`](/ar/nodejs/api/single-executable-applications#seagetassetkey-encoding)، ولكنها تُرجع النتيجة في [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). يتم طرح خطأ عندما لا يمكن العثور على أي أصل مطابق.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مفتاح الأصل في القاموس المحدد بواسطة حقل `assets` في تكوين التطبيق القابل للتنفيذ الفردي.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع MIME اختياري للكائن الثنائي الكبير.
  
 
- تُرجع: [\<Blob\>](/ar/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**أُضيف في: v21.7.0, v20.12.0**

يمكن استخدام هذه الطريقة لاسترداد الأصول التي تم تكوينها ليتم تجميعها في التطبيق القابل للتنفيذ الفردي في وقت الإنشاء. يتم طرح خطأ عندما لا يمكن العثور على أي أصل مطابق.

على عكس `sea.getAsset()` أو `sea.getAssetAsBlob()‎‏`، لا تُرجع هذه الطريقة نسخة. بدلاً من ذلك، تُرجع الأصل الخام المجمّع داخل الملف القابل للتنفيذ.

في الوقت الحالي، يجب على المستخدمين تجنب الكتابة إلى مخزن المصفوفة المؤقتة الذي تم إرجاعه. إذا لم يتم وضع علامة على القسم الذي تم حقنه على أنه قابل للكتابة أو لم تتم محاذاته بشكل صحيح، فمن المحتمل أن تؤدي الكتابة إلى مخزن المصفوفة المؤقتة الذي تم إرجاعه إلى حدوث عطل.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مفتاح الأصل في القاموس المحدد بواسطة حقل `assets` في تكوين التطبيق القابل للتنفيذ الفردي.
- تُرجع: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` في البرنامج النصي الرئيسي المحقون ليس قائمًا على الملفات {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` في البرنامج النصي الرئيسي المحقون ليس هو نفسه [`require()`](/ar/nodejs/api/modules#requireid) المتاح للوحدات النمطية التي لم يتم حقنها. كما أنه لا يحتوي على أي من الخصائص التي [`require()`](/ar/nodejs/api/modules#requireid) غير المحقونة لديها باستثناء [`require.main`](/ar/nodejs/api/modules#accessing-the-main-module). يمكن استخدامه فقط لتحميل الوحدات النمطية المضمنة. محاولة تحميل وحدة نمطية لا يمكن العثور عليها إلا في نظام الملفات ستطرح خطأ.

بدلاً من الاعتماد على `require()` القائمة على الملفات، يمكن للمستخدمين تجميع تطبيقاتهم في ملف JavaScript مستقل لحقنه في الملف القابل للتنفيذ. يضمن هذا أيضًا رسمًا بيانيًا للتبعيات أكثر حتمية.

ومع ذلك، إذا كانت `require()` القائمة على الملفات لا تزال مطلوبة، فيمكن تحقيق ذلك أيضًا:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` و `module.filename` في البرنامج النصي الرئيسي المحقون {#__filename-and-modulefilename-in-the-injected-main-script}

تتساوى قيم `__filename` و `module.filename` في البرنامج النصي الرئيسي المحقون مع [`process.execPath`](/ar/nodejs/api/process#processexecpath).

### `__dirname` في البرنامج النصي الرئيسي المحقون {#__dirname-in-the-injected-main-script}

تتساوى قيمة `__dirname` في البرنامج النصي الرئيسي المحقون مع اسم دليل [`process.execPath`](/ar/nodejs/api/process#processexecpath).

## ملاحظات {#notes}

### عملية إنشاء تطبيق قابل للتنفيذ منفرد {#single-executable-application-creation-process}

يجب على أداة تهدف إلى إنشاء تطبيق Node.js قابل للتنفيذ منفرد حقن محتويات النقطة الثنائية المُعدة باستخدام `--experimental-sea-config"` في:

- مورد باسم `NODE_SEA_BLOB` إذا كان الملف الثنائي `node` هو ملف [PE](https://en.wikipedia.org/wiki/Portable_Executable)
- قسم باسم `NODE_SEA_BLOB` في مقطع `NODE_SEA` إذا كان الملف الثنائي `node` هو ملف [Mach-O](https://en.wikipedia.org/wiki/Mach-O)
- ملاحظة باسم `NODE_SEA_BLOB` إذا كان الملف الثنائي `node` هو ملف [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

ابحث في الملف الثنائي عن سلسلة [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) التالية `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` واقلب الحرف الأخير إلى `1` للإشارة إلى أنه تم حقن مورد.

### دعم النظام الأساسي {#platform-support}

يتم اختبار دعم الملف التنفيذي المنفرد بانتظام على CI فقط على الأنظمة الأساسية التالية:

- Windows
- macOS
- Linux (جميع التوزيعات [المدعومة بواسطة Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) باستثناء Alpine وجميع البنى [المدعومة بواسطة Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) باستثناء s390x)

ويرجع ذلك إلى نقص الأدوات الأفضل لإنشاء ملفات تنفيذية منفردة يمكن استخدامها لاختبار هذه الميزة على الأنظمة الأساسية الأخرى.

نرحب بالاقتراحات الخاصة بأدوات/تدفقات عمل حقن الموارد الأخرى. يرجى بدء مناقشة على [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) لمساعدتنا في توثيقها.

