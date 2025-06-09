---
title: Node.js مع TypeScript
description: تعلم كيفية استخدام TypeScript مع Node.js، بما في ذلك فوائده، والتثبيت، والاستخدام. اكتشف كيفية تجميع وتشغيل شيفرة TypeScript، واستكشف ميزاته وأدواته.
head:
  - - meta
    - name: og:title
      content: Node.js مع TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية استخدام TypeScript مع Node.js، بما في ذلك فوائده، والتثبيت، والاستخدام. اكتشف كيفية تجميع وتشغيل شيفرة TypeScript، واستكشف ميزاته وأدواته.
  - - meta
    - name: twitter:title
      content: Node.js مع TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية استخدام TypeScript مع Node.js، بما في ذلك فوائده، والتثبيت، والاستخدام. اكتشف كيفية تجميع وتشغيل شيفرة TypeScript، واستكشف ميزاته وأدواته.
---


# Node.js مع TypeScript

## ما هو TypeScript

[TypeScript](https://www.typescriptlang.org) هي لغة مفتوحة المصدر يتم صيانتها وتطويرها بواسطة Microsoft. إنها محبوبة وتستخدم من قبل الكثير من مطوري البرامج في جميع أنحاء العالم.

بشكل أساسي، هي مجموعة شاملة من JavaScript تضيف إمكانات جديدة إلى اللغة. الإضافة الأبرز هي تعريفات النوع الثابت، وهو شيء غير موجود في JavaScript العادية. بفضل الأنواع، من الممكن، على سبيل المثال، تحديد نوع الوسائط التي نتوقعها وما يتم إرجاعه بالضبط في وظائفنا أو ما هو الشكل الدقيق للكائن الذي نقوم بإنشائه. TypeScript هي أداة قوية حقًا وتفتح عالمًا جديدًا من الاحتمالات في مشاريع JavaScript. إنها تجعل الكود الخاص بنا أكثر أمانًا وقوة من خلال منع العديد من الأخطاء قبل حتى شحن الكود - فهي تكتشف المشكلات أثناء تطوير الكود وتتكامل بشكل رائع مع محررات التعليمات البرمجية مثل Visual Studio Code.

يمكننا التحدث عن فوائد TypeScript الأخرى لاحقًا، دعنا نرى بعض الأمثلة الآن!

### أمثلة

ألق نظرة على مقتطف الكود هذا ثم يمكننا تفكيكه معًا:

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 23,
}
const isJustineAnAdult: boolean = isAdult(justine)
```

الجزء الأول (مع الكلمة الأساسية `type`) مسؤول عن الإعلان عن نوع الكائن المخصص الخاص بنا الذي يمثل المستخدمين. في وقت لاحق، نستخدم هذا النوع الذي تم إنشاؤه حديثًا لإنشاء وظيفة `isAdult` التي تقبل وسيطة واحدة من النوع `User` وترجع `boolean`. بعد ذلك، نقوم بإنشاء `justine`، بيانات المثال الخاصة بنا التي يمكن استخدامها لاستدعاء الوظيفة المحددة مسبقًا. أخيرًا، نقوم بإنشاء متغير جديد بمعلومات حول ما إذا كانت `justine` بالغًا.

هناك أشياء إضافية حول هذا المثال يجب أن تعرفها. أولاً، إذا لم نلتزم بالأنواع المعلنة، فستنبهنا TypeScript إلى وجود خطأ ما وتمنع إساءة الاستخدام. ثانيًا، ليس كل شيء يجب أن يكون مكتوبًا صراحةً - TypeScript ذكية جدًا ويمكنها استنتاج الأنواع لنا. على سبيل المثال، سيكون المتغير `isJustineAnAdult` من النوع boolean حتى لو لم نكتبه صراحةً أو `justine` سيكون وسيطة صالحة لوظيفتنا حتى لو لم نعلن عن هذا المتغير من النوع `User`.

حسنًا، لدينا بعض كود TypeScript. الآن كيف يمكننا تشغيله؟

**أول شيء يجب القيام به هو تثبيت TypeScript في مشروعنا:**

```bash
npm install -D typescript
```

الآن يمكننا تجميعه إلى JavaScript باستخدام الأمر `tsc` في المحطة الطرفية. هيا بنا نفعل ذلك!

**بافتراض أن اسم ملفنا هو `example.ts`، فسيبدو الأمر كما يلي:**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) هنا تعني Node Package Execute. تتيح لنا هذه الأداة تشغيل مترجم TypeScript دون تثبيته عالميًا.**
:::

`tsc` هو مترجم TypeScript الذي سيأخذ كود TypeScript الخاص بنا ويجمعه إلى JavaScript. سيؤدي هذا الأمر إلى إنشاء ملف جديد باسم `example.js` يمكننا تشغيله باستخدام Node.js. الآن بعد أن عرفنا كيفية تجميع وتشغيل كود TypeScript، دعنا نرى إمكانات TypeScript في منع الأخطاء أثناء العمل!

**إليك كيفية تعديل الكود الخاص بنا:**

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 'Secret!',
}
const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!")
```

**وهذا ما يجب أن تقوله TypeScript عن هذا:**

