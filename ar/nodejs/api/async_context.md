---
title: توثيق Node.js - تتبع السياق غير المتزامن
description: تعلم كيفية تتبع العمليات غير المتزامنة في Node.js باستخدام وحدة async_hooks، التي توفر طريقة لتسجيل ردود الفعل للأحداث غير المتزامنة المختلفة.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - تتبع السياق غير المتزامن | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية تتبع العمليات غير المتزامنة في Node.js باستخدام وحدة async_hooks، التي توفر طريقة لتسجيل ردود الفعل للأحداث غير المتزامنة المختلفة.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - تتبع السياق غير المتزامن | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية تتبع العمليات غير المتزامنة في Node.js باستخدام وحدة async_hooks، التي توفر طريقة لتسجيل ردود الفعل للأحداث غير المتزامنة المختلفة.
---


# تتبع السياق غير المتزامن {#asynchronous-context-tracking}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## مقدمة {#introduction}

تُستخدم هذه الفئات لربط الحالة ونشرها عبر معاودة الاتصال وسلاسل الوعد. تسمح بتخزين البيانات طوال مدة طلب الويب أو أي مدة غير متزامنة أخرى. وهو مشابه للتخزين المحلي للخيط في اللغات الأخرى.

تعد الفئتان `AsyncLocalStorage` و `AsyncResource` جزءًا من الوحدة النمطية `node:async_hooks`:



::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## الفئة: `AsyncLocalStorage` {#class-asynclocalstorage}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v16.4.0 | أصبح AsyncLocalStorage الآن مستقرًا. سابقًا، كان تجريبيًا. |
| الإصداران v13.10.0 و v12.17.0 | تمت الإضافة في: v13.10.0 و v12.17.0 |
:::

تنشئ هذه الفئة مخازن تظل متماسكة من خلال العمليات غير المتزامنة.

في حين أنه يمكنك إنشاء التنفيذ الخاص بك فوق الوحدة النمطية `node:async_hooks`، يجب تفضيل `AsyncLocalStorage` لأنه تنفيذ آمن للذاكرة وذو أداء عالٍ ويتضمن تحسينات كبيرة ليس من الواضح تنفيذها.

يستخدم المثال التالي `AsyncLocalStorage` لإنشاء مُسجل بسيط يقوم بتعيين معرفات لطلبات HTTP الواردة ويتضمنها في الرسائل المسجلة داخل كل طلب.



::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // تخيل أي سلسلة من العمليات غير المتزامنة هنا
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// طباعة:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // تخيل أي سلسلة من العمليات غير المتزامنة هنا
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// طباعة:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

تحتفظ كل نسخة من `AsyncLocalStorage` بسياق تخزين مستقل. يمكن أن توجد نسخ متعددة بأمان في وقت واحد دون التعرض لخطر التداخل مع بيانات بعضها البعض.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.7.0, v18.16.0 | تمت إزالة الخيار التجريبي onPropagate. |
| v19.2.0, v18.13.0 | إضافة الخيار onPropagate. |
| v13.10.0, v12.17.0 | تمت الإضافة في: v13.10.0, v12.17.0 |
:::

يقوم بإنشاء نسخة جديدة من `AsyncLocalStorage`. يتم توفير المخزن فقط داخل استدعاء `run()` أو بعد استدعاء `enterWith()`.

### طريقة ثابتة: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**تمت الإضافة في: v19.8.0, v18.16.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد ربطها بسياق التنفيذ الحالي.
- الإرجاع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة جديدة تستدعي `fn` داخل سياق التنفيذ الذي تم التقاطه.

يقوم بربط الدالة المعطاة بسياق التنفيذ الحالي.

### طريقة ثابتة: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**تمت الإضافة في: v19.8.0, v18.16.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- الإرجاع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة جديدة تحمل التوقيع `(fn: (...args) : R, ...args) : R`.

