---
title: توثيق Node.js - العملية الفرعية
description: توثيق Node.js لوحدة العملية الفرعية، الذي يوضح كيفية إنشاء عمليات فرعية، وإدارة دورة حياتها، والتعامل مع الاتصال بين العمليات.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - العملية الفرعية | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق Node.js لوحدة العملية الفرعية، الذي يوضح كيفية إنشاء عمليات فرعية، وإدارة دورة حياتها، والتعامل مع الاتصال بين العمليات.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - العملية الفرعية | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق Node.js لوحدة العملية الفرعية، الذي يوضح كيفية إنشاء عمليات فرعية، وإدارة دورة حياتها، والتعامل مع الاتصال بين العمليات.
---


# عملية الابن {#child-process}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

توفر الوحدة النمطية `node:child_process` القدرة على إنتاج عمليات فرعية بطريقة مشابهة، ولكنها ليست مطابقة، لـ [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3). يتم توفير هذه الإمكانية بشكل أساسي بواسطة الدالة [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options):

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

بشكل افتراضي، يتم إنشاء قنوات لـ `stdin` و `stdout` و `stderr` بين عملية Node.js الأصلية والعملية الفرعية التي تم إنتاجها. هذه القنوات لها سعة محدودة (وخاصة بالنظام الأساسي). إذا كتبت العملية الفرعية إلى stdout بما يتجاوز هذا الحد دون التقاط الإخراج، فإن العملية الفرعية تحظر في انتظار أن تقبل ذاكرة التخزين المؤقت للقناة المزيد من البيانات. هذا مطابق لسلوك القنوات في الصدفة. استخدم الخيار `{ stdio: 'ignore' }` إذا لم يتم استهلاك الإخراج.

يتم إجراء البحث عن الأمر باستخدام متغير البيئة `options.env.PATH` إذا كانت `env` موجودة في كائن `options`. وإلا، فسيتم استخدام `process.env.PATH`. إذا تم تعيين `options.env` بدون `PATH`، فسيتم إجراء البحث على نظام Unix على مسار بحث افتراضي لـ `/usr/bin:/bin` (راجع دليل نظام التشغيل الخاص بك لمعرفة execvpe/execvp)، وعلى نظام Windows يتم استخدام متغير بيئة العمليات الحالي `PATH`.

في نظام التشغيل Windows، تكون متغيرات البيئة غير حساسة لحالة الأحرف. تقوم Node.js بترتيب مفاتيح `env` معجميًا وتستخدم أول مفتاح يطابق بشكل غير حساس لحالة الأحرف. سيتم تمرير الإدخال الأول فقط (بالترتيب المعجمي) إلى العملية الفرعية. قد يؤدي ذلك إلى حدوث مشكلات على نظام التشغيل Windows عند تمرير كائنات إلى خيار `env` تحتوي على متغيرات متعددة لنفس المفتاح، مثل `PATH` و `Path`.

تقوم الطريقة [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) بإنتاج العملية الفرعية بشكل غير متزامن، دون حظر حلقة أحداث Node.js. توفر الدالة [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options) وظائف مكافئة بطريقة متزامنة تحظر حلقة الأحداث حتى تنتهي العملية التي تم إنتاجها أو يتم إنهاؤها.

للتسهيل، توفر الوحدة النمطية `node:child_process` عددًا قليلاً من البدائل المتزامنة وغير المتزامنة لـ [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) و [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options). يتم تنفيذ كل من هذه البدائل أعلى [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) أو [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options).

