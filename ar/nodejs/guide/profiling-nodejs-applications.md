---
title: تحليل تطبيقات Node.js
description: تعلم كيفية استخدام أداة التحليل المدمجة في Node.js لتحديد عنق الزجاجة في أداء تطبيقك وتحسين أدائه.
head:
  - - meta
    - name: og:title
      content: تحليل تطبيقات Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية استخدام أداة التحليل المدمجة في Node.js لتحديد عنق الزجاجة في أداء تطبيقك وتحسين أدائه.
  - - meta
    - name: twitter:title
      content: تحليل تطبيقات Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية استخدام أداة التحليل المدمجة في Node.js لتحديد عنق الزجاجة في أداء تطبيقك وتحسين أدائه.
---


# تحليل تطبيقات Node.js

هناك العديد من الأدوات الخارجية المتاحة لتحليل تطبيقات Node.js، ولكن في كثير من الحالات، يكون الخيار الأسهل هو استخدام محلل Node.js المدمج. يستخدم المحلل المدمج [المحلل داخل V8](https://v8.dev/docs/profile) الذي يأخذ عينات من المكدس على فترات منتظمة أثناء تنفيذ البرنامج. يسجل نتائج هذه العينات، جنبًا إلى جنب مع أحداث التحسين المهمة مثل تجميع JIT، كسلسلة من التجزئات:

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
في الماضي، كنت بحاجة إلى الكود المصدري لـ V8 لتتمكن من تفسير التجزئات. لحسن الحظ، تم تقديم أدوات منذ Node.js 4.4.0 تسهل استهلاك هذه المعلومات دون إنشاء V8 بشكل منفصل من المصدر. دعونا نرى كيف يمكن أن يساعد المحلل المدمج في توفير رؤى حول أداء التطبيق.

لتوضيح استخدام محلل التجزئة، سنعمل مع تطبيق Express بسيط. سيكون لتطبيقنا معالجان، أحدهما لإضافة مستخدمين جدد إلى نظامنا:

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

وآخر للتحقق من صحة محاولات مصادقة المستخدم:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*يرجى ملاحظة أن هذه ليست معالجات موصى بها لمصادقة المستخدمين في تطبيقات Node.js الخاصة بك وتستخدم فقط لأغراض التوضيح. لا يجب أن تحاول تصميم آليات المصادقة المشفرة الخاصة بك بشكل عام. من الأفضل بكثير استخدام حلول المصادقة الحالية والمثبتة.*

لنفترض الآن أننا قمنا بتوزيع تطبيقنا ويشتكي المستخدمون من زمن انتقال مرتفع على الطلبات. يمكننا بسهولة تشغيل التطبيق باستخدام المحلل المدمج:

```bash
NODE_ENV=production node --prof app.js
```

وضع بعض الحمل على الخادم باستخدام `ab` (ApacheBench):

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

والحصول على خرج ab لـ:

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

من هذا الإخراج، نرى أننا ندير فقط خدمة حوالي 5 طلبات في الثانية وأن متوسط الطلب يستغرق أقل من 4 ثوانٍ للذهاب والإياب. في مثال واقعي، يمكننا القيام بالكثير من العمل في العديد من الوظائف نيابة عن طلب المستخدم، ولكن حتى في مثالنا البسيط، يمكن أن يضيع الوقت في تجميع التعبيرات النمطية أو إنشاء أملاح عشوائية أو إنشاء تجزئات فريدة من كلمات مرور المستخدم أو داخل إطار عمل Express نفسه.

نظرًا لأننا قمنا بتشغيل تطبيقنا باستخدام الخيار `--prof`، فقد تم إنشاء ملف تجزئة في نفس الدليل مثل التشغيل المحلي لتطبيقك. يجب أن يكون له النموذج `isolate-0xnnnnnnnnnnnn-v8.log` (حيث n رقم).

من أجل فهم هذا الملف، نحتاج إلى استخدام معالج التجزئة المجمعة مع ثنائي Node.js. لتشغيل المعالج، استخدم العلامة `--prof-process`:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

سيمنحك فتح processed.txt في محرر النصوص المفضل لديك أنواعًا مختلفة من المعلومات. يتم تقسيم الملف إلى أقسام مقسمة مرة أخرى حسب اللغة. أولاً، ننظر إلى قسم الملخص ونرى:

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

يخبرنا هذا أن 97٪ من جميع العينات التي تم جمعها حدثت في كود C++ وأنه عند عرض أقسام أخرى من الإخراج المعالج، يجب أن نولي معظم الاهتمام للعمل الذي يتم إنجازه في C++ (بدلاً من JavaScript). مع وضع ذلك في الاعتبار، نجد بعد ذلك قسم [C++] الذي يحتوي على معلومات حول وظائف C++ التي تستغرق معظم وقت وحدة المعالجة المركزية ونرى:

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

نرى أن الإدخالات الثلاثة الأولى تمثل 72.1٪ من وقت وحدة المعالجة المركزية الذي يستغرقه البرنامج. من هذا الإخراج، نرى على الفور أن ما لا يقل عن 51.8٪ من وقت وحدة المعالجة المركزية يتم استغراقه بواسطة وظيفة تسمى PBKDF2 والتي تتوافق مع إنشاء التجزئة لدينا من كلمة مرور المستخدم. ومع ذلك، قد لا يكون من الواضح على الفور كيف تساهم الإدخالات السفلية في تطبيقنا (أو إذا كان الأمر كذلك فسوف نتظاهر بخلاف ذلك من أجل المثال). لفهم العلاقة بشكل أفضل بين هذه الوظائف، سننظر بعد ذلك إلى قسم [Bottom up (heavy) profile] الذي يوفر معلومات حول المتصلين الأساسيين بكل وظيفة. عند فحص هذا القسم، نجد:

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

يستغرق تحليل هذا القسم وقتًا أطول قليلاً من تعدادات التجزئة الأولية أعلاه. داخل كل من "مكدسات الاستدعاء" أعلاه، تخبرك النسبة المئوية في عمود الأصل بالنسبة المئوية للعينات التي تم استدعاء الوظيفة في الصف أعلاه من خلال الوظيفة في الصف الحالي. على سبيل المثال، في "مكدس الاستدعاء" الأوسط أعلاه لـ `_sha1_block_data_order`، نرى أن `_sha1_block_data_order` حدث في 11.9٪ من العينات، وهو ما عرفناه من التعدادات الأولية أعلاه. ومع ذلك، هنا، يمكننا أيضًا أن نقول أنه تم استدعاؤه دائمًا بواسطة وظيفة pbkdf2 داخل وحدة التشفير Node.js. نرى أنه بالمثل، تم استدعاء _malloc_zone_malloc حصريًا تقريبًا بواسطة نفس وظيفة pbkdf2. وبالتالي، باستخدام المعلومات الموجودة في هذا العرض، يمكننا أن نقول أن حساب التجزئة الخاص بنا من كلمة مرور المستخدم لا يمثل فقط 51.8٪ من الأعلى ولكن أيضًا كل وقت وحدة المعالجة المركزية في أعلى 3 وظائف تم أخذ عينات منها نظرًا لأن المكالمات إلى `_sha1_block_data_order` و `_malloc_zone_malloc` تم إجراؤها نيابة عن وظيفة pbkdf2.

في هذه المرحلة، من الواضح جدًا أن إنشاء التجزئة المستندة إلى كلمة المرور يجب أن يكون هدف التحسين لدينا. لحسن الحظ، قمت باستيعاب [فوائد البرمجة غير المتزامنة](https://nodesource.com/blog/why-asynchronous) بالكامل وتدرك أن العمل لإنشاء تجزئة من كلمة مرور المستخدم يتم بطريقة متزامنة وبالتالي تقييد حلقة الأحداث. هذا يمنعنا من العمل على الطلبات الواردة الأخرى أثناء حساب التجزئة.

لعلاج هذه المشكلة، تقوم بإجراء تعديل بسيط على المعالجات أعلاه لاستخدام الإصدار غير المتزامن من وظيفة pbkdf2:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

ينتج عن تشغيل جديد لمعيار ab أعلاه مع الإصدار غير المتزامن من تطبيقك:

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

ياي! يخدم تطبيقك الآن حوالي 20 طلبًا في الثانية، أي ما يقرب من 4 أضعاف ما كان عليه مع إنشاء التجزئة المتزامنة. بالإضافة إلى ذلك، انخفض متوسط زمن الانتقال من 4 ثوانٍ من قبل إلى ما يزيد قليلاً عن ثانية واحدة.

نأمل، من خلال التحقيق في أداء هذا المثال (المصطنع)، أن تكون قد رأيت كيف يمكن أن يساعدك معالج V8 tick في الحصول على فهم أفضل لأداء تطبيقات Node.js الخاصة بك.

قد تجد أيضًا [كيفية إنشاء رسم بياني للهب مفيدًا](/ar/nodejs/guide/flame-graphs).