يلتقط سياق التنفيذ الحالي ويعيد دالة تقبل دالة كوسيطة. كلما تم استدعاء الدالة المُعادة، فإنها تستدعي الدالة التي تم تمريرها إليها داخل السياق الذي تم التقاطه.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // returns 123
```
يمكن لـ AsyncLocalStorage.snapshot() أن يحل محل استخدام AsyncResource لأغراض تتبع سياق غير متزامن بسيط، على سبيل المثال:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // returns 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**أضيف في:** الإصدار 13.10.0، الإصدار 12.17.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يعطِّل نسخة `AsyncLocalStorage`. ستعيد جميع الاستدعاءات اللاحقة لـ `asyncLocalStorage.getStore()` القيمة `undefined` حتى يتم استدعاء `asyncLocalStorage.run()` أو `asyncLocalStorage.enterWith()` مرة أخرى.

عند استدعاء `asyncLocalStorage.disable()`، سيتم إنهاء جميع السياقات الحالية المرتبطة بالنسخة.

يُعد استدعاء `asyncLocalStorage.disable()` مطلوبًا قبل أن يتم جمع `asyncLocalStorage` كقمامة. لا ينطبق هذا على المخازن التي يوفرها `asyncLocalStorage`، حيث يتم جمع هذه الكائنات كقمامة جنبًا إلى جنب مع موارد async المقابلة.

استخدم هذه الطريقة عندما لا يكون `asyncLocalStorage` قيد الاستخدام بعد الآن في العملية الحالية.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**أضيف في:** الإصدار 13.10.0، الإصدار 12.17.0

- يُرجع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

إرجاع المتجر الحالي. إذا تم استدعاؤه خارج سياق غير متزامن تم تهيئته عن طريق استدعاء `asyncLocalStorage.run()` أو `asyncLocalStorage.enterWith()`، فإنه يُرجع `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**أضيف في:** الإصدار 13.11.0، الإصدار 12.17.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

الانتقال إلى السياق للفترة المتبقية من التنفيذ المتزامن الحالي ثم الاحتفاظ بالمتجر من خلال أي استدعاءات غير متزامنة لاحقة.

مثال:

```js [ESM]
const store = { id: 1 };
// يستبدل المتجر السابق بكائن المتجر المحدد
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // يُرجع كائن المتجر
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // يُرجع نفس الكائن
});
```
سيستمر هذا الانتقال لكامل التنفيذ المتزامن. هذا يعني أنه على سبيل المثال، إذا تم إدخال السياق داخل معالج أحداث، فسيتم أيضًا تشغيل معالجات الأحداث اللاحقة داخل هذا السياق ما لم يتم ربطها تحديدًا بسياق آخر باستخدام `AsyncResource`. لهذا السبب يجب تفضيل `run()` على `enterWith()` ما لم تكن هناك أسباب قوية لاستخدام الطريقة الأخيرة.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // يُرجع نفس الكائن
});

asyncLocalStorage.getStore(); // يُرجع undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // يُرجع نفس الكائن
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**أُضيف في: الإصدار v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يشغّل دالة بشكل متزامن داخل سياق ويعيد قيمة الإرجاع الخاصة بها. لا يمكن الوصول إلى المخزن خارج دالة الاستدعاء. يمكن الوصول إلى المخزن لأي عمليات غير متزامنة تم إنشاؤها داخل دالة الاستدعاء.

يتم تمرير `args` الاختيارية إلى دالة الاستدعاء.

إذا طرحت دالة الاستدعاء خطأً، فسيتم طرح الخطأ بواسطة `run()` أيضًا. لا تتأثر آثار التتبع بهذه المكالمة ويتم الخروج من السياق.

