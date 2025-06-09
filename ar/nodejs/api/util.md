---
title: توثيق Node.js - الأدوات المساعدة
description: توثيق Node.js لوحدة 'util' التي توفر وظائف مساعدة لتطبيقات Node.js، بما في ذلك تصحيح الأخطاء، وفحص الكائنات، والمزيد.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الأدوات المساعدة | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق Node.js لوحدة 'util' التي توفر وظائف مساعدة لتطبيقات Node.js، بما في ذلك تصحيح الأخطاء، وفحص الكائنات، والمزيد.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الأدوات المساعدة | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق Node.js لوحدة 'util' التي توفر وظائف مساعدة لتطبيقات Node.js، بما في ذلك تصحيح الأخطاء، وفحص الكائنات، والمزيد.
---


# Util {#util}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

تدعم وحدة `node:util` احتياجات واجهات برمجة تطبيقات Node.js الداخلية. العديد من الأدوات المساعدة مفيدة لمطوري التطبيقات والوحدات النمطية أيضًا. للوصول إليه:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**أُضيف في: v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة `async`
- الإرجاع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة بنمط رد النداء

تأخذ دالة `async` (أو دالة تُرجع `Promise`) وتُرجع دالة تتبع نمط رد النداء الذي يبدأ بالخطأ، أي تأخذ رد نداء `(err, value) => ...` كآخر وسيط. في رد النداء، سيكون الوسيط الأول هو سبب الرفض (أو `null` إذا تم حل `Promise`)، وسيكون الوسيط الثاني هو القيمة التي تم حلها.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
سيطبع:

```text [TEXT]
hello world
```
يتم تنفيذ رد النداء بشكل غير متزامن، وسيكون له تتبع مكدس محدود. إذا طرح رد النداء استثناءً، فسوف تصدر العملية حدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception)، وإذا لم تتم معالجته فسيخرج.

نظرًا لأن `null` له معنى خاص كوسيط أول لرد النداء، إذا رفضت دالة مُغلَّفة `Promise` بقيمة خاطئة كسبب، فسيتم تغليف القيمة في `Error` مع تخزين القيمة الأصلية في حقل باسم `reason`.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**أُضيف في: الإصدار v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة تحدد جزء التطبيق الذي يتم إنشاء وظيفة `debuglog` له.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد نداء يتم استدعاؤه في المرة الأولى التي يتم فيها استدعاء وظيفة التسجيل بوسيطة دالة وهي وظيفة تسجيل محسنة بشكل أكبر.
- يُرجع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) وظيفة التسجيل

تُستخدم طريقة `util.debuglog()` لإنشاء دالة تكتب بشكل مشروط رسائل تصحيح الأخطاء إلى `stderr` بناءً على وجود متغير البيئة `NODE_DEBUG`. إذا ظهر اسم `section` داخل قيمة متغير البيئة هذا، فستعمل الدالة التي تم إرجاعها بشكل مشابه لـ [`console.error()`](/ar/nodejs/api/console#consoleerrordata-args). بخلاف ذلك، ستكون الدالة التي تم إرجاعها عملية لا تفعل شيئًا.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
إذا تم تشغيل هذا البرنامج مع `NODE_DEBUG=foo` في البيئة، فسيخرج شيئًا مثل:

```bash [BASH]
FOO 3245: hello from foo [123]
```
حيث `3245` هو معرف العملية. إذا لم يتم تشغيله مع تعيين متغير البيئة هذا، فلن يطبع أي شيء.

يدعم `section` أحرف البدل أيضًا:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
إذا تم تشغيله مع `NODE_DEBUG=foo*` في البيئة، فسيخرج شيئًا مثل:

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
يمكن تحديد أسماء `section` متعددة مفصولة بفواصل في متغير البيئة `NODE_DEBUG`: `NODE_DEBUG=fs,net,tls`.

يمكن استخدام وسيطة `callback` الاختيارية لاستبدال وظيفة التسجيل بدالة مختلفة لا تحتوي على أي تهيئة أو تغليف غير ضروري.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**أضيف في: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُستخدم الجالب `util.debuglog().enabled` لإنشاء اختبار يمكن استخدامه في الشروط بناءً على وجود متغير البيئة `NODE_DEBUG`. إذا ظهر اسم `section` داخل قيمة متغير البيئة هذا، فستكون القيمة المُرجعة `true`. إذا لم يكن الأمر كذلك، فستكون القيمة المُرجعة `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
إذا تم تشغيل هذا البرنامج مع `NODE_DEBUG=foo` في البيئة، فسيخرج شيئًا مثل:

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**أضيف في: v14.9.0**

اسم مستعار لـ `util.debuglog`. يسمح الاستخدام بقراءة لا تعني التسجيل عند استخدام `util.debuglog().enabled` فقط.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | يتم إصدار تحذيرات الإهمال مرة واحدة فقط لكل رمز. |
| v0.8.0 | أضيف في: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي تم إهمالها.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رسالة تحذير لعرضها عند استدعاء الدالة المهملة.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رمز إهمال. راجع [قائمة واجهات برمجة التطبيقات المهملة](/ar/nodejs/api/deprecations#list-of-deprecated-apis) للحصول على قائمة بالرموز.
- الإرجاع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المهملة الملتفة لإصدار تحذير.

يُغلف الأسلوب `util.deprecate()` الدالة `fn` (والتي قد تكون دالة أو فئة) بطريقة تجعلها مُعلمة على أنها مهملة.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');
```
عند استدعائها، سترجع `util.deprecate()` دالة ستصدر `DeprecationWarning` باستخدام الحدث [`'warning'`](/ar/nodejs/api/process#event-warning). سيتم إصدار التحذير وطباعته إلى `stderr` في المرة الأولى التي يتم فيها استدعاء الدالة المُرجعة. بعد إصدار التحذير، يتم استدعاء الدالة المُغلفة دون إصدار تحذير.

إذا تم توفير نفس `code` الاختياري في عدة استدعاءات لـ `util.deprecate()`، فسيتم إصدار التحذير مرة واحدة فقط لهذا `code`.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Emits a deprecation warning with code DEP0001
fn2(); // Does not emit a deprecation warning because it has the same code
```
إذا تم استخدام علامات سطر الأوامر `--no-deprecation` أو `--no-warnings`، أو إذا تم تعيين الخاصية `process.noDeprecation` على `true` *قبل* أول تحذير إهمال، فلن يفعل الأسلوب `util.deprecate()` شيئًا.

إذا تم تعيين علامات سطر الأوامر `--trace-deprecation` أو `--trace-warnings`، أو تم تعيين الخاصية `process.traceDeprecation` على `true`، فسيتم طباعة تحذير وتتبع المكدس إلى `stderr` في المرة الأولى التي يتم فيها استدعاء الدالة المهملة.

إذا تم تعيين علامة سطر الأوامر `--throw-deprecation`، أو تم تعيين الخاصية `process.throwDeprecation` على `true`، فسيتم طرح استثناء عند استدعاء الدالة المهملة.

تأخذ علامة سطر الأوامر `--throw-deprecation` والخاصية `process.throwDeprecation` الأسبقية على `--trace-deprecation` و `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.11.0 | تم تجاهل محدد `%c` الآن. |
| v12.0.0 | يتم الآن اعتبار وسيط `format` على هذا النحو فقط إذا كان يحتوي بالفعل على محددات تنسيق. |
| v12.0.0 | إذا لم يكن وسيط `format` سلسلة تنسيق، فإن تنسيق سلسلة الإخراج لم يعد يعتمد على نوع الوسيط الأول. يزيل هذا التغيير علامات الاقتباس الموجودة مسبقًا من السلاسل التي تم إخراجها عندما لم يكن الوسيط الأول سلسلة. |
| v11.4.0 | تدعم الآن محددات `%d` و `%f` و `%i` الرموز بشكل صحيح. |
| v11.4.0 | يحتوي الآن `depth` الخاص بـ `%o` على عمق افتراضي يبلغ 4 مرة أخرى. |
| v11.0.0 | سيعود خيار `depth` الخاص بـ `%o` الآن إلى العمق الافتراضي. |
| v10.12.0 | تدعم الآن محددات `%d` و `%i` BigInt. |
| v8.4.0 | يتم دعم محددات `%o` و `%O` الآن. |
| v0.5.3 | تمت إضافته في: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة تنسيق تشبه `printf`.

تقوم الطريقة `util.format()` بإرجاع سلسلة منسقة باستخدام الوسيط الأول كسلسلة تنسيق تشبه `printf` والتي يمكن أن تحتوي على صفر أو أكثر من محددات التنسيق. يتم استبدال كل محدد بالقيمة المحولة من الوسيط المقابل. المحددات المدعومة هي:

- `%s`: سيتم استخدام `String` لتحويل جميع القيم باستثناء `BigInt` و `Object` و `-0`. سيتم تمثيل قيم `BigInt` بـ `n` ويتم فحص الكائنات التي ليس لها دالة `toString` معرفة من قبل المستخدم باستخدام `util.inspect()` مع الخيارات `{ depth: 0, colors: false, compact: 3 }`.
- `%d`: سيتم استخدام `Number` لتحويل جميع القيم باستثناء `BigInt` و `Symbol`.
- `%i`: يتم استخدام `parseInt(value, 10)` لجميع القيم باستثناء `BigInt` و `Symbol`.
- `%f`: يتم استخدام `parseFloat(value)` لجميع القيم باستثناء `Symbol`.
- `%j`: JSON. يتم استبداله بالسلسلة `'[Circular]'` إذا كان الوسيط يحتوي على مراجع دائرية.
- `%o`: `Object`. تمثيل سلسلة لكائن بتنسيق كائن JavaScript عام. على غرار `util.inspect()` مع الخيارات `{ showHidden: true, showProxy: true }`. سيؤدي هذا إلى إظهار الكائن الكامل بما في ذلك الخصائص غير القابلة للتعداد والوكلاء.
- `%O`: `Object`. تمثيل سلسلة لكائن بتنسيق كائن JavaScript عام. على غرار `util.inspect()` بدون خيارات. سيؤدي هذا إلى إظهار الكائن الكامل باستثناء الخصائص غير القابلة للتعداد والوكلاء.
- `%c`: `CSS`. يتم تجاهل هذا المحدد وسيتخطى أي CSS تم تمريره.
- `%%`: علامة نسبة مئوية واحدة (`'%'`). هذا لا يستهلك وسيطًا.
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) السلسلة المنسقة

إذا لم يكن للمحدد وسيط مقابل، فإنه لا يتم استبداله:

```js [ESM]
util.format('%s:%s', 'foo');
// الإرجاع: 'foo:%s'
```
يتم تنسيق القيم التي ليست جزءًا من سلسلة التنسيق باستخدام `util.inspect()` إذا لم يكن نوعها `string`.

إذا تم تمرير وسائط أكثر إلى الطريقة `util.format()` من عدد المحددات، فسيتم ربط الوسائط الإضافية بالسلسلة التي تم إرجاعها، مفصولة بمسافات:

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// الإرجاع: 'foo:bar baz'
```
إذا لم يكن الوسيط الأول يحتوي على محدد تنسيق صالح، فإن `util.format()` تُرجع سلسلة عبارة عن ربط لجميع الوسائط مفصولة بمسافات:

```js [ESM]
util.format(1, 2, 3);
// الإرجاع: '1 2 3'
```
إذا تم تمرير وسيط واحد فقط إلى `util.format()`، فسيتم إرجاعه كما هو دون أي تنسيق:

```js [ESM]
util.format('%% %s');
// الإرجاع: '%% %s'
```
`util.format()` هي طريقة متزامنة مخصصة كأداة لتصحيح الأخطاء. يمكن أن يكون لبعض قيم الإدخال حمل أداء كبير يمكن أن يحظر حلقة الأحداث. استخدم هذه الوظيفة بحذر ولا تستخدمها أبدًا في مسار التعليمات البرمجية الساخن.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**تمت إضافته في: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

هذه الدالة مطابقة لـ [`util.format()`](/ar/nodejs/api/util#utilformatformat-args)، باستثناء أنها تأخذ وسيطة `inspectOptions` التي تحدد الخيارات التي يتم تمريرها إلى [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options).

```js [ESM]
util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
// Returns 'See object { foo: 42 }', where `42` is colored as a number
// when printed to a terminal.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.3.0 | تمت إعادة تسمية واجهة برمجة التطبيقات من `util.getCallSite` إلى `util.getCallSites()`. |
| v22.9.0 | تمت إضافته في: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد اختياري للإطارات المراد التقاطها ككائنات موقع الاستدعاء. **افتراضي:** `10`. النطاق المسموح به بين 1 و 200.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) اختياري
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إعادة بناء الموقع الأصلي في تتبع المكدس من خريطة المصدر. يتم تمكينه افتراضيًا باستخدام العلامة `--enable-source-maps`.
  
 
- الإرجاع: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مصفوفة من كائنات موقع الاستدعاء
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إرجاع اسم الدالة المرتبطة بموقع الاستدعاء هذا.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إرجاع اسم المورد الذي يحتوي على البرنامج النصي للدالة لموقع الاستدعاء هذا.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إرجاع الرقم، المستند إلى 1، للسطر الخاص باستدعاء الدالة المرتبط.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إرجاع إزاحة العمود المستندة إلى 1 على السطر الخاص باستدعاء الدالة المرتبط.
  
 

