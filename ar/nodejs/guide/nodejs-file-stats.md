---
title: إحصائيات الملفات في Node.js
description: تعلم كيفية استخدام Node.js لفحص تفاصيل الملفات باستخدام طريقة stat() لوحدة fs، بما في ذلك نوع الملف، والحجم، والمزيد.
head:
  - - meta
    - name: og:title
      content: إحصائيات الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية استخدام Node.js لفحص تفاصيل الملفات باستخدام طريقة stat() لوحدة fs، بما في ذلك نوع الملف، والحجم، والمزيد.
  - - meta
    - name: twitter:title
      content: إحصائيات الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية استخدام Node.js لفحص تفاصيل الملفات باستخدام طريقة stat() لوحدة fs، بما في ذلك نوع الملف، والحجم، والمزيد.
---


# إحصائيات ملفات Node.js

يأتي كل ملف بمجموعة من التفاصيل التي يمكننا فحصها باستخدام Node.js. على وجه الخصوص ، باستخدام طريقة `stat()` التي توفرها [وحدة fs](/ar/nodejs/api/fs).

يمكنك استدعاؤها بتمرير مسار ملف ، وبمجرد حصول Node.js على تفاصيل الملف ، سيستدعي وظيفة رد الاتصال التي تمررها ، مع وسيطتين: رسالة خطأ وإحصائيات الملف:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // we have access to the file stats in `stats`
})
```

يوفر Node.js أيضًا طريقة متزامنة ، والتي تحظر مؤشر الترابط حتى تصبح إحصائيات الملف جاهزة:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

يتم تضمين معلومات الملف في متغير الإحصائيات. ما نوع المعلومات التي يمكننا استخلاصها باستخدام الإحصائيات؟

**الكثير ، بما في ذلك:**

- ما إذا كان الملف دليلًا أم ملفًا ، باستخدام `stats.isFile()` و `stats.isDirectory()`
- ما إذا كان الملف ارتباطًا رمزيًا باستخدام `stats.isSymbolicLink()`
- حجم الملف بالبايت باستخدام `stats.size`.

هناك طرق متقدمة أخرى ، ولكن الجزء الأكبر مما ستستخدمه في برمجتك اليومية هو هذا.

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
})
```

يمكنك أيضًا استخدام طريقة `fsPromises.stat()` المستندة إلى promise التي تقدمها وحدة `fs/promises` إذا أردت:

```js
import fs from 'node:fs/promises'
try {
  const stats = await fs.stat('/Users/joe/test.txt')
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
} catch (err) {
  console.log(err)
}
```

يمكنك قراءة المزيد عن وحدة fs في وثائق [وحدة نظام الملفات](/ar/nodejs/api/fs).

