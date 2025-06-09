---
title: توثيق Corepack في Node.js
description: Corepack هو ملف ثنائي يتم شحنه مع Node.js، ويوفر واجهة معيارية لإدارة مديري الحزم مثل npm و pnpm و Yarn. يتيح للمستخدمين التبديل بسهولة بين مديري الحزم والإصدارات المختلفة، مما يضمن التوافق ويبسط سير العمل في التطوير.
head:
  - - meta
    - name: og:title
      content: توثيق Corepack في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack هو ملف ثنائي يتم شحنه مع Node.js، ويوفر واجهة معيارية لإدارة مديري الحزم مثل npm و pnpm و Yarn. يتيح للمستخدمين التبديل بسهولة بين مديري الحزم والإصدارات المختلفة، مما يضمن التوافق ويبسط سير العمل في التطوير.
  - - meta
    - name: twitter:title
      content: توثيق Corepack في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack هو ملف ثنائي يتم شحنه مع Node.js، ويوفر واجهة معيارية لإدارة مديري الحزم مثل npm و pnpm و Yarn. يتيح للمستخدمين التبديل بسهولة بين مديري الحزم والإصدارات المختلفة، مما يضمن التوافق ويبسط سير العمل في التطوير.
---


# Corepack {#corepack}

**أُضيف في: v16.9.0، v14.19.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* هي أداة تجريبية للمساعدة في إدارة إصدارات مديري الحزم الخاصين بك. وهي تعرض وكلاء ثنائيين لكل [مدير حزم مدعوم](/ar/nodejs/api/corepack#supported-package-managers) والذي، عند استدعائه، سيحدد مدير الحزم الذي تم تكوينه للمشروع الحالي، ويقوم بتنزيله إذا لزم الأمر، ثم يقوم بتشغيله أخيرًا.

على الرغم من أن Corepack يتم توزيعه مع عمليات التثبيت الافتراضية لـ Node.js، إلا أن مديري الحزم الذين تديرهم Corepack ليسوا جزءًا من توزيع Node.js و:

- عند الاستخدام الأول، يقوم Corepack بتنزيل أحدث إصدار من الشبكة.
- أي تحديثات مطلوبة (تتعلق بالثغرات الأمنية أو غير ذلك) تقع خارج نطاق مشروع Node.js. إذا لزم الأمر، يجب على المستخدمين النهائيين معرفة كيفية التحديث بمفردهم.

تُبسط هذه الميزة سير العمل الأساسي التالي:

- تسهل إعداد المساهمين الجدد، حيث لن يضطروا بعد الآن إلى اتباع عمليات تثبيت خاصة بالنظام لمجرد الحصول على مدير الحزم الذي تريده.
- يسمح لك بالتأكد من أن كل فرد في فريقك سيستخدم بالضبط إصدار مدير الحزم الذي تنوي استخدامه، دون الحاجة إلى مزامنته يدويًا في كل مرة تحتاج فيها إلى إجراء تحديث.

## سير العمل {#workflows}

### تمكين الميزة {#enabling-the-feature}

نظرًا لحالتها التجريبية، تحتاج Corepack حاليًا إلى تمكينها بشكل صريح ليكون لها أي تأثير. للقيام بذلك، قم بتشغيل [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name)، والذي سيقوم بإعداد الروابط الرمزية في بيئتك بجوار الثنائي `node` (وسيستبدل الروابط الرمزية الموجودة إذا لزم الأمر).

من هذه النقطة فصاعدًا، سيعمل أي استدعاء لل[ثنائيات المدعومة](/ar/nodejs/api/corepack#supported-package-managers) دون مزيد من الإعداد. إذا واجهت مشكلة، فقم بتشغيل [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) لإزالة الوكلاء من نظامك (وفكر في فتح مشكلة على [مستودع Corepack](https://github.com/nodejs/corepack) لإعلامنا).


### تهيئة الحزمة {#configuring-a-package}

ستجد وكلاء Corepack أقرب ملف [`package.json`](/ar/nodejs/api/packages#nodejs-packagejson-field-definitions) في التسلسل الهرمي للدليل الحالي لاستخراج الخاصية [`"packageManager"`](/ar/nodejs/api/packages#packagemanager) منه.

إذا كانت القيمة تتوافق مع [مدير حزم مدعوم](/ar/nodejs/api/corepack#supported-package-managers)، فستتأكد Corepack من أن جميع المكالمات إلى الثنائيات ذات الصلة يتم تشغيلها مقابل الإصدار المطلوب، وتنزيله عند الطلب إذا لزم الأمر، والإجهاض إذا تعذر استرداده بنجاح.

يمكنك استخدام [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) لمطالبة Corepack بتحديث ملف `package.json` المحلي لاستخدام مدير الحزم الذي تختاره:

```bash [BASH]
corepack use  # يعيّن أحدث إصدار 7.x في ملف package.json
corepack use yarn@* # يعيّن أحدث إصدار في ملف package.json
```
### ترقية الإصدارات العامة {#upgrading-the-global-versions}

عند التشغيل خارج مشروع موجود (على سبيل المثال عند تشغيل `yarn init`)، ستستخدم Corepack بشكل افتراضي إصدارات محددة مسبقًا تتوافق تقريبًا مع أحدث الإصدارات المستقرة من كل أداة. يمكن تجاوز هذه الإصدارات عن طريق تشغيل الأمر [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) مع إصدار مدير الحزم الذي ترغب في تعيينه:

```bash [BASH]
corepack install --global 
```
بدلاً من ذلك، يمكن استخدام علامة أو نطاق:

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### سير العمل دون اتصال بالإنترنت {#offline-workflow}

العديد من بيئات الإنتاج ليس لديها وصول إلى الشبكة. نظرًا لأن Corepack عادةً ما تقوم بتنزيل إصدارات مدير الحزم مباشرةً من سجلاتهم، فقد يتعارض ذلك مع هذه البيئات. لتجنب حدوث ذلك، قم باستدعاء الأمر [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) أثناء استمرار اتصالك بالشبكة (عادةً في نفس الوقت الذي تقوم فيه بإعداد صورة النشر الخاصة بك). سيضمن ذلك توفر مديري الحزم المطلوبين حتى بدون الوصول إلى الشبكة.

يحتوي الأمر `pack` على [علامات مختلفة](https://github.com/nodejs/corepack#utility-commands). راجع [وثائق Corepack](https://github.com/nodejs/corepack#readme) التفصيلية لمزيد من المعلومات.


## مدراء الحزم المدعومون {#supported-package-managers}

يتم توفير الثنائيات التالية من خلال Corepack:

| مدير الحزم | أسماء الثنائيات |
|---|---|
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## أسئلة شائعة {#common-questions}

### كيف يتفاعل Corepack مع npm؟ {#how-does-corepack-interact-with-npm?}

بينما يمكن لـ Corepack دعم npm مثل أي مدير حزم آخر، إلا أن أدوات التعبئة الخاصة به غير مفعلة افتراضيًا. وهذا له بعض العواقب:

- من الممكن دائمًا تشغيل أمر `npm` داخل مشروع مهيأ للاستخدام مع مدير حزم آخر، حيث لا يمكن لـ Corepack اعتراضه.
- في حين أن `npm` هو خيار صالح في خاصية [`"packageManager"`](/ar/nodejs/api/packages#packagemanager)، فإن عدم وجود أداة تعبئة سيؤدي إلى استخدام npm العام.

### تشغيل `npm install -g yarn` لا يعمل {#running-npm-install--g-yarn-doesnt-work}

يمنع npm تجاوز ثنائيات Corepack عن طريق الخطأ عند إجراء تثبيت عام. لتجنب هذه المشكلة، ضع في اعتبارك أحد الخيارات التالية:

- لا تقم بتشغيل هذا الأمر؛ ستوفر Corepack ثنائيات مدير الحزم على أي حال وستضمن أن الإصدارات المطلوبة متاحة دائمًا، لذلك ليست هناك حاجة لتثبيت مديري الحزم بشكل صريح.
- أضف العلامة `--force` إلى `npm install` ؛ سيخبر هذا npm أنه لا بأس في تجاوز الثنائيات، ولكنك ستمحو ثنائيات Corepack في هذه العملية. (قم بتشغيل [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) لإضافتها مرة أخرى.)

