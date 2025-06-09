---
title: توثيق واجهة برمجة التطبيقات (API) لعملية Node.js
description: توثيق مفصل لوحدة العمليات في Node.js، يغطي إدارة العمليات، والمتغيرات البيئية، والإشارات، والمزيد.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات (API) لعملية Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق مفصل لوحدة العمليات في Node.js، يغطي إدارة العمليات، والمتغيرات البيئية، والإشارات، والمزيد.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات (API) لعملية Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق مفصل لوحدة العمليات في Node.js، يغطي إدارة العمليات، والمتغيرات البيئية، والإشارات، والمزيد.
---


# Process {#process}

**Source Code:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

يوفر الكائن `process` معلومات حول عملية Node.js الحالية والتحكم فيها.

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## Process events {#process-events}

الكائن `process` هو نسخة من [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter).

### Event: `'beforeExit'` {#event-beforeexit}

**Added in: v0.11.12**

يتم إطلاق حدث `'beforeExit'` عندما تفرغ Node.js حلقة الأحداث الخاصة بها وليس لديها عمل إضافي لجدولته. عادةً، ستخرج عملية Node.js عندما لا يكون هناك عمل مجدول، ولكن يمكن للمستمع المسجل في حدث `'beforeExit'` إجراء مكالمات غير متزامنة، وبالتالي يتسبب في استمرار عملية Node.js.

يتم استدعاء دالة رد الاتصال الخاصة بالمستمع بقيمة [`process.exitCode`](/ar/nodejs/api/process#processexitcode_1) التي تم تمريرها كوسيطة وحيدة.

لا يتم إطلاق حدث `'beforeExit'` للشروط التي تتسبب في إنهاء صريح، مثل استدعاء [`process.exit()`](/ar/nodejs/api/process#processexitcode) أو الاستثناءات غير الملتقطة.

يجب *عدم* استخدام `'beforeExit'` كبديل لحدث `'exit'` ما لم يكن القصد هو جدولة عمل إضافي.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```
:::


### الحدث: `'disconnect'` {#event-disconnect}

**تمت الإضافة في: v0.7.7**

إذا تم إنشاء عملية Node.js بقناة IPC (راجع وثائق [العملية الفرعية](/ar/nodejs/api/child_process) و [المجموعة](/ar/nodejs/api/cluster))، فسيتم إطلاق الحدث `'disconnect'` عند إغلاق قناة IPC.

### الحدث: `'exit'` {#event-exit}

**تمت الإضافة في: v0.1.7**

- `code` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم إطلاق الحدث `'exit'` عندما تكون عملية Node.js على وشك الخروج نتيجة لأحد الأمرين التاليين:

- يتم استدعاء الطريقة `process.exit()` بشكل صريح؛
- لم تعد حلقة أحداث Node.js تحتوي على أي عمل إضافي للقيام به.

لا توجد طريقة لمنع خروج حلقة الأحداث في هذه المرحلة، وبمجرد انتهاء جميع مستمعي `'exit'` من التشغيل، ستنتهي عملية Node.js.

يتم استدعاء دالة الاسترجاع للمستمع برمز الخروج المحدد إما بواسطة الخاصية [`process.exitCode`](/ar/nodejs/api/process#processexitcode_1) أو وسيطة `exitCode` التي تم تمريرها إلى الطريقة [`process.exit()`](/ar/nodejs/api/process#processexitcode).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

يجب أن تنفذ دوال المستمع **عمليات متزامنة** فقط. ستخرج عملية Node.js مباشرة بعد استدعاء مستمعي الحدث `'exit'` مما يتسبب في التخلي عن أي عمل إضافي لا يزال في قائمة الانتظار في حلقة الأحداث. في المثال التالي، على سبيل المثال، لن يحدث المهلة أبدًا:

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### حدث: `'message'` {#event-message}

**أُضيف في: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) كائن JSON مُحلل أو قيمة بدائية قابلة للتحويل إلى سلسلة.
- `sendHandle` [\<net.Server\>](/ar/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) كائن [`net.Server`](/ar/nodejs/api/net#class-netserver) أو [`net.Socket`](/ar/nodejs/api/net#class-netsocket)، أو غير مُعرّف.

إذا تم إنشاء عملية Node.js باستخدام قناة IPC (انظر وثائق [العملية الفرعية](/ar/nodejs/api/child_process) و[المجموعة](/ar/nodejs/api/cluster))، فسيتم إصدار حدث `'message'` متى تم استلام رسالة أرسلتها عملية رئيسية باستخدام [`childprocess.send()`](/ar/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) بواسطة العملية الفرعية.

تمر الرسالة عبر التسلسل والتحليل. قد لا تكون الرسالة الناتجة هي نفسها ما تم إرساله في الأصل.

إذا تم تعيين الخيار `serialization` على `advanced` عند إنشاء العملية، يمكن أن تحتوي وسيطة `message` على بيانات لا يمكن لـ JSON تمثيلها. راجع [التسلسل المتقدم لـ `child_process`](/ar/nodejs/api/child_process#advanced-serialization) لمزيد من التفاصيل.

### حدث: `'multipleResolves'` {#event-multipleresolves}

**أُضيف في: v10.12.0**

**تم الإلغاء منذ: v17.6.0, v16.15.0**

::: danger [مستقر: 0 - مُلغى]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُلغى
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع القرار. واحد من `'resolve'` أو `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) الوعد الذي تم حله أو رفضه أكثر من مرة.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة التي تم بها حل الوعد أو رفضه بعد الحل الأصلي.

يتم إصدار حدث `'multipleResolves'` عندما يكون `Promise` قد تم:

- تم حله أكثر من مرة.
- تم رفضه أكثر من مرة.
- تم رفضه بعد الحل.
- تم حله بعد الرفض.

هذا مفيد لتتبع الأخطاء المحتملة في تطبيق أثناء استخدام مُنشئ `Promise`، حيث يتم ابتلاع الحلول المتعددة بصمت. ومع ذلك، فإن حدوث هذا الحدث لا يشير بالضرورة إلى وجود خطأ. على سبيل المثال، يمكن أن يؤدي [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) إلى تشغيل حدث `'multipleResolves'`.

بسبب عدم موثوقية الحدث في حالات مثل مثال [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) أعلاه، فقد تم إهماله.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### الحدث: `'rejectionHandled'` {#event-rejectionhandled}

**أضيف في: الإصدار v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) الوعد الذي تمت معالجته لاحقًا.

يتم إطلاق الحدث `'rejectionHandled'` عندما يتم رفض `Promise` ويتم إرفاق معالج أخطاء به (باستخدام [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)، على سبيل المثال) في وقت لاحق عن دورة واحدة من حلقة أحداث Node.js.

سيتم مسبقًا إطلاق كائن `Promise` في حدث `'unhandledRejection'`، ولكن أثناء المعالجة اكتسب معالج رفض.

لا يوجد مفهوم للمستوى الأعلى لسلسلة `Promise` التي يمكن فيها دائمًا معالجة عمليات الرفض. نظرًا لكونها غير متزامنة بطبيعتها، يمكن معالجة رفض `Promise` في نقطة مستقبلية في الوقت المناسب، ربما بعد فترة أطول من دورة حلقة الأحداث التي تستغرقها لإطلاق حدث `'unhandledRejection'`.

هناك طريقة أخرى لذكر ذلك وهي أنه على عكس التعليمات البرمجية المتزامنة حيث توجد قائمة متزايدة باستمرار من الاستثناءات غير المعالجة، مع الوعود يمكن أن تكون هناك قائمة متزايدة ومتقلصة من عمليات الرفض غير المعالجة.

في التعليمات البرمجية المتزامنة، يتم إطلاق الحدث `'uncaughtException'` عندما تنمو قائمة الاستثناءات غير المعالجة.

في التعليمات البرمجية غير المتزامنة، يتم إطلاق الحدث `'unhandledRejection'` عندما تنمو قائمة عمليات الرفض غير المعالجة، ويتم إطلاق الحدث `'rejectionHandled'` عندما تتقلص قائمة عمليات الرفض غير المعالجة.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

في هذا المثال، سوف تنمو `Map` المسماة `unhandledRejections` وتتقلص بمرور الوقت، مما يعكس عمليات الرفض التي تبدأ غير معالجة ثم تصبح معالجة. من الممكن تسجيل مثل هذه الأخطاء في سجل الأخطاء، إما بشكل دوري (والذي من المحتمل أن يكون الأفضل للتطبيقات طويلة الأجل) أو عند خروج العملية (والذي من المحتمل أن يكون الأكثر ملاءمة للبرامج النصية).


### الحدث: `'workerMessage'` {#event-workermessage}

