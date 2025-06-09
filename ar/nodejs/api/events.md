---
title: توثيق Node.js - الأحداث
description: استكشف وحدة الأحداث في Node.js، التي توفر طريقة للتعامل مع العمليات غير المتزامنة من خلال البرمجة المعتمدة على الأحداث. تعلم عن مُصدري الأحداث، والمستمعين، وكيفية إدارة الأحداث بفعالية.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الأحداث | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف وحدة الأحداث في Node.js، التي توفر طريقة للتعامل مع العمليات غير المتزامنة من خلال البرمجة المعتمدة على الأحداث. تعلم عن مُصدري الأحداث، والمستمعين، وكيفية إدارة الأحداث بفعالية.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الأحداث | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف وحدة الأحداث في Node.js، التي توفر طريقة للتعامل مع العمليات غير المتزامنة من خلال البرمجة المعتمدة على الأحداث. تعلم عن مُصدري الأحداث، والمستمعين، وكيفية إدارة الأحداث بفعالية.
---


# الأحداث {#events}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

تم بناء جزء كبير من واجهة برمجة تطبيقات Node.js الأساسية حول بنية غير متزامنة قائمة على الأحداث اصطلاحية، حيث تقوم أنواع معينة من الكائنات (تسمى "الباعثات") بإطلاق أحداث مسماة تتسبب في استدعاء كائنات `Function` ("المستمعون").

على سبيل المثال: يقوم كائن [`net.Server`](/ar/nodejs/api/net#class-netserver) بإطلاق حدث في كل مرة يتصل به نظير؛ يقوم [`fs.ReadStream`](/ar/nodejs/api/fs#class-fsreadstream) بإطلاق حدث عند فتح الملف؛ يقوم [stream](/ar/nodejs/api/stream) بإطلاق حدث كلما توفرت بيانات للقراءة.

جميع الكائنات التي تطلق الأحداث هي مثيلات للفئة `EventEmitter`. تعرض هذه الكائنات وظيفة `eventEmitter.on()` التي تسمح بإرفاق دالة واحدة أو أكثر بالأحداث المسماة التي تطلقها الكائن. عادةً ما تكون أسماء الأحداث عبارة عن سلاسل مكتوبة بأحرف الجمل ولكن يمكن استخدام أي مفتاح خاصية JavaScript صالح.

عندما يطلق كائن `EventEmitter` حدثًا، يتم استدعاء جميع الدوال المرفقة بهذا الحدث المحدد *بشكل متزامن*. يتم *تجاهل* أي قيم تم إرجاعها بواسطة المستمعين الذين تم استدعاؤهم والتخلص منها.

يوضح المثال التالي مثيل `EventEmitter` بسيطًا مع مستمع واحد. تُستخدم طريقة `eventEmitter.on()` لتسجيل المستمعين، بينما تُستخدم طريقة `eventEmitter.emit()` لتشغيل الحدث.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('حدث!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('حدث!');
});
myEmitter.emit('event');
```
:::

## تمرير الوسائط و`this` إلى المستمعين {#passing-arguments-and-this-to-listeners}

تسمح طريقة `eventEmitter.emit()` بتمرير مجموعة عشوائية من الوسائط إلى دوال المستمع. ضع في اعتبارك أنه عند استدعاء دالة مستمع عادية، يتم تعيين الكلمة الأساسية `this` القياسية عن قصد للإشارة إلى مثيل `EventEmitter` الذي تم إرفاق المستمع به.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // يطبع:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // يطبع:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

من الممكن استخدام دوال ES6 Arrow كمستمعين، ومع ذلك، عند القيام بذلك، لن تشير الكلمة الأساسية `this` بعد الآن إلى مثيل `EventEmitter`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // يطبع: a b غير معرف
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // يطبع: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::

## غير متزامن مقابل متزامن {#asynchronous-vs-synchronous}

يستدعي `EventEmitter` جميع المستمعين بشكل متزامن بالترتيب الذي تم تسجيلهم به. يضمن هذا التسلسل المناسب للأحداث ويساعد على تجنب حالات السباق وأخطاء المنطق. عند الاقتضاء، يمكن لوظائف المستمع التبديل إلى وضع التشغيل غير المتزامن باستخدام طرق `setImmediate()` أو `process.nextTick()`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## معالجة الأحداث مرة واحدة فقط {#handling-events-only-once}

عندما يتم تسجيل مستمع باستخدام طريقة `eventEmitter.on()`، يتم استدعاء هذا المستمع *في كل مرة* يتم فيها إصدار الحدث المسمى.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

باستخدام طريقة `eventEmitter.once()`، من الممكن تسجيل مستمع يتم استدعاؤه مرة واحدة على الأكثر لحدث معين. بمجرد إصدار الحدث، يتم إلغاء تسجيل المستمع و *ثم* يتم استدعاؤه.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## أحداث الخطأ {#error-events}

عند حدوث خطأ داخل نسخة `EventEmitter`، فإن الإجراء النموذجي هو إطلاق حدث `'error'`. يتم التعامل مع هذه الحالات كحالات خاصة داخل Node.js.

إذا *لم* يكن لدى `EventEmitter` مستمع واحد على الأقل مسجل لحدث `'error'`، وتم إطلاق حدث `'error'`، فسيتم طرح الخطأ، وطباعة تتبع المكدس، وخروج عملية Node.js.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// يطرح الخطأ ويتسبب في تعطل Node.js
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// يطرح الخطأ ويتسبب في تعطل Node.js
```
:::

للحماية من تعطل عملية Node.js، يمكن استخدام وحدة [`domain`](/ar/nodejs/api/domain). (لاحظ، مع ذلك، أن وحدة `node:domain` مهجورة.)

كأفضل ممارسة، يجب دائمًا إضافة مستمعين لأحداث `'error'`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// يطبع: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// يطبع: whoops! there was an error
```
:::

من الممكن مراقبة أحداث `'error'` دون استهلاك الخطأ الذي تم إطلاقه عن طريق تثبيت مستمع باستخدام الرمز `events.errorMonitor`.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// لا يزال يطرح الخطأ ويتسبب في تعطل Node.js
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// لا يزال يطرح الخطأ ويتسبب في تعطل Node.js
```
:::


