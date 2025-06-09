---
title: فهم setImmediate() في Node.js
description: تعلم كيفية عمل setImmediate() في Node.js، واختلافاته عن setTimeout() و process.nextTick() و Promise.then()، وكيفية تفاعله مع حلقة الأحداث والطوابير.
head:
  - - meta
    - name: og:title
      content: فهم setImmediate() في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية عمل setImmediate() في Node.js، واختلافاته عن setTimeout() و process.nextTick() و Promise.then()، وكيفية تفاعله مع حلقة الأحداث والطوابير.
  - - meta
    - name: twitter:title
      content: فهم setImmediate() في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية عمل setImmediate() في Node.js، واختلافاته عن setTimeout() و process.nextTick() و Promise.then()، وكيفية تفاعله مع حلقة الأحداث والطوابير.
---


# فهم `setImmediate()`

عندما تريد تنفيذ جزء من التعليمات البرمجية بشكل غير متزامن، ولكن في أقرب وقت ممكن، فإن أحد الخيارات هو استخدام الدالة `setImmediate()` التي توفرها Node.js:

```js
setImmediate(() => {
    // قم بعمل ما
})
```

أي دالة يتم تمريرها كوسيطة `setImmediate()` هي دالة رد نداء يتم تنفيذها في التكرار التالي لحلقة الأحداث.

كيف تختلف `setImmediate()` عن `setTimeout(() => {}, 0)` (تمرير مهلة 0 مللي ثانية)، وعن `process.nextTick()` و `Promise.then()`؟

سيتم تنفيذ الدالة التي تم تمريرها إلى `process.nextTick()` في التكرار الحالي لحلقة الأحداث، بعد انتهاء العملية الحالية. هذا يعني أنها ستنفذ دائمًا قبل `setTimeout` و `setImmediate`.

يشبه رد نداء `setTimeout()` مع تأخير 0 مللي ثانية `setImmediate()` تمامًا. سيعتمد ترتيب التنفيذ على عوامل مختلفة، ولكن سيتم تشغيلهما في التكرار التالي لحلقة الأحداث.

تتم إضافة رد نداء `process.nextTick` إلى **قائمة انتظار process.nextTick**. تتم إضافة رد نداء `Promise.then()` إلى **قائمة انتظار المهام الصغيرة للوعود**. تتم إضافة رد نداء `setTimeout` و `setImmediate` إلى **قائمة انتظار المهام الكبيرة**.

تقوم حلقة الأحداث بتنفيذ المهام في **قائمة انتظار process.nextTick** أولاً، ثم تنفذ **قائمة انتظار المهام الصغيرة للوعود**، ثم تنفذ `setTimeout` أو `setImmediate` **قائمة انتظار المهام الكبيرة**.

فيما يلي مثال لإظهار الترتيب بين `setImmediate()` و `process.nextTick()` و `Promise.then()`:

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

سيستدعي هذا الرمز أولاً `start()`، ثم يستدعي `foo()` في **قائمة انتظار process.nextTick**. بعد ذلك، سيتعامل مع **قائمة انتظار المهام الصغيرة للوعود**، والتي تطبع bar وتضيف `zoo()` في **قائمة انتظار process.nextTick** في نفس الوقت. ثم سيستدعي `zoo()` التي تمت إضافتها للتو. في النهاية، يتم استدعاء `baz()` في **قائمة انتظار المهام الكبيرة**.

المبدأ المذكور أعلاه صحيح في حالات CommonJS، ولكن ضع في اعتبارك في وحدات ES، على سبيل المثال، ملفات `mjs`، سيكون ترتيب التنفيذ مختلفًا:

```js
// start bar foo zoo baz
```

وذلك لأن وحدة ES التي يتم تحميلها يتم تغليفها كعملية غير متزامنة، وبالتالي فإن البرنامج النصي بأكمله موجود بالفعل في `قائمة انتظار المهام الصغيرة للوعود`. لذلك عندما يتم حل الوعد على الفور، يتم إلحاق رد النداء الخاص به بـ `قائمة انتظار المهام الصغيرة`. ستحاول Node.js مسح قائمة الانتظار حتى تنتقل إلى أي قائمة انتظار أخرى، وبالتالي سترى أنها تطبع bar أولاً.

