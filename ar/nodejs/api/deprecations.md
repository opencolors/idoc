---
title: الخصائص المتهالكة في Node.js
description: توثق هذه الصفحة الخصائص المتهالكة في Node.js، وتوفر إرشادات حول كيفية تحديث الشيفرة لتجنب استخدام واجهات برمجة التطبيقات والممارسات القديمة.
head:
  - - meta
    - name: og:title
      content: الخصائص المتهالكة في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثق هذه الصفحة الخصائص المتهالكة في Node.js، وتوفر إرشادات حول كيفية تحديث الشيفرة لتجنب استخدام واجهات برمجة التطبيقات والممارسات القديمة.
  - - meta
    - name: twitter:title
      content: الخصائص المتهالكة في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثق هذه الصفحة الخصائص المتهالكة في Node.js، وتوفر إرشادات حول كيفية تحديث الشيفرة لتجنب استخدام واجهات برمجة التطبيقات والممارسات القديمة.
---


# واجهات برمجة التطبيقات المهملة {#deprecated-apis}

قد يتم إهمال واجهات برمجة التطبيقات الخاصة بـ Node.js لأي من الأسباب التالية:

- استخدام واجهة برمجة التطبيقات غير آمن.
- تتوفر واجهة برمجة تطبيقات بديلة محسّنة.
- من المتوقع حدوث تغييرات جذرية في واجهة برمجة التطبيقات في إصدار رئيسي مستقبلي.

تستخدم Node.js أربعة أنواع من عمليات الإهمال:

- توثيق فقط
- التطبيق (رمز غير `node_modules` فقط)
- وقت التشغيل (جميع التعليمات البرمجية)
- نهاية العمر

