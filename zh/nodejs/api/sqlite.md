---
title: Node.js SQLite API 文档
description: Node.js SQLite API 文档详细介绍了如何在 Node.js 应用程序中与 SQLite 数据库进行交互，包括数据库连接管理、SQL 查询执行、事务处理和错误管理。
head:
  - - meta
    - name: og:title
      content: Node.js SQLite API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js SQLite API 文档详细介绍了如何在 Node.js 应用程序中与 SQLite 数据库进行交互，包括数据库连接管理、SQL 查询执行、事务处理和错误管理。
  - - meta
    - name: twitter:title
      content: Node.js SQLite API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js SQLite API 文档详细介绍了如何在 Node.js 应用程序中与 SQLite 数据库进行交互，包括数据库连接管理、SQL 查询执行、事务处理和错误管理。
---


# SQLite {#sqlite}

**添加于: v22.5.0**

::: warning [Stable: 1 - 实验性]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中。
:::

**源码:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

`node:sqlite` 模块方便使用 SQLite 数据库。要访问它：

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

此模块仅在 `node:` 方案下可用。

以下示例展示了 `node:sqlite` 模块的基本用法，用于打开一个内存数据库，将数据写入数据库，然后将数据读回。

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// 从字符串执行 SQL 语句。
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// 创建一个预处理语句以将数据插入数据库。
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// 使用绑定值执行预处理语句。
insert.run(1, 'hello');
insert.run(2, 'world');
// 创建一个预处理语句以从数据库读取数据。
const query = database.prepare('SELECT * FROM data ORDER BY key');
// 执行预处理语句并记录结果集。
console.log(query.all());
// 打印: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// 从字符串执行 SQL 语句。
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// 创建一个预处理语句以将数据插入数据库。
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// 使用绑定值执行预处理语句。
insert.run(1, 'hello');
insert.run(2, 'world');
// 创建一个预处理语句以从数据库读取数据。
const query = database.prepare('SELECT * FROM data ORDER BY key');
// 执行预处理语句并记录结果集。
console.log(query.all());
// 打印: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## 类: `DatabaseSync` {#class-databasesync}

**新增于: v22.5.0**

