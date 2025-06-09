---
title: توثيق Node.js - الشبكة (Net)
description: توفر وحدة 'net' في Node.js واجهة برمجة تطبيقات غير متزامنة لإنشاء خوادم وعملاء TCP أو IPC استنادًا إلى التدفقات. تشمل الأساليب لإنشاء الاتصالات والخوادم والتعامل مع عمليات المقابس.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الشبكة (Net) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة 'net' في Node.js واجهة برمجة تطبيقات غير متزامنة لإنشاء خوادم وعملاء TCP أو IPC استنادًا إلى التدفقات. تشمل الأساليب لإنشاء الاتصالات والخوادم والتعامل مع عمليات المقابس.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الشبكة (Net) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة 'net' في Node.js واجهة برمجة تطبيقات غير متزامنة لإنشاء خوادم وعملاء TCP أو IPC استنادًا إلى التدفقات. تشمل الأساليب لإنشاء الاتصالات والخوادم والتعامل مع عمليات المقابس.
---


# شبكة {#net}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

توفر الوحدة `node:net` واجهة برمجة تطبيقات شبكة غير متزامنة لإنشاء خوادم TCP أو [IPC](/ar/nodejs/api/net#ipc-support) تعتمد على التدفق ([`net.createServer()`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener)) وعملاء ([`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection)).

يمكن الوصول إليه باستخدام:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## دعم IPC {#ipc-support}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.8.0 | دعم الربط بمسار مقبس نطاق Unix مجرد مثل `\0abstract`. يمكننا ربط '\0' لـ Node.js `\< v20.4.0`. |
:::

تدعم الوحدة `node:net` اتصالات IPC باستخدام الأنابيب المسماة على نظام التشغيل Windows، ومقابس نطاق Unix على أنظمة التشغيل الأخرى.

### تحديد المسارات لاتصالات IPC {#identifying-paths-for-ipc-connections}

تأخذ الدوال [`net.connect()`](/ar/nodejs/api/net#netconnect)، [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection)، [`server.listen()`](/ar/nodejs/api/net#serverlisten)، و [`socket.connect()`](/ar/nodejs/api/net#socketconnect) معامِلاً `path` لتحديد نقاط نهاية IPC.

في Unix، يُعرف النطاق المحلي أيضًا باسم نطاق Unix. المسار هو اسم مسار نظام الملفات. سيتم طرح خطأ عندما يكون طول اسم المسار أكبر من طول `sizeof(sockaddr_un.sun_path)`. القيم النموذجية هي 107 بايت على Linux و 103 بايت على macOS. إذا قام تجريد واجهة برمجة تطبيقات Node.js بإنشاء مقبس نطاق Unix، فإنه سيقوم بإلغاء ربط مقبس نطاق Unix أيضًا. على سبيل المثال، قد تنشئ الدالة [`net.createServer()`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener) مقبس نطاق Unix وتقوم الدالة [`server.close()`](/ar/nodejs/api/net#serverclosecallback) بإلغاء ربطه. ولكن إذا قام المستخدم بإنشاء مقبس نطاق Unix خارج هذه التجريدات، فسيتعين على المستخدم إزالته. وينطبق الشيء نفسه عندما تنشئ واجهة برمجة تطبيقات Node.js مقبس نطاق Unix ولكن البرنامج يتعطل بعد ذلك. باختصار، سيكون مقبس نطاق Unix مرئيًا في نظام الملفات وسيستمر حتى يتم إلغاء ربطه. على نظام Linux، يمكنك استخدام مقبس Unix المجرد عن طريق إضافة `\0` في بداية المسار، مثل `\0abstract`. مسار مقبس Unix المجرد غير مرئي في نظام الملفات وسيختفي تلقائيًا عند إغلاق جميع المراجع المفتوحة للمقبس.

في نظام التشغيل Windows، يتم تنفيذ النطاق المحلي باستخدام أنبوب مسمى. يجب أن يشير المسار *إلى* إدخال في `\\?\pipe\` أو `\\.\pipe\`. يُسمح بأي أحرف، ولكن قد تقوم الأخيرة ببعض معالجة أسماء الأنابيب، مثل حل تسلسلات `..`. على الرغم من مظهره، فإن مساحة اسم الأنبوب مسطحة. الأنابيب *لن تستمر*. تتم إزالتها عند إغلاق آخر مرجع إليها. على عكس مقابس نطاق Unix، سيقوم نظام التشغيل Windows بإغلاق وإزالة الأنبوب عند إنهاء العملية المالكة.

يتطلب الهروب من سلسلة JavaScript تحديد المسارات مع إلغاء الهروب بشرطة مائلة عكسية إضافية مثل:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## الفئة: `net.BlockList` {#class-netblocklist}

**تمت إضافتها في: الإصدار v15.0.0, v14.18.0**

يمكن استخدام كائن `BlockList` مع بعض واجهات برمجة تطبيقات الشبكة لتحديد قواعد لتعطيل الوصول الوارد أو الصادر إلى عناوين IP محددة أو نطاقات IP أو شبكات IP الفرعية.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**تمت إضافتها في: الإصدار v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress) عنوان IPv4 أو IPv6.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'ipv4'` أو `'ipv6'`. **افتراضي:** `'ipv4'`.

يضيف قاعدة لحظر عنوان IP المحدد.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**تمت إضافتها في: الإصدار v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress) عنوان IPv4 أو IPv6 البدائي في النطاق.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress) عنوان IPv4 أو IPv6 النهائي في النطاق.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'ipv4'` أو `'ipv6'`. **افتراضي:** `'ipv4'`.

يضيف قاعدة لحظر نطاق من عناوين IP من `start` (شامل) إلى `end` (شامل).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**تمت إضافتها في: الإصدار v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress) عنوان شبكة IPv4 أو IPv6.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بتات بادئة CIDR. بالنسبة لـ IPv4، يجب أن تكون قيمة بين `0` و `32`. بالنسبة لـ IPv6، يجب أن تكون بين `0` و `128`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'ipv4'` أو `'ipv6'`. **افتراضي:** `'ipv4'`.

يضيف قاعدة لحظر نطاق من عناوين IP محددة كقناع شبكة فرعية.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**تمت الإضافة في: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress) عنوان IP المراد فحصه
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'ipv4'` أو `'ipv6'`. **افتراضي:** `'ipv4'`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ترجع `true` إذا كان عنوان IP المحدد يطابق أيًا من القواعد المضافة إلى `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // يطبع: true
console.log(blockList.check('10.0.0.3'));  // يطبع: true
console.log(blockList.check('222.111.111.222'));  // يطبع: false