## التقاط رفض الوعود {#capture-rejections-of-promises}

يُعد استخدام الدوال `async` مع معالجات الأحداث إشكاليًا، لأنه قد يؤدي إلى رفض غير معالج في حالة وجود استثناء تم إطلاقه:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

يعمل الخيار `captureRejections` في مُنشئ `EventEmitter` أو تغيير الإعداد العالمي على تغيير هذا السلوك، عن طريق تثبيت معالج `.then(undefined, handler)` على `Promise`. يقوم هذا المعالج بتوجيه الاستثناء بشكل غير متزامن إلى طريقة [`Symbol.for('nodejs.rejection')`](/ar/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) إذا كانت موجودة، أو إلى معالج حدث [`'error'`](/ar/nodejs/api/events#error-events) إذا لم يكن موجودًا.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

سيؤدي تعيين `events.captureRejections = true` إلى تغيير الإعداد الافتراضي لجميع مثيلات `EventEmitter` الجديدة.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

أحداث `'error'` التي يتم إنشاؤها بواسطة سلوك `captureRejections` ليس لديها معالج catch لتجنب حلقات الخطأ اللانهائية: التوصية هي **عدم استخدام دوال <code>async</code> كمعالجات أحداث <code>'error'</code>**.


## الفئة: `EventEmitter` {#class-eventemitter}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.4.0, v12.16.0 | تمت إضافة خيار captureRejections. |
| v0.1.26 | تمت الإضافة في: v0.1.26 |
:::

يتم تعريف الفئة `EventEmitter` وعرضها بواسطة الوحدة `node:events`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

تقوم جميع `EventEmitter`s بإصدار الحدث `'newListener'` عند إضافة مستمعين جدد والحدث `'removeListener'` عند إزالة المستمعين الحاليين.

وهي تدعم الخيار التالي:

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إنه يمكّن [الالتقاط التلقائي لرفض الوعد](/ar/nodejs/api/events#capture-rejections-of-promises). **افتراضي:** `false`.

### الحدث: `'newListener'` {#event-newlistener}

**تمت الإضافة في: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث الذي يتم الاستماع إليه
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معالج الأحداث

سيصدر مثيل `EventEmitter` حدثه الخاص `'newListener'` *قبل* إضافة مستمع إلى المصفوفة الداخلية للمستمعين.

يتم تمرير اسم الحدث ومرجع إلى المستمع الذي تتم إضافته إلى المستمعين المسجلين للحدث `'newListener'`.

حقيقة أن الحدث يتم تشغيله قبل إضافة المستمع له تأثير جانبي دقيق ولكنه مهم: يتم إدراج أي مستمعين *إضافيين* مسجلين لنفس `name` *داخل* رد الاتصال `'newListener'` *قبل* المستمع الذي هو قيد الإضافة.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// قم بذلك مرة واحدة فقط حتى لا نكرر إلى الأبد
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // إدراج مستمع جديد في المقدمة
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// يطبع:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// قم بذلك مرة واحدة فقط حتى لا نكرر إلى الأبد
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // إدراج مستمع جديد في المقدمة
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// يطبع:
//   B
//   A
```
:::


### الحدث: `'removeListener'` {#event-removelistener}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v6.1.0, v4.7.0 | بالنسبة للمستمعين المرفقين باستخدام `.once()`، تعطي وسيطة `listener` الآن دالة المستمع الأصلية. |
| v0.9.3 | تمت إضافته في: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معالج الحدث

يتم إطلاق حدث `'removeListener'` *بعد* إزالة `listener`.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**تمت إضافته في: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

اسم مستعار لـ `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**تمت إضافته في: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يستدعي بشكل متزامن كل المستمعين المسجلين للحدث المسمى `eventName`، بالترتيب الذي تم تسجيلهم به، ويمرر الوسائط المقدمة لكل منهم.

يُرجع `true` إذا كان للحدث مستمعين، و `false` بخلاف ذلك.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
:::


### `emitter.eventNames()` {#emittereventnames}

**تمت الإضافة في: الإصدار 6.0.0**

- يُرجع: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

يُرجع مصفوفة تسرد الأحداث التي سجل المُصدر مستمعين لها. القيم في المصفوفة هي سلاسل أو `Symbol`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**تمت الإضافة في: الإصدار 1.0.0**

- يُرجع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع قيمة الحد الأقصى الحالي للمستمعين لـ `EventEmitter` والذي يتم تعيينه إما بواسطة [`emitter.setMaxListeners(n)`](/ar/nodejs/api/events#emittersetmaxlistenersn) أو افتراضيًا إلى [`events.defaultMaxListeners`](/ar/nodejs/api/events#eventsdefaultmaxlisteners).

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.8.0, v18.16.0 | تمت إضافة وسيطة `listener`. |
| v3.2.0 | تمت الإضافة في: الإصدار 3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث الذي يتم الاستماع إليه
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معالج الحدث
- يُرجع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع عدد المستمعين الذين يستمعون إلى الحدث المسمى `eventName`. إذا تم توفير `listener`، فسوف يُرجع عدد المرات التي تم فيها العثور على المستمع في قائمة مستمعي الحدث.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
|---|---|
| v7.0.0 | بالنسبة للمستمعين المرفقين باستخدام `.once()`، يعيد هذا المستمعين الأصليين بدلًا من وظائف التغليف الآن. |
| v0.1.26 | تمت إضافته في: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- القيمة المعادة: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

إرجاع نسخة من مصفوفة المستمعين للحدث المسمى `eventName`.

```js [ESM]
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**تمت إضافته في: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- القيمة المعادة: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

اسم مستعار لـ [`emitter.removeListener()`](/ar/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**تمت إضافته في: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة الاستدعاء
- القيمة المعادة: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

إضافة الدالة `listener` إلى نهاية مصفوفة المستمعين للحدث المسمى `eventName`. لا يتم إجراء أي فحوصات للتأكد مما إذا كان قد تمت إضافة `listener` بالفعل. ستؤدي المكالمات المتعددة التي تمرر نفس المجموعة من `eventName` و `listener` إلى إضافة `listener` واستدعائها عدة مرات.

```js [ESM]
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```
إرجاع مرجع إلى `EventEmitter`، بحيث يمكن تسلسل الاستدعاءات.

بشكل افتراضي، يتم استدعاء مستمعي الأحداث بالترتيب الذي تتم إضافتهم به. يمكن استخدام الطريقة `emitter.prependListener()` كبديل لإضافة مستمع الحدث إلى بداية مصفوفة المستمعين.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**تمت الإضافة في: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) وظيفة الاستدعاء
- الإرجاع: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يضيف وظيفة `listener` **لمرة واحدة** للحدث المسمى `eventName`. في المرة التالية التي يتم فيها تشغيل `eventName`، تتم إزالة هذا المستمع ثم استدعاؤه.

```js [ESM]
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
يُرجع مرجعًا إلى `EventEmitter`، بحيث يمكن ربط الاستدعاءات.

بشكل افتراضي، يتم استدعاء مستمعي الأحداث بالترتيب الذي تتم إضافتهم به. يمكن استخدام الطريقة `emitter.prependOnceListener()` كبديل لإضافة مستمع الحدث إلى بداية مصفوفة المستمعين.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**تمت الإضافة في: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) وظيفة الاستدعاء
- الإرجاع: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يضيف وظيفة `listener` إلى *بداية* مصفوفة المستمعين للحدث المسمى `eventName`. لا يتم إجراء أي فحوصات لمعرفة ما إذا كان قد تمت إضافة `listener` بالفعل. ستؤدي المكالمات المتعددة التي تمرر نفس المجموعة من `eventName` و `listener` إلى إضافة `listener` واستدعائها عدة مرات.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```
يُرجع مرجعًا إلى `EventEmitter`، بحيث يمكن ربط الاستدعاءات.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**تمت الإضافة في: الإصدار 6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة الاستدعاء
- الإرجاع: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يضيف دالة `listener` **لمرة واحدة** للحدث المسمى `eventName` إلى *بداية* مصفوفة المستمعين. في المرة التالية التي يتم فيها تشغيل `eventName`، تتم إزالة هذا المستمع، ثم يتم استدعاؤه.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
يقوم بإرجاع مرجع إلى `EventEmitter`، بحيث يمكن ربط الاستدعاءات.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**تمت الإضافة في: الإصدار 0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- الإرجاع: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يزيل جميع المستمعين، أو مستمعي `eventName` المحدد.

من الممارسات السيئة إزالة المستمعين الذين تمت إضافتهم في مكان آخر في التعليمات البرمجية، خاصةً عندما تم إنشاء مثيل `EventEmitter` بواسطة مكون أو وحدة نمطية أخرى (مثل مآخذ التوصيل أو تدفقات الملفات).

يقوم بإرجاع مرجع إلى `EventEmitter`، بحيث يمكن ربط الاستدعاءات.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**تمت الإضافة في: الإصدار 0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يزيل `listener` المحدد من مصفوفة المستمعين للحدث المسمى `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
ستزيل `removeListener()` على الأكثر نسخة واحدة من المستمع من مصفوفة المستمعين. إذا تمت إضافة أي مستمع واحد عدة مرات إلى مصفوفة المستمعين لـ `eventName` المحدد، فيجب استدعاء `removeListener()` عدة مرات لإزالة كل نسخة.

بمجرد انبعاث حدث ما، يتم استدعاء جميع المستمعين المرفقين به في وقت الانبعاث بالترتيب. وهذا يعني أن أي استدعاءات `removeListener()` أو `removeAllListeners()` *بعد* الانبعاث و *قبل* انتهاء تنفيذ آخر مستمع لن تزيلهم من `emit()` قيد التقدم. تتصرف الأحداث اللاحقة كما هو متوقع.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```
:::

نظرًا لأن المستمعين تتم إدارتهم باستخدام مصفوفة داخلية، فإن استدعاء هذا سيؤدي إلى تغيير مؤشرات موضع أي مستمع مسجل *بعد* المستمع الذي تتم إزالته. لن يؤثر هذا على الترتيب الذي يتم به استدعاء المستمعين، ولكنه يعني أن أي نسخ من مصفوفة المستمعين كما تم إرجاعها بواسطة طريقة `emitter.listeners()` ستحتاج إلى إعادة إنشائها.

عندما تتم إضافة دالة واحدة كمعالج عدة مرات لحدث واحد (كما في المثال أدناه)، ستزيل `removeListener()` آخر نسخة تمت إضافتها. في المثال، تتم إزالة المستمع `once('ping')`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

يقوم بإرجاع مرجع إلى `EventEmitter`، بحيث يمكن ربط الاستدعاءات.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**أُضيف في: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Returns: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

بشكل افتراضي، ستطبع `EventEmitter` تحذيرًا إذا تمت إضافة أكثر من `10` مستمعين لحدث معين. هذا افتراضي مفيد يساعد في العثور على تسربات الذاكرة. يسمح الأسلوب `emitter.setMaxListeners()` بتعديل الحد الأقصى لهذا المثيل المحدد `EventEmitter`. يمكن تعيين القيمة إلى `Infinity` (أو `0`) للإشارة إلى عدد غير محدود من المستمعين.

إرجاع مرجع إلى `EventEmitter`، بحيث يمكن تسلسل الاستدعاءات.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**أُضيف في: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Returns: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

إرجاع نسخة من مصفوفة المستمعين للحدث المسمى `eventName`، بما في ذلك أي أغلفة (مثل تلك التي تم إنشاؤها بواسطة `.once()`).



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```
:::


### ‏`emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: معلومات [السجل]
| الإصدار | التغييرات |
|---|---|
| v17.4.0, v16.14.0 | لم تعد تجريبية. |
| v13.4.0, v12.16.0 | تمت إضافتها في: v13.4.0, v12.16.0 |
:::

- ‏`err` خطأ
- ‏`eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- ‏`...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يتم استدعاء الأسلوب `Symbol.for('nodejs.rejection')` في حالة حدوث رفض وعد عند إصدار حدث وتم تمكين [`captureRejections`](/ar/nodejs/api/events#capture-rejections-of-promises) على المُصدِر. من الممكن استخدام [`events.captureRejectionSymbol`](/ar/nodejs/api/events#eventscapturerejectionsymbol) بدلاً من `Symbol.for('nodejs.rejection')`.

::: group-code
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('حدث رفض لـ', event, 'مع', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // قم بإيقاف تشغيل المورد هنا.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('حدث رفض لـ', event, 'مع', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // قم بإيقاف تشغيل المورد هنا.
  }
}
```
:::

## ‏`events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**تمت إضافتها في: v0.11.2**

افتراضيًا، يمكن تسجيل عدد أقصاه `10` مستمعين لأي حدث واحد. يمكن تغيير هذا الحد لنسخ `EventEmitter` الفردية باستخدام الأسلوب [`emitter.setMaxListeners(n)`](/ar/nodejs/api/events#emittersetmaxlistenersn). لتغيير الإعداد الافتراضي *لجميع* نسخ `EventEmitter`، يمكن استخدام الخاصية `events.defaultMaxListeners`. إذا لم تكن هذه القيمة عددًا موجبًا، يتم طرح `RangeError`.

توخ الحذر عند تعيين `events.defaultMaxListeners` لأن التغيير يؤثر على *جميع* نسخ `EventEmitter`، بما في ذلك تلك التي تم إنشاؤها قبل إجراء التغيير. ومع ذلك، فإن استدعاء [`emitter.setMaxListeners(n)`](/ar/nodejs/api/events#emittersetmaxlistenersn) لا يزال له الأسبقية على `events.defaultMaxListeners`.

هذا ليس حدًا صارمًا. ستسمح نسخة `EventEmitter` بإضافة المزيد من المستمعين ولكنها ستخرج تحذير تتبع إلى stderr يشير إلى أنه تم اكتشاف "تسرب ذاكرة محتمل لـ EventEmitter". بالنسبة لأي `EventEmitter` فردي، يمكن استخدام الأسلوبين `emitter.getMaxListeners()` و `emitter.setMaxListeners()` لتجنب هذا التحذير مؤقتًا:

ليس لـ `defaultMaxListeners` أي تأثير على نسخ `AbortSignal`. في حين أنه لا يزال من الممكن استخدام [`emitter.setMaxListeners(n)`](/ar/nodejs/api/events#emittersetmaxlistenersn) لتعيين حد تحذير لنسخ `AbortSignal` الفردية، افتراضيًا لن تحذر نسخ `AbortSignal`.

::: group-code
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // قم بالأشياء
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // قم بالأشياء
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

يمكن استخدام علامة سطر الأوامر [`--trace-warnings`](/ar/nodejs/api/cli#--trace-warnings) لعرض تتبع المكدس لهذه التحذيرات.

يمكن فحص التحذير الصادر باستخدام [`process.on('warning')`](/ar/nodejs/api/process#event-warning) وسيكون له خصائص إضافية `emitter` و `type` و `count`، تشير إلى نسخة باعث الحدث واسم الحدث وعدد المستمعين المرفقين على التوالي. تم تعيين الخاصية `name` الخاصة به على `'MaxListenersExceededWarning'`.


## `events.errorMonitor` {#eventserrormonitor}

**أُضيف في: v13.6.0, v12.17.0**

يجب استخدام هذا الرمز لتثبيت مستمع لمراقبة أحداث `'error'` فقط. يتم استدعاء المستمعين المثبتين باستخدام هذا الرمز قبل استدعاء مستمعي `'error'` العاديين.

لا يؤدي تثبيت مستمع باستخدام هذا الرمز إلى تغيير السلوك بمجرد انبعاث حدث `'error'`. لذلك ، ستظل العملية معطلة إذا لم يتم تثبيت أي مستمع `'error'` عادي.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**أُضيف في: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- الإرجاع: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

إرجاع نسخة من مصفوفة المستمعين للحدث المسمى `eventName`.

بالنسبة إلى `EventEmitter`s ، يتصرف هذا تمامًا مثل استدعاء `.listeners` على الباعث.

بالنسبة إلى `EventTarget`s ، هذه هي الطريقة الوحيدة للحصول على مستمعي الأحداث للهدف الحدث. هذا مفيد لأغراض التصحيح والتشخيص.

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**أُضيف في: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget)
- القيمة المُعادة: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تُعيد الحد الأقصى المُعيّن حاليًا لعدد المستمعين.

بالنسبة إلى `EventEmitter`، يتصرف هذا تمامًا مثل استدعاء `.getMaxListeners` على الباعث.

بالنسبة إلى `EventTarget`، هذه هي الطريقة الوحيدة للحصول على الحد الأقصى لمستمعي الأحداث لهدف الحدث. إذا تجاوز عدد معالجات الأحداث على `EventTarget` واحد الحد الأقصى المُعيّن، فستطبع `EventTarget` تحذيرًا.

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | خيار `signal` مدعوم الآن. |
| v11.13.0, v10.16.0 | أُضيف في: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يمكن استخدامه لإلغاء انتظار الحدث.


- القيمة المُعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

تُنشئ `Promise` يتم استيفائها عندما يُصدر `EventEmitter` الحدث المحدد أو يتم رفضها إذا كان `EventEmitter` يُصدر `'error'` أثناء الانتظار. ستحل `Promise` مع مجموعة من جميع الوسائط الصادرة إلى الحدث المحدد.

هذه الطريقة عامة عن قصد وتعمل مع واجهة [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) لمنصة الويب، والتي لا تحتوي على دلالات حدث `'error'` خاصة ولا تستمع إلى حدث `'error'`.

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

يتم استخدام المعالجة الخاصة لحدث `'error'` فقط عندما يتم استخدام `events.once()` للانتظار لحدث آخر. إذا تم استخدام `events.once()` للانتظار لحدث '`error`' نفسه، فإنه يتم التعامل معه كأي نوع آخر من الأحداث بدون معالجة خاصة:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

يمكن استخدام [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) لإلغاء انتظار الحدث:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### انتظار أحداث متعددة مُصدرة على `process.nextTick()` {#awaiting-multiple-events-emitted-on-processnexttick}

هناك حالة حافة تستحق الملاحظة عند استخدام الدالة `events.once()` لانتظار أحداث متعددة مُصدرة في نفس دفعة عمليات `process.nextTick()`، أو متى تم إصدار أحداث متعددة بشكل متزامن. على وجه التحديد، نظرًا لأن قائمة انتظار `process.nextTick()` يتم استنزافها قبل قائمة انتظار المهام الصغيرة `Promise`، ولأن `EventEmitter` تُصدر جميع الأحداث بشكل متزامن، فمن الممكن أن تفوت `events.once()` حدثًا ما.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // لن يتم حل هذا الوعد أبدًا لأن حدث 'foo'
  // سيكون قد تم إصداره بالفعل قبل إنشاء الوعد.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // لن يتم حل هذا الوعد أبدًا لأن حدث 'foo'
  // سيكون قد تم إصداره بالفعل قبل إنشاء الوعد.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

لإلتقاط كلا الحدثين، قم بإنشاء كل وعد *قبل* انتظار أي منهما، ثم يصبح من الممكن استخدام `Promise.all()` أو `Promise.race()` أو `Promise.allSettled()`:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.4.0, v16.14.0 | لم يعد تجريبيًا. |
| v13.4.0, v12.16.0 | تمت إضافته في: v13.4.0, v12.16.0 |
:::

القيمة: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

لتغيير الخيار الافتراضي `captureRejections` في جميع كائنات `EventEmitter` الجديدة.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.4.0, v16.14.0 | لم يعد تجريبيًا. |
| v13.4.0, v12.16.0 | تمت إضافته في: v13.4.0, v12.16.0 |
:::

القيمة: `Symbol.for('nodejs.rejection')`

راجع كيفية كتابة [معالج رفض مخصص](/ar/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args).

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**تمت إضافته في: v0.9.12**

**تم الإيقاف منذ: v3.2.0**

::: danger [ثابت: 0 - تم الإيقاف]
[ثابت: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف: استخدم [`emitter.listenerCount()`](/ar/nodejs/api/events#emitterlistenercounteventname-listener) بدلاً من ذلك.
:::

- `emitter` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter) المُرسِل المراد الاستعلام عنه
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث

طريقة فئة تُرجع عدد المستمعين لـ `eventName` المُسجل في `emitter` المحدد.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | دعم خيارات `highWaterMark` و `lowWaterMark`، للتناسق. الخيارات القديمة لا تزال مدعومة. |
| v20.0.0 | خيارات `close` و `highWatermark` و `lowWatermark` مدعومة الآن. |
| v13.6.0, v12.16.0 | تمت إضافته في: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم الحدث الذي يتم الاستماع إليه
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يمكن استخدامه لإلغاء انتظار الأحداث.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أسماء الأحداث التي ستنهي التكرار.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `Number.MAX_SAFE_INTEGER` العلامة المائية العليا. يتم إيقاف المرسل مؤقتًا في كل مرة يكون فيها حجم الأحداث المخزنة مؤقتًا أعلى منه. مدعوم فقط على المرسلين الذين ينفذون طرق `pause()` و `resume()`.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `1` العلامة المائية السفلى. يتم استئناف المرسل في كل مرة يكون فيها حجم الأحداث المخزنة مؤقتًا أقل منه. مدعوم فقط على المرسلين الذين ينفذون طرق `pause()` و `resume()`.


- الإرجاع: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) يقوم بتكرار أحداث `eventName` المنبعثة من `emitter`



::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
```
:::

إرجاع `AsyncIterator` يقوم بتكرار أحداث `eventName`. سيتم طرح خطأ إذا أصدر `EventEmitter` الحدث `'error'`. يزيل جميع المستمعين عند الخروج من الحلقة. `value` الذي تم إرجاعه بواسطة كل تكرار هو مصفوفة تتكون من وسيطات الحدث المنبعثة.

يمكن استخدام [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) لإلغاء الانتظار على الأحداث:



::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```
:::

## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**أضيف في: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم غير سالب. الحد الأقصى لعدد المستمعين لكل حدث `EventTarget`.
- `...eventsTargets` [\<EventTarget[]\>](/ar/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/ar/nodejs/api/events#class-eventemitter) صفر أو أكثر من نسخ [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) أو [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter). إذا لم يتم تحديد أي منها، يتم تعيين `n` كحد أقصى افتراضي لجميع كائنات [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) و [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter) التي تم إنشاؤها حديثًا.

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**أضيف في: v20.5.0, v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener)
- إرجاع: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) كائن `Disposable` يزيل مستمع `abort`.

يستمع مرة واحدة إلى حدث `abort` على `signal` المقدم.

الاستماع إلى حدث `abort` على إشارات الإجهاض غير آمن وقد يؤدي إلى تسرب الموارد حيث يمكن لطرف ثالث آخر لديه الإشارة استدعاء [`e.stopImmediatePropagation()`](/ar/nodejs/api/events#eventstopimmediatepropagation). لسوء الحظ، لا يمكن لـ Node.js تغيير ذلك لأنه سينتهك معيار الويب. بالإضافة إلى ذلك، تسهل واجهة برمجة التطبيقات الأصلية نسيان إزالة المستمعين.

تسمح واجهة برمجة التطبيقات هذه باستخدام `AbortSignal`s بأمان في واجهات برمجة تطبيقات Node.js عن طريق حل هاتين المشكلتين من خلال الاستماع إلى الحدث بحيث لا يمنع `stopImmediatePropagation` المستمع من التشغيل.

إرجاع كائن يمكن التخلص منه بحيث يمكن إلغاء الاشتراك فيه بسهولة أكبر.

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## الصنف: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**أُضيف في: الإصدار 17.4.0، 16.14.0**

يدمج `EventEmitter` مع [\<AsyncResource\>](/ar/nodejs/api/async_hooks#class-asyncresource) لـ `EventEmitter` التي تتطلب تتبعًا غير متزامن يدويًا. على وجه التحديد، ستعمل جميع الأحداث التي تنبعث من مثيلات `events.EventEmitterAsyncResource` داخل [سياقها غير المتزامن](/ar/nodejs/api/async_context).

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// ستحدد أدوات التتبع غير المتزامن هذا على أنه 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// سيتم تشغيل مستمعي 'foo' في سياق EventEmitter غير المتزامن.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// مستمعو 'foo' على EventEmitters العادية التي لا تتعقب السياق غير المتزامن،
// ومع ذلك، يتم تشغيلها في نفس السياق غير المتزامن مثل emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// ستحدد أدوات التتبع غير المتزامن هذا على أنه 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// سيتم تشغيل مستمعي 'foo' في سياق EventEmitter غير المتزامن.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// مستمعو 'foo' على EventEmitters العادية التي لا تتعقب السياق غير المتزامن،
// ومع ذلك، يتم تشغيلها في نفس السياق غير المتزامن مثل emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

يحتوي الصنف `EventEmitterAsyncResource` على نفس الطرق ويأخذ نفس الخيارات مثل `EventEmitter` و `AsyncResource` أنفسهم.


### ‏`new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تُمكِّن [التقاط رفض الوعد تلقائيًا](/ar/nodejs/api/events#capture-rejections-of-promises). **الافتراضي:** ‏`false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع الحدث غير المتزامن. **الافتراضي:** ‏[`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مُعرّف سياق التنفيذ الذي أنشأ هذا الحدث غير المتزامن. **الافتراضي:** ‏`executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فسيتم تعطيل `emitDestroy` عند جمع الكائن المهمل. لا تحتاج عادةً إلى تعيين هذا (حتى إذا تم استدعاء `emitDestroy` يدويًا)، إلا إذا تم استرداد `asyncId` للمورد وتم استدعاء `emitDestroy` الخاصة بـ API الحساسة بواسطته. عند تعيينه على `false`، سيحدث استدعاء `emitDestroy` في جمع البيانات المهملة فقط إذا كان هناك على الأقل خطاف `destroy` نشط واحد. **الافتراضي:** ‏`false`.

### ‏`eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ‏`asyncId` الفريد المُعيَّن للمورد.

### ‏`eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- النوع: ‏[\<AsyncResource\>](/ar/nodejs/api/async_hooks#class-asyncresource) الأساسي.

يحتوي كائن `AsyncResource` المُرجَع على خاصية `eventEmitter` إضافية توفر مرجعًا إلى `EventEmitterAsyncResource`.

### ‏`eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

استدعاء جميع خطافات `destroy`. يجب استدعاء هذا مرة واحدة فقط. سيتم طرح خطأ إذا تم استدعاؤه أكثر من مرة. **يجب** استدعاء هذا يدويًا. إذا تُرك المورد ليتم جمعه بواسطة GC، فلن يتم استدعاء خطافات `destroy` أبدًا.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) نفس `triggerAsyncId` الذي يتم تمريره إلى مُنشئ `AsyncResource`.

## واجهة برمجة تطبيقات `EventTarget` و `Event` {#eventtarget-and-event-api}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | تم تغيير معالجة أخطاء EventTarget. |
| v15.4.0 | لم يعد تجريبيًا. |
| v15.0.0 | أصبحت الفئات `EventTarget` و `Event` متاحة الآن كمتغيرات عالمية. |
| v14.5.0 | تمت إضافته في: v14.5.0 |
:::

الكائنات `EventTarget` و `Event` هي تطبيق خاص بـ Node.js لـ [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) الذي تعرضه بعض واجهات برمجة التطبيقات الأساسية في Node.js.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
```
### `EventTarget` في Node.js مقابل `EventTarget` في DOM {#nodejs-eventtarget-vs-dom-eventtarget}

هناك اختلافان رئيسيان بين `EventTarget` في Node.js و [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

### `NodeEventTarget` مقابل `EventEmitter` {#nodeeventtarget-vs-eventemitter}

يطبق الكائن `NodeEventTarget` مجموعة فرعية معدلة من واجهة برمجة تطبيقات `EventEmitter` التي تسمح له *بمحاكاة* `EventEmitter` عن كثب في مواقف معينة. `NodeEventTarget` *ليس* مثيلاً لـ `EventEmitter` ولا يمكن استخدامه بدلاً من `EventEmitter` في معظم الحالات.

### مستمع الحدث {#event-listener}

يمكن أن يكون مستمعو الأحداث المسجلين لنوع حدث `type` إما وظائف JavaScript أو كائنات لها خاصية `handleEvent` قيمتها عبارة عن دالة.

في كلتا الحالتين، يتم استدعاء دالة المعالج مع وسيط `event` الذي تم تمريره إلى الدالة `eventTarget.dispatchEvent()`.

يمكن استخدام الدوال غير المتزامنة كمستمعين للأحداث. إذا تم رفض دالة معالج غير متزامنة، فسيتم التقاط الرفض ومعالجته كما هو موضح في [`EventTarget` error handling](/ar/nodejs/api/events#eventtarget-error-handling).

لا يمنع الخطأ الذي يتم طرحه بواسطة دالة معالج واحدة استدعاء المعالجات الأخرى.

يتم تجاهل القيمة المرجعة لدالة المعالج.

يتم استدعاء المعالجات دائمًا بالترتيب الذي تمت إضافتها به.

قد تقوم دوال المعالجات بتغيير كائن `event`.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // يطبع 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // يطبع 'foo'
  console.log(event.a);  // يطبع 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // يطبع 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // يطبع 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### معالجة أخطاء ‎`EventTarget`‎ {#eventtarget-error-handling}

عندما يطرح مستمع حدث مسجل (أو يعيد ‎Promise‎ يرفض)، بشكل افتراضي، يتم التعامل مع الخطأ على أنه استثناء غير معالج في ‎`process.nextTick()`‎. هذا يعني أن الاستثناءات غير المعالجة في ‎`EventTarget`‎ ستنهي عملية ‎Node.js‎ افتراضيًا.

الطرح داخل مستمع الحدث *لن* يوقف معالجات أخرى مسجلة من الاستدعاء.

لا تنفذ ‎`EventTarget`‎ أي معالجة افتراضية خاصة للأحداث من النوع ‎`'error'`‎ مثل ‎`EventEmitter`‎.

حاليًا، يتم توجيه الأخطاء أولاً إلى حدث ‎`process.on('error')`‎ قبل الوصول إلى ‎`process.on('uncaughtException')`‎. هذا السلوك مهمل وسيتغير في إصدار مستقبلي لمواءمة ‎`EventTarget`‎ مع واجهات برمجة تطبيقات ‎Node.js‎ الأخرى. يجب مواءمة أي كود يعتمد على حدث ‎`process.on('error')`‎ مع السلوك الجديد.

### الصنف: ‎`Event`‎ {#class-event}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يتوفر الآن الصنف ‎`Event`‎ من خلال الكائن العام. |
| v14.5.0 | تمت إضافته في: v14.5.0 |
:::

كائن ‎`Event`‎ هو تكييف لـ ‎[`Event` Web API](https://dom.spec.whatwg.org/#event)‎. يتم إنشاء المثيلات داخليًا بواسطة ‎Node.js‎.

#### ‎`event.bubbles`‎ {#eventbubbles}

**تمت إضافته في: v14.5.0**

- النوع: ‎[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)‎ يُرجع دائمًا ‎`false`‎.

لا يتم استخدام هذا في ‎Node.js‎ ويتم توفيره فقط من أجل الاكتمال.

#### ‎`event.cancelBubble`‎ {#eventcancelbubble}

**تمت إضافته في: v14.5.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم ‎[`event.stopPropagation()`](/ar/nodejs/api/events#eventstoppropagation)‎ بدلاً من ذلك.
:::

- النوع: ‎[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)‎

اسم بديل لـ ‎`event.stopPropagation()`‎ إذا تم تعيينه على ‎`true`‎. لا يتم استخدام هذا في ‎Node.js‎ ويتم توفيره فقط من أجل الاكتمال.

#### ‎`event.cancelable`‎ {#eventcancelable}

**تمت إضافته في: v14.5.0**

- النوع: ‎[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)‎ ‎True‎ إذا تم إنشاء الحدث مع خيار ‎`cancelable`‎.


#### `event.composed` {#eventcomposed}

**أُضيف في:** الإصدار 14.5.0

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يُرجع دائمًا `false`.

هذا غير مستخدم في Node.js ويتم توفيره فقط من أجل الاكتمال.

#### `event.composedPath()` {#eventcomposedpath}

**أُضيف في:** الإصدار 14.5.0

يُرجع مصفوفة تحتوي على `EventTarget` الحالي كإدخال وحيد أو فارغ إذا لم يتم إرسال الحدث. هذا غير مستخدم في Node.js ويتم توفيره فقط من أجل الاكتمال.

#### `event.currentTarget` {#eventcurrenttarget}

**أُضيف في:** الإصدار 14.5.0

- النوع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) `EventTarget` الذي يُرسل الحدث.

اسم بديل لـ `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**أُضيف في:** الإصدار 14.5.0

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يكون `true` إذا كان `cancelable` هو `true` وتم استدعاء `event.preventDefault()`.

#### `event.eventPhase` {#eventeventphase}

**أُضيف في:** الإصدار 14.5.0

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يُرجع `0` بينما لا يتم إرسال الحدث، و `2` أثناء إرساله.

هذا غير مستخدم في Node.js ويتم توفيره فقط من أجل الاكتمال.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**أُضيف في:** الإصدار 19.5.0

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: تعتبره مواصفات WHATWG مهملًا ولا ينبغي للمستخدمين استخدامه على الإطلاق.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

زائد عن الحاجة مع مُنشئات الأحداث وغير قادر على تعيين `composed`. هذا غير مستخدم في Node.js ويتم توفيره فقط من أجل الاكتمال.

#### `event.isTrusted` {#eventistrusted}

**أُضيف في:** الإصدار 14.5.0

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم إصدار حدث [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) `"abort"` مع تعيين `isTrusted` على `true`. القيمة هي `false` في جميع الحالات الأخرى.


#### `event.preventDefault()` {#eventpreventdefault}

**أُضيف في: v14.5.0**

يُعيّن الخاصية `defaultPrevented` إلى `true` إذا كانت `cancelable` هي `true`.

#### `event.returnValue` {#eventreturnvalue}

**أُضيف في: v14.5.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`event.defaultPrevented`](/ar/nodejs/api/events#eventdefaultprevented) بدلاً من ذلك.
:::

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) صحيح إذا لم يتم إلغاء الحدث.

قيمة `event.returnValue` هي دائمًا عكس `event.defaultPrevented`. لا يتم استخدام هذا في Node.js ويتم توفيره فقط للإكمال.

#### `event.srcElement` {#eventsrcelement}

**أُضيف في: v14.5.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [`event.target`](/ar/nodejs/api/events#eventtarget) بدلاً من ذلك.
:::

- النوع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) `EventTarget` الذي يرسل الحدث.

اسم بديل لـ `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**أُضيف في: v14.5.0**

يوقف استدعاء مستمعي الأحداث بعد اكتمال المستمع الحالي.

#### `event.stopPropagation()` {#eventstoppropagation}

**أُضيف في: v14.5.0**

لا يتم استخدام هذا في Node.js ويتم توفيره فقط للإكمال.

#### `event.target` {#eventtarget}

**أُضيف في: v14.5.0**

- النوع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) `EventTarget` الذي يرسل الحدث.

#### `event.timeStamp` {#eventtimestamp}

**أُضيف في: v14.5.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الطابع الزمني بالمللي ثانية عند إنشاء كائن `Event`.

#### `event.type` {#eventtype}

**أُضيف في: v14.5.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

معرف نوع الحدث.

### الصنف: `EventTarget` {#class-eventtarget}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يتوفر الآن الصنف `EventTarget` من خلال الكائن العام. |
| v14.5.0 | أُضيف في: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.4.0 | إضافة دعم خيار `signal`. |
| v14.5.0 | تمت الإضافة في: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، تتم إزالة المستمع تلقائيًا عند استدعائه لأول مرة. **الافتراضي:** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، تعمل كتلميح على أن المستمع لن يستدعي طريقة `preventDefault()` الخاصة بكائن `Event`. **الافتراضي:** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لا تستخدم مباشرة من قبل Node.js. تمت إضافتها من أجل اكتمال API. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) ستتم إزالة المستمع عند استدعاء طريقة `abort()` لكائن AbortSignal المحدد.
  
 

يضيف معالجًا جديدًا لحدث `type`. تتم إضافة أي `listener` معين مرة واحدة فقط لكل `type` ولكل قيمة خيار `capture`.

إذا كان خيار `once` هو `true`، تتم إزالة `listener` بعد المرة التالية التي يتم فيها إرسال حدث `type`.

لا يتم استخدام خيار `capture` بواسطة Node.js بأي طريقة وظيفية بخلاف تتبع مستمعي الأحداث المسجلين وفقًا لمواصفات `EventTarget`. على وجه التحديد، يتم استخدام خيار `capture` كجزء من المفتاح عند تسجيل `listener`. يمكن إضافة أي `listener` فردي مرة واحدة مع `capture = false`، ومرة واحدة مع `capture = true`.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Removes the second instance of handler
target.removeEventListener('foo', handler);

// Removes the first instance of handler
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**أضيف في: v14.5.0**

- `event` [\<Event\>](/ar/nodejs/api/events#class-event)
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كانت قيمة سمة `cancelable` للحدث خاطئة أو لم يتم استدعاء طريقة `preventDefault()` الخاصة به، وإلا `false`.

يقوم بإرسال `event` إلى قائمة معالجات `event.type`.

يتم استدعاء مستمعي الأحداث المسجلين بشكل متزامن بالترتيب الذي تم تسجيلهم به.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**أضيف في: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

 

يزيل `listener` من قائمة معالجات الحدث `type`.

### الصنف: `CustomEvent` {#class-customevent}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | لم تعد تجريبية. |
| v22.1.0, v20.13.0 | CustomEvent الآن مستقرة. |
| v19.0.0 | لم تعد خلف علامة سطر الأوامر `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | أضيفت في: v18.7.0, v16.17.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

- يمتد: [\<Event\>](/ar/nodejs/api/events#class-event)

الكائن `CustomEvent` هو تكييف لـ [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent). يتم إنشاء المثيلات داخليًا بواسطة Node.js.

#### `event.detail` {#eventdetail}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent الآن مستقرة. |
| v18.7.0, v16.17.0 | أضيفت في: v18.7.0, v16.17.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

- النوع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) إرجاع بيانات مخصصة تم تمريرها عند التهيئة.

للقراءة فقط.


### الفئة: `NodeEventTarget` {#class-nodeeventtarget}

**أضيف في: الإصدار v14.5.0**

- يمتد: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget)

إن `NodeEventTarget` هو امتداد خاص بـ Node.js لـ `EventTarget` يحاكي مجموعة فرعية من واجهة برمجة تطبيقات `EventEmitter`.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**أضيف في: الإصدار v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener)
-  الإرجاع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) هذا

امتداد خاص بـ Node.js للفئة `EventTarget` يحاكي واجهة برمجة تطبيقات `EventEmitter` المكافئة. الفرق الوحيد بين `addListener()` و `addEventListener()` هو أن `addListener()` ستعيد مرجعًا إلى `EventTarget`.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**أضيف في: الإصدار v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كانت مستمعي الأحداث المسجلين لـ `type` موجودين، وإلا `false`.

امتداد خاص بـ Node.js للفئة `EventTarget` يقوم بتوزيع `arg` إلى قائمة المعالجات لـ `type`.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**أضيف في: الإصدار v14.5.0**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

امتداد خاص بـ Node.js للفئة `EventTarget` الذي يُرجع مصفوفة من أسماء `type` للأحداث التي تم تسجيل مستمعي الأحداث لها.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**أضيف في: الإصدار v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

امتداد خاص بـ Node.js للفئة `EventTarget` الذي يُرجع عدد مستمعي الأحداث المسجلين لـ `type`.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**تمت إضافتها في: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

امتداد خاص بـ Node.js لفئة `EventTarget` التي تحدد عدد أقصى مستمعي الأحداث على أنه `n`.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**تمت إضافتها في: v14.5.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

امتداد خاص بـ Node.js لفئة `EventTarget` التي تُرجع عدد أقصى مستمعي الأحداث.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**تمت إضافتها في: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener) 
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
-  الإرجاع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) this 

اسم مستعار خاص بـ Node.js لـ `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**تمت إضافتها في: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener) 
-  الإرجاع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) this 

اسم مستعار خاص بـ Node.js لـ `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**تمت إضافتها في: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener) 
-  الإرجاع: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) this 

امتداد خاص بـ Node.js لفئة `EventTarget` يضيف مستمع `once` لنوع الحدث المحدد `type`. هذا يعادل استدعاء `on` مع تعيين الخيار `once` على `true`.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**أُضيف في: الإصدار v14.5.0**

-  `type` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  يعيد: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) هذا

امتداد خاص بـ Node.js لفئة `EventTarget`. إذا تم تحديد `type`، فسيقوم بإزالة جميع المستمعين المسجلين لـ `type`، وإلا فإنه يزيل جميع المستمعين المسجلين.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**أُضيف في: الإصدار v14.5.0**

-  `type` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ar/nodejs/api/events#event-listener)
-  `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<قيمة منطقية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  يعيد: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget) هذا

امتداد خاص بـ Node.js لفئة `EventTarget` يقوم بإزالة `listener` لنوع `type` المحدد. الفرق الوحيد بين `removeListener()` و `removeEventListener()` هو أن `removeListener()` ستعيد مرجعًا إلى `EventTarget`.

