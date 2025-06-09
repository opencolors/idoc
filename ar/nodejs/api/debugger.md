---
title: دليل مصحح الأخطاء في Node.js
description: دليل شامل لاستخدام المصحح المدمج في Node.js، يتناول الأوامر، والاستخدام، وتقنيات التصحيح.
head:
  - - meta
    - name: og:title
      content: دليل مصحح الأخطاء في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: دليل شامل لاستخدام المصحح المدمج في Node.js، يتناول الأوامر، والاستخدام، وتقنيات التصحيح.
  - - meta
    - name: twitter:title
      content: دليل مصحح الأخطاء في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: دليل شامل لاستخدام المصحح المدمج في Node.js، يتناول الأوامر، والاستخدام، وتقنيات التصحيح.
---


# مصحح الأخطاء {#debugger}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يتضمن Node.js أداة لتصحيح الأخطاء من سطر الأوامر. عميل مصحح أخطاء Node.js ليس مصحح أخطاء كامل الميزات، ولكن من الممكن إجراء خطوات بسيطة وفحص.

لاستخدامه، ابدأ Node.js بالوسيطة `inspect` متبوعة بالمسار إلى البرنامج النصي المراد تصحيحه.

```bash [BASH]
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< للمساعدة، راجع: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
يتوقف مصحح الأخطاء تلقائيًا عند السطر القابل للتنفيذ الأول. بدلاً من ذلك، للتشغيل حتى نقطة التوقف الأولى (المحددة بواسطة عبارة [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger))، قم بتعيين متغير البيئة `NODE_INSPECT_RESUME_ON_START` إلى `1`.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< للمساعدة، راجع: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
يسمح الأمر `repl` بتقييم التعليمات البرمجية عن بعد. ينقل الأمر `next` إلى السطر التالي. اكتب `help` لمعرفة الأوامر الأخرى المتاحة.

سيؤدي الضغط على `enter` دون كتابة أمر إلى تكرار أمر مصحح الأخطاء السابق.


## المراقبون {#watchers}

من الممكن مراقبة قيم التعبيرات والمتغيرات أثناء التصحيح. في كل نقطة توقف، سيتم تقييم كل تعبير من قائمة المراقبين في السياق الحالي وعرضه مباشرة قبل قائمة الكود المصدري لنقطة التوقف.

لبدء مراقبة تعبير، اكتب `watch('my_expression')`. سيعرض الأمر `watchers` المراقبين النشطين. لإزالة مراقب، اكتب `unwatch('my_expression')`.

## مرجع الأوامر {#command-reference}

### التنقل {#stepping}

- `cont`, `c`: متابعة التنفيذ
- `next`, `n`: الانتقال إلى التالي
- `step`, `s`: الدخول إلى الدالة
- `out`, `o`: الخروج من الدالة
- `pause`: إيقاف الكود قيد التشغيل مؤقتًا (مثل زر الإيقاف المؤقت في أدوات المطور)

### نقاط التوقف {#breakpoints}

- `setBreakpoint()`, `sb()`: تعيين نقطة توقف على السطر الحالي
- `setBreakpoint(line)`, `sb(line)`: تعيين نقطة توقف على سطر معين
- `setBreakpoint('fn()')`, `sb(...)`: تعيين نقطة توقف على أول عبارة في جسم الدالة
- `setBreakpoint('script.js', 1)`, `sb(...)`: تعيين نقطة توقف على السطر الأول من `script.js`
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: تعيين نقطة توقف شرطية على السطر الأول من `script.js` والتي تتوقف فقط عندما يتم تقييم `num \< 4` إلى `true`
- `clearBreakpoint('script.js', 1)`, `cb(...)`: مسح نقطة التوقف في `script.js` على السطر 1

من الممكن أيضًا تعيين نقطة توقف في ملف (وحدة) لم يتم تحميله بعد:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
من الممكن أيضًا تعيين نقطة توقف شرطية تتوقف فقط عندما يتم تقييم تعبير معين إلى `true`:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### معلومات {#information}

- `backtrace`, `bt`: طباعة تتبع التنفيذ للإطار الحالي
- `list(5)`: سرد رمز مصدر البرنامج النصي مع سياق 5 أسطر (5 أسطر قبل و 5 أسطر بعد)
- `watch(expr)`: إضافة تعبير إلى قائمة المراقبة
- `unwatch(expr)`: إزالة تعبير من قائمة المراقبة
- `unwatch(index)`: إزالة تعبير في فهرس معين من قائمة المراقبة
- `watchers`: سرد جميع المراقبين وقيمهم (تُسرد تلقائيًا في كل نقطة توقف)
- `repl`: فتح repl الخاص بالمصحح للتقييم في سياق البرنامج النصي للتصحيح
- `exec expr`, `p expr`: تنفيذ تعبير في سياق البرنامج النصي للتصحيح وطباعة قيمته
- `profile`: بدء جلسة تحديد مواصفات وحدة المعالجة المركزية
- `profileEnd`: إيقاف جلسة تحديد مواصفات وحدة المعالجة المركزية الحالية
- `profiles`: سرد جميع جلسات تحديد مواصفات وحدة المعالجة المركزية المكتملة
- `profiles[n].save(filepath = 'node.cpuprofile')`: حفظ جلسة تحديد مواصفات وحدة المعالجة المركزية على القرص بتنسيق JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: التقاط لقطة للذاكرة المؤقتة وحفظها على القرص بتنسيق JSON

### التحكم في التنفيذ {#execution-control}

- `run`: تشغيل البرنامج النصي (يُشغل تلقائيًا عند بدء تشغيل المصحح)
- `restart`: إعادة تشغيل البرنامج النصي
- `kill`: إنهاء البرنامج النصي

### متنوع {#various}

- `scripts`: سرد جميع البرامج النصية المحملة
- `version`: عرض إصدار V8

## استخدام متقدم {#advanced-usage}

### تكامل V8 inspector لـ Node.js {#v8-inspector-integration-for-nodejs}

يسمح تكامل V8 Inspector بربط Chrome DevTools بمثيلات Node.js لتصحيح الأخطاء وتحديد المواصفات. يستخدم [بروتوكول Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/).

يمكن تمكين V8 Inspector عن طريق تمرير العلامة `--inspect` عند بدء تشغيل تطبيق Node.js. من الممكن أيضًا توفير منفذ مخصص مع هذه العلامة، على سبيل المثال `--inspect=9222` سيقبل اتصالات DevTools على المنفذ 9222.

سيؤدي استخدام العلامة `--inspect` إلى تنفيذ التعليمات البرمجية فورًا قبل توصيل المصحح. هذا يعني أن التعليمات البرمجية ستبدأ في التشغيل قبل أن تتمكن من بدء التصحيح، وهو ما قد لا يكون مثاليًا إذا كنت تريد تصحيح الأخطاء من البداية.

في مثل هذه الحالات، لديك بديلان:

لذا، عند الاختيار بين `--inspect` و `--inspect-wait` و `--inspect-brk`، ضع في اعتبارك ما إذا كنت تريد أن تبدأ التعليمات البرمجية في التنفيذ على الفور، أو الانتظار حتى يتم إرفاق المصحح قبل التنفيذ، أو التوقف عند السطر الأول لتصحيح الأخطاء خطوة بخطوة.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(في المثال أعلاه، يتم إنشاء UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 في نهاية عنوان URL أثناء التشغيل، وهو يختلف في جلسات تصحيح الأخطاء المختلفة.)

إذا كان متصفح Chrome أقدم من 66.0.3345.0، فاستخدم `inspector.html` بدلاً من `js_app.html` في عنوان URL أعلاه.

لا يدعم Chrome DevTools تصحيح [سلاسل العمل الفرعية](/ar/nodejs/api/worker_threads) حتى الآن. يمكن استخدام [ndb](https://github.com/GoogleChromeLabs/ndb/) لتصحيحها.

