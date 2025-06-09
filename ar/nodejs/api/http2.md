---
title: توثيق Node.js - HTTP/2
description: توفر هذه الصفحة توثيقًا شاملاً لوحدة HTTP/2 في Node.js، تتناول واجهتها البرمجية (API)، والاستخدام، وأمثلة لتطبيق خوادم وعملاء HTTP/2.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر هذه الصفحة توثيقًا شاملاً لوحدة HTTP/2 في Node.js، تتناول واجهتها البرمجية (API)، والاستخدام، وأمثلة لتطبيق خوادم وعملاء HTTP/2.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر هذه الصفحة توثيقًا شاملاً لوحدة HTTP/2 في Node.js، تتناول واجهتها البرمجية (API)، والاستخدام، وأمثلة لتطبيق خوادم وعملاء HTTP/2.
---


# HTTP/2 {#http/2}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن الآن إرسال/استقبال الطلبات مع رأس `host` (مع أو بدون `:authority`). |
| v15.3.0, v14.17.0 | من الممكن إلغاء الطلب باستخدام AbortSignal. |
| v10.10.0 | أصبح HTTP/2 الآن مستقرًا. كان تجريبيًا في السابق. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

توفر الوحدة `node:http2` تطبيقًا لبروتوكول [HTTP/2](https://tools.ietf.org/html/rfc7540). يمكن الوصول إليه باستخدام:

```js [ESM]
const http2 = require('node:http2');
```
## تحديد ما إذا كان دعم التشفير غير متاح {#determining-if-crypto-support-is-unavailable}

من الممكن إنشاء Node.js دون تضمين دعم الوحدة `node:crypto`. في مثل هذه الحالات، محاولة `import` من `node:http2` أو استدعاء `require('node:http2')` سيؤدي إلى حدوث خطأ.

عند استخدام CommonJS، يمكن التقاط الخطأ الذي يتم طرحه باستخدام try/catch:

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```
عند استخدام الكلمة المفتاحية ESM المعجمية `import`، لا يمكن التقاط الخطأ إلا إذا تم تسجيل معالج لـ `process.on('uncaughtException')` *قبل* أي محاولة لتحميل الوحدة (باستخدام، على سبيل المثال، وحدة التحميل المسبق).

عند استخدام ESM، إذا كانت هناك فرصة لتشغيل التعليمات البرمجية على إصدار من Node.js حيث لم يتم تمكين دعم التشفير، ففكر في استخدام الدالة [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) بدلاً من الكلمة المفتاحية المعجمية `import`:

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```
## واجهة برمجة التطبيقات الأساسية {#core-api}

توفر واجهة برمجة التطبيقات الأساسية واجهة منخفضة المستوى مصممة خصيصًا لدعم ميزات بروتوكول HTTP/2. وهي *غير* مصممة تحديدًا للتوافق مع واجهة برمجة التطبيقات [HTTP/1](/ar/nodejs/api/http) الموجودة. ومع ذلك، فإن [واجهة برمجة التطبيقات للتوافق](/ar/nodejs/api/http2#compatibility-api) كذلك.

تعتبر واجهة برمجة التطبيقات الأساسية `http2` أكثر تماثلًا بين العميل والخادم من واجهة برمجة التطبيقات `http`. على سبيل المثال، يمكن إصدار معظم الأحداث، مثل `'error'` و `'connect'` و `'stream'`، إما عن طريق التعليمات البرمجية من جانب العميل أو التعليمات البرمجية من جانب الخادم.


### مثال من جانب الخادم {#server-side-example}

يوضح ما يلي مثالًا بسيطًا لخادم HTTP/2 باستخدام واجهة برمجة التطبيقات الأساسية. نظرًا لعدم وجود متصفحات معروفة تدعم [HTTP/2 غير المشفر](https://http2.github.io/faq/#does-http2-require-encryption)، فإن استخدام [`http2.createSecureServer()`](/ar/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) ضروري عند التواصل مع عملاء المتصفح.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

لإنشاء الشهادة والمفتاح لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### مثال من جانب العميل {#client-side-example}

يوضح ما يلي عميل HTTP/2:

::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### الفئة: `Http2Session` {#class-http2session}

**تمت الإضافة في: v8.4.0**

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

تمثل مثيلات الفئة `http2.Http2Session` جلسة اتصالات نشطة بين عميل وخادم HTTP/2. ليس من المفترض أن يتم إنشاء مثيلات هذه الفئة مباشرةً بواسطة كود المستخدم.

ستظهر كل نسخة `Http2Session` سلوكيات مختلفة قليلاً اعتمادًا على ما إذا كانت تعمل كخادم أو كعميل. يمكن استخدام الخاصية `http2session.type` لتحديد الوضع الذي تعمل فيه `Http2Session`. من جانب الخادم، نادرًا ما يكون لدى كود المستخدم فرصة للعمل مع كائن `Http2Session` مباشرةً، حيث يتم اتخاذ معظم الإجراءات عادةً من خلال التفاعلات مع كائنات `Http2Server` أو `Http2Stream`.

لن يقوم كود المستخدم بإنشاء مثيلات `Http2Session` مباشرةً. يتم إنشاء مثيلات `Http2Session` من جانب الخادم بواسطة نسخة `Http2Server` عند استقبال اتصال HTTP/2 جديد. يتم إنشاء مثيلات `Http2Session` من جانب العميل باستخدام الطريقة `http2.connect()`.

#### `Http2Session` والمقابس (sockets) {#http2session-and-sockets}

يرتبط كل مثيل `Http2Session` بمقبس [`net.Socket`](/ar/nodejs/api/net#class-netsocket) أو [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) واحد بالضبط عند إنشائه. عندما يتم تدمير `Socket` أو `Http2Session`، سيتم تدمير كلاهما.

نظرًا لمتطلبات التسلسل والمعالجة المحددة التي يفرضها بروتوكول HTTP/2، لا يُنصح كود المستخدم بقراءة البيانات من أو كتابة البيانات إلى نسخة `Socket` مرتبطة بـ `Http2Session`. قد يؤدي القيام بذلك إلى وضع جلسة HTTP/2 في حالة غير محددة مما يتسبب في أن تصبح الجلسة والمقبس غير قابلين للاستخدام.

بمجرد ربط `Socket` بـ `Http2Session`، يجب أن يعتمد كود المستخدم فقط على واجهة برمجة التطبيقات (API) الخاصة بـ `Http2Session`.

#### الحدث: `'close'` {#event-close}

**تمت الإضافة في: v8.4.0**

يتم إطلاق الحدث `'close'` بمجرد تدمير `Http2Session`. لا يتوقع المستمع الخاص به أي وسيطات.

#### الحدث: `'connect'` {#event-connect}

**تمت الإضافة في: v8.4.0**

- `session` [\<Http2Session\>](/ar/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يتم إطلاق الحدث `'connect'` بمجرد اتصال `Http2Session` بنجاح بالنظير البعيد ويمكن أن تبدأ الاتصالات.

عادةً لن يستمع كود المستخدم لهذا الحدث مباشرةً.


#### الحدث: `'error'` {#event-error}

**أضيف في: الإصدار v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يصدر الحدث `'error'` عند وقوع خطأ أثناء معالجة `Http2Session`.

#### الحدث: `'frameError'` {#event-frameerror}

**أضيف في: الإصدار v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) نوع الإطار.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز الخطأ.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف الدفق (أو `0` إذا لم يكن الإطار مرتبطًا بدفق).

يصدر الحدث `'frameError'` عند وقوع خطأ أثناء محاولة إرسال إطار على الجلسة. إذا كان الإطار الذي تعذر إرساله مرتبطًا بـ `Http2Stream` محدد، فستتم محاولة إصدار حدث `'frameError'` على `Http2Stream`.

إذا كان الحدث `'frameError'` مرتبطًا بدفق، فسيتم إغلاق الدفق وتدميره مباشرة بعد حدث `'frameError'`. إذا لم يكن الحدث مرتبطًا بدفق، فسيتم إيقاف تشغيل `Http2Session` مباشرة بعد حدث `'frameError'`.

#### الحدث: `'goaway'` {#event-goaway}

**أضيف في: الإصدار v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز خطأ HTTP/2 المحدد في إطار `GOAWAY`.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف آخر دفق قام النظير البعيد بمعالجته بنجاح (أو `0` إذا لم يتم تحديد معرّف).
- `opaqueData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) إذا تم تضمين بيانات مبهمة إضافية في إطار `GOAWAY`، فسيتم تمرير مثيل `Buffer` يحتوي على تلك البيانات.

يصدر الحدث `'goaway'` عند استلام إطار `GOAWAY`.

سيتم إيقاف تشغيل مثيل `Http2Session` تلقائيًا عند إصدار حدث `'goaway'`.


#### الحدث: `'localSettings'` {#event-localsettings}

**تمت إضافته في: الإصدار v8.4.0**

- `settings` [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object) نسخة من إطار `SETTINGS` المستلم.

يتم إطلاق الحدث `'localSettings'` عند استلام إطار `SETTINGS` الخاص بالإقرار.

عند استخدام `http2session.settings()` لإرسال إعدادات جديدة، لا تدخل الإعدادات المعدلة حيز التنفيذ حتى يتم إطلاق الحدث `'localSettings'`.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* استخدم الإعدادات الجديدة */
});
```
#### الحدث: `'ping'` {#event-ping}

**تمت إضافته في: الإصدار v10.12.0**

- `payload` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) حمولة إطار `PING` المكونة من 8 بايت

يتم إطلاق الحدث `'ping'` كلما تم استلام إطار `PING` من النظير المتصل.

#### الحدث: `'remoteSettings'` {#event-remotesettings}

**تمت إضافته في: الإصدار v8.4.0**

- `settings` [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object) نسخة من إطار `SETTINGS` المستلم.

يتم إطلاق الحدث `'remoteSettings'` عند استلام إطار `SETTINGS` جديد من النظير المتصل.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* استخدم الإعدادات الجديدة */
});
```
#### الحدث: `'stream'` {#event-stream}

**تمت إضافته في: الإصدار v8.4.0**

- `stream` [\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream) مرجع إلى التدفق
- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object) كائن يصف الرؤوس
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العلامات الرقمية المرتبطة
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة تحتوي على أسماء الرؤوس الأولية متبوعة بالقيم الخاصة بها.

يتم إطلاق الحدث `'stream'` عند إنشاء `Http2Stream` جديد.

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
من جانب الخادم، لن يستمع رمز المستخدم عادةً لهذا الحدث مباشرةً، وبدلاً من ذلك سيسجل معالجًا للحدث `'stream'` الذي يتم إطلاقه بواسطة مثيلات `net.Server` أو `tls.Server` التي يتم إرجاعها بواسطة `http2.createServer()` و `http2.createSecureServer()`، على التوالي، كما في المثال أدناه:



::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// إنشاء خادم HTTP/2 غير مشفر
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// إنشاء خادم HTTP/2 غير مشفر
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

على الرغم من أن تدفقات HTTP/2 ومآخذ الشبكة ليست في تطابق 1: 1، إلا أن خطأ الشبكة سيدمر كل تدفق فردي ويجب التعامل معه على مستوى التدفق، كما هو موضح أعلاه.


#### الحدث: `'timeout'` {#event-timeout}

**أضيف في: v8.4.0**

بعد استخدام طريقة `http2session.setTimeout()` لتعيين فترة المهلة الزمنية لـ `Http2Session` هذا، يتم إصدار الحدث `'timeout'` إذا لم يكن هناك أي نشاط على `Http2Session` بعد العدد المحدد من المللي ثانية. لا يتوقع المستمع الخاص به أي وسيطات.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**أضيف في: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

ستكون القيمة `undefined` إذا لم يكن `Http2Session` متصلاً بعد بمقبس، أو `h2c` إذا لم يكن `Http2Session` متصلاً بـ `TLSSocket`، أو سيعيد قيمة الخاصية `alpnProtocol` الخاصة بـ `TLSSocket` المتصل.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**أضيف في: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يغلق `Http2Session` بأمان، مما يسمح لأي تدفقات موجودة بإكمال نفسها ومنع إنشاء مثيلات `Http2Stream` جديدة. بمجرد الإغلاق، *قد* يتم استدعاء `http2session.destroy()` إذا لم تكن هناك مثيلات `Http2Stream` مفتوحة.

إذا تم تحديده، يتم تسجيل الدالة `callback` كمعالج للحدث `'close'`.

#### `http2session.closed` {#http2sessionclosed}

**أضيف في: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

سيكون `true` إذا تم إغلاق مثيل `Http2Session` هذا، وإلا `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**أضيف في: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

سيكون `true` إذا كان مثيل `Http2Session` هذا لا يزال قيد الاتصال، وسيتم تعيينه على `false` قبل إصدار الحدث `connect` و/أو استدعاء رد الاتصال `http2.connect`.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**أضيف في: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) كائن `Error` إذا تم تدمير `Http2Session` بسبب خطأ.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز خطأ HTTP/2 لإرساله في إطار `GOAWAY` النهائي. إذا لم يتم تحديده، ولم يكن `error` غير معرف، فإن الافتراضي هو `INTERNAL_ERROR`، وإلا فإن الافتراضي هو `NO_ERROR`.

يقوم بإنهاء `Http2Session` و `net.Socket` أو `tls.TLSSocket` المرتبطين به على الفور.

بمجرد تدميره، سيصدر `Http2Session` الحدث `'close'`. إذا لم يكن `error` غير معرف، فسيتم إصدار حدث `'error'` مباشرة قبل الحدث `'close'`.

إذا كانت هناك أي `Http2Streams` مفتوحة متبقية مرتبطة بـ `Http2Session`، فسيتم تدميرها أيضًا.


#### `http2session.destroyed` {#http2sessiondestroyed}

**تمت الإضافة في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

سيكون `true` إذا تم تدمير مثيل `Http2Session` هذا ويجب عدم استخدامه بعد الآن، وإلا `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**تمت الإضافة في: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

القيمة `undefined` إذا لم يتم توصيل مقبس جلسة `Http2Session` بعد، و `true` إذا تم توصيل `Http2Session` بـ `TLSSocket`، و `false` إذا تم توصيل `Http2Session` بأي نوع آخر من المقابس أو التدفقات.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**تمت الإضافة في: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز خطأ HTTP/2
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المعرف الرقمي لآخر `Http2Stream` تمت معالجته
- `opaqueData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مثيل `TypedArray` أو `DataView` يحتوي على بيانات إضافية يتم حملها داخل إطار `GOAWAY`.

ينقل إطار `GOAWAY` إلى النظير المتصل *دون* إغلاق `Http2Session`.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**تمت الإضافة في: v8.4.0**

- [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object)

كائن بدون نموذج أولي يصف الإعدادات المحلية الحالية لهذا `Http2Session`. الإعدادات المحلية محلية لمثيل `Http2Session` *هذا*.

#### `http2session.originSet` {#http2sessionoriginset}

**تمت الإضافة في: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

إذا تم توصيل `Http2Session` بـ `TLSSocket`، فستعيد خاصية `originSet` `Array` من المصادر التي يمكن اعتبار `Http2Session` موثوقًا بها.

تتوفر خاصية `originSet` فقط عند استخدام اتصال TLS آمن.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**تمت الإضافة في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يشير إلى ما إذا كانت `Http2Session` تنتظر حاليًا إقرارًا بإطار `SETTINGS` مرسل. ستكون القيمة `true` بعد استدعاء طريقة `http2session.settings()`. ستكون القيمة `false` بمجرد الإقرار بجميع إطارات `SETTINGS` المرسلة.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.9.3 | تمت الإضافة في: v8.9.3 |
:::

- `payload` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) حمولة ping اختيارية.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يرسل إطار `PING` إلى نظير HTTP/2 المتصل. يجب توفير دالة `callback`. ستعيد الطريقة `true` إذا تم إرسال `PING`، و`false` بخلاف ذلك.

يتم تحديد الحد الأقصى لعدد عمليات ping المعلقة (غير المقر بها) بواسطة خيار التكوين `maxOutstandingPings`. الحد الأقصى الافتراضي هو 10.

إذا تم توفير `payload`، فيجب أن يكون `Buffer` أو `TypedArray` أو `DataView` يحتوي على 8 بايت من البيانات التي سيتم إرسالها مع `PING` وإرجاعها مع إقرار ping.

