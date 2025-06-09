---
title: قراءة الملفات باستخدام Node.js
description: تعلم كيفية قراءة الملفات في Node.js باستخدام طرق fs.readFile() و fs.readFileSync() و fsPromises.readFile().
head:
  - - meta
    - name: og:title
      content: قراءة الملفات باستخدام Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية قراءة الملفات في Node.js باستخدام طرق fs.readFile() و fs.readFileSync() و fsPromises.readFile().
  - - meta
    - name: twitter:title
      content: قراءة الملفات باستخدام Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية قراءة الملفات في Node.js باستخدام طرق fs.readFile() و fs.readFileSync() و fsPromises.readFile().
---


# قراءة الملفات باستخدام Node.js

أبسط طريقة لقراءة ملف في Node.js هي استخدام الطريقة `fs.readFile()`، وتمرير مسار الملف والترميز ووظيفة رد الاتصال التي سيتم استدعاؤها مع بيانات الملف (والخطأ):

```javascript
const fs = require('node:fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

بدلاً من ذلك، يمكنك استخدام الإصدار المتزامن `fs.readFileSync()`:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

يمكنك أيضًا استخدام الطريقة `fsPromises.readFile()` المستندة إلى الوعد التي تقدمها الوحدة `fs/promises`:

```javascript
const fs = require('node:fs/promises')

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

example()
```

تقوم كل من `fs.readFile()` و `fs.readFileSync()` و `fsPromises.readFile()` بقراءة المحتوى الكامل للملف في الذاكرة قبل إرجاع البيانات.

وهذا يعني أن الملفات الكبيرة سيكون لها تأثير كبير على استهلاك الذاكرة وسرعة تنفيذ البرنامج.

في هذه الحالة، الخيار الأفضل هو قراءة محتوى الملف باستخدام التدفقات.

