---
title: توثيق Node.js - واجهة برمجة تطبيقات Web Streams
description: توثيق لواجهة برمجة تطبيقات Web Streams في Node.js، مع تفاصيل حول كيفية العمل مع التدفقات لمعالجة البيانات بكفاءة، بما في ذلك التدفقات القابلة للقراءة، والقابلة للكتابة، وتحويل التدفقات.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - واجهة برمجة تطبيقات Web Streams | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق لواجهة برمجة تطبيقات Web Streams في Node.js، مع تفاصيل حول كيفية العمل مع التدفقات لمعالجة البيانات بكفاءة، بما في ذلك التدفقات القابلة للقراءة، والقابلة للكتابة، وتحويل التدفقات.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - واجهة برمجة تطبيقات Web Streams | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق لواجهة برمجة تطبيقات Web Streams في Node.js، مع تفاصيل حول كيفية العمل مع التدفقات لمعالجة البيانات بكفاءة، بما في ذلك التدفقات القابلة للقراءة، والقابلة للكتابة، وتحويل التدفقات.
---


# Web Streams API {#web-streams-api}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | لم يعد تجريبيًا. |
| v18.0.0 | لم يعد استخدام واجهة برمجة التطبيقات هذه يصدر تحذيرًا في وقت التشغيل. |
| v16.5.0 | تمت إضافته في: v16.5.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ [معيار WHATWG Streams](https://streams.spec.whatwg.org/).

## نظرة عامة {#overview}

يحدد [معيار WHATWG Streams](https://streams.spec.whatwg.org/) (أو "تدفقات الويب") واجهة برمجة تطبيقات للتعامل مع بيانات البث. إنه مشابه لواجهة برمجة تطبيقات [التدفقات](/ar/nodejs/api/stream) الخاصة بـ Node.js ولكنه ظهر لاحقًا وأصبح واجهة برمجة التطبيقات "القياسية" لتدفق البيانات عبر العديد من بيئات JavaScript.

هناك ثلاثة أنواع رئيسية من الكائنات:

- `ReadableStream` - يمثل مصدرًا لبيانات البث.
- `WritableStream` - يمثل وجهة لبيانات البث.
- `TransformStream` - يمثل خوارزمية لتحويل بيانات البث.

### مثال `ReadableStream` {#example-readablestream}

ينشئ هذا المثال `ReadableStream` بسيطًا يدفع الطابع الزمني `performance.now()` الحالي مرة واحدة كل ثانية إلى الأبد. يتم استخدام مُكرِّر غير متزامن لقراءة البيانات من الدفق.



::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### Class: `ReadableStream` {#class-readablestream}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | This class is now exposed on the global object. |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Added in: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها فور إنشاء `ReadableStream`.
    - `controller` [\<ReadableStreamDefaultController\>](/ar/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ar/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Returns: `undefined` أو وعد يتم تحقيقه بقيمة `undefined`.


    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها بشكل متكرر عندما لا يكون الطابور الداخلي `ReadableStream` ممتلئًا. قد تكون العملية متزامنة أو غير متزامنة. إذا كانت غير متزامنة، فلن يتم استدعاء الدالة مرة أخرى حتى يتم تحقيق الوعد الذي تم إرجاعه مسبقًا.
    - `controller` [\<ReadableStreamDefaultController\>](/ar/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ar/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Returns: وعد يتم تحقيقه بقيمة `undefined`.


    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها عند إلغاء `ReadableStream`.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: وعد يتم تحقيقه بقيمة `undefined`.


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'bytes'` أو `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يُستخدم فقط عندما تكون `type` مساوية لـ `'bytes'`. عند التعيين إلى قيمة غير صفرية، يتم تخصيص مخزن مؤقت للعرض تلقائيًا لـ `ReadableByteStreamController.byobRequest`. عند عدم التعيين، يجب استخدام قوائم الانتظار الداخلية للدفق لنقل البيانات عبر القارئ الافتراضي `ReadableStreamDefaultReader`.


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم قائمة الانتظار الداخلية قبل تطبيق الضغط الخلفي.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم تُستخدم لتحديد حجم كل جزء من البيانات.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `readableStream.locked` {#readablestreamlocked}

**تمت الإضافة في: الإصدار v16.5.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يتم تعيينها إلى `true` إذا كان هناك قارئ نشط لهذا [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

الخاصية `readableStream.locked` تكون `false` افتراضيًا، ويتم تبديلها إلى `true` بينما يوجد قارئ نشط يستهلك بيانات التدفق.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**تمت الإضافة في: الإصدار v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: وعد يتم تنفيذه مع `undefined` بمجرد اكتمال الإلغاء.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**تمت الإضافة في: الإصدار v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` أو `undefined`


- الإرجاع: [\<ReadableStreamDefaultReader\>](/ar/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/ar/nodejs/api/webstreams#class-readablestreambyobreader)



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

يتسبب في أن تكون `readableStream.locked` هي `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**تمت الإضافة في: الإصدار v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) `ReadableStream` التي سيدفع إليها `transform.writable` البيانات التي تم تعديلها المحتملة التي يتلقاها من هذا `ReadableStream`.
    - `writable` [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) `WritableStream` التي ستتم كتابة بيانات `ReadableStream` إليها.


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، فإن الأخطاء في هذا `ReadableStream` لن تتسبب في إجهاض `transform.writable`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، فإن الأخطاء في الوجهة `transform.writable` لا تتسبب في إلغاء `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، فإن إغلاق `ReadableStream` لا يتسبب في إغلاق `transform.writable`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء نقل البيانات باستخدام [\<AbortController\>](/ar/nodejs/api/globals#class-abortcontroller).


- الإرجاع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) من `transform.readable`.

يربط هذا [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) بزوج [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) و [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) المقدم في وسيطة `transform` بحيث تتم كتابة البيانات من هذا [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) في `transform.writable`، وربما يتم تحويلها، ثم يتم دفعها إلى `transform.readable`. بمجرد تكوين خط الأنابيب، يتم إرجاع `transform.readable`.

يتسبب في أن تكون `readableStream.locked` هي `true` أثناء نشاط عملية الأنابيب.



::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::

#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**أضيف في: v16.5.0**

- `destination` [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) التي ستتم كتابة بيانات `ReadableStream` إليها.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، لن تتسبب الأخطاء في `ReadableStream` في إلغاء `destination`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، لن تتسبب الأخطاء في `destination` في إلغاء `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، لن يتسبب إغلاق `ReadableStream` في إغلاق `destination`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء نقل البيانات باستخدام [\<AbortController\>](/ar/nodejs/api/globals#class-abortcontroller).
  
 
- الإرجاع: وعد يتم تحقيقه بقيمة `undefined`

يجعل `readableStream.locked` بالقيمة `true` أثناء نشاط عملية النقل عبر الأنابيب.

#### `readableStream.tee()` {#readablestreamtee}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.10.0, v16.18.0 | دعم إنشاء نسخة مطابقة لتيار بايت قابل للقراءة. |
| v16.5.0 | أضيف في: v16.5.0 |
:::

- الإرجاع: [\<ReadableStream[]\>](/ar/nodejs/api/webstreams#class-readablestream)

يُرجع زوجًا من مثيلات [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الجديدة التي سيتم توجيه بيانات `ReadableStream` إليها. سيتلقى كل منهما نفس البيانات.

يجعل `readableStream.locked` بالقيمة `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**أضيف في: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون القيمة `true`، يمنع إغلاق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) عندما يتم إنهاء المكرر غير المتزامن بشكل مفاجئ. **افتراضي**: `false`.
  
 

ينشئ ويعيد مكررًا غير متزامن قابل للاستخدام لاستهلاك بيانات `ReadableStream`.

يجعل `readableStream.locked` بالقيمة `true` أثناء نشاط المكرر غير المتزامن.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### التكرار غير المتزامن {#async-iteration}

يدعم الكائن [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) بروتوكول التكرار غير المتزامن باستخدام صيغة `for await`.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
سيستهلك المكرر غير المتزامن [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) حتى ينتهي.

بشكل افتراضي، إذا خرج المكرر غير المتزامن مبكرًا (إما عن طريق `break` أو `return` أو `throw`)، فسيتم إغلاق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream). لمنع الإغلاق التلقائي لـ [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)، استخدم طريقة `readableStream.values()` للحصول على المكرر غير المتزامن وتعيين الخيار `preventCancel` على `true`.

يجب ألا يكون [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) مؤمنًا (أي يجب ألا يكون لديه قارئ نشط موجود). أثناء التكرار غير المتزامن، سيتم قفل [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

#### النقل باستخدام `postMessage()` {#transferring-with-postmessage}

يمكن نقل مثيل [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) باستخدام [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**تمت الإضافة في: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) كائن يقوم بتنفيذ بروتوكول التكرار `Symbol.asyncIterator` أو `Symbol.iterator`.

طريقة مساعدة تنشئ [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) جديدًا من كائن قابل للتكرار.



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### الفئة: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| الإصدار v16.5.0 | أُضيف في: v16.5.0 |
:::

بشكل افتراضي، استدعاء `readableStream.getReader()` بدون وسيطات سيعيد نسخة من `ReadableStreamDefaultReader`. يعامل القارئ الافتراضي أجزاء البيانات التي تمر عبر الدفق كقيم مبهمة، مما يسمح لـ [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) بالعمل بشكل عام مع أي قيمة JavaScript.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**أُضيف في: v16.5.0**

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

ينشئ [\<ReadableStreamDefaultReader\>](/ar/nodejs/api/webstreams#class-readablestreamdefaultreader) جديدًا مؤمنًا للدفق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) المحدد.

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**أُضيف في: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: وعد يتم تحقيقه بـ `undefined`.

يلغي [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) ويعيد وعدًا يتم تحقيقه عند إلغاء الدفق الأساسي.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**أُضيف في: v16.5.0**

- النوع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقه بـ `undefined` عندما يتم إغلاق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) المرتبط أو يتم رفضه إذا حدث خطأ في الدفق أو تم تحرير قفل القارئ قبل أن ينتهي الدفق من الإغلاق.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**أُضيف في: v16.5.0**

- الإرجاع: وعد يتم تحقيقه بكائن:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

يطلب الجزء التالي من البيانات من [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الأساسي ويعيد وعدًا يتم تحقيقه بالبيانات بمجرد توفرها.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**أضيف في: الإصدار 16.5.0**

يحرر قفل هذا القارئ على [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الأساسي.

### الفئة: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| الإصدار 16.5.0 | أضيف في: الإصدار 16.5.0 |
:::

`ReadableStreamBYOBReader` هو مستهلك بديل لـ [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الموجهة نحو البايتات (تلك التي تم إنشاؤها مع `underlyingSource.type` المعين على القيمة `'bytes'` عند إنشاء `ReadableStream`).

`BYOB` هو اختصار لـ "أحضر المخزن المؤقت الخاص بك". هذا نمط يسمح بقراءة أكثر كفاءة للبيانات الموجهة نحو البايتات التي تتجنب النسخ الزائد.

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**أضيف في: الإصدار 16.5.0**

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

ينشئ `ReadableStreamBYOBReader` جديدًا مقفلًا على [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) المحدد.


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**أُضيف في: الإصدار 16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- القيمة المُعادة: وعد يتم تحقيقه مع `undefined`.

يلغي [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) ويعيد وعدًا يتم تحقيقه عندما يتم إلغاء التدفق الأساسي.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**أُضيف في: الإصدار 16.5.0**

- النوع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم تحقيقه مع `undefined` عندما يتم إغلاق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) المرتبط أو رفضه إذا حدث خطأ في التدفق أو تم تحرير قفل القارئ قبل انتهاء التدفق من الإغلاق.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.7.0, v20.17.0 | تمت إضافة خيار `min`. |
| v16.5.0 | أُضيف في: الإصدار 16.5.0 |
:::

- `view` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عند التعيين، لن يتم تحقيق الوعد المُعاد إلا بمجرد توفر عدد `min` من العناصر. عند عدم التعيين، يتم تحقيق الوعد عندما يتوفر عنصر واحد على الأقل.
  
 
- القيمة المُعادة: وعد يتم تحقيقه مع كائن: 
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

يطلب الجزء التالي من البيانات من [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الأساسي ويعيد وعدًا يتم تحقيقه مع البيانات بمجرد توفرها.

لا تمرر مثيل كائن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) المُجمَّع إلى هذه الطريقة. يتم إنشاء كائنات `Buffer` المُجمَّعة باستخدام `Buffer.allocUnsafe()` أو `Buffer.from()`، أو غالبًا ما يتم إرجاعها بواسطة العديد من استدعاءات وحدة `node:fs`. تستخدم هذه الأنواع من `Buffer` كائن [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أساسي مشترك يحتوي على جميع البيانات من جميع مثيلات `Buffer` المُجمَّعة. عندما يتم تمرير `Buffer` أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) إلى `readableStreamBYOBReader.read()`، يتم *فصل* `ArrayBuffer` الأساسي للعرض، مما يبطل جميع العروض الموجودة التي قد تكون موجودة على `ArrayBuffer`. يمكن أن يكون لهذا عواقب وخيمة على تطبيقك.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**أُضيف في: v16.5.0**

يُحرِّر قفل هذا القارئ على [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الأساسي.

### الصنف: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**أُضيف في: v16.5.0**

لكل [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) مُتحكم مسؤول عن الحالة الداخلية وإدارة قائمة انتظار التدفق. `ReadableStreamDefaultController` هو تطبيق المتحكم الافتراضي لـ `ReadableStream` التي ليست مُوجهة بالبايتات.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**أُضيف في: v16.5.0**

يُغلق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الذي يرتبط به هذا المتحكم.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**أُضيف في: v16.5.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع مقدار البيانات المتبقية لملء قائمة انتظار [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**أُضيف في: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يُلحق قطعة بيانات جديدة بقائمة انتظار [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**أُضيف في: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يُشير إلى خطأ يتسبب في حدوث خطأ وإغلاق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

### الصنف: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.10.0 | دعم التعامل مع طلب سحب BYOB من قارئ تم إصداره. |
| v16.5.0 | أُضيف في: v16.5.0 |
:::

لكل [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) مُتحكم مسؤول عن الحالة الداخلية وإدارة قائمة انتظار التدفق. `ReadableByteStreamController` مخصص لـ `ReadableStream` الموجهة بالبايتات.


#### ‏`readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**تمت الإضافة في: v16.5.0**

- النوع: [\<ReadableStreamBYOBRequest\>](/ar/nodejs/api/webstreams#class-readablestreambyobrequest)

#### ‏`readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**تمت الإضافة في: v16.5.0**

يغلق [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) المرتبط بهذا المتحكم.

#### ‏`readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**تمت الإضافة في: v16.5.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع مقدار البيانات المتبقية لملء قائمة انتظار [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

#### ‏`readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**تمت الإضافة في: v16.5.0**

- ‏`chunk`: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

يلحق جزءًا جديدًا من البيانات بقائمة انتظار [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream).

#### ‏`readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**تمت الإضافة في: v16.5.0**

- ‏`error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يشير إلى وجود خطأ يتسبب في حدوث خطأ في [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) وإغلاقه.

### الصنف: ‏`ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذا الصنف معروض الآن على الكائن العام. |
| v16.5.0 | تمت الإضافة في: v16.5.0 |
:::

عند استخدام `ReadableByteStreamController` في تدفقات موجهة بالبايت، وعند استخدام `ReadableStreamBYOBReader`، توفر الخاصية `readableByteStreamController.byobRequest` الوصول إلى نسخة `ReadableStreamBYOBRequest` التي تمثل طلب القراءة الحالي. يُستخدم الكائن للوصول إلى `ArrayBuffer`/`TypedArray` التي تم توفيرها لطلب القراءة لملئها، ويوفر طرقًا للإشارة إلى أنه تم توفير البيانات.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**تمت الإضافة في: الإصدار 16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يشير إلى أنه تم كتابة عدد `bytesWritten` من البايتات إلى `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**تمت الإضافة في: الإصدار 16.5.0**

- `view` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

يشير إلى أنه تم تلبية الطلب ببايتات مكتوبة في `Buffer` أو `TypedArray` أو `DataView` جديد.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**تمت الإضافة في: الإصدار 16.5.0**

- النوع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### الفئة: `WritableStream` {#class-writablestream}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| v16.5.0 | تمت الإضافة في: الإصدار 16.5.0 |
:::

`WritableStream` هي وجهة يتم إرسال بيانات التدفق إليها.

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**تمت الإضافة في: الإصدار 16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها فور إنشاء `WritableStream`.
    - `controller` [\<WritableStreamDefaultController\>](/ar/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - الإرجاع: `undefined` أو وعد يتم تنفيذه مع `undefined`.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها عند كتابة جزء من البيانات إلى `WritableStream`.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/ar/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - الإرجاع: وعد يتم تنفيذه مع `undefined`.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها عند إغلاق `WritableStream`.
    - الإرجاع: وعد يتم تنفيذه مع `undefined`.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها لإغلاق `WritableStream` فجأة.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: وعد يتم تنفيذه مع `undefined`.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) الخيار `type` محجوز للاستخدام المستقبلي و *يجب* أن يكون غير محدد.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم قائمة الانتظار الداخلية قبل تطبيق الضغط الخلفي.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم تستخدم لتحديد حجم كل جزء من البيانات.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**تمت الإضافة في: الإصدار 16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: وعد يتم تحقيقه مع `undefined`.

ينهي `WritableStream` بشكل مفاجئ. سيتم إلغاء جميع عمليات الكتابة المنتظرة مع رفض الوعود المرتبطة بها.

#### `writableStream.close()` {#writablestreamclose}

**تمت الإضافة في: الإصدار 16.5.0**

- الإرجاع: وعد يتم تحقيقه مع `undefined`.

يغلق `WritableStream` عندما لا يُتوقع إجراء عمليات كتابة إضافية.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**تمت الإضافة في: الإصدار 16.5.0**

- الإرجاع: [\<WritableStreamDefaultWriter\>](/ar/nodejs/api/webstreams#class-writablestreamdefaultwriter)

ينشئ ويعيد مثيل كاتب جديد يمكن استخدامه لكتابة البيانات في `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**تمت الإضافة في: الإصدار 16.5.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

خاصية `writableStream.locked` هي `false` افتراضيًا، ويتم تبديلها إلى `true` عندما يكون هناك كاتب نشط متصل بـ `WritableStream`.

#### النقل باستخدام postMessage() {#transferring-with-postmessage_1}

يمكن نقل مثيل [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) باستخدام [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### الفئة: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| الإصدار 16.5.0 | تمت الإضافة في: الإصدار 16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**تمت الإضافة في: الإصدار 16.5.0**

- `stream` [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

ينشئ `WritableStreamDefaultWriter` جديدًا مقفلًا على `WritableStream` المحدد.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**تمت الإضافة في: الإصدار 16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: وعد يتم تحقيقه مع `undefined`.

ينهي `WritableStream` بشكل مفاجئ. سيتم إلغاء جميع عمليات الكتابة المنتظرة مع رفض الوعود المرتبطة بها.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**أضيف في: v16.5.0**

- الإرجاع: وعد يتحقق بـ `undefined`.

يغلق `WritableStream` عندما لا يُتوقع كتابة إضافية.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**أضيف في: v16.5.0**

- النوع: [\<وعد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق بـ `undefined` عندما يتم إغلاق [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) المرتبط أو يتم رفضه إذا حدث خطأ في التدفق أو تم تحرير قفل الكاتب قبل أن ينتهي التدفق من الإغلاق.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**أضيف في: v16.5.0**

- النوع: [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

كمية البيانات المطلوبة لملء قائمة انتظار [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**أضيف في: v16.5.0**

- النوع: [\<وعد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق بـ `undefined` عندما يكون الكاتب جاهزًا للاستخدام.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**أضيف في: v16.5.0**

يحرر قفل هذا الكاتب على [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) الأساسي.

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**أضيف في: v16.5.0**

- `chunk`: [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: وعد يتحقق بـ `undefined`.

يلحق قطعة جديدة من البيانات بقائمة انتظار [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream).

### الفئة: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| v16.5.0 | أضيف في: v16.5.0 |
:::

يدير `WritableStreamDefaultController` الحالة الداخلية لـ [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**أضيف في: v16.5.0**

- `error` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يتم استدعاؤه بواسطة كود المستخدم للإشارة إلى حدوث خطأ أثناء معالجة بيانات `WritableStream`. عند الاستدعاء، سيتم إلغاء [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)، مع إلغاء الكتابات المعلقة حاليًا.


#### ‏`writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- النوع: [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) ‏`AbortSignal` يمكن استخدامه لإلغاء عمليات الكتابة أو الإغلاق المعلقة عندما يتم إجهاض [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream).

### الفئة: ‏`TransformStream` {#class-transformstream}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| v16.5.0 | تمت إضافته في: v16.5.0 |
:::

يتكون ‏`TransformStream` من [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) و [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) متصلين بحيث يتم استقبال البيانات المكتوبة إلى ‏`WritableStream`، وربما تحويلها، قبل دفعها إلى قائمة انتظار ‏`ReadableStream`.

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### ‏`new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**تمت إضافته في: v16.5.0**

- ‏`transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ‏`start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها مباشرة عند إنشاء ‏`TransformStream`.
    - ‏`controller` [\<TransformStreamDefaultController\>](/ar/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - الإرجاع: `undefined` أو وعد يتم تنفيذه بـ `undefined`


    - ‏`transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم تستقبل، وربما تعدل، جزءًا من البيانات المكتوبة إلى ‏`transformStream.writable`، قبل إعادة توجيه ذلك إلى ‏`transformStream.readable`.
    - ‏`chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - ‏`controller` [\<TransformStreamDefaultController\>](/ar/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - الإرجاع: وعد يتم تنفيذه بـ `undefined`.


    - ‏`flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم يتم استدعاؤها مباشرة قبل إغلاق الجانب القابل للكتابة من ‏`TransformStream`، مما يشير إلى نهاية عملية التحويل.
    - ‏`controller` [\<TransformStreamDefaultController\>](/ar/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - الإرجاع: وعد يتم تنفيذه بـ `undefined`.


    - ‏`readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) خيار `readableType` محجوز للاستخدام المستقبلي و*يجب* أن يكون `undefined`.
    - ‏`writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) خيار `writableType` محجوز للاستخدام المستقبلي و*يجب* أن يكون `undefined`.


- ‏`writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ‏`highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم قائمة الانتظار الداخلية قبل تطبيق الضغط الخلفي.
    - ‏`size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم تستخدم لتحديد حجم كل جزء من البيانات.
    - ‏`chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



- ‏`readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ‏`highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم قائمة الانتظار الداخلية قبل تطبيق الضغط الخلفي.
    - ‏`size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة معرفة من قبل المستخدم تستخدم لتحديد حجم كل جزء من البيانات.
    - ‏`chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `transformStream.readable` {#transformstreamreadable}

**أضيف في: الإصدار 16.5.0**

- النوع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**أضيف في: الإصدار 16.5.0**

- النوع: [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

#### النقل باستخدام postMessage() {#transferring-with-postmessage_2}

يمكن نقل مثيل [\<TransformStream\>](/ar/nodejs/api/webstreams#class-transformstream) باستخدام [\<MessagePort\>](/ar/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### الفئة: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| الإصدار 16.5.0 | أضيف في: الإصدار 16.5.0 |
:::

يدير `TransformStreamDefaultController` الحالة الداخلية لـ `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**أضيف في: الإصدار 16.5.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

مقدار البيانات المطلوبة لملء قائمة الانتظار للجانب القابل للقراءة.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**أضيف في: الإصدار 16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يُلحِق جزءًا من البيانات بقائمة الانتظار للجانب القابل للقراءة.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**أضيف في: الإصدار 16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

يشير إلى كل من الجانب القابل للقراءة والجانب القابل للكتابة إلى حدوث خطأ أثناء معالجة بيانات التحويل، مما يتسبب في إغلاق كلا الجانبين فجأة.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**أضيف في: الإصدار 16.5.0**

يُغلِق الجانب القابل للقراءة من النقل ويتسبب في إغلاق الجانب القابل للكتابة فجأة مع وجود خطأ.

### الفئة: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| الإصدار 16.5.0 | أضيف في: الإصدار 16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**أضيف في: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**أضيف في: v16.5.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**أضيف في: v16.5.0**

- النوع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



### الفئة: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| v16.5.0 | أضيف في: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**أضيف في: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**أضيف في: v16.5.0**

- النوع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**أضيف في: v16.5.0**

- النوع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



### الفئة: `TextEncoderStream` {#class-textencoderstream}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| v16.6.0 | أضيف في: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**أُضيف في: v16.6.0**

ينشئ مثيلًا جديدًا لـ `TextEncoderStream`.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**أُضيف في: v16.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

التشفير الذي يدعمه مثيل `TextEncoderStream`.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**أُضيف في: v16.6.0**

- النوع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**أُضيف في: v16.6.0**

- النوع: [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

### الفئة: `TextDecoderStream` {#class-textdecoderstream}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذه الفئة معروضة الآن على الكائن العام. |
| v16.6.0 | أُضيف في: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**أُضيف في: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد `encoding` الذي يدعمه مثيل `TextDecoder` هذا. **الافتراضي:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كانت أخطاء فك التشفير قاتلة.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، سيقوم `TextDecoderStream` بتضمين علامة ترتيب البايت في النتيجة التي تم فك تشفيرها. عندما تكون `false`، ستتم إزالة علامة ترتيب البايت من الإخراج. يتم استخدام هذا الخيار فقط عندما يكون `encoding` هو `'utf-8'` أو `'utf-16be'` أو `'utf-16le'`. **الافتراضي:** `false`.
  
 

ينشئ مثيلًا جديدًا لـ `TextDecoderStream`.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**أُضيف في: v16.6.0**

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

التشفير الذي يدعمه مثيل `TextDecoderStream`.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**أُضيف في: v16.6.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون القيمة `true` إذا أدت أخطاء فك التشفير إلى طرح `TypeError`.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**تمت الإضافة في: v16.6.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ستكون القيمة `true` إذا كانت نتيجة فك التشفير ستتضمن علامة ترتيب البايت.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**تمت الإضافة في: v16.6.0**

- النوع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**تمت الإضافة في: v16.6.0**

- النوع: [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

### Class: `CompressionStream` {#class-compressionstream}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذا الصنف معروض الآن على الكائن العام. |
| v17.0.0 | تمت الإضافة في: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.2.0, v20.12.0 | يقبل الآن التنسيق قيمة `deflate-raw`. |
| v17.0.0 | تمت الإضافة في: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أحد الخيارات التالية: `'deflate'` أو `'deflate-raw'` أو `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**تمت الإضافة في: v17.0.0**

- النوع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**تمت الإضافة في: v17.0.0**

- النوع: [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

### Class: `DecompressionStream` {#class-decompressionstream}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | هذا الصنف معروض الآن على الكائن العام. |
| v17.0.0 | تمت الإضافة في: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v21.2.0, v20.12.0 | يقبل الآن التنسيق قيمة `deflate-raw`. |
| v17.0.0 | تمت الإضافة في: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أحد الخيارات التالية: `'deflate'` أو `'deflate-raw'` أو `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**تمت الإضافة في: v17.0.0**

- النوع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**تمت الإضافة في: v17.0.0**

- النوع: [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)


### مستهلكو الأداة المساعدة {#utility-consumers}

**أضيف في: v16.7.0**

توفر وظائف مستهلك الأداة المساعدة خيارات شائعة لاستهلاك التدفقات.

يتم الوصول إليها باستخدام:

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**أضيف في: v16.7.0**

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تحقق مع `ArrayBuffer` يحتوي على المحتويات الكاملة للتدفق.

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**أضيف في: v16.7.0**

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تحقق مع [\<Blob\>](/ar/nodejs/api/buffer#class-blob) يحتوي على المحتويات الكاملة للتدفق.

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**أضيف في:** v16.7.0

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) تحتوي على المحتويات الكاملة للدفق.

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**أضيف في:** v16.7.0

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تتحقق مع محتويات الدفق التي تم تحليلها كسلسلة بترميز UTF-8 والتي يتم تمريرها بعد ذلك عبر `JSON.parse()`.

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**أضيف في: الإصدار 16.7.0**

- `stream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- القيمة المعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم الوفاء بها بمحتويات التدفق التي تم تحليلها كسلسلة مرمزة بـ UTF-8.

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

