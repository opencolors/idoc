---
title: توثيق Node.js - Trace Events
description: توثيق حول كيفية استخدام واجهة برمجة تطبيقات Trace Events في Node.js للتصنيف الأداء وتصحيح الأخطاء.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Trace Events | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق حول كيفية استخدام واجهة برمجة تطبيقات Trace Events في Node.js للتصنيف الأداء وتصحيح الأخطاء.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Trace Events | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق حول كيفية استخدام واجهة برمجة تطبيقات Trace Events في Node.js للتصنيف الأداء وتصحيح الأخطاء.
---


# أحداث التتبع {#trace-events}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

**شفرة المصدر:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

يوفر وحدة `node:trace_events` آلية لمركزة معلومات التتبع التي تم إنشاؤها بواسطة V8 و Node.js الأساسية وشفرة مساحة المستخدم.

يمكن تفعيل التتبع باستخدام علامة سطر الأوامر `--trace-event-categories` أو باستخدام وحدة `node:trace_events`. تقبل علامة `--trace-event-categories` قائمة بأسماء الفئات مفصولة بفواصل.

الفئات المتاحة هي:

- `node`: عنصر نائب فارغ.
- `node.async_hooks`: تمكن التقاط بيانات تتبع [`async_hooks`](/ar/nodejs/api/async_hooks) التفصيلية. تحتوي أحداث [`async_hooks`](/ar/nodejs/api/async_hooks) على `asyncId` فريد وخاصية `triggerId` `triggerAsyncId` خاصة.
- `node.bootstrap`: تمكن التقاط مراحل بدء تشغيل Node.js.
- `node.console`: تمكن التقاط إخراج `console.time()` و `console.count()`.
- `node.threadpoolwork.sync`: تمكن التقاط بيانات التتبع للعمليات المتزامنة لمجموعة سلاسل العمليات، مثل `blob` و `zlib` و `crypto` و `node_api`.
- `node.threadpoolwork.async`: تمكن التقاط بيانات التتبع للعمليات غير المتزامنة لمجموعة سلاسل العمليات، مثل `blob` و `zlib` و `crypto` و `node_api`.
- `node.dns.native`: تمكن التقاط بيانات التتبع لاستعلامات DNS.
- `node.net.native`: تمكن التقاط بيانات التتبع للشبكة.
- `node.environment`: تمكن التقاط مراحل بيئة Node.js.
- `node.fs.sync`: تمكن التقاط بيانات التتبع لطرق نظام الملفات المتزامنة.
- `node.fs_dir.sync`: تمكن التقاط بيانات التتبع لطرق دليل نظام الملفات المتزامنة.
- `node.fs.async`: تمكن التقاط بيانات التتبع لطرق نظام الملفات غير المتزامنة.
- `node.fs_dir.async`: تمكن التقاط بيانات التتبع لطرق دليل نظام الملفات غير المتزامنة.
- `node.perf`: تمكن التقاط قياسات [واجهة برمجة تطبيقات الأداء](/ar/nodejs/api/perf_hooks).
    - `node.perf.usertiming`: تمكن التقاط قياسات وعلامات توقيت المستخدم لواجهة برمجة تطبيقات الأداء فقط.
    - `node.perf.timerify`: تمكن التقاط قياسات timerify لواجهة برمجة تطبيقات الأداء فقط.


- `node.promises.rejections`: تمكن التقاط بيانات التتبع التي تتبع عدد عمليات رفض Promise غير المعالجة والمعالجة بعد الرفض.
- `node.vm.script`: تمكن التقاط بيانات التتبع لطرق `runInNewContext()` و `runInContext()` و `runInThisContext()` الخاصة بوحدة `node:vm`.
- `v8`: أحداث [V8](/ar/nodejs/api/v8) متعلقة بـ GC والتحويل البرمجي والتنفيذ.
- `node.http`: تمكن التقاط بيانات التتبع لطلب / استجابة http.
- `node.module_timer`: تمكن التقاط بيانات التتبع لتحميل وحدة CJS.

بشكل افتراضي، يتم تمكين الفئات `node` و `node.async_hooks` و `v8`.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
تطلبت الإصدارات السابقة من Node.js استخدام علامة `--trace-events-enabled` لتمكين أحداث التتبع. تمت إزالة هذا الشرط. ومع ذلك، *يمكن* استخدام علامة `--trace-events-enabled` وستقوم بتمكين فئات أحداث التتبع `node` و `node.async_hooks` و `v8` افتراضيًا.

