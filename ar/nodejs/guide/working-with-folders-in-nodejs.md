---
title: العمل مع المجلدات في Node.js
description: تعلم كيفية العمل مع المجلدات في Node.js باستخدام وحدة fs الأساسية، بما في ذلك التحقق من وجود مجلد، وإنشاء مجلد جديد، وقراءة محتويات المجلد، وإعادة تسمية المجلد، وحذف المجلد.
head:
  - - meta
    - name: og:title
      content: العمل مع المجلدات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية العمل مع المجلدات في Node.js باستخدام وحدة fs الأساسية، بما في ذلك التحقق من وجود مجلد، وإنشاء مجلد جديد، وقراءة محتويات المجلد، وإعادة تسمية المجلد، وحذف المجلد.
  - - meta
    - name: twitter:title
      content: العمل مع المجلدات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية العمل مع المجلدات في Node.js باستخدام وحدة fs الأساسية، بما في ذلك التحقق من وجود مجلد، وإنشاء مجلد جديد، وقراءة محتويات المجلد، وإعادة تسمية المجلد، وحذف المجلد.
---


# التعامل مع المجلدات في Node.js

توفر وحدة `fs` الأساسية في Node.js العديد من الطرق المفيدة التي يمكنك استخدامها للتعامل مع المجلدات.

## التحقق من وجود مجلد

استخدم `fs.access()` (والنسخة المستندة إلى الوعد `fsPromises.access()`) للتحقق مما إذا كان المجلد موجودًا ويمكن لـ Node.js الوصول إليه بأذوناته.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## إنشاء مجلد جديد

استخدم `fs.mkdir()` أو `fs.mkdirSync()` أو `fsPromises.mkdir()` لإنشاء مجلد جديد.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## قراءة محتوى دليل

استخدم `fs.readdir()` أو `fs.readdirSync()` أو `fsPromises.readdir()` لقراءة محتويات دليل.

تقرأ هذه الشيفرة محتوى مجلد، سواء الملفات والمجلدات الفرعية، وتعيد مسارها النسبي:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

يمكنك الحصول على المسار الكامل:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

يمكنك أيضًا تصفية النتائج لإرجاع الملفات فقط، واستبعاد المجلدات:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## إعادة تسمية مجلد

استخدم `fs.rename()` أو `fs.renameSync()` أو `fsPromises.rename()` لإعادة تسمية مجلد. المعامل الأول هو المسار الحالي، والثاني هو المسار الجديد:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` هي النسخة المتزامنة:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` هي النسخة المستندة إلى الوعد:
```javascript
const fs = require('node:fs/promises');
async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```

## إزالة مجلد

استخدم `fs.rmdir()` أو `fs.rmdirSync()` أو `fsPromises.rmdir()` لإزالة مجلد.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

لإزالة مجلد يحتوي على محتويات، استخدم `fs.rm()` مع الخيار `{ recursive: true }` لإزالة المحتويات بشكل متكرر.

`{ recursive: true, force: true }` يجعل الاستثناءات يتم تجاهلها إذا كان المجلد غير موجود.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

