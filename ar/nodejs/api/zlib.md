---
title: توثيق Node.js - Zlib
description: توفر وحدة zlib في Node.js وظائف الضغط باستخدام خوارزميات Gzip و Deflate/Inflate و Brotli. تشمل طرقًا متزامنة وغير متزامنة لضغط وفك ضغط البيانات، مع العديد من الخيارات لتخصيص سلوك الضغط.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة zlib في Node.js وظائف الضغط باستخدام خوارزميات Gzip و Deflate/Inflate و Brotli. تشمل طرقًا متزامنة وغير متزامنة لضغط وفك ضغط البيانات، مع العديد من الخيارات لتخصيص سلوك الضغط.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة zlib في Node.js وظائف الضغط باستخدام خوارزميات Gzip و Deflate/Inflate و Brotli. تشمل طرقًا متزامنة وغير متزامنة لضغط وفك ضغط البيانات، مع العديد من الخيارات لتخصيص سلوك الضغط.
---


# Zlib {#zlib}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ar/nodejs/api/documentation#stability-index) [Stability: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**Source Code:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

توفر الوحدة `node:zlib` وظائف الضغط المنفذة باستخدام Gzip و Deflate/Inflate و Brotli.

للوصول إليها:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

يعتمد الضغط وفك الضغط على واجهة برمجة تطبيقات Node.js [Streams API](/ar/nodejs/api/stream).

يمكن إنجاز ضغط أو فك ضغط دفق (مثل ملف) عن طريق تمرير دفق المصدر عبر دفق `Transform` الخاص بـ `zlib` إلى دفق الوجهة:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  }
});
```
:::

أو، باستخدام واجهة برمجة التطبيقات `pipeline` للوعد:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  });
```
:::

من الممكن أيضًا ضغط البيانات أو فك ضغطها في خطوة واحدة:

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('حدث خطأ:', err);
    process.exitCode = 1;
  });
```
:::

## اعتبارات الأداء والاستخدام لمجموعة الخيوط (Threadpool) {#threadpool-usage-and-performance-considerations}

تستخدم جميع واجهات برمجة التطبيقات (`zlib`)، باستثناء تلك المتزامنة بشكل صريح، مجموعة الخيوط الداخلية لـ Node.js. يمكن أن يؤدي ذلك إلى تأثيرات مفاجئة وقيود على الأداء في بعض التطبيقات.

يمكن أن يؤدي إنشاء واستخدام عدد كبير من كائنات zlib في وقت واحد إلى تجزئة كبيرة للذاكرة.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// تحذير: لا تفعل هذا!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// تحذير: لا تفعل هذا!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

في المثال السابق، يتم إنشاء 30,000 مثيل انكماش (deflate) بشكل متزامن. بسبب الطريقة التي تتعامل بها بعض أنظمة التشغيل مع تخصيص الذاكرة وإلغاء تخصيصها، قد يؤدي ذلك إلى تجزئة كبيرة للذاكرة.

يوصى بشدة بتخزين نتائج عمليات الضغط مؤقتًا لتجنب ازدواجية الجهد.

## ضغط طلبات واستجابات HTTP {#compressing-http-requests-and-responses}

يمكن استخدام وحدة `node:zlib` لتنفيذ دعم آليات ترميز المحتوى `gzip` و `deflate` و `br` المحددة بواسطة [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2).

يستخدم رأس [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) في طلب HTTP لتحديد ترميزات الضغط التي يقبلها العميل. يستخدم رأس [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) لتحديد ترميزات الضغط التي تم تطبيقها بالفعل على الرسالة.

الأمثلة الواردة أدناه مبسطة بشكل كبير لإظهار المفهوم الأساسي. يمكن أن يكون استخدام ترميز `zlib` مكلفًا، ويجب تخزين النتائج مؤقتًا. راجع [ضبط استخدام الذاكرة](/ar/nodejs/api/zlib#memory-usage-tuning) لمزيد من المعلومات حول المفاضلات بين السرعة/الذاكرة/الضغط المتضمنة في استخدام `zlib`.

::: code-group
```js [ESM]
// مثال على طلب العميل
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // أو، استخدم ببساطة zlib.createUnzip() للتعامل مع كلتا الحالتين التاليتين:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// مثال على طلب العميل
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // أو، استخدم ببساطة zlib.createUnzip() للتعامل مع كلتا الحالتين التاليتين:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// مثال الخادم
// تشغيل عملية gzip في كل طلب مكلف للغاية.
// سيكون من الأفضل بكثير تخزين المخزن المؤقت المضغوط مؤقتًا.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // قم بتخزين كل من الإصدار المضغوط وغير المضغوط من المورد.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // إذا حدث خطأ، فليس هناك الكثير الذي يمكننا فعله لأن
      // الخادم أرسل بالفعل رمز الاستجابة 200 و
      // تم بالفعل إرسال قدر معين من البيانات إلى العميل.
      // أفضل ما يمكننا فعله هو إنهاء الاستجابة على الفور
      // وتسجيل الخطأ.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // ملاحظة: هذا ليس محلل قبول-ترميز متوافق.
  // راجع https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// مثال الخادم
