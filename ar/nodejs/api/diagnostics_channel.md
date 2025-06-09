---
title: قناة التشخيص في Node.js
description: توفر وحدة قناة التشخيص في Node.js واجهة برمجة التطبيقات لإنشاء القنوات المشخصة، ونشرها، والاشتراك فيها، مما يسمح بمراقبة وتصحيح التطبيقات بشكل أفضل.
head:
  - - meta
    - name: og:title
      content: قناة التشخيص في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة قناة التشخيص في Node.js واجهة برمجة التطبيقات لإنشاء القنوات المشخصة، ونشرها، والاشتراك فيها، مما يسمح بمراقبة وتصحيح التطبيقات بشكل أفضل.
  - - meta
    - name: twitter:title
      content: قناة التشخيص في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة قناة التشخيص في Node.js واجهة برمجة التطبيقات لإنشاء القنوات المشخصة، ونشرها، والاشتراك فيها، مما يسمح بمراقبة وتصحيح التطبيقات بشكل أفضل.
---


# قناة التشخيص {#diagnostics-channel}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.2.0, v18.13.0 | قناة التشخيص أصبحت الآن مستقرة. |
| v15.1.0, v14.17.0 | تمت الإضافة في: v15.1.0, v14.17.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**الكود المصدري:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

توفر الوحدة `node:diagnostics_channel` واجهة برمجة تطبيقات لإنشاء قنوات مسماة للإبلاغ عن بيانات الرسائل العشوائية لأغراض التشخيص.

يمكن الوصول إليه باستخدام:



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

الغرض منه هو أن يقوم كاتب الوحدة النمطية الذي يرغب في الإبلاغ عن رسائل التشخيص بإنشاء قناة واحدة أو العديد من القنوات ذات المستوى الأعلى للإبلاغ عن الرسائل من خلالها. يمكن أيضًا الحصول على القنوات في وقت التشغيل، ولكن لا يتم تشجيع ذلك بسبب النفقات العامة الإضافية للقيام بذلك. يمكن تصدير القنوات للراحة، ولكن طالما أن الاسم معروف، يمكن الحصول عليه في أي مكان.

إذا كنت تنوي أن تنتج وحدتك النمطية بيانات تشخيصية ليستهلكها الآخرون، فمن المستحسن تضمين وثائق للقنوات المسماة المستخدمة جنبًا إلى جنب مع شكل بيانات الرسائل. يجب أن تتضمن أسماء القنوات بشكل عام اسم الوحدة النمطية لتجنب الاصطدامات مع البيانات من الوحدات النمطية الأخرى.

## واجهة برمجة التطبيقات العامة {#public-api}

### نظرة عامة {#overview}

فيما يلي نظرة عامة بسيطة على واجهة برمجة التطبيقات العامة.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// احصل على كائن قناة قابل لإعادة الاستخدام
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // البيانات المستلمة
}

// اشترك في القناة
diagnostics_channel.subscribe('my-channel', onMessage);

// تحقق مما إذا كانت القناة لديها مشترك نشط
if (channel.hasSubscribers) {
  // انشر البيانات في القناة
  channel.publish({
    some: 'data',
  });
}

// إلغاء الاشتراك من القناة
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// احصل على كائن قناة قابل لإعادة الاستخدام
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // البيانات المستلمة
}

// اشترك في القناة
diagnostics_channel.subscribe('my-channel', onMessage);

// تحقق مما إذا كانت القناة لديها مشترك نشط
if (channel.hasSubscribers) {
  // انشر البيانات في القناة
  channel.publish({
    some: 'data',
  });
}

// إلغاء الاشتراك من القناة
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**أُضيف في: v15.1.0، v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم القناة
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان هناك مشتركون نشطون

تحقق مما إذا كان هناك مشتركون نشطون في القناة المسماة. هذا مفيد إذا كانت الرسالة التي تريد إرسالها قد تكون مكلفة الإعداد.

