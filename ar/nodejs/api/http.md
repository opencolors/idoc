---
title: توثيق وحدة HTTP في Node.js
description: التوثيق الرسمي لوحدة HTTP في Node.js، الذي يوضح كيفية إنشاء خوادم HTTP والعملاء، والتعامل مع الطلبات والاستجابات، وإدارة الأساليب والرؤوس المختلفة لـ HTTP.
head:
  - - meta
    - name: og:title
      content: توثيق وحدة HTTP في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: التوثيق الرسمي لوحدة HTTP في Node.js، الذي يوضح كيفية إنشاء خوادم HTTP والعملاء، والتعامل مع الطلبات والاستجابات، وإدارة الأساليب والرؤوس المختلفة لـ HTTP.
  - - meta
    - name: twitter:title
      content: توثيق وحدة HTTP في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: التوثيق الرسمي لوحدة HTTP في Node.js، الذي يوضح كيفية إنشاء خوادم HTTP والعملاء، والتعامل مع الطلبات والاستجابات، وإدارة الأساليب والرؤوس المختلفة لـ HTTP.
---


# HTTP {#http}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ar/nodejs/api/documentation#stability-index) [Stability: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

يمكن استيراد هذه الوحدة، التي تحتوي على كل من العميل والخادم، عبر `require('node:http')` (CommonJS) أو `import * as http from 'node:http'` (وحدة ES).

تم تصميم واجهات HTTP في Node.js لدعم العديد من ميزات البروتوكول التي كان من الصعب استخدامها تقليديًا. على وجه الخصوص، الرسائل الكبيرة، وربما المشفرة في شكل قطع. تحرص الواجهة على عدم تخزين الطلبات أو الردود بأكملها مؤقتًا، لذلك يتمكن المستخدم من دفق البيانات.

يتم تمثيل رؤوس رسائل HTTP بواسطة كائن مثل هذا:

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
المفاتيح بأحرف صغيرة. القيم لا يتم تعديلها.

من أجل دعم المجموعة الكاملة من تطبيقات HTTP الممكنة، فإن واجهة برمجة تطبيقات HTTP في Node.js منخفضة المستوى للغاية. إنها تتعامل مع معالجة الدفق وتحليل الرسائل فقط. تقوم بتحليل رسالة إلى رؤوس وجسم ولكنها لا تقوم بتحليل الرؤوس الفعلية أو الجسم.

