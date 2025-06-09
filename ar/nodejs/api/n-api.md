---
title: توثيق N-API في Node.js
description: توفر واجهة N-API (واجهة برمجة التطبيقات في Node.js) واجهة مستقرة ومتسقة للإضافات الأصلية، مما يسمح للمطورين بإنشاء وحدات متوافقة عبر إصدارات مختلفة من Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق N-API في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر واجهة N-API (واجهة برمجة التطبيقات في Node.js) واجهة مستقرة ومتسقة للإضافات الأصلية، مما يسمح للمطورين بإنشاء وحدات متوافقة عبر إصدارات مختلفة من Node.js.
  - - meta
    - name: twitter:title
      content: توثيق N-API في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر واجهة N-API (واجهة برمجة التطبيقات في Node.js) واجهة مستقرة ومتسقة للإضافات الأصلية، مما يسمح للمطورين بإنشاء وحدات متوافقة عبر إصدارات مختلفة من Node.js.
---


# Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

Node-API (سابقًا N-API) هي واجهة برمجة تطبيقات لبناء الإضافات الأصلية. وهي مستقلة عن وقت تشغيل JavaScript الأساسي (على سبيل المثال، V8) ويتم صيانتها كجزء من Node.js نفسه. ستكون واجهة برمجة التطبيقات هذه واجهة تطبيق ثنائية (ABI) مستقرة عبر إصدارات Node.js. وهي تهدف إلى عزل الإضافات عن التغييرات في محرك JavaScript الأساسي والسماح للوحدات النمطية التي تم تجميعها لإصدار رئيسي واحد بالتشغيل على الإصدارات الرئيسية اللاحقة من Node.js دون إعادة التجميع. يوفر دليل [استقرار ABI](https://nodejs.org/en/docs/guides/abi-stability/) شرحًا أكثر تعمقًا.

يتم إنشاء/تعبئة الإضافات بنفس النهج/الأدوات الموضحة في القسم المعنون [إضافات C++‎](/ar/nodejs/api/addons). والفرق الوحيد هو مجموعة واجهات برمجة التطبيقات التي يستخدمها الرمز الأصلي. بدلاً من استخدام V8 أو [التجريدات الأصلية لـ Node.js](https://github.com/nodejs/nan) APIs، يتم استخدام الوظائف المتوفرة في Node-API.

تُستخدم واجهات برمجة التطبيقات التي تعرضها Node-API بشكل عام لإنشاء قيم JavaScript ومعالجتها. تتوافق المفاهيم والعمليات عمومًا مع الأفكار المحددة في مواصفات لغة ECMA-262. تتمتع واجهات برمجة التطبيقات بالخصائص التالية:

- تُرجع جميع استدعاءات Node-API رمز حالة من النوع `napi_status`. تشير هذه الحالة إلى ما إذا كان استدعاء واجهة برمجة التطبيقات قد نجح أم فشل.
- يتم تمرير قيمة إرجاع واجهة برمجة التطبيقات عبر معلمة إخراج.
- يتم تجريد جميع قيم JavaScript خلف نوع معتم يسمى `napi_value`.
- في حالة رمز حالة خطأ، يمكن الحصول على معلومات إضافية باستخدام `napi_get_last_error_info`. يمكن العثور على مزيد من المعلومات في قسم معالجة الأخطاء [معالجة الأخطاء](/ar/nodejs/api/n-api#error-handling).

Node-API هي واجهة برمجة تطبيقات C تضمن استقرار ABI عبر إصدارات Node.js ومستويات المترجم المختلفة. يمكن أن تكون واجهة برمجة تطبيقات C++‎ أسهل في الاستخدام. لدعم استخدام C++‎، يحتفظ المشروع بوحدة تغليف C++‎ تسمى [`node-addon-api`](https://github.com/nodejs/node-addon-api). يوفر هذا الغلاف واجهة برمجة تطبيقات C++‎ مضمنة. تعتمد الملفات الثنائية التي تم إنشاؤها باستخدام `node-addon-api` على الرموز الخاصة بوظائف Node-API المستندة إلى C التي تصدرها Node.js. `node-addon-api` هي طريقة أكثر كفاءة لكتابة التعليمات البرمجية التي تستدعي Node-API. على سبيل المثال، التعليمات البرمجية التالية `node-addon-api`. يعرض القسم الأول التعليمات البرمجية `node-addon-api` ويعرض القسم الثاني ما يتم استخدامه بالفعل في الإضافة.

```C++ [C++]
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
```
```C++ [C++]
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
```
والنتيجة النهائية هي أن الإضافة تستخدم فقط واجهات برمجة تطبيقات C المصدرة. ونتيجة لذلك، فإنه لا يزال يحصل على فوائد استقرار ABI التي توفرها واجهة برمجة تطبيقات C.

عند استخدام `node-addon-api` بدلاً من واجهات برمجة تطبيقات C، ابدأ بـ [وثائق](https://github.com/nodejs/node-addon-api#api-documentation) واجهة برمجة التطبيقات لـ `node-addon-api`.

يوفر [مورد Node-API](https://nodejs.github.io/node-addon-examples/) توجيهات ونصائح ممتازة للمطورين الذين بدأوا للتو في استخدام Node-API و `node-addon-api`. يمكن العثور على موارد وسائط إضافية في صفحة [وسائط Node-API](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md).


## آثار استقرار ABI {#implications-of-abi-stability}

على الرغم من أن Node-API يوفر ضمانًا لاستقرار ABI، إلا أن أجزاء أخرى من Node.js لا تفعل ذلك، وقد لا تفعل أي مكتبات خارجية مستخدمة من الملحق. على وجه الخصوص، لا يوفر أي من واجهات برمجة التطبيقات التالية ضمانًا لاستقرار ABI عبر الإصدارات الرئيسية:

- واجهات برمجة تطبيقات C++ الخاصة بـ Node.js المتوفرة عبر أي من
- واجهات برمجة تطبيقات libuv المضمنة أيضًا مع Node.js والمتوفرة عبر
- واجهة برمجة تطبيقات V8 المتوفرة عبر

وبالتالي، لكي يظل الملحق متوافقًا مع ABI عبر إصدارات Node.js الرئيسية، يجب أن يستخدم Node-API حصريًا عن طريق تقييد نفسه باستخدام

```C [C]
#include <node_api.h>
```
وعن طريق التحقق، بالنسبة لجميع المكتبات الخارجية التي يستخدمها، من أن المكتبة الخارجية تقدم ضمانات استقرار ABI مماثلة لـ Node-API.

## بناء {#building}

بخلاف الوحدات النمطية المكتوبة بلغة JavaScript، يتطلب تطوير ونشر ملحقات Node.js الأصلية باستخدام Node-API مجموعة إضافية من الأدوات. بالإضافة إلى الأدوات الأساسية المطلوبة للتطوير لـ Node.js، يحتاج مطور الملحق الأصلي إلى سلسلة أدوات يمكنها تجميع كود C و C++ في ملف ثنائي. بالإضافة إلى ذلك، اعتمادًا على كيفية نشر الملحق الأصلي، سيحتاج *مستخدم* الملحق الأصلي أيضًا إلى تثبيت سلسلة أدوات C/C++.

بالنسبة لمطوري Linux، تتوفر حزم أدوات C/C++ الضرورية بسهولة. يستخدم [GCC](https://gcc.gnu.org/) على نطاق واسع في مجتمع Node.js للبناء والاختبار عبر مجموعة متنوعة من الأنظمة الأساسية. بالنسبة للعديد من المطورين، فإن البنية التحتية للمترجم [LLVM](https://llvm.org/) هي أيضًا خيار جيد.

بالنسبة لمطوري Mac، يوفر [Xcode](https://developer.apple.com/xcode/) جميع أدوات المترجم المطلوبة. ومع ذلك، ليس من الضروري تثبيت Xcode IDE بأكمله. يقوم الأمر التالي بتثبيت سلسلة الأدوات الضرورية:

```bash [BASH]
xcode-select --install
```
بالنسبة لمطوري Windows، يوفر [Visual Studio](https://visualstudio.microsoft.com/) جميع أدوات المترجم المطلوبة. ومع ذلك، ليس من الضروري تثبيت Visual Studio IDE بأكمله. يقوم الأمر التالي بتثبيت سلسلة الأدوات الضرورية:

```bash [BASH]
npm install --global windows-build-tools
```
تصف الأقسام أدناه الأدوات الإضافية المتاحة لتطوير ونشر ملحقات Node.js الأصلية.


### أدوات البناء {#build-tools}

تتطلب كلتا الأداتين المذكورتين هنا أن يكون لدى *مستخدمي* الوظيفة الإضافية الأصلية سلسلة أدوات C/C++ مثبتة لكي يتمكنوا من تثبيت الوظيفة الإضافية الأصلية بنجاح.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) هو نظام بناء يعتمد على [gyp-next](https://github.com/nodejs/gyp-next) وهي نسخة معدلة من أداة [GYP](https://gyp.gsrc.io/) الخاصة بـ Google، ويأتي مدمجًا مع npm. يتطلب GYP، وبالتالي node-gyp، تثبيت Python.

تاريخيًا، كانت node-gyp هي الأداة المفضلة لبناء الوظائف الإضافية الأصلية. لديها اعتماد وتوثيق واسع النطاق. ومع ذلك، واجه بعض المطورين قيودًا في node-gyp.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) هو نظام بناء بديل يعتمد على [CMake](https://cmake.org/).

CMake.js هو خيار جيد للمشاريع التي تستخدم بالفعل CMake أو للمطورين المتأثرين بالقيود الموجودة في node-gyp. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) هو مثال على مشروع وظيفة إضافية أصلية يعتمد على CMake.

### تحميل الثنائيات المترجمة مسبقًا {#uploading-precompiled-binaries}

تسمح الأدوات الثلاث المذكورة هنا لمطوري ومشرفي الوظائف الإضافية الأصلية بإنشاء وتحميل الثنائيات إلى خوادم عامة أو خاصة. عادةً ما يتم دمج هذه الأدوات مع أنظمة بناء CI/CD مثل [Travis CI](https://travis-ci.org/) و [AppVeyor](https://www.appveyor.com/) لبناء وتحميل الثنائيات لمجموعة متنوعة من المنصات والبنى. تصبح هذه الثنائيات متاحة للتنزيل من قبل المستخدمين الذين لا يحتاجون إلى تثبيت سلسلة أدوات C/C++.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) هي أداة تعتمد على node-gyp تضيف القدرة على تحميل الثنائيات إلى خادم من اختيار المطور. تتمتع node-pre-gyp بدعم جيد بشكل خاص لتحميل الثنائيات إلى Amazon S3.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) هي أداة تدعم عمليات البناء باستخدام node-gyp أو CMake.js. على عكس node-pre-gyp التي تدعم مجموعة متنوعة من الخوادم، فإن prebuild تقوم بتحميل الثنائيات فقط إلى [إصدارات GitHub](https://help.github.com/en/github/administering-a-repository/about-releases). يعد prebuild خيارًا جيدًا لمشاريع GitHub التي تستخدم CMake.js.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) هي أداة تستند إلى node-gyp. ميزة prebuildify هي أن الثنائيات المبنية يتم تجميعها مع الوظيفة الإضافية الأصلية عند تحميلها إلى npm. يتم تنزيل الثنائيات من npm وتكون متاحة على الفور لمستخدم الوحدة النمطية عند تثبيت الوظيفة الإضافية الأصلية.

## الاستخدام {#usage}

لاستخدام وظائف Node-API، قم بتضمين الملف [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) الموجود في دليل src في شجرة تطوير node:

```C [C]
#include <node_api.h>
```
سيؤدي هذا إلى الاشتراك في `NAPI_VERSION` الافتراضي للإصدار المحدد من Node.js. لضمان التوافق مع إصدارات معينة من Node-API، يمكن تحديد الإصدار بشكل صريح عند تضمين الرأس:

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
يقيد هذا سطح Node-API للوظائف التي كانت متاحة في الإصدارات المحددة (والإصدارات السابقة) فقط.

بعض سطح Node-API تجريبي ويتطلب الاشتراك الصريح:

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
في هذه الحالة، سيكون سطح API بأكمله، بما في ذلك أي واجهات برمجة تطبيقات تجريبية، متاحًا لرمز الوحدة النمطية.

في بعض الأحيان، يتم تقديم ميزات تجريبية تؤثر على واجهات برمجة التطبيقات المستقرة التي تم إصدارها بالفعل. يمكن تعطيل هذه الميزات عن طريق الانسحاب:

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
حيث `\<FEATURE_NAME\>` هو اسم ميزة تجريبية تؤثر على كل من واجهات برمجة التطبيقات التجريبية والمستقرة.

## مصفوفة إصدار Node-API {#node-api-version-matrix}

حتى الإصدار 9، كانت إصدارات Node-API تراكمية ويتم إصدارها بشكل مستقل عن Node.js. هذا يعني أن أي إصدار كان امتدادًا للإصدار السابق من حيث أنه يحتوي على جميع واجهات برمجة التطبيقات من الإصدار السابق مع بعض الإضافات. دعم كل إصدار من Node.js إصدارًا واحدًا فقط من Node-API. على سبيل المثال، يدعم v18.15.0 إصدار Node-API 8 فقط. تم تحقيق استقرار ABI لأن 8 كانت مجموعة فرعية صارمة من جميع الإصدارات السابقة.

اعتبارًا من الإصدار 9، على الرغم من أن إصدارات Node-API تستمر في إصدارها بشكل مستقل، فقد تحتاج وظيفة إضافية تعمل مع إصدار Node-API 9 إلى تحديثات التعليمات البرمجية للتشغيل مع إصدار Node-API 10. يتم الحفاظ على استقرار ABI، ومع ذلك، لأن إصدارات Node.js التي تدعم إصدارات Node-API أعلى من 8 ستدعم جميع الإصدارات بين 8 وأعلى إصدار تدعمه وستعرض افتراضيًا واجهات برمجة التطبيقات للإصدار 8 ما لم تشترك وظيفة إضافية في إصدار Node-API أعلى. يوفر هذا النهج مرونة تحسين وظائف Node-API الحالية بشكل أفضل مع الحفاظ على استقرار ABI. يمكن أن تستمر الوظائف الإضافية الموجودة في التشغيل دون إعادة تجميع باستخدام إصدار سابق من Node-API. إذا كانت وظيفة إضافية تحتاج إلى وظائف من إصدار Node-API أحدث، فستكون هناك حاجة إلى تغييرات في التعليمات البرمجية الموجودة وإعادة التجميع لاستخدام هذه الوظائف الجديدة على أي حال.

في إصدارات Node.js التي تدعم إصدار Node-API 9 والإصدارات الأحدث، سيؤدي تحديد `NAPI_VERSION=X` واستخدام وحدات الماكرو لتهيئة الوظائف الإضافية الموجودة إلى تضمين إصدار Node-API المطلوب الذي سيتم استخدامه في وقت التشغيل في الوظيفة الإضافية. إذا لم يتم تعيين `NAPI_VERSION`، فسيكون افتراضيًا 8.

قد لا يكون هذا الجدول محدثًا في التدفقات الأقدم، وأحدث المعلومات موجودة في أحدث وثائق API في: [مصفوفة إصدار Node-API](/ar/nodejs/api/n-api#node-api-version-matrix)

| إصدار Node-API | مدعوم في |
| --- | --- |
| 9 | v18.17.0+, 20.3.0+, 21.0.0 وجميع الإصدارات اللاحقة |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 وجميع الإصدارات اللاحقة |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 وجميع الإصدارات اللاحقة |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 وجميع الإصدارات اللاحقة |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 وجميع الإصدارات اللاحقة |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 وجميع الإصدارات اللاحقة |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 وجميع الإصدارات اللاحقة |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 وجميع الإصدارات اللاحقة |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 وجميع الإصدارات اللاحقة |
* كان Node-API تجريبيًا.

** تضمن Node.js 8.0.0 Node-API كتجريبي. تم إصداره كإصدار Node-API 1 ولكن استمر في التطور حتى Node.js 8.6.0. تختلف واجهة برمجة التطبيقات في الإصدارات قبل Node.js 8.6.0. نوصي بإصدار Node-API 3 أو أحدث.

سيكون لكل واجهة برمجة تطبيقات موثقة لـ Node-API رأس يسمى `added in:`، وستحتوي واجهات برمجة التطبيقات المستقرة على رأس إضافي `Node-API version:`. تكون واجهات برمجة التطبيقات قابلة للاستخدام مباشرة عند استخدام إصدار Node.js يدعم إصدار Node-API الموضح في `Node-API version:` أو أعلى. عند استخدام إصدار Node.js لا يدعم `Node-API version:` المدرجة أو إذا لم تكن هناك `Node-API version:` مدرجة، فستكون واجهة برمجة التطبيقات متاحة فقط إذا `#define NAPI_EXPERIMENTAL` تسبق تضمين `node_api.h` أو `js_native_api.h`. إذا بدا أن واجهة برمجة التطبيقات غير متوفرة في إصدار من Node.js أحدث من الإصدار الموضح في `added in:`، فمن المرجح أن يكون هذا هو سبب الغياب الظاهر.

يمكن العثور على Node-APIs المرتبطة بشكل صارم بالوصول إلى ميزات ECMAScript من التعليمات البرمجية الأصلية بشكل منفصل في `js_native_api.h` و `js_native_api_types.h`. يتم تضمين واجهات برمجة التطبيقات المحددة في هذه الرؤوس في `node_api.h` و `node_api_types.h`. يتم تنظيم الرؤوس بهذه الطريقة للسماح بتنفيذ Node-API خارج Node.js. بالنسبة لهذه التطبيقات، قد لا تكون واجهات برمجة التطبيقات الخاصة بـ Node.js قابلة للتطبيق.

يمكن فصل الأجزاء الخاصة بـ Node.js من وظيفة إضافية عن التعليمات البرمجية التي تعرض الوظائف الفعلية لبيئة JavaScript بحيث يمكن استخدام الأخير مع تطبيقات متعددة لـ Node-API. في المثال أدناه، يشير `addon.c` و `addon.h` فقط إلى `js_native_api.h`. هذا يضمن أنه يمكن إعادة استخدام `addon.c` للترجمة مقابل إما تطبيق Node.js لـ Node-API أو أي تطبيق لـ Node-API خارج Node.js.

`addon_node.c` هو ملف منفصل يحتوي على نقطة الدخول الخاصة بـ Node.js إلى الوظيفة الإضافية والتي تقوم بإنشاء الوظيفة الإضافية عن طريق الاتصال بـ `addon.c` عند تحميل الوظيفة الإضافية في بيئة Node.js.

```C [C]
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
```
```C [C]
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
```
```C [C]
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
```

## دورة حياة بيئات APIs {#environment-life-cycle-apis}

[القسم 8.7](https://tc39.es/ecma262/#sec-agents) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/) يحدد مفهوم "وكيل" على أنه بيئة قائمة بذاتها يتم فيها تشغيل كود JavaScript. يمكن بدء وإنهاء العديد من هذه الوكلاء إما بشكل متزامن أو بالتسلسل بواسطة العملية.

تتوافق بيئة Node.js مع وكيل ECMAScript. في العملية الرئيسية، يتم إنشاء بيئة عند بدء التشغيل، ويمكن إنشاء بيئات إضافية على سلاسل رسائل منفصلة لتعمل بمثابة [سلاسل رسائل عاملة](https://nodejs.org/api/worker_threads). عندما يتم تضمين Node.js في تطبيق آخر، قد يقوم السلسلة الرئيسية للتطبيق أيضًا بإنشاء وتدمير بيئة Node.js عدة مرات خلال دورة حياة عملية التطبيق بحيث أن كل بيئة Node.js يتم إنشاؤها بواسطة التطبيق قد تقوم بدورها، خلال دورة حياتها، بإنشاء وتدمير بيئات إضافية كسلاسل رسائل عاملة.

من منظور ملحق أصلي، هذا يعني أن الارتباطات التي يوفرها قد يتم استدعاؤها عدة مرات، من سياقات متعددة، وحتى بشكل متزامن من سلاسل رسائل متعددة.

قد تحتاج الملحقات الأصلية إلى تخصيص حالة عامة تستخدمها خلال دورة حياتها لبيئة Node.js بحيث تكون الحالة فريدة لكل مثيل من الملحق.

لهذه الغاية، توفر Node-API طريقة لربط البيانات بحيث تكون دورة حياتها مرتبطة بدورة حياة بيئة Node.js.

### `napi_set_instance_data` {#napi_set_instance_data}

**أضيف في: v12.8.0, v10.20.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API ضمنها.
- `[in] data`: عنصر البيانات لإتاحته للارتباطات الخاصة بهذا المثيل.
- `[in] finalize_cb`: الدالة التي سيتم استدعاؤها عند إنهاء البيئة. تتلقى الدالة `data` حتى تتمكن من تحريرها. توفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_hint`: تلميح اختياري لتمريره إلى معاودة الاتصال النهائية أثناء التجميع.

إرجاع `napi_ok` إذا نجح API.

يربط هذا API `data` ببيئة Node.js قيد التشغيل حاليًا. يمكن استرداد `data` لاحقًا باستخدام `napi_get_instance_data()`. سيتم استبدال أي بيانات موجودة مرتبطة ببيئة Node.js قيد التشغيل حاليًا والتي تم تعيينها عن طريق استدعاء سابق لـ `napi_set_instance_data()`. إذا تم توفير `finalize_cb` بواسطة الاستدعاء السابق، فلن يتم استدعاؤه.


### `napi_get_instance_data` {#napi_get_instance_data}

**أُضيف في: الإصدار 12.8.0، 10.20.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: البيئة التي يتم استدعاء Node-API ضمنها.
- `[out] data`: عنصر البيانات الذي تم ربطه مسبقًا ببيئة Node.js قيد التشغيل حاليًا عن طريق استدعاء `napi_set_instance_data()`.

يُرجع `napi_ok` إذا نجح الـ API.

يسترجع هذا الـ API البيانات التي تم ربطها مسبقًا ببيئة Node.js قيد التشغيل حاليًا عبر `napi_set_instance_data()`. إذا لم يتم تعيين أي بيانات، فسوف ينجح الاستدعاء وسيتم تعيين `data` إلى `NULL`.

## أنواع بيانات Node-API الأساسية {#basic-node-api-data-types}

تكشف Node-API عن أنواع البيانات الأساسية التالية كخلاصات تستهلكها الـ APIs المختلفة. يجب التعامل مع هذه الـ APIs على أنها مبهمة، ويمكن فحصها فقط باستخدام استدعاءات Node-API الأخرى.

### `napi_status` {#napi_status}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

رمز حالة متكامل يشير إلى نجاح أو فشل استدعاء Node-API. حاليًا، يتم دعم رموز الحالة التالية.

```C [C]
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* غير مستخدم */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
إذا كانت هناك حاجة إلى معلومات إضافية عند إرجاع API لحالة فاشلة، فيمكن الحصول عليها عن طريق استدعاء `napi_get_last_error_info`.

### `napi_extended_error_info` {#napi_extended_error_info}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: سلسلة بترميز UTF8 تحتوي على وصف محايد للـ VM للخطأ.
- `engine_reserved`: محجوز لتفاصيل خطأ خاصة بالـ VM. هذا غير مُنفَّذ حاليًا لأي VM.
- `engine_error_code`: رمز خطأ خاص بالـ VM. هذا غير مُنفَّذ حاليًا لأي VM.
- `error_code`: رمز حالة Node-API الذي نشأ مع الخطأ الأخير.

راجع قسم [التعامل مع الأخطاء](/ar/nodejs/api/n-api#error-handling) للحصول على معلومات إضافية.


### `napi_env` {#napi_env}

يُستخدم `napi_env` لتمثيل سياق يمكن لتنفيذ Node-API الأساسي استخدامه للاحتفاظ بحالة خاصة بـ VM. يتم تمرير هذا الهيكل إلى الوظائف الأصلية عند استدعاؤها، ويجب تمريره مرة أخرى عند إجراء استدعاءات Node-API. على وجه التحديد، يجب تمرير نفس `napi_env` الذي تم تمريره عند استدعاء الوظيفة الأصلية الأولية إلى أي استدعاءات Node-API متداخلة لاحقة. لا يُسمح بتخزين `napi_env` مؤقتًا لغرض إعادة الاستخدام العام، وتمرير `napi_env` بين مثيلات نفس الملحق الذي يعمل على سلاسل رسائل [`Worker`](/ar/nodejs/api/worker_threads#class-worker) مختلفة. يصبح `napi_env` غير صالح عند إلغاء تحميل مثيل لملحق أصلي. يتم تسليم الإخطار بهذا الحدث من خلال عمليات الاسترجاع التي تم إعطاؤها لـ [`napi_add_env_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_env_cleanup_hook) و [`napi_set_instance_data`](/ar/nodejs/api/n-api#napi_set_instance_data).

### `node_api_basic_env` {#node_api_basic_env}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يتم تمرير هذا المتغير من `napi_env` إلى المصفيات النهائية المتزامنة ([`node_api_basic_finalize`](/ar/nodejs/api/n-api#node_api_basic_finalize)). هناك مجموعة فرعية من Node-APIs التي تقبل معاملًا من النوع `node_api_basic_env` كمعاملها الأول. لا تصل هذه APIs إلى حالة محرك JavaScript وبالتالي فهي آمنة للاستدعاء من المصفيات النهائية المتزامنة. يُسمح بتمرير معامل من النوع `napi_env` إلى هذه APIs، ومع ذلك، لا يُسمح بتمرير معامل من النوع `node_api_basic_env` إلى APIs التي تصل إلى حالة محرك JavaScript. محاولة القيام بذلك بدون تحويل سينتج عنه تحذير من المترجم أو خطأ عند تجميع الوظائف الإضافية بعلامات تتسبب في إصدارها تحذيرات و/أو أخطاء عند تمرير أنواع مؤشرات غير صحيحة إلى دالة. سيؤدي استدعاء مثل هذه APIs من مصفي نهائي متزامن في النهاية إلى إنهاء التطبيق.

### `napi_value` {#napi_value}

هذا مؤشر معتم يستخدم لتمثيل قيمة JavaScript.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**أُضيف في: الإصدار 10.6.0**

**إصدار N-API: 4**

هذا مؤشر غير شفاف يمثل وظيفة JavaScript يمكن استدعاؤها بشكل غير متزامن من عدة سلاسل رسائل عبر `napi_call_threadsafe_function()`.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**أُضيف في: الإصدار 10.6.0**

**إصدار N-API: 4**

قيمة تُعطى إلى `napi_release_threadsafe_function()` للإشارة إلى ما إذا كان سيتم إغلاق الوظيفة الآمنة لسلاسل الرسائل على الفور (`napi_tsfn_abort`) أو مجرد تحريرها (`napi_tsfn_release`) وبالتالي ستكون متاحة للاستخدام اللاحق عبر `napi_acquire_threadsafe_function()` و `napi_call_threadsafe_function()`.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**أُضيف في: الإصدار 10.6.0**

**إصدار N-API: 4**

قيمة تُعطى إلى `napi_call_threadsafe_function()` للإشارة إلى ما إذا كان يجب أن يحظر الاستدعاء كلما كان الطابور المرتبط بالوظيفة الآمنة لسلاسل الرسائل ممتلئًا.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### أنواع إدارة الذاكرة في Node-API {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

هذا تجريد يُستخدم للتحكم في دورة حياة الكائنات التي يتم إنشاؤها داخل نطاق معين وتعديلها. بشكل عام، يتم إنشاء قيم Node-API في سياق نطاق المقبض. عند استدعاء طريقة أصلية من JavaScript، سيوجد نطاق مقبض افتراضي. إذا لم ينشئ المستخدم نطاق مقبض جديدًا بشكل صريح، فسيتم إنشاء قيم Node-API في نطاق المقبض الافتراضي. بالنسبة لأي استدعاءات للتعليمات البرمجية خارج تنفيذ الطريقة الأصلية (على سبيل المثال، أثناء استدعاء رد اتصال libuv)، يجب على الوحدة إنشاء نطاق قبل استدعاء أي وظائف يمكن أن تؤدي إلى إنشاء قيم JavaScript.

يتم إنشاء نطاقات المقبض باستخدام [`napi_open_handle_scope`](/ar/nodejs/api/n-api#napi_open_handle_scope) ويتم تدميرها باستخدام [`napi_close_handle_scope`](/ar/nodejs/api/n-api#napi_close_handle_scope). يمكن أن يشير إغلاق النطاق إلى GC إلى أن جميع `napi_value`s التي تم إنشاؤها خلال دورة حياة نطاق المقبض لم تعد مُشار إليها من إطار المكدس الحالي.

لمزيد من التفاصيل، راجع [إدارة دورة حياة الكائن](/ar/nodejs/api/n-api#object-lifetime-management).


#### ‏`napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

مجالات المقابض القابلة للهروب هي نوع خاص من مجالات المقابض لإرجاع القيم التي تم إنشاؤها داخل مجال مقبض معين إلى مجال أصلي.

#### ‏`napi_ref` {#napi_ref}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

هذا هو التجريد المستخدم للإشارة إلى `napi_value`. يتيح ذلك للمستخدمين إدارة دورات حياة قيم JavaScript، بما في ذلك تحديد الحد الأدنى لدورات حياتهم بشكل صريح.

لمزيد من التفاصيل، راجع [إدارة دورة حياة الكائن](/ar/nodejs/api/n-api#object-lifetime-management).

#### ‏`napi_type_tag` {#napi_type_tag}

**أُضيف في: v14.8.0, v12.19.0**

**إصدار N-API: 8**

قيمة 128 بت مخزنة كعددين صحيحين غير موقعين 64 بت. إنها تعمل كمعرف فريد عالمي (UUID) يمكن من خلاله "وسم" كائنات JavaScript أو [العناصر الخارجية](/ar/nodejs/api/n-api#napi_create_external) للتأكد من أنها من نوع معين. هذا فحص أقوى من [`napi_instanceof`](/ar/nodejs/api/n-api#napi_instanceof)، لأن الأخير يمكن أن يقدم نتيجة إيجابية خاطئة إذا تم التلاعب بنموذج الكائن. يكون وسم النوع أكثر فائدة بالاقتران مع [`napi_wrap`](/ar/nodejs/api/n-api#napi_wrap) لأنه يضمن إمكانية تحويل المؤشر الذي تم استرجاعه من كائن ملتف بأمان إلى النوع الأصلي المطابق لعلامة النوع التي تم تطبيقها مسبقًا على كائن JavaScript.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### ‏`napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**أُضيف في: v14.10.0, v12.19.0**

قيمة مبهمة تم إرجاعها بواسطة [`napi_add_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_async_cleanup_hook). يجب تمريرها إلى [`napi_remove_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_remove_async_cleanup_hook) عند اكتمال سلسلة أحداث التنظيف غير المتزامنة.

### أنواع معاودة الاتصال Node-API {#node-api-callback-types}

#### ‏`napi_callback_info` {#napi_callback_info}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

نوع بيانات مبهم يتم تمريره إلى دالة معاودة الاتصال. يمكن استخدامه للحصول على معلومات إضافية حول السياق الذي تم فيه استدعاء معاودة الاتصال.

#### ‏`napi_callback` {#napi_callback}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

نوع مؤشر الدالة للدوال الأصلية التي يوفرها المستخدم والتي سيتم عرضها على JavaScript عبر Node-API. يجب أن تفي دوال معاودة الاتصال بالتوقيع التالي:

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
باستثناء الأسباب التي تمت مناقشتها في [إدارة دورة حياة الكائن](/ar/nodejs/api/n-api#object-lifetime-management)، ليس من الضروري إنشاء مجال مقبض و/أو معاودة اتصال داخل `napi_callback`.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**أُضيف في: v21.6.0, v20.12.0, v18.20.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

نوع مؤشر الوظيفة للوظائف التي يوفرها الملحق والتي تسمح للمستخدم بالإخطار عندما تكون البيانات المملوكة خارجيًا جاهزة للتنظيف لأن الكائن المرتبط بها قد تم جمعه بواسطة جامع القمامة. يجب على المستخدم توفير وظيفة تفي بالتوقيع التالي والتي سيتم استدعاؤها عند جمع الكائن. حاليًا، يمكن استخدام `node_api_basic_finalize` لمعرفة متى يتم جمع الكائنات التي تحتوي على بيانات خارجية.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```

ما لم يكن لأسباب تمت مناقشتها في [إدارة عمر الكائن](/ar/nodejs/api/n-api#object-lifetime-management)، فإن إنشاء معالج و/أو نطاق رد اتصال داخل نص الوظيفة ليس ضروريًا.

نظرًا لأن هذه الوظائف قد يتم استدعاؤها بينما يكون محرك JavaScript في حالة لا يمكنه فيها تنفيذ كود JavaScript، فلا يمكن استدعاء سوى واجهات برمجة تطبيقات Node التي تقبل `node_api_basic_env` كمعاملها الأول. يمكن استخدام [`node_api_post_finalizer`](/ar/nodejs/api/n-api#node_api_post_finalizer) لجدولة استدعاءات Node-API التي تتطلب الوصول إلى حالة محرك JavaScript ليتم تشغيلها بعد اكتمال دورة جمع القمامة الحالية.

في حالة [`node_api_create_external_string_latin1`](/ar/nodejs/api/n-api#node_api_create_external_string_latin1) و [`node_api_create_external_string_utf16`](/ar/nodejs/api/n-api#node_api_create_external_string_utf16) قد يكون المعامل `env` فارغًا، لأنه يمكن جمع السلاسل الخارجية خلال الجزء الأخير من إيقاف تشغيل البيئة.

سجل التغييرات:

-  تجريبي (`NAPI_EXPERIMENTAL`): لا يمكن استدعاء سوى استدعاءات Node-API التي تقبل `node_api_basic_env` كمعاملها الأول، وإلا فسيتم إنهاء التطبيق برسالة خطأ مناسبة. يمكن إيقاف تشغيل هذه الميزة عن طريق تحديد `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.


#### `napi_finalize` {#napi_finalize}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

نوع مؤشر دالة للدالة المقدمة من الملحق والتي تسمح للمستخدم بجدولة مجموعة من المكالمات إلى Node-APIs استجابةً لحدث جمع البيانات المهملة، بعد اكتمال دورة جمع البيانات المهملة. يمكن استخدام مؤشرات الدالة هذه مع [`node_api_post_finalizer`](/ar/nodejs/api/n-api#node_api_post_finalizer).

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
سجل التغييرات:

- تجريبي (`NAPI_EXPERIMENTAL` محدد): لم يعد من الممكن استخدام دالة من هذا النوع كـ finalizer، باستثناء [`node_api_post_finalizer`](/ar/nodejs/api/n-api#node_api_post_finalizer). يجب استخدام [`node_api_basic_finalize`](/ar/nodejs/api/n-api#node_api_basic_finalize) بدلاً من ذلك. يمكن إيقاف تشغيل هذه الميزة عن طريق تحديد `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

مؤشر دالة يستخدم مع الدوال التي تدعم العمليات غير المتزامنة. يجب أن تستوفي دوال الاستدعاء التوقيع التالي:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
يجب أن تتجنب تطبيقات هذه الدالة إجراء مكالمات Node-API التي تنفذ JavaScript أو تتفاعل مع كائنات JavaScript. يجب أن تكون مكالمات Node-API في `napi_async_complete_callback` بدلاً من ذلك. لا تستخدم المعامل `napi_env` لأنه من المحتمل أن يؤدي إلى تنفيذ JavaScript.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

مؤشر دالة يستخدم مع الدوال التي تدعم العمليات غير المتزامنة. يجب أن تستوفي دوال الاستدعاء التوقيع التالي:

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
إلا للأسباب التي نوقشت في [إدارة دورة حياة الكائن](/ar/nodejs/api/n-api#object-lifetime-management)، ليس من الضروري إنشاء نطاق معالج و/أو استدعاء داخل نص الدالة.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**أضيف في: v10.6.0**

**إصدار N-API: 4**

مؤشر وظيفة يستخدم مع استدعاءات الوظائف غير المتزامنة الآمنة للمواضيع. سيتم استدعاء رد الاتصال على الموضوع الرئيسي. الغرض منه هو استخدام عنصر بيانات يصل عبر قائمة الانتظار من أحد المواضيع الثانوية لإنشاء المعلمات الضرورية لاستدعاء JavaScript، عادةً عبر `napi_call_function`، ثم إجراء الاستدعاء إلى JavaScript.

يتم إعطاء البيانات التي تصل من الموضوع الثانوي عبر قائمة الانتظار في معلمة `data` ويتم إعطاء وظيفة JavaScript التي سيتم استدعاؤها في معلمة `js_callback`.

يقوم Node-API بإعداد البيئة قبل استدعاء رد الاتصال هذا، لذلك يكفي استدعاء وظيفة JavaScript عبر `napi_call_function` بدلاً من عبر `napi_make_callback`.

يجب أن تستوفي وظائف رد الاتصال التوقيع التالي:

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: البيئة المستخدمة لاستدعاءات API، أو `NULL` إذا كانت الوظيفة الآمنة للمواضيع قيد الإزالة وقد تحتاج `data` إلى التحرير.
- `[in] js_callback`: وظيفة JavaScript التي سيتم استدعاؤها، أو `NULL` إذا كانت الوظيفة الآمنة للمواضيع قيد الإزالة وقد تحتاج `data` إلى التحرير. قد تكون أيضًا `NULL` إذا تم إنشاء الوظيفة الآمنة للمواضيع بدون `js_callback`.
- `[in] context`: البيانات الاختيارية التي تم إنشاء الوظيفة الآمنة للمواضيع بها.
- `[in] data`: البيانات التي تم إنشاؤها بواسطة الموضوع الثانوي. تقع على عاتق رد الاتصال مسؤولية تحويل هذه البيانات الأصلية إلى قيم JavaScript (باستخدام وظائف Node-API) التي يمكن تمريرها كمعلمات عند استدعاء `js_callback`. تتم إدارة هذا المؤشر بالكامل بواسطة المواضيع ورد الاتصال هذا. وبالتالي يجب على رد الاتصال هذا تحرير البيانات.

ما لم يكن ذلك لأسباب تمت مناقشتها في [إدارة دورة حياة الكائن](/ar/nodejs/api/n-api#object-lifetime-management)، فإن إنشاء معالج و / أو نطاق رد اتصال داخل نص الوظيفة ليس ضروريًا.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**أُضيف في: الإصدار v19.2.0، الإصدار v18.13.0**

**إصدار N-API: 3**

مؤشر الدالة المستخدم مع [`napi_add_env_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_env_cleanup_hook). سيتم استدعاؤه عند إيقاف تشغيل البيئة.

يجب أن تستوفي دوال الاستدعاء التوقيع التالي:

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: البيانات التي تم تمريرها إلى [`napi_add_env_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_env_cleanup_hook).

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**أُضيف في: الإصدار v14.10.0، الإصدار v12.19.0**

مؤشر الدالة المستخدم مع [`napi_add_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_async_cleanup_hook). سيتم استدعاؤه عند إيقاف تشغيل البيئة.

يجب أن تستوفي دوال الاستدعاء التوقيع التالي:

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: المقبض الذي يجب تمريره إلى [`napi_remove_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_remove_async_cleanup_hook) بعد الانتهاء من التنظيف غير المتزامن.
- `[in] data`: البيانات التي تم تمريرها إلى [`napi_add_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_async_cleanup_hook).

يجب أن يبدأ نص الدالة إجراءات التنظيف غير المتزامنة وفي نهايتها يجب تمرير `handle` في استدعاء إلى [`napi_remove_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_remove_async_cleanup_hook).

## معالجة الأخطاء {#error-handling}

تستخدم Node-API كلاً من قيم الإرجاع واستثناءات JavaScript لمعالجة الأخطاء. تشرح الأقسام التالية النهج المتبع لكل حالة.

### قيم الإرجاع {#return-values}

تتشابه جميع دوال Node-API في نمط معالجة الأخطاء نفسه. نوع الإرجاع لجميع دوال API هو `napi_status`.

ستكون قيمة الإرجاع `napi_ok` إذا كان الطلب ناجحًا ولم يتم طرح أي استثناء JavaScript غير مُعالج. إذا حدث خطأ وتم طرح استثناء، فسيتم إرجاع قيمة `napi_status` للخطأ. إذا تم طرح استثناء ولم يحدث أي خطأ، فسيتم إرجاع `napi_pending_exception`.

في الحالات التي يتم فيها إرجاع قيمة إرجاع بخلاف `napi_ok` أو `napi_pending_exception`، يجب استدعاء [`napi_is_exception_pending`](/ar/nodejs/api/n-api#napi_is_exception_pending) للتحقق مما إذا كان هناك استثناء معلق. راجع قسم الاستثناءات لمزيد من التفاصيل.

يتم تحديد المجموعة الكاملة لقيم `napi_status` المحتملة في `napi_api_types.h`.

توفر قيمة الإرجاع `napi_status` تمثيلًا مستقلاً عن الجهاز الظاهري للخطأ الذي حدث. في بعض الحالات، يكون من المفيد أن تكون قادرًا على الحصول على معلومات أكثر تفصيلاً، بما في ذلك سلسلة تمثل الخطأ بالإضافة إلى معلومات خاصة بالجهاز الظاهري (المحرك).

من أجل استرداد هذه المعلومات، يتم توفير [`napi_get_last_error_info`](/ar/nodejs/api/n-api#napi_get_last_error_info) الذي يُرجع بنية `napi_extended_error_info`. تنسيق بنية `napi_extended_error_info` هو كما يلي:

**أُضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: تمثيل نصي للخطأ الذي حدث.
- `engine_reserved`: مقبض مبهم محجوز لاستخدام المحرك فقط.
- `engine_error_code`: رمز خطأ خاص بالجهاز الظاهري.
- `error_code`: رمز حالة Node-API للخطأ الأخير.

تُرجع [`napi_get_last_error_info`](/ar/nodejs/api/n-api#napi_get_last_error_info) معلومات آخر استدعاء Node-API تم إجراؤه.

لا تعتمد على محتوى أو تنسيق أي من المعلومات الموسعة لأنها لا تخضع لـ SemVer وقد تتغير في أي وقت. الغرض منه هو لأغراض التسجيل فقط.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**أضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[out] result`: هيكل `napi_extended_error_info` الذي يحتوي على مزيد من المعلومات حول الخطأ.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تسترجع واجهة برمجة التطبيقات (API) هذه هيكل `napi_extended_error_info` الذي يحتوي على معلومات حول آخر خطأ حدث.

يكون محتوى `napi_extended_error_info` الذي تم إرجاعه صالحًا فقط حتى يتم استدعاء دالة Node-API على نفس `env`. يتضمن هذا استدعاءً لـ `napi_is_exception_pending` لذلك قد يكون من الضروري غالبًا عمل نسخة من المعلومات بحيث يمكن استخدامها لاحقًا. يشير المؤشر الذي تم إرجاعه في `error_message` إلى سلسلة محددة بشكل ثابت لذلك من الآمن استخدام هذا المؤشر إذا قمت بنسخه من حقل `error_message` (الذي سيتم تجاوزه) قبل استدعاء دالة Node-API أخرى.

لا تعتمد على محتوى أو تنسيق أي من المعلومات الموسعة لأنها لا تخضع لـ SemVer وقد تتغير في أي وقت. الغرض منه هو لأغراض التسجيل فقط.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء JavaScript معلق.

### الاستثناءات {#exceptions}

قد يؤدي أي استدعاء لدالة Node-API إلى استثناء JavaScript معلق. هذا هو الحال بالنسبة لأي من وظائف واجهة برمجة التطبيقات، حتى تلك التي قد لا تتسبب في تنفيذ JavaScript.

إذا كانت قيمة `napi_status` التي تم إرجاعها بواسطة دالة هي `napi_ok`، فلا يوجد استثناء معلق ولا يلزم اتخاذ أي إجراء إضافي. إذا كانت قيمة `napi_status` التي تم إرجاعها أي شيء آخر غير `napi_ok` أو `napi_pending_exception`، من أجل محاولة الاسترداد والمتابعة بدلاً من مجرد الإرجاع على الفور، يجب استدعاء [`napi_is_exception_pending`](/ar/nodejs/api/n-api#napi_is_exception_pending) لتحديد ما إذا كان هناك استثناء معلق أم لا.

في كثير من الحالات، عند استدعاء دالة Node-API وكان هناك استثناء معلق بالفعل، فسترجع الدالة على الفور بقيمة `napi_status` هي `napi_pending_exception`. ومع ذلك، هذا ليس هو الحال بالنسبة لجميع الوظائف. تسمح Node-API باستدعاء مجموعة فرعية من الوظائف للسماح ببعض التنظيف البسيط قبل العودة إلى JavaScript. في هذه الحالة، ستعكس `napi_status` حالة الوظيفة. لن تعكس الاستثناءات المعلقة السابقة. لتجنب الالتباس، تحقق من حالة الخطأ بعد كل استدعاء للدالة.

عندما يكون هناك استثناء معلق، يمكن استخدام أحد نهجين.

النهج الأول هو إجراء أي تنظيف مناسب ثم الإرجاع بحيث يعود التنفيذ إلى JavaScript. كجزء من الانتقال مرة أخرى إلى JavaScript، سيتم طرح الاستثناء في النقطة الموجودة في كود JavaScript حيث تم استدعاء الطريقة الأصلية. سلوك معظم استدعاءات Node-API غير محدد أثناء وجود استثناء معلق، وسيعود العديد منها ببساطة `napi_pending_exception`، لذا قم بأقل قدر ممكن ثم ارجع إلى JavaScript حيث يمكن معالجة الاستثناء.

النهج الثاني هو محاولة معالجة الاستثناء. ستكون هناك حالات يمكن فيها للكود الأصلي التقاط الاستثناء واتخاذ الإجراء المناسب ثم المتابعة. يوصى بهذا فقط في حالات محددة حيث من المعروف أنه يمكن معالجة الاستثناء بأمان. في هذه الحالات، يمكن استخدام [`napi_get_and_clear_last_exception`](/ar/nodejs/api/n-api#napi_get_and_clear_last_exception) للحصول على الاستثناء ومسحه. عند النجاح، ستحتوي النتيجة على مقبض لآخر JavaScript `Object` تم طرحه. إذا تم تحديد، بعد استرداد الاستثناء، أنه لا يمكن معالجة الاستثناء على الإطلاق، فيمكن إعادة طرحه باستخدام [`napi_throw`](/ar/nodejs/api/n-api#napi_throw) حيث يكون الخطأ هو قيمة JavaScript التي سيتم طرحها.

تتوفر أيضًا وظائف الأداة المساعدة التالية في حالة احتياج الكود الأصلي إلى طرح استثناء أو تحديد ما إذا كانت `napi_value` هي مثيل لكائن JavaScript `Error`: [`napi_throw_error`](/ar/nodejs/api/n-api#napi_throw_error)، [`napi_throw_type_error`](/ar/nodejs/api/n-api#napi_throw_type_error)، [`napi_throw_range_error`](/ar/nodejs/api/n-api#napi_throw_range_error)، [`node_api_throw_syntax_error`](/ar/nodejs/api/n-api#node_api_throw_syntax_error) و [`napi_is_error`](/ar/nodejs/api/n-api#napi_is_error).

تتوفر أيضًا وظائف الأداة المساعدة التالية في حالة احتياج الكود الأصلي إلى إنشاء كائن `Error`: [`napi_create_error`](/ar/nodejs/api/n-api#napi_create_error)، [`napi_create_type_error`](/ar/nodejs/api/n-api#napi_create_type_error)، [`napi_create_range_error`](/ar/nodejs/api/n-api#napi_create_range_error) و [`node_api_create_syntax_error`](/ar/nodejs/api/n-api#node_api_create_syntax_error)، حيث النتيجة هي `napi_value` التي تشير إلى كائن JavaScript `Error` الذي تم إنشاؤه حديثًا.

يضيف مشروع Node.js رموز خطأ إلى جميع الأخطاء التي يتم إنشاؤها داخليًا. الهدف هو أن تستخدم التطبيقات رموز الخطأ هذه لجميع عمليات التحقق من الأخطاء. ستبقى رسائل الخطأ المرتبطة بها، ولكنها ستكون مخصصة فقط للاستخدام في التسجيل والعرض مع توقع أن الرسالة يمكن أن تتغير دون تطبيق SemVer. لدعم هذا النموذج باستخدام Node-API، سواء في الوظائف الداخلية أو لوظائف الوحدة النمطية المحددة (كممارسة جيدة)، تأخذ وظائف `throw_` و `create_` معلمة رمز اختيارية وهي السلسلة الخاصة بالرمز المراد إضافتها إلى كائن الخطأ. إذا كانت المعلمة الاختيارية `NULL`، فلن يتم ربط أي رمز بالخطأ. إذا تم توفير رمز، فسيتم أيضًا تحديث الاسم المرتبط بالخطأ ليكون:

```text [TEXT]
originalName [code]
```
حيث `originalName` هو الاسم الأصلي المرتبط بالخطأ و `code` هو الرمز الذي تم توفيره. على سبيل المثال، إذا كان الرمز هو `'ERR_ERROR_1'` ويتم إنشاء `TypeError`، فسيكون الاسم:

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] error`: قيمة JavaScript المراد طرحها.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بطرح قيمة JavaScript المقدمة.

#### `napi_throw_error` {#napi_throw_error}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] code`: رمز خطأ اختياري ليتم تعيينه على الخطأ.
- `[in] msg`: سلسلة C تمثل النص المراد إقرانه بالخطأ.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بطرح `Error` في JavaScript مع النص المقدم.

#### `napi_throw_type_error` {#napi_throw_type_error}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] code`: رمز خطأ اختياري ليتم تعيينه على الخطأ.
- `[in] msg`: سلسلة C تمثل النص المراد إقرانه بالخطأ.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بطرح `TypeError` في JavaScript مع النص المقدم.

#### `napi_throw_range_error` {#napi_throw_range_error}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] code`: رمز خطأ اختياري ليتم تعيينه على الخطأ.
- `[in] msg`: سلسلة C تمثل النص المراد إقرانه بالخطأ.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بطرح `RangeError` في JavaScript مع النص المقدم.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**أُضيف في: الإصدار v17.2.0، v16.14.0**

**إصدار N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: البيئة التي يُستدعى فيها API.
- `[in] code`: رمز خطأ اختياري ليُعيَّن على الخطأ.
- `[in] msg`: سلسلة C تمثل النص المراد ربطه بالخطأ.

إرجاع `napi_ok` إذا نجح API.

يُطلق API هذا `SyntaxError` لجافاسكربت مع النص المقدم.

#### `napi_is_error` {#napi_is_error}

**أُضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: البيئة التي يُستدعى فيها API.
- `[in] value`: `napi_value` المراد التحقق منه.
- `[out] result`: قيمة منطقية تُعيَّن إلى true إذا كان `napi_value` يمثل خطأ، أو false بخلاف ذلك.

إرجاع `napi_ok` إذا نجح API.

يستعلم API هذا عن `napi_value` للتحقق مما إذا كان يمثل كائن خطأ.

#### `napi_create_error` {#napi_create_error}

**أُضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: البيئة التي يُستدعى فيها API.
- `[in] code`: `napi_value` اختياري مع السلسلة لرمز الخطأ المراد ربطه بالخطأ.
- `[in] msg`: `napi_value` يشير إلى `string` في جافاسكربت لاستخدامه كرسالة لـ `Error`.
- `[out] result`: `napi_value` يمثل الخطأ الذي تم إنشاؤه.

إرجاع `napi_ok` إذا نجح API.

يُرجع API هذا `Error` جافاسكربت مع النص المقدم.

#### `napi_create_type_error` {#napi_create_type_error}

**أُضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: البيئة التي يُستدعى فيها API.
- `[in] code`: `napi_value` اختياري مع السلسلة لرمز الخطأ المراد ربطه بالخطأ.
- `[in] msg`: `napi_value` يشير إلى `string` في جافاسكربت لاستخدامه كرسالة لـ `Error`.
- `[out] result`: `napi_value` يمثل الخطأ الذي تم إنشاؤه.

إرجاع `napi_ok` إذا نجح API.

يُرجع API هذا `TypeError` جافاسكربت مع النص المقدم.


#### `napi_create_range_error` {#napi_create_range_error}

**أُضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] code`: قيمة `napi_value` اختيارية مع سلسلة رمز الخطأ المراد ربطها بالخطأ.
- `[in] msg`: `napi_value` يشير إلى `string` جافاسكربت لاستخدامه كرسالة للخطأ `Error`.
- `[out] result`: `napi_value` يمثل الخطأ الذي تم إنشاؤه.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإرجاع `RangeError` جافاسكربت مع النص المقدم.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**أُضيف في: الإصدار v17.2.0، v16.14.0**

**إصدار N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] code`: قيمة `napi_value` اختيارية مع سلسلة رمز الخطأ المراد ربطها بالخطأ.
- `[in] msg`: `napi_value` يشير إلى `string` جافاسكربت لاستخدامه كرسالة للخطأ `Error`.
- `[out] result`: `napi_value` يمثل الخطأ الذي تم إنشاؤه.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإرجاع `SyntaxError` جافاسكربت مع النص المقدم.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**أُضيف في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[out] result`: الاستثناء إذا كان معلقًا، وإلا `NULL`.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء جافاسكربت معلق.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[out] result`: قيمة منطقية يتم تعيينها على "true" إذا كان هناك استثناء معلق.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى لو كان هناك استثناء JavaScript معلق.

#### `napi_fatal_exception` {#napi_fatal_exception}

**أضيف في: v9.10.0**

**إصدار N-API: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] err`: الخطأ الذي يتم تمريره إلى `'uncaughtException'`.

تشغيل `'uncaughtException'` في JavaScript. مفيد إذا ألقى استدعاء غير متزامن (async callback) استثناءً دون طريقة للاسترداد.

### أخطاء فادحة {#fatal-errors}

في حالة حدوث خطأ غير قابل للاسترداد في إضافة أصلية، يمكن إرسال خطأ فادح لإنهاء العملية على الفور.

#### `napi_fatal_error` {#napi_fatal_error}

**أضيف في: v8.2.0**

**إصدار N-API: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: موقع اختياري حدث فيه الخطأ.
- `[in] location_len`: طول الموقع بالبايت، أو `NAPI_AUTO_LENGTH` إذا كان منتهيًا بصفر.
- `[in] message`: الرسالة المرتبطة بالخطأ.
- `[in] message_len`: طول الرسالة بالبايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بصفر.

لا تعود استدعاء الدالة، سيتم إنهاء العملية.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى لو كان هناك استثناء JavaScript معلق.

## إدارة دورة حياة الكائن {#object-lifetime-management}

عند إجراء استدعاءات Node-API، يمكن إرجاع معالجات للكائنات في الكومة الخاصة بـ VM الأساسي على هيئة `napi_values`. يجب أن تحافظ هذه المعالجات على الكائنات 'حية' حتى لا تعود مطلوبة بواسطة التعليمات البرمجية الأصلية، وإلا فقد يتم جمع الكائنات قبل أن تنتهي التعليمات البرمجية الأصلية من استخدامها.

عند إرجاع معالجات الكائنات، فإنها ترتبط بـ "نطاق". ترتبط دورة حياة النطاق الافتراضي بدورة حياة استدعاء الطريقة الأصلية. والنتيجة هي أنه، بشكل افتراضي، تظل المعالجات صالحة وستبقى الكائنات المرتبطة بهذه المعالجات حية طوال دورة حياة استدعاء الطريقة الأصلية.

ومع ذلك، في كثير من الحالات، من الضروري أن تظل المعالجات صالحة إما لفترة أقصر أو أطول من دورة حياة الطريقة الأصلية. تصف الأقسام التالية وظائف Node-API التي يمكن استخدامها لتغيير دورة حياة المعالج من الوضع الافتراضي.


### جعل مدة صلاحية المعالج أقصر من مدة صلاحية الطريقة الأصلية {#making-handle-lifespan-shorter-than-that-of-the-native-method}

غالبًا ما يكون من الضروري جعل مدة صلاحية المعالجات أقصر من مدة صلاحية الطريقة الأصلية. على سبيل المثال، ضع في اعتبارك طريقة أصلية تحتوي على حلقة تتكرر خلال العناصر الموجودة في مصفوفة كبيرة:

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
```
سيؤدي هذا إلى إنشاء عدد كبير من المعالجات، مما يستهلك موارد كبيرة. بالإضافة إلى ذلك، على الرغم من أن التعليمات البرمجية الأصلية يمكن أن تستخدم فقط أحدث معالج، إلا أن جميع الكائنات المرتبطة سيتم الاحتفاظ بها أيضًا لأنها تشترك جميعًا في نفس النطاق.

للتعامل مع هذه الحالة، يوفر Node-API القدرة على إنشاء "نطاق" جديد سيتم ربط المعالجات التي تم إنشاؤها حديثًا به. بمجرد عدم الحاجة إلى هذه المعالجات، يمكن "إغلاق" النطاق وإبطال أي معالجات مرتبطة بالنطاق. الطرق المتاحة لفتح/إغلاق النطاقات هي [`napi_open_handle_scope`](/ar/nodejs/api/n-api#napi_open_handle_scope) و [`napi_close_handle_scope`](/ar/nodejs/api/n-api#napi_close_handle_scope).

يدعم Node-API فقط تسلسلًا متداخلًا واحدًا من النطاقات. يوجد نطاق نشط واحد فقط في أي وقت، وسيتم ربط جميع المعالجات الجديدة بهذا النطاق أثناء نشاطه. يجب إغلاق النطاقات بترتيب عكسي لترتيب فتحها. بالإضافة إلى ذلك، يجب إغلاق جميع النطاقات التي تم إنشاؤها داخل طريقة أصلية قبل العودة من تلك الطريقة.

مع أخذ المثال السابق، فإن إضافة استدعاءات إلى [`napi_open_handle_scope`](/ar/nodejs/api/n-api#napi_open_handle_scope) و [`napi_close_handle_scope`](/ar/nodejs/api/n-api#napi_close_handle_scope) ستضمن صلاحية معالج واحد على الأكثر طوال تنفيذ الحلقة:

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```
عند تداخل النطاقات، هناك حالات تحتاج فيها معالجة من نطاق داخلي إلى البقاء على قيد الحياة بعد مدة صلاحية هذا النطاق. يدعم Node-API "نطاقًا قابلاً للهروب" لدعم هذه الحالة. يسمح النطاق القابل للهروب بترقية معالج واحد بحيث "يهرب" من النطاق الحالي وتتغير مدة صلاحية المعالج من النطاق الحالي إلى النطاق الخارجي.

الطرق المتاحة لفتح/إغلاق النطاقات القابلة للهروب هي [`napi_open_escapable_handle_scope`](/ar/nodejs/api/n-api#napi_open_escapable_handle_scope) و [`napi_close_escapable_handle_scope`](/ar/nodejs/api/n-api#napi_close_escapable_handle_scope).

يتم تقديم طلب ترقية المعالج من خلال [`napi_escape_handle`](/ar/nodejs/api/n-api#napi_escape_handle) والذي لا يمكن استدعاؤه إلا مرة واحدة.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: البيئة التي يتم استدعاء API فيها.
- `[out] result`: `napi_value` تمثل النطاق الجديد.

إرجاع `napi_ok` إذا نجح API.

يفتح API هذا نطاقًا جديدًا.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: البيئة التي يتم استدعاء API فيها.
- `[in] scope`: `napi_value` تمثل النطاق المراد إغلاقه.

إرجاع `napi_ok` إذا نجح API.

يغلق API هذا النطاق الذي تم تمريره. يجب إغلاق النطاقات بالترتيب العكسي لترتيب إنشائها.

يمكن استدعاء API هذا حتى في حالة وجود استثناء JavaScript معلق.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: البيئة التي يتم استدعاء API فيها.
- `[out] result`: `napi_value` تمثل النطاق الجديد.

إرجاع `napi_ok` إذا نجح API.

يفتح API هذا نطاقًا جديدًا يمكن من خلاله ترقية كائن واحد إلى النطاق الخارجي.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: البيئة التي يتم استدعاء API فيها.
- `[in] scope`: `napi_value` تمثل النطاق المراد إغلاقه.

إرجاع `napi_ok` إذا نجح API.

يغلق API هذا النطاق الذي تم تمريره. يجب إغلاق النطاقات بالترتيب العكسي لترتيب إنشائها.

يمكن استدعاء API هذا حتى في حالة وجود استثناء JavaScript معلق.


#### `napi_escape_handle` {#napi_escape_handle}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] scope`: `napi_value` يمثل النطاق الحالي.
- `[in] escapee`: `napi_value` يمثل JavaScript `Object` المراد تهريبه.
- `[out] result`: `napi_value` يمثل مقبض `Object` الذي تم تهريبه في النطاق الخارجي.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بترقية المقبض إلى كائن JavaScript بحيث يكون صالحًا طوال مدة صلاحية النطاق الخارجي. لا يمكن استدعاؤها إلا مرة واحدة لكل نطاق. إذا تم استدعاؤها أكثر من مرة، فسيتم إرجاع خطأ.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء JavaScript معلق.

### مراجع إلى القيم بمدى حياة أطول من مدى حياة الطريقة الأصلية {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

في بعض الحالات، سيحتاج الملحق إلى أن يكون قادرًا على إنشاء قيم والإشارة إليها بمدى حياة أطول من مدى حياة استدعاء طريقة أصلية واحدة. على سبيل المثال، لإنشاء منشئ ولاحقًا استخدام هذا المنشئ في طلب لإنشاء مثيلات، يجب أن يكون من الممكن الإشارة إلى كائن المنشئ عبر العديد من طلبات إنشاء المثيلات المختلفة. لن يكون هذا ممكنًا باستخدام مقبض عادي يتم إرجاعه كـ `napi_value` كما هو موضح في القسم السابق. تتم إدارة مدى حياة المقبض العادي بواسطة النطاقات ويجب إغلاق جميع النطاقات قبل نهاية الطريقة الأصلية.

توفر Node-API طرقًا لإنشاء مراجع دائمة للقيم. تسمح Node-API حاليًا بإنشاء مراجع فقط لمجموعة محدودة من أنواع القيم، بما في ذلك الكائن والخارجي والدالة والرمز.

لكل مرجع عدد مرتبط بقيمة 0 أو أعلى، والذي يحدد ما إذا كان المرجع سيحافظ على القيمة المقابلة حية. المراجع التي لها عدد 0 لا تمنع جمع القيم. أصبحت قيم أنواع الكائنات (كائن، دالة، خارجي) والرمز مراجع "ضعيفة" ولا يزال من الممكن الوصول إليها أثناء عدم جمعها. أي عدد أكبر من 0 سيمنع جمع القيم.

توجد أنواع مختلفة من قيم الرموز. يتم دعم سلوك المرجع الضعيف الحقيقي فقط بواسطة الرموز المحلية التي تم إنشاؤها باستخدام الدالة `napi_create_symbol` أو استدعاءات منشئ JavaScript `Symbol()`. تظل الرموز المسجلة عالميًا التي تم إنشاؤها باستخدام الدالة `node_api_symbol_for` أو استدعاءات دالة JavaScript `Symbol.for()` دائمًا مراجع قوية لأن جامع البيانات المهملة لا يجمعها. وينطبق الشيء نفسه على الرموز المعروفة مثل `Symbol.iterator`. كما أنها لا يتم جمعها أبدًا بواسطة جامع البيانات المهملة.

يمكن إنشاء المراجع بعدد مراجع أولي. يمكن بعد ذلك تعديل العدد من خلال [`napi_reference_ref`](/ar/nodejs/api/n-api#napi_reference_ref) و [`napi_reference_unref`](/ar/nodejs/api/n-api#napi_reference_unref). إذا تم جمع كائن أثناء أن يكون العدد للمرجع هو 0، فسترجع جميع الاستدعاءات اللاحقة للحصول على الكائن المرتبط بالمرجع [`napi_get_reference_value`](/ar/nodejs/api/n-api#napi_get_reference_value) قيمة `NULL` لـ `napi_value` التي تم إرجاعها. محاولة استدعاء [`napi_reference_ref`](/ar/nodejs/api/n-api#napi_reference_ref) لمرجع تم جمع الكائن الخاص به تؤدي إلى حدوث خطأ.

يجب حذف المراجع بمجرد عدم الحاجة إليها بواسطة الملحق. عند حذف مرجع، فإنه لن يمنع الكائن المقابل من التجميع بعد الآن. يؤدي الفشل في حذف مرجع دائم إلى حدوث "تسرب للذاكرة" مع الاحتفاظ بالذاكرة الأصلية للمرجع الدائم والكائن المقابل على الكومة إلى الأبد.

يمكن إنشاء مراجع دائمة متعددة تشير إلى نفس الكائن، وسيحافظ كل منها على الكائن حيًا أو لا يعتمد على عدده الفردي. يمكن أن تؤدي المراجع الدائمة المتعددة لنفس الكائن إلى الاحتفاظ بالذاكرة الأصلية بشكل غير متوقع. يجب الحفاظ على الهياكل الأصلية لمرجع دائم حيًا حتى يتم تنفيذ أدوات الإنهاء للكائن المشار إليه. إذا تم إنشاء مرجع دائم جديد لنفس الكائن، فلن يتم تشغيل أدوات الإنهاء لهذا الكائن ولن يتم تحرير الذاكرة الأصلية التي يشير إليها المرجع الدائم السابق. يمكن تجنب ذلك عن طريق استدعاء `napi_delete_reference` بالإضافة إلى `napi_reference_unref` قدر الإمكان.

**سجل التغييرات:**

- تجريبي (تم تعريف `NAPI_EXPERIMENTAL`): يمكن إنشاء مراجع لجميع أنواع القيم. لا تدعم أنواع القيم المدعومة الجديدة الدلالات المرجعية الضعيفة ويتم تحرير قيم هذه الأنواع عندما يصبح عدد المراجع 0 ولا يمكن الوصول إليها من المرجع بعد الآن.


#### `napi_create_reference` {#napi_create_reference}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: ‏`napi_value` الذي يتم إنشاء مرجع له.
- `[in] initial_refcount`: عدد المراجع الأولي للمرجع الجديد.
- `[out] result`: ‏`napi_ref` يشير إلى المرجع الجديد.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء مرجع جديد بعدد المراجع المحدد للقيمة التي تم تمريرها.

#### `napi_delete_reference` {#napi_delete_reference}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] ref`: ‏`napi_ref` المراد حذفه.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بحذف المرجع الذي تم تمريره.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء JavaScript معلق.

#### `napi_reference_ref` {#napi_reference_ref}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] ref`: ‏`napi_ref` الذي سيتم زيادة عدد المراجع له.
- `[out] result`: عدد المراجع الجديد.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بزيادة عدد المراجع للمرجع الذي تم تمريره وإرجاع عدد المراجع الناتج.

#### `napi_reference_unref` {#napi_reference_unref}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] ref`: ‏`napi_ref` الذي سيتم تقليل عدد المراجع له.
- `[out] result`: عدد المراجع الجديد.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بتقليل عدد المراجع للمرجع الذي تم تمريره وإرجاع عدد المراجع الناتج.


#### `napi_get_reference_value` {#napi_get_reference_value}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: البيئة التي يتم فيها استدعاء واجهة برمجة التطبيقات.
- `[in] ref`: ‏`napi_ref` الذي يتم طلب القيمة المقابلة له.
- `[out] result`: ‏`napi_value` الذي يشير إليه `napi_ref`.

يُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

إذا كانت لا تزال صالحة، تُرجع واجهة برمجة التطبيقات هذه `napi_value` الذي يمثل قيمة JavaScript المرتبطة بـ `napi_ref`. وإلا، سيكون result هو `NULL`.

### التنظيف عند الخروج من بيئة Node.js الحالية {#cleanup-on-exit-of-the-current-nodejs-environment}

في حين أن عملية Node.js عادة ما تحرر جميع مواردها عند الخروج، فإن مُضمِّني Node.js، أو دعم العامل المستقبلي، قد يتطلبون من الوظائف الإضافية تسجيل خطافات التنظيف التي سيتم تشغيلها بمجرد خروج بيئة Node.js الحالية.

توفر Node-API وظائف لتسجيل وإلغاء تسجيل عمليات الاسترجاع هذه. عند تشغيل عمليات الاسترجاع هذه، يجب تحرير جميع الموارد التي تحتفظ بها الوظيفة الإضافية.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**أُضيف في: الإصدار 10.2.0**

**إصدار N-API: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
يسجل `fun` كوظيفة يتم تشغيلها مع معلمة `arg` بمجرد خروج بيئة Node.js الحالية.

يمكن تحديد وظيفة بأمان عدة مرات بقيم `arg` مختلفة. في هذه الحالة، سيتم استدعاؤها عدة مرات أيضًا. لا يُسمح بتوفير نفس قيم `fun` و `arg` عدة مرات وسيؤدي إلى إجهاض العملية.

سيتم استدعاء الخطافات بترتيب عكسي، أي سيتم استدعاء آخر خطاف تمت إضافته أولاً.

يمكن إزالة هذا الخطاف باستخدام [`napi_remove_env_cleanup_hook`](/ar/nodejs/api/n-api#napi_remove_env_cleanup_hook). عادةً ما يحدث ذلك عندما يتم بالفعل هدم المورد الذي تمت إضافة هذا الخطاف من أجله.

للتنظيف غير المتزامن، يتوفر [`napi_add_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_async_cleanup_hook).


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**أُضيف في: v10.2.0**

**إصدار N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
إلغاء تسجيل `fun` كدالة ليتم تشغيلها مع معامل `arg` بمجرد خروج بيئة Node.js الحالية. يجب أن تكون كل من قيمة الوسيطة وقيمة الدالة متطابقة تمامًا.

يجب أن تكون الدالة قد سُجلت في الأصل باستخدام `napi_add_env_cleanup_hook`، وإلا فسيتم إنهاء العملية.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.10.0, v12.19.0 | تغيير توقيع استدعاء `hook`. |
| v14.8.0, v12.19.0 | أُضيف في: v14.8.0, v12.19.0 |
:::

**إصدار N-API: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] hook`: مؤشر الدالة المراد استدعاؤها عند إنهاء البيئة.
- `[in] arg`: المؤشر المراد تمريره إلى `hook` عند استدعائها.
- `[out] remove_handle`: مُعالج اختياري يشير إلى خطاف التنظيف غير المتزامن.

يسجل `hook`، وهي دالة من النوع [`napi_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_async_cleanup_hook)، كدالة ليتم تشغيلها مع المعاملين `remove_handle` و `arg` بمجرد خروج بيئة Node.js الحالية.

على عكس [`napi_add_env_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_env_cleanup_hook)، يُسمح للخطاف بأن يكون غير متزامن.

بخلاف ذلك، يتطابق السلوك بشكل عام مع سلوك [`napi_add_env_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_env_cleanup_hook).

إذا لم يكن `remove_handle` ‏`NULL`، فسيتم تخزين قيمة مبهمة فيه يجب تمريرها لاحقًا إلى [`napi_remove_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_remove_async_cleanup_hook)، بغض النظر عما إذا كان الخطاف قد تم استدعاؤه بالفعل. يحدث هذا عادةً عندما يتم تفكيك المورد الذي تمت إضافة هذا الخطاف له على أي حال.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v14.10.0, v12.19.0 | تمت إزالة المعامل `env`. |
| الإصدار v14.8.0, v12.19.0 | أضيف في: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: المقبض لخطاف تنظيف غير متزامن تم إنشاؤه باستخدام [`napi_add_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_async_cleanup_hook).

يقوم بإلغاء تسجيل خطاف التنظيف المطابق لـ `remove_handle`. سيمنع هذا الخطاف من التنفيذ، ما لم يكن قد بدأ التنفيذ بالفعل. يجب استدعاء هذا على أي قيمة `napi_async_cleanup_hook_handle` تم الحصول عليها من [`napi_add_async_cleanup_hook`](/ar/nodejs/api/n-api#napi_add_async_cleanup_hook).

### الإنهاء عند الخروج من بيئة Node.js {#finalization-on-the-exit-of-the-nodejs-environment}

قد يتم تفكيك بيئة Node.js في أي وقت ممكن بمجرد عدم السماح بتنفيذ JavaScript، كما هو الحال بناءً على طلب [`worker.terminate()`](/ar/nodejs/api/worker_threads#workerterminate). عندما يتم تفكيك البيئة، يتم استدعاء استدعاءات `napi_finalize` المسجلة لكائنات JavaScript ووظائف آمنة للخيوط وبيانات مثيل البيئة على الفور وبشكل مستقل.

يتم جدولة استدعاءات `napi_finalize` بعد خطافات التنظيف المسجلة يدويًا. لضمان الترتيب الصحيح لإنهاء الوظائف الإضافية أثناء إغلاق البيئة لتجنب الاستخدام بعد التحرير في استدعاء `napi_finalize`، يجب على الوظائف الإضافية تسجيل خطاف تنظيف باستخدام `napi_add_env_cleanup_hook` و `napi_add_async_cleanup_hook` لتحرير المورد المخصص يدويًا بترتيب صحيح.

## تسجيل الوحدة {#module-registration}

يتم تسجيل وحدات Node-API بطريقة مماثلة للوحدات الأخرى باستثناء أنه بدلاً من استخدام الماكرو `NODE_MODULE` يتم استخدام ما يلي:

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
الاختلاف التالي هو التوقيع لطريقة `Init`. بالنسبة لوحدة Node-API، يكون كما يلي:

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
تتم معاملة القيمة المرجعة من `Init` على أنها كائن `exports` للوحدة. يتم تمرير طريقة `Init` بكائن فارغ عبر المعامل `exports` كراحة. إذا أرجعت `Init` قيمة `NULL`، فسيتم تصدير المعامل الذي تم تمريره كـ `exports` بواسطة الوحدة. لا يمكن لوحدات Node-API تعديل كائن `module` ولكن يمكنها تحديد أي شيء كخاصية `exports` للوحدة.

لإضافة الطريقة `hello` كوظيفة بحيث يمكن استدعاؤها كطريقة توفرها الوظيفة الإضافية:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
```
لتعيين وظيفة ليتم إرجاعها بواسطة `require()` للوظيفة الإضافية:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
لتعريف فئة بحيث يمكن إنشاء مثيلات جديدة (غالبًا ما تستخدم مع [تغليف الكائن](/ar/nodejs/api/n-api#object-wrap)):

```C [C]
// ملاحظة: مثال جزئي، ليس كل الرمز المشار إليه مضمنًا
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
```
يمكنك أيضًا استخدام الماكرو `NAPI_MODULE_INIT`، الذي يعمل كاختصار لـ `NAPI_MODULE` وتحديد وظيفة `Init`:

```C [C]
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
```
يتم توفير المعاملات `env` و `exports` إلى نص الماكرو `NAPI_MODULE_INIT`.

جميع وظائف Node-API الإضافية مدركة للسياق، مما يعني أنه يمكن تحميلها عدة مرات. هناك بعض الاعتبارات التصميمية عند الإعلان عن مثل هذه الوحدة. توفر الوثائق الخاصة بـ [الوظائف الإضافية المدركة للسياق](/ar/nodejs/api/addons#context-aware-addons) مزيدًا من التفاصيل.

ستكون المتغيرات `env` و `exports` متاحة داخل نص الدالة بعد استدعاء الماكرو.

لمزيد من التفاصيل حول تعيين الخصائص على الكائنات، راجع القسم الخاص بـ [العمل مع خصائص JavaScript](/ar/nodejs/api/n-api#working-with-javascript-properties).

لمزيد من التفاصيل حول إنشاء وحدات الوظائف الإضافية بشكل عام، راجع واجهة برمجة التطبيقات الحالية.


## التعامل مع قيم JavaScript {#working-with-javascript-values}

تكشف Node-API عن مجموعة من واجهات برمجة التطبيقات لإنشاء جميع أنواع قيم JavaScript. بعض هذه الأنواع موثقة في [القسم 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/).

بشكل أساسي، تُستخدم واجهات برمجة التطبيقات هذه للقيام بأحد الإجراءات التالية:

يتم تمثيل قيم Node-API بواسطة النوع `napi_value`. أي استدعاء Node-API يتطلب قيمة JavaScript يأخذ `napi_value`. في بعض الحالات، يتحقق واجهة برمجة التطبيقات من نوع `napi_value` مقدمًا. ومع ذلك، للحصول على أداء أفضل، من الأفضل للمتصل التأكد من أن `napi_value` المعني هو من نوع JavaScript الذي تتوقعه واجهة برمجة التطبيقات.

### أنواع التعداد {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**تمت الإضافة في: v13.7.0، v12.17.0، v10.20.0**

**إصدار N-API: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
يصف تعدادات مرشح `Keys/Properties`:

`napi_key_collection_mode` يحد من نطاق الخصائص التي تم جمعها.

`napi_key_own_only` يحد من الخصائص التي تم جمعها إلى الكائن المحدد فقط. سيشمل `napi_key_include_prototypes` جميع مفاتيح سلسلة النموذج الأولي للكائنات أيضًا.

#### `napi_key_filter` {#napi_key_filter}

**تمت الإضافة في: v13.7.0، v12.17.0، v10.20.0**

**إصدار N-API: 6**

```C [C]
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
```
بتات مرشح الخصائص. يمكن ربطها منطقيًا لإنشاء مرشح مركب.

#### `napi_key_conversion` {#napi_key_conversion}

**تمت الإضافة في: v13.7.0، v12.17.0، v10.20.0**

**إصدار N-API: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
سيقوم `napi_key_numbers_to_strings` بتحويل الفهارس الصحيحة إلى سلاسل. سيعيد `napi_key_keep_numbers` أرقامًا للفهارس الصحيحة.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // أنواع ES6 (تتوافق مع typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
```
يصف نوع `napi_value`. يتوافق هذا عمومًا مع الأنواع الموصوفة في [القسم 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) من مواصفات لغة ECMAScript. بالإضافة إلى الأنواع الموجودة في هذا القسم، يمكن أن يمثل `napi_valuetype` أيضًا `Function` و `Object` ببيانات خارجية.

تظهر قيمة JavaScript من النوع `napi_external` في JavaScript ككائن عادي بحيث لا يمكن تعيين أي خصائص عليه ولا يوجد نموذج أولي.


#### `napi_typedarray_type` {#napi_typedarray_type}

```C [C]
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
```
يمثل هذا نوع البيانات العددية الثنائية الأساسية لـ `TypedArray`. تتوافق عناصر هذا التعداد مع [القسم 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/).

### وظائف إنشاء الكائنات {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء Node-API ضمنها.
- `[out] result`: `napi_value` تمثل `Array` JavaScript.

تُرجع `napi_ok` إذا نجح الـ API.

يُرجع هذا الـ API قيمة Node-API تتوافق مع نوع `Array` JavaScript. يتم وصف مصفوفات JavaScript في [القسم 22.1](https://tc39.github.io/ecma262/#sec-array-objects) من مواصفات لغة ECMAScript.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء الـ API ضمنها.
- `[in] length`: الطول الأولي للـ `Array`.
- `[out] result`: `napi_value` تمثل `Array` JavaScript.

تُرجع `napi_ok` إذا نجح الـ API.

يُرجع هذا الـ API قيمة Node-API تتوافق مع نوع `Array` JavaScript. يتم تعيين خاصية الطول لـ `Array` إلى معلمة الطول التي تم تمريرها. ومع ذلك، لا يتم ضمان تخصيص المخزن المؤقت الأساسي مسبقًا بواسطة VM عند إنشاء المصفوفة. يتم ترك هذا السلوك لتنفيذ VM الأساسي. إذا كان يجب أن يكون المخزن المؤقت عبارة عن كتلة متجاورة من الذاكرة يمكن قراءتها و/أو كتابتها مباشرةً عبر C، ففكر في استخدام [`napi_create_external_arraybuffer`](/ar/nodejs/api/n-api#napi_create_external_arraybuffer).

يتم وصف مصفوفات JavaScript في [القسم 22.1](https://tc39.github.io/ecma262/#sec-array-objects) من مواصفات لغة ECMAScript.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] length`: طول مخزن المصفوفة المراد إنشاؤه بالبايت.
- `[out] data`: مؤشر إلى مخزن البايت الأساسي لـ `ArrayBuffer`. يمكن تجاهل `data` اختياريًا عن طريق تمرير `NULL`.
- `[out] result`: `napi_value` يمثل `ArrayBuffer` JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تُرجع واجهة برمجة التطبيقات (API) هذه قيمة Node-API تتوافق مع JavaScript `ArrayBuffer`. تُستخدم `ArrayBuffer`s لتمثيل مخازن بيانات ثنائية ذات طول ثابت. عادةً ما تُستخدم كمخزن احتياطي لكائنات `TypedArray`. سيحتوي `ArrayBuffer` الذي تم تخصيصه على مخزن بايت أساسي يحدد حجمه بواسطة المعلمة `length` التي تم تمريرها. يتم إرجاع المخزن الأساسي اختياريًا إلى المتصل في حالة ما إذا كان المتصل يريد معالجة المخزن مباشرةً. يمكن الكتابة في هذا المخزن مباشرةً من الكود الأصلي فقط. للكتابة في هذا المخزن من JavaScript، يجب إنشاء مصفوفة ذات نوع أو كائن `DataView`.

تم وصف كائنات JavaScript `ArrayBuffer` في [القسم 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) من مواصفات لغة ECMAScript.

#### `napi_create_buffer` {#napi_create_buffer}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] size`: حجم المخزن الأساسي بالبايت.
- `[out] data`: مؤشر خام إلى المخزن الأساسي. يمكن تجاهل `data` اختياريًا عن طريق تمرير `NULL`.
- `[out] result`: `napi_value` يمثل `node::Buffer`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تخصص واجهة برمجة التطبيقات (API) هذه كائن `node::Buffer`. على الرغم من أن هذا لا يزال بنية بيانات مدعومة بالكامل، إلا أن استخدام `TypedArray` سيكفي في معظم الحالات.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] size`: حجم المخزن المؤقت للإدخال بالبايت (يجب أن يكون هو نفسه حجم المخزن المؤقت الجديد).
- `[in] data`: مؤشر أولي إلى المخزن المؤقت الأساسي المراد نسخه منه.
- `[out] result_data`: مؤشر إلى المخزن المؤقت للبيانات الأساسية لـ `Buffer` الجديد. يمكن تجاهل `result_data` اختياريًا عن طريق تمرير `NULL`.
- `[out] result`: قيمة `napi_value` تمثل `node::Buffer`.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تخصص واجهة برمجة التطبيقات (API) هذه كائن `node::Buffer` وتهيئه بالبيانات المنسوخة من المخزن المؤقت الذي تم تمريره. على الرغم من أن هذا لا يزال هيكل بيانات مدعومًا بالكامل، إلا أنه في معظم الحالات سيكون استخدام `TypedArray` كافيًا.

#### `napi_create_date` {#napi_create_date}

**أُضيف في: v11.11.0, v10.17.0**

**إصدار N-API: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] time`: قيمة وقت ECMAScript بالمللي ثانية منذ 01 يناير 1970 بالتوقيت العالمي المنسق (UTC).
- `[out] result`: قيمة `napi_value` تمثل `Date` JavaScript.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

لا تراعي واجهة برمجة التطبيقات (API) هذه الثواني الكبيسة؛ يتم تجاهلها، حيث تتوافق ECMAScript مع مواصفات وقت POSIX.

تخصص واجهة برمجة التطبيقات (API) هذه كائن `Date` JavaScript.

يتم وصف كائنات `Date` JavaScript في [القسم 20.3](https://tc39.github.io/ecma262/#sec-date-objects) من مواصفات لغة ECMAScript.

#### `napi_create_external` {#napi_create_external}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] data`: مؤشر أولي إلى البيانات الخارجية.
- `[in] finalize_cb`: استدعاء اختياري للاتصال به عند تجميع القيمة الخارجية. يوفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_hint`: تلميح اختياري لتمريره إلى استدعاء الإنهاء أثناء التجميع.
- `[out] result`: قيمة `napi_value` تمثل قيمة خارجية.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تخصص واجهة برمجة التطبيقات (API) هذه قيمة JavaScript مع بيانات خارجية مرفقة بها. يتم استخدام هذا لتمرير البيانات الخارجية عبر كود JavaScript، بحيث يمكن استردادها لاحقًا بواسطة الكود الأصلي باستخدام [`napi_get_value_external`](/ar/nodejs/api/n-api#napi_get_value_external).

تضيف واجهة برمجة التطبيقات (API) استدعاء `napi_finalize` الذي سيتم استدعاؤه عند جمع كائن JavaScript الذي تم إنشاؤه للتو بواسطة جامع البيانات المهملة.

القيمة التي تم إنشاؤها ليست كائنًا، وبالتالي لا تدعم خصائص إضافية. تعتبر نوع قيمة مميز: استدعاء `napi_typeof()` بقيمة خارجية ينتج `napi_external`.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] external_data`: مؤشر إلى مخزن البايت الأساسي لـ `ArrayBuffer`.
- `[in] byte_length`: طول المخزن الأساسي بالبايت.
- `[in] finalize_cb`: استدعاء اختياري ليتم استدعاؤه عند تجميع `ArrayBuffer`. توفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_hint`: تلميح اختياري لتمريره إلى استدعاء الإنهاء أثناء التجميع.
- `[out] result`: `napi_value` يمثل JavaScript `ArrayBuffer`.

إرجاع `napi_ok` إذا نجح API.

**أسقطت بعض أوقات التشغيل بخلاف Node.js دعم المخازن المؤقتة الخارجية**. في أوقات التشغيل بخلاف Node.js، قد تُرجع هذه الطريقة `napi_no_external_buffers_allowed` للإشارة إلى أن المخازن المؤقتة الخارجية غير مدعومة. أحد أوقات التشغيل هذه هو Electron كما هو موضح في هذه المشكلة [electron/issues/35801](https://github.com/electron/electron/issues/35801).

للحفاظ على أوسع توافق مع جميع أوقات التشغيل، يمكنك تحديد `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` في الملحق الخاص بك قبل تضمين رؤوس node-api. سيؤدي القيام بذلك إلى إخفاء الدالتين اللتين تنشئان مخازن مؤقتة خارجية. سيضمن ذلك حدوث خطأ في الترجمة إذا استخدمت إحدى هذه الطرق عن طريق الخطأ.

ترجع واجهة برمجة التطبيقات (API) هذه قيمة Node-API تتوافق مع JavaScript `ArrayBuffer`. يتم تخصيص وإدارة مخزن البايت الأساسي لـ `ArrayBuffer` خارجيًا. يجب على المتصل التأكد من أن مخزن البايت يظل صالحًا حتى يتم استدعاء استدعاء الإنهاء.

تضيف واجهة برمجة التطبيقات (API) استدعاء `napi_finalize` سيتم استدعاؤه عندما يتم جمع الكائن JavaScript الذي تم إنشاؤه للتو بواسطة جامع القمامة.

تم وصف JavaScript `ArrayBuffer` في [القسم 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) من مواصفات لغة ECMAScript.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**تمت إضافتها في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- `[in] length`: حجم المخزن المؤقت للإدخال بالبايت (يجب أن يكون هو نفسه حجم المخزن المؤقت الجديد).
- `[in] data`: مؤشر أولي إلى المخزن المؤقت الأساسي المراد عرضه على JavaScript.
- `[in] finalize_cb`: استدعاء اختياري يتم استدعاؤه عند تجميع `ArrayBuffer`. يوفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_hint`: تلميح اختياري لتمريره إلى استدعاء الإنهاء أثناء التجميع.
- `[out] result`: `napi_value` يمثل `node::Buffer`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

**أسقطت بعض أوقات التشغيل بخلاف Node.js دعم المخازن المؤقتة الخارجية**. في أوقات التشغيل بخلاف Node.js، قد تُرجع هذه الطريقة `napi_no_external_buffers_allowed` للإشارة إلى أن المخازن المؤقتة الخارجية غير مدعومة. أحد أوقات التشغيل هذه هو Electron كما هو موضح في هذه المشكلة [electron/issues/35801](https://github.com/electron/electron/issues/35801).

للحفاظ على أوسع توافق مع جميع أوقات التشغيل، يمكنك تحديد `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` في الملحق الخاص بك قبل تضمين رؤوس node-api. سيؤدي القيام بذلك إلى إخفاء الدالتين اللتين تنشئان مخازن مؤقتة خارجية. سيضمن ذلك حدوث خطأ في الترجمة إذا استخدمت إحدى هذه الطرق عن طريق الخطأ.

تخصص واجهة برمجة التطبيقات (API) كائن `node::Buffer` وتهيئه ببيانات مدعومة بواسطة المخزن المؤقت الذي تم تمريره. على الرغم من أن هذا لا يزال بنية بيانات مدعومة بالكامل، إلا أنه في معظم الحالات سيكون استخدام `TypedArray` كافيًا.

تضيف واجهة برمجة التطبيقات (API) استدعاء `napi_finalize` الذي سيتم استدعاؤه عندما يتم جمع كائن JavaScript الذي تم إنشاؤه للتو بواسطة جامع البيانات المهملة.

بالنسبة إلى Node.js \>=4، تكون `Buffers` عبارة عن `Uint8Array`s.


#### `napi_create_object` {#napi_create_object}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[out] result`: ‏`napi_value` يمثل كائن JavaScript ‏`Object`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تقوم واجهة برمجة التطبيقات هذه بتخصيص كائن JavaScript ‏`Object` افتراضي. وهو ما يعادل تنفيذ `new Object()` في JavaScript.

يتم وصف نوع JavaScript ‏`Object` في [القسم 6.1.7](https://tc39.github.io/ecma262/#sec-object-type) من مواصفات لغة ECMAScript.

#### `napi_create_symbol` {#napi_create_symbol}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] description`: ‏`napi_value` اختياري يشير إلى JavaScript ‏`string` ليتم تعيينه كوصف للرمز.
- `[out] result`: ‏`napi_value` يمثل JavaScript ‏`symbol`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تقوم واجهة برمجة التطبيقات هذه بإنشاء قيمة JavaScript ‏`symbol` من سلسلة C بترميز UTF8.

يتم وصف نوع JavaScript ‏`symbol` في [القسم 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) من مواصفات لغة ECMAScript.

#### `node_api_symbol_for` {#node_api_symbol_for}

**أُضيف في: الإصدار 17.5.0، الإصدار 16.15.0**

**إصدار N-API: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] utf8description`: سلسلة C بترميز UTF-8 تمثل النص المراد استخدامه كوصف للرمز.
- `[in] length`: طول سلسلة الوصف بالبايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بصفر.
- `[out] result`: ‏`napi_value` يمثل JavaScript ‏`symbol`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تبحث واجهة برمجة التطبيقات هذه في السجل العام عن رمز موجود بالوصف المحدد. إذا كان الرمز موجودًا بالفعل، فسيتم إرجاعه، وإلا فسيتم إنشاء رمز جديد في السجل.

يتم وصف نوع JavaScript ‏`symbol` في [القسم 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) من مواصفات لغة ECMAScript.


#### `napi_create_typedarray` {#napi_create_typedarray}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] type`: نوع البيانات العددية للعناصر الموجودة داخل `TypedArray`.
- `[in] length`: عدد العناصر في `TypedArray`.
- `[in] arraybuffer`: `ArrayBuffer` التي تقوم عليها المصفوفة المكتوبة (typed array).
- `[in] byte_offset`: إزاحة البايت داخل `ArrayBuffer` التي يتم من خلالها بدء عرض `TypedArray`.
- `[out] result`: `napi_value` تمثل `TypedArray` في JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء كائن `TypedArray` في JavaScript عبر `ArrayBuffer` موجود. توفر كائنات `TypedArray` عرضًا شبيهًا بالمصفوفة عبر مخزن بيانات أساسي حيث يكون لكل عنصر نفس نوع البيانات العددية الثنائية الأساسية.

يُشترط أن يكون `(length * size_of_element) + byte_offset` \<= حجم المصفوفة التي تم تمريرها بالبايت. إذا لم يكن الأمر كذلك، فسيتم رفع استثناء `RangeError`.

تم وصف كائنات `TypedArray` في JavaScript في [القسم 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) من مواصفات لغة ECMAScript.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**أُضيف في: الإصدار 23.0.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- **<code>[in] arraybuffer</code>**: `ArrayBuffer` التي سيتم إنشاء المخزن المؤقت (buffer) منها.
- **<code>[in] byte_offset</code>**: إزاحة البايت داخل `ArrayBuffer` التي سيتم من خلالها بدء إنشاء المخزن المؤقت (buffer).
- **<code>[in] byte_length</code>**: طول المخزن المؤقت (buffer) بالبايت المراد إنشاؤه من `ArrayBuffer`.
- **<code>[out] result</code>**: `napi_value` تمثل كائن `Buffer` في JavaScript الذي تم إنشاؤه.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء كائن `Buffer` في JavaScript من `ArrayBuffer` موجود. كائن `Buffer` هو فئة خاصة بـ Node.js توفر طريقة للتعامل مع البيانات الثنائية مباشرةً في JavaScript.

يجب أن يكون نطاق البايت `[byte_offset, byte_offset + byte_length)` ضمن حدود `ArrayBuffer`. إذا تجاوز `byte_offset + byte_length` حجم `ArrayBuffer`، فسيتم رفع استثناء `RangeError`.


#### `napi_create_dataview` {#napi_create_dataview}

**تمت الإضافة في: v8.3.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] length`: عدد العناصر في `DataView`.
- `[in] arraybuffer`: `ArrayBuffer` الأساسية لـ `DataView`.
- `[in] byte_offset`: إزاحة البايت داخل `ArrayBuffer` التي سيتم بدء عرض `DataView` منها.
- `[out] result`: `napi_value` يمثل `DataView` JavaScript.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء كائن JavaScript `DataView` على `ArrayBuffer` موجود. توفر كائنات `DataView` عرضًا يشبه المصفوفة على مخزن بيانات أساسي، ولكن يسمح بعناصر ذات أحجام وأنواع مختلفة في `ArrayBuffer`.

من الضروري أن يكون `byte_length + byte_offset` أقل من أو يساوي الحجم بالبايت للمصفوفة التي تم تمريرها. إذا لم يكن الأمر كذلك، فسيتم رفع استثناء `RangeError`.

تم وصف كائنات `DataView` JavaScript في [القسم 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) من مواصفات لغة ECMAScript.

### وظائف للتحويل من أنواع C إلى Node-API {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**تمت الإضافة في: v8.4.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة عدد صحيح ليتم تمثيلها في JavaScript.
- `[out] result`: `napi_value` يمثل `number` JavaScript.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تُستخدم واجهة برمجة التطبيقات (API) هذه للتحويل من نوع C `int32_t` إلى نوع JavaScript `number`.

تم وصف نوع JavaScript `number` في [القسم 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) من مواصفات لغة ECMAScript.


#### `napi_create_uint32` {#napi_create_uint32}

**أضيف في: v8.4.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات فيها.
- `[in] value`: قيمة عدد صحيح غير موقعة ليتم تمثيلها في JavaScript.
- `[out] result`: `napi_value` تمثل `number` في JavaScript.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تستخدم واجهة برمجة التطبيقات هذه للتحويل من النوع `uint32_t` في C إلى النوع `number` في JavaScript.

تم وصف النوع `number` في JavaScript في [القسم 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) من مواصفات لغة ECMAScript.

#### `napi_create_int64` {#napi_create_int64}

**أضيف في: v8.4.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات فيها.
- `[in] value`: قيمة عدد صحيح ليتم تمثيلها في JavaScript.
- `[out] result`: `napi_value` تمثل `number` في JavaScript.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تستخدم واجهة برمجة التطبيقات هذه للتحويل من النوع `int64_t` في C إلى النوع `number` في JavaScript.

تم وصف النوع `number` في JavaScript في [القسم 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) من مواصفات لغة ECMAScript. لاحظ أن النطاق الكامل لـ `int64_t` لا يمكن تمثيله بدقة كاملة في JavaScript. القيم الصحيحة خارج نطاق [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` ستفقد الدقة.

#### `napi_create_double` {#napi_create_double}

**أضيف في: v8.4.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات فيها.
- `[in] value`: قيمة مزدوجة الدقة ليتم تمثيلها في JavaScript.
- `[out] result`: `napi_value` تمثل `number` في JavaScript.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تستخدم واجهة برمجة التطبيقات هذه للتحويل من النوع `double` في C إلى النوع `number` في JavaScript.

تم وصف النوع `number` في JavaScript في [القسم 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) من مواصفات لغة ECMAScript.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**أضيف في: الإصدار 10.7.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة عدد صحيح ليتم تمثيلها في JavaScript.
- `[out] result`: `napi_value` يمثل `BigInt` JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تحول واجهة برمجة التطبيقات (API) هذه النوع `int64_t` C إلى النوع `BigInt` JavaScript.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**أضيف في: الإصدار 10.7.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة عدد صحيح غير موقّع ليتم تمثيلها في JavaScript.
- `[out] result`: `napi_value` يمثل `BigInt` JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تحول واجهة برمجة التطبيقات (API) هذه النوع `uint64_t` C إلى النوع `BigInt` JavaScript.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**أضيف في: الإصدار 10.7.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] sign_bit`: يحدد ما إذا كان `BigInt` الناتج سيكون موجبًا أم سالبًا.
- `[in] word_count`: طول مصفوفة `words`.
- `[in] words`: مصفوفة من كلمات 64 بت ذات ترتيبendian الصغير `uint64_t`.
- `[out] result`: `napi_value` يمثل `BigInt` JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تحول واجهة برمجة التطبيقات (API) هذه مصفوفة من الكلمات غير الموقعة ذات 64 بت إلى قيمة `BigInt` واحدة.

يتم حساب `BigInt` الناتج على النحو التالي: (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] str`: مخزن مؤقت للأحرف يمثل سلسلة مشفرة بـ ISO-8859-1.
- `[in] length`: طول السلسلة بالبايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بقيمة فارغة.
- `[out] result`: `napi_value` يمثل `string` JavaScript.

إرجاع `napi_ok` إذا نجح API.

يقوم هذا API بإنشاء قيمة `string` JavaScript من سلسلة C مشفرة بـ ISO-8859-1. يتم نسخ السلسلة الأصلية.

تم وصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**تمت الإضافة في: v20.4.0, v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] str`: مخزن مؤقت للأحرف يمثل سلسلة مشفرة بـ ISO-8859-1.
- `[in] length`: طول السلسلة بالبايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بقيمة فارغة.
- `[in] finalize_callback`: الدالة التي سيتم استدعاؤها عند جمع السلسلة. سيتم استدعاء الدالة مع المعلمات التالية:
    - `[in] env`: البيئة التي يتم فيها تشغيل الوظيفة الإضافية. قد تكون هذه القيمة فارغة إذا تم جمع السلسلة كجزء من إنهاء العامل أو مثيل Node.js الرئيسي.
    - `[in] data`: هذه هي القيمة `str` كمؤشر `void*`.
    - `[in] finalize_hint`: هذه هي القيمة `finalize_hint` التي تم تقديمها إلى API. يوفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل. هذه المعلمة اختيارية. يعني تمرير قيمة فارغة أن الوظيفة الإضافية لا تحتاج إلى أن يتم إعلامها عند جمع سلسلة JavaScript المقابلة.
  
 
- `[in] finalize_hint`: تلميح اختياري لتمريره إلى استدعاء الإنهاء أثناء التجميع.
- `[out] result`: `napi_value` يمثل `string` JavaScript.
- `[out] copied`: ما إذا تم نسخ السلسلة. إذا كان الأمر كذلك، فسيتم بالفعل استدعاء الدالة النهائية لتدمير `str`.

إرجاع `napi_ok` إذا نجح API.

يقوم هذا API بإنشاء قيمة `string` JavaScript من سلسلة C مشفرة بـ ISO-8859-1. قد لا يتم نسخ السلسلة الأصلية وبالتالي يجب أن توجد طوال دورة حياة قيمة JavaScript بالكامل.

تم وصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API فيها.
- `[in] str`: مخزن مؤقت للأحرف يمثل سلسلة مشفرة بـ UTF16-LE.
- `[in] length`: طول السلسلة بوحدات رمزية ثنائية البايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بصفر.
- `[out] result`: قيمة `napi_value` تمثل `string` JavaScript.

إرجاع `napi_ok` إذا نجح API.

ينشئ هذا API قيمة `string` JavaScript من سلسلة C مشفرة بـ UTF16-LE. يتم نسخ السلسلة الأصلية.

يتم وصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**أُضيف في: v20.4.0، v18.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
```
- `[in] env`: البيئة التي يتم استدعاء API فيها.
- `[in] str`: مخزن مؤقت للأحرف يمثل سلسلة مشفرة بـ UTF16-LE.
- `[in] length`: طول السلسلة بوحدات رمزية ثنائية البايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بصفر.
- `[in] finalize_callback`: الدالة التي سيتم استدعاؤها عند جمع السلسلة. سيتم استدعاء الدالة بالمعلمات التالية:
    - `[in] env`: البيئة التي يتم فيها تشغيل الوظيفة الإضافية. قد تكون هذه القيمة خالية إذا تم جمع السلسلة كجزء من إنهاء العامل أو مثيل Node.js الرئيسي.
    - `[in] data`: هذه هي القيمة `str` كمؤشر `void*`.
    - `[in] finalize_hint`: هذه هي القيمة `finalize_hint` التي تم إعطاؤها إلى API. [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) يوفر مزيدًا من التفاصيل. هذه المعلمة اختيارية. يعني تمرير قيمة خالية أن الوظيفة الإضافية ليست بحاجة إلى أن يتم إشعارها عند جمع سلسلة JavaScript المقابلة.
  
 
- `[in] finalize_hint`: تلميح اختياري لتمريره إلى رد الاتصال النهائي أثناء الجمع.
- `[out] result`: قيمة `napi_value` تمثل `string` JavaScript.
- `[out] copied`: ما إذا تم نسخ السلسلة. إذا كان الأمر كذلك، فسيتم بالفعل استدعاء الدالة النهائية لتدمير `str`.

إرجاع `napi_ok` إذا نجح API.

ينشئ هذا API قيمة `string` JavaScript من سلسلة C مشفرة بـ UTF16-LE. قد لا يتم نسخ السلسلة الأصلية وبالتالي يجب أن توجد طوال دورة حياة قيمة JavaScript.

يتم وصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] str`: مخزن مؤقت للأحرف يمثل سلسلة بترميز UTF8.
- `[in] length`: طول السلسلة بالبايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بقيمة فارغة.
- `[out] result`: `napi_value` يمثل `string` JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء قيمة `string` JavaScript من سلسلة C بترميز UTF8. يتم نسخ السلسلة الأصلية.

يتم وصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.

### وظائف لإنشاء مفاتيح خصائص محسنة {#functions-to-create-optimized-property-keys}

تستخدم العديد من محركات JavaScript بما في ذلك V8 سلاسل داخلية كمفاتيح لتعيين قيم الخصائص والحصول عليها. عادةً ما يستخدمون جدول تجزئة لإنشاء هذه السلاسل والبحث عنها. على الرغم من أنه يضيف بعض التكلفة لكل إنشاء مفتاح، إلا أنه يحسن الأداء بعد ذلك من خلال تمكين مقارنة مؤشرات السلسلة بدلاً من السلاسل بأكملها.

إذا كان من المفترض استخدام سلسلة JavaScript جديدة كمفتاح للخاصية، فسيكون استخدام الوظائف الموجودة في هذا القسم أكثر كفاءة لبعض محركات JavaScript. بخلاف ذلك، استخدم وظائف `napi_create_string_utf8` أو `node_api_create_external_string_utf8` نظرًا لوجود نفقات عامة إضافية في إنشاء/تخزين السلاسل باستخدام طرق إنشاء مفتاح الخاصية.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**تمت الإضافة في: v22.9.0، v20.18.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] str`: مخزن مؤقت للأحرف يمثل سلسلة بترميز ISO-8859-1.
- `[in] length`: طول السلسلة بالبايت، أو `NAPI_AUTO_LENGTH` إذا كانت منتهية بقيمة فارغة.
- `[out] result`: `napi_value` يمثل `string` JavaScript مُحسَّن لاستخدامه كمفتاح خاصية للكائنات.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء قيمة `string` JavaScript مُحسَّنة من سلسلة C بترميز ISO-8859-1 لاستخدامها كمفتاح خاصية للكائنات. يتم نسخ السلسلة الأصلية. على عكس `napi_create_string_latin1`، قد تستفيد الاستدعاءات اللاحقة لهذه الدالة بنفس مؤشر `str` من تسريع في إنشاء `napi_value` المطلوب، اعتمادًا على المحرك.

يتم وصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**أُضيف في: الإصدار 21.7.0، 20.12.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] str`: مخزن الأحرف الذي يمثل سلسلة مشفرة بـ UTF16-LE.
- `[in] length`: طول السلسلة بوحدات التعليمات البرمجية ثنائية البايت، أو `NAPI_AUTO_LENGTH` إذا كانت تنتهي بـ null.
- `[out] result`: قيمة `napi_value` تمثل `string` JavaScript مُحسَّنة لاستخدامها كمفتاح خاصية للكائنات.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تنشئ واجهة برمجة التطبيقات (API) هذه قيمة `string` JavaScript مُحسَّنة من سلسلة C مشفرة بـ UTF16-LE لاستخدامها كمفتاح خاصية للكائنات. يتم نسخ السلسلة الأصلية.

يوصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**أُضيف في: الإصدار 22.9.0، 20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [مستقر: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] str`: مخزن الأحرف الذي يمثل سلسلة مشفرة بـ UTF8.
- `[in] length`: طول السلسلة بوحدات التعليمات البرمجية ثنائية البايت، أو `NAPI_AUTO_LENGTH` إذا كانت تنتهي بـ null.
- `[out] result`: قيمة `napi_value` تمثل `string` JavaScript مُحسَّنة لاستخدامها كمفتاح خاصية للكائنات.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تنشئ واجهة برمجة التطبيقات (API) هذه قيمة `string` JavaScript مُحسَّنة من سلسلة C مشفرة بـ UTF8 لاستخدامها كمفتاح خاصية للكائنات. يتم نسخ السلسلة الأصلية.

يوصف نوع `string` JavaScript في [القسم 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) من مواصفات لغة ECMAScript.


### وظائف للتحويل من Node-API إلى أنواع C {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**أُضيفت في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: `napi_value` تمثل JavaScript `Array` التي يتم الاستعلام عن طولها.
- `[out] result`: `uint32` يمثل طول المصفوفة.

إرجاع `napi_ok` إذا نجح API.

تقوم واجهة برمجة التطبيقات هذه بإرجاع طول المصفوفة.

تم وصف طول `Array` في [القسم 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) من مواصفات لغة ECMAScript.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**أُضيفت في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] arraybuffer`: `napi_value` تمثل `ArrayBuffer` التي يتم الاستعلام عنها.
- `[out] data`: مخزن البيانات الأساسي لـ `ArrayBuffer`. إذا كان byte_length هو `0`، فقد يكون هذا `NULL` أو أي قيمة مؤشر أخرى.
- `[out] byte_length`: طول مخزن البيانات الأساسي بالبايت.

إرجاع `napi_ok` إذا نجح API.

تُستخدم واجهة برمجة التطبيقات هذه لاسترداد مخزن البيانات الأساسي لـ `ArrayBuffer` وطوله.

*تحذير*: توخ الحذر أثناء استخدام واجهة برمجة التطبيقات هذه. تتم إدارة دورة حياة مخزن البيانات الأساسي بواسطة `ArrayBuffer` حتى بعد إرجاعه. إحدى الطرق الآمنة المحتملة لاستخدام واجهة برمجة التطبيقات هذه هي بالاقتران مع [`napi_create_reference`](/ar/nodejs/api/n-api#napi_create_reference)، والتي يمكن استخدامها لضمان التحكم في دورة حياة `ArrayBuffer`. من الآمن أيضًا استخدام مخزن البيانات الذي تم إرجاعه داخل نفس رد الاتصال طالما لا توجد استدعاءات لواجهات برمجة تطبيقات أخرى قد تؤدي إلى تشغيل GC.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: `napi_value` تمثل `node::Buffer` أو `Uint8Array` التي يتم الاستعلام عنها.
- `[out] data`: مخزن البيانات الأساسي لـ `node::Buffer` أو `Uint8Array`. إذا كان الطول `0`، فقد يكون هذا `NULL` أو أي قيمة مؤشر أخرى.
- `[out] length`: طول مخزن البيانات الأساسي بالبايت.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تُرجع هذه الطريقة نفس `data` و `byte_length` الموجودة في [`napi_get_typedarray_info`](/ar/nodejs/api/n-api#napi_get_typedarray_info). وتقبل `napi_get_typedarray_info` أيضًا `node::Buffer` (Uint8Array) كقيمة.

تستخدم واجهة برمجة التطبيقات (API) هذه لاسترداد مخزن البيانات الأساسي لـ `node::Buffer` وطوله.

*تحذير*: استخدم الحذر أثناء استخدام واجهة برمجة التطبيقات (API) هذه نظرًا لأن عمر مخزن البيانات الأساسي غير مضمون إذا تمت إدارته بواسطة الجهاز الظاهري (VM).

#### `napi_get_prototype` {#napi_get_prototype}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] object`: `napi_value` تمثل JavaScript `Object` التي سيتم إرجاع النموذج الأولي لها. هذا يُرجع ما يعادل `Object.getPrototypeOf` (وهو ليس نفس خاصية `prototype` للدالة).
- `[out] result`: `napi_value` تمثل النموذج الأولي للكائن المحدد.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] typedarray`: `napi_value` تمثل `TypedArray` التي سيتم الاستعلام عن خصائصها.
- `[out] type`: نوع البيانات العددية للعناصر داخل `TypedArray`.
- `[out] length`: عدد العناصر في `TypedArray`.
- `[out] data`: مخزن البيانات الأساسي لـ `TypedArray` المعدل بواسطة قيمة `byte_offset` بحيث يشير إلى العنصر الأول في `TypedArray`. إذا كان طول المصفوفة `0`، فقد يكون هذا `NULL` أو أي قيمة مؤشر أخرى.
- `[out] arraybuffer`: `ArrayBuffer` الأساسي لـ `TypedArray`.
- `[out] byte_offset`: إزاحة البايت داخل المصفوفة الأصلية الأساسية التي يوجد عندها العنصر الأول من المصفوفات. تم بالفعل تعديل قيمة معلمة البيانات بحيث تشير البيانات إلى العنصر الأول في المصفوفة. لذلك، سيكون البايت الأول من المصفوفة الأصلية في `data - byte_offset`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تُرجع واجهة برمجة التطبيقات (API) هذه خصائص مختلفة لمصفوفة ذات نوع محدد.

قد تكون أي من معلمات الإخراج `NULL` إذا كانت هذه الخاصية غير ضرورية.

*تحذير*: استخدم الحذر أثناء استخدام واجهة برمجة التطبيقات (API) هذه نظرًا لأن مخزن البيانات الأساسي تتم إدارته بواسطة الجهاز الظاهري (VM).


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**تمت إضافته في: v8.3.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] dataview`: `napi_value` تمثل `DataView` التي سيتم الاستعلام عن خصائصها.
- `[out] byte_length`: عدد البايتات في `DataView`.
- `[out] data`: مخزن البيانات الأساسي لـ `DataView`. إذا كان byte_length يساوي `0`، فقد يكون هذا `NULL` أو أي قيمة مؤشر أخرى.
- `[out] arraybuffer`: `ArrayBuffer` الأساسي لـ `DataView`.
- `[out] byte_offset`: إزاحة البايت داخل مخزن البيانات التي سيتم منها بدء عرض `DataView`.

إرجاع `napi_ok` إذا نجح API.

يمكن أن تكون أي من المعلمات الخارجية `NULL` إذا لم تكن هذه الخاصية مطلوبة.

يقوم هذا API بإرجاع خصائص مختلفة لـ `DataView`.

#### `napi_get_date_value` {#napi_get_date_value}

**تمت إضافته في: v11.11.0, v10.17.0**

**إصدار N-API: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: `napi_value` تمثل `Date` JavaScript.
- `[out] result`: قيمة الوقت كـ `double` ممثلة بالمللي ثانية منذ منتصف الليل في بداية 01 يناير 1970 بالتوقيت العالمي المنسق.

لا يلاحظ هذا API الثواني الكبيسة؛ يتم تجاهلها، حيث يتوافق ECMAScript مع مواصفات وقت POSIX.

إرجاع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` غير تاريخي، فإنه يُرجع `napi_date_expected`.

يقوم هذا API بإرجاع C double primitive لقيمة الوقت لـ JavaScript `Date` المحدد.

#### `napi_get_value_bool` {#napi_get_value_bool}

**تمت إضافته في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: `napi_value` تمثل `Boolean` JavaScript.
- `[out] result`: C boolean primitive المكافئ لـ `Boolean` JavaScript المحدد.

إرجاع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` غير منطقي، فإنه يُرجع `napi_boolean_expected`.

يقوم هذا API بإرجاع C boolean primitive المكافئ لـ `Boolean` JavaScript المحدد.


#### `napi_get_value_double` {#napi_get_value_double}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: ‏`napi_value` تمثل ‏JavaScript ‏`number`.
- `[out] result`: مكافئ C من النوع الأولي double لرقم JavaScript المحدد.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API). إذا تم تمرير ‏`napi_value` غير رقمي، فسيتم إرجاع `napi_number_expected`.

تُرجع واجهة برمجة التطبيقات (API) هذه مكافئ C من النوع الأولي double لرقم JavaScript المحدد.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**تمت الإضافة في: v10.7.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: ‏`napi_value` تمثل ‏JavaScript ‏`BigInt`.
- `[out] result`: مكافئ C من النوع الأولي `int64_t` لـ JavaScript ‏`BigInt` المحدد.
- `[out] lossless`: يشير إلى ما إذا كان قد تم تحويل قيمة `BigInt` دون فقدان.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API). إذا تم تمرير قيمة ليست `BigInt`، فسيتم إرجاع `napi_bigint_expected`.

تُرجع واجهة برمجة التطبيقات (API) هذه مكافئ C من النوع الأولي `int64_t` لـ JavaScript ‏`BigInt` المحدد. إذا لزم الأمر، ستقوم باقتطاع القيمة، وتعيين `lossless` إلى `false`.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**تمت الإضافة في: v10.7.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: ‏`napi_value` تمثل ‏JavaScript ‏`BigInt`.
- `[out] result`: مكافئ C من النوع الأولي `uint64_t` لـ JavaScript ‏`BigInt` المحدد.
- `[out] lossless`: يشير إلى ما إذا كان قد تم تحويل قيمة `BigInt` دون فقدان.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API). إذا تم تمرير قيمة ليست `BigInt`، فسيتم إرجاع `napi_bigint_expected`.

تُرجع واجهة برمجة التطبيقات (API) هذه مكافئ C من النوع الأولي `uint64_t` لـ JavaScript ‏`BigInt` المحدد. إذا لزم الأمر، ستقوم باقتطاع القيمة، وتعيين `lossless` إلى `false`.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**تمت الإضافة في: v10.7.0**

**إصدار N-API: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: البيئة التي يتم استدعاء API تحتها.
- `[in] value`: `napi_value` تمثل JavaScript `BigInt`.
- `[out] sign_bit`: عدد صحيح يمثل ما إذا كان JavaScript `BigInt` موجبًا أم سالبًا.
- `[in/out] word_count`: يجب تهيئته لطول مصفوفة `words`. عند الإرجاع ، سيتم تعيينه على العدد الفعلي للكلمات التي ستكون مطلوبة لتخزين هذا `BigInt`.
- `[out] words`: مؤشر إلى مصفوفة كلمات 64 بت مخصصة مسبقًا.

إرجاع `napi_ok` إذا نجح API.

يقوم هذا API بتحويل قيمة `BigInt` واحدة إلى بت إشارة ، ومصفوفة ذات نهاية صغيرة 64 بت ، وعدد العناصر في المصفوفة. يمكن تعيين كل من `sign_bit` و `words` على `NULL` ، للحصول على `word_count` فقط.

#### `napi_get_value_external` {#napi_get_value_external}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: البيئة التي يتم استدعاء API تحتها.
- `[in] value`: `napi_value` يمثل قيمة JavaScript الخارجية.
- `[out] result`: مؤشر إلى البيانات المغلفة بواسطة قيمة JavaScript الخارجية.

إرجاع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` غير خارجي ، فإنه يرجع `napi_invalid_arg`.

يسترجع هذا API مؤشر البيانات الخارجية الذي تم تمريره مسبقًا إلى `napi_create_external()`.

#### `napi_get_value_int32` {#napi_get_value_int32}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء API تحتها.
- `[in] value`: `napi_value` يمثل JavaScript `number`.
- `[out] result`: C `int32` البدائي المكافئ لـ JavaScript `number` المحدد.

إرجاع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` غير رقمي ، فسيتم إرجاع `napi_number_expected`.

يقوم هذا API بإرجاع C `int32` البدائي المكافئ لـ JavaScript `number` المحدد.

إذا تجاوز الرقم نطاق العدد الصحيح 32 بت ، فسيتم اقتطاع النتيجة لتكون مكافئة لأقل 32 بت. يمكن أن يؤدي هذا إلى أن يصبح الرقم الموجب الكبير رقمًا سالبًا إذا كانت القيمة \> 2 - 1.

تقوم قيم الأرقام غير المحدودة (`NaN` أو `+Infinity` أو `-Infinity`) بتعيين النتيجة إلى الصفر.


#### `napi_get_value_int64` {#napi_get_value_int64}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: `napi_value` تمثل JavaScript `number`.
- `[out] result`: C `int64` البدائي المكافئ لـ JavaScript `number` المعطاة.

تُرجع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` غير رقمي، فإنها تُرجع `napi_number_expected`.

يقوم هذا API بإرجاع C `int64` البدائي المكافئ لـ JavaScript `number` المعطاة.

ستفقد قيم `number` خارج نطاق [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` الدقة.

تقوم قيم الأرقام غير المنتهية (`NaN` أو `+Infinity` أو `-Infinity`) بتعيين النتيجة إلى الصفر.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: `napi_value` تمثل سلسلة JavaScript.
- `[in] buf`: المخزن المؤقت لكتابة السلسلة المشفرة بـ ISO-8859-1 فيه. إذا تم تمرير `NULL`، فسيتم إرجاع طول السلسلة بالبايتات باستثناء فاصلة النهاية الصفرية في `result`.
- `[in] bufsize`: حجم المخزن المؤقت الوجهة. عندما تكون هذه القيمة غير كافية، يتم اقتطاع السلسلة المرجعة وإنهاؤها بصفر.
- `[out] result`: عدد البايتات التي تم نسخها إلى المخزن المؤقت، باستثناء فاصلة النهاية الصفرية.

تُرجع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` غير `string`، فإنها تُرجع `napi_string_expected`.

يقوم هذا API بإرجاع السلسلة المشفرة بـ ISO-8859-1 المطابقة للقيمة التي تم تمريرها.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: `napi_value` يمثل سلسلة JavaScript.
- `[in] buf`: المخزن المؤقت لكتابة السلسلة المشفرة بـ UTF8 فيه. إذا تم تمرير `NULL`، يتم إرجاع طول السلسلة بالبايتات باستثناء فاصلة النهاية الخالية في `result`.
- `[in] bufsize`: حجم المخزن المؤقت الوجهة. عندما تكون هذه القيمة غير كافية، يتم اقتطاع السلسلة المرجعة وإنهاؤها بقيمة فارغة.
- `[out] result`: عدد البايتات المنسوخة في المخزن المؤقت، باستثناء فاصلة النهاية الخالية.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API). إذا تم تمرير `napi_value` غير `string`، فإنها ترجع `napi_string_expected`.

ترجع واجهة برمجة التطبيقات (API) هذه السلسلة المشفرة بـ UTF8 المقابلة للقيمة التي تم تمريرها.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: `napi_value` يمثل سلسلة JavaScript.
- `[in] buf`: المخزن المؤقت لكتابة السلسلة المشفرة بـ UTF16-LE فيه. إذا تم تمرير `NULL`، يتم إرجاع طول السلسلة بوحدات التعليمات البرمجية المكونة من بايتين باستثناء فاصلة النهاية الخالية.
- `[in] bufsize`: حجم المخزن المؤقت الوجهة. عندما تكون هذه القيمة غير كافية، يتم اقتطاع السلسلة المرجعة وإنهاؤها بقيمة فارغة.
- `[out] result`: عدد وحدات التعليمات البرمجية المكونة من بايتين المنسوخة في المخزن المؤقت، باستثناء فاصلة النهاية الخالية.

ترجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API). إذا تم تمرير `napi_value` غير `string`، فإنها ترجع `napi_string_expected`.

ترجع واجهة برمجة التطبيقات (API) هذه السلسلة المشفرة بـ UTF16 المقابلة للقيمة التي تم تمريرها.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: `napi_value` تمثل JavaScript `number`.
- `[out] result`: معادل C بدائي لـ `napi_value` المعطاة كـ `uint32_t`.

تُرجع `napi_ok` إذا نجح API. إذا تم تمرير `napi_value` ليست رقمًا، فإنها تُرجع `napi_number_expected`.

يُرجع هذا API المعادل C البدائي لـ `napi_value` المعطاة كـ `uint32_t`.

### دوال للحصول على النسخ العمومية {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: قيمة boolean المراد استرجاعها.
- `[out] result`: `napi_value` تمثل JavaScript `Boolean` المفردة المراد استرجاعها.

تُرجع `napi_ok` إذا نجح API.

يُستخدم هذا API لإرجاع كائن JavaScript المفردة الذي يُستخدم لتمثيل قيمة boolean المعطاة.

#### `napi_get_global` {#napi_get_global}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[out] result`: `napi_value` تمثل كائن JavaScript `global`.

تُرجع `napi_ok` إذا نجح API.

يُرجع هذا API الكائن `global`.

#### `napi_get_null` {#napi_get_null}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[out] result`: `napi_value` تمثل كائن JavaScript `null`.

تُرجع `napi_ok` إذا نجح API.

يُرجع هذا API الكائن `null`.

#### `napi_get_undefined` {#napi_get_undefined}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[out] result`: `napi_value` تمثل قيمة JavaScript Undefined.

تُرجع `napi_ok` إذا نجح API.

يُرجع هذا API الكائن Undefined.


## التعامل مع قيم JavaScript والعمليات المجردة {#working-with-javascript-values-and-abstract-operations}

تعرض Node-API مجموعة من واجهات برمجة التطبيقات (APIs) لإجراء بعض العمليات المجردة على قيم JavaScript. تم توثيق بعض هذه العمليات تحت [القسم 7](https://tc39.github.io/ecma262/#sec-abstract-operations) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/).

تدعم واجهات برمجة التطبيقات (APIs) هذه القيام بأحد الإجراءات التالية:

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة JavaScript المراد تحويلها.
- `[out] result`: `napi_value` تمثل `Boolean` JavaScript المحول.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تنفذ واجهة برمجة التطبيقات (API) هذه العملية المجردة `ToBoolean()` كما هو محدد في [القسم 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean) من مواصفات لغة ECMAScript.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة JavaScript المراد تحويلها.
- `[out] result`: `napi_value` تمثل `number` JavaScript المحول.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تنفذ واجهة برمجة التطبيقات (API) هذه العملية المجردة `ToNumber()` كما هو محدد في [القسم 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber) من مواصفات لغة ECMAScript. قد يقوم هذا الدالة بتشغيل كود JS إذا كانت القيمة التي تم تمريرها عبارة عن كائن.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة JavaScript المراد تحويلها.
- `[out] result`: `napi_value` تمثل `Object` JavaScript المحول.

تُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تنفذ واجهة برمجة التطبيقات (API) هذه العملية المجردة `ToObject()` كما هو محدد في [القسم 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) من مواصفات لغة ECMAScript.


### ‏`napi_coerce_to_string` {#napi_coerce_to_string}

**تمت إضافته في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة JavaScript المراد إجبارها.
- `[out] result`: `napi_value` تمثل JavaScript `string` المجبرة.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تنفذ واجهة برمجة التطبيقات (API) هذه العملية المجردة `ToString()` كما هو محدد في [القسم 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) من مواصفات لغة ECMAScript. قد تقوم هذه الدالة بتشغيل كود JS إذا كانت القيمة التي تم تمريرها عبارة عن كائن.

### ‏`napi_typeof` {#napi_typeof}

**تمت إضافته في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] value`: قيمة JavaScript التي سيتم الاستعلام عن نوعها.
- `[out] result`: نوع قيمة JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

- `napi_invalid_arg` إذا كان نوع `value` ليس نوع ECMAScript معروفًا و `value` ليس قيمة خارجية.

تمثل واجهة برمجة التطبيقات (API) هذه سلوكًا مشابهًا لاستدعاء عامل التشغيل `typeof` على الكائن كما هو محدد في [القسم 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) من مواصفات لغة ECMAScript. ومع ذلك، هناك بعض الاختلافات:

إذا كانت `value` تحتوي على نوع غير صالح، فسيتم إرجاع خطأ.

### ‏`napi_instanceof` {#napi_instanceof}

**تمت إضافته في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] object`: قيمة JavaScript المراد التحقق منها.
- `[in] constructor`: كائن دالة JavaScript لدالة الإنشاء المراد التحقق منها.
- `[out] result`: قيمة منطقية يتم تعيينها على صواب إذا كانت `object instanceof constructor` صحيحة.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تمثل واجهة برمجة التطبيقات (API) هذه استدعاء عامل التشغيل `instanceof` على الكائن كما هو محدد في [القسم 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) من مواصفات لغة ECMAScript.


### `napi_is_array` {#napi_is_array}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[in] value`: قيمة JavaScript المراد التحقق منها.
- `[out] result`: ما إذا كان الكائن المعطى عبارة عن مصفوفة.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تمثل واجهة برمجة التطبيقات (API) هذه استدعاء عملية `IsArray` على الكائن كما هو محدد في [القسم 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) من مواصفات لغة ECMAScript.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[in] value`: قيمة JavaScript المراد التحقق منها.
- `[out] result`: ما إذا كان الكائن المعطى عبارة عن `ArrayBuffer`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تتحقق واجهة برمجة التطبيقات (API) هذه مما إذا كان الكائن `Object` الذي تم تمريره هو مخزن مؤقت للمصفوفة (array buffer).

### `napi_is_buffer` {#napi_is_buffer}

**أُضيف في:** v8.0.0

**إصدار N-API:** 1

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[in] value`: قيمة JavaScript المراد التحقق منها.
- `[out] result`: ما إذا كانت `napi_value` المعطاة تمثل كائن `node::Buffer` أو `Uint8Array`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تتحقق واجهة برمجة التطبيقات (API) هذه مما إذا كان الكائن `Object` الذي تم تمريره عبارة عن مخزن مؤقت أو Uint8Array. يجب تفضيل [`napi_is_typedarray`](/ar/nodejs/api/n-api#napi_is_typedarray) إذا كان المتصل بحاجة إلى التحقق مما إذا كانت القيمة عبارة عن Uint8Array.

### `napi_is_date` {#napi_is_date}

**أُضيف في:** v11.11.0, v10.17.0

**إصدار N-API:** 5

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[in] value`: قيمة JavaScript المراد التحقق منها.
- `[out] result`: ما إذا كانت `napi_value` المعطاة تمثل كائن `Date` JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تتحقق واجهة برمجة التطبيقات (API) هذه مما إذا كان الكائن `Object` الذي تم تمريره هو تاريخ.


### `napi_is_error` {#napi_is_error_1}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: قيمة JavaScript المراد فحصها.
- `[out] result`: ما إذا كانت `napi_value` المعطاة تمثل كائن `Error`.

يُرجع `napi_ok` إذا نجح API.

يتحقق API هذا مما إذا كان `Object` الذي تم تمريره هو `Error`.

### `napi_is_typedarray` {#napi_is_typedarray}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: قيمة JavaScript المراد فحصها.
- `[out] result`: ما إذا كانت `napi_value` المعطاة تمثل `TypedArray`.

يُرجع `napi_ok` إذا نجح API.

يتحقق API هذا مما إذا كان `Object` الذي تم تمريره هو مصفوفة مكتوبة.

### `napi_is_dataview` {#napi_is_dataview}

**أُضيف في: v8.3.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] value`: قيمة JavaScript المراد فحصها.
- `[out] result`: ما إذا كانت `napi_value` المعطاة تمثل `DataView`.

يُرجع `napi_ok` إذا نجح API.

يتحقق API هذا مما إذا كان `Object` الذي تم تمريره هو `DataView`.

### `napi_strict_equals` {#napi_strict_equals}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] lhs`: قيمة JavaScript المراد فحصها.
- `[in] rhs`: قيمة JavaScript المراد التحقق منها.
- `[out] result`: ما إذا كان كائنا `napi_value` متساويين.

يُرجع `napi_ok` إذا نجح API.

يمثل API هذا استدعاء خوارزمية المساواة الصارمة كما هو محدد في [القسم 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) من مواصفات لغة ECMAScript.


### ‏`napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**تمت إضافته في: الإصدار v13.0.0، v12.16.0، v10.22.0**

**إصدار N-API: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- ‏`[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- ‏`[in] arraybuffer`: JavaScript ‏`ArrayBuffer` المراد فصلها.

إرجاع ‏`napi_ok` إذا نجحت واجهة برمجة التطبيقات (API). إذا تم تمرير ‏`ArrayBuffer` غير قابلة للفصل، فإنه يُرجع ‏`napi_detachable_arraybuffer_expected`.

بشكل عام، تكون ‏`ArrayBuffer` غير قابلة للفصل إذا تم فصلها من قبل. قد يفرض المحرك شروطًا إضافية على ما إذا كانت ‏`ArrayBuffer` قابلة للفصل. على سبيل المثال، يتطلب V8 أن تكون ‏`ArrayBuffer` خارجية، أي تم إنشاؤها باستخدام ‏[`napi_create_external_arraybuffer`](/ar/nodejs/api/n-api#napi_create_external_arraybuffer).

تمثل واجهة برمجة التطبيقات (API) هذه استدعاء عملية فصل ‏`ArrayBuffer` كما هو محدد في [القسم 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) من مواصفات لغة ECMAScript.

### ‏`napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**تمت إضافته في: الإصدار v13.3.0، v12.16.0، v10.22.0**

**إصدار N-API: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- ‏`[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- ‏`[in] arraybuffer`: JavaScript ‏`ArrayBuffer` المراد فحصها.
- ‏`[out] result`: ما إذا كانت ‏`arraybuffer` مفصولة.

إرجاع ‏`napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تعتبر ‏`ArrayBuffer` مفصولة إذا كانت بياناتها الداخلية ‏`null`.

تمثل واجهة برمجة التطبيقات (API) هذه استدعاء عملية ‏`IsDetachedBuffer` الخاصة بـ ‏`ArrayBuffer` كما هو محدد في [القسم 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) من مواصفات لغة ECMAScript.

## ‏العمل مع خصائص JavaScript {#working-with-javascript-properties}

تعرض Node-API مجموعة من واجهات برمجة التطبيقات (APIs) للحصول على الخصائص وتعيينها في كائنات JavaScript. تم توثيق بعض هذه الأنواع ضمن [القسم 7](https://tc39.github.io/ecma262/#sec-abstract-operations) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/).

يتم تمثيل الخصائص في JavaScript على أنها مجموعة من مفتاح وقيمة. بشكل أساسي، يمكن تمثيل جميع مفاتيح الخصائص في Node-API في أحد الأشكال التالية:

- ‏باسم: سلسلة UTF8 بسيطة ومشفرة
- ‏مفهرسة بالأعداد الصحيحة: قيمة فهرس ممثلة بـ ‏`uint32_t`
- ‏قيمة JavaScript: يتم تمثيلها في Node-API بواسطة ‏`napi_value`. يمكن أن تكون هذه ‏`napi_value` تمثل ‏`string` أو ‏`number` أو ‏`symbol`.

يتم تمثيل قيم Node-API بواسطة النوع ‏`napi_value`. أي استدعاء Node-API يتطلب قيمة JavaScript يأخذ ‏`napi_value`. ومع ذلك، تقع على عاتق المتصل مسؤولية التأكد من أن ‏`napi_value` المعنية هي من نوع JavaScript الذي تتوقعه واجهة برمجة التطبيقات (API).

توفر واجهات برمجة التطبيقات (APIs) الموثقة في هذا القسم واجهة بسيطة للحصول على الخصائص وتعيينها في كائنات JavaScript عشوائية ممثلة بـ ‏`napi_value`.

على سبيل المثال، ضع في اعتبارك مقتطف كود JavaScript التالي:

```js [ESM]
const obj = {};
obj.myProp = 123;
```
يمكن القيام بالمكافئ باستخدام قيم Node-API مع مقتطف الكود التالي:

```C [C]
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```
يمكن تعيين الخصائص المفهرسة بطريقة مماثلة. ضع في اعتبارك مقتطف كود JavaScript التالي:

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
يمكن القيام بالمكافئ باستخدام قيم Node-API مع مقتطف الكود التالي:

```C [C]
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```
يمكن استرداد الخصائص باستخدام واجهات برمجة التطبيقات (APIs) الموضحة في هذا القسم. ضع في اعتبارك مقتطف كود JavaScript التالي:

```js [ESM]
const arr = [];
const value = arr[123];
```
فيما يلي المكافئ التقريبي لنظيره Node-API:

```C [C]
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
```
أخيرًا، يمكن أيضًا تحديد خصائص متعددة في كائن واحد لأسباب تتعلق بالأداء. ضع في اعتبارك JavaScript التالي:

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
فيما يلي المكافئ التقريبي لنظيره Node-API:

```C [C]
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
```

### هياكل البيانات {#structures}

#### `napi_property_attributes` {#napi_property_attributes}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v14.12.0 | تمت إضافة `napi_default_method` و `napi_default_property`. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // يستخدم مع napi_define_class للتمييز بين الخصائص الثابتة
  // من خصائص المثيل. يتم تجاهله بواسطة napi_define_properties.
  napi_static = 1 << 10,

  // الافتراضي لطرق الفئة.
  napi_default_method = napi_writable | napi_configurable,

  // الافتراضي لخصائص الكائن، كما في JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` هي علامات تُستخدم للتحكم في سلوك الخصائص المعينة على كائن JavaScript. باستثناء `napi_static` فإنها تتوافق مع السمات المذكورة في [القسم 6.1.7.1](https://tc39.github.io/ecma262/#table-2) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/). يمكن أن تكون علامة واحدة أو أكثر من العلامات التالية:

- `napi_default`: لم يتم تعيين أي سمات صريحة على الخاصية. بشكل افتراضي، تكون الخاصية للقراءة فقط، وغير قابلة للتعداد وغير قابلة للتهيئة.
- `napi_writable`: الخاصية قابلة للكتابة.
- `napi_enumerable`: الخاصية قابلة للتعداد.
- `napi_configurable`: الخاصية قابلة للتهيئة كما هو محدد في [القسم 6.1.7.1](https://tc39.github.io/ecma262/#table-2) من [مواصفات لغة ECMAScript](https://tc39.github.io/ecma262/).
- `napi_static`: سيتم تعريف الخاصية كخاصية ثابتة في فئة بدلاً من خاصية مثيل، وهو الإعداد الافتراضي. يتم استخدامه فقط بواسطة [`napi_define_class`](/ar/nodejs/api/n-api#napi_define_class). يتم تجاهله بواسطة `napi_define_properties`.
- `napi_default_method`: مثل الطريقة في فئة JS، تكون الخاصية قابلة للتهيئة وقابلة للكتابة، ولكنها غير قابلة للتعداد.
- `napi_default_jsproperty`: مثل خاصية تم تعيينها عبر التعيين في JavaScript، تكون الخاصية قابلة للكتابة وقابلة للتعداد وقابلة للتهيئة.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // One of utf8name or name should be NULL.
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
```
- `utf8name`: سلسلة اختيارية تصف المفتاح الخاصية، مرمزة بـ UTF8. يجب توفير إما `utf8name` أو `name` للخاصية.
- `name`: `napi_value` اختيارية تشير إلى سلسلة JavaScript أو رمز ليتم استخدامه كمفتاح للخاصية. يجب توفير إما `utf8name` أو `name` للخاصية.
- `value`: القيمة التي يتم استرجاعها عن طريق الوصول إلى الخاصية إذا كانت الخاصية خاصية بيانات. إذا تم تمرير هذا، اضبط `getter` و `setter` و `method` و `data` على `NULL` (لأن هذه الأعضاء لن يتم استخدامها).
- `getter`: دالة يتم استدعاؤها عند إجراء الوصول إلى الخاصية. إذا تم تمرير هذا، اضبط `value` و `method` على `NULL` (لأن هذه الأعضاء لن يتم استخدامها). يتم استدعاء الدالة المحددة ضمنيًا بواسطة وقت التشغيل عندما يتم الوصول إلى الخاصية من كود JavaScript (أو إذا تم إجراء الحصول على الخاصية باستخدام استدعاء Node-API). [`napi_callback`](/ar/nodejs/api/n-api#napi_callback) يوفر مزيدًا من التفاصيل.
- `setter`: دالة يتم استدعاؤها عند إجراء تعيين للوصول إلى الخاصية. إذا تم تمرير هذا، اضبط `value` و `method` على `NULL` (لأن هذه الأعضاء لن يتم استخدامها). يتم استدعاء الدالة المحددة ضمنيًا بواسطة وقت التشغيل عندما يتم تعيين الخاصية من كود JavaScript (أو إذا تم إجراء تعيين على الخاصية باستخدام استدعاء Node-API). [`napi_callback`](/ar/nodejs/api/n-api#napi_callback) يوفر مزيدًا من التفاصيل.
- `method`: قم بتعيين هذا لجعل الخاصية `value` الخاصة بكائن واصف الخاصية دالة JavaScript تمثلها `method`. إذا تم تمرير هذا، اضبط `value` و `getter` و `setter` على `NULL` (لأن هذه الأعضاء لن يتم استخدامها). [`napi_callback`](/ar/nodejs/api/n-api#napi_callback) يوفر مزيدًا من التفاصيل.
- `attributes`: السمات المرتبطة بالخاصية المعينة. انظر [`napi_property_attributes`](/ar/nodejs/api/n-api#napi_property_attributes).
- `data`: بيانات الاستدعاء التي يتم تمريرها إلى `method` و `getter` و `setter` إذا تم استدعاء هذه الدالة.


### الدوال {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**أضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API تحتها.
- `[in] object`: الكائن الذي سيتم استرداد الخصائص منه.
- `[out] result`: `napi_value` يمثل مصفوفة من قيم JavaScript التي تمثل أسماء خصائص الكائن. يمكن استخدام واجهة برمجة التطبيقات للتكرار على `result` باستخدام [`napi_get_array_length`](/ar/nodejs/api/n-api#napi_get_array_length) و [`napi_get_element`](/ar/nodejs/api/n-api#napi_get_element).

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تعيد واجهة برمجة التطبيقات هذه أسماء الخصائص القابلة للتعداد لـ `object` كمصفوفة من السلاسل. لن يتم تضمين خصائص `object` التي يكون مفتاحها رمزًا.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**أضيف في: الإصدار 13.7.0, v12.17.0, v10.20.0**

**إصدار N-API: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API تحتها.
- `[in] object`: الكائن الذي سيتم استرداد الخصائص منه.
- `[in] key_mode`: ما إذا كان سيتم استرداد خصائص النموذج الأولي أيضًا.
- `[in] key_filter`: الخصائص التي سيتم استردادها (قابلة للتعداد/قابلة للقراءة/قابلة للكتابة).
- `[in] key_conversion`: ما إذا كان سيتم تحويل مفاتيح الخصائص المرقمة إلى سلاسل.
- `[out] result`: `napi_value` يمثل مصفوفة من قيم JavaScript التي تمثل أسماء خصائص الكائن. يمكن استخدام [`napi_get_array_length`](/ar/nodejs/api/n-api#napi_get_array_length) و [`napi_get_element`](/ar/nodejs/api/n-api#napi_get_element) للتكرار على `result`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات.

تعيد واجهة برمجة التطبيقات هذه مصفوفة تحتوي على أسماء الخصائص المتاحة لهذا الكائن.


#### `napi_set_property` {#napi_set_property}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API تحتها.
- `[in] object`: الكائن المراد تعيين الخاصية عليه.
- `[in] key`: اسم الخاصية المراد تعيينها.
- `[in] value`: قيمة الخاصية.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تعيين واجهة برمجة التطبيقات (API) هذه خاصية على `Object` التي تم تمريرها.

#### `napi_get_property` {#napi_get_property}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API تحتها.
- `[in] object`: الكائن المراد استرداد الخاصية منه.
- `[in] key`: اسم الخاصية المراد استردادها.
- `[out] result`: قيمة الخاصية.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تحصل واجهة برمجة التطبيقات (API) هذه على الخاصية المطلوبة من `Object` التي تم تمريرها.

#### `napi_has_property` {#napi_has_property}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API تحتها.
- `[in] object`: الكائن المراد الاستعلام عنه.
- `[in] key`: اسم الخاصية المراد التحقق من وجودها.
- `[out] result`: ما إذا كانت الخاصية موجودة على الكائن أم لا.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تتحقق واجهة برمجة التطبيقات (API) هذه مما إذا كان `Object` الذي تم تمريره يحتوي على الخاصية المسماة.

#### `napi_delete_property` {#napi_delete_property}

**أضيف في: v8.2.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API تحتها.
- `[in] object`: الكائن المراد الاستعلام عنه.
- `[in] key`: اسم الخاصية المراد حذفها.
- `[out] result`: ما إذا نجح حذف الخاصية أم لا. يمكن تجاهل `result` اختياريًا عن طريق تمرير `NULL`.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تحاول واجهة برمجة التطبيقات (API) هذه حذف الخاصية الخاصة `key` من `object`.


#### `napi_has_own_property` {#napi_has_own_property}

**أُضيف في: الإصدار 8.2.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API ضمنها.
- `[in] object`: الكائن المراد الاستعلام عنه.
- `[in] key`: اسم الخاصية الخاصة المراد التحقق من وجودها.
- `[out] result`: ما إذا كانت الخاصية الخاصة موجودة في الكائن أم لا.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تتحقق واجهة برمجة التطبيقات (API) هذه مما إذا كان `Object` الذي تم تمريره يحتوي على الخاصية الخاصة المسماة. يجب أن يكون `key` إما `string` أو `symbol`، وإلا سيتم طرح خطأ. لن تقوم Node-API بإجراء أي تحويل بين أنواع البيانات.

#### `napi_set_named_property` {#napi_set_named_property}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API ضمنها.
- `[in] object`: الكائن المراد تعيين الخاصية عليه.
- `[in] utf8Name`: اسم الخاصية المراد تعيينها.
- `[in] value`: قيمة الخاصية.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

هذه الطريقة مكافئة لاستدعاء [`napi_set_property`](/ar/nodejs/api/n-api#napi_set_property) مع `napi_value` تم إنشاؤه من السلسلة التي تم تمريرها كـ `utf8Name`.

#### `napi_get_named_property` {#napi_get_named_property}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API ضمنها.
- `[in] object`: الكائن المراد استرداد الخاصية منه.
- `[in] utf8Name`: اسم الخاصية المراد الحصول عليها.
- `[out] result`: قيمة الخاصية.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

هذه الطريقة مكافئة لاستدعاء [`napi_get_property`](/ar/nodejs/api/n-api#napi_get_property) مع `napi_value` تم إنشاؤه من السلسلة التي تم تمريرها كـ `utf8Name`.


#### `napi_has_named_property` {#napi_has_named_property}

**تمت الإضافة في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء Node-API تحتها.
- `[in] object`: الكائن المراد الاستعلام عنه.
- `[in] utf8Name`: اسم الخاصية التي يتم التحقق من وجودها.
- `[out] result`: ما إذا كانت الخاصية موجودة في الكائن أم لا.

يُرجع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

هذه الطريقة تعادل استدعاء [`napi_has_property`](/ar/nodejs/api/n-api#napi_has_property) مع `napi_value` تم إنشاؤه من السلسلة التي تم تمريرها كـ `utf8Name`.

#### `napi_set_element` {#napi_set_element}

**تمت الإضافة في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: البيئة التي يتم استدعاء Node-API تحتها.
- `[in] object`: الكائن الذي سيتم تعيين الخصائص منه.
- `[in] index`: فهرس الخاصية المراد تعيينها.
- `[in] value`: قيمة الخاصية.

يُرجع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات هذه بتعيين عنصر على `Object` الذي تم تمريره.

#### `napi_get_element` {#napi_get_element}

**تمت الإضافة في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء Node-API تحتها.
- `[in] object`: الكائن الذي سيتم استرداد الخاصية منه.
- `[in] index`: فهرس الخاصية المراد الحصول عليها.
- `[out] result`: قيمة الخاصية.

يُرجع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تحصل واجهة برمجة التطبيقات هذه على العنصر في الفهرس المطلوب.

#### `napi_has_element` {#napi_has_element}

**تمت الإضافة في: الإصدار v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء Node-API تحتها.
- `[in] object`: الكائن المراد الاستعلام عنه.
- `[in] index`: فهرس الخاصية التي يتم التحقق من وجودها.
- `[out] result`: ما إذا كانت الخاصية موجودة في الكائن أم لا.

يُرجع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تُرجع واجهة برمجة التطبيقات هذه ما إذا كان `Object` الذي تم تمريره يحتوي على عنصر في الفهرس المطلوب.


#### `napi_delete_element` {#napi_delete_element}

**تمت الإضافة في: v8.2.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: البيئة التي يتم فيها استدعاء استدعاء Node-API.
- `[in] object`: الكائن المراد الاستعلام عنه.
- `[in] index`: فهرس الخاصية المراد حذفها.
- `[out] result`: ما إذا كان حذف العنصر قد نجح أم لا. يمكن تجاهل `result` اختياريًا بتمرير `NULL`.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تحاول واجهة برمجة التطبيقات (API) هذه حذف `index` المحدد من `object`.

#### `napi_define_properties` {#napi_define_properties}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: البيئة التي يتم فيها استدعاء استدعاء Node-API.
- `[in] object`: الكائن المراد استرداد الخصائص منه.
- `[in] property_count`: عدد العناصر في مصفوفة `properties`.
- `[in] properties`: مصفوفة واصفات الخصائص.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تسمح هذه الطريقة بالتعريف الفعال لخصائص متعددة على كائن معين. يتم تعريف الخصائص باستخدام واصفات الخصائص (راجع [`napi_property_descriptor`](/ar/nodejs/api/n-api#napi_property_descriptor)). نظرًا لوجود مصفوفة من واصفات الخصائص هذه، ستعين واجهة برمجة التطبيقات (API) هذه الخصائص على الكائن واحدًا تلو الآخر، كما هو محدد بواسطة `DefineOwnProperty()` (الموصوف في [القسم 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) من مواصفات ECMA-262).

#### `napi_object_freeze` {#napi_object_freeze}

**تمت الإضافة في: v14.14.0, v12.20.0**

**إصدار N-API: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: البيئة التي يتم فيها استدعاء استدعاء Node-API.
- `[in] object`: الكائن المراد تجميده.

إرجاع `napi_ok` إذا نجح واجهة برمجة التطبيقات (API).

تجمد هذه الطريقة كائنًا معينًا. يمنع هذا إضافة خصائص جديدة إليه، ويمنع إزالة الخصائص الحالية، ويمنع تغيير إمكانية التعداد أو القابلية للتكوين أو القابلية للكتابة للخصائص الحالية، ويمنع تغيير قيم الخصائص الحالية. كما يمنع تغيير النموذج الأولي للكائن. تم وصف هذا في [القسم 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) من مواصفات ECMA-262.


#### ‏`napi_object_seal` {#napi_object_seal}

**تمت الإضافة في: v14.14.0، v12.20.0**

**إصدار N-API: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: البيئة التي يتم استدعاء استدعاء Node-API ضمنها.
- `[in] object`: الكائن المراد إغلاقه.

يُرجع `napi_ok` إذا نجح API.

تقوم هذه الطريقة بإغلاق كائن معين. يمنع هذا إضافة خصائص جديدة إليه، بالإضافة إلى تعليم جميع الخصائص الموجودة على أنها غير قابلة للتكوين. تم وصف ذلك في [القسم 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) من مواصفات ECMA-262.

## ‏العمل مع وظائف JavaScript {#working-with-javascript-functions}

يوفر Node-API مجموعة من واجهات برمجة التطبيقات التي تسمح لرمز JavaScript بالرجوع إلى الكود الأصلي. تستقبل Node-APIs التي تدعم معاودة الاتصال إلى الكود الأصلي وظائف معاودة الاتصال ممثلة بنوع `napi_callback`. عندما تقوم JavaScript VM بالرجوع إلى الكود الأصلي، يتم استدعاء دالة `napi_callback` المتوفرة. تسمح واجهات برمجة التطبيقات الموثقة في هذا القسم لدالة معاودة الاتصال بما يلي:

- الحصول على معلومات حول السياق الذي تم استدعاء معاودة الاتصال فيه.
- الحصول على الوسائط التي تم تمريرها إلى معاودة الاتصال.
- إرجاع `napi_value` من معاودة الاتصال.

بالإضافة إلى ذلك، يوفر Node-API مجموعة من الوظائف التي تسمح باستدعاء وظائف JavaScript من الكود الأصلي. يمكن للمرء إما استدعاء دالة مثل استدعاء دالة JavaScript عادية، أو كوظيفة إنشاء.

يمكن ربط أي بيانات غير `NULL` يتم تمريرها إلى واجهة برمجة التطبيقات هذه عبر حقل `data` لعناصر `napi_property_descriptor` بـ `object` وتحريرها كلما تم جمع `object` بواسطة القمامة عن طريق تمرير كل من `object` والبيانات إلى [`napi_add_finalizer`](/ar/nodejs/api/n-api#napi_add_finalizer).

### ‏`napi_call_function` {#napi_call_function}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] recv`: قيمة `this` التي تم تمريرها إلى الدالة التي تم استدعاؤها.
- `[in] func`: `napi_value` تمثل دالة JavaScript المراد استدعاؤها.
- `[in] argc`: عدد العناصر في مصفوفة `argv`.
- `[in] argv`: مصفوفة من `napi_values` تمثل قيم JavaScript التي تم تمريرها كوسائط إلى الدالة.
- `[out] result`: `napi_value` تمثل كائن JavaScript الذي تم إرجاعه.

يُرجع `napi_ok` إذا نجح API.

تسمح هذه الطريقة باستدعاء كائن دالة JavaScript من إضافة أصلية. هذه هي الآلية الأساسية لمعاودة الاتصال *من* الكود الأصلي للإضافة *إلى* JavaScript. للحالة الخاصة بالاستدعاء إلى JavaScript بعد عملية غير متزامنة، راجع [`napi_make_callback`](/ar/nodejs/api/n-api#napi_make_callback).

قد تبدو حالة الاستخدام النموذجية كما يلي. ضع في اعتبارك مقتطف JavaScript التالي:

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
بعد ذلك، يمكن استدعاء الدالة المذكورة أعلاه من إضافة أصلية باستخدام الكود التالي:

```C [C]
// Get the function named "AddTwo" on the global object
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// Convert the result back to a native type
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### ‏`napi_create_function` {#napi_create_function}

**تمت الإضافة في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- ‏`[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- ‏`[in] utf8Name`: اسم اختياري للدالة مشفر بصيغة UTF8. يظهر هذا داخل JavaScript كخاصية `name` لكائن الدالة الجديد.
- ‏`[in] length`: طول `utf8name` بالبايت، أو `NAPI_AUTO_LENGTH` إذا كان منتهيًا بقيمة خالية.
- ‏`[in] cb`: الدالة الأصلية التي يجب استدعاؤها عند استدعاء كائن هذه الدالة. يوفر [`napi_callback`](/ar/nodejs/api/n-api#napi_callback) مزيدًا من التفاصيل.
- ‏`[in] data`: سياق بيانات مقدم من المستخدم. سيتم تمرير هذا مرة أخرى إلى الدالة عند استدعائها لاحقًا.
- ‏`[out] result`: ‏`napi_value` يمثل كائن دالة JavaScript للدالة التي تم إنشاؤها حديثًا.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تسمح واجهة برمجة التطبيقات (API) هذه لمؤلف الوظيفة الإضافية بإنشاء كائن دالة في التعليمات البرمجية الأصلية. هذه هي الآلية الأساسية للسماح بالاتصال *بالتعليمات البرمجية الأصلية* للوظيفة الإضافية *من* JavaScript.

الدالة التي تم إنشاؤها حديثًا ليست مرئية تلقائيًا من البرنامج النصي بعد هذا الاستدعاء. بدلاً من ذلك، يجب تعيين خاصية بشكل صريح على أي كائن مرئي لـ JavaScript، حتى يمكن الوصول إلى الدالة من البرنامج النصي.

لعرض دالة كجزء من عمليات تصدير وحدة الوظيفة الإضافية، قم بتعيين الدالة التي تم إنشاؤها حديثًا على كائن عمليات التصدير. قد تبدو وحدة نموذجية كما يلي:

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
بالنظر إلى التعليمات البرمجية أعلاه، يمكن استخدام الوظيفة الإضافية من JavaScript كما يلي:

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
السلسلة التي تم تمريرها إلى `require()` هي اسم الهدف في `binding.gyp` المسؤول عن إنشاء ملف `.node`.

يمكن ربط أي بيانات غير `NULL` يتم تمريرها إلى واجهة برمجة التطبيقات (API) هذه عبر معلمة `data` بدالة JavaScript الناتجة (التي يتم إرجاعها في معلمة `result`) وتحريرها متى تم جمع البيانات المهملة للدالة عن طريق تمرير كل من دالة JavaScript والبيانات إلى [`napi_add_finalizer`](/ar/nodejs/api/n-api#napi_add_finalizer).

يتم وصف `Function`s في JavaScript في [القسم 19.2](https://tc39.github.io/ecma262/#sec-function-objects) من مواصفات لغة ECMAScript.


### `napi_get_cb_info` {#napi_get_cb_info}

**تمت الإضافة في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] cbinfo`: معلومات الاستدعاء التي تم تمريرها إلى دالة الاستدعاء.
- `[in-out] argc`: يحدد طول مصفوفة `argv` المتوفرة ويتلقى العدد الفعلي للوسائط. يمكن تجاهل `argc` اختياريًا عن طريق تمرير `NULL`.
- `[out] argv`: مصفوفة C من `napi_value` سيتم نسخ الوسائط إليها. إذا كان هناك وسائط أكثر من العدد المتوفر، فسيتم نسخ العدد المطلوب فقط من الوسائط. إذا كان هناك عدد أقل من الوسائط المتوفرة من العدد المطالب به، فسيتم ملء بقية `argv` بقيم `napi_value` تمثل `undefined`. يمكن تجاهل `argv` اختياريًا عن طريق تمرير `NULL`.
- `[out] thisArg`: يتلقى وسيطة JavaScript `this` للمكالمة. يمكن تجاهل `thisArg` اختياريًا عن طريق تمرير `NULL`.
- `[out] data`: يتلقى مؤشر البيانات للاستدعاء. يمكن تجاهل `data` اختياريًا عن طريق تمرير `NULL`.

إرجاع `napi_ok` إذا نجح API.

يتم استخدام هذه الطريقة داخل دالة استدعاء لاسترداد تفاصيل حول المكالمة مثل الوسائط ومؤشر `this` من معلومات استدعاء معينة.

### `napi_get_new_target` {#napi_get_new_target}

**تمت الإضافة في: v8.6.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] cbinfo`: معلومات الاستدعاء التي تم تمريرها إلى دالة الاستدعاء.
- `[out] result`: `new.target` لمكالمة المُنشئ.

إرجاع `napi_ok` إذا نجح API.

يعيد هذا API `new.target` لمكالمة المُنشئ. إذا لم يكن الاستدعاء الحالي مكالمة مُنشئ، فإن النتيجة هي `NULL`.


### ‏`napi_new_instance` {#napi_new_instance}

**تمت إضافته في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- ‏`[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- ‏`[in] cons`: ‏`napi_value` يمثل دالة JavaScript المراد استدعاؤها كمنشئ.
- ‏`[in] argc`: عدد العناصر الموجودة في مصفوفة ‏`argv`.
- ‏`[in] argv`: مصفوفة من قيم JavaScript كـ ‏`napi_value` تمثل وسيطات المنشئ. إذا كان ‏`argc` يساوي صفرًا، فيمكن حذف هذه المعلمة عن طريق تمرير ‏`NULL`.
- ‏`[out] result`: ‏`napi_value` يمثل كائن JavaScript الذي تم إرجاعه، والذي في هذه الحالة هو الكائن الذي تم إنشاؤه.

تُستخدم هذه الطريقة لإنشاء قيمة JavaScript جديدة باستخدام ‏`napi_value` معطى يمثل المنشئ للكائن. على سبيل المثال، ضع في اعتبارك المقتطف التالي:

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
يمكن تقريب ما يلي في Node-API باستخدام المقتطف التالي:

```C [C]
// احصل على دالة المنشئ MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
```
إرجاع ‏`napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

## التفاف الكائن {#object-wrap}

يوفر Node-API طريقة "لتغليف" فئات C++ ومثيلاتها بحيث يمكن استدعاء مُنشئ الفئة وطرقها من JavaScript.

بالنسبة للكائنات المغلفة، قد يكون من الصعب التمييز بين دالة يتم استدعاؤها على نموذج أولي للفئة ودالة يتم استدعاؤها على مثيل لفئة. أحد الأنماط الشائعة المستخدمة لمعالجة هذه المشكلة هو حفظ مرجع دائم لمنشئ الفئة لفحوصات ‏`instanceof` اللاحقة.

```C [C]
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // خلاف ذلك...
}
```
يجب تحرير المرجع بمجرد عدم الحاجة إليه.

هناك مناسبات تكون فيها ‏`napi_instanceof()` غير كافية لضمان أن كائن JavaScript هو غلاف لنوع أصلي معين. هذا هو الحال بشكل خاص عندما يتم تمرير كائنات JavaScript المغلفة مرة أخرى إلى الوظيفة الإضافية عبر طرق ثابتة بدلاً من قيمة ‏`this` لطرق النموذج الأولي. في مثل هذه الحالات، هناك احتمال أن يتم فكها بشكل غير صحيح.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// تُرجع `openDatabase()` كائن JavaScript يقوم بتغليف مؤشر قاعدة بيانات أصلي.
const dbHandle = myAddon.openDatabase();

// تُرجع `query()` كائن JavaScript يقوم بتغليف مؤشر استعلام أصلي.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// يوجد خطأ غير مقصود في السطر أدناه. يجب أن تكون المعلمة الأولى لـ
// `myAddon.queryHasRecords()` هي مؤشر قاعدة البيانات (`dbHandle`)، وليس
// مؤشر الاستعلام (`query`)، لذا يجب أن يكون الشرط الصحيح للحلقة while
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // استرداد السجلات
}
```
في المثال أعلاه، ‏`myAddon.queryHasRecords()` هي طريقة تقبل وسيطتين. الأول هو مؤشر قاعدة بيانات والثاني هو مؤشر استعلام. داخليًا، تقوم بفك الوسيطة الأولى وإرسال المؤشر الناتج إلى مؤشر قاعدة بيانات أصلي. ثم تقوم بفك الوسيطة الثانية وإرسال المؤشر الناتج إلى مؤشر استعلام. إذا تم تمرير الوسيطات بترتيب خاطئ، فستعمل الإرسالات، ومع ذلك، هناك فرصة جيدة لفشل عملية قاعدة البيانات الأساسية، أو حتى التسبب في الوصول إلى ذاكرة غير صالح.

لضمان أن المؤشر الذي تم استرداده من الوسيطة الأولى هو بالفعل مؤشر إلى مؤشر قاعدة بيانات، وبالمثل، أن المؤشر الذي تم استرداده من الوسيطة الثانية هو بالفعل مؤشر إلى مؤشر استعلام، يجب أن ينفذ تنفيذ ‏`queryHasRecords()` التحقق من النوع. يمكن أن يساعد الاحتفاظ بمنشئ فئة JavaScript الذي تم إنشاء مؤشر قاعدة البيانات منه والمنشئ الذي تم إنشاء مؤشر الاستعلام منه في ‏`napi_ref`، لأنه يمكن بعد ذلك استخدام ‏`napi_instanceof()` لضمان أن المثيلات التي تم تمريرها إلى ‏`queryHashRecords()` هي بالفعل من النوع الصحيح.

لسوء الحظ، لا تحمي ‏`napi_instanceof()` من التلاعب بالنماذج الأولية. على سبيل المثال، يمكن تعيين النموذج الأولي لمثيل مؤشر قاعدة البيانات إلى النموذج الأولي لمنشئ مثيلات مؤشر الاستعلام. في هذه الحالة، يمكن أن يظهر مثيل مؤشر قاعدة البيانات كمثيل لمؤشر استعلام، وسيجتاز اختبار ‏`napi_instanceof()` لمثيل مؤشر استعلام، مع الاستمرار في احتواء مؤشر إلى مؤشر قاعدة بيانات.

لهذه الغاية، يوفر Node-API إمكانات وضع علامات على النوع.

علامة النوع هي عدد صحيح مكون من 128 بتًا فريدًا للوظيفة الإضافية. يوفر Node-API بنية ‏`napi_type_tag` لتخزين علامة النوع. عند تمرير هذه القيمة مع كائن JavaScript أو [خارجي](/ar/nodejs/api/n-api#napi_create_external) مخزن في ‏`napi_value` إلى ‏`napi_type_tag_object()`، سيتم "تأشير" كائن JavaScript بعلامة النوع. العلامة "غير مرئية" على جانب JavaScript. عندما يصل كائن JavaScript إلى ربط أصلي، يمكن استخدام ‏`napi_check_object_type_tag()` مع علامة النوع الأصلية لتحديد ما إذا كان كائن JavaScript قد تم "تأشيره" مسبقًا بعلامة النوع. يؤدي هذا إلى إنشاء إمكانية فحص نوع بدقة أعلى مما يمكن أن توفره ‏`napi_instanceof()`، لأن وضع علامات النوع هذا ينجو من التلاعب بالنماذج الأولية وإلغاء تحميل/إعادة تحميل الوظيفة الإضافية.

استمرارًا للمثال أعلاه، يوضح تنفيذ الوظيفة الإضافية الهيكلية التالية استخدام ‏`napi_type_tag_object()` و ‏`napi_check_object_type_tag()`.

```C [C]
// هذه القيمة هي علامة النوع لمؤشر قاعدة بيانات. الأمر
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// يمكن استخدامه للحصول على القيمتين اللتين يتم بهما تهيئة البنية.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// هذه القيمة هي علامة النوع لمؤشر استعلام.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // تنفيذ الإجراء الأساسي الذي ينتج عنه مؤشر قاعدة بيانات.
  DatabaseHandle* dbHandle = open_database();

  // إنشاء كائن JS جديد فارغ.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // تأشير الكائن للإشارة إلى أنه يحمل مؤشرًا إلى `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // تخزين المؤشر إلى بنية `DatabaseHandle` داخل كائن JS.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// لاحقًا عندما نتلقى كائن JavaScript يزعم أنه مؤشر قاعدة بيانات
// يمكننا استخدام `napi_check_object_type_tag()` للتأكد من أنه بالفعل كذلك
// مؤشر.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // تحقق من أن الكائن الذي تم تمريره كمعلمة أولى لديه علامة تم تطبيقها مسبقًا.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // اطرح `TypeError` إذا لم يكن كذلك.
  if (!is_db_handle) {
    // اطرح TypeError.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**أُضيف في: الإصدار 8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء الـ API تحتها.
- `[in] utf8name`: اسم دالة JavaScript البانية. للوضوح، يُوصى باستخدام اسم صنف C++ عند تغليف صنف C++.
- `[in] length`: طول `utf8name` بالبايتات، أو `NAPI_AUTO_LENGTH` إذا كانت تنتهي بصفر.
- `[in] constructor`: دالة رد الاتصال التي تعالج إنشاء نسخ من الصنف. عند تغليف صنف C++، يجب أن تكون هذه الطريقة عضوًا ثابتًا بتوقيع [`napi_callback`](/ar/nodejs/api/n-api#napi_callback). لا يمكن استخدام بانٍ صنف C++. يوفر [`napi_callback`](/ar/nodejs/api/n-api#napi_callback) مزيدًا من التفاصيل.
- `[in] data`: بيانات اختيارية يتم تمريرها إلى رد الاتصال الباني كخاصية `data` لمعلومات رد الاتصال.
- `[in] property_count`: عدد العناصر في وسيطة مصفوفة `properties`.
- `[in] properties`: مصفوفة من واصفات الخصائص التي تصف خصائص بيانات ثابتة ونسخ، ووظائف الوصول، وطرق في الصنف. انظر `napi_property_descriptor`.
- `[out] result`: `napi_value` يمثل دالة البناء للصنف.

إرجاع `napi_ok` إذا نجح الـ API.

يحدد صنف JavaScript، بما في ذلك:

- دالة JavaScript البانية التي تحمل اسم الصنف. عند تغليف صنف C++ مطابق، يمكن استخدام رد الاتصال الذي تم تمريره عبر `constructor` لإنشاء نسخة جديدة من صنف C++، والتي يمكن بعد ذلك وضعها داخل نسخة كائن JavaScript التي يتم إنشاؤها باستخدام [`napi_wrap`](/ar/nodejs/api/n-api#napi_wrap).
- خصائص في دالة البناء التي يمكن لتنفيذها استدعاء خصائص بيانات *ثابتة* ووظائف الوصول وطرق صنف C++ المطابقة (المحددة بواسطة واصفات الخصائص مع سمة `napi_static`).
- خصائص في كائن `prototype` الخاص بدالة البناء. عند تغليف صنف C++، يمكن استدعاء خصائص بيانات *غير ثابتة* ووظائف الوصول وطرق صنف C++ من الوظائف الثابتة المعطاة في واصفات الخصائص بدون سمة `napi_static` بعد استرداد نسخة صنف C++ الموضوعة داخل نسخة كائن JavaScript باستخدام [`napi_unwrap`](/ar/nodejs/api/n-api#napi_unwrap).

عند تغليف صنف C++، يجب أن يكون رد اتصال C++ الباني الذي تم تمريره عبر `constructor` طريقة ثابتة في الصنف تستدعي الباني الفعلي للصنف، ثم تغلف نسخة C++ الجديدة في كائن JavaScript، وتعيد كائن التغليف. انظر [`napi_wrap`](/ar/nodejs/api/n-api#napi_wrap) للحصول على التفاصيل.

غالبًا ما يتم حفظ دالة JavaScript البانية التي تم إرجاعها من [`napi_define_class`](/ar/nodejs/api/n-api#napi_define_class) واستخدامها لاحقًا لإنشاء نسخ جديدة من الصنف من التعليمات البرمجية الأصلية، و/أو للتحقق مما إذا كانت القيم المقدمة هي نسخ من الصنف. في هذه الحالة، لمنع جمع قيمة الدالة المهملة، يمكن إنشاء مرجع دائم قوي لها باستخدام [`napi_create_reference`](/ar/nodejs/api/n-api#napi_create_reference)، مما يضمن الحفاظ على عدد المراجع >= 1.

يمكن ربط أي بيانات غير `NULL` يتم تمريرها إلى هذا الـ API عبر معلمة `data` أو عبر حقل `data` لعناصر مصفوفة `napi_property_descriptor` مع بانٍ JavaScript الناتج (الذي يتم إرجاعه في معلمة `result`) وتحريره متى تم جمع الصنف بواسطة جامع المهملات عن طريق تمرير كل من دالة JavaScript والبيانات إلى [`napi_add_finalizer`](/ar/nodejs/api/n-api#napi_add_finalizer).


### `napi_wrap` {#napi_wrap}

**أضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] js_object`: كائن JavaScript الذي سيكون بمثابة غلاف للكائن الأصلي.
- `[in] native_object`: المثيل الأصلي الذي سيتم تغليفه في كائن JavaScript.
- `[in] finalize_cb`: استدعاء أصلي اختياري يمكن استخدامه لتحرير المثيل الأصلي عند تجميع كائن JavaScript بواسطة جامع البيانات المهملة (garbage-collected). توفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_hint`: تلميح سياقي اختياري يتم تمريره إلى استدعاء الإنهاء.
- `[out] result`: مرجع اختياري إلى الكائن المغلف.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يقوم بتغليف مثيل أصلي في كائن JavaScript. يمكن استرداد المثيل الأصلي لاحقًا باستخدام `napi_unwrap()`.

عندما يستدعي كود JavaScript منشئًا لفئة تم تعريفها باستخدام `napi_define_class()`، يتم استدعاء `napi_callback` للمنشئ. بعد إنشاء مثيل للفئة الأصلية، يجب أن يستدعي الاستدعاء بعد ذلك `napi_wrap()` لتغليف المثيل الذي تم إنشاؤه حديثًا في كائن JavaScript الذي تم إنشاؤه بالفعل والذي يمثل وسيطة `this` لاستدعاء المنشئ. (تم إنشاء كائن `this` من `prototype` لوظيفة المنشئ، لذلك لديه بالفعل تعريفات لجميع خصائص وأساليب المثيل.)

عادةً عند تغليف مثيل فئة، يجب توفير استدعاء إنهاء يقوم ببساطة بحذف المثيل الأصلي الذي يتم استقباله كوسيطة `data` لاستدعاء الإنهاء.

المرجع الذي تم إرجاعه الاختياري هو في البداية مرجع ضعيف، مما يعني أن لديه عدد مراجع 0. عادةً ما يتم زيادة عدد المراجع هذا مؤقتًا أثناء العمليات غير المتزامنة التي تتطلب بقاء المثيل صالحًا.

*تنبيه*: يجب حذف المرجع الذي تم إرجاعه الاختياري (إذا تم الحصول عليه) عبر [`napi_delete_reference`](/ar/nodejs/api/n-api#napi_delete_reference) فقط استجابةً لاستدعاء استدعاء الإنهاء. إذا تم حذفه قبل ذلك، فقد لا يتم استدعاء استدعاء الإنهاء أبدًا. لذلك، عند الحصول على مرجع، يكون استدعاء الإنهاء مطلوبًا أيضًا لتمكين التخلص الصحيح من المرجع.

قد يتم تأجيل استدعاءات الإنهاء، مما يترك نافذة حيث تم تجميع الكائن بواسطة جامع البيانات المهملة (وأصبح المرجع الضعيف غير صالح) ولكن لم يتم استدعاء المُنهي بعد. عند استخدام `napi_get_reference_value()` على المراجع الضعيفة التي تم إرجاعها بواسطة `napi_wrap()`، يجب عليك الاستمرار في التعامل مع النتيجة الفارغة.

سيؤدي استدعاء `napi_wrap()` مرة ثانية على كائن إلى إرجاع خطأ. لربط مثيل أصلي آخر بالكائن، استخدم `napi_remove_wrap()` أولاً.


### `napi_unwrap` {#napi_unwrap}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] js_object`: الكائن المرتبط بالمثيل الأصلي.
- `[out] result`: مؤشر إلى المثيل الأصلي المغلف.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يسترد مثيلاً أصليًا تم تغليفه مسبقًا في كائن JavaScript باستخدام `napi_wrap()`.

عندما يستدعي كود JavaScript طريقة أو محدد وصول خاصية في الفئة، يتم استدعاء `napi_callback` المقابل. إذا كان الاستدعاء لطريقة أو محدد وصول لمثيل، فإن وسيطة `this` للاستدعاء هي كائن التغليف؛ يمكن الحصول على مثيل C++ المغلف الذي هو هدف الاستدعاء بعد ذلك عن طريق استدعاء `napi_unwrap()` على كائن التغليف.

### `napi_remove_wrap` {#napi_remove_wrap}

**أُضيف في: v8.5.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] js_object`: الكائن المرتبط بالمثيل الأصلي.
- `[out] result`: مؤشر إلى المثيل الأصلي المغلف.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يسترد مثيلاً أصليًا تم تغليفه مسبقًا في كائن JavaScript `js_object` باستخدام `napi_wrap()` ويزيل التغليف. إذا تم ربط استدعاء نهائي بالتغليف، فلن يتم استدعاؤه بعد الآن عندما يتم جمع كائن JavaScript كبيانات مهملة.

### `napi_type_tag_object` {#napi_type_tag_object}

**أُضيف في: v14.8.0, v12.19.0**

**إصدار N-API: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] js_object`: كائن JavaScript أو [خارجي](/ar/nodejs/api/n-api#napi_create_external) المراد وضع علامة عليه.
- `[in] type_tag`: العلامة التي سيتم وضع علامة على الكائن بها.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يربط قيمة مؤشر `type_tag` بكائن JavaScript أو [خارجي](/ar/nodejs/api/n-api#napi_create_external). يمكن بعد ذلك استخدام `napi_check_object_type_tag()` لمقارنة العلامة المرفقة بالكائن بعلامة مملوكة للإضافة للتأكد من أن الكائن من النوع الصحيح.

إذا كان الكائن يحتوي بالفعل على علامة نوع مرتبطة به، فسترجع واجهة برمجة التطبيقات (API) هذه `napi_invalid_arg`.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**تمت إضافتها في: الإصدار 14.8.0، الإصدار 12.19.0**

**إصدار N-API: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] js_object`: كائن JavaScript أو [خارجي](/ar/nodejs/api/n-api#napi_create_external) يتم فحص علامة النوع الخاصة به.
- `[in] type_tag`: العلامة التي ستتم مقارنتها بأي علامة موجودة على الكائن.
- `[out] result`: ما إذا كانت علامة النوع المعطاة تطابق علامة النوع الموجودة على الكائن. يتم إرجاع `false` أيضًا إذا لم يتم العثور على علامة نوع على الكائن.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يقارن المؤشر المعطى كـ `type_tag` بأي مؤشر يمكن العثور عليه في `js_object`. إذا لم يتم العثور على علامة على `js_object` أو إذا تم العثور على علامة ولكنها لا تتطابق مع `type_tag`، فسيتم تعيين `result` على `false`. إذا تم العثور على علامة وكانت تتطابق مع `type_tag`، فسيتم تعيين `result` على `true`.

### `napi_add_finalizer` {#napi_add_finalizer}

**تمت إضافتها في: الإصدار 8.0.0**

**إصدار N-API: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] js_object`: كائن JavaScript الذي سيتم إرفاق البيانات الأصلية به.
- `[in] finalize_data`: بيانات اختيارية يتم تمريرها إلى `finalize_cb`.
- `[in] finalize_cb`: استدعاء أصلي سيتم استخدامه لتحرير البيانات الأصلية عندما يتم تجميع كائن JavaScript كقمامة. توفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_hint`: تلميح سياقي اختياري يتم تمريره إلى استدعاء الإنهاء.
- `[out] result`: مرجع اختياري لكائن JavaScript.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يضيف استدعاء `napi_finalize` الذي سيتم استدعاؤه عندما يتم تجميع كائن JavaScript في `js_object` كقمامة.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه عدة مرات على كائن JavaScript واحد.

*تنبيه*: يجب حذف المرجع الاختياري المرتجع (إذا تم الحصول عليه) عبر [`napi_delete_reference`](/ar/nodejs/api/n-api#napi_delete_reference) فقط استجابةً لاستدعاء استدعاء الإنهاء. إذا تم حذفه قبل ذلك، فقد لا يتم استدعاء استدعاء الإنهاء أبدًا. لذلك، عند الحصول على مرجع، يلزم أيضًا استدعاء إنهاء لتمكين التخلص الصحيح من المرجع.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**تمت إضافته في: الإصدار 21.0.0، الإصدار 20.10.0، الإصدار 18.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] finalize_cb`: وظيفة رد نداء أصلية سيتم استخدامها لتحرير البيانات الأصلية عندما يتم تجميع كائن JavaScript بواسطة جامع القمامة (garbage-collected). توفر [`napi_finalize`](/ar/nodejs/api/n-api#napi_finalize) مزيدًا من التفاصيل.
- `[in] finalize_data`: بيانات اختيارية يتم تمريرها إلى `finalize_cb`.
- `[in] finalize_hint`: تلميح سياقي اختياري يتم تمريره إلى وظيفة رد نداء الإنهاء.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يجدول وظيفة رد نداء `napi_finalize` ليتم استدعاؤها بشكل غير متزامن في حلقة الأحداث.

عادةً ما يتم استدعاء أدوات الإنهاء أثناء قيام GC (جامع القمامة) بتجميع الكائنات. في هذه المرحلة، سيتم تعطيل استدعاء أي Node-API قد يتسبب في تغييرات في حالة GC وسيؤدي إلى تعطل Node.js.

يساعد `node_api_post_finalizer` على تجاوز هذا القيد من خلال السماح للإضافة بتأجيل استدعاءات Node-APIs إلى نقطة زمنية خارج إنهاء GC.

## عمليات غير متزامنة بسيطة {#simple-asynchronous-operations}

غالبًا ما تحتاج وحدات الإضافة إلى الاستفادة من مساعدي async من libuv كجزء من تنفيذها. يتيح لهم ذلك جدولة العمل ليتم تنفيذه بشكل غير متزامن بحيث يمكن لأساليبهم العودة قبل اكتمال العمل. هذا يسمح لهم بتجنب حظر التنفيذ العام لتطبيق Node.js.

يوفر Node-API واجهة مستقرة ABI لهذه الوظائف الداعمة التي تغطي حالات الاستخدام غير المتزامنة الأكثر شيوعًا.

يحدد Node-API هيكل `napi_async_work` الذي يستخدم لإدارة العمال غير المتزامنين. يتم إنشاء / حذف المثيلات باستخدام [`napi_create_async_work`](/ar/nodejs/api/n-api#napi_create_async_work) و [`napi_delete_async_work`](/ar/nodejs/api/n-api#napi_delete_async_work).

وظائف رد نداء `execute` و `complete` هي وظائف سيتم استدعاؤها عندما يكون المنفذ جاهزًا للتنفيذ وعندما يكمل مهمته على التوالي.

يجب أن تتجنب وظيفة `execute` إجراء أي استدعاءات Node-API قد تؤدي إلى تنفيذ JavaScript أو التفاعل مع كائنات JavaScript. في معظم الأحيان، يجب إجراء أي رمز يحتاج إلى إجراء استدعاءات Node-API في وظيفة رد نداء `complete` بدلاً من ذلك. تجنب استخدام المعامل `napi_env` في وظيفة رد نداء التنفيذ لأنه من المحتمل أن يقوم بتنفيذ JavaScript.

تنفذ هذه الوظائف الواجهات التالية:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
عندما يتم استدعاء هذه الأساليب، سيكون المعامل `data` الذي تم تمريره هو بيانات `void*` التي قدمتها الإضافة والتي تم تمريرها إلى استدعاء `napi_create_async_work`.

بمجرد إنشاء العامل غير المتزامن، يمكن وضعه في قائمة الانتظار للتنفيذ باستخدام الوظيفة [`napi_queue_async_work`](/ar/nodejs/api/n-api#napi_queue_async_work):

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
يمكن استخدام [`napi_cancel_async_work`](/ar/nodejs/api/n-api#napi_cancel_async_work) إذا كان العمل بحاجة إلى الإلغاء قبل أن يبدأ العمل في التنفيذ.

بعد استدعاء [`napi_cancel_async_work`](/ar/nodejs/api/n-api#napi_cancel_async_work)، سيتم استدعاء وظيفة رد نداء `complete` بقيمة حالة `napi_cancelled`. يجب عدم حذف العمل قبل استدعاء وظيفة رد نداء `complete`، حتى عندما تم إلغاؤه.


### `napi_create_async_work` {#napi_create_async_work}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v8.6.0 | تمت إضافة المعاملات `async_resource` و `async_resource_name`. |
| v8.0.0 | تمت الإضافة في: v8.0.0 |
:::

**إصدار N-API: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] async_resource`: كائن اختياري مرتبط بالعمل غير المتزامن الذي سيتم تمريره إلى `async_hooks` المحتملة [`init` hooks](/ar/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: مُعرِّف لنوع المورد الذي يتم توفيره للحصول على معلومات تشخيصية مكشوفة بواسطة واجهة برمجة التطبيقات (API) `async_hooks`.
- `[in] execute`: الدالة الأصلية التي يجب استدعاؤها لتنفيذ المنطق بشكل غير متزامن. يتم استدعاء الدالة المعطاة من سلسلة عمليات تجمع العاملين ويمكن أن يتم تنفيذها بالتوازي مع سلسلة عمليات حلقة الأحداث الرئيسية.
- `[in] complete`: الدالة الأصلية التي سيتم استدعاؤها عند اكتمال المنطق غير المتزامن أو إلغائه. يتم استدعاء الدالة المعطاة من سلسلة عمليات حلقة الأحداث الرئيسية. [`napi_async_complete_callback`](/ar/nodejs/api/n-api#napi_async_complete_callback) يوفر المزيد من التفاصيل.
- `[in] data`: سياق البيانات المقدم من المستخدم. سيتم تمرير هذا مرة أخرى إلى دالتي التنفيذ والإكمال.
- `[out] result`: `napi_async_work*` وهو مقبض العمل غير المتزامن الذي تم إنشاؤه حديثًا.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تخصص واجهة برمجة التطبيقات (API) هذه كائن عمل يستخدم لتنفيذ المنطق بشكل غير متزامن. يجب تحريره باستخدام [`napi_delete_async_work`](/ar/nodejs/api/n-api#napi_delete_async_work) بمجرد أن يصبح العمل غير مطلوب.

يجب أن يكون `async_resource_name` سلسلة منتهية بصفر، ومشفرة بترميز UTF-8.

يتم توفير معرف `async_resource_name` من قبل المستخدم ويجب أن يكون ممثلاً لنوع العمل غير المتزامن الذي يتم تنفيذه. يوصى أيضًا بتطبيق مساحة اسم على المعرف، على سبيل المثال عن طريق تضمين اسم الوحدة النمطية. راجع [`async_hooks` documentation](/ar/nodejs/api/async_hooks#type) لمزيد من المعلومات.


### `napi_delete_async_work` {#napi_delete_async_work}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] work`: المعالج الذي تم إرجاعه بواسطة استدعاء `napi_create_async_work`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تعمل واجهة برمجة التطبيقات (API) هذه على تحرير كائن العمل الذي تم تخصيصه مسبقًا.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء JavaScript معلق.

### `napi_queue_async_work` {#napi_queue_async_work}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] work`: المعالج الذي تم إرجاعه بواسطة استدعاء `napi_create_async_work`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تطلب واجهة برمجة التطبيقات (API) هذه جدولة العمل الذي تم تخصيصه مسبقًا للتنفيذ. بمجرد إرجاعها بنجاح، يجب عدم استدعاء واجهة برمجة التطبيقات (API) هذه مرة أخرى بنفس عنصر `napi_async_work` أو ستكون النتيجة غير محددة.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] work`: المعالج الذي تم إرجاعه بواسطة استدعاء `napi_create_async_work`.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تعمل واجهة برمجة التطبيقات (API) هذه على إلغاء العمل في قائمة الانتظار إذا لم يبدأ بعد. إذا بدأ التنفيذ بالفعل، فلا يمكن إلغاؤه وسيتم إرجاع `napi_generic_failure`. إذا نجح الأمر، فسيتم استدعاء رد الاتصال `complete` بقيمة حالة `napi_cancelled`. يجب عدم حذف العمل قبل استدعاء رد الاتصال `complete`، حتى إذا تم إلغاؤه بنجاح.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء JavaScript معلق.

## عمليات غير متزامنة مخصصة {#custom-asynchronous-operations}

قد لا تكون واجهات برمجة التطبيقات (API) البسيطة للعمل غير المتزامن المذكورة أعلاه مناسبة لكل سيناريو. عند استخدام أي آلية غير متزامنة أخرى، تكون واجهات برمجة التطبيقات (API) التالية ضرورية لضمان تتبع العملية غير المتزامنة بشكل صحيح بواسطة وقت التشغيل.


### `napi_async_init` {#napi_async_init}

**تمت إضافتها في: v8.6.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] async_resource`: الكائن المرتبط بالعمل غير المتزامن الذي سيتم تمريره إلى خطافات `async_hooks` [`init`](/ar/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) المحتملة ويمكن الوصول إليه بواسطة [`async_hooks.executionAsyncResource()`](/ar/nodejs/api/async_hooks#async_hooksexecutionasyncresource).
- `[in] async_resource_name`: مُعرّف لنوع المورد الذي يتم توفيره للحصول على معلومات تشخيصية تعرضها واجهة برمجة التطبيقات `async_hooks`.
- `[out] result`: سياق غير المتزامن المهيأ.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

يجب الحفاظ على الكائن `async_resource` حيًا حتى [`napi_async_destroy`](/ar/nodejs/api/n-api#napi_async_destroy) للحفاظ على عمل واجهة برمجة التطبيقات (API) المتعلقة بـ `async_hooks` بشكل صحيح. من أجل الحفاظ على توافق ABI مع الإصدارات السابقة، لا تحتفظ `napi_async_context` بمراجع قوية للكائنات `async_resource` لتجنب التسبب في تسرب الذاكرة. ومع ذلك، إذا تم جمع القمامة للكائن `async_resource` بواسطة محرك JavaScript قبل تدمير `napi_async_context` بواسطة `napi_async_destroy`، فإن استدعاء واجهات برمجة التطبيقات (APIs) المتعلقة بـ `napi_async_context` مثل [`napi_open_callback_scope`](/ar/nodejs/api/n-api#napi_open_callback_scope) و[`napi_make_callback`](/ar/nodejs/api/n-api#napi_make_callback) يمكن أن يتسبب في مشاكل مثل فقدان سياق غير المتزامن عند استخدام واجهة برمجة التطبيقات (API) `AsyncLocalStorage`.

من أجل الحفاظ على توافق ABI مع الإصدارات السابقة، فإن تمرير `NULL` لـ `async_resource` لا يؤدي إلى حدوث خطأ. ومع ذلك، لا يوصى بذلك لأن هذا سيؤدي إلى سلوك غير مرغوب فيه مع `async_hooks` [`init` hooks](/ar/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) و `async_hooks.executionAsyncResource()` حيث أن المورد مطلوب الآن من قبل تنفيذ `async_hooks` الأساسي من أجل توفير الارتباط بين عمليات الاسترجاع غير المتزامنة.


### `napi_async_destroy` {#napi_async_destroy}

**أضيف في: v8.6.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] async_context`: سياق عدم التزامن المراد تدميره.

إرجاع `napi_ok` إذا نجح API.

يمكن استدعاء API هذا حتى إذا كان هناك استثناء JavaScript معلق.

### `napi_make_callback` {#napi_make_callback}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v8.6.0 | تمت إضافة المعامل `async_context`. |
| v8.0.0 | أضيف في: v8.0.0 |
:::

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء API ضمنها.
- `[in] async_context`: سياق لعملية عدم التزامن التي تستدعي الاستدعاء. يجب أن تكون هذه عادةً قيمة تم الحصول عليها مسبقًا من [`napi_async_init`](/ar/nodejs/api/n-api#napi_async_init). من أجل الحفاظ على توافق ABI مع الإصدارات السابقة، فإن تمرير `NULL` لـ `async_context` لا يؤدي إلى حدوث خطأ. ومع ذلك، فإن هذا يؤدي إلى تشغيل غير صحيح لخطافات عدم التزامن. تتضمن المشكلات المحتملة فقدان سياق عدم التزامن عند استخدام API `AsyncLocalStorage`.
- `[in] recv`: قيمة `this` التي تم تمريرها إلى الدالة المستدعاة.
- `[in] func`: `napi_value` تمثل دالة JavaScript المراد استدعاؤها.
- `[in] argc`: عدد العناصر في مصفوفة `argv`.
- `[in] argv`: مصفوفة من قيم JavaScript كـ `napi_value` تمثل وسيطات الدالة. إذا كانت `argc` صفرًا، فيمكن حذف هذا المعامل عن طريق تمرير `NULL`.
- `[out] result`: `napi_value` يمثل كائن JavaScript الذي تم إرجاعه.

إرجاع `napi_ok` إذا نجح API.

تسمح هذه الطريقة باستدعاء كائن دالة JavaScript من إضافة أصلية. يشبه API هذا `napi_call_function`. ومع ذلك، يتم استخدامه للاتصال *من* التعليمات البرمجية الأصلية *إلى* JavaScript *بعد* العودة من عملية غير متزامنة (عندما لا يوجد برنامج نصي آخر في المكدس). إنه عبارة عن غلاف بسيط إلى حد ما حول `node::MakeCallback`.

لاحظ أنه *ليس* من الضروري استخدام `napi_make_callback` من داخل `napi_async_complete_callback` ؛ في هذا الموقف، تم بالفعل إعداد سياق عدم التزامن الخاص بالاستدعاء، لذا فإن الاستدعاء المباشر لـ `napi_call_function` كافٍ ومناسب. قد يكون استخدام الدالة `napi_make_callback` مطلوبًا عند تنفيذ سلوك غير متزامن مخصص لا يستخدم `napi_create_async_work`.

أي `process.nextTick`s أو Promises المجدولة في قائمة المهام الصغيرة بواسطة JavaScript أثناء الاستدعاء يتم تشغيلها قبل العودة إلى C/C++.


### ‏`napi_open_callback_scope` {#napi_open_callback_scope}

**أُضيف في: الإصدار 9.6.0**

**إصدار N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[in] resource_object`: كائن مرتبط بالعمل غير المتزامن الذي سيتم تمريره إلى `async_hooks` المحتملة [`init` hooks](/ar/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource). تم إهمال هذه المعلمة ويتم تجاهلها في وقت التشغيل. استخدم المعلمة `async_resource` في [`napi_async_init`](/ar/nodejs/api/n-api#napi_async_init) بدلاً من ذلك.
- `[in] context`: سياق العملية غير المتزامنة التي تستدعي رد الاتصال. يجب أن تكون هذه قيمة تم الحصول عليها مسبقًا من [`napi_async_init`](/ar/nodejs/api/n-api#napi_async_init).
- `[out] result`: النطاق الذي تم إنشاؤه حديثًا.

هناك حالات (على سبيل المثال، حل الوعود) حيث يكون من الضروري أن يكون لديك ما يعادل النطاق المرتبط برد الاتصال في مكانه عند إجراء بعض استدعاءات Node-API. إذا لم يكن هناك برنامج نصي آخر في المكدس، فيمكن استخدام الوظائف [`napi_open_callback_scope`](/ar/nodejs/api/n-api#napi_open_callback_scope) و [`napi_close_callback_scope`](/ar/nodejs/api/n-api#napi_close_callback_scope) لفتح/إغلاق النطاق المطلوب.

### ‏`napi_close_callback_scope` {#napi_close_callback_scope}

**أُضيف في: الإصدار 9.6.0**

**إصدار N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[in] scope`: النطاق المراد إغلاقه.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه حتى إذا كان هناك استثناء JavaScript معلق.

## إدارة الإصدار {#version-management}

### ‏`napi_get_node_version` {#napi_get_node_version}

**أُضيف في: الإصدار 8.4.0**

**إصدار N-API: 1**

```C [C]
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) فيها.
- `[out] version`: مؤشر إلى معلومات الإصدار الخاصة بـ Node.js نفسه.

إرجاع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تملأ هذه الوظيفة البنية `version` بالإصدار الرئيسي والثانوي والتصحيحي لـ Node.js الذي يعمل حاليًا، والحقل `release` بقيمة [`process.release.name`](/ar/nodejs/api/process#processrelease).

يتم تخصيص المخزن المؤقت الذي تم إرجاعه بشكل ثابت ولا يحتاج إلى تحرير.


### `napi_get_version` {#napi_get_version}

**أُضيف في: v8.0.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: البيئة التي يتم فيها استدعاء API.
- `[out] result`: أعلى إصدار من Node-API مدعوم.

يُرجع `napi_ok` إذا نجح API.

يُرجع هذا API أعلى إصدار من Node-API مدعوم بواسطة وقت تشغيل Node.js. من المخطط أن يكون Node-API تجميعيًا بحيث تدعم الإصدارات الأحدث من Node.js وظائف API إضافية. للسماح للملحق باستخدام دالة أحدث عند التشغيل بإصدارات من Node.js تدعمها، مع توفير سلوك احتياطي عند التشغيل بإصدارات Node.js التي لا تدعمها:

- استدعِ `napi_get_version()` لتحديد ما إذا كان API متاحًا.
- إذا كان متاحًا، فقم بتحميل مؤشر إلى الدالة ديناميكيًا باستخدام `uv_dlsym()`.
- استخدم المؤشر المحمل ديناميكيًا لاستدعاء الدالة.
- إذا كانت الدالة غير متاحة، فقم بتوفير تنفيذ بديل لا يستخدم الدالة.

## إدارة الذاكرة {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**أُضيف في: v8.5.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: البيئة التي يتم فيها استدعاء API.
- `[in] change_in_bytes`: التغيير في الذاكرة المخصصة خارجيًا والتي يتم الحفاظ عليها بواسطة كائنات JavaScript.
- `[out] result`: القيمة المعدلة

يُرجع `napi_ok` إذا نجح API.

تمنح هذه الدالة V8 إشارة إلى مقدار الذاكرة المخصصة خارجيًا التي يتم الحفاظ عليها بواسطة كائنات JavaScript (أي كائن JavaScript يشير إلى الذاكرة الخاصة به المخصصة بواسطة ملحق أصلي). سيؤدي تسجيل الذاكرة المخصصة خارجيًا إلى تشغيل عمليات تجميع البيانات المهملة العامة في كثير من الأحيان.

## الوعود {#promises}

توفر Node-API تسهيلات لإنشاء كائنات `Promise` كما هو موضح في [القسم 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) من مواصفات ECMA. تقوم بتنفيذ الوعود كزوج من الكائنات. عند إنشاء وعد بواسطة `napi_create_promise()`، يتم إنشاء كائن "مؤجل" وإرجاعه جنبًا إلى جنب مع `Promise`. يتم ربط الكائن المؤجل بالـ `Promise` الذي تم إنشاؤه وهو الوسيلة الوحيدة لحل أو رفض `Promise` باستخدام `napi_resolve_deferred()` أو `napi_reject_deferred()`. يتم تحرير الكائن المؤجل الذي تم إنشاؤه بواسطة `napi_create_promise()` بواسطة `napi_resolve_deferred()` أو `napi_reject_deferred()`. يمكن إرجاع كائن `Promise` إلى JavaScript حيث يمكن استخدامه بالطريقة المعتادة.

على سبيل المثال، لإنشاء وعد وتمريره إلى عامل غير متزامن:

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// Create the promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Pass the deferred to a function that performs an asynchronous action.
do_something_asynchronous(deferred);

// Return the promise to JS
return promise;
```
ستقوم الدالة المذكورة أعلاه `do_something_asynchronous()` بتنفيذ الإجراء غير المتزامن الخاص بها ثم ستحل أو ترفض المؤجل، وبالتالي تختتم الوعد وتحرر المؤجل:

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Create a value with which to conclude the deferred.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Resolve or reject the promise associated with the deferred depending on
// whether the asynchronous action succeeded.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// At this point the deferred has been freed, so we should assign NULL to it.
deferred = NULL;
```

### ‏`napi_create_promise` {#napi_create_promise}

**تمت الإضافة في: الإصدار 8.5.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[out] deferred`: كائن مؤجل تم إنشاؤه حديثًا ويمكن تمريره لاحقًا إلى `napi_resolve_deferred()` أو `napi_reject_deferred()` لحل أو رفض الوعد المرتبط به على التوالي.
- `[out] promise`: وعد JavaScript المرتبط بالكائن المؤجل.

يُرجع `napi_ok` إذا نجحت واجهة برمجة التطبيقات (API).

تقوم واجهة برمجة التطبيقات (API) هذه بإنشاء كائن مؤجل ووعد JavaScript.

### ‏`napi_resolve_deferred` {#napi_resolve_deferred}

**تمت الإضافة في: الإصدار 8.5.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] deferred`: الكائن المؤجل الذي سيتم حل الوعد المرتبط به.
- `[in] resolution`: القيمة التي سيتم بها حل الوعد.

تقوم واجهة برمجة التطبيقات (API) هذه بحل وعد JavaScript عن طريق الكائن المؤجل المرتبط به. وبالتالي، لا يمكن استخدامها إلا لحل وعود JavaScript التي يتوفر لها الكائن المؤجل المقابل. هذا يعني فعليًا أنه يجب إنشاء الوعد باستخدام `napi_create_promise()` ويجب الاحتفاظ بالكائن المؤجل الذي تم إرجاعه من هذه المكالمة من أجل تمريره إلى واجهة برمجة التطبيقات (API) هذه.

يتم تحرير الكائن المؤجل عند الانتهاء بنجاح.

### ‏`napi_reject_deferred` {#napi_reject_deferred}

**تمت الإضافة في: الإصدار 8.5.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] deferred`: الكائن المؤجل الذي سيتم حل الوعد المرتبط به.
- `[in] rejection`: القيمة التي سيتم بها رفض الوعد.

تقوم واجهة برمجة التطبيقات (API) هذه برفض وعد JavaScript عن طريق الكائن المؤجل المرتبط به. وبالتالي، لا يمكن استخدامها إلا لرفض وعود JavaScript التي يتوفر لها الكائن المؤجل المقابل. هذا يعني فعليًا أنه يجب إنشاء الوعد باستخدام `napi_create_promise()` ويجب الاحتفاظ بالكائن المؤجل الذي تم إرجاعه من هذه المكالمة من أجل تمريره إلى واجهة برمجة التطبيقات (API) هذه.

يتم تحرير الكائن المؤجل عند الانتهاء بنجاح.


### ‏`napi_is_promise` {#napi_is_promise}

**تمت إضافتها في: الإصدار 8.5.0**

**إصدار N-API: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- `[in] value`: القيمة المراد فحصها
- `[out] is_promise`: علامة تشير إلى ما إذا كانت `promise` كائن وعد أصلي (أي كائن وعد تم إنشاؤه بواسطة المحرك الأساسي).

## ‏تنفيذ البرنامج النصي {#script-execution}

توفر Node-API واجهة برمجة تطبيقات لتنفيذ سلسلة نصية تحتوي على JavaScript باستخدام محرك JavaScript الأساسي.

### ‏`napi_run_script` {#napi_run_script}

**تمت إضافتها في: الإصدار 8.5.0**

**إصدار N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- `[in] script`: سلسلة JavaScript تحتوي على البرنامج النصي المراد تنفيذه.
- `[out] result`: القيمة الناتجة عن تنفيذ البرنامج النصي.

تقوم هذه الدالة بتنفيذ سلسلة من تعليمات JavaScript البرمجية وإرجاع نتيجتها مع التحذيرات التالية:

- بخلاف `eval`، لا تسمح هذه الدالة للبرنامج النصي بالوصول إلى النطاق المعجمي الحالي، وبالتالي فهي لا تسمح أيضًا بالوصول إلى [نطاق الوحدة النمطية](/ar/nodejs/api/modules#the-module-scope)، مما يعني أن العناصر الزائفة العامة مثل `require` لن تكون متاحة.
- يمكن للبرنامج النصي الوصول إلى [النطاق العام](/ar/nodejs/api/globals). سيتم إضافة تعريفات الدوال و `var` في البرنامج النصي إلى كائن [`global`](/ar/nodejs/api/globals#global). ستكون تعريفات المتغيرات التي تم إجراؤها باستخدام `let` و `const` مرئية عالميًا، ولكن لن تتم إضافتها إلى كائن [`global`](/ar/nodejs/api/globals#global).
- قيمة `this` هي [`global`](/ar/nodejs/api/globals#global) داخل البرنامج النصي.

## ‏حلقة حدث libuv {#libuv-event-loop}

توفر Node-API دالة للحصول على حلقة الأحداث الحالية المرتبطة بـ `napi_env` محددة.

### ‏`napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**تمت إضافتها في: الإصدار 9.3.0، الإصدار 8.10.0**

**إصدار N-API: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) تحتها.
- `[out] loop`: مثيل حلقة libuv الحالية.

ملاحظة: على الرغم من أن libuv كانت مستقرة نسبيًا بمرور الوقت، إلا أنها لا توفر ضمانًا لاستقرار ABI. يجب تجنب استخدام هذه الدالة. قد يؤدي استخدامه إلى إضافة لا تعمل عبر إصدارات Node.js. ‏[asynchronous-thread-safe-function-calls](/ar/nodejs/api/n-api#asynchronous-thread-safe-function-calls) هي بديل للعديد من حالات الاستخدام.


## استدعاءات الدوال الآمنة للخيوط غير المتزامنة {#asynchronous-thread-safe-function-calls}

لا يمكن استدعاء دوال JavaScript عادةً إلا من الخيط الرئيسي للإضافة الأصلية. إذا أنشأت إضافة خيوطًا إضافية، فلا يجب استدعاء دوال Node-API التي تتطلب `napi_env` أو `napi_value` أو `napi_ref` من هذه الخيوط.

عندما تحتوي إضافة على خيوط إضافية وتحتاج دوال JavaScript إلى استدعائها استنادًا إلى المعالجة التي أكملتها هذه الخيوط، يجب أن تتواصل هذه الخيوط مع الخيط الرئيسي للإضافة بحيث يمكن للخيط الرئيسي استدعاء دالة JavaScript نيابةً عنها. توفر واجهات برمجة تطبيقات الدوال الآمنة للخيوط طريقة سهلة للقيام بذلك.

توفر واجهات برمجة التطبيقات هذه النوع `napi_threadsafe_function` بالإضافة إلى واجهات برمجة التطبيقات لإنشاء وتدمير واستدعاء كائنات من هذا النوع. `napi_create_threadsafe_function()` تنشئ مرجعًا ثابتًا لـ `napi_value` يحمل دالة JavaScript يمكن استدعاؤها من خيوط متعددة. تحدث الاستدعاءات بشكل غير متزامن. هذا يعني أن القيم التي سيتم استدعاء JavaScript بها ستوضع في قائمة انتظار، وبالنسبة لكل قيمة في قائمة الانتظار، سيتم إجراء استدعاء في النهاية لدالة JavaScript.

عند إنشاء `napi_threadsafe_function`، يمكن توفير دالة استرجاع `napi_finalize`. سيتم استدعاء دالة الاسترجاع هذه على الخيط الرئيسي عندما تكون الدالة الآمنة للخيوط على وشك التدمير. تتلقى السياق وبيانات الإنهاء التي تم تقديمها أثناء الإنشاء، وتوفر فرصة للتنظيف بعد الخيوط، على سبيل المثال عن طريق استدعاء `uv_thread_join()`. **بصرف النظر عن خيط الحلقة الرئيسية، لا ينبغي لأي خيوط استخدام الدالة الآمنة للخيوط بعد اكتمال دالة الاسترجاع النهائية.**

يمكن استرداد `context` الذي تم تقديمه أثناء استدعاء `napi_create_threadsafe_function()` من أي خيط باستدعاء `napi_get_threadsafe_function_context()`.

### استدعاء دالة آمنة للخيوط {#calling-a-thread-safe-function}

يمكن استخدام `napi_call_threadsafe_function()` لبدء استدعاء في JavaScript. تقبل `napi_call_threadsafe_function()` معلمة تتحكم في ما إذا كانت واجهة برمجة التطبيقات تتصرف بشكل حظر. إذا تم تعيينها على `napi_tsfn_nonblocking`، فإن واجهة برمجة التطبيقات تتصرف بطريقة غير حظر، وتعيد `napi_queue_full` إذا كانت قائمة الانتظار ممتلئة، مما يمنع إضافة البيانات بنجاح إلى قائمة الانتظار. إذا تم تعيينها على `napi_tsfn_blocking`، فإن واجهة برمجة التطبيقات تحظر حتى يصبح هناك مساحة متاحة في قائمة الانتظار. لا تحظر `napi_call_threadsafe_function()` أبدًا إذا تم إنشاء الدالة الآمنة للخيوط بحجم قائمة انتظار أقصى قدره 0.

يجب عدم استدعاء `napi_call_threadsafe_function()` مع `napi_tsfn_blocking` من خيط JavaScript، لأنه إذا كانت قائمة الانتظار ممتلئة، فقد يتسبب ذلك في توقف خيط JavaScript.

يتم التحكم في الاستدعاء الفعلي في JavaScript بواسطة دالة الاسترجاع التي يتم تقديمها عبر معلمة `call_js_cb`. يتم استدعاء `call_js_cb` على الخيط الرئيسي مرة واحدة لكل قيمة تم وضعها في قائمة الانتظار عن طريق استدعاء ناجح لـ `napi_call_threadsafe_function()`. إذا لم يتم تقديم دالة استرجاع كهذه، فسيتم استخدام دالة استرجاع افتراضية، ولن يحتوي استدعاء JavaScript الناتج على أي وسيطات. تتلقى دالة الاسترجاع `call_js_cb` دالة JavaScript المراد استدعاؤها كـ `napi_value` في معلماتها، بالإضافة إلى مؤشر سياق `void*` المستخدم عند إنشاء `napi_threadsafe_function`، ومؤشر البيانات التالي الذي تم إنشاؤه بواسطة أحد الخيوط الثانوية. يمكن لدالة الاسترجاع بعد ذلك استخدام واجهة برمجة تطبيقات مثل `napi_call_function()` للاستدعاء في JavaScript.

يمكن أيضًا استدعاء دالة الاسترجاع مع تعيين كل من `env` و `call_js_cb` على `NULL` للإشارة إلى أن الاستدعاءات في JavaScript لم تعد ممكنة، في حين تظل العناصر في قائمة الانتظار التي قد تحتاج إلى تحرير. يحدث هذا عادةً عندما تنتهي عملية Node.js أثناء وجود دالة آمنة للخيوط لا تزال نشطة.

ليس من الضروري الاستدعاء في JavaScript عبر `napi_make_callback()` لأن Node-API يقوم بتشغيل `call_js_cb` في سياق مناسب لعمليات الاسترجاع.

يمكن استدعاء صفر أو أكثر من العناصر الموجودة في قائمة الانتظار في كل نبضة من حلقة الأحداث. يجب ألا تعتمد التطبيقات على سلوك معين بخلاف إحراز تقدم في استدعاء عمليات الاسترجاع وسيتم استدعاء الأحداث مع تقدم الوقت.


### تعداد المراجع إلى الدوال الآمنة مؤشرًا {#reference-counting-of-thread-safe-functions}

يمكن إضافة سلاسل الرسائل وإزالتها من عنصر `napi_threadsafe_function` أثناء وجوده. وبالتالي، بالإضافة إلى تحديد عدد أولي من سلاسل الرسائل عند الإنشاء، يمكن استدعاء `napi_acquire_threadsafe_function` للإشارة إلى أن سلسلة رسائل جديدة ستبدأ في استخدام الدالة الآمنة مؤشرًا. وبالمثل، يمكن استدعاء `napi_release_threadsafe_function` للإشارة إلى أن سلسلة رسائل موجودة ستتوقف عن استخدام الدالة الآمنة مؤشرًا.

يتم تدمير عناصر `napi_threadsafe_function` عندما تستدعي كل سلسلة رسائل تستخدم العنصر `napi_release_threadsafe_function()` أو تتلقى حالة إرجاع `napi_closing` استجابةً لاستدعاء `napi_call_threadsafe_function`. يتم إفراغ قائمة الانتظار قبل تدمير `napi_threadsafe_function`. يجب أن يكون `napi_release_threadsafe_function()` هو آخر استدعاء API يتم إجراؤه جنبًا إلى جنب مع `napi_threadsafe_function` معينة، لأنه بعد اكتمال الاستدعاء، لا يوجد ضمان بأن `napi_threadsafe_function` لا تزال مخصصة. للسبب نفسه، لا تستخدم دالة آمنة مؤشرًا بعد تلقي قيمة إرجاع `napi_closing` استجابةً لاستدعاء `napi_call_threadsafe_function`. يمكن تحرير البيانات المرتبطة بـ `napi_threadsafe_function` في رد الاتصال `napi_finalize` الخاص بها والذي تم تمريره إلى `napi_create_threadsafe_function()`. تحدد المعلمة `initial_thread_count` لـ `napi_create_threadsafe_function` العدد الأولي لعمليات الاستحواذ على الدوال الآمنة مؤشرًا، بدلاً من استدعاء `napi_acquire_threadsafe_function` عدة مرات عند الإنشاء.

بمجرد أن يصل عدد سلاسل الرسائل التي تستخدم `napi_threadsafe_function` إلى الصفر، لا يمكن لأي سلاسل رسائل أخرى أن تبدأ في استخدامها عن طريق استدعاء `napi_acquire_threadsafe_function()`. في الواقع، ستعيد جميع استدعاءات API اللاحقة المرتبطة بها، باستثناء `napi_release_threadsafe_function()`، قيمة خطأ `napi_closing`.

يمكن "إجهاض" الدالة الآمنة مؤشرًا عن طريق إعطاء قيمة `napi_tsfn_abort` إلى `napi_release_threadsafe_function()`. سيؤدي ذلك إلى إعادة جميع واجهات برمجة التطبيقات اللاحقة المرتبطة بالدالة الآمنة مؤشرًا باستثناء `napi_release_threadsafe_function()` إلى `napi_closing` حتى قبل أن يصل عدد المراجع الخاص بها إلى الصفر. على وجه الخصوص، ستعيد `napi_call_threadsafe_function()` قيمة `napi_closing`، وبالتالي إعلام سلاسل الرسائل بأنه لم يعد من الممكن إجراء مكالمات غير متزامنة إلى الدالة الآمنة مؤشرًا. يمكن استخدام هذا كمعيار لإنهاء سلسلة الرسائل. **عند تلقي قيمة إرجاع
<code>napi_closing</code> من <code>napi_call_threadsafe_function()</code>، يجب ألا تستخدم سلسلة الرسائل
الدالة الآمنة مؤشرًا بعد الآن لأنه لم يعد مضمونًا
أنه تم تخصيصه.**


### تحديد ما إذا كان يجب إبقاء العملية قيد التشغيل {#deciding-whether-to-keep-the-process-running}

على غرار معالجات libuv، يمكن "الإشارة" إلى الدوال الآمنة مؤشرات الترابط و "إلغاء الإشارة" إليها. ستتسبب الدالة الآمنة مؤشرات الترابط "المشار إليها" في بقاء حلقة الأحداث على مؤشر الترابط الذي تم إنشاؤها عليه حية حتى يتم تدمير الدالة الآمنة مؤشرات الترابط. في المقابل، لن تمنع الدالة الآمنة مؤشرات الترابط "غير المشار إليها" حلقة الأحداث من الخروج. توجد واجهات برمجة التطبيقات `napi_ref_threadsafe_function` و `napi_unref_threadsafe_function` لهذا الغرض.

لا يحدد `napi_unref_threadsafe_function` الدوال الآمنة مؤشرات الترابط على أنها قابلة للتدمير ولا يمنع `napi_ref_threadsafe_function` تدميرها.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 12.6.0، الإصدار 10.17.0 | تم جعل المعلمة `func` اختيارية مع `call_js_cb` مخصصة. |
| الإصدار 10.6.0 | تمت إضافته في: الإصدار 10.6.0 |
:::

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات بموجبها.
- `[in] func`: دالة JavaScript اختيارية للاتصال بها من مؤشر ترابط آخر. يجب توفيرها إذا تم تمرير `NULL` إلى `call_js_cb`.
- `[in] async_resource`: كائن اختياري مرتبط بالعمل غير المتزامن الذي سيتم تمريره إلى `async_hooks` المحتملة [`init` hooks](/ar/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: سلسلة JavaScript لتوفير معرف لنوع المورد الذي يتم توفيره لمعلومات التشخيص التي تعرضها واجهة برمجة التطبيقات `async_hooks`.
- `[in] max_queue_size`: الحد الأقصى لحجم قائمة الانتظار. `0` بدون حد.
- `[in] initial_thread_count`: العدد الأولي لعمليات الاستحواذ، أي العدد الأولي للمؤشرات الترابطية، بما في ذلك المؤشر الترابطي الرئيسي، الذي سيستخدم هذه الدالة.
- `[in] thread_finalize_data`: بيانات اختيارية ليتم تمريرها إلى `thread_finalize_cb`.
- `[in] thread_finalize_cb`: دالة اختيارية للاتصال بها عند تدمير `napi_threadsafe_function`.
- `[in] context`: بيانات اختيارية لإرفاقها بـ `napi_threadsafe_function` الناتج.
- `[in] call_js_cb`: رد اتصال اختياري يستدعي دالة JavaScript استجابةً لطلب في مؤشر ترابط مختلف. سيتم استدعاء رد الاتصال هذا في المؤشر الترابطي الرئيسي. إذا لم يتم تقديمه، فسيتم استدعاء دالة JavaScript بدون معلمات ومع `undefined` كقيمة `this` الخاصة بها. [`napi_threadsafe_function_call_js`](/ar/nodejs/api/n-api#napi_threadsafe_function_call_js) يوفر المزيد من التفاصيل.
- `[out] result`: دالة JavaScript غير متزامنة وآمنة مؤشرات الترابط.

**سجل التغييرات:**

- تجريبي (تم تعريف `NAPI_EXPERIMENTAL`): يتم التعامل مع الاستثناءات غير الملتقطة التي يتم طرحها في `call_js_cb` باستخدام حدث [`'uncaughtException'`](/ar/nodejs/api/process#event-uncaughtexception)، بدلاً من تجاهلها.


### ‏`napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**تمت الإضافة في: الإصدار v10.6.0**

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- ‏`[in] func`: الدالة الآمنة للخيوط التي سيتم استرداد السياق لها.
- ‏`[out] result`: الموقع الذي سيتم فيه تخزين السياق.

يمكن استدعاء هذا API من أي خيط يستخدم ‏`func`.

### ‏`napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v14.5.0 | تم إرجاع دعم ‏`napi_would_deadlock`. |
| v14.1.0 | إرجاع ‏`napi_would_deadlock` عند الاستدعاء مع ‏`napi_tsfn_blocking` من الخيط الرئيسي أو خيط العامل والصف ممتلئ. |
| v10.6.0 | تمت الإضافة في: الإصدار v10.6.0 |
:::

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- ‏`[in] func`: دالة JavaScript غير المتزامنة الآمنة للخيوط التي سيتم استدعاؤها.
- ‏`[in] data`: البيانات التي سيتم إرسالها إلى JavaScript عبر رد الاتصال ‏`call_js_cb` المتوفر أثناء إنشاء دالة JavaScript الآمنة للخيوط.
- ‏`[in] is_blocking`: علامة يمكن أن تكون قيمتها إما ‏`napi_tsfn_blocking` للإشارة إلى أن الاستدعاء يجب أن يحظر إذا كان الصف ممتلئًا أو ‏`napi_tsfn_nonblocking` للإشارة إلى أن الاستدعاء يجب أن يعود على الفور بحالة ‏`napi_queue_full` متى كان الصف ممتلئًا.

لا يجب استدعاء هذا API مع ‏`napi_tsfn_blocking` من خيط JavaScript، لأنه، إذا كان الصف ممتلئًا، فقد يتسبب في حدوث توقف تام لخيط JavaScript.

سيعيد هذا API ‏`napi_closing` إذا تم استدعاء ‏`napi_release_threadsafe_function()` مع تعيين ‏`abort` على ‏`napi_tsfn_abort` من أي خيط. تتم إضافة القيمة فقط إلى الصف إذا أعاد API ‏`napi_ok`.

يمكن استدعاء هذا API من أي خيط يستخدم ‏`func`.

### ‏`napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**تمت الإضافة في: الإصدار v10.6.0**

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- ‏`[in] func`: دالة JavaScript غير المتزامنة الآمنة للخيوط لبدء استخدامها.

يجب أن يستدعي الخيط هذا API قبل تمرير ‏`func` إلى أي APIs أخرى آمنة للخيوط للإشارة إلى أنه سيستخدم ‏`func`. يمنع هذا تدمير ‏`func` عندما تتوقف جميع الخيوط الأخرى عن استخدامه.

يمكن استدعاء هذا API من أي خيط سيبدأ في استخدام ‏`func`.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**أضيف في: الإصدار v10.6.0**

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: دالة JavaScript غير متزامنة وآمنة لسلاسل العمليات سيتم تخفيض عدد مراجعها.
- `[in] mode`: علامة يمكن أن تكون قيمتها إما `napi_tsfn_release` للإشارة إلى أن سلسلة العمليات الحالية لن تجري أي مكالمات أخرى للدالة الآمنة لسلاسل العمليات، أو `napi_tsfn_abort` للإشارة إلى أنه بالإضافة إلى سلسلة العمليات الحالية، لا ينبغي لأي سلسلة عمليات أخرى إجراء أي مكالمات أخرى للدالة الآمنة لسلاسل العمليات. إذا تم تعيينها على `napi_tsfn_abort`، فسترجع المكالمات الأخرى إلى `napi_call_threadsafe_function()` قيمة `napi_closing`، ولن يتم وضع أي قيم أخرى في قائمة الانتظار.

يجب على سلسلة العمليات استدعاء واجهة برمجة التطبيقات (API) هذه عندما تتوقف عن استخدام `func`. تمرير `func` إلى أي واجهات برمجة تطبيقات آمنة لسلاسل العمليات بعد استدعاء واجهة برمجة التطبيقات (API) هذه له نتائج غير محددة، حيث قد تكون `func` قد تم تدميرها.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه من أي سلسلة عمليات ستتوقف عن استخدام `func`.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**أضيف في: الإصدار v10.6.0**

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] func`: الدالة الآمنة لسلاسل العمليات المراد الإشارة إليها.

تُستخدم واجهة برمجة التطبيقات (API) هذه للإشارة إلى أن حلقة الأحداث التي تعمل على سلسلة العمليات الرئيسية يجب ألا تخرج حتى يتم تدمير `func`. على غرار [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref) فهي أيضًا عديمة التأثير.

لا تحدد `napi_unref_threadsafe_function` الدوال الآمنة لسلاسل العمليات على أنها قابلة للتدمير ولا تمنع `napi_ref_threadsafe_function` تدميرها. `napi_acquire_threadsafe_function` و `napi_release_threadsafe_function` متاحتان لهذا الغرض.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه فقط من سلسلة العمليات الرئيسية.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**أضيف في: الإصدار v10.6.0**

**إصدار N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[in] func`: الدالة الآمنة لسلاسل العمليات المراد إلغاء الإشارة إليها.

تُستخدم واجهة برمجة التطبيقات (API) هذه للإشارة إلى أن حلقة الأحداث التي تعمل على سلسلة العمليات الرئيسية قد تخرج قبل تدمير `func`. على غرار [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref) فهي أيضًا عديمة التأثير.

يمكن استدعاء واجهة برمجة التطبيقات (API) هذه فقط من سلسلة العمليات الرئيسية.


## أدوات متنوعة {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**تمت إضافته في: v15.9.0, v14.18.0, v12.22.0**

**إصدار N-API: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: البيئة التي يتم استدعاء واجهة برمجة التطبيقات (API) ضمنها.
- `[out] result`: عنوان URL يحتوي على المسار المطلق للموقع الذي تم تحميل الوظيفة الإضافية منه. بالنسبة لملف على نظام الملفات المحلي، سيبدأ بـ `file://`. السلسلة منتهية بـ null ومملوكة لـ `env` وبالتالي يجب عدم تعديلها أو تحريرها.

قد تكون `result` سلسلة فارغة إذا فشلت عملية تحميل الوظيفة الإضافية في تحديد اسم ملف الوظيفة الإضافية أثناء التحميل.

