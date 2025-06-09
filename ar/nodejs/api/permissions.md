---
title: توثيق واجهة برمجة التطبيقات (API) للأذونات في Node.js
description: توفر توثيق واجهة برمجة التطبيقات (API) للأذونات في Node.js إرشادات حول كيفية إدارة والتحكم في الأذونات لعمليات مختلفة داخل تطبيقات Node.js، مما يضمن الوصول الآمن والمراقب إلى موارد النظام.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات (API) للأذونات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر توثيق واجهة برمجة التطبيقات (API) للأذونات في Node.js إرشادات حول كيفية إدارة والتحكم في الأذونات لعمليات مختلفة داخل تطبيقات Node.js، مما يضمن الوصول الآمن والمراقب إلى موارد النظام.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات (API) للأذونات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر توثيق واجهة برمجة التطبيقات (API) للأذونات في Node.js إرشادات حول كيفية إدارة والتحكم في الأذونات لعمليات مختلفة داخل تطبيقات Node.js، مما يضمن الوصول الآمن والمراقب إلى موارد النظام.
---


# الأذونات {#permissions}

يمكن استخدام الأذونات للتحكم في موارد النظام التي يمكن لعملية Node.js الوصول إليها أو الإجراءات التي يمكن للعملية اتخاذها فيما يتعلق بتلك الموارد.