إرجاع مصفوفة من كائنات موقع الاستدعاء التي تحتوي على مكدس الدالة المستدعية.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.column}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// A function to simulate another stack layer
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
من الممكن إعادة بناء المواقع الأصلية عن طريق تعيين الخيار `sourceMap` على `true`. إذا لم تكن خريطة المصدر متاحة، فسيكون الموقع الأصلي هو نفسه الموقع الحالي. عند تمكين العلامة `--enable-source-maps`، على سبيل المثال عند استخدام `--experimental-transform-types`، سيكون `sourceMap` صحيحًا افتراضيًا.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// With sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Without sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**أضيف في:** v9.7.0

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع اسم السلسلة لرمز خطأ رقمي يأتي من Node.js API. يعتمد الربط بين رموز الخطأ وأسماء الخطأ على النظام الأساسي. انظر [أخطاء النظام الشائعة](/ar/nodejs/api/errors#common-system-errors) لمعرفة أسماء الأخطاء الشائعة.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**أضيف في:** v16.0.0, v14.17.0

- Returns: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

إرجاع خريطة لجميع رموز خطأ النظام المتاحة من Node.js API. يعتمد الربط بين رموز الخطأ وأسماء الخطأ على النظام الأساسي. انظر [أخطاء النظام الشائعة](/ar/nodejs/api/errors#common-system-errors) لمعرفة أسماء الأخطاء الشائعة.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**أضيف في:** v23.1.0

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع رسالة السلسلة لرمز خطأ رقمي يأتي من Node.js API. يعتمد الربط بين رموز الخطأ ورسائل السلسلة على النظام الأساسي.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v5.0.0 | يمكن أن يشير المعامل `constructor` إلى فئة ES6 الآن. |
| v0.3.0 | أضيف في: v0.3.0 |
:::

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم بناء جملة فئة ES2015 والكلمة الأساسية `extends` بدلاً من ذلك.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

لا يُنصح باستخدام `util.inherits()`. يرجى استخدام الكلمتين الأساسيتين ES6 `class` و `extends` للحصول على دعم وراثة على مستوى اللغة. لاحظ أيضًا أن الأسلوبين [غير متوافقين دلاليًا](https://github.com/nodejs/node/issues/4179).

توريث أساليب النموذج الأولي من [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) إلى آخر. سيتم تعيين النموذج الأولي لـ `constructor` على كائن جديد تم إنشاؤه من `superConstructor`.

يضيف هذا بشكل أساسي بعض التحقق من صحة الإدخال فوق `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`. كميزة إضافية، سيكون `superConstructor` متاحًا من خلال الخاصية `constructor.super_`.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
مثال ES6 باستخدام `class` و `extends`:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.18.0 | إضافة دعم لـ `maxArrayLength` عند فحص `Set` و `Map`. |
| v17.3.0, v16.14.0 | خيار `numericSeparator` مدعوم الآن. |
| v13.0.0 | المراجع الدائرية تتضمن الآن علامة للمرجع. |
| v14.6.0, v12.19.0 | إذا كان `object` من `vm.Context` مختلف الآن، فلن تتلقى دالة الفحص المخصصة عليه وسيطات خاصة بالسياق بعد الآن. |
| v13.13.0, v12.17.0 | خيار `maxStringLength` مدعوم الآن. |
| v13.5.0, v12.16.0 | يتم فحص خصائص النموذج الأولي المعرفة من قبل المستخدم في حالة أن `showHidden` هو `true`. |
| v12.0.0 | تم تغيير القيمة الافتراضية لخيارات `compact` إلى `3` وتم تغيير القيمة الافتراضية لخيارات `breakLength` إلى `80`. |
| v12.0.0 | لم تعد الخصائص الداخلية تظهر في وسيطة السياق الخاصة بدالة فحص مخصصة. |
| v11.11.0 | يقبل خيار `compact` أرقامًا لوضع إخراج جديد. |
| v11.7.0 | تعرض ArrayBuffers الآن أيضًا محتوياتها الثنائية. |
| v11.5.0 | خيار `getters` مدعوم الآن. |
| v11.4.0 | تم تغيير القيمة الافتراضية لـ `depth` مرة أخرى إلى `2`. |
| v11.0.0 | تم تغيير القيمة الافتراضية لـ `depth` إلى `20`. |
| v11.0.0 | يقتصر إخراج الفحص الآن على حوالي 128 ميجابايت. لن يتم فحص البيانات التي تتجاوز هذا الحجم بالكامل. |
| v10.12.0 | خيار `sorted` مدعوم الآن. |
| v10.6.0 | أصبح فحص القوائم المرتبطة والكائنات المماثلة ممكنًا الآن حتى الحد الأقصى لحجم مكدس الاستدعاء. |
| v10.0.0 | يمكن الآن فحص إدخالات `WeakMap` و `WeakSet` أيضًا. |
| v9.9.0 | خيار `compact` مدعوم الآن. |
| v6.6.0 | يمكن لدوال الفحص المخصصة الآن إرجاع `this`. |
| v6.3.0 | خيار `breakLength` مدعوم الآن. |
| v6.1.0 | خيار `maxArrayLength` مدعوم الآن؛ على وجه الخصوص، يتم اقتطاع المصفوفات الطويلة افتراضيًا. |
| v6.1.0 | خيار `showProxy` مدعوم الآن. |
| v0.3.0 | تمت إضافته في: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي نوع بيانات JavaScript بدائي أو `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تضمين رموز وخصائص `object` غير القابلة للتعداد في النتيجة المنسقة. يتم أيضًا تضمين إدخالات [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) و [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) بالإضافة إلى خصائص النموذج الأولي المعرفة من قبل المستخدم (باستثناء خصائص الطريقة). **الافتراضي:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد مرات التكرار أثناء تنسيق `object`. هذا مفيد لفحص الكائنات الكبيرة. للتكرار حتى الحد الأقصى لحجم مكدس الاستدعاء، مرر `Infinity` أو `null`. **الافتراضي:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تصميم الإخراج باستخدام رموز ألوان ANSI. الألوان قابلة للتخصيص. راجع [تخصيص ألوان `util.inspect`](/ar/nodejs/api/util#customizing-utilinspect-colors). **الافتراضي:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `false`، فلن يتم استدعاء دوال `[util.inspect.custom](depth, opts, inspect)`. **الافتراضي:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيشمل فحص `Proxy` كائنات [`target` و `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology). **الافتراضي:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد عناصر `Array` و [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) و [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) و [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) و [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) و [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) المراد تضمينها عند التنسيق. اضبط على `null` أو `Infinity` لعرض جميع العناصر. اضبط على `0` أو قيمة سالبة لعدم عرض أي عناصر. **الافتراضي:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الأحرف المراد تضمينها عند التنسيق. اضبط على `null` أو `Infinity` لعرض جميع العناصر. اضبط على `0` أو قيمة سالبة لعدم عرض أي أحرف. **الافتراضي:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطول الذي يتم عنده تقسيم قيم الإدخال عبر أسطر متعددة. اضبط على `Infinity` لتنسيق الإدخال كسلسلة واحدة (بالاشتراك مع `compact` مضبوطًا على `true` أو أي رقم >= `1`). **الافتراضي:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يؤدي ضبط هذا على `false` إلى عرض كل مفتاح كائن على سطر جديد. سينقطع على أسطر جديدة في النص الذي يزيد طوله عن `breakLength`. إذا تم تعيينه على رقم، فسيتم تجميع أكثر `n` العناصر الداخلية على سطر واحد طالما أن جميع الخصائص تتناسب مع `breakLength`. يتم أيضًا تجميع عناصر المصفوفة القصيرة معًا. لمزيد من المعلومات، راجع المثال أدناه. **الافتراضي:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) إذا تم تعيينه على `true` أو دالة، فسيتم فرز جميع خصائص الكائن وإدخالات `Set` و `Map` في السلسلة الناتجة. إذا تم تعيينه على `true`، فسيتم استخدام [الفرز الافتراضي](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). إذا تم تعيينه على دالة، فسيتم استخدامه كـ [دالة مقارنة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تعيينه على `true`، فسيتم فحص دوال الجلب. إذا تم تعيينه على `'get'`، فسيتم فحص دوال الجلب فقط بدون مُعيِّن مطابق. إذا تم تعيينه على `'set'`، فسيتم فحص دوال الجلب فقط مع مُعيِّن مطابق. قد يتسبب هذا في آثار جانبية اعتمادًا على دالة الجلب. **الافتراضي:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فسيتم استخدام شرطة سفلية لفصل كل ثلاثة أرقام في جميع الأرقام الكبيرة والأرقام. **الافتراضي:** `false`.
  
 
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تمثيل `object`.

تُرجع طريقة `util.inspect()` تمثيل سلسلة لـ `object` مخصص للتصحيح. قد يتغير إخراج `util.inspect` في أي وقت ولا ينبغي الاعتماد عليه برمجيًا. يمكن تمرير `options` إضافية لتغيير النتيجة. سيستخدم `util.inspect()` اسم المُنشئ و/أو `@@toStringTag` لإنشاء علامة تعريفية لقيمة تم فحصها.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
تشير المراجع الدائرية إلى مرساتها باستخدام فهرس مرجعي:

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
يفحص المثال التالي جميع خصائص كائن `util`:

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
يسلط المثال التالي الضوء على تأثير خيار `compact`:

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // سطر طويل
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// يؤدي تعيين `compact` على false أو عدد صحيح إلى إنشاء إخراج أكثر سهولة للقراءة.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// سيؤدي تعيين `breakLength` على سبيل المثال 150 إلى طباعة نص "Lorem ipsum" في سطر واحد.
```
يسمح خيار `showHidden` بفحص إدخالات [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) و [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet). إذا كان هناك عدد إدخالات أكبر من `maxArrayLength`، فلا يوجد ضمان بشأن الإدخالات التي يتم عرضها. وهذا يعني أن استرداد نفس إدخالات [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) مرتين قد يؤدي إلى إخراج مختلف. علاوة على ذلك، قد يتم جمع الإدخالات التي لا تحتوي على مراجع قوية متبقية كقمامة في أي وقت.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
يضمن خيار `sorted` أن ترتيب إدراج خصائص الكائن لا يؤثر على نتيجة `util.inspect()`.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` تأتي قبل `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` تأتي قبل `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` تأتي قبل `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` تأتي قبل `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
يضيف خيار `numericSeparator` شرطة سفلية كل ثلاثة أرقام لجميع الأرقام.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` هي طريقة متزامنة مخصصة للتصحيح. يبلغ الحد الأقصى لطول الإخراج الخاص بها 128 ميجابايت تقريبًا. سيتم اقتطاع المدخلات التي تؤدي إلى إخراج أطول.


### تخصيص ألوان `util.inspect` {#customizing-utilinspect-colors}

يمكن تخصيص إخراج الألوان (إذا كان ممكنًا) لـ `util.inspect` عالميًا عبر الخصائص `util.inspect.styles` و `util.inspect.colors`.

`util.inspect.styles` هي خريطة تربط اسم نمط بلون من `util.inspect.colors`.

الأنماط الافتراضية والألوان المرتبطة بها هي:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (بدون نمط)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (مثل، `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

يستخدم تنسيق الألوان رموز تحكم ANSI التي قد لا تكون مدعومة على جميع المحطات الطرفية. للتحقق من دعم الألوان، استخدم [`tty.hasColors()`](/ar/nodejs/api/tty#writestreamhascolorscount-env).

يتم سرد رموز التحكم المحددة مسبقًا أدناه (مجمعة كـ "Modifiers" و "Foreground colors" و "Background colors").

#### المُعدِّلات (Modifiers) {#modifiers}

يختلف دعم المُعدِّلات عبر المحطات الطرفية المختلفة. سيتم تجاهلها في الغالب إذا لم تكن مدعومة.

- `reset` - يعيد تعيين جميع مُعدِّلات (الألوان) إلى إعداداتها الافتراضية
- **bold** - اجعل النص غامقًا
- *italic* - اجعل النص مائلًا
- underline - اجعل النص مسطرًا
- ~~strikethrough~~ - يضع خطًا أفقيًا عبر مركز النص (الاسم المستعار: `strikeThrough`، `crossedout`، `crossedOut`)
- `hidden` - يطبع النص، لكن يجعله غير مرئي (الاسم المستعار: conceal)
- dim - تقليل شدة اللون (الاسم المستعار: `faint`)
- overlined - اجعل النص أعلاه خط
- blink - يخفي ويظهر النص في فاصل زمني
- inverse - تبديل ألوان المقدمة والخلفية (الاسم المستعار: `swapcolors`، `swapColors`)
- doubleunderline - اجعل النص مسطرًا بخطين (الاسم المستعار: `doubleUnderline`)
- framed - ارسم إطارًا حول النص

#### ألوان المقدمة (Foreground colors) {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (الاسم المستعار: `grey`، `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### ألوان الخلفية (Background colors) {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (الاسم المستعار: `bgGrey`، `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### وظائف الفحص المخصصة على الكائنات {#custom-inspection-functions-on-objects}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.3.0, v16.14.0 | تمت إضافة وسيطة الفحص لمزيد من قابلية التشغيل البيني. |
| v0.1.97 | تمت الإضافة في: v0.1.97 |
:::

قد تحدد الكائنات أيضًا وظيفة [`[util.inspect.custom](depth, opts, inspect)`](/ar/nodejs/api/util#utilinspectcustom) الخاصة بها، والتي ستستدعيها `util.inspect()` وتستخدم نتيجتها عند فحص الكائن.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // خمس مسافات بادئة لأن هذا هو حجم "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// الإرجاع: "Box< true >"
```
عادةً ما تُرجع وظائف `[util.inspect.custom](depth, opts, inspect)` المخصصة سلسلة، ولكن قد تُرجع قيمة من أي نوع سيتم تنسيقها وفقًا لذلك بواسطة `util.inspect()`.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// الإرجاع: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.12.0 | تم تعريف هذا الآن كرمز مشترك. |
| v6.6.0 | تمت الإضافة في: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) يمكن استخدامه للإعلان عن وظائف فحص مخصصة.

بالإضافة إلى إمكانية الوصول إليه من خلال `util.inspect.custom`، يتم [تسجيل هذا الرمز عالميًا](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) ويمكن الوصول إليه في أي بيئة كـ `Symbol.for('nodejs.util.inspect.custom')`.

يتيح استخدام هذا كتابة التعليمات البرمجية بطريقة قابلة للنقل، بحيث يتم استخدام وظيفة الفحص المخصصة في بيئة Node.js ويتم تجاهلها في المتصفح. يتم تمرير الدالة `util.inspect()` نفسها كحجة ثالثة إلى وظيفة الفحص المخصصة للسماح بمزيد من قابلية النقل.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// طباعة Password <xxxxxxxx>
```
راجع [وظائف الفحص المخصصة على الكائنات](/ar/nodejs/api/util#custom-inspection-functions-on-objects) لمزيد من التفاصيل.


### ‏`util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**تمت الإضافة في: الإصدار v6.4.0**

تسمح قيمة `defaultOptions` بتخصيص الخيارات الافتراضية التي تستخدمها `util.inspect`. هذا مفيد لوظائف مثل `console.log` أو `util.format` التي تستدعي ضمنيًا `util.inspect`. يجب تعيينها إلى كائن يحتوي على واحد أو أكثر من خيارات [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) الصحيحة. كما يتم دعم تعيين خصائص الخيار مباشرةً.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // يسجل المصفوفة المقتطعة
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // يسجل المصفوفة الكاملة
```
## ‏`util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**تمت الإضافة في: الإصدار v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- يُرجع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان هناك تساوي صارم عميق بين `val1` و `val2`. وإلا، فإنه يُرجع `false`.

راجع [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message) للحصول على مزيد من المعلومات حول المساواة الصارمة العميقة.

## الفئة: `util.MIMEType` {#class-utilmimetype}

**تمت الإضافة في: الإصدار v19.1.0، v18.13.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تنفيذ لـ [فئة MIMEType](https://bmeck.github.io/node-proposal-mime-api/).

وفقًا لاتفاقيات المتصفح، يتم تنفيذ جميع خصائص كائنات `MIMEType` كوظائف getter و setter على النموذج الأولي للفئة، بدلاً من خصائص البيانات على الكائن نفسه.

سلسلة MIME هي سلسلة منظمة تحتوي على مكونات ذات معنى متعددة. عند التحليل، يتم إرجاع كائن `MIMEType` يحتوي على خصائص لكل من هذه المكونات.

### الدالة البانية: ‏`new MIMEType(input)` {#constructor-new-mimetypeinput}

- ‏`input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) MIME الإدخال المراد تحليله

ينشئ كائن `MIMEType` جديدًا عن طريق تحليل `input`.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

سيتم طرح `TypeError` إذا لم يكن `input` MIME صالحًا. لاحظ أنه سيتم بذل جهد لإجبار القيم المعطاة على سلاسل. على سبيل المثال:

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// يطبع: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// يطبع: text/plain
```
:::


### ‏`mime.type` {#mimetype}

- ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

‏للحصول على وتعيين جزء النوع من MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### ‏`mime.subtype` {#mimesubtype}

- ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

‏للحصول على وتعيين جزء النوع الفرعي من MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### ‏`mime.essence` {#mimeessence}

- ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

‏للحصول على جوهر MIME. هذه الخاصية للقراءة فقط. استخدم ‏`mime.type`‏ أو ‏`mime.subtype`‏ لتغيير MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/ar/nodejs/api/util#class-utilmimeparams)

يحصل على كائن [`MIMEParams`](/ar/nodejs/api/util#class-utilmimeparams) الذي يمثل معلمات MIME. هذه الخاصية للقراءة فقط. انظر وثائق [`MIMEParams`](/ar/nodejs/api/util#class-utilmimeparams) للحصول على التفاصيل.

### `mime.toString()` {#mimetostring}

- العائدات: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تعيد طريقة `toString()` على كائن `MIMEType` MIME المتسلسل.

نظرًا للحاجة إلى الامتثال للمعايير، لا تسمح هذه الطريقة للمستخدمين بتخصيص عملية تسلسل MIME.

### `mime.toJSON()` {#mimetojson}

- العائدات: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم مستعار لـ [`mime.toString()`](/ar/nodejs/api/util#mimetostring).

يتم استدعاء هذه الطريقة تلقائيًا عند تسلسل كائن `MIMEType` باستخدام [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## الفئة: `util.MIMEParams` {#class-utilmimeparams}

**تمت الإضافة في: v19.1.0, v18.13.0**

توفر واجهة برمجة التطبيقات `MIMEParams` الوصول للقراءة والكتابة إلى معلمات `MIMEType`.

### المُنشئ: `new MIMEParams()` {#constructor-new-mimeparams}

يقوم بإنشاء كائن `MIMEParams` جديد بمعلمات فارغة

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إزالة جميع أزواج الاسم والقيمة التي يكون اسمها `name`.


### `mimeParams.entries()` {#mimeparamsentries}

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

يُرجع مُكرِّرًا لكل زوج اسم-قيمة في المعلمات. كل عنصر في المُكرِّر هو `Array` جافاسكربت. العنصر الأول في المصفوفة هو `name`، والعنصر الثاني في المصفوفة هو `value`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) سلسلة نصية أو `null` إذا لم يكن هناك زوج اسم-قيمة بالاسم المحدد `name`.

يُرجع قيمة أول زوج اسم-قيمة اسمه `name`. إذا لم تكن هناك أزواج كهذه، فسيتم إرجاع `null`.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان هناك زوج اسم-قيمة واحد على الأقل اسمه `name`.

### `mimeParams.keys()` {#mimeparamskeys}

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

يُرجع مُكرِّرًا على أسماء كل زوج اسم-قيمة.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُعيّن القيمة في كائن `MIMEParams` المرتبط بـ `name` إلى `value`. إذا كانت هناك أي أزواج اسم-قيمة موجودة مسبقًا أسماؤها `name`، فعيّن قيمة الزوج الأول من هذه الأزواج إلى `value`.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

إرجاع مُكرِّر عبر قيم كل زوج اسم-قيمة.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

اسم مستعار لـ [`mimeParams.entries()`](/ar/nodejs/api/util#mimeparamsentries).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | add support for allowing negative options in input `config`. |
| v20.0.0 | The API is no longer experimental. |
| v18.11.0, v16.19.0 | Add support for default values in input `config`. |
| v18.7.0, v16.17.0 | add support for returning detailed parse information using `tokens` in input `config` and returned properties. |
| v18.3.0, v16.17.0 | Added in: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يستخدم لتوفير وسيطات للتحليل ولتكوين المحلل اللغوي. يدعم `config` الخصائص التالية: 
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من سلاسل الوسيطات. **افتراضي:** `process.argv` مع إزالة `execPath` و `filename`.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يستخدم لوصف الوسيطات المعروفة للمحلل اللغوي. مفاتيح `options` هي الأسماء الطويلة للخيارات والقيم هي [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تقبل الخصائص التالية: 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع الوسيطة، والذي يجب أن يكون إما `boolean` أو `string`.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان يمكن توفير هذا الخيار عدة مرات. إذا كانت `true`، فسيتم جمع جميع القيم في مصفوفة. إذا كانت `false`، فستكون قيم الخيار هي آخر فوز. **افتراضي:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مستعار بحرف واحد للخيار.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) القيمة الافتراضية للخيار عندما لا يتم تعيينها بواسطة الوسيطات. يجب أن يكون من نفس نوع الخاصية `type`. عندما تكون `multiple` هي `true`، يجب أن تكون مصفوفة.
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) هل يجب طرح خطأ عند مواجهة وسيطات غير معروفة، أو عند تمرير وسيطات لا تتطابق مع `type` المُكوَّن في `options`. **افتراضي:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان هذا الأمر يقبل الوسيطات الموضعية. **افتراضي:** `false` إذا كانت `strict` هي `true`، وإلا `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تسمح بتعيين خيارات منطقية بشكل صريح إلى `false` عن طريق إضافة البادئة `--no-` إلى اسم الخيار. **افتراضي:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إرجاع الرموز المميزة التي تم تحليلها. هذا مفيد لتوسيع السلوك المدمج، من إضافة فحوصات إضافية إلى إعادة معالجة الرموز المميزة بطرق مختلفة. **افتراضي:** `false`.
  
 
-  Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) وسيطات سطر الأوامر التي تم تحليلها: 
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تعيين لأسماء الخيارات التي تم تحليلها مع قيم [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أو [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) وسيطات موضعية.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) انظر قسم [parseArgs tokens](/ar/nodejs/api/util#parseargs-tokens). يتم إرجاعها فقط إذا كانت `config` تتضمن `tokens: true`.
  
 

يوفر واجهة برمجة تطبيقات ذات مستوى أعلى لتحليل وسيطات سطر الأوامر بدلاً من التفاعل مع `process.argv` مباشرةً. يأخذ مواصفات للوسيطات المتوقعة ويعيد كائنًا منظمًا مع الخيارات الموضعية التي تم تحليلها.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::


### `parseArgs` `tokens` {#parseargs-tokens}

تتوفر معلومات تحليل مفصلة لإضافة سلوكيات مخصصة عن طريق تحديد `tokens: true` في التكوين. تحتوي الرموز المميزة التي تم إرجاعها على خصائص تصف:

- جميع الرموز المميزة
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أحد 'option' أو 'positional' أو 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) فهرس العنصر في `args` الذي يحتوي على الرمز المميز. وبالتالي فإن وسيطة المصدر لرمز مميز هي `args[token.index]`.
  
 
- رموز الخيارات المميزة
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الاسم الطويل للخيار.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) كيف يتم استخدام الخيار في الوسائط، مثل `-f` أو `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) قيمة الخيار المحدد في الوسائط. غير محددة للخيارات المنطقية.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) ما إذا كانت قيمة الخيار محددة مضمنة، مثل `--foo=bar`.
  
 
- رموز المواضع المميزة
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قيمة الوسيطة الموضعية في الوسائط (أي `args[index]`).
  
 
- رمز فاصل الخيارات المميز

تكون الرموز المميزة التي تم إرجاعها بالترتيب الذي تمت مصادفته في وسائط الإدخال. تنتج الخيارات التي تظهر أكثر من مرة في الوسائط رمزًا لكل استخدام. تتوسع مجموعات الخيارات القصيرة مثل `-xy` إلى رمز مميز لكل خيار. لذا فإن `-xxx` تنتج ثلاثة رموز مميزة.

على سبيل المثال، لإضافة دعم لخيار منفي مثل `--no-color` (الذي يدعمه `allowNegative` عندما يكون نوع الخيار `boolean`)، يمكن إعادة معالجة الرموز المميزة التي تم إرجاعها لتغيير القيمة المخزنة للخيار المنفي.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// إعادة معالجة رموز الخيارات المميزة واستبدال القيم التي تم إرجاعها.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // تخزين foo:false لـ --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // إعادة حفظ القيمة بحيث يفوز آخر واحد إذا كان هناك --foo و --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// إعادة معالجة رموز الخيارات المميزة واستبدال القيم التي تم إرجاعها.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // تخزين foo:false لـ --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // إعادة حفظ القيمة بحيث يفوز آخر واحد إذا كان هناك --foo و --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

مثال على الاستخدام يوضح الخيارات المنفية، وعندما يتم استخدام خيار بطرق متعددة، يفوز آخر واحد.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

**أُضيف في: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

المحتويات الخام لملف `.env`.

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

بافتراض وجود مثال لملف `.env`:



::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.8.0 | استدعاء `promisify` على دالة تُرجع `Promise` تم إهماله. |
| v8.0.0 | أُضيف في: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

تأخذ دالة تتبع نمط رد الاتصال الشائع الذي يبدأ بالخطأ أولاً، أي تأخذ رد اتصال `(err, value) => ...` كوسيطة أخيرة، وتُرجع نسخة تُرجع promises.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});
```
أو، بشكل مكافئ باستخدام `async function`s:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

callStat();
```
إذا كانت هناك خاصية `original[util.promisify.custom]` موجودة، فسوف تُرجع `promisify` قيمتها، راجع [دوال promisified المخصصة](/ar/nodejs/api/util#custom-promisified-functions).

تفترض `promisify()` أن `original` هي دالة تأخذ رد اتصال كوسيطتها الأخيرة في جميع الحالات. إذا لم تكن `original` دالة، فسوف تُلقي `promisify()` خطأ. إذا كانت `original` دالة ولكن وسيطتها الأخيرة ليست رد اتصال يبدأ بالخطأ أولاً، فسيتم تمرير رد اتصال يبدأ بالخطأ أولاً كوسيطتها الأخيرة.

قد لا يعمل استخدام `promisify()` على طرق الفئة أو الطرق الأخرى التي تستخدم `this` كما هو متوقع ما لم يتم التعامل معها بشكل خاص:

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### دوال مخصصة موعودة {#custom-promisified-functions}

باستخدام الرمز `util.promisify.custom` يمكن تجاوز القيمة المعادة من [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal):

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// يطبع 'true'
```
يمكن أن يكون هذا مفيدًا في الحالات التي لا تتبع فيها الدالة الأصلية التنسيق القياسي لأخذ رد نداء مع خطأ أول كحجة أخيرة.

على سبيل المثال، مع دالة تأخذ `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
إذا تم تعريف `promisify.custom` ولكن ليس دالة، فسوف يطرح `promisify()` خطأً.

### ‏`util.promisify.custom` {#utilpromisifycustom}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 13.12.0، الإصدار 12.16.2 | تم تعريف هذا الآن كرمز مشترك. |
| الإصدار 8.0.0 | تمت إضافته في: الإصدار 8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) يمكن استخدامه للإعلان عن متغيرات موعودة مخصصة للدوال، انظر [دوال موعودة مخصصة](/ar/nodejs/api/util#custom-promisified-functions).

بالإضافة إلى إمكانية الوصول إليه عبر `util.promisify.custom`، يتم [تسجيل هذا الرمز عالميًا](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) ويمكن الوصول إليه في أي بيئة باسم `Symbol.for('nodejs.util.promisify.custom')`.

على سبيل المثال، مع دالة تأخذ `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**تمت إضافته في: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع `str` مع إزالة أي رموز ANSI escape.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// طباعة "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | styleText الآن مستقر. |
| v22.8.0, v20.18.0 | يحترم isTTY ومتغيرات البيئة مثل NO_COLORS و NODE_DISABLE_COLORS و FORCE_COLOR. |
| v21.7.0, v20.12.0 | تمت إضافته في: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تنسيق نص أو مصفوفة من تنسيقات النصوص المعرفة في `util.inspect.colors`.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) النص المراد تنسيقه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة true، يتم التحقق من `stream` لمعرفة ما إذا كان يمكنه التعامل مع الألوان. **افتراضي:** `true`.
    - `stream` [\<Stream\>](/ar/nodejs/api/stream#stream) دفق سيتم التحقق منه إذا كان يمكن تلوينه. **افتراضي:** `process.stdout`.
  
 

تقوم هذه الوظيفة بإرجاع نص منسق مع الأخذ في الاعتبار `format` الذي تم تمريره للطباعة في Terminal. وهي تدرك قدرات Terminal وتتصرف وفقًا للتكوين المحدد عبر متغيرات البيئة `NO_COLORS` و `NODE_DISABLE_COLORS` و `FORCE_COLOR`.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // التحقق مما إذا كان process.stderr يحتوي على TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // التحقق مما إذا كان process.stderr يحتوي على TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

توفر `util.inspect.colors` أيضًا تنسيقات نص مثل `italic` و `underline` ويمكنك الجمع بينهما:

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
عند تمرير مصفوفة من التنسيقات، يكون ترتيب تطبيق التنسيق من اليسار إلى اليمين، لذلك قد يoverwrite النمط التالي النمط السابق.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // أخضر
);
```
يمكن العثور على القائمة الكاملة للتنسيقات في [modifiers](/ar/nodejs/api/util#modifiers).


## الفئة: `util.TextDecoder` {#class-utiltextdecoder}

:::info[التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | الفئة متاحة الآن في الكائن العام. |
| v8.3.0 | تمت إضافتها في: v8.3.0 |
:::

تنفيذ لـ [معيار ترميز WHATWG](https://encoding.spec.whatwg.org/) `TextDecoder` API.

```js[ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### ترميزات مدعومة من WHATWG {#whatwg-supported-encodings}

وفقًا لـ [معيار ترميز WHATWG](https://encoding.spec.whatwg.org/)، فإن الترميزات المدعومة بواسطة `TextDecoder` API موضحة في الجداول أدناه. لكل ترميز، يمكن استخدام اسم مستعار واحد أو أكثر.

تدعم تكوينات بناء Node.js المختلفة مجموعات مختلفة من الترميزات. (انظر [تدويل](/ar/nodejs/api/intl))

#### الترميزات المدعومة افتراضيًا (مع بيانات ICU كاملة) {#encodings-supported-by-default-with-full-icu-data}

| الترميز | الأسماء المستعارة |
| --- | --- |
| `'ibm866'` | `'866'`  ،   `'cp866'`  ،   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ،   `'iso-ir-101'`  ،   `'iso8859-2'`  ،   `'iso88592'`  ،   `'iso_8859-2'`  ،   `'iso_8859-2:1987'`  ،   `'l2'`  ،   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ،   `'iso-ir-109'`  ،   `'iso8859-3'`  ،   `'iso88593'`  ،   `'iso_8859-3'`  ،   `'iso_8859-3:1988'`  ،   `'l3'`  ،   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ،   `'iso-ir-110'`  ،   `'iso8859-4'`  ،   `'iso88594'`  ،   `'iso_8859-4'`  ،   `'iso_8859-4:1988'`  ،   `'l4'`  ،   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ،   `'cyrillic'`  ،   `'iso-ir-144'`  ،   `'iso8859-5'`  ،   `'iso88595'`  ،   `'iso_8859-5'`  ،   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ،   `'asmo-708'`  ،   `'csiso88596e'`  ،   `'csiso88596i'`  ،   `'csisolatinarabic'`  ،   `'ecma-114'`  ،   `'iso-8859-6-e'`  ،   `'iso-8859-6-i'`  ،   `'iso-ir-127'`  ،   `'iso8859-6'`  ،   `'iso88596'`  ،   `'iso_8859-6'`  ،   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ،   `'ecma-118'`  ،   `'elot_928'`  ،   `'greek'`  ،   `'greek8'`  ،   `'iso-ir-126'`  ،   `'iso8859-7'`  ،   `'iso88597'`  ،   `'iso_8859-7'`  ،   `'iso_8859-7:1987'`  ،   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ،   `'csisolatinhebrew'`  ،   `'hebrew'`  ،   `'iso-8859-8-e'`  ،   `'iso-ir-138'`  ،   `'iso8859-8'`  ،   `'iso88598'`  ،   `'iso_8859-8'`  ،   `'iso_8859-8:1988'`  ،   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ،   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ،   `'iso-ir-157'`  ،   `'iso8859-10'`  ،   `'iso885910'`  ،   `'l6'`  ،   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ،   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ،   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ،   `'iso8859-15'`  ،   `'iso885915'`  ،   `'iso_8859-15'`  ،   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ،   `'koi'`  ،   `'koi8'`  ،   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ،   `'mac'`  ،   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ،   `'iso-8859-11'`  ،   `'iso8859-11'`  ،   `'iso885911'`  ،   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ،   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ،   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ،   `'ascii'`  ،   `'cp1252'`  ،   `'cp819'`  ،   `'csisolatin1'`  ،   `'ibm819'`  ،   `'iso-8859-1'`  ،   `'iso-ir-100'`  ،   `'iso8859-1'`  ،   `'iso88591'`  ،   `'iso_8859-1'`  ،   `'iso_8859-1:1987'`  ،   `'l1'`  ،   `'latin1'`  ،   `'us-ascii'`  ،   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ،   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ،   `'csisolatin5'`  ،   `'iso-8859-9'`  ،   `'iso-ir-148'`  ،   `'iso8859-9'`  ،   `'iso88599'`  ،   `'iso_8859-9'`  ،   `'iso_8859-9:1989'`  ،   `'l5'`  ،   `'latin5'`  ،   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ،   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ،   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ،   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ،   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ،   `'csgb2312'`  ،   `'csiso58gb231280'`  ،   `'gb2312'`  ،   `'gb_2312'`  ،   `'gb_2312-80'`  ،   `'iso-ir-58'`  ،   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ،   `'cn-big5'`  ،   `'csbig5'`  ،   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ،   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ،   `'ms932'`  ،   `'ms_kanji'`  ،   `'shift-jis'`  ،   `'sjis'`  ،   `'windows-31j'`  ،   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ،   `'csksc56011987'`  ،   `'iso-ir-149'`  ،   `'korean'`  ،   `'ks_c_5601-1987'`  ،   `'ks_c_5601-1989'`  ،   `'ksc5601'`  ،   `'ksc_5601'`  ،   `'windows-949'` |


#### الترميزات المدعومة عند بناء Node.js بخيار `small-icu` {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| الترميز | الأسماء المستعارة |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### الترميزات المدعومة عند تعطيل ICU {#encodings-supported-when-icu-is-disabled}

| الترميز | الأسماء المستعارة |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
الترميز `'iso-8859-16'` المدرج في [معيار ترميز WHATWG](https://encoding.spec.whatwg.org/) غير مدعوم.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد `encoding` الذي يدعمه مثيل `TextDecoder` هذا. **الافتراضي:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كانت أخطاء فك الترميز قاتلة. هذا الخيار غير مدعوم عند تعطيل ICU (انظر [تدويل](/ar/nodejs/api/intl)). **الافتراضي:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عند `true`، سيقوم `TextDecoder` بتضمين علامة ترتيب البايت في النتيجة التي تم فك ترميزها. عند `false`، ستتم إزالة علامة ترتيب البايت من الإخراج. يتم استخدام هذا الخيار فقط عندما يكون `encoding` هو `'utf-8'` أو `'utf-16be'` أو `'utf-16le'`. **الافتراضي:** `false`.
  
 

ينشئ مثيل `TextDecoder` جديدًا. قد يحدد `encoding` أحد الترميزات المدعومة أو اسمًا مستعارًا.

تتوفر أيضًا فئة `TextDecoder` على الكائن العام.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) مثيل `ArrayBuffer` أو `DataView` أو `TypedArray` يحتوي على البيانات المشفرة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كانت هناك حاجة إلى المزيد من أجزاء البيانات. **الافتراضي:** `false`.
  
 
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يفك ترميز `input` ويعيد سلسلة. إذا كان `options.stream` هو `true`، فسيتم تخزين أي تسلسلات بايت غير مكتملة تحدث في نهاية `input` داخليًا وإرسالها بعد الاستدعاء التالي لـ `textDecoder.decode()`.

إذا كان `textDecoder.fatal` هو `true`، فستؤدي أخطاء فك الترميز التي تحدث إلى ظهور `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الترميز الذي تدعمه مثيل `TextDecoder`.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون القيمة `true` إذا كانت أخطاء فك الترميز تؤدي إلى ظهور `TypeError`.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون القيمة `true` إذا كانت نتيجة فك الترميز ستتضمن علامة ترتيب البايتات.

## الفئة: `util.TextEncoder` {#class-utiltextencoder}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | الفئة متاحة الآن على الكائن العام. |
| v8.3.0 | تمت الإضافة في: v8.3.0 |
:::

تنفيذ [معيار ترميز WHATWG](https://encoding.spec.whatwg.org/) واجهة برمجة تطبيقات `TextEncoder`. تدعم جميع مثيلات `TextEncoder` ترميز UTF-8 فقط.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
تتوفر فئة `TextEncoder` أيضًا على الكائن العام.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) النص المراد ترميزه. **الافتراضي:** سلسلة فارغة.
- إرجاع: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

يقوم بترميز سلسلة `input` بترميز UTF-8 وإرجاع `Uint8Array` يحتوي على البايتات المشفرة.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**تمت الإضافة في: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) النص المراد ترميزه.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) المصفوفة التي ستحتوي على نتيجة الترميز.
- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) وحدات كود Unicode المقروءة من src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بايتات UTF-8 المكتوبة من dest.
  
 

يقوم بترميز سلسلة `src` بترميز UTF-8 إلى `dest` Uint8Array وإرجاع كائن يحتوي على وحدات كود Unicode المقروءة وبايتات UTF-8 المكتوبة.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الترميز المدعوم بواسطة مثيل `TextEncoder`. دائمًا ما يتم تعيينه على `'utf-8'`.

## `util.toUSVString(string)` {#utiltousvstringstring}

**أُضيف في: الإصدار 16.8.0، 14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع `string` بعد استبدال أي نقاط رمزية بديلة (أو ما يعادلها، أي وحدات رمزية بديلة غير مقترنة) بحرف الاستبدال Unicode "U+FFFD".

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**أُضيف في: الإصدار 18.11.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

ينشئ ويُرجع مثيل [\<AbortController\>](/ar/nodejs/api/globals#class-abortcontroller) تم وضع علامة على [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) الخاص به على أنه قابل للتحويل ويمكن استخدامه مع `structuredClone()` أو `postMessage()`.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**أُضيف في: الإصدار 18.11.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
- الإرجاع: [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)

يضع علامة على [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) المحدد على أنه قابل للتحويل بحيث يمكن استخدامه مع `structuredClone()` و `postMessage()`.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**أُضيف في: الإصدار 19.7.0، 18.16.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أي كائن غير فارغ مرتبط بالعملية القابلة للإلغاء ومحتفظ به بشكل ضعيف. إذا تم جمع `resource` كبيانات مهملة قبل إلغاء `signal`، فسيظل الوعد معلقًا، مما يسمح لـ Node.js بالتوقف عن تتبعه. يساعد هذا في منع تسرب الذاكرة في العمليات طويلة الأمد أو غير القابلة للإلغاء.
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

يستمع إلى حدث الإلغاء على `signal` المقدم ويُرجع وعدًا يتحقق عند إلغاء `signal`. إذا تم توفير `resource`، فإنه يشير بشكل ضعيف إلى الكائن المرتبط بالعملية، لذلك إذا تم جمع `resource` كبيانات مهملة قبل إلغاء `signal`، فسيظل الوعد المُرجع معلقًا. هذا يمنع تسرب الذاكرة في العمليات طويلة الأمد أو غير القابلة للإلغاء.

::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```
:::


## `util.types` {#utiltypes}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v15.3.0 | تم عرضه كـ `require('util/types')`. |
| v10.0.0 | تمت إضافته في: v10.0.0 |
:::

يوفر `util.types` فحوصات للأنواع المختلفة للكائنات المضمنة. على عكس `instanceof` أو `Object.prototype.toString.call(value)`، لا تفحص هذه الفحوصات خصائص الكائن التي يمكن الوصول إليها من JavaScript (مثل النموذج الأولي الخاص بها)، وعادة ما تكون لها تكلفة استدعاء إلى C++.

لا تضمن النتيجة بشكل عام أي ضمانات حول أنواع الخصائص أو السلوك الذي يكشف عنه القيمة في JavaScript. إنها مفيدة بشكل أساسي لمطوري الملحقات الذين يفضلون إجراء فحص الأنواع في JavaScript.

يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('node:util').types` أو `require('node:util/types')`.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**تمت إضافته في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كانت القيمة هي مثيل [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) المضمن.

راجع أيضًا [`util.types.isArrayBuffer()`](/ar/nodejs/api/util#utiltypesisarraybuffervalue) و [`util.types.isSharedArrayBuffer()`](/ar/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // تُرجع true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // تُرجع true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**تمت إضافته في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كانت القيمة هي مثيل لأحد طرق عرض [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)، مثل كائنات المصفوفة المكتوبة أو [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). مكافئ لـ [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**أُضيف في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة هي كائن `arguments`.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // ترجع true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**أُضيف في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة هي مثيل [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) مُضمَّن. هذا *لا* يشمل مثيلات [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). عادةً، يُستحسن الاختبار لكلاهما؛ انظر [`util.types.isAnyArrayBuffer()`](/ar/nodejs/api/util#utiltypesisanyarraybuffervalue) لذلك.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // ترجع true
util.types.isArrayBuffer(new SharedArrayBuffer());  // ترجع false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**أُضيف في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة هي [دالة غير متزامنة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). هذا يبلغ فقط عما يراه محرك JavaScript؛ على وجه الخصوص، قد لا تتطابق القيمة المرجعة مع الكود المصدري الأصلي إذا تم استخدام أداة ترجمة.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // ترجع false
util.types.isAsyncFunction(async function foo() {});  // ترجع true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**إضافة في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة نسخة من `BigInt64Array`.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // ترجع true
util.types.isBigInt64Array(new BigUint64Array());  // ترجع false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**إضافة في: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة كائن BigInt، على سبيل المثال، تم إنشاؤه بواسطة `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // ترجع true
util.types.isBigIntObject(BigInt(123));   // ترجع false
util.types.isBigIntObject(123);  // ترجع false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**إضافة في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة نسخة من `BigUint64Array`.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // ترجع false
util.types.isBigUint64Array(new BigUint64Array());  // ترجع true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**إضافة في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة كائن منطقي، على سبيل المثال، تم إنشاؤه بواسطة `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // ترجع false
util.types.isBooleanObject(true);   // ترجع false
util.types.isBooleanObject(new Boolean(false)); // ترجع true
util.types.isBooleanObject(new Boolean(true));  // ترجع true
util.types.isBooleanObject(Boolean(false)); // ترجع false
util.types.isBooleanObject(Boolean(true));  // ترجع false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**تمت الإضافة في: الإصدار v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن أي كائن بدائي مغلف، على سبيل المثال، تم إنشاؤه بواسطة `new Boolean()` أو `new String()` أو `Object(Symbol())`.

على سبيل المثال:

```js [ESM]
util.types.isBoxedPrimitive(false); // يُرجع false
util.types.isBoxedPrimitive(new Boolean(false)); // يُرجع true
util.types.isBoxedPrimitive(Symbol('foo')); // يُرجع false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // يُرجع true
util.types.isBoxedPrimitive(Object(BigInt(5))); // يُرجع true
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**تمت الإضافة في: الإصدار v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت `value` عبارة عن [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)، وإلا `false`.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**تمت الإضافة في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن نسخة مدمجة من [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // يُرجع true
util.types.isDataView(new Float64Array());  // يُرجع false
```
راجع أيضًا [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**تمت الإضافة في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن نسخة مدمجة من [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

```js [ESM]
util.types.isDate(new Date());  // يُرجع true
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**أُضيف في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Data_structures#Data_types)
- القيمة المعادة: [\<boolean\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Data_structures#Boolean_type)

تُعيد `true` إذا كانت القيمة عبارة عن قيمة `External` أصلية.

قيمة `External` أصلية هي نوع خاص من الكائنات التي تحتوي على مؤشر C++ خام (`void*`) للوصول إليه من التعليمات البرمجية الأصلية، ولا تحتوي على أي خصائص أخرى. يتم إنشاء هذه الكائنات إما عن طريق Node.js الداخلية أو الإضافات الأصلية. في JavaScript، تكون عبارة عن كائنات [مجمّدة](https://developer.mozilla.org/ar/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) مع نموذج أولي `null`.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // returns true
util.types.isExternal(0); // returns false
util.types.isExternal(new String('foo')); // returns false
```
لمزيد من المعلومات حول `napi_create_external`، راجع [`napi_create_external()`](/ar/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**أُضيف في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Data_structures#Data_types)
- القيمة المعادة: [\<boolean\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Data_structures#Boolean_type)

تُعيد `true` إذا كانت القيمة عبارة عن نسخة مضمنة من [`Float32Array`](https://developer.mozilla.org/ar/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Returns false
util.types.isFloat32Array(new Float32Array());  // Returns true
util.types.isFloat32Array(new Float64Array());  // Returns false
```

### ‏`util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي نسخة مضمنة من [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array).

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // الإرجاع: false
util.types.isFloat64Array(new Uint8Array());  // الإرجاع: false
util.types.isFloat64Array(new Float64Array());  // الإرجاع: true
```
### ‏`util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن دالة مولد. يُبلغ هذا فقط عما يراه محرك JavaScript؛ على وجه الخصوص، قد لا تتطابق القيمة المرجعة مع التعليمات البرمجية المصدر الأصلية إذا تم استخدام أداة تحويل.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // الإرجاع: false
util.types.isGeneratorFunction(function* foo() {});  // الإرجاع: true
```
### ‏`util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن كائن مولد تم إرجاعه من دالة مولد مضمنة. يُبلغ هذا فقط عما يراه محرك JavaScript؛ على وجه الخصوص، قد لا تتطابق القيمة المرجعة مع التعليمات البرمجية المصدر الأصلية إذا تم استخدام أداة تحويل.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // الإرجاع: true
```
### ‏`util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي نسخة مضمنة من [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array).

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // الإرجاع: false
util.types.isInt8Array(new Int8Array());  // الإرجاع: true
util.types.isInt8Array(new Float64Array());  // الإرجاع: false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**تمت إضافته في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة عبارة عن نسخة مدمجة من [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array).

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Returns false
util.types.isInt16Array(new Int16Array());  // Returns true
util.types.isInt16Array(new Float64Array());  // Returns false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**تمت إضافته في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة عبارة عن نسخة مدمجة من [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array).

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Returns false
util.types.isInt32Array(new Int32Array());  // Returns true
util.types.isInt32Array(new Float64Array());  // Returns false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**تمت إضافته في: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت `value` عبارة عن [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)، وإلا `false`.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**تمت إضافته في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة عبارة عن نسخة مدمجة من [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

```js [ESM]
util.types.isMap(new Map());  // Returns true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**أُضيف في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي مُكرِّر تم إرجاعه لنموذج [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) مُضمَّن.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // يُرجع true
util.types.isMapIterator(map.values());  // يُرجع true
util.types.isMapIterator(map.entries());  // يُرجع true
util.types.isMapIterator(map[Symbol.iterator]());  // يُرجع true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**أُضيف في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي نسخة من [كائن فضاء أسماء الوحدة](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // يُرجع true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**أُضيف في: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا تم إرجاع القيمة بواسطة مُنشئ [نوع `Error` مُضمَّن](https://tc39.es/ecma262/#sec-error-objects).

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
تُعد الفئات الفرعية لأنواع الأخطاء الأصلية أيضًا أخطاءً أصلية:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
كون قيمة ما `instanceof` لفئة خطأ أصلية لا يعادل `isNativeError()` التي تُرجع `true` لتلك القيمة. تُرجع `isNativeError()` القيمة `true` للأخطاء التي تأتي من [نطاق](https://tc39.es/ecma262/#realm) مختلف بينما تُرجع `instanceof Error` القيمة `false` لهذه الأخطاء:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
وعلى العكس من ذلك، تُرجع `isNativeError()` القيمة `false` لجميع الكائنات التي لم يتم إرجاعها بواسطة مُنشئ خطأ أصلي. يتضمن ذلك القيم التي هي `instanceof` لأخطاء أصلية:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### ‏`util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` ‏[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: ‏[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة عبارة عن كائن رقمي، على سبيل المثال تم إنشاؤه بواسطة `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // إرجاع false
util.types.isNumberObject(new Number(0));   // إرجاع true
```
### ‏`util.types.isPromise(value)` {#utiltypesispromisevalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` ‏[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: ‏[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة هي [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) مدمجة.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // إرجاع true
```
### ‏`util.types.isProxy(value)` {#utiltypesisproxyvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` ‏[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: ‏[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة هي مثيل [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // إرجاع false
util.types.isProxy(proxy);  // إرجاع true
```
### ‏`util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**تمت الإضافة في: v10.0.0**

- ‏`value` ‏[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: ‏[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة عبارة عن كائن تعبير نمطي.

```js [ESM]
util.types.isRegExp(/abc/);  // إرجاع true
util.types.isRegExp(new RegExp('abc'));  // إرجاع true
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**أُضيف في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن نسخة مُضمَّنة من [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```js [ESM]
util.types.isSet(new Set());  // يُرجع true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**أُضيف في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن مُكرِّر مُرْجَع لنسخة مُضمَّنة من [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // يُرجع true
util.types.isSetIterator(set.values());  // يُرجع true
util.types.isSetIterator(set.entries());  // يُرجع true
util.types.isSetIterator(set[Symbol.iterator]());  // يُرجع true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**أُضيف في: الإصدار v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة عبارة عن نسخة مُضمَّنة من [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). هذا *لا* يشمل نسخ [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). عادةً، يُفضَّل الاختبار لكليهما؛ راجع [`util.types.isAnyArrayBuffer()`](/ar/nodejs/api/util#utiltypesisanyarraybuffervalue) لذلك.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // يُرجع false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // يُرجع true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي كائن سلسلة، على سبيل المثال، تم إنشاؤه بواسطة `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // يُرجع false
util.types.isStringObject(new String('foo'));   // يُرجع true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي كائن رمز، تم إنشاؤه عن طريق استدعاء `Object()` على بدائي `Symbol`.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // يُرجع false
util.types.isSymbolObject(Object(symbol));   // يُرجع true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي نسخة مدمجة من [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // يُرجع false
util.types.isTypedArray(new Uint8Array());  // يُرجع true
util.types.isTypedArray(new Float64Array());  // يُرجع true
```
انظر أيضًا [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كانت القيمة هي نسخة مدمجة من [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // يُرجع false
util.types.isUint8Array(new Uint8Array());  // يُرجع true
util.types.isUint8Array(new Float64Array());  // يُرجع false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كانت القيمة هي نسخة مدمجة من [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray).

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // تُرجع false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // تُرجع true
util.types.isUint8ClampedArray(new Float64Array());  // تُرجع false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كانت القيمة هي نسخة مدمجة من [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array).

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // تُرجع false
util.types.isUint16Array(new Uint16Array());  // تُرجع true
util.types.isUint16Array(new Float64Array());  // تُرجع false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كانت القيمة هي نسخة مدمجة من [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array).

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // تُرجع false
util.types.isUint32Array(new Uint32Array());  // تُرجع true
util.types.isUint32Array(new Float64Array());  // تُرجع false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**تمت الإضافة في: الإصدار 10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع `true` إذا كانت القيمة هي نسخة مدمجة من [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap).

```js [ESM]
util.types.isWeakMap(new WeakMap());  // تُرجع true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**تمت الإضافة في: الإصدار v10.0.0**

- `value` [\<أي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كانت القيمة عبارة عن نسخة مضمنة من [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet).

```js [ESM]
util.types.isWeakSet(new WeakSet());  // الإرجاع: true
```
## واجهات برمجة التطبيقات المهجورة {#deprecated-apis}

واجهات برمجة التطبيقات التالية مهجورة ويجب عدم استخدامها بعد الآن. يجب تحديث التطبيقات والوحدات النمطية الحالية للعثور على طرق بديلة.

### `util._extend(target, source)` {#util_extendtarget-source}

**تمت الإضافة في: الإصدار v0.7.5**

**مهملة منذ: الإصدار v6.0.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) بدلاً من ذلك.
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

لم يكن من المفترض أبدًا استخدام طريقة `util._extend()` خارج وحدات Node.js الداخلية. وجدها المجتمع واستخدمها على أي حال.

تم إهمالها ولا ينبغي استخدامها في التعليمات البرمجية الجديدة. تأتي JavaScript بوظائف مضمنة مشابهة جدًا من خلال [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**تمت الإضافة في: الإصدار v0.6.0**

**مهملة منذ: الإصدار v4.0.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) بدلاً من ذلك.
:::

- `object` [\<أي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

اسم بديل لـ [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

إرجاع `true` إذا كان `object` المحدد عبارة عن `Array`. خلاف ذلك، إرجاع `false`.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// الإرجاع: true
util.isArray(new Array());
// الإرجاع: true
util.isArray({});
// الإرجاع: false
```
