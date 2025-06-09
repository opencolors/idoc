---
title: توثيق Node.js - REPL
description: استكشف Node.js REPL (حلقة القراءة والتقييم والطباعة) التي توفر بيئة تفاعلية لتنفيذ كود JavaScript، وتصحيح الأخطاء، واختبار تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - REPL | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف Node.js REPL (حلقة القراءة والتقييم والطباعة) التي توفر بيئة تفاعلية لتنفيذ كود JavaScript، وتصحيح الأخطاء، واختبار تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - REPL | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف Node.js REPL (حلقة القراءة والتقييم والطباعة) التي توفر بيئة تفاعلية لتنفيذ كود JavaScript، وتصحيح الأخطاء، واختبار تطبيقات Node.js.
---


# REPL {#repl}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

توفر وحدة `node:repl` تطبيق حلقة قراءة-تقييم-طباعة (REPL) وهو متاح كبرنامج مستقل أو يمكن تضمينه في تطبيقات أخرى. يمكن الوصول إليه باستخدام:



::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## التصميم والميزات {#design-and-features}

تقوم وحدة `node:repl` بتصدير الفئة [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver). أثناء التشغيل، ستقبل مثيلات [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver) سطورًا فردية من إدخال المستخدم، وتقوم بتقييمها وفقًا لوظيفة تقييم معرفة من قبل المستخدم، ثم تعرض النتيجة. قد يكون الإدخال والإخراج من `stdin` و `stdout`، على التوالي، أو قد يتم توصيلهما بأي [تدفق](/ar/nodejs/api/stream) Node.js.

