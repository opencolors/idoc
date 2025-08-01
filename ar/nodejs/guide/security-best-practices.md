---
title: أفضل ممارسات الأمان لتطبيقات Node.js
description: دليل شامل لتأمين تطبيقات Node.js، يغطي نمذجة التهديدات، وأفضل الممارسات، وطرق التخفيف من الثغرات الشائعة مثل هجمات الحرمان من الخدمة، وإعادة ربط DNS، وكشف المعلومات الحساسة.
head:
  - - meta
    - name: og:title
      content: أفضل ممارسات الأمان لتطبيقات Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: دليل شامل لتأمين تطبيقات Node.js، يغطي نمذجة التهديدات، وأفضل الممارسات، وطرق التخفيف من الثغرات الشائعة مثل هجمات الحرمان من الخدمة، وإعادة ربط DNS، وكشف المعلومات الحساسة.
  - - meta
    - name: twitter:title
      content: أفضل ممارسات الأمان لتطبيقات Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: دليل شامل لتأمين تطبيقات Node.js، يغطي نمذجة التهديدات، وأفضل الممارسات، وطرق التخفيف من الثغرات الشائعة مثل هجمات الحرمان من الخدمة، وإعادة ربط DNS، وكشف المعلومات الحساسة.
---


# أفضل الممارسات الأمنية

### الهدف

