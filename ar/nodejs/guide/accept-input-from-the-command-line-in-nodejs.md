---
title: الحصول على إدخال المستخدم في Node.js
description: تعلم كيفية إنشاء برامج تفاعل سطر الأوامر في Node.js باستخدام وحدة readline وحزمة Inquirer.js.
head:
  - - meta
    - name: og:title
      content: الحصول على إدخال المستخدم في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية إنشاء برامج تفاعل سطر الأوامر في Node.js باستخدام وحدة readline وحزمة Inquirer.js.
  - - meta
    - name: twitter:title
      content: الحصول على إدخال المستخدم في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية إنشاء برامج تفاعل سطر الأوامر في Node.js باستخدام وحدة readline وحزمة Inquirer.js.
---


# قبول المدخلات من سطر الأوامر في Node.js

كيف تجعل برنامج Node.js CLI تفاعليًا؟

يوفر Node.js منذ الإصدار 7 وحدة `readline` للقيام بذلك بالضبط: الحصول على مدخلات من دفق قابل للقراءة مثل دفق `process.stdin`، والذي يكون أثناء تنفيذ برنامج Node.js هو إدخال المحطة الطرفية، سطر واحد في كل مرة.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("What's your name?", name => {
    console.log('Hi ' + name + '!');
    rl.close();
});
```

تسأل هذه الشيفرة اسم المستخدم، وبمجرد إدخال النص وضغط المستخدم على إدخال، نرسل تحية.

تعرض طريقة `question()` المعلمة الأولى (سؤال) وتنتظر إدخال المستخدم. ثم تستدعي وظيفة رد الاتصال بمجرد الضغط على إدخال.

في وظيفة رد الاتصال هذه، نقوم بإغلاق واجهة القراءة.

توفر `readline` العديد من الطرق الأخرى، يرجى التحقق منها في وثائق الحزمة المرتبطة أعلاه.

إذا كنت بحاجة إلى طلب كلمة مرور، فمن الأفضل عدم إعادتها، ولكن بدلاً من ذلك إظهار رمز *.

أبسط طريقة هي استخدام حزمة readline-sync والتي تشبه إلى حد كبير واجهة برمجة التطبيقات وتعالج هذا الأمر خارج الصندوق. يتم توفير حل أكثر اكتمالًا وتجريدًا بواسطة حزمة Inquirer.js.

يمكنك تثبيته باستخدام `npm install inquirer`، وبعد ذلك يمكنك تكرار الشيفرة أعلاه مثل هذا:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "what's your name?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Hi ' + answers.name + '!');
});
```

تتيح لك `Inquirer.js` القيام بأشياء كثيرة مثل طرح خيارات متعددة، والحصول على أزرار راديو، والتأكيدات، والمزيد.

يجدر معرفة جميع البدائل، وخاصة البدائل المدمجة التي توفرها Node.js، ولكن إذا كنت تخطط لنقل إدخال CLI إلى المستوى التالي، فإن `Inquirer.js` هو خيار أمثل.

