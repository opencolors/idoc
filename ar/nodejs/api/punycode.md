---
title: توثيق Node.js - Punycode
description: توفر هذه الصفحة توثيقًا مفصلًا لوحدة Punycode في Node.js، التي تُستخدم لترميز وفك ترميز أسماء النطاقات الدولية.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر هذه الصفحة توثيقًا مفصلًا لوحدة Punycode في Node.js، التي تُستخدم لترميز وفك ترميز أسماء النطاقات الدولية.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر هذه الصفحة توثيقًا مفصلًا لوحدة Punycode في Node.js، التي تُستخدم لترميز وفك ترميز أسماء النطاقات الدولية.
---


# Punycode {#punycode}

**مهمل منذ: الإصدار v7.0.0**

::: danger [ثابت: 0 - مهمل]
[ثابت: 0](/ar/nodejs/api/documentation#stability-index) [ثبات: 0](/ar/nodejs/api/documentation#stability-index) - مهمل
:::

**كود المصدر:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**نسخة وحدة punycode المجمعة في Node.js مهملة.** في إصدار رئيسي مستقبلي من Node.js ستتم إزالة هذه الوحدة. يجب على المستخدمين الذين يعتمدون حاليًا على وحدة `punycode` التبديل إلى استخدام وحدة [Punycode.js](https://github.com/bestiejs/punycode.js) المقدمة من طرف المستخدم بدلاً من ذلك. لترميز URL المستند إلى punycode، انظر [`url.domainToASCII`](/ar/nodejs/api/url#urldomaintoasciidomain) أو بشكل عام [WHATWG URL API](/ar/nodejs/api/url#the-whatwg-url-api).

وحدة `punycode` هي نسخة مجمعة من وحدة [Punycode.js](https://github.com/bestiejs/punycode.js). يمكن الوصول إليها باستخدام:

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) هو نظام ترميز أحرف معرف بواسطة RFC 3492 وهو مخصص بشكل أساسي للاستخدام في أسماء النطاقات الدولية. نظرًا لأن أسماء المضيفين في عناوين URL تقتصر على أحرف ASCII فقط، يجب تحويل أسماء النطاقات التي تحتوي على أحرف غير ASCII إلى ASCII باستخدام نظام Punycode. على سبيل المثال، الحرف الياباني الذي يُترجم إلى الكلمة الإنجليزية، `'example'` هو `'例'`. اسم النطاق الدولي `'例.com'` (المكافئ لـ `'example.com'`) ممثل بواسطة Punycode كسلسلة ASCII `'xn--fsq.com'`.

توفر وحدة `punycode` تطبيقًا بسيطًا لمعيار Punycode.

وحدة `punycode` هي تبعية تابعة لجهة خارجية تستخدمها Node.js ومتاحة للمطورين كراحة. يجب توجيه الإصلاحات أو التعديلات الأخرى للوحدة إلى مشروع [Punycode.js](https://github.com/bestiejs/punycode.js).

## `punycode.decode(string)` {#punycodedecodestring}

**أضيف في: الإصدار v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم طريقة `punycode.decode()` بتحويل سلسلة [Punycode](https://tools.ietf.org/html/rfc3492) المكونة من أحرف ASCII فقط إلى السلسلة المكافئة لنقاط رمز Unicode.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**أُضيف في: الإصدار v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `punycode.encode()` بتحويل سلسلة من نقاط الترميز Unicode إلى سلسلة [Punycode](https://tools.ietf.org/html/rfc3492) تحتوي على أحرف ASCII فقط.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**أُضيف في: الإصدار v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `punycode.toASCII()` بتحويل سلسلة Unicode تمثل اسم نطاق دولي (Internationalized Domain Name) إلى [Punycode](https://tools.ietf.org/html/rfc3492). سيتم تحويل الأجزاء غير ASCII فقط من اسم النطاق. استدعاء `punycode.toASCII()` على سلسلة تحتوي بالفعل على أحرف ASCII فقط لن يكون له أي تأثير.

```js [ESM]
// encode domain names
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**أُضيف في: الإصدار v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `punycode.toUnicode()` بتحويل سلسلة تمثل اسم نطاق يحتوي على أحرف مشفرة بـ [Punycode](https://tools.ietf.org/html/rfc3492) إلى Unicode. سيتم تحويل الأجزاء المشفرة بـ [Punycode](https://tools.ietf.org/html/rfc3492) فقط من اسم النطاق.

```js [ESM]
// decode domain names
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**أُضيف في: الإصدار v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**أُضيف في: الإصدار v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم الدالة `punycode.ucs2.decode()` بإرجاع مصفوفة تحتوي على قيم نقاط الترميز الرقمية لكل رمز Unicode في السلسلة.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// surrogate pair for U+1D306 tetragram for centre:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**تمت الإضافة في: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تقوم الطريقة `punycode.ucs2.encode()` بإرجاع سلسلة نصية بناءً على مصفوفة من قيم نقاط الترميز الرقمية.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**تمت الإضافة في: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع سلسلة نصية تحدد رقم الإصدار الحالي لـ [Punycode.js](https://github.com/bestiejs/punycode.js).

