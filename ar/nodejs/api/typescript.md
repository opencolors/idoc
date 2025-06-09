---
title: دعم TypeScript في Node.js
description: تعلم كيفية استخدام TypeScript مع Node.js، بما في ذلك التثبيت، والتكوين، وأفضل الممارسات لدمج TypeScript في مشاريعك باستخدام Node.js.
head:
  - - meta
    - name: og:title
      content: دعم TypeScript في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية استخدام TypeScript مع Node.js، بما في ذلك التثبيت، والتكوين، وأفضل الممارسات لدمج TypeScript في مشاريعك باستخدام Node.js.
  - - meta
    - name: twitter:title
      content: دعم TypeScript في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية استخدام TypeScript مع Node.js، بما في ذلك التثبيت، والتكوين، وأفضل الممارسات لدمج TypeScript في مشاريعك باستخدام Node.js.
---


# الوحدات: TypeScript {#modules-typescript}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v22.7.0 | تمت إضافة علامة `--experimental-transform-types`. |
:::

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

## التفعيل {#enabling}

هناك طريقتان لتمكين دعم TypeScript في وقت التشغيل في Node.js:

## دعم كامل لـ TypeScript {#full-typescript-support}

لاستخدام TypeScript مع دعم كامل لجميع ميزات TypeScript، بما في ذلك `tsconfig.json`، يمكنك استخدام حزمة تابعة لجهة خارجية. تستخدم هذه التعليمات [`tsx`](https://tsx.is/) كمثال ولكن هناك العديد من المكتبات المماثلة الأخرى المتاحة.

## تجريد الأنواع {#type-stripping}

**تمت الإضافة في: v22.6.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط
:::

تمكن العلامة [`--experimental-strip-types`](/ar/nodejs/api/cli#--experimental-strip-types) Node.js من تشغيل ملفات TypeScript. بشكل افتراضي، ستنفذ Node.js فقط الملفات التي لا تحتوي على ميزات TypeScript التي تتطلب التحويل، مثل التعدادات أو مساحات الأسماء. ستقوم Node.js باستبدال تعليقات توضيحية للأنواع المضمنة بمسافة بيضاء، ولا يتم إجراء أي فحص للأنواع. لتمكين تحويل هذه الميزات، استخدم العلامة [`--experimental-transform-types`](/ar/nodejs/api/cli#--experimental-transform-types). ميزات TypeScript التي تعتمد على الإعدادات داخل `tsconfig.json`، مثل المسارات أو تحويل بناء JavaScript الأحدث إلى معايير أقدم، غير مدعومة عن قصد. للحصول على دعم كامل لـ TypeScript، انظر [دعم كامل لـ TypeScript](/ar/nodejs/api/typescript#full-typescript-support).

تم تصميم ميزة تجريد الأنواع لتكون خفيفة الوزن. من خلال عدم دعم بناء الجملة التي تتطلب إنشاء كود JavaScript عن قصد، واستبدال الأنواع المضمنة بمسافة بيضاء، يمكن لـ Node.js تشغيل كود TypeScript دون الحاجة إلى خرائط المصدر.

يعمل تجريد الأنواع مع معظم إصدارات TypeScript ولكن نوصي بالإصدار 5.7 أو أحدث مع إعدادات `tsconfig.json` التالية:

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### تحديد نظام الوحدة {#determining-module-system}

يدعم Node.js كلاً من [CommonJS](/ar/nodejs/api/modules) و [ES Modules](/ar/nodejs/api/esm) في ملفات TypeScript. لن يقوم Node.js بالتحويل من نظام وحدة إلى آخر؛ إذا كنت تريد تشغيل التعليمات البرمجية الخاصة بك كوحدة ES، فيجب عليك استخدام بناء الجملة `import` و `export`، وإذا كنت تريد تشغيل التعليمات البرمجية الخاصة بك كوحدة CommonJS، فيجب عليك استخدام بناء الجملة `require` و `module.exports`.

- سيتم تحديد نظام الوحدة للملفات `.ts` [بنفس طريقة الملفات `.js`.](/ar/nodejs/api/packages#determining-module-system) لاستخدام بناء الجملة `import` و `export`، أضف `"type": "module"` إلى أقرب ملف `package.json` أب.
- سيتم دائمًا تشغيل الملفات `.mts` كوحدات ES، على غرار الملفات `.mjs`.
- سيتم دائمًا تشغيل الملفات `.cts` كوحدات CommonJS، على غرار الملفات `.cjs`.
- الملفات `.tsx` غير مدعومة.

كما هو الحال في ملفات JavaScript، [ملحقات الملفات إلزامية](/ar/nodejs/api/esm#mandatory-file-extensions) في عبارات `import` وتعبيرات `import()`: `import './file.ts'`، وليس `import './file'`. بسبب التوافق مع الإصدارات السابقة، فإن ملحقات الملفات إلزامية أيضًا في استدعاءات `require()`: `require('./file.ts')`، وليس `require('./file')`، على غرار كيفية إلزامية الملحق `.cjs` في استدعاءات `require` في ملفات CommonJS.

سيسمح خيار `tsconfig.json` المسمى `allowImportingTsExtensions` لمترجم TypeScript `tsc` بالتحقق من أنواع الملفات التي تحتوي على محددات `import` التي تتضمن الملحق `.ts`.

### ميزات TypeScript {#typescript-features}

نظرًا لأن Node.js يقوم فقط بإزالة الأنواع المضمنة، فإن أي ميزات TypeScript تتضمن *استبدال* بناء جملة TypeScript ببناء جملة JavaScript جديد ستؤدي إلى حدوث خطأ، ما لم يتم تمرير العلامة [`--experimental-transform-types`](/ar/nodejs/api/cli#--experimental-transform-types).

أبرز الميزات التي تتطلب التحويل هي:

- `Enum`
- `namespaces`
- `legacy module`
- خصائص المعلمات

نظرًا لأن Decorators هي حاليًا [اقتراح TC39 في المرحلة 3](https://github.com/tc39/proposal-decorators) وسيتم دعمها قريبًا بواسطة محرك JavaScript، فإنه لا يتم تحويلها وستؤدي إلى خطأ في المحلل اللغوي. هذا قيد مؤقت وسيتم حله في المستقبل.

بالإضافة إلى ذلك، لا يقرأ Node.js ملفات `tsconfig.json` ولا يدعم الميزات التي تعتمد على الإعدادات الموجودة داخل `tsconfig.json`، مثل المسارات أو تحويل بناء جملة JavaScript الأحدث إلى معايير أقدم.


### استيراد الأنواع بدون الكلمة المفتاحية `type` {#importing-types-without-type-keyword}

نظرًا لطبيعة إزالة الأنواع، فإن الكلمة المفتاحية `type` ضرورية لإزالة استيراد الأنواع بشكل صحيح. بدون الكلمة المفتاحية `type`، ستعامل Node.js الاستيراد على أنه استيراد قيمة، مما سيؤدي إلى خطأ وقت التشغيل. يمكن استخدام خيار tsconfig [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) لمطابقة هذا السلوك.

هذا المثال سيعمل بشكل صحيح:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
سيؤدي هذا إلى خطأ وقت التشغيل:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### نماذج الإدخال غير الملفية {#non-file-forms-of-input}

يمكن تمكين إزالة الأنواع لـ `--eval`. سيتم تحديد نظام الوحدات بواسطة `--input-type`، كما هو الحال بالنسبة لـ JavaScript.

بناء TypeScript غير مدعوم في REPL، إدخال STDIN، `--print`، `--check`، و `inspect`.

### خرائط المصدر {#source-maps}

نظرًا لأن الأنواع المضمنة يتم استبدالها بمسافات بيضاء، فإن خرائط المصدر غير ضرورية لأرقام الأسطر الصحيحة في تتبعات المكدس؛ ولا تولدها Node.js. عند تمكين [`--experimental-transform-types`](/ar/nodejs/api/cli#--experimental-transform-types)، يتم تمكين خرائط المصدر افتراضيًا.

### إزالة الأنواع في التبعيات {#type-stripping-in-dependencies}

لتثبيط مؤلفي الحزم من نشر حزم مكتوبة بلغة TypeScript، سترفض Node.js افتراضيًا التعامل مع ملفات TypeScript داخل مجلدات تحت مسار `node_modules`.

### مسارات الأسماء المستعارة {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) لن يتم تحويلها وبالتالي ستنتج خطأ. أقرب ميزة متاحة هي [استيراد المسارات الفرعية](/ar/nodejs/api/packages#subpath-imports) مع القيود التي تحتاج إلى البدء بـ `#`.

