---
title: توثيق Node.js - Performance Hooks
description: استكشف واجهة برمجة التطبيقات Performance Hooks في Node.js، التي توفر الوصول إلى مقاييس الأداء وأدوات لقياس أداء تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Performance Hooks | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف واجهة برمجة التطبيقات Performance Hooks في Node.js، التي توفر الوصول إلى مقاييس الأداء وأدوات لقياس أداء تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Performance Hooks | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف واجهة برمجة التطبيقات Performance Hooks في Node.js، التي توفر الوصول إلى مقاييس الأداء وأدوات لقياس أداء تطبيقات Node.js.
---


# واجهات برمجة تطبيقات قياس الأداء {#performance-measurement-apis}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

توفر هذه الوحدة تنفيذًا لمجموعة فرعية من [واجهات برمجة تطبيقات أداء الويب](https://w3c.github.io/perf-timing-primer/) الخاصة بـ W3C بالإضافة إلى واجهات برمجة تطبيقات إضافية لقياسات الأداء الخاصة بـ Node.js.

يدعم Node.js [واجهات برمجة تطبيقات أداء الويب](https://w3c.github.io/perf-timing-primer/) التالية:

- [الوقت عالي الدقة](https://www.w3.org/TR/hr-time-2)
- [الجدول الزمني للأداء](https://w3c.github.io/performance-timeline/)
- [توقيت المستخدم](https://www.w3.org/TR/user-timing/)
- [توقيت الموارد](https://www.w3.org/TR/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**تمت إضافته في: v8.5.0**

كائن يمكن استخدامه لجمع مقاييس الأداء من مثيل Node.js الحالي. إنه مشابه لـ [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) في المتصفحات.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كمستقبل. |
| v8.5.0 | أضيف في: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا لم يتم توفير `name`، فإنه يزيل جميع كائنات `PerformanceMark` من خط زمني الأداء. إذا تم توفير `name`، فإنه يزيل العلامة المسماة فقط.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كمستقبل. |
| v16.7.0 | أضيف في: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا لم يتم توفير `name`، فإنه يزيل جميع كائنات `PerformanceMeasure` من خط زمني الأداء. إذا تم توفير `name`، فإنه يزيل القياس المسمى فقط.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كمستقبل. |
| v18.2.0, v16.17.0 | أضيف في: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا لم يتم توفير `name`، فإنه يزيل جميع كائنات `PerformanceResourceTiming` من خط زمني الموارد. إذا تم توفير `name`، فإنه يزيل المورد المسمى فقط.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**أضيف في: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) نتيجة لاستدعاء سابق لـ `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) نتيجة لاستدعاء سابق لـ `eventLoopUtilization()` قبل `utilization1`.
- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تُرجع الطريقة `eventLoopUtilization()` كائنًا يحتوي على المدة التراكمية للوقت الذي كان فيه حلقة الأحداث خاملاً ونشطًا كمؤقت بالمللي ثانية عالي الدقة. قيمة `utilization` هي حساب استغلال حلقة الأحداث (ELU).

إذا لم يتم الانتهاء من التهيئة بعد على الخيط الرئيسي، فإن للخصائص قيمة `0`. يتوفر ELU على الفور على [خيوط العامل](/ar/nodejs/api/worker_threads#worker-threads) نظرًا لأن التهيئة تحدث داخل حلقة الأحداث.

كل من `utilization1` و `utilization2` هما معلمات اختيارية.

إذا تم تمرير `utilization1`، فسيتم حساب الفرق بين أوقات `active` و `idle` للاستدعاء الحالي، بالإضافة إلى قيمة `utilization` المقابلة وإرجاعها (على غرار [`process.hrtime()`](/ar/nodejs/api/process#processhrtimetime)).

إذا تم تمرير كل من `utilization1` و `utilization2`، فسيتم حساب الفرق بين الوسيطتين. هذا خيار مناسب لأنه، على عكس [`process.hrtime()`](/ar/nodejs/api/process#processhrtimetime)، فإن حساب ELU أكثر تعقيدًا من طرح واحد.

يشبه ELU استخدام وحدة المعالجة المركزية (CPU)، إلا أنه يقيس فقط إحصائيات حلقة الأحداث وليس استخدام وحدة المعالجة المركزية. إنه يمثل النسبة المئوية للوقت الذي قضيته حلقة الأحداث خارج موفر أحداث حلقة الأحداث (على سبيل المثال `epoll_wait`). لا يتم أخذ أي وقت آخر لخمول وحدة المعالجة المركزية في الاعتبار. فيما يلي مثال على كيفية حصول عملية خاملة في الغالب على ELU عالية.

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

على الرغم من أن وحدة المعالجة المركزية خاملة في الغالب أثناء تشغيل هذا البرنامج النصي، إلا أن قيمة `utilization` هي `1`. هذا لأن الاستدعاء إلى [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options) يمنع حلقة الأحداث من المضي قدمًا.

سيؤدي تمرير كائن معرف من قبل المستخدم بدلاً من نتيجة استدعاء سابق لـ `eventLoopUtilization()` إلى سلوك غير محدد. لا يتم ضمان أن تعكس القيم المرجعة أي حالة صحيحة لحلقة الأحداث.


### `performance.getEntries()` {#performancegetentries}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة باستخدام كائن `performance` كمستقبل. |
| v16.7.0 | تمت إضافته في: v16.7.0 |
:::

- إرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

إرجاع قائمة بكائنات `PerformanceEntry` بترتيب زمني بالنسبة إلى `performanceEntry.startTime`. إذا كنت مهتمًا فقط بإدخالات الأداء لأنواع معينة أو بأسماء معينة، فراجع `performance.getEntriesByType()` و `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة باستخدام كائن `performance` كمستقبل. |
| v16.7.0 | تمت إضافته في: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- إرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

إرجاع قائمة بكائنات `PerformanceEntry` بترتيب زمني بالنسبة إلى `performanceEntry.startTime` حيث يكون `performanceEntry.name` مساويًا لـ `name`، واختياريًا، يكون `performanceEntry.entryType` مساويًا لـ `type`.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة باستخدام كائن `performance` كمستقبل. |
| v16.7.0 | تمت إضافته في: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- إرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

إرجاع قائمة بكائنات `PerformanceEntry` بترتيب زمني بالنسبة إلى `performanceEntry.startTime` حيث يكون `performanceEntry.entryType` مساويًا لـ `type`.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة باستخدام كائن `performance` كمستقبل. لم يعد وسيط الاسم اختياريًا. |
| v16.0.0 | تم تحديثه ليتوافق مع مواصفات User Timing Level 3. |
| v8.5.0 | تمت إضافته في: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) تفاصيل إضافية اختيارية لتضمينها مع العلامة.
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) طابع زمني اختياري لاستخدامه كوقت العلامة. **افتراضي**: `performance.now()`.

يقوم بإنشاء إدخال `PerformanceMark` جديد في مخطط الأداء الزمني. `PerformanceMark` هو فئة فرعية من `PerformanceEntry` حيث يكون `performanceEntry.entryType` دائمًا `'mark'`، ويكون `performanceEntry.duration` دائمًا `0`. تُستخدم علامات الأداء لتحديد اللحظات الهامة المحددة في مخطط الأداء الزمني.

يتم وضع إدخال `PerformanceMark` الذي تم إنشاؤه في مخطط الأداء الزمني العام ويمكن الاستعلام عنه باستخدام `performance.getEntries` و `performance.getEntriesByName` و `performance.getEntriesByType`. عند إجراء الملاحظة، يجب مسح الإدخالات من مخطط الأداء الزمني العام يدويًا باستخدام `performance.clearMarks`.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v22.2.0 | تمت إضافة وسيطات bodyInfo و responseStatus و deliveryType. |
| الإصداران v18.2.0 و v16.17.0 | تمت إضافته في: v18.2.0 و v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [معلومات توقيت الجلب](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL للمورد
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم البادئ، على سبيل المثال: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون وضع التخزين المؤقت سلسلة فارغة ('') أو 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [معلومات جسم استجابة الجلب](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز حالة الاستجابة
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع التسليم. **افتراضي:** `''`.

*هذه الخاصية هي امتداد بواسطة Node.js. وهي غير متوفرة في متصفحات الويب.*

ينشئ إدخال `PerformanceResourceTiming` جديدًا في الخط الزمني للمورد. `PerformanceResourceTiming` هي فئة فرعية من `PerformanceEntry` حيث يكون `performanceEntry.entryType` دائمًا `'resource'`. تُستخدم موارد الأداء لتمييز اللحظات في الخط الزمني للمورد.

يتم وضع إدخال `PerformanceMark` الذي تم إنشاؤه في الخط الزمني العام للمورد ويمكن الاستعلام عنه باستخدام `performance.getEntries` و `performance.getEntriesByName` و `performance.getEntriesByType`. عند إجراء الملاحظة، يجب مسح الإدخالات من الخط الزمني للأداء العام يدويًا باستخدام `performance.clearResourceTimings`.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كمستقبل. |
| v16.0.0 | تم تحديثه ليتوافق مع مواصفات توقيت المستخدم المستوى 3. |
| v13.13.0, v12.16.3 | جعل المعاملين `startMark` و `endMark` اختياريين. |
| v8.5.0 | تمت إضافته في: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) اختياري.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) تفاصيل إضافية اختيارية لتضمينها مع القياس.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المدة بين وقتي البدء والانتهاء.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الطابع الزمني الذي سيتم استخدامه كوقت انتهاء، أو سلسلة تحدد علامة مسجلة مسبقًا.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الطابع الزمني الذي سيتم استخدامه كوقت بدء، أو سلسلة تحدد علامة مسجلة مسبقًا.

- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اختياري. يجب حذفه إذا كان `startMarkOrOptions` هو [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

ينشئ إدخال `PerformanceMeasure` جديدًا في خط زمني الأداء (Performance Timeline). ‏`PerformanceMeasure` هو فئة فرعية من `PerformanceEntry` التي يكون فيها `performanceEntry.entryType` دائمًا `'measure'`، والتي تقيس `performanceEntry.duration` عدد المللي ثانية المنقضية منذ `startMark` و `endMark`.

قد تحدد وسيطة `startMark` أي `PerformanceMark` *موجودة* في خط زمني الأداء، أو *قد* تحدد أي من خصائص الطابع الزمني التي توفرها الفئة `PerformanceNodeTiming`. إذا كانت `startMark` المسماة غير موجودة، يتم طرح خطأ.

يجب أن تحدد وسيطة `endMark` الاختيارية أي `PerformanceMark` *موجودة* في خط زمني الأداء أو أي من خصائص الطابع الزمني التي توفرها الفئة `PerformanceNodeTiming`. سيكون `endMark` هو `performance.now()` إذا لم يتم تمرير أي معلمة، وإلا فسيتم طرح خطأ إذا كانت `endMark` المسماة غير موجودة.

يتم وضع إدخال `PerformanceMeasure` الذي تم إنشاؤه في خط زمني الأداء العام ويمكن الاستعلام عنه باستخدام `performance.getEntries` و `performance.getEntriesByName` و `performance.getEntriesByType`. عند إجراء الملاحظة، يجب مسح الإدخالات من خط زمني الأداء العام يدويًا باستخدام `performance.clearMeasures`.


### `performance.nodeTiming` {#performancenodetiming}

**تمت الإضافة في: v8.5.0**

- [\<PerformanceNodeTiming\>](/ar/nodejs/api/perf_hooks#class-performancenodetiming)

*هذه الخاصية هي امتداد بواسطة Node.js. وهي غير متاحة في متصفحات الويب.*

مثيل لفئة `PerformanceNodeTiming` التي توفر مقاييس أداء لمعالم تشغيل Node.js محددة.

### `performance.now()` {#performancenow}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كجهاز استقبال. |
| v8.5.0 | تمت الإضافة في: v8.5.0 |
:::

- إرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع الطابع الزمني الحالي بالمللي ثانية عالي الدقة، حيث يمثل 0 بداية عملية `node` الحالية.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كجهاز استقبال. |
| v18.8.0 | تمت الإضافة في: v18.8.0 |
:::

يضبط حجم المخزن المؤقت لتوقيت موارد الأداء العام على العدد المحدد من كائنات إدخال أداء من نوع "resource".

افتراضيًا، يتم تعيين الحد الأقصى لحجم المخزن المؤقت على 250.

### `performance.timeOrigin` {#performancetimeorigin}

**تمت الإضافة في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يحدد [`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) الطابع الزمني بالمللي ثانية عالي الدقة الذي بدأت عنده عملية `node` الحالية، ويقاس بالوقت Unix.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | تمت إضافة خيار المدرج التكراري. |
| v16.0.0 | إعادة التنفيذ لاستخدام JavaScript النقي والقدرة على تحديد وقت الوظائف غير المتزامنة. |
| v8.5.0 | تمت الإضافة في: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `histogram` [\<RecordableHistogram\>](/ar/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) كائن مدرج تكراري تم إنشاؤه باستخدام `perf_hooks.createHistogram()` سيسجل مدد وقت التشغيل بالنانو ثانية.
  
 

*هذه الخاصية هي امتداد بواسطة Node.js. وهي غير متاحة في متصفحات الويب.*

يلف دالة داخل دالة جديدة تقيس وقت تشغيل الدالة الملتفة. يجب الاشتراك في `PerformanceObserver` في نوع حدث `'function'` حتى يمكن الوصول إلى تفاصيل التوقيت.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// سيتم إنشاء إدخال خط زمني للأداء
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// سيتم إنشاء إدخال خط زمني للأداء
wrapped();
```
:::

إذا كانت الدالة الملتفة ترجع وعدًا، فسيتم إرفاق معالج نهائي بالوعد وسيتم الإبلاغ عن المدة بمجرد استدعاء المعالج النهائي.


### `performance.toJSON()` {#performancetojson}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء هذه الطريقة مع كائن `performance` كمستقبل. |
| الإصدار v16.1.0 | تمت الإضافة في: v16.1.0 |
:::

كائن يمثل تمثيل JSON لكائن `performance`. وهو مشابه لـ [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) في المتصفحات.

#### الحدث: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**تمت الإضافة في: v18.8.0**

يتم إطلاق الحدث `'resourcetimingbufferfull'` عندما يكون مخزن مؤقت لتوقيت موارد الأداء العام ممتلئًا. اضبط حجم مخزن مؤقت لتوقيت الموارد باستخدام `performance.setResourceTimingBufferSize()` أو امسح المخزن المؤقت باستخدام `performance.clearResourceTimings()` في مستمع الأحداث للسماح بإضافة المزيد من الإدخالات إلى مخزن مؤقت لخط زمني للأداء.

## الفئة: `PerformanceEntry` {#class-performanceentry}

**تمت الإضافة في: v8.5.0**

لا يتم عرض مُنشئ هذه الفئة للمستخدمين مباشرة.

### `performanceEntry.duration` {#performanceentryduration}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء هذا الخاصية getter مع كائن `PerformanceEntry` كمستقبل. |
| الإصدار v8.5.0 | تمت الإضافة في: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إجمالي عدد المللي ثانية التي انقضت لهذا الإدخال. لن تكون هذه القيمة ذات معنى لجميع أنواع إدخالات الأداء.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء هذا الخاصية getter مع كائن `PerformanceEntry` كمستقبل. |
| الإصدار v8.5.0 | تمت الإضافة في: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

نوع إدخال الأداء. قد يكون واحدًا مما يلي:

- `'dns'` (Node.js فقط)
- `'function'` (Node.js فقط)
- `'gc'` (Node.js فقط)
- `'http2'` (Node.js فقط)
- `'http'` (Node.js فقط)
- `'mark'` (متاح على الويب)
- `'measure'` (متاح على الويب)
- `'net'` (Node.js فقط)
- `'node'` (Node.js فقط)
- `'resource'` (متاح على الويب)


### `performanceEntry.name` {#performanceentryname}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceEntry` كمستقبِل. |
| v8.5.0 | تمت إضافته في: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم إدخال الأداء.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceEntry` كمستقبِل. |
| v8.5.0 | تمت إضافته في: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالمللي ثانية عالي الدقة الذي يحدد وقت البدء لإدخال الأداء.

## الفئة: `PerformanceMark` {#class-performancemark}

**تمت إضافته في: v18.2.0, v16.17.0**

- يمتد من: [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

يعرض العلامات التي تم إنشاؤها عبر الطريقة `Performance.mark()`.

### `performanceMark.detail` {#performancemarkdetail}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceMark` كمستقبِل. |
| v16.0.0 | تمت إضافته في: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

تفاصيل إضافية محددة عند الإنشاء باستخدام الطريقة `Performance.mark()`.

## الفئة: `PerformanceMeasure` {#class-performancemeasure}

**تمت إضافته في: v18.2.0, v16.17.0**

- يمتد من: [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

يعرض المقاييس التي تم إنشاؤها عبر الطريقة `Performance.measure()`.

لا يتم عرض مُنشئ هذه الفئة للمستخدمين مباشرةً.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceMeasure` كمستقبِل. |
| v16.0.0 | تمت إضافته في: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

تفاصيل إضافية محددة عند الإنشاء باستخدام الطريقة `Performance.measure()`.


## الصنف: `PerformanceNodeEntry` {#class-performancenodeentry}

**أُضيف في: الإصدار v19.0.0**

- يمتد من: [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

*هذا الصنف هو امتداد بواسطة Node.js. وهو غير متوفر في متصفحات الويب.*

يوفر بيانات توقيت مفصلة لـ Node.js.

لا يتم عرض مُنشئ هذا الصنف للمستخدمين مباشرةً.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء دالة الحصول على هذه الخاصية باستخدام كائن `PerformanceNodeEntry` كمُستقبِل. |
| الإصدار v16.0.0 | أُضيف في: الإصدار v16.0.0 |
:::

- [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

تفاصيل إضافية خاصة بـ `entryType`.

### `performanceNodeEntry.flags` {#performancenodeentryflags}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v16.0.0 | مُهملة في وقت التشغيل. تم نقلها الآن إلى خاصية التفاصيل عندما يكون `entryType` هو 'gc'. |
| الإصدار v13.9.0, v12.17.0 | أُضيف في: الإصدار v13.9.0, v12.17.0 |
:::

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم `performanceNodeEntry.detail` بدلاً من ذلك.
:::

- [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عندما تكون `performanceEntry.entryType` مساوية لـ `'gc'`، تحتوي خاصية `performance.flags` على معلومات إضافية حول عملية تجميع البيانات المهملة. قد تكون القيمة واحدة مما يلي:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v16.0.0 | مُهملة في وقت التشغيل. تم نقلها الآن إلى خاصية التفاصيل عندما يكون `entryType` هو 'gc'. |
| الإصدار v8.5.0 | أُضيف في: الإصدار v8.5.0 |
:::

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم `performanceNodeEntry.detail` بدلاً من ذلك.
:::

- [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عندما تكون `performanceEntry.entryType` مساوية لـ `'gc'`، تحدد خاصية `performance.kind` نوع عملية تجميع البيانات المهملة التي حدثت. قد تكون القيمة واحدة مما يلي:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### تفاصيل تجميع البيانات المهملة ('gc') {#garbage-collection-gc-details}

عندما يكون `performanceEntry.type` مساويًا لـ `'gc'`، فإن الخاصية `performanceNodeEntry.detail` ستكون [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مع خاصيتين:

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واحد مما يلي:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واحد مما يلي:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`


### تفاصيل HTTP ('http') {#http-http-details}

عندما يكون `performanceEntry.type` مساويًا لـ `'http'`، فإن الخاصية `performanceNodeEntry.detail` ستكون [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على معلومات إضافية.

إذا كان `performanceEntry.name` مساويًا لـ `HttpClient`، فسيحتوي `detail` على الخصائص التالية: `req`، و `res`. وستكون الخاصية `req` عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على `method` و `url` و `headers`، وستكون الخاصية `res` عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على `statusCode` و `statusMessage` و `headers`.

إذا كان `performanceEntry.name` مساويًا لـ `HttpRequest`، فسيحتوي `detail` على الخصائص التالية: `req`، و `res`. وستكون الخاصية `req` عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على `method` و `url` و `headers`، وستكون الخاصية `res` عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على `statusCode` و `statusMessage` و `headers`.

قد يؤدي هذا إلى إضافة حمل ذاكرة إضافي ويجب استخدامه فقط لأغراض التشخيص، ولا ينبغي تركه قيد التشغيل في الإنتاج افتراضيًا.


### تفاصيل HTTP/2 ('http2') {#http/2-http2-details}

عندما تكون `performanceEntry.type` مساوية لـ `'http2'`، ستكون خاصية `performanceNodeEntry.detail` عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على معلومات أداء إضافية.

إذا كانت `performanceEntry.name` مساوية لـ `Http2Stream`، فسيحتوي `detail` على الخصائص التالية:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بايتات إطار `DATA` المستلمة لـ `Http2Stream` هذا.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بايتات إطار `DATA` المرسلة لـ `Http2Stream` هذا.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف `Http2Stream` المرتبط.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية بين `startTime` الخاص بـ `PerformanceEntry` واستقبال أول إطار `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية بين `startTime` الخاص بـ `PerformanceEntry` وإرسال أول إطار `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية بين `startTime` الخاص بـ `PerformanceEntry` واستقبال أول رأس.

إذا كانت `performanceEntry.name` مساوية لـ `Http2Session`، فسيحتوي `detail` على الخصائص التالية:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المستلمة لـ `Http2Session` هذا.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المرسلة لـ `Http2Session` هذا.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إطارات HTTP/2 التي استلمتها `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إطارات HTTP/2 التي أرسلتها `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد التدفقات المفتوحة بالتزامن خلال عمر `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية منذ إرسال إطار `PING` واستقبال إقراره. موجود فقط إذا تم إرسال إطار `PING` على `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) متوسط المدة (بالمللي ثانية) لجميع مثيلات `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد مثيلات `Http2Stream` التي تمت معالجتها بواسطة `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'server'` أو `'client'` لتحديد نوع `Http2Session`.


### تفاصيل Timerify ('function') {#timerify-function-details}

عندما تكون قيمة `performanceEntry.type` مساوية لـ `'function'`، فإن الخاصية `performanceNodeEntry.detail` ستكون عبارة عن [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تسرد وسائط الإدخال إلى الدالة الموقوتة.

### تفاصيل Net ('net') {#net-net-details}

عندما تكون قيمة `performanceEntry.type` مساوية لـ `'net'`، فإن الخاصية `performanceNodeEntry.detail` ستكون عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على معلومات إضافية.

إذا كانت قيمة `performanceEntry.name` مساوية لـ `connect`، فستحتوي `detail` على الخصائص التالية: `host`، `port`.

### تفاصيل DNS ('dns') {#dns-dns-details}

عندما تكون قيمة `performanceEntry.type` مساوية لـ `'dns'`، فإن الخاصية `performanceNodeEntry.detail` ستكون عبارة عن [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تحتوي على معلومات إضافية.

إذا كانت قيمة `performanceEntry.name` مساوية لـ `lookup`، فستحتوي `detail` على الخصائص التالية: `hostname`، `family`، `hints`، `verbatim`، `addresses`.

إذا كانت قيمة `performanceEntry.name` مساوية لـ `lookupService`، فستحتوي `detail` على الخصائص التالية: `host`، `port`، `hostname`، `service`.

إذا كانت قيمة `performanceEntry.name` مساوية لـ `queryxxx` أو `getHostByAddr`، فستحتوي `detail` على الخصائص التالية: `host`، `ttl`، `result`. قيمة `result` هي نفسها نتيجة `queryxxx` أو `getHostByAddr`.

## الفئة: `PerformanceNodeTiming` {#class-performancenodetiming}

**تمت إضافتها في: v8.5.0**

- يمتد: [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

*هذه الخاصية هي امتداد بواسطة Node.js. وهي غير متوفرة في متصفحات الويب.*

يوفر تفاصيل التوقيت لـ Node.js نفسه. مُنشئ هذه الفئة غير مكشوف للمستخدمين.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**تمت إضافتها في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالمللي ثانية عالي الدقة الذي أكمل فيه عملية Node.js عملية التهيئة. إذا لم تنتهِ عملية التهيئة بعد، فإن الخاصية لها قيمة -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**أُضيف في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني عالي الدقة بالملي ثانية الذي تمت فيه تهيئة بيئة Node.js.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**أُضيف في: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني عالي الدقة بالملي ثانية لمقدار الوقت الذي كانت فيه حلقة الأحداث في وضع الخمول داخل مزود الأحداث لحلقة الأحداث (مثل `epoll_wait`). لا يأخذ هذا في الاعتبار استخدام وحدة المعالجة المركزية. إذا لم تبدأ حلقة الأحداث بعد (على سبيل المثال، في أول علامة من البرنامج النصي الرئيسي)، فإن الخاصية لها القيمة 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**أُضيف في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني عالي الدقة بالملي ثانية الذي خرجت فيه حلقة أحداث Node.js. إذا لم تخرج حلقة الأحداث بعد، فإن الخاصية لها القيمة -1. يمكن أن يكون لها قيمة غير -1 فقط في معالج حدث [`'exit'`](/ar/nodejs/api/process#event-exit).

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**أُضيف في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني عالي الدقة بالملي ثانية الذي بدأت فيه حلقة أحداث Node.js. إذا لم تبدأ حلقة الأحداث بعد (على سبيل المثال، في أول علامة من البرنامج النصي الرئيسي)، فإن الخاصية لها القيمة -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**أُضيف في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني عالي الدقة بالملي ثانية الذي تمت فيه تهيئة عملية Node.js.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**أُضيف في: v22.8.0, v20.18.0**

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد تكرارات حلقة الأحداث.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الأحداث التي تمت معالجتها بواسطة معالج الأحداث.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الأحداث التي كانت تنتظر المعالجة عند استدعاء موفر الأحداث.
  
 

هذا عبارة عن غلاف لدالة `uv_metrics_info`. تُرجع المجموعة الحالية من مقاييس حلقة الأحداث.

يوصى باستخدام هذه الخاصية داخل دالة تم جدولة تنفيذها باستخدام `setImmediate` لتجنب جمع المقاييس قبل الانتهاء من جميع العمليات المجدولة خلال التكرار الحالي للحلقة.



::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**أضيف في: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي تم فيه تهيئة منصة V8.

## الصنف: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**أضيف في: v18.2.0, v16.17.0**

- يمتد من: [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

يوفر بيانات توقيت الشبكة التفصيلية المتعلقة بتحميل موارد التطبيق.

لا يتم عرض مُنشئ هذا الصنف للمستخدمين مباشرةً.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء جالب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | أضيف في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة مباشرة قبل إرسال طلب `fetch`. إذا لم يتم اعتراض المورد بواسطة عامل، فستعيد الخاصية دائمًا 0.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء جالب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | أضيف في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي يمثل وقت البدء لجلب يبدأ عملية إعادة التوجيه.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء جالب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | أضيف في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي سيتم إنشاؤه مباشرة بعد استلام البايت الأخير من استجابة آخر عملية إعادة توجيه.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت إضافتها في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالميلي ثانية عالي الدقة مباشرة قبل أن يبدأ Node.js في جلب المورد.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت إضافتها في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالميلي ثانية عالي الدقة مباشرة قبل أن يبدأ Node.js في البحث عن اسم المجال للمورد.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت إضافتها في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالميلي ثانية عالي الدقة الذي يمثل الوقت مباشرة بعد أن أنهى Node.js البحث عن اسم المجال للمورد.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء أداة جلب هذه الخاصية باستخدام كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت إضافتها في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالميلي ثانية عالي الدقة الذي يمثل الوقت مباشرة قبل أن يبدأ Node.js في إنشاء الاتصال بالخادم لاسترداد المورد.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء دالة جلب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت الإضافة في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي يمثل الوقت مباشرة بعد انتهاء Node.js من إنشاء الاتصال بالخادم لاسترداد المورد.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء دالة جلب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت الإضافة في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي يمثل الوقت مباشرة قبل أن تبدأ Node.js عملية المصافحة لتأمين الاتصال الحالي.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء دالة جلب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت الإضافة في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي يمثل الوقت مباشرة قبل أن تتلقى Node.js البايت الأول من الاستجابة من الخادم.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يجب استدعاء دالة جلب هذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| v18.2.0, v16.17.0 | تمت الإضافة في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالملي ثانية عالي الدقة الذي يمثل الوقت مباشرة بعد أن تتلقى Node.js البايت الأخير من المورد أو مباشرة قبل إغلاق اتصال النقل، أيهما يأتي أولاً.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء دالة الوصول لهذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| الإصدار v18.2.0, v16.17.0 | أُضيف في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

رقم يمثل حجم (بالأوكتات) المورد الذي تم جلبه. يشمل الحجم حقول رأس الاستجابة بالإضافة إلى نص حمولة الاستجابة.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء دالة الوصول لهذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| الإصدار v18.2.0, v16.17.0 | أُضيف في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

رقم يمثل الحجم (بالأوكتات) المستلم من الجلب (HTTP أو ذاكرة التخزين المؤقت) لنص الحمولة، قبل إزالة أي ترميزات محتوى مطبقة.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء دالة الوصول لهذه الخاصية مع كائن `PerformanceResourceTiming` كمستقبل. |
| الإصدار v18.2.0, v16.17.0 | أُضيف في: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

رقم يمثل الحجم (بالأوكتات) المستلم من الجلب (HTTP أو ذاكرة التخزين المؤقت) لنص الرسالة، بعد إزالة أي ترميزات محتوى مطبقة.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يجب استدعاء هذا الأسلوب مع كائن `PerformanceResourceTiming` كمستقبل. |
| الإصدار v18.2.0, v16.17.0 | أُضيف في: v18.2.0, v16.17.0 |
:::

إرجاع `object` وهو تمثيل JSON لكائن `PerformanceResourceTiming`

## صنف: `PerformanceObserver` {#class-performanceobserver}

**أُضيف في: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**أُضيف في: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الحصول على الأنواع المدعومة.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد اتصال غير صالح إلى الوسيطة `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.5.0 | أضيف في: v8.5.0 |
:::

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `list` [\<PerformanceObserverEntryList\>](/ar/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/ar/nodejs/api/perf_hooks#class-performanceobserver)
  
 

توفر كائنات `PerformanceObserver` إشعارات عند إضافة مثيلات `PerformanceEntry` جديدة إلى مخطط الأداء الزمني.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

نظرًا لأن مثيلات `PerformanceObserver` تقدم نفقات أداء إضافية خاصة بها، يجب عدم ترك المثيلات مشتركة في الإشعارات إلى أجل غير مسمى. يجب على المستخدمين فصل المراقبين بمجرد أنهم لم يعودوا بحاجة إليهم.

يتم استدعاء `callback` عند إخطار `PerformanceObserver` بشأن مثيلات `PerformanceEntry` جديدة. يتلقى رد الاتصال مثيل `PerformanceObserverEntryList` ومرجعًا إلى `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**أضيف في: v8.5.0**

يفصل مثيل `PerformanceObserver` عن جميع الإشعارات.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.7.0 | Updated to conform to Performance Timeline Level 2. The buffered option has been added back. |
| v16.0.0 | Updated to conform to User Timing Level 3. The buffered option has been removed. |
| v8.5.0 | Added in: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry) واحد. يجب عدم تحديده إذا تم تحديد `entryTypes` بالفعل.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من السلاسل تحدد أنواع مثيلات [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry) التي يهتم بها المراقب. إذا لم يتم توفيرها، سيتم طرح خطأ.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة true، فسيتم استدعاء رد اتصال المراقب مع قائمة إدخالات `PerformanceEntry` المخزنة مؤقتًا عالميًا. إذا كانت القيمة false، فسيتم إرسال `PerformanceEntry`s التي تم إنشاؤها بعد نقطة زمنية معينة فقط إلى رد اتصال المراقب. **الافتراضي:** `false`.

يقوم بتسجيل مثيل [\<PerformanceObserver\>](/ar/nodejs/api/perf_hooks#class-performanceobserver) للإشعارات الخاصة بمثيلات [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry) الجديدة التي يتم تحديدها إما بواسطة `options.entryTypes` أو `options.type`:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Called once asynchronously. `list` contains three items.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Called once asynchronously. `list` contains three items.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**أُضيف في: v16.0.0**

- الإرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry) القائمة الحالية للإدخالات المخزنة في مراقب الأداء، مع تفريغها.

## صنف: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**أُضيف في: v8.5.0**

يُستخدم صنف `PerformanceObserverEntryList` لتوفير الوصول إلى مثيلات `PerformanceEntry` التي تم تمريرها إلى `PerformanceObserver`. مُنشئ هذا الصنف غير مُتاح للمستخدمين.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**أُضيف في: v8.5.0**

- الإرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

يُرجع قائمة بكائنات `PerformanceEntry` بترتيب زمني فيما يتعلق بـ `performanceEntry.startTime`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**تمت الإضافة في: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

تقوم بإرجاع قائمة من كائنات `PerformanceEntry` بالترتيب الزمني بالنسبة إلى `performanceEntry.startTime` حيث يكون `performanceEntry.name` مساويًا لـ `name`، واختياريًا، يكون `performanceEntry.entryType` مساويًا لـ `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**تمت الإضافة في: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<PerformanceEntry[]\>](/ar/nodejs/api/perf_hooks#class-performanceentry)

إرجاع قائمة بكائنات `PerformanceEntry` بترتيب زمني فيما يتعلق بـ `performanceEntry.startTime` حيث `performanceEntry.entryType` تساوي `type`.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**تمت الإضافة في: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) أقل قيمة قابلة للتمييز. يجب أن تكون قيمة عدد صحيح أكبر من 0. **الافتراضي:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) أعلى قيمة قابلة للتسجيل. يجب أن تكون قيمة عدد صحيح تساوي أو أكبر من ضعف قيمة `lowest`. **الافتراضي:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد أرقام الدقة. يجب أن يكون رقمًا بين `1` و `5`. **الافتراضي:** `3`.
  
 
- الإرجاع: [\<RecordableHistogram\>](/ar/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

إرجاع [\<RecordableHistogram\>](/ar/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram).


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**تمت إضافته في: الإصدار 11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معدل أخذ العينات بالمللي ثانية. يجب أن يكون أكبر من الصفر. **افتراضي:** `10`.
  
 
- الإرجاع: [\<IntervalHistogram\>](/ar/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*هذه الخاصية هي امتداد من Node.js. وهي غير متاحة في متصفحات الويب.*

يقوم بإنشاء كائن `IntervalHistogram` يقوم بأخذ عينات وتدوين تأخير حلقة الأحداث بمرور الوقت. سيتم تدوين التأخيرات بالنانو ثانية.

يعمل استخدام مؤقت لاكتشاف التأخير التقريبي لحلقة الأحداث لأن تنفيذ المؤقتات مرتبط تحديدًا بدورة حياة حلقة أحداث libuv. بمعنى أن التأخير في الحلقة سيؤدي إلى تأخير في تنفيذ المؤقت، وهذه التأخيرات تحديدًا هي ما يهدف هذا الـ API إلى اكتشافه.



::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## الصنف: `Histogram` {#class-histogram}

**تمت إضافته في: الإصدار 11.10.0**

### `histogram.count` {#histogramcount}

**تمت إضافته في: الإصدار 17.4.0، الإصدار 16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد العينات المسجلة بواسطة المدرج التكراري.

### `histogram.countBigInt` {#histogramcountbigint}

**تمت إضافته في: الإصدار 17.4.0، الإصدار 16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

عدد العينات المسجلة بواسطة المدرج التكراري.


### `histogram.exceeds` {#histogramexceeds}

**أُضيف في: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد المرات التي تجاوز فيها تأخير حلقة الأحداث الحد الأقصى لتأخير حلقة الأحداث وهو ساعة واحدة.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**أُضيف في: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

عدد المرات التي تجاوز فيها تأخير حلقة الأحداث الحد الأقصى لتأخير حلقة الأحداث وهو ساعة واحدة.

### `histogram.max` {#histogrammax}

**أُضيف في: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الحد الأقصى لتأخير حلقة الأحداث المسجل.

### `histogram.maxBigInt` {#histogrammaxbigint}

**أُضيف في: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

الحد الأقصى لتأخير حلقة الأحداث المسجل.

### `histogram.mean` {#histogrammean}

**أُضيف في: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

متوسط تأخيرات حلقة الأحداث المسجلة.

### `histogram.min` {#histogrammin}

**أُضيف في: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الحد الأدنى لتأخير حلقة الأحداث المسجل.

### `histogram.minBigInt` {#histogramminbigint}

**أُضيف في: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

الحد الأدنى لتأخير حلقة الأحداث المسجل.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**أُضيف في: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة مئوية في النطاق (0، 100].
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع القيمة عند النسبة المئوية المحددة.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**أُضيف في: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة مئوية في النطاق (0، 100].
- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

إرجاع القيمة عند النسبة المئوية المحددة.


### `histogram.percentiles` {#histogrampercentiles}

**أُضيف في:** الإصدار 11.10.0

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

يُرجع كائن `Map` يحتوي على تفاصيل التوزيع المئوي المتراكم.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**أُضيف في:** الإصدار 17.4.0، 16.14.0

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

يُرجع كائن `Map` يحتوي على تفاصيل التوزيع المئوي المتراكم.

### `histogram.reset()` {#histogramreset}

**أُضيف في:** الإصدار 11.10.0

يعيد تعيين بيانات الرسم البياني المُجمّعة.

### `histogram.stddev` {#histogramstddev}

**أُضيف في:** الإصدار 11.10.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الانحراف المعياري لتأخيرات حلقة الأحداث المسجلة.

## الصنف: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

عبارة عن `Histogram` يتم تحديثها دوريًا على فترات زمنية محددة.

### `histogram.disable()` {#histogramdisable}

**أُضيف في:** الإصدار 11.10.0

- يُرجع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُعطّل مؤقت فاصل التحديث. يُرجع `true` إذا تم إيقاف المؤقت، و `false` إذا كان متوقفًا بالفعل.

### `histogram.enable()` {#histogramenable}

**أُضيف في:** الإصدار 11.10.0

- يُرجع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُفعّل مؤقت فاصل التحديث. يُرجع `true` إذا تم بدء المؤقت، و `false` إذا كان قيد التشغيل بالفعل.

### استنساخ `IntervalHistogram` {#cloning-an-intervalhistogram}

يمكن استنساخ نُسخ [\<IntervalHistogram\>](/ar/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) عبر [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport). في الطرف المستقبل، يتم استنساخ الرسم البياني ككائن [\<Histogram\>](/ar/nodejs/api/perf_hooks#class-histogram) عادي لا يُنفّذ طرق `enable()` و `disable()`.

## الصنف: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**أُضيف في:** الإصدار 15.9.0، 14.18.0

### `histogram.add(other)` {#histogramaddother}

**أُضيف في:** الإصدار 17.4.0، 16.14.0

- `other` [\<RecordableHistogram\>](/ar/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

يُضيف القيم من `other` إلى هذا الرسم البياني.


### `histogram.record(val)` {#histogramrecordval}

**تمت الإضافة في: v15.9.0، v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) المقدار المراد تسجيله في المدرج التكراري.

### `histogram.recordDelta()` {#histogramrecorddelta}

**تمت الإضافة في: v15.9.0، v14.18.0**

يحسب مقدار الوقت (بالنانو ثانية) الذي انقضى منذ الاستدعاء السابق لـ `recordDelta()` ويسجل هذا المقدار في المدرج التكراري.

## أمثلة {#examples}

### قياس مدة العمليات غير المتزامنة {#measuring-the-duration-of-async-operations}

يستخدم المثال التالي [Async Hooks](/ar/nodejs/api/async_hooks) و Performance APIs لقياس المدة الفعلية لعملية المهلة (بما في ذلك مقدار الوقت الذي استغرقه تنفيذ الاستدعاء).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### قياس المدة التي يستغرقها تحميل التبعيات {#measuring-how-long-it-takes-to-load-dependencies}

يوضح المثال التالي قياس مدة عمليات `require()` لتحميل التبعيات:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Activate the observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch the require function
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Activate the observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### قياس المدة التي تستغرقها رحلة HTTP ذهابًا وإيابًا {#measuring-how-long-one-http-round-trip-takes}

يستخدم المثال التالي لتتبع الوقت الذي يقضيه عميل HTTP (`OutgoingMessage`) وطلب HTTP (`IncomingMessage`). بالنسبة لعميل HTTP، يعني ذلك الفترة الزمنية بين بدء الطلب وتلقي الاستجابة، وبالنسبة لطلب HTTP، يعني ذلك الفترة الزمنية بين تلقي الطلب وإرسال الاستجابة:

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::

### قياس المدة التي تستغرقها `net.connect` (لـ TCP فقط) عند نجاح الاتصال {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### قياس المدة التي تستغرقها DNS عند نجاح الطلب {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

