---
title: توثيق وحدة Path في Node.js
description: توفر وحدة Path في Node.js أدوات للعمل مع مسارات الملفات والدلائل. تقدم أساليب للتعامل مع وتحويل مسارات الملفات بطريقة مستقلة عن النظام الأساسي، بما في ذلك تطبيع المسارات، ودمجها، وحلها، وتحليلها.
head:
  - - meta
    - name: og:title
      content: توثيق وحدة Path في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة Path في Node.js أدوات للعمل مع مسارات الملفات والدلائل. تقدم أساليب للتعامل مع وتحويل مسارات الملفات بطريقة مستقلة عن النظام الأساسي، بما في ذلك تطبيع المسارات، ودمجها، وحلها، وتحليلها.
  - - meta
    - name: twitter:title
      content: توثيق وحدة Path في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة Path في Node.js أدوات للعمل مع مسارات الملفات والدلائل. تقدم أساليب للتعامل مع وتحويل مسارات الملفات بطريقة مستقلة عن النظام الأساسي، بما في ذلك تطبيع المسارات، ودمجها، وحلها، وتحليلها.
---


# المسار {#path}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

توفر الوحدة النمطية `node:path` أدوات للعمل مع مسارات الملفات والمجلدات. يمكن الوصول إليها باستخدام:

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

يختلف التشغيل الافتراضي للوحدة النمطية `node:path` بناءً على نظام التشغيل الذي يتم تشغيل تطبيق Node.js عليه. على وجه التحديد، عند التشغيل على نظام تشغيل Windows، ستفترض الوحدة النمطية `node:path` أنه يتم استخدام مسارات نمط Windows.

لذا، قد يؤدي استخدام `path.basename()` إلى نتائج مختلفة على POSIX و Windows:

