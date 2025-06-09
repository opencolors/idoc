---
title: توثيق وحدة Assert في Node.js
description: توفر وحدة Assert في Node.js مجموعة بسيطة من اختبارات التحقق التي يمكن استخدامها لاختبار الثوابت. يغطي هذا التوثيق استخدام وأساليب وأمثلة وحدة Assert في Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق وحدة Assert في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة Assert في Node.js مجموعة بسيطة من اختبارات التحقق التي يمكن استخدامها لاختبار الثوابت. يغطي هذا التوثيق استخدام وأساليب وأمثلة وحدة Assert في Node.js.
  - - meta
    - name: twitter:title
      content: توثيق وحدة Assert في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة Assert في Node.js مجموعة بسيطة من اختبارات التحقق التي يمكن استخدامها لاختبار الثوابت. يغطي هذا التوثيق استخدام وأساليب وأمثلة وحدة Assert في Node.js.
---


# التأكيد {#assert}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

توفر الوحدة `node:assert` مجموعة من دوال التأكيد للتحقق من الثوابت.

## وضع التأكيد الصارم {#strict-assertion-mode}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | تم عرضه كـ `require('node:assert/strict')`. |
| v13.9.0, v12.16.2 | تم تغيير "الوضع الصارم" إلى "وضع التأكيد الصارم" و "الوضع القديم" إلى "وضع التأكيد القديم" لتجنب الخلط مع المعنى الأكثر شيوعًا لـ "الوضع الصارم". |
| v9.9.0 | تمت إضافة اختلافات الأخطاء إلى وضع التأكيد الصارم. |
| v9.9.0 | تمت إضافة وضع التأكيد الصارم إلى وحدة التأكيد. |
| v9.9.0 | تمت الإضافة في: v9.9.0 |
:::

