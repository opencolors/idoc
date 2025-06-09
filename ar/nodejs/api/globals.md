---
title: الكائنات العالمية في Node.js
description: توثق هذه الصفحة الكائنات العالمية المتاحة في Node.js، بما في ذلك المتغيرات العالمية، والدوال، والفئات التي يمكن الوصول إليها من أي وحدة دون الحاجة إلى الاستيراد الصريح.
head:
  - - meta
    - name: og:title
      content: الكائنات العالمية في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توثق هذه الصفحة الكائنات العالمية المتاحة في Node.js، بما في ذلك المتغيرات العالمية، والدوال، والفئات التي يمكن الوصول إليها من أي وحدة دون الحاجة إلى الاستيراد الصريح.
  - - meta
    - name: twitter:title
      content: الكائنات العالمية في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توثق هذه الصفحة الكائنات العالمية المتاحة في Node.js، بما في ذلك المتغيرات العالمية، والدوال، والفئات التي يمكن الوصول إليها من أي وحدة دون الحاجة إلى الاستيراد الصريح.
---


# الكائنات العامة {#global-objects}

هذه الكائنات متاحة في جميع الوحدات النمطية.

قد تبدو المتغيرات التالية عامة ولكنها ليست كذلك. إنها موجودة فقط في نطاق [وحدات CommonJS النمطية](/ar/nodejs/api/modules):

