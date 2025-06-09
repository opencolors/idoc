---
title: توثيق Node.js - الكتلة
description: تعلم كيفية استخدام وحدة الكتلة في Node.js لإنشاء عمليات فرعية تشارك منافذ الخادم، مما يعزز أداء التطبيق وقابليته للتوسع.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الكتلة | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية استخدام وحدة الكتلة في Node.js لإنشاء عمليات فرعية تشارك منافذ الخادم، مما يعزز أداء التطبيق وقابليته للتوسع.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الكتلة | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية استخدام وحدة الكتلة في Node.js لإنشاء عمليات فرعية تشارك منافذ الخادم، مما يعزز أداء التطبيق وقابليته للتوسع.
---


# مجموعة {#cluster}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

يمكن استخدام مجموعات عمليات Node.js لتشغيل مثيلات متعددة من Node.js يمكنها توزيع أحمال العمل بين سلاسل تطبيقاتها. عندما لا تكون هناك حاجة لعزل العمليات، استخدم وحدة [`worker_threads`](/ar/nodejs/api/worker_threads) بدلاً من ذلك، والتي تسمح بتشغيل سلاسل تطبيقات متعددة داخل مثيل Node.js واحد.

تسمح وحدة المجمعات بإنشاء سهل لعمليات فرعية تشترك جميعها في منافذ الخادم.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
:::

سيؤدي تشغيل Node.js الآن إلى مشاركة المنفذ 8000 بين العاملين:

```bash [BASH]
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
على نظام التشغيل Windows، لا يمكن حتى الآن إعداد خادم named pipe في عامل.


## كيف يعمل {#how-it-works}

تتفرع عمليات العامل باستخدام طريقة [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options)، بحيث يمكنها التواصل مع الأصل عبر IPC وتمرير معالجات الخادم ذهابًا وإيابًا.

تدعم وحدة المجموعة طريقتين لتوزيع الاتصالات الواردة.

الأولى (وهي الطريقة الافتراضية على جميع الأنظمة الأساسية باستثناء Windows) هي طريقة round-robin، حيث تستمع العملية الأساسية على منفذ، وتقبل اتصالات جديدة وتوزعها عبر العمال بطريقة round-robin، مع بعض الذكاء المدمج لتجنب إرهاق عملية العامل.

الطريقة الثانية هي حيث تقوم العملية الأساسية بإنشاء مقبس الاستماع وإرساله إلى العمال المهتمين. ثم يقبل العمال الاتصالات الواردة مباشرة.

من الناحية النظرية، يجب أن تعطي الطريقة الثانية أفضل أداء. ومع ذلك، في الممارسة العملية، يميل التوزيع إلى أن يكون غير متوازن بسبب تقلبات جدولة نظام التشغيل. لوحظت أحمال حيث انتهى أكثر من 70٪ من جميع الاتصالات في عمليتين فقط، من إجمالي ثماني عمليات.

نظرًا لأن `server.listen()` يسلم معظم العمل إلى العملية الأساسية، فهناك ثلاث حالات يختلف فيها السلوك بين عملية Node.js عادية وعامل المجموعة:

لا يوفر Node.js منطق التوجيه. لذلك من المهم تصميم تطبيق بحيث لا يعتمد بشكل كبير على كائنات البيانات الموجودة في الذاكرة لأشياء مثل الجلسات وتسجيل الدخول.

نظرًا لأن العمال جميعهم عمليات منفصلة، فيمكن قتلهم أو إعادة تفرخهم اعتمادًا على احتياجات البرنامج، دون التأثير على العمال الآخرين. طالما أن هناك بعض العمال لا يزالون على قيد الحياة، فسيستمر الخادم في قبول الاتصالات. إذا لم يكن هناك عمال على قيد الحياة، فسيتم إسقاط الاتصالات الموجودة وسيتم رفض الاتصالات الجديدة. ومع ذلك، لا يدير Node.js عدد العمال تلقائيًا. تقع على عاتق التطبيق مسؤولية إدارة تجمع العمال بناءً على احتياجاته الخاصة.

على الرغم من أن حالة الاستخدام الأساسي لوحدة `node:cluster` هي الشبكات، إلا أنه يمكن استخدامها أيضًا لحالات استخدام أخرى تتطلب عمليات العامل.


## الفئة: `Worker` {#class-worker}

**أُضيفت في: الإصدار v0.7.0**

- يمتد من: [\<EventEmitter\>](/ar/nodejs/api/events#class-eventemitter)

يحتوي كائن `Worker` على جميع المعلومات والأساليب العامة حول عامل. في الأساسي، يمكن الحصول عليه باستخدام `cluster.workers`. في العامل، يمكن الحصول عليه باستخدام `cluster.worker`.

### الحدث: `'disconnect'` {#event-disconnect}

**أُضيفت في: الإصدار v0.7.7**

يشبه حدث `cluster.on('disconnect')`، ولكنه خاص بهذا العامل.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // تم فصل العامل
});
```
### الحدث: `'error'` {#event-error}

