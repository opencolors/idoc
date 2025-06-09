---
title: إضافة محتوى إلى ملف في Node.js
description: تعلم كيفية إضافة محتوى إلى ملف في Node.js باستخدام طرق fs.appendFile() و fs.appendFileSync()، مع أمثلة وقطع شيفرة.
head:
  - - meta
    - name: og:title
      content: إضافة محتوى إلى ملف في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية إضافة محتوى إلى ملف في Node.js باستخدام طرق fs.appendFile() و fs.appendFileSync()، مع أمثلة وقطع شيفرة.
  - - meta
    - name: twitter:title
      content: إضافة محتوى إلى ملف في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية إضافة محتوى إلى ملف في Node.js باستخدام طرق fs.appendFile() و fs.appendFileSync()، مع أمثلة وقطع شيفرة.
---


# كتابة الملفات باستخدام Node.js

## كتابة ملف

أسهل طريقة للكتابة إلى الملفات في Node.js هي استخدام واجهة برمجة التطبيقات `fs.writeFile()`.

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // file written successfully
  }
})
```

### كتابة ملف بشكل متزامن

بدلاً من ذلك، يمكنك استخدام الإصدار المتزامن `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

يمكنك أيضًا استخدام طريقة `fsPromises.writeFile()` المستندة إلى الوعود والتي تقدمها وحدة `fs/promises`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

بشكل افتراضي، ستحل واجهة برمجة التطبيقات هذه محل محتويات الملف إذا كان موجودًا بالفعل.

يمكنك تعديل الإعداد الافتراضي عن طريق تحديد علامة:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

العلامات التي من المحتمل أن تستخدمها هي:
| علامة | الوصف | يتم إنشاء الملف إذا لم يكن موجودًا |
| --- | --- | --- |
| `r+` | تفتح هذه العلامة الملف للقراءة والكتابة | :x: |
| `w+` | تفتح هذه العلامة الملف للقراءة والكتابة وتضع أيضًا الدفق في بداية الملف | :white_check_mark: |
| `a` | تفتح هذه العلامة الملف للكتابة وتضع أيضًا الدفق في نهاية الملف | :white_check_mark: |
| `a+` | يفتح هذا الدفق الملف للقراءة والكتابة ويضع أيضًا الدفق في نهاية الملف | :white_check_mark: |

يمكنك العثور على مزيد من المعلومات حول العلامات في وثائق fs.

## إلحاق محتوى بملف

يعد إلحاق الملفات مفيدًا عندما لا تريد استبدال ملف بمحتوى جديد، ولكن بدلاً من ذلك إضافته إليه.


### أمثلة

تعتبر `fs.appendFile()` (والنظير `fs.appendFileSync()` لها) طريقة سهلة لإلحاق محتوى بنهاية ملف:

```javascript
const fs = require('node:fs')
const content = 'بعض المحتوى!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // تم!
  }
})
```

### مثال مع الوعود

إليك مثال `fsPromises.appendFile()`:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'بعض المحتوى!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

