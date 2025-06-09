---
title: توثيق Node.js - وحدة VM
description: توفر وحدة VM (الآلة الافتراضية) في Node.js واجهات برمجة تطبيقات لترجمة وتشغيل الأكواد ضمن سياقات محرك JavaScript V8. تسمح بإنشاء بيئات JavaScript معزولة، وعزل تنفيذ الأكواد، وإدارة سياقات السكربت.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - وحدة VM | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة VM (الآلة الافتراضية) في Node.js واجهات برمجة تطبيقات لترجمة وتشغيل الأكواد ضمن سياقات محرك JavaScript V8. تسمح بإنشاء بيئات JavaScript معزولة، وعزل تنفيذ الأكواد، وإدارة سياقات السكربت.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - وحدة VM | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة VM (الآلة الافتراضية) في Node.js واجهات برمجة تطبيقات لترجمة وتشغيل الأكواد ضمن سياقات محرك JavaScript V8. تسمح بإنشاء بيئات JavaScript معزولة، وعزل تنفيذ الأكواد، وإدارة سياقات السكربت.
---


# الوحدة النمطية VM (تنفيذ JavaScript) {#vm-executing-javascript}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**الكود المصدري:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

تُمكّن الوحدة النمطية `node:vm` من تجميع وتشغيل التعليمات البرمجية داخل سياقات الآلة الافتراضية V8.

**الوحدة النمطية <code>node:vm</code> ليست آلية أمان. لا تستخدمها لتشغيل تعليمات برمجية غير موثوق بها.**

يمكن تجميع وتشغيل تعليمات JavaScript البرمجية على الفور أو تجميعها وحفظها وتشغيلها لاحقًا.

حالة الاستخدام الشائعة هي تشغيل التعليمات البرمجية في سياق V8 مختلف. هذا يعني أن التعليمات البرمجية المستدعاة لها كائن عام مختلف عن التعليمات البرمجية المستدعية.

يمكن للمرء توفير السياق عن طريق [*سياقة*](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) كائن. تعامل التعليمات البرمجية المستدعاة أي خاصية في السياق على أنها متغير عام. تنعكس أي تغييرات في المتغيرات العامة الناتجة عن التعليمات البرمجية المستدعاة في كائن السياق.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // سياقة الكائن.

const code = 'x += 40; var y = 17;';
// `x` و `y` هما متغيران عامان في السياق.
// في البداية، قيمة x هي 2 لأن هذه هي قيمة context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1؛ y غير معرف.
```
## الفئة: `vm.Script` {#class-vmscript}

**أضيف في: v0.3.1**

تحتوي مثيلات الفئة `vm.Script` على نصوص برمجية مجمعة مسبقًا يمكن تنفيذها في سياقات معينة.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.7.0, v20.12.0 | تمت إضافة دعم لـ `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | تمت إضافة دعم لسمات الاستيراد إلى المعامل `importModuleDynamically`. |
| v10.6.0 | تم إهمال `produceCachedData` لصالح `script.createCachedData()`. |
| v5.7.0 | يتم دعم الخيارين `cachedData` و `produceCachedData` الآن. |
| v0.3.1 | أضيف في: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) كود JavaScript المراد تجميعه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد اسم الملف المستخدم في آثار المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم السطر التي يتم عرضها في آثار المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم عمود السطر الأول التي يتم عرضها في آثار المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `0`.
    - `cachedData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يوفر `Buffer` أو `TypedArray` أو `DataView` اختياريًا مع بيانات ذاكرة التخزين المؤقت للكود الخاصة بـ V8 للمصدر المقدم. عند توفيره، سيتم تعيين قيمة `cachedDataRejected` إما على `true` أو `false` بناءً على قبول البيانات بواسطة V8.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `true` ولا توجد `cachedData`، ستحاول V8 إنتاج بيانات ذاكرة التخزين المؤقت للكود لـ `code`. عند النجاح، سيتم إنتاج `Buffer` مع بيانات ذاكرة التخزين المؤقت للكود الخاصة بـ V8 وتخزينها في الخاصية `cachedData` لمثيل `vm.Script` الذي تم إرجاعه. سيتم تعيين قيمة `cachedDataProduced` إما على `true` أو `false` بناءً على ما إذا تم إنتاج بيانات ذاكرة التخزين المؤقت للكود بنجاح. هذا الخيار **مهمل** لصالح `script.createCachedData()`. **افتراضي:** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ar/nodejs/api/vm#vmconstantsuse_main_context_default_loader) يستخدم لتحديد كيفية تحميل الوحدات النمطية أثناء تقييم هذا البرنامج النصي عند استدعاء `import()`. هذا الخيار هو جزء من واجهة برمجة تطبيقات الوحدات النمطية التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، راجع [دعم `import()` الديناميكي في واجهات برمجة تطبيقات التجميع](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

إذا كان `options` سلسلة، فإنه يحدد اسم الملف.

يقوم إنشاء كائن `vm.Script` جديد بتجميع `code` ولكن لا يقوم بتشغيله. يمكن تشغيل `vm.Script` المجمع لاحقًا عدة مرات. لا يرتبط `code` بأي كائن عام؛ بل يرتبط قبل كل تشغيل، فقط لهذا التشغيل.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**أضيف في:** v5.7.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

عندما يتم تزويد `cachedData` لإنشاء `vm.Script`، سيتم تعيين هذه القيمة إلى `true` أو `false` اعتمادًا على قبول البيانات من قبل V8. خلاف ذلك، تكون القيمة `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**أضيف في:** v10.6.0

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يقوم بإنشاء ذاكرة تخزين مؤقت للتعليمات البرمجية يمكن استخدامها مع خيار `cachedData` في مُنشئ `Script`. يُرجع `Buffer`. يمكن استدعاء هذه الطريقة في أي وقت وأي عدد من المرات.

لا تحتوي ذاكرة التخزين المؤقت للتعليمات البرمجية الخاصة بـ `Script` على أي حالات يمكن ملاحظتها في JavaScript. ذاكرة التخزين المؤقت للتعليمات البرمجية آمنة ليتم حفظها جنبًا إلى جنب مع مصدر البرنامج النصي وتستخدم لإنشاء مثيلات `Script` جديدة عدة مرات.

يمكن تحديد وظائف في مصدر `Script` على أنها مُجمَّعة ببطء ولا يتم تجميعها عند إنشاء `Script`. سيتم تجميع هذه الوظائف عندما يتم استدعاؤها للمرة الأولى. تقوم ذاكرة التخزين المؤقت للتعليمات البرمجية بتسلسل البيانات الوصفية التي تعرفها V8 حاليًا عن `Script` والتي يمكنها استخدامها لتسريع عمليات التجميع المستقبلية.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// في `cacheWithoutAdd`، يتم تحديد الوظيفة `add()` للتجميع الكامل
// عند الاستدعاء.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// يحتوي `cacheWithAdd` على الوظيفة `add()` المجمعة بالكامل.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.3.0 | خيار `breakOnSigint` مدعوم الآن. |
| v0.3.1 | أضيف في: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن [تم تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) كما تم إرجاعه بواسطة طريقة `vm.createContext()`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، إذا حدث [`Error`](/ar/nodejs/api/errors#class-error) أثناء تجميع `code`، يتم إرفاق سطر التعليمات البرمجية الذي تسبب في الخطأ بتتبع المكدس. **افتراضي:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتنفيذ `code` قبل إنهاء التنفيذ. إذا تم إنهاء التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فإن استقبال `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الموجودة للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **افتراضي:** `false`.
  
 
- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) نتيجة آخر عبارة تم تنفيذها في البرنامج النصي.

يقوم بتشغيل التعليمات البرمجية المجمعة الموجودة في كائن `vm.Script` داخل `contextifiedObject` المحدد وإرجاع النتيجة. لا يمكن للتعليمات البرمجية قيد التشغيل الوصول إلى النطاق المحلي.

