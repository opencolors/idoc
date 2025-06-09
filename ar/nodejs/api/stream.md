---
title: توثيق واجهة برمجة التطبيقات (API) لـ Stream في Node.js
description: توثيق مفصل لواجهة برمجة التطبيقات (API) لـ Stream في Node.js، يغطي التدفقات القابلة للقراءة، والقابلة للكتابة، والثنائية، والتحويل، بالإضافة إلى أساليبها، وأحداثها، وأمثلة الاستخدام.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات (API) لـ Stream في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثيق مفصل لواجهة برمجة التطبيقات (API) لـ Stream في Node.js، يغطي التدفقات القابلة للقراءة، والقابلة للكتابة، والثنائية، والتحويل، بالإضافة إلى أساليبها، وأحداثها، وأمثلة الاستخدام.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات (API) لـ Stream في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثيق مفصل لواجهة برمجة التطبيقات (API) لـ Stream في Node.js، يغطي التدفقات القابلة للقراءة، والقابلة للكتابة، والثنائية، والتحويل، بالإضافة إلى أساليبها، وأحداثها، وأمثلة الاستخدام.
---


# تدفق {#stream}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

التدفق هو واجهة مجردة للعمل مع بيانات البث في Node.js. توفر وحدة `node:stream` واجهة برمجة تطبيقات لتنفيذ واجهة التدفق.

