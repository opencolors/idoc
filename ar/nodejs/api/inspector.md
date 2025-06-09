---
title: توثيق وحدة Node.js Inspector
description: توفر وحدة Node.js Inspector واجهة برمجة التطبيقات للتفاعل مع أداة الفحص V8، مما يسمح للمطورين بتصحيح تطبيقات Node.js من خلال الاتصال ببروتوكول الفحص.
head:
  - - meta
    - name: og:title
      content: توثيق وحدة Node.js Inspector | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة Node.js Inspector واجهة برمجة التطبيقات للتفاعل مع أداة الفحص V8، مما يسمح للمطورين بتصحيح تطبيقات Node.js من خلال الاتصال ببروتوكول الفحص.
  - - meta
    - name: twitter:title
      content: توثيق وحدة Node.js Inspector | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة Node.js Inspector واجهة برمجة التطبيقات للتفاعل مع أداة الفحص V8، مما يسمح للمطورين بتصحيح تطبيقات Node.js من خلال الاتصال ببروتوكول الفحص.
---


# المفتش (Inspector) {#inspector}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

توفر وحدة `node:inspector` واجهة برمجة تطبيقات (API) للتفاعل مع مفتش V8.

يمكن الوصول إليه باستخدام:

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

أو

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## واجهة برمجة تطبيقات الوعود (Promises API) {#promises-api}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

**تمت الإضافة في: v19.0.0**

### الصنف: `inspector.Session` {#class-inspectorsession}

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يُستخدم `inspector.Session` لإرسال الرسائل إلى الواجهة الخلفية لمفتش V8 وتلقي استجابات الرسائل والإشعارات.

#### `new inspector.Session()` {#new-inspectorsession}

**تمت الإضافة في: v8.0.0**