- [`__dirname`](/ar/nodejs/api/modules#__dirname)
- [`__filename`](/ar/nodejs/api/modules#__filename)
- [`exports`](/ar/nodejs/api/modules#exports)
- [`module`](/ar/nodejs/api/modules#module)
- [`require()`](/ar/nodejs/api/modules#requireid)

الكائنات المدرجة هنا خاصة بـ Node.js. هناك [كائنات مدمجة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) وهي جزء من لغة JavaScript نفسها، وهي أيضًا متاحة عالميًا.

## الفئة: `AbortController` {#class-abortcontroller}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.4.0 | لم تعد تجريبية. |
| v15.0.0, v14.17.0 | تمت الإضافة في: v15.0.0, v14.17.0 |
:::

فئة أداة مساعدة تُستخدم للإشارة إلى الإلغاء في واجهات برمجة التطبيقات المستندة إلى `Promise` المحددة. تعتمد واجهة برمجة التطبيقات على واجهة برمجة تطبيقات الويب [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('تم الإلغاء!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // يطبع true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.2.0, v16.14.0 | تمت إضافة وسيطة السبب الاختيارية الجديدة. |
| v15.0.0, v14.17.0 | تمت الإضافة في: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) سبب اختياري، يمكن استرجاعه في الخاصية `reason` الخاصة بـ `AbortSignal`.

يقوم بتشغيل إشارة الإحباط، مما يتسبب في إطلاق `abortController.signal` لحدث `'abort'`.

### `abortController.signal` {#abortcontrollersignal}

**تمت الإضافة في: v15.0.0, v14.17.0**

- النوع: [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)

### الفئة: `AbortSignal` {#class-abortsignal}

**تمت الإضافة في: v15.0.0, v14.17.0**

- يمتد: [\<EventTarget\>](/ar/nodejs/api/events#class-eventtarget)

يتم استخدام `AbortSignal` لإعلام المراقبين عند استدعاء طريقة `abortController.abort()`.


#### طريقة ثابتة: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v17.2.0, v16.14.0 | تمت إضافة وسيط السبب الاختياري الجديد. |
| v15.12.0, v14.17.0 | تمت الإضافة في: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- الإرجاع: [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)

تقوم بإرجاع `AbortSignal` جديدة تم إجهاضها بالفعل.

#### طريقة ثابتة: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**تمت الإضافة في: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية للانتظار قبل تشغيل AbortSignal.

تقوم بإرجاع `AbortSignal` جديدة سيتم إجهاضها في `delay` مللي ثانية.

#### طريقة ثابتة: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**تمت الإضافة في: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/ar/nodejs/api/globals#class-abortsignal) `AbortSignal`s التي سيتم تكوين `AbortSignal` جديدة منها.

تقوم بإرجاع `AbortSignal` جديدة سيتم إجهاضها إذا تم إجهاض أي من الإشارات المقدمة. سيتم تعيين [`abortSignal.reason`](/ar/nodejs/api/globals#abortsignalreason) إلى أي من `signals` التي تسببت في إجهاضها.

#### الحدث: `'abort'` {#event-abort}

**تمت الإضافة في: v15.0.0, v14.17.0**

يتم إصدار الحدث `'abort'` عند استدعاء طريقة `abortController.abort()`. يتم استدعاء رد الاتصال بوسيط كائن واحد مع خاصية `type` واحدة تم تعيينها على `'abort'`:

```js [ESM]
const ac = new AbortController();

// استخدم خاصية onabort إما...
ac.signal.onabort = () => console.log('aborted!');

// أو واجهة برمجة تطبيقات EventTarget...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // طباعة 'abort'
}, { once: true });

ac.abort();
```
سيقوم `AbortController` المرتبط بـ `AbortSignal` بتشغيل الحدث `'abort'` مرة واحدة فقط. نوصي بأن يتحقق الكود من أن السمة `abortSignal.aborted` هي `false` قبل إضافة مستمع حدث `'abort'`.

يجب أن تستخدم أي مستمعين للأحداث مرتبطين بـ `AbortSignal` الخيار `{ once: true }` (أو، إذا كنت تستخدم واجهات برمجة تطبيقات `EventEmitter` لإرفاق مستمع، فاستخدم الطريقة `once()`) للتأكد من إزالة مستمع الحدث بمجرد التعامل مع الحدث `'abort'`. قد يؤدي عدم القيام بذلك إلى تسرب الذاكرة.


#### `abortSignal.aborted` {#abortsignalaborted}

**اُضيف في: v15.0.0, v14.17.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) صحيح بعد إحباط `AbortController`.

#### `abortSignal.onabort` {#abortsignalonabort}

**اُضيف في: v15.0.0, v14.17.0**

- النوع: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

دالة رد نداء اختيارية يمكن ضبطها بواسطة كود المستخدم ليتم إعلامه عند استدعاء الدالة `abortController.abort()`.

#### `abortSignal.reason` {#abortsignalreason}

**اُضيف في: v17.2.0, v16.14.0**

- النوع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

سبب اختياري محدد عند تشغيل `AbortSignal`.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**اُضيف في: v17.3.0, v16.17.0**

إذا كان `abortSignal.aborted` هو `true`، فإنه يطرح `abortSignal.reason`.

## الصنف: `Blob` {#class-blob}

**اُضيف في: v18.0.0**

انظر [\<Blob\>](/ar/nodejs/api/buffer#class-blob).

## الصنف: `Buffer` {#class-buffer}

**اُضيف في: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

يستخدم للتعامل مع البيانات الثنائية. انظر قسم [buffer](/ar/nodejs/api/buffer).

## الصنف: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**اُضيف في: v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`ByteLengthQueuingStrategy`](/ar/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

قد يبدو هذا المتغير عالميًا ولكنه ليس كذلك. انظر [`__dirname`](/ar/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

قد يبدو هذا المتغير عالميًا ولكنه ليس كذلك. انظر [`__filename`](/ar/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**اُضيف في: v16.0.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم. استخدم `Buffer.from(data, 'base64')` بدلاً من ذلك.
:::

اسم مستعار عام لـ [`buffer.atob()`](/ar/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**أُضيف في: الإصدار v18.0.0**

راجع [\<BroadcastChannel\>](/ar/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**أُضيف في: الإصدار v16.0.0**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم. استخدم `buf.toString('base64')` بدلاً من ذلك.
:::

اسم مستعار عام لـ [`buffer.btoa()`](/ar/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**أُضيف في: الإصدار v0.9.1**

تم وصف [`clearImmediate`](/ar/nodejs/api/timers#clearimmediateimmediate) في قسم [المؤقتات](/ar/nodejs/api/timers).

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**أُضيف في: الإصدار v0.0.1**

تم وصف [`clearInterval`](/ar/nodejs/api/timers#clearintervaltimeout) في قسم [المؤقتات](/ar/nodejs/api/timers).

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**أُضيف في: الإصدار v0.0.1**

تم وصف [`clearTimeout`](/ar/nodejs/api/timers#cleartimeouttimeout) في قسم [المؤقتات](/ar/nodejs/api/timers).

## `CloseEvent` {#closeevent}

**أُضيف في: الإصدار v23.0.0**

صنف `CloseEvent`. راجع [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) لمزيد من التفاصيل.

تنفيذ متوافق مع المتصفح لـ [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). قم بتعطيل واجهة برمجة التطبيقات هذه باستخدام علامة سطر الأوامر [`--no-experimental-websocket`](/ar/nodejs/api/cli#--no-experimental-websocket).

## الصنف: `CompressionStream` {#class-compressionstream}

**أُضيف في: الإصدار v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`CompressionStream`](/ar/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**أُضيف في: الإصدار v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يستخدم للطباعة إلى stdout و stderr. راجع قسم [`console`](/ar/nodejs/api/console).

## الصنف: `CountQueuingStrategy` {#class-countqueuingstrategy}

**أُضيف في: الإصدار v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`CountQueuingStrategy`](/ar/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | لم يعد تجريبيًا. |
| v19.0.0 | لم يعد خلف علامة CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | تمت الإضافة في: v17.6.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تنفيذ متوافق مع المتصفح لـ [\<Crypto\>](/ar/nodejs/api/webcrypto#class-crypto). هذا العام متاح فقط إذا تم تجميع ثنائي Node.js مع تضمين دعم وحدة `node:crypto`.

## `crypto` {#crypto_1}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | لم يعد تجريبيًا. |
| v19.0.0 | لم يعد خلف علامة CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | تمت الإضافة في: v17.6.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تنفيذ متوافق مع المتصفح لـ [Web Crypto API](/ar/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | لم يعد تجريبيًا. |
| v19.0.0 | لم يعد خلف علامة CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | تمت الإضافة في: v17.6.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تنفيذ متوافق مع المتصفح لـ [\<CryptoKey\>](/ar/nodejs/api/webcrypto#class-cryptokey). هذا العام متاح فقط إذا تم تجميع ثنائي Node.js مع تضمين دعم وحدة `node:crypto`.

## `CustomEvent` {#customevent}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | لم يعد تجريبيًا. |
| v22.1.0, v20.13.0 | CustomEvent مستقر الآن. |
| v19.0.0 | لم يعد خلف علامة CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | تمت الإضافة في: v18.7.0, v16.17.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ متوافق مع المتصفح لـ [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).


## الصنف: `DecompressionStream` {#class-decompressionstream}

**أُضيف في: الإصدار v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`DecompressionStream`](/ar/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.4.0 | لم يعد تجريبيًا. |
| v15.0.0 | أُضيف في: v15.0.0 |
:::

تنفيذ متوافق مع المتصفح للصنف `Event`. انظر [`EventTarget` و `Event` API](/ar/nodejs/api/events#eventtarget-and-event-api) لمزيد من التفاصيل.

## `EventSource` {#eventsource}

**أُضيف في: الإصدار v22.3.0، v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي. فعّل واجهة برمجة التطبيقات هذه باستخدام علامة CLI [`--experimental-eventsource`](/ar/nodejs/api/cli#--experimental-eventsource).
:::

تنفيذ متوافق مع المتصفح للصنف [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.4.0 | لم يعد تجريبيًا. |
| v15.0.0 | أُضيف في: v15.0.0 |
:::

تنفيذ متوافق مع المتصفح للصنف `EventTarget`. انظر [`EventTarget` و `Event` API](/ar/nodejs/api/events#eventtarget-and-event-api) لمزيد من التفاصيل.

## `exports` {#exports}

قد يبدو هذا المتغير عالميًا ولكنه ليس كذلك. انظر [`exports`](/ar/nodejs/api/modules#exports).

## `fetch` {#fetch}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | لم يعد تجريبيًا. |
| v18.0.0 | لم يعد خلف علامة CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | أُضيف في: v17.5.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [مستقر: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ متوافق مع المتصفح للدالة [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## الصنف: `File` {#class-file}

**أُضيف في: الإصدار v20.0.0**

انظر [\<File\>](/ar/nodejs/api/buffer#class-file).


## الفئة `FormData` {#class-formdata}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v21.0.0 | لم تعد تجريبية. |
| الإصدار v18.0.0 | لم تعد تعتمد على علامة سطر الأوامر `--experimental-fetch`. |
| الإصداران v17.6.0, v16.15.0 | تمت إضافتها في: v17.6.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ متوافق مع المتصفح لـ [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**تمت إضافتها في: الإصدار v0.1.27**

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم. استخدم [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) بدلاً من ذلك.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن مساحة الاسم العام.

في المتصفحات، كان النطاق ذو المستوى الأعلى تقليديًا هو النطاق العام. هذا يعني أن `var something` ستحدد متغيرًا عامًا جديدًا، باستثناء وحدات ECMAScript. في Node.js، هذا مختلف. النطاق ذو المستوى الأعلى ليس النطاق العام؛ `var something` داخل وحدة Node.js ستكون محلية لتلك الوحدة، بغض النظر عما إذا كانت [وحدة CommonJS](/ar/nodejs/api/modules) أو [وحدة ECMAScript](/ar/nodejs/api/esm).

## الفئة `Headers` {#class-headers}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v21.0.0 | لم تعد تجريبية. |
| الإصدار v18.0.0 | لم تعد تعتمد على علامة سطر الأوامر `--experimental-fetch`. |
| الإصداران v17.5.0, v16.15.0 | تمت إضافتها في: v17.5.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ متوافق مع المتصفح لـ [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**تمت إضافتها في: الإصدار v22.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر.
:::

تنفيذ متوافق مع المتصفح لـ [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). يتم تخزين البيانات غير مشفرة في الملف المحدد بواسطة علامة سطر الأوامر [`--localstorage-file`](/ar/nodejs/api/cli#--localstorage-filefile). الحد الأقصى لكمية البيانات التي يمكن تخزينها هو 10 ميجابايت. لا يتم دعم أي تعديل لهذه البيانات خارج Web Storage API. قم بتمكين هذا API باستخدام علامة سطر الأوامر [`--experimental-webstorage`](/ar/nodejs/api/cli#--experimental-webstorage). لا يتم تخزين بيانات `localStorage` لكل مستخدم أو لكل طلب عند استخدامها في سياق الخادم، بل تتم مشاركتها عبر جميع المستخدمين والطلبات.


## `MessageChannel` {#messagechannel}

**تمت الإضافة في: v15.0.0**

الفئة `MessageChannel`. انظر [`MessageChannel`](/ar/nodejs/api/worker_threads#class-messagechannel) لمزيد من التفاصيل.

## `MessageEvent` {#messageevent}

**تمت الإضافة في: v15.0.0**

الفئة `MessageEvent`. انظر [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) لمزيد من التفاصيل.

## `MessagePort` {#messageport}

**تمت الإضافة في: v15.0.0**

الفئة `MessagePort`. انظر [`MessagePort`](/ar/nodejs/api/worker_threads#class-messageport) لمزيد من التفاصيل.

## `module` {#module}

قد يبدو هذا المتغير عامًا ولكنه ليس كذلك. انظر [`module`](/ar/nodejs/api/modules#module).

## `Navigator` {#navigator}

**تمت الإضافة في: v21.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط. قم بتعطيل واجهة برمجة التطبيقات هذه باستخدام علامة CLI [`--no-experimental-global-navigator`](/ar/nodejs/api/cli#--no-experimental-global-navigator).
:::

تنفيذ جزئي لـ [Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**تمت الإضافة في: v21.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط. قم بتعطيل واجهة برمجة التطبيقات هذه باستخدام علامة CLI [`--no-experimental-global-navigator`](/ar/nodejs/api/cli#--no-experimental-global-navigator).
:::

تنفيذ جزئي لـ [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**تمت الإضافة في: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ترجع الخاصية `navigator.hardwareConcurrency` للقراءة فقط عدد المعالجات المنطقية المتاحة لمثيل Node.js الحالي.

```js [ESM]
console.log(`يعمل هذا العملية على ${navigator.hardwareConcurrency} معالج منطقي`);
```
### `navigator.language` {#navigatorlanguage}

**تمت الإضافة في: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ترجع الخاصية `navigator.language` للقراءة فقط سلسلة تمثل اللغة المفضلة لمثيل Node.js. سيتم تحديد اللغة بواسطة مكتبة ICU المستخدمة بواسطة Node.js في وقت التشغيل بناءً على اللغة الافتراضية لنظام التشغيل.

تمثل القيمة إصدار اللغة كما هو محدد في [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

القيمة الاحتياطية على الإصدارات بدون ICU هي `'en-US'`.

```js [ESM]
console.log(`تحتوي اللغة المفضلة لمثيل Node.js على العلامة '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**أُضيف في: v21.2.0**

- {Array

خاصية `navigator.languages` للقراءة فقط تُرجع مصفوفة من السلاسل النصية التي تمثل اللغات المفضلة لمثيل Node.js. افتراضيًا، تحتوي `navigator.languages` فقط على قيمة `navigator.language`، والتي سيتم تحديدها بواسطة مكتبة ICU التي تستخدمها Node.js في وقت التشغيل بناءً على اللغة الافتراضية لنظام التشغيل.

القيمة الاحتياطية في الإصدارات بدون ICU هي `['en-US']`.

```js [ESM]
console.log(`اللغات المفضلة هي '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**أُضيف في: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

خاصية `navigator.platform` للقراءة فقط تُرجع سلسلة نصية تحدد النظام الأساسي الذي يتم تشغيل مثيل Node.js عليه.

```js [ESM]
console.log(`هذه العملية تعمل على ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**أُضيف في: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

خاصية `navigator.userAgent` للقراءة فقط تُرجع وكيل مستخدم يتكون من اسم وقت التشغيل ورقم الإصدار الرئيسي.

```js [ESM]
console.log(`وكيل المستخدم هو ${navigator.userAgent}`); // يطبع "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**أُضيف في: v19.0.0**

الفئة `PerformanceEntry`. انظر [`PerformanceEntry`](/ar/nodejs/api/perf_hooks#class-performanceentry) لمزيد من التفاصيل.

## `PerformanceMark` {#performancemark}

**أُضيف في: v19.0.0**

الفئة `PerformanceMark`. انظر [`PerformanceMark`](/ar/nodejs/api/perf_hooks#class-performancemark) لمزيد من التفاصيل.

## `PerformanceMeasure` {#performancemeasure}

**أُضيف في: v19.0.0**

الفئة `PerformanceMeasure`. انظر [`PerformanceMeasure`](/ar/nodejs/api/perf_hooks#class-performancemeasure) لمزيد من التفاصيل.

## `PerformanceObserver` {#performanceobserver}

**أُضيف في: v19.0.0**

الفئة `PerformanceObserver`. انظر [`PerformanceObserver`](/ar/nodejs/api/perf_hooks#class-performanceobserver) لمزيد من التفاصيل.

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**أُضيف في: v19.0.0**

الفئة `PerformanceObserverEntryList`. انظر [`PerformanceObserverEntryList`](/ar/nodejs/api/perf_hooks#class-performanceobserverentrylist) لمزيد من التفاصيل.


## `PerformanceResourceTiming` {#performanceresourcetiming}

**أُضيف في:** v19.0.0

الصنف `PerformanceResourceTiming`. انظر [`PerformanceResourceTiming`](/ar/nodejs/api/perf_hooks#class-performanceresourcetiming) لمزيد من التفاصيل.

## `performance` {#performance}

**أُضيف في:** v16.0.0

الكائن [`perf_hooks.performance`](/ar/nodejs/api/perf_hooks#perf_hooksperformance).

## `process` {#process}

**أُضيف في:** v0.1.7

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن العملية. انظر قسم [`process` object](/ar/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**أُضيف في:** v11.0.0

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المراد وضعها في قائمة الانتظار.

تقوم الطريقة `queueMicrotask()` بوضع مهمة مصغرة في قائمة الانتظار لاستدعاء `callback`. إذا أطلقت `callback` استثناءً، فسيتم إطلاق حدث `'uncaughtException'` الخاص بـ [`process` object](/ar/nodejs/api/process#process).

تتم إدارة قائمة انتظار المهام المصغرة بواسطة V8 ويمكن استخدامها بطريقة مماثلة لقائمة [`process.nextTick()`](/ar/nodejs/api/process#processnexttickcallback-args)، والتي تتم إدارتها بواسطة Node.js. تتم دائمًا معالجة قائمة `process.nextTick()` قبل قائمة انتظار المهام المصغرة في كل دورة من دورات حلقة أحداث Node.js.

```js [ESM]
// هنا، يتم استخدام `queueMicrotask()` لضمان أن حدث 'load' يتم إطلاقه دائمًا
// بشكل غير متزامن، وبالتالي بشكل متسق. استخدام
// `process.nextTick()` هنا سيؤدي إلى إطلاق حدث 'load' دائمًا
// قبل أي وظائف وعد أخرى.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```
## الصنف: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**أُضيف في:** v18.0.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تطبيق متوافق مع المتصفح لـ [`ReadableByteStreamController`](/ar/nodejs/api/webstreams#class-readablebytestreamcontroller).


## الفئة: `ReadableStream` {#class-readablestream}

**أُضيف في: v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`ReadableStream`](/ar/nodejs/api/webstreams#class-readablestream).

## الفئة: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**أُضيف في: v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`ReadableStreamBYOBReader`](/ar/nodejs/api/webstreams#class-readablestreambyobreader).

## الفئة: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**أُضيف في: v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`ReadableStreamBYOBRequest`](/ar/nodejs/api/webstreams#class-readablestreambyobrequest).

## الفئة: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**أُضيف في: v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`ReadableStreamDefaultController`](/ar/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## الفئة: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**أُضيف في: v18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`ReadableStreamDefaultReader`](/ar/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

قد يبدو هذا المتغير عالميًا ولكنه ليس كذلك. انظر [`require()`](/ar/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | لم يعد تجريبيًا. |
| v18.0.0 | لم يعد خلف علامة سطر الأوامر `--experimental-fetch`. |
| v17.5.0, v16.15.0 | أُضيف في: v17.5.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [مستقر: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ متوافق مع المتصفح لـ [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## `Request` {#request}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v21.0.0 | لم تعد تجريبية. |
| v18.0.0 | لم تعد وراء علامة CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | تمت الإضافة في: v17.5.0, v16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

تنفيذ متوافق مع المتصفح لـ [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**تمت الإضافة في: v22.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر.
:::

تنفيذ متوافق مع المتصفح لـ [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). يتم تخزين البيانات في الذاكرة، مع حصة تخزين تبلغ 10 ميغابايت. تستمر بيانات `sessionStorage` فقط داخل العملية قيد التشغيل حاليًا، ولا تتم مشاركتها بين العمال.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**تمت الإضافة في: v0.9.1**

يتم وصف [`setImmediate`](/ar/nodejs/api/timers#setimmediatecallback-args) في قسم [المؤقتات](/ar/nodejs/api/timers).

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**تمت الإضافة في: v0.0.1**

يتم وصف [`setInterval`](/ar/nodejs/api/timers#setintervalcallback-delay-args) في قسم [المؤقتات](/ar/nodejs/api/timers).

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**تمت الإضافة في: v0.0.1**

يتم وصف [`setTimeout`](/ar/nodejs/api/timers#settimeoutcallback-delay-args) في قسم [المؤقتات](/ar/nodejs/api/timers).

## Class: `Storage` {#class-storage}

**تمت الإضافة في: v22.4.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر.
:::

تنفيذ متوافق مع المتصفح لـ [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). قم بتمكين واجهة برمجة التطبيقات هذه باستخدام علامة CLI [`--experimental-webstorage`](/ar/nodejs/api/cli#--experimental-webstorage).

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**تمت الإضافة في: v17.0.0**

طريقة WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).


## ‏‎`SubtleCrypto`‎‏ {#subtlecrypto}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 19.0.0 | لم يعد خلف علامة سطر الأوامر ‎`--experimental-global-webcrypto`‎. |
| الإصدار 17.6.0، الإصدار 16.15.0 | تمت إضافته في: الإصدار 17.6.0، الإصدار 16.15.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تنفيذ متوافق مع المتصفح لـ ‎[\<SubtleCrypto\>](/ar/nodejs/api/webcrypto#class-subtlecrypto). هذا المتغير العام متاح فقط إذا تم تجميع ثنائي Node.js مع تضمين دعم وحدة ‎`node:crypto`‎.

## ‏‎`DOMException`‎‏ {#domexception}

**تمت الإضافة في: الإصدار 17.0.0**

فئة WHATWG ‏‎`DOMException`‎‏. راجع ‎[`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)‎‏ لمزيد من التفاصيل.

## ‏‎`TextDecoder`‎‏ {#textdecoder}

**تمت الإضافة في: الإصدار 11.0.0**

فئة WHATWG ‏‎`TextDecoder`‎‏. راجع قسم ‎[`TextDecoder`](/ar/nodejs/api/util#class-utiltextdecoder)‎‏.

## الفئة: ‎`TextDecoderStream`‎‏ {#class-textdecoderstream}

**تمت الإضافة في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ ‎[`TextDecoderStream`](/ar/nodejs/api/webstreams#class-textdecoderstream)‎‏.

## ‏‎`TextEncoder`‎‏ {#textencoder}

**تمت الإضافة في: الإصدار 11.0.0**

فئة WHATWG ‏‎`TextEncoder`‎‏. راجع قسم ‎[`TextEncoder`](/ar/nodejs/api/util#class-utiltextencoder)‎‏.

## الفئة: ‎`TextEncoderStream`‎‏ {#class-textencoderstream}

**تمت الإضافة في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ ‎[`TextEncoderStream`](/ar/nodejs/api/webstreams#class-textencoderstream)‎‏.

## الفئة: ‎`TransformStream`‎‏ {#class-transformstream}

**تمت الإضافة في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ ‎[`TransformStream`](/ar/nodejs/api/webstreams#class-transformstream)‎‏.

## الفئة: ‎`TransformStreamDefaultController`‎‏ {#class-transformstreamdefaultcontroller}

**تمت الإضافة في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ ‎[`TransformStreamDefaultController`](/ar/nodejs/api/webstreams#class-transformstreamdefaultcontroller)‎‏.


## `URL` {#url}

**أضيف في: الإصدار 10.0.0**

فئة `URL` الخاصة بـ WHATWG. انظر قسم [`URL`](/ar/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**أضيف في: الإصدار 10.0.0**

فئة `URLSearchParams` الخاصة بـ WHATWG. انظر قسم [`URLSearchParams`](/ar/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**أضيف في: الإصدار 8.0.0**

- [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

الكائن الذي يعمل كمساحة اسم لجميع الوظائف المتعلقة بـ W3C [WebAssembly](https://webassembly.org/). انظر [شبكة مطوري Mozilla](https://developer.mozilla.org/en-US/docs/WebAssembly) للاستخدام والتوافق.

## `WebSocket` {#websocket}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0 | لم تعد تجريبية. |
| v22.0.0 | لم تعد خلف علامة CLI `--experimental-websocket`. |
| v21.0.0, v20.10.0 | أضيف في: v21.0.0, v20.10.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

تنفيذ متوافق مع المتصفح لـ [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). قم بتعطيل هذا الـ API باستخدام علامة CLI [`--no-experimental-websocket`](/ar/nodejs/api/cli#--no-experimental-websocket).

## صنف: `WritableStream` {#class-writablestream}

**أضيف في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`WritableStream`](/ar/nodejs/api/webstreams#class-writablestream).

## صنف: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**أضيف في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`WritableStreamDefaultController`](/ar/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## صنف: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**أضيف في: الإصدار 18.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي.
:::

تنفيذ متوافق مع المتصفح لـ [`WritableStreamDefaultWriter`](/ar/nodejs/api/webstreams#class-writablestreamdefaultwriter).

