---
title: توثيق Node.js - وحدة URL
description: توفر وحدة URL في Node.js أدوات لحل وتحليل الروابط. تدعم معيار WHATWG لـ URL وواجهة برمجة التطبيقات (API) القديمة urlObject، وتوفر أساليب للعمل مع الروابط في كلا التنسيقين.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - وحدة URL | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة URL في Node.js أدوات لحل وتحليل الروابط. تدعم معيار WHATWG لـ URL وواجهة برمجة التطبيقات (API) القديمة urlObject، وتوفر أساليب للعمل مع الروابط في كلا التنسيقين.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - وحدة URL | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة URL في Node.js أدوات لحل وتحليل الروابط. تدعم معيار WHATWG لـ URL وواجهة برمجة التطبيقات (API) القديمة urlObject، وتوفر أساليب للعمل مع الروابط في كلا التنسيقين.
---


# عنوان URL {#url}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

توفر وحدة `node:url` أدوات لتحليل عناوين URL وتفسيرها. يمكن الوصول إليها باستخدام:

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## سلاسل URL وكائنات URL {#url-strings-and-url-objects}

سلسلة URL هي سلسلة منظمة تحتوي على مكونات ذات معنى متعددة. عند تحليلها، يتم إرجاع كائن URL يحتوي على خصائص لكل من هذه المكونات.

