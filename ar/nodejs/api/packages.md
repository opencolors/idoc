---
title: توثيق حزم Node.js
description: استكشف التوثيق الرسمي لـ Node.js حول الحزم، بما في ذلك كيفية إدارة الحزم وإنشائها ونشرها، مع تفاصيل حول package.json، والتبعيات، وأدوات إدارة الحزم.
head:
  - - meta
    - name: og:title
      content: توثيق حزم Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: استكشف التوثيق الرسمي لـ Node.js حول الحزم، بما في ذلك كيفية إدارة الحزم وإنشائها ونشرها، مع تفاصيل حول package.json، والتبعيات، وأدوات إدارة الحزم.
  - - meta
    - name: twitter:title
      content: توثيق حزم Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: استكشف التوثيق الرسمي لـ Node.js حول الحزم، بما في ذلك كيفية إدارة الحزم وإنشائها ونشرها، مع تفاصيل حول package.json، والتبعيات، وأدوات إدارة الحزم.
---


# الوحدات: الحزم {#modules-packages}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v14.13.0, v12.20.0 | إضافة دعم لأنماط `"exports"`. |
| v14.6.0, v12.19.0 | إضافة حقل `"imports"` للحزمة. |
| v13.7.0, v12.17.0 | إلغاء وضع علامة على عمليات التصدير الشرطية. |
| v13.7.0, v12.16.0 | إزالة خيار `--experimental-conditional-exports`. في الإصدار 12.16.0، لا تزال عمليات التصدير الشرطية خلف علامة `--experimental-modules`. |
| v13.6.0, v12.16.0 | إلغاء وضع علامة على الإشارة الذاتية إلى حزمة باستخدام اسمها. |
| v12.7.0 | تقديم حقل `"exports"` في `package.json` كبديل أقوى للحقل الكلاسيكي `"main"`. |
| v12.0.0 | إضافة دعم لوحدات ES باستخدام امتداد الملف `.js` عبر حقل `"type"` في `package.json`. |
:::

## مقدمة {#introduction}

الحزمة عبارة عن شجرة مجلدات موصوفة بواسطة ملف `package.json`. تتكون الحزمة من المجلد الذي يحتوي على ملف `package.json` وجميع المجلدات الفرعية حتى المجلد التالي الذي يحتوي على ملف `package.json` آخر، أو مجلد باسم `node_modules`.

توفر هذه الصفحة إرشادات لمؤلفي الحزم الذين يكتبون ملفات `package.json` بالإضافة إلى مرجع لحقول [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) التي تحددها Node.js.

## تحديد نظام الوحدات {#determining-module-system}

### مقدمة {#introduction_1}

ستتعامل Node.js مع ما يلي كوحدات [ES](/ar/nodejs/api/esm) عند تمريرها إلى `node` كمدخل أولي، أو عند الإشارة إليها بواسطة عبارات `import` أو تعبيرات `import()`:

- الملفات ذات الامتداد `.mjs`.
- الملفات ذات الامتداد `.js` عندما يحتوي أقرب ملف `package.json` أصلي على حقل [`"type"`](/ar/nodejs/api/packages#type) ذي مستوى أعلى بقيمة `"module"`.
- السلاسل التي يتم تمريرها كوسيطة إلى `--eval`، أو يتم تمريرها إلى `node` عبر `STDIN`، مع العلامة `--input-type=module`.
- الكود الذي يحتوي على بناء جملة يتم تحليله بنجاح فقط كوحدات [ES](/ar/nodejs/api/esm)، مثل عبارات `import` أو `export` أو `import.meta`، بدون علامة صريحة لكيفية تفسيرها. العلامات الصريحة هي امتدادات `.mjs` أو `.cjs`، وحقول `"type"` في `package.json` بقيم `"module"` أو `"commonjs"`، أو العلامة `--input-type`. يتم دعم تعبيرات `import()` الديناميكية في وحدات CommonJS أو ES ولن تجبر ملفًا على أن يتم التعامل معه كوحدة ES. انظر [اكتشاف بناء الجملة](/ar/nodejs/api/packages#syntax-detection).

ستتعامل Node.js مع ما يلي كوحدات [CommonJS](/ar/nodejs/api/modules) عند تمريرها إلى `node` كمدخل أولي، أو عند الإشارة إليها بواسطة عبارات `import` أو تعبيرات `import()`:

- الملفات ذات الامتداد `.cjs`.
- الملفات ذات الامتداد `.js` عندما يحتوي أقرب ملف `package.json` أصلي على حقل [`"type"`](/ar/nodejs/api/packages#type) ذي مستوى أعلى بقيمة `"commonjs"`.
- السلاسل التي يتم تمريرها كوسيطة إلى `--eval` أو `--print`، أو يتم تمريرها إلى `node` عبر `STDIN`، مع العلامة `--input-type=commonjs`.
- الملفات ذات الامتداد `.js` بدون ملف `package.json` أصلي أو حيث يفتقر أقرب ملف `package.json` أصلي إلى حقل `type`، وحيث يمكن تقييم الكود بنجاح كوحدة CommonJS. بمعنى آخر، تحاول Node.js تشغيل هذه الملفات "الغامضة" كوحدة CommonJS أولاً، وستعيد محاولة تقييمها كوحدات ES إذا فشل التقييم كوحدة CommonJS لأن المحلل اللغوي وجد بناء جملة وحدة ES.

يتحمل كتابة بناء جملة وحدة ES في الملفات "الغامضة" تكلفة أداء، وبالتالي يتم تشجيع المؤلفين على أن يكونوا صريحين قدر الإمكان. على وجه الخصوص، يجب على مؤلفي الحزم دائمًا تضمين حقل [`"type"`](/ar/nodejs/api/packages#type) في ملفات `package.json` الخاصة بهم، حتى في الحزم التي تكون فيها جميع المصادر عبارة عن وحدات CommonJS. إن كونك صريحًا بشأن نوع الحزمة سيؤدي إلى حماية الحزمة في المستقبل في حالة تغير النوع الافتراضي لـ Node.js، وسيسهل أيضًا على أدوات البناء ومحملات تحديد كيفية تفسير الملفات الموجودة في الحزمة.


### كشف البنية {#syntax-detection}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| الإصدار 22.7.0 | تم تمكين كشف البنية افتراضيًا. |
| الإصداران 21.1.0 و 20.10.0 | تمت إضافته في: الإصدار 21.1.0، الإصدار 20.10.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح الإصدار
:::

سوف يقوم Node.js بفحص كود المصدر للإدخال الغامض لتحديد ما إذا كان يحتوي على بنية وحدة ES؛ إذا تم الكشف عن هذه البنية، فسوف يتم التعامل مع الإدخال كوحدة ES.

يتم تعريف الإدخال الغامض على النحو التالي:

- الملفات ذات الامتداد `.js` أو بدون امتداد؛ وإما عدم وجود ملف `package.json` متحكم أو ملف يفتقر إلى حقل `type`.
- إدخال السلسلة (`--eval` أو `STDIN`) عندما لا يتم تحديد `--input-type`.

يتم تعريف بنية وحدة ES على أنها بنية ستطرح خطأ عند تقييمها كوحدة CommonJS. وهذا يشمل ما يلي:

- عبارات `import` (ولكن *ليس* تعبيرات `import()`، وهي صالحة في CommonJS).
- عبارات `export`.
- مراجع `import.meta`.
- `await` في المستوى الأعلى من الوحدة النمطية.
- إعادة التصريحات المعجمية لمتغيرات برنامج تضمين CommonJS (`require`، `module`، `exports`، `__dirname`، `__filename`).

### مُحمّلات الوحدات {#modules-loaders}

لدى Node.js نظامان لحل المحدد وتحميل الوحدات.

هناك مُحمّل وحدة CommonJS:

- إنه متزامن تمامًا.
- إنه مسؤول عن معالجة استدعاءات `require()`.
- يمكن إجراء تعديلات عليه (monkey patchable).
- إنه يدعم [المجلدات كوحدات](/ar/nodejs/api/modules#folders-as-modules).
- عند حل المحدد، إذا لم يتم العثور على تطابق تام، فسيحاول إضافة امتدادات (`.js` و `.json` وأخيرًا `.node`) ثم يحاول حل [المجلدات كوحدات](/ar/nodejs/api/modules#folders-as-modules).
- إنه يعامل `.json` كملفات نص JSON.
- يتم تفسير ملفات `.node` على أنها وحدات إضافية مُجمّعة يتم تحميلها باستخدام `process.dlopen()`.
- إنه يعامل جميع الملفات التي تفتقر إلى امتدادات `.json` أو `.node` كملفات نص JavaScript.
- لا يمكن استخدامه إلا [لتحميل وحدات ECMAScript من وحدات CommonJS](/ar/nodejs/api/modules#loading-ecmascript-modules-using-require) إذا كان مخطط الوحدة متزامنًا (أي لا يحتوي على `await` على المستوى الأعلى). عند استخدامه لتحميل ملف نص JavaScript ليس وحدة ECMAScript، فسيتم تحميل الملف كوحدة CommonJS.

هناك مُحمّل وحدة ECMAScript:

- إنه غير متزامن، إلا إذا كان يستخدم لتحميل الوحدات لـ `require()`.
- إنه مسؤول عن معالجة عبارات `import` وتعبيرات `import()`.
- لا يمكن إجراء تعديلات عليه، ويمكن تخصيصه باستخدام [خطافات التحميل](/ar/nodejs/api/esm#loaders).
- إنه لا يدعم المجلدات كوحدات، يجب تحديد فهارس الدليل (مثل `'./startup/index.js'`) بالكامل.
- إنه لا يقوم بالبحث عن الامتدادات. يجب توفير امتداد الملف عندما يكون المحدد عبارة عن عنوان URL للملف النسبي أو المطلق.
- يمكنه تحميل وحدات JSON، ولكن يلزم وجود سمة نوع الاستيراد.
- إنه يقبل فقط امتدادات `.js` و `.mjs` و `.cjs` لملفات نص JavaScript.
- يمكن استخدامه لتحميل وحدات JavaScript CommonJS. يتم تمرير هذه الوحدات من خلال `cjs-module-lexer` لمحاولة تحديد الصادرات المسماة، والتي تكون متاحة إذا كان من الممكن تحديدها من خلال التحليل الثابت. يتم تحويل عناوين URL الخاصة بوحدات CommonJS المستوردة إلى مسارات مطلقة ثم يتم تحميلها عبر مُحمّل وحدة CommonJS.


### ‏`package.json` وامتدادات الملفات {#packagejson-and-file-extensions}

داخل الحزمة، يحدد حقل [`"type"`](/ar/nodejs/api/packages#type) في [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) الطريقة التي يجب أن تفسر بها Node.js ملفات `.js`. إذا لم يكن لملف `package.json` حقل `"type"`، فسيتم التعامل مع ملفات `.js` على أنها [CommonJS](/ar/nodejs/api/modules).

تشير قيمة `"type"` في `package.json` التي تساوي `"module"` إلى Node.js لتفسير ملفات `.js` داخل تلك الحزمة على أنها تستخدم صيغة [وحدة ES](/ar/nodejs/api/esm).

ينطبق الحقل `"type"` ليس فقط على نقاط الدخول الأولية (`node my-app.js`) ولكن أيضًا على الملفات المشار إليها بواسطة عبارات `import` وتعبيرات `import()`.

```js [ESM]
// my-app.js، يتم التعامل معه كوحدة ES لأن هناك ملف package.json
// في نفس المجلد مع "type": "module".

import './startup/init.js';
// تم التحميل كوحدة ES نظرًا لأن ./startup لا يحتوي على ملف package.json،
// وبالتالي يرث قيمة "type" من مستوى أعلى.

import 'commonjs-package';
// تم التحميل كـ CommonJS نظرًا لأن ./node_modules/commonjs-package/package.json
// يفتقر إلى حقل "type" أو يحتوي على "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// تم التحميل كـ CommonJS نظرًا لأن ./node_modules/commonjs-package/package.json
// يفتقر إلى حقل "type" أو يحتوي على "type": "commonjs".
```
يتم دائمًا تحميل الملفات التي تنتهي بـ `.mjs` كوحدات [ES](/ar/nodejs/api/esm) بغض النظر عن أقرب `package.json` أصل.

يتم دائمًا تحميل الملفات التي تنتهي بـ `.cjs` كـ [CommonJS](/ar/nodejs/api/modules) بغض النظر عن أقرب `package.json` أصل.

```js [ESM]
import './legacy-file.cjs';
// تم التحميل كـ CommonJS نظرًا لأنه يتم دائمًا تحميل .cjs كـ CommonJS.

import 'commonjs-package/src/index.mjs';
// تم التحميل كوحدة ES نظرًا لأنه يتم دائمًا تحميل .mjs كوحدة ES.
```
يمكن استخدام امتدادات `.mjs` و `.cjs` لخلط الأنواع داخل نفس الحزمة:

-  داخل حزمة `"type": "module"`، يمكن توجيه Node.js لتفسير ملف معين على أنه [CommonJS](/ar/nodejs/api/modules) عن طريق تسميته بامتداد `.cjs` (نظرًا لأنه يتم التعامل مع كل من ملفات `.js` و `.mjs` كوحدات ES داخل حزمة `"module"`).
-  داخل حزمة `"type": "commonjs"`، يمكن توجيه Node.js لتفسير ملف معين على أنه [وحدة ES](/ar/nodejs/api/esm) عن طريق تسميته بامتداد `.mjs` (نظرًا لأنه يتم التعامل مع كل من ملفات `.js` و `.cjs` على أنها CommonJS داخل حزمة `"commonjs"`).


### `علم --input-type` {#--input-type-flag}

**أُضيف في: الإصدار 12.0.0**

تُعامل السلاسل النصية التي يتم تمريرها كوسيطة إلى `علم --eval` (أو `-e`)، أو التي يتم تمريرها عبر الأنابيب إلى `node` عبر `STDIN`، كوحدات [ES modules](/ar/nodejs/api/esm) عند تعيين `علم --input-type=module`.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
لإكمال الصورة، يوجد أيضًا `علم --input-type=commonjs`، لتشغيل الإدخال كسلسلة نصية كوحدة CommonJS بشكل صريح. هذا هو السلوك الافتراضي إذا لم يتم تحديد `علم --input-type`.

## تحديد مدير الحزم {#determining-package-manager}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

بينما يُتوقع أن تكون جميع مشاريع Node.js قابلة للتثبيت بواسطة جميع مديري الحزم بمجرد نشرها، غالبًا ما يُطلب من فرق التطوير الخاصة بهم استخدام مدير حزم معين. لتسهيل هذه العملية، تأتي Node.js مع أداة تسمى [Corepack](/ar/nodejs/api/corepack) تهدف إلى جعل جميع مديري الحزم متاحين بشفافية في بيئتك - بشرط أن يكون لديك Node.js مثبتًا.

افتراضيًا، لن يفرض Corepack أي مدير حزم معين وسيستخدم الإصدارات العامة "الأخيرة الجيدة المعروفة" المرتبطة بكل إصدار من Node.js، ولكن يمكنك تحسين هذه التجربة عن طريق تعيين حقل [`"packageManager"`](/ar/nodejs/api/packages#packagemanager) في `package.json` الخاص بمشروعك.

## نقاط دخول الحزمة {#package-entry-points}

في ملف `package.json` الخاص بالحزمة، يمكن لحقلين تحديد نقاط دخول للحزمة: [`"main"`](/ar/nodejs/api/packages#main) و [`"exports"`](/ar/nodejs/api/packages#exports). ينطبق كلا الحقلين على نقاط دخول وحدة ES ووحدة CommonJS.

الحقل [`"main"`](/ar/nodejs/api/packages#main) مدعوم في جميع إصدارات Node.js، لكن قدراته محدودة: فهو يحدد فقط نقطة الدخول الرئيسية للحزمة.

يوفر [`"exports"`](/ar/nodejs/api/packages#exports) بديلاً حديثًا لـ [`"main"`](/ar/nodejs/api/packages#main) مما يسمح بتحديد نقاط دخول متعددة، ودعم دقة الدخول الشرطية بين البيئات، و **منع أي نقاط دخول أخرى بخلاف تلك المحددة في <a href="#exports"><code>"exports"</code></a>**. يسمح هذا التغليف لمؤلفي الوحدات النمطية بتحديد الواجهة العامة لحزمتهم بوضوح.

بالنسبة للحزم الجديدة التي تستهدف الإصدارات المدعومة حاليًا من Node.js، يوصى باستخدام الحقل [`"exports"`](/ar/nodejs/api/packages#exports). بالنسبة للحزم التي تدعم Node.js 10 والإصدارات الأقدم، يلزم وجود الحقل [`"main"`](/ar/nodejs/api/packages#main). إذا تم تحديد كل من [`"exports"`](/ar/nodejs/api/packages#exports) و [`"main"`](/ar/nodejs/api/packages#main)، فإن الحقل [`"exports"`](/ar/nodejs/api/packages#exports) له الأسبقية على [`"main"`](/ar/nodejs/api/packages#main) في الإصدارات المدعومة من Node.js.

يمكن استخدام [عمليات التصدير الشرطية](/ar/nodejs/api/packages#conditional-exports) داخل [`"exports"`](/ar/nodejs/api/packages#exports) لتحديد نقاط دخول حزمة مختلفة لكل بيئة، بما في ذلك ما إذا كانت الحزمة مشار إليها عبر `require` أو عبر `import`. لمزيد من المعلومات حول دعم كل من وحدات CommonJS ووحدات ES في حزمة واحدة، يرجى الرجوع إلى [قسم حزم CommonJS/ES المزدوجة](/ar/nodejs/api/packages#dual-commonjses-module-packages).

ستمنع الحزم الحالية التي تقدم الحقل [`"exports"`](/ar/nodejs/api/packages#exports) مستهلكي الحزمة من استخدام أي نقاط دخول غير محددة، بما في ذلك [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) (على سبيل المثال `require('your-package/package.json')`). **من المحتمل أن يكون هذا تغييرًا جذريًا.**

لجعل تقديم [`"exports"`](/ar/nodejs/api/packages#exports) غير جذري، تأكد من تصدير كل نقطة دخول مدعومة سابقًا. من الأفضل تحديد نقاط الدخول بشكل صريح بحيث تكون واجهة برمجة التطبيقات العامة للحزمة محددة جيدًا. على سبيل المثال، يمكن للمشروع الذي قام سابقًا بتصدير `main` و `lib` و `feature` و `package.json` استخدام `package.exports` التالي:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
بدلاً من ذلك، يمكن للمشروع اختيار تصدير مجلدات كاملة مع مسارات فرعية موسعة وبدونها باستخدام أنماط التصدير:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
مع توفير التوافق مع الإصدارات السابقة لأي إصدارات حزمة ثانوية أعلاه، يمكن لتغيير رئيسي مستقبلي للحزمة بعد ذلك تقييد عمليات التصدير بشكل صحيح على عمليات تصدير الميزات المحددة المعروضة فقط:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### نقطة تصدير الإدخال الرئيسية {#main-entry-point-export}

عند كتابة حزمة جديدة، يُوصى باستخدام حقل [`"exports"`](/ar/nodejs/api/packages#exports):

```json [JSON]
{
  "exports": "./index.js"
}
```
عند تحديد حقل [`"exports"`](/ar/nodejs/api/packages#exports)، يتم تغليف جميع المسارات الفرعية للحزمة ولم تعد متاحة للمستوردين. على سبيل المثال، `require('pkg/subpath.js')` يطرح خطأ [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/ar/nodejs/api/errors#err-package-path-not-exported).

يوفر هذا التغليف للتصديرات ضمانات أكثر موثوقية حول واجهات الحزمة للأدوات وعند التعامل مع ترقيات semver للحزمة. إنه ليس تغليفًا قويًا نظرًا لأن طلبًا مباشرًا لأي مسار فرعي مطلق للحزمة مثل `require('/path/to/node_modules/pkg/subpath.js')` سيظل يقوم بتحميل `subpath.js`.

تدعم جميع الإصدارات المدعومة حاليًا من Node.js وأدوات الإنشاء الحديثة حقل `"exports"`. بالنسبة للمشاريع التي تستخدم إصدارًا أقدم من Node.js أو أداة إنشاء ذات صلة، يمكن تحقيق التوافق عن طريق تضمين حقل `"main"` بجانب `"exports"` يشير إلى نفس الوحدة النمطية:

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### تصدير المسارات الفرعية {#subpath-exports}

**تمت الإضافة في: v12.7.0**

عند استخدام حقل [`"exports"`](/ar/nodejs/api/packages#exports)، يمكن تحديد المسارات الفرعية المخصصة جنبًا إلى جنب مع نقطة الإدخال الرئيسية عن طريق التعامل مع نقطة الإدخال الرئيسية على أنها المسار الفرعي `"."`:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
الآن يمكن للمستهلك استيراد المسار الفرعي المحدد فقط في [`"exports"`](/ar/nodejs/api/packages#exports):

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// Loads ./node_modules/es-module-package/src/submodule.js
```
بينما المسارات الفرعية الأخرى ستؤدي إلى حدوث خطأ:

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// Throws ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### الامتدادات في المسارات الفرعية {#extensions-in-subpaths}

يجب على مؤلفي الحزمة توفير مسارات فرعية ذات امتداد (`import 'pkg/subpath.js'`) أو بدون امتداد (`import 'pkg/subpath'`) في صادراتهم. يضمن هذا وجود مسار فرعي واحد فقط لكل وحدة نمطية مُصدَّرة بحيث يستورد جميع التابعين نفس المحدد المتسق، مما يحافظ على وضوح عقد الحزمة للمستهلكين وتبسيط إكمال المسار الفرعي للحزمة.

تقليديًا، كانت الحزم تميل إلى استخدام النمط بدون امتداد، والذي يتميز بفوائد قابلية القراءة وإخفاء المسار الحقيقي للملف داخل الحزمة.

مع [خرائط الاستيراد](https://github.com/WICG/import-maps) التي توفر الآن معيارًا لحل الحزمة في المتصفحات ووقت تشغيل JavaScript الآخر، يمكن أن يؤدي استخدام النمط بدون امتداد إلى تعريفات خريطة استيراد منتفخة. يمكن لملحقات الملفات الصريحة تجنب هذه المشكلة من خلال تمكين خريطة الاستيراد من استخدام [تعيين مجلدات الحزم](https://github.com/WICG/import-maps#packages-via-trailing-slashes) لتعيين مسارات فرعية متعددة حيثما أمكن بدلاً من إدخال خريطة منفصل لكل تصدير مسار فرعي للحزمة. يعكس هذا أيضًا شرط استخدام [مسار المحدد الكامل](/ar/nodejs/api/esm#mandatory-file-extensions) في محددات الاستيراد النسبية والمطلقة.


### اختصارات التصدير {#exports-sugar}

**تمت الإضافة في: الإصدار 12.11.0**

إذا كان تصدير `"."` هو التصدير الوحيد، فإن حقل [`"exports"`](/ar/nodejs/api/packages#exports) يوفر اختصارًا لهذه الحالة بحيث يكون قيمة حقل [`"exports"`](/ar/nodejs/api/packages#exports) المباشرة.

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
يمكن كتابته:

```json [JSON]
{
  "exports": "./index.js"
}
```
### استيرادات المسار الفرعي {#subpath-imports}

**تمت الإضافة في: الإصدار 14.6.0، الإصدار 12.19.0**

بالإضافة إلى حقل [`"exports"`](/ar/nodejs/api/packages#exports)، يوجد حقل `"imports"` للحزمة لإنشاء تعيينات خاصة تنطبق فقط على مُعرّفات الاستيراد من داخل الحزمة نفسها.

يجب أن تبدأ الإدخالات في حقل `"imports"` دائمًا بـ `#` للتأكد من تمييزها عن مُعرّفات الحزمة الخارجية.

على سبيل المثال، يمكن استخدام حقل الاستيراد للحصول على فوائد التصدير المشروط للوحدات النمطية الداخلية:

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
حيث لا يحصل `import '#dep'` على حل الحزمة الخارجية `dep-node-native` (بما في ذلك الصادرات الخاصة بها بدورها)، وبدلاً من ذلك يحصل على الملف المحلي `./dep-polyfill.js` بالنسبة للحزمة في البيئات الأخرى.

على عكس حقل `"exports"`، يسمح حقل `"imports"` بالتعيين إلى حزم خارجية.

قواعد الحل لحقل الاستيراد مماثلة بخلاف ذلك لحقل التصدير.

### أنماط المسار الفرعي {#subpath-patterns}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 16.10.0، الإصدار 14.19.0 | دعم الملحقات النمطية في حقل "imports". |
| الإصدار 16.9.0، الإصدار 14.19.0 | دعم الملحقات النمطية. |
| الإصدار 14.13.0، الإصدار 12.20.0 | تمت الإضافة في: الإصدار 14.13.0، الإصدار 12.20.0 |
:::

بالنسبة للحزم التي تحتوي على عدد قليل من الصادرات أو الواردات، نوصي بسرد كل إدخال مسار فرعي للصادرات بشكل صريح. ولكن بالنسبة للحزم التي تحتوي على أعداد كبيرة من المسارات الفرعية، قد يتسبب ذلك في تضخم `package.json` ومشاكل الصيانة.

بالنسبة لحالات الاستخدام هذه، يمكن استخدام أنماط تصدير المسار الفرعي بدلاً من ذلك:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**تعرض <code>*</code> الخرائط المسارات الفرعية المتداخلة لأنها مجرد بناء جملة لاستبدال السلاسل
فقط.**

سيتم بعد ذلك استبدال جميع مثيلات `*` على الجانب الأيمن بهذه القيمة، بما في ذلك إذا كانت تحتوي على أي فواصل `/`.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// يتم تحميل ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// يتم تحميل ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// يتم تحميل ./node_modules/es-module-package/src/internal/z.js
```
هذا تطابق واستبدال ثابت مباشر بدون أي معالجة خاصة لامتدادات الملفات. إن تضمين `"*.js"` على كلا جانبي التعيين يقيد صادرات الحزمة المكشوفة بملفات JS فقط.

يتم الحفاظ على خاصية الصادرات القابلة للتعداد بشكل ثابت مع أنماط الصادرات حيث يمكن تحديد الصادرات الفردية لحزمة ما عن طريق التعامل مع النمط الهدف للجانب الأيمن باعتباره `**` glob مقابل قائمة الملفات الموجودة داخل الحزمة. نظرًا لأن مسارات `node_modules` محظورة في أهداف التصدير، فإن هذا التوسع يعتمد فقط على ملفات الحزمة نفسها.

لاستبعاد المجلدات الفرعية الخاصة من الأنماط، يمكن استخدام أهداف `null`:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// يطرح: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// يتم تحميل ./node_modules/es-module-package/src/features/x.js
```

### الصادرات الشرطية {#conditional-exports}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v13.7.0، v12.16.0 | إلغاء علامة الصادرات الشرطية. |
| v13.2.0، v12.16.0 | تمت إضافتها في: v13.2.0، v12.16.0 |
:::

توفر الصادرات الشرطية طريقة للربط بمسارات مختلفة بناءً على شروط معينة. وهي مدعومة لكل من استيراد CommonJS ووحدات ES النمطية.

على سبيل المثال، يمكن كتابة حزمة ترغب في توفير تصديرات وحدات ES نمطية مختلفة لـ `require()` و `import`:

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
تطبق Node.js الشروط التالية، المدرجة بترتيب من الأكثر تحديدًا إلى الأقل تحديدًا كما يجب تعريف الشروط:

- `"node-addons"` - مشابهة لـ `"node"` وتطابق أي بيئة Node.js. يمكن استخدام هذا الشرط لتوفير نقطة دخول تستخدم إضافات C++ الأصلية بدلاً من نقطة دخول أكثر عالمية ولا تعتمد على الإضافات الأصلية. يمكن تعطيل هذا الشرط عبر علامة [`--no-addons`](/ar/nodejs/api/cli#--no-addons).
- `"node"` - تطابق أي بيئة Node.js. يمكن أن تكون ملف CommonJS أو وحدة ES نمطية. *في معظم الحالات، لا تكون الإشارة صراحةً إلى منصة Node.js ضرورية.*
- `"import"` - تطابق عندما يتم تحميل الحزمة عبر `import` أو `import()`، أو عبر أي عملية استيراد أو تحليل ذات مستوى أعلى بواسطة محمل وحدة ECMAScript النمطية. تنطبق بغض النظر عن تنسيق الوحدة النمطية للملف الهدف. *دائمًا ما تكون حصرية بشكل متبادل مع <code>"require"</code>.*
- `"require"` - تطابق عندما يتم تحميل الحزمة عبر `require()`. يجب أن يكون الملف المشار إليه قابلاً للتحميل باستخدام `require()` على الرغم من أن الشرط يطابق بغض النظر عن تنسيق الوحدة النمطية للملف الهدف. تتضمن التنسيقات المتوقعة CommonJS و JSON والإضافات الأصلية ووحدات ES النمطية. *دائمًا ما تكون حصرية بشكل متبادل مع <code>"import"</code>.*
- `"module-sync"` - تطابق بغض النظر عما إذا تم تحميل الحزمة عبر `import` أو `import()` أو `require()`. من المتوقع أن يكون التنسيق هو وحدات ES النمطية التي لا تحتوي على انتظار ذي مستوى أعلى في رسمها البياني للوحدة النمطية - إذا كان الأمر كذلك، فسيتم طرح `ERR_REQUIRE_ASYNC_MODULE` عند طلب الوحدة النمطية باستخدام `require()`.
- `"default"` - الاحتياطي العام الذي يطابق دائمًا. يمكن أن يكون ملف CommonJS أو وحدة ES نمطية. *يجب أن يأتي هذا الشرط دائمًا في النهاية.*

داخل كائن [`"exports"`](/ar/nodejs/api/packages#exports)، يكون ترتيب المفاتيح مهمًا. أثناء مطابقة الشروط، تتمتع الإدخالات السابقة بأولوية أعلى ولها الأسبقية على الإدخالات اللاحقة. *القاعدة العامة هي أن الشروط يجب أن تكون من الأكثر تحديدًا إلى الأقل تحديدًا في ترتيب الكائن*.

يمكن أن يؤدي استخدام الشروط `"import"` و `"require"` إلى بعض المخاطر، والتي تم شرحها بالتفصيل في [قسم حزم CommonJS/ES النمطية المزدوجة](/ar/nodejs/api/packages#dual-commonjses-module-packages).

يمكن استخدام الشرط `"node-addons"` لتوفير نقطة دخول تستخدم إضافات C++ الأصلية. ومع ذلك، يمكن تعطيل هذا الشرط عبر علامة [`--no-addons`](/ar/nodejs/api/cli#--no-addons). عند استخدام `"node-addons"`، يوصى بمعاملة `"default"` كتحسين يوفر نقطة دخول أكثر عالمية، على سبيل المثال، استخدام WebAssembly بدلاً من إضافة أصلية.

يمكن أيضًا تمديد الصادرات الشرطية إلى مسارات فرعية للتصدير، على سبيل المثال:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
يعرف حزمة حيث يمكن أن توفر `require('pkg/feature.js')` و `import 'pkg/feature.js'` تطبيقات مختلفة بين Node.js وبيئات JS الأخرى.

عند استخدام فروع البيئة، قم دائمًا بتضمين شرط `"default"` حيثما أمكن ذلك. يضمن توفير شرط `"default"` أن أي بيئات JS غير معروفة قادرة على استخدام هذا التنفيذ العالمي، مما يساعد على تجنب اضطرار بيئات JS هذه إلى التظاهر بأنها بيئات موجودة لدعم الحزم ذات الصادرات الشرطية. لهذا السبب، يفضل عادةً استخدام فروع الشروط `"node"` و `"default"` على استخدام فروع الشروط `"node"` و `"browser"`.


### الشروط المتداخلة {#nested-conditions}

بالإضافة إلى التعيينات المباشرة، تدعم Node.js أيضًا كائنات الشروط المتداخلة.

على سبيل المثال، لتعريف حزمة تحتوي فقط على نقاط دخول ذات وضع مزدوج للاستخدام في Node.js ولكن ليس المتصفح:

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```
تستمر مطابقة الشروط بالترتيب كما هو الحال مع الشروط المسطحة. إذا لم يكن للشرط المتداخل أي تعيين، فسيستمر في التحقق من الشروط المتبقية للشرط الأصل. بهذه الطريقة، تتصرف الشروط المتداخلة بشكل مماثل لعبارات `if` JavaScript المتداخلة.

### حل شروط المستخدم {#resolving-user-conditions}

**أُضيف في: v14.9.0, v12.19.0**

عند تشغيل Node.js، يمكن إضافة شروط مستخدم مخصصة باستخدام علامة `--conditions`:

```bash [BASH]
node --conditions=development index.js
```
والتي ستحل بعد ذلك الشرط `"development"` في عمليات استيراد وتصدير الحزمة، مع حل الشروط الموجودة `"node"` و `"node-addons"` و `"default"` و `"import"` و `"require"` حسب الاقتضاء.

يمكن تعيين أي عدد من الشروط المخصصة باستخدام علامات متكررة.

يجب أن تحتوي الشروط النموذجية على أحرف أبجدية رقمية فقط، باستخدام ":" أو "-" أو "=" كفواصل إذا لزم الأمر. أي شيء آخر قد يواجه مشاكل توافق خارج Node.

في Node، توجد قيود قليلة جدًا على الشروط، ولكن على وجه التحديد تشمل هذه:

### تعريفات شروط المجتمع {#community-conditions-definitions}

يتم تجاهل سلاسل الشروط بخلاف الشروط `"import"` و `"require"` و `"node"` و `"module-sync"` و `"node-addons"` و `"default"` [المنفذة في نواة Node.js](/ar/nodejs/api/packages#conditional-exports) افتراضيًا.

قد تنفذ الأنظمة الأساسية الأخرى شروطًا أخرى ويمكن تمكين شروط المستخدم في Node.js عبر علامة [`--conditions` / `-C`](/ar/nodejs/api/packages#resolving-user-conditions).

نظرًا لأن شروط الحزمة المخصصة تتطلب تعريفات واضحة لضمان الاستخدام الصحيح، يتم توفير قائمة بشروط الحزمة المعروفة الشائعة وتعريفاتها الصارمة أدناه للمساعدة في تنسيق النظام البيئي.

- `"types"` - يمكن استخدامه بواسطة أنظمة الكتابة لحل ملف الكتابة للتصدير المحدد. *يجب دائمًا تضمين هذا الشرط أولاً.*
- `"browser"` - أي بيئة متصفح ويب.
- `"development"` - يمكن استخدامه لتحديد نقطة دخول بيئة تطوير فقط، على سبيل المثال لتوفير سياق تصحيح إضافي مثل رسائل خطأ أفضل عند التشغيل في وضع التطوير. *يجب أن يكون دائمًا
حصريًا بشكل متبادل مع <code>"production"</code>.*
- `"production"` - يمكن استخدامه لتحديد نقطة دخول بيئة الإنتاج. *يجب أن يكون دائمًا حصريًا بشكل متبادل مع <code>"development"</code>.*

بالنسبة إلى أوقات التشغيل الأخرى، يتم الاحتفاظ بتعريفات مفاتيح الشروط الخاصة بالنظام الأساسي بواسطة [WinterCG](https://wintercg.org/) في مواصفات اقتراح [Runtime Keys](https://runtime-keys.proposal.wintercg.org/).

يمكن إضافة تعريفات شروط جديدة إلى هذه القائمة عن طريق إنشاء طلب سحب إلى [وثائق Node.js لهذا القسم](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions). متطلبات إدراج تعريف شرط جديد هنا هي:

- يجب أن يكون التعريف واضحًا ولا لبس فيه لجميع المنفذين.
- يجب تبرير حالة الاستخدام لسبب الحاجة إلى الشرط بوضوح.
- يجب أن يكون هناك استخدام كافٍ للتنفيذ الحالي.
- يجب ألا يتعارض اسم الشرط مع تعريف شرط آخر أو شرط قيد الاستخدام على نطاق واسع.
- يجب أن يوفر إدراج تعريف الشرط فائدة تنسيق للنظام البيئي لا يمكن تحقيقها بخلاف ذلك. على سبيل المثال، لن يكون هذا هو الحال بالضرورة بالنسبة للشروط الخاصة بالشركة أو الشروط الخاصة بالتطبيق.
- يجب أن يكون الشرط بحيث يتوقع مستخدم Node.js وجوده في وثائق نواة Node.js. الشرط `"types"` هو مثال جيد: لا ينتمي حقًا إلى اقتراح [Runtime Keys](https://runtime-keys.proposal.wintercg.org/) ولكنه مناسب تمامًا هنا في وثائق Node.js.

قد يتم نقل التعريفات المذكورة أعلاه إلى سجل شروط مخصص في الوقت المناسب.


### الإشارة الذاتية إلى حزمة باستخدام اسمها {#self-referencing-a-package-using-its-name}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.6.0، v12.16.0 | إلغاء الإشارة إلى حزمة ذاتيًا باستخدام اسمها. |
| الإصدار v13.1.0، v12.16.0 | تمت الإضافة في: v13.1.0، v12.16.0 |
:::

داخل الحزمة، يمكن الإشارة إلى القيم المحددة في حقل [`"exports"`](/ar/nodejs/api/packages#exports) الخاص بـ `package.json` الخاص بالحزمة عبر اسم الحزمة. على سبيل المثال، بافتراض أن `package.json` هو:

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
بعد ذلك، يمكن لأي وحدة *داخل تلك الحزمة* الإشارة إلى تصدير في الحزمة نفسها:

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // يستورد "something" من ./index.mjs.
```
تتوفر الإشارة الذاتية فقط إذا كان `package.json` يحتوي على [`"exports"`](/ar/nodejs/api/packages#exports)، وسيسمح باستيراد ما تسمح به [`"exports"`](/ar/nodejs/api/packages#exports) (في `package.json`). وبالتالي، فإن الكود أدناه، بالنظر إلى الحزمة السابقة، سيؤدي إلى حدوث خطأ في وقت التشغيل:

```js [ESM]
// ./another-module.mjs

// يستورد "another" من ./m.mjs. يفشل لأن
// حقل "exports" في "package.json"
// لا يوفر تصديرًا باسم "./m.mjs".
import { another } from 'a-package/m.mjs';
```
تتوفر الإشارة الذاتية أيضًا عند استخدام `require`، سواء في وحدة ES أو في وحدة CommonJS. على سبيل المثال، سيعمل هذا الكود أيضًا:

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // يتم التحميل من ./foo.js.
```
أخيرًا، تعمل الإشارة الذاتية أيضًا مع الحزم ذات النطاق. على سبيل المثال، سيعمل هذا الكود أيضًا:

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## حزم CommonJS/ES المزدوجة {#dual-commonjs/es-module-packages}

راجع [مستودع أمثلة الحزم](https://github.com/nodejs/package-examples) للحصول على التفاصيل.

## تعريفات حقول `package.json` في Node.js {#nodejs-packagejson-field-definitions}

يصف هذا القسم الحقول المستخدمة بواسطة وقت تشغيل Node.js. تستخدم أدوات أخرى (مثل [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)) حقولًا إضافية تتجاهلها Node.js ولا يتم توثيقها هنا.

تُستخدم الحقول التالية في ملفات `package.json` في Node.js:

- [`"name"`](/ar/nodejs/api/packages#name) - ذات صلة عند استخدام عمليات الاستيراد المسماة داخل الحزمة. يتم استخدامه أيضًا بواسطة مديري الحزم كاسم للحزمة.
- [`"main"`](/ar/nodejs/api/packages#main) - الوحدة الافتراضية عند تحميل الحزمة، إذا لم يتم تحديد exports، وفي إصدارات Node.js قبل إدخال exports.
- [`"packageManager"`](/ar/nodejs/api/packages#packagemanager) - مدير الحزم الموصى به عند المساهمة في الحزمة. يتم الاستفادة منه بواسطة [Corepack](/ar/nodejs/api/corepack) shims.
- [`"type"`](/ar/nodejs/api/packages#type) - نوع الحزمة الذي يحدد ما إذا كان سيتم تحميل ملفات `.js` كوحدات CommonJS أو ES.
- [`"exports"`](/ar/nodejs/api/packages#exports) - عمليات تصدير الحزمة وعمليات التصدير الشرطية. عند وجودها، تحد من الوحدات الفرعية التي يمكن تحميلها من داخل الحزمة.
- [`"imports"`](/ar/nodejs/api/packages#imports) - عمليات استيراد الحزمة، للاستخدام بواسطة الوحدات داخل الحزمة نفسها.


### `"name"` {#"name"}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.6.0, v12.16.0 | تمت إزالة الخيار `--experimental-resolve-self`. |
| الإصدار v13.1.0, v12.16.0 | تمت إضافته في: v13.1.0, v12.16.0 |
:::

- النوع: [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "اسم الحزمة"
}
```
يحدد حقل `"name"` اسم الحزمة الخاصة بك. يتطلب النشر إلى سجل *npm* اسمًا يفي [بمتطلبات معينة](https://docs.npmjs.com/files/package.json#name).

يمكن استخدام حقل `"name"` بالإضافة إلى حقل [`"exports"`](/ar/nodejs/api/packages#exports) لـ [الإشارة الذاتية](/ar/nodejs/api/packages#self-referencing-a-package-using-its-name) إلى حزمة باستخدام اسمها.

### `"main"` {#"main"}

**تمت إضافته في: الإصدار v0.4.0**

- النوع: [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
يحدد حقل `"main"` نقطة دخول الحزمة عند استيرادها بالاسم عبر بحث `node_modules`. قيمته عبارة عن مسار.

عندما تحتوي الحزمة على حقل [`"exports"`](/ar/nodejs/api/packages#exports)، فسيكون له الأسبقية على حقل `"main"` عند استيراد الحزمة بالاسم.

كما أنه يحدد البرنامج النصي الذي يتم استخدامه عند [تحميل دليل الحزمة عبر `require()` ](/ar/nodejs/api/modules#folders-as-modules).

```js [CJS]
// سيؤدي هذا إلى الحل إلى ./path/to/directory/index.js.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**تمت إضافته في: الإصدار v16.9.0, v14.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- النوع: [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<اسم مدير الحزم>@<الإصدار>"
}
```
يحدد حقل `"packageManager"` مدير الحزم المتوقع استخدامه عند العمل على المشروع الحالي. يمكن تعيينه على أي من [مديري الحزم المدعومين](/ar/nodejs/api/corepack#supported-package-managers)، وسيضمن أن تستخدم فرقك نفس إصدارات مدير الحزم بالضبط دون الحاجة إلى تثبيت أي شيء آخر بخلاف Node.js.

هذا الحقل تجريبي حاليًا ويحتاج إلى الاشتراك فيه؛ تحقق من صفحة [Corepack](/ar/nodejs/api/corepack) للحصول على تفاصيل حول الإجراء.


### `"type"` {#"type"}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.2.0, v12.17.0 | إلغاء علامة `--experimental-modules`. |
| v12.0.0 | تمت الإضافة في: v12.0.0 |
:::

- النوع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يحدد الحقل `"type"` تنسيق الوحدة النمطية الذي يستخدمه Node.js لجميع ملفات `.js` التي تحتوي على ملف `package.json` هذا كأقرب أصل لها.

يتم تحميل الملفات التي تنتهي بـ `.js` كوحدات ES النمطية عندما يحتوي ملف `package.json` الأصل الأقرب على حقل المستوى الأعلى `"type"` بقيمة `"module"`.

يتم تعريف `package.json` الأصل الأقرب على أنه أول `package.json` يتم العثور عليه عند البحث في المجلد الحالي، وأصل هذا المجلد، وهكذا حتى يتم الوصول إلى مجلد node_modules أو جذر وحدة التخزين.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# في نفس المجلد مثل package.json السابق {#in-same-folder-as-preceding-packagejson}
node my-app.js # يتم التشغيل كوحدة ES النمطية
```
إذا كان `package.json` الأصل الأقرب يفتقر إلى حقل `"type"`، أو يحتوي على `"type": "commonjs"`، فسيتم التعامل مع ملفات `.js` على أنها [CommonJS](/ar/nodejs/api/modules). إذا تم الوصول إلى جذر وحدة التخزين ولم يتم العثور على `package.json`، فسيتم التعامل مع ملفات `.js` على أنها [CommonJS](/ar/nodejs/api/modules).

تتم معاملة عبارات `import` لملفات `.js` كوحدات ES النمطية إذا كان `package.json` الأصل الأقرب يحتوي على `"type": "module"`.

```js [ESM]
// my-app.js، جزء من نفس المثال أعلاه
import './startup.js'; // تم التحميل كوحدة ES النمطية بسبب package.json
```
بغض النظر عن قيمة الحقل `"type"`، يتم دائمًا التعامل مع ملفات `.mjs` على أنها وحدات ES النمطية ويتم دائمًا التعامل مع ملفات `.cjs` على أنها CommonJS.

### `"exports"` {#"exports"}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.13.0, v12.20.0 | إضافة دعم لأنماط `"exports"`. |
| v13.7.0, v12.17.0 | إلغاء علامة الصادرات الشرطية. |
| v13.7.0, v12.16.0 | تنفيذ ترتيب الصادرات الشرطية المنطقية. |
| v13.7.0, v12.16.0 | إزالة الخيار `--experimental-conditional-exports`. في 12.16.0، لا تزال الصادرات الشرطية خلف `--experimental-modules`. |
| v13.2.0, v12.16.0 | تنفيذ الصادرات الشرطية. |
| v12.7.0 | تمت الإضافة في: v12.7.0 |
:::

- النوع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
يسمح الحقل `"exports"` بتحديد [نقاط الإدخال](/ar/nodejs/api/packages#package-entry-points) لحزمة عند استيرادها بالاسم المحمل إما عبر بحث `node_modules` أو [إشارة ذاتية](/ar/nodejs/api/packages#self-referencing-a-package-using-its-name) إلى اسمها الخاص. يتم دعمه في Node.js 12+ كبديل لـ [`"main"`](/ar/nodejs/api/packages#main) التي يمكن أن تدعم تحديد [صادرات المسار الفرعي](/ar/nodejs/api/packages#subpath-exports) و[الصادرات الشرطية](/ar/nodejs/api/packages#conditional-exports) مع تغليف الوحدات النمطية الداخلية غير المصدرة.

يمكن أيضًا استخدام [الصادرات الشرطية](/ar/nodejs/api/packages#conditional-exports) داخل `"exports"` لتحديد نقاط إدخال حزمة مختلفة لكل بيئة، بما في ذلك ما إذا كان يتم الرجوع إلى الحزمة عبر `require` أو عبر `import`.

يجب أن تكون جميع المسارات المحددة في `"exports"` عناوين URL للملفات النسبية التي تبدأ بـ `./`.


### `"imports"` {#"imports"}

**أضيف في: الإصدار v14.6.0، الإصدار v12.19.0**

- النوع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
يجب أن تكون الإدخالات في حقل الاستيراد عبارة عن سلاسل تبدأ بـ `#`.

تسمح استيرادات الحزمة بالتعيين إلى حزم خارجية.

يحدد هذا الحقل [عمليات استيراد المسار الفرعي](/ar/nodejs/api/packages#subpath-imports) للحزمة الحالية.

