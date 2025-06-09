---
title: توثيق Node.js - خيوط العاملين
description: توثيق حول كيفية استخدام خيوط العاملين في Node.js للاستفادة من تعدد الخيوط للمهام التي تتطلب وحدة المعالجة المركزية، مع تقديم نظرة عامة على فئة Worker، والتواصل بين الخيوط، وأمثلة على الاستخدام.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - خيوط العاملين | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق حول كيفية استخدام خيوط العاملين في Node.js للاستفادة من تعدد الخيوط للمهام التي تتطلب وحدة المعالجة المركزية، مع تقديم نظرة عامة على فئة Worker، والتواصل بين الخيوط، وأمثلة على الاستخدام.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - خيوط العاملين | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق حول كيفية استخدام خيوط العاملين في Node.js للاستفادة من تعدد الخيوط للمهام التي تتطلب وحدة المعالجة المركزية، مع تقديم نظرة عامة على فئة Worker، والتواصل بين الخيوط، وأمثلة على الاستخدام.
---


# سلاسل العمل {#worker-threads}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

تتيح وحدة `node:worker_threads` استخدام سلاسل العمل التي تنفذ JavaScript بالتوازي. للوصول إليها:

```js [ESM]
const worker = require('node:worker_threads');
```
تعتبر سلاسل العمل (threads) مفيدة لتنفيذ عمليات JavaScript المكثفة لوحدة المعالجة المركزية (CPU). لا تساعد كثيرًا في العمليات المكثفة للإدخال/الإخراج (I/O). عمليات الإدخال/الإخراج غير المتزامنة المدمجة في Node.js أكثر كفاءة من سلاسل العمل.

على عكس `child_process` أو `cluster`، يمكن لـ `worker_threads` مشاركة الذاكرة. يفعلون ذلك عن طريق نقل مثيلات `ArrayBuffer` أو مشاركة مثيلات `SharedArrayBuffer`.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```
يقوم المثال أعلاه بإنشاء سلسلة عمل (Worker thread) لكل استدعاء `parseJSAsync()`. من الناحية العملية، استخدم مجموعة من سلاسل العمل لهذه الأنواع من المهام. بخلاف ذلك، من المحتمل أن تتجاوز تكلفة إنشاء سلاسل العمل فائدتها.

عند تنفيذ تجمع لسلاسل العمل، استخدم واجهة برمجة التطبيقات [`AsyncResource`](/ar/nodejs/api/async_hooks#class-asyncresource) لإبلاغ أدوات التشخيص (على سبيل المثال، لتوفير تتبعات مكدس غير متزامنة) حول العلاقة بين المهام ونتائجها. راجع ["استخدام `AsyncResource` لتجمع سلاسل عمل `Worker`"](/ar/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) في وثائق `async_hooks` للحصول على مثال على التنفيذ.

ترث سلاسل العمل خيارات غير خاصة بالعملية افتراضيًا. راجع [`خيارات منشئ Worker`](/ar/nodejs/api/worker_threads#new-workerfilename-options) لمعرفة كيفية تخصيص خيارات سلسلة العمل، وتحديدًا خياري `argv` و `execArgv`.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.5.0, v16.15.0 | لم يعد تجريبيًا. |
| v15.12.0, v14.18.0 | تمت إضافته في: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript اعتباطية وقابلة للاستنساخ يمكن استخدامها كمفتاح [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

داخل سلسلة عامل، تُرجع `worker.getEnvironmentData()` نسخة مُستنسخة من البيانات التي تم تمريرها إلى `worker.setEnvironmentData()` في سلسلة الإنشاء. يتلقى كل `Worker` جديد نسخة خاصة به من بيانات البيئة تلقائيًا.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // طباعة 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**تمت إضافته في: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يكون `true` إذا لم يكن هذا الرمز قيد التشغيل داخل سلسلة [`Worker`](/ar/nodejs/api/worker_threads#class-worker).

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // تعيد هذه العملية تحميل الملف الحالي داخل مثيل العامل.
  new Worker(__filename);
} else {
  console.log('داخل العامل!');
  console.log(isMainThread);  // طباعة 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**تمت إضافته في: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript اعتباطية.

ضع علامة على كائن على أنه غير قابل للتحويل. إذا ظهر `object` في قائمة التحويل الخاصة باستدعاء [`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist)، فسيتم طرح خطأ. هذا الإجراء لا يفعل شيئًا إذا كانت `object` قيمة بدائية.

على وجه الخصوص، يكون هذا منطقيًا للكائنات التي يمكن استنساخها بدلاً من نقلها، والتي تستخدمها كائنات أخرى على الجانب المرسل. على سبيل المثال، تضع Node.js علامة على [`ArrayBuffer`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) التي تستخدمها لمجموعة [`Buffer`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) الخاصة بها بهذا.

لا يمكن التراجع عن هذه العملية.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // سيؤدي هذا إلى طرح خطأ، لأن pooledBuffer غير قابل للتحويل.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// يطبع السطر التالي محتويات typedArray1 -- لا يزال يمتلك
// ذاكرته ولم يتم نقله. بدون
// `markAsUntransferable()`، سيتم طباعة Uint8Array فارغ و
// سيتم استدعاء postMessage بنجاح.
// typedArray2 سليم أيضًا.
console.log(typedArray1);
console.log(typedArray2);
```
لا يوجد ما يعادل واجهة برمجة التطبيقات هذه في المتصفحات.


## ‏‎`worker.isMarkedAsUntransferable(object)`‎‏ {#workerismarkedasuntransferableobject}

**أُضيف في:** ‏v21.0.0

*   ‏`object` ‏‎[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)‎‏ أي قيمة JavaScript.
*   المرتجعات: ‏‎[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)‎‏

تحقق مما إذا كان الكائن مصنفًا على أنه غير قابل للنقل باستخدام ‏‎[`markAsUntransferable()`](/ar/nodejs/api/worker_threads#workermarkasuntransferableobject)‎‏.

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Returns true.
```

لا يوجد ما يعادل هذا الـ API في المتصفحات.

## ‏‎`worker.markAsUncloneable(object)`‎‏ {#workermarkasuncloneableobject}

**أُضيف في:** ‏v23.0.0

*   ‏`object` ‏‎[\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)‎‏ أي قيمة JavaScript اعتباطية.

