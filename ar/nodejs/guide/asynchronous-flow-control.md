---
title: التحكم في التدفق غير المتزامن في جافا سكريبت
description: فهم التحكم في التدفق غير المتزامن في جافا سكريبت، بما في ذلك الاستدعاءات الراجعة، إدارة الحالة، وأنماط تدفق التحكم.
head:
  - - meta
    - name: og:title
      content: التحكم في التدفق غير المتزامن في جافا سكريبت | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: فهم التحكم في التدفق غير المتزامن في جافا سكريبت، بما في ذلك الاستدعاءات الراجعة، إدارة الحالة، وأنماط تدفق التحكم.
  - - meta
    - name: twitter:title
      content: التحكم في التدفق غير المتزامن في جافا سكريبت | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: فهم التحكم في التدفق غير المتزامن في جافا سكريبت، بما في ذلك الاستدعاءات الراجعة، إدارة الحالة، وأنماط تدفق التحكم.
---


# التحكم في التدفق غير المتزامن

::: info
المادة الموجودة في هذا المنشور مستوحاة بشدة من [كتاب Mixu's Node.js](http://book.mixu.net/node/ch7.html).
:::

تم تصميم JavaScript في جوهرها بحيث لا تكون حظرًا على "الخيط الرئيسي"، وهذا هو المكان الذي يتم فيه عرض طرق العرض. يمكنك تخيل أهمية ذلك في المتصفح. عندما يتم حظر الخيط الرئيسي، فإنه يؤدي إلى "التجميد" سيئ السمعة الذي يخشاه المستخدمون النهائيون، ولا يمكن إرسال أي أحداث أخرى مما يؤدي إلى فقدان الحصول على البيانات، على سبيل المثال.

يخلق هذا بعض القيود الفريدة التي لا يمكن علاجها إلا بأسلوب برمجة وظيفي. هذا هو المكان الذي تأتي فيه عمليات الاسترجاع في الصورة.

ومع ذلك، يمكن أن يصبح التعامل مع عمليات الاسترجاع أمرًا صعبًا في الإجراءات الأكثر تعقيدًا. غالبًا ما يؤدي هذا إلى "جحيم الاسترجاعات" حيث تجعل الوظائف المتداخلة المتعددة مع عمليات الاسترجاع قراءة التعليمات البرمجية وتصحيحها وتنظيمها وما إلى ذلك أكثر صعوبة.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // do something with output
        });
      });
    });
  });
});
```

بالطبع، في الحياة الواقعية، من المرجح أن تكون هناك أسطر إضافية من التعليمات البرمجية للتعامل مع `result1` و `result2` وما إلى ذلك، وبالتالي، فإن طول وتعقيد هذه المشكلة عادةً ما ينتج عنه رمز يبدو أكثر فوضوية من المثال أعلاه.

**هذا هو المكان الذي تكون فيه الوظائف ذات فائدة كبيرة. تتكون العمليات الأكثر تعقيدًا من العديد من الوظائف:**

1. نمط البادئ / الإدخال
2. البرامج الوسيطة
3. الطرفية

**"نمط البادئ / الإدخال" هو الوظيفة الأولى في التسلسل. ستقبل هذه الوظيفة الإدخال الأصلي، إن وجد، للعملية. العملية عبارة عن سلسلة قابلة للتنفيذ من الوظائف، وسيكون الإدخال الأصلي في المقام الأول:**

1. متغيرات في بيئة عالمية
2. استدعاء مباشر مع أو بدون وسيطات
3. القيم التي تم الحصول عليها عن طريق نظام الملفات أو طلبات الشبكة

يمكن أن تكون طلبات الشبكة طلبات واردة بدأتها شبكة أجنبية، أو تطبيق آخر على نفس الشبكة، أو التطبيق نفسه على نفس الشبكة أو شبكة أجنبية.

ستُرجع وظيفة البرنامج الوسيط وظيفة أخرى، وستستدعي وظيفة الطرفية عملية الاسترجاع. يوضح ما يلي التدفق إلى طلبات الشبكة أو نظام الملفات. هنا يكون الكمون 0 لأن كل هذه القيم متوفرة في الذاكرة.

```js
function final(someInput, callback) {
  callback(`${someInput} and terminated by executing callback `);
}
function middleware(someInput, callback) {
  return final(`${someInput} touched by middleware `, callback);
}
function initiate() {
  const someInput = 'hello this is a function ';
  middleware(someInput, function (result) {
    console.log(result);
    // requires callback to `return` result
  });
}
initiate();
```

## إدارة الحالة

قد تكون الدوال أو لا تكون معتمدة على الحالة. ينشأ الاعتماد على الحالة عندما يعتمد الإدخال أو متغير آخر للدالة على دالة خارجية.

**بهذه الطريقة، هناك استراتيجيتان أساسيتان لإدارة الحالة:**

1. تمرير المتغيرات مباشرة إلى دالة، و
2. الحصول على قيمة متغير من ذاكرة تخزين مؤقت، أو جلسة، أو ملف، أو قاعدة بيانات، أو شبكة، أو مصدر خارجي آخر.

لاحظ أنني لم أذكر المتغير العام. غالبًا ما تكون إدارة الحالة باستخدام المتغيرات العامة نمطًا سيئًا غير منظم يجعل من الصعب أو المستحيل ضمان الحالة. يجب تجنب المتغيرات العامة في البرامج المعقدة قدر الإمكان.

## تدفق التحكم

إذا كان الكائن متاحًا في الذاكرة، فمن الممكن التكرار، ولن يكون هناك تغيير في تدفق التحكم:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} بيرة على الحائط، أنت تأخذ واحدة وتمررها، ${
      i - 1
    } زجاجة بيرة على الحائط\n`;
    if (i === 1) {
      _song += "هيا بنا نحضر المزيد من البيرة";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("الأغنية فارغة ''، أطعمني أغنية!");
  console.log(_song);
}
const song = getSong();
// هذا سيعمل
singSong(song);
```

ومع ذلك، إذا كانت البيانات موجودة خارج الذاكرة، فلن يعمل التكرار بعد الآن:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} بيرة على الحائط، أنت تأخذ واحدة وتمررها، ${
        i - 1
      } زجاجة بيرة على الحائط\n`;
      if (i === 1) {
        _song += "هيا بنا نحضر المزيد من البيرة";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("الأغنية فارغة ''، أطعمني أغنية!");
  console.log(_song);
}
const song = getSong('beer');
// هذا لن يعمل
singSong(song);
// خطأ غير معالج: الأغنية فارغة ''، أطعمني أغنية!
```

لماذا حدث هذا؟ `setTimeout` يأمر وحدة المعالجة المركزية بتخزين التعليمات في مكان آخر على الناقل، ويأمر بجدولة البيانات ليتم استلامها في وقت لاحق. تمر آلاف دورات وحدة المعالجة المركزية قبل أن تصل الدالة مرة أخرى عند علامة 0 مللي ثانية، وتجلب وحدة المعالجة المركزية التعليمات من الناقل وتنفذها. المشكلة الوحيدة هي أن الأغنية ('') تم إرجاعها قبل آلاف الدورات.

يحدث الموقف نفسه في التعامل مع أنظمة الملفات وطلبات الشبكة. لا يمكن ببساطة حظر الخيط الرئيسي لفترة غير محددة من الوقت - لذلك، نستخدم ردود الاتصال لجدولة تنفيذ التعليمات البرمجية في الوقت المناسب بطريقة محكمة.

ستكون قادرًا على إجراء جميع عملياتك تقريبًا باستخدام الأنماط الثلاثة التالية:

1. **في سلسلة:** سيتم تنفيذ الدوال بترتيب تسلسلي صارم، وهذا يشبه إلى حد كبير حلقات `for`.

```js
// العمليات معرّفة في مكان آخر وجاهزة للتنفيذ
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // ينفذ الدالة
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // انتهى
  executeFunctionWithArgs(operation, function (result) {
    // استمر بعد رد الاتصال
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `توازي كامل`: عندما لا يكون الترتيب مشكلة، مثل إرسال بريد إلكتروني إلى قائمة تضم 1,000,000 مستلم بريد إلكتروني.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` هو عميل SMTP افتراضي
  sendMail(
    {
      subject: 'عشاء الليلة',
      message: 'لدينا الكثير من الملفوف في الطبق. هل أنت قادم؟',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`النتيجة: ${result.count} محاولة \
      & ${result.success} رسالة بريد إلكتروني ناجحة`);
  if (result.failed.length)
    console.log(`فشل الإرسال إلى: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **توازي محدود**: توازي مع حد، مثل إرسال بريد إلكتروني بنجاح إلى 1,000,000 مستلم من قائمة تضم 10 ملايين مستخدم.

```js
let successCount = 0;
function final() {
  console.log(`تم إرسال ${successCount} رسالة بريد إلكتروني`);
  console.log('انتهى');
}
function dispatch(recipient, callback) {
  // `sendEmail` هو عميل SMTP افتراضي
  sendMail(
    {
      subject: 'عشاء الليلة',
      message: 'لدينا الكثير من الملفوف في الطبق. هل أنت قادم؟',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

لكل منها حالات استخدام ومزايا ومشاكل خاصة بها يمكنك تجربتها والقراءة عنها بمزيد من التفصيل. الأهم من ذلك، تذكر أن تجعل عملياتك معيارية واستخدم ردود الاتصال! إذا شعرت بأي شك، فتعامل مع كل شيء كما لو كان برنامج وسيط!