سيتم استدعاء رد النداء بثلاث وسيطات: وسيطة خطأ ستكون `null` إذا تم الإقرار بـ `PING` بنجاح، ووسيطة `duration` تُبلغ عن عدد المللي ثانية المنقضية منذ إرسال ping واستلام الإقرار، و`Buffer` يحتوي على حمولة `PING` المكونة من 8 بايت.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`تم الإقرار بـ Ping في ${duration} مللي ثانية`);
    console.log(`مع الحمولة '${payload.toString()}'`);
  }
});
```
إذا لم يتم تحديد وسيطة `payload`، فستكون الحمولة الافتراضية هي الطابع الزمني 64 بت (little endian) الذي يحدد بداية مدة `PING`.


#### `http2session.ref()` {#http2sessionref}

**تمت إضافته في:** v9.4.0

يستدعي [`ref()`](/ar/nodejs/api/net#socketref) على مثيل `Http2Session` الأساسي [`net.Socket`](/ar/nodejs/api/net#class-netsocket).

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**تمت إضافته في:** v8.4.0

- [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object)

كائن بدون نموذج أولي يصف الإعدادات البعيدة الحالية لهذا `Http2Session`. يتم تعيين الإعدادات البعيدة بواسطة نظير HTTP/2 *المتصل*.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**تمت إضافته في:** v15.3.0, v14.18.0

- `windowSize` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يضبط حجم النافذة للنقطة الطرفية المحلية. `windowSize` هو إجمالي حجم النافذة المراد تعيينه، وليس دلتا.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

بالنسبة لعملاء http2، الحدث المناسب هو إما `'connect'` أو `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد اتصال غير صالحة إلى وسيط `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.4.0 | تمت إضافته في: v8.4.0 |
:::

- `msecs` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

تُستخدم لتعيين دالة رد اتصال يتم استدعاؤها عندما لا يكون هناك نشاط على `Http2Session` بعد مرور `msecs` من المللي ثانية. يتم تسجيل `callback` المعطاة كمستمع على حدث `'timeout'`.


#### `http2session.socket` {#http2sessionsocket}

**أُضيف في: الإصدار v8.4.0**

- [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

يُرجع كائن `Proxy` يعمل كـ `net.Socket` (أو `tls.TLSSocket`) ولكنه يقتصر على الطرق المتاحة على الطرق الآمنة للاستخدام مع HTTP/2.

ستُطلق `destroy` و `emit` و `end` و `pause` و `read` و `resume` و `write` خطأً برمز `ERR_HTTP2_NO_SOCKET_MANIPULATION`. راجع [`Http2Session` والمقابس](/ar/nodejs/api/http2#http2session-and-sockets) لمزيد من المعلومات.

سيتم استدعاء طريقة `setTimeout` على `Http2Session` هذه.

سيتم توجيه جميع التفاعلات الأخرى مباشرةً إلى المقبس.

#### `http2session.state` {#http2sessionstate}

**أُضيف في: الإصدار v8.4.0**

يوفر معلومات متنوعة حول الحالة الحالية لـ `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم نافذة التحكم في التدفق المحلي (الاستقبال) الحالي لـ `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الحالي للبايتات التي تم استقبالها منذ آخر `WINDOW_UPDATE` للتحكم في التدفق.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المعرف الرقمي الذي سيتم استخدامه في المرة القادمة التي يتم فيها إنشاء `Http2Stream` جديد بواسطة `Http2Session` هذه.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يمكن للنظير البعيد إرسالها دون تلقي `WINDOW_UPDATE`.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المعرف الرقمي لـ `Http2Stream` الذي تم استقبال إطار `HEADERS` أو `DATA` له مؤخرًا.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يمكن لـ `Http2Session` هذه إرسالها دون تلقي `WINDOW_UPDATE`.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الإطارات الموجودة حاليًا داخل قائمة الانتظار الصادرة لـ `Http2Session` هذه.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحجم الحالي بالبايتات لجدول حالة ضغط الرأس الصادر.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحجم الحالي بالبايتات لجدول حالة ضغط الرأس الوارد.

كائن يصف الحالة الحالية لـ `Http2Session` هذه.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `settings` [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object)
- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد نداء يتم استدعاؤه بمجرد توصيل الجلسة أو على الفور إذا كانت الجلسة متصلة بالفعل.
    - `err` [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<فارغ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object) كائن `settings` المحدث.
    - `duration` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

يقوم بتحديث الإعدادات المحلية الحالية لـ `Http2Session` هذه ويرسل إطار `SETTINGS` جديدًا إلى نظير HTTP/2 المتصل.

بمجرد استدعاء هذه الدالة، ستكون الخاصية `http2session.pendingSettingsAck` قيمتها `true` بينما تنتظر الجلسة حتى يقر النظير البعيد بالإعدادات الجديدة.

لن تصبح الإعدادات الجديدة سارية المفعول حتى يتم تلقي إقرار `SETTINGS` وإصدار الحدث `'localSettings'`. من الممكن إرسال إطارات `SETTINGS` متعددة أثناء انتظار الإقرار.

#### `http2session.type` {#http2sessiontype}

**تمت الإضافة في: v8.4.0**

- [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

سيكون `http2session.type` مساويًا لـ `http2.constants.NGHTTP2_SESSION_SERVER` إذا كان مثيل `Http2Session` هذا هو خادم، و `http2.constants.NGHTTP2_SESSION_CLIENT` إذا كان المثيل عميلًا.

#### `http2session.unref()` {#http2sessionunref}

**تمت الإضافة في: v9.4.0**

يستدعي [`unref()`](/ar/nodejs/api/net#socketunref) على [`net.Socket`](/ar/nodejs/api/net#class-netsocket) الأساسي لمثيل `Http2Session` هذا.


### الفئة: `ServerHttp2Session` {#class-serverhttp2session}

**تمت إضافتها في: v8.4.0**

- تمتد: [\<Http2Session\>](/ar/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**تمت إضافتها في: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) وصف لتكوين الخدمة البديلة كما هو محدد بواسطة [RFC 7838](https://tools.ietf.org/html/rfc7838).
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إما سلسلة URL تحدد الأصل (أو `Object` مع خاصية `origin`) أو المعرف الرقمي لـ `Http2Stream` النشطة كما هو معطى بواسطة خاصية `http2stream.id`.

يرسل إطار `ALTSVC` (كما هو محدد بواسطة [RFC 7838](https://tools.ietf.org/html/rfc7838)) إلى العميل المتصل.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

يشير إرسال إطار `ALTSVC` بمعرف تدفق محدد إلى أن الخدمة البديلة مرتبطة بأصل `Http2Stream` المعطى.

يجب أن تحتوي سلسلة `alt` والأصل *فقط* على بايتات ASCII ويتم تفسيرها بدقة كسلسلة من بايتات ASCII. يمكن تمرير القيمة الخاصة `'clear'` لمسح أي خدمة بديلة تم تعيينها مسبقًا لنطاق معين.

عندما يتم تمرير سلسلة للوسيطة `originOrStream`، سيتم تحليلها كعنوان URL وسيتم اشتقاق الأصل. على سبيل المثال، أصل عنوان URL HTTP `'https://example.org/foo/bar'` هو سلسلة ASCII `'https://example.org'`. سيتم طرح خطأ إذا تعذر تحليل السلسلة المعطاة كعنوان URL أو إذا تعذر اشتقاق أصل صالح.

يمكن تمرير كائن `URL`، أو أي كائن له خاصية `origin`، كوسيطة `originOrStream`، وفي هذه الحالة سيتم استخدام قيمة الخاصية `origin`. يجب أن تكون قيمة الخاصية `origin` أصل ASCII مُسلسل بشكل صحيح.


#### تحديد الخدمات البديلة {#specifying-alternative-services}

يتم تعريف تنسيق المعلمة `alt` بشكل صارم بواسطة [RFC 7838](https://tools.ietf.org/html/rfc7838) كسلسلة ASCII تحتوي على قائمة مفصولة بفواصل من بروتوكولات "بديلة" مرتبطة بمضيف ومنفذ معينين.

على سبيل المثال، تشير القيمة `'h2="example.org:81"'` إلى أن بروتوكول HTTP/2 متاح على المضيف `'example.org'` على منفذ TCP/IP رقم 81. *يجب* أن يكون المضيف والمنفذ داخل علامتي الاقتباس (`"`).

يمكن تحديد بدائل متعددة، على سبيل المثال: `'h2="example.org:81", h2=":82"'`.

يمكن أن يكون معرف البروتوكول (`'h2'` في الأمثلة) أي [معرف بروتوكول ALPN](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) صالح.

لا يتم التحقق من صحة بناء جملة هذه القيم بواسطة تطبيق Node.js ويتم تمريرها كما هي مقدمة من المستخدم أو مستلمة من النظير.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**تمت الإضافة في: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) سلسلة عنوان URL واحد أو أكثر يتم تمريرها كوسيطات منفصلة.