تهدف هذه الوثيقة إلى توسيع [نموذج التهديد](/ar/nodejs/guide/security-best-practices#threat-model) الحالي وتوفير إرشادات شاملة حول كيفية تأمين تطبيق Node.js.

## محتوى الوثيقة

- أفضل الممارسات: طريقة مبسطة ومكثفة لرؤية أفضل الممارسات. يمكننا استخدام [هذه المشكلة](https://github.com/nodejs/security-wg/issues/488) أو [هذا الدليل](https://github.com/goldbergyoni/nodebestpractices) كنقطة انطلاق. من المهم ملاحظة أن هذه الوثيقة خاصة بـ Node.js، إذا كنت تبحث عن شيء واسع النطاق، ففكر في [أفضل ممارسات OSSF](https://github.com/ossf/wg-best-practices-os-developers).
- شرح الهجمات: توضيح وتوثيق باللغة الإنجليزية البسيطة مع بعض الأمثلة البرمجية (إذا أمكن) للهجمات التي نذكرها في نموذج التهديد.
- مكتبات الطرف الثالث: تحديد التهديدات (هجمات التصيد بالأخطاء المطبعية، والحزم الضارة...) وأفضل الممارسات فيما يتعلق بتبعيات وحدات Node، وما إلى ذلك...

## قائمة التهديدات

### رفض خدمة خادم HTTP (CWE-400)

هذا هجوم يصبح فيه التطبيق غير متاح للغرض الذي صُمم من أجله بسبب الطريقة التي يعالج بها طلبات HTTP الواردة. لا يلزم أن تكون هذه الطلبات مصممة عمدًا من قبل جهة خبيثة: يمكن لعميل تم تكوينه بشكل خاطئ أو به أخطاء أيضًا إرسال نمط من الطلبات إلى الخادم يؤدي إلى رفض الخدمة.

يتم استقبال طلبات HTTP بواسطة خادم Node.js HTTP وتسليمها إلى كود التطبيق عبر معالج الطلبات المسجل. لا يقوم الخادم بتحليل محتوى نص الطلب. لذلك، فإن أي DoS ناتج عن محتويات النص بعد تسليمها إلى معالج الطلبات ليس ثغرة أمنية في Node.js نفسه، حيث أن مسؤولية معالجتها بشكل صحيح تقع على عاتق كود التطبيق.

تأكد من أن WebServer يعالج أخطاء المقبس بشكل صحيح، على سبيل المثال، عندما يتم إنشاء خادم بدون معالج أخطاء، فسيكون عرضة لـ DoS.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // هذا يمنع الخادم من التعطل
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_إذا تم إجراء طلب سيئ، فقد يتعطل الخادم._

مثال على هجوم DoS غير ناتج عن محتويات الطلب هو Slowloris. في هذا الهجوم، يتم إرسال طلبات HTTP ببطء ومجزأة، جزء واحد في كل مرة. حتى يتم تسليم الطلب بالكامل، سيحتفظ الخادم بالموارد المخصصة للطلب الجاري. إذا تم إرسال عدد كافٍ من هذه الطلبات في نفس الوقت، فسيصل مقدار الاتصالات المتزامنة قريبًا إلى الحد الأقصى مما يؤدي إلى رفض الخدمة. هذه هي الطريقة التي يعتمد بها الهجوم ليس على محتويات الطلب ولكن على توقيت ونمط الطلبات المرسلة إلى الخادم.


#### تدابير التخفيف

- استخدم وكيلًا عكسيًا لتلقي الطلبات وإعادة توجيهها إلى تطبيق Node.js. يمكن للوكلاء العكسيين توفير التخزين المؤقت، وموازنة التحميل، والقوائم السوداء لعناوين IP، وما إلى ذلك، مما يقلل من احتمالية فعالية هجوم DoS.
- قم بتكوين مهلات الخادم بشكل صحيح، بحيث يمكن إسقاط الاتصالات الخاملة أو التي تصل فيها الطلبات ببطء شديد. راجع المهلات المختلفة في `http.Server`، وخاصة `headersTimeout` و `requestTimeout` و `timeout` و `keepAliveTimeout`.
- قم بتقييد عدد المقابس المفتوحة لكل مضيف وإجمالاً. راجع [وثائق http](/ar/nodejs/api/http)، وخاصة `agent.maxSockets` و `agent.maxTotalSockets` و `agent.maxFreeSockets` و `server.maxRequestsPerSocket`.

### إعادة ربط DNS (CWE-346)

هذا هجوم يمكن أن يستهدف تطبيقات Node.js التي يتم تشغيلها مع تمكين مصحح الأخطاء باستخدام [--inspect switch](/ar/nodejs/guide/debugging-nodejs).

نظرًا لأن مواقع الويب التي يتم فتحها في متصفح الويب يمكنها إجراء طلبات WebSocket و HTTP، فيمكنها استهداف مصحح الأخطاء قيد التشغيل محليًا. يتم منع هذا عادةً بواسطة [سياسة نفس المصدر](/ar/nodejs/guide/debugging-nodejs) التي تنفذها المتصفحات الحديثة، والتي تمنع البرامج النصية من الوصول إلى الموارد من مصادر مختلفة (بمعنى أن موقعًا ضارًا لا يمكنه قراءة البيانات المطلوبة من عنوان IP محلي).

ومع ذلك، من خلال إعادة ربط DNS، يمكن للمهاجم التحكم مؤقتًا في أصل طلباتهم بحيث تبدو وكأنها تنشأ من عنوان IP محلي. يتم ذلك عن طريق التحكم في كل من موقع الويب وخادم DNS المستخدم لحل عنوان IP الخاص به. راجع [ويكي إعادة ربط DNS](https://en.wikipedia.org/wiki/DNS_rebinding) لمزيد من التفاصيل.

#### تدابير التخفيف

- قم بتعطيل المفتش على إشارة SIGUSR1 عن طريق إرفاق مستمع `process.on('SIGUSR1', ...)` به.
- لا تقم بتشغيل بروتوكول المفتش في الإنتاج.

### الكشف عن معلومات حساسة لجهة غير مصرح لها (CWE-552)

يتم دفع جميع الملفات والمجلدات المضمنة في الدليل الحالي إلى سجل npm أثناء نشر الحزمة.

هناك بعض الآليات للتحكم في هذا السلوك عن طريق تحديد قائمة حظر باستخدام `.npmignore` و `.gitignore` أو عن طريق تحديد قائمة السماح في `package.json`


#### تدابير التخفيف

- استخدام `npm publish --dry-run` لسرد جميع الملفات المراد نشرها. تأكد من مراجعة المحتوى قبل نشر الحزمة.
- من المهم أيضًا إنشاء ملفات تجاهل مثل `.gitignore` و `.npmignore` والحفاظ عليها. يمكنك عبر هذه الملفات تحديد الملفات/المجلدات التي لا ينبغي نشرها. تسمح [خاصية الملفات](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) في `package.json` بالعملية العكسية - قائمة "مسموح".
- في حالة التعرض، تأكد من [إلغاء نشر الحزمة](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

### تهريب طلبات HTTP ‏(CWE-444)

هذا هجوم يتضمن خادمي HTTP (عادةً وكيل وتطبيق Node.js). يرسل العميل طلب HTTP يمر أولاً عبر خادم الواجهة الأمامية (الوكيل) ثم يتم إعادة توجيهه إلى خادم الواجهة الخلفية (التطبيق). عندما يفسر كل من الواجهة الأمامية والخلفية طلبات HTTP الغامضة بشكل مختلف، هناك احتمال لأن يرسل المهاجم رسالة ضارة لن تراها الواجهة الأمامية ولكن سترى الواجهة الخلفية، مما يؤدي فعليًا إلى "تهريبها" عبر الخادم الوكيل.

راجع [CWE-444](https://cwe.mitre.org/data/definitions/444.html) للحصول على وصف وأمثلة أكثر تفصيلاً.

نظرًا لأن هذا الهجوم يعتمد على تفسير Node.js لطلبات HTTP بشكل مختلف عن خادم HTTP (اعتباطي)، فقد يكون الهجوم الناجح ناتجًا عن ثغرة أمنية في Node.js أو خادم الواجهة الأمامية أو كليهما. إذا كانت الطريقة التي يفسر بها Node.js الطلب متوافقة مع مواصفات HTTP (راجع [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3))، فلن تعتبر ثغرة أمنية في Node.js.

#### تدابير التخفيف

- لا تستخدم الخيار `insecureHTTPParser` عند إنشاء خادم HTTP.
- قم بتكوين خادم الواجهة الأمامية لتطبيع الطلبات الغامضة.
- راقب باستمرار بحثًا عن نقاط ضعف جديدة في تهريب طلبات HTTP في كل من Node.js وخادم الواجهة الأمامية الذي تختاره.
- استخدم HTTP/2 من النهاية إلى النهاية وقم بتعطيل خفض مستوى HTTP إذا أمكن.


### التعرض للمعلومات من خلال هجمات التوقيت (CWE-208)

هذا هجوم يسمح للمهاجم بتعلم معلومات حساسة محتملة عن طريق، على سبيل المثال، قياس المدة التي يستغرقها التطبيق للاستجابة لطلب ما. هذا الهجوم ليس خاصًا بـ Node.js ويمكن أن يستهدف جميع أوقات التشغيل تقريبًا.

الهجوم ممكن كلما استخدم التطبيق سرًا في عملية حساسة للتوقيت (مثل، التفرع). ضع في اعتبارك التعامل مع المصادقة في تطبيق نموذجي. هنا، تتضمن طريقة المصادقة الأساسية البريد الإلكتروني وكلمة المرور كبيانات اعتماد. يتم استرداد معلومات المستخدم من الإدخال الذي قدمه المستخدم من DBMS مثاليًا. عند استرداد معلومات المستخدم، تتم مقارنة كلمة المرور بمعلومات المستخدم المستردة من قاعدة البيانات. يستغرق استخدام مقارنة السلسلة المضمنة وقتًا أطول للقيم ذات الطول نفسه. هذه المقارنة، عند تشغيلها لمقدار مقبول، تزيد عن غير قصد من وقت استجابة الطلب. من خلال مقارنة أوقات استجابة الطلب، يمكن للمهاجم تخمين طول وقيمة كلمة المرور في كمية كبيرة من الطلبات.

#### التخفيفات

- تعرض واجهة برمجة تطبيقات التشفير وظيفة `timingSafeEqual` لمقارنة القيم الحساسة الفعلية والمتوقعة باستخدام خوارزمية ذات وقت ثابت.
- لمقارنة كلمات المرور، يمكنك استخدام `scrypt` [/api/crypto] المتاح أيضًا في وحدة التشفير الأصلية.
- بشكل عام، تجنب استخدام الأسرار في العمليات ذات الوقت المتغير. يتضمن ذلك التفرع على الأسرار، وعندما يمكن للمهاجم أن يكون موجودًا في نفس البنية التحتية (على سبيل المثال، نفس الجهاز السحابي)، باستخدام سر كفهرس في الذاكرة. كتابة التعليمات البرمجية ذات الوقت الثابت في JavaScript أمر صعب (ويرجع ذلك جزئيًا إلى JIT). لتطبيقات التشفير، استخدم واجهات برمجة تطبيقات التشفير المضمنة أو WebAssembly (للخوارزميات غير المنفذة أصلاً).

### وحدات الطرف الثالث الضارة (CWE-1357)

حاليًا، في Node.js، يمكن لأي حزمة الوصول إلى موارد قوية مثل الوصول إلى الشبكة. علاوة على ذلك، نظرًا لأن لديهم أيضًا حق الوصول إلى نظام الملفات، فيمكنهم إرسال أي بيانات إلى أي مكان.

تتمتع جميع التعليمات البرمجية التي تعمل في عملية عقدة القدرة على تحميل وتشغيل تعليمات برمجية عشوائية إضافية باستخدام `eval()` (أو ما يعادلها). يمكن لجميع التعليمات البرمجية التي لديها حق الوصول للكتابة إلى نظام الملفات تحقيق نفس الشيء عن طريق الكتابة إلى ملفات جديدة أو موجودة يتم تحميلها.

لدى Node.js [آلية سياسة](/ar/nodejs/api/permissions) تجريبية¹ للإعلان عن المورد الذي تم تحميله على أنه غير موثوق به أو موثوق به. ومع ذلك، هذه السياسة غير مفعلة بشكل افتراضي. تأكد من تثبيت إصدارات التبعية وتشغيل عمليات فحص تلقائية بحثًا عن الثغرات الأمنية باستخدام مهام سير عمل شائعة أو نصوص npm. قبل تثبيت حزمة، تأكد من أن هذه الحزمة تتم صيانتها وتتضمن كل المحتوى الذي توقعته. كن حذرًا، رمز مصدر GitHub ليس دائمًا هو نفسه الرمز المنشور، وتحقق منه في `node_modules`.


#### هجمات سلسلة التوريد

تحدث هجمة سلسلة التوريد على تطبيق Node.js عندما يتم اختراق أحد تبعياته (سواء كانت مباشرة أو متعدية). يمكن أن يحدث هذا إما بسبب تساهل التطبيق المفرط في تحديد التبعيات (مما يسمح بتحديثات غير مرغوب فيها) و/أو الأخطاء الإملائية الشائعة في التحديد (معرضة لـ [التصيد المطبعي](https://en.wikipedia.org/wiki/Typosquatting)).

يمكن للمهاجم الذي يسيطر على حزمة المنبع نشر إصدار جديد يحتوي على تعليمات برمجية ضارة. إذا كان تطبيق Node.js يعتمد على هذه الحزمة دون أن يكون صارمًا بشأن الإصدار الآمن للاستخدام، فيمكن تحديث الحزمة تلقائيًا إلى أحدث إصدار ضار، مما يعرض التطبيق للخطر.

يمكن أن تحتوي التبعيات المحددة في ملف `package.json` على رقم إصدار دقيق أو نطاق. ومع ذلك، عند تثبيت تبعية على إصدار دقيق، لا يتم تثبيت تبعياتها المتعدية نفسها. هذا لا يزال يترك التطبيق عرضة للتحديثات غير المرغوب فيها/غير المتوقعة.

نواقل الهجوم المحتملة:

- هجمات التصيد المطبعي
- تسميم ملف القفل
- صيانة مُخترقة
- حزم ضارة
- ارتباكات التبعية

##### التخفيفات

- منع npm من تنفيذ برامج نصية عشوائية باستخدام `--ignore-scripts`
  - بالإضافة إلى ذلك، يمكنك تعطيله عالميًا باستخدام `npm config set ignore-scripts true`
- قم بتثبيت إصدارات التبعية على إصدار ثابت محدد، وليس إصدارًا يمثل نطاقًا أو من مصدر قابل للتغيير.
- استخدم ملفات القفل، التي تثبت كل تبعية (مباشرة ومتعدية).
  - استخدم [تخفيفات لتسميم ملف القفل](https://blog.ulisesgascon.com/lockfile-posioned).
- أتمتة عمليات التحقق من الثغرات الأمنية الجديدة باستخدام CI، باستخدام أدوات مثل [npm-audit](https://www.npmjs.com/package/npm-audit).
  - يمكن استخدام أدوات مثل `Socket` لتحليل الحزم باستخدام التحليل الثابت للعثور على سلوكيات محفوفة بالمخاطر مثل الوصول إلى الشبكة أو نظام الملفات.
- استخدم `npm ci` بدلاً من `npm install`. هذا يفرض ملف القفل بحيث أن التناقضات بينه وبين ملف `package.json` تتسبب في حدوث خطأ (بدلاً من تجاهل ملف القفل بصمت لصالح `package.json`).
- تحقق بعناية من ملف `package.json` بحثًا عن أخطاء/أخطاء إملائية في أسماء التبعيات.


### خرق الوصول إلى الذاكرة (CWE-284)

تعتمد الهجمات القائمة على الذاكرة أو القائمة على الكومة على مزيج من أخطاء إدارة الذاكرة ومخصص ذاكرة قابل للاستغلال. مثل جميع وقت التشغيل، فإن Node.js عرضة لهذه الهجمات إذا كانت مشاريعك تعمل على جهاز مشترك. يعد استخدام كومة آمنة مفيدًا لمنع تسرب المعلومات الحساسة بسبب تجاوزات المؤشر والتقصيرات.

لسوء الحظ، لا تتوفر كومة آمنة على نظام التشغيل Windows. يمكن العثور على مزيد من المعلومات في وثائق [الكومة الآمنة](/ar/nodejs/api/cli) الخاصة بـ Node.js.

#### التخفيفات

- استخدم `--secure-heap=n` اعتمادًا على تطبيقك حيث n هو الحد الأقصى لحجم البايت المخصص.
- لا تقم بتشغيل تطبيق الإنتاج الخاص بك على جهاز مشترك.

### تعديل الرقعة النشطة (CWE-349)

يشير تعديل الرقعة النشطة إلى تعديل الخصائص في وقت التشغيل بهدف تغيير السلوك الحالي. مثال:

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // تجاوز [].push العالمي
}
```

#### التخفيفات

تعمل علامة `--frozen-intrinsics` على تمكين العناصر الداخلية المجمدة التجريبية¹، مما يعني تجميد جميع كائنات ووظائف JavaScript المضمنة بشكل متكرر. لذلك، لن يتجاوز المقتطف التالي السلوك الافتراضي لـ `Array.prototype.push`

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // تجاوز [].push العالمي
}
// غير معلوم:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// لا يمكن التعيين إلى خاصية 'push' للقراءة فقط للكائن '
```

ومع ذلك، من المهم ذكر أنه لا يزال بإمكانك تحديد متغيرات عمومية جديدة واستبدال المتغيرات العمومية الحالية باستخدام `globalThis`

```bash
globalThis.foo = 3; foo; // لا يزال بإمكانك تحديد متغيرات عمومية جديدة 3
globalThis.Array = 4; Array; // ومع ذلك، يمكنك أيضًا استبدال المتغيرات العمومية الحالية 4
```

لذلك، يمكن استخدام `Object.freeze(globalThis)` لضمان عدم استبدال أي متغيرات عمومية.

### هجمات تلوث النموذج الأولي (CWE-1321)

يشير تلوث النموذج الأولي إلى إمكانية تعديل أو حقن الخصائص في عناصر لغة Javascript عن طريق إساءة استخدام \__proto_ و \_constructor والنموذج الأولي والخصائص الأخرى الموروثة من النماذج الأولية المضمنة.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// DoS المحتملة
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // TypeError غير معلوم: d.hasOwnProperty ليست دالة
```

هذه ثغرة أمنية محتملة موروثة من لغة JavaScript.


#### أمثلة

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (مكتبة طرف ثالث: Lodash)

#### إجراءات التخفيف

- تجنب [عمليات الدمج المتكررة غير الآمنة](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js)، انظر [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487).
- قم بتطبيق عمليات التحقق من صحة JSON Schema للطلبات الخارجية/غير الموثوق بها.
- إنشاء كائنات بدون نموذج أولي باستخدام `Object.create(null)`.
- تجميد النموذج الأولي: `Object.freeze(MyObject.prototype)`.
- تعطيل خاصية `Object.prototype.__proto__` باستخدام علامة `--disable-proto`.
- تحقق من وجود الخاصية مباشرة على الكائن، وليس من النموذج الأولي باستخدام `Object.hasOwn(obj, keyFromObj)`.
- تجنب استخدام طرق من `Object.prototype`.

### عنصر مسار البحث غير المتحكم فيه (CWE-427)

يقوم Node.js بتحميل الوحدات النمطية باتباع [خوارزمية حل الوحدة النمطية](/ar/nodejs/api/modules). لذلك، يفترض أن الدليل الذي يتم فيه طلب الوحدة النمطية (تتطلب) موثوق به.

وبذلك، هذا يعني سلوك التطبيق المتوقع التالي. بافتراض هيكل الدليل التالي:

- app/
  - server.js
  - auth.js
  - auth

إذا كان server.js يستخدم `require('./auth')` فسيتبع خوارزمية حل الوحدة النمطية ويقوم بتحميل auth بدلاً من `auth.js`.

#### إجراءات التخفيف

يمكن أن يؤدي استخدام [آلية السياسة مع التحقق من السلامة](/ar/nodejs/api/permissions) التجريبية¹ إلى تجنب التهديد المذكور أعلاه. بالنسبة للدليل الموضح أعلاه، يمكن للمرء استخدام `policy.json` التالية

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

لذلك، عند طلب وحدة auth، سيتحقق النظام من السلامة ويطرح خطأ إذا لم يتطابق مع الخطأ المتوقع.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

لاحظ، يوصى دائمًا باستخدام `--policy-integrity` لتجنب تغييرات السياسة.


## ميزات تجريبية في الإنتاج

لا يُنصح باستخدام الميزات التجريبية في الإنتاج. قد تعاني الميزات التجريبية من تغييرات جذرية إذا لزم الأمر، ووظائفها ليست مستقرة بشكل آمن. على الرغم من ذلك، فإننا نقدر ملاحظاتك بشكل كبير.

## أدوات OpenSSF

تقود [OpenSSF](https://www.openssf.org) العديد من المبادرات التي يمكن أن تكون مفيدة للغاية، خاصة إذا كنت تخطط لنشر حزمة npm. تتضمن هذه المبادرات:

- [بطاقة أداء OpenSSF](https://securityscorecards.dev/) تقوم بطاقة الأداء بتقييم مشاريع مفتوحة المصدر باستخدام سلسلة من عمليات التحقق الآلية من المخاطر الأمنية. يمكنك استخدامه لتقييم نقاط الضعف والتبعيات في قاعدة التعليمات البرمجية الخاصة بك بشكل استباقي واتخاذ قرارات مستنيرة بشأن قبول نقاط الضعف.
- [برنامج شارة أفضل الممارسات OpenSSF](https://bestpractices.coreinfrastructure.org/en) يمكن للمشاريع أن تشهد ذاتيًا طوعًا من خلال وصف كيفية امتثالها لكل أفضل ممارسة. سيؤدي هذا إلى إنشاء شارة يمكن إضافتها إلى المشروع.

