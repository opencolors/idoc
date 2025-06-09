---
title: توثيق Node.js - WASI
description: استكشف توثيق Node.js لواجهة نظام WebAssembly (WASI)، مع تفاصيل حول كيفية استخدام WASI في بيئات Node.js، بما في ذلك واجهات برمجة التطبيقات لعمليات نظام الملفات، ومتغيرات البيئة، والمزيد.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - WASI | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف توثيق Node.js لواجهة نظام WebAssembly (WASI)، مع تفاصيل حول كيفية استخدام WASI في بيئات Node.js، بما في ذلك واجهات برمجة التطبيقات لعمليات نظام الملفات، ومتغيرات البيئة، والمزيد.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - WASI | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف توثيق Node.js لواجهة نظام WebAssembly (WASI)، مع تفاصيل حول كيفية استخدام WASI في بيئات Node.js، بما في ذلك واجهات برمجة التطبيقات لعمليات نظام الملفات، ومتغيرات البيئة، والمزيد.
---


# واجهة نظام WebAssembly (WASI) {#webassembly-system-interface-wasi}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

**الوحدة النمطية <code>node:wasi</code> لا توفر حاليًا
خصائص أمان نظام الملفات الشاملة التي توفرها بعض أوقات تشغيل WASI.
قد يتم أو لا يتم تنفيذ الدعم الكامل لصندوق حماية نظام الملفات الآمن في
المستقبل. في غضون ذلك، لا تعتمد عليه لتشغيل التعليمات البرمجية غير الموثوق بها.**

**كود المصدر:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

توفر واجهة برمجة تطبيقات WASI تنفيذًا لمواصفات [واجهة نظام WebAssembly](https://wasi.dev/). تمنح WASI تطبيقات WebAssembly إمكانية الوصول إلى نظام التشغيل الأساسي عبر مجموعة من الوظائف الشبيهة بـ POSIX.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

لتشغيل المثال أعلاه، قم بإنشاء ملف تنسيق نص WebAssembly جديد باسم `demo.wat`:

```text [TEXT]
(module
    ;; استيراد دالة fd_write WASI المطلوبة التي ستكتب ناقلات الإدخال والإخراج المعينة إلى stdout
    ;; توقيع الدالة لـ fd_write هو:
    ;; (واصف الملف، *iovs، iovs_len، nwritten) -> إرجاع عدد البايتات المكتوبة
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; اكتب 'hello world\n' في الذاكرة بإزاحة 8 بايت
    ;; لاحظ السطر الجديد اللاحق المطلوب لظهور النص
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; إنشاء ناقل إدخال وإخراج جديد داخل الذاكرة الخطية
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - هذا مؤشر إلى بداية سلسلة 'hello world\n'
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - طول سلسلة 'hello world\n'

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 لـ stdout
            (i32.const 0) ;; *iovs - المؤشر إلى مصفوفة iov، المخزنة في موقع الذاكرة 0
            (i32.const 1) ;; iovs_len - نطبع سلسلة واحدة مخزنة في iov - إذن واحدة.
            (i32.const 20) ;; nwritten - مكان في الذاكرة لتخزين عدد البايتات المكتوبة
        )
        drop ;; تجاهل عدد البايتات المكتوبة من أعلى المكدس
    )
)
```
استخدم [wabt](https://github.com/WebAssembly/wabt) لتجميع `.wat` إلى `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## الأمن {#security}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.2.0, v20.11.0 | توضيح خصائص أمان WASI. |
| v21.2.0, v20.11.0 | أُضيف في: v21.2.0, v20.11.0 |
:::

يوفر WASI نموذجًا قائمًا على الإمكانيات يتم من خلاله تزويد التطبيقات بإمكانيات `env` و `preopens` و `stdin` و `stdout` و `stderr` و `exit` المخصصة الخاصة بها.

**لا يوفر نموذج التهديدات الحالي لـ Node.js بيئة اختبار معزولة آمنة كما هو موجود في بعض أوقات تشغيل WASI.**

في حين أن ميزات الإمكانات مدعومة، إلا أنها لا تشكل نموذج أمان في Node.js. على سبيل المثال، يمكن الهروب من بيئة الاختبار المعزولة لنظام الملفات باستخدام تقنيات مختلفة. يستكشف المشروع ما إذا كان يمكن إضافة ضمانات الأمان هذه في المستقبل.

## الصنف: `WASI` {#class-wasi}

**أُضيف في: v13.3.0, v12.16.0**

يوفر الصنف `WASI` واجهة برمجة تطبيقات استدعاء نظام WASI وطرق ملائمة إضافية للعمل مع التطبيقات القائمة على WASI. يمثل كل مثيل `WASI` بيئة متميزة.

### `new WASI([options])` {#new-wasioptions}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0 | تم تغيير القيمة الافتراضية لـ returnOnExit إلى true. |
| v20.0.0 | الخيار version مطلوب الآن وليس له قيمة افتراضية. |
| v19.8.0 | تمت إضافة الحقل version إلى الخيارات. |
| v13.3.0, v12.16.0 | أُضيف في: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) عبارة عن مجموعة من السلاسل النصية التي سيراها تطبيق WebAssembly كمعلمات سطر الأوامر. الوسيطة الأولى هي المسار الظاهري لأمر WASI نفسه. **افتراضي:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن مشابه لـ `process.env` الذي سيراه تطبيق WebAssembly كبيئته. **افتراضي:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يمثل هذا الكائن بنية الدليل المحلي لتطبيق WebAssembly. تُعامل مفاتيح السلسلة النصية لـ `preopens` كأدلة داخل نظام الملفات. القيم المقابلة في `preopens` هي المسارات الحقيقية لتلك الدلائل على الجهاز المضيف.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) بشكل افتراضي، عندما تستدعي تطبيقات WASI  `__wasi_proc_exit()`، ستعيد `wasi.start()` مع رمز الخروج المحدد بدلاً من إنهاء العملية. سيؤدي تعيين هذا الخيار على `false` إلى إنهاء عملية Node.js برمز الخروج المحدد بدلاً من ذلك. **افتراضي:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف الملف المستخدم كمدخل قياسي في تطبيق WebAssembly. **افتراضي:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف الملف المستخدم كمخرج قياسي في تطبيق WebAssembly. **افتراضي:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف الملف المستخدم كخطأ قياسي في تطبيق WebAssembly. **افتراضي:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إصدار WASI المطلوب. الإصداران الوحيدان المدعومان حاليًا هما `unstable` و `preview1`. هذا الخيار إلزامي.