على POSIX:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Returns: 'C:\\temp\\myfile.html'
```
على Windows:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```
لتحقيق نتائج متسقة عند العمل مع مسارات ملفات Windows على أي نظام تشغيل، استخدم [`path.win32`](/ar/nodejs/api/path#pathwin32):

على POSIX و Windows:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```
لتحقيق نتائج متسقة عند العمل مع مسارات ملفات POSIX على أي نظام تشغيل، استخدم [`path.posix`](/ar/nodejs/api/path#pathposix):

على POSIX و Windows:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Returns: 'myfile.html'
```
في نظام Windows، يتبع Node.js مفهوم دليل العمل لكل محرك أقراص. يمكن ملاحظة هذا السلوك عند استخدام مسار محرك أقراص بدون خط مائل عكسي. على سبيل المثال، قد تُرجع `path.resolve('C:\\')` نتيجة مختلفة عن `path.resolve('C:')`. لمزيد من المعلومات، راجع [صفحة MSDN هذه](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | سيتم الآن طرح خطأ عند تمرير قيمة غير نصية كوسيطة `path`. |
| v0.1.25 | تمت الإضافة في: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) لاحقة اختيارية للإزالة
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع الطريقة `path.basename()` الجزء الأخير من `path`، على غرار أمر Unix `basename`. يتم تجاهل [فواصل دليل](/ar/nodejs/api/path#pathsep) في النهاية.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux'
```
على الرغم من أن نظام Windows عادةً ما يتعامل مع أسماء الملفات، بما في ذلك امتدادات الملفات، بطريقة غير حساسة لحالة الأحرف، إلا أن هذه الوظيفة لا تفعل ذلك. على سبيل المثال، يشير `C:\\foo.html` و `C:\\foo.HTML` إلى نفس الملف، ولكن `basename` يعامل الامتداد كسلسلة حساسة لحالة الأحرف:

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Returns: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Returns: 'foo.HTML'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن `path` سلسلة نصية أو إذا تم إعطاء `suffix` ولم يكن سلسلة نصية.


## `path.delimiter` {#pathdelimiter}

**أضيف في: الإصدار v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يوفر محدد المسار الخاص بالنظام الأساسي:

- `;` لنظام التشغيل Windows
- `:` لنظام التشغيل POSIX

على سبيل المثال، في نظام التشغيل POSIX:

```js [ESM]
console.log(process.env.PATH);
// طباعة: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// الإرجاع: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
في نظام التشغيل Windows:

```js [ESM]
console.log(process.env.PATH);
// طباعة: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// الإرجاع: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | سيؤدي تمرير قيمة ليست سلسلة نصية كـ `path` إلى حدوث خطأ الآن. |
| v0.1.16 | أضيف في: الإصدار v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `path.dirname()` بإرجاع اسم دليل `path`، على غرار أمر Unix `dirname`. يتم تجاهل فواصل الدليل اللاحقة، انظر [`path.sep`](/ar/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// الإرجاع: '/foo/bar/baz/asdf'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن `path` سلسلة نصية.

## `path.extname(path)` {#pathextnamepath}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v6.0.0 | سيؤدي تمرير قيمة ليست سلسلة نصية كـ `path` إلى حدوث خطأ الآن. |
| v0.1.25 | أضيف في: الإصدار v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `path.extname()` بإرجاع امتداد `path`، من آخر ظهور للحرف `.` (نقطة) إلى نهاية السلسلة في الجزء الأخير من `path`. إذا لم يكن هناك `.` في الجزء الأخير من `path`، أو إذا لم تكن هناك أحرف `.` بخلاف الحرف الأول من الاسم الأساسي لـ `path` (انظر `path.basename()`) ، يتم إرجاع سلسلة نصية فارغة.

```js [ESM]
path.extname('index.html');
// الإرجاع: '.html'

path.extname('index.coffee.md');
// الإرجاع: '.md'

path.extname('index.');
// الإرجاع: '.'

path.extname('index');
// الإرجاع: ''

path.extname('.index');
// الإرجاع: ''

path.extname('.index.md');
// الإرجاع: '.md'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن `path` سلسلة نصية.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.0.0 | ستتم إضافة النقطة إذا لم يتم تحديدها في `ext`. |
| v0.11.15 | تمت الإضافة في: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) أي كائن JavaScript يحتوي على الخصائص التالية:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `path.format()` بإرجاع سلسلة مسار من كائن. هذا هو عكس [`path.parse()`](/ar/nodejs/api/path#pathparsepath).

عند توفير خصائص لـ `pathObject` تذكر أن هناك تركيبات حيث تكون لخاصية ما الأولوية على أخرى:

- يتم تجاهل `pathObject.root` إذا تم توفير `pathObject.dir`
- يتم تجاهل `pathObject.ext` و `pathObject.name` إذا كان `pathObject.base` موجودًا

على سبيل المثال، في نظام POSIX:

```js [ESM]
// إذا تم توفير `dir` و `root` و `base`،
// سيتم إرجاع `${dir}${path.sep}${base}`. سيتم تجاهل `root`.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// الإرجاع: '/home/user/dir/file.txt'

// سيتم استخدام `root` إذا لم يتم تحديد `dir`.
// إذا تم توفير `root` فقط أو كان `dir` يساوي `root` فلن يتم تضمين فاصل النظام الأساسي. سيتم تجاهل `ext`.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// الإرجاع: '/file.txt'

// سيتم استخدام `name` + `ext` إذا لم يتم تحديد `base`.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// الإرجاع: '/file.txt'

// ستتم إضافة النقطة إذا لم يتم تحديدها في `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// الإرجاع: '/file.txt'
```
في نظام Windows:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// الإرجاع: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**أُضيف في: الإصدار 22.5.0، الإصدار 20.17.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المسار المراد مطابقته مع النمط العام.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) النمط العام المراد التحقق من المسار مقابله.
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان `path` متطابقًا مع `pattern` أم لا.

تحدد الطريقة `path.matchesGlob()` ما إذا كان `path` متطابقًا مع `pattern`.

على سبيل المثال:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا كان `path` أو `pattern` ليسا من نوع السلسلة.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**أُضيف في: الإصدار 0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- إرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تحدد الطريقة `path.isAbsolute()` ما إذا كان `path` مسارًا مطلقًا.

إذا كان `path` المحدد عبارة عن سلسلة ذات طول صفري، فسيتم إرجاع `false`.

على سبيل المثال، على نظام POSIX:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
على نظام Windows:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن `path` سلسلة.

## `path.join([...paths])` {#pathjoinpaths}

**أُضيف في: الإصدار 0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة من مقاطع المسار
- إرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `path.join()` بضم جميع مقاطع `path` المحددة معًا باستخدام فاصل خاص بالنظام الأساسي كعلامة فاصلة، ثم تقوم بتطبيع المسار الناتج.

يتم تجاهل مقاطع `path` ذات الطول الصفري. إذا كانت سلسلة المسار المضمومة عبارة عن سلسلة ذات طول صفري، فسيتم إرجاع `'.'`، مما يمثل دليل العمل الحالي.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// إرجاع: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// يطرح 'TypeError: يجب أن يكون المسار سلسلة. تم استقبال {}'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن أي من مقاطع المسار سلسلة.


## `path.normalize(path)` {#pathnormalizepath}

**أُضيف في: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- تُرجع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يقوم الأسلوب `path.normalize()` بتطبيع `path` المُعطى، وحل المقاطع `'..'` و `'.'`.

عند العثور على أحرف فصل مقاطع مسار متتالية ومتعددة (على سبيل المثال، `/` على POSIX و إما `\` أو `/` على Windows)، يتم استبدالها بمثيل واحد من فاصل مقطع المسار الخاص بالنظام الأساسي (`/` على POSIX و `\` على Windows). يتم الاحتفاظ بالفواصل اللاحقة.

إذا كان `path` سلسلة ذات طول صفري، فسيتم إرجاع `'.'`، مما يمثل دليل العمل الحالي.

على POSIX، لا تلتزم أنواع التطبيع التي تطبقها هذه الدالة بشكل صارم بمواصفات POSIX. على سبيل المثال، ستحل هذه الدالة خطين مائلين أماميين بشرطة مائلة واحدة كما لو كان مسارًا مطلقًا عاديًا، في حين أن بعض أنظمة POSIX تعطي معنى خاصًا للمسارات التي تبدأ بخطين مائلين أماميين بالضبط. وبالمثل، فإن البدائل الأخرى التي تجريها هذه الدالة، مثل إزالة مقاطع `..`، قد تغير الطريقة التي يحل بها النظام الأساسي المسار.

على سبيل المثال، على POSIX:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// تُرجع: '/foo/bar/baz/asdf'
```
على Windows:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// تُرجع: 'C:\\temp\\foo\\'
```
نظرًا لأن Windows يتعرف على فواصل مسار متعددة، فسيتم استبدال كلا الفاصلين بمثيلات من فاصل Windows المفضل (`\`):

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// تُرجع: 'C:\\temp\\foo\\bar'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن `path` سلسلة.

## `path.parse(path)` {#pathparsepath}

**أُضيف في: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- تُرجع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يقوم الأسلوب `path.parse()` بإرجاع كائن تمثل خصائصه العناصر الهامة لـ `path`. يتم تجاهل فواصل الدليل اللاحقة، انظر [`path.sep`](/ar/nodejs/api/path#pathsep).

سيكون للكائن الذي تم إرجاعه الخصائص التالية:

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

على سبيل المثال، على POSIX:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// تُرجع:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(يجب تجاهل جميع المسافات في السطر "". إنها مخصصة للتنسيق فقط.)
```
على Windows:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// تُرجع:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(يجب تجاهل جميع المسافات في السطر "". إنها مخصصة للتنسيق فقط.)
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن `path` سلسلة.


## `path.posix` {#pathposix}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v15.3.0 | تم عرضه كـ `require('path/posix')`. |
| v0.11.15 | تمت إضافته في: v0.11.15 |
:::

- [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يوفر الخاصية `path.posix` الوصول إلى تطبيقات POSIX الخاصة بطرق `path`.

يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('node:path').posix` أو `require('node:path/posix')`.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v6.8.0 | على نظام التشغيل Windows، يتم الآن تضمين الشرطات المائلة الأولية لمسارات UNC في القيمة المرجعة. |
| v0.5.0 | تمت إضافته في: v0.5.0 |
:::

- `from` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `path.relative()` بإرجاع المسار النسبي من `from` إلى `to` بناءً على دليل العمل الحالي. إذا كان `from` و `to` يحل كل منهما إلى نفس المسار (بعد استدعاء `path.resolve()` على كل منهما)، فسيتم إرجاع سلسلة نصية ذات طول صفري.

إذا تم تمرير سلسلة نصية ذات طول صفري كـ `from` أو `to`، فسيتم استخدام دليل العمل الحالي بدلاً من السلاسل النصية ذات الطول الصفري.

على سبيل المثال، على نظام POSIX:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// الإرجاع: '../../impl/bbb'
```
على نظام التشغيل Windows:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// الإرجاع: '..\\..\\impl\\bbb'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن أي من `from` أو `to` سلسلة نصية.

## `path.resolve([...paths])` {#pathresolvepaths}

**تمت إضافته في: v0.3.4**

- `...paths` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تسلسل من المسارات أو أجزاء المسار
- الإرجاع: [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `path.resolve()` بحل تسلسل من المسارات أو أجزاء المسار إلى مسار مطلق.

تتم معالجة التسلسل المحدد من المسارات من اليمين إلى اليسار، مع إضافة كل `path` لاحق حتى يتم إنشاء مسار مطلق. على سبيل المثال، بالنظر إلى تسلسل أجزاء المسار: `/foo`, `/bar`, `baz`، فإن استدعاء `path.resolve('/foo', '/bar', 'baz')` سيعيد `/bar/baz` لأن `'baz'` ليس مسارًا مطلقًا ولكن `'/bar' + '/' + 'baz'` كذلك.

إذا لم يتم إنشاء مسار مطلق بعد معالجة جميع أجزاء `path` المحددة، فسيتم استخدام دليل العمل الحالي.

يتم تطبيع المسار الناتج وإزالة الشرطات المائلة اللاحقة ما لم يتم حل المسار إلى الدليل الجذر.

يتم تجاهل أجزاء `path` ذات الطول الصفري.

إذا لم يتم تمرير أي أجزاء `path`، فستعيد `path.resolve()` المسار المطلق لدليل العمل الحالي.

```js [ESM]
path.resolve('/foo/bar', './baz');
// الإرجاع: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// الإرجاع: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// إذا كان دليل العمل الحالي هو /home/myself/node،
// فإن هذا يعيد '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
يتم طرح [`TypeError`](/ar/nodejs/api/errors#class-typeerror) إذا لم يكن أي من الوسائط سلسلة نصية.


## `path.sep` {#pathsep}

**أُضيف في: v0.7.9**

- [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يوفر فاصل مقاطع المسار الخاص بالنظام الأساسي:

- `\` في نظام Windows
- `/` في نظام POSIX

على سبيل المثال، في نظام POSIX:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// إرجاع: ['foo', 'bar', 'baz']
```
في نظام Windows:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// إرجاع: ['foo', 'bar', 'baz']
```
في نظام Windows، يتم قبول كل من الشرطة المائلة للأمام (`/`) والشرطة المائلة للخلف (`\`) كفواصل لمقاطع المسار؛ ومع ذلك، فإن طرق `path` تضيف فقط الشرطات المائلة للخلف (`\`).

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**أُضيف في: v9.0.0**

- `path` [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- الإرجاع: [\<سلسلة نصية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

في أنظمة Windows فقط، يُرجع [مسارًا مسبوقًا ببادئة مساحة الاسم](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) مكافئًا للمسار `path` المحدد. إذا لم يكن `path` سلسلة نصية، فسيتم إرجاع `path` دون تعديلات.

هذه الطريقة ذات مغزى فقط في أنظمة Windows. في أنظمة POSIX، تكون الطريقة غير فعالة وتُرجع دائمًا `path` دون تعديلات.

## `path.win32` {#pathwin32}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.3.0 | تم عرضه على أنه `require('path/win32')`. |
| v0.11.15 | أُضيف في: v0.11.15 |
:::

- [\<كائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

توفر الخاصية `path.win32` الوصول إلى عمليات التنفيذ الخاصة بنظام Windows لطرق `path`.

يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('node:path').win32` أو `require('node:path/win32')`.