الإهمال التوثيقي فقط هو إهمال يتم التعبير عنه فقط داخل وثائق واجهة برمجة التطبيقات الخاصة بـ Node.js. لا تولد هذه العمليات أي آثار جانبية أثناء تشغيل Node.js. تؤدي بعض عمليات الإهمال التوثيقية فقط إلى تشغيل تحذير وقت التشغيل عند إطلاقها باستخدام علامة [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation) (أو بديلها، متغير البيئة `NODE_PENDING_DEPRECATION=1`)، على غرار عمليات الإهمال في وقت التشغيل أدناه. عمليات الإهمال التوثيقية فقط التي تدعم هذه العلامة مُعلنة بشكل صريح على هذا النحو في [قائمة واجهات برمجة التطبيقات المهملة](/ar/nodejs/api/deprecations#list-of-deprecated-apis).

سيؤدي إهمال التطبيق للرمز غير `node_modules` فقط، بشكل افتراضي، إلى إنشاء تحذير عملية سيتم طباعته على `stderr` في المرة الأولى التي يتم فيها استخدام واجهة برمجة التطبيقات المهملة في التعليمات البرمجية التي لم يتم تحميلها من `node_modules`. عند استخدام علامة سطر الأوامر [`--throw-deprecation`](/ar/nodejs/api/cli#--throw-deprecation)، سيتسبب إهمال وقت التشغيل في حدوث خطأ. عند استخدام [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation)، سيتم أيضًا إصدار تحذيرات للتعليمات البرمجية التي تم تحميلها من `node_modules`.

يشبه إهمال وقت التشغيل لجميع التعليمات البرمجية إهمال وقت التشغيل للتعليمات البرمجية غير `node_modules`، باستثناء أنه يصدر أيضًا تحذيرًا للتعليمات البرمجية التي تم تحميلها من `node_modules`.

يتم استخدام إهمال نهاية العمر عندما تتم إزالة الوظائف أو ستتم إزالتها قريبًا من Node.js.

## إبطال عمليات الإهمال {#revoking-deprecations}

في بعض الأحيان، قد يتم عكس إهمال واجهة برمجة تطبيقات. في مثل هذه الحالات، سيتم تحديث هذا المستند بمعلومات ذات صلة بالقرار. ومع ذلك، لن يتم تعديل معرف الإهمال.

## قائمة واجهات برمجة التطبيقات المهملة {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | نهاية العمر. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v1.6.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر

تمت إزالة `OutgoingMessage.prototype.flush()`. استخدم `OutgoingMessage.prototype.flushHeaders()` بدلاً من ذلك.


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | نهاية العمر الافتراضي. |
| v6.12.0 | تم تعيين رمز الإهمال. |
| v5.0.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

الوحدة النمطية `_linklist` مهملة. يرجى استخدام بديل مساحة المستخدم.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.11.15 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `_writableState.buffer`. استخدم `_writableState.getBuffer()` بدلاً من ذلك.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.4.0 | إهمال التوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة الخاصية `CryptoStream.prototype.readyState`.

### DEP0005: الدالة الإنشائية `Buffer()` {#dep0005-buffer-constructor}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | إهمال وقت التشغيل. |
| v6.12.0 | تم تعيين رمز الإهمال. |
| v6.0.0 | إهمال التوثيق فقط. |
:::

النوع: تطبيق (رمز غير موجود في `node_modules` فقط)

الدالة `Buffer()` والدالة الإنشائية `new Buffer()` مهملتان بسبب مشكلات قابلية استخدام واجهة برمجة التطبيقات (API) التي يمكن أن تؤدي إلى مشكلات أمنية غير مقصودة.

كبديل، استخدم إحدى الطرق التالية لإنشاء كائنات `Buffer`:

- [`Buffer.alloc(size[, fill[, encoding]])`](/ar/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): أنشئ `Buffer` بذاكرة *مهيأة*.
- [`Buffer.allocUnsafe(size)`](/ar/nodejs/api/buffer#static-method-bufferallocunsafesize): أنشئ `Buffer` بذاكرة *غير مهيأة*.
- [`Buffer.allocUnsafeSlow(size)`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): أنشئ `Buffer` بذاكرة *غير مهيأة*.
- [`Buffer.from(array)`](/ar/nodejs/api/buffer#static-method-bufferfromarray): أنشئ `Buffer` بنسخة من `array`
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ar/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - أنشئ `Buffer` يلتف حول `arrayBuffer` المحدد.
- [`Buffer.from(buffer)`](/ar/nodejs/api/buffer#static-method-bufferfrombuffer): أنشئ `Buffer` ينسخ `buffer`.
- [`Buffer.from(string[, encoding])`](/ar/nodejs/api/buffer#static-method-bufferfromstring-encoding): أنشئ `Buffer` ينسخ `string`.

بدون `--pending-deprecation`، تحدث تحذيرات وقت التشغيل فقط للتعليمات البرمجية غير الموجودة في `node_modules`. هذا يعني أنه لن تكون هناك تحذيرات إهمال لاستخدام `Buffer()` في التبعيات. باستخدام `--pending-deprecation`، ينتج عن ذلك تحذير وقت التشغيل بغض النظر عن مكان حدوث استخدام `Buffer()`.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهلاك. |
| v0.11.14 | إهلاك وقت التشغيل. |
| v0.5.10 | إهلاك للتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

ضمن طرق `spawn()` و `fork()` و `exec()` الخاصة بوحدة [`child_process`](/ar/nodejs/api/child_process)، تم إهلاك الخيار `options.customFds`. يجب استخدام الخيار `options.stdio` بدلاً من ذلك.

### DEP0007: استبدال `cluster` `worker.suicide` بـ `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | نهاية العمر الافتراضي. |
| v7.0.0 | إهلاك وقت التشغيل. |
| v6.12.0 | تم تعيين رمز إهلاك. |
| v6.0.0 | إهلاك للتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

في إصدار سابق من Node.js `cluster`، تمت إضافة خاصية منطقية باسم `suicide` إلى كائن `Worker`. كان الغرض من هذه الخاصية هو تقديم إشارة إلى كيفية وسبب خروج مثيل `Worker`. في Node.js 6.0.0، تم إهلاك الخاصية القديمة واستبدالها بخاصية [`worker.exitedAfterDisconnect`](/ar/nodejs/api/cluster#workerexitedafterdisconnect) جديدة. لم يصف اسم الخاصية القديمة بدقة الدلالات الفعلية وكان محملًا بالعواطف بشكل غير ضروري.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0 | تم تعيين رمز إهلاك. |
| v6.3.0 | إهلاك للتوثيق فقط. |
:::

النوع: للتوثيق فقط

تم إهلاك الوحدة النمطية `node:constants`. عند الحاجة إلى الوصول إلى الثوابت المتعلقة بوحدات Node.js المضمنة، يجب على المطورين بدلاً من ذلك الرجوع إلى الخاصية `constants` التي تعرضها الوحدة النمطية ذات الصلة. على سبيل المثال، `require('node:fs').constants` و `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` بدون تجزئة {#dep0009-cryptopbkdf2-without-digest}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | نهاية العمر الافتراضي (لـ `digest === null`). |
| v11.0.0 | إهلاك وقت التشغيل (لـ `digest === null`). |
| v8.0.0 | نهاية العمر الافتراضي (لـ `digest === undefined`). |
| v6.12.0 | تم تعيين رمز إهلاك. |
| v6.0.0 | إهلاك وقت التشغيل (لـ `digest === undefined`). |
:::

النوع: نهاية العمر الافتراضي

تم إهلاك استخدام واجهة برمجة التطبيقات [`crypto.pbkdf2()`](/ar/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) بدون تحديد تجزئة في Node.js 6.0 لأن الطريقة كانت تعود افتراضيًا إلى استخدام التجزئة `'SHA1'` غير الموصى بها. في السابق، تم طباعة تحذير إهلاك. بدءًا من Node.js 8.0.0، ستؤدي استدعاء `crypto.pbkdf2()` أو `crypto.pbkdf2Sync()` مع تعيين `digest` إلى `undefined` إلى طرح `TypeError`.

بدءًا من Node.js v11.0.0، سيؤدي استدعاء هذه الدوال مع تعيين `digest` إلى `null` إلى طباعة تحذير إهلاك للتوافق مع السلوك عندما تكون `digest` هي `undefined`.

الآن، مع ذلك، سيؤدي تمرير `undefined` أو `null` إلى طرح `TypeError`.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.11.13 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة واجهة برمجة التطبيقات `crypto.createCredentials()`. يرجى استخدام [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) بدلاً من ذلك.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.11.13 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة الفئة `crypto.Credentials`. يرجى استخدام [`tls.SecureContext`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) بدلاً من ذلك.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.11.7 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `Domain.dispose()`. استرجع من إجراءات الإدخال/الإخراج الفاشلة بشكل صريح عبر معالجات أحداث الخطأ المعينة على المجال بدلاً من ذلك.

### DEP0013: وظيفة `fs` غير متزامنة بدون رد نداء {#dep0013-fs-asynchronous-function-without-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v7.0.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

يؤدي استدعاء وظيفة غير متزامنة بدون رد نداء إلى طرح `TypeError` في Node.js 10.0.0 وما بعده. انظر [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: واجهة `String` القديمة لـ `fs.read` {#dep0014-fsread-legacy-string-interface}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | نهاية العمر الافتراضي. |
| v6.0.0 | إهمال وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.1.96 | إهمال خاص بالتوثيق. |
:::

النوع: نهاية العمر الافتراضي

واجهة `String` القديمة [`fs.read()`](/ar/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) مهملة. استخدم واجهة برمجة التطبيقات `Buffer` كما هو مذكور في الوثائق بدلاً من ذلك.

### DEP0015: واجهة `String` القديمة لـ `fs.readSync` {#dep0015-fsreadsync-legacy-string-interface}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | نهاية العمر الافتراضي. |
| v6.0.0 | إهمال وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز الإهمال. |
| v0.1.96 | إهمال خاص بالتوثيق. |
:::

النوع: نهاية العمر الافتراضي

واجهة `String` القديمة [`fs.readSync()`](/ar/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) مهملة. استخدم واجهة برمجة التطبيقات `Buffer` كما هو مذكور في الوثائق بدلاً من ذلك.


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.0.0 | نهاية العمر الافتراضي. |
| v6.12.0 | تم تعيين رمز إيقاف الاستخدام. |
| v6.0.0 | إيقاف الاستخدام في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إيقاف الأسماء المستعارة `GLOBAL` و `root` للخاصية `global` في Node.js 6.0.0 وتمت إزالتها منذ ذلك الحين.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.0.0 | نهاية العمر الافتراضي. |
| v7.0.0 | إيقاف الاستخدام في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

كان `Intl.v8BreakIterator` امتدادًا غير قياسي وتمت إزالته. راجع [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018: رفض الوعد غير المعالج {#dep0018-unhandled-promise-rejections}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.0.0 | نهاية العمر الافتراضي. |
| v7.0.0 | إيقاف الاستخدام في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إيقاف حالات رفض الوعد غير المعالجة. بشكل افتراضي، تؤدي حالات رفض الوعد التي لم تتم معالجتها إلى إنهاء عملية Node.js برمز خروج غير صفري. لتغيير الطريقة التي تتعامل بها Node.js مع حالات الرفض غير المعالجة، استخدم خيار سطر الأوامر [`--unhandled-rejections`](/ar/nodejs/api/cli#--unhandled-rejectionsmode).

### DEP0019: `require('.')` تم حله خارج الدليل {#dep0019-require-resolved-outside-directory}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v12.0.0 | تمت إزالة الوظيفة. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف الاستخدام. |
| v1.8.1 | إيقاف الاستخدام في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

في بعض الحالات، يمكن أن يحل `require('.')` خارج دليل الحزمة. تمت إزالة هذا السلوك.

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v15.0.0 | تمت إزالة Server.connections. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف الاستخدام. |
| v0.9.7 | إيقاف الاستخدام في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إيقاف الخاصية `Server.connections` في Node.js v0.9.7 وتمت إزالتها. يرجى استخدام الطريقة [`Server.getConnections()`](/ar/nodejs/api/net#servergetconnectionscallback) بدلاً من ذلك.

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف الاستخدام. |
| v0.7.12 | إيقاف الاستخدام في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إيقاف الطريقة `Server.listenFD()` وإزالتها. يرجى استخدام [`Server.listen({fd: \<number\>})`](/ar/nodejs/api/net#serverlistenhandle-backlog-callback) بدلاً من ذلك.


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | نهاية العمر الافتراضي. |
| v7.0.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إهمال واجهة برمجة التطبيقات `os.tmpDir()` في Node.js 7.0.0 وتمت إزالتها منذ ذلك الحين. يرجى استخدام [`os.tmpdir()`](/ar/nodejs/api/os#ostmpdir) بدلاً من ذلك.

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.6.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إهمال طريقة `os.getNetworkInterfaces()`. يرجى استخدام طريقة [`os.networkInterfaces()`](/ar/nodejs/api/os#osnetworkinterfaces) بدلاً من ذلك.

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | نهاية العمر الافتراضي. |
| v7.0.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة واجهة برمجة التطبيقات `REPLServer.prototype.convertToContext()`.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v1.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

الوحدة النمطية `node:sys` مهملة. يرجى استخدام الوحدة النمطية [`util`](/ar/nodejs/api/util) بدلاً من ذلك.

### DEP0026: `util.print()` {#dep0026-utilprint}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.11.3 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `util.print()`. يرجى استخدام [`console.log()`](/ar/nodejs/api/console#consolelogdata-args) بدلاً من ذلك.

### DEP0027: `util.puts()` {#dep0027-utilputs}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.11.3 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `util.puts()`. يرجى استخدام [`console.log()`](/ar/nodejs/api/console#consolelogdata-args) بدلاً من ذلك.

### DEP0028: `util.debug()` {#dep0028-utildebug}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.11.3 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `util.debug()`. يرجى استخدام [`console.error()`](/ar/nodejs/api/console#consoleerrordata-args) بدلاً من ذلك.


### DEP0029: `util.error()` {#dep0029-utilerror}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.11.3 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `util.error()`. يرجى استخدام [`console.error()`](/ar/nodejs/api/console#consoleerrordata-args) بدلاً من ذلك.

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0 | تم تعيين رمز إهمال. |
| v6.0.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تم إهمال الصنف [`SlowBuffer`](/ar/nodejs/api/buffer#class-slowbuffer). يرجى استخدام [`Buffer.allocUnsafeSlow(size)`](/ar/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) بدلاً من ذلك.

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0 | تم تعيين رمز إهمال. |
| v5.2.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تم الآن إهمال الطريقة [`ecdh.setPublicKey()`](/ar/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) لأن تضمينها في واجهة برمجة التطبيقات غير مفيد.

### DEP0032: وحدة `node:domain` {#dep0032-nodedomain-module}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v1.4.2 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تم إهمال الوحدة [`domain`](/ar/nodejs/api/domain) ولا ينبغي استخدامها.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v3.2.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تم إهمال واجهة برمجة التطبيقات [`events.listenerCount(emitter, eventName)`](/ar/nodejs/api/events#eventslistenercountemitter-eventname). يرجى استخدام [`emitter.listenerCount(eventName)`](/ar/nodejs/api/events#emitterlistenercounteventname-listener) بدلاً من ذلك.

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v1.0.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تم إهمال واجهة برمجة التطبيقات [`fs.exists(path, callback)`](/ar/nodejs/api/fs#fsexistspath-callback). يرجى استخدام [`fs.stat()`](/ar/nodejs/api/fs#fsstatpath-options-callback) أو [`fs.access()`](/ar/nodejs/api/fs#fsaccesspath-mode-callback) بدلاً من ذلك.


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.4.7 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

واجهة برمجة التطبيقات [`fs.lchmod(path, mode, callback)`](/ar/nodejs/api/fs#fslchmodpath-mode-callback) مهملة.

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.4.7 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

واجهة برمجة التطبيقات [`fs.lchmodSync(path, mode)`](/ar/nodejs/api/fs#fslchmodsyncpath-mode) مهملة.

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.6.0 | تم إلغاء الإهمال. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.4.7 | إهمال خاص بالتوثيق فقط. |
:::

النوع: تم إلغاء الإهمال

واجهة برمجة التطبيقات [`fs.lchown(path, uid, gid, callback)`](/ar/nodejs/api/fs#fslchownpath-uid-gid-callback) كانت مهملة. تم إلغاء الإهمال بسبب إضافة واجهات برمجة التطبيقات الداعمة المطلوبة في libuv.

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v10.6.0 | تم إلغاء الإهمال. |
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.4.7 | إهمال خاص بالتوثيق فقط. |
:::

النوع: تم إلغاء الإهمال

واجهة برمجة التطبيقات [`fs.lchownSync(path, uid, gid)`](/ar/nodejs/api/fs#fslchownsyncpath-uid-gid) كانت مهملة. تم إلغاء الإهمال بسبب إضافة واجهات برمجة التطبيقات الداعمة المطلوبة في libuv.

### DEP0039: `require.extensions` {#dep0039-requireextensions}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v6.12.0, v4.8.6 | تم تعيين رمز إهمال. |
| v0.10.6 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

الخاصية [`require.extensions`](/ar/nodejs/api/modules#requireextensions) مهملة.

### DEP0040: وحدة `node:punycode` {#dep0040-nodepunycode-module}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v21.0.0 | إهمال في وقت التشغيل. |
| v16.6.0 | تمت إضافة دعم لـ `--pending-deprecation`. |
| v7.0.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

وحدة [`punycode`](/ar/nodejs/api/punycode) مهملة. يرجى استخدام بديل من فضاء المستخدم بدلاً من ذلك.


### DEP0041: متغير البيئة `NODE_REPL_HISTORY_FILE` {#dep0041-node_repl_history_file-environment-variable}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تخصيص رمز إيقاف. |
| v3.0.0 | إيقاف على مستوى التوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة متغير البيئة `NODE_REPL_HISTORY_FILE`. الرجاء استخدام `NODE_REPL_HISTORY` بدلاً من ذلك.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v6.12.0, v4.8.6 | تم تخصيص رمز إيقاف. |
| v0.11.3 | إيقاف على مستوى التوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة الفئة [`tls.CryptoStream`](/ar/nodejs/api/tls#class-tlscryptostream). الرجاء استخدام [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) بدلاً من ذلك.

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | إيقاف وقت التشغيل. |
| v6.12.0 | تم تخصيص رمز إيقاف. |
| v6.0.0 | إيقاف على مستوى التوثيق فقط. |
| v0.11.15 | تم إبطال الإيقاف. |
| v0.11.3 | إيقاف وقت التشغيل. |
:::

النوع: على مستوى التوثيق فقط

تم إيقاف الفئة [`tls.SecurePair`](/ar/nodejs/api/tls#class-tlssecurepair). الرجاء استخدام [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) بدلاً من ذلك.

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تخصيص رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف على مستوى التوثيق فقط. |
:::

النوع: وقت التشغيل

تم إيقاف واجهة برمجة التطبيقات [`util.isArray()`](/ar/nodejs/api/util#utilisarrayobject). الرجاء استخدام `Array.isArray()` بدلاً من ذلك.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهاية العمر الافتراضي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تخصيص رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف على مستوى التوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة واجهة برمجة التطبيقات `util.isBoolean()`. الرجاء استخدام `typeof arg === 'boolean'` بدلاً من ذلك.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهاية العمر الافتراضي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تخصيص رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف على مستوى التوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة واجهة برمجة التطبيقات `util.isBuffer()`. الرجاء استخدام [`Buffer.isBuffer()`](/ar/nodejs/api/buffer#static-method-bufferisbufferobj) بدلاً من ذلك.


### DEP0047: `util.isDate()` {#dep0047-utilisdate}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| v4.0.0, v3.3.1 | إيقاف التوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isDate()`. يرجى استخدام `arg instanceof Date` بدلاً من ذلك.

### DEP0048: `util.isError()` {#dep0048-utiliserror}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| v4.0.0, v3.3.1 | إيقاف التوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isError()`. يرجى استخدام `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error` بدلاً من ذلك.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| v4.0.0, v3.3.1 | إيقاف التوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isFunction()`. يرجى استخدام `typeof arg === 'function'` بدلاً من ذلك.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| v4.0.0, v3.3.1 | إيقاف التوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isNull()`. يرجى استخدام `arg === null` بدلاً من ذلك.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| v4.0.0, v3.3.1 | إيقاف التوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isNullOrUndefined()`. يرجى استخدام `arg === null || arg === undefined` بدلاً من ذلك.


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف خاص بالتوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isNumber()`. يرجى استخدام `typeof arg === 'number'` بدلاً من ذلك.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف خاص بالتوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isObject()`. يرجى استخدام `arg && typeof arg === 'object'` بدلاً من ذلك.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف خاص بالتوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isPrimitive()`. يرجى استخدام `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` بدلاً من ذلك.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف خاص بالتوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isRegExp()`. يرجى استخدام `arg instanceof RegExp` بدلاً من ذلك.

### DEP0056: `util.isString()` {#dep0056-utilisstring}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إيقاف نهائي. |
| v22.0.0 | إيقاف وقت التشغيل. |
| v6.12.0, v4.8.6 | تم تعيين رمز إيقاف. |
| v4.0.0, v3.3.1 | إيقاف خاص بالتوثيق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isString()`. يرجى استخدام `typeof arg === 'string'` بدلاً من ذلك.


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 23.0.0 | إيقاف نهائي. |
| الإصدار 22.0.0 | إيقاف وقت التشغيل. |
| الإصدار 6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| الإصدار 4.0.0, v3.3.1 | إيقاف خاص بالوثائق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isSymbol()`. يرجى استخدام `typeof arg === 'symbol'` بدلاً من ذلك.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 23.0.0 | إيقاف نهائي. |
| الإصدار 22.0.0 | إيقاف وقت التشغيل. |
| الإصدار 6.12.0, v4.8.6 | تم تعيين رمز للإيقاف. |
| الإصدار 4.0.0, v3.3.1 | إيقاف خاص بالوثائق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.isUndefined()`. يرجى استخدام `arg === undefined` بدلاً من ذلك.

### DEP0059: `util.log()` {#dep0059-utillog}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 23.0.0 | إيقاف نهائي. |
| الإصدار 22.0.0 | إيقاف وقت التشغيل. |
| الإصدار 6.12.0 | تم تعيين رمز للإيقاف. |
| الإصدار 6.0.0 | إيقاف خاص بالوثائق فقط. |
:::

النوع: إيقاف نهائي

تمت إزالة واجهة برمجة التطبيقات `util.log()` لأنها واجهة برمجة تطبيقات قديمة غير خاضعة للصيانة تم الكشف عنها عن طريق الخطأ لمساحة المستخدم. بدلاً من ذلك، ضع في اعتبارك البدائل التالية بناءً على احتياجاتك الخاصة:

- **مكتبات التسجيل التابعة لجهات خارجية**
- **استخدم <code>console.log(new Date().toLocaleString(), message)</code>**

من خلال تبني أحد هذه البدائل، يمكنك الانتقال بعيدًا عن `util.log()` واختيار إستراتيجية تسجيل تتماشى مع المتطلبات المحددة وتعقيد تطبيقك.

### DEP0060: `util._extend()` {#dep0060-util_extend}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 22.0.0 | إيقاف وقت التشغيل. |
| الإصدار 6.12.0 | تم تعيين رمز للإيقاف. |
| الإصدار 6.0.0 | إيقاف خاص بالوثائق فقط. |
:::

النوع: وقت التشغيل

تم إيقاف واجهة برمجة التطبيقات [`util._extend()`](/ar/nodejs/api/util#util_extendtarget-source) لأنها واجهة برمجة تطبيقات قديمة غير خاضعة للصيانة تم الكشف عنها عن طريق الخطأ لمساحة المستخدم. يرجى استخدام `target = Object.assign(target, source)` بدلاً من ذلك.


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | نهاية العمر الافتراضي. |
| v8.0.0 | إهلاك وقت التشغيل. |
| v7.0.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

لم يكن الهدف من الفئة `fs.SyncWriteStream` أن تكون واجهة برمجة تطبيقات متاحة للعامة وتمت إزالتها. لا توجد واجهة برمجة تطبيقات بديلة متاحة. يرجى استخدام بديل userland.

### DEP0062: `node --debug` {#dep0062-node---debug}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v8.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

يقوم `--debug` بتنشيط واجهة مصحح أخطاء V8 القديمة، والتي تمت إزالتها اعتبارًا من V8 5.8. تم استبداله بـ Inspector الذي يتم تنشيطه باستخدام `--inspect` بدلاً من ذلك.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

واجهة برمجة التطبيقات `ServerResponse.prototype.writeHeader()` الخاصة بوحدة `node:http` مهملة. يرجى استخدام `ServerResponse.prototype.writeHead()` بدلاً من ذلك.

لم يتم توثيق الطريقة `ServerResponse.prototype.writeHeader()` مطلقًا على أنها واجهة برمجة تطبيقات مدعومة رسميًا.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | إهلاك وقت التشغيل. |
| v6.12.0 | تم تعيين رمز إهلاك. |
| v6.0.0 | إهلاك خاص بالتوثيق فقط. |
| v0.11.15 | تم إلغاء الإهلاك. |
| v0.11.3 | إهلاك وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إهمال واجهة برمجة التطبيقات `tls.createSecurePair()` في التوثيق في Node.js 0.11.3. يجب على المستخدمين استخدام `tls.Socket` بدلاً من ذلك.

### DEP0065: `repl.REPL_MODE_MAGIC` و `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v8.0.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة الثابت `REPL_MODE_MAGIC` الخاص بوحدة `node:repl`، والمستخدم لخيار `replMode`. كان سلوكه مطابقًا وظيفيًا لسلوك `REPL_MODE_SLOPPY` منذ Node.js 6.0.0، عندما تم استيراد V8 5.0. يرجى استخدام `REPL_MODE_SLOPPY` بدلاً من ذلك.

يتم استخدام متغير البيئة `NODE_REPL_MODE` لتعيين `replMode` الأساسي لجلسة `node` تفاعلية. تمت إزالة قيمته، `magic`، أيضًا. يرجى استخدام `sloppy` بدلاً من ذلك.


### DEP0066: ‏`OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v12.0.0 | إهلاك في وقت التشغيل. |
| الإصدار v8.0.0 | إهلاك في الوثائق فقط. |
:::

النوع: وقت التشغيل

تم إهلاك الخصائص `OutgoingMessage.prototype._headers` و `OutgoingMessage.prototype._headerNames` الخاصة بوحدة `node:http`. استخدم إحدى الطرق العامة (مثل `OutgoingMessage.prototype.getHeader()` أو `OutgoingMessage.prototype.getHeaders()` أو `OutgoingMessage.prototype.getHeaderNames()` أو `OutgoingMessage.prototype.getRawHeaderNames()` أو `OutgoingMessage.prototype.hasHeader()` أو `OutgoingMessage.prototype.removeHeader()` أو `OutgoingMessage.prototype.setHeader()`) للعمل مع الرؤوس الصادرة.

لم يتم توثيق الخصائص `OutgoingMessage.prototype._headers` و `OutgoingMessage.prototype._headerNames` أبدًا على أنها خصائص مدعومة رسميًا.

### DEP0067: ‏`OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v8.0.0 | إهلاك في الوثائق فقط. |
:::

النوع: الوثائق فقط

تم إهلاك واجهة برمجة التطبيقات `OutgoingMessage.prototype._renderHeaders()` الخاصة بوحدة `node:http`.

لم يتم توثيق الخاصية `OutgoingMessage.prototype._renderHeaders` أبدًا على أنها واجهة برمجة تطبيقات مدعومة رسميًا.

### DEP0068: ‏`node debug` {#dep0068-node-debug}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v15.0.0 | تمت إزالة الأمر القديم `node debug`. |
| الإصدار v8.0.0 | إهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر

يتوافق الأمر `node debug` مع مصحح الأخطاء CLI القديم الذي تم استبداله بمصحح أخطاء CLI يستند إلى V8-inspector ومتاح من خلال `node inspect`.

### DEP0069: ‏`vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v10.0.0 | نهاية العمر. |
| الإصدار v9.0.0 | إهلاك في وقت التشغيل. |
| الإصدار v8.0.0 | إهلاك في الوثائق فقط. |
:::

النوع: نهاية العمر

تمت إزالة DebugContext في V8 وهي غير متاحة في Node.js 10+.

DebugContext كانت واجهة برمجة تطبيقات تجريبية.

### DEP0070: ‏`async_hooks.currentId()` {#dep0070-async_hookscurrentid}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v9.0.0 | نهاية العمر. |
| الإصدار v8.2.0 | إهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر

تمت إعادة تسمية `async_hooks.currentId()` إلى `async_hooks.executionAsyncId()` للتوضيح.

تم إجراء هذا التغيير أثناء كون `async_hooks` واجهة برمجة تطبيقات تجريبية.


### DEP0071: ‏`async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 9.0.0 | نهاية العمر الافتراضي. |
| الإصدار 8.2.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إعادة تسمية `async_hooks.triggerId()` إلى `async_hooks.triggerAsyncId()` للتوضيح.

تم إجراء هذا التغيير عندما كانت `async_hooks` واجهة برمجة تطبيقات تجريبية.

### DEP0072: ‏`async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 9.0.0 | نهاية العمر الافتراضي. |
| الإصدار 8.2.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إعادة تسمية `async_hooks.AsyncResource.triggerId()` إلى `async_hooks.AsyncResource.triggerAsyncId()` للتوضيح.

تم إجراء هذا التغيير عندما كانت `async_hooks` واجهة برمجة تطبيقات تجريبية.

### DEP0073: العديد من الخصائص الداخلية لـ `net.Server` {#dep0073-several-internal-properties-of-netserver}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 10.0.0 | نهاية العمر الافتراضي. |
| الإصدار 9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

يُعتبر الوصول إلى العديد من الخصائص الداخلية وغير الموثقة لمثيلات `net.Server` بأسماء غير مناسبة مهملاً.

نظرًا لأن واجهة برمجة التطبيقات الأصلية غير موثقة وغير مفيدة بشكل عام للتعليمات البرمجية غير الداخلية، فلا يتم توفير واجهة برمجة تطبيقات بديلة.

### DEP0074: ‏`REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | نهاية العمر الافتراضي. |
| الإصدار 9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم إهمال الخاصية `REPLServer.bufferedCommand` لصالح [`REPLServer.clearBufferedCommand()`](/ar/nodejs/api/repl#replserverclearbufferedcommand).

### DEP0075: ‏`REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | نهاية العمر الافتراضي. |
| الإصدار 9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `REPLServer.parseREPLKeyword()` من رؤية المستخدم.

### DEP0076: ‏`tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | نهاية العمر الافتراضي. |
| الإصدار 9.0.0 | الإهلاك في وقت التشغيل. |
| الإصدار 8.6.0 | الإهلاك خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

كانت `tls.parseCertString()` أداة مساعدة تحليل بسيطة تم نشرها عن طريق الخطأ. على الرغم من أنها كان من المفترض أن تقوم بتحليل موضوع الشهادة وسلاسل المصدر، إلا أنها لم تتعامل أبدًا مع الأسماء المميزة النسبية متعددة القيم بشكل صحيح.

اقترحت الإصدارات السابقة من هذا المستند استخدام `querystring.parse()` كبديل لـ `tls.parseCertString()`. ومع ذلك، فإن `querystring.parse()` لا تتعامل أيضًا مع جميع مواضيع الشهادات بشكل صحيح ولا ينبغي استخدامها.


### DEP0077: ‏`Module._debug()` {#dep0077-module_debug}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: وقت التشغيل

‏`Module._debug()` مُهمل.

لم يتم توثيق الدالة ‏`Module._debug()` مطلقًا كواجهة برمجة تطبيقات مدعومة رسميًا.

### DEP0078: ‏`REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | نهاية العمر الافتراضي. |
| v9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة ‏`REPLServer.turnOffEditorMode()` من رؤية مساحة المستخدم.

### DEP0079: دالة فحص مخصصة على الكائنات عبر ‏`.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | نهاية العمر الافتراضي. |
| v10.0.0 | الإهلاك في وقت التشغيل. |
| v8.7.0 | الإهلاك خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

يُعد استخدام خاصية باسم `inspect` على كائن لتحديد دالة فحص مخصصة لـ [`util.inspect()`](/ar/nodejs/api/util#utilinspectobject-options) مُهملًا. استخدم [`util.inspect.custom`](/ar/nodejs/api/util#utilinspectcustom) بدلاً من ذلك. لتحقيق التوافق مع الإصدارات السابقة من Node.js قبل الإصدار 6.4.0، يمكن تحديد كليهما.

### DEP0080: ‏`path._makeLong()` {#dep0080-path_makelong}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | الإهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

لم يكن الغرض من `path._makeLong()` الداخلي الاستخدام العام. ومع ذلك، وجدت وحدات مساحة المستخدم أنها مفيدة. واجهة برمجة التطبيقات الداخلية مُهملة وتم استبدالها بطريقة `path.toNamespacedPath()` عامة متطابقة.

### DEP0081: ‏`fs.truncate()` باستخدام واصف ملف {#dep0081-fstruncate-using-a-file-descriptor}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: وقت التشغيل

يُعد استخدام `fs.truncate()` ‏`fs.truncateSync()` مع واصف ملف مُهملًا. يرجى استخدام `fs.ftruncate()` أو `fs.ftruncateSync()` للعمل مع واصفات الملفات.

### DEP0082: ‏`REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | نهاية العمر الافتراضي. |
| v9.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

‏`REPLServer.prototype.memory()` ضروري فقط للميكانيكا الداخلية لـ ‏`REPLServer` نفسها. لا تستخدم هذه الدالة.


### DEP0083: تعطيل ECDH عن طريق ضبط `ecdhCurve` على `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v9.2.0 | إيقاف التشغيل المؤقت. |
:::

النوع: نهاية العمر الافتراضي.

يمكن تعيين الخيار `ecdhCurve` لـ `tls.createSecureContext()` و `tls.TLSSocket` على `false` لتعطيل ECDH تمامًا على الخادم فقط. تم إيقاف هذا الوضع مؤقتًا استعدادًا للهجرة إلى OpenSSL 1.1.0 والاتساق مع العميل وهو الآن غير مدعوم. استخدم المعامل `ciphers` بدلاً من ذلك.

### DEP0084: طلب الاعتماديات الداخلية المجمعة {#dep0084-requiring-bundled-internal-dependencies}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | تمت إزالة هذه الوظيفة. |
| v10.0.0 | إيقاف التشغيل المؤقت. |
:::

النوع: نهاية العمر الافتراضي

منذ إصدارات Node.js 4.4.0 و 5.2.0، تم عن طريق الخطأ عرض العديد من الوحدات النمطية المخصصة للاستخدام الداخلي فقط لكود المستخدم من خلال `require()`. كانت هذه الوحدات النمطية:

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (من 7.6.0)
- `node-inspect/lib/internal/inspect_client` (من 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (من 7.6.0)

لا تحتوي وحدات `v8/*` على أي صادرات، وإذا لم يتم استيرادها بترتيب معين، فستؤدي في الواقع إلى ظهور أخطاء. على هذا النحو، لا توجد عمليًا حالات استخدام مشروعة لاستيرادها من خلال `require()`.

من ناحية أخرى، يمكن تثبيت `node-inspect` محليًا من خلال مدير الحزم، حيث يتم نشره في سجل npm تحت نفس الاسم. لا يلزم تعديل التعليمات البرمجية المصدر إذا تم ذلك.

### DEP0085: واجهة برمجة تطبيقات AsyncHooks الحساسة {#dep0085-asynchooks-sensitive-api}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
| v9.4.0, v8.10.0 | إيقاف التشغيل المؤقت. |
:::

النوع: نهاية العمر الافتراضي

لم يتم توثيق واجهة برمجة تطبيقات AsyncHooks الحساسة أبدًا وكانت بها العديد من المشكلات الطفيفة. استخدم واجهة برمجة تطبيقات `AsyncResource` بدلاً من ذلك. راجع [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).


### DEP0086: إزالة `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v10.0.0 | نهاية العمر. |
| الإصداران v9.4.0 و v8.10.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر

`runInAsyncIdScope` لا يطلق الحدثين `'before'` أو `'after'`، وبالتالي يمكن أن يسبب الكثير من المشاكل. راجع [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v12.8.0 | تم إلغاء الإهلاك. |
| الإصداران v9.9.0 و v8.13.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: تم إلغاء الإهلاك

لم يكن استيراد assert مباشرةً موصى به لأن الدوال المعروضة تستخدم فحوصات المساواة المتراخية. تم إلغاء الإهلاك لأن استخدام الوحدة `node:assert` ليس مثبطًا، وتسبب الإهلاك في ارتباك المطورين.

### DEP0090: أطوال علامة مصادقة GCM غير صالحة {#dep0090-invalid-gcm-authentication-tag-lengths}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v11.0.0 | نهاية العمر. |
| الإصدار v10.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر

اعتادت Node.js على دعم جميع أطوال علامة مصادقة GCM التي تقبلها OpenSSL عند استدعاء [`decipher.setAuthTag()`](/ar/nodejs/api/crypto#deciphersetauthtagbuffer-encoding). بدءًا من Node.js v11.0.0، يُسمح فقط بأطوال علامة المصادقة التي تبلغ 128 و 120 و 112 و 104 و 96 و 64 و 32 بت. علامات المصادقة ذات الأطوال الأخرى غير صالحة وفقًا لـ [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v20.0.0 | نهاية العمر. |
| الإصدار v10.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر

كانت الخاصية `crypto.DEFAULT_ENCODING` موجودة فقط للتوافق مع إصدارات Node.js السابقة للإصدارات 0.9.3 وقد تمت إزالتها.

### DEP0092: `this` ذات المستوى الأعلى مرتبطة بـ `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v10.0.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

يتم إهلاك تعيين الخصائص إلى `this` ذات المستوى الأعلى كبديل لـ `module.exports`. يجب على المطورين استخدام `exports` أو `module.exports` بدلاً من ذلك.


### DEP0093: تم إهمال `crypto.fips` واستبداله {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v23.0.0 | إهمال وقت التشغيل. |
| الإصدار v10.0.0 | إهمال للتوثيق فقط. |
:::

النوع: وقت التشغيل

تم إهمال الخاصية [`crypto.fips`](/ar/nodejs/api/crypto#cryptofips). يرجى استخدام `crypto.setFips()` و `crypto.getFips()` بدلاً من ذلك.

### DEP0094: استخدام `assert.fail()` مع أكثر من وسيطة واحدة {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v10.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إهمال استخدام `assert.fail()` مع أكثر من وسيطة واحدة. استخدم `assert.fail()` مع وسيطة واحدة فقط أو استخدم طريقة مختلفة من وحدة `node:assert`.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v10.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إهمال `timers.enroll()`. يرجى استخدام [`setTimeout()`](/ar/nodejs/api/timers#settimeoutcallback-delay-args) أو [`setInterval()`](/ar/nodejs/api/timers#setintervalcallback-delay-args) الموثقة علنًا بدلاً من ذلك.

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v10.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إهمال `timers.unenroll()`. يرجى استخدام [`clearTimeout()`](/ar/nodejs/api/timers#cleartimeouttimeout) أو [`clearInterval()`](/ar/nodejs/api/timers#clearintervaltimeout) الموثقة علنًا بدلاً من ذلك.

### DEP0097: `MakeCallback` مع الخاصية `domain` {#dep0097-makecallback-with-domain-property}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v10.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

يجب على مستخدمي `MakeCallback` الذين يضيفون الخاصية `domain` لحمل السياق، البدء في استخدام متغير `async_context` من `MakeCallback` أو `CallbackScope`، أو الفئة عالية المستوى `AsyncResource`.

### DEP0098: واجهات برمجة التطبيقات AsyncHooks embedder `AsyncResource.emitBefore` و `AsyncResource.emitAfter` {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v12.0.0 | نهاية العمر الافتراضي. |
| الإصدار v10.0.0, v9.6.0, v8.12.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تكشف واجهة برمجة التطبيقات المضمنة التي توفرها AsyncHooks عن طرق `.emitBefore()` و `.emitAfter()` التي يسهل جدًا استخدامها بشكل غير صحيح مما قد يؤدي إلى أخطاء لا يمكن استردادها.

استخدم واجهة برمجة التطبيقات [`asyncResource.runInAsyncScope()`](/ar/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) بدلاً من ذلك والتي توفر بديلاً أكثر أمانًا وأكثر ملاءمة. انظر [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).


### DEP0099: واجهات برمجة تطبيقات C++ `node::MakeCallback` غير الواعية بسياق غير متزامن {#dep0099-async-context-unaware-nodemakecallback-c-apis}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | الإهلاك في وقت التحويل البرمجي. |
:::

النوع: وقت التحويل البرمجي

بعض إصدارات واجهات برمجة تطبيقات `node::MakeCallback` المتاحة للإضافات الأصلية مهملة. يرجى استخدام إصدارات واجهة برمجة التطبيقات التي تقبل معامل `async_context`.

### DEP0100: `process.assert()` {#dep0100-processassert}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | نهاية العمر الافتراضي. |
| v10.0.0 | الإهلاك في وقت التشغيل. |
| v0.3.7 | الإهلاك في الوثائق فقط. |
:::

النوع: نهاية العمر الافتراضي

`process.assert()` مهملة. يرجى استخدام الوحدة النمطية [`assert`](/ar/nodejs/api/assert) بدلاً من ذلك.

لم تكن هذه ميزة موثقة على الإطلاق.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة خيار وقت التحويل البرمجي `--with-lttng`.

### DEP0102: استخدام `noAssert` في عمليات `Buffer#(read|write)` {#dep0102-using-noassert-in-bufferread|write-operations}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | نهاية العمر الافتراضي. |
:::

النوع: نهاية العمر الافتراضي

لم يعد لاستخدام وسيطة `noAssert` أي وظيفة. يتم التحقق من جميع المدخلات بغض النظر عن قيمة `noAssert`. يمكن أن يؤدي تخطي التحقق إلى حدوث أخطاء وأعطال يصعب العثور عليها.

### DEP0103: عمليات التحقق من النوع `process.binding('util').is[...]` {#dep0103-processbindingutilis-typechecks}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.9.0 | تم استبداله بـ [DEP0111](/ar/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | الإهلاك في الوثائق فقط. |
:::

النوع: الوثائق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

يجب تجنب استخدام `process.binding()` بشكل عام. يمكن استبدال طرق التحقق من النوع على وجه الخصوص باستخدام [`util.types`](/ar/nodejs/api/util#utiltypes).

تم استبدال هذا الإهلاك بإهلاك واجهة برمجة التطبيقات `process.binding()` ([DEP0111](/ar/nodejs/api/deprecations#DEP0111)).

### DEP0104: تحويل السلسلة `process.env` {#dep0104-processenv-string-coercion}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | الإهلاك في الوثائق فقط. |
:::

النوع: الوثائق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

عند تعيين خاصية غير سلسلة إلى [`process.env`](/ar/nodejs/api/process#processenv)، يتم تحويل القيمة المعينة ضمنيًا إلى سلسلة. هذا السلوك مهمل إذا لم تكن القيمة المعينة سلسلة أو منطقية أو رقم. في المستقبل، قد يؤدي هذا التعيين إلى حدوث خطأ يتم طرحه. يرجى تحويل الخاصية إلى سلسلة قبل تعيينها إلى `process.env`.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | نهاية العمر الافتراضي. |
| v10.0.0 | إيقاف مؤقت في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

لم يتم توثيق `decipher.finaltol()` مطلقًا وكان اسمًا مستعارًا لـ [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding). تمت إزالة واجهة برمجة التطبيقات هذه، ويوصى باستخدام [`decipher.final()`](/ar/nodejs/api/crypto#decipherfinaloutputencoding) بدلاً من ذلك.

### DEP0106: `crypto.createCipher` و `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | نهاية العمر الافتراضي. |
| v11.0.0 | إيقاف مؤقت في وقت التشغيل. |
| v10.0.0 | إيقاف مؤقت في الوثائق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة `crypto.createCipher()` و `crypto.createDecipher()` لأنهما يستخدمان وظيفة اشتقاق مفتاح ضعيفة (MD5 بدون ملح) ومتجهات تهيئة ثابتة. يوصى باشتقاق مفتاح باستخدام [`crypto.pbkdf2()`](/ar/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) أو [`crypto.scrypt()`](/ar/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) مع أملاح عشوائية واستخدام [`crypto.createCipheriv()`](/ar/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) و [`crypto.createDecipheriv()`](/ar/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) للحصول على كائنات [`Cipher`](/ar/nodejs/api/crypto#class-cipher) و [`Decipher`](/ar/nodejs/api/crypto#class-decipher) على التوالي.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | نهاية العمر الافتراضي. |
| v10.0.0 | إيقاف مؤقت في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

كانت هذه وظيفة مساعدة غير موثقة غير مخصصة للاستخدام خارج نواة Node.js وتم إبطالها بسبب إزالة دعم NPN (التفاوض على البروتوكول التالي).

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | نهاية العمر الافتراضي. |
| v11.0.0 | إيقاف مؤقت في وقت التشغيل. |
| v10.0.0 | إيقاف مؤقت في الوثائق فقط. |
:::

النوع: نهاية العمر الافتراضي

اسم مستعار مهمل لـ [`zlib.bytesWritten`](/ar/nodejs/api/zlib#zlibbyteswritten). تم اختيار هذا الاسم الأصلي لأنه كان من المنطقي أيضًا تفسير القيمة على أنها عدد البايتات التي قرأها المحرك، ولكنه غير متناسق مع التدفقات الأخرى في Node.js التي تعرض قيمًا تحت هذه الأسماء.


### DEP0109: دعم `http` و `https` و `tls` لعناوين URL غير صالحة {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | نهاية العمر الافتراضي. |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

تم قبول بعض عناوين URL المدعومة سابقًا (ولكنها غير صالحة تمامًا) من خلال واجهات برمجة التطبيقات [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback) و [`http.get()`](/ar/nodejs/api/http#httpgetoptions-callback) و [`https.request()`](/ar/nodejs/api/https#httpsrequestoptions-callback) و [`https.get()`](/ar/nodejs/api/https#httpsgetoptions-callback) و [`tls.checkServerIdentity()`](/ar/nodejs/api/tls#tlscheckserveridentityhostname-cert) لأنها كانت مقبولة من قبل واجهة برمجة التطبيقات القديمة `url.parse()`. تستخدم واجهات برمجة التطبيقات المذكورة الآن محلل عناوين URL الخاص بـ WHATWG الذي يتطلب عناوين URL صالحة تمامًا. تمرير عنوان URL غير صالح مهمل وسيتم إزالة الدعم في المستقبل.

### DEP0110: بيانات `vm.Script` المخزنة مؤقتًا {#dep0110-vmscript-cached-data}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.6.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تم إهمال خيار `produceCachedData`. استخدم [`script.createCachedData()`](/ar/nodejs/api/vm#scriptcreatecacheddata) بدلاً من ذلك.

### DEP0111: `process.binding()` {#dep0111-processbinding}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v11.12.0 | تمت إضافة دعم لـ`--pending-deprecation`. |
| v10.9.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

`process.binding()` مخصص للاستخدام بواسطة التعليمات البرمجية الداخلية لـ Node.js فقط.

في حين أن `process.binding()` لم يصل إلى حالة نهاية العمر الافتراضي بشكل عام، إلا أنه غير متوفر عند تمكين [نموذج الأذونات](/ar/nodejs/api/permissions#permission-model).

### DEP0112: واجهات برمجة التطبيقات الخاصة `dgram` {#dep0112-dgram-private-apis}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: وقت التشغيل

تحتوي وحدة `node:dgram` سابقًا على العديد من واجهات برمجة التطبيقات التي لم يكن من المفترض الوصول إليها خارج نواة Node.js: `Socket.prototype._handle` و `Socket.prototype._receiving` و `Socket.prototype._bindState` و `Socket.prototype._queue` و `Socket.prototype._reuseAddr` و `Socket.prototype._healthCheck()` و `Socket.prototype._stopReceiving()` و `dgram._createSocketHandle()`.


### DEP0113: ‏`Cipher.setAuthTag()`, ‏`Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

لم تعد ‏`Cipher.setAuthTag()`‎‏ و ‏`Decipher.getAuthTag()`‎‏ متاحتين. لم يتم توثيقهما مطلقًا وكانتا تلقيان خطأ عند استدعائهما.

### DEP0114: ‏`crypto._toBuf()` {#dep0114-crypto_tobuf}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر الافتراضي. |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

لم يتم تصميم الدالة ‏`crypto._toBuf()`‎‏ ليتم استخدامها بواسطة وحدات خارج نواة Node.js وتمت إزالتها.

### DEP0115: ‏`crypto.prng()`, ‏`crypto.pseudoRandomBytes()`, ‏`crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | تمت إضافة إهلاك للتوثيق فقط مع دعم ‏`--pending-deprecation`‎‏. |
:::

النوع: للتوثيق فقط (يدعم ‏[`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation)‎‏)

في الإصدارات الحديثة من Node.js، لا يوجد فرق بين ‏[`crypto.randomBytes()`](/ar/nodejs/api/crypto#cryptorandombytessize-callback)‎‏ و ‏`crypto.pseudoRandomBytes()`‎‏. تم إهلاك الأخير مع الأسماء المستعارة غير الموثقة ‏`crypto.prng()`‎‏ و ‏`crypto.rng()`‎‏ لصالح ‏[`crypto.randomBytes()`](/ar/nodejs/api/crypto#cryptorandombytessize-callback)‎‏ وقد تتم إزالته في إصدار مستقبلي.

### DEP0116: واجهة برمجة تطبيقات URL القديمة {#dep0116-legacy-url-api}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0, v18.13.0 | ‏`url.parse()`‎‏ مهملة مرة أخرى في DEP0169. |
| v15.13.0, v14.17.0 | تم إلغاء الإهلاك. تم تغيير الحالة إلى "قديم". |
| v11.0.0 | إهلاك للتوثيق فقط. |
:::

النوع: تم إلغاء الإهلاك

واجهة برمجة تطبيقات [URL القديمة](/ar/nodejs/api/url#legacy-url-api) مهملة. وهذا يشمل ‏[`url.format()`](/ar/nodejs/api/url#urlformaturlobject)‎‏ و ‏[`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)‎‏ و ‏[`url.resolve()`](/ar/nodejs/api/url#urlresolvefrom-to)‎‏ و [`urlObject`](/ar/nodejs/api/url#legacy-urlobject) القديم. يرجى استخدام [واجهة برمجة تطبيقات WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api) بدلاً من ذلك.


### DEP0117: معالجات التشفير الأصلية {#dep0117-native-crypto-handles}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر. |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر

عرضت الإصدارات السابقة من Node.js معالجات للكائنات الأصلية الداخلية من خلال خاصية `_handle` للفئات `Cipher` و `Decipher` و `DiffieHellman` و `DiffieHellmanGroup` و `ECDH` و `Hash` و `Hmac` و `Sign` و `Verify`. تمت إزالة خاصية `_handle` لأن الاستخدام غير السليم للكائن الأصلي يمكن أن يؤدي إلى تعطيل التطبيق.

### DEP0118: دعم `dns.lookup()` لاسم مضيف خاطئ {#dep0118-dnslookup-support-for-a-falsy-host-name}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: وقت التشغيل

دعمت الإصدارات السابقة من Node.js `dns.lookup()` باسم مضيف خاطئ مثل `dns.lookup(false)` بسبب التوافق مع الإصدارات السابقة. هذا السلوك غير موثق ويعتقد أنه غير مستخدم في التطبيقات الواقعية. سيصبح خطأ في الإصدارات المستقبلية من Node.js.

### DEP0119: واجهة برمجة التطبيقات الخاصة `process.binding('uv').errname()` {#dep0119-processbindinguverrname-private-api}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.0.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` مهمل. يرجى استخدام [`util.getSystemErrorName()`](/ar/nodejs/api/util#utilgetsystemerrornameerr) بدلاً من ذلك.

### DEP0120: دعم عداد أداء Windows {#dep0120-windows-performance-counter-support}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | نهاية العمر. |
| v11.0.0 | إهلاك وقت التشغيل. |
:::

النوع: نهاية العمر

تمت إزالة دعم عداد أداء Windows من Node.js. تم إهلاك الدوال غير الموثقة `COUNTER_NET_SERVER_CONNECTION()` و `COUNTER_NET_SERVER_CONNECTION_CLOSE()` و `COUNTER_HTTP_SERVER_REQUEST()` و `COUNTER_HTTP_SERVER_RESPONSE()` و `COUNTER_HTTP_CLIENT_REQUEST()` و `COUNTER_HTTP_CLIENT_RESPONSE()`.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | إهلاك وقت التشغيل. |
:::

النوع: وقت التشغيل

كانت الدالة غير الموثقة `net._setSimultaneousAccepts()` مخصصة في الأصل لتصحيح الأخطاء وضبط الأداء عند استخدام الوحدات `node:child_process` و `node:cluster` على Windows. الدالة ليست مفيدة بشكل عام ويجري إزالتها. انظر المناقشة هنا: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

يرجى استخدام `Server.prototype.setSecureContext()` بدلاً من ذلك.

### DEP0123: تعيين TLS ServerName إلى عنوان IP {#dep0123-setting-the-tls-servername-to-an-ip-address}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

لا يسمح [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3) بتعيين TLS ServerName إلى عنوان IP. سيتم تجاهل هذا في إصدار مستقبلي.

### DEP0124: استخدام `REPLServer.rli` {#dep0124-using-replserverrli}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | نهاية العمر الافتراضي. |
| v12.0.0 | إهمال وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

هذه الخاصية هي إشارة إلى المثيل نفسه.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

الوحدة `node:_stream_wrap` مهملة.

### DEP0126: `timers.active()` {#dep0126-timersactive}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.14.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إهمال `timers.active()` غير الموثقة سابقًا. يرجى استخدام [`timeout.refresh()`](/ar/nodejs/api/timers#timeoutrefresh) الموثقة علنًا بدلاً من ذلك. إذا كانت إعادة الإشارة إلى المهلة ضرورية، فيمكن استخدام [`timeout.ref()`](/ar/nodejs/api/timers#timeoutref) دون أي تأثير على الأداء منذ Node.js 10.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v11.14.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إهمال `timers._unrefActive()` "الخاصة" وغير الموثقة سابقًا. يرجى استخدام [`timeout.refresh()`](/ar/nodejs/api/timers#timeoutrefresh) الموثقة علنًا بدلاً من ذلك. إذا كان إلغاء الإشارة إلى المهلة ضروريًا، فيمكن استخدام [`timeout.unref()`](/ar/nodejs/api/timers#timeoutunref) دون أي تأثير على الأداء منذ Node.js 10.

### DEP0128: الوحدات النمطية التي تحتوي على إدخال `main` غير صالح وملف `index.js` {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | إهمال وقت التشغيل. |
| v12.0.0 | خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

الوحدات النمطية التي تحتوي على إدخال `main` غير صالح (على سبيل المثال، `./does-not-exist.js`) وتحتوي أيضًا على ملف `index.js` في الدليل ذي المستوى الأعلى ستحل ملف `index.js`. هذا مهمل وسيؤدي إلى ظهور خطأ في إصدارات Node.js المستقبلية.


### DEP0129: ‏`ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | إهلاك وقت التشغيل. |
| v11.14.0 | خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

الخاصية `_channel` لكائنات العمليات الفرعية التي يتم إرجاعها بواسطة `spawn()` ووظائف مماثلة غير مخصصة للاستخدام العام. استخدم `ChildProcess.channel` بدلاً من ذلك.

### DEP0130: ‏`Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | نهاية العمر الافتراضي. |
| v13.0.0 | إهلاك وقت التشغيل. |
| v12.2.0 | خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

استخدم [`module.createRequire()`](/ar/nodejs/api/module#modulecreaterequirefilename) بدلاً من ذلك.

### DEP0131: محلل HTTP القديم {#dep0131-legacy-http-parser}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تمت إزالة هذه الميزة. |
| v12.22.0 | إهلاك وقت التشغيل. |
| v12.3.0 | خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تم إيقاف محلل HTTP القديم، المستخدم افتراضيًا في إصدارات Node.js قبل 12.0.0، وتمت إزالته في الإصدار v13.0.0. قبل الإصدار v13.0.0، يمكن استخدام علامة سطر الأوامر `--http-parser=legacy` للرجوع إلى استخدام المحلل اللغوي القديم.

### DEP0132: ‏`worker.terminate()` مع رد الاتصال {#dep0132-workerterminate-with-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.5.0 | إهلاك وقت التشغيل. |
:::

النوع: وقت التشغيل

تم إيقاف تمرير رد نداء إلى [`worker.terminate()`](/ar/nodejs/api/worker_threads#workerterminate). استخدم `Promise` المرتجع بدلاً من ذلك، أو مستمعًا لحدث `'exit'` الخاص بالعامل.

### DEP0133: ‏`http` ‏`connection` {#dep0133-http-connection}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.12.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

فضل [`response.socket`](/ar/nodejs/api/http#responsesocket) على [`response.connection`](/ar/nodejs/api/http#responseconnection) و [`request.socket`](/ar/nodejs/api/http#requestsocket) على [`request.connection`](/ar/nodejs/api/http#requestconnection).

### DEP0134: ‏`process._tickCallback` {#dep0134-process_tickcallback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.12.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

لم يتم توثيق الخاصية `process._tickCallback` مطلقًا كواجهة برمجة تطبيقات مدعومة رسميًا.


### DEP0135: `WriteStream.open()` و `ReadStream.open()` داخليتان {#dep0135-writestreamopen-and-readstreamopen-are-internal}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

تعتبر [`WriteStream.open()`](/ar/nodejs/api/fs#class-fswritestream) و [`ReadStream.open()`](/ar/nodejs/api/fs#class-fsreadstream) واجهات برمجة تطبيقات داخلية غير موثقة ولا معنى لاستخدامها في مساحة المستخدم. يجب دائمًا فتح تدفقات الملفات من خلال طرق المصنع المقابلة لها [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options) و [`fs.createReadStream()`](/ar/nodejs/api/fs#fscreatereadstreampath-options)) أو عن طريق تمرير واصف ملف في الخيارات.

### DEP0136: `http` `finished` {#dep0136-http-finished}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.4.0, v12.16.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

تشير [`response.finished`](/ar/nodejs/api/http#responsefinished) إلى ما إذا كان قد تم استدعاء [`response.end()`](/ar/nodejs/api/http#responseenddata-encoding-callback)، وليس ما إذا كان قد تم إصدار `'finish'` وتم تدفق البيانات الأساسية.

استخدم [`response.writableFinished`](/ar/nodejs/api/http#responsewritablefinished) أو [`response.writableEnded`](/ar/nodejs/api/http#responsewritableended) وفقًا لذلك لتجنب الغموض.

للحفاظ على السلوك الحالي، يجب استبدال `response.finished` بـ `response.writableEnded`.

### DEP0137: إغلاق fs.FileHandle عند جمع البيانات المهملة {#dep0137-closing-fsfilehandle-on-garbage-collection}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | إهمال وقت التشغيل. |
:::

النوع: وقت التشغيل

يُعتبر السماح بإغلاق كائن [`fs.FileHandle`](/ar/nodejs/api/fs#class-filehandle) عند جمع البيانات المهملة أمرًا مهملًا. في المستقبل، قد يؤدي القيام بذلك إلى حدوث خطأ يتم طرحه يؤدي إلى إنهاء العملية.

يرجى التأكد من إغلاق جميع كائنات `fs.FileHandle` بشكل صريح باستخدام `FileHandle.prototype.close()` عندما لم تعد `fs.FileHandle` مطلوبة:

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.0.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

[`process.mainModule`](/ar/nodejs/api/process#processmainmodule) هي ميزة خاصة بـ CommonJS فقط بينما يتم مشاركة الكائن العام `process` مع بيئة غير CommonJS. استخدامه داخل وحدات ECMAScript غير مدعوم.

تم إهماله لصالح [`require.main`](/ar/nodejs/api/modules#accessing-the-main-module)، لأنه يخدم نفس الغرض وهو متاح فقط في بيئة CommonJS.

### DEP0139: `process.umask()` بدون وسيطات {#dep0139-processumask-with-no-arguments}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.0.0، الإصدار v12.19.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

استدعاء `process.umask()` بدون وسيطة يتسبب في كتابة umask على مستوى العملية مرتين. هذا يقدم حالة سباق بين الخيوط، وهو ثغرة أمنية محتملة. لا يوجد بديل API آمن ومتعدد الأنظمة الأساسية.

### DEP0140: استخدام `request.destroy()` بدلاً من `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.1.0، الإصدار v13.14.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

استخدم [`request.destroy()`](/ar/nodejs/api/http#requestdestroyerror) بدلاً من [`request.abort()`](/ar/nodejs/api/http#requestabort).

### DEP0141: `repl.inputStream` و `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.3.0 | خاص بالتوثيق فقط (يدعم [`--pending-deprecation`][]). |
:::

النوع: خاص بالتوثيق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

وحدة `node:repl` قامت بتصدير دفق الإدخال والإخراج مرتين. استخدم `.input` بدلاً من `.inputStream` و `.output` بدلاً من `.outputStream`.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.3.0 | خاص بالتوثيق فقط (يدعم [`--pending-deprecation`][]). |
:::

النوع: خاص بالتوثيق فقط

تقوم وحدة `node:repl` بتصدير خاصية `_builtinLibs` تحتوي على مصفوفة من الوحدات المضمنة. كانت غير مكتملة حتى الآن وبدلاً من ذلك من الأفضل الاعتماد على `require('node:module').builtinModules`.


### DEP0143: ‏`Transform._transformState` {#dep0143-transform_transformstate}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.5.0 | إهمال وقت التشغيل. |
:::

النوع: سيتم إزالة `Transform._transformState` في وقت التشغيل في الإصدارات المستقبلية حيث لم يعد مطلوبًا بسبب تبسيط التنفيذ.

### DEP0144: ‏`module.parent` {#dep0144-moduleparent}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.6.0، الإصدار 12.19.0 | إهمال خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

يمكن لوحدة CommonJS الوصول إلى الوحدة الأولى التي طلبتها باستخدام `module.parent`. تم إهمال هذه الميزة لأنها لا تعمل باستمرار في وجود وحدات ECMAScript ولأنها تعطي تمثيلًا غير دقيق لرسوم CommonJS البيانية.

تستخدمه بعض الوحدات للتحقق مما إذا كانت نقطة دخول العملية الحالية. بدلاً من ذلك، يوصى بمقارنة `require.main` و `module`:

```js [ESM]
if (require.main === module) {
  // مقطع التعليمات البرمجية الذي سيتم تشغيله فقط إذا كان الملف الحالي هو نقطة الدخول.
}
```
عند البحث عن وحدات CommonJS التي طلبت الوحدة الحالية، يمكن استخدام `require.cache` و `module.children`:

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: ‏`socket.bufferSize` {#dep0145-socketbuffersize}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.6.0 | إهمال خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

[`socket.bufferSize`](/ar/nodejs/api/net#socketbuffersize) هو مجرد اسم مستعار لـ [`writable.writableLength`](/ar/nodejs/api/stream#writablewritablelength).

### DEP0146: ‏`new crypto.Certificate()` {#dep0146-new-cryptocertificate}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.9.0 | إهمال خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

تم إهمال [`crypto.Certificate()` constructor](/ar/nodejs/api/crypto#legacy-api). استخدم [الطرق الثابتة لـ `crypto.Certificate()`](/ar/nodejs/api/crypto#class-certificate) بدلاً من ذلك.

### DEP0147: ‏`fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.0.0 | إهمال وقت التشغيل. |
| الإصدار 15.0.0 | إهمال وقت التشغيل للسلوك المتساهل. |
| الإصدار 14.14.0 | إهمال خاص بالوثائق فقط. |
:::

النوع: وقت التشغيل

في الإصدارات المستقبلية من Node.js، سيتم تجاهل خيار `recursive` لـ `fs.rmdir` و `fs.rmdirSync` و `fs.promises.rmdir`.

استخدم `fs.rm(path, { recursive: true, force: true })` أو `fs.rmSync(path, { recursive: true, force: true })` أو `fs.promises.rm(path, { recursive: true, force: true })` بدلاً من ذلك.


### DEP0148: تعيينات المجلدات في `"exports"` (علامة `"/"` زائدة) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 17.0.0 | نهاية العمر الافتراضي. |
| الإصدار 16.0.0 | الإهلاك في وقت التشغيل. |
| الإصدار 15.1.0 | الإهلاك في وقت التشغيل لعمليات الاستيراد ذات الإشارة الذاتية. |
| الإصدار 14.13.0 | الإهلاك في الوثائق فقط. |
:::

النوع: وقت التشغيل

يتم إهلاك استخدام علامة `"/"` زائدة لتعريف تعيينات مجلدات المسار الفرعي في حقول [صادرات المسار الفرعي](/ar/nodejs/api/packages#subpath-exports) أو [واردات المسار الفرعي](/ar/nodejs/api/packages#subpath-imports). استخدم [أنماط المسار الفرعي](/ar/nodejs/api/packages#subpath-patterns) بدلاً من ذلك.

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.0.0 | الإهلاك في الوثائق فقط. |
:::

النوع: الوثائق فقط.

فضل [`message.socket`](/ar/nodejs/api/http#messagesocket) على [`message.connection`](/ar/nodejs/api/http#messageconnection).

### DEP0150: تغيير قيمة `process.config` {#dep0150-changing-the-value-of-processconfig}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 19.0.0 | نهاية العمر الافتراضي. |
| الإصدار 16.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: نهاية العمر الافتراضي

توفر الخاصية `process.config` الوصول إلى إعدادات وقت تجميع Node.js. ومع ذلك، فإن الخاصية قابلة للتغيير وبالتالي عرضة للعبث. ستتم إزالة القدرة على تغيير القيمة في إصدار مستقبلي من Node.js.

### DEP0151: البحث عن فهرس رئيسي والبحث عن الامتدادات {#dep0151-main-index-lookup-and-extension-searching}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.0.0 | الإهلاك في وقت التشغيل. |
| الإصدار 15.8.0, الإصدار 14.18.0 | الإهلاك في الوثائق فقط مع دعم `--pending-deprecation`. |
:::

النوع: وقت التشغيل

سابقًا، سيتم تطبيق عمليات البحث عن `index.js` والبحث عن الامتدادات على حل نقطة الدخول الرئيسية `import 'pkg'`، حتى عند حل وحدات ES النمطية.

مع هذا الإهلاك، تتطلب جميع حلول نقطة الدخول الرئيسية لوحدة ES النمطية [`"exports"` أو `"main"` إدخال](/ar/nodejs/api/packages#main-entry-point-export) صريحًا مع امتداد الملف المحدد.

### DEP0152: خصائص Extension PerformanceEntry {#dep0152-extension-performanceentry-properties}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.0.0 | الإهلاك في وقت التشغيل. |
:::

النوع: وقت التشغيل

تحتوي أنواع الكائنات `'gc'` و `'http2'` و `'http'` [\<PerformanceEntry\>](/ar/nodejs/api/perf_hooks#class-performanceentry) على خصائص إضافية مُعيَّنة لها توفر معلومات إضافية. تتوفر هذه الخصائص الآن داخل الخاصية `detail` القياسية لكائن `PerformanceEntry`. تم إهلاك أدوات الوصول الحالية ويجب عدم استخدامها بعد الآن.


### DEP0153: `dns.lookup` و `dnsPromises.lookup` إجبار نوع الخيارات {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | نهاية العمر. |
| الإصدار v17.0.0 | إهمال وقت التشغيل. |
| الإصدار v16.8.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: نهاية العمر

يؤدي استخدام قيمة غير فارغة وغير عدد صحيح لخيار `family`، أو قيمة غير فارغة وغير رقمية لخيار `hints`، أو قيمة غير فارغة وغير منطقية لخيار `all`، أو قيمة غير فارغة وغير منطقية لخيار `verbatim` في [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) و [`dnsPromises.lookup()`](/ar/nodejs/api/dns#dnspromiseslookuphostname-options) إلى إطلاق خطأ `ERR_INVALID_ARG_TYPE`.

### DEP0154: خيارات توليد زوج مفاتيح RSA-PSS {#dep0154-rsa-pss-generate-key-pair-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v20.0.0 | إهمال وقت التشغيل. |
| الإصدار v16.10.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

تم استبدال الخيارات `'hash'` و `'mgf1Hash'` بالخيارات `'hashAlgorithm'` و `'mgf1HashAlgorithm'`.

### DEP0155: الشرطات المائلة اللاحقة في قرارات مُحدِّد النمط {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v17.0.0 | إهمال وقت التشغيل. |
| الإصدار v16.10.0 | إهمال خاص بالتوثيق فقط مع دعم `--pending-deprecation`. |
:::

النوع: وقت التشغيل

إعادة تعيين المُحدِّدات التي تنتهي بـ `"/"` مثل `import 'pkg/x/'` أصبحت مهملة لحل نمط الحزم `"exports"` و `"imports"`.

### DEP0156: الخاصية `.aborted` والحدث `'abort'` و `'aborted'` في `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v17.0.0, v16.12.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

انتقل إلى واجهة برمجة تطبيقات [\<Stream\>](/ar/nodejs/api/stream#stream) بدلاً من ذلك، حيث أن [`http.ClientRequest`](/ar/nodejs/api/http#class-httpclientrequest) و [`http.ServerResponse`](/ar/nodejs/api/http#class-httpserverresponse) و [`http.IncomingMessage`](/ar/nodejs/api/http#class-httpincomingmessage) كلها تعتمد على التدفق. تحقق من `stream.destroyed` بدلاً من الخاصية `.aborted`، واستمع إلى `'close'` بدلاً من الحدث `'abort'` و `'aborted'`.

الخاصية `.aborted` والحدث `'abort'` مفيدان فقط لاكتشاف استدعاءات `.abort()`. لإغلاق طلب مبكرًا، استخدم Stream `.destroy([error])` ثم تحقق من الخاصية `.destroyed` والحدث `'close'` يجب أن يكون لهما نفس التأثير. يجب على الطرف المتلقي أيضًا التحقق من القيمة [`readable.readableEnded`](/ar/nodejs/api/stream#readablereadableended) على [`http.IncomingMessage`](/ar/nodejs/api/http#class-httpincomingmessage) لمعرفة ما إذا كان الإغلاق مبكرًا أو إتلافًا سلسًا.


### DEP0157: دعم Thenable في التدفقات {#dep0157-thenable-support-in-streams}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 18.0.0 | نهاية العمر. |
| الإصدار 17.2.0، الإصدار 16.14.0 | إيقاف مؤقت للتوثيق فقط. |
:::

النوع: نهاية العمر

كانت إحدى الميزات غير الموثقة في تدفقات Node.js هي دعم thenables في طرق التنفيذ. تم إيقاف هذه الميزة الآن، استخدم ردود النداء بدلاً من ذلك وتجنب استخدام الدالة غير المتزامنة لطرق تنفيذ التدفقات.

تسببت هذه الميزة في مواجهة المستخدمين لمشكلات غير متوقعة حيث يقوم المستخدم بتنفيذ الدالة بأسلوب رد النداء ولكنه يستخدم على سبيل المثال طريقة غير متزامنة من شأنها أن تتسبب في حدوث خطأ لأن مزج دلالات الوعد ورد النداء غير صالح.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 17.5.0، الإصدار 16.15.0 | إيقاف مؤقت للتوثيق فقط. |
:::

النوع: توثيق فقط

تم إيقاف هذه الطريقة لأنها غير متوافقة مع `Uint8Array.prototype.slice()`، وهي فئة فرعية من `Buffer`.

استخدم [`buffer.subarray`](/ar/nodejs/api/buffer#bufsubarraystart-end) الذي يفعل نفس الشيء بدلاً من ذلك.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 18.0.0 | نهاية العمر. |
:::

النوع: نهاية العمر

تمت إزالة رمز الخطأ هذا بسبب إضافة المزيد من الارتباك إلى الأخطاء المستخدمة للتحقق من صحة نوع القيمة.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 18.0.0 | إيقاف مؤقت لوقت التشغيل. |
| الإصدار 17.6.0، الإصدار 16.15.0 | إيقاف مؤقت للتوثيق فقط. |
:::

النوع: وقت التشغيل.

تم إيقاف هذا الحدث لأنه لم يعمل مع V8 promise combinators مما قلل من فائدته.

### DEP0161: `process._getActiveRequests()` و `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| الإصدار 17.6.0، الإصدار 16.15.0 | إيقاف مؤقت للتوثيق فقط. |
:::

النوع: توثيق فقط

الوظائف `process._getActiveHandles()` و `process._getActiveRequests()` غير مخصصة للاستخدام العام ويمكن إزالتها في الإصدارات المستقبلية.

استخدم [`process.getActiveResourcesInfo()`](/ar/nodejs/api/process#processgetactiveresourcesinfo) للحصول على قائمة بأنواع الموارد النشطة وليس المراجع الفعلية.


### DEP0162: تحويل `fs.write()` و `fs.writeFileSync()` إلى سلسلة نصية {#dep0162-fswrite-fswritefilesync-coercion-to-string}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | نهاية العمر الافتراضي. |
| الإصدار v18.0.0 | إهلاك وقت التشغيل. |
| الإصدار v17.8.0 و v16.15.0 | إهلاك خاص بالوثائق فقط. |
:::

النوع: نهاية العمر الافتراضي

التحويل الضمني للكائنات التي تحتوي على خاصية `toString` خاصة بها، والتي يتم تمريرها كمعامل ثانٍ في [`fs.write()`](/ar/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback) و [`fs.writeFile()`](/ar/nodejs/api/fs#fswritefilefile-data-options-callback) و [`fs.appendFile()`](/ar/nodejs/api/fs#fsappendfilepath-data-options-callback) و [`fs.writeFileSync()`](/ar/nodejs/api/fs#fswritefilesyncfile-data-options) و [`fs.appendFileSync()`](/ar/nodejs/api/fs#fsappendfilesyncpath-data-options) مهمل. قم بتحويلها إلى سلاسل نصية أولية.

### DEP0163: `channel.subscribe(onMessage)` و `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.7.0 و v16.17.0 | إهلاك خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

تم إهلاك هذه الطرق لأنه يمكن استخدامها بطريقة لا تحافظ على مرجع القناة حيًا لفترة كافية لتلقي الأحداث.

استخدم [`diagnostics_channel.subscribe(name, onMessage)`](/ar/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) أو [`diagnostics_channel.unsubscribe(name, onMessage)`](/ar/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) الذي يفعل نفس الشيء بدلاً من ذلك.

### DEP0164: تحويل `process.exit(code)` و `process.exitCode` إلى عدد صحيح {#dep0164-processexitcode-processexitcode-coercion-to-integer}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v20.0.0 | نهاية العمر الافتراضي. |
| الإصدار v19.0.0 | إهلاك وقت التشغيل. |
| الإصدار v18.10.0 و v16.18.0 | إهلاك خاص بالوثائق فقط لتحويل `process.exitCode` إلى عدد صحيح. |
| الإصدار v18.7.0 و v16.17.0 | إهلاك خاص بالوثائق فقط لتحويل `process.exit(code)` إلى عدد صحيح. |
:::

النوع: نهاية العمر الافتراضي

القيم بخلاف `undefined` و `null` والأرقام الصحيحة والسلاسل النصية الصحيحة (مثل `'1'`) مهملة كقيمة للمعامل `code` في [`process.exit()`](/ar/nodejs/api/process#processexitcode) وكقيمة يتم تعيينها إلى [`process.exitCode`](/ar/nodejs/api/process#processexitcode_1).


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | نهاية العمر الافتراضي. |
| v22.0.0 | الإهلاك في وقت التشغيل. |
| v18.8.0, v16.18.0 | الإهلاك في الوثائق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة العلامة `--trace-atomics-wait` لأنها تستخدم خطاف V8 `SetAtomicsWaitCallback`، الذي ستتم إزالته في إصدار V8 مستقبلي.

### DEP0166: خطوط مائلة مزدوجة في أهداف الاستيراد والتصدير {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | الإهلاك في وقت التشغيل. |
| v18.10.0 | الإهلاك في الوثائق فقط مع دعم `--pending-deprecation`. |
:::

النوع: وقت التشغيل

يتم إهمال أهداف استيراد وتصدير الحزم التي يتم تعيينها في مسارات تتضمن خطًا مائلًا مزدوجًا (من *"/"* أو *"\"*) وسيؤدي إلى حدوث خطأ في التحقق من الصحة في إصدار مستقبلي. ينطبق هذا الإهمال نفسه أيضًا على مطابقة الأنماط التي تبدأ أو تنتهي بشرطة مائلة.

### DEP0167: مثيلات `DiffieHellmanGroup` الضعيفة (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.10.0, v16.18.0 | الإهلاك في الوثائق فقط. |
:::

النوع: الوثائق فقط

تم إهمال مجموعات MODP المعروفة `modp1` و `modp2` و `modp5` لأنها غير آمنة ضد الهجمات العملية. راجع [RFC 8247 القسم 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) للحصول على التفاصيل.

قد تتم إزالة هذه المجموعات في الإصدارات المستقبلية من Node.js. يجب على التطبيقات التي تعتمد على هذه المجموعات تقييم استخدام مجموعات MODP أقوى بدلاً من ذلك.

### DEP0168: استثناء غير معالج في معاودة الاتصال Node-API {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.3.0, v16.17.0 | الإهلاك في وقت التشغيل. |
:::

النوع: وقت التشغيل

يتم الآن إهمال الكبت الضمني للاستثناءات غير الملتقطة في معاودة الاتصال Node-API.

عيّن العلامة [`--force-node-api-uncaught-exceptions-policy`](/ar/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) لإجبار Node.js على إصدار حدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception) إذا لم تتم معالجة الاستثناء في معاودة الاتصال Node-API.


### DEP0169: `url.parse()` غير آمن {#dep0169-insecure-urlparse}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.9.0, v18.17.0 | تمت إضافة دعم `--pending-deprecation`. |
| v19.0.0, v18.13.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط (يدعم [`--pending-deprecation`](/ar/nodejs/api/cli#--pending-deprecation))

سلوك [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) غير موحد وعرضة للأخطاء التي لها آثار أمنية. استخدم [واجهة برمجة تطبيقات WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api) بدلاً من ذلك. لا يتم إصدار CVEs لنقاط الضعف في `url.parse()`.

### DEP0170: منفذ غير صالح عند استخدام `url.parse()` {#dep0170-invalid-port-when-using-urlparse}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | إهلاك وقت التشغيل. |
| v19.2.0, v18.13.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

[`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) يقبل عناوين URL التي تحتوي على منافذ ليست أرقامًا. قد يؤدي هذا السلوك إلى انتحال اسم المضيف بإدخال غير متوقع. ستطرح عناوين URL هذه خطأً في الإصدارات المستقبلية من Node.js، كما تفعل [واجهة برمجة تطبيقات WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api) بالفعل.

### DEP0171: أدوات الضبط لعناوين وتذييلات `http.IncomingMessage` {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.3.0, v18.13.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

في إصدار مستقبلي من Node.js، ستكون [`message.headers`](/ar/nodejs/api/http#messageheaders) و [`message.headersDistinct`](/ar/nodejs/api/http#messageheadersdistinct) و [`message.trailers`](/ar/nodejs/api/http#messagetrailers) و [`message.trailersDistinct`](/ar/nodejs/api/http#messagetrailersdistinct) للقراءة فقط.

### DEP0172: خاصية `asyncResource` للدوال المرتبطة بـ `AsyncResource` {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0 | إهلاك وقت التشغيل. |
:::

النوع: وقت التشغيل

في إصدار مستقبلي من Node.js، لن تتم إضافة خاصية `asyncResource` عندما يتم ربط دالة بـ `AsyncResource`.

### DEP0173: فئة `assert.CallTracker` {#dep0173-the-assertcalltracker-class}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0 | إهلاك خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

في إصدار مستقبلي من Node.js، ستتم إزالة [`assert.CallTracker`](/ar/nodejs/api/assert#class-assertcalltracker). ضع في اعتبارك استخدام بدائل مثل دالة المساعد [`mock`](/ar/nodejs/api/test#mocking).


### DEP0174: استدعاء `promisify` على دالة تُرجع `Promise` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | إهلاك وقت التشغيل. |
| v20.8.0 | إهلاك للتوثيق فقط. |
:::

النوع: وقت التشغيل

استدعاء [`util.promisify`](/ar/nodejs/api/util#utilpromisifyoriginal) على دالة تُرجع

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.8.0 | إهلاك للتوثيق فقط. |
:::

النوع: للتوثيق فقط

واجهة برمجة التطبيقات [`util.toUSVString()`](/ar/nodejs/api/util#utiltousvstringstring) مهملة. يرجى استخدام [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) بدلاً من ذلك.

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.8.0 | إهلاك للتوثيق فقط. |
:::

النوع: للتوثيق فقط

`F_OK`، و`R_OK`، و`W_OK`، و`X_OK` التي يتم عرضها مباشرة على `node:fs` مهملة. احصل عليها من `fs.constants` أو `fs.promises.constants` بدلاً من ذلك.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.7.0, v20.12.0 | نهاية العمر الافتراضي. |
| v21.3.0, v20.11.0 | تم تعيين رمز إهلاك. |
| v14.0.0 | إهلاك للتوثيق فقط. |
:::

النوع: نهاية العمر الافتراضي

تمت إزالة واجهة برمجة التطبيقات `util.types.isWebAssemblyCompiledModule`. يرجى استخدام `value instanceof WebAssembly.Module` بدلاً من ذلك.

### DEP0178: `dirent.path` {#dep0178-direntpath}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إهلاك وقت التشغيل. |
| v21.5.0, v20.12.0, v18.20.0 | إهلاك للتوثيق فقط. |
:::

النوع: وقت التشغيل

[`dirent.path`](/ar/nodejs/api/fs#direntpath) مهمل بسبب عدم اتساقه عبر خطوط الإصدار. يرجى استخدام [`dirent.parentPath`](/ar/nodejs/api/fs#direntparentpath) بدلاً من ذلك.

### DEP0179: مُنشئ `Hash` {#dep0179-hash-constructor}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | إهلاك وقت التشغيل. |
| v21.5.0, v20.12.0 | إهلاك للتوثيق فقط. |
:::

النوع: وقت التشغيل

استدعاء فئة `Hash` مباشرة باستخدام `Hash()` أو `new Hash()` مهمل بسبب كونه داخليًا، وليس مخصصًا للاستخدام العام. يرجى استخدام طريقة [`crypto.createHash()`](/ar/nodejs/api/crypto#cryptocreatehashalgorithm-options) لإنشاء مثيلات Hash.


### DEP0180: مُنشئ `fs.Stats` {#dep0180-fsstats-constructor}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | إهمال وقت التشغيل. |
| v20.13.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

يُعتبر استدعاء الفئة `fs.Stats` مباشرةً باستخدام `Stats()` أو `new Stats()` مُهملًا بسبب كونه جزءًا داخليًا، وغير مخصص للاستخدام العام.

### DEP0181: مُنشئ `Hmac` {#dep0181-hmac-constructor}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | إهمال وقت التشغيل. |
| v20.13.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

يُعتبر استدعاء الفئة `Hmac` مباشرةً باستخدام `Hmac()` أو `new Hmac()` مُهملًا بسبب كونه جزءًا داخليًا، وغير مخصص للاستخدام العام. يرجى استخدام طريقة [`crypto.createHmac()`](/ar/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) لإنشاء مثيلات Hmac.

### DEP0182: علامات مصادقة GCM القصيرة بدون `authTagLength` صريح {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | إهمال وقت التشغيل. |
| v20.13.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: وقت التشغيل

يجب على التطبيقات التي تنوي استخدام علامات مصادقة أقصر من طول علامة المصادقة الافتراضي تعيين خيار `authTagLength` لوظيفة [`crypto.createDecipheriv()`](/ar/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) إلى الطول المناسب.

بالنسبة إلى الشفرات في وضع GCM، تقبل الوظيفة [`decipher.setAuthTag()`](/ar/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) علامات مصادقة بأي طول صالح (راجع [DEP0090](/ar/nodejs/api/deprecations#DEP0090)). تم إهمال هذا السلوك ليتماشى بشكل أفضل مع التوصيات وفقًا لـ [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0183: واجهات برمجة تطبيقات تستند إلى محرك OpenSSL {#dep0183-openssl-engine-based-apis}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | إهمال خاص بالتوثيق فقط. |
:::

النوع: خاص بالتوثيق فقط

أهمل OpenSSL 3 دعم المحركات المخصصة مع توصية بالتحول إلى نموذج الموفر الجديد الخاص به. يعتمد خيار `clientCertEngine` لـ `https.request()` و [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) و [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)؛ و `privateKeyEngine` و `privateKeyIdentifier` لـ [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions)؛ و [`crypto.setEngine()`](/ar/nodejs/api/crypto#cryptosetengineengine-flags) جميعًا على هذه الوظيفة من OpenSSL.


### DEP0184: تهيئة فئات `node:zlib` بدون `new` {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.9.0, v20.18.0 | إيقاف الاستخدام خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

تم إيقاف تهيئة الفئات بدون المؤهل `new` المصدرة من الوحدة `node:zlib`. يوصى باستخدام المؤهل `new` بدلاً من ذلك. ينطبق هذا على جميع فئات Zlib، مثل `Deflate` و`DeflateRaw` و`Gunzip` و`Inflate` و`InflateRaw` و`Unzip` و`Zlib`.

### DEP0185: تهيئة فئات `node:repl` بدون `new` {#dep0185-instantiating-noderepl-classes-without-new}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.9.0, v20.18.0 | إيقاف الاستخدام خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

تم إيقاف تهيئة الفئات بدون المؤهل `new` المصدرة من الوحدة `node:repl`. يوصى باستخدام المؤهل `new` بدلاً من ذلك. ينطبق هذا على جميع فئات REPL، بما في ذلك `REPLServer` و`Recoverable`.

### DEP0187: تمرير أنواع وسيطات غير صالحة إلى `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.4.0 | خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

تم إيقاف تمرير أنواع الوسيطات غير المدعومة، وبدلاً من إرجاع `false`، سيتم طرح خطأ في إصدار مستقبلي.

### DEP0188: `process.features.ipv6` و `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.4.0 | إيقاف الاستخدام خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

هذه الخصائص هي `true` بشكل غير مشروط. أي عمليات تحقق تستند إلى هذه الخصائص زائدة عن الحاجة.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.4.0 | إيقاف الاستخدام خاص بالوثائق فقط. |
:::

النوع: خاص بالوثائق فقط

تم إيقاف `process.features.tls_alpn` و `process.features.tls_ocsp` و `process.features.tls_sni`، حيث أن قيمها مضمونة لتكون مماثلة لقيمة `process.features.tls`.