**تمت إضافته في: الإصدار v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة مُرسلة باستخدام [`postMessageToThread()`](/ar/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف مؤشر الترابط العامل (worker thread ID) المُرسِل أو `0` للمؤشر الترابطي الرئيسي.

يتم إطلاق الحدث `'workerMessage'` لأي رسالة واردة مُرسَلة من الطرف الآخر باستخدام [`postMessageToThread()`](/ar/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### الحدث: `'uncaughtException'` {#event-uncaughtexception}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0, v10.17.0 | تمت إضافة الوسيطة `origin`. |
| v0.1.18 | تمت إضافته في: الإصدار v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الاستثناء غير المعالج.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يشير إلى ما إذا كان الاستثناء ناتجًا عن رفض لم تتم معالجته أو عن خطأ متزامن. يمكن أن يكون إما `'uncaughtException'` أو `'unhandledRejection'`. يتم استخدام الأخير عندما يحدث استثناء في سياق غير متزامن يعتمد على `Promise` (أو إذا تم رفض `Promise`) وتم تعيين علامة [`--unhandled-rejections`](/ar/nodejs/api/cli#--unhandled-rejectionsmode) إلى `strict` أو `throw` (وهو الوضع الافتراضي) ولم تتم معالجة الرفض، أو عندما يحدث رفض أثناء مرحلة التحميل الثابت لوحدة ES لنقطة إدخال سطر الأوامر.

يتم إطلاق الحدث `'uncaughtException'` عندما يتصاعد استثناء JavaScript غير معالج (uncaught) وصولاً إلى حلقة الأحداث. بشكل افتراضي، تعالج Node.js هذه الاستثناءات عن طريق طباعة تتبع المكدس إلى `stderr` والخروج برمز 1، متجاوزًا أي [`process.exitCode`](/ar/nodejs/api/process#processexitcode_1) تم تعيينه مسبقًا. تؤدي إضافة معالج للحدث `'uncaughtException'` إلى تجاوز هذا السلوك الافتراضي. بدلاً من ذلك، قم بتغيير [`process.exitCode`](/ar/nodejs/api/process#processexitcode_1) في معالج `'uncaughtException'` مما سيؤدي إلى خروج العملية برمز الخروج المقدم. خلافًا لذلك، في وجود هذا المعالج، ستخرج العملية بالرمز 0.

::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

من الممكن مراقبة أحداث `'uncaughtException'` دون تجاوز السلوك الافتراضي للخروج من العملية عن طريق تثبيت مستمع `'uncaughtExceptionMonitor'`.


#### تحذير: استخدام `'uncaughtException'` بشكل صحيح {#warning-using-uncaughtexception-correctly}

تُعد `'uncaughtException'` آلية فجة للتعامل مع الاستثناءات، والمقصود استخدامها كملاذ أخير فقط. *يجب عدم* استخدام هذا الحدث كمكافئ لـ `On Error Resume Next`. تعني الاستثناءات غير المعالجة بطبيعتها أن التطبيق في حالة غير محددة. يمكن أن تتسبب محاولة استئناف كود التطبيق دون التعافي بشكل صحيح من الاستثناء في حدوث مشكلات إضافية غير متوقعة ولا يمكن التنبؤ بها.

لن يتم التقاط الاستثناءات التي يتم إطلاقها من داخل معالج الحدث. بدلاً من ذلك، ستخرج العملية برمز خروج غير صفري وسيتم طباعة تتبع المكدس. هذا لتجنب التكرار اللانهائي.

يمكن أن تكون محاولة الاستئناف بشكل طبيعي بعد استثناء غير معالج مشابهة لسحب سلك الطاقة عند ترقية جهاز كمبيوتر. في تسع مرات من أصل عشر مرات، لا يحدث شيء. ولكن في المرة العاشرة، يصبح النظام تالفًا.

الاستخدام الصحيح لـ `'uncaughtException'` هو إجراء تنظيف متزامن للموارد المخصصة (مثل واصفات الملفات والمقابض وما إلى ذلك) قبل إيقاف تشغيل العملية. **ليس من الآمن استئناف التشغيل الطبيعي بعد
<code>'uncaughtException'</code>.**

لإعادة تشغيل تطبيق معطل بطريقة أكثر موثوقية، سواء تم إطلاق `'uncaughtException'` أم لا، يجب استخدام شاشة مراقبة خارجية في عملية منفصلة لاكتشاف حالات فشل التطبيق والتعافي أو إعادة التشغيل حسب الحاجة.

### الحدث: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**تمت إضافته في: الإصدار 13.7.0، الإصدار 12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الاستثناء غير المعالج.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يشير إلى ما إذا كان الاستثناء ناتجًا عن رفض غير معالج أو عن أخطاء متزامنة. يمكن أن يكون إما `'uncaughtException'` أو `'unhandledRejection'`. يتم استخدام الأخير عندما يحدث استثناء في سياق غير متزامن يعتمد على `Promise` (أو إذا تم رفض `Promise`) وتم تعيين علامة [`--unhandled-rejections`](/ar/nodejs/api/cli#--unhandled-rejectionsmode) على `strict` أو `throw` (وهو الإعداد الافتراضي) ولم يتم التعامل مع الرفض، أو عندما يحدث رفض أثناء مرحلة التحميل الثابت لوحدة ES لنقطة إدخال سطر الأوامر.

يتم إطلاق الحدث `'uncaughtExceptionMonitor'` قبل إطلاق حدث `'uncaughtException'` أو استدعاء خطاف مثبت عبر [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

لا يؤدي تثبيت مستمع `'uncaughtExceptionMonitor'` إلى تغيير السلوك بمجرد إطلاق حدث `'uncaughtException'`. ستظل العملية تتعطل إذا لم يتم تثبيت أي مستمع `'uncaughtException'`.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```
:::


### الحدث: `'unhandledRejection'` {#event-unhandledrejection}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v7.0.0 | عدم معالجة حالات رفض `Promise` مهمل. |
| v6.6.0 | الآن ستصدر حالات رفض `Promise` غير المعالجة تحذيرًا من العملية. |
| v1.4.1 | أضيف في: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) الكائن الذي تم رفض الوعد به (عادةً كائن [`Error`](/ar/nodejs/api/errors#class-error)).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) الوعد المرفوض.

يتم إصدار الحدث `'unhandledRejection'` عندما يتم رفض `Promise` ولا يتم إرفاق معالج أخطاء بالوعد في دورة حلقة الأحداث. عند البرمجة باستخدام Promises، يتم تغليف الاستثناءات على هيئة "وعود مرفوضة". يمكن التقاط حالات الرفض ومعالجتها باستخدام [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) ويتم نشرها عبر سلسلة `Promise`. الحدث `'unhandledRejection'` مفيد لاكتشاف وتتبع الوعود التي تم رفضها والتي لم تتم معالجة حالات رفضها بعد.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // تسجيل خاص بالتطبيق أو طرح خطأ أو منطق آخر هنا
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // لاحظ الخطأ الإملائي (`pasre`)
}); // لا يوجد `.catch()` أو `.then()`
```

```js [CJS]
const process = require('node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // تسجيل خاص بالتطبيق أو طرح خطأ أو منطق آخر هنا
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // لاحظ الخطأ الإملائي (`pasre`)
}); // لا يوجد `.catch()` أو `.then()`
```
:::

سيؤدي ما يلي أيضًا إلى إطلاق الحدث `'unhandledRejection'`:



::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // قم بتعيين الحالة المحملة مبدئيًا إلى وعد مرفوض
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// لا يوجد .catch أو .then على resource.loaded لمدة دورة على الأقل
```

```js [CJS]
const process = require('node:process';

function SomeResource() {
  // قم بتعيين الحالة المحملة مبدئيًا إلى وعد مرفوض
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// لا يوجد .catch أو .then على resource.loaded لمدة دورة على الأقل
```
:::

في مثال الحالة هذا، من الممكن تتبع الرفض كخطأ مطور كما هو الحال عادةً مع أحداث `'unhandledRejection'` الأخرى. لمعالجة حالات الفشل هذه، يمكن إرفاق معالج [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) غير تشغيلي بـ `resource.loaded`، مما يمنع إصدار الحدث `'unhandledRejection'`.


### الحدث: `'warning'` {#event-warning}

**أُضيف في: الإصدار 6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الخصائص الرئيسية للتحذير هي:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم التحذير. **افتراضي:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) وصف مقدم من النظام للتحذير.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تتبع المكدس إلى الموقع في التعليمات البرمجية حيث تم إصدار التحذير.
  
 

يتم إطلاق الحدث `'warning'` كلما أصدر Node.js تحذيرًا للعملية.

يشبه تحذير العملية الخطأ من حيث أنه يصف الظروف الاستثنائية التي يتم لفت انتباه المستخدم إليها. ومع ذلك، فإن التحذيرات ليست جزءًا من التدفق العادي لمعالجة الأخطاء في Node.js و JavaScript. يمكن لـ Node.js إصدار تحذيرات كلما اكتشف ممارسات ترميز سيئة يمكن أن تؤدي إلى أداء غير مثالي للتطبيق أو أخطاء أو ثغرات أمنية.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // طباعة اسم التحذير
  console.warn(warning.message); // طباعة رسالة التحذير
  console.warn(warning.stack);   // طباعة تتبع المكدس
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // طباعة اسم التحذير
  console.warn(warning.message); // طباعة رسالة التحذير
  console.warn(warning.stack);   // طباعة تتبع المكدس
});
```
:::

بشكل افتراضي، سيطبع Node.js تحذيرات العملية إلى `stderr`. يمكن استخدام خيار سطر الأوامر `--no-warnings` لقمع إخراج وحدة التحكم الافتراضي ولكن سيظل الحدث `'warning'` مُصدَرًا بواسطة كائن `process`. حاليًا، لا يمكن قمع أنواع تحذيرات محددة بخلاف تحذيرات الإهمال. لقمع تحذيرات الإهمال، تحقق من علامة [`--no-deprecation`](/ar/nodejs/api/cli#--no-deprecation).

يوضح المثال التالي التحذير الذي تتم طباعته إلى `stderr` عند إضافة عدد كبير جدًا من المستمعين إلى حدث:

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
على النقيض من ذلك، يقوم المثال التالي بإيقاف تشغيل إخراج التحذير الافتراضي ويضيف معالجًا مخصصًا إلى الحدث `'warning'`:

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
يمكن استخدام خيار سطر الأوامر `--trace-warnings` لجعل إخراج وحدة التحكم الافتراضي للتحذيرات يتضمن تتبع المكدس الكامل للتحذير.

سيؤدي تشغيل Node.js باستخدام علامة سطر الأوامر `--throw-deprecation` إلى طرح تحذيرات الإهمال المخصصة كاستثناءات.

سيؤدي استخدام علامة سطر الأوامر `--trace-deprecation` إلى طباعة الإهمال المخصص إلى `stderr` مع تتبع المكدس.

سيؤدي استخدام علامة سطر الأوامر `--no-deprecation` إلى قمع جميع التقارير الخاصة بالإهمال المخصص.

تؤثر علامات سطر الأوامر `*-deprecation` فقط على التحذيرات التي تستخدم الاسم `'DeprecationWarning'`.


#### إصدار تحذيرات مخصصة {#emitting-custom-warnings}

راجع طريقة [`process.emitWarning()`](/ar/nodejs/api/process#processemitwarningwarning-type-code-ctor) لإصدار تحذيرات مخصصة أو خاصة بالتطبيق.

#### أسماء تحذيرات Node.js {#nodejs-warning-names}

لا توجد إرشادات صارمة لأنواع التحذيرات (كما هو محدد بواسطة الخاصية `name`) التي تصدرها Node.js. يمكن إضافة أنواع جديدة من التحذيرات في أي وقت. تتضمن بعض أنواع التحذيرات الأكثر شيوعًا ما يلي:

- `'DeprecationWarning'` - يشير إلى استخدام واجهة برمجة تطبيقات أو ميزة مهملة من Node.js. يجب أن تتضمن هذه التحذيرات خاصية `'code'` تحدد [رمز الإهمال](/ar/nodejs/api/deprecations).
- `'ExperimentalWarning'` - يشير إلى استخدام واجهة برمجة تطبيقات أو ميزة تجريبية من Node.js. يجب استخدام هذه الميزات بحذر لأنها قد تتغير في أي وقت ولا تخضع لنفس سياسات الإصدار الدلالي الصارمة والدعم طويل الأجل مثل الميزات المدعومة.
- `'MaxListenersExceededWarning'` - يشير إلى أنه تم تسجيل عدد كبير جدًا من المستمعين لحدث معين على إما `EventEmitter` أو `EventTarget`. غالبًا ما يكون هذا مؤشرًا على تسرب الذاكرة.
- `'TimeoutOverflowWarning'` - يشير إلى أنه تم توفير قيمة رقمية لا يمكن أن تتناسب مع عدد صحيح موقع 32 بت إلى وظائف `setTimeout()` أو `setInterval()`.
- `'TimeoutNegativeWarning'` - يشير إلى أنه تم توفير رقم سالب إلى وظائف `setTimeout()` أو `setInterval()`.
- `'TimeoutNaNWarning'` - يشير إلى أنه تم توفير قيمة ليست رقمًا إلى وظائف `setTimeout()` أو `setInterval()`.
- `'UnsupportedWarning'` - يشير إلى استخدام خيار أو ميزة غير مدعومة سيتم تجاهلها بدلاً من التعامل معها كخطأ. أحد الأمثلة هو استخدام رسالة حالة استجابة HTTP عند استخدام واجهة برمجة تطبيقات توافق HTTP/2.

### الحدث: `'worker'` {#event-worker}

**تمت الإضافة في: v16.2.0، v14.18.0**

- `worker` [\<Worker\>](/ar/nodejs/api/worker_threads#class-worker) [\<Worker\>](/ar/nodejs/api/worker_threads#class-worker) الذي تم إنشاؤه.

يتم إصدار حدث `'worker'` بعد إنشاء سلسلة رسائل [\<Worker\>](/ar/nodejs/api/worker_threads#class-worker) جديدة.


### أحداث الإشارة {#signal-events}

سيتم إصدار أحداث الإشارة عندما تستقبل عملية Node.js إشارة. يرجى الرجوع إلى [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) للحصول على قائمة بأسماء إشارات POSIX القياسية مثل `'SIGINT'` و `'SIGHUP'` وما إلى ذلك.

الإشارات غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker).

سيتلقى معالج الإشارة اسم الإشارة (`'SIGINT'`, `'SIGTERM'`, وما إلى ذلك) كوسيطة أولى.

سيكون اسم كل حدث هو الاسم الشائع بالأحرف الكبيرة للإشارة (على سبيل المثال `'SIGINT'` لإشارات `SIGINT`).



::: code-group
```js [ESM]
import process from 'node:process';

// ابدأ القراءة من stdin حتى لا تنتهي العملية.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('تم استقبال SIGINT. اضغط على Control-D للخروج.');
});

// استخدام دالة واحدة للتعامل مع إشارات متعددة
function handle(signal) {
  console.log(`تم استقبال ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// ابدأ القراءة من stdin حتى لا تنتهي العملية.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('تم استقبال SIGINT. اضغط على Control-D للخروج.');
});

// استخدام دالة واحدة للتعامل مع إشارات متعددة
function handle(signal) {
  console.log(`تم استقبال ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` محجوزة بواسطة Node.js لبدء [المصحح](/ar/nodejs/api/debugger). من الممكن تثبيت مستمع ولكن القيام بذلك قد يتعارض مع المصحح.
- `'SIGTERM'` و `'SIGINT'` لديهما معالجات افتراضية على الأنظمة الأساسية غير Windows والتي تعيد تعيين وضع الجهاز قبل الخروج بالرمز `128 + رقم الإشارة`. إذا كانت إحدى هذه الإشارات مثبتة مستمعًا ، فسيتم إزالة سلوكها الافتراضي (لن يخرج Node.js بعد الآن).
- يتم تجاهل `'SIGPIPE'` افتراضيًا. يمكن أن يكون لها مستمع مثبت.
- يتم إنشاء `'SIGHUP'` على نظام التشغيل Windows عند إغلاق نافذة وحدة التحكم ، وعلى الأنظمة الأساسية الأخرى في ظل ظروف مماثلة مختلفة. انظر [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). يمكن أن يكون لها مستمع مثبت ، ومع ذلك سيتم إنهاء Node.js بشكل غير مشروط بواسطة Windows بعد حوالي 10 ثوانٍ. على الأنظمة الأساسية غير Windows ، فإن السلوك الافتراضي لـ `SIGHUP` هو إنهاء Node.js ، ولكن بمجرد تثبيت مستمع ، ستتم إزالة سلوكه الافتراضي.
- `'SIGTERM'` غير مدعوم على نظام التشغيل Windows ، ويمكن الاستماع إليه.
- `'SIGINT'` من الجهاز مدعوم على جميع الأنظمة الأساسية ، ويمكن إنشاؤه عادةً باستخدام + (على الرغم من أن هذا قد يكون قابلاً للتكوين). لا يتم إنشاؤه عند تمكين [وضع الجهاز الخام](/ar/nodejs/api/tty#readstreamsetrawmodemode) + مستخدم.
- يتم تسليم `'SIGBREAK'` على نظام التشغيل Windows عند الضغط على + . على الأنظمة الأساسية غير Windows ، يمكن الاستماع إليه ، ولكن لا توجد طريقة لإرساله أو إنشائه.
- يتم تسليم `'SIGWINCH'` عند تغيير حجم وحدة التحكم. على نظام التشغيل Windows ، لن يحدث هذا إلا عند الكتابة إلى وحدة التحكم عند تحريك المؤشر ، أو عند استخدام tty قابلة للقراءة في الوضع الخام.
- لا يمكن أن يكون لـ `'SIGKILL'` مستمع مثبت ، وسوف ينهي Node.js بشكل غير مشروط على جميع الأنظمة الأساسية.
- لا يمكن أن يكون لـ `'SIGSTOP'` مستمع مثبت.
- `'SIGBUS'` و `'SIGFPE'` و `'SIGSEGV'` و `'SIGILL'` ، عندما لا يتم رفعها بشكل مصطنع باستخدام [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) ، تترك العملية بشكل جوهري في حالة لا يكون من الآمن فيها استدعاء مستمعي JS. قد يؤدي القيام بذلك إلى توقف العملية عن الاستجابة.
- يمكن إرسال `0` لاختبار وجود عملية ، وليس له أي تأثير إذا كانت العملية موجودة ، ولكنه سيطرح خطأ إذا كانت العملية غير موجودة.

لا يدعم Windows الإشارات ، لذلك ليس لديه ما يعادل الإنهاء عن طريق الإشارة ، ولكن Node.js يقدم بعض المحاكاة مع [`process.kill()`](/ar/nodejs/api/process#processkillpid-signal) و [`subprocess.kill()`](/ar/nodejs/api/child_process#subprocesskillsignal):

- سيؤدي إرسال `SIGINT` و `SIGTERM` و `SIGKILL` إلى الإنهاء غير المشروط للعملية المستهدفة ، وبعد ذلك ، سيبلغ العملية الفرعية أن العملية قد تم إنهاؤها بواسطة إشارة.
- يمكن استخدام إرسال الإشارة `0` كطريقة مستقلة عن النظام الأساسي لاختبار وجود عملية.


## `process.abort()` {#processabort}

**تمت الإضافة في: الإصدار v0.7.0**

تتسبب طريقة `process.abort()` في خروج عملية Node.js على الفور وإنشاء ملف أساسي.

هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) threads.

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**تمت الإضافة في: الإصدار v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

خاصية `process.allowedNodeEnvironmentFlags` هي `Set` خاصة للقراءة فقط من العلامات المسموح بها داخل متغير البيئة [`NODE_OPTIONS`](/ar/nodejs/api/cli#node_optionsoptions).

تقوم `process.allowedNodeEnvironmentFlags` بتوسيع `Set`، ولكنها تتجاوز `Set.prototype.has` للتعرف على العديد من التمثيلات المختلفة المحتملة للعلامات. ستُرجع `process.allowedNodeEnvironmentFlags.has()` القيمة `true` في الحالات التالية:

- قد تحذف العلامات شرطات مفردة (`-`) أو مزدوجة (`--`) بادئة؛ على سبيل المثال، `inspect-brk` لـ `--inspect-brk`، أو `r` لـ `-r`.
- العلامات التي تم تمريرها إلى V8 (كما هو مدرج في `--v8-options`) قد تستبدل شرطة واحدة أو أكثر *غير بادئة* بشرطة سفلية، أو العكس؛ على سبيل المثال، `--perf_basic_prof`، و `--perf-basic-prof`، و `--perf_basic-prof`، إلخ.
- قد تحتوي العلامات على حرف واحد أو أكثر من علامات التساوي (`=`); سيتم تجاهل جميع الأحرف بعد أول علامة تساوي بما في ذلك العلامة نفسها؛ على سبيل المثال، `--stack-trace-limit=100`.
- *يجب* أن تكون العلامات مسموحًا بها داخل [`NODE_OPTIONS`](/ar/nodejs/api/cli#node_optionsoptions).

عند التكرار على `process.allowedNodeEnvironmentFlags`، ستظهر العلامات مرة واحدة فقط؛ ستبدأ كل علامة بشرطة واحدة أو أكثر. ستحتوي العلامات التي تم تمريرها إلى V8 على شرطات سفلية بدلاً من الشرطات غير البادئة:

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

لا تفعل الطرق `add()` و `clear()` و `delete()` الخاصة بـ `process.allowedNodeEnvironmentFlags` أي شيء، وستفشل بصمت.

إذا تم تجميع Node.js *بدون* دعم [`NODE_OPTIONS`](/ar/nodejs/api/cli#node_optionsoptions) (يظهر في [`process.config`](/ar/nodejs/api/process#processconfig))، فستحتوي `process.allowedNodeEnvironmentFlags` على ما *كان سيُسمح به*.


## `process.arch` {#processarch}

**تمت إضافته في: الإصدار v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

بنية وحدة المعالجة المركزية لنظام التشغيل التي تم تجميع ثنائي Node.js من أجلها. القيم الممكنة هي: `'arm'` و `'arm64'` و `'ia32'` و `'loong64'` و `'mips'` و `'mipsel'` و `'ppc'` و `'ppc64'` و `'riscv64'` و `'s390'` و `'s390x'` و `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`هذه هي بنية المعالج ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`هذه هي بنية المعالج ${arch}`);
```
:::

## `process.argv` {#processargv}

**تمت إضافته في: الإصدار v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تعرض الخاصية `process.argv` مصفوفة تحتوي على وسيطات سطر الأوامر التي تم تمريرها عند تشغيل عملية Node.js. سيكون العنصر الأول هو [`process.execPath`](/ar/nodejs/api/process#processexecpath). راجع `process.argv0` إذا كانت هناك حاجة للوصول إلى القيمة الأصلية لـ `argv[0]`. سيكون العنصر الثاني هو مسار ملف JavaScript قيد التنفيذ. ستكون العناصر المتبقية أي وسيطات إضافية لسطر الأوامر.

على سبيل المثال، بافتراض النص البرمجي التالي لـ `process-args.js`:

::: code-group
```js [ESM]
import { argv } from 'node:process';

// طباعة process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// طباعة process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

تشغيل عملية Node.js على النحو التالي:

```bash [BASH]
node process-args.js one two=three four
```
سينتج الإخراج التالي:

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**تمت إضافته في: الإصدار v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تخزن الخاصية `process.argv0` نسخة للقراءة فقط من القيمة الأصلية لـ `argv[0]` التي تم تمريرها عند بدء تشغيل Node.js.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v14.0.0 | لم يعد الكائن يكشف عن طريق الخطأ روابط C++ الأصلية. |
| v7.1.0 | تمت إضافته في: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا تم إنشاء عملية Node.js باستخدام قناة IPC (راجع وثائق [عملية الطفل](/ar/nodejs/api/child_process))، فإن خاصية `process.channel` هي إشارة إلى قناة IPC. إذا لم تكن هناك قناة IPC موجودة، فإن هذه الخاصية تكون `undefined`.

### `process.channel.ref()` {#processchannelref}

**تمت إضافته في: v7.1.0**

يجعل هذا الأسلوب قناة IPC تحافظ على تشغيل حلقة الأحداث للعملية إذا تم استدعاء `.unref()` من قبل.

عادةً، تتم إدارة هذا من خلال عدد مستمعي `'disconnect'` و `'message'` على كائن `process`. ومع ذلك، يمكن استخدام هذا الأسلوب لطلب سلوك محدد بشكل صريح.

### `process.channel.unref()` {#processchannelunref}

**تمت إضافته في: v7.1.0**

يجعل هذا الأسلوب قناة IPC لا تحافظ على تشغيل حلقة الأحداث للعملية، ويسمح لها بالانتهاء حتى أثناء فتح القناة.

عادةً، تتم إدارة هذا من خلال عدد مستمعي `'disconnect'` و `'message'` على كائن `process`. ومع ذلك، يمكن استخدام هذا الأسلوب لطلب سلوك محدد بشكل صريح.

## `process.chdir(directory)` {#processchdirdirectory}

**تمت إضافته في: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم الأسلوب `process.chdir()` بتغيير دليل العمل الحالي لعملية Node.js أو يطرح استثناءً إذا فشل القيام بذلك (على سبيل المثال، إذا كان `directory` المحدد غير موجود).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker).


## `process.config` {#processconfig}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | الكائن `process.config` مجمد الآن. |
| v16.0.0 | تعديل process.config أصبح مهجورًا. |
| v0.7.7 | تمت الإضافة في: v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تعيد الخاصية `process.config` كائنًا `Object` مجمدًا يحتوي على تمثيل JavaScript لخيارات التهيئة المستخدمة لتجميع ملف Node.js القابل للتنفيذ الحالي. هذا هو نفسه ملف `config.gypi` الذي تم إنتاجه عند تشغيل البرنامج النصي `./configure`.

مثال على الإخراج المحتمل يبدو كالتالي:

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**تمت الإضافة في: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا تمت عملية Node.js بقناة IPC (راجع وثائق [العملية الفرعية](/ar/nodejs/api/child_process) و [المجموعة](/ar/nodejs/api/cluster))، فستعيد الخاصية `process.connected` القيمة `true` طالما أن قناة IPC متصلة وستعيد `false` بعد استدعاء `process.disconnect()`.

بمجرد أن تصبح `process.connected` بقيمة `false`، لن يكون من الممكن إرسال الرسائل عبر قناة IPC باستخدام `process.send()`.

## `process.constrainedMemory()` {#processconstrainedmemory}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | تمت محاذاة القيمة المرجعة مع `uv_get_constrained_memory`. |
| v19.6.0, v18.15.0 | تمت الإضافة في: v19.6.0, v18.15.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يحصل على مقدار الذاكرة المتاحة للعملية (بالبايت) بناءً على القيود التي يفرضها نظام التشغيل. إذا لم يكن هناك مثل هذا القيد، أو كان القيد غير معروف، فسيتم إرجاع `0`.

راجع [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) لمزيد من المعلومات.


## `process.availableMemory()` {#processavailablememory}

**أُضيف في: الإصدار v22.0.0، v20.13.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يحصل على مقدار الذاكرة الحرة المتاحة للعملية (بالبايت).

انظر [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory) لمزيد من المعلومات.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**أُضيف في: الإصدار v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) قيمة الإرجاع السابقة من استدعاء `process.cpuUsage()`
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم الطريقة `process.cpuUsage()` بإرجاع استخدام وحدة المعالجة المركزية (CPU) للمستخدم والنظام للعملية الحالية، في كائن بخصائص `user` و `system`، والتي تكون قيمها قيم بالميكروثانية (جزء من مليون من الثانية). تقيس هذه القيم الوقت الذي يقضيه في كود المستخدم والنظام على التوالي، وقد ينتهي بها الأمر إلى أن تكون أكبر من الوقت المنقضي الفعلي إذا كانت نوى وحدة المعالجة المركزية المتعددة تقوم بعمل لهذه العملية.

يمكن تمرير نتيجة استدعاء سابق لـ `process.cpuUsage()` كمعامل للدالة، للحصول على قراءة فرق.

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// تدوير وحدة المعالجة المركزية لمدة 500 مللي ثانية
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// تدوير وحدة المعالجة المركزية لمدة 500 مللي ثانية
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**تمت الإضافة في: v0.1.8**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `process.cwd()` بإرجاع دليل العمل الحالي لعملية Node.js.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Current directory: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Current directory: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**تمت الإضافة في: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

المنفذ الذي يستخدمه مصحح أخطاء Node.js عند تمكينه.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**تمت الإضافة في: v0.7.2**

إذا تم إنشاء عملية Node.js باستخدام قناة IPC (انظر وثائق [عملية الطفل](/ar/nodejs/api/child_process) و[المجموعة](/ar/nodejs/api/cluster))، فستقوم الطريقة `process.disconnect()` بإغلاق قناة IPC للعملية الأصلية، مما يسمح لعملية الطفل بالخروج بأمان بمجرد عدم وجود اتصالات أخرى تبقيها حية.

تأثير استدعاء `process.disconnect()` هو نفسه استدعاء [`ChildProcess.disconnect()`](/ar/nodejs/api/child_process#subprocessdisconnect) من العملية الأصلية.

إذا لم يتم إنشاء عملية Node.js باستخدام قناة IPC، فسيكون `process.disconnect()` غير معرف `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | تمت إضافة دعم وسيطة `flags`. |
| v0.1.16 | تمت الإضافة في: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/ar/nodejs/api/os#dlopen-constants) **افتراضي:** `os.constants.dlopen.RTLD_LAZY`

تتيح الطريقة `process.dlopen()` التحميل الديناميكي للكائنات المشتركة. يتم استخدامه بشكل أساسي بواسطة `require()` لتحميل إضافات C++، ولا ينبغي استخدامه مباشرة، إلا في حالات خاصة. بعبارة أخرى، يفضل استخدام [`require()`](/ar/nodejs/api/globals#require) على `process.dlopen()` ما لم تكن هناك أسباب محددة مثل علامات dlopen مخصصة أو التحميل من وحدات ES.

الوسيطة `flags` هي عدد صحيح يسمح بتحديد سلوك dlopen. راجع وثائق [`os.constants.dlopen`](/ar/nodejs/api/os#dlopen-constants) للحصول على التفاصيل.

المتطلب المهم عند استدعاء `process.dlopen()` هو أنه يجب تمرير مثيل `module`. يمكن الوصول إلى الوظائف التي تم تصديرها بواسطة C++ Addon عبر `module.exports`.

يوضح المثال أدناه كيفية تحميل C++ Addon، المسمى `local.node`، والذي يصدر وظيفة `foo`. يتم تحميل جميع الرموز قبل إرجاع الاستدعاء، عن طريق تمرير الثابت `RTLD_NOW`. في هذا المثال، يفترض أن الثابت متاح.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**أُضيف في: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) التحذير المراد إصداره.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عندما يكون `warning` عبارة عن `String`، فإن `type` هو الاسم المستخدم لنوع التحذير الذي يتم إصداره. **الافتراضي:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معرف فريد لمثيل التحذير الذي يتم إصداره.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) عندما يكون `warning` عبارة عن `String`، فإن `ctor` هي دالة اختيارية تستخدم للحد من تتبع المكدس الذي تم إنشاؤه. **الافتراضي:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نص إضافي ليتم تضمينه مع الخطأ.

 

يمكن استخدام الطريقة `process.emitWarning()` لإصدار تحذيرات مخصصة أو خاصة بالتطبيق للعملية. يمكن الاستماع إلى هذه التحذيرات عن طريق إضافة معالج إلى الحدث [`'warning'`](/ar/nodejs/api/process#event-warning).



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// إصدار تحذير برمز وتفاصيل إضافية.
emitWarning('حدث خطأ ما!', {
  code: 'MY_WARNING',
  detail: 'هذه بعض المعلومات الإضافية',
});
// إصدار:
// (node:56338) [MY_WARNING] Warning: حدث خطأ ما!
// هذه بعض المعلومات الإضافية
```

```js [CJS]
const { emitWarning } = require('node:process');

// إصدار تحذير برمز وتفاصيل إضافية.
emitWarning('حدث خطأ ما!', {
  code: 'MY_WARNING',
  detail: 'هذه بعض المعلومات الإضافية',
});
// إصدار:
// (node:56338) [MY_WARNING] Warning: حدث خطأ ما!
// هذه بعض المعلومات الإضافية
```
:::

في هذا المثال، يتم إنشاء كائن `Error` داخليًا بواسطة `process.emitWarning()` ويتم تمريره إلى معالج [`'warning'`](/ar/nodejs/api/process#event-warning).



::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'حدث خطأ ما!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // تتبع المكدس
  console.warn(warning.detail);  // 'هذه بعض المعلومات الإضافية'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'حدث خطأ ما!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // تتبع المكدس
  console.warn(warning.detail);  // 'هذه بعض المعلومات الإضافية'
});
```
:::

إذا تم تمرير `warning` ككائن `Error`، فسيتم تجاهل وسيطة `options`.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**أُضيف في: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) التحذير المراد إصداره.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عندما يكون `warning` عبارة عن `String`، فإن `type` هو الاسم المستخدم لنوع التحذير الذي يتم إصداره. **افتراضي:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معرّف فريد لمثيل التحذير الذي يتم إصداره.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) عندما يكون `warning` عبارة عن `String`، فإن `ctor` هي دالة اختيارية تستخدم للحد من تتبع المكدس الذي تم إنشاؤه. **افتراضي:** `process.emitWarning`.

يمكن استخدام الأسلوب `process.emitWarning()` لإصدار تحذيرات عملية مخصصة أو خاصة بالتطبيق. يمكن الاستماع إليها عن طريق إضافة معالج إلى حدث [`'warning'`](/ar/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// إصدار تحذير باستخدام سلسلة نصية.
emitWarning('حدث شيء ما!');
// يصدر: (node: 56338) Warning: حدث شيء ما!
```

```js [CJS]
const { emitWarning } = require('node:process');

// إصدار تحذير باستخدام سلسلة نصية.
emitWarning('حدث شيء ما!');
// يصدر: (node: 56338) Warning: حدث شيء ما!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// إصدار تحذير باستخدام سلسلة نصية ونوع.
emitWarning('حدث شيء ما!', 'CustomWarning');
// يصدر: (node:56338) CustomWarning: حدث شيء ما!
```

```js [CJS]
const { emitWarning } = require('node:process');

// إصدار تحذير باستخدام سلسلة نصية ونوع.
emitWarning('حدث شيء ما!', 'CustomWarning');
// يصدر: (node:56338) CustomWarning: حدث شيء ما!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('حدث شيء ما!', 'CustomWarning', 'WARN001');
// يصدر: (node:56338) [WARN001] CustomWarning: حدث شيء ما!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('حدث شيء ما!', 'CustomWarning', 'WARN001');
// يصدر: (node:56338) [WARN001] CustomWarning: حدث شيء ما!
```
:::

في كل مثال من الأمثلة السابقة، يتم إنشاء كائن `Error` داخليًا بواسطة `process.emitWarning()` ويمرر إلى معالج [`'warning'`](/ar/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

إذا تم تمرير `warning` ككائن `Error`، فسيتم تمريره إلى معالج حدث `'warning'` بدون تعديل (وسيتم تجاهل الوسائط الاختيارية `type` و `code` و `ctor`):

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// إصدار تحذير باستخدام كائن Error.
const myWarning = new Error('حدث شيء ما!');
// استخدم الخاصية name الخاصة بـ Error لتحديد اسم النوع
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// يصدر: (node:56338) [WARN001] CustomWarning: حدث شيء ما!
```

```js [CJS]
const { emitWarning } = require('node:process');

// إصدار تحذير باستخدام كائن Error.
const myWarning = new Error('حدث شيء ما!');
// استخدم الخاصية name الخاصة بـ Error لتحديد اسم النوع
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// يصدر: (node:56338) [WARN001] CustomWarning: حدث شيء ما!
```
:::

يتم طرح `TypeError` إذا كان `warning` أي شيء بخلاف سلسلة نصية أو كائن `Error`.

في حين أن تحذيرات العملية تستخدم كائنات `Error`، فإن آلية تحذير العملية **ليست** بديلاً عن آليات معالجة الأخطاء العادية.

يتم تنفيذ المعالجة الإضافية التالية إذا كان `type` الخاص بالتحذير هو `'DeprecationWarning'`:

- إذا تم استخدام علامة سطر الأوامر `--throw-deprecation`، فسيتم طرح تحذير الإهمال كاستثناء بدلاً من إصداره كحدث.
- إذا تم استخدام علامة سطر الأوامر `--no-deprecation`، فسيتم قمع تحذير الإهمال.
- إذا تم استخدام علامة سطر الأوامر `--trace-deprecation`، فسيتم طباعة تحذير الإهمال إلى `stderr` جنبًا إلى جنب مع تتبع المكدس الكامل.


### تجنب التحذيرات المكررة {#avoiding-duplicate-warnings}

كأفضل ممارسة، يجب إصدار التحذيرات مرة واحدة فقط لكل عملية. للقيام بذلك، ضع `emitWarning()` خلف قيمة منطقية.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v11.14.0 | ستستخدم سلاسل العمل الآن نسخة من `process.env` للسلسلة الأصل افتراضيًا، ويمكن تهيئتها من خلال الخيار `env` لمنشئ `Worker`. |
| الإصدار v10.0.0 | التحويل الضمني لقيمة المتغير إلى سلسلة مهمل. |
| الإصدار v0.1.27 | تمت إضافته في: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ترجع الخاصية `process.env` كائنًا يحتوي على بيئة المستخدم. انظر [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

مثال على هذا الكائن يبدو كالتالي:

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
من الممكن تعديل هذا الكائن، ولكن هذه التعديلات لن تنعكس خارج عملية Node.js، أو (ما لم يُطلب ذلك صراحةً) على سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) الأخرى. بمعنى آخر، المثال التالي لن يعمل:

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
بينما التالي سيعمل:

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

سيؤدي تعيين خاصية على `process.env` إلى تحويل القيمة ضمنيًا إلى سلسلة. **هذا السلوك مهمل.** قد تطرح الإصدارات المستقبلية من Node.js خطأً عندما لا تكون القيمة عبارة عن سلسلة أو رقم أو قيمة منطقية.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

استخدم `delete` لحذف خاصية من `process.env`.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

في أنظمة تشغيل Windows، تكون متغيرات البيئة غير حساسة لحالة الأحرف.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

ما لم يتم تحديده صراحةً عند إنشاء مثيل [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فإن لكل سلسلة [`Worker`](/ar/nodejs/api/worker_threads#class-worker) نسخة خاصة بها من `process.env`، بناءً على `process.env` للسلسلة الأصل، أو أي شيء تم تحديده كخيار `env` لمنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker). لن تكون التغييرات التي تطرأ على `process.env` مرئية عبر سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، ويمكن للسلسلة الرئيسية فقط إجراء تغييرات مرئية لنظام التشغيل أو للإضافات الأصلية. في نظام التشغيل Windows، تعمل نسخة من `process.env` على مثيل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) بطريقة حساسة لحالة الأحرف على عكس السلسلة الرئيسية.


## `process.execArgv` {#processexecargv}

**تمت إضافتها في: الإصدار v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تعيد الخاصية `process.execArgv` مجموعة خيارات سطر الأوامر الخاصة بـ Node.js التي تم تمريرها عند تشغيل عملية Node.js. لا تظهر هذه الخيارات في المصفوفة التي تم إرجاعها بواسطة الخاصية [`process.argv`](/ar/nodejs/api/process#processargv)، ولا تتضمن ملف Node.js القابل للتنفيذ، أو اسم البرنامج النصي، أو أي خيارات تلي اسم البرنامج النصي. هذه الخيارات مفيدة لإنشاء عمليات فرعية بنفس بيئة التنفيذ الخاصة بالعملية الرئيسية.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
تؤدي إلى `process.execArgv`:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
و `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
راجع [`Worker` constructor](/ar/nodejs/api/worker_threads#new-workerfilename-options) للحصول على تفاصيل حول سلوك سلاسل العمل (worker threads) مع هذه الخاصية.

## `process.execPath` {#processexecpath}

**تمت إضافتها في: الإصدار v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تعيد الخاصية `process.execPath` المسار المطلق للملف التنفيذي الذي بدأ عملية Node.js. يتم حل الروابط الرمزية، إن وجدت.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | يقبل فقط رمز من النوع رقم، أو من النوع سلسلة إذا كان يمثل عددًا صحيحًا. |
| v0.1.13 | تمت إضافتها في: الإصدار v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رمز الخروج. بالنسبة لنوع السلسلة، يُسمح فقط بسلاسل الأعداد الصحيحة (مثل '1'). **الافتراضي:** `0`.

تُوجِّه الدالة `process.exit()` Node.js لإنهاء العملية بشكل متزامن مع حالة خروج `code`. إذا تم حذف `code`، فسيستخدم الخروج إما رمز 'success' `0` أو قيمة `process.exitCode` إذا تم تعيينها. لن يتم إنهاء Node.js حتى يتم استدعاء جميع مستمعي حدث [`'exit'`](/ar/nodejs/api/process#event-exit).

للخروج برمز 'failure':



::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

يجب أن ترى الصدفة (shell) التي نفذت Node.js رمز الخروج كـ `1`.

سيؤدي استدعاء `process.exit()` إلى إجبار العملية على الخروج بأسرع ما يمكن حتى إذا كانت هناك عمليات غير متزامنة معلقة لم تكتمل بعد بشكل كامل، بما في ذلك عمليات الإدخال / الإخراج إلى `process.stdout` و `process.stderr`.

في معظم الحالات، ليس من الضروري فعليًا استدعاء `process.exit()` بشكل صريح. ستخرج عملية Node.js من تلقاء نفسها *إذا لم يكن هناك عمل إضافي معلق* في حلقة الأحداث. يمكن تعيين الخاصية `process.exitCode` لإخبار العملية برمز الخروج الذي يجب استخدامه عند انتهاء العملية بأمان.

على سبيل المثال، يوضح المثال التالي *إساءة استخدام* للدالة `process.exit()` والتي قد تؤدي إلى اقتطاع البيانات المطبوعة إلى stdout وفقدها:



::: code-group
```js [ESM]
import { exit } from 'node:process';

// This is an example of what *not* to do:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// This is an example of what *not* to do:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

السبب في أن هذا يمثل مشكلة هو أن الكتابة إلى `process.stdout` في Node.js تكون أحيانًا *غير متزامنة* وقد تحدث على مدى عدة نبضات (ticks) لحلقة أحداث Node.js. ومع ذلك، فإن استدعاء `process.exit()` يجبر العملية على الخروج *قبل* أن يتم تنفيذ هذه الكتابات الإضافية إلى `stdout`.

بدلاً من استدعاء `process.exit()` مباشرةً، *يجب* على التعليمات البرمجية تعيين `process.exitCode` والسماح للعملية بالخروج بشكل طبيعي عن طريق تجنب جدولة أي عمل إضافي لحلقة الأحداث:



::: code-group
```js [ESM]
import process from 'node:process';

// How to properly set the exit code while letting
// the process exit gracefully.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// How to properly set the exit code while letting
// the process exit gracefully.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

إذا كان من الضروري إنهاء عملية Node.js بسبب حالة خطأ، فإن طرح خطأ *غير معالج* والسماح للعملية بالإنهاء وفقًا لذلك يكون أكثر أمانًا من استدعاء `process.exit()`.

في سلاسل العمل ([`Worker`](/ar/nodejs/api/worker_threads#class-worker) threads)، توقف هذه الدالة السلسلة الحالية بدلاً من العملية الحالية.


## `process.exitCode` {#processexitcode_1}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | يقبل فقط رمزًا من نوع رقم أو من نوع سلسلة إذا كان يمثل عددًا صحيحًا. |
| v0.11.8 | تمت إضافته في: v0.11.8 |
:::

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<فارغ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<غير معرف\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رمز الخروج. بالنسبة لنوع السلسلة النصية، يُسمح فقط بسلاسل الأعداد الصحيحة (مثل '1'). **الافتراضي:** `غير معرف`.

رقم سيكون رمز خروج العملية، عندما تخرج العملية بشكل طبيعي، أو يتم إنهاؤها عبر [`process.exit()`](/ar/nodejs/api/process#processexitcode) دون تحديد رمز.

تحديد رمز لـ [`process.exit(code)`](/ar/nodejs/api/process#processexitcode) سيتجاوز أي إعداد سابق لـ `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**تمت إضافته في: v12.0.0**

- [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان إصدار Node.js الحالي يقوم بتخزين الوحدات النمطية المضمنة مؤقتًا.

## `process.features.debug` {#processfeaturesdebug}

**تمت إضافته في: v0.5.5**

- [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان إصدار Node.js الحالي هو إصدار تصحيح الأخطاء.

## `process.features.inspector` {#processfeaturesinspector}

**تمت إضافته في: v11.10.0**

- [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان إصدار Node.js الحالي يتضمن أداة الفحص.

## `process.features.ipv6` {#processfeaturesipv6}

**تمت إضافته في: v0.5.3**

**تم الإلغاء منذ: v23.4.0**

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء. هذه الخاصية صحيحة دائمًا، وأي فحوصات تعتمد عليها زائدة عن الحاجة.
:::

- [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان إصدار Node.js الحالي يتضمن دعمًا لـ IPv6.

نظرًا لأن جميع إصدارات Node.js تدعم IPv6، فإن هذه القيمة تكون دائمًا `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**أُضيف في: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان بناء Node.js الحالي يدعم [تحميل وحدات ECMAScript باستخدام `require()`](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**أُضيف في: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان بناء Node.js الحالي يتضمن دعم TLS.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**أُضيف في: v4.8.0**

**تم الإيقاف منذ: v23.4.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. استخدم `process.features.tls` بدلاً من ذلك.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان بناء Node.js الحالي يتضمن دعم ALPN في TLS.

في Node.js 11.0.0 والإصدارات الأحدث، تتميز تبعيات OpenSSL بدعم ALPN غير مشروط. وبالتالي، فإن هذه القيمة مطابقة لقيمة `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**أُضيف في: v0.11.13**

**تم الإيقاف منذ: v23.4.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. استخدم `process.features.tls` بدلاً من ذلك.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان بناء Node.js الحالي يتضمن دعم OCSP في TLS.

في Node.js 11.0.0 والإصدارات الأحدث، تتميز تبعيات OpenSSL بدعم OCSP غير مشروط. وبالتالي، فإن هذه القيمة مطابقة لقيمة `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**أُضيف في: v0.5.3**

**تم الإيقاف منذ: v23.4.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. استخدم `process.features.tls` بدلاً من ذلك.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان بناء Node.js الحالي يتضمن دعم SNI في TLS.

في Node.js 11.0.0 والإصدارات الأحدث، تتميز تبعيات OpenSSL بدعم SNI غير مشروط. وبالتالي، فإن هذه القيمة مطابقة لقيمة `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**أُضيف في: الإصدار v23.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قيمة تكون `"strip"` إذا تم تشغيل Node.js باستخدام `--experimental-strip-types`، أو `"transform"` إذا تم تشغيل Node.js باستخدام `--experimental-transform-types`، و `false` بخلاف ذلك.

## `process.features.uv` {#processfeaturesuv}

**أُضيف في: الإصدار v0.5.3**

**تم الإلغاء منذ: الإصدار v23.4.0**

::: danger [مستقر: 0 - مُلغى]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُلغى. هذه الخاصية دائمًا true، وأي عمليات تحقق تستند إليها زائدة عن الحاجة.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تكون `true` إذا كان إصدار Node.js الحالي يتضمن دعمًا لـ libuv.

نظرًا لأنه لا يمكن إنشاء Node.js بدون libuv، فإن هذه القيمة تكون دائمًا `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**أُضيف في: الإصدار v22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مرجع للمورد الذي يتم تتبعه.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد النداء التي سيتم استدعاؤها عند الانتهاء من المورد.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مرجع للمورد الذي يتم تتبعه.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الحدث الذي أثار الإنهاء. الافتراضي هو 'exit'.

تسجل هذه الدالة دالة رد نداء ليتم استدعاؤها عندما يطلق العملية حدث `exit` إذا لم يتم جمع الكائن `ref` المهمل. إذا تم جمع الكائن `ref` المهمل قبل إطلاق حدث `exit`، فستتم إزالة دالة رد النداء من سجل الإنهاء، ولن يتم استدعاؤها عند الخروج من العملية.

داخل دالة رد النداء، يمكنك تحرير الموارد التي تم تخصيصها بواسطة الكائن `ref`. كن على علم بأن جميع القيود المطبقة على حدث `beforeExit` تنطبق أيضًا على دالة `callback`، وهذا يعني أن هناك احتمالًا بأن دالة رد النداء لن يتم استدعاؤها في ظل ظروف خاصة.

الفكرة من هذه الدالة هي مساعدتك في تحرير الموارد عندما تبدأ العملية في الخروج، ولكن أيضًا السماح بجمع الكائن المهمل إذا لم يعد قيد الاستخدام.

على سبيل المثال: يمكنك تسجيل كائن يحتوي على مخزن مؤقت، وتريد التأكد من تحرير هذا المخزن المؤقت عند خروج العملية، ولكن إذا تم جمع الكائن المهمل قبل خروج العملية، فلم نعد بحاجة إلى تحرير المخزن المؤقت، لذلك في هذه الحالة نقوم ببساطة بإزالة دالة رد النداء من سجل الإنهاء.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// يرجى التأكد من أن الدالة التي تم تمريرها إلى finalization.register()
// لا تنشئ إغلاقًا حول الكائنات غير الضرورية.
function onFinalize(obj, event) {
  // يمكنك فعل ما تريد بالكائن
  obj.dispose();
}

function setup() {
  // يمكن جمع هذا الكائن بأمان،
  // ولن يتم استدعاء دالة الإيقاف الناتجة.
  // لا توجد تسريبات.
  const myDisposableObject = {
    dispose() {
      // حرر مواردك بشكل متزامن
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// يرجى التأكد من أن الدالة التي تم تمريرها إلى finalization.register()
// لا تنشئ إغلاقًا حول الكائنات غير الضرورية.
function onFinalize(obj, event) {
  // يمكنك فعل ما تريد بالكائن
  obj.dispose();
}

function setup() {
  // يمكن جمع هذا الكائن بأمان،
  // ولن يتم استدعاء دالة الإيقاف الناتجة.
  // لا توجد تسريبات.
  const myDisposableObject = {
    dispose() {
      // حرر مواردك بشكل متزامن
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

يعتمد الكود أعلاه على الافتراضات التالية:

- يتم تجنب دوال الأسهم
- يوصى بأن تكون الدوال العادية داخل السياق العام (الجذر)

الدوال العادية *يمكن أن* تشير إلى السياق الذي يعيش فيه `obj`، مما يجعل `obj` غير قابل للجمع المهمل.

ستحتفظ دوال الأسهم بالسياق السابق. على سبيل المثال:

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // حتى شيء مثل هذا غير مستحسن للغاية
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
من غير المرجح (وليس مستحيلاً) أن يتم جمع هذا الكائن المهمل، ولكن إذا لم يكن كذلك، فسيتم استدعاء `dispose` عند استدعاء `process.exit`.

كن حذرًا وتجنب الاعتماد على هذه الميزة للتخلص من الموارد الهامة، لأنه ليس مضمونًا استدعاء دالة رد النداء في جميع الظروف.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**إضافة في: v22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مرجع للمورد الذي يتم تعقبه.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد الاتصال التي سيتم استدعاؤها عند الانتهاء من المورد.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مرجع للمورد الذي يتم تعقبه.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الحدث الذي أثار الإنهاء. القيمة الافتراضية هي 'beforeExit'.
  
 

تعمل هذه الدالة تمامًا مثل `register`، باستثناء أنه سيتم استدعاء دالة رد الاتصال عندما يصدر العملية حدث `beforeExit` إذا لم يتم جمع الكائن `ref` كقمامة.

كن على علم بأن جميع القيود المطبقة على حدث `beforeExit` تنطبق أيضًا على دالة `callback`، وهذا يعني أن هناك احتمال ألا يتم استدعاء دالة رد الاتصال في ظل ظروف خاصة.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**إضافة في: v22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مرجع للمورد الذي تم تسجيله مسبقًا.

تقوم هذه الدالة بإزالة تسجيل الكائن من سجل الإنهاء، لذلك لن يتم استدعاء دالة رد الاتصال بعد الآن.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// يرجى التأكد من أن الدالة التي تم تمريرها إلى finalization.register()
// لا تنشئ إغلاقًا حول الكائنات غير الضرورية.
function onFinalize(obj, event) {
  // يمكنك فعل ما تريد بالكائن
  obj.dispose();
}

function setup() {
  // يمكن جمع هذا الكائن كقمامة بأمان،
  // ولن يتم استدعاء دالة الإغلاق الناتجة.
  // لا توجد تسريبات.
  const myDisposableObject = {
    dispose() {
      // حرر مواردك بشكل متزامن
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // افعل شيئا

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// يرجى التأكد من أن الدالة التي تم تمريرها إلى finalization.register()
// لا تنشئ إغلاقًا حول الكائنات غير الضرورية.
function onFinalize(obj, event) {
  // يمكنك فعل ما تريد بالكائن
  obj.dispose();
}

function setup() {
  // يمكن جمع هذا الكائن كقمامة بأمان،
  // ولن يتم استدعاء دالة الإغلاق الناتجة.
  // لا توجد تسريبات.
  const myDisposableObject = {
    dispose() {
      // حرر مواردك بشكل متزامن
    },
  };

  // يرجى التأكد من أن الدالة التي تم تمريرها إلى finalization.register()
  // لا تنشئ إغلاقًا حول الكائنات غير الضرورية.
  function onFinalize(obj, event) {
    // يمكنك فعل ما تريد بالكائن
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // افعل شيئا

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::

## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**أُضيف في: الإصدار v17.3.0، v16.14.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `process.getActiveResourcesInfo()` بإرجاع مصفوفة من السلاسل النصية التي تحتوي على أنواع الموارد النشطة التي تحافظ حاليًا على استمرار حلقة الأحداث.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('قبل:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('بعد:', getActiveResourcesInfo());
// طباعة:
//   قبل: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   بعد: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('قبل:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('بعد:', getActiveResourcesInfo());
// طباعة:
//   قبل: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   بعد: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**أُضيف في: الإصدار v22.3.0، v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معرّف الوحدة المضمنة المطلوبة.
- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

توفر `process.getBuiltinModule(id)` طريقة لتحميل الوحدات المضمنة في دالة متاحة عالميًا. يمكن لوحدات ES التي تحتاج إلى دعم بيئات أخرى استخدامها لتحميل وحدة Node.js المضمنة بشكل مشروط عند تشغيلها في Node.js، دون الحاجة إلى التعامل مع خطأ التحليل الذي يمكن أن يتم طرحه بواسطة `import` في بيئة غير Node.js أو الاضطرار إلى استخدام `import()` الديناميكي الذي إما أن يحول الوحدة إلى وحدة غير متزامنة، أو يحول واجهة برمجة تطبيقات متزامنة إلى واجهة برمجة تطبيقات غير متزامنة.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // التشغيل في Node.js، استخدم وحدة fs الخاصة بـ Node.js.
  const fs = globalThis.process.getBuiltinModule('fs');
  // إذا كانت `require()` مطلوبة لتحميل وحدات المستخدم، فاستخدم createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
إذا كان `id` يحدد وحدة مضمنة متاحة في عملية Node.js الحالية، فإن الطريقة `process.getBuiltinModule(id)` تُرجع الوحدة المضمنة المطابقة. إذا كان `id` لا يتوافق مع أي وحدة مضمنة، فسيتم إرجاع `undefined`.

تقبل `process.getBuiltinModule(id)` معرفات الوحدات المضمنة التي يتم التعرف عليها بواسطة [`module.isBuiltin(id)`](/ar/nodejs/api/module#moduleisbuiltinmodulename). يجب تحميل بعض الوحدات المضمنة باستخدام البادئة `node:`، راجع [الوحدات المضمنة ذات البادئة الإلزامية `node:`](/ar/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). تشير المراجع التي يتم إرجاعها بواسطة `process.getBuiltinModule(id)` دائمًا إلى الوحدة المضمنة المطابقة لـ `id` حتى إذا قام المستخدمون بتعديل [`require.cache`](/ar/nodejs/api/modules#requirecache) بحيث تُرجع `require(id)` شيئًا آخر.


## `process.getegid()` {#processgetegid}

**أُضيف في: v2.0.0**

تقوم الطريقة `process.getegid()` بإرجاع المعرّف الرقمي للمجموعة الفعّالة لعملية Node.js. (راجع [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي، ليست Windows أو Android).

## `process.geteuid()` {#processgeteuid}

**أُضيف في: v2.0.0**

- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تقوم الطريقة `process.geteuid()` بإرجاع المعرّف الرقمي للمستخدم الفعّال للعملية. (راجع [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي، ليست Windows أو Android).

## `process.getgid()` {#processgetgid}

**أُضيف في: v0.1.31**

- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تقوم الطريقة `process.getgid()` بإرجاع المعرّف الرقمي للمجموعة للعملية. (راجع [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي، ليست Windows أو Android).

## `process.getgroups()` {#processgetgroups}

**أُضيف في: v0.9.4**

- إرجاع: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم الطريقة `process.getgroups()` بإرجاع مصفوفة تحتوي على معرّفات المجموعة الإضافية. يترك POSIX الأمر غير محدد إذا كان معرّف المجموعة الفعّالة مضمنًا، لكن Node.js يضمن أنه دائمًا كذلك.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي، ليست Windows أو Android).


## `process.getuid()` {#processgetuid}

**أُضيف في:** v0.1.28

- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تُرجع الدالة `process.getuid()` الهوية الرقمية للمستخدم للعملية. (راجع [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي ليست Windows أو Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**أُضيف في:** v9.3.0

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يشير إلى ما إذا تم تعيين استدعاء باستخدام [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

## `process.hrtime([time])` {#processhrtimetime}

**أُضيف في:** v0.7.6

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم. استخدم [`process.hrtime.bigint()`](/ar/nodejs/api/process#processhrtimebigint) بدلاً من ذلك.
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) نتيجة استدعاء سابق لـ `process.hrtime()`
- الإرجاع: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

هذه هي النسخة القديمة من [`process.hrtime.bigint()`](/ar/nodejs/api/process#processhrtimebigint) قبل تقديم `bigint` في JavaScript.

تُرجع الدالة `process.hrtime()` الوقت الحقيقي عالي الدقة الحالي في `Array` ثنائي `[seconds, nanoseconds]`، حيث `nanoseconds` هو الجزء المتبقي من الوقت الحقيقي الذي لا يمكن تمثيله بدقة ثانية.

`time` هو معامل اختياري يجب أن يكون نتيجة استدعاء سابق لـ `process.hrtime()` للتمييز مع الوقت الحالي. إذا كان المعامل الذي تم تمريره ليس `Array` ثنائي، فسيتم طرح `TypeError`. سيؤدي تمرير مصفوفة معرفة من قبل المستخدم بدلاً من نتيجة استدعاء سابق لـ `process.hrtime()` إلى سلوك غير محدد.

تتعلق هذه الأوقات بوقت تعسفي في الماضي، ولا تتعلق بتوقيت اليوم وبالتالي لا تخضع لانحراف الساعة. الاستخدام الأساسي هو قياس الأداء بين الفترات الزمنية:

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**أُضيف في: الإصدار v10.7.0**

- الإرجاع: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

النسخة `bigint` من تابع [`process.hrtime()`](/ar/nodejs/api/process#processhrtimetime) تُعيد الوقت الحقيقي عالي الدقة الحالي بالنانو ثانية كـ `bigint`.

على عكس [`process.hrtime()`](/ar/nodejs/api/process#processhrtimetime)، لا يدعم وسيط `time` إضافي لأن الفرق يمكن حسابه مباشرةً عن طريق طرح `bigint`s الاثنين.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**أُضيف في: الإصدار v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم المستخدم أو المعرف الرقمي.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم المجموعة أو المعرف الرقمي.

يقرأ التابع `process.initgroups()` الملف `/etc/group` ويهيئ قائمة الوصول إلى المجموعة، باستخدام جميع المجموعات التي يكون المستخدم عضوًا فيها. هذه عملية مميزة تتطلب أن يكون لدى عملية Node.js إما وصول `root` أو قدرة `CAP_SETGID`.

توخى الحذر عند إسقاط الامتيازات:

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي ليست Windows أو Android). هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) النصية.


## ‏`process.kill(pid[, signal])` {#processkillpid-signal}

**أُضيف في: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف العملية (Process ID).
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإشارة المراد إرسالها، إما كسلسلة نصية أو كرقم. **الافتراضي:** `'SIGTERM'`.

تقوم الطريقة `process.kill()` بإرسال `signal` إلى العملية التي تم تحديدها بواسطة `pid`.

أسماء الإشارات هي سلاسل نصية مثل `'SIGINT'` أو `'SIGHUP'`. راجع [أحداث الإشارة](/ar/nodejs/api/process#signal-events) و [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) لمزيد من المعلومات.

ستُصدر هذه الطريقة خطأً إذا كان `pid` الهدف غير موجود. كحالة خاصة، يمكن استخدام إشارة `0` لاختبار وجود عملية. ستُصدر منصات Windows خطأً إذا تم استخدام `pid` لإنهاء مجموعة عمليات.

على الرغم من أن اسم هذه الوظيفة هو `process.kill()`، إلا أنها مجرد مرسل إشارة، مثل استدعاء نظام `kill`. قد تفعل الإشارة المرسلة شيئًا آخر غير إنهاء العملية المستهدفة.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('تم تلقي إشارة SIGHUP.');
});

setTimeout(() => {
  console.log('جارٍ الخروج.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('تم تلقي إشارة SIGHUP.');
});

setTimeout(() => {
  console.log('جارٍ الخروج.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

عندما تتلقى عملية Node.js الإشارة `SIGUSR1`، سيبدأ Node.js المصحح. راجع [أحداث الإشارة](/ar/nodejs/api/process#signal-events).

## ‏`process.loadEnvFile(path)` {#processloadenvfilepath}

**أُضيف في: v21.7.0, v20.12.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) 1 - تطوير نشط
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **الافتراضي:** `'./.env'`

يقوم بتحميل ملف `.env` إلى `process.env`. لن يكون لاستخدام `NODE_OPTIONS` في ملف `.env` أي تأثير على Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**أُضيف في: v0.1.17**

**تم الإيقاف منذ: v14.0.0**

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل: استخدم [`require.main`](/ar/nodejs/api/modules#accessing-the-main-module) بدلاً من ذلك.
:::

- [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

توفر الخاصية `process.mainModule` طريقة بديلة لاسترداد [`require.main`](/ar/nodejs/api/modules#accessing-the-main-module). الفرق هو أنه إذا تغير الوحدة الرئيسية في وقت التشغيل، فقد لا يزال [`require.main`](/ar/nodejs/api/modules#accessing-the-main-module) يشير إلى الوحدة الرئيسية الأصلية في الوحدات التي تم طلبها قبل حدوث التغيير. بشكل عام، من الآمن افتراض أن الاثنين يشيران إلى نفس الوحدة.

كما هو الحال مع [`require.main`](/ar/nodejs/api/modules#accessing-the-main-module)، سيكون `process.mainModule` غير معرف (`undefined`) إذا لم يكن هناك نص إدخال.

## `process.memoryUsage()` {#processmemoryusage}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.9.0, v12.17.0 | تمت إضافة `arrayBuffers` إلى الكائن المرجع. |
| v7.2.0 | تمت إضافة `external` إلى الكائن المرجع. |
| v0.1.16 | أُضيف في: v0.1.16 |
:::

- الإرجاع: [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع كائن يصف استخدام الذاكرة لعملية Node.js مقاسة بالبايت.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// يطبع:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// يطبع:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- يشير `heapTotal` و `heapUsed` إلى استخدام V8 للذاكرة.
- يشير `external` إلى استخدام الذاكرة لكائنات C ++ المرتبطة بكائنات JavaScript التي تديرها V8.
- `rss`، حجم المجموعة المقيمة، هو مقدار المساحة المشغولة في جهاز الذاكرة الرئيسية (وهو عبارة عن مجموعة فرعية من إجمالي الذاكرة المخصصة) للعملية، بما في ذلك جميع كائنات وأكواد C ++ و JavaScript.
- يشير `arrayBuffers` إلى الذاكرة المخصصة لـ `ArrayBuffer` و `SharedArrayBuffer`، بما في ذلك جميع [`Buffer`](/ar/nodejs/api/buffer) s الخاصة بـ Node.js. يتم تضمين هذا أيضًا في قيمة `external`. عند استخدام Node.js كمكتبة مضمنة، قد تكون هذه القيمة `0` لأنه قد لا يتم تتبع تخصيصات `ArrayBuffer` في هذه الحالة.

عند استخدام سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، سيكون `rss` قيمة صالحة للعملية بأكملها، بينما تشير الحقول الأخرى فقط إلى السلسلة الحالية.

تكرر طريقة `process.memoryUsage()` على كل صفحة لجمع معلومات حول استخدام الذاكرة مما قد يكون بطيئًا اعتمادًا على تخصيصات ذاكرة البرنامج.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**أضيف في: v15.6.0, v14.18.0**

- الإرجاع: [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم الطريقة `process.memoryUsage.rss()` بإرجاع عدد صحيح يمثل حجم مجموعة المقيم (Resident Set Size (RSS)) بالبايت.

حجم مجموعة المقيم هو مقدار المساحة المشغولة في جهاز الذاكرة الرئيسية (وهو مجموعة فرعية من إجمالي الذاكرة المخصصة) للعملية، بما في ذلك جميع كائنات ورموز C++ وJavaScript.

هذه هي نفس قيمة الخاصية `rss` التي توفرها `process.memoryUsage()` ولكن `process.memoryUsage.rss()` أسرع.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.7.0, v20.18.0 | تم تغيير الاستقرار إلى قديم. |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v1.8.1 | الوسيطات الإضافية بعد `callback` مدعومة الآن. |
| v0.1.26 | أضيف في: v0.1.26 |
:::

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`queueMicrotask()`](/ar/nodejs/api/globals#queuemicrotaskcallback) بدلاً من ذلك.
:::

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسيطات إضافية لتمريرها عند استدعاء `callback`

`process.nextTick()` يضيف `callback` إلى "قائمة الانتظار التالية". يتم تفريغ هذه القائمة بالكامل بعد انتهاء العملية الحالية في مكدس JavaScript وقبل السماح لحلقة الأحداث بالاستمرار. من الممكن إنشاء حلقة لا نهائية إذا استدعى المرء `process.nextTick()` بشكل متكرر. راجع دليل [حلقة الأحداث](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) لمزيد من المعلومات الأساسية.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

هذا مهم عند تطوير واجهات برمجة التطبيقات لمنح المستخدمين الفرصة لتعيين معالجات الأحداث *بعد* إنشاء كائن ولكن قبل حدوث أي إدخال/إخراج:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() gets called now, not before.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() gets called now, not before.
```
:::

من المهم جدًا أن تكون واجهات برمجة التطبيقات إما متزامنة بنسبة 100٪ أو غير متزامنة بنسبة 100٪. ضع في اعتبارك هذا المثال:

```js [ESM]
// تحذير! لا تستخدم! خطر غير آمن سيئ!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
واجهة برمجة التطبيقات هذه خطيرة لأنه في الحالة التالية:

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
ليس من الواضح ما إذا كانت `foo()` أو `bar()` سيتم استدعاؤها أولاً.

النهج التالي أفضل بكثير:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### متى تستخدم `queueMicrotask()` مقابل `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

تعتبر واجهة برمجة التطبيقات [`queueMicrotask()`](/ar/nodejs/api/globals#queuemicrotaskcallback) بديلاً لـ `process.nextTick()` التي تؤجل أيضًا تنفيذ وظيفة باستخدام نفس قائمة المهام الدقيقة المستخدمة لتنفيذ معالجات then و catch و finally للوعود التي تم حلها. داخل Node.js، في كل مرة يتم فيها استنزاف "قائمة التكتكة التالية"، يتم استنزاف قائمة المهام الدقيقة مباشرة بعد ذلك.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

بالنسبة *لمعظم* حالات استخدام المستخدم، توفر واجهة برمجة التطبيقات `queueMicrotask()` آلية محمولة وموثوقة لتأجيل التنفيذ والتي تعمل عبر بيئات منصات JavaScript المتعددة ويجب تفضيلها على `process.nextTick()`. في السيناريوهات البسيطة، يمكن أن يكون `queueMicrotask()` بديلاً مباشرًا لـ `process.nextTick()`.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
أحد الاختلافات الجديرة بالذكر بين واجهتي برمجة التطبيقات هو أن `process.nextTick()` يسمح بتحديد قيم إضافية سيتم تمريرها كوسائط إلى الوظيفة المؤجلة عند استدعائها. يتطلب تحقيق نفس النتيجة باستخدام `queueMicrotask()` استخدام إما إغلاق أو وظيفة مرتبطة:

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
هناك اختلافات طفيفة في الطريقة التي يتم بها التعامل مع الأخطاء التي تثار من داخل قائمة التكتكة التالية وقائمة المهام الدقيقة. يجب التعامل مع الأخطاء التي يتم طرحها داخل معاودة الاتصال المدارة في قائمة المهام الدقيقة داخل معاودة الاتصال المدارة عند الإمكان. إذا لم يكن الأمر كذلك، يمكن استخدام معالج الحدث `process.on('uncaughtException')` لالتقاط الأخطاء والتعامل معها.

عند الشك، ما لم تكن هناك حاجة إلى القدرات المحددة لـ `process.nextTick()`، استخدم `queueMicrotask()`.


## `process.noDeprecation` {#processnodeprecation}

**أضيف في: الإصدار v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تشير الخاصية `process.noDeprecation` إلى ما إذا كانت علامة `--no-deprecation` مُعيَّنة في عملية Node.js الحالية. راجع الوثائق الخاصة بـ [`'warning'` event](/ar/nodejs/api/process#event-warning) و [`emitWarning()` method](/ar/nodejs/api/process#processemitwarningwarning-type-code-ctor) لمزيد من المعلومات حول سلوك هذه العلامة.

## `process.permission` {#processpermission}

**أضيف في: الإصدار v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تتوفر واجهة برمجة التطبيقات هذه من خلال علامة [`--permission`](/ar/nodejs/api/cli#--permission).

`process.permission` هو كائن تُستخدم أساليبه لإدارة الأذونات للعملية الحالية. تتوفر وثائق إضافية في [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model).

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**أضيف في: الإصدار v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتحقق مما إذا كانت العملية قادرة على الوصول إلى النطاق والمرجع المحددين. إذا لم يتم توفير أي مرجع، فسيتم افتراض نطاق عام، على سبيل المثال، سيتحقق `process.permission.has('fs.read')` مما إذا كانت العملية لديها جميع أذونات قراءة نظام الملفات.

للمرجع معنى بناءً على النطاق المقدم. على سبيل المثال، يعني المرجع عندما يكون النطاق هو نظام الملفات الملفات والمجلدات.

النطاقات المتاحة هي:

- `fs` - نظام الملفات بالكامل
- `fs.read` - عمليات قراءة نظام الملفات
- `fs.write` - عمليات كتابة نظام الملفات
- `child` - عمليات إنشاء عمليات فرعية
- `worker` - عملية إنشاء مؤشر ترابط عامل

```js [ESM]
// تحقق مما إذا كانت العملية لديها إذن لقراءة ملف README
process.permission.has('fs.read', './README.md');
// تحقق مما إذا كانت العملية لديها عمليات إذن قراءة
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**أُضيف في: v0.1.15**

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ترجع الخاصية `process.pid` معرّف العملية (PID) للعملية.

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`This process is pid ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`This process is pid ${pid}`);
```
:::

## `process.platform` {#processplatform}

**أُضيف في: v0.1.16**

- [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ترجع الخاصية `process.platform` سلسلة نصية تحدد نظام التشغيل الذي تم تجميع ثنائي Node.js من أجله.

القيم الممكنة حاليًا هي:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`

::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`This platform is ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`This platform is ${platform}`);
```
:::

قد يتم إرجاع القيمة `'android'` أيضًا إذا تم بناء Node.js على نظام التشغيل Android. ومع ذلك ، فإن دعم Android في Node.js [تجريبي](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**أُضيف في: v9.2.0, v8.10.0, v6.13.0**

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ترجع الخاصية `process.ppid` معرّف العملية (PID) للعملية الأم للعملية الحالية.

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`The parent process is pid ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`The parent process is pid ${ppid}`);
```
:::

## `process.release` {#processrelease}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v4.2.0 | دعم الخاصية `lts` الآن. |
| v3.0.0 | أُضيف في: v3.0.0 |
:::

- [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ترجع الخاصية `process.release` `كائن` يحتوي على بيانات وصفية متعلقة بالإصدار الحالي، بما في ذلك عناوين URL لملف المصدر المضغوط وملف الرؤوس فقط المضغوط.

يحتوي `process.release` على الخصائص التالية:

- `name` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قيمة ستكون دائمًا `'node'`.
- `sourceUrl` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL مطلق يشير إلى ملف *<code>.tar.gz</code>* يحتوي على الكود المصدري للإصدار الحالي.
- `headersUrl` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL مطلق يشير إلى ملف *<code>.tar.gz</code>* يحتوي فقط على ملفات رؤوس المصدر للإصدار الحالي. هذا الملف أصغر بكثير من ملف المصدر الكامل ويمكن استخدامه لتجميع الإضافات الأصلية لـ Node.js.
- `libUrl` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<غير معرف\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) عنوان URL مطلق يشير إلى ملف *<code>node.lib</code>* يطابق بنية ومع إصدار الإصدار الحالي. يتم استخدام هذا الملف لتجميع الإضافات الأصلية لـ Node.js. *هذه الخاصية موجودة فقط في إصدارات Windows من Node.js وستكون مفقودة على جميع الأنظمة الأساسية الأخرى.*
- `lts` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<غير معرف\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) تسمية سلسلة تحدد تسمية [LTS](https://github.com/nodejs/Release) لهذا الإصدار. توجد هذه الخاصية فقط لإصدارات LTS وهي `غير معرفة` لجميع أنواع الإصدارات الأخرى، بما في ذلك إصدارات *الحالية*. تتضمن القيم الصالحة أسماء رمز إصدار LTS (بما في ذلك تلك التي لم تعد مدعومة).
    - `'Fermium'` لخط 14.x LTS بدءًا من 14.15.0.
    - `'Gallium'` لخط 16.x LTS بدءًا من 16.13.0.
    - `'Hydrogen'` لخط 18.x LTS بدءًا من 18.12.0. بالنسبة لأسماء رموز إصدار LTS الأخرى، راجع [أرشيف سجل تغييرات Node.js](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
في الإصدارات المخصصة من إصدارات غير الإصدار من شجرة المصدر، قد تكون خاصية `name` فقط موجودة. لا ينبغي الاعتماد على الخصائص الإضافية لتكون موجودة.


## `process.report` {#processreport}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.12.0, v12.17.0 | لم تعد هذه الواجهة التجريبية. |
| الإصدار v11.8.0 | أُضيفت في: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` هو كائن تُستخدم طرقه لإنشاء تقارير تشخيصية للعملية الحالية. تتوفر وثائق إضافية في [وثائق التقارير](/ar/nodejs/api/report).

### `process.report.compact` {#processreportcompact}

**أُضيفت في: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

اكتب التقارير بتنسيق مضغوط، JSON أحادي السطر، يمكن لأنظمة معالجة السجلات استهلاكه بسهولة أكبر من التنسيق الافتراضي متعدد الأسطر المصمم للاستهلاك البشري.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`هل التقارير مضغوطة؟ ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`هل التقارير مضغوطة؟ ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.12.0, v12.17.0 | لم تعد هذه الواجهة التجريبية. |
| الإصدار v11.12.0 | أُضيفت في: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الدليل الذي تتم فيه كتابة التقرير. القيمة الافتراضية هي سلسلة فارغة، مما يشير إلى أن التقارير تُكتب في دليل العمل الحالي لعملية Node.js.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`دليل التقرير هو ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`دليل التقرير هو ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.12.0, v12.17.0 | لم تعد هذه الواجهة التجريبية. |
| الإصدار v11.12.0 | أُضيفت في: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم الملف الذي تتم فيه كتابة التقرير. إذا تم تعيينه على سلسلة فارغة، فسيتكون اسم ملف الإخراج من طابع زمني ومعرف العملية (PID) ورقم تسلسلي. القيمة الافتراضية هي سلسلة فارغة.

إذا تم تعيين قيمة `process.report.filename` إلى `'stdout'` أو `'stderr'`، فسيتم كتابة التقرير إلى stdout أو stderr للعملية على التوالي.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`اسم ملف التقرير هو ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`اسم ملف التقرير هو ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v13.12.0, v12.17.0 | لم تعد هذه الواجهة التجريبية. |
| v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) خطأ مخصص يستخدم للإبلاغ عن مكدس JavaScript.
- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع تمثيل كائن JavaScript لتقرير تشخيصي للعملية قيد التشغيل. يتم أخذ تتبع مكدس JavaScript الخاص بالتقرير من `err`، إذا كان موجودًا.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// مشابه لـ process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// مشابه لـ process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

تتوفر وثائق إضافية في [وثائق التقارير](/ar/nodejs/api/report).

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v15.0.0, v14.17.0 | لم تعد هذه الواجهة التجريبية. |
| v11.12.0 | تمت الإضافة في: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت `true`، يتم إنشاء تقرير تشخيصي عن الأخطاء الفادحة، مثل أخطاء نفاد الذاكرة أو تأكيدات C++ الفاشلة.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v13.12.0, v12.17.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| v11.12.0 | تمت الإضافة في: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة `true`، يتم إنشاء تقرير تشخيصي عندما تتلقى العملية الإشارة المحددة بواسطة `process.report.signal`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on signal: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on signal: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v13.12.0, v12.17.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| v11.12.0 | تمت الإضافة في: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة `true`، يتم إنشاء تقرير تشخيصي عند وقوع استثناء غير ملتقط.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**تمت الإضافة في: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة `true`، يتم إنشاء تقرير تشخيصي بدون متغيرات البيئة.

### `process.report.signal` {#processreportsignal}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v13.12.0, v12.17.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| v11.12.0 | تمت الإضافة في: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الإشارة المستخدمة لتشغيل إنشاء تقرير تشخيصي. القيمة الافتراضية هي `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report signal: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report signal: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.12.0, v12.17.0 | واجهة برمجة التطبيقات هذه لم تعد تجريبية. |
| v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

-  `filename` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الملف حيث يتم كتابة التقرير. يجب أن يكون هذا مسارًا نسبيًا، سيتم إلحاقه بالدليل المحدد في `process.report.directory`، أو دليل العمل الحالي لعملية Node.js، إذا لم يتم تحديده.
-  `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) خطأ مخصص يستخدم للإبلاغ عن مكدس JavaScript.
-  الإرجاع: [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إرجاع اسم ملف التقرير الذي تم إنشاؤه.

يكتب تقرير تشخيصي إلى ملف. إذا لم يتم توفير `filename`، يتضمن اسم الملف الافتراضي التاريخ والوقت ومعرف العملية ورقم تسلسلي. يتم أخذ تتبع مكدس JavaScript للتقرير من `err`، إذا كان موجودًا.

إذا تم تعيين قيمة `filename` على `'stdout'` أو `'stderr'`، تتم كتابة التقرير إلى stdout أو stderr للعملية على التوالي.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

تتوفر وثائق إضافية في [وثائق التقرير](/ar/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**تمت الإضافة في: v12.6.0**

- الإرجاع: [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) استخدام الموارد للعملية الحالية. تأتي كل هذه القيم من استدعاء `uv_getrusage` الذي يُرجع [`uv_rusage_t struct`](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t).
    - `userCPUTime` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_utime` المحسوب بالميكروثانية. وهي نفس قيمة [`process.cpuUsage().user`](/ar/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_stime` المحسوب بالميكروثانية. وهي نفس قيمة [`process.cpuUsage().system`](/ar/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_maxrss` وهو الحد الأقصى لحجم مجموعة المقيمين المستخدم بالكيلوبايت.
    - `sharedMemorySize` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_ixrss` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `unsharedDataSize` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_idrss` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `unsharedStackSize` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_isrss` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `minorPageFault` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_minflt` وهو عدد أخطاء الصفحة الثانوية للعملية، راجع [هذا المقال لمزيد من التفاصيل](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_majflt` وهو عدد أخطاء الصفحة الرئيسية للعملية، راجع [هذا المقال لمزيد من التفاصيل](https://en.wikipedia.org/wiki/Page_fault#Major). هذا الحقل غير مدعوم على نظام التشغيل Windows.
    - `swappedOut` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_nswap` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `fsRead` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_inblock` وهو عدد المرات التي اضطر فيها نظام الملفات إلى إجراء الإدخال.
    - `fsWrite` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_oublock` وهو عدد المرات التي اضطر فيها نظام الملفات إلى إجراء الإخراج.
    - `ipcSent` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_msgsnd` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `ipcReceived` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_msgrcv` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `signalsCount` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_nsignals` ولكنه غير مدعوم من قبل أي نظام أساسي.
    - `voluntaryContextSwitches` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_nvcsw` وهو عدد المرات التي نتج فيها تبديل سياق وحدة المعالجة المركزية بسبب تخلي العملية طواعية عن المعالج قبل اكتمال شريحة الوقت الخاصة بها (عادةً لانتظار توفر مورد). هذا الحقل غير مدعوم على نظام التشغيل Windows.
    - `involuntaryContextSwitches` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين إلى `ru_nivcsw` وهو عدد المرات التي نتج فيها تبديل سياق وحدة المعالجة المركزية بسبب عملية ذات أولوية أعلى أصبحت قابلة للتشغيل أو لأن العملية الحالية تجاوزت شريحة الوقت الخاصة بها. هذا الحقل غير مدعوم على نظام التشغيل Windows.

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::

## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**إضافة في: الإصدار v0.5.9**

- `message` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/ar/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)
- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يستخدم لتحديد معلمات إرسال أنواع معينة من المقابض. يدعم `options` الخصائص التالية:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) قيمة يمكن استخدامها عند تمرير مثيلات `net.Socket`. عندما تكون `true`، يتم إبقاء المقبس مفتوحًا في عملية الإرسال. **الافتراضي:** `false`.


- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا تم إنشاء Node.js بقناة IPC، يمكن استخدام طريقة `process.send()` لإرسال رسائل إلى العملية الأصل. سيتم استقبال الرسائل كحدث [`'message'`](/ar/nodejs/api/child_process#event-message) على كائن [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess) الخاص بالأصل.

إذا لم يتم إنشاء Node.js بقناة IPC، فسيكون `process.send` غير معرف (`undefined`).

تخضع الرسالة للتسلسل والتحليل. قد لا تكون الرسالة الناتجة هي نفسها التي تم إرسالها في الأصل.

## `process.setegid(id)` {#processsetegidid}

**إضافة في: الإصدار v2.0.0**

- `id` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم المجموعة أو المعرف

تقوم طريقة `process.setegid()` بتعيين هوية المجموعة الفعالة للعملية. (انظر [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) يمكن تمرير `id` إما كمعرف رقمي أو كسلسلة نصية لاسم المجموعة. إذا تم تحديد اسم المجموعة، فستقوم هذه الطريقة بالتعطيل أثناء حل المعرف الرقمي المرتبط.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

هذه الوظيفة متاحة فقط على منصات POSIX (أي ليست Windows أو Android). هذه الميزة غير متاحة في سلاسل رسائل [`Worker`](/ar/nodejs/api/worker_threads#class-worker).


## `process.seteuid(id)` {#processseteuidid}

**أُضيف في: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم المستخدم أو المعرّف

تضبط الطريقة `process.seteuid()` هوية المستخدم الفعالة للعملية. (راجع [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) يمكن تمرير `id` إما كمعرف رقمي أو كسلسلة اسم مستخدم. إذا تم تحديد اسم مستخدم، فإن الطريقة تحظر أثناء حل المعرف الرقمي المرتبط.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

هذه الوظيفة متاحة فقط على منصات POSIX (أي ليست Windows أو Android). هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) .

## `process.setgid(id)` {#processsetgidid}

**أُضيف في: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم المجموعة أو المعرّف

تضبط الطريقة `process.setgid()` هوية المجموعة للعملية. (راجع [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) يمكن تمرير `id` إما كمعرف رقمي أو كسلسلة اسم المجموعة. إذا تم تحديد اسم مجموعة، فإن هذه الطريقة تحظر أثناء حل المعرف الرقمي المرتبط.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

هذه الوظيفة متاحة فقط على منصات POSIX (أي ليست Windows أو Android). هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) .


## `process.setgroups(groups)` {#processsetgroupsgroups}

**أُضيف في: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم الطريقة `process.setgroups()` بتعيين مُعرّفات المجموعة التكميلية لعملية Node.js. هذه عملية ذات امتيازات تتطلب أن يكون لعملية Node.js `root` أو القدرة `CAP_SETGID`.

يمكن أن تحتوي مصفوفة `groups` على مُعرّفات مجموعات رقمية أو أسماء مجموعات أو كليهما.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي ليست Windows أو Android). هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker).

## `process.setuid(id)` {#processsetuidid}

**أُضيف في: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `process.setuid(id)` بتعيين هوية المستخدم للعملية. (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) يمكن تمرير `id` إما كمُعرّف رقمي أو كسلسلة اسم مستخدم. إذا تم تحديد اسم مستخدم، فستتوقف الطريقة أثناء تحليل المُعرّف الرقمي المرتبط.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

هذه الدالة متاحة فقط على منصات POSIX (أي ليست Windows أو Android). هذه الميزة غير متوفرة في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker).


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**تمت الإضافة في: v16.6.0، v14.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تقوم هذه الدالة بتمكين أو تعطيل دعم [خريطة المصدر v3](https://sourcemaps.info/spec) لتتبعات المكدس.

إنها توفر نفس الميزات مثل تشغيل عملية Node.js مع خيارات سطر الأوامر `--enable-source-maps`.

سيتم تحليل وتحميل خرائط المصدر فقط في ملفات JavaScript التي يتم تحميلها بعد تمكين خرائط المصدر.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**تمت الإضافة في: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

تقوم الدالة `process.setUncaughtExceptionCaptureCallback()` بتعيين دالة سيتم استدعاؤها عند حدوث استثناء غير معالج، والتي ستتلقى قيمة الاستثناء نفسها كمعاملها الأول.

إذا تم تعيين مثل هذه الدالة، فلن يتم إصدار حدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception). إذا تم تمرير `--abort-on-uncaught-exception` من سطر الأوامر أو تم تعيينه من خلال [`v8.setFlagsFromString()`](/ar/nodejs/api/v8#v8setflagsfromstringflags)، فلن يتم إنهاء العملية. ستتأثر الإجراءات التي تم تكوينها لاتخاذها بشأن الاستثناءات مثل إنشاء التقارير أيضًا

لإلغاء تعيين دالة الالتقاط، يمكن استخدام `process.setUncaughtExceptionCaptureCallback(null)`. استدعاء هذه الطريقة مع وسيطة غير `null` أثناء تعيين دالة التقاط أخرى سيؤدي إلى طرح خطأ.

استخدام هذه الدالة حصريًا مع استخدام الوحدة المدمجة المهملة [`domain`](/ar/nodejs/api/domain).

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**تمت الإضافة في: v20.7.0، v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تعرض الخاصية `process.sourceMapsEnabled` ما إذا كان دعم [خريطة المصدر v3](https://sourcemaps.info/spec) لتتبعات المكدس ممكنًا.


## `process.stderr` {#processstderr}

- [\<Stream\>](/ar/nodejs/api/stream#stream)

تعرض الخاصية `process.stderr` دفقًا متصلًا بـ `stderr` (fd `2`). إنه [`net.Socket`](/ar/nodejs/api/net#class-netsocket) (وهو دفق [Duplex](/ar/nodejs/api/stream#duplex-and-transform-streams)) ما لم يشر fd `2` إلى ملف، وفي هذه الحالة يكون دفق [Writable](/ar/nodejs/api/stream#writable-streams).

يختلف `process.stderr` عن تدفقات Node.js الأخرى بطرق مهمة. راجع [ملاحظة حول إدخال/إخراج العمليات](/ar/nodejs/api/process#a-note-on-process-io) لمزيد من المعلومات.

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تشير هذه الخاصية إلى قيمة واصف الملف الأساسي لـ `process.stderr`. القيمة ثابتة عند `2`. في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، هذا الحقل غير موجود.

## `process.stdin` {#processstdin}

- [\<Stream\>](/ar/nodejs/api/stream#stream)

تعرض الخاصية `process.stdin` دفقًا متصلًا بـ `stdin` (fd `0`). إنه [`net.Socket`](/ar/nodejs/api/net#class-netsocket) (وهو دفق [Duplex](/ar/nodejs/api/stream#duplex-and-transform-streams)) ما لم يشر fd `0` إلى ملف، وفي هذه الحالة يكون دفق [Readable](/ar/nodejs/api/stream#readable-streams).

للحصول على تفاصيل حول كيفية القراءة من `stdin`، راجع [`readable.read()`](/ar/nodejs/api/stream#readablereadsize).

كدفق [Duplex](/ar/nodejs/api/stream#duplex-and-transform-streams)، يمكن أيضًا استخدام `process.stdin` في الوضع "القديم" المتوافق مع البرامج النصية المكتوبة لـ Node.js قبل الإصدار v0.10. لمزيد من المعلومات، راجع [توافق الدفق](/ar/nodejs/api/stream#compatibility-with-older-nodejs-versions).

في وضع التدفقات "القديمة"، يتم إيقاف دفق `stdin` مؤقتًا بشكل افتراضي، لذلك يجب على المرء استدعاء `process.stdin.resume()` للقراءة منه. لاحظ أيضًا أن استدعاء `process.stdin.resume()` نفسه سيحول الدفق إلى الوضع "القديم".

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تشير هذه الخاصية إلى قيمة واصف الملف الأساسي لـ `process.stdin`. القيمة ثابتة عند `0`. في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، هذا الحقل غير موجود.


## `process.stdout` {#processstdout}

- [\<Stream\>](/ar/nodejs/api/stream#stream)

تعيد الخاصية `process.stdout` دفقًا متصلًا بـ `stdout` (موصّف الملف `1`). وهو [`net.Socket`](/ar/nodejs/api/net#class-netsocket) (وهو دفق [مزدوج](/ar/nodejs/api/stream#duplex-and-transform-streams)) ما لم يكن موصّف الملف `1` يشير إلى ملف، وفي هذه الحالة يكون دفق [قابل للكتابة](/ar/nodejs/api/stream#writable-streams).

على سبيل المثال، لنسخ `process.stdin` إلى `process.stdout`:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

يختلف `process.stdout` عن دفقات Node.js الأخرى بطرق مهمة. راجع [ملاحظة حول إدخال/إخراج العملية](/ar/nodejs/api/process#a-note-on-process-io) لمزيد من المعلومات.

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تشير هذه الخاصية إلى قيمة موصّف الملف الأساسي لـ `process.stdout`. القيمة ثابتة عند `1`. في سلاسل [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، لا يوجد هذا الحقل.

### ملاحظة حول إدخال/إخراج العملية {#a-note-on-process-i/o}

يختلف `process.stdout` و `process.stderr` عن دفقات Node.js الأخرى بطرق مهمة:

توجد هذه السلوكيات جزئيًا لأسباب تاريخية، حيث أن تغييرها سيخلق عدم توافق مع الإصدارات السابقة، ولكن يتوقعها أيضًا بعض المستخدمين.

تتجنب الكتابات المتزامنة مشاكل مثل تداخل الإخراج المكتوب باستخدام `console.log()` أو `console.error()` بشكل غير متوقع، أو عدم كتابته على الإطلاق إذا تم استدعاء `process.exit()` قبل اكتمال الكتابة غير المتزامنة. راجع [`process.exit()`](/ar/nodejs/api/process#processexitcode) لمزيد من المعلومات.

*<strong>تحذير</strong>*: تحظر الكتابات المتزامنة حلقة الأحداث حتى تكتمل الكتابة. يمكن أن يكون هذا فوريًا تقريبًا في حالة الإخراج إلى ملف، ولكن في ظل حمل النظام العالي، أو الأنابيب التي لا تتم قراءتها في الطرف المتلقي، أو مع المحطات الطرفية أو أنظمة الملفات البطيئة، من الممكن حظر حلقة الأحداث غالبًا ولفترة كافية لإحداث تأثيرات سلبية كبيرة على الأداء. قد لا تكون هذه مشكلة عند الكتابة إلى جلسة طرفية تفاعلية، ولكن ضع في اعتبارك هذا الأمر بعناية خاصة عند إجراء تسجيل الإنتاج في دفقات إخراج العملية.

للتحقق مما إذا كان الدفق متصلاً بسياق [TTY](/ar/nodejs/api/tty#tty)، تحقق من الخاصية `isTTY`.

على سبيل المثال:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
راجع وثائق [TTY](/ar/nodejs/api/tty#tty) لمزيد من المعلومات.


## `process.throwDeprecation` {#processthrowdeprecation}

**تمت إضافته في: الإصدار v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تشير القيمة الأولية لـ `process.throwDeprecation` إلى ما إذا كانت علامة `--throw-deprecation` مضبوطة على عملية Node.js الحالية. `process.throwDeprecation` قابلة للتغيير، لذلك قد يتم تغيير ما إذا كانت تحذيرات الإهمال تؤدي إلى أخطاء أم لا في وقت التشغيل. راجع الوثائق الخاصة بـ [`'warning'` event](/ar/nodejs/api/process#event-warning) و [`emitWarning()` method](/ar/nodejs/api/process#processemitwarningwarning-type-code-ctor) لمزيد من المعلومات.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**تمت إضافته في: الإصدار v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ترجع خاصية `process.title` عنوان العملية الحالي (أي ترجع القيمة الحالية لـ `ps`). يؤدي تعيين قيمة جديدة لـ `process.title` إلى تعديل القيمة الحالية لـ `ps`.

عند تعيين قيمة جديدة، ستفرض الأنظمة الأساسية المختلفة قيودًا مختلفة على الحد الأقصى لطول العنوان. عادة ما تكون هذه القيود محدودة للغاية. على سبيل المثال، في Linux و macOS، يقتصر `process.title` على حجم اسم الملف الثنائي بالإضافة إلى طول وسيطات سطر الأوامر لأن تعيين `process.title` يستبدل ذاكرة `argv` الخاصة بالعملية. سمح Node.js v0.8 بسلاسل عنوان عملية أطول عن طريق استبدال ذاكرة `environ` أيضًا، ولكن ذلك كان يحتمل أن يكون غير آمن ومربكًا في بعض الحالات (الغامضة إلى حد ما).

قد لا يؤدي تعيين قيمة لـ `process.title` إلى الحصول على تسمية دقيقة داخل تطبيقات إدارة العمليات مثل macOS Activity Monitor أو Windows Services Manager.


## `process.traceDeprecation` {#processtracedeprecation}

**تمت الإضافة في: الإصدار v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تشير خاصية `process.traceDeprecation` إلى ما إذا كانت العلامة `--trace-deprecation` معينة في عملية Node.js الحالية. راجع الوثائق الخاصة بـ [`'warning'` event](/ar/nodejs/api/process#event-warning) و [`emitWarning()` method](/ar/nodejs/api/process#processemitwarningwarning-type-code-ctor) لمزيد من المعلومات حول سلوك هذه العلامة.

## `process.umask()` {#processumask}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0, v12.19.0 | استدعاء `process.umask()` بدون وسيطات تم إهماله. |
| v0.1.19 | تمت الإضافة في: الإصدار v0.1.19 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. استدعاء `process.umask()` بدون وسيطة يتسبب في كتابة umask على مستوى العملية مرتين. يؤدي هذا إلى حدوث حالة سباق بين الخيوط، وهو ثغرة أمنية محتملة. لا يوجد بديل آمن ومنصة شاملة لواجهة برمجة التطبيقات API.
:::

`process.umask()` ترجع قناع إنشاء وضع ملف عملية Node.js. ترث العمليات الفرعية القناع من العملية الأصل.

## `process.umask(mask)` {#processumaskmask}

**تمت الإضافة في: الإصدار v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` تعيين قناع إنشاء وضع ملف عملية Node.js. ترث العمليات الفرعية القناع من العملية الأصل. تُرجع القناع السابق.

::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

في خيوط [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، سيؤدي `process.umask(mask)` إلى طرح استثناء.


## `process.uptime()` {#processuptime}

**أضيف في: v0.5.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم الطريقة `process.uptime()` بإرجاع عدد الثواني التي استغرقها تشغيل عملية Node.js الحالية.

تتضمن القيمة المرجعة كسورًا من الثانية. استخدم `Math.floor()` للحصول على ثوانٍ كاملة.

## `process.version` {#processversion}

**أضيف في: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحتوي الخاصية `process.version` على سلسلة إصدار Node.js.

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

للحصول على سلسلة الإصدار بدون *v* الملحقة، استخدم `process.versions.node`.

## `process.versions` {#processversions}

::: info [History]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | تتضمن الآن الخاصية `v8` لاحقة خاصة بـ Node.js. |
| v4.2.0 | الخاصية `icu` مدعومة الآن. |
| v0.2.0 | أضيف في: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تقوم الخاصية `process.versions` بإرجاع كائن يسرد سلاسل إصدار Node.js وتبعياته. يشير `process.versions.modules` إلى إصدار ABI الحالي، والذي يزداد كلما تغيرت واجهة برمجة تطبيقات C++. سيرفض Node.js تحميل الوحدات التي تم تجميعها مقابل إصدار ABI مختلف للوحدة النمطية.

::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

سينشئ كائنًا مشابهًا لـ:

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```


## رموز الخروج {#exit-codes}

عادةً ما يخرج Node.js برمز حالة `0` عندما لا تكون هناك عمليات غير متزامنة معلقة. تُستخدم رموز الحالة التالية في حالات أخرى:

- `1` **استثناء قاتل غير مُعالج**: كان هناك استثناء غير مُعالج، ولم يتم التعامل معه بواسطة نطاق أو معالج حدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception).
- `2`: غير مستخدم (محفوظ بواسطة Bash للاستخدام الداخلي غير الصحيح)
- `3` **خطأ تحليل JavaScript داخلي**: تسبب كود مصدر JavaScript الداخلي في عملية تمهيد Node.js في حدوث خطأ في التحليل. هذا نادر للغاية، وعادة ما يحدث فقط أثناء تطوير Node.js نفسه.
- `4` **فشل تقييم JavaScript داخلي**: فشل كود مصدر JavaScript الداخلي في عملية تمهيد Node.js في إرجاع قيمة دالة عند تقييمها. هذا نادر للغاية، وعادة ما يحدث فقط أثناء تطوير Node.js نفسه.
- `5` **خطأ قاتل**: كان هناك خطأ قاتل غير قابل للاسترداد في V8. عادةً ما تتم طباعة رسالة إلى stderr مع البادئة `FATAL ERROR`.
- `6` **معالج استثناء داخلي غير دالة**: كان هناك استثناء غير مُعالج، ولكن تم تعيين دالة معالج الاستثناءات القاتلة الداخلية بطريقة ما إلى شيء غير دالة، ولم يكن بالإمكان استدعاؤها.
- `7` **فشل وقت التشغيل لمعالج الاستثناءات الداخلية**: كان هناك استثناء غير مُعالج، وألقت دالة معالج الاستثناءات القاتلة الداخلية نفسها خطأً أثناء محاولة التعامل معه. يمكن أن يحدث هذا، على سبيل المثال، إذا ألقى معالج [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception) أو `domain.on('error')` خطأً.
- `8`: غير مستخدم. في الإصدارات السابقة من Node.js، كان رمز الخروج 8 يشير أحيانًا إلى استثناء غير مُعالج.
- `9` **وسيطة غير صالحة**: تم تحديد خيار غير معروف، أو تم توفير خيار يتطلب قيمة بدون قيمة.
- `10` **فشل وقت التشغيل JavaScript داخلي**: ألقى كود مصدر JavaScript الداخلي في عملية تمهيد Node.js خطأً عند استدعاء دالة التمهيد. هذا نادر للغاية، وعادة ما يحدث فقط أثناء تطوير Node.js نفسه.
- `12` **وسيطة تصحيح أخطاء غير صالحة**: تم تعيين الخيارات `--inspect` و/أو `--inspect-brk`، ولكن رقم المنفذ الذي تم اختياره كان غير صالح أو غير متاح.
- `13` **انتظار غير مستقر على المستوى الأعلى**: تم استخدام `await` خارج دالة في الكود ذي المستوى الأعلى، لكن `Promise` الذي تم تمريره لم يستقر أبدًا.
- `14` **فشل اللقطة**: تم بدء تشغيل Node.js لإنشاء لقطة بدء تشغيل V8 وفشلت لأن بعض متطلبات حالة التطبيق لم يتم استيفاؤها.
- `\>128` **مخارج الإشارة**: إذا تلقى Node.js إشارة قاتلة مثل `SIGKILL` أو `SIGHUP`، فسيكون رمز الخروج الخاص به `128` بالإضافة إلى قيمة رمز الإشارة. هذه ممارسة POSIX قياسية، نظرًا لأن رموز الخروج مُعرَّفة على أنها أعداد صحيحة مكونة من 7 بتات، وتعيِّن مخارج الإشارة البتة عالية الترتيب، ثم تحتوي على قيمة رمز الإشارة. على سبيل المثال، الإشارة `SIGABRT` لها القيمة `6`، لذا فإن رمز الخروج المتوقع سيكون `128` + `6`، أو `134`.

