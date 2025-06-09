---
title: توثيق Node.js - Async Hooks
description: استكشف واجهة برمجة التطبيقات Async Hooks في Node.js، التي توفر طريقة لتتبع دورة حياة الموارد غير المتزامنة في تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Async Hooks | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف واجهة برمجة التطبيقات Async Hooks في Node.js، التي توفر طريقة لتتبع دورة حياة الموارد غير المتزامنة في تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Async Hooks | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف واجهة برمجة التطبيقات Async Hooks في Node.js، التي توفر طريقة لتتبع دورة حياة الموارد غير المتزامنة في تطبيقات Node.js.
---


# خطافات غير متزامنة {#async-hooks}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي. يرجى الترحيل بعيدًا عن واجهة برمجة التطبيقات هذه، إذا استطعت. لا نوصي باستخدام واجهات برمجة التطبيقات [`createHook`](/ar/nodejs/api/async_hooks#async_hookscreatehookcallbacks) و [`AsyncHook`](/ar/nodejs/api/async_hooks#class-asynchook) و [`executionAsyncResource`](/ar/nodejs/api/async_hooks#async_hooksexecutionasyncresource) لأن لديها مشكلات في سهولة الاستخدام ومخاطر تتعلق بالسلامة وتأثيرات على الأداء. تتم خدمة حالات استخدام تتبع السياق غير المتزامن بشكل أفضل بواسطة واجهة برمجة التطبيقات المستقرة [`AsyncLocalStorage`](/ar/nodejs/api/async_context#class-asynclocalstorage). إذا كان لديك حالة استخدام لـ `createHook` أو `AsyncHook` أو `executionAsyncResource` تتجاوز الحاجة إلى تتبع السياق التي تم حلها بواسطة [`AsyncLocalStorage`](/ar/nodejs/api/async_context#class-asynclocalstorage) أو بيانات التشخيص التي توفرها حاليًا [قناة التشخيص](/ar/nodejs/api/diagnostics_channel)، فيرجى فتح مشكلة على [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) تصف حالة الاستخدام الخاصة بك حتى نتمكن من إنشاء واجهة برمجة تطبيقات أكثر تركيزًا على الهدف.
:::

**شفرة المصدر:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

نحن نثبط بشدة استخدام واجهة برمجة التطبيقات `async_hooks`. تتضمن واجهات برمجة التطبيقات الأخرى التي يمكن أن تغطي معظم حالات استخدامها ما يلي:

