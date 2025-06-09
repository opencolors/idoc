---
title: واجهة برمجة التطبيقات (API) لتضمين Node.js
description: تعلم كيفية تضمين Node.js في تطبيقات C/C++، مما يسمح للمطورين بالاستفادة من بيئة تشغيل JavaScript الخاصة بـ Node.js داخل تطبيقاتهم الأصلية.
head:
  - - meta
    - name: og:title
      content: واجهة برمجة التطبيقات (API) لتضمين Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية تضمين Node.js في تطبيقات C/C++، مما يسمح للمطورين بالاستفادة من بيئة تشغيل JavaScript الخاصة بـ Node.js داخل تطبيقاتهم الأصلية.
  - - meta
    - name: twitter:title
      content: واجهة برمجة التطبيقات (API) لتضمين Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية تضمين Node.js في تطبيقات C/C++، مما يسمح للمطورين بالاستفادة من بيئة تشغيل JavaScript الخاصة بـ Node.js داخل تطبيقاتهم الأصلية.
---


# C++ واجهة برمجة تطبيقات المضمن {#c-embedder-api}

يوفر Node.js عددًا من واجهات برمجة تطبيقات C++ التي يمكن استخدامها لتنفيذ JavaScript في بيئة Node.js من برامج C++ أخرى.

يمكن العثور على الوثائق الخاصة بواجهات برمجة التطبيقات هذه في [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) في شجرة مصدر Node.js. بالإضافة إلى واجهات برمجة التطبيقات التي تعرضها Node.js، يتم توفير بعض المفاهيم المطلوبة بواسطة واجهة برمجة تطبيقات V8 المضمنة.

نظرًا لأن استخدام Node.js كمكتبة مضمنة يختلف عن كتابة التعليمات البرمجية التي يتم تنفيذها بواسطة Node.js، فإن التغييرات الجذرية لا تتبع [سياسة الإهمال](/ar/nodejs/api/deprecations) النموذجية لـ Node.js وقد تحدث في كل إصدار رئيسي من الإصدار الدلالي دون سابق إنذار.

## مثال على تطبيق التضمين {#example-embedding-application}

ستقدم الأقسام التالية نظرة عامة حول كيفية استخدام واجهات برمجة التطبيقات هذه لإنشاء تطبيق من البداية سيؤدي إلى ما يعادل `node -e \<code\>`، أي أنه سيأخذ جزءًا من JavaScript ويشغله في بيئة خاصة بـ Node.js.

