---
title: خيارات سطر الأوامر في Node.js
description: تقدم هذه الصفحة دليلًا شاملاً لخيارات سطر الأوامر المتاحة في Node.js، موضحة كيفية استخدام الأعلام والمعاملات المختلفة لتكوين بيئة التشغيل، وإدارة التصحيح، والتحكم في سلوك التنفيذ.
head:
  - - meta
    - name: og:title
      content: خيارات سطر الأوامر في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تقدم هذه الصفحة دليلًا شاملاً لخيارات سطر الأوامر المتاحة في Node.js، موضحة كيفية استخدام الأعلام والمعاملات المختلفة لتكوين بيئة التشغيل، وإدارة التصحيح، والتحكم في سلوك التنفيذ.
  - - meta
    - name: twitter:title
      content: خيارات سطر الأوامر في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تقدم هذه الصفحة دليلًا شاملاً لخيارات سطر الأوامر المتاحة في Node.js، موضحة كيفية استخدام الأعلام والمعاملات المختلفة لتكوين بيئة التشغيل، وإدارة التصحيح، والتحكم في سلوك التنفيذ.
---


# واجهة برمجة تطبيقات سطر الأوامر (Command-line API) {#command-line-api}

يأتي Node.js مع مجموعة متنوعة من خيارات سطر الأوامر (CLI). تعرض هذه الخيارات تصحيح الأخطاء المدمج، وطرقًا متعددة لتنفيذ البرامج النصية، وخيارات وقت التشغيل المفيدة الأخرى.

لعرض هذه الوثائق كصفحة دليل في الوحدة الطرفية، قم بتشغيل `man node`.

## ملخص {#synopsis}

`node [options] [V8 options] [\<program-entry-point\> | -e "script" | -] [--] [arguments]`

`node inspect [\<program-entry-point\> | -e "script" | \<host\>:\<port\>] …`

`node --v8-options`

نفّذ بدون وسائط لبدء [REPL](/ar/nodejs/api/repl).

لمزيد من المعلومات حول `node inspect`، راجع وثائق [المصحح](/ar/nodejs/api/debugger).

## نقطة دخول البرنامج {#program-entry-point}

نقطة دخول البرنامج هي سلسلة تشبه المحدد. إذا لم تكن السلسلة مسارًا مطلقًا، فسيتم حلها كمسار نسبي من دليل العمل الحالي. ثم يتم حل هذا المسار بواسطة أداة تحميل وحدة [CommonJS](/ar/nodejs/api/modules). إذا لم يتم العثور على ملف مطابق، فسيتم طرح خطأ.

