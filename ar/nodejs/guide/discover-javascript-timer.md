---
title: مؤقتات JavaScript - setTimeout و setInterval
description: تعلم كيفية استخدام مؤقتات JavaScript لتأخير تنفيذ الدوال وجدولة المهام باستخدام setTimeout و setInterval.
head:
  - - meta
    - name: og:title
      content: مؤقتات JavaScript - setTimeout و setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية استخدام مؤقتات JavaScript لتأخير تنفيذ الدوال وجدولة المهام باستخدام setTimeout و setInterval.
  - - meta
    - name: twitter:title
      content: مؤقتات JavaScript - setTimeout و setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية استخدام مؤقتات JavaScript لتأخير تنفيذ الدوال وجدولة المهام باستخدام setTimeout و setInterval.
---


# اكتشف مؤقتات JavaScript

### `setTimeout()`

عند كتابة كود JavaScript ، قد ترغب في تأخير تنفيذ وظيفة ما.

هذه هي وظيفة `setTimeout`. يمكنك تحديد وظيفة رد نداء ليتم تنفيذها لاحقًا ، وقيمة تعبر عن المدة التي تريد تشغيلها لاحقًا بالمللي ثانية:

```js
setTimeout(() => {
  // يتم التشغيل بعد ثانيتين
}, 2000);
setTimeout(() => {
  // يتم التشغيل بعد 50 مللي ثانية
}, 50);
```

يحدد هذا التركيب وظيفة جديدة. يمكنك استدعاء أي وظيفة أخرى تريدها هناك ، أو يمكنك تمرير اسم وظيفة موجودة ، ومجموعة من المعلمات:

```js
const myFunction = (firstParam, secondParam) => {
  // قم بشيء ما
};
// يتم التشغيل بعد ثانيتين
setTimeout(myFunction, 2000, firstParam, secondParam);
```

ترجع `setTimeout` معرف المؤقت. لا يتم استخدام هذا بشكل عام ، ولكن يمكنك تخزين هذا المعرف ومسحه إذا كنت تريد حذف تنفيذ الوظيفة المجدولة:

```js
const id = setTimeout(() => {
  // يجب أن يتم التشغيل بعد ثانيتين
}, 2000);
// لقد غيرت رأيي
clearTimeout(id);
```

## تأخير صفري

إذا قمت بتحديد تأخير المهلة إلى 0 ، فسيتم تنفيذ وظيفة رد النداء في أقرب وقت ممكن ، ولكن بعد تنفيذ الوظيفة الحالية:

```js
setTimeout(() => {
  console.log('بعد ');
}, 0);
console.log(' قبل ');
```

سيقوم هذا الكود بطباعة

```bash
قبل
بعد
```

هذا مفيد بشكل خاص لتجنب حظر وحدة المعالجة المركزية على المهام المكثفة والسماح بتنفيذ وظائف أخرى أثناء إجراء حساب ثقيل ، عن طريق وضع وظائف في قائمة الانتظار في المجدول.

::: tip
تقوم بعض المتصفحات (IE و Edge) بتنفيذ طريقة `setImmediate ()` التي تقوم بنفس الوظيفة تمامًا ، ولكنها ليست قياسية و [غير متوفرة في المتصفحات الأخرى](https://caniuse.com/#feat=setimmediate). لكنها وظيفة قياسية في Node.js.
:::

### `setInterval()`

`setInterval` هي دالة مشابهة لـ `setTimeout` ، مع اختلاف: بدلاً من تشغيل وظيفة رد النداء مرة واحدة ، سيتم تشغيلها إلى الأبد ، في الفترة الزمنية المحددة التي تحددها (بالمللي ثانية):

```js
setInterval(() => {
  // يتم التشغيل كل ثانيتين
}, 2000);
```

تعمل الوظيفة أعلاه كل ثانيتين ما لم تخبرها بالتوقف ، باستخدام `clearInterval` ، وتمرير معرف الفاصل الزمني الذي أرجعته `setInterval`:

```js
const id = setInterval(() => {
  // يتم التشغيل كل ثانيتين
}, 2000);
// لقد غيرت رأيي
clearInterval(id);
```

من الشائع استدعاء `clearInterval` داخل وظيفة رد نداء `setInterval` ، لتمكينها من تحديد ما إذا كان يجب تشغيلها مرة أخرى أو التوقف تلقائيًا. على سبيل المثال ، يقوم هذا الكود بتشغيل شيء ما ما لم تكن قيمة App.somethingIWait قد وصلت:


## setTimeout متكرر

يبدأ `setInterval` دالة كل ن ملي ثانية، دون أي اعتبار لموعد انتهاء الدالة من تنفيذها.

إذا كانت الدالة تستغرق دائمًا نفس القدر من الوقت، فالأمر على ما يرام.

ربما تستغرق الدالة أوقات تنفيذ مختلفة، اعتمادًا على ظروف الشبكة.

وربما يتداخل تنفيذ طويل مع التنفيذ التالي.

لتجنب ذلك، يمكنك جدولة setTimeout متكرر ليتم استدعاؤه عند انتهاء دالة الاستدعاء:

```js
const myFunction = () => {
  // فعل شيء ما
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

يتوفر `setTimeout` و `setInterval` في Node.js، من خلال [وحدة المؤقتات](/ar/nodejs/api/timers).

يوفر Node.js أيضًا `setImmediate()`، وهو ما يعادل استخدام `setTimeout(() => {}, 0)`، ويستخدم في الغالب للعمل مع حلقة أحداث Node.js.

