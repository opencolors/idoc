---
title: توثيق Node.js - HTTPS
description: توفر وحدة HTTPS في Node.js تنفيذًا لبروتوكول TLS/SSL لتمكين الاتصالات الآمنة عبر HTTP. تشمل الأساليب لإنشاء خوادم وعملاء آمنين، والتعامل مع الشهادات، وإدارة الاتصالات الآمنة.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة HTTPS في Node.js تنفيذًا لبروتوكول TLS/SSL لتمكين الاتصالات الآمنة عبر HTTP. تشمل الأساليب لإنشاء خوادم وعملاء آمنين، والتعامل مع الشهادات، وإدارة الاتصالات الآمنة.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة HTTPS في Node.js تنفيذًا لبروتوكول TLS/SSL لتمكين الاتصالات الآمنة عبر HTTP. تشمل الأساليب لإنشاء خوادم وعملاء آمنين، والتعامل مع الشهادات، وإدارة الاتصالات الآمنة.
---


# HTTPS {#https}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS هو بروتوكول HTTP عبر TLS/SSL. في Node.js، يتم تنفيذه كوحدة نمطية منفصلة.

## تحديد ما إذا كان دعم التشفير غير متاح {#determining-if-crypto-support-is-unavailable}

من الممكن إنشاء Node.js دون تضمين دعم وحدة `node:crypto`. في مثل هذه الحالات، ستؤدي محاولة `import` من `https` أو استدعاء `require('node:https')` إلى ظهور خطأ.

عند استخدام CommonJS، يمكن التقاط الخطأ الذي تم طرحه باستخدام try/catch:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
عند استخدام الكلمة المفتاحية ESM `import` المعجمية، لا يمكن التقاط الخطأ إلا إذا تم تسجيل معالج لـ `process.on('uncaughtException')` *قبل* أي محاولة لتحميل الوحدة (باستخدام، على سبيل المثال، وحدة التحميل المسبق).

عند استخدام ESM، إذا كانت هناك فرصة لتشغيل التعليمات البرمجية على إصدار من Node.js حيث لم يتم تمكين دعم التشفير، ففكر في استخدام الدالة [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) بدلاً من الكلمة المفتاحية `import` المعجمية:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
## صنف: `https.Agent` {#class-httpsagent}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.3.0 | دعم `0` `maxCachedSessions` لتعطيل تخزين جلسة TLS مؤقتًا. |
| v2.5.0 | تمت إضافة المعامل `maxCachedSessions` إلى `options` لإعادة استخدام جلسات TLS. |
| v0.4.5 | تمت الإضافة في: v0.4.5 |
:::