إنشاء نسخة جديدة من الصنف `inspector.Session`. يجب توصيل جلسة المفتش من خلال [`session.connect()`](/ar/nodejs/api/inspector#sessionconnect) قبل إمكانية إرسال الرسائل إلى الواجهة الخلفية للمفتش.

عند استخدام `Session`، لن يتم تحرير الكائن الناتج بواسطة واجهة برمجة تطبيقات وحدة التحكم (console API)، إلا إذا نفذنا يدويًا الأمر `Runtime.DiscardConsoleEntries`.

#### الحدث: `'inspectorNotification'` {#event-inspectornotification}

**تمت الإضافة في: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن رسالة الإشعار

يتم إطلاقه عند تلقي أي إشعار من مفتش V8.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
من الممكن أيضًا الاشتراك فقط في الإشعارات ذات طريقة محددة:


#### الحدث: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**أُضيف في: الإصدار v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن رسالة الإشعار

يتم إصداره عند استلام إشعار من المُدقق يحتوي على حقل `method` مُعيّنًا إلى القيمة `\<inspector-protocol-method\>`.

يقوم المقتطف التالي بتثبيت مستمع على الحدث [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused)، وطباعة سبب تعليق البرنامج كلما تم تعليق تنفيذ البرنامج (من خلال نقاط التوقف، على سبيل المثال):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**أُضيف في: الإصدار v8.0.0**

يربط جلسة بالواجهة الخلفية للمُدقق.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**أُضيف في: الإصدار v12.11.0**

يربط جلسة بالواجهة الخلفية للمُدقق للخيط الرئيسي. سيتم طرح استثناء إذا لم يتم استدعاء واجهة برمجة التطبيقات هذه في خيط العامل.

#### `session.disconnect()` {#sessiondisconnect}

**أُضيف في: الإصدار v8.0.0**

يغلق الجلسة على الفور. سيتم استدعاء جميع عمليات معاودة الاتصال بالرسائل المعلقة بخطأ. يجب استدعاء [`session.connect()`](/ar/nodejs/api/inspector#sessionconnect) لتتمكن من إرسال الرسائل مرة أخرى. ستفقد الجلسة التي أعيد توصيلها جميع حالات المُدقق، مثل العوامل الممكنة أو نقاط التوقف التي تم تكوينها.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**أُضيف في: الإصدار v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ينشر رسالة إلى الواجهة الخلفية للمُدقق.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
يتم نشر أحدث إصدار من بروتوكول V8 للمُدقق على [عارض بروتوكول Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/v8/).

يدعم مُدقق Node.js جميع نطاقات بروتوكول Chrome DevTools التي أعلنتها V8. يوفر نطاق بروتوكول Chrome DevTools واجهة للتفاعل مع أحد عوامل وقت التشغيل المستخدمة لفحص حالة التطبيق والاستماع إلى أحداث وقت التشغيل.


#### مثال للاستخدام {#example-usage}

بصرف النظر عن مصحح الأخطاء، تتوفر العديد من أدوات V8 Profilers من خلال بروتوكول DevTools.

##### محلل وحدة المعالجة المركزية (CPU) {#cpu-profiler}

إليك مثال يوضح كيفية استخدام [محلل وحدة المعالجة المركزية (CPU)](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invoke business logic under measurement here...

// some time later...
const { profile } = await session.post('Profiler.stop');

// Write profile to disk, upload, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### محلل الذاكرة المكدسة (Heap) {#heap-profiler}

إليك مثال يوضح كيفية استخدام [محلل الذاكرة المكدسة (Heap)](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## واجهة برمجة تطبيقات الاستدعاء (Callback API) {#callback-api}

### صنف: `inspector.Session` {#class-inspectorsession_1}

- يمتد من: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يتم استخدام `inspector.Session` لإرسال الرسائل إلى الواجهة الخلفية لمفتش V8 وتلقي استجابات الرسائل والإشعارات.

#### `new inspector.Session()` {#new-inspectorsession_1}

**تمت الإضافة في: v8.0.0**

قم بإنشاء مثيل جديد لفئة `inspector.Session`. يجب توصيل جلسة المفتش من خلال [`session.connect()`](/ar/nodejs/api/inspector#sessionconnect) قبل أن يتم إرسال الرسائل إلى الواجهة الخلفية للمفتش.

عند استخدام `Session`، لن يتم تحرير الكائن الناتج عن واجهة برمجة تطبيقات وحدة التحكم (console API)، ما لم ننفذ أمر `Runtime.DiscardConsoleEntries` يدويًا.


#### الحدث: `'inspectorNotification'` {#event-inspectornotification_1}

**تمت إضافته في: الإصدار 8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن رسالة الإشعار

يُطلق هذا الحدث عند تلقي أي إشعار من V8 Inspector.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
من الممكن أيضًا الاشتراك فقط في الإشعارات التي لها طريقة محددة:

#### الحدث: `&lt;inspector-protocol-method&gt;`؛ {#event-&lt;inspector-protocol-method&gt;;_1}

**تمت إضافته في: الإصدار 8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن رسالة الإشعار

يُطلق هذا الحدث عند تلقي إشعار Inspector تم تعيين حقله method إلى قيمة `\<inspector-protocol-method\>`.

يقوم المقتطف التالي بتثبيت مستمع على حدث [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused)، ويطبع سبب تعليق البرنامج متى تم تعليق تنفيذ البرنامج (من خلال نقاط التوقف، على سبيل المثال):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**تمت إضافته في: الإصدار 8.0.0**

يقوم بتوصيل جلسة عمل بالواجهة الخلفية لـ Inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**تمت إضافته في: الإصدار 12.11.0**

يقوم بتوصيل جلسة عمل بالواجهة الخلفية لـ Inspector في مؤشر الترابط الرئيسي. سيتم طرح استثناء إذا لم يتم استدعاء واجهة برمجة التطبيقات هذه في مؤشر ترابط Worker.

#### `session.disconnect()` {#sessiondisconnect_1}

**تمت إضافته في: الإصدار 8.0.0**

أغلق الجلسة على الفور. سيتم استدعاء جميع استدعاءات الرسائل المعلقة مع وجود خطأ. يجب استدعاء [`session.connect()`](/ar/nodejs/api/inspector#sessionconnect) لتتمكن من إرسال الرسائل مرة أخرى. ستفقد الجلسة المعاد توصيلها جميع حالات Inspector، مثل الوكلاء الممكّنين أو نقاط التوقف التي تم تكوينها.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار 8.0.0 | تمت إضافته في: الإصدار 8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

ينشر رسالة إلى الواجهة الخلفية لـ Inspector. سيتم إعلام `callback` عند تلقي رد. `callback` هي دالة تقبل وسيطتين اختياريتين: خطأ ونتيجة خاصة بالرسالة.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
يتم نشر أحدث إصدار من بروتوكول V8 Inspector على [عارض بروتوكول Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/v8/).

يدعم Node.js Inspector جميع مجالات بروتوكول Chrome DevTools التي أعلنتها V8. يوفر مجال بروتوكول Chrome DevTools واجهة للتفاعل مع أحد وكلاء وقت التشغيل المستخدمين لفحص حالة التطبيق والاستماع إلى أحداث وقت التشغيل.

لا يمكنك تعيين `reportProgress` إلى `true` عند إرسال أمر `HeapProfiler.takeHeapSnapshot` أو `HeapProfiler.stopTrackingHeapObjects` إلى V8.


#### مثال على الاستخدام {#example-usage_1}

بالإضافة إلى مصحح الأخطاء، تتوفر العديد من مُحلِّلات V8 Profilers من خلال بروتوكول DevTools.

##### محلل CPU {#cpu-profiler_1}

فيما يلي مثال يوضح كيفية استخدام [محلل CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Invoke business logic under measurement here...

    // some time later...
    session.post('Profiler.stop', (err, { profile }) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### محلل الذاكرة المؤقتة (Heap) {#heap-profiler_1}

فيما يلي مثال يوضح كيفية استخدام [محلل الذاكرة المؤقتة](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## الكائنات الشائعة {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.10.0 | يتم عرض واجهة برمجة التطبيقات في سلاسل العمل (worker threads). |
| v9.0.0 | تمت الإضافة في: v9.0.0 |
:::

يحاول إغلاق جميع الاتصالات المتبقية، مما يمنع حلقة الأحداث حتى يتم إغلاقها جميعًا. بمجرد إغلاق جميع الاتصالات، يتم إلغاء تنشيط الفاحص.

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن لإرسال الرسائل إلى وحدة تحكم الفاحص البعيدة.

```js [ESM]
require('node:inspector').console.log('a message');
```
لا تتمتع وحدة تحكم الفاحص بتكافؤ واجهة برمجة التطبيقات (API) مع وحدة تحكم Node.js.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v20.6.0 | تُرجع الآن `inspector.open()` كائن `Disposable`. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ للاستماع لاتصالات المدقق. اختياري. **افتراضي:** ما تم تحديده في CLI.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المضيف للاستماع لاتصالات المدقق. اختياري. **افتراضي:** ما تم تحديده في CLI.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) حظر حتى يتم توصيل عميل. اختياري. **افتراضي:** `false`.
- يُرجع: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) كائن Disposable يستدعي [`inspector.close()`](/ar/nodejs/api/inspector#inspectorclose).

تفعيل المدقق على المضيف والمنفذ. مكافئ لـ `node --inspect=[[host:]port]`, ولكن يمكن القيام بذلك برمجيًا بعد بدء تشغيل node.

إذا كانت قيمة wait هي `true`, فسيتم الحظر حتى يتم توصيل عميل بمنفذ الفحص ويتم تمرير التحكم في التدفق إلى عميل التصحيح.

راجع [تحذير الأمان](/ar/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) بشأن استخدام معلمة `host`.

### `inspector.url()` {#inspectorurl}

- يُرجع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

إرجاع عنوان URL للمدقق النشط، أو `undefined` إذا لم يكن هناك أي مدقق نشط.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**إضافة في: v12.7.0**

يحظر حتى يرسل عميل (موجود أو متصل لاحقًا) أمر `Runtime.runIfWaitingForDebugger`.

سيتم طرح استثناء إذا لم يكن هناك مدقق نشط.

## التكامل مع أدوات المطورين {#integration-with-devtools}

توفر الوحدة `node:inspector` واجهة برمجة تطبيقات للتكامل مع أدوات المطورين التي تدعم بروتوكول أدوات المطورين في Chrome. يمكن لواجهات أدوات المطورين المتصلة بمثيل Node.js قيد التشغيل التقاط أحداث البروتوكول المنبعثة من المثيل وعرضها وفقًا لذلك لتسهيل التصحيح. تقوم الطرق التالية ببث حدث بروتوكول إلى جميع الواجهات الأمامية المتصلة. يمكن أن تكون `params` التي تم تمريرها إلى الطرق اختيارية، اعتمادًا على البروتوكول.

```js [ESM]
// سيتم إطلاق حدث `Network.requestWillBeSent`.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**إضافة في: v22.6.0, v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

هذه الميزة متاحة فقط مع تمكين العلامة `--experimental-network-inspection`.

يبث حدث `Network.requestWillBeSent` إلى الواجهات الأمامية المتصلة. يشير هذا الحدث إلى أن التطبيق على وشك إرسال طلب HTTP.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**إضافة في: v22.6.0, v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

هذه الميزة متاحة فقط مع تمكين العلامة `--experimental-network-inspection`.

يبث حدث `Network.responseReceived` إلى الواجهات الأمامية المتصلة. يشير هذا الحدث إلى أن استجابة HTTP متاحة.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**أضيف في: v22.6.0, v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

هذه الميزة متاحة فقط مع تمكين علامة `--experimental-network-inspection`.

يبث حدث `Network.loadingFinished` إلى الواجهات الأمامية المتصلة. يشير هذا الحدث إلى أن تحميل طلب HTTP قد انتهى.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**أضيف في: v22.7.0, v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

هذه الميزة متاحة فقط مع تمكين علامة `--experimental-network-inspection`.

يبث حدث `Network.loadingFailed` إلى الواجهات الأمامية المتصلة. يشير هذا الحدث إلى أن تحميل طلب HTTP قد فشل.

## دعم نقاط التوقف {#support-of-breakpoints}

يسمح نطاق [`Debugger`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) في بروتوكول Chrome DevTools لـ `inspector.Session` بالاتصال ببرنامج وتعيين نقاط توقف للتنقل عبر التعليمات البرمجية.

ومع ذلك، يجب تجنب تعيين نقاط التوقف باستخدام `inspector.Session` في نفس سلسلة الرسائل، والتي يتم توصيلها بواسطة [`session.connect()`](/ar/nodejs/api/inspector#sessionconnect)، حيث أن البرنامج الذي يتم إرفاقه وإيقافه مؤقتًا هو المصحح نفسه تمامًا. بدلاً من ذلك، حاول الاتصال بالسلسلة الرئيسية بواسطة [`session.connectToMainThread()`](/ar/nodejs/api/inspector#sessionconnecttomainthread) وتعيين نقاط التوقف في سلسلة عامل، أو الاتصال ببرنامج [Debugger](/ar/nodejs/api/debugger) عبر اتصال WebSocket.

