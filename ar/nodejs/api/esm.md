---
title: وحدات ECMAScript في Node.js
description: توفر هذه الصفحة توثيقًا مفصلًا حول كيفية استخدام وحدات ECMAScript (ESM) في Node.js، بما في ذلك حل الوحدات، وصيغة الاستيراد والتصدير، والتوافق مع CommonJS.
head:
  - - meta
    - name: og:title
      content: وحدات ECMAScript في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر هذه الصفحة توثيقًا مفصلًا حول كيفية استخدام وحدات ECMAScript (ESM) في Node.js، بما في ذلك حل الوحدات، وصيغة الاستيراد والتصدير، والتوافق مع CommonJS.
  - - meta
    - name: twitter:title
      content: وحدات ECMAScript في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر هذه الصفحة توثيقًا مفصلًا حول كيفية استخدام وحدات ECMAScript (ESM) في Node.js، بما في ذلك حل الوحدات، وصيغة الاستيراد والتصدير، والتوافق مع CommonJS.
---


# الوحدات: وحدات ECMAScript {#modules-ecmascript-modules}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.1.0 | لم تعد سمات الاستيراد تجريبية. |
| v22.0.0 | إسقاط دعم تأكيدات الاستيراد. |
| v21.0.0, v20.10.0, v18.20.0 | إضافة دعم تجريبي لسمات الاستيراد. |
| v20.0.0, v18.19.0 | يتم تنفيذ خطافات تخصيص الوحدة خارج الخيط الرئيسي. |
| v18.6.0, v16.17.0 | إضافة دعم لتسلسل خطافات تخصيص الوحدة. |
| v17.1.0, v16.14.0 | إضافة دعم تجريبي لتأكيدات الاستيراد. |
| v17.0.0, v16.12.0 | دمج خطافات التخصيص، إزالة خطافات `getFormat` و `getSource` و `transformSource` و `getGlobalPreloadCode` تمت إضافة خطافات `load` و `globalPreload` سمحت بإرجاع `format` من أي من خطافات `resolve` أو `load`. |
| v14.8.0 | إلغاء علامة انتظار المستوى الأعلى. |
| v15.3.0, v14.17.0, v12.22.0 | تثبيت تنفيذ الوحدات. |
| v14.13.0, v12.20.0 | دعم اكتشاف صادرات CommonJS المسماة. |
| v14.0.0, v13.14.0, v12.20.0 | إزالة تحذير الوحدات التجريبية. |
| v13.2.0, v12.17.0 | لم يعد تحميل وحدات ECMAScript يتطلب علامة سطر الأوامر. |
| v12.0.0 | إضافة دعم لوحدات ES باستخدام ملحق الملف `.js` عبر حقل `"type"` في `package.json`. |
| v8.5.0 | تمت الإضافة في: v8.5.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

## مقدمة {#introduction}

