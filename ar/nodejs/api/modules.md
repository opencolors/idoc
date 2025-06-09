---
title: توثيق Node.js - الوحدات
description: استكشف توثيق Node.js حول الوحدات، بما في ذلك CommonJS و ES modules، وكيفية إدارة التبعيات وحل الوحدات.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الوحدات | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف توثيق Node.js حول الوحدات، بما في ذلك CommonJS و ES modules، وكيفية إدارة التبعيات وحل الوحدات.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الوحدات | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف توثيق Node.js حول الوحدات، بما في ذلك CommonJS و ES modules، وكيفية إدارة التبعيات وحل الوحدات.
---


# الوحدات: وحدات CommonJS {#modules-commonjs-modules}

::: tip [مستقرة: 2 - مستقرة]
[مستقرة: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقرة
:::

وحدات CommonJS هي الطريقة الأصلية لتغليف كود JavaScript لـ Node.js. يدعم Node.js أيضًا معيار [وحدات ECMAScript](/ar/nodejs/api/esm) المستخدم من قبل المتصفحات وبيئات تشغيل JavaScript الأخرى.

في Node.js، يتم التعامل مع كل ملف كوحدة منفصلة. على سبيل المثال، ضع في اعتبارك ملفًا باسم `foo.js`:

```js [ESM]
const circle = require('./circle.js');
console.log(`مساحة دائرة نصف قطرها 4 هي ${circle.area(4)}`);
```
في السطر الأول، يقوم `foo.js` بتحميل الوحدة `circle.js` الموجودة في نفس الدليل الذي يوجد فيه `foo.js`.

إليك محتويات `circle.js`:

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
قامت الوحدة `circle.js` بتصدير الدالتين `area()` و `circumference()`. تتم إضافة الدوال والكائنات إلى جذر الوحدة عن طريق تحديد خصائص إضافية على الكائن الخاص `exports`.

ستكون المتغيرات المحلية للوحدة خاصة، لأن الوحدة ملفوفة في دالة بواسطة Node.js (انظر [غلاف الوحدة](/ar/nodejs/api/modules#the-module-wrapper)). في هذا المثال، المتغير `PI` خاص بـ `circle.js`.

يمكن تعيين قيمة جديدة للخاصية `module.exports` (مثل دالة أو كائن).

في الكود التالي، يستخدم `bar.js` الوحدة `square`، التي تصدر فئة Square:

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`مساحة mySquare هي ${mySquare.area()}`);
```
تم تعريف الوحدة `square` في `square.js`:

```js [ESM]
// لن يؤدي التعيين إلى exports إلى تعديل الوحدة، يجب استخدام module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
يتم تنفيذ نظام وحدات CommonJS في [الوحدة الأساسية `module`](/ar/nodejs/api/module).

## التمكين {#enabling}

لدى Node.js نظامان للوحدات: وحدات CommonJS و [وحدات ECMAScript](/ar/nodejs/api/esm).

بشكل افتراضي، سيعامل Node.js ما يلي كوحدات CommonJS:

- الملفات بامتداد `.cjs`؛
- الملفات بامتداد `.js` عندما يحتوي ملف `package.json` الأقرب على حقل ["type"](/ar/nodejs/api/packages#type) ذي المستوى الأعلى بقيمة `"commonjs"`؛
- الملفات بامتداد `.js` أو بدون امتداد، عندما لا يحتوي ملف `package.json` الأقرب على حقل ["type"](/ar/nodejs/api/packages#type) ذي المستوى الأعلى أو لا يوجد `package.json` في أي مجلد أصلي؛ ما لم يحتوي الملف على بناء نحوي يسبب خطأ ما لم يتم تقييمه كوحدة ES. يجب على مؤلفي الحزمة تضمين الحقل ["type"](/ar/nodejs/api/packages#type)، حتى في الحزم التي تكون فيها جميع المصادر CommonJS. إن كونك صريحًا بشأن `type` الحزمة سيجعل الأمور أسهل بالنسبة لأدوات الإنشاء والمحملات لتحديد كيفية تفسير الملفات في الحزمة.
- الملفات ذات الامتداد الذي ليس `.mjs` أو `.cjs` أو `.json` أو `.node` أو `.js` (عندما يحتوي ملف `package.json` الأقرب على حقل ["type"](/ar/nodejs/api/packages#type) ذي المستوى الأعلى بقيمة `"module"`، سيتم التعرف على هذه الملفات كوحدات CommonJS فقط إذا تم تضمينها عبر `require()`، وليس عند استخدامها كنقطة دخول سطر الأوامر للبرنامج).

راجع [تحديد نظام الوحدة](/ar/nodejs/api/packages#determining-module-system) لمزيد من التفاصيل.

يستخدم استدعاء `require()` دائمًا محمل وحدات CommonJS. يستخدم استدعاء `import()` دائمًا محمل وحدات ECMAScript.


## الوصول إلى الوحدة الرئيسية {#accessing-the-main-module}

عند تشغيل ملف مباشرة من Node.js، يتم تعيين `require.main` إلى `module` الخاص به. هذا يعني أنه من الممكن تحديد ما إذا كان قد تم تشغيل ملف مباشرة عن طريق اختبار `require.main === module`.

بالنسبة للملف `foo.js`، سيكون هذا `true` إذا تم تشغيله عبر `node foo.js`، ولكن `false` إذا تم تشغيله بواسطة `require('./foo')`.

عندما لا تكون نقطة الدخول وحدة نمطية CommonJS، يكون `require.main` هو `undefined`، والوحدة الرئيسية خارج نطاق الوصول.

## نصائح مدير الحزم {#package-manager-tips}

تم تصميم دلالات دالة `require()` الخاصة بـ Node.js لتكون عامة بما يكفي لدعم هياكل الدليل المعقولة. نأمل أن تجد برامج إدارة الحزم مثل `dpkg` و `rpm` و `npm` أنه من الممكن إنشاء حزم أصلية من وحدات Node.js النمطية دون تعديل.

فيما يلي، نقدم هيكل دليل مقترحًا يمكن أن ينجح:

لنفترض أننا أردنا أن يحتوي المجلد الموجود في `/usr/lib/node/\<some-package\>/\<some-version\>` على محتويات إصدار معين من حزمة.

يمكن أن تعتمد الحزم على بعضها البعض. لتثبيت الحزمة `foo`، قد يكون من الضروري تثبيت إصدار معين من الحزمة `bar`. قد يكون للحزمة `bar` نفسها تبعيات، وفي بعض الحالات، قد تتصادم هذه التبعيات أو تشكل تبعيات دورية.

نظرًا لأن Node.js يبحث عن `realpath` لأي وحدات نمطية يقوم بتحميلها (أي أنه يحل الروابط الرمزية) ثم [يبحث عن تبعياتها في مجلدات `node_modules`](/ar/nodejs/api/modules#loading-from-node_modules-folders)، يمكن حل هذا الموقف باستخدام البنية التالية:

- `/usr/lib/node/foo/1.2.3/`: محتويات الحزمة `foo`، الإصدار 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: محتويات الحزمة `bar` التي تعتمد عليها `foo`.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: رابط رمزي إلى `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: روابط رمزية إلى الحزم التي تعتمد عليها `bar`.

وبالتالي، حتى إذا تمت مصادفة دورة، أو إذا كانت هناك تعارضات في التبعية، فستتمكن كل وحدة نمطية من الحصول على إصدار من التبعية الخاصة بها يمكنها استخدامه.

عندما يقوم الكود الموجود في الحزمة `foo` بتنفيذ `require('bar')`، فإنه سيحصل على الإصدار المرتبط رمزيًا بـ `/usr/lib/node/foo/1.2.3/node_modules/bar`. ثم، عندما يستدعي الكود الموجود في الحزمة `bar` الدالة `require('quux')`، فإنه سيحصل على الإصدار المرتبط رمزيًا بـ `/usr/lib/node/bar/4.3.2/node_modules/quux`.

علاوة على ذلك، لجعل عملية البحث عن الوحدة النمطية أكثر مثالية، بدلاً من وضع الحزم مباشرة في `/usr/lib/node`، يمكننا وضعها في `/usr/lib/node_modules/\<name\>/\<version\>`. ثم لن يكلف Node.js نفسه عناء البحث عن التبعيات المفقودة في `/usr/node_modules` أو `/node_modules`.

لجعل الوحدات النمطية متاحة لـ Node.js REPL، قد يكون من المفيد أيضًا إضافة المجلد `/usr/lib/node_modules` إلى متغير البيئة `$NODE_PATH`. نظرًا لأن عمليات البحث عن الوحدة النمطية باستخدام مجلدات `node_modules` كلها نسبية، وتستند إلى المسار الحقيقي للملفات التي تجري استدعاءات لـ `require()`، فيمكن أن تكون الحزم نفسها في أي مكان.


## تحميل وحدات ECMAScript باستخدام `require()` {#loading-ecmascript-modules-using-require}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | لم تعد هذه الميزة تصدر تحذيرًا تجريبيًا بشكل افتراضي، على الرغم من أنه لا يزال من الممكن إصدار التحذير بواسطة ‎--trace-require-module‎. |
| v23.0.0 | لم تعد هذه الميزة خلف علامة CLI ‏‎--experimental-require-module‎. |
| v23.0.0 | دعم تصدير التفاعل `'module.exports'` في `require(esm)`. |
| v22.0.0, v20.17.0 | تمت الإضافة في: v22.0.0، v20.17.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح الإصدار
:::

الامتداد ‎`.mjs`‎ مخصص لـ [وحدات ECMAScript](/ar/nodejs/api/esm). راجع قسم [تحديد نظام الوحدة](/ar/nodejs/api/packages#determining-module-system) للحصول على مزيد من المعلومات حول الملفات التي يتم تحليلها كوحدات ECMAScript.

تدعم `require()` فقط تحميل وحدات ECMAScript التي تستوفي المتطلبات التالية:

- الوحدة متزامنة بالكامل (لا تحتوي على `await` ذي المستوى الأعلى)؛ و
- يتم استيفاء أحد هذه الشروط:

إذا كانت وحدة ES التي يتم تحميلها تستوفي المتطلبات، يمكن لـ `require()` تحميلها وإرجاع كائن مساحة اسم الوحدة. في هذه الحالة، يشبه الأمر `import()` الديناميكي ولكنه يعمل بشكل متزامن ويعيد كائن مساحة الاسم مباشرة.

مع وحدات ES التالية:

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
يمكن لوحدة CommonJS تحميلها باستخدام `require()`:

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
للتوافق مع الأدوات الحالية التي تحول وحدات ES إلى CommonJS، والتي يمكنها بعد ذلك تحميل وحدات ES حقيقية من خلال `require()`، ستحتوي مساحة الاسم التي تم إرجاعها على خاصية `__esModule: true` إذا كان لديها تصدير `default` بحيث يمكن للتعليمات البرمجية المستهلكة التي تم إنشاؤها بواسطة الأدوات التعرف على عمليات التصدير الافتراضية في وحدات ES الحقيقية. إذا كانت مساحة الاسم تحدد بالفعل `__esModule`، فلن تتم إضافة ذلك. هذه الخاصية تجريبية ويمكن أن تتغير في المستقبل. يجب أن تستخدمها فقط الأدوات التي تحول وحدات ES إلى وحدات CommonJS، باتباع اصطلاحات النظام البيئي الحالية. يجب على التعليمات البرمجية التي تم إنشاؤها مباشرة في CommonJS تجنب الاعتماد عليها.

عندما تحتوي وحدة ES على كل من عمليات التصدير المسماة وتصدير افتراضي، فإن النتيجة التي يتم إرجاعها بواسطة `require()` هي كائن مساحة اسم الوحدة، الذي يضع التصدير الافتراضي في الخاصية ‎`.default`‎، على غرار النتائج التي يتم إرجاعها بواسطة `import()`. لتخصيص ما يجب إرجاعه بواسطة `require(esm)` مباشرة، يمكن لوحدة ES تصدير القيمة المطلوبة باستخدام اسم السلسلة `"module.exports"`.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` is lost to CommonJS consumers of this module, unless it's
// added to `Point` as a static property.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Named exports are lost when 'module.exports' is used
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
لاحظ في المثال أعلاه، عند استخدام اسم التصدير `module.exports`، ستفقد عمليات التصدير المسماة لمستهلكي CommonJS. للسماح لمستهلكي CommonJS بالاستمرار في الوصول إلى عمليات التصدير المسماة، يمكن للوحدة التأكد من أن التصدير الافتراضي هو كائن مع عمليات التصدير المسماة المرفقة به كخصائص. على سبيل المثال، مع المثال أعلاه، يمكن إرفاق `distance` بالتصدير الافتراضي، فئة `Point`، كطريقة ثابتة.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
إذا كانت الوحدة التي يتم `require()`'d تحتوي على `await` ذي المستوى الأعلى، أو كان الرسم البياني للوحدة الذي `import`'s يحتوي على `await` ذي المستوى الأعلى، فسيتم طرح [`ERR_REQUIRE_ASYNC_MODULE`](/ar/nodejs/api/errors#err_require_async_module). في هذه الحالة، يجب على المستخدمين تحميل الوحدة غير المتزامنة باستخدام [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

إذا تم تمكين ‎`--experimental-print-required-tla`‎، فبدلاً من طرح ‎`ERR_REQUIRE_ASYNC_MODULE`‎ قبل التقييم، سيقوم Node.js بتقييم الوحدة ومحاولة تحديد مواقع عمليات الانتظار ذات المستوى الأعلى وطباعة موقعها لمساعدة المستخدمين على إصلاحها.

دعم تحميل وحدات ES باستخدام `require()` تجريبي حاليًا ويمكن تعطيله باستخدام ‎`--no-experimental-require-module`‎. لطباعة مكان استخدام هذه الميزة، استخدم [`--trace-require-module`](/ar/nodejs/api/cli#--trace-require-modulemode).

يمكن الكشف عن هذه الميزة عن طريق التحقق مما إذا كان [`process.features.require_module`](/ar/nodejs/api/process#processfeaturesrequire_module) هو `true`.


## الكل معا {#all-together}

للحصول على اسم الملف الدقيق الذي سيتم تحميله عند استدعاء `require()`، استخدم الدالة `require.resolve()`.

بوضع كل ما سبق معا، إليك الخوارزمية عالية المستوى في الشفرة الزائفة لما تفعله `require()`:

```text [TEXT]
require(X) من وحدة نمطية في المسار Y
1. إذا كان X وحدة نمطية أساسية،
   أ. أرجع الوحدة النمطية الأساسية
   ب. توقف
2. إذا كان X يبدأ بـ '/'
   أ. اضبط Y لتكون جذر نظام الملفات
3. إذا كان X يبدأ بـ './' أو '/' أو '../'
   أ. LOAD_AS_FILE(Y + X)
   ب. LOAD_AS_DIRECTORY(Y + X)
   ج. ألقِ "لم يتم العثور عليه"
4. إذا كان X يبدأ بـ '#'
   أ. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. ألقِ "لم يتم العثور عليه"

MAYBE_DETECT_AND_LOAD(X)
1. إذا تم تحليل X كوحدة نمطية CommonJS، فقم بتحميل X كوحدة نمطية CommonJS. توقف.
2. وإلا، إذا كان يمكن تحليل التعليمات البرمجية المصدر لـ X كوحدة نمطية ECMAScript باستخدام
  <a href="esm.md#resolver-algorithm-specification">DETECT_MODULE_SYNTAX المحدد في
  محلل ESM</a>،
  أ. قم بتحميل X كوحدة نمطية ECMAScript. توقف.
3. ألقِ SyntaxError من محاولة تحليل X كـ CommonJS في 1. توقف.

LOAD_AS_FILE(X)
1. إذا كان X ملفا، فقم بتحميل X بتنسيق امتداد الملف الخاص به. توقف
2. إذا كان X.js ملفا،
    أ. ابحث عن أقرب نطاق حزمة SCOPE إلى X.
    ب. إذا لم يتم العثور على أي نطاق
      1. MAYBE_DETECT_AND_LOAD(X.js)
    ج. إذا كان SCOPE/package.json يحتوي على حقل "type"،
      1. إذا كان حقل "type" هو "module"، فقم بتحميل X.js كوحدة نمطية ECMAScript. توقف.
      2. إذا كان حقل "type" هو "commonjs"، فقم بتحميل X.js كوحدة نمطية CommonJS. توقف.
    د. MAYBE_DETECT_AND_LOAD(X.js)
3. إذا كان X.json ملفا، فقم بتحميل X.json إلى كائن JavaScript. توقف
4. إذا كان X.node ملفا، فقم بتحميل X.node كملحق ثنائي. توقف

LOAD_INDEX(X)
1. إذا كان X/index.js ملفا
    أ. ابحث عن أقرب نطاق حزمة SCOPE إلى X.
    ب. إذا لم يتم العثور على أي نطاق، فقم بتحميل X/index.js كوحدة نمطية CommonJS. توقف.
    ج. إذا كان SCOPE/package.json يحتوي على حقل "type"،
      1. إذا كان حقل "type" هو "module"، فقم بتحميل X/index.js كوحدة نمطية ECMAScript. توقف.
      2. وإلا، فقم بتحميل X/index.js كوحدة نمطية CommonJS. توقف.
2. إذا كان X/index.json ملفا، فقم بتحليل X/index.json إلى كائن JavaScript. توقف
3. إذا كان X/index.node ملفا، فقم بتحميل X/index.node كملحق ثنائي. توقف

LOAD_AS_DIRECTORY(X)
1. إذا كان X/package.json ملفا،
   أ. قم بتحليل X/package.json، وابحث عن حقل "main".
   ب. إذا كانت قيمة "main" خاطئة، فانتقل إلى 2.
   ج. ليكن M = X + (حقل json الرئيسي)
   د. LOAD_AS_FILE(M)
   ه. LOAD_INDEX(M)
   و. LOAD_INDEX(X) مهمل
   ز. ألقِ "لم يتم العثور عليه"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. ليكن DIRS = NODE_MODULES_PATHS(START)
2. لكل DIR في DIRS:
   أ. LOAD_PACKAGE_EXPORTS(X, DIR)
   ب. LOAD_AS_FILE(DIR/X)
   ج. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. ليكن PARTS = مسار split(START)
2. ليكن I = عدد PARTS - 1
3. ليكن DIRS = []
4. بينما I >= 0،
   أ. إذا كان PARTS[I] = "node_modules"، فانتقل إلى د.
   ب. ليكن DIR = مسار join(PARTS[0 .. I] + "node_modules")
   ج. ليكن DIRS = DIR + DIRS
   د. ليكن I = I - 1
5. أرجع DIRS + GLOBAL_FOLDERS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. ابحث عن أقرب نطاق حزمة SCOPE إلى DIR.
2. إذا لم يتم العثور على أي نطاق، فارجع.
3. إذا كانت "imports" في SCOPE/package.json فارغة أو غير محددة، فارجع.
4. إذا تم تمكين `--experimental-require-module`
  أ. ليكن CONDITIONS = ["node"، "require"، "module-sync"]
  ب. وإلا، ليكن CONDITIONS = ["node"، "require"]
5. ليكن MATCH = PACKAGE_IMPORTS_RESOLVE(X، pathToFileURL(SCOPE)،
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">المحدد في محلل ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. حاول تفسير X كمزيج من NAME و SUBPATH حيث قد يكون للاسم بادئة ‎@scope/‎ ويبدأ المسار الفرعي بشرطة مائلة (`/`).
2. إذا كان X لا يطابق هذا النمط أو كان DIR/NAME/package.json ليس ملفا،
   فارجع.
3. قم بتحليل DIR/NAME/package.json، وابحث عن حقل "exports".
4. إذا كانت "exports" فارغة أو غير محددة، فارجع.
5. إذا تم تمكين `--experimental-require-module`
  أ. ليكن CONDITIONS = ["node"، "require"، "module-sync"]
  ب. وإلا، ليكن CONDITIONS = ["node"، "require"]
6. ليكن MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME)، "." + SUBPATH،
   `package.json` "exports"، CONDITIONS) <a href="esm.md#resolver-algorithm-specification">المحدد في محلل ESM</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. ابحث عن أقرب نطاق حزمة SCOPE إلى DIR.
2. إذا لم يتم العثور على أي نطاق، فارجع.
3. إذا كانت "exports" في SCOPE/package.json فارغة أو غير محددة، فارجع.
4. إذا لم يكن "name" في SCOPE/package.json هو الجزء الأول من X، فارجع.
5. ليكن MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE)،
   "." + X.slice("name".length)، `package.json` "exports"، ["node"، "require"])
   <a href="esm.md#resolver-algorithm-specification">المحدد في محلل ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. ليكن RESOLVED_PATH = fileURLToPath(MATCH)
2. إذا كان الملف الموجود في RESOLVED_PATH موجودا، فقم بتحميل RESOLVED_PATH بتنسيق الامتداد الخاص به. توقف
3. ألقِ "لم يتم العثور عليه"
```

## التخزين المؤقت {#caching}

يتم تخزين الوحدات مؤقتًا بعد تحميلها للمرة الأولى. هذا يعني (من بين أشياء أخرى) أن كل استدعاء لـ `require('foo')` سيحصل على نفس الكائن تمامًا، إذا كان سيؤدي إلى نفس الملف.

بشرط عدم تعديل `require.cache`، فإن إجراء استدعاءات متعددة لـ `require('foo')` لن يؤدي إلى تنفيذ رمز الوحدة عدة مرات. هذه ميزة مهمة. بفضلها، يمكن إرجاع كائنات "منتهية جزئيًا"، مما يسمح بتحميل التبعيات المتعدية حتى عندما تتسبب في دورات.

لتنفيذ رمز الوحدة عدة مرات، قم بتصدير دالة، واستدع تلك الدالة.

### محاذير التخزين المؤقت للوحدات {#module-caching-caveats}

يتم تخزين الوحدات مؤقتًا بناءً على اسم الملف الذي تم حله. نظرًا لأن الوحدات قد تحل إلى اسم ملف مختلف بناءً على موقع الوحدة المستدعية (التحميل من مجلدات `node_modules`)، فليس هناك *ضمان* بأن `require('foo')` ستعيد دائمًا نفس الكائن تمامًا، إذا كانت ستحل إلى ملفات مختلفة.

بالإضافة إلى ذلك، في أنظمة الملفات أو أنظمة التشغيل غير الحساسة لحالة الأحرف، يمكن أن تشير أسماء الملفات التي تم حلها المختلفة إلى نفس الملف، لكن ذاكرة التخزين المؤقت ستظل تعاملها كوحدات مختلفة وستعيد تحميل الملف عدة مرات. على سبيل المثال، يعيد `require('./foo')` و `require('./FOO')` كائنين مختلفين، بغض النظر عما إذا كان `./foo` و `./FOO` هما نفس الملف أم لا.

## الوحدات المدمجة {#built-in-modules}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v16.0.0, v14.18.0 | تمت إضافة دعم استيراد `node:` إلى `require(...)`. |
:::

يحتوي Node.js على العديد من الوحدات المترجمة في الثنائي. يتم وصف هذه الوحدات بمزيد من التفصيل في مكان آخر في هذا المستند.

يتم تعريف الوحدات المضمنة داخل مصدر Node.js وتقع في مجلد `lib/`.

يمكن تحديد الوحدات المضمنة باستخدام البادئة `node:`، وفي هذه الحالة تتجاوز ذاكرة التخزين المؤقت `require`. على سبيل المثال، ستعيد `require('node:http')` دائمًا وحدة HTTP المضمنة، حتى إذا كان هناك إدخال `require.cache` بهذا الاسم.

يتم تحميل بعض الوحدات المضمنة دائمًا بشكل تفضيلي إذا تم تمرير معرفها إلى `require()`. على سبيل المثال، ستعيد `require('http')` دائمًا وحدة HTTP المضمنة، حتى إذا كان هناك ملف بهذا الاسم. يتم عرض قائمة الوحدات المضمنة التي يمكن تحميلها دون استخدام البادئة `node:` في [`module.builtinModules`](/ar/nodejs/api/module#modulebuiltinmodules)، المدرجة بدون البادئة.


### الوحدات النمطية المدمجة ذات البادئة `node:` الإلزامية {#built-in-modules-with-mandatory-node-prefix}

عند تحميلها بواسطة `require()‎`، يجب طلب بعض الوحدات النمطية المدمجة باستخدام البادئة `node:`‎. يوجد هذا الشرط لمنع الوحدات النمطية المدمجة المُدخلة حديثًا من التعارض مع حزم المستخدم التي سبق أن أخذت الاسم. حاليًا، الوحدات النمطية المدمجة التي تتطلب البادئة `node:` هي:

- [`node:sea`](/ar/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/ar/nodejs/api/sqlite)
- [`node:test`](/ar/nodejs/api/test)
- [`node:test/reporters`](/ar/nodejs/api/test#test-reporters)

يتم عرض قائمة هذه الوحدات النمطية في [`module.builtinModules`](/ar/nodejs/api/module#modulebuiltinmodules)، بما في ذلك البادئة.

## الدورات {#cycles}

عند وجود استدعاءات دائرية لـ `require()‎`، قد لا تكون الوحدة النمطية قد انتهت من التنفيذ عند إرجاعها.

ضع في اعتبارك هذا الموقف:

`a.js`:

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js`:

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js`:

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
عندما يقوم `main.js` بتحميل `a.js`، ثم يقوم `a.js` بدوره بتحميل `b.js`. في هذه المرحلة، يحاول `b.js` تحميل `a.js`. لمنع حلقة لا نهائية، يتم إرجاع **نسخة غير مكتملة** من كائن `a.js` المُصدَّر إلى الوحدة النمطية `b.js`. ثم ينتهي `b.js` من التحميل، ويتم توفير كائن `exports` الخاص به للوحدة النمطية `a.js`.

بحلول الوقت الذي يقوم فيه `main.js` بتحميل كلا الوحدتين النمطيتين، تكون كلتاهما قد انتهتا. وبالتالي، سيكون ناتج هذا البرنامج كما يلي:

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
التخطيط الدقيق مطلوب للسماح لتبعيات الوحدة النمطية الدائرية بالعمل بشكل صحيح داخل التطبيق.


## وحدات الملف {#file-modules}

إذا لم يتم العثور على اسم الملف المحدد، فسيحاول Node.js تحميل اسم الملف المطلوب مع الإضافات المضافة: `.js` و `.json` وأخيرًا `.node`. عند تحميل ملف بامتداد مختلف (على سبيل المثال `.cjs`)، يجب تمرير اسمه الكامل إلى `require()`، بما في ذلك امتداد الملف الخاص به (على سبيل المثال `require('./file.cjs')`).

يتم تحليل ملفات `.json` كملفات نص JSON، ويتم تفسير ملفات `.node` كوحدات إضافية مُجمّعة يتم تحميلها باستخدام `process.dlopen()`. يتم تحليل الملفات التي تستخدم أي امتداد آخر (أو بدون امتداد على الإطلاق) كملفات نص JavaScript. ارجع إلى قسم [تحديد نظام الوحدة النمطية](/ar/nodejs/api/packages#determining-module-system) لفهم هدف التحليل الذي سيتم استخدامه.

الوحدة النمطية المطلوبة التي تبدأ بـ `'/'` هي مسار مطلق إلى الملف. على سبيل المثال، سيؤدي `require('/home/marco/foo.js')` إلى تحميل الملف الموجود في `/home/marco/foo.js`.

الوحدة النمطية المطلوبة التي تبدأ بـ `'./'` تكون مرتبطة بالملف الذي يستدعي `require()`. وهذا يعني أن `circle.js` يجب أن يكون في نفس دليل `foo.js` حتى يتمكن `require('./circle')` من العثور عليه.

بدون `'/'` أو `'./'` أو `'../'` في البداية للإشارة إلى ملف، يجب أن تكون الوحدة النمطية إما وحدة نمطية أساسية أو يتم تحميلها من مجلد `node_modules`.

إذا كان المسار المحدد غير موجود، فسيُصدر `require()` خطأ [`MODULE_NOT_FOUND`](/ar/nodejs/api/errors#module_not_found).

## المجلدات كوحدات نمطية {#folders-as-modules}

::: info [مستقر: 3 - قديم]
[مستقر: 3](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 3](/ar/nodejs/api/documentation#stability-index) - قديم: استخدم [صادرات المسار الفرعي](/ar/nodejs/api/packages#subpath-exports) أو [عمليات استيراد المسار الفرعي](/ar/nodejs/api/packages#subpath-imports) بدلاً من ذلك.
:::

هناك ثلاث طرق يمكن من خلالها تمرير مجلد إلى `require()` كوسيطة.

الأولى هي إنشاء ملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) في جذر المجلد، والذي يحدد وحدة نمطية `main`. قد يبدو مثال ملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) كالتالي:

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
إذا كان هذا في مجلد في `./some-library`، فسيحاول `require('./some-library')` تحميل `./some-library/lib/some-library.js`.

إذا لم يكن هناك ملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) موجودًا في الدليل، أو إذا كان إدخال [`"main"`](/ar/nodejs/api/packages#main) مفقودًا أو لا يمكن حله، فسيحاول Node.js تحميل ملف `index.js` أو `index.node` من هذا الدليل. على سبيل المثال، إذا لم يكن هناك ملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) في المثال السابق، فسيحاول `require('./some-library')` تحميل:

- `./some-library/index.js`
- `./some-library/index.node`

إذا فشلت هذه المحاولات، فسيبلغ Node.js عن الوحدة النمطية بأكملها على أنها مفقودة مع الخطأ الافتراضي:

```bash [BASH]
Error: Cannot find module 'some-library'
```
في جميع الحالات الثلاث المذكورة أعلاه، ستؤدي مكالمة `import('./some-library')` إلى خطأ [`ERR_UNSUPPORTED_DIR_IMPORT`](/ar/nodejs/api/errors#err_unsupported_dir_import). يمكن أن يوفر استخدام [صادرات المسار الفرعي](/ar/nodejs/api/packages#subpath-exports) أو [عمليات استيراد المسار الفرعي](/ar/nodejs/api/packages#subpath-imports) للحزمة نفس فوائد تنظيم الاحتواء مثل المجلدات كوحدات نمطية، والعمل مع كل من `require` و `import`.


## التحميل من مجلدات `node_modules` {#loading-from-node_modules-folders}

إذا لم يكن مُعرّف الوحدة النمطية (module identifier) الذي تم تمريره إلى `require()` وحدة نمطية [مدمجة](/ar/nodejs/api/modules#built-in-modules)، ولم يبدأ بـ`'/'` أو `'../'` أو `'./'`، فسيبدأ Node.js في دليل الوحدة النمطية الحالية، ويضيف `/node_modules`، ويحاول تحميل الوحدة النمطية من هذا الموقع. لن يقوم Node.js بإلحاق `node_modules` بمسار ينتهي بالفعل بـ `node_modules`.

إذا لم يتم العثور عليه هناك، فإنه ينتقل إلى الدليل الأصل، وهكذا، حتى يتم الوصول إلى جذر نظام الملفات.

على سبيل المثال، إذا كان الملف الموجود في `'/home/ry/projects/foo.js'` يستدعي `require('bar.js')`، فسيبحث Node.js في المواقع التالية، بهذا الترتيب:

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

يسمح هذا للبرامج بتوطين تبعياتها، بحيث لا تتعارض.

من الممكن طلب ملفات أو وحدات فرعية معينة موزعة مع وحدة نمطية عن طريق تضمين لاحقة مسار بعد اسم الوحدة النمطية. على سبيل المثال، سيقوم `require('example-module/path/to/file')` بحل `path/to/file` بالنسبة إلى مكان وجود `example-module`. يتبع المسار اللاحق نفس دلالات حل الوحدة النمطية.

## التحميل من المجلدات العمومية (global folders) {#loading-from-the-global-folders}

إذا تم تعيين متغير البيئة `NODE_PATH` إلى قائمة من المسارات المطلقة مفصولة بنقطتين رأسيتين، فسيبحث Node.js في هذه المسارات عن الوحدات النمطية إذا لم يتم العثور عليها في مكان آخر.

في نظام التشغيل Windows، يتم تحديد `NODE_PATH` بفواصل منقوطة (`;`) بدلاً من النقطتين الرأسيتين.

تم إنشاء `NODE_PATH` في الأصل لدعم تحميل الوحدات النمطية من مسارات مختلفة قبل تحديد خوارزمية [حل الوحدة النمطية](/ar/nodejs/api/modules#all-together) الحالية.

لا يزال `NODE_PATH` مدعومًا، ولكنه أقل ضرورة الآن بعد أن استقر نظام Node.js البيئي على اتفاقية لتحديد موقع الوحدات النمطية التابعة. في بعض الأحيان، تُظهر عمليات النشر التي تعتمد على `NODE_PATH` سلوكًا مفاجئًا عندما يكون الأشخاص غير مدركين أنه يجب تعيين `NODE_PATH`. في بعض الأحيان تتغير تبعيات الوحدة النمطية، مما يتسبب في تحميل إصدار مختلف (أو حتى وحدة نمطية مختلفة) أثناء البحث في `NODE_PATH`.

بالإضافة إلى ذلك، سيبحث Node.js في القائمة التالية من GLOBAL_FOLDERS:

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

حيث `$HOME` هو دليل المستخدم الرئيسي، و `$PREFIX` هو `node_prefix` الذي تم تكوينه لـ Node.js.

هذه في الغالب لأسباب تاريخية.

يُنصح بشدة بوضع التبعيات في مجلد `node_modules` المحلي. سيتم تحميل هذه بشكل أسرع وأكثر موثوقية.


## غلاف الوحدة (The module wrapper) {#the-module-wrapper}

قبل تنفيذ كود الوحدة، سيقوم Node.js بلفها بغلاف دالة يشبه ما يلي:

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// الكود الفعلي للوحدة موجود هنا
});
```

من خلال القيام بذلك، يحقق Node.js بعض الأشياء:

- يحافظ على نطاق المتغيرات ذات المستوى الأعلى (المعرفة باستخدام `var` أو `const` أو `let`) محصورًا في الوحدة بدلاً من الكائن العام.
- يساعد في توفير بعض المتغيرات ذات المظهر العام والتي هي في الواقع خاصة بالوحدة، مثل:
    - الكائنين `module` و `exports` اللذين يمكن للمنفذ استخدامهما لتصدير القيم من الوحدة.
    - المتغيرين المريحين `__filename` و `__dirname`، اللذين يحتويان على اسم الملف المطلق ومسار الدليل للوحدة.

## نطاق الوحدة (The module scope) {#the-module-scope}

### `__dirname` {#__dirname}

**تمت إضافته في: الإصدار v0.1.27**

- [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم دليل الوحدة الحالية. هذا هو نفسه [`path.dirname()`](/ar/nodejs/api/path#pathdirnamepath) الخاص بـ [`__filename`](/ar/nodejs/api/modules#__filename).

مثال: تشغيل `node example.js` من `/Users/mjr`

```js [ESM]
console.log(__dirname);
// يطبع: /Users/mjr
console.log(path.dirname(__filename));
// يطبع: /Users/mjr
```

### `__filename` {#__filename}

**تمت إضافته في: الإصدار v0.0.1**

- [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم ملف الوحدة الحالية. هذا هو المسار المطلق لملف الوحدة الحالية مع حل الروابط الرمزية.

بالنسبة للبرنامج الرئيسي، ليس هذا بالضرورة هو نفسه اسم الملف المستخدم في سطر الأوامر.

راجع [`__dirname`](/ar/nodejs/api/modules#__dirname) لمعرفة اسم دليل الوحدة الحالية.

أمثلة:

تشغيل `node example.js` من `/Users/mjr`

```js [ESM]
console.log(__filename);
// يطبع: /Users/mjr/example.js
console.log(__dirname);
// يطبع: /Users/mjr
```

بالنظر إلى وحدتين: `a` و `b`، حيث `b` هي تبعية لـ `a` وهناك هيكل دليل لـ:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

ستعيد الإشارات إلى `__filename` داخل `b.js` القيمة `/Users/mjr/app/node_modules/b/b.js` بينما ستعيد الإشارات إلى `__filename` داخل `a.js` القيمة `/Users/mjr/app/a.js`.


### `exports` {#exports}

**أُضيف في: الإصدار v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

مرجع إلى `module.exports` وهو أقصر في الكتابة. انظر قسم [اختصار `exports`](/ar/nodejs/api/modules#exports-shortcut) للحصول على تفاصيل حول متى تستخدم `exports` ومتى تستخدم `module.exports`.

### `module` {#module}

**أُضيف في: الإصدار v0.1.16**

- [\<module\>](/ar/nodejs/api/modules#the-module-object)

مرجع إلى الوحدة النمطية الحالية، انظر قسم [كائن `module`](/ar/nodejs/api/modules#the-module-object). على وجه الخصوص، يتم استخدام `module.exports` لتحديد ما تصدره الوحدة النمطية وتجعله متاحًا من خلال `require()`.

### `require(id)` {#requireid}

**أُضيف في: الإصدار v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم أو مسار الوحدة النمطية
- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) محتوى الوحدة النمطية المصدرة

يستخدم لاستيراد الوحدات النمطية وملفات `JSON` والملفات المحلية. يمكن استيراد الوحدات النمطية من `node_modules`. يمكن استيراد الوحدات النمطية المحلية وملفات JSON باستخدام مسار نسبي (مثل `./`، `./foo`، `./bar/baz`، `../foo`) والذي سيتم حله مقابل الدليل المسمى بواسطة [`__dirname`](/ar/nodejs/api/modules#__dirname) (إذا تم تحديده) أو دليل العمل الحالي. يتم حل المسارات النسبية لنمط POSIX بطريقة مستقلة عن نظام التشغيل، مما يعني أن الأمثلة أعلاه ستعمل على Windows بنفس الطريقة التي ستعمل بها على أنظمة Unix.

```js [ESM]
// استيراد وحدة نمطية محلية بمسار نسبي إلى `__dirname` أو الحالي
// دليل العمل. (على Windows، سيؤدي ذلك إلى الحل إلى .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// استيراد ملف JSON:
const jsonData = require('./path/filename.json');

// استيراد وحدة نمطية من node_modules أو وحدة نمطية مدمجة في Node.js:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**أُضيف في: الإصدار v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يتم تخزين الوحدات النمطية مؤقتًا في هذا الكائن عند طلبها. عن طريق حذف قيمة مفتاح من هذا الكائن، ستقوم `require` التالية بإعادة تحميل الوحدة النمطية. هذا لا ينطبق على [الوظائف الإضافية الأصلية](/ar/nodejs/api/addons)، والتي سيؤدي إعادة تحميلها إلى حدوث خطأ.

إضافة أو استبدال الإدخالات ممكن أيضًا. يتم فحص هذا المخزن المؤقت قبل الوحدات النمطية المضمنة وإذا تمت إضافة اسم يطابق وحدة نمطية مضمنة إلى المخزن المؤقت، فستتلقى استدعاءات `node:` ذات البادئة فقط الوحدة النمطية المضمنة. استخدم بحذر!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**تمت إضافته في: v0.3.0**

**تم إهماله منذ: v0.10.6**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرشاد `require` حول كيفية التعامل مع امتدادات ملفات معينة.

معالجة الملفات ذات الامتداد `.sjs` كـ `.js`:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**مهمل.** في الماضي، تم استخدام هذه القائمة لتحميل وحدات غير JavaScript إلى Node.js عن طريق تجميعها عند الطلب. ومع ذلك، من الناحية العملية، هناك طرق أفضل بكثير للقيام بذلك، مثل تحميل الوحدات عبر برنامج Node.js آخر، أو تجميعها إلى JavaScript مسبقًا.

تجنب استخدام `require.extensions`. يمكن أن يتسبب الاستخدام في حدوث أخطاء دقيقة ويصبح حل الامتدادات أبطأ مع كل امتداد مسجل.

#### `require.main` {#requiremain}

**تمت إضافته في: v0.1.17**

- [\<module\>](/ar/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

كائن `الوحدة` الذي يمثل البرنامج النصي للإدخال الذي تم تحميله عند تشغيل عملية Node.js، أو `غير معرف` إذا لم تكن نقطة إدخال البرنامج وحدة CommonJS. راجع ["الوصول إلى الوحدة الرئيسية"](/ar/nodejs/api/modules#accessing-the-main-module).

في البرنامج النصي `entry.js`:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
الوحدة {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.9.0 | يتم الآن دعم خيار `paths`. |
| v0.3.0 | تمت إضافته في: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار الوحدة المراد حله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسارات لحل موقع الوحدة النمطية منها. إذا كان موجودًا، فسيتم استخدام هذه المسارات بدلاً من مسارات الحل الافتراضية، باستثناء [GLOBAL_FOLDERS](/ar/nodejs/api/modules#loading-from-the-global-folders) مثل `$HOME/.node_modules`، والتي يتم تضمينها دائمًا. يتم استخدام كل من هذه المسارات كنقطة انطلاق لخوارزمية حل الوحدة النمطية، مما يعني أنه يتم فحص تسلسل `node_modules` من هذا الموقع.
  
 
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

استخدم آلية `require()` الداخلية للبحث عن موقع وحدة، ولكن بدلاً من تحميل الوحدة النمطية، ما عليك سوى إرجاع اسم الملف الذي تم حله.

إذا تعذر العثور على الوحدة النمطية، يتم طرح خطأ `MODULE_NOT_FOUND`.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**أُضيف في: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): مسار الوحدة النمطية التي يتم استرجاع مسارات البحث الخاصة بها.
- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

إرجاع مصفوفة تحتوي على المسارات التي تم البحث فيها أثناء تحليل `request` أو `null` إذا كان سلسلة `request` تشير إلى وحدة نمطية أساسية، على سبيل المثال `http` أو `fs`.

## الكائن `module` {#the-module-object}

**أُضيف في: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

في كل وحدة نمطية، يكون المتغير الحر `module` مرجعًا إلى الكائن الذي يمثل الوحدة النمطية الحالية. للراحة، يمكن الوصول إلى `module.exports` أيضًا عبر `exports` العام على مستوى الوحدة النمطية. `module` ليس عامًا بالفعل ولكنه محلي لكل وحدة نمطية.

### `module.children` {#modulechildren}

**أُضيف في: v0.1.16**

- [\<module[]\>](/ar/nodejs/api/modules#the-module-object)

كائنات الوحدة النمطية المطلوبة لأول مرة بواسطة هذه الوحدة النمطية.

### `module.exports` {#moduleexports}

**أُضيف في: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يتم إنشاء الكائن `module.exports` بواسطة نظام `Module`. في بعض الأحيان يكون هذا غير مقبول؛ يرغب الكثيرون في أن تكون وحدتهم النمطية مثيلًا لفئة ما. للقيام بذلك، قم بتعيين كائن التصدير المطلوب إلى `module.exports`. سيؤدي تعيين الكائن المطلوب إلى `exports` ببساطة إلى إعادة ربط المتغير المحلي `exports`، وهو على الأرجح ليس ما هو مطلوب.

على سبيل المثال، لنفترض أننا نصنع وحدة نمطية تسمى `a.js`:

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// قم ببعض العمل، وبعد فترة من الوقت قم بإصدار
// حدث 'ready' من الوحدة النمطية نفسها.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
ثم في ملف آخر يمكننا القيام بما يلي:

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
يجب إجراء التعيين إلى `module.exports` على الفور. لا يمكن القيام بذلك في أي عمليات رد نداء. هذا لا يعمل:

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### اختصار `exports` {#exports-shortcut}

**أُضيف في: الإصدار v0.1.16**

المتغير `exports` متاح ضمن نطاق الملف الخاص بالوحدة النمطية، ويتم تعيين قيمة `module.exports` له قبل تقييم الوحدة النمطية.

يسمح هذا بوجود اختصار، بحيث يمكن كتابة `module.exports.f = ...` بشكل أكثر إيجازًا كـ `exports.f = ...`. ومع ذلك، يجب الانتباه إلى أنه مثل أي متغير، إذا تم تعيين قيمة جديدة لـ `exports`، فلن تكون مرتبطة بعد الآن بـ `module.exports`:

```js [ESM]
module.exports.hello = true; // تم التصدير من require للوحدة النمطية
exports = { hello: false };  // لم يتم التصدير، متاح فقط في الوحدة النمطية
```
عندما يتم استبدال الخاصية `module.exports` بالكامل بكائن جديد، فمن الشائع أيضًا إعادة تعيين `exports`:

```js [ESM]
module.exports = exports = function Constructor() {
  // ... إلخ.
};
```
لتوضيح السلوك، تخيل هذا التنفيذ الافتراضي لـ `require()`، وهو مشابه تمامًا لما يتم فعله بالفعل بواسطة `require()`:

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // رمز الوحدة النمطية هنا. في هذا المثال، قم بتعريف دالة.
    function someFunc() {}
    exports = someFunc;
    // في هذه المرحلة، لم يعد exports اختصارًا لـ module.exports، و
    // ستظل هذه الوحدة النمطية تصدر كائنًا افتراضيًا فارغًا.
    module.exports = someFunc;
    // في هذه المرحلة، ستصدر الوحدة النمطية الآن someFunc، بدلاً من
    // الكائن الافتراضي.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**أُضيف في: الإصدار v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم الملف الكامل الذي تم حله للوحدة النمطية.

### `module.id` {#moduleid}

**أُضيف في: الإصدار v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

معرف الوحدة النمطية. عادةً ما يكون هذا هو اسم الملف الكامل الذي تم حله.

### `module.isPreloading` {#moduleispreloading}

**أُضيف في: الإصدار v15.4.0، v14.17.0**

- النوع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كانت الوحدة النمطية قيد التشغيل أثناء مرحلة التحميل المسبق لـ Node.js.


### `module.loaded` {#moduleloaded}

**تمت الإضافة في: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ما إذا كانت الوحدة قد انتهت من التحميل أم لا، أو أنها قيد عملية التحميل.

### `module.parent` {#moduleparent}

**تمت الإضافة في: v0.1.16**

**تم الإلغاء منذ: v14.6.0, v12.19.0**

::: danger [مستقر: 0 - تم الإلغاء]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - تم الإلغاء: يرجى استخدام [`require.main`](/ar/nodejs/api/modules#requiremain) و [`module.children`](/ar/nodejs/api/modules#modulechildren) بدلاً من ذلك.
:::

- [\<module\>](/ar/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

الوحدة التي طلبت هذه الوحدة أولاً، أو `null` إذا كانت الوحدة الحالية هي نقطة الدخول للعملية الحالية، أو `undefined` إذا تم تحميل الوحدة بواسطة شيء ليس وحدة CommonJS (مثل: REPL أو `import`).

### `module.path` {#modulepath}

**تمت الإضافة في: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

اسم دليل الوحدة. عادة ما يكون هذا هو نفسه [`path.dirname()`](/ar/nodejs/api/path#pathdirnamepath) الخاص بـ [`module.id`](/ar/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**تمت الإضافة في: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مسارات البحث عن الوحدة.

### `module.require(id)` {#modulerequireid}

**تمت الإضافة في: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) محتوى الوحدة النمطية المصدرة

توفر الطريقة `module.require()` طريقة لتحميل وحدة كما لو تم استدعاء `require()` من الوحدة الأصلية.

للقيام بذلك، من الضروري الحصول على مرجع للكائن `module`. نظرًا لأن `require()` تُرجع `module.exports`، وعادةً ما يكون `module` متاحًا *فقط* داخل كود وحدة نمطية معينة، فيجب تصديره بشكل صريح لاستخدامه.


## كائن `الوحدة النمطية` {#the-module-object_1}

تم نقل هذا القسم إلى [الوحدات النمطية: الوحدة النمطية الأساسية `module`](/ar/nodejs/api/module#the-module-object).

- [`module.builtinModules`](/ar/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/ar/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/ar/nodejs/api/module#modulesyncbuiltinesmexports)

## دعم الخريطة المصدرية الإصدار 3 {#source-map-v3-support}

تم نقل هذا القسم إلى [الوحدات النمطية: الوحدة النمطية الأساسية `module`](/ar/nodejs/api/module#source-map-v3-support).

- [`module.findSourceMap(path)`](/ar/nodejs/api/module#modulefindsourcemappath)
- [فئة: `module.SourceMap`](/ar/nodejs/api/module#class-modulesourcemap)
    - [`new SourceMap(payload)`](/ar/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/ar/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/ar/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