في وضع التأكيد الصارم، تتصرف الطرق غير الصارمة مثل الطرق الصارمة المقابلة لها. على سبيل المثال، ستتصرف [`assert.deepEqual()`](/ar/nodejs/api/assert#assertdeepequalactual-expected-message) مثل [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

في وضع التأكيد الصارم، تعرض رسائل الخطأ للكائنات فرقًا. في وضع التأكيد القديم، تعرض رسائل الخطأ للكائنات الكائنات، وغالبًا ما تكون مبتورة.

لاستخدام وضع التأكيد الصارم:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';
```

```js [CJS]
const assert = require('node:assert').strict;
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';
```

```js [CJS]
const assert = require('node:assert/strict');
```
:::

مثال على فرق الخطأ:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```js [CJS]
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
:::

لإلغاء تنشيط الألوان، استخدم متغيرات البيئة `NO_COLOR` أو `NODE_DISABLE_COLORS`. سيؤدي هذا أيضًا إلى إلغاء تنشيط الألوان في REPL. لمزيد من المعلومات حول دعم الألوان في البيئات الطرفية، اقرأ وثائق tty [`getColorDepth()`](/ar/nodejs/api/tty#writestreamgetcolordepthenv).


## وضع التأكيد القديم {#legacy-assertion-mode}

يستخدم وضع التأكيد القديم [`==` عامل التشغيل](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) في:

- [`assert.deepEqual()`](/ar/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/ar/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/ar/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/ar/nodejs/api/assert#assertnotequalactual-expected-message)

لاستخدام وضع التأكيد القديم:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

قد يكون لوضع التأكيد القديم نتائج مفاجئة، خاصة عند استخدام [`assert.deepEqual()`](/ar/nodejs/api/assert#assertdeepequalactual-expected-message):

```js [CJS]
// تحذير: هذا لا يطرح AssertionError في وضع التأكيد القديم!
assert.deepEqual(/a/gi, new Date());
```
## الفئة: assert.AssertionError {#class-assertassertionerror}

- يمتد: [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

يشير إلى فشل التأكيد. جميع الأخطاء التي يطرحها وحدة `node:assert` ستكون مثيلات لفئة `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**تمت الإضافة في: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) في حالة توفره، يتم تعيين رسالة الخطأ إلى هذه القيمة.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) خاصية `actual` على مثيل الخطأ.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) خاصية `expected` على مثيل الخطأ.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خاصية `operator` على مثيل الخطأ.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) في حالة توفره، يتجاهل تتبع المكدس الذي تم إنشاؤه الإطارات قبل هذه الوظيفة.
  
 

فئة فرعية من `Error` تشير إلى فشل التأكيد.

تحتوي جميع المثيلات على خصائص `Error` المضمنة (`message` و `name`) و:

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) تم تعيينه للوسيطة `actual` لطرق مثل [`assert.strictEqual()`](/ar/nodejs/api/assert#assertstrictequalactual-expected-message).
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) تم تعيينه للقيمة `expected` لطرق مثل [`assert.strictEqual()`](/ar/nodejs/api/assert#assertstrictequalactual-expected-message).
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كانت الرسالة قد تم إنشاؤها تلقائيًا (`true`) أم لا.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) القيمة دائمًا `ERR_ASSERTION` لإظهار أن الخطأ هو خطأ تأكيد.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تم تعيينه لقيمة المشغل التي تم تمريرها.

::: code-group
```js [ESM]
import assert from 'node:assert';

// قم بإنشاء AssertionError لمقارنة رسالة الخطأ لاحقًا:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// تحقق من إخراج الخطأ:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```js [CJS]
const assert = require('node:assert');

// قم بإنشاء AssertionError لمقارنة رسالة الخطأ لاحقًا:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// تحقق من إخراج الخطأ:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
:::


## الفئة: `assert.CallTracker` {#class-assertcalltracker}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v20.1.0 | تم إهمال الفئة `assert.CallTracker` وستتم إزالتها في إصدار مستقبلي. |
| v14.2.0, v12.19.0 | تمت الإضافة في: v14.2.0, v12.19.0 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل
:::

هذه الميزة مهملة وستتم إزالتها في إصدار مستقبلي. يرجى التفكير في استخدام بدائل مثل الدالة المساعدة [`mock`](/ar/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**تمت الإضافة في: v14.2.0, v12.19.0**

يقوم بإنشاء كائن [`CallTracker`](/ar/nodejs/api/assert#class-assertcalltracker) جديد يمكن استخدامه لتتبع ما إذا كانت الدوال قد تم استدعاؤها لعدد معين من المرات. يجب استدعاء `tracker.verify()` لكي يتم التحقق. النمط المعتاد هو استدعاؤه في معالج [`process.on('exit')`](/ar/nodejs/api/process#event-exit).

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// يجب استدعاء callsfunc() مرة واحدة بالضبط قبل tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// يستدعي tracker.verify() ويتحقق مما إذا كانت جميع دوال tracker.calls() قد تم
// استدعاؤها بالعدد المحدد من المرات.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// يجب استدعاء callsfunc() مرة واحدة بالضبط قبل tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// يستدعي tracker.verify() ويتحقق مما إذا كانت جميع دوال tracker.calls() قد تم
// استدعاؤها بالعدد المحدد من المرات.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**تمت الإضافة في: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **افتراضي:** دالة لا تفعل شيئًا.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `1`.
- الإرجاع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة تغلف `fn`.

من المتوقع استدعاء الدالة المغلفة بالضبط `exact` مرة. إذا لم يتم استدعاء الدالة بالضبط `exact` مرة عند استدعاء [`tracker.verify()`](/ar/nodejs/api/assert#trackerverify)، فسيؤدي [`tracker.verify()`](/ar/nodejs/api/assert#trackerverify) إلى ظهور خطأ.

::: code-group
```js [ESM]
import assert from 'node:assert';

// إنشاء متتبع الاستدعاءات.
const tracker = new assert.CallTracker();

function func() {}

// يُرجع دالة تغلف func() يجب استدعاؤها بالعدد المحدد من المرات
// قبل tracker.verify().
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// إنشاء متتبع الاستدعاءات.
const tracker = new assert.CallTracker();

function func() {}

// يُرجع دالة تغلف func() يجب استدعاؤها بالعدد المحدد من المرات
// قبل tracker.verify().
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**إضافة في: v18.8.0, v16.18.0**

-  `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  المرتجعات: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة تحتوي على جميع استدعاءات دالة مُتعقَّبة.
-  الكائن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) الوسائط التي تم تمريرها إلى الدالة المتعقبة
  
 



::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**إضافة في: v14.2.0, v12.19.0**

- المرتجعات: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الكائنات التي تحتوي على معلومات حول الدوال المغلّفة التي تم إرجاعها بواسطة [`tracker.calls()`](/ar/nodejs/api/assert#trackercallsfn-exact).
- الكائن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الفعلي لمرات استدعاء الدالة.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المرات المتوقعة لاستدعاء الدالة.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الدالة التي تم تغليفها.
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تتبع مكدس الدالة.
  
 

تحتوي المصفوفات على معلومات حول العدد المتوقع والفعلي لاستدعاءات الدوال التي لم يتم استدعاؤها بالعدد المتوقع من المرات.



::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::

### `tracker.reset([fn])` {#trackerresetfn}

**تمت إضافتها في: v18.8.0، v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة مُتتبَّعة لإعادة ضبطها.

تعيد ضبط استدعاءات أداة تعقب الاستدعاءات. إذا تم تمرير دالة مُتتبَّعة كوسيطة، فسيتم إعادة ضبط الاستدعاءات الخاصة بها. إذا لم يتم تمرير أي وسيطات، فسيتم إعادة ضبط جميع الدوال المُتتبَّعة.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// تم استدعاء أداة التعقب مرة واحدة
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```

```js [CJS]
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// تم استدعاء أداة التعقب مرة واحدة
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**تمت إضافتها في: v14.2.0، v12.19.0**

تتكرر عبر قائمة الدوال التي تم تمريرها إلى [`tracker.calls()`](/ar/nodejs/api/assert#trackercallsfn-exact) وستُطلق خطأً للدوال التي لم يتم استدعاؤها بالعدد المتوقع من المرات.

::: code-group
```js [ESM]
import assert from 'node:assert';

// إنشاء أداة تعقب الاستدعاءات.
const tracker = new assert.CallTracker();

function func() {}

// تُرجع دالة تغلف func() التي يجب استدعاؤها عددًا محددًا من المرات
// قبل tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// سيُطلق خطأً نظرًا لأن callsfunc() تم استدعاؤها مرة واحدة فقط.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// إنشاء أداة تعقب الاستدعاءات.
const tracker = new assert.CallTracker();

function func() {}

// تُرجع دالة تغلف func() التي يجب استدعاؤها عددًا محددًا من المرات
// قبل tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// سيُطلق خطأً نظرًا لأن callsfunc() تم استدعاؤها مرة واحدة فقط.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**أُضيف في: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) المدخل الذي يتم التحقق من كونه صحيحًا.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

اسم مستعار لـ [`assert.ok()`](/ar/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}

::: info [تاريخ الإصدار]
| الإصدار | التغييرات |
| --- | --- |
| v22.2.0, v20.15.0 | تتم الآن مقارنة خاصية سبب الخطأ (Error cause) وخاصية الأخطاء (errors) أيضًا. |
| v18.0.0 | تتم الآن مقارنة خاصية `lastIndex` للتعبيرات النمطية أيضًا. |
| v16.0.0, v14.18.0 | في وضع التأكيد القديم، تم تغيير الحالة من مُهملة إلى قديمة. |
| v14.0.0 | يتم الآن التعامل مع NaN على أنها متطابقة إذا كان كلا الجانبين NaN. |
| v12.0.0 | تتم الآن مقارنة علامات النوع بشكل صحيح وهناك بعض التعديلات الطفيفة في المقارنة لجعل التحقق أقل إثارة للدهشة. |
| v9.0.0 | تتم الآن مقارنة أسماء ورسائل `Error` بشكل صحيح. |
| v8.0.0 | تتم أيضًا مقارنة محتوى `Set` و `Map`. |
| v6.4.0, v4.7.1 | يتم الآن التعامل مع شرائح المصفوفة المكتوبة بشكل صحيح. |
| v6.1.0, v4.5.0 | يمكن الآن استخدام الكائنات ذات المراجع الدائرية كمدخلات. |
| v5.10.1, v4.4.3 | التعامل مع المصفوفات المكتوبة غير `Uint8Array` بشكل صحيح. |
| v0.1.21 | أُضيف في: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**وضع التأكيد الصارم**

اسم مستعار لـ [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**وضع التأكيد القديم**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message) بدلاً من ذلك.
:::

يختبر المساواة العميقة بين المعاملين `actual` و `expected`. يفضل استخدام [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message) بدلاً من ذلك. قد تكون لـ [`assert.deepEqual()`](/ar/nodejs/api/assert#assertdeepequalactual-expected-message) نتائج مفاجئة.

*المساواة العميقة* تعني أن الخصائص "الخاصة" القابلة للتعداد للكائنات الفرعية يتم تقييمها أيضًا بشكل متكرر وفقًا للقواعد التالية.


### تفاصيل المقارنة {#comparison-details}

- تتم مقارنة القيم الأولية باستخدام [`==` عامل التشغيل](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)، باستثناء `NaN`. يتم التعامل معها على أنها متطابقة في حالة كون كلا الجانبين `NaN`.
- يجب أن تكون [علامات النوع](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) للكائنات هي نفسها.
- يتم أخذ [الخصائص "الخاصة" القابلة للتعداد](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) فقط في الاعتبار.
- تتم دائمًا مقارنة أسماء [`Error`](/ar/nodejs/api/errors#class-error) ورسائلها وأسبابها وأخطائها، حتى لو لم تكن هذه خصائص قابلة للتعداد.
- تتم مقارنة [أغلفة الكائنات](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) ككائنات وقيم غير مغلفة.
- تتم مقارنة خصائص `Object` بترتيب غير محدد.
- تتم مقارنة مفاتيح [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) وعناصر [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) بترتيب غير محدد.
- يتوقف الاستدعاء الذاتي عندما يختلف الجانبان أو يواجه الجانبان مرجعًا دائريًا.
- لا يختبر التنفيذ [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) للكائنات.
- لا تتم مقارنة خصائص [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).
- لا تعتمد مقارنة [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) و [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) على قيمهما ولكن فقط على مثيلاتهما.
- تتم دائمًا مقارنة lastIndex والأعلام والمصدر [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)، حتى لو لم تكن هذه خصائص قابلة للتعداد.

المثال التالي لا يطرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) لأن القيم الأولية تتم مقارنتها باستخدام [`==` عامل التشغيل](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality).

::: code-group
```js [ESM]
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```js [CJS]
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
:::

تعني المساواة "العميقة" أن الخصائص "الخاصة" القابلة للتعداد للكائنات التابعة يتم تقييمها أيضًا:

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
:::

إذا كانت القيم غير متساوية، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين الخاصية `message` مساوية لقيمة المعلمة `message`. إذا كانت المعلمة `message` غير محددة، فسيتم تعيين رسالة خطأ افتراضية. إذا كانت المعلمة `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error) فسيتم طرحها بدلاً من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.2.0, v20.15.0 | تتم الآن مقارنة خاصية سبب الخطأ وخصائص الأخطاء أيضًا. |
| v18.0.0 | تتم الآن مقارنة خاصية lastIndex للتعبيرات النمطية أيضًا. |
| v9.0.0 | تتم الآن مقارنة خصائص الرموز القابلة للتعداد. |
| v9.0.0 | تتم الآن مقارنة `NaN` باستخدام مقارنة [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v8.5.0 | تتم الآن مقارنة أسماء ورسائل `Error` بشكل صحيح. |
| v8.0.0 | تتم أيضًا مقارنة محتوى `Set` و `Map`. |
| v6.1.0 | يمكن الآن استخدام الكائنات ذات المراجع الدائرية كمدخلات. |
| v6.4.0, v4.7.1 | يتم الآن التعامل مع شرائح المصفوفة المكتوبة بشكل صحيح. |
| v5.10.1, v4.4.3 | التعامل مع المصفوفات المكتوبة غير `Uint8Array` بشكل صحيح. |
| v1.2.0 | تمت إضافته في: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يختبر المساواة العميقة بين المعاملات `actual` و `expected`. تعني المساواة "العميقة" أن خصائص "الملكية" القابلة للتعداد للكائنات الفرعية يتم تقييمها بشكل متكرر أيضًا وفقًا للقواعد التالية.

### تفاصيل المقارنة {#comparison-details_1}

- تتم مقارنة القيم الأولية باستخدام [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
- يجب أن تكون [علامات النوع](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) للكائنات هي نفسها.
- تتم مقارنة [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) للكائنات باستخدام [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality).
- يتم اعتبار [خصائص "الملكية" القابلة للتعداد فقط](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- تتم دائمًا مقارنة أسماء ورسائل وأسباب وأخطاء [`Error`](/ar/nodejs/api/errors#class-error)، حتى لو لم تكن هذه خصائص قابلة للتعداد. تتم أيضًا مقارنة `errors`.
- تتم أيضًا مقارنة خصائص [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) "الملكية" القابلة للتعداد.
- تتم مقارنة [أغلفة الكائنات](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) ككائنات وقيم غير مغلفة.
- تتم مقارنة خصائص `Object` بدون ترتيب.
- تتم مقارنة مفاتيح [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) وعناصر [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) بدون ترتيب.
- يتوقف التكرار عندما يختلف الجانبان أو يواجه الجانبان مرجعًا دائريًا.
- لا تعتمد مقارنة [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) و [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) على قيمهما. انظر أدناه لمزيد من التفاصيل.
- تتم دائمًا مقارنة آخر فهرس وأعلام ومصدر [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)، حتى لو لم تكن هذه خصائص قابلة للتعداد.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// This fails because 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// The following objects don't have own properties
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Different [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Different type tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK because Object.is(NaN, NaN) is true.

// Different unwrapped numbers:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK because the object and the string are identical when unwrapped.

assert.deepStrictEqual(-0, -0);
// OK

// Different zeros:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, because it is the same symbol on both objects.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, because it is impossible to compare the entries

// Fails because weakMap3 has a property that weakMap1 does not contain:
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```

```js [CJS]
const assert = require('node:assert/strict');

// This fails because 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// The following objects don't have own properties
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Different [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Different type tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK because Object.is(NaN, NaN) is true.

// Different unwrapped numbers:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK because the object and the string are identical when unwrapped.

assert.deepStrictEqual(-0, -0);
// OK

// Different zeros:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, because it is the same symbol on both objects.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, because it is impossible to compare the entries

// Fails because weakMap3 has a property that weakMap1 does not contain:
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

إذا لم تكن القيم متساوية، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير محدد، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error)، فسيتم طرحه بدلاً من `AssertionError`.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | واجهة برمجة التطبيقات هذه لم تعد تجريبية. |
| v13.6.0, v12.16.0 | تمت إضافتها في: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتوقع ألا يتطابق إدخال `string` مع التعبير النمطي.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: كان من المتوقع ألا يتطابق الإدخال مع ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: يجب أن يكون وسيط "string" من النوع string.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: كان من المتوقع ألا يتطابق الإدخال مع ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: يجب أن يكون وسيط "string" من النوع string.

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

إذا تطابقت القيم، أو إذا كان وسيط `string` من نوع آخر غير `string`، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين الخاصية `message` مساوية لقيمة المعلمة `message`. إذا كانت المعلمة `message` غير محددة، فسيتم تعيين رسالة خطأ افتراضية. إذا كانت المعلمة `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error) فسيتم طرحها بدلاً من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**تمت إضافتها في: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ينتظر وعد `asyncFn` أو، إذا كانت `asyncFn` دالة، فإنه يستدعي الدالة على الفور وينتظر اكتمال الوعد الذي تم إرجاعه. ثم سيتحقق من أن الوعد لم يتم رفضه.

إذا كانت `asyncFn` دالة وطرحت خطأ بشكل متزامن، فسوف تُرجع `assert.doesNotReject()` ‏`Promise` مرفوضًا مع هذا الخطأ. إذا لم تُرجع الدالة وعدًا، فسوف تُرجع `assert.doesNotReject()` ‏`Promise` مرفوضًا مع خطأ [`ERR_INVALID_RETURN_VALUE`](/ar/nodejs/api/errors#err_invalid_return_value). في كلتا الحالتين، يتم تخطي معالج الأخطاء.

في الواقع، استخدام `assert.doesNotReject()` ليس مفيدًا لأنه لا يوجد فائدة كبيرة من التقاط الرفض ثم رفضه مرة أخرى. بدلاً من ذلك، ضع في اعتبارك إضافة تعليق بجوار مسار التعليمات البرمجية المحدد الذي يجب ألا يرفض، واحتفظ برسائل الخطأ معبرة قدر الإمكان.

إذا تم تحديد ذلك، يمكن أن يكون `error` ‏[`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) أو [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) أو دالة تحقق. راجع [`assert.throws()`](/ar/nodejs/api/assert#assertthrowsfn-error-message) للحصول على مزيد من التفاصيل.

بالإضافة إلى الطبيعة غير المتزامنة لانتظار الاكتمال، فإنه يتصرف بشكل مماثل لـ [`assert.doesNotThrow()`](/ar/nodejs/api/assert#assertdoesnotthrowfn-error-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```
:::


## `assert.doesNotThrow(fn[, error][, message])` {#assertdoesnotthrowfn-error-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.11.0, v4.4.5 | يتم احترام المعامل `message` الآن. |
| v4.2.0 | يمكن أن يكون المعامل `error` الآن دالة سهمية. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يؤكد أن الدالة `fn` لا تطرح خطأ.

إن استخدام `assert.doesNotThrow()` ليس مفيدًا في الواقع لأنه لا توجد فائدة من التقاط خطأ ثم إعادة طرحه. بدلاً من ذلك، ضع في اعتبارك إضافة تعليق بجوار مسار التعليمات البرمجية المحدد الذي يجب ألا يطرح وابق على رسائل الخطأ معبرة قدر الإمكان.

عند استدعاء `assert.doesNotThrow()`، سيتم استدعاء الدالة `fn` على الفور.

إذا تم طرح خطأ وكان من نفس النوع المحدد بواسطة المعامل `error`، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror). إذا كان الخطأ من نوع مختلف، أو إذا كان المعامل `error` غير محدد، فسيتم إعادة الخطأ إلى المتصل.

إذا تم تحديده، يمكن أن يكون `error` [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) أو [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) أو دالة تحقق. راجع [`assert.throws()`](/ar/nodejs/api/assert#assertthrowsfn-error-message) لمزيد من التفاصيل.

على سبيل المثال، سيؤدي ما يلي إلى طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) لأنه لا يوجد نوع خطأ مطابق في التأكيد:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```
:::

ومع ذلك، سينتج عن ما يلي [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع الرسالة 'Got unwanted exception...' (تم الحصول على استثناء غير مرغوب فيه...):

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```
:::

إذا تم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) وتم توفير قيمة للمعامل `message`، فستتم إضافة قيمة `message` إلى رسالة [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror):

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0, v14.18.0 | في وضع التأكيد القديم، تم تغيير الحالة من مُهمل إلى قديم. |
| v14.0.0 | يتم الآن التعامل مع NaN على أنها متطابقة إذا كان كلا الجانبين NaN. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**وضع التأكيد الصارم**

اسم مستعار لـ [`assert.strictEqual()`](/ar/nodejs/api/assert#assertstrictequalactual-expected-message).

**وضع التأكيد القديم**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`assert.strictEqual()`](/ar/nodejs/api/assert#assertstrictequalactual-expected-message) بدلاً من ذلك.
:::

يختبر المساواة السطحية القسرية بين المعاملين `actual` و `expected` باستخدام [المعامل `==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). يتم التعامل مع `NaN` بشكل خاص وتعتبر متطابقة إذا كان كلا الجانبين `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```js [CJS]
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
:::

إذا لم تكن القيم متساوية، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير معرف، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` عبارة عن نسخة من [`Error`](/ar/nodejs/api/errors#class-error) فسيتم طرحها بدلاً من `AssertionError`.


## `assert.fail([message])` {#assertfailmessage}

**أضيف في: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **الافتراضي:** `'Failed'`

يطرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع رسالة الخطأ المقدمة أو رسالة خطأ افتراضية. إذا كان المعامل `message` نسخة من [`Error`](/ar/nodejs/api/errors#class-error) فسيتم طرحه بدلاً من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
:::

استخدام `assert.fail()` مع أكثر من وسيطتين ممكن ولكنه مهمل. انظر أدناه لمزيد من التفاصيل.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | استدعاء `assert.fail()` مع أكثر من وسيطة واحدة مهمل ويصدر تحذيرًا. |
| v0.1.21 | أضيف في: v0.1.21 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم `assert.fail([message])` أو دوال assert الأخرى بدلاً من ذلك.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **الافتراضي:** `assert.fail`

إذا كان `message` غير صحيح، فسيتم تعيين رسالة الخطأ على أنها قيم `actual` و `expected` مفصولة بواسطة `operator` المقدم. إذا تم توفير وسيطتين `actual` و `expected` فقط، فسيكون `operator` افتراضيًا `'!='`. إذا تم توفير `message` كوسيطة ثالثة، فسيتم استخدامه كرسالة خطأ وسيتم تخزين الوسائط الأخرى كخصائص على الكائن المطروح. إذا تم توفير `stackStartFn`، فسيتم إزالة جميع إطارات المكدس أعلى هذه الدالة من تتبع المكدس (راجع [`Error.captureStackTrace`](/ar/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). إذا لم يتم إعطاء أي وسيطات، فسيتم استخدام الرسالة الافتراضية `Failed`.



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```
:::

في الحالات الثلاث الأخيرة، لا يوجد لـ `actual` و `expected` و `operator` أي تأثير على رسالة الخطأ.

مثال على استخدام `stackStartFn` لتقصير تتبع مكدس الاستثناء:



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```

```js [CJS]
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```
:::

## `assert.ifError(value)` {#assertiferrorvalue}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v10.0.0 | بدلاً من إطلاق الخطأ الأصلي، يتم الآن تضمينه في [`AssertionError`][] التي تحتوي على تتبع المكدس الكامل. |
| الإصدار v10.0.0 | قد تكون القيمة الآن `undefined` أو `null` فقط. قبل ذلك، كانت جميع القيم الزائفة تُعامل بنفس طريقة `null` ولم يتم إطلاق أي خطأ. |
| الإصدار v0.1.97 | تمت إضافته في: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يطرح `value` إذا لم تكن `value` هي `undefined` أو `null`. هذا مفيد عند اختبار وسيطة `error` في عمليات الاسترجاع. يحتوي تتبع المكدس على جميع الإطارات من الخطأ الذي تم تمريره إلى `ifError()` بما في ذلك الإطارات الجديدة المحتملة لـ `ifError()` نفسها.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: Error

// قم بإنشاء بعض إطارات الخطأ العشوائية.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: Error

// قم بإنشاء بعض إطارات الخطأ العشوائية.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError حصلت على استثناء غير مرغوب فيه: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v16.0.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| الإصدار v13.6.0، الإصدار v12.16.0 | تمت الإضافة في: الإصدار v13.6.0، الإصدار v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتوقع أن تتطابق مدخلات `string` مع التعبير النمطي.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
:::

إذا لم تتطابق القيم، أو إذا كانت وسيطة `string` من نوع آخر غير `string`، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير معرف، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error) فسيتم طرحه بدلاً من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v16.0.0، الإصدار v14.18.0 | في وضع التأكيد القديم، تم تغيير الحالة من مهملة إلى قديمة. |
| الإصدار v14.0.0 | يتم الآن التعامل مع NaN على أنها متطابقة إذا كان كلا الجانبين NaN. |
| الإصدار v9.0.0 | تتم الآن مقارنة أسماء ورسائل `Error` بشكل صحيح. |
| الإصدار v8.0.0 | تتم أيضًا مقارنة محتوى `Set` و `Map`. |
| الإصدار v6.4.0، الإصدار v4.7.1 | يتم الآن التعامل مع شرائح المصفوفة المكتوبة بشكل صحيح. |
| الإصدار v6.1.0، الإصدار v4.5.0 | يمكن الآن استخدام الكائنات ذات المراجع الدائرية كمدخلات. |
| الإصدار v5.10.1، الإصدار v4.4.3 | التعامل مع المصفوفات المكتوبة غير `Uint8Array` بشكل صحيح. |
| الإصدار v0.1.21 | تمت الإضافة في: الإصدار v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**وضع التأكيد الصارم**

اسم مستعار لـ [`assert.notDeepStrictEqual()`](/ar/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**وضع التأكيد القديم**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`assert.notDeepStrictEqual()`](/ar/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) بدلاً من ذلك.
:::

يختبر أي عدم مساواة عميقة. عكس [`assert.deepEqual()`](/ar/nodejs/api/assert#assertdeepequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
:::

إذا كانت القيم متساوية بشكل عميق، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير معرف، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error) فسيتم طرحه بدلاً من `AssertionError`.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | لم يعد `-0` و `+0` يعتبران متساويين. |
| v9.0.0 | تتم الآن مقارنة `NaN` باستخدام مقارنة [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v9.0.0 | تتم الآن مقارنة أسماء ورسائل `Error` بشكل صحيح. |
| v8.0.0 | تتم أيضًا مقارنة محتوى `Set` و `Map`. |
| v6.1.0 | يمكن الآن استخدام الكائنات ذات المراجع الدائرية كمدخلات. |
| v6.4.0, v4.7.1 | تتم معالجة شرائح المصفوفة المكتوبة بشكل صحيح الآن. |
| v5.10.1, v4.4.3 | التعامل مع المصفوفات المكتوبة غير `Uint8Array` بشكل صحيح. |
| v1.2.0 | تمت الإضافة في: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يختبر عدم المساواة الدقيقة العميقة. عكس [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
:::

إذا كانت القيم متساوية بشكل عميق ودقيق، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير معرف، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error)، فسيتم طرحه بدلاً من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0, v14.18.0 | في وضع تأكيد Legacy، تم تغيير الحالة من Deprecated إلى Legacy. |
| v14.0.0 | يتم الآن التعامل مع NaN على أنها متطابقة إذا كان كلا الجانبين NaN. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**وضع التأكيد الدقيق**

اسم مستعار لـ [`assert.notStrictEqual()`](/ar/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**وضع التأكيد القديم**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`assert.notStrictEqual()`](/ar/nodejs/api/assert#assertnotstrictequalactual-expected-message) بدلاً من ذلك.
:::

يختبر عدم المساواة السطحية والقسرية باستخدام [`!=` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality). تتم معالجة `NaN` بشكل خاص وتعتبر متطابقة إذا كان كلا الجانبين `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```js [CJS]
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
:::

إذا كانت القيم متساوية، فسيتم طرح [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير معرف، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` مثيلاً لـ [`Error`](/ar/nodejs/api/errors#class-error)، فسيتم طرحه بدلاً من `AssertionError`.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تم تغيير المقارنة المستخدمة من المساواة الصارمة إلى `Object.is()`. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

تختبر عدم المساواة الصارمة بين المعاملين `actual` و `expected` كما تحدده [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// موافق

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: المتوقع أن يكون "actual" غير مساوٍ تمامًا لـ:
//
// 1

assert.notStrictEqual(1, '1');
// موافق
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// موافق

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: المتوقع أن يكون "actual" غير مساوٍ تمامًا لـ:
//
// 1

assert.notStrictEqual(1, '1');
// موافق
```
:::

إذا كانت القيم متساوية تمامًا، فسيتم إلقاء [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` تساوي قيمة المعامل `message`. إذا كان المعامل `message` غير معرف، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` نسخة من [`Error`](/ar/nodejs/api/errors#class-error) فسيتم إلقاؤه بدلاً من `AssertionError`.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | ستستخدم `assert.ok()` (بدون وسائط) الآن رسالة خطأ محددة مسبقًا. |
| v0.1.21 | تمت الإضافة في: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يختبر ما إذا كانت `value` صحيحة. إنه يعادل `assert.equal(!!value, true, message)`.

إذا لم تكن `value` صحيحة، فسيتم إلقاء [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` تساوي قيمة المعامل `message`. إذا كان المعامل `message` هو `undefined`، فسيتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` نسخة من [`Error`](/ar/nodejs/api/errors#class-error) فسيتم إلقاؤه بدلاً من `AssertionError`. إذا لم يتم تمرير أي وسائط على الإطلاق، فسيتم تعيين `message` على السلسلة: `'No value argument passed to `assert.ok()`'`.

كن على علم بأنه في `repl` ستكون رسالة الخطأ مختلفة عن تلك التي يتم إلقاؤها في ملف! انظر أدناه لمزيد من التفاصيل.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// موافق
assert.ok(1);
// موافق

assert.ok();
// AssertionError: لم يتم تمرير وسيطة قيمة إلى `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: إنها خاطئة

// في repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// في ملف (مثل test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert.ok(0)
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ok(true);
// موافق
assert.ok(1);
// موافق

assert.ok();
// AssertionError: لم يتم تمرير وسيطة قيمة إلى `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: إنها خاطئة

// في repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// في ملف (مثل test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert.ok(0)
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// استخدام `assert()` يعمل بنفس الطريقة:
assert(0);
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// استخدام `assert()` يعمل بنفس الطريقة:
assert(0);
// AssertionError: تم تقييم التعبير إلى قيمة خاطئة:
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**أُضيف في: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تنتظر الوعد `asyncFn` أو، إذا كانت `asyncFn` دالة، تستدعي الدالة فورًا وتنتظر الوعد المرتجع ليكتمل. ثم ستتحقق من أن الوعد قد رُفض.

إذا كانت `asyncFn` دالة وتطرح خطأ بشكل متزامن، فستعيد `assert.rejects()` ‏`Promise` مرفوضًا مع هذا الخطأ. إذا لم ترجع الدالة وعدًا، فستعيد `assert.rejects()` ‏`Promise` مرفوضًا مع خطأ [`ERR_INVALID_RETURN_VALUE`](/ar/nodejs/api/errors#err_invalid_return_value). في كلتا الحالتين، يتم تخطي معالج الأخطاء.

بالإضافة إلى الطبيعة غير المتزامنة لانتظار الاكتمال، تتصرف بشكل مطابق لـ [`assert.throws()`](/ar/nodejs/api/assert#assertthrowsfn-error-message).

إذا تم تحديده، يمكن أن يكون `error` عبارة عن [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)، أو [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)، أو دالة تحقق، أو كائن حيث سيتم اختبار كل خاصية، أو نسخة من خطأ حيث سيتم اختبار كل خاصية بما في ذلك خصائص `message` و `name` غير القابلة للتعداد.

إذا تم تحديده، ستكون `message` هي الرسالة المقدمة من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) إذا فشلت `asyncFn` في الرفض.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Wrong value');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```
:::

لا يمكن أن يكون `error` سلسلة. إذا تم توفير سلسلة كوسيطة ثانية، فسيُفترض أن `error` تم حذفه وسيتم استخدام السلسلة لـ `message` بدلاً من ذلك. يمكن أن يؤدي ذلك إلى أخطاء سهلة الفقد. يرجى قراءة المثال في [`assert.throws()`](/ar/nodejs/api/assert#assertthrowsfn-error-message) بعناية إذا تم اعتبار استخدام سلسلة كوسيطة ثانية.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تم تغيير المقارنة المستخدمة من المساواة الصارمة إلى `Object.is()`. |
| v0.1.21 | أُضيف في: v0.1.21 |
:::

- `actual` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يختبر المساواة الصارمة بين المعاملين `actual` و `expected` كما تحددها [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// موافق

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```

```js [CJS]
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// موافق

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```
:::

إذا لم تكن القيم متساوية تمامًا، يتم إطلاق [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror) مع تعيين خاصية `message` مساوية لقيمة المعامل `message`. إذا كان المعامل `message` غير معرف، يتم تعيين رسالة خطأ افتراضية. إذا كان المعامل `message` هو نسخة من [`Error`](/ar/nodejs/api/errors#class-error)، فسيتم إطلاقه بدلاً من [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v10.2.0 | يمكن للمعامل `error` أن يكون كائنًا يحتوي على تعبيرات نمطية الآن. |
| v9.9.0 | يمكن للمعامل `error` الآن أن يكون كائنًا أيضًا. |
| v4.2.0 | يمكن للمعامل `error` الآن أن يكون دالة سهمية. |
| v0.1.21 | تمت إضافته في: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تتوقع أن تقوم الدالة `fn` بإلقاء خطأ.

إذا تم تحديد `error`، فيمكن أن تكون [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) أو [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) أو دالة تحقق أو كائن تحقق حيث سيتم اختبار كل خاصية فيه للتأكد من المساواة العميقة الصارمة أو نسخة من خطأ حيث سيتم اختبار كل خاصية فيه للتأكد من المساواة العميقة الصارمة بما في ذلك الخصائص غير القابلة للتعداد `message` و `name`. عند استخدام كائن، من الممكن أيضًا استخدام تعبير نمطي، عند التحقق من صحة خاصية السلسلة. انظر أدناه للحصول على أمثلة.

إذا تم تحديد `message`، فسيتم إلحاقها بالرسالة المقدمة من `AssertionError` إذا فشل استدعاء `fn` في الإلقاء أو في حالة فشل التحقق من صحة الخطأ.

نموذج لكائن/نموذج خطأ للتحقق المخصص:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('قيمة خاطئة');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'قيمة خاطئة',
    info: {
      nested: true,
      baz: 'text',
    },
    // سيتم اختبار الخصائص الموجودة في كائن التحقق فقط.
    // يتطلب استخدام الكائنات المتداخلة وجود جميع الخصائص. وإلا
    // فسيفشل التحقق.
  },
);

// استخدام التعبيرات النمطية للتحقق من خصائص الخطأ:
assert.throws(
  () => {
    throw err;
  },
  {
    // الخاصيتان `name` و `message` عبارة عن سلاسل نصية وسيتم استخدام التعبيرات النمطية
    // الموجودة عليها للمطابقة مع السلسلة النصية. إذا فشلت، فسيتم إلقاء
    // خطأ.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // لا يمكن استخدام التعبيرات النمطية للخصائص المتداخلة!
      baz: 'text',
    },
    // تحتوي الخاصية `reg` على تعبير نمطي وفقط إذا كان
    // يحتوي كائن التحقق على تعبير نمطي مطابق، فسوف
    // ينجح.
    reg: /abc/i,
  },
);

// يفشل بسبب اختلال خصائص `message` و `name`:
assert.throws(
  () => {
    const otherErr = new Error('غير موجود');
    // انسخ جميع الخصائص القابلة للتعداد من `err` إلى `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // سيتم أيضًا التحقق من خصائص `message` و `name` الخاصة بالخطأ عند استخدام
  // خطأ ككائن تحقق.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('قيمة خاطئة');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'قيمة خاطئة',
    info: {
      nested: true,
      baz: 'text',
    },
    // سيتم اختبار الخصائص الموجودة في كائن التحقق فقط.
    // يتطلب استخدام الكائنات المتداخلة وجود جميع الخصائص. وإلا
    // فسيفشل التحقق.
  },
);

// استخدام التعبيرات النمطية للتحقق من خصائص الخطأ:
assert.throws(
  () => {
    throw err;
  },
  {
    // الخاصيتان `name` و `message` عبارة عن سلاسل نصية وسيتم استخدام التعبيرات النمطية
    // الموجودة عليها للمطابقة مع السلسلة النصية. إذا فشلت، فسيتم إلقاء
    // خطأ.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // لا يمكن استخدام التعبيرات النمطية للخصائص المتداخلة!
      baz: 'text',
    },
    // تحتوي الخاصية `reg` على تعبير نمطي وفقط إذا كان
    // يحتوي كائن التحقق على تعبير نمطي مطابق، فسوف
    // ينجح.
    reg: /abc/i,
  },
);

// يفشل بسبب اختلال خصائص `message` و `name`:
assert.throws(
  () => {
    const otherErr = new Error('غير موجود');
    // انسخ جميع الخصائص القابلة للتعداد من `err` إلى `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // سيتم أيضًا التحقق من خصائص `message` و `name` الخاصة بالخطأ عند استخدام
  // خطأ ككائن تحقق.
  err,
);
```
:::

تحقق من instanceof باستخدام المُنشئ:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('قيمة خاطئة');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('قيمة خاطئة');
  },
  Error,
);
```
:::

تحقق من رسالة الخطأ باستخدام [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

سيؤدي استخدام تعبير نمطي إلى تشغيل `.toString` على كائن الخطأ، وبالتالي سيشمل أيضًا اسم الخطأ.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('قيمة خاطئة');
  },
  /^Error: Wrong value$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('قيمة خاطئة');
  },
  /^Error: Wrong value$/,
);
```
:::

التحقق من صحة الخطأ المخصص:

يجب أن تُرجع الدالة `true` للإشارة إلى نجاح جميع عمليات التحقق الداخلية. وإلا فسوف تفشل مع [`AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('قيمة خاطئة');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // تجنب إرجاع أي شيء من وظائف التحقق بخلاف `true`.
    // خلاف ذلك، ليس من الواضح أي جزء من التحقق فشل. بدلاً من ذلك،
    // ألقِ خطأً بشأن التحقق المحدد الذي فشل (كما هو موضح في هذا
    // المثال) وأضف أكبر قدر ممكن من معلومات التصحيح المفيدة إلى هذا الخطأ
    // ممكن.
    return true;
  },
  'خطأ غير متوقع',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('قيمة خاطئة');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // تجنب إرجاع أي شيء من وظائف التحقق بخلاف `true`.
    // خلاف ذلك، ليس من الواضح أي جزء من التحقق فشل. بدلاً من ذلك،
    // ألقِ خطأً بشأن التحقق المحدد الذي فشل (كما هو موضح في هذا
    // المثال) وأضف أكبر قدر ممكن من معلومات التصحيح المفيدة إلى هذا الخطأ
    // ممكن.
    return true;
  },
  'خطأ غير متوقع',
);
```
:::

لا يمكن أن يكون `error` سلسلة. إذا تم توفير سلسلة كوسيطة ثانية، فسيتم افتراض حذف `error` وسيتم استخدام السلسلة لـ `message` بدلاً من ذلك. يمكن أن يؤدي هذا إلى أخطاء سهلة الفقدان. سيؤدي استخدام نفس الرسالة مثل رسالة الخطأ التي تم إلقاؤها إلى حدوث خطأ `ERR_AMBIGUOUS_ARGUMENT`. يرجى قراءة المثال أدناه بعناية إذا تم اعتبار استخدام سلسلة كوسيطة ثانية:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('الأول');
}

function throwingSecond() {
  throw new Error('الثاني');
}

function notThrowing() {}

// الوسيطة الثانية عبارة عن سلسلة والدالة المدخلة ألقت خطأً.
// لن يتم إلقاء الحالة الأولى لأنها لا تتطابق مع رسالة الخطأ
// التي ألقتها الدالة المدخلة!
assert.throws(throwingFirst, 'الثاني');
// في المثال التالي، لا توجد فائدة للرسالة على رسالة
// الخطأ، ونظرًا لأنه ليس من الواضح ما إذا كان المستخدم ينوي بالفعل المطابقة
// مع رسالة الخطأ، فإن Node.js يلقي خطأ `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'الثاني');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// يتم استخدام السلسلة فقط (كرسالة) في حالة عدم إلقاء الدالة:
assert.throws(notThrowing, 'الثاني');
// AssertionError [ERR_ASSERTION]: الاستثناء المتوقع مفقود: الثاني

// إذا كان المقصود هو المطابقة مع رسالة الخطأ، فافعل هذا بدلاً من ذلك:
// لا يتم إلقاؤه لأن رسائل الخطأ متطابقة.
assert.throws(throwingSecond, /Second$/);

// إذا كانت رسالة الخطأ غير متطابقة، فسيتم إلقاء AssertionError.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('الأول');
}

function throwingSecond() {
  throw new Error('الثاني');
}

function notThrowing() {}

// الوسيطة الثانية عبارة عن سلسلة والدالة المدخلة ألقت خطأً.
// لن يتم إلقاء الحالة الأولى لأنها لا تتطابق مع رسالة الخطأ
// التي ألقتها الدالة المدخلة!
assert.throws(throwingFirst, 'الثاني');
// في المثال التالي، لا توجد فائدة للرسالة على رسالة
// الخطأ، ونظرًا لأنه ليس من الواضح ما إذا كان المستخدم ينوي بالفعل المطابقة
// مع رسالة الخطأ، فإن Node.js يلقي خطأ `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'الثاني');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// يتم استخدام السلسلة فقط (كرسالة) في حالة عدم إلقاء الدالة:
assert.throws(notThrowing, 'الثاني');
// AssertionError [ERR_ASSERTION]: الاستثناء المتوقع مفقود: الثاني

// إذا كان المقصود هو المطابقة مع رسالة الخطأ، فافعل هذا بدلاً من ذلك:
// لا يتم إلقاؤه لأن رسائل الخطأ متطابقة.
assert.throws(throwingSecond, /Second$/);

// إذا كانت رسالة الخطأ غير متطابقة، فسيتم إلقاء AssertionError.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

نظرًا للتدوين المربك والمعرض للخطأ، تجنب استخدام سلسلة كوسيطة ثانية.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**أُضيف في: الإصدار v23.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/ar/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) تؤكد التكافؤ بين المعاملين `actual` و `expected` من خلال مقارنة عميقة، مع ضمان وجود جميع الخصائص الموجودة في المعامل `expected` في المعامل `actual` بقيم مكافئة، وعدم السماح بالإكراه على النوع. والفرق الرئيسي مع [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message) هو أن [`assert.partialDeepStrictEqual()`](/ar/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) لا تتطلب وجود جميع الخصائص الموجودة في المعامل `actual` في المعامل `expected`. يجب أن تجتاز هذه الطريقة دائمًا نفس حالات الاختبار مثل [`assert.deepStrictEqual()`](/ar/nodejs/api/assert#assertdeepstrictequalactual-expected-message)، وتتصرف كمجموعة فائقة منها.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual(new Set(['value1', 'value2']), new Set(['value1', 'value2']));
// OK

assert.partialDeepStrictEqual(new Map([['key1', 'value1']]), new Map([['key1', 'value1']]));
// OK

assert.partialDeepStrictEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
// OK

assert.partialDeepStrictEqual(/abc/, /abc/);
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual(new Date(0), new Date(0));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```

```js [CJS]
const assert = require('node:assert');

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```
:::

