---
title: توثيق Node.js - DNS
description: يغطي هذا القسم من توثيق Node.js وحدة DNS (نظام أسماء النطاقات)، التي توفر وظائف حل أسماء الشبكة غير المتزامنة. تشمل الأساليب المستخدمة لحل أسماء النطاقات إلى عناوين IP، والبحث العكسي، واستعلامات سجلات DNS.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يغطي هذا القسم من توثيق Node.js وحدة DNS (نظام أسماء النطاقات)، التي توفر وظائف حل أسماء الشبكة غير المتزامنة. تشمل الأساليب المستخدمة لحل أسماء النطاقات إلى عناوين IP، والبحث العكسي، واستعلامات سجلات DNS.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يغطي هذا القسم من توثيق Node.js وحدة DNS (نظام أسماء النطاقات)، التي توفر وظائف حل أسماء الشبكة غير المتزامنة. تشمل الأساليب المستخدمة لحل أسماء النطاقات إلى عناوين IP، والبحث العكسي، واستعلامات سجلات DNS.
---


# DNS {#dns}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

تمكن وحدة `node:dns` من تحليل الأسماء. على سبيل المثال، استخدمها للبحث عن عناوين IP لأسماء المضيفين.

على الرغم من تسميتها باسم [نظام اسم النطاق (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System)، إلا أنها لا تستخدم دائمًا بروتوكول DNS لعمليات البحث. تستخدم [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) تسهيلات نظام التشغيل لإجراء تحليل الاسم. قد لا تحتاج إلى إجراء أي اتصال شبكة. لإجراء تحليل الاسم بالطريقة التي تفعل بها التطبيقات الأخرى على نفس النظام، استخدم [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```

```js [CJS]
const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```
:::

تتصل جميع الوظائف الأخرى في وحدة `node:dns` بخادم DNS فعلي لإجراء تحليل الاسم. سوف تستخدم دائمًا الشبكة لإجراء استعلامات DNS. لا تستخدم هذه الوظائف نفس مجموعة ملفات التكوين التي تستخدمها [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) (مثل `/etc/hosts`). استخدم هذه الوظائف لإجراء استعلامات DNS دائمًا، متجاوزًا تسهيلات تحليل الاسم الأخرى.

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```

```js [CJS]
const dns = require('node:dns');

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```
:::

راجع [قسم اعتبارات التنفيذ](/ar/nodejs/api/dns#implementation-considerations) لمزيد من المعلومات.


## الفئة: `dns.Resolver` {#class-dnsresolver}

**أُضيفت في: الإصدار v8.3.0**

مُحلِّل مستقل لطلبات نظام أسماء النطاقات (DNS).

إنشاء مُحلِّل جديد يستخدم إعدادات الخادم الافتراضية. لا يؤثر تعيين الخوادم المستخدمة لمُحلِّل باستخدام [`resolver.setServers()`](/ar/nodejs/api/dns#dnssetserversservers) على المُحلِّلات الأخرى:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// سيستخدم هذا الطلب الخادم في 4.4.4.4، بشكل مستقل عن الإعدادات العامة.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// سيستخدم هذا الطلب الخادم في 4.4.4.4، بشكل مستقل عن الإعدادات العامة.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

الطرق التالية من الوحدة النمطية `node:dns` متاحة:

- [`resolver.getServers()`](/ar/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/ar/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/ar/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/ar/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/ar/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/ar/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/ar/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/ar/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/ar/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/ar/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/ar/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/ar/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/ar/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/ar/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/ar/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/ar/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v16.7.0, v14.18.0 | يقبل كائن `options` الآن خيار `tries`. |
| v12.18.3 | يقبل المُنشئ الآن كائن `options`. الخيار الوحيد المدعوم هو `timeout`. |
| v8.3.0 | أُضيف في: الإصدار v8.3.0 |
:::

إنشاء مُحلِّل جديد.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مهلة الاستعلام بالمللي ثانية، أو `-1` لاستخدام المهلة الافتراضية.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المحاولات التي سيحاول المُحلِّل الاتصال بها بكل خادم أسماء قبل الاستسلام. **الافتراضي:** `4`


### `resolver.cancel()` {#resolvercancel}

**أُضيف في:** الإصدار 8.3.0

إلغاء جميع استعلامات DNS المعلقة التي تم إجراؤها بواسطة هذا المحلل. سيتم استدعاء ردود النداء المقابلة بخطأ بالرمز `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**أُضيف في:** الإصدار 15.1.0، 14.17.0

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تمثيل نصي لعنوان IPv4. **افتراضي:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تمثيل نصي لعنوان IPv6. **افتراضي:** `'::0'`

سترسل نسخة المحلل طلباتها من عنوان IP المحدد. يسمح هذا للبرامج بتحديد الواجهات الصادرة عند استخدامها على أنظمة متعددة المنافذ.

إذا لم يتم تحديد عنوان v4 أو v6، فسيتم تعيينه على الوضع الافتراضي وسيختار نظام التشغيل عنوانًا محليًا تلقائيًا.

سيستخدم المحلل العنوان المحلي v4 عند تقديم طلبات إلى خوادم IPv4 DNS، والعنوان المحلي v6 عند تقديم طلبات إلى خوادم IPv6 DNS. لا يؤثر `rrtype` لطلبات التحليل على العنوان المحلي المستخدم.

## `dns.getServers()` {#dnsgetservers}

**أُضيف في:** الإصدار 0.11.3

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع مصفوفة من سلاسل عناوين IP، منسقة وفقًا لـ [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)، التي تم تكوينها حاليًا لتحليل DNS. ستتضمن السلسلة قسم منفذ إذا تم استخدام منفذ مخصص.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | الخيار `verbatim` مهمل الآن لصالح الخيار الجديد `order`. |
| v18.4.0 | للتوافق مع `node:net`، عند تمرير كائن خيارات، يمكن أن يكون الخيار `family` السلسلة `'IPv4'` أو السلسلة `'IPv6'`. |
| v18.0.0 | يؤدي تمرير رد نداء غير صالح إلى وسيطة `callback` الآن إلى إظهار `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v17.0.0 | الخيارات `verbatim` افتراضية الآن إلى `true`. |
| v8.5.0 | الخيار `verbatim` مدعوم الآن. |
| v1.2.0 | الخيار `all` مدعوم الآن. |
| v0.1.90 | أُضيف في: الإصدار 0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عائلة التسجيل. يجب أن تكون `4` أو `6` أو `0`. لأسباب تتعلق بالتوافق مع الإصدارات السابقة، يتم تفسير `'IPv4'` و `'IPv6'` على التوالي على أنهما `4` و `6`. تشير القيمة `0` إلى أنه يتم إرجاع عنوان IPv4 أو IPv6. إذا تم استخدام القيمة `0` مع `{ all: true }` (انظر أدناه)، فسيتم إرجاع أحد أو كلا العنوانين IPv4 و IPv6، اعتمادًا على محلل DNS الخاص بالنظام. **افتراضي:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واحد أو أكثر من [علامات `getaddrinfo` المدعومة](/ar/nodejs/api/dns#supported-getaddrinfo-flags). يمكن تمرير علامات متعددة عن طريق `OR` لقيمها على مستوى البت.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، يُرجع رد النداء جميع العناوين التي تم تحليلها في مصفوفة. بخلاف ذلك، يُرجع عنوانًا واحدًا. **افتراضي:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عندما تكون `verbatim`، يتم إرجاع العناوين التي تم تحليلها غير مرتبة. عندما تكون `ipv4first`، يتم فرز العناوين التي تم تحليلها عن طريق وضع عناوين IPv4 قبل عناوين IPv6. عندما تكون `ipv6first`، يتم فرز العناوين التي تم تحليلها عن طريق وضع عناوين IPv6 قبل عناوين IPv4. **افتراضي:** `verbatim` (لا تتم إعادة ترتيب العناوين). القيمة الافتراضية قابلة للتكوين باستخدام [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) أو [`--dns-result-order`](/ar/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، يتلقى رد النداء عناوين IPv4 و IPv6 بالترتيب الذي أرجعها محلل DNS. عندما تكون `false`، يتم وضع عناوين IPv4 قبل عناوين IPv6. سيتم إهمال هذا الخيار لصالح `order`. عند تحديد كليهما، يكون لـ `order` الأسبقية الأعلى. يجب على التعليمات البرمجية الجديدة استخدام `order` فقط. **افتراضي:** `true` (لا تتم إعادة ترتيب العناوين). القيمة الافتراضية قابلة للتكوين باستخدام [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) أو [`--dns-result-order`](/ar/nodejs/api/cli#--dns-result-orderorder).
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تمثيل نصي لعنوان IPv4 أو IPv6.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` أو `6`، تشير إلى عائلة `address`، أو `0` إذا لم يكن العنوان عنوان IPv4 أو IPv6. `0` هو مؤشر محتمل لوجود خطأ في خدمة تحليل الأسماء التي يستخدمها نظام التشغيل.
  
 

يحل اسم المضيف (مثل `'nodejs.org'`) إلى أول سجل A (IPv4) أو AAAA (IPv6) تم العثور عليه. جميع خصائص `option` اختيارية. إذا كان `options` عددًا صحيحًا، فيجب أن يكون `4` أو `6` - إذا لم يتم توفير `options`، فسيتم إرجاع عناوين IPv4 أو IPv6، أو كليهما، إذا تم العثور عليها.

مع تعيين الخيار `all` على `true`، تتغير وسيطات `callback` إلى `(err, addresses)`، مع كون `addresses` مصفوفة من الكائنات بالخصائص `address` و `family`.

عند حدوث خطأ، يكون `err` كائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` هو رمز الخطأ. ضع في اعتبارك أن `err.code` سيتم تعيينه على `'ENOTFOUND'` ليس فقط عندما لا يكون اسم المضيف موجودًا ولكن أيضًا عندما يفشل البحث بطرق أخرى مثل عدم وجود واصفات ملفات متاحة.

لا يرتبط `dns.lookup()` بالضرورة بأي شيء ببروتوكول DNS. يستخدم التنفيذ أداة نظام التشغيل التي يمكنها ربط الأسماء بالعناوين والعكس صحيح. يمكن أن يكون لهذا التنفيذ عواقب خفية ولكنها مهمة على سلوك أي برنامج Node.js. يرجى قضاء بعض الوقت للتشاور مع [قسم اعتبارات التنفيذ](/ar/nodejs/api/dns#implementation-considerations) قبل استخدام `dns.lookup()`.

مثال على الاستخدام:



::: code-group
```js [ESM]
import dns from 'node:dns';
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```

```js [CJS]
const dns = require('node:dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```
:::

إذا تم استدعاء هذه الطريقة كإصدار [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed الخاص بها، ولم يتم تعيين `all` على `true`، فسترجع `Promise` لـ `Object` مع خصائص `address` و `family`.


### العلامات المدعومة لـ getaddrinfo {#supported-getaddrinfo-flags}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v13.13.0, v12.17.0 | تمت إضافة دعم علامة `dns.ALL`. |
:::

يمكن تمرير العلامات التالية كتلميحات إلى [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG`: يحد من أنواع العناوين التي تم إرجاعها إلى أنواع العناوين غير الاسترجاعية التي تم تكوينها على النظام. على سبيل المثال، يتم إرجاع عناوين IPv4 فقط إذا كان النظام الحالي يحتوي على عنوان IPv4 واحد على الأقل تم تكوينه.
- `dns.V4MAPPED`: إذا تم تحديد عائلة IPv6، ولكن لم يتم العثور على عناوين IPv6، فقم بإرجاع عناوين IPv4 المعينة لـ IPv6. لا يتم دعمه على بعض أنظمة التشغيل (مثل FreeBSD 10.1).
- `dns.ALL`: إذا تم تحديد `dns.V4MAPPED`، فقم بإرجاع عناوين IPv6 التي تم حلها بالإضافة إلى عناوين IPv4 المعينة لـ IPv6.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | يؤدي تمرير رد اتصال غير صالح إلى وسيطة `callback` الآن إلى إلقاء `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.11.14 | تمت الإضافة في: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) على سبيل المثال. `example.com`
    - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) على سبيل المثال. `http`

يقوم بحل `address` و `port` المحددين في اسم مضيف وخدمة باستخدام تطبيق `getnameinfo` الأساسي لنظام التشغيل.

إذا لم يكن `address` عنوان IP صالحًا، فسيتم طرح `TypeError`. سيتم إكراه `port` إلى رقم. إذا لم يكن منفذًا قانونيًا، فسيتم طرح `TypeError`.

عند حدوث خطأ، يكون `err` هو كائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث `err.code` هو رمز الخطأ.

::: code-group
```js [ESM]
import dns from 'node:dns';
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```

```js [CJS]
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```
:::

إذا تم استدعاء هذه الطريقة كنسخة [`util.promisify()`](/ar/nodejs/api/util#utilpromisifyoriginal)ed الخاصة بها، فإنها تُرجع `Promise` لـ `Object` مع خصائص `hostname` و `service`.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد نداء غير صالح إلى الوسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.1.27 | أُضيف في: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف المراد حله.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع سجل الموارد. **افتراضي:** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

يستخدم بروتوكول DNS لحل اسم المضيف (مثل `'nodejs.org'`) إلى مصفوفة من سجلات الموارد. دالة `callback` لها وسيطتان `(err, records)`. عند النجاح، سيكون `records` مصفوفة من سجلات الموارد. يختلف نوع وهيكل النتائج الفردية بناءً على `rrtype`:

| `rrtype` | `records` يحتوي على | نوع النتيجة | طريقة مختصرة |
| --- | --- | --- | --- |
| `'A'` | عناوين IPv4 (افتراضي) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/ar/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | عناوين IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/ar/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | أي سجلات | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/ar/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | سجلات ترخيص CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/ar/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | سجلات الاسم الأساسي | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/ar/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | سجلات تبادل البريد | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/ar/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | سجلات مؤشر سلطة الاسم | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/ar/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | سجلات خادم الاسم | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/ar/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | سجلات المؤشر | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/ar/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | سجلات بداية السلطة | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/ar/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | سجلات الخدمة | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/ar/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | سجلات النص | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/ar/nodejs/api/dns#dnsresolvetxthostname-callback) |
في حالة حدوث خطأ، يكون `err` هو كائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` أحد [رموز خطأ DNS](/ar/nodejs/api/dns#error-codes).


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد اتصال غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v7.2.0 | تدعم هذه الطريقة الآن تمرير `options`، وتحديدًا `options.ttl`. |
| v0.1.16 | تمت إضافتها في: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف المراد تحويله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) استرداد قيمة وقت البقاء (TTL) لكل سجل. عندما تكون `true`، يتلقى رد الاتصال مصفوفة من كائنات `{ address: '1.2.3.4', ttl: 60 }` بدلاً من مصفوفة من السلاسل، مع التعبير عن TTL بالثواني.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



يستخدم بروتوكول DNS لتحويل عناوين IPv4 (سجلات `A`) لـ `hostname`. ستحتوي وسيطة `addresses` التي تم تمريرها إلى دالة `callback` على مصفوفة من عناوين IPv4 (مثل `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير رد اتصال غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v7.2.0 | تدعم هذه الطريقة الآن تمرير `options`، وتحديدًا `options.ttl`. |
| v0.1.16 | تمت إضافتها في: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف المراد تحويله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) استرداد قيمة وقت البقاء (TTL) لكل سجل. عندما تكون `true`، يتلقى رد الاتصال مصفوفة من كائنات `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` بدلاً من مصفوفة من السلاسل، مع التعبير عن TTL بالثواني.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



يستخدم بروتوكول DNS لتحويل عناوين IPv6 (سجلات `AAAA`) لـ `hostname`. ستحتوي وسيطة `addresses` التي تم تمريرها إلى دالة `callback` على مصفوفة من عناوين IPv6.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يؤدي الآن إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يستخدم بروتوكول DNS لحل جميع السجلات (المعروفة أيضًا باسم استعلام `ANY` أو `*`). ستكون وسيطة `ret` التي تم تمريرها إلى دالة `callback` عبارة عن مصفوفة تحتوي على أنواع مختلفة من السجلات. يحتوي كل كائن على خاصية `type` تشير إلى نوع السجل الحالي. واعتمادًا على `type`، ستكون هناك خصائص إضافية موجودة في الكائن:

| النوع | الخصائص |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | راجع [`dns.resolveMx()`](/ar/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | راجع [`dns.resolveNaptr()`](/ar/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | راجع [`dns.resolveSoa()`](/ar/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | راجع [`dns.resolveSrv()`](/ar/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | يحتوي هذا النوع من السجلات على خاصية مصفوفة تسمى `entries` تشير إلى [`dns.resolveTxt()`](/ar/nodejs/api/dns#dnsresolvetxthostname-callback)، على سبيل المثال، `{ entries: ['...'], type: 'TXT' }` |
فيما يلي مثال على كائن `ret` الذي تم تمريره إلى دالة رد النداء:

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```
قد يختار مشغلو خادم DNS عدم الاستجابة لاستعلامات `ANY`. قد يكون من الأفضل استدعاء طرق فردية مثل [`dns.resolve4()`](/ar/nodejs/api/dns#dnsresolve4hostname-options-callback) و [`dns.resolveMx()`](/ar/nodejs/api/dns#dnsresolvemxhostname-callback) وما إلى ذلك. لمزيد من التفاصيل، راجع [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | الآن يؤدي تمرير استدعاء غير صالح إلى وسيطة `callback` إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.3.2 | أُضيف في: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لحل سجلات `CNAME` لـ `hostname`. ستحتوي وسيطة `addresses` التي تم تمريرها إلى دالة `callback` على مصفوفة من سجلات الاسم المتعارف عليها المتاحة لـ `hostname` (على سبيل المثال، `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | الآن يؤدي تمرير استدعاء غير صالح إلى وسيطة `callback` إلى إطلاق `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | أُضيف في: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يستخدم بروتوكول DNS لحل سجلات `CAA` لـ `hostname`. ستحتوي وسيطة `addresses` التي تم تمريرها إلى دالة `callback` على مصفوفة من سجلات ترخيص سلطة التصديق المتاحة لـ `hostname` (على سبيل المثال، `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.1.27 | تمت إضافته في: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

يستخدم بروتوكول نظام أسماء النطاقات (DNS) لحل سجلات تبادل البريد (`MX` records) لـ `hostname`. ستحتوي وسيطة `addresses` التي تم تمريرها إلى دالة `callback` على مصفوفة من الكائنات التي تحتوي على كل من الخاصية `priority` و `exchange` (مثل `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.9.12 | تمت إضافته في: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

يستخدم بروتوكول نظام أسماء النطاقات (DNS) لحل السجلات المستندة إلى التعبير النمطي (`NAPTR` records) لـ `hostname`. ستحتوي وسيطة `addresses` التي تم تمريرها إلى دالة `callback` على مصفوفة من الكائنات بالخصائص التالية:

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```

## `dns.resolveNs(hostname, callback)` {#dnsresolvenshostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار 0.1.90 | تمت الإضافة في: الإصدار 0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



يستخدم بروتوكول DNS لحل سجلات خادم الاسم (`NS`) لـ `hostname`. سيحتوي وسيط `addresses` الذي تم تمريره إلى دالة `callback` على مصفوفة من سجلات خادم الاسم المتاحة لـ `hostname` (على سبيل المثال `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار 6.0.0 | تمت الإضافة في: الإصدار 6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



يستخدم بروتوكول DNS لحل سجلات المؤشر (`PTR`) لـ `hostname`. سيكون وسيط `addresses` الذي تم تمريره إلى دالة `callback` عبارة عن مصفوفة من السلاسل التي تحتوي على سجلات الرد.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 18.0.0 | تمرير دالة رد نداء غير صالحة إلى وسيط `callback` يثير الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| الإصدار 0.11.10 | تمت الإضافة في: الإصدار 0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



يستخدم بروتوكول DNS لحل سجل بداية السلطة (`SOA`) لـ `hostname`. سيكون وسيط `address` الذي تم تمريره إلى دالة `callback` كائنًا بالخصائص التالية:

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```

## `dns.resolveSrv(hostname, callback)` {#dnsresolvesrvhostname-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى الوسيط `callback` يطلق الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.1.27 | تمت إضافته في: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

يستخدم بروتوكول DNS لحل سجلات الخدمة (سجلات `SRV`) لـ `hostname`. الوسيط `addresses` الذي تم تمريره إلى دالة `callback` سيكون عبارة عن مصفوفة من الكائنات بالخصائص التالية:

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
## `dns.resolveTxt(hostname, callback)` {#dnsresolvetxthostname-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير دالة رد نداء غير صالحة إلى الوسيط `callback` يطلق الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.1.27 | تمت إضافته في: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

يستخدم بروتوكول DNS لحل استعلامات النص (سجلات `TXT`) لـ `hostname`. الوسيط `records` الذي تم تمريره إلى دالة `callback` هو مصفوفة ثنائية الأبعاد لسجلات النص المتاحة لـ `hostname` (على سبيل المثال `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). تحتوي كل مصفوفة فرعية على أجزاء TXT لسجل واحد. اعتمادًا على حالة الاستخدام، يمكن تجميعها معًا أو التعامل معها بشكل منفصل.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**تمت إضافته في: الإصدار v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

إجراء استعلام DNS عكسي يحل عنوان IPv4 أو IPv6 إلى مجموعة من أسماء المضيفين.

في حالة حدوث خطأ، يكون `err` هو كائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` أحد [رموز خطأ DNS](/ar/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | القيمة `ipv6first` مدعومة الآن. |
| v17.0.0 | تم تغيير القيمة الافتراضية إلى `verbatim`. |
| v16.4.0, v14.18.0 | تمت إضافته في: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن تكون `'ipv4first'` أو `'ipv6first'` أو `'verbatim'`.

تعيين القيمة الافتراضية لـ `order` في [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) و [`dnsPromises.lookup()`](/ar/nodejs/api/dns#dnspromiseslookuphostname-options). يمكن أن تكون القيمة:

- `ipv4first`: تعيين القيمة الافتراضية لـ `order` إلى `ipv4first`.
- `ipv6first`: تعيين القيمة الافتراضية لـ `order` إلى `ipv6first`.
- `verbatim`: تعيين القيمة الافتراضية لـ `order` إلى `verbatim`.

القيمة الافتراضية هي `verbatim` و [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) لها أولوية أعلى من [`--dns-result-order`](/ar/nodejs/api/cli#--dns-result-orderorder). عند استخدام [worker threads](/ar/nodejs/api/worker_threads)، فإن [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) من مؤشر الترابط الرئيسي لن تؤثر على أوامر dns الافتراضية في العمال.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | القيمة `ipv6first` مدعومة الآن. |
| v20.1.0, v18.17.0 | تمت إضافته في: v20.1.0, v18.17.0 |
:::

الحصول على القيمة الافتراضية لـ `order` في [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) و [`dnsPromises.lookup()`](/ar/nodejs/api/dns#dnspromiseslookuphostname-options). يمكن أن تكون القيمة:

- `ipv4first`: للقيمة `order` الافتراضية `ipv4first`.
- `ipv6first`: للقيمة `order` الافتراضية `ipv6first`.
- `verbatim`: للقيمة `order` الافتراضية `verbatim`.


## `dns.setServers(servers)` {#dnssetserversservers}

**أضيف في: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من العناوين المنسقة [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

يضبط عنوان IP ومنفذ الخوادم المراد استخدامها عند إجراء تحليل نظام أسماء النطاقات (DNS). الوسيطة `servers` هي مصفوفة من العناوين المنسقة [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). إذا كان المنفذ هو منفذ DNS الافتراضي IANA (53)، فيمكن حذفه.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
سيتم طرح خطأ إذا تم توفير عنوان غير صالح.

يجب عدم استدعاء الطريقة `dns.setServers()` أثناء تقدم استعلام DNS.

الطريقة [`dns.setServers()`](/ar/nodejs/api/dns#dnssetserversservers) تؤثر فقط على [`dns.resolve()`](/ar/nodejs/api/dns#dnsresolvehostname-rrtype-callback) و `dns.resolve*()` و [`dns.reverse()`](/ar/nodejs/api/dns#dnsreverseip-callback) (وعلى وجه التحديد *لا* تؤثر على [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback)).

تعمل هذه الطريقة بشكل مشابه جدًا لـ [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). بمعنى أنه إذا كانت محاولة التحليل باستخدام الخادم الأول المقدم تؤدي إلى خطأ `NOTFOUND`، فإن الطريقة `resolve()` *لن* تحاول التحليل باستخدام الخوادم اللاحقة المقدمة. سيتم استخدام خوادم DNS الاحتياطية فقط إذا تجاوزت الخوادم السابقة المهلة أو أسفرت عن خطأ آخر.

## واجهة برمجة تطبيقات وعود DNS (DNS promises API) {#dns-promises-api}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v15.0.0 | تم عرضه كـ `require('dns/promises')`. |
| v11.14.0, v10.17.0 | واجهة برمجة التطبيقات هذه لم تعد تجريبية. |
| v10.6.0 | أضيف في: v10.6.0 |
:::

توفر واجهة برمجة تطبيقات `dns.promises` مجموعة بديلة من طرق DNS غير المتزامنة التي تُرجع كائنات `Promise` بدلاً من استخدام عمليات الاسترجاع. يمكن الوصول إلى واجهة برمجة التطبيقات عبر `require('node:dns').promises` أو `require('node:dns/promises')`.

### الفئة: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**أضيف في: v10.6.0**

مُحلل مستقل لطلبات DNS.

يستخدم إنشاء مُحلل جديد إعدادات الخادم الافتراضية. لا يؤثر تعيين الخوادم المستخدمة لمُحلل باستخدام [`resolver.setServers()`](/ar/nodejs/api/dns#dnspromisessetserversservers) على المُحللات الأخرى:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// سيستخدم هذا الطلب الخادم الموجود في 4.4.4.4، بشكل مستقل عن الإعدادات العامة.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// سيستخدم هذا الطلب الخادم الموجود في 4.4.4.4، بشكل مستقل عن الإعدادات العامة.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// بدلاً من ذلك، يمكن كتابة نفس الكود باستخدام نمط async-await.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

الطرق التالية من واجهة برمجة تطبيقات `dnsPromises` متاحة:

- [`resolver.getServers()`](/ar/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/ar/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/ar/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/ar/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/ar/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/ar/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/ar/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/ar/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/ar/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/ar/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/ar/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/ar/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/ar/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/ar/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/ar/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/ar/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**تمت الإضافة في: v15.3.0, v14.17.0**

إلغاء جميع استعلامات DNS المعلقة التي تم إجراؤها بواسطة هذا المحلل. سيتم رفض الوعود المقابلة بخطأ مع الرمز `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**تمت الإضافة في: v10.6.0**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع مصفوفة من سلاسل عناوين IP، منسقة وفقًا لـ [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)، والتي تم تكوينها حاليًا لحل DNS. ستتضمن السلسلة قسم منفذ إذا تم استخدام منفذ مخصص.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | تم الآن إهمال الخيار `verbatim` لصالح الخيار الجديد `order`. |
| v10.6.0 | تمت الإضافة في: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عائلة التسجيل. يجب أن تكون `4` أو `6` أو `0`. تشير القيمة `0` إلى أنه يتم إرجاع عنوان IPv4 أو IPv6. إذا تم استخدام القيمة `0` مع `{ all: true }` (انظر أدناه)، فسيتم إرجاع إما أحد أو كلا العنوانين IPv4 و IPv6، اعتمادًا على محلل DNS الخاص بالنظام. **افتراضي:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) واحد أو أكثر من [علامات `getaddrinfo` المدعومة](/ar/nodejs/api/dns#supported-getaddrinfo-flags). يمكن تمرير علامات متعددة عن طريق `OR`ing قيمها على مستوى البت.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، يتم حل `Promise` مع جميع العناوين في مصفوفة. وإلا، يتم إرجاع عنوان واحد. **افتراضي:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عندما تكون `verbatim`، يتم حل `Promise` مع عناوين IPv4 و IPv6 بالترتيب الذي أرجعه محلل DNS. عندما تكون `ipv4first`، يتم وضع عناوين IPv4 قبل عناوين IPv6. عندما تكون `ipv6first`، يتم وضع عناوين IPv6 قبل عناوين IPv4. **افتراضي:** `verbatim` (لا تتم إعادة ترتيب العناوين). القيمة الافتراضية قابلة للتكوين باستخدام [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) أو [`--dns-result-order`](/ar/nodejs/api/cli#--dns-result-orderorder). يجب أن يستخدم الكود الجديد `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) عندما تكون `true`، يتم حل `Promise` مع عناوين IPv4 و IPv6 بالترتيب الذي أرجعه محلل DNS. عندما تكون `false`، يتم وضع عناوين IPv4 قبل عناوين IPv6. سيتم إهمال هذا الخيار لصالح `order`. عند تحديد كليهما، يكون لـ `order` الأسبقية الأعلى. يجب أن يستخدم الكود الجديد `order` فقط. **افتراضي:** حاليًا `false` (تتم إعادة ترتيب العناوين) ولكن من المتوقع أن يتغير هذا في المستقبل غير البعيد. القيمة الافتراضية قابلة للتكوين باستخدام [`dns.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnssetdefaultresultorderorder) أو [`--dns-result-order`](/ar/nodejs/api/cli#--dns-result-orderorder).
  
 

يحل اسم المضيف (مثل `'nodejs.org'`) إلى أول سجل A (IPv4) أو AAAA (IPv6) تم العثور عليه. جميع خصائص `option` اختيارية. إذا كان `options` عددًا صحيحًا، فيجب أن يكون `4` أو `6` - إذا لم يتم توفير `options`، فسيتم إرجاع إما عناوين IPv4 أو IPv6، أو كليهما، إذا تم العثور عليها.

مع تعيين الخيار `all` على `true`، يتم حل `Promise` مع `addresses` كونها مصفوفة من الكائنات ذات الخصائص `address` و `family`.

في حالة حدوث خطأ، يتم رفض `Promise` بكائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` هو رمز الخطأ. ضع في اعتبارك أن `err.code` سيتم تعيينه على `'ENOTFOUND'` ليس فقط عندما لا يكون اسم المضيف موجودًا ولكن أيضًا عندما يفشل البحث بطرق أخرى مثل عدم وجود واصفات ملفات متاحة.

[`dnsPromises.lookup()`](/ar/nodejs/api/dns#dnspromiseslookuphostname-options) ليس بالضرورة أن يكون له أي علاقة ببروتوكول DNS. يستخدم التنفيذ مرفق نظام تشغيل يمكنه ربط الأسماء بالعناوين والعكس صحيح. يمكن أن يكون لهذا التنفيذ عواقب خفية ولكنها مهمة على سلوك أي برنامج Node.js. يرجى قضاء بعض الوقت في استشارة [قسم اعتبارات التنفيذ](/ar/nodejs/api/dns#implementation-considerations) قبل استخدام `dnsPromises.lookup()`.

مثال على الاستخدام:



::: code-group
```js [ESM]
import dns from 'node:dns';
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```

```js [CJS]
const dns = require('node:dns');
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::

### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**تمت الإضافة في: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يقوم بحل `address` و `port` المحددين إلى اسم مضيف وخدمة باستخدام تنفيذ `getnameinfo` الأساسي لنظام التشغيل.

إذا كان `address` ليس عنوان IP صالح، فسيتم طرح `TypeError`. سيتم تحويل `port` إلى رقم. إذا لم يكن منفذًا قانونيًا، فسيتم طرح `TypeError`.

عند حدوث خطأ، يتم رفض `Promise` بكائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` هو رمز الخطأ.

::: code-group
```js [ESM]
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Prints: localhost ssh
```

```js [CJS]
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Prints: localhost ssh
});
```
:::

### `dnsPromises.resolve(hostname[, rrtype])` {#dnspromisesresolvehostname-rrtype}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف المراد حله.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نوع سجل الموارد. **الافتراضي:** `'A'`.

يستخدم بروتوكول DNS لحل اسم مضيف (مثل `'nodejs.org'`) إلى مجموعة من سجلات الموارد. عند النجاح، يتم حل `Promise` بمجموعة من سجلات الموارد. يختلف نوع وهيكل النتائج الفردية بناءً على `rrtype`:

| `rrtype` | `records` يحتوي على | نوع النتيجة | طريقة مختصرة |
| --- | --- | --- | --- |
| `'A'` | عناوين IPv4 (افتراضي) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/ar/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | عناوين IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/ar/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | أي سجلات | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/ar/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | سجلات تخويل CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/ar/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | سجلات الاسم الأساسي | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/ar/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | سجلات تبادل البريد | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/ar/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | سجلات مؤشر مرجعية التسمية | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/ar/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | سجلات خادم الاسم | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/ar/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | سجلات المؤشر | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/ar/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | سجلات بداية السلطة | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/ar/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | سجلات الخدمة | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/ar/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | سجلات النص | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/ar/nodejs/api/dns#dnspromisesresolvetxthostname) |
عند حدوث خطأ، يتم رفض `Promise` بكائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` أحد [رموز خطأ DNS](/ar/nodejs/api/dns#error-codes).


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف المراد تحليله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) استرجاع قيمة Time-To-Live (TTL) لكل سجل. عندما تكون القيمة `true`، سيتم حل `Promise` باستخدام مصفوفة من كائنات `{ address: '1.2.3.4', ttl: 60 }` بدلاً من مصفوفة من السلاسل النصية، مع التعبير عن TTL بالثواني.

يستخدم بروتوكول DNS لتحليل عناوين IPv4 (سجلات `A`) لـ `hostname`. عند النجاح، يتم حل `Promise` باستخدام مصفوفة من عناوين IPv4 (مثل `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف المراد تحليله.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) استرجاع قيمة Time-To-Live (TTL) لكل سجل. عندما تكون القيمة `true`، سيتم حل `Promise` باستخدام مصفوفة من كائنات `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` بدلاً من مصفوفة من السلاسل النصية، مع التعبير عن TTL بالثواني.

يستخدم بروتوكول DNS لتحليل عناوين IPv6 (سجلات `AAAA`) لـ `hostname`. عند النجاح، يتم حل `Promise` باستخدام مصفوفة من عناوين IPv6.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لتحليل جميع السجلات (المعروفة أيضًا باسم استعلام `ANY` أو `*`). عند النجاح، يتم حل `Promise` باستخدام مصفوفة تحتوي على أنواع مختلفة من السجلات. يحتوي كل كائن على خاصية `type` تشير إلى نوع السجل الحالي. واعتمادًا على `type`، ستكون هناك خصائص إضافية موجودة في الكائن:

| النوع | الخصائص |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | ارجع إلى [`dnsPromises.resolveMx()`](/ar/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | ارجع إلى [`dnsPromises.resolveNaptr()`](/ar/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | ارجع إلى [`dnsPromises.resolveSoa()`](/ar/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | ارجع إلى [`dnsPromises.resolveSrv()`](/ar/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | يحتوي هذا النوع من السجلات على خاصية مصفوفة تسمى `entries` تشير إلى [`dnsPromises.resolveTxt()`](/ar/nodejs/api/dns#dnspromisesresolvetxthostname) ، على سبيل المثال `{ entries: ['...'], type: 'TXT' }` |
فيما يلي مثال للكائن الناتج:

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```

### `dnsPromises.resolveCaa(hostname)` {#dnspromisesresolvecaahostname}

**أُضيف في:** v15.0.0, v14.17.0

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لحل سجلات `CAA` لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من الكائنات التي تحتوي على سجلات تخويل سلطة التصديق المتاحة لـ `hostname` (على سبيل المثال، `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**أُضيف في:** v10.6.0

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لحل سجلات `CNAME` لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من سجلات الاسم المتعارف عليها المتاحة لـ `hostname` (على سبيل المثال، `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**أُضيف في:** v10.6.0

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لحل سجلات تبادل البريد (`MX` records) لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من الكائنات التي تحتوي على كل من الخاصية `priority` و `exchange` (على سبيل المثال، `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**أُضيف في:** v10.6.0

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لحل السجلات المستندة إلى التعبير النمطي (`NAPTR` records) لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من الكائنات بالخصائص التالية:

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```
### `dnsPromises.resolveNs(hostname)` {#dnspromisesresolvenshostname}

**أُضيف في:** v10.6.0

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول DNS لحل سجلات خادم الاسم (`NS` records) لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من سجلات خادم الاسم المتاحة لـ `hostname` (على سبيل المثال، `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول نظام أسماء النطاقات (DNS) لحل سجلات المؤشر (`PTR`) لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من السلاسل النصية التي تحتوي على سجلات الرد.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول نظام أسماء النطاقات (DNS) لحل سجل بدء التشغيل (`SOA`) لـ `hostname`. عند النجاح، يتم حل `Promise` مع كائن بالخصائص التالية:

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```
### `dnsPromises.resolveSrv(hostname)` {#dnspromisesresolvesrvhostname}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول نظام أسماء النطاقات (DNS) لحل سجلات الخدمة (`SRV`) لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة من الكائنات بالخصائص التالية:

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
### `dnsPromises.resolveTxt(hostname)` {#dnspromisesresolvetxthostname}

**تمت الإضافة في: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يستخدم بروتوكول نظام أسماء النطاقات (DNS) لحل استعلامات النص (`TXT`) لـ `hostname`. عند النجاح، يتم حل `Promise` مع مصفوفة ثنائية الأبعاد لسجلات النص المتاحة لـ `hostname` (على سبيل المثال، `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). تحتوي كل مصفوفة فرعية على أجزاء TXT لسجل واحد. اعتمادًا على حالة الاستخدام، يمكن إما ضمها معًا أو معالجتها بشكل منفصل.


### ‏`dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**تمت إضافتها في: الإصدار v10.6.0**

- `ip` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يجري استعلام DNS عكسي يحل عنوان IPv4 أو IPv6 إلى مصفوفة من أسماء المضيفين.

في حالة حدوث خطأ، يتم رفض `الوعد` بكائن [`Error`](/ar/nodejs/api/errors#class-error)، حيث يكون `err.code` واحدًا من [رموز أخطاء DNS](/ar/nodejs/api/dns#error-codes).

### ‏`dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v22.1.0, v20.13.0 | قيمة `ipv6first` مدعومة الآن. |
| v17.0.0 | تم تغيير القيمة الافتراضية إلى `verbatim`. |
| v16.4.0, v14.18.0 | تمت إضافتها في: الإصدار v16.4.0، الإصدار v14.18.0 |
:::

- `order` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يجب أن يكون `'ipv4first'` أو `'ipv6first'` أو `'verbatim'`.

تعيين القيمة الافتراضية لـ `order` في [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) و [`dnsPromises.lookup()`](/ar/nodejs/api/dns#dnspromiseslookuphostname-options). يمكن أن تكون القيمة:

- `ipv4first`: تعيين `order` الافتراضي إلى `ipv4first`.
- `ipv6first`: تعيين `order` الافتراضي إلى `ipv6first`.
- `verbatim`: تعيين `order` الافتراضي إلى `verbatim`.

الافتراضي هو `verbatim` ولـ [`dnsPromises.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnspromisessetdefaultresultorderorder) أولوية أعلى من [`--dns-result-order`](/ar/nodejs/api/cli#--dns-result-orderorder). عند استخدام [سلاسل العمل](/ar/nodejs/api/worker_threads)، لن يؤثر [`dnsPromises.setDefaultResultOrder()`](/ar/nodejs/api/dns#dnspromisessetdefaultresultorderorder) من السلسلة الرئيسية على أوامر DNS الافتراضية في السلاسل الفرعية.

### ‏`dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**تمت إضافتها في: الإصدار v20.1.0، الإصدار v18.17.0**

الحصول على قيمة `dnsOrder`.

### ‏`dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**تمت إضافتها في: الإصدار v10.6.0**

- `servers` ‏[\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصفوفة من العناوين المنسقة [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

تعيين عنوان IP ومنفذ الخوادم التي سيتم استخدامها عند إجراء تحليل DNS. وسيطة `servers` هي مصفوفة من العناوين المنسقة [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). إذا كان المنفذ هو منفذ DNS الافتراضي لـ IANA (53)، فيمكن حذفه.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
سيتم طرح خطأ إذا تم توفير عنوان غير صالح.

يجب عدم استدعاء الأسلوب `dnsPromises.setServers()` أثناء تقدم استعلام DNS.

يعمل هذا الأسلوب بشكل مشابه لـ [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). أي أنه إذا كانت محاولة التحليل مع الخادم الأول المقدم ينتج عنها خطأ `NOTFOUND`، فإن الأسلوب `resolve()` *لن* يحاول التحليل مع الخوادم اللاحقة المقدمة. سيتم استخدام خوادم DNS الاحتياطية فقط إذا انتهت مهلة الخوادم السابقة أو نتج عنها خطأ آخر.


## رموز الأخطاء {#error-codes}

يمكن لكل استعلام DNS إرجاع أحد رموز الأخطاء التالية:

- `dns.NODATA`: أعاد خادم DNS إجابة بدون بيانات.
- `dns.FORMERR`: يدعي خادم DNS أن الاستعلام كان بتنسيق خاطئ.
- `dns.SERVFAIL`: أعاد خادم DNS فشلًا عامًا.
- `dns.NOTFOUND`: لم يتم العثور على اسم النطاق.
- `dns.NOTIMP`: لا ينفذ خادم DNS العملية المطلوبة.
- `dns.REFUSED`: رفض خادم DNS الاستعلام.
- `dns.BADQUERY`: استعلام DNS بتنسيق خاطئ.
- `dns.BADNAME`: اسم مضيف بتنسيق خاطئ.
- `dns.BADFAMILY`: عائلة عناوين غير مدعومة.
- `dns.BADRESP`: رد DNS بتنسيق خاطئ.
- `dns.CONNREFUSED`: تعذر الاتصال بخوادم DNS.
- `dns.TIMEOUT`: المهلة أثناء الاتصال بخوادم DNS.
- `dns.EOF`: نهاية الملف.
- `dns.FILE`: خطأ في قراءة الملف.
- `dns.NOMEM`: نفاد الذاكرة.
- `dns.DESTRUCTION`: يتم تدمير القناة.
- `dns.BADSTR`: سلسلة بتنسيق خاطئ.
- `dns.BADFLAGS`: تم تحديد علامات غير قانونية.
- `dns.NONAME`: اسم المضيف المحدد ليس رقميًا.
- `dns.BADHINTS`: تم تحديد علامات تلميحات غير قانونية.
- `dns.NOTINITIALIZED`: لم يتم إجراء تهيئة مكتبة c-ares بعد.
- `dns.LOADIPHLPAPI`: خطأ في تحميل `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: تعذر العثور على وظيفة `GetNetworkParams`.
- `dns.CANCELLED`: تم إلغاء استعلام DNS.

تقوم واجهة برمجة التطبيقات `dnsPromises` أيضًا بتصدير رموز الأخطاء المذكورة أعلاه، على سبيل المثال، `dnsPromises.NODATA`.

## اعتبارات التنفيذ {#implementation-considerations}

على الرغم من أن [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) ووظائف `dns.resolve*()/dns.reverse()` المختلفة لها نفس الهدف المتمثل في ربط اسم شبكة بعنوان شبكة (أو العكس)، إلا أن سلوكها مختلف تمامًا. يمكن أن يكون لهذه الاختلافات عواقب دقيقة ولكنها كبيرة على سلوك برامج Node.js.

### `dns.lookup()` {#dnslookup}

في الخلفية، تستخدم [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) نفس تسهيلات نظام التشغيل مثل معظم البرامج الأخرى. على سبيل المثال، ستقوم [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) دائمًا تقريبًا بحل اسم معين بنفس طريقة الأمر `ping`. في معظم أنظمة التشغيل الشبيهة بـ POSIX، يمكن تعديل سلوك وظيفة [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback) عن طريق تغيير الإعدادات في [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) و/أو [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5)، ولكن تغيير هذه الملفات سيغير سلوك جميع البرامج الأخرى التي تعمل على نفس نظام التشغيل.

على الرغم من أن استدعاء `dns.lookup()` سيكون غير متزامن من منظور JavaScript، إلا أنه يتم تنفيذه كاستدعاء متزامن لـ [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) يعمل على مجموعة مؤشرات الترابط libuv. يمكن أن يكون لهذا آثار سلبية مفاجئة على الأداء لبعض التطبيقات، راجع وثائق [`UV_THREADPOOL_SIZE`](/ar/nodejs/api/cli#uv_threadpool_sizesize) لمزيد من المعلومات.

ستستدعي واجهات برمجة تطبيقات الشبكات المختلفة `dns.lookup()` داخليًا لحل أسماء المضيفين. إذا كانت هذه مشكلة، ففكر في حل اسم المضيف إلى عنوان باستخدام `dns.resolve()` واستخدام العنوان بدلاً من اسم المضيف. أيضًا، تسمح بعض واجهات برمجة تطبيقات الشبكات (مثل [`socket.connect()`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) و [`dgram.createSocket()`](/ar/nodejs/api/dgram#dgramcreatesocketoptions-callback)) باستبدال المحلل الافتراضي، `dns.lookup()`.


### `dns.resolve()`, `dns.resolve*()`, and `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

تُنفَّذ هذه الدوال بشكل مختلف تمامًا عن [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback). فهي لا تستخدم [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) وتقوم *دائمًا* بإجراء استعلام DNS على الشبكة. يتم هذا الاتصال الشبكي دائمًا بشكل غير متزامن ولا يستخدم مجمع مؤشرات الترابط الخاص بـ libuv.

نتيجة لذلك، لا يمكن أن يكون لهذه الدوال نفس التأثير السلبي على المعالجة الأخرى التي تحدث على مجمع مؤشرات الترابط الخاص بـ libuv الذي يمكن أن تحدثه [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback).

إنها لا تستخدم نفس مجموعة ملفات التكوين التي تستخدمها [`dns.lookup()`](/ar/nodejs/api/dns#dnslookuphostname-options-callback). على سبيل المثال، فهي لا تستخدم التكوين من `/etc/hosts`.