تدعم مثيلات [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver) الإكمال التلقائي للإدخالات، ومعاينة الإكمال، وتحرير الأسطر البسيط على غرار Emacs، والإدخالات متعددة الأسطر، والبحث العكسي الشبيه بـ [ZSH](https://en.wikipedia.org/wiki/Z_shell)، والبحث في السجل المستند إلى السلسلة الفرعية الشبيه بـ [ZSH](https://en.wikipedia.org/wiki/Z_shell)، والإخراج بنمط ANSI، وحفظ واستعادة حالة جلسة REPL الحالية، واستعادة الأخطاء، ووظائف التقييم القابلة للتخصيص. تعود المحطات الطرفية التي لا تدعم أنماط ANSI وتحرير الأسطر على غرار Emacs تلقائيًا إلى مجموعة ميزات محدودة.

### الأوامر والمفاتيح الخاصة {#commands-and-special-keys}

الأوامر الخاصة التالية مدعومة من قبل جميع مثيلات REPL:

- `.break`: عند إدخال تعبير متعدد الأسطر، أدخل الأمر `.break` (أو اضغط على +) لإحباط المزيد من الإدخال أو معالجة هذا التعبير.
- `.clear`: يعيد تعيين `context` REPL إلى كائن فارغ ويمسح أي تعبير متعدد الأسطر يتم إدخاله.
- `.exit`: أغلق تدفق الإدخال/الإخراج، مما يتسبب في خروج REPL.
- `.help`: إظهار هذه القائمة من الأوامر الخاصة.
- `.save`: احفظ جلسة REPL الحالية في ملف: `\> .save ./file/to/save.js`
- `.load`: قم بتحميل ملف في جلسة REPL الحالية. `\> .load ./file/to/load.js`
- `.editor`: أدخل وضع المحرر (+ للإنهاء، + للإلغاء).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
تركيبات المفاتيح التالية في REPL لها هذه التأثيرات الخاصة:

- +: عند الضغط عليها مرة واحدة، يكون لها نفس تأثير الأمر `.break`. عند الضغط عليها مرتين على سطر فارغ، يكون لها نفس تأثير الأمر `.exit`.
- +: له نفس تأثير الأمر `.exit`.
- : عند الضغط عليها على سطر فارغ، تعرض المتغيرات العالمية والمحلية (النطاق). عند الضغط عليها أثناء إدخال مدخلات أخرى، تعرض خيارات الإكمال التلقائي ذات الصلة.

للحصول على ارتباطات المفاتيح المتعلقة بالبحث العكسي، انظر [`reverse-i-search`](/ar/nodejs/api/repl#reverse-i-search). لجميع ارتباطات المفاتيح الأخرى، انظر [ارتباطات مفاتيح TTY](/ar/nodejs/api/readline#tty-keybindings).


### التقييم الافتراضي {#default-evaluation}

بشكل افتراضي، تستخدم جميع مثيلات [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver) دالة تقييم تقوم بتقييم تعبيرات JavaScript وتوفر الوصول إلى وحدات Node.js المضمنة. يمكن تجاوز هذا السلوك الافتراضي عن طريق تمرير دالة تقييم بديلة عند إنشاء مثيل [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver).

#### تعبيرات JavaScript {#javascript-expressions}

يدعم المقيم الافتراضي التقييم المباشر لتعبيرات JavaScript:

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
ما لم يتم تحديد نطاقها ضمن كتل أو وظائف، يتم تعريف المتغيرات المعلنة ضمنيًا أو باستخدام الكلمات الرئيسية `const` أو `let` أو `var` في النطاق العام.

#### النطاق العام والمحلي {#global-and-local-scope}

يوفر المقيم الافتراضي الوصول إلى أي متغيرات موجودة في النطاق العام. من الممكن كشف متغير إلى REPL بشكل صريح عن طريق تعيينه إلى كائن `context` المرتبط بكل `REPLServer`:



::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

تظهر الخصائص الموجودة في كائن `context` كمحلية داخل REPL:

```bash [BASH]
$ node repl_test.js
> m
'message'
```
خصائص السياق ليست للقراءة فقط بشكل افتراضي. لتحديد المتغيرات العامة للقراءة فقط، يجب تحديد خصائص السياق باستخدام `Object.defineProperty()`:



::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### الوصول إلى وحدات Node.js الأساسية {#accessing-core-nodejs-modules}

سيقوم المقيم الافتراضي تلقائيًا بتحميل وحدات Node.js الأساسية في بيئة REPL عند استخدامها. على سبيل المثال، ما لم يتم الإعلان عن خلاف ذلك كمتغير عام أو ذي نطاق، فسيتم تقييم الإدخال `fs` عند الطلب كـ `global.fs = require('node:fs')`.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### الاستثناءات العامة غير الملتقطة {#global-uncaught-exceptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 12.3.0 | يتم تشغيل حدث `'uncaughtException'` من الآن فصاعدًا إذا تم استخدام REPL كبرنامج مستقل. |
:::

يستخدم REPL الوحدة النمطية [`domain`](/ar/nodejs/api/domain) لالتقاط جميع الاستثناءات غير الملتقطة لجلسة REPL تلك.

لاستخدام الوحدة النمطية [`domain`](/ar/nodejs/api/domain) في REPL هذه الآثار الجانبية:

-  تطلق الاستثناءات غير الملتقطة فقط حدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception) في REPL المستقل. إضافة مستمع لهذا الحدث في REPL داخل برنامج Node.js آخر يؤدي إلى [`ERR_INVALID_REPL_INPUT`](/ar/nodejs/api/errors#err_invalid_repl_input).  
-  محاولة استخدام [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) يطلق خطأ [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/ar/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture). 

#### تعيين المتغير `_` (تسطير سفلي) {#assignment-of-the-_-underscore-variable}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 9.8.0 | تمت إضافة دعم `_error`. |
:::

سيقوم المقيم الافتراضي، بشكل افتراضي، بتعيين نتيجة آخر تعبير تم تقييمه للمتغير الخاص `_` (تسطير سفلي). سيؤدي تعيين `_` بشكل صريح لقيمة ما إلى تعطيل هذا السلوك.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```
وبالمثل، سيشير `_error` إلى آخر خطأ تمت رؤيته، إذا كان هناك أي خطأ. سيؤدي تعيين `_error` بشكل صريح لقيمة ما إلى تعطيل هذا السلوك.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### الكلمة المفتاحية `await` {#await-keyword}

يتم تمكين دعم الكلمة المفتاحية `await` في المستوى الأعلى.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
أحد القيود المعروفة لاستخدام الكلمة المفتاحية `await` في REPL هو أنها ستبطل النطاق المعجمي للكلمات المفتاحية `const` و `let`.

على سبيل المثال:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/ar/nodejs/api/cli#--no-experimental-repl-await) يجب أن يعطل انتظار المستوى الأعلى في REPL.


### البحث العكسي التزايدي {#reverse-i-search}

**تمت الإضافة في: v13.6.0، v12.17.0**

يدعم REPL البحث العكسي التزايدي ثنائي الاتجاه على غرار [ZSH](https://en.wikipedia.org/wiki/Z_shell). يتم تشغيله باستخدام + للبحث للخلف و + للبحث للأمام.

سيتم تخطي إدخالات السجل المكررة.

يتم قبول الإدخالات بمجرد الضغط على أي مفتاح لا يتوافق مع البحث العكسي. الإلغاء ممكن بالضغط على أو +.

يؤدي تغيير الاتجاه على الفور إلى البحث عن الإدخال التالي في الاتجاه المتوقع من الموضع الحالي.

### وظائف التقييم المخصصة {#custom-evaluation-functions}

عند إنشاء [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver) جديد، يمكن توفير وظيفة تقييم مخصصة. يمكن استخدام هذا، على سبيل المثال، لتنفيذ تطبيقات REPL مخصصة بالكامل.

يوضح ما يلي مثالاً على REPL يربع رقمًا معينًا:

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'أدخل رقمًا: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'أدخل رقمًا: ', eval: myEval });
```
:::

#### الأخطاء القابلة للاسترداد {#recoverable-errors}

في موجه REPL، يرسل الضغط على السطر الحالي من الإدخال إلى وظيفة `eval`. لدعم الإدخال متعدد الأسطر، يمكن لوظيفة `eval` إرجاع نسخة من `repl.Recoverable` إلى وظيفة رد الاتصال المقدمة:

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### تخصيص خرج REPL {#customizing-repl-output}

بشكل افتراضي، تقوم مثيلات [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver) بتنسيق الخرج باستخدام الطريقة [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) قبل كتابة الخرج إلى دفق `Writable` المقدم (`process.stdout` افتراضيًا). يتم تعيين خيار الفحص `showProxy` على true افتراضيًا ويتم تعيين خيار `colors` على true اعتمادًا على خيار `useColors` الخاص بـ REPL.

يمكن تحديد الخيار المنطقي `useColors` عند الإنشاء لتوجيه الكاتب الافتراضي لاستخدام رموز نمط ANSI لتلوين الخرج من الطريقة `util.inspect()`.

إذا تم تشغيل REPL كبرنامج مستقل، فمن الممكن أيضًا تغيير [الإعدادات الافتراضية لفحص REPL](/ar/nodejs/api/util#utilinspectobject-options) من داخل REPL باستخدام الخاصية `inspect.replDefaults` التي تعكس `defaultOptions` من [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options).

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
لتخصيص خرج مثيل [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver) بالكامل، مرر دالة جديدة للخيار `writer` عند الإنشاء. على سبيل المثال، المثال التالي يحول ببساطة أي نص إدخال إلى حالة الأحرف الكبيرة:



::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## الفئة: `REPLServer` {#class-replserver}

**تمت إضافتها في: v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [`repl.start()`](/ar/nodejs/api/repl#replstartoptions)
- يمتد: [\<readline.Interface\>](/ar/nodejs/api/readline#class-readlineinterface)

يتم إنشاء مثيلات `repl.REPLServer` باستخدام الطريقة [`repl.start()`](/ar/nodejs/api/repl#replstartoptions) أو مباشرة باستخدام الكلمة الأساسية JavaScript `new`.



::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### الحدث: `'exit'` {#event-exit}

**أضيف في: الإصدار v0.7.7**

يتم إطلاق الحدث `'exit'` عند الخروج من REPL إما عن طريق تلقي الأمر `.exit` كمدخل، أو ضغط المستخدم على + مرتين للإشارة إلى `SIGINT`، أو عن طريق الضغط على + للإشارة إلى `'end'` على دفق الإدخال. يتم استدعاء دالة رد الاتصال للمستمع بدون أي وسيطات.

```js [ESM]
replServer.on('exit', () => {
  console.log('تم تلقي حدث "exit" من repl!');
  process.exit();
});
```
### الحدث: `'reset'` {#event-reset}

**أضيف في: الإصدار v0.11.0**

يتم إطلاق الحدث `'reset'` عند إعادة تعيين سياق REPL. يحدث هذا كلما تم تلقي الأمر `.clear` كمدخل *إلا* إذا كانت REPL تستخدم المُقيِّم الافتراضي وتم إنشاء مثيل `repl.REPLServer` مع تعيين الخيار `useGlobal` على `true`. سيتم استدعاء دالة رد الاتصال للمستمع مع مرجع إلى كائن `context` كوسيطة وحيدة.

يمكن استخدام هذا بشكل أساسي لإعادة تهيئة سياق REPL إلى حالة محددة مسبقًا:

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

عند تنفيذ هذا الكود، يمكن تعديل المتغير العام `'m'` ثم إعادة تعيينه إلى قيمته الأولية باستخدام الأمر `.clear`:

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**أضيف في: الإصدار v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الكلمة المفتاحية للأمر ( *بدون* بادئة `.`).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد استدعاؤها عند معالجة الأمر.

تستخدم الطريقة `replServer.defineCommand()` لإضافة أوامر جديدة ذات بادئة `.` إلى مثيل REPL. يتم استدعاء هذه الأوامر بكتابة `.` متبوعة بـ `keyword`. `cmd` إما `Function` أو `Object` مع الخصائص التالية:

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نص التعليمات المراد عرضه عند إدخال `.help` (اختياري).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد تنفيذها، وتقبل اختياريًا وسيطة سلسلة واحدة.

يوضح المثال التالي أمرين جديدين تمت إضافتهما إلى مثيل REPL:

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

يمكن بعد ذلك استخدام الأوامر الجديدة من داخل مثيل REPL:

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**تمت الإضافة في: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تقوم الطريقة `replServer.displayPrompt()` بإعداد مثيل REPL لاستقبال الإدخال من المستخدم، حيث تطبع `prompt` المكوّن في سطر جديد في `output` وتستأنف `input` لقبول إدخال جديد.

عند إدخال إدخال متعدد الأسطر، يتم طباعة علامة حذف بدلاً من 'prompt'.

عندما تكون `preserveCursor` هي `true`، لن يتم إعادة تعيين موضع المؤشر إلى `0`.

تهدف طريقة `replServer.displayPrompt` بشكل أساسي إلى استدعائها من داخل وظيفة الإجراء للأوامر المسجلة باستخدام طريقة `replServer.defineCommand()`.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**تمت الإضافة في: v9.0.0**

تقوم الطريقة `replServer.clearBufferedCommand()` بمسح أي أمر تم تخزينه مؤقتًا ولكن لم يتم تنفيذه بعد. تهدف هذه الطريقة بشكل أساسي إلى استدعائها من داخل وظيفة الإجراء للأوامر المسجلة باستخدام طريقة `replServer.defineCommand()`.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**تمت الإضافة في: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار ملف السجل التاريخي
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عندما تكون كتابات السجل التاريخي جاهزة أو عند حدوث خطأ
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/ar/nodejs/api/repl#class-replserver)
  
 

يقوم بتهيئة ملف سجل تاريخي لمثيل REPL. عند تنفيذ Node.js binary واستخدام REPL الخاص بسطر الأوامر، يتم تهيئة ملف سجل تاريخي افتراضيًا. ومع ذلك، هذا ليس هو الحال عند إنشاء REPL برمجيًا. استخدم هذه الطريقة لتهيئة ملف سجل تاريخي عند العمل مع مثيلات REPL برمجيًا.

## `repl.builtinModules` {#replbuiltinmodules}

**تمت الإضافة في: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة بأسماء جميع وحدات Node.js، على سبيل المثال، `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.4.0, v12.17.0 | خيار `preview` متاح الآن. |
| v12.0.0 | يتبع خيار `terminal` الآن الوصف الافتراضي في جميع الحالات، ويتحقق `useColors` من `hasColors()` إذا كان متاحًا. |
| v10.0.0 | تمت إزالة `replMode` الخاصة بـ `REPL_MAGIC_MODE`. |
| v6.3.0 | خيار `breakEvalOnSigint` مدعوم الآن. |
| v5.8.0 | معامل `options` اختياري الآن. |
| v0.1.91 | تمت الإضافة في: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مطالبة الإدخال التي سيتم عرضها. **الافتراضي:** `'\> '` (مع مسافة لاحقة).
    - `input` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) دفق `Readable` الذي سيتم قراءة إدخال REPL منه. **الافتراضي:** `process.stdin`.
    - `output` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) دفق `Writable` الذي سيتم كتابة إخراج REPL إليه. **الافتراضي:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تحدد أنه يجب التعامل مع `output` كمحطة TTY. **الافتراضي:** التحقق من قيمة الخاصية `isTTY` على دفق `output` عند الإنشاء.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي سيتم استخدامها عند تقييم كل سطر إدخال معين. **الافتراضي:** برنامج تضمين غير متزامن لدالة JavaScript `eval()`. يمكن لدالة `eval` أن تخطئ مع `repl.Recoverable` للإشارة إلى أن الإدخال غير مكتمل والمطالبة بأسطر إضافية.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تحدد أن الدالة `writer` الافتراضية يجب أن تتضمن تصميم ألوان ANSI لإخراج REPL. إذا تم توفير دالة `writer` مخصصة، فلن يكون لهذا أي تأثير. **الافتراضي:** التحقق من دعم الألوان في دفق `output` إذا كانت قيمة `terminal` لمثيل REPL هي `true`.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تحدد أن دالة التقييم الافتراضية ستستخدم JavaScript `global` كسياق بدلاً من إنشاء سياق منفصل جديد لمثيل REPL. يعيّن REPL الخاص بـ node CLI هذه القيمة على `true`. **الافتراضي:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تحدد أن الكاتب الافتراضي لن يُخرج القيمة المرجعة لأمر ما إذا تم تقييمها إلى `undefined`. **الافتراضي:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة التي سيتم استدعاؤها لتنسيق إخراج كل أمر قبل الكتابة إلى `output`. **الافتراضي:** [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة اختيارية تستخدم لإكمال علامة التبويب التلقائي المخصص. راجع [`readline.InterfaceCompleter`](/ar/nodejs/api/readline#use-of-the-completer-function) للحصول على مثال.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) علامة تحدد ما إذا كان المُقيّم الافتراضي يقوم بتنفيذ جميع أوامر JavaScript في الوضع الصارم أو الوضع الافتراضي (المتراخي). القيم المقبولة هي:
    - `repl.REPL_MODE_SLOPPY` لتقييم التعبيرات في الوضع المتراخي.
    - `repl.REPL_MODE_STRICT` لتقييم التعبيرات في الوضع الصارم. هذا يعادل تقديم كل بيان repl بـ `'use strict'`.

    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) توقف عن تقييم جزء التعليمات البرمجية الحالي عند استقبال `SIGINT`، كما هو الحال عند الضغط على +. لا يمكن استخدام هذا مع دالة `eval` مخصصة. **الافتراضي:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد ما إذا كان repl يطبع الإكمال التلقائي ومعاينات الإخراج أم لا. **الافتراضي:** `true` مع دالة eval الافتراضية و `false` في حالة استخدام دالة eval مخصصة. إذا كانت `terminal` غير صحيحة، فلن تكون هناك معاينات ولن يكون لقيمة `preview` أي تأثير.

- الإرجاع: [\<repl.REPLServer\>](/ar/nodejs/api/repl#class-replserver)

تقوم الطريقة `repl.start()` بإنشاء وبدء مثيل [`repl.REPLServer`](/ar/nodejs/api/repl#class-replserver).

إذا كانت `options` سلسلة، فستحدد مطالبة الإدخال:

::: code-group
```js [ESM]
import repl from 'node:repl';

// مطالبة بنمط Unix
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// مطالبة بنمط Unix
repl.start('$ ');
```
:::


## وحدة REPL الخاصة بـ Node.js {#the-nodejs-repl}

تستخدم Node.js نفسها وحدة `node:repl` لتوفير واجهتها التفاعلية الخاصة لتنفيذ JavaScript. يمكن استخدام هذا عن طريق تنفيذ ملف Node.js الثنائي دون تمرير أي وسيطات (أو عن طريق تمرير الوسيطة `-i`):

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### خيارات متغيرات البيئة {#environment-variable-options}

يمكن تخصيص سلوكيات مختلفة لوحدة REPL الخاصة بـ Node.js باستخدام متغيرات البيئة التالية:

- `NODE_REPL_HISTORY`: عند إعطاء مسار صالح، سيتم حفظ سجل REPL الدائم في الملف المحدد بدلاً من `.node_repl_history` في الدليل الرئيسي للمستخدم. سيؤدي تعيين هذه القيمة إلى `''` (سلسلة فارغة) إلى تعطيل سجل REPL الدائم. سيتم اقتطاع المسافات البيضاء من القيمة. في أنظمة Windows الأساسية، تكون متغيرات البيئة ذات القيم الفارغة غير صالحة، لذا قم بتعيين هذا المتغير إلى مسافة واحدة أو أكثر لتعطيل سجل REPL الدائم.
- `NODE_REPL_HISTORY_SIZE`: يتحكم في عدد أسطر السجل التي سيتم الاحتفاظ بها إذا كان السجل متاحًا. يجب أن يكون رقمًا موجبًا. **الافتراضي:** `1000`.
- `NODE_REPL_MODE`: قد يكون `'sloppy'` أو `'strict'`. **الافتراضي:** `'sloppy'`، والذي سيسمح بتشغيل التعليمات البرمجية غير الصارمة.

### سجل دائم {#persistent-history}

بشكل افتراضي، سيحتفظ Node.js REPL بالسجل بين جلسات `node` REPL عن طريق حفظ المدخلات في ملف `.node_repl_history` الموجود في الدليل الرئيسي للمستخدم. يمكن تعطيل هذا عن طريق تعيين متغير البيئة `NODE_REPL_HISTORY='''`.

### استخدام Node.js REPL مع محرر الأسطر المتقدم {#using-the-nodejs-repl-with-advanced-line-editors}

بالنسبة لمحرري الأسطر المتقدمة، ابدأ Node.js بمتغير البيئة `NODE_NO_READLINE=1`. سيؤدي هذا إلى بدء تشغيل REPL الرئيسي والمصحح في إعدادات طرفية أساسية، مما سيسمح بالاستخدام مع `rlwrap`.

على سبيل المثال، يمكن إضافة ما يلي إلى ملف `.bashrc`:

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### بدء تشغيل مثيلات REPL متعددة مقابل مثيل تشغيل واحد {#starting-multiple-repl-instances-against-a-single-running-instance}

من الممكن إنشاء وتشغيل مثيلات REPL متعددة مقابل مثيل تشغيل واحد لـ Node.js يشترك في كائن `global` واحد ولكن لديه واجهات إدخال/إخراج منفصلة.

يوفر المثال التالي، على سبيل المثال، REPLs منفصلة على `stdin`، ومقبس Unix، ومقبس TCP:

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

سيؤدي تشغيل هذا التطبيق من سطر الأوامر إلى بدء تشغيل REPL على stdin. قد يتصل عملاء REPL الآخرون عبر مقبس Unix أو مقبس TCP. `telnet`، على سبيل المثال، مفيد للاتصال بمقابس TCP، بينما يمكن استخدام `socat` للاتصال بمقابس Unix و TCP.

عن طريق بدء تشغيل REPL من خادم قائم على مقبس Unix بدلاً من stdin، من الممكن الاتصال بعملية Node.js طويلة الأمد دون إعادة تشغيلها.

للحصول على مثال لتشغيل REPL "كامل الميزات" (طرفي) عبر مثيل `net.Server` و `net.Socket`، انظر: [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

للحصول على مثال لتشغيل مثيل REPL عبر [`curl(1)`](https://curl.haxx.se/docs/manpage)، انظر: [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

هذا المثال مخصص للأغراض التعليمية البحتة لإظهار كيفية بدء تشغيل Node.js REPLs باستخدام تدفقات إدخال/إخراج مختلفة. يجب **عدم** استخدامه في بيئات الإنتاج أو أي سياق تكون فيه السلامة مصدر قلق دون اتخاذ تدابير حماية إضافية. إذا كنت بحاجة إلى تنفيذ REPLs في تطبيق واقعي، ففكر في طرق بديلة تخفف هذه المخاطر، مثل استخدام آليات إدخال آمنة وتجنب واجهات الشبكة المفتوحة.

