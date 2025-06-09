---
title: فهم process.nextTick() في Node.js
description: تعلم كيفية عمل process.nextTick() في Node.js وكيف يختلف عن setImmediate() و setTimeout(). افهم حلقة الأحداث وكيفية استخدام nextTick() لتنفيذ الشيفرة بشكل غير متزامن.
head:
  - - meta
    - name: og:title
      content: فهم process.nextTick() في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية عمل process.nextTick() في Node.js وكيف يختلف عن setImmediate() و setTimeout(). افهم حلقة الأحداث وكيفية استخدام nextTick() لتنفيذ الشيفرة بشكل غير متزامن.
  - - meta
    - name: twitter:title
      content: فهم process.nextTick() في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية عمل process.nextTick() في Node.js وكيف يختلف عن setImmediate() و setTimeout(). افهم حلقة الأحداث وكيفية استخدام nextTick() لتنفيذ الشيفرة بشكل غير متزامن.
---


# فهم `process.nextTick()`

عندما تحاول فهم حلقة الأحداث في Node.js، فإن جزءًا مهمًا منها هو `process.nextTick()`. في كل مرة تقوم فيها حلقة الأحداث برحلة كاملة، نسمي ذلك "تكة".

عندما نمرر دالة إلى process.nextTick()، فإننا نوجه المحرك لاستدعاء هذه الدالة في نهاية العملية الحالية، قبل بدء دورة حلقة الأحداث التالية:

```js
process.nextTick(() => {
  // قم بعمل شيء ما
})
```

حلقة الأحداث مشغولة بمعالجة كود الدالة الحالي. عندما تنتهي هذه العملية، يقوم محرك JS بتشغيل جميع الدوال التي تم تمريرها إلى استدعاءات `nextTick` خلال تلك العملية.

إنها الطريقة التي يمكننا بها إخبار محرك JS بمعالجة دالة بشكل غير متزامن (بعد الدالة الحالية)، ولكن في أقرب وقت ممكن، وليس وضعها في قائمة الانتظار.

سيؤدي استدعاء `setTimeout(() => {}, 0)` إلى تنفيذ الدالة في نهاية التكة التالية، بعد وقت أطول بكثير من استخدام `nextTick()` الذي يعطي الأولوية للاستدعاء وينفذه قبل بداية التكة التالية مباشرةً.

استخدم `nextTick()` عندما تريد التأكد من أن الكود قد تم تنفيذه بالفعل في التكرار التالي لحلقة الأحداث.

## مثال على ترتيب الأحداث:

```js
console.log('Hello => number 1')
setImmediate(() => {
  console.log('Running before the timeout => number 3')
})
setTimeout(() => {
  console.log('The timeout running last => number 4')
}, 0)
process.nextTick(() => {
  console.log('Running at next tick => number 2')
})
```

## مثال على الإخراج:

```bash
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```

قد يختلف الإخراج الدقيق من تشغيل إلى تشغيل.

