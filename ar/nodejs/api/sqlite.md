---
title: توثيق واجهة برمجة التطبيقات (API) لـ SQLite في Node.js
description: توفر توثيق واجهة برمجة التطبيقات (API) لـ SQLite في Node.js تفاصيل شاملة حول كيفية التفاعل مع قواعد بيانات SQLite داخل تطبيقات Node.js. يشمل إدارة الاتصال بقاعدة البيانات، وتنفيذ استعلامات SQL، ومعالجة المعاملات، وإدارة الأخطاء.
head:
  - - meta
    - name: og:title
      content: توثيق واجهة برمجة التطبيقات (API) لـ SQLite في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر توثيق واجهة برمجة التطبيقات (API) لـ SQLite في Node.js تفاصيل شاملة حول كيفية التفاعل مع قواعد بيانات SQLite داخل تطبيقات Node.js. يشمل إدارة الاتصال بقاعدة البيانات، وتنفيذ استعلامات SQL، ومعالجة المعاملات، وإدارة الأخطاء.
  - - meta
    - name: twitter:title
      content: توثيق واجهة برمجة التطبيقات (API) لـ SQLite في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر توثيق واجهة برمجة التطبيقات (API) لـ SQLite في Node.js تفاصيل شاملة حول كيفية التفاعل مع قواعد بيانات SQLite داخل تطبيقات Node.js. يشمل إدارة الاتصال بقاعدة البيانات، وتنفيذ استعلامات SQL، ومعالجة المعاملات، وإدارة الأخطاء.
---


# SQLite {#sqlite}

**أُضيف في:** v22.5.0