```bash [BASH]
node --trace-events-enabled

# يعادل {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
بدلاً من ذلك، يمكن تمكين أحداث التتبع باستخدام وحدة `node:trace_events`:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // تمكين التقاط أحداث التتبع لفئة 'node.perf'

// قم بالعمل

tracing.disable();  // تعطيل التقاط أحداث التتبع لفئة 'node.perf'
```
سيؤدي تشغيل Node.js مع تمكين التتبع إلى إنتاج ملفات سجل يمكن فتحها في علامة التبويب [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) في Chrome.

يُطلق على ملف التسجيل افتراضيًا اسم `node_trace.${rotation}.log`، حيث `${rotation}` هو معرف تدوير السجل المتزايد. يمكن تحديد نمط مسار الملف باستخدام `--trace-event-file-pattern` الذي يقبل سلسلة قالب تدعم `${rotation}` و`${pid}`:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
لضمان إنشاء ملف السجل بشكل صحيح بعد أحداث الإشارة مثل `SIGINT` أو `SIGTERM` أو `SIGBREAK`، تأكد من وجود معالجات مناسبة في التعليمات البرمجية الخاصة بك، مثل:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('تم استلام SIGINT.');
  process.exit(130);  // أو رمز خروج قابل للتطبيق اعتمادًا على نظام التشغيل والإشارة
});
```
يستخدم نظام التتبع نفس مصدر الوقت الذي يستخدمه `process.hrtime()`. ومع ذلك، يتم التعبير عن الطوابع الزمنية لأحداث التتبع بالميكروثانية، على عكس `process.hrtime()` الذي يُرجع نانوثانية.

الميزات من هذه الوحدة غير متوفرة في سلاسل عمليات [`Worker`](/ar/nodejs/api/worker_threads#class-worker).


## وحدة `node:trace_events` {#the-nodetrace_events-module}

**أُضيفت في: الإصدار 10.0.0**

### الكائن `Tracing` {#tracing-object}

**أُضيفت في: الإصدار 10.0.0**

يستخدم الكائن `Tracing` لتمكين أو تعطيل تتبع مجموعات الفئات. يتم إنشاء النسخ باستخدام الطريقة `trace_events.createTracing()`.

عند الإنشاء، يكون الكائن `Tracing` معطلاً. استدعاء الطريقة `tracing.enable()` يضيف الفئات إلى مجموعة فئات أحداث التتبع الممكنة. استدعاء `tracing.disable()` سيزيل الفئات من مجموعة فئات أحداث التتبع الممكنة.

#### `tracing.categories` {#tracingcategories}

**أُضيفت في: الإصدار 10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة مفصولة بفواصل لفئات أحداث التتبع التي يغطيها هذا الكائن `Tracing`.

#### `tracing.disable()` {#tracingdisable}

**أُضيفت في: الإصدار 10.0.0**

تعطيل هذا الكائن `Tracing`.

سيتم تعطيل فئات أحداث التتبع *غير* المغطاة بواسطة كائنات `Tracing` ممكنة أخرى و *غير* المحددة بواسطة العلامة `--trace-event-categories` فقط.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// يطبع 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // سيؤدي فقط إلى تعطيل انبعاث فئة 'node.perf'

// يطبع 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**أُضيفت في: الإصدار 10.0.0**

تمكين هذا الكائن `Tracing` لمجموعة الفئات التي يغطيها الكائن `Tracing`.

#### `tracing.enabled` {#tracingenabled}

**أُضيفت في: الإصدار 10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` فقط إذا تم تمكين الكائن `Tracing`.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**أُضيفت في: الإصدار 10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من أسماء فئات التتبع. يتم تحويل القيم المضمنة في المصفوفة إلى سلسلة نصية قدر الإمكان. سيتم طرح خطأ إذا تعذر تحويل القيمة.


- الإرجاع: [\<Tracing\>](/ar/nodejs/api/tracing#tracing-object).

ينشئ ويرجع كائن `Tracing` لمجموعة `categories` المحددة.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**أُضيف في: v10.0.0**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع قائمة مفصولة بفواصل لجميع فئات أحداث التتبع الممكنة حاليًا. يتم تحديد المجموعة الحالية من فئات أحداث التتبع الممكنة من خلال *اتحاد* جميع كائنات `Tracing` الممكنة حاليًا وأي فئات مُمكنة باستخدام علامة `--trace-event-categories`.

بالنظر إلى الملف `test.js` أدناه، سيطبع الأمر `node --trace-event-categories node.perf test.js` القيمة `'node.async_hooks,node.perf'` إلى وحدة التحكم.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## أمثلة {#examples}

### جمع بيانات أحداث التتبع بواسطة المفتش {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // تم
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // افعل شيئًا
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
