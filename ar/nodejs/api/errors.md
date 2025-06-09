---
title: توثيق Node.js - الأخطاء
description: يوفر هذا القسم من توثيق Node.js تفاصيل شاملة حول التعامل مع الأخطاء، بما في ذلك فئات الأخطاء، وأكواد الأخطاء، وكيفية التعامل مع الأخطاء في تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الأخطاء | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يوفر هذا القسم من توثيق Node.js تفاصيل شاملة حول التعامل مع الأخطاء، بما في ذلك فئات الأخطاء، وأكواد الأخطاء، وكيفية التعامل مع الأخطاء في تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الأخطاء | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يوفر هذا القسم من توثيق Node.js تفاصيل شاملة حول التعامل مع الأخطاء، بما في ذلك فئات الأخطاء، وأكواد الأخطاء، وكيفية التعامل مع الأخطاء في تطبيقات Node.js.
---


# الأخطاء {#errors}

ستواجه التطبيقات التي تعمل في Node.js عمومًا أربع فئات من الأخطاء:

- أخطاء JavaScript القياسية مثل [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)، [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)، [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)، [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)، [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)، و [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- أخطاء النظام التي تسببها قيود نظام التشغيل الأساسي مثل محاولة فتح ملف غير موجود أو محاولة إرسال بيانات عبر مقبس مغلق.
- أخطاء محددة من قبل المستخدم تسببها شفرة التطبيق.
- `AssertionError` هي فئة خاصة من الأخطاء التي يمكن أن تحدث عندما يكتشف Node.js انتهاكًا منطقيًا استثنائيًا لا ينبغي أن يحدث أبدًا. يتم طرح هذه الأخطاء عادةً بواسطة وحدة `node:assert`.

ترث جميع أخطاء JavaScript وأخطاء النظام التي يثيرها Node.js من فئة JavaScript القياسية [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) أو هي حالات منها، ويضمن توفير *على الأقل* الخصائص المتوفرة في تلك الفئة.

## انتشار الأخطاء واعتراضها {#error-propagation-and-interception}

يدعم Node.js العديد من الآليات لنشر ومعالجة الأخطاء التي تحدث أثناء تشغيل التطبيق. تعتمد طريقة الإبلاغ عن هذه الأخطاء ومعالجتها كليًا على نوع `Error` ونمط واجهة برمجة التطبيقات (API) التي يتم استدعاؤها.

تتم معالجة جميع أخطاء JavaScript كاستثناءات تقوم *على الفور* بإنشاء وطرح خطأ باستخدام آلية `throw` القياسية في JavaScript. تتم معالجتها باستخدام بنية [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) التي توفرها لغة JavaScript.

```js [ESM]
// يطرح خطأ ReferenceError لأن z غير معرف.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // قم بمعالجة الخطأ هنا.
}
```
أي استخدام لآلية `throw` في JavaScript سيثير استثناء *يجب* معالجته أو سينتهي عملية Node.js على الفور.

باستثناءات قليلة، ستستخدم واجهات برمجة التطبيقات *المتزامنة* (أي طريقة حظر لا تُرجع [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ولا تقبل وظيفة `callback`، مثل [`fs.readFileSync`](/ar/nodejs/api/fs#fsreadfilesyncpath-options)) `throw` للإبلاغ عن الأخطاء.

يمكن الإبلاغ عن الأخطاء التي تحدث داخل *واجهات برمجة التطبيقات غير المتزامنة* بعدة طرق:

- تقوم بعض الطرق غير المتزامنة بإرجاع [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)، يجب عليك دائمًا أن تأخذ في الاعتبار أنه قد يتم رفضها. راجع علامة [`--unhandled-rejections`](/ar/nodejs/api/cli#--unhandled-rejectionsmode) لمعرفة كيفية تفاعل العملية مع رفض الوعد الذي لم يتم التعامل معه.
- تقبل معظم الطرق غير المتزامنة التي تقبل وظيفة `callback` كائن `Error` يتم تمريره كوسيطة أولى لتلك الوظيفة. إذا كانت الوسيطة الأولى ليست `null` وكانت نسخة من `Error`، فقد حدث خطأ يجب معالجته.
- عندما يتم استدعاء طريقة غير متزامنة على كائن هو [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter)، يمكن توجيه الأخطاء إلى حدث `'error'` الخاص بهذا الكائن.
- قد تستمر حفنة من الطرق غير المتزامنة عادةً في واجهة برمجة تطبيقات Node.js في استخدام آلية `throw` لإثارة استثناءات يجب معالجتها باستخدام `try…catch`. لا توجد قائمة شاملة بهذه الطرق؛ يرجى الرجوع إلى وثائق كل طريقة لتحديد آلية معالجة الأخطاء المناسبة المطلوبة.

يعتبر استخدام آلية حدث `'error'` هو الأكثر شيوعًا لواجهات برمجة التطبيقات [القائمة على التدفق](/ar/nodejs/api/stream) و [القائمة على باعث الأحداث](/ar/nodejs/api/events#class-eventemitter)، والتي تمثل سلسلة من العمليات غير المتزامنة بمرور الوقت (على عكس عملية واحدة قد تنجح أو تفشل).

بالنسبة *لجميع* كائنات [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter)، إذا لم يتم توفير معالج حدث `'error'`، فسيتم طرح الخطأ، مما يتسبب في إبلاغ عملية Node.js عن استثناء غير معالج وتعطله ما لم يكن: تم تسجيل معالج لحدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception)، أو يتم استخدام وحدة [`node:domain`](/ar/nodejs/api/domain) المهملة.

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // سيؤدي هذا إلى تعطيل العملية لأنه لم تتم إضافة معالج حدث 'error'.
  ee.emit('error', new Error('سيؤدي هذا إلى التعطيل'));
});
```
*لا يمكن* اعتراض الأخطاء التي تم إنشاؤها بهذه الطريقة باستخدام `try…catch` لأنها تُطرح *بعد* خروج الشفرة المستدعية بالفعل.

يجب على المطورين الرجوع إلى وثائق كل طريقة لتحديد كيفية نشر الأخطاء التي تثيرها تلك الطرق بالضبط.


## الصنف: `Error` {#class-error}

كائن JavaScript عام [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) لا يدل على أي ظرف محدد لسبب وقوع الخطأ. تحتفظ كائنات `Error` بـ "تتبع المكدس" الذي يفصل النقطة في الكود التي تم فيها إنشاء `Error`، وقد يوفر وصفًا نصيًا للخطأ.

جميع الأخطاء التي تم إنشاؤها بواسطة Node.js، بما في ذلك جميع أخطاء النظام و JavaScript، ستكون إما مثيلات من الصنف `Error` أو ترث منه.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) الخطأ الذي تسبب في الخطأ الذي تم إنشاؤه حديثًا.

ينشئ كائن `Error` جديدًا ويضبط الخاصية `error.message` على الرسالة النصية المقدمة. إذا تم تمرير كائن كـ `message`، فسيتم إنشاء الرسالة النصية عن طريق استدعاء `String(message)`. إذا تم توفير الخيار `cause`، فسيتم تعيينه للخاصية `error.cause`. ستمثل الخاصية `error.stack` النقطة في الكود التي تم فيها استدعاء `new Error()`. تعتمد تتبعات المكدس على [واجهة برمجة تطبيقات تتبع المكدس V8](https://v8.dev/docs/stack-trace-api). تمتد تتبعات المكدس فقط إلى (أ) بداية *تنفيذ الكود المتزامن*، أو (ب) عدد الإطارات المحدد بواسطة الخاصية `Error.stackTraceLimit`، أيهما أصغر.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

ينشئ خاصية `.stack` على `targetObject`، والتي عند الوصول إليها تُرجع سلسلة تمثل الموقع في الكود الذي تم فيه استدعاء `Error.captureStackTrace()`.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // مشابه لـ `new Error().stack`
```
سيتم تذييل السطر الأول من التتبع بـ`${myObject.name}: ${myObject.message}`.

تقبل الوسيطة `constructorOpt` الاختيارية دالة. إذا تم تقديمها، فسيتم حذف جميع الإطارات الموجودة فوق `constructorOpt`، بما في ذلك `constructorOpt`، من تتبع المكدس الذي تم إنشاؤه.

تعتبر الوسيطة `constructorOpt` مفيدة لإخفاء تفاصيل التنفيذ لإنشاء الأخطاء من المستخدم. على سبيل المثال:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // قم بإنشاء خطأ بدون تتبع المكدس لتجنب حساب تتبع المكدس مرتين.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // التقاط تتبع المكدس فوق الدالة b
  Error.captureStackTrace(error, b); // لا يتم تضمين الدالة c ولا b في تتبع المكدس
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تحدد الخاصية `Error.stackTraceLimit` عدد إطارات التتبع التي يتم جمعها بواسطة تتبع المكدس (سواء تم إنشاؤها بواسطة `new Error().stack` أو `Error.captureStackTrace(obj)`).

القيمة الافتراضية هي `10` ولكن يمكن تعيينها على أي رقم JavaScript صالح. ستؤثر التغييرات على أي تتبع مكدس يتم التقاطه *بعد* تغيير القيمة.

إذا تم تعيينها على قيمة غير رقمية، أو تم تعيينها على رقم سالب، فلن تلتقط آثار المكدس أي إطارات.

### `error.cause` {#errorcause}

**تمت إضافته في: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

إذا كانت موجودة، فإن الخاصية `error.cause` هي السبب الكامن وراء `Error`. يتم استخدامه عند التقاط خطأ ورمي خطأ جديد برسالة أو رمز مختلف من أجل الاستمرار في الوصول إلى الخطأ الأصلي.

عادةً ما يتم تعيين الخاصية `error.cause` عن طريق استدعاء `new Error(message, { cause })`. لا يتم تعيينه بواسطة الدالة الإنشائية إذا لم يتم توفير خيار `cause`.

تسمح هذه الخاصية بسلسلة الأخطاء. عند تسلسل كائنات `Error`، يقوم [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) بتسلسل `error.cause` بشكل متكرر إذا تم تعيينه.

```js [ESM]
const cause = new Error('استجاب خادم HTTP البعيد بحالة 500');
const symptom = new Error('فشل إرسال الرسالة', { cause });

console.log(symptom);
// يطبع:
//   Error: فشل إرسال الرسالة
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 أسطر تطابق تتبع مكدس السبب ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: استجاب خادم HTTP البعيد بحالة 500
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

خاصية `error.code` هي تسمية نصية تحدد نوع الخطأ. تُعد `error.code` الطريقة الأكثر استقرارًا لتحديد الخطأ. ستتغير فقط بين الإصدارات الرئيسية من Node.js. على النقيض من ذلك، قد تتغير سلاسل `error.message` بين أي إصدارات من Node.js. راجع [رموز خطأ Node.js](/ar/nodejs/api/errors#nodejs-error-codes) للحصول على تفاصيل حول رموز معينة.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

خاصية `error.message` هي الوصف النصي للخطأ كما تم تعيينه عن طريق استدعاء `new Error(message)`. ستظهر `message` التي تم تمريرها إلى الدالة الإنشائية أيضًا في السطر الأول من تتبع مكدس `Error`، ومع ذلك، قد لا يؤدي تغيير هذه الخاصية بعد إنشاء كائن `Error` إلى تغيير السطر الأول من تتبع المكدس (على سبيل المثال، عندما تتم قراءة `error.stack` قبل تغيير هذه الخاصية).

```js [ESM]
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

خاصية `error.stack` هي سلسلة تصف النقطة في التعليمات البرمجية التي تم فيها إنشاء `Error`.

```bash [BASH]
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
يتم تنسيق السطر الأول كـ `\<error class name\>: \<error message\>`، ويتبعه سلسلة من إطارات المكدس (يبدأ كل سطر بـ "at "). يصف كل إطار موقع استدعاء داخل التعليمات البرمجية أدى إلى إنشاء الخطأ. تحاول V8 عرض اسم لكل دالة (عن طريق اسم المتغير أو اسم الدالة أو اسم طريقة الكائن)، ولكن في بعض الأحيان لن تتمكن من العثور على اسم مناسب. إذا تعذر على V8 تحديد اسم للدالة، فسيتم عرض معلومات الموقع فقط لهذا الإطار. بخلاف ذلك، سيتم عرض اسم الدالة المحدد مع معلومات الموقع الملحقة بين قوسين.

يتم إنشاء الإطارات فقط لوظائف JavaScript. على سبيل المثال، إذا مر التنفيذ بشكل متزامن عبر وظيفة C++ إضافية تسمى `cheetahify` والتي بدورها تستدعي وظيفة JavaScript، فلن يكون الإطار الذي يمثل استدعاء `cheetahify` موجودًا في تتبعات المكدس:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
ستكون معلومات الموقع واحدة مما يلي:

- `native`، إذا كان الإطار يمثل استدعاءً داخليًا لـ V8 (كما في `[].forEach`).
- `plain-filename.js:line:column`، إذا كان الإطار يمثل استدعاءً داخليًا لـ Node.js.
- `/absolute/path/to/file.js:line:column`، إذا كان الإطار يمثل استدعاءً في برنامج مستخدم (باستخدام نظام وحدة CommonJS)، أو تبعياته.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`، إذا كان الإطار يمثل استدعاءً في برنامج مستخدم (باستخدام نظام وحدة ES)، أو تبعياته.

يتم إنشاء السلسلة التي تمثل تتبع المكدس ببطء عند **الوصول** إلى خاصية `error.stack`.

يتم تحديد عدد الإطارات التي يتم التقاطها بواسطة تتبع المكدس بالأصغر من `Error.stackTraceLimit` أو عدد الإطارات المتاحة في تكتكة حلقة الأحداث الحالية.


## الفئة: `AssertionError` {#class-assertionerror}

- يمتد: [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

يشير إلى فشل التأكيد. لمزيد من التفاصيل، راجع [`الفئة: assert.AssertionError`](/ar/nodejs/api/assert#class-assertassertionerror).

## الفئة: `RangeError` {#class-rangeerror}

- يمتد: [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

يشير إلى أن وسيطة مقدمة لم تكن ضمن المجموعة أو النطاق للقيم المقبولة لدالة ما؛ سواء كان ذلك نطاقًا رقميًا، أو خارج مجموعة الخيارات لمعامل دالة معينة.

```js [ESM]
require('node:net').connect(-1);
// يطرح "RangeError: يجب أن يكون خيار "port" >= 0 و < 65536: -1"
```
ستقوم Node.js بإنشاء وطرح مثيلات `RangeError` *على الفور* كشكل من أشكال التحقق من صحة الوسيطة.

## الفئة: `ReferenceError` {#class-referenceerror}

- يمتد: [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

يشير إلى محاولة الوصول إلى متغير غير معرف. تشير هذه الأخطاء عادةً إلى وجود أخطاء إملائية في التعليمات البرمجية، أو برنامج معطل بخلاف ذلك.

في حين أن رمز العميل قد يقوم بإنشاء ونشر هذه الأخطاء، إلا أن V8 فقط هو الذي سيفعل ذلك عمليًا.

```js [ESM]
doesNotExist;
// يطرح ReferenceError، doesNotExist ليس متغيرًا في هذا البرنامج.
```
ما لم يكن التطبيق يقوم بإنشاء وتشغيل التعليمات البرمجية ديناميكيًا، فإن مثيلات `ReferenceError` تشير إلى وجود خطأ في التعليمات البرمجية أو تبعياتها.

## الفئة: `SyntaxError` {#class-syntaxerror}

- يمتد: [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

يشير إلى أن البرنامج ليس JavaScript صالحًا. لا يجوز إنشاء هذه الأخطاء ونشرها إلا كنتيجة لتقييم التعليمات البرمجية. قد يحدث تقييم التعليمات البرمجية نتيجة لـ `eval` أو `Function` أو `require` أو [vm](/ar/nodejs/api/vm). تشير هذه الأخطاء دائمًا تقريبًا إلى برنامج معطل.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // سيكون 'err' هو SyntaxError.
}
```
مثيلات `SyntaxError` غير قابلة للاسترداد في السياق الذي أنشأها - لا يمكن التقاطها إلا بواسطة سياقات أخرى.

## الفئة: `SystemError` {#class-systemerror}

- يمتد: [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

تنشئ Node.js أخطاء النظام عند حدوث استثناءات داخل بيئة وقت التشغيل الخاصة بها. تحدث هذه عادةً عندما ينتهك تطبيق قيود نظام التشغيل. على سبيل المثال، سيحدث خطأ في النظام إذا حاول تطبيق قراءة ملف غير موجود.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كان موجودًا، فالعنوان الذي فشل فيه اتصال الشبكة
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رمز خطأ السلسلة
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كان موجودًا، فمسار ملف الوجهة عند الإبلاغ عن خطأ في نظام الملفات
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم الخطأ المقدم من النظام
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إذا كان موجودًا، تفاصيل إضافية حول حالة الخطأ
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) وصف مقروء بواسطة الإنسان للخطأ مقدم من النظام
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كان موجودًا، فمسار الملف عند الإبلاغ عن خطأ في نظام الملفات
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا كان موجودًا، منفذ اتصال الشبكة غير المتاح
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم استدعاء النظام الذي أثار الخطأ


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا كانت موجودة، فإن `error.address` عبارة عن سلسلة تصف العنوان الذي فشل اتصال الشبكة به.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الخاصية `error.code` عبارة عن سلسلة تمثل رمز الخطأ.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا كانت موجودة، فإن `error.dest` هو مسار الوجهة للملف عند الإبلاغ عن خطأ في نظام الملفات.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الخاصية `error.errno` هي رقم سالب يتوافق مع رمز الخطأ المحدد في [`libuv Error handling`](https://docs.libuv.org/en/v1.x/errors).

في نظام التشغيل Windows، سيتم تطبيع رقم الخطأ المقدم من قبل النظام بواسطة libuv.

للحصول على التمثيل النصي لرمز الخطأ، استخدم [`util.getSystemErrorName(error.errno)`](/ar/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إذا كانت موجودة، فإن `error.info` عبارة عن كائن يحتوي على تفاصيل حول حالة الخطأ.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` هو وصف مقدم من النظام يمكن للبشر قراءته للخطأ.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا كانت موجودة، فإن `error.path` عبارة عن سلسلة تحتوي على اسم مسار غير صالح ذي صلة.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إذا كانت موجودة، فإن `error.port` هو منفذ اتصال الشبكة غير المتاح.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

الخاصية `error.syscall` عبارة عن سلسلة تصف [استدعاء النظام](https://man7.org/linux/man-pages/man2/syscalls.2) الذي فشل.


### أخطاء النظام الشائعة {#common-system-errors}

هذه قائمة بأخطاء النظام الشائعة التي تواجهها عند كتابة برنامج Node.js. للحصول على قائمة شاملة، راجع [`errno`(3) man page](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (مرفوض الوصول): تمت محاولة الوصول إلى ملف بطريقة محظورة بموجب أذونات الوصول إلى الملف.
-  `EADDRINUSE` (العنوان قيد الاستخدام بالفعل): فشلت محاولة ربط خادم ([`net`](/ar/nodejs/api/net)، [`http`](/ar/nodejs/api/http)، أو [`https`](/ar/nodejs/api/https)) بعنوان محلي بسبب وجود خادم آخر على النظام المحلي يشغل هذا العنوان بالفعل.
-  `ECONNREFUSED` (تم رفض الاتصال): تعذر إجراء أي اتصال لأن الجهاز الهدف رفضه بنشاط. ينتج هذا عادةً عن محاولة الاتصال بخدمة غير نشطة على المضيف الأجنبي.
-  `ECONNRESET` (تمت إعادة تعيين الاتصال من قبل النظير): تم إغلاق الاتصال قسرًا بواسطة نظير. ينتج هذا عادةً عن فقدان الاتصال على المقبس البعيد بسبب انتهاء المهلة أو إعادة التشغيل. يشيع مواجهته عبر وحدات [`http`](/ar/nodejs/api/http) و [`net`](/ar/nodejs/api/net).
-  `EEXIST` (الملف موجود): كان ملف موجود هو هدف عملية تتطلب عدم وجود الهدف.
-  `EISDIR` (هو دليل): توقعت عملية ملفًا، ولكن كان المسار المحدد عبارة عن دليل.
-  `EMFILE` (عدد كبير جدًا من الملفات المفتوحة في النظام): تم الوصول إلى الحد الأقصى لعدد [واصفات الملفات](https://en.wikipedia.org/wiki/File_descriptor) المسموح به في النظام، ولا يمكن تلبية طلبات واصف آخر حتى يتم إغلاق واحد على الأقل. تتم مواجهة هذا عند فتح العديد من الملفات في وقت واحد بالتوازي، خاصة على الأنظمة (على وجه الخصوص، macOS) حيث يوجد حد منخفض لواصف الملفات للعمليات. لعلاج الحد المنخفض، قم بتشغيل `ulimit -n 2048` في نفس shell الذي سيشغل عملية Node.js.
-  `ENOENT` (لا يوجد مثل هذا الملف أو الدليل): يتم رفعه بشكل شائع بواسطة عمليات [`fs`](/ar/nodejs/api/fs) للإشارة إلى أن أحد مكونات المسار المحدد غير موجود. لم يتم العثور على أي كيان (ملف أو دليل) بالمسار المحدد.
-  `ENOTDIR` (ليس دليلًا): كان أحد مكونات المسار المحدد موجودًا، ولكنه لم يكن دليلًا كما هو متوقع. يتم رفعه بشكل شائع بواسطة [`fs.readdir`](/ar/nodejs/api/fs#fsreaddirpath-options-callback).
-  `ENOTEMPTY` (الدليل غير فارغ): كان الدليل الذي يحتوي على إدخالات هو هدف عملية تتطلب دليلًا فارغًا، عادةً [`fs.unlink`](/ar/nodejs/api/fs#fsunlinkpath-callback).
-  `ENOTFOUND` (فشل البحث عن DNS): يشير إلى فشل DNS إما `EAI_NODATA` أو `EAI_NONAME`. هذا ليس خطأ POSIX قياسي.
-  `EPERM` (العملية غير مسموح بها): تمت محاولة إجراء عملية تتطلب امتيازات عالية.
-  `EPIPE` (أنبوب مكسور): كتابة على أنبوب أو مقبس أو FIFO لا يوجد عملية لقراءة البيانات لها. يشيع مواجهته في طبقات [`net`](/ar/nodejs/api/net) و [`http`](/ar/nodejs/api/http)، مما يشير إلى أن الجانب البعيد من الدفق الذي يتم الكتابة إليه قد تم إغلاقه.
-  `ETIMEDOUT` (انتهت مهلة العملية): فشل طلب اتصال أو إرسال لأن الطرف المتصل لم يستجب بشكل صحيح بعد فترة من الزمن. عادة ما يتم مواجهته بواسطة [`http`](/ar/nodejs/api/http) أو [`net`](/ar/nodejs/api/net). غالبًا ما يكون علامة على عدم استدعاء `socket.end()` بشكل صحيح.


## الصنف: `TypeError` {#class-typeerror}

- يمتد من [\<errors.Error\>](/ar/nodejs/api/errors#class-error)

يشير إلى أن الوسيطة المقدمة ليست نوعًا مسموحًا به. على سبيل المثال، تمرير دالة إلى معلمة تتوقع سلسلة سيكون `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// يطرح TypeError، لأنه توقع سلسلة.
```
سيقوم Node.js بإنشاء وطرح مثيلات `TypeError` *على الفور* كشكل من أشكال التحقق من صحة الوسيطة.

## الاستثناءات مقابل الأخطاء {#exceptions-vs-errors}

الاستثناء في JavaScript هو قيمة يتم طرحها نتيجة لعملية غير صالحة أو كهدف لعبارة `throw`. على الرغم من أنه ليس مطلوبًا أن تكون هذه القيم مثيلات لـ `Error` أو فئات ترث من `Error`، إلا أن جميع الاستثناءات التي يتم طرحها بواسطة Node.js أو وقت تشغيل JavaScript *ستكون* مثيلات لـ `Error`.

بعض الاستثناءات *غير قابلة للاسترداد* في طبقة JavaScript. ستتسبب هذه الاستثناءات *دائمًا* في تعطل عملية Node.js. تتضمن الأمثلة فحوصات `assert()` أو استدعاءات `abort()` في طبقة C++.

## أخطاء OpenSSL {#openssl-errors}

الأخطاء التي تنشأ في `crypto` أو `tls` هي من الفئة `Error`، بالإضافة إلى خصائص `.code` و `.message` القياسية، قد تحتوي على بعض الخصائص الإضافية الخاصة بـ OpenSSL.

### `error.opensslErrorStack` {#erroropensslerrorstack}

مجموعة من الأخطاء التي يمكن أن تعطي سياقًا لمكان نشأة الخطأ في مكتبة OpenSSL.

### `error.function` {#errorfunction}

دالة OpenSSL التي نشأ فيها الخطأ.

### `error.library` {#errorlibrary}

مكتبة OpenSSL التي نشأ فيها الخطأ.

### `error.reason` {#errorreason}

سلسلة قابلة للقراءة بواسطة الإنسان تصف سبب الخطأ.

## رموز خطأ Node.js {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**تمت إضافته في: v15.0.0**

يستخدم عندما يتم إحباط عملية (عادةً باستخدام `AbortController`).

واجهات برمجة التطبيقات التي *لا* تستخدم `AbortSignal` عادةً لا تثير خطأ بهذا الرمز.

لا يستخدم هذا الرمز اصطلاح `ERR_*` المنتظم الذي تستخدمه أخطاء Node.js ليكون متوافقًا مع `AbortError` الخاص بمنصة الويب.

### `ERR_ACCESS_DENIED` {#err_access_denied}

نوع خاص من الأخطاء يتم تشغيله عندما يحاول Node.js الوصول إلى مورد مقيد بواسطة [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model).


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

يتم استخدام وسيطة دالة بطريقة تشير إلى أن توقيع الدالة قد يكون غير مفهوم. يتم إطلاق هذا الخطأ بواسطة وحدة `node:assert` عندما تتطابق معلمة `message` في `assert.throws(block, message)` مع رسالة الخطأ التي تم إطلاقها بواسطة `block` لأن هذا الاستخدام يشير إلى أن المستخدم يعتقد أن `message` هي الرسالة المتوقعة بدلاً من الرسالة التي ستعرضها `AssertionError` إذا لم يطلق `block` أي خطأ.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

مطلوب وسيطة قابلة للتكرار (مثل قيمة تعمل مع حلقات `for...of`)، ولكن لم يتم توفيرها لواجهة برمجة تطبيقات Node.js.

### `ERR_ASSERTION` {#err_assertion}

نوع خاص من الأخطاء يمكن تشغيله متى اكتشف Node.js انتهاكًا منطقيًا استثنائيًا لا ينبغي أن يحدث أبدًا. يتم رفع هذه الأخطاء عادةً بواسطة وحدة `node:assert`.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

تمت محاولة تسجيل شيء ليس دالة كـ `AsyncHooks` callback.

### `ERR_ASYNC_TYPE` {#err_async_type}

كان نوع مورد غير متزامن غير صالح. يمكن للمستخدمين أيضًا تحديد أنواعهم الخاصة إذا كانوا يستخدمون واجهة برمجة تطبيقات التضمين العامة.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

لم يتم ضغط البيانات التي تم تمريرها إلى دفق Brotli بنجاح.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

تم تمرير مفتاح معلمة غير صالح أثناء إنشاء دفق Brotli.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

تمت محاولة إنشاء مثيل `Buffer` من Node.js من كود الإضافة أو التضمين، أثناء وجوده في سياق محرك JS غير مرتبط بمثيل Node.js. سيتم تحرير البيانات التي تم تمريرها إلى طريقة `Buffer` بحلول وقت إرجاع الطريقة.

عند مواجهة هذا الخطأ، البديل المحتمل لإنشاء مثيل `Buffer` هو إنشاء `Uint8Array` عادي، والذي يختلف فقط في النموذج الأولي للكائن الناتج. يتم قبول `Uint8Array`s عمومًا في جميع واجهات برمجة تطبيقات Node.js الأساسية حيث توجد `Buffer`s؛ وهي متوفرة في جميع السياقات.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

تمت محاولة إجراء عملية خارج حدود `Buffer`.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

تمت محاولة إنشاء `Buffer` أكبر من الحجم الأقصى المسموح به.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

تعذر على Node.js مراقبة إشارة `SIGINT`.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

تم إغلاق عملية فرعية قبل أن يتلقى الأصل ردًا.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

يستخدم عند تفرع عملية فرعية دون تحديد قناة IPC.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

يستخدم عندما تحاول العملية الرئيسية قراءة بيانات من STDERR/STDOUT للعملية الفرعية، وكان طول البيانات أطول من خيار `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.2.0، الإصدار 14.17.1 | تمت إعادة تقديم رسالة الخطأ. |
| الإصدار 11.12.0 | تمت إزالة رسالة الخطأ. |
| الإصدار 10.5.0 | تمت إضافته في: الإصدار 10.5.0 |
:::

كانت هناك محاولة لاستخدام مثيل `MessagePort` في حالة مغلقة، عادة بعد استدعاء `.close()`.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

تم إنشاء `Console` بدون دفق `stdout`، أو أن `Console` لديه دفق `stdout` أو `stderr` غير قابل للكتابة.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**تمت الإضافة في: الإصدار 12.5.0**

تم استدعاء مُنشئ فئة غير قابل للاستدعاء.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

تم استدعاء مُنشئ لفئة بدون `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

لم تتم تهيئة سياق vm الذي تم تمريره إلى واجهة برمجة التطبيقات بعد. يمكن أن يحدث هذا عند حدوث خطأ (ويتم التقاطه) أثناء إنشاء السياق، على سبيل المثال، عندما يفشل التخصيص أو يتم الوصول إلى الحد الأقصى لحجم مكدس الاستدعاءات عند إنشاء السياق.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

تم طلب محرك OpenSSL (على سبيل المثال، من خلال خيارات TLS `clientCertEngine` أو `privateKeyEngine`) غير مدعوم من قبل إصدار OpenSSL المستخدم، على الأرجح بسبب علامة وقت التحويل البرمجي `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

تم تمرير قيمة غير صالحة للوسيطة `format` إلى طريقة `getPublicKey()` لفئة `crypto.ECDH()`.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

تم تمرير قيمة غير صالحة للوسيطة `key` إلى طريقة `computeSecret()` لفئة `crypto.ECDH()`. هذا يعني أن المفتاح العام يقع خارج المنحنى الإهليلجي.


### ‏`ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

تم تمرير مُعرّف مُحرّك تشفير غير صالح إلى [`require('node:crypto').setEngine()`](/ar/nodejs/api/crypto#cryptosetengineengine-flags).

### ‏`ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

تم استخدام وسيط سطر الأوامر [`--force-fips`](/ar/nodejs/api/cli#--force-fips) ولكن كانت هناك محاولة لتمكين أو تعطيل وضع FIPS في وحدة `node:crypto`.

### ‏`ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

تمت محاولة لتمكين أو تعطيل وضع FIPS، ولكن وضع FIPS لم يكن متاحًا.

### ‏`ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

تم استدعاء [`hash.digest()`](/ar/nodejs/api/crypto#hashdigestencoding) عدة مرات. يجب استدعاء طريقة `hash.digest()` مرة واحدة على الأكثر لكل مثيل لكائن `Hash`.

### ‏`ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

فشل [`hash.update()`](/ar/nodejs/api/crypto#hashupdatedata-inputencoding) لأي سبب من الأسباب. نادرًا ما يحدث هذا، إن حدث على الإطلاق.

### ‏`ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

مفاتيح التشفير المحددة غير متوافقة مع العملية التي تتم محاولتها.

### ‏`ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

ترميز المفتاح العام أو الخاص المحدد غير متوافق مع خيارات أخرى.

### ‏`ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**تمت إضافتها في: v15.0.0**

فشل تهيئة نظام التشفير الفرعي.

### ‏`ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**تمت إضافتها في: v15.0.0**

تم توفير علامة مصادقة غير صالحة.

### ‏`ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**تمت إضافتها في: v15.0.0**

تم توفير عداد غير صالح لشفرة في وضع العداد.

### ‏`ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**تمت إضافتها في: v15.0.0**

تم توفير منحنى إهليلجي غير صالح.

### ‏`ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

تم تحديد [خوارزمية تلخيص تشفير](/ar/nodejs/api/crypto#cryptogethashes) غير صالحة.

### ‏`ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**تمت إضافتها في: v15.0.0**

تم توفير متجه تهيئة غير صالح.

### ‏`ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**تمت إضافتها في: v15.0.0**

تم توفير مفتاح ويب JSON غير صالح.

### ‏`ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**تمت إضافتها في: v15.0.0**

تم توفير طول مفتاح غير صالح.

### ‏`ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**تمت إضافتها في: v15.0.0**

تم توفير زوج مفاتيح غير صالح.

### ‏`ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**تمت إضافتها في: v15.0.0**

تم توفير نوع مفتاح غير صالح.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

نوع كائن مفتاح التشفير المعطى غير صالح للعملية التي تتم محاولتها.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**إضافة في: الإصدار v15.0.0**

تم توفير طول رسالة غير صالح.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**إضافة في: الإصدار v15.0.0**

واحد أو أكثر من معاملات [`crypto.scrypt()`](/ar/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) أو [`crypto.scryptSync()`](/ar/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) تقع خارج نطاقها القانوني.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

تم استخدام طريقة تشفير على كائن في حالة غير صالحة. على سبيل المثال، استدعاء [`cipher.getAuthTag()`](/ar/nodejs/api/crypto#ciphergetauthtag) قبل استدعاء `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**إضافة في: الإصدار v15.0.0**

تم توفير طول علامة مصادقة غير صالح.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**إضافة في: الإصدار v15.0.0**

فشل تهيئة عملية تشفير غير متزامنة.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

منحنى إهليلجي للمفتاح غير مسجل للاستخدام في [سجل منحنى إهليلجي لمفتاح الويب JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

نوع المفتاح غير المتماثل للمفتاح غير مسجل للاستخدام في [سجل أنواع مفاتيح الويب JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**إضافة في: الإصدار v15.0.0**

فشلت عملية تشفير لسبب غير محدد بخلاف ذلك.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

فشلت خوارزمية PBKDF2 لأسباب غير محددة. لا يوفر OpenSSL المزيد من التفاصيل، وبالتالي لا يوفر Node.js أيضًا.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

تم تجميع Node.js بدون دعم `scrypt`. هذا غير ممكن مع الإصدارات الثنائية الرسمية ولكن يمكن أن يحدث مع الإصدارات المخصصة، بما في ذلك إصدارات التوزيع.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

لم يتم توفير `key` توقيع لطريقة [`sign.sign()`](/ar/nodejs/api/crypto#signsignprivatekey-outputencoding).

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

تم استدعاء [`crypto.timingSafeEqual()`](/ar/nodejs/api/crypto#cryptotimingsafeequala-b) مع وسيطات `Buffer` أو `TypedArray` أو `DataView` بأطوال مختلفة.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

تم تحديد شيفرة غير معروفة.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

تم إعطاء اسم مجموعة Diffie-Hellman غير معروفة. انظر [`crypto.getDiffieHellman()`](/ar/nodejs/api/crypto#cryptogetdiffiehellmangroupname) للحصول على قائمة بأسماء المجموعات الصالحة.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**تمت إضافته في:** v15.0.0، v14.18.0

تمت محاولة استدعاء عملية تشفير غير مدعومة.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**تمت إضافته في:** v16.4.0، v14.17.4

حدث خطأ في [مصحح الأخطاء](/ar/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**تمت إضافته في:** v16.4.0، v14.17.4

انتهت مهلة [مصحح الأخطاء](/ar/nodejs/api/debugger) في انتظار تحرير المضيف/المنفذ المطلوب.

### `ERR_DIR_CLOSED` {#err_dir_closed}

تم إغلاق [`fs.Dir`](/ar/nodejs/api/fs#class-fsdir) مسبقًا.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**تمت إضافته في:** v14.3.0

تمت محاولة إجراء قراءة متزامنة أو استدعاء إغلاق على [`fs.Dir`](/ar/nodejs/api/fs#class-fsdir) لديها عمليات غير متزامنة مستمرة.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**تمت إضافته في:** v16.10.0، v14.19.0

تم تعطيل تحميل الوظائف الإضافية الأصلية باستخدام [`--no-addons`](/ar/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**تمت إضافته في:** v15.0.0

فشل استدعاء `process.dlopen()`.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

فشل `c-ares` في تعيين خادم DNS.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

وحدة `node:domain` غير قابلة للاستخدام لأنها لم تتمكن من إنشاء خطافات معالجة الأخطاء المطلوبة، لأن [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) تم استدعاؤها في وقت سابق.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

لا يمكن استدعاء [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) لأن وحدة `node:domain` تم تحميلها في وقت سابق.

يتم تمديد تتبع المكدس ليشمل النقطة الزمنية التي تم فيها تحميل وحدة `node:domain`.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

لا يمكن استدعاء [`v8.startupSnapshot.setDeserializeMainFunction()`](/ar/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) لأنه تم استدعاؤها بالفعل من قبل.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

البيانات المقدمة إلى واجهة برمجة التطبيقات `TextDecoder()` كانت غير صالحة وفقًا للترميز المقدم.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

الترميز المقدم إلى واجهة برمجة التطبيقات `TextDecoder()` لم يكن واحدًا من [الترميزات المدعومة من WHATWG](/ar/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

لا يمكن استخدام `--print` مع إدخال ESM.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

يتم طرحه عند محاولة إرسال حدث بشكل متكرر على `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

سياق تنفيذ JS غير مرتبط ببيئة Node.js. قد يحدث هذا عندما يتم استخدام Node.js كمكتبة مضمنة ولم يتم إعداد بعض الخطافات لمحرك JS بشكل صحيح.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

تم رفض `Promise` تم استدعاؤه عبر `util.callbackify()` بقيمة خاطئة.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**تمت إضافته في: v14.0.0**

يُستخدم عندما يتم استخدام ميزة غير متوفرة للنظام الأساسي الحالي الذي يقوم بتشغيل Node.js.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**تمت إضافته في: v16.7.0**

تمت محاولة نسخ دليل إلى غير دليل (ملف، رابط رمزي، إلخ) باستخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**تمت إضافته في: v16.7.0**

تمت محاولة النسخ فوق ملف موجود بالفعل باستخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback)، مع تعيين `force` و `errorOnExist` على `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**تمت إضافته في: v16.7.0**

عند استخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback)، أشار `src` أو `dest` إلى مسار غير صالح.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**تمت إضافته في: v16.7.0**

تمت محاولة نسخ أنبوب مسمى باستخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**تمت إضافته في: v16.7.0**

تمت محاولة نسخ غير دليل (ملف، رابط رمزي، إلخ) إلى دليل باستخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**تمت إضافته في: v16.7.0**

تمت محاولة النسخ إلى مقبس باستخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback).


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**أضيف في: v16.7.0**

عند استخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback)، كان الرابط الرمزي في `dest` يشير إلى دليل فرعي من `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**أضيف في: v16.7.0**

تمت محاولة النسخ إلى نوع ملف غير معروف باستخدام [`fs.cp()`](/ar/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

المسار هو دليل.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

تمت محاولة قراءة ملف حجمه أكبر من الحجم الأقصى المسموح به لـ `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

تتطلب إطارات HTTP/2 ALTSVC أصلًا صالحًا.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

تقتصر إطارات HTTP/2 ALTSVC على 16382 بايت كحد أقصى للحمولة.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

بالنسبة لطلبات HTTP/2 التي تستخدم طريقة `CONNECT`، فإن الرأس الزائف `:authority` مطلوب.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

بالنسبة لطلبات HTTP/2 التي تستخدم طريقة `CONNECT`، يُمنع استخدام الرأس الزائف `:path`.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

بالنسبة لطلبات HTTP/2 التي تستخدم طريقة `CONNECT`، يُمنع استخدام الرأس الزائف `:scheme`.

### `ERR_HTTP2_ERROR` {#err_http2_error}

حدث خطأ HTTP/2 غير محدد.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

لا يجوز فتح تدفقات HTTP/2 جديدة بعد أن يستقبل `Http2Session` إطار `GOAWAY` من النظير المتصل.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

تم تحديد رؤوس إضافية بعد بدء استجابة HTTP/2.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

تمت محاولة إرسال رؤوس استجابة متعددة.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

تم توفير قيم متعددة لحقل رأس HTTP/2 كان مطلوبًا أن يحتوي على قيمة واحدة فقط.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

لا يجوز تعيين رموز حالة HTTP الإعلامية (`1xx`) كرمز حالة الاستجابة على استجابات HTTP/2.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

يُمنع استخدام رؤوس معينة لاتصال HTTP/1 في طلبات واستجابات HTTP/2.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

تم تحديد قيمة رأس HTTP/2 غير صالحة.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

تم تحديد رمز حالة معلومات HTTP غير صالح. يجب أن تكون رموز حالة المعلومات عددًا صحيحًا بين `100` و `199` (شامل).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

تتطلب إطارات HTTP/2 `ORIGIN` أصلًا صالحًا.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

يجب أن يكون طول مثيلات `Buffer` و `Uint8Array` التي تم تمريرها إلى واجهة برمجة التطبيقات `http2.getUnpackedSettings()` مضاعفًا للرقم ستة.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

يُسمح فقط باستخدام رؤوس HTTP/2 الزائفة الصالحة (`:status` و `:path` و `:authority` و `:scheme` و `:method`).

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

تم تنفيذ إجراء على كائن `Http2Session` تم تدميره بالفعل.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

تم تحديد قيمة غير صالحة لإعداد HTTP/2.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

تم تنفيذ عملية على دفق تم تدميره بالفعل.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

عندما يتم إرسال إطار `SETTINGS` لـ HTTP/2 إلى نظير متصل، يُطلب من النظير إرسال إقرار بأنه قد استلم وطبق `SETTINGS` الجديدة. بشكل افتراضي، يمكن إرسال عدد أقصى من إطارات `SETTINGS` غير المقر بها في أي وقت معين. يُستخدم رمز الخطأ هذا عند الوصول إلى هذا الحد.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

تمت محاولة بدء دفق دفع جديد من داخل دفق دفع. لا يُسمح بدفقات الدفع المتداخلة.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

نفاد الذاكرة عند استخدام واجهة برمجة التطبيقات `http2session.setLocalWindowSize(windowSize)`.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

تمت محاولة معالجة (قراءة وكتابة وإيقاف مؤقت واستئناف وما إلى ذلك) مقبس متصل بـ `Http2Session` بشكل مباشر.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

يقتصر طول إطارات HTTP/2 `ORIGIN` على 16382 بايت.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

وصل عدد التدفقات التي تم إنشاؤها في جلسة HTTP/2 واحدة إلى الحد الأقصى.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

تم تحديد حمولة رسالة لرمز استجابة HTTP يحظر الحمولة.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

تم إلغاء اختبار اتصال HTTP/2.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

يجب أن يكون طول حمولات اختبار اتصال HTTP/2 بالضبط 8 بايت.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

تم استخدام عنوان HTTP/2 زائف بشكل غير لائق. العناوين الزائفة هي أسماء مفاتيح العناوين التي تبدأ بالبادئة `:`.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

تمت محاولة إنشاء تدفق دفع، والذي تم تعطيله بواسطة العميل.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

تمت محاولة استخدام واجهة برمجة التطبيقات `Http2Stream.prototype.responseWithFile()` لإرسال دليل.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

تمت محاولة استخدام واجهة برمجة التطبيقات `Http2Stream.prototype.responseWithFile()` لإرسال شيء آخر غير ملف عادي، ولكن تم توفير خيارات `offset` أو `length`.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

تم إغلاق `Http2Session` برمز خطأ غير صفري.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

تم إلغاء إعدادات `Http2Session`.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

تمت محاولة توصيل كائن `Http2Session` بـ `net.Socket` أو `tls.TLSSocket` تم ربطه بالفعل بكائن `Http2Session` آخر.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

تمت محاولة استخدام خاصية `socket` الخاصة بـ `Http2Session` التي تم إغلاقها بالفعل.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

يحظر استخدام رمز الحالة المعلوماتي `101` في HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

تم تحديد رمز حالة HTTP غير صالح. يجب أن تكون رموز الحالة عددًا صحيحًا بين `100` و `599` (شاملة).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

تم تدمير `Http2Stream` قبل إرسال أي بيانات إلى النظير المتصل.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

تم تحديد رمز خطأ غير صفري في إطار `RST_STREAM`.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

عند تعيين أولوية لتدفق HTTP/2، يمكن تمييز التدفق كتابعية لتدفق رئيسي. يتم استخدام رمز الخطأ هذا عند محاولة تمييز تدفق كتابعية لنفسه.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

تم تجاوز عدد الإعدادات المخصصة المدعومة (10).


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**تمت الإضافة في: v15.14.0**

تم تجاوز الحد الأقصى لإطارات بروتوكول HTTP/2 غير الصالحة المقبولة والمرسلة من النظير، كما هو محدد عبر خيار `maxSessionInvalidFrames`.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

تم إرسال تذييلات الرأس بالفعل على `Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

لا يمكن استدعاء الطريقة `http2stream.sendTrailers()` إلا بعد انبعاث الحدث `'wantTrailers'` على كائن `Http2Stream`. سيتم انبعاث الحدث `'wantTrailers'` فقط إذا تم تعيين خيار `waitForTrailers` لـ `Http2Stream`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

تم تمرير عنوان URL إلى `http2.connect()` يستخدم أي بروتوكول بخلاف `http:` أو `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

يتم طرح خطأ عند الكتابة إلى استجابة HTTP لا تسمح بالمحتويات.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

حجم نص الاستجابة لا يتطابق مع قيمة رأس طول المحتوى المحدد.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

تمت محاولة إضافة المزيد من الرؤوس بعد إرسال الرؤوس بالفعل.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

تم تحديد قيمة رأس HTTP غير صالحة.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

كان رمز الحالة خارج نطاق رمز الحالة العادي (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

لم يرسل العميل الطلب بأكمله خلال الوقت المسموح به.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

تم بالفعل تعيين مقبس إلى [`ServerResponse`](/ar/nodejs/api/http#class-httpserverresponse) المحدد.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

تغيير ترميز المقبس غير مسموح به وفقًا لـ [RFC 7230 القسم 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

تم تعيين رأس `Trailer` على الرغم من أن ترميز النقل لا يدعم ذلك.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

تمت محاولة إنشاء كائن باستخدام مُنشئ غير عام.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**تمت الإضافة في: v21.1.0**

سمة الاستيراد مفقودة، مما يمنع استيراد الوحدة النمطية المحددة.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**تمت الإضافة في: الإصدار 21.1.0**

تم توفير سمة `type` للاستيراد، ولكن نوع الوحدة النمطية المحددة مختلف.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**تمت الإضافة في: الإصدار 21.0.0، الإصدار 20.10.0، الإصدار 18.19.0**

سمة الاستيراد غير مدعومة في هذا الإصدار من Node.js.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

هناك زوج من الخيارات غير متوافقين مع بعضهما البعض ولا يمكن استخدامهما في نفس الوقت.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تم استخدام علامة `--input-type` لمحاولة تنفيذ ملف. يمكن استخدام هذه العلامة فقط مع الإدخال عبر `--eval` أو `--print` أو `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

أثناء استخدام الوحدة النمطية `node:inspector`، تم إجراء محاولة لتنشيط الفاحص عندما بدأ بالفعل في الاستماع على منفذ. استخدم `inspector.close()` قبل تنشيطه على عنوان مختلف.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

أثناء استخدام الوحدة النمطية `node:inspector`، تم إجراء محاولة للاتصال عندما كان الفاحص متصلاً بالفعل.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

أثناء استخدام الوحدة النمطية `node:inspector`، تم إجراء محاولة لاستخدام الفاحص بعد إغلاق الجلسة بالفعل.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

حدث خطأ أثناء إصدار أمر عبر الوحدة النمطية `node:inspector`.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

الفاحص غير نشط عند استدعاء `inspector.waitForDebugger()`.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

الوحدة النمطية `node:inspector` غير متاحة للاستخدام.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

أثناء استخدام الوحدة النمطية `node:inspector`، تم إجراء محاولة لاستخدام الفاحص قبل توصيله.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

تم استدعاء واجهة برمجة تطبيقات على مؤشر الترابط الرئيسي لا يمكن استخدامها إلا من مؤشر ترابط العامل.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

كان هناك خطأ في Node.js أو استخدام غير صحيح لدواخل Node.js. لإصلاح الخطأ، افتح مشكلة على [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

العنوان المقدم غير مفهوم بواسطة واجهة برمجة تطبيقات Node.js.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

عائلة العناوين المقدمة غير مفهومة بواسطة واجهة برمجة تطبيقات Node.js.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

تم تمرير وسيط من نوع خاطئ إلى واجهة برمجة تطبيقات Node.js.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

تم تمرير قيمة غير صالحة أو غير مدعومة لوسيط معين.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

تم تمرير `asyncId` أو `triggerAsyncId` غير صالح باستخدام `AsyncHooks`. يجب ألا يحدث مُعرّف أقل من -1 أبدًا.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

تم إجراء تبديل على `Buffer` ولكن حجمه لم يكن متوافقًا مع العملية.

### `ERR_INVALID_CHAR` {#err_invalid_char}

تم الكشف عن أحرف غير صالحة في الرؤوس.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

لا يمكن نقل المؤشر على دفق معين إلى صف محدد بدون عمود محدد.

### `ERR_INVALID_FD` {#err_invalid_fd}

واصف الملف ('fd') لم يكن صالحًا (على سبيل المثال، كانت قيمة سالبة).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

نوع واصف الملف ('fd') لم يكن صالحًا.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

واجهة برمجة تطبيقات Node.js تستهلك عناوين URL `file:` (مثل وظائف معينة في الوحدة النمطية [`fs`](/ar/nodejs/api/fs)) صادفت عنوان URL للملف مع مضيف غير متوافق. لا يمكن أن يحدث هذا الموقف إلا على الأنظمة الشبيهة بـ Unix حيث يتم دعم `localhost` فقط أو مضيف فارغ.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

واجهة برمجة تطبيقات Node.js تستهلك عناوين URL `file:` (مثل وظائف معينة في الوحدة النمطية [`fs`](/ar/nodejs/api/fs)) صادفت عنوان URL للملف مع مسار غير متوافق. تعتمد الدلالات الدقيقة لتحديد ما إذا كان يمكن استخدام المسار على النظام الأساسي.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

تمت محاولة إرسال "مقبض" غير مدعوم عبر قناة اتصال IPC إلى عملية فرعية. راجع [`subprocess.send()`](/ar/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) و [`process.send()`](/ar/nodejs/api/process#processsendmessage-sendhandle-options-callback) لمزيد من المعلومات.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

تم توفير رمز HTTP غير صالح.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

عنوان IP غير صالح.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

بنية MIME غير صالحة.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**تمت الإضافة في: v15.0.0, v14.18.0**

تمت محاولة تحميل وحدة غير موجودة أو غير صالحة بخلاف ذلك.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

سلسلة الوحدة النمطية المستوردة هي عنوان URL أو اسم حزمة أو محدد مسار فرعي للحزمة غير صالح.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

حدث خطأ أثناء تعيين سمة غير صالحة على خاصية كائن.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

فشل تحليل ملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) غير صالح.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

يحتوي حقل [`"exports"`](/ar/nodejs/api/packages#exports) الخاص بـ `package.json` على قيمة تعيين هدف غير صالحة لحل الوحدة النمطية الذي تمت محاولته.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

تم تمرير `options.protocol` غير صالح إلى `http.request()`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

تم تعيين الخيارين `breakEvalOnSigint` و `eval` في تكوين [`REPL`](/ar/nodejs/api/repl)، وهو أمر غير مدعوم.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

قد لا يتم استخدام الإدخال في [`REPL`](/ar/nodejs/api/repl). يتم وصف الشروط التي يتم بموجبها استخدام هذا الخطأ في وثائق [`REPL`](/ar/nodejs/api/repl).

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

يتم طرحه في حالة عدم توفير خيار الدالة قيمة صالحة لإحدى خصائص الكائن التي تم إرجاعها عند التنفيذ.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

يتم طرحه في حالة عدم توفير خيار الدالة نوع قيمة متوقع لإحدى خصائص الكائن التي تم إرجاعها عند التنفيذ.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

يتم طرحه في حالة عدم قيام خيار الدالة بإرجاع نوع قيمة متوقع عند التنفيذ، كما هو الحال عندما يُتوقع من الدالة إرجاع وعد.

### `ERR_INVALID_STATE` {#err_invalid_state}

**تمت الإضافة في: v15.0.0**

يشير إلى أنه لا يمكن إكمال العملية بسبب حالة غير صالحة. على سبيل المثال، قد يكون الكائن قد تم تدميره بالفعل، أو قد يقوم بعملية أخرى.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

تم توفير `Buffer` أو `TypedArray` أو `DataView` أو `string` كإدخال stdio لتفرع غير متزامن. راجع الوثائق الخاصة بالوحدة النمطية [`child_process`](/ar/nodejs/api/child_process) لمزيد من المعلومات.


### `ERR_INVALID_THIS` {#err_invalid_this}

تم استدعاء وظيفة API الخاصة بـ Node.js بقيمة `this` غير متوافقة.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// يطرح خطأ TypeError بالرمز 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

لم يمثل عنصر في `iterable` المقدم إلى [WHATWG](/ar/nodejs/api/url#the-whatwg-url-api) [`URLSearchParams` constructor](/ar/nodejs/api/url#new-urlsearchparamsiterable) صفًا `[name, value]` - أي، إذا كان العنصر غير قابل للتكرار، أو لا يتكون من عنصرين بالضبط.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**أضيف في: v23.0.0**

بنية TypeScript المقدمة غير صالحة أو غير مدعومة. قد يحدث هذا عند استخدام بنية TypeScript التي تتطلب تحويلًا باستخدام [type-stripping](/ar/nodejs/api/typescript#type-stripping).

### `ERR_INVALID_URI` {#err_invalid_uri}

تم تمرير URI غير صالح.

### `ERR_INVALID_URL` {#err_invalid_url}

تم تمرير عنوان URL غير صالح إلى [WHATWG](/ar/nodejs/api/url#the-whatwg-url-api) [`URL` constructor](/ar/nodejs/api/url#new-urlinput-base) أو الإصدار القديم [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) ليتم تحليله. يحتوي كائن الخطأ الذي يتم طرحه عادةً على خاصية إضافية `'input'` تحتوي على عنوان URL الذي فشل تحليله.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

تمت محاولة استخدام عنوان URL بنظام (بروتوكول) غير متوافق لغرض معين. يتم استخدامه فقط في دعم [WHATWG URL API](/ar/nodejs/api/url#the-whatwg-url-api) في وحدة [`fs`](/ar/nodejs/api/fs) (التي تقبل فقط عناوين URL بنظام `'file'`)، ولكن قد يتم استخدامه في واجهات برمجة تطبيقات Node.js الأخرى أيضًا في المستقبل.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

تمت محاولة استخدام قناة اتصال IPC كانت مغلقة بالفعل.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

تمت محاولة فصل قناة اتصال IPC تم فصلها بالفعل. راجع الوثائق الخاصة بوحدة [`child_process`](/ar/nodejs/api/child_process) لمزيد من المعلومات.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

تمت محاولة إنشاء عملية Node.js فرعية باستخدام أكثر من قناة اتصال IPC واحدة. راجع الوثائق الخاصة بوحدة [`child_process`](/ar/nodejs/api/child_process) لمزيد من المعلومات.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

تمت محاولة فتح قناة اتصال IPC مع عملية Node.js متفرعة بشكل متزامن. راجع الوثائق الخاصة بوحدة [`child_process`](/ar/nodejs/api/child_process) لمزيد من المعلومات.

### `ERR_IP_BLOCKED` {#err_ip_blocked}

تم حظر IP بواسطة `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**تمت الإضافة في: v18.6.0، v16.17.0**

أعاد خطاف محمل ESM دون استدعاء `next()` ودون الإشارة صراحةً إلى دائرة قصر.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**تمت الإضافة في: v23.5.0**

حدث خطأ أثناء تحميل ملحق SQLite.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

تمت محاولة تخصيص الذاكرة (عادةً في طبقة C++) ولكنها فشلت.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**تمت الإضافة في: v14.5.0، v12.19.0**

تعذر إلغاء تسلسل رسالة تم إرسالها إلى [`MessagePort`](/ar/nodejs/api/worker_threads#class-messageport) في [`vm`](/ar/nodejs/api/vm) `Context` الهدف. لا يمكن إنشاء جميع كائنات Node.js بنجاح في أي سياق في هذا الوقت، ومحاولة نقلها باستخدام `postMessage()` يمكن أن تفشل على الجانب المتلقي في هذه الحالة.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

الطريقة مطلوبة ولكنها غير منفذة.

### `ERR_MISSING_ARGS` {#err_missing_args}

لم يتم تمرير وسيطة مطلوبة لواجهة برمجة تطبيقات Node.js. يتم استخدام هذا فقط للامتثال الصارم لمواصفات API (والتي قد تقبل في بعض الحالات `func(undefined)` ولكن ليس `func()`). في معظم واجهات برمجة تطبيقات Node.js الأصلية، يتم التعامل مع `func(undefined)` و `func()` بشكل مماثل، وقد يتم استخدام رمز الخطأ [`ERR_INVALID_ARG_TYPE`](/ar/nodejs/api/errors#err_invalid_arg_type) بدلاً من ذلك.

### `ERR_MISSING_OPTION` {#err_missing_option}

بالنسبة إلى واجهات برمجة التطبيقات التي تقبل كائنات الخيارات، قد تكون بعض الخيارات إلزامية. يتم طرح هذا الرمز إذا كان هناك خيار مطلوب مفقودًا.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

تمت محاولة قراءة مفتاح مشفر دون تحديد عبارة مرور.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

لا تدعم منصة V8 التي تستخدمها هذه النسخة من Node.js إنشاء Workers. يحدث هذا بسبب نقص دعم المُضمِّن لـ Workers. على وجه الخصوص، لن يحدث هذا الخطأ مع الإصدارات القياسية من Node.js.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

تعذر على مُحمِّل وحدات ECMAScript تحليل ملف وحدة نمطية أثناء محاولة إجراء عملية `import` أو عند تحميل نقطة إدخال البرنامج.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

تم استدعاء دالة رد نداء أكثر من مرة.

يُفترض دائمًا استدعاء دالة رد النداء مرة واحدة فقط حيث يمكن إما تلبية الاستعلام أو رفضه ولكن ليس كلاهما في نفس الوقت. سيكون الأخير ممكنًا عن طريق استدعاء دالة رد النداء أكثر من مرة.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

أثناء استخدام `Node-API`، لم يكن المُنشئ الذي تم تمريره دالة.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

أثناء استدعاء `napi_create_dataview()`، كان `offset` معينًا خارج حدود عرض البيانات أو كان `offset + length` أكبر من طول `buffer` معين.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

أثناء استدعاء `napi_create_typedarray()`، لم يكن `offset` المقدم مضاعفًا لحجم العنصر.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

أثناء استدعاء `napi_create_typedarray()`، كان `(length * size_of_element) + byte_offset` أكبر من طول `buffer` معين.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

حدث خطأ أثناء استدعاء الجزء JavaScript من الدالة الآمنة للمؤشرات.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

حدث خطأ أثناء محاولة استرداد قيمة JavaScript `undefined`.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

تم تحميل إضافة أصلية غير مدركة للسياق في عملية تحظرها.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

تمت محاولة استخدام عمليات لا يمكن استخدامها إلا عند إنشاء لقطة بداية تشغيل V8 على الرغم من أن Node.js لا يقوم بإنشاء واحدة.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**تمت إضافتها في: الإصدار 21.7.0، الإصدار 20.12.0**

لا يمكن إجراء العملية عندما لا تكون في تطبيق قابل للتنفيذ بذاته.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

تمت محاولة إجراء عمليات غير مدعومة عند إنشاء لقطة بداية التشغيل.

### `ERR_NO_CRYPTO` {#err_no_crypto}

تمت محاولة استخدام ميزات التشفير بينما لم يتم تجميع Node.js مع دعم تشفير OpenSSL.


### `ERR_NO_ICU` {#err_no_icu}

تمت محاولة استخدام ميزات تتطلب [ICU](/ar/nodejs/api/intl#internationalization-support)، ولكن لم يتم تجميع Node.js بدعم ICU.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**تمت إضافتها في: v23.0.0**

تمت محاولة استخدام ميزات تتطلب [دعم TypeScript الأصلي](/ar/nodejs/api/typescript#type-stripping)، ولكن لم يتم تجميع Node.js بدعم TypeScript.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**تمت إضافتها في: v15.0.0**

فشلت عملية. يستخدم هذا عادةً للإشارة إلى الفشل العام لعملية غير متزامنة.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

قيمة معينة خارج النطاق المقبول.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

لا يحدد حقل [`"imports"`](/ar/nodejs/api/packages#imports) في `package.json` تعيين محدد الحزمة الداخلية المحدد.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

لا يقوم حقل [`"exports"`](/ar/nodejs/api/packages#exports) في `package.json` بتصدير المسار الفرعي المطلوب. نظرًا لأن الصادرات مغلفة، لا يمكن استيراد الوحدات النمطية الداخلية الخاصة التي لم يتم تصديرها من خلال تحليل الحزمة، إلا باستخدام عنوان URL مطلق.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**تمت إضافتها في: v18.3.0, v16.17.0**

عندما يتم تعيين `strict` على `true`، يتم طرحها بواسطة [`util.parseArgs()`](/ar/nodejs/api/util#utilparseargsconfig) إذا تم توفير قيمة [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لخيار من النوع [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، أو إذا تم توفير قيمة [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) لخيار من النوع [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**تمت إضافتها في: v18.3.0, v16.17.0**

يتم طرحها بواسطة [`util.parseArgs()`](/ar/nodejs/api/util#utilparseargsconfig)، عندما يتم توفير وسيط موضعي ويتم تعيين `allowPositionals` على `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**تمت إضافتها في: v18.3.0, v16.17.0**

عندما يتم تعيين `strict` على `true`، يتم طرحها بواسطة [`util.parseArgs()`](/ar/nodejs/api/util#utilparseargsconfig) إذا لم يتم تكوين وسيط في `options`.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

تم توفير قيمة طابع زمني غير صالحة لعلامة أداء أو مقياس أداء.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

تم توفير خيارات غير صالحة لمقياس أداء.

### `ERR_PROTO_ACCESS` {#err_proto_access}

تم منع الوصول إلى `Object.prototype.__proto__` باستخدام [`--disable-proto=throw`](/ar/nodejs/api/cli#--disable-protomode). يجب استخدام [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) و [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) للحصول على وتعيين النموذج الأولي لكائن.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**أضيف في: v23.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

حدث خطأ في تطبيق QUIC.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**أضيف في: v23.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

فشل إنشاء اتصال QUIC.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**أضيف في: v23.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

أغلقت نقطة نهاية QUIC بخطأ.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**أضيف في: v23.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

فشل فتح دفق QUIC.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**أضيف في: v23.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

حدث خطأ في نقل QUIC.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**أضيف في: v23.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

فشلت جلسة QUIC لأنه يلزم التفاوض على الإصدار.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

عند محاولة `require()` لـ [وحدة ES](/ar/nodejs/api/esm)، تبين أن الوحدة غير متزامنة. أي أنها تحتوي على await ذي مستوى أعلى.

لمعرفة مكان الـ await ذي المستوى الأعلى، استخدم `--experimental-print-required-tla` (سيؤدي ذلك إلى تنفيذ الوحدات قبل البحث عن awaits ذات المستوى الأعلى).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

عند محاولة `require()` لـ [وحدة ES](/ar/nodejs/api/esm)، تشارك حافة CommonJS إلى ESM أو ESM إلى CommonJS في دورة فورية. هذا غير مسموح به لأن وحدات ES لا يمكن تقييمها أثناء تقييمها بالفعل.

لتجنب الدورة، يجب ألا تحدث استدعاءات `require()` المتضمنة في دورة في المستوى الأعلى إما لوحدة ES (عبر `createRequire()`) أو وحدة CommonJS، ويجب أن تتم ببطء في دالة داخلية.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [History]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | يدعم require() الآن تحميل وحدات ES المتزامنة افتراضيًا. |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء
:::

تمت محاولة `require()` [وحدة ES](/ar/nodejs/api/esm).

تم إهمال هذا الخطأ منذ أن أصبح `require()` يدعم الآن تحميل وحدات ES المتزامنة. عندما يواجه `require()` وحدة ES تحتوي على `await` ذي مستوى أعلى، فإنه سيرمي [`ERR_REQUIRE_ASYNC_MODULE`](/ar/nodejs/api/errors#err_require_async_module) بدلاً من ذلك.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

تمت مقاطعة تنفيذ البرنامج النصي بواسطة `SIGINT` (على سبيل المثال، + تم الضغط عليها.)

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

انتهت مهلة تنفيذ البرنامج النصي، ربما بسبب وجود أخطاء في البرنامج النصي الذي يتم تنفيذه.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

تم استدعاء الأسلوب [`server.listen()`](/ar/nodejs/api/net#serverlisten) بينما كانت `net.Server` تستمع بالفعل. ينطبق هذا على جميع مثيلات `net.Server`، بما في ذلك مثيلات `Server` الخاصة بـ HTTP و HTTPS و HTTP/2.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

تم استدعاء الأسلوب [`server.close()`](/ar/nodejs/api/net#serverclosecallback) عندما لم يكن `net.Server` قيد التشغيل. ينطبق هذا على جميع مثيلات `net.Server`، بما في ذلك مثيلات HTTP و HTTPS و HTTP/2 `Server`.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**أضيف في: v21.7.0, v20.12.0**

تم تمرير مفتاح إلى واجهات برمجة تطبيقات التطبيقات التنفيذية الفردية لتحديد أحد الأصول، ولكن لم يتم العثور على أي تطابق.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

تمت محاولة ربط مقبس تم ربطه بالفعل.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

تم تمرير حجم غير صالح (سلبي) لخيار `recvBufferSize` أو `sendBufferSize` في [`dgram.createSocket()`](/ar/nodejs/api/dgram#dgramcreatesocketoptions-callback).

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

تلقت دالة API تتوقع منفذ >= 0 و < 65536 قيمة غير صالحة.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

تلقت دالة API تتوقع نوع مقبس (`udp4` أو `udp6`) قيمة غير صالحة.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

أثناء استخدام [`dgram.createSocket()`](/ar/nodejs/api/dgram#dgramcreatesocketoptions-callback)، تعذر تحديد حجم `Buffer` الاستقبال أو الإرسال.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

تمت محاولة إجراء عملية على مقبس مغلق بالفعل.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

عند استدعاء [`net.Socket.write()`](/ar/nodejs/api/net#socketwritedata-encoding-callback) على مقبس متصل وتم إغلاق المقبس قبل إنشاء الاتصال.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

لم يتمكن المقبس من الاتصال بأي عنوان تم إرجاعه بواسطة DNS ضمن المهلة المسموح بها عند استخدام خوارزمية الاختيار التلقائي للعائلة.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

تم إجراء استدعاء [`dgram.connect()`](/ar/nodejs/api/dgram#socketconnectport-address-callback) على مقبس متصل بالفعل.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

تم إجراء استدعاء [`dgram.disconnect()`](/ar/nodejs/api/dgram#socketdisconnect) أو [`dgram.remoteAddress()`](/ar/nodejs/api/dgram#socketremoteaddress) على مقبس غير متصل.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

تم إجراء مكالمة ولم يكن نظام UDP الفرعي قيد التشغيل.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

تعذر تحليل خريطة المصدر لأنها غير موجودة أو تالفة.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

لم يتم العثور على ملف تم استيراده من خريطة مصدر.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**إضافة في: v22.5.0**

تم إرجاع خطأ من [SQLite](/ar/nodejs/api/sqlite).

### `ERR_SRI_PARSE` {#err_sri_parse}

تم توفير سلسلة لفحص تكامل الموارد الفرعية، ولكن تعذر تحليلها. تحقق من تنسيق سمات التكامل من خلال الاطلاع على [مواصفات تكامل الموارد الفرعية](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

تم استدعاء طريقة دفق لا يمكن إكمالها لأن الدفق قد انتهى.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

تمت محاولة استدعاء [`stream.pipe()`](/ar/nodejs/api/stream#readablepipedestination-options) على دفق [`Writable`](/ar/nodejs/api/stream#class-streamwritable).

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

تم استدعاء طريقة دفق لا يمكن إكمالها لأن الدفق قد تم تدميره باستخدام `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

تمت محاولة استدعاء [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) بكتلة `null`.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

خطأ تم إرجاعه بواسطة `stream.finished()` و `stream.pipeline()`، عندما ينتهي دفق أو مسار بشكل غير سلس بدون خطأ صريح.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

تمت محاولة استدعاء [`stream.push()`](/ar/nodejs/api/stream#readablepushchunk-encoding) بعد أن تم دفع `null`(EOF) إلى الدفق.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

تمت محاولة تمرير إلى دفق مغلق أو مدمر في مسار.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

تمت محاولة استدعاء [`stream.unshift()`](/ar/nodejs/api/stream#readableunshiftchunk-encoding) بعد انبعاث حدث `'end'`.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

يمنع الإجهاض إذا تم تعيين وحدة فك ترميز سلسلة على Socket أو إذا كانت وحدة فك الترميز في `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

تمت محاولة استدعاء [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) بعد استدعاء `stream.end()`.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

تمت محاولة إنشاء سلسلة أطول من الطول الأقصى المسموح به.

### `ERR_SYNTHETIC` {#err_synthetic}

كائن خطأ اصطناعي يستخدم لالتقاط مكدس الاستدعاءات لتقارير التشخيص.

### `ERR_SYSTEM_ERROR` {#err_system_error}

حدث خطأ نظام غير محدد أو غير خاص داخل عملية Node.js. سيحتوي كائن الخطأ على خاصية كائن `err.info` مع تفاصيل إضافية.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

خطأ يمثل حالة محلل معجمي فاشلة.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

خطأ يمثل حالة محلل نحوي فاشلة. تتوفر معلومات إضافية حول الرمز المميز الذي تسبب في الخطأ عبر خاصية `cause`.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

يمثل هذا الخطأ فشل التحقق من TAP.

### `ERR_TEST_FAILURE` {#err_test_failure}

يمثل هذا الخطأ اختبارًا فاشلاً. تتوفر معلومات إضافية حول الفشل عبر خاصية `cause`. تحدد خاصية `failureType` ما كان الاختبار يفعله عند حدوث الفشل.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

يتم طرح هذا الخطأ عندما تُرجع `ALPNCallback` قيمة ليست في قائمة بروتوكولات ALPN التي يقدمها العميل.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

يتم طرح هذا الخطأ عند إنشاء `TLSServer` إذا كانت خيارات TLS تتضمن كلاً من `ALPNProtocols` و `ALPNCallback`. هذه الخيارات حصرية بشكل متبادل.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

يتم طرح هذا الخطأ بواسطة `checkServerIdentity` إذا كانت خاصية `subjectaltname` المقدمة من المستخدم تنتهك قواعد الترميز. تتوافق كائنات الشهادات التي تنتجها Node.js نفسها دائمًا مع قواعد الترميز ولن تتسبب أبدًا في هذا الخطأ.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

أثناء استخدام TLS، لم يتطابق اسم المضيف/IP الخاص بالنظير مع أي من `subjectAltNames` في شهادته.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

أثناء استخدام TLS، تكون المعلمة المقدمة لبروتوكول اتفاقية المفاتيح Diffie-Hellman (`DH`) صغيرة جدًا. بشكل افتراضي، يجب أن يكون طول المفتاح أكبر من أو يساوي 1024 بت لتجنب الثغرات الأمنية، على الرغم من أنه يوصى بشدة باستخدام 2048 بت أو أكبر للحصول على أمان أقوى.


### ‏`ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

انتهت المهلة الزمنية لمصافحة TLS/SSL. في هذه الحالة، يجب على الخادم أيضًا إجهاض الاتصال.

### ‏`ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**تمت إضافتها في: v13.3.0**

يجب أن يكون السياق `SecureContext`.

### ‏`ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

طريقة `secureProtocol` المحددة غير صالحة. إما أنها غير معروفة، أو معطلة لأنها غير آمنة.

### ‏`ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

إصدارات بروتوكول TLS الصالحة هي `'TLSv1'`, `'TLSv1.1'`, أو `'TLSv1.2'`.

### ‏`ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**تمت إضافتها في: v13.10.0, v12.17.0**

يجب توصيل مقبس TLS وتأسيسه بشكل آمن. تأكد من إصدار حدث "آمن" قبل المتابعة.

### ‏`ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

محاولة تعيين `minVersion` أو `maxVersion` لبروتوكول TLS تتعارض مع محاولة تعيين `secureProtocol` بشكل صريح. استخدم إحدى الآليتين.

### ‏`ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

فشل تعيين تلميح هوية PSK. قد يكون التلميح طويلًا جدًا.

### ‏`ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

تمت محاولة إعادة التفاوض على TLS على مثيل مقبس مع تعطيل إعادة التفاوض.

### ‏`ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

أثناء استخدام TLS، تم استدعاء طريقة `server.addContext()` دون توفير اسم مضيف في المعلمة الأولى.

### ‏`ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

تم اكتشاف كمية كبيرة من عمليات إعادة التفاوض على TLS، وهي ناقل محتمل لهجمات رفض الخدمة.

### ‏`ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

تمت محاولة إصدار إشارة اسم الخادم من مقبس TLS من جانب الخادم، وهو صالح فقط من العميل.

### ‏`ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

تتطلب طريقة `trace_events.createTracing()` فئة واحدة على الأقل من فئات أحداث التتبع.

### ‏`ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

تعذر تحميل الوحدة `node:trace_events` لأن Node.js تم تجميعه باستخدام العلامة `--without-v8-platform`.

### ‏`ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

انتهى تدفق `Transform` أثناء استمراره في التحويل.

### ‏`ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

انتهى تدفق `Transform` مع وجود بيانات لا تزال في مخزن الكتابة المؤقت.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

فشل تهيئة TTY بسبب خطأ في النظام.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

تم استدعاء دالة داخل معالج [`process.on('exit')`](/ar/nodejs/api/process#event-exit) والتي لا ينبغي استدعاؤها داخل معالج [`process.on('exit')`](/ar/nodejs/api/process#event-exit).

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

تم استدعاء [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) مرتين، دون إعادة تعيين الاستدعاء إلى `null` أولاً.

تم تصميم هذا الخطأ لمنع الكتابة فوق استدعاء مسجل من وحدة نمطية أخرى عن طريق الخطأ.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

تم استلام سلسلة تحتوي على أحرف غير مُلغاة.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

حدث خطأ لم تتم معالجته (على سبيل المثال، عندما يتم إطلاق حدث `'error'` بواسطة [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter) ولكن لم يتم تسجيل معالج `'error'`).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

يستخدم لتحديد نوع معين من أخطاء Node.js الداخلية التي لا ينبغي عادةً أن يتم تشغيلها بواسطة كود المستخدم. تشير مثيلات هذا الخطأ إلى وجود خلل داخلي في ثنائي Node.js نفسه.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

تم تمرير مجموعة Unix أو معرف مستخدم غير موجود.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

تم تمرير خيار ترميز غير صالح أو غير معروف إلى واجهة برمجة تطبيقات.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تمت محاولة تحميل وحدة نمطية بامتداد ملف غير معروف أو غير مدعوم.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تمت محاولة تحميل وحدة نمطية بتنسيق غير معروف أو غير مدعوم.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

تم تمرير إشارة عملية غير صالحة أو غير معروفة إلى واجهة برمجة تطبيقات تتوقع إشارة صالحة (مثل [`subprocess.kill()`](/ar/nodejs/api/child_process#subprocesskillsignal)).


### ‏`ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

‏`import` عنوان URL لدليل غير مدعوم. بدلاً من ذلك، [قم بالإشارة الذاتية إلى حزمة باستخدام اسمها](/ar/nodejs/api/packages#self-referencing-a-package-using-its-name) و [حدد مسارًا فرعيًا مخصصًا](/ar/nodejs/api/packages#subpath-exports) في حقل [`"exports"`](/ar/nodejs/api/packages#exports) الخاص بملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // غير مدعوم
import './index.js'; // مدعوم
import 'package-name'; // مدعوم
```
### ‏`ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

‏`import` مع مخططات URL بخلاف `file` و `data` غير مدعوم.

### ‏`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**تمت الإضافة في: v22.6.0**

إزالة الأنواع غير مدعومة للملفات المنحدرة من دليل `node_modules`.

### ‏`ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

تمت محاولة تحليل مُحيل وحدة نمطية غير صالح. يمكن أن يحدث هذا عند استيراد أو استدعاء `import.meta.resolve()` مع:

- مُحدد مجرد ليس وحدة نمطية مدمجة من وحدة نمطية يكون مخطط URL الخاص بها ليس `file`.
- [عنوان URL نسبي](https://url.spec.whatwg.org/#relative-url-string) من وحدة نمطية يكون مخطط URL الخاص بها ليس [مخططًا خاصًا](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // محاولة استيراد الحزمة 'bare-specifier' من وحدة نمطية `data:` URL:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### ‏`ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تمت محاولة استخدام شيء تم إغلاقه بالفعل.

### ‏`ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

أثناء استخدام واجهة برمجة تطبيقات توقيت الأداء (`perf_hooks`)، لم يتم العثور على أنواع إدخال أداء صالحة.

### ‏`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

لم يتم تحديد استدعاء استيراد ديناميكي.

### ‏`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

تم استدعاء استدعاء استيراد ديناميكي بدون `--experimental-vm-modules`.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

الوحدة التي تحاول ربطها غير مؤهلة للربط، وذلك لأحد الأسباب التالية:

- لقد تم ربطها بالفعل (`linkingStatus` هو `'linked'`)
- يتم ربطها حاليًا (`linkingStatus` هو `'linking'`)
- فشل الربط لهذه الوحدة (`linkingStatus` هو `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

خيار `cachedData` الذي تم تمريره إلى مُنشئ الوحدة غير صالح.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

لا يمكن إنشاء بيانات مخزنة مؤقتًا للوحدات التي تم تقييمها بالفعل.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

الوحدة التي يتم إرجاعها من دالة الرابط هي من سياق مختلف عن الوحدة الأصل. يجب أن تشترك الوحدات المرتبطة في نفس السياق.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

لم يتمكن من ربط الوحدة بسبب الفشل.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

القيمة المحققة لوعد الربط ليست كائن `vm.Module`.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

لا تسمح حالة الوحدة النمطية الحالية بهذه العملية. يعتمد المعنى المحدد للخطأ على الوظيفة المحددة.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

بدأ بالفعل مثيل WASI.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

لم يتم بدء مثيل WASI.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**تمت إضافته في: v18.1.0**

إن `Response` الذي تم تمريره إلى `WebAssembly.compileStreaming` أو إلى `WebAssembly.instantiateStreaming` ليس استجابة WebAssembly صالحة.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

فشل تهيئة `Worker`.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

يحتوي خيار `execArgv` الذي تم تمريره إلى مُنشئ `Worker` على علامات غير صالحة.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**تمت إضافته في: v22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

أطلق الموضوع الوجهة خطأ أثناء معالجة رسالة تم إرسالها عبر [`postMessageToThread()`](/ar/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**أضيف في: الإصدار 22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

المؤشر الفرعي المطلوب في [`postMessageToThread()`](/ar/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) غير صالح أو لا يحتوي على مستمع `workerMessage`.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**أضيف في: الإصدار 22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

معرف المؤشر الفرعي المطلوب في [`postMessageToThread()`](/ar/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) هو معرف المؤشر الفرعي الحالي.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**أضيف في: الإصدار 22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

انتهت المهلة الزمنية لإرسال رسالة عبر [`postMessageToThread()`](/ar/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

فشلت عملية لأن مثيل `Worker` لا يعمل حاليًا.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

تم إنهاء مثيل `Worker` لأنه وصل إلى حد الذاكرة الخاص به.

### `ERR_WORKER_PATH` {#err_worker_path}

المسار للبرنامج النصي الرئيسي للعامل ليس مسارًا مطلقًا ولا مسارًا نسبيًا يبدأ بـ `./` أو `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

فشلت جميع محاولات تسلسل استثناء غير معالج من مؤشر فرعي للعامل.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

الوظيفة المطلوبة غير مدعومة في المؤشرات الفرعية للعامل.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

فشل إنشاء كائن [`zlib`](/ar/nodejs/api/zlib) بسبب التكوين غير الصحيح.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**أضيف في: الإصدار 21.6.2، الإصدار 20.11.1، الإصدار 18.19.1**

تم استلام الكثير من البيانات لامتدادات الكتلة. لحماية العملاء الضارين أو ذوي التكوين الخاطئ، إذا تم استلام أكثر من 16 كيلوبايت من البيانات، فسيتم إرسال `خطأ` بهذا الرمز.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v11.4.0, v10.15.0 | تم تعيين الحد الأقصى لحجم الرأس في `http_parser` إلى 8 كيلوبايت. |
:::

تم استقبال الكثير من بيانات رأس HTTP. من أجل الحماية من العملاء الخبيثين أو الذين تم تكوينهم بشكل خاطئ، إذا تم استقبال أكثر من `maxHeaderSize` من بيانات رأس HTTP، فسيتم إحباط تحليل HTTP دون إنشاء كائن طلب أو استجابة، وسيتم إصدار `Error` بهذا الرمز.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

يرسل الخادم كلاً من رأس `Content-Length` و `Transfer-Encoding: chunked`.

يسمح `Transfer-Encoding: chunked` للخادم بالحفاظ على اتصال HTTP دائم للمحتوى الذي يتم إنشاؤه ديناميكيًا. في هذه الحالة، لا يمكن استخدام رأس HTTP `Content-Length`.

استخدم `Content-Length` أو `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | تمت إضافة الخاصية `requireStack`. |
:::

تعذر تحليل ملف الوحدة النمطية بواسطة محمل وحدات CommonJS أثناء محاولة إجراء [`require()`](/ar/nodejs/api/modules#requireid) أو عند تحميل نقطة إدخال البرنامج.

## رموز خطأ Node.js القديمة {#legacy-nodejs-error-codes}

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. رموز الخطأ هذه غير متناسقة أو تمت إزالتها.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**أضيف في: v10.5.0**

**تمت إزالته في: v12.5.0**

احتوت القيمة التي تم تمريرها إلى `postMessage()` على كائن غير مدعوم للنقل.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**تمت إزالته في: v15.0.0**

تعذر معالجة الاستدعاء الأصلي من `process.cpuUsage`.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**أضيف في: v9.0.0**

**تمت إزالته في: v12.12.0**

تم استخدام ترميز UTF-16 مع [`hash.digest()`](/ar/nodejs/api/crypto#hashdigestencoding). بينما يسمح الأسلوب `hash.digest()` بتمرير وسيطة `encoding`، مما يتسبب في قيام الأسلوب بإرجاع سلسلة بدلاً من `Buffer`، فإن ترميز UTF-16 (مثل `ucs` أو `utf16le`) غير مدعوم.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**تمت إزالته في: v23.0.0**

تم تمرير مجموعة غير متوافقة من الخيارات إلى [`crypto.scrypt()`](/ar/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) أو [`crypto.scryptSync()`](/ar/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options). تستخدم الإصدارات الجديدة من Node.js رمز الخطأ [`ERR_INCOMPATIBLE_OPTION_PAIR`](/ar/nodejs/api/errors#err_incompatible_option_pair) بدلاً من ذلك، وهو ما يتوافق مع واجهات برمجة التطبيقات الأخرى.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**تمت إزالته في: v23.0.0**

تم تمرير نوع ارتباط رمزي غير صالح إلى الطرق [`fs.symlink()`](/ar/nodejs/api/fs#fssymlinktarget-path-type-callback) أو [`fs.symlinkSync()`](/ar/nodejs/api/fs#fssymlinksynctarget-path-type).

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**أضيف في: v9.0.0**

**تمت إزالته في: v10.0.0**

يُستخدم عند حدوث فشل في إرسال إطار فردي في جلسة HTTP/2.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**أضيف في: v9.0.0**

**تمت إزالته في: v10.0.0**

يُستخدم عند توقع كائن رؤوس HTTP/2.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**أضيف في: v9.0.0**

**تمت إزالته في: v10.0.0**

يُستخدم عند فقدان رأس مطلوب في رسالة HTTP/2.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**أضيف في: v9.0.0**

**تمت إزالته في: v10.0.0**

يجب إرسال رؤوس معلومات HTTP/2 *قبل* استدعاء الطريقة `Http2Stream.prototype.respond()`.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**أضيف في: v9.0.0**

**تمت إزالته في: v10.0.0**

يُستخدم عند تنفيذ إجراء على دفق HTTP/2 تم إغلاقه بالفعل.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**أضيف في: v9.0.0**

**تمت إزالته في: v10.0.0**

يُستخدم عند العثور على حرف غير صالح في رسالة حالة استجابة HTTP (عبارة السبب).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**أضيف في: v17.1.0, v16.14.0**

**تمت إزالته في: v21.1.0**

فشل تأكيد الاستيراد، مما منع استيراد الوحدة النمطية المحددة.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**أضيف في: v17.1.0, v16.14.0**

**تمت إزالته في: v21.1.0**

تأكيد الاستيراد مفقود، مما منع استيراد الوحدة النمطية المحددة.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**أضيف في:** v17.1.0, v16.14.0

**أزيل في:** v21.1.0

سمة استيراد غير مدعومة من قبل هذا الإصدار من Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**أضيف في:** v10.0.0

**أزيل في:** v11.0.0

كان الفهرس المعطى خارج النطاق المقبول (مثل الإزاحات السالبة).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**أضيف في:** v8.0.0

**أزيل في:** v15.0.0

تم تمرير قيمة غير صالحة أو غير متوقعة في كائن خيارات.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**أضيف في:** v9.0.0

**أزيل في:** v15.0.0

تم تمرير ترميز ملف غير صالح أو غير معروف.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**أضيف في:** v8.5.0

**أزيل في:** v16.7.0

أثناء استخدام واجهة برمجة تطبيقات توقيت الأداء (`perf_hooks`)، تكون علامة الأداء غير صالحة.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | يتم طرح `DOMException` بدلاً من ذلك. |
| v21.0.0 | أزيل في: v21.0.0 |
:::

تم تمرير كائن نقل غير صالح إلى `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**أزيل في:** v22.2.0

تمت محاولة تحميل مورد، لكن المورد لم يتطابق مع السلامة المحددة بواسطة بيان السياسة. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**أزيل في:** v22.2.0

تمت محاولة تحميل مورد، لكن المورد لم يتم إدراجه كتابع من الموقع الذي حاول تحميله. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**أزيل في:** v22.2.0

تمت محاولة تحميل بيان سياسة، لكن البيان يحتوي على إدخالات متعددة لمورد لم تتطابق مع بعضها البعض. قم بتحديث إدخالات البيان لتتطابق لحل هذا الخطأ. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**أزيل في:** v22.2.0

كان لمورد بيان السياسة قيمة غير صالحة لأحد حقوله. قم بتحديث إدخال البيان ليتطابق لحل هذا الخطأ. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**تمت إزالته في: v22.2.0**

احتوى مورد بيان السياسة على قيمة غير صالحة لأحد تعيينات التبعية الخاصة به. قم بتحديث إدخال البيان ليطابق لحل هذا الخطأ. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**تمت إزالته في: v22.2.0**

تمت محاولة تحميل بيان سياسة، ولكن تعذر تحليل البيان. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**تمت إزالته في: v22.2.0**

تمت محاولة القراءة من بيان سياسة، ولكن تهيئة البيان لم تتم بعد. من المحتمل أن يكون هذا خطأ في Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**تمت إزالته في: v22.2.0**

تم تحميل بيان سياسة، ولكن كانت لديه قيمة غير معروفة لسلوك "onerror" الخاص به. راجع الوثائق الخاصة ببيانات السياسة لمزيد من المعلومات.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**تمت إزالته في: v15.0.0**

تم استبدال رمز الخطأ هذا بـ [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/ar/nodejs/api/errors#err_missing_transferable_in_transfer_list) في Node.js v15.0.0، لأنه لم يعد دقيقًا حيث توجد الآن أنواع أخرى من الكائنات القابلة للتحويل أيضًا.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | يتم طرح `DOMException` بدلاً من ذلك. |
| v21.0.0 | تمت إزالته في: v21.0.0 |
| v15.0.0 | تمت إضافته في: v15.0.0 |
:::

يوجد كائن يحتاج إلى إدراجه صراحةً في وسيطة `transferList` في الكائن الذي تم تمريره إلى استدعاء [`postMessage()`](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist)، ولكن لم يتم توفيره في `transferList` لهذا الاستدعاء. عادةً، يكون هذا `MessagePort`.

في إصدارات Node.js قبل v15.0.0، كان رمز الخطأ المستخدم هنا هو [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ar/nodejs/api/errors#err_missing_message_port_in_transfer_list). ومع ذلك، فقد تم توسيع مجموعة أنواع الكائنات القابلة للتحويل لتغطية أنواع أكثر من `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**تمت إضافته في: v9.0.0**

**تمت إزالته في: v10.0.0**

يستخدم بواسطة `Node-API` عندما لا يكون `Constructor.prototype` كائنًا.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**أضيف في: v10.6.0, v8.16.0**

**أزيل في: v14.2.0, v12.17.0**

في سلسلة العمليات الرئيسية، تُزال القيم من قائمة الانتظار المرتبطة بالدالة الآمنة للمؤشرات في حلقة خاملة. يشير هذا الخطأ إلى حدوث خطأ عند محاولة بدء الحلقة.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**أضيف في: v10.6.0, v8.16.0**

**أزيل في: v14.2.0, v12.17.0**

بمجرد عدم وجود عناصر متبقية في قائمة الانتظار، يجب تعليق الحلقة الخاملة. يشير هذا الخطأ إلى فشل إيقاف الحلقة الخاملة.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

تم استدعاء واجهة برمجة تطبيقات Node.js بطريقة غير مدعومة، مثل `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**أضيف في: v9.0.0**

**أزيل في: v10.0.0**

يستخدم بشكل عام لتحديد أن عملية ما تسببت في حالة نفاد الذاكرة.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**أضيف في: v9.0.0**

**أزيل في: v10.0.0**

فشلت الوحدة `node:repl` في تحليل البيانات من ملف سجل REPL.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**أضيف في: v9.0.0**

**أزيل في: v14.0.0**

تعذر إرسال البيانات على مقبس.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.12.0 | بدلاً من إصدار خطأ، `process.stderr.end()` الآن يغلق جانب التدفق فقط ولكن ليس المورد الأساسي، مما يجعل هذا الخطأ قديمًا. |
| v10.12.0 | أزيل في: v10.12.0 |
:::

تمت محاولة إغلاق تدفق `process.stderr`. بحسب التصميم، لا تسمح Node.js بإغلاق تدفقات `stdout` أو `stderr` بواسطة كود المستخدم.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.12.0 | بدلاً من إصدار خطأ، `process.stderr.end()` الآن يغلق جانب التدفق فقط ولكن ليس المورد الأساسي، مما يجعل هذا الخطأ قديمًا. |
| v10.12.0 | أزيل في: v10.12.0 |
:::

تمت محاولة إغلاق تدفق `process.stdout`. بحسب التصميم، لا تسمح Node.js بإغلاق تدفقات `stdout` أو `stderr` بواسطة كود المستخدم.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**أضيف في: v9.0.0**

**أزيل في: v10.0.0**

يستخدم عند محاولة استخدام تدفق قابل للقراءة لم ينفذ [`readable._read()`](/ar/nodejs/api/stream#readable_readsize).


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**أضيف في: الإصدار v9.0.0**

**أزيل في: الإصدار v10.0.0**

يستخدم عندما يفشل طلب إعادة التفاوض TLS بطريقة غير محددة.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**أضيف في: الإصدار v10.5.0**

**أزيل في: الإصدار v14.0.0**

تمت مصادفة `SharedArrayBuffer` ذاكرة لا يتم إدارتها بواسطة محرك JavaScript أو بواسطة Node.js أثناء التسلسل. لا يمكن تسلسل `SharedArrayBuffer` كهذا.

لا يمكن أن يحدث هذا إلا عندما تقوم الإضافات الأصلية بإنشاء `SharedArrayBuffer` في وضع "خارجي"، أو وضع `SharedArrayBuffer` موجود في وضع خارجي.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**أضيف في: الإصدار v8.0.0**

**أزيل في: الإصدار v11.7.0**

تمت محاولة تشغيل عملية Node.js بنوع ملف `stdin` غير معروف. عادة ما يكون هذا الخطأ مؤشرًا على وجود خطأ داخل Node.js نفسه، على الرغم من أنه من الممكن أن يقوم كود المستخدم بتشغيله.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**أضيف في: الإصدار v8.0.0**

**أزيل في: الإصدار v11.7.0**

تمت محاولة تشغيل عملية Node.js بنوع ملف `stdout` أو `stderr` غير معروف. عادة ما يكون هذا الخطأ مؤشرًا على وجود خطأ داخل Node.js نفسه، على الرغم من أنه من الممكن أن يقوم كود المستخدم بتشغيله.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

تم استخدام V8 `BreakIterator` API ولكن لم يتم تثبيت مجموعة بيانات ICU الكاملة.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**أضيف في: الإصدار v9.0.0**

**أزيل في: الإصدار v10.0.0**

يستخدم عندما تكون قيمة معينة خارج النطاق المقبول.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**أضيف في: الإصدار v10.0.0**

**أزيل في: الإصدار v18.1.0, v16.17.0**

أرجعت دالة الرابط وحدة نمطية فشل ربطها.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

يجب ربط الوحدة النمطية بنجاح قبل التهيئة.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**أضيف في: الإصدار v11.0.0**

**أزيل في: الإصدار v16.9.0**

يحتوي اسم المسار المستخدم للبرنامج النصي الرئيسي لعامل على امتداد ملف غير معروف.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**أضيف في: الإصدار v9.0.0**

**أزيل في: الإصدار v10.0.0**

يستخدم عند محاولة استخدام كائن `zlib` بعد إغلاقه بالفعل.


## رموز أخطاء OpenSSL {#openssl-error-codes}

### أخطاء صلاحية الوقت {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

الشهادة غير صالحة بعد: تاريخ notBefore بعد الوقت الحالي.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

انتهت صلاحية الشهادة: تاريخ notAfter قبل الوقت الحالي.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

تحتوي قائمة إبطال الشهادات (CRL) على تاريخ إصدار مستقبلي.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

انتهت صلاحية قائمة إبطال الشهادات (CRL).

#### `CERT_REVOKED` {#cert_revoked}

تم إبطال الشهادة؛ وهي موجودة في قائمة إبطال الشهادات (CRL).

### أخطاء متعلقة بالثقة أو السلسلة {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

تعذر العثور على شهادة الجهة المصدرة لشهادة تم البحث عنها. هذا يعني عادةً أن قائمة الشهادات الموثوق بها غير كاملة.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

جهة إصدار الشهادة غير معروفة. هذا هو الحال إذا لم يتم تضمين جهة الإصدار في قائمة الشهادات الموثوق بها.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

الشهادة التي تم تمريرها موقعة ذاتيًا ولا يمكن العثور على نفس الشهادة في قائمة الشهادات الموثوق بها.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

جهة إصدار الشهادة غير معروفة. هذا هو الحال إذا لم يتم تضمين جهة الإصدار في قائمة الشهادات الموثوق بها.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

طول سلسلة الشهادات أكبر من الحد الأقصى للعمق.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

تعذر العثور على مرجع CRL الخاص بالشهادة.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

لا يمكن التحقق من أي توقيعات لأن السلسلة تحتوي على شهادة واحدة فقط وهي ليست موقعة ذاتيًا.

#### `CERT_UNTRUSTED` {#cert_untrusted}

لم يتم وضع علامة على مرجع الشهادة الجذر (CA) على أنه موثوق به للغرض المحدد.

### أخطاء الامتداد الأساسي {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

شهادة CA غير صالحة. إما أنها ليست CA أو أن امتداداتها غير متوافقة مع الغرض المحدد.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

تم تجاوز معلمة pathlength الخاصة بـ basicConstraints.

### أخطاء متعلقة بالاسم {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

لا تتطابق الشهادة مع الاسم المقدم.

### أخطاء الاستخدام والسياسة {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

لا يمكن استخدام الشهادة المقدمة للغرض المحدد.

#### `CERT_REJECTED` {#cert_rejected}

تم وضع علامة على CA الجذر لرفض الغرض المحدد.

### أخطاء التنسيق {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

توقيع الشهادة غير صالح.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

توقيع قائمة إبطال الشهادات (CRL) غير صالح.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

يحتوي حقل notBefore الخاص بالشهادة على وقت غير صالح.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

يحتوي حقل notAfter الخاص بالشهادة على وقت غير صالح.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

يحتوي حقل lastUpdate الخاص بـ CRL على وقت غير صالح.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

يحتوي حقل nextUpdate الخاص بـ CRL على وقت غير صالح.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

تعذر فك تشفير توقيع الشهادة. هذا يعني أنه تعذر تحديد قيمة التوقيع الفعلية بدلاً من عدم تطابقها مع القيمة المتوقعة، وهذا ذو معنى فقط لمفاتيح RSA.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

تعذر فك تشفير توقيع قائمة إبطال الشهادات (CRL): هذا يعني أنه تعذر تحديد قيمة التوقيع الفعلية بدلاً من عدم تطابقها مع القيمة المتوقعة.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

تعذر قراءة المفتاح العام في SubjectPublicKeyInfo الخاص بالشهادة.

### أخطاء OpenSSL أخرى {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

حدث خطأ أثناء محاولة تخصيص الذاكرة. هذا لا ينبغي أن يحدث أبدا.