**أُضيفت في: الإصدار v0.7.3**

هذا الحدث هو نفسه الحدث الذي توفره [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options).

داخل العامل، يمكن أيضًا استخدام `process.on('error')`.

### الحدث: `'exit'` {#event-exit}

**أُضيفت في: الإصدار v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز الخروج، إذا تم الخروج بشكل طبيعي.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الإشارة (مثل `'SIGHUP'`) التي تسببت في قتل العملية.

يشبه حدث `cluster.on('exit')`، ولكنه خاص بهذا العامل.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`تم إنهاء العامل بواسطة إشارة: ${signal}`);
    } else if (code !== 0) {
      console.log(`خرج العامل برمز خطأ: ${code}`);
    } else {
      console.log('نجاح العامل!');
    }
  });
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`تم إنهاء العامل بواسطة إشارة: ${signal}`);
    } else if (code !== 0) {
      console.log(`خرج العامل برمز خطأ: ${code}`);
    } else {
      console.log('نجاح العامل!');
    }
  });
}
```
:::

### الحدث: `'listening'` {#event-listening}

**أُضيفت في: الإصدار v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يشبه حدث `cluster.on('listening')`، ولكنه خاص بهذا العامل.

::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // العامل يستمع
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // العامل يستمع
});
```
:::

لا يتم إصداره في العامل.


### الحدث: `'message'` {#event-message}

**تمت إضافته في: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يشبه الحدث `'message'` الخاص بـ `cluster`، ولكنه خاص بهذا العامل.

داخل العامل، يمكن أيضًا استخدام `process.on('message')`.