- [الأذونات المستندة إلى العملية](/ar/nodejs/api/permissions#process-based-permissions) تتحكم في وصول عملية Node.js إلى الموارد. يمكن السماح بالوصول إلى المورد بشكل كامل أو رفضه، أو يمكن التحكم في الإجراءات المتعلقة به. على سبيل المثال، يمكن السماح بقراءات نظام الملفات مع رفض الكتابة. لا تحمي هذه الميزة من التعليمات البرمجية الخبيثة. وفقًا [لسياسة أمان](https://github.com/nodejs/node/blob/main/SECURITY.md) Node.js، تثق Node.js في أي تعليمات برمجية يُطلب منها تشغيلها.

يطبق نموذج الأذونات نهج "حزام الأمان"، الذي يمنع التعليمات البرمجية الموثوقة من تغيير الملفات عن غير قصد أو استخدام الموارد التي لم يتم منح الوصول إليها بشكل صريح. لا يوفر ضمانات أمنية في وجود تعليمات برمجية خبيثة. يمكن للتعليمات البرمجية الخبيثة تجاوز نموذج الأذونات وتنفيذ تعليمات برمجية عشوائية دون القيود التي يفرضها نموذج الأذونات.

إذا وجدت ثغرة أمنية محتملة، فيرجى الرجوع إلى [سياسة الأمان](https://github.com/nodejs/node/blob/main/SECURITY.md) الخاصة بنا.

## الأذونات المستندة إلى العملية {#process-based-permissions}

### نموذج الأذونات {#permission-model}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر.
:::

نموذج أذونات Node.js هو آلية لتقييد الوصول إلى موارد محددة أثناء التنفيذ. توجد واجهة برمجة التطبيقات خلف علامة [`--permission`](/ar/nodejs/api/cli#--permission) التي عند تمكينها، ستقيد الوصول إلى جميع الأذونات المتاحة.

الأذونات المتاحة موثقة بواسطة علامة [`--permission`](/ar/nodejs/api/cli#--permission).

عند بدء Node.js باستخدام `--permission`، سيتم تقييد القدرة على الوصول إلى نظام الملفات من خلال وحدة `fs`، وعمليات التفريخ، واستخدام `node:worker_threads`، واستخدام الإضافات الأصلية، واستخدام WASI، وتمكين مفتش وقت التشغيل.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
يمكن السماح بالوصول إلى تفريخ عملية وإنشاء سلاسل عاملة باستخدام [`--allow-child-process`](/ar/nodejs/api/cli#--allow-child-process) و [`--allow-worker`](/ar/nodejs/api/cli#--allow-worker) على التوالي.

للسماح بالإضافات الأصلية عند استخدام نموذج الأذونات، استخدم علامة [`--allow-addons`](/ar/nodejs/api/cli#--allow-addons). بالنسبة لـ WASI، استخدم علامة [`--allow-wasi`](/ar/nodejs/api/cli#--allow-wasi).


#### واجهة برمجة التطبيقات وقت التشغيل {#runtime-api}

عند تمكين نموذج الأذونات من خلال العلامة [`--permission`](/ar/nodejs/api/cli#--permission) تتم إضافة خاصية جديدة `permission` إلى كائن `process`. تحتوي هذه الخاصية على دالة واحدة:

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

استدعاء واجهة برمجة التطبيقات للتحقق من الأذونات في وقت التشغيل ([`permission.has()`](/ar/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### أذونات نظام الملفات {#file-system-permissions}

يقيد نموذج الأذونات، بشكل افتراضي، الوصول إلى نظام الملفات من خلال الوحدة `node:fs`. ولا يضمن عدم تمكن المستخدمين من الوصول إلى نظام الملفات بوسائل أخرى، مثل الوحدة `node:sqlite`.

للسماح بالوصول إلى نظام الملفات، استخدم العلامات [`--allow-fs-read`](/ar/nodejs/api/cli#--allow-fs-read) و [`--allow-fs-write`](/ar/nodejs/api/cli#--allow-fs-write):

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
الوسائط الصالحة لكلتا العلامتين هي:

- `*` - للسماح بجميع عمليات `FileSystemRead` أو `FileSystemWrite`، على التوالي.
- المسارات مفصولة بفواصل (`,`) للسماح فقط بعمليات `FileSystemRead` أو `FileSystemWrite` المطابقة، على التوالي.

مثال:

- `--allow-fs-read=*` - سيسمح بجميع عمليات `FileSystemRead`.
- `--allow-fs-write=*` - سيسمح بجميع عمليات `FileSystemWrite`.
- `--allow-fs-write=/tmp/` - سيسمح بالوصول إلى `FileSystemWrite` إلى المجلد `/tmp/`.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - يسمح بالوصول إلى `FileSystemRead` إلى المجلد `/tmp/` **و** المسار `/home/.gitignore`.

تُدعم الأحرف بدلًا من ذلك:

- `--allow-fs-read=/home/test*` سيسمح بالوصول للقراءة إلى كل ما يطابق الحرف بدلًا من ذلك. على سبيل المثال: `/home/test/file1` أو `/home/test2`

بعد تمرير حرف بدل (`*`) سيتم تجاهل جميع الأحرف اللاحقة. على سبيل المثال: `/home/*.js` ستعمل بشكل مشابه لـ `/home/*`.

عند تهيئة نموذج الأذونات، سيضيف تلقائيًا حرف بدل (*) إذا كان الدليل المحدد موجودًا. على سبيل المثال، إذا كان `/home/test/files` موجودًا، فسيتم التعامل معه على أنه `/home/test/files/*`. ومع ذلك، إذا لم يكن الدليل موجودًا، فلن تتم إضافة حرف البدل، وسيقتصر الوصول على `/home/test/files`. إذا كنت تريد السماح بالوصول إلى مجلد غير موجود بعد، فتأكد من تضمين حرف البدل بشكل صريح: `/my-path/folder-do-not-exist/*`.


#### قيود نموذج الأذونات {#permission-model-constraints}

هناك قيود تحتاج إلى معرفتها قبل استخدام هذا النظام:

- النموذج لا يرث إلى عملية عقدة فرعية أو خيط عامل.
- عند استخدام نموذج الأذونات، سيتم تقييد الميزات التالية:
    - الوحدات الأصلية
    - العملية الفرعية
    - خيوط العمال
    - بروتوكول الفحص
    - الوصول إلى نظام الملفات
    - واسي

- يتم تهيئة نموذج الأذونات بعد إعداد بيئة Node.js. ومع ذلك، تم تصميم بعض العلامات مثل `--env-file` أو `--openssl-config` لقراءة الملفات قبل تهيئة البيئة. ونتيجة لذلك، فإن هذه العلامات لا تخضع لقواعد نموذج الأذونات. وينطبق الأمر نفسه على علامات V8 التي يمكن تعيينها عبر وقت التشغيل من خلال `v8.setFlagsFromString`.
- لا يمكن طلب محركات OpenSSL في وقت التشغيل عند تمكين نموذج الأذونات، مما يؤثر على وحدات التشفير المضمنة و https و tls.
- لا يمكن تحميل ملحقات وقت التشغيل القابلة للتحميل عند تمكين نموذج الأذونات، مما يؤثر على وحدة sqlite.
- يؤدي استخدام واصفات الملفات الموجودة عبر وحدة `node:fs` إلى تجاوز نموذج الأذونات.

#### القيود والمشاكل المعروفة {#limitations-and-known-issues}

- سيتم تتبع الروابط الرمزية حتى إلى المواقع الموجودة خارج مجموعة المسارات التي تم منح الوصول إليها. قد تسمح الروابط الرمزية النسبية بالوصول إلى ملفات ودلائل عشوائية. عند بدء تشغيل التطبيقات مع تمكين نموذج الأذونات، يجب التأكد من عدم وجود مسارات تم منح الوصول إليها تحتوي على روابط رمزية نسبية.