// تشغيل عملية gzip في كل طلب مكلف للغاية.
// سيكون من الأفضل بكثير تخزين المخزن المؤقت المضغوط مؤقتًا.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // قم بتخزين كل من الإصدار المضغوط وغير المضغوط من المورد.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // إذا حدث خطأ، فليس هناك الكثير الذي يمكننا فعله لأن
      // الخادم أرسل بالفعل رمز الاستجابة 200 و
      // تم بالفعل إرسال قدر معين من البيانات إلى العميل.
      // أفضل ما يمكننا فعله هو إنهاء الاستجابة على الفور
      // وتسجيل الخطأ.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // ملاحظة: هذا ليس محلل قبول-ترميز متوافق.
  // راجع https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

بشكل افتراضي، ستطرح طرق `zlib` خطأً عند فك ضغط البيانات المقطوعة. ومع ذلك، إذا كان من المعروف أن البيانات غير كاملة، أو كانت الرغبة هي فحص بداية ملف مضغوط فقط، فمن الممكن منع معالجة الأخطاء الافتراضية عن طريق تغيير طريقة التدفق المستخدمة لفك ضغط الجزء الأخير من بيانات الإدخال:

```js [ESM]
// هذا إصدار مختصر من المخزن المؤقت من الأمثلة أعلاه
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // بالنسبة إلى Brotli، فإن المكافئ هو zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
لن يغير هذا السلوك في حالات رمي الأخطاء الأخرى، على سبيل المثال عندما يكون لبيانات الإدخال تنسيق غير صالح. باستخدام هذه الطريقة، لن يكون من الممكن تحديد ما إذا كان الإدخال قد انتهى قبل الأوان أو يفتقر إلى فحوصات السلامة، مما يجعل من الضروري التحقق يدويًا من أن النتيجة التي تم فك ضغطها صالحة.


## ضبط استخدام الذاكرة {#memory-usage-tuning}

### لتدفقات البيانات المستندة إلى zlib {#for-zlib-based-streams}

من `zlib/zconf.h`، تم تعديله للاستخدام في Node.js:

متطلبات الذاكرة لـ deflate (بالبايت):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
أي: 128 كيلو بايت لـ `windowBits` = 15 + 128 كيلو بايت لـ `memLevel` = 8 (القيم الافتراضية) بالإضافة إلى بضعة كيلوبايت للكائنات الصغيرة.

على سبيل المثال، لتقليل متطلبات الذاكرة الافتراضية من 256 كيلو بايت إلى 128 كيلو بايت، يجب تعيين الخيارات إلى:

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
ومع ذلك، سيؤدي هذا عمومًا إلى تدهور الضغط.

متطلبات الذاكرة لـ inflate (بالبايت) هي `1 \<\< windowBits`. أي، 32 كيلو بايت لـ `windowBits` = 15 (القيمة الافتراضية) بالإضافة إلى بضعة كيلوبايت للكائنات الصغيرة.

هذا بالإضافة إلى مخزن مؤقت داخلي واحد للإخراج بحجم `chunkSize`، والذي يبلغ افتراضيًا 16 كيلو بايت.

تتأثر سرعة ضغط `zlib` بشكل كبير بإعداد `level`. سيؤدي المستوى الأعلى إلى ضغط أفضل، ولكنه سيستغرق وقتًا أطول لإكماله. سيؤدي المستوى الأدنى إلى ضغط أقل، ولكنه سيكون أسرع بكثير.

بشكل عام، تعني خيارات استخدام الذاكرة الأكبر أن Node.js يجب أن يقوم بإجراء عدد أقل من الاستدعاءات إلى `zlib` لأنه سيكون قادرًا على معالجة المزيد من البيانات في كل عملية `write`. لذا، هذا عامل آخر يؤثر على السرعة، على حساب استخدام الذاكرة.

### لتدفقات البيانات المستندة إلى Brotli {#for-brotli-based-streams}

توجد مكافئات لخيارات zlib لتدفقات البيانات المستندة إلى Brotli، على الرغم من أن هذه الخيارات لها نطاقات مختلفة عن خيارات zlib:

- يتطابق خيار `level` في zlib مع خيار `BROTLI_PARAM_QUALITY` في Brotli.
- يتطابق خيار `windowBits` في zlib مع خيار `BROTLI_PARAM_LGWIN` في Brotli.

راجع [أدناه](/ar/nodejs/api/zlib#brotli-constants) لمزيد من التفاصيل حول الخيارات الخاصة بـ Brotli.

## التنظيف {#flushing}

سيؤدي استدعاء [`.flush()`](/ar/nodejs/api/zlib#zlibflushkind-callback) على تدفق ضغط إلى جعل `zlib` يُرجع أكبر قدر ممكن من الإخراج حاليًا. قد يأتي هذا على حساب تدهور جودة الضغط، ولكن يمكن أن يكون مفيدًا عندما تكون البيانات بحاجة إلى أن تكون متاحة في أقرب وقت ممكن.

في المثال التالي، يتم استخدام `flush()` لكتابة استجابة HTTP جزئية مضغوطة إلى العميل:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## الثوابت {#constants}

**أُضيف في: الإصدار v0.5.8**

### ثوابت zlib {#zlib-constants}

تُعرَّف جميع الثوابت المُعرَّفة في `zlib.h` أيضًا في `require('node:zlib').constants`. في المسار الطبيعي للعمليات، لن يكون من الضروري استخدام هذه الثوابت. وُثِّقت حتى لا يكون وجودها مفاجئًا. هذا القسم مأخوذ مباشرة تقريبًا من [وثائق zlib](https://zlib.net/manual#Constants).

في السابق، كانت الثوابت متاحة مباشرة من `require('node:zlib')`، على سبيل المثال `zlib.Z_NO_FLUSH`. الوصول إلى الثوابت مباشرة من الوحدة النمطية ممكن حاليًا ولكنه مُهمل.

قيم التدفق المسموح بها.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

رموز الإرجاع لوظائف الضغط/إلغاء الضغط. القيم السالبة هي أخطاء، وتُستخدم القيم الموجبة للأحداث الخاصة ولكن العادية.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

مستويات الضغط.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

استراتيجية الضغط.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### ثوابت Brotli {#brotli-constants}

**أُضيف في: الإصدار v11.7.0, v10.16.0**

تتوفر عدة خيارات وثوابت أخرى لتدفقات Brotli:

#### عمليات التدفق {#flush-operations}

القيم التالية هي عمليات تدفق صالحة لتدفقات Brotli:

- `zlib.constants.BROTLI_OPERATION_PROCESS` (افتراضي لجميع العمليات)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (افتراضي عند استدعاء `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (افتراضي للشريحة الأخيرة)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - قد يكون من الصعب استخدام هذه العملية تحديدًا في سياق Node.js، حيث تجعل طبقة البث من الصعب معرفة البيانات التي ستنتهي في هذا الإطار. أيضًا، لا توجد حاليًا طريقة لاستهلاك هذه البيانات من خلال واجهة برمجة تطبيقات Node.js.


