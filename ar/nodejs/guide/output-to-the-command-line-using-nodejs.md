---
title: الإخراج إلى سطر الأوامر باستخدام Node.js
description: يوفر Node.js وحدة console مع العديد من الطرق للتفاعل مع سطر الأوامر، بما في ذلك التسجيل، والعد، والوقت، والمزيد.
head:
  - - meta
    - name: og:title
      content: الإخراج إلى سطر الأوامر باستخدام Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يوفر Node.js وحدة console مع العديد من الطرق للتفاعل مع سطر الأوامر، بما في ذلك التسجيل، والعد، والوقت، والمزيد.
  - - meta
    - name: twitter:title
      content: الإخراج إلى سطر الأوامر باستخدام Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يوفر Node.js وحدة console مع العديد من الطرق للتفاعل مع سطر الأوامر، بما في ذلك التسجيل، والعد، والوقت، والمزيد.
---


# الإخراج إلى سطر الأوامر باستخدام Node.js

الإخراج الأساسي باستخدام وحدة التحكم console
توفر Node.js وحدة التحكم console التي توفر الكثير من الطرق المفيدة جدًا للتفاعل مع سطر الأوامر. إنه في الأساس نفس كائن وحدة التحكم الذي تجده في المتصفح.

الطريقة الأكثر أساسية والأكثر استخدامًا هي `console.log()` ، والتي تطبع السلسلة التي تمررها إليها في وحدة التحكم. إذا قمت بتمرير كائن ، فسيتم عرضه كسلسلة.

يمكنك تمرير متغيرات متعددة إلى `console.log` ، على سبيل المثال:
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

يمكننا أيضًا تنسيق عبارات جميلة عن طريق تمرير المتغيرات ومحدد التنسيق. على سبيل المثال:
```javascript
console.log('My %s has %d ears', 'cat', 2);
```

- %s تنسيق متغير كسلسلة
- %d تنسيق متغير كرقم
- %i تنسيق متغير كجزءه الصحيح فقط
- %o تنسيق متغير ككائن
مثال:
```javascript
console.log('%o', Number);
```
## مسح وحدة التحكم

`console.clear()` يمسح وحدة التحكم (قد يعتمد السلوك على وحدة التحكم المستخدمة).

## عد العناصر

`console.count()` هي طريقة مفيدة.
خذ هذا الكود:
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('The value of x is '+x+' and has been checked..how many times?');
console.count('The value of x is'+x+'and has been checked..how many times?');
console.count('The value of y is'+y+'and has been checked..how many times?');
```

ما يحدث هو أن `console.count()` سيحصي عدد مرات طباعة السلسلة ، ويطبع العدد بجانبها:

يمكنك فقط عد التفاح والبرتقال:

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## إعادة تعيين العد

تعيد الطريقة `console.countReset()` تعيين العداد المستخدم مع `console.count()`.

سنستخدم مثال التفاح والبرتقال لتوضيح ذلك.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## طباعة تتبع المكدس

قد تكون هناك حالات يكون فيها من المفيد طباعة تتبع مكدس استدعاء دالة، ربما للإجابة على السؤال كيف وصلت إلى هذا الجزء من التعليمات البرمجية؟

يمكنك القيام بذلك باستخدام `console.trace()`:

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

سيؤدي هذا إلى طباعة تتبع المكدس. هذا ما تتم طباعته إذا جربنا هذا في Node.js REPL:

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## حساب الوقت المستغرق

يمكنك بسهولة حساب مقدار الوقت الذي تستغرقه الدالة لتشغيلها، باستخدام `time()` و `timeEnd()`.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // do something, and measure the time it takes
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout و stderr

كما رأينا، يعد `console.log` رائعًا لطباعة الرسائل في وحدة التحكم. هذا ما يسمى الإخراج القياسي أو stdout.

يطبع `console.error` إلى دفق stderr.

لن يظهر في وحدة التحكم، ولكنه سيظهر في سجل الأخطاء.

## تلوين الإخراج

يمكنك تلوين إخراج النص في وحدة التحكم باستخدام تسلسلات الهروب. تسلسل الهروب عبارة عن مجموعة من الأحرف التي تحدد لونًا.

مثال:

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

يمكنك تجربة ذلك في Node.js REPL، وسيتم طباعة hi! باللون الأصفر.

ومع ذلك، هذه هي الطريقة منخفضة المستوى للقيام بذلك. أسهل طريقة لتلوين إخراج وحدة التحكم هي استخدام مكتبة. Chalk هي إحدى هذه المكتبات، بالإضافة إلى التلوين، فهي تساعد أيضًا في تسهيلات التصميم الأخرى، مثل جعل النص غامقًا أو مائلًا أو مسطرًا.

يمكنك تثبيته باستخدام `npm install chalk`، ثم يمكنك استخدامه:

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

يعد استخدام `chalk.yellow` أكثر ملاءمة بكثير من محاولة تذكر رموز الهروب، والشفرة أكثر قابلية للقراءة.

تحقق من رابط المشروع المنشور أعلاه للحصول على المزيد من أمثلة الاستخدام.


## إنشاء شريط تقدم

`progress` هي حزمة رائعة لإنشاء شريط تقدم في وحدة التحكم. قم بتثبيتها باستخدام `npm install progress`.

تنشئ هذه الشفرة شريط تقدم من 10 خطوات، وتكتمل خطوة واحدة كل 100 مللي ثانية. عند اكتمال الشريط، نقوم بمسح الفاصل الزمني:

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```