راجع [`process` event: `'message'`](/ar/nodejs/api/process#event-message).

فيما يلي مثال يستخدم نظام الرسائل. يحتفظ بعدد الطلبات HTTP التي استقبلها العمال في العملية الرئيسية:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### الحدث: `'online'` {#event-online}

**أُضيف في: الإصدار 0.7.0**

مشابه للحدث `cluster.on('online')`، ولكنه خاص بهذا العامل.

```js [ESM]
cluster.fork().on('online', () => {
  // العامل متصل بالإنترنت
});
```
لا يتم إصداره في العامل.

### `worker.disconnect()` {#workerdisconnect}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 7.3.0 | تقوم هذه الطريقة الآن بإرجاع مرجع إلى `worker`. |
| الإصدار 0.7.7 | أُضيف في: الإصدار 0.7.7 |
:::

- يُرجع: [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker) مرجع إلى `worker`.

في العامل، ستغلق هذه الوظيفة جميع الخوادم، وتنتظر حدث `'close'` على تلك الخوادم، ثم تفصل قناة IPC.

في الأساسي، يتم إرسال رسالة داخلية إلى العامل مما يجعله يستدعي `.disconnect()` على نفسه.

يتسبب في تعيين `.exitedAfterDisconnect`.

بعد إغلاق الخادم، فإنه لن يقبل اتصالات جديدة، ولكن قد يتم قبول الاتصالات من قبل أي عامل استماع آخر. سيتم السماح للاتصالات الحالية بالإغلاق كالمعتاد. عندما لا توجد المزيد من الاتصالات، انظر [`server.close()`](/ar/nodejs/api/net#event-close)، ستغلق قناة IPC إلى العامل مما يسمح له بالموت بأمان.

ما ورد أعلاه ينطبق *فقط* على اتصالات الخادم، ولا يتم إغلاق اتصالات العميل تلقائيًا بواسطة العمال، ولا تنتظر عملية الفصل إغلاقها قبل الخروج.

في العامل، توجد `process.disconnect`، ولكنها ليست هذه الوظيفة؛ إنها [`disconnect()`](/ar/nodejs/api/child_process#subprocessdisconnect).

نظرًا لأن اتصالات الخادم طويلة الأمد قد تمنع العمال من الانفصال، فقد يكون من المفيد إرسال رسالة، بحيث يمكن اتخاذ إجراءات خاصة بالتطبيق لإغلاقها. قد يكون من المفيد أيضًا تنفيذ مهلة، وقتل العامل إذا لم يتم إصدار حدث `'disconnect'` بعد مرور بعض الوقت.

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // الاتصالات لا تنتهي أبدًا
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // ابدأ الإغلاق السلس لأي اتصالات بالخادم
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**تمت الإضافة في: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون هذه الخاصية `true` إذا خرج العامل بسبب `.disconnect()`. إذا خرج العامل بأي طريقة أخرى، تكون `false`. إذا لم يخرج العامل، تكون `undefined`.

تسمح القيمة المنطقية [`worker.exitedAfterDisconnect`](/ar/nodejs/api/cluster#workerexitedafterdisconnect) بالتمييز بين الخروج الطوعي والعرضي، وقد يختار الأصل عدم إعادة إنتاج العامل بناءً على هذه القيمة.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('أوه، كان ذلك مجرد تطوع - لا داعي للقلق');
  }
});

// اقتل العامل
worker.kill();
```
### `worker.id` {#workerid}

**تمت الإضافة في: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُمنح كل عامل جديد معرفًا فريدًا خاصًا به، ويتم تخزين هذا المعرف في `id`.

طالما أن العامل على قيد الحياة، فهذا هو المفتاح الذي يفهرسه في `cluster.workers`.

### `worker.isConnected()` {#workerisconnected}

**تمت الإضافة في: v0.11.14**

تُرجع هذه الدالة `true` إذا كان العامل متصلاً بأصله عبر قناة IPC الخاصة به، و `false` بخلاف ذلك. يتصل العامل بأصله بعد إنشائه. يتم فصله بعد انبعاث حدث `'disconnect'`.

### `worker.isDead()` {#workerisdead}

**تمت الإضافة في: v0.11.14**

تُرجع هذه الدالة `true` إذا انتهت عملية العامل (إما بسبب الخروج أو الإشارة). وإلا، فإنها تُرجع `false`.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`الأصل ${process.pid} قيد التشغيل`);

  // تفرع العمال.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('العامل ميت:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('العامل ميت:', worker.isDead());
  });
} else {
  // يمكن للعمال مشاركة أي اتصال TCP. في هذه الحالة، يكون خادم HTTP.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`العملية الحالية\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`الأصل ${process.pid} قيد التشغيل`);

  // تفرع العمال.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('العامل ميت:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('العامل ميت:', worker.isDead());
  });
} else {
  // يمكن للعمال مشاركة أي اتصال TCP. في هذه الحالة، يكون خادم HTTP.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`العملية الحالية\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```
:::


### `worker.kill([signal])` {#workerkillsignal}

**أُضيف في: الإصدار v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم إشارة الإنهاء التي سيتم إرسالها إلى عملية العامل. **الافتراضي:** `'SIGTERM'`

ستقوم هذه الدالة بإنهاء العامل. في العامل الأساسي، يتم ذلك عن طريق فصل `worker.process`، وبمجرد فصله، يتم الإنهاء باستخدام `signal`. في العامل، يتم ذلك عن طريق إنهاء العملية باستخدام `signal`.

تقوم الدالة `kill()` بإنهاء عملية العامل دون انتظار فصل سلس، ولها نفس سلوك `worker.process.kill()`.

تمت إضافة اسم بديل لهذا الأسلوب وهو `worker.destroy()` للتوافق مع الإصدارات السابقة.

في العامل، `process.kill()` موجودة، لكنها ليست هذه الدالة؛ إنها [`kill()`](/ar/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**أُضيف في: الإصدار v0.7.0**

- [\<ChildProcess\>](/ar/nodejs/api/child_process#class-childprocess)

يتم إنشاء جميع العمال باستخدام [`child_process.fork()`](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options)، ويتم تخزين الكائن الذي تم إرجاعه من هذه الدالة باسم `.process`. في العامل، يتم تخزين `process` العام.

راجع: [وحدة العمليات الفرعية](/ar/nodejs/api/child_process#child_processforkmodulepath-args-options).

سيقوم العمال باستدعاء `process.exit(0)` إذا حدث الحدث `'disconnect'` على `process` و `.exitedAfterDisconnect` ليس `true`. يحمي هذا من الفصل العرضي.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v4.0.0 | الآن يتم دعم المعامل `callback`. |
| v0.7.0 | أُضيف في: الإصدار v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ar/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الوسيطة `options`، إذا كانت موجودة، هي كائن يستخدم لتحديد معلمات إرسال أنواع معينة من المقابض. تدعم `options` الخصائص التالية:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) قيمة يمكن استخدامها عند تمرير مثيلات `net.Socket`. عندما تكون `true`، يظل المقبس مفتوحًا في عملية الإرسال. **الافتراضي:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرسال رسالة إلى عامل أو أساسي، مع مقبض اختياريًا.

في الأساسي، يرسل هذا رسالة إلى عامل معين. إنه مطابق لـ [`ChildProcess.send()`](/ar/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

في العامل، يرسل هذا رسالة إلى الأساسي. إنه مطابق لـ `process.send()`.

سيقوم هذا المثال بإعادة صدى جميع الرسائل من الأساسي:

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

## الحدث: `'disconnect'` {#event-disconnect_1}

**تمت إضافته في: v0.7.9**

- `worker` [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)

يُطلق هذا الحدث بعد انقطاع قناة IPC الخاصة بالعامل. يمكن أن يحدث هذا عندما يخرج العامل بأمان، أو يُقتل، أو يتم فصله يدويًا (مثل `worker.disconnect()`).

قد يكون هناك تأخير بين حدثي `'disconnect'` و `'exit'`. يمكن استخدام هذه الأحداث للكشف عما إذا كانت العملية عالقة في التنظيف أو إذا كانت هناك اتصالات طويلة الأمد.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`تم فصل العامل #${worker.id}`);
});
```
## الحدث: `'exit'` {#event-exit_1}

**تمت إضافته في: v0.7.9**

- `worker` [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رمز الخروج، إذا خرج بشكل طبيعي.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الإشارة (مثل `'SIGHUP'`) التي تسببت في قتل العملية.

عندما يموت أي من العمال، ستطلق وحدة الكتلة حدث `'exit'`.

يمكن استخدام هذا لإعادة تشغيل العامل عن طريق استدعاء [`.fork()`](/ar/nodejs/api/cluster#clusterforkenv) مرة أخرى.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('العامل %d مات (%s). إعادة التشغيل...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
انظر [`child_process` event: `'exit'`](/ar/nodejs/api/child_process#event-exit).

## الحدث: `'fork'` {#event-fork}

**تمت إضافته في: v0.7.0**

- `worker` [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)

عندما يتم تفرع عامل جديد، ستطلق وحدة الكتلة حدث `'fork'`. يمكن استخدام هذا لتسجيل نشاط العامل وإنشاء مهلة مخصصة.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('يجب أن يكون هناك خطأ ما في الاتصال ...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
```

## الحدث: `'listening'` {#event-listening_1}

**أضيف في: v0.7.0**

- `worker` [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

بعد استدعاء `listen()` من عامل، عندما يتم إطلاق الحدث `'listening'` على الخادم، سيتم أيضًا إطلاق الحدث `'listening'` على `cluster` في الرئيسي.

يتم تنفيذ معالج الأحداث بوسيطين، `worker` يحتوي على كائن العامل و `address` يحتوي على خصائص الاتصال التالية: `address` و `port` و `addressType`. هذا مفيد جدًا إذا كان العامل يستمع إلى أكثر من عنوان واحد.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `A worker is now connected to ${address.address}:${address.port}`);
});
```
`addressType` هو أحد الخيارات التالية:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Unix domain socket)
- `'udp4'` أو `'udp6'` (UDPv4 أو UDPv6)

## الحدث: `'message'` {#event-message_1}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | تم تمرير المعامل `worker` الآن؛ راجع التفاصيل أدناه. |
| v2.5.0 | أضيف في: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يتم إطلاقه عندما يتلقى الرئيسي في المجموعة رسالة من أي عامل.

راجع [`child_process` event: `'message'`](/ar/nodejs/api/child_process#event-message).

## الحدث: `'online'` {#event-online_1}

**أضيف في: v0.7.0**

- `worker` [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)

بعد تفرع عامل جديد، يجب أن يستجيب العامل برسالة متصل بالإنترنت. عندما يتلقى الرئيسي رسالة متصل بالإنترنت، فإنه سيطلق هذا الحدث. الفرق بين `'fork'` و `'online'` هو أن fork يتم إطلاقه عندما يفرع الرئيسي عاملاً، ويتم إطلاق `'online'` عندما يكون العامل قيد التشغيل.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('Yay, the worker responded after it was forked');
});
```

