---
title: توثيق وحدة OS في Node.js
description: توفر وحدة OS في Node.js عددًا من الأساليب المساعدة المتعلقة بنظام التشغيل. يمكن استخدامها للتفاعل مع نظام التشغيل الأساسي، واسترجاع معلومات النظام، وتنفيذ العمليات على مستوى النظام.
head:
  - - meta
    - name: og:title
      content: توثيق وحدة OS في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة OS في Node.js عددًا من الأساليب المساعدة المتعلقة بنظام التشغيل. يمكن استخدامها للتفاعل مع نظام التشغيل الأساسي، واسترجاع معلومات النظام، وتنفيذ العمليات على مستوى النظام.
  - - meta
    - name: twitter:title
      content: توثيق وحدة OS في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة OS في Node.js عددًا من الأساليب المساعدة المتعلقة بنظام التشغيل. يمكن استخدامها للتفاعل مع نظام التشغيل الأساسي، واسترجاع معلومات النظام، وتنفيذ العمليات على مستوى النظام.
---


# نظام التشغيل (OS) {#os}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**كود المصدر:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

توفر الوحدة النمطية `node:os` طرقًا وخصائص مساعدة متعلقة بنظام التشغيل. يمكن الوصول إليها باستخدام:

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**أضيف في: الإصدار 0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

علامة نهاية السطر الخاصة بنظام التشغيل.

- `\n` على POSIX
- `\r\n` على نظام التشغيل Windows

## `os.availableParallelism()` {#osavailableparallelism}

**أضيف في: الإصدار 19.4.0، الإصدار 18.14.0**

- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع تقدير للمقدار الافتراضي للتوازي الذي يجب أن يستخدمه البرنامج. يُرجع دائمًا قيمة أكبر من الصفر.

هذه الوظيفة عبارة عن غلاف صغير حول [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) الخاص بـ libuv.

## `os.arch()` {#osarch}

**أضيف في: الإصدار 0.5.0**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع بنية وحدة المعالجة المركزية (CPU) لنظام التشغيل الذي تم تجميع ثنائي Node.js له. القيم المحتملة هي `'arm'` و `'arm64'` و `'ia32'` و `'loong64'` و `'mips'` و `'mipsel'` و `'ppc'` و `'ppc64'` و `'riscv64'` و `'s390'` و `'s390x'` و `'x64'`.

