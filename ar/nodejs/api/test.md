---
title: توثيق Node.js - Test Runner
description: توفر وحدة Test Runner في Node.js حلاً مدمجًا لكتابة وتشغيل الاختبارات داخل تطبيقات Node.js. تدعم تنسيقات اختبارات متنوعة، وتقارير التغطية، والتكامل مع أطر الاختبار الشهيرة.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - Test Runner | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر وحدة Test Runner في Node.js حلاً مدمجًا لكتابة وتشغيل الاختبارات داخل تطبيقات Node.js. تدعم تنسيقات اختبارات متنوعة، وتقارير التغطية، والتكامل مع أطر الاختبار الشهيرة.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - Test Runner | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر وحدة Test Runner في Node.js حلاً مدمجًا لكتابة وتشغيل الاختبارات داخل تطبيقات Node.js. تدعم تنسيقات اختبارات متنوعة، وتقارير التغطية، والتكامل مع أطر الاختبار الشهيرة.
---


# مُشَغِّل الاختبار {#test-runner}

::: info [التاريخ]
| الإصدار | التغييرات |
|---|---|
| v20.0.0 | مُشَغِّل الاختبار الآن مستقر. |
| v18.0.0, v16.17.0 | تمت إضافته في: v18.0.0, v16.17.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**الكود المصدري:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

تُسهِّل وحدة `node:test` إنشاء اختبارات JavaScript. للوصول إليها:

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

هذه الوحدة متاحة فقط ضمن نظام `node:`.

تتكون الاختبارات التي تم إنشاؤها عبر وحدة `test` من دالة واحدة تتم معالجتها بإحدى ثلاث طرق:

يوضح المثال التالي كيفية كتابة الاختبارات باستخدام وحدة `test`.

```js [ESM]
test('اختبار تمرير متزامن', (t) => {
  // ينجح هذا الاختبار لأنه لا يطرح استثناءً.
  assert.strictEqual(1, 1);
});

test('اختبار فشل متزامن', (t) => {
  // يفشل هذا الاختبار لأنه يطرح استثناءً.
  assert.strictEqual(1, 2);
});

test('اختبار تمرير غير متزامن', async (t) => {
  // ينجح هذا الاختبار لأن الوعد الذي تم إرجاعه بواسطة الدالة غير المتزامنة
  // قد تم تسويته ولم يتم رفضه.
  assert.strictEqual(1, 1);
});

test('اختبار فشل غير متزامن', async (t) => {
  // يفشل هذا الاختبار لأن الوعد الذي تم إرجاعه بواسطة الدالة غير المتزامنة
  // قد تم رفضه.
  assert.strictEqual(1, 2);
});

test('اختبار فاشل باستخدام الوعود', (t) => {
  // يمكن استخدام الوعود مباشرة أيضًا.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('سيتسبب هذا في فشل الاختبار'));
    });
  });
});

test('اختبار تمرير رد نداء', (t, done) => {
  // done() هي دالة رد النداء. عندما يتم تشغيل setImmediate()، فإنها تستدعي
  // done() بدون وسائط.
  setImmediate(done);
});

test('اختبار فشل رد نداء', (t, done) => {
  // عندما يتم تشغيل setImmediate()، يتم استدعاء done() بكائن خطأ و
  // يفشل الاختبار.
  setImmediate(() => {
    done(new Error('فشل رد النداء'));
  });
});
```
إذا فشلت أي اختبارات، فسيتم تعيين رمز خروج العملية إلى `1`.


## الاختبارات الفرعية {#subtests}

تسمح طريقة `test()` في سياق الاختبار بإنشاء اختبارات فرعية. فهي تسمح لك بتنظيم اختباراتك بطريقة هرمية، حيث يمكنك إنشاء اختبارات متداخلة داخل اختبار أكبر. تتصرف هذه الطريقة بشكل مماثل لوظيفة `test()` ذات المستوى الأعلى. يوضح المثال التالي إنشاء اختبار على مستوى أعلى مع اختبارين فرعيين.

```js [ESM]
test('اختبار المستوى الأعلى', async (t) => {
  await t.test('الاختبار الفرعي 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('الاختبار الفرعي 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
في هذا المثال، يتم استخدام `await` للتأكد من اكتمال كلا الاختبارين الفرعيين. هذا ضروري لأن الاختبارات لا تنتظر اكتمال اختباراتها الفرعية، على عكس الاختبارات التي تم إنشاؤها داخل المجموعات. يتم إلغاء أي اختبارات فرعية لا تزال معلقة عند انتهاء الاختبار الأصل، وتعتبر فاشلة. أي فشل في الاختبارات الفرعية يتسبب في فشل الاختبار الأصل.

## تخطي الاختبارات {#skipping-tests}

يمكن تخطي الاختبارات الفردية عن طريق تمرير خيار `skip` إلى الاختبار، أو عن طريق استدعاء طريقة `skip()` في سياق الاختبار كما هو موضح في المثال التالي.

```js [ESM]
// يتم استخدام خيار التخطي، ولكن لم يتم تقديم أي رسالة.
test('خيار التخطي', { skip: true }, (t) => {
  // لن يتم تنفيذ هذا الكود.
});

// يتم استخدام خيار التخطي، ويتم تقديم رسالة.
test('خيار التخطي مع رسالة', { skip: 'تم تخطي هذا' }, (t) => {
  // لن يتم تنفيذ هذا الكود.
});

test('طريقة skip()', (t) => {
  // تأكد من العودة هنا أيضًا إذا كان الاختبار يحتوي على منطق إضافي.
  t.skip();
});

test('طريقة skip() مع رسالة', (t) => {
  // تأكد من العودة هنا أيضًا إذا كان الاختبار يحتوي على منطق إضافي.
  t.skip('تم تخطي هذا');
});
```
## اختبارات TODO {#todo-tests}

يمكن وضع علامة على الاختبارات الفردية على أنها متقلبة أو غير مكتملة عن طريق تمرير خيار `todo` إلى الاختبار، أو عن طريق استدعاء طريقة `todo()` في سياق الاختبار، كما هو موضح في المثال التالي. تمثل هذه الاختبارات تنفيذًا معلقًا أو خطأ يحتاج إلى إصلاح. يتم تنفيذ اختبارات TODO، ولكن لا يتم التعامل معها على أنها حالات فشل في الاختبار، وبالتالي لا تؤثر على رمز إنهاء العملية. إذا تم وضع علامة على الاختبار على أنه TODO وتم تخطيه في نفس الوقت، فسيتم تجاهل خيار TODO.

```js [ESM]
// يتم استخدام خيار todo، ولكن لم يتم تقديم أي رسالة.
test('خيار todo', { todo: true }, (t) => {
  // يتم تنفيذ هذا الكود، ولكن لا يتم التعامل معه على أنه فشل.
  throw new Error('هذا لا يفشل الاختبار');
});

// يتم استخدام خيار todo، ويتم تقديم رسالة.
test('خيار todo مع رسالة', { todo: 'هذا اختبار todo' }, (t) => {
  // يتم تنفيذ هذا الكود.
});

test('طريقة todo()', (t) => {
  t.todo();
});

test('طريقة todo() مع رسالة', (t) => {
  t.todo('هذا اختبار todo ولا يتم التعامل معه على أنه فشل');
  throw new Error('هذا لا يفشل الاختبار');
});
```

## `describe()` و `it()` أسماء مستعارة {#describe-and-it-aliases}

يمكن أيضًا كتابة المجموعات والاختبارات باستخدام الدالتين `describe()` و `it()`. [`describe()`](/ar/nodejs/api/test#describename-options-fn) هو اسم مستعار لـ [`suite()`](/ar/nodejs/api/test#suitename-options-fn)، و [`it()`](/ar/nodejs/api/test#itname-options-fn) هو اسم مستعار لـ [`test()`](/ar/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('شيء ما', () => {
  it('يجب أن يعمل', () => {
    assert.strictEqual(1, 1);
  });

  it('يجب أن يكون على ما يرام', () => {
    assert.strictEqual(2, 2);
  });

  describe('شيء متداخل', () => {
    it('يجب أن يعمل', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
يتم استيراد `describe()` و `it()` من الوحدة النمطية `node:test`.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## اختبارات `only` {#only-tests}

إذا بدأ Node.js باستخدام خيار سطر الأوامر [`--test-only`](/ar/nodejs/api/cli#--test-only)، أو تم تعطيل عزل الاختبار، فمن الممكن تخطي جميع الاختبارات باستثناء مجموعة فرعية محددة عن طريق تمرير الخيار `only` إلى الاختبارات التي يجب تشغيلها. عند تعيين اختبار بالخيار `only`، يتم تشغيل جميع الاختبارات الفرعية أيضًا. إذا كانت المجموعة تحتوي على الخيار `only`، فسيتم تشغيل جميع الاختبارات داخل المجموعة، إلا إذا كان لديها أحفاد تم تعيين الخيار `only` عليها، وفي هذه الحالة يتم تشغيل هذه الاختبارات فقط.

عند استخدام [الاختبارات الفرعية](/ar/nodejs/api/test#subtests) داخل `test()`/`it()`، فمن الضروري وضع علامة على جميع اختبارات الأصل بالخيار `only` لتشغيل مجموعة فرعية محددة فقط من الاختبارات.

يمكن استخدام طريقة `runOnly()` لسياق الاختبار لتنفيذ نفس السلوك على مستوى الاختبار الفرعي. يتم حذف الاختبارات التي لم يتم تنفيذها من ناتج مشغل الاختبار.

```js [ESM]
// افترض أن Node.js يتم تشغيله باستخدام خيار سطر الأوامر --test-only.
// تم تعيين الخيار 'only' للمجموعة، لذلك يتم تشغيل هذه الاختبارات.
test('يتم تشغيل هذا الاختبار', { only: true }, async (t) => {
  // ضمن هذا الاختبار، يتم تشغيل جميع الاختبارات الفرعية افتراضيًا.
  await t.test('تشغيل اختبار فرعي');

  // يمكن تحديث سياق الاختبار لتشغيل الاختبارات الفرعية بالخيار 'only'.
  t.runOnly(true);
  await t.test('تم تخطي هذا الاختبار الفرعي الآن');
  await t.test('يتم تشغيل هذا الاختبار الفرعي', { only: true });

  // قم بتبديل السياق مرة أخرى لتنفيذ جميع الاختبارات.
  t.runOnly(false);
  await t.test('يتم تشغيل هذا الاختبار الفرعي الآن');

  // لا تقم بتشغيل هذه الاختبارات بشكل صريح.
  await t.test('تم تخطي الاختبار الفرعي 3', { only: false });
  await t.test('تم تخطي الاختبار الفرعي 4', { skip: true });
});

// لم يتم تعيين الخيار 'only'، لذلك يتم تخطي هذا الاختبار.
test('لم يتم تشغيل هذا الاختبار', () => {
  // لم يتم تشغيل هذا الكود.
  throw new Error('فشل');
});

describe('مجموعة', () => {
  // تم تعيين الخيار 'only'، لذلك يتم تشغيل هذا الاختبار.
  it('يتم تشغيل هذا الاختبار', { only: true }, () => {
    // يتم تشغيل هذا الكود.
  });

  it('لم يتم تشغيل هذا الاختبار', () => {
    // لم يتم تشغيل هذا الكود.
    throw new Error('فشل');
  });
});