// تعمل تدوين IPv6 لعناوين IPv4:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // يطبع: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // يطبع: true
```
### `blockList.rules` {#blocklistrules}

**تمت الإضافة في: v15.0.0, v14.18.0**

- النوع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة القواعد المضافة إلى القائمة المحظورة.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**تمت الإضافة في: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JS
- ترجع `true` إذا كانت `value` عبارة عن `net.BlockList`.

## الفئة: `net.SocketAddress` {#class-netsocketaddress}

**تمت الإضافة في: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**تمت الإضافة في: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان الشبكة كسلسلة IPv4 أو IPv6. **افتراضي**: `'127.0.0.1'` إذا كانت `family` هي `'ipv4'`; `'::'` إذا كانت `family` هي `'ipv6'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) واحدة من `'ipv4'` أو `'ipv6'`. **افتراضي**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) تسمية تدفق IPv6 تستخدم فقط إذا كانت `family` هي `'ipv6'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) منفذ IP.


### `socketaddress.address` {#socketaddressaddress}

**تمت الإضافة في: v15.14.0, v14.18.0**

- النوع [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**تمت الإضافة في: v15.14.0, v14.18.0**

- النوع [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'ipv4'` أو `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**تمت الإضافة في: v15.14.0, v14.18.0**

- النوع [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**تمت الإضافة في: v15.14.0, v14.18.0**

- النوع [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**تمت الإضافة في: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة إدخال تحتوي على عنوان IP ومنفذ اختياري، على سبيل المثال `123.1.2.3:1234` أو `[1::1]:1234`.
- Returns: [\<net.SocketAddress\>](/ar/nodejs/api/net#class-netsocketaddress) تُرجع `SocketAddress` إذا نجح التحليل. وإلا فستُرجع `undefined`.

## الصنف: `net.Server` {#class-netserver}

**تمت الإضافة في: v0.1.90**

- يمتد من: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يُستخدم هذا الصنف لإنشاء خادم TCP أو [IPC](/ar/nodejs/api/net#ipc-support).

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`net.createServer([options][, connectionListener])`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم تعيينه تلقائيًا كمستمع لحدث [`'connection'`](/ar/nodejs/api/net#event-connection).
- Returns: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

`net.Server` هو [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter) مع الأحداث التالية:

### الحدث: `'close'` {#event-close}

**تمت الإضافة في: v0.5.0**

يتم إطلاقه عند إغلاق الخادم. إذا كانت الاتصالات موجودة، فلن يتم إطلاق هذا الحدث حتى تنتهي جميع الاتصالات.


### الحدث: `'connection'` {#event-connection}

**تمت الإضافة في: الإصدار v0.1.90**

- [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) كائن الاتصال

يصدر هذا الحدث عند إنشاء اتصال جديد. `socket` هو نسخة من `net.Socket`.

### الحدث: `'error'` {#event-error}

**تمت الإضافة في: الإصدار v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يصدر هذا الحدث عند حدوث خطأ. على عكس [`net.Socket`](/ar/nodejs/api/net#class-netsocket)، لن يتم إصدار الحدث [`'close'`](/ar/nodejs/api/net#event-close) مباشرة بعد هذا الحدث ما لم يتم استدعاء [`server.close()`](/ar/nodejs/api/net#serverclosecallback) يدويًا. انظر المثال في مناقشة [`server.listen()`](/ar/nodejs/api/net#serverlisten).

### الحدث: `'listening'` {#event-listening}

**تمت الإضافة في: الإصدار v0.1.90**

يصدر هذا الحدث عندما يتم ربط الخادم بعد استدعاء [`server.listen()`](/ar/nodejs/api/net#serverlisten).

### الحدث: `'drop'` {#event-drop}

**تمت الإضافة في: الإصدار v18.6.0، v16.17.0**

عندما يصل عدد الاتصالات إلى حد `server.maxConnections`، سيقوم الخادم بإسقاط الاتصالات الجديدة وإصدار الحدث `'drop'` بدلاً من ذلك. إذا كان خادم TCP، فإن الوسيطة هي كما يلي، وإلا فإن الوسيطة هي `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الوسيطة التي تم تمريرها إلى مستمع الحدث.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) العنوان المحلي.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ المحلي.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) العائلة المحلية.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) العنوان البعيد.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ البعيد.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عائلة IP البعيدة. `'IPv4'` أو `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v18.4.0 | تعيد الخاصية `family` الآن سلسلة بدلاً من رقم. |
| v18.0.0 | تعيد الخاصية `family` الآن رقمًا بدلاً من سلسلة. |
| v0.1.90 | تمت الإضافة في: v0.1.90 |
:::

- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

يُرجع `address` المرتبط واسم `family` للعنوان و `port` الخادم كما تم الإبلاغ عنه بواسطة نظام التشغيل إذا كان يستمع على مقبس IP (مفيد للعثور على المنفذ الذي تم تعيينه عند الحصول على عنوان مُعيّن من نظام التشغيل): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

بالنسبة لخادم يستمع على أنبوب أو مقبس نطاق Unix، يتم إرجاع الاسم كسلسلة.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.
server.listen(() => {
  console.log('opened server on', server.address());
});
```
يُرجع `server.address()` قيمة `null` قبل إصدار الحدث `'listening'` أو بعد استدعاء `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**تمت الإضافة في: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه عند إغلاق الخادم.
- إرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

يوقف الخادم عن قبول اتصالات جديدة ويحتفظ بالاتصالات الحالية. هذه الدالة غير متزامنة، ويتم إغلاق الخادم أخيرًا عند انتهاء جميع الاتصالات ويصدر الخادم حدث [`'close'`](/ar/nodejs/api/net#event-close). سيتم استدعاء `callback` الاختياري بمجرد وقوع الحدث `'close'`. على عكس هذا الحدث، سيتم استدعاؤه باستخدام `Error` كوسيطة وحيدة إذا لم يكن الخادم مفتوحًا عند إغلاقه.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**أضيف في: الإصدار 20.5.0، الإصدار 18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`server.close()`](/ar/nodejs/api/net#serverclosecallback) ويعيد وعدًا يتحقق عند إغلاق الخادم.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**أضيف في: الإصدار 0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

يحصل بشكل غير متزامن على عدد الاتصالات المتزامنة على الخادم. يعمل عندما يتم إرسال المقابس إلى التفرعات.

يجب أن تأخذ الدالة المستدعاة وسيطتين `err` و `count`.

### `server.listen()` {#serverlisten}

ابدأ خادمًا يستمع للاتصالات. يمكن أن يكون `net.Server` خادم TCP أو خادم [IPC](/ar/nodejs/api/net#ipc-support) اعتمادًا على ما يستمع إليه.

التوقيعات المحتملة:

- [`server.listen(handle[, backlog][, callback])`](/ar/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/ar/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/ar/nodejs/api/net#serverlistenpath-backlog-callback) لخوادم [IPC](/ar/nodejs/api/net#ipc-support)
- [`server.listen([port[, host[, backlog]]][, callback])`](/ar/nodejs/api/net#serverlistenport-host-backlog-callback) لخوادم TCP

هذه الدالة غير متزامنة. عندما يبدأ الخادم في الاستماع، سيتم إطلاق الحدث [`'listening'`](/ar/nodejs/api/net#event-listening). ستتم إضافة المعلمة الأخيرة `callback` كمستمع للحدث [`'listening'`](/ar/nodejs/api/net#event-listening).

يمكن لجميع طرق `listen()` أن تأخذ معلمة `backlog` لتحديد الحد الأقصى لطول قائمة الاتصالات المعلقة. سيتم تحديد الطول الفعلي بواسطة نظام التشغيل من خلال إعدادات sysctl مثل `tcp_max_syn_backlog` و `somaxconn` على Linux. القيمة الافتراضية لهذه المعلمة هي 511 (ليست 512).

يتم تعيين جميع [`net.Socket`](/ar/nodejs/api/net#class-netsocket) إلى `SO_REUSEADDR` (راجع [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) للحصول على التفاصيل).

يمكن استدعاء الطريقة `server.listen()` مرة أخرى فقط إذا كان هناك خطأ أثناء استدعاء `server.listen()` الأول أو تم استدعاء `server.close()`. بخلاف ذلك، سيتم طرح خطأ `ERR_SERVER_ALREADY_LISTEN`.

أحد أكثر الأخطاء شيوعًا التي يتم طرحها عند الاستماع هو `EADDRINUSE`. يحدث هذا عندما يستمع خادم آخر بالفعل على `المنفذ`/`المسار`/`المقبض` المطلوب. إحدى طرق التعامل مع هذا هي إعادة المحاولة بعد فترة زمنية معينة:

```js [ESM]
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('العنوان قيد الاستخدام، تتم إعادة المحاولة...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])` {#serverlistenhandle-backlog-callback}

**أُضيف في: v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) وسيطة شائعة لوظائف [`server.listen()`](/ar/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

يبدأ الخادم في الاستماع للاتصالات على `handle` معينة تم ربطها بالفعل بمنفذ أو مقبس نطاق Unix أو قناة مسماة في Windows.

يمكن أن يكون كائن `handle` إما خادمًا أو مقبسًا (أي شيء لديه عضو `_handle` أساسي)، أو كائنًا له عضو `fd` وهو واصف ملف صالح.

الاستماع على واصف ملف غير مدعوم على Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.1.0 | خيار `reusePort` مدعوم. |
| v15.6.0 | تمت إضافة دعم AbortSignal. |
| v11.4.0 | خيار `ipv6Only` مدعوم. |
| v0.11.14 | أُضيف في: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مطلوب. يدعم الخصائص التالية:
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) وسيطة شائعة لوظائف [`server.listen()`](/ar/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لخوادم TCP، سيؤدي تعيين `ipv6Only` إلى `true` إلى تعطيل دعم المكدس المزدوج، أي أن الربط بالمضيف `::` لن يجعل `0.0.0.0` مرتبطًا. **الافتراضي:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) بالنسبة لخوادم TCP، يسمح تعيين `reusePort` إلى `true` لعدة مآخذ توصيل على نفس المضيف بالربط بنفس المنفذ. يتم توزيع الاتصالات الواردة بواسطة نظام التشغيل على مآخذ التوصيل المستمعة. هذا الخيار متاح فقط على بعض الأنظمة الأساسية، مثل Linux 3.9+ و DragonFlyBSD 3.6+ و FreeBSD 12.0+ و Solaris 11.4 و AIX 7.2.5+. **الافتراضي:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سيتم تجاهله إذا تم تحديد `port`. راجع [تحديد المسارات لاتصالات IPC](/ar/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) بالنسبة لخوادم IPC، تجعل الأنبوب قابلاً للقراءة لجميع المستخدمين. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) إشارة إلغاء يمكن استخدامها لإغلاق خادم يستمع.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) بالنسبة لخوادم IPC، تجعل الأنبوب قابلاً للكتابة لجميع المستخدمين. **الافتراضي:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- الإرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