يرسل إطار `ORIGIN` (كما هو محدد بواسطة [RFC 8336](https://tools.ietf.org/html/rfc8336)) إلى العميل المتصل للإعلان عن مجموعة المصادر التي يمكن للخادم تقديم استجابات موثوقة لها.



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

عندما يتم تمرير سلسلة كـ `origin`، سيتم تحليلها كعنوان URL وسيتم اشتقاق الأصل. على سبيل المثال، أصل عنوان URL HTTP `'https://example.org/foo/bar'` هو سلسلة ASCII `'https://example.org'`. سيتم طرح خطأ إذا تعذر تحليل السلسلة المعطاة كعنوان URL أو إذا تعذر اشتقاق أصل صالح.

يمكن تمرير كائن `URL`، أو أي كائن له خاصية `origin`، كـ `origin`، وفي هذه الحالة سيتم استخدام قيمة الخاصية `origin`. *يجب* أن تكون قيمة الخاصية `origin` أصل ASCII مُسلسل بشكل صحيح.

بدلاً من ذلك، يمكن استخدام الخيار `origins` عند إنشاء خادم HTTP/2 جديد باستخدام طريقة `http2.createSecureServer()`:



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### الفئة: `ClientHttp2Session` {#class-clienthttp2session}

**أضيف في: v8.4.0**

- يمتد: [\<Http2Session\>](/ar/nodejs/api/http2#class-http2session)

#### الحدث: `'altsvc'` {#event-altsvc}

**أضيف في: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم إطلاق الحدث `'altsvc'` كلما استقبل العميل إطار `ALTSVC`. يتم إطلاق الحدث مع قيمة `ALTSVC` والأصل ومعرّف التدفق. إذا لم يتم توفير `origin` في إطار `ALTSVC`، فسيكون `origin` سلسلة فارغة.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### الحدث: `'origin'` {#event-origin}

**أضيف في: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يتم إطلاق الحدث `'origin'` كلما استقبل العميل إطار `ORIGIN`. يتم إطلاق الحدث مع مجموعة من سلاسل `origin`. سيتم تحديث `http2session.originSet` لتضمين الأصول المستلمة.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

يتم إطلاق الحدث `'origin'` فقط عند استخدام اتصال TLS آمن.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**تمت الإضافة في: v8.4.0**

-  `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object) 
-  `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `endStream` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان يجب إغلاق الجانب *القابل للكتابة* من `Http2Stream` مبدئيًا، مثل إرسال طلب `GET` لا يتوقع وجود نص حمولة.
    - `exclusive` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true` و`parent` تحدد Stream أب، يتم جعل الدفق الذي تم إنشاؤه التابع المباشر الوحيد للأصل، مع جعل جميع التوابع الموجودة الأخرى تابعة للدفق الذي تم إنشاؤه حديثًا. **الافتراضي:** `false`.
    - `parent` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد المعرف الرقمي لدفق يعتمد عليه الدفق الذي تم إنشاؤه حديثًا.
    - `weight` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد التبعية النسبية لدفق بالنسبة إلى التدفقات الأخرى التي لها نفس `parent`. القيمة هي رقم بين `1` و `256` (شاملة).
    - `waitForTrailers` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، سيصدر `Http2Stream` الحدث `'wantTrailers'` بعد إرسال إطار `DATA` النهائي.
    - `signal` [\<إشارة إجهاض\>](/ar/nodejs/api/globals#class-abortsignal) إشارة إجهاض يمكن استخدامها لإجهاض طلب قيد التقدم.
  
 
-  الإرجاع: [\<ClientHttp2Stream\>](/ar/nodejs/api/http2#class-clienthttp2stream) 

بالنسبة لمثيلات `Http2Session` الخاصة بعميل HTTP/2 فقط، يقوم `http2session.request()` بإنشاء وإرجاع مثيل `Http2Stream` يمكن استخدامه لإرسال طلب HTTP/2 إلى الخادم المتصل.

عندما يتم إنشاء `ClientHttp2Session` لأول مرة، قد لا يكون المقبس متصلاً بعد. إذا تم استدعاء `clienthttp2session.request()` خلال هذا الوقت، فسيتم تأجيل الطلب الفعلي حتى يصبح المقبس جاهزًا للعمل. إذا تم إغلاق `session` قبل تنفيذ الطلب الفعلي، فسيتم طرح `ERR_HTTP2_GOAWAY_SESSION`.

هذه الطريقة متاحة فقط إذا كان `http2session.type` يساوي `http2.constants.NGHTTP2_SESSION_CLIENT`.



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

عندما يتم تعيين الخيار `options.waitForTrailers`، يتم إصدار الحدث `'wantTrailers'` مباشرة بعد وضع آخر جزء من بيانات الحمولة في قائمة الانتظار لإرسالها. يمكن بعد ذلك استدعاء الطريقة `http2stream.sendTrailers()` لإرسال رؤوس مقطورة إلى النظير.

عندما يتم تعيين `options.waitForTrailers`، فلن يتم إغلاق `Http2Stream` تلقائيًا عند إرسال إطار `DATA` النهائي. يجب على كود المستخدم استدعاء `http2stream.sendTrailers()` أو `http2stream.close()` لإغلاق `Http2Stream`.

عندما يتم تعيين `options.signal` مع `AbortSignal` ثم يتم استدعاء `abort` على `AbortController` المقابل، سيصدر الطلب حدث `'error'` مع خطأ `AbortError`.

لا يتم تحديد الرؤوس الزائفة `:method` و `:path` داخل `headers`، وبشكل افتراضي تكون:

- `:method` = `'GET'`
- `:path` = `/`


### الفئة: `Http2Stream` {#class-http2stream}

**تمت إضافتها في: v8.4.0**

- تمتد: [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يمثل كل مثيل من فئة `Http2Stream` دفق اتصالات HTTP/2 ثنائي الاتجاه عبر مثيل `Http2Session`. يمكن أن يكون لأي `Http2Session` واحد ما يصل إلى 2-1 مثيل `Http2Stream` على مدار عمره.

لن يقوم رمز المستخدم بإنشاء مثيلات `Http2Stream` مباشرةً. بدلاً من ذلك، يتم إنشاؤها وإدارتها وتزويدها لرمز المستخدم من خلال مثيل `Http2Session`. على الخادم، يتم إنشاء مثيلات `Http2Stream` إما استجابةً لطلب HTTP وارد (وتسليمه إلى رمز المستخدم عبر حدث `'stream'`)، أو استجابةً لطلب استدعاء طريقة `http2stream.pushStream()`. على العميل، يتم إنشاء مثيلات `Http2Stream` وإرجاعها عند استدعاء طريقة `http2session.request()`، أو استجابةً لحدث `'push'` وارد.

فئة `Http2Stream` هي أساس للفئتين [`ServerHttp2Stream`](/ar/nodejs/api/http2#class-serverhttp2stream) و [`ClientHttp2Stream`](/ar/nodejs/api/http2#class-clienthttp2stream)، اللتين تستخدم كل منهما تحديدًا إما من جانب الخادم أو العميل، على التوالي.

جميع مثيلات `Http2Stream` هي تدفقات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex). يتم استخدام الجانب `Writable` من `Duplex` لإرسال البيانات إلى النظير المتصل، بينما يتم استخدام الجانب `Readable` لتلقي البيانات المرسلة من قبل النظير المتصل.

ترميز الأحرف النصية الافتراضي لـ `Http2Stream` هو UTF-8. عند استخدام `Http2Stream` لإرسال نص، استخدم رأس `'content-type'` لتعيين ترميز الأحرف.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### دورة حياة `Http2Stream` {#http2stream-lifecycle}

##### الإنشاء {#creation}

على جانب الخادم، يتم إنشاء مثيلات [`ServerHttp2Stream`](/ar/nodejs/api/http2#class-serverhttp2stream) إما عندما:

- يتم استقبال إطار `HEADERS` HTTP/2 جديد بمعرف دفق غير مستخدم سابقًا؛
- يتم استدعاء طريقة `http2stream.pushStream()`.

على جانب العميل، يتم إنشاء مثيلات [`ClientHttp2Stream`](/ar/nodejs/api/http2#class-clienthttp2stream) عند استدعاء طريقة `http2session.request()`.

على العميل، قد لا يكون مثيل `Http2Stream` الذي تم إرجاعه بواسطة `http2session.request()` جاهزًا للاستخدام على الفور إذا لم يتم إنشاء `Http2Session` الأصلية بالكامل بعد. في مثل هذه الحالات، سيتم تخزين العمليات التي تم استدعاؤها على `Http2Stream` مؤقتًا حتى يتم إصدار حدث `'ready'`. نادرًا ما يحتاج رمز المستخدم إلى التعامل مع حدث `'ready'` مباشرةً. يمكن تحديد حالة الاستعداد لـ `Http2Stream` عن طريق التحقق من قيمة `http2stream.id`. إذا كانت القيمة `undefined`، فهذا يعني أن الدفق غير جاهز للاستخدام بعد.


##### التدمير {#destruction}

يتم تدمير جميع مثيلات [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) إما عندما:

- يتم استقبال إطار `RST_STREAM` للدفق بواسطة النظير المتصل، و (لتيارات العميل فقط) تم قراءة البيانات المعلقة.
- يتم استدعاء طريقة `http2stream.close()`، و (لتيارات العميل فقط) تم قراءة البيانات المعلقة.
- يتم استدعاء طريقتي `http2stream.destroy()` أو `http2session.destroy()`.

عندما يتم تدمير مثيل `Http2Stream`، ستتم محاولة إرسال إطار `RST_STREAM` إلى النظير المتصل.

عندما يتم تدمير مثيل `Http2Stream`، سيتم إصدار حدث `'close'`. نظرًا لأن `Http2Stream` هو مثيل لـ `stream.Duplex`، فسيتم أيضًا إصدار حدث `'end'` إذا كانت بيانات الدفق تتدفق حاليًا. قد يتم أيضًا إصدار حدث `'error'` إذا تم استدعاء `http2stream.destroy()` مع تمرير `Error` كمعامل أول.

بعد تدمير `Http2Stream`، ستكون خاصية `http2stream.destroyed` هي `true` وستحدد خاصية `http2stream.rstCode` رمز خطأ `RST_STREAM`. لم يعد مثيل `Http2Stream` قابلاً للاستخدام بمجرد تدميره.

#### الحدث: `'aborted'` {#event-aborted}

**تمت الإضافة في: v8.4.0**

يتم إصدار حدث `'aborted'` متى تم إجهاض مثيل `Http2Stream` بشكل غير طبيعي في منتصف الاتصال. لا يتوقع المستمع الخاص به أي وسيطات.

سيتم إصدار حدث `'aborted'` فقط إذا لم يتم إنهاء الجانب القابل للكتابة من `Http2Stream`.

#### الحدث: `'close'` {#event-close_1}

**تمت الإضافة في: v8.4.0**

يتم إصدار حدث `'close'` عند تدمير `Http2Stream`. بمجرد إصدار هذا الحدث، لم يعد مثيل `Http2Stream` قابلاً للاستخدام.

يمكن استرداد رمز خطأ HTTP/2 المستخدم عند إغلاق الدفق باستخدام خاصية `http2stream.rstCode`. إذا كان الرمز أي قيمة أخرى غير `NGHTTP2_NO_ERROR` (`0`)، فسيتم إصدار حدث `'error'` أيضًا.

#### الحدث: `'error'` {#event-error_1}

**تمت الإضافة في: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إصدار حدث `'error'` عند حدوث خطأ أثناء معالجة `Http2Stream`.


#### الحدث: `'frameError'` {#event-frameerror_1}

**تمت إضافته في: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) نوع الإطار.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز الخطأ.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف الدفق (أو `0` إذا لم يكن الإطار مرتبطًا بدفق).

يتم إطلاق الحدث `'frameError'` عندما يحدث خطأ أثناء محاولة إرسال إطار. عند الاستدعاء، ستتلقى دالة المعالج وسيطة عدد صحيح تحدد نوع الإطار، ووسيطة عدد صحيح تحدد رمز الخطأ. سيتم تدمير مثيل `Http2Stream` فورًا بعد إطلاق الحدث `'frameError'`.

#### الحدث: `'ready'` {#event-ready}

**تمت إضافته في: v8.4.0**

يتم إطلاق الحدث `'ready'` عندما يتم فتح `Http2Stream`، وتعيين `id` له، ويمكن استخدامه. لا يتوقع المستمع أي وسيطات.

#### الحدث: `'timeout'` {#event-timeout_1}

**تمت إضافته في: v8.4.0**

يتم إطلاق الحدث `'timeout'` بعد عدم تلقي أي نشاط لهذا `Http2Stream` خلال عدد المللي ثانية المحدد باستخدام `http2stream.setTimeout()`. لا يتوقع المستمع الخاص به أي وسيطات.

#### الحدث: `'trailers'` {#event-trailers}

**تمت إضافته في: v8.4.0**

- `headers` [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object) كائن يصف الرؤوس
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العلامات الرقمية المرتبطة

يتم إطلاق الحدث `'trailers'` عندما يتم استلام كتلة من الرؤوس المرتبطة بحقول الرأس اللاحقة. يتم تمرير رد نداء المستمع [كائن رؤوس HTTP/2](/ar/nodejs/api/http2#headers-object) والعلامات المرتبطة بالرؤوس.

قد لا يتم إطلاق هذا الحدث إذا تم استدعاء `http2stream.end()` قبل استلام المقطورات وعدم قراءة البيانات الواردة أو الاستماع إليها.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### الحدث: `'wantTrailers'` {#event-wanttrailers}

**أضيف في: v10.0.0**

يتم إصدار الحدث `'wantTrailers'` عندما يقوم `Http2Stream` بوضع إطار `DATA` الأخير في قائمة الانتظار ليتم إرساله في إطار ويكون `Http2Stream` جاهزًا لإرسال رؤوس المقطورة. عند بدء طلب أو استجابة، يجب تعيين الخيار `waitForTrailers` ليتم إصدار هذا الحدث.

#### `http2stream.aborted` {#http2streamaborted}

**أضيف في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم تعيينه على `true` إذا تم إجهاض مثيل `Http2Stream` بشكل غير طبيعي. عند التعيين، سيتم إصدار الحدث `'aborted'`.

#### `http2stream.bufferSize` {#http2streambuffersize}

**أضيف في: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يعرض هذا الخاصية عدد الأحرف المخزنة مؤقتًا حاليًا ليتم كتابتها. راجع [`net.Socket.bufferSize`](/ar/nodejs/api/net#socketbuffersize) للحصول على التفاصيل.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى الوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.4.0 | أضيف في: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد صحيح غير موقع 32 بت يحدد رمز الخطأ. **افتراضي:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة اختيارية مسجلة للاستماع إلى الحدث `'close'`.

يغلق مثيل `Http2Stream` عن طريق إرسال إطار `RST_STREAM` إلى نظير HTTP/2 المتصل.

#### `http2stream.closed` {#http2streamclosed}

**أضيف في: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم تعيينه على `true` إذا تم إغلاق مثيل `Http2Stream`.

#### `http2stream.destroyed` {#http2streamdestroyed}

**أضيف في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم تعيينه على `true` إذا تم تدمير مثيل `Http2Stream` ولم يعد قابلاً للاستخدام.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**تمت الإضافة في: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم تعيين القيمة إلى `true` إذا تم تعيين علامة `END_STREAM` في إطار HEADERS للطلب أو الاستجابة المستلمة، مما يشير إلى عدم استلام أي بيانات إضافية وسيتم إغلاق الجانب القابل للقراءة من `Http2Stream`.

#### `http2stream.id` {#http2streamid}

**تمت الإضافة في: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

معرّف التدفق الرقمي لمثيل `Http2Stream` هذا. يتم تعيين القيمة إلى `undefined` إذا لم يتم تعيين معرّف التدفق بعد.

#### `http2stream.pending` {#http2streampending}

**تمت الإضافة في: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم تعيين القيمة إلى `true` إذا لم يتم تعيين معرّف تدفق رقمي لمثيل `Http2Stream` بعد.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**تمت الإضافة في: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true` و `parent` تحدد تدفقًا أصليًا، يتم جعل هذا التدفق هو التبعية المباشرة الوحيدة للأصل، مع جعل جميع التبعيات الأخرى الموجودة تابعة لهذا التدفق. **افتراضي:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد المعرّف الرقمي لتدفق يعتمد عليه هذا التدفق.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد التبعية النسبية للتدفق فيما يتعلق بالتدفقات الأخرى التي لها نفس `parent`. القيمة هي رقم بين `1` و `256` (شاملة).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، يتم تغيير الأولوية محليًا دون إرسال إطار `PRIORITY` إلى النظير المتصل.
  
 

يقوم بتحديث الأولوية لمثيل `Http2Stream` هذا.


#### `http2stream.rstCode` {#http2streamrstcode}

**تمت الإضافة في: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تم التعيين إلى `RST_STREAM` [رمز الخطأ](/ar/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) الذي تم الإبلاغ عنه عند تدمير `Http2Stream` إما بعد تلقي إطار `RST_STREAM` من النظير المتصل أو استدعاء `http2stream.close()` أو `http2stream.destroy()`. سيكون `undefined` إذا لم يتم إغلاق `Http2Stream`.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**تمت الإضافة في: v9.5.0**

- [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object)

كائن يحتوي على الرؤوس الصادرة المرسلة لهذا `Http2Stream`.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**تمت الإضافة في: v9.5.0**

- [\<HTTP/2 Headers Object[]\>](/ar/nodejs/api/http2#headers-object)

مجموعة من الكائنات تحتوي على الرؤوس المعلوماتية الصادرة (الإضافية) المرسلة لهذا `Http2Stream`.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**تمت الإضافة في: v9.5.0**

- [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object)

كائن يحتوي على المقطورات الصادرة المرسلة لـ `HttpStream` هذا.

#### `http2stream.session` {#http2streamsession}

**تمت الإضافة في: v8.4.0**

- [\<Http2Session\>](/ar/nodejs/api/http2#class-http2session)

مرجع إلى مثيل `Http2Session` الذي يمتلك `Http2Stream` هذا. ستكون القيمة `undefined` بعد تدمير مثيل `Http2Stream`.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// إلغاء التدفق إذا لم يكن هناك نشاط بعد 5 ثوانٍ
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// إلغاء التدفق إذا لم يكن هناك نشاط بعد 5 ثوانٍ
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**أُضيف في: v8.4.0**

يوفر معلومات متنوعة حول الحالة الحالية لـ `Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي قد يرسلها النظير المتصل لهذا `Http2Stream` دون تلقي `WINDOW_UPDATE`.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) علامة تشير إلى الحالة الحالية ذات المستوى المنخفض لـ `Http2Stream` كما تحددها `nghttp2`.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` إذا تم إغلاق `Http2Stream` هذا محليًا.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` إذا تم إغلاق `Http2Stream` هذا عن بُعد.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الوزن الإجمالي لجميع مثيلات `Http2Stream` التي تعتمد على `Http2Stream` هذا كما هو محدد باستخدام إطارات `PRIORITY`.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) وزن الأولوية لـ `Http2Stream` هذا.

الحالة الحالية لـ `Http2Stream` هذا.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**أُضيف في: v10.0.0**

- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)

يرسل إطار `HEADERS` لاحق إلى نظير HTTP/2 المتصل. ستتسبب هذه الطريقة في إغلاق `Http2Stream` على الفور ويجب استدعاؤها فقط بعد إصدار حدث `'wantTrailers'`. عند إرسال طلب أو إرسال استجابة، يجب تعيين خيار `options.waitForTrailers` للحفاظ على `Http2Stream` مفتوحًا بعد إطار `DATA` الأخير بحيث يمكن إرسال التذييلات.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

يمنع مواصفات HTTP/1 التذييلات من احتواء حقول رؤوس HTTP/2 الزائفة (مثل `':method'`, `':path'`, إلخ).


### الفئة: `ClientHttp2Stream` {#class-clienthttp2stream}

**تمت إضافتها في: v8.4.0**

- يمتد من [\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream)

تعد الفئة `ClientHttp2Stream` امتدادًا للفئة `Http2Stream` التي تُستخدم حصريًا على عملاء HTTP/2. توفر مثيلات `Http2Stream` على العميل أحداثًا مثل `'response'` و `'push'` ذات الصلة فقط بالعميل.

#### الحدث: `'continue'` {#event-continue}

**تمت إضافتها في: v8.5.0**

يتم إصداره عندما يرسل الخادم حالة `100 Continue`، عادةً لأن الطلب يحتوي على `Expect: 100-continue`. هذا تعليمات بأنه يجب على العميل إرسال نص الطلب.

#### الحدث: `'headers'` {#event-headers}

**تمت إضافتها في: v8.4.0**

- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم إصدار الحدث `'headers'` عند استلام مجموعة إضافية من الرؤوس لتدفق، مثل عند استلام مجموعة من رؤوس المعلومات `1xx`. يتم تمرير رد الاتصال الخاص بالمستمع [كائن رؤوس HTTP/2](/ar/nodejs/api/http2#headers-object) والعلامات المرتبطة بالرؤوس.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### الحدث: `'push'` {#event-push}

**تمت إضافتها في: v8.4.0**

- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم إصدار الحدث `'push'` عند استلام رؤوس الاستجابة لتدفق Server Push. يتم تمرير رد الاتصال الخاص بالمستمع [كائن رؤوس HTTP/2](/ar/nodejs/api/http2#headers-object) والعلامات المرتبطة بالرؤوس.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### الحدث: `'response'` {#event-response}

**تمت إضافتها في: v8.4.0**

- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يتم إصدار الحدث `'response'` عند استلام إطار `HEADERS` استجابة لهذا التدفق من خادم HTTP/2 المتصل. يتم استدعاء المستمع بوسيطتين: `Object` يحتوي على [كائن رؤوس HTTP/2](/ar/nodejs/api/http2#headers-object) المستلم والعلامات المرتبطة بالرؤوس.



::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### الفئة: ‎`ServerHttp2Stream` {#class-serverhttp2stream}

**أضيف في: v8.4.0**

- يمتد: ‎[\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream)

الفئة `ServerHttp2Stream` هي امتداد لـ [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) التي تستخدم حصريًا على خوادم HTTP/2. توفر مثيلات `Http2Stream` على الخادم طرقًا إضافية مثل `http2stream.pushStream()` و `http2stream.respond()` ذات الصلة فقط على الخادم.

#### ‎`http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**أضيف في: v8.4.0**

- ‎`headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)

يرسل إطار `HEADERS` إضافي إعلامي إلى نظير HTTP/2 المتصل.

#### ‎`http2stream.headersSent` {#http2streamheaderssent}

**أضيف في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

صحيح إذا تم إرسال الرؤوس، خطأ بخلاف ذلك (للقراءة فقط).

#### ‎`http2stream.pushAllowed` {#http2streampushallowed}

**أضيف في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

خاصية للقراءة فقط تم تعيينها على علامة `SETTINGS_ENABLE_PUSH` لإطار `SETTINGS` الأخير للعميل البعيد. سيكون `true` إذا كان النظير البعيد يقبل تدفقات الدفع، `false` بخلاف ذلك. الإعدادات هي نفسها لكل `Http2Stream` في نفس `Http2Session`.

#### ‎`http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد اتصال غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.4.0 | أضيف في: v8.4.0 |
:::

- ‎`headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)
- ‎`options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ‎`exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما يكون `true` ويحدد `parent` دفقًا رئيسيًا، يتم جعل الدفق الذي تم إنشاؤه التبعية المباشرة الوحيدة للرئيسي، مع جعل جميع التابعين الحاليين الآخرين تابعين للدفق الذي تم إنشاؤه حديثًا. **الافتراضي:** `false`.
    - ‎`parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد المعرف الرقمي لدفق يعتمد عليه الدفق الذي تم إنشاؤه حديثًا.

- ‎`callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد اتصال يتم استدعاؤه بمجرد بدء دفق الدفع.
    - ‎`err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - ‎`pushStream` [\<ServerHttp2Stream\>](/ar/nodejs/api/http2#class-serverhttp2stream) كائن `pushStream` الذي تم إرجاعه.
    - ‎`headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object) كائن الرؤوس الذي تم به بدء `pushStream`.

يبدأ دفق دفع. يتم استدعاء رد الاتصال بمثيل `Http2Stream` الجديد الذي تم إنشاؤه لدفق الدفع الذي تم تمريره كوسيطة ثانية، أو `Error` تم تمريره كوسيطة أولى.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

لا يُسمح بتعيين وزن دفق الدفع في إطار `HEADERS`. مرر قيمة `weight` إلى `http2stream.priority` مع تعيين خيار `silent` على `true` لتمكين موازنة النطاق الترددي من جانب الخادم بين التدفقات المتزامنة.

لا يُسمح باستدعاء `http2stream.pushStream()` من داخل دفق مدفوع وسيؤدي إلى طرح خطأ.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.5.0, v12.19.0 | السماح بتعيين رؤوس التاريخ بشكل صريح. |
| الإصدار 8.4.0 | تمت الإضافة في: الإصدار 8.4.0 |
:::

- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object)
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `endStream` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) اضبط على `true` للإشارة إلى أن الاستجابة لن تتضمن بيانات الحمولة.
    - `waitForTrailers` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، سيصدر `Http2Stream` الحدث `'wantTrailers'` بعد إرسال إطار `DATA` الأخير.
  
 



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

يبدأ الاستجابة. عند تعيين الخيار `options.waitForTrailers`، سيتم إصدار الحدث `'wantTrailers'` مباشرة بعد وضع آخر جزء من بيانات الحمولة في قائمة الانتظار للإرسال. يمكن بعد ذلك استخدام الطريقة `http2stream.sendTrailers()` لإرسال حقول الرأس اللاحقة إلى النظير.

عند تعيين `options.waitForTrailers`، لن يتم إغلاق `Http2Stream` تلقائيًا عند إرسال إطار `DATA` الأخير. يجب أن يستدعي رمز المستخدم إما `http2stream.sendTrailers()` أو `http2stream.close()` لإغلاق `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::

#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.5.0, v12.19.0 | السماح بتعيين رؤوس التاريخ بشكل صريح. |
| v12.12.0 | يمكن أن يكون خيار `fd` الآن `FileHandle`. |
| v10.0.0 | يتم الآن دعم أي واصف ملف قابل للقراءة، وليس بالضرورة لملف عادي. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ar/nodejs/api/fs#class-filehandle) واصف ملف قابل للقراءة.
- `headers` [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، سيصدر `Http2Stream` حدث `'wantTrailers'` بعد إرسال إطار `DATA` النهائي.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) موضع الإزاحة الذي تبدأ القراءة منه.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار البيانات المراد إرسالها من fd.
  
 

يبدأ استجابة تتم قراءة بياناتها من واصف الملف المحدد. لا يتم إجراء أي تحقق من الصحة على واصف الملف المحدد. إذا حدث خطأ أثناء محاولة قراءة البيانات باستخدام واصف الملف، فسيتم إغلاق `Http2Stream` باستخدام إطار `RST_STREAM` باستخدام رمز `INTERNAL_ERROR` القياسي.

عند الاستخدام، سيتم إغلاق واجهة `Duplex` الخاصة بكائن `Http2Stream` تلقائيًا.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

يمكن تحديد وظيفة `options.statCheck` الاختيارية لمنح كود المستخدم فرصة لتعيين رؤوس محتوى إضافية بناءً على تفاصيل `fs.Stat` لواصف الملف المحدد. إذا تم توفير وظيفة `statCheck`، فستقوم طريقة `http2stream.respondWithFD()` بإجراء استدعاء `fs.fstat()` لجمع تفاصيل حول واصف الملف المقدم.

يمكن استخدام خيارات `offset` و `length` لتقييد الاستجابة بمجموعة فرعية معينة من النطاق. يمكن استخدام هذا، على سبيل المثال، لدعم طلبات HTTP Range.

لا يتم إغلاق واصف الملف أو `FileHandle` عند إغلاق الدفق، لذلك يجب إغلاقه يدويًا بمجرد عدم الحاجة إليه. لا يتم دعم استخدام نفس واصف الملف في وقت واحد لتدفقات متعددة وقد يؤدي إلى فقدان البيانات. يتم دعم إعادة استخدام واصف الملف بعد انتهاء الدفق.

عند تعيين الخيار `options.waitForTrailers`، سيتم إصدار حدث `'wantTrailers'` مباشرة بعد وضع آخر جزء من بيانات الحمولة في قائمة الانتظار لإرسالها. يمكن بعد ذلك استخدام طريقة `http2stream.sendTrailers()` لإرسال حقول الرأس اللاحقة إلى النظير.

عند تعيين `options.waitForTrailers`، لن يتم إغلاق `Http2Stream` تلقائيًا عند إرسال إطار `DATA` النهائي. *يجب* على كود المستخدم استدعاء `http2stream.sendTrailers()` أو `http2stream.close()` لإغلاق `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v14.5.0, v12.19.0 | السماح بتعيين رؤوس التاريخ بشكل صريح. |
| v10.0.0 | أي ملف قابل للقراءة، وليس بالضرورة ملفًا عاديًا، مدعوم الآن. |
| v8.4.0 | أُضيف في: v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء يتم استدعاؤها في حالة حدوث خطأ قبل الإرسال.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، سيقوم `Http2Stream` بإصدار حدث `'wantTrailers'` بعد إرسال إطار `DATA` الأخير.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) موضع الإزاحة الذي ستبدأ القراءة عنده.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) كمية البيانات المراد إرسالها من fd.

 

يرسل ملفًا عاديًا كرد. يجب أن يحدد `path` ملفًا عاديًا أو سيتم إصدار حدث `'error'` على كائن `Http2Stream`.

عند الاستخدام، سيتم إغلاق واجهة `Duplex` لكائن `Http2Stream` تلقائيًا.

يمكن تحديد الدالة الاختيارية `options.statCheck` لإعطاء رمز المستخدم فرصة لتعيين رؤوس محتوى إضافية استنادًا إلى تفاصيل `fs.Stat` للملف المحدد:

إذا حدث خطأ أثناء محاولة قراءة بيانات الملف، فسيتم إغلاق `Http2Stream` باستخدام إطار `RST_STREAM` باستخدام رمز `INTERNAL_ERROR` القياسي. إذا تم تعريف رد نداء `onError`، فسيتم استدعاؤه. وإلا فسيتم تدمير التدفق.

مثال باستخدام مسار ملف:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

يمكن أيضًا استخدام الدالة `options.statCheck` لإلغاء عملية الإرسال عن طريق إرجاع `false`. على سبيل المثال، قد يتحقق طلب مشروط من نتائج stat لتحديد ما إذا تم تعديل الملف لإرجاع استجابة `304` مناسبة:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

سيتم تعيين حقل رأس `content-length` تلقائيًا.

يمكن استخدام الخيارات `offset` و `length` لتقييد الاستجابة بمجموعة فرعية نطاقية معينة. يمكن استخدام هذا، على سبيل المثال، لدعم طلبات HTTP Range.

يمكن أيضًا استخدام الدالة `options.onError` للتعامل مع جميع الأخطاء التي قد تحدث قبل بدء تسليم الملف. السلوك الافتراضي هو تدمير التدفق.

عند تعيين الخيار `options.waitForTrailers`، سيتم إصدار حدث `'wantTrailers'` فورًا بعد وضع آخر جزء من بيانات الحمولة في قائمة الانتظار ليتم إرسالها. يمكن بعد ذلك استخدام الطريقة `http2stream.sendTrailers()` لإرسال حقول الرأس اللاحقة إلى النظير.

عند تعيين `options.waitForTrailers`، لن يتم إغلاق `Http2Stream` تلقائيًا عند إرسال إطار `DATA` الأخير. يجب على كود المستخدم استدعاء إما `http2stream.sendTrailers()` أو `http2stream.close()` لإغلاق `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### الفئة: `Http2Server` {#class-http2server}

**أُضيف في: v8.4.0**

- يمتد من: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

يتم إنشاء مثيلات `Http2Server` باستخدام الدالة `http2.createServer()`. لا يتم تصدير الفئة `Http2Server` مباشرة بواسطة الوحدة `node:http2`.

#### الحدث: `'checkContinue'` {#event-checkcontinue}

**أُضيف في: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse)

إذا تم تسجيل مستمع [`'request'`](/ar/nodejs/api/http2#event-request) أو تم تزويد [`http2.createServer()`](/ar/nodejs/api/http2#http2createserveroptions-onrequesthandler) بدالة استدعاء، فسيتم إطلاق الحدث `'checkContinue'` في كل مرة يتم فيها استقبال طلب مع HTTP `Expect: 100-continue`. إذا لم يتم الاستماع إلى هذا الحدث، فسيستجيب الخادم تلقائيًا بالحالة `100 Continue` حسب الاقتضاء.

تتضمن معالجة هذا الحدث استدعاء [`response.writeContinue()`](/ar/nodejs/api/http2#responsewritecontinue) إذا كان يجب على العميل الاستمرار في إرسال نص الطلب، أو إنشاء استجابة HTTP مناسبة (مثل 400 Bad Request) إذا كان لا يجب على العميل الاستمرار في إرسال نص الطلب.

عندما يتم إطلاق هذا الحدث ومعالجته، فلن يتم إطلاق الحدث [`'request'`](/ar/nodejs/api/http2#event-request).

#### الحدث: `'connection'` {#event-connection}

**أُضيف في: v8.4.0**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يتم إطلاق هذا الحدث عند إنشاء دفق TCP جديد. `socket` هو عادةً كائن من النوع [`net.Socket`](/ar/nodejs/api/net#class-netsocket). عادةً لن يرغب المستخدمون في الوصول إلى هذا الحدث.

يمكن أيضًا إطلاق هذا الحدث صراحةً من قبل المستخدمين لحقن الاتصالات في خادم HTTP. في هذه الحالة، يمكن تمرير أي دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex).

#### الحدث: `'request'` {#event-request}

**أُضيف في: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse)

يتم إطلاقه في كل مرة يكون هناك طلب. قد يكون هناك طلبات متعددة لكل جلسة. راجع [واجهة برمجة التطبيقات للتوافق](/ar/nodejs/api/http2#compatibility-api).


#### الحدث: `'session'` {#event-session}

**تمت إضافته في: الإصدار 8.4.0**

- `session` [\<ServerHttp2Session\>](/ar/nodejs/api/http2#class-serverhttp2session)

يتم إصدار الحدث `'session'` عند إنشاء `Http2Session` جديد بواسطة `Http2Server`.

#### الحدث: `'sessionError'` {#event-sessionerror}

**تمت إضافته في: الإصدار 8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ar/nodejs/api/http2#class-serverhttp2session)

يتم إصدار الحدث `'sessionError'` عند إصدار الحدث `'error'` بواسطة كائن `Http2Session` مرتبط بـ `Http2Server`.

#### الحدث: `'stream'` {#event-stream_1}

**تمت إضافته في: الإصدار 8.4.0**

- `stream` [\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream) مرجع إلى التدفق
- `headers` [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object) كائن يصف الرؤوس
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العلامات الرقمية المرتبطة
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة تحتوي على أسماء الرؤوس الخام متبوعة بالقيم الخاصة بها.

يتم إصدار الحدث `'stream'` عند إصدار الحدث `'stream'` بواسطة `Http2Session` المرتبطة بالخادم.

انظر أيضًا [`Http2Session`'s `'stream'` event](/ar/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### الحدث: `'timeout'` {#event-timeout_2}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تم تغيير المهلة الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

يتم إصدار حدث `'timeout'` عندما لا يكون هناك نشاط على الخادم لعدد معين من المللي ثانية تم تعيينه باستخدام `http2server.setTimeout()`. **الافتراضي:** 0 (بدون مهلة)

#### `server.close([callback])` {#serverclosecallback}

**تمت الإضافة في: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يوقف الخادم من إنشاء جلسات جديدة. هذا لا يمنع إنشاء تدفقات طلب جديدة بسبب الطبيعة المستمرة لجلسات HTTP/2. لإيقاف تشغيل الخادم بأمان، قم باستدعاء [`http2session.close()`](/ar/nodejs/api/http2#http2sessionclosecallback) على جميع الجلسات النشطة.

إذا تم توفير `callback`، فلن يتم استدعاؤه حتى يتم إغلاق جميع الجلسات النشطة، على الرغم من أن الخادم قد توقف بالفعل عن السماح بالجلسات الجديدة. راجع [`net.Server.close()`](/ar/nodejs/api/net#serverclosecallback) لمزيد من التفاصيل.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**تمت الإضافة في: v20.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`server.close()`](/ar/nodejs/api/http2#serverclosecallback) ويعيد وعدًا يتحقق عند إغلاق الخادم.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يطرح الآن خطأ `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v13.0.0 | تم تغيير المهلة الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** 0 (بدون مهلة)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<Http2Server\>](/ar/nodejs/api/http2#class-http2server)

يُستخدم لتعيين قيمة المهلة لطلبات خادم http2، وتعيين دالة رد نداء يتم استدعاؤها عندما لا يكون هناك نشاط على `Http2Server` بعد `msecs` من المللي ثانية.

يتم تسجيل رد النداء المحدد كمستمع لحدث `'timeout'`.

في حالة عدم كون `callback` دالة، سيتم طرح خطأ `ERR_INVALID_ARG_TYPE` جديد.


#### `server.timeout` {#servertimeout}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تم تغيير المهلة الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| v8.4.0 | تمت إضافته في: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المهلة بالمللي ثانية. **افتراضي:** 0 (بدون مهلة)

عدد المللي ثانية من عدم النشاط قبل افتراض أن المقبس قد انتهت مهلته.

ستؤدي قيمة `0` إلى تعطيل سلوك المهلة على الاتصالات الواردة.

تم إعداد منطق مهلة المقبس عند الاتصال، لذا فإن تغيير هذه القيمة يؤثر فقط على الاتصالات الجديدة بالخادم، وليس على أي اتصالات موجودة.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**تمت إضافته في: v15.1.0, v14.17.0**

- `settings` [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object)

يستخدم لتحديث الخادم بالإعدادات المقدمة.

يطرح `ERR_HTTP2_INVALID_SETTING_VALUE` لقيم `settings` غير صالحة.

يطرح `ERR_INVALID_ARG_TYPE` لوسيطة `settings` غير صالحة.

### الصنف: `Http2SecureServer` {#class-http2secureserver}

**تمت إضافته في: v8.4.0**

- يمتد: [\<tls.Server\>](/ar/nodejs/api/tls#class-tlsserver)

يتم إنشاء مثيلات `Http2SecureServer` باستخدام الدالة `http2.createSecureServer()`. لا يتم تصدير الصنف `Http2SecureServer` مباشرةً بواسطة الوحدة `node:http2`.

#### الحدث: `'checkContinue'` {#event-checkcontinue_1}

**تمت إضافته في: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse)

إذا تم تسجيل مستمع [`'request'`](/ar/nodejs/api/http2#event-request) أو تم تزويد [`http2.createSecureServer()`](/ar/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) بدالة رد اتصال، فسيتم إصدار الحدث `'checkContinue'` في كل مرة يتم فيها استقبال طلب مع HTTP `Expect: 100-continue`. إذا لم يتم الاستماع إلى هذا الحدث، فسيستجيب الخادم تلقائيًا بالحالة `100 Continue` حسب الاقتضاء.

يتضمن التعامل مع هذا الحدث استدعاء [`response.writeContinue()`](/ar/nodejs/api/http2#responsewritecontinue) إذا كان يجب على العميل الاستمرار في إرسال نص الطلب، أو إنشاء استجابة HTTP مناسبة (مثل 400 طلب غير صالح) إذا كان لا ينبغي للعميل الاستمرار في إرسال نص الطلب.

عندما يتم إصدار هذا الحدث والتعامل معه، لن يتم إصدار الحدث [`'request'`](/ar/nodejs/api/http2#event-request).


#### الحدث: `'connection'` {#event-connection_1}

**تمت إضافته في: v8.4.0**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يتم إطلاق هذا الحدث عند إنشاء دفق TCP جديد، قبل بدء عملية المصافحة TLS. `socket` هو عادةً كائن من النوع [`net.Socket`](/ar/nodejs/api/net#class-netsocket). عادةً لن يرغب المستخدمون في الوصول إلى هذا الحدث.

يمكن أيضًا إطلاق هذا الحدث بشكل صريح من قبل المستخدمين لحقن الاتصالات في خادم HTTP. في هذه الحالة، يمكن تمرير أي دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex).

#### الحدث: `'request'` {#event-request_1}

**تمت إضافته في: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse)

يتم إطلاقه في كل مرة يوجد فيها طلب. قد يكون هناك طلبات متعددة لكل جلسة. راجع [واجهة برمجة تطبيقات التوافق](/ar/nodejs/api/http2#compatibility-api).

#### الحدث: `'session'` {#event-session_1}

**تمت إضافته في: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ar/nodejs/api/http2#class-serverhttp2session)

يتم إطلاق الحدث `'session'` عندما يتم إنشاء `Http2Session` جديد بواسطة `Http2SecureServer`.

#### الحدث: `'sessionError'` {#event-sessionerror_1}

**تمت إضافته في: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ar/nodejs/api/http2#class-serverhttp2session)

يتم إطلاق الحدث `'sessionError'` عندما يتم إطلاق حدث `'error'` بواسطة كائن `Http2Session` مرتبط بـ `Http2SecureServer`.

#### الحدث: `'stream'` {#event-stream_2}

**تمت إضافته في: v8.4.0**

- `stream` [\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream) مرجع إلى الدفق
- `headers` [\<كائن رؤوس HTTP/2\>](/ar/nodejs/api/http2#headers-object) كائن يصف الرؤوس
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العلامات الرقمية المرتبطة
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة تحتوي على أسماء الرؤوس الأولية متبوعة بقيمها المقابلة.

يتم إطلاق الحدث `'stream'` عندما يتم إطلاق حدث `'stream'` بواسطة `Http2Session` مرتبط بالخادم.

راجع أيضًا [`Http2Session`'s `'stream'` event](/ar/nodejs/api/http2#event-stream).



::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### الحدث: `'timeout'` {#event-timeout_3}

**تمت إضافته في: v8.4.0**

يتم إطلاق الحدث `'timeout'` عندما لا يوجد نشاط على الخادم لعدد معين من الملّي ثانية يتم تعيينه باستخدام `http2secureServer.setTimeout()`. **افتراضي:** دقيقتان.

#### الحدث: `'unknownProtocol'` {#event-unknownprotocol}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | سيتم إطلاق هذا الحدث فقط إذا لم يرسل العميل امتداد ALPN أثناء مصافحة TLS. |
| v8.4.0 | تمت إضافته في: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يتم إطلاق الحدث `'unknownProtocol'` عندما يفشل عميل متصل في التفاوض على بروتوكول مسموح به (أي HTTP/2 أو HTTP/1.1). يتلقى معالج الحدث المقبس للتعامل معه. إذا لم يتم تسجيل أي مستمع لهذا الحدث، فسيتم إنهاء الاتصال. يمكن تحديد مهلة باستخدام الخيار `'unknownProtocolTimeout'` الذي تم تمريره إلى [`http2.createSecureServer()`](/ar/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler).

في الإصدارات السابقة من Node.js، كان سيتم إطلاق هذا الحدث إذا كانت قيمة `allowHTTP1` هي `false`، وأثناء مصافحة TLS، إما أن العميل لم يرسل امتداد ALPN أو أرسل امتداد ALPN لا يتضمن HTTP/2 (`h2`). الإصدارات الأحدث من Node.js تطلق هذا الحدث فقط إذا كانت `allowHTTP1` هي `false` والعميل لا يرسل امتداد ALPN. إذا أرسل العميل امتداد ALPN لا يتضمن HTTP/2 (أو HTTP/1.1 إذا كانت `allowHTTP1` هي `true`)، فستفشل مصافحة TLS ولن يتم إنشاء اتصال آمن.

راجع [واجهة برمجة تطبيقات التوافق](/ar/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**تمت إضافته في: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يوقف الخادم من إنشاء جلسات جديدة. هذا لا يمنع إنشاء تدفقات طلب جديدة بسبب الطبيعة المستمرة لجلسات HTTP/2. لإيقاف تشغيل الخادم بأمان، قم باستدعاء [`http2session.close()`](/ar/nodejs/api/http2#http2sessionclosecallback) على جميع الجلسات النشطة.

إذا تم توفير `callback`، فلن يتم استدعاؤه حتى يتم إغلاق جميع الجلسات النشطة، على الرغم من أن الخادم قد توقف بالفعل عن السماح بجلسات جديدة. راجع [`tls.Server.close()`](/ar/nodejs/api/tls#serverclosecallback) لمزيد من التفاصيل.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | الآن يؤدي تمرير دالة رد نداء غير صالحة إلى وسيط `callback` إلى طرح خطأ `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v8.4.0 | أضيف في: الإصدار v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `120000` (دقيقتان)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<Http2SecureServer\>](/ar/nodejs/api/http2#class-http2secureserver)

يُستخدم لتعيين قيمة المهلة لطلبات خادم HTTP/2 الآمنة، ويعين دالة رد نداء يتم استدعاؤها عندما لا يكون هناك نشاط على `Http2SecureServer` بعد `msecs` من المللي ثانية.

يتم تسجيل دالة رد النداء المعطاة كمستمع على حدث `'timeout'`.

في حال لم تكن `callback` دالة، فسيتم طرح خطأ `ERR_INVALID_ARG_TYPE` جديد.

#### `server.timeout` {#servertimeout_1}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.0.0 | تم تغيير المهلة الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| الإصدار v8.4.0 | أضيف في: الإصدار v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المهلة بالمللي ثانية. **افتراضي:** 0 (بدون مهلة)

عدد المللي ثانية من عدم النشاط قبل افتراض انتهاء مهلة المقبس.

ستؤدي القيمة `0` إلى تعطيل سلوك المهلة على الاتصالات الواردة.

يتم إعداد منطق مهلة المقبس عند الاتصال، لذا فإن تغيير هذه القيمة يؤثر فقط على الاتصالات الجديدة بالخادم، وليس على أي اتصالات موجودة.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**أضيف في: الإصدار v15.1.0، الإصدار v14.17.0**

- `settings` [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object)

يُستخدم لتحديث الخادم بالإعدادات المتوفرة.

يطرح `ERR_HTTP2_INVALID_SETTING_VALUE` لقيم `settings` غير صالحة.

يطرح `ERR_INVALID_ARG_TYPE` لوسيط `settings` غير صالح.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v23.0.0 | أضيف `streamResetBurst` و `streamResetRate`. |
| الإصدار v13.0.0 | تم جعل `PADDING_STRATEGY_CALLBACK` مكافئًا لتوفير `PADDING_STRATEGY_ALIGNED` وتمت إزالة `selectPadding`. |
| الإصدار v13.3.0، الإصدار v12.16.0 | أضيف خيار `maxSessionRejectedStreams` بقيمة افتراضية 100. |
| الإصدار v13.3.0، الإصدار v12.16.0 | أضيف خيار `maxSessionInvalidFrames` بقيمة افتراضية 1000. |
| الإصدار v12.4.0 | تدعم معلمة `options` الآن خيارات `net.createServer()`. |
| الإصدار v15.10.0، الإصدار v14.16.0، الإصدار v12.21.0، الإصدار v10.24.0 | أضيف خيار `unknownProtocolTimeout` بقيمة افتراضية 10000. |
| الإصدار v14.4.0، الإصدار v12.18.0، الإصدار v10.21.0 | أضيف خيار `maxSettings` بقيمة افتراضية 32. |
| الإصدار v9.6.0 | أضيف خيار `Http1IncomingMessage` و `Http1ServerResponse`. |
| الإصدار v8.9.3 | أضيف خيار `maxOutstandingPings` بحد افتراضي قدره 10. |
| الإصدار v8.9.3 | أضيف خيار `maxHeaderListPairs` بحد افتراضي قدره 128 زوجًا من الرؤوس. |
| الإصدار v8.4.0 | أضيف في: الإصدار v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لحجم الجدول الديناميكي لضغط حقول الرأس. **افتراضي:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد إدخالات الإعدادات لكل إطار `SETTINGS`. الحد الأدنى للقيمة المسموح بها هو `1`. **افتراضي:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى للذاكرة التي يُسمح لـ `Http2Session` باستخدامها. يتم التعبير عن القيمة من حيث عدد الميجابايت، على سبيل المثال `1` يساوي 1 ميجابايت. الحد الأدنى للقيمة المسموح بها هو `1`. هذا حد قائم على الائتمان، وقد تتسبب `Http2Stream` الموجودة في تجاوز هذا الحد، ولكن سيتم رفض مثيلات `Http2Stream` الجديدة أثناء تجاوز هذا الحد. يتم احتساب العدد الحالي لجلسات `Http2Stream`، والاستخدام الحالي للذاكرة لجداول ضغط الرأس، والبيانات الحالية الموضوعة في قائمة الانتظار ليتم إرسالها، وإطارات `PING` و `SETTINGS` غير المؤكدة ضمن الحد الحالي. **افتراضي:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد إدخالات الرأس. هذا مشابه لـ [`server.maxHeadersCount`](/ar/nodejs/api/http#servermaxheaderscount) أو [`request.maxHeadersCount`](/ar/nodejs/api/http#requestmaxheaderscount) في وحدة `node:http`. الحد الأدنى للقيمة هو `4`. **افتراضي:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد اختبارات الاتصال (ping) المعلقة وغير المؤكدة. **افتراضي:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى المسموح به لحجم كتلة الرؤوس المتسلسلة والمضغوطة. ستؤدي محاولات إرسال رؤوس تتجاوز هذا الحد إلى إصدار حدث `'frameError'` وإغلاق الدفق وتدميره. في حين أن هذا يحدد الحد الأقصى المسموح به للكتلة الكاملة من الرؤوس، فإن `nghttp2` (مكتبة http2 الداخلية) لديها حد قدره `65536` لكل زوج مفتاح/قيمة غير مضغوط.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الاستراتيجية المستخدمة لتحديد مقدار الحشو المراد استخدامه لإطارات `HEADERS` و `DATA`. **افتراضي:** `http2.constants.PADDING_STRATEGY_NONE`. قد تكون القيمة واحدة مما يلي:
    - `http2.constants.PADDING_STRATEGY_NONE`: لا يتم تطبيق أي حشو.
    - `http2.constants.PADDING_STRATEGY_MAX`: يتم تطبيق الحد الأقصى لمقدار الحشو، الذي تحدده التنفيذ الداخلي.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: محاولات لتطبيق ما يكفي من الحشو لضمان أن يكون الطول الإجمالي للإطار، بما في ذلك الرأس المكون من 9 بايت، من مضاعفات 8. لكل إطار، يوجد حد أقصى مسموح به لعدد بايتات الحشو التي تحددها حالة التحكم في التدفق والإعدادات الحالية. إذا كان هذا الحد الأقصى أقل من المبلغ المحسوب اللازم لضمان المحاذاة، فسيتم استخدام الحد الأقصى ولا يلزم أن يكون الطول الإجمالي للإطار محاذيًا عند 8 بايت.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الدفقات المتزامنة للنظير البعيد كما لو تم استلام إطار `SETTINGS`. سيتم تجاوزه إذا قام النظير البعيد بتعيين قيمته الخاصة لـ `maxConcurrentStreams`. **افتراضي:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الإطارات غير الصالحة التي سيتم تحملها قبل إغلاق الجلسة. **افتراضي:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الدفقات المرفوضة عند الإنشاء والتي سيتم تحملها قبل إغلاق الجلسة. يرتبط كل رفض بخطأ `NGHTTP2_ENHANCE_YOUR_CALM` الذي يجب أن يخبر النظير بعدم فتح أي دفقات أخرى، وبالتالي فإن الاستمرار في فتح الدفقات يعتبر علامة على سوء سلوك النظير. **افتراضي:** `100`.
    - `settings` [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object) الإعدادات الأولية لإرسالها إلى النظير البعيد عند الاتصال.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) و `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحددان معدل الحد لإعادة تعيين الدفق الوارد (إطار RST_STREAM). يجب تعيين كلا الإعدادين ليكون لهما أي تأثير، وهما افتراضيان 1000 و 33 على التوالي.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تحدد مصفوفة القيم الصحيحة أنواع الإعدادات، والتي يتم تضمينها في خاصية `CustomSettings` الخاصة بـ `remoteSettings` المستلمة. يرجى الاطلاع على خاصية `CustomSettings` الخاصة بكائن `Http2Settings` لمزيد من المعلومات حول أنواع الإعدادات المسموح بها.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage) يحدد فئة `IncomingMessage` المراد استخدامها للتراجع عن HTTP/1. مفيد لتوسيع `http.IncomingMessage` الأصلي. **افتراضي:** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse) يحدد فئة `ServerResponse` المراد استخدامها للتراجع عن HTTP/1. مفيد لتوسيع `http.ServerResponse` الأصلي. **افتراضي:** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest) يحدد فئة `Http2ServerRequest` المراد استخدامها. مفيد لتوسيع `Http2ServerRequest` الأصلي. **افتراضي:** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse) يحدد فئة `Http2ServerResponse` المراد استخدامها. مفيد لتوسيع `Http2ServerResponse` الأصلي. **افتراضي:** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد مهلة بالمللي ثانية يجب أن ينتظرها الخادم عند إصدار [`'unknownProtocol'`](/ar/nodejs/api/http2#event-unknownprotocol). إذا لم يتم تدمير المقبس بحلول ذلك الوقت، فسيدمره الخادم. **افتراضي:** `10000`.
    - ...: يمكن توفير أي خيار [`net.createServer()`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener).

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) انظر [واجهة برمجة تطبيقات التوافق](/ar/nodejs/api/http2#compatibility-api)
- الإرجاع: [\<Http2Server\>](/ar/nodejs/api/http2#class-http2server)

يُرجع مثيل `net.Server` يقوم بإنشاء وإدارة مثيلات `Http2Session`.

نظرًا لعدم وجود متصفحات معروفة تدعم [HTTP/2 غير المشفر](https://http2.github.io/faq/#does-http2-require-encryption)، فإن استخدام [`http2.createSecureServer()`](/ar/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) ضروري عند التواصل مع عملاء المتصفح.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `createSecureServer()`
// is necessary when communicating with browser clients.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `http2.createSecureServer()`
// is necessary when communicating with browser clients.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تم جعل `PADDING_STRATEGY_CALLBACK` مكافئًا لتوفير `PADDING_STRATEGY_ALIGNED` وتمت إزالة `selectPadding`. |
| v13.3.0, v12.16.0 | تمت إضافة خيار `maxSessionRejectedStreams` بقيمة افتراضية 100. |
| v13.3.0, v12.16.0 | تمت إضافة خيار `maxSessionInvalidFrames` بقيمة افتراضية 1000. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | تمت إضافة خيار `unknownProtocolTimeout` بقيمة افتراضية 10000. |
| v14.4.0, v12.18.0, v10.21.0 | تمت إضافة خيار `maxSettings` بقيمة افتراضية 32. |
| v10.12.0 | تمت إضافة خيار `origins` لإرسال إطار `ORIGIN` تلقائيًا عند بدء تشغيل `Http2Session`. |
| v8.9.3 | تمت إضافة خيار `maxOutstandingPings` بحد أقصى افتراضي 10. |
| v8.9.3 | تمت إضافة خيار `maxHeaderListPairs` بحد أقصى افتراضي 128 زوجًا من الرؤوس. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سيتم تخفيض اتصالات العميل الواردة التي لا تدعم HTTP/2 إلى HTTP/1.x عند تعيينها على `true`. انظر حدث [`'unknownProtocol'`](/ar/nodejs/api/http2#event-unknownprotocol). انظر [تفاوض ALPN](/ar/nodejs/api/http2#alpn-negotiation). **الافتراضي:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لحجم الجدول الديناميكي لضغط حقول الرأس. **الافتراضي:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد إدخالات الإعدادات لكل إطار `SETTINGS`. الحد الأدنى المسموح به هو `1`. **الافتراضي:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى للذاكرة التي يُسمح لـ `Http2Session` باستخدامها. يتم التعبير عن القيمة من حيث عدد الميجابايت، على سبيل المثال `1` يساوي 1 ميجابايت. الحد الأدنى المسموح به هو `1`. هذا حد قائم على الائتمان، وقد تتسبب مثيلات `Http2Stream` الموجودة في تجاوز هذا الحد، ولكن سيتم رفض مثيلات `Http2Stream` الجديدة أثناء تجاوز هذا الحد. يتم احتساب العدد الحالي لجلسات `Http2Stream`، والاستخدام الحالي للذاكرة لجداول ضغط الرأس، والبيانات الحالية المنتظرة للإرسال، وإطارات `PING` و `SETTINGS` غير المعترف بها ضمن الحد الحالي. **الافتراضي:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد إدخالات الرأس. هذا مشابه لـ [`server.maxHeadersCount`](/ar/nodejs/api/http#servermaxheaderscount) أو [`request.maxHeadersCount`](/ar/nodejs/api/http#requestmaxheaderscount) في وحدة `node:http`. الحد الأدنى للقيمة هو `4`. **الافتراضي:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد اختبارات الاتصال المعلقة وغير المعترف بها. **الافتراضي:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى المسموح به لحجم كتلة الرؤوس المتسلسلة والمضغوطة. محاولات إرسال رؤوس تتجاوز هذا الحد ستؤدي إلى إصدار حدث `'frameError'` وإغلاق وتدمير الدفق.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإستراتيجية المستخدمة لتحديد مقدار الحشو الذي سيتم استخدامه لإطارات `HEADERS` و `DATA`. **الافتراضي:** `http2.constants.PADDING_STRATEGY_NONE`. قد تكون القيمة إحدى القيم التالية:
    - `http2.constants.PADDING_STRATEGY_NONE`: لا يتم تطبيق أي حشو.
    - `http2.constants.PADDING_STRATEGY_MAX`: يتم تطبيق الحد الأقصى لمقدار الحشو، الذي يحدده التنفيذ الداخلي.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: محاولات لتطبيق حشو كافٍ لضمان أن يكون الطول الإجمالي للإطار، بما في ذلك رأس 9 بايت، من مضاعفات 8. لكل إطار، يوجد حد أقصى مسموح به لعدد بايتات الحشو يتم تحديده بواسطة حالة التحكم في التدفق والإعدادات الحالية. إذا كان هذا الحد الأقصى أقل من المبلغ المحسوب المطلوب لضمان المحاذاة، فسيتم استخدام الحد الأقصى ولن يتم بالضرورة محاذاة الطول الإجمالي للإطار عند 8 بايت.
  
 
    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الدفقات المتزامنة للنظير البعيد كما لو تم استلام إطار `SETTINGS`. سيتم تجاوزه إذا قام النظير البعيد بتعيين قيمته الخاصة لـ `maxConcurrentStreams`. **الافتراضي:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الإطارات غير الصالحة التي سيتم التسامح معها قبل إغلاق الجلسة. **الافتراضي:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد الدفقات المرفوضة عند الإنشاء والتي سيتم التسامح معها قبل إغلاق الجلسة. يرتبط كل رفض بخطأ `NGHTTP2_ENHANCE_YOUR_CALM` الذي يجب أن يخبر النظير بعدم فتح المزيد من الدفقات، وبالتالي يعتبر الاستمرار في فتح الدفقات علامة على سوء سلوك النظير. **الافتراضي:** `100`.
    - `settings` [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object) الإعدادات الأولية لإرسالها إلى النظير البعيد عند الاتصال.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تحدد مصفوفة القيم الصحيحة أنواع الإعدادات، والتي يتم تضمينها في الخاصية `customSettings` الخاصة بـ remoteSettings المستلمة. يرجى الاطلاع على الخاصية `customSettings` الخاصة بكائن `Http2Settings` لمزيد من المعلومات حول أنواع الإعدادات المسموح بها.
    - ...: يمكن توفير أي من خيارات [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). بالنسبة للخوادم، عادة ما تكون خيارات الهوية (`pfx` أو `key`/`cert`) مطلوبة.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من سلاسل المصدر لإرسالها داخل إطار `ORIGIN` مباشرة بعد إنشاء خادم `Http2Session` جديد.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد مهلة بالمللي ثانية يجب أن ينتظرها الخادم عند إصدار حدث [`'unknownProtocol'`](/ar/nodejs/api/http2#event-unknownprotocol). إذا لم يتم تدمير المقبس بحلول ذلك الوقت، فسوف يقوم الخادم بتدميره. **الافتراضي:** `10000`.
  
 
- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) انظر [واجهة برمجة تطبيقات التوافق](/ar/nodejs/api/http2#compatibility-api)
- الإرجاع: [\<Http2SecureServer\>](/ar/nodejs/api/http2#class-http2secureserver)

إرجاع مثيل `tls.Server` يقوم بإنشاء وإدارة مثيلات `Http2Session`.



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تم جعل `PADDING_STRATEGY_CALLBACK` مكافئًا لتوفير `PADDING_STRATEGY_ALIGNED` وتمت إزالة `selectPadding`. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | تمت إضافة خيار `unknownProtocolTimeout` بقيمة افتراضية 10000. |
| v14.4.0, v12.18.0, v10.21.0 | تمت إضافة خيار `maxSettings` بقيمة افتراضية 32. |
| v8.9.3 | تمت إضافة خيار `maxOutstandingPings` بحد أقصى افتراضي 10. |
| v8.9.3 | تمت إضافة خيار `maxHeaderListPairs` بحد أقصى افتراضي 128 زوجًا من الرؤوس. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) خادم HTTP/2 البعيد المراد الاتصال به. يجب أن يكون هذا في شكل عنوان URL صالح وبسيط مع البادئة `http://` أو `https://` واسم المضيف ومنفذ IP (إذا تم استخدام منفذ غير افتراضي). سيتم تجاهل معلومات المستخدم (معرف المستخدم وكلمة المرور) والمسار وسلسلة الاستعلام وتفاصيل الجزء في عنوان URL.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى لحجم الجدول الديناميكي لضغط حقول الرأس. **الافتراضي:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى لعدد إدخالات الإعدادات لكل إطار `SETTINGS`. الحد الأدنى للقيمة المسموح بها هو `1`. **الافتراضي:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى للذاكرة المسموح لـ `Http2Session` باستخدامها. يتم التعبير عن القيمة من حيث عدد الميجابايت، على سبيل المثال، `1` يساوي 1 ميجابايت. الحد الأدنى للقيمة المسموح بها هو `1`. هذا حد قائم على الائتمان، وقد تتسبب `Http2Stream`s الموجودة في تجاوز هذا الحد، ولكن سيتم رفض مثيلات `Http2Stream` الجديدة أثناء تجاوز هذا الحد. يتم احتساب العدد الحالي لجلسات `Http2Stream` والاستخدام الحالي للذاكرة لجداول ضغط الرأس والبيانات الحالية التي تم وضعها في قائمة الانتظار ليتم إرسالها وإطارات `PING` و `SETTINGS` غير المستلمة ضمن الحد الحالي. **الافتراضي:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى لعدد إدخالات الرأس. هذا مشابه لـ [`server.maxHeadersCount`](/ar/nodejs/api/http#servermaxheaderscount) أو [`request.maxHeadersCount`](/ar/nodejs/api/http#requestmaxheaderscount) في الوحدة `node:http`. الحد الأدنى للقيمة هو `1`. **الافتراضي:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى لعدد اختبارات الاتصال المعلقة وغير المستلمة. **الافتراضي:** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى لعدد تدفقات الدفع المحجوزة التي سيقبلها العميل في أي وقت محدد. بمجرد أن يتجاوز العدد الحالي لتدفقات الدفع المحجوزة حاليًا هذا الحد، سيتم رفض تدفقات الدفع الجديدة المرسلة من الخادم تلقائيًا. الحد الأدنى المسموح به هو 0. الحد الأقصى المسموح به هو 2-1. تحدد القيمة السالبة هذا الخيار إلى الحد الأقصى المسموح به. **الافتراضي:** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى المسموح به لحجم كتلة الرؤوس المتسلسلة والمضغوطة. ستؤدي محاولات إرسال رؤوس تتجاوز هذا الحد إلى إطلاق حدث `'frameError'` وإغلاق وتدمير التدفق.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإستراتيجية المستخدمة لتحديد مقدار الحشو المراد استخدامه لإطارات `HEADERS` و `DATA`. **الافتراضي:** `http2.constants.PADDING_STRATEGY_NONE`. قد تكون القيمة واحدة مما يلي:
    - `http2.constants.PADDING_STRATEGY_NONE`: لا يتم تطبيق أي حشو.
    - `http2.constants.PADDING_STRATEGY_MAX`: يتم تطبيق الحد الأقصى لمقدار الحشو، الذي تحدده آلية التنفيذ الداخلية.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: محاولات لتطبيق حشو كافٍ لضمان أن يكون الطول الكلي للإطار، بما في ذلك الرأس المكون من 9 بايتات، مضاعفًا للرقم 8. لكل إطار، يوجد حد أقصى مسموح به لعدد بايتات الحشو الذي تحدده حالة التحكم في التدفق والإعدادات الحالية. إذا كان هذا الحد الأقصى أقل من المقدار المحسوب المطلوب لضمان المحاذاة، فسيتم استخدام الحد الأقصى وليس بالضرورة أن يكون الطول الكلي للإطار محاذيًا عند 8 بايتات.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعيّن الحد الأقصى لعدد التدفقات المتزامنة للند البعيد كما لو تم استلام إطار `SETTINGS`. سيتم تجاوزه إذا قام الند البعيد بتعيين قيمته الخاصة لـ `maxConcurrentStreams`. **الافتراضي:** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) البروتوكول المراد الاتصال به، إذا لم يتم تعيينه في `authority`. قد تكون القيمة إما `'http:'` أو `'https:'`. **الافتراضي:** `'https:'`
    - `settings` [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object) الإعدادات الأولية المراد إرسالها إلى الند البعيد عند الاتصال.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) تحدد مصفوفة القيم الصحيحة أنواع الإعدادات، والتي يتم تضمينها في الخاصية `CustomSettings` الخاصة بـ remoteSettings المستلمة. يرجى الاطلاع على الخاصية `CustomSettings` الخاصة بالكائن `Http2Settings` لمزيد من المعلومات حول أنواع الإعدادات المسموح بها.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد نداء اختياري يتلقى مثيل `URL` الذي تم تمريره إلى `connect` والكائن `options`، ويعيد أي تدفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) سيتم استخدامه كاتصال لهذه الجلسة.
    - ...: يمكن توفير أي خيارات [`net.connect()`](/ar/nodejs/api/net#netconnect) أو [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback).
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد مهلة بالمللي ثانية يجب أن ينتظرها الخادم عند إطلاق حدث [`'unknownProtocol'`](/ar/nodejs/api/http2#event-unknownprotocol). إذا لم يتم تدمير المقبس بحلول ذلك الوقت، فسيقوم الخادم بتدميره. **الافتراضي:** `10000`.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) سيتم تسجيله كمستمع لمرة واحدة لحدث [`'connect'`](/ar/nodejs/api/http2#event-connect).
- الإرجاع: [\<ClientHttp2Session\>](/ar/nodejs/api/http2#class-clienthttp2session)

إرجاع مثيل `ClientHttp2Session`.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* استخدم العميل */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* استخدم العميل */

client.close();
```
:::


### `http2.constants` {#http2constants}

**أُضيف في: v8.4.0**

#### رموز الخطأ لـ `RST_STREAM` و `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| القيمة | الاسم | الثابت |
| --- | --- | --- |
| `0x00` | لا يوجد خطأ | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | خطأ في البروتوكول | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | خطأ داخلي | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | خطأ في التحكم في التدفق | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | مهلة الإعدادات | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | تم إغلاق التدفق | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | خطأ في حجم الإطار | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | تدفق مرفوض | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | إلغاء | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | خطأ في الضغط | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | خطأ في الاتصال | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | حسّن من هدوئك | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | أمان غير كاف | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 مطلوب | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
يتم إصدار حدث `'timeout'` عندما لا يكون هناك نشاط على الخادم لعدد معين من المللي ثانية تم تعيينه باستخدام `http2server.setTimeout()`.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**أُضيف في: v8.4.0**

- إرجاع: [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object)

إرجاع كائن يحتوي على الإعدادات الافتراضية لمثيل `Http2Session`. تُرجع هذه الطريقة مثيلاً جديدًا للكائن في كل مرة يتم استدعاؤها، لذلك يمكن تعديل المثيلات التي تم إرجاعها بأمان للاستخدام.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**أُضيف في: v8.4.0**

- `settings` [\<كائن إعدادات HTTP/2\>](/ar/nodejs/api/http2#settings-object)
- إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع مثيل `Buffer` يحتوي على تمثيل تسلسلي لإعدادات HTTP/2 المحددة كما هو محدد في مواصفات [HTTP/2](https://tools.ietf.org/html/rfc7540). هذا مخصص للاستخدام مع حقل رأس `HTTP2-Settings`.



::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**تمت الإضافة في: v8.4.0**

- `buf` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) الإعدادات المعبأة.
- الإرجاع: [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object)

إرجاع [\<HTTP/2 Settings Object\>](/ar/nodejs/api/http2#settings-object) يحتوي على الإعدادات المُزالة تسلسلها من `Buffer` المحدد كما تم إنشاؤه بواسطة `http2.getPackedSettings()`.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**تمت الإضافة في: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - ...: يمكن توفير أي خيار [`http2.createServer()`](/ar/nodejs/api/http2#http2createserveroptions-onrequesthandler).
  
 
- الإرجاع: [\<ServerHttp2Session\>](/ar/nodejs/api/http2#class-serverhttp2session)

إنشاء جلسة خادم HTTP/2 من مقبس موجود.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**تمت الإضافة في: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

يمكن تعيين هذا الرمز كخاصية في كائن رؤوس HTTP/2 بقيمة مصفوفة لتوفير قائمة بالرؤوس التي تعتبر حساسة. راجع [رؤوس حساسة](/ar/nodejs/api/http2#sensitive-headers) لمزيد من التفاصيل.

### كائن الرؤوس {#headers-object}

يتم تمثيل الرؤوس كخصائص خاصة على كائنات JavaScript. سيتم تسلسل مفاتيح الخاصية إلى أحرف صغيرة. يجب أن تكون قيم الخاصية سلاسل (إذا لم تكن كذلك، فسيتم إجبارها على سلاسل) أو `Array` من السلاسل (من أجل إرسال أكثر من قيمة واحدة لكل حقل رأس).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
ستحتوي كائنات الرأس التي تم تمريرها إلى وظائف رد الاتصال على نموذج أولي `null`. هذا يعني أن طرق كائن JavaScript العادية مثل `Object.prototype.toString()` و `Object.prototype.hasOwnProperty()` لن تعمل.

بالنسبة للرؤوس الواردة:

- يتم تحويل الرأس `:status` إلى `number`.
- يتم تجاهل التكرارات لـ `:status` و `:method` و `:authority` و `:scheme` و `:path` و `:protocol` و `age` و `authorization` و `access-control-allow-credentials` و `access-control-max-age` و `access-control-request-method` و `content-encoding` و `content-language` و `content-length` و `content-location` و `content-md5` و `content-range` و `content-type` و `date` و `dnt` و `etag` و `expires` و `from` و `host` و `if-match` و `if-modified-since` و `if-none-match` و `if-range` و `if-unmodified-since` و `last-modified` و `location` و `max-forwards` و `proxy-authorization` و `range` و `referer` و `retry-after` و `tk` و `upgrade-insecure-requests` و `user-agent` أو `x-content-type-options`.
- `set-cookie` دائمًا عبارة عن مصفوفة. تتم إضافة التكرارات إلى المصفوفة.
- بالنسبة لرؤوس `cookie` المكررة، يتم ضم القيم معًا باستخدام '; '.
- بالنسبة لجميع الرؤوس الأخرى، يتم ضم القيم معًا باستخدام ', '.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### رؤوس حساسة {#sensitive-headers}

يمكن تحديد رؤوس HTTP2 على أنها حساسة، مما يعني أن خوارزمية ضغط رؤوس HTTP/2 لن تقوم بفهرستها أبدًا. يمكن أن يكون هذا منطقيًا لقيم الرؤوس ذات الإنتروبيا المنخفضة والتي قد تعتبر ذات قيمة للمهاجم، على سبيل المثال `Cookie` أو `Authorization`. لتحقيق ذلك، أضف اسم الرأس إلى خاصية `[http2.sensitiveHeaders]` كصفيف:

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
بالنسبة لبعض الرؤوس، مثل `Authorization` والرؤوس القصيرة `Cookie`، يتم تعيين هذا العلم تلقائيًا.

يتم أيضًا تعيين هذه الخاصية للرؤوس المستلمة. وسوف تحتوي على أسماء جميع الرؤوس التي تم تحديدها على أنها حساسة، بما في ذلك تلك التي تم تحديدها بهذه الطريقة تلقائيًا.

### كائن الإعدادات {#settings-object}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.12.0 | إعداد `maxConcurrentStreams` أكثر صرامة. |
| v8.9.3 | يتم الآن تطبيق إعداد `maxHeaderListSize` بشكل صارم. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

تقوم واجهات برمجة التطبيقات `http2.getDefaultSettings()` و `http2.getPackedSettings()` و `http2.createServer()` و `http2.createSecureServer()` و `http2session.settings()` و `http2session.localSettings` و `http2session.remoteSettings` إما بإرجاع أو استقبال كائن كمدخلات يحدد إعدادات التكوين لكائن `Http2Session`. هذه الكائنات عبارة عن كائنات JavaScript عادية تحتوي على الخصائص التالية.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد البايتات المستخدمة لضغط الرؤوس. الحد الأدنى المسموح به هو 0. الحد الأقصى المسموح به هو 2-1. **افتراضي:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد `true` إذا كان سيتم السماح بتدفقات دفع HTTP/2 على مثيلات `Http2Session`. **افتراضي:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد حجم النافذة الأولية *للمرسل* بالبايتات للتحكم في التدفق على مستوى التدفق. الحد الأدنى المسموح به هو 0. الحد الأقصى المسموح به هو 2-1. **افتراضي:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد حجم أكبر حمولة إطار بالبايتات. الحد الأدنى المسموح به هو 16384. الحد الأقصى المسموح به هو 2-1. **افتراضي:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد التدفقات المتزامنة المسموح بها على `Http2Session`. لا توجد قيمة افتراضية مما يعني، على الأقل من الناحية النظرية، أنه يمكن فتح 2-1 تدفقات بشكل متزامن في أي وقت في `Http2Session`. الحد الأدنى للقيمة هو 0. الحد الأقصى المسموح به هو 2-1. **افتراضي:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لحجم (أوكتيات غير مضغوطة) قائمة الرؤوس التي سيتم قبولها. الحد الأدنى المسموح به هو 0. الحد الأقصى المسموح به هو 2-1. **افتراضي:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اسم مستعار لـ `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد `true` إذا كان سيتم تمكين "بروتوكول الاتصال الموسع" المحدد بواسطة [RFC 8441](https://tools.ietf.org/html/rfc8441). هذا الإعداد ذو معنى فقط إذا تم إرساله بواسطة الخادم. بمجرد تمكين إعداد `enableConnectProtocol` لـ `Http2Session` معينة، لا يمكن تعطيله. **افتراضي:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحدد إعدادات إضافية، لم يتم تنفيذها بعد في node والمكتبات الأساسية. يحدد مفتاح الكائن القيمة الرقمية لنوع الإعدادات (كما هو محدد في سجل "HTTP/2 SETTINGS" الذي تم إنشاؤه بواسطة [RFC 7540]) والقيم هي القيمة الرقمية الفعلية للإعدادات. يجب أن يكون نوع الإعدادات عددًا صحيحًا في النطاق من 1 إلى 2^16-1. يجب ألا يكون نوع إعدادات تتعامل معه node بالفعل، أي يجب أن يكون حاليًا أكبر من 6، على الرغم من أنه ليس خطأ. يجب أن تكون القيم أعدادًا صحيحة غير موقعة في النطاق من 0 إلى 2^32-1. حاليًا، يتم دعم ما يصل إلى 10 إعدادات مخصصة كحد أقصى. يتم دعمه فقط لإرسال SETTINGS، أو لتلقي قيم الإعدادات المحددة في خيارات `remoteCustomSettings` الخاصة بالكائن الخادم أو العميل. لا تخلط بين آلية `customSettings` لمعرف الإعدادات مع الواجهات للإعدادات التي يتم التعامل معها أصلاً، في حالة أن يصبح الإعداد مدعومًا أصلاً في إصدار node مستقبلي.

يتم تجاهل جميع الخصائص الإضافية في كائن الإعدادات.


### معالجة الأخطاء {#error-handling}

هناك عدة أنواع من حالات الأخطاء التي قد تنشأ عند استخدام وحدة `node:http2`:

تحدث أخطاء التحقق عندما يتم تمرير وسيطة أو خيار أو قيمة إعداد غير صحيحة. سيتم الإبلاغ عن هذه الأخطاء دائمًا بواسطة `throw` متزامن.

تحدث أخطاء الحالة عندما تتم محاولة إجراء في وقت غير صحيح (على سبيل المثال، محاولة إرسال بيانات على دفق بعد إغلاقه). سيتم الإبلاغ عن هذه الأخطاء باستخدام `throw` متزامن أو عبر حدث `'error'` على كائنات `Http2Stream` أو `Http2Session` أو خادم HTTP/2، اعتمادًا على مكان وزمان حدوث الخطأ.

تحدث الأخطاء الداخلية عندما تفشل جلسة HTTP/2 بشكل غير متوقع. سيتم الإبلاغ عن هذه الأخطاء عبر حدث `'error'` على كائنات `Http2Session` أو خادم HTTP/2.

تحدث أخطاء البروتوكول عندما يتم انتهاك قيود بروتوكول HTTP/2 المختلفة. سيتم الإبلاغ عن هذه الأخطاء باستخدام `throw` متزامن أو عبر حدث `'error'` على كائنات `Http2Stream` أو `Http2Session` أو خادم HTTP/2، اعتمادًا على مكان وزمان حدوث الخطأ.

### معالجة الأحرف غير الصالحة في أسماء وقيم الرؤوس {#invalid-character-handling-in-header-names-and-values}

يطبق تنفيذ HTTP/2 معالجة أكثر صرامة للأحرف غير الصالحة في أسماء وقيم رؤوس HTTP مقارنة بتنفيذ HTTP/1.

أسماء حقول الرأس *غير حساسة لحالة الأحرف* ويتم إرسالها عبر السلك كسلاسل صغيرة تمامًا. تسمح واجهة برمجة التطبيقات (API) التي توفرها Node.js بتعيين أسماء الرؤوس كسلاسل ذات حالة مختلطة (مثل `Content-Type`) ولكنها ستحولها إلى أحرف صغيرة (مثل `content-type`) عند الإرسال.

*يجب أن تحتوي* أسماء حقول الرأس *فقط* على واحد أو أكثر من أحرف ASCII التالية: `a`-`z`، `A`-`Z`، `0`-`9`، `!`، `#`، `$`، `%`، `&`، `'`، `*`، `+`، `-`، `.`، `^`، `_`، ``` (علامة اقتباس معكوسة)، `|`، و `~`.

سيؤدي استخدام أحرف غير صالحة داخل اسم حقل رأس HTTP إلى إغلاق الدفق مع الإبلاغ عن خطأ في البروتوكول.

يتم التعامل مع قيم حقول الرأس بتساهل أكبر ولكن *يجب* ألا تحتوي على أحرف سطر جديد أو إرجاع السطر و *يجب* أن تقتصر على أحرف US-ASCII، وفقًا لمتطلبات مواصفات HTTP.


### دفع التدفقات على العميل {#push-streams-on-the-client}

لتلقي التدفقات المدفوعة على العميل، قم بتعيين مستمع لحدث `'stream'` على `ClientHttp2Session`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // معالجة رؤوس الاستجابة
  });
  pushedStream.on('data', (chunk) => { /* معالجة البيانات المدفوعة */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // معالجة رؤوس الاستجابة
  });
  pushedStream.on('data', (chunk) => { /* معالجة البيانات المدفوعة */ });
});

const req = client.request({ ':path': '/' });
```
:::

### دعم طريقة `CONNECT` {#supporting-the-connect-method}

تُستخدم طريقة `CONNECT` للسماح باستخدام خادم HTTP/2 كوكيل لاتصالات TCP/IP.

خادم TCP بسيط:

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

وكيل HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // قبول طلبات CONNECT فقط
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // من الجيد جدًا التحقق من أن اسم المضيف والمنفذ هما
  // الأشياء التي يجب أن يتصل بها هذا الوكيل.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // قبول طلبات CONNECT فقط
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // من الجيد جدًا التحقق من أن اسم المضيف والمنفذ هما
  // الأشياء التي يجب أن يتصل بها هذا الوكيل.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

عميل HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// يجب عدم تحديد الرؤوس ':path' و ':scheme'
// لطلبات CONNECT وإلا سيتم طرح خطأ.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// يجب عدم تحديد الرؤوس ':path' و ':scheme'
// لطلبات CONNECT وإلا سيتم طرح خطأ.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::

### بروتوكول `CONNECT` الموسع {#the-extended-connect-protocol}

تعرّف [RFC 8441](https://tools.ietf.org/html/rfc8441) امتداد "بروتوكول CONNECT الموسع" لـ HTTP/2 والذي يمكن استخدامه لتهيئة استخدام `Http2Stream` باستخدام طريقة `CONNECT` كنفق لبروتوكولات اتصال أخرى (مثل WebSockets).

يتم تمكين استخدام بروتوكول CONNECT الموسع بواسطة خوادم HTTP/2 باستخدام إعداد `enableConnectProtocol`:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

بمجرد أن يتلقى العميل إطار `SETTINGS` من الخادم يشير إلى أنه يمكن استخدام CONNECT الموسع، فإنه قد يرسل طلبات `CONNECT` التي تستخدم الرأس الزائف HTTP/2 `':protocol'`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## واجهة برمجة التطبيقات للتوافق (Compatibility API) {#compatibility-api}

تهدف واجهة برمجة التطبيقات للتوافق إلى توفير تجربة مطور مماثلة لـ HTTP/1 عند استخدام HTTP/2، مما يجعل من الممكن تطوير تطبيقات تدعم كلاً من [HTTP/1](/ar/nodejs/api/http) و HTTP/2. تستهدف واجهة برمجة التطبيقات هذه فقط **واجهة برمجة التطبيقات العامة** لـ [HTTP/1](/ar/nodejs/api/http). ومع ذلك، تستخدم العديد من الوحدات النمطية طرقًا أو حالات داخلية، و*هذه غير مدعومة* لأنها تطبيق مختلف تمامًا.

ينشئ المثال التالي خادم HTTP/2 باستخدام واجهة برمجة التطبيقات للتوافق:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

لإنشاء خادم مختلط [HTTPS](/ar/nodejs/api/https) و HTTP/2، ارجع إلى قسم [تفاوض ALPN](/ar/nodejs/api/http2#alpn-negotiation). لا يتم دعم الترقية من خوادم HTTP/1 غير TLS.

تتكون واجهة برمجة تطبيقات التوافق HTTP/2 من [`Http2ServerRequest`](/ar/nodejs/api/http2#class-http2http2serverrequest) و [`Http2ServerResponse`](/ar/nodejs/api/http2#class-http2http2serverresponse). وتهدفان إلى توافق واجهة برمجة التطبيقات مع HTTP/1، لكنهما لا تخفيان الاختلافات بين البروتوكولات. على سبيل المثال، يتم تجاهل رسالة الحالة لرموز HTTP.


### التفاوض على بروتوكول ALPN {#alpn-negotiation}

يتيح التفاوض على بروتوكول ALPN دعم كل من [HTTPS](/ar/nodejs/api/https) و HTTP/2 عبر نفس المقبس. يمكن أن تكون كائنات `req` و `res` إما HTTP/1 أو HTTP/2، ويجب على التطبيق **أن** يقتصر على واجهة برمجة التطبيقات العامة لـ [HTTP/1](/ar/nodejs/api/http)، واكتشاف ما إذا كان من الممكن استخدام الميزات الأكثر تقدمًا في HTTP/2.

يقوم المثال التالي بإنشاء خادم يدعم كلا البروتوكولين:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } from 'node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

يعمل حدث `'request'` بشكل متطابق على كل من [HTTPS](/ar/nodejs/api/https) و HTTP/2.

### الفئة: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**تمت الإضافة في: الإصدار v8.4.0**

- يمتد: [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)

يتم إنشاء كائن `Http2ServerRequest` بواسطة [`http2.Server`](/ar/nodejs/api/http2#class-http2server) أو [`http2.SecureServer`](/ar/nodejs/api/http2#class-http2secureserver) ويتم تمريره كوسيطة أولى إلى حدث [`'request'`](/ar/nodejs/api/http2#event-request). يمكن استخدامه للوصول إلى حالة الطلب والرؤوس والبيانات.


#### الحدث: `'aborted'` {#event-aborted_1}

**أضيف في: v8.4.0**

يصدر الحدث `'aborted'` كلما تم إجهاض نسخة `Http2ServerRequest` بشكل غير طبيعي في منتصف الاتصال.

سيتم إصدار الحدث `'aborted'` فقط إذا لم يتم إنهاء الجانب القابل للكتابة من `Http2ServerRequest`.

#### الحدث: `'close'` {#event-close_2}

**أضيف في: v8.4.0**

يشير إلى أن [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) الأساسي قد تم إغلاقه. تمامًا مثل `'end'`، يحدث هذا الحدث مرة واحدة فقط لكل استجابة.

#### `request.aborted` {#requestaborted}

**أضيف في: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون خاصية `request.aborted` بقيمة `true` إذا تم إجهاض الطلب.

#### `request.authority` {#requestauthority}

**أضيف في: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

حقل الرأس الزائف لسلطة الطلب. نظرًا لأن HTTP/2 يسمح للطلبات بتعيين إما `:authority` أو `host`، فإن هذه القيمة مشتقة من `req.headers[':authority']` إذا كانت موجودة. وإلا، فإنه مشتق من `req.headers['host']`.

#### `request.complete` {#requestcomplete}

**أضيف في: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون خاصية `request.complete` بقيمة `true` إذا تم إكمال الطلب أو إجهاضه أو تدميره.

#### `request.connection` {#requestconnection}

**أضيف في: v8.4.0**

**تم الإيقاف منذ: v13.0.0**

::: danger [مستقر: 0 - تم الإيقاف]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف. استخدم [`request.socket`](/ar/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

انظر [`request.socket`](/ar/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**أضيف في: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يستدعي `destroy()` على [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) الذي تلقى [`Http2ServerRequest`](/ar/nodejs/api/http2#class-http2http2serverrequest). إذا تم توفير `error`، فسيتم إصدار حدث `'error'` ويتم تمرير `error` كمعامل إلى أي مستمعين على الحدث.

لا يفعل شيئًا إذا تم تدمير التدفق بالفعل.


#### `request.headers` {#requestheaders}

**تمت إضافتها في: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن رؤوس الطلب/الاستجابة.

أزواج القيمة-المفتاح لأسماء الرؤوس وقيمها. أسماء الرؤوس بأحرف صغيرة.

```js [ESM]
// يطبع شيئًا مثل:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
انظر [كائن رؤوس HTTP/2](/ar/nodejs/api/http2#headers-object).

في HTTP/2، يتم تمثيل مسار الطلب واسم المضيف والبروتوكول والطريقة كرؤوس خاصة مسبوقة بالحرف `:` (مثل `':path'`). سيتم تضمين هذه الرؤوس الخاصة في كائن `request.headers`. يجب توخي الحذر لعدم تعديل هذه الرؤوس الخاصة عن غير قصد أو قد تحدث أخطاء. على سبيل المثال، ستؤدي إزالة جميع الرؤوس من الطلب إلى حدوث أخطاء:

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // يفشل لأن الرأس :path قد تمت إزالته
```
#### `request.httpVersion` {#requesthttpversion}

**تمت إضافتها في: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

في حالة طلب الخادم، إصدار HTTP الذي أرسله العميل. في حالة استجابة العميل، إصدار HTTP الخاص بالخادم المتصل به. يُرجع `'2.0'`.

أيضًا `message.httpVersionMajor` هو العدد الصحيح الأول و `message.httpVersionMinor` هو العدد الصحيح الثاني.

#### `request.method` {#requestmethod}

**تمت إضافتها في: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

طريقة الطلب كسلسلة نصية. للقراءة فقط. أمثلة: `'GET'`، `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**تمت إضافتها في: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة رؤوس الطلب/الاستجابة الأولية تمامًا كما تم استقبالها.

توجد المفاتيح والقيم في نفس القائمة. *ليست* قائمة من الصفوف. لذلك، فإن الإزاحات ذات الأرقام الزوجية هي قيم المفاتيح، والإزاحات ذات الأرقام الفردية هي القيم المرتبطة بها.

أسماء الرؤوس ليست بأحرف صغيرة، والتكرارات لم يتم دمجها.

```js [ESM]
// يطبع شيئًا مثل:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

#### `request.rawTrailers` {#requestrawtrailers}

**أُضيف في:** v8.4.0

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مفاتيح وقيم مقطورة الطلب/الاستجابة الخام تمامًا كما تم استقبالها. يتم ملؤها فقط في حدث `'end'`.

#### `request.scheme` {#requestscheme}

**أُضيف في:** v8.4.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

حقل الرأس الزائف لمخطط الطلب الذي يشير إلى جزء المخطط من عنوان URL الهدف.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**أُضيف في:** v8.4.0

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest)

يضبط قيمة المهلة لـ [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) إلى `msecs`. إذا تم توفير رد نداء، فسيتم إضافته كمستمع على حدث `'timeout'` في كائن الاستجابة.

إذا لم يتم إضافة مستمع `'timeout'` إلى الطلب أو الاستجابة أو الخادم، فسيتم تدمير [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) عندما تنتهي مهلتها. إذا تم تعيين معالج لأحداث `'timeout'` الخاصة بالطلب أو الاستجابة أو الخادم، فيجب التعامل مع المقابس التي انتهت مهلتها بشكل صريح.

#### `request.socket` {#requestsocket}

**أُضيف في:** v8.4.0

- [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

يُرجع كائن `Proxy` يعمل كـ `net.Socket` (أو `tls.TLSSocket`) ولكنه يطبق أدوات الجلب والتعيين والطرق بناءً على منطق HTTP/2.

سيتم استرداد الخصائص `destroyed` و `readable` و `writable` من `request.stream` وتعيينها عليه.

سيتم استدعاء الطرق `destroy` و `emit` و `end` و `on` و `once` على `request.stream`.

سيتم استدعاء الطريقة `setTimeout` على `request.stream.session`.

سيؤدي استدعاء الطرق `pause` و `read` و `resume` و `write` إلى طرح خطأ برمز `ERR_HTTP2_NO_SOCKET_MANIPULATION`. راجع [`Http2Session` والمقابس](/ar/nodejs/api/http2#http2session-and-sockets) لمزيد من المعلومات.

سيتم توجيه جميع التفاعلات الأخرى مباشرة إلى المقبس. مع دعم TLS، استخدم [`request.socket.getPeerCertificate()`](/ar/nodejs/api/tls#tlssocketgetpeercertificatedetailed) للحصول على تفاصيل مصادقة العميل.


#### `request.stream` {#requeststream}

**تمت إضافته في: الإصدار 8.4.0**

- [\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream)

كائن [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) الذي يدعم الطلب.

#### `request.trailers` {#requesttrailers}

**تمت إضافته في: الإصدار 8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن تذييلات الطلب/الاستجابة. تتم تعبئته فقط عند حدث `'end'`.

#### `request.url` {#requesturl}

**تمت إضافته في: الإصدار 8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

سلسلة عنوان URL للطلب. يحتوي هذا على عنوان URL الموجود في طلب HTTP الفعلي فقط. إذا كان الطلب:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
إذًا سيكون `request.url` هو:

```js [ESM]
'/status?name=ryan'
```
لتحليل عنوان URL إلى أجزائه، يمكن استخدام `new URL()`:

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### الفئة: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**تمت إضافته في: الإصدار 8.4.0**

- يمتد: [\<Stream\>](/ar/nodejs/api/stream#stream)

يتم إنشاء هذا الكائن داخليًا بواسطة خادم HTTP، وليس بواسطة المستخدم. يتم تمريره كمعامل ثانٍ إلى حدث [`'request'`](/ar/nodejs/api/http2#event-request).

#### الحدث: `'close'` {#event-close_3}

**تمت إضافته في: الإصدار 8.4.0**

يشير إلى أن [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) الأساسي قد تم إنهاؤه قبل استدعاء [`response.end()`](/ar/nodejs/api/http2#responseenddata-encoding-callback) أو تمكنه من المسح.

#### الحدث: `'finish'` {#event-finish}

**تمت إضافته في: الإصدار 8.4.0**

يتم إصداره عند إرسال الاستجابة. وبشكل أكثر تحديدًا، يتم إصدار هذا الحدث عندما يتم تسليم الجزء الأخير من رؤوس الاستجابة والجسم إلى تعدد إرسال HTTP/2 للإرسال عبر الشبكة. لا يعني ذلك أن العميل قد استلم أي شيء حتى الآن.

بعد هذا الحدث، لن يتم إصدار المزيد من الأحداث على كائن الاستجابة.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**تمت الإضافة في: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تضيف هذه الطريقة تذييلات HTTP (رأس ولكن في نهاية الرسالة) إلى الاستجابة.

ستؤدي محاولة تعيين اسم حقل رأس أو قيمة تحتوي على أحرف غير صالحة إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**تمت الإضافة في: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إلحاق قيمة رأس واحدة بكائن الرأس.

إذا كانت القيمة عبارة عن مصفوفة، فهذا يعادل استدعاء هذه الطريقة عدة مرات.

إذا لم تكن هناك قيم سابقة للرأس، فهذا يعادل استدعاء [`response.setHeader()`](/ar/nodejs/api/http2#responsesetheadername-value).

ستؤدي محاولة تعيين اسم حقل رأس أو قيمة تحتوي على أحرف غير صالحة إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

```js [ESM]
// Returns headers including "set-cookie: a" and "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**تمت الإضافة في: v8.4.0**

**تم الإيقاف منذ: v13.0.0**

::: danger [مستقر: 0 - تم الإيقاف]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف. استخدم [`response.socket`](/ar/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

راجع [`response.socket`](/ar/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير دالة رد نداء غير صالحة إلى وسيطة `callback` الآن إلى ظهور `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `headers` [\<HTTP/2 Headers Object\>](/ar/nodejs/api/http2#headers-object) كائن يصف الرؤوس
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها بمجرد انتهاء `http2stream.pushStream()`، أو إما عند فشل محاولة إنشاء `Http2Stream` المدفوع أو تم رفضها، أو أن حالة `Http2ServerRequest` مغلقة قبل استدعاء طريقة `http2stream.pushStream()`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse) كائن `Http2ServerResponse` الذي تم إنشاؤه حديثًا
  
 

قم باستدعاء [`http2stream.pushStream()`](/ar/nodejs/api/http2#http2streampushstreamheaders-options-callback) مع الرؤوس المحددة، وقم بتضمين [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) المحدد في `Http2ServerResponse` تم إنشاؤه حديثًا كمعامل رد اتصال إذا نجح. عند إغلاق `Http2ServerRequest`، يتم استدعاء رد الاتصال مع خطأ `ERR_HTTP2_INVALID_STREAM`.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [سجل التعديلات]
| الإصدار | التغييرات |
|---|---|
| v10.0.0 | تُرجع هذه الطريقة الآن مرجعًا إلى `ServerResponse`. |
| v8.4.0 | تمت الإضافة في: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- القيمة المُعادة: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

تُشير هذه الطريقة إلى الخادم بأنه تم إرسال جميع رؤوس الاستجابة وجسمها؛ ويجب أن يعتبر الخادم هذه الرسالة كاملة. يجب استدعاء الطريقة `response.end()` على كل استجابة.

إذا تم تحديد `data`، فسيكون ذلك مكافئًا لاستدعاء [`response.write(data, encoding)`](/ar/nodejs/api/http#responsewritechunk-encoding-callback) متبوعًا بـ `response.end(callback)`.

إذا تم تحديد `callback`، فسيتم استدعاؤها عند انتهاء دفق الاستجابة.

#### `response.finished` {#responsefinished}

**تمت الإضافة في: v8.4.0**

**تم الإلغاء منذ: v13.4.0, v12.16.0**

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء. استخدم [`response.writableEnded`](/ar/nodejs/api/http2#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية تشير إلى ما إذا كانت الاستجابة قد اكتملت. تبدأ كـ `false`. بعد تنفيذ [`response.end()`](/ar/nodejs/api/http2#responseenddata-encoding-callback)، ستكون القيمة `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**تمت الإضافة في: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- القيمة المُعادة: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقرأ رأسًا تمت جدولته بالفعل ولكن لم يتم إرساله إلى العميل. الاسم غير حساس لحالة الأحرف.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**أُضيف في: v8.4.0**

- يُعيد: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُعيد مصفوفة تحتوي على الأسماء الفريدة للعناوين الصادرة الحالية. جميع أسماء العناوين بأحرف صغيرة.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**أُضيف في: v8.4.0**

- يُعيد: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يُعيد نسخة سطحية من العناوين الصادرة الحالية. نظرًا لاستخدام نسخة سطحية، قد تتغير قيم المصفوفة دون الحاجة إلى استدعاءات إضافية لطرق وحدة http المختلفة المتعلقة بالعناوين. مفاتيح الكائن الذي تم إرجاعه هي أسماء العناوين والقيم هي قيم العناوين المعنية. جميع أسماء العناوين بأحرف صغيرة.

الكائن الذي تم إرجاعه بواسطة الطريقة `response.getHeaders()` *لا* يرث بشكل أولي من كائن JavaScript `Object`. هذا يعني أن طرق `Object` النموذجية مثل `obj.toString()` و `obj.hasOwnProperty()` وغيرها غير مُعرفة و *لن تعمل*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**أُضيف في: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- يُعيد: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُعيد `true` إذا تم تعيين العنوان المحدد بواسطة `name` حاليًا في العناوين الصادرة. مطابقة اسم العنوان غير حساسة لحالة الأحرف.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**أُضيف في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

صحيح إذا تم إرسال العناوين، خطأ بخلاف ذلك (للقراءة فقط).


#### `response.removeHeader(name)` {#responseremoveheadername}

**تمت إضافتها في: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يزيل عنوانًا تم وضعه في قائمة الانتظار للإرسال الضمني.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**تمت إضافتها في: v15.7.0**

- [\<http2.Http2ServerRequest\>](/ar/nodejs/api/http2#class-http2http2serverrequest)

مرجع إلى كائن HTTP2 `request` الأصلي.

#### `response.sendDate` {#responsesenddate}

**تمت إضافتها في: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

عندما تكون القيمة true، سيتم إنشاء عنوان التاريخ تلقائيًا وإرساله في الاستجابة إذا لم يكن موجودًا بالفعل في العناوين. القيمة الافتراضية هي true.

يجب تعطيل هذا للاختبار فقط؛ يتطلب HTTP عنوان التاريخ في الاستجابات.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**تمت إضافتها في: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم بتعيين قيمة عنوان واحد للعناوين الضمنية. إذا كان هذا العنوان موجودًا بالفعل في العناوين المراد إرسالها، فسيتم استبدال قيمته. استخدم مجموعة من السلاسل النصية هنا لإرسال عناوين متعددة بنفس الاسم.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
أو

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
ستؤدي محاولة تعيين اسم حقل عنوان أو قيمة تحتوي على أحرف غير صالحة إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

عندما يتم تعيين العناوين باستخدام [`response.setHeader()`](/ar/nodejs/api/http2#responsesetheadername-value)، فسيتم دمجها مع أي عناوين يتم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)، مع إعطاء الأولوية للعناوين التي تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers).

```js [ESM]
// Returns content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**أُضيف في: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse)

يضبط قيمة المهلة (`timeout`) لـ [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) إلى `msecs`. إذا تم توفير رد نداء (`callback`)، فسيتم إضافته كـ `listener` على حدث `'timeout'` في كائن الاستجابة.

إذا لم تتم إضافة أي `listener` لـ `'timeout'` إلى الطلب أو الاستجابة أو الخادم، فسيتم تدمير [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) عندما تنتهي مهلتها. إذا تم تعيين معالج لأحداث `'timeout'` الخاصة بالطلب أو الاستجابة أو الخادم، فيجب التعامل مع المقابس التي انتهت مهلتها بشكل صريح.

#### `response.socket` {#responsesocket}

**أُضيف في: v8.4.0**

- [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

إرجاع كائن `Proxy` يعمل كـ `net.Socket` (أو `tls.TLSSocket`) ولكنه يطبق أدوات الجلب (`getters`) وأدوات الضبط (`setters`) والطرق بناءً على منطق HTTP/2.

سيتم استرداد الخصائص `destroyed` و `readable` و `writable` من `response.stream` وتعيينها عليه.

سيتم استدعاء الطرق `destroy` و `emit` و `end` و `on` و `once` على `response.stream`.

سيتم استدعاء الطريقة `setTimeout` على `response.stream.session`.

ستطرح الطرق `pause` و `read` و `resume` و `write` خطأً مع رمز `ERR_HTTP2_NO_SOCKET_MANIPULATION`. انظر [`Http2Session` والمقابس](/ar/nodejs/api/http2#http2session-and-sockets) لمزيد من المعلومات.

سيتم توجيه جميع التفاعلات الأخرى مباشرةً إلى المقبس.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**أضيف في: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عند استخدام العناوين الضمنية (عدم استدعاء [`response.writeHead()`](/ar/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) بشكل صريح)، يتحكم هذا الخاصية في رمز الحالة الذي سيتم إرساله إلى العميل عند تفريغ العناوين.

```js [ESM]
response.statusCode = 404;
```
بعد إرسال عنوان الاستجابة إلى العميل، يشير هذا الخاصية إلى رمز الحالة الذي تم إرساله.

#### `response.statusMessage` {#responsestatusmessage}

**أضيف في: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

رسالة الحالة غير مدعومة بواسطة HTTP/2 (RFC 7540 8.1.2.4). تُرجع سلسلة فارغة.

#### `response.stream` {#responsestream}

**أضيف في: v8.4.0**

- [\<Http2Stream\>](/ar/nodejs/api/http2#class-http2stream)

كائن [`Http2Stream`](/ar/nodejs/api/http2#class-http2stream) الذي يدعم الاستجابة.

#### `response.writableEnded` {#responsewritableended}

**أضيف في: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` بعد استدعاء [`response.end()`](/ar/nodejs/api/http2#responseenddata-encoding-callback). لا يشير هذا الخاصية إلى ما إذا كانت البيانات قد تم تفريغها، ولذلك استخدم [`writable.writableFinished`](/ar/nodejs/api/stream#writablewritablefinished) بدلاً من ذلك.

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**أضيف في: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا تم استدعاء هذا الأسلوب ولم يتم استدعاء [`response.writeHead()`](/ar/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)، فسيتم التبديل إلى وضع العنوان الضمني وتفريغ العناوين الضمنية.

يرسل هذا جزءًا من نص الاستجابة. يمكن استدعاء هذا الأسلوب عدة مرات لتوفير أجزاء متتالية من النص.

في الوحدة `node:http`، يتم حذف نص الاستجابة عندما يكون الطلب هو طلب HEAD. وبالمثل، يجب *ألا* تتضمن الاستجابات `204` و `304` نص رسالة.

يمكن أن يكون `chunk` سلسلة أو مخزن مؤقت. إذا كان `chunk` عبارة عن سلسلة، فإن المعامل الثاني يحدد كيفية ترميزها في دفق بايت. بشكل افتراضي، يكون `encoding` هو `'utf8'`. سيتم استدعاء `callback` عند تفريغ هذا الجزء من البيانات.

هذا هو نص HTTP الخام ولا علاقة له بترميزات نص متعدد الأجزاء ذات المستوى الأعلى التي قد يتم استخدامها.

في المرة الأولى التي يتم فيها استدعاء [`response.write()`](/ar/nodejs/api/http2#responsewritechunk-encoding-callback)، سيتم إرسال معلومات العنوان المخزنة مؤقتًا والجزء الأول من النص إلى العميل. في المرة الثانية التي يتم فيها استدعاء [`response.write()`](/ar/nodejs/api/http2#responsewritechunk-encoding-callback)، تفترض Node.js أن البيانات سيتم دفقها، وترسل البيانات الجديدة بشكل منفصل. وهذا يعني أن الاستجابة يتم تخزينها مؤقتًا حتى الجزء الأول من النص.

يُرجع `true` إذا تم تفريغ البيانات بأكملها بنجاح إلى مخزن kernel المؤقت. يُرجع `false` إذا تم وضع كل أو جزء من البيانات في قائمة الانتظار في ذاكرة المستخدم. سيتم إرسال `'drain'` عندما يصبح المخزن المؤقت خاليًا مرة أخرى.


#### `response.writeContinue()` {#responsewritecontinue}

**تمت إضافتها في: الإصدار 8.4.0**

ترسل الحالة `100 Continue` إلى العميل، مما يشير إلى أنه يجب إرسال نص الطلب. انظر إلى الحدث [`'checkContinue'`](/ar/nodejs/api/http2#event-checkcontinue) في `Http2Server` و `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**تمت إضافتها في: الإصدار 18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ترسل الحالة `103 Early Hints` إلى العميل مع رأس الارتباط، مما يشير إلى أن وكيل المستخدم يمكنه التحميل المسبق/الاتصال المسبق بالموارد المرتبطة. `hints` هو كائن يحتوي على قيم الرؤوس المراد إرسالها مع رسالة التلميحات المبكرة.

**مثال**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.10.0, v10.17.0 | إرجاع `this` من `writeHead()` للسماح بالربط مع `end()`. |
| v8.4.0 | تمت إضافتها في: الإصدار 8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- الإرجاع: [\<http2.Http2ServerResponse\>](/ar/nodejs/api/http2#class-http2http2serverresponse)

ترسل رأس استجابة إلى الطلب. رمز الحالة هو رمز حالة HTTP مكون من 3 أرقام، مثل `404`. الوسيطة الأخيرة، `headers`، هي رؤوس الاستجابة.

إرجاع مرجع إلى `Http2ServerResponse`، بحيث يمكن ربط المكالمات.

للتوافق مع [HTTP/1](/ar/nodejs/api/http)، يمكن تمرير `statusMessage` قابلة للقراءة البشرية كوسيطة ثانية. ومع ذلك، نظرًا لأن `statusMessage` ليس لها معنى داخل HTTP/2، فلن يكون للوسيطة أي تأثير وسيتم إصدار تحذير عملية.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
يتم إعطاء `Content-Length` بالبايت وليس الأحرف. يمكن استخدام واجهة برمجة التطبيقات `Buffer.byteLength()` لتحديد عدد البايت في ترميز معين. في الرسائل الصادرة، لا يتحقق Node.js مما إذا كانت Content-Length وطول النص الذي يتم إرساله متساويين أم لا. ومع ذلك، عند استقبال الرسائل، سيرفض Node.js الرسائل تلقائيًا عندما لا يتطابق `Content-Length` مع حجم الحمولة الفعلي.

يمكن استدعاء هذه الطريقة مرة واحدة على الأكثر في رسالة قبل استدعاء [`response.end()`](/ar/nodejs/api/http2#responseenddata-encoding-callback).

إذا تم استدعاء [`response.write()`](/ar/nodejs/api/http2#responsewritechunk-encoding-callback) أو [`response.end()`](/ar/nodejs/api/http2#responseenddata-encoding-callback) قبل استدعاء هذا، فسيتم حساب الرؤوس الضمنية/القابلة للتغيير واستدعاء هذه الوظيفة.

عندما يتم تعيين الرؤوس باستخدام [`response.setHeader()`](/ar/nodejs/api/http2#responsesetheadername-value)، سيتم دمجها مع أي رؤوس تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)، مع إعطاء الأولوية للرؤوس التي تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers).

```js [ESM]
// إرجاع content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
محاولة تعيين اسم حقل رأس أو قيمة تحتوي على أحرف غير صالحة ستؤدي إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).


## جمع مقاييس أداء HTTP/2 {#collecting-http/2-performance-metrics}

يمكن استخدام واجهة برمجة تطبيقات [مراقب الأداء](/ar/nodejs/api/perf_hooks) لجمع مقاييس الأداء الأساسية لكل مثيل من `Http2Session` و `Http2Stream`.



::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

ستكون خاصية `entryType` الخاصة بـ `PerformanceEntry` مساوية لـ `'http2'`.

ستكون خاصية `name` الخاصة بـ `PerformanceEntry` مساوية إما لـ `'Http2Stream'` أو `'Http2Session'`.

إذا كانت `name` مساوية لـ `Http2Stream`، فسوف يحتوي `PerformanceEntry` على الخصائص الإضافية التالية:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بايتات إطار `DATA` المستلمة لـ `Http2Stream` هذا.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بايتات إطار `DATA` المرسلة لـ `Http2Stream` هذا.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف `Http2Stream` المرتبط.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية بين `startTime` لـ `PerformanceEntry` واستقبال أول إطار `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية بين `startTime` لـ `PerformanceEntry` وإرسال أول إطار `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية بين `startTime` لـ `PerformanceEntry` واستقبال أول رأس.

إذا كانت `name` مساوية لـ `Http2Session`، فسوف يحتوي `PerformanceEntry` على الخصائص الإضافية التالية:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المستلمة لـ `Http2Session` هذا.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المرسلة لـ `Http2Session` هذا.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إطارات HTTP/2 التي استقبلها `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد إطارات HTTP/2 التي أرسلها `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد التدفقات المفتوحة بشكل متزامن خلال عمر `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية المنقضية منذ إرسال إطار `PING` واستقبال إقراره. موجود فقط إذا تم إرسال إطار `PING` على `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) متوسط المدة (بالمللي ثانية) لجميع مثيلات `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد مثيلات `Http2Stream` التي تمت معالجتها بواسطة `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'server'` أو `'client'` لتحديد نوع `Http2Session`.


## ملاحظة حول `:authority` و `host` {#note-on-authority-and-host}

يتطلب HTTP/2 أن تحتوي الطلبات على الرأس الزائف `:authority` أو الرأس `host`. يفضل استخدام `:authority` عند إنشاء طلب HTTP/2 مباشرة، و `host` عند التحويل من HTTP/1 (في الخوادم الوكيلة، على سبيل المثال).

يعود توافق واجهة برمجة التطبيقات إلى `host` إذا لم يكن `:authority` موجودًا. راجع [`request.authority`](/ar/nodejs/api/http2#requestauthority) لمزيد من المعلومات. ومع ذلك، إذا كنت لا تستخدم واجهة برمجة تطبيقات التوافق (أو تستخدم `req.headers` مباشرة)، فأنت بحاجة إلى تنفيذ أي سلوك احتياطي بنفسك.