يقوم المثال التالي بتجميع التعليمات البرمجية التي تزيد متغيرًا عامًا، وتعيين قيمة لمتغير عام آخر، ثم تنفيذ التعليمات البرمجية عدة مرات. يتم تضمين المتغيرات العامة في كائن `context`.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// طباعة: { animal: 'cat', count: 12, name: 'kitty' }
```
سيؤدي استخدام الخيارات `timeout` أو `breakOnSigint` إلى بدء حلقات أحداث جديدة وسلاسل رسائل مقابلة، والتي لها حمل أداء غير صفري.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.8.0, v20.18.0 | تقبل وسيطة `contextObject` الآن `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | خيار `microtaskMode` مدعوم الآن. |
| v10.0.0 | خيار `contextCodeGeneration` مدعوم الآن. |
| v6.3.0 | خيار `breakOnSigint` مدعوم الآن. |
| v0.3.1 | أضيف في: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ar/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إما [`vm.constants.DONT_CONTEXTIFY`](/ar/nodejs/api/vm#vmconstantsdont_contextify) أو كائن سيتم [إضفاء سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) عليه. إذا كان `undefined`، فسيتم إنشاء كائن مضفى عليه فارغ للتوافق مع الإصدارات السابقة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `true`، إذا حدث [`Error`](/ar/nodejs/api/errors#class-error) أثناء تجميع `code`، يتم إرفاق سطر التعليمات البرمجية الذي تسبب في الخطأ بالتتبع المكدس. **الافتراضي:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتنفيذ `code` قبل إنهاء التنفيذ. إذا تم إنهاء التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، فإن استقبال `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الموجودة للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **الافتراضي:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم قابل للقراءة من قبل الإنسان للسياق الذي تم إنشاؤه حديثًا. **الافتراضي:** `'VM Context i'`، حيث `i` هو فهرس رقمي تصاعدي للسياق الذي تم إنشاؤه.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [الأصل](https://developer.mozilla.org/en-US/docs/Glossary/Origin) المقابل للسياق الذي تم إنشاؤه حديثًا لأغراض العرض. يجب تنسيق الأصل مثل عنوان URL، ولكن مع المخطط والمضيف والمنفذ فقط (إذا لزم الأمر)، مثل قيمة الخاصية [`url.origin`](/ar/nodejs/api/url#urlorigin) لكائن [`URL`](/ar/nodejs/api/url#class-url). والأهم من ذلك، يجب أن تحذف هذه السلسلة الشرطة المائلة اللاحقة، لأن ذلك يشير إلى مسار. **الافتراضي:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على false، فإن أي مكالمات إلى `eval` أو مُنشئات الدالة (`Function`, `GeneratorFunction`, إلخ) ستطرح `EvalError`. **الافتراضي:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على false، فإن أي محاولة لتجميع وحدة WebAssembly ستطرح `WebAssembly.CompileError`. **الافتراضي:** `true`.

    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تعيينه على `afterEvaluate`، فسيتم تشغيل المهام الصغيرة (المهام المجدولة من خلال `Promise`s و `async function`s) مباشرة بعد تشغيل البرنامج النصي. يتم تضمينها في نطاقات `timeout` و `breakOnSigint` في هذه الحالة.

- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) نتيجة العبارة الأخيرة التي تم تنفيذها في البرنامج النصي.

هذه الطريقة هي اختصار لـ `script.runInContext(vm.createContext(options), options)`. يفعل عدة أشياء في وقت واحد:

يقوم المثال التالي بتجميع التعليمات البرمجية التي تعين متغيرًا عامًا، ثم ينفذ التعليمات البرمجية عدة مرات في سياقات مختلفة. يتم تعيين المتغيرات العامة على كل `context` فردي واحتوائها بداخله.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// This would throw if the context is created from a contextified object.
// vm.constants.DONT_CONTEXTIFY allows creating contexts with ordinary
// global objects that can be frozen.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v6.3.0 | خيار `breakOnSigint` مدعوم الآن. |
| v0.3.1 | أضيف في: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، إذا حدث [`Error`](/ar/nodejs/api/errors#class-error) أثناء تجميع `code`، يتم إرفاق سطر التعليمات البرمجية الذي تسبب في الخطأ بتتبع المكدس. **افتراضي:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتنفيذ `code` قبل إنهاء التنفيذ. إذا تم إنهاء التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فإن تلقي `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الموجودة للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **افتراضي:** `false`.


- إرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) نتيجة آخر عبارة تم تنفيذها في البرنامج النصي.

يقوم بتشغيل التعليمات البرمجية المترجمة الموجودة في `vm.Script` داخل سياق كائن `global` الحالي. لا يمكن للتعليمات البرمجية قيد التشغيل الوصول إلى النطاق المحلي، ولكن *يمكنها* الوصول إلى كائن `global` الحالي.

يقوم المثال التالي بتجميع التعليمات البرمجية التي تزيد متغير `global` ثم ينفذ هذه التعليمات البرمجية عدة مرات:

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**أُضيف في:** v19.1.0, v18.13.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

عندما يُصرَّف النص البرمجي من مصدر يحتوي على تعليق سحري لخريطة المصدر، سيُعيَّن هذا الخاصية إلى عنوان URL لخريطة المصدر.

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## الصنف: `vm.Module` {#class-vmmodule}

**أُضيف في:** v13.0.0, v12.16.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

هذه الميزة متاحة فقط مع تمكين علامة الأمر `--experimental-vm-modules`.

يوفر الصنف `vm.Module` واجهة منخفضة المستوى لاستخدام وحدات ECMAScript في سياقات VM. إنه النظير للصنف `vm.Script` الذي يعكس عن كثب [سجلات الوحدات](https://262.ecma-international.org/14.0/#sec-abstract-module-records) كما هو محدد في مواصفات ECMAScript.

على عكس `vm.Script`، يرتبط كل كائن `vm.Module` بسياق من إنشائه. العمليات على كائنات `vm.Module` غير متزامنة جوهريًا، على عكس الطبيعة المتزامنة لكائنات `vm.Script`. يمكن أن يساعد استخدام وظائف "async" في معالجة كائنات `vm.Module`.

يتطلب استخدام كائن `vm.Module` ثلاث خطوات متميزة: الإنشاء/التحليل، والربط، والتقييم. هذه الخطوات الثلاث موضحة في المثال التالي.

يقع هذا التنفيذ على مستوى أدنى من [محمل وحدة ECMAScript](/ar/nodejs/api/esm#modules-ecmascript-modules). لا توجد أيضًا طريقة للتفاعل مع المحمل حتى الآن، على الرغم من التخطيط لدعمه.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// Create a Module by constructing a new `vm.SourceTextModule` object. This
// parses the provided source text, throwing a `SyntaxError` if anything goes
// wrong. By default, a Module is created in the top context. But here, we
// specify `contextifiedObject` as the context this Module belongs to.
//
// Here, we attempt to obtain the default export from the module "foo", and
// put it into local binding "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// "Link" the imported dependencies of this Module to it.
//
// The provided linking callback (the "linker") accepts two arguments: the
// parent module (`bar` in this case) and the string that is the specifier of
// the imported module. The callback is expected to return a Module that
// corresponds to the provided specifier, with certain requirements documented
// in `module.link()`.
//
// If linking has not started for the returned Module, the same linker
// callback will be called on the returned Module.
//
// Even top-level Modules without dependencies must be explicitly linked. The
// callback provided would never be called, however.
//
// The link() method returns a Promise that will be resolved when all the
// Promises returned by the linker resolve.
//
// Note: This is a contrived example in that the linker function creates a new
// "foo" module every time it is called. In a full-fledged module system, a
// cache would probably be used to avoid duplicated modules.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // The "secret" variable refers to the global variable we added to
      // "contextifiedObject" when creating the context.
      export default secret;
    `, { context: referencingModule.context });

    // Using `contextifiedObject` instead of `referencingModule.context`
    // here would work as well.
  }
  throw new Error(`Unable to resolve dependency: ${specifier}`);
}
await bar.link(linker);

// Step 3
//
// Evaluate the Module. The evaluate() method returns a promise which will
// resolve after the module has finished evaluating.

// Prints 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // Create a Module by constructing a new `vm.SourceTextModule` object. This
  // parses the provided source text, throwing a `SyntaxError` if anything goes
  // wrong. By default, a Module is created in the top context. But here, we
  // specify `contextifiedObject` as the context this Module belongs to.
  //
  // Here, we attempt to obtain the default export from the module "foo", and
  // put it into local binding "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // "Link" the imported dependencies of this Module to it.
  //
  // The provided linking callback (the "linker") accepts two arguments: the
  // parent module (`bar` in this case) and the string that is the specifier of
  // the imported module. The callback is expected to return a Module that
  // corresponds to the provided specifier, with certain requirements documented
  // in `module.link()`.
  //
  // If linking has not started for the returned Module, the same linker
  // callback will be called on the returned Module.
  //
  // Even top-level Modules without dependencies must be explicitly linked. The
  // callback provided would never be called, however.
  //
  // The link() method returns a Promise that will be resolved when all the
  // Promises returned by the linker resolve.
  //
  // Note: This is a contrived example in that the linker function creates a new
  // "foo" module every time it is called. In a full-fledged module system, a
  // cache would probably be used to avoid duplicated modules.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // The "secret" variable refers to the global variable we added to
        // "contextifiedObject" when creating the context.
        export default secret;
      `, { context: referencingModule.context });

      // Using `contextifiedObject` instead of `referencingModule.context`
      // here would work as well.
    }
    throw new Error(`Unable to resolve dependency: ${specifier}`);
  }
  await bar.link(linker);

  // Step 3
  //
  // Evaluate the Module. The evaluate() method returns a promise which will
  // resolve after the module has finished evaluating.

  // Prints 42.
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

