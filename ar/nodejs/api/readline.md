---
title: توثيق Node.js - Readline
description: توفر وحدة readline في Node.js واجهة لقراءة البيانات من تدفق قابل للقراءة (مثل process.stdin) سطرًا بسطر. تدعم إنشاء واجهات لقراءة المدخلات من وحدة التحكم، والتعامل مع مدخلات المستخدم، وإدارة العمليات سطرًا بسطر.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة readline في Node.js واجهة لقراءة البيانات من تدفق قابل للقراءة (مثل process.stdin) سطرًا بسطر. تدعم إنشاء واجهات لقراءة المدخلات من وحدة التحكم، والتعامل مع مدخلات المستخدم، وإدارة العمليات سطرًا بسطر.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة readline في Node.js واجهة لقراءة البيانات من تدفق قابل للقراءة (مثل process.stdin) سطرًا بسطر. تدعم إنشاء واجهات لقراءة المدخلات من وحدة التحكم، والتعامل مع مدخلات المستخدم، وإدارة العمليات سطرًا بسطر.
---


# ريدلاين {#readline}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**الكود المصدري:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

توفر الوحدة النمطية `node:readline` واجهة لقراءة البيانات من دفق [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) (مثل [`process.stdin`](/ar/nodejs/api/process#processstdin)) سطرًا واحدًا في كل مرة.

لاستخدام واجهات برمجة التطبيقات المستندة إلى الوعود:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

لاستخدام واجهات برمجة التطبيقات المستندة إلى الاستدعاء المتزامن:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

يوضح المثال البسيط التالي الاستخدام الأساسي للوحدة النمطية `node:readline`.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('ما رأيك في Node.js؟ ');

console.log(`شكرًا لك على ملاحظاتك القيمة: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('ما رأيك في Node.js؟ ', (answer) => {
  // TODO: سجل الإجابة في قاعدة بيانات
  console.log(`شكرًا لك على ملاحظاتك القيمة: ${answer}`);

  rl.close();
});
```
:::

بمجرد استدعاء هذا الكود، لن يتم إنهاء تطبيق Node.js حتى يتم إغلاق `readline.Interface` لأن الواجهة تنتظر استلام البيانات على دفق `input`.

## الصنف: `InterfaceConstructor` {#class-interfaceconstructor}

**تمت الإضافة في: الإصدار 0.1.104**

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يتم إنشاء مثيلات الصنف `InterfaceConstructor` باستخدام الطريقة `readlinePromises.createInterface()` أو الطريقة `readline.createInterface()`. يرتبط كل مثيل بدفق `input` [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) واحد ودفق `output` [قابل للكتابة](/ar/nodejs/api/stream#writable-streams) واحد. يتم استخدام دفق `output` لطباعة مطالبات لإدخال المستخدم الذي يصل على دفق `input` ويتم قراءته منه.


### حدث: `'close'` {#event-close}

**تمت إضافته في: الإصدار v0.1.98**

يتم إطلاق حدث `'close'` عندما يحدث أحد الأمور التالية:

- يتم استدعاء الطريقة `rl.close()` وقد تخلت نسخة `InterfaceConstructor` عن التحكم في تدفقات `input` و `output`.
- يستقبل تدفق `input` حدث `'end'`.
- يستقبل تدفق `input` + للإشارة إلى نهاية الإرسال (EOT).
- يستقبل تدفق `input` + للإشارة إلى `SIGINT` ولا يوجد مستمع حدث `'SIGINT'` مسجل في نسخة `InterfaceConstructor`.

يتم استدعاء دالة المستمع بدون تمرير أي وسائط.

تعتبر نسخة `InterfaceConstructor` منتهية بمجرد إطلاق حدث `'close'`.

### حدث: `'line'` {#event-line}

**تمت إضافته في: الإصدار v0.1.98**

يتم إطلاق حدث `'line'` متى استقبل تدفق `input` مدخلات نهاية السطر (`\n` أو `\r` أو `\r\n`). يحدث هذا عادةً عندما يضغط المستخدم على  أو .

يتم إطلاق حدث `'line'` أيضًا إذا تمت قراءة بيانات جديدة من تدفق وانتهى هذا التدفق بدون علامة نهاية سطر نهائية.

يتم استدعاء دالة المستمع بسلسلة تحتوي على سطر واحد من المدخلات المستلمة.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### حدث: `'history'` {#event-history}

**تمت إضافته في: الإصدار v15.8.0, v14.18.0**

يتم إطلاق حدث `'history'` متى تغيرت مصفوفة السجل.

يتم استدعاء دالة المستمع بمصفوفة تحتوي على مصفوفة السجل. وسوف تعكس جميع التغييرات والخطوط المضافة والخطوط التي تمت إزالتها بسبب `historySize` و `removeHistoryDuplicates`.

الغرض الأساسي هو السماح للمستمع بحفظ السجل. من الممكن أيضًا للمستمع تغيير كائن السجل. قد يكون هذا مفيدًا لمنع إضافة بعض الأسطر إلى السجل، مثل كلمة المرور.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### حدث: `'pause'` {#event-pause}

**تمت إضافته في: الإصدار v0.7.5**

يتم إطلاق حدث `'pause'` عندما يحدث أحد الأمور التالية:

- يتم إيقاف تدفق `input` مؤقتًا.
- تدفق `input` غير متوقف مؤقتًا ويستقبل حدث `'SIGCONT'`. (انظر الأحداث [`'SIGTSTP'`](/ar/nodejs/api/readline#event-sigtstp) و [`'SIGCONT'`](/ar/nodejs/api/readline#event-sigcont).)

يتم استدعاء دالة المستمع بدون تمرير أي وسائط.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### الحدث: `'resume'` {#event-resume}

**أُضيف في: v0.7.5**

يصدر الحدث `'resume'` كلما استؤنف تدفق `input`.

يتم استدعاء دالة المستمع بدون تمرير أي وسائط.

```js [ESM]
rl.on('resume', () => {
  console.log('استؤنف Readline.');
});
```
### الحدث: `'SIGCONT'` {#event-sigcont}

**أُضيف في: v0.7.5**

يصدر الحدث `'SIGCONT'` عندما تنتقل عملية Node.js سابقًا إلى الخلفية باستخدام + (أي `SIGTSTP`) ثم تُعاد إلى المقدمة باستخدام [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p).

إذا كان تدفق `input` متوقفًا *قبل* طلب `SIGTSTP`، فلن يتم إصدار هذا الحدث.

يتم استدعاء دالة المستمع بدون تمرير أي وسائط.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` سيستأنف التدفق تلقائيًا
  rl.prompt();
});
```
الحدث `'SIGCONT'` *غير* مدعوم على نظام التشغيل Windows.

### الحدث: `'SIGINT'` {#event-sigint}

**أُضيف في: v0.3.0**

يصدر الحدث `'SIGINT'` كلما تلقى تدفق `input` إدخال ، يُعرف عادةً باسم `SIGINT`. إذا لم يكن هناك أي مستمعين للأحداث `'SIGINT'` مسجلين عندما يتلقى تدفق `input` إشارة `SIGINT`، فسيتم إصدار الحدث `'pause'`.

يتم استدعاء دالة المستمع بدون تمرير أي وسائط.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('هل أنت متأكد من أنك تريد الخروج؟ ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### الحدث: `'SIGTSTP'` {#event-sigtstp}

**أُضيف في: v0.7.5**

يصدر الحدث `'SIGTSTP'` عندما يتلقى تدفق `input` إدخال +، يُعرف عادةً باسم `SIGTSTP`. إذا لم يكن هناك أي مستمعين للأحداث `'SIGTSTP'` مسجلين عندما يتلقى تدفق `input` إشارة `SIGTSTP`، فسيتم إرسال عملية Node.js إلى الخلفية.

عندما يتم استئناف البرنامج باستخدام [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p)، سيتم إصدار الحدثين `'pause'` و `'SIGCONT'`. يمكن استخدامها لاستئناف تدفق `input`.

لن يتم إصدار الحدثين `'pause'` و `'SIGCONT'` إذا تم إيقاف `input` مؤقتًا قبل إرسال العملية إلى الخلفية.

يتم استدعاء دالة المستمع بدون تمرير أي وسائط.

```js [ESM]
rl.on('SIGTSTP', () => {
  // سيؤدي هذا إلى تجاوز SIGTSTP ومنع البرنامج من الذهاب إلى
  // الخلفية.
  console.log('تم التقاط SIGTSTP.');
});
```
الحدث `'SIGTSTP'` *غير* مدعوم على نظام التشغيل Windows.


### `rl.close()` {#rlclose}

**أضيف في:** v0.1.98

تقوم الطريقة `rl.close()` بإغلاق نسخة `InterfaceConstructor` والتخلي عن التحكم في تدفقات `input` و `output`. عند استدعائها، سيتم إطلاق حدث `'close'`.

لا يؤدي استدعاء `rl.close()` إلى إيقاف الأحداث الأخرى (بما في ذلك `'line'`) الصادرة عن نسخة `InterfaceConstructor` على الفور.

### `rl.pause()` {#rlpause}

**أضيف في:** v0.3.4

تقوم الطريقة `rl.pause()` بإيقاف تدفق `input` مؤقتًا، مما يسمح باستئنافه لاحقًا إذا لزم الأمر.

لا يؤدي استدعاء `rl.pause()` إلى إيقاف الأحداث الأخرى (بما في ذلك `'line'`) الصادرة عن نسخة `InterfaceConstructor` على الفور.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**أضيف في:** v0.1.98

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة `true`، فإنها تمنع إعادة ضبط موضع المؤشر إلى `0`.

تقوم الطريقة `rl.prompt()` بكتابة `prompt` المثيلات التي تم تكوينها لـ `InterfaceConstructor` إلى سطر جديد في `output` لتزويد المستخدم بموقع جديد لتقديم الإدخال.

عند استدعائها، ستستأنف `rl.prompt()` تدفق `input` إذا تم إيقافه مؤقتًا.

إذا تم إنشاء `InterfaceConstructor` مع تعيين `output` إلى `null` أو `undefined`، فلن تتم كتابة المطالبة.

### `rl.resume()` {#rlresume}

**أضيف في:** v0.3.4

تستأنف الطريقة `rl.resume()` تدفق `input` إذا تم إيقافه مؤقتًا.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**أضيف في:** v0.1.98

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `rl.setPrompt()` بتعيين المطالبة التي ستتم كتابتها إلى `output` عند استدعاء `rl.prompt()`.

### `rl.getPrompt()` {#rlgetprompt}

**أضيف في:** v15.3.0, v14.17.0

- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة المطالبة الحالية

تقوم الطريقة `rl.getPrompt()` بإرجاع المطالبة الحالية المستخدمة بواسطة `rl.prompt()`.

### `rl.write(data[, key])` {#rlwritedata-key}

**أضيف في:** v0.1.98

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` للإشارة إلى المفتاح .
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` للإشارة إلى المفتاح .
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` للإشارة إلى المفتاح .
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المفتاح.



ستكتب الطريقة `rl.write()` إما `data` أو تسلسل مفاتيح تم تحديده بواسطة `key` إلى `output`. يتم دعم وسيطة `key` فقط إذا كان `output` عبارة عن طرفية نصية [TTY](/ar/nodejs/api/tty). انظر [ربط مفاتيح TTY](/ar/nodejs/api/readline#tty-keybindings) للحصول على قائمة بمجموعات المفاتيح.

إذا تم تحديد `key`، فسيتم تجاهل `data`.

عند استدعائها، ستستأنف `rl.write()` تدفق `input` إذا تم إيقافه مؤقتًا.

إذا تم إنشاء `InterfaceConstructor` مع تعيين `output` إلى `null` أو `undefined`، فلن تتم كتابة `data` و `key`.

```js [ESM]
rl.write('Delete this!');
// Simulate Ctrl+U to delete the line written previously
rl.write(null, { ctrl: true, name: 'u' });
```
ستكتب الطريقة `rl.write()` البيانات إلى `input` الخاص بـ `Interface` الخاص بـ `readline` *كما لو تم توفيرها من قبل المستخدم*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.14.0, v10.17.0 | لم يعد دعم Symbol.asyncIterator تجريبيًا. |
| v11.4.0, v10.16.0 | تمت إضافته في: v11.4.0, v10.16.0 |
:::

- الإرجاع: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

قم بإنشاء كائن `AsyncIterator` يتكرر عبر كل سطر في دفق الإدخال كسلسلة. تسمح هذه الطريقة بالتكرار غير المتزامن لكائنات `InterfaceConstructor` من خلال حلقات `for await...of`.

لا يتم إعادة توجيه الأخطاء في دفق الإدخال.

إذا تم إنهاء الحلقة بـ `break` أو `throw` أو `return`، فسيتم استدعاء [`rl.close()`](/ar/nodejs/api/readline#rlclose). بمعنى آخر، فإن التكرار عبر `InterfaceConstructor` سيستهلك دائمًا دفق الإدخال بالكامل.

الأداء ليس على قدم المساواة مع واجهة برمجة التطبيقات التقليدية لحدث `'line'`. استخدم `'line'` بدلاً من ذلك للتطبيقات الحساسة للأداء.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // سيكون كل سطر في إدخال readline متاحًا هنا تباعًا كـ
    // `line`.
  }
}
```
سيبدأ `readline.createInterface()` في استهلاك دفق الإدخال بمجرد استدعائه. قد يؤدي وجود عمليات غير متزامنة بين إنشاء الواجهة والتكرار غير المتزامن إلى فقدان الأسطر.

### `rl.line` {#rlline}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.8.0, v14.18.0 | ستكون القيمة دائمًا سلسلة، وليست غير معرّفة أبدًا. |
| v0.1.98 | تمت إضافته في: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

بيانات الإدخال الحالية التي تتم معالجتها بواسطة node.

يمكن استخدام هذا عند جمع الإدخال من دفق TTY لاسترداد القيمة الحالية التي تمت معالجتها حتى الآن، قبل انبعاث حدث `line`. بمجرد انبعاث حدث `line`، سيكون هذا الخاصية سلسلة فارغة.

انتبه إلى أن تعديل القيمة أثناء وقت تشغيل المثيل قد يكون له عواقب غير مقصودة إذا لم يتم التحكم في `rl.cursor` أيضًا.

**إذا كنت لا تستخدم دفق TTY للإدخال، فاستخدم <a href="#event-line">حدث <code>'line'</code></a>.**

يمكن أن تكون إحدى حالات الاستخدام الممكنة كما يلي:

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**تمت إضافته في: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

موضع المؤشر بالنسبة إلى `rl.line`.

سيتتبع هذا المكان الذي يهبط فيه المؤشر الحالي في سلسلة الإدخال، عند قراءة الإدخال من دفق TTY. يحدد موضع المؤشر الجزء من سلسلة الإدخال الذي سيتم تعديله أثناء معالجة الإدخال، بالإضافة إلى العمود الذي سيتم فيه عرض علامة الإقحام الطرفية.

### `rl.getCursorPos()` {#rlgetcursorpos}

**تمت إضافته في: v13.5.0, v12.16.0**

- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) صف المطالبة الذي يهبط عليه المؤشر حاليًا
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عمود الشاشة الذي يهبط عليه المؤشر حاليًا
  
 

إرجاع الموضع الحقيقي للمؤشر بالنسبة إلى مطالبة الإدخال + السلسلة. يتم تضمين سلاسل الإدخال الطويلة (الالتفاف)، بالإضافة إلى مطالبات الأسطر المتعددة في العمليات الحسابية.

## واجهة برمجة تطبيقات الوعود (Promises API) {#promises-api}

**تمت إضافته في: v17.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

### الفئة: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**تمت إضافته في: v17.0.0**

- يمتد: [\<readline.InterfaceConstructor\>](/ar/nodejs/api/readline#class-interfaceconstructor)

يتم إنشاء مثيلات الفئة `readlinePromises.Interface` باستخدام الطريقة `readlinePromises.createInterface()`. يرتبط كل مثيل بدفق `input` [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) واحد ودفق `output` [قابل للكتابة](/ar/nodejs/api/stream#writable-streams) واحد. يتم استخدام دفق `output` لطباعة مطالبات لإدخال المستخدم الذي يصل على دفق `input` ويتم قراءته منه.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**تمت الإضافة في: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عبارة أو استعلام للكتابة إلى `output`، وتضاف قبل الموجه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح اختيارياً بإلغاء `question()` باستخدام `AbortSignal`.


- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد يتم تحقيقه بإدخال المستخدم استجابةً لـ `query`.

تعرض طريقة `rl.question()` قيمة `query` عن طريق كتابتها إلى `output`، وتنتظر إدخال المستخدم ليتم تقديمه على `input`، ثم تستدعي وظيفة `callback` بتمرير الإدخال المقدم كوسيطة أولى.

عند استدعائها، ستستأنف `rl.question()` دفق `input` إذا كان قد تم إيقافه مؤقتًا.

إذا تم إنشاء `readlinePromises.Interface` مع تعيين `output` إلى `null` أو `undefined`، فلن تتم كتابة `query`.

إذا تم استدعاء السؤال بعد `rl.close()`، فإنه يُرجع وعدًا مرفوضًا.

مثال على الاستخدام:

```js [ESM]
const answer = await rl.question('What is your favorite food? ');
console.log(`Oh, so your favorite food is ${answer}`);
```
استخدام `AbortSignal` لإلغاء سؤال.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

const answer = await rl.question('What is your favorite food? ', { signal });
console.log(`Oh, so your favorite food is ${answer}`);
```
### Class: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**تمت الإضافة في: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**تمت الإضافة في: v17.0.0**

- `stream` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) دفق [TTY](/ar/nodejs/api/tty).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فلا حاجة لاستدعاء `rl.commit()`.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**تمت الإضافة في: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: إلى اليسار من المؤشر
    - `1`: إلى اليمين من المؤشر
    - `0`: السطر بأكمله
  
 
- إرجاع: هذا

تضيف الطريقة `rl.clearLine()` إلى القائمة الداخلية للإجراءات المعلقة إجراءً يمسح السطر الحالي لـ `stream` المرتبط في اتجاه محدد بواسطة `dir`. قم باستدعاء `rl.commit()` لرؤية تأثير هذه الطريقة، إلا إذا تم تمرير `autoCommit: true` إلى الدالة البانية.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**تمت الإضافة في: v17.0.0**

- إرجاع: هذا

تضيف الطريقة `rl.clearScreenDown()` إلى القائمة الداخلية للإجراءات المعلقة إجراءً يمسح الدفق المرتبط من الموضع الحالي للمؤشر إلى الأسفل. قم باستدعاء `rl.commit()` لرؤية تأثير هذه الطريقة، إلا إذا تم تمرير `autoCommit: true` إلى الدالة البانية.

#### `rl.commit()` {#rlcommit}

**تمت الإضافة في: v17.0.0**

- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ترسل الطريقة `rl.commit()` جميع الإجراءات المعلقة إلى `stream` المرتبط وتمسح القائمة الداخلية للإجراءات المعلقة.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**تمت الإضافة في: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- إرجاع: هذا

تضيف الطريقة `rl.cursorTo()` إلى القائمة الداخلية للإجراءات المعلقة إجراءً ينقل المؤشر إلى الموضع المحدد في `stream` المرتبط. قم باستدعاء `rl.commit()` لرؤية تأثير هذه الطريقة، إلا إذا تم تمرير `autoCommit: true` إلى الدالة البانية.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**تمت الإضافة في: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- إرجاع: هذا

تضيف الطريقة `rl.moveCursor()` إلى القائمة الداخلية للإجراءات المعلقة إجراءً ينقل المؤشر *بالنسبة* إلى موضعه الحالي في `stream` المرتبط. قم باستدعاء `rl.commit()` لرؤية تأثير هذه الطريقة، إلا إذا تم تمرير `autoCommit: true` إلى الدالة البانية.


#### `rl.rollback()` {#rlrollback}

**تمت الإضافة في: v17.0.0**

- إرجاع: هذا

تقوم طريقة `rl.rollback` بمسح القائمة الداخلية للإجراءات المعلقة دون إرسالها إلى `stream` المرتبط.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**تمت الإضافة في: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) دفق [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) للاستماع إليه. هذا الخيار *مطلوب*.
    - `output` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) دفق [قابل للكتابة](/ar/nodejs/api/stream#writable-streams) لكتابة بيانات readline إليه.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة اختيارية تستخدم للإكمال التلقائي للعلامة Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان يجب التعامل مع تدفقات `input` و `output` كـ TTY، وكتابة رموز الهروب ANSI/VT100 إليها. **افتراضي:** التحقق من `isTTY` على دفق `output` عند إنشاء المثيل.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة أولية بأسطر المحفوظات. هذا الخيار منطقي فقط إذا تم تعيين `terminal` على `true` من قبل المستخدم أو عن طريق فحص `output` داخلي، وإلا فإن آلية التخزين المؤقت للمحفوظات لا يتم تهيئتها على الإطلاق. **افتراضي:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد أسطر المحفوظات المحتفظ بها. لتعطيل المحفوظات، اضبط هذه القيمة على `0`. هذا الخيار منطقي فقط إذا تم تعيين `terminal` على `true` من قبل المستخدم أو عن طريق فحص `output` داخلي، وإلا فإن آلية التخزين المؤقت للمحفوظات لا يتم تهيئتها على الإطلاق. **افتراضي:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فعندما يكرر سطر إدخال جديد يضاف إلى قائمة المحفوظات سطرًا أقدم، فسيؤدي ذلك إلى إزالة السطر الأقدم من القائمة. **افتراضي:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة المطالبة المراد استخدامها. **افتراضي:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تجاوز التأخير بين `\r` و `\n` عدد `crlfDelay` من المللي ثانية، فسيتم التعامل مع كل من `\r` و `\n` كإدخال منفصل لنهاية السطر. سيتم إجبار `crlfDelay` على رقم لا يقل عن `100`. يمكن تعيينه على `Infinity`، وفي هذه الحالة سيتم دائمًا اعتبار `\r` متبوعة بـ `\n` كسطر جديد واحد (والذي قد يكون معقولًا [لقراءة الملفات](/ar/nodejs/api/readline#example-read-file-stream-line-by-line) مع محدد السطر `\r\n`). **افتراضي:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المدة التي ستنتظرها `readlinePromises` لحرف (عند قراءة تسلسل مفاتيح غامض بالمللي ثانية وهو تسلسل يمكن أن يشكل تسلسل مفاتيح كامل باستخدام الإدخال الذي تمت قراءته حتى الآن ويمكن أن يأخذ إدخالًا إضافيًا لإكمال تسلسل مفاتيح أطول). **افتراضي:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المسافات التي تساويها علامة التبويب (الحد الأدنى 1). **افتراضي:** `8`.


- إرجاع: [\<readlinePromises.Interface\>](/ar/nodejs/api/readline#class-readlinepromisesinterface)

تقوم طريقة `readlinePromises.createInterface()` بإنشاء مثيل `readlinePromises.Interface` جديد.



::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

بمجرد إنشاء مثيل `readlinePromises.Interface`، فإن الحالة الأكثر شيوعًا هي الاستماع إلى حدث `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
إذا كانت `terminal` هي `true` لهذا المثيل، فسيكون دفق `output` متوافقًا بشكل أفضل إذا حدد خاصية `output.columns` وأصدر حدث `'resize'` على `output` إذا أو عندما تتغير الأعمدة على الإطلاق ([`process.stdout`](/ar/nodejs/api/process#processstdout) يفعل ذلك تلقائيًا عندما يكون TTY).


#### استخدام وظيفة `completer` {#use-of-the-completer-function}

تأخذ وظيفة `completer` السطر الحالي الذي أدخله المستخدم كوسيطة، وتعيد `Array` (مصفوفة) مع مدخلين:

- `Array` (مصفوفة) مع إدخالات مطابقة للإكمال.
- السلسلة الفرعية التي استخدمت للمطابقة.

على سبيل المثال: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // إظهار جميع عمليات الإكمال إذا لم يتم العثور على أي منها
  return [hits.length ? hits : completions, line];
}
```
يمكن لوظيفة `completer` أيضًا إرجاع [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)، أو أن تكون غير متزامنة:

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## واجهة برمجة تطبيقات رد النداء (Callback API) {#callback-api}

**أُضيفت في: v0.1.104**

### الفئة: `readline.Interface` {#class-readlineinterface}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.0.0 | ترث الفئة `readline.Interface` الآن من `Interface`. |
| v0.1.104 | أُضيفت في: v0.1.104 |
:::

- يمتد: [\<readline.InterfaceConstructor\>](/ar/nodejs/api/readline#class-interfaceconstructor)

يتم إنشاء مثيلات الفئة `readline.Interface` باستخدام طريقة `readline.createInterface()`. يرتبط كل مثيل بدفق `input` [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) واحد ودفق `output` [قابل للكتابة](/ar/nodejs/api/stream#writable-streams) واحد. يُستخدم دفق `output` لطباعة مطالبات لإدخال المستخدم الذي يصل على دفق `input` ويتم قراءته منه.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**أُضيفت في: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عبارة أو استعلام للكتابة إلى `output`، تسبق المطالبة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح اختيارياً بإلغاء `question()` باستخدام `AbortController`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء يتم استدعاؤها بإدخال المستخدم استجابةً لـ `query`.

تعرض طريقة `rl.question()` الـ `query` عن طريق كتابتها إلى `output`، وتنتظر حتى يتم توفير إدخال المستخدم على `input`، ثم تستدعي دالة `callback` وتمرر الإدخال المقدم كأول وسيطة.

عند استدعاء `rl.question()`، فإنه سيستأنف دفق `input` إذا كان قد تم إيقافه مؤقتًا.

إذا تم إنشاء `readline.Interface` مع تعيين `output` إلى `null` أو `undefined`، فلن تتم كتابة `query`.

لا تتبع دالة `callback` التي تم تمريرها إلى `rl.question()` النمط النموذجي لقبول كائن `Error` أو `null` كوسيطة أولى. يتم استدعاء `callback` بالإجابة المقدمة كوسيطة وحيدة.

سيتم طرح خطأ إذا تم استدعاء `rl.question()` بعد `rl.close()`.

مثال على الاستخدام:

```js [ESM]
rl.question('What is your favorite food? ', (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});
```
استخدام `AbortController` لإلغاء سؤال.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('What is your favorite food? ', { signal }, (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.7.0 | تم عرض رد نداء `write()` وقيمة الإرجاع للتدفق. |
| v0.7.7 | أضيف في: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: إلى اليسار من المؤشر
    - `1`: إلى اليمين من المؤشر
    - `0`: السطر بأكمله


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه بمجرد اكتمال العملية.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`false` إذا كان `stream` يرغب في أن ينتظر رمز الاستدعاء حتى يتم إطلاق حدث `'drain'` قبل المتابعة لكتابة بيانات إضافية؛ وإلا `true`.

تقوم الطريقة `readline.clearLine()` بمسح السطر الحالي لتدفق [TTY](/ar/nodejs/api/tty) المحدد في اتجاه محدد تم تحديده بواسطة `dir`.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.7.0 | تم عرض رد نداء `write()` وقيمة الإرجاع للتدفق. |
| v0.7.7 | أضيف في: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه بمجرد اكتمال العملية.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`false` إذا كان `stream` يرغب في أن ينتظر رمز الاستدعاء حتى يتم إطلاق حدث `'drain'` قبل المتابعة لكتابة بيانات إضافية؛ وإلا `true`.

تقوم الطريقة `readline.clearScreenDown()` بمسح تدفق [TTY](/ar/nodejs/api/tty) المحدد من الموضع الحالي للمؤشر لأسفل.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v15.14.0, v14.18.0 | خيار `signal` مدعوم الآن. |
| v15.8.0, v14.18.0 | خيار `history` مدعوم الآن. |
| v13.9.0 | خيار `tabSize` مدعوم الآن. |
| v8.3.0, v6.11.4 | إزالة الحد الأقصى لخيار `crlfDelay`. |
| v6.6.0 | خيار `crlfDelay` مدعوم الآن. |
| v6.3.0 | خيار `prompt` مدعوم الآن. |
| v6.0.0 | يمكن أن يكون خيار `historySize` الآن `0`. |
| v0.1.98 | تمت إضافته في: v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `input` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) تدفق [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) للاستماع إليه. هذا الخيار *إلزامي*.
    - `output` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) تدفق [قابل للكتابة](/ar/nodejs/api/stream#writable-streams) لكتابة بيانات readline إليه.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة اختيارية تستخدم للإكمال التلقائي بواسطة Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كان يجب التعامل مع تدفقات `input` و`output` كـ TTY، وكتابة رموز الهروب ANSI/VT100 إليها. **الافتراضي:** التحقق من `isTTY` على تدفق `output` عند الإنشاء.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة أولية بأسطر السجل. هذا الخيار منطقي فقط إذا تم تعيين `terminal` على `true` من قبل المستخدم أو عن طريق فحص `output` داخلي، وإلا فلن يتم تهيئة آلية التخزين المؤقت للسجل على الإطلاق. **الافتراضي:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد أسطر السجل المحفوظة. لتعطيل السجل، عيّن هذه القيمة على `0`. هذا الخيار منطقي فقط إذا تم تعيين `terminal` على `true` من قبل المستخدم أو عن طريق فحص `output` داخلي، وإلا فلن يتم تهيئة آلية التخزين المؤقت للسجل على الإطلاق. **الافتراضي:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة `true`، فعند إضافة سطر إدخال جديد إلى قائمة السجل يكرر سطرًا أقدم، فسيؤدي ذلك إلى إزالة السطر الأقدم من القائمة. **الافتراضي:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة المطالبة التي سيتم استخدامها. **الافتراضي:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تجاوز التأخير بين `\r` و`\n` مللي ثانية `crlfDelay`، فسيتم التعامل مع كل من `\r` و`\n` كإدخال منفصل لنهاية السطر. سيتم إجبار `crlfDelay` على رقم لا يقل عن `100`. يمكن تعيينه على `Infinity`، وفي هذه الحالة سيتم دائمًا اعتبار `\r` متبوعة بـ `\n` سطراً جديداً واحداً (والذي قد يكون معقولاً لـ [قراءة الملفات](/ar/nodejs/api/readline#example-read-file-stream-line-by-line) باستخدام فاصل الأسطر `\r\n`). **الافتراضي:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المدة التي سينتظرها `readline` للحصول على حرف (عند قراءة تسلسل مفاتيح غامض بالمللي ثانية وهو تسلسل يمكن أن يشكل تسلسل مفاتيح كاملاً باستخدام الإدخال الذي تمت قراءته حتى الآن ويمكن أن يأخذ إدخالاً إضافيًا لإكمال تسلسل مفاتيح أطول). **الافتراضي:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المسافات التي تساويها علامة التبويب (الحد الأدنى 1). **الافتراضي:** `8`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإغلاق الواجهة باستخدام AbortSignal. سيؤدي إلغاء الإشارة إلى استدعاء `close` داخليًا على الواجهة.
  
 
- Returns: [\<readline.Interface\>](/ar/nodejs/api/readline#class-readlineinterface)

ينشئ الأسلوب `readline.createInterface()` مثيلاً جديدًا لـ `readline.Interface`.



::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

بمجرد إنشاء مثيل `readline.Interface`، فإن الحالة الأكثر شيوعًا هي الاستماع إلى حدث `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
إذا كانت `terminal` هي `true` لهذا المثيل، فسيحصل تدفق `output` على أفضل توافق إذا كان يحدد خاصية `output.columns` ويصدر حدث `'resize'` على `output` إذا أو عندما تتغير الأعمدة ([`process.stdout`](/ar/nodejs/api/process#processstdout) يفعل ذلك تلقائيًا عندما يكون TTY).

عند إنشاء `readline.Interface` باستخدام `stdin` كإدخال، لن يتم إنهاء البرنامج حتى يتلقى [حرف EOF](https://en.wikipedia.org/wiki/End-of-file#EOF_character). للخروج دون انتظار إدخال المستخدم، قم باستدعاء `process.stdin.unref()`.


#### استخدام وظيفة `completer` {#use-of-the-completer-function_1}

تأخذ وظيفة `completer` السطر الحالي الذي أدخله المستخدم كحجة، وتعيد `Array` مع مدخلين:

- `Array` مع إدخالات مطابقة للإكمال.
- السلسلة الفرعية التي تم استخدامها للمطابقة.

على سبيل المثال: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```
يمكن استدعاء وظيفة `completer` بشكل غير متزامن إذا كانت تقبل وسيطتين:

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير استدعاء غير صالح إلى وسيطة `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.7.0 | يتم الآن كشف رد الاتصال والقيمة المرجعية لـ stream's write(). |
| v0.7.7 | تمت الإضافة في: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه بمجرد اكتمال العملية.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` إذا كان `stream` يرغب في أن ينتظر رمز الاستدعاء حتى يتم إصدار حدث `'drain'` قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

تنقل طريقة `readline.cursorTo()` المؤشر إلى الموضع المحدد في [TTY](/ar/nodejs/api/tty) `stream` معين.

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير استدعاء غير صالح إلى وسيطة `callback` الآن إلى طرح `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v12.7.0 | يتم الآن كشف رد الاتصال والقيمة المرجعية لـ stream's write(). |
| v0.7.7 | تمت الإضافة في: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه بمجرد اكتمال العملية.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` إذا كان `stream` يرغب في أن ينتظر رمز الاستدعاء حتى يتم إصدار حدث `'drain'` قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

تنقل طريقة `readline.moveCursor()` المؤشر *بالنسبة* إلى موضعه الحالي في [TTY](/ar/nodejs/api/tty) `stream` معين.


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**أُضيف في: الإصدار v0.7.7**

- `stream` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/ar/nodejs/api/readline#class-interfaceconstructor)

يؤدي استدعاء التابع `readline.emitKeypressEvents()` إلى بدء بث تدفق [قابل للقراءة](/ar/nodejs/api/stream#readable-streams) معطى لأحداث `'keypress'` المقابلة للإدخال المستلم.

اختياريًا، تحدد `interface` نسخة `readline.Interface` يتم تعطيل الإكمال التلقائي لها عند اكتشاف إدخال تم نسخه ولصقه.

إذا كان `stream` عبارة عن [TTY](/ar/nodejs/api/tty)، فيجب أن يكون في الوضع الخام.

يتم استدعاء هذا تلقائيًا بواسطة أي نسخة readline على `input` الخاصة بها إذا كان `input` عبارة عن طرفية. إغلاق نسخة `readline` لا يمنع `input` من بث أحداث `'keypress'`.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## مثال: واجهة سطر أوامر صغيرة {#example-tiny-cli}

يوضح المثال التالي استخدام فئة `readline.Interface` لتنفيذ واجهة سطر أوامر صغيرة:

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## مثال: قراءة دفق ملف سطراً سطراً {#example-read-file-stream-line-by-line}

من الحالات الشائعة لاستخدام `readline` هو استهلاك ملف إدخال سطراً واحداً في كل مرة. أسهل طريقة للقيام بذلك هي الاستفادة من واجهة برمجة التطبيقات [`fs.ReadStream`](/ar/nodejs/api/fs#class-fsreadstream) بالإضافة إلى حلقة `for await...of`:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```
:::

بدلاً من ذلك، يمكن للمرء استخدام الحدث [`'line'`](/ar/nodejs/api/readline#event-line):

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
:::

حاليًا، يمكن أن تكون حلقة `for await...of` أبطأ قليلاً. إذا كان تدفق `async` / `await` والسرعة كلاهما ضروريين، فيمكن تطبيق نهج مختلط:

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::

## ارتباطات المفاتيح TTY {#tty-keybindings}

| ارتباطات المفاتيح | الوصف | ملاحظات |
| --- | --- | --- |
|   +    +   | حذف السطر إلى اليسار | لا يعمل على Linux و Mac و Windows |
|   +    +   | حذف السطر إلى اليمين | لا يعمل على Mac |
|   +   | إصدار   `SIGINT`   أو إغلاق مثيل readline ||
|   +   | حذف إلى اليسار ||
|   +   | حذف إلى اليمين أو إغلاق مثيل readline في حال كان السطر الحالي فارغًا / EOF | لا يعمل على Windows |
|   +   | حذف من الموضع الحالي إلى بداية السطر ||
|   +   | حذف من الموضع الحالي إلى نهاية السطر ||
|   +   | سحب (استعادة) النص المحذوف مسبقًا | يعمل فقط مع النص المحذوف بواسطة     +     أو     +   |
|   +   | التنقل بين النصوص المحذوفة مسبقًا | متاح فقط عندما يكون آخر ضغطة مفتاح هي     +     أو     +   |
|   +   | الانتقال إلى بداية السطر ||
|   +   | الانتقال إلى نهاية السطر ||
|   +   | الرجوع حرفًا واحدًا ||
|   +   | التقدم حرفًا واحدًا ||
|   +   | مسح الشاشة ||
|   +   | العنصر التالي في السجل ||
|   +   | العنصر السابق في السجل ||
|   +   | التراجع عن التغيير السابق | أي ضغطة مفتاح تصدر رمز المفتاح   `0x1F`   ستقوم بهذا الإجراء.     في العديد من المحطات الطرفية، على سبيل المثال   `xterm`  ،     يرتبط هذا بـ     +    . |
|   +   | إعادة التغيير السابق | لا تحتوي العديد من المحطات الطرفية على ضغطة مفتاح افتراضية لإعادة التنفيذ.     نختار رمز المفتاح   `0x1E`   لتنفيذ إعادة التنفيذ.     في   `xterm`  ، يتم ربطه بـ     +         بشكل افتراضي. |
|   +   | نقل العملية الجارية إلى الخلفية. اكتب       `fg`   واضغط          للعودة. | لا يعمل على Windows |
|   +     أو         +   | حذف للخلف إلى حدود الكلمات |   +     لا يعمل     على Linux و Mac و Windows |
|   +   | حذف للأمام إلى حدود الكلمات | لا يعمل على Mac |
|   +     أو         +   | كلمة إلى اليسار |   +     لا يعمل     على Mac |
|   +     أو         +   | كلمة إلى اليمين |   +     لا يعمل     على Mac |
|   +     أو         +   | حذف كلمة إلى اليمين |   +     لا يعمل     على Windows |
|   +   | حذف كلمة إلى اليسار | لا يعمل على Mac |