describe.only('مجموعة', () => {
  // تم تعيين الخيار 'only'، لذلك يتم تشغيل هذا الاختبار.
  it('يتم تشغيل هذا الاختبار', () => {
    // يتم تشغيل هذا الكود.
  });

  it('يتم تشغيل هذا الاختبار', () => {
    // يتم تشغيل هذا الكود.
  });
});
```

## تصفية الاختبارات بالاسم {#filtering-tests-by-name}

يمكن استخدام خيار سطر الأوامر [`--test-name-pattern`](/ar/nodejs/api/cli#--test-name-pattern) لتشغيل الاختبارات التي يتطابق اسمها فقط مع النمط المقدم، ويمكن استخدام الخيار [`--test-skip-pattern`](/ar/nodejs/api/cli#--test-skip-pattern) لتخطي الاختبارات التي يتطابق اسمها مع النمط المقدم. يتم تفسير أنماط أسماء الاختبارات على أنها تعبيرات JavaScript منتظمة. يمكن تحديد الخيارين `--test-name-pattern` و `--test-skip-pattern` عدة مرات لتشغيل الاختبارات المتداخلة. لكل اختبار يتم تنفيذه، يتم أيضًا تشغيل أي خطافات اختبار مقابلة، مثل `beforeEach()`. يتم حذف الاختبارات التي لم يتم تنفيذها من إخراج مشغل الاختبار.

بالنظر إلى ملف الاختبار التالي، سيؤدي بدء تشغيل Node.js باستخدام الخيار `--test-name-pattern="test [1-3]"` إلى قيام مشغل الاختبار بتنفيذ `test 1` و `test 2` و `test 3`. إذا لم يتطابق `test 1` مع نمط اسم الاختبار، فلن يتم تنفيذ اختباراته الفرعية، على الرغم من مطابقتها للنمط. يمكن أيضًا تنفيذ نفس مجموعة الاختبارات عن طريق تمرير `--test-name-pattern` عدة مرات (على سبيل المثال، `--test-name-pattern="test 1"`، `--test-name-pattern="test 2"`، إلخ.).

```js [ESM]
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```
يمكن أيضًا تحديد أنماط أسماء الاختبار باستخدام التعبيرات المنتظمة الحرفية. يتيح ذلك استخدام علامات التعبير المنتظم. في المثال السابق، سيؤدي بدء تشغيل Node.js بـ `--test-name-pattern="/test [4-5]/i"` (أو `--test-skip-pattern="/test [4-5]/i"`) إلى مطابقة `Test 4` و `Test 5` لأن النمط غير حساس لحالة الأحرف.

لمطابقة اختبار واحد بنمط، يمكنك إضافة بادئة إليه بجميع أسماء الاختبار الأصلية مفصولة بمسافة، للتأكد من أنه فريد. على سبيل المثال، بالنظر إلى ملف الاختبار التالي:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
سيؤدي بدء تشغيل Node.js باستخدام `--test-name-pattern="test 1 some test"` إلى مطابقة `some test` فقط في `test 1`.

لا تغير أنماط أسماء الاختبار مجموعة الملفات التي ينفذها مشغل الاختبار.

إذا تم توفير كل من `--test-name-pattern` و `--test-skip-pattern`، فيجب أن تستوفي الاختبارات **كلا** الشرطين ليتم تنفيذها.


## نشاط غير متزامن إضافي {#extraneous-asynchronous-activity}

بمجرد انتهاء وظيفة الاختبار من التنفيذ، يتم الإبلاغ عن النتائج بأسرع ما يمكن مع الحفاظ على ترتيب الاختبارات. ومع ذلك، فمن الممكن أن تولد وظيفة الاختبار نشاطًا غير متزامن يستمر بعد الاختبار نفسه. يتعامل مُشغّل الاختبار مع هذا النوع من النشاط، ولكنه لا يؤخر الإبلاغ عن نتائج الاختبار من أجل استيعابه.

في المثال التالي، يكتمل اختبار مع وجود عمليتين `setImmediate()` لا تزالان معلقتين. تحاول العملية `setImmediate()` الأولى إنشاء اختبار فرعي جديد. نظرًا لأن الاختبار الأصل قد انتهى بالفعل وأخرج نتائجه، يتم على الفور وضع علامة "فشل" على الاختبار الفرعي الجديد، ويتم الإبلاغ عنه لاحقًا إلى [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream).

تقوم العملية `setImmediate()` الثانية بإنشاء حدث `uncaughtException`. يتم وضع علامة "فشل" على أحداث `uncaughtException` و `unhandledRejection` المنبثقة من اختبار مكتمل بواسطة وحدة `test` ويتم الإبلاغ عنها كتحذيرات تشخيصية على المستوى الأعلى بواسطة [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream).

```js [ESM]
test('اختبار يقوم بإنشاء نشاط غير متزامن', (t) => {
  setImmediate(() => {
    t.test('اختبار فرعي تم إنشاؤه متأخرًا جدًا', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // ينتهي الاختبار بعد هذا السطر.
});
```
## وضع المراقبة {#watch-mode}

**تمت الإضافة في: v19.2.0, v18.13.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

يدعم مُشغّل اختبار Node.js التشغيل في وضع المراقبة عن طريق تمرير العلامة `--watch`:

```bash [BASH]
node --test --watch
```
في وضع المراقبة، سيراقب مُشغّل الاختبار التغييرات التي تطرأ على ملفات الاختبار والتبعيات الخاصة بها. عند اكتشاف تغيير، سيعيد مُشغّل الاختبار تشغيل الاختبارات المتأثرة بالتغيير. سيستمر مُشغّل الاختبار في التشغيل حتى يتم إنهاء العملية.

## تشغيل الاختبارات من سطر الأوامر {#running-tests-from-the-command-line}

يمكن استدعاء مُشغّل اختبار Node.js من سطر الأوامر عن طريق تمرير العلامة [`--test`](/ar/nodejs/api/cli#--test):

```bash [BASH]
node --test
```
بشكل افتراضي، سيقوم Node.js بتشغيل جميع الملفات التي تطابق هذه الأنماط:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

عند توفير [`--experimental-strip-types`](/ar/nodejs/api/cli#--experimental-strip-types)، تتم مطابقة الأنماط الإضافية التالية:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

بدلاً من ذلك، يمكن توفير نمط واحد أو أكثر من أنماط glob كوسيطة (وسائط) نهائية لأمر Node.js، كما هو موضح أدناه. تتبع أنماط Glob سلوك [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). يجب تضمين أنماط glob بين علامتي اقتباس مزدوجتين في سطر الأوامر لمنع توسيع shell، مما قد يقلل من إمكانية النقل عبر الأنظمة.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
يتم تنفيذ الملفات المطابقة كملفات اختبار. يمكن العثور على مزيد من المعلومات حول تنفيذ ملف الاختبار في قسم [نموذج تنفيذ مُشغّل الاختبار](/ar/nodejs/api/test#test-runner-execution-model).


### نموذج تنفيذ مُشغِّل الاختبارات {#test-runner-execution-model}

عند تمكين عزل الاختبارات على مستوى العملية، يتم تنفيذ كل ملف اختبار مطابق في عملية فرعية منفصلة. يتم التحكم في الحد الأقصى لعدد العمليات الفرعية التي تعمل في أي وقت بواسطة علامة [`--test-concurrency`](/ar/nodejs/api/cli#--test-concurrency). إذا انتهت العملية الفرعية برمز خروج 0، فيعتبر الاختبار ناجحًا. بخلاف ذلك، يعتبر الاختبار فاشلاً. يجب أن تكون ملفات الاختبار قابلة للتنفيذ بواسطة Node.js، ولكن ليس مطلوبًا استخدام وحدة `node:test` داخليًا.

يتم تنفيذ كل ملف اختبار كما لو كان نصًا برمجيًا عاديًا. أي، إذا كان ملف الاختبار نفسه يستخدم `node:test` لتحديد الاختبارات، فسيتم تنفيذ كل هذه الاختبارات داخل سلسلة عمليات تطبيق واحدة، بغض النظر عن قيمة خيار `concurrency` الخاص بـ [`test()`](/ar/nodejs/api/test#testname-options-fn).

عند تعطيل عزل الاختبارات على مستوى العملية، يتم استيراد كل ملف اختبار مطابق إلى عملية مُشغِّل الاختبارات. بمجرد تحميل جميع ملفات الاختبار، يتم تنفيذ الاختبارات ذات المستوى الأعلى بتزامن واحد. نظرًا لأن جميع ملفات الاختبار يتم تشغيلها داخل نفس السياق، فمن الممكن أن تتفاعل الاختبارات مع بعضها البعض بطرق غير ممكنة عند تمكين العزل. على سبيل المثال، إذا كان الاختبار يعتمد على حالة عامة، فمن الممكن تعديل هذه الحالة بواسطة اختبار صادر من ملف آخر.

## جمع تغطية الكود {#collecting-code-coverage}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index) - تجريبي
:::

عند بدء تشغيل Node.js باستخدام علامة سطر الأوامر [`--experimental-test-coverage`](/ar/nodejs/api/cli#--experimental-test-coverage)، يتم جمع تغطية الكود ويتم الإبلاغ عن الإحصائيات بمجرد اكتمال جميع الاختبارات. إذا تم استخدام متغير البيئة [`NODE_V8_COVERAGE`](/ar/nodejs/api/cli#node_v8_coveragedir) لتحديد دليل تغطية الكود، فسيتم كتابة ملفات تغطية V8 التي تم إنشاؤها في هذا الدليل. بشكل افتراضي، لا يتم تضمين وحدات Node.js الأساسية والملفات الموجودة داخل أدلة `node_modules/` في تقرير التغطية. ومع ذلك، يمكن تضمينها بشكل صريح عبر علامة [`--test-coverage-include`](/ar/nodejs/api/cli#--test-coverage-include). بشكل افتراضي، يتم استبعاد جميع ملفات الاختبار المطابقة من تقرير التغطية. يمكن تجاوز الاستثناءات باستخدام علامة [`--test-coverage-exclude`](/ar/nodejs/api/cli#--test-coverage-exclude). إذا تم تمكين التغطية، يتم إرسال تقرير التغطية إلى أي [مُبلّغ اختبارات](/ar/nodejs/api/test#test-reporters) عبر حدث `'test:coverage'`.

يمكن تعطيل التغطية على سلسلة من الأسطر باستخدام بنية التعليقات التالية:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // لن يتم تنفيذ الكود في هذا الفرع أبدًا، ولكن يتم تجاهل الأسطر لأغراض التغطية. يتم تجاهل جميع الأسطر التي تلي تعليق "disable"
  // حتى تتم مصادفة تعليق "enable" مطابق.
  console.log('this is never executed');
}
/* node:coverage enable */
```
يمكن أيضًا تعطيل التغطية لعدد محدد من الأسطر. بعد العدد المحدد من الأسطر، سيتم إعادة تمكين التغطية تلقائيًا. إذا لم يتم توفير عدد الأسطر بشكل صريح، فسيتم تجاهل سطر واحد.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### مراسلو التغطية {#coverage-reporters}

سيقوم مراسلو tap و spec بطباعة ملخص لإحصائيات التغطية. يوجد أيضًا مراسل lcov سيقوم بإنشاء ملف lcov يمكن استخدامه كتقرير تغطية متعمق.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- لا يتم الإبلاغ عن أي نتائج اختبار بواسطة هذا المراسل.
- من الناحية المثالية، يجب استخدام هذا المراسل جنبًا إلى جنب مع مراسل آخر.

## المحاكاة {#mocking}

تدعم الوحدة `node:test` المحاكاة أثناء الاختبار عبر كائن `mock` ذي مستوى أعلى. ينشئ المثال التالي تجسسًا على دالة تجمع رقمين معًا. ثم يتم استخدام التجسس للتأكد من استدعاء الدالة كما هو متوقع.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('يتجسس على دالة', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // إعادة تعيين عمليات المحاكاة المتعقبة عالميًا.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('يتجسس على دالة', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // إعادة تعيين عمليات المحاكاة المتعقبة عالميًا.
  mock.reset();
});
```
:::

يتم أيضًا عرض نفس وظيفة المحاكاة على كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext) الخاص بكل اختبار. ينشئ المثال التالي تجسسًا على طريقة كائن باستخدام واجهة برمجة التطبيقات المعروضة على `TestContext`. تتمثل فائدة المحاكاة عبر سياق الاختبار في أن مشغل الاختبار سيستعيد تلقائيًا جميع الوظائف المحاكاة بمجرد انتهاء الاختبار.

```js [ESM]
test('يتجسس على طريقة كائن', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### المؤقتات {#timers}

تعتبر المؤقتات الوهمية تقنية شائعة الاستخدام في اختبار البرامج لمحاكاة والتحكم في سلوك المؤقتات، مثل `setInterval` و `setTimeout`، دون الانتظار فعليًا للفترات الزمنية المحددة.

راجع الفئة [`MockTimers`](/ar/nodejs/api/test#class-mocktimers) للحصول على قائمة كاملة بالطرق والميزات.

يتيح ذلك للمطورين كتابة اختبارات أكثر موثوقية وقابلية للتنبؤ للوظائف التي تعتمد على الوقت.

يوضح المثال أدناه كيفية محاكاة `setTimeout`. باستخدام `.enable({ apis: ['setTimeout'] });` سيقوم بمحاكاة وظائف `setTimeout` في وحدات [node:timers](/ar/nodejs/api/timers) و [node:timers/promises](/ar/nodejs/api/timers#timers-promises-api)، وكذلك من سياق Node.js العام.

**ملاحظة:** لا يتم دعم تفكيك الدوال مثل `import { setTimeout } from 'node:timers'` حاليًا بواسطة واجهة برمجة التطبيقات هذه.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```
:::

يتم أيضًا عرض نفس وظيفة المحاكاة في خاصية mock على كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext) لكل اختبار. الفائدة من المحاكاة عبر سياق الاختبار هي أن مشغل الاختبار سيستعيد تلقائيًا جميع وظائف المؤقتات المحاكاة بمجرد انتهاء الاختبار.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

### التواريخ {#dates}

تسمح واجهة برمجة تطبيقات المؤقتات الوهمية أيضًا بمحاكاة كائن `Date`. هذه ميزة مفيدة لاختبار الوظائف التي تعتمد على الوقت، أو لمحاكاة وظائف التقويم الداخلية مثل `Date.now()`.

يعد تطبيق التواريخ أيضًا جزءًا من فئة [`MockTimers`](/ar/nodejs/api/test#class-mocktimers). ارجع إليها للحصول على قائمة كاملة بالطرق والميزات.

**ملاحظة:** تعتمد التواريخ والمؤقتات على بعضها البعض عند محاكاتها معًا. هذا يعني أنه إذا كان لديك كل من `Date` و `setTimeout` محاكيين، فإن تقديم الوقت سيقدم أيضًا التاريخ المحاكى لأنهما يحاكيان ساعة داخلية واحدة.

يوضح المثال أدناه كيفية محاكاة كائن `Date` والحصول على قيمة `Date.now()` الحالية.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

إذا لم يتم تعيين أي حقبة أولية، فسيعتمد التاريخ الأولي على 0 في حقبة Unix. هذا هو 1 يناير 1970، 00:00:00 بالتوقيت العالمي المنسق. يمكنك تعيين تاريخ أولي عن طريق تمرير خاصية `now` إلى طريقة `.enable()`. سيتم استخدام هذه القيمة كتاريخ أولي لكائن `Date` المحاكى. يمكن أن يكون إما عددًا صحيحًا موجبًا، أو كائن تاريخ آخر.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

يمكنك استخدام طريقة `.setTime()` لنقل التاريخ المحاكى يدويًا إلى وقت آخر. تقبل هذه الطريقة عددًا صحيحًا موجبًا فقط.

**ملاحظة:** ستنفذ هذه الطريقة أي مؤقتات محاكية موجودة في الماضي من الوقت الجديد.

في المثال أدناه، نقوم بتعيين وقت جديد للتاريخ المحاكى.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

إذا كان لديك أي مؤقت تم تعيينه للتشغيل في الماضي، فسيتم تنفيذه كما لو تم استدعاء طريقة `.tick()`. هذا مفيد إذا كنت تريد اختبار الوظائف التي تعتمد على الوقت والتي حدثت بالفعل في الماضي.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

سيؤدي استخدام `.runAll()` إلى تنفيذ جميع المؤقتات الموجودة حاليًا في قائمة الانتظار. سيؤدي هذا أيضًا إلى تقديم التاريخ المحاكى إلى وقت آخر مؤقت تم تنفيذه كما لو كان الوقت قد مر.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::

## اختبار اللقطات {#snapshot-testing}

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

تسمح اختبارات اللقطات بتسلسل قيم عشوائية إلى قيم نصية ومقارنتها بمجموعة من القيم الجيدة المعروفة. تُعرف القيم الجيدة المعروفة باسم اللقطات، ويتم تخزينها في ملف لقطة. تتم إدارة ملفات اللقطات بواسطة مشغل الاختبار، ولكنها مصممة لتكون قابلة للقراءة البشرية للمساعدة في التصحيح. أفضل الممارسات هي فحص ملفات اللقطات في التحكم في المصدر مع ملفات الاختبار الخاصة بك.

يتم إنشاء ملفات اللقطات عن طريق بدء Node.js باستخدام علامة سطر الأوامر [`--test-update-snapshots`](/ar/nodejs/api/cli#--test-update-snapshots). يتم إنشاء ملف لقطة منفصل لكل ملف اختبار. بشكل افتراضي، يكون لملف اللقطة نفس اسم ملف الاختبار مع امتداد الملف `.snapshot`. يمكن تكوين هذا السلوك باستخدام الدالة `snapshot.setResolveSnapshotPath()`. يتوافق كل تأكيد للقطة مع تصدير في ملف اللقطة.

يظهر مثال على اختبار اللقطة أدناه. في المرة الأولى التي يتم فيها تنفيذ هذا الاختبار، سيفشل لأن ملف اللقطة المقابل غير موجود.

```js [ESM]
// test.js
suite('مجموعة اختبارات اللقطات', () => {
  test('اختبار اللقطة', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
قم بإنشاء ملف اللقطة عن طريق تشغيل ملف الاختبار باستخدام `--test-update-snapshots`. يجب أن يجتاز الاختبار، ويتم إنشاء ملف باسم `test.js.snapshot` في نفس الدليل الذي يوجد به ملف الاختبار. يظهر محتوى ملف اللقطة أدناه. يتم تحديد كل لقطة بالاسم الكامل للاختبار وعداد للتمييز بين اللقطات في نفس الاختبار.

```js [ESM]
exports[`مجموعة اختبارات اللقطات > اختبار اللقطة 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`مجموعة اختبارات اللقطات > اختبار اللقطة 2`] = `
5
`;
```
بمجرد إنشاء ملف اللقطة، قم بتشغيل الاختبارات مرة أخرى بدون علامة `--test-update-snapshots`. يجب أن تجتاز الاختبارات الآن.


## مراسلو الاختبار {#test-reporters}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v19.9.0, v18.17.0 | يتم الآن عرض المراسلين في `node:test/reporters`. |
| v19.6.0, v18.15.0 | تمت إضافته في: v19.6.0, v18.15.0 |
:::

تدعم الوحدة `node:test` تمرير علامات [`--test-reporter`](/ar/nodejs/api/cli#--test-reporter) ليستخدم عداء الاختبار مراسلًا محددًا.

المراسلون المضمنون التاليون مدعومون:

-  `spec` يُخرج المراسل `spec` نتائج الاختبار بتنسيق يمكن للبشر قراءته. هذا هو المراسل الافتراضي.
-  `tap` يُخرج المراسل `tap` نتائج الاختبار بتنسيق [TAP](https://testanything.org/).
-  `dot` يُخرج المراسل `dot` نتائج الاختبار بتنسيق مضغوط، حيث يتم تمثيل كل اختبار ناجح بـ `.`، ويتم تمثيل كل اختبار فاشل بـ `X`.
-  `junit` يُخرج المراسل `junit` نتائج الاختبار بتنسيق jUnit XML
-  `lcov` يُخرج المراسل `lcov` تغطية الاختبار عند استخدامه مع علامة [`--experimental-test-coverage`](/ar/nodejs/api/cli#--experimental-test-coverage).

الإخراج الدقيق لهؤلاء المراسلين عرضة للتغيير بين إصدارات Node.js، ولا ينبغي الاعتماد عليه برمجيًا. إذا كانت هناك حاجة للوصول البرمجي إلى إخراج عداء الاختبار، فاستخدم الأحداث التي تنبعث من [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream).

تتوفر المراسلون عبر الوحدة `node:test/reporters`:

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### مراسلون مخصصون {#custom-reporters}

يمكن استخدام [`--test-reporter`](/ar/nodejs/api/cli#--test-reporter) لتحديد مسار إلى مراسل مخصص. المراسل المخصص هو وحدة تصدر قيمة مقبولة بواسطة [stream.compose](/ar/nodejs/api/stream#streamcomposestreams). يجب أن تحول المراسلون الأحداث التي تنبعث من [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream)

مثال على مراسل مخصص باستخدام [\<stream.Transform\>](/ar/nodejs/api/stream#class-streamtransform):

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```js [CJS]
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

مثال على مراسل مخصص باستخدام دالة مولد:

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```js [CJS]
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

يجب أن تكون القيمة المقدمة إلى `--test-reporter` عبارة عن سلسلة مثل تلك المستخدمة في `import()` في كود JavaScript، أو قيمة مقدمة لـ [`--import`](/ar/nodejs/api/cli#--importmodule).


### مراسلون متعددون {#multiple-reporters}

يمكن تحديد العلامة [`--test-reporter`](/ar/nodejs/api/cli#--test-reporter) عدة مرات للإبلاغ عن نتائج الاختبار بتنسيقات متعددة. في هذه الحالة، من الضروري تحديد وجهة لكل مراسل باستخدام [`--test-reporter-destination`](/ar/nodejs/api/cli#--test-reporter-destination). يمكن أن تكون الوجهة `stdout` أو `stderr` أو مسار ملف. يتم إقران المراسلين والوجهات وفقًا للترتيب الذي تم تحديده.

في المثال التالي، سيتم إخراج مراسل `spec` إلى `stdout`، وسيتم إخراج مراسل `dot` إلى `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
عند تحديد مراسل واحد، ستكون الوجهة افتراضيًا `stdout`، ما لم يتم توفير وجهة بشكل صريح.

## `run([options])` {#runoptions}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.0.0 | تمت إضافة خيار `cwd`. |
| v23.0.0 | تمت إضافة خيارات التغطية. |
| v22.8.0 | تمت إضافة خيار `isolation`. |
| v22.6.0 | تمت إضافة خيار `globPatterns`. |
| v22.0.0, v20.14.0 | تمت إضافة خيار `forceExit`. |
| v20.1.0, v18.17.0 | تمت إضافة خيار testNamePatterns. |
| v18.9.0, v16.19.0 | تمت إضافته في: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين لتشغيل الاختبارات. الخصائص التالية مدعومة:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم توفير رقم، فسيتم تشغيل هذا العدد من عمليات الاختبار بالتوازي، حيث تتوافق كل عملية مع ملف اختبار واحد. إذا كان `true`، فسيتم تشغيل `os.availableParallelism() - 1` ملف اختبار بالتوازي. إذا كان `false`، فسيتم تشغيل ملف اختبار واحد فقط في كل مرة. **افتراضي:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يحدد دليل العمل الحالي الذي سيستخدمه مشغل الاختبار. يعمل كمسار أساسي لحل الملفات وفقًا لـ [نموذج تنفيذ مشغل الاختبار](/ar/nodejs/api/test#test-runner-execution-model). **افتراضي:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة تحتوي على قائمة الملفات المراد تشغيلها. **افتراضي:** مطابقة الملفات من [نموذج تنفيذ مشغل الاختبار](/ar/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يقوم بتكوين مشغل الاختبار للخروج من العملية بمجرد انتهاء جميع الاختبارات المعروفة من التنفيذ حتى إذا ظلت حلقة الأحداث نشطة بخلاف ذلك. **افتراضي:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة تحتوي على قائمة أنماط glob لمطابقة ملفات الاختبار. لا يمكن استخدام هذا الخيار مع `files`. **افتراضي:** مطابقة الملفات من [نموذج تنفيذ مشغل الاختبار](/ar/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) يعين منفذ الفحص لعملية اختبار فرعية. يمكن أن يكون هذا رقمًا أو دالة لا تأخذ أي وسيطات وترجع رقمًا. إذا تم توفير قيمة خالية، فستحصل كل عملية على منفذ خاص بها، يتم زيادته من `process.debugPort` الرئيسي. يتم تجاهل هذا الخيار إذا تم تعيين خيار `isolation` على `'none'` حيث لا يتم إنشاء أي عمليات فرعية. **افتراضي:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) يقوم بتكوين نوع عزل الاختبار. إذا تم تعيينه على `'process'`، فسيتم تشغيل كل ملف اختبار في عملية فرعية منفصلة. إذا تم تعيينه على `'none'`، فسيتم تشغيل جميع ملفات الاختبار في العملية الحالية. **افتراضي:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت القيمة صحيحة، فسياق الاختبار سيقوم فقط بتشغيل الاختبارات التي تم تعيين خيار `only` لها
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة تقبل مثيل `TestsStream` ويمكن استخدامها لإعداد المستمعين قبل تشغيل أي اختبارات. **افتراضي:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من علامات CLI لتمريرها إلى الملف التنفيذي `node` عند إنشاء العمليات الفرعية. ليس لهذا الخيار أي تأثير عندما يكون `isolation` هو `'none'`. **افتراضي:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من علامات CLI لتمريرها إلى كل ملف اختبار عند إنشاء العمليات الفرعية. ليس لهذا الخيار أي تأثير عندما يكون `isolation` هو `'none'`. **افتراضي:** `[]`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإجهاض تنفيذ اختبار قيد التقدم.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) سلسلة أو تعبير RegExp أو مصفوفة RegExp، يمكن استخدامها لتشغيل الاختبارات فقط التي يتطابق اسمها مع النمط المقدم. يتم تفسير أنماط أسماء الاختبارات كتعبيرات JavaScript منتظمة. لكل اختبار يتم تنفيذه، يتم أيضًا تشغيل أي خطافات اختبار مقابلة، مثل `beforeEach()`. **افتراضي:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) سلسلة أو تعبير RegExp أو مصفوفة RegExp، يمكن استخدامها لاستبعاد تشغيل الاختبارات التي يتطابق اسمها مع النمط المقدم. يتم تفسير أنماط أسماء الاختبارات كتعبيرات JavaScript منتظمة. لكل اختبار يتم تنفيذه، يتم أيضًا تشغيل أي خطافات اختبار مقابلة، مثل `beforeEach()`. **افتراضي:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بالمللي ثانية سيفشل تنفيذ الاختبار بعده. إذا لم يتم تحديده، فسوف ترث الاختبارات الفرعية هذه القيمة من الأصل. **افتراضي:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان سيتم التشغيل في وضع المراقبة أم لا. **افتراضي:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) تشغيل الاختبارات في جزء معين. **افتراضي:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) هو عدد صحيح موجب بين 1 و `\<total\>` يحدد فهرس الجزء المراد تشغيله. هذا الخيار *مطلوب*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) هو عدد صحيح موجب يحدد العدد الإجمالي للأجزاء المراد تقسيم ملفات الاختبار إليها. هذا الخيار *مطلوب*.
 
 
    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) تمكين جمع [تغطية التعليمات البرمجية](/ar/nodejs/api/test#collecting-code-coverage). **افتراضي:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) يستبعد ملفات معينة من تغطية التعليمات البرمجية باستخدام نمط glob، والذي يمكن أن يطابق مسارات الملفات المطلقة والنسبية. هذه الخاصية قابلة للتطبيق فقط عند تعيين `coverage` على `true`. إذا تم توفير كل من `coverageExcludeGlobs` و `coverageIncludeGlobs`، فيجب أن تفي الملفات **بكلتا** المعايير ليتم تضمينها في تقرير التغطية. **افتراضي:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) يتضمن ملفات معينة في تغطية التعليمات البرمجية باستخدام نمط glob، والذي يمكن أن يطابق مسارات الملفات المطلقة والنسبية. هذه الخاصية قابلة للتطبيق فقط عند تعيين `coverage` على `true`. إذا تم توفير كل من `coverageExcludeGlobs` و `coverageIncludeGlobs`، فيجب أن تفي الملفات **بكلتا** المعايير ليتم تضمينها في تقرير التغطية. **افتراضي:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتطلب الحد الأدنى من النسبة المئوية للأسطر المغطاة. إذا لم تصل تغطية التعليمات البرمجية إلى الحد الأدنى المحدد، فستخرج العملية بالرمز `1`. **افتراضي:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتطلب الحد الأدنى من النسبة المئوية للفروع المغطاة. إذا لم تصل تغطية التعليمات البرمجية إلى الحد الأدنى المحدد، فستخرج العملية بالرمز `1`. **افتراضي:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتطلب الحد الأدنى من النسبة المئوية للدوال المغطاة. إذا لم تصل تغطية التعليمات البرمجية إلى الحد الأدنى المحدد، فستخرج العملية بالرمز `1`. **افتراضي:** `0`.
 
 
- الإرجاع: [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream)

**ملاحظة:** يتم استخدام `shard` لموازاة تشغيل الاختبار أفقيًا عبر الأجهزة أو العمليات، وهو مثالي لعمليات التنفيذ واسعة النطاق عبر بيئات متنوعة. إنه غير متوافق مع وضع `watch`، المصمم لتكرار التعليمات البرمجية السريع عن طريق إعادة تشغيل الاختبارات تلقائيًا عند تغيير الملفات.



::: code-group
```js [ESM]
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```js [CJS]
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```
:::


## `suite([name][, options][, fn])` {#suitename-options-fn}

**تمت الإضافة في: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المجموعة، والذي يتم عرضه عند الإبلاغ عن نتائج الاختبار. **افتراضي:** خاصية `name` الخاصة بـ `fn`، أو `'\<anonymous\>'` إذا لم يكن لـ `fn` اسم.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين اختيارية للمجموعة. يدعم هذا نفس خيارات `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة المجموعة التي تعلن عن الاختبارات والمجموعات المتداخلة. الوسيطة الأولى لهذه الدالة هي كائن [`SuiteContext`](/ar/nodejs/api/test#class-suitecontext). **افتراضي:** دالة لا تقوم بأي عملية.
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تم تحقيقه على الفور بـ `undefined`.

يتم استيراد الدالة `suite()` من الوحدة `node:test`.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**تمت الإضافة في: v22.0.0, v20.13.0**

اختصار لتخطي مجموعة. هذا هو نفسه [`suite([name], { skip: true }[, fn])`](/ar/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**تمت الإضافة في: v22.0.0, v20.13.0**

اختصار لتعليم مجموعة على أنها `TODO`. هذا هو نفسه [`suite([name], { todo: true }[, fn])`](/ar/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**تمت الإضافة في: v22.0.0, v20.13.0**

اختصار لتعليم مجموعة على أنها `only`. هذا هو نفسه [`suite([name], { only: true }[, fn])`](/ar/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v20.2.0, v18.17.0 | تمت إضافة الاختصارات `skip` و `todo` و `only`. |
| v18.8.0, v16.18.0 | إضافة خيار `signal`. |
| v18.7.0, v16.17.0 | إضافة خيار `timeout`. |
| v18.0.0, v16.17.0 | تمت الإضافة في: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار، والذي يتم عرضه عند الإبلاغ عن نتائج الاختبار. **افتراضي:** خاصية `name` الخاصة بـ `fn`، أو `'\<anonymous\>'` إذا لم يكن لـ `fn` اسم.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين للاختبار. يتم دعم الخصائص التالية:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم توفير رقم، فسيتم تشغيل هذا العدد من الاختبارات بالتوازي داخل سلسلة عمليات التطبيق. إذا كانت `true`، فسيتم تشغيل جميع الاختبارات غير المتزامنة المجدولة بالتوازي داخل سلسلة العمليات. إذا كانت `false`، فسيتم تشغيل اختبار واحد فقط في كل مرة. إذا لم يتم تحديده، فستَرِث الاختبارات الفرعية هذه القيمة من أصلها. **افتراضي:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت قيمة حقيقية، وتم تكوين سياق الاختبار لتشغيل اختبارات `only`، فسيتم تشغيل هذا الاختبار. وإلا، فسيتم تخطي الاختبار. **افتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإحباط اختبار قيد التقدم.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت قيمة حقيقية، فسيتم تخطي الاختبار. إذا تم توفير سلسلة، فسيتم عرض هذه السلسلة في نتائج الاختبار كسبب لتخطي الاختبار. **افتراضي:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت قيمة حقيقية، فسيتم تعليم الاختبار على أنه `TODO`. إذا تم توفير سلسلة، فسيتم عرض هذه السلسلة في نتائج الاختبار كسبب لكون الاختبار `TODO`. **افتراضي:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بالمللي ثانية سيفشل الاختبار بعده. إذا لم يتم تحديده، فستَرِث الاختبارات الفرعية هذه القيمة من أصلها. **افتراضي:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد التأكيدات والاختبارات الفرعية المتوقع تشغيلها في الاختبار. إذا كان عدد التأكيدات التي تم تشغيلها في الاختبار لا يتطابق مع الرقم المحدد في الخطة، فسيفشل الاختبار. **افتراضي:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) الدالة قيد الاختبار. الوسيطة الأولى لهذه الدالة هي كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext). إذا كان الاختبار يستخدم ردود الاتصال، فسيتم تمرير دالة رد الاتصال كوسيطة ثانية. **افتراضي:** دالة لا تقوم بأي عملية.
- الإرجاع: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تم تحقيقه بـ `undefined` بمجرد اكتمال الاختبار، أو على الفور إذا تم تشغيل الاختبار داخل مجموعة.

الدالة `test()` هي القيمة المستوردة من الوحدة `test`. يؤدي كل استدعاء لهذه الدالة إلى الإبلاغ عن الاختبار إلى [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream).

يمكن استخدام كائن `TestContext` الذي تم تمريره إلى الوسيطة `fn` لتنفيذ الإجراءات المتعلقة بالاختبار الحالي. تتضمن الأمثلة تخطي الاختبار أو إضافة معلومات تشخيصية إضافية أو إنشاء اختبارات فرعية.

تُرجع `test()` ‏`Promise` يتم تحقيقه بمجرد اكتمال الاختبار. إذا تم استدعاء `test()` داخل مجموعة، فإنه يتحقق على الفور. يمكن عادةً تجاهل القيمة المرجعة للاختبارات ذات المستوى الأعلى. ومع ذلك، يجب استخدام القيمة المرجعة من الاختبارات الفرعية لمنع الاختبار الأصل من الانتهاء أولاً وإلغاء الاختبار الفرعي كما هو موضح في المثال التالي.

```js [ESM]
test('top level test', async (t) => {
  // The setTimeout() in the following subtest would cause it to outlive its
  // parent test if 'await' is removed on the next line. Once the parent test
  // completes, it will cancel any outstanding subtests.
  await t.test('longer running subtest', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
يمكن استخدام الخيار `timeout` لإفشال الاختبار إذا استغرق إكماله وقتًا أطول من `timeout` بالمللي ثانية. ومع ذلك، فهي ليست آلية موثوقة لإلغاء الاختبارات لأن الاختبار قيد التشغيل قد يحظر سلسلة عمليات التطبيق وبالتالي يمنع الإلغاء المجدول.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

اختصار لتخطي اختبار، نفس [`test([name], { skip: true }[, fn])`](/ar/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

اختصار لتعليم اختبار كـ `TODO`، نفس [`test([name], { todo: true }[, fn])`](/ar/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

اختصار لتعليم اختبار كـ `only`، نفس [`test([name], { only: true }[, fn])`](/ar/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

اسم مستعار لـ [`suite()`](/ar/nodejs/api/test#suitename-options-fn).

يتم استيراد الدالة `describe()` من الوحدة `node:test`.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

اختصار لتخطي مجموعة اختبار. هذا هو نفسه [`describe([name], { skip: true }[, fn])`](/ar/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

اختصار لتعليم مجموعة اختبار كـ `TODO`. هذا هو نفسه [`describe([name], { todo: true }[, fn])`](/ar/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**أضيف في: الإصدار 19.8.0، الإصدار 18.15.0**

اختصار لتعليم مجموعة اختبار كـ `only`. هذا هو نفسه [`describe([name], { only: true }[, fn])`](/ar/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 19.8.0، الإصدار 18.16.0 | استدعاء `it()` الآن مكافئ لاستدعاء `test()`. |
| الإصدار 18.6.0، الإصدار 16.17.0 | أضيف في: الإصدار 18.6.0، الإصدار 16.17.0 |
:::

اسم مستعار لـ [`test()`](/ar/nodejs/api/test#testname-options-fn).

يتم استيراد الدالة `it()` من الوحدة `node:test`.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

اختصار لتخطي اختبار، نفس [`it([name], { skip: true }[, fn])`](/ar/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

اختصار لتعليم اختبار كـ `TODO`، نفس [`it([name], { todo: true }[, fn])`](/ar/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**أضيف في: الإصدار 19.8.0، الإصدار 18.15.0**

اختصار لتعليم اختبار كـ `only`، نفس [`it([name], { only: true }[, fn])`](/ar/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**تمت الإضافة في: v18.8.0، v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الربط. إذا كان الربط يستخدم ردود الاتصال، فسيتم تمرير دالة رد الاتصال كمعامل ثاني. **افتراضي:** دالة لا تفعل شيئًا.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين للربط. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء ربط قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي سيفشل بعدها الربط. إذا لم يتم تحديده، فسترث الاختبارات الفرعية هذه القيمة من الأصل الخاص بها. **افتراضي:** `Infinity`.

تقوم هذه الدالة بإنشاء ربط يتم تشغيله قبل تنفيذ مجموعة.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**تمت الإضافة في: v18.8.0، v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الربط. إذا كان الربط يستخدم ردود الاتصال، فسيتم تمرير دالة رد الاتصال كمعامل ثاني. **افتراضي:** دالة لا تفعل شيئًا.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين للربط. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء ربط قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي سيفشل بعدها الربط. إذا لم يتم تحديده، فسترث الاختبارات الفرعية هذه القيمة من الأصل الخاص بها. **افتراضي:** `Infinity`.

تقوم هذه الدالة بإنشاء ربط يتم تشغيله بعد تنفيذ مجموعة.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**ملاحظة:** يتم ضمان تشغيل الربط `after`، حتى إذا فشلت الاختبارات داخل المجموعة.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**أُضيف في:** v18.8.0، v16.18.0

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الخطاف (hook). إذا كان الخطاف يستخدم ردود النداء (callbacks)، يتم تمرير دالة رد النداء كمعامل ثانٍ. **الافتراضي:** دالة فارغة (no-op).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين للخطاف. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإجهاض خطاف قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد من المللي ثانية سيفشل الخطاف بعدها. إذا لم يتم تحديده، سترث الاختبارات الفرعية هذه القيمة من الأصل الخاص بها. **الافتراضي:** `Infinity`.

تقوم هذه الدالة بإنشاء خطاف يتم تشغيله قبل كل اختبار في المجموعة الحالية.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**أُضيف في:** v18.8.0، v16.18.0

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الخطاف (hook). إذا كان الخطاف يستخدم ردود النداء (callbacks)، يتم تمرير دالة رد النداء كمعامل ثانٍ. **الافتراضي:** دالة فارغة (no-op).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين للخطاف. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإجهاض خطاف قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد من المللي ثانية سيفشل الخطاف بعدها. إذا لم يتم تحديده، سترث الاختبارات الفرعية هذه القيمة من الأصل الخاص بها. **الافتراضي:** `Infinity`.

تقوم هذه الدالة بإنشاء خطاف يتم تشغيله بعد كل اختبار في المجموعة الحالية. يتم تشغيل خطاف `afterEach()` حتى إذا فشل الاختبار.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**أُضيف في: الإصدار v22.3.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الثبات: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

كائن تُستخدم طرقه لتكوين إعدادات اللقطات الافتراضية في العملية الحالية. من الممكن تطبيق نفس التكوين على جميع الملفات عن طريق وضع كود التكوين الشائع في وحدة تم تحميلها مسبقًا باستخدام `--require` أو `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**أُضيف في: الإصدار v22.3.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الثبات: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الدوال المتزامنة المستخدمة كمسلسلات افتراضية لاختبارات اللقطات.

تُستخدم هذه الدالة لتخصيص آلية التسلسل الافتراضية المستخدمة من قِبل مُشغِّل الاختبار. بشكل افتراضي، يقوم مُشغِّل الاختبار بتنفيذ التسلسل عن طريق استدعاء `JSON.stringify(value, null, 2)` على القيمة المُقدَّمة. `JSON.stringify()` لديها قيود فيما يتعلق بالهياكل الدائرية وأنواع البيانات المدعومة. إذا كانت هناك حاجة إلى آلية تسلسل أكثر قوة، فيجب استخدام هذه الدالة.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**أُضيف في: الإصدار v22.3.0**

::: warning [ثابت: 1 - تجريبي]
[ثابت: 1](/ar/nodejs/api/documentation#stability-index) [الثبات: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة تُستخدم لحساب موقع ملف اللقطة. تتلقى الدالة مسار ملف الاختبار كوسيطتها الوحيدة. إذا لم يكن الاختبار مرتبطًا بملف (على سبيل المثال في REPL)، يكون الإدخال غير مُعرَّف. يجب أن تُرجع `fn()` سلسلة تحدد موقع ملف اللقطة.

تُستخدم هذه الدالة لتخصيص موقع ملف اللقطة المستخدم لاختبار اللقطات. بشكل افتراضي، يكون اسم ملف اللقطة هو نفسه اسم ملف نقطة الإدخال بامتداد ملف `.snapshot`.


## الفئة: `MockFunctionContext` {#class-mockfunctioncontext}

**تمت الإضافة في: الإصدار v19.1.0، v18.13.0**

تُستخدم الفئة `MockFunctionContext` لفحص أو معالجة سلوك النماذج الوهمية التي تم إنشاؤها عبر واجهات برمجة التطبيقات [`MockTracker`](/ar/nodejs/api/test#class-mocktracker).

### `ctx.calls` {#ctxcalls}

**تمت الإضافة في: الإصدار v19.1.0، v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

دالة جلب (getter) تُرجع نسخة من المصفوفة الداخلية المستخدمة لتتبع استدعاءات النموذج الوهمي. كل إدخال في المصفوفة هو كائن له الخصائص التالية.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الوسائط التي تم تمريرها إلى الدالة الوهمية.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) إذا أطلقت الدالة الوهمية استثناءً، فستحتوي هذه الخاصية على القيمة التي تم إطلاقها. **افتراضي:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) القيمة التي تم إرجاعها بواسطة الدالة الوهمية.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) كائن `Error` يمكن استخدام مكدسه لتحديد موقع الاستدعاء لاستدعاء الدالة الوهمية.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) إذا كانت الدالة الوهمية هي دالة إنشاء (constructor)، فسيحتوي هذا الحقل على الفئة التي يتم إنشاؤها. بخلاف ذلك، سيكون هذا `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة `this` الخاصة بالدالة الوهمية.

### `ctx.callCount()` {#ctxcallcount}

**تمت الإضافة في: الإصدار v19.1.0، v18.13.0**

- الإرجاع: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المرات التي تم فيها استدعاء هذا النموذج الوهمي.

تُرجع هذه الدالة عدد المرات التي تم فيها استدعاء هذا النموذج الوهمي. هذه الدالة أكثر كفاءة من التحقق من `ctx.calls.length` لأن `ctx.calls` هي دالة جلب (getter) تنشئ نسخة من مصفوفة تتبع الاستدعاءات الداخلية.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**أُضيف في: v19.1.0، v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) الدالة التي ستستخدم كتطبيق جديد للنموذج.

تُستخدم هذه الدالة لتغيير سلوك نموذج موجود.

ينشئ المثال التالي دالة نموذجية باستخدام `t.mock.fn()`، ويستدعي الدالة النموذجية، ثم يغير تطبيق النموذج إلى دالة مختلفة.

```js [ESM]
test('يغير سلوك النموذج', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```
### `ctx.mockImplementationOnce(implementation[, onCall])` {#ctxmockimplementationonceimplementation-oncall}

**أُضيف في: v19.1.0، v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) الدالة التي ستستخدم كتطبيق للنموذج لرقم الاستدعاء المحدد بواسطة `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم الاستدعاء الذي سيستخدم `implementation`. إذا حدث الاستدعاء المحدد بالفعل، فسيتم طرح استثناء. **افتراضي:** عدد الاستدعاء التالي.

تُستخدم هذه الدالة لتغيير سلوك نموذج موجود لاستدعاء واحد. بمجرد حدوث الاستدعاء `onCall`، سيعود النموذج إلى أي سلوك كان سيستخدمه لو لم يتم استدعاء `mockImplementationOnce()`.

ينشئ المثال التالي دالة نموذجية باستخدام `t.mock.fn()`، ويستدعي الدالة النموذجية، ويغير تطبيق النموذج إلى دالة مختلفة للاستدعاء التالي، ثم يستأنف سلوكه السابق.

```js [ESM]
test('يغير سلوك النموذج مرة واحدة', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```

### `ctx.resetCalls()` {#ctxresetcalls}

**أُضيف في: v19.3.0، v18.13.0**

يعيد ضبط سجل الاستدعاءات للدالة الوهمية.

### `ctx.restore()` {#ctxrestore}

**أُضيف في: v19.1.0، v18.13.0**

يعيد ضبط تنفيذ الدالة الوهمية إلى سلوكها الأصلي. لا يزال بالإمكان استخدام الوهمي بعد استدعاء هذه الدالة.

## صنف: `MockModuleContext` {#class-mockmodulecontext}

**أُضيف في: v22.3.0، v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

يُستخدم الصنف `MockModuleContext` للتلاعب بسلوك وحدات النماذج الوهمية التي تم إنشاؤها عبر واجهات برمجة التطبيقات [`MockTracker`](/ar/nodejs/api/test#class-mocktracker).

### `ctx.restore()` {#ctxrestore_1}

**أُضيف في: v22.3.0، v20.18.0**

يعيد ضبط تنفيذ الوحدة الوهمية.

## صنف: `MockTracker` {#class-mocktracker}

**أُضيف في: v19.1.0، v18.13.0**

يُستخدم الصنف `MockTracker` لإدارة وظائف المحاكاة الوهمية. توفر وحدة تشغيل الاختبار تصديرًا عالي المستوى `mock` وهو مثيل `MockTracker`. يوفر كل اختبار أيضًا مثيل `MockTracker` الخاص به عبر خاصية `mock` الخاصة بسياق الاختبار.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**أُضيف في: v19.1.0، v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة اختيارية لإنشاء وهمي عليها. **افتراضي:** دالة لا تفعل شيئًا.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة اختيارية تُستخدم كتنفيذ وهمي لـ `original`. هذا مفيد لإنشاء نماذج وهمية تعرض سلوكًا واحدًا لعدد محدد من الاستدعاءات ثم استعادة سلوك `original`. **افتراضي:** الدالة المحددة بواسطة `original`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين الاختيارية للدالة الوهمية. الخصائص التالية مدعومة:
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المرات التي سيستخدم فيها الوهمي سلوك `implementation`. بمجرد استدعاء الدالة الوهمية `times` مرات، ستستعيد تلقائيًا سلوك `original`. يجب أن تكون هذه القيمة عددًا صحيحًا أكبر من الصفر. **افتراضي:** `Infinity`.


- إرجاع: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) الدالة الوهمية. تحتوي الدالة الوهمية على خاصية `mock` خاصة، وهي مثيل لـ [`MockFunctionContext`](/ar/nodejs/api/test#class-mockfunctioncontext)، ويمكن استخدامها لفحص وتغيير سلوك الدالة الوهمية.

تُستخدم هذه الدالة لإنشاء دالة وهمية.

يقوم المثال التالي بإنشاء دالة وهمية تزيد العداد بمقدار واحد في كل استدعاء. يُستخدم الخيار `times` لتعديل السلوك الوهمي بحيث يضيف أول استدعيين اثنين إلى العداد بدلاً من واحد.

```js [ESM]
test('mocks a counting function', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```

### `mock.getter(object, methodName[, implementation][, options])` {#mockgetterobject-methodname-implementation-options}

**تمت الإضافة في: الإصدار v19.3.0, v18.13.0**

هذه الوظيفة هي عبارة عن تسهيل نحوي لـ [`MockTracker.method`](/ar/nodejs/api/test#mockmethodobject-methodname-implementation-options) مع تعيين `options.getter` على `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**تمت الإضافة في: الإصدار v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) الكائن الذي يتم محاكاة طريقته.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) مُعرّف الطريقة الموجودة على `object` المراد محاكاتها. إذا لم يكن `object[methodName]` دالة، فسيتم طرح خطأ.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة اختيارية تُستخدم كتطبيق وهمي لـ `object[methodName]`. **الافتراضي:** الطريقة الأصلية المحددة بواسطة `object[methodName]`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين اختيارية للطريقة الوهمية. الخصائص التالية مدعومة:
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم التعامل مع `object[methodName]` على أنها مُجلب. لا يمكن استخدام هذا الخيار مع خيار `setter`. **الافتراضي:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم التعامل مع `object[methodName]` على أنها مُعدِّل. لا يمكن استخدام هذا الخيار مع خيار `getter`. **الافتراضي:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المرات التي سيستخدم فيها النموذج الوهمي سلوك `implementation`. بمجرد استدعاء الطريقة الوهمية `times` مرة، سيتم استعادة السلوك الأصلي تلقائيًا. يجب أن تكون هذه القيمة عددًا صحيحًا أكبر من صفر. **الافتراضي:** `Infinity`.

- Returns: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) الطريقة الوهمية. تحتوي الطريقة الوهمية على خاصية `mock` خاصة، وهي عبارة عن نسخة من [`MockFunctionContext`](/ar/nodejs/api/test#class-mockfunctioncontext)، ويمكن استخدامها لفحص وتغيير سلوك الطريقة الوهمية.

تُستخدم هذه الوظيفة لإنشاء نموذج وهمي لطريقة كائن موجودة. يوضح المثال التالي كيفية إنشاء نموذج وهمي لطريقة كائن موجودة.

```js [ESM]
test('تجسس على طريقة كائن', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### `mock.module(specifier[, options])` {#mockmodulespecifier-options}

**تمت الإضافة في: v22.3.0, v20.18.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ar/nodejs/api/url#the-whatwg-url-api) سلسلة تعريف الوحدة النمطية المراد محاكاتها.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين اختيارية لوحدة المحاكاة. الخصائص التالية مدعومة:
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `false`، فإن كل استدعاء لـ `require()` أو `import()` سيولد وحدة محاكاة جديدة. إذا كانت `true`، فإن الاستدعاءات اللاحقة ستعيد نفس وحدة المحاكاة، وسيتم إدراج وحدة المحاكاة في ذاكرة التخزين المؤقت لـ CommonJS. **الافتراضي:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) قيمة اختيارية تستخدم كتصدير افتراضي لوحدة المحاكاة. إذا لم يتم توفير هذه القيمة، فلن تتضمن محاكاة ESM تصديرًا افتراضيًا. إذا كانت المحاكاة عبارة عن وحدة CommonJS أو وحدة مدمجة، فسيتم استخدام هذا الإعداد كقيمة لـ `module.exports`. إذا لم يتم توفير هذه القيمة، فستستخدم محاكاة CJS والوحدات المدمجة كائنًا فارغًا كقيمة لـ `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن اختياري تُستخدم مفاتيحه وقيمه لإنشاء الصادرات المسماة لوحدة المحاكاة. إذا كانت المحاكاة عبارة عن وحدة CommonJS أو وحدة مدمجة، فسيتم نسخ هذه القيم على `module.exports`. لذلك، إذا تم إنشاء محاكاة مع كل من الصادرات المسماة والتصدير الافتراضي غير الكائني، فستقوم المحاكاة بإلقاء استثناء عند استخدامها كوحدة CJS أو وحدة مدمجة.


- الإرجاع: [\<MockModuleContext\>](/ar/nodejs/api/test#class-mockmodulecontext) كائن يمكن استخدامه لمعالجة المحاكاة.

تُستخدم هذه الدالة لمحاكاة صادرات وحدات ECMAScript ووحدات CommonJS ووحدات Node.js المدمجة. لا تتأثر أي مراجع إلى الوحدة الأصلية قبل المحاكاة. لتمكين محاكاة الوحدة، يجب بدء Node.js بعلامة سطر الأوامر [`--experimental-test-module-mocks`](/ar/nodejs/api/cli#--experimental-test-module-mocks).

يوضح المثال التالي كيف يتم إنشاء محاكاة لوحدة نمطية.

```js [ESM]
test('mocks a builtin module in both module systems', async (t) => {
  // Create a mock of 'node:readline' with a named export named 'fn', which
  // does not exist in the original 'node:readline' module.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() is an export of the original 'node:readline' module.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // The mock is restored, so the original builtin module is returned.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### ‏`mock.reset()` {#mockreset}

**تمت إضافته في: الإصدار v19.1.0، v18.13.0**

تقوم هذه الدالة باستعادة السلوك الافتراضي لجميع النماذج الوهمية التي تم إنشاؤها مسبقًا بواسطة `MockTracker` هذه وفصل النماذج الوهمية عن نسخة `MockTracker`. بمجرد الفصل، لا يزال من الممكن استخدام النماذج الوهمية، ولكن لا يمكن استخدام نسخة `MockTracker` بعد الآن لإعادة تعيين سلوكها أو التفاعل معها بأي طريقة أخرى.

بعد اكتمال كل اختبار، يتم استدعاء هذه الدالة على `MockTracker` الخاص بسياق الاختبار. إذا تم استخدام `MockTracker` العام على نطاق واسع، فمن المستحسن استدعاء هذه الدالة يدويًا.

### ‏`mock.restoreAll()` {#mockrestoreall}

**تمت إضافته في: الإصدار v19.1.0، v18.13.0**

تقوم هذه الدالة باستعادة السلوك الافتراضي لجميع النماذج الوهمية التي تم إنشاؤها مسبقًا بواسطة `MockTracker` هذه. على عكس `mock.reset()`، لا تفصل `mock.restoreAll()` النماذج الوهمية عن نسخة `MockTracker`.

### ‏`mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**تمت إضافته في: الإصدار v19.3.0، v18.13.0**

هذه الدالة عبارة عن تسهيل في الكتابة لـ [`MockTracker.method`](/ar/nodejs/api/test#mockmethodobject-methodname-implementation-options) مع تعيين `options.setter` إلى `true`.

## فئة: ‏`MockTimers` {#class-mocktimers}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.1.0 | أصبح Mock Timers الآن مستقرًا. |
| v20.4.0, v18.19.0 | تمت إضافته في: الإصدار v20.4.0، v18.19.0 |
:::

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

إنشاء نماذج وهمية للمؤقتات هو أسلوب شائع الاستخدام في اختبار البرامج لمحاكاة والتحكم في سلوك المؤقتات، مثل `setInterval` و `setTimeout`، دون الانتظار فعليًا للفترات الزمنية المحددة.

‏MockTimers قادر أيضًا على إنشاء نموذج وهمي لكائن `Date`.

يوفر [`MockTracker`](/ar/nodejs/api/test#class-mocktracker) تصدير `timers` عالي المستوى وهو عبارة عن نسخة `MockTimers`.

### ‏`timers.enable([enableOptions])` {#timersenableenableoptions}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v21.2.0, v20.11.0 | تم تحديث المعلمات لتكون كائن خيارات مع واجهات برمجة تطبيقات متاحة والعصر الأولي الافتراضي. |
| v20.4.0, v18.19.0 | تمت إضافته في: الإصدار v20.4.0، v18.19.0 |
:::

يقوم بتمكين إنشاء نموذج وهمي للمؤقتات للمؤقتات المحددة.

- ‏`enableOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين اختيارية لتمكين إنشاء نموذج وهمي للمؤقت. يتم دعم الخصائص التالية:
    - ‏`apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة اختيارية تحتوي على المؤقتات المراد إنشاء نموذج وهمي لها. قيم المؤقت المدعومة حاليًا هي `setInterval` و `setTimeout` و `setImmediate` و `Date`. **افتراضي:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. إذا لم يتم توفير مصفوفة، فسيتم إنشاء نموذج وهمي لجميع واجهات برمجة التطبيقات المتعلقة بالوقت (`'setInterval'` و `'clearInterval'` و `'setTimeout'` و `'clearTimeout'` و `'setImmediate'` و `'clearImmediate'` و `'Date'`) بشكل افتراضي.
    - ‏`now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) رقم اختياري أو كائن Date يمثل الوقت الأولي (بالمللي ثانية) لاستخدامه كقيمة لـ `Date.now()`. **افتراضي:** ‏`0`.

**ملاحظة:** عند تمكين إنشاء نموذج وهمي لمؤقت معين، سيتم أيضًا إنشاء نموذج وهمي ضمني لوظيفة المسح المرتبطة به.

**ملاحظة:** سيؤثر إنشاء نموذج وهمي لـ `Date` على سلوك المؤقتات الوهمية لأنها تستخدم نفس الساعة الداخلية.

مثال على الاستخدام بدون تعيين الوقت الأولي:

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```
:::

يمكّن المثال أعلاه إنشاء نموذج وهمي للمؤقت `setInterval` وينشئ نموذجًا وهميًا ضمنيًا للدالة `clearInterval`. سيتم إنشاء نموذج وهمي فقط للدوال `setInterval` و `clearInterval` من [node:timers](/ar/nodejs/api/timers) و [node:timers/promises](/ar/nodejs/api/timers#timers-promises-api) و `globalThis`.

مثال على الاستخدام مع تعيين الوقت الأولي

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```
:::

مثال على الاستخدام مع كائن Date أولي كوقت تم تعيينه

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```
:::

بدلاً من ذلك، إذا قمت باستدعاء `mock.timers.enable()` بدون أي معلمات:

سيتم إنشاء نموذج وهمي لجميع المؤقتات (`'setInterval'` و `'clearInterval'` و `'setTimeout'` و `'clearTimeout'` و `'setImmediate'` و `'clearImmediate'`). سيتم إنشاء نموذج وهمي للدوال `setInterval` و `clearInterval` و `setTimeout` و `clearTimeout` و `setImmediate` و `clearImmediate` من `node:timers` و `node:timers/promises` و `globalThis`. بالإضافة إلى كائن `Date` العام.


### `timers.reset()` {#timersreset}

**تمت الإضافة في: v20.4.0، v18.19.0**

تقوم هذه الدالة باستعادة السلوك الافتراضي لجميع النماذج الوهمية التي تم إنشاؤها مسبقًا بواسطة مثيل `MockTimers` هذا وتفصل النماذج الوهمية عن مثيل `MockTracker`.

**ملاحظة:** بعد اكتمال كل اختبار، يتم استدعاء هذه الدالة على `MockTracker` لسياق الاختبار.

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.reset();
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.reset();
```
:::

### `timers[Symbol.dispose]()` {#timerssymboldispose}

يستدعي `timers.reset()`.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**تمت الإضافة في: v20.4.0، v18.19.0**

يقدم الوقت لجميع المؤقتات الوهمية.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مقدار الوقت، بالمللي ثانية، لتقديم المؤقتات. **افتراضي:** `1`.

**ملاحظة:** يختلف هذا عن كيفية تصرف `setTimeout` في Node.js ويقبل فقط الأرقام الموجبة. في Node.js، يتم دعم `setTimeout` مع الأرقام السالبة فقط لأسباب تتعلق بتوافق الويب.

يوضح المثال التالي نموذجًا وهميًا لدالة `setTimeout` وباستخدام `.tick` يتقدم في الوقت مما يؤدي إلى تشغيل جميع المؤقتات المعلقة.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

بدلاً من ذلك، يمكن استدعاء الدالة `.tick` عدة مرات

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

سيؤدي تقديم الوقت باستخدام `.tick` أيضًا إلى تقديم الوقت لأي كائن `Date` تم إنشاؤه بعد تمكين النموذج الوهمي (إذا تم تعيين `Date` أيضًا على أن يكون وهميًا).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

#### استخدام دوال `clear` {#using-clear-functions}

كما ذكرنا، يتم عمل محاكاة ضمنية لجميع دوال `clear` من المؤقتات (`clearTimeout` و `clearInterval` و `clearImmediate`). ألق نظرة على هذا المثال باستخدام `setTimeout`:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### العمل مع وحدات مؤقتات Node.js {#working-with-nodejs-timers-modules}

بمجرد تمكين محاكاة المؤقتات، يتم تمكين وحدات [node:timers](/ar/nodejs/api/timers) و [node:timers/promises](/ar/nodejs/api/timers#timers-promises-api)، والمؤقتات من سياق Node.js العالمي:

**ملاحظة:** تجريد الدوال مثل `import { setTimeout } from 'node:timers'` غير مدعوم حاليًا بواسطة واجهة برمجة التطبيقات هذه.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

في Node.js، `setInterval` من [node:timers/promises](/ar/nodejs/api/timers#timers-promises-api) هو `AsyncGenerator` وهو مدعوم أيضًا بواسطة واجهة برمجة التطبيقات هذه:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```
:::


### `timers.runAll()` {#timersrunall}

**تمت إضافتها في: v20.4.0, v18.19.0**

يقوم بتشغيل جميع المؤقتات المحاكاة المعلقة على الفور. إذا تم أيضًا محاكاة كائن `Date`، فسيتم أيضًا تقديم كائن `Date` إلى أبعد وقت للمؤقت.

يوضح المثال أدناه تشغيل جميع المؤقتات المعلقة على الفور، مما يؤدي إلى تنفيذها دون أي تأخير.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**ملاحظة:** تم تصميم وظيفة `runAll()` خصيصًا لتشغيل المؤقتات في سياق محاكاة المؤقت. ليس لها أي تأثير على ساعات النظام في الوقت الفعلي أو المؤقتات الفعلية خارج بيئة المحاكاة.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**تمت إضافتها في: v21.2.0, v20.11.0**

يضبط الطابع الزمني الحالي لنظام Unix الذي سيتم استخدامه كمرجع لأي كائنات `Date` محاكاة.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime replaces current time', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### التواريخ والمؤقتات تعمل معًا {#dates-and-timers-working-together}

تعتمد كائنات التاريخ والمؤقت على بعضها البعض. إذا كنت تستخدم `setTime()` لتمرير الوقت الحالي إلى كائن `Date` الوهمي، فلن تتأثر المؤقتات المعينة باستخدام `setTimeout` و `setInterval`.

ومع ذلك، فإن طريقة `tick` **ستقوم** بتقديم كائن `Date` الوهمي.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('تشغيل جميع الوظائف بالترتيب المحدد', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // يتم تقديم التاريخ ولكن المؤقتات لا تعمل
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('تشغيل جميع الوظائف بالترتيب المحدد', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // يتم تقديم التاريخ ولكن المؤقتات لا تعمل
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## صنف: `TestsStream` {#class-testsstream}

::: info [تاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | تمت إضافة النوع إلى أحداث test:pass و test:fail عندما يكون الاختبار مجموعة. |
| v18.9.0, v16.19.0 | تمت الإضافة في: v18.9.0, v16.19.0 |
:::

- يمتد [\<Readable\>](/ar/nodejs/api/stream#class-streamreadable)

ستؤدي المكالمة الناجحة لطريقة [`run()`](/ar/nodejs/api/test#runoptions) إلى إرجاع كائن [\<TestsStream\>](/ar/nodejs/api/test#class-testsstream) جديد، يقوم ببث سلسلة من الأحداث التي تمثل تنفيذ الاختبارات. سيصدر `TestsStream` الأحداث، بترتيب تعريف الاختبارات

يضمن إصدار بعض الأحداث بنفس ترتيب تعريف الاختبارات، بينما يتم إصدار البعض الآخر بالترتيب الذي يتم به تنفيذ الاختبارات.


### الحدث: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على تقرير التغطية.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من تقارير التغطية للملفات الفردية. كل تقرير هو كائن بالنموذج التالي:
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المسار المطلق للملف.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للأسطر.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للفروع.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للدوال.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الأسطر المغطاة.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الفروع المغطاة.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الدوال المغطاة.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المئوية للأسطر المغطاة.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المئوية للفروع المغطاة.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المئوية للدوال المغطاة.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الدوال تمثل تغطية الدوال.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الدالة.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم السطر حيث تم تعريف الدالة.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد مرات استدعاء الدالة.

    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الفروع تمثل تغطية الفروع.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم السطر حيث تم تعريف الفرع.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد مرات اتخاذ الفرع.

    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الأسطر تمثل أرقام الأسطر وعدد مرات تغطيتها.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) رقم السطر.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد مرات تغطية السطر.


    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على ما إذا كانت التغطية لكل نوع تغطية.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حد تغطية الدالة.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حد تغطية الفرع.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حد تغطية السطر.

    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على ملخص لتغطية جميع الملفات.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للأسطر.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للفروع.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للدوال.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الأسطر المغطاة.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الفروع المغطاة.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الدوال المغطاة.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المئوية للأسطر المغطاة.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المئوية للفروع المغطاة.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) النسبة المئوية للدوال المغطاة.

    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) دليل العمل عندما بدأت تغطية التعليمات البرمجية. هذا مفيد لعرض أسماء المسارات النسبية في حال غيرت الاختبارات دليل عمل عملية Node.js.

    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.


يتم إصداره عند تمكين تغطية التعليمات البرمجية وعند اكتمال جميع الاختبارات.


### الحدث: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) بيانات تعريف تنفيذ إضافية.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان الاختبار قد نجح أم لا.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مدة الاختبار بالمللي ثانية.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) خطأ يغلف الخطأ الذي تم طرحه بواسطة الاختبار إذا لم ينجح.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الخطأ الفعلي الذي تم طرحه بواسطة الاختبار.


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) نوع الاختبار، يستخدم للدلالة على ما إذا كانت هذه مجموعة اختبار.


    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم الترتيبي للاختبار.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود إذا تم استدعاء [`context.todo`](/ar/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود إذا تم استدعاء [`context.skip`](/ar/nodejs/api/test#contextskipmessage)



يتم إصداره عند اكتمال تنفيذ الاختبار. لا يتم إصدار هذا الحدث بنفس ترتيب تعريف الاختبارات. الأحداث ذات الصلة بالترتيب الإعلاني هي `'test:pass'` و `'test:fail'`.


### الحدث: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.

يتم إصداره عند إخراج اختبار من قائمة الانتظار، قبل تنفيذه مباشرة. لا يضمن هذا الحدث إصداره بنفس ترتيب تعريف الاختبارات. الحدث المرتب ذي الصلة هو `'test:start'`.

### الحدث: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رسالة التشخيص.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.

يتم إصداره عند استدعاء [`context.diagnostic`](/ar/nodejs/api/test#contextdiagnosticmessage). يضمن هذا الحدث إصداره بنفس ترتيب تعريف الاختبارات.


### الحدث: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.

يتم إصداره عندما يتم وضع اختبار في قائمة الانتظار للتنفيذ.

### الحدث: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) بيانات تعريف تنفيذ إضافية.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مدة الاختبار بالمللي ثانية.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) خطأ يغلف الخطأ الذي تم طرحه بواسطة الاختبار.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) الخطأ الفعلي الذي تم طرحه بواسطة الاختبار.

    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) نوع الاختبار، يستخدم للإشارة إلى ما إذا كانت هذه مجموعة اختبارات.

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم الترتيبي للاختبار.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود إذا تم استدعاء [`context.todo`](/ar/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود إذا تم استدعاء [`context.skip`](/ar/nodejs/api/test#contextskipmessage)

يتم إصداره عند فشل اختبار. يتم ضمان إصدار هذا الحدث بنفس ترتيب تعريف الاختبارات. الحدث المقابل المرتب حسب التنفيذ هو `'test:complete'`.


### الحدث: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) بيانات وصفية إضافية للتنفيذ.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مدة الاختبار بالمللي ثانية.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) نوع الاختبار، يستخدم للدلالة على ما إذا كانت هذه مجموعة.

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الرقم الترتيبي للاختبار.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود إذا تم استدعاء [`context.todo`](/ar/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) موجود إذا تم استدعاء [`context.skip`](/ar/nodejs/api/test#contextskipmessage)

يتم إصداره عند اجتياز الاختبار. يضمن إصدار هذا الحدث بنفس ترتيب تعريف الاختبارات. الحدث المقابل المرتب حسب التنفيذ هو `'test:complete'`.


### الحدث: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الاختبارات الفرعية التي تم تشغيلها.
  
 

يتم إصداره عند اكتمال جميع الاختبارات الفرعية لاختبار معين. يضمن إصدار هذا الحدث بنفس ترتيب تعريف الاختبارات.

### الحدث: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم العمود حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار، `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) رقم السطر حيث تم تعريف الاختبار، أو `undefined` إذا تم تشغيل الاختبار من خلال REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مستوى تداخل الاختبار.
  
 

يتم إصداره عندما يبدأ الاختبار في الإبلاغ عن حالته وحالة اختباراته الفرعية. يضمن إصدار هذا الحدث بنفس ترتيب تعريف الاختبارات. حدث الترتيب المقابل للتنفيذ هو `'test:dequeue'`.


### الحدث: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار ملف الاختبار.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الرسالة المكتوبة إلى `stderr`.

يتم إصداره عندما يكتب اختبار قيد التشغيل إلى `stderr`. يتم إصدار هذا الحدث فقط إذا تم تمرير العلامة `--test`. لا يتم ضمان إصدار هذا الحدث بنفس الترتيب الذي يتم به تعريف الاختبارات.

### الحدث: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار ملف الاختبار.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الرسالة المكتوبة إلى `stdout`.

يتم إصداره عندما يكتب اختبار قيد التشغيل إلى `stdout`. يتم إصدار هذا الحدث فقط إذا تم تمرير العلامة `--test`. لا يتم ضمان إصدار هذا الحدث بنفس الترتيب الذي يتم به تعريف الاختبارات.

### الحدث: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على عدد نتائج الاختبار المختلفة.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للاختبارات الملغاة.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للاختبارات الفاشلة.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للاختبارات الناجحة.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للاختبارات التي تم تخطيها.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للأجنحة التي تم تشغيلها.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للاختبارات التي تم تشغيلها، باستثناء الأجنحة.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي لاختبارات TODO.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) العدد الإجمالي للاختبارات والأجنحة ذات المستوى الأعلى.

    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) مدة تشغيل الاختبار بالمللي ثانية.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) مسار ملف الاختبار الذي أنشأ الملخص. إذا كان الملخص يتوافق مع ملفات متعددة، فستكون هذه القيمة `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) يشير إلى ما إذا كان تشغيل الاختبار يعتبر ناجحًا أم لا. في حالة حدوث أي حالة خطأ، مثل فشل الاختبار أو عدم استيفاء الحد الأدنى لتغطية التعليمات البرمجية، سيتم تعيين هذه القيمة على `false`.

يتم إصداره عند اكتمال تشغيل الاختبار. يحتوي هذا الحدث على مقاييس تتعلق بتشغيل الاختبار المكتمل، وهو مفيد لتحديد ما إذا كان تشغيل الاختبار قد نجح أم فشل. إذا تم استخدام عزل الاختبار على مستوى العملية، فسيتم إنشاء حدث `'test:summary'` لكل ملف اختبار بالإضافة إلى ملخص تراكمي نهائي.


### الحدث: `'test:watch:drained'` {#event-testwatchdrained}

يصدر عند عدم وجود المزيد من الاختبارات في قائمة الانتظار للتنفيذ في وضع المراقبة.

## الصنف: `TestContext` {#class-testcontext}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v20.1.0, v18.17.0 | تمت إضافة الدالة `before` إلى TestContext. |
| v18.0.0, v16.17.0 | تمت إضافتها في: v18.0.0, v16.17.0 |
:::

يتم تمرير نسخة من `TestContext` إلى كل دالة اختبار للتفاعل مع مشغل الاختبار. ومع ذلك، فإن مُنشئ `TestContext` ليس معروضًا كجزء من واجهة برمجة التطبيقات.

### `context.before([fn][, options])` {#contextbeforefn-options}

**تمت إضافتها في: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الربط. الوسيط الأول لهذه الدالة هو كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext). إذا كانت أداة الربط تستخدم ردود الاتصال، فسيتم تمرير دالة رد الاتصال كوسيط ثانٍ. **الافتراضي:** دالة لا تفعل شيئًا.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين لأداة الربط. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء أداة ربط قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بالمللي ثانية تفشل أداة الربط بعده. إذا لم يتم تحديده، فإن الاختبارات الفرعية ترث هذه القيمة من الأصل. **الافتراضي:** `Infinity`.
  
 

تُستخدم هذه الدالة لإنشاء أداة ربط تعمل قبل الاختبار الفرعي للاختبار الحالي.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**تمت إضافتها في: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الربط. الوسيط الأول لهذه الدالة هو كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext). إذا كانت أداة الربط تستخدم ردود الاتصال، فسيتم تمرير دالة رد الاتصال كوسيط ثانٍ. **الافتراضي:** دالة لا تفعل شيئًا.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين لأداة الربط. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء أداة ربط قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بالمللي ثانية تفشل أداة الربط بعده. إذا لم يتم تحديده، فإن الاختبارات الفرعية ترث هذه القيمة من الأصل. **الافتراضي:** `Infinity`.
  
 

تُستخدم هذه الدالة لإنشاء أداة ربط تعمل قبل كل اختبار فرعي للاختبار الحالي.

```js [ESM]
test('اختبار المستوى الأعلى', async (t) => {
  t.beforeEach((t) => t.diagnostic(`على وشك تشغيل ${t.name}`));
  await t.test(
    'هذا اختبار فرعي',
    (t) => {
      assert.ok('بعض التأكيدات ذات الصلة هنا');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**أُضيف في:** v19.3.0, v18.13.0

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الخطاف. الوسيط الأول لهذه الدالة هو كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext). إذا كان الخطاف يستخدم ردود النداء، فسيتم تمرير دالة رد النداء كوسيط ثانٍ. **افتراضي:** دالة لا تفعل شيئًا.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين الخطاف. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء خطاف قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي سيفشل بعدها الخطاف. إذا لم يتم تحديده، فسوف ترث الاختبارات الفرعية هذه القيمة من الأصل الخاص بها. **افتراضي:** `Infinity`.

تُستخدم هذه الدالة لإنشاء خطاف يعمل بعد انتهاء الاختبار الحالي.

```js [ESM]
test('اختبار المستوى الأعلى', async (t) => {
  t.after((t) => t.diagnostic(`تم الانتهاء من تشغيل ${t.name}`));
  assert.ok('بعض التأكيدات ذات الصلة هنا');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**أُضيف في:** v18.8.0, v16.18.0

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) دالة الخطاف. الوسيط الأول لهذه الدالة هو كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext). إذا كان الخطاف يستخدم ردود النداء، فسيتم تمرير دالة رد النداء كوسيط ثانٍ. **افتراضي:** دالة لا تفعل شيئًا.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات تكوين الخطاف. الخصائص التالية مدعومة:
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء خطاف قيد التقدم.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد المللي ثانية التي سيفشل بعدها الخطاف. إذا لم يتم تحديده، فسوف ترث الاختبارات الفرعية هذه القيمة من الأصل الخاص بها. **افتراضي:** `Infinity`.

تُستخدم هذه الدالة لإنشاء خطاف يعمل بعد كل اختبار فرعي للاختبار الحالي.

```js [ESM]
test('اختبار المستوى الأعلى', async (t) => {
  t.afterEach((t) => t.diagnostic(`تم الانتهاء من تشغيل ${t.name}`));
  await t.test(
    'هذا اختبار فرعي',
    (t) => {
      assert.ok('بعض التأكيدات ذات الصلة هنا');
    },
  );
});
```

### `context.assert` {#contextassert}

**تمت الإضافة في: v22.2.0, v20.15.0**

كائن يحتوي على أساليب التأكيد المرتبطة بـ `context`. يتم عرض الدوال ذات المستوى الأعلى من وحدة `node:assert` هنا لغرض إنشاء خطط الاختبار.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**تمت الإضافة في: v22.3.0**

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).0 - تطوير مبكر
:::

- `value` [\<any\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Data_structures#Data_types) قيمة يتم تسلسلها إلى سلسلة. إذا تم بدء Node.js باستخدام العلامة [`--test-update-snapshots`](/ar/nodejs/api/cli#--test-update-snapshots)، فستتم كتابة القيمة المسلسلة في ملف اللقطة. وإلا، تتم مقارنة القيمة المسلسلة بالقيمة المقابلة في ملف اللقطة الموجود.
- `options` [\<Object\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين الاختيارية. الخصائص التالية مدعومة:
    - `serializers` [\<Array\>](https://developer.mozilla.org/ar/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الدوال المتزامنة المستخدمة لتسلسل `value` إلى سلسلة. يتم تمرير `value` كوسيطة وحيدة إلى دالة التسلسل الأولى. يتم تمرير القيمة المرجعة لكل مسلسِل كمدخل للمسلسِل التالي. بمجرد تشغيل جميع المسلسلات، يتم إجبار القيمة الناتجة على سلسلة. **الافتراضي:** إذا لم يتم توفير أي مسلسلات، فسيتم استخدام المسلسلات الافتراضية لتشغيل الاختبار.

تنفذ هذه الدالة تأكيدات لاختبار اللقطات.

```js [ESM]
test('snapshot test with default serialization', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('snapshot test with custom serialization', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**أضيف في: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الرسالة التي سيتم الإبلاغ عنها.

تُستخدم هذه الدالة لكتابة التشخيصات في الإخراج. يتم تضمين أي معلومات تشخيصية في نهاية نتائج الاختبار. لا تُرجع هذه الدالة قيمة.

```js [ESM]
test('top level test', (t) => {
  t.diagnostic('A diagnostic message');
});
```
### `context.filePath` {#contextfilepath}

**أضيف في: v22.6.0, v20.16.0**

المسار المطلق لملف الاختبار الذي أنشأ الاختبار الحالي. إذا استورد ملف اختبار وحدات نمطية إضافية تولد اختبارات، فستُرجع الاختبارات المستوردة مسار ملف الاختبار الجذر.

### `context.fullName` {#contextfullname}

**أضيف في: v22.3.0**

اسم الاختبار وكل من أسلافه، مفصولة بـ `\>`.

### `context.name` {#contextname}

**أضيف في: v18.8.0, v16.18.0**

اسم الاختبار.

### `context.plan(count)` {#contextplancount}


::: info [سجل التغييرات]
| الإصدار | التغييرات |
| --- | --- |
| v23.4.0 | هذه الدالة لم تعد تجريبية. |
| v22.2.0, v20.15.0 | أضيف في: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد التأكيدات والاختبارات الفرعية المتوقع تشغيلها.

تُستخدم هذه الدالة لتعيين عدد التأكيدات والاختبارات الفرعية المتوقع تشغيلها داخل الاختبار. إذا كان عدد التأكيدات والاختبارات الفرعية التي يتم تشغيلها لا يتطابق مع العدد المتوقع، فسيفشل الاختبار.

```js [ESM]
test('top level test', (t) => {
  t.plan(2);
  t.assert.ok('some relevant assertion here');
  t.test('subtest', () => {});
});
```
عند العمل مع التعليمات البرمجية غير المتزامنة، يمكن استخدام دالة `plan` للتأكد من تشغيل العدد الصحيح من التأكيدات:

```js [ESM]
test('planning with streams', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```

### ‏`context.runOnly(shouldRunOnlyTests)` {#contextrunonlyshouldrunonlytests}

**تمت الإضافة في: الإصدار 18.0.0، الإصدار 16.17.0**

- ‏`shouldRunOnlyTests` ‏[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) سواء كان سيتم تشغيل اختبارات `only` أم لا.

إذا كانت قيمة `shouldRunOnlyTests` صالحة، فسياق الاختبار سيشغل فقط الاختبارات التي تم تعيين خيار `only` لها. بخلاف ذلك، يتم تشغيل جميع الاختبارات. إذا لم يتم بدء Node.js باستخدام خيار سطر الأوامر [`--test-only`](/ar/nodejs/api/cli#--test-only)، فإن هذه الوظيفة لا تفعل شيئًا.

```js [ESM]
test('اختبار المستوى الأعلى', (t) => {
  // يمكن ضبط سياق الاختبار لتشغيل الاختبارات الفرعية بخيار 'only'.
  t.runOnly(true);
  return Promise.all([
    t.test('هذا الاختبار الفرعي يتم تخطيه الآن'),
    t.test('يتم تشغيل هذا الاختبار الفرعي', { only: true }),
  ]);
});
```
### ‏`context.signal` {#contextsignal}

**تمت الإضافة في: الإصدار 18.7.0، الإصدار 16.17.0**

- النوع: ‏[\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)

يمكن استخدامه لإلغاء مهام الاختبار الفرعية عندما يتم إلغاء الاختبار.

```js [ESM]
test('اختبار المستوى الأعلى', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### ‏`context.skip([message])` {#contextskipmessage}

**تمت الإضافة في: الإصدار 18.0.0، الإصدار 16.17.0**

- ‏`message` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رسالة تخطي اختيارية.

تتسبب هذه الوظيفة في إشارة مخرجات الاختبار إلى الاختبار على أنه تم تخطيه. إذا تم توفير `message`، فسيتم تضمينها في المخرجات. استدعاء `skip()` لا ينهي تنفيذ وظيفة الاختبار. لا تُرجع هذه الوظيفة قيمة.

```js [ESM]
test('اختبار المستوى الأعلى', (t) => {
  // تأكد من الإرجاع هنا أيضًا إذا كان الاختبار يحتوي على منطق إضافي.
  t.skip('تم تخطي هذا');
});
```
### ‏`context.todo([message])` {#contexttodomessage}

**تمت الإضافة في: الإصدار 18.0.0، الإصدار 16.17.0**

- ‏`message` ‏[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رسالة `TODO` اختيارية.

تضيف هذه الوظيفة توجيه `TODO` إلى مخرجات الاختبار. إذا تم توفير `message`، فسيتم تضمينها في المخرجات. استدعاء `todo()` لا ينهي تنفيذ وظيفة الاختبار. لا تُرجع هذه الوظيفة قيمة.

```js [ESM]
test('اختبار المستوى الأعلى', (t) => {
  // تم وضع علامة `TODO` على هذا الاختبار
  t.todo('هذا عنصر يجب تنفيذه لاحقًا');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [السجل]
| الإصدار | التغييرات |
|---|---|
| v18.8.0, v16.18.0 | إضافة خيار `signal`. |
| v18.7.0, v16.17.0 | إضافة خيار `timeout`. |
| v18.0.0, v16.17.0 | أُضيف في: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الاختبار الفرعي، والذي يتم عرضه عند الإبلاغ عن نتائج الاختبار. **الافتراضي:** الخاصية `name` لـ `fn`، أو `'\<anonymous\>'` إذا لم يكن لـ `fn` اسم.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التهيئة للاختبار الفرعي. الخصائص التالية مدعومة:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) إذا تم توفير رقم، فسيتم تشغيل هذا العدد من الاختبارات بالتوازي داخل مؤشر ترابط التطبيق. إذا كانت `true`، فسيتم تشغيل جميع الاختبارات الفرعية بالتوازي. إذا كانت `false`، فسيتم تشغيل اختبار واحد فقط في كل مرة. إذا لم يتم تحديدها، فسوف ترث الاختبارات الفرعية هذه القيمة من أصلها. **الافتراضي:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت صحيحة، وتم تكوين سياق الاختبار لتشغيل اختبارات `only`، فسيتم تشغيل هذا الاختبار. بخلاف ذلك، يتم تخطي الاختبار. **الافتراضي:** `false`.
    - `signal` [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal) يسمح بإلغاء اختبار قيد التقدم.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت صحيحة، يتم تخطي الاختبار. إذا تم توفير سلسلة، فسيتم عرض هذه السلسلة في نتائج الاختبار كسبب لتخطي الاختبار. **الافتراضي:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) إذا كانت صحيحة، يتم وضع علامة على الاختبار كـ `TODO`. إذا تم توفير سلسلة، فسيتم عرض هذه السلسلة في نتائج الاختبار كسبب لكون الاختبار `TODO`. **الافتراضي:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد بالميلي ثانية سيفشل الاختبار بعده. إذا لم يتم تحديدها، فسوف ترث الاختبارات الفرعية هذه القيمة من أصلها. **الافتراضي:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد التأكيدات والاختبارات الفرعية المتوقع تشغيلها في الاختبار. إذا كان عدد التأكيدات التي تم تشغيلها في الاختبار لا يتطابق مع الرقم المحدد في الخطة، فسيفشل الاختبار. **الافتراضي:** `undefined`.


- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) الدالة قيد الاختبار. الوسيطة الأولى لهذه الدالة هي كائن [`TestContext`](/ar/nodejs/api/test#class-testcontext). إذا كان الاختبار يستخدم ردود الاتصال، فسيتم تمرير دالة رد الاتصال كوسيطة ثانية. **الافتراضي:** دالة لا تفعل شيئًا.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) مُحقق بـ `undefined` بمجرد اكتمال الاختبار.

تُستخدم هذه الدالة لإنشاء اختبارات فرعية ضمن الاختبار الحالي. تتصرف هذه الدالة بنفس طريقة دالة [`test()`](/ar/nodejs/api/test#testname-options-fn) ذات المستوى الأعلى.

```js [ESM]
test('اختبار المستوى الأعلى', async (t) => {
  await t.test(
    'هذا اختبار فرعي',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('بعض التأكيدات ذات الصلة هنا');
    },
  );
});
```

## الفئة: `SuiteContext` {#class-suitecontext}

**تمت الإضافة في: v18.7.0, v16.17.0**

يتم تمرير نسخة من `SuiteContext` إلى كل دالة مجموعة اختبار للتفاعل مع مُشغِّل الاختبارات. ومع ذلك، فإن مُنشئ `SuiteContext` غير معروض كجزء من واجهة برمجة التطبيقات (API).

### `context.filePath` {#contextfilepath_1}

**تمت الإضافة في: v22.6.0**

المسار المطلق لملف الاختبار الذي أنشأ المجموعة الحالية. إذا استورد ملف اختبار وحدات نمطية إضافية تُنشئ مجموعات اختبار، فستُعيد المجموعات المستوردة مسار ملف الاختبار الجذر.

### `context.name` {#contextname_1}

**تمت الإضافة في: v18.8.0, v16.18.0**

اسم المجموعة.

### `context.signal` {#contextsignal_1}

**تمت الإضافة في: v18.7.0, v16.17.0**

- النوع: [\<AbortSignal\>](/ar/nodejs/api/globals#class-abortsignal)

يمكن استخدامه لإلغاء مهام الاختبار الفرعية عند إلغاء الاختبار.