راجع [`message.headers`](/ar/nodejs/api/http#messageheaders) للحصول على تفاصيل حول كيفية التعامل مع الرؤوس المكررة.

يتم الاحتفاظ بالرؤوس الأولية كما تم استقبالها في الخاصية `rawHeaders`، وهي عبارة عن مصفوفة من `[key, value, key2, value2, ...]`. على سبيل المثال، قد يكون لكائن رأس الرسالة السابق قائمة `rawHeaders` مثل ما يلي:

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## الصنف: `http.Agent` {#class-httpagent}

**تمت إضافته في: v0.3.4**

`Agent` مسؤول عن إدارة استمرارية الاتصال وإعادة استخدامه لعملاء HTTP. يحتفظ بقائمة انتظار للطلبات المعلقة لمضيف ومنفذ معينين، ويعيد استخدام اتصال مأخذ توصيل واحد لكل طلب حتى تصبح قائمة الانتظار فارغة، وفي ذلك الوقت يتم تدمير مأخذ التوصيل أو وضعه في تجمع حيث يتم الاحتفاظ به لاستخدامه مرة أخرى للطلبات إلى نفس المضيف والمنفذ. يعتمد ما إذا كان سيتم تدميره أو تجميعه على [الخيار](/ar/nodejs/api/http#new-agentoptions) `keepAlive`.

يتم تمكين TCP Keep-Alive للاتصالات المجمعة، ولكن قد تظل الخوادم تغلق الاتصالات الخاملة، وفي هذه الحالة ستتم إزالتها من التجمع وسيتم إجراء اتصال جديد عند تقديم طلب HTTP جديد لهذا المضيف والمنفذ. قد ترفض الخوادم أيضًا السماح بطلبات متعددة عبر نفس الاتصال، وفي هذه الحالة سيتعين إعادة إنشاء الاتصال لكل طلب ولا يمكن تجميعه. سيظل `Agent` يقدم الطلبات إلى هذا الخادم، ولكن سيحدث كل طلب عبر اتصال جديد.

عندما يتم إغلاق اتصال بواسطة العميل أو الخادم، تتم إزالته من التجمع. سيتم إلغاء إحالة أي مآخذ توصيل غير مستخدمة في التجمع حتى لا تحافظ على تشغيل عملية Node.js عندما لا تكون هناك طلبات معلقة. (انظر [`socket.unref()`](/ar/nodejs/api/net#socketunref)).

من الممارسات الجيدة [`destroy()`](/ar/nodejs/api/http#agentdestroy) مثيل `Agent` عندما لم يعد قيد الاستخدام، لأن مآخذ التوصيل غير المستخدمة تستهلك موارد نظام التشغيل.

تتم إزالة مآخذ التوصيل من وكيل عندما ينبعث مأخذ التوصيل إما حدث `'close'` أو حدث `'agentRemove'`. عند الرغبة في إبقاء طلب HTTP واحد مفتوحًا لفترة طويلة دون الاحتفاظ به في الوكيل، يمكن القيام بشيء مثل ما يلي:

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
يمكن أيضًا استخدام وكيل لطلب فردي. من خلال توفير `{agent: false}` كخيار لوظائف `http.get()` أو `http.request()`، سيتم استخدام `Agent` للاستخدام مرة واحدة مع الخيارات الافتراضية لاتصال العميل.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // إنشاء وكيل جديد لهذا الطلب فقط
}, (res) => {
  // Do stuff with response
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.6.0, v14.17.0 | تغيير الجدولة الافتراضية من "fifo" إلى "lifo". |
| v14.5.0, v12.20.0 | إضافة خيار `scheduling` لتحديد استراتيجية جدولة المقبس الحر. |
| v14.5.0, v12.19.0 | إضافة خيار `maxTotalSockets` إلى مُنشئ الوكيل. |
| v0.3.4 | تمت إضافتها في: v0.3.4 |
:::

- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مجموعة من الخيارات القابلة للتكوين لتعيينها على الوكيل. يمكن أن يحتوي على الحقول التالية:
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) الحفاظ على المقابس حتى في حالة عدم وجود طلبات معلقة، بحيث يمكن استخدامها للطلبات المستقبلية دون الحاجة إلى إعادة إنشاء اتصال TCP. يجب عدم الخلط بينه وبين قيمة `keep-alive` لعنوان `Connection`. يتم إرسال عنوان `Connection: keep-alive` دائمًا عند استخدام وكيل باستثناء الحالات التي يتم فيها تحديد عنوان `Connection` بشكل صريح أو عندما يتم تعيين الخيارين `keepAlive` و `maxSockets` على `false` و `Infinity` على التوالي، وفي هذه الحالة سيتم استخدام `Connection: close`. **الافتراضي:** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عند استخدام الخيار `keepAlive`، يحدد [التأخير الأولي](/ar/nodejs/api/net#socketsetkeepaliveenable-initialdelay) لحزم TCP Keep-Alive. يتم تجاهله عندما يكون الخيار `keepAlive` هو `false` أو `undefined`. **الافتراضي:** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد المقابس المسموح به لكل مضيف. إذا فتح نفس المضيف اتصالات متزامنة متعددة، فسيستخدم كل طلب مقبسًا جديدًا حتى يتم الوصول إلى قيمة `maxSockets`. إذا حاول المضيف فتح اتصالات أكثر من `maxSockets`، فستدخل الطلبات الإضافية إلى قائمة انتظار الطلبات المعلقة، وستدخل حالة الاتصال النشط عند إنهاء اتصال موجود. هذا يضمن وجود `maxSockets` على الأكثر من الاتصالات النشطة في أي وقت، من مضيف معين. **الافتراضي:** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد المقابس المسموح به لجميع المضيفين إجمالاً. سيستخدم كل طلب مقبسًا جديدًا حتى يتم الوصول إلى الحد الأقصى. **الافتراضي:** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد المقابس لكل مضيف لتركها مفتوحة في حالة حرة. ذو صلة فقط إذا تم تعيين `keepAlive` على `true`. **الافتراضي:** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) استراتيجية الجدولة المراد تطبيقها عند اختيار المقبس الحر التالي المراد استخدامه. يمكن أن يكون `'fifo'` أو `'lifo'`. الفرق الرئيسي بين استراتيجيتي الجدولة هو أن `'lifo'` يختار المقبس الأحدث استخدامًا، بينما يختار `'fifo'` المقبس الأقل استخدامًا مؤخرًا. في حالة وجود معدل منخفض من الطلبات في الثانية، فإن جدولة `'lifo'` ستقلل من خطر اختيار مقبس ربما تم إغلاقه بواسطة الخادم بسبب عدم النشاط. في حالة وجود معدل مرتفع من الطلبات في الثانية، فإن جدولة `'fifo'` ستزيد من عدد المقابس المفتوحة، بينما ستحافظ جدولة `'lifo'` على الحد الأدنى قدر الإمكان. **الافتراضي:** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مهلة المقبس بالمللي ثانية. سيؤدي هذا إلى تعيين المهلة عند إنشاء المقبس.
  
 

يتم دعم `options` في [`socket.connect()`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) أيضًا.

لتكوين أي منها، يجب إنشاء مثيل [`http.Agent`](/ar/nodejs/api/http#class-httpagent) مخصص.



::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### ‏`agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**تمت إضافتها في: الإصدار v0.11.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تحتوي على تفاصيل الاتصال. تحقق من [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnectionoptions-connectlistener) لمعرفة تنسيق الخيارات
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء تتلقى المقبس الذي تم إنشاؤه
- الإرجاع: [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

ينتج مقبسًا/تيارًا لاستخدامه في طلبات HTTP.

بشكل افتراضي، هذه الدالة هي نفسها [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnectionoptions-connectlistener). ومع ذلك، قد تتجاوز الوكلاء المخصصون هذه الطريقة في حالة الرغبة في مزيد من المرونة.

يمكن توفير مقبس/تيار بإحدى طريقتين: عن طريق إرجاع المقبس/التيار من هذه الدالة، أو عن طريق تمرير المقبس/التيار إلى `callback`.

تضمن هذه الطريقة إرجاع نسخة من الفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، إلا إذا حدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

`callback` لها توقيع `(err, stream)`.

### ‏`agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**تمت إضافتها في: الإصدار v8.1.0**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يتم استدعاؤها عندما يتم فصل `socket` عن طلب ويمكن الاحتفاظ به بواسطة `Agent`. السلوك الافتراضي هو:

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
يمكن تجاوز هذه الطريقة بواسطة فئة فرعية معينة من `Agent`. إذا أرجعت هذه الطريقة قيمة خاطئة، فسيتم تدمير المقبس بدلاً من الاحتفاظ به للاستخدام مع الطلب التالي.

يمكن أن تكون وسيطة `socket` نسخة من [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex).

### ‏`agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**تمت إضافتها في: الإصدار v8.1.0**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

يتم استدعاؤها عندما يتم إرفاق `socket` بـ `request` بعد الاحتفاظ به بسبب خيارات keep-alive. السلوك الافتراضي هو:

```js [ESM]
socket.ref();
```
يمكن تجاوز هذه الطريقة بواسطة فئة فرعية معينة من `Agent`.

يمكن أن تكون وسيطة `socket` نسخة من [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex).


### `agent.destroy()` {#agentdestroy}

**أضيف في: v0.11.4**

تدمير أي مقابس قيد الاستخدام حاليًا بواسطة الوكيل.

عادة لا يكون من الضروري القيام بذلك. ومع ذلك، إذا كنت تستخدم وكيلًا مع تمكين `keepAlive`، فمن الأفضل إيقاف تشغيل الوكيل بشكل صريح عندما لم تعد هناك حاجة إليه. بخلاف ذلك، قد تظل المقابس مفتوحة لفترة طويلة جدًا قبل أن ينهيها الخادم.

### `agent.freeSockets` {#agentfreesockets}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | أصبح للخاصية الآن نموذج أولي `null`. |
| v0.11.4 | أضيف في: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن يحتوي على مصفوفات من المقابس التي تنتظر حاليًا استخدامها بواسطة الوكيل عند تمكين `keepAlive`. لا تقم بتعديله.

سيتم تدمير المقابس الموجودة في قائمة `freeSockets` تلقائيًا وإزالتها من المصفوفة عند `'timeout'`.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v17.7.0, v16.15.0 | أصبح المعامل `options` اختياريًا الآن. |
| v0.11.4 | أضيف في: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مجموعة من الخيارات التي توفر معلومات لتوليد الاسم
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المجال أو عنوان IP للخادم لإصدار الطلب إليه
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) منفذ الخادم البعيد
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الواجهة المحلية المراد ربطها لاتصالات الشبكة عند إصدار الطلب
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يجب أن يكون 4 أو 6 إذا كان هذا لا يساوي `undefined`.
  
 
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

احصل على اسم فريد لمجموعة من خيارات الطلب، لتحديد ما إذا كان يمكن إعادة استخدام الاتصال. بالنسبة لوكيل HTTP، فإن هذا يرجع `host:port:localAddress` أو `host:port:localAddress:family`. بالنسبة لوكيل HTTPS، يتضمن الاسم CA وشهادة ورموز التشفير وخيارات HTTPS/TLS المحددة الأخرى التي تحدد إمكانية إعادة استخدام المقبس.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**أضيف في:** v0.11.7

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

افتراضيًا مُعيَّن إلى 256. بالنسبة للوكلاء الذين لديهم `keepAlive` مُفعّل، يحدد هذا الحد الأقصى لعدد المقابس التي ستظل مفتوحة في الحالة الحرة.

### `agent.maxSockets` {#agentmaxsockets}

**أضيف في:** v0.3.6

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

افتراضيًا مُعيَّن إلى `Infinity`. يحدد عدد المقابس المتزامنة التي يمكن أن يمتلكها الوكيل مفتوحة لكل أصل. الأصل هو القيمة المرجعة من [`agent.getName()`](/ar/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**أضيف في:** v14.5.0, v12.19.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

افتراضيًا مُعيَّن إلى `Infinity`. يحدد عدد المقابس المتزامنة التي يمكن أن يمتلكها الوكيل مفتوحة. على عكس `maxSockets`، تنطبق هذه المعلمة على جميع الأصول.

### `agent.requests` {#agentrequests}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | الخاصية لديها الآن نموذج أولي `null`. |
| v0.5.9 | أضيف في: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن يحتوي على قوائم انتظار الطلبات التي لم يتم تعيينها بعد للمقابس. لا تعدل.

### `agent.sockets` {#agentsockets}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0 | الخاصية لديها الآن نموذج أولي `null`. |
| v0.3.6 | أضيف في: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن يحتوي على صفائف من المقابس المستخدمة حاليًا بواسطة الوكيل. لا تعدل.

## الفئة: `http.ClientRequest` {#class-httpclientrequest}

**أضيف في:** v0.1.17

- يمتد: [\<http.OutgoingMessage\>](/ar/nodejs/api/http#class-httpoutgoingmessage)

يتم إنشاء هذا الكائن داخليًا وإرجاعه من [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback). إنه يمثل طلبًا *قيد التقدم* تم بالفعل وضع رأسِه في قائمة الانتظار. لا يزال الرأس قابلاً للتغيير باستخدام واجهة برمجة التطبيقات [`setHeader(name, value)`](/ar/nodejs/api/http#requestsetheadername-value) و [`getHeader(name)`](/ar/nodejs/api/http#requestgetheadername) و [`removeHeader(name)`](/ar/nodejs/api/http#requestremoveheadername). سيتم إرسال الرأس الفعلي مع أول جزء بيانات أو عند استدعاء [`request.end()`](/ar/nodejs/api/http#requestenddata-encoding-callback).

للحصول على الاستجابة، أضف مستمعًا لـ [`'response'`](/ar/nodejs/api/http#event-response) إلى كائن الطلب. سيتم إصدار [`'response'`](/ar/nodejs/api/http#event-response) من كائن الطلب عند استلام رؤوس الاستجابة. يتم تنفيذ الحدث [`'response'`](/ar/nodejs/api/http#event-response) بوسيطة واحدة وهي مثيل لـ [`http.IncomingMessage`](/ar/nodejs/api/http#class-httpincomingmessage).

أثناء الحدث [`'response'`](/ar/nodejs/api/http#event-response)، يمكن إضافة مستمعين إلى كائن الاستجابة؛ خاصة للاستماع إلى حدث `'data'`.

إذا لم تتم إضافة معالج [`'response'`](/ar/nodejs/api/http#event-response)، فسيتم تجاهل الاستجابة بالكامل. ومع ذلك، إذا تمت إضافة معالج حدث [`'response'`](/ar/nodejs/api/http#event-response)، فيجب استهلاك البيانات من كائن الاستجابة، إما عن طريق استدعاء `response.read()` متى كان هناك حدث `'readable'`، أو عن طريق إضافة معالج `'data'`، أو عن طريق استدعاء طريقة `.resume()`. حتى يتم استهلاك البيانات، لن يتم تشغيل حدث `'end'`. أيضًا، حتى تتم قراءة البيانات، ستستهلك الذاكرة التي يمكن أن تؤدي في النهاية إلى حدوث خطأ "نفاد ذاكرة العملية".

للتوافق مع الإصدارات السابقة، ستصدر `res` `'error'` فقط إذا كان هناك مستمع `'error'` مسجل.

عيّن رأس `Content-Length` لتقييد حجم نص الاستجابة. إذا تم تعيين [`response.strictContentLength`](/ar/nodejs/api/http#responsestrictcontentlength) إلى `true`، فإن عدم تطابق قيمة رأس `Content-Length` سيؤدي إلى ظهور `Error`، يتم تحديده بواسطة `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ar/nodejs/api/errors#err_http_content_length_mismatch).

يجب أن تكون قيمة `Content-Length` بالبايت، وليس الأحرف. استخدم [`Buffer.byteLength()`](/ar/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) لتحديد طول النص بالبايت.


### الحدث: `'abort'` {#event-abort}

**أُضيف في: v1.4.1**

**تم إهماله منذ: v17.0.0, v16.12.0**

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل. استمع إلى الحدث `'close'` بدلاً من ذلك.
:::

يُطلق عندما يتم إجهاض الطلب من قبل العميل. يتم إطلاق هذا الحدث فقط في أول استدعاء لـ `abort()`.

### الحدث: `'close'` {#event-close}

**أُضيف في: v0.5.4**

يشير إلى أن الطلب قد اكتمل، أو تم إنهاء الاتصال الأساسي له قبل الأوان (قبل اكتمال الاستجابة).

### الحدث: `'connect'` {#event-connect}

**أُضيف في: v0.7.0**

- `response` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يُطلق في كل مرة يستجيب فيها الخادم لطلب بطريقة `CONNECT`. إذا لم يتم الاستماع إلى هذا الحدث، فسيتم إغلاق اتصالات العملاء الذين يتلقون طريقة `CONNECT`.

يضمن تمرير نسخة من الصنف [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) لهذا الحدث، وهو صنف فرعي من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

زوج من العميل والخادم يوضح كيفية الاستماع إلى الحدث `'connect'`:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// إنشاء وكيل لنفق HTTP
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // الاتصال بخادم المصدر
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// الآن الوكيل قيد التشغيل
proxy.listen(1337, '127.0.0.1', () => {

  // إجراء طلب إلى وكيل نفق
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('تم الاتصال!');

    // إجراء طلب عبر نفق HTTP
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// إنشاء وكيل لنفق HTTP
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // الاتصال بخادم المصدر
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// الآن الوكيل قيد التشغيل
proxy.listen(1337, '127.0.0.1', () => {

  // إجراء طلب إلى وكيل نفق
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('تم الاتصال!');

    // إجراء طلب عبر نفق HTTP
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### الحدث: `'continue'` {#event-continue}

**تمت إضافته في: الإصدار 0.3.2**

يصدر هذا الحدث عندما يرسل الخادم استجابة HTTP '100 Continue'، وعادةً ما يكون ذلك لأن الطلب يحتوي على 'Expect: 100-continue'. وهذا توجيه بأن العميل يجب أن يرسل نص الطلب.

### الحدث: `'finish'` {#event-finish}

**تمت إضافته في: الإصدار 0.3.6**

يصدر هذا الحدث عند إرسال الطلب. وبشكل أكثر تحديدًا، يصدر هذا الحدث عندما يتم تسليم الجزء الأخير من رؤوس الاستجابة ونصها إلى نظام التشغيل لإرسالها عبر الشبكة. وهذا لا يعني أن الخادم قد استقبل أي شيء حتى الآن.

### الحدث: `'information'` {#event-information}

**تمت إضافته في: الإصدار 10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

يصدر هذا الحدث عندما يرسل الخادم استجابة وسيطة 1xx (باستثناء 101 Upgrade). سوف يتلقى المستمعون لهذا الحدث كائنًا يحتوي على إصدار HTTP، ورمز الحالة، ورسالة الحالة، وكائن الرؤوس (المفتاح والقيمة)، ومصفوفة بأسماء الرؤوس الأولية متبوعة بقيمها الخاصة.



::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

حالات الترقية 101 لا تطلق هذا الحدث بسبب انقطاعها عن سلسلة طلب/استجابة HTTP التقليدية، مثل مآخذ توصيل الويب أو ترقيات TLS الموضعية أو HTTP 2.0. ليتم إعلامك بإشعارات الترقية 101، استمع إلى الحدث [`'upgrade'`](/ar/nodejs/api/http#event-upgrade) بدلاً من ذلك.


### الحدث: `'response'` {#event-response}

**أضيف في: v0.1.0**

- `response` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)

يتم إطلاقه عند استلام استجابة لهذا الطلب. يتم إطلاق هذا الحدث مرة واحدة فقط.

### الحدث: `'socket'` {#event-socket}

**أضيف في: v0.5.3**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يضمن تمرير هذا الحدث بمثيل للفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

### الحدث: `'timeout'` {#event-timeout}

**أضيف في: v0.7.8**

يتم إطلاقه عندما تنتهي مهلة المقبس الأساسي بسبب عدم النشاط. هذا يخطر فقط بأن المقبس كان خاملاً. يجب تدمير الطلب يدويًا.

انظر أيضاً: [`request.setTimeout()`](/ar/nodejs/api/http#requestsettimeouttimeout-callback).

### الحدث: `'upgrade'` {#event-upgrade}

**أضيف في: v0.1.94**

- `response` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يتم إطلاقه في كل مرة يستجيب فيها الخادم لطلب بترقية. إذا لم يتم الاستماع إلى هذا الحدث وكان رمز حالة الاستجابة 101 تبديل البروتوكولات، فسيتم إغلاق اتصالات العملاء الذين يتلقون رأس ترقية.

يضمن تمرير هذا الحدث بمثيل للفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

زوج خادم عميل يوضح كيفية الاستماع إلى الحدث `'upgrade'`.

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**أضيف في: الإصدار 0.3.8**

**تم الإلغاء منذ: الإصدار 14.1.0، الإصدار 13.14.0**

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء: استخدم [`request.destroy()`](/ar/nodejs/api/http#requestdestroyerror) بدلاً من ذلك.
:::

يشير إلى أن الطلب في طريقه للإلغاء. استدعاء هذا سيؤدي إلى إسقاط البيانات المتبقية في الاستجابة وتدمير المقبس.

### `request.aborted` {#requestaborted}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 17.0.0، الإصدار 16.12.0 | تم الإلغاء منذ: الإصدار 17.0.0، الإصدار 16.12.0 |
| الإصدار 11.0.0 | لم يعد الخاصية `aborted` رقمًا زمنيًا. |
| الإصدار 0.11.14 | أضيف في: الإصدار 0.11.14 |
:::

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء. تحقق من [`request.destroyed`](/ar/nodejs/api/http#requestdestroyed) بدلاً من ذلك.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون الخاصية `request.aborted` بقيمة `true` إذا تم إلغاء الطلب.

### `request.connection` {#requestconnection}

**أضيف في: الإصدار 0.3.0**

**تم الإلغاء منذ: الإصدار 13.0.0**

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء. استخدم [`request.socket`](/ar/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

راجع [`request.socket`](/ar/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**أضيف في: الإصدار 13.2.0، الإصدار 12.16.0**

راجع [`writable.cork()`](/ar/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | يمكن أن يكون المعامل `data` الآن `Uint8Array`. |
| الإصدار 10.0.0 | يعيد هذا الأسلوب الآن مرجعًا إلى `ClientRequest`. |
| الإصدار 0.1.90 | أضيف في: الإصدار 0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ينهي إرسال الطلب. إذا كانت هناك أجزاء غير مرسلة من النص الأساسي، فسيتم إرسالها إلى الدفق. إذا كان الطلب مقسمًا إلى أجزاء، فسيرسل `'0\r\n\r\n'` النهائية.

إذا تم تحديد `data`، فإنه يعادل استدعاء [`request.write(data, encoding)`](/ar/nodejs/api/http#requestwritechunk-encoding-callback) متبوعًا بـ `request.end(callback)`.

إذا تم تحديد `callback`، فسيتم استدعاؤه عند انتهاء دفق الطلب.


### `request.destroy([error])` {#requestdestroyerror}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.5.0 | تُرجع الدالة `this` للاتساق مع تدفقات القراءة الأخرى (Readable streams). |
| v0.3.0 | تمت الإضافة في: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) اختياري، خطأ ليتم إصداره مع حدث `'error'`.
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

تدمير الطلب. بشكل اختياري، إصدار حدث `'error'` وإصدار حدث `'close'`. سيؤدي استدعاء هذا إلى إسقاط البيانات المتبقية في الاستجابة وتدمير المقبس.

انظر [`writable.destroy()`](/ar/nodejs/api/stream#writabledestroyerror) لمزيد من التفاصيل.

#### `request.destroyed` {#requestdestroyed}

**تمت الإضافة في: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` بعد استدعاء [`request.destroy()`](/ar/nodejs/api/http#requestdestroyerror).

انظر [`writable.destroyed`](/ar/nodejs/api/stream#writabledestroyed) لمزيد من التفاصيل.

### `request.finished` {#requestfinished}

**تمت الإضافة في: v0.0.1**

**تم الإيقاف منذ: v13.4.0, v12.16.0**

::: danger [مستقر: 0 - تم الإيقاف]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف. استخدم [`request.writableEnded`](/ar/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون خاصية `request.finished` بقيمة `true` إذا تم استدعاء [`request.end()`](/ar/nodejs/api/http#requestenddata-encoding-callback). سيتم استدعاء `request.end()` تلقائيًا إذا تم بدء الطلب عبر [`http.get()`](/ar/nodejs/api/http#httpgetoptions-callback).

### `request.flushHeaders()` {#requestflushheaders}

**تمت الإضافة في: v1.6.0**

مسح رؤوس الطلب.

لأسباب تتعلق بالكفاءة، يقوم Node.js عادةً بتخزين رؤوس الطلب مؤقتًا حتى يتم استدعاء `request.end()` أو كتابة أول جزء من بيانات الطلب. ثم يحاول تجميع رؤوس الطلب والبيانات في حزمة TCP واحدة.

هذا مرغوب فيه عادةً (فهو يوفر رحلة ذهابًا وإيابًا TCP)، ولكن ليس عندما لا يتم إرسال البيانات الأولى حتى وقت لاحق. تتجاوز `request.flushHeaders()` التحسين وتبدأ الطلب.


### `request.getHeader(name)` {#requestgetheadername}

**تمت الإضافة في: الإصدار v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يقرأ عنوانًا في الطلب. الاسم غير حساس لحالة الأحرف. يعتمد نوع القيمة المرجعة على الوسائط المقدمة إلى [`request.setHeader()`](/ar/nodejs/api/http#requestsetheadername-value).

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' is 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' is of type number
const cookie = request.getHeader('Cookie');
// 'cookie' is of type string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**تمت الإضافة في: الإصدار v7.7.0**

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع مصفوفة تحتوي على الأسماء الفريدة للعناوين الصادرة الحالية. جميع أسماء العناوين بأحرف صغيرة.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**تمت الإضافة في: الإصدار v7.7.0**

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع نسخة ضحلة من العناوين الصادرة الحالية. نظرًا لاستخدام نسخة ضحلة ، يمكن تغيير قيم المصفوفة دون إجراء مكالمات إضافية لطرق وحدة http المختلفة المتعلقة بالعنوان. مفاتيح الكائن المرجع هي أسماء الرؤوس والقيم هي قيم الرؤوس المقابلة. جميع أسماء الرؤوس بأحرف صغيرة.

الكائن الذي تم إرجاعه بواسطة طريقة `request.getHeaders()` *لا يرث* بشكل نموذجي من JavaScript `Object`. هذا يعني أن طرق `Object` النموذجية مثل `obj.toString()` و `obj.hasOwnProperty()` وغيرها غير محددة و *لن تعمل*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**أُضيف في: v15.13.0, v14.17.0**

- القيمة المعادة: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ترجع مصفوفة تحتوي على الأسماء الفريدة للعناوين الأولية الصادرة الحالية. يتم إرجاع أسماء العناوين مع تحديد حالتها الدقيقة.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**أُضيف في: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- القيمة المعادة: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ترجع `true` إذا تم تعيين العنوان المحدد بواسطة `name` حاليًا في العناوين الصادرة. مطابقة اسم العنوان غير حساسة لحالة الأحرف.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `2000`

يحدد الحد الأقصى لعدد رؤوس الاستجابة. إذا تم تعيينه على 0، فلن يتم تطبيق أي حد.

### `request.path` {#requestpath}

**أُضيف في: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الطلب.

### `request.method` {#requestmethod}

**أُضيف في: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) طريقة الطلب.

### `request.host` {#requesthost}

**أُضيف في: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مضيف الطلب.

### `request.protocol` {#requestprotocol}

**أُضيف في: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) بروتوكول الطلب.

### `request.removeHeader(name)` {#requestremoveheadername}

**أُضيف في: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يزيل رأسًا تم تعريفه بالفعل في كائن العناوين.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**تمت إضافته في: الإصدار v13.0.0، الإصدار v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان الطلب يتم إرساله عبر مقبس معاد استخدامه.

عند إرسال طلب من خلال وكيل مُفعّل بالاحتفاظ بالاتصال، قد يتم إعادة استخدام المقبس الأساسي. ولكن إذا أغلق الخادم الاتصال في وقت غير مناسب، فقد يواجه العميل خطأ "ECONNRESET".

::: code-group
```js [ESM]
import http from 'node:http';

// يحتوي الخادم على مهلة احتفاظ بالاتصال مدتها 5 ثوانٍ افتراضيًا
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // تكييف وكيل الاحتفاظ بالاتصال
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // لا تفعل شيئًا
    });
  });
}, 5000); // إرسال الطلب على فاصل زمني قدره 5 ثوانٍ بحيث يسهل الوصول إلى مهلة الخمول
```

```js [CJS]
const http = require('node:http');

// يحتوي الخادم على مهلة احتفاظ بالاتصال مدتها 5 ثوانٍ افتراضيًا
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // تكييف وكيل الاحتفاظ بالاتصال
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // لا تفعل شيئًا
    });
  });
}, 5000); // إرسال الطلب على فاصل زمني قدره 5 ثوانٍ بحيث يسهل الوصول إلى مهلة الخمول
```
:::

من خلال تحديد ما إذا كان الطلب قد أعاد استخدام المقبس أم لا، يمكننا إجراء إعادة محاولة تلقائية للخطأ بناءً عليه.

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // تحقق مما إذا كانت إعادة المحاولة مطلوبة
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // تحقق مما إذا كانت إعادة المحاولة مطلوبة
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**تمت الإضافة في: الإصدار v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يُعيّن قيمة رأس واحدة لكائن الرؤوس. إذا كان هذا الرأس موجودًا بالفعل في الرؤوس المراد إرسالها، فسيتم استبدال قيمته. استخدم مصفوفة من السلاسل هنا لإرسال رؤوس متعددة بنفس الاسم. سيتم تخزين القيم غير النصية دون تعديل. لذلك، قد تُرجع [`request.getHeader()`](/ar/nodejs/api/http#requestgetheadername) قيمًا غير نصية. ومع ذلك، سيتم تحويل القيم غير النصية إلى سلاسل للإرسال عبر الشبكة.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
أو

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
عندما تكون القيمة سلسلة، سيتم طرح استثناء إذا كانت تحتوي على أحرف خارج ترميز `latin1`.

إذا كنت بحاجة إلى تمرير أحرف UTF-8 في القيمة، فيرجى ترميز القيمة باستخدام معيار [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**تمت الإضافة في: الإصدار v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

بمجرد تعيين مقبس لهذا الطلب وتوصيله، سيتم استدعاء [`socket.setNoDelay()`](/ar/nodejs/api/net#socketsetnodelaynodelay).

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**تمت الإضافة في: الإصدار v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

بمجرد تعيين مقبس لهذا الطلب وتوصيله، سيتم استدعاء [`socket.setKeepAlive()`](/ar/nodejs/api/net#socketsetkeepaliveenable-initialdelay).


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.0.0 | تم تعيين مهلة المقبس باستمرار فقط عند اتصال المقبس. |
| v0.5.9 | تمت الإضافة في: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) بالملي ثانية قبل انتهاء مهلة الطلب.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة اختيارية يتم استدعاؤها عند حدوث مهلة. نفس الربط بحدث `'timeout'`.
- الإرجاع: [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

بمجرد تعيين مقبس لهذا الطلب واتصاله، سيتم استدعاء [`socket.setTimeout()`](/ar/nodejs/api/net#socketsettimeouttimeout-callback).

### `request.socket` {#requestsocket}

**تمت الإضافة في: v0.3.0**

- [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

مرجع إلى المقبس الأساسي. عادةً لا يرغب المستخدمون في الوصول إلى هذه الخاصية. على وجه الخصوص، لن يصدر المقبس أحداث `'readable'` بسبب كيفية إرفاق محلل البروتوكول بالمقبس.

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```
:::

يضمن أن تكون هذه الخاصية مثيلاً للفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).


### `request.uncork()` {#requestuncork}

**أُضيف في: v13.2.0, v12.16.0**

راجع [`writable.uncork()`](/ar/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**أُضيف في: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون القيمة `true` بعد استدعاء [`request.end()`](/ar/nodejs/api/http#requestenddata-encoding-callback). لا يشير هذا الخاصية إلى ما إذا كان قد تم تفريغ البيانات أم لا، ولاستخدام هذا، استخدم [`request.writableFinished`](/ar/nodejs/api/http#requestwritablefinished) بدلاً من ذلك.

### `request.writableFinished` {#requestwritablefinished}

**أُضيف في: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون القيمة `true` إذا تم تفريغ جميع البيانات إلى النظام الأساسي، قبل إصدار الحدث [`'finish'`](/ar/nodejs/api/http#event-finish) مباشرةً.

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن يكون المعامل `chunk` الآن `Uint8Array`. |
| v0.1.29 | أُضيف في: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يرسل جزءًا من النص الأساسي. يمكن استدعاء هذه الطريقة عدة مرات. إذا لم يتم تعيين `Content-Length`، فسيتم ترميز البيانات تلقائيًا في ترميز نقل HTTP Chunked، بحيث يعرف الخادم متى تنتهي البيانات. تتم إضافة الرأس `Transfer-Encoding: chunked`. استدعاء [`request.end()`](/ar/nodejs/api/http#requestenddata-encoding-callback) ضروري لإنهاء إرسال الطلب.

المعامل `encoding` اختياري وينطبق فقط عندما يكون `chunk` سلسلة نصية. القيمة الافتراضية هي `'utf8'`.

المعامل `callback` اختياري وسيتم استدعاؤه عند تفريغ هذا الجزء من البيانات، ولكن فقط إذا كان الجزء غير فارغ.

إرجاع `true` إذا تم تفريغ البيانات بأكملها بنجاح إلى مخزن kernel المؤقت. إرجاع `false` إذا تم وضع كل أو جزء من البيانات في قائمة الانتظار في ذاكرة المستخدم. سيتم إصدار `'drain'` عندما يكون المخزن المؤقت خاليًا مرة أخرى.

عند استدعاء الدالة `write` بسلسلة نصية أو مخزن مؤقت فارغ، فإنها لا تفعل شيئًا وتنتظر المزيد من الإدخال.


## الصنف: `http.Server` {#class-httpserver}

**أُضيف في: الإصدار 0.1.17**

- يمتد من: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

### الحدث: `'checkContinue'` {#event-checkcontinue}

**أُضيف في: الإصدار 0.3.0**

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يُطلق في كل مرة يتم فيها استقبال طلب مع `Expect: 100-continue` في HTTP. إذا لم يتم الاستماع إلى هذا الحدث، فسيستجيب الخادم تلقائيًا بـ `100 Continue` كما هو مناسب.

تتضمن معالجة هذا الحدث استدعاء [`response.writeContinue()`](/ar/nodejs/api/http#responsewritecontinue) إذا كان يجب على العميل الاستمرار في إرسال نص الطلب، أو إنشاء استجابة HTTP مناسبة (مثل 400 Bad Request) إذا كان لا ينبغي للعميل الاستمرار في إرسال نص الطلب.

عندما يتم إطلاق هذا الحدث ومعالجته، لن يتم إطلاق الحدث [`'request'`](/ar/nodejs/api/http#event-request).

### الحدث: `'checkExpectation'` {#event-checkexpectation}

**أُضيف في: الإصدار 5.5.0**

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يُطلق في كل مرة يتم فيها استقبال طلب مع رأس `Expect` في HTTP، حيث القيمة ليست `100-continue`. إذا لم يتم الاستماع إلى هذا الحدث، فسيستجيب الخادم تلقائيًا بـ `417 Expectation Failed` كما هو مناسب.

عندما يتم إطلاق هذا الحدث ومعالجته، لن يتم إطلاق الحدث [`'request'`](/ar/nodejs/api/http#event-request).

### الحدث: `'clientError'` {#event-clienterror}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.0.0 | سيعيد السلوك الافتراضي 431 Request Header Fields Too Large إذا حدث خطأ HPE_HEADER_OVERFLOW. |
| v9.4.0 | `rawPacket` هو المخزن المؤقت الحالي الذي تم تحليله للتو. إضافة هذا المخزن المؤقت إلى كائن الخطأ في الحدث `'clientError'` يجعل من الممكن للمطورين تسجيل الحزمة المعطوبة. |
| v6.0.0 | لن يتم اتخاذ الإجراء الافتراضي المتمثل في استدعاء `.destroy()` على `socket` إذا كانت هناك مستمعين مرفقين بـ `'clientError'`. |
| v0.1.94 | أُضيف في: الإصدار 0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

إذا أطلق اتصال عميل حدث `'error'`، فسيتم إعادة توجيهه إلى هنا. يكون المستمع لهذا الحدث مسؤولاً عن إغلاق/تدمير المقبس الأساسي. على سبيل المثال، قد يرغب المرء في إغلاق المقبس بشكل أكثر سلاسة مع استجابة HTTP مخصصة بدلاً من قطع الاتصال فجأة. **يجب إغلاق المقبس أو تدميره** قبل أن ينتهي المستمع.

يضمن هذا الحدث تمرير نسخة من الصنف [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهو صنف فرعي من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

السلوك الافتراضي هو محاولة إغلاق المقبس باستجابة HTTP '400 Bad Request'، أو استجابة HTTP '431 Request Header Fields Too Large' في حالة خطأ [`HPE_HEADER_OVERFLOW`](/ar/nodejs/api/errors#hpe_header_overflow). إذا كان المقبس غير قابل للكتابة أو تم إرسال رؤوس [`http.ServerResponse`](/ar/nodejs/api/http#class-httpserverresponse) المرفقة الحالية، فسيتم تدميره على الفور.

`socket` هو كائن [`net.Socket`](/ar/nodejs/api/net#class-netsocket) الذي نشأ منه الخطأ.



::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

عندما يحدث الحدث `'clientError'`، لا يوجد كائن `request` أو `response`، لذلك يجب كتابة أي استجابة HTTP يتم إرسالها، بما في ذلك رؤوس الاستجابة والحمولة، مباشرةً إلى كائن `socket`. يجب توخي الحذر لضمان أن تكون الاستجابة رسالة استجابة HTTP منسقة بشكل صحيح.

`err` هو نسخة من `Error` مع عمودين إضافيين:

- `bytesParsed`: عدد البايتات لحزمة الطلب التي ربما قام Node.js بتحليلها بشكل صحيح؛
- `rawPacket`: الحزمة الخام للطلب الحالي.

في بعض الحالات، يكون العميل قد استقبل بالفعل الاستجابة و/أو تم تدمير المقبس بالفعل، كما هو الحال في حالة أخطاء `ECONNRESET`. قبل محاولة إرسال بيانات إلى المقبس، من الأفضل التحقق من أنه لا يزال قابلاً للكتابة.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### الحدث: `'close'` {#event-close_1}

**تمت الإضافة في: الإصدار v0.1.4**

يتم إطلاقه عند إغلاق الخادم.

### الحدث: `'connect'` {#event-connect_1}

**تمت الإضافة في: الإصدار v0.7.0**

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage) وسائط لطلب HTTP، كما هو الحال في الحدث [`'request'`](/ar/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex) مقبس الشبكة بين الخادم والعميل
- `head` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) الحزمة الأولى من دفق التوجيه النفقي (قد تكون فارغة)

يتم إطلاقه في كل مرة يطلب فيها عميل طريقة HTTP `CONNECT`. إذا لم يتم الاستماع إلى هذا الحدث، فسيتم إغلاق اتصالات العملاء الذين يطلبون طريقة `CONNECT`.

يضمن تمرير مثيل من الفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) إلى هذا الحدث، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس بخلاف [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

بعد إطلاق هذا الحدث، لن يحتوي مقبس الطلب على مستمع حدث `'data'`، مما يعني أنه يجب ربطه للتعامل مع البيانات المرسلة إلى الخادم على هذا المأخذ.

### الحدث: `'connection'` {#event-connection}

**تمت الإضافة في: الإصدار v0.1.0**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يتم إطلاق هذا الحدث عند إنشاء دفق TCP جديد. عادةً ما يكون `socket` كائنًا من النوع [`net.Socket`](/ar/nodejs/api/net#class-netsocket). عادةً لا يرغب المستخدمون في الوصول إلى هذا الحدث. على وجه الخصوص، لن يطلق المأخذ أحداث `'readable'` بسبب كيفية ارتباط محلل البروتوكول بالمأخذ. يمكن أيضًا الوصول إلى `socket` في `request.socket`.

يمكن أيضًا إطلاق هذا الحدث صراحةً من قبل المستخدمين لإدخال الاتصالات في خادم HTTP. في هذه الحالة، يمكن تمرير أي دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex).

إذا تم استدعاء `socket.setTimeout()` هنا، فسيتم استبدال المهلة بـ `server.keepAliveTimeout` عندما يخدم المأخذ طلبًا (إذا كانت قيمة `server.keepAliveTimeout` غير صفرية).

يضمن تمرير مثيل من الفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) إلى هذا الحدث، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس بخلاف [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).


### الحدث: `'dropRequest'` {#event-droprequest}

**تمت إضافته في: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage) وسائط طلب HTTP، كما هي في الحدث [`'request'`](/ar/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex) مأخذ توصيل الشبكة بين الخادم والعميل

عندما يصل عدد الطلبات على مأخذ توصيل إلى عتبة `server.maxRequestsPerSocket`، سيسقط الخادم الطلبات الجديدة ويصدر الحدث `'dropRequest'` بدلاً من ذلك، ثم يرسل الرمز `503` إلى العميل.

### الحدث: `'request'` {#event-request}

**تمت إضافته في: v0.1.0**

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يتم إصداره في كل مرة يكون هناك طلب. قد يكون هناك عدة طلبات لكل اتصال (في حالة اتصالات HTTP Keep-Alive).

### الحدث: `'upgrade'` {#event-upgrade_1}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | لم يعد الاستماع إلى هذا الحدث يتسبب في تدمير مأخذ التوصيل إذا أرسل العميل رأس ترقية. |
| v0.1.94 | تمت إضافته في: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage) وسائط طلب HTTP، كما هي في الحدث [`'request'`](/ar/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex) مأخذ توصيل الشبكة بين الخادم والعميل
- `head` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) الحزمة الأولى من التدفق الذي تمت ترقيته (قد تكون فارغة)

يتم إصداره في كل مرة يطلب فيها العميل ترقية HTTP. الاستماع إلى هذا الحدث اختياري ولا يمكن للعملاء الإصرار على تغيير البروتوكول.

بعد إصدار هذا الحدث، لن يكون لمأخذ التوصيل الخاص بالطلب مستمع حدث `'data'`، مما يعني أنه يجب ربطه للتعامل مع البيانات المرسلة إلى الخادم على مأخذ التوصيل هذا.

يضمن هذا الحدث تمرير مثيل لفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مأخذ توصيل آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).


### `server.close([callback])` {#serverclosecallback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | تقوم الطريقة بإغلاق الاتصالات الخاملة قبل الإرجاع. |
| v0.1.90 | تمت إضافتها في: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يمنع الخادم من قبول اتصالات جديدة ويغلق جميع الاتصالات المتصلة بهذا الخادم والتي لا ترسل طلبًا أو تنتظر استجابة. انظر [`net.Server.close()`](/ar/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// أغلق الخادم بعد 10 ثوانٍ
setTimeout(() => {
  server.close(() => {
    console.log('تم إغلاق الخادم على المنفذ 8000 بنجاح');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**تمت إضافتها في: v18.2.0**

يغلق جميع اتصالات HTTP(S) المنشأة المتصلة بهذا الخادم، بما في ذلك الاتصالات النشطة المتصلة بهذا الخادم والتي ترسل طلبًا أو تنتظر استجابة. هذا *لا* يدمر المقابس التي تمت ترقيتها إلى بروتوكول مختلف، مثل WebSocket أو HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// أغلق الخادم بعد 10 ثوانٍ
setTimeout(() => {
  server.close(() => {
    console.log('تم إغلاق الخادم على المنفذ 8000 بنجاح');
  });
  // يغلق جميع الاتصالات، مما يضمن إغلاق الخادم بنجاح
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**تمت إضافتها في: v18.2.0**

يغلق جميع الاتصالات المتصلة بهذا الخادم والتي لا ترسل طلبًا أو تنتظر استجابة.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// أغلق الخادم بعد 10 ثوانٍ
setTimeout(() => {
  server.close(() => {
    console.log('تم إغلاق الخادم على المنفذ 8000 بنجاح');
  });
  // يغلق الاتصالات الخاملة، مثل اتصالات keep-alive. سيغلق الخادم
  // بمجرد انتهاء الاتصالات النشطة المتبقية
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.4.0, v18.14.0 | تم الآن تعيين القيمة الافتراضية لتكون الحد الأدنى بين 60000 (60 ثانية) أو `requestTimeout`. |
| v11.3.0, v10.14.0 | تمت إضافته في: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** الحد الأدنى بين [`server.requestTimeout`](/ar/nodejs/api/http#serverrequesttimeout) أو `60000`.

يحدد مقدار الوقت الذي ينتظره المحلل لاستقبال رؤوس HTTP الكاملة.

إذا انتهت المهلة، يستجيب الخادم بالحالة 408 دون إعادة توجيه الطلب إلى مستمع الطلب ثم يغلق الاتصال.

يجب تعيينه على قيمة غير صفرية (على سبيل المثال، 120 ثانية) للحماية من هجمات رفض الخدمة المحتملة في حالة نشر الخادم دون وكيل عكسي أمامه.

### `server.listen()` {#serverlisten}

يبدأ خادم HTTP في الاستماع للاتصالات. هذه الطريقة مماثلة لـ [`server.listen()`](/ar/nodejs/api/net#serverlisten) من [`net.Server`](/ar/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**تمت إضافته في: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان الخادم يستمع للاتصالات أم لا.

### `server.maxHeadersCount` {#servermaxheaderscount}

**تمت إضافته في: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `2000`

يحدد الحد الأقصى لعدد الرؤوس الواردة. إذا تم تعيينه على 0، فلن يتم تطبيق أي حد.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تم تغيير مهلة الطلب الافتراضية من عدم وجود مهلة إلى 300 ثانية (5 دقائق). |
| v14.11.0 | تمت إضافته في: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `300000`

يحدد قيمة المهلة بالمللي ثانية لاستقبال الطلب بأكمله من العميل.

إذا انتهت المهلة، يستجيب الخادم بالحالة 408 دون إعادة توجيه الطلب إلى مستمع الطلب ثم يغلق الاتصال.

يجب تعيينه على قيمة غير صفرية (على سبيل المثال، 120 ثانية) للحماية من هجمات رفض الخدمة المحتملة في حالة نشر الخادم دون وكيل عكسي أمامه.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تم تغيير المهلة الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| v0.9.12 | تمت الإضافة في: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** 0 (بدون مهلة)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<http.Server\>](/ar/nodejs/api/http#class-httpserver)

يضبط قيمة المهلة للمآخذ، ويصدر حدث `'timeout'` على كائن الخادم، ويمرر المأخذ كوسيطة، إذا حدثت مهلة.

إذا كان هناك مستمع حدث `'timeout'` على كائن الخادم، فسيتم استدعاؤه باستخدام المأخذ الذي انتهت مهلته كوسيطة.

بشكل افتراضي، لا يقوم الخادم بإنهاء مهلة المآخذ. ومع ذلك، إذا تم تعيين رد نداء لحدث `'timeout'` الخاص بالخادم، فيجب معالجة المهلات بشكل صريح.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**تمت الإضافة في: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الطلبات لكل مأخذ. **افتراضي:** 0 (بلا حدود)

الحد الأقصى لعدد الطلبات التي يمكن للمأخذ التعامل معها قبل إغلاق اتصال البقاء على قيد الحياة.

ستؤدي القيمة `0` إلى تعطيل الحد.

عند الوصول إلى الحد، سيتم تعيين قيمة رأس `Connection` إلى `close`، ولكن لن يتم إغلاق الاتصال فعليًا، وستحصل الطلبات اللاحقة المرسلة بعد الوصول إلى الحد على `503 Service Unavailable` كرد.

### `server.timeout` {#servertimeout}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.0.0 | تم تغيير المهلة الافتراضية من 120 ثانية إلى 0 (بدون مهلة). |
| v0.9.12 | تمت الإضافة في: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المهلة بالمللي ثانية. **افتراضي:** 0 (بدون مهلة)

عدد المللي ثانية من عدم النشاط قبل افتراض انتهاء مهلة المأخذ.

ستؤدي القيمة `0` إلى تعطيل سلوك المهلة على الاتصالات الواردة.

تم إعداد منطق مهلة المأخذ عند الاتصال، لذا فإن تغيير هذه القيمة يؤثر فقط على الاتصالات الجديدة بالخادم، وليس على أي اتصالات موجودة.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**تمت الإضافة في: الإصدار v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المهلة بالمللي ثانية. **افتراضي:** `5000` (5 ثوانٍ).

عدد المللي ثانية من عدم النشاط التي يحتاجها الخادم للانتظار للحصول على بيانات واردة إضافية، بعد الانتهاء من كتابة آخر استجابة، قبل تدمير المقبس. إذا تلقى الخادم بيانات جديدة قبل انتهاء مهلة الإبقاء على قيد الحياة، فسيقوم بإعادة تعيين مهلة عدم النشاط المنتظمة، أي [`server.timeout`](/ar/nodejs/api/http#servertimeout).

ستؤدي القيمة `0` إلى تعطيل سلوك مهلة الإبقاء على قيد الحياة على الاتصالات الواردة. تجعل القيمة `0` خادم HTTP يتصرف بشكل مشابه لإصدارات Node.js قبل الإصدار 8.0.0، والتي لم يكن لديها مهلة إبقاء على قيد الحياة.

يتم إعداد منطق مهلة المقبس عند الاتصال، لذا فإن تغيير هذه القيمة يؤثر فقط على الاتصالات الجديدة بالخادم، وليس على أي اتصالات موجودة.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**تمت الإضافة في: الإصدار v20.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`server.close()`](/ar/nodejs/api/http#serverclosecallback) ويعيد وعدًا يتحقق عند إغلاق الخادم.

## الصنف: `http.ServerResponse` {#class-httpserverresponse}

**تمت الإضافة في: الإصدار v0.1.17**

- يمتد: [\<http.OutgoingMessage\>](/ar/nodejs/api/http#class-httpoutgoingmessage)

يتم إنشاء هذا الكائن داخليًا بواسطة خادم HTTP، وليس بواسطة المستخدم. يتم تمريره كمعامل ثانٍ إلى الحدث [`'request'`](/ar/nodejs/api/http#event-request).

### الحدث: `'close'` {#event-close_2}

**تمت الإضافة في: الإصدار v0.6.7**

يشير إلى أن الاستجابة قد اكتملت، أو أن الاتصال الأساسي قد انتهى قبل الأوان (قبل اكتمال الاستجابة).

### الحدث: `'finish'` {#event-finish_1}

**تمت الإضافة في: الإصدار v0.3.6**

يتم إطلاقه عند إرسال الاستجابة. وبشكل أكثر تحديدًا، يتم إطلاق هذا الحدث عندما يتم تسليم الجزء الأخير من رؤوس الاستجابة والجسم إلى نظام التشغيل للإرسال عبر الشبكة. لا يعني ذلك أن العميل قد تلقى أي شيء بعد.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**أضيف في: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

تضيف هذه الطريقة تذييلات HTTP (رأس ولكن في نهاية الرسالة) إلى الاستجابة.

سيتم إرسال التذييلات **فقط** إذا تم استخدام ترميز مُجزأ للاستجابة؛ وإذا لم يكن الأمر كذلك (على سبيل المثال، إذا كان الطلب HTTP/1.0)، فسيتم تجاهلها بصمت.

يتطلب HTTP إرسال رأس `Trailer` لإرسال التذييلات، مع قائمة بحقول الرأس في قيمتها. على سبيل المثال،

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
محاولة تعيين اسم حقل رأس أو قيمة تحتوي على أحرف غير صالحة ستؤدي إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

### `response.connection` {#responseconnection}

**أضيف في: v0.3.0**

**تم إهماله منذ: v13.0.0**

::: danger [ثابت: 0 - مهمل]
[ثابت: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. استخدم [`response.socket`](/ar/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

انظر [`response.socket`](/ar/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**أضيف في: v13.2.0, v12.16.0**

انظر [`writable.cork()`](/ar/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن تكون معلمة `data` الآن `Uint8Array`. |
| v10.0.0 | تُرجع هذه الطريقة الآن إشارة إلى `ServerResponse`. |
| v0.1.90 | أضيف في: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

تشير هذه الطريقة إلى الخادم أنه تم إرسال جميع رؤوس الاستجابة ونصها؛ يجب أن يعتبر الخادم هذه الرسالة كاملة. يجب استدعاء الطريقة `response.end()` في كل استجابة.

إذا تم تحديد `data`، فسيكون تأثيرها مشابهًا لاستدعاء [`response.write(data, encoding)`](/ar/nodejs/api/http#responsewritechunk-encoding-callback) متبوعًا بـ `response.end(callback)`.

إذا تم تحديد `callback`، فسيتم استدعاؤها عند انتهاء تدفق الاستجابة.


### `response.finished` {#responsefinished}

**تمت الإضافة في: v0.0.2**

**تم الإيقاف منذ: v13.4.0, v12.16.0**

::: danger [مستقر: 0 - تم الإيقاف]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف. استخدم [`response.writableEnded`](/ar/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون الخاصية `response.finished` بقيمة `true` إذا تم استدعاء [`response.end()`](/ar/nodejs/api/http#responseenddata-encoding-callback).

### `response.flushHeaders()` {#responseflushheaders}

**تمت الإضافة في: v1.6.0**

يقوم بتفريغ رؤوس الاستجابة. انظر أيضًا: [`request.flushHeaders()`](/ar/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**تمت الإضافة في: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يقرأ رأسًا تم وضعه بالفعل في قائمة الانتظار ولكن لم يتم إرساله إلى العميل. الاسم غير حساس لحالة الأحرف. يعتمد نوع القيمة المرجعة على الوسائط المقدمة إلى [`response.setHeader()`](/ar/nodejs/api/http#responsesetheadername-value).

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType is 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength is of type number
const setCookie = response.getHeader('set-cookie');
// setCookie is of type string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**تمت الإضافة في: v7.7.0**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع مصفوفة تحتوي على الأسماء الفريدة للرؤوس الصادرة الحالية. جميع أسماء الرؤوس بأحرف صغيرة.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**تمت الإضافة في: الإصدار v7.7.0**

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع نسخة سطحية من الرؤوس الصادرة الحالية. نظرًا لاستخدام نسخة سطحية، قد تتغير قيم المصفوفة بدون استدعاءات إضافية لطرق وحدة نمطية http المختلفة المتعلقة بالرأس. مفاتيح الكائن الذي تم إرجاعه هي أسماء الرأس والقيم هي قيم الرأس المقابلة. جميع أسماء الرأس بأحرف صغيرة.

الكائن الذي تم إرجاعه بواسطة طريقة `response.getHeaders()` *لا يرث* بشكل أولي من JavaScript `Object`. هذا يعني أن طرق `Object` النموذجية مثل `obj.toString()` و `obj.hasOwnProperty()` وغيرها غير محددة و *لن تعمل*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**تمت الإضافة في: الإصدار v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا تم تعيين الرأس المحدد بواسطة `name` حاليًا في الرؤوس الصادرة. مطابقة اسم الرأس غير حساسة لحالة الأحرف.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**تمت الإضافة في: الإصدار v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قيمة منطقية (للقراءة فقط). صحيح إذا تم إرسال الرؤوس، خطأ خلاف ذلك.

### `response.removeHeader(name)` {#responseremoveheadername}

**تمت الإضافة في: الإصدار v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إزالة رأس مكدس للإرسال الضمني.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**تمت الإضافة في: الإصدار v15.7.0**

- [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)

مرجع إلى كائن `request` HTTP الأصلي.


### `response.sendDate` {#responsesenddate}

**تمت إضافتها في: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

عندما تكون القيمة true، سيتم تلقائيًا إنشاء رأس التاريخ (Date) وإرساله في الاستجابة إذا لم يكن موجودًا بالفعل في الرؤوس. القيمة الافتراضية هي true.

يجب تعطيل هذا فقط للاختبار؛ يتطلب HTTP رأس التاريخ في الاستجابات.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**تمت إضافتها في: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يُرجع كائن الاستجابة.

يضبط قيمة رأس واحد للرؤوس الضمنية. إذا كان هذا الرأس موجودًا بالفعل في الرؤوس المراد إرسالها، فسيتم استبدال قيمته. استخدم مصفوفة من السلاسل النصية هنا لإرسال رؤوس متعددة بنفس الاسم. سيتم تخزين القيم غير النصية دون تعديل. لذلك، قد تُرجع [`response.getHeader()`](/ar/nodejs/api/http#responsegetheadername) قيمًا غير نصية. ومع ذلك، سيتم تحويل القيم غير النصية إلى سلاسل نصية للإرسال عبر الشبكة. يتم إرجاع نفس كائن الاستجابة إلى المستدعي، لتمكين تسلسل الاستدعاءات.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
أو

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
ستؤدي محاولة تعيين اسم أو قيمة حقل رأس يحتوي على أحرف غير صالحة إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

عندما يتم تعيين الرؤوس باستخدام [`response.setHeader()`](/ar/nodejs/api/http#responsesetheadername-value)، فسيتم دمجها مع أي رؤوس تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)، مع إعطاء الأولوية للرؤوس التي تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).

```js [ESM]
// تُرجع content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
إذا تم استدعاء الطريقة [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) ولم يتم استدعاء هذه الطريقة، فستكتب مباشرة قيم الرأس المقدمة على قناة الشبكة دون تخزينها مؤقتًا داخليًا، ولن تسفر [`response.getHeader()`](/ar/nodejs/api/http#responsegetheadername) على الرأس عن النتيجة المتوقعة. إذا كانت تعبئة الرؤوس التدريجية مرغوبة مع إمكانية استرجاعها وتعديلها في المستقبل، فاستخدم [`response.setHeader()`](/ar/nodejs/api/http#responsesetheadername-value) بدلاً من [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**أضيف في:** الإصدار v0.9.12

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يُعيِّن قيمة المهلة الزمنية لمقبس (Socket) الاتصال إلى `msecs`. إذا تم توفير دالة رد نداء (callback)، فستُضاف كمستمع لحدث `'timeout'` على كائن الاستجابة (response).

إذا لم تتم إضافة أي مستمع لحدث `'timeout'` إلى الطلب أو الاستجابة أو الخادم، فستُتلف مقابس الاتصال عند انتهاء المهلة الزمنية. إذا تم تعيين معالج لأحداث `'timeout'` الخاصة بالطلب أو الاستجابة أو الخادم، فيجب معالجة المقابس التي انتهت مهلتها الزمنية بشكل صريح.

### `response.socket` {#responsesocket}

**أضيف في:** الإصدار v0.3.0

- [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

مرجع إلى مقبس الاتصال الأساسي. عادةً لا يرغب المستخدمون في الوصول إلى هذه الخاصية. على وجه الخصوص، لن يُصدر مقبس الاتصال أحداث `'readable'` بسبب كيفية إرفاق محلل البروتوكول بمقبس الاتصال. بعد `response.end()`، تُعيَّن قيمة الخاصية إلى `null`.

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

يُضمن أن تكون هذه الخاصية نسخة من الصنف [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهو صنف فرعي من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس اتصال آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket).

### `response.statusCode` {#responsestatuscode}

**أضيف في:** الإصدار v0.4.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **القيمة الافتراضية:** `200`

عند استخدام ترويسات ضمنية (عدم استدعاء [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) بشكل صريح)، تتحكم هذه الخاصية في رمز الحالة الذي سيُرسل إلى العميل عند تدفق الترويسات.

```js [ESM]
response.statusCode = 404;
```
بعد إرسال ترويسة الاستجابة إلى العميل، تشير هذه الخاصية إلى رمز الحالة الذي أُرسل.


### `response.statusMessage` {#responsestatusmessage}

**تمت الإضافة في: الإصدار v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

عند استخدام رؤوس ضمنية (عدم استدعاء [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) بشكل صريح)، تتحكم هذه الخاصية في رسالة الحالة التي سيتم إرسالها إلى العميل عند تدفق الرؤوس. إذا تركت هذه الخاصية كـ `undefined`، فسيتم استخدام الرسالة القياسية لرمز الحالة.

```js [ESM]
response.statusMessage = 'Not found';
```
بعد إرسال رأس الاستجابة إلى العميل، تشير هذه الخاصية إلى رسالة الحالة التي تم إرسالها.

### `response.strictContentLength` {#responsestrictcontentlength}

**تمت الإضافة في: الإصدار v18.10.0، v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `false`

إذا تم تعيينها إلى `true`، فستتحقق Node.js مما إذا كانت قيمة رأس `Content-Length` وحجم النص الأساسي، بالبايت، متساويين. سيؤدي عدم تطابق قيمة رأس `Content-Length` إلى ظهور `Error`، يتم تحديده بواسطة `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ar/nodejs/api/errors#err_http_content_length_mismatch).

### `response.uncork()` {#responseuncork}

**تمت الإضافة في: الإصدار v13.2.0، v12.16.0**

راجع [`writable.uncork()`](/ar/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**تمت الإضافة في: الإصدار v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` بعد استدعاء [`response.end()`](/ar/nodejs/api/http#responseenddata-encoding-callback). لا تشير هذه الخاصية إلى ما إذا كانت البيانات قد تم تدفقها، ولاستخدامها استخدم [`response.writableFinished`](/ar/nodejs/api/http#responsewritablefinished) بدلاً من ذلك.

### `response.writableFinished` {#responsewritablefinished}

**تمت الإضافة في: الإصدار v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` إذا تم تدفق جميع البيانات إلى النظام الأساسي، مباشرة قبل انبعاث حدث [`'finish'`](/ar/nodejs/api/http#event-finish).

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن يكون المعامل `chunk` الآن `Uint8Array`. |
| v0.1.29 | تمت الإضافة في: الإصدار v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **الافتراضي:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا تم استدعاء هذا الأسلوب ولم يتم استدعاء [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)، فسيتحول إلى وضع الرأس الضمني وتدفق الرؤوس الضمنية.

يرسل هذا جزءًا من نص الاستجابة. يمكن استدعاء هذا الأسلوب عدة مرات لتوفير أجزاء متتالية من النص الأساسي.

إذا تم تعيين `rejectNonStandardBodyWrites` إلى true في `createServer`، فلن يُسمح بالكتابة إلى النص الأساسي عندما لا تدعم طريقة الطلب أو حالة الاستجابة المحتوى. إذا تمت محاولة الكتابة إلى النص الأساسي لطلب HEAD أو كجزء من استجابة `204` أو `304`، فسيتم طرح `Error` متزامن برمز `ERR_HTTP_BODY_NOT_ALLOWED`.

يمكن أن يكون `chunk` سلسلة أو مخزن مؤقت. إذا كانت `chunk` عبارة عن سلسلة، تحدد المعلمة الثانية كيفية ترميزها في دفق بايت. سيتم استدعاء `callback` عند تدفق هذه المجموعة من البيانات.

هذا هو نص HTTP الخام ولا علاقة له بترميزات النص الأساسي متعدد الأجزاء ذات المستوى الأعلى التي يمكن استخدامها.

في المرة الأولى التي يتم فيها استدعاء [`response.write()`](/ar/nodejs/api/http#responsewritechunk-encoding-callback)، سيرسل معلومات الرأس المخزنة مؤقتًا وأول جزء من النص الأساسي إلى العميل. في المرة الثانية التي يتم فيها استدعاء [`response.write()`](/ar/nodejs/api/http#responsewritechunk-encoding-callback)، تفترض Node.js أن البيانات سيتم بثها، وترسل البيانات الجديدة بشكل منفصل. وهذا يعني أن الاستجابة يتم تخزينها مؤقتًا حتى الجزء الأول من النص الأساسي.

يُرجع `true` إذا تم تدفق البيانات بأكملها بنجاح إلى المخزن المؤقت kernel. يُرجع `false` إذا تم وضع كل أو جزء من البيانات في قائمة الانتظار في ذاكرة المستخدم. سيتم إطلاق `'drain'` عندما يكون المخزن المؤقت مجانيًا مرة أخرى.


### `response.writeContinue()` {#responsewritecontinue}

**أُضيف في:** الإصدار 0.3.0

يرسل رسالة HTTP/1.1 100 Continue إلى العميل، مما يشير إلى ضرورة إرسال نص الطلب. انظر حدث [`'checkContinue'`](/ar/nodejs/api/http#event-checkcontinue) في `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.11.0 | السماح بتمرير التلميحات ككائن. |
| الإصدار 18.11.0 | أُضيف في: الإصدار 18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يرسل رسالة HTTP/1.1 103 Early Hints إلى العميل مع عنوان Link، مما يشير إلى أن وكيل المستخدم يمكنه تحميل/توصيل الموارد المرتبطة مسبقًا. `hints` هو كائن يحتوي على قيم الرؤوس التي سيتم إرسالها مع رسالة التلميحات المبكرة. سيتم استدعاء وسيطة `callback` الاختيارية عند كتابة رسالة الاستجابة.

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 14.14.0 | السماح بتمرير الرؤوس كمصفوفة. |
| الإصدار 11.10.0, الإصدار 10.17.0 | إرجاع `this` من `writeHead()` للسماح بالربط مع `end()`. |
| الإصدار 5.11.0, الإصدار 4.4.5 | يتم طرح `RangeError` إذا لم يكن `statusCode` رقمًا في النطاق `[100, 999]`. |
| الإصدار 0.1.30 | أُضيف في: الإصدار 0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- الإرجاع: [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يرسل رأس الاستجابة إلى الطلب. رمز الحالة هو رمز حالة HTTP مكون من 3 أرقام، مثل `404`. الوسيطة الأخيرة، `headers`، هي رؤوس الاستجابة. اختياريًا، يمكن إعطاء `statusMessage` قابلة للقراءة البشرية كوسيطة ثانية.

قد تكون `headers` عبارة عن `Array` حيث تكون المفاتيح والقيم في نفس القائمة. إنها *ليست* قائمة من الصفوف. لذلك، تكون الإزاحات المرقمة بزوجي هي قيم المفاتيح، والإزاحات المرقمة بفردي هي القيم المرتبطة. المصفوفة بنفس تنسيق `request.rawHeaders`.

يُرجع مرجعًا إلى `ServerResponse`، بحيث يمكن ربط الاستدعاءات.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
يجب استدعاء هذه الطريقة مرة واحدة فقط على رسالة ويجب استدعاؤها قبل استدعاء [`response.end()`](/ar/nodejs/api/http#responseenddata-encoding-callback).

إذا تم استدعاء [`response.write()`](/ar/nodejs/api/http#responsewritechunk-encoding-callback) أو [`response.end()`](/ar/nodejs/api/http#responseenddata-encoding-callback) قبل استدعاء هذا، فسيتم حساب الرؤوس الضمنية/القابلة للتغيير واستدعاء هذه الوظيفة.

عندما يتم تعيين الرؤوس باستخدام [`response.setHeader()`](/ar/nodejs/api/http#responsesetheadername-value)، سيتم دمجها مع أي رؤوس يتم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)، مع إعطاء الأسبقية للرؤوس التي تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).

إذا تم استدعاء هذه الطريقة ولم يتم استدعاء [`response.setHeader()`](/ar/nodejs/api/http#responsesetheadername-value)، فستكتب مباشرة قيم الرأس الموردة على قناة الشبكة دون تخزين مؤقت داخليًا، ولن ينتج [`response.getHeader()`](/ar/nodejs/api/http#responsegetheadername) على الرأس النتيجة المتوقعة. إذا كانت التعبئة التدريجية للرؤوس مطلوبة مع الاسترجاع والتعديل المحتملين في المستقبل، فاستخدم [`response.setHeader()`](/ar/nodejs/api/http#responsesetheadername-value) بدلاً من ذلك.

```js [ESM]
// يُرجع content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
تتم قراءة `Content-Length` بالبايت، وليس الأحرف. استخدم [`Buffer.byteLength()`](/ar/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) لتحديد طول النص بالبايت. سيتحقق Node.js مما إذا كان `Content-Length` وطول النص الذي تم إرساله متساويين أم لا.

ستؤدي محاولة تعيين اسم أو قيمة حقل رأس يحتوي على أحرف غير صالحة إلى طرح [`Error`][].


### `response.writeProcessing()` {#responsewriteprocessing}

**تمت الإضافة في: الإصدار 10.0.0**

يرسل رسالة معالجة HTTP/1.1 102 إلى العميل، مشيرًا إلى أنه يجب إرسال نص الطلب.

## الصنف: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.5.0 | تُرجع قيمة `destroyed` القيمة `true` بعد استهلاك البيانات الواردة. |
| الإصدار 13.1.0، الإصدار 12.16.0 | تعكس قيمة `readableHighWaterMark` قيمة المقبس. |
| الإصدار 0.1.17 | تمت الإضافة في: الإصدار 0.1.17 |
:::

- يمتد: [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)

يتم إنشاء كائن `IncomingMessage` بواسطة [`http.Server`](/ar/nodejs/api/http#class-httpserver) أو [`http.ClientRequest`](/ar/nodejs/api/http#class-httpclientrequest) ويتم تمريره كوسيطة أولى إلى حدثي [`'request'`](/ar/nodejs/api/http#event-request) و [`'response'`](/ar/nodejs/api/http#event-response) على التوالي. يمكن استخدامه للوصول إلى حالة الاستجابة والرؤوس والبيانات.

بخلاف قيمة `socket` الخاصة به والتي هي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، فإن `IncomingMessage` نفسه يمتد [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) ويتم إنشاؤه بشكل منفصل لتحليل وإصدار رؤوس HTTP والحمولة الواردة، حيث يمكن إعادة استخدام المقبس الأساسي عدة مرات في حالة الاحتفاظ بالاتصال حيًا.

### الحدث: `'aborted'` {#event-aborted}

**تمت الإضافة في: الإصدار 0.3.8**

**تم الإهمال منذ: الإصدار 17.0.0، الإصدار 16.12.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. استمع إلى حدث `'close'` بدلاً من ذلك.
:::

يتم إصداره عند إحباط الطلب.

### الحدث: `'close'` {#event-close_3}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.0.0 | يتم الآن إصدار حدث الإغلاق عند اكتمال الطلب وليس عند إغلاق المقبس الأساسي. |
| الإصدار 0.4.2 | تمت الإضافة في: الإصدار 0.4.2 |
:::

يتم إصداره عند اكتمال الطلب.

### `message.aborted` {#messageaborted}

**تمت الإضافة في: الإصدار 10.1.0**

**تم الإهمال منذ: الإصدار 17.0.0، الإصدار 16.12.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل. تحقق من `message.destroyed` من [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون خاصية `message.aborted` هي `true` إذا تم إحباط الطلب.


### `message.complete` {#messagecomplete}

**أُضيف في: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون خاصية `message.complete` بقيمة `true` إذا تم استلام رسالة HTTP كاملة وتحليلها بنجاح.

تُعد هذه الخاصية مفيدة بشكل خاص كوسيلة لتحديد ما إذا كان العميل أو الخادم قد أرسل رسالة بالكامل قبل إنهاء الاتصال:

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'تم إنهاء الاتصال أثناء إرسال الرسالة');
  });
});
```
### `message.connection` {#messageconnection}

**أُضيف في: v0.1.90**

**تم إهماله منذ: v16.0.0**

::: danger [مستقر: 0 - مُهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُهمل. استخدم [`message.socket`](/ar/nodejs/api/http#messagesocket).
:::

اسم مستعار لـ [`message.socket`](/ar/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.5.0, v12.19.0 | تُرجع الدالة `this` للاتساق مع تدفقات Readable الأخرى. |
| v0.3.0 | أُضيف في: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يستدعي `destroy()` على المقبس الذي استقبل `IncomingMessage`. إذا تم توفير `error`، فسيتم إطلاق حدث `'error'` على المقبس ويتم تمرير `error` كمعامل إلى أي مستمعين على الحدث.

### `message.headers` {#messageheaders}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.5.0, v18.14.0 | يضمن خيار `joinDuplicateHeaders` في الدالتين `http.request()` و `http.createServer()` عدم تجاهل العناوين المكررة، ولكن يتم دمجها بدلاً من ذلك باستخدام فاصلة، وفقًا لقسم RFC 9110 5.3. |
| v15.1.0 | يتم الآن حساب `message.headers` ببطء باستخدام خاصية الوصول على النموذج الأولي ولم يعد قابلاً للتعداد. |
| v0.1.5 | أُضيف في: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن رؤوس الطلب/الاستجابة.

أزواج قيم المفاتيح لأسماء وقيم الرؤوس. أسماء الرؤوس بأحرف صغيرة.

```js [ESM]
// يطبع شيئًا مثل:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
يتم التعامل مع التكرارات في الرؤوس الأولية بالطرق التالية، اعتمادًا على اسم الرأس:

- يتم تجاهل التكرارات من `age` أو `authorization` أو `content-length` أو `content-type` أو `etag` أو `expires` أو `from` أو `host` أو `if-modified-since` أو `if-unmodified-since` أو `last-modified` أو `location` أو `max-forwards` أو `proxy-authorization` أو `referer` أو `retry-after` أو `server` أو `user-agent`. للسماح بضم القيم المكررة للرؤوس المذكورة أعلاه، استخدم الخيار `joinDuplicateHeaders` في [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback) و [`http.createServer()`](/ar/nodejs/api/http#httpcreateserveroptions-requestlistener). راجع قسم RFC 9110 5.3 لمزيد من المعلومات.
- `set-cookie` دائمًا عبارة عن مصفوفة. تتم إضافة التكرارات إلى المصفوفة.
- بالنسبة لرؤوس `cookie` المكررة، يتم ضم القيم معًا باستخدام `; `.
- بالنسبة لجميع الرؤوس الأخرى، يتم ضم القيم معًا باستخدام `, `.


### `message.headersDistinct` {#messageheadersdistinct}

**تمت إضافته في: الإصدار v18.3.0، v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

مشابهة لـ [`message.headers`](/ar/nodejs/api/http#messageheaders)، ولكن لا توجد منطق للانضمام والقيم دائمًا عبارة عن مصفوفات من السلاسل، حتى بالنسبة للرؤوس التي تم استلامها مرة واحدة فقط.

```js [ESM]
// يطبع شيئًا مثل:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**تمت إضافته في: الإصدار v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

في حالة طلب الخادم، يكون إصدار HTTP الذي أرسله العميل. في حالة استجابة العميل، يكون إصدار HTTP للخادم المتصل به. من المحتمل أن يكون `'1.1'` أو `'1.0'`.

أيضًا `message.httpVersionMajor` هو العدد الصحيح الأول و `message.httpVersionMinor` هو العدد الصحيح الثاني.

### `message.method` {#messagemethod}

**تمت إضافته في: الإصدار v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**صالح فقط للطلب الذي تم الحصول عليه من <a href="#class-httpserver"><code>http.Server</code></a>.**

طريقة الطلب كسلسلة. للقراءة فقط. أمثلة: `'GET'`، `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**تمت إضافته في: الإصدار v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة رؤوس الطلب/الاستجابة الأولية تمامًا كما تم استلامها.

المفاتيح والقيم موجودة في نفس القائمة. إنها *ليست* قائمة من الصفوف. لذلك، فإن الإزاحات ذات الأرقام الزوجية هي قيم المفاتيح، والإزاحات ذات الأرقام الفردية هي القيم المرتبطة.

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
### `message.rawTrailers` {#messagerawtrailers}

**تمت إضافته في: الإصدار v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مفاتيح وقيم الملحقات الأولية للطلب/الاستجابة تمامًا كما تم استلامها. يتم تعبئتها فقط في حدث `'end'`.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**تمت الإضافة في: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)

يستدعي `message.socket.setTimeout(msecs, callback)`.

### `message.socket` {#messagesocket}

**تمت الإضافة في: v0.3.0**

- [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

كائن [`net.Socket`](/ar/nodejs/api/net#class-netsocket) المرتبط بالاتصال.

مع دعم HTTPS، استخدم [`request.socket.getPeerCertificate()`](/ar/nodejs/api/tls#tlssocketgetpeercertificatedetailed) للحصول على تفاصيل مصادقة العميل.

هذه الخاصية مضمونة لتكون نسخة من الفئة [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)، وهي فئة فرعية من [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)، ما لم يحدد المستخدم نوع مقبس آخر غير [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) أو تم تصفيره داخليًا.

### `message.statusCode` {#messagestatuscode}

**تمت الإضافة في: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**صالح فقط للاستجابة التي تم الحصول عليها من <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

رمز حالة استجابة HTTP المكون من 3 أرقام. على سبيل المثال، `404`.

### `message.statusMessage` {#messagestatusmessage}

**تمت الإضافة في: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**صالح فقط للاستجابة التي تم الحصول عليها من <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

رسالة حالة استجابة HTTP (عبارة السبب). على سبيل المثال، `OK` أو `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**تمت الإضافة في: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن المقطورات للطلب/الاستجابة. يتم تعبئته فقط في حدث `'end'`.

### `message.trailersDistinct` {#messagetrailersdistinct}

**تمت الإضافة في: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

مشابه لـ [`message.trailers`](/ar/nodejs/api/http#messagetrailers)، ولكن لا يوجد منطق ضم والقيم دائمًا عبارة عن مصفوفات من السلاسل، حتى بالنسبة للرؤوس التي تم استلامها مرة واحدة فقط. يتم تعبئته فقط في حدث `'end'`.


### `message.url` {#messageurl}

**أُضيف في: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**صالح فقط للطلبات التي تم الحصول عليها من <a href="#class-httpserver"><code>http.Server</code></a>.**

سلسلة عنوان URL للطلب. يحتوي هذا فقط على عنوان URL الموجود في طلب HTTP الفعلي. خذ الطلب التالي:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
لتحليل عنوان URL إلى أجزائه:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
عندما يكون `request.url` هو `'/status?name=ryan'` و `process.env.HOST` غير مُعرَّف:

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
تأكد من تعيين `process.env.HOST` لاسم مضيف الخادم، أو ضع في اعتبارك استبدال هذا الجزء بالكامل. إذا كنت تستخدم `req.headers.host`، فتأكد من استخدام التحقق المناسب، حيث قد يحدد العملاء عنوان `Host` مخصص.

## Class: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**أُضيف في: v0.1.17**

- يمتد: [\<Stream\>](/ar/nodejs/api/stream#stream)

تعمل هذه الفئة كفئة أصل لـ [`http.ClientRequest`](/ar/nodejs/api/http#class-httpclientrequest) و [`http.ServerResponse`](/ar/nodejs/api/http#class-httpserverresponse). إنها رسالة صادرة مجردة من منظور المشاركين في معاملة HTTP.

### Event: `'drain'` {#event-drain}

**أُضيف في: v0.3.6**

يتم إطلاقه عندما تكون ذاكرة التخزين المؤقت للرسالة مجانية مرة أخرى.

### Event: `'finish'` {#event-finish_2}

**أُضيف في: v0.1.17**

يتم إطلاقه عند اكتمال الإرسال بنجاح.

### Event: `'prefinish'` {#event-prefinish}

**أُضيف في: v0.11.6**

يتم إطلاقه بعد استدعاء `outgoingMessage.end()`. عند إطلاق الحدث، تتم معالجة جميع البيانات ولكن ليس بالضرورة مسحها بالكامل.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**تمت الإضافة في: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يضيف مقطورات HTTP (رؤوس ولكن في نهاية الرسالة) إلى الرسالة.

سيتم إصدار المقطورات **فقط** إذا تم ترميز الرسالة بشكل مجزأ. إذا لم يكن الأمر كذلك، فسيتم تجاهل المقطورات بصمت.

يتطلب HTTP إرسال رأس `Trailer` لإصدار المقطورات، مع قائمة بأسماء حقول الرؤوس في قيمتها، على سبيل المثال.

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
ستؤدي محاولة تعيين اسم حقل رأس أو قيمة تحتوي على أحرف غير صالحة إلى طرح `TypeError`.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**تمت الإضافة في: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الرأس
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قيمة الرأس
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

إلحاق قيمة رأس واحدة بكائن الرأس.

إذا كانت القيمة عبارة عن مصفوفة، فهذا يعادل استدعاء هذا الأسلوب عدة مرات.

إذا لم تكن هناك قيم سابقة للرأس، فهذا يعادل استدعاء [`outgoingMessage.setHeader(name, value)`](/ar/nodejs/api/http#outgoingmessagesetheadername-value).

اعتمادًا على قيمة `options.uniqueHeaders` عند إنشاء طلب العميل أو الخادم، سينتهي هذا بإرسال الرأس عدة مرات أو مرة واحدة بقيم مرتبطة باستخدام `; `.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**تمت الإضافة في: v0.3.0**

**تم الإيقاف منذ: v15.12.0, v14.17.1**

::: danger [مستقر: 0 - تم الإيقاف]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإيقاف: استخدم [`outgoingMessage.socket`](/ar/nodejs/api/http#outgoingmessagesocket) بدلاً من ذلك.
:::

اسم مستعار لـ [`outgoingMessage.socket`](/ar/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**أُضيف في:** الإصدار v13.2.0, v12.16.0

اطلع على [`writable.cork()`](/ar/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**أُضيف في:** الإصدار v0.3.0

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) اختياري، خطأ يتم إطلاقه مع حدث `error`
- يُعيد: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يدمر الرسالة. بمجرد ارتباط مقبس (socket) بالرسالة وتوصيله، سيتم تدمير هذا المقبس أيضًا.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن تكون معلمة `chunk` الآن `Uint8Array`. |
| v0.11.6 | إضافة وسيط `callback`. |
| v0.1.90 | أُضيف في: الإصدار v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اختياري، **الافتراضي**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) اختياري
- يُعيد: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ينهي الرسالة الصادرة. إذا كانت هناك أي أجزاء من النص غير مرسلة، فسيتم إرسالها إلى النظام الأساسي. إذا كانت الرسالة مقسمة إلى أجزاء، فسيتم إرسال الجزء النهائي `0\r\n\r\n`، وإرسال التذييلات (إذا وجدت).

إذا تم تحديد `chunk`، فإنه يكافئ استدعاء `outgoingMessage.write(chunk, encoding)`، متبوعًا بـ `outgoingMessage.end(callback)`.

إذا تم توفير `callback`، فسيتم استدعاؤه عند انتهاء الرسالة (ما يعادل مستمع حدث `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**أُضيف في:** الإصدار v1.6.0

يقوم بإرسال رؤوس الرسالة.

لكفاءة الأداء، يقوم Node.js عادةً بتخزين رؤوس الرسالة مؤقتًا حتى يتم استدعاء `outgoingMessage.end()` أو كتابة الجزء الأول من بيانات الرسالة. ثم يحاول تجميع الرؤوس والبيانات في حزمة TCP واحدة.

عادة ما يكون هذا مرغوبًا (فهو يوفر رحلة ذهابًا وإيابًا TCP)، ولكن ليس عندما لا يتم إرسال البيانات الأولى حتى وقت لاحق. يتجاوز `outgoingMessage.flushHeaders()` التحسين ويبدأ الرسالة.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**تمت الإضافة في: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الرأس
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

يحصل على قيمة رأس HTTP بالاسم المحدد. إذا لم يتم تعيين هذا الرأس، فستكون القيمة المرجعة `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**تمت الإضافة في: v7.7.0**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع مصفوفة تحتوي على الأسماء الفريدة للرؤوس الصادرة الحالية. جميع الأسماء بأحرف صغيرة.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**تمت الإضافة في: v7.7.0**

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع نسخة سطحية من الرؤوس الصادرة الحالية. نظرًا لاستخدام نسخة سطحية، يمكن تغيير قيم المصفوفة دون إجراء مكالمات إضافية لأساليب وحدة HTTP المختلفة المتعلقة بالرأس. مفاتيح الكائن المرجع هي أسماء الرؤوس والقيم هي قيم الرأس الخاصة بها. جميع أسماء الرؤوس بأحرف صغيرة.

الكائن الذي يتم إرجاعه بواسطة طريقة `outgoingMessage.getHeaders()` لا يرث نموذجًا أوليًا من JavaScript `Object`. هذا يعني أن طرق `Object` النموذجية مثل `obj.toString()` و `obj.hasOwnProperty()` وغيرها غير محددة ولن تعمل.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**تمت الإضافة في: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان الرأس المحدد بواسطة `name` معينًا حاليًا في الرؤوس الصادرة. اسم الرأس غير حساس لحالة الأحرف.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**إضافة في: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

للقراءة فقط. ‏`true` إذا تم إرسال الرؤوس، وإلا `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**إضافة في: v9.0.0**

يتجاوز طريقة `stream.pipe()` الموروثة من فئة `Stream` القديمة وهي الفئة الأصلية لـ `http.OutgoingMessage`.

استدعاء هذه الطريقة سيطلق `Error` لأن `outgoingMessage` هو مجرى للكتابة فقط.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**إضافة في: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الرأس

يزيل رأسًا تم وضعه في قائمة الانتظار للإرسال الضمني.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**إضافة في: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الرأس
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة الرأس
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يضبط قيمة رأس واحدة. إذا كان الرأس موجودًا بالفعل في الرؤوس المراد إرسالها، فسيتم استبدال قيمته. استخدم مصفوفة من السلاسل النصية لإرسال رؤوس متعددة بنفس الاسم.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**إضافة في: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يضبط قيم رؤوس متعددة للرؤوس الضمنية. يجب أن تكون `headers` مثيلًا لـ [`Headers`](/ar/nodejs/api/globals#class-headers) أو `Map`، إذا كان الرأس موجودًا بالفعل في الرؤوس المراد إرسالها، فسيتم استبدال قيمته.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
أو

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
عندما يتم تعيين الرؤوس باستخدام [`outgoingMessage.setHeaders()`](/ar/nodejs/api/http#outgoingmessagesetheadersheaders)، سيتم دمجها مع أي رؤوس يتم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)، مع إعطاء الأسبقية للرؤوس التي تم تمريرها إلى [`response.writeHead()`](/ar/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).

```js [ESM]
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**أُضيف في: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة اختيارية يتم استدعاؤها عند حدوث مهلة. نفس الربط بحدث `timeout`.
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

بمجرد ربط مقبس بالرسالة وتوصيله، سيتم استدعاء [`socket.setTimeout()`](/ar/nodejs/api/net#socketsettimeouttimeout-callback) مع `msecs` كمعامل أول.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**أُضيف في: v0.3.0**

- [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

إشارة إلى المقبس الأساسي. عادةً، لن يرغب المستخدمون في الوصول إلى هذه الخاصية.

بعد استدعاء `outgoingMessage.end()`، ستصبح هذه الخاصية فارغة.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**أُضيف في: v13.2.0, v12.16.0**

انظر [`writable.uncork()`](/ar/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**أُضيف في: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد مرات استدعاء `outgoingMessage.cork()`.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**أُضيف في: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` إذا تم استدعاء `outgoingMessage.end()`. لا تشير هذه الخاصية إلى ما إذا كانت البيانات قد تم إرسالها أم لا. لهذا الغرض، استخدم `message.writableFinished` بدلاً من ذلك.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**أُضيف في: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` إذا تم إرسال جميع البيانات إلى النظام الأساسي.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**أُضيف في: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`highWaterMark` للمقبس الأساسي إذا تم تعيينه. خلاف ذلك، مستوى المخزن المؤقت الافتراضي عندما يبدأ [`writable.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) في إرجاع خطأ (‎16384).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**تمت الإضافة في: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد البايتات المخزنة مؤقتًا.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**تمت الإضافة في: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

دائمًا `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | يمكن أن يكون الآن المعامل `chunk` هو `Uint8Array`. |
| v0.11.6 | تمت إضافة الوسيطة `callback`. |
| v0.1.29 | تمت الإضافة في: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يرسل جزءًا من النص الأساسي. يمكن استدعاء هذا الأسلوب عدة مرات.

تكون الوسيطة `encoding` ذات صلة فقط عندما يكون `chunk` عبارة عن سلسلة نصية. القيمة الافتراضية هي `'utf8'`.

الوسيطة `callback` اختيارية وسيتم استدعاؤها عند مسح هذا الجزء من البيانات.

إرجاع `true` إذا تم مسح البيانات بأكملها بنجاح إلى مخزن النواة المؤقت. إرجاع `false` إذا تم وضع كل أو جزء من البيانات في قائمة الانتظار في ذاكرة المستخدم. سيتم إصدار الحدث `'drain'` عندما يكون المخزن المؤقت خاليًا مرة أخرى.

## `http.METHODS` {#httpmethods}

**تمت الإضافة في: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة بطرق HTTP التي يدعمها المحلل اللغوي.

## `http.STATUS_CODES` {#httpstatus_codes}

**تمت الإضافة في: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

مجموعة من جميع رموز حالة استجابة HTTP القياسية، والوصف الموجز لكل منها. على سبيل المثال، `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0, v18.17.0 | خيار `highWaterMark` مدعوم الآن. |
| v18.0.0 | خيارات `requestTimeout` و `headersTimeout` و `keepAliveTimeout` و `connectionsCheckingInterval` مدعومة الآن. |
| v18.0.0 | خيار `noDelay` الآن قيمته الافتراضية هي `true`. |
| v17.7.0, v16.15.0 | خيارات `noDelay` و `keepAlive` و `keepAliveInitialDelay` مدعومة الآن. |
| v13.3.0 | خيار `maxHeaderSize` مدعوم الآن. |
| v13.8.0, v12.15.0, v10.19.0 | خيار `insecureHTTPParser` مدعوم الآن. |
| v9.6.0, v8.12.0 | وسيطة `options` مدعومة الآن. |
| v0.1.13 | تمت الإضافة في: v0.1.13 |
:::

-  `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: يحدد قيمة الفاصل الزمني بالمللي ثانية للتحقق من طلبات المهلة الزمنية والعناوين في الطلبات غير المكتملة. **الافتراضي:** `30000`.
    - `headersTimeout`: يحدد قيمة المهلة الزمنية بالمللي ثانية لتلقي رؤوس HTTP الكاملة من العميل. انظر [`server.headersTimeout`](/ar/nodejs/api/http#serverheaderstimeout) لمزيد من المعلومات. **الافتراضي:** `60000`.
    - `highWaterMark` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتجاوز اختياريًا جميع `socket`s' `readableHighWaterMark` و `writableHighWaterMark`. هذا يؤثر على خاصية `highWaterMark` لكل من `IncomingMessage` و `ServerResponse`. **الافتراضي:** انظر [`stream.getDefaultHighWaterMark()`](/ar/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فسيستخدم محلل HTTP مع تمكين علامات التساهل. يجب تجنب استخدام المحلل غير الآمن. انظر [`--insecure-http-parser`](/ar/nodejs/api/cli#--insecure-http-parser) لمزيد من المعلومات. **الافتراضي:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage) يحدد فئة `IncomingMessage` التي سيتم استخدامها. مفيد لتوسيع `IncomingMessage` الأصلي. **الافتراضي:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإن هذا الخيار يسمح بضم قيم خط الحقل لرؤوس متعددة في طلب مع فاصلة (`, `) بدلاً من تجاهل التكرارات. لمزيد من المعلومات، راجع [`message.headers`](/ar/nodejs/api/http#messageheaders). **الافتراضي:** `false`.
    - `keepAlive` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يمكّن وظيفة keep-alive على المقبس مباشرة بعد استقبال اتصال وارد جديد، على غرار ما يتم القيام به في [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **الافتراضي:** `false`.
    - `keepAliveInitialDelay` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تم تعيينه على رقم موجب، فإنه يحدد التأخير الأولي قبل إرسال أول مسبار keepalive على مقبس خامل. **الافتراضي:** `0`.
    - `keepAliveTimeout`: عدد المللي ثانية من عدم النشاط التي يحتاجها الخادم للانتظار لتلقي بيانات واردة إضافية، بعد الانتهاء من كتابة الاستجابة الأخيرة، قبل تدمير المقبس. انظر [`server.keepAliveTimeout`](/ar/nodejs/api/http#serverkeepalivetimeout) لمزيد من المعلومات. **الافتراضي:** `5000`.
    - `maxHeaderSize` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتجاوز اختياريًا قيمة [`--max-http-header-size`](/ar/nodejs/api/cli#--max-http-header-sizesize) للطلبات التي يتلقاها هذا الخادم، أي الطول الأقصى لرؤوس الطلبات بالبايت. **الافتراضي:** 16384 (16 KiB).
    - `noDelay` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يعطل استخدام خوارزمية Nagle مباشرة بعد استقبال اتصال وارد جديد. **الافتراضي:** `true`.
    - `requestTimeout`: يحدد قيمة المهلة الزمنية بالمللي ثانية لتلقي الطلب بأكمله من العميل. انظر [`server.requestTimeout`](/ar/nodejs/api/http#serverrequesttimeout) لمزيد من المعلومات. **الافتراضي:** `300000`.
    - `requireHostHeader` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يجبر الخادم على الاستجابة برمز الحالة 400 (طلب غير صالح) لأي رسالة طلب HTTP/1.1 تفتقر إلى رأس المضيف (كما هو منصوص عليه في المواصفات). **الافتراضي:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse) يحدد فئة `ServerResponse` التي سيتم استخدامها. مفيد لتوسيع `ServerResponse` الأصلي. **الافتراضي:** `ServerResponse`.
    - `uniqueHeaders` [\<مصفوفة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) قائمة برؤوس الاستجابة التي يجب إرسالها مرة واحدة فقط. إذا كانت قيمة الرأس عبارة عن مصفوفة، فسيتم ضم العناصر باستخدام `; `.
    - `rejectNonStandardBodyWrites` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فسيتم طرح خطأ عند الكتابة إلى استجابة HTTP ليس لديها نص. **الافتراضي:** `false`.
  
 
-  `requestListener` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  المرتجعات: [\<http.Server\>](/ar/nodejs/api/http#class-httpserver)

إرجاع نسخة جديدة من [`http.Server`](/ar/nodejs/api/http#class-httpserver).

`requestListener` هي دالة تضاف تلقائيًا إلى الحدث [`'request'`](/ar/nodejs/api/http#event-request).



::: code-group
```js [ESM]
import http from 'node:http';

// إنشاء خادم محلي لتلقي البيانات منه
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// إنشاء خادم محلي لتلقي البيانات منه
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::



::: code-group
```js [ESM]
import http from 'node:http';

// إنشاء خادم محلي لتلقي البيانات منه
const server = http.createServer();

// الاستماع إلى حدث الطلب
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// إنشاء خادم محلي لتلقي البيانات منه
const server = http.createServer();

// الاستماع إلى حدث الطلب
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::

## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.9.0 | يمكن الآن تمرير المعامل `url` مع كائن `options` منفصل. |
| v7.5.0 | يمكن أن يكون المعامل `options` كائن `URL` من WHATWG. |
| v0.3.6 | تمت الإضافة في: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يقبل نفس `options` الموجودة في [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback)، مع تعيين الطريقة إلى GET افتراضيًا.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

نظرًا لأن معظم الطلبات هي طلبات GET بدون أجسام، فإن Node.js يوفر هذه الطريقة المريحة. الفرق الوحيد بين هذه الطريقة و [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback) هو أنه يتم تعيين الطريقة إلى GET افتراضيًا ويتم استدعاء `req.end()` تلقائيًا. يجب أن يهتم الاستدعاء بتناول بيانات الاستجابة للأسباب المذكورة في قسم [`http.ClientRequest`](/ar/nodejs/api/http#class-httpclientrequest).

يتم استدعاء `callback` بوسيطة واحدة وهي نسخة من [`http.IncomingMessage`](/ar/nodejs/api/http#class-httpincomingmessage).

مثال على جلب JSON:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Any 2xx status code signals a successful response but
  // here we're only checking for 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.0.0 | يستخدم الوكيل الآن HTTP Keep-Alive ومهلة 5 ثوانٍ افتراضيًا. |
| الإصدار v0.5.9 | تمت إضافته في: v0.5.9 |
:::

- [\<http.Agent\>](/ar/nodejs/api/http#class-httpagent)

نموذج عام من `Agent` يستخدم كافتراضي لجميع طلبات عميل HTTP. يختلف عن تكوين `Agent` افتراضي من خلال تمكين `keepAlive` ووجود `timeout` لمدة 5 ثوانٍ.

## `http.maxHeaderSize` {#httpmaxheadersize}

**تمت إضافته في: v11.6.0، v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

خاصية للقراءة فقط تحدد الحد الأقصى المسموح به لحجم رؤوس HTTP بالبايت. القيمة الافتراضية هي 16 كيلوبايت. يمكن تهيئتها باستخدام خيار سطر الأوامر [`--max-http-header-size`](/ar/nodejs/api/cli#--max-http-header-sizesize).

يمكن تجاوز هذا للخوادم وطلبات العملاء عن طريق تمرير خيار `maxHeaderSize`.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v16.7.0, v14.18.0 | عند استخدام كائن `URL`، سيتم الآن فك ترميز اسم المستخدم وكلمة المرور بشكل صحيح. |
| الإصدار v15.3.0, v14.17.0 | من الممكن إلغاء طلب باستخدام AbortSignal. |
| الإصدار v13.3.0 | خيار `maxHeaderSize` مدعوم الآن. |
| الإصدار v13.8.0, v12.15.0, v10.19.0 | خيار `insecureHTTPParser` مدعوم الآن. |
| الإصدار v10.9.0 | يمكن الآن تمرير معلمة `url` مع كائن `options` منفصل. |
| الإصدار v7.5.0 | يمكن أن تكون معلمة `options` كائن WHATWG `URL`. |
| الإصدار v0.3.6 | تمت إضافته في: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/ar/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يتحكم في سلوك [`Agent`](/ar/nodejs/api/http#class-httpagent). القيم المحتملة:
    - `undefined` (افتراضي): استخدم [`http.globalAgent`](/ar/nodejs/api/http#httpglobalagent) لهذا المضيف والمنفذ.
    - كائن `Agent`: استخدم `Agent` الذي تم تمريره بشكل صريح.
    - `false`: يتسبب في استخدام `Agent` جديد بقيم افتراضية.


    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصادقة أساسية (`'user:password'`) لحساب رأس التفويض.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة تنتج مقبسًا/تدفقًا لاستخدامه في الطلب عندما لا يتم استخدام خيار `agent`. يمكن استخدام هذا لتجنب إنشاء فئة `Agent` مخصصة فقط لتجاوز دالة `createConnection` الافتراضية. راجع [`agent.createConnection()`](/ar/nodejs/api/http#agentcreateconnectionoptions-callback) لمزيد من التفاصيل. أي تدفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) هو قيمة إرجاع صالحة.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الافتراضي للبروتوكول. **الافتراضي:** `agent.defaultPort` إذا تم استخدام `Agent`، وإلا `undefined`.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عائلة عنوان IP لاستخدامها عند حل `host` أو `hostname`. القيم الصالحة هي `4` أو `6`. عند عدم تحديدها، سيتم استخدام كل من IPv4 و IPv6.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على رؤوس الطلب.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) تلميحات [`dns.lookup()` اختيارية](/ar/nodejs/api/dns#supported-getaddrinfo-flags).
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مجال أو عنوان IP للخادم لإصدار الطلب إليه. **الافتراضي:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مستعار لـ `host`. لدعم [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)، سيتم استخدام `hostname` إذا تم تحديد كل من `host` و `hostname`.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فسيستخدم محلل HTTP مع تمكين علامات التساهل. يجب تجنب استخدام المحلل غير الآمن. راجع [`--insecure-http-parser`](/ar/nodejs/api/cli#--insecure-http-parser) لمزيد من المعلومات. **الافتراضي:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يربط قيم سطر الحقل لرؤوس متعددة في طلب مع `, ` بدلاً من تجاهل التكرارات. راجع [`message.headers`](/ar/nodejs/api/http#messageheaders) لمزيد من المعلومات. **الافتراضي:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الواجهة المحلية للربط لاتصالات الشبكة.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ المحلي للاتصال منه.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة بحث مخصصة. **الافتراضي:** [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتجاوز اختياريًا قيمة [`--max-http-header-size`](/ar/nodejs/api/cli#--max-http-header-sizesize) (الحد الأقصى لطول رؤوس الاستجابة بالبايت) للاستجابات الواردة من الخادم. **الافتراضي:** 16384 (16 كيلوبايت).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة تحدد طريقة طلب HTTP. **الافتراضي:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الطلب. يجب أن يتضمن سلسلة الاستعلام إن وجدت. على سبيل المثال `'/index.html?page=12'`. يتم طرح استثناء عندما يحتوي مسار الطلب على أحرف غير قانونية. حاليًا، يتم رفض المسافات فقط ولكن قد يتغير ذلك في المستقبل. **الافتراضي:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) منفذ الخادم البعيد. **الافتراضي:** `defaultPort` إذا تم تعيينه، وإلا `80`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) البروتوكول المراد استخدامه. **الافتراضي:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): يحدد ما إذا كان سيتم إضافة الرؤوس الافتراضية تلقائيًا مثل `Connection` و `Content-Length` و `Transfer-Encoding` و `Host`. إذا تم تعيينه على `false`، فيجب إضافة جميع الرؤوس الضرورية يدويًا. القيمة الافتراضية هي `true`.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): يحدد ما إذا كان سيتم إضافة رأس `Host` تلقائيًا. إذا تم توفيره، فإنه يتجاوز `setDefaultHeaders`. القيمة الافتراضية هي `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal): AbortSignal يمكن استخدامه لإلغاء طلب قيد التقدم.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مقبس مجال Unix. لا يمكن استخدامه إذا تم تحديد أحد `host` أو `port`، لأن هذه تحدد مقبس TCP.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): رقم يحدد مهلة المقبس بالمللي ثانية. سيؤدي هذا إلى تعيين المهلة قبل توصيل المقبس.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) قائمة برؤوس الطلب التي يجب إرسالها مرة واحدة فقط. إذا كانت قيمة الرأس عبارة عن مصفوفة، فسيتم ربط العناصر باستخدام `; `.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

يتم دعم `options` في [`socket.connect()`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) أيضًا.

تحافظ Node.js على عدة اتصالات لكل خادم لتقديم طلبات HTTP. تسمح هذه الوظيفة بإصدار الطلبات بشفافية.

يمكن أن يكون `url` سلسلة أو كائن [`URL`](/ar/nodejs/api/url#the-whatwg-url-api). إذا كان `url` سلسلة، فسيتم تحليله تلقائيًا باستخدام [`new URL()`](/ar/nodejs/api/url#new-urlinput-base). إذا كان كائن [`URL`](/ar/nodejs/api/url#the-whatwg-url-api)، فسيتم تحويله تلقائيًا إلى كائن `options` عادي.

إذا تم تحديد كل من `url` و `options`، فسيتم دمج الكائنات، مع أخذ خصائص `options` الأسبقية.

ستتم إضافة معلمة `callback` الاختيارية كمستمع لمرة واحدة لحدث [`'response'`](/ar/nodejs/api/http#event-response).

ترجع `http.request()` نسخة من فئة [`http.ClientRequest`](/ar/nodejs/api/http#class-httpclientrequest). نسخة `ClientRequest` هي تدفق قابل للكتابة. إذا كان المرء بحاجة إلى تحميل ملف بطلب POST، فاكتب إلى كائن `ClientRequest`.

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

في المثال تم استدعاء `req.end()`. مع `http.request()` يجب دائمًا استدعاء `req.end()` للدلالة على نهاية الطلب - حتى إذا لم تكن هناك بيانات مكتوبة في نص الطلب.

إذا حدث أي خطأ أثناء الطلب (سواء كان ذلك في حل DNS أو أخطاء مستوى TCP أو أخطاء تحليل HTTP فعلية) فسيتم إرسال حدث `'error'` على كائن الطلب الذي تم إرجاعه. كما هو الحال مع جميع أحداث `'error'`، إذا لم يتم تسجيل أي مستمعين، فسيتم طرح الخطأ.

هناك بعض الرؤوس الخاصة التي يجب ملاحظتها.

-  إرسال 'Connection: keep-alive' سيبلغ Node.js بأنه يجب الاحتفاظ بالاتصال بالخادم حتى الطلب التالي.
-  إرسال رأس 'Content-Length' سيعطل الترميز المجزأ الافتراضي.
-  إرسال رأس 'Expect' سيرسل رؤوس الطلب على الفور. عادةً، عند إرسال 'Expect: 100-continue'، يجب تعيين مهلة ومستمع لحدث `'continue'`. راجع RFC 2616 القسم 8.2.3 لمزيد من المعلومات.
-  إرسال رأس Authorization سيتجاوز استخدام خيار `auth` لحساب المصادقة الأساسية.

مثال باستخدام [`URL`](/ar/nodejs/api/url#the-whatwg-url-api) كـ `options`:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
في الطلب الناجح، سيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- `'response'`
    - `'data'` أي عدد من المرات، على كائن `res` (`'data'` لن يتم إرساله على الإطلاق إذا كان نص الاستجابة فارغًا، على سبيل المثال، في معظم عمليات إعادة التوجيه)
    - `'end'` على كائن `res`


- `'close'`

في حالة خطأ في الاتصال، سيتم إرسال الأحداث التالية:

- `'socket'`
- `'error'`
- `'close'`

في حالة إغلاق الاتصال قبل الأوان قبل تلقي الاستجابة، سيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- `'error'` مع خطأ بالرسالة `'Error: socket hang up'` والكود `'ECONNRESET'`
- `'close'`

في حالة إغلاق الاتصال قبل الأوان بعد تلقي الاستجابة، سيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- `'response'`
    - `'data'` أي عدد من المرات، على كائن `res`


- (تم إغلاق الاتصال هنا)
- `'aborted'` على كائن `res`
- `'close'`
- `'error'` على كائن `res` مع خطأ بالرسالة `'Error: aborted'` والكود `'ECONNRESET'`
- `'close'` على كائن `res`

إذا تم استدعاء `req.destroy()` قبل تعيين مقبس، فسيتم إرسال الأحداث التالية بالترتيب التالي:

- (تم استدعاء `req.destroy()` هنا)
- `'error'` مع خطأ بالرسالة `'Error: socket hang up'` والكود `'ECONNRESET'`، أو الخطأ الذي تم استدعاء `req.destroy()` به
- `'close'`

إذا تم استدعاء `req.destroy()` قبل نجاح الاتصال، فسيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- (تم استدعاء `req.destroy()` هنا)
- `'error'` مع خطأ بالرسالة `'Error: socket hang up'` والكود `'ECONNRESET'`، أو الخطأ الذي تم استدعاء `req.destroy()` به
- `'close'`

إذا تم استدعاء `req.destroy()` بعد تلقي الاستجابة، فسيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- `'response'`
    - `'data'` أي عدد من المرات، على كائن `res`


- (تم استدعاء `req.destroy()` هنا)
- `'aborted'` على كائن `res`
- `'close'`
- `'error'` على كائن `res` مع خطأ بالرسالة `'Error: aborted'` والكود `'ECONNRESET'`، أو الخطأ الذي تم استدعاء `req.destroy()` به
- `'close'` على كائن `res`

إذا تم استدعاء `req.abort()` قبل تعيين مقبس، فسيتم إرسال الأحداث التالية بالترتيب التالي:

- (تم استدعاء `req.abort()` هنا)
- `'abort'`
- `'close'`

إذا تم استدعاء `req.abort()` قبل نجاح الاتصال، فسيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- (تم استدعاء `req.abort()` هنا)
- `'abort'`
- `'error'` مع خطأ بالرسالة `'Error: socket hang up'` والكود `'ECONNRESET'`
- `'close'`

إذا تم استدعاء `req.abort()` بعد تلقي الاستجابة، فسيتم إرسال الأحداث التالية بالترتيب التالي:

- `'socket'`
- `'response'`
    - `'data'` أي عدد من المرات، على كائن `res`


- (تم استدعاء `req.abort()` هنا)
- `'abort'`
- `'aborted'` على كائن `res`
- `'error'` على كائن `res` مع خطأ بالرسالة `'Error: aborted'` والكود `'ECONNRESET'`.
- `'close'`
- `'close'` على كائن `res`

لن يؤدي تعيين خيار `timeout` أو استخدام الدالة `setTimeout()` إلى إلغاء الطلب أو فعل أي شيء بخلاف إضافة حدث `'timeout'`.

سيؤدي تمرير `AbortSignal` ثم استدعاء `abort()` على `AbortController` المطابق إلى التصرف بنفس طريقة استدعاء `.destroy()` على الطلب. على وجه التحديد، سيتم إرسال حدث `'error'` مع خطأ بالرسالة `'AbortError: The operation was aborted'`، والكود `'ABORT_ERR'` و `cause`، إذا تم توفير واحد.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v19.5.0, v18.14.0 | تمت إضافة المعامل `label`. |
| v14.3.0 | تمت إضافته في: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تسمية لرسالة الخطأ. **الافتراضي:** `'اسم الرأس'`.

يقوم بإجراء عمليات التحقق منخفضة المستوى على `name` المقدم والتي تتم عند استدعاء `res.setHeader(name, value)`.

سيؤدي تمرير قيمة غير قانونية كـ `name` إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror)، يتم تحديده بواسطة `code: 'ERR_INVALID_HTTP_TOKEN'`.

ليس من الضروري استخدام هذه الطريقة قبل تمرير الرؤوس إلى طلب HTTP أو استجابته. ستقوم وحدة HTTP تلقائيًا بالتحقق من صحة هذه الرؤوس.

مثال:

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'يجب أن يكون اسم الرأس رمز HTTP صالح [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'يجب أن يكون اسم الرأس رمز HTTP صالح [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**تمت إضافته في: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يقوم بإجراء عمليات التحقق منخفضة المستوى على `value` المقدم والذي يتم عند استدعاء `res.setHeader(name, value)`.

سيؤدي تمرير قيمة غير قانونية كـ `value` إلى ظهور [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

- يتم تحديد خطأ القيمة غير المعرفة بواسطة `code: 'ERR_HTTP_INVALID_HEADER_VALUE'`.
- يتم تحديد خطأ حرف القيمة غير الصالح بواسطة `code: 'ERR_INVALID_CHAR'`.

ليس من الضروري استخدام هذه الطريقة قبل تمرير الرؤوس إلى طلب HTTP أو استجابته. ستقوم وحدة HTTP تلقائيًا بالتحقق من صحة هذه الرؤوس.

أمثلة:

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'قيمة غير صالحة "غير معرف" للرأس "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'حرف غير صالح في محتوى الرأس ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'قيمة غير صالحة "غير معرف" للرأس "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'حرف غير صالح في محتوى الرأس ["x-my-header"]'
}
```
:::


## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**تمت إضافتها في: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `1000`.

يحدد الحد الأقصى لعدد مُحلّلات HTTP الخاملة.

## `WebSocket` {#websocket}

**تمت إضافتها في: v22.5.0**

تنفيذ متوافق مع المتصفح لـ [`WebSocket`](/ar/nodejs/api/http#websocket).