تعتبر واجهة برمجة التطبيقات هذه اختيارية ولكنها مفيدة عند محاولة نشر الرسائل من التعليمات البرمجية الحساسة للأداء للغاية.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // يوجد مشتركون، قم بإعداد الرسالة ونشرها
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // يوجد مشتركون، قم بإعداد الرسالة ونشرها
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**أُضيف في: v15.1.0، v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم القناة
- إرجاع: [\<Channel\>](/ar/nodejs/api/diagnostics_channel#class-channel) كائن القناة المسمى

هذه هي نقطة الدخول الأساسية لأي شخص يريد النشر في قناة مسماة. ينتج كائن قناة تم تحسينه لتقليل الحمل الزائد في وقت النشر قدر الإمكان.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**أُضيف في: v18.7.0، v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم القناة
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معالج لاستقبال رسائل القناة 
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) بيانات الرسالة
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم القناة
  
 

سجل معالج الرسائل للاشتراك في هذه القناة. سيتم تشغيل معالج الرسائل هذا بشكل متزامن كلما تم نشر رسالة في القناة. أي أخطاء يتم طرحها في معالج الرسائل ستؤدي إلى تشغيل [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // تم استلام البيانات
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // تم استلام البيانات
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**تمت الإضافة في: الإصدار v18.7.0، الإصدار v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم القناة
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معالج الرسائل المشترك السابق المراد إزالته
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم العثور على المعالج، `false` بخلاف ذلك.

قم بإزالة معالج الرسائل الذي تم تسجيله مسبقًا في هذه القناة باستخدام [`diagnostics_channel.subscribe(name, onMessage)`](/ar/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**تمت الإضافة في: الإصدار v19.9.0، الإصدار v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/ar/nodejs/api/diagnostics_channel#class-tracingchannel) اسم القناة أو الكائن الذي يحتوي على جميع [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels)
- إرجاع: [\<TracingChannel\>](/ar/nodejs/api/diagnostics_channel#class-tracingchannel) مجموعة من القنوات التي سيتم تتبعها بها

ينشئ غلاف [`TracingChannel`](/ar/nodejs/api/diagnostics_channel#class-tracingchannel) لـ [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels) المعينة. إذا تم إعطاء اسم، فسيتم إنشاء قنوات التتبع المقابلة في شكل `tracing:${name}:${eventType}` حيث يتوافق `eventType` مع أنواع [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### الصنف: `Channel` {#class-channel}

**أُضيف في: الإصدار 15.1.0، الإصدار 14.17.0**

يمثل الصنف `Channel` قناة مُسماة فردية داخل خط أنابيب البيانات. يُستخدم لتتبع المشتركين ونشر الرسائل عند وجود مشتركين. يوجد ككائن منفصل لتجنب عمليات البحث عن القنوات في وقت النشر، مما يتيح سرعات نشر عالية جدًا ويسمح بالاستخدام المكثف مع تحمل الحد الأدنى من التكلفة. يتم إنشاء القنوات باستخدام [`diagnostics_channel.channel(name)`](/ar/nodejs/api/diagnostics_channel#diagnostics_channelchannelname)، إنشاء قناة مباشرة باستخدام `new Channel(name)` غير مدعوم.

#### `channel.hasSubscribers` {#channelhassubscribers}

**أُضيف في: الإصدار 15.1.0، الإصدار 14.17.0**

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان هناك مشتركون نشطون

تحقق مما إذا كان هناك مشتركون نشطون في هذه القناة. هذا مفيد إذا كانت الرسالة التي تريد إرسالها قد تكون مكلفة للإعداد.

تعتبر واجهة برمجة التطبيقات هذه اختيارية ولكنها مفيدة عند محاولة نشر الرسائل من التعليمات البرمجية الحساسة جدًا للأداء.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // يوجد مشتركون، قم بإعداد ونشر الرسالة
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // يوجد مشتركون، قم بإعداد ونشر الرسالة
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**أُضيف في: الإصدار 15.1.0، الإصدار 14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) الرسالة المراد إرسالها إلى مشتركي القناة

انشر رسالة إلى أي مشتركين في القناة. سيؤدي هذا إلى تشغيل معالجات الرسائل بشكل متزامن بحيث يتم تنفيذها في نفس السياق.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**أضيف في: v15.1.0, v14.17.0**

**تم إهماله منذ: v18.7.0, v16.17.0**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`diagnostics_channel.subscribe(name, onMessage)`](/ar/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معالج لاستقبال رسائل القناة
    - `message` [\<\>أية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) بيانات الرسالة
    - `name` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<رمز\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) اسم القناة
  
 

لتسجيل معالج رسائل للاشتراك في هذه القناة. سيتم تشغيل معالج الرسائل هذا بشكل متزامن كلما تم نشر رسالة على القناة. أي أخطاء يتم طرحها في معالج الرسائل ستؤدي إلى إطلاق [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // بيانات مستلمة
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // بيانات مستلمة
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.7.0, v16.17.0 | مهمل منذ: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | تمت إضافة قيمة الإرجاع. تمت إضافته إلى القنوات بدون مشتركين. |
| v15.1.0, v14.17.0 | أضيف في: v15.1.0, v14.17.0 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`diagnostics_channel.unsubscribe(name, onMessage)`](/ar/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) المعالج المشترك السابق المراد إزالته
- إرجاع: [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم العثور على المعالج، `false` خلاف ذلك.

قم بإزالة معالج الرسائل الذي تم تسجيله مسبقًا في هذه القناة باستخدام [`channel.subscribe(onMessage)`](/ar/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // بيانات مستلمة
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // بيانات مستلمة
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**تمت الإضافة في: الإصدار v19.9.0، الإصدار v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `store` [\<AsyncLocalStorage\>](/ar/nodejs/api/async_context#class-asynclocalstorage) المخزن الذي سيتم ربط بيانات السياق به
- `transform` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تحويل بيانات السياق قبل تعيين سياق المخزن

عند استدعاء [`channel.runStores(context, ...)`](/ar/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)، سيتم تطبيق بيانات السياق المحددة على أي مخزن مرتبط بالقناة. إذا كان المخزن قد تم ربطه بالفعل، فسيتم استبدال دالة `transform` السابقة بالدالة الجديدة. يمكن حذف دالة `transform` لتعيين بيانات السياق المحددة كسياق مباشر.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**تمت الإضافة في: الإصدار v19.9.0، الإصدار v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `store` [\<AsyncLocalStorage\>](/ar/nodejs/api/async_context#class-asynclocalstorage) المخزن المراد إلغاء ربطه من القناة.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم العثور على المخزن، و`false` خلاف ذلك.

قم بإزالة معالج الرسائل الذي تم تسجيله مسبقًا في هذه القناة باستخدام [`channel.bindStore(store)`](/ar/nodejs/api/diagnostics_channel#channelbindstorestore-transform).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**تمت الإضافة في: الإصدار v19.9.0، v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) رسالة لإرسالها إلى المشتركين وربطها بالمخازن
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) معالج للتشغيل داخل سياق التخزين المدخل
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) المتلقي المراد استخدامه لاستدعاء الدالة.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسائط اختيارية لتمريرها إلى الدالة.

يطبق البيانات المحددة على أي مثيلات AsyncLocalStorage مرتبطة بالقناة طوال مدة الدالة المحددة، ثم ينشر إلى القناة ضمن نطاق تطبيق تلك البيانات على المخازن.

إذا تم إعطاء دالة تحويل إلى [`channel.bindStore(store)`](/ar/nodejs/api/diagnostics_channel#channelbindstorestore-transform) فسيتم تطبيقها لتحويل بيانات الرسالة قبل أن تصبح قيمة السياق للمخزن. يمكن الوصول إلى سياق التخزين السابق من داخل دالة التحويل في الحالات التي تتطلب ربط السياق.

يجب أن يكون السياق المطبق على المخزن قابلاً للوصول إليه في أي رمز غير متزامن يستمر من التنفيذ الذي بدأ أثناء الدالة المحددة، ومع ذلك هناك بعض المواقف التي قد يحدث فيها [فقدان السياق](/ar/nodejs/api/async_context#troubleshooting-context-loss).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### الفئة: `TracingChannel` {#class-tracingchannel}

**أُضيف في: الإصدار 19.9.0، 18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

الفئة `TracingChannel` هي مجموعة من [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels) تعبر معًا عن إجراء واحد قابل للتتبع. يتم استخدامه لإضفاء الطابع الرسمي وتبسيط عملية إنتاج الأحداث لتتبع تدفق التطبيق. يتم استخدام [`diagnostics_channel.tracingChannel()`](/ar/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) لإنشاء `TracingChannel`. كما هو الحال مع `Channel`، يوصى بإنشاء وإعادة استخدام `TracingChannel` واحد في المستوى الأعلى من الملف بدلاً من إنشائه ديناميكيًا.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**أُضيف في: الإصدار 19.9.0، 18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `subscribers` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مجموعة من مشتركي [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مشترك [`حدث البدء`](/ar/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مشترك [`حدث النهاية`](/ar/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مشترك [`حدث البدء غير المتزامن`](/ar/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مشترك [`حدث النهاية غير المتزامن`](/ar/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<الدالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مشترك [`حدث الخطأ`](/ar/nodejs/api/diagnostics_channel#errorevent)
  
 

مساعد للاشتراك في مجموعة من الدوال في القنوات المقابلة. هذا هو نفسه استدعاء [`channel.subscribe(onMessage)`](/ar/nodejs/api/diagnostics_channel#channelsubscribeonmessage) على كل قناة على حدة.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // معالجة رسالة البدء
  },
  end(message) {
    // معالجة رسالة النهاية
  },
  asyncStart(message) {
    // معالجة رسالة البدء غير المتزامن
  },
  asyncEnd(message) {
    // معالجة رسالة النهاية غير المتزامن
  },
  error(message) {
    // معالجة رسالة الخطأ
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // معالجة رسالة البدء
  },
  end(message) {
    // معالجة رسالة النهاية
  },
  asyncStart(message) {
    // معالجة رسالة البدء غير المتزامن
  },
  asyncEnd(message) {
    // معالجة رسالة النهاية غير المتزامن
  },
  error(message) {
    // معالجة رسالة الخطأ
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**أضيف في: v19.9.0, v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مجموعة مشتركي [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مُشترك [`start` event](/ar/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مُشترك [`end` event](/ar/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مُشترك [`asyncStart` event](/ar/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مُشترك [`asyncEnd` event](/ar/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) مُشترك [`error` event](/ar/nodejs/api/diagnostics_channel#errorevent)
  
 
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم إلغاء الاشتراك بنجاح في جميع المعالجات، و `false` خلاف ذلك.

مساعد لإلغاء الاشتراك في مجموعة من الدوال من القنوات المقابلة. هذا هو نفسه استدعاء [`channel.unsubscribe(onMessage)`](/ar/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) على كل قناة على حدة.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**أُضيف في: v19.9.0, v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة لتضمين تتبع حولها
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن مشترك لربط الأحداث من خلاله
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) المستقبل الذي سيستخدم لاستدعاء الدالة
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسيطات اختيارية لتمريرها إلى الدالة
- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة إرجاع الدالة المعطاة

تتبع استدعاء دالة متزامنة. سينتج هذا دائمًا [`start` حدث](/ar/nodejs/api/diagnostics_channel#startevent) و [`end` حدث](/ar/nodejs/api/diagnostics_channel#endevent) حول التنفيذ وقد ينتج [`error` حدث](/ar/nodejs/api/diagnostics_channel#errorevent) إذا طرحت الدالة المعطاة خطأ. سيقوم هذا بتشغيل الدالة المعطاة باستخدام [`channel.runStores(context, ...)`](/ar/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) على قناة `start` التي تضمن أن جميع الأحداث يجب أن تحتوي على أي مخازن مرتبطة مضبوطة لتطابق سياق التتبع هذا.

لضمان تكوين مخططات تتبع صحيحة فقط، سيتم نشر الأحداث فقط إذا كان المشتركون موجودين قبل بدء التتبع. لن تتلقى الاشتراكات التي تتم إضافتها بعد بدء التتبع الأحداث المستقبلية من هذا التتبع، وستظهر عمليات التتبع المستقبلية فقط.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**تمت الإضافة في: v19.9.0, v18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة إرجاع الوعد لتضمين تتبع حولها
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن مشترك لربط أحداث التتبع من خلاله
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) المستقبِل المراد استخدامه لاستدعاء الدالة
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) وسيطات اختيارية لتمريرها إلى الدالة
- إرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) متسلسلة من الوعد الذي تم إرجاعه بواسطة الدالة المعطاة

تتبع استدعاء دالة إرجاع الوعد. سيؤدي هذا دائمًا إلى إنتاج [`start` event](/ar/nodejs/api/diagnostics_channel#startevent) و [`end` event](/ar/nodejs/api/diagnostics_channel#endevent) حول الجزء المتزامن من تنفيذ الدالة، وسينتج [`asyncStart` event](/ar/nodejs/api/diagnostics_channel#asyncstartevent) و [`asyncEnd` event](/ar/nodejs/api/diagnostics_channel#asyncendevent) عند الوصول إلى استمرارية الوعد. وقد ينتج أيضًا [`error` event](/ar/nodejs/api/diagnostics_channel#errorevent) إذا أطلقت الدالة المعطاة خطأً أو إذا تم رفض الوعد الذي تم إرجاعه. سيؤدي هذا إلى تشغيل الدالة المعطاة باستخدام [`channel.runStores(context, ...)`](/ar/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) على قناة `start` التي تضمن أن جميع الأحداث يجب أن تحتوي على أي متاجر مرتبطة مُعيَّنة لتتوافق مع سياق التتبع هذا.

لضمان تكوين رسوم بيانية للتتبع الصحيحة فقط، سيتم نشر الأحداث فقط إذا كان المشتركون موجودين قبل بدء التتبع. لن تتلقى الاشتراكات التي تتم إضافتها بعد بدء التتبع الأحداث المستقبلية من هذا التتبع، وستظهر عمليات التتبع المستقبلية فقط.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**تمت الإضافة في: الإصدار 19.9.0، الإصدار 18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) استدعاء باستخدام دالة لتضمين تتبع حولها
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) موضع وسيطة مفهرسة من الصفر للاستدعاء المتوقع (افتراضيًا الوسيطة الأخيرة إذا تم تمرير `undefined`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن مشترك لربط أحداث التتبع من خلاله (افتراضيًا `{}` إذا تم تمرير `undefined`)
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) المستقبل المراد استخدامه لاستدعاء الدالة
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) الوسائط المراد تمريرها إلى الدالة (يجب أن تتضمن الاستدعاء)
- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة الإرجاع للدالة المحددة

تتبع استدعاء دالة استقبال الاستدعاء. من المتوقع أن يتبع الاستدعاء الاصطلاح المتعارف عليه للخطأ باعتباره الوسيطة الأولى. سينتج هذا دائمًا [`start` event](/ar/nodejs/api/diagnostics_channel#startevent) و [`end` event](/ar/nodejs/api/diagnostics_channel#endevent) حول الجزء المتزامن من تنفيذ الدالة، وسينتج [`asyncStart` event](/ar/nodejs/api/diagnostics_channel#asyncstartevent) و [`asyncEnd` event](/ar/nodejs/api/diagnostics_channel#asyncendevent) حول تنفيذ الاستدعاء. قد ينتج أيضًا [`error` event](/ar/nodejs/api/diagnostics_channel#errorevent) إذا كانت الدالة المحددة تطرح أو تم تعيين الوسيطة الأولى التي تم تمريرها إلى الاستدعاء. سيؤدي هذا إلى تشغيل الدالة المحددة باستخدام [`channel.runStores(context, ...)`](/ar/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) على قناة `start` مما يضمن أن جميع الأحداث يجب أن تحتوي على أي مخازن مرتبطة مضبوطة لتطابق سياق التتبع هذا.

لضمان تكوين رسوم بيانية تتبع صحيحة فقط، سيتم نشر الأحداث فقط إذا كان المشتركون موجودين قبل بدء التتبع. الاشتراكات التي تتم إضافتها بعد بدء التتبع لن تتلقى أحداثًا مستقبلية من هذا التتبع، وسيتم رؤية التتبعات المستقبلية فقط.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

سيتم أيضًا تشغيل الاستدعاء باستخدام [`channel.runStores(context, ...)`](/ar/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) مما يتيح استعادة فقدان السياق في بعض الحالات.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**تمت الإضافة في: v22.0.0, v20.13.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `صحيح` إذا كان أي من القنوات الفردية لديه مشترك، `خطأ` إذا لم يكن كذلك.

هذه طريقة مساعدة متاحة في مثيل [`TracingChannel`](/ar/nodejs/api/diagnostics_channel#class-tracingchannel) للتحقق مما إذا كان أي من [قنوات TracingChannel](/ar/nodejs/api/diagnostics_channel#tracingchannel-channels) لديه مشتركون. يتم إرجاع `صحيح` إذا كان لأي منهم مشترك واحد على الأقل، ويتم إرجاع `خطأ` بخلاف ذلك.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // افعل شيئًا
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // افعل شيئًا
}
```
:::

### قنوات TracingChannel {#tracingchannel-channels}

TracingChannel هي مجموعة من عدة قنوات تشخيصية تمثل نقاطًا محددة في دورة حياة تنفيذ إجراء واحد قابل للتتبع. يتم تقسيم السلوك إلى خمس قنوات تشخيصية تتكون من `start` و `end` و `asyncStart` و `asyncEnd` و `error`. سيشارك إجراء واحد قابل للتتبع نفس كائن الحدث بين جميع الأحداث، ويمكن أن يكون هذا مفيدًا لإدارة الارتباط من خلال خريطة ضعيفة.

سيتم تمديد كائنات الأحداث هذه بقيم `result` أو `error` عندما "تكتمل" المهمة. في حالة مهمة متزامنة، ستكون `result` هي قيمة الإرجاع وسيكون `error` أي شيء يتم طرحه من الوظيفة. مع وظائف غير متزامنة تستند إلى رد الاتصال، ستكون `result` هي الوسيطة الثانية لرد الاتصال بينما سيكون `error` إما خطأ تم طرحه مرئيًا في حدث `end` أو الوسيطة الأولى لرد الاتصال في أي من حدثي `asyncStart` أو `asyncEnd`.

لضمان تكوين مخططات تتبع صحيحة فقط، يجب نشر الأحداث فقط إذا كان المشتركون موجودين قبل بدء التتبع. يجب ألا تتلقى الاشتراكات التي تتم إضافتها بعد بدء التتبع أحداثًا مستقبلية من هذا التتبع، وستظهر عمليات التتبع المستقبلية فقط.

يجب أن تتبع قنوات التتبع نمط تسمية:

- `tracing:module.class.method:start` أو `tracing:module.function:start`
- `tracing:module.class.method:end` أو `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` أو `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` أو `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` أو `tracing:module.function:error`


#### `start(event)` {#startevent}

- الاسم: `tracing:${name}:start`

يمثل حدث `start` النقطة التي يتم فيها استدعاء الدالة. في هذه المرحلة، قد تحتوي بيانات الحدث على وسائط الدالة أو أي شيء آخر متاح في بداية تنفيذ الدالة.

#### `end(event)` {#endevent}

- الاسم: `tracing:${name}:end`

يمثل حدث `end` النقطة التي تُرجع فيها استدعاء الدالة قيمة. في حالة الدالة غير المتزامنة، يكون هذا هو الوقت الذي يتم فيه إرجاع الوعد وليس عندما تقوم الدالة نفسها بإصدار عبارة إرجاع داخليًا. في هذه المرحلة، إذا كانت الدالة التي تم تتبعها متزامنة، فسيتم تعيين الحقل `result` على القيمة التي تم إرجاعها من الدالة. بدلاً من ذلك، قد يكون الحقل `error` موجودًا لتمثيل أي أخطاء تم طرحها.

يوصى بالاستماع تحديدًا إلى حدث `error` لتتبع الأخطاء لأنه قد يكون من الممكن أن ينتج عن إجراء قابل للتتبع أخطاء متعددة. على سبيل المثال، مهمة غير متزامنة تفشل قد تبدأ داخليًا قبل الجزء المتزامن من المهمة ثم تطرح خطأً.

#### `asyncStart(event)` {#asyncstartevent}

- الاسم: `tracing:${name}:asyncStart`

يمثل حدث `asyncStart` الوصول إلى رد الاتصال أو الاستمرار لدالة قابلة للتتبع. في هذه المرحلة، قد تتوفر أشياء مثل وسائط رد الاتصال، أو أي شيء آخر يعبر عن "نتيجة" الإجراء.

بالنسبة للدوال المستندة إلى ردود الاتصال، سيتم تعيين الوسيطة الأولى لرد الاتصال إلى الحقل `error`، إذا لم تكن `undefined` أو `null`، وسيتم تعيين الوسيطة الثانية إلى الحقل `result`.

بالنسبة للوعود، سيتم تعيين الوسيطة إلى مسار `resolve` إلى `result` أو سيتم تعيين الوسيطة إلى مسار `reject` إلى `error`.

يوصى بالاستماع تحديدًا إلى حدث `error` لتتبع الأخطاء لأنه قد يكون من الممكن أن ينتج عن إجراء قابل للتتبع أخطاء متعددة. على سبيل المثال، مهمة غير متزامنة تفشل قد تبدأ داخليًا قبل الجزء المتزامن من المهمة ثم تطرح خطأً.

#### `asyncEnd(event)` {#asyncendevent}

- الاسم: `tracing:${name}:asyncEnd`

يمثل حدث `asyncEnd` رد الاتصال لدالة غير متزامنة يتم إرجاعها. ليس من المحتمل أن تتغير بيانات الحدث بعد حدث `asyncStart`، ومع ذلك قد يكون من المفيد رؤية النقطة التي يكتمل فيها رد الاتصال.


#### `error(event)` {#errorevent}

- الاسم: `tracing:${name}:error`

يمثل حدث `error` أي خطأ ينتج عن الدالة القابلة للتتبع إما بشكل متزامن أو غير متزامن. إذا تم طرح خطأ في الجزء المتزامن من الدالة التي تم تتبعها، فسيتم تعيين الخطأ إلى حقل `error` في الحدث وسيتم تشغيل حدث `error`. إذا تم استلام خطأ بشكل غير متزامن من خلال استدعاء أو رفض وعد، فسيتم أيضًا تعيينه إلى حقل `error` في الحدث وتشغيل حدث `error`.

من الممكن أن ينتج عن استدعاء دالة قابلة للتتبع واحدة أخطاء عدة مرات، لذلك يجب أخذ ذلك في الاعتبار عند استهلاك هذا الحدث. على سبيل المثال، إذا تم تشغيل مهمة غير متزامنة أخرى داخليًا وفشلت، ثم طرح الجزء المتزامن من الدالة خطأ، فسيتم إصدار حدثين `error`، أحدهما للخطأ المتزامن والآخر للخطأ غير المتزامن.

### القنوات المضمنة {#built-in-channels}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

في حين أن واجهة برمجة تطبيقات diagnostics_channel تعتبر الآن مستقرة، فإن القنوات المضمنة المتاحة حاليًا ليست كذلك. يجب الإعلان عن استقرار كل قناة على حدة.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

يتم إصداره عندما ينشئ العميل كائن طلب. على عكس `http.client.request.start`، يتم إصدار هذا الحدث قبل إرسال الطلب.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)

يتم إصداره عندما يبدأ العميل طلبًا.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إصداره عند حدوث خطأ أثناء طلب العميل.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/ar/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)

يتم إصداره عندما يتلقى العميل استجابة.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ar/nodejs/api/http#class-httpserver)

يتم إصداره عندما يتلقى الخادم طلبًا.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)

يتم إصداره عندما ينشئ الخادم استجابة. يتم إصدار الحدث قبل إرسال الاستجابة.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/ar/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ar/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ar/nodejs/api/http#class-httpserver)

يتم إصداره عندما يرسل الخادم استجابة.


#### الوحدات {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحتوي على الخصائص التالية:
    - `id` - الوسيطة التي تم تمريرها إلى `require()`. اسم الوحدة.
    - `parentFilename` - اسم الوحدة التي حاولت استدعاء require(id).
  
 

يتم إصداره عند تنفيذ `require()`. انظر [`start` event](/ar/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحتوي على الخصائص التالية:
    - `id` - الوسيطة التي تم تمريرها إلى `require()`. اسم الوحدة.
    - `parentFilename` - اسم الوحدة التي حاولت استدعاء require(id).
  
 

يتم إصداره عند إرجاع استدعاء `require()`. انظر [`end` event](/ar/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحتوي على الخصائص التالية:
    - `id` - الوسيطة التي تم تمريرها إلى `require()`. اسم الوحدة.
    - `parentFilename` - اسم الوحدة التي حاولت استدعاء require(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إصداره عندما يلقي `require()` خطأ. انظر [`error` event](/ar/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحتوي على الخصائص التالية:
    - `id` - الوسيطة التي تم تمريرها إلى `import()`. اسم الوحدة.
    - `parentURL` - كائن URL للوحدة التي حاولت استدعاء import(id).
  
 

يتم إصداره عند استدعاء `import()`. انظر [`asyncStart` event](/ar/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحتوي على الخصائص التالية:
    - `id` - الوسيطة التي تم تمريرها إلى `import()`. اسم الوحدة.
    - `parentURL` - كائن URL للوحدة التي حاولت استدعاء import(id).
  
 

يتم إصداره عند اكتمال `import()`. انظر [`asyncEnd` event](/ar/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) يحتوي على الخصائص التالية:
    - `id` - الوسيطة التي تم تمريرها إلى `import()`. اسم الوحدة.
    - `parentURL` - كائن URL للوحدة التي حاولت استدعاء import(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يتم إصداره عندما يلقي `import()` خطأ. انظر [`error` event](/ar/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يصدر هذا الحدث عند إنشاء مقبس TCP أو pipe جديد للعميل.

`net.server.socket`

- `socket` [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يصدر هذا الحدث عند استقبال اتصال TCP أو pipe جديد.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/ar/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يصدر هذا الحدث عند استدعاء [`net.Server.listen()`](/ar/nodejs/api/net#serverlisten)، قبل إعداد المنفذ أو الـ pipe فعليًا.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

يصدر هذا الحدث عند اكتمال [`net.Server.listen()`](/ar/nodejs/api/net#serverlisten) وبالتالي يصبح الخادم جاهزًا لقبول الاتصال.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/ar/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

يصدر هذا الحدث عندما تُرجع [`net.Server.listen()`](/ar/nodejs/api/net#serverlisten) خطأً.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/ar/nodejs/api/dgram#class-dgramsocket)

يصدر هذا الحدث عند إنشاء مقبس UDP جديد.

#### Process {#process}

**أضيف في:** v16.18.0

`child_process`

- `process` [\<ChildProcess\>](/ar/nodejs/api/child_process#class-childprocess)

يصدر هذا الحدث عند إنشاء عملية جديدة.

#### Worker Thread {#worker-thread}

**أضيف في:** v16.18.0

`worker_threads`

- `worker` [`Worker`](/ar/nodejs/api/worker_threads#class-worker)

يصدر هذا الحدث عند إنشاء thread جديد.

