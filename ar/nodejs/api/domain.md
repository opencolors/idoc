---
title: توثيق Node.js - وحدة النطاق
description: توفر وحدة النطاق في Node.js طريقة للتعامل مع الأخطاء والاستثناءات في الشيفرة غير المتزامنة، مما يتيح إدارة الأخطاء بشكل أكثر قوة وعمليات التنظيف.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - وحدة النطاق | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة النطاق في Node.js طريقة للتعامل مع الأخطاء والاستثناءات في الشيفرة غير المتزامنة، مما يتيح إدارة الأخطاء بشكل أكثر قوة وعمليات التنظيف.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - وحدة النطاق | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة النطاق في Node.js طريقة للتعامل مع الأخطاء والاستثناءات في الشيفرة غير المتزامنة، مما يتيح إدارة الأخطاء بشكل أكثر قوة وعمليات التنظيف.
---


# المجال {#domain}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v8.8.0 | لم تعد أي `Promise`s تم إنشاؤها في سياقات الجهاز الظاهري (VM) تحتوي على خاصية `.domain`. ومع ذلك، لا تزال معالجاتها تُنفَّذ في المجال المناسب، و`Promise`s التي تم إنشاؤها في السياق الرئيسي لا تزال تمتلك خاصية `.domain`. |
| v8.0.0 | يتم الآن استدعاء معالجات `Promise`s في المجال الذي تم فيه إنشاء أول وعد في السلسلة. |
| v1.4.2 | تم الإيقاف منذ: v1.4.2 |
:::

::: danger [مستقر: 0 - تم الإيقاف]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف
:::

**شفرة المصدر:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**هذه الوحدة النمطية معلقة للإيقاف.** بمجرد الانتهاء من واجهة برمجة تطبيقات بديلة، سيتم إيقاف هذه الوحدة النمطية بالكامل. يجب على معظم المطورين **عدم** وجود سبب لاستخدام هذه الوحدة النمطية. يمكن للمستخدمين الذين يجب أن يكون لديهم وظائف توفرها المجالات الاعتماد عليها في الوقت الحالي ولكن يجب أن يتوقعوا الاضطرار إلى الترحيل إلى حل مختلف في المستقبل.

توفر المجالات طريقة للتعامل مع عمليات الإدخال/الإخراج المختلفة المتعددة كمجموعة واحدة. إذا كانت أي من باعثات الأحداث أو عمليات الاسترجاع المسجلة في المجال تبعث حدث `'error'`، أو تطرح خطأً، فسيتم إخطار كائن المجال، بدلاً من فقدان سياق الخطأ في معالج `process.on('uncaughtException')`، أو التسبب في خروج البرنامج على الفور برمز خطأ.

## تحذير: لا تتجاهل الأخطاء! {#warning-dont-ignore-errors!}

معالجات أخطاء المجال ليست بديلاً عن إغلاق عملية عند حدوث خطأ.

بحكم طبيعة عمل [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) في JavaScript، لا توجد أبدًا أي طريقة آمنة "للاستئناف من حيث توقفت"، دون تسريب المراجع، أو إنشاء نوع آخر من الحالة الهشة غير المحددة.

أسلم طريقة للرد على خطأ تم طرحه هي إيقاف العملية. بالطبع، في خادم ويب عادي، قد يكون هناك العديد من الاتصالات المفتوحة، وليس من المعقول إغلاقها فجأة لأن شخصًا آخر تسبب في حدوث خطأ.

النهج الأفضل هو إرسال استجابة خطأ إلى الطلب الذي أثار الخطأ، مع السماح للآخرين بالانتهاء في وقتهم الطبيعي، والتوقف عن الاستماع إلى الطلبات الجديدة في هذا العامل.

بهذه الطريقة، يسير استخدام `domain` جنبًا إلى جنب مع وحدة المجموعة (cluster module)، حيث يمكن للعملية الأولية تفرع عامل جديد عندما يواجه أحد العمال خطأ. بالنسبة لبرامج Node.js التي تتوسع لتشمل أجهزة متعددة، يمكن لوكيل الإنهاء أو سجل الخدمة ملاحظة الفشل والرد وفقًا لذلك.

على سبيل المثال، هذه ليست فكرة جيدة:

