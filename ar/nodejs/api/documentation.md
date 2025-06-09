---
title: توثيق Node.js
description: استكشف التوثيق الشامل لـ Node.js، الذي يغطي واجهات برمجة التطبيقات، والوحدات، وأمثلة الاستخدام لمساعدة المطورين على فهم واستخدام Node.js بفعالية.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف التوثيق الشامل لـ Node.js، الذي يغطي واجهات برمجة التطبيقات، والوحدات، وأمثلة الاستخدام لمساعدة المطورين على فهم واستخدام Node.js بفعالية.
  - - meta
    - name: twitter:title
      content: توثيق Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف التوثيق الشامل لـ Node.js، الذي يغطي واجهات برمجة التطبيقات، والوحدات، وأمثلة الاستخدام لمساعدة المطورين على فهم واستخدام Node.js بفعالية.
---


# حول هذه الوثائق {#about-this-documentation}

مرحبًا بك في وثائق مرجع API الرسمية لـ Node.js!

Node.js هو وقت تشغيل JavaScript مبني على [محرك V8 JavaScript](https://v8.dev/).

## المساهمة {#contributing}

أبلغ عن الأخطاء في هذه الوثائق في [متتبع المشكلات](https://github.com/nodejs/node/issues/new). راجع [دليل المساهمة](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) للحصول على إرشادات حول كيفية إرسال طلبات السحب.

## مؤشر الاستقرار {#stability-index}

توجد في جميع أنحاء الوثائق مؤشرات على استقرار القسم. بعض واجهات برمجة التطبيقات (APIs) مثبتة للغاية ويعتمد عليها لدرجة أنه من غير المحتمل أن تتغير على الإطلاق. البعض الآخر جديد تمامًا وتجريبي، أو من المعروف أنه خطر.

مؤشرات الاستقرار هي كما يلي:

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) الاستقرار: 0 - مهمل. قد تُصدر الميزة تحذيرات. التوافق مع الإصدارات السابقة غير مضمون.
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) الاستقرار: 1 - تجريبي. لا تخضع الميزة لقواعد [الترقيم الدلالي للإصدارات](https://semver.org/). قد تحدث تغييرات غير متوافقة مع الإصدارات السابقة أو إزالة في أي إصدار مستقبلي. لا يُنصح باستخدام الميزة في بيئات الإنتاج.
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) الاستقرار: 2 - مستقر. التوافق مع نظام npm البيئي له أولوية قصوى.
:::

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) الاستقرار: 3 - قديم. على الرغم من أنه من غير المحتمل إزالة هذه الميزة ولا تزال مشمولة بضمانات الترقيم الدلالي للإصدارات، إلا أنها لم تعد قيد الصيانة النشطة، وتتوفر بدائل أخرى.
:::

يتم تمييز الميزات على أنها قديمة بدلاً من إهمالها إذا كان استخدامها لا يضر، ويعتمد عليها على نطاق واسع داخل نظام npm البيئي. من غير المحتمل إصلاح الأخطاء الموجودة في الميزات القديمة.