إذا تم العثور على ملف، فسيتم تمرير مساره إلى [أداة تحميل وحدة ES](/ar/nodejs/api/packages#modules-loaders) في أي من الشروط التالية:

- تم بدء البرنامج بعلامة سطر أوامر تجبر نقطة الدخول على أن يتم تحميلها باستخدام أداة تحميل وحدة ECMAScript، مثل `--import`.
- يحتوي الملف على امتداد `.mjs`.
- لا يحتوي الملف على امتداد `.cjs`، ويحتوي ملف `package.json` الأصل الأقرب على حقل [`"type"`](/ar/nodejs/api/packages#type) ذي المستوى الأعلى بقيمة `"module"`.

بخلاف ذلك، يتم تحميل الملف باستخدام أداة تحميل وحدة CommonJS. راجع [أدوات تحميل الوحدات](/ar/nodejs/api/packages#modules-loaders) لمزيد من التفاصيل.

### تحذير نقطة دخول أداة تحميل وحدات ECMAScript {#ecmascript-modules-loader-entry-point-caveat}

عند التحميل، تقوم [أداة تحميل وحدة ES](/ar/nodejs/api/packages#modules-loaders) بتحميل نقطة دخول البرنامج، سيقبل أمر `node` كمدخلات فقط الملفات بامتدادات `.js` أو `.mjs` أو `.cjs`؛ وبامتدادات `.wasm` عند تمكين [`--experimental-wasm-modules`](/ar/nodejs/api/cli#--experimental-wasm-modules).

## الخيارات {#options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v10.12.0 | يُسمح الآن باستخدام الشرطات السفلية بدلاً من الشرطات لخيارات Node.js أيضًا، بالإضافة إلى خيارات V8. |
:::

تسمح جميع الخيارات، بما في ذلك خيارات V8، بفصل الكلمات عن طريق كل من الشرطات (`-`) أو الشرطات السفلية (`_`). على سبيل المثال، `--pending-deprecation` مكافئ لـ `--pending_deprecation`.

إذا تم تمرير خيار يأخذ قيمة واحدة (مثل `--max-http-header-size`) أكثر من مرة، فسيتم استخدام القيمة التي تم تمريرها الأخيرة. الأولوية للخيارات الموجودة في سطر الأوامر على الخيارات التي تم تمريرها عبر متغير البيئة [`NODE_OPTIONS`](/ar/nodejs/api/cli#node_optionsoptions).


### `-` {#-}

**أُضيف في:** الإصدار 8.0.0

اسم مستعار لـ stdin. وهو مماثل لاستخدام `-` في أدوات سطر الأوامر الأخرى، بمعنى أن البرنامج النصي يُقرأ من stdin، ويتم تمرير بقية الخيارات إلى ذلك البرنامج النصي.

### `--` {#--}

**أُضيف في:** الإصدار 6.11.0

يشير إلى نهاية خيارات node. قم بتمرير بقية الوسائط إلى البرنامج النصي. إذا لم يتم توفير اسم ملف البرنامج النصي أو البرنامج النصي eval/print قبل ذلك، فسيتم استخدام الوسيطة التالية كاسم ملف البرنامج النصي.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**أُضيف في:** الإصدار 0.10.8

يؤدي الإجهاض بدلاً من الخروج إلى إنشاء ملف أساسي للتحليل بعد الوفاة باستخدام مصحح الأخطاء (مثل `lldb` و `gdb` و `mdb`).

إذا تم تمرير هذا العلم، فلا يزال من الممكن تعيين السلوك بحيث لا يتم الإجهاض من خلال [`process.setUncaughtExceptionCaptureCallback()`](/ar/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (ومن خلال استخدام وحدة `node:domain` التي تستخدمه).

### `--allow-addons` {#--allow-addons}

**أُضيف في:** الإصدار 21.6.0، الإصدار 20.12.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

عند استخدام [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model)، لن يتمكن المعالج من استخدام الوظائف الإضافية الأصلية افتراضيًا. محاولات القيام بذلك ستطرح `ERR_DLOPEN_DISABLED` ما لم يقم المستخدم بتمرير العلامة `--allow-addons` بشكل صريح عند بدء Node.js.

مثال:

```js [CJS]
// محاولة طلب وظيفة إضافية أصلية
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**تمت إضافته في: الإصدار 20.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

عند استخدام [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model)، لن يتمكن العملية افتراضيًا من إنشاء أي عملية فرعية. وستؤدي محاولات القيام بذلك إلى ظهور خطأ `ERR_ACCESS_DENIED` ما لم يمرر المستخدم علامة `--allow-child-process` صراحةً عند بدء تشغيل Node.js.

مثال:

```js [ESM]
const childProcess = require('node:child_process');
// محاولة تجاوز الإذن
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | نموذج الأذونات وعلامات --allow-fs مستقرة. |
| v20.7.0 | المسارات التي تفصل بينها فاصلة (`,`) لم تعد مسموح بها. |
| v20.0.0 | تمت إضافته في: الإصدار 20.0.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تحدد هذه العلامة أذونات قراءة نظام الملفات باستخدام [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model).

الحجج الصالحة لعلامة `--allow-fs-read` هي:

- `*` - للسماح لجميع عمليات `FileSystemRead`.
- يمكن السماح بمسارات متعددة باستخدام علامات `--allow-fs-read` متعددة. مثال `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

يمكن العثور على أمثلة في وثائق [أذونات نظام الملفات](/ar/nodejs/api/permissions#file-system-permissions).

يجب أيضًا السماح بوحدة التهيئة. ضع في اعتبارك المثال التالي:

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
تحتاج العملية إلى الوصول إلى وحدة `index.js`:

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | نموذج الأذونات و علامات --allow-fs مستقرة. |
| v20.7.0 | لم يعد مسموحًا بالمسارات المحددة بفواصل (`,`). |
| v20.0.0 | تمت الإضافة في: v20.0.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

يقوم هذا العلم بتكوين أذونات كتابة نظام الملفات باستخدام [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model).

الحجج الصالحة لعلامة `--allow-fs-write` هي:

- `*` - للسماح بجميع عمليات `FileSystemWrite`.
- يمكن السماح بمسارات متعددة باستخدام علامات `--allow-fs-write` متعددة. مثال `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

لم يعد مسموحًا بالمسارات المحددة بفواصل (`,`). عند تمرير علامة واحدة بفارزة، سيتم عرض تحذير.

يمكن العثور على أمثلة في وثائق [أذونات نظام الملفات](/ar/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**تمت الإضافة في: v22.3.0, v20.16.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

عند استخدام [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model)، لن يكون العملية قادرة على إنشاء أي مثيلات WASI افتراضيًا. لأسباب أمنية، ستطرح المكالمة `ERR_ACCESS_DENIED` ما لم يمرر المستخدم صراحةً العلامة `--allow-wasi` في عملية Node.js الرئيسية.

مثال:

```js [ESM]
const { WASI } = require('node:wasi');
// محاولة تجاوز الإذن
new WASI({
  version: 'preview1',
  // محاولة تركيب نظام الملفات بأكمله
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**تمت الإضافة في: v20.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

عند استخدام [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model)، لن يكون العملية قادرة على إنشاء أي سلاسل عاملة افتراضيًا. لأسباب أمنية، ستطرح المكالمة `ERR_ACCESS_DENIED` ما لم يمرر المستخدم صراحةً العلامة `--allow-worker` في عملية Node.js الرئيسية.

مثال:

```js [ESM]
const { Worker } = require('node:worker_threads');
// محاولة تجاوز الإذن
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**تمت الإضافة في: الإصدار 18.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

ينشئ نقطة استرجاع عند خروج العملية ويكتبها على القرص، والتي يمكن تحميلها لاحقًا باستخدام `--snapshot-blob`.

عند إنشاء نقطة الاسترجاع، إذا لم يتم تحديد `--snapshot-blob`، فسيتم كتابة النقطة التي تم إنشاؤها افتراضيًا إلى `snapshot.blob` في دليل العمل الحالي. وإلا فسيتم كتابتها إلى المسار المحدد بواسطة `--snapshot-blob`.

```bash [BASH]
$ echo "globalThis.foo = 'أنا من نقطة الاسترجاع'" > snapshot.js

# قم بتشغيل snapshot.js لتهيئة التطبيق واسترجاع {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# حالته في snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# قم بتحميل نقطة الاسترجاع التي تم إنشاؤها وابدأ التطبيق من index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
أنا من نقطة الاسترجاع
```
يمكن استخدام [`v8.startupSnapshot` API](/ar/nodejs/api/v8#startup-snapshot-api) لتحديد نقطة دخول في وقت إنشاء نقطة الاسترجاع، وبالتالي تجنب الحاجة إلى برنامج نصي إدخال إضافي في وقت إلغاء التسلسل:

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('أنا من نقطة الاسترجاع'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
أنا من نقطة الاسترجاع
```
لمزيد من المعلومات، تحقق من وثائق [`v8.startupSnapshot` API](/ar/nodejs/api/v8#startup-snapshot-api).

حاليًا، يعد دعم نقطة الاسترجاع في وقت التشغيل تجريبيًا في:

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**تمت الإضافة في: الإصدار 21.6.0، الإصدار 20.12.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يحدد المسار إلى ملف تكوين JSON الذي يكوّن سلوك إنشاء نقطة الاسترجاع.

الخيارات التالية مدعومة حاليًا:

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مطلوب. يوفر الاسم للبرنامج النصي الذي يتم تنفيذه قبل إنشاء نقطة الاسترجاع، كما لو تم تمرير [`--build-snapshot`](/ar/nodejs/api/cli#--build-snapshot) مع `builder` كاسم البرنامج النصي الرئيسي.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) اختياري. يؤدي تضمين ذاكرة التخزين المؤقت للتعليمات البرمجية إلى تقليل الوقت المستغرق في تجميع الوظائف المضمنة في نقطة الاسترجاع على حساب حجم نقطة استرجاع أكبر واحتمال كسر قابلية نقل نقطة الاسترجاع.

عند استخدام هذا العلم، لن يتم تنفيذ ملفات البرنامج النصي الإضافية المتوفرة في سطر الأوامر وبدلاً من ذلك سيتم تفسيرها على أنها وسائط سطر أوامر عادية.


### `-c`, `--check` {#--build-snapshot-config}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | خيار `--require` مدعوم الآن عند التحقق من ملف. |
| v5.0.0, v4.2.0 | تمت الإضافة في: v5.0.0, v4.2.0 |
:::

التحقق من بناء الجملة للبرنامج النصي دون تنفيذه.

### `--completion-bash` {#-c---check}

**تمت الإضافة في: v10.12.0**

طباعة برنامج نصي لإكمال باش المصدر لـ Node.js.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v22.9.0, v20.18.0 | العلامة ليست تجريبية بعد الآن. |
| v14.9.0, v12.19.0 | تمت الإضافة في: v14.9.0, v12.19.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

توفير شروط دقة [عمليات التصدير الشرطية](/ar/nodejs/api/packages#conditional-exports) المخصصة.

يُسمح بأي عدد من أسماء شروط السلسلة المخصصة.

سيتم تطبيق شروط Node.js الافتراضية `"node"` و `"default"` و `"import"` و `"require"` دائمًا على النحو المحدد.

على سبيل المثال ، لتشغيل وحدة نمطية مع قرارات "تطوير":

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | علامات `--cpu-prof` مستقرة الآن. |
| v12.0.0 | تمت الإضافة في: v12.0.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يبدأ محلل V8 لوحدة المعالجة المركزية عند بدء التشغيل ، ويكتب ملف تعريف وحدة المعالجة المركزية على القرص قبل الخروج.

إذا لم يتم تحديد `--cpu-prof-dir` ، فسيتم وضع الملف الشخصي الذي تم إنشاؤه في دليل العمل الحالي.

إذا لم يتم تحديد `--cpu-prof-name` ، فسيتم تسمية الملف الشخصي الذي تم إنشاؤه `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | علامات `--cpu-prof` مستقرة الآن. |
| v12.0.0 | تمت الإضافة في: v12.0.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

حدد الدليل الذي سيتم فيه وضع ملفات تعريف وحدة المعالجة المركزية التي تم إنشاؤها بواسطة `--cpu-prof`.

يتم التحكم في القيمة الافتراضية بواسطة خيار سطر الأوامر [`--diagnostic-dir`](/ar/nodejs/api/cli#--diagnostic-dirdirectory).


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v22.4.0, v20.16.0 | أصبحت علامات `--cpu-prof` مستقرة الآن. |
| v12.2.0 | تمت إضافته في: v12.2.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

حدد فاصلة أخذ العينات بالميكرو ثانية لملفات تعريف وحدة المعالجة المركزية التي تم إنشاؤها بواسطة `--cpu-prof`. الافتراضي هو 1000 ميكرو ثانية.

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v22.4.0, v20.16.0 | أصبحت علامات `--cpu-prof` مستقرة الآن. |
| v12.0.0 | تمت إضافته في: v12.0.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

حدد اسم ملف تعريف وحدة المعالجة المركزية الذي تم إنشاؤه بواسطة `--cpu-prof`.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

قم بتعيين الدليل الذي ستتم كتابة جميع ملفات الإخراج التشخيصي إليه. القيمة الافتراضية هي دليل العمل الحالي.

يؤثر على دليل الإخراج الافتراضي لـ:

- [`--cpu-prof-dir`](/ar/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/ar/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/ar/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**تمت إضافته في: v13.12.0, v12.17.0**

تعطيل الخاصية `Object.prototype.__proto__`. إذا كان `mode` هو `delete`، فستتم إزالة الخاصية بالكامل. إذا كان `mode` هو `throw`، فستؤدي عمليات الوصول إلى الخاصية إلى ظهور استثناء مع الرمز `ERR_PROTO_ACCESS`.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

**تمت إضافته في: v21.3.0, v20.11.0**

تعطيل تحذيرات معينة للعملية عن طريق `code` أو `type`.

قد تحتوي التحذيرات المنبعثة من [`process.emitWarning()`](/ar/nodejs/api/process#processemitwarningwarning-options) على `code` و `type`. لن يقوم هذا الخيار بإصدار تحذيرات لها `code` أو `type` مطابق.

قائمة [تحذيرات الإهمال](/ar/nodejs/api/deprecations#list-of-deprecated-apis).

أنواع تحذيرات Node.js الأساسية هي: `DeprecationWarning` و `ExperimentalWarning`

على سبيل المثال، لن يقوم البرنامج النصي التالي بإصدار [DEP0025 `require('node:sys')`](/ar/nodejs/api/deprecations#dep0025-requirenodesys) عند تنفيذه باستخدام `node --disable-warning=DEP0025`:

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

على سبيل المثال، سيصدر البرنامج النصي التالي [DEP0025 `require('node:sys')`](/ar/nodejs/api/deprecations#dep0025-requirenodesys)، ولكن ليس أي تحذيرات تجريبية (مثل [ExperimentalWarning: `vm.measureMemory` هي ميزة تجريبية](/ar/nodejs/api/vm#vmmeasurememoryoptions) في \<=v21) عند تنفيذه باستخدام `node --disable-warning=ExperimentalWarning`:

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**أضيف في: v22.2.0, v20.15.0**

بشكل افتراضي، يمكّن Node.js عمليات التحقق المرتبطة بـ WebAssembly المستندة إلى معالج الفخاخ. ونتيجة لذلك، لا تحتاج V8 إلى إدراج عمليات التحقق المرتبطة المضمنة في التعليمات البرمجية المترجمة من WebAssembly، مما قد يؤدي إلى تسريع تنفيذ WebAssembly بشكل كبير، ولكن هذا التحسين يتطلب تخصيص قفص ذاكرة افتراضية كبير (حاليًا 10 جيجابايت). إذا لم يتمكن عملية Node.js من الوصول إلى مساحة عنوان ذاكرة افتراضية كبيرة بما يكفي بسبب تكوينات النظام أو القيود المفروضة على الأجهزة، فلن يتمكن المستخدمون من تشغيل أي WebAssembly يتضمن تخصيصًا في قفص الذاكرة الافتراضية هذا وسيشاهدون خطأ نفاد الذاكرة.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` يعطل هذا التحسين حتى يتمكن المستخدمون على الأقل من تشغيل WebAssembly (بأداء أقل مثالية) عندما تكون مساحة عنوان الذاكرة الافتراضية المتاحة لعملية Node.js الخاصة بهم أقل مما يحتاجه قفص ذاكرة V8 WebAssembly.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**أضيف في: v9.8.0**

اجعل ميزات اللغة المضمنة مثل `eval` و `new Function` التي تنشئ التعليمات البرمجية من السلاسل النصية تطرح استثناءً بدلاً من ذلك. هذا لا يؤثر على وحدة Node.js `node:vm`.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first` مدعوم الآن. |
| v17.0.0 | تم تغيير القيمة الافتراضية إلى `verbatim`. |
| v16.4.0, v14.18.0 | أضيف في: v16.4.0, v14.18.0 |
:::

عيّن القيمة الافتراضية لـ `order` في [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) و [`dnsPromises.lookup()`](/ar/nodejs/api/dns#dnspromiseslookuphostname-options). يمكن أن تكون القيمة:

- `ipv4first`: يعين `order` الافتراضي إلى `ipv4first`.
- `ipv6first`: يعين `order` الافتراضي إلى `ipv6first`.
- `verbatim`: يعين `order` الافتراضي إلى `verbatim`.

القيمة الافتراضية هي `verbatim` و [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) لها أولوية أعلى من `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**أضيف في:** الإصدار 6.0.0

تمكين تشفير متوافق مع معيار معالجة المعلومات الفيدرالية (FIPS) عند بدء التشغيل. (يتطلب بناء Node.js مقابل OpenSSL متوافق مع FIPS.)

### `--enable-network-family-autoselection` {#--enable-fips}

**أضيف في:** الإصدار 18.18.0

يتيح خوارزمية الاختيار التلقائي للعائلة ما لم تعطل خيارات الاتصال ذلك صراحةً.

### `--enable-source-maps` {#--enable-network-family-autoselection}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.11.0, v14.18.0 | لم تعد واجهة برمجة التطبيقات هذه تجريبية. |
| v12.12.0 | أضيف في: الإصدار 12.12.0 |
:::

تمكين دعم [خريطة المصدر الإصدار 3](https://sourcemaps.info/spec) لتتبعات المكدس.

عند استخدام مترجم ، مثل TypeScript ، فإن تتبعات المكدس التي يطرحها تطبيق تشير إلى الكود المترجم ، وليس موضع المصدر الأصلي. `--enable-source-maps` تمكن التخزين المؤقت لخرائط المصدر وتبذل قصارى جهدها للإبلاغ عن تتبعات المكدس بالنسبة لملف المصدر الأصلي.

قد يؤدي تجاوز `Error.prepareStackTrace` إلى منع `--enable-source-maps` من تعديل تتبع المكدس. قم باستدعاء وإرجاع نتائج `Error.prepareStackTrace` الأصلي في الدالة المتجاوزة لتعديل تتبع المكدس باستخدام خرائط المصدر.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // تعديل الخطأ والتتبع وتنسيق تتبع المكدس باستخدام
  // Error.prepareStackTrace الأصلي.
  return originalPrepareStackTrace(error, trace);
};
```
لاحظ أن تمكين خرائط المصدر يمكن أن يدخل زمن انتقال إلى تطبيقك عند الوصول إلى `Error.stack`. إذا قمت بالوصول إلى `Error.stack` بشكل متكرر في تطبيقك ، فضع في اعتبارك الآثار المترتبة على الأداء `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**أضيف في:** الإصدار 23.0.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

عند وجوده ، ستفسر Node.js نقطة الإدخال على أنها عنوان URL ، بدلاً من مسار.

يتبع قواعد تحليل [وحدة ECMAScript](/ar/nodejs/api/esm#modules-ecmascript-modules).

يمكن الوصول إلى أي معلمة استعلام أو تجزئة في عنوان URL عبر [`import.meta.url`](/ar/nodejs/api/esm#importmetaurl).

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**أضيف في: الإصدار 22.9.0**

السلوك هو نفسه سلوك [`--env-file`](/ar/nodejs/api/cli#--env-fileconfig)، ولكن لا يتم طرح خطأ إذا لم يكن الملف موجودًا.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 21.7.0، الإصدار 20.12.0 | إضافة دعم للقيم متعددة الأسطر. |
| الإصدار 20.6.0 | أضيف في: الإصدار 20.6.0 |
:::

يقوم بتحميل متغيرات البيئة من ملف بالنسبة إلى الدليل الحالي، مما يجعلها متاحة للتطبيقات على `process.env`. يتم تحليل [متغيرات البيئة التي تقوم بتكوين Node.js](/ar/nodejs/api/cli#environment-variables)، مثل `NODE_OPTIONS`، وتطبيقها. إذا تم تعريف نفس المتغير في البيئة وفي الملف، فإن القيمة من البيئة لها الأسبقية.

يمكنك تمرير وسيطات `--env-file` متعددة. تتجاوز الملفات اللاحقة المتغيرات الموجودة مسبقًا والمحددة في الملفات السابقة.

يتم طرح خطأ إذا لم يكن الملف موجودًا.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
يجب أن يكون تنسيق الملف عبارة عن سطر واحد لكل زوج مفتاح-قيمة لاسم متغير البيئة وقيمته مفصولين بـ `=`:

```text [TEXT]
PORT=3000
```
يتم التعامل مع أي نص بعد `#` كتعليق:

```text [TEXT]
# هذا تعليق {#--env-file=config}
PORT=3000 # هذا أيضًا تعليق
```
يمكن أن تبدأ القيم وتنتهي بعلامات الاقتباس التالية: ```، `"` أو `'`. يتم حذفها من القيم.

```text [TEXT]
USERNAME="nodejs" # سينتج عنه `nodejs` كقيمة.
```
يتم دعم القيم متعددة الأسطر:

```text [TEXT]
MULTI_LINE="THIS IS
A MULTILINE"
# سينتج عنه `THIS IS\nA MULTILINE` كقيمة. {#this-is-a-comment}
```
يتم تجاهل الكلمة الأساسية Export قبل المفتاح:

```text [TEXT]
export USERNAME="nodejs" # سينتج عنه `nodejs` كقيمة.
```
إذا كنت ترغب في تحميل متغيرات البيئة من ملف قد لا يكون موجودًا، فيمكنك استخدام علامة [`--env-file-if-exists`](/ar/nodejs/api/cli#--env-file-if-existsconfig) بدلاً من ذلك.


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v22.6.0 | يدعم Eval الآن تجريد الأنواع التجريبي. |
| v5.11.0 | المكتبات المضمنة متاحة الآن كمتغيرات محددة مسبقًا. |
| v0.5.2 | تمت إضافته في: v0.5.2 |
:::

تقييم الوسيطة التالية كجافاسكربت. يمكن أيضًا استخدام الوحدات النمطية المحددة مسبقًا في REPL في `script`.

في نظام التشغيل Windows، باستخدام `cmd.exe`، لن تعمل علامة الاقتباس المفردة بشكل صحيح لأنها لا تتعرف إلا على علامة الاقتباس المزدوجة `"` للاقتباس. في Powershell أو Git bash، يمكن استخدام كل من `'` و `"`.

من الممكن تشغيل التعليمات البرمجية التي تحتوي على أنواع مضمنة عن طريق تمرير [`--experimental-strip-types`](/ar/nodejs/api/cli#--experimental-strip-types).

### `--experimental-async-context-frame` {#-e---eval-"script"}

**تمت إضافته في: v22.7.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يمكّن استخدام [`AsyncLocalStorage`](/ar/nodejs/api/async_context#class-asynclocalstorage) المدعوم من `AsyncContextFrame` بدلاً من التنفيذ الافتراضي الذي يعتمد على async_hooks. تم تنفيذ هذا النموذج الجديد بشكل مختلف تمامًا وبالتالي يمكن أن يكون له اختلافات في كيفية تدفق بيانات السياق داخل التطبيق. على هذا النحو، يوصى حاليًا بالتأكد من أن سلوك تطبيقك لا يتأثر بهذا التغيير قبل استخدامه في الإنتاج.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**تمت إضافته في: v22.3.0, v20.18.0**

تمكين عرض [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) على النطاق العام.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v20.6.0, v18.19.0 | أصبح import.meta.resolve المتزامن متاحًا بشكل افتراضي، مع الاحتفاظ بالعلم لتمكين الوسيطة الثانية التجريبية كما كان مدعومًا سابقًا. |
| v13.9.0, v12.16.2 | تمت إضافته في: v13.9.0, v12.16.2 |
:::

تمكين دعم URL الأصل التجريبي `import.meta.resolve()`، والذي يسمح بتمرير وسيطة `parentURL` ثانية للحل السياقي.

كان يؤمن سابقًا ميزة `import.meta.resolve` بأكملها.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.11.1 | تمت إعادة تسمية هذا العلم من `--loader` إلى `--experimental-loader`. |
| v8.8.0 | تمت إضافته في: v8.8.0 |
:::

حدد `الوحدة` التي تحتوي على [خطافات تخصيص الوحدة النمطية المصدرة](/ar/nodejs/api/module#customization-hooks). يمكن أن تكون `الوحدة` أي سلسلة مقبولة كمحدد [`import`](/ar/nodejs/api/esm#import-specifiers).

### `--experimental-network-inspection` {#--experimental-loader=module}

**تمت إضافته في: v22.6.0، v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

قم بتمكين الدعم التجريبي لفحص الشبكة باستخدام أدوات مطوري Chrome.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**تمت إضافته في: v22.0.0، v20.17.0**

إذا كانت وحدة ES التي يتم استخدام `require()` تحتوي على `await` من المستوى الأعلى، فإن هذا العلم يسمح لـ Node.js بتقييم الوحدة، ومحاولة تحديد موقع عمليات الانتظار من المستوى الأعلى، وطباعة موقعها لمساعدة المستخدمين في العثور عليها.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | هذا صحيح الآن بشكل افتراضي. |
| v22.0.0, v20.17.0 | تمت إضافته في: v22.0.0, v20.17.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تطوير نشط
:::

يدعم تحميل رسم بياني لوحدة ES متزامن في `require()`.

راجع [تحميل وحدات ECMAScript باستخدام `require()`](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**تمت إضافته في: v20.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

استخدم هذا العلم لإنشاء كائن ثنائي كبير الحجم يمكن حقنه في ثنائي Node.js لإنتاج [تطبيق تنفيذي واحد](/ar/nodejs/api/single-executable-applications). راجع الوثائق المتعلقة [بهذا التكوين](/ar/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) للحصول على التفاصيل.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**أضيف في: الإصدار 19.0.0، الإصدار 18.13.0**

استخدم هذا العلم لتمكين دعم [ShadowRealm](https://github.com/tc39/proposal-shadowrealm).

### `--experimental-strip-types` {#--experimental-shadow-realm}

**أضيف في: الإصدار 22.6.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تمكين تجريد الأنواع التجريبي لملفات TypeScript. لمزيد من المعلومات، راجع وثائق [تجريد أنواع TypeScript](/ar/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 20.1.0، الإصدار 18.17.0 | يمكن استخدام هذا الخيار مع `--test`. |
| الإصدار 19.7.0، الإصدار 18.15.0 | أضيف في: الإصدار 19.7.0، الإصدار 18.15.0 |
:::

عند استخدامه بالاقتران مع وحدة `node:test`، يتم إنشاء تقرير تغطية التعليمات البرمجية كجزء من إخراج أداة تشغيل الاختبار. إذا لم يتم تشغيل أي اختبارات، فلن يتم إنشاء تقرير تغطية. راجع الوثائق الخاصة بـ [جمع تغطية التعليمات البرمجية من الاختبارات](/ar/nodejs/api/test#collecting-code-coverage) لمزيد من التفاصيل.

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**أضيف في: الإصدار 22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

يقوم بتكوين نوع عزل الاختبار المستخدم في أداة تشغيل الاختبار. عندما يكون `mode` هو `'process'`، يتم تشغيل كل ملف اختبار في عملية فرعية منفصلة. عندما يكون `mode` هو `'none'`، يتم تشغيل جميع ملفات الاختبار في نفس عملية أداة تشغيل الاختبار. وضع العزل الافتراضي هو `'process'`. يتم تجاهل هذا العلم إذا لم يكن العلم `--test` موجودًا. راجع قسم [نموذج تنفيذ أداة تشغيل الاختبار](/ar/nodejs/api/test#test-runner-execution-model) لمزيد من المعلومات.

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**أضيف في: الإصدار 22.3.0، الإصدار 20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

تمكين محاكاة الوحدة في أداة تشغيل الاختبار.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**أضيف في: v22.7.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تطوير نشط
:::

تمكن تحويل تركيب TypeScript فقط إلى كود JavaScript. يتضمن `--experimental-strip-types` و`--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**أضيف في: v9.6.0**

تمكين دعم وحدات ES التجريبية في وحدة `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0, v18.17.0 | هذا الخيار لم يعد مطلوبًا حيث يتم تمكين WASI افتراضيًا، ولكن لا يزال من الممكن تمريره. |
| v13.6.0 | تم التغيير من `--experimental-wasi-unstable-preview0` إلى `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | أضيف في: v13.3.0, v12.16.0 |
:::

تمكين دعم واجهة نظام WebAssembly التجريبية (WASI).

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**أضيف في: v12.3.0**

تمكين دعم وحدات WebAssembly التجريبية.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**أضيف في: v22.4.0**

تمكين دعم [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) التجريبي.

### `--expose-gc` {#--experimental-webstorage}

**أضيف في: v22.3.0, v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي. هذا العلم موروث من V8 ويخضع للتغيير في المصدر.
:::

سيعرض هذا العلم امتداد gc من V8.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**أضيف في: v12.12.0**

تعطيل تحميل الملحقات الأصلية التي ليست [واعية بالسياق](/ar/nodejs/api/addons#context-aware-addons).

### `--force-fips` {#--force-context-aware}

**أضيف في: v6.0.0**

فرض تشفير متوافق مع FIPS عند بدء التشغيل. (لا يمكن تعطيله من كود البرنامج النصي.) (نفس متطلبات `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**أضيف في: v18.3.0, v16.17.0**

يفرض حدث `uncaughtException` على استدعاءات Node-API غير المتزامنة.

لمنع إضافة موجودة من تعطل العملية، لا يتم تمكين هذا العلم افتراضيًا. في المستقبل، سيتم تمكين هذا العلم افتراضيًا لفرض السلوك الصحيح.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**أضيف في: v11.12.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تمكين المؤثرات الداخلية المجمدة التجريبية مثل `Array` و `Object`.

يتم دعم سياق الجذر فقط. لا يوجد ضمان بأن `globalThis.Array` هو بالفعل المرجع الداخلي الافتراضي. قد يتعطل الكود تحت هذه العلامة.

للسماح بإضافة polyfills، يتم تشغيل كل من [`--require`](/ar/nodejs/api/cli#-r---require-module) و [`--import`](/ar/nodejs/api/cli#--importmodule) قبل تجميد المؤثرات الداخلية.

### `--heap-prof` {#--frozen-intrinsics}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | علامات `--heap-prof` مستقرة الآن. |
| v12.4.0 | أضيف في: v12.4.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يبدأ ملف تعريف كومة V8 عند بدء التشغيل، ويكتب ملف تعريف الكومة على القرص قبل الخروج.

إذا لم يتم تحديد `--heap-prof-dir`، فسيتم وضع ملف التعريف الذي تم إنشاؤه في دليل العمل الحالي.

إذا لم يتم تحديد `--heap-prof-name`، فسيتم تسمية ملف التعريف الذي تم إنشاؤه `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | علامات `--heap-prof` مستقرة الآن. |
| v12.4.0 | أضيف في: v12.4.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

حدد الدليل الذي سيتم فيه وضع ملفات تعريف الكومة التي تم إنشاؤها بواسطة `--heap-prof`.

يتم التحكم في القيمة الافتراضية بواسطة خيار سطر الأوامر [`--diagnostic-dir`](/ar/nodejs/api/cli#--diagnostic-dirdirectory).

### `--heap-prof-interval` {#--heap-prof-dir}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | علامات `--heap-prof` مستقرة الآن. |
| v12.4.0 | أضيف في: v12.4.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

حدد متوسط فاصل أخذ العينات بالبايت لملفات تعريف الكومة التي تم إنشاؤها بواسطة `--heap-prof`. القيمة الافتراضية هي 512 * 1024 بايت.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v22.4.0, v20.16.0 | أصبحت علامات `--heap-prof` مستقرة الآن. |
| الإصدار v12.4.0 | تمت إضافتها في: v12.4.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

حدد اسم الملف لملف تعريف الذاكرة المكدسة الذي تم إنشاؤه بواسطة `--heap-prof`.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**تمت إضافتها في: v15.1.0, v14.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يكتب لقطة ذاكرة مكدسة V8 على القرص عندما يقترب استخدام ذاكرة مكدسة V8 من حد الذاكرة المكدسة. يجب أن يكون `count` عددًا صحيحًا غير سالب (وفي هذه الحالة، لن يكتب Node.js أكثر من `max_count` من اللقطات على القرص).

عند إنشاء لقطات، قد يتم تشغيل جمع البيانات المهملة وتقليل استخدام الذاكرة المكدسة. لذلك، قد يتم كتابة لقطات متعددة على القرص قبل أن ينفد الذاكرة في مثيل Node.js في النهاية. يمكن مقارنة لقطات الذاكرة المكدسة هذه لتحديد الكائنات التي يتم تخصيصها خلال الوقت الذي يتم فيه التقاط لقطات متتالية. ليس من المضمون أن يكتب Node.js بالضبط `max_count` من اللقطات على القرص، ولكنه سيبذل قصارى جهده لإنشاء لقطة واحدة على الأقل وما يصل إلى `max_count` من اللقطات قبل أن ينفد الذاكرة في مثيل Node.js عندما يكون `max_count` أكبر من `0`.

يستغرق إنشاء لقطات V8 وقتًا وذاكرة (سواء الذاكرة التي تديرها ذاكرة مكدسة V8 والذاكرة الأصلية خارج ذاكرة مكدسة V8). كلما كانت الذاكرة المكدسة أكبر، زادت الموارد التي تحتاجها. سيقوم Node.js بضبط ذاكرة مكدسة V8 لاستيعاب النفقات العامة الإضافية لذاكرة مكدسة V8، وسيبذل قصارى جهده لتجنب استهلاك كل الذاكرة المتاحة للعملية. عندما تستخدم العملية ذاكرة أكثر مما يعتبره النظام مناسبًا، فقد يتم إنهاء العملية فجأة بواسطة النظام، اعتمادًا على تكوين النظام.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**تمت إضافتها في: v12.0.0**

تمكين معالج الإشارات الذي يجعل عملية Node.js تكتب تفريغ الذاكرة عند استقبال الإشارة المحددة. يجب أن يكون `signal` اسم إشارة صالحًا. معطل افتراضيًا.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**تمت إضافتها في: v0.1.3**

طباعة خيارات سطر الأوامر للعقدة. إنتاج هذه الخيارات أقل تفصيلاً من هذا المستند.

### `--icu-data-dir=file` {#-h---help}

**تمت إضافتها في: v0.11.15**

حدد مسار تحميل بيانات ICU. (يتجاوز `NODE_ICU_DATA`.)

### `--import=module` {#--icu-data-dir=file}

**تمت إضافتها في: v19.0.0, v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

التحميل المسبق للوحدة النمطية المحددة عند بدء التشغيل. إذا تم توفير العلامة عدة مرات، فسيتم تنفيذ كل وحدة نمطية بالتسلسل بالترتيب الذي تظهر به، بدءًا بتلك الموجودة في [`NODE_OPTIONS`](/ar/nodejs/api/cli#node_optionsoptions).

يتبع [وحدة ECMAScript](/ar/nodejs/api/esm#modules-ecmascript-modules) قواعد التحليل. استخدم [`--require`](/ar/nodejs/api/cli#-r---require-module) لتحميل [وحدة CommonJS](/ar/nodejs/api/modules). سيتم تشغيل الوحدات النمطية المحملة مسبقًا باستخدام `--require` قبل الوحدات النمطية المحملة مسبقًا باستخدام `--import`.

يتم تحميل الوحدات النمطية مسبقًا في مؤشر الترابط الرئيسي بالإضافة إلى أي سلاسل عامل، وعمليات متشعبة، أو عمليات مجمعة.

### `--input-type=type` {#--import=module}

**تمت إضافتها في: v12.0.0**

يقوم هذا بتكوين Node.js لتفسير `--eval` أو إدخال `STDIN` على أنه CommonJS أو كوحدة ES. القيم الصالحة هي `"commonjs"` أو `"module"`. الافتراضي هو `"commonjs"`.

لا يدعم REPL هذا الخيار. سيؤدي استخدام `--input-type=module` مع [`--print`](/ar/nodejs/api/cli#-p---print-script) إلى طرح خطأ، حيث لا يدعم `--print` بناء جملة وحدة ES.


### `--insecure-http-parser` {#--input-type=type}

**أضيف في: v13.4.0, v12.15.0, v10.19.0**

تمكين علامات التساهل في محلل HTTP. قد يسمح هذا بالتوافق مع تطبيقات HTTP غير المتوافقة.

عند التمكين ، سيقبل المحلل ما يلي:

- قيم رؤوس HTTP غير صالحة.
- إصدارات HTTP غير صالحة.
- السماح برسالة تحتوي على كل من رؤوس `Transfer-Encoding` و `Content-Length`.
- السماح ببيانات إضافية بعد الرسالة عند وجود `Connection: close`.
- السماح بترميزات نقل إضافية بعد توفير `chunked`.
- السماح باستخدام `\n` كفاصل للرمز المميز بدلاً من `\r\n`.
- السماح بعدم توفير `\r\n` بعد الجزء.
- السماح بوجود مسافات بعد حجم الجزء وقبل `\r\n`.

كل ما سبق سيعرض تطبيقك لهجوم تهريب أو تسميم الطلبات. تجنب استخدام هذا الخيار.

#### تحذير: ربط المدقق بمجموعة IP:port عامة غير آمن {#--insecure-http-parser}

يعد ربط المدقق بعنوان IP عام (بما في ذلك `0.0.0.0`) بمنفذ مفتوح أمرًا غير آمن ، لأنه يسمح للمضيفين الخارجيين بالاتصال بالمدقق وتنفيذ هجوم [تنفيذ التعليمات البرمجية عن بُعد](https://www.owasp.org/index.php/Code_Injection).

في حالة تحديد مضيف ، تأكد من أحد الأمرين:

- لا يمكن الوصول إلى المضيف من الشبكات العامة.
- يقوم جدار الحماية بمنع الاتصالات غير المرغوب فيها على المنفذ.

**وبشكل أكثر تحديدًا ، فإن <code>--inspect=0.0.0.0</code> غير آمن إذا لم يكن المنفذ (<code>9229</code> افتراضيًا) محميًا بجدار حماية.**

راجع قسم [الآثار الأمنية لتصحيح الأخطاء](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications) لمزيد من المعلومات.

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**أضيف في: v7.6.0**

قم بتنشيط المدقق على `host:port` وقم بالكسر في بداية البرنامج النصي للمستخدم. الإعداد الافتراضي `host:port` هو `127.0.0.1:9229`. إذا تم تحديد المنفذ `0` ، فسيتم استخدام منفذ عشوائي متاح.

راجع [تكامل V8 Inspector لـ Node.js](/ar/nodejs/api/debugger#v8-inspector-integration-for-nodejs) لمزيد من الشرح حول مصحح أخطاء Node.js.

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**أضيف في: v7.6.0**

اضبط `host:port` لاستخدامه عند تنشيط المدقق. مفيد عند تنشيط المدقق عن طريق إرسال إشارة `SIGUSR1`.

المضيف الافتراضي هو `127.0.0.1`. إذا تم تحديد المنفذ `0` ، فسيتم استخدام منفذ عشوائي متاح.

راجع [التحذير الأمني](/ar/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) أدناه فيما يتعلق باستخدام معلمة `host`.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

تحديد طرق عرض عنوان URL لمأخذ توصيل ويب أداة الفحص.

بشكل افتراضي، يتوفر عنوان URL لمأخذ توصيل ويب أداة الفحص في الخطأ القياسي وضمن نقطة النهاية `/json/list` على `http://host:port/json/list`.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**تمت الإضافة في: v22.2.0، v20.15.0**

تفعيل أداة الفحص على `host:port` والانتظار حتى يتم إرفاق المصحح. الافتراضي `host:port` هو `127.0.0.1:9229`. إذا تم تحديد المنفذ `0`، فسيتم استخدام منفذ عشوائي متاح.

راجع [تكامل V8 Inspector لـ Node.js](/ar/nodejs/api/debugger#v8-inspector-integration-for-nodejs) للحصول على مزيد من التوضيحات حول مصحح أخطاء Node.js.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**تمت الإضافة في: v6.3.0**

تفعيل أداة الفحص على `host:port`. الافتراضي هو `127.0.0.1:9229`. إذا تم تحديد المنفذ `0`، فسيتم استخدام منفذ عشوائي متاح.

يتيح تكامل V8 inspector لأدوات مثل Chrome DevTools و IDEs تصحيح أخطاء ملفات Node.js وتوصيفها. تتصل الأدوات بملفات Node.js عبر منفذ tcp وتتواصل باستخدام [بروتوكول أدوات مطوري Chrome](https://chromedevtools.github.io/devtools-protocol/). راجع [تكامل V8 Inspector لـ Node.js](/ar/nodejs/api/debugger#v8-inspector-integration-for-nodejs) للحصول على مزيد من التوضيحات حول مصحح أخطاء Node.js.

### `-i`, `--interactive` {#--inspect=hostport}

**تمت الإضافة في: v0.7.7**

يفتح REPL حتى إذا لم يبدُ أن stdin طرفية.

### `--jitless` {#-i---interactive}

**تمت الإضافة في: v12.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي. تم توريث هذا العلم من V8 وهو عرضة للتغيير في المنبع.
:::

تعطيل [التخصيص في وقت التشغيل للذاكرة القابلة للتنفيذ](https://v8.dev/blog/jitless). قد يكون هذا مطلوبًا على بعض الأنظمة الأساسية لأسباب أمنية. يمكن أن يقلل أيضًا من مساحة الهجوم على الأنظمة الأساسية الأخرى، ولكن قد يكون التأثير على الأداء شديدًا.

### `--localstorage-file=file` {#--jitless}

**تمت الإضافة في: v22.4.0**

الملف المستخدم لتخزين بيانات `localStorage`. إذا كان الملف غير موجود، فسيتم إنشاؤه في المرة الأولى التي يتم فيها الوصول إلى `localStorage`. يمكن مشاركة نفس الملف بين عمليات Node.js متعددة في وقت واحد. هذا العلم لا يفعل شيئًا ما لم يتم بدء Node.js بالعلامة `--experimental-webstorage`.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v13.13.0 | تغيير الحد الأقصى للحجم الافتراضي لعناوين HTTP من 8 كيلوبايت إلى 16 كيلوبايت. |
| v11.6.0, v10.15.0 | تمت الإضافة في: v11.6.0, v10.15.0 |
:::

يحدد الحد الأقصى لحجم عناوين HTTP بالبايت. القيمة الافتراضية هي 16 كيلوبايت.

### `--napi-modules` {#--max-http-header-size=size}

**تمت الإضافة في: v7.10.0**

هذا الخيار لا يقوم بأي عملية. يتم الاحتفاظ به للتوافق.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**تمت الإضافة في: v22.1.0, v20.13.0**

يحدد القيمة الافتراضية للمهلة الزمنية لمحاولة الاختيار التلقائي لعائلة الشبكة. لمزيد من المعلومات، انظر [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ar/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**تمت الإضافة في: v16.10.0, v14.19.0**

تعطيل شرط تصدير `node-addons` بالإضافة إلى تعطيل تحميل الإضافات الأصلية. عند تحديد `--no-addons`، ستفشل استدعاء `process.dlopen` أو طلب إضافة C++ أصلية وسيتم طرح استثناء.

### `--no-deprecation` {#--no-addons}

**تمت الإضافة في: v0.8.0**

إسكات تحذيرات الإهمال.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v22.7.0 | يتم تمكين اكتشاف بناء الجملة افتراضيًا. |
| v21.1.0, v20.10.0 | تمت الإضافة في: v21.1.0, v20.10.0 |
:::

تعطيل استخدام [اكتشاف بناء الجملة](/ar/nodejs/api/packages#syntax-detection) لتحديد نوع الوحدة النمطية.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**تمت الإضافة في: v21.2.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

تعطيل عرض [واجهة برمجة تطبيقات Navigator](/ar/nodejs/api/globals#navigator) في النطاق العام.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**تمت الإضافة في: v16.6.0**

استخدم هذا العلم لتعطيل المستوى الأعلى await في REPL.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.0.0 | هذا الآن خطأ افتراضيًا. |
| v22.0.0, v20.17.0 | تمت الإضافة في: v22.0.0, v20.17.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تعطيل دعم تحميل رسم بياني لوحدة ES متزامنة في `require()`.

انظر [تحميل وحدات ECMAScript باستخدام `require()`](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.4.0 | SQLite غير معلم ولكنه لا يزال تجريبيًا. |
| v22.5.0 | تمت الإضافة في: v22.5.0 |
:::

تعطيل الوحدة النمطية التجريبية [`node:sqlite`](/ar/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**تمت الإضافة في: v22.0.0**

تعطيل عرض [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) على النطاق العام.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**تمت الإضافة في: v17.0.0**

إخفاء معلومات إضافية حول الاستثناء الفادح الذي يتسبب في الخروج.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**تمت الإضافة في: v9.0.0**

تعطيل عمليات التحقق في وقت التشغيل لـ `async_hooks`. سيتم تمكينها ديناميكيًا عند تمكين `async_hooks`.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**تمت الإضافة في: v16.10.0**

عدم البحث عن الوحدات النمطية من المسارات العامة مثل `$HOME/.node_modules` و `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v20.0.0 | تمت إعادة تسمية العلامة من `--no-enable-network-family-autoselection` إلى `--no-network-family-autoselection`. لا يزال الاسم القديم يعمل كاسم بديل. |
| v19.4.0 | تمت الإضافة في: v19.4.0 |
:::

تعطيل خوارزمية الاختيار التلقائي للعائلة ما لم تفعِّل خيارات الاتصال ذلك صراحةً.

### `--no-warnings` {#--no-network-family-autoselection}

**تمت الإضافة في: v6.0.0**

إسكات جميع تحذيرات العملية (بما في ذلك الإهمالات).

### `--node-memory-debug` {#--no-warnings}

**تمت الإضافة في: v15.0.0, v14.18.0**

تمكين عمليات فحص تصحيح الأخطاء الإضافية لتسرب الذاكرة في Node.js الداخلية. عادة ما يكون هذا مفيدًا فقط للمطورين الذين يقومون بتصحيح Node.js نفسه.

### `--openssl-config=file` {#--node-memory-debug}

**تمت الإضافة في: v6.9.0**

تحميل ملف تكوين OpenSSL عند بدء التشغيل. من بين الاستخدامات الأخرى، يمكن استخدام هذا لتمكين التشفير المتوافق مع FIPS إذا تم إنشاء Node.js مقابل OpenSSL المُمكَّنة لـ FIPS.

### `--openssl-legacy-provider` {#--openssl-config=file}

**تمت الإضافة في: v17.0.0, v16.17.0**

تمكين موفر OpenSSL 3.0 القديم. لمزيد من المعلومات، يرجى الاطلاع على [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**تمت الإضافة في: v18.5.0, v16.17.0, v14.21.0**

تمكين قسم التكوين الافتراضي لـ OpenSSL، `openssl_conf` ليتم قراءته من ملف تكوين OpenSSL. اسم ملف التكوين الافتراضي هو `openssl.cnf` ولكن يمكن تغيير ذلك باستخدام متغير البيئة `OPENSSL_CONF`، أو باستخدام خيار سطر الأوامر `--openssl-config`. يعتمد موقع ملف تكوين OpenSSL الافتراضي على كيفية ربط OpenSSL بـ Node.js. قد يكون لمشاركة تكوين OpenSSL آثار غير مرغوب فيها ويوصى باستخدام قسم تكوين خاص بـ Node.js وهو `nodejs_conf` وهو افتراضي عند عدم استخدام هذا الخيار.


### `--pending-deprecation` {#--openssl-shared-config}

**أضيف في: v8.0.0**

إصدار تحذيرات الإهلاك المعلّق.

عادةً ما تكون عمليات الإهلاك المعلّقة متطابقة مع إهلاك وقت التشغيل باستثناء ملحوظ واحد وهو أنها تكون *متوقفة* افتراضيًا ولن يتم إصدارها ما لم يتم تعيين علامة سطر الأوامر `--pending-deprecation` أو متغير البيئة `NODE_PENDING_DEPRECATION=1`. تُستخدم عمليات الإهلاك المعلّقة لتوفير نوع من آلية "الإنذار المبكر" الانتقائية التي يمكن للمطورين الاستفادة منها لاكتشاف استخدام واجهة برمجة تطبيقات مهملة.

### `--permission` {#--pending-deprecation}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | أصبح نموذج الأذونات الآن مستقرًا. |
| v20.0.0 | أضيف في: v20.0.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تمكين نموذج الأذونات للعملية الحالية. عند التمكين، يتم تقييد الأذونات التالية:

- نظام الملفات - يمكن إدارته من خلال علامات [`--allow-fs-read`](/ar/nodejs/api/cli#--allow-fs-read) و [`--allow-fs-write`](/ar/nodejs/api/cli#--allow-fs-write)
- العملية الفرعية - يمكن إدارتها من خلال علامة [`--allow-child-process`](/ar/nodejs/api/cli#--allow-child-process)
- سلاسل العمل للعامل - يمكن إدارتها من خلال علامة [`--allow-worker`](/ar/nodejs/api/cli#--allow-worker)
- WASI - يمكن إدارتها من خلال علامة [`--allow-wasi`](/ar/nodejs/api/cli#--allow-wasi)
- الوظائف الإضافية - يمكن إدارتها من خلال علامة [`--allow-addons`](/ar/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**أضيف في: v6.3.0**

يوجه محمل الوحدة النمطية للحفاظ على الروابط الرمزية عند حل وتخزين الوحدات النمطية مؤقتًا.

بشكل افتراضي، عندما يقوم Node.js بتحميل وحدة نمطية من مسار مرتبط رمزيًا بموقع مختلف على القرص، فإن Node.js يلغي الإشارة إلى الرابط ويستخدم "المسار الحقيقي" الفعلي للوحدة النمطية على القرص كمعرف ومسار جذر لتحديد مواقع وحدات نمطية تابعة أخرى. في معظم الحالات، يكون هذا السلوك الافتراضي مقبولاً. ومع ذلك، عند استخدام تبعيات نظيرة مرتبطة رمزيًا، كما هو موضح في المثال أدناه، يتسبب السلوك الافتراضي في حدوث استثناء إذا حاولت `moduleA` طلب `moduleB` كاعتماد نظير:

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
توجه علامة سطر الأوامر `--preserve-symlinks` Node.js لاستخدام مسار الارتباط الرمزي للوحدات النمطية بدلاً من المسار الحقيقي، مما يسمح بالعثور على تبعيات النظير المرتبطة رمزيًا.

لاحظ، مع ذلك، أن استخدام `--preserve-symlinks` يمكن أن يكون له آثار جانبية أخرى. على وجه التحديد، قد تفشل الوحدات النمطية *الأصلية* المرتبطة رمزيًا في التحميل إذا تم ربطها من أكثر من موقع واحد في شجرة التبعية (سيرى Node.js هذه كوحدتين نمطيتين منفصلتين وسيحاول تحميل الوحدة النمطية عدة مرات، مما يتسبب في حدوث استثناء).

لا تنطبق علامة `--preserve-symlinks` على الوحدة النمطية الرئيسية، مما يسمح بتشغيل `node --preserve-symlinks node_module/.bin/\<foo\>`. لتطبيق نفس السلوك على الوحدة النمطية الرئيسية، استخدم أيضًا `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**أضيف في: v10.2.0**

يُعلِم محمل الوحدات بالحفاظ على الروابط الرمزية عند تحليل وتخزين الوحدة الرئيسية مؤقتًا (`require.main`).

توجد هذه العلامة بحيث يمكن الاشتراك في الوحدة الرئيسية في نفس السلوك الذي تعطيه `--preserve-symlinks` لجميع الاستيرادات الأخرى؛ ومع ذلك، فهما علامتان منفصلتان للتوافق مع الإصدارات الأقدم من Node.js.

لا تعني `--preserve-symlinks-main` ضمنيًا `--preserve-symlinks`؛ استخدم `--preserve-symlinks-main` بالإضافة إلى `--preserve-symlinks` عندما يكون من غير المرغوب فيه تتبع الروابط الرمزية قبل تحليل المسارات النسبية.

راجع [`--preserve-symlinks`](/ar/nodejs/api/cli#--preserve-symlinks) لمزيد من المعلومات.

### `-p`, `--print "script"` {#--preserve-symlinks-main}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.11.0 | المكتبات المدمجة متاحة الآن كمتغيرات محددة مسبقًا. |
| v0.6.4 | أضيف في: v0.6.4 |
:::

مطابق لـ `-e` ولكنه يطبع النتيجة.

### `--prof` {#-p---print-"script"}

**أضيف في: v2.0.0**

إنشاء مخرج محلل V8.

### `--prof-process` {#--prof}

**أضيف في: v5.2.0**

معالجة مخرج محلل V8 الذي تم إنشاؤه باستخدام خيار V8 `--prof`.

### `--redirect-warnings=file` {#--prof-process}

**أضيف في: v8.0.0**

اكتب تحذيرات العملية إلى الملف المحدد بدلاً من الطباعة إلى stderr. سيتم إنشاء الملف إذا لم يكن موجودًا، وسيتم إلحاقه إذا كان موجودًا. إذا حدث خطأ أثناء محاولة كتابة التحذير إلى الملف، فسيتم كتابة التحذير إلى stderr بدلاً من ذلك.

قد يكون اسم `file` مسارًا مطلقًا. إذا لم يكن كذلك، فإن الدليل الافتراضي الذي ستتم الكتابة إليه يتم التحكم فيه بواسطة خيار سطر الأوامر [`--diagnostic-dir`](/ar/nodejs/api/cli#--diagnostic-dirdirectory).

### `--report-compact` {#--redirect-warnings=file}

**أضيف في: v13.12.0, v12.17.0**

اكتب التقارير بتنسيق مضغوط، JSON بسطر واحد، يمكن أن تستهلكه أنظمة معالجة السجلات بسهولة أكبر من التنسيق متعدد الأسطر الافتراضي المصمم للاستهلاك البشري.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.12.0, v12.17.0 | لم يعد هذا الخيار تجريبيًا. |
| v12.0.0 | تم تغييره من `--diagnostic-report-directory` إلى `--report-directory`. |
| v11.8.0 | أضيف في: v11.8.0 |
:::

الموقع الذي سيتم فيه إنشاء التقرير.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**تمت الإضافة في: v23.3.0**

عند تمرير `--report-exclude-env`، لن يحتوي تقرير التشخيص المُنشأ على بيانات `environmentVariables`.

### `--report-exclude-network` {#--report-exclude-env}

**تمت الإضافة في: v22.0.0, v20.13.0**

استبعاد `header.networkInterfaces` من تقرير التشخيص. افتراضيًا، لم يتم تعيين هذا الخيار وسيتم تضمين واجهات الشبكة.

### `--report-filename=filename` {#--report-exclude-network}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.12.0, v12.17.0 | لم يعد هذا الخيار تجريبيًا. |
| v12.0.0 | تم تغيير الاسم من `--diagnostic-report-filename` إلى `--report-filename`. |
| v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

اسم الملف الذي سيتم كتابة التقرير إليه.

إذا تم تعيين اسم الملف إلى `'stdout'` أو `'stderr'`، فسيتم كتابة التقرير إلى stdout أو stderr للعملية على التوالي.

### `--report-on-fatalerror` {#--report-filename=filename}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | لم يعد هذا الخيار تجريبيًا. |
| v12.0.0 | تم تغيير الاسم من `--diagnostic-report-on-fatalerror` إلى `--report-on-fatalerror`. |
| v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

يتيح تشغيل التقرير عند حدوث أخطاء جسيمة (أخطاء داخلية في وقت تشغيل Node.js مثل نفاد الذاكرة) تؤدي إلى إنهاء التطبيق. من المفيد فحص عناصر بيانات التشخيص المختلفة مثل الكومة، والمكدس، وحالة حلقة الأحداث، واستهلاك الموارد وما إلى ذلك، للاستدلال على الخطأ الجسيم.

### `--report-on-signal` {#--report-on-fatalerror}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.12.0, v12.17.0 | لم يعد هذا الخيار تجريبيًا. |
| v12.0.0 | تم تغيير الاسم من `--diagnostic-report-on-signal` إلى `--report-on-signal`. |
| v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

يتيح إنشاء تقرير عند استلام الإشارة المحددة (أو المعرفة مسبقًا) إلى عملية Node.js قيد التشغيل. يتم تحديد الإشارة لتشغيل التقرير من خلال `--report-signal`.

### `--report-signal=signal` {#--report-on-signal}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.12.0, v12.17.0 | لم يعد هذا الخيار تجريبيًا. |
| v12.0.0 | تم تغيير الاسم من `--diagnostic-report-signal` إلى `--report-signal`. |
| v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

يعيّن أو يعيد تعيين الإشارة لإنشاء التقرير (غير مدعوم على Windows). الإشارة الافتراضية هي `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.8.0، v16.18.0 | لا يتم إنشاء التقرير إذا تمت معالجة الاستثناء غير الملتقط. |
| الإصدار v13.12.0، v12.17.0 | هذا الخيار لم يعد تجريبيًا. |
| الإصدار v12.0.0 | تم التغيير من `--diagnostic-report-uncaught-exception` إلى `--report-uncaught-exception`. |
| الإصدار v11.8.0 | تمت الإضافة في: v11.8.0 |
:::

يتيح إنشاء تقرير عند خروج العملية بسبب استثناء غير ملتقط. مفيد عند فحص مكدس JavaScript بالاقتران مع المكدس الأصلي وبيانات بيئة التشغيل الأخرى.

### `-r`, `--require module` {#--report-uncaught-exception}

**تمت الإضافة في: v1.6.0**

قم بتحميل الوحدة النمطية المحددة مسبقًا عند بدء التشغيل.

يتبع قواعد تحليل الوحدة النمطية الخاصة بـ `require()`. قد يكون `module` إما مسارًا إلى ملف أو اسم وحدة نمطية للعقدة.

الوحدات النمطية CommonJS فقط هي المدعومة. استخدم [`--import`](/ar/nodejs/api/cli#--importmodule) لتحميل [وحدة نمطية ECMAScript](/ar/nodejs/api/esm#modules-ecmascript-modules). سيتم تشغيل الوحدات النمطية المحملة مسبقًا باستخدام `--require` قبل الوحدات النمطية المحملة مسبقًا باستخدام `--import`.

يتم تحميل الوحدات النمطية مسبقًا في مؤشر الترابط الرئيسي بالإضافة إلى أي سلاسل عامل أو عمليات متشعبة أو عمليات مجمعة.

### `--run` {#-r---require-module}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v22.3.0 | تمت إضافة متغير البيئة NODE_RUN_SCRIPT_NAME. |
| الإصدار v22.3.0 | تمت إضافة متغير البيئة NODE_RUN_PACKAGE_JSON_PATH. |
| الإصدار v22.3.0 | يجتاز ما يصل إلى الدليل الجذر ويجد ملف `package.json` لتشغيل الأمر منه، ويقوم بتحديث متغير البيئة `PATH` وفقًا لذلك. |
| الإصدار v22.0.0 | تمت الإضافة في: v22.0.0 |
:::

::: tip [ثابت: 2 - ثابت]
[ثابت: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - ثابت
:::

يقوم هذا بتشغيل أمر محدد من كائن `"scripts"` في ملف package.json. إذا تم توفير `"command"` مفقود، فسوف يسرد البرامج النصية المتاحة.

`--run` سوف يجتاز ما يصل إلى الدليل الجذر ويجد ملف `package.json` لتشغيل الأمر منه.

`--run` يقوم بإضافة `./node_modules/.bin` لكل سلف للدليل الحالي، إلى `PATH` من أجل تنفيذ الثنائيات من مجلدات مختلفة حيث توجد عدة أدلة `node_modules`، إذا كان `ancestor-folder/node_modules/.bin` دليلًا.

`--run` يقوم بتنفيذ الأمر في الدليل الذي يحتوي على `package.json` ذي الصلة.

على سبيل المثال، سيقوم الأمر التالي بتشغيل البرنامج النصي `test` لملف `package.json` في المجلد الحالي:

```bash [BASH]
$ node --run test
```
يمكنك أيضًا تمرير وسيطات إلى الأمر. سيتم إلحاق أي وسيطة بعد `--` بالبرنامج النصي:

```bash [BASH]
$ node --run test -- --verbose
```

#### القيود المقصودة {#--run}

`node --run` ليس المقصود منه أن يطابق سلوكيات `npm run` أو أوامر `run` الخاصة بمديري الحزم الآخرين. تطبيق Node.js محدود بشكل مقصود، من أجل التركيز على أعلى أداء لحالات الاستخدام الأكثر شيوعًا. بعض ميزات تطبيقات `run` الأخرى المستبعدة بشكل مقصود هي:

- تشغيل برامج `pre` أو `post` النصية بالإضافة إلى البرنامج النصي المحدد.
- تحديد متغيرات البيئة الخاصة بمدير الحزم.

#### متغيرات البيئة {#intentional-limitations}

يتم تعيين متغيرات البيئة التالية عند تشغيل برنامج نصي باستخدام `--run`:

- `NODE_RUN_SCRIPT_NAME`: اسم البرنامج النصي قيد التشغيل. على سبيل المثال، إذا تم استخدام `--run` لتشغيل `test`، فستكون قيمة هذا المتغير `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: مسار `package.json` الذي تتم معالجته.

### `--secure-heap-min=n` {#environment-variables}

**أضيف في: v15.6.0**

عند استخدام `--secure-heap`، تحدد علامة `--secure-heap-min` الحد الأدنى للتخصيص من الكومة الآمنة. الحد الأدنى للقيمة هو `2`. القيمة القصوى هي الأصغر بين `--secure-heap` أو `2147483647`. يجب أن تكون القيمة المعطاة قوة للرقم اثنين.

### `--secure-heap=n` {#--secure-heap-min=n}

**أضيف في: v15.6.0**

يقوم بتهيئة كومة OpenSSL آمنة بحجم `n` بايت. عند التهيئة، يتم استخدام الكومة الآمنة لأنواع محددة من التخصيصات داخل OpenSSL أثناء إنشاء المفاتيح وعمليات أخرى. هذا مفيد، على سبيل المثال، لمنع تسرب المعلومات الحساسة بسبب تجاوزات أو نقص المؤشرات.

الكومة الآمنة ذات حجم ثابت ولا يمكن تغيير حجمها في وقت التشغيل، لذا، إذا تم استخدامها، فمن المهم تحديد كومة كبيرة بما يكفي لتغطية جميع استخدامات التطبيق.

يجب أن يكون حجم الكومة المعطى قوة للرقم اثنين. أي قيمة أقل من 2 ستؤدي إلى تعطيل الكومة الآمنة.

الكومة الآمنة معطلة افتراضيًا.

الكومة الآمنة غير متوفرة على نظام التشغيل Windows.

راجع [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) لمزيد من التفاصيل.

### `--snapshot-blob=path` {#--secure-heap=n}

**أضيف في: v18.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

عند استخدامها مع `--build-snapshot`، تحدد `--snapshot-blob` المسار حيث تتم كتابة نقطة الصورة الناتجة. إذا لم يتم تحديدها، فستتم كتابة النقطة الناتجة إلى `snapshot.blob` في دليل العمل الحالي.

عند استخدامها بدون `--build-snapshot`، تحدد `--snapshot-blob` المسار إلى النقطة المستخدمة لاستعادة حالة التطبيق.

عند تحميل لقطة، يتحقق Node.js من:

إذا لم تتطابق، سيرفض Node.js تحميل اللقطة ويخرج برمز الحالة 1.


### `--test` {#--snapshot-blob=path}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v20.0.0 | أصبح مشغل الاختبار الآن مستقرًا. |
| الإصداران v19.2.0 و v18.13.0 | يدعم مشغل الاختبار الآن التشغيل في وضع المراقبة. |
| الإصداران v18.1.0 و v16.17.0 | تمت الإضافة في: v18.1.0 و v16.17.0 |
:::

يبدأ مشغل اختبار سطر الأوامر الخاص بـ Node.js. لا يمكن دمج هذا العلم مع `--watch-path` أو `--check` أو `--eval` أو `--interactive` أو المفتش. راجع الوثائق حول [تشغيل الاختبارات من سطر الأوامر](/ar/nodejs/api/test#running-tests-from-the-command-line) لمزيد من التفاصيل.

### `--test-concurrency` {#--test}

**تمت الإضافة في: v21.0.0، v20.10.0، v18.19.0**

الحد الأقصى لعدد ملفات الاختبار التي سيقوم CLI الخاص بمشغل الاختبار بتنفيذها بشكل متزامن. إذا تم تعيين `--experimental-test-isolation` على `'none'`، فسيتم تجاهل هذا العلم ويكون التزامن واحدًا. بخلاف ذلك، يكون التزامن افتراضيًا `os.availableParallelism() - 1`.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**تمت الإضافة في: v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يتطلب حدًا أدنى للنسبة المئوية للفروع المشمولة. إذا لم تصل تغطية التعليمات البرمجية إلى الحد المحدد، فستنتهي العملية بالرمز `1`.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**تمت الإضافة في: v22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستبعد ملفات معينة من تغطية التعليمات البرمجية باستخدام نمط glob، والذي يمكن أن يطابق مسارات الملفات المطلقة والنسبية.

يمكن تحديد هذا الخيار عدة مرات لاستبعاد أنماط glob متعددة.

إذا تم توفير كل من `--test-coverage-exclude` و `--test-coverage-include`، فيجب أن تستوفي الملفات **كلا** المعيارين ليتم تضمينها في تقرير التغطية.

بشكل افتراضي، يتم استبعاد جميع ملفات الاختبار المطابقة من تقرير التغطية. سيؤدي تحديد هذا الخيار إلى تجاوز السلوك الافتراضي.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**تمت الإضافة في: v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يتطلب حدًا أدنى للنسبة المئوية للدوال المشمولة. إذا لم تصل تغطية التعليمات البرمجية إلى الحد المحدد، فستنتهي العملية بالرمز `1`.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**أُضيف في: v22.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يتضمن ملفات محددة في تغطية التعليمات البرمجية باستخدام نمط glob، والذي يمكن أن يطابق مسارات الملفات المطلقة والنسبية.

يمكن تحديد هذا الخيار عدة مرات لتضمين أنماط glob متعددة.

إذا تم توفير كل من `--test-coverage-exclude` و `--test-coverage-include`، يجب أن تستوفي الملفات كلا المعيارين ليتم تضمينها في تقرير التغطية.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**أُضيف في: v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يتطلب حدًا أدنى للنسبة المئوية للأسطر المغطاة. إذا لم تصل تغطية التعليمات البرمجية إلى الحد المحدد، فستنتهي العملية بالرمز `1`.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**أُضيف في: v22.0.0, v20.14.0**

يقوم بتكوين مُشغل الاختبار لإنهاء العملية بمجرد الانتهاء من تنفيذ جميع الاختبارات المعروفة حتى إذا كانت حلقة الأحداث ستظل نشطة بخلاف ذلك.

### `--test-name-pattern` {#--test-force-exit}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | مُشغل الاختبار مستقر الآن. |
| v18.11.0 | أُضيف في: v18.11.0 |
:::

تعبير نمطي يقوم بتكوين مُشغل الاختبار لتنفيذ الاختبارات فقط التي يتطابق اسمها مع النمط المقدم. راجع الوثائق حول [تصفية الاختبارات بالاسم](/ar/nodejs/api/test#filtering-tests-by-name) لمزيد من التفاصيل.

إذا تم توفير كل من `--test-name-pattern` و `--test-skip-pattern`، يجب أن تستوفي الاختبارات كلا المتطلبات حتى يتم تنفيذها.

### `--test-only` {#--test-name-pattern}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | مُشغل الاختبار مستقر الآن. |
| v18.0.0, v16.17.0 | أُضيف في: v18.0.0, v16.17.0 |
:::

يقوم بتكوين مُشغل الاختبار لتنفيذ الاختبارات ذات المستوى الأعلى فقط التي تم تعيين خيار `only` لها. هذا العلم غير ضروري عند تعطيل عزل الاختبار.

### `--test-reporter` {#--test-only}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | مُشغل الاختبار مستقر الآن. |
| v19.6.0, v18.15.0 | أُضيف في: v19.6.0, v18.15.0 |
:::

مُبلغ اختبار لاستخدامه عند تشغيل الاختبارات. راجع الوثائق حول [مُبلغي الاختبار](/ar/nodejs/api/test#test-reporters) لمزيد من التفاصيل.


### `--test-reporter-destination` {#--test-reporter}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 20.0.0 | أصبح تشغيل الاختبار الآن مستقرًا. |
| الإصدار 19.6.0، الإصدار 18.15.0 | تمت الإضافة في: الإصدار 19.6.0، الإصدار 18.15.0 |
:::

الوجهة الخاصة بمسجل الاختبار المقابل. راجع الوثائق الخاصة بـ [مسجلات الاختبار](/ar/nodejs/api/test#test-reporters) لمزيد من التفاصيل.

### `--test-shard` {#--test-reporter-destination}

**تمت الإضافة في: الإصدار 20.5.0، الإصدار 18.19.0**

شريحة مجموعة الاختبارات المراد تنفيذها بتنسيق `\<الفهرس\>/\<الإجمالي\>`، حيث

`الفهرس` هو عدد صحيح موجب، فهرس الأجزاء المقسمة. `الإجمالي` هو عدد صحيح موجب، إجمالي الجزء المقسم. سيقسم هذا الأمر جميع ملفات الاختبار إلى أجزاء متساوية `الإجمالي`، وسيقوم بتشغيل تلك التي تحدث في جزء `الفهرس` فقط.

على سبيل المثال، لتقسيم مجموعة الاختبارات الخاصة بك إلى ثلاثة أجزاء، استخدم ما يلي:

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**تمت الإضافة في: الإصدار 22.1.0**

تعبير نمطي يكوّن مشغل الاختبار لتخطي الاختبارات التي يتطابق اسمها مع النمط المقدم. راجع الوثائق الخاصة بـ [تصفية الاختبارات بالاسم](/ar/nodejs/api/test#filtering-tests-by-name) لمزيد من التفاصيل.

إذا تم توفير كل من `--test-name-pattern` و`--test-skip-pattern`، فيجب أن تستوفي الاختبارات **كلا** الشرطين ليتم تنفيذها.

### `--test-timeout` {#--test-skip-pattern}

**تمت الإضافة في: الإصدار 21.2.0، الإصدار 20.11.0**

عدد بالمللي ثانية يفشل تنفيذ الاختبار بعده. إذا لم يتم تحديده، فإن الاختبارات الفرعية ترث هذه القيمة من الأصل الخاص بها. القيمة الافتراضية هي `Infinity`.

### `--test-update-snapshots` {#--test-timeout}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 23.4.0 | اختبار اللقطات لم يعد تجريبيًا. |
| الإصدار 22.3.0 | تمت الإضافة في: الإصدار 22.3.0 |
:::

يعيد إنشاء ملفات اللقطات التي يستخدمها مشغل الاختبار لـ [اختبار اللقطات](/ar/nodejs/api/test#snapshot-testing).

### `--throw-deprecation` {#--test-update-snapshots}

**تمت الإضافة في: الإصدار 0.11.14**

طرح أخطاء بسبب الإهمال.

### `--title=title` {#--throw-deprecation}

**تمت الإضافة في: الإصدار 10.7.0**

قم بتعيين `process.title` عند بدء التشغيل.

### `--tls-cipher-list=list` {#--title=title}

**تمت الإضافة في: الإصدار 4.0.0**

حدد قائمة تشفير TLS افتراضية بديلة. يتطلب إنشاء Node.js بدعم التشفير (افتراضي).


### `--tls-keylog=file` {#--tls-cipher-list=list}

**أضيف في: v13.2.0, v12.16.0**

تسجيل مادة مفتاح TLS في ملف. مادة المفتاح هي في تنسيق NSS `SSLKEYLOGFILE` ويمكن استخدامها بواسطة البرامج (مثل Wireshark) لفك تشفير حركة مرور TLS.

### `--tls-max-v1.2` {#--tls-keylog=file}

**أضيف في: v12.0.0, v10.20.0**

قم بتعيين [`tls.DEFAULT_MAX_VERSION`](/ar/nodejs/api/tls#tlsdefault_max_version) إلى 'TLSv1.2'. استخدم لتعطيل دعم TLSv1.3.

### `--tls-max-v1.3` {#--tls-max-v12}

**أضيف في: v12.0.0**

قم بتعيين الإعداد الافتراضي [`tls.DEFAULT_MAX_VERSION`](/ar/nodejs/api/tls#tlsdefault_max_version) إلى 'TLSv1.3'. استخدم لتمكين دعم TLSv1.3.

### `--tls-min-v1.0` {#--tls-max-v13}

**أضيف في: v12.0.0, v10.20.0**

قم بتعيين الإعداد الافتراضي [`tls.DEFAULT_MIN_VERSION`](/ar/nodejs/api/tls#tlsdefault_min_version) إلى 'TLSv1'. استخدم للتوافق مع عملاء أو خوادم TLS القديمة.

### `--tls-min-v1.1` {#--tls-min-v10}

**أضيف في: v12.0.0, v10.20.0**

قم بتعيين الإعداد الافتراضي [`tls.DEFAULT_MIN_VERSION`](/ar/nodejs/api/tls#tlsdefault_min_version) إلى 'TLSv1.1'. استخدم للتوافق مع عملاء أو خوادم TLS القديمة.

### `--tls-min-v1.2` {#--tls-min-v11}

**أضيف في: v12.2.0, v10.20.0**

قم بتعيين الإعداد الافتراضي [`tls.DEFAULT_MIN_VERSION`](/ar/nodejs/api/tls#tlsdefault_min_version) إلى 'TLSv1.2'. هذا هو الإعداد الافتراضي للإصدار 12.x والإصدارات الأحدث، ولكن الخيار مدعوم للتوافق مع إصدارات Node.js الأقدم.

### `--tls-min-v1.3` {#--tls-min-v12}

**أضيف في: v12.0.0**

قم بتعيين الإعداد الافتراضي [`tls.DEFAULT_MIN_VERSION`](/ar/nodejs/api/tls#tlsdefault_min_version) إلى 'TLSv1.3'. استخدم لتعطيل دعم TLSv1.2، وهو ليس آمنًا مثل TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**أضيف في: v0.8.0**

اطبع تتبعات المكدس لعمليات الإهمال.

### `--trace-env` {#--trace-deprecation}

**أضيف في: v23.4.0**

اطبع معلومات حول أي وصول إلى متغيرات البيئة يتم إجراؤه في مثيل Node.js الحالي إلى الخطأ القياسي، بما في ذلك:

- قراءات متغيرات البيئة التي يقوم بها Node.js داخليًا.
- عمليات الكتابة في شكل `process.env.KEY = "SOME VALUE"`.
- القراءات في شكل `process.env.KEY`.
- التعريفات في شكل `Object.defineProperty(process.env, 'KEY', {...})`.
- الاستعلامات في شكل `Object.hasOwn(process.env, 'KEY')` أو `process.env.hasOwnProperty('KEY')` أو `'KEY' in process.env`.
- عمليات الحذف في شكل `delete process.env.KEY`.
- التعدادات في شكل `...process.env` أو `Object.keys(process.env)`.

تتم طباعة أسماء متغيرات البيئة التي يتم الوصول إليها فقط. لا تتم طباعة القيم.

لطباعة تتبع مكدس الوصول، استخدم `--trace-env-js-stack` و/أو `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**تمت الإضافة في: v23.4.0**

بالإضافة إلى ما يفعله `--trace-env`، يطبع هذا تتبع مكدس JavaScript للوصول.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**تمت الإضافة في: v23.4.0**

بالإضافة إلى ما يفعله `--trace-env`، يطبع هذا تتبع المكدس الأصلي للوصول.

### `--trace-event-categories` {#--trace-env-native-stack}

**تمت الإضافة في: v7.7.0**

قائمة مفصولة بفواصل للفئات التي يجب تتبعها عند تمكين تتبع أحداث التتبع باستخدام `--trace-events-enabled`.

### `--trace-event-file-pattern` {#--trace-event-categories}

**تمت الإضافة في: v9.8.0**

سلسلة قالب تحدد مسار الملف لبيانات حدث التتبع، وهي تدعم `${rotation}` و `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**تمت الإضافة في: v7.7.0**

تمكن جمع معلومات تتبع أحداث التتبع.

### `--trace-exit` {#--trace-events-enabled}

**تمت الإضافة في: v13.5.0, v12.16.0**

يطبع تتبع مكدس كلما تم إنهاء بيئة بشكل استباقي، أي استدعاء `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**تمت الإضافة في: v23.5.0**

يطبع معلومات حول استخدام [تحميل وحدات ECMAScript باستخدام `require()`](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require).

عندما تكون `mode` هي `all`، تتم طباعة كل الاستخدامات. عندما تكون `mode` هي `no-node-modules`، يتم استبعاد الاستخدام من مجلد `node_modules`.

### `--trace-sigint` {#--trace-require-module=mode}

**تمت الإضافة في: v13.9.0, v12.17.0**

يطبع تتبع مكدس على SIGINT.

### `--trace-sync-io` {#--trace-sigint}

**تمت الإضافة في: v2.1.0**

يطبع تتبع مكدس كلما تم اكتشاف إدخال/إخراج متزامن بعد الدورة الأولى من حلقة الأحداث.

### `--trace-tls` {#--trace-sync-io}

**تمت الإضافة في: v12.2.0**

يطبع معلومات تتبع حزم TLS إلى `stderr`. يمكن استخدام هذا لتصحيح مشاكل اتصال TLS.

### `--trace-uncaught` {#--trace-tls}

**تمت الإضافة في: v13.1.0**

يطبع آثار المكدس للاستثناءات غير الملتقطة؛ عادةً، تتم طباعة تتبع المكدس المرتبط بإنشاء `Error`، بينما هذا يجعل Node.js يطبع أيضًا تتبع المكدس المرتبط بإلقاء القيمة (التي لا تحتاج إلى أن تكون مثيل `Error`).

قد يؤثر تمكين هذا الخيار سلبًا على سلوك جمع البيانات المهملة.

### `--trace-warnings` {#--trace-uncaught}

**تمت الإضافة في: v6.0.0**

يطبع آثار المكدس لتحذيرات العملية (بما في ذلك عمليات الإهمال).


### `--track-heap-objects` {#--trace-warnings}

**أُضيف في: الإصدار 2.4.0**

تتبع تخصيصات كائنات الكومة للقطات الكومة.

### `--unhandled-rejections=mode` {#--track-heap-objects}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | تم تغيير الوضع الافتراضي إلى `throw`. في السابق، كان يتم إصدار تحذير. |
| الإصدار 12.0.0, v10.17.0 | أُضيف في: الإصدار 12.0.0, v10.17.0 |
:::

يتيح استخدام هذا العلم تغيير ما يجب أن يحدث عند حدوث رفض غير معالج. يمكن اختيار أحد الأوضاع التالية:

- `throw`: إصدار [`unhandledRejection`](/ar/nodejs/api/process#event-unhandledrejection). إذا لم يتم تعيين هذه الوظيفة، فقم بإثارة الرفض غير المعالج كاستثناء غير ملتقط. هذا هو الوضع الافتراضي.
- `strict`: إثارة الرفض غير المعالج كاستثناء غير ملتقط. إذا تمت معالجة الاستثناء، فسيتم إصدار [`unhandledRejection`](/ar/nodejs/api/process#event-unhandledrejection).
- `warn`: قم دائمًا بتشغيل تحذير، بغض النظر عما إذا تم تعيين وظيفة [`unhandledRejection`](/ar/nodejs/api/process#event-unhandledrejection) أم لا، ولكن لا تطبع تحذير الإهمال.
- `warn-with-error-code`: إصدار [`unhandledRejection`](/ar/nodejs/api/process#event-unhandledrejection). إذا لم يتم تعيين هذه الوظيفة، فقم بتشغيل تحذير، واضبط رمز الخروج للعملية على 1.
- `none`: إسكات جميع التحذيرات.

إذا حدث رفض أثناء مرحلة التحميل الثابت لوحدة ES لنقطة دخول سطر الأوامر، فسوف يثيره دائمًا كاستثناء غير ملتقط.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**أُضيف في: الإصدار 6.11.0**

استخدم مخزن Mozilla CA المجمّع كما هو مقدم من قبل إصدار Node.js الحالي أو استخدم مخزن CA الافتراضي لـ OpenSSL. يمكن تحديد المخزن الافتراضي في وقت الإنشاء.

مخزن CA المجمّع، كما هو مقدم من قبل Node.js، هو لقطة لمخزن Mozilla CA الذي يتم تثبيته في وقت الإصدار. وهو مطابق على جميع الأنظمة الأساسية المدعومة.

يتيح استخدام مخزن OpenSSL إجراء تعديلات خارجية على المخزن. بالنسبة لمعظم توزيعات Linux و BSD، يتم الاحتفاظ بهذا المخزن من قبل القائمين على توزيعة النظام ومسؤولي النظام. يعتمد موقع مخزن OpenSSL CA على تكوين مكتبة OpenSSL ولكن يمكن تغيير ذلك في وقت التشغيل باستخدام متغيرات البيئة.

راجع `SSL_CERT_DIR` و `SSL_CERT_FILE`.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**أُضيف في: v13.6.0, v12.17.0**

إعادة تعيين كود Node.js الثابت إلى صفحات ذاكرة كبيرة عند بدء التشغيل. إذا كان مدعومًا على النظام المستهدف، فسيؤدي ذلك إلى نقل كود Node.js الثابت إلى صفحات بحجم 2 ميجابايت بدلاً من صفحات بحجم 4 كيلوبايت.

القيم التالية صالحة لـ `mode`:

- `off`: لن تتم محاولة أي تعيين. هذا هو الوضع الافتراضي.
- `on`: إذا كان مدعومًا من قِبل نظام التشغيل، فستتم محاولة التعيين. سيتم تجاهل الفشل في التعيين وسيتم طباعة رسالة إلى الخطأ القياسي.
- `silent`: إذا كان مدعومًا من قِبل نظام التشغيل، فستتم محاولة التعيين. سيتم تجاهل الفشل في التعيين ولن يتم الإبلاغ عنه.

### `--v8-options` {#--use-largepages=mode}

**أُضيف في: v0.1.3**

طباعة خيارات سطر الأوامر V8.

### `--v8-pool-size=num` {#--v8-options}

**أُضيف في: v5.10.0**

تعيين حجم تجمع مؤشرات ترابط V8 الذي سيتم استخدامه لتخصيص مهام الخلفية.

إذا تم تعيينه على `0`، فسيختار Node.js حجمًا مناسبًا لتجمع المؤشرات الترابطية بناءً على تقدير لمقدار التوازي.

يشير مقدار التوازي إلى عدد العمليات الحسابية التي يمكن إجراؤها في وقت واحد في جهاز معين. بشكل عام، هو نفس عدد وحدات المعالجة المركزية، ولكنه قد يختلف في بيئات مثل الأجهزة الافتراضية أو الحاويات.

### `-v`, `--version` {#--v8-pool-size=num}

**أُضيف في: v0.1.3**

طباعة إصدار node.

### `--watch` {#-v---version}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | وضع المراقبة مستقر الآن. |
| v19.2.0, v18.13.0 | يدعم الآن مشغل الاختبار التشغيل في وضع المراقبة. |
| v18.11.0, v16.19.0 | أُضيف في: v18.11.0, v16.19.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يبدأ Node.js في وضع المراقبة. في وضع المراقبة، تتسبب التغييرات في الملفات التي تتم مراقبتها في إعادة تشغيل عملية Node.js. بشكل افتراضي، سيراقب وضع المراقبة نقطة الإدخال وأي وحدة مطلوبة أو مستوردة. استخدم `--watch-path` لتحديد المسارات التي يجب مراقبتها.

لا يمكن دمج هذا العلم مع `--check` أو `--eval` أو `--interactive` أو REPL.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | أصبح وضع المراقبة الآن مستقرًا. |
| v18.11.0, v16.19.0 | تمت الإضافة في: v18.11.0, v16.19.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

يبدأ Node.js في وضع المراقبة ويحدد المسارات المراد مراقبتها. في وضع المراقبة، تؤدي التغييرات في المسارات المراقبة إلى إعادة تشغيل عملية Node.js. سيؤدي هذا إلى إيقاف مراقبة الوحدات المطلوبة أو المستوردة، حتى عند استخدامها مع `--watch`.

لا يمكن دمج هذا العلم مع `--check` أو `--eval` أو `--interactive` أو `--test` أو REPL.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
هذا الخيار مدعوم فقط على macOS و Windows. سيتم طرح استثناء `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` عند استخدام الخيار على نظام أساسي لا يدعمه.

### `--watch-preserve-output` {#--watch-path}

**تمت الإضافة في: v19.3.0, v18.13.0**

تعطيل مسح وحدة التحكم عند إعادة تشغيل العملية في وضع المراقبة.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**تمت الإضافة في: v6.0.0**

يقوم تلقائيًا بملء جميع مثيلات [`Buffer`](/ar/nodejs/api/buffer#class-buffer) و [`SlowBuffer`](/ar/nodejs/api/buffer#class-slowbuffer) المخصصة حديثًا بالأصفار.

## متغيرات البيئة {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

يتم استخدام متغير البيئة `FORCE_COLOR` لتمكين إخراج ANSI الملون. قد تكون القيمة:

- `1` أو `true` أو السلسلة الفارغة `''` تشير إلى دعم 16 لونًا،
- `2` للإشارة إلى دعم 256 لونًا، أو
- `3` للإشارة إلى دعم 16 مليون لون.

عند استخدام `FORCE_COLOR` وتعيينها إلى قيمة مدعومة، يتم تجاهل كل من متغيرات البيئة `NO_COLOR` و `NODE_DISABLE_COLORS`.

ستؤدي أي قيمة أخرى إلى تعطيل الإخراج الملون.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**تمت الإضافة في: v22.1.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تمكين [ذاكرة التخزين المؤقت لتجميع الوحدة](/ar/nodejs/api/module#module-compile-cache) لمثيل Node.js. راجع وثائق [ذاكرة التخزين المؤقت لتجميع الوحدة](/ar/nodejs/api/module#module-compile-cache) للحصول على التفاصيل.


### ‏`NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**تمت الإضافة في: الإصدار v0.1.32**

قائمة مفصولة بـ `','` للوحدات الأساسية التي يجب أن تطبع معلومات التصحيح.

### ‏`NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

قائمة مفصولة بـ `','` لوحدات C++ الأساسية التي يجب أن تطبع معلومات التصحيح.

### ‏`NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**تمت الإضافة في: الإصدار v0.3.0**

عند التعيين، لن يتم استخدام الألوان في REPL.

### ‏`NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**تمت الإضافة في: الإصدار v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تعطيل [ذاكرة التخزين المؤقت لتجميع الوحدات](/ar/nodejs/api/module#module-compile-cache) لمثيل Node.js. راجع وثائق [ذاكرة التخزين المؤقت لتجميع الوحدات](/ar/nodejs/api/module#module-compile-cache) للحصول على التفاصيل.

### ‏`NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**تمت الإضافة في: الإصدار v7.3.0**

عند التعيين، سيتم توسيع "الجذور" الموثوقة المعروفة (مثل VeriSign) بالشهادات الإضافية الموجودة في `file`. يجب أن يتكون الملف من شهادة واحدة أو أكثر موثوقة بتنسيق PEM. سيتم إصدار رسالة (مرة واحدة) باستخدام [`process.emitWarning()`](/ar/nodejs/api/process#processemitwarningwarning-options) إذا كان الملف مفقودًا أو تالفًا، ولكن سيتم تجاهل أي أخطاء أخرى.

لا يتم استخدام الشهادات المعروفة ولا الشهادات الإضافية عندما يتم تحديد خاصية خيارات `ca` بشكل صريح لعميل أو خادم TLS أو HTTPS.

يتم تجاهل متغير البيئة هذا عندما يتم تشغيل `node` كجذر setuid أو تم تعيين قدرات ملف Linux.

تتم قراءة متغير البيئة `NODE_EXTRA_CA_CERTS` فقط عند إطلاق عملية Node.js لأول مرة. تغيير القيمة في وقت التشغيل باستخدام `process.env.NODE_EXTRA_CA_CERTS` ليس له أي تأثير على العملية الحالية.

### ‏`NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**تمت الإضافة في: الإصدار v0.11.15**

مسار البيانات لبيانات ICU (كائن `Intl`). سيتم توسيع البيانات المرتبطة عند تجميعها مع دعم small-icu.

### ‏`NODE_NO_WARNINGS=1` {#node_icu_data=file}

**تمت الإضافة في: الإصدار v6.11.0**

عند التعيين إلى `1`، يتم إسكات تحذيرات العملية.

### ‏`NODE_OPTIONS=options...` {#node_no_warnings=1}

**تمت الإضافة في: الإصدار v8.0.0**

قائمة مفصولة بمسافات لخيارات سطر الأوامر. يتم تفسير `options...` قبل خيارات سطر الأوامر، لذلك ستتجاوز خيارات سطر الأوامر أو تتراكم بعد أي شيء في `options...`. سيخرج Node.js بخطأ إذا تم استخدام خيار غير مسموح به في البيئة، مثل `-p` أو ملف البرنامج النصي.

إذا كانت قيمة الخيار تحتوي على مسافة، فيمكن إلغاء المسافة باستخدام علامات اقتباس مزدوجة:

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
سيتجاوز علم فردي يتم تمريره كخيار سطر أوامر نفس العلم الذي تم تمريره إلى `NODE_OPTIONS`:

```bash [BASH]
# سيكون الفاحص متاحًا على المنفذ 5555 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
سيتم التعامل مع العلامة التي يمكن تمريرها عدة مرات كما لو أن مثيلات `NODE_OPTIONS` الخاصة بها قد تم تمريرها أولاً، ثم مثيلات سطر الأوامر الخاص بها لاحقًا:

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# يعادل: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
خيارات Node.js المسموح بها موجودة في القائمة التالية. إذا كان الخيار يدعم كلا المتغيرين --XX و --no-XX، فكلاهما مدعومان ولكن يتم تضمين واحد فقط في القائمة أدناه.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

خيارات V8 المسموح بها هي:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions` و `--perf-basic-prof` و `--perf-prof-unwinding-info` و `--perf-prof` متاحة فقط على Linux.

`--enable-etw-stack-walking` متاح فقط على Windows.


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**أضيف في: v0.1.32**

قائمة أدلة مفصولة بـ `':'` تسبق مسار البحث عن الوحدات.

في نظام التشغيل Windows، هذه قائمة مفصولة بـ `';'` بدلاً من ذلك.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**أضيف في: v8.0.0**

عند الضبط على `1`، تصدر تحذيرات الإهمال المعلقة.

عمليات الإهمال المعلقة مطابقة بشكل عام لعملية إهمال وقت التشغيل مع استثناء ملحوظ وهو أنها يتم *إيقاف تشغيلها* افتراضيًا ولن يتم إصدارها إلا إذا تم تعيين علامة سطر الأوامر `--pending-deprecation`، أو متغير البيئة `NODE_PENDING_DEPRECATION=1`. تُستخدم عمليات الإهمال المعلقة لتوفير نوع من آلية "الإنذار المبكر" الانتقائية التي يمكن للمطورين الاستفادة منها للكشف عن استخدام واجهة برمجة تطبيقات مهملة.

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

قم بتعيين عدد معالجات مثيلات الأنابيب المعلقة عندما ينتظر خادم الأنابيب الاتصالات. ينطبق هذا الإعداد على نظام التشغيل Windows فقط.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**أضيف في: v7.1.0**

عند الضبط على `1`، فإنه يوجه محمل الوحدات للحفاظ على الروابط الرمزية عند حل وحدات التخزين المؤقت.

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**أضيف في: v8.0.0**

عند التعيين، سيتم إصدار تحذيرات العملية إلى الملف المحدد بدلاً من الطباعة إلى stderr. سيتم إنشاء الملف إذا لم يكن موجودًا، وسيتم إلحاقه إذا كان موجودًا. إذا حدث خطأ أثناء محاولة كتابة التحذير إلى الملف، فسيتم كتابة التحذير إلى stderr بدلاً من ذلك. هذا يعادل استخدام علامة سطر الأوامر `--redirect-warnings=file`.

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v22.3.0, v20.16.0 | قم بإزالة إمكانية استخدام متغير البيئة هذا مع kDisableNodeOptionsEnv للمدمجين. |
| v13.0.0, v12.16.0 | أضيف في: v13.0.0, v12.16.0 |
:::

مسار إلى وحدة Node.js سيتم تحميلها بدلاً من REPL المضمن. سيؤدي تجاوز هذه القيمة إلى سلسلة فارغة (`''`) إلى استخدام REPL المضمن.

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**أضيف في: v3.0.0**

مسار إلى الملف المستخدم لتخزين سجل REPL الدائم. المسار الافتراضي هو `~/.node_repl_history`، والذي يتم تجاوزه بواسطة هذا المتغير. يؤدي تعيين القيمة إلى سلسلة فارغة (`''` أو `' '`) إلى تعطيل سجل REPL الدائم.


### ‏`NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**تمت الإضافة في: الإصدار 14.5.0**

إذا كانت قيمة `value` تساوي `'1'`، فسيتم تخطي التحقق من المنصة المدعومة أثناء بدء تشغيل Node.js. قد لا يتم تشغيل Node.js بشكل صحيح. لن يتم إصلاح أي مشاكل تواجهها على المنصات غير المدعومة.

### ‏`NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

إذا كانت قيمة `value` تساوي `'child'`، فسيتم تجاوز خيارات مراسل الاختبار وسيتم إرسال خرج الاختبار إلى stdout بتنسيق TAP. إذا تم توفير أي قيمة أخرى، فإن Node.js لا يقدم أي ضمانات بشأن تنسيق المراسل المستخدم أو استقراره.

### ‏`NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

إذا كانت قيمة `value` تساوي `'0'`، فسيتم تعطيل التحقق من الشهادة لاتصالات TLS. هذا يجعل TLS، و HTTPS بالتبعية، غير آمن. يُنصح بشدة بعدم استخدام متغير البيئة هذا.

### ‏`NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

عند التعيين، سيبدأ Node.js في إخراج [تغطية كود V8 JavaScript](https://v8project.blogspot.com/2017/12/javascript-code-coverage) وبيانات [خريطة المصدر](https://sourcemaps.info/spec) إلى الدليل المقدم كمعامل (تتم كتابة معلومات التغطية كـ JSON إلى ملفات بادئة `coverage`).

سيتم نشر ‏`NODE_V8_COVERAGE` تلقائيًا إلى العمليات الفرعية، مما يسهل قياس التطبيقات التي تستدعي عائلة الدوال `child_process.spawn()`. يمكن تعيين ‏`NODE_V8_COVERAGE` إلى سلسلة فارغة، لمنع الانتشار.

### ‏`NO_COLOR=&lt;any&gt;` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) هو اسم مستعار لـ `NODE_DISABLE_COLORS`. قيمة متغير البيئة اعتباطية.

#### إخراج التغطية {#no_color=&lt;any&gt;}

يتم إخراج التغطية كمصفوفة من كائنات [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) على المفتاح العلوي `result`:

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### ذاكرة التخزين المؤقت لخريطة المصدر {#coverage-output}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

إذا تم العثور عليها، فسيتم إلحاق بيانات خريطة المصدر بالمفتاح العلوي `source-map-cache` على كائن تغطية JSON.

`source-map-cache` هو كائن بمفاتيح تمثل ملفات تم استخراج خرائط المصدر منها، وقيم تتضمن عنوان URL لخريطة المصدر الخام (في المفتاح `url`)، ومعلومات Source Map v3 المحللة (في المفتاح `data`)، وأطوال سطور ملف المصدر (في المفتاح `lineLengths`).

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**أُضيف في: الإصدار v6.11.0**

تحميل ملف إعدادات OpenSSL عند بدء التشغيل. من بين الاستخدامات الأخرى، يمكن استخدام هذا لتمكين تشفير متوافق مع معيار FIPS إذا تم بناء Node.js باستخدام `./configure --openssl-fips`.

إذا تم استخدام خيار سطر الأوامر [`--openssl-config`](/ar/nodejs/api/cli#--openssl-configfile)، فسيتم تجاهل متغير البيئة.

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**أُضيف في: الإصدار v7.7.0**

إذا تم تمكين `--use-openssl-ca`، فإن هذا يتجاوز ويضبط دليل OpenSSL الذي يحتوي على الشهادات الموثوقة.

انتبه إلى أنه ما لم يتم تعيين بيئة العملية الفرعية بشكل صريح، فسيتم توريث متغير البيئة هذا بواسطة أي عمليات فرعية، وإذا كانت تستخدم OpenSSL، فقد يتسبب ذلك في أن تثق بنفس هيئات التصديق (CA) مثل Node.

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**أُضيف في: الإصدار v7.7.0**

إذا تم تمكين `--use-openssl-ca`، فإن هذا يتجاوز ويضبط ملف OpenSSL الذي يحتوي على الشهادات الموثوقة.

انتبه إلى أنه ما لم يتم تعيين بيئة العملية الفرعية بشكل صريح، فسيتم توريث متغير البيئة هذا بواسطة أي عمليات فرعية، وإذا كانت تستخدم OpenSSL، فقد يتسبب ذلك في أن تثق بنفس هيئات التصديق (CA) مثل Node.

### `TZ` {#ssl_cert_file=file}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v16.2.0 | تغيير متغير TZ باستخدام process.env.TZ = يغير المنطقة الزمنية على نظام التشغيل Windows أيضًا. |
| v13.0.0 | تغيير متغير TZ باستخدام process.env.TZ = يغير المنطقة الزمنية على أنظمة POSIX. |
| v0.0.1 | أُضيف في: الإصدار v0.0.1 |
:::

يُستخدم متغير البيئة `TZ` لتحديد إعدادات المنطقة الزمنية.

في حين أن Node.js لا يدعم جميع [الطرق المختلفة التي يتم بها التعامل مع `TZ` في البيئات الأخرى](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable)، إلا أنه يدعم [معرفات المناطق الزمنية](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) الأساسية (مثل `'Etc/UTC'` أو `'Europe/Paris'` أو `'America/New_York'`). قد يدعم بعض الاختصارات أو الأسماء المستعارة الأخرى، ولكن هذه الأمور غير مستحبة بشدة وغير مضمونة.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=حجم` {#tz}

تعيين عدد الخيوط المستخدمة في مجموعة خيوط libuv إلى `حجم` من الخيوط.

تُستخدم واجهات برمجة تطبيقات النظام غير المتزامنة بواسطة Node.js كلما أمكن ذلك، ولكن في الحالات التي لا توجد فيها، تُستخدم مجموعة خيوط libuv لإنشاء واجهات برمجة تطبيقات عقدة غير متزامنة بناءً على واجهات برمجة تطبيقات النظام المتزامنة. واجهات برمجة تطبيقات Node.js التي تستخدم مجموعة الخيوط هي:

- جميع واجهات برمجة تطبيقات `fs`، بخلاف واجهات برمجة تطبيقات مراقبة الملفات وتلك المتزامنة بشكل صريح
- واجهات برمجة تطبيقات التشفير غير المتزامنة مثل `crypto.pbkdf2()` و `crypto.scrypt()` و `crypto.randomBytes()` و `crypto.randomFill()` و `crypto.generateKeyPair()`
- `dns.lookup()`
- جميع واجهات برمجة تطبيقات `zlib`، بخلاف تلك المتزامنة بشكل صريح

نظرًا لأن مجموعة خيوط libuv لها حجم ثابت، فهذا يعني أنه إذا استغرقت أي من واجهات برمجة التطبيقات هذه وقتًا طويلاً لأي سبب من الأسباب، فستواجه واجهات برمجة تطبيقات أخرى (تبدو غير ذات صلة) تعمل في مجموعة خيوط libuv أداءً متدهورًا. من أجل التخفيف من هذه المشكلة، يتمثل أحد الحلول المحتملة في زيادة حجم مجموعة خيوط libuv عن طريق تعيين متغير البيئة `'UV_THREADPOOL_SIZE'` إلى قيمة أكبر من `4` (قيمتها الافتراضية الحالية). ومع ذلك، فإن تعيين هذا من داخل العملية باستخدام `process.env.UV_THREADPOOL_SIZE=size` ليس مضمونًا أن ينجح حيث سيتم إنشاء مجموعة الخيوط كجزء من تهيئة وقت التشغيل قبل تشغيل كود المستخدم بفترة طويلة. لمزيد من المعلومات، راجع [وثائق مجموعة خيوط libuv](https://docs.libuv.org/en/latest/threadpool).

## خيارات V8 مفيدة {#uv_threadpool_size=size}

لدى V8 مجموعة الخيارات الخاصة بها في CLI. سيتم تمرير أي خيار V8 CLI يتم توفيره إلى `node` إلى V8 لمعالجته. خيارات V8 *ليس لها ضمان استقرار*. لا يعتبرها فريق V8 نفسه جزءًا من واجهة برمجة التطبيقات الرسمية الخاصة بهم، ويحتفظون بالحق في تغييرها في أي وقت. وبالمثل، فهي غير مشمولة بضمانات استقرار Node.js. العديد من خيارات V8 تهم مطوري V8 فقط. على الرغم من ذلك، هناك مجموعة صغيرة من خيارات V8 التي تنطبق على نطاق واسع على Node.js، وهي موثقة هنا:

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (بالميبيبايت) {#--jitless_1}

يحدد الحد الأقصى لحجم الذاكرة لقسم الذاكرة القديمة في V8. عندما يقترب استهلاك الذاكرة من الحد، ستستغرق V8 وقتًا أطول في جمع البيانات المهملة في محاولة لتحرير الذاكرة غير المستخدمة.

على جهاز به 2 جيجابايت من الذاكرة، ضع في اعتبارك تعيين هذا إلى 1536 (1.5 جيجابايت) لترك بعض الذاكرة للاستخدامات الأخرى وتجنب التبديل.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (بالميبيبايت) {#--max-old-space-size=size-in-mib}

يحدد الحد الأقصى لحجم [نصف المساحة](https://www.memorymanagement.org/glossary/s#semi.space) لـ [جامع البيانات المهملة scavenge](https://v8.dev/blog/orinoco-parallel-scavenger) في V8 بالميبيبايت (ميبيبايت). قد يؤدي زيادة الحد الأقصى لحجم نصف المساحة إلى تحسين الإنتاجية لـ Node.js على حساب استهلاك المزيد من الذاكرة.

نظرًا لأن حجم الجيل الشاب في كومة V8 يبلغ ثلاثة أضعاف (راجع [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) في V8) حجم نصف المساحة، فإن زيادة قدرها 1 ميبيبايت إلى نصف المساحة تنطبق على كل من أنصاف المساحات الثلاثة الفردية وتتسبب في زيادة حجم الكومة بمقدار 3 ميبيبايت. يعتمد تحسين الإنتاجية على حمل العمل الخاص بك (راجع [#42511](https://github.com/nodejs/node/issues/42511)).

تعتمد القيمة الافتراضية على حد الذاكرة. على سبيل المثال، في الأنظمة 64 بت بحد ذاكرة 512 ميبيبايت، يكون الحد الأقصى لحجم نصف المساحة الافتراضي هو 1 ميبيبايت. بالنسبة لحدود الذاكرة التي تصل إلى 2 جيجابايت بما في ذلك، سيكون الحد الأقصى الافتراضي لحجم نصف المساحة أقل من 16 ميبيبايت على أنظمة 64 بت.

للحصول على أفضل تكوين لتطبيقك، يجب أن تجرب قيمًا مختلفة لـ max-semi-space-size عند تشغيل معايير الأداء لتطبيقك.

على سبيل المثال، معيار الأداء على أنظمة 64 بت:

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

الحد الأقصى لعدد إطارات التجميع لتجميعها في تتبع مكدس الأخطاء. تعيينه إلى 0 يعطل تجميع تتبع المكدس. القيمة الافتراضية هي 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # prints 12
```

