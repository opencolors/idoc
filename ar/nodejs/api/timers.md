---
title: توثيق واجهة برمجة التطبيقات (API) لـ Timers في Node.js
description: توفر وحدة Timers في Node.js وظائف لجدولة الدوال ليتم استدعاؤها في فترة زمنية مستقبلية. يشمل ذلك أساليب مثل setTimeout، و setInterval، و setImmediate، والنظيرات المقابلة لها مثل clear، بالإضافة إلى process.nextTick لتنفيذ الكود في التكرار التالي من حلقة الأحداث.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات (API) لـ Timers في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة Timers في Node.js وظائف لجدولة الدوال ليتم استدعاؤها في فترة زمنية مستقبلية. يشمل ذلك أساليب مثل setTimeout، و setInterval، و setImmediate، والنظيرات المقابلة لها مثل clear، بالإضافة إلى process.nextTick لتنفيذ الكود في التكرار التالي من حلقة الأحداث.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات (API) لـ Timers في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة Timers في Node.js وظائف لجدولة الدوال ليتم استدعاؤها في فترة زمنية مستقبلية. يشمل ذلك أساليب مثل setTimeout، و setInterval، و setImmediate، والنظيرات المقابلة لها مثل clear، بالإضافة إلى process.nextTick لتنفيذ الكود في التكرار التالي من حلقة الأحداث.
---


# المؤقتات {#timers}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

تعرض الوحدة النمطية `timer` واجهة برمجة تطبيقات عالمية لجدولة استدعاء الدوال في فترة زمنية مستقبلية. نظرًا لأن دوال المؤقت هي دوال عالمية، فليست هناك حاجة لاستدعاء `require('node:timers')` لاستخدام واجهة برمجة التطبيقات.

تنفذ دوال المؤقت داخل Node.js واجهة برمجة تطبيقات مماثلة لواجهة برمجة تطبيقات المؤقتات التي توفرها متصفحات الويب ولكنها تستخدم تطبيقًا داخليًا مختلفًا مبنيًا حول [حلقة الأحداث](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) الخاصة بـ Node.js.

## الصنف: `Immediate` {#class-immediate}