此类代表与 SQLite 数据库的单个[连接](https://www.sqlite.org/c3ref/sqlite3)。此类暴露的所有 API 都是同步执行的。

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**新增于: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 数据库的位置。SQLite 数据库可以存储在文件中或完全[在内存中](https://www.sqlite.org/inmemorydb)。要使用文件支持的数据库，位置应该是文件路径。要使用内存数据库，位置应该是特殊名称 `':memory:'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 数据库连接的配置选项。支持以下选项：
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则数据库由构造函数打开。当此值为 `false` 时，必须通过 `open()` 方法打开数据库。**默认值:** `true`。
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则以只读模式打开数据库。如果数据库不存在，则打开它将失败。**默认值:** `false`。
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则启用外键约束。建议这样做，但为了与旧数据库架构兼容，可以禁用它。可以使用 [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys) 在打开数据库后启用和禁用外键约束的强制执行。**默认值:** `true`。
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，SQLite 将接受[双引号字符串文字](https://www.sqlite.org/quirks#dblquote)。不建议这样做，但可以启用它以与旧数据库架构兼容。**默认值:** `false`。
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则启用 `loadExtension` SQL 函数和 `loadExtension()` 方法。您可以稍后调用 `enableLoadExtension(false)` 来禁用此功能。**默认值:** `false`。

构造一个新的 `DatabaseSync` 实例。


### `database.close()` {#databaseclose}

**添加于: v22.5.0**

关闭数据库连接。如果数据库未打开，则会抛出异常。此方法是 [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close) 的一个包装器。

### `database.loadExtension(path)` {#databaseloadextensionpath}

**添加于: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要加载的共享库的路径。

将共享库加载到数据库连接中。此方法是 [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension) 的一个包装器。构造 `DatabaseSync` 实例时，需要启用 `allowExtension` 选项。

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**添加于: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否允许加载扩展。

启用或禁用 `loadExtension` SQL 函数和 `loadExtension()` 方法。当构造时 `allowExtension` 为 `false` 时，出于安全原因，您无法启用加载扩展。

### `database.exec(sql)` {#databaseexecsql}

**添加于: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要执行的 SQL 字符串。

此方法允许执行一个或多个 SQL 语句，而不返回任何结果。当执行从文件读取的 SQL 语句时，此方法非常有用。此方法是 [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec) 的一个包装器。

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**添加于: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要创建的 SQLite 函数的名称。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 函数的可选配置设置。支持以下属性：
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在创建的函数上设置 [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) 标志。 **默认值:** `false`。
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则在创建的函数上设置 [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) 标志。 **默认值:** `false`。
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则传递给 `function` 的整数参数将转换为 `BigInt`。 如果为 `false`，则整数参数将作为 JavaScript 数字传递。 **默认值:** `false`。
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true`，则 `function` 可以接受可变数量的参数。 如果为 `false`，则必须使用正好 `function.length` 个参数调用 `function`。 **默认值:** `false`。

- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 调用 SQLite 函数时要调用的 JavaScript 函数。

此方法用于创建 SQLite 用户定义函数。此方法是 [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function) 的一个包装器。


### `database.open()` {#databaseopen}

**添加于: v22.5.0**

打开 `DatabaseSync` 构造函数的 `location` 参数中指定的数据库。只有当数据库不是通过构造函数打开时，才应使用此方法。如果数据库已打开，则会抛出异常。

### `database.prepare(sql)` {#databasepreparesql}

**添加于: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要编译为预处理语句的 SQL 字符串。
- 返回: [\<StatementSync\>](/zh/nodejs/api/sqlite#class-statementsync) 预处理语句。

将 SQL 语句编译为[预处理语句](https://www.sqlite.org/c3ref/stmt)。此方法是对 [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare) 的包装。

### `database.createSession([options])` {#databasecreatesessionoptions}

**添加于: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 会话的配置选项。
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要跟踪更改的特定表。 默认情况下，会跟踪对所有表的更改。
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要跟踪的数据库的名称。 当使用 [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach) 添加了多个数据库时，这很有用。 **默认**: `'main'`。
  
 
- 返回: [\<Session\>](/zh/nodejs/api/sqlite#class-session) 会话句柄。

创建会话并将其附加到数据库。此方法是对 [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) 和 [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach) 的包装。

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**添加于: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 二进制变更集或补丁集。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于配置如何应用更改的选项。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 跳过那些当目标表名传递给此函数时返回真值的更改。 默认情况下，会尝试所有更改。
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 确定如何处理冲突。 **默认**: `SQLITE_CHANGESET_ABORT`。
    - `SQLITE_CHANGESET_OMIT`: 忽略冲突的更改。
    - `SQLITE_CHANGESET_REPLACE`: 冲突的更改将替换现有值。
    - `SQLITE_CHANGESET_ABORT`: 发生冲突时中止并回滚数据库。
  
 
  
 
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 变更集是否已成功应用而未被中止。

如果数据库未打开，则会抛出异常。此方法是对 [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply) 的包装。

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
// 现在，变更集已应用，targetDb 包含与 sourceDb 相同的数据。
```

## 类: `Session` {#class-session}

**添加于: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**添加于: v23.3.0**

- 返回: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 可应用于其他数据库的二进制变更集。

检索包含自创建变更集以来所有更改的变更集。可以多次调用。如果数据库或会话未打开，则会抛出异常。此方法是 [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset) 的一个包装器。

### `session.patchset()` {#sessionpatchset}

**添加于: v23.3.0**

- 返回: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 可应用于其他数据库的二进制补丁集。

与上述方法类似，但生成更紧凑的补丁集。 请参阅 SQLite 文档中的[变更集和补丁集](https://www.sqlite.org/sessionintro#changesets_and_patchsets)。如果数据库或会话未打开，则会抛出异常。此方法是 [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset) 的一个包装器。

### `session.close()` {#sessionclose}

关闭会话。如果数据库或会话未打开，则会抛出异常。此方法是 [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete) 的一个包装器。

## 类: `StatementSync` {#class-statementsync}

**添加于: v22.5.0**

此类代表一个 [预处理语句](https://www.sqlite.org/c3ref/stmt)。无法通过其构造函数实例化此类。 而是通过 `database.prepare()` 方法创建实例。 此类公开的所有 API 都是同步执行的。

预处理语句是用于创建它的 SQL 的有效二进制表示形式。 预处理语句是可参数化的，并且可以使用不同的绑定值多次调用。 参数还提供针对 [SQL 注入](https://en.wikipedia.org/wiki/SQL_injection) 攻击的保护。 因此，在处理用户输入时，预处理语句优先于手工制作的 SQL 字符串。


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**新增于: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个可选对象，用于绑定命名参数。此对象的键用于配置映射。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 零个或多个要绑定到匿名参数的值。
- 返回: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 一个对象数组。 每个对象对应于执行预处理语句返回的行。 每个对象的键和值对应于该行的列名和值。

此方法执行预处理语句并返回所有结果作为对象数组。 如果预处理语句未返回任何结果，则此方法返回一个空数组。 预处理语句[参数使用绑定](https://www.sqlite.org/c3ref/bind_blob) `namedParameters` 和 `anonymousParameters` 中的值。

### `statement.expandedSQL` {#statementexpandedsql}

**新增于: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 扩展后的源 SQL，包含参数值。

预处理语句的源 SQL 文本，其中参数占位符被替换为最近一次执行此预处理语句期间使用的值。 此属性是 [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql) 的包装器。


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**添加于: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个可选对象，用于绑定具名参数。该对象的键用于配置映射。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 零个或多个值，用于绑定到匿名参数。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 一个对象，对应于执行预处理语句返回的第一行。对象的键和值对应于行的列名和值。如果数据库未返回任何行，则此方法返回 `undefined`。

此方法执行预处理语句并返回第一个结果作为对象。如果预处理语句未返回任何结果，则此方法返回 `undefined`。预处理语句[参数使用 `namedParameters` 和 `anonymousParameters` 中的值绑定](https://www.sqlite.org/c3ref/bind_blob)。

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**添加于: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个可选对象，用于绑定具名参数。该对象的键用于配置映射。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 零个或多个值，用于绑定到匿名参数。
- 返回: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) 一个可迭代的对象迭代器。每个对象对应于执行预处理语句返回的行。每个对象的键和值对应于行的列名和值。

此方法执行预处理语句并返回一个对象迭代器。如果预处理语句未返回任何结果，则此方法返回一个空迭代器。预处理语句[参数使用 `namedParameters` 和 `anonymousParameters` 中的值绑定](https://www.sqlite.org/c3ref/bind_blob)。


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**新增于: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (可选) 用于绑定命名参数的对象。此对象的键用于配置映射。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 零个或多个要绑定到匿名参数的值。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 最近完成的 `INSERT`、`UPDATE` 或 `DELETE` 语句修改、插入或删除的行数。此字段是数字或 `BigInt`，具体取决于预处理语句的配置。此属性是 [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes) 的结果。
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 最近插入的 rowid。此字段是数字或 `BigInt`，具体取决于预处理语句的配置。此属性是 [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid) 的结果。
  
 

此方法执行预处理语句并返回一个总结结果更改的对象。预处理语句[参数使用](https://www.sqlite.org/c3ref/bind_blob) `namedParameters` 和 `anonymousParameters` 中的值进行绑定。


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**新增于: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 启用或禁用对绑定不带前缀字符的命名参数的支持。

SQLite 参数的名称以一个前缀字符开头。 默认情况下，`node:sqlite` 要求在绑定参数时必须存在此前缀字符。 但是，除了美元符号字符之外，这些前缀字符在用作对象键时还需要额外的引号。

为了提高人体工程学，可以使用此方法来允许裸命名参数，这些参数不需要 JavaScript 代码中的前缀字符。 启用裸命名参数时，需要注意以下几个注意事项：

- SQL 中仍然需要前缀字符。
- JavaScript 中仍然允许前缀字符。 事实上，带前缀的名称将具有稍好的绑定性能。
- 在同一预处理语句中使用有歧义的命名参数，例如 `$k` 和 `@k`，将导致异常，因为它无法确定如何绑定裸名称。

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**新增于: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 启用或禁用在从数据库读取 `INTEGER` 字段时使用 `BigInt`。

从数据库读取时，默认情况下 SQLite `INTEGER` 会映射到 JavaScript 数字。 但是，SQLite `INTEGER` 可以存储大于 JavaScript 数字能够表示的值。 在这种情况下，可以使用此方法使用 JavaScript `BigInt` 读取 `INTEGER` 数据。 此方法对数据库写入操作没有影响，在数据库写入操作中始终支持数字和 `BigInt`。

### `statement.sourceSQL` {#statementsourcesql}

**新增于: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于创建此预处理语句的源 SQL。

预处理语句的源 SQL 文本。 此属性是 [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql) 的包装器。


### JavaScript 与 SQLite 之间的数据类型转换 {#type-conversion-between-javascript-and-sqlite}

当 Node.js 向 SQLite 写入或从 SQLite 读取数据时，需要在 JavaScript 数据类型和 SQLite 的 [数据类型](https://www.sqlite.org/datatype3) 之间进行转换。 由于 JavaScript 支持比 SQLite 更多的数据类型，因此仅支持 JavaScript 类型的一个子集。 尝试将不受支持的数据类型写入 SQLite 将导致异常。

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   or   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**添加于: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个包含 SQLite 操作常用常量的对象。

### SQLite 常量 {#sqlite-constants}

以下常量由 `sqlite.constants` 对象导出。

#### 冲突解决常量 {#conflict-resolution-constants}

以下常量用于 [`database.applyChangeset()`](/zh/nodejs/api/sqlite#databaseapplychangesetchangeset-options)。

| 常量 | 描述 |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | 省略冲突的更改。 |
| `SQLITE_CHANGESET_REPLACE` | 冲突的更改替换现有值。 |
| `SQLITE_CHANGESET_ABORT` | 当更改遇到冲突时中止并回滚数据库。 |

