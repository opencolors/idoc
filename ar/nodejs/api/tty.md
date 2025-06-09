---
title: توثيق Node.js - TTY
description: توفر وحدة TTY في Node.js واجهة للتفاعل مع أجهزة TTY (آلة الكتابة عن بعد)، بما في ذلك الأساليب للتحقق مما إذا كان التدفق هو TTY، والحصول على حجم النافذة، والتعامل مع أحداث الطرفية.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - TTY | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة TTY في Node.js واجهة للتفاعل مع أجهزة TTY (آلة الكتابة عن بعد)، بما في ذلك الأساليب للتحقق مما إذا كان التدفق هو TTY، والحصول على حجم النافذة، والتعامل مع أحداث الطرفية.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - TTY | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة TTY في Node.js واجهة للتفاعل مع أجهزة TTY (آلة الكتابة عن بعد)، بما في ذلك الأساليب للتحقق مما إذا كان التدفق هو TTY، والحصول على حجم النافذة، والتعامل مع أحداث الطرفية.
---


# TTY {#tty}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

يوفر الوحدة `node:tty` الفئتين `tty.ReadStream` و `tty.WriteStream`. في معظم الحالات، لن يكون من الضروري أو الممكن استخدام هذه الوحدة مباشرة. ومع ذلك، يمكن الوصول إليها باستخدام:

```js [ESM]
const tty = require('node:tty');
```
عندما يكتشف Node.js أنه يتم تشغيله باستخدام طرفية نصية ("TTY") مرفقة، سيتم تهيئة [`process.stdin`](/ar/nodejs/api/process#processstdin)، افتراضيًا، كمثيل لـ `tty.ReadStream` وسيتم تهيئة كل من [`process.stdout`](/ar/nodejs/api/process#processstdout) و [`process.stderr`](/ar/nodejs/api/process#processstderr)، افتراضيًا، كمثيلين لـ `tty.WriteStream`. الطريقة المفضلة لتحديد ما إذا كان Node.js يتم تشغيله في سياق TTY هي التحقق من أن قيمة الخاصية `process.stdout.isTTY` هي `true`:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
في معظم الحالات، لا ينبغي أن يكون هناك سبب يذكر لتطبيق ما لإنشاء مثيلات للفئتين `tty.ReadStream` و `tty.WriteStream` يدويًا.

## الفئة: `tty.ReadStream` {#class-ttyreadstream}

**تمت الإضافة في: v0.5.8**

- يمتد: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يمثل الجانب القابل للقراءة من TTY. في الظروف العادية، سيكون [`process.stdin`](/ar/nodejs/api/process#processstdin) هو المثال الوحيد لـ `tty.ReadStream` في عملية Node.js ولا ينبغي أن يكون هناك سبب لإنشاء مثيلات إضافية.

### `readStream.isRaw` {#readstreamisraw}

**تمت الإضافة في: v0.7.7**

قيمة `boolean` تكون `true` إذا تم تكوين TTY حاليًا للعمل كجهاز خام.

تكون هذه العلامة دائمًا `false` عند بدء العملية، حتى إذا كانت المحطة الطرفية تعمل في الوضع الخام. ستتغير قيمته مع الاستدعاءات اللاحقة لـ `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**تمت الإضافة في: v0.5.8**

قيمة `boolean` تكون دائمًا `true` لمثيلات `tty.ReadStream`.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**تمت الإضافة في: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تكوين `tty.ReadStream` للعمل كجهاز خام. إذا كانت `false`، فسيتم تكوين `tty.ReadStream` للعمل في الوضع الافتراضي الخاص به. سيتم تعيين الخاصية `readStream.isRaw` على الوضع الناتج.
- الإرجاع: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) نسخة دفق القراءة.

يسمح بتكوين `tty.ReadStream` بحيث يعمل كجهاز خام.

عندما يكون في الوضع الخام، يكون الإدخال متاحًا دائمًا حرفًا بحرف، ولا يشمل المعدلات. بالإضافة إلى ذلك، يتم تعطيل جميع المعالجة الخاصة للأحرف بواسطة الجهاز الطرفي، بما في ذلك تكرار أحرف الإدخال. لن تتسبب علامة `+` بعد ذلك في حدوث `SIGINT` عندما يكون في هذا الوضع.

## الصنف: `tty.WriteStream` {#class-ttywritestream}

**تمت الإضافة في: v0.5.8**

- يمتد: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

يمثل الجانب القابل للكتابة من TTY. في الظروف العادية، سيكون [`process.stdout`](/ar/nodejs/api/process#processstdout) و [`process.stderr`](/ar/nodejs/api/process#processstderr) هما مثيلتي `tty.WriteStream` الوحيدتين اللتين تم إنشاؤهما لعملية Node.js ولا ينبغي أن يكون هناك سبب لإنشاء مثيلات إضافية.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v0.9.4 | يتم دعم وسيطة `options`. |
| v0.5.8 | تمت الإضافة في: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف ملف مرتبط بـ TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الخيارات التي تم تمريرها إلى الأصل `net.Socket`، راجع `options` الخاصة بـ [`net.Socket` constructor](/ar/nodejs/api/net#new-netsocketoptions).
- الإرجاع [\<tty.ReadStream\>](/ar/nodejs/api/tty#class-ttyreadstream)

يقوم بإنشاء `ReadStream` لـ `fd` المرتبط بـ TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**تمت الإضافة في: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف ملف مرتبط بـ TTY.
- الإرجاع [\<tty.WriteStream\>](/ar/nodejs/api/tty#class-ttywritestream)

يقوم بإنشاء `WriteStream` لـ `fd` المرتبط بـ TTY.


### الحدث: `'resize'` {#event-resize}

**أُضيف في: الإصدار v0.7.7**

يُطلق الحدث `'resize'` عندما تتغير إحدى خصائص `writeStream.columns` أو `writeStream.rows`. لا تُمرر أي وسائط إلى دالة الاستماع عند استدعائها.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('screen size has changed!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### ‏`writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.7.0 | تم الكشف عن دالة الاستدعاء والقيمة المرجعة لـ stream's write(). |
| v0.7.7 | أُضيف في: الإصدار v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: إلى اليسار من المؤشر
    - `1`: إلى اليمين من المؤشر
    - `0`: السطر بأكمله
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تُستدعى بمجرد اكتمال العملية.
- القيمة المرجعة: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`false` إذا كان الدفق يريد أن ينتظر الكود المستدعي حتى يتم إطلاق الحدث `'drain'` قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

تقوم `writeStream.clearLine()` بمسح السطر الحالي لهذا `WriteStream` في اتجاه تحدده `dir`.

### ‏`writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.7.0 | تم الكشف عن دالة الاستدعاء والقيمة المرجعة لـ stream's write(). |
| v0.7.7 | أُضيف في: الإصدار v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تُستدعى بمجرد اكتمال العملية.
- القيمة المرجعة: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`false` إذا كان الدفق يريد أن ينتظر الكود المستدعي حتى يتم إطلاق الحدث `'drain'` قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

تقوم `writeStream.clearScreenDown()` بمسح هذا `WriteStream` من المؤشر الحالي نزولًا.


### `writeStream.columns` {#writestreamcolumns}

**أُضيف في: v0.7.7**

`number` يحدد عدد الأعمدة التي يمتلكها TTY حاليًا. يتم تحديث هذه الخاصية كلما تم إطلاق حدث `'resize'`.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v12.7.0 | تم كشف دالة رد الاتصال (callback) الخاصة بـ write() وقيمة الإرجاع الخاصة بالتدفق. |
| v0.7.7 | أُضيف في: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها بمجرد اكتمال العملية.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` إذا كان التدفق يرغب في أن ينتظر الكود المستدعي حتى يتم إطلاق حدث `'drain'` قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

`writeStream.cursorTo()` ينقل مؤشر `WriteStream` هذا إلى الموضع المحدد.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**أُضيف في: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على متغيرات البيئة المراد فحصها. يمكّن هذا من محاكاة استخدام محطة طرفية معينة. **افتراضي:** `process.env`.
- الإرجاع: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

الإرجاع:

- `1` لـ 2،
- `4` لـ 16،
- `8` لـ 256،
- `24` لـ 16,777,216 لونًا مدعومًا.

استخدم هذا لتحديد الألوان التي تدعمها المحطة الطرفية. نظرًا لطبيعة الألوان في المحطات الطرفية، فمن الممكن إما الحصول على نتائج إيجابية خاطئة أو نتائج سلبية خاطئة. يعتمد ذلك على معلومات العملية ومتغيرات البيئة التي قد تكذب بشأن المحطة الطرفية المستخدمة. من الممكن تمرير كائن `env` لمحاكاة استخدام محطة طرفية معينة. يمكن أن يكون هذا مفيدًا للتحقق من كيفية تصرف إعدادات بيئة معينة.

لفرض دعم لون معين، استخدم أحد إعدادات البيئة أدناه.

- لونان: `FORCE_COLOR = 0` (تعطيل الألوان)
- 16 لونًا: `FORCE_COLOR = 1`
- 256 لونًا: `FORCE_COLOR = 2`
- 16,777,216 لونًا: `FORCE_COLOR = 3`

يمكن أيضًا تعطيل دعم الألوان باستخدام متغيرات البيئة `NO_COLOR` و `NODE_DISABLE_COLORS`.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**تمت الإضافة في: v0.7.7**

- الإرجاع: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم `writeStream.getWindowSize()` بإرجاع حجم TTY المطابق لهذا `WriteStream`. المصفوفة من النوع `[numColumns, numRows]` حيث يمثل `numColumns` و `numRows` عدد الأعمدة والصفوف في TTY المطابق.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**تمت الإضافة في: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الألوان المطلوبة (الحد الأدنى 2). **افتراضي:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على متغيرات البيئة المراد فحصها. يتيح ذلك محاكاة استخدام محطة طرفية معينة. **افتراضي:** `process.env`.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

إرجاع `true` إذا كان `writeStream` يدعم عددًا من الألوان على الأقل مثل العدد المقدم في `count`. الحد الأدنى للدعم هو 2 (أبيض وأسود).

هذا لديه نفس الإيجابيات والسلبية الكاذبة كما هو موضح في [`writeStream.getColorDepth()`](/ar/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// إرجاع true أو false اعتمادًا على ما إذا كان `stdout` يدعم 16 لونًا على الأقل.
process.stdout.hasColors(256);
// إرجاع true أو false اعتمادًا على ما إذا كان `stdout` يدعم 256 لونًا على الأقل.
process.stdout.hasColors({ TMUX: '1' });
// إرجاع true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// إرجاع false (يتظاهر إعداد البيئة بدعم 2 ** 8 ألوان).
```
### `writeStream.isTTY` {#writestreamistty}

**تمت الإضافة في: v0.5.8**

قيمة `boolean` وهي دائمًا `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v12.7.0 | تم الكشف عن دالة الاسترجاع write() الخاصة بالدفق والقيمة المرجعة. |
| v0.7.7 | تمت الإضافة في: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤها بمجرد اكتمال العملية.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` إذا كان الدفق يرغب في أن ينتظر الكود الذي يستدعي حدث `'drain'` ليتم إصداره قبل الاستمرار في كتابة بيانات إضافية؛ وإلا `true`.

`writeStream.moveCursor()` ينقل مؤشر هذا `WriteStream` *بالنسبة* إلى موقعه الحالي.


### `writeStream.rows` {#writestreamrows}

**تمت الإضافة في: v0.7.7**

`number` تحدد عدد الصفوف التي يمتلكها TTY حاليًا. يتم تحديث هذه الخاصية كلما تم إصدار حدث `'resize'`.

## `tty.isatty(fd)` {#ttyisattyfd}

**تمت الإضافة في: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واصف ملف رقمي
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تقوم الطريقة `tty.isatty()` بإرجاع `true` إذا كان `fd` المحدد مرتبطًا بـ TTY و `false` إذا لم يكن كذلك، بما في ذلك عندما لا يكون `fd` عددًا صحيحًا غير سالب.