قيمة الإرجاع مكافئة لـ [`process.arch`](/ar/nodejs/api/process#processarch).

## `os.constants` {#osconstants}

**أضيف في: الإصدار 6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يحتوي على ثوابت خاصة بنظام التشغيل شائعة الاستخدام لرموز الخطأ وإشارات العملية وما إلى ذلك. الثوابت المحددة المحددة موصوفة في [ثوابت نظام التشغيل](/ar/nodejs/api/os#os-constants).

## `os.cpus()` {#oscpus}

**أضيف في: الإصدار 0.3.3**

- الإرجاع: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع مصفوفة من الكائنات التي تحتوي على معلومات حول كل نواة وحدة معالجة مركزية منطقية. ستكون المصفوفة فارغة إذا لم تتوفر أي معلومات عن وحدة المعالجة المركزية، على سبيل المثال إذا كان نظام الملفات `/proc` غير متاح.

تشمل الخصائص المضمنة في كل كائن ما يلي:

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (بالميجاهرتز)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي قضتها وحدة المعالجة المركزية في وضع المستخدم.
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي قضتها وحدة المعالجة المركزية في وضع لطيف.
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي قضتها وحدة المعالجة المركزية في وضع sys.
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي قضتها وحدة المعالجة المركزية في وضع الخمول.
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي قضتها وحدة المعالجة المركزية في وضع irq.

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

قيم `nice` خاصة بنظام POSIX فقط. في نظام التشغيل Windows، تكون قيم `nice` لجميع المعالجات دائمًا 0.

يجب عدم استخدام `os.cpus().length` لحساب مقدار التوازي المتاح للتطبيق. استخدم [`os.availableParallelism()`](/ar/nodejs/api/os#osavailableparallelism) لهذا الغرض.


## `os.devNull` {#osdevnull}

**تمت الإضافة في: الإصدار 16.3.0، الإصدار 14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مسار الملف الخاص بالنظام الأساسي للجهاز الفارغ.

- `\\.\nul` على نظام التشغيل Windows
- `/dev/null` على نظام التشغيل POSIX

## `os.endianness()` {#osendianness}

**تمت الإضافة في: الإصدار 0.9.4**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع سلسلة تحدد ترتيب البايتات لوحدة المعالجة المركزية التي تم تجميع برنامج Node.js الثنائي من أجلها.

القيم المحتملة هي `'BE'` لـ big endian و `'LE'` لـ little endian.

## `os.freemem()` {#osfreemem}

**تمت الإضافة في: الإصدار 0.3.3**

- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع مقدار ذاكرة النظام الحرة بالبايتات كعدد صحيح.

## `os.getPriority([pid])` {#osgetprioritypid}

**تمت الإضافة في: الإصدار 10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف العملية (process ID) لاسترداد أولوية الجدولة لها. **افتراضي:** `0`.
- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع أولوية الجدولة للعملية المحددة بواسطة `pid`. إذا لم يتم توفير `pid` أو كانت `0`، فسيتم إرجاع أولوية العملية الحالية.

## `os.homedir()` {#oshomedir}

**تمت الإضافة في: الإصدار 2.3.0**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع مسار السلسلة للدليل الرئيسي للمستخدم الحالي.

على نظام التشغيل POSIX، فإنه يستخدم متغير البيئة `$HOME` إذا تم تعريفه. وإلا فإنه يستخدم [UID الفعال](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) للبحث عن الدليل الرئيسي للمستخدم.

على نظام التشغيل Windows، فإنه يستخدم متغير البيئة `USERPROFILE` إذا تم تعريفه. وإلا فإنه يستخدم المسار إلى دليل ملف تعريف المستخدم الحالي.

## `os.hostname()` {#oshostname}

**تمت الإضافة في: الإصدار 0.3.3**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع اسم مضيف نظام التشغيل كسلسلة.


## `os.loadavg()` {#osloadavg}

**أضيف في: v0.3.3**

- الإرجاع: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع مصفوفة تحتوي على متوسطات التحميل لمدة 1 و 5 و 15 دقيقة.

متوسط التحميل هو مقياس لنشاط النظام يتم حسابه بواسطة نظام التشغيل ويعبر عنه كرقم كسري.

متوسط التحميل هو مفهوم خاص بنظام Unix. في نظام التشغيل Windows، تكون القيمة المرجعة دائمًا `[0, 0, 0]`.

## `os.machine()` {#osmachine}

**أضيف في: v18.9.0, v16.18.0**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع نوع الجهاز كسلسلة نصية، مثل `arm`، `arm64`، `aarch64`، `mips`، `mips64`، `ppc64`، `ppc64le`، `s390`، `s390x`، `i386`، `i686`، `x86_64`.

في أنظمة POSIX، يتم تحديد نوع الجهاز عن طريق استدعاء [`uname(3)`](https://linux.die.net/man/3/uname). في نظام التشغيل Windows، يتم استخدام `RtlGetVersion()`، وإذا لم يكن متاحًا، فسيتم استخدام `GetVersionExW()`. انظر [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) لمزيد من المعلومات.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v18.4.0 | تعرض خاصية `family` الآن سلسلة نصية بدلاً من رقم. |
| v18.0.0 | تعرض خاصية `family` الآن رقمًا بدلاً من سلسلة نصية. |
| v0.6.0 | أضيف في: v0.6.0 |
:::

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع كائن يحتوي على واجهات الشبكة التي تم تخصيص عنوان شبكة لها.

يحدد كل مفتاح في الكائن المرجع واجهة شبكة. القيمة المرتبطة هي عبارة عن مصفوفة من الكائنات تصف كل منها عنوان شبكة مخصص.

تتضمن الخصائص المتاحة في كائن عنوان الشبكة المخصص ما يلي:

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان IPv4 أو IPv6 المخصص
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قناع شبكة IPv4 أو IPv6
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إما `IPv4` أو `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان MAC الخاص بواجهة الشبكة
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا كانت واجهة الشبكة عبارة عن حلقة وصل أو واجهة مماثلة لا يمكن الوصول إليها عن بُعد؛ وإلا `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرف نطاق IPv6 الرقمي (يتم تحديده فقط عندما تكون `family` هي `IPv6`)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عنوان IPv4 أو IPv6 المخصص مع بادئة التوجيه في تدوين CIDR. إذا كان `netmask` غير صالح، فسيتم تعيين هذه الخاصية على `null`.

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**أضيف في:** الإصدار v0.5.0

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع سلسلة تحدد نظام تشغيل المنصة التي تم تجميع Node.js الثنائي لها. يتم تعيين القيمة في وقت التجميع. القيم المحتملة هي `'aix'` و `'darwin'` و `'freebsd'` و `'linux'` و `'openbsd'` و `'sunos'` و `'win32'`.

القيمة المعادة تعادل [`process.platform`](/ar/nodejs/api/process#processplatform).

يمكن أيضًا إرجاع القيمة `'android'` إذا تم بناء Node.js على نظام التشغيل Android. [دعم Android تجريبي](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**أضيف في:** الإصدار v0.3.3

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع نظام التشغيل كسلسلة.

في أنظمة POSIX، يتم تحديد إصدار نظام التشغيل عن طريق استدعاء [`uname(3)`](https://linux.die.net/man/3/uname). في نظام Windows، يتم استخدام `GetVersionExW()`. راجع [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) لمزيد من المعلومات.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**أضيف في:** الإصدار v10.10.0

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) معرّف العملية لتعيين أولوية الجدولة لها. **افتراضي:** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) أولوية الجدولة المراد تعيينها للعملية.

يحاول تعيين أولوية الجدولة للعملية المحددة بواسطة `pid`. إذا لم يتم توفير `pid` أو كانت `0`، يتم استخدام معرّف عملية العملية الحالية.

يجب أن يكون إدخال `priority` عددًا صحيحًا بين `-20` (أولوية عالية) و `19` (أولوية منخفضة). نظرًا للاختلافات بين مستويات أولوية Unix وفئات أولوية Windows، يتم تعيين `priority` إلى أحد ثوابت الأولوية الستة في `os.constants.priority`. عند استرداد مستوى أولوية العملية، قد يؤدي تعيين النطاق هذا إلى أن تكون القيمة المرتجعة مختلفة قليلاً في Windows. لتجنب الارتباك، قم بتعيين `priority` إلى أحد ثوابت الأولوية.

في نظام التشغيل Windows، يتطلب تعيين الأولوية إلى `PRIORITY_HIGHEST` امتيازات مستخدم مرتفعة. وإلا، سيتم تخفيض الأولوية المحددة بصمت إلى `PRIORITY_HIGH`.


## `os.tmpdir()` {#ostmpdir}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v2.0.0 | هذه الوظيفة الآن متوافقة عبر الأنظمة الأساسية ولم تعد تُرجع مسارًا مع شرطة مائلة لاحقة على أي نظام أساسي. |
| الإصدار v0.9.9 | تمت الإضافة في: الإصدار v0.9.9 |
:::

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع الدليل الافتراضي لنظام التشغيل للملفات المؤقتة كسلسلة نصية.

في نظام التشغيل Windows، يمكن تجاوز النتيجة بواسطة متغيرات البيئة `TEMP` و `TMP`، وتأخذ `TEMP` الأولوية على `TMP`. إذا لم يتم تعيين أي منهما، فإنه يتم افتراضيًا إلى `%SystemRoot%\temp` أو `%windir%\temp`.

على الأنظمة الأساسية غير Windows، سيتم التحقق من متغيرات البيئة `TMPDIR` و `TMP` و `TEMP` لتجاوز نتيجة هذه الطريقة، بالترتيب الموصوف. إذا لم يتم تعيين أي منها، فإنه يتم افتراضيًا إلى `/tmp`.

تقوم بعض توزيعات نظام التشغيل إما بتكوين `TMPDIR` (غير Windows) أو `TEMP` و `TMP` (Windows) افتراضيًا بدون تكوينات إضافية من قبل مسؤولي النظام. تعكس نتيجة `os.tmpdir()` عادةً تفضيل النظام ما لم يتم تجاوزها صراحةً من قبل المستخدمين.

## `os.totalmem()` {#ostotalmem}

**تمت الإضافة في: الإصدار v0.3.3**

- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع إجمالي مقدار ذاكرة النظام بالبايتات كعدد صحيح.

## `os.type()` {#ostype}

**تمت الإضافة في: الإصدار v0.3.3**

- الإرجاع: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

يُرجع اسم نظام التشغيل كما تم إرجاعه بواسطة [`uname(3)`](https://linux.die.net/man/3/uname). على سبيل المثال، يُرجع `'Linux'` على Linux، و `'Darwin'` على macOS، و `'Windows_NT'` على Windows.

راجع [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) للحصول على معلومات إضافية حول مخرجات تشغيل [`uname(3)`](https://linux.die.net/man/3/uname) على أنظمة تشغيل مختلفة.

## `os.uptime()` {#osuptime}


::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v10.0.0 | لم تعد نتيجة هذه الوظيفة تحتوي على مكون كسري في نظام التشغيل Windows. |
| الإصدار v0.3.3 | تمت الإضافة في: الإصدار v0.3.3 |
:::

- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

يُرجع وقت تشغيل النظام بعدد الثواني.


## `os.userInfo([options])` {#osuserinfooptions}

**تمت إضافته في: الإصدار v6.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ترميز الأحرف المستخدم لتفسير السلاسل الناتجة. إذا تم تعيين `encoding` إلى `'buffer'`، فستكون قيم `username` و `shell` و `homedir` مثيلات `Buffer`. **الافتراضي:** `'utf8'`.
  
 
- يعيد: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع معلومات حول المستخدم الفعال حاليًا. على منصات POSIX، عادةً ما يكون هذا جزءًا فرعيًا من ملف كلمة المرور. يتضمن الكائن الذي تم إرجاعه `username` و `uid` و `gid` و `shell` و `homedir`. في نظام التشغيل Windows، تكون الحقول `uid` و `gid` هي `-1`، و `shell` هي `null`.

يتم توفير قيمة `homedir` التي تم إرجاعها بواسطة `os.userInfo()` بواسطة نظام التشغيل. يختلف هذا عن نتيجة `os.homedir()`، الذي يستعلم عن متغيرات البيئة للدليل الرئيسي قبل الرجوع إلى استجابة نظام التشغيل.

يطرح [`SystemError`](/ar/nodejs/api/errors#class-systemerror) إذا لم يكن لدى المستخدم `username` أو `homedir`.

## `os.version()` {#osversion}

**تمت إضافته في: الإصدار v13.11.0، v12.17.0**

- يعيد: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع سلسلة تحدد إصدار النواة.

في أنظمة POSIX، يتم تحديد إصدار نظام التشغيل عن طريق استدعاء [`uname(3)`](https://linux.die.net/man/3/uname). في نظام التشغيل Windows، يتم استخدام `RtlGetVersion()`، وإذا لم يكن متاحًا، فسيتم استخدام `GetVersionExW()`. راجع [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) لمزيد من المعلومات.

## ثوابت نظام التشغيل {#os-constants}

يتم تصدير الثوابت التالية بواسطة `os.constants`.

لن تكون جميع الثوابت متاحة على كل نظام تشغيل.

### ثوابت الإشارة {#signal-constants}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.11.0 | تمت إضافة دعم `SIGINFO`. |
:::

يتم تصدير ثوابت الإشارة التالية بواسطة `os.constants.signals`.

| الثابت | الوصف |
| --- | --- |
| `SIGHUP` | يتم إرسالها للإشارة إلى متى يتم إغلاق وحدة طرفية متحكمة أو خروج عملية أصل. |
| `SIGINT` | يتم إرسالها للإشارة إلى متى يرغب المستخدم في مقاطعة عملية (    +    ). |
| `SIGQUIT` | يتم إرسالها للإشارة إلى متى يرغب المستخدم في إنهاء عملية وإجراء تفريغ أساسي. |
| `SIGILL` | يتم إرسالها إلى عملية لإعلامها بأنها حاولت تنفيذ تعليمات غير قانونية أو مشوهة أو غير معروفة أو مميزة. |
| `SIGTRAP` | يتم إرسالها إلى عملية عند حدوث استثناء. |
| `SIGABRT` | يتم إرسالها إلى عملية لطلب إجهاضها. |
| `SIGIOT` | مرادف لـ `SIGABRT` |
| `SIGBUS` | يتم إرسالها إلى عملية لإعلامها بأنها تسببت في خطأ في الناقل. |
| `SIGFPE` | يتم إرسالها إلى عملية لإعلامها بأنها أجرت عملية حسابية غير قانونية. |
| `SIGKILL` | يتم إرسالها إلى عملية لإنهاءها على الفور. |
| `SIGUSR1`     `SIGUSR2` | يتم إرسالها إلى عملية لتحديد الشروط المعرفة من قبل المستخدم. |
| `SIGSEGV` | يتم إرسالها إلى عملية للإعلام بخطأ تجزئة. |
| `SIGPIPE` | يتم إرسالها إلى عملية عندما تحاول الكتابة إلى أنبوب منفصل. |
| `SIGALRM` | يتم إرسالها إلى عملية عند انقضاء مؤقت النظام. |
| `SIGTERM` | يتم إرسالها إلى عملية لطلب الإنهاء. |
| `SIGCHLD` | يتم إرسالها إلى عملية عند انتهاء عملية فرعية. |
| `SIGSTKFLT` | يتم إرسالها إلى عملية للإشارة إلى خطأ في المكدس على معالج مساعد. |
| `SIGCONT` | يتم إرسالها لإرشاد نظام التشغيل لمتابعة عملية متوقفة مؤقتًا. |
| `SIGSTOP` | يتم إرسالها لإرشاد نظام التشغيل لإيقاف عملية. |
| `SIGTSTP` | يتم إرسالها إلى عملية لطلب إيقافها. |
| `SIGBREAK` | يتم إرسالها للإشارة إلى متى يرغب المستخدم في مقاطعة عملية. |
| `SIGTTIN` | يتم إرسالها إلى عملية عندما تقرأ من TTY أثناء وجودها في الخلفية. |
| `SIGTTOU` | يتم إرسالها إلى عملية عندما تكتب إلى TTY أثناء وجودها في الخلفية. |
| `SIGURG` | يتم إرسالها إلى عملية عندما يكون لدى المقبس بيانات عاجلة للقراءة. |
| `SIGXCPU` | يتم إرسالها إلى عملية عندما تتجاوز حدها على استخدام وحدة المعالجة المركزية. |
| `SIGXFSZ` | يتم إرسالها إلى عملية عندما ينمو ملف أكبر من الحد الأقصى المسموح به. |
| `SIGVTALRM` | يتم إرسالها إلى عملية عند انقضاء مؤقت افتراضي. |
| `SIGPROF` | يتم إرسالها إلى عملية عند انقضاء مؤقت النظام. |
| `SIGWINCH` | يتم إرسالها إلى عملية عندما تقوم الوحدة الطرفية المتحكمة بتغيير حجمها. |
| `SIGIO` | يتم إرسالها إلى عملية عندما يكون الإدخال/الإخراج متاحًا. |
| `SIGPOLL` | مرادف لـ `SIGIO` |
| `SIGLOST` | يتم إرسالها إلى عملية عند فقدان قفل الملف. |
| `SIGPWR` | يتم إرسالها إلى عملية للإعلام بفشل الطاقة. |
| `SIGINFO` | مرادف لـ `SIGPWR` |
| `SIGSYS` | يتم إرسالها إلى عملية للإعلام بوجود وسيطة سيئة. |
| `SIGUNUSED` | مرادف لـ `SIGSYS` |


### ثوابت الخطأ {#error-constants}

يتم تصدير ثوابت الخطأ التالية بواسطة `os.constants.errno`.

#### ثوابت خطأ POSIX {#posix-error-constants}

| الثابت | الوصف |
| --- | --- |
| `E2BIG` | يشير إلى أن قائمة الوسائط أطول من المتوقع. |
| `EACCES` | يشير إلى أن العملية لم يكن لديها أذونات كافية. |
| `EADDRINUSE` | يشير إلى أن عنوان الشبكة قيد الاستخدام بالفعل. |
| `EADDRNOTAVAIL` | يشير إلى أن عنوان الشبكة غير متاح حاليًا للاستخدام. |
| `EAFNOSUPPORT` | يشير إلى أن عائلة عنوان الشبكة غير مدعومة. |
| `EAGAIN` | يشير إلى عدم وجود بيانات متاحة وإعادة محاولة العملية لاحقًا. |
| `EALREADY` | يشير إلى أن المقبس لديه بالفعل اتصال معلق قيد التقدم. |
| `EBADF` | يشير إلى أن واصف الملف غير صالح. |
| `EBADMSG` | يشير إلى رسالة بيانات غير صالحة. |
| `EBUSY` | يشير إلى أن الجهاز أو المورد مشغول. |
| `ECANCELED` | يشير إلى إلغاء العملية. |
| `ECHILD` | يشير إلى عدم وجود عمليات فرعية. |
| `ECONNABORTED` | يشير إلى أن اتصال الشبكة قد تم إنهاؤه. |
| `ECONNREFUSED` | يشير إلى أن اتصال الشبكة قد تم رفضه. |
| `ECONNRESET` | يشير إلى إعادة تعيين اتصال الشبكة. |
| `EDEADLK` | يشير إلى تجنب حدوث حالة توقف تام للموارد. |
| `EDESTADDRREQ` | يشير إلى أن عنوان الوجهة مطلوب. |
| `EDOM` | يشير إلى أن وسيطة خارج نطاق الدالة. |
| `EDQUOT` | يشير إلى تجاوز حصة القرص. |
| `EEXIST` | يشير إلى أن الملف موجود بالفعل. |
| `EFAULT` | يشير إلى عنوان مؤشر غير صالح. |
| `EFBIG` | يشير إلى أن الملف كبير جدًا. |
| `EHOSTUNREACH` | يشير إلى أن المضيف غير قابل للوصول. |
| `EIDRM` | يشير إلى إزالة المعرف. |
| `EILSEQ` | يشير إلى تسلسل بايت غير قانوني. |
| `EINPROGRESS` | يشير إلى أن العملية قيد التقدم بالفعل. |
| `EINTR` | يشير إلى مقاطعة استدعاء الدالة. |
| `EINVAL` | يشير إلى تقديم وسيطة غير صالحة. |
| `EIO` | يشير إلى خطأ إدخال/إخراج غير محدد بخلاف ذلك. |
| `EISCONN` | يشير إلى أن المقبس متصل. |
| `EISDIR` | يشير إلى أن المسار عبارة عن دليل. |
| `ELOOP` | يشير إلى وجود الكثير من مستويات الروابط الرمزية في المسار. |
| `EMFILE` | يشير إلى وجود عدد كبير جدًا من الملفات المفتوحة. |
| `EMLINK` | يشير إلى وجود عدد كبير جدًا من الروابط الثابتة إلى ملف. |
| `EMSGSIZE` | يشير إلى أن الرسالة المقدمة طويلة جدًا. |
| `EMULTIHOP` | يشير إلى محاولة إجراء عملية متعددة الوثبات. |
| `ENAMETOOLONG` | يشير إلى أن اسم الملف طويل جدًا. |
| `ENETDOWN` | يشير إلى أن الشبكة معطلة. |
| `ENETRESET` | يشير إلى إنهاء الاتصال بواسطة الشبكة. |
| `ENETUNREACH` | يشير إلى أن الشبكة غير قابلة للوصول. |
| `ENFILE` | يشير إلى وجود عدد كبير جدًا من الملفات المفتوحة في النظام. |
| `ENOBUFS` | يشير إلى عدم توفر مساحة تخزين مؤقتة. |
| `ENODATA` | يشير إلى عدم توفر أي رسالة في قائمة انتظار القراءة لرأس الدفق. |
| `ENODEV` | يشير إلى عدم وجود مثل هذا الجهاز. |
| `ENOENT` | يشير إلى عدم وجود مثل هذا الملف أو الدليل. |
| `ENOEXEC` | يشير إلى خطأ في تنسيق exec. |
| `ENOLCK` | يشير إلى عدم توفر أي أقفال. |
| `ENOLINK` | يشير إلى قطع الاتصال. |
| `ENOMEM` | يشير إلى عدم وجود مساحة كافية. |
| `ENOMSG` | يشير إلى عدم وجود رسالة من النوع المطلوب. |
| `ENOPROTOOPT` | يشير إلى عدم توفر بروتوكول معين. |
| `ENOSPC` | يشير إلى عدم توفر مساحة على الجهاز. |
| `ENOSR` | يشير إلى عدم توفر موارد دفق. |
| `ENOSTR` | يشير إلى أن المورد المحدد ليس دفقًا. |
| `ENOSYS` | يشير إلى عدم تنفيذ الدالة. |
| `ENOTCONN` | يشير إلى أن المقبس غير متصل. |
| `ENOTDIR` | يشير إلى أن المسار ليس دليلًا. |
| `ENOTEMPTY` | يشير إلى أن الدليل ليس فارغًا. |
| `ENOTSOCK` | يشير إلى أن العنصر المحدد ليس مقبسًا. |
| `ENOTSUP` | يشير إلى أن العملية المحددة غير مدعومة. |
| `ENOTTY` | يشير إلى عملية تحكم إدخال/إخراج غير مناسبة. |
| `ENXIO` | يشير إلى عدم وجود مثل هذا الجهاز أو العنوان. |
| `EOPNOTSUPP` | يشير إلى أن العملية غير مدعومة على المقبس. على الرغم من أن `ENOTSUP` و `EOPNOTSUPP` لهما نفس القيمة على Linux، وفقًا لـ POSIX.1، يجب أن تكون قيم الخطأ هذه متميزة.) |
| `EOVERFLOW` | يشير إلى أن القيمة كبيرة جدًا بحيث لا يمكن تخزينها في نوع بيانات معين. |
| `EPERM` | يشير إلى أن العملية غير مسموح بها. |
| `EPIPE` | يشير إلى أنبوب مكسور. |
| `EPROTO` | يشير إلى خطأ في البروتوكول. |
| `EPROTONOSUPPORT` | يشير إلى أن البروتوكول غير مدعوم. |
| `EPROTOTYPE` | يشير إلى النوع الخاطئ من البروتوكول للمقبس. |
| `ERANGE` | يشير إلى أن النتائج كبيرة جدًا. |
| `EROFS` | يشير إلى أن نظام الملفات للقراءة فقط. |
| `ESPIPE` | يشير إلى عملية بحث غير صالحة. |
| `ESRCH` | يشير إلى عدم وجود مثل هذه العملية. |
| `ESTALE` | يشير إلى أن معرّف الملف قديم. |
| `ETIME` | يشير إلى انتهاء صلاحية المؤقت. |
| `ETIMEDOUT` | يشير إلى انتهاء مهلة الاتصال. |
| `ETXTBSY` | يشير إلى أن ملف نصي مشغول. |
| `EWOULDBLOCK` | يشير إلى أن العملية ستحظر. |
| `EXDEV` | يشير إلى رابط غير صحيح. |


#### ثوابت الأخطاء الخاصة بنظام التشغيل Windows {#windows-specific-error-constants}

رموز الأخطاء التالية خاصة بنظام التشغيل Windows.

| ثابت | الوصف |
|---|---|
| `WSAEINTR` | يشير إلى مقاطعة استدعاء دالة. |
| `WSAEBADF` | يشير إلى معالج ملف غير صالح. |
| `WSAEACCES` | يشير إلى عدم كفاية الأذونات لإكمال العملية. |
| `WSAEFAULT` | يشير إلى عنوان مؤشر غير صالح. |
| `WSAEINVAL` | يشير إلى تمرير وسيطة غير صالحة. |
| `WSAEMFILE` | يشير إلى وجود عدد كبير جدًا من الملفات المفتوحة. |
| `WSAEWOULDBLOCK` | يشير إلى أن موردًا غير متاح مؤقتًا. |
| `WSAEINPROGRESS` | يشير إلى أن عملية قيد التقدم حاليًا. |
| `WSAEALREADY` | يشير إلى أن عملية قيد التقدم بالفعل. |
| `WSAENOTSOCK` | يشير إلى أن المورد ليس مأخذ توصيل. |
| `WSAEDESTADDRREQ` | يشير إلى أن عنوان الوجهة مطلوب. |
| `WSAEMSGSIZE` | يشير إلى أن حجم الرسالة طويل جدًا. |
| `WSAEPROTOTYPE` | يشير إلى نوع البروتوكول الخاطئ لمأخذ التوصيل. |
| `WSAENOPROTOOPT` | يشير إلى خيار بروتوكول سيئ. |
| `WSAEPROTONOSUPPORT` | يشير إلى أن البروتوكول غير مدعوم. |
| `WSAESOCKTNOSUPPORT` | يشير إلى أن نوع مأخذ التوصيل غير مدعوم. |
| `WSAEOPNOTSUPP` | يشير إلى أن العملية غير مدعومة. |
| `WSAEPFNOSUPPORT` | يشير إلى أن عائلة البروتوكولات غير مدعومة. |
| `WSAEAFNOSUPPORT` | يشير إلى أن عائلة العناوين غير مدعومة. |
| `WSAEADDRINUSE` | يشير إلى أن عنوان الشبكة قيد الاستخدام بالفعل. |
| `WSAEADDRNOTAVAIL` | يشير إلى أن عنوان الشبكة غير متاح. |
| `WSAENETDOWN` | يشير إلى أن الشبكة معطلة. |
| `WSAENETUNREACH` | يشير إلى أن الشبكة غير قابلة للوصول. |
| `WSAENETRESET` | يشير إلى إعادة تعيين اتصال الشبكة. |
| `WSAECONNABORTED` | يشير إلى إلغاء الاتصال. |
| `WSAECONNRESET` | يشير إلى إعادة تعيين الاتصال بواسطة النظير. |
| `WSAENOBUFS` | يشير إلى عدم توفر مساحة تخزين مؤقت. |
| `WSAEISCONN` | يشير إلى أن مأخذ التوصيل متصل بالفعل. |
| `WSAENOTCONN` | يشير إلى أن مأخذ التوصيل غير متصل. |
| `WSAESHUTDOWN` | يشير إلى أنه لا يمكن إرسال البيانات بعد إيقاف تشغيل مأخذ التوصيل. |
| `WSAETOOMANYREFS` | يشير إلى وجود عدد كبير جدًا من المراجع. |
| `WSAETIMEDOUT` | يشير إلى انتهاء مهلة الاتصال. |
| `WSAECONNREFUSED` | يشير إلى رفض الاتصال. |
| `WSAELOOP` | يشير إلى أنه لا يمكن ترجمة الاسم. |
| `WSAENAMETOOLONG` | يشير إلى أن الاسم طويل جدًا. |
| `WSAEHOSTDOWN` | يشير إلى أن مضيف الشبكة معطل. |
| `WSAEHOSTUNREACH` | يشير إلى عدم وجود مسار إلى مضيف الشبكة. |
| `WSAENOTEMPTY` | يشير إلى أن الدليل ليس فارغًا. |
| `WSAEPROCLIM` | يشير إلى وجود عدد كبير جدًا من العمليات. |
| `WSAEUSERS` | يشير إلى تجاوز حصة المستخدم. |
| `WSAEDQUOT` | يشير إلى تجاوز حصة القرص. |
| `WSAESTALE` | يشير إلى مرجع معالج ملف قديم. |
| `WSAEREMOTE` | يشير إلى أن العنصر بعيد. |
| `WSASYSNOTREADY` | يشير إلى أن النظام الفرعي للشبكة غير جاهز. |
| `WSAVERNOTSUPPORTED` | يشير إلى أن إصدار  `winsock.dll`  خارج النطاق. |
| `WSANOTINITIALISED` | يشير إلى أنه لم يتم تنفيذ WSAStartup بنجاح بعد. |
| `WSAEDISCON` | يشير إلى أن الإغلاق السلس قيد التقدم. |
| `WSAENOMORE` | يشير إلى عدم وجود المزيد من النتائج. |
| `WSAECANCELLED` | يشير إلى إلغاء العملية. |
| `WSAEINVALIDPROCTABLE` | يشير إلى أن جدول استدعاء الإجراء غير صالح. |
| `WSAEINVALIDPROVIDER` | يشير إلى موفر خدمة غير صالح. |
| `WSAEPROVIDERFAILEDINIT` | يشير إلى فشل تهيئة موفر الخدمة. |
| `WSASYSCALLFAILURE` | يشير إلى فشل استدعاء النظام. |
| `WSASERVICE_NOT_FOUND` | يشير إلى عدم العثور على خدمة. |
| `WSATYPE_NOT_FOUND` | يشير إلى عدم العثور على نوع فئة. |
| `WSA_E_NO_MORE` | يشير إلى عدم وجود المزيد من النتائج. |
| `WSA_E_CANCELLED` | يشير إلى إلغاء المكالمة. |
| `WSAEREFUSED` | يشير إلى رفض استعلام قاعدة البيانات. |


### ثوابت dlopen {#dlopen-constants}

إذا كانت متاحة على نظام التشغيل، يتم تصدير الثوابت التالية في `os.constants.dlopen`. راجع [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) للحصول على معلومات مفصلة.

| ثابت | الوصف |
|---|---|
| `RTLD_LAZY` | تنفيذ الربط الكسول. يقوم Node.js بتعيين هذه العلامة افتراضيًا. |
| `RTLD_NOW` | حل جميع الرموز غير المعرفة في المكتبة قبل أن ترجع `dlopen(3)`. |
| `RTLD_GLOBAL` | سيتم إتاحة الرموز التي تحددها المكتبة لحل رموز المكتبات التي تم تحميلها لاحقًا. |
| `RTLD_LOCAL` | عكس `RTLD_GLOBAL`. هذا هو السلوك الافتراضي إذا لم يتم تحديد أي علامة. |
| `RTLD_DEEPBIND` | اجعل المكتبة القائمة بذاتها تستخدم رموزها الخاصة بدلاً من رموز المكتبات التي تم تحميلها مسبقًا. |
### ثوابت الأولوية {#priority-constants}

**تمت الإضافة في: الإصدار 10.10.0**

يتم تصدير ثوابت جدولة العمليات التالية بواسطة `os.constants.priority`.

| ثابت | الوصف |
|---|---|
| `PRIORITY_LOW` | أقل أولوية لجدولة العمليات. يتوافق هذا مع `IDLE_PRIORITY_CLASS` على نظام Windows، وقيمة لطيفة قدرها `19` على جميع الأنظمة الأساسية الأخرى. |
| `PRIORITY_BELOW_NORMAL` | أولوية جدولة العمليات أعلى من `PRIORITY_LOW` وأقل من `PRIORITY_NORMAL`. يتوافق هذا مع `BELOW_NORMAL_PRIORITY_CLASS` على نظام Windows، وقيمة لطيفة قدرها `10` على جميع الأنظمة الأساسية الأخرى. |
| `PRIORITY_NORMAL` | أولوية جدولة العمليات الافتراضية. يتوافق هذا مع `NORMAL_PRIORITY_CLASS` على نظام Windows، وقيمة لطيفة قدرها `0` على جميع الأنظمة الأساسية الأخرى. |
| `PRIORITY_ABOVE_NORMAL` | أولوية جدولة العمليات أعلى من `PRIORITY_NORMAL` وأقل من `PRIORITY_HIGH`. يتوافق هذا مع `ABOVE_NORMAL_PRIORITY_CLASS` على نظام Windows، وقيمة لطيفة قدرها `-7` على جميع الأنظمة الأساسية الأخرى. |
| `PRIORITY_HIGH` | أولوية جدولة العمليات أعلى من `PRIORITY_ABOVE_NORMAL` وأقل من `PRIORITY_HIGHEST`. يتوافق هذا مع `HIGH_PRIORITY_CLASS` على نظام Windows، وقيمة لطيفة قدرها `-14` على جميع الأنظمة الأساسية الأخرى. |
| `PRIORITY_HIGHEST` | أعلى أولوية لجدولة العمليات. يتوافق هذا مع `REALTIME_PRIORITY_CLASS` على نظام Windows، وقيمة لطيفة قدرها `-20` على جميع الأنظمة الأساسية الأخرى. |

### ثوابت libuv {#libuv-constants}

| ثابت | الوصف |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

