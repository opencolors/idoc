---
title: Node.js SQLite API Documentation
description: The Node.js SQLite API documentation provides comprehensive details on how to interact with SQLite databases within Node.js applications. It covers database connection management, SQL query execution, transaction handling, and error management.
head:
  - - meta
    - name: og:title
      content: Node.js SQLite API Documentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Node.js SQLite API documentation provides comprehensive details on how to interact with SQLite databases within Node.js applications. It covers database connection management, SQL query execution, transaction handling, and error management.
  - - meta
    - name: twitter:title
      content: Node.js SQLite API Documentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Node.js SQLite API documentation provides comprehensive details on how to interact with SQLite databases within Node.js applications. It covers database connection management, SQL query execution, transaction handling, and error management.
---

# SQLite {#sqlite}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development.
:::

**Source Code:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.8.0/lib/sqlite.js)

The `node:sqlite` module facilitates working with SQLite databases. To access it:



::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

This module is only available under the `node:` scheme.

The following example shows the basic usage of the `node:sqlite` module to open an in-memory database, write data to the database, and then read the data back.



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

## Class: `DatabaseSync` {#class-databasesync}

**Added in: v22.5.0**

This class represents a single [connection](https://www.sqlite.org/c3ref/sqlite3) to a SQLite database. All APIs exposed by this class execute synchronously.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Added in: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The location of the database. A SQLite database can be stored in a file or completely [in memory](https://www.sqlite.org/inmemorydb). To use a file-backed database, the location should be a file path. To use an in-memory database, the location should be the special name `':memory:'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the database connection. The following options are supported: 
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, the database is opened by the constructor. When this value is `false`, the database must be opened via the `open()` method. **Default:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, the database is opened in read-only mode. If the database does not exist, opening it will fail. **Default:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, foreign key constraints are enabled. This is recommended but can be disabled for compatibility with legacy database schemas. The enforcement of foreign key constraints can be enabled and disabled after opening the database using [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **Default:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, SQLite will accept [double-quoted string literals](https://www.sqlite.org/quirks#dblquote). This is not recommended but can be enabled for compatibility with legacy database schemas. **Default:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, the `loadExtension` SQL function and the `loadExtension()` method are enabled. You can call `enableLoadExtension(false)` later to disable this feature. **Default:** `false`.
  
 

Constructs a new `DatabaseSync` instance.

### `database.close()` {#databaseclose}

**Added in: v22.5.0**

Closes the database connection. An exception is thrown if the database is not open. This method is a wrapper around [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Added in: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The path to the shared library to load.

Loads a shared library into the database connection. This method is a wrapper around [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). It is required to enable the `allowExtension` option when constructing the `DatabaseSync` instance.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Added in: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Whether to allow loading extensions.

Enables or disables the `loadExtension` SQL function, and the `loadExtension()` method. When `allowExtension` is `false` when constructing, you cannot enable loading extensions for security reasons.

### `database.exec(sql)` {#databaseexecsql}

**Added in: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A SQL string to execute.

This method allows one or more SQL statements to be executed without returning any results. This method is useful when executing SQL statements read from a file. This method is a wrapper around [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Added in: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the SQLite function to create.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration settings for the function. The following properties are supported: 
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, the [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) flag is set on the created function. **Default:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, the [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) flag is set on the created function. **Default:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, integer arguments to `function` are converted to `BigInt`s. If `false`, integer arguments are passed as JavaScript numbers. **Default:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, `function` may be invoked with any number of arguments (between zero and [`SQLITE_MAX_FUNCTION_ARG`](https://www.sqlite.org/limits#max_function_arg)). If `false`, `function` must be invoked with exactly `function.length` arguments. **Default:** `false`.
  
 
- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The JavaScript function to call when the SQLite function is invoked. The return value of this function should be a valid SQLite data type: see [Type conversion between JavaScript and SQLite](/nodejs/api/sqlite#type-conversion-between-javascript-and-sqlite). The result defaults to `NULL` if the return value is `undefined`.

This method is used to create SQLite user-defined functions. This method is a wrapper around [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).

### `database.open()` {#databaseopen}

**Added in: v22.5.0**

Opens the database specified in the `location` argument of the `DatabaseSync` constructor. This method should only be used when the database is not opened via the constructor. An exception is thrown if the database is already open.

### `database.prepare(sql)` {#databasepreparesql}

**Added in: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A SQL string to compile to a prepared statement.
- Returns: [\<StatementSync\>](/nodejs/api/sqlite#class-statementsync) The prepared statement.

Compiles a SQL statement into a [prepared statement](https://www.sqlite.org/c3ref/stmt). This method is a wrapper around [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Added in: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) The configuration options for the session. 
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A specific table to track changes for. By default, changes to all tables are tracked.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name of the database to track. This is useful when multiple databases have been added using [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **Default**: `'main'`.
  
 
- Returns: [\<Session\>](/nodejs/api/sqlite#class-session) A session handle.

Creates and attaches a session to the database. This method is a wrapper around [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) and [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Added in: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) A binary changeset or patchset.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) The configuration options for how the changes will be applied. 
    -  `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Skip changes that, when targeted table name is supplied to this function, return a truthy value. By default, all changes are attempted. 
    -  `onConflict` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A function that determines how to handle conflicts. The function receives one argument, which can be one of the following values: 
    - `SQLITE_CHANGESET_DATA`: A `DELETE` or `UPDATE` change does not contain the expected "before" values.
    - `SQLITE_CHANGESET_NOTFOUND`: A row matching the primary key of the `DELETE` or `UPDATE` change does not exist.
    - `SQLITE_CHANGESET_CONFLICT`: An `INSERT` change results in a duplicate primary key.
    - `SQLITE_CHANGESET_FOREIGN_KEY`: Applying a change would result in a foreign key violation.
    - `SQLITE_CHANGESET_CONSTRAINT`: Applying a change results in a `UNIQUE`, `CHECK`, or `NOT NULL` constraint violation.
  
 The function should return one of the following values: 
    - `SQLITE_CHANGESET_OMIT`: Omit conflicting changes.
    - `SQLITE_CHANGESET_REPLACE`: Replace existing values with conflicting changes (only valid with `SQLITE_CHANGESET_DATA` or `SQLITE_CHANGESET_CONFLICT` conflicts).
    - `SQLITE_CHANGESET_ABORT`: Abort on conflict and roll back the database.
  
 When an error is thrown in the conflict handler or when any other value is returned from the handler, applying the changeset is aborted and the database is rolled back. **Default**: A function that returns `SQLITE_CHANGESET_ABORT`. 
  
 
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Whether the changeset was applied succesfully without being aborted.

An exception is thrown if the database is not open. This method is a wrapper around [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

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
// Now that the changeset has been applied, targetDb contains the same data as sourceDb.
```
## Class: `Session` {#class-session}

**Added in: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Added in: v23.3.0**

- Returns: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Binary changeset that can be applied to other databases.

Retrieves a changeset containing all changes since the changeset was created. Can be called multiple times. An exception is thrown if the database or the session is not open. This method is a wrapper around [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Added in: v23.3.0**

- Returns: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Binary patchset that can be applied to other databases.

Similar to the method above, but generates a more compact patchset. See [Changesets and Patchsets](https://www.sqlite.org/sessionintro#changesets_and_patchsets) in the documentation of SQLite. An exception is thrown if the database or the session is not open. This method is a wrapper around [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Closes the session. An exception is thrown if the database or the session is not open. This method is a wrapper around [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Class: `StatementSync` {#class-statementsync}

**Added in: v22.5.0**

This class represents a single [prepared statement](https://www.sqlite.org/c3ref/stmt). This class cannot be instantiated via its constructor. Instead, instances are created via the `database.prepare()` method. All APIs exposed by this class execute synchronously.

A prepared statement is an efficient binary representation of the SQL used to create it. Prepared statements are parameterizable, and can be invoked multiple times with different bound values. Parameters also offer protection against [SQL injection](https://en.wikipedia.org/wiki/SQL_injection) attacks. For these reasons, prepared statements are preferred over hand-crafted SQL strings when handling user input.

### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.7.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |
| v22.5.0 | Added in: v22.5.0 |
:::

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or more values to bind to anonymous parameters.
- Returns: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of objects. Each object corresponds to a row returned by executing the prepared statement. The keys and values of each object correspond to the column names and values of the row.

This method executes a prepared statement and returns all results as an array of objects. If the prepared statement does not return any results, this method returns an empty array. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob) using the values in `namedParameters` and `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Added in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The source SQL expanded to include parameter values.

The source SQL text of the prepared statement with parameter placeholders replaced by the values that were used during the most recent execution of this prepared statement. This property is a wrapper around [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).

### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.7.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |
| v22.5.0 | Added in: v22.5.0 |
:::

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or more values to bind to anonymous parameters.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) An object corresponding to the first row returned by executing the prepared statement. The keys and values of the object correspond to the column names and values of the row. If no rows were returned from the database then this method returns `undefined`.

This method executes a prepared statement and returns the first result as an object. If the prepared statement does not return any results, this method returns `undefined`. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob) using the values in `namedParameters` and `anonymousParameters`.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.7.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |
| v23.4.0 | Added in: v23.4.0 |
:::

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or more values to bind to anonymous parameters.
- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) An iterable iterator of objects. Each object corresponds to a row returned by executing the prepared statement. The keys and values of each object correspond to the column names and values of the row.

This method executes a prepared statement and returns an iterator of objects. If the prepared statement does not return any results, this method returns an empty iterator. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob) using the values in `namedParameters` and `anonymousParameters`.

### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.7.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |
| v22.5.0 | Added in: v22.5.0 |
:::

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or more values to bind to anonymous parameters.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) The number of rows modified, inserted, or deleted by the most recently completed `INSERT`, `UPDATE`, or `DELETE` statement. This field is either a number or a `BigInt` depending on the prepared statement's configuration. This property is the result of [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) The most recently inserted rowid. This field is either a number or a `BigInt` depending on the prepared statement's configuration. This property is the result of [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).
  
 

This method executes a prepared statement and returns an object summarizing the resulting changes. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob) using the values in `namedParameters` and `anonymousParameters`.

### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Added in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Enables or disables support for binding named parameters without the prefix character.

The names of SQLite parameters begin with a prefix character. By default, `node:sqlite` requires that this prefix character is present when binding parameters. However, with the exception of dollar sign character, these prefix characters also require extra quoting when used in object keys.

To improve ergonomics, this method can be used to also allow bare named parameters, which do not require the prefix character in JavaScript code. There are several caveats to be aware of when enabling bare named parameters:

- The prefix character is still required in SQL.
- The prefix character is still allowed in JavaScript. In fact, prefixed names will have slightly better binding performance.
- Using ambiguous named parameters, such as `$k` and `@k`, in the same prepared statement will result in an exception as it cannot be determined how to bind a bare name.

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Added in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Enables or disables the use of `BigInt`s when reading `INTEGER` fields from the database.

When reading from the database, SQLite `INTEGER`s are mapped to JavaScript numbers by default. However, SQLite `INTEGER`s can store values larger than JavaScript numbers are capable of representing. In such cases, this method can be used to read `INTEGER` data using JavaScript `BigInt`s. This method has no impact on database write operations where numbers and `BigInt`s are both supported at all times.

### `statement.sourceSQL` {#statementsourcesql}

**Added in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The source SQL used to create this prepared statement.

The source SQL text of the prepared statement. This property is a wrapper around [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).

### Type conversion between JavaScript and SQLite {#type-conversion-between-javascript-and-sqlite}

When Node.js writes to or reads from SQLite it is necessary to convert between JavaScript data types and SQLite's [data types](https://www.sqlite.org/datatype3). Because JavaScript supports more data types than SQLite, only a subset of JavaScript types are supported. Attempting to write an unsupported data type to SQLite will result in an exception.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   or   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)   or   [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) |
## `sqlite.backup(sourceDb, destination[, options])` {#sqliteconstants}

**Added in: v23.8.0**

- `sourceDb` [\<DatabaseSync\>](/nodejs/api/sqlite#class-databasesync) The database to backup. The source database must be open.
- `destination` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The path where the backup will be created. If the file already exists, the contents will be overwritten.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration for the backup. The following properties are supported: 
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name of the source database. This can be `'main'` (the default primary database) or any other database that have been added with [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach) **Default:** `'main'`.
    - `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name of the target database. This can be `'main'` (the default primary database) or any other database that have been added with [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach) **Default:** `'main'`.
    - `rate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Number of pages to be transmitted in each batch of the backup. **Default:** `100`.
    - `progress` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback function that will be called with the number of pages copied and the total number of pages.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) A promise that resolves when the backup is completed and rejects if an error occurs.

This method makes a database backup. This method abstracts the [`sqlite3_backup_init()`](https://www.sqlite.org/c3ref/backup_finish#sqlite3backupinit), [`sqlite3_backup_step()`](https://www.sqlite.org/c3ref/backup_finish#sqlite3backupstep) and [`sqlite3_backup_finish()`](https://www.sqlite.org/c3ref/backup_finish#sqlite3backupfinish) functions.

The backed-up database can be used normally during the backup process. Mutations coming from the same connection - same [\<DatabaseSync\>](/nodejs/api/sqlite#class-databasesync) - object will be reflected in the backup right away. However, mutations from other connections will cause the backup process to restart.



::: code-group
```js [CJS]
const { backup, DatabaseSync } = require('node:sqlite');

(async () => {
  const sourceDb = new DatabaseSync('source.db');
  const totalPagesTransferred = await backup(sourceDb, 'backup.db', {
    rate: 1, // Copy one page at a time.
    progress: ({ totalPages, remainingPages }) => {
      console.log('Backup in progress', { totalPages, remainingPages });
    },
  });

  console.log('Backup completed', totalPagesTransferred);
})();
```

```js [ESM]
import { backup, DatabaseSync } from 'node:sqlite';

const sourceDb = new DatabaseSync('source.db');
const totalPagesTransferred = await backup(sourceDb, 'backup.db', {
  rate: 1, // Copy one page at a time.
  progress: ({ totalPages, remainingPages }) => {
    console.log('Backup in progress', { totalPages, remainingPages });
  },
});

console.log('Backup completed', totalPagesTransferred);
```
:::

## `sqlite.constants` {#sqlite-constants}

**Added in: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing commonly used constants for SQLite operations.

### SQLite constants {#conflict-resolution-constants}

The following constants are exported by the `sqlite.constants` object.

#### Conflict resolution constants

One of the following constants is available as an argument to the `onConflict` conflict resolution handler passed to [`database.applyChangeset()`](/nodejs/api/sqlite#databaseapplychangesetchangeset-options). See also [Constants Passed To The Conflict Handler](https://www.sqlite.org/session/c_changeset_conflict) in the SQLite documentation.

| Constant | Description |
| --- | --- |
| `SQLITE_CHANGESET_DATA` | The conflict handler is invoked with this constant when processing a DELETE or UPDATE change if a row with the required PRIMARY KEY fields is present in the database, but one or more other (non primary-key) fields modified by the update do not contain the expected "before" values. |
| `SQLITE_CHANGESET_NOTFOUND` | The conflict handler is invoked with this constant when processing a DELETE or UPDATE change if a row with the required PRIMARY KEY fields is not present in the database. |
| `SQLITE_CHANGESET_CONFLICT` | This constant is passed to the conflict handler while processing an INSERT change if the operation would result in duplicate primary key values. |
| `SQLITE_CHANGESET_CONSTRAINT` | If foreign key handling is enabled, and applying a changeset leaves the database in a state containing foreign key violations, the conflict handler is invoked with this constant exactly once before the changeset is committed. If the conflict handler returns   `SQLITE_CHANGESET_OMIT`  , the changes, including those that caused the foreign key constraint violation, are committed. Or, if it returns   `SQLITE_CHANGESET_ABORT`  , the changeset is rolled back. |
| `SQLITE_CHANGESET_FOREIGN_KEY` | If any other constraint violation occurs while applying a change (i.e. a UNIQUE, CHECK or NOT NULL constraint), the conflict handler is invoked with this constant. |
One of the following constants must be returned from the `onConflict` conflict resolution handler passed to [`database.applyChangeset()`](/nodejs/api/sqlite#databaseapplychangesetchangeset-options). See also [Constants Returned From The Conflict Handler](https://www.sqlite.org/session/c_changeset_abort) in the SQLite documentation.

| Constant | Description |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Conflicting changes are omitted. |
| `SQLITE_CHANGESET_REPLACE` | Conflicting changes replace existing values. Note that this value can only be returned when the type of conflict is either   `SQLITE_CHANGESET_DATA`   or   `SQLITE_CHANGESET_CONFLICT`  . |
| `SQLITE_CHANGESET_ABORT` | Abort when a change encounters a conflict and roll back database. |
