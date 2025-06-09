---
title: إضافات Node.js
description: تعلم كيفية إنشاء إضافات Node.js باستخدام C++ لتوسيع وظائف تطبيقات Node.js، بما في ذلك أمثلة ومراجع واجهة برمجة التطبيقات.
head:
  - - meta
    - name: og:title
      content: إضافات Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية إنشاء إضافات Node.js باستخدام C++ لتوسيع وظائف تطبيقات Node.js، بما في ذلك أمثلة ومراجع واجهة برمجة التطبيقات.
  - - meta
    - name: twitter:title
      content: إضافات Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية إنشاء إضافات Node.js باستخدام C++ لتوسيع وظائف تطبيقات Node.js، بما في ذلك أمثلة ومراجع واجهة برمجة التطبيقات.
---


# إضافات C++ {#c-addons}

*الإضافات* هي كائنات مشتركة مرتبطة ديناميكيًا مكتوبة بلغة C++. يمكن للدالة [`require()`](/ar/nodejs/api/modules#requireid) تحميل الإضافات كوحدات Node.js عادية. توفر الإضافات واجهة بين JavaScript ومكتبات C/C++.

هناك ثلاثة خيارات لتنفيذ الإضافات:

- Node-API
- `nan` ([تجريدات أصلية لـ Node.js](https://github.com/nodejs/nan))
- الاستخدام المباشر لمكتبات V8 و libuv و Node.js الداخلية

ما لم تكن هناك حاجة للوصول المباشر إلى وظيفة غير مكشوفة بواسطة Node-API، استخدم Node-API. راجع [إضافات C/C++ مع Node-API](/ar/nodejs/api/n-api) لمزيد من المعلومات حول Node-API.

عند عدم استخدام Node-API، يصبح تنفيذ الإضافات أكثر تعقيدًا، ويتطلب معرفة بمكونات وواجهات برمجة تطبيقات متعددة:

- [V8](https://v8.dev/): مكتبة C++ التي تستخدمها Node.js لتوفير تطبيق JavaScript. يوفر آليات لإنشاء الكائنات واستدعاء الوظائف وما إلى ذلك. يتم توثيق واجهة برمجة تطبيقات V8 في الغالب في ملف الرأس `v8.h` (`deps/v8/include/v8.h` في شجرة مصدر Node.js)، وهي متاحة أيضًا [عبر الإنترنت](https://v8docs.nodesource.com/).
- [libuv](https://github.com/libuv/libuv): مكتبة C التي تنفذ حلقة أحداث Node.js، وخيوط العامل الخاصة بها وجميع السلوكيات غير المتزامنة للنظام الأساسي. كما أنها تعمل كمكتبة تجريد عبر الأنظمة الأساسية، مما يتيح سهولة الوصول الشبيهة بـ POSIX عبر جميع أنظمة التشغيل الرئيسية إلى العديد من مهام النظام الشائعة، مثل التفاعل مع نظام الملفات والمآخذ والمؤقتات وأحداث النظام. توفر libuv أيضًا تجريدًا للخيوط مشابهًا لخيوط POSIX للإضافات غير المتزامنة الأكثر تعقيدًا التي تحتاج إلى تجاوز حلقة الأحداث القياسية. يجب على مؤلفي الإضافات تجنب حظر حلقة الأحداث باستخدام الإدخال والإخراج أو المهام الأخرى التي تستغرق وقتًا طويلاً عن طريق تفريغ العمل عبر libuv إلى عمليات النظام غير المحظورة أو خيوط العامل أو استخدام مخصص لخيوط libuv.
- مكتبات Node.js الداخلية: تصدر Node.js نفسها واجهات برمجة تطبيقات C++ التي يمكن للإضافات استخدامها، وأهمها فئة `node::ObjectWrap`.
- مكتبات أخرى مرتبطة ثابتًا (بما في ذلك OpenSSL): توجد هذه المكتبات الأخرى في الدليل `deps/` في شجرة مصدر Node.js. يتم إعادة تصدير رموز libuv و OpenSSL و V8 و zlib عن قصد بواسطة Node.js ويمكن استخدامها بدرجات متفاوتة بواسطة الإضافات. راجع [الربط بالمكتبات المضمنة مع Node.js](/ar/nodejs/api/addons#linking-to-libraries-included-with-nodejs) للحصول على معلومات إضافية.

جميع الأمثلة التالية متاحة [للتنزيل](https://github.com/nodejs/node-addon-examples) ويمكن استخدامها كنقطة انطلاق للإضافة.


## مرحبا بالعالم {#hello-world}

مثال "مرحبا بالعالم" هذا هو إضافة بسيطة، مكتوبة بلغة ++C، وهي المكافئ لكود JavaScript التالي:

```js [ESM]
module.exports.hello = () => 'world';
```
أولاً، قم بإنشاء الملف `hello.cc`:

```C++ [C++]
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```
يجب على جميع إضافات Node.js تصدير وظيفة تهيئة تتبع النمط التالي:

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
لا توجد فاصلة منقوطة بعد `NODE_MODULE` لأنها ليست دالة (راجع `node.h`).

يجب أن يتطابق `module_name` مع اسم ملف الثنائي النهائي (باستثناء اللاحقة `.node`).

في المثال `hello.cc`، إذن، وظيفة التهيئة هي `Initialize` واسم وحدة الإضافة هو `addon`.

عند إنشاء إضافات باستخدام `node-gyp`، فإن استخدام الماكرو `NODE_GYP_MODULE_NAME` كمعامل أول لـ `NODE_MODULE()` سيضمن تمرير اسم الثنائي النهائي إلى `NODE_MODULE()`.

لا يمكن تحميل الإضافات المعرفة باستخدام `NODE_MODULE()` في سياقات متعددة أو مؤشرات ترابط متعددة في نفس الوقت.

### إضافات واعية بالسياق {#context-aware-addons}

توجد بيئات قد تحتاج فيها إضافات Node.js إلى التحميل عدة مرات في سياقات متعددة. على سبيل المثال، يقوم وقت تشغيل [Electron](https://electronjs.org/) بتشغيل مثيلات متعددة من Node.js في عملية واحدة. سيكون لكل مثيل ذاكرة تخزين مؤقت خاصة به `require()`، وبالتالي سيحتاج كل مثيل إلى إضافة أصلية لكي تتصرف بشكل صحيح عند تحميلها عبر `require()`. هذا يعني أنه يجب أن تدعم الإضافة عمليات تهيئة متعددة.

يمكن إنشاء إضافة واعية بالسياق باستخدام الماكرو `NODE_MODULE_INITIALIZER`، والذي يتوسع إلى اسم وظيفة تتوقع Node.js العثور عليها عند تحميل إضافة. وبالتالي، يمكن تهيئة الإضافة كما في المثال التالي:

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Perform addon initialization steps here. */
}
```
خيار آخر هو استخدام الماكرو `NODE_MODULE_INIT()`، والذي سيقوم أيضًا بإنشاء إضافة واعية بالسياق. على عكس `NODE_MODULE()`، الذي يُستخدم لإنشاء إضافة حول دالة تهيئة إضافة معينة، يعمل `NODE_MODULE_INIT()` بمثابة إعلان عن مثل هذه التهيئة ليتبعها نص الدالة.

يمكن استخدام المتغيرات الثلاثة التالية داخل نص الدالة بعد استدعاء `NODE_MODULE_INIT()`:

- `Local\<Object\> exports`،
- `Local\<Value\> module`، و
- `Local\<Context\> context`

يتطلب بناء إضافة واعية بالسياق إدارة دقيقة للبيانات الثابتة العامة لضمان الاستقرار والصحة. نظرًا لأنه يمكن تحميل الإضافة عدة مرات، ربما حتى من مؤشرات ترابط مختلفة، يجب حماية أي بيانات ثابتة عامة مخزنة في الإضافة بشكل صحيح، ويجب ألا تحتوي على أي إشارات ثابتة إلى كائنات JavaScript. والسبب في ذلك هو أن كائنات JavaScript صالحة فقط في سياق واحد، ومن المحتمل أن تتسبب في حدوث عطل عند الوصول إليها من السياق الخاطئ أو من مؤشر ترابط مختلف عن الذي تم إنشاؤه عليه.

يمكن تنظيم الإضافة الواعية بالسياق لتجنب البيانات الثابتة العامة عن طريق تنفيذ الخطوات التالية:

- تحديد فئة ستحتوي على بيانات لكل مثيل إضافة ولديها عضو ثابت بالشكل  
- تخصيص مثيل لهذه الفئة في الذاكرة المؤقتة في تهيئة الإضافة. يمكن تحقيق ذلك باستخدام الكلمة الأساسية `new`.
- استدعاء `node::AddEnvironmentCleanupHook()`، وتمرير المثيل الذي تم إنشاؤه أعلاه ومؤشر إلى `DeleteInstance()`. سيضمن ذلك حذف المثيل عند إزالة البيئة.
- تخزين مثيل الفئة في `v8::External`، و
- تمرير `v8::External` إلى جميع الطرق المعرضة لـ JavaScript عن طريق تمريرها إلى `v8::FunctionTemplate::New()` أو `v8::Function::New()` التي تنشئ وظائف JavaScript المدعومة أصليًا. يقبل المعامل الثالث لـ `v8::FunctionTemplate::New()` أو `v8::Function::New()` `v8::External` ويجعله متاحًا في معاودة الاتصال الأصلية باستخدام الطريقة `v8::FunctionCallbackInfo::Data()`.

سيضمن ذلك وصول البيانات لكل مثيل إضافة إلى كل ربط يمكن استدعاؤه من JavaScript. يجب أيضًا تمرير البيانات لكل مثيل إضافة إلى أي معاودات اتصال غير متزامنة قد تنشئها الإضافة.

يوضح المثال التالي تنفيذ إضافة واعية بالسياق:

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Ensure this per-addon-instance data is deleted at environment cleanup.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Per-addon data.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Retrieve the per-addon-instance data.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Create a new instance of `AddonData` for this instance of the addon and
  // tie its life cycle to that of the Node.js environment.
  AddonData* data = new AddonData(isolate);

  // Wrap the data in a `v8::External` so we can pass it to the method we
  // expose.
  Local<External> external = External::New(isolate, data);

  // Expose the method `Method` to JavaScript, and make sure it receives the
  // per-addon-instance data we created above by passing `external` as the
  // third parameter to the `FunctionTemplate` constructor.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### دعم العامل (Worker) {#worker-support}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| الإصدار v14.8.0، الإصدار v12.19.0 | يمكن الآن أن تكون خطافات التنظيف غير متزامنة. |
:::

لكي يتم تحميلها من بيئات Node.js متعددة، مثل الخيط الرئيسي وخيط العامل (Worker)، يجب أن يكون للملحق إما:

- أن يكون ملحق Node-API، أو
- أن يتم تعريفه على أنه مدرك للسياق باستخدام `NODE_MODULE_INIT()` كما هو موضح أعلاه

من أجل دعم خيوط [`Worker`](/ar/nodejs/api/worker_threads#class-worker)، تحتاج الملحقات إلى تنظيف أي موارد ربما تكون قد خصصتها عند خروج مثل هذا الخيط. يمكن تحقيق ذلك من خلال استخدام وظيفة `AddEnvironmentCleanupHook()`:

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
تضيف هذه الوظيفة خطافًا سيتم تشغيله قبل إغلاق مثيل Node.js معين. إذا لزم الأمر، يمكن إزالة هذه الخطافات قبل تشغيلها باستخدام `RemoveEnvironmentCleanupHook()`، والتي لها نفس التوقيع. يتم تشغيل عمليات الاسترجاع بترتيب آخر ما يدخل أول ما يخرج (LIFO).

إذا لزم الأمر، هناك زوج إضافي من التحميلات الزائدة لـ `AddEnvironmentCleanupHook()` و `RemoveEnvironmentCleanupHook()`، حيث يأخذ خطاف التنظيف دالة استرجاع. يمكن استخدام هذا لإغلاق الموارد غير المتزامنة، مثل أي معالجات libuv مسجلة بواسطة الملحق.

يستخدم `addon.cc` التالي `AddEnvironmentCleanupHook`:

```C++ [C++]
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// ملاحظة: في تطبيق واقعي، لا تعتمد على البيانات الثابتة/العالمية.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // تأكد من أن VM لا يزال على قيد الحياة
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// قم بتهيئة هذا الملحق ليكون مدركًا للسياق.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
اختبر في JavaScript عن طريق التشغيل:

```js [ESM]
// test.js
require('./build/Release/addon');
```

### البناء {#building}

بمجرد كتابة الكود المصدري، يجب تجميعه في ملف ثنائي باسم `addon.node`. للقيام بذلك، قم بإنشاء ملف يسمى `binding.gyp` في المستوى الأعلى من المشروع يصف تكوين بناء الوحدة باستخدام تنسيق يشبه JSON. يتم استخدام هذا الملف بواسطة [node-gyp](https://github.com/nodejs/node-gyp)، وهي أداة مكتوبة خصيصًا لتجميع إضافات Node.js.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```

يتم تجميع وتوزيع نسخة من أداة `node-gyp` مع Node.js كجزء من `npm`. هذه النسخة ليست متاحة مباشرة للمطورين لاستخدامها وهي مخصصة فقط لدعم القدرة على استخدام الأمر `npm install` لتجميع وتثبيت الإضافات. يمكن للمطورين الذين يرغبون في استخدام `node-gyp` مباشرة تثبيته باستخدام الأمر `npm install -g node-gyp`. راجع [تعليمات تثبيت](https://github.com/nodejs/node-gyp#installation) `node-gyp` لمزيد من المعلومات، بما في ذلك المتطلبات الخاصة بالمنصة.

بمجرد إنشاء ملف `binding.gyp`، استخدم `node-gyp configure` لإنشاء ملفات بناء المشروع المناسبة للمنصة الحالية. سيؤدي هذا إلى إنشاء إما `Makefile` (على منصات Unix) أو ملف `vcxproj` (على Windows) في دليل `build/`.

بعد ذلك، قم باستدعاء الأمر `node-gyp build` لإنشاء ملف `addon.node` المجمع. سيتم وضع هذا في الدليل `build/Release/`.

عند استخدام `npm install` لتثبيت إضافة Node.js، يستخدم npm نسخته المجمعة الخاصة من `node-gyp` لتنفيذ نفس مجموعة الإجراءات هذه، وإنشاء نسخة مجمعة من الإضافة لمنصة المستخدم عند الطلب.

بمجرد البناء، يمكن استخدام الإضافة الثنائية من داخل Node.js عن طريق توجيه [`require()`](/ar/nodejs/api/modules#requireid) إلى وحدة `addon.node` المبنية:

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
نظرًا لأن المسار الدقيق إلى الإضافة الثنائية المجمعة يمكن أن يختلف اعتمادًا على كيفية تجميعها (على سبيل المثال، قد يكون في `./build/Debug/` في بعض الأحيان)، يمكن للإضافات استخدام حزمة [bindings](https://github.com/TooTallNate/node-bindings) لتحميل الوحدة المجمعة.

في حين أن تطبيق حزمة `bindings` أكثر تعقيدًا في كيفية تحديد موقع وحدات الإضافة، إلا أنه يستخدم بشكل أساسي نمط `try…catch` مشابه لما يلي:

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### الربط بالمكتبات المضمنة مع Node.js {#linking-to-libraries-included-with-nodejs}

يستخدم Node.js مكتبات مرتبطة بشكل ثابت مثل V8 و libuv و OpenSSL. يلزم ربط جميع الوظائف الإضافية بـ V8 ويمكن ربطها بأي من التبعيات الأخرى أيضًا. عادةً ما يكون هذا بسيطًا مثل تضمين عبارات `#include \<...\>` المناسبة (مثل `#include \<v8.h\>`) وسيحدد `node-gyp` الرؤوس المناسبة تلقائيًا. ومع ذلك ، هناك بعض المحاذير التي يجب أن تكون على دراية بها:

- عندما يتم تشغيل `node-gyp` ، فإنه سيكتشف إصدار الإصدار المحدد من Node.js وتنزيل إما tarball المصدر الكامل أو الرؤوس فقط. إذا تم تنزيل المصدر الكامل ، فستتمكن الوظائف الإضافية من الوصول الكامل إلى المجموعة الكاملة من تبعيات Node.js. ومع ذلك ، إذا تم تنزيل رؤوس Node.js فقط ، فستكون الرموز التي تم تصديرها بواسطة Node.js فقط هي المتاحة.
- يمكن تشغيل `node-gyp` باستخدام علامة `--nodedir` التي تشير إلى صورة مصدر Node.js محلية. باستخدام هذا الخيار ، ستتمكن الوظيفة الإضافية من الوصول إلى المجموعة الكاملة من التبعيات.

### تحميل الوظائف الإضافية باستخدام `require()` {#loading-addons-using-require}

امتداد اسم الملف للثنائي الإضافي المترجم هو `.node` (على عكس `.dll` أو `.so`). تم كتابة الدالة [`require()`](/ar/nodejs/api/modules#requireid) للبحث عن الملفات بامتداد الملف `.node` وتهيئتها كمكتبات مرتبطة ديناميكيًا.

عند استدعاء [`require()`](/ar/nodejs/api/modules#requireid) ، يمكن عادةً حذف الامتداد `.node` وسيظل Node.js يعثر على الوظيفة الإضافية وتهيئتها. ومع ذلك ، هناك تحذير واحد هو أن Node.js سيحاول أولاً تحديد موقع وتحميل الوحدات النمطية أو ملفات JavaScript التي تشترك في نفس الاسم الأساسي. على سبيل المثال ، إذا كان هناك ملف `addon.js` في نفس الدليل الذي يوجد به الثنائي `addon.node` ، فستعطي [`require('addon')`](/ar/nodejs/api/modules#requireid) الأولوية لملف `addon.js` وتحميله بدلاً من ذلك.

## تجريدات أصلية لـ Node.js {#native-abstractions-for-nodejs}

تستخدم كل الأمثلة الموضحة في هذا المستند بشكل مباشر واجهات برمجة تطبيقات Node.js و V8 لتنفيذ الوظائف الإضافية. يمكن أن تتغير واجهة برمجة تطبيقات V8 ، وقد تغيرت ، بشكل كبير من إصدار V8 إلى آخر (ومن إصدار رئيسي لـ Node.js إلى التالي). مع كل تغيير ، قد تحتاج الوظائف الإضافية إلى التحديث وإعادة التجميع من أجل الاستمرار في العمل. تم تصميم جدول إصدار Node.js لتقليل تكرار وتأثير هذه التغييرات ، ولكن لا يوجد الكثير الذي يمكن أن يفعله Node.js لضمان استقرار واجهات برمجة تطبيقات V8.

توفر [التجريدات الأصلية لـ Node.js](https://github.com/nodejs/nan) (أو `nan`) مجموعة من الأدوات التي يوصى بأن يستخدمها مطورو الوظائف الإضافية للحفاظ على التوافق بين الإصدارات السابقة والمستقبلية من V8 و Node.js. انظر إلى [`nan`](https://github.com/nodejs/nan/tree/HEAD/examples/) [أمثلة](https://github.com/nodejs/nan/tree/HEAD/examples/) لتوضيح كيفية استخدامه.


## Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ar/nodejs/api/documentation#stability-index) [Stability: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

Node-API هي واجهة برمجة تطبيقات (API) لإنشاء إضافات أصلية. وهي مستقلة عن وقت تشغيل JavaScript الأساسي (مثل V8) ويتم صيانتها كجزء من Node.js نفسها. ستكون واجهة برمجة التطبيقات (API) هذه واجهة ثنائية للتطبيق (ABI) مستقرة عبر إصدارات Node.js. وهي تهدف إلى عزل الإضافات عن التغييرات في محرك JavaScript الأساسي والسماح للوحدات النمطية التي تم تجميعها لإصدار واحد بالتشغيل على الإصدارات اللاحقة من Node.js دون إعادة تجميع. يتم إنشاء/تغليف الإضافات بنفس النهج/الأدوات الموضحة في هذه الوثيقة (node-gyp، إلخ). والفرق الوحيد هو مجموعة واجهات برمجة التطبيقات (APIs) التي يستخدمها الكود الأصلي. بدلاً من استخدام واجهات برمجة تطبيقات V8 أو [Native Abstractions for Node.js](https://github.com/nodejs/nan)، يتم استخدام الوظائف المتوفرة في Node-API.

يتضمن إنشاء وصيانة إضافة تستفيد من استقرار ABI الذي توفره Node-API بعض [اعتبارات التنفيذ](/ar/nodejs/api/n-api#implications-of-abi-stability).

لاستخدام Node-API في مثال "Hello world" أعلاه، استبدل محتوى `hello.cc` بما يلي. تظل جميع التعليمات الأخرى كما هي.

```C++ [C++]
// hello.cc using Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
الوظائف المتوفرة وكيفية استخدامها موثقة في [C/C++ addons with Node-API](/ar/nodejs/api/n-api).


## أمثلة إضافات {#addon-examples}

فيما يلي بعض الأمثلة على الإضافات التي تهدف إلى مساعدة المطورين على البدء. تستخدم الأمثلة واجهات برمجة تطبيقات V8. راجع [مرجع V8](https://v8docs.nodesource.com/) عبر الإنترنت للحصول على مساعدة بشأن استدعاءات V8 المختلفة، و[دليل المضمن](https://v8.dev/docs/embed) الخاص بـ V8 للحصول على شرح للعديد من المفاهيم المستخدمة مثل المقابض والنطاقات وقوالب الوظائف وما إلى ذلك.

يستخدم كل من هذه الأمثلة ملف `binding.gyp` التالي:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```
في الحالات التي يوجد فيها أكثر من ملف `.cc`، ما عليك سوى إضافة اسم الملف الإضافي إلى مصفوفة `sources`:

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
بمجرد أن يصبح ملف `binding.gyp` جاهزًا، يمكن تهيئة أمثلة الإضافات وإنشائها باستخدام `node-gyp`:

```bash [BASH]
node-gyp configure build
```
### وسيطات الوظيفة {#function-arguments}

ستعرض الإضافات عادةً الكائنات والوظائف التي يمكن الوصول إليها من JavaScript التي تعمل داخل Node.js. عند استدعاء الوظائف من JavaScript، يجب تعيين وسيطات الإدخال والقيمة المرجعة من وإلى كود C/C++.

يوضح المثال التالي كيفية قراءة وسيطات الوظيفة التي تم تمريرها من JavaScript وكيفية إرجاع نتيجة:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// هذا هو تنفيذ طريقة "add"
// يتم تمرير وسيطات الإدخال باستخدام
// بنية const FunctionCallbackInfo<Value>& args
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // تحقق من عدد الوسيطات التي تم تمريرها.
  if (args.Length() < 2) {
    // اطرح خطأ يتم تمريره مرة أخرى إلى JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // تحقق من أنواع الوسيطات
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // قم بتنفيذ العملية
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // قم بتعيين القيمة المرجعة (باستخدام
  // FunctionCallbackInfo<Value>& التي تم تمريرها)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
بمجرد تجميعها، يمكن طلب واستخدام الإضافة المثال من داخل Node.js:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
```

### ردود الاتصال (Callbacks) {#callbacks}

من الممارسات الشائعة في الإضافات تمرير دوال JavaScript إلى دالة C++ وتنفيذها من هناك. يوضح المثال التالي كيفية استدعاء ردود الاتصال هذه:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
يستخدم هذا المثال نموذجًا ذا وسيطتين من `Init()` يتلقى كائن `module` كاملاً كوسيطة ثانية. يسمح هذا للإضافة بالكتابة فوق `exports` بالكامل بدالة واحدة بدلاً من إضافة الدالة كخاصية لـ `exports`.

لاختباره، قم بتشغيل JavaScript التالي:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// يطبع: 'hello world'
});
```
في هذا المثال، يتم استدعاء دالة رد الاتصال بشكل متزامن.

### مصنع الكائنات (Object factory) {#object-factory}

يمكن للإضافات إنشاء وإرجاع كائنات جديدة من داخل دالة C++ كما هو موضح في المثال التالي. يتم إنشاء كائن وإرجاعه بخاصية `msg` التي تعكس السلسلة التي تم تمريرها إلى `createObject()`:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
لاختباره في JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// يطبع: 'hello world'
```

### مصنع الدوال {#function-factory}

سيناريو شائع آخر هو إنشاء دوال JavaScript التي تغلف دوال C++ وإعادة تلك الدوال إلى JavaScript:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // omit this to make it anonymous
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
لاختبار:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```
### تغليف كائنات C++ {#wrapping-c-objects}

من الممكن أيضًا تغليف كائنات/فئات C++ بطريقة تسمح بإنشاء مثيلات جديدة باستخدام عامل التشغيل `new` في JavaScript:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
بعد ذلك، في `myobject.h`، يرث فئة التغليف من `node::ObjectWrap`:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```
في `myobject.cc`، قم بتنفيذ الطرق المختلفة التي سيتم عرضها. في التعليمات البرمجية التالية، يتم عرض الطريقة `plusOne()` عن طريق إضافتها إلى نموذج البناء الأولي:

```C++ [C++]
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 field for the MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
لبناء هذا المثال، يجب إضافة الملف `myobject.cc` إلى `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
اختبره مع:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
```
سيتم تشغيل المدمر لكائن التغليف عندما يتم جمع الكائن المهمل. لاختبار المدمر، هناك علامات سطر أوامر يمكن استخدامها لجعل من الممكن فرض جمع البيانات المهملة. يتم توفير هذه العلامات من قبل محرك JavaScript V8 الأساسي. وهي عرضة للتغيير أو الإزالة في أي وقت. لم يتم توثيقها بواسطة Node.js أو V8، ولا يجب استخدامها أبدًا خارج الاختبار.

أثناء إيقاف تشغيل العملية أو سلاسل العمل، لا يتم استدعاء المدمرات بواسطة محرك JS. لذلك تقع على عاتق المستخدم مسؤولية تتبع هذه الكائنات والتأكد من تدميرها بشكل صحيح لتجنب تسرب الموارد.


### مصنع الكائنات المغلفة {#factory-of-wrapped-objects}

بدلاً من ذلك، من الممكن استخدام نمط المصنع لتجنب إنشاء مثيلات الكائنات بشكل صريح باستخدام عامل التشغيل `new` في JavaScript:

```js [ESM]
const obj = addon.createObject();
// بدلاً من:
// const obj = new addon.Object();
```
أولاً، يتم تنفيذ الطريقة `createObject()` في `addon.cc`:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
في `myobject.h`، تتم إضافة الطريقة الثابتة `NewInstance()` للتعامل مع إنشاء مثيل للكائن. تحل هذه الطريقة محل استخدام `new` في JavaScript:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
التنفيذ في `myobject.cc` مشابه للمثال السابق:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
مرة أخرى، لإنشاء هذا المثال، يجب إضافة الملف `myobject.cc` إلى `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
اختبره باستخدام:

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### تمرير الكائنات المغلفة {#passing-wrapped-objects-around}

بالإضافة إلى تغليف وإرجاع كائنات C++، من الممكن تمرير الكائنات المغلفة عن طريق فك تغليفها باستخدام وظيفة المساعد Node.js‏ `node::ObjectWrap::Unwrap`. يوضح المثال التالي دالة `add()` التي يمكن أن تأخذ كائني `MyObject` كمدخلات:

```C++ [C++]
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
في `myobject.h`، تتم إضافة طريقة عامة جديدة للسماح بالوصول إلى القيم الخاصة بعد فك تغليف الكائن.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
تظل عملية تنفيذ `myobject.cc` مشابهة للإصدار السابق:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```
اختبره باستخدام:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```