## حدث: `'setup'` {#event-setup}

**تمت إضافته في: الإصدار 0.7.1**

- `settings` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يتم إصداره في كل مرة يتم فيها استدعاء [`.setupPrimary()`](/ar/nodejs/api/cluster#clustersetupprimarysettings).

الكائن `settings` هو الكائن `cluster.settings` في الوقت الذي تم فيه استدعاء [`.setupPrimary()`](/ar/nodejs/api/cluster#clustersetupprimarysettings) وهو استشاري فقط، حيث يمكن إجراء مكالمات متعددة إلى [`.setupPrimary()`](/ar/nodejs/api/cluster#clustersetupprimarysettings) في علامة واحدة.

إذا كانت الدقة مهمة، فاستخدم `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**تمت إضافته في: الإصدار 0.7.7**

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عند فصل جميع العاملين وإغلاق المعالجات.

يستدعي `.disconnect()` على كل عامل في `cluster.workers`.

عندما يتم فصلهم، سيتم إغلاق جميع المعالجات الداخلية، مما يسمح للعملية الرئيسية بالموت بأمان إذا لم يكن هناك حدث آخر في الانتظار.

يأخذ الأسلوب وسيطة رد نداء اختيارية سيتم استدعاؤها عند الانتهاء.

يمكن استدعاء هذا فقط من العملية الرئيسية.

## `cluster.fork([env])` {#clusterforkenv}

**تمت إضافته في: الإصدار 0.6.0**

- `env` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أزواج المفاتيح/القيم المراد إضافتها إلى بيئة عملية العامل.
- الإرجاع: [\<cluster.Worker\>](/ar/nodejs/api/cluster#class-worker)

يقوم بإنشاء عملية عامل جديدة.

يمكن استدعاء هذا فقط من العملية الرئيسية.

## `cluster.isMaster` {#clusterismaster}

**تمت إضافته في: الإصدار 0.8.1**

**تم الإهمال منذ: الإصدار 16.0.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل
:::

اسم مستعار مهمل لـ [`cluster.isPrimary`](/ar/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**تمت إضافته في: الإصدار 16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

صحيح إذا كانت العملية هي العملية الرئيسية. يتم تحديد ذلك بواسطة `process.env.NODE_UNIQUE_ID`. إذا كان `process.env.NODE_UNIQUE_ID` غير معرف، فإن `isPrimary` تكون `true`.


## `cluster.isWorker` {#clusterisworker}

**أُضيف في:** v0.6.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

صحيح إذا كانت العملية ليست عملية أساسية (وهي نفي `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**أُضيف في:** v0.11.2

سياسة الجدولة، إما `cluster.SCHED_RR` للتوزيع الدوري أو `cluster.SCHED_NONE` لتركها لنظام التشغيل. هذا إعداد عام ويتم تجميده فعليًا بمجرد إنشاء أول عامل، أو استدعاء [`.setupPrimary()`](/ar/nodejs/api/cluster#clustersetupprimarysettings)، أيهما يأتي أولاً.

`SCHED_RR` هو الإعداد الافتراضي على جميع أنظمة التشغيل باستثناء Windows. ستتغير Windows إلى `SCHED_RR` بمجرد أن تتمكن libuv من توزيع معالجات IOCP بشكل فعال دون تكبد ضربة أداء كبيرة.

يمكن أيضًا تعيين `cluster.schedulingPolicy` من خلال متغير البيئة `NODE_CLUSTER_SCHED_POLICY`. القيم الصالحة هي `'rr'` و `'none'`.

## `cluster.settings` {#clustersettings}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v13.2.0, v12.16.0 | خيار `serialization` مدعوم الآن. |
| v9.5.0 | خيار `cwd` مدعوم الآن. |
| v9.4.0 | خيار `windowsHide` مدعوم الآن. |
| v8.2.0 | خيار `inspectPort` مدعوم الآن. |
| v6.4.0 | خيار `stdio` مدعوم الآن. |
| v0.7.1 | أُضيف في: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة وسيطات السلسلة التي تم تمريرها إلى ملف Node.js القابل للتنفيذ. **افتراضي:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الملف إلى ملف العامل. **افتراضي:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) وسيطات السلسلة التي تم تمريرها إلى العامل. **افتراضي:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دليل العمل الحالي لعملية العامل. **افتراضي:** `undefined` (موروث من العملية الأصل).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) حدد نوع التسلسل المستخدم لإرسال الرسائل بين العمليات. القيم المحتملة هي `'json'` و `'advanced'`. راجع [التسلسل المتقدم لـ `child_process`](/ar/nodejs/api/child_process#advanced-serialization) لمزيد من التفاصيل. **افتراضي:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان سيتم إرسال الإخراج إلى stdio الخاص بالوالد أم لا. **افتراضي:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) يقوم بتكوين stdio للعمليات المتفرعة. نظرًا لأن وحدة التجميع تعتمد على IPC للعمل، يجب أن يحتوي هذا التكوين على إدخال `'ipc'`. عند توفير هذا الخيار، فإنه يتجاوز `silent`. انظر [`child_process.spawn()`](/ar/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ar/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين هوية المستخدم للعملية. (انظر [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يعين هوية المجموعة للعملية. (انظر [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يعين منفذ فحص العامل. يمكن أن يكون هذا رقمًا، أو دالة لا تأخذ أي وسيطات وتعيد رقمًا. بشكل افتراضي، يحصل كل عامل على منفذه الخاص، بزيادة من `process.debugPort` الأساسي.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إخفاء نافذة وحدة تحكم العمليات المتفرعة التي يتم إنشاؤها عادةً على أنظمة Windows. **افتراضي:** `false`.


بعد استدعاء [`.setupPrimary()`](/ar/nodejs/api/cluster#clustersetupprimarysettings) (أو [`.fork()`](/ar/nodejs/api/cluster#clusterforkenv))، سيحتوي كائن الإعدادات هذا على الإعدادات، بما في ذلك القيم الافتراضية.

لا يُقصد تغيير هذا الكائن أو تعيينه يدويًا.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v16.0.0 | تم الإلغاء منذ: الإصدار v16.0.0 |
| الإصدار v6.4.0 | خيار `stdio` مدعوم الآن. |
| الإصدار v0.7.1 | تمت الإضافة في: الإصدار v0.7.1 |
:::

::: danger [مستقر: 0 - مُلغى]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مُلغى
:::

اسم مستعار مُلغى لـ [`.setupPrimary()`](/ar/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**تمت الإضافة في: الإصدار v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`cluster.settings`](/ar/nodejs/api/cluster#clustersettings).

يتم استخدام `setupPrimary` لتغيير سلوك 'fork' الافتراضي. بمجرد استدعائها، ستكون الإعدادات موجودة في `cluster.settings`.

أي تغييرات في الإعدادات تؤثر فقط على المكالمات المستقبلية إلى [`.fork()`](/ar/nodejs/api/cluster#clusterforkenv) وليس لها أي تأثير على العمال الذين يعملون بالفعل.

السمة الوحيدة للعامل التي لا يمكن تعيينها عبر `.setupPrimary()` هي `env` التي تم تمريرها إلى [`.fork()`](/ar/nodejs/api/cluster#clusterforkenv).

تنطبق الإعدادات الافتراضية أعلاه على المكالمة الأولى فقط؛ الإعدادات الافتراضية للمكالمات اللاحقة هي القيم الحالية في وقت استدعاء `cluster.setupPrimary()`.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // عامل https
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // عامل http
```

```js [CJS]
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // عامل https
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // عامل http
```
:::

يمكن استدعاء هذا فقط من العملية الأساسية.

## `cluster.worker` {#clusterworker}

**تمت الإضافة في: الإصدار v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

مرجع إلى كائن العامل الحالي. غير متوفر في العملية الأساسية.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('أنا أساسي');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`أنا عامل #${cluster.worker.id}`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('أنا أساسي');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`أنا عامل #${cluster.worker.id}`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**أُضيف في: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن تجزئة يخزن كائنات العامل النشطة، مفتاحها حقل `id`. هذا يجعل من السهل المرور عبر جميع العمال. وهو متاح فقط في العملية الرئيسية.

يتم إزالة العامل من `cluster.workers` بعد فصل العامل *و* الخروج. لا يمكن تحديد الترتيب بين هذين الحدثين مسبقًا. ومع ذلك، فمن المضمون أن الإزالة من قائمة `cluster.workers` تحدث قبل إطلاق آخر حدث `'disconnect'` أو `'exit'`.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('إعلان كبير لجميع العمال');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('إعلان كبير لجميع العمال');
}
```
:::

