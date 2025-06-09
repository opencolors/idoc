---
title: مرسل الأحداث في Node.js
description: تعلم عن مرسل الأحداث في Node.js، أداة قوية لمعالجة الأحداث في تطبيقاتك الخلفية.
head:
  - - meta
    - name: og:title
      content: مرسل الأحداث في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم عن مرسل الأحداث في Node.js، أداة قوية لمعالجة الأحداث في تطبيقاتك الخلفية.
  - - meta
    - name: twitter:title
      content: مرسل الأحداث في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم عن مرسل الأحداث في Node.js، أداة قوية لمعالجة الأحداث في تطبيقاتك الخلفية.
---


# باعث الأحداث في Node.js

إذا كنت قد عملت مع JavaScript في المتصفح، فأنت تعرف مقدار تفاعل المستخدم الذي يتم التعامل معه من خلال الأحداث: نقرات الماوس، وضغطات أزرار لوحة المفاتيح، والتفاعل مع حركات الماوس، وما إلى ذلك.

على جانب الواجهة الخلفية، يمنحنا Node.js خيار بناء نظام مماثل باستخدام **[وحدة الأحداث](/ar/nodejs/api/events)**.

تقدم هذه الوحدة، على وجه الخصوص، فئة EventEmitter، التي سنستخدمها للتعامل مع أحداثنا.

تقوم بتهيئة ذلك باستخدام

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

يعرض هذا الكائن، من بين أشياء أخرى كثيرة، طرق `on` و `emit`.

- تُستخدم `emit` لتشغيل حدث
- تُستخدم `on` لإضافة وظيفة رد نداء سيتم تنفيذها عند تشغيل الحدث

على سبيل المثال، لنقم بإنشاء حدث `start`، وعلى سبيل تقديم مثال، نتفاعل مع ذلك ببساطة عن طريق التسجيل في وحدة التحكم:

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

عندما نقوم بتشغيل

```js
eventEmitter.emit('start');
```

يتم تشغيل وظيفة معالج الأحداث، ونحصل على سجل وحدة التحكم.

يمكنك تمرير وسيطات إلى معالج الأحداث عن طريق تمريرها كوسيطات إضافية إلى `emit()`:

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

وسيطات متعددة:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

يعرض كائن EventEmitter أيضًا العديد من الطرق الأخرى للتفاعل مع الأحداث، مثل

- `once()`: إضافة مستمع لمرة واحدة
- `removeListener()` / `off()`: إزالة مستمع حدث من حدث
- `removeAllListeners()`: إزالة جميع المستمعين لحدث

يمكنك قراءة المزيد عن هذه الطرق في [وثائق وحدة الأحداث](/ar/nodejs/api/events).