توفر وحدة `node:url` واجهتي برمجة تطبيقات للعمل مع عناوين URL: واجهة برمجة تطبيقات قديمة خاصة بـ Node.js، وواجهة برمجة تطبيقات أحدث تنفذ نفس [معيار WHATWG URL](https://url.spec.whatwg.org/) المستخدم من قبل متصفحات الويب.

يتم توفير مقارنة بين واجهات برمجة تطبيقات WHATWG والواجهات القديمة أدناه. أعلاه عنوان URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`، يتم عرض خصائص كائن تم إرجاعه بواسطة `url.parse()` القديمة. يوجد أدناه خصائص كائن `URL` الخاص بـ WHATWG.

تتضمن خاصية `origin` الخاصة بـ WHATWG URL `protocol` و `host`، ولكن ليس `username` أو `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(يجب تجاهل جميع المسافات في سطر "". إنها فقط للتنسيق.)
```
تحليل سلسلة URL باستخدام واجهة برمجة تطبيقات WHATWG:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
تحليل سلسلة URL باستخدام واجهة برمجة التطبيقات القديمة:

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::

### بناء عنوان URL من الأجزاء المكونة والحصول على السلسلة التي تم إنشاؤها {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

من الممكن بناء عنوان URL متوافق مع معيار WHATWG من الأجزاء المكونة باستخدام إما أدوات تعيين الخصائص أو سلسلة حرفية للقالب:

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
للحصول على سلسلة عنوان URL التي تم إنشاؤها، استخدم أداة الوصول إلى الخاصية `href`:

```js [ESM]
console.log(myURL.href);
```
## واجهة برمجة تطبيقات عنوان URL المتوافق مع معيار WHATWG {#the-whatwg-url-api}

### الصنف: `URL` {#class-url}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | الصنف متاح الآن على الكائن العام. |
| v7.0.0, v6.13.0 | تمت الإضافة في: v7.0.0, v6.13.0 |
:::

صنف `URL` متوافق مع المتصفح، تم تنفيذه باتباع معيار WHATWG URL. يمكن العثور على [أمثلة لعناوين URL التي تم تحليلها](https://url.spec.whatwg.org/#example-url-parsing) في المعيار نفسه. صنف `URL` متاح أيضًا على الكائن العام.

وفقًا لتقاليد المتصفح، يتم تنفيذ جميع خصائص كائنات `URL` كوظائف جلب وتعيين على النموذج الأولي للصنف، بدلاً من كونها خصائص بيانات على الكائن نفسه. وبالتالي، على عكس [كائنات `urlObject` القديمة](/ar/nodejs/api/url#legacy-urlobject)s، فإن استخدام الكلمة المفتاحية `delete` على أي من خصائص كائنات `URL` (على سبيل المثال `delete myURL.protocol`، `delete myURL.pathname`، إلخ) ليس له أي تأثير ولكنه سيظل يُرجع `true`.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0, v18.17.0 | تمت إزالة شرط ICU. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL مطلق أو نسبي للإدخال المراد تحليله. إذا كان `input` نسبيًا، فإن `base` مطلوب. إذا كان `input` مطلقًا، فسيتم تجاهل `base`. إذا لم يكن `input` سلسلة، فسيتم [تحويله إلى سلسلة](https://tc39.es/ecma262/#sec-tostring) أولاً.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL الأساسي الذي سيتم الحل بالنسبة إليه إذا لم يكن `input` مطلقًا. إذا لم يكن `base` سلسلة، فسيتم [تحويله إلى سلسلة](https://tc39.es/ecma262/#sec-tostring) أولاً.

ينشئ كائن `URL` جديدًا عن طريق تحليل `input` بالنسبة إلى `base`. إذا تم تمرير `base` كسلسلة، فسيتم تحليله بشكل مكافئ لـ `new URL(base)`.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
يمكن الوصول إلى دالة إنشاء عنوان URL كخاصية على الكائن العام. يمكن أيضًا استيراده من وحدة عنوان url المضمنة:



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // يطبع 'true'.
```

```js [CJS]
console.log(URL === require('node:url').URL); // يطبع 'true'.
```
:::

سيتم طرح `TypeError` إذا لم يكن `input` أو `base` عنوان URL صالحًا. لاحظ أنه سيتم بذل جهد لإجبار القيم المعطاة على سلاسل. على سبيل المثال:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
سيتم تحويل أحرف Unicode التي تظهر داخل اسم المضيف لـ `input` تلقائيًا إلى ASCII باستخدام خوارزمية [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4).

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
في الحالات التي لا يُعرف فيها مسبقًا ما إذا كان `input` عنوان URL مطلقًا وتم توفير `base`، يُنصح بالتحقق من أن `origin` لكائن `URL` هو ما هو متوقع.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط الجزء المجزأ من عنوان URL.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Prints #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Prints https://example.org/foo#baz
```
يتم [ترميز النسبة المئوية](/ar/nodejs/api/url#percent-encoding-in-urls) لأحرف URL غير الصالحة المضمنة في القيمة المعينة للخاصية `hash`. قد يختلف اختيار الأحرف المراد ترميزها بالنسبة المئوية إلى حد ما عما قد تنتجه طرق [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) و [`url.format()`](/ar/nodejs/api/url#urlformaturlobject).

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء المضيف من عنوان URL.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Prints example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Prints https://example.com:82/foo
```
يتم تجاهل قيم المضيف غير الصالحة المعينة للخاصية `host`.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء اسم المضيف من عنوان URL. الفرق الرئيسي بين `url.host` و `url.hostname` هو أن `url.hostname` *لا* تتضمن المنفذ.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Prints example.org

// Setting the hostname does not change the port
myURL.hostname = 'example.com';
console.log(myURL.href);
// Prints https://example.com:81/foo

// Use myURL.host to change the hostname and port
myURL.host = 'example.org:82';
console.log(myURL.href);
// Prints https://example.org:82/foo
```
يتم تجاهل قيم اسم المضيف غير الصالحة المعينة للخاصية `hostname`.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط عنوان URL المتسلسل.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Prints https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Prints https://example.com/bar
```
إن الحصول على قيمة الخاصية `href` يعادل استدعاء [`url.toString()`](/ar/nodejs/api/url#urltostring).

إن تعيين قيمة هذه الخاصية إلى قيمة جديدة يعادل إنشاء كائن `URL` جديد باستخدام [`new URL(value)`](/ar/nodejs/api/url#new-urlinput-base). سيتم تعديل كل خصائص كائن `URL`.

إذا كانت القيمة المعينة للخاصية `href` ليست عنوان URL صالحًا، فسيتم طرح `TypeError`.


#### `url.origin` {#urlorigin}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | لم يعد المخطط "gopher" خاصًا و `url.origin` يعيد الآن `'null'` له. |
:::

- [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل على التسلسل للقراءة فقط لأصل عنوان URL.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// يطبع https://example.org
```
```js [ESM]
const idnURL = new URL('https://اختبار');
console.log(idnURL.origin);
// يطبع https://xn--g6w251d

console.log(idnURL.hostname);
// يطبع xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء كلمة المرور في عنوان URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// يطبع xyz

myURL.password = '123';
console.log(myURL.href);
// يطبع https://abc:/
```
يتم [ترميز النسبة المئوية](/ar/nodejs/api/url#percent-encoding-in-urls) لأحرف عنوان URL غير الصالحة المضمنة في القيمة المعينة لخاصية `password`. قد يختلف تحديد الأحرف المراد ترميزها بالنسبة المئوية إلى حد ما عما تنتجه طرق [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) و [`url.format()`](/ar/nodejs/api/url#urlformaturlobject).

#### `url.pathname` {#urlpathname}

- [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء المسار في عنوان URL.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// يطبع /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// يطبع https://example.org/abcdef?123
```
يتم [ترميز النسبة المئوية](/ar/nodejs/api/url#percent-encoding-in-urls) لأحرف عنوان URL غير الصالحة المضمنة في القيمة المعينة لخاصية `pathname`. قد يختلف تحديد الأحرف المراد ترميزها بالنسبة المئوية إلى حد ما عما تنتجه طرق [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) و [`url.format()`](/ar/nodejs/api/url#urlformaturlobject).


#### `url.port` {#urlport}

::: info [تاريخ]
| الإصدار | التغييرات |
|---|---|
| v15.0.0 | لم يعد مخطط "gopher" خاصًا. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء المنفذ من عنوان URL.

يمكن أن تكون قيمة المنفذ رقمًا أو سلسلة تحتوي على رقم في النطاق من `0` إلى `65535` (شامل). سيؤدي تعيين القيمة إلى المنفذ الافتراضي لكائنات `URL` المعطاة `protocol` إلى أن تصبح قيمة `port` سلسلة فارغة (`''`).

يمكن أن تكون قيمة المنفذ سلسلة فارغة وفي هذه الحالة يعتمد المنفذ على البروتوكول/المخطط:

| البروتوكول | المنفذ |
|---|---|
| "ftp" | 21 |
| "file" |  |
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
عند تعيين قيمة للمنفذ، سيتم أولاً تحويل القيمة إلى سلسلة باستخدام `.toString()`.

إذا كانت هذه السلسلة غير صالحة ولكنها تبدأ برقم، فسيتم تعيين الرقم البادئ إلى `port`. إذا كان الرقم يقع خارج النطاق المشار إليه أعلاه، فسيتم تجاهله.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// يطبع 8888

// يتم تحويل المنافذ الافتراضية تلقائيًا إلى السلسلة الفارغة
// (المنفذ الافتراضي لبروتوكول HTTPS هو 443)
myURL.port = '443';
console.log(myURL.port);
// يطبع السلسلة الفارغة
console.log(myURL.href);
// يطبع https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// يطبع 1234
console.log(myURL.href);
// يطبع https://example.org:1234/

// يتم تجاهل سلاسل المنفذ غير الصالحة تمامًا
myURL.port = 'abcd';
console.log(myURL.port);
// يطبع 1234

// يتم التعامل مع الأرقام البادئة كرقم منفذ
myURL.port = '5678abcd';
console.log(myURL.port);
// يطبع 5678

// يتم اقتطاع الأرقام غير الصحيحة
myURL.port = 1234.5678;
console.log(myURL.port);
// يطبع 1234

// سيتم تجاهل الأرقام الخارجة عن النطاق والتي لم يتم تمثيلها بالتدوين العلمي.
myURL.port = 1e10; // 10000000000، سيتم التحقق من النطاق كما هو موضح أدناه
console.log(myURL.port);
// يطبع 1234
```
الأرقام التي تحتوي على فاصلة عشرية، مثل الأرقام ذات الفاصلة العائمة أو الأرقام في التدوين العلمي، ليست استثناءً لهذه القاعدة. سيتم تعيين الأرقام البادئة حتى العلامة العشرية كمنفذ URL، على افتراض أنها صالحة:

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// يطبع 4 (لأنه الرقم البادئ في السلسلة '4.567e21')
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء البروتوكول من عنوان URL.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// يطبع https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// يطبع ftp://example.org/
```
يتم تجاهل قيم بروتوكول URL غير الصالحة المعينة لخاصية `protocol`.

##### المخططات الخاصة {#special-schemes}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v15.0.0 | لم يعد المخطط "gopher" خاصًا. |
:::

يعتبر [معيار WHATWG URL](https://url.spec.whatwg.org/) مجموعة قليلة من مخططات بروتوكول URL *خاصة* من حيث كيفية تحليلها وتسلسلها. عندما يتم تحليل عنوان URL باستخدام أحد هذه البروتوكولات الخاصة، فقد يتم تغيير خاصية `url.protocol` إلى بروتوكول خاص آخر ولكن لا يمكن تغييرها إلى بروتوكول غير خاص، والعكس صحيح.

على سبيل المثال، يعمل التغيير من `http` إلى `https`:

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
ومع ذلك، فإن التغيير من `http` إلى بروتوكول `fish` افتراضي لا يعمل لأن البروتوكول الجديد ليس خاصًا.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
وبالمثل، فإن التغيير من بروتوكول غير خاص إلى بروتوكول خاص غير مسموح به أيضًا:

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
وفقًا لمعيار WHATWG URL، فإن مخططات البروتوكول الخاصة هي `ftp` و`file` و`http` و`https` و`ws` و`wss`.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويضبط جزء الاستعلام المتسلسل من عنوان URL.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// يطبع ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// يطبع https://example.org/abc?abc=xyz
```
سيتم [ترميز النسبة المئوية](/ar/nodejs/api/url#percent-encoding-in-urls) لأي أحرف URL غير صالحة تظهر في القيمة المعينة للخاصية `search`. قد يختلف اختيار الأحرف المراد ترميزها بالنسبة المئوية إلى حد ما عما تنتجه طرق [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) و[`url.format()`](/ar/nodejs/api/url#urlformaturlobject).


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/ar/nodejs/api/url#class-urlsearchparams)

يحصل على كائن [`URLSearchParams`](/ar/nodejs/api/url#class-urlsearchparams) الذي يمثل معلمات الاستعلام الخاصة بعنوان URL. هذه الخاصية للقراءة فقط ولكن يمكن استخدام كائن `URLSearchParams` الذي توفره لتغيير مثيل URL؛ لاستبدال كامل معلمات الاستعلام الخاصة بعنوان URL، استخدم أداة تعيين [`url.search`](/ar/nodejs/api/url#urlsearch). راجع وثائق [`URLSearchParams`](/ar/nodejs/api/url#class-urlsearchparams) للحصول على التفاصيل.

توخَّ الحذر عند استخدام `.searchParams` لتعديل `URL` لأنه، وفقًا لمواصفات WHATWG، يستخدم كائن `URLSearchParams` قواعد مختلفة لتحديد الأحرف التي يجب ترميزها بالنسبة المئوية. على سبيل المثال، لن يقوم كائن `URL` بترميز النسبة المئوية لحرف المدة ASCII (`~`)، بينما سيقوم `URLSearchParams` دائمًا بترميزه:

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // يطبع ?foo=~bar

// تعديل عنوان URL عبر searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // يطبع ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحصل ويعيّن جزء اسم المستخدم في عنوان URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// يطبع abc

myURL.username = '123';
console.log(myURL.href);
// يطبع https://123:/
```
سيتم [ترميز النسبة المئوية](/ar/nodejs/api/url#percent-encoding-in-urls) لأي أحرف URL غير صالحة تظهر في القيمة المعينة لخاصية `username`. قد يختلف اختيار الأحرف التي سيتم ترميزها بالنسبة المئوية إلى حد ما عما ستنتجه طرق [`url.parse()`](/ar/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) و [`url.format()`](/ar/nodejs/api/url#urlformaturlobject).

#### `url.toString()` {#urltostring}

- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تعيد طريقة `toString()` في كائن `URL` عنوان URL المتسلسل. القيمة التي تم إرجاعها مكافئة لقيمة [`url.href`](/ar/nodejs/api/url#urlhref) و [`url.toJSON()`](/ar/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**أضيف في: الإصدار 7.7.0، الإصدار 6.13.0**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `toJSON()` على الكائن `URL` بإرجاع عنوان URL المتسلسل. القيمة التي يتم إرجاعها تعادل قيمة [`url.href`](/ar/nodejs/api/url#urlhref) و [`url.toString()`](/ar/nodejs/api/url#urltostring).

يتم استدعاء هذه الطريقة تلقائيًا عندما يتم تسلسل كائن `URL` باستخدام [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**أضيف في: الإصدار 16.7.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `blob` [\<Blob\>](/ar/nodejs/api/buffer#class-blob)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

ينشئ سلسلة عنوان URL `'blob:nodedata:...'` التي تمثل كائن [\<Blob\>](/ar/nodejs/api/buffer#class-blob) المحدد ويمكن استخدامها لاسترداد `Blob` لاحقًا.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
سيتم الاحتفاظ بالبيانات المخزنة بواسطة [\<Blob\>](/ar/nodejs/api/buffer#class-blob) المسجل في الذاكرة حتى يتم استدعاء `URL.revokeObjectURL()` لإزالته.

يتم تسجيل كائنات `Blob` داخل سلسلة العمليات الحالية. في حالة استخدام سلاسل عمليات Worker، لن تكون كائنات `Blob` المسجلة داخل Worker واحد متاحة لعمال آخرين أو لسلسلة العمليات الرئيسية.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**أضيف في: الإصدار 16.7.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة عنوان URL `'blob:nodedata:...` تم إرجاعها بواسطة استدعاء سابق لـ `URL.createObjectURL()`.

يزيل [\<Blob\>](/ar/nodejs/api/buffer#class-blob) المخزن المحدد بواسطة المعرف المحدد. محاولة إلغاء معرف غير مسجل ستفشل بصمت.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**أضيف في:** v19.9.0, v18.17.0

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL المدخل المطلق أو النسبي المراد تحليله. إذا كان `input` نسبيًا، فإن `base` مطلوب. إذا كان `input` مطلقًا، فسيتم تجاهل `base`. إذا لم يكن `input` سلسلة، فسيتم [تحويله إلى سلسلة](https://tc39.es/ecma262/#sec-tostring) أولاً.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL الأساسي الذي سيتم التحليل مقابله إذا لم يكن `input` مطلقًا. إذا لم يكن `base` سلسلة، فسيتم [تحويله إلى سلسلة](https://tc39.es/ecma262/#sec-tostring) أولاً.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

يتحقق مما إذا كان يمكن تحليل `input` بالنسبة إلى `base` إلى `URL`.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**أضيف في:** v22.1.0

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL المدخل المطلق أو النسبي المراد تحليله. إذا كان `input` نسبيًا، فإن `base` مطلوب. إذا كان `input` مطلقًا، فسيتم تجاهل `base`. إذا لم يكن `input` سلسلة، فسيتم [تحويله إلى سلسلة](https://tc39.es/ecma262/#sec-tostring) أولاً.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL الأساسي الذي سيتم التحليل مقابله إذا لم يكن `input` مطلقًا. إذا لم يكن `base` سلسلة، فسيتم [تحويله إلى سلسلة](https://tc39.es/ecma262/#sec-tostring) أولاً.
- Returns: [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

يقوم بتحليل سلسلة كنص URL. إذا تم توفير `base`، فسيتم استخدامه كعنوان URL الأساسي لغرض تحليل عناوين URL `input` غير المطلقة. يُرجع `null` إذا لم يكن `input` صالحًا.


### الفئة: `URLSearchParams` {#class-urlsearchparams}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار 10.0.0 | الفئة متاحة الآن على الكائن العام. |
| الإصدار 7.5.0, 6.13.0 | تمت الإضافة في: الإصدار 7.5.0, 6.13.0 |
:::

توفر واجهة برمجة التطبيقات `URLSearchParams` إمكانية الوصول للقراءة والكتابة إلى استعلام `URL`. يمكن أيضًا استخدام فئة `URLSearchParams` بشكل مستقل مع أحد المنشئات الأربعة التالية. فئة `URLSearchParams` متاحة أيضًا على الكائن العام.

تتشابه واجهة WHATWG `URLSearchParams` ووحدة [`querystring`](/ar/nodejs/api/querystring) في الغرض، ولكن الغرض من وحدة [`querystring`](/ar/nodejs/api/querystring) هو أكثر عمومية، حيث يسمح بتخصيص أحرف المحدد (`&` و `=`). من ناحية أخرى، تم تصميم واجهة برمجة التطبيقات هذه خصيصًا لسلاسل استعلام URL.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// يطبع 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// يطبع https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// يطبع https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// ما سبق يعادل
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// يطبع https://example.org/?a=b
console.log(newSearchParams.toString());
// يطبع a=b&a=c

// يتم استدعاء newSearchParams.toString() ضمنيًا
myURL.search = newSearchParams;
console.log(myURL.href);
// يطبع https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// يطبع https://example.org/?a=b&a=c
```
#### `new URLSearchParams()` {#new-urlsearchparams}

قم بإنشاء كائن `URLSearchParams` فارغ جديد.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة استعلام

حلل `string` كسلسلة استعلام، واستخدمها لإنشاء كائن `URLSearchParams` جديد. يتم تجاهل `'?'` بادئة، إذا كانت موجودة.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// يطبع 'abc'
console.log(params.toString());
// يطبع 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// يطبع 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**تمت الإضافة في: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يمثل مجموعة من أزواج المفاتيح والقيم

قم بإنشاء كائن `URLSearchParams` جديد باستخدام خريطة تجزئة للاستعلام. يتم دائمًا تحويل مفتاح وقيمة كل خاصية من `obj` إلى سلاسل نصية.

على عكس الوحدة [`querystring`](/ar/nodejs/api/querystring)، لا يُسمح بالمفاتيح المكررة في شكل قيم مصفوفة. يتم تحويل المصفوفات إلى سلاسل نصية باستخدام [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)، والتي ببساطة تجمع جميع عناصر المصفوفة بفواصل.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// تطبع [ 'first,second' ]
console.log(params.toString());
// تطبع 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**تمت الإضافة في: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) كائن قابل للتكرار عناصره عبارة عن أزواج المفاتيح والقيم

قم بإنشاء كائن `URLSearchParams` جديد باستخدام خريطة قابلة للتكرار بطريقة مشابهة لمنشئ [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). يمكن أن يكون `iterable` عبارة عن `Array` أو أي كائن قابل للتكرار. هذا يعني أن `iterable` يمكن أن يكون `URLSearchParams` آخر، وفي هذه الحالة سيقوم المنشئ ببساطة بإنشاء نسخة من `URLSearchParams` المقدمة. عناصر `iterable` هي أزواج المفاتيح والقيم، ويمكن أن تكون هي نفسها أي كائن قابل للتكرار.

يُسمح بالمفاتيح المكررة.

```js [ESM]
let params;

// استخدام مصفوفة
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// تطبع 'user=abc&query=first&query=second'

// استخدام كائن Map
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// تطبع 'user=abc&query=xyz'

// استخدام دالة مولد
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// تطبع 'user=abc&query=first&query=second'

// يجب أن يحتوي كل زوج مفتاح-قيمة على عنصرين بالضبط
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// يطرح TypeError [ERR_INVALID_TUPLE]:
//        يجب أن يكون كل زوج استعلام عبارة عن مجموعة [اسم، قيمة] قابلة للتكرار
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يضيف زوج اسم-قيمة جديد إلى سلسلة الاستعلام.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.2.0, v18.18.0 | إضافة دعم لوسيطة `value` اختيارية. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إذا تم توفير `value`، فإنه يزيل جميع أزواج الاسم-القيمة حيث يكون الاسم `name` والقيمة هي `value`.

إذا لم يتم توفير `value`، فإنه يزيل جميع أزواج الاسم-القيمة التي يكون اسمها `name`.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

يُرجع ES6 `Iterator` على كل زوج من أزواج الاسم-القيمة في الاستعلام. كل عنصر من عناصر التكرار هو `Array` JavaScript. العنصر الأول من `Array` هو `name`، والعنصر الثاني من `Array` هو `value`.

اسم بديل لـ [`urlSearchParams[@@iterator]()`](/ar/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد اتصال غير صالح إلى وسيطة `fn` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يتم استدعاؤه لكل زوج اسم-قيمة في الاستعلام
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) لاستخدامه كقيمة `this` عند استدعاء `fn`

يتكرر على كل زوج اسم-قيمة في الاستعلام ويستدعي الدالة المحددة.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// يطبع:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) سلسلة أو `null` إذا لم يكن هناك زوج اسم-قيمة بالاسم المحدد `name`.

تُرجع قيمة أول زوج اسم-قيمة يكون اسمه `name`. إذا لم تكن هناك أزواج كهذه، يتم إرجاع `null`.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع قيم جميع أزواج الاسم-القيمة التي يكون اسمها `name`. إذا لم تكن هناك أزواج كهذه، يتم إرجاع مصفوفة فارغة.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.2.0, v18.18.0 | إضافة دعم الوسيطة الاختيارية `value`. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تتحقق مما إذا كان كائن `URLSearchParams` يحتوي على زوج (أزواج) مفتاح-قيمة بناءً على `name` ووسيطة `value` اختيارية.

إذا تم توفير `value`، يتم إرجاع `true` عندما يوجد زوج اسم-قيمة بنفس `name` و `value`.

إذا لم يتم توفير `value`، يتم إرجاع `true` إذا كان هناك زوج اسم-قيمة واحد على الأقل يكون اسمه `name`.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

تُرجع `Iterator` ES6 على أسماء كل زوج اسم-قيمة.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// يطبع:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُعيّن القيمة في كائن `URLSearchParams` المرتبط بـ `name` إلى `value`. إذا كان هناك أي أزواج اسم-قيمة موجودة مسبقًا أسماؤها `name`، فيُعيّن قيمة الزوج الأول من هذا القبيل إلى `value` ويزيل جميع الأزواج الأخرى. إذا لم يكن الأمر كذلك، فيلحق زوج الاسم-القيمة بسلسلة الاستعلام.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Prints foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Prints foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**أُضيف في: الإصدار v19.8.0, v18.16.0**

إجمالي عدد إدخالات المعلمات.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**أُضيف في: الإصدار v7.7.0, v6.13.0**

يرتب جميع أزواج الاسم-القيمة الموجودة في مكانها حسب أسمائها. يتم الفرز باستخدام [خوارزمية فرز مستقرة](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)، لذلك يتم الحفاظ على الترتيب النسبي بين أزواج الاسم-القيمة التي لها نفس الاسم.

يمكن استخدام هذه الطريقة، على وجه الخصوص، لزيادة عدد مرات الوصول إلى ذاكرة التخزين المؤقت.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Prints query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع معلمات البحث المسلسلة كسلسلة، مع ترميز الأحرف بنسبة مئوية عند الضرورة.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

يُرجع `Iterator` لـ ES6 على قيم كل زوج اسم-قيمة.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

يُرجع `Iterator` ES6 على كل من أزواج الاسم-القيمة في سلسلة الاستعلام. كل عنصر من عناصر المُكرِّر هو `Array` JavaScript. العنصر الأول من `Array` هو `name`، والعنصر الثاني من `Array` هو `value`.

اسم بديل لـ [`urlSearchParams.entries()`](/ar/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0, v18.17.0 | تمت إزالة متطلبات ICU. |
| v7.4.0, v6.13.0 | أُضيف في: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع تسلسل ASCII لـ [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) الخاص بـ `domain`. إذا كان `domain` نطاقًا غير صالح، فسيتم إرجاع سلسلة فارغة.

إنه ينفذ العملية العكسية لـ [`url.domainToUnicode()`](/ar/nodejs/api/url#urldomaintounicodedomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0, v18.17.0 | تمت إزالة متطلبات ICU. |
| v7.4.0, v6.13.0 | أُضيف في: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع تسلسل Unicode الخاص بـ `domain`. إذا كان `domain` نطاقًا غير صالح، فسيتم إرجاع سلسلة فارغة.

إنه ينفذ العملية العكسية لـ [`url.domainToASCII()`](/ar/nodejs/api/url#urldomaintoasciidomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | يمكن الآن استخدام وسيطة `options` لتحديد كيفية تحليل وسيطة `path`. |
| v10.12.0 | تمت إضافته في: v10.12.0 |
:::

- `url` [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة عنوان URL للملف أو كائن عنوان URL المراد تحويله إلى مسار.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) ‏`true` إذا كان يجب إرجاع `path` كمسار ملف windows، ‏`false` لـ posix، و `undefined` للإعداد الافتراضي للنظام. **الافتراضي:** ‏`undefined`.


- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار ملف Node.js خاص بالنظام الأساسي تم حله بالكامل.

تضمن هذه الوظيفة فك الترميز الصحيح للأحرف المشفرة بالنسبة المئوية بالإضافة إلى ضمان سلسلة مسار مطلق صالحة عبر الأنظمة الأساسية.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // غير صحيح: /C:/path/
fileURLToPath('file:///C:/path/');         // صحيح:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // غير صحيح: /foo.txt
fileURLToPath('file://nas/foo.txt');       // صحيح:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // غير صحيح: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // صحيح:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // غير صحيح: /hello%20world
fileURLToPath('file:///hello world');      // صحيح:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // غير صحيح: /C:/path/
fileURLToPath('file:///C:/path/');         // صحيح:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // غير صحيح: /foo.txt
fileURLToPath('file://nas/foo.txt');       // صحيح:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // غير صحيح: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // صحيح:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // غير صحيح: /hello%20world
fileURLToPath('file:///hello world');      // صحيح:   /hello world (POSIX)
```
:::

### `url.format(URL[, options])` {#urlformaturl-options}

**أُضيف في: v7.6.0**

- `URL` [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) كائن [WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كان يجب أن تتضمن سلسلة URL التسلسلية اسم المستخدم وكلمة المرور، ‏`false` خلاف ذلك. **الافتراضي:** ‏`true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كان يجب أن تتضمن سلسلة URL التسلسلية الجزء، ‏`false` خلاف ذلك. **الافتراضي:** ‏`true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كان يجب أن تتضمن سلسلة URL التسلسلية استعلام البحث، ‏`false` خلاف ذلك. **الافتراضي:** ‏`true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كان يجب ترميز أحرف Unicode التي تظهر في مكون المضيف لسلسلة URL مباشرةً بدلاً من ترميز Punycode. **الافتراضي:** ‏`false`.


- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع تسلسل قابل للتخصيص لتمثيل URL `String` لكائن [WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api).

يحتوي كائن URL على كل من طريقة `toString()` وخاصية `href` التي تُرجع تسلسلات سلسلة URL. ومع ذلك، هذه ليست قابلة للتخصيص بأي شكل من الأشكال. تتيح طريقة `url.format(URL[, options])` التخصيص الأساسي للإخراج.



::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | يمكن الآن استخدام وسيطة `options` لتحديد كيفية إرجاع قيمة `path`. |
| v10.12.0 | أُضيف في: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المسار المراد تحويله إلى عنوان URL للملف.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` إذا كان يجب التعامل مع `path` كمسار ملف بنظام التشغيل Windows، و `false` لنظام التشغيل POSIX، و `undefined` للقيمة الافتراضية للنظام. **افتراضي:** `undefined`.


- إرجاع: [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) كائن عنوان URL للملف.

تضمن هذه الدالة أن يتم حل `path` بشكل مطلق، وأن يتم ترميز أحرف التحكم في عنوان URL بشكل صحيح عند التحويل إلى عنوان URL للملف.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // غير صحيح: file:///foo#1
pathToFileURL('/foo#1');              // صحيح:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // غير صحيح: file:///some/path%.c
pathToFileURL('/some/path%.c');       // صحيح:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // غير صحيح: يطرح خطأً (POSIX)
new URL(__filename);                  // غير صحيح: C:\... (Windows)
pathToFileURL(__filename);            // صحيح:   file:///... (POSIX)
pathToFileURL(__filename);            // صحيح:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // غير صحيح: file:///foo#1
pathToFileURL('/foo#1');              // صحيح:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // غير صحيح: file:///some/path%.c
pathToFileURL('/some/path%.c');       // صحيح:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v19.9.0, v18.17.0 | سيحتوي الكائن المُرجع أيضًا على جميع الخصائص القابلة للتعداد الخاصة بالوسيطة `url`. |
| v15.7.0, v14.18.0 | تمت الإضافة في: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) كائن [WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api) المراد تحويله إلى كائن خيارات.
- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن الخيارات
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) البروتوكول المراد استخدامه.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المجال أو عنوان IP للخادم لإصدار الطلب إليه.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الجزء المجزأ من عنوان URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) جزء الاستعلام المتسلسل من عنوان URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) جزء المسار من عنوان URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الطلب. يجب أن يتضمن سلسلة الاستعلام إن وجدت. على سبيل المثال `'/index.html?page=12'`. يتم طرح استثناء عندما يحتوي مسار الطلب على أحرف غير قانونية. حاليًا، يتم رفض المسافات فقط ولكن قد يتغير ذلك في المستقبل.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL المتسلسل.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) منفذ الخادم البعيد.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المصادقة الأساسية، أي `'user:password'` لحساب رأس التفويض.

تقوم هذه الوظيفة المساعدة بتحويل كائن URL إلى كائن خيارات عادي كما هو متوقع من واجهات برمجة التطبيقات [`http.request()`](/ar/nodejs/api/http#httprequestoptions-callback) و [`https.request()`](/ar/nodejs/api/https#httpsrequestoptions-callback).

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## واجهة برمجة تطبيقات عنوان URL القديمة {#legacy-url-api}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.13.0, v14.17.0 | تم إلغاء الإيقاف. تم تغيير الحالة إلى "قديم". |
| v11.0.0 | واجهة برمجة التطبيقات هذه مهملة. |
:::

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [مستقر: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم واجهة برمجة تطبيقات عنوان URL الخاصة بـ WHATWG بدلاً من ذلك.
:::

### `urlObject` القديم {#legacy-urlobject}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.13.0, v14.17.0 | تم إلغاء الإيقاف. تم تغيير الحالة إلى "قديم". |
| v11.0.0 | واجهة برمجة تطبيقات عنوان URL القديمة مهملة. استخدم واجهة برمجة تطبيقات عنوان URL الخاصة بـ WHATWG. |
:::

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [مستقر: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم واجهة برمجة تطبيقات عنوان URL الخاصة بـ WHATWG بدلاً من ذلك.
:::

يتم إنشاء وإرجاع `urlObject` القديم (`require('node:url').Url` أو `import { Url } from 'node:url'`) بواسطة الدالة `url.parse()`.

#### `urlObject.auth` {#urlobjectauth}

خاصية `auth` هي جزء اسم المستخدم وكلمة المرور من عنوان URL، ويشار إليها أيضًا باسم *معلومات المستخدم*. يتبع هذا الجزء الفرعي من السلسلة `protocol` والشرطتين المائلتين (إذا كانتا موجودتين) ويسبق مكون `host`، المحدد بـ `@`. السلسلة إما اسم المستخدم، أو اسم المستخدم وكلمة المرور مفصولين بـ `:`.

على سبيل المثال: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

خاصية `hash` هي جزء مُعرّف المقطع من عنوان URL بما في ذلك حرف `#` البادئ.

على سبيل المثال: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

خاصية `host` هي الجزء المضيف الكامل من عنوان URL بأحرف صغيرة، بما في ذلك `port` إذا تم تحديده.

على سبيل المثال: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

خاصية `hostname` هي الجزء الخاص باسم المضيف بأحرف صغيرة من مكون `host` *بدون* تضمين `port`.

على سبيل المثال: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

خاصية `href` هي سلسلة عنوان URL الكاملة التي تم تحليلها مع تحويل كل من مكونات `protocol` و `host` إلى أحرف صغيرة.

على سبيل المثال: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

الخاصية `path` هي سلسلة متصلة من المكونين `pathname` و `search`.

على سبيل المثال: `'/p/a/t/h?query=string'`.

لا يتم فك ترميز `path`.

#### `urlObject.pathname` {#urlobjectpathname}

تتكون الخاصية `pathname` من قسم المسار بأكمله من عنوان URL. هذا هو كل شيء يتبع `host` (بما في ذلك `port`) وقبل بداية المكونات `query` أو `hash`، مفصولة إما بعلامة الاستفهام ASCII (`?`) أو علامات التصنيف (`#`).

على سبيل المثال: `'/p/a/t/h'`.

لا يتم فك ترميز سلسلة المسار.

#### `urlObject.port` {#urlobjectport}

الخاصية `port` هي الجزء الرقمي لمنفذ المكون `host`.

على سبيل المثال: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

تحدد الخاصية `protocol` مخطط البروتوكول الخاص بعنوان URL بأحرف صغيرة.

على سبيل المثال: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

الخاصية `query` هي إما سلسلة الاستعلام بدون علامة الاستفهام ASCII الأولية (`?`)، أو كائن يتم إرجاعه بواسطة طريقة `parse()` الخاصة بالوحدة النمطية [`querystring`](/ar/nodejs/api/querystring). يتم تحديد ما إذا كانت الخاصية `query` عبارة عن سلسلة أو كائن بواسطة وسيطة `parseQueryString` التي تم تمريرها إلى `url.parse()`.

على سبيل المثال: `'query=string'` أو `{'query': 'string'}`.

إذا تم إرجاعه كسلسلة، فلن يتم فك ترميز سلسلة الاستعلام. إذا تم إرجاعه ككائن، فسيتم فك ترميز كل من المفاتيح والقيم.

#### `urlObject.search` {#urlobjectsearch}

تتكون الخاصية `search` من جزء "سلسلة الاستعلام" بالكامل من عنوان URL، بما في ذلك علامة الاستفهام ASCII الأولية (`?`).

على سبيل المثال: `'?query=string'`.

لا يتم فك ترميز سلسلة الاستعلام.

#### `urlObject.slashes` {#urlobjectslashes}

الخاصية `slashes` هي `boolean` بقيمة `true` إذا كانت هناك حاجة إلى حرفين مائلين للأمام ASCII (`/`) بعد النقطتين في `protocol`.

### `url.format(urlObject)` {#urlformaturlobject}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v17.0.0 | يطرح الآن استثناء `ERR_INVALID_URL` عندما يُدخل تحويل Punycode لاسم المضيف تغييرات قد تتسبب في إعادة تحليل عنوان URL بشكل مختلف. |
| v15.13.0، v14.17.0 | تم إلغاء الإيقاف. تم تغيير الحالة إلى "Legacy". |
| v11.0.0 | واجهة برمجة تطبيقات URL القديمة مهملة. استخدم واجهة برمجة تطبيقات WHATWG URL. |
| v7.0.0 | ستستخدم عناوين URL التي تحتوي على مخطط `file:` دائمًا العدد الصحيح من الشرطات المائلة بغض النظر عن خيار `slashes`. يتم الآن أيضًا احترام خيار `slashes` الخاطئ بدون بروتوكول في جميع الأوقات. |
| v0.1.25 | تمت الإضافة في: v0.1.25 |
:::

::: info [مستقر: 3 - Legacy]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - Legacy: استخدم واجهة برمجة تطبيقات WHATWG URL بدلاً من ذلك.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) كائن عنوان URL (كما تم إرجاعه بواسطة `url.parse()` أو تم إنشاؤه بخلاف ذلك). إذا كانت سلسلة، فسيتم تحويلها إلى كائن عن طريق تمريرها إلى `url.parse()`.

تقوم الطريقة `url.format()` بإرجاع سلسلة عنوان URL منسقة مشتقة من `urlObject`.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
إذا لم يكن `urlObject` كائنًا أو سلسلة، فستطرح `url.format()` خطأ [`TypeError`](/ar/nodejs/api/errors#class-typeerror).

تعمل عملية التنسيق على النحو التالي:

- يتم إنشاء سلسلة فارغة جديدة `result`.
- إذا كانت `urlObject.protocol` سلسلة، فسيتم إلحاقها كما هي بـ `result`.
- وإلا، إذا لم يكن `urlObject.protocol` غير `undefined` ولم يكن سلسلة، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error).
- بالنسبة لجميع قيم السلسلة الخاصة بـ `urlObject.protocol` التي *لا تنتهي* بحرف نقطتين ASCII (`:`)، سيتم إلحاق السلسلة الحرفية `:` بـ `result`.
- إذا كان أي من الشرطين التاليين صحيحًا، فسيتم إلحاق السلسلة الحرفية `//` بـ `result`:
    - الخاصية `urlObject.slashes` صحيحة.
    - يبدأ `urlObject.protocol` بـ `http` أو `https` أو `ftp` أو `gopher` أو `file`.
  
 
- إذا كانت قيمة الخاصية `urlObject.auth` صحيحة، ولم تكن `urlObject.host` أو `urlObject.hostname` غير `undefined`، فسيتم إجبار قيمة `urlObject.auth` على سلسلة وإلحاقها بـ `result` متبوعة بالسلسلة الحرفية `@`.
- إذا كانت الخاصية `urlObject.host` غير `undefined`، فسيحدث ما يلي:
    - إذا كانت `urlObject.hostname` سلسلة، فسيتم إلحاقها بـ `result`.
    - وإلا، إذا لم يكن `urlObject.hostname` غير `undefined` ولم يكن سلسلة، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error).
    - إذا كانت قيمة الخاصية `urlObject.port` صحيحة، ولم تكن `urlObject.hostname` غير `undefined`:
    - يتم إلحاق السلسلة الحرفية `:` بـ `result`.
    - يتم إجبار قيمة `urlObject.port` على سلسلة وإلحاقها بـ `result`.
  
 
  
 
- وإلا، إذا كانت قيمة الخاصية `urlObject.host` صحيحة، فسيتم إجبار قيمة `urlObject.host` على سلسلة وإلحاقها بـ `result`.
- إذا كانت الخاصية `urlObject.pathname` سلسلة وليست سلسلة فارغة:
    - إذا *لم تبدأ* `urlObject.pathname` بشرطة مائلة للأمام ASCII (`/`)، فسيتم إلحاق السلسلة الحرفية `'/'` بـ `result`.
    - يتم إلحاق قيمة `urlObject.pathname` بـ `result`.
  
 
- وإلا، إذا لم يكن `urlObject.pathname` غير `undefined` ولم يكن سلسلة، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error).
- إذا كانت الخاصية `urlObject.search` غير `undefined` وإذا كانت الخاصية `urlObject.query` عبارة عن `Object`، فسيتم إلحاق السلسلة الحرفية `?` بـ `result` متبوعة بمخرج استدعاء طريقة `stringify()` الخاصة بالوحدة النمطية [`querystring`](/ar/nodejs/api/querystring) مع تمرير قيمة `urlObject.query`.
- وإلا، إذا كانت `urlObject.search` سلسلة:
    - إذا *لم تبدأ* قيمة `urlObject.search` بعلامة الاستفهام ASCII (`?`)، فسيتم إلحاق السلسلة الحرفية `?` بـ `result`.
    - يتم إلحاق قيمة `urlObject.search` بـ `result`.
  
 
- وإلا، إذا لم يكن `urlObject.search` غير `undefined` ولم يكن سلسلة، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error).
- إذا كانت الخاصية `urlObject.hash` سلسلة:
    - إذا *لم تبدأ* قيمة `urlObject.hash` بعلامة التصنيف ASCII (`#`)، فسيتم إلحاق السلسلة الحرفية `#` بـ `result`.
    - يتم إلحاق قيمة `urlObject.hash` بـ `result`.
  
 
- وإلا، إذا لم يكن `urlObject.hash` غير `undefined` ولم يكن سلسلة، فسيتم طرح [`Error`](/ar/nodejs/api/errors#class-error).
- يتم إرجاع `result`.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0, v18.13.0 | إهلاك خاص بالتوثيق. |
| v15.13.0, v14.17.0 | تم إلغاء الإهلاك. تم تغيير الحالة إلى "قديم". |
| v11.14.0 | خاصية `pathname` في كائن عنوان URL المُرجع هي الآن `/` عندما لا يوجد مسار ونظام البروتوكول هو `ws:` أو `wss:`. |
| v11.0.0 | واجهة برمجة تطبيقات URL القديمة مهملة. استخدم واجهة برمجة تطبيقات WHATWG URL. |
| v9.0.0 | خاصية `search` في كائن عنوان URL المُرجع هي الآن `null` عندما لا يوجد سلسلة استعلام. |
| v0.1.25 | تمت الإضافة في: v0.1.25 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم واجهة برمجة تطبيقات WHATWG URL بدلاً من ذلك.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة URL المراد تحليلها.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم دائمًا تعيين خاصية `query` لكائن مُرجع بواسطة طريقة `parse()` الخاصة بوحدة [`querystring`](/ar/nodejs/api/querystring). إذا كانت `false`، فستكون خاصية `query` في كائن عنوان URL المُرجع عبارة عن سلسلة غير مُحللة وغير مفككة. **افتراضي:** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تفسير الرمز المميز الأول بعد السلسلة الحرفية `//` والتي تسبق `/` التالية على أنه `host`. على سبيل المثال، بالنظر إلى `//foo/bar`، ستكون النتيجة `{host: 'foo', pathname: '/bar'}` بدلاً من `{pathname: '//foo/bar'}`. **افتراضي:** `false`.

تأخذ طريقة `url.parse()` سلسلة URL وتحللها وترجع كائن URL.

يتم طرح `TypeError` إذا لم تكن `urlString` سلسلة.

يتم طرح `URIError` إذا كانت خاصية `auth` موجودة ولكن لا يمكن فك ترميزها.

تستخدم `url.parse()` خوارزمية متساهلة وغير قياسية لتحليل سلاسل URL. وهي عرضة للمشكلات الأمنية مثل [انتحال اسم المضيف](https://hackerone.com/reports/678487) والمعالجة غير الصحيحة لأسماء المستخدمين وكلمات المرور. لا تستخدم مع مدخلات غير موثوق بها. لا يتم إصدار CVE لنقاط الضعف في `url.parse()`. استخدم واجهة برمجة تطبيقات [WHATWG URL](/ar/nodejs/api/url#the-whatwg-url-api) بدلاً من ذلك.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.13.0, v14.17.0 | تم إلغاء الإيقاف. تم تغيير الحالة إلى "قديم". |
| v11.0.0 | واجهة برمجة تطبيقات عنوان URL القديمة مهملة. استخدم واجهة برمجة تطبيقات عنوان URL الخاصة بـ WHATWG. |
| v6.6.0 | يتم الآن الحفاظ على حقول `auth` سليمة عندما يشير `from` و `to` إلى نفس المضيف. |
| v6.0.0 | تم الآن مسح حقول `auth` عندما تحتوي معلمة `to` على اسم مضيف. |
| v6.5.0, v4.6.2 | يتم الآن نسخ حقل `port` بشكل صحيح. |
| v0.1.25 | تمت الإضافة في: v0.1.25 |
:::

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم واجهة برمجة تطبيقات عنوان URL الخاصة بـ WHATWG بدلاً من ذلك.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL الأساسي المراد استخدامه إذا كان `to` عنوان URL نسبيًا.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL الهدف المراد حله.

تقوم طريقة `url.resolve()` بحل عنوان URL هدف بالنسبة إلى عنوان URL أساسي بطريقة مشابهة لتلك التي يستخدمها مستعرض الويب لحل علامة ارتساء.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
لتحقيق نفس النتيجة باستخدام واجهة برمجة تطبيقات عنوان URL الخاصة بـ WHATWG:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` هو عنوان URL نسبي.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## ترميز النسبة المئوية في عناوين URL {#percent-encoding-in-urls}

يُسمح لعناوين URL باحتواء نطاق معين فقط من الأحرف. يجب ترميز أي حرف يقع خارج هذا النطاق. تعتمد كيفية ترميز هذه الأحرف والأحرف التي سيتم ترميزها بشكل كامل على مكان وجود الحرف داخل بنية عنوان URL.


### واجهة برمجة التطبيقات القديمة {#legacy-api}

ضمن واجهة برمجة التطبيقات القديمة، سيتم تلقائيًا تضمين المسافات (`' '`) والأحرف التالية في خصائص كائنات URL:

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
على سبيل المثال، يتم ترميز حرف المسافة ASCII (`' '`) كـ `%20`. يتم ترميز حرف الشرطة المائلة للأمام ASCII (`/`) كـ `%3C`.

### واجهة برمجة تطبيقات WHATWG {#whatwg-api}

يستخدم [معيار WHATWG URL](https://url.spec.whatwg.org/) نهجًا أكثر انتقائية وتفصيلاً لتحديد الأحرف المشفرة من ذلك المستخدم في واجهة برمجة التطبيقات القديمة.

تحدد خوارزمية WHATWG أربع "مجموعات ترميز النسبة المئوية" التي تصف نطاقات الأحرف التي يجب ترميزها بنسبة مئوية:

- تتضمن *مجموعة ترميز النسبة المئوية للتحكم C0* نقاط التعليمات البرمجية في النطاق من U+0000 إلى U+001F (شاملة) وجميع نقاط التعليمات البرمجية الأكبر من U+007E (~).
- تتضمن *مجموعة ترميز النسبة المئوية للقطعة* *مجموعة ترميز النسبة المئوية للتحكم C0* ونقاط التعليمات البرمجية U+0020 SPACE، U+0022 ("")، U+003C (\<)، U+003E (\>)، وU+0060 (`).
- تتضمن *مجموعة ترميز النسبة المئوية للمسار* *مجموعة ترميز النسبة المئوية للتحكم C0* ونقاط التعليمات البرمجية U+0020 SPACE، U+0022 ("")، U+0023 (#)، U+003C (\<)، U+003E (\>)، U+003F (?)، U+0060 (`)، U+007B ({)، وU+007D (}).
- تتضمن *مجموعة ترميز معلومات المستخدم* *مجموعة ترميز النسبة المئوية للمسار* ونقاط التعليمات البرمجية U+002F (/)، U+003A (:)، U+003B (;)، U+003D (=)، U+0040 (@)، U+005B ([) إلى U+005E(^)، وU+007C (|).

تُستخدم *مجموعة ترميز النسبة المئوية لمعلومات المستخدم* حصريًا لأسماء المستخدمين وكلمات المرور المشفرة داخل عنوان URL. تُستخدم *مجموعة ترميز النسبة المئوية للمسار* لمسار معظم عناوين URL. تُستخدم *مجموعة ترميز النسبة المئوية للقطعة* لقطاعات عنوان URL. تُستخدم *مجموعة ترميز النسبة المئوية للتحكم C0* للمضيف والمسار في ظل ظروف محددة معينة، بالإضافة إلى جميع الحالات الأخرى.

عندما تظهر أحرف غير ASCII داخل اسم مضيف، يتم ترميز اسم المضيف باستخدام خوارزمية [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4). ومع ذلك، لاحظ أن اسم المضيف *قد* يحتوي على أحرف *مشفرة بـ Punycode وأحرف مشفرة بنسبة مئوية*:

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