محددات جميع تبعيات هذا الوحدة. المصفوفة المرجعة مجمدة لمنع أي تغييرات عليها.

يتوافق مع الحقل `[[RequestedModules]]` الخاص بـ [سجلات الوحدة النمطية الدورية](https://tc39.es/ecma262/#sec-cyclic-module-records) في مواصفات ECMAScript.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

إذا كان `module.status` هو `'errored'`، فسيحتوي هذا الخاصية على الاستثناء الذي تم طرحه بواسطة الوحدة النمطية أثناء التقييم. إذا كانت الحالة أي شيء آخر، فسيؤدي الوصول إلى هذا الخاصية إلى طرح استثناء.

لا يمكن استخدام القيمة `undefined` للحالات التي لا يوجد فيها استثناء تم طرحه بسبب الغموض المحتمل مع `throw undefined;`.

يتوافق مع الحقل `[[EvaluationError]]` الخاص بـ [سجلات الوحدة النمطية الدورية](https://tc39.es/ecma262/#sec-cyclic-module-records) في مواصفات ECMAScript.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتقييمها قبل إنهاء التنفيذ. إذا تم مقاطعة التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فإن استقبال `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الموجودة للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **الافتراضي:** `false`.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم الوفاء به بـ `undefined` عند النجاح.

تقييم الوحدة النمطية.

يجب استدعاء هذا بعد ربط الوحدة النمطية؛ وإلا فسيتم رفضها. يمكن استدعاؤه أيضًا عندما تم بالفعل تقييم الوحدة النمطية، وفي هذه الحالة إما أنه لن يفعل شيئًا إذا انتهى التقييم الأولي بنجاح (`module.status` هو `'evaluated'`) أو أنه سيعيد طرح الاستثناء الذي نتج عنه التقييم الأولي (`module.status` هو `'errored'`).

لا يمكن استدعاء هذه الطريقة أثناء تقييم الوحدة النمطية (`module.status` هو `'evaluating'`).

يتوافق مع حقل [طريقة Evaluate() الملموسة](https://tc39.es/ecma262/#sec-moduleevaluation) الخاص بـ [سجلات الوحدة النمطية الدورية](https://tc39.es/ecma262/#sec-cyclic-module-records) في مواصفات ECMAScript.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

معرّف الوحدة النمطية الحالية، كما هو مُعيّن في الدالة البانية.

### `module.link(linker)` {#modulelinklinker}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | تمت إعادة تسمية الخيار `extra.assert` إلى `extra.attributes`. الاسم السابق لا يزال مُتاحًا للتوافق مع الإصدارات السابقة. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    -  `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مُعرّف الوحدة النمطية المطلوبة:
    -  `referencingModule` [\<vm.Module\>](/ar/nodejs/api/vm#class-vmmodule) كائن `Module` الذي يتم استدعاء `link()` عليه.
    -  `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) البيانات من السمة: وفقًا لـ ECMA-262، من المتوقع أن تتسبب المضيفات في حدوث خطأ في حالة وجود سمة غير مدعومة.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) اسم بديل لـ `extra.attributes`.
  
 
    -  المرتجعات: [\<vm.Module\>](/ar/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- المرتجعات: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ربط تبعيات الوحدة النمطية. يجب استدعاء هذه الطريقة قبل التقييم، ولا يمكن استدعاؤها إلا مرة واحدة لكل وحدة نمطية.

من المتوقع أن تُرجع الدالة كائن `Module` أو `Promise` يتحول في النهاية إلى كائن `Module`. يجب أن يستوفي `Module` المرتجع الشرطين الثابتين التاليين:

- يجب أن ينتمي إلى نفس السياق مثل `Module` الأصل.
- يجب ألا تكون `status` الخاصة به `'errored'`.

إذا كانت `status` الخاصة بـ `Module` المرتجع `'unlinked'`، فسيتم استدعاء هذه الطريقة بشكل متكرر على `Module` المرتجع بنفس دالة `linker` المتوفرة.

تُرجع `link()` ‏`Promise` سيتم حله إما عند حل جميع مثيلات الربط إلى `Module` صالح، أو سيتم رفضه إذا كانت دالة الربط إما تطرح استثناءً أو تُرجع `Module` غير صالح.

تتوافق دالة الربط تقريبًا مع العملية المجردة [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) المحددة التنفيذ في مواصفات ECMAScript، مع بعض الاختلافات الرئيسية:

- يُسمح بأن تكون دالة الربط غير متزامنة بينما [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) متزامنة.

إن التنفيذ الفعلي لـ [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) المستخدم أثناء ربط الوحدة النمطية هو الذي يُرجع الوحدات النمطية المرتبطة أثناء الربط. نظرًا لأنه في تلك المرحلة ستكون جميع الوحدات النمطية قد تم ربطها بالكامل بالفعل، فإن تنفيذ [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) متزامن تمامًا وفقًا للمواصفات.

يتوافق مع الحقل [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) لـ [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s في مواصفات ECMAScript.


### ‏`module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن نطاق اسم الوحدة. هذا متاح فقط بعد اكتمال الربط (`module.link()‎`).

يتوافق مع العملية المجردة [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) في مواصفات ECMAScript.

### ‏`module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الحالة الحالية للوحدة. ستكون واحدة من:

-  `'unlinked'‎`: لم يتم استدعاء `module.link()‎` بعد.
-  `'linking'‎`: تم استدعاء `module.link()‎`، ولكن لم يتم حل جميع الوعود التي أرجعتها دالة الربط بعد.
-  `'linked'‎`: تم ربط الوحدة بنجاح، وجميع تبعياتها مرتبطة، ولكن لم يتم استدعاء `module.evaluate()‎` بعد.
-  `'evaluating'‎`: يتم تقييم الوحدة من خلال `module.evaluate()‎` على نفسها أو على وحدة أصل.
-  `'evaluated'‎`: تم تقييم الوحدة بنجاح.
-  `'errored'‎`: تم تقييم الوحدة، ولكن تم طرح استثناء.

بخلاف `'errored'‎`، يتوافق هذا السلسلة النصية للحالة مع حقل `[[Status]]` الخاص بـ [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) في المواصفات. يتوافق `'errored'‎` مع `'evaluated'‎` في المواصفات، ولكن مع تعيين `[[EvaluationError]]` إلى قيمة ليست `undefined`.

## الفئة: ‏`vm.SourceTextModule` {#class-vmsourcetextmodule}

**تمت إضافتها في: الإصدار 9.6.0**

::: warning [مستقرة: 1 - تجريبية]
[مستقرة: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبية
:::

هذه الميزة متاحة فقط مع تمكين علامة سطر الأوامر ‎`--experimental-vm-modules`‎.

- تمتد: ‏[\<vm.Module\>](/ar/nodejs/api/vm#class-vmmodule)

توفر الفئة `vm.SourceTextModule` ‏[Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records) كما هو محدد في مواصفات ECMAScript.

### ‏`new vm.SourceTextModule(code[, options])‎` {#new-vmsourcetextmodulecode-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.0.0, v16.12.0 | تمت إضافة دعم سمات الاستيراد إلى المعامل `importModuleDynamically`‎. |
:::

- ‏`code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) شيفرة وحدة JavaScript ليتم تحليلها
- ‏`options`
    - ‏`identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة نصية مستخدمة في تتبعات المكدس. **افتراضي:** ‏`'vm:module(i)'‎` حيث `i` هو فهرس تصاعدي خاص بالسياق.
    - ‏`cachedData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يوفر `Buffer` أو `TypedArray` أو `DataView` اختياريًا مع بيانات ذاكرة التخزين المؤقت للشيفرة الخاصة بـ V8 للمصدر المتوفر. يجب أن يكون `code` هو نفسه الوحدة التي تم إنشاء `cachedData` منها.
    - ‏`context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الكائن [الذي تم تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) كما تم إرجاعه بواسطة طريقة `vm.createContext()‎`، لتجميع وتقييم هذه `Module` فيه. إذا لم يتم تحديد سياق، يتم تقييم الوحدة في سياق التنفيذ الحالي.
    - ‏`lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم السطر التي يتم عرضها في تتبعات المكدس التي تنتجها هذه `Module`. **افتراضي:** ‏`0`.
    - ‏`columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم عمود السطر الأول التي يتم عرضها في تتبعات المكدس التي تنتجها هذه `Module`. **افتراضي:** ‏`0`.
    - ‏`initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه أثناء تقييم هذه `Module` لتهيئة `import.meta`.
    - ‏`meta` [\<import.meta\>](/ar/nodejs/api/esm#importmeta)
    - ‏`module` [\<vm.SourceTextModule\>](/ar/nodejs/api/vm#class-vmsourcetextmodule)

    - ‏`importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يستخدم لتحديد كيفية تحميل الوحدات أثناء تقييم هذه الوحدة عند استدعاء `import()‎`. هذا الخيار جزء من واجهة برمجة تطبيقات الوحدات التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، راجع [دعم `import()‎` الديناميكي في واجهات برمجة تطبيقات التجميع](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

ينشئ مثيل `SourceTextModule` جديدًا.

قد تسمح الخصائص المعينة لكائن `import.meta` الذي يمثل كائنات للوحدة بالوصول إلى معلومات خارج `context` المحدد. استخدم `vm.runInContext()‎` لإنشاء كائنات في سياق معين.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**تمت الإضافة في: v13.7.0, v12.17.0**

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

ينشئ ذاكرة تخزين مؤقت للتعليمات البرمجية يمكن استخدامها مع خيار `cachedData` الخاص بمنشئ `SourceTextModule`. يُرجع `Buffer`. يمكن استدعاء هذه الطريقة أي عدد من المرات قبل تقييم الوحدة النمطية.

لا تحتوي ذاكرة التخزين المؤقت للتعليمات البرمجية الخاصة بـ `SourceTextModule` على أي حالات يمكن ملاحظتها في JavaScript. ذاكرة التخزين المؤقت للتعليمات البرمجية آمنة ليتم حفظها جنبًا إلى جنب مع مصدر البرنامج النصي وتستخدم لإنشاء مثيلات `SourceTextModule` جديدة عدة مرات.

يمكن وضع علامة على الوظائف الموجودة في مصدر `SourceTextModule` على أنها مُجمَّعة ببطء ولا يتم تجميعها عند إنشاء `SourceTextModule`. سيتم تجميع هذه الوظائف عند استدعائها للمرة الأولى. تقوم ذاكرة التخزين المؤقت للتعليمات البرمجية بتسلسل البيانات الوصفية التي تعرفها V8 حاليًا عن `SourceTextModule` والتي يمكنها استخدامها لتسريع عمليات التجميع المستقبلية.

```js [ESM]
// إنشاء وحدة نمطية أولية
const module = new vm.SourceTextModule('const a = 1;');

// إنشاء بيانات مخزنة مؤقتًا من هذه الوحدة النمطية
const cachedData = module.createCachedData();

// إنشاء وحدة نمطية جديدة باستخدام البيانات المخزنة مؤقتًا. يجب أن تكون التعليمات البرمجية هي نفسها.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## الصنف: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**تمت الإضافة في: v13.0.0, v12.16.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تتوفر هذه الميزة فقط مع تمكين علامة سطر الأوامر `--experimental-vm-modules`.

- يمتد: [\<vm.Module\>](/ar/nodejs/api/vm#class-vmmodule)

يوفر الصنف `vm.SyntheticModule` [سجل الوحدة النمطية الاصطناعية](https://heycam.github.io/webidl/#synthetic-module-records) كما هو محدد في مواصفات WebIDL. الغرض من الوحدات النمطية الاصطناعية هو توفير واجهة عامة لعرض المصادر غير JavaScript على مخططات وحدة ECMAScript النمطية.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// استخدم `module` في الربط...
```

### ‏`new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**تمت إضافتها في: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من الأسماء التي سيتم تصديرها من الوحدة.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عند تقييم الوحدة.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة نصية تستخدم في تتبعات المكدس. **افتراضي:** `'vm:module(i)'` حيث `i` هو فهرس تصاعدي خاص بالسياق.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الكائن [contextified](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) كما تم إرجاعه بواسطة طريقة `vm.createContext()`، لتجميع وتقييم هذا `Module` فيه.

يقوم بإنشاء نسخة `SyntheticModule` جديدة.

قد تسمح الكائنات المعينة لتصديرات هذه النسخة للمستوردين للوحدة بالوصول إلى معلومات خارج `context` المحدد. استخدم `vm.runInContext()` لإنشاء كائنات في سياق محدد.

### ‏`syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**تمت إضافتها في: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم التصدير المراد تعيينه.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة المراد تعيين التصدير عليها.

يتم استخدام هذه الطريقة بعد ربط الوحدة لتعيين قيم الصادرات. إذا تم استدعاؤها قبل ربط الوحدة، فسيتم طرح خطأ [`ERR_VM_MODULE_STATUS`](/ar/nodejs/api/errors#err_vm_module_status).

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.7.0, v20.12.0 | تمت إضافة دعم لـ `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v19.6.0, v18.15.0 | تتضمن القيمة المرجعة الآن `cachedDataRejected` بنفس دلالات إصدار `vm.Script` إذا تم تمرير خيار `cachedData`. |
| v17.0.0, v16.12.0 | تمت إضافة دعم لسمات الاستيراد لمعامل `importModuleDynamically`. |
| v15.9.0 | تمت إضافة خيار `importModuleDynamically` مرة أخرى. |
| v14.3.0 | إزالة `importModuleDynamically` بسبب مشاكل التوافق. |
| v14.1.0, v13.14.0 | خيار `importModuleDynamically` مدعوم الآن. |
| v10.10.0 | تمت إضافته في: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نص الدالة المراد ترجمتها.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من السلاسل النصية تحتوي على جميع معلمات الدالة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد اسم الملف المستخدم في آثار المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم السطر التي يتم عرضها في آثار المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم عمود السطر الأول التي يتم عرضها في آثار المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `0`.
    - `cachedData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يوفر `Buffer` أو `TypedArray` أو `DataView` اختياريًا مع بيانات ذاكرة التخزين المؤقت لتعليمات V8 للمصدر المقدم. يجب أن يتم إنتاج هذا عن طريق استدعاء سابق لـ [`vm.compileFunction()`](/ar/nodejs/api/vm#vmcompilefunctioncode-params-options) بنفس `code` و `params`.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد ما إذا كان سيتم إنتاج بيانات ذاكرة تخزين مؤقت جديدة. **افتراضي:** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الكائن [الذي تم تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) الذي يجب ترجمة الدالة المذكورة فيه.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مصفوفة تحتوي على مجموعة من امتدادات السياق (كائنات تغلف النطاق الحالي) ليتم تطبيقها أثناء الترجمة. **افتراضي:** `[]`.
  
 
- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ar/nodejs/api/vm#vmconstantsuse_main_context_default_loader) يُستخدم لتحديد كيفية تحميل الوحدات النمطية أثناء تقييم هذه الدالة عند استدعاء `import()`. هذا الخيار جزء من واجهة برمجة تطبيقات الوحدات النمطية التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، راجع [دعم `import()` الديناميكي في واجهات برمجة تطبيقات الترجمة](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يقوم بترجمة التعليمات البرمجية المحددة إلى السياق المتوفر (إذا لم يتم توفير سياق، يتم استخدام السياق الحالي)، ويعيدها مغلفة داخل دالة مع `params` المحددة.


## `vm.constants` {#vmconstants}

**أُضيف في:** v21.7.0, v20.12.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع كائن يحتوي على الثوابت شائعة الاستخدام لعمليات VM.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**أُضيف في:** v21.7.0, v20.12.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

ثابت يمكن استخدامه كخيار `importModuleDynamically` لـ `vm.Script` و `vm.compileFunction()` بحيث يستخدم Node.js محمل ESM الافتراضي من السياق الرئيسي لتحميل الوحدة المطلوبة.

للحصول على معلومات مفصلة، انظر [دعم `import()` الديناميكي في واجهات برمجة تطبيقات الترجمة](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.8.0, v20.18.0 | تقبل الآن الوسيطة `contextObject` `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | تمت إضافة دعم لـ `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v21.2.0, v20.11.0 | يتم دعم الخيار `importModuleDynamically` الآن. |
| v14.6.0 | يتم دعم الخيار `microtaskMode` الآن. |
| v10.0.0 | لم يعد بالإمكان أن تكون الوسيطة الأولى دالة. |
| v10.0.0 | يتم دعم الخيار `codeGeneration` الآن. |
| v0.3.1 | أُضيف في: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ar/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إما [`vm.constants.DONT_CONTEXTIFY`](/ar/nodejs/api/vm#vmconstantsdont_contextify) أو كائن سيتم [تأطيره في سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). إذا كان `undefined`، فسيتم إنشاء كائن مؤطر في سياق فارغ للتوافق مع الإصدارات السابقة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم قابل للقراءة من قبل الإنسان للسياق الذي تم إنشاؤه حديثًا. **افتراضي:** `'VM Context i'`، حيث `i` هو فهرس رقمي تصاعدي للسياق الذي تم إنشاؤه.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [أصل](https://developer.mozilla.org/en-US/docs/Glossary/Origin) يتوافق مع السياق الذي تم إنشاؤه حديثًا لأغراض العرض. يجب تنسيق الأصل مثل عنوان URL، ولكن مع المخطط والمضيف والمنفذ فقط (إذا لزم الأمر)، مثل قيمة الخاصية [`url.origin`](/ar/nodejs/api/url#urlorigin) لكائن [`URL`](/ar/nodejs/api/url#class-url). والأهم من ذلك، يجب أن تحذف هذه السلسلة الشرطة المائلة اللاحقة، لأن ذلك يشير إلى مسار. **افتراضي:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على خطأ، فإن أي استدعاءات لـ `eval` أو منشئات الدالات (`Function`، `GeneratorFunction`، إلخ) ستطرح `EvalError`. **افتراضي:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على خطأ، فإن أي محاولة لتجميع وحدة WebAssembly ستطرح `WebAssembly.CompileError`. **افتراضي:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تعيينه على `afterEvaluate`، فسيتم تشغيل المهام الصغيرة (المهام المجدولة من خلال `Promise` و `async function`) مباشرة بعد تشغيل البرنامج النصي من خلال [`script.runInContext()`](/ar/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). يتم تضمينها في نطاقات `timeout` و `breakOnSigint` في هذه الحالة.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ar/nodejs/api/vm#vmconstantsuse_main_context_default_loader) يستخدم لتحديد كيفية تحميل الوحدات النمطية عند استدعاء `import()` في هذا السياق بدون برنامج نصي أو وحدة نمطية محيلة. هذا الخيار جزء من واجهة برمجة تطبيقات الوحدات النمطية التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، انظر [دعم `import()` الديناميكي في واجهات برمجة تطبيقات الترجمة](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن مؤطر في سياق.

إذا كان `contextObject` المحدد كائنًا، فستقوم الطريقة `vm.createContext()` بـ [إعداد هذا الكائن](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) وإرجاع إشارة إليه بحيث يمكن استخدامه في استدعاءات [`vm.runInContext()`](/ar/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) أو [`script.runInContext()`](/ar/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). داخل هذه البرامج النصية، سيتم تغليف الكائن العام بواسطة `contextObject`، مع الاحتفاظ بجميع خصائصه الحالية ولكن أيضًا مع الكائنات والدالات المضمنة التي يمتلكها أي [كائن عام](https://es5.github.io/#x15.1) قياسي. خارج البرامج النصية التي يتم تشغيلها بواسطة وحدة vm، ستبقى المتغيرات العامة دون تغيير.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```
إذا تم حذف `contextObject` (أو تم تمريره بشكل صريح كـ `undefined`)، فسيتم إرجاع كائن [مؤطر في سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) فارغ جديد.

عندما يكون الكائن العام في السياق الذي تم إنشاؤه حديثًا [مؤطرًا في سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)، فإنه يحتوي على بعض الغرابة مقارنة بالكائنات العامة العادية. على سبيل المثال، لا يمكن تجميده. لإنشاء سياق بدون غرابة التأطير في سياق، قم بتمرير [`vm.constants.DONT_CONTEXTIFY`](/ar/nodejs/api/vm#vmconstantsdont_contextify) كـ `contextObject`. انظر وثائق [`vm.constants.DONT_CONTEXTIFY`](/ar/nodejs/api/vm#vmconstantsdont_contextify) للحصول على التفاصيل.

تعد الطريقة `vm.createContext()` مفيدة في المقام الأول لإنشاء سياق واحد يمكن استخدامه لتشغيل برامج نصية متعددة. على سبيل المثال، إذا كانت تحاكي متصفح ويب، فيمكن استخدام الطريقة لإنشاء سياق واحد يمثل الكائن العام للنافذة، ثم تشغيل جميع علامات `\<script\>` معًا داخل هذا السياق.

يتم عرض `name` و `origin` المقدمين للسياق من خلال واجهة برمجة تطبيقات Inspector.


## `vm.isContext(object)` {#vmiscontextobject}

**أضيف في: الإصدار v0.11.7**

- `object` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- القيمة المعادة: [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُعيد `true` إذا كان الكائن `object` المُعطى قد تم [تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) باستخدام [`vm.createContext()`](/ar/nodejs/api/vm#vmcreatecontextcontextobject-options)، أو إذا كان الكائن العام لسياق تم إنشاؤه باستخدام [`vm.constants.DONT_CONTEXTIFY`](/ar/nodejs/api/vm#vmconstantsdont_contextify).

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**أضيف في: الإصدار v13.10.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يقيس الذاكرة المعروفة لـ V8 والمستخدمة بواسطة جميع السياقات المعروفة لعزل V8 الحالي، أو السياق الرئيسي.

- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) اختياري.
    - `mode` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'summary'` أو `'detailed'`. في وضع الملخص، سيتم إرجاع الذاكرة التي تم قياسها للسياق الرئيسي فقط. في الوضع التفصيلي، سيتم إرجاع الذاكرة التي تم قياسها لجميع السياقات المعروفة لعزل V8 الحالي. **افتراضي:** `'summary'`
    - `execution` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'default'` أو `'eager'`. مع التنفيذ الافتراضي، لن يتم حل الوعد حتى بعد بدء جمع البيانات المهملة المجدول التالي، الأمر الذي قد يستغرق بعض الوقت (أو لا يحدث أبدًا إذا انتهى البرنامج قبل عملية GC التالية). مع التنفيذ السريع، ستبدأ عملية GC على الفور لقياس الذاكرة. **افتراضي:** `'default'`

- القيمة المعادة: [\<الوعد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) إذا تم قياس الذاكرة بنجاح، فسيتم حل الوعد بكائن يحتوي على معلومات حول استخدام الذاكرة. وإلا سيتم رفضه مع الخطأ `ERR_CONTEXT_NOT_INITIALIZED`.

تنسيق الكائن الذي قد يتم حل الوعد الذي تم إرجاعه به خاص بمحرك V8 وقد يتغير من إصدار من V8 إلى الإصدار التالي.

تختلف النتيجة التي تم إرجاعها عن الإحصائيات التي تم إرجاعها بواسطة `v8.getHeapSpaceStatistics()` في أن `vm.measureMemory()` تقيس الذاكرة التي يمكن الوصول إليها بواسطة كل سياق خاص بـ V8 في المثيل الحالي لمحرك V8، في حين أن نتيجة `v8.getHeapSpaceStatistics()` تقيس الذاكرة التي تشغلها كل مساحة كومة في مثيل V8 الحالي.

```js [ESM]
const vm = require('node:vm');
// قياس الذاكرة المستخدمة بواسطة السياق الرئيسي.
vm.measureMemory({ mode: 'summary' })
  // هذا هو نفسه vm.measureMemory()
  .then((result) => {
    // التنسيق الحالي هو:
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // الرجوع إلى السياق هنا حتى لا يتم جمع البيانات المهملة
    // حتى يكتمل القياس.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.7.0, v20.12.0 | تمت إضافة دعم `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | تمت إضافة دعم سمات الاستيراد إلى معلمة `importModuleDynamically`. |
| v6.3.0 | خيار `breakOnSigint` مدعوم الآن. |
| v0.3.1 | تمت الإضافة في: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رمز JavaScript المراد تجميعه وتشغيله.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الكائن [الذي تم تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) والذي سيستخدم كـ `global` عند تجميع وتشغيل `code`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد اسم الملف المستخدم في تتبعات المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم السطر التي يتم عرضها في تتبعات المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم العمود للسطر الأول التي يتم عرضها في تتبعات المكدس التي ينتجها هذا البرنامج النصي. **افتراضي:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `true`، إذا حدث [`Error`](/ar/nodejs/api/errors#class-error) أثناء تجميع `code`، يتم إرفاق سطر التعليمات البرمجية الذي تسبب في الخطأ بتتبع المكدس. **افتراضي:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتنفيذ `code` قبل إنهاء التنفيذ. إذا تم إنهاء التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فإن استقبال `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الموجودة للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **افتراضي:** `false`.
    - `cachedData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يوفر `Buffer` أو `TypedArray` أو `DataView` اختياريًا مع بيانات ذاكرة التخزين المؤقت للتعليمات البرمجية V8 للمصدر المقدم.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ar/nodejs/api/vm#vmconstantsuse_main_context_default_loader) يستخدم لتحديد كيفية تحميل الوحدات النمطية أثناء تقييم هذا البرنامج النصي عند استدعاء `import()`. هذا الخيار هو جزء من واجهة برمجة تطبيقات الوحدات النمطية التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، راجع [دعم `import()` الديناميكي في واجهات برمجة تطبيقات التجميع](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

تقوم الطريقة `vm.runInContext()` بتجميع `code`، وتشغيله في سياق `contextifiedObject`، ثم إرجاع النتيجة. لا يمكن للتعليمات البرمجية قيد التشغيل الوصول إلى النطاق المحلي. يجب أن يكون الكائن `contextifiedObject` قد تم [تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) مسبقًا باستخدام الطريقة [`vm.createContext()`](/ar/nodejs/api/vm#vmcreatecontextcontextobject-options).

إذا كانت `options` سلسلة، فإنها تحدد اسم الملف.

يقوم المثال التالي بتجميع وتنفيذ برامج نصية مختلفة باستخدام كائن [تم تحويله إلى سياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) واحد:

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v22.8.0, v20.18.0 | تقبل الآن الوسيطة `contextObject` قيمة `vm.constants.DONT_CONTEXTIFY`. |
| الإصدار v21.7.0, v20.12.0 | تمت إضافة دعم `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| الإصدار v17.0.0, v16.12.0 | تمت إضافة دعم سمات الاستيراد للمعامل `importModuleDynamically`. |
| الإصدار v14.6.0 | خيار `microtaskMode` مدعوم الآن. |
| الإصدار v10.0.0 | خيار `contextCodeGeneration` مدعوم الآن. |
| الإصدار v6.3.0 | خيار `breakOnSigint` مدعوم الآن. |
| الإصدار v0.3.1 | تمت إضافته في: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) شيفرة JavaScript المراد ترجمتها وتشغيلها.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ar/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إما [`vm.constants.DONT_CONTEXTIFY`](/ar/nodejs/api/vm#vmconstantsdont_contextify) أو كائن سيتم [إضفاء السياق عليه](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). إذا كانت `undefined`، سيتم إنشاء كائن سياقي فارغ للتوافق مع الإصدارات السابقة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد اسم الملف المستخدم في تتبعات المكدس التي ينتجها هذا النص البرمجي. **افتراضي:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم السطر التي تظهر في تتبعات المكدس التي ينتجها هذا النص البرمجي. **افتراضي:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم عمود السطر الأول التي تظهر في تتبعات المكدس التي ينتجها هذا النص البرمجي. **افتراضي:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، إذا حدث [`Error`](/ar/nodejs/api/errors#class-error) أثناء تجميع `code`، يتم إرفاق سطر الشفرة الذي تسبب في الخطأ بتتبع المكدس. **افتراضي:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتنفيذ `code` قبل إنهاء التنفيذ. إذا تم إنهاء التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فإن استقبال `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الحالية للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **افتراضي:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مقروء من قِبل الإنسان للسياق الذي تم إنشاؤه حديثًا. **افتراضي:** `'VM Context i'`، حيث `i` هو فهرس رقمي تصاعدي للسياق الذي تم إنشاؤه.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [الأصل](https://developer.mozilla.org/en-US/docs/Glossary/Origin) المطابق للسياق الذي تم إنشاؤه حديثًا لأغراض العرض. يجب تنسيق الأصل مثل عنوان URL، ولكن مع المخطط والمضيف والمنفذ فقط (إذا لزم الأمر)، مثل قيمة الخاصية [`url.origin`](/ar/nodejs/api/url#urlorigin) لكائن [`URL`](/ar/nodejs/api/url#class-url). والأهم من ذلك، يجب أن تحذف هذه السلسلة الخط المائل اللاحق، لأنه يدل على مسار. **افتراضي:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على false، فإن أي استدعاءات لـ `eval` أو منشئات الوظائف (`Function`، `GeneratorFunction`، إلخ) ستطرح `EvalError`. **افتراضي:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على false، فإن أي محاولة لتجميع وحدة WebAssembly ستطرح `WebAssembly.CompileError`. **افتراضي:** `true`.

    - `cachedData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يوفر `Buffer` أو `TypedArray` اختياريًا، أو `DataView` مع بيانات ذاكرة التخزين المؤقت للتعليمات البرمجية في V8 للمصدر المقدم.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ar/nodejs/api/vm#vmconstantsuse_main_context_default_loader) يستخدم لتحديد كيفية تحميل الوحدات النمطية أثناء تقييم هذا البرنامج النصي عند استدعاء `import()`. هذا الخيار هو جزء من واجهة برمجة تطبيقات الوحدات النمطية التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، راجع [دعم `import()` الديناميكي في واجهات برمجة تطبيقات التجميع](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تعيينه على `afterEvaluate`، فسيتم تشغيل المهام الصغيرة (المهام المجدولة من خلال `Promise` و `async function`) مباشرة بعد تشغيل البرنامج النصي. يتم تضمينها في نطاقات `timeout` و `breakOnSigint` في هذه الحالة.

- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) نتيجة آخر عبارة تم تنفيذها في البرنامج النصي.

هذه الطريقة هي اختصار لـ `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. إذا كانت `options` عبارة عن سلسلة، فإنها تحدد اسم الملف.

إنه يفعل عدة أشياء في وقت واحد:

يقوم المثال التالي بتجميع وتنفيذ التعليمات البرمجية التي تزيد متغيرًا عامًا وتعيين متغير جديد. هذه المتغيرات العامة موجودة في `contextObject`.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// تطبع: { animal: 'cat', count: 3, name: 'kitty' }

// سيتم طرح هذا إذا تم إنشاء السياق من كائن سياقي.
// يسمح vm.constants.DONT_CONTEXTIFY بإنشاء سياقات بكائنات عامة عادية يمكن تجميدها.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.7.0, v20.12.0 | تمت إضافة دعم `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | تمت إضافة دعم سمات الاستيراد إلى المعامل `importModuleDynamically`. |
| v6.3.0 | الخيار `breakOnSigint` مدعوم الآن. |
| v0.3.1 | تمت إضافته في: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) كود JavaScript المراد تجميعه وتشغيله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد اسم الملف المستخدم في تتبعات المكدس التي ينتجها هذا البرنامج النصي. **الافتراضي:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم السطر التي يتم عرضها في تتبعات المكدس التي ينتجها هذا البرنامج النصي. **الافتراضي:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد إزاحة رقم عمود السطر الأول التي يتم عرضها في تتبعات المكدس التي ينتجها هذا البرنامج النصي. **الافتراضي:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، إذا حدث [`Error`](/ar/nodejs/api/errors#class-error) أثناء تجميع `code`، فسيتم إرفاق سطر التعليمات البرمجية الذي تسبب في الخطأ بتتبع المكدس. **الافتراضي:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد المللي ثانية لتنفيذ `code` قبل إنهاء التنفيذ. إذا تم إنهاء التنفيذ، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error). يجب أن تكون هذه القيمة عددًا صحيحًا موجبًا تمامًا.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة `true`، فإن استقبال `SIGINT` (+) سينهي التنفيذ ويطرح [`Error`](/ar/nodejs/api/errors#class-error). يتم تعطيل المعالجات الموجودة للحدث التي تم إرفاقها عبر `process.on('SIGINT')` أثناء تنفيذ البرنامج النصي، ولكنها تستمر في العمل بعد ذلك. **الافتراضي:** `false`.
    - `cachedData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) يوفر `Buffer` أو `TypedArray` أو `DataView` اختياريًا مع بيانات ذاكرة التخزين المؤقت للتعليمات البرمجية لـ V8 للمصدر المقدم.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ar/nodejs/api/vm#vmconstantsuse_main_context_default_loader) يُستخدم لتحديد كيفية تحميل الوحدات النمطية أثناء تقييم هذا البرنامج النصي عند استدعاء `import()`. هذا الخيار هو جزء من واجهة برمجة تطبيقات الوحدات النمطية التجريبية. لا نوصي باستخدامه في بيئة إنتاج. للحصول على معلومات مفصلة، راجع [دعم `import()` الديناميكي في واجهات برمجة تطبيقات التجميع](/ar/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) نتيجة آخر عبارة تم تنفيذها في البرنامج النصي.

يقوم `vm.runInThisContext()` بتجميع `code` وتشغيله في سياق `global` الحالي وإرجاع النتيجة. لا يمكن للتعليمات البرمجية التي يتم تشغيلها الوصول إلى النطاق المحلي، ولكن يمكنها الوصول إلى كائن `global` الحالي.

إذا كانت `options` سلسلة، فإنه يحدد اسم الملف.

يوضح المثال التالي استخدام كل من `vm.runInThisContext()` ووظيفة JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) لتشغيل نفس التعليمات البرمجية:

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
نظرًا لأن `vm.runInThisContext()` لا يمكنه الوصول إلى النطاق المحلي، فإن `localVar` لا يتغير. في المقابل، [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *يمكنها* الوصول إلى النطاق المحلي، لذلك تتغير قيمة `localVar`. بهذه الطريقة، يشبه `vm.runInThisContext()` إلى حد كبير [استدعاء `eval()` غير مباشر](https://es5.github.io/#x10.4.2)، على سبيل المثال `(0,eval)('code')`.


## مثال: تشغيل خادم HTTP داخل جهاز ظاهري {#example-running-an-http-server-within-a-vm}

عند استخدام إما [`script.runInThisContext()`](/ar/nodejs/api/vm#scriptruninthiscontextoptions) أو [`vm.runInThisContext()`](/ar/nodejs/api/vm#vmruninthiscontextcode-options)، يتم تنفيذ التعليمات البرمجية داخل سياق V8 العام الحالي. سيكون للتعليمات البرمجية التي تم تمريرها إلى سياق VM هذا نطاق معزول خاص بها.

لتشغيل خادم ويب بسيط باستخدام وحدة `node:http`، يجب على التعليمات البرمجية التي تم تمريرها إلى السياق إما استدعاء `require('node:http')` بنفسها، أو الحصول على مرجع إلى وحدة `node:http` التي تم تمريرها إليها. على سبيل المثال:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
تشترك `require()` في الحالة أعلاه مع السياق الذي تم تمريرها منه. قد يؤدي ذلك إلى مخاطر عند تنفيذ تعليمات برمجية غير موثوق بها، على سبيل المثال تغيير الكائنات في السياق بطرق غير مرغوب فيها.

## ماذا يعني "تحديد سياق" كائن؟ {#what-does-it-mean-to-"contextify"-an-object?}

يتم تنفيذ جميع JavaScript داخل Node.js في نطاق "سياق". وفقًا لـ [دليل V8 Embedder](https://v8.dev/docs/embed#contexts):

عند استدعاء الأسلوب `vm.createContext()` مع كائن، سيتم استخدام وسيطة `contextObject` لتغليف الكائن العام لمثيل جديد من سياق V8 (إذا كانت `contextObject` هي `undefined`، فسيتم إنشاء كائن جديد من السياق الحالي قبل تحديد سياقه). يوفر سياق V8 هذا `code` الذي يتم تشغيله باستخدام أساليب وحدة `node:vm` مع بيئة عالمية معزولة يمكنه العمل داخلها. إن عملية إنشاء سياق V8 وربطه بـ `contextObject` في السياق الخارجي هي ما تشير إليه هذه الوثيقة على أنه "تحديد سياق" الكائن.

سيؤدي تحديد السياق إلى بعض الخصائص الفريدة لقيمة `globalThis` في السياق. على سبيل المثال، لا يمكن تجميدها، وهي ليست مرجعًا يساوي `contextObject` في السياق الخارجي.

```js [ESM]
const vm = require('node:vm');

// خيار `contextObject` غير المحدد يجعل الكائن العام محدد السياق.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// لا يمكن تجميد كائن عام محدد السياق.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
لإنشاء سياق مع كائن عام عادي والوصول إلى وكيل عالمي في السياق الخارجي بخصائص فريدة أقل، حدد `vm.constants.DONT_CONTEXTIFY` كوسيطة `contextObject`.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

هذا الثابت، عند استخدامه كوسيط `contextObject` في واجهات برمجة تطبيقات vm، يوجه Node.js لإنشاء سياق دون تغليف الكائن العام الخاص به بكائن آخر بطريقة خاصة بـ Node.js. نتيجة لذلك، ستتصرف قيمة `globalThis` داخل السياق الجديد بشكل أقرب إلى قيمة عادية.

```js [ESM]
const vm = require('node:vm');

// استخدم vm.constants.DONT_CONTEXTIFY لتجميد الكائن العام.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
عند استخدام `vm.constants.DONT_CONTEXTIFY` كوسيط `contextObject` لـ [`vm.createContext()`](/ar/nodejs/api/vm#vmcreatecontextcontextobject-options)، فإن الكائن الذي تم إرجاعه هو كائن شبيه بالوكيل للكائن العام في السياق الذي تم إنشاؤه حديثًا مع عدد أقل من المراوغات الخاصة بـ Node.js. إنه يساوي مرجعًا قيمة `globalThis` في السياق الجديد، ويمكن تعديله من خارج السياق، ويمكن استخدامه للوصول إلى العناصر المضمنة في السياق الجديد مباشرةً.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// الكائن الذي تم إرجاعه يساوي مرجعًا globalThis في السياق الجديد.
console.log(vm.runInContext('globalThis', context) === context);  // true

// يمكن استخدامه للوصول إلى المتغيرات العامة في السياق الجديد مباشرةً.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// يمكن تجميده ويؤثر على السياق الداخلي.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## تفاعلات المهلة مع المهام غير المتزامنة والوعود {#timeout-interactions-with-asynchronous-tasks-and-promises}

يمكن لـ `Promise`s و `async function`s جدولة المهام التي يتم تشغيلها بواسطة محرك JavaScript بشكل غير متزامن. افتراضيًا، يتم تشغيل هذه المهام بعد الانتهاء من تنفيذ جميع وظائف JavaScript الموجودة في المكدس الحالي. يسمح هذا بالهروب من وظائف خيارات `timeout` و `breakOnSigint`.

على سبيل المثال، يقوم الكود التالي الذي يتم تنفيذه بواسطة `vm.runInNewContext()` بمهلة 5 مللي ثانية بجدولة حلقة لانهائية للتشغيل بعد حل الوعد. لا يتم مقاطعة الحلقة المجدولة أبدًا بواسطة المهلة:

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// تتم طباعة هذا *قبل* 'entering loop' (!)
console.log('done executing');
```
يمكن معالجة ذلك عن طريق تمرير `microtaskMode: 'afterEvaluate'` إلى الكود الذي ينشئ `Context`:

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
في هذه الحالة، سيتم تشغيل المهمة الدقيقة المجدولة من خلال `promise.then()` قبل العودة من `vm.runInNewContext()`، وسيتم مقاطعتها بواسطة وظيفة `timeout`. ينطبق هذا فقط على التعليمات البرمجية التي تعمل في `vm.Context`، لذلك على سبيل المثال [`vm.runInThisContext()`](/ar/nodejs/api/vm#vmruninthiscontextcode-options) لا يأخذ هذا الخيار.

يتم إدخال ردود نداء الوعد في قائمة انتظار المهام الدقيقة للسياق الذي تم إنشاؤها فيه. على سبيل المثال، إذا تم استبدال `() =\> loop()` بـ `loop` فقط في المثال أعلاه، فسيتم دفع `loop` إلى قائمة انتظار المهام الدقيقة العالمية، لأنها دالة من السياق الخارجي (الرئيسي)، وبالتالي ستكون قادرة أيضًا على الهروب من المهلة.

إذا تم توفير وظائف الجدولة غير المتزامنة مثل `process.nextTick()` و `queueMicrotask()` و `setTimeout()` و `setImmediate()` وما إلى ذلك داخل `vm.Context`، فستتم إضافة الوظائف التي تم تمريرها إليها إلى قوائم الانتظار العالمية، والتي يتم مشاركتها بواسطة جميع السياقات. لذلك، فإن ردود النداء التي تم تمريرها إلى هذه الوظائف لا يمكن التحكم فيها من خلال المهلة أيضًا.


## دعم `import()` الديناميكي في واجهات برمجة تطبيقات التحويل البرمجي {#support-of-dynamic-import-in-compilation-apis}

تدعم واجهات برمجة التطبيقات التالية خيار `importModuleDynamically` لتمكين `import()` الديناميكي في التعليمات البرمجية التي يتم تجميعها بواسطة وحدة vm.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

لا يزال هذا الخيار جزءًا من واجهة برمجة تطبيقات الوحدات التجريبية. لا نوصي باستخدامه في بيئة إنتاج.

### عندما لا يتم تحديد الخيار `importModuleDynamically` أو غير محدد {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

إذا لم يتم تحديد هذا الخيار، أو إذا كان `undefined`، فلا يزال بإمكان واجهات برمجة تطبيقات vm تجميع التعليمات البرمجية التي تحتوي على `import()`، ولكن عندما يتم تنفيذ التعليمات البرمجية المجمعة وتستدعي `import()` بالفعل، سترفض النتيجة مع [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/ar/nodejs/api/errors#err_vm_dynamic_import_callback_missing).

### عندما يكون `importModuleDynamically` هو `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

هذا الخيار غير مدعوم حاليًا لـ `vm.SourceTextModule`.

باستخدام هذا الخيار، عندما يتم بدء `import()` في التعليمات البرمجية المجمعة، سيستخدم Node.js أداة تحميل ESM الافتراضية من السياق الرئيسي لتحميل الوحدة المطلوبة وإعادتها إلى التعليمات البرمجية قيد التنفيذ.

يمنح هذا حق الوصول إلى وحدات Node.js المضمنة مثل `fs` أو `http` إلى التعليمات البرمجية التي يتم تجميعها. إذا تم تنفيذ التعليمات البرمجية في سياق مختلف، فاعلم أن الكائنات التي تم إنشاؤها بواسطة الوحدات النمطية التي تم تحميلها من السياق الرئيسي لا تزال من السياق الرئيسي وليست `instanceof` لفئات مضمنة في السياق الجديد.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL loaded from the main context is not an instance of the Function
// class in the new context.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL loaded from the main context is not an instance of the Function
// class in the new context.
script.runInNewContext().then(console.log);
```
:::

يسمح هذا الخيار أيضًا للبرنامج النصي أو الوظيفة بتحميل وحدات المستخدم:

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Write test.js and test.txt to the directory where the current script
// being run is located.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compile a script that loads test.mjs and then test.json
// as if the script is placed in the same directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Write test.js and test.txt to the directory where the current script
// being run is located.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compile a script that loads test.mjs and then test.json
// as if the script is placed in the same directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

هناك بعض المحاذير المتعلقة بتحميل وحدات المستخدم باستخدام أداة التحميل الافتراضية من السياق الرئيسي:


### عندما تكون `importModuleDynamically` دالة {#when-importmoduledynamically-is-a-function}

عندما تكون `importModuleDynamically` دالة، سيتم استدعاؤها عند استدعاء `import()` في الكود المُترجم ليقوم المستخدمون بتخصيص كيفية تجميع وتقييم الوحدة المطلوبة. حاليًا، يجب تشغيل مثيل Node.js باستخدام العلامة `--experimental-vm-modules` لكي يعمل هذا الخيار. إذا لم يتم تعيين العلامة، فسيتم تجاهل هذا الاستدعاء. إذا كان الكود الذي تم تقييمه يستدعي فعليًا `import()`، فسيتم رفض النتيجة باستخدام [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/ar/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag).

يحتوي الاستدعاء `importModuleDynamically(specifier, referrer, importAttributes)` على التوقيع التالي:

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المُحدد الذي تم تمريره إلى `import()`
- `referrer` [\<vm.Script\>](/ar/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/ar/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) المُحيل هو `vm.Script` المُجمَّع لـ `new vm.Script`، و `vm.runInThisContext`، و `vm.runInContext` و `vm.runInNewContext`. إنه `Function` المُجمَّعة لـ `vm.compileFunction`، و `vm.SourceTextModule` المُجمَّعة لـ `new vm.SourceTextModule`، وكائن السياق `Object` لـ `vm.createContext()`.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) قيمة `"with"` التي تم تمريرها إلى المعامل الاختياري [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call)، أو كائن فارغ إذا لم يتم توفير أي قيمة.
- الإرجاع: [\<Module Namespace Object\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/ar/nodejs/api/vm#class-vmmodule) يُوصى بإرجاع `vm.Module` للاستفادة من تتبع الأخطاء، وتجنب المشكلات المتعلقة بـ namespaces التي تحتوي على صادرات دالة `then`.

::: code-group
```js [ESM]
// يجب تشغيل هذا البرنامج النصي باستخدام --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // البرنامج النصي المُجمع
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// يجب تشغيل هذا البرنامج النصي باستخدام --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // البرنامج النصي المُجمع
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