### `wasi.getImportObject()` {#wasigetimportobject}

**أُضيف في: v19.8.0**

إرجاع كائن استيراد يمكن تمريره إلى `WebAssembly.instantiate()` إذا لم تكن هناك حاجة إلى أي استيرادات WASM أخرى بخلاف تلك التي توفرها WASI.

إذا تم تمرير الإصدار `unstable` إلى المُنشئ، فسيتم إرجاع:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
إذا تم تمرير الإصدار `preview1` إلى المُنشئ أو لم يتم تحديد أي إصدار، فسيتم إرجاع:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**أُضيف في: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

محاولة بدء تنفيذ `instance` كأمر WASI عن طريق استدعاء تصديره `_start()`. إذا لم يكن `instance` يحتوي على تصدير `_start()`، أو إذا كان `instance` يحتوي على تصدير `_initialize()`، فسيتم طرح استثناء.

تتطلب `start()` أن يصدر `instance` [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) باسم `memory`. إذا لم يكن لدى `instance` تصدير `memory`، فسيتم طرح استثناء.

إذا تم استدعاء `start()` أكثر من مرة، فسيتم طرح استثناء.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**أُضيف في: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

محاولة تهيئة `instance` كمفاعل WASI عن طريق استدعاء تصديره `_initialize()`، إذا كان موجودًا. إذا كان `instance` يحتوي على تصدير `_start()`، فسيتم طرح استثناء.

تتطلب `initialize()` أن يصدر `instance` [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) باسم `memory`. إذا لم يكن لدى `instance` تصدير `memory`، فسيتم طرح استثناء.

إذا تم استدعاء `initialize()` أكثر من مرة، فسيتم طرح استثناء.

### `wasi.wasiImport` {#wasiwasiimport}

**أُضيف في: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` هو كائن يقوم بتنفيذ واجهة برمجة تطبيقات استدعاء نظام WASI. يجب تمرير هذا الكائن كاستيراد `wasi_snapshot_preview1` أثناء إنشاء [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

