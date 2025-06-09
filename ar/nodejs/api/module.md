---
title: توثيق Node.js - نظام الوحدات
description: توفر هذه الصفحة توثيقًا مفصلًا حول نظام الوحدات في Node.js، بما في ذلك CommonJS و ES modules، كيفية تحميل الوحدات، التخزين المؤقت للوحدات، والفروق بين النظامين.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - نظام الوحدات | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر هذه الصفحة توثيقًا مفصلًا حول نظام الوحدات في Node.js، بما في ذلك CommonJS و ES modules، كيفية تحميل الوحدات، التخزين المؤقت للوحدات، والفروق بين النظامين.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - نظام الوحدات | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر هذه الصفحة توثيقًا مفصلًا حول نظام الوحدات في Node.js، بما في ذلك CommonJS و ES modules، كيفية تحميل الوحدات، التخزين المؤقت للوحدات، والفروق بين النظامين.
---


# الوحدات: واجهة برمجة التطبيقات `node:module` {#modules-nodemodule-api}

**أضيفت في: v0.3.7**

## الكائن `Module` {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

توفر أساليب الأداة المساعدة العامة عند التفاعل مع مثيلات `Module`، ومتغير [`module`](/ar/nodejs/api/module#the-module-object) الذي غالبًا ما يُرى في وحدات [CommonJS](/ar/nodejs/api/modules). يتم الوصول إليه عبر `import 'node:module'` أو `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | تحتوي القائمة الآن أيضًا على وحدات ذات بادئة فقط. |
| v9.3.0, v8.10.0, v6.13.0 | أضيفت في: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

قائمة بأسماء جميع الوحدات التي توفرها Node.js. يمكن استخدامه للتحقق مما إذا كانت الوحدة النمطية يتم الاحتفاظ بها بواسطة طرف ثالث أم لا.

`module` في هذا السياق ليس هو نفس الكائن الذي توفره [أداة تغليف الوحدة](/ar/nodejs/api/modules#the-module-wrapper). للوصول إليه، اطلب وحدة `Module`:

::: code-group
```js [ESM]
// module.mjs
// في وحدة ECMAScript
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// في وحدة CommonJS
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**أضيفت في: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) اسم الملف المراد استخدامه لإنشاء وظيفة الطلب. يجب أن يكون كائن عنوان URL للملف، أو سلسلة عنوان URL للملف، أو سلسلة مسار مطلق.
- Returns: [\<require\>](/ar/nodejs/api/modules#requireid) وظيفة الطلب

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js هي وحدة CommonJS.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**أضيفت في: v23.2.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) 1 - تطوير نشط
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) محدد الوحدة التي سيتم استرداد `package.json` الخاصة بها. عند تمرير *محدد مجرد*، يتم إرجاع `package.json` في جذر الحزمة. عند تمرير *محدد نسبي* أو *محدد مطلق*، يتم إرجاع أقرب `package.json` أصل.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) الموقع المطلق (سلسلة عنوان URL `file:` أو مسار نظام الملفات) للوحدة النمطية المحتوية. بالنسبة إلى CJS، استخدم `__filename` (وليس `__dirname`!)؛ بالنسبة إلى ESM، استخدم `import.meta.url`. لا تحتاج إلى تمريره إذا كان `specifier` عبارة عن `absolute specifier`.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار إذا تم العثور على `package.json`. عندما يكون `startLocation` حزمة، فإن `package.json` الجذر الخاص بالحزمة؛ عندما يكون نسبيًا أو غير محلول، فإن أقرب `package.json` إلى `startLocation`.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```

::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// نفس النتيجة عند تمرير محدد مطلق بدلاً من ذلك:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// عند تمرير محدد مطلق، قد تحصل على نتيجة مختلفة إذا
// كانت الوحدة النمطية التي تم حلها داخل مجلد فرعي يحتوي على `package.json` متداخلة.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// نفس النتيجة عند تمرير محدد مطلق بدلاً من ذلك:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// عند تمرير محدد مطلق، قد تحصل على نتيجة مختلفة إذا
// كانت الوحدة النمطية التي تم حلها داخل مجلد فرعي يحتوي على `package.json` متداخلة.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::

### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**تمت الإضافة في: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الوحدة
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ترجع true إذا كانت الوحدة مدمجة وإلا ترجع false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.8.0, v18.19.0 | إضافة دعم لمثيلات WHATWG URL. |
| v20.6.0, v18.19.0 | تمت الإضافة في: v20.6.0, v18.19.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح الإصدار
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) خطافات تخصيص ليتم تسجيلها؛ يجب أن يكون هذا هو نفس السلسلة التي سيتم تمريرها إلى `import()` ، باستثناء أنه إذا كان نسبيًا ، فسيتم حله بالنسبة إلى `parentURL`.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) إذا كنت تريد حل `specifier` بالنسبة إلى عنوان URL أساسي، مثل `import.meta.url`، يمكنك تمرير عنوان URL هذا هنا. **الافتراضي:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) إذا كنت تريد حل `specifier` بالنسبة إلى عنوان URL أساسي، مثل `import.meta.url`، يمكنك تمرير عنوان URL هذا هنا. يتم تجاهل هذه الخاصية إذا تم توفير `parentURL` كوسيطة ثانية. **الافتراضي:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) أي قيمة JavaScript عشوائية وقابلة للاستنساخ ليتم تمريرها إلى الخطاف [`initialize`](/ar/nodejs/api/module#initialize).
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [كائنات قابلة للنقل](/ar/nodejs/api/worker_threads#portpostmessagevalue-transferlist) ليتم تمريرها إلى الخطاف `initialize`.
  
 

قم بتسجيل وحدة تصدّر [خطافات](/ar/nodejs/api/module#customization-hooks) تقوم بتخصيص سلوك حل وحدة Node.js وتحميلها. راجع [خطافات التخصيص](/ar/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**تمت الإضافة في: الإصدار v23.5.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) راجع [خطاف التحميل](/ar/nodejs/api/module#loadurl-context-nextload). **افتراضي:** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) راجع [خطاف الحل](/ar/nodejs/api/module#resolvespecifier-context-nextresolve). **افتراضي:** `undefined`.
  
 

تسجيل [الخطافات](/ar/nodejs/api/module#customization-hooks) التي تخصص سلوك حل وتحميل وحدة Node.js. راجع [خطافات التخصيص](/ar/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**تمت الإضافة في: الإصدار v23.2.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الكود الذي سيتم إزالة تعليقات النوع منه.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **افتراضي:** `'strip'`. القيم المحتملة هي: 
    - `'strip'` إزالة تعليقات النوع فقط دون إجراء تحويل لميزات TypeScript.
    - `'transform'` إزالة تعليقات النوع وتحويل ميزات TypeScript إلى JavaScript.
  
 
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **افتراضي:** `false`. فقط عندما يكون `mode` هو `'transform'`، إذا كان `true`، فسيتم إنشاء خريطة مصدر للكود المحول.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)  يحدد عنوان URL المصدر المستخدم في خريطة المصدر.
  
 
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الكود مع إزالة تعليقات النوع. `module.stripTypeScriptTypes()` يزيل تعليقات النوع من كود TypeScript. يمكن استخدامه لإزالة تعليقات النوع من كود TypeScript قبل تشغيله باستخدام `vm.runInContext()` أو `vm.compileFunction()`. بشكل افتراضي، سيطرح خطأ إذا كان الكود يحتوي على ميزات TypeScript تتطلب التحويل مثل `Enums`، راجع [إزالة النوع](/ar/nodejs/api/typescript#type-stripping) لمزيد من المعلومات. عندما يكون الوضع هو `'transform'`، فإنه يحول أيضًا ميزات TypeScript إلى JavaScript، راجع [تحويل ميزات TypeScript](/ar/nodejs/api/typescript#typescript-features) لمزيد من المعلومات. عندما يكون الوضع هو `'strip'`، لا يتم إنشاء خرائط المصدر، لأن المواقع محفوظة. إذا تم توفير `sourceMap`، عندما يكون الوضع هو `'strip'`، فسيتم طرح خطأ.

*تحذير*: لا ينبغي اعتبار مخرج هذه الدالة ثابتًا عبر إصدارات Node.js، بسبب التغييرات في محلل TypeScript.



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

إذا تم توفير `sourceUrl`، فسيتم استخدامه وإلحاقه كتعليق في نهاية الإخراج:



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

عندما يكون `mode` هو `'transform'`، يتم تحويل الكود إلى JavaScript:



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::

### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**أُضيف في: v12.12.0**

تقوم الطريقة `module.syncBuiltinESMExports()` بتحديث جميع الروابط الحية لـ [وحدات ES Modules](/ar/nodejs/api/esm) المدمجة لتتوافق مع خصائص الصادرات [CommonJS](/ar/nodejs/api/modules). إنها لا تضيف أو تزيل أسماء مصدّرة من [وحدات ES Modules](/ar/nodejs/api/esm).

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // تقوم بمزامنة الخاصية readFile الموجودة بالقيمة الجديدة
  assert.strictEqual(esmFS.readFile, newAPI);
  // تمت إزالة readFileSync من fs المطلوبة
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() لا تزيل readFileSync من esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() لا تضيف أسماء
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## ذاكرة التخزين المؤقت لتجميع الوحدات النمطية {#module-compile-cache}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.8.0 | أضف واجهات JavaScript API الأولية للوصول في وقت التشغيل. |
| v22.1.0 | أُضيف في: v22.1.0 |
:::

يمكن تمكين ذاكرة التخزين المؤقت لتجميع الوحدات النمطية إما باستخدام الطريقة [`module.enableCompileCache()`](/ar/nodejs/api/module#moduleenablecompilecachecachedir) أو متغير البيئة [`NODE_COMPILE_CACHE=dir`](/ar/nodejs/api/cli#node_compile_cachedir). بعد تمكينها، متى قام Node.js بتجميع CommonJS أو ECMAScript Module، فإنه سيستخدم [ذاكرة التخزين المؤقت لرمز V8](https://v8.dev/blog/code-caching-for-devs) الموجودة على القرص والمخزنة في الدليل المحدد لتسريع التجميع. قد يؤدي هذا إلى إبطاء التحميل الأول لرسم بياني للوحدات النمطية، ولكن قد تحصل عمليات التحميل اللاحقة لنفس الرسم البياني للوحدات النمطية على تسريع كبير إذا لم تتغير محتويات الوحدات النمطية.

لتنظيف ذاكرة التخزين المؤقت للتجميع التي تم إنشاؤها على القرص، ما عليك سوى إزالة دليل ذاكرة التخزين المؤقت. سيتم إعادة إنشاء دليل ذاكرة التخزين المؤقت في المرة التالية التي يتم فيها استخدام نفس الدليل لتخزين ذاكرة التخزين المؤقت للتجميع. لتجنب ملء القرص بذاكرة تخزين مؤقت قديمة، يوصى باستخدام دليل ضمن [`os.tmpdir()`](/ar/nodejs/api/os#ostmpdir). إذا تم تمكين ذاكرة التخزين المؤقت للتجميع عن طريق استدعاء [`module.enableCompileCache()`](/ar/nodejs/api/module#moduleenablecompilecachecachedir) دون تحديد الدليل، فسيستخدم Node.js متغير البيئة [`NODE_COMPILE_CACHE=dir`](/ar/nodejs/api/cli#node_compile_cachedir) إذا تم تعيينه، أو سيتم الافتراضي إلى `path.join(os.tmpdir(), 'node-compile-cache')` بخلاف ذلك. لتحديد موقع دليل ذاكرة التخزين المؤقت للتجميع المستخدم بواسطة مثيل Node.js قيد التشغيل، استخدم [`module.getCompileCacheDir()`](/ar/nodejs/api/module#modulegetcompilecachedir).

حاليًا عند استخدام ذاكرة التخزين المؤقت للتجميع مع [تغطية كود JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage)، قد تكون التغطية التي تجمعها V8 أقل دقة في الوظائف التي يتم إلغاء تسلسلها من ذاكرة التخزين المؤقت للتعليمات البرمجية. يوصى بإيقاف تشغيل هذا عند تشغيل الاختبارات لإنشاء تغطية دقيقة.

يمكن تعطيل ذاكرة التخزين المؤقت لتجميع الوحدات النمطية التي تم تمكينها بواسطة متغير البيئة [`NODE_DISABLE_COMPILE_CACHE=1`](/ar/nodejs/api/cli#node_disable_compile_cache1). يمكن أن يكون هذا مفيدًا عندما تؤدي ذاكرة التخزين المؤقت للتجميع إلى سلوكيات غير متوقعة أو غير مرغوب فيها (على سبيل المثال، تغطية اختبار أقل دقة).

لا يمكن إعادة استخدام ذاكرة التخزين المؤقت للتجميع التي تم إنشاؤها بواسطة إصدار واحد من Node.js بواسطة إصدار مختلف من Node.js. سيتم تخزين ذاكرة التخزين المؤقت التي تم إنشاؤها بواسطة إصدارات مختلفة من Node.js بشكل منفصل إذا تم استخدام نفس الدليل الأساسي لتخزين ذاكرة التخزين المؤقت، بحيث يمكن أن تتعايش.

في الوقت الحالي، عندما يتم تمكين ذاكرة التخزين المؤقت للتجميع ويتم تحميل وحدة نمطية حديثًا، يتم إنشاء ذاكرة التخزين المؤقت للتعليمات البرمجية من التعليمات البرمجية المجمعة على الفور، ولكن سيتم كتابتها على القرص فقط عندما يكون مثيل Node.js على وشك الخروج. هذا عرضة للتغيير. يمكن استخدام الطريقة [`module.flushCompileCache()`](/ar/nodejs/api/module#moduleflushcompilecache) للتأكد من مسح ذاكرة التخزين المؤقت للتعليمات البرمجية المتراكمة إلى القرص في حالة رغبة التطبيق في إنشاء مثيلات Node.js أخرى والسماح لها بمشاركة ذاكرة التخزين المؤقت قبل فترة طويلة من خروج الأصل.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**أُضيف في: v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

يتم إرجاع الثوابت التالية كحقل `status` في الكائن الذي يتم إرجاعه بواسطة [`module.enableCompileCache()`](/ar/nodejs/api/module#moduleenablecompilecachecachedir) للإشارة إلى نتيجة محاولة تمكين [ذاكرة التخزين المؤقت لتجميع الوحدة](/ar/nodejs/api/module#module-compile-cache).

| ثابت | الوصف |
| --- | --- |
| `ENABLED` |        تمكن Node.js من تمكين ذاكرة التخزين المؤقت للتجميع بنجاح. سيتم إرجاع الدليل المستخدم لتخزين ذاكرة التخزين المؤقت للتجميع في الحقل `directory` في الكائن الذي تم إرجاعه.      |
| `ALREADY_ENABLED` |        تم بالفعل تمكين ذاكرة التخزين المؤقت للتجميع من قبل، إما عن طريق استدعاء سابق لـ `module.enableCompileCache()`، أو عن طريق متغير البيئة `NODE_COMPILE_CACHE=dir`. سيتم إرجاع الدليل المستخدم لتخزين ذاكرة التخزين المؤقت للتجميع في الحقل `directory` في الكائن الذي تم إرجاعه.      |
| `FAILED` |        فشل Node.js في تمكين ذاكرة التخزين المؤقت للتجميع. يمكن أن يكون هذا بسبب عدم وجود إذن لاستخدام الدليل المحدد، أو أنواع مختلفة من أخطاء نظام الملفات. سيتم إرجاع تفاصيل الفشل في الحقل `message` في الكائن الذي تم إرجاعه.      |
| `DISABLED` |        لا يمكن لـ Node.js تمكين ذاكرة التخزين المؤقت للتجميع لأن متغير البيئة `NODE_DISABLE_COMPILE_CACHE=1` قد تم تعيينه.      |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**أُضيف في: v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار اختياري لتحديد الدليل حيث سيتم تخزين/استرجاع ذاكرة التخزين المؤقت للتجميع.
- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أحد [`module.constants.compileCacheStatus`](/ar/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إذا لم يتمكن Node.js من تمكين ذاكرة التخزين المؤقت للتجميع، فسيحتوي هذا على رسالة الخطأ. يتم تعيينه فقط إذا كان `status` هو `module.constants.compileCacheStatus.FAILED`.
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إذا تم تمكين ذاكرة التخزين المؤقت للتجميع، فسيحتوي هذا على الدليل حيث يتم تخزين ذاكرة التخزين المؤقت للتجميع. يتم تعيينه فقط إذا كان `status` هو `module.constants.compileCacheStatus.ENABLED` أو `module.constants.compileCacheStatus.ALREADY_ENABLED`.
  
 

تمكين [ذاكرة التخزين المؤقت لتجميع الوحدة](/ar/nodejs/api/module#module-compile-cache) في مثيل Node.js الحالي.

إذا لم يتم تحديد `cacheDir`، فسيستخدم Node.js إما الدليل المحدد بواسطة متغير البيئة [`NODE_COMPILE_CACHE=dir`](/ar/nodejs/api/cli#node_compile_cachedir) إذا تم تعيينه، أو سيستخدم `path.join(os.tmpdir(), 'node-compile-cache')` بخلاف ذلك. بالنسبة لحالات الاستخدام العامة، يوصى باستدعاء `module.enableCompileCache()` دون تحديد `cacheDir`، بحيث يمكن تجاوز الدليل بواسطة متغير البيئة `NODE_COMPILE_CACHE` عند الضرورة.

نظرًا لأن ذاكرة التخزين المؤقت للتجميع من المفترض أن تكون تحسينًا صامتًا غير مطلوب للتطبيق ليكون فعالاً، فقد تم تصميم هذه الطريقة بحيث لا تطرح أي استثناء عند تعذر تمكين ذاكرة التخزين المؤقت للتجميع. بدلاً من ذلك، ستُرجع كائنًا يحتوي على رسالة خطأ في الحقل `message` للمساعدة في تصحيح الأخطاء. إذا تم تمكين ذاكرة التخزين المؤقت للتجميع بنجاح، فسيحتوي الحقل `directory` في الكائن الذي تم إرجاعه على المسار إلى الدليل حيث يتم تخزين ذاكرة التخزين المؤقت للتجميع. سيكون الحقل `status` في الكائن الذي تم إرجاعه أحد قيم `module.constants.compileCacheStatus` للإشارة إلى نتيجة محاولة تمكين [ذاكرة التخزين المؤقت لتجميع الوحدة](/ar/nodejs/api/module#module-compile-cache).

تؤثر هذه الطريقة فقط على مثيل Node.js الحالي. لتمكينه في سلاسل عمليات العامل الفرعية، إما استدعاء هذه الطريقة في سلاسل عمليات العامل الفرعية أيضًا، أو تعيين قيمة `process.env.NODE_COMPILE_CACHE` إلى دليل ذاكرة التخزين المؤقت للتجميع بحيث يمكن وراثة السلوك في العمال الفرعيين. يمكن الحصول على الدليل إما من الحقل `directory` الذي تم إرجاعه بواسطة هذه الطريقة، أو باستخدام [`module.getCompileCacheDir()`](/ar/nodejs/api/module#modulegetcompilecachedir).


### `module.flushCompileCache()` {#moduleflushcompilecache}

**أُضيف في: v23.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تفريغ [ذاكرة التخزين المؤقت لتجميع الوحدات](/ar/nodejs/api/module#module-compile-cache) المتراكمة من الوحدات النمطية المحملة بالفعل في مثيل Node.js الحالي إلى القرص. يعود هذا بعد انتهاء جميع عمليات نظام الملفات المتدفقة، بغض النظر عما إذا كانت ناجحة أم لا. في حالة وجود أي أخطاء، فسيفشل هذا بصمت، لأن فقدان ذاكرة التخزين المؤقت للتجميع يجب ألا يتعارض مع التشغيل الفعلي للتطبيق.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**أُضيف في: v22.8.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار إلى دليل [ذاكرة التخزين المؤقت لتجميع الوحدات](/ar/nodejs/api/module#module-compile-cache) إذا كان ممكّنًا، أو `undefined` بخلاف ذلك.

## خطافات التخصيص {#customization-hooks}


::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | إضافة دعم للخطافات المتزامنة وفي سلسلة العمليات. |
| v20.6.0, v18.19.0 | إضافة خطاف `initialize` لاستبدال `globalPreload`. |
| v18.6.0, v16.17.0 | إضافة دعم لتسلسل أدوات التحميل. |
| v16.12.0 | إزالة `getFormat` و`getSource` و`transformSource` و`globalPreload`؛ إضافة خطاف `load` وخطاف `getGlobalPreload`. |
| v8.8.0 | أُضيف في: v8.8.0 |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح الإصدار (إصدار غير متزامن) الاستقرار: 1.1 - تطوير نشط (إصدار متزامن)
:::

يوجد نوعان من خطافات تخصيص الوحدات النمطية المدعومة حاليًا:

### التمكين {#enabling}

يمكن تخصيص تحليل الوحدات النمطية وتحميلها عن طريق:

يمكن تسجيل الخطافات قبل تشغيل كود التطبيق باستخدام العلامة [`--import`](/ar/nodejs/api/cli#--importmodule) أو العلامة [`--require`](/ar/nodejs/api/cli#-r---require-module):

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```


::: code-group
```js [ESM]
// register-hooks.js
// لا يمكن طلب هذا الملف باستخدام require() إلا إذا لم يكن يحتوي على await من المستوى الأعلى.
// استخدم module.register() لتسجيل الخطافات غير المتزامنة في سلسلة عمليات مخصصة.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// استخدم module.register() لتسجيل الخطافات غير المتزامنة في سلسلة عمليات مخصصة.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::



::: code-group
```js [ESM]
// استخدم module.registerHooks() لتسجيل الخطافات المتزامنة في سلسلة العمليات الرئيسية.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```

```js [CJS]
// استخدم module.registerHooks() لتسجيل الخطافات المتزامنة في سلسلة العمليات الرئيسية.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```
:::

يمكن أن يكون الملف الذي تم تمريره إلى `--import` أو `--require` أيضًا عبارة عن تصدير من تبعية:

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
حيث يحتوي `some-package` على حقل [`"exports"`](/ar/nodejs/api/packages#exports) يحدد التصدير `/register` لتعيينه إلى ملف يستدعي `register()`، مثل مثال `register-hooks.js` التالي.

يضمن استخدام `--import` أو `--require` تسجيل الخطافات قبل استيراد أي ملفات تطبيق، بما في ذلك نقطة دخول التطبيق وأي سلاسل عمليات عاملة بشكل افتراضي أيضًا.

بدلاً من ذلك، يمكن استدعاء `register()` و`registerHooks()` من نقطة الدخول، على الرغم من أنه يجب استخدام `import()` الديناميكي لأي كود ESM يجب تشغيله بعد تسجيل الخطافات.



::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// نظرًا لأن هذا `import()` ديناميكي، فسيتم تشغيل خطافات `http-to-https`
// للتعامل مع `./my-app.js` وأي ملفات أخرى يستوردها أو يطلبها.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// نظرًا لأن هذا `import()` ديناميكي، فسيتم تشغيل خطافات `http-to-https`
// للتعامل مع `./my-app.js` وأي ملفات أخرى يستوردها أو يطلبها.
import('./my-app.js');
```
:::

سيتم تشغيل خطافات التخصيص لأي وحدات نمطية يتم تحميلها لاحقًا عن التسجيل والوحدات النمطية التي تشير إليها عبر `import` و`require` المضمن. لا يمكن تخصيص دالة `require` التي أنشأها المستخدمون باستخدام `module.createRequire()` إلا عن طريق الخطافات المتزامنة.

في هذا المثال، نقوم بتسجيل خطافات `http-to-https`، ولكنها ستكون متاحة فقط للوحدات النمطية المستوردة لاحقًا - في هذه الحالة، `my-app.js` وأي شيء يشير إليه عبر `import` أو `require` المضمن في تبعيات CommonJS.

إذا كان `import('./my-app.js')` بدلاً من ذلك عبارة عن `import './my-app.js'` ثابت، فسيتم تحميل التطبيق *بالفعل* **قبل** تسجيل خطافات `http-to-https`. وذلك بسبب مواصفات وحدات ES، حيث يتم تقييم عمليات الاستيراد الثابتة من أوراق الشجرة أولاً، ثم الرجوع إلى الجذع. يمكن أن تكون هناك عمليات استيراد ثابتة *داخل* `my-app.js`، والتي لن يتم تقييمها حتى يتم استيراد `my-app.js` ديناميكيًا.

إذا تم استخدام الخطافات المتزامنة، فسيتم دعم كل من `import` و`require` و`require` المستخدم الذي تم إنشاؤه باستخدام `createRequire()`.



::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* implementation of synchronous hooks */ });

const require = createRequire(import.meta.url);

// تؤثر الخطافات المتزامنة على دالة import و require() و require() الخاصة بالمستخدم
// التي تم إنشاؤها من خلال createRequire().
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* implementation of synchronous hooks */ });

const userRequire = createRequire(__filename);

// تؤثر الخطافات المتزامنة على دالة import و require() و require() الخاصة بالمستخدم
// التي تم إنشاؤها من خلال createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

أخيرًا، إذا كان كل ما تريد فعله هو تسجيل الخطافات قبل تشغيل تطبيقك ولا تريد إنشاء ملف منفصل لهذا الغرض، فيمكنك تمرير عنوان URL `data:` إلى `--import`:

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### التسلسل {#chaining}

من الممكن استدعاء `register` أكثر من مرة:

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

في هذا المثال، ستشكل الخطافات المسجلة سلاسل. تعمل هذه السلاسل بأسلوب آخر ما يدخل أول ما يخرج (LIFO). إذا كان كل من `foo.mjs` و `bar.mjs` يعرّفان خطاف `resolve`، فسيتم استدعاؤهما على النحو التالي (لاحظ من اليمين إلى اليسار): الافتراضي الخاص بـ node ← `./foo.mjs` ← `./bar.mjs` (بدءًا بـ `./bar.mjs`، ثم `./foo.mjs`، ثم الافتراضي الخاص بـ Node.js). وينطبق الشيء نفسه على جميع الخطافات الأخرى.

تؤثر الخطافات المسجلة أيضًا على `register` نفسها. في هذا المثال، سيتم حل `bar.mjs` وتحميله عبر الخطافات المسجلة بواسطة `foo.mjs` (لأن خطافات `foo` ستكون قد أضيفت بالفعل إلى السلسلة). يتيح ذلك أشياء مثل كتابة الخطافات بلغات غير JavaScript، طالما أن الخطافات المسجلة سابقًا تحول إلى JavaScript.

لا يمكن استدعاء طريقة `register` من داخل الوحدة النمطية التي تحدد الخطافات.

يعمل تسلسل `registerHooks` بالمثل. إذا تم خلط الخطافات المتزامنة وغير المتزامنة، فسيتم دائمًا تشغيل الخطافات المتزامنة أولاً قبل بدء تشغيل الخطافات غير المتزامنة، أي في آخر خطاف متزامن يتم تشغيله، يتضمن خطافه التالي استدعاء الخطافات غير المتزامنة.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### التواصل مع خطافات تخصيص الوحدة النمطية {#communication-with-module-customization-hooks}

تعمل الخطافات غير المتزامنة على سلسلة رسائل مخصصة، منفصلة عن سلسلة الرسائل الرئيسية التي تقوم بتشغيل كود التطبيق. هذا يعني أن تغيير المتغيرات العامة لن يؤثر على سلسلة الرسائل الأخرى (سلاسل الرسائل)، ويجب استخدام قنوات الرسائل للتواصل بين سلاسل الرسائل.

يمكن استخدام طريقة `register` لتمرير البيانات إلى خطاف [`initialize`](/ar/nodejs/api/module#initialize). قد تتضمن البيانات التي تم تمريرها إلى الخطاف كائنات قابلة للتحويل مثل المنافذ.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// يوضح هذا المثال كيف يمكن استخدام قناة رسائل
// للتواصل مع الخطافات، عن طريق إرسال `port2` إلى الخطافات.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// يعرض هذا المثال كيف يمكن استخدام قناة رسائل
// للتواصل مع الخطافات، عن طريق إرسال `port2` إلى الخطافات.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

يتم تشغيل خطافات الوحدة النمطية المتزامنة على نفس سلسلة الرسائل حيث يتم تشغيل كود التطبيق. يمكنهم تغيير المتغيرات العامة للسياق الذي يتم الوصول إليه بواسطة سلسلة الرسائل الرئيسية مباشرة.

### الخطافات {#hooks}

#### خطافات غير متزامنة مقبولة بواسطة `module.register()` {#asynchronous-hooks-accepted-by-moduleregister}

يمكن استخدام طريقة [`register`](/ar/nodejs/api/module#moduleregisterspecifier-parenturl-options) لتسجيل وحدة نمطية تصدر مجموعة من الخطافات. الخطافات هي وظائف يتم استدعاؤها بواسطة Node.js لتخصيص عملية حل الوحدة النمطية وتحميلها. يجب أن يكون للوظائف المصدرة أسماء وتوقيعات محددة، ويجب تصديرها كصادرات مسماة.

```js [ESM]
export async function initialize({ number, port }) {
  // يتلقى البيانات من `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // خذ محدد `import` أو `require` وقم بحله إلى عنوان URL.
}

export async function load(url, context, nextLoad) {
  // خذ عنوان URL تم حله وأرجع الكود المصدري المراد تقييمه.
}
```
يتم تشغيل الخطافات غير المتزامنة في سلسلة رسائل منفصلة، معزولة عن سلسلة الرسائل الرئيسية حيث يتم تشغيل كود التطبيق. هذا يعني أنه [نطاق](https://tc39.es/ecma262/#realm) مختلف. قد يتم إنهاء سلسلة رسائل الخطافات بواسطة سلسلة الرسائل الرئيسية في أي وقت، لذلك لا تعتمد على العمليات غير المتزامنة (مثل `console.log`) لإكمالها. يتم توريثها إلى العاملين الفرعيين افتراضيًا.


#### خطافات متزامنة مقبولة بواسطة `module.registerHooks()` {#synchronous-hooks-accepted-by-moduleregisterhooks}

**تمت إضافتها في: الإصدار 23.5.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تقبل طريقة `module.registerHooks()` وظائف الخطاف المتزامنة. `initialize()` غير مدعوم ولا ضروري، حيث يمكن لمُنفِّذ الخطاف ببساطة تشغيل كود التهيئة مباشرةً قبل استدعاء `module.registerHooks()`.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // خذ مُعرّف `import` أو `require` وحلّه إلى عنوان URL.
}

function load(url, context, nextLoad) {
  // خذ عنوان URL محلولًا وأرجع الكود المصدري ليتم تقييمه.
}
```

يتم تشغيل الخطافات المتزامنة في نفس مؤشر الترابط ونفس [المجال](https://tc39.es/ecma262/#realm) حيث يتم تحميل الوحدات النمطية. على عكس الخطافات غير المتزامنة، لا يتم توريثها افتراضيًا في سلاسل عمليات العامل الفرعية، على الرغم من أنه إذا تم تسجيل الخطافات باستخدام ملف تم تحميله مسبقًا بواسطة [`--import`](/ar/nodejs/api/cli#--importmodule) أو [`--require`](/ar/nodejs/api/cli#-r---require-module)، يمكن لسلاسل عمليات العامل الفرعية أن ترث البرامج النصية التي تم تحميلها مسبقًا عبر وراثة `process.execArgv`. راجع [وثائق `Worker`](/ar/nodejs/api/worker_threads#new-workerfilename-options) للحصول على التفاصيل.

في الخطافات المتزامنة، يمكن للمستخدمين توقع اكتمال `console.log()` بنفس الطريقة التي يتوقعون بها اكتمال `console.log()` في كود الوحدة النمطية.

#### اصطلاحات الخطافات {#conventions-of-hooks}

تعتبر الخطافات جزءًا من [سلسلة](/ar/nodejs/api/module#chaining)، حتى لو كانت هذه السلسلة تتكون من خطاف مخصص واحد فقط (مقدم من المستخدم) والخطاف الافتراضي، الموجود دائمًا. تتداخل وظائف الخطاف: يجب على كل وظيفة دائمًا إرجاع كائن عادي، ويحدث التسلسل نتيجة لاستدعاء كل وظيفة `next\<hookName\>()`، وهو مرجع إلى خطاف المحمل اللاحق (بترتيب LIFO).

يتسبب الخطاف الذي يُرجع قيمة تفتقر إلى خاصية مطلوبة في حدوث استثناء. كما يتسبب الخطاف الذي يُرجع دون استدعاء `next\<hookName\>()` *ودون* إرجاع `shortCircuit: true` في حدوث استثناء أيضًا. تهدف هذه الأخطاء إلى المساعدة في منع الانقطاعات غير المقصودة في السلسلة. قم بإرجاع `shortCircuit: true` من خطاف للإشارة إلى أن السلسلة تنتهي عمدًا عند خطافك.


#### `initialize()` {#initialize}

**تمت إضافتها في: الإصدار v20.6.0، v18.19.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [ثابت: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح للإصدار
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) البيانات من `register(loader, import.meta.url, { data })`.

يتم قبول الخطاف `initialize` فقط بواسطة [`register`](/ar/nodejs/api/module#moduleregisterspecifier-parenturl-options). `registerHooks()` لا يدعمها ولا يحتاجها لأن التهيئة التي تتم للخطافات المتزامنة يمكن تشغيلها مباشرة قبل استدعاء `registerHooks()`.

يوفر الخطاف `initialize` طريقة لتعريف دالة مخصصة يتم تشغيلها في سلسلة عمليات الخطافات عند تهيئة وحدة الخطافات. تحدث التهيئة عندما يتم تسجيل وحدة الخطافات عبر [`register`](/ar/nodejs/api/module#moduleregisterspecifier-parenturl-options).

يمكن لهذا الخطاف تلقي بيانات من استدعاء [`register`](/ar/nodejs/api/module#moduleregisterspecifier-parenturl-options)، بما في ذلك المنافذ والكائنات الأخرى القابلة للتحويل. يمكن أن تكون القيمة المرجعة لـ `initialize` عبارة عن [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)، وفي هذه الحالة سيتم انتظارها قبل استئناف تنفيذ سلسلة عمليات التطبيق الرئيسية.

رمز تخصيص الوحدة:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
رمز المتصل:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v23.5.0 | إضافة دعم للخطافات المتزامنة وداخل السلسلة. |
| v21.0.0, v20.10.0, v18.19.0 | تم استبدال الخاصية `context.importAssertions` بـ `context.importAttributes`. لا يزال استخدام الاسم القديم مدعومًا وسيصدر تحذيرًا تجريبيًا. |
| v18.6.0, v16.17.0 | إضافة دعم لربط خطافات الحل. يجب على كل خطاف إما استدعاء `nextResolve()` أو تضمين خاصية `shortCircuit` مضبوطة على `true` في إرجاعه. |
| v17.1.0, v16.14.0 | إضافة دعم لتأكيدات الاستيراد. |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح الإصدار (الإصدار غير المتزامن) الاستقرار: 1.1 - تطوير نشط (الإصدار المتزامن)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) شروط التصدير لـ `package.json` ذات الصلة
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن تمثل أزواج قيمه الرئيسية السمات الخاصة بالوحدة المراد استيرادها
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) الوحدة النمطية التي تستورد هذه الوحدة، أو غير معرف إذا كانت هذه هي نقطة إدخال Node.js


- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) خطاف `resolve` اللاحق في السلسلة، أو خطاف `resolve` الافتراضي لـ Node.js بعد آخر خطاف `resolve` مقدم من المستخدم
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يأخذ الإصدار غير المتزامن إما كائنًا يحتوي على الخصائص التالية، أو `Promise` سيؤدي إلى حل هذا الكائن. يقبل الإصدار المتزامن فقط كائنًا يتم إرجاعه بشكل متزامن.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) تلميح لخطاف التحميل (قد يتم تجاهله) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) سمات الاستيراد المراد استخدامها عند تخزين الوحدة النمطية مؤقتًا (اختياري؛ إذا تم استبعاده فسيتم استخدام الإدخال)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إشارة إلى أن هذا الخطاف يعتزم إنهاء سلسلة خطافات `resolve`. **افتراضي:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL المطلق الذي يحل إليه هذا الإدخال


سلسلة خطاف `resolve` مسؤولة عن إخبار Node.js بمكان العثور على عبارة أو تعبير `import` معين وكيفية تخزينه مؤقتًا، أو استدعاء `require`. يمكنه اختياريًا إرجاع تنسيق (مثل `'module'`) كتلميح إلى خطاف `load`. إذا تم تحديد تنسيق، فإن خطاف `load` هو المسؤول في النهاية عن توفير قيمة `format` النهائية (وهو حر في تجاهل التلميح المقدم من `resolve`)؛ إذا قدم `resolve` `format`، يلزم وجود خطاف `load` مخصص حتى لو كان ذلك فقط لتمرير القيمة إلى خطاف `load` الافتراضي لـ Node.js.

تعد سمات نوع الاستيراد جزءًا من مفتاح ذاكرة التخزين المؤقت لحفظ الوحدات النمطية التي تم تحميلها في ذاكرة التخزين المؤقت للوحدة النمطية الداخلية. خطاف `resolve` مسؤول عن إرجاع كائن `importAttributes` إذا كان يجب تخزين الوحدة النمطية مؤقتًا بسمات مختلفة عما كانت موجودة في التعليمات البرمجية المصدر.

الخاصية `conditions` في `context` عبارة عن مصفوفة من الشروط التي ستستخدم لمطابقة [شروط تصدير الحزمة](/ar/nodejs/api/packages#conditional-exports) لطلب الحل هذا. يمكن استخدامها للبحث عن تعيينات شرطية في مكان آخر أو لتعديل القائمة عند استدعاء منطق الحل الافتراضي.

توجد دائمًا [شروط تصدير الحزمة](/ar/nodejs/api/packages#conditional-exports) الحالية في مصفوفة `context.conditions` التي تم تمريرها إلى الخطاف. لضمان *سلوك حل محدد الوحدة النمطية الافتراضي لـ Node.js* عند استدعاء `defaultResolve`، يجب أن تتضمن مصفوفة `context.conditions` التي تم تمريرها إليه *جميع* عناصر مصفوفة `context.conditions` التي تم تمريرها في الأصل إلى خطاف `resolve`.

```js [ESM]
// الإصدار غير المتزامن المقبول بواسطة module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // بعض الشروط.
    // بالنسبة لبعض المحددات أو كلها، قم ببعض المنطق المخصص للحل.
    // قم دائمًا بإرجاع كائن بالشكل {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // شرط آخر.
    // عند استدعاء `defaultResolve`، يمكن تعديل الوسائط. في هذه الحالة
    // تتم إضافة قيمة أخرى لمطابقة الصادرات الشرطية.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // قم بتأجيل إلى الخطاف التالي في السلسلة، والذي سيكون
  // الحل الافتراضي لـ Node.js إذا كان هذا هو آخر محمل محدد من قبل المستخدم.
  return nextResolve(specifier);
}
```
```js [ESM]
// الإصدار المتزامن المقبول بواسطة module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // مشابه لـ resolve() غير المتزامن أعلاه، نظرًا لأن هذا الإصدار لا يحتوي على
  // أي منطق غير متزامن.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | إضافة دعم للإصدار المتزامن وفي سلسلة العمليات. |
| v20.6.0 | إضافة دعم لـ `source` بتنسيق `commonjs`. |
| v18.6.0, v16.17.0 | إضافة دعم لربط خطافات التحميل. يجب على كل خطاف إما استدعاء `nextLoad()` أو تضمين خاصية `shortCircuit` مضبوطة على `true` في إرجاعه. |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).2 - مرشح الإصدار (إصدار غير متزامن) الاستقرار: 1.1 - تطوير نشط (إصدار متزامن)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان URL الذي تم إرجاعه بواسطة سلسلة `resolve`
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) شروط التصدير لملف `package.json` ذي الصلة
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) التنسيق المقدم اختياريًا بواسطة سلسلة خطاف `resolve`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) خطاف `load` اللاحق في السلسلة، أو خطاف `load` الافتراضي لـ Node.js بعد آخر خطاف `load` مقدم من المستخدم
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) يأخذ الإصدار غير المتزامن إما كائنًا يحتوي على الخصائص التالية، أو `Promise` سيتم حله إلى مثل هذا الكائن. يقبل الإصدار المتزامن فقط كائنًا يتم إرجاعه بشكل متزامن.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إشارة إلى أن هذا الخطاف يعتزم إنهاء سلسلة خطافات `load`. **افتراضي:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) مصدر Node.js لتقييمه


يوفر خطاف `load` طريقة لتحديد طريقة مخصصة لتحديد كيفية تفسير عنوان URL واسترجاعه وتحليله. وهو مسؤول أيضًا عن التحقق من صحة سمات الاستيراد.

يجب أن تكون القيمة النهائية لـ `format` واحدة مما يلي:

| `format` | الوصف | الأنواع المقبولة لـ `source` التي تم إرجاعها بواسطة `load` |
| --- | --- | --- |
| `'builtin'` | تحميل وحدة Node.js مدمجة | غير قابل للتطبيق |
| `'commonjs'` | تحميل وحدة Node.js CommonJS | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | تحميل ملف JSON | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | تحميل وحدة ES | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | تحميل وحدة WebAssembly | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
يتم تجاهل قيمة `source` للنوع `'builtin'` لأنه لا يمكن حاليًا استبدال قيمة وحدة Node.js (أساسية) مدمجة.


##### تحذير في خطاف `load` غير المتزامن {#caveat-in-the-asynchronous-load-hook}

عند استخدام خطاف `load` غير المتزامن، فإن حذف أو توفير `source` لـ `'commonjs'` له تأثيرات مختلفة جدًا:

- عند توفير `source`، سيتم معالجة جميع استدعاءات `require` من هذه الوحدة بواسطة محمل ESM مع خطافات `resolve` و `load` المسجلة؛ سيتم معالجة جميع استدعاءات `require.resolve` من هذه الوحدة بواسطة محمل ESM مع خطافات `resolve` المسجلة؛ ستكون مجموعة فرعية فقط من واجهة برمجة تطبيقات CommonJS متاحة (على سبيل المثال، لا يوجد `require.extensions`، ولا يوجد `require.cache`، ولا يوجد `require.resolve.paths`) ولن يتم تطبيق التصحيح المؤقت على محمل وحدة CommonJS.
- إذا كان `source` غير معرف أو `null`، فسيتم التعامل معه بواسطة محمل وحدة CommonJS ولن تمر استدعاءات `require`/`require.resolve` عبر الخطافات المسجلة. هذا السلوك لـ `source` القيمة الفارغة مؤقت - في المستقبل، لن يتم دعم `source` القيمة الفارغة.

لا تنطبق هذه التحذيرات على خطاف `load` المتزامن، وفي هذه الحالة تكون المجموعة الكاملة من واجهات برمجة تطبيقات CommonJS متاحة لوحدات CommonJS المخصصة، و `require`/`require.resolve` تمر دائمًا عبر الخطافات المسجلة.

يقوم تطبيق `load` غير المتزامن الداخلي لـ Node.js، وهو قيمة `next` للخطاف الأخير في سلسلة `load`، بإرجاع `null` لـ `source` عندما يكون `format` هو `'commonjs'` للتوافق مع الإصدارات السابقة. إليك مثال على خطاف من شأنه أن يختار استخدام السلوك غير الافتراضي:

```js [ESM]
import { readFile } from 'node:fs/promises';

// Asynchronous version accepted by module.register(). This fix is not needed
// for the synchronous version accepted by module.registerSync().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
لا ينطبق هذا أيضًا على خطاف `load` المتزامن، وفي هذه الحالة يحتوي `source` الذي تم إرجاعه على رمز المصدر الذي تم تحميله بواسطة الخطاف التالي، بغض النظر عن تنسيق الوحدة.

- كائن [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) المحدد هو [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- كائن [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) المحدد هو [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

إذا لم تكن قيمة المصدر لتنسيق قائم على النص (أي `'json'` و `'module'`) سلسلة، فسيتم تحويلها إلى سلسلة باستخدام [`util.TextDecoder`](/ar/nodejs/api/util#class-utiltextdecoder).

يوفر خطاف `load` طريقة لتحديد طريقة مخصصة لاسترداد رمز المصدر لعنوان URL الذي تم حله. سيسمح هذا للمحمل بتجنب قراءة الملفات من القرص. يمكن استخدامه أيضًا لتعيين تنسيق غير معترف به إلى تنسيق مدعوم، على سبيل المثال `yaml` إلى `module`.

```js [ESM]
// Asynchronous version accepted by module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Some condition
    /*
      For some or all URLs, do some custom logic for retrieving the source.
      Always return an object of the form {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Defer to the next hook in the chain.
  return nextLoad(url);
}
```
```js [ESM]
// Synchronous version accepted by module.registerHooks().
function load(url, context, nextLoad) {
  // Similar to the asynchronous load() above, since that one does not have
  // any asynchronous logic.
}
```
في سيناريو أكثر تقدمًا، يمكن استخدام هذا أيضًا لتحويل مصدر غير مدعوم إلى مصدر مدعوم (انظر [أمثلة](/ar/nodejs/api/module#examples) أدناه).


### أمثلة {#examples}

يمكن استخدام خطافات تخصيص الوحدة المختلفة معًا لإنجاز تخصيصات واسعة النطاق لسلوكيات تحميل وتقييم كود Node.js.

#### الاستيراد من HTTPS {#import-from-https}

يقوم الخطاف أدناه بتسجيل الخطافات لتمكين الدعم الأولي لمثل هذه المحددات. على الرغم من أن هذا قد يبدو تحسنًا كبيرًا في وظائف Node.js الأساسية، إلا أن هناك عيوبًا كبيرة في استخدام هذه الخطافات فعليًا: الأداء أبطأ بكثير من تحميل الملفات من القرص، ولا يوجد تخزين مؤقت، ولا يوجد أمان.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // لكي يتم تحميل JavaScript عبر الشبكة، نحتاج إلى جلبها
  // وإعادتها.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // يفترض هذا المثال أن جميع JavaScript المقدمة عبر الشبكة عبارة عن وحدة ES
          // كود.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // دع Node.js يتعامل مع جميع عناوين URL الأخرى.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
مع وحدة الخطافات السابقة، فإن تشغيل `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` يطبع الإصدار الحالي من CoffeeScript لكل وحدة في عنوان URL في `main.mjs`.

#### التحويل البرمجي {#transpilation}

يمكن تحويل المصادر الموجودة بتنسيقات لا تفهمها Node.js إلى JavaScript باستخدام [`load` hook](/ar/nodejs/api/module#loadurl-context-nextload).

هذا أقل أداءً من تحويل ملفات المصدر برمجياً قبل تشغيل Node.js؛ يجب استخدام خطافات المحول البرمجي فقط لأغراض التطوير والاختبار.


##### نسخة غير متزامنة {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // يمكن أن تكون ملفات CoffeeScript إما CommonJS أو وحدات ES، لذلك نريد أن
    // تتعامل Node.js مع أي ملف CoffeeScript بنفس طريقة تعاملها مع ملف .js في
    // نفس الموقع. لتحديد كيف ستفسر Node.js ملف .js عشوائيًا، ابحث في نظام
    // الملفات عن أقرب ملف package.json أبوي واقرأ الحقل "type" الخاص به.
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // يقوم هذا الخطاف بتحويل كود مصدر CoffeeScript إلى كود مصدر JavaScript
    // لجميع ملفات CoffeeScript المستوردة.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // دع Node.js يتعامل مع جميع عناوين URL الأخرى.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` هو فقط مسار ملف أثناء التكرار الأول عند تمرير عنوان url الذي تم حله
  // من الخطاف load()
  // سيحتوي مسار الملف الفعلي من load() على امتداد ملف كما هو مطلوب
  // حسب المواصفة
  // سيتحقق هذا التحقق البسيط من صحة ما إذا كانت `url` تحتوي على امتداد ملف
  // لمعظم المشاريع ولكنه لا يغطي بعض الحالات الشاذة (مثل
  // الملفات التي لا تحتوي على امتداد أو عنوان url ينتهي بمسافة لاحقة)
  const isFilePath = !!extname(url);
  // إذا كان مسار ملف، فاحصل على الدليل الموجود فيه
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // قم بتركيب مسار ملف إلى package.json في نفس الدليل،
  // والذي قد يكون موجودًا أو غير موجود
  const packagePath = resolvePath(dir, 'package.json');
  // حاول قراءة package.json الذي قد يكون غير موجود
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // إذا كان package.json موجودًا ويحتوي على حقل `type` بقيمة، فها هو
  if (type) return type;
  // وإلا، (إذا لم يكن في الجذر) فاستمر في فحص الدليل التالي لأعلى
  // إذا كان في الجذر، فتوقف وأرجع false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### النسخة المتزامنة {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### تشغيل الخطافات {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
مع وحدات الخطافات السابقة، تشغيل `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` أو `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` يتسبب في تحويل `main.coffee` إلى JavaScript بعد تحميل الكود المصدري الخاص به من القرص ولكن قبل تنفيذه بواسطة Node.js؛ وهكذا بالنسبة لأي ملفات `.coffee` أو `.litcoffee` أو `.coffee.md` مشار إليها عبر عبارات `import` لأي ملف تم تحميله.


#### خرائط الاستيراد {#import-maps}

عرّفت الأمثلة السابقة وظائف `load`. هذا مثال على وظيفة `resolve`. يقوم هذا المرفق بقراءة ملف `import-map.json` الذي يحدد المعرفات التي يجب تجاوزها إلى عناوين URL أخرى (هذا تنفيذ مبسط للغاية لمجموعة فرعية صغيرة من مواصفات "خرائط الاستيراد").

##### الإصدار غير المتزامن {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### الإصدار المتزامن {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### استخدام المرفقات {#using-the-hooks}

مع هذه الملفات:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
تشغيل `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` أو `node --import ./import-map-sync-hooks.js main.js` يجب أن يطبع `some module!`.

## دعم الخريطة المصدر v3 {#source-map-v3-support}

**أضيف في: v13.7.0, v12.17.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

مساعدون للتفاعل مع ذاكرة التخزين المؤقت للخريطة المصدر. يتم ملء ذاكرة التخزين المؤقت هذه عند تمكين تحليل الخريطة المصدر والعثور على [توجيهات تضمين الخريطة المصدر](https://sourcemaps.info/spec#h.lmz475t4mvbx) في تذييل الوحدة.

لتمكين تحليل الخريطة المصدر، يجب تشغيل Node.js بالعلامة [`--enable-source-maps`](/ar/nodejs/api/cli#--enable-source-maps)، أو مع تمكين تغطية التعليمات البرمجية عن طريق تعيين [`NODE_V8_COVERAGE=dir`](/ar/nodejs/api/cli#node_v8_coveragedir).



::: code-group
```js [ESM]
// module.mjs
// في وحدة ECMAScript
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// في وحدة CommonJS
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**تمت الإضافة في: v13.7.0، v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<module.SourceMap\>](/ar/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) يُرجع `module.SourceMap` إذا تم العثور على خريطة مصدر، و `undefined` بخلاف ذلك.

`path` هو المسار المُحلل للملف الذي يجب جلب خريطة المصدر المقابلة له.

### الفئة: `module.SourceMap` {#class-modulesourcemap}

**تمت الإضافة في: v13.7.0، v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ينشئ مثيلاً جديدًا من `sourceMap`.

`payload` هو كائن بمفاتيح تطابق [تنسيق خريطة المصدر v3](https://sourcemaps.info/spec#h.mofvlxcwqzej):

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` هي مصفوفة اختيارية لطول كل سطر في الكود الذي تم إنشاؤه.

#### `sourceMap.payload` {#sourcemappayload}

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Getter للحمولة المستخدمة لإنشاء مثيل [`SourceMap`](/ar/nodejs/api/module#class-modulesourcemap).


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة رقم السطر المفهرسة بالصفر في المصدر المُنشأ
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة رقم العمود المفهرسة بالصفر في المصدر المُنشأ
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

بالنظر إلى إزاحة السطر وإزاحة العمود في ملف المصدر المُنشأ، تُرجع كائنًا يمثل نطاق SourceMap في الملف الأصلي إذا تم العثور عليه، أو كائنًا فارغًا إذا لم يتم العثور عليه.

يحتوي الكائن المُرجع على المفاتيح التالية:

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة السطر لبداية النطاق في المصدر المُنشأ
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة العمود لبداية النطاق في المصدر المُنشأ
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم ملف المصدر الأصلي، كما هو مُبلغ عنه في SourceMap
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة السطر لبداية النطاق في المصدر الأصلي
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) إزاحة العمود لبداية النطاق في المصدر الأصلي
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تمثل القيمة المرجعة النطاق الخام كما يظهر في SourceMap، بناءً على الإزاحات المفهرسة بالصفر، *وليس* أرقام الأسطر والأعمدة المفهرسة بالواحد كما تظهر في رسائل الخطأ وكائنات CallSite.

للحصول على أرقام الأسطر والأعمدة المفهرسة بالواحد المقابلة من lineNumber و columnNumber كما يتم الإبلاغ عنها بواسطة مكدسات الأخطاء وكائنات CallSite، استخدم `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم السطر ذو الفهرس 1 لموقع الاستدعاء في المصدر المُنشأ
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم العمود ذو الفهرس 1 لموقع الاستدعاء في المصدر المُنشأ
- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

بالنظر إلى `lineNumber` و `columnNumber` بفهرس 1 من موقع استدعاء في المصدر المُنشأ، ابحث عن موقع استدعاء مماثل في المصدر الأصلي.

إذا لم يتم العثور على `lineNumber` و `columnNumber` المقدمين في أي خريطة مصدر، فسيتم إرجاع كائن فارغ. بخلاف ذلك، يحتوي الكائن الذي تم إرجاعه على المفاتيح التالية:

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) اسم النطاق في خريطة المصدر، إذا تم توفيره
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم ملف المصدر الأصلي، كما هو مُبلغ عنه في SourceMap
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم السطر ذو الفهرس 1 لموقع الاستدعاء المطابق في المصدر الأصلي
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم العمود ذو الفهرس 1 لموقع الاستدعاء المطابق في المصدر الأصلي

