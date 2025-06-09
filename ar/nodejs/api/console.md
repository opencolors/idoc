---
title: توثيق واجهة برمجة التطبيقات Console في Node.js
description: توفر واجهة برمجة التطبيقات Console في Node.js وحدة تصحيح بسيطة مشابهة لآلية وحدة التحكم في JavaScript المقدمة من المتصفحات. يتناول هذا التوثيق الأساليب المتاحة لتسجيل البيانات، والتصحيح، وفحص كائنات JavaScript في بيئة Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات Console في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر واجهة برمجة التطبيقات Console في Node.js وحدة تصحيح بسيطة مشابهة لآلية وحدة التحكم في JavaScript المقدمة من المتصفحات. يتناول هذا التوثيق الأساليب المتاحة لتسجيل البيانات، والتصحيح، وفحص كائنات JavaScript في بيئة Node.js.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات Console في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر واجهة برمجة التطبيقات Console في Node.js وحدة تصحيح بسيطة مشابهة لآلية وحدة التحكم في JavaScript المقدمة من المتصفحات. يتناول هذا التوثيق الأساليب المتاحة لتسجيل البيانات، والتصحيح، وفحص كائنات JavaScript في بيئة Node.js.
---


# وحدة التحكم {#console}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

توفر وحدة `node:console` وحدة تحكم تصحيح أخطاء بسيطة تشبه آلية وحدة تحكم JavaScript التي توفرها متصفحات الويب.

تقوم الوحدة بتصدير مكونين محددين:

- فئة `Console` مع طرق مثل `console.log()` و `console.error()` و `console.warn()` التي يمكن استخدامها للكتابة إلى أي دفق Node.js.
- مثيل `console` عام تم تكوينه للكتابة إلى [`process.stdout`](/ar/nodejs/api/process#processstdout) و [`process.stderr`](/ar/nodejs/api/process#processstderr). يمكن استخدام `console` العام دون استدعاء `require('node:console')`.

*<strong>تحذير</strong>*: طرق كائن وحدة التحكم العامة ليست متزامنة باستمرار مثل واجهات برمجة التطبيقات للمتصفح التي تشبهها، ولا هي غير متزامنة باستمرار مثل جميع تدفقات Node.js الأخرى. يجب على البرامج التي ترغب في الاعتماد على السلوك المتزامن / غير المتزامن لوظائف وحدة التحكم أن تكتشف أولاً طبيعة دفق وحدة التحكم الداعم. وذلك لأن الدفق يعتمد على النظام الأساسي الأساسي وتكوين الدفق القياسي للعملية الحالية. انظر [ملاحظة حول إدخال/إخراج العملية](/ar/nodejs/api/process#a-note-on-process-io) لمزيد من المعلومات.

مثال باستخدام `console` العام:

```js [ESM]
console.log('hello world');
// يطبع: hello world، إلى stdout
console.log('hello %s', 'world');
// يطبع: hello world، إلى stdout
console.error(new Error('Whoops, something bad happened'));
// يطبع رسالة الخطأ وتتبع المكدس إلى stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// يطبع: Danger Will Robinson! Danger!، إلى stderr
```
مثال باستخدام فئة `Console`:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// يطبع: hello world، إلى out
myConsole.log('hello %s', 'world');
// يطبع: hello world، إلى out
myConsole.error(new Error('Whoops, something bad happened'));
// يطبع: [Error: Whoops, something bad happened]، إلى err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// يطبع: Danger Will Robinson! Danger!، إلى err
```

## الفئة: `Console` {#class-console}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | سيتم الآن تجاهل الأخطاء التي تحدث أثناء الكتابة إلى التدفقات الأساسية افتراضيًا. |
:::

يمكن استخدام الفئة `Console` لإنشاء مسجل بسيط مع تدفقات إخراج قابلة للتكوين ويمكن الوصول إليها باستخدام `require('node:console').Console` أو `console.Console` (أو نظيراتها المفككة):

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.2.0, v12.17.0 | تم تقديم خيار `groupIndentation`. |
| v11.7.0 | تم تقديم خيار `inspectOptions`. |
| v10.0.0 | يدعم منشئ `Console` الآن وسيطة `options` ، وتم تقديم خيار `colorMode`. |
| v8.0.0 | تم تقديم خيار `ignoreErrors`. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تجاهل الأخطاء عند الكتابة إلى التدفقات الأساسية. **افتراضي:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قم بتعيين دعم الألوان لمثيل `Console` هذا. يؤدي التعيين إلى `true` إلى تمكين التلوين أثناء فحص القيم. يؤدي التعيين إلى `false` إلى تعطيل التلوين أثناء فحص القيم. يؤدي التعيين إلى `'auto'` إلى جعل دعم الألوان يعتمد على قيمة الخاصية `isTTY` والقيمة التي تم إرجاعها بواسطة `getColorDepth()` في التدفق المعني. لا يمكن استخدام هذا الخيار إذا تم تعيين `inspectOptions.colors` أيضًا. **افتراضي:** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحدد الخيارات التي يتم تمريرها إلى [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قم بتعيين مسافة بادئة المجموعة. **افتراضي:** `2`.

ينشئ `Console` جديدًا مع مثيل أو مثيلين من التدفق القابل للكتابة. `stdout` هو تدفق قابل للكتابة لطباعة سجل أو إخراج معلومات. يستخدم `stderr` للتحذير أو إخراج الخطأ. إذا لم يتم توفير `stderr` ، فسيتم استخدام `stdout` لـ `stderr`.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

`console` العام هو `Console` خاص يتم إرسال إخراجه إلى [`process.stdout`](/ar/nodejs/api/process#processstdout) و [`process.stderr`](/ar/nodejs/api/process#processstderr). وهو مكافئ للاتصال بـ:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | أصبح التنفيذ الآن متوافقًا مع المواصفات ولا يطرح أي استثناءات بعد الآن. |
| v0.1.101 | أُضيف في: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة التي يتم اختبارها لكونها قيمة صحيحة.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) تُستخدم جميع الوسائط بخلاف `value` كرسالة خطأ.

`console.assert()` يكتب رسالة إذا كانت `value` [خاطئة](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) أو تم حذفها. يكتب رسالة فقط ولا يؤثر على التنفيذ بأي شكل آخر. يبدأ الإخراج دائمًا بـ `"Assertion failed"`. إذا تم توفير `message`، فسيتم تنسيقه باستخدام [`util.format()`](/ar/nodejs/api/util#utilformatformat-args).

إذا كانت `value` [صحيحة](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)، فلا يحدث شيء.

```js [ESM]
console.assert(true, 'لا يفعل شيئًا');

console.assert(false, 'يا للأسف %s عمل', 'لم');
// Assertion failed: يا للأسف لم يعمل

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**أُضيف في: v8.3.0**

عندما يكون `stdout` هو TTY، ستحاول استدعاء `console.clear()` مسح TTY. عندما لا يكون `stdout` هو TTY، لا يفعل هذا الأسلوب أي شيء.

يمكن أن يختلف التشغيل المحدد لـ `console.clear()` عبر أنظمة التشغيل وأنواع المحطات الطرفية. بالنسبة لمعظم أنظمة تشغيل Linux، تعمل `console.clear()` بشكل مشابه لأمر shell `clear`. في نظام التشغيل Windows، ستقوم `console.clear()` بمسح الإخراج فقط في منفذ عرض المحطة الطرفية الحالي لملف Node.js الثنائي.

### `console.count([label])` {#consolecountlabel}

**أُضيف في: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تسمية العرض للعداد. **افتراضي:** `'default'`.

يحافظ على عداد داخلي خاص بـ `label` ويخرج إلى `stdout` عدد المرات التي تم فيها استدعاء `console.count()` مع `label` المحدد.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**أضيف في: الإصدار 8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تسمية العرض للعداد. **افتراضي:** `'default'`.

يعيد ضبط العداد الداخلي الخاص بـ `label`.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 8.10.0 | `console.debug` الآن هو اسم مستعار لـ `console.log`. |
| الإصدار 8.0.0 | أضيف في: الإصدار 8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

الدالة `console.debug()` هي اسم مستعار لـ [`console.log()`](/ar/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**أضيف في: الإصدار 0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true` فسيتم عرض الخصائص غير القابلة للتعداد والرمزية للكائن أيضًا. **افتراضي:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يخبر [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) عدد المرات التي يجب أن يتكرر فيها أثناء تنسيق الكائن. هذا مفيد لفحص الكائنات الكبيرة المعقدة. لجعله يتكرر إلى أجل غير مسمى، مرر `null`. **افتراضي:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تصميم الإخراج باستخدام رموز ألوان ANSI. الألوان قابلة للتخصيص؛ انظر [تخصيص ألوان `util.inspect()` ](/ar/nodejs/api/util#customizing-utilinspect-colors). **افتراضي:** `false`.
  
 

يستخدم [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) على `obj` ويطبع السلسلة الناتجة إلى `stdout`. تتجاوز هذه الدالة أي دالة `inspect()` مخصصة محددة في `obj`.


### ‏‎`console.dirxml(...data)`‎‏ {#consoledirxmldata}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.3.0 | ‏‎`console.dirxml`‎‏ الآن يستدعي ‏‎`console.log`‎‏ لوسائطه. |
| v8.0.0 | تمت إضافته في: v8.0.0 |
:::

- ‏‎`...data`‎‏ ‏‎[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)‎‏

يستدعي هذا الأسلوب ‏‎`console.log()`‎‏ ويمرر له الوسائط المستلمة. لا ينتج هذا الأسلوب أي تنسيق XML.

### ‏‎`console.error([data][, ...args])`‎‏ {#consoleerrordata-args}

**تمت إضافته في: v0.1.100**

- ‏‎`data`‎‏ ‏‎[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)‎‏
- ‏‎`...args`‎‏ ‏‎[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)‎‏

يطبع إلى ‏‎`stderr`‎‏ مع سطر جديد. يمكن تمرير وسائط متعددة، مع استخدام الأول كالرسالة الرئيسية وجميع الرسائل الإضافية كقيم استبدال مشابهة لـ ‏‎[`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3)‎‏ (يتم تمرير جميع الوسائط إلى ‏‎[`util.format()`](/ar/nodejs/api/util#utilformatformat-args)‎‏).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// يطبع: error #5, إلى stderr
console.error('error', code);
// يطبع: error 5, إلى stderr
```
إذا لم يتم العثور على عناصر التنسيق (مثل ‏‎`%d`‎‏) في السلسلة الأولى، فسيتم استدعاء ‏‎[`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options)‎‏ على كل وسيطة وسيتم ربط قيم السلسلة الناتجة. راجع ‏‎[`util.format()`](/ar/nodejs/api/util#utilformatformat-args)‎‏ لمزيد من المعلومات.

### ‏‎`console.group([...label])`‎‏ {#consolegrouplabel}

**تمت إضافته في: v8.5.0**

- ‏‎`...label`‎‏ ‏‎[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)‎‏

يزيد المسافة البادئة للأسطر اللاحقة بمقدار مسافات لطول ‏‎`groupIndentation`‎‏.

إذا تم توفير واحد أو أكثر من ‏‎`label`‎‏، فسيتم طباعتها أولاً بدون المسافة البادئة الإضافية.

### ‏‎`console.groupCollapsed()`‎‏ {#consolegroupcollapsed}

**تمت إضافته في: v8.5.0**

اسم مستعار لـ ‏‎[`console.group()`](/ar/nodejs/api/console#consolegrouplabel)‎‏.

### ‏‎`console.groupEnd()`‎‏ {#consolegroupend}

**تمت إضافته في: v8.5.0**

يقلل المسافة البادئة للأسطر اللاحقة بمقدار مسافات لطول ‏‎`groupIndentation`‎‏.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**أضيف في:** v0.1.100

- `data` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

الدالة `console.info()` هي اسم بديل لـ [`console.log()`](/ar/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**أضيف في:** v0.1.100

- `data` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

تطبع إلى `stdout` مع سطر جديد. يمكن تمرير وسيطات متعددة، مع استخدام الأولى كالرسالة الأساسية واستخدام جميع الوسيطات الإضافية كقيم استبدال مشابهة لـ [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (يتم تمرير جميع الوسيطات إلى [`util.format()`](/ar/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// تطبع: count: 5، إلى stdout
console.log('count:', count);
// تطبع: count: 5، إلى stdout
```
راجع [`util.format()`](/ar/nodejs/api/util#utilformatformat-args) لمزيد من المعلومات.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**أضيف في:** v10.0.0

- `tabularData` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خصائص بديلة لإنشاء الجدول.

حاول إنشاء جدول بأعمدة خصائص `tabularData` (أو استخدم `properties`) وصفوف `tabularData` وسجلها. يعود إلى مجرد تسجيل الوسيطة إذا تعذر تحليلها كجدول.

```js [ESM]
// لا يمكن تحليل هذه كبيانات جدولية
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**تمت الإضافة في: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'default'`

يبدأ عدادًا زمنيًا يمكن استخدامه لحساب مدة عملية. يتم تعريف العدادات الزمنية بواسطة `label` فريد. استخدم نفس `label` عند استدعاء [`console.timeEnd()`](/ar/nodejs/api/console#consoletimeendlabel) لإيقاف العداد الزمني وإخراج الوقت المنقضي بوحدات زمنية مناسبة إلى `stdout`. على سبيل المثال، إذا كان الوقت المنقضي 3869 مللي ثانية، فإن `console.timeEnd()` يعرض "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | يتم عرض الوقت المنقضي بوحدة زمنية مناسبة. |
| v6.0.0 | لم تعد هذه الطريقة تدعم الاستدعاءات المتعددة التي لا تتطابق مع استدعاءات `console.time()` الفردية؛ انظر أدناه للحصول على التفاصيل. |
| v0.1.104 | تمت الإضافة في: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'default'`

يوقف عدادًا زمنيًا تم تشغيله مسبقًا عن طريق استدعاء [`console.time()`](/ar/nodejs/api/console#consoletimelabel) ويطبع النتيجة إلى `stdout`:

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**تمت الإضافة في: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

بالنسبة للعداد الزمني الذي تم تشغيله مسبقًا عن طريق استدعاء [`console.time()`](/ar/nodejs/api/console#consoletimelabel)، يطبع الوقت المنقضي ووسائط `data` الأخرى إلى `stdout`:

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**تمت الإضافة في: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يطبع إلى `stderr` السلسلة `'Trace: '`، متبوعة بالرسالة المنسقة [`util.format()`](/ar/nodejs/api/util#utilformatformat-args) وتتبع المكدس إلى الموضع الحالي في التعليمات البرمجية.

```js [ESM]
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**أُضيف في: الإصدار v0.1.100**

- `data` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

الدالة `console.warn()` هي اسم بديل للدالة [`console.error()`](/ar/nodejs/api/console#consoleerrordata-args).

## طرق خاصة بالمُدقّق فقط {#inspector-only-methods}

الأساليب التالية مكشوفة من قبل محرك V8 في واجهة برمجة التطبيقات العامة ولكنها لا تعرض أي شيء ما لم تستخدم بالتزامن مع [المُدقّق](/ar/nodejs/api/debugger) (علامة `--inspect`).

### `console.profile([label])` {#consoleprofilelabel}

**أُضيف في: الإصدار v8.0.0**

- `label` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

لا يعرض هذا الأسلوب أي شيء ما لم يتم استخدامه في المُدقّق. يبدأ الأسلوب `console.profile()` ملف تعريف وحدة المعالجة المركزية (CPU) لجافاسكربت مع تسمية اختيارية حتى يتم استدعاء [`console.profileEnd()`](/ar/nodejs/api/console#consoleprofileendlabel). ثم تتم إضافة الملف الشخصي إلى لوحة **الملف الشخصي** في المُدقّق.

```js [ESM]
console.profile('MyLabel');
// بعض الكود
console.profileEnd('MyLabel');
// يضيف الملف الشخصي 'MyLabel' إلى لوحة الملفات الشخصية في المُدقّق.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**أُضيف في: الإصدار v8.0.0**

- `label` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

لا يعرض هذا الأسلوب أي شيء ما لم يتم استخدامه في المُدقّق. يوقف جلسة تحديد وحدة المعالجة المركزية (CPU) لـ JavaScript الحالية إذا تم بدء واحدة ويطبع التقرير إلى لوحة **الملفات الشخصية** في المُدقّق. انظر [`console.profile()`](/ar/nodejs/api/console#consoleprofilelabel) للحصول على مثال.

إذا تم استدعاء هذا الأسلوب بدون تسمية، فسيتم إيقاف الملف الشخصي الذي تم بدؤه مؤخرًا.

### `console.timeStamp([label])` {#consoletimestamplabel}

**أُضيف في: الإصدار v8.0.0**

- `label` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

لا يعرض هذا الأسلوب أي شيء ما لم يتم استخدامه في المُدقّق. يضيف الأسلوب `console.timeStamp()` حدثًا بالتسمية `'label'` إلى لوحة **الجدول الزمني** في المُدقّق.