وحدات ECMAScript هي [التنسيق القياسي الرسمي](https://tc39.github.io/ecma262/#sec-modules) لحزم كود JavaScript لإعادة استخدامه. يتم تعريف الوحدات باستخدام مجموعة متنوعة من عبارات [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) و [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

يوضح المثال التالي لوحدة ES تصدير دالة:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
يوضح المثال التالي لوحدة ES استيراد الدالة من `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// يطبع: 6
console.log(addTwo(4));
```
يدعم Node.js وحدات ECMAScript بشكل كامل كما هو محدد حاليًا ويوفر إمكانية التشغيل البيني بينها وبين تنسيق الوحدة الأصلي الخاص به، [CommonJS](/ar/nodejs/api/modules).


## تفعيل {#enabling}

يحتوي Node.js على نظامين للوحدات النمطية: وحدات [CommonJS](/ar/nodejs/api/modules) ووحدات ECMAScript.

يمكن للمؤلفين إخبار Node.js بتفسير JavaScript كوحدة نمطية ES عبر امتداد الملف `.mjs`، أو حقل [`"type"`](/ar/nodejs/api/packages#type) في `package.json` بقيمة `"module"`، أو علامة [`--input-type`](/ar/nodejs/api/cli#--input-typetype) بقيمة `"module"`. هذه علامات صريحة على أن التعليمات البرمجية تهدف إلى التشغيل كوحدة نمطية ES.

بالمقابل، يمكن للمؤلفين إخبار Node.js بشكل صريح بتفسير JavaScript كـ CommonJS عبر امتداد الملف `.cjs`، أو حقل [`"type"`](/ar/nodejs/api/packages#type) في `package.json` بقيمة `"commonjs"`، أو علامة [`--input-type`](/ar/nodejs/api/cli#--input-typetype) بقيمة `"commonjs"`.

عندما تفتقر التعليمات البرمجية إلى علامات صريحة لأي من نظامي الوحدات النمطية، سيقوم Node.js بفحص التعليمات البرمجية المصدر للوحدة النمطية للبحث عن بناء جملة الوحدة النمطية ES. إذا تم العثور على مثل هذا البناء، فسيقوم Node.js بتشغيل التعليمات البرمجية كوحدة نمطية ES؛ وإلا فإنه سيقوم بتشغيل الوحدة النمطية كـ CommonJS. راجع [تحديد نظام الوحدة النمطية](/ar/nodejs/api/packages#determining-module-system) لمزيد من التفاصيل.

## الحزم {#packages}

تم نقل هذا القسم إلى [الوحدات النمطية: الحزم](/ar/nodejs/api/packages).

## مُعرّفات `import` {#import-specifiers}

### المصطلحات {#terminology}

*المُعرّف* لعبارة `import` هو السلسلة بعد الكلمة الأساسية `from`، على سبيل المثال `'node:path'` في `import { sep } from 'node:path'`. تُستخدم المُعرّفات أيضًا في عبارات `export from`، وكوسيطة للتعبير `import()`.

هناك ثلاثة أنواع من المُعرّفات:

- *المُعرّفات النسبية* مثل `'./startup.js'` أو `'../config.mjs'`. تشير إلى مسار نسبي لموقع الملف الذي يتم الاستيراد منه. *امتداد الملف ضروري دائمًا لهذه.*
- *المُعرّفات المجردة* مثل `'some-package'` أو `'some-package/shuffle'`. يمكن أن تشير إلى نقطة الدخول الرئيسية لحزمة باسم الحزمة، أو وحدة نمطية مميزة محددة داخل حزمة مسبوقة باسم الحزمة وفقًا للأمثلة على التوالي. *يجب تضمين امتداد الملف فقط
للحزم بدون حقل <a href="packages.html#exports"><code>"exports"</code></a>.*
- *المُعرّفات المطلقة* مثل `'file:///opt/nodejs/config.js'`. تشير مباشرة وصراحة إلى مسار كامل.

تتم معالجة حلول المُعرّفات المجردة بواسطة [خوارزمية حل وتحميل الوحدة النمطية Node.js](/ar/nodejs/api/esm#resolution-algorithm-specification). يتم دائمًا حل جميع حلول المُعرّفات الأخرى فقط باستخدام الدلالات القياسية للحل النسبي [URL](https://url.spec.whatwg.org/).

كما هو الحال في CommonJS، يمكن الوصول إلى ملفات الوحدة النمطية داخل الحزم عن طريق إلحاق مسار باسم الحزمة ما لم يكن [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) الخاص بالحزمة يحتوي على حقل [`"exports"`](/ar/nodejs/api/packages#exports)، وفي هذه الحالة لا يمكن الوصول إلى الملفات داخل الحزم إلا عبر المسارات المحددة في [`"exports"`](/ar/nodejs/api/packages#exports).

للحصول على تفاصيل حول قواعد حل الحزم هذه التي تنطبق على المُعرّفات المجردة في حل الوحدة النمطية Node.js، راجع [وثائق الحزم](/ar/nodejs/api/packages).


### امتدادات الملفات الإلزامية {#mandatory-file-extensions}

يجب توفير امتداد ملف عند استخدام الكلمة الأساسية `import` لحل المحددات النسبية أو المطلقة. يجب أيضًا تحديد فهارس الدليل بالكامل (مثل `'./startup/index.js'`).

يتطابق هذا السلوك مع كيفية عمل `import` في بيئات المتصفح، بافتراض وجود خادم تم تكوينه بشكل نموذجي.

### عناوين URL {#urls}

يتم حل وحدات ES النمطية وتخزينها مؤقتًا كعناوين URL. هذا يعني أنه يجب [تشفير الأحرف الخاصة بالنسبة المئوية](/ar/nodejs/api/url#percent-encoding-in-urls)، مثل `#` مع `%23` و `؟` مع `%3F`.

يتم دعم مخططات عناوين URL `file:` و `node:` و `data:`. المحدد مثل `'https://example.com/app.js'` غير مدعوم أصليًا في Node.js ما لم يتم استخدام [محمل HTTPS مخصص](/ar/nodejs/api/module#import-from-https).

#### عناوين URL `file:` {#file-urls}

يتم تحميل الوحدات النمطية عدة مرات إذا كان لمحدد `import` المستخدم لحلها استعلام أو جزء مختلف.

```js [ESM]
import './foo.mjs?query=1'; // يقوم بتحميل ./foo.mjs مع الاستعلام "?query=1"
import './foo.mjs?query=2'; // يقوم بتحميل ./foo.mjs مع الاستعلام "?query=2"
```

يمكن الإشارة إلى جذر وحدة التخزين عبر `/` أو `//` أو `file:///`. نظرًا للاختلافات بين [URL](https://url.spec.whatwg.org/) وحل المسار (مثل تفاصيل ترميز النسبة المئوية)، يوصى باستخدام [url.pathToFileURL](/ar/nodejs/api/url#urlpathtofileurlpath-options) عند استيراد مسار.

#### عمليات استيراد `data:` {#data-imports}

**تمت الإضافة في: v12.10.0**

يتم دعم [عناوين URL لـ `data:`‎](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) للاستيراد مع أنواع MIME التالية:

- `text/javascript` لوحدات ES النمطية
- `application/json` لـ JSON
- `application/wasm` لـ Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```

تحل عناوين URL لـ `data:` [المحددات المجردة](/ar/nodejs/api/esm#terminology) فقط للوحدات النمطية المضمنة و [المحددات المطلقة](/ar/nodejs/api/esm#terminology). حل [المحددات النسبية](/ar/nodejs/api/esm#terminology) لا يعمل لأن `data:` ليس [مخططًا خاصًا](https://url.spec.whatwg.org/#special-scheme). على سبيل المثال، محاولة تحميل `./foo` من `data:text/javascript,import "./foo";` تفشل في الحل لأنه لا يوجد مفهوم للحل النسبي لعناوين URL لـ `data:`.


#### `node:` استيراد {#node-imports}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0, v14.18.0 | تمت إضافة دعم استيراد `node:` إلى `require(...)`. |
| v14.13.1, v12.20.0 | تمت الإضافة في: v14.13.1, v12.20.0 |
:::

يتم دعم عناوين URL `node:` كوسيلة بديلة لتحميل وحدات Node.js المدمجة. يسمح مخطط عنوان URL هذا بالإشارة إلى الوحدات المدمجة بواسطة سلاسل URL مطلقة صالحة.

```js [ESM]
import fs from 'node:fs/promises';
```
## سمات الاستيراد {#import-attributes}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | التبديل من تأكيدات الاستيراد إلى سمات الاستيراد. |
| v17.1.0, v16.14.0 | تمت الإضافة في: v17.1.0, v16.14.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

[سمات الاستيراد](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) هي صيغة مضمنة لعبارات استيراد الوحدة لتمرير المزيد من المعلومات جنبًا إلى جنب مع محدد الوحدة النمطية.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
يدعم Node.js سمة `type` فقط، والتي يدعم القيم التالية لها:

| السمة `type` | مطلوب لـ |
| --- | --- |
| `'json'` | [وحدات JSON](/ar/nodejs/api/esm#json-modules) |
سمة `type: 'json'` إلزامية عند استيراد وحدات JSON.

## الوحدات المدمجة {#built-in-modules}

[الوحدات المدمجة](/ar/nodejs/api/modules#built-in-modules) توفر تصديرات مسماة لواجهة برمجة التطبيقات العامة الخاصة بها. يتم توفير تصدير افتراضي أيضًا وهو قيمة تصديرات CommonJS. يمكن استخدام التصدير الافتراضي، من بين أمور أخرى، لتعديل التصديرات المسماة. يتم تحديث التصديرات المسماة للوحدات المدمجة فقط عن طريق استدعاء [`module.syncBuiltinESMExports()`](/ar/nodejs/api/module#modulesyncbuiltinesmexports).

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## تعبيرات `import()` {#import-expressions}

يتم دعم [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) الديناميكي في كل من وحدات CommonJS ووحدات ES. في وحدات CommonJS، يمكن استخدامه لتحميل وحدات ES.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

خاصية التعريف الوصفي `import.meta` هي `Object` تحتوي على الخصائص التالية. وهي مدعومة فقط في وحدات ES.

### `import.meta.dirname` {#importmetadirname}

**أضيف في: v21.2.0، v20.11.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح إصدار
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الدليل للوحدة النمطية الحالية. هذا هو نفسه [`path.dirname()`](/ar/nodejs/api/path#pathdirnamepath) الخاص بـ [`import.meta.filename`](/ar/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**أضيف في: v21.2.0، v20.11.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح إصدار
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المسار المطلق الكامل واسم الملف للوحدة النمطية الحالية، مع حل الروابط الرمزية.
- هذا هو نفسه [`url.fileURLToPath()`](/ar/nodejs/api/url#urlfileurltopathurl-options) الخاص بـ [`import.meta.url`](/ar/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL المطلق `file:` للوحدة النمطية.

يتم تعريف هذا تمامًا كما هو الحال في المتصفحات التي توفر عنوان URL لملف الوحدة النمطية الحالي.

يمكّن هذا أنماطًا مفيدة مثل تحميل الملفات النسبية:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.6.0, v18.19.0 | لم يعد خلف علامة CLI `--experimental-import-meta-resolve`، باستثناء المعلمة `parentURL` غير القياسية. |
| v20.6.0, v18.19.0 | لم تعد واجهة برمجة التطبيقات هذه تطرح خطأً عند استهداف عناوين URL لـ `file:` التي لا ترتبط بملف موجود على نظام الملفات المحلي. |
| v20.0.0, v18.19.0 | تُرجع واجهة برمجة التطبيقات هذه الآن سلسلة بشكل متزامن بدلاً من وعد. |
| v16.2.0, v14.18.0 | إضافة دعم لكائن WHATWG `URL` إلى المعلمة `parentURL`. |
| v13.9.0, v12.16.2 | أضيف في: v13.9.0, v12.16.2 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح إصدار
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) محدد الوحدة النمطية لحلها بالنسبة إلى الوحدة النمطية الحالية.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة عنوان URL المطلق التي سيتم حل المحدد إليها.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) هي دالة حل نسبي للوحدة النمطية محصورة في كل وحدة نمطية، وتعيد سلسلة عنوان URL.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
يتم دعم جميع ميزات حل الوحدة النمطية Node.js. تخضع عمليات حل التبعيات لعمليات حل الصادرات المسموح بها داخل الحزمة.

**محاذير**:

- يمكن أن يؤدي هذا إلى عمليات نظام ملفات متزامنة، والتي يمكن أن تؤثر على الأداء بشكل مشابه لـ `require.resolve`.
- هذه الميزة غير متوفرة داخل أدوات التحميل المخصصة (ستؤدي إلى طريق مسدود).

**واجهة برمجة تطبيقات غير قياسية**:

عند استخدام علامة `--experimental-import-meta-resolve`، تقبل هذه الدالة وسيطة ثانية:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) عنوان URL اختياري للوحدة النمطية الأصلية المطلقة للحل منه. **افتراضي:** `import.meta.url`


## التوافق التشغيلي مع CommonJS {#interoperability-with-commonjs}

### عبارات `import` {#import-statements}

يمكن لعبارة `import` أن تشير إلى وحدة ES أو وحدة CommonJS. عبارات `import` مسموح بها فقط في وحدات ES، ولكن تعابير [`import()`](/ar/nodejs/api/esm#import-expressions) الديناميكية مدعومة في CommonJS لتحميل وحدات ES.

عند استيراد [وحدات CommonJS](/ar/nodejs/api/esm#commonjs-namespaces)، يتم توفير كائن `module.exports` كتصدير افتراضي. قد تكون التصديرات المسماة متاحة، ويتم توفيرها عن طريق التحليل الثابت كراحة لتحسين التوافق مع النظام البيئي.

### `require` {#require}

وحدة CommonJS `require` تدعم حاليًا فقط تحميل وحدات ES المتزامنة (أي وحدات ES التي لا تستخدم `await` على المستوى الأعلى).

راجع [تحميل وحدات ECMAScript باستخدام `require()`](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require) للحصول على التفاصيل.

### مساحات أسماء CommonJS {#commonjs-namespaces}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | تمت إضافة علامة تصدير `'module.exports'` إلى مساحات أسماء CJS. |
| v14.13.0 | تمت الإضافة في: v14.13.0 |
:::

تتكون وحدات CommonJS من كائن `module.exports` يمكن أن يكون من أي نوع.

لدعم ذلك، عند استيراد CommonJS من وحدة ECMAScript، يتم إنشاء غلاف مساحة اسم لوحدة CommonJS، والذي يوفر دائمًا مفتاح تصدير `default` يشير إلى قيمة `module.exports` في CommonJS.

بالإضافة إلى ذلك، يتم إجراء تحليل ثابت استرشادي على نص المصدر لوحدة CommonJS للحصول على أفضل قائمة ثابتة ممكنة للتصديرات لتقديمها في مساحة الاسم من القيم الموجودة في `module.exports`. هذا ضروري لأن مساحات الأسماء هذه يجب أن يتم إنشاؤها قبل تقييم وحدة CJS.

توفر كائنات مساحة اسم CommonJS هذه أيضًا تصدير `default` كتصدير مسمى `'module.exports'`، للإشارة بشكل لا لبس فيه إلى أن تمثيلها في CommonJS يستخدم هذه القيمة، وليس قيمة مساحة الاسم. هذا يعكس دلالات معالجة اسم التصدير `'module.exports'` في دعم التوافق التشغيلي [`require(esm)`](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require).

عند استيراد وحدة CommonJS، يمكن استيرادها بشكل موثوق باستخدام استيراد ES module الافتراضي أو صيغة السكر المقابلة لها:

```js [ESM]
import { default as cjs } from 'cjs';
// مطابق لما ورد أعلاه
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// يطبع:
//   <module.exports>
//   true
```
يمكن ملاحظة كائن مساحة اسم الوحدة الغريبة هذا مباشرةً إما عند استخدام `import * as m from 'cjs'` أو استيراد ديناميكي:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// يطبع:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
لتحسين التوافق مع الاستخدام الحالي في النظام البيئي JS، تحاول Node.js بالإضافة إلى ذلك تحديد التصديرات المسماة CommonJS لكل وحدة CommonJS مستوردة لتوفيرها كتصديرات ES module منفصلة باستخدام عملية تحليل ثابت.

على سبيل المثال، ضع في اعتبارك وحدة CommonJS مكتوبة:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
تدعم الوحدة النمطية السابقة عمليات الاستيراد المسماة في وحدات ES:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// يطبع: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// يطبع: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// يطبع:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
كما يمكن أن نرى من المثال الأخير لكائن مساحة اسم الوحدة النمطية الغريبة الذي يتم تسجيله، يتم نسخ تصدير `name` من كائن `module.exports` ويتم تعيينه مباشرةً في مساحة اسم ES module عند استيراد الوحدة النمطية.

لا يتم الكشف عن تحديثات الربط المباشر أو التصديرات الجديدة المضافة إلى `module.exports` لهذه التصديرات المسماة.

يعتمد اكتشاف التصديرات المسماة على أنماط بناء الجملة الشائعة ولكنه لا يكتشف دائمًا التصديرات المسماة بشكل صحيح. في هذه الحالات، يمكن أن يكون استخدام نموذج الاستيراد الافتراضي الموضح أعلاه خيارًا أفضل.

يغطي الكشف عن التصديرات المسماة العديد من أنماط التصدير الشائعة وأنماط إعادة التصدير ومخرجات أدوات البناء والمترجمات. راجع [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) للحصول على الدلالات الدقيقة التي تم تنفيذها.


### الاختلافات بين وحدات ES و CommonJS {#differences-between-es-modules-and-commonjs}

#### لا يوجد `require` أو `exports` أو `module.exports` {#no-require-exports-or-moduleexports}

في معظم الحالات، يمكن استخدام `import` لوحدة ES لتحميل وحدات CommonJS.

إذا لزم الأمر، يمكن إنشاء دالة `require` داخل وحدة ES باستخدام [`module.createRequire()`](/ar/nodejs/api/module#modulecreaterequirefilename).

#### لا يوجد `__filename` أو `__dirname` {#no-__filename-or-__dirname}

هذه المتغيرات CommonJS غير متوفرة في وحدات ES.

يمكن تكرار حالات استخدام `__filename` و `__dirname` عبر [`import.meta.filename`](/ar/nodejs/api/esm#importmetafilename) و [`import.meta.dirname`](/ar/nodejs/api/esm#importmetadirname).

#### لا يوجد تحميل للملحقات {#no-addon-loading}

[الملحقات](/ar/nodejs/api/addons) غير مدعومة حاليًا مع استيراد وحدات ES.

يمكن بدلاً من ذلك تحميلها باستخدام [`module.createRequire()`](/ar/nodejs/api/module#modulecreaterequirefilename) أو [`process.dlopen`](/ar/nodejs/api/process#processdlopenmodule-filename-flags).

#### لا يوجد `require.resolve` {#no-requireresolve}

يمكن التعامل مع الدقة النسبية عبر `new URL('./local', import.meta.url)`.

للحصول على بديل كامل لـ `require.resolve`، يوجد واجهة برمجة التطبيقات [import.meta.resolve](/ar/nodejs/api/esm#importmetaresolvespecifier).

بدلاً من ذلك، يمكن استخدام `module.createRequire()`.

#### لا يوجد `NODE_PATH` {#no-node_path}

`NODE_PATH` ليس جزءًا من حل محددات `import`. يرجى استخدام الروابط الرمزية إذا كانت هذه السلوكيات مطلوبة.

#### لا يوجد `require.extensions` {#no-requireextensions}

`require.extensions` لا يتم استخدامه بواسطة `import`. يمكن لخطافات تخصيص الوحدة النمطية توفير بديل.

#### لا يوجد `require.cache` {#no-requirecache}

`require.cache` لا يتم استخدامه بواسطة `import` لأن محمل وحدة ES لديه ذاكرة تخزين مؤقت منفصلة خاصة به.

## وحدات JSON {#json-modules}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.1.0 | وحدات JSON لم تعد تجريبية. |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يمكن الإشارة إلى ملفات JSON بواسطة `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
بناء الجملة `with { type: 'json' }` إلزامي؛ راجع [سمات الاستيراد](/ar/nodejs/api/esm#import-attributes).

يعرض JSON المستورد فقط تصدير `default`. لا يوجد دعم للتصديرات المسماة. يتم إنشاء إدخال ذاكرة تخزين مؤقت في ذاكرة التخزين المؤقت CommonJS لتجنب الازدواجية. يتم إرجاع نفس الكائن في CommonJS إذا تم بالفعل استيراد وحدة JSON من نفس المسار.


## وحدات Wasm {#wasm-modules}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يتم دعم استيراد وحدات WebAssembly تحت علامة `--experimental-wasm-modules`، مما يسمح باستيراد أي ملفات `.wasm` كوحدات نمطية عادية مع دعم أيضًا عمليات استيراد الوحدات الخاصة بها.

يتماشى هذا التكامل مع [اقتراح تكامل وحدة ES لـ WebAssembly](https://github.com/webassembly/esm-integration).

على سبيل المثال، يحتوي `index.mjs` على:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
يتم تنفيذه تحت:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
سيوفر واجهة التصدير لإنشاء `module.wasm`.

## المستوى الأعلى `await` {#top-level-await}

**أُضيف في: الإصدار 14.8.0**

يمكن استخدام الكلمة المفتاحية `await` في نص المستوى الأعلى لوحدة ECMAScript.

بافتراض وجود `a.mjs` مع

```js [ESM]
export const five = await Promise.resolve(5);
```
و `b.mjs` مع

```js [ESM]
import { five } from './a.mjs';

console.log(five); // يسجل `5`
```
```bash [BASH]
node b.mjs # يعمل
```
إذا لم يتم حل تعبير `await` ذي المستوى الأعلى أبدًا، فستخرج عملية `node` برمز [حالة الخروج](/ar/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // وعد لا يتم حله أبدًا:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // يسجل `13`
});
```
## أدوات التحميل {#loaders}

توجد الآن وثائق أدوات التحميل السابقة في [الوحدات: خطافات التخصيص](/ar/nodejs/api/module#customization-hooks).

## خوارزمية التحليل والتحميل {#resolution-and-loading-algorithm}

### الميزات {#features}

يحتوي المحلل الافتراضي على الخصائص التالية:

- التحليل المستند إلى FileURL كما هو مستخدم من قبل وحدات ES النمطية
- تحليل URL النسبي والمطلق
- لا توجد امتدادات افتراضية
- لا توجد مجلدات رئيسية
- البحث عن تحليل حزمة المحدد العارية من خلال node_modules
- لا يفشل في الامتدادات أو البروتوكولات غير المعروفة
- يمكنه اختياريًا توفير تلميح لتنسيق مرحلة التحميل

تحتوي أداة التحميل الافتراضية على الخصائص التالية

- دعم تحميل الوحدات النمطية المضمنة عبر عناوين URL `node:`
- دعم تحميل الوحدة النمطية "المضمنة" عبر عناوين URL `data:`
- دعم تحميل الوحدة النمطية `file:`
- يفشل في أي بروتوكول URL آخر
- يفشل في الامتدادات غير المعروفة لتحميل `file:` (يدعم فقط `.cjs` و `.js` و `.mjs`)


### خوارزمية التحليل {#resolution-algorithm}

يتم توفير خوارزمية تحميل مُعرّف وحدة ES من خلال طريقة **ESM_RESOLVE** الموضحة أدناه. وهي تُرجع عنوان URL الذي تم تحليله لمُعرّف الوحدة بالنسبة إلى parentURL.

تحدد خوارزمية التحليل عنوان URL الكامل الذي تم تحليله لتحميل الوحدة، بالإضافة إلى تنسيق الوحدة المقترح. لا تحدد خوارزمية التحليل ما إذا كان يمكن تحميل بروتوكول عنوان URL الذي تم تحليله، أو ما إذا كانت امتدادات الملفات مسموحًا بها، وبدلاً من ذلك، يتم تطبيق هذه التحققات بواسطة Node.js أثناء مرحلة التحميل (على سبيل المثال، إذا طُلب منها تحميل عنوان URL يحتوي على بروتوكول ليس `file:` أو `data:` أو `node:`).

تحاول الخوارزمية أيضًا تحديد تنسيق الملف بناءً على الامتداد (راجع خوارزمية `ESM_FILE_FORMAT` أدناه). إذا لم تتعرف على امتداد الملف (على سبيل المثال، إذا لم يكن `.mjs` أو `.cjs` أو `.json`)، فسيتم إرجاع تنسيق `undefined`، والذي سيؤدي إلى حدوث خطأ أثناء مرحلة التحميل.

يتم توفير خوارزمية تحديد تنسيق وحدة عنوان URL الذي تم تحليله بواسطة **ESM_FILE_FORMAT**، والتي تُرجع تنسيق الوحدة الفريد لأي ملف. يتم إرجاع تنسيق *"module"* لوحدة ECMAScript، بينما يتم استخدام تنسيق *"commonjs"* للإشارة إلى التحميل من خلال أداة تحميل CommonJS القديمة. يمكن توسيع التنسيقات الإضافية مثل *"addon"* في التحديثات المستقبلية.

في الخوارزميات التالية، يتم نشر جميع أخطاء الروتينات الفرعية كأخطاء في هذه الروتينات ذات المستوى الأعلى ما لم يُذكر خلاف ذلك.

*defaultConditions* هي مصفوفة اسم البيئة الشرطية، `["node", "import"]`.

يمكن أن تُظهر أداة التحليل الأخطاء التالية:

- *مُعرّف وحدة غير صالح*: مُعرّف الوحدة هو عنوان URL غير صالح، أو اسم حزمة أو مُعرّف مسار فرعي للحزمة.
- *تكوين حزمة غير صالح*: تكوين package.json غير صالح أو يحتوي على تكوين غير صالح.
- *هدف حزمة غير صالح*: تحدد صادرات الحزمة أو عمليات الاستيراد الخاصة بها وحدة هدف للحزمة وهي نوع غير صالح أو هدف سلسلة.
- *مسار الحزمة غير مُصدَّر*: لا تحدد صادرات الحزمة أو تسمح بمسار فرعي مستهدف في الحزمة للوحدة المحددة.
- *استيراد الحزمة غير مُعرَّف*: لا تحدد عمليات استيراد الحزمة المُعرّف.
- *الوحدة غير موجودة*: الحزمة أو الوحدة المطلوبة غير موجودة.
- *استيراد دليل غير مدعوم*: يتوافق المسار الذي تم تحليله مع دليل، وهو ليس هدفًا مدعومًا لعمليات استيراد الوحدات.


### مواصفات خوارزمية التحليل {#resolution-algorithm-specification}

**ESM_RESOLVE**(*المحدد*, *عنوان URL الأصلي*)

**PACKAGE_RESOLVE**(*محدد الحزمة*, *عنوان URL الأصلي*)

**PACKAGE_SELF_RESOLVE**(*اسم الحزمة*, *المسار الفرعي للحزمة*, *عنوان URL الأصلي*)

**PACKAGE_EXPORTS_RESOLVE**(*عنوان URL للحزمة*, *المسار الفرعي*, *الصادرات*, *الشروط*)

**PACKAGE_IMPORTS_RESOLVE**(*المحدد*, *عنوان URL الأصلي*, *الشروط*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*مفتاح التطابق*, *كائن التطابق*, *عنوان URL للحزمة*, *هل هو استيراد*, *الشروط*)

**PATTERN_KEY_COMPARE**(*المفتاح أ*, *المفتاح ب*)

**PACKAGE_TARGET_RESOLVE**(*عنوان URL للحزمة*, *الهدف*, *تطابق النمط*, *هل هو استيراد*, *الشروط*)

**ESM_FILE_FORMAT**(*عنوان URL*)

**LOOKUP_PACKAGE_SCOPE**(*عنوان URL*)

**READ_PACKAGE_JSON**(*عنوان URL للحزمة*)

**DETECT_MODULE_SYNTAX**(*المصدر*)

### تخصيص خوارزمية تحليل محددات ESM {#customizing-esm-specifier-resolution-algorithm}

توفر [خطافات تخصيص الوحدة النمطية](/ar/nodejs/api/module#customization-hooks) آلية لتخصيص خوارزمية تحليل محددات ESM. مثال يوفر تحليلًا بنمط CommonJS لمحددات ESM هو [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

