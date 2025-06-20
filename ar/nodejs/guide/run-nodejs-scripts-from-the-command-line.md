---
title: تشغيل سكربتات Node.js من سطر الأوامر
description: تعلم كيفية تشغيل برامج Node.js من سطر الأوامر، بما في ذلك استخدام أمر node، خطوط shebang، أذونات التنفيذ، تمرير السلاسل كوسائط، وإعادة تشغيل التطبيق تلقائيًا.
head:
  - - meta
    - name: og:title
      content: تشغيل سكربتات Node.js من سطر الأوامر | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية تشغيل برامج Node.js من سطر الأوامر، بما في ذلك استخدام أمر node، خطوط shebang، أذونات التنفيذ، تمرير السلاسل كوسائط، وإعادة تشغيل التطبيق تلقائيًا.
  - - meta
    - name: twitter:title
      content: تشغيل سكربتات Node.js من سطر الأوامر | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية تشغيل برامج Node.js من سطر الأوامر، بما في ذلك استخدام أمر node، خطوط shebang، أذونات التنفيذ، تمرير السلاسل كوسائط، وإعادة تشغيل التطبيق تلقائيًا.
---


# تشغيل برامج Node.js من سطر الأوامر

الطريقة المعتادة لتشغيل برنامج Node.js هي تشغيل الأمر `node` المتاح عالميًا (بمجرد تثبيت Node.js) وتمرير اسم الملف الذي تريد تنفيذه.

إذا كان ملف تطبيق Node.js الرئيسي الخاص بك هو `app.js`، فيمكنك استدعائه عن طريق كتابة:

```bash
node app.js
```

أعلاه، أنت تخبر الصدفة صراحةً بتشغيل البرنامج النصي الخاص بك باستخدام `node`. يمكنك أيضًا تضمين هذه المعلومات في ملف JavaScript الخاص بك باستخدام سطر "shebang". "Shebang" هو السطر الأول في الملف، ويخبر نظام التشغيل بالمترجم المراد استخدامه لتشغيل البرنامج النصي. فيما يلي السطر الأول من JavaScript:

```javascript
#!/usr/bin/node
```

أعلاه، نعطي المسار المطلق للمترجم بشكل صريح. ليس لدى جميع أنظمة التشغيل `node` في مجلد `bin`، ولكن يجب أن يكون لدى الجميع `env`. يمكنك إخبار نظام التشغيل بتشغيل `env` مع `node` كمعامل:

```javascript
#!/usr/bin/env node
// your javascript code
```

## لاستخدام shebang، يجب أن يكون لملفك إذن تنفيذي.

يمكنك منح `app.js` الإذن التنفيذي عن طريق التشغيل:

```bash
chmod u+x app.js
```

أثناء تشغيل الأمر، تأكد من أنك في نفس الدليل الذي يحتوي على ملف `app.js`.

## تمرير سلسلة كوسيطة إلى node بدلاً من مسار الملف

لتنفيذ سلسلة كوسيطة، يمكنك استخدام `-e`، `--eval "script"`. قم بتقييم الوسيطة التالية كـ JavaScript. يمكن أيضًا استخدام الوحدات النمطية المعرّفة مسبقًا في REPL في البرنامج النصي. في نظام التشغيل Windows، باستخدام `cmd.exe` لن يعمل اقتباس فردي بشكل صحيح لأنه لا يتعرف إلا على علامات اقتباس مزدوجة `"` للاقتباس. في Powershell أو Git bash، يمكن استخدام كل من `"` و `'`.

```bash
node -e "console.log(123)"
```

## إعادة تشغيل التطبيق تلقائيًا

اعتبارًا من nodejs V 16، يوجد خيار مدمج لإعادة تشغيل التطبيق تلقائيًا عند تغيير ملف. هذا مفيد لأغراض التطوير. لاستخدام هذه الميزة، تحتاج إلى تمرير علامة `watch` إلى nodejs.

```bash
node --watch app.js
```

لذلك عندما تقوم بتغيير الملف، سيتم إعادة تشغيل التطبيق تلقائيًا. اقرأ وثائق علامة --watch [flag documentation](/ar/nodejs/api/cli#watch).