- [`AsyncLocalStorage`](/ar/nodejs/api/async_context#class-asynclocalstorage) لتتبع السياق غير المتزامن
- [`process.getActiveResourcesInfo()`](/ar/nodejs/api/process#processgetactiveresourcesinfo) لتتبع الموارد النشطة

توفر الوحدة النمطية `node:async_hooks` واجهة برمجة تطبيقات لتتبع الموارد غير المتزامنة. يمكن الوصول إليه باستخدام:

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## المصطلحات {#terminology}

يمثل المورد غير المتزامن كائنًا مع استدعاء مرتبط. قد يتم استدعاء هذا الاستدعاء عدة مرات، مثل حدث `'connection'` في `net.createServer()`، أو مرة واحدة فقط كما في `fs.open()`. يمكن أيضًا إغلاق المورد قبل استدعاء الاستدعاء. لا يميز `AsyncHook` صراحةً بين هذه الحالات المختلفة ولكنه سيمثلها على أنها المفهوم المجرد الذي يمثل موردًا.

إذا تم استخدام [`Worker`](/ar/nodejs/api/worker_threads#class-worker)s، فسيكون لكل مؤشر ترابط واجهة `async_hooks` مستقلة، وسيستخدم كل مؤشر ترابط مجموعة جديدة من معرّفات غير متزامنة.


## نظرة عامة {#overview}

فيما يلي نظرة عامة بسيطة على واجهة برمجة التطبيقات العامة.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// إرجاع مُعرّف سياق التنفيذ الحالي.
const eid = async_hooks.executionAsyncId();

// إرجاع مُعرّف المقبض المسؤول عن تشغيل استدعاء النطاق الحالي للتنفيذ.
const tid = async_hooks.triggerAsyncId();

// إنشاء مثيل AsyncHook جديد. جميع عمليات الاسترجاع هذه اختيارية.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// السماح لعمليات الاسترجاع لهذا المثيل AsyncHook بالاتصال. هذا ليس ضمنيًا
// إجراء بعد تشغيل الدالة البنائية، ويجب تشغيله صراحةً لبدء
// تنفيذ عمليات الاسترجاع.
asyncHook.enable();

// تعطيل الاستماع إلى الأحداث غير المتزامنة الجديدة.
asyncHook.disable();

//
// فيما يلي عمليات الاسترجاع التي يمكن تمريرها إلى createHook().
//

// يتم استدعاء init() أثناء إنشاء الكائن. قد لا يكون المورد قد اكتمل
// الإنشاء عند تشغيل عملية الاسترجاع هذه. لذلك، جميع حقول
// المورد المشار إليه بواسطة "asyncId" قد لا يكون قد تم ملؤه.
function init(asyncId, type, triggerAsyncId, resource) { }

// يتم استدعاء before() قبل استدعاء عملية استرجاع المورد مباشرةً. يمكن أن يكون
// تم استدعاؤه 0-N مرة للمقابض (مثل TCPWrap)، وسيتم استدعاؤه مرة واحدة بالضبط
// الوقت للطلبات (مثل FSReqCallback).
function before(asyncId) { }

// يتم استدعاء after() بعد انتهاء عملية استرجاع المورد مباشرةً.
function after(asyncId) { }

// يتم استدعاء destroy() عند تدمير المورد.
function destroy(asyncId) { }

// يتم استدعاء promiseResolve() فقط لموارد الوعد، عندما يكون
// يتم استدعاء الدالة resolve() التي تم تمريرها إلى مُنشئ الوعد
// (إما مباشرةً أو عبر وسائل أخرى لحل الوعد).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// إرجاع مُعرّف سياق التنفيذ الحالي.
const eid = async_hooks.executionAsyncId();

// إرجاع مُعرّف المقبض المسؤول عن تشغيل استدعاء النطاق الحالي للتنفيذ.
const tid = async_hooks.triggerAsyncId();

// إنشاء مثيل AsyncHook جديد. جميع عمليات الاسترجاع هذه اختيارية.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// السماح لعمليات الاسترجاع لهذا المثيل AsyncHook بالاتصال. هذا ليس ضمنيًا
// إجراء بعد تشغيل الدالة البنائية، ويجب تشغيله صراحةً لبدء
// تنفيذ عمليات الاسترجاع.
asyncHook.enable();

// تعطيل الاستماع إلى الأحداث غير المتزامنة الجديدة.
asyncHook.disable();

//
// فيما يلي عمليات الاسترجاع التي يمكن تمريرها إلى createHook().
//

// يتم استدعاء init() أثناء إنشاء الكائن. قد لا يكون المورد قد اكتمل
// الإنشاء عند تشغيل عملية الاسترجاع هذه. لذلك، جميع حقول
// المورد المشار إليه بواسطة "asyncId" قد لا يكون قد تم ملؤه.
function init(asyncId, type, triggerAsyncId, resource) { }

// يتم استدعاء before() قبل استدعاء عملية استرجاع المورد مباشرةً. يمكن أن يكون
// تم استدعاؤه 0-N مرة للمقابض (مثل TCPWrap)، وسيتم استدعاؤه مرة واحدة بالضبط
// الوقت للطلبات (مثل FSReqCallback).
function before(asyncId) { }

// يتم استدعاء after() بعد انتهاء عملية استرجاع المورد مباشرةً.
function after(asyncId) { }

// يتم استدعاء destroy() عند تدمير المورد.
function destroy(asyncId) { }

// يتم استدعاء promiseResolve() فقط لموارد الوعد، عندما يكون
// يتم استدعاء الدالة resolve() التي تم تمريرها إلى مُنشئ الوعد
// (إما مباشرةً أو عبر وسائل أخرى لحل الوعد).
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**تمت إضافته في: الإصدار 8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [استدعاءات خطاف](/ar/nodejs/api/async_hooks#hook-callbacks) للتسجيل
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [استدعاء `init`](/ar/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [استدعاء `before`](/ar/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [استدعاء `after`](/ar/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [استدعاء `destroy`](/ar/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [استدعاء `promiseResolve`](/ar/nodejs/api/async_hooks#promiseresolveasyncid).
  
 
- الإرجاع: [\<AsyncHook\>](/ar/nodejs/api/async_hooks#async_hookscreatehookcallbacks) المثيل المستخدم لتعطيل وتمكين الخطافات

يسجل الدوال التي سيتم استدعاؤها لأحداث دورة الحياة المختلفة لكل عملية غير متزامنة.

يتم استدعاء استدعاءات `init()`/`before()`/`after()`/`destroy()` للحدث غير المتزامن ذي الصلة خلال دورة حياة المورد.

جميع الاستدعاءات اختيارية. على سبيل المثال، إذا كانت هناك حاجة فقط لتتبع تنظيف الموارد، فيجب تمرير استدعاء `destroy` فقط. توجد تفاصيل جميع الدوال التي يمكن تمريرها إلى `callbacks` في قسم [استدعاءات خطاف](/ar/nodejs/api/async_hooks#hook-callbacks).



::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

سيتم توريث الاستدعاءات عبر سلسلة النموذج الأولي:

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
نظرًا لأن الوعود هي موارد غير متزامنة يتم تتبع دورة حياتها عبر آلية الخطافات غير المتزامنة، فإن استدعاءات `init()` و`before()` و`after()` و`destroy()` *يجب ألا* تكون دوال غير متزامنة تُرجع وعودًا.


### معالجة الأخطاء {#error-handling}

إذا أطلقت أي ردود نداء `AsyncHook` أخطاء، فسيقوم التطبيق بطباعة تتبع المكدس والخروج. يتبع مسار الخروج هذا مسار الاستثناء غير الملتقط، ولكن تتم إزالة جميع مستمعي `'uncaughtException'`، مما يجبر العملية على الخروج. سيظل يتم استدعاء ردود نداء `'exit'` ما لم يتم تشغيل التطبيق باستخدام `--abort-on-uncaught-exception`، وفي هذه الحالة ستتم طباعة تتبع المكدس وسيخرج التطبيق، تاركًا ملفًا أساسيًا.

السبب وراء سلوك معالجة الأخطاء هذا هو أن ردود النداء هذه تعمل في نقاط متقلبة محتملة في عمر الكائن، على سبيل المثال أثناء إنشاء الفئة وتدميرها. لهذا السبب، يُعتبر من الضروري إيقاف العملية بسرعة من أجل منع الإجهاض غير المقصود في المستقبل. هذا عرضة للتغيير في المستقبل إذا تم إجراء تحليل شامل لضمان أن الاستثناء يمكن أن يتبع تدفق التحكم العادي دون آثار جانبية غير مقصودة.

### الطباعة في ردود نداء `AsyncHook` {#printing-in-asynchook-callbacks}

نظرًا لأن الطباعة إلى وحدة التحكم هي عملية غير متزامنة، فإن `console.log()` ستتسبب في استدعاء ردود نداء `AsyncHook`. سيؤدي استخدام `console.log()` أو العمليات غير المتزامنة المماثلة داخل وظيفة رد نداء `AsyncHook` إلى تكرار لا نهائي. الحل السهل لذلك عند التصحيح هو استخدام عملية تسجيل متزامنة مثل `fs.writeFileSync(file, msg, flag)`. سيؤدي هذا إلى الطباعة إلى الملف ولن يستدعي `AsyncHook` بشكل متكرر لأنه متزامن.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

إذا كانت هناك حاجة إلى عملية غير متزامنة لتسجيل الدخول، فمن الممكن تتبع سبب العملية غير المتزامنة باستخدام المعلومات التي توفرها `AsyncHook` نفسها. يجب بعد ذلك تخطي تسجيل الدخول عندما يكون تسجيل الدخول نفسه هو الذي تسبب في استدعاء رد نداء `AsyncHook`. من خلال القيام بذلك، يتم كسر التكرار اللانهائي بخلاف ذلك.


## الفئة: `AsyncHook` {#class-asynchook}

تكشف الفئة `AsyncHook` عن واجهة لتتبع أحداث دورة حياة العمليات غير المتزامنة.

### `asyncHook.enable()` {#asynchookenable}

- الإرجاع: [\<AsyncHook\>](/ar/nodejs/api/async_hooks#async_hookscreatehookcallbacks) مرجع إلى `asyncHook`.

تمكين ردود الاتصال لمثيل `AsyncHook` معين. إذا لم يتم توفير ردود اتصال، فإن التمكين هو عملية لا تفعل شيئًا.

يتم تعطيل مثيل `AsyncHook` افتراضيًا. إذا كان يجب تمكين مثيل `AsyncHook` فور إنشائه، فيمكن استخدام النمط التالي.



::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- الإرجاع: [\<AsyncHook\>](/ar/nodejs/api/async_hooks#async_hookscreatehookcallbacks) مرجع إلى `asyncHook`.

تعطيل ردود الاتصال لمثيل `AsyncHook` معين من المجموعة العامة لردود اتصال `AsyncHook` ليتم تنفيذها. بمجرد تعطيل خطاف، لن يتم استدعاؤه مرة أخرى حتى يتم تمكينه.

للحفاظ على اتساق واجهة برمجة التطبيقات، تُرجع `disable()` أيضًا مثيل `AsyncHook`.

### ردود اتصال الخطاف {#hook-callbacks}

تم تصنيف الأحداث الرئيسية في دورة حياة الأحداث غير المتزامنة إلى أربعة مجالات: إنشاء مثيل، وقبل/بعد استدعاء رد الاتصال، وعند تدمير المثيل.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف فريد للمورد غير المتزامن.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع المورد غير المتزامن.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المعرف الفريد للمورد غير المتزامن الذي تم إنشاء هذا المورد غير المتزامن في سياق تنفيذه.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مرجع إلى المورد الذي يمثل العملية غير المتزامنة، ويجب تحريره أثناء *التدمير*.

يتم استدعاؤه عند إنشاء فئة لديها *إمكانية* إطلاق حدث غير متزامن. هذا *لا* يعني أنه يجب على المثيل استدعاء `before`/`after` قبل استدعاء `destroy`، فقط أن الإمكانية موجودة.

يمكن ملاحظة هذا السلوك عن طريق القيام بشيء مثل فتح مورد ثم إغلاقه قبل أن يتم استخدام المورد. يوضح المقتطف التالي ذلك.



::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

يتم تعيين معرف لكل مورد جديد يكون فريدًا ضمن نطاق مثيل Node.js الحالي.


##### `type` {#type}

الـ `type` عبارة عن سلسلة تحدد نوع المورد الذي تسبب في استدعاء `init`. بشكل عام، سيتوافق مع اسم مُنشئ المورد.

يمكن أن يتغير الـ `type` الخاص بالموارد التي تم إنشاؤها بواسطة Node.js نفسها في أي إصدار من Node.js. تتضمن القيم الصالحة `TLSWRAP` و `TCPWRAP` و `TCPSERVERWRAP` و `GETADDRINFOREQWRAP` و `FSREQCALLBACK` و `Microtask` و `Timeout`. تفقد كود المصدر لإصدار Node.js المستخدم للحصول على القائمة الكاملة.

علاوة على ذلك، يقوم مستخدمو [`AsyncResource`](/ar/nodejs/api/async_context#class-asyncresource) بإنشاء موارد غير متزامنة بشكل مستقل عن Node.js نفسها.

هناك أيضًا نوع مورد `PROMISE`، والذي يستخدم لتتبع مثيلات `Promise` والعمل غير المتزامن الذي تم جدولته بواسطتها.

يمكن للمستخدمين تحديد `type` الخاص بهم عند استخدام واجهة برمجة التطبيقات المضمنة العامة.

من الممكن حدوث تصادمات في أسماء الأنواع. يتم تشجيع المضمنين على استخدام بادئات فريدة، مثل اسم حزمة npm، لمنع التصادمات عند الاستماع إلى الخطافات.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` هو `asyncId` الخاص بالمرجع الذي تسبب (أو "أثار") تهيئة المرجع الجديد وتسبب في استدعاء `init`. يختلف هذا عن `async_hooks.executionAsyncId()` الذي يعرض فقط *متى* تم إنشاء مورد، بينما يُظهر `triggerAsyncId` *لماذا* تم إنشاء مورد.

فيما يلي عرض توضيحي بسيط لـ `triggerAsyncId`:

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net';
const fs = require('node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

الإخراج عند الوصول إلى الخادم باستخدام `nc localhost 8080`:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
`TCPSERVERWRAP` هو الخادم الذي يستقبل الاتصالات.

`TCPWRAP` هو الاتصال الجديد من العميل. عند إجراء اتصال جديد، يتم إنشاء مثيل `TCPWrap` على الفور. يحدث هذا خارج أي مكدس JavaScript. (يعني `executionAsyncId()` بقيمة `0` أنه يتم تنفيذه من C++ بدون أي مكدس JavaScript أعلاه.) بهذه المعلومات وحدها، سيكون من المستحيل ربط الموارد ببعضها البعض من حيث ما تسبب في إنشائها، لذلك يتم إعطاء `triggerAsyncId` مهمة نشر المورد المسؤول عن وجود المورد الجديد.


##### `resource` {#resource}

`resource` هو كائن يمثل موردًا غير متزامن فعليًا تم تهيئته. يمكن تحديد واجهة برمجة التطبيقات للوصول إلى الكائن بواسطة مُنشئ المورد. الموارد التي تم إنشاؤها بواسطة Node.js نفسها داخلية وقد تتغير في أي وقت. لذلك لم يتم تحديد واجهة برمجة تطبيقات لهذه الموارد.

في بعض الحالات، يتم إعادة استخدام كائن المورد لأسباب تتعلق بالأداء، وبالتالي ليس من الآمن استخدامه كمفتاح في `WeakMap` أو إضافة خصائص إليه.

##### مثال على سياق غير متزامن {#asynchronous-context-example}

تتم تغطية حالة استخدام تتبع السياق بواسطة واجهة برمجة التطبيقات المستقرة [`AsyncLocalStorage`](/ar/nodejs/api/async_context#class-asynclocalstorage). يوضح هذا المثال فقط عملية ربط غير متزامن ولكن [`AsyncLocalStorage`](/ar/nodejs/api/async_context#class-asynclocalstorage) يناسب حالة الاستخدام هذه بشكل أفضل.

فيما يلي مثال مع معلومات إضافية حول المكالمات إلى `init` بين مكالمات `before` و `after`، وتحديدًا كيف سيبدو رد الاتصال إلى `listen()`. تم تنسيق الإخراج بشكل أكثر تفصيلاً لتسهيل رؤية سياق المكالمة.



::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

إخراج من بدء تشغيل الخادم فقط:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
كما هو موضح في المثال، تحدد `executionAsyncId()` و `execution` قيمة سياق التنفيذ الحالي؛ والذي يتم تحديده بواسطة المكالمات إلى `before` و `after`.

ينتج عن استخدام `execution` فقط لرسم نتائج تخصيص الموارد ما يلي:

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
`TCPSERVERWRAP` ليس جزءًا من هذا الرسم البياني، على الرغم من أنه كان سبب استدعاء `console.log()`. وذلك لأن الربط بمنفذ بدون اسم مضيف هو عملية *متزامنة*، ولكن للحفاظ على واجهة برمجة تطبيقات غير متزامنة تمامًا، يتم وضع رد اتصال المستخدم في `process.nextTick()`. هذا هو السبب في وجود `TickObject` في الإخراج وهو "أصل" لـ `listen()` رد الاتصال.

يُظهر الرسم البياني *متى* تم إنشاء مورد فقط، وليس *لماذا*، لذلك لتتبع *السبب* استخدم `triggerAsyncId`. والتي يمكن تمثيلها بالرسم البياني التالي:

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عندما يتم بدء عملية غير متزامنة (مثل استقبال خادم TCP اتصالاً جديدًا) أو اكتمالها (مثل كتابة البيانات على القرص)، يتم استدعاء رد نداء لإعلام المستخدم. يتم استدعاء رد نداء `before` قبل تنفيذ رد النداء المذكور مباشرةً. `asyncId` هو المعرف الفريد المخصص للمورد الذي على وشك تنفيذ رد النداء.

سيتم استدعاء رد نداء `before` من 0 إلى N مرة. سيتم استدعاء رد نداء `before` عادةً 0 مرة إذا تم إلغاء العملية غير المتزامنة أو، على سبيل المثال، إذا لم يتم استقبال أي اتصالات بواسطة خادم TCP. عادةً ما تستدعي الموارد غير المتزامنة المستمرة مثل خادم TCP رد نداء `before` عدة مرات، بينما تستدعي العمليات الأخرى مثل `fs.open()` مرة واحدة فقط.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم استدعاؤه مباشرةً بعد اكتمال رد النداء المحدد في `before`.

إذا حدث استثناء غير معالج أثناء تنفيذ رد النداء، فسيتم تشغيل `after` *بعد* إصدار حدث `'uncaughtException'` أو تشغيل معالج `domain`.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم استدعاؤه بعد تدمير المورد المقابل لـ `asyncId`. يتم استدعاؤه أيضًا بشكل غير متزامن من واجهة برمجة تطبيقات التضمين `emitDestroy()`.

تعتمد بعض الموارد على جمع القمامة للتنظيف، لذلك إذا تم إجراء إشارة إلى كائن `resource` الذي تم تمريره إلى `init`، فمن المحتمل ألا يتم استدعاء `destroy` أبدًا، مما يتسبب في تسرب الذاكرة في التطبيق. إذا كان المورد لا يعتمد على جمع القمامة، فلن تكون هذه مشكلة.

يؤدي استخدام خطاف التدمير إلى زيادة النفقات العامة الإضافية لأنه يمكّن تتبع مثيلات `Promise` عبر جامع القمامة.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**تمت الإضافة في: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم استدعاؤه عند استدعاء وظيفة `resolve` التي تم تمريرها إلى مُنشئ `Promise` (إما مباشرةً أو من خلال وسائل أخرى لحل الوعد).

لا يقوم `resolve()` بأي عمل متزامن يمكن ملاحظته.

ليس من الضروري أن يتم تحقيق `Promise` أو رفضه في هذه المرحلة إذا تم حل `Promise` من خلال افتراض حالة `Promise` آخر.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
يستدعي ردود النداء التالية:

```text [TEXT]
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # corresponds to resolve(true)
init for PROMISE with id 6, trigger id: 5  # the Promise returned by then()
  before 6               # the then() callback is entered
  promise resolve 6      # the then() callback resolves the promise by returning
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**أُضيف في: v13.9.0, v12.17.0**

- يُعيد: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) المورد الذي يمثل التنفيذ الحالي. مفيد لتخزين البيانات داخل المورد.

كائنات الموارد التي يتم إرجاعها بواسطة `executionAsyncResource()` هي في الغالب كائنات معالجة داخلية لـ Node.js مع واجهات برمجة تطبيقات غير موثقة. من المحتمل أن يؤدي استخدام أي وظائف أو خصائص على الكائن إلى تعطل تطبيقك ويجب تجنب ذلك.

سيؤدي استخدام `executionAsyncResource()` في سياق التنفيذ ذي المستوى الأعلى إلى إرجاع كائن فارغ لأنه لا يوجد كائن معالجة أو طلب لاستخدامه، ولكن وجود كائن يمثل المستوى الأعلى يمكن أن يكون مفيدًا.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

يمكن استخدام هذا لتنفيذ مساحة تخزين محلية للاستمرار دون استخدام `Map` لتتبع البيانات الوصفية:

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // رمز خاص لتجنب التلوث

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // رمز خاص لتجنب التلوث

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v8.2.0 | تمت إعادة تسميتها من `currentId`. |
| v8.1.0 | تمت إضافتها في: v8.1.0 |
:::

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف `asyncId` لسياق التنفيذ الحالي. مفيد لتتبع متى يتم استدعاء شيء ما.



::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

يرتبط المُعرّف الذي يتم إرجاعه من `executionAsyncId()` بتوقيت التنفيذ، وليس السببية (التي يغطيها `triggerAsyncId()`):

```js [ESM]
const server = net.createServer((conn) => {
  // يُرجع مُعرّف الخادم، وليس مُعرّف الاتصال الجديد، لأن
  // الدالة المستدعاة تعمل في نطاق تنفيذ MakeCallback() الخاص بالخادم.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // يُرجع مُعرّف TickObject ‏(process.nextTick()) لأن جميع
  // الدوال المستدعاة التي تم تمريرها إلى .listen() مضمنة في nextTick().
  async_hooks.executionAsyncId();
});
```
قد لا تحصل سياقات الوعد (Promise) على `executionAsyncIds` دقيقة بشكل افتراضي. راجع القسم الخاص بـ [تتبع تنفيذ الوعد](/ar/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف المورد المسؤول عن استدعاء الدالة المستدعاة التي يتم تنفيذها حاليًا.

```js [ESM]
const server = net.createServer((conn) => {
  // المورد الذي تسبب في (أو أثار) استدعاء هذه الدالة المستدعاة
  // كان خاصًا بالاتصال الجديد. وبالتالي فإن قيمة الإرجاع لـ triggerAsyncId()
  // هي asyncId الخاص بـ "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // على الرغم من أن جميع الدوال المستدعاة التي تم تمريرها إلى .listen() مضمنة في nextTick()
  // إلا أن الدالة المستدعاة نفسها موجودة بسبب إجراء استدعاء لـ .listen() الخاص بالخادم.
  // لذا ستكون قيمة الإرجاع هي مُعرّف الخادم.
  async_hooks.triggerAsyncId();
});
```
قد لا تحصل سياقات الوعد (Promise) على `triggerAsyncId`s صالحة بشكل افتراضي. راجع القسم الخاص بـ [تتبع تنفيذ الوعد](/ar/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**أضيف في: v17.2.0, v16.14.0**

- الإرجاع: خريطة لأنواع المزودات لمعرفها الرقمي المقابل. تحتوي هذه الخريطة على جميع أنواع الأحداث التي قد تنبعث من حدث `async_hooks.init()`.

هذه الميزة تقمع الاستخدام المهمل لـ `process.binding('async_wrap').Providers`. انظر: [DEP0111](/ar/nodejs/api/deprecations#dep0111-processbinding)

## تتبع تنفيذ الوعد {#promise-execution-tracking}

افتراضيًا، لا يتم تعيين `asyncId`s لعمليات تنفيذ الوعد نظرًا للطبيعة المكلفة نسبيًا لـ [واجهة برمجة تطبيقات استبطان الوعد](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) التي توفرها V8. هذا يعني أن البرامج التي تستخدم الوعود أو `async`/`await` لن تحصل على معرفات التنفيذ والمحفز الصحيحة لسياقات رد الاتصال للوعد بشكل افتراضي.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

لاحظ أن رد الاتصال `then()` يدعي أنه تم تنفيذه في سياق النطاق الخارجي على الرغم من وجود قفزة غير متزامنة. أيضًا، قيمة `triggerAsyncId` هي `0`، مما يعني أننا نفتقد السياق حول المورد الذي تسبب (أطلق) تنفيذ رد الاتصال `then()`.

يتيح تثبيت خطافات غير متزامنة عبر `async_hooks.createHook` تتبع تنفيذ الوعد:

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

في هذا المثال، أدى إضافة أي دالة خطاف فعلية إلى تمكين تتبع الوعود. يوجد وعدان في المثال أعلاه؛ الوعد الذي تم إنشاؤه بواسطة `Promise.resolve()` والوعد الذي تم إرجاعه بواسطة استدعاء `then()`. في المثال أعلاه، حصل الوعد الأول على `asyncId` بقيمة `6` وحصل الأخير على `asyncId` بقيمة `7`. أثناء تنفيذ رد الاتصال `then()`، فإننا ننفذ في سياق الوعد مع `asyncId` بقيمة `7`. تم تشغيل هذا الوعد بواسطة مورد غير متزامن `6`.

هناك دقة أخرى في الوعود وهي أن ردود الاتصال `before` و `after` يتم تشغيلها فقط على الوعود المتسلسلة. هذا يعني أن الوعود التي لم يتم إنشاؤها بواسطة `then()`/`catch()` لن يتم إطلاق ردود الاتصال `before` و `after` عليها. لمزيد من التفاصيل، راجع تفاصيل V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) API.


## واجهة برمجة تطبيقات JavaScript للتضمين {#javascript-embedder-api}

يمكن لمطوري المكتبات الذين يتعاملون مع مواردهم غير المتزامنة بأنفسهم ويؤدون مهامًا مثل الإدخال/الإخراج، وتجميع الاتصالات، أو إدارة قوائم الانتظار الخاصة بالاستدعاءات استخدام واجهة برمجة تطبيقات JavaScript لـ `AsyncResource` بحيث يتم استدعاء جميع الاستدعاءات المناسبة.

### الصنف: `AsyncResource` {#class-asyncresource}

تم نقل وثائق هذا الصنف [`AsyncResource`](/ar/nodejs/api/async_context#class-asyncresource).

## الصنف: `AsyncLocalStorage` {#class-asynclocalstorage}

تم نقل وثائق هذا الصنف [`AsyncLocalStorage`](/ar/nodejs/api/async_context#asynclocalstorage).