مثال:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // يعيد كائن المخزن
    setTimeout(() => {
      asyncLocalStorage.getStore(); // يعيد كائن المخزن
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // يعيد undefined
  // سيتم التقاط الخطأ هنا
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**أُضيف في: الإصدار v13.10.0, v12.17.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يشغّل دالة بشكل متزامن خارج سياق ويعيد قيمة الإرجاع الخاصة بها. لا يمكن الوصول إلى المخزن داخل دالة الاستدعاء أو العمليات غير المتزامنة التي تم إنشاؤها داخل دالة الاستدعاء. أي استدعاء `getStore()` يتم إجراؤه داخل دالة الاستدعاء سيعيد دائمًا `undefined`.

يتم تمرير `args` الاختيارية إلى دالة الاستدعاء.

إذا طرحت دالة الاستدعاء خطأً، فسيتم طرح الخطأ بواسطة `exit()` أيضًا. لا تتأثر آثار التتبع بهذه المكالمة ويتم إعادة إدخال السياق.

مثال:

```js [ESM]
// ضمن استدعاء لـ run
try {
  asyncLocalStorage.getStore(); // يعيد كائن أو قيمة المخزن
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // يعيد undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // يعيد نفس الكائن أو القيمة
  // سيتم التقاط الخطأ هنا
}
```

### الاستخدام مع `async/await` {#usage-with-async/await}

إذا كان سيتم تشغيل استدعاء `await` واحد فقط في سياق دالة غير متزامنة، فيجب استخدام النمط التالي:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // سيتم انتظار القيمة المرجعة لـ foo
  });
}
```
في هذا المثال، يكون المتجر متاحًا فقط في دالة رد الاتصال والدوال التي يتم استدعاؤها بواسطة `foo`. خارج `run`، سيؤدي استدعاء `getStore` إلى إرجاع `undefined`.

### استكشاف الأخطاء وإصلاحها: فقدان السياق {#troubleshooting-context-loss}

في معظم الحالات، يعمل `AsyncLocalStorage` دون مشاكل. في حالات نادرة، يتم فقدان المتجر الحالي في إحدى العمليات غير المتزامنة.

إذا كان التعليمات البرمجية الخاصة بك تعتمد على ردود الاتصال، فيكفي تحويلها إلى وعد باستخدام [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal) حتى تبدأ في العمل مع الوعود الأصلية.

إذا كنت بحاجة إلى استخدام واجهة برمجة تطبيقات تعتمد على ردود الاتصال أو كان التعليمات البرمجية الخاصة بك تفترض تطبيقًا مخصصًا قابلاً للتنفيذ، فاستخدم الفئة [`AsyncResource`](/ar/nodejs/api/async_context#class-asyncresource) لربط العملية غير المتزامنة بسياق التنفيذ الصحيح. ابحث عن استدعاء الدالة المسؤول عن فقدان السياق عن طريق تسجيل محتوى `asyncLocalStorage.getStore()` بعد الاستدعاءات التي تشك في أنها مسؤولة عن الفقدان. عندما يسجل التعليمات البرمجية `undefined`، فمن المحتمل أن يكون رد الاتصال الأخير الذي تم استدعاؤه مسؤولاً عن فقدان السياق.

## الفئة: `AsyncResource` {#class-asyncresource}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.4.0 | AsyncResource مستقرة الآن. كانت تجريبية سابقًا. |
:::

تم تصميم الفئة `AsyncResource` ليتم توسيعها بواسطة موارد المضمن غير المتزامنة. باستخدام هذا، يمكن للمستخدمين بسهولة تشغيل أحداث دورة حياة مواردهم الخاصة.

سيتم تشغيل الخطاف `init` عند إنشاء مثيل لـ `AsyncResource`.

فيما يلي نظرة عامة على واجهة برمجة تطبيقات `AsyncResource`.



::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() مخصصة للتوسيع. إنشاء مثيل
// جديد لـ AsyncResource() يؤدي أيضًا إلى تشغيل init. إذا تم حذف triggerAsyncId، فسيتم
// استخدام async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// قم بتشغيل دالة في سياق تنفيذ المورد. هذا سوف
// * إنشاء سياق المورد
// * تشغيل ردود الاتصال AsyncHooks before
// * استدعاء الدالة المتوفرة `fn` مع الوسائط المقدمة
// * تشغيل ردود الاتصال AsyncHooks after
// * استعادة سياق التنفيذ الأصلي
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// استدعاء ردود الاتصال AsyncHooks destroy.
asyncResource.emitDestroy();

// إرجاع المعرف الفريد المعين لمثيل AsyncResource.
asyncResource.asyncId();

// إرجاع معرف المشغل لمثيل AsyncResource.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() مخصصة للتوسيع. إنشاء مثيل
// جديد لـ AsyncResource() يؤدي أيضًا إلى تشغيل init. إذا تم حذف triggerAsyncId، فسيتم
// استخدام async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// قم بتشغيل دالة في سياق تنفيذ المورد. هذا سوف
// * إنشاء سياق المورد
// * تشغيل ردود الاتصال AsyncHooks before
// * استدعاء الدالة المتوفرة `fn` مع الوسائط المقدمة
// * تشغيل ردود الاتصال AsyncHooks after
// * استعادة سياق التنفيذ الأصلي
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// استدعاء ردود الاتصال AsyncHooks destroy.
asyncResource.emitDestroy();

// إرجاع المعرف الفريد المعين لمثيل AsyncResource.
asyncResource.asyncId();

// إرجاع معرف المشغل لمثيل AsyncResource.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع الحدث غير المتزامن.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف سياق التنفيذ الذي أنشأ هذا الحدث غير المتزامن. **افتراضي:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فسيتم تعطيل `emitDestroy` عند جمع الكائن المهمل. لا يلزم عادةً تعيين هذا (حتى إذا تم استدعاء `emitDestroy` يدويًا)، إلا إذا تم استرداد `asyncId` للمورد وتم استدعاء واجهة برمجة التطبيقات الحساسة `emitDestroy` به. عند التعيين على `false`، سيتم استدعاء `emitDestroy` عند جمع البيانات المهملة فقط إذا كان هناك خطاف `destroy` نشط واحد على الأقل. **افتراضي:** `false`.
  
 

مثال على الاستخدام:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### طريقة ثابتة: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | تم إهمال خاصية `asyncResource` المضافة إلى الدالة المربوطة وستتم إزالتها في إصدار مستقبلي. |
| v17.8.0, v16.15.0 | تم تغيير القيمة الافتراضية عندما تكون `thisArg` غير معرّفة لاستخدام `this` من المتصل. |
| v16.0.0 | تمت إضافة thisArg اختيارية. |
| v14.8.0, v12.19.0 | تمت إضافتها في: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد ربطها بسياق التنفيذ الحالي.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم اختياري لربطه بـ `AsyncResource` الأساسي.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يربط الدالة المحددة بسياق التنفيذ الحالي.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v20.0.0 | تم إهمال خاصية `asyncResource` المضافة إلى الدالة المرتبطة وسيتم إزالتها في إصدار مستقبلي. |
| v17.8.0, v16.15.0 | تم تغيير الإعداد الافتراضي عندما يكون `thisArg` غير معرف لاستخدام `this` من المتصل. |
| v16.0.0 | تمت إضافة thisArg اختياري. |
| v14.8.0, v12.19.0 | تمت إضافتها في: v14.8.0, v12.19.0 |
:::

- `fn` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد ربطها بنطاق `AsyncResource` الحالي.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يربط الدالة المحددة ليتم تنفيذها في نطاق `AsyncResource` هذا.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**تمت إضافتها في: v9.6.0**

- `fn` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد استدعاؤها في سياق التنفيذ لمورد async هذا.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) المُستقبِل المراد استخدامه لاستدعاء الدالة.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسيطات اختيارية لتمريرها إلى الدالة.

يستدعي الدالة المقدمة مع الوسيطات المقدمة في سياق التنفيذ لمورد async. سيؤدي هذا إلى إنشاء السياق، وتشغيل معاودة الاتصال AsyncHooks before، واستدعاء الدالة، وتشغيل معاودة الاتصال AsyncHooks after، ثم استعادة سياق التنفيذ الأصلي.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- الإرجاع: [\<AsyncResource\>](/ar/nodejs/api/async_hooks#class-asyncresource) مرجع إلى `asyncResource`.

يستدعي جميع خطافات `destroy`. يجب استدعاء هذا مرة واحدة فقط. سيتم طرح خطأ إذا تم استدعاؤه أكثر من مرة. **يجب** استدعاء هذا يدويًا. إذا تُرك المورد ليتم جمعه بواسطة GC، فلن يتم استدعاء خطافات `destroy` أبدًا.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- المردود: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `asyncId` الفريد المُعيَّن للمورد.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- المردود: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) نفس `triggerAsyncId` الذي تم تمريره إلى الدالة البانية `AsyncResource`.

### استخدام `AsyncResource` لمجموعة عمليات `Worker` {#using-asyncresource-for-a-worker-thread-pool}

يوضح المثال التالي كيفية استخدام الفئة `AsyncResource` لتوفير تتبع غير متزامن لمجموعة [`Worker`](/ar/nodejs/api/worker_threads#class-worker) بشكل صحيح. يمكن لمجموعات الموارد الأخرى، مثل مجموعات اتصال قاعدة البيانات، اتباع نموذج مماثل.

بافتراض أن المهمة هي إضافة رقمين، باستخدام ملف باسم `task_processor.js` بالمحتوى التالي:

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

يمكن لمجموعة عمليات Worker حولها استخدام البنية التالية:

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

بدون التتبع الصريح المضاف بواسطة كائنات `WorkerPoolTaskInfo`، سيظهر أن ردود النداء مرتبطة بكائنات `Worker` الفردية. ومع ذلك، فإن إنشاء `Worker`s لا يرتبط بإنشاء المهام ولا يوفر معلومات حول وقت جدولة المهام.

يمكن استخدام هذه المجموعة على النحو التالي:

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### دمج `AsyncResource` مع `EventEmitter` {#integrating-asyncresource-with-eventemitter}

قد يتم تشغيل مستمعي الأحداث الذين تم تشغيلهم بواسطة [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter) في سياق تنفيذ مختلف عن السياق النشط عند استدعاء `eventEmitter.on()`.

يوضح المثال التالي كيفية استخدام الفئة `AsyncResource` لربط مستمع الأحداث بشكل صحيح بسياق التنفيذ الصحيح. يمكن تطبيق نفس النهج على [`Stream`](/ar/nodejs/api/stream#stream) أو فئة مماثلة تعتمد على الأحداث.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```
:::