```bash
example.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
12     age: 'Secret!',
       ~~~
  example.ts:3:5
    3     age: number;
          ~~~
    The expected type comes from property 'age' which is declared here on type 'User'
example.ts:15:7 - error TS2322: Type 'boolean' is not assignable to type 'string'.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
         ~~~~~~~~~~~~~~~~
example.ts:15:51 - error TS2554: Expected 1 arguments, but got 2.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
                                                     ~~~~~~~~~~~~~~~~~~~~~~
Found 3 errors in the same file, starting at: example.ts:12
```

كما ترون، تمنعنا TypeScript بنجاح من شحن التعليمات البرمجية التي قد تعمل بشكل غير متوقع. هذا رائع!


## المزيد عن TypeScript

تقدم TypeScript مجموعة كبيرة من الآليات الرائعة الأخرى مثل الواجهات والفئات وأنواع الأدوات المساعدة وما إلى ذلك. أيضًا، في المشاريع الأكبر حجمًا، يمكنك الإعلان عن تكوين محول TypeScript الخاص بك في ملف منفصل وتعديل كيفية عمله بدقة ومدى دقته والمكان الذي يخزن فيه الملفات المترجمة على سبيل المثال. يمكنك قراءة المزيد عن كل هذه الأشياء الرائعة في [وثائق TypeScript الرسمية](https://www.typescriptlang.org/docs).

بعض الفوائد الأخرى لـ TypeScript التي تستحق الذكر هي أنه يمكن اعتمادها تدريجيًا، فهي تساعد في جعل التعليمات البرمجية أكثر قابلية للقراءة والفهم وتسمح للمطورين باستخدام ميزات اللغة الحديثة أثناء شحن التعليمات البرمجية لإصدارات Node.js الأقدم.

## تشغيل كود TypeScript في Node.js

لا يمكن لـ Node.js تشغيل TypeScript أصليًا. لا يمكنك استدعاء `node example.ts` من سطر الأوامر مباشرةً. ولكن هناك ثلاثة حلول لهذه المشكلة:

### تجميع TypeScript إلى JavaScript

إذا كنت ترغب في تشغيل كود TypeScript في Node.js، فأنت بحاجة إلى تجميعه إلى JavaScript أولاً. يمكنك القيام بذلك باستخدام محول TypeScript `tsc` كما هو موضح سابقًا.

إليك مثال صغير:

```bash
npx tsc example.ts
node example.js
```

### تشغيل كود TypeScript باستخدام `ts-node`

يمكنك استخدام [ts-node](https://www.npmjs.com/package/ts-node) لتشغيل كود TypeScript مباشرةً في Node.js دون الحاجة إلى تجميعه أولاً. لكنه لا يتحقق من نوع التعليمات البرمجية الخاصة بك. لذلك نوصي بالتحقق من نوع التعليمات البرمجية الخاصة بك أولاً باستخدام `tsc` ثم تشغيلها باستخدام `ts-node` قبل شحنها.

لاستخدام `ts-node`، تحتاج إلى تثبيته أولاً:

````bash
npm install -D ts-node
````

ثم يمكنك تشغيل كود TypeScript الخاص بك هكذا:

```bash
npx ts-node example.ts
````

### تشغيل كود TypeScript باستخدام `tsx`

يمكنك استخدام [tsx](https://www.npmjs.com/package/tsx) لتشغيل كود TypeScript مباشرةً في Node.js دون الحاجة إلى تجميعه أولاً. لكنه لا يتحقق من نوع التعليمات البرمجية الخاصة بك. لذلك نوصي بالتحقق من نوع التعليمات البرمجية الخاصة بك أولاً باستخدام `tsc` ثم تشغيلها باستخدام `tsx` قبل شحنها.

لاستخدام tsx، تحتاج إلى تثبيته أولاً:

```bash
npm install -D tsx
```

ثم يمكنك تشغيل كود TypeScript الخاص بك هكذا:

```bash
npx tsx example.ts
```

إذا كنت ترغب في استخدام `tsx` عبر `node`، يمكنك تسجيل `tsx` عبر `--import`:

```bash
node --import=tsx example.ts
```


## TypeScript في عالم Node.js

لقد ترسخت TypeScript في عالم Node.js وتستخدمها العديد من الشركات والمشاريع مفتوحة المصدر والأدوات والأطر. بعض الأمثلة البارزة للمشاريع مفتوحة المصدر التي تستخدم TypeScript هي:

- [NestJS](https://nestjs.com) - إطار عمل قوي وكامل الميزات يجعل إنشاء أنظمة قابلة للتطوير ومصممة بشكل جيد أمرًا سهلاً وممتعًا
- [TypeORM](https://typeorm.io) - ORM رائع متأثر بأدوات أخرى معروفة من لغات أخرى مثل Hibernate أو Doctrine أو Entity Framework
- [Prisma](https://prisma.io) - ORM من الجيل التالي يتميز بنموذج بيانات تعريفي وترحيلات تم إنشاؤها واستعلامات قاعدة بيانات آمنة تمامًا من حيث النوع
- [RxJS](https://rxjs.dev) - مكتبة مستخدمة على نطاق واسع للبرمجة التفاعلية
- [AdonisJS](https://adonisjs.com) - إطار عمل ويب كامل الميزات مع Node.js
- [FoalTs](https://foal.dev) - إطار عمل Nodejs الأنيق

والعديد والعديد من المشاريع الرائعة الأخرى... ربما حتى مشروعك القادم!

