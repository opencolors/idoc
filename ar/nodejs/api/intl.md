---
title: توثيق Node.js - التدويل
description: يغطي هذا القسم من توثيق Node.js وحدة التدويل (Intl)، التي توفر الوصول إلى العديد من وظائف التدويل والتعريب، بما في ذلك الترتيب، وتنسيق الأرقام، وتنسيق التاريخ والوقت، والمزيد.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - التدويل | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يغطي هذا القسم من توثيق Node.js وحدة التدويل (Intl)، التي توفر الوصول إلى العديد من وظائف التدويل والتعريب، بما في ذلك الترتيب، وتنسيق الأرقام، وتنسيق التاريخ والوقت، والمزيد.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - التدويل | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يغطي هذا القسم من توثيق Node.js وحدة التدويل (Intl)، التي توفر الوصول إلى العديد من وظائف التدويل والتعريب، بما في ذلك الترتيب، وتنسيق الأرقام، وتنسيق التاريخ والوقت، والمزيد.
---


# دعم التدويل {#internationalization-support}

يحتوي Node.js على العديد من الميزات التي تجعل من السهل كتابة البرامج المدولة. بعضها:

- الدوال الحساسة للإعدادات المحلية أو المدركة لـ Unicode في [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/):
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- جميع الوظائف الموصوفة في [مواصفات واجهة برمجة تطبيقات تدويل ECMAScript](https://tc39.github.io/ecma402/) (المعروفة أيضًا باسم ECMA-402):
    - كائن [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
    - الطرق الحساسة للإعدادات المحلية مثل [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) و [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- دعم [أسماء النطاقات المدولة](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDNs) لـ [محلل عنوان URL الخاص بـ WHATWG](/ar/nodejs/api/url#the-whatwg-url-api)
- [`require('node:buffer').transcode()`](/ar/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- تحرير خطوط [REPL](/ar/nodejs/api/repl#repl) أكثر دقة
- [`require('node:util').TextDecoder`](/ar/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` هروب خصائص Unicode](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

يستخدم Node.js ومحرك V8 الأساسي [مكونات Unicode العالمية (ICU)](http://site.icu-project.org/) لتنفيذ هذه الميزات في كود C/C++ الأصلي. يتم توفير مجموعة بيانات ICU الكاملة بواسطة Node.js افتراضيًا. ومع ذلك، نظرًا لحجم ملف بيانات ICU، يتم توفير العديد من الخيارات لتخصيص مجموعة بيانات ICU إما عند إنشاء Node.js أو تشغيله.


## خيارات لإنشاء Node.js {#options-for-building-nodejs}

للتحكم في كيفية استخدام ICU في Node.js، تتوفر أربعة خيارات `configure` أثناء الترجمة. توجد تفاصيل إضافية حول كيفية تجميع Node.js في [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md).

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (افتراضي)

نظرة عامة على ميزات Node.js و JavaScript المتوفرة لكل خيار `configure`:

| الميزة | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | لا شيء (الدالة لا تعمل) | كامل | كامل | كامل |
| `String.prototype.to*Case()` | كامل | كامل | كامل | كامل |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | لا شيء (الكائن غير موجود) | جزئي/كامل (يعتمد على نظام التشغيل) | جزئي (باللغة الإنجليزية فقط) | كامل |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | جزئي (غير مدرك للإعدادات المحلية) | كامل | كامل | كامل |
| `String.prototype.toLocale*Case()` | جزئي (غير مدرك للإعدادات المحلية) | كامل | كامل | كامل |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | جزئي (غير مدرك للإعدادات المحلية) | جزئي/كامل (يعتمد على نظام التشغيل) | جزئي (باللغة الإنجليزية فقط) | كامل |
| `Date.prototype.toLocale*String()` | جزئي (غير مدرك للإعدادات المحلية) | جزئي/كامل (يعتمد على نظام التشغيل) | جزئي (باللغة الإنجليزية فقط) | كامل |
| [محلل عنوان URL القديم](/ar/nodejs/api/url#legacy-url-api) | جزئي (لا يدعم IDN) | كامل | كامل | كامل |
| [محلل عنوان URL WHATWG](/ar/nodejs/api/url#the-whatwg-url-api) | جزئي (لا يدعم IDN) | كامل | كامل | كامل |
| [`require('node:buffer').transcode()`](/ar/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | لا شيء (الدالة غير موجودة) | كامل | كامل | كامل |
| [REPL](/ar/nodejs/api/repl#repl) | جزئي (تحرير غير دقيق للسطر) | كامل | كامل | كامل |
| [`require('node:util').TextDecoder`](/ar/nodejs/api/util#class-utiltextdecoder) | جزئي (دعم الترميزات الأساسية) | جزئي/كامل (يعتمد على نظام التشغيل) | جزئي (Unicode فقط) | كامل |
| [`RegExp` مهربات خصائص Unicode](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | لا شيء (خطأ `RegExp` غير صالح) | كامل | كامل | كامل |
يشير مصطلح "(غير مدرك للإعدادات المحلية)" إلى أن الدالة تنفذ عمليتها تمامًا مثل الإصدار غير `Locale` من الدالة، إذا كان موجودًا. على سبيل المثال، في الوضع `none`، تكون عملية `Date.prototype.toLocaleString()` مطابقة لعملية `Date.prototype.toString()`.


### تعطيل جميع ميزات التدويل (`none`) {#disable-all-internationalization-features-none}

إذا تم اختيار هذا الخيار، فسيتم تعطيل ICU وستكون معظم ميزات التدويل المذكورة أعلاه **غير متاحة** في ملف `node` الثنائي الناتج.

### الإنشاء باستخدام ICU مثبت مسبقًا (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

يمكن لـ Node.js الارتباط بإنشاء ICU مثبت بالفعل على النظام. في الواقع، تأتي معظم توزيعات Linux بالفعل مع تثبيت ICU، وسيجعل هذا الخيار من الممكن إعادة استخدام نفس مجموعة البيانات المستخدمة من قبل المكونات الأخرى في نظام التشغيل.

الوظائف التي تتطلب مكتبة ICU نفسها فقط، مثل [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) و [محلل عنوان URL الخاص بـ WHATWG](/ar/nodejs/api/url#the-whatwg-url-api)، مدعومة بالكامل تحت `system-icu`. الميزات التي تتطلب بيانات لغة ICU بالإضافة إلى ذلك، مثل [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) *قد* تكون مدعومة بالكامل أو جزئيًا، اعتمادًا على مدى اكتمال بيانات ICU المثبتة على النظام.

### تضمين مجموعة محدودة من بيانات ICU (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

يجعل هذا الخيار الملف الثنائي الناتج يرتبط بمكتبة ICU بشكل ثابت، ويتضمن مجموعة فرعية من بيانات ICU (عادةً اللغة الإنجليزية فقط) داخل ملف `node` القابل للتنفيذ.

الوظائف التي تتطلب مكتبة ICU نفسها فقط، مثل [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) و [محلل عنوان URL الخاص بـ WHATWG](/ar/nodejs/api/url#the-whatwg-url-api)، مدعومة بالكامل تحت `small-icu`. الميزات التي تتطلب بيانات لغة ICU بالإضافة إلى ذلك، مثل [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)، تعمل عمومًا فقط مع اللغة الإنجليزية:

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Prints either "M01" or "January" on small-icu, depending on the user’s default locale
// Should print "enero"
```
يوفر هذا الوضع توازنًا بين الميزات وحجم الملف الثنائي.


#### توفير بيانات ICU في وقت التشغيل {#providing-icu-data-at-runtime}

إذا تم استخدام خيار `small-icu`، فلا يزال بإمكان المرء توفير بيانات لغة إضافية في وقت التشغيل حتى تعمل طرق JS لجميع لغات ICU. بافتراض أن ملف البيانات مخزن في `/runtime/directory/with/dat/file`، يمكن إتاحته لـ ICU من خلال أي مما يلي:

- خيار التهيئة `--with-icu-default-data-dir`: هذا يقوم فقط بتضمين مسار دليل البيانات الافتراضي في الملف الثنائي. سيتم تحميل ملف البيانات الفعلي في وقت التشغيل من مسار هذا الدليل.
- متغير البيئة [`NODE_ICU_DATA`](/ar/nodejs/api/cli#node_icu_datafile):
- معلمة CLI [`--icu-data-dir`](/ar/nodejs/api/cli#--icu-data-dirfile):

عند تحديد أكثر من واحد منهم، يكون لمعلمة CLI `--icu-data-dir` الأسبقية القصوى، ثم متغير البيئة `NODE_ICU_DATA`، ثم خيار التهيئة `--with-icu-default-data-dir`.

تستطيع ICU العثور على مجموعة متنوعة من تنسيقات البيانات وتحميلها تلقائيًا، ولكن يجب أن تكون البيانات مناسبة لإصدار ICU، وأن يكون اسم الملف صحيحًا. الاسم الأكثر شيوعًا لملف البيانات هو `icudtX[bl].dat`، حيث يشير `X` إلى إصدار ICU المقصود، وتشير `b` أو `l` إلى اتجاه النهاية (Endianness) للنظام. سيفشل Node.js في التحميل إذا تعذر قراءة ملف البيانات المتوقع من الدليل المحدد. يمكن حساب اسم ملف البيانات المقابل لإصدار Node.js الحالي باستخدام:

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
راجع مقالة ["بيانات ICU"](http://userguide.icu-project.org/icudata) في دليل مستخدم ICU للحصول على تنسيقات أخرى مدعومة والمزيد من التفاصيل حول بيانات ICU بشكل عام.

يمكن لوحدة npm [full-icu](https://www.npmjs.com/package/full-icu) تبسيط تثبيت بيانات ICU إلى حد كبير عن طريق اكتشاف إصدار ICU للملف التنفيذي `node` قيد التشغيل وتنزيل ملف البيانات المناسب. بعد تثبيت الوحدة من خلال `npm i full-icu`، سيكون ملف البيانات متاحًا في `./node_modules/full-icu`. يمكن بعد ذلك تمرير هذا المسار إما إلى `NODE_ICU_DATA` أو `--icu-data-dir` كما هو موضح أعلاه لتمكين دعم `Intl` الكامل.


### تضمين ICU بالكامل (`full-icu`) {#embed-the-entire-icu-full-icu}

يجعل هذا الخيار الملف الثنائي الناتج يرتبط بـ ICU بشكل ثابت ويتضمن مجموعة كاملة من بيانات ICU. لا يحتوي الملف الثنائي الذي يتم إنشاؤه بهذه الطريقة على أي تبعيات خارجية أخرى ويدعم جميع اللغات، ولكنه قد يكون كبيرًا إلى حد ما. هذا هو السلوك الافتراضي إذا لم يتم تمرير علامة `--with-intl`. يتم أيضًا إنشاء الملفات الثنائية الرسمية في هذا الوضع.

## الكشف عن دعم التدويل {#detecting-internationalization-support}

للتحقق من تمكين ICU على الإطلاق (`system-icu` أو `small-icu` أو `full-icu`)، يكفي ببساطة التحقق من وجود `Intl`:

```js [ESM]
const hasICU = typeof Intl === 'object';
```
بدلاً من ذلك، يمكن التحقق من `process.versions.icu`، وهي خاصية يتم تعريفها فقط عند تمكين ICU:

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
للتحقق من دعم لغة غير إنجليزية (مثل `full-icu` أو `system-icu`)، يمكن أن يكون [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) عاملاً مميزًا جيدًا:

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
لإجراء اختبارات أكثر تفصيلاً لدعم `Intl`، قد يكون من المفيد العثور على الموارد التالية:

- [btest402](https://github.com/srl295/btest402): يستخدم بشكل عام للتحقق مما إذا كان Node.js مع دعم `Intl` قد تم إنشاؤه بشكل صحيح.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): تتضمن مجموعة اختبار التوافق الرسمية لـ ECMAScript قسمًا مخصصًا لـ ECMA-402.