#### خيارات الضغط {#compressor-options}

هناك العديد من الخيارات التي يمكن تعيينها على مُرمِّزات Brotli، مما يؤثر على كفاءة الضغط وسرعته. يمكن الوصول إلى كل من المفاتيح والقيم كخصائص لكائن `zlib.constants`.

الخيارات الأكثر أهمية هي:

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (افتراضي)
    - `BROTLI_MODE_TEXT`، تم تعديله لنص UTF-8
    - `BROTLI_MODE_FONT`، تم تعديله لخطوط WOFF 2.0


- `BROTLI_PARAM_QUALITY`
    - تتراوح من `BROTLI_MIN_QUALITY` إلى `BROTLI_MAX_QUALITY`، مع قيمة افتراضية `BROTLI_DEFAULT_QUALITY`.


- `BROTLI_PARAM_SIZE_HINT`
    - قيمة عدد صحيح تمثل حجم الإدخال المتوقع؛ القيمة الافتراضية هي `0` لحجم إدخال غير معروف.



يمكن تعيين العلامات التالية للتحكم المتقدم في خوارزمية الضغط وضبط استخدام الذاكرة:

- `BROTLI_PARAM_LGWIN`
    - تتراوح من `BROTLI_MIN_WINDOW_BITS` إلى `BROTLI_MAX_WINDOW_BITS`، مع قيمة افتراضية `BROTLI_DEFAULT_WINDOW`، أو حتى `BROTLI_LARGE_MAX_WINDOW_BITS` إذا تم تعيين علامة `BROTLI_PARAM_LARGE_WINDOW`.