::: warning [مستقر: 1 - تجريبي]
[مستقر: 1](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 1](/ar/nodejs/api/documentation#stability-index).1 - تطوير نشط.
:::

**كود المصدر:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

تسهل وحدة `node:sqlite` العمل مع قواعد بيانات SQLite. للوصول إليها:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

هذه الوحدة متاحة فقط ضمن مخطط `node:`.

يوضح المثال التالي الاستخدام الأساسي لوحدة `node:sqlite` لفتح قاعدة بيانات في الذاكرة، وكتابة البيانات في قاعدة البيانات، ثم قراءة البيانات مرة أخرى.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## الفئة: `DatabaseSync` {#class-databasesync}

**تمت الإضافة في: v22.5.0**

تمثل هذه الفئة [اتصالًا](https://www.sqlite.org/c3ref/sqlite3) واحدًا بقاعدة بيانات SQLite. يتم تنفيذ جميع واجهات برمجة التطبيقات (APIs) التي تعرضها هذه الفئة بشكل متزامن.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**تمت الإضافة في: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) موقع قاعدة البيانات. يمكن تخزين قاعدة بيانات SQLite في ملف أو بشكل كامل [في الذاكرة](https://www.sqlite.org/inmemorydb). لاستخدام قاعدة بيانات مدعومة بملف، يجب أن يكون الموقع مسار ملف. لاستخدام قاعدة بيانات في الذاكرة، يجب أن يكون الموقع هو الاسم الخاص `':memory:'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين لاتصال قاعدة البيانات. الخيارات التالية مدعومة:
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم فتح قاعدة البيانات بواسطة المُنشئ. عندما تكون هذه القيمة `false`، يجب فتح قاعدة البيانات عبر طريقة `open()`. **افتراضي:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم فتح قاعدة البيانات في وضع القراءة فقط. إذا كانت قاعدة البيانات غير موجودة، فسيفشل فتحها. **افتراضي:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تمكين قيود المفتاح الخارجي. يوصى بذلك ولكن يمكن تعطيله للتوافق مع مخططات قواعد البيانات القديمة. يمكن تمكين وتطبيقي قيود المفتاح الخارجي بعد فتح قاعدة البيانات باستخدام [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **افتراضي:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فستقبل SQLite [سلاسل الأحرف الحرفية المقتبسة المزدوجة](https://www.sqlite.org/quirks#dblquote). لا يوصى بذلك ولكن يمكن تمكينه للتوافق مع مخططات قواعد البيانات القديمة. **افتراضي:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تمكين وظيفة SQL `loadExtension` وطريقة `loadExtension()`. يمكنك استدعاء `enableLoadExtension(false)` لاحقًا لتعطيل هذه الميزة. **افتراضي:** `false`.

يقوم بإنشاء مثيل `DatabaseSync` جديد.


### `database.close()` {#databaseclose}

**تمت إضافته في: الإصدار 22.5.0**

يغلق اتصال قاعدة البيانات. يتم طرح استثناء إذا كانت قاعدة البيانات غير مفتوحة. هذه الطريقة هي التفاف حول [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**تمت إضافته في: الإصدار 23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مسار المكتبة المشتركة التي سيتم تحميلها.

يقوم بتحميل مكتبة مشتركة في اتصال قاعدة البيانات. هذه الطريقة هي التفاف حول [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). من الضروري تمكين خيار `allowExtension` عند إنشاء مثيل `DatabaseSync`.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**تمت إضافته في: الإصدار 23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا كان سيتم السماح بتحميل الامتدادات أم لا.

يقوم بتمكين أو تعطيل وظيفة SQL `loadExtension`، والطريقة `loadExtension()`. عندما يكون `allowExtension` هو `false` عند الإنشاء، لا يمكنك تمكين تحميل الامتدادات لأسباب أمنية.

### `database.exec(sql)` {#databaseexecsql}

**تمت إضافته في: الإصدار 22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة SQL لتنفيذها.

تتيح هذه الطريقة تنفيذ بيان SQL واحد أو أكثر دون إرجاع أي نتائج. هذه الطريقة مفيدة عند تنفيذ عبارات SQL المقروءة من ملف. هذه الطريقة هي التفاف حول [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**تمت إضافته في: الإصدار 23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم وظيفة SQLite المراد إنشاؤها.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إعدادات تكوين اختيارية للوظيفة. الخصائص التالية مدعومة:
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تعيين علامة [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) على الوظيفة التي تم إنشاؤها. **الافتراضي:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تعيين علامة [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) على الوظيفة التي تم إنشاؤها. **الافتراضي:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، فسيتم تحويل وسيطات الأعداد الصحيحة إلى `BigInt`s. إذا كانت `false`، فسيتم تمرير وسيطات الأعداد الصحيحة كأرقام JavaScript. **الافتراضي:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، يمكن أن تقبل `function` عددًا متغيرًا من الوسائط. إذا كانت `false`، يجب استدعاء `function` باستخدام وسيطات `function.length` بالضبط. **الافتراضي:** `false`.


- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) وظيفة JavaScript التي سيتم استدعاؤها عند استدعاء وظيفة SQLite.

تستخدم هذه الطريقة لإنشاء وظائف معرفة من قبل المستخدم في SQLite. هذه الطريقة هي التفاف حول [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**تمت الإضافة في: v22.5.0**

يفتح قاعدة البيانات المحددة في وسيطة `location` الخاصة بـ `DatabaseSync` constructor. يجب استخدام هذه الطريقة فقط عندما لا يتم فتح قاعدة البيانات عبر constructor. يتم طرح استثناء إذا كانت قاعدة البيانات مفتوحة بالفعل.

### `database.prepare(sql)` {#databasepreparesql}

**تمت الإضافة في: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة SQL لتجميعها في عبارة مُجهزة.
- Returns: [\<StatementSync\>](/ar/nodejs/api/sqlite#class-statementsync) العبارة المُجهزة.

تجمّع عبارة SQL في [عبارة مُجهزة](https://www.sqlite.org/c3ref/stmt). هذه الطريقة هي غلاف حول [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**تمت الإضافة في: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين للجلسة.
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) جدول معين لتتبع التغييرات فيه. بشكل افتراضي، يتم تتبع التغييرات في جميع الجداول.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم قاعدة البيانات التي سيتم تتبعها. يكون هذا مفيدًا عند إضافة قواعد بيانات متعددة باستخدام [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **افتراضي**: `'main'`.


- Returns: [\<Session\>](/ar/nodejs/api/sqlite#class-session) مقبض الجلسة.

ينشئ ويرفق جلسة بقاعدة البيانات. هذه الطريقة هي غلاف حول [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) و[`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**تمت الإضافة في: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) مجموعة تغييرات أو مجموعة تصحيحات ثنائية.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) خيارات التكوين لكيفية تطبيق التغييرات.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) تخطي التغييرات التي، عند توفير اسم الجدول المستهدف لهذه الوظيفة، تُرجع قيمة صحيحة. بشكل افتراضي، تتم محاولة جميع التغييرات.
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) تحدد كيفية التعامل مع التعارضات. **افتراضي**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: يتم حذف التغييرات المتعارضة.
    - `SQLITE_CHANGESET_REPLACE`: تحل التغييرات المتعارضة محل القيم الموجودة.
    - `SQLITE_CHANGESET_ABORT`: إحباط عند التعارض والتراجع عن قاعدة البيانات.



- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ما إذا تم تطبيق مجموعة التغييرات بنجاح دون إحباط.

يتم طرح استثناء إذا كانت قاعدة البيانات غير مفتوحة. هذه الطريقة هي غلاف حول [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

```js [ESM]
const sourceDb = new DatabaseSync(':memory:');
const targetDb = new DatabaseSync(':memory:');

sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');

const session = sourceDb.createSession();

const insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
insert.run(1, 'hello');
insert.run(2, 'world');

const changeset = session.changeset();
targetDb.applyChangeset(changeset);
// الآن بعد تطبيق مجموعة التغييرات، تحتوي targetDb على نفس بيانات sourceDb.
```

## الفئة: `Session` {#class-session}

**أضيف في: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**أضيف في: v23.3.0**

- الإرجاع: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) مجموعة تغييرات ثنائية يمكن تطبيقها على قواعد بيانات أخرى.

يسترد مجموعة تغييرات تحتوي على جميع التغييرات منذ إنشاء مجموعة التغييرات. يمكن استدعاؤه عدة مرات. يتم طرح استثناء إذا كانت قاعدة البيانات أو الجلسة غير مفتوحة. هذه الطريقة هي غلاف حول [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**أضيف في: v23.3.0**

- الإرجاع: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) مجموعة تصحيحات ثنائية يمكن تطبيقها على قواعد بيانات أخرى.

مشابه للطريقة أعلاه، ولكنه يولد مجموعة تصحيحات أكثر إحكاما. راجع [مجموعات التغييرات ومجموعات التصحيحات](https://www.sqlite.org/sessionintro#changesets_and_patchsets) في وثائق SQLite. يتم طرح استثناء إذا كانت قاعدة البيانات أو الجلسة غير مفتوحة. هذه الطريقة هي غلاف حول [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

يغلق الجلسة. يتم طرح استثناء إذا كانت قاعدة البيانات أو الجلسة غير مفتوحة. هذه الطريقة هي غلاف حول [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## الفئة: `StatementSync` {#class-statementsync}

**أضيف في: v22.5.0**

يمثل هذا الصنف [عبارة مُعدة](https://www.sqlite.org/c3ref/stmt) واحدة. لا يمكن إنشاء هذا الصنف عبر مُنشئه. بدلاً من ذلك، يتم إنشاء المثيلات عبر طريقة `database.prepare()`. تقوم جميع واجهات برمجة التطبيقات (APIs) التي يعرضها هذا الصنف بالتنفيذ بشكل متزامن.

العبارة المُعدة هي تمثيل ثنائي فعال لـ SQL المستخدم لإنشائها. العبارات المُعدة قابلة للترميز، ويمكن استدعاؤها عدة مرات بقيم مرتبطة مختلفة. توفر المعلمات أيضًا حماية ضد هجمات [حقن SQL](https://en.wikipedia.org/wiki/SQL_injection). لهذه الأسباب، تُفضل العبارات المُعدة على سلاسل SQL المصممة يدويًا عند التعامل مع إدخال المستخدم.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**أُضيف في:** v22.5.0

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن اختياري يُستخدم لربط المعلمات المسماة. تُستخدم مفاتيح هذا الكائن لتهيئة التعيين.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) صفر أو أكثر من القيم لربطها بالمعلمات المجهولة.
- إرجاع: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) مصفوفة من الكائنات. يتوافق كل كائن مع صف تم إرجاعه عن طريق تنفيذ العبارة المُجهزة. تتوافق مفاتيح وقيم كل كائن مع أسماء أعمدة وقيم الصف.

تقوم هذه الطريقة بتنفيذ عبارة مُجهزة وإرجاع جميع النتائج كمصفوفة من الكائنات. إذا لم تُرجع العبارة المُجهزة أي نتائج، فإن هذه الطريقة تُرجع مصفوفة فارغة. يتم [ربط معلمات](https://www.sqlite.org/c3ref/bind_blob) العبارة المُجهزة باستخدام القيم الموجودة في `namedParameters` و `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**أُضيف في:** v22.5.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) نص SQL المصدر الموسع ليشمل قيم المعلمات.

نص SQL المصدر للعبارة المُجهزة مع استبدال العناصر النائبة للمعلمات بالقيم التي تم استخدامها أثناء التنفيذ الأخير لهذه العبارة المُجهزة. هذه الخاصية هي غلاف حول [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**أضيف في: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن اختياري يستخدم لربط المعلمات المسماة. يتم استخدام مفاتيح هذا الكائن لتكوين التعيين.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) صفر أو أكثر من القيم لربطها بالمعلمات المجهولة.
- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) كائن يتوافق مع الصف الأول الذي تم إرجاعه عن طريق تنفيذ العبارة المُعدة. تتوافق مفاتيح وقيم الكائن مع أسماء أعمدة وقيم الصف. إذا لم يتم إرجاع أي صفوف من قاعدة البيانات، فسيعيد هذا الأسلوب `undefined`.

يقوم هذا الأسلوب بتنفيذ عبارة مُعدة وإرجاع النتيجة الأولى ككائن. إذا لم تُرجع العبارة المُعدة أي نتائج، فسيعيد هذا الأسلوب `undefined`. يتم [ربط معلمات](https://www.sqlite.org/c3ref/bind_blob) العبارة المُعدة باستخدام القيم الموجودة في `namedParameters` و `anonymousParameters`.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**أضيف في: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن اختياري يستخدم لربط المعلمات المسماة. يتم استخدام مفاتيح هذا الكائن لتكوين التعيين.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) صفر أو أكثر من القيم لربطها بالمعلمات المجهولة.
- الإرجاع: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) مُكرِّر قابل للتكرار للكائنات. يتوافق كل كائن مع صف تم إرجاعه عن طريق تنفيذ العبارة المُعدة. تتوافق مفاتيح وقيم كل كائن مع أسماء أعمدة وقيم الصف.

يقوم هذا الأسلوب بتنفيذ عبارة مُعدة وإرجاع مُكرِّر للكائنات. إذا لم تُرجع العبارة المُعدة أي نتائج، فسيعيد هذا الأسلوب مُكرِّرًا فارغًا. يتم [ربط معلمات](https://www.sqlite.org/c3ref/bind_blob) العبارة المُعدة باستخدام القيم الموجودة في `namedParameters` و `anonymousParameters`.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**أُضيف في: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن اختياري يُستخدم لربط المعلمات المسماة. تُستخدم مفاتيح هذا الكائن لتهيئة التعيين.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) صفر أو أكثر من القيم للربط بالمعلمات المجهولة.
- يُرجع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) عدد الصفوف التي تم تعديلها أو إدراجها أو حذفها بواسطة آخر عبارة `INSERT` أو `UPDATE` أو `DELETE` مكتملة. هذا الحقل إما رقم أو `BigInt` اعتمادًا على تهيئة العبارة المُعدة. هذه الخاصية هي نتيجة [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) آخر rowid تم إدراجه. هذا الحقل إما رقم أو `BigInt` اعتمادًا على تهيئة العبارة المُعدة. هذه الخاصية هي نتيجة [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).

تقوم هذه الطريقة بتنفيذ عبارة مُعدة وإرجاع كائن يلخص التغييرات الناتجة. يتم [ربط](https://www.sqlite.org/c3ref/bind_blob) معلمات العبارة المُعدة باستخدام القيم الموجودة في `namedParameters` و `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**تمت إضافته في: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لتفعيل أو تعطيل دعم ربط المعلمات المسماة بدون حرف البادئة.

تبدأ أسماء معلمات SQLite بحرف بادئة. بشكل افتراضي، يتطلب `node:sqlite` وجود حرف البادئة هذا عند ربط المعلمات. ومع ذلك، باستثناء حرف علامة الدولار، تتطلب أحرف البادئة هذه أيضًا اقتباسًا إضافيًا عند استخدامها في مفاتيح الكائنات.

لتحسين بيئة العمل، يمكن استخدام هذه الطريقة للسماح أيضًا بالمعلمات المسماة العارية، التي لا تتطلب حرف البادئة في كود JavaScript. هناك العديد من المحاذير التي يجب الانتباه إليها عند تمكين المعلمات المسماة العارية:

- لا يزال حرف البادئة مطلوبًا في SQL.
- لا يزال حرف البادئة مسموحًا به في JavaScript. في الواقع، سيكون للأحرف المسماة التي تبدأ بالبادئة أداء ربط أفضل قليلاً.
- سيؤدي استخدام معلمات مسماة غامضة، مثل `$k` و `@k`، في نفس العبارة المُعدّة إلى استثناء لأنه لا يمكن تحديد كيفية ربط اسم عارٍ.

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**تمت إضافته في: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) لتفعيل أو تعطيل استخدام `BigInt`s عند قراءة حقول `INTEGER` من قاعدة البيانات.

عند القراءة من قاعدة البيانات، يتم تعيين `INTEGER`s في SQLite إلى أرقام JavaScript افتراضيًا. ومع ذلك، يمكن لـ `INTEGER`s في SQLite تخزين قيم أكبر من قدرة أرقام JavaScript على تمثيلها. في مثل هذه الحالات، يمكن استخدام هذه الطريقة لقراءة بيانات `INTEGER` باستخدام `BigInt`s في JavaScript. لا تؤثر هذه الطريقة على عمليات الكتابة في قاعدة البيانات حيث يتم دعم الأرقام و `BigInt`s في جميع الأوقات.

### `statement.sourceSQL` {#statementsourcesql}

**تمت إضافته في: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مصدر SQL المستخدم لإنشاء هذه العبارة المُعدّة.

نص SQL المصدر للعبارة المُعدّة. هذه الخاصية هي غلاف لـ [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### تحويل أنواع البيانات بين JavaScript و SQLite {#type-conversion-between-javascript-and-sqlite}

عندما يكتب Node.js إلى SQLite أو يقرأ منها، فمن الضروري التحويل بين أنواع بيانات JavaScript وأنواع بيانات SQLite [data types](https://www.sqlite.org/datatype3). نظرًا لأن JavaScript تدعم أنواع بيانات أكثر من SQLite، فإنه يتم دعم مجموعة فرعية فقط من أنواع JavaScript. ستؤدي محاولة كتابة نوع بيانات غير مدعوم إلى SQLite إلى حدوث استثناء.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   or   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**أضيف في: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

كائن يحتوي على ثوابت شائعة الاستخدام لعمليات SQLite.

### ثوابت SQLite {#sqlite-constants}

يتم تصدير الثوابت التالية بواسطة الكائن `sqlite.constants`.

#### ثوابت حل التعارضات {#conflict-resolution-constants}

تهدف الثوابت التالية للاستخدام مع [`database.applyChangeset()`](/ar/nodejs/api/sqlite#databaseapplychangesetchangeset-options).

| ثابت | الوصف |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | يتم حذف التغييرات المتعارضة. |
| `SQLITE_CHANGESET_REPLACE` | تحل التغييرات المتعارضة محل القيم الموجودة. |
| `SQLITE_CHANGESET_ABORT` | الإجهاض عند مواجهة تغيير لتعارض والتراجع عن قاعدة البيانات. |