يمكن العثور على التعليمات البرمجية الكاملة [في شجرة مصدر Node.js](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### إعداد حالة لكل عملية {#setting-up-a-per-process-state}

يتطلب Node.js بعض إدارة الحالة لكل عملية من أجل التشغيل:

- تحليل وسيطات [خيارات CLI](/ar/nodejs/api/cli) الخاصة بـ Node.js،
- متطلبات V8 لكل عملية، مثل مثيل `v8::Platform`.

يوضح المثال التالي كيفية إعداد هذه. أسماء بعض الفئات مأخوذة من مساحات أسماء `node` و `v8` C++، على التوالي.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // تحليل خيارات CLI الخاصة بـ Node.js، وطباعة أي أخطاء حدثت أثناء
  // محاولة تحليلها.
  std::unique_ptr<node::InitializationResult> result =
      node::InitializeOncePerProcess(args, {
        node::ProcessInitializationFlags::kNoInitializeV8,
        node::ProcessInitializationFlags::kNoInitializeNodeV8Platform
      });

  for (const std::string& error : result->errors())
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // إنشاء مثيل v8::Platform. `MultiIsolatePlatform::Create()` هي طريقة
  // لإنشاء مثيل v8::Platform يمكن لـ Node.js استخدامه عند إنشاء
  // سلاسل عمليات Worker. عندما لا يكون هناك مثيل `MultiIsolatePlatform`،
  // يتم تعطيل سلاسل عمليات Worker.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // انظر أدناه لمعرفة محتويات هذه الوظيفة.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### إعداد حالة لكل مثيل {#setting-up-a-per-instance-state}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 15.0.0 | تمت إضافة الأدوات المساعدة `CommonEnvironmentSetup` و `SpinEventLoop`. |
:::

يحتوي Node.js على مفهوم "مثيل Node.js"، والذي يشار إليه عادةً باسم `node::Environment`. يرتبط كل `node::Environment` بما يلي:

- `v8::Isolate` واحد بالضبط، أي مثيل محرك JS واحد،
- `uv_loop_t` واحد بالضبط، أي حلقة حدث واحدة،
- عدد من `v8::Context`، ولكن `v8::Context` رئيسي واحد بالضبط، و
- مثيل `node::IsolateData` واحد يحتوي على معلومات يمكن مشاركتها بواسطة العديد من `node::Environment`. يجب على المُدمِج التأكد من أن `node::IsolateData` تتم مشاركتها فقط بين `node::Environment` التي تستخدم نفس `v8::Isolate`، ولا يجري Node.js هذا الفحص.

من أجل إعداد `v8::Isolate`، يجب توفير `v8::ArrayBuffer::Allocator`. أحد الخيارات الممكنة هو مُخصِّص Node.js الافتراضي، والذي يمكن إنشاؤه من خلال `node::ArrayBufferAllocator::Create()`. يسمح استخدام مُخصِّص Node.js بتحسينات طفيفة في الأداء عندما تستخدم الوظائف الإضافية واجهة برمجة تطبيقات C++ `Buffer` الخاصة بـ Node.js، وهو مطلوب لتتبع ذاكرة `ArrayBuffer` في [`process.memoryUsage()`](/ar/nodejs/api/process#processmemoryusage).

بالإضافة إلى ذلك، يجب تسجيل كل `v8::Isolate` يتم استخدامه لمثيل Node.js وإلغاء تسجيله مع مثيل `MultiIsolatePlatform`، إذا كان قيد الاستخدام، حتى تعرف المنصة حلقة الأحداث التي يجب استخدامها للمهام التي تم جدولتها بواسطة `v8::Isolate`.

تقوم الدالة المساعدة `node::NewIsolate()` بإنشاء `v8::Isolate`، وإعداده ببعض الخطافات الخاصة بـ Node.js (مثل معالج أخطاء Node.js)، وتسجيله في المنصة تلقائيًا.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // إعداد حلقة أحداث libuv، و v8::Isolate، وبيئة Node.js.
  std::vector<std::string> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
      CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);
  if (!setup) {
    for (const std::string& err : errors)
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    return 1;
  }

  Isolate* isolate = setup->isolate();
  Environment* env = setup->env();

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    // يجب إدخال v8::Context عند استدعاء node::CreateEnvironment() و
    // node::LoadEnvironment().
    Context::Scope context_scope(setup->context());

    // إعداد مثيل Node.js للتنفيذ، وتشغيل التعليمات البرمجية بداخله.
    // يوجد أيضًا متغير يأخذ رد اتصال ويزوده بكائنات `require` و `process`، بحيث يمكنه تجميع
    // وتشغيل البرامج النصية يدويًا حسب الحاجة.
    // لا تصل الدالة `require` الموجودة داخل هذا البرنامج النصي إلى نظام الملفات، ويمكنها فقط تحميل وحدات Node.js المضمنة.
    // يتم استخدام `module.createRequire()` لإنشاء واحد قادر على
    // تحميل الملفات من القرص، ويستخدم محمل ملفات CommonJS القياسي
    // بدلاً من الدالة `require` الداخلية فقط.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // كان هناك استثناء JS.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // يمكن استخدام node::Stop() لإيقاف حلقة الأحداث بشكل صريح ومنع
    // المزيد من تشغيل JavaScript. يمكن استدعاؤه من أي مؤشر ترابط،
    // وسيتصرف مثل worker.terminate() إذا تم استدعاؤه من مؤشر ترابط آخر.
    node::Stop(env);
  }

  return exit_code;
}
```