كائن [`Agent`](/ar/nodejs/api/https#class-httpsagent) لـ HTTPS مشابه لـ [`http.Agent`](/ar/nodejs/api/http#class-httpagent). راجع [`https.request()`](/ar/nodejs/api/https#httpsrequestoptions-callback) لمزيد من المعلومات.

### `new Agent([options])` {#new-agentoptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.5.0 | لا تقم بتعيين اسم الخادم تلقائيًا إذا تم تحديد المضيف الهدف باستخدام عنوان IP. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مجموعة من الخيارات القابلة للتكوين لتعيينها على الوكيل. يمكن أن تحتوي على نفس الحقول الموجودة في [`http.Agent(options)`](/ar/nodejs/api/http#new-agentoptions)، و 
    -  `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد جلسات TLS المخزنة مؤقتًا. استخدم `0` لتعطيل تخزين جلسة TLS مؤقتًا. **الافتراضي:** `100`. 
    -  `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قيمة [امتداد إشارة اسم الخادم](https://en.wikipedia.org/wiki/Server_Name_Indication) التي سيتم إرسالها إلى الخادم. استخدم السلسلة الفارغة `''` لتعطيل إرسال الامتداد. **الافتراضي:** اسم مضيف الخادم الهدف، ما لم يتم تحديد الخادم الهدف باستخدام عنوان IP، وفي هذه الحالة يكون الافتراضي هو `''` (بدون امتداد). راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) للحصول على معلومات حول إعادة استخدام جلسة TLS. 
  
 


#### الحدث: `'keylog'` {#event-keylog}

**تمت إضافتها في: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) سطر من نص ASCII، بتنسيق `SSLKEYLOGFILE` الخاص بـ NSS.
- `tlsSocket` [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket) مثيل `tls.TLSSocket` الذي تم إنشاؤه عليه.

يتم إطلاق الحدث `keylog` عندما يتم إنشاء أو استقبال مادة مفتاح بواسطة اتصال يديره هذا الوكيل (عادةً قبل اكتمال المصافحة، ولكن ليس بالضرورة). يمكن تخزين مادة المفتاح هذه لأغراض التصحيح، لأنها تسمح بفك تشفير حركة مرور TLS التي تم التقاطها. قد يتم إطلاقها عدة مرات لكل مقبس.

الاستخدام النموذجي هو إلحاق الأسطر المستلمة بملف نصي مشترك، والذي تستخدمه البرامج لاحقًا (مثل Wireshark) لفك تشفير حركة المرور:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## الفئة: `https.Server` {#class-httpsserver}

**تمت إضافتها في: v0.3.4**

- يمتد من: [\<tls.Server\>](/ar/nodejs/api/tls#class-tlsserver)

راجع [`http.Server`](/ar/nodejs/api/http#class-httpserver) لمزيد من المعلومات.

### `server.close([callback])` {#serverclosecallback}

**تمت إضافتها في: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<https.Server\>](/ar/nodejs/api/https#class-httpsserver)

راجع [`server.close()`](/ar/nodejs/api/http#serverclosecallback) في الوحدة `node:http`.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**تمت إضافتها في: v20.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`server.close()`](/ar/nodejs/api/https#serverclosecallback) ويعيد وعدًا يتحقق عند إغلاق الخادم.

### `server.closeAllConnections()` {#servercloseallconnections}

**تمت إضافتها في: v18.2.0**

راجع [`server.closeAllConnections()`](/ar/nodejs/api/http#servercloseallconnections) في الوحدة `node:http`.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**تمت إضافتها في: v18.2.0**

راجع [`server.closeIdleConnections()`](/ar/nodejs/api/http#servercloseidleconnections) في الوحدة `node:http`.


### `server.headersTimeout` {#serverheaderstimeout}

**تمت الإضافة في: الإصدار 11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `60000`

راجع [`server.headersTimeout`](/ar/nodejs/api/http#serverheaderstimeout) في الوحدة `node:http`.

### `server.listen()` {#serverlisten}

يبدأ خادم HTTPS في الاستماع للاتصالات المشفرة. هذه الطريقة مطابقة لـ [`server.listen()`](/ar/nodejs/api/net#serverlisten) من [`net.Server`](/ar/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `2000`

راجع [`server.maxHeadersCount`](/ar/nodejs/api/http#servermaxheaderscount) في الوحدة `node:http`.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | تم تغيير المهلة الزمنية الافتراضية للطلب من عدم وجود مهلة إلى 300 ثانية (5 دقائق). |
| الإصدار 14.11.0 | تمت الإضافة في: الإصدار 14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `300000`

راجع [`server.requestTimeout`](/ar/nodejs/api/http#serverrequesttimeout) في الوحدة `node:http`.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**تمت الإضافة في: الإصدار 0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `120000` (دقيقتان)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<https.Server\>](/ar/nodejs/api/https#class-httpsserver)

راجع [`server.setTimeout()`](/ar/nodejs/api/http#serversettimeoutmsecs-callback) في الوحدة `node:http`.

### `server.timeout` {#servertimeout}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 13.0.0 | تم تغيير المهلة الزمنية الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| الإصدار 0.11.2 | تمت الإضافة في: الإصدار 0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** 0 (بدون مهلة)

راجع [`server.timeout`](/ar/nodejs/api/http#servertimeout) في الوحدة `node:http`.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**أُضيف في:** الإصدار v8.0.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `5000` (5 ثوانٍ)

راجع [`server.keepAliveTimeout`](/ar/nodejs/api/http#serverkeepalivetimeout) في وحدة `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**أُضيف في:** الإصدار v0.3.4

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يقبل `options` من [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) و [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) و [`http.createServer()`](/ar/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مستمع ليتم إضافته إلى حدث `'request'`.
- الإرجاع: [\<https.Server\>](/ar/nodejs/api/https#class-httpsserver)

::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

أو

::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

لإنشاء الشهادة والمفتاح لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
بعد ذلك، لإنشاء شهادة `pfx` لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.9.0 | يمكن الآن تمرير المعامل `url` مع كائن `options` منفصل. |
| v7.5.0 | يمكن أن يكون المعامل `options` كائن `URL` لـ WHATWG. |
| v0.3.6 | تمت الإضافة في: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) يقبل نفس `options` مثل [`https.request()`](/ar/nodejs/api/https#httpsrequestoptions-callback)، مع تعيين الطريقة إلى GET افتراضيًا.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

مثل [`http.get()`](/ar/nodejs/api/http#httpgetoptions-callback) ولكن لـ HTTPS.

يمكن أن يكون `options` كائنًا أو سلسلة أو كائن [`URL`](/ar/nodejs/api/url#the-whatwg-url-api). إذا كانت `options` سلسلة، فسيتم تحليلها تلقائيًا باستخدام [`new URL()`](/ar/nodejs/api/url#new-urlinput-base). إذا كان كائن [`URL`](/ar/nodejs/api/url#the-whatwg-url-api)، فسيتم تحويله تلقائيًا إلى كائن `options` عادي.



::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | يستخدم الوكيل الآن HTTP Keep-Alive ومهلة 5 ثوانٍ بشكل افتراضي. |
| v0.5.9 | تمت الإضافة في: v0.5.9 |
:::

مثيل عام لـ [`https.Agent`](/ar/nodejs/api/https#class-httpsagent) لجميع طلبات عميل HTTPS. يختلف عن التكوين الافتراضي لـ [`https.Agent`](/ar/nodejs/api/https#class-httpsagent) من خلال تمكين `keepAlive` و `timeout` لمدة 5 ثوانٍ.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | يعتمد خيار `clientCertEngine` على دعم المحرك المخصص في OpenSSL والذي تم إهماله في OpenSSL 3. |
| v16.7.0, v14.18.0 | عند استخدام كائن `URL`، سيتم الآن فك ترميز اسم المستخدم وكلمة المرور اللذين تم تحليلهما بشكل صحيح باستخدام URI. |
| v14.1.0, v13.14.0 | يتم الآن قبول خيار `highWaterMark`. |
| v10.9.0 | يمكن الآن تمرير معلمة `url` مع كائن `options` منفصل. |
| v9.3.0 | يمكن أن تتضمن معلمة `options` الآن `clientCertEngine`. |
| v7.5.0 | يمكن أن تكون معلمة `options` كائن WHATWG `URL`. |
| v0.3.6 | تمت الإضافة في: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) يقبل جميع `options` من [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback)، مع بعض الاختلافات في القيم الافتراضية:
    - `protocol` **افتراضي:** `'https:'`
    - `port` **افتراضي:** `443`
    - `agent` **افتراضي:** `https.globalAgent`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

يجعل الطلب إلى خادم ويب آمن.

يتم أيضًا قبول `options` الإضافية التالية من [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback): `ca`, `cert`, `ciphers`, `clientCertEngine` (مهمل)، `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

يمكن أن يكون `options` كائنًا أو سلسلة أو كائن [`URL`](/ar/nodejs/api/url#the-whatwg-url-api). إذا كانت `options` سلسلة، فسيتم تحليلها تلقائيًا باستخدام [`new URL()`](/ar/nodejs/api/url#new-urlinput-base). إذا كان كائن [`URL`](/ar/nodejs/api/url#the-whatwg-url-api)، فسيتم تحويله تلقائيًا إلى كائن `options` عادي.

`https.request()` يُرجع نسخة من الصنف [`http.ClientRequest`](/ar/nodejs/api/http#class-httpclientrequest). نسخة `ClientRequest` هي دفق قابل للكتابة. إذا احتاج المرء إلى تحميل ملف بطلب POST، فاكتب إلى كائن `ClientRequest`.

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

مثال باستخدام الخيارات من [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback):

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
بدلاً من ذلك، يمكنك إلغاء الاشتراك في تجميع الاتصالات عن طريق عدم استخدام [`Agent`](/ar/nodejs/api/https#class-httpsagent).

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
مثال باستخدام [`URL`](/ar/nodejs/api/url#the-whatwg-url-api) كـ `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
مثال على التثبيت على بصمة الشهادة، أو المفتاح العام (مشابه لـ `pin-sha256`):

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

المخرجات على سبيل المثال:

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```