توخ الحذر عند استخدام الميزات التجريبية، خاصة عند تأليف المكتبات. قد لا يكون المستخدمون على دراية باستخدام الميزات التجريبية. قد تفاجئ الأخطاء أو تغييرات السلوك المستخدمين عند حدوث تعديلات على واجهة برمجة التطبيقات (API) التجريبية. لتجنب المفاجآت، قد يحتاج استخدام ميزة تجريبية إلى علامة سطر أوامر. قد تُصدر الميزات التجريبية أيضًا [تحذيرًا](/ar/nodejs/api/process#event-warning).


## نظرة عامة على الاستقرار {#stability-overview}

| API | الاستقرار |
| --- | --- |
| [Assert](/ar/nodejs/api/assert) |<div class="custom-block tip"> (2) مستقر </div>|
| [Async hooks](/ar/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) تجريبي </div>|
| [Asynchronous context tracking](/ar/nodejs/api/async_context) |<div class="custom-block tip"> (2) مستقر </div>|
| [Buffer](/ar/nodejs/api/buffer) |<div class="custom-block tip"> (2) مستقر </div>|
| [Child process](/ar/nodejs/api/child_process) |<div class="custom-block tip"> (2) مستقر </div>|
| [Cluster](/ar/nodejs/api/cluster) |<div class="custom-block tip"> (2) مستقر </div>|
| [Console](/ar/nodejs/api/console) |<div class="custom-block tip"> (2) مستقر </div>|
| [Crypto](/ar/nodejs/api/crypto) |<div class="custom-block tip"> (2) مستقر </div>|
| [Diagnostics Channel](/ar/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) مستقر </div>|
| [DNS](/ar/nodejs/api/dns) |<div class="custom-block tip"> (2) مستقر </div>|
| [Domain](/ar/nodejs/api/domain) |<div class="custom-block danger"> (0) مهمل </div>|
| [File system](/ar/nodejs/api/fs) |<div class="custom-block tip"> (2) مستقر </div>|
| [HTTP](/ar/nodejs/api/http) |<div class="custom-block tip"> (2) مستقر </div>|
| [HTTP/2](/ar/nodejs/api/http2) |<div class="custom-block tip"> (2) مستقر </div>|
| [HTTPS](/ar/nodejs/api/https) |<div class="custom-block tip"> (2) مستقر </div>|
| [Inspector](/ar/nodejs/api/inspector) |<div class="custom-block tip"> (2) مستقر </div>|
| [Modules: `node:module` API](/ar/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - مرشح الإصدار (نسخة غير متزامنة) الاستقرار: 1.1 - تطوير نشط (نسخة متزامنة) </div>|
| [Modules: CommonJS modules](/ar/nodejs/api/modules) |<div class="custom-block tip"> (2) مستقر </div>|
| [Modules: TypeScript](/ar/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - تطوير نشط </div>|
| [OS](/ar/nodejs/api/os) |<div class="custom-block tip"> (2) مستقر </div>|
| [Path](/ar/nodejs/api/path) |<div class="custom-block tip"> (2) مستقر </div>|
| [Performance measurement APIs](/ar/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) مستقر </div>|
| [Punycode](/ar/nodejs/api/punycode) |<div class="custom-block danger"> (0) مهمل </div>|
| [Query string](/ar/nodejs/api/querystring) |<div class="custom-block tip"> (2) مستقر </div>|
| [Readline](/ar/nodejs/api/readline) |<div class="custom-block tip"> (2) مستقر </div>|
| [REPL](/ar/nodejs/api/repl) |<div class="custom-block tip"> (2) مستقر </div>|
| [Single executable applications](/ar/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - تطوير نشط </div>|
| [SQLite](/ar/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - تطوير نشط. </div>|
| [Stream](/ar/nodejs/api/stream) |<div class="custom-block tip"> (2) مستقر </div>|
| [String decoder](/ar/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) مستقر </div>|
| [Test runner](/ar/nodejs/api/test) |<div class="custom-block tip"> (2) مستقر </div>|
| [Timers](/ar/nodejs/api/timers) |<div class="custom-block tip"> (2) مستقر </div>|
| [TLS (SSL)](/ar/nodejs/api/tls) |<div class="custom-block tip"> (2) مستقر </div>|
| [Trace events](/ar/nodejs/api/tracing) |<div class="custom-block warning"> (1) تجريبي </div>|
| [TTY](/ar/nodejs/api/tty) |<div class="custom-block tip"> (2) مستقر </div>|
| [UDP/datagram sockets](/ar/nodejs/api/dgram) |<div class="custom-block tip"> (2) مستقر </div>|
| [URL](/ar/nodejs/api/url) |<div class="custom-block tip"> (2) مستقر </div>|
| [Util](/ar/nodejs/api/util) |<div class="custom-block tip"> (2) مستقر </div>|
| [VM (executing JavaScript)](/ar/nodejs/api/vm) |<div class="custom-block tip"> (2) مستقر </div>|
| [Web Crypto API](/ar/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) مستقر </div>|
| [Web Streams API](/ar/nodejs/api/webstreams) |<div class="custom-block tip"> (2) مستقر </div>|
| [WebAssembly System Interface (WASI)](/ar/nodejs/api/wasi) |<div class="custom-block warning"> (1) تجريبي </div>|
| [Worker threads](/ar/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) مستقر </div>|
| [Zlib](/ar/nodejs/api/zlib) |<div class="custom-block tip"> (2) مستقر </div>|

## JSON output {#json-output}

**أُضيف في: v0.6.12**

كل مستند `.html` لديه مستند `.json` مطابق له. هذا مخصص لبيئات التطوير المتكاملة (IDEs) والأدوات المساعدة الأخرى التي تستهلك الوثائق.

## استدعاءات النظام وصفحات الدليل (man pages) {#system-calls-and-man-pages}

ستقوم دوال Node.js التي تغلف استدعاء نظام بتوثيق ذلك. ترتبط الوثائق بصفحات الدليل (man pages) المطابقة التي تصف كيفية عمل استدعاء النظام.

معظم استدعاءات نظام Unix لها نظائر في Windows. ومع ذلك، قد تكون اختلافات السلوك أمرًا لا مفر منه.