إذا تم تحديد `port`، فسيكون سلوكه هو نفسه [`server.listen([port[, host[, backlog]]][, callback])`](/ar/nodejs/api/net#serverlistenport-host-backlog-callback). بخلاف ذلك، إذا تم تحديد `path`، فسيكون سلوكه هو نفسه [`server.listen(path[, backlog][, callback])`](/ar/nodejs/api/net#serverlistenpath-backlog-callback). إذا لم يتم تحديد أي منهما، فسيتم طرح خطأ.

إذا كانت `exclusive` هي `false` (افتراضي)، فسيستخدم عمال المجموعة نفس المعالج الأساسي، مما يسمح بمشاركة مهام معالجة الاتصال. عندما تكون `exclusive` هي `true`، لا تتم مشاركة المعالج، وتؤدي محاولة مشاركة المنفذ إلى حدوث خطأ. يظهر أدناه مثال يستمع على منفذ حصري.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
عندما تكون `exclusive` هي `true` ويتم مشاركة المعالج الأساسي، فمن المحتمل أن يستعلم العديد من العمال عن معالج بمسافات متراكمة مختلفة. في هذه الحالة، سيتم استخدام `backlog` الأول الذي تم تمريره إلى العملية الرئيسية.

قد يؤدي بدء تشغيل خادم IPC كجذر إلى جعل مسار الخادم غير قابل للوصول للمستخدمين غير المتميزين. سيؤدي استخدام `readableAll` و `writableAll` إلى جعل الخادم متاحًا لجميع المستخدمين.

إذا تم تمكين الخيار `signal`، فإن استدعاء `.abort()` على `AbortController` المقابل يشبه استدعاء `.close()` على الخادم:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Later, when you want to close the server.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**تمت إضافتها في: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): المسار الذي يجب أن يستمع إليه الخادم. انظر [تحديد مسارات اتصالات IPC](/ar/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): معامل شائع لوظائف [`server.listen()`](/ar/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- الإرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

ابدأ خادم [IPC](/ar/nodejs/api/net#ipc-support) يستمع للاتصالات على `path` المحدد.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**تمت إضافتها في: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): معامل شائع لوظائف [`server.listen()`](/ar/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- الإرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

ابدأ خادم TCP يستمع للاتصالات على `port` و `host` المحددين.

إذا تم حذف `port` أو كانت 0، فسيقوم نظام التشغيل بتعيين منفذ عشوائي غير مستخدم، والذي يمكن استرداده باستخدام `server.address().port` بعد انبعاث حدث [`'listening'`](/ar/nodejs/api/net#event-listening).

إذا تم حذف `host`، فسيقبل الخادم الاتصالات على [عنوان IPv6 غير المحدد](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) عندما يكون IPv6 متاحًا، أو [عنوان IPv4 غير المحدد](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) بخلاف ذلك.

في معظم أنظمة التشغيل، قد يؤدي الاستماع إلى [عنوان IPv6 غير المحدد](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) إلى جعل `net.Server` يستمع أيضًا إلى [عنوان IPv4 غير المحدد](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).


### `server.listening` {#serverlistening}

**تمت الإضافة في: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان الخادم يستمع للاتصالات أم لا.

### `server.maxConnections` {#servermaxconnections}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | يؤدي تعيين `maxConnections` إلى `0` إلى إسقاط جميع الاتصالات الواردة. في السابق، كان يتم تفسيره على أنه `Infinity`. |
| v0.2.0 | تمت الإضافة في: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عندما يصل عدد الاتصالات إلى حد `server.maxConnections`:

لا يُنصح باستخدام هذا الخيار بمجرد إرسال مقبس إلى عملية فرعية باستخدام [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**تمت الإضافة في: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

قم بتعيين هذه الخاصية إلى `true` لبدء إغلاق الاتصالات بمجرد وصول عدد الاتصالات إلى حد [`server.maxConnections`][]. هذا الإعداد فعال فقط في وضع المجموعة.

### `server.ref()` {#serverref}

**تمت الإضافة في: v0.9.1**

- Returns: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

عكس `unref()`، استدعاء `ref()` على خادم تم إلغاء مرجعيته سابقًا *لن* يسمح للبرنامج بالخروج إذا كان الخادم الوحيد المتبقي (السلوك الافتراضي). إذا كان الخادم `ref`ed فإن استدعاء `ref()` مرة أخرى لن يكون له أي تأثير.

### `server.unref()` {#serverunref}

**تمت الإضافة في: v0.9.1**

- Returns: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

سيسمح استدعاء `unref()` على خادم للبرنامج بالخروج إذا كان هذا هو الخادم النشط الوحيد في نظام الأحداث. إذا كان الخادم `unref`ed بالفعل فإن استدعاء `unref()` مرة أخرى لن يكون له أي تأثير.

## Class: `net.Socket` {#class-netsocket}

**تمت الإضافة في: v0.3.4**

- Extends: [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

هذه الفئة هي تجريد لمقبس TCP أو نقطة نهاية [IPC](/ar/nodejs/api/net#ipc-support) دفقية (تستخدم أنابيب مسماة على Windows ومقابس نطاق Unix بخلاف ذلك). وهي أيضًا [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter).

يمكن إنشاء `net.Socket` بواسطة المستخدم واستخدامه مباشرة للتفاعل مع الخادم. على سبيل المثال، يتم إرجاعه بواسطة [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection)، لذلك يمكن للمستخدم استخدامه للتحدث مع الخادم.

يمكن أيضًا إنشاؤه بواسطة Node.js وتمريره إلى المستخدم عند استقبال اتصال. على سبيل المثال، يتم تمريره إلى المستمعين لحدث [`'connection'`](/ar/nodejs/api/net#event-connection) المنبعث على [`net.Server`](/ar/nodejs/api/net#class-netserver)، لذلك يمكن للمستخدم استخدامه للتفاعل مع العميل.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.14.0 | تمت إضافة دعم AbortSignal. |
| v12.10.0 | تمت إضافة خيار `onread`. |
| v0.3.4 | تمت الإضافة في: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الخيارات المتاحة هي:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينها على `false`، فستقوم المقبس تلقائيًا بإنهاء الجانب القابل للكتابة عندما ينتهي الجانب القابل للقراءة. انظر [`net.createServer()`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener) وحدث [`'end'`](/ar/nodejs/api/net#event-end) للحصول على التفاصيل. **الافتراضي:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تم تحديده، فقم بالتفاف حول مقبس موجود باستخدام واصف الملف المحدد، وإلا فسيتم إنشاء مقبس جديد.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إذا تم تحديده، فسيتم تخزين البيانات الواردة في `buffer` واحد ويتم تمريرها إلى `callback` المقدمة عند وصول البيانات إلى المقبس. سيؤدي هذا إلى عدم توفير وظيفة التدفق لأي بيانات. سيصدر المقبس أحداثًا مثل `'error'` و `'end'` و `'close'` كالمعتاد. ستتصرف طرق مثل `pause()` و `resume()` كما هو متوقع أيضًا.
    - `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) إما جزء قابل لإعادة الاستخدام من الذاكرة لاستخدامه لتخزين البيانات الواردة أو دالة تُرجع مثل هذا الجزء.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاء هذه الدالة لكل جزء من البيانات الواردة. يتم تمرير وسيطتين إليها: عدد البايتات المكتوبة في `buffer` ومرجع إلى `buffer`. أرجع `false` من هذه الدالة لـ `pause()` المقبس ضمنيًا. سيتم تنفيذ هذه الدالة في السياق العام.


    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) السماح بالقراءات على المقبس عند تمرير `fd`، وإلا يتم تجاهله. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) إشارة إجهاض يمكن استخدامها لتدمير المقبس.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) السماح بالكتابات على المقبس عند تمرير `fd`، وإلا يتم تجاهله. **الافتراضي:** `false`.


- Returns: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يقوم بإنشاء كائن مقبس جديد.

يمكن أن يكون المقبس الذي تم إنشاؤه حديثًا إما مقبس TCP أو نقطة نهاية [IPC](/ar/nodejs/api/net#ipc-support) للتدفق، اعتمادًا على ما [`connect()`](/ar/nodejs/api/net#socketconnect) به.


### الحدث: `'close'` {#event-close_1}

**أُضيف في: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كان المقبس يحتوي على خطأ في الإرسال.

يُطلق مرة واحدة عند إغلاق المقبس بالكامل. الوسيط `hadError` هو قيمة منطقية تشير إلى ما إذا كان المقبس قد أُغلق بسبب خطأ في الإرسال.

### الحدث: `'connect'` {#event-connect}

**أُضيف في: v0.1.90**

يُطلق عند إنشاء اتصال مقبس بنجاح. راجع [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection).

### الحدث: `'connectionAttempt'` {#event-connectionattempt}

**أُضيف في: v21.6.0، v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان IP الذي يحاول المقبس الاتصال به.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الذي يحاول المقبس الاتصال به.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عائلة IP. يمكن أن تكون `6` لـ IPv6 أو `4` لـ IPv4.

يُطلق عند بدء محاولة اتصال جديدة. قد يُطلق هذا الحدث عدة مرات إذا تم تمكين خوارزمية الاختيار التلقائي للعائلة في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).

### الحدث: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**أُضيف في: v21.6.0، v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان IP الذي حاول المقبس الاتصال به.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الذي حاول المقبس الاتصال به.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عائلة IP. يمكن أن تكون `6` لـ IPv6 أو `4` لـ IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الخطأ المرتبط بالفشل.

يُطلق عند فشل محاولة اتصال. قد يُطلق هذا الحدث عدة مرات إذا تم تمكين خوارزمية الاختيار التلقائي للعائلة في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).


### الحدث: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**أضيف في: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان IP الذي حاولت المقبس الاتصال به.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الذي حاولت المقبس الاتصال به.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عائلة IP. يمكن أن تكون `6` لـ IPv6 أو `4` لـ IPv4.

يصدر هذا الحدث عندما تنتهي مهلة محاولة الاتصال. يتم إصداره فقط (وقد يتم إصداره عدة مرات) إذا تم تمكين خوارزمية الاختيار التلقائي للعائلة في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).

### الحدث: `'data'` {#event-data}

**أضيف في: v0.1.90**

- [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يصدر هذا الحدث عند استلام البيانات. ستكون الوسيطة `data` إما `Buffer` أو `String`. يتم تعيين ترميز البيانات بواسطة [`socket.setEncoding()`](/ar/nodejs/api/net#socketsetencodingencoding).

سيتم فقد البيانات إذا لم يكن هناك مستمع عندما يصدر `Socket` الحدث `'data'`.

### الحدث: `'drain'` {#event-drain}

**أضيف في: v0.1.90**

يصدر هذا الحدث عندما تصبح مخزن الكتابة المؤقتة فارغًا. يمكن استخدامه لتنظيم عمليات التحميل.

انظر أيضًا: القيم المرجعية لـ `socket.write()`.

### الحدث: `'end'` {#event-end}

**أضيف في: v0.1.90**

يصدر هذا الحدث عندما يشير الطرف الآخر من المقبس إلى نهاية الإرسال، وبالتالي إنهاء الجانب القابل للقراءة من المقبس.

افتراضيًا (`allowHalfOpen` هو `false`) سيرسل المقبس حزمة نهاية الإرسال مرة أخرى ويتلف واصف الملف الخاص به بمجرد كتابة قائمة انتظار الكتابة المعلقة الخاصة به. ومع ذلك، إذا تم تعيين `allowHalfOpen` على `true`، فلن يقوم المقبس تلقائيًا [`end()`](/ar/nodejs/api/net#socketenddata-encoding-callback) بالجانب القابل للكتابة، مما يسمح للمستخدم بكتابة كميات اعتباطية من البيانات. يجب على المستخدم استدعاء [`end()`](/ar/nodejs/api/net#socketenddata-encoding-callback) بشكل صريح لإغلاق الاتصال (أي إرسال حزمة FIN مرة أخرى).


### الحدث: `'error'` {#event-error_1}

**تمت إضافته في: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إطلاقه عند حدوث خطأ. سيتم استدعاء الحدث `'close'` مباشرة بعد هذا الحدث.

### الحدث: `'lookup'` {#event-lookup}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.10.0 | يتم دعم المعامل `host` الآن. |
| v0.11.3 | تمت إضافته في: v0.11.3 |
:::

يتم إطلاقه بعد حل اسم المضيف ولكن قبل الاتصال. لا ينطبق على مقابس Unix.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) كائن الخطأ. راجع [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان IP.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) نوع العنوان. راجع [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف.

### الحدث: `'ready'` {#event-ready}

**تمت إضافته في: v9.11.0**

يتم إطلاقه عندما يكون المقبس جاهزًا للاستخدام.

يتم تشغيله مباشرة بعد `'connect'`.

### الحدث: `'timeout'` {#event-timeout}

**تمت إضافته في: v0.1.90**

يتم إطلاقه إذا انتهت مهلة المقبس بسبب عدم النشاط. هذا فقط للإعلام بأن المقبس كان خامدًا. يجب على المستخدم إغلاق الاتصال يدويًا.

انظر أيضًا: [`socket.setTimeout()`](/ar/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.4.0 | تُرجع الخاصية `family` الآن سلسلة بدلاً من رقم. |
| v18.0.0 | تُرجع الخاصية `family` الآن رقمًا بدلاً من سلسلة. |
| v0.1.90 | تمت إضافته في: v0.1.90 |
:::

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع `address` المرتبط واسم `family` العنوان و `port` للمقبس كما هو مُبلغ عنه بواسطة نظام التشغيل: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**تمت إضافته في: v19.4.0، v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تكون هذه الخاصية موجودة فقط إذا تم تمكين خوارزمية الاختيار التلقائي للعائلة في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) وهي عبارة عن مصفوفة من العناوين التي تمت محاولتها.

كل عنوان هو سلسلة نصية في شكل `$IP:$PORT`. إذا كان الاتصال ناجحًا، فإن العنوان الأخير هو العنوان الذي يتصل به المقبس حاليًا.

### `socket.bufferSize` {#socketbuffersize}

**تمت إضافته في: v0.3.8**

**تم الإيقاف منذ: v14.6.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`writable.writableLength`](/ar/nodejs/api/stream#writablewritablelength) بدلاً من ذلك.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تعرض هذه الخاصية عدد الأحرف المخزنة مؤقتًا للكتابة. قد تحتوي المخزن المؤقت على سلاسل نصية لا يُعرف طولها بعد الترميز. لذلك هذا الرقم هو مجرد تقدير لعدد البايتات في المخزن المؤقت.

`net.Socket` لديه الخاصية التي تجعل `socket.write()` تعمل دائمًا. هذا لمساعدة المستخدمين على البدء والتشغيل بسرعة. لا يمكن للكمبيوتر دائمًا مواكبة كمية البيانات التي يتم كتابتها إلى مأخذ توصيل. قد يكون اتصال الشبكة ببساطة بطيئًا جدًا. سيقوم Node.js داخليًا بوضع البيانات المكتوبة إلى مأخذ التوصيل في قائمة الانتظار وإرسالها عبر السلك عندما يكون ذلك ممكنًا.

نتيجة هذا التخزين المؤقت الداخلي هي أن الذاكرة قد تنمو. يجب على المستخدمين الذين يعانون من `bufferSize` كبير أو متزايد محاولة "تقييد" تدفقات البيانات في برنامجهم باستخدام [`socket.pause()`](/ar/nodejs/api/net#socketpause) و [`socket.resume()`](/ar/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**تمت إضافته في: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

كمية البايتات المستلمة.


### `socket.bytesWritten` {#socketbyteswritten}

**أُضيف في: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

مقدار البايتات المرسلة.

### `socket.connect()` {#socketconnect}

يبدأ اتصالًا على مقبس معين.

التوقيعات الممكنة:

- [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/ar/nodejs/api/net#socketconnectpath-connectlistener) لاتصالات [IPC](/ar/nodejs/api/net#ipc-support).
- [`socket.connect(port[, host][, connectListener])`](/ar/nodejs/api/net#socketconnectport-host-connectlistener) لاتصالات TCP.
- يُرجع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

هذه الدالة غير متزامنة. عند إنشاء الاتصال، سيتم إطلاق الحدث [`'connect'`](/ar/nodejs/api/net#event-connect). إذا كانت هناك مشكلة في الاتصال، فبدلًا من الحدث [`'connect'`](/ar/nodejs/api/net#event-connect)، سيتم إطلاق الحدث [`'error'`](/ar/nodejs/api/net#event-error_1) مع تمرير الخطأ إلى مستمع [`'error'`](/ar/nodejs/api/net#event-error_1). سيتم إضافة المعامل الأخير `connectListener`، إذا تم توفيره، كمستمع للحدث [`'connect'`](/ar/nodejs/api/net#event-connect) **مرة واحدة**.

يجب استخدام هذه الدالة فقط لإعادة توصيل مقبس بعد إطلاق `'close'` أو قد يؤدي ذلك إلى سلوك غير محدد.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.4.0 | يمكن تغيير القيمة الافتراضية لخيار autoSelectFamily في وقت التشغيل باستخدام `setDefaultAutoSelectFamily` أو عبر خيار سطر الأوامر `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | القيمة الافتراضية لخيار autoSelectFamily هي الآن true. تمت إعادة تسمية علامة CLI `--enable-network-family-autoselection` إلى `--network-family-autoselection`. الاسم القديم هو الآن اسم مستعار ولكن لا يُشجع عليه. |
| v19.3.0, v18.13.0 | تمت إضافة خيار `autoSelectFamily`. |
| v17.7.0, v16.15.0 | خيارات `noDelay` و `keepAlive` و `keepAliveInitialDelay` مدعومة الآن. |
| v6.0.0 | خيار `hints` افتراضيًا هو `0` في جميع الحالات الآن. سابقًا، في غياب خيار `family`، كان سيصبح افتراضيًا `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | خيار `hints` مدعوم الآن. |
| v0.1.90 | أُضيف في: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معلمة شائعة لطرق [`socket.connect()`](/ar/nodejs/api/net#socketconnect). سيتم إضافته كمستمع للحدث [`'connect'`](/ar/nodejs/api/net#event-connect) مرة واحدة.
- يُرجع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

يبدأ اتصالًا على مقبس معين. عادةً ما تكون هذه الطريقة غير ضرورية، يجب إنشاء المقبس وفتحه باستخدام [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection). استخدم هذا فقط عند تنفيذ مقبس مخصص.

بالنسبة لاتصالات TCP، الخيارات المتاحة هي:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): إذا تم تعيينه على `true`، فإنه يمكّن خوارزمية الكشف التلقائي عن العائلة التي تنفذ بشكل فضفاض القسم 5 من [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). يتم تعيين خيار `all` الذي تم تمريره إلى البحث على `true` وتحاول المقابس الاتصال بجميع عناوين IPv6 و IPv4 التي تم الحصول عليها، بالتسلسل، حتى يتم إنشاء اتصال. تتم تجربة عنوان AAAA الأول الذي تم إرجاعه أولاً، ثم عنوان A الأول الذي تم إرجاعه، ثم عنوان AAAA الثاني الذي تم إرجاعه وهكذا. يتم إعطاء كل محاولة اتصال (ولكن المحاولة الأخيرة) مقدار الوقت المحدد بواسطة خيار `autoSelectFamilyAttemptTimeout` قبل انتهاء المهلة وتجربة العنوان التالي. يتم تجاهله إذا لم يكن خيار `family` هو `0` أو إذا تم تعيين `localAddress`. لا يتم إطلاق أخطاء الاتصال إذا نجح اتصال واحد على الأقل. إذا فشلت جميع محاولات الاتصال، فسيتم إطلاق `AggregateError` واحد مع جميع المحاولات الفاشلة. **افتراضي:** [`net.getDefaultAutoSelectFamily()`](/ar/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): مقدار الوقت بالمللي ثانية للانتظار حتى تنتهي محاولة الاتصال قبل تجربة العنوان التالي عند استخدام خيار `autoSelectFamily`. إذا تم تعيينه على عدد صحيح موجب أقل من `10`، فسيتم استخدام القيمة `10` بدلاً من ذلك. **افتراضي:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ar/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): إصدار حزمة بروتوكولات الإنترنت. يجب أن يكون `4` أو `6` أو `0`. تشير القيمة `0` إلى أنه يُسمح بكل من عناوين IPv4 و IPv6. **افتراضي:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) اختياري [`dns.lookup()` تلميحات](/ar/nodejs/api/dns#supported-getaddrinfo-flags).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المضيف الذي يجب أن يتصل به المقبس. **افتراضي:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يمكّن وظيفة keep-alive على المقبس مباشرة بعد إنشاء الاتصال، وبالمثل ما يتم القيام به في [`socket.setKeepAlive()`](/ar/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **افتراضي:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تم تعيينه على رقم موجب، فإنه يحدد التأخير الأولي قبل إرسال أول مسبار keepalive على مقبس خامل. **افتراضي:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) العنوان المحلي الذي يجب أن يتصل منه المقبس.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ المحلي الذي يجب أن يتصل منه المقبس.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة بحث مخصصة. **افتراضي:** [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يعطل استخدام خوارزمية Nagle مباشرة بعد إنشاء المقبس. **افتراضي:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مطلوب. المنفذ الذي يجب أن يتصل به المقبس.
- `blockList` [\<net.BlockList\>](/ar/nodejs/api/net#class-netblocklist) يمكن استخدام `blockList` لتعطيل الوصول الصادر إلى عناوين IP معينة أو نطاقات IP أو شبكات IP الفرعية.

بالنسبة لاتصالات [IPC](/ar/nodejs/api/net#ipc-support)، الخيارات المتاحة هي:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مطلوب. المسار الذي يجب أن يتصل به العميل. انظر [تحديد المسارات لاتصالات IPC](/ar/nodejs/api/net#identifying-paths-for-ipc-connections). إذا تم توفيره، فسيتم تجاهل خيارات TCP المحددة أعلاه.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المسار الذي يجب أن يتصل به العميل. انظر [تحديد المسارات لاتصالات IPC](/ar/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معلمة شائعة لطرق [`socket.connect()`](/ar/nodejs/api/net#socketconnect). ستتم إضافتها كمستمع لحدث [`'connect'`](/ar/nodejs/api/net#event-connect) مرة واحدة.
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

بدء اتصال [IPC](/ar/nodejs/api/net#ipc-support) على المقبس المحدد.

اسم مستعار لـ [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) تم استدعاؤه مع `{ path: path }` كـ `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**تمت الإضافة في: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الذي يجب أن يتصل به العميل.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المضيف الذي يجب أن يتصل به العميل.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معلمة شائعة لطرق [`socket.connect()`](/ar/nodejs/api/net#socketconnect). ستتم إضافتها كمستمع لحدث [`'connect'`](/ar/nodejs/api/net#event-connect) مرة واحدة.
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

بدء اتصال TCP على المقبس المحدد.

اسم مستعار لـ [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) تم استدعاؤه مع `{port: port, host: host}` كـ `options`.

### `socket.connecting` {#socketconnecting}

**تمت الإضافة في: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة `true`، فقد تم استدعاء [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) ولم ينته بعد. ستبقى القيمة `true` حتى يصبح المقبس متصلاً، ثم يتم تعيينها إلى `false` ويتم إطلاق حدث `'connect'`. لاحظ أن استدعاء [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) هو مستمع لحدث `'connect'`.


### `socket.destroy([error])` {#socketdestroyerror}

**تمت الإضافة في: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يضمن عدم حدوث المزيد من نشاط الإدخال/الإخراج على هذا المقبس. يدمر الدفق ويغلق الاتصال.

انظر [`writable.destroy()`](/ar/nodejs/api/stream#writabledestroyerror) لمزيد من التفاصيل.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان الاتصال مدمرًا أم لا. بمجرد تدمير الاتصال، لا يمكن نقل أي بيانات أخرى باستخدامه.

انظر [`writable.destroyed`](/ar/nodejs/api/stream#writabledestroyed) لمزيد من التفاصيل.

### `socket.destroySoon()` {#socketdestroysoon}

**تمت الإضافة في: v0.3.4**

يدمر المقبس بعد كتابة جميع البيانات. إذا تم بالفعل إصدار الحدث `'finish'`، فسيتم تدمير المقبس على الفور. إذا كان المقبس لا يزال قابلاً للكتابة، فإنه يستدعي ضمنيًا `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**تمت الإضافة في: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يُستخدم فقط عندما تكون البيانات `string`. **الافتراضي:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد اتصال اختياري عند انتهاء المقبس.
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

يغلق المقبس جزئيًا. أي أنه يرسل حزمة FIN. من الممكن أن يستمر الخادم في إرسال بعض البيانات.

انظر [`writable.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback) لمزيد من التفاصيل.

### `socket.localAddress` {#socketlocaladdress}

**تمت الإضافة في: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

التمثيل السلسلي لعنوان IP المحلي الذي يتصل عليه العميل البعيد. على سبيل المثال، في خادم يستمع على `'0.0.0.0'`، إذا اتصل عميل على `'192.168.1.1'`، فستكون قيمة `socket.localAddress` هي `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**أضيف في: الإصدار 0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

التمثيل الرقمي للمنفذ المحلي. على سبيل المثال، `80` أو `21`.

### `socket.localFamily` {#socketlocalfamily}

**أضيف في: الإصدار 18.8.0، 16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

التمثيل النصي لعائلة IP المحلية. `'IPv4'` أو `'IPv6'`.

### `socket.pause()` {#socketpause}

- يعيد: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

يقوم بإيقاف قراءة البيانات مؤقتًا. أي أن أحداث [`'data'`](/ar/nodejs/api/net#event-data) لن تُصدر. مفيد لتقليل سرعة التحميل.

### `socket.pending` {#socketpending}

**أضيف في: الإصدار 11.2.0، 10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

هذا `true` إذا لم يكن المقبس متصلاً بعد، إما لأن `.connect()` لم يتم استدعاؤه بعد أو لأنه لا يزال في طور الاتصال (انظر [`socket.connecting`](/ar/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**أضيف في: الإصدار 0.9.1**

- يعيد: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

عكس `unref()`، استدعاء `ref()` على مقبس `unref`ed مسبقًا *لن* يسمح للبرنامج بالخروج إذا كان هو المقبس الوحيد المتبقي (السلوك الافتراضي). إذا كان المقبس `ref`ed، فإن استدعاء `ref` مرة أخرى لن يكون له أي تأثير.

### `socket.remoteAddress` {#socketremoteaddress}

**أضيف في: الإصدار 0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

التمثيل النصي لعنوان IP البعيد. على سبيل المثال، `'74.125.127.100'` أو `'2001:4860:a005::68'`. قد تكون القيمة `undefined` إذا تم تدمير المقبس (على سبيل المثال، إذا قام العميل بقطع الاتصال).

### `socket.remoteFamily` {#socketremotefamily}

**أضيف في: الإصدار 0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

التمثيل النصي لعائلة IP البعيدة. `'IPv4'` أو `'IPv6'`. قد تكون القيمة `undefined` إذا تم تدمير المقبس (على سبيل المثال، إذا قام العميل بقطع الاتصال).


### `socket.remotePort` {#socketremoteport}

**تمت الإضافة في: الإصدار v0.5.10**

- [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

التمثيل الرقمي للمنفذ البعيد. على سبيل المثال، `80` أو `21`. قد تكون القيمة `undefined` إذا تم تدمير المقبس (على سبيل المثال، إذا تم فصل العميل).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**تمت الإضافة في: الإصدار v18.3.0, v16.17.0**

- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

إغلاق اتصال TCP عن طريق إرسال حزمة RST وتدمير التدفق. إذا كان مقبس TCP هذا في حالة اتصال، فسوف يرسل حزمة RST ويدمر مقبس TCP هذا بمجرد توصيله. خلاف ذلك، سيتم استدعاء `socket.destroy` مع خطأ `ERR_SOCKET_CLOSED`. إذا لم يكن هذا مقبس TCP (على سبيل المثال، أنبوب)، فإن استدعاء هذه الطريقة سيؤدي على الفور إلى طرح خطأ `ERR_INVALID_HANDLE_TYPE`.

### `socket.resume()` {#socketresume}

- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

يستأنف القراءة بعد استدعاء [`socket.pause()`](/ar/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**تمت الإضافة في: الإصدار v0.1.90**

- `encoding` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

تعيين ترميز للمقبس كـ [تدفق قابل للقراءة](/ar/nodejs/api/stream#class-streamreadable). راجع [`readable.setEncoding()`](/ar/nodejs/api/stream#readablesetencodingencoding) لمزيد من المعلومات.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.12.0, v12.17.0 | تمت إضافة إعدادات افتراضية جديدة لخيارات المقبس `TCP_KEEPCNT` و `TCP_KEEPINTVL`. |
| v0.1.92 | تمت الإضافة في: الإصدار v0.1.92 |
:::

- `enable` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`
- `initialDelay` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **افتراضي:** `0`
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

تمكين/تعطيل وظيفة الإبقاء على قيد الحياة، واختياريًا تعيين التأخير الأولي قبل إرسال أول مسبار إبقاء على قيد الحياة على مقبس غير نشط.

قم بتعيين `initialDelay` (بالمللي ثانية) لتعيين التأخير بين آخر حزمة بيانات تم استقبالها وأول مسبار إبقاء على قيد الحياة. سيؤدي تعيين `0` لـ `initialDelay` إلى ترك القيمة دون تغيير من الإعداد الافتراضي (أو السابق).

سيؤدي تمكين وظيفة الإبقاء على قيد الحياة إلى تعيين خيارات المقبس التالية:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**تمت إضافتها في: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **الافتراضي:** `true`
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

تمكين/تعطيل استخدام خوارزمية ناجل.

عند إنشاء اتصال TCP، سيتم تمكين خوارزمية ناجل.

تؤخر خوارزمية ناجل البيانات قبل إرسالها عبر الشبكة. إنها تحاول تحسين الإنتاجية على حساب الكمون.

سيؤدي تمرير `true` لـ `noDelay` أو عدم تمرير وسيطة إلى تعطيل خوارزمية ناجل للمقبس. سيؤدي تمرير `false` لـ `noDelay` إلى تمكين خوارزمية ناجل.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد اتصال غير صالح إلى وسيطة `callback` الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.1.90 | تمت إضافتها في: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

يضبط المقبس بحيث ينتهي مهلة بعد `timeout` مللي ثانية من عدم النشاط على المقبس. بشكل افتراضي، لا تحتوي `net.Socket` على مهلة.

عندما يتم تشغيل مهلة الخمول، سيتلقى المقبس حدث [`'timeout'`](/ar/nodejs/api/net#event-timeout) ولكن لن يتم قطع الاتصال. يجب على المستخدم استدعاء [`socket.end()`](/ar/nodejs/api/net#socketenddata-encoding-callback) أو [`socket.destroy()`](/ar/nodejs/api/net#socketdestroyerror) يدويًا لإنهاء الاتصال.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
إذا كانت `timeout` هي 0، فسيتم تعطيل مهلة الخمول الحالية.

ستتم إضافة معلمة `callback` الاختيارية كمستمع لمرة واحدة لحدث [`'timeout'`](/ar/nodejs/api/net#event-timeout).


### `socket.timeout` {#sockettimeout}

**تمت الإضافة في: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

مهلة المقبس بالمللي ثانية كما تم تعيينها بواسطة [`socket.setTimeout()`](/ar/nodejs/api/net#socketsettimeouttimeout-callback). تكون `undefined` إذا لم يتم تعيين مهلة.

### `socket.unref()` {#socketunref}

**تمت الإضافة في: v0.9.1**

- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس نفسه.

سيسمح استدعاء `unref()` على المقبس للبرنامج بالخروج إذا كان هذا هو المقبس النشط الوحيد في نظام الأحداث. إذا كان المقبس بالفعل `unref`ed، فلن يكون لاستدعاء `unref()` مرة أخرى أي تأثير.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**تمت الإضافة في: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تستخدم فقط عندما تكون البيانات `string`. **الافتراضي:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يرسل بيانات على المقبس. تحدد المعلمة الثانية الترميز في حالة السلسلة. الإعداد الافتراضي هو ترميز UTF8.

إرجاع `true` إذا تم مسح البيانات بأكملها بنجاح إلى مخزن kernel المؤقت. إرجاع `false` إذا تم وضع كل أو جزء من البيانات في قائمة الانتظار في ذاكرة المستخدم. سيتم إصدار [`'drain'`](/ar/nodejs/api/net#event-drain) عندما يكون المخزن المؤقت مجانيًا مرة أخرى.

سيتم تنفيذ المعلمة `callback` الاختيارية عند كتابة البيانات أخيرًا، وهو ما قد لا يكون فوريًا.

راجع دفق `Writable` طريقة [`write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) لمزيد من المعلومات.


### `socket.readyState` {#socketreadystate}

**أُضيف في: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تمثل هذه الخاصية حالة الاتصال كسلسلة نصية.

- إذا كان التيار قيد الاتصال، فإن `socket.readyState` تكون `opening`.
- إذا كان التيار قابلاً للقراءة والكتابة، فإنه يكون `open`.
- إذا كان التيار قابلاً للقراءة وغير قابل للكتابة، فإنه يكون `readOnly`.
- إذا كان التيار غير قابل للقراءة وقابل للكتابة، فإنه يكون `writeOnly`.

## `net.connect()` {#netconnect}

أسماء مستعارة لـ [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection).

التوقيعات المحتملة:

- [`net.connect(options[, connectListener])`](/ar/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/ar/nodejs/api/net#netconnectpath-connectlistener) لاتصالات [IPC](/ar/nodejs/api/net#ipc-support).
- [`net.connect(port[, host][, connectListener])`](/ar/nodejs/api/net#netconnectport-host-connectlistener) لاتصالات TCP.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**أُضيف في: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

اسم مستعار لـ [`net.createConnection(options[, connectListener])`](/ar/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**أُضيف في: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

اسم مستعار لـ [`net.createConnection(path[, connectListener])`](/ar/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**أُضيف في: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

اسم مستعار لـ [`net.createConnection(port[, host][, connectListener])`](/ar/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

دالة مصنع، تقوم بإنشاء [`net.Socket`](/ar/nodejs/api/net#class-netsocket) جديد، وتبدأ فورًا الاتصال بـ [`socket.connect()`](/ar/nodejs/api/net#socketconnect)، ثم تعيد `net.Socket` الذي يبدأ الاتصال.

عندما يتم إنشاء الاتصال، سيتم إطلاق حدث [`'connect'`](/ar/nodejs/api/net#event-connect) على المقبس المُعاد. المعامل الأخير `connectListener`، إذا تم توفيره، سيتم إضافته كمستمع لحدث [`'connect'`](/ar/nodejs/api/net#event-connect) **مرة واحدة**.

التواقيع المحتملة:

- [`net.createConnection(options[, connectListener])`](/ar/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/ar/nodejs/api/net#netcreateconnectionpath-connectlistener) لاتصالات [IPC](/ar/nodejs/api/net#ipc-support).
- [`net.createConnection(port[, host][, connectListener])`](/ar/nodejs/api/net#netcreateconnectionport-host-connectlistener) لاتصالات TCP.

الدالة [`net.connect()`](/ar/nodejs/api/net#netconnect) هي اسم مستعار لهذه الدالة.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**أضيف في: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مطلوب. سيتم تمريره إلى كل من استدعاء [`new net.Socket([options])`](/ar/nodejs/api/net#new-netsocketoptions) وطريقة [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معامل شائع لدوال [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection). إذا تم توفيره، سيتم إضافته كمستمع لحدث [`'connect'`](/ar/nodejs/api/net#event-connect) على المقبس المُعاد مرة واحدة.
- يعيد: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس الذي تم إنشاؤه حديثًا والمستخدم لبدء الاتصال.

للاطلاع على الخيارات المتاحة، راجع [`new net.Socket([options])`](/ar/nodejs/api/net#new-netsocketoptions) و [`socket.connect(options[, connectListener])`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).

خيارات إضافية:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تم تعيينه، فسيتم استخدامه لاستدعاء [`socket.setTimeout(timeout)`](/ar/nodejs/api/net#socketsettimeouttimeout-callback) بعد إنشاء المقبس، ولكن قبل أن يبدأ الاتصال.

فيما يلي مثال لعميل لخادم الصدى الموصوف في قسم [`net.createServer()`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener):

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
:::

للاتصال بالمقبس `/tmp/echo.sock`:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
فيما يلي مثال لعميل يستخدم خياري `port` و `onread`. في هذه الحالة، سيتم استخدام خيار `onread` فقط لاستدعاء `new net.Socket([options])` وسيتم استخدام خيار `port` لاستدعاء `socket.connect(options[, connectListener])`.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```js [CJS]
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::

### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**تمت الإضافة في: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المسار الذي يجب أن يتصل به المقبس. سيتم تمريره إلى [`socket.connect(path[, connectListener])`](/ar/nodejs/api/net#socketconnectpath-connectlistener). انظر [تحديد المسارات لاتصالات IPC](/ar/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معلمة شائعة لوظائف [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection)، مستمع "مرة واحدة" لحدث `'connect'` على المقبس الذي يبدأ الاتصال. سيتم تمريره إلى [`socket.connect(path[, connectListener])`](/ar/nodejs/api/net#socketconnectpath-connectlistener).
- Returns: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس الذي تم إنشاؤه حديثًا والذي يُستخدم لبدء الاتصال.

يبدأ اتصال [IPC](/ar/nodejs/api/net#ipc-support).

تنشئ هذه الدالة [`net.Socket`](/ar/nodejs/api/net#class-netsocket) جديدًا مع تعيين جميع الخيارات إلى الوضع الافتراضي، وتبدأ على الفور الاتصال بـ [`socket.connect(path[, connectListener])`](/ar/nodejs/api/net#socketconnectpath-connectlistener)، ثم تُرجع `net.Socket` الذي يبدأ الاتصال.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**تمت الإضافة في: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الذي يجب أن يتصل به المقبس. سيتم تمريره إلى [`socket.connect(port[, host][, connectListener])`](/ar/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المضيف الذي يجب أن يتصل به المقبس. سيتم تمريره إلى [`socket.connect(port[, host][, connectListener])`](/ar/nodejs/api/net#socketconnectport-host-connectlistener). **افتراضي:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معلمة شائعة لوظائف [`net.createConnection()`](/ar/nodejs/api/net#netcreateconnection)، مستمع "مرة واحدة" لحدث `'connect'` على المقبس الذي يبدأ الاتصال. سيتم تمريره إلى [`socket.connect(port[, host][, connectListener])`](/ar/nodejs/api/net#socketconnectport-host-connectlistener).
- Returns: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) المقبس الذي تم إنشاؤه حديثًا والذي يُستخدم لبدء الاتصال.

يبدأ اتصال TCP.

تنشئ هذه الدالة [`net.Socket`](/ar/nodejs/api/net#class-netsocket) جديدًا مع تعيين جميع الخيارات إلى الوضع الافتراضي، وتبدأ على الفور الاتصال بـ [`socket.connect(port[, host][, connectListener])`](/ar/nodejs/api/net#socketconnectport-host-connectlistener)، ثم تُرجع `net.Socket` الذي يبدأ الاتصال.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v20.1.0, v18.17.0 | خيار `highWaterMark` مدعوم الآن. |
| v17.7.0, v16.15.0 | خيارات `noDelay` و `keepAlive` و `keepAliveInitialDelay` مدعومة الآن. |
| v0.5.0 | تمت إضافته في: v0.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `false`، فستنهي المقبس تلقائيًا الجانب القابل للكتابة عند انتهاء الجانب القابل للقراءة. **افتراضي:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتجاوز اختياريًا جميع `readableHighWaterMark` و `writableHighWaterMark` الخاصة بـ [`net.Socket`](/ar/nodejs/api/net#class-netsocket). **افتراضي:** راجع [`stream.getDefaultHighWaterMark()`](/ar/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يمكّن وظيفة keep-alive على المقبس فور استلام اتصال وارد جديد، بشكل مشابه لما يتم القيام به في [`socket.setKeepAlive()`](/ar/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **افتراضي:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إذا تم تعيينه على رقم موجب، فإنه يحدد التأخير الأولي قبل إرسال أول مسبار keepalive على مقبس خامد. **افتراضي:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `true`، فإنه يعطل استخدام خوارزمية Nagle فور استلام اتصال وارد جديد. **افتراضي:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان يجب إيقاف المقبس مؤقتًا على الاتصالات الواردة. **افتراضي:** `false`.
    - `blockList` [\<net.BlockList\>](/ar/nodejs/api/net#class-netblocklist) يمكن استخدام `blockList` لتعطيل الوصول الوارد إلى عناوين IP محددة أو نطاقات IP أو شبكات IP الفرعية. هذا لا يعمل إذا كان الخادم خلف وكيل عكسي أو NAT أو ما إلى ذلك، لأن العنوان الذي يتم فحصه مقابل القائمة المحظورة هو عنوان الوكيل أو العنوان المحدد بواسطة NAT.

- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم تعيينه تلقائيًا كمستمع لحدث [`'connection'`](/ar/nodejs/api/net#event-connection).
- الإرجاع: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

ينشئ خادم TCP أو [IPC](/ar/nodejs/api/net#ipc-support) جديد.

إذا تم تعيين `allowHalfOpen` على `true`، فعندما يشير الطرف الآخر من المقبس إلى نهاية الإرسال، سيرسل الخادم فقط نهاية الإرسال مرة أخرى عندما يتم استدعاء [`socket.end()`](/ar/nodejs/api/net#socketenddata-encoding-callback) بشكل صريح. على سبيل المثال، في سياق TCP، عند استلام حزمة FIN، يتم إرسال حزمة FIN مرة أخرى فقط عندما يتم استدعاء [`socket.end()`](/ar/nodejs/api/net#socketenddata-encoding-callback) بشكل صريح. حتى ذلك الحين يكون الاتصال مغلقًا جزئيًا (غير قابل للقراءة ولكنه لا يزال قابلاً للكتابة). راجع حدث [`'end'`](/ar/nodejs/api/net#event-end) و [RFC 1122](https://tools.ietf.org/html/rfc1122) (القسم 4.2.2.13) لمزيد من المعلومات.

إذا تم تعيين `pauseOnConnect` على `true`، فسيتم إيقاف المقبس المرتبط بكل اتصال وارد مؤقتًا، ولن تتم قراءة أي بيانات من معالجه. يسمح هذا بتمرير الاتصالات بين العمليات دون قراءة أي بيانات بواسطة العملية الأصلية. لبدء قراءة البيانات من مقبس متوقف مؤقتًا، استدع [`socket.resume()`](/ar/nodejs/api/net#socketresume).

يمكن أن يكون الخادم خادم TCP أو خادم [IPC](/ar/nodejs/api/net#ipc-support)، اعتمادًا على ما [`listen()`](/ar/nodejs/api/net#serverlisten) إليه.

إليك مثال لخادم TCP echo الذي يستمع إلى الاتصالات على المنفذ 8124:

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
:::

اختبر هذا باستخدام `telnet`:

```bash [BASH]
telnet localhost 8124
```
للاستماع على المقبس `/tmp/echo.sock`:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
استخدم `nc` للاتصال بخادم مقبس نطاق Unix:

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**تمت الإضافة في: الإصدار v19.4.0**

يحصل على القيمة الافتراضية الحالية للخيار `autoSelectFamily` في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener). القيمة الافتراضية الأولية هي `true`، إلا إذا تم توفير خيار سطر الأوامر `--no-network-family-autoselection`.

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) القيمة الافتراضية الحالية للخيار `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**تمت الإضافة في: الإصدار v19.4.0**

يضبط القيمة الافتراضية للخيار `autoSelectFamily` في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) القيمة الافتراضية الجديدة. القيمة الافتراضية الأولية هي `true`، إلا إذا تم توفير خيار سطر الأوامر `--no-network-family-autoselection`.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**تمت الإضافة في: الإصدار v19.8.0, v18.18.0**

يحصل على القيمة الافتراضية الحالية للخيار `autoSelectFamilyAttemptTimeout` في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener). القيمة الافتراضية الأولية هي `250` أو القيمة المحددة عبر خيار سطر الأوامر `--network-family-autoselection-attempt-timeout`.

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) القيمة الافتراضية الحالية للخيار `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**تمت الإضافة في: الإصدار v19.8.0, v18.18.0**

يضبط القيمة الافتراضية للخيار `autoSelectFamilyAttemptTimeout` في [`socket.connect(options)`](/ar/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) القيمة الافتراضية الجديدة، والتي يجب أن تكون رقمًا موجبًا. إذا كان الرقم أقل من `10`، فسيتم استخدام القيمة `10` بدلاً من ذلك. القيمة الافتراضية الأولية هي `250` أو القيمة المحددة عبر خيار سطر الأوامر `--network-family-autoselection-attempt-timeout`.


## `net.isIP(input)` {#netisipinput}

**تمت الإضافة في: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- إرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع `6` إذا كان `input` عنوان IPv6. يُرجع `4` إذا كان `input` عنوان IPv4 في [تدوين عشري نقطي](https://en.wikipedia.org/wiki/Dot-decimal_notation) بدون أصفار بادئة. بخلاف ذلك، يُرجع `0`.

```js [ESM]
net.isIP('::1'); // يُرجع 6
net.isIP('127.0.0.1'); // يُرجع 4
net.isIP('127.000.000.001'); // يُرجع 0
net.isIP('127.0.0.1/24'); // يُرجع 0
net.isIP('fhqwhgads'); // يُرجع 0
```
## `net.isIPv4(input)` {#netisipv4input}

**تمت الإضافة في: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان `input` عنوان IPv4 في [تدوين عشري نقطي](https://en.wikipedia.org/wiki/Dot-decimal_notation) بدون أصفار بادئة. بخلاف ذلك، يُرجع `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // يُرجع true
net.isIPv4('127.000.000.001'); // يُرجع false
net.isIPv4('127.0.0.1/24'); // يُرجع false
net.isIPv4('fhqwhgads'); // يُرجع false
```
## `net.isIPv6(input)` {#netisipv6input}

**تمت الإضافة في: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع `true` إذا كان `input` عنوان IPv6. بخلاف ذلك، يُرجع `false`.

```js [ESM]
net.isIPv6('::1'); // يُرجع true
net.isIPv6('fhqwhgads'); // يُرجع false
```