ضع علامة على كائن على أنه غير قابل للاستنساخ. إذا تم استخدام ‏`object`‏ كـ ‏‎[`message`](/ar/nodejs/api/worker_threads#event-message)‎‏ في استدعاء ‏‎[`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist)‎‏، فسيتم طرح خطأ. هذا ليس له أي تأثير إذا كان ‏`object`‏ قيمة بدائية.

هذا ليس له أي تأثير على ‏`ArrayBuffer`‏، أو أي كائنات شبيهة بـ ‏`Buffer`‏.

لا يمكن التراجع عن هذه العملية.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // This will throw an error, because anyObject is not cloneable.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```

لا يوجد ما يعادل هذا الـ API في المتصفحات.

## ‏‎`worker.moveMessagePortToContext(port, contextifiedSandbox)`‎‏ {#workermovemessageporttocontextport-contextifiedsandbox}

**أُضيف في:** ‏v11.13.0

*   ‏`port` ‏‎[\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport)‎‏ منفذ الرسائل المراد نقله.
*   ‏`contextifiedSandbox` ‏‎[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)‎‏ كائن [مضاف إلى السياق](/ar/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) كما تم إرجاعه بواسطة طريقة ‏‎`vm.createContext()`‎‏.
*   المرتجعات: ‏‎[\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport)‎‏

انقل ‏`MessagePort`‏ إلى ‏`vm`‏ مختلف [سياق](/ar/nodejs/api/vm). يتم جعل كائن ‏`port`‏ الأصلي غير قابل للاستخدام، ويحل مثيل ‏`MessagePort`‏ المرتجع مكانه.

إن ‏`MessagePort`‏ المرتجع هو كائن في السياق المستهدف ويرث من فئة ‏`Object`‏ العالمية الخاصة به. يتم أيضًا إنشاء الكائنات التي تم تمريرها إلى المستمع ‏‎[`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage)‎‏ في السياق المستهدف وترث من فئة ‏`Object`‏ العالمية الخاصة به.

ومع ذلك، لم يعد ‏`MessagePort`‏ الذي تم إنشاؤه يرث من ‏‎[`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)‎‏، ويمكن استخدام ‏‎[`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage)‎‏ فقط لتلقي الأحداث باستخدامه.


## `worker.parentPort` {#workerparentport}

**تمت إضافته في: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport)

إذا كان هذا المسار هو [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فهذا هو [`MessagePort`](/ar/nodejs/api/worker_threads#class-messageport) الذي يسمح بالاتصال بالمسار الرئيسي. الرسائل المرسلة باستخدام `parentPort.postMessage()` متاحة في المسار الرئيسي باستخدام `worker.on('message')`، والرسائل المرسلة من المسار الرئيسي باستخدام `worker.postMessage()` متاحة في هذا المسار باستخدام `parentPort.on('message')`.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Prints 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // When a message from the parent thread is received, send it back:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**تمت إضافته في: v22.5.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف المسار المستهدف. إذا كان معرّف المسار غير صالح، فسيتم طرح خطأ [`ERR_WORKER_MESSAGING_FAILED`](/ar/nodejs/api/errors#err_worker_messaging_failed). إذا كان معرّف المسار المستهدف هو معرّف المسار الحالي، فسيتم طرح خطأ [`ERR_WORKER_MESSAGING_SAME_THREAD`](/ar/nodejs/api/errors#err_worker_messaging_same_thread).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة المراد إرسالها.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إذا تم تمرير كائن واحد أو أكثر من كائنات تشبه `MessagePort` في `value`، فإن `transferList` مطلوب لتلك العناصر وإلا فسيتم طرح [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ar/nodejs/api/errors#err_missing_message_port_in_transfer_list). راجع [`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist) لمزيد من المعلومات.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الوقت المستغرق لانتظار تسليم الرسالة بالمللي ثانية. افتراضيًا يكون `undefined`، مما يعني الانتظار إلى الأبد. إذا انتهت مهلة العملية، فسيتم طرح خطأ [`ERR_WORKER_MESSAGING_TIMEOUT`](/ar/nodejs/api/errors#err_worker_messaging_timeout).
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد يتم تحقيقه إذا تمت معالجة الرسالة بنجاح بواسطة المسار الوجهة.

يرسل قيمة إلى عامل آخر، يتم تحديده بواسطة معرّف مساره.

إذا لم يكن لدى المسار المستهدف مستمع لحدث `workerMessage`، فستطرح العملية خطأ [`ERR_WORKER_MESSAGING_FAILED`](/ar/nodejs/api/errors#err_worker_messaging_failed).

إذا طرح المسار المستهدف خطأ أثناء معالجة حدث `workerMessage`، فستطرح العملية خطأ [`ERR_WORKER_MESSAGING_ERRORED`](/ar/nodejs/api/errors#err_worker_messaging_errored).

يجب استخدام هذه الطريقة عندما لا يكون المسار المستهدف هو الأصل أو الطفل المباشر للمسار الحالي. إذا كان المساران أصليين-طفلين، فاستخدم [`require('node:worker_threads').parentPort.postMessage()`](/ar/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) و [`worker.postMessage()`](/ar/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) للسماح للمسارات بالاتصال.

يوضح المثال أدناه استخدام `postMessageToThread`: فهو ينشئ 10 مسارات متداخلة، وسيحاول المسار الأخير الاتصال بالمسار الرئيسي.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.12.0 | يمكن الآن أن يشير وسيط `port` أيضًا إلى `BroadcastChannel`. |
| v12.3.0 | تمت الإضافة في: v12.3.0 |
:::

- `port` [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/ar/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget)
- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

تلقي رسالة واحدة من `MessagePort` معينة. إذا لم تكن هناك رسالة متاحة، يتم إرجاع `undefined`، وإلا يتم إرجاع كائن يحتوي على خاصية `message` واحدة تحتوي على حمولة الرسالة، المطابقة لأقدم رسالة في قائمة انتظار `MessagePort`.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// طباعة: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// طباعة: غير معرف
```
عند استخدام هذه الدالة، لا يتم إطلاق أي حدث `'message'` ولا يتم استدعاء المستمع `onmessage`.

## `worker.resourceLimits` {#workerresourcelimits}

**تمت الإضافة في: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يوفر مجموعة قيود موارد محرك JS داخل سلسلة Worker هذه. إذا تم تمرير خيار `resourceLimits` إلى الدالة البنائية [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فإن هذا يطابق قيمه.

إذا تم استخدام هذا في سلسلة التعليمات الرئيسية، فإن قيمته هي كائن فارغ.


## `worker.SHARE_ENV` {#workershare_env}

**تمت الإضافة في: الإصدار 11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

قيمة خاصة يمكن تمريرها كخيار `env` لمنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، للإشارة إلى أنه يجب على الخيط الحالي وخيط Worker مشاركة الوصول للقراءة والكتابة إلى نفس مجموعة متغيرات البيئة.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // يطبع 'foo'.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.5.0, v16.15.0 | لم يعد تجريبيًا. |
| v15.12.0, v14.18.0 | تمت الإضافة في: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript عشوائية قابلة للاستنساخ يمكن استخدامها كمفتاح [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript عشوائية قابلة للاستنساخ سيتم استنساخها وتمريرها تلقائيًا إلى جميع مثيلات `Worker` الجديدة. إذا تم تمرير `value` كـ `undefined`، فسيتم حذف أي قيمة تم تعيينها مسبقًا لـ `key`.

تضبط واجهة برمجة التطبيقات `worker.setEnvironmentData()` محتوى `worker.getEnvironmentData()` في الخيط الحالي وجميع مثيلات `Worker` الجديدة التي يتم إنشاؤها من السياق الحالي.

## `worker.threadId` {#workerthreadid}

**تمت الإضافة في: الإصدار 10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

معرف عدد صحيح للخيط الحالي. في كائن worker المقابل (إن وجد)، يتوفر كـ [`worker.threadId`](/ar/nodejs/api/worker_threads#workerthreadid_1). هذه القيمة فريدة لكل مثيل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) داخل عملية واحدة.


## ‏`worker.workerData` {#workerworkerdata}

**تمت إضافته في: الإصدار 10.5.0**

قيمة JavaScript عشوائية تحتوي على نسخة مستنسخة من البيانات التي تم تمريرها إلى مُنشئ `Worker` لهذا الخيط.

يتم استنساخ البيانات كما لو تم استخدام [`postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist)، وفقًا لـ [خوارزمية الاستنساخ المنظم HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Prints 'Hello, world!'.
}
```
## الفئة: ‏`BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | لم تعد تجريبية. |
| الإصدار 15.4.0 | تمت إضافتها في: الإصدار 15.4.0 |
:::

تسمح مثيلات `BroadcastChannel` بالاتصال غير المتزامن من واحد إلى متعدد مع جميع مثيلات `BroadcastChannel` الأخرى المرتبطة بنفس اسم القناة.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### ‏`new BroadcastChannel(name)` {#new-broadcastchannelname}

**تمت إضافتها في: الإصدار 15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) اسم القناة المراد الاتصال بها. يُسمح بأي قيمة JavaScript يمكن تحويلها إلى سلسلة باستخدام ``${name}``.

### ‏`broadcastChannel.close()` {#broadcastchannelclose}

**تمت إضافتها في: الإصدار 15.4.0**

يُغلق اتصال `BroadcastChannel`.

### ‏`broadcastChannel.onmessage` {#broadcastchannelonmessage}

**تمت إضافتها في: الإصدار 15.4.0**

- النوع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها مع وسيطة `MessageEvent` واحدة عند استقبال رسالة.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**أُضيف في: الإصدار 15.4.0**

- النوع: [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه عند استقبال رسالة لا يمكن إلغاء تسلسلها.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**أُضيف في: الإصدار 15.4.0**

- `message` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript قابلة للاستنساخ.

### `broadcastChannel.ref()` {#broadcastchannelref}

**أُضيف في: الإصدار 15.4.0**

عكس `unref()`. استدعاء `ref()` على BroadcastChannel تم عمل `unref()` له مسبقًا لا يسمح للبرنامج بالخروج إذا كان هو المؤشر النشط الوحيد المتبقي (السلوك الافتراضي). إذا كان المنفذ `ref()`ed، فإن استدعاء `ref()` مرة أخرى ليس له أي تأثير.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**أُضيف في: الإصدار 15.4.0**

استدعاء `unref()` على BroadcastChannel يسمح للخيط بالخروج إذا كان هذا هو المؤشر النشط الوحيد في نظام الأحداث. إذا كان BroadcastChannel بالفعل `unref()`ed، فإن استدعاء `unref()` مرة أخرى ليس له أي تأثير.

## الصنف: `MessageChannel` {#class-messagechannel}

**أُضيف في: الإصدار 10.5.0**

تمثل مثيلات الصنف `worker.MessageChannel` قناة اتصالات غير متزامنة ثنائية الاتجاه. لا يحتوي `MessageChannel` على أي طرق خاصة به. ينتج `new MessageChannel()` كائنًا بخصائص `port1` و `port2`، والتي تشير إلى مثيلات [`MessagePort`](/ar/nodejs/api/worker_threads#class-messageport) المرتبطة.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Prints: received { foo: 'bar' } from the `port1.on('message')` listener
// يطبع: استقبل { foo: 'bar' } من مستمع `port1.on('message')`
```
## الصنف: `MessagePort` {#class-messageport}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.7.0 | يرث هذا الصنف الآن من `EventTarget` بدلاً من `EventEmitter`. |
| الإصدار 10.5.0 | أُضيف في: الإصدار 10.5.0 |
:::

- يمتد: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget)

تمثل مثيلات الصنف `worker.MessagePort` أحد طرفي قناة اتصالات غير متزامنة ثنائية الاتجاه. يمكن استخدامه لنقل البيانات المهيكلة ومناطق الذاكرة و `MessagePort`s الأخرى بين [`Worker`](/ar/nodejs/api/worker_threads#class-worker)s مختلفة.

يتطابق هذا التنفيذ مع [`MessagePort` المتصفح](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort).


### الحدث: `'close'` {#event-close}

**تمت إضافته في: الإصدار v10.5.0**

يتم إطلاق الحدث `'close'` بمجرد قطع الاتصال بأحد جانبي القناة.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// يطبع:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### الحدث: `'message'` {#event-message}

**تمت إضافته في: الإصدار v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة المرسلة

يتم إطلاق الحدث `'message'` لأي رسالة واردة، تحتوي على النسخة المستنسخة من مدخلات [`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist).

يتلقى المستمعون لهذا الحدث نسخة مستنسخة من معلمة `value` كما تم تمريرها إلى `postMessage()` ولا توجد وسيطات أخرى.

### الحدث: `'messageerror'` {#event-messageerror}

**تمت إضافته في: الإصدار v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) كائن خطأ

يتم إطلاق الحدث `'messageerror'` عندما يفشل إلغاء تسلسل رسالة.

حاليًا، يتم إطلاق هذا الحدث عندما يحدث خطأ أثناء إنشاء كائن JS المنشور على الطرف المتلقي. هذه المواقف نادرة، ولكن يمكن أن تحدث، على سبيل المثال، عندما يتم استلام بعض كائنات Node.js API في `vm.Context` (حيث لا تتوفر واجهات برمجة تطبيقات Node.js حاليًا).

### `port.close()` {#portclose}

**تمت إضافته في: الإصدار v10.5.0**

يعطل إرسال المزيد من الرسائل على أي من جانبي الاتصال. يمكن استدعاء هذه الطريقة عندما لا تحدث المزيد من الاتصالات عبر `MessagePort`.

يتم إطلاق [`'close'` event](/ar/nodejs/api/worker_threads#event-close) على كلا مثيلي `MessagePort` اللذين يمثلان جزءًا من القناة.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | يتم طرح خطأ عندما يكون هناك كائن غير قابل للنقل في قائمة النقل. |
| v15.6.0 | تمت إضافة `X509Certificate` إلى قائمة الأنواع القابلة للاستنساخ. |
| v15.0.0 | تمت إضافة `CryptoKey` إلى قائمة الأنواع القابلة للاستنساخ. |
| v15.14.0, v14.18.0 | تمت إضافة 'BlockList' إلى قائمة الأنواع القابلة للاستنساخ. |
| v15.9.0, v14.18.0 | تمت إضافة أنواع 'Histogram' إلى قائمة الأنواع القابلة للاستنساخ. |
| v14.5.0, v12.19.0 | تمت إضافة `KeyObject` إلى قائمة الأنواع القابلة للاستنساخ. |
| v14.5.0, v12.19.0 | تمت إضافة `FileHandle` إلى قائمة الأنواع القابلة للنقل. |
| v10.5.0 | تمت إضافته في: الإصدار v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يرسل قيمة JavaScript إلى الجانب المتلقي من هذه القناة. يتم نقل `value` بطريقة متوافقة مع [خوارزمية الاستنساخ المنظمة HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

على وجه الخصوص، الاختلافات الهامة في `JSON` هي:

- قد تحتوي `value` على مراجع دائرية.
- قد تحتوي `value` على مثيلات لأنواع JS المضمنة مثل `RegExp`s و `BigInt`s و `Map`s و `Set`s وما إلى ذلك.
- قد تحتوي `value` على مصفوفات مكتوبة، باستخدام كل من `ArrayBuffer`s و `SharedArrayBuffer`s.
- قد تحتوي `value` على مثيلات [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module).
- قد لا تحتوي `value` على كائنات أصلية (مدعومة بـ C++) بخلاف:
    - [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey)s،
    - [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle)s،
    - [\<Histogram\>](/ar/nodejs/api/perf_hooks#class-histogram)s،
    - [\<KeyObject\>](/ar/nodejs/api/crypto#class-keyobject)s،
    - [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport)s،
    - [\<net.BlockList\>](/ar/nodejs/api/net#class-netblocklist)s،
    - [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress)es،
    - [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate)s.
  
 

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// يطبع: { foo: [Circular] }
port2.postMessage(circularData);
```
قد تكون `transferList` قائمة بكائنات [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) و [`MessagePort`](/ar/nodejs/api/worker_threads#class-messageport) و [`FileHandle`](/ar/nodejs/api/fs#class-filehandle). بعد النقل، لا يمكن استخدامها على الجانب المرسل من القناة بعد الآن (حتى لو لم تكن موجودة في `value`). على عكس [العمليات الفرعية](/ar/nodejs/api/child_process)، فإن نقل المؤشرات مثل مآخذ توصيل الشبكة غير مدعوم حاليًا.

إذا كانت `value` تحتوي على مثيلات [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)، فيمكن الوصول إليها من أي من الخيطين. لا يمكن إدراجها في `transferList`.

قد تظل `value` تحتوي على مثيلات `ArrayBuffer` غير موجودة في `transferList`؛ في هذه الحالة، يتم نسخ الذاكرة الأساسية بدلاً من نقلها.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// هذا ينشر نسخة من `uint8Array`:
port2.postMessage(uint8Array);
// هذا لا ينسخ البيانات، ولكنه يجعل `uint8Array` غير قابل للاستخدام:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// يمكن الوصول إلى الذاكرة الخاصة بـ `sharedUint8Array` من كل من
// الأصل والنسخة المستلمة بواسطة `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// هذا ينقل منفذ رسالة تم إنشاؤه حديثًا إلى جهاز الاستقبال.
// يمكن استخدام هذا، على سبيل المثال، لإنشاء قنوات اتصال بين
// خيوط `Worker` المتعددة التي هي أطفال لنفس الخيط الأصل.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
يتم استنساخ كائن الرسالة على الفور، ويمكن تعديله بعد النشر دون آثار جانبية.

لمزيد من المعلومات حول آليات التسلسل وإلغاء التسلسل الموجودة وراء واجهة برمجة التطبيقات هذه، راجع [واجهة برمجة تطبيقات التسلسل لوحدة `node:v8`](/ar/nodejs/api/v8#serialization-api).


#### اعتبارات عند نقل TypedArrays و Buffers {#considerations-when-transferring-typedarrays-and-buffers}

جميع مثيلات `TypedArray` و `Buffer` هي طرق عرض فوق `ArrayBuffer` أساسي. وهذا يعني أن `ArrayBuffer` هو الذي يخزن البيانات الأولية فعليًا بينما توفر كائنات `TypedArray` و `Buffer` طريقة لعرض البيانات ومعالجتها. من الممكن والشائع إنشاء طرق عرض متعددة فوق نفس مثيل `ArrayBuffer`. يجب توخي الحذر الشديد عند استخدام قائمة النقل لنقل `ArrayBuffer` لأن القيام بذلك يتسبب في أن تصبح جميع مثيلات `TypedArray` و `Buffer` التي تشترك في نفس `ArrayBuffer` غير قابلة للاستخدام.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // يطبع 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // يطبع 0
```
بالنسبة لمثيلات `Buffer` على وجه التحديد، يعتمد ما إذا كان يمكن نقل أو استنساخ `ArrayBuffer` الأساسي كليًا على كيفية إنشاء المثيلات، وهو ما لا يمكن تحديده بشكل موثوق في كثير من الأحيان.

يمكن وضع علامة على `ArrayBuffer` باستخدام [`markAsUntransferable()`](/ar/nodejs/api/worker_threads#workermarkasuntransferableobject) للإشارة إلى أنه يجب دائمًا استنساخه وعدم نقله أبدًا.

اعتمادًا على كيفية إنشاء مثيل `Buffer`، قد يمتلك أو لا يمتلك `ArrayBuffer` الأساسي الخاص به. يجب عدم نقل `ArrayBuffer` إلا إذا كان من المعروف أن مثيل `Buffer` يمتلكه. على وجه الخصوص، بالنسبة إلى `Buffer`s التي تم إنشاؤها من تجمع `Buffer` الداخلي (باستخدام، على سبيل المثال `Buffer.from()` أو `Buffer.allocUnsafe()`)، فإن نقلها غير ممكن ويتم استنساخها دائمًا، مما يرسل نسخة من تجمع `Buffer` بأكمله. قد يأتي هذا السلوك مصحوبًا باستخدام غير مقصود للذاكرة بشكل أكبر ومخاوف أمنية محتملة.

راجع [`Buffer.allocUnsafe()`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize) للحصول على مزيد من التفاصيل حول تجميع `Buffer`.

يمكن دائمًا نقل `ArrayBuffer`s لمثيلات `Buffer` التي تم إنشاؤها باستخدام `Buffer.alloc()` أو `Buffer.allocUnsafeSlow()` ولكن القيام بذلك يجعل جميع طرق العرض الأخرى الموجودة لتلك `ArrayBuffer`s غير قابلة للاستخدام.


#### اعتبارات عند استنساخ الكائنات ذات النماذج الأولية، والفئات، والوصولات {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

نظرًا لأن استنساخ الكائنات يستخدم [خوارزمية الاستنساخ المهيكل HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)، لا يتم الحفاظ على الخصائص غير القابلة للتعداد، وواصفات خصائص الوصول، والنماذج الأولية للكائنات. على وجه الخصوص، سيتم قراءة كائنات [`Buffer`](/ar/nodejs/api/buffer) كـ [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) عادية على الجانب المتلقي، وسيتم استنساخ مثيلات فئات JavaScript ككائنات JavaScript عادية.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
يمتد هذا القيد إلى العديد من الكائنات المضمنة، مثل كائن `URL` العام:

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**تمت الإضافة في: v18.1.0, v16.17.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة true، فسيحافظ كائن `MessagePort` على نشاط حلقة أحداث Node.js.

### `port.ref()` {#portref}

**تمت الإضافة في: v10.5.0**

عكس `unref()`. استدعاء `ref()` على منفذ `unref()`ed مسبقًا *لا* يسمح للبرنامج بالخروج إذا كان هو المقبض النشط الوحيد المتبقي (السلوك الافتراضي). إذا كان المنفذ `ref()`ed، فإن استدعاء `ref()` مرة أخرى ليس له أي تأثير.

إذا تم إرفاق المستمعين أو إزالتهم باستخدام `.on('message')`، فسيتم `ref()`ed و `unref()`ed المنفذ تلقائيًا اعتمادًا على ما إذا كانت المستمعين للحدث موجودين أم لا.


### `port.start()` {#portstart}

**تمت الإضافة في: v10.5.0**

يبدأ في استقبال الرسائل على `MessagePort` هذا. عند استخدام هذا المنفذ كباعث حدث، يتم استدعاء هذا تلقائيًا بمجرد إرفاق مستمعي `'message'`.

توجد هذه الطريقة للتكافؤ مع واجهة برمجة تطبيقات Web `MessagePort`. في Node.js، يكون هذا مفيدًا فقط لتجاهل الرسائل في حالة عدم وجود مستمع أحداث. يختلف Node.js أيضًا في معالجته لـ `.onmessage`. يؤدي تعيينه تلقائيًا إلى استدعاء `.start()`، ولكن إلغاء تعيينه يسمح للرسائل بالوقوف في قائمة الانتظار حتى يتم تعيين معالج جديد أو يتم تجاهل المنفذ.

### `port.unref()` {#portunref}

**تمت الإضافة في: v10.5.0**

يسمح استدعاء `unref()` على منفذ للترخيص بالخروج إذا كان هذا هو المقبض النشط الوحيد في نظام الأحداث. إذا كان المنفذ `unref()`ed بالفعل، فإن استدعاء `unref()` مرة أخرى لا يؤثر.

إذا تم إرفاق المستمعين أو إزالتهم باستخدام `.on('message')`، فسيتم `ref()` و `unref()` للمنفذ تلقائيًا اعتمادًا على ما إذا كان المستمعون للحدث موجودين أم لا.

## Class: `Worker` {#class-worker}

**تمت الإضافة في: v10.5.0**

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

تمثل الفئة `Worker` سلسلة تنفيذ JavaScript مستقلة. تتوفر معظم واجهات برمجة تطبيقات Node.js داخلها.

الاختلافات الملحوظة داخل بيئة Worker هي:

- يمكن إعادة توجيه تدفقات [`process.stdin`](/ar/nodejs/api/process#processstdin) و [`process.stdout`](/ar/nodejs/api/process#processstdout) و [`process.stderr`](/ar/nodejs/api/process#processstderr) بواسطة الترخيص الأصل.
- تم تعيين الخاصية [`require('node:worker_threads').isMainThread`](/ar/nodejs/api/worker_threads#workerismainthread) على `false`.
- منفذ رسائل [`require('node:worker_threads').parentPort`](/ar/nodejs/api/worker_threads#workerparentport) متاح.
- [`process.exit()`](/ar/nodejs/api/process#processexitcode) لا يوقف البرنامج بأكمله، فقط السلسلة الواحدة، و [`process.abort()`](/ar/nodejs/api/process#processabort) غير متاح.
- [`process.chdir()`](/ar/nodejs/api/process#processchdirdirectory) وطرق `process` التي تعين معرفات المجموعة أو المستخدم غير متاحة.
- [`process.env`](/ar/nodejs/api/process#processenv) عبارة عن نسخة من متغيرات بيئة الترخيص الأصل، ما لم يتم تحديد خلاف ذلك. التغييرات التي يتم إجراؤها على نسخة واحدة غير مرئية في التراخيص الأخرى، وغير مرئية للإضافات الأصلية (ما لم يتم تمرير [`worker.SHARE_ENV`](/ar/nodejs/api/worker_threads#workershare_env) كخيار `env` إلى مُنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker)). في Windows، على عكس الترخيص الرئيسي، تعمل نسخة من متغيرات البيئة بطريقة حساسة لحالة الأحرف.
- لا يمكن تعديل [`process.title`](/ar/nodejs/api/process#processtitle).
- لا يتم تسليم الإشارات من خلال [`process.on('...')`](/ar/nodejs/api/process#signal-events).
- قد يتوقف التنفيذ في أي لحظة نتيجة لاستدعاء [`worker.terminate()`](/ar/nodejs/api/worker_threads#workerterminate).
- قنوات IPC من التراخيص الأصل غير قابلة للوصول.
- وحدة [`trace_events`](/ar/nodejs/api/tracing) غير مدعومة.
- يمكن تحميل الإضافات الأصلية فقط من تراخيص متعددة إذا كانت تفي بـ [شروط معينة](/ar/nodejs/api/addons#worker-support).

من الممكن إنشاء مثيلات `Worker` داخل `Worker`s أخرى.

مثل [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) ووحدة [`node:cluster` module](/ar/nodejs/api/cluster)، يمكن تحقيق اتصال ثنائي الاتجاه من خلال تمرير الرسائل بين التراخيص. داخليًا، يحتوي `Worker` على زوج مدمج من [`MessagePort`](/ar/nodejs/api/worker_threads#class-messageport)s المرتبطين بالفعل ببعضهما البعض عند إنشاء `Worker`. على الرغم من أن كائن `MessagePort` على جانب الأصل غير معروض بشكل مباشر، إلا أن وظائفه معروضة من خلال [`worker.postMessage()`](/ar/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) وحدث [`worker.on('message')`](/ar/nodejs/api/worker_threads#event-message_1) على كائن `Worker` للترخيص الأصل.

لإنشاء قنوات مراسلة مخصصة (والتي يتم تشجيعها على استخدام القناة العامة الافتراضية لأنها تسهل فصل الاهتمامات)، يمكن للمستخدمين إنشاء كائن `MessageChannel` على أي من الترخيصين وتمرير أحد `MessagePort`s على `MessageChannel` هذا إلى الترخيص الآخر من خلال قناة موجودة مسبقًا، مثل القناة العامة.

راجع [`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist) لمزيد من المعلومات حول كيفية تمرير الرسائل، وأنواع قيم JavaScript التي يمكن نقلها بنجاح عبر حاجز الترخيص.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.8.0, v18.16.0 | تمت إضافة دعم لخيار `name`، والذي يسمح بإضافة اسم إلى عنوان العامل لأغراض التصحيح. |
| v14.9.0 | يمكن أن يكون المعامل `filename` كائن WHATWG `URL` باستخدام بروتوكول `data:`. |
| v14.9.0 | تم تعيين الخيار `trackUnmanagedFds` على `true` افتراضيًا. |
| v14.6.0, v12.19.0 | تم تقديم الخيار `trackUnmanagedFds`. |
| v13.13.0, v12.17.0 | تم تقديم الخيار `transferList`. |
| v13.12.0, v12.17.0 | يمكن أن يكون المعامل `filename` كائن WHATWG `URL` باستخدام بروتوكول `file:`. |
| v13.4.0, v12.16.0 | تم تقديم الخيار `argv`. |
| v13.2.0, v12.16.0 | تم تقديم الخيار `resourceLimits`. |
| v10.5.0 | تمت الإضافة في: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) مسار البرنامج النصي أو الوحدة الرئيسية للعامل. يجب أن يكون إما مسارًا مطلقًا أو مسارًا نسبيًا (أي بالنسبة إلى دليل العمل الحالي) يبدأ بـ `./` أو `../`، أو كائن WHATWG `URL` باستخدام بروتوكول `file:` أو `data:`. عند استخدام [`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)، يتم تفسير البيانات بناءً على نوع MIME باستخدام [محمل وحدة ECMAScript النمطية](/ar/nodejs/api/esm#data-imports). إذا كان `options.eval` هو `true`، فسيكون هذا عبارة عن سلسلة تحتوي على كود JavaScript بدلاً من مسار.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قائمة بالوسائط التي سيتم تحويلها إلى سلسلة وإلحاقها بـ `process.argv` في العامل. يشبه هذا إلى حد كبير `workerData` ولكن القيم متاحة على `process.argv` العام كما لو تم تمريرها كخيارات CLI إلى البرنامج النصي.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إذا تم تعيينه، فإنه يحدد القيمة الأولية لـ `process.env` داخل سلسلة العامل. كقيمة خاصة، يمكن استخدام [`worker.SHARE_ENV`](/ar/nodejs/api/worker_threads#workershare_env) لتحديد أنه يجب على سلسلة الأصل والسلسلة الفرعية مشاركة متغيرات البيئة الخاصة بهما؛ في هذه الحالة، تؤثر التغييرات التي تطرأ على كائن `process.env` لسلسلة واحدة على السلسلة الأخرى أيضًا. **الافتراضي:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true` والوسيطة الأولى عبارة عن `string`، ففسر الوسيطة الأولى للمنشئ على أنها برنامج نصي يتم تنفيذه بمجرد اتصال العامل بالإنترنت.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة بخيارات node CLI التي تم تمريرها إلى العامل. خيارات V8 (مثل `--max-old-space-size`) والخيارات التي تؤثر على العملية (مثل `--title`) غير مدعومة. إذا تم تعيينه، فسيتم توفير ذلك كـ [`process.execArgv`](/ar/nodejs/api/process#processexecargv) داخل العامل. بشكل افتراضي، يتم توريث الخيارات من سلسلة الأصل.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيين هذا على `true`، فستوفر `worker.stdin` دفقًا قابلاً للكتابة تظهر محتوياته كـ `process.stdin` داخل العامل. بشكل افتراضي، لا يتم توفير أي بيانات.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيين هذا على `true`، فلن يتم توجيه `worker.stdout` تلقائيًا إلى `process.stdout` في الأصل.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيين هذا على `true`، فلن يتم توجيه `worker.stderr` تلقائيًا إلى `process.stderr` في الأصل.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript يتم استنساخها وإتاحتها كـ [`require('node:worker_threads').workerData`](/ar/nodejs/api/worker_threads#workerworkerdata). يحدث الاستنساخ كما هو موضح في [خوارزمية الاستنساخ المنظم HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)، ويتم طرح خطأ إذا تعذر استنساخ الكائن (على سبيل المثال لأنه يحتوي على `function`s).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيين هذا على `true`، فسيتعقب العامل واصفات الملفات الأولية التي تتم إدارتها من خلال [`fs.open()`](/ar/nodejs/api/fs#fsopenpath-flags-mode-callback) و [`fs.close()`](/ar/nodejs/api/fs#fsclosefd-callback)، ويغلقها عند خروج العامل، على غرار الموارد الأخرى مثل مآخذ توصيل الشبكة أو واصفات الملفات التي تتم إدارتها من خلال واجهة برمجة التطبيقات [`FileHandle`](/ar/nodejs/api/fs#class-filehandle). يتم توريث هذا الخيار تلقائيًا بواسطة جميع `Worker`s المتداخلة. **الافتراضي:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إذا تم تمرير كائن واحد أو أكثر يشبه `MessagePort` في `workerData`، فإن `transferList` مطلوب لهذه العناصر أو [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ar/nodejs/api/errors#err_missing_message_port_in_transfer_list) يتم طرحه. راجع [`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist) لمزيد من المعلومات.
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مجموعة اختيارية من حدود الموارد لمثيل محرك JS الجديد. يؤدي الوصول إلى هذه الحدود إلى إنهاء مثيل `Worker`. تؤثر هذه الحدود فقط على محرك JS، وليس على أي بيانات خارجية، بما في ذلك عدم وجود `ArrayBuffer`s. حتى إذا تم تعيين هذه الحدود، فقد يتم إحباط العملية إذا واجهت حالة نفاد الذاكرة العمومية.
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحجم الأقصى للكومة الرئيسية بالميغابايت. إذا تم تعيين وسيطة سطر الأوامر [`--max-old-space-size`](/ar/nodejs/api/cli#--max-old-space-sizesize-in-mib)، فإنها تتجاوز هذا الإعداد.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحجم الأقصى لمساحة الكومة للكائنات التي تم إنشاؤها مؤخرًا. إذا تم تعيين وسيطة سطر الأوامر [`--max-semi-space-size`](/ar/nodejs/api/cli#--max-semi-space-sizesize-in-mib)، فإنها تتجاوز هذا الإعداد.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم نطاق الذاكرة المخصص مسبقًا المستخدم للكود الذي تم إنشاؤه.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم المكدس الافتراضي للسلسلة. قد تؤدي القيم الصغيرة إلى مثيلات عامل غير قابلة للاستخدام. **الافتراضي:** `4`.

    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `name` اختياري لإلحاقه بعنوان العامل لأغراض التصحيح/التعريف، مما يجعل العنوان النهائي كـ `[worker ${id}] ${name}`. **الافتراضي:** `''`.


### الحدث: `'error'` {#event-error}

**أضيف في: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إطلاق الحدث `'error'` إذا طرح مؤشر الترابط العامل استثناءً غير معالج. في هذه الحالة، يتم إنهاء العامل.

### الحدث: `'exit'` {#event-exit}

**أضيف في: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم إطلاق الحدث `'exit'` بمجرد توقف العامل. إذا خرج العامل عن طريق استدعاء [`process.exit()`](/ar/nodejs/api/process#processexitcode)، فإن المعامل `exitCode` هو رمز الخروج الذي تم تمريره. إذا تم إنهاء العامل، فإن المعامل `exitCode` هو `1`.

هذا هو الحدث الأخير الذي يتم إطلاقه بواسطة أي مثيل `Worker`.

### الحدث: `'message'` {#event-message_1}

**أضيف في: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة المرسلة

يتم إطلاق الحدث `'message'` عندما يستدعي مؤشر الترابط العامل [`require('node:worker_threads').parentPort.postMessage()`](/ar/nodejs/api/worker_threads#workerpostmessagevalue-transferlist). راجع الحدث [`port.on('message')`](/ar/nodejs/api/worker_threads#event-message) لمزيد من التفاصيل.

يتم إطلاق جميع الرسائل المرسلة من مؤشر الترابط العامل قبل إطلاق [`الحدث 'exit'`](/ar/nodejs/api/worker_threads#event-exit) على كائن `Worker`.

### الحدث: `'messageerror'` {#event-messageerror_1}

**أضيف في: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) كائن خطأ

يتم إطلاق الحدث `'messageerror'` عند فشل إلغاء تسلسل الرسالة.

### الحدث: `'online'` {#event-online}

**أضيف في: v10.5.0**

يتم إطلاق الحدث `'online'` عندما يبدأ مؤشر الترابط العامل في تنفيذ كود JavaScript.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.1.0 | دعم الخيارات لتهيئة لقطة الذاكرة الرئيسية. |
| v13.9.0, v12.17.0 | أضيف في: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة true، فسيتم الكشف عن العناصر الداخلية في لقطة الذاكرة الرئيسية. **افتراضي:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة true، فسيتم الكشف عن القيم الرقمية في الحقول الاصطناعية. **افتراضي:** `false`.
  
 
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد لتدفق قابل للقراءة يحتوي على لقطة ذاكرة رئيسية V8

إرجاع دفق قابل للقراءة للقطة V8 للحالة الحالية للعامل. راجع [`v8.getHeapSnapshot()`](/ar/nodejs/api/v8#v8getheapsnapshotoptions) لمزيد من التفاصيل.

إذا كان مؤشر الترابط العامل لم يعد قيد التشغيل، وهو ما قد يحدث قبل إطلاق [`الحدث 'exit'`](/ar/nodejs/api/worker_threads#event-exit)، فسيتم رفض `الوعد` الذي تم إرجاعه على الفور مع خطأ [`ERR_WORKER_NOT_RUNNING`](/ar/nodejs/api/errors#err_worker_not_running).


### `worker.performance` {#workerperformance}

**أُضيف في:** v15.1.0, v14.17.0, v12.22.0

كائن يمكن استخدامه للاستعلام عن معلومات الأداء من مثيل عامل. مشابه لـ [`perf_hooks.performance`](/ar/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**أُضيف في:** v15.1.0, v14.17.0, v12.22.0

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) نتيجة استدعاء سابق لـ `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) نتيجة استدعاء سابق لـ `eventLoopUtilization()` قبل `utilization1`.
- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

نفس الاستدعاء مثل [`perf_hooks` `eventLoopUtilization()`](/ar/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2)، باستثناء أن قيم مثيل العامل يتم إرجاعها.

أحد الاختلافات هو أنه على عكس الخيط الرئيسي، يتم إجراء التهيئة (bootstrapping) داخل العامل داخل حلقة الأحداث. لذلك، يصبح استخدام حلقة الأحداث متاحًا على الفور بمجرد أن يبدأ البرنامج النصي للعامل في التنفيذ.

إن وقت `idle` الذي لا يزيد لا يشير إلى أن العامل عالق في التهيئة. توضح الأمثلة التالية كيف أن العمر الكامل للعامل لا يجمع أي وقت `idle`، ولكنه لا يزال قادرًا على معالجة الرسائل.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
يتوفر استخدام حلقة الأحداث للعامل فقط بعد انبعاث [`'online'` event](/ar/nodejs/api/worker_threads#event-online)، وإذا تم استدعاؤه قبل ذلك، أو بعد [`'exit'` event](/ar/nodejs/api/worker_threads#event-exit)، فإن جميع الخصائص لها القيمة `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**تمت الإضافة في: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرسال رسالة إلى العامل يتم استقبالها عبر [`require('node:worker_threads').parentPort.on('message')`](/ar/nodejs/api/worker_threads#event-message). انظر [`port.postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist) لمزيد من التفاصيل.

### `worker.ref()` {#workerref}

**تمت الإضافة في: v10.5.0**

عكس `unref()`، استدعاء `ref()` على عامل تم تطبيق `unref()` عليه سابقًا *لا* يسمح للبرنامج بالخروج إذا كان هو المقبض النشط الوحيد المتبقي (السلوك الافتراضي). إذا تم تطبيق `ref()` على العامل، فإن استدعاء `ref()` مرة أخرى ليس له أي تأثير.

### `worker.resourceLimits` {#workerresourcelimits_1}

**تمت الإضافة في: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

يوفر مجموعة قيود موارد محرك JS لسلسلة العامل هذه. إذا تم تمرير الخيار `resourceLimits` إلى مُنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فإن هذا يطابق قيمه.

إذا توقف العامل، فإن القيمة المعادة هي كائن فارغ.

### `worker.stderr` {#workerstderr}

**تمت الإضافة في: v10.5.0**

- [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)

هذا هو دفق قابل للقراءة يحتوي على بيانات مكتوبة إلى [`process.stderr`](/ar/nodejs/api/process#processstderr) داخل سلسلة العامل. إذا لم يتم تمرير `stderr: true` إلى مُنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فسيتم توجيه البيانات إلى دفق [`process.stderr`](/ar/nodejs/api/process#processstderr) للسلسلة الأصل.


### ‏`worker.stdin` {#workerstdin}

**تمت إضافته في: الإصدار v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)

إذا تم تمرير `stdin: true` إلى مُنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فسيكون هذا دفقًا قابلاً للكتابة. ستتاح البيانات المكتوبة في هذا الدفق في سلسلة العمل كـ [`process.stdin`](/ar/nodejs/api/process#processstdin).

### ‏`worker.stdout` {#workerstdout}

**تمت إضافته في: الإصدار v10.5.0**

- [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)

هذا دفق قابل للقراءة يحتوي على بيانات مكتوبة إلى [`process.stdout`](/ar/nodejs/api/process#processstdout) داخل سلسلة العمل. إذا لم يتم تمرير `stdout: true` إلى مُنشئ [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، فستُرسل البيانات إلى دفق [`process.stdout`](/ar/nodejs/api/process#processstdout) الخاص بالسلسلة الأصلية.

### ‏`worker.terminate()` {#workerterminate}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.5.0 | تُرجع هذه الدالة الآن Promise. تمرير استدعاء رد نداء مهمل، وكان عديم الفائدة حتى هذا الإصدار، حيث تم إنهاء العامل بشكل متزامن بالفعل. الإنهاء الآن عملية غير متزامنة بالكامل. |
| v10.5.0 | تمت إضافته في: الإصدار v10.5.0 |
:::

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

أوقف جميع عمليات تنفيذ JavaScript في سلسلة العمل في أقرب وقت ممكن. يُرجع Promise لرمز الخروج الذي يتحقق عند إصدار [`'exit'` event](/ar/nodejs/api/worker_threads#event-exit).

### ‏`worker.threadId` {#workerthreadid_1}

**تمت إضافته في: الإصدار v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

معرف عدد صحيح للسلسلة المرجعية. داخل سلسلة العمل، يتوفر كـ [`require('node:worker_threads').threadId`](/ar/nodejs/api/worker_threads#workerthreadid). هذه القيمة فريدة لكل مثيل `Worker` داخل عملية واحدة.

### ‏`worker.unref()` {#workerunref}

**تمت إضافته في: الإصدار v10.5.0**

يسمح استدعاء `unref()` على عامل للسلسلة بالخروج إذا كان هذا هو المؤشر النشط الوحيد في نظام الأحداث. إذا كان العامل `unref()` بالفعل، فإن استدعاء `unref()` مرة أخرى ليس له أي تأثير.


## ملاحظات {#notes}

### الحظر المتزامن لـ stdio {#synchronous-blocking-of-stdio}

تستخدم `Worker` تمرير الرسائل عبر [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport) لتنفيذ التفاعلات مع `stdio`. هذا يعني أن إخراج `stdio` الصادر من `Worker` يمكن أن يتم حجبه بواسطة التعليمات البرمجية المتزامنة على الطرف المتلقي التي تحجب حلقة أحداث Node.js.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // التكرار لمحاكاة العمل.
  }
} else {
  // سيتم حظر هذا الإخراج بواسطة حلقة for في مؤشر الترابط الرئيسي.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // التكرار لمحاكاة العمل.
  }
} else {
  // سيتم حظر هذا الإخراج بواسطة حلقة for في مؤشر الترابط الرئيسي.
  console.log('foo');
}
```
:::

### إطلاق سلاسل عمليات العامل من نصوص التحميل المسبق {#launching-worker-threads-from-preload-scripts}

توخ الحذر عند إطلاق سلاسل عمليات العامل من نصوص التحميل المسبق (النصوص التي يتم تحميلها وتشغيلها باستخدام علامة سطر الأوامر `-r`). ما لم يتم تعيين خيار `execArgv` بشكل صريح، فإن سلاسل عمليات Worker الجديدة ترث تلقائيًا علامات سطر الأوامر من العملية قيد التشغيل وستقوم بتحميل نفس نصوص التحميل المسبق مثل سلسلة العمليات الرئيسية. إذا كان نص التحميل المسبق يطلق سلسلة عمليات عامل بشكل غير مشروط، فستقوم كل سلسلة عمليات يتم إنشاؤها بإنشاء أخرى حتى يتعطل التطبيق.

