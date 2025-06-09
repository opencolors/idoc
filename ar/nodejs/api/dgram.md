---
title: توثيق Node.js - dgram
description: توفر وحدة dgram تنفيذًا لمقابس UDP Datagram، مما يسمح بإنشاء تطبيقات عميل وخادم يمكنها إرسال واستقبال حزم البيانات.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة dgram تنفيذًا لمقابس UDP Datagram، مما يسمح بإنشاء تطبيقات عميل وخادم يمكنها إرسال واستقبال حزم البيانات.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة dgram تنفيذًا لمقابس UDP Datagram، مما يسمح بإنشاء تطبيقات عميل وخادم يمكنها إرسال واستقبال حزم البيانات.
---


# مقابس UDP/الرزم البيانية {#udp/datagram-sockets}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

يوفر وحدة `node:dgram` تطبيقًا لمقابس الرزم البيانية UDP.

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::

## الصنف: `dgram.Socket` {#class-dgramsocket}

**أُضيف في: v0.1.99**

- يمتد: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يغلف وظائف الرزم البيانية.

يتم إنشاء نسخ جديدة من `dgram.Socket` باستخدام [`dgram.createSocket()`](/ar/nodejs/api/dgram#dgramcreatesocketoptions-callback). لا يجوز استخدام الكلمة المفتاحية `new` لإنشاء نسخ `dgram.Socket`.

### الحدث: `'close'` {#event-close}

**أُضيف في: v0.1.99**

يتم إطلاق الحدث `'close'` بعد إغلاق مقبس باستخدام [`close()`](/ar/nodejs/api/dgram#socketclosecallback). بمجرد التشغيل، لن يتم إطلاق أي أحداث `'message'` جديدة على هذا المقبس.

### الحدث: `'connect'` {#event-connect}

**أُضيف في: v12.0.0**

يتم إطلاق الحدث `'connect'` بعد ربط مقبس بعنوان بعيد كنتيجة لنجاح استدعاء [`connect()`](/ar/nodejs/api/dgram#socketconnectport-address-callback).


### الحدث: `'error'` {#event-error}

**تمت إضافته في: الإصدار v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إطلاق الحدث `'error'` كلما حدث أي خطأ. يتم تمرير كائن `Error` واحد إلى دالة معالج الحدث.

### الحدث: `'listening'` {#event-listening}

**تمت إضافته في: الإصدار v0.1.99**

يتم إطلاق الحدث `'listening'` بمجرد أن يكون `dgram.Socket` قابلاً للعنونة ويمكنه استقبال البيانات. يحدث هذا إما بشكل صريح مع `socket.bind()` أو ضمنيًا في المرة الأولى التي يتم فيها إرسال البيانات باستخدام `socket.send()`. حتى يستمع `dgram.Socket`، لا توجد موارد النظام الأساسية وتفشل استدعاءات مثل `socket.address()` و `socket.setTTL()`.

### الحدث: `'message'` {#event-message}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.4.0 | تعرض الخاصية `family` الآن سلسلة بدلاً من رقم. |
| v18.0.0 | تعرض الخاصية `family` الآن رقمًا بدلاً من سلسلة. |
| v0.1.99 | تمت إضافته في: الإصدار v0.1.99 |
:::

يتم إطلاق الحدث `'message'` عندما يكون مخطط بيانات جديد متاحًا على مأخذ توصيل. يتم تمرير وسيطتين إلى دالة معالج الحدث: `msg` و `rinfo`.

- `msg` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) الرسالة.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) معلومات العنوان البعيد.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان المرسل.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عائلة العناوين (`'IPv4'` أو `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) منفذ المرسل.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم الرسالة.
  
 

إذا كان عنوان المصدر للحزمة الواردة هو عنوان IPv6 link-local، تتم إضافة اسم الواجهة إلى `address`. على سبيل المثال، قد يتم تعيين حقل العنوان للحزمة المستلمة على واجهة `en0` إلى `'fe80::2618:1234:ab11:3b9c%en0'`، حيث `'%en0'` هو اسم الواجهة كلاحقة معرف المنطقة.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**تمت الإضافة في: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يطلب من النواة الانضمام إلى مجموعة الإرسال المتعدد في `multicastAddress` المحدد و `multicastInterface` باستخدام خيار مقبس `IP_ADD_MEMBERSHIP`. إذا لم يتم تحديد وسيطة `multicastInterface`، فسيختار نظام التشغيل واجهة واحدة ويضيف العضوية إليها. لإضافة عضوية إلى كل واجهة متاحة، قم باستدعاء `addMembership` عدة مرات، مرة واحدة لكل واجهة.

عند استدعاء هذه الطريقة على مقبس غير ملزم، فإنها سترتبط ضمنيًا بمنفذ عشوائي، وتستمع على جميع الواجهات.

عند مشاركة مقبس UDP عبر العديد من العاملين في `cluster`، يجب استدعاء الدالة `socket.addMembership()` مرة واحدة فقط أو سيحدث خطأ `EADDRINUSE`:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Works ok.
  cluster.fork(); // Fails with EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```js [CJS]
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // Works ok.
  cluster.fork(); // Fails with EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**تمت الإضافة في: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يطلب من النواة الانضمام إلى قناة إرسال متعدد خاصة بالمصدر في `sourceAddress` المحدد و `groupAddress`، باستخدام `multicastInterface` مع خيار مقبس `IP_ADD_SOURCE_MEMBERSHIP`. إذا لم يتم تحديد وسيطة `multicastInterface`، فسيختار نظام التشغيل واجهة واحدة ويضيف العضوية إليها. لإضافة عضوية إلى كل واجهة متاحة، قم باستدعاء `socket.addSourceSpecificMembership()` عدة مرات، مرة واحدة لكل واجهة.

عند استدعاء هذه الطريقة على مقبس غير ملزم، فإنها سترتبط ضمنيًا بمنفذ عشوائي، وتستمع على جميع الواجهات.


### `socket.address()` {#socketaddress}

**أضيف في:** v0.1.99

- يُرجع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يُرجع كائنًا يحتوي على معلومات عنوان المقبس. بالنسبة لمقابس UDP، سيحتوي هذا الكائن على خصائص `address` و `family` و `port`.

تُطلق هذه الطريقة `EBADF` إذا تم استدعاؤها على مقبس غير ملزم.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v0.9.1 | تم تغيير الطريقة إلى نموذج تنفيذ غير متزامن. ستحتاج التعليمات البرمجية القديمة إلى تغيير لتمرير وظيفة رد الاتصال إلى استدعاء الطريقة. |
| v0.1.99 | أضيف في: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) بدون معلمات. يتم استدعاؤها عند اكتمال الربط.

بالنسبة لمقابس UDP، يتسبب هذا في استماع `dgram.Socket` لرسائل datagram على `port` مسماة و `address` اختياري. إذا لم يتم تحديد `port` أو كان `0`، فسيحاول نظام التشغيل الربط بمنفذ عشوائي. إذا لم يتم تحديد `address`، فسيحاول نظام التشغيل الاستماع على جميع العناوين. بمجرد اكتمال الربط، يتم إطلاق حدث `'listening'` واستدعاء وظيفة `callback` الاختيارية.

تحديد كل من مستمع حدث `'listening'` وتمرير `callback` إلى طريقة `socket.bind()` ليس ضارًا ولكنه غير مفيد للغاية.

يحافظ مقبس datagram المربوط على تشغيل عملية Node.js لتلقي رسائل datagram.

إذا فشل الربط، فسيتم إنشاء حدث `'error'`. في حالات نادرة (على سبيل المثال، محاولة الربط بمقبس مغلق)، قد يتم إطلاق [`Error`](/ar/nodejs/api/errors#class-error).

مثال لخادم UDP يستمع على المنفذ 41234:



::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::


### `socket.bind(options[, callback])` {#socketbindoptions-callback}

**أُضيف في: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مطلوبة. تدعم الخصائص التالية:
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

بالنسبة لمآخذ توصيل UDP، يتسبب في استماع `dgram.Socket` لرسائل مخططات البيانات على `port` مسماة و `address` اختيارية يتم تمريرها كخصائص لكائن `options` يتم تمريره كوسيطة أولى. إذا لم يتم تحديد `port` أو كانت `0`، فسيحاول نظام التشغيل الربط بمنفذ عشوائي. إذا لم يتم تحديد `address`، فسيحاول نظام التشغيل الاستماع على جميع العناوين. بمجرد اكتمال الربط، يتم إطلاق حدث `'listening'` واستدعاء دالة `callback` الاختيارية.

قد يحتوي كائن `options` على خاصية `fd`. عندما يتم تعيين `fd` أكبر من `0`، فإنه سيلتف حول مأخذ توصيل موجود بواصف الملف المحدد. في هذه الحالة، سيتم تجاهل خصائص `port` و `address`.

تحديد كل من مستمع حدث `'listening'` وتمرير `callback` إلى طريقة `socket.bind()` ليس ضارًا ولكنه ليس مفيدًا للغاية.

قد يحتوي كائن `options` على خاصية `exclusive` إضافية تستخدم عند استخدام كائنات `dgram.Socket` مع وحدة [`cluster`](/ar/nodejs/api/cluster). عندما يتم تعيين `exclusive` على `false` (الإعداد الافتراضي)، سيستخدم العاملون في الكتلة نفس معالج مأخذ التوصيل الأساسي مما يسمح بمشاركة واجبات معالجة الاتصال. ومع ذلك، عندما تكون `exclusive` هي `true`، لا تتم مشاركة المعالج وتؤدي محاولات مشاركة المنفذ إلى حدوث خطأ. يتسبب إنشاء `dgram.Socket` مع تعيين خيار `reusePort` على `true` في أن تكون `exclusive` دائمًا `true` عند استدعاء `socket.bind()`.

تحافظ مأخذ توصيل مخطط البيانات المربوط على تشغيل عملية Node.js لتلقي رسائل مخططات البيانات.

إذا فشل الربط، يتم إنشاء حدث `'error'`. في حالات نادرة (على سبيل المثال، محاولة الربط بمأخذ توصيل مغلق)، قد يتم طرح [`Error`](/ar/nodejs/api/errors#class-error).

يظهر أدناه مثال على مأخذ توصيل يستمع على منفذ حصري.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**تمت الإضافة في: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عند إغلاق المقبس.

يتم إغلاق المقبس الأساسي وإيقاف الاستماع إلى البيانات عليه. إذا تم توفير رد نداء، فسيتم إضافته كمستمع لحدث [`'close'`](/ar/nodejs/api/dgram#event-close).

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**تمت الإضافة في: v20.5.0, v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`socket.close()`](/ar/nodejs/api/dgram#socketclosecallback) ويعيد وعدًا يتم تحقيقه عند إغلاق المقبس.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**تمت الإضافة في: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عند اكتمال الاتصال أو عند حدوث خطأ.

يربط `dgram.Socket` بعنوان ومنفذ بعيدين. يتم إرسال كل رسالة يتم إرسالها بواسطة هذا المعالج تلقائيًا إلى هذا الوجهة. أيضًا، لن يستقبل المقبس سوى رسائل من هذا النظير البعيد. ستؤدي محاولة استدعاء `connect()` على مقبس متصل بالفعل إلى استثناء [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/ar/nodejs/api/errors#err_socket_dgram_is_connected). إذا لم يتم توفير `address`، فسيتم استخدام `'127.0.0.1'` (لمقابس `udp4`) أو `'::1'` (لمقابس `udp6`) افتراضيًا. بمجرد اكتمال الاتصال، يتم إصدار حدث `'connect'` ويتم استدعاء دالة `callback` الاختيارية. في حالة الفشل، يتم استدعاء `callback` أو، في حالة الفشل، يتم إصدار حدث `'error'`.

### `socket.disconnect()` {#socketdisconnect}

**تمت الإضافة في: v12.0.0**

دالة متزامنة تفصل `dgram.Socket` المتصل بعنوانه البعيد. ستؤدي محاولة استدعاء `disconnect()` على مقبس غير مرتبط أو منفصل بالفعل إلى استثناء [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ar/nodejs/api/errors#err_socket_dgram_not_connected).


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**إضافة في: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يطلب من النواة مغادرة مجموعة البث المتعدد في `multicastAddress` باستخدام خيار المقبس `IP_DROP_MEMBERSHIP`. يتم استدعاء هذه الطريقة تلقائيًا بواسطة النواة عند إغلاق المقبس أو إنهاء العملية، لذلك لن يكون لدى معظم التطبيقات سبب لاستدعاء هذا الأمر.

إذا لم يتم تحديد `multicastInterface`، فسيحاول نظام التشغيل إسقاط العضوية على جميع الواجهات الصالحة.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**إضافة في: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يطلب من النواة مغادرة قناة بث متعدد خاصة بالمصدر في `sourceAddress` و `groupAddress` المحددين باستخدام خيار المقبس `IP_DROP_SOURCE_MEMBERSHIP`. يتم استدعاء هذه الطريقة تلقائيًا بواسطة النواة عند إغلاق المقبس أو إنهاء العملية، لذلك لن يكون لدى معظم التطبيقات سبب لاستدعاء هذا الأمر.

إذا لم يتم تحديد `multicastInterface`، فسيحاول نظام التشغيل إسقاط العضوية على جميع الواجهات الصالحة.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**إضافة في: v8.7.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم المخزن المؤقت لاستقبال المقبس `SO_RCVBUF` بالبايت.

تطرح هذه الطريقة [`ERR_SOCKET_BUFFER_SIZE`](/ar/nodejs/api/errors#err_socket_buffer_size) إذا تم استدعاؤها على مقبس غير مرتبط.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**إضافة في: v8.7.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم المخزن المؤقت لإرسال المقبس `SO_SNDBUF` بالبايت.

تطرح هذه الطريقة [`ERR_SOCKET_BUFFER_SIZE`](/ar/nodejs/api/errors#err_socket_buffer_size) إذا تم استدعاؤها على مقبس غير مرتبط.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**تمت الإضافة في: v18.8.0, v16.19.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات الموضوعة في قائمة الانتظار للإرسال.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**تمت الإضافة في: v18.8.0, v16.19.0**

- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد طلبات الإرسال الموجودة حاليًا في قائمة الانتظار في انتظار المعالجة.

### `socket.ref()` {#socketref}

**تمت الإضافة في: v0.9.1**

- الإرجاع: [\<dgram.Socket\>](/ar/nodejs/api/dgram#class-dgramsocket)

بشكل افتراضي، سيؤدي ربط مقبس إلى منع عملية Node.js من الخروج طالما أن المقبس مفتوح. يمكن استخدام الأسلوب `socket.unref()` لاستبعاد المقبس من تعداد المراجع الذي يحافظ على نشاط عملية Node.js. يضيف الأسلوب `socket.ref()` المقبس مرة أخرى إلى تعداد المراجع ويعيد السلوك الافتراضي.

لن يكون لاستدعاء `socket.ref()` عدة مرات أي تأثير إضافي.

يعيد الأسلوب `socket.ref()` مرجعًا إلى المقبس بحيث يمكن ربط الاستدعاءات.

### `socket.remoteAddress()` {#socketremoteaddress}

**تمت الإضافة في: v12.0.0**

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع كائن يحتوي على `address` و `family` و `port` لنقطة النهاية البعيدة. يطرح هذا الأسلوب استثناءً [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/ar/nodejs/api/errors#err_socket_dgram_not_connected) إذا لم يكن المقبس متصلاً.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v17.0.0 | يقبل المعامل `address` الآن `string` أو `null` أو `undefined` فقط. |
| v14.5.0, v12.19.0 | يمكن أن يكون المعامل `msg` الآن أي `TypedArray` أو `DataView`. |
| v12.0.0 | تمت إضافة دعم لإرسال البيانات على المقابس المتصلة. |
| v8.0.0 | يمكن أن يكون المعامل `msg` الآن `Uint8Array`. |
| v8.0.0 | المعامل `address` اختياري دائمًا الآن. |
| v6.0.0 | عند النجاح، سيتم استدعاء `callback` الآن باستخدام وسيط `error` بقيمة `null` بدلاً من `0`. |
| v5.7.0 | يمكن أن يكون المعامل `msg` الآن مصفوفة. بالإضافة إلى ذلك، فإن المعاملين `offset` و `length` اختياريان الآن. |
| v0.1.99 | تمت الإضافة في: v0.1.99 |
:::

- `msg` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) الرسالة المراد إرسالها.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الإزاحة في المخزن المؤقت حيث تبدأ الرسالة.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات في الرسالة.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) منفذ الوجهة.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مضيف الوجهة أو عنوان IP.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عند إرسال الرسالة.

يبث مخطط بيانات على المقبس. بالنسبة للمقابس غير المتصلة، يجب تحديد `port` و `address` للوجهة. من ناحية أخرى، ستستخدم المقابس المتصلة نقطة النهاية البعيدة المرتبطة بها، لذلك يجب عدم تعيين وسيطتي `port` و `address`.

تحتوي وسيطة `msg` على الرسالة المراد إرسالها. اعتمادًا على نوعها، يمكن تطبيق سلوك مختلف. إذا كانت `msg` عبارة عن `Buffer` أو أي `TypedArray` أو `DataView`، فإن `offset` و `length` يحددان الإزاحة داخل `Buffer` حيث تبدأ الرسالة وعدد البايتات في الرسالة، على التوالي. إذا كانت `msg` عبارة عن `String`، فسيتم تحويلها تلقائيًا إلى `Buffer` باستخدام ترميز `'utf8'`. بالنسبة للرسائل التي تحتوي على أحرف متعددة البايتات، سيتم حساب `offset` و `length` بالنسبة إلى [طول البايت](/ar/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) وليس موضع الحرف. إذا كانت `msg` عبارة عن مصفوفة، فيجب عدم تحديد `offset` و `length`.

وسيطة `address` عبارة عن سلسلة. إذا كانت قيمة `address` عبارة عن اسم مضيف، فسيتم استخدام DNS لحل عنوان المضيف. إذا لم يتم توفير `address` أو كانت قيمته خالية، فسيتم استخدام `'127.0.0.1'` (لمقابس `udp4`) أو `'::1'` (لمقابس `udp6`) افتراضيًا.

إذا لم يتم ربط المقبس مسبقًا باستدعاء `bind`، فسيتم تعيين رقم منفذ عشوائي للمقبس وربطه بعنوان "جميع الواجهات" (`'0.0.0.0'` لمقابس `udp4`، `'::0'` لمقابس `udp6`.)

يمكن تحديد وظيفة `callback` اختيارية كوسيلة للإبلاغ عن أخطاء DNS أو لتحديد متى يكون من الآمن إعادة استخدام كائن `buf`. تؤخر عمليات البحث في DNS وقت الإرسال لمدة دورة واحدة على الأقل من حلقة أحداث Node.js.

الطريقة الوحيدة لمعرفة التأكد من إرسال مخطط البيانات هي استخدام `callback`. إذا حدث خطأ وتم إعطاء `callback`، فسيتم تمرير الخطأ كوسيطة أولى إلى `callback`. إذا لم يتم إعطاء `callback`، فسيتم إصدار الخطأ كحدث `'error'` على كائن `socket`.

تعتبر الإزاحة والطول اختياريتين ولكن *يجب* تعيين كلتيهما إذا تم استخدام أي منهما. يتم دعمها فقط عندما تكون الوسيطة الأولى عبارة عن `Buffer` أو `TypedArray` أو `DataView`.

يطرح هذا الأسلوب [`ERR_SOCKET_BAD_PORT`](/ar/nodejs/api/errors#err_socket_bad_port) إذا تم استدعاؤه على مقبس غير مرتبط.

مثال على إرسال حزمة UDP إلى منفذ على `localhost`؛



::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

مثال على إرسال حزمة UDP تتكون من مخازن مؤقتة متعددة إلى منفذ على `127.0.0.1`؛



::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

قد يكون إرسال مخازن مؤقتة متعددة أسرع أو أبطأ اعتمادًا على التطبيق ونظام التشغيل. قم بتشغيل المعايير لتحديد الاستراتيجية المثلى على أساس كل حالة على حدة. ومع ذلك، بشكل عام، يكون إرسال مخازن مؤقتة متعددة أسرع.

مثال على إرسال حزمة UDP باستخدام مقبس متصل بمنفذ على `localhost`:



::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::


#### ملاحظة حول حجم مخطط بيانات UDP {#note-about-udp-datagram-size}

يعتمد الحد الأقصى لحجم مخطط بيانات IPv4/v6 على `MTU` (وحدة النقل القصوى) وعلى حجم حقل `Payload Length` (طول الحمولة).

- حقل `Payload Length` عرضه 16 بت، مما يعني أن الحمولة العادية لا يمكن أن تتجاوز 64 ألف ثمانية بتات بما في ذلك رأس الإنترنت والبيانات (65,507 بايت = 65,535 - 8 بايت رأس UDP - 20 بايت رأس IP)؛ هذا صحيح بشكل عام لواجهات الاسترجاع الحلقي، ولكن رسائل مخطط البيانات الطويلة هذه غير عملية لمعظم المضيفين والشبكات.
- `MTU` هو أكبر حجم يمكن لتقنية طبقة الارتباط المحددة دعمه لرسائل مخطط البيانات. بالنسبة لأي رابط، تفرض IPv4 حدًا أدنى لـ `MTU` يبلغ 68 ثمانية بتات، بينما `MTU` الموصى به لـ IPv4 هو 576 (يوصى به عادةً كـ `MTU` لتطبيقات نوع الاتصال الهاتفي)، سواء وصلت كاملة أو في أجزاء. بالنسبة لـ IPv6، الحد الأدنى `MTU` هو 1280 ثمانية بتات. ومع ذلك، فإن الحد الأدنى الإلزامي لحجم مخزن إعادة تجميع الأجزاء هو 1500 ثمانية بتات. قيمة 68 ثمانية بتات صغيرة جدًا، نظرًا لأن معظم تقنيات طبقة الارتباط الحالية، مثل Ethernet، لديها حد أدنى `MTU` يبلغ 1500.

من المستحيل معرفة مسبقًا MTU لكل رابط قد ينتقل من خلاله حزمة. لن ينجح إرسال مخطط بيانات أكبر من `MTU` الخاص بالمستقبل لأن الحزمة ستسقط بصمت دون إبلاغ المصدر بأن البيانات لم تصل إلى المستلم المقصود.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**تمت الإضافة في: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يقوم بتعيين أو مسح خيار المقبس `SO_BROADCAST`. عند التعيين على `true`، يمكن إرسال حزم UDP إلى عنوان البث الخاص بالواجهة المحلية.

تطرح هذه الطريقة `EBADF` إذا تم استدعاؤها على مقبس غير ملزم.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**تمت الإضافة في: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*تشير جميع الإشارات إلى النطاق في هذا القسم إلى
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">فهارس منطقة IPv6</a>، والتي تم تعريفها بواسطة <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>. في شكل سلسلة، يتم كتابة IP
مع فهرس نطاق على النحو التالي: <code>'IP%scope'</code> حيث يكون النطاق هو اسم واجهة
أو رقم واجهة.*

يعيّن واجهة الإرسال المتعدد الصادرة الافتراضية للمقبس إلى واجهة مختارة أو يعود إلى تحديد واجهة النظام. يجب أن يكون `multicastInterface` تمثيل سلسلة صالح لعنوان IP من عائلة المقبس.

بالنسبة لمقابس IPv4، يجب أن يكون هذا هو عنوان IP الذي تم تكوينه للواجهة المادية المطلوبة. سيتم إرسال جميع الحزم المرسلة إلى الإرسال المتعدد على المقبس على الواجهة التي تم تحديدها من خلال أحدث استخدام ناجح لهذا الاستدعاء.

بالنسبة لمقابس IPv6، يجب أن يتضمن `multicastInterface` نطاقًا للإشارة إلى الواجهة كما في الأمثلة التالية. في IPv6، يمكن لاستدعاءات `send` الفردية أيضًا استخدام نطاق صريح في العناوين، لذلك تتأثر فقط الحزم المرسلة إلى عنوان إرسال متعدد دون تحديد نطاق صريح بأحدث استخدام ناجح لهذا الاستدعاء.

تطرح هذه الطريقة `EBADF` إذا تم استدعاؤها على مقبس غير ملزم.


#### مثال: واجهة الإرسال المتعدد الصادرة IPv6 {#example-ipv6-outgoing-multicast-interface}

في معظم الأنظمة، حيث يستخدم تنسيق النطاق اسم الواجهة:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
في نظام التشغيل Windows، حيث يستخدم تنسيق النطاق رقم الواجهة:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### مثال: واجهة الإرسال المتعدد الصادرة IPv4 {#example-ipv4-outgoing-multicast-interface}

تستخدم جميع الأنظمة عنوان IP للمضيف على الواجهة المادية المطلوبة:

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### نتائج الاستدعاء {#call-results}

قد يؤدي الاستدعاء على مقبس غير جاهز للإرسال أو لم يعد مفتوحًا إلى ظهور [`Error`](/ar/nodejs/api/errors#class-error) *غير قيد التشغيل*.

إذا تعذر تحليل `multicastInterface` إلى عنوان IP، فسيتم طرح [`System Error`](/ar/nodejs/api/errors#class-systemerror) *EINVAL*.

في IPv4، إذا كان `multicastInterface` عنوانًا صالحًا ولكنه لا يتطابق مع أي واجهة، أو إذا كان العنوان لا يتطابق مع العائلة، فسيتم طرح [`System Error`](/ar/nodejs/api/errors#class-systemerror) مثل `EADDRNOTAVAIL` أو `EPROTONOSUP`.

في IPv6، ستؤدي معظم الأخطاء المتعلقة بتحديد النطاق أو حذفه إلى استمرار المقبس في استخدام (أو العودة إلى) تحديد الواجهة الافتراضي للنظام.

يمكن استخدام عنوان ANY لعائلة عناوين المقبس (IPv4 `'0.0.0.0'` أو IPv6 `'::'`) لإعادة التحكم في واجهة الإرسال الافتراضية للمقابس إلى النظام لحزم الإرسال المتعدد المستقبلية.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**تمت الإضافة في: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يقوم بتعيين أو مسح خيار المقبس `IP_MULTICAST_LOOP`. عند تعيينه على `true`، سيتم أيضًا استقبال حزم الإرسال المتعدد على الواجهة المحلية.

يطرح هذا الأسلوب `EBADF` إذا تم استدعاؤه على مقبس غير مرتبط.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**تمت الإضافة في: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقوم بتعيين خيار المقبس `IP_MULTICAST_TTL`. بينما يرمز TTL عمومًا إلى "وقت البقاء"، إلا أنه في هذا السياق يحدد عدد قفزات IP التي يُسمح للحزمة بالانتقال خلالها، وتحديدًا لحركة مرور الإرسال المتعدد. يقوم كل جهاز توجيه أو بوابة يقوم بإعادة توجيه حزمة بتقليل TTL. إذا تم تقليل TTL إلى 0 بواسطة جهاز توجيه، فلن تتم إعادة توجيهه.

قد تكون قيمة الوسيطة `ttl` بين 0 و 255. القيمة الافتراضية في معظم الأنظمة هي `1`.

يطرح هذا الأسلوب `EBADF` إذا تم استدعاؤه على مقبس غير مرتبط.


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**أُضيف في: v8.7.0**

- `size` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يضبط خيار المقبس `SO_RCVBUF`. يضبط الحد الأقصى لمخزن استقبال المقبس بالبايت.

تُطلق هذه الطريقة [`ERR_SOCKET_BUFFER_SIZE`](/ar/nodejs/api/errors#err_socket_buffer_size) إذا تم استدعاؤها على مقبس غير مرتبط.

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**أُضيف في: v8.7.0**

- `size` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يضبط خيار المقبس `SO_SNDBUF`. يضبط الحد الأقصى لمخزن إرسال المقبس بالبايت.

تُطلق هذه الطريقة [`ERR_SOCKET_BUFFER_SIZE`](/ar/nodejs/api/errors#err_socket_buffer_size) إذا تم استدعاؤها على مقبس غير مرتبط.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**أُضيف في: v0.1.101**

- `ttl` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يضبط خيار المقبس `IP_TTL`. بينما يرمز TTL عمومًا إلى "وقت البقاء"، فإنه في هذا السياق يحدد عدد قفزات IP التي يُسمح للحزمة بالمرور عبرها. يقوم كل جهاز توجيه أو بوابة تقوم بإعادة توجيه حزمة بتقليل TTL. إذا تم تخفيض TTL إلى 0 بواسطة جهاز توجيه، فلن تتم إعادة توجيهه. يتم تغيير قيم TTL عادةً لفحص الشبكة أو عند البث المتعدد.

يمكن أن تكون قيمة الوسيطة `ttl` بين 1 و 255. الافتراضي في معظم الأنظمة هو 64.

تُطلق هذه الطريقة `EBADF` إذا تم استدعاؤها على مقبس غير مرتبط.

### `socket.unref()` {#socketunref}

**أُضيف في: v0.9.1**

- Returns: [\<dgram.Socket\>](/ar/nodejs/api/dgram#class-dgramsocket)

بشكل افتراضي، سيؤدي ربط المقبس إلى منع عملية Node.js من الخروج طالما أن المقبس مفتوح. يمكن استخدام الطريقة `socket.unref()` لاستبعاد المقبس من حساب المراجع الذي يحافظ على عملية Node.js نشطة، مما يسمح للعملية بالخروج حتى إذا كان المقبس لا يزال يستمع.

لن يكون لاستدعاء `socket.unref()` عدة مرات أي تأثير إضافي.

تُرجع الطريقة `socket.unref()` مرجعًا إلى المقبس بحيث يمكن ربط الاستدعاءات.


## `node:dgram` وظائف الوحدة النمطية {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.1.0 | خيار `reusePort` مدعوم. |
| v15.8.0 | تمت إضافة دعم AbortSignal. |
| v11.4.0 | خيار `ipv6Only` مدعوم. |
| v8.7.0 | خيارات `recvBufferSize` و `sendBufferSize` مدعومة الآن. |
| v8.6.0 | خيار `lookup` مدعوم. |
| v0.11.13 | تمت إضافته في: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الخيارات المتاحة هي:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عائلة المقبس. يجب أن تكون إما `'udp4'` أو `'udp6'`. مطلوب.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true` فإن [`socket.bind()`](/ar/nodejs/api/dgram#socketbindport-address-callback) ستعيد استخدام العنوان، حتى إذا كان هناك عملية أخرى قد ربطت بالفعل مقبسًا عليه، ولكن يمكن لمقبس واحد فقط استقبال البيانات. **افتراضي:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true` فإن [`socket.bind()`](/ar/nodejs/api/dgram#socketbindport-address-callback) ستعيد استخدام المنفذ، حتى إذا كانت هناك عملية أخرى قد ربطت بالفعل مقبسًا عليه. يتم توزيع مخططات البيانات الواردة على المقابس المستمعة. الخيار متاح فقط على بعض الأنظمة الأساسية، مثل Linux 3.9+ و DragonFlyBSD 3.6+ و FreeBSD 12.0+ و Solaris 11.4 و AIX 7.2.5+. على الأنظمة الأساسية غير المدعومة، يثير هذا الخيار خطأً عند ربط المقبس. **افتراضي:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تعيين `ipv6Only` إلى `true` سيعطل دعم المكدس المزدوج، أي أن الربط بالعنوان `::` لن يجعل `0.0.0.0` مرتبطًا. **افتراضي:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يضبط قيمة مقبس `SO_RCVBUF`.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يضبط قيمة مقبس `SO_SNDBUF`.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) وظيفة بحث مخصصة. **افتراضي:** [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) AbortSignal يمكن استخدامه لإغلاق مقبس.
    - `receiveBlockList` [\<net.BlockList\>](/ar/nodejs/api/net#class-netblocklist) يمكن استخدام `receiveBlockList` للتخلص من مخططات البيانات الواردة إلى عناوين IP محددة أو نطاقات IP أو شبكات IP الفرعية. لا يعمل هذا إذا كان الخادم خلف وكيل عكسي أو NAT وما إلى ذلك لأن العنوان الذي تم فحصه مقابل القائمة المحظورة هو عنوان الوكيل أو العنوان المحدد بواسطة NAT.
    - `sendBlockList` [\<net.BlockList\>](/ar/nodejs/api/net#class-netblocklist) يمكن استخدام `sendBlockList` لتعطيل الوصول الصادر إلى عناوين IP محددة أو نطاقات IP أو شبكات IP الفرعية.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مرفق كمستمع لأحداث `'message'`. اختياري.
- Returns: [\<dgram.Socket\>](/ar/nodejs/api/dgram#class-dgramsocket)

ينشئ كائن `dgram.Socket`. بمجرد إنشاء المقبس، فإن استدعاء [`socket.bind()`](/ar/nodejs/api/dgram#socketbindport-address-callback) سيوجه المقبس لبدء الاستماع إلى رسائل مخطط البيانات. عندما لا يتم تمرير `address` و `port` إلى [`socket.bind()`](/ar/nodejs/api/dgram#socketbindport-address-callback) فإن الطريقة ستربط المقبس بعنوان "جميع الواجهات" على منفذ عشوائي (يفعل الشيء الصحيح لكل من مقابس `udp4` و `udp6`). يمكن استرداد العنوان والمنفذ المرتبطين باستخدام [`socket.address().address`](/ar/nodejs/api/dgram#socketaddress) و [`socket.address().port`](/ar/nodejs/api/dgram#socketaddress).

إذا تم تمكين خيار `signal`، فإن استدعاء `.abort()` على `AbortController` المقابل يشبه استدعاء `.close()` على المقبس:

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Later, when you want to close the server.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**تمت الإضافة في: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `'udp4'` أو `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تم إلحاقه كمستمع لأحداث `'message'`.
- الإرجاع: [\<dgram.Socket\>](/ar/nodejs/api/dgram#class-dgramsocket)

يقوم بإنشاء كائن `dgram.Socket` من `type` المحدد.

بمجرد إنشاء المقبس، فإن استدعاء [`socket.bind()`](/ar/nodejs/api/dgram#socketbindport-address-callback) سيوجه المقبس لبدء الاستماع إلى رسائل مخطط البيانات. عندما لا يتم تمرير `address` و `port` إلى [`socket.bind()`](/ar/nodejs/api/dgram#socketbindport-address-callback)، فإن الطريقة ستربط المقبس بعنوان "جميع الواجهات" على منفذ عشوائي (يفعل الشيء الصحيح لكل من مقابس `udp4` و `udp6`). يمكن استرداد العنوان والمنفذ المرتبطين باستخدام [`socket.address().address`](/ar/nodejs/api/dgram#socketaddress) و [`socket.address().port`](/ar/nodejs/api/dgram#socketaddress).

