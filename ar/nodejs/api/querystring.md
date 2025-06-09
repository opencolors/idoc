---
title: توثيق Node.js - Query String
description: يقدم هذا القسم من توثيق Node.js تفاصيل وحدة querystring، التي توفر أدوات لتحليل وتنسيق سلاسل استعلام URL. تشمل الأساليب الخاصة بالهروب وفك الهروب للأحرف الخاصة، ومعالجة الكائنات المتداخلة، وإدارة تسلسل سلاسل الاستعلام.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Query String | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يقدم هذا القسم من توثيق Node.js تفاصيل وحدة querystring، التي توفر أدوات لتحليل وتنسيق سلاسل استعلام URL. تشمل الأساليب الخاصة بالهروب وفك الهروب للأحرف الخاصة، ومعالجة الكائنات المتداخلة، وإدارة تسلسل سلاسل الاستعلام.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Query String | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يقدم هذا القسم من توثيق Node.js تفاصيل وحدة querystring، التي توفر أدوات لتحليل وتنسيق سلاسل استعلام URL. تشمل الأساليب الخاصة بالهروب وفك الهروب للأحرف الخاصة، ومعالجة الكائنات المتداخلة، وإدارة تسلسل سلاسل الاستعلام.
---


# سلسلة الاستعلام {#query-string}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

توفر وحدة `node:querystring` أدوات لتحليل وتنسيق سلاسل استعلام URL. يمكن الوصول إليها باستخدام:

```js [ESM]
const querystring = require('node:querystring');
```
تعتبر `querystring` أكثر أداءً من [\<URLSearchParams\>](/ar/nodejs/api/url#class-urlsearchparams) ولكنها ليست واجهة برمجة تطبيقات قياسية. استخدم [\<URLSearchParams\>](/ar/nodejs/api/url#class-urlsearchparams) عندما لا يكون الأداء حاسمًا أو عندما تكون التوافقية مع كود المتصفح مرغوبة.

## `querystring.decode()` {#querystringdecode}

**تمت الإضافة في: الإصدار 0.1.99**

الدالة `querystring.decode()` هي اسم مستعار لـ `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**تمت الإضافة في: الإصدار 0.1.99**

الدالة `querystring.encode()` هي اسم مستعار لـ `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**تمت الإضافة في: الإصدار 0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `querystring.escape()` بتشفير النسبة المئوية لعنوان URL على `str` المحدد بطريقة محسّنة للمتطلبات المحددة لسلاسل استعلام URL.

يتم استخدام الطريقة `querystring.escape()` بواسطة `querystring.stringify()` ولا يُتوقع عمومًا استخدامها مباشرةً. يتم تصديرها بشكل أساسي للسماح لكود التطبيق بتوفير تنفيذ بديل لتشفير النسبة المئوية إذا لزم الأمر عن طريق تعيين `querystring.escape` إلى دالة بديلة.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 8.0.0 | يتم الآن تحليل إدخالات فارغة متعددة بشكل صحيح (على سبيل المثال `&=&=`). |
| الإصدار 6.0.0 | لم يعد الكائن المرجع يرث من `Object.prototype`. |
| الإصداران 6.0.0، 4.2.4 | قد يكون للمعامل `eq` الآن طول أكبر من `1`. |
| الإصدار 0.1.25 | تمت الإضافة في: الإصدار 0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة استعلام URL المراد تحليلها
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) السلسلة الفرعية المستخدمة لتحديد أزواج المفتاح والقيمة في سلسلة الاستعلام. **الافتراضي:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). السلسلة الفرعية المستخدمة لتحديد المفاتيح والقيم في سلسلة الاستعلام. **الافتراضي:** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) الدالة المستخدمة عند فك تشفير الأحرف المشفرة بالنسبة المئوية في سلسلة الاستعلام. **الافتراضي:** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد الحد الأقصى لعدد المفاتيح المراد تحليلها. حدد `0` لإزالة قيود عدد المفاتيح. **الافتراضي:** `1000`.
  
 

تقوم الطريقة `querystring.parse()` بتحليل سلسلة استعلام URL (`str`) إلى مجموعة من أزواج المفتاح والقيمة.

على سبيل المثال، يتم تحليل سلسلة الاستعلام `'foo=bar&abc=xyz&abc=123'` إلى:

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
الكائن المرجع بواسطة الطريقة `querystring.parse()` *لا* يرث بشكل نموذجي من JavaScript `Object`. هذا يعني أن طرق `Object` النموذجية مثل `obj.toString()` و`obj.hasOwnProperty()` وغيرها غير معرّفة و*لن تعمل*.

بشكل افتراضي، سيفترض أن الأحرف المشفرة بالنسبة المئوية داخل سلسلة الاستعلام تستخدم ترميز UTF-8. إذا تم استخدام ترميز أحرف بديل، فسيلزم تحديد خيار `decodeURIComponent` بديل:

```js [ESM]
// بافتراض وجود الدالة gbkDecodeURIComponent بالفعل...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**أُضيف في: الإصدار v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): الكائن المراد تحويله إلى سلسلة استعلام URL.
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): السلسلة الفرعية المستخدمة لفصل أزواج المفتاح والقيمة في سلسلة الاستعلام. **الافتراضي:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type): السلسلة الفرعية المستخدمة لفصل المفاتيح والقيم في سلسلة الاستعلام. **الافتراضي:** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function): الدالة المستخدمة عند تحويل الأحرف غير الآمنة في URL إلى ترميز النسبة المئوية في سلسلة الاستعلام. **الافتراضي:** `querystring.escape()`.

تقوم الدالة `querystring.stringify()` بإنتاج سلسلة استعلام URL من `obj` مُعطى عن طريق التكرار خلال "الخصائص الخاصة" للكائن.

تقوم بتحويل الأنواع التالية من القيم التي تم تمريرها في `obj`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type). يجب أن تكون القيم الرقمية محدودة. سيتم تحويل أي قيم إدخال أخرى إلى سلاسل فارغة.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Returns 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Returns 'foo:bar;baz:qux'
```
بشكل افتراضي، سيتم ترميز الأحرف التي تتطلب ترميز النسبة المئوية داخل سلسلة الاستعلام كـ UTF-8. إذا كان الترميز البديل مطلوبًا، فيجب تحديد خيار `encodeURIComponent` بديل:

```js [ESM]
// بافتراض وجود الدالة gbkEncodeURIComponent بالفعل،

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**أضيف في: الإصدار v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الطريقة `querystring.unescape()` بفك ترميز أحرف URL المشفرة بالنسبة المئوية على `str` المحدد.

تُستخدم الطريقة `querystring.unescape()` بواسطة `querystring.parse()` وعمومًا لا يُتوقع استخدامها مباشرةً. يتم تصديرها بشكل أساسي للسماح لرمز التطبيق بتوفير تطبيق فك ترميز بديل إذا لزم الأمر عن طريق تعيين `querystring.unescape` إلى دالة بديلة.

بشكل افتراضي، ستحاول الطريقة `querystring.unescape()` استخدام طريقة `decodeURIComponent()` المضمنة في JavaScript لفك الترميز. إذا فشل ذلك، فسيتم استخدام مكافئ أكثر أمانًا لا يطرح أخطاء في عناوين URL المشوهة.