هناك العديد من كائنات التدفق التي توفرها Node.js. على سبيل المثال، [طلب إلى خادم HTTP](/ar/nodejs/api/http#class-httpincomingmessage) و [`process.stdout`](/ar/nodejs/api/process#processstdout) كلاهما مثيلات للتدفق.

يمكن أن تكون التدفقات قابلة للقراءة أو قابلة للكتابة أو كليهما. جميع التدفقات هي مثيلات لـ [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter).

للوصول إلى وحدة `node:stream`:

```js [ESM]
const stream = require('node:stream');
```

تعتبر وحدة `node:stream` مفيدة لإنشاء أنواع جديدة من مثيلات التدفق. عادةً ما لا يكون من الضروري استخدام وحدة `node:stream` لاستهلاك التدفقات.

## تنظيم هذه الوثيقة {#organization-of-this-document}

تحتوي هذه الوثيقة على قسمين رئيسيين وقسم ثالث للملاحظات. يشرح القسم الأول كيفية استخدام التدفقات الموجودة داخل التطبيق. يشرح القسم الثاني كيفية إنشاء أنواع جديدة من التدفقات.

## أنواع التدفقات {#types-of-streams}

هناك أربعة أنواع أساسية من التدفقات داخل Node.js:

- [`Writable`](/ar/nodejs/api/stream#class-streamwritable): التدفقات التي يمكن كتابة البيانات إليها (على سبيل المثال، [`fs.createWriteStream()`](/ar/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/ar/nodejs/api/stream#class-streamreadable): التدفقات التي يمكن قراءة البيانات منها (على سبيل المثال، [`fs.createReadStream()`](/ar/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/ar/nodejs/api/stream#class-streamduplex): التدفقات التي تكون `قابلة للقراءة` و `قابلة للكتابة` (على سبيل المثال، [`net.Socket`](/ar/nodejs/api/net#class-netsocket)).
- [`Transform`](/ar/nodejs/api/stream#class-streamtransform): تدفقات `Duplex` التي يمكنها تعديل أو تحويل البيانات أثناء كتابتها وقراءتها (على سبيل المثال، [`zlib.createDeflate()`](/ar/nodejs/api/zlib#zlibcreatedeflateoptions)).

بالإضافة إلى ذلك، تتضمن هذه الوحدة وظائف الأداة المساعدة [`stream.duplexPair()`](/ar/nodejs/api/stream#streamduplexpairoptions) و [`stream.pipeline()`](/ar/nodejs/api/stream#streampipelinesource-transforms-destination-callback) و [`stream.finished()`](/ar/nodejs/api/stream#streamfinishedstream-options-callback) و [`stream.Readable.from()`](/ar/nodejs/api/stream#streamreadablefromiterable-options) و [`stream.addAbortSignal()`](/ar/nodejs/api/stream#streamaddabortsignalsignal-stream).


### واجهات برمجة تطبيقات التدفقات والوعود {#streams-promises-api}

**أضيف في: v15.0.0**

توفر واجهة برمجة تطبيقات `stream/promises` مجموعة بديلة من وظائف الأداة غير المتزامنة للتدفقات التي تُرجع كائنات `Promise` بدلاً من استخدام عمليات الاسترجاع. يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('node:stream/promises')` أو `require('node:stream').promises`.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0، v17.2.0، v16.14.0 | أضف الخيار `end`، والذي يمكن تعيينه على `false` لمنع إغلاق تدفق الوجهة تلقائيًا عند انتهاء المصدر. |
| v15.0.0 | أضيف في: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/ar/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات خط الأنابيب
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إنهاء تدفق الوجهة عند انتهاء تدفق المصدر. يتم دائمًا إنهاء تدفقات التحويل، حتى إذا كانت هذه القيمة `false`. **افتراضي:** `true`.
  
 
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتحقق عند اكتمال خط الأنابيب.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('تمت عملية خط الأنابيب بنجاح.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('تمت عملية خط الأنابيب بنجاح.');
```
:::

لاستخدام `AbortSignal`، مررها داخل كائن خيارات، كآخر وسيطة. عند إجهاض الإشارة، سيتم استدعاء `destroy` على خط الأنابيب الأساسي، مع `AbortError`.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

تدعم واجهة برمجة تطبيقات `pipeline` أيضًا مولدات غير متزامنة:



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // العمل مع السلاسل بدلاً من `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('تمت عملية خط الأنابيب بنجاح.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // العمل مع السلاسل بدلاً من `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('تمت عملية خط الأنابيب بنجاح.');
```
:::

تذكر التعامل مع وسيطة `signal` التي تم تمريرها إلى المولد غير المتزامن. خاصة في الحالة التي يكون فيها المولد غير المتزامن هو مصدر خط الأنابيب (أي الوسيطة الأولى) أو أن خط الأنابيب لن يكتمل أبدًا.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('تمت عملية خط الأنابيب بنجاح.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('تمت عملية خط الأنابيب بنجاح.');
```
:::

توفر واجهة برمجة تطبيقات `pipeline` [إصدار الاسترجاع](/ar/nodejs/api/stream#streampipelinesource-transforms-destination-callback):


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v19.5.0, v18.14.0 | تمت إضافة دعم لـ `ReadableStream` و `WritableStream`. |
| الإصدار v19.1.0, v18.13.0 | تمت إضافة خيار `cleanup`. |
| الإصدار v15.0.0 | تمت الإضافة في: v15.0.0 |
:::

- `stream` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) دفق/دفق ويب قابل للقراءة و/أو الكتابة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إذا كانت `true`، فستزيل المستمعين الذين سجلتهم هذه الوظيفة قبل استيفاء الوعد. **الافتراضي:** `false`.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يتم الاستيفاء عندما لا يعود الدفق قابلاً للقراءة أو الكتابة.



::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('تم الانتهاء من قراءة الدفق.');
}

run().catch(console.error);
rs.resume(); // استنزاف الدفق.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('تم الانتهاء من قراءة الدفق.');
}

run().catch(console.error);
rs.resume(); // استنزاف الدفق.
```
:::

توفر واجهة برمجة التطبيقات `finished` أيضًا [إصدار رد الاتصال](/ar/nodejs/api/stream#streamfinishedstream-options-callback).

يترك `stream.finished()` مستمعي الأحداث المتدلية (خاصةً `'error'` و `'end'` و `'finish'` و `'close'`) بعد حل الوعد المرجعي أو رفضه. السبب في ذلك هو أن أحداث `'error'` غير المتوقعة (بسبب تطبيقات الدفق غير الصحيحة) لا تتسبب في أعطال غير متوقعة. إذا كان هذا السلوك غير مرغوب فيه، فيجب تعيين `options.cleanup` إلى `true`:

```js [ESM]
await finished(rs, { cleanup: true });
```

### وضع الكائن {#object-mode}

تعمل جميع التدفقات التي تم إنشاؤها بواسطة واجهات برمجة تطبيقات Node.js حصريًا على السلاسل، و [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)، و [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) و [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView):

- `Strings` و `Buffers` هما النوعان الأكثر شيوعًا المستخدمان مع التدفقات.
- تتيح لك `TypedArray` و `DataView` معالجة البيانات الثنائية بأنواع مثل `Int32Array` أو `Uint8Array`. عند كتابة TypedArray أو DataView إلى تدفق، تعالج Node.js البايتات الخام.

ومع ذلك، من الممكن لتطبيقات التدفق العمل مع أنواع أخرى من قيم JavaScript (باستثناء `null`، الذي يخدم غرضًا خاصًا داخل التدفقات). تعتبر هذه التدفقات تعمل في "وضع الكائن".

يتم تبديل مثيلات التدفق إلى وضع الكائن باستخدام خيار `objectMode` عند إنشاء التدفق. محاولة تبديل تدفق موجود إلى وضع الكائن ليس آمنًا.

### التخزين المؤقت {#buffering}

ستقوم كل من تدفقات [`Writable`](/ar/nodejs/api/stream#class-streamwritable) و [`Readable`](/ar/nodejs/api/stream#class-streamreadable) بتخزين البيانات في مخزن مؤقت داخلي.

يعتمد مقدار البيانات التي يمكن تخزينها مؤقتًا على خيار `highWaterMark` الذي تم تمريره إلى مُنشئ التدفق. بالنسبة للتدفقات العادية، يحدد خيار `highWaterMark` [إجمالي عدد البايتات](/ar/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding). بالنسبة للتدفقات التي تعمل في وضع الكائن، يحدد `highWaterMark` إجمالي عدد الكائنات. بالنسبة للتدفقات التي تعمل على السلاسل (ولكنها لا تفك تشفيرها)، يحدد `highWaterMark` إجمالي عدد وحدات كود UTF-16.

يتم تخزين البيانات مؤقتًا في تدفقات `Readable` عندما يستدعي التطبيق [`stream.push(chunk)`](/ar/nodejs/api/stream#readablepushchunk-encoding). إذا لم يستدعِ مستهلك التدفق [`stream.read()`](/ar/nodejs/api/stream#readablereadsize)، فستبقى البيانات في قائمة الانتظار الداخلية حتى يتم استهلاكها.

بمجرد أن يصل الحجم الإجمالي لمخزن القراءة الداخلي إلى العتبة المحددة بواسطة `highWaterMark`، سيتوقف التدفق مؤقتًا عن قراءة البيانات من المورد الأساسي حتى يتم استهلاك البيانات المخزنة مؤقتًا حاليًا (أي أن التدفق سيتوقف عن استدعاء طريقة [`readable._read()`](/ar/nodejs/api/stream#readable_readsize) الداخلية المستخدمة لملء مخزن القراءة).

يتم تخزين البيانات مؤقتًا في تدفقات `Writable` عند استدعاء طريقة [`writable.write(chunk)`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) بشكل متكرر. بينما يكون الحجم الإجمالي لمخزن الكتابة الداخلي أقل من العتبة التي تم تعيينها بواسطة `highWaterMark`، ستعيد استدعاءات `writable.write()` القيمة `true`. بمجرد أن يصل حجم المخزن الداخلي إلى `highWaterMark` أو يتجاوزه، سيتم إرجاع `false`.

الهدف الرئيسي من واجهة برمجة تطبيقات `stream`، وخاصة طريقة [`stream.pipe()`](/ar/nodejs/api/stream#readablepipedestination-options)، هو الحد من تخزين البيانات مؤقتًا إلى مستويات مقبولة بحيث لا تطغى المصادر والوجهات ذات السرعات المختلفة على الذاكرة المتاحة.

خيار `highWaterMark` هو عتبة، وليس حدًا: فهو يحدد مقدار البيانات التي يخزنها التدفق مؤقتًا قبل أن يتوقف عن طلب المزيد من البيانات. إنه لا يفرض قيودًا صارمة على الذاكرة بشكل عام. قد تختار تطبيقات تدفق معينة فرض حدود أكثر صرامة ولكن القيام بذلك اختياري.

نظرًا لأن تدفقات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) و [`Transform`](/ar/nodejs/api/stream#class-streamtransform) هي كل من `Readable` و `Writable`، فإن كل منهما يحتفظ بمخزنين داخليين منفصلين *اثنين* يستخدمان للقراءة والكتابة، مما يسمح لكل جانب بالعمل بشكل مستقل عن الآخر مع الحفاظ على تدفق مناسب وفعال للبيانات. على سبيل المثال، مثيلات [`net.Socket`](/ar/nodejs/api/net#class-netsocket) هي تدفقات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) التي يسمح جانبها `Readable` باستهلاك البيانات المستلمة *من* المقبس ويسمح جانبها `Writable` بكتابة البيانات *إلى* المقبس. نظرًا لأنه يمكن كتابة البيانات إلى المقبس بمعدل أسرع أو أبطأ من معدل استقبال البيانات، يجب أن يعمل كل جانب (ويخزن) بشكل مستقل عن الآخر.

تعتبر آليات التخزين المؤقت الداخلية تفصيلاً للتطبيق الداخلي ويمكن تغييرها في أي وقت. ومع ذلك، بالنسبة لبعض التطبيقات المتقدمة، يمكن استرداد المخازن المؤقتة الداخلية باستخدام `writable.writableBuffer` أو `readable.readableBuffer`. يُنصح بعدم استخدام هذه الخصائص غير الموثقة.


## واجهة برمجة التطبيقات لمستهلكي التدفق {#api-for-stream-consumers}

تستخدم جميع تطبيقات Node.js تقريبًا، بغض النظر عن مدى بساطتها، التدفقات بطريقة ما. فيما يلي مثال على استخدام التدفقات في تطبيق Node.js ينفذ خادم HTTP:

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` هو http.IncomingMessage، وهو تدفق قابل للقراءة.
  // `res` هو http.ServerResponse، وهو تدفق قابل للكتابة.

  let body = '';
  // احصل على البيانات كسلاسل utf8.
  // إذا لم يتم تعيين ترميز، فسيتم استلام كائنات Buffer.
  req.setEncoding('utf8');

  // تصدر التدفقات القابلة للقراءة أحداث 'data' بمجرد إضافة مستمع.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // يشير حدث 'end' إلى استلام النص الكامل.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // أعد كتابة شيء مثير للاهتمام للمستخدم:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // أوه أوه! JSON سيئ!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```
تعرض التدفقات [`Writable`](/ar/nodejs/api/stream#class-streamwritable) (مثل `res` في المثال) طرقًا مثل `write()` و `end()` التي تُستخدم لكتابة البيانات على التدفق.

تستخدم التدفقات [`Readable`](/ar/nodejs/api/stream#class-streamreadable) واجهة برمجة التطبيقات [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter) لإعلام كود التطبيق عندما تكون البيانات متاحة للقراءة من التدفق. يمكن قراءة هذه البيانات المتاحة من التدفق بعدة طرق.

تستخدم التدفقات [`Writable`](/ar/nodejs/api/stream#class-streamwritable) و [`Readable`](/ar/nodejs/api/stream#class-streamreadable) واجهة برمجة التطبيقات [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter) بطرق مختلفة لتوصيل الحالة الحالية للتدفق.

التدفقات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) و [`Transform`](/ar/nodejs/api/stream#class-streamtransform) هي كل من [`Writable`](/ar/nodejs/api/stream#class-streamwritable) و [`Readable`](/ar/nodejs/api/stream#class-streamreadable).

لا يُطلب من التطبيقات التي تكتب البيانات إلى تدفق أو تستهلك البيانات منه تنفيذ واجهات التدفق مباشرةً ولن يكون لديها عمومًا أي سبب للاتصال بـ `require('node:stream')`.

يجب على المطورين الذين يرغبون في تنفيذ أنواع جديدة من التدفقات الرجوع إلى القسم [واجهة برمجة التطبيقات لمطوري التدفق](/ar/nodejs/api/stream#api-for-stream-implementers).


### تيارات قابلة للكتابة {#writable-streams}

تمثل التيارات القابلة للكتابة تجريدًا *لجهة* يتم كتابة البيانات إليها.

تتضمن أمثلة [`Writable`](/ar/nodejs/api/stream#class-streamwritable) تيارات ما يلي:

- [طلبات HTTP، على العميل](/ar/nodejs/api/http#class-httpclientrequest)
- [استجابات HTTP، على الخادم](/ar/nodejs/api/http#class-httpserverresponse)
- [تيارات كتابة fs](/ar/nodejs/api/fs#class-fswritestream)
- [تيارات zlib](/ar/nodejs/api/zlib)
- [تيارات التشفير](/ar/nodejs/api/crypto)
- [مآخذ توصيل TCP](/ar/nodejs/api/net#class-netsocket)
- [stdin لعملية فرعية](/ar/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/ar/nodejs/api/process#processstdout)، [`process.stderr`](/ar/nodejs/api/process#processstderr)

بعض هذه الأمثلة هي في الواقع تيارات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) تنفذ واجهة [`Writable`](/ar/nodejs/api/stream#class-streamwritable).

جميع [`Writable`](/ar/nodejs/api/stream#class-streamwritable) تيارات تنفذ الواجهة المحددة بواسطة فئة `stream.Writable`.

في حين أن الحالات المحددة لـ [`Writable`](/ar/nodejs/api/stream#class-streamwritable) قد تختلف بطرق مختلفة، فإن جميع تيارات `Writable` تتبع نفس نمط الاستخدام الأساسي كما هو موضح في المثال أدناه:

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### الفئة: `stream.Writable` {#class-streamwritable}

**تمت الإضافة في: الإصدار 0.9.4**

##### الحدث: `'close'` {#event-close}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | إضافة خيار `emitClose` لتحديد ما إذا كان سيتم إصدار `'close'` عند التدمير. |
| v0.9.4 | تمت الإضافة في: الإصدار 0.9.4 |
:::

يتم إصدار الحدث `'close'` عندما يتم إغلاق التدفق وأي من موارده الأساسية (واصف ملف، على سبيل المثال). يشير الحدث إلى أنه لن يتم إصدار المزيد من الأحداث، ولن يتم إجراء أي حسابات أخرى.

سيصدر تيار [`Writable`](/ar/nodejs/api/stream#class-streamwritable) دائمًا الحدث `'close'` إذا تم إنشاؤه باستخدام الخيار `emitClose`.

##### الحدث: `'drain'` {#event-drain}

**تمت الإضافة في: الإصدار 0.9.4**

إذا كانت المكالمة إلى [`stream.write(chunk)`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) تُرجع `false`، فسيتم إصدار الحدث `'drain'` عندما يكون من المناسب استئناف كتابة البيانات إلى التيار.

```js [ESM]
// كتابة البيانات إلى التدفق القابل للكتابة المقدم مليون مرة.
// كن منتبهًا للضغط الخلفي.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // آخر مرة!
        writer.write(data, encoding, callback);
      } else {
        // تحقق مما إذا كان يجب أن نستمر، أو ننتظر.
        // لا تمرر رد الاتصال، لأننا لم ننته بعد.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // اضطررت إلى التوقف مبكرًا!
      // اكتب المزيد بمجرد أن يستنزف.
      writer.once('drain', write);
    }
  }
}
```

##### الحدث: `'error'` {#event-error}

**تمت إضافته في: الإصدار v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إطلاق الحدث `'error'` إذا حدث خطأ أثناء كتابة البيانات أو تمريرها عبر الأنابيب. يتم تمرير وسيطة `Error` واحدة إلى رد الاتصال الخاص بالمستمع عند استدعائه.

يتم إغلاق الدفق عندما يتم إطلاق الحدث `'error'` ما لم يتم تعيين الخيار [`autoDestroy`](/ar/nodejs/api/stream#new-streamwritableoptions) على `false` عند إنشاء الدفق.

بعد `'error'`، *لا ينبغي* إطلاق أي أحداث أخرى غير `'close'` (بما في ذلك أحداث `'error'`).

##### الحدث: `'finish'` {#event-finish}

**تمت إضافته في: الإصدار v0.9.4**

يتم إطلاق الحدث `'finish'` بعد استدعاء الطريقة [`stream.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback)، ويتم تدفق جميع البيانات إلى النظام الأساسي.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### الحدث: `'pipe'` {#event-pipe}

**تمت إضافته في: الإصدار v0.9.4**

- `src` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) دفق المصدر الذي يتم تمريره عبر الأنابيب إلى هذا الكائن القابل للكتابة

يتم إطلاق الحدث `'pipe'` عند استدعاء الطريقة [`stream.pipe()`](/ar/nodejs/api/stream#readablepipedestination-options) على دفق قابل للقراءة، وإضافة هذا الكائن القابل للكتابة إلى مجموعة الوجهات الخاصة به.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### الحدث: `'unpipe'` {#event-unpipe}

**تمت إضافته في: الإصدار v0.9.4**

- `src` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) دفق المصدر الذي قام [بإلغاء تمرير](/ar/nodejs/api/stream#readableunpipedestination) هذا الكائن القابل للكتابة

يتم إطلاق الحدث `'unpipe'` عند استدعاء الطريقة [`stream.unpipe()`](/ar/nodejs/api/stream#readableunpipedestination) على دفق [`Readable`](/ar/nodejs/api/stream#class-streamreadable)، مما يؤدي إلى إزالة هذا [`Writable`](/ar/nodejs/api/stream#class-streamwritable) من مجموعة الوجهات الخاصة به.

يتم إطلاقه أيضًا في حالة إطلاق دفق [`Writable`](/ar/nodejs/api/stream#class-streamwritable) هذا لخطأ عندما يتم تمرير دفق [`Readable`](/ar/nodejs/api/stream#class-streamreadable) إليه.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**أُضيف في: v0.11.2**

تجبر طريقة `writable.cork()` جميع البيانات المكتوبة على التخزين المؤقت في الذاكرة. سيتم تفريغ البيانات المخزنة مؤقتًا عند استدعاء إحدى الطريقتين [`stream.uncork()`](/ar/nodejs/api/stream#writableuncork) أو [`stream.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback).

الهدف الأساسي من `writable.cork()` هو استيعاب حالة يتم فيها كتابة عدة أجزاء صغيرة إلى التدفق بتتابع سريع. بدلاً من إرسالها على الفور إلى الوجهة الأساسية، تقوم `writable.cork()` بتخزين جميع الأجزاء مؤقتًا حتى يتم استدعاء `writable.uncork()`، والتي ستمررها جميعًا إلى `writable._writev()`، إذا كانت موجودة. هذا يمنع حالة حظر بداية الخط حيث يتم تخزين البيانات مؤقتًا أثناء انتظار معالجة الجزء الصغير الأول. ومع ذلك، قد يكون لاستخدام `writable.cork()` دون تنفيذ `writable._writev()` تأثير سلبي على الإنتاجية.

انظر أيضًا: [`writable.uncork()`](/ar/nodejs/api/stream#writableuncork), [`writable._writev()`](/ar/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | تعمل كعملية لا تفعل شيئًا على تدفق تم تدميره بالفعل. |
| v8.0.0 | أُضيف في: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) اختياري، خطأ لإصداره مع حدث `'error'`.
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يدمر التدفق. يصدر اختياريًا حدث `'error'`، ويصدر حدث `'close'` (إلا إذا تم تعيين `emitClose` على `false`). بعد هذا الاستدعاء، يكون تدفق الكتابة قد انتهى وستؤدي الاستدعاءات اللاحقة لـ `write()` أو `end()` إلى حدوث خطأ `ERR_STREAM_DESTROYED`. هذه طريقة مدمرة وفورية لتدمير التدفق. قد لا تكون الاستدعاءات السابقة لـ `write()` قد استنزفت، وقد تؤدي إلى حدوث خطأ `ERR_STREAM_DESTROYED`. استخدم `end()` بدلاً من destroy إذا كان يجب تفريغ البيانات قبل الإغلاق، أو انتظر حدث `'drain'` قبل تدمير التدفق.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
بمجرد استدعاء `destroy()`، ستكون أي استدعاءات أخرى عملية لا تفعل شيئًا ولن يتم إصدار أي أخطاء أخرى باستثناء `_destroy()` كـ `'error'`.

يجب على المنفذين عدم تجاوز هذه الطريقة، ولكن بدلاً من ذلك تنفيذ [`writable._destroy()`](/ar/nodejs/api/stream#writable_destroyerr-callback).


##### `writable.closed` {#writableclosed}

**تمت الإضافة في: الإصدار 18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون القيمة `true` بعد إطلاق `'close'`.

##### `writable.destroyed` {#writabledestroyed}

**تمت الإضافة في: الإصدار 8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون القيمة `true` بعد استدعاء [`writable.destroy()`](/ar/nodejs/api/stream#writabledestroyerror).

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | يمكن أن تكون وسيطة `chunk` الآن مثيلاً لـ `TypedArray` أو `DataView`. |
| v15.0.0 | يتم استدعاء `callback` قبل 'finish' أو عند حدوث خطأ. |
| v14.0.0 | يتم استدعاء `callback` إذا تم إطلاق 'finish' أو 'error'. |
| v10.0.0 | تُرجع هذه الطريقة الآن مرجعًا إلى `writable`. |
| v8.0.0 | يمكن أن تكون وسيطة `chunk` الآن مثيلاً لـ `Uint8Array`. |
| v0.9.4 | تمت الإضافة في: الإصدار v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) بيانات اختيارية للكتابة. بالنسبة للتدفقات التي لا تعمل في وضع الكائن، يجب أن يكون `chunk` عبارة عن [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). بالنسبة لتدفقات وضع الكائن، يمكن أن تكون `chunk` أي قيمة JavaScript بخلاف `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز إذا كان `chunk` عبارة عن سلسلة
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد نداء عند انتهاء التدفق.
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يُشير استدعاء الطريقة `writable.end()` إلى أنه لن يتم كتابة المزيد من البيانات إلى [`Writable`](/ar/nodejs/api/stream#class-streamwritable). تسمح وسيطات `chunk` و `encoding` الاختيارية بكتابة جزء إضافي أخير من البيانات مباشرة قبل إغلاق التدفق.

سيؤدي استدعاء الطريقة [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) بعد استدعاء [`stream.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback) إلى ظهور خطأ.

```js [ESM]
// اكتب 'hello, ' ثم انهِ بـ 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// الكتابة أكثر الآن غير مسموح بها!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v6.1.0 | تُرجع هذه الطريقة الآن مرجعًا إلى `writable`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز الافتراضي الجديد
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

تقوم الطريقة `writable.setDefaultEncoding()` بتعيين `encoding` الافتراضي لتدفق [`Writable`](/ar/nodejs/api/stream#class-streamwritable).

##### `writable.uncork()` {#writableuncork}

**تمت الإضافة في: v0.11.2**

تقوم الطريقة `writable.uncork()` بتفريغ جميع البيانات المخزنة مؤقتًا منذ استدعاء [`stream.cork()`](/ar/nodejs/api/stream#writablecork).

عند استخدام [`writable.cork()`](/ar/nodejs/api/stream#writablecork) و `writable.uncork()` لإدارة تخزين الكتابات مؤقتًا في تدفق، قم بتأجيل استدعاءات `writable.uncork()` باستخدام `process.nextTick()`. يسمح القيام بذلك بتجميع جميع استدعاءات `writable.write()` التي تحدث ضمن مرحلة حلقة أحداث Node.js معينة.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
إذا تم استدعاء الطريقة [`writable.cork()`](/ar/nodejs/api/stream#writablecork) عدة مرات على تدفق، فيجب استدعاء نفس عدد استدعاءات `writable.uncork()` لتفريغ البيانات المخزنة مؤقتًا.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // لن يتم تفريغ البيانات حتى يتم استدعاء uncork() للمرة الثانية.
  stream.uncork();
});
```
انظر أيضًا: [`writable.cork()`](/ar/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**تمت الإضافة في: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` إذا كان من الآمن استدعاء [`writable.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback)، مما يعني أن التدفق لم يتم تدميره أو حدوث خطأ فيه أو انتهى.

##### `writable.writableAborted` {#writablewritableaborted}

**تمت الإضافة في: v18.0.0, v16.17.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يُرجع ما إذا كان التدفق قد تم تدميره أو حدث خطأ فيه قبل إصدار `'finish'`.


##### `writable.writableEnded` {#writablewritableended}

**أضيف في: الإصدار v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` بعد استدعاء [`writable.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback). لا يشير هذا الخاصية ما إذا كانت البيانات قد تم تفريغها، للاستعلام عن ذلك استخدم [`writable.writableFinished`](/ar/nodejs/api/stream#writablewritablefinished) بدلاً من ذلك.

##### `writable.writableCorked` {#writablewritablecorked}

**أضيف في: الإصدار v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

عدد المرات التي يجب فيها استدعاء [`writable.uncork()`](/ar/nodejs/api/stream#writableuncork) لفك قفل التدفق بالكامل.

##### `writable.errored` {#writableerrored}

**أضيف في: الإصدار v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

إرجاع خطأ إذا تم تدمير التدفق بسبب خطأ.

##### `writable.writableFinished` {#writablewritablefinished}

**أضيف في: الإصدار v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتم تعيينها إلى `true` مباشرة قبل إطلاق حدث [`'finish'`](/ar/nodejs/api/stream#event-finish).

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**أضيف في: الإصدار v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع قيمة `highWaterMark` التي تم تمريرها عند إنشاء هذا `Writable`.

##### `writable.writableLength` {#writablewritablelength}

**أضيف في: الإصدار v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تحتوي هذه الخاصية على عدد البايتات (أو الكائنات) في قائمة الانتظار الجاهزة للكتابة. توفر القيمة بيانات استبطانية فيما يتعلق بحالة `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**أضيف في: الإصدار v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون `true` إذا كانت ذاكرة التخزين المؤقتة للتدفق ممتلئة وسيطلق التدفق `'drain'`.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**أضيف في: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

جالب للخاصية `objectMode` لتدفق `Writable` معين.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**أضيف في: v22.4.0, v20.16.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`writable.destroy()`](/ar/nodejs/api/stream#writabledestroyerror) مع `AbortError` ويعيد وعدًا يتحقق عند انتهاء التدفق.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | يمكن أن تكون وسيطة `chunk` الآن مثيل `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن تكون وسيطة `chunk` الآن مثيل `Uint8Array`. |
| v6.0.0 | تمرير `null` كوسيطة `chunk` سيُعتبر دائمًا غير صالح الآن، حتى في وضع الكائنات. |
| v0.9.4 | أضيف في: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) بيانات اختيارية للكتابة. بالنسبة للتدفقات التي لا تعمل في وضع الكائنات، يجب أن يكون `chunk` عبارة عن [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). بالنسبة لتدفقات وضع الكائنات، يمكن أن تكون `chunk` أي قيمة JavaScript أخرى غير `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) الترميز، إذا كانت `chunk` سلسلة نصية. **الافتراضي:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) رد نداء عند تدفق هذه الكتلة من البيانات.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` إذا كان التدفق يرغب في أن ينتظر الكود المستدعي حتى يتم إصدار الحدث `'drain'` قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

تكتب الطريقة `writable.write()` بعض البيانات إلى التدفق، وتستدعي `callback` المقدمة بمجرد التعامل مع البيانات بالكامل. إذا حدث خطأ، سيتم استدعاء `callback` مع الخطأ كوسيطتها الأولى. يتم استدعاء `callback` بشكل غير متزامن وقبل إصدار `'error'`.

القيمة المرجعة هي `true` إذا كان المخزن المؤقت الداخلي أقل من `highWaterMark` الذي تم تكوينه عند إنشاء التدفق بعد قبول `chunk`. إذا تم إرجاع `false`، فيجب إيقاف المزيد من محاولات كتابة البيانات إلى التدفق حتى يتم إصدار الحدث [`'drain'`](/ar/nodejs/api/stream#event-drain).

بينما لا يتم استنزاف التدفق، ستقوم استدعاءات `write()` بتخزين `chunk` مؤقتًا، وإرجاع false. بمجرد استنزاف جميع الكتل المخزنة مؤقتًا حاليًا (المقبولة للتسليم بواسطة نظام التشغيل)، سيتم إصدار الحدث `'drain'`. بمجرد أن تعيد `write()` قيمة false، لا تكتب المزيد من الكتل حتى يتم إصدار الحدث `'drain'`. في حين أنه مسموح باستدعاء `write()` على تدفق لا يتم استنزافه، سيقوم Node.js بتخزين جميع الكتل المكتوبة مؤقتًا حتى يحدث الحد الأقصى لاستخدام الذاكرة، وعند هذه النقطة سيتم الإجهاض بشكل غير مشروط. حتى قبل أن يتم الإجهاض، سيؤدي ارتفاع استخدام الذاكرة إلى ضعف أداء جامع البيانات المهملة وارتفاع RSS (الذي لا يتم إعادته عادةً إلى النظام، حتى بعد عدم الحاجة إلى الذاكرة). نظرًا لأن مقابس TCP قد لا يتم استنزافها أبدًا إذا لم يقرأ النظير البعيد البيانات، فإن كتابة مقبس لا يتم استنزافه قد يؤدي إلى ثغرة أمنية قابلة للاستغلال عن بُعد.

تعد كتابة البيانات أثناء عدم استنزاف التدفق إشكالية بشكل خاص بالنسبة إلى [`Transform`](/ar/nodejs/api/stream#class-streamtransform)، لأن تدفقات `Transform` يتم إيقافها مؤقتًا افتراضيًا حتى يتم توجيهها أو إضافة معالج أحداث `'data'` أو `'readable'`.

إذا كان من الممكن إنشاء البيانات المراد كتابتها أو جلبها حسب الطلب، فمن المستحسن تضمين المنطق في [`Readable`](/ar/nodejs/api/stream#class-streamreadable) واستخدام [`stream.pipe()`](/ar/nodejs/api/stream#readablepipedestination-options). ومع ذلك، إذا كان استدعاء `write()` مفضلاً، فمن الممكن احترام الضغط الخلفي وتجنب مشكلات الذاكرة باستخدام الحدث [`'drain'`](/ar/nodejs/api/stream#event-drain):

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// انتظر حتى يتم استدعاء cb قبل إجراء أي كتابة أخرى.
write('hello', () => {
  console.log('اكتملت الكتابة، قم بإجراء المزيد من عمليات الكتابة الآن.');
});
```
سيتجاهل تدفق `Writable` في وضع الكائنات دائمًا وسيطة `encoding`.


### تيارات قابلة للقراءة {#readable-streams}

التيارات القابلة للقراءة هي تجريد لـ *مصدر* يتم استهلاك البيانات منه.

تشمل أمثلة تيارات `Readable`:

- [استجابات HTTP، على العميل](/ar/nodejs/api/http#class-httpincomingmessage)
- [طلبات HTTP، على الخادم](/ar/nodejs/api/http#class-httpincomingmessage)
- [تيارات القراءة في نظام الملفات (fs)](/ar/nodejs/api/fs#class-fsreadstream)
- [تيارات zlib](/ar/nodejs/api/zlib)
- [تيارات التشفير](/ar/nodejs/api/crypto)
- [مآخذ TCP](/ar/nodejs/api/net#class-netsocket)
- [stdout و stderr للعملية الفرعية](/ar/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/ar/nodejs/api/process#processstdin)

جميع تيارات [`Readable`](/ar/nodejs/api/stream#class-streamreadable) تنفذ الواجهة التي تحددها الفئة `stream.Readable`.

#### وضعان للقراءة {#two-reading-modes}

تعمل تيارات `Readable` بشكل فعال في أحد وضعين: التدفق والإيقاف المؤقت. هذان الوضعان منفصلان عن [وضع الكائن](/ar/nodejs/api/stream#object-mode). يمكن أن يكون تيار [`Readable`](/ar/nodejs/api/stream#class-streamreadable) في وضع الكائن أو لا، بغض النظر عما إذا كان في وضع التدفق أو وضع الإيقاف المؤقت.

- في وضع التدفق، تتم قراءة البيانات من النظام الأساسي تلقائيًا وتزويد التطبيق بها في أسرع وقت ممكن باستخدام الأحداث عبر واجهة [`EventEmitter`](/ar/nodejs/api/events#class-eventemitter).
- في وضع الإيقاف المؤقت، يجب استدعاء الطريقة [`stream.read()`](/ar/nodejs/api/stream#readablereadsize) بشكل صريح لقراءة أجزاء من البيانات من التيار.

تبدأ جميع تيارات [`Readable`](/ar/nodejs/api/stream#class-streamreadable) في وضع الإيقاف المؤقت ولكن يمكن تحويلها إلى وضع التدفق بإحدى الطرق التالية:

- إضافة معالج حدث [`'data'`](/ar/nodejs/api/stream#event-data).
- استدعاء الطريقة [`stream.resume()`](/ar/nodejs/api/stream#readableresume).
- استدعاء الطريقة [`stream.pipe()`](/ar/nodejs/api/stream#readablepipedestination-options) لإرسال البيانات إلى [`Writable`](/ar/nodejs/api/stream#class-streamwritable).

يمكن لـ `Readable` العودة إلى وضع الإيقاف المؤقت باستخدام أحد الإجراءات التالية:

- إذا لم تكن هناك وجهات نقل، عن طريق استدعاء الطريقة [`stream.pause()`](/ar/nodejs/api/stream#readablepause).
- إذا كانت هناك وجهات نقل، عن طريق إزالة جميع وجهات النقل. يمكن إزالة وجهات نقل متعددة عن طريق استدعاء الطريقة [`stream.unpipe()`](/ar/nodejs/api/stream#readableunpipedestination).

المفهوم المهم الذي يجب تذكره هو أن `Readable` لن ينشئ بيانات حتى يتم توفير آلية إما لاستهلاك هذه البيانات أو تجاهلها. إذا تم تعطيل آلية الاستهلاك أو إزالتها، فستحاول `Readable` *إيقاف* إنشاء البيانات.

لأسباب تتعلق بالتوافق مع الإصدارات السابقة، فإن إزالة معالجات حدث [`'data'`](/ar/nodejs/api/stream#event-data) **لن** توقف التيار مؤقتًا تلقائيًا. أيضًا، إذا كانت هناك وجهات نقل، فإن استدعاء [`stream.pause()`](/ar/nodejs/api/stream#readablepause) لن يضمن أن التيار *سيظل* متوقفًا مؤقتًا بمجرد أن تستنزف هذه الوجهات وتطلب المزيد من البيانات.

إذا تم تبديل [`Readable`](/ar/nodejs/api/stream#class-streamreadable) إلى وضع التدفق ولم يكن هناك مستهلكون متاحون للتعامل مع البيانات، فستفقد هذه البيانات. يمكن أن يحدث هذا، على سبيل المثال، عند استدعاء الطريقة `readable.resume()` بدون إرفاق مستمع بحدث `'data'`، أو عند إزالة معالج حدث `'data'` من التيار.

تؤدي إضافة معالج حدث [`'readable'`](/ar/nodejs/api/stream#event-readable) تلقائيًا إلى توقف التيار عن التدفق، ويجب استهلاك البيانات عبر [`readable.read()`](/ar/nodejs/api/stream#readablereadsize). إذا تمت إزالة معالج حدث [`'readable'`](/ar/nodejs/api/stream#event-readable)، فسيبدأ التيار في التدفق مرة أخرى إذا كان هناك معالج حدث [`'data'`](/ar/nodejs/api/stream#event-data).


#### ثلاث حالات {#three-states}

يعد "الوضعان" للتشغيل في دفق `Readable` بمثابة تجريد مبسط لإدارة الحالة الداخلية الأكثر تعقيدًا التي تحدث داخل تنفيذ دفق `Readable`.

على وجه التحديد، في أي نقطة زمنية معينة، يكون كل `Readable` في واحدة من ثلاث حالات ممكنة:

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

عندما يكون `readable.readableFlowing` هو `null`، لا توجد آلية لاستهلاك بيانات الدفق. لذلك، لن يقوم الدفق بإنشاء بيانات. أثناء وجوده في هذه الحالة، سيؤدي إرفاق مستمع لحدث `'data'` أو استدعاء طريقة `readable.pipe()` أو استدعاء طريقة `readable.resume()` إلى تبديل `readable.readableFlowing` إلى `true`، مما يتسبب في بدء `Readable` في إصدار الأحداث بنشاط عند إنشاء البيانات.

سيؤدي استدعاء `readable.pause()` أو `readable.unpipe()` أو تلقي ضغط خلفي إلى تعيين `readable.readableFlowing` على أنه `false`، مما يؤدي إلى إيقاف تدفق الأحداث مؤقتًا ولكن *ليس* إيقاف إنشاء البيانات. أثناء وجوده في هذه الحالة، لن يؤدي إرفاق مستمع لحدث `'data'` إلى تبديل `readable.readableFlowing` إلى `true`.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing is now false.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing is still false.
pass.write('ok');  // Will not emit 'data'.
pass.resume();     // Must be called to make stream emit 'data'.
// readableFlowing is now true.
```
بينما `readable.readableFlowing` هو `false`، قد تتراكم البيانات داخل المخزن المؤقت الداخلي للدفق.

#### اختر نمط واجهة برمجة تطبيقات واحد {#choose-one-api-style}

تطورت واجهة برمجة تطبيقات `Readable` stream عبر إصدارات Node.js المتعددة وتوفر طرقًا متعددة لاستهلاك بيانات الدفق. بشكل عام، يجب على المطورين اختيار *إحدى* طرق استهلاك البيانات و *يجب ألا* يستخدموا أبدًا طرقًا متعددة لاستهلاك البيانات من دفق واحد. على وجه التحديد، قد يؤدي استخدام مجموعة من `on('data')` أو `on('readable')` أو `pipe()` أو المكررات غير المتزامنة إلى سلوك غير بديهي.


#### الصنف: `stream.Readable` {#class-streamreadable}

**تمت الإضافة في: v0.9.4**

##### الحدث: `'close'` {#event-close_1}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | إضافة خيار `emitClose` لتحديد ما إذا كان سيتم إطلاق `'close'` عند التدمير. |
| v0.9.4 | تمت الإضافة في: v0.9.4 |
:::

يتم إطلاق الحدث `'close'` عندما يتم إغلاق الدفق وأي من موارده الأساسية (مثل واصف الملف). يشير الحدث إلى أنه لن يتم إطلاق المزيد من الأحداث، ولن تحدث أي حسابات أخرى.

سيطلق دفق [`Readable`](/ar/nodejs/api/stream#class-streamreadable) دائمًا الحدث `'close'` إذا تم إنشاؤه باستخدام الخيار `emitClose`.

##### الحدث: `'data'` {#event-data}

**تمت الإضافة في: v0.9.4**

- `chunk` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء البيانات. بالنسبة للدفقات التي لا تعمل في وضع الكائن، سيكون الجزء عبارة عن سلسلة أو `Buffer`. بالنسبة للدفقات التي تعمل في وضع الكائن، يمكن أن يكون الجزء أي قيمة JavaScript أخرى غير `null`.

يتم إطلاق الحدث `'data'` عندما يتخلى الدفق عن ملكية جزء من البيانات إلى مستهلك. قد يحدث هذا عندما يتم تبديل الدفق في وضع التدفق عن طريق استدعاء `readable.pipe()` أو `readable.resume()` أو عن طريق إرفاق دالة رد اتصال مستمع بالحدث `'data'`. سيتم أيضًا إطلاق الحدث `'data'` عندما يتم استدعاء الطريقة `readable.read()` ويكون جزء من البيانات متاحًا لإرجاعه.

سيؤدي إرفاق مستمع الحدث `'data'` بدفق لم يتم إيقافه مؤقتًا بشكل صريح إلى تبديل الدفق إلى وضع التدفق. سيتم بعد ذلك تمرير البيانات بمجرد توفرها.

سيتم تمرير دالة رد الاتصال للمستمع بجزء البيانات كسلسلة إذا تم تحديد ترميز افتراضي للدفق باستخدام الطريقة `readable.setEncoding()` ؛ وإلا فسيتم تمرير البيانات كـ `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### الحدث: `'end'` {#event-end}

**تمت الإضافة في: الإصدار v0.9.4**

يتم إصدار الحدث `'end'` عندما لا يكون هناك المزيد من البيانات التي يمكن استهلاكها من الدفق.

**لن يتم إصدار** الحدث `'end'` إلا إذا تم استهلاك البيانات بالكامل. يمكن تحقيق ذلك عن طريق تحويل الدفق إلى وضع التدفق، أو عن طريق استدعاء [`stream.read()`](/ar/nodejs/api/stream#readablereadsize) بشكل متكرر حتى يتم استهلاك جميع البيانات.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`تم استلام ${chunk.length} بايت من البيانات.`);
});
readable.on('end', () => {
  console.log('لن يكون هناك المزيد من البيانات.');
});
```
##### الحدث: `'error'` {#event-error_1}

**تمت الإضافة في: الإصدار v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

قد يتم إصدار الحدث `'error'` بواسطة تطبيق `Readable` في أي وقت. عادةً، قد يحدث هذا إذا كان الدفق الأساسي غير قادر على إنشاء بيانات بسبب فشل داخلي أساسي، أو عندما يحاول تطبيق الدفق دفع جزء غير صالح من البيانات.

سيتم تمرير كائن `Error` واحد إلى معاودة الاتصال بالمستمع.

##### الحدث: `'pause'` {#event-pause}

**تمت الإضافة في: الإصدار v0.9.4**

يتم إصدار الحدث `'pause'` عند استدعاء [`stream.pause()`](/ar/nodejs/api/stream#readablepause) وعندما لا تكون قيمة `readableFlowing` هي `false`.

##### الحدث: `'readable'` {#event-readable}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | يتم دائمًا إصدار `'readable'` في الدورة التالية بعد استدعاء `.push()`. |
| v10.0.0 | يتطلب استخدام `'readable'` استدعاء `.read()`. |
| v0.9.4 | تمت الإضافة في: الإصدار v0.9.4 |
:::

يتم إصدار الحدث `'readable'` عندما تكون هناك بيانات متاحة للقراءة من الدفق، حتى العلامة المائية العالية التي تم تكوينها (`state.highWaterMark`). بشكل فعال، يشير إلى أن الدفق يحتوي على معلومات جديدة داخل المخزن المؤقت. إذا كانت البيانات متاحة داخل هذا المخزن المؤقت، فيمكن استدعاء [`stream.read()`](/ar/nodejs/api/stream#readablereadsize) لاسترداد هذه البيانات. بالإضافة إلى ذلك، قد يتم إصدار الحدث `'readable'` أيضًا عند الوصول إلى نهاية الدفق.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // هناك بعض البيانات لقراءتها الآن.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
إذا تم الوصول إلى نهاية الدفق، فسيؤدي استدعاء [`stream.read()`](/ar/nodejs/api/stream#readablereadsize) إلى إرجاع `null` وتشغيل الحدث `'end'`. هذا صحيح أيضًا إذا لم تكن هناك أي بيانات للقراءة على الإطلاق. على سبيل المثال، في المثال التالي، `foo.txt` هو ملف فارغ:

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`قابل للقراءة: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
ناتج تشغيل هذا البرنامج النصي هو:

```bash [BASH]
$ node test.js
readable: null
end
```
في بعض الحالات، سيؤدي إرفاق مستمع للحدث `'readable'` إلى قراءة بعض البيانات في مخزن مؤقت داخلي.

بشكل عام، آليات `readable.pipe()` والحدث `'data'` أسهل في الفهم من الحدث `'readable'`. ومع ذلك، قد تؤدي معالجة `'readable'` إلى زيادة الإنتاجية.

إذا تم استخدام كل من `'readable'` و [`'data'`](/ar/nodejs/api/stream#event-data) في نفس الوقت، فإن `'readable'` لها الأسبقية في التحكم في التدفق، أي سيتم إصدار `'data'` فقط عند استدعاء [`stream.read()`](/ar/nodejs/api/stream#readablereadsize). ستصبح الخاصية `readableFlowing` هي `false`. إذا كان هناك مستمعون لـ `'data'` عند إزالة `'readable'`، فسيبدأ الدفق في التدفق، أي سيتم إصدار أحداث `'data'` بدون استدعاء `.resume()`.


##### الحدث: `'resume'` {#event-resume}

**أُضيف في: v0.9.4**

يُطلق الحدث `'resume'` عند استدعاء [`stream.resume()`](/ar/nodejs/api/stream#readableresume) و `readableFlowing` ليست `true`.

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | يعمل كعملية لا تفعل شيئًا على دفق تم تدميره بالفعل. |
| v8.0.0 | أُضيف في: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) خطأ سيتم تمريره كحمولة في الحدث `'error'`
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

لتدمير الدفق. اختيارياً، يُطلق الحدث `'error'`، ويُطلق الحدث `'close'` (إلا إذا تم تعيين `emitClose` على `false`). بعد هذا الاستدعاء، سيُحرر دفق القراءة أية موارد داخلية وسيتم تجاهل الاستدعاءات اللاحقة لـ `push()`.

بمجرد استدعاء `destroy()`، ستكون أية استدعاءات أخرى عملية لا تفعل شيئًا ولن يتم إطلاق أية أخطاء أخرى باستثناء الأخطاء من `_destroy()` كـ `'error'`.

يجب على المنفذين عدم تجاوز هذه الطريقة، ولكن بدلاً من ذلك تنفيذ [`readable._destroy()`](/ar/nodejs/api/stream#readable_destroyerr-callback).

##### `readable.closed` {#readableclosed}

**أُضيف في: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يكون `true` بعد إطلاق `'close'`.

##### `readable.destroyed` {#readabledestroyed}

**أُضيف في: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يكون `true` بعد استدعاء [`readable.destroy()`](/ar/nodejs/api/stream#readabledestroyerror).

##### `readable.isPaused()` {#readableispaused}

**أُضيف في: v0.11.14**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تُرجع الطريقة `readable.isPaused()` حالة التشغيل الحالية لـ `Readable`. يستخدم هذا بشكل أساسي بواسطة الآلية التي تقوم عليها الطريقة `readable.pipe()`. في معظم الحالات النموذجية، لن يكون هناك سبب لاستخدام هذه الطريقة مباشرة.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**إضافة في:** v0.9.4

- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ستتسبب الطريقة `readable.pause()` في إيقاف تدفق دفق في وضع التدفق لإصدار أحداث [`'data'`](/ar/nodejs/api/stream#event-data)، والخروج من وضع التدفق. ستبقى أي بيانات تصبح متاحة في المخزن المؤقت الداخلي.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`تم استقبال ${chunk.length} بايت من البيانات.`);
  readable.pause();
  console.log('لن تكون هناك بيانات إضافية لمدة ثانية واحدة.');
  setTimeout(() => {
    console.log('الآن ستبدأ البيانات في التدفق مرة أخرى.');
    readable.resume();
  }, 1000);
});
```
ليس للطريقة `readable.pause()` أي تأثير إذا كان هناك مستمع حدث `'readable'`.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**إضافة في:** v0.9.4

- `destination` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) الوجهة لكتابة البيانات
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات الأنابيب
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إنهاء الكاتب عند انتهاء القارئ. **افتراضي:** `true`.
  
 
- الإرجاع: [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) *الوجهة*، مما يسمح بسلسلة من الأنابيب إذا كان دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) أو دفق [`Transform`](/ar/nodejs/api/stream#class-streamtransform)

تقوم الطريقة `readable.pipe()` بإرفاق دفق [`Writable`](/ar/nodejs/api/stream#class-streamwritable) بـ `readable`، مما يتسبب في التبديل تلقائيًا إلى وضع التدفق ودفع جميع بياناته إلى [`Writable`](/ar/nodejs/api/stream#class-streamwritable) المرفق. ستتم إدارة تدفق البيانات تلقائيًا بحيث لا يتم إغراق دفق `Writable` الوجهة بواسطة دفق `Readable` أسرع.

يقوم المثال التالي بتمرير جميع البيانات من `readable` إلى ملف باسم `file.txt`:

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// جميع البيانات من readable تذهب إلى 'file.txt'.
readable.pipe(writable);
```
من الممكن إرفاق عدة تدفقات `Writable` بدفق `Readable` واحد.

ترجع الطريقة `readable.pipe()` مرجعًا إلى دفق *الوجهة* مما يجعل من الممكن إعداد سلاسل من التدفقات المتدفقة:

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
بشكل افتراضي، يتم استدعاء [`stream.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback) على دفق `Writable` الوجهة عندما يصدر دفق `Readable` المصدر [`'end'`](/ar/nodejs/api/stream#event-end)، بحيث لا تكون الوجهة قابلة للكتابة بعد الآن. لتعطيل هذا السلوك الافتراضي، يمكن تمرير الخيار `end` كـ `false`، مما يتسبب في بقاء دفق الوجهة مفتوحًا:

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('وداعا\n');
});
```
أحد المحاذير المهمة هو أنه إذا أصدر دفق `Readable` خطأ أثناء المعالجة، *فلا يتم إغلاق* وجهة `Writable` تلقائيًا. في حالة حدوث خطأ، سيكون من الضروري *إغلاق* كل دفق *يدويًا* لمنع تسرب الذاكرة.

لا يتم إغلاق تدفقات `Writable` [`process.stderr`](/ar/nodejs/api/process#processstderr) و [`process.stdout`](/ar/nodejs/api/process#processstdout) أبدًا حتى يخرج عملية Node.js، بغض النظر عن الخيارات المحددة.


##### `readable.read([size])` {#readablereadsize}

**أُضيف في: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) وسيطة اختيارية لتحديد كمية البيانات المراد قراءتها.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

تقرأ الطريقة `readable.read()` البيانات من المخزن المؤقت الداخلي وتعيدها. إذا لم تتوفر بيانات للقراءة، فسيتم إرجاع `null`. بشكل افتراضي، يتم إرجاع البيانات ككائن `Buffer` ما لم يتم تحديد ترميز باستخدام الطريقة `readable.setEncoding()` أو كان التدفق يعمل في وضع الكائنات.

تحدد الوسيطة الاختيارية `size` عددًا معينًا من البايتات المراد قراءتها. إذا لم تتوفر `size` بايت للقراءة، فسيتم إرجاع `null` *إلا إذا* انتهى التدفق، وفي هذه الحالة سيتم إرجاع جميع البيانات المتبقية في المخزن المؤقت الداخلي.

إذا لم يتم تحديد الوسيطة `size`، فسيتم إرجاع جميع البيانات الموجودة في المخزن المؤقت الداخلي.

يجب أن تكون الوسيطة `size` أقل من أو تساوي 1 جيجابايت.

يجب استدعاء الطريقة `readable.read()` فقط على تدفقات `Readable` التي تعمل في وضع الإيقاف المؤقت. في وضع التدفق، يتم استدعاء `readable.read()` تلقائيًا حتى يتم استنزاف المخزن المؤقت الداخلي بالكامل.

```js [ESM]
const readable = getReadableStreamSomehow();

// قد يتم تشغيل 'readable' عدة مرات حيث يتم تخزين البيانات مؤقتًا
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // استخدم حلقة للتأكد من أننا نقرأ جميع البيانات المتاحة حاليًا
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// سيتم تشغيل 'end' مرة واحدة عندما لا تتوفر المزيد من البيانات
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```
يعيد كل استدعاء لـ `readable.read()` جزءًا من البيانات أو `null`، مما يشير إلى أنه لا توجد بيانات أخرى للقراءة في تلك اللحظة. لا يتم ربط هذه الأجزاء تلقائيًا. نظرًا لأن استدعاء `read()` واحدًا لا يُرجع جميع البيانات، فقد يكون استخدام حلقة while ضروريًا لقراءة الأجزاء باستمرار حتى يتم استرداد جميع البيانات. عند قراءة ملف كبير، قد يُرجع `.read()` قيمة `null` مؤقتًا، مما يشير إلى أنه استهلك جميع المحتويات المخزنة مؤقتًا ولكن قد تكون هناك المزيد من البيانات التي لم يتم تخزينها مؤقتًا بعد. في مثل هذه الحالات، يتم إصدار حدث `'readable'` جديد بمجرد وجود المزيد من البيانات في المخزن المؤقت، ويشير حدث `'end'` إلى نهاية إرسال البيانات.

لذلك لقراءة محتويات ملف بأكمله من `readable`، من الضروري جمع الأجزاء عبر أحداث `'readable'` متعددة:

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
سيُرجع تدفق `Readable` في وضع الكائنات دائمًا عنصرًا واحدًا من استدعاء [`readable.read(size)`](/ar/nodejs/api/stream#readablereadsize)، بغض النظر عن قيمة الوسيطة `size`.

إذا أعادت الطريقة `readable.read()` جزءًا من البيانات، فسيتم أيضًا إصدار حدث `'data'`.

سيؤدي استدعاء [`stream.read([size])`](/ar/nodejs/api/stream#readablereadsize) بعد إصدار حدث [`'end'`](/ar/nodejs/api/stream#event-end) إلى إرجاع `null`. لن يتم رفع أي خطأ وقت التشغيل.


##### `readable.readable` {#readablereadable}

**أُضيف في: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يكون `true` إذا كان من الآمن استدعاء [`readable.read()`](/ar/nodejs/api/stream#readablereadsize)، مما يعني أن التدفق لم يتم تدميره أو بث `'error'` أو `'end'`.

##### `readable.readableAborted` {#readablereadableaborted}

**أُضيف في: v16.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع ما إذا كان التدفق قد تم تدميره أو حدث خطأ قبل بث `'end'`.

##### `readable.readableDidRead` {#readablereadabledidread}

**أُضيف في: v16.7.0, v14.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع ما إذا تم بث `'data'`.

##### `readable.readableEncoding` {#readablereadableencoding}

**أُضيف في: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

أداة جلب للخاصية `encoding` لتدفق `Readable` معين. يمكن تعيين الخاصية `encoding` باستخدام الطريقة [`readable.setEncoding()`](/ar/nodejs/api/stream#readablesetencodingencoding).

##### `readable.readableEnded` {#readablereadableended}

**أُضيف في: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يصبح `true` عند بث حدث [`'end'`](/ar/nodejs/api/stream#event-end).

##### `readable.errored` {#readableerrored}

**أُضيف في: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

إرجاع الخطأ إذا تم تدمير التدفق بخطأ.

##### `readable.readableFlowing` {#readablereadableflowing}

**أُضيف في: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تعكس هذه الخاصية الحالة الحالية لتدفق `Readable` كما هو موضح في قسم [ثلاث حالات](/ar/nodejs/api/stream#three-states).


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**تمت الإضافة في: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم بإرجاع قيمة `highWaterMark` التي تم تمريرها عند إنشاء هذا `Readable`.

##### `readable.readableLength` {#readablereadablelength}

**تمت الإضافة في: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تحتوي هذه الخاصية على عدد البايتات (أو الكائنات) الموجودة في قائمة الانتظار الجاهزة للقراءة. توفر القيمة بيانات استبطانية فيما يتعلق بحالة `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**تمت الإضافة في: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

جالب للخاصية `objectMode` لتدفق `Readable` معين.

##### `readable.resume()` {#readableresume}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | ليس لـ `resume()` أي تأثير إذا كان هناك مستمع حدث `'readable'`. |
| v0.9.4 | تمت الإضافة في: v0.9.4 |
:::

- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يتسبب الأسلوب `readable.resume()` في استئناف تدفق `Readable` المتوقف مؤقتًا بشكل صريح لإصدار أحداث [`'data'`](/ar/nodejs/api/stream#event-data)، مما يؤدي إلى تحويل التدفق إلى وضع التدفق.

يمكن استخدام الأسلوب `readable.resume()` لاستهلاك البيانات بالكامل من تدفق دون معالجة أي من هذه البيانات فعليًا:

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('وصلنا إلى النهاية، ولكن لم نقرأ أي شيء.');
  });
```
ليس للأسلوب `readable.resume()` أي تأثير إذا كان هناك مستمع حدث `'readable'`.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**تمت الإضافة في: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز المراد استخدامه.
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

يقوم الأسلوب `readable.setEncoding()` بتعيين ترميز الأحرف للبيانات التي تتم قراءتها من تدفق `Readable`.

بشكل افتراضي، لم يتم تعيين أي ترميز وسيتم إرجاع بيانات التدفق ككائنات `Buffer`. يؤدي تعيين ترميز إلى إرجاع بيانات التدفق كسلاسل من الترميز المحدد بدلاً من كائنات `Buffer`. على سبيل المثال، ستؤدي استدعاء `readable.setEncoding('utf8')` إلى تفسير بيانات الإخراج كبيانات UTF-8، وتمريرها كسلاسل. ستؤدي استدعاء `readable.setEncoding('hex')` إلى ترميز البيانات بتنسيق سلسلة سداسي عشري.

سيتعامل تدفق `Readable` بشكل صحيح مع الأحرف متعددة البايت التي يتم تسليمها عبر التدفق والتي قد يتم فك ترميزها بشكل غير صحيح إذا تم سحبها ببساطة من التدفق ككائنات `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('حصلت على %d حرفًا من بيانات السلسلة:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**أُضيف في: v0.9.4**

- `destination` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable) دفق اختياري محدد لإلغاء التوصيل به
- يُعيد: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

تقوم الدالة `readable.unpipe()` بفصل دفق `Writable` الذي تم توصيله مسبقًا باستخدام الدالة [`stream.pipe()`](/ar/nodejs/api/stream#readablepipedestination-options).

إذا لم يتم تحديد `destination`، فسيتم فصل *جميع* التوصيلات.

إذا تم تحديد `destination`، ولكن لم يتم إعداد أي توصيل له، فلن تفعل الدالة أي شيء.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt',
// but only for the first second.
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | يمكن أن تكون وسيطة `chunk` الآن مثيلاً لـ `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن تكون وسيطة `chunk` الآن مثيلاً لـ `Uint8Array`. |
| v0.9.11 | أُضيف في: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات لإضافتها إلى مقدمة قائمة القراءة. بالنسبة للدفقات التي لا تعمل في وضع الكائن، يجب أن يكون `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) أو `null`. بالنسبة لدفقات وضع الكائن، يمكن أن تكون `chunk` أي قيمة JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز أجزاء السلسلة. يجب أن يكون ترميز `Buffer` صالحًا، مثل `'utf8'` أو `'ascii'`.

يمثل تمرير `chunk` كـ `null` نهاية الدفق (EOF) ويتصرف بنفس طريقة `readable.push(null)`، وبعد ذلك لا يمكن كتابة المزيد من البيانات. توضع إشارة EOF في نهاية المخزن المؤقت وسيظل أي بيانات مخزنة مؤقتًا يتم مسحها.

تقوم الدالة `readable.unshift()` بدفع جزء من البيانات مرة أخرى إلى المخزن المؤقت الداخلي. هذا مفيد في مواقف معينة حيث يتم استهلاك دفق بواسطة التعليمات البرمجية التي تحتاج إلى "إلغاء استهلاك" بعض الكمية من البيانات التي تم سحبها بتفاؤل من المصدر، بحيث يمكن تمرير البيانات إلى طرف آخر.

لا يمكن استدعاء الدالة `stream.unshift(chunk)` بعد إصدار الحدث [`'end'`](/ar/nodejs/api/stream#event-end) أو سيتم طرح خطأ وقت التشغيل.

غالبًا ما يجب على المطورين الذين يستخدمون `stream.unshift()` التفكير في التبديل إلى استخدام دفق [`Transform`](/ar/nodejs/api/stream#class-streamtransform) بدلاً من ذلك. راجع قسم [واجهة برمجة التطبيقات لمنفذي الدفق](/ar/nodejs/api/stream#api-for-stream-implementers) لمزيد من المعلومات.

```js [ESM]
// Pull off a header delimited by \n\n.
// Use unshift() if we get too much.
// Call the callback with (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Found the header boundary.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Remove the 'readable' listener before unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Now the body of the message can be read from the stream.
        callback(null, header, stream);
        return;
      }
      // Still reading the header.
      header += str;
    }
  }
}
```
على عكس [`stream.push(chunk)`](/ar/nodejs/api/stream#readablepushchunk-encoding)، لن تنهي `stream.unshift(chunk)` عملية القراءة عن طريق إعادة تعيين حالة القراءة الداخلية للدفق. يمكن أن يتسبب هذا في نتائج غير متوقعة إذا تم استدعاء `readable.unshift()` أثناء القراءة (أي من داخل تطبيق [`stream._read()`](/ar/nodejs/api/stream#readable_readsize) على دفق مخصص). سيؤدي اتباع استدعاء `readable.unshift()` مع [`stream.push('')`](/ar/nodejs/api/stream#readablepushchunk-encoding) فوريًا إلى إعادة تعيين حالة القراءة بشكل مناسب، ومع ذلك فمن الأفضل ببساطة تجنب استدعاء `readable.unshift()` أثناء عملية إجراء القراءة.


##### `readable.wrap(stream)` {#readablewrapstream}

**أُضيف في: الإصدار v0.9.4**

- `stream` [\<Stream\>](/ar/nodejs/api/stream#stream) تدفق قابل للقراءة "بالنمط القديم"
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

قبل Node.js 0.10، لم تُنفِّذ التدفقات واجهة برمجة التطبيقات لوحدة `node:stream` بالكامل كما هي مُعرَّفة حاليًا. (راجع [التوافق](/ar/nodejs/api/stream#compatibility-with-older-nodejs-versions) لمزيد من المعلومات).

عند استخدام مكتبة Node.js قديمة تُصدر أحداث [`'data'`](/ar/nodejs/api/stream#event-data) ولديها طريقة [`stream.pause()`](/ar/nodejs/api/stream#readablepause) وهي استشارية فقط، يمكن استخدام طريقة `readable.wrap()` لإنشاء تدفق [`Readable`](/ar/nodejs/api/stream#class-streamreadable) يستخدم التدفق القديم كمصدر بيانات له.

نادرًا ما يكون من الضروري استخدام `readable.wrap()` ولكن تم توفير الطريقة لتوفير الراحة للتفاعل مع تطبيقات ومكتبات Node.js القديمة.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // إلخ.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.14.0 | لم يعد دعم Symbol.asyncIterator تجريبيًا. |
| v10.0.0 | أُضيف في: الإصدار v10.0.0 |
:::

- Returns: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) لاستهلاك التدفق بالكامل.

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
إذا انتهت الحلقة بـ `break` أو `return` أو `throw`، فسيتم تدمير التدفق. بعبارة أخرى، سيؤدي التكرار على التدفق إلى استهلاك التدفق بالكامل. سيتم قراءة التدفق في أجزاء بحجم يساوي خيار `highWaterMark`. في مثال التعليمات البرمجية أعلاه، ستكون البيانات في جزء واحد إذا كان الملف يحتوي على أقل من 64 كيلوبايت من البيانات لأنه لم يتم توفير خيار `highWaterMark` إلى [`fs.createReadStream()`](/ar/nodejs/api/fs#fscreatereadstreampath-options).


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**أُضيف في: الإصدار v20.4.0، v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يستدعي [`readable.destroy()`](/ar/nodejs/api/stream#readabledestroyerror) مع `AbortError` ويعيد وعدًا يتحقق عند انتهاء التدفق.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**أُضيف في: الإصدار v19.1.0، v18.13.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `stream` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير التدفق إذا تم إلغاء الإشارة.
  
 
- الإرجاع: [\<Duplex\>](/ar/nodejs/api/stream#class-streamduplex) تدفق مؤلف مع التدفق `stream`.

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['this', 'is', 'compose', 'as', 'operator']
```
انظر [`stream.compose`](/ar/nodejs/api/stream#streamcomposestreams) لمزيد من المعلومات.

##### `readable.iterator([options])` {#readableiteratoroptions}

**أُضيف في: الإصدار v16.3.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عند تعيينها على `false`، فإن استدعاء `return` على المكرر اللاتزامني، أو الخروج من تكرار `for await...of` باستخدام `break` أو `return` أو `throw` لن يدمر التدفق. **الافتراضي:** `true`.
  
 
- الإرجاع: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) لاستهلاك التدفق.

يتيح المكرر الذي تم إنشاؤه بواسطة هذه الطريقة للمستخدمين خيار إلغاء تدمير التدفق إذا تم الخروج من حلقة `for await...of` بواسطة `return` أو `break` أو `throw`، أو إذا كان يجب على المكرر تدمير التدفق إذا أصدر التدفق خطأ أثناء التكرار.

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 20.7.0، الإصدار 18.19.0 | تمت إضافة `highWaterMark` في الخيارات. |
| الإصدار 17.4.0، الإصدار 16.14.0 | تمت الإضافة في: الإصدار 17.4.0، الإصدار 16.14.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<دالة غير متزامنة\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة للتحويل على كل جزء في الدفق.
    - `data` [\<أي نوع\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<إشارة إجهاض\>](/ar/nodejs/api/globals#class-abortsignal) يتم إجهاضها إذا تم تدمير الدفق، مما يسمح بإجهاض استدعاء `fn` مبكرًا.
  
 
  
 
- `options` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى للاستدعاء المتزامن لـ `fn` للاتصال بالدفق مرة واحدة. **افتراضي:** `1`.
    - `highWaterMark` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد العناصر المراد تخزينها مؤقتًا أثناء انتظار استهلاك المستخدم للعناصر المحولة. **افتراضي:** `concurrency * 2 - 1`.
    - `signal` [\<إشارة إجهاض\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إجهاض الإشارة.
  
 
- الإرجاع: [\<قابل للقراءة\>](/ar/nodejs/api/stream#class-streamreadable) دفق تم تحويله بالدالة `fn`.

تسمح هذه الطريقة بالتحويل على الدفق. سيتم استدعاء الدالة `fn` لكل جزء في الدفق. إذا أرجعت الدالة `fn` وعدًا - فسيتم انتظار هذا الوعد قبل تمريره إلى دفق النتائج.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// مع محول متزامن.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// مع محول غير متزامن، يقوم بإجراء ما لا يزيد عن استعلامين في المرة الواحدة.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // يسجل نتيجة DNS لـ resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.7.0, v18.19.0 | تمت إضافة `highWaterMark` في الخيارات. |
| v17.4.0, v16.14.0 | تمت إضافتها في: v17.4.0, v16.14.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة لتصفية الأجزاء من الدفق.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) تم إلغاؤه إذا تم تدمير الدفق مما يسمح بإلغاء استدعاء `fn` مبكرًا.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى للاستدعاء المتزامن لـ `fn` للاتصال بالدفق مرة واحدة. **الافتراضي:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد العناصر المراد تخزينها مؤقتًا أثناء انتظار استهلاك المستخدم للعناصر التي تمت تصفيتها. **الافتراضي:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إلغاء الإشارة.
  
 
- الإرجاع: [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable) دفق تمت تصفيته باستخدام المسند `fn`.

تسمح هذه الطريقة بتصفية الدفق. لكل جزء في الدفق، سيتم استدعاء الدالة `fn` وإذا أرجعت قيمة صحيحة، فسيتم تمرير الجزء إلى دفق النتائج. إذا أرجعت الدالة `fn` وعدًا - فسيتم `await` هذا الوعد.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// مع مسند متزامن.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// مع مسند غير متزامن، وإجراء 2 استعلامات على الأكثر في المرة الواحدة.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // تسجيل نطاقات بمدة تزيد عن 60 ثانية في سجل DNS الذي تم حله.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**تمت الإضافة في: v17.5.0، v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة يتم استدعاؤها على كل جزء من الدفق.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يتم إجهاضه إذا تم تدمير الدفق مما يسمح بإجهاض استدعاء `fn` مبكرًا.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى للاستدعاء المتزامن لـ `fn` ليتم استدعاؤه على الدفق في وقت واحد. **افتراضي:** `1`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إجهاض الإشارة.

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد لوقت انتهاء الدفق.

تسمح هذه الطريقة بتكرار الدفق. لكل جزء في الدفق، سيتم استدعاء الدالة `fn`. إذا كانت الدالة `fn` تُرجع وعدًا - فسيتم `await` لهذا الوعد.

تختلف هذه الطريقة عن حلقات `for await...of` في أنها يمكن أن تعالج الأجزاء بشكل متزامن اختياريًا. بالإضافة إلى ذلك، لا يمكن إيقاف تكرار `forEach` إلا من خلال تمرير خيار `signal` وإجهاض `AbortController` ذات الصلة، بينما يمكن إيقاف `for await...of` باستخدام `break` أو `return`. في كلتا الحالتين، سيتم تدمير الدفق.

تختلف هذه الطريقة عن الاستماع إلى حدث [`'data'`](/ar/nodejs/api/stream#event-data) في أنها تستخدم حدث [`readable`](/ar/nodejs/api/stream#class-streamreadable) في الآلية الأساسية ويمكن أن تحد من عدد استدعاءات `fn` المتزامنة.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// مع دالة منطقية متزامنة.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// مع دالة منطقية غير متزامنة، مما يجعل على الأكثر 2 استعلامات في المرة الواحدة.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // يسجل النتيجة، على غرار `for await (const result of dnsResults)`
  console.log(result);
});
console.log('تم'); // انتهى الدفق
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**تمت الإضافة في: v17.5.0، v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء عملية toArray إذا تم إلغاء الإشارة.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد يحتوي على مصفوفة بمحتويات الدفق.

تتيح هذه الطريقة الحصول بسهولة على محتويات الدفق.

نظرًا لأن هذه الطريقة تقرأ الدفق بأكمله في الذاكرة، فإنها تلغي فوائد الدفقات. إنها مخصصة لقابلية التشغيل البيني والراحة، وليس كوسيلة أساسية لاستهلاك الدفقات.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// قم بإجراء استعلامات DNS بشكل متزامن باستخدام .map وجمع
// النتائج في مصفوفة باستخدام toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**تمت الإضافة في: v17.5.0، v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة يتم استدعاؤها على كل جزء من الدفق.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يتم إجهاضه إذا تم تدمير الدفق مما يسمح بإجهاض استدعاء `fn` مبكرًا.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى للاستدعاء المتزامن لـ `fn` ليتم استدعاؤه على الدفق في وقت واحد. **افتراضي:** `1`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إجهاض الإشارة.


- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد يتم تقييمه إلى `true` إذا أرجعت `fn` قيمة صحيحة لجزء واحد على الأقل.

تشبه هذه الطريقة `Array.prototype.some` وتستدعي `fn` على كل جزء في الدفق حتى تكون القيمة المرجعية المنتظرة `true` (أو أي قيمة صحيحة). بمجرد أن يكون استدعاء `fn` على قيمة إرجاع منتظرة صحيحة، يتم تدمير الدفق ويتم تحقيق الوعد بـ `true`. إذا لم تُرجع أي من استدعاءات `fn` على الأجزاء قيمة صحيحة، فسيتم تحقيق الوعد بـ `false`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// مع مسند متزامن.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// مع مسند غير متزامن، وإجراء 2 من فحوصات الملفات على الأكثر في المرة الواحدة.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true` إذا كان أي ملف في القائمة أكبر من 1 ميجابايت
console.log('done'); // تم الانتهاء من الدفق
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**تمت الإضافة في: v17.5.0، v16.17.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة يتم استدعاؤها على كل جزء من الدفق.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يتم إجهاضه إذا تم تدمير الدفق مما يسمح بإجهاض استدعاء `fn` مبكرًا.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد مرات الاستدعاء المتزامنة لـ `fn` التي سيتم استدعاؤها على الدفق في وقت واحد. **افتراضي:** `1`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إجهاض الإشارة.
  
 
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد بتقييم أول جزء قام `fn` بتقييمه بقيمة صريحة، أو `undefined` إذا لم يتم العثور على أي عنصر.

تشبه هذه الطريقة `Array.prototype.find` وتستدعي `fn` على كل جزء في الدفق للعثور على جزء بقيمة صريحة لـ `fn`. بمجرد أن تكون القيمة المرتجعة المنتظرة لاستدعاء `fn` صريحة، يتم تدمير الدفق ويتم الوفاء بالوعد بقيمة قام `fn` بإرجاع قيمة صريحة لها. إذا أعادت جميع استدعاءات `fn` على الأجزاء قيمة خاطئة، فسيتم الوفاء بالوعد بـ `undefined`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// مع دالة منطقية متزامنة.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // غير معرف

// مع دالة منطقية غير متزامنة، مما يجعل 2 من عمليات التحقق من الملفات على الأكثر في المرة الواحدة.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // اسم ملف كبير، إذا كان أي ملف في القائمة أكبر من 1 ميجابايت
console.log('done'); // انتهى الدفق
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**تمت الإضافة في: v17.5.0, v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة يتم استدعاؤها على كل جزء من الدفق.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يتم إلغاؤه إذا تم تدمير الدفق مما يسمح بإلغاء استدعاء `fn` مبكرًا.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لعدد استدعاءات `fn` المتزامنة التي سيتم استدعاؤها على الدفق في وقت واحد. **افتراضي:** `1`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إلغاء الإشارة.

- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد يقيّم إلى `true` إذا أرجعت `fn` قيمة صحيحة لجميع الأجزاء.

تشبه هذه الطريقة `Array.prototype.every` وتستدعي `fn` على كل جزء في الدفق للتحقق مما إذا كانت جميع قيم الإرجاع المنتظرة هي قيمة صحيحة لـ `fn`. بمجرد أن يكون استدعاء `fn` على قيمة إرجاع منتظرة لجزء ما خاطئة، يتم تدمير الدفق ويتم تحقيق الوعد بـ `false`. إذا أرجعت جميع استدعاءات `fn` على الأجزاء قيمة صحيحة، يتم تحقيق الوعد بـ `true`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// مع مسند متزامن.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// مع مسند غير متزامن، يقوم بإجراء 2 من عمليات فحص الملفات على الأكثر في المرة الواحدة.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true` إذا كانت جميع الملفات في القائمة أكبر من 1 ميجابايت
console.log(allBigFiles);
console.log('done'); // اكتمل الدفق
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**أضيف في: الإصدار v17.5.0، v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة للتطبيق على كل جزء في الدفق.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات من الدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يتم إجهاضه إذا تم تدمير الدفق مما يسمح بإجهاض استدعاء `fn` مبكرًا.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى للاستدعاء المتزامن لـ `fn` للاتصال بالدفق مرة واحدة. **الافتراضي:** `1`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير الدفق إذا تم إجهاض الإشارة.


- الإرجاع: [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable) دفق يتم تسويته باستخدام الدالة `fn`.

تقوم هذه الطريقة بإرجاع دفق جديد عن طريق تطبيق الاستدعاء المعطى على كل جزء من الدفق ثم تسوية النتيجة.

من الممكن إرجاع دفق أو تكرار آخر أو تكرار غير متزامن من `fn` وسيتم دمج (تسوية) الدفقات الناتجة في الدفق المرتجع.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// مع خريطة متزامنة.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// مع خريطة غير متزامنة، قم بدمج محتويات 4 ملفات
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // سيحتوي هذا على محتويات (جميع الأجزاء) لجميع الملفات الأربعة
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**أُضيف في: v17.5.0, v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد القطع المراد إسقاطها من القراءة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير التدفق إذا تم إجهاض الإشارة.
  
 
- القيمة المُعادة: [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable) تدفق مع إسقاط `limit` من القطع.

تعيد هذه الطريقة تدفقًا جديدًا مع إسقاط أول `limit` من القطع.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**أُضيف في: v17.5.0, v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد القطع المراد أخذها من القراءة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير التدفق إذا تم إجهاض الإشارة.
  
 
- القيمة المُعادة: [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable) تدفق مع أخذ `limit` من القطع.

تعيد هذه الطريقة تدفقًا جديدًا مع أول `limit` من القطع.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**أُضيف في: v17.5.0, v16.15.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الاختزال لاستدعائها على كل قطعة في التدفق.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة التي تم الحصول عليها من الاستدعاء الأخير لـ `fn` أو القيمة `initial` إذا تم تحديدها أو القطعة الأولى من التدفق بخلاف ذلك.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قطعة بيانات من التدفق.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يتم إجهاضها إذا تم تدمير التدفق مما يسمح بإجهاض استدعاء `fn` مبكرًا.
  
 
  
 
- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة الأولية لاستخدامها في الاختزال.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بتدمير التدفق إذا تم إجهاض الإشارة.
  
 
- القيمة المُعادة: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) وعد بالقيمة النهائية للاختزال.

تستدعي هذه الطريقة `fn` على كل قطعة من التدفق بالترتيب، وتمرر لها النتيجة من الحساب على العنصر السابق. تعيد وعدًا بالقيمة النهائية للاختزال.

إذا لم يتم توفير قيمة `initial`، يتم استخدام القطعة الأولى من التدفق كقيمة أولية. إذا كان التدفق فارغًا، يتم رفض الوعد بـ `TypeError` مع خاصية الرمز `ERR_INVALID_ARGS`.

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
تكرر دالة الاختزال عنصر التدفق تلو الآخر مما يعني عدم وجود معلمة `concurrency` أو توازي. لإجراء `reduce` بشكل متزامن، يمكنك استخراج الدالة غير المتزامنة إلى طريقة [`readable.map`](/ar/nodejs/api/stream#readablemapfn-options).

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### دفقات الازدواج والتحويل {#duplex-and-transform-streams}

#### الصنف: `stream.Duplex` {#class-streamduplex}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v6.8.0 | تعيد الآن مثيلات `Duplex` القيمة `true` عند التحقق من `instanceof stream.Writable`. |
| v0.9.4 | تمت الإضافة في: v0.9.4 |
:::

دفقات الازدواج هي دفقات تنفذ كلاً من واجهتي [`القراءة`](/ar/nodejs/api/stream#class-streamreadable) و[`الكتابة`](/ar/nodejs/api/stream#class-streamwritable).

تشمل أمثلة دفقات `Duplex`:

- [مقابس TCP](/ar/nodejs/api/net#class-netsocket)
- [دفقات zlib](/ar/nodejs/api/zlib)
- [دفقات التشفير](/ar/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**تمت الإضافة في: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إذا كانت القيمة `false`، فسينهي الدفق تلقائيًا الجانب القابل للكتابة عندما ينتهي الجانب القابل للقراءة. يتم تعيينه مبدئيًا بواسطة خيار المُنشئ `allowHalfOpen`، والذي يكون افتراضيًا `true`.

يمكن تغيير ذلك يدويًا لتغيير سلوك الفتح النصفي لمثيل دفق `Duplex` موجود، ولكن يجب تغييره قبل انبعاث حدث `'end'`.

#### الصنف: `stream.Transform` {#class-streamtransform}

**تمت الإضافة في: v0.9.4**

دفقات التحويل هي دفقات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) حيث يكون الإخراج مرتبطًا بطريقة ما بالإدخال. مثل جميع دفقات [`Duplex`](/ar/nodejs/api/stream#class-streamduplex)، تنفذ دفقات `Transform` كلاً من واجهتي [`القراءة`](/ar/nodejs/api/stream#class-streamreadable) و[`الكتابة`](/ar/nodejs/api/stream#class-streamwritable).

تشمل أمثلة دفقات `Transform`:

- [دفقات zlib](/ar/nodejs/api/zlib)
- [دفقات التشفير](/ar/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.0.0 | يعمل كعملية غير فعالة على دفق تم تدميره بالفعل. |
| v8.0.0 | تمت الإضافة في: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

تدمير الدفق، وانبعاث حدث `'error'` اختياريًا. بعد هذه المكالمة، سيحرر دفق التحويل أي موارد داخلية. يجب ألا يتجاوز المنفذون هذه الطريقة، ولكن بدلاً من ذلك ينفذون [`readable._destroy()`](/ar/nodejs/api/stream#readable_destroyerr-callback). ينبعث التنفيذ الافتراضي لـ `_destroy()` لـ `Transform` أيضًا `'close'` ما لم يتم تعيين `emitClose` إلى false.

بمجرد استدعاء `destroy()`، ستكون أي مكالمات أخرى عملية غير فعالة وقد لا يتم انبعاث أي أخطاء أخرى باستثناء `_destroy()` كـ `'error'`.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**تمت الإضافة في: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) قيمة لتمريرها إلى كلا من منشئي [`Duplex`](/ar/nodejs/api/stream#class-streamduplex)، لتعيين خيارات مثل التخزين المؤقت.
- Returns: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) من مثيلي [`Duplex`](/ar/nodejs/api/stream#class-streamduplex).

تعيد الدالة المساعدة `duplexPair` مصفوفة بعنصرين، كل منهما عبارة عن دفق `Duplex` متصل بالجانب الآخر:

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
أي شيء يتم كتابته إلى أحد الدفق يصبح قابلاً للقراءة على الآخر. يوفر سلوكًا مشابهًا لاتصال الشبكة، حيث تصبح البيانات التي كتبها العميل قابلة للقراءة بواسطة الخادم، والعكس صحيح.

دفقات Duplex متماثلة؛ يمكن استخدام أحدهما أو الآخر دون أي اختلاف في السلوك.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.5.0 | تمت إضافة دعم لـ `ReadableStream` و `WritableStream`. |
| v15.11.0 | تمت إضافة الخيار `signal`. |
| v14.0.0 | ستنتظر `finished(stream, cb)` حدث `'close'` قبل استدعاء رد النداء. تحاول الآلية اكتشاف الدفقات القديمة وتطبيق هذا السلوك فقط على الدفقات التي من المتوقع أن تُصدر `'close'`. |
| v14.0.0 | سيؤدي إصدار `'close'` قبل `'end'` على دفق `Readable` إلى حدوث خطأ `ERR_STREAM_PREMATURE_CLOSE`. |
| v14.0.0 | سيتم استدعاء رد النداء على الدفقات التي انتهت بالفعل قبل استدعاء `finished(stream, cb)`. |
| v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `stream` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) دفق/دفق ويب قابل للقراءة و/أو الكتابة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `false`، فلن يتم التعامل مع استدعاء `emit('error', err)` على أنه منتهي. **افتراضي:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عند تعيينه على `false`، سيتم استدعاء رد النداء عندما ينتهي الدفق على الرغم من أن الدفق قد يظل قابلاً للقراءة. **افتراضي:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عند تعيينه على `false`، سيتم استدعاء رد النداء عندما ينتهي الدفق على الرغم من أن الدفق قد يظل قابلاً للكتابة. **افتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء انتظار انتهاء الدفق. لن يتم إلغاء الدفق الأساسي إذا تم إلغاء الإشارة. سيتم استدعاء رد النداء مع `AbortError`. سيتم أيضًا إزالة جميع المستمعين المسجلين الذين تمت إضافتهم بواسطة هذه الدالة.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء تأخذ وسيطة خطأ اختيارية.
- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة تنظيف تزيل جميع المستمعين المسجلين.

دالة لتلقي إشعار عندما لا يعود الدفق قابلاً للقراءة أو الكتابة أو واجه خطأ أو حدث إغلاق مبكر.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // استنزاف الدفق.
```
مفيد بشكل خاص في سيناريوهات معالجة الأخطاء حيث يتم تدمير الدفق قبل الأوان (مثل طلب HTTP تم إلغاؤه)، ولن يُصدر `'end'` أو `'finish'`.

توفر واجهة برمجة التطبيقات `finished` [نسخة وعد](/ar/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` يترك مستمعي الأحداث المتدلية (خاصة `'error'` و `'end'` و `'finish'` و `'close'`) بعد استدعاء `callback`. السبب في ذلك هو أن أحداث `'error'` غير المتوقعة (بسبب تطبيقات الدفق غير الصحيحة) لا تتسبب في أعطال غير متوقعة. إذا كان هذا السلوك غير مرغوب فيه، فيجب استدعاء دالة التنظيف التي تم إرجاعها في رد النداء:

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [سجل التعديلات]
| الإصدار | التغييرات |
|---|---|
| الإصدار v19.7.0, v18.16.0 | تمت إضافة دعم لتدفقات الويب. |
| الإصدار v18.0.0 | تمرير رد نداء غير صالح إلى وسيطة `callback` يؤدي الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار v14.0.0 | سيقوم `pipeline(..., cb)` بالانتظار لحدث `'close'` قبل استدعاء رد النداء. تحاول عملية التنفيذ الكشف عن التدفقات القديمة وتطبيق هذا السلوك فقط على التدفقات التي يُتوقع أن تصدر `'close'`. |
| الإصدار v13.10.0 | إضافة دعم للمولدات غير المتزامنة. |
| الإصدار v10.0.0 | تمت الإضافة في: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/ar/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ar/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ar/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
    - Returns: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `...transforms` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/ar/nodejs/api/webstreams#class-transformstream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Returns: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `destination` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Returns: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها عند اكتمال خط الأنابيب بالكامل.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` القيمة المحلولة لـ `Promise` التي تم إرجاعها بواسطة `destination`.


- Returns: [\<Stream\>](/ar/nodejs/api/stream#stream)

طريقة وحدة لتوجيه بين التدفقات والمولدات لتوجيه الأخطاء وتنظيفها بشكل صحيح وتوفير رد نداء عند اكتمال خط الأنابيب.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// استخدم واجهة برمجة تطبيقات خط الأنابيب لتوجيه سلسلة من التدفقات بسهولة
// معًا وتلقي إشعار عند اكتمال خط الأنابيب بالكامل.

// خط أنابيب لضغط ملف tar ضخم محتمل بكفاءة:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('فشل خط الأنابيب.', err);
    } else {
      console.log('نجح خط الأنابيب.');
    }
  },
);
```
توفر واجهة برمجة التطبيقات `pipeline` [إصدار وعد](/ar/nodejs/api/stream#streampipelinesource-transforms-destination-options).

سيستدعي `stream.pipeline()` الأمر `stream.destroy(err)` على جميع التدفقات باستثناء:

- تدفقات `Readable` التي أصدرت `'end'` أو `'close'`.
- تدفقات `Writable` التي أصدرت `'finish'` أو `'close'`.

يترك `stream.pipeline()` مستمعي الأحداث المعلقة على التدفقات بعد استدعاء `callback`. في حالة إعادة استخدام التدفقات بعد الفشل، قد يتسبب ذلك في تسرب مستمع الأحداث وأخطاء مكتومة. إذا كان التدفق الأخير قابلاً للقراءة، فستتم إزالة مستمعي الأحداث المعلقة بحيث يمكن استهلاك التدفق الأخير لاحقًا.

يغلق `stream.pipeline()` جميع التدفقات عند ظهور خطأ. قد يؤدي استخدام `IncomingRequest` مع `pipeline` إلى سلوك غير متوقع بمجرد أن يدمر المقبس دون إرسال الاستجابة المتوقعة. انظر المثال أدناه:

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // لا يوجد مثل هذا الملف
      // لا يمكن إرسال هذه الرسالة بمجرد أن يكون `pipeline` قد دمر المقبس بالفعل
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v21.1.0, v20.10.0 | تمت إضافة دعم لفئة التدفق. |
| v19.8.0, v18.16.0 | تمت إضافة دعم لتدفقات الويب. |
| v16.9.0 | تمت إضافته في: v16.9.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - `stream.compose` تجريبي.
:::

- `streams` [\<Stream[]\>](/ar/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ar/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ar/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/ar/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يجمع اثنين أو أكثر من التدفقات في تدفق `Duplex` يكتب إلى التدفق الأول ويقرأ من الأخير. يتم توجيه كل تدفق موفر إلى التدفق التالي، باستخدام `stream.pipeline`. إذا حدث خطأ في أي من التدفقات، فسيتم تدميرها جميعًا، بما في ذلك تدفق `Duplex` الخارجي.

نظرًا لأن `stream.compose` يُرجع تدفقًا جديدًا يمكن بدوره (ويجب) توجيهه إلى تدفقات أخرى، فإنه يتيح التركيب. في المقابل، عند تمرير التدفقات إلى `stream.pipeline`، عادةً ما يكون التدفق الأول عبارة عن تدفق قابل للقراءة والأخير عبارة عن تدفق قابل للكتابة، مما يشكل دائرة مغلقة.

إذا تم تمرير `Function`، فيجب أن تكون طريقة مصنع تأخذ `source` `Iterable`.

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // prints 'HELLOWORLD'
```
يمكن استخدام `stream.compose` لتحويل التكرارات غير المتزامنة والمولدات والوظائف إلى تدفقات.

- `AsyncIterable` يتحول إلى `Duplex` قابل للقراءة. لا يمكن أن ينتج `null`.
- `AsyncGeneratorFunction` يتحول إلى `Duplex` تحويل قابل للقراءة/الكتابة. يجب أن يأخذ `AsyncIterable` مصدر كمعامل أول. لا يمكن أن ينتج `null`.
- `AsyncFunction` يتحول إلى `Duplex` قابل للكتابة. يجب أن يُرجع إما `null` أو `undefined`.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Convert AsyncIterable into readable Duplex.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Convert AsyncGenerator into transform Duplex.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Convert AsyncFunction into writable Duplex.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // prints 'HELLOWORLD'
```
انظر [`readable.compose(stream)`](/ar/nodejs/api/stream#readablecomposestream-options) لـ `stream.compose` كعامل تشغيل.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**تمت الإضافة في: v12.3.0، v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) كائن يقوم بتنفيذ بروتوكول التكرار `Symbol.asyncIterator` أو `Symbol.iterator`. يصدر حدث "خطأ" إذا تم تمرير قيمة فارغة.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الخيارات المقدمة إلى `new stream.Readable([options])`. بشكل افتراضي، سيقوم `Readable.from()` بتعيين `options.objectMode` إلى `true`، ما لم يتم إلغاء الاشتراك في ذلك بشكل صريح عن طريق تعيين `options.objectMode` إلى `false`.
- الإرجاع: [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)

طريقة مساعدة لإنشاء تدفقات قابلة للقراءة من المكررات.

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
استدعاء `Readable.from(string)` أو `Readable.from(buffer)` لن يؤدي إلى تكرار السلاسل أو المخازن المؤقتة لمطابقة دلالات التدفقات الأخرى لأسباب تتعلق بالأداء.

إذا تم تمرير كائن `Iterable` يحتوي على وعود كوسيطة، فقد يؤدي ذلك إلى رفض غير معالج.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // رفض غير معالج
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**تمت الإضافة في: v17.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `readableStream` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
  
 
- الإرجاع: [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**تمت إضافتها في: الإصدار v16.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `stream` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
- الإرجاع: `boolean`

إرجاع ما إذا تمت القراءة من الدفق أو إلغاؤه.

### `stream.isErrored(stream)` {#streamiserroredstream}

**تمت إضافتها في: الإصدار v17.3.0، v16.14.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `stream` [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/ar/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/ar/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع ما إذا كان الدفق قد واجه خطأ.

### `stream.isReadable(stream)` {#streamisreadablestream}

**تمت إضافتها في: الإصدار v17.4.0، v16.14.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `stream` [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/ar/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع ما إذا كان الدفق قابلاً للقراءة.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**تمت إضافتها في: الإصدار v17.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `streamReadable` [\<stream.Readable\>](/ar/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم قائمة الانتظار الداخلية (لـ `ReadableStream` الذي تم إنشاؤه) قبل تطبيق الضغط الخلفي في القراءة من `stream.Readable` المحدد. إذا لم يتم توفير قيمة، فسيتم أخذها من `stream.Readable` المحدد.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة تحدد حجم قطعة البيانات المحددة. إذا لم يتم توفير قيمة، فسيكون الحجم `1` لجميع القطع.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- الإرجاع: [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**تمت إضافته في: الإصدار v17.0.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [ثابت: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `writableStream` [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
  
 
- Returns: [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**تمت إضافته في: الإصدار v17.0.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [ثابت: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `streamWritable` [\<stream.Writable\>](/ar/nodejs/api/stream#class-streamwritable)
- Returns: [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v19.5.0, v18.17.0 | يمكن الآن أن تكون وسيطة `src` إما `ReadableStream` أو `WritableStream`. |
| v16.8.0 | تمت إضافته في: الإصدار v16.8.0 |
:::

- `src` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<Blob\>](/ar/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)

طريقة مساعدة لإنشاء تدفقات ثنائية الاتجاه.

- `Stream` تحول تدفق الكتابة إلى `Duplex` قابل للكتابة وتدفق القراءة إلى `Duplex`.
- `Blob` تحول إلى `Duplex` قابل للقراءة.
- `string` تحول إلى `Duplex` قابل للقراءة.
- `ArrayBuffer` تحول إلى `Duplex` قابل للقراءة.
- `AsyncIterable` تحول إلى `Duplex` قابل للقراءة. لا يمكن أن تنتج `null`.
- `AsyncGeneratorFunction` تحول إلى `Duplex` تحويلي قابل للقراءة/الكتابة. يجب أن تأخذ مصدراً `AsyncIterable` كمعامل أول. لا يمكن أن تنتج `null`.
- `AsyncFunction` تحول إلى `Duplex` قابل للكتابة. يجب أن تعيد إما `null` أو `undefined`.
- `Object ({ writable, readable })` تحول `readable` و `writable` إلى `Stream` ثم تجمع بينهما في `Duplex` حيث ستكتب `Duplex` إلى `writable` وتقرأ من `readable`.
- `Promise` تحول إلى `Duplex` قابل للقراءة. يتم تجاهل القيمة `null`.
- `ReadableStream` تحول إلى `Duplex` قابل للقراءة.
- `WritableStream` تحول إلى `Duplex` قابل للكتابة.
- Returns: [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

إذا تم تمرير كائن `Iterable` يحتوي على وعود كوسيطة، فقد يؤدي ذلك إلى رفض غير معالج.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // رفض غير معالج
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**أضيف في: الإصدار v17.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `pair` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)
  
 
- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)
  
 
- الإرجاع: [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**أُضيف في: v17.0.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [ثبات: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `streamDuplex` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)
- القيمة المعادة: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream)




::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.7.0, v18.16.0 | تمت إضافة دعم لـ `ReadableStream` و `WritableStream`. |
| v15.4.0 | أُضيف في: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) إشارة تمثل الإلغاء المحتمل
- `stream` [\<Stream\>](/ar/nodejs/api/stream#stream) | [\<ReadableStream\>](/ar/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ar/nodejs/api/webstreams#class-writablestream) دفق لإرفاق إشارة به.

يربط `AbortSignal` بدفق قابل للقراءة أو قابل للكتابة. يتيح هذا للتعليمات البرمجية التحكم في تدمير الدفق باستخدام `AbortController`.

سيؤدي استدعاء `abort` على `AbortController` المطابق لـ `AbortSignal` الذي تم تمريره إلى نفس سلوك استدعاء `.destroy(new AbortError())` على الدفق، و `controller.error(new AbortError())` لدفقات الويب.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// في وقت لاحق، قم بإلغاء العملية لإغلاق الدفق
controller.abort();
```
أو استخدام `AbortSignal` مع دفق قابل للقراءة كقابل للتكرار غير متزامن:

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // تعيين مهلة
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // تم إلغاء العملية
    } else {
      throw e;
    }
  }
})();
```
أو استخدام `AbortSignal` مع `ReadableStream`:

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // تم إلغاء العملية
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**تمت الإضافة في: الإصدار 19.9.0، الإصدار 18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع العلامة المائية العالية الافتراضية المستخدمة من قبل التدفقات. القيمة الافتراضية هي `65536` (64 كيلو بايت)، أو `16` لـ `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**تمت الإضافة في: الإصدار 19.9.0، الإصدار 18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة highWaterMark

تعيين العلامة المائية العالية الافتراضية المستخدمة من قبل التدفقات.

## واجهة برمجة التطبيقات لمنفذي التدفق {#api-for-stream-implementers}

تم تصميم واجهة برمجة التطبيقات لوحدة `node:stream` لتسهيل تنفيذ التدفقات باستخدام نموذج الوراثة الأولي لـ JavaScript.

أولاً، يعلن مطور التدفق عن فئة JavaScript جديدة تمتد إلى إحدى فئات التدفق الأساسية الأربعة (`stream.Writable` أو `stream.Readable` أو `stream.Duplex` أو `stream.Transform`)، مع التأكد من استدعاء منشئ الفئة الأصل المناسب:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
عند توسيع التدفقات، ضع في اعتبارك الخيارات التي يمكن للمستخدم تقديمها ويجب عليه تقديمها قبل إعادة توجيهها إلى المنشئ الأساسي. على سبيل المثال، إذا كان التنفيذ يضع افتراضات فيما يتعلق بخيارات `autoDestroy` و `emitClose`، فلا تسمح للمستخدم بتجاوزها. كن صريحًا بشأن الخيارات التي يتم إعادة توجيهها بدلاً من إعادة توجيه جميع الخيارات ضمنيًا.

يجب على فئة التدفق الجديدة بعد ذلك تنفيذ واحد أو أكثر من الأساليب المحددة، اعتمادًا على نوع التدفق الذي يتم إنشاؤه، كما هو مفصل في المخطط أدناه:

| حالة الاستخدام | الفئة | الأسلوب (الأساليب) المراد تنفيذها |
| --- | --- | --- |
| قراءة فقط | [`Readable`](/ar/nodejs/api/stream#class-streamreadable) | [`_read()`](/ar/nodejs/api/stream#readable_readsize) |
| كتابة فقط | [`Writable`](/ar/nodejs/api/stream#class-streamwritable) | [`_write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback)  ،   [`_writev()`](/ar/nodejs/api/stream#writable_writevchunks-callback)  ،   [`_final()`](/ar/nodejs/api/stream#writable_finalcallback) |
| قراءة وكتابة | [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) | [`_read()`](/ar/nodejs/api/stream#readable_readsize)  ،   [`_write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback)  ،   [`_writev()`](/ar/nodejs/api/stream#writable_writevchunks-callback)  ،   [`_final()`](/ar/nodejs/api/stream#writable_finalcallback) |
| تشغيل البيانات المكتوبة، ثم قراءة النتيجة | [`Transform`](/ar/nodejs/api/stream#class-streamtransform) | [`_transform()`](/ar/nodejs/api/stream#transform_transformchunk-encoding-callback)  ،   [`_flush()`](/ar/nodejs/api/stream#transform_flushcallback)  ،   [`_final()`](/ar/nodejs/api/stream#writable_finalcallback) |
يجب ألا يستدعي رمز التنفيذ لتدفق *أبدًا* الأساليب "العامة" لتدفق مخصصة للاستخدام من قبل المستهلكين (كما هو موضح في قسم [واجهة برمجة التطبيقات لمستهلكي التدفق](/ar/nodejs/api/stream#api-for-stream-consumers)). قد يؤدي القيام بذلك إلى آثار جانبية سلبية في كود التطبيق الذي يستهلك التدفق.

تجنب تجاوز الأساليب العامة مثل `write()` و `end()` و `cork()` و `uncork()` و `read()` و `destroy()`، أو إصدار الأحداث الداخلية مثل `'error'` و `'data'` و `'end'` و `'finish'` و `'close'` من خلال `.emit()`. قد يؤدي القيام بذلك إلى كسر الثوابت الحالية والمستقبلية للتدفق مما يؤدي إلى سلوك و/أو مشكلات توافق مع التدفقات الأخرى وأدوات التدفق وتوقعات المستخدم.


### البناء المبسط {#simplified-construction}

**تمت الإضافة في: v1.2.0**

في العديد من الحالات البسيطة، من الممكن إنشاء دفق دون الاعتماد على الوراثة. يمكن تحقيق ذلك عن طريق إنشاء مثيلات مباشرة من كائنات `stream.Writable` أو `stream.Readable` أو `stream.Duplex` أو `stream.Transform` وتمرير الطرق المناسبة كخيارات مُنشئ.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // تهيئة الحالة وتحميل الموارد...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // تحرير الموارد...
  },
});
```
### تنفيذ دفق قابل للكتابة {#implementing-a-writable-stream}

يتم تمديد الفئة `stream.Writable` لتنفيذ دفق [`Writable`](/ar/nodejs/api/stream#class-streamwritable).

يجب على دفقات `Writable` المخصصة *استدعاء* مُنشئ `new stream.Writable([options])` وتنفيذ الطريقة `writable._write()` و/أو `writable._writev()`.

#### `new stream.Writable([options])` {#new-streamwritableoptions}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | زيادة highWaterMark الافتراضي. |
| v15.5.0 | دعم تمرير AbortSignal. |
| v14.0.0 | تغيير الخيار `autoDestroy` الافتراضي إلى `true`. |
| v11.2.0, v10.16.0 | إضافة الخيار `autoDestroy` لـ `destroy()` الدفق تلقائيًا عند إصداره `'finish'` أو أخطاء. |
| v10.0.0 | إضافة الخيار `emitClose` لتحديد ما إذا كان `'close'` سيصدر عند التدمير. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى المخزن المؤقت عندما يبدأ [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) في إرجاع `false`. **الافتراضي:** `65536` (64 كيلوبايت)، أو `16` لدفقات `objectMode`.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان سيتم ترميز `string`s التي تم تمريرها إلى [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) إلى `Buffer`s (باستخدام الترميز المحدد في استدعاء [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback)) قبل تمريرها إلى [`stream._write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback). لا يتم تحويل أنواع البيانات الأخرى (أي لا يتم فك ترميز `Buffer`s إلى `string`s). سيؤدي تعيين القيمة إلى خطأ إلى منع تحويل `string`s. **الافتراضي:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الترميز الافتراضي الذي يتم استخدامه عندما لا يتم تحديد أي ترميز كوسيطة لـ [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback). **الافتراضي:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كانت [`stream.write(anyObj)`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback) عملية صالحة أم لا. عند التعيين، يصبح من الممكن كتابة قيم JavaScript بخلاف السلسلة، [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)، [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) إذا كان مدعومًا من قبل تطبيق الدفق. **الافتراضي:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان يجب على الدفق إصدار `'close'` بعد تدميره أم لا. **الافتراضي:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للطريقة [`stream._write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للطريقة [`stream._writev()`](/ar/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للطريقة [`stream._destroy()`](/ar/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للطريقة [`stream._final()`](/ar/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للطريقة [`stream._construct()`](/ar/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان يجب على هذا الدفق استدعاء `.destroy()` تلقائيًا على نفسه بعد الانتهاء. **الافتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) إشارة تمثل الإلغاء المحتمل.

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // استدعاء مُنشئ stream.Writable().
    super(options);
    // ...
  }
}
```
أو، عند استخدام مُنشئات نمط ما قبل ES6:

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
أو، باستخدام نهج المُنشئ المبسّط:

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
سيؤدي استدعاء `abort` على `AbortController` المطابق لـ `AbortSignal` الذي تم تمريره إلى نفس سلوك استدعاء `.destroy(new AbortError())` على الدفق القابل للكتابة.

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// لاحقًا، قم بإحباط العملية التي تغلق الدفق
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**تمت إضافته في: الإصدار v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) استدع هذه الدالة (اختياريًا مع وسيطة خطأ) عندما ينتهي التدفق من التهيئة.

يجب عدم استدعاء الأسلوب `_construct()` مباشرة. يمكن تنفيذه بواسطة الفئات الفرعية، وإذا كان الأمر كذلك، فسيتم استدعاؤه بواسطة طرق فئة `Writable` الداخلية فقط.

سيتم استدعاء هذه الدالة الاختيارية في دورة بعد أن يتم إرجاع مُنشئ التدفق، مما يؤخر أي استدعاءات `_write()` و `_final()` و `_destroy()` حتى يتم استدعاء `callback`. هذا مفيد لتهيئة الحالة أو تهيئة الموارد بشكل غير متزامن قبل أن يتم استخدام التدفق.

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.11.0 | ‎_write()‎ اختياري عند توفير ‎_writev()‎. |
:::

- `chunk` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ‎`Buffer`‎ المراد كتابته، والمحول من ‎`string`‎ التي تم تمريرها إلى ‎[`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback)‎. إذا كان الخيار ‎`decodeStrings`‎ الخاص بالتدفق هو ‎`false`‎ أو كان التدفق يعمل في وضع الكائن، فلن يتم تحويل الجزء وسيكون ما تم تمريره إلى ‎[`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback)‎.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كان الجزء سلسلة، فإن ‎`encoding`‎ هو ترميز الأحرف لتلك السلسلة. إذا كان الجزء ‎`Buffer`‎، أو إذا كان التدفق يعمل في وضع الكائن، فيمكن تجاهل ‎`encoding`‎.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) استدع هذه الدالة (اختياريًا مع وسيطة خطأ) عند اكتمال المعالجة للجزء المقدم.

يجب على جميع عمليات تنفيذ تدفق ‎`Writable`‎ توفير أسلوب ‎[`writable._write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback)‎ و/أو ‎[`writable._writev()`](/ar/nodejs/api/stream#writable_writevchunks-callback)‎ لإرسال البيانات إلى المورد الأساسي.

توفر تدفقات ‎[`Transform`](/ar/nodejs/api/stream#class-streamtransform)‎ التنفيذ الخاص بها لـ ‎[`writable._write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback)‎.

يجب عدم استدعاء هذه الدالة بواسطة كود التطبيق مباشرة. يجب أن يتم تنفيذها بواسطة الفئات الفرعية، ويتم استدعاؤها بواسطة طرق فئة ‎`Writable`‎ الداخلية فقط.

يجب استدعاء دالة ‎`callback`‎ بشكل متزامن داخل ‎`writable._write()`‎ أو بشكل غير متزامن (أي دورة مختلفة) للإشارة إما إلى أن الكتابة اكتملت بنجاح أو فشلت مع وجود خطأ. يجب أن تكون الوسيطة الأولى التي يتم تمريرها إلى ‎`callback`‎ هي كائن ‎`Error`‎ إذا فشل الاستدعاء أو ‎`null`‎ إذا نجحت الكتابة.

ستؤدي جميع الاستدعاءات إلى ‎`writable.write()`‎ التي تحدث بين وقت استدعاء ‎`writable._write()`‎ واستدعاء ‎`callback`‎ إلى تخزين البيانات المكتوبة مؤقتًا. عند استدعاء ‎`callback`‎، قد ينبعث من التدفق حدث ‎[`'drain'`](/ar/nodejs/api/stream#event-drain)‎. إذا كان تنفيذ التدفق قادرًا على معالجة أجزاء متعددة من البيانات في وقت واحد، فيجب تنفيذ أسلوب ‎`writable._writev()`‎.

إذا تم تعيين الخاصية ‎`decodeStrings`‎ بشكل صريح على ‎`false`‎ في خيارات المُنشئ، فسيظل ‎`chunk`‎ هو نفس الكائن الذي تم تمريره إلى ‎`.write()`‎، وقد يكون سلسلة بدلاً من ‎`Buffer`‎. هذا لدعم التنفيذات التي لديها معالجة مُحسَّنة لترميزات بيانات سلسلة معينة. في هذه الحالة، ستشير الوسيطة ‎`encoding`‎ إلى ترميز الأحرف للسلسلة. بخلاف ذلك، يمكن تجاهل الوسيطة ‎`encoding`‎ بأمان.

يتم تذييل الأسلوب ‎`writable._write()`‎ بشرطة سفلية لأنه داخلي للفئة التي تحدده، ولا يجب استدعاؤه مباشرةً بواسطة برامج المستخدم.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) البيانات المراد كتابتها. القيمة هي عبارة عن مصفوفة من [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يمثل كل منها جزءًا منفصلاً من البيانات المراد كتابتها. خصائص هذه الكائنات هي:
    - `chunk` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مثيل buffer أو سلسلة نصية تحتوي على البيانات المراد كتابتها. ستكون `chunk` سلسلة نصية إذا تم إنشاء `Writable` مع تعيين الخيار `decodeStrings` على `false` وتم تمرير سلسلة نصية إلى `write()`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز الأحرف لـ `chunk`. إذا كانت `chunk` عبارة عن `Buffer`، فسيكون `encoding` هو `'buffer'`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء (اختيارية مع وسيطة خطأ) يتم استدعاؤها عند اكتمال المعالجة للأجزاء المقدمة.

يجب عدم استدعاء هذه الدالة مباشرةً بواسطة كود التطبيق. يجب تنفيذه بواسطة الفئات الفرعية، ويتم استدعاؤه بواسطة طرق فئة `Writable` الداخلية فقط.

يمكن تنفيذ طريقة `writable._writev()` بالإضافة إلى أو بدلاً من `writable._write()` في تطبيقات التدفق القادرة على معالجة أجزاء متعددة من البيانات مرة واحدة. إذا تم تنفيذه وإذا كانت هناك بيانات مخزنة مؤقتًا من عمليات الكتابة السابقة، فسيتم استدعاء `_writev()` بدلاً من `_write()`.

يتم بادئة طريقة `writable._writev()` بشرطة سفلية لأنها داخلية للفئة التي تحددها، ولا يجب استدعاؤها مباشرةً بواسطة برامج المستخدم.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**تمت الإضافة في: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) خطأ محتمل.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء تأخذ وسيطة خطأ اختيارية.

يتم استدعاء طريقة `_destroy()` بواسطة [`writable.destroy()`](/ar/nodejs/api/stream#writabledestroyerror). يمكن تجاوزه بواسطة الفئات الفرعية ولكن **يجب عدم** استدعاؤه مباشرةً.


#### `writable._final(callback)` {#writable_finalcallback}

**تمت الإضافة في: الإصدار v8.0.0**

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) قم باستدعاء هذه الدالة (اختياريًا مع وسيطة خطأ) عند الانتهاء من كتابة أي بيانات متبقية.

يجب **عدم** استدعاء الطريقة `_final()` مباشرة. قد يتم تنفيذها بواسطة الفئات الفرعية، وإذا كان الأمر كذلك، فسيتم استدعاؤها بواسطة طرق فئة `Writable` الداخلية فقط.

سيتم استدعاء هذه الدالة الاختيارية قبل إغلاق التدفق، مما يؤخر حدث `'finish'` حتى يتم استدعاء `callback`. هذا مفيد لإغلاق الموارد أو كتابة البيانات المخزنة مؤقتًا قبل انتهاء التدفق.

#### الأخطاء أثناء الكتابة {#errors-while-writing}

يجب نشر الأخطاء التي تحدث أثناء معالجة الطرق [`writable._write()`](/ar/nodejs/api/stream#writable_writechunk-encoding-callback) و [`writable._writev()`](/ar/nodejs/api/stream#writable_writevchunks-callback) و [`writable._final()`](/ar/nodejs/api/stream#writable_finalcallback) عن طريق استدعاء رد الاتصال وتمرير الخطأ كوسيطة أولى. يؤدي طرح `Error` من داخل هذه الطرق أو إصدار حدث `'error'` يدويًا إلى سلوك غير محدد.

إذا قام تدفق `Readable` بالتوصيل في تدفق `Writable` عندما يصدر `Writable` خطأً، فسيتم فك توصيل تدفق `Readable`.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### مثال على تدفق قابل للكتابة {#an-example-writable-stream}

يوضح ما يلي تطبيقًا مبسطًا إلى حد ما (وغير مجدٍ إلى حد ما) لتدفق `Writable` مخصص. على الرغم من أن مثيل تدفق `Writable` المحدد هذا ليس له أي فائدة حقيقية معينة، إلا أن المثال يوضح كل العناصر المطلوبة لمثيل تدفق [`Writable`](/ar/nodejs/api/stream#class-streamwritable) مخصص:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### فك ترميز المخازن المؤقتة في دفق قابل للكتابة {#decoding-buffers-in-a-writable-stream}

يعد فك ترميز المخازن المؤقتة مهمة شائعة، على سبيل المثال، عند استخدام المحولات التي يكون إدخالها سلسلة. هذه ليست عملية بسيطة عند استخدام ترميز الأحرف متعددة البايت، مثل UTF-8. يوضح المثال التالي كيفية فك ترميز السلاسل متعددة البايت باستخدام `StringDecoder` و [`Writable`](/ar/nodejs/api/stream#class-streamwritable).

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### تطبيق دفق قابل للقراءة {#implementing-a-readable-stream}

يتم توسيع الفئة `stream.Readable` لتطبيق دفق [`Readable`](/ar/nodejs/api/stream#class-streamreadable).

يجب على تدفقات `Readable` المخصصة *استدعاء* الدالة الإنشائية `new stream.Readable([options])` وتنفيذ الأسلوب [`readable._read()`](/ar/nodejs/api/stream#readable_readsize).

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0 | زيادة highWaterMark الافتراضي. |
| v15.5.0 | دعم تمرير AbortSignal. |
| v14.0.0 | تغيير الخيار `autoDestroy` الافتراضي إلى `true`. |
| v11.2.0, v10.16.0 | إضافة الخيار `autoDestroy` لـ `destroy()` الدفق تلقائيًا عند إصداره لـ `'end'` أو أخطاء. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى [لعدد البايتات](/ar/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding) لتخزينها في المخزن المؤقت الداخلي قبل التوقف عن القراءة من المورد الأساسي. **الافتراضي:** `65536` (64 كيلوبايت)، أو `16` لتدفقات `objectMode`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا تم تحديده، فسيتم فك ترميز المخازن المؤقتة إلى سلاسل باستخدام الترميز المحدد. **الافتراضي:** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان يجب أن يتصرف هذا الدفق كدفق من الكائنات. بمعنى أن [`stream.read(n)`](/ar/nodejs/api/stream#readablereadsize) يُرجع قيمة واحدة بدلاً من `Buffer` بحجم `n`. **الافتراضي:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان يجب أن يصدر الدفق `'close'` بعد تدميره أم لا. **الافتراضي:** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للأسلوب [`stream._read()`](/ar/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للأسلوب [`stream._destroy()`](/ar/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للأسلوب [`stream._construct()`](/ar/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان يجب على هذا الدفق استدعاء `.destroy()` تلقائيًا بعد الانتهاء. **الافتراضي:** `true`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) إشارة تمثل الإلغاء المحتمل.



```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Calls the stream.Readable(options) constructor.
    super(options);
    // ...
  }
}
```
أو، عند استخدام الدوال الإنشائية بنمط ما قبل ES6:

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
أو، باستخدام أسلوب الدالة الإنشائية المبسط:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
سيؤدي استدعاء `abort` على `AbortController` المطابق لـ `AbortSignal` الذي تم تمريره إلى التصرف بنفس طريقة استدعاء `.destroy(new AbortError())` على القراءة التي تم إنشاؤها.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Later, abort the operation closing the stream
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**أضيف في:** الإصدار v15.0.0

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) قم باستدعاء هذه الدالة (اختياريًا مع وسيط خطأ) عند انتهاء تهيئة التدفق.

يجب عدم استدعاء الأسلوب `_construct()` مباشرةً. يمكن تنفيذه بواسطة الأصناف الفرعية، وإذا كان الأمر كذلك، فسيتم استدعاؤه بواسطة الأساليب الداخلية لصنف `Readable` فقط.

سيتم جدولة هذه الدالة الاختيارية في الدورة التالية بواسطة مُنشئ التدفق، مما يؤخر أي استدعاءات لـ `_read()` و `_destroy()` حتى يتم استدعاء `callback`. هذا مفيد لتهيئة الحالة أو تهيئة الموارد بشكل غير متزامن قبل أن يتم استخدام التدفق.

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**أضيف في:** الإصدار v0.9.4

- `size` [\<عدد\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات التي يجب قراءتها بشكل غير متزامن

يجب عدم استدعاء هذه الدالة مباشرةً بواسطة كود التطبيق. يجب تنفيذها بواسطة الأصناف الفرعية، ويتم استدعاؤها بواسطة الأساليب الداخلية لصنف `Readable` فقط.

يجب على جميع تطبيقات تدفق `Readable` توفير تنفيذ للأسلوب [`readable._read()`](/ar/nodejs/api/stream#readable_readsize) لجلب البيانات من المورد الأساسي.

عند استدعاء [`readable._read()`](/ar/nodejs/api/stream#readable_readsize)، إذا كانت البيانات متاحة من المورد، يجب أن يبدأ التنفيذ في دفع تلك البيانات إلى قائمة القراءة باستخدام الأسلوب [`this.push(dataChunk)`](/ar/nodejs/api/stream#readablepushchunk-encoding). سيتم استدعاء `_read()` مرة أخرى بعد كل استدعاء لـ [`this.push(dataChunk)`](/ar/nodejs/api/stream#readablepushchunk-encoding) بمجرد أن يصبح التدفق جاهزًا لقبول المزيد من البيانات. يمكن أن تستمر `_read()` في القراءة من المورد ودفع البيانات حتى تُرجع `readable.push()` القيمة `false`. فقط عندما يتم استدعاء `_read()` مرة أخرى بعد أن توقفت، يجب أن تستأنف دفع بيانات إضافية إلى القائمة.

بمجرد استدعاء الأسلوب [`readable._read()`](/ar/nodejs/api/stream#readable_readsize)، لن يتم استدعاؤه مرة أخرى حتى يتم دفع المزيد من البيانات من خلال الأسلوب [`readable.push()`](/ar/nodejs/api/stream#readablepushchunk-encoding). البيانات الفارغة مثل المخازن المؤقتة والسلاسل الفارغة لن تتسبب في استدعاء [`readable._read()`](/ar/nodejs/api/stream#readable_readsize).

الوسيطة `size` هي استشارية. بالنسبة للتطبيقات التي تكون فيها "القراءة" عملية واحدة تُرجع البيانات، يمكن استخدام الوسيطة `size` لتحديد مقدار البيانات المراد جلبها. قد تتجاهل التطبيقات الأخرى هذه الوسيطة وتوفر البيانات ببساطة متى أصبحت متاحة. ليست هناك حاجة إلى "الانتظار" حتى يصبح `size` بايتًا متاحًا قبل استدعاء [`stream.push(chunk)`](/ar/nodejs/api/stream#readablepushchunk-encoding).

يتم تذييل الأسلوب [`readable._read()`](/ar/nodejs/api/stream#readable_readsize) بشرطة سفلية لأنه داخلي للصنف الذي يحدده، ويجب ألا يتم استدعاؤه مباشرةً بواسطة برامج المستخدم.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**أضيف في: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) خطأ محتمل.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء تأخذ وسيطًا اختياريًا للخطأ.

يتم استدعاء الدالة `_destroy()` بواسطة [`readable.destroy()`](/ar/nodejs/api/stream#readabledestroyerror). يمكن تجاوزها بواسطة الأصناف الفرعية ولكن **يجب عدم** استدعائها مباشرة.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.0.0, v20.13.0 | يمكن أن يكون الوسيط `chunk` الآن نسخة من `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون الوسيط `chunk` الآن نسخة من `Uint8Array`. |
:::

- `chunk` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) جزء من البيانات لإضافته إلى قائمة القراءة. بالنسبة للدفقات التي لا تعمل في وضع الكائنات، يجب أن يكون `chunk` عبارة عن [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). بالنسبة لدفقات وضع الكائنات، يمكن أن تكون `chunk` أي قيمة JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز أجزاء السلسلة النصية. يجب أن يكون ترميز `Buffer` صالحًا، مثل `'utf8'` أو `'ascii'`.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كان من الممكن الاستمرار في إضافة أجزاء إضافية من البيانات؛ خلاف ذلك `false`.

عندما يكون `chunk` عبارة عن [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) أو [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)، ستتم إضافة `chunk` البيانات إلى القائمة الداخلية لمستخدمي الدفق لاستهلاكها. يؤدي تمرير `chunk` كـ `null` إلى الإشارة إلى نهاية الدفق (EOF)، وبعد ذلك لا يمكن كتابة المزيد من البيانات.

عندما يعمل `Readable` في الوضع المتوقف مؤقتًا، يمكن قراءة البيانات المضافة باستخدام `readable.push()` عن طريق استدعاء الدالة [`readable.read()`](/ar/nodejs/api/stream#readablereadsize) عند إطلاق الحدث [`'readable'`](/ar/nodejs/api/stream#event-readable).

عندما يعمل `Readable` في وضع التدفق، سيتم تسليم البيانات المضافة باستخدام `readable.push()` عن طريق إطلاق الحدث `'data'`.

تم تصميم الدالة `readable.push()` لتكون مرنة قدر الإمكان. على سبيل المثال، عند تغليف مصدر منخفض المستوى يوفر شكلاً من أشكال آلية الإيقاف المؤقت/الاستئناف، واستدعاء رد نداء للبيانات، يمكن تغليف المصدر منخفض المستوى بواسطة نسخة `Readable` مخصصة:

```js [ESM]
// `_source` هو كائن لديه دوال readStop() و readStart()،
// وعضو `ondata` يتم استدعاؤه عندما يكون لديه بيانات، و
// عضو `onend` يتم استدعاؤه عندما تنتهي البيانات.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // في كل مرة توجد بيانات، ادفعها إلى المخزن المؤقت الداخلي.
    this._source.ondata = (chunk) => {
      // إذا أرجعت push() قيمة false، فتوقف عن القراءة من المصدر.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // عندما ينتهي المصدر، ادفع جزء `null` الذي يشير إلى EOF.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // سيتم استدعاء _read() عندما يريد الدفق سحب المزيد من البيانات.
  // يتم تجاهل وسيط الحجم الاستشاري في هذه الحالة.
  _read(size) {
    this._source.readStart();
  }
}
```
تُستخدم الدالة `readable.push()` لدفع المحتوى إلى المخزن المؤقت الداخلي. يمكن تشغيلها بواسطة الدالة [`readable._read()`](/ar/nodejs/api/stream#readable_readsize).

بالنسبة للدفقات التي لا تعمل في وضع الكائنات، إذا كان المعامل `chunk` الخاص بـ `readable.push()` هو `undefined`، فسيعامل على أنه سلسلة أو مخزن مؤقت فارغ. راجع [`readable.push('')`](/ar/nodejs/api/stream#readablepush) لمزيد من المعلومات.


#### أخطاء أثناء القراءة {#errors-while-reading}

يجب نشر الأخطاء التي تحدث أثناء معالجة [`readable._read()`](/ar/nodejs/api/stream#readable_readsize) من خلال الطريقة [`readable.destroy(err)`](/ar/nodejs/api/stream#readable_destroyerr-callback). يؤدي طرح `Error` من داخل [`readable._read()`](/ar/nodejs/api/stream#readable_readsize) أو إصدار حدث `'error'` يدويًا إلى سلوك غير محدد.

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### مثال لتدفق عد {#an-example-counting-stream}

فيما يلي مثال أساسي لتدفق `Readable` يصدر الأرقام من 1 إلى 1,000,000 بترتيب تصاعدي، ثم ينتهي.

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### تنفيذ تدفق مزدوج {#implementing-a-duplex-stream}

التدفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) هو التدفق الذي ينفذ كلا من [`Readable`](/ar/nodejs/api/stream#class-streamreadable) و [`Writable`](/ar/nodejs/api/stream#class-streamwritable)، مثل اتصال مقبس TCP.

نظرًا لأن JavaScript لا تدعم الوراثة المتعددة، يتم توسيع فئة `stream.Duplex` لتنفيذ تدفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) (بدلاً من توسيع فئتي `stream.Readable` *و* `stream.Writable`).

ترث فئة `stream.Duplex` نموذجيًا من `stream.Readable` وتطفليًا من `stream.Writable`، لكن `instanceof` ستعمل بشكل صحيح لكلا الفئتين الأساسيتين بسبب تجاوز [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) على `stream.Writable`.

يجب على تدفقات `Duplex` المخصصة *استدعاء* الدالة الإنشائية `new stream.Duplex([options])` وتنفيذ *كلتا* الطريقتين [`readable._read()`](/ar/nodejs/api/stream#readable_readsize) و `writable._write()`.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v8.4.0 | يتم الآن دعم خيارات `readableHighWaterMark` و `writableHighWaterMark`. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تم تمريرها إلى كل من منشئي `Writable` و `Readable`. يحتوي أيضًا على الحقول التالية:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينه على `false`، فسينهي الدفق تلقائيًا الجانب القابل للكتابة عند انتهاء الجانب القابل للقراءة. **الافتراضي:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد ما إذا كان يجب أن يكون `Duplex` قابلاً للقراءة. **الافتراضي:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد ما إذا كان يجب أن يكون `Duplex` قابلاً للكتابة. **الافتراضي:** `true`.
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد `objectMode` للجانب القابل للقراءة من الدفق. ليس له أي تأثير إذا كان `objectMode` هو `true`. **الافتراضي:** `false`.
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يحدد `objectMode` للجانب القابل للكتابة من الدفق. ليس له أي تأثير إذا كان `objectMode` هو `true`. **الافتراضي:** `false`.
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد `highWaterMark` للجانب القابل للقراءة من الدفق. ليس له أي تأثير إذا تم توفير `highWaterMark`.
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد `highWaterMark` للجانب القابل للكتابة من الدفق. ليس له أي تأثير إذا تم توفير `highWaterMark`.

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
أو، عند استخدام منشئات نمط ما قبل ES6:

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
أو، باستخدام طريقة المنشئ المبسطة:

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
عند استخدام خط الأنابيب:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // قبول إدخال السلسلة بدلاً من المخازن المؤقتة
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // تأكد من أنه json صالح.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('فشل', err);
    } else {
      console.log('اكتمل');
    }
  },
);
```

#### مثال لدفق مزدوج {#an-example-duplex-stream}

يوضح ما يلي مثالًا بسيطًا لدفق `Duplex` يلتف حول كائن مصدر ذي مستوى أدنى افتراضي يمكن الكتابة إليه البيانات، ويمكن قراءة البيانات منه، وإن كان ذلك باستخدام واجهة برمجة تطبيقات غير متوافقة مع دفقات Node.js. يوضح ما يلي مثالًا بسيطًا لدفق `Duplex` يقوم بتخزين البيانات المكتوبة الواردة مؤقتًا عبر واجهة [`Writable`](/ar/nodejs/api/stream#class-streamwritable) التي تتم قراءتها مرة أخرى عبر واجهة [`Readable`](/ar/nodejs/api/stream#class-streamreadable).

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // يتعامل المصدر الأساسي فقط مع السلاسل.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
أهم جانب في دفق `Duplex` هو أن جانبي `Readable` و `Writable` يعملان بشكل مستقل عن بعضهما البعض على الرغم من التعايش داخل مثيل كائن واحد.

#### دفقات مزدوجة لوضع الكائن {#object-mode-duplex-streams}

بالنسبة لدفقات `Duplex`، يمكن تعيين `objectMode` حصريًا إما لجانب `Readable` أو `Writable` باستخدام خيارات `readableObjectMode` و `writableObjectMode` على التوالي.

في المثال التالي، على سبيل المثال، يتم إنشاء دفق `Transform` جديد (وهو نوع من دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex)) يحتوي على جانب `Writable` لوضع الكائن يقبل أرقام JavaScript التي يتم تحويلها إلى سلاسل سداسية عشرية على جانب `Readable`.

```js [ESM]
const { Transform } = require('node:stream');

// جميع دفقات Transform هي أيضًا دفقات Duplex.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // إجبار الجزء على أن يكون رقمًا إذا لزم الأمر.
    chunk |= 0;

    // تحويل الجزء إلى شيء آخر.
    const data = chunk.toString(16);

    // دفع البيانات إلى قائمة الانتظار القابلة للقراءة.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// يطبع: 01
myTransform.write(10);
// يطبع: 0a
myTransform.write(100);
// يطبع: 64
```

### تنفيذ دفق تحويل {#implementing-a-transform-stream}

دفق [`Transform`](/ar/nodejs/api/stream#class-streamtransform) هو دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex) حيث يتم حساب الإخراج بطريقة ما من الإدخال. تتضمن الأمثلة دفقات [zlib](/ar/nodejs/api/zlib) أو دفقات [crypto](/ar/nodejs/api/crypto) التي تضغط أو تشفر أو تفك تشفير البيانات.

ليس هناك شرط بأن يكون الإخراج بنفس حجم الإدخال، أو نفس عدد الأجزاء، أو أن يصل في نفس الوقت. على سبيل المثال، سيكون لدفق `Hash` جزء واحد فقط من الإخراج يتم توفيره عند انتهاء الإدخال. سينتج دفق `zlib` إخراجًا أصغر أو أكبر بكثير من إدخاله.

يتم توسيع فئة `stream.Transform` لتنفيذ دفق [`Transform`](/ar/nodejs/api/stream#class-streamtransform).

ترث فئة `stream.Transform` بشكل أولي من `stream.Duplex` وتنفذ إصداراتها الخاصة من الأساليب `writable._write()` و [`readable._read()`](/ar/nodejs/api/stream#readable_readsize). يجب على تطبيقات `Transform` المخصصة *تنفيذ* الأسلوب [`transform._transform()`](/ar/nodejs/api/stream#transform_transformchunk-encoding-callback) و *يجوز* أيضًا تنفيذ الأسلوب [`transform._flush()`](/ar/nodejs/api/stream#transform_flushcallback).

يجب توخي الحذر عند استخدام دفقات `Transform` حيث أن البيانات المكتوبة إلى الدفق يمكن أن تتسبب في توقف جانب `Writable` من الدفق مؤقتًا إذا لم يتم استهلاك الإخراج على جانب `Readable`.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يتم تمريرها إلى كل من منشئات `Writable` و `Readable`. يحتوي أيضًا على الحقول التالية:
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للأسلوب [`stream._transform()`](/ar/nodejs/api/stream#transform_transformchunk-encoding-callback).
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تنفيذ للأسلوب [`stream._flush()`](/ar/nodejs/api/stream#transform_flushcallback).

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
أو، عند استخدام منشئات نمط ما قبل ES6:

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
أو، باستخدام نهج المنشئ المبسط:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### الحدث: `'end'` {#event-end_1}

الحدث [`'end'`](/ar/nodejs/api/stream#event-end) يأتي من الصنف `stream.Readable`. يُطلق الحدث `'end'` بعد إخراج جميع البيانات، ويحدث ذلك بعد استدعاء رد النداء في [`transform._flush()`](/ar/nodejs/api/stream#transform_flushcallback). في حالة حدوث خطأ، لا ينبغي إطلاق `'end'`.

#### الحدث: `'finish'` {#event-finish_1}

الحدث [`'finish'`](/ar/nodejs/api/stream#event-finish) يأتي من الصنف `stream.Writable`. يُطلق الحدث `'finish'` بعد استدعاء [`stream.end()`](/ar/nodejs/api/stream#writableendchunk-encoding-callback) وبعد معالجة جميع الأجزاء بواسطة [`stream._transform()`](/ar/nodejs/api/stream#transform_transformchunk-encoding-callback). في حالة حدوث خطأ، لا ينبغي إطلاق `'finish'`.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء (اختياريًا مع وسيطة خطأ وبيانات) ليتم استدعاؤها عند تدفق البيانات المتبقية.

يجب ألا يتم استدعاء هذه الدالة بواسطة كود التطبيق مباشرة. يجب أن يتم تنفيذها بواسطة الأصناف الفرعية، ويتم استدعاؤها بواسطة طرق الصنف `Readable` الداخلية فقط.

في بعض الحالات، قد تحتاج عملية التحويل إلى إخراج جزء إضافي من البيانات في نهاية التدفق. على سبيل المثال، سيقوم تدفق ضغط `zlib` بتخزين قدر من الحالة الداخلية المستخدمة لضغط الإخراج على النحو الأمثل. ومع ذلك، عند انتهاء التدفق، يجب تدفق هذه البيانات الإضافية حتى تكون البيانات المضغوطة كاملة.

قد تقوم تطبيقات [`Transform`](/ar/nodejs/api/stream#class-streamtransform) المخصصة *بتنفيذ* الطريقة `transform._flush()`. سيتم استدعاء هذا عندما لا تكون هناك بيانات مكتوبة أخرى ليتم استهلاكها، ولكن قبل إطلاق الحدث [`'end'`](/ar/nodejs/api/stream#event-end) الذي يشير إلى نهاية تدفق [`Readable`](/ar/nodejs/api/stream#class-streamreadable).

في تطبيق `transform._flush()`، يمكن استدعاء الطريقة `transform.push()` صفر أو أكثر من المرات، حسب الاقتضاء. يجب استدعاء دالة `callback` عند اكتمال عملية التدفق.

تُسبق الطريقة `transform._flush()` بشرطة سفلية لأنها داخلية للصنف الذي يحددها، ولا ينبغي أبدًا استدعاؤها مباشرة بواسطة برامج المستخدم.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ‏`Buffer` الذي سيتم تحويله، محولاً من `string` الذي تم تمريره إلى [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback). إذا كان خيار `decodeStrings` للدفق هو `false` أو كان الدفق يعمل في وضع الكائن، فلن يتم تحويل الكتلة وستكون أي شيء تم تمريره إلى [`stream.write()`](/ar/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت الكتلة عبارة عن سلسلة، فهذا هو نوع الترميز. إذا كانت الكتلة عبارة عن مخزن مؤقت، فهذه هي القيمة الخاصة `'buffer'`. تجاهلها في هذه الحالة.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد اتصال (اختياريًا مع وسيطة خطأ وبيانات) يتم استدعاؤها بعد معالجة `chunk` المقدمة.

يجب عدم استدعاء هذه الدالة بواسطة كود التطبيق مباشرةً. يجب أن يتم تنفيذها بواسطة فئات فرعية، ويتم استدعاؤها بواسطة الطرق الداخلية لفئة `Readable` فقط.

يجب على جميع تطبيقات دفق `Transform` توفير طريقة `_transform()` لقبول الإدخال وإنتاج الإخراج. يتعامل تنفيذ `transform._transform()` مع البايتات التي تتم كتابتها، ويحسب الإخراج، ثم يمرر هذا الإخراج إلى الجزء القابل للقراءة باستخدام طريقة `transform.push()`.

يمكن استدعاء طريقة `transform.push()` صفر أو أكثر من المرات لإنشاء إخراج من كتلة إدخال واحدة، اعتمادًا على مقدار الإخراج الناتج عن الكتلة.

من الممكن عدم إنشاء أي إخراج من أي كتلة معينة من بيانات الإدخال.

يجب استدعاء دالة `callback` فقط عند استهلاك الكتلة الحالية بالكامل. يجب أن تكون الوسيطة الأولى التي يتم تمريرها إلى `callback` كائن `Error` إذا حدث خطأ أثناء معالجة الإدخال أو `null` بخلاف ذلك. إذا تم تمرير وسيطة ثانية إلى `callback`، فسيتم إرسالها إلى طريقة `transform.push()`، ولكن فقط إذا كانت الوسيطة الأولى خاطئة. بمعنى آخر، ما يلي متكافئ:

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
يتم بادئة طريقة `transform._transform()` بشرطة سفلية لأنها داخلية للفئة التي تحددها، ويجب عدم استدعاؤها مباشرةً بواسطة برامج المستخدم.

لا يتم استدعاء `transform._transform()` بالتوازي أبدًا؛ تقوم التدفقات بتنفيذ آلية قائمة الانتظار، ولتلقي الكتلة التالية، يجب استدعاء `callback`، إما بشكل متزامن أو غير متزامن.


#### الفئة: `stream.PassThrough` {#class-streampassthrough}

الفئة `stream.PassThrough` هي تطبيق بسيط لتيار [`Transform`](/ar/nodejs/api/stream#class-streamtransform) الذي يمرر ببساطة وحدات البايت المدخلة إلى المخرجات. والغرض منه في المقام الأول هو الأمثلة والاختبارات، ولكن هناك بعض حالات الاستخدام حيث يكون `stream.PassThrough` مفيدًا ككتلة بناء لأنواع جديدة من التدفقات.

## ملاحظات إضافية {#additional-notes}

### توافق التدفقات مع المولدات غير المتزامنة والمكررات غير المتزامنة {#streams-compatibility-with-async-generators-and-async-iterators}

بدعم من المولدات والمكررات غير المتزامنة في JavaScript، أصبحت المولدات غير المتزامنة الآن بشكل فعال بناء تدفق من الدرجة الأولى على مستوى اللغة.

فيما يلي بعض حالات التشغيل المشترك الشائعة لاستخدام تدفقات Node.js مع المولدات غير المتزامنة والمكررات غير المتزامنة.

#### استهلاك التدفقات القابلة للقراءة باستخدام المكررات غير المتزامنة {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
تسجل المكررات غير المتزامنة معالج أخطاء دائمًا في الدفق لمنع أي أخطاء غير معالجة بعد التدمير.

#### إنشاء تدفقات قابلة للقراءة باستخدام مولدات غير متزامنة {#creating-readable-streams-with-async-generators}

يمكن إنشاء تدفق Node.js قابل للقراءة من مولد غير متزامن باستخدام طريقة الأداة المساعدة `Readable.from()`:

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### توجيه إلى تدفقات قابلة للكتابة من المكررات غير المتزامنة {#piping-to-writable-streams-from-async-iterators}

عند الكتابة إلى دفق قابل للكتابة من مكرر غير متزامن، تأكد من المعالجة الصحيحة للضغط الخلفي والأخطاء. [`stream.pipeline()`](/ar/nodejs/api/stream#streampipelinesource-transforms-destination-callback) تجرد معالجة الضغط الخلفي والأخطاء المتعلقة بالضغط الخلفي:

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### التوافق مع إصدارات Node.js القديمة {#compatibility-with-older-nodejs-versions}

قبل Node.js 0.10، كانت واجهة تدفق `Readable` أبسط، ولكنها أيضًا أقل قوة وأقل فائدة.

- بدلاً من انتظار استدعاءات الطريقة [`stream.read()`](/ar/nodejs/api/stream#readablereadsize)، ستبدأ أحداث [`'data'`](/ar/nodejs/api/stream#event-data) في الانبعاث على الفور. كانت التطبيقات التي تحتاج إلى إجراء بعض الأعمال لتحديد كيفية معالجة البيانات مطلوبة لتخزين البيانات المقروءة في المخازن المؤقتة حتى لا تضيع البيانات.
- كانت الطريقة [`stream.pause()`](/ar/nodejs/api/stream#readablepause) استشارية، وليست مضمونة. هذا يعني أنه كان لا يزال من الضروري الاستعداد لتلقي أحداث [`'data'`](/ar/nodejs/api/stream#event-data) *حتى عندما كان التدفق في حالة إيقاف مؤقت*.

في Node.js 0.10، تمت إضافة الفئة [`Readable`](/ar/nodejs/api/stream#class-streamreadable). للتوافق مع الإصدارات السابقة مع برامج Node.js القديمة، تتحول تدفقات `Readable` إلى "وضع التدفق" عند إضافة معالج أحداث [`'data'`](/ar/nodejs/api/stream#event-data)، أو عند استدعاء الطريقة [`stream.resume()`](/ar/nodejs/api/stream#readableresume). التأثير هو أنه، حتى عند عدم استخدام الطريقة الجديدة [`stream.read()`](/ar/nodejs/api/stream#readablereadsize) وحدث [`'readable'`](/ar/nodejs/api/stream#event-readable)، لم يعد من الضروري القلق بشأن فقدان أجزاء [`'data'`](/ar/nodejs/api/stream#event-data).

في حين أن معظم التطبيقات ستستمر في العمل بشكل طبيعي، إلا أن هذا يقدم حالة حافة في الحالات التالية:

- لم تتم إضافة أي مستمع حدث [`'data'`](/ar/nodejs/api/stream#event-data).
- لم يتم استدعاء الطريقة [`stream.resume()`](/ar/nodejs/api/stream#readableresume) أبدًا.
- لا يتم توجيه التدفق إلى أي وجهة قابلة للكتابة.

على سبيل المثال، ضع في اعتبارك الكود التالي:

```js [ESM]
// تحذير! معطل!
net.createServer((socket) => {

  // نضيف مستمع 'end'، لكننا لا نستهلك البيانات أبدًا.
  socket.on('end', () => {
    // لن يصل إلى هنا أبدًا.
    socket.end('تم استلام الرسالة ولكن لم تتم معالجتها.\n');
  });

}).listen(1337);
```
قبل Node.js 0.10، سيتم ببساطة تجاهل بيانات الرسالة الواردة. ومع ذلك، في Node.js 0.10 وما بعده، تظل المقبس متوقفة مؤقتًا إلى الأبد.

الحل البديل في هذه الحالة هو استدعاء الطريقة [`stream.resume()`](/ar/nodejs/api/stream#readableresume) لبدء تدفق البيانات:

```js [ESM]
// الحل البديل.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('تم استلام الرسالة ولكن لم تتم معالجتها.\n');
  });

  // ابدأ تدفق البيانات، وتجاهلها.
  socket.resume();
}).listen(1337);
```
بالإضافة إلى تدفقات `Readable` الجديدة التي تتحول إلى وضع التدفق، يمكن تضمين التدفقات ذات النمط السابق لـ 0.10 في فئة `Readable` باستخدام الطريقة [`readable.wrap()`](/ar/nodejs/api/stream#readablewrapstream).


### `readable.read(0)` {#readableread0}

هناك بعض الحالات التي يكون فيها من الضروري تحفيز تحديث آليات تدفق القراءة الأساسية، دون استهلاك أي بيانات فعليًا. في مثل هذه الحالات، من الممكن استدعاء `readable.read(0)`، والذي سيعيد دائمًا `null`.

إذا كان مخزن القراءة الداخلي أقل من `highWaterMark`، ولم يكن التدفق يقرأ حاليًا، فسيؤدي استدعاء `stream.read(0)` إلى تحفيز استدعاء منخفض المستوى لـ [`stream._read()`](/ar/nodejs/api/stream#readable_readsize).

في حين أن معظم التطبيقات نادرًا ما تحتاج إلى القيام بذلك، إلا أن هناك مواقف داخل Node.js يتم فيها ذلك، لا سيما في الأجزاء الداخلية لفئة تدفق `Readable`.

### `readable.push('')` {#readablepush}

لا يوصى باستخدام `readable.push('')`.

دفع [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أو [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) أو [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) صفرية البايت إلى تدفق ليس في وضع الكائن له تأثير جانبي مثير للاهتمام. نظرًا لأنه *استدعاء* إلى [`readable.push()`](/ar/nodejs/api/stream#readablepushchunk-encoding)، سينهي الاستدعاء عملية القراءة. ومع ذلك، نظرًا لأن الوسيطة عبارة عن سلسلة فارغة، لا تتم إضافة أي بيانات إلى مخزن القراءة، لذلك لا يوجد شيء يمكن للمستخدم استهلاكه.

### التباين في `highWaterMark` بعد استدعاء `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

سيغير استخدام `readable.setEncoding()` سلوك كيفية عمل `highWaterMark` في الوضع غير الكائن.

عادةً، يتم قياس حجم المخزن المؤقت الحالي مقابل `highWaterMark` في *بايت*. ومع ذلك، بعد استدعاء `setEncoding()`، ستبدأ دالة المقارنة في قياس حجم المخزن المؤقت بـ *الأحرف*.

ليست هذه مشكلة في الحالات الشائعة مع `latin1` أو `ascii`. ولكن يُنصح بالانتباه إلى هذا السلوك عند العمل مع السلاسل التي قد تحتوي على أحرف متعددة البايت.