```js [ESM]
// XXX تحذير! فكرة سيئة!

const d = require('node:domain').create();
d.on('error', (er) => {
  // لن يؤدي الخطأ إلى تعطيل العملية، ولكن ما يفعله أسوأ!
  // على الرغم من أننا منعنا إعادة تشغيل العملية المفاجئة، إلا أننا نسرب الكثير
  // من الموارد إذا حدث هذا في أي وقت مضى.
  // هذا ليس أفضل من process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
باستخدام سياق المجال، ومرونة فصل برنامجنا إلى عمليات عامل متعددة، يمكننا الرد بشكل أكثر ملاءمة والتعامل مع الأخطاء بأمان أكبر.

```js [ESM]
// أفضل بكثير!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // سيكون لدى السيناريو الأكثر واقعية أكثر من 2 من العمال،
  // وربما لا يضع الابتدائي والعامل في نفس الملف.
  //
  // من الممكن أيضًا أن تكون أكثر أناقة بعض الشيء بشأن التسجيل، و
  // تنفيذ أي منطق مخصص مطلوب لمنع DoS
  // الهجمات والسلوك السيئ الآخر.
  //
  // راجع الخيارات في وثائق المجموعة.
  //
  // الشيء المهم هو أن الابتدائي يفعل القليل جدًا،
  // زيادة مرونتنا في مواجهة الأخطاء غير المتوقعة.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // العامل
  //
  // هذا هو المكان الذي نضع فيه أخطائنا!

  const domain = require('node:domain');

  // راجع وثائق المجموعة لمزيد من التفاصيل حول استخدام
  // عمليات العامل لخدمة الطلبات. كيف يعمل، المحاذير، إلخ.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // نحن في منطقة خطرة!
      // بحكم التعريف، حدث شيء غير متوقع،
      // وهو ما لم نكن نريده على الأرجح.
      // أي شيء يمكن أن يحدث الآن! كن حذرا جدا!

      try {
        // تأكد من أننا نغلق في غضون 30 ثانية
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // لكن لا تبقي العملية مفتوحة لمجرد ذلك!
        killtimer.unref();

        // توقف عن استقبال طلبات جديدة.
        server.close();

        // أخبر الابتدائي أننا ميتون. سيؤدي هذا إلى تشغيل
        // 'disconnect' في المجموعة الابتدائية، ثم سيقوم بتفرع
        // عامل جديد.
        cluster.worker.disconnect();

        // حاول إرسال خطأ إلى الطلب الذي أثار المشكلة
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // حسنا، ليس هناك الكثير مما يمكننا فعله في هذه المرحلة.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // نظرًا لأن req و res تم إنشاؤهما قبل وجود هذا المجال،
    // نحتاج إلى إضافتهم بشكل صريح.
    // راجع شرح الربط الضمني مقابل الربط الصريح أدناه.
    d.add(req);
    d.add(res);

    // قم الآن بتشغيل وظيفة المعالج في المجال.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// هذا الجزء ليس مهما. مجرد مثال على شيء التوجيه.
// ضع منطق التطبيق الفاخر هنا.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // نفعل بعض الأشياء غير المتزامنة، ثم...
      setTimeout(() => {
        // يا إلهي!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## إضافات إلى كائنات `Error` {#additions-to-error-objects}

في كل مرة يتم فيها توجيه كائن `Error` من خلال مجال، تتم إضافة عدد قليل من الحقول الإضافية إليه.

- `error.domain` المجال الذي تعامل مع الخطأ أولاً.
- `error.domainEmitter` باعث الحدث الذي أطلق حدث `'error'` مع كائن الخطأ.
- `error.domainBound` دالة الاستدعاء التي تم ربطها بالمجال، وتم تمرير خطأ كوسيطتها الأولى.
- `error.domainThrown` قيمة منطقية تشير إلى ما إذا كان الخطأ قد تم طرحه أو إصداره أو تمريره إلى دالة استدعاء مرتبطة.

## الربط الضمني {#implicit-binding}

إذا كانت المجالات قيد الاستخدام، فسيتم ربط جميع كائنات `EventEmitter` **الجديدة** (بما في ذلك كائنات Stream والطلبات والاستجابات وما إلى ذلك) ضمنيًا بالمجال النشط في وقت إنشائها.

بالإضافة إلى ذلك، سيتم ربط عمليات الاسترجاع التي تم تمريرها إلى طلبات حلقة الأحداث ذات المستوى المنخفض (مثل `fs.open()` أو طرق أخرى تأخذ استدعاء) تلقائيًا بالمجال النشط. إذا قاموا بالإبلاغ عن خطأ، فسيقوم المجال بالتقاط الخطأ.

من أجل منع الاستخدام المفرط للذاكرة، لا تتم إضافة كائنات `Domain` نفسها ضمنيًا كأطفال للمجال النشط. إذا كانت كذلك، فسيكون من السهل جدًا منع جمع القمامة المناسبة لكائنات الطلب والاستجابة.

لتداخل كائنات `Domain` كأطفال لمجال `Domain` أصلي، يجب إضافتها بشكل صريح.

يوجه الربط الضمني الأخطاء التي تم طرحها وأحداث `'error'` إلى حدث `'error'` الخاص بـ `Domain`، ولكنه لا يسجل `EventEmitter` على `Domain`. يهتم الربط الضمني فقط بالأخطاء التي تم طرحها وأحداث `'error'`.

## الربط الصريح {#explicit-binding}

في بعض الأحيان، لا يكون المجال قيد الاستخدام هو المجال الذي يجب استخدامه لباعث حدث معين. أو، يمكن أن يكون باعث الحدث قد تم إنشاؤه في سياق مجال واحد، ولكن يجب بدلاً من ذلك ربطه بمجال آخر.

على سبيل المثال، يمكن أن يكون هناك مجال واحد قيد الاستخدام لخادم HTTP، ولكن ربما نرغب في الحصول على مجال منفصل لاستخدامه لكل طلب.

هذا ممكن عن طريق الربط الصريح.

```js [ESM]
// قم بإنشاء مجال رفيع المستوى للخادم
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // يتم إنشاء الخادم في نطاق serverDomain
  http.createServer((req, res) => {
    // يتم أيضًا إنشاء Req و res في نطاق serverDomain
    // ومع ذلك، نفضل الحصول على مجال منفصل لكل طلب.
    // قم بإنشائه أول شيء، وأضف req و res إليه.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- الإرجاع: [\<Domain\>](/ar/nodejs/api/domain#class-domain)

## صنف: `Domain` {#class-domain}

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يغلف صنف `Domain` وظائف توجيه الأخطاء والاستثناءات غير المعالجة إلى كائن `Domain` النشط.

للتعامل مع الأخطاء التي يمسك بها، استمع إلى حدث `'error'` الخاص به.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

مصفوفة من المؤقتات وباعثات الأحداث التي تمت إضافتها بشكل صريح إلى المجال.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter) | [\<Timer\>](/ar/nodejs/api/timers#timers) باعث أو مؤقت المراد إضافته إلى المجال

يضيف باعثًا إلى المجال بشكل صريح. إذا ألقى أي معالج أحداث يتم استدعاؤه بواسطة الباعث خطأً، أو إذا أطلق الباعث حدث `'error'`، فسيتم توجيهه إلى حدث `'error'` الخاص بالمجال، تمامًا كما هو الحال مع الربط الضمني.

يعمل هذا أيضًا مع المؤقتات التي يتم إرجاعها من [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args) و [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args). إذا ألقى دالة الاستدعاء الخاصة بهم، فسيتم التقاطها بواسطة معالج `'error'` الخاص بالمجال.

إذا كان المؤقت أو `EventEmitter` مرتبطًا بالفعل بمجال، فسيتم إزالته من ذلك المجال، وربطه بهذا المجال بدلاً من ذلك.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة الاستدعاء
- الإرجاع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المرتبطة

ستكون الدالة التي تم إرجاعها عبارة عن غلاف حول دالة الاستدعاء المقدمة. عند استدعاء الدالة التي تم إرجاعها، سيتم توجيه أي أخطاء يتم إلقاؤها إلى حدث `'error'` الخاص بالمجال.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // If this throws, it will also be passed to the domain.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

### `domain.enter()` {#domainenter}

الطريقة `enter()` هي سباكة تستخدمها الطرق `run()` و `bind()` و `intercept()` لتعيين المجال النشط. تقوم بتعيين `domain.active` و `process.domain` إلى المجال، وتدفع ضمنيًا المجال إلى مكدس المجال الذي تديره وحدة المجال (راجع [`domain.exit()`](/ar/nodejs/api/domain#domainexit) للحصول على تفاصيل حول مكدس المجال). تحدد المكالمة إلى `enter()` بداية سلسلة من المكالمات غير المتزامنة وعمليات الإدخال والإخراج المرتبطة بمجال.

يؤدي استدعاء `enter()` إلى تغيير المجال النشط فقط، ولا يغير المجال نفسه. يمكن استدعاء `enter()` و `exit()` عددًا تعسفيًا من المرات على مجال واحد.

### `domain.exit()` {#domainexit}

تخرج الطريقة `exit()` من المجال الحالي، وتقوم بإخراجها من مكدس المجال. في أي وقت سينتقل فيه التنفيذ إلى سياق سلسلة مختلفة من المكالمات غير المتزامنة، من المهم التأكد من الخروج من المجال الحالي. تحدد المكالمة إلى `exit()` إما نهاية أو انقطاع سلسلة المكالمات غير المتزامنة وعمليات الإدخال والإخراج المرتبطة بمجال.

إذا كانت هناك مجالات متعددة ومتداخلة مرتبطة بسياق التنفيذ الحالي، فستخرج `exit()` من أي مجالات متداخلة داخل هذا المجال.

يؤدي استدعاء `exit()` إلى تغيير المجال النشط فقط، ولا يغير المجال نفسه. يمكن استدعاء `enter()` و `exit()` عددًا تعسفيًا من المرات على مجال واحد.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة الاسترجاع
- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي تم اعتراضها

هذه الطريقة مطابقة تقريبًا لـ [`domain.bind(callback)`](/ar/nodejs/api/domain#domainbindcallback). ومع ذلك، بالإضافة إلى التقاط الأخطاء التي تم طرحها، فإنها ستعترض أيضًا كائنات [`Error`](/ar/nodejs/api/errors#class-error) المرسلة كوسيطة أولى للدالة.

بهذه الطريقة، يمكن استبدال النمط الشائع `if (err) return callback(err);` بمعالج أخطاء واحد في مكان واحد.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Note, the first argument is never passed to the
    // callback since it is assumed to be the 'Error' argument
    // and thus intercepted by the domain.

    // If this throws, it will also be passed to the domain
    // so the error-handling logic can be moved to the 'error'
    // event on the domain instead of being repeated throughout
    // the program.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter) | [\<Timer\>](/ar/nodejs/api/timers#timers) باعث أو مؤقت يتم إزالته من النطاق

عكس [`domain.add(emitter)`](/ar/nodejs/api/domain#domainaddemitter). يزيل معالجة النطاق من باعث محدد.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

قم بتشغيل الوظيفة المقدمة في سياق النطاق، مع ربط جميع باعثات الأحداث والمؤقتات والطلبات منخفضة المستوى التي يتم إنشاؤها في هذا السياق ضمنيًا. اختياريًا، يمكن تمرير الوسيطات إلى الوظيفة.

هذه هي الطريقة الأساسية لاستخدام النطاق.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // محاكاة بعض الأشياء غير المتزامنة المختلفة
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // المتابعة...
      });
    }, 100);
  });
});
```
في هذا المثال، سيتم تشغيل معالج `d.on('error')` بدلاً من تعطل البرنامج.

## النطاقات والوعود {#domains-and-promises}

اعتبارًا من Node.js 8.0.0، يتم تشغيل معالجات الوعود داخل النطاق الذي تم فيه إجراء استدعاء `.then()` أو `.catch()` نفسه:

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // قيد التشغيل في d2
  });
});
```
يمكن ربط معاودة الاتصال بنطاق معين باستخدام [`domain.bind(callback)`](/ar/nodejs/api/domain#domainbindcallback):

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // قيد التشغيل في d1
  }));
});
```
لن تتداخل النطاقات مع آليات معالجة الأخطاء للوعود. بمعنى آخر، لن يتم إرسال حدث `'error'` لرفض `Promise` غير المعالج.

