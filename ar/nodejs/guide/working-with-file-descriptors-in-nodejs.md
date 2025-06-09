---
title: فتح الملفات في Node.js
description: تعلم كيفية فتح الملفات في Node.js باستخدام وحدة fs، بما في ذلك الطرق المتزامنة وغير المتزامنة، والنهج المعتمد على الوعود.
head:
  - - meta
    - name: og:title
      content: فتح الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية فتح الملفات في Node.js باستخدام وحدة fs، بما في ذلك الطرق المتزامنة وغير المتزامنة، والنهج المعتمد على الوعود.
  - - meta
    - name: twitter:title
      content: فتح الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية فتح الملفات في Node.js باستخدام وحدة fs، بما في ذلك الطرق المتزامنة وغير المتزامنة، والنهج المعتمد على الوعود.
---


# التعامل مع واصفات الملفات في Node.js

قبل أن تتمكن من التفاعل مع ملف موجود في نظام الملفات الخاص بك، يجب عليك الحصول على واصف ملف. واصف الملف هو مرجع إلى ملف مفتوح، وهو رقم (fd) يتم إرجاعه عن طريق فتح الملف باستخدام طريقة `open()` التي توفرها الوحدة النمطية `fs`. هذا الرقم (fd) يحدد بشكل فريد ملفًا مفتوحًا في نظام التشغيل.

## فتح الملفات

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd هو واصف الملف الخاص بنا
});
```

لاحظ `'r'` التي استخدمناها كمعامل ثانٍ لاستدعاء `fs.open()`. هذا العلم يعني أننا نفتح الملف للقراءة. أعلام أخرى ستستخدمها بشكل شائع هي:

| العلم | الوصف                                                                 |
|------|-----------------------------------------------------------------------|
| `'w+'`| يفتح هذا العلم الملف للقراءة والكتابة. ويضع الدفق في بداية الملف. |
| `'a+'`| يفتح هذا العلم الملف للقراءة والكتابة ويضع الدفق أيضًا في نهاية الملف. |

يمكنك أيضًا فتح الملف باستخدام طريقة `fs.openSync`، والتي تُرجع واصف الملف بدلاً من توفيره في رد نداء:

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## إجراء العمليات

بمجرد حصولك على واصف الملف بأي طريقة تختارها، يمكنك إجراء جميع العمليات التي تتطلب ذلك، مثل استدعاء `fs.close()` والعديد من العمليات الأخرى التي تتفاعل مع نظام الملفات.

## استخدام fsPromises

يمكنك أيضًا فتح الملف باستخدام طريقة `fsPromises.open` المستندة إلى الوعود والتي تقدمها الوحدة النمطية `fs/promises`. الوحدة النمطية `fs/promises` متاحة بدءًا من Node.js v14 فقط. قبل v14، بعد v10، يمكنك استخدام `require('fs').promises` بدلاً من ذلك. قبل v10، بعد v8، يمكنك استخدام `util.promisify` لتحويل طرق `fs` إلى طرق مستندة إلى الوعود.

### ES Modules (MJS)

```javascript
import fs from 'node:fs/promises';

async function run() {
  const fileHandle = await fs.open('example.txt', 'r');
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    await fileHandle.close();
  }
}

run().catch(console.error);
```


## مثال على util.promisify

فيما يلي مثال على استخدام `util.promisify` لتحويل `fs.open` إلى دالة قائمة على الوعود:

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Use file descriptor
  })
  .catch((err) => {
    // Handle error
  });
```

لمعرفة المزيد من التفاصيل حول وحدة `fs/promises`، يرجى التحقق من [توثيق واجهة برمجة التطبيقات fs/promises](/ar/nodejs/api/fs#promises).