يتم إنشاء هذا الكائن داخليًا ويتم إرجاعه من [`setImmediate()`](/ar/nodejs/api/timers#setimmediatecallback-args). يمكن تمريره إلى [`clearImmediate()`](/ar/nodejs/api/timers#clearimmediateimmediate) لإلغاء الإجراءات المجدولة.

افتراضيًا، عند جدولة immediate، ستستمر حلقة أحداث Node.js في العمل طالما أن immediate نشط. يصدر الكائن `Immediate` الذي تم إرجاعه بواسطة [`setImmediate()`](/ar/nodejs/api/timers#setimmediatecallback-args) كل من الدالتين `immediate.ref()` و `immediate.unref()` اللتين يمكن استخدامهما للتحكم في هذا السلوك الافتراضي.

### `immediate.hasRef()` {#immediatehasref}

**أضيف في: v11.0.0**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت true، فسيحافظ الكائن `Immediate` على حلقة أحداث Node.js نشطة.

### `immediate.ref()` {#immediateref}

**أضيف في: v9.7.0**

- Returns: [\<Immediate\>](/ar/nodejs/api/timers#class-immediate) مرجع إلى `immediate`

عند استدعائها، تطلب أن *لا* تخرج حلقة أحداث Node.js طالما أن `Immediate` نشط. لن يكون لاستدعاء `immediate.ref()` عدة مرات أي تأثير.

افتراضيًا، يتم "الإشارة" إلى جميع كائنات `Immediate`، مما يجعل من غير الضروري عادةً استدعاء `immediate.ref()` ما لم يتم استدعاء `immediate.unref()` مسبقًا.


### `immediate.unref()` {#immediateunref}

**تمت الإضافة في: الإصدار 9.7.0**

- يُعيد: [\<Immediate\>](/ar/nodejs/api/timers#class-immediate) مرجعًا إلى `immediate`

عند استدعائها، لن يتطلب الكائن `Immediate` النشط بقاء حلقة أحداث Node.js نشطة. إذا لم يكن هناك نشاط آخر يحافظ على تشغيل حلقة الأحداث، فقد يخرج العملية قبل استدعاء رد نداء الكائن `Immediate`. لن يكون لاستدعاء `immediate.unref()` عدة مرات أي تأثير.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**تمت الإضافة في: الإصدار 20.5.0، الإصدار 18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يلغي الحالة الفورية. هذا مشابه لاستدعاء `clearImmediate()`.

## فئة: `Timeout` {#class-timeout}

يتم إنشاء هذا الكائن داخليًا ويتم إرجاعه من [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args) و [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args). يمكن تمريره إما إلى [`clearTimeout()`](/ar/nodejs/api/timers#cleartimeouttimeout) أو [`clearInterval()`](/ar/nodejs/api/timers#clearintervaltimeout) لإلغاء الإجراءات المجدولة.

بشكل افتراضي، عند جدولة مؤقت باستخدام إما [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args) أو [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args)، ستستمر حلقة أحداث Node.js في العمل طالما أن المؤقت نشط. كل كائن من كائنات `Timeout` التي يتم إرجاعها بواسطة هذه الدوال يصدر كلًا من الدالتين `timeout.ref()` و `timeout.unref()` التي يمكن استخدامها للتحكم في هذا السلوك الافتراضي.

### `timeout.close()` {#timeoutclose}

**تمت الإضافة في: الإصدار 0.9.1**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`clearTimeout()`](/ar/nodejs/api/timers#cleartimeouttimeout) بدلاً من ذلك.
:::

- يُعيد: [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) مرجعًا إلى `timeout`

يلغي المهلة.

### `timeout.hasRef()` {#timeouthasref}

**تمت الإضافة في: الإصدار 11.0.0**

- يُعيد: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة true، فسوف يحافظ الكائن `Timeout` على حلقة أحداث Node.js نشطة.


### `timeout.ref()` {#timeoutref}

**تمت إضافتها في: v0.9.1**

- تُرجع: [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) مرجعًا إلى `timeout`

عند استدعائها، تطلب من حلقة أحداث Node.js *عدم* الخروج ما دامت `Timeout` نشطة. استدعاء `timeout.ref()` عدة مرات لن يكون له أي تأثير.

افتراضيًا، جميع كائنات `Timeout` تكون "مرجعية"، مما يجعل من غير الضروري عادةً استدعاء `timeout.ref()` ما لم يتم استدعاء `timeout.unref()` مسبقًا.

### `timeout.refresh()` {#timeoutrefresh}

**تمت إضافتها في: v10.2.0**

- تُرجع: [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) مرجعًا إلى `timeout`

يضبط وقت بدء المؤقت إلى الوقت الحالي، ويعيد جدولة المؤقت لاستدعاء رد الاتصال الخاص به بالمدة المحددة مسبقًا والمعدلة بالوقت الحالي. هذا مفيد لتحديث المؤقت دون تخصيص كائن JavaScript جديد.

سيؤدي استخدام هذا على مؤقت قام بالفعل باستدعاء رد الاتصال الخاص به إلى إعادة تنشيط المؤقت.

### `timeout.unref()` {#timeoutunref}

**تمت إضافتها في: v0.9.1**

- تُرجع: [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) مرجعًا إلى `timeout`

عند استدعائها، لن يتطلب كائن `Timeout` النشط من حلقة أحداث Node.js البقاء نشطة. إذا لم يكن هناك نشاط آخر يبقي حلقة الأحداث قيد التشغيل، فقد تخرج العملية قبل استدعاء رد الاتصال الخاص بكائن `Timeout`. استدعاء `timeout.unref()` عدة مرات لن يكون له أي تأثير.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**تمت إضافتها في: v14.9.0, v12.19.0**

- تُرجع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقمًا يمكن استخدامه للإشارة إلى هذا `timeout`

إجبار `Timeout` على نوع بدائي. يمكن استخدام النوع البدائي لمسح `Timeout`. لا يمكن استخدام النوع البدائي إلا في نفس مؤشر الترابط حيث تم إنشاء المهلة. لذلك، لاستخدامه عبر [`worker_threads`](/ar/nodejs/api/worker_threads)، يجب أولاً تمريره إلى مؤشر الترابط الصحيح. هذا يسمح بتوافق محسّن مع تطبيقات `setTimeout()` و `setInterval()` في المتصفح.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**تمت إضافتها في: v20.5.0, v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يلغي المهلة.


## جدولة المؤقتات {#scheduling-timers}

المؤقت في Node.js هو بناء داخلي يستدعي دالة معينة بعد فترة زمنية معينة. يختلف وقت استدعاء دالة المؤقت اعتمادًا على الطريقة التي تم استخدامها لإنشاء المؤقت وما يفعله حلقة أحداث Node.js من عمل آخر.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | الآن يقوم تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` بإلقاء `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.9.1 | تمت الإضافة في: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي سيتم استدعاؤها في نهاية هذه الدورة من [حلقة الأحداث](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) الخاصة بـ Node.js
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسائط اختيارية لتمريرها عند استدعاء `callback`.
- الإرجاع: [\<Immediate\>](/ar/nodejs/api/timers#class-immediate) للاستخدام مع [`clearImmediate()`](/ar/nodejs/api/timers#clearimmediateimmediate)

يجدول التنفيذ "الفوري" لـ `callback` بعد استدعاءات أحداث الإدخال والإخراج.

عند إجراء مكالمات متعددة إلى `setImmediate()`، يتم وضع دوال `callback` في قائمة الانتظار للتنفيذ بالترتيب الذي تم إنشاؤها به. تتم معالجة قائمة انتظار ردود النداء بأكملها في كل تكرار لحلقة الأحداث. إذا تم وضع مؤقت فوري في قائمة الانتظار من داخل دالة رد نداء قيد التنفيذ، فلن يتم تشغيل هذا المؤقت حتى التكرار التالي لحلقة الأحداث.

إذا لم يكن `callback` دالة، فسيتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

تحتوي هذه الطريقة على متغير مخصص للوعود متاح باستخدام [`timersPromises.setImmediate()`](/ar/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | الآن يقوم تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` بإلقاء `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.0.1 | تمت الإضافة في: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي سيتم استدعاؤها عند انقضاء المؤقت.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية للانتظار قبل استدعاء `callback`. **افتراضي:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسائط اختيارية لتمريرها عند استدعاء `callback`.
- الإرجاع: [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) للاستخدام مع [`clearInterval()`](/ar/nodejs/api/timers#clearintervaltimeout)

يجدول التنفيذ المتكرر لـ `callback` كل `delay` مللي ثانية.

عندما يكون `delay` أكبر من `2147483647` أو أقل من `1` أو `NaN`، سيتم تعيين `delay` إلى `1`. يتم اقتطاع التأخيرات غير الصحيحة إلى عدد صحيح.

إذا لم يكن `callback` دالة، فسيتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

تحتوي هذه الطريقة على متغير مخصص للوعود متاح باستخدام [`timersPromises.setInterval()`](/ar/nodejs/api/timers#timerspromisessetintervaldelay-value-options).


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يؤدي الآن إلى رمي `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.0.1 | تمت الإضافة في: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي سيتم استدعاؤها عند انقضاء المؤقت.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية للانتظار قبل استدعاء `callback`. **الافتراضي:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسائط اختيارية لتمريرها عند استدعاء `callback`.
- Returns: [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) للاستخدام مع [`clearTimeout()`](/ar/nodejs/api/timers#cleartimeouttimeout)

يحدد جدولة تنفيذ `callback` لمرة واحدة بعد `delay` مللي ثانية.

من المحتمل ألا يتم استدعاء `callback` في `delay` مللي ثانية بالضبط. لا يقدم Node.js أي ضمانات بشأن التوقيت الدقيق لموعد تشغيل دوال رد النداء، ولا بشأن ترتيبها. سيتم استدعاء دالة رد النداء في أقرب وقت ممكن من الوقت المحدد.

عندما تكون قيمة `delay` أكبر من `2147483647` أو أقل من `1` أو `NaN`، سيتم تعيين `delay` إلى `1`. يتم اقتطاع قيم التأخير غير الصحيحة إلى عدد صحيح.

إذا لم تكن `callback` دالة، فسيتم رمي [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

يحتوي هذا الأسلوب على صيغة مخصصة للوعود متاحة باستخدام [`timersPromises.setTimeout()`](/ar/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## إلغاء المؤقتات {#cancelling-timers}

تُرجع طرق [`setImmediate()`](/ar/nodejs/api/timers#setimmediatecallback-args) و [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args) و [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args) كائنات تمثل المؤقتات المجدولة. يمكن استخدامها لإلغاء المؤقت ومنعه من التشغيل.

بالنسبة إلى المتغيرات الموعودة لـ [`setImmediate()`](/ar/nodejs/api/timers#setimmediatecallback-args) و [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args)، يمكن استخدام [`AbortController`](/ar/nodejs/api/globals#class-abortcontroller) لإلغاء المؤقت. عند الإلغاء، سيتم رفض الوعود المرجعة بـ `'AbortError'`.

بالنسبة إلى `setImmediate()`:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// نحن لا نستخدم `await` للوعد لذلك يتم استدعاء `ac.abort()` في نفس الوقت.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('تم إحباط القيمة الفورية');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('تم إحباط القيمة الفورية');
  });

ac.abort();
```
:::

بالنسبة إلى `setTimeout()`:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// نحن لا نستخدم `await` للوعد لذلك يتم استدعاء `ac.abort()` في نفس الوقت.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('تم إحباط المهلة');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('تم إحباط المهلة');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**تمت الإضافة في: v0.9.1**

- `immediate` [\<Immediate\>](/ar/nodejs/api/timers#class-immediate) كائن `Immediate` كما تم إرجاعه بواسطة [`setImmediate()`](/ar/nodejs/api/timers#setimmediatecallback-args).

يلغي كائن `Immediate` تم إنشاؤه بواسطة [`setImmediate()`](/ar/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**تمت الإضافة في: v0.0.1**

- `timeout` [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) كائن `Timeout` كما تم إرجاعه بواسطة [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args) أو [النوع الأساسي](/ar/nodejs/api/timers#timeoutsymboltoprimitive) لكائن `Timeout` كسلسلة أو رقم.

يلغي كائن `Timeout` تم إنشاؤه بواسطة [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**تمت الإضافة في: v0.0.1**

- `timeout` [\<Timeout\>](/ar/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) كائن `Timeout` كما تم إرجاعه بواسطة [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args) أو [النوع الأساسي](/ar/nodejs/api/timers#timeoutsymboltoprimitive) لكائن `Timeout` كسلسلة أو رقم.

يلغي كائن `Timeout` تم إنشاؤه بواسطة [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args).

## واجهة برمجة تطبيقات الموقتات الوعود (Timers Promises API) {#timers-promises-api}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | تخرجت من تجريبي. |
| v15.0.0 | تمت الإضافة في: v15.0.0 |
:::

توفر واجهة برمجة التطبيقات `timers/promises` مجموعة بديلة من وظائف الموقت التي تُرجع كائنات `Promise`. يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('node:timers/promises')`.

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**تمت الإضافة في: الإصدار 15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية للانتظار قبل تحقيق الوعد. **الافتراضي:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة التي سيتحقق بها الوعد.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تم التعيين إلى `false` للإشارة إلى أن `Timeout` المُجدول يجب ألا يتطلب بقاء حلقة أحداث Node.js نشطة. **الافتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) `AbortSignal` اختياري يمكن استخدامه لإلغاء `Timeout` المُجدول.
  
 



::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**تمت الإضافة في: الإصدار 15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة التي سيتحقق بها الوعد.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تم التعيين إلى `false` للإشارة إلى أن `Immediate` المُجدول يجب ألا يتطلب بقاء حلقة أحداث Node.js نشطة. **الافتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) `AbortSignal` اختياري يمكن استخدامه لإلغاء `Immediate` المُجدول.
  
 



::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**أُضيف في: v15.9.0**

يُرجع مُكرِّرًا غير متزامن يُولِّد قيمًا بفواصل زمنية قدرها `delay` بالمللي ثانية. إذا كانت `ref` هي `true`، فيجب عليك استدعاء `next()` للمُكرِّر غير المتزامن بشكل صريح أو ضمني للحفاظ على استمرارية حلقة الأحداث.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية للانتظار بين التكرارات. **الافتراضي:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة يُرجعها المُكرِّر.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) اضبط على `false` للإشارة إلى أن `Timeout` المجدول بين التكرارات لا ينبغي أن يتطلب بقاء حلقة أحداث Node.js نشطة. **الافتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) `AbortSignal` اختياري يمكن استخدامه لإلغاء `Timeout` المجدول بين العمليات.

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**أُضيف في: v17.3.0, v16.14.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية للانتظار قبل حلّ الوعد.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) اضبط على `false` للإشارة إلى أن `Timeout` المجدول لا ينبغي أن يتطلب بقاء حلقة أحداث Node.js نشطة. **الافتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) `AbortSignal` اختياري يمكن استخدامه لإلغاء الانتظار.

- يُرجع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

واجهة برمجة تطبيقات تجريبية مُعرَّفة بواسطة مسودة [واجهات برمجة تطبيقات الجدولة](https://github.com/WICG/scheduling-apis) التي يتم تطويرها كواجهة برمجة تطبيقات قياسية لمنصة الويب.

استدعاء `timersPromises.scheduler.wait(delay, options)` مكافئ لاستدعاء `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // انتظر ثانية واحدة قبل المتابعة
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**تمت إضافته في: v17.3.0, v16.14.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

واجهة برمجة تطبيقات تجريبية تم تعريفها بواسطة مسودة مواصفات [واجهات برمجة تطبيقات الجدولة](https://github.com/WICG/scheduling-apis) التي يتم تطويرها كواجهة برمجة تطبيقات قياسية لمنصة الويب.

استدعاء `timersPromises.scheduler.yield()` يعادل استدعاء `timersPromises.setImmediate()` بدون وسائط.