- `BROTLI_PARAM_LGBLOCK`
    - تتراوح من `BROTLI_MIN_INPUT_BLOCK_BITS` إلى `BROTLI_MAX_INPUT_BLOCK_BITS`.


- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - علامة منطقية تقلل من نسبة الضغط لصالح سرعة فك الضغط.


- `BROTLI_PARAM_LARGE_WINDOW`
    - علامة منطقية تمكن وضع "Large Window Brotli" (غير متوافق مع تنسيق Brotli كما هو موحد في [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


- `BROTLI_PARAM_NPOSTFIX`
    - تتراوح من `0` إلى `BROTLI_MAX_NPOSTFIX`.


- `BROTLI_PARAM_NDIRECT`
    - تتراوح من `0` إلى `15 \<\< NPOSTFIX` بخطوات `1 \<\< NPOSTFIX`.



#### خيارات فك الضغط {#decompressor-options}

هذه الخيارات المتقدمة متاحة للتحكم في فك الضغط:

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - علامة منطقية تؤثر على أنماط تخصيص الذاكرة الداخلية.


- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - علامة منطقية تمكن وضع "Large Window Brotli" (غير متوافق مع تنسيق Brotli كما هو موحد في [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


## الفئة: `Options` {#class-options}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v14.5.0, v12.19.0 | خيار `maxOutputLength` مدعوم الآن. |
| v9.4.0 | يمكن أن يكون خيار `dictionary` عبارة عن `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون خيار `dictionary` عبارة عن `Uint8Array` الآن. |
| v5.11.0 | خيار `finishFlush` مدعوم الآن. |
| v0.11.1 | تمت الإضافة في: v0.11.1 |
:::

تأخذ كل فئة تستند إلى zlib كائن `options`. لا توجد خيارات مطلوبة.

بعض الخيارات ذات صلة فقط عند الضغط ويتم تجاهلها بواسطة فئات فك الضغط.

- `flush` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `16 * 1024`
- `windowBits` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (الضغط فقط)
- `memLevel` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (الضغط فقط)
- `strategy` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (الضغط فقط)
- `dictionary` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (الضغط/تخفيف الضغط فقط، قاموس فارغ بشكل افتراضي)
- `info` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (إذا كانت `true`، تُرجع كائنًا يحتوي على `buffer` و `engine`.)
- `maxOutputLength` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحد من حجم الإخراج عند استخدام [طرق الراحة](/ar/nodejs/api/zlib#convenience-methods). **الافتراضي:** [`buffer.kMaxLength`](/ar/nodejs/api/buffer#bufferkmaxlength)

راجع وثائق [`deflateInit2` و `inflateInit2`](https://zlib.net/manual#Advanced) لمزيد من المعلومات.


## الفئة: `BrotliOptions` {#class-brotlioptions}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.5.0, v12.19.0 | خيار `maxOutputLength` مدعوم الآن. |
| v11.7.0 | تمت إضافته في: v11.7.0 |
:::

تأخذ كل فئة تعتمد على Brotli كائن `options`. جميع الخيارات اختيارية.

- `flush` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **الافتراضي:** `16 * 1024`
- `params` [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن قيم مفتاحية يحتوي على [معاملات Brotli](/ar/nodejs/api/zlib#brotli-constants) مفهرسة.
- `maxOutputLength` [\<عدد صحيح\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحد من حجم الإخراج عند استخدام [طرق الراحة](/ar/nodejs/api/zlib#convenience-methods). **الافتراضي:** [`buffer.kMaxLength`](/ar/nodejs/api/buffer#bufferkmaxlength)

على سبيل المثال:

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## الفئة: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**تمت إضافته في: v11.7.0, v10.16.0**

ضغط البيانات باستخدام خوارزمية Brotli.

## الفئة: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**تمت إضافته في: v11.7.0, v10.16.0**

فك ضغط البيانات باستخدام خوارزمية Brotli.

## الفئة: `zlib.Deflate` {#class-zlibdeflate}

**تمت إضافته في: v0.5.8**

ضغط البيانات باستخدام deflate.

## الفئة: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**تمت إضافته في: v0.5.8**

ضغط البيانات باستخدام deflate، وعدم إلحاق رأس `zlib`.

## الفئة: `zlib.Gunzip` {#class-zlibgunzip}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | ستؤدي البيانات المهملة في نهاية دفق الإدخال الآن إلى حدث `'error'`. |
| v5.9.0 | أعضاء ملف gzip المتسلسلين المتعددين مدعومون الآن. |
| v5.0.0 | سيؤدي دفق الإدخال المقطوع الآن إلى حدث `'error'`. |
| v0.5.8 | تمت إضافته في: v0.5.8 |
:::

فك ضغط دفق gzip.


## الفئة: `zlib.Gzip` {#class-zlibgzip}

**أُضيف في: الإصدار v0.5.8**

ضغط البيانات باستخدام gzip.

## الفئة: `zlib.Inflate` {#class-zlibinflate}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.0.0 | سيؤدي الآن دفق إدخال مبتور إلى حدث `'error'`. |
| v0.5.8 | أُضيف في: الإصدار v0.5.8 |
:::

فك ضغط دفق deflate.

## الفئة: `zlib.InflateRaw` {#class-zlibinflateraw}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v6.8.0 | يتم الآن دعم القواميس المخصصة بواسطة `InflateRaw`. |
| v5.0.0 | سيؤدي الآن دفق إدخال مبتور إلى حدث `'error'`. |
| v0.5.8 | أُضيف في: الإصدار v0.5.8 |
:::

فك ضغط دفق deflate خام.

## الفئة: `zlib.Unzip` {#class-zlibunzip}

**أُضيف في: الإصدار v0.5.8**

فك ضغط دفق مضغوط إما بـ Gzip أو Deflate عن طريق الكشف التلقائي عن الرأس.

## الفئة: `zlib.ZlibBase` {#class-zlibzlibbase}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v11.7.0, v10.16.0 | تم تغيير اسم هذه الفئة من `Zlib` إلى `ZlibBase`. |
| v0.5.8 | أُضيف في: الإصدار v0.5.8 |
:::

غير مُصدَّر بواسطة الوحدة النمطية `node:zlib`. يتم توثيقه هنا لأنه الفئة الأساسية لفئات الضغط/فك الضغط.

ترث هذه الفئة من [`stream.Transform`](/ar/nodejs/api/stream#class-streamtransform)، مما يسمح باستخدام كائنات `node:zlib` في الأنابيب وعمليات الدفق المماثلة.

### `zlib.bytesWritten` {#zlibbyteswritten}

**أُضيف في: الإصدار v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يحدد الخاصية `zlib.bytesWritten` عدد البايتات المكتوبة إلى المحرك، قبل معالجة البايتات (مضغوطة أو غير مضغوطة، حسب الاقتضاء للفئة المشتقة).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**أُضيف في: الإصدار v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) عندما تكون `data` سلسلة، سيتم ترميزها على أنها UTF-8 قبل استخدامها للحساب.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قيمة بدء اختيارية. يجب أن تكون عددًا صحيحًا غير موقع بطول 32 بت. **الافتراضي:** `0`
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد صحيح غير موقع بطول 32 بت يحتوي على المجموع الاختباري.

يحسب المجموع الاختباري [Cyclic Redundancy Check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) بطول 32 بت لـ `data`. إذا تم تحديد `value`، فسيتم استخدامه كقيمة بدء للمجموع الاختباري، وإلا، فسيتم استخدام 0 كقيمة بدء.

تم تصميم خوارزمية CRC لحساب المجاميع الاختبارية واكتشاف الأخطاء في نقل البيانات. وهي غير مناسبة للمصادقة المشفرة.

لتكون متسقة مع واجهات برمجة التطبيقات الأخرى، إذا كانت `data` سلسلة، فسيتم ترميزها باستخدام UTF-8 قبل استخدامها للحساب. إذا كان المستخدمون يستخدمون Node.js فقط لحساب المجاميع الاختبارية ومطابقتها، فإن هذا يعمل بشكل جيد مع واجهات برمجة التطبيقات الأخرى التي تستخدم ترميز UTF-8 افتراضيًا.

تحسب بعض مكتبات JavaScript التابعة لجهات خارجية المجموع الاختباري على سلسلة بناءً على `str.charCodeAt()` بحيث يمكن تشغيلها في المتصفحات. إذا أراد المستخدمون مطابقة المجموع الاختباري المحسوب باستخدام هذا النوع من المكتبات في المتصفح، فمن الأفضل استخدام نفس المكتبة في Node.js إذا كانت تعمل أيضًا في Node.js. إذا اضطر المستخدمون إلى استخدام `zlib.crc32()` لمطابقة المجموع الاختباري الذي تنتجه مكتبة تابعة لجهة خارجية:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**تمت إضافته في: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

أغلق المعالج الأساسي.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**تمت إضافته في: v0.5.8**

- `kind` **الافتراضي:** `zlib.constants.Z_FULL_FLUSH` لتدفقات تستند إلى zlib، و `zlib.constants.BROTLI_OPERATION_FLUSH` لتدفقات تستند إلى Brotli.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

قم بتفريغ البيانات المعلقة. لا تستدعي هذا باستخفاف، التفريغات المبكرة تؤثر سلبًا على فعالية خوارزمية الضغط.

استدعاء هذا يقوم فقط بتفريغ البيانات من حالة `zlib` الداخلية، ولا يقوم بتفريغ أي نوع على مستوى التدفقات. بل يتصرف مثل استدعاء عادي لـ `.write()`، أي أنه سيتم وضعه في قائمة الانتظار خلف عمليات الكتابة المعلقة الأخرى ولن ينتج عنه أي إخراج إلا عند قراءة البيانات من التدفق.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**تمت إضافته في: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

هذه الوظيفة متاحة فقط للتدفقات التي تستند إلى zlib، أي ليست Brotli.

قم بتحديث مستوى الضغط واستراتيجية الضغط ديناميكيًا. ينطبق فقط على خوارزمية deflate.

### `zlib.reset()` {#zlibreset}

**تمت إضافته في: v0.7.0**

أعد ضبط الضاغط/المفرغ إلى الإعدادات الافتراضية للمصنع. ينطبق فقط على خوارزميات inflate و deflate.

## `zlib.constants` {#zlibconstants}

**تمت إضافته في: v7.0.0**

يوفر كائنًا يسرد الثوابت المتعلقة بـ Zlib.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**تمت إضافته في: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ar/nodejs/api/zlib#class-brotlioptions)

ينشئ ويعيد كائن [`BrotliCompress`](/ar/nodejs/api/zlib#class-zlibbrotlicompress) جديد.


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**تمت إضافته في: v11.7.0, v10.16.0**

- `options` [\<خيارات بروتلي\>](/ar/nodejs/api/zlib#class-brotlioptions)

لإنشاء وإرجاع كائن [`BrotliDecompress`](/ar/nodejs/api/zlib#class-zlibbrotlidecompress) جديد.

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`Deflate`](/ar/nodejs/api/zlib#class-zlibdeflate) جديد.

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`DeflateRaw`](/ar/nodejs/api/zlib#class-zlibdeflateraw) جديد.

أدى تحديث zlib من 1.2.8 إلى 1.2.11 إلى تغيير السلوك عندما يتم تعيين `windowBits` إلى 8 لتدفقات deflate الأولية. يقوم zlib تلقائيًا بتعيين `windowBits` إلى 9 إذا تم تعيينه في البداية إلى 8. ستطرح الإصدارات الأحدث من zlib استثناءً، لذلك استعاد Node.js السلوك الأصلي لترقية قيمة 8 إلى 9، نظرًا لأن تمرير `windowBits = 9` إلى zlib يؤدي فعليًا إلى تدفق مضغوط يستخدم نافذة 8 بت فقط.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`Gunzip`](/ar/nodejs/api/zlib#class-zlibgunzip) جديد.

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`Gzip`](/ar/nodejs/api/zlib#class-zlibgzip) جديد. انظر [مثال](/ar/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`Inflate`](/ar/nodejs/api/zlib#class-zlibinflate) جديد.

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`InflateRaw`](/ar/nodejs/api/zlib#class-zlibinflateraw) جديد.

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**تمت إضافته في: v0.5.8**

- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

لإنشاء وإرجاع كائن [`Unzip`](/ar/nodejs/api/zlib#class-zlibunzip) جديد.


## طرق سهلة {#convenience-methods}

تأخذ جميع هذه الطرق [`Buffer`](/ar/nodejs/api/buffer#class-buffer) أو [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) أو [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) أو [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) أو سلسلة نصية كمعامل أول، ومعامل ثاني اختياري لتوفير خيارات لفئات `zlib`، وستستدعي رد الاتصال المزوّد بـ `callback(error, result)`.

لكل طريقة نظير `*Sync`، يقبل نفس المعاملات، ولكن بدون رد اتصال.

### ‏`zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**تمت إضافته في: v11.7.0، v10.16.0**

- ‏`buffer` ‏[\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | ‏[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | ‏[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | ‏[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- ‏`options` ‏[\<خيارات بروتلي\>](/ar/nodejs/api/zlib#class-brotlioptions)
- ‏`callback` ‏[\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### ‏`zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**تمت إضافته في: v11.7.0، v10.16.0**

- ‏`buffer` ‏[\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | ‏[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | ‏[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | ‏[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- ‏`options` ‏[\<خيارات بروتلي\>](/ar/nodejs/api/zlib#class-brotlioptions)

ضغط جزء من البيانات باستخدام [`BrotliCompress`](/ar/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**تمت الإضافة في: الإصدار 11.7.0، 10.16.0**

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ar/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**تمت الإضافة في: الإصدار 11.7.0، 10.16.0**

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ar/nodejs/api/zlib#class-brotlioptions)

فك ضغط جزء من البيانات باستخدام [`BrotliDecompress`](/ar/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.4.0 | يمكن أن يكون المعامل `buffer` من نوع `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي نوع من `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` من نوع `Uint8Array` الآن. |
| v0.6.0 | تمت الإضافة في: الإصدار 0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.11.12 | تمت الإضافة في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

ضغط جزء من البيانات باستخدام [`Deflate`](/ar/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.6.0 | تمت الإضافة في: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.11.12 | تمت الإضافة في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

ضغط جزء من البيانات باستخدام [`DeflateRaw`](/ar/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.6.0 | تمت الإضافة في: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.11.12 | تمت الإضافة في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

فك ضغط جزء من البيانات باستخدام [`Gunzip`](/ar/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.6.0 | تمت الإضافة في: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.11.12 | أُضيف في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

ضغط جزء من البيانات باستخدام [`Gzip`](/ar/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.6.0 | أُضيف في: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` هو `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` الآن `Uint8Array`. |
| v0.11.12 | أُضيف في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

فك ضغط جزء من البيانات باستخدام [`Inflate`](/ar/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` من النوع `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` من النوع `Uint8Array` الآن. |
| v0.6.0 | تمت إضافته في: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` من النوع `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` من النوع `Uint8Array` الآن. |
| v0.11.12 | تمت إضافته في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ar/nodejs/api/zlib#class-options)

فك ضغط جزء من البيانات باستخدام [`InflateRaw`](/ar/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v9.4.0 | يمكن أن يكون المعامل `buffer` من النوع `ArrayBuffer`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| v8.0.0 | يمكن أن يكون المعامل `buffer` من النوع `Uint8Array` الآن. |
| v0.6.0 | تمت إضافته في: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ar/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v9.4.0 | يمكن أن يكون المعامل `buffer` عبارة عن `ArrayBuffer`. |
| الإصدار v8.0.0 | يمكن أن يكون المعامل `buffer` أي `TypedArray` أو `DataView`. |
| الإصدار v8.0.0 | يمكن أن يكون المعامل `buffer` عبارة عن `Uint8Array` الآن. |
| الإصدار v0.11.12 | أُضيف في: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<خيارات zlib\>](/ar/nodejs/api/zlib#class-options)

فك ضغط كتلة من البيانات باستخدام [`Unzip`](/ar/nodejs/api/zlib#class-zlibunzip).