- [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback): يقوم بإنتاج صدفة وتشغيل أمر داخل تلك الصدفة، وتمرير `stdout` و `stderr` إلى دالة رد الاتصال عند الانتهاء.
- [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback): مشابه لـ [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) باستثناء أنه ينتج الأمر مباشرة دون إنتاج صدفة أولاً بشكل افتراضي.
- [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options): يقوم بإنتاج عملية Node.js جديدة ويستدعي وحدة نمطية محددة مع إنشاء قناة اتصال IPC تسمح بإرسال الرسائل بين الأصل والابن.
- [`child_process.execSync()`](/ar/nodejs/api/child_process#child_processexecsynccommand-options): نسخة متزامنة من [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) والتي ستحظر حلقة أحداث Node.js.
- [`child_process.execFileSync()`](/ar/nodejs/api/child_process#child_processexecfilesyncfile-args-options): نسخة متزامنة من [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) والتي ستحظر حلقة أحداث Node.js.

بالنسبة لبعض حالات الاستخدام، مثل أتمتة نصوص الصدفة، قد تكون [النظائر المتزامنة](/ar/nodejs/api/child_process#synchronous-process-creation) أكثر ملاءمة. ومع ذلك، في كثير من الحالات، يمكن أن يكون للطرق المتزامنة تأثير كبير على الأداء بسبب إيقاف حلقة الأحداث أثناء اكتمال العمليات التي تم إنتاجها.


## إنشاء العمليات غير المتزامنة {#asynchronous-process-creation}

تتبع كل من طرق [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) و [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options) و [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) و [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) نمط البرمجة غير المتزامنة الاصطلاحي النموذجي لواجهات برمجة تطبيقات Node.js الأخرى.

تُرجع كل طريقة من هذه الطرق مثيلاً لـ [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess). تُنفِّذ هذه الكائنات واجهة برمجة تطبيقات [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter) الخاصة بـ Node.js، مما يسمح للعملية الأصل بتسجيل وظائف المستمع التي يتم استدعاؤها عند وقوع أحداث معينة خلال دورة حياة العملية الفرعية.

تسمح طريقتان [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) و [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) بالإضافة إلى ذلك بتحديد وظيفة `callback` اختيارية يتم استدعاؤها عند إنهاء العملية الفرعية.

### إنشاء ملفات `.bat` و `.cmd` على نظام التشغيل Windows {#spawning-bat-and-cmd-files-on-windows}

يمكن أن تختلف أهمية التمييز بين [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) و [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) بناءً على النظام الأساسي. على أنظمة التشغيل من نوع Unix (Unix و Linux و macOS) يمكن أن تكون [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) أكثر كفاءة لأنها لا تنشئ shell افتراضيًا. ومع ذلك، في نظام التشغيل Windows، لا يمكن تنفيذ ملفات `.bat` و `.cmd` بمفردها دون طرفية، وبالتالي لا يمكن تشغيلها باستخدام [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback). عند التشغيل على نظام التشغيل Windows، يمكن استدعاء ملفات `.bat` و `.cmd` باستخدام [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) مع تعيين خيار `shell` أو باستخدام [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) أو عن طريق إنشاء `cmd.exe` وتمرير ملف `.bat` أو `.cmd` كوسيطة (وهو ما يفعله خيار `shell` و [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback)). على أي حال، إذا كان اسم ملف البرنامج النصي يحتوي على مسافات، فيجب وضعه بين علامتي اقتباس.

::: code-group
```js [CJS]
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OR...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v15.4.0 | تمت إضافة دعم `AbortSignal`. |
| v16.4.0, v14.18.0 | يمكن أن يكون الخيار `cwd` كائن `URL` وفقًا لمعيار WHATWG باستخدام بروتوكول `file:`. |
| v8.8.0 | الخيار `windowsHide` مدعوم الآن. |
| v0.1.90 | تمت الإضافة في: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): الأمر المراد تشغيله، مع وسيطات مفصولة بمسافات.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object):
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api): دليل العمل الحالي للعملية الفرعية. **الافتراضي:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): أزواج مفتاح-قيمة للبيئة. **الافتراضي:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): **الافتراضي:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): الصدفة التي سيتم تنفيذ الأمر بها. انظر [متطلبات الصدفة](/ar/nodejs/api/child_process#shell-requirements) و [الصدفة الافتراضية لنظام Windows](/ar/nodejs/api/child_process#default-windows-shell). **الافتراضي:** `'/bin/sh'` على نظام Unix، و `process.env.ComSpec` على نظام Windows.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal): يسمح بإيقاف العملية الفرعية باستخدام AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): **الافتراضي:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): أكبر كمية من البيانات بالبايتات المسموح بها على stdout أو stderr. في حالة تجاوزها، يتم إنهاء العملية الفرعية واقتطاع أي إخراج. انظر التحذير في [`maxBuffer` و Unicode](/ar/nodejs/api/child_process#maxbuffer-and-unicode). **الافتراضي:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): **الافتراضي:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): يعين هوية المستخدم للعملية (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): يعين هوية المجموعة للعملية (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): إخفاء نافذة وحدة التحكم الفرعية التي يتم إنشاؤها عادةً على أنظمة Windows. **الافتراضي:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function): يتم استدعاؤها مع الإخراج عند إنهاء العملية.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)


- الإرجاع: [\<ChildProcess\>](/ar/nodejs/api/child_process#class-childprocess)

يقوم بإنشاء صدفة ثم ينفذ `command` داخل تلك الصدفة، ويخزن أي إخراج تم إنشاؤه مؤقتًا. تتم معالجة سلسلة `command` التي تم تمريرها إلى دالة exec مباشرةً بواسطة الصدفة، ويجب التعامل مع الأحرف الخاصة (تختلف بناءً على [الصدفة](https://en.wikipedia.org/wiki/List_of_command-line_interpreters) ) وفقًا لذلك:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// يتم استخدام علامات الاقتباس المزدوجة بحيث لا يتم تفسير المسافة في المسار على أنها
// محدد لوسيطات متعددة.

exec('echo "The \\$HOME variable is $HOME"');
// يتم إلغاء قيمة المتغير ‎$HOME في الحالة الأولى، ولكن ليس في الحالة الثانية.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// يتم استخدام علامات الاقتباس المزدوجة بحيث لا يتم تفسير المسافة في المسار على أنها
// محدد لوسيطات متعددة.

exec('echo "The \\$HOME variable is $HOME"');
// يتم إلغاء قيمة المتغير ‎$HOME في الحالة الأولى، ولكن ليس في الحالة الثانية.
```
:::

**لا تمرر أبدًا مدخلات المستخدم غير المعقمة إلى هذه الدالة. يمكن استخدام أي إدخال يحتوي على أحرف تعريفية للصدفة
لتشغيل تنفيذ أوامر عشوائية.**

إذا تم توفير دالة `callback`، فسيتم استدعاؤها بالوسائط `(error, stdout, stderr)`. عند النجاح، سيكون `error` هو `null`. عند حدوث خطأ، سيكون `error` نسخة من [`Error`](/ar/nodejs/api/errors#class-error). ستكون الخاصية `error.code` هي رمز الخروج للعملية. وفقًا للعرف، يشير أي رمز خروج بخلاف `0` إلى وجود خطأ. ستكون `error.signal` هي الإشارة التي أنهت العملية.

ستحتوي الوسيطتان `stdout` و `stderr` اللتان تم تمريرهما إلى الاستدعاء على إخراج stdout و stderr للعملية الفرعية. افتراضيًا، سيقوم Node.js بفك تشفير الإخراج كـ UTF-8 وتمرير السلاسل إلى الاستدعاء. يمكن استخدام الخيار `encoding` لتحديد ترميز الأحرف المستخدم لفك تشفير إخراج stdout و stderr. إذا كان `encoding` هو `'buffer'`، أو ترميز أحرف غير معروف، فسيتم تمرير كائنات `Buffer` إلى الاستدعاء بدلاً من ذلك.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

إذا كانت قيمة `timeout` أكبر من `0`، فسترسل العملية الأصل الإشارة التي تم تحديدها بواسطة الخاصية `killSignal` (الافتراضي هو `'SIGTERM'`) إذا استغرقت العملية الفرعية وقتًا أطول من `timeout` مللي ثانية.

على عكس استدعاء نظام POSIX لـ [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3)، لا يحل `child_process.exec()` محل العملية الموجودة ويستخدم صدفة لتنفيذ الأمر.

إذا تم استدعاء هذه الطريقة كنسخة [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal) ed الخاصة بها، فستعيد `Promise` لكائن يحتوي على خصائص `stdout` و `stderr`. يتم إرفاق نسخة `ChildProcess` التي تم إرجاعها بـ `Promise` كخاصية `child`. في حالة حدوث خطأ (بما في ذلك أي خطأ يؤدي إلى رمز خروج بخلاف 0)، يتم إرجاع وعد مرفوض، مع نفس كائن `error` المحدد في الاستدعاء، ولكن مع خاصيتين إضافيتين `stdout` و `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

إذا تم تمكين الخيار `signal`، فإن استدعاء `.abort()` على `AbortController` المطابق يشبه استدعاء `.kill()` على العملية الفرعية باستثناء أن الخطأ الذي تم تمريره إلى الاستدعاء سيكون `AbortError`:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار 16.4.0، الإصدار 14.18.0 | يمكن أن يكون الخيار `cwd` كائن `URL` الخاص بـ WHATWG باستخدام بروتوكول `file:`. |
| الإصدار 15.4.0، الإصدار 14.17.0 | تمت إضافة دعم AbortSignal. |
| الإصدار 8.8.0 | أصبح الخيار `windowsHide` مدعومًا الآن. |
| الإصدار 0.1.91 | تمت الإضافة في: الإصدار 0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم أو مسار الملف القابل للتنفيذ المراد تشغيله.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة وسيطات السلسلة النصية.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) دليل العمل الحالي للعملية الفرعية.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج مفتاح-قيمة للبيئة. **الافتراضي:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر كمية من البيانات بالبايت مسموح بها على stdout أو stderr. إذا تم تجاوزها، فسيتم إنهاء العملية الفرعية وسيتم اقتطاع أي إخراج. راجع التحذير في [`maxBuffer` و Unicode](/ar/nodejs/api/child_process#maxbuffer-and-unicode). **الافتراضي:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن هوية المستخدم للعملية (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن هوية المجموعة للعملية (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إخفاء نافذة وحدة التحكم للعملية الفرعية التي يتم إنشاؤها عادةً على أنظمة Windows. **الافتراضي:** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لا يتم إجراء اقتباس أو إلغاء لعلامات الاقتباس للوسيطات على نظام Windows. يتم تجاهلها على نظام Unix. **الافتراضي:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `true`، فسيتم تشغيل `command` داخل shell. يستخدم `'/bin/sh'` على Unix، و `process.env.ComSpec` على Windows. يمكن تحديد shell مختلف كسلسلة نصية. انظر [متطلبات Shell](/ar/nodejs/api/child_process#shell-requirements) و [Shell الافتراضي لنظام Windows](/ar/nodejs/api/child_process#default-windows-shell). **الافتراضي:** `false` (لا يوجد shell).
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإجهاض العملية الفرعية باستخدام AbortSignal.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها مع الإخراج عند إنهاء العملية.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)
  
 
- Returns: [\<ChildProcess\>](/ar/nodejs/api/child_process#class-childprocess)

تشبه الدالة `child_process.execFile()` الدالة [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) باستثناء أنها لا تنشئ shell افتراضيًا. بدلاً من ذلك، يتم إنشاء `file` القابل للتنفيذ المحدد مباشرة كعملية جديدة مما يجعله أكثر كفاءة قليلاً من [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback).

يتم دعم نفس الخيارات الخاصة بـ [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback). نظرًا لعدم إنشاء shell، لا يتم دعم سلوكيات مثل إعادة توجيه الإدخال/الإخراج وتوسيع اسم الملف.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

تحتوي الوسيطات `stdout` و `stderr` التي تم تمريرها إلى رد الاتصال على إخراج stdout و stderr للعملية الفرعية. افتراضيًا، يقوم Node.js بفك ترميز الإخراج كـ UTF-8 وتمرير السلاسل إلى رد الاتصال. يمكن استخدام الخيار `encoding` لتحديد ترميز الأحرف المستخدم لفك ترميز إخراج stdout و stderr. إذا كان `encoding` هو `'buffer'`، أو ترميز أحرف غير معروف، فسيتم تمرير كائنات `Buffer` إلى رد الاتصال بدلاً من ذلك.

إذا تم استدعاء هذه الطريقة كنسخة [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed، فستعيد `Promise` لكائن يحتوي على خصائص `stdout` و `stderr`. يتم إرفاق مثيل `ChildProcess` الذي تم إرجاعه بـ `Promise` كخاصية `child`. في حالة حدوث خطأ (بما في ذلك أي خطأ ينتج عنه رمز خروج بخلاف 0)، يتم إرجاع وعد مرفوض، مع نفس كائن `error` الذي تم تقديمه في رد الاتصال، ولكن مع خاصيتين إضافيتين `stdout` و `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**إذا تم تمكين الخيار <code>shell</code>، فلا تقم بتمرير إدخال المستخدم غير المعقم إلى هذه الوظيفة. يمكن استخدام أي إدخال يحتوي على أحرف تعريفية لـ shell لتشغيل تنفيذ أوامر عشوائي.**

إذا تم تمكين الخيار `signal`، فإن استدعاء `.abort()` على `AbortController` المقابل يشبه استدعاء `.kill()` على العملية الفرعية باستثناء أن الخطأ الذي تم تمريره إلى رد الاتصال سيكون `AbortError`:

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.4.0, v16.14.0 | يمكن أن يكون المعامل `modulePath` كائن `URL` من نوع WHATWG باستخدام بروتوكول `file:`. |
| v16.4.0, v14.18.0 | يمكن أن يكون الخيار `cwd` كائن `URL` من نوع WHATWG باستخدام بروتوكول `file:`. |
| v15.13.0, v14.18.0 | تمت إضافة المهلة. |
| v15.11.0, v14.18.0 | تمت إضافة killSignal لـ AbortSignal. |
| v15.6.0, v14.17.0 | تمت إضافة دعم AbortSignal. |
| v13.2.0, v12.16.0 | خيار `serialization` مدعوم الآن. |
| v8.0.0 | يمكن أن يكون الخيار `stdio` الآن سلسلة نصية. |
| v6.4.0 | الخيار `stdio` مدعوم الآن. |
| v0.5.0 | تمت الإضافة في: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) الوحدة المراد تشغيلها في العملية الفرعية.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة من وسيطات السلاسل النصية.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) دليل العمل الحالي للعملية الفرعية.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تحضير العملية الفرعية للتشغيل بشكل مستقل عن العملية الرئيسية. يعتمد السلوك المحدد على النظام الأساسي، انظر [`options.detached`](/ar/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج قيم مفتاح البيئة. **الافتراضي:** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الملف التنفيذي المستخدم لإنشاء العملية الفرعية.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة من وسيطات السلاسل النصية التي تم تمريرها إلى الملف التنفيذي. **الافتراضي:** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) تعيين هوية المجموعة للعملية (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تحديد نوع التسلسل المستخدم لإرسال الرسائل بين العمليات. القيم المحتملة هي `'json'` و `'advanced'`. انظر [تسلسل متقدم](/ar/nodejs/api/child_process#advanced-serialization) لمزيد من التفاصيل. **الافتراضي:** `'json'`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإغلاق العملية الفرعية باستخدام AbortSignal.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الإشارة التي سيتم استخدامها عندما يتم إنهاء العملية التي تم إنشاؤها بواسطة المهلة أو إشارة الإحباط. **الافتراضي:** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم توجيه stdin و stdout و stderr للعملية الفرعية إلى العملية الرئيسية، وإلا فسيتم وراثتها من العملية الرئيسية، انظر الخيارين `'pipe'` و `'inherit'` لـ [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) [`stdio`](/ar/nodejs/api/child_process#optionsstdio) لمزيد من التفاصيل. **الافتراضي:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) انظر [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) [`stdio`](/ar/nodejs/api/child_process#optionsstdio). عند توفير هذا الخيار، فإنه يتجاوز `silent`. إذا تم استخدام متغير المصفوفة، فيجب أن يحتوي على عنصر واحد بالضبط بالقيمة `'ipc'` وإلا سيتم طرح خطأ. على سبيل المثال `[0, 1, 2, 'ipc']`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) تعيين هوية المستخدم للعملية (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لا يتم إجراء اقتباس أو إلغاء لعلامات الاقتباس للوسيطات على نظام التشغيل Windows. يتم تجاهله على نظام Unix. **الافتراضي:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بالمللي ثانية، الحد الأقصى للوقت المسموح بتشغيل العملية. **الافتراضي:** `undefined`.


- الإرجاع: [\<ChildProcess\>](/ar/nodejs/api/child_process#class-childprocess)

الطريقة `child_process.fork()` هي حالة خاصة من [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) المستخدمة خصيصًا لإنشاء عمليات Node.js جديدة. مثل [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options)، يتم إرجاع كائن [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess). سيحتوي [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess) الذي تم إرجاعه على قناة اتصال إضافية مدمجة تسمح بتمرير الرسائل ذهابًا وإيابًا بين الأصل والفرع. انظر [`subprocess.send()`](/ar/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) للحصول على التفاصيل.

ضع في اعتبارك أن عمليات Node.js الفرعية التي تم إنشاؤها مستقلة عن الأصل باستثناء قناة اتصال IPC التي تم إنشاؤها بين الاثنين. لكل عملية الذاكرة الخاصة بها، مع مثيلات V8 الخاصة بها. نظرًا لتخصيصات الموارد الإضافية المطلوبة، لا يوصى بإنشاء عدد كبير من عمليات Node.js الفرعية.

افتراضيًا، ستقوم `child_process.fork()` بإنشاء مثيلات Node.js جديدة باستخدام [`process.execPath`](/ar/nodejs/api/process#processexecpath) للعملية الأصل. تسمح خاصية `execPath` في كائن `options` باستخدام مسار تنفيذ بديل.

ستتصل عمليات Node.js التي تم إطلاقها باستخدام `execPath` مخصصة بالعملية الأصل باستخدام واصف الملف (fd) المحدد باستخدام متغير البيئة `NODE_CHANNEL_FD` في العملية الفرعية.

على عكس استدعاء نظام POSIX [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2)، لا يستنسخ `child_process.fork()` العملية الحالية.

خيار `shell` المتاح في [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) غير مدعوم بواسطة `child_process.fork()` وسيتم تجاهله في حالة تعيينه.

إذا تم تمكين خيار `signal`، فإن استدعاء `.abort()` على `AbortController` المقابل يشبه استدعاء `.kill()` على العملية الفرعية باستثناء أن الخطأ الذي تم تمريره إلى رد الاتصال سيكون `AbortError`:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::

### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.4.0, v14.18.0 | يمكن أن يكون الخيار `cwd` كائن `URL` لـ WHATWG باستخدام بروتوكول `file:`. |
| v15.13.0, v14.18.0 | تمت إضافة المهلة. |
| v15.11.0, v14.18.0 | تمت إضافة killSignal لـ AbortSignal. |
| v15.5.0, v14.17.0 | تمت إضافة دعم AbortSignal. |
| v13.2.0, v12.16.0 | يتم دعم الخيار `serialization` الآن. |
| v8.8.0 | يتم دعم الخيار `windowsHide` الآن. |
| v6.4.0 | يتم دعم الخيار `argv0` الآن. |
| v5.7.0 | يتم دعم الخيار `shell` الآن. |
| v0.1.90 | تمت الإضافة في: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الأمر المراد تشغيله.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة بالوسائط النصية.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) دليل العمل الحالي للعملية الفرعية.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج قيم المفاتيح البيئية. **الافتراضي:** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قم بتعيين قيمة `argv[0]` المرسلة إلى العملية الفرعية بشكل صريح. سيتم تعيين هذا إلى `command` إذا لم يتم تحديده.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تكوين stdio للتابع (انظر [`options.stdio`](/ar/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تهيئة العملية الفرعية للتشغيل بشكل مستقل عن عمليتها الأصلية. يعتمد السلوك المحدد على النظام الأساسي، انظر [`options.detached`](/ar/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) لتعيين هوية المستخدم للعملية (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) لتعيين هوية المجموعة للعملية (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) حدد نوع التسلسل المستخدم لإرسال الرسائل بين العمليات. القيم المحتملة هي `'json'` و `'advanced'`. راجع [التسلسل المتقدم](/ar/nodejs/api/child_process#advanced-serialization) لمزيد من التفاصيل. **الافتراضي:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `true`، فسيتم تشغيل `command` داخل shell. يستخدم `'/bin/sh'` على Unix، و `process.env.ComSpec` على Windows. يمكن تحديد shell مختلف كسلسلة. انظر [متطلبات Shell](/ar/nodejs/api/child_process#shell-requirements) و [Shell Windows الافتراضي](/ar/nodejs/api/child_process#default-windows-shell). **الافتراضي:** `false` (بدون shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لا يتم إجراء اقتباس أو إفلات للوسائط على Windows. يتم تجاهله على Unix. يتم تعيين هذا إلى `true` تلقائيًا عند تحديد `shell` و CMD. **الافتراضي:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إخفاء نافذة وحدة التحكم الفرعية التي يتم إنشاؤها عادةً على أنظمة Windows. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإجهاض العملية الفرعية باستخدام AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بالمللي ثانية الحد الأقصى من الوقت المسموح بتشغيل العملية فيه. **الافتراضي:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الإشارة المراد استخدامها عندما يتم إنهاء العملية المتفرعة بسبب المهلة أو إشارة الإجهاض. **الافتراضي:** `'SIGTERM'`.

- الإرجاع: [\<ChildProcess\>](/ar/nodejs/api/child_process#class-childprocess)

تقوم الطريقة `child_process.spawn()` بإنشاء عملية جديدة باستخدام `command` المحدد، مع وسيطات سطر الأوامر في `args`. إذا تم حذفه، فسيكون `args` افتراضيًا عبارة عن صفيف فارغ.

**إذا تم تمكين الخيار <code>shell</code>، فلا تقم بتمرير إدخال المستخدم غير المعقم إلى هذه الوظيفة. يمكن استخدام أي إدخال يحتوي على أحرف التعريف الفوقية الخاصة بـ shell لتشغيل تنفيذ أمر عشوائي.**

يمكن استخدام وسيطة ثالثة لتحديد خيارات إضافية، مع هذه الإعدادات الافتراضية:

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
استخدم `cwd` لتحديد دليل العمل الذي يتم منه إنشاء العملية. إذا لم يتم تحديده، فسيكون الإعداد الافتراضي هو وراثة دليل العمل الحالي. إذا تم تقديمه، ولكن المسار غير موجود، فستقوم العملية الفرعية بإصدار خطأ `ENOENT` والخروج على الفور. يتم أيضًا إصدار `ENOENT` عندما لا يكون الأمر موجودًا.

استخدم `env` لتحديد متغيرات البيئة التي ستكون مرئية للعملية الجديدة، والإعداد الافتراضي هو [`process.env`](/ar/nodejs/api/process#processenv).

سيتم تجاهل القيم `undefined` في `env`.

مثال على تشغيل `ls -lh /usr`، والتقاط `stdout` و `stderr` ورمز الخروج:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

مثال: طريقة تفصيلية للغاية لتشغيل `ps ax | grep ssh`

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

مثال على التحقق من فشل `spawn`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

ستستخدم بعض الأنظمة الأساسية (macOS و Linux) قيمة `argv[0]` لعنوان العملية بينما ستستخدم أنظمة أخرى (Windows و SunOS) `command`.

تقوم Node.js بالكتابة فوق `argv[0]` بـ `process.execPath` عند بدء التشغيل، لذلك لن تتطابق `process.argv[0]` في عملية Node.js الفرعية مع معلمة `argv0` التي تم تمريرها إلى `spawn` من الأصل. استردها باستخدام الخاصية `process.argv0` بدلاً من ذلك.

إذا تم تمكين الخيار `signal`، فإن استدعاء `.abort()` على `AbortController` المقابل يشبه استدعاء `.kill()` على العملية الفرعية باستثناء أن الخطأ الذي تم تمريره إلى رد الاتصال سيكون `AbortError`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```
:::


#### `options.detached` {#optionsdetached}

**تمت الإضافة في: الإصدار v0.7.10**

في نظام التشغيل Windows، يؤدي تعيين `options.detached` على `true` إلى تمكين العملية الفرعية من الاستمرار في التشغيل بعد خروج العملية الأصل. سيكون للعملية الفرعية نافذة وحدة تحكم خاصة بها. بمجرد تمكينها لعملية فرعية، لا يمكن تعطيلها.

في الأنظمة الأساسية غير Windows، إذا تم تعيين `options.detached` على `true`، فستصبح العملية الفرعية قائدة لمجموعة عمليات وجلسة جديدة. قد تستمر العمليات الفرعية في التشغيل بعد خروج العملية الأصل بغض النظر عما إذا كانت منفصلة أم لا. راجع [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) لمزيد من المعلومات.

بشكل افتراضي، ستنتظر العملية الأصل لخروج العملية الفرعية المنفصلة. لمنع العملية الأصل من انتظار خروج `subprocess` معين، استخدم طريقة `subprocess.unref()`. سيؤدي القيام بذلك إلى عدم تضمين حلقة أحداث العملية الأصل العملية الفرعية في عدد مراجعها، مما يسمح للعملية الأصل بالخروج بشكل مستقل عن العملية الفرعية، ما لم تكن هناك قناة IPC ثابتة بين العمليتين الفرعية والأصلية.

عند استخدام خيار `detached` لبدء عملية طويلة الأمد، لن تظل العملية قيد التشغيل في الخلفية بعد خروج الأصل ما لم يتم تزويدها بتكوين `stdio` غير متصل بالأصل. إذا تم توريث `stdio` للعملية الأصل، فستظل العملية الفرعية مرتبطة بالمحطة الطرفية المتحكمة.

مثال لعملية طويلة الأمد، عن طريق الفصل وأيضًا تجاهل واصفات ملف `stdio` الأصلية، من أجل تجاهل إنهاء الأصل:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

بدلاً من ذلك، يمكن للمرء إعادة توجيه إخراج العملية الفرعية إلى الملفات:

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v15.6.0, v14.18.0 | تمت إضافة علامة stdio `overlapped`. |
| v3.3.1 | يتم الآن قبول القيمة `0` كواصف ملف. |
| v0.7.10 | تمت الإضافة في: v0.7.10 |
:::

يستخدم خيار `options.stdio` لتكوين الأنابيب التي يتم إنشاؤها بين العملية الأصل والعملية الفرعية. افتراضيًا، تتم إعادة توجيه stdin و stdout و stderr للعملية الفرعية إلى التدفقات المقابلة [`subprocess.stdin`](/ar/nodejs/api/child_process#subprocessstdin) و [`subprocess.stdout`](/ar/nodejs/api/child_process#subprocessstdout) و [`subprocess.stderr`](/ar/nodejs/api/child_process#subprocessstderr) على كائن [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess). هذا يعادل تعيين `options.stdio` مساويًا لـ `['pipe', 'pipe', 'pipe']`.

للتيسير، يمكن أن يكون `options.stdio` أحد السلاسل التالية:

- `'pipe'`: يعادل `['pipe', 'pipe', 'pipe']` (افتراضي)
- `'overlapped'`: يعادل `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`: يعادل `['ignore', 'ignore', 'ignore']`
- `'inherit'`: يعادل `['inherit', 'inherit', 'inherit']` أو `[0, 1, 2]`

بخلاف ذلك، فإن قيمة `options.stdio` هي مصفوفة حيث يتوافق كل فهرس مع fd في العملية الفرعية. تتوافق fds 0 و 1 و 2 مع stdin و stdout و stderr، على التوالي. يمكن تحديد fds إضافية لإنشاء أنابيب إضافية بين الأصل والفرع. القيمة هي واحدة مما يلي:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// سيستخدم الطفل stdios الأصل.
spawn('prg', [], { stdio: 'inherit' });

// فرخ الطفل الذي يشارك stderr فقط.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// افتح fd=4 إضافيًا للتفاعل مع البرامج التي تقدم
// واجهة نمط startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// سيستخدم الطفل stdios الأصل.
spawn('prg', [], { stdio: 'inherit' });

// فرخ الطفل الذي يشارك stderr فقط.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// افتح fd=4 إضافيًا للتفاعل مع البرامج التي تقدم
// واجهة نمط startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*تجدر الإشارة إلى أنه عند إنشاء قناة IPC بين الأصل والعمليات الفرعية، وكانت العملية الفرعية مثيل Node.js، يتم إطلاق العملية الفرعية بقناة IPC غير مرجعية (باستخدام
<code>unref()</code>) حتى تقوم العملية الفرعية بتسجيل معالج أحداث للحدث
<a href="process.html#event-disconnect"><code>'disconnect'</code></a> أو الحدث <a href="process.html#event-message"><code>'message'</code></a>. يسمح هذا للعملية
الفرعية بالخروج بشكل طبيعي دون أن يتم الاحتفاظ بالعملية مفتوحة بواسطة
قناة IPC المفتوحة.* انظر أيضًا: [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) و [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options).


## إنشاء العمليات المتزامنة {#synchronous-process-creation}

الطرق [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options)، و [`child_process.execSync()`](/ar/nodejs/api/child_process#child_processexecsynccommand-options)، و [`child_process.execFileSync()`](/ar/nodejs/api/child_process#child_processexecfilesyncfile-args-options) هي طرق متزامنة وستقوم بحظر حلقة أحداث Node.js، مما يؤدي إلى إيقاف تنفيذ أي كود إضافي حتى تنتهي العملية المتفرعة.

تعتبر الاستدعاءات الحظرية مثل هذه مفيدة في الغالب لتبسيط مهام البرمجة النصية ذات الأغراض العامة ولتبسيط تحميل/معالجة تكوين التطبيق عند بدء التشغيل.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.4.0، الإصدار 14.18.0 | يمكن أن يكون خيار `cwd` كائن `URL` لـ WHATWG باستخدام بروتوكول `file:`. |
| الإصدار 10.10.0 | يمكن أن يكون خيار `input` الآن أي `TypedArray` أو `DataView`. |
| الإصدار 8.8.0 | خيار `windowsHide` مدعوم الآن. |
| الإصدار 8.0.0 | يمكن أن يكون خيار `input` الآن `Uint8Array`. |
| الإصدار 6.2.1، الإصدار 4.5.0 | يمكن الآن تعيين خيار `encoding` صراحةً إلى `buffer`. |
| الإصدار 0.11.12 | تمت الإضافة في: الإصدار 0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم أو مسار الملف القابل للتنفيذ المراد تشغيله.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة وسيطات السلسلة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) دليل العمل الحالي للعملية الفرعية.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) القيمة التي سيتم تمريرها كـ stdin إلى العملية المتفرعة. إذا تم تعيين `stdio[0]` إلى `'pipe'`، فإن توفير هذه القيمة سيؤدي إلى تجاوز `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تكوين stdio للعملية الفرعية. انظر [`stdio`](/ar/nodejs/api/child_process#optionsstdio) في [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options). سيتم إخراج `stderr` افتراضيًا إلى stderr للعملية الأصلية ما لم يتم تحديد `stdio`. **الافتراضي:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج قيم المفاتيح للبيئة. **الافتراضي:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن هوية المستخدم للعملية (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن هوية المجموعة للعملية (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بالمللي ثانية، الحد الأقصى للوقت المسموح بتشغيل العملية. **الافتراضي:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الإشارة التي سيتم استخدامها عند إنهاء العملية المتفرعة. **الافتراضي:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر كمية من البيانات بالبايت مسموح بها على stdout أو stderr. إذا تم تجاوزها، فسيتم إنهاء العملية الفرعية. انظر التحذير في [`maxBuffer` و Unicode](/ar/nodejs/api/child_process#maxbuffer-and-unicode). **الافتراضي:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز المستخدم لجميع مدخلات ومخرجات stdio. **الافتراضي:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إخفاء نافذة وحدة التحكم الفرعية التي يتم إنشاؤها عادةً على أنظمة Windows. **الافتراضي:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `true`، فسيتم تشغيل `command` داخل shell. يستخدم `'/bin/sh'` على Unix، و `process.env.ComSpec` على Windows. يمكن تحديد shell مختلف كسلسلة. انظر [متطلبات Shell](/ar/nodejs/api/child_process#shell-requirements) و [Shell Windows الافتراضي](/ar/nodejs/api/child_process#default-windows-shell). **الافتراضي:** `false` (بدون shell).
  
 
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) stdout من الأمر.

تعتبر الطريقة `child_process.execFileSync()` متطابقة بشكل عام مع [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) باستثناء أن الطريقة لن تعود حتى يتم إغلاق العملية الفرعية بالكامل. عند مواجهة مهلة زمنية وإرسال `killSignal`، لن تعود الطريقة حتى تنتهي العملية تمامًا.

إذا اعترضت العملية الفرعية على إشارة `SIGTERM` وتعاملت معها ولم تنته، فستظل العملية الأصلية تنتظر حتى تنتهي العملية الفرعية.

إذا انتهت مهلة العملية أو كان رمز الخروج غير صفري، فستقوم هذه الطريقة بإخراج [`Error`](/ar/nodejs/api/errors#class-error) يتضمن النتيجة الكاملة لـ [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options) الأساسي.

**إذا تم تمكين خيار <code>shell</code>، فلا تمرر مدخلات المستخدم غير المعقمة إلى هذه
الدالة. يمكن استخدام أي مدخلات تحتوي على أحرف التعريف الخاصة بـ shell لتشغيل
تنفيذ الأوامر العشوائية.**



::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::

### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.4.0, v14.18.0 | يمكن أن يكون خيار `cwd` كائن `URL` لـ WHATWG باستخدام بروتوكول `file:`. |
| v10.10.0 | يمكن لخيار `input` الآن أن يكون أي `TypedArray` أو `DataView`. |
| v8.8.0 | خيار `windowsHide` مدعوم الآن. |
| v8.0.0 | يمكن لخيار `input` الآن أن يكون `Uint8Array`. |
| v0.11.12 | أُضيف في: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الأمر المراد تشغيله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) دليل العمل الحالي للعملية الفرعية.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) القيمة التي ستمرر كـ stdin للعملية المتفرعة. إذا تم تعيين `stdio[0]` إلى `'pipe'`، فإن توفير هذه القيمة سيتجاوز `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تهيئة stdio للعملية الفرعية. انظر [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ar/nodejs/api/child_process#optionsstdio). سيتم إخراج `stderr` افتراضيًا إلى stderr للعملية الأصلية ما لم يتم تحديد `stdio`. **الافتراضي:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج المفتاح والقيمة للبيئة. **الافتراضي:** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الصدفة لتنفيذ الأمر بها. انظر [متطلبات الصدفة](/ar/nodejs/api/child_process#shell-requirements) و [صدفة Windows الافتراضية](/ar/nodejs/api/child_process#default-windows-shell). **الافتراضي:** `'/bin/sh'` على Unix، `process.env.ComSpec` على Windows.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد هوية المستخدم للعملية. (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد هوية المجموعة للعملية. (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى للوقت المسموح للعملية بالتشغيل بالمللي ثانية. **الافتراضي:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الإشارة التي سيتم استخدامها عند إنهاء العملية المتفرعة. **الافتراضي:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر كمية من البيانات بالبايت مسموح بها على stdout أو stderr. إذا تم تجاوزها، فسيتم إنهاء العملية الفرعية وسيتم اقتطاع أي إخراج. انظر التحذير في [`maxBuffer` و Unicode](/ar/nodejs/api/child_process#maxbuffer-and-unicode). **الافتراضي:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز المستخدم لجميع مدخلات ومخرجات stdio. **الافتراضي:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إخفاء نافذة وحدة التحكم الفرعية التي يتم إنشاؤها عادةً على أنظمة Windows. **الافتراضي:** `false`.

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) stdout من الأمر.

تعتبر طريقة `child_process.execSync()` مماثلة بشكل عام لـ [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) باستثناء أن الطريقة لن تعود حتى يتم إغلاق العملية الفرعية بالكامل. عند مواجهة مهلة زمنية وإرسال `killSignal`، لن تعود الطريقة حتى يتم إنهاء العملية بالكامل. إذا اعترضت العملية الفرعية إشارة `SIGTERM` وتعاملت معها ولم تنته، فستنتظر العملية الأصلية حتى تنتهي العملية الفرعية.

إذا انتهت مهلة العملية أو كان لديها رمز خروج غير صفري، فستطرح هذه الطريقة. سيحتوي كائن [`Error`](/ar/nodejs/api/errors#class-error) على النتيجة بأكملها من [`child_process.spawnSync()`](/ar/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**لا تقم أبدًا بتمرير مدخلات مستخدم غير معقمة إلى هذه الوظيفة. يمكن استخدام أي مدخلات تحتوي على أحرف تعريف الصدفة لإطلاق تنفيذ أوامر عشوائية.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.4.0, v14.18.0 | يمكن أن يكون خيار `cwd` كائن `URL` متوافق مع WHATWG باستخدام بروتوكول `file:`. |
| v10.10.0 | يمكن أن يكون خيار `input` الآن أي `TypedArray` أو `DataView`. |
| v8.8.0 | خيار `windowsHide` مدعوم الآن. |
| v8.0.0 | يمكن أن يكون خيار `input` الآن `Uint8Array`. |
| v5.7.0 | خيار `shell` مدعوم الآن. |
| v6.2.1, v4.5.0 | يمكن الآن تعيين خيار `encoding` بشكل صريح على `buffer`. |
| v0.11.12 | تمت إضافته في: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الأمر المراد تشغيله.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة بالوسائط النصية.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) دليل العمل الحالي للعملية الفرعية.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) القيمة التي سيتم تمريرها كـ stdin إلى العملية المتفرعة. إذا تم تعيين `stdio[0]` على `'pipe'`، فإن توفير هذه القيمة سيتجاوز `stdio[0]`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قم بتعيين قيمة `argv[0]` المرسلة إلى العملية الفرعية بشكل صريح. سيتم تعيين هذا إلى `command` إذا لم يتم تحديده.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تكوين stdio للطفل. انظر [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ar/nodejs/api/child_process#optionsstdio). **الافتراضي:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج قيم مفاتيح البيئة. **الافتراضي:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين هوية المستخدم للعملية (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين هوية المجموعة للعملية (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بالمللي ثانية، الحد الأقصى للوقت المسموح بتشغيل العملية خلاله. **الافتراضي:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة الإشارة التي سيتم استخدامها عند قتل العملية المتفرعة. **الافتراضي:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أكبر كمية من البيانات بالبايت مسموح بها على stdout أو stderr. إذا تم تجاوزها، فسيتم إنهاء العملية الفرعية واقتطاع أي إخراج. راجع التحذير في [`maxBuffer` و Unicode](/ar/nodejs/api/child_process#maxbuffer-and-unicode). **الافتراضي:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز المستخدم لجميع مدخلات ومخرجات stdio. **الافتراضي:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت `true`، فسيتم تشغيل `command` داخل shell. يستخدم `'/bin/sh'` على Unix، و `process.env.ComSpec` على Windows. يمكن تحديد shell مختلف كسلسلة. انظر [متطلبات Shell](/ar/nodejs/api/child_process#shell-requirements) و [Shell Windows الافتراضي](/ar/nodejs/api/child_process#default-windows-shell). **الافتراضي:** `false` (بدون shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لا يتم إجراء اقتباس أو إلغاء لعلامات الاقتباس للوسائط على Windows. يتم تجاهله على Unix. يتم تعيين هذا تلقائيًا على `true` عندما يتم تحديد `shell` وهو CMD. **الافتراضي:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إخفاء نافذة وحدة التحكم للعملية الفرعية التي يتم إنشاؤها عادةً على أنظمة Windows. **الافتراضي:** `false`.


- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف العملية للعملية الفرعية.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة النتائج من إخراج stdio.
    - `stdout` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) محتويات `output[1]`.
    - `stderr` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) محتويات `output[2]`.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) رمز الخروج للعملية الفرعية، أو `null` إذا تم إنهاء العملية الفرعية بسبب إشارة.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الإشارة المستخدمة لقتل العملية الفرعية، أو `null` إذا لم يتم إنهاء العملية الفرعية بسبب إشارة.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) كائن الخطأ إذا فشلت العملية الفرعية أو انتهى وقتها.

طريقة `child_process.spawnSync()` مماثلة بشكل عام لـ [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) باستثناء أن الدالة لن ترجع حتى يتم إغلاق العملية الفرعية بالكامل. عندما تتم مواجهة مهلة ويتم إرسال `killSignal`، لن ترجع الطريقة حتى تنتهي العملية تمامًا. إذا اعترضت العملية إشارة `SIGTERM` وتعاملت معها ولم تنته، فستنتظر العملية الأصل حتى تنتهي العملية الفرعية.

**إذا تم تمكين خيار <code>shell</code>، فلا تمرر مدخلات المستخدم غير المعقمة إلى هذه
الدالة. يمكن استخدام أي مدخلات تحتوي على أحرف shell الوصفية لتشغيل
تنفيذ الأمر العشوائي.**


## الفئة: `ChildProcess` {#class-childprocess}

**أُضيف في: v2.2.0**

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

تمثل مثيلات `ChildProcess` العمليات الفرعية المتفرعة.

لا يُقصد إنشاء مثيلات `ChildProcess` مباشرةً. بدلاً من ذلك، استخدم الطرق [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) أو [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback) أو [`child_process.execFile()`](/ar/nodejs/api/child_process#child_processexecfilefile-args-options-callback) أو [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options) لإنشاء مثيلات `ChildProcess`.

### الحدث: `'close'` {#event-close}

**أُضيف في: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز الخروج إذا انتهت العملية الفرعية من تلقاء نفسها.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الإشارة التي تم بها إنهاء العملية الفرعية.

يتم إصدار الحدث `'close'` بعد انتهاء العملية *و* إغلاق تدفقات الإدخال والإخراج القياسية لعملية فرعية. يختلف هذا عن الحدث [`'exit'`](/ar/nodejs/api/child_process#event-exit)، حيث قد تشترك عمليات متعددة في نفس تدفقات الإدخال والإخراج القياسية. سيصدر الحدث `'close'` دائمًا بعد إصدار [`'exit'`](/ar/nodejs/api/child_process#event-exit) بالفعل، أو [`'error'`](/ar/nodejs/api/child_process#event-error) إذا فشلت العملية الفرعية في التفريخ.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### حدث: `'disconnect'` {#event-disconnect}

**تمت الإضافة في: v0.7.2**

يتم إصدار حدث `'disconnect'` بعد استدعاء الأسلوب [`subprocess.disconnect()`](/ar/nodejs/api/child_process#subprocessdisconnect) في العملية الرئيسية أو [`process.disconnect()`](/ar/nodejs/api/process#processdisconnect) في العملية الفرعية. بعد قطع الاتصال، لن يكون من الممكن إرسال أو استقبال الرسائل، وستكون الخاصية [`subprocess.connected`](/ar/nodejs/api/child_process#subprocessconnected) هي `false`.

### حدث: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الخطأ.

يتم إصدار حدث `'error'` كلما:

- لم يتمكن من إنشاء العملية.
- لم يتمكن من إنهاء العملية.
- فشل إرسال رسالة إلى العملية الفرعية.
- تم إجهاض العملية الفرعية عبر خيار `signal`.

قد يتم أو لا يتم إطلاق حدث `'exit'` بعد حدوث خطأ. عند الاستماع إلى كل من حدثي `'exit'` و `'error'`، احذر من استدعاء وظائف المعالجة عدة مرات عن طريق الخطأ.

انظر أيضًا [`subprocess.kill()`](/ar/nodejs/api/child_process#subprocesskillsignal) و [`subprocess.send()`](/ar/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### حدث: `'exit'` {#event-exit}

**تمت الإضافة في: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز الخروج إذا انتهت العملية الفرعية من تلقاء نفسها.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الإشارة التي تم بها إنهاء العملية الفرعية.

يتم إصدار حدث `'exit'` بعد انتهاء العملية الفرعية. إذا انتهت العملية، فسيكون `code` هو رمز الخروج النهائي للعملية، وإلا `null`. إذا انتهت العملية بسبب تلقي إشارة، فسيكون `signal` هو الاسم النصي للإشارة، وإلا `null`. سيكون أحدهما دائمًا غير `null`.

عندما يتم تشغيل حدث `'exit'`، قد تظل تدفقات stdio للعملية الفرعية مفتوحة.

تؤسس Node.js معالجات الإشارات لـ `SIGINT` و `SIGTERM` ولن تنتهي عمليات Node.js على الفور بسبب تلقي تلك الإشارات. بدلاً من ذلك، ستقوم Node.js بتنفيذ سلسلة من إجراءات التنظيف ثم ستعيد إطلاق الإشارة التي تمت معالجتها.

انظر [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### الحدث: `'message'` {#event-message}

**أضيف في: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن JSON مُحلّل أو قيمة أولية.
- `sendHandle` [\<Handle\>](/ar/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` أو كائن [`net.Socket`](/ar/nodejs/api/net#class-netsocket) أو [`net.Server`](/ar/nodejs/api/net#class-netserver) أو [`dgram.Socket`](/ar/nodejs/api/dgram#class-dgramsocket).

يتم تشغيل الحدث `'message'` عندما تستخدم عملية فرعية [`process.send()`](/ar/nodejs/api/process#processsendmessage-sendhandle-options-callback) لإرسال رسائل.

تمر الرسالة بعمليتي التسلسل والتحليل. قد لا تكون الرسالة الناتجة هي نفسها التي تم إرسالها في الأصل.

إذا تم تعيين خيار `serialization` إلى `'advanced'` عند إنشاء العملية الفرعية، يمكن أن تحتوي وسيطة `message` على بيانات لا يستطيع JSON تمثيلها. انظر [تسلسل متقدم](/ar/nodejs/api/child_process#advanced-serialization) لمزيد من التفاصيل.

### الحدث: `'spawn'` {#event-spawn}

**أضيف في: v15.1.0, v14.17.0**

يتم إطلاق الحدث `'spawn'` بمجرد أن يتم إنشاء العملية الفرعية بنجاح. إذا لم يتم إنشاء العملية الفرعية بنجاح، فلن يتم إطلاق الحدث `'spawn'` وسيتم إطلاق الحدث `'error'` بدلاً من ذلك.

إذا تم إطلاقه، فإن الحدث `'spawn'` يأتي قبل جميع الأحداث الأخرى وقبل استلام أي بيانات عبر `stdout` أو `stderr`.

سيتم إطلاق الحدث `'spawn'` بغض النظر عما إذا كان هناك خطأ يحدث **داخل** العملية التي تم إنشاؤها. على سبيل المثال، إذا تم إنشاء `bash some-command` بنجاح، فسيتم إطلاق الحدث `'spawn'`، على الرغم من أن `bash` قد تفشل في إنشاء `some-command`. ينطبق هذا التحذير أيضًا عند استخدام `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | لم يعد الكائن يعرض عن طريق الخطأ روابط C++ الأصلية. |
| v7.1.0 | أضيف في: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) قناة تمثل قناة IPC للعملية الفرعية.

الخاصية `subprocess.channel` هي مرجع إلى قناة IPC الخاصة بالعملية الفرعية. إذا لم تكن هناك قناة IPC موجودة، فستكون هذه الخاصية `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**أُضيف في: v7.1.0**

هذا التابع يجعل قناة IPC تُبقي حلقة الأحداث للعملية الأب قيد التشغيل إذا استُدعي التابع `.unref()` من قبل.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**أُضيف في: v7.1.0**

هذا التابع يجعل قناة IPC لا تُبقي حلقة الأحداث للعملية الأب قيد التشغيل، ويسمح لها بالانتهاء حتى في حالة كانت القناة مفتوحة.

### `subprocess.connected` {#subprocessconnected}

**أُضيف في: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تُعيَّن إلى `false` بعد استدعاء `subprocess.disconnect()`.

خاصية `subprocess.connected` تشير إلى ما إذا كان لا يزال من الممكن إرسال واستقبال الرسائل من عملية فرعية. عندما تكون قيمة `subprocess.connected` هي `false`، فإنه لم يعد من الممكن إرسال أو استقبال الرسائل.

### `subprocess.disconnect()` {#subprocessdisconnect}

**أُضيف في: v0.7.2**

تُغلق قناة IPC بين العملية الأب والعملية الفرعية، مما يسمح للعملية الفرعية بالخروج بأمان بمجرد عدم وجود اتصالات أخرى تبقيها قيد التشغيل. بعد استدعاء هذا التابع، ستُعيَّن خاصيتا `subprocess.connected` و `process.connected` في كل من العملية الأب والعملية الفرعية (على التوالي) إلى `false`، ولن يكون من الممكن تمرير الرسائل بين العمليتين.

سيتم إطلاق الحدث `'disconnect'` عندما لا توجد رسائل قيد الاستلام. غالبًا ما يتم تشغيل هذا مباشرةً بعد استدعاء `subprocess.disconnect()`.

عندما تكون العملية الفرعية عبارة عن نسخة Node.js (مثل، تم إنشاؤها باستخدام [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options))، يمكن استدعاء التابع `process.disconnect()` داخل العملية الفرعية لإغلاق قناة IPC أيضًا.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تشير خاصية `subprocess.exitCode` إلى رمز الخروج للعملية الفرعية. إذا كانت العملية الفرعية لا تزال قيد التشغيل، فسيكون الحقل `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**أُضيف في: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يرسل التابع `subprocess.kill()` إشارة إلى العملية الفرعية. إذا لم يتم إعطاء أي وسيط، فسيتم إرسال الإشارة `'SIGTERM'` إلى العملية. انظر [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) للحصول على قائمة بالإشارات المتاحة. تُرجع هذه الدالة `true` إذا نجحت [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)، و `false` بخلاف ذلك.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

قد يُصدر الكائن [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess) الحدث [`'error'`](/ar/nodejs/api/child_process#event-error) إذا تعذر تسليم الإشارة. إرسال إشارة إلى عملية فرعية انتهت بالفعل ليس خطأ ولكنه قد يكون له عواقب غير متوقعة. على وجه التحديد، إذا تم إعادة تعيين معرف العملية (PID) إلى عملية أخرى، فسيتم تسليم الإشارة إلى تلك العملية بدلاً من ذلك، مما قد يؤدي إلى نتائج غير متوقعة.

على الرغم من أن الدالة تسمى `kill`، إلا أن الإشارة التي يتم تسليمها إلى العملية الفرعية قد لا تنهي العملية فعليًا.

انظر [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) للرجوع إليه.

في نظام التشغيل Windows، حيث لا توجد إشارات POSIX، سيتم تجاهل الوسيط `signal` باستثناء `'SIGKILL'` و `'SIGTERM'` و `'SIGINT'` و `'SIGQUIT'`، وسيتم دائمًا قتل العملية بالقوة وبشكل مفاجئ (على غرار `'SIGKILL'`). انظر [أحداث الإشارة](/ar/nodejs/api/process#signal-events) لمزيد من التفاصيل.

في نظام التشغيل Linux، لن يتم إنهاء العمليات الفرعية للعمليات الفرعية عند محاولة قتل العملية الأب الخاصة بها. من المحتمل أن يحدث هذا عند تشغيل عملية جديدة في shell أو باستخدام الخيار `shell` الخاص بـ `ChildProcess`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**تمت الإضافة في: v20.5.0، v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`subprocess.kill()`](/ar/nodejs/api/child_process#subprocesskillsignal) مع `'SIGTERM'`.

### `subprocess.killed` {#subprocesskilled}

**تمت الإضافة في: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يتم تعيينها إلى `true` بعد استخدام `subprocess.kill()` لإرسال إشارة بنجاح إلى العملية الفرعية.

تشير الخاصية `subprocess.killed` إلى ما إذا كانت العملية الفرعية قد تلقت إشارة بنجاح من `subprocess.kill()`. لا تشير الخاصية `killed` إلى أن العملية الفرعية قد تم إنهاؤها.

### `subprocess.pid` {#subprocesspid}

**تمت الإضافة في: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

إرجاع مُعرّف العملية (PID) للعملية الفرعية. إذا فشلت العملية الفرعية في الإنشاء بسبب أخطاء، فستكون القيمة `undefined` ويتم إصدار `error`.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**تمت الإضافة في: v0.7.10**

ستؤدي استدعاء `subprocess.ref()` بعد إجراء استدعاء إلى `subprocess.unref()` إلى استعادة عدد المراجع الذي تمت إزالته للعملية الفرعية، مما يجبر العملية الأصلية على الانتظار حتى تخرج العملية الفرعية قبل الخروج بنفسها.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v5.8.0 | يتم الآن دعم المعامل `options`، وخيار `keepOpen` على وجه الخصوص. |
| v5.0.0 | تُرجع هذه الطريقة قيمة منطقية للتحكم في التدفق الآن. |
| v4.0.0 | يتم الآن دعم المعامل `callback`. |
| v0.5.9 | تمت إضافته في: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ar/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`، أو كائن [`net.Socket`](/ar/nodejs/api/net#class-netsocket) أو [`net.Server`](/ar/nodejs/api/net#class-netserver) أو [`dgram.Socket`](/ar/nodejs/api/dgram#class-dgramsocket).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الوسيطة `options`، إذا كانت موجودة، هي كائن يُستخدم لتهيئة إرسال أنواع معينة من المقابض. يدعم `options` الخصائص التالية:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) قيمة يمكن استخدامها عند تمرير مثيلات `net.Socket`. عندما تكون القيمة `true`، يتم إبقاء المقبس مفتوحًا في عملية الإرسال. **الافتراضي:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

عندما يتم إنشاء قناة IPC بين العمليات الأصل والفرعية (أي عند استخدام [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options))، يمكن استخدام الطريقة `subprocess.send()` لإرسال رسائل إلى العملية الفرعية. عندما تكون العملية الفرعية عبارة عن مثيل Node.js، يمكن استقبال هذه الرسائل عبر الحدث [`'message'`](/ar/nodejs/api/process#event-message).

تمر الرسالة بعملية تسلسل وتحليل. قد لا تكون الرسالة الناتجة هي نفسها الرسالة التي تم إرسالها في الأصل.

على سبيل المثال، في البرنامج النصي الأصلي:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

ثم قد يبدو البرنامج النصي الفرعي، `'sub.js'` هكذا:

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
سيكون للعمليات الفرعية في Node.js طريقة [`process.send()`](/ar/nodejs/api/process#processsendmessage-sendhandle-options-callback) خاصة بها تسمح للعملية الفرعية بإرسال رسائل مرة أخرى إلى العملية الأصلية.

هناك حالة خاصة عند إرسال رسالة `{cmd: 'NODE_foo'}`. الرسائل التي تحتوي على بادئة `NODE_` في الخاصية `cmd` محجوزة للاستخدام داخل Node.js core ولن يتم إصدارها في حدث [`'message'`](/ar/nodejs/api/process#event-message) الخاص بالعملية الفرعية. بدلاً من ذلك، يتم إصدار هذه الرسائل باستخدام حدث `'internalMessage'` وتستهلكها Node.js داخليًا. يجب على التطبيقات تجنب استخدام هذه الرسائل أو الاستماع إلى أحداث `'internalMessage'` لأنها عرضة للتغيير دون إشعار.

الوسيطة الاختيارية `sendHandle` التي يمكن تمريرها إلى `subprocess.send()` هي لتمرير خادم TCP أو كائن مقبس إلى العملية الفرعية. ستتلقى العملية الفرعية الكائن كوسيطة ثانية تم تمريرها إلى دالة رد الاتصال المسجلة في الحدث [`'message'`](/ar/nodejs/api/process#event-message). لن يتم إرسال أي بيانات يتم استقبالها وتخزينها مؤقتًا في المقبس إلى العملية الفرعية. لا يتم دعم إرسال مقابس IPC على نظام التشغيل Windows.

`callback` الاختياري هو دالة يتم استدعاؤها بعد إرسال الرسالة ولكن قبل أن تكون العملية الفرعية قد استقبلتها. يتم استدعاء الدالة بوسيطة واحدة: `null` في حالة النجاح، أو كائن [`Error`](/ar/nodejs/api/errors#class-error) في حالة الفشل.

إذا لم يتم توفير دالة `callback` ولا يمكن إرسال الرسالة، فسيتم إصدار حدث `'error'` بواسطة كائن [`ChildProcess`](/ar/nodejs/api/child_process#class-childprocess). يمكن أن يحدث هذا، على سبيل المثال، عندما تكون العملية الفرعية قد انتهت بالفعل.

ستُرجع `subprocess.send()` القيمة `false` إذا كانت القناة مغلقة أو عندما يتجاوز تراكم الرسائل غير المرسلة حدًا يجعل إرسال المزيد من الرسائل أمرًا غير حكيم. بخلاف ذلك، تُرجع الطريقة القيمة `true`. يمكن استخدام الدالة `callback` لتنفيذ التحكم في التدفق.


#### مثال: إرسال كائن خادم {#example-sending-a-server-object}

يمكن استخدام الوسيطة `sendHandle`، على سبيل المثال، لتمرير معرّف كائن خادم TCP إلى العملية الفرعية كما هو موضح في المثال أدناه:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// افتح كائن الخادم وأرسل المعرّف.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// افتح كائن الخادم وأرسل المعرّف.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

ستتلقى العملية الفرعية بعد ذلك كائن الخادم على النحو التالي:

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
بمجرد مشاركة الخادم الآن بين الأصل والفرع، يمكن معالجة بعض الاتصالات بواسطة الأصل وبعضها بواسطة الفرع.

في حين أن المثال أعلاه يستخدم خادمًا تم إنشاؤه باستخدام الوحدة `node:net`، فإن خوادم الوحدة `node:dgram` تستخدم نفس سير العمل تمامًا باستثناء الاستماع إلى حدث `'message'` بدلاً من `'connection'` واستخدام `server.bind()` بدلاً من `server.listen()`. ومع ذلك، هذا مدعوم فقط على منصات Unix.

#### مثال: إرسال كائن socket {#example-sending-a-socket-object}

وبالمثل، يمكن استخدام الوسيطة `sendHandler` لتمرير معرّف socket إلى العملية الفرعية. يفرّخ المثال أدناه عمليتين فرعيتين تعالجان كل منهما الاتصالات بأولوية "عادية" أو "خاصة":

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// افتح الخادم وأرسل sockets إلى الفرع. استخدم pauseOnConnect لمنع
// قراءة sockets قبل إرسالها إلى العملية الفرعية.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // إذا كانت هذه أولوية خاصة ...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // هذه أولوية عادية.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// افتح الخادم وأرسل sockets إلى الفرع. استخدم pauseOnConnect لمنع
// قراءة sockets قبل إرسالها إلى العملية الفرعية.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // إذا كانت هذه أولوية خاصة ...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // هذه أولوية عادية.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

سيتلقى `subprocess.js` معرّف socket كالوسيطة الثانية التي تم تمريرها إلى دالة رد الاتصال بالحدث:

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // تحقق من وجود socket العميل.
      // من الممكن إغلاق socket بين وقت إرساله والوقت الذي يتم
      // استقباله فيه في العملية الفرعية.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
لا تستخدم `.maxConnections` على socket تم تمريره إلى عملية فرعية. لا يمكن للأصل تتبع متى يتم تدمير socket.

يجب على أي معالجات `'message'` في العملية الفرعية التحقق من وجود `socket`، حيث قد تكون الاتصال قد أُغلق خلال الوقت المستغرق لإرسال الاتصال إلى الفرع.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

تشير الخاصية `subprocess.signalCode` إلى الإشارة التي استقبلتها العملية الفرعية، إن وجدت، وإلا `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

تمثل الخاصية `subprocess.spawnargs` القائمة الكاملة لوسائط سطر الأوامر التي تم تشغيل العملية الفرعية بها.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تشير الخاصية `subprocess.spawnfile` إلى اسم الملف القابل للتنفيذ للعملية الفرعية التي تم تشغيلها.

بالنسبة إلى [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options)، ستكون قيمتها مساوية لـ [`process.execPath`](/ar/nodejs/api/process#processexecpath). بالنسبة إلى [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options)، ستكون قيمتها اسم الملف القابل للتنفيذ. بالنسبة إلى [`child_process.exec()`](/ar/nodejs/api/child_process#child_processexeccommand-options-callback)، ستكون قيمتها اسم الصدفة التي تم تشغيل العملية الفرعية فيها.

### `subprocess.stderr` {#subprocessstderr}

**تمت الإضافة في: v0.1.90**

- [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`دفق قابل للقراءة` يمثل `stderr` العملية الفرعية.

إذا تم إنشاء العملية الفرعية مع تعيين `stdio[2]` إلى أي شيء آخر غير `'pipe'`، فسيكون هذا `null`.

`subprocess.stderr` هو اسم مستعار لـ `subprocess.stdio[2]`. ستشير كلتا الخاصيتين إلى نفس القيمة.

يمكن أن تكون الخاصية `subprocess.stderr` `null` أو `undefined` إذا تعذر إنشاء العملية الفرعية بنجاح.


### `subprocess.stdin` {#subprocessstdin}

**أُضيف في: v0.1.90**

- [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Writable Stream` يمثل `stdin` للعملية الفرعية.

إذا كانت عملية فرعية تنتظر قراءة جميع مدخلاتها، فلن تستمر العملية الفرعية حتى يتم إغلاق هذا التدفق عبر `end()`.

إذا تم إنشاء العملية الفرعية مع تعيين `stdio[0]` إلى أي شيء بخلاف `'pipe'`، فسيكون هذا هو `null`.

`subprocess.stdin` هو اسم مستعار لـ `subprocess.stdio[0]`. ستشير كلتا الخاصيتين إلى نفس القيمة.

يمكن أن تكون الخاصية `subprocess.stdin` إما `null` أو `undefined` إذا لم يكن من الممكن إنشاء العملية الفرعية بنجاح.

### `subprocess.stdio` {#subprocessstdio}

**أُضيف في: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

مصفوفة متفرقة من الأنابيب إلى العملية الفرعية، تتوافق مع المواضع في خيار [`stdio`](/ar/nodejs/api/child_process#optionsstdio) الذي تم تمريره إلى [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) التي تم تعيينها إلى القيمة `'pipe'`. يتوفر `subprocess.stdio[0]` و `subprocess.stdio[1]` و `subprocess.stdio[2]` أيضًا كـ `subprocess.stdin` و `subprocess.stdout` و `subprocess.stderr` على التوالي.

في المثال التالي، تم تكوين fd `1` (stdout) الخاص بالعملية الفرعية فقط كأنبوب، لذا فإن `subprocess.stdio[1]` الخاص بالأصل فقط هو تدفق، وجميع القيم الأخرى في المصفوفة هي `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // استخدم stdin الخاص بالأصل للعملية الفرعية.
    'pipe', // وجه stdout الخاص بالعملية الفرعية إلى الأصل.
    fs.openSync('err.out', 'w'), // وجه stderr الخاص بالعملية الفرعية إلى ملف.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // استخدم stdin الخاص بالأصل للعملية الفرعية.
    'pipe', // وجه stdout الخاص بالعملية الفرعية إلى الأصل.
    fs.openSync('err.out', 'w'), // وجه stderr الخاص بالعملية الفرعية إلى ملف.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

يمكن أن تكون الخاصية `subprocess.stdio` هي `undefined` إذا لم يكن من الممكن إنشاء العملية الفرعية بنجاح.


### `subprocess.stdout` {#subprocessstdout}

**تمت الإضافة في: v0.1.90**

- [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Readable Stream` يمثل `stdout` للعملية الفرعية.

إذا تم إنشاء العملية الفرعية مع تعيين `stdio[1]` إلى أي شيء بخلاف `'pipe'`، فسيكون هذا `null`.

`subprocess.stdout` هو اسم مستعار لـ `subprocess.stdio[1]`. ستشير كلتا الخاصيتين إلى نفس القيمة.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

يمكن أن تكون الخاصية `subprocess.stdout` إما `null` أو `undefined` إذا لم يتم إنشاء العملية الفرعية بنجاح.

### `subprocess.unref()` {#subprocessunref}

**تمت الإضافة في: v0.7.10**

بشكل افتراضي، ستنتظر العملية الأصل لخروج العملية الفرعية المنفصلة. لمنع العملية الأصل من انتظار خروج `subprocess` معين، استخدم طريقة `subprocess.unref()`. سيؤدي القيام بذلك إلى عدم تضمين حلقة الأحداث الأصلية العملية الفرعية في عدد المراجع الخاص بها، مما يسمح للأصل بالخروج بشكل مستقل عن الطفل، ما لم تكن هناك قناة IPC ثابتة بين العمليات الفرعية والأصلية.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` والترميز Unicode {#maxbuffer-and-unicode}

يحدد الخيار `maxBuffer` أكبر عدد من البايتات المسموح بها على `stdout` أو `stderr`. إذا تم تجاوز هذه القيمة، فسيتم إنهاء العملية الفرعية. يؤثر هذا على الإخراج الذي يتضمن ترميزات الأحرف متعددة البايتات مثل UTF-8 أو UTF-16. على سبيل المثال، سترسل `console.log('中文测试')` 13 بايتًا مشفرًا بـ UTF-8 إلى `stdout` على الرغم من وجود 4 أحرف فقط.

## متطلبات الصدفة {#shell-requirements}

يجب أن تفهم الصدفة مفتاح `-c`. إذا كانت الصدفة هي `'cmd.exe'`، فيجب أن تفهم المفاتيح `/d /s /c` ويجب أن يكون تحليل سطر الأوامر متوافقًا.

## الصدفة الافتراضية لنظام التشغيل Windows {#default-windows-shell}

على الرغم من أن Microsoft تحدد أن `%COMSPEC%` يجب أن يحتوي على مسار `'cmd.exe'` في البيئة الجذرية، إلا أن العمليات الفرعية ليست دائمًا خاضعة لنفس المتطلبات. وبالتالي، في وظائف `child_process` حيث يمكن إنشاء صدفة، يتم استخدام `'cmd.exe'` كحل بديل إذا كان `process.env.ComSpec` غير متاح.

## التسلسل المتقدم {#advanced-serialization}

**أضيف في: v13.2.0, v12.16.0**

تدعم العمليات الفرعية آلية تسلسل لـ IPC تعتمد على [واجهة برمجة تطبيقات التسلسل الخاصة بوحدة `node:v8`](/ar/nodejs/api/v8#serialization-api)، بناءً على [خوارزمية الاستنساخ المنظم HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). هذا بشكل عام أكثر قوة ويدعم المزيد من أنواع كائنات JavaScript المضمنة، مثل `BigInt` و `Map` و `Set` و `ArrayBuffer` و `TypedArray` و `Buffer` و `Error` و `RegExp` وما إلى ذلك.

ومع ذلك، فإن هذا التنسيق ليس مجموعة فرعية كاملة من JSON، وعلى سبيل المثال، لن يتم تمرير الخصائص المعينة على كائنات من هذه الأنواع المضمنة من خلال خطوة التسلسل. بالإضافة إلى ذلك، قد لا يكون الأداء مكافئًا لأداء JSON، اعتمادًا على هيكل البيانات التي تم تمريرها. لذلك، تتطلب هذه الميزة الاشتراك عن طريق تعيين الخيار `serialization` على `'advanced'` عند استدعاء [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options) أو [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options).

