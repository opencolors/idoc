---
title: كيفية قراءة المتغيرات البيئية في Node.js
description: تعلم كيفية الوصول إلى المتغيرات البيئية في Node.js باستخدام خاصية process.env وملفات .env.
head:
  - - meta
    - name: og:title
      content: كيفية قراءة المتغيرات البيئية في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية الوصول إلى المتغيرات البيئية في Node.js باستخدام خاصية process.env وملفات .env.
  - - meta
    - name: twitter:title
      content: كيفية قراءة المتغيرات البيئية في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية الوصول إلى المتغيرات البيئية في Node.js باستخدام خاصية process.env وملفات .env.
---


# كيفية قراءة متغيرات البيئة من Node.js

توفر وحدة العملية الأساسية في Node.js الخاصية `env` التي تستضيف جميع متغيرات البيئة التي تم تعيينها في اللحظة التي بدأت فيها العملية.

يقوم الكود أدناه بتشغيل `app.js` وتعيين `USER_ID` و `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

سيقوم ذلك بتمرير المستخدم `USER_ID` كـ 239482 و `USER_KEY` كـ foobar. هذا مناسب للاختبار، ولكن بالنسبة للإنتاج، ربما ستقوم بتكوين بعض نصوص bash لتصدير المتغيرات.

::: tip NOTE
`process` لا يتطلب `"require"`، فهو متاح تلقائيًا.
:::

فيما يلي مثال للوصول إلى متغيرات البيئة `USER_ID` و `USER_KEY`، التي قمنا بتعيينها في الكود أعلاه.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

بنفس الطريقة يمكنك الوصول إلى أي متغير بيئة مخصص قمت بتعيينه. قدم Node.js 20 دعمًا تجريبيًا [لملفات .env](/ar/nodejs/api/cli#env-file-config).

الآن، يمكنك استخدام علامة `--env-file` لتحديد ملف بيئة عند تشغيل تطبيق Node.js الخاص بك. فيما يلي مثال لملف `.env` وكيفية الوصول إلى متغيراته باستخدام `process.env`.

```bash
.env file
PORT=3000
```

في ملف js الخاص بك

```javascript
process.env.PORT; // 3000
```

قم بتشغيل ملف `app.js` مع تعيين متغيرات البيئة في ملف `.env`.

```js
node --env-file=.env app.js
```

يقوم هذا الأمر بتحميل جميع متغيرات البيئة من ملف `.env`، مما يجعلها متاحة للتطبيق على `process.env`. أيضًا، يمكنك تمرير وسيطات --env-file متعددة. تتجاوز الملفات اللاحقة المتغيرات الموجودة مسبقًا والمحددة في الملفات السابقة.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
إذا تم تعريف نفس المتغير في البيئة وفي الملف، فإن القيمة من البيئة لها الأسبقية.
:::

