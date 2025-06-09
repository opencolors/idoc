---
title: Node.js SQLite API ドキュメント
description: Node.js SQLite API ドキュメントは、Node.js アプリケーション内で SQLite データベースとどのように対話するかについての詳細な情報を提供します。データベース接続管理、SQL クエリの実行、トランザクション処理、エラー管理が含まれます。
head:
  - - meta
    - name: og:title
      content: Node.js SQLite API ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js SQLite API ドキュメントは、Node.js アプリケーション内で SQLite データベースとどのように対話するかについての詳細な情報を提供します。データベース接続管理、SQL クエリの実行、トランザクション処理、エラー管理が含まれます。
  - - meta
    - name: twitter:title
      content: Node.js SQLite API ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js SQLite API ドキュメントは、Node.js アプリケーション内で SQLite データベースとどのように対話するかについての詳細な情報を提供します。データベース接続管理、SQL クエリの実行、トランザクション処理、エラー管理が含まれます。
---


# SQLite {#sqlite}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発。
:::

**ソースコード:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

`node:sqlite` モジュールは、SQLite データベースの操作を容易にします。アクセスするには:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

このモジュールは、`node:` スキームでのみ利用可能です。

次の例は、`node:sqlite` モジュールの基本的な使用方法を示しています。インメモリデータベースを開き、データベースにデータを書き込み、データを読み返します。

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// 文字列から SQL ステートメントを実行します。
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// データベースにデータを挿入するためのプリペアドステートメントを作成します。
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// バインドされた値でプリペアドステートメントを実行します。
insert.run(1, 'hello');
insert.run(2, 'world');
// データベースからデータを読み取るためのプリペアドステートメントを作成します。
const query = database.prepare('SELECT * FROM data ORDER BY key');
// プリペアドステートメントを実行し、結果セットをログに記録します。
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// 文字列から SQL ステートメントを実行します。
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// データベースにデータを挿入するためのプリペアドステートメントを作成します。
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// バインドされた値でプリペアドステートメントを実行します。
insert.run(1, 'hello');
insert.run(2, 'world');
// データベースからデータを読み取るためのプリペアドステートメントを作成します。
const query = database.prepare('SELECT * FROM data ORDER BY key');
// プリペアドステートメントを実行し、結果セットをログに記録します。
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## クラス: `DatabaseSync` {#class-databasesync}

**Added in: v22.5.0**

このクラスは、SQLiteデータベースへの単一の[接続](https://www.sqlite.org/c3ref/sqlite3)を表します。このクラスによって公開されるすべてのAPIは、同期的に実行されます。

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Added in: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) データベースの場所。SQLiteデータベースは、ファイルに保存することも、完全に[メモリ内](https://www.sqlite.org/inmemorydb)に保存することもできます。ファイルベースのデータベースを使用するには、場所はファイルパスである必要があります。インメモリデータベースを使用するには、場所は特別な名前 `':memory:'` である必要があります。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) データベース接続の構成オプション。次のオプションがサポートされています。
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、データベースはコンストラクタによって開かれます。この値が`false`の場合、データベースは`open()`メソッドを介して開かれる必要があります。**デフォルト:** `true`。
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、データベースは読み取り専用モードで開かれます。データベースが存在しない場合、開こうとすると失敗します。**デフォルト:** `false`。
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、外部キー制約が有効になります。これは推奨されますが、レガシーデータベーススキーマとの互換性のために無効にすることができます。外部キー制約の適用は、[`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys)を使用してデータベースを開いた後に有効または無効にできます。**デフォルト:** `true`。
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、SQLiteは[二重引用符で囲まれた文字列リテラル](https://www.sqlite.org/quirks#dblquote)を受け入れます。これは推奨されませんが、レガシーデータベーススキーマとの互換性のために有効にすることができます。**デフォルト:** `false`。
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、`loadExtension` SQL関数と`loadExtension()`メソッドが有効になります。後で`enableLoadExtension(false)`を呼び出して、この機能を無効にすることができます。**デフォルト:** `false`。

新しい`DatabaseSync`インスタンスを構築します。


### `database.close()` {#databaseclose}

**Added in: v22.5.0**

データベース接続を閉じます。データベースが開いていない場合、例外がスローされます。このメソッドは、[`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close) のラッパーです。

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Added in: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ロードする共有ライブラリへのパス。

共有ライブラリをデータベース接続にロードします。このメソッドは、[`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension) のラッパーです。`DatabaseSync` インスタンスを構築するときに、`allowExtension` オプションを有効にする必要があります。

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Added in: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 拡張機能のロードを許可するかどうか。

`loadExtension` SQL 関数と `loadExtension()` メソッドを有効または無効にします。構築時に `allowExtension` が `false` の場合、セキュリティ上の理由から拡張機能のロードを有効にすることはできません。

### `database.exec(sql)` {#databaseexecsql}

**Added in: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行する SQL 文字列。

このメソッドを使用すると、結果を返さずに 1 つ以上の SQL ステートメントを実行できます。このメソッドは、ファイルから読み取った SQL ステートメントを実行する場合に役立ちます。このメソッドは、[`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec) のラッパーです。

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Added in: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 作成する SQLite 関数の名前。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 関数のオプションの構成設定。以下のプロパティがサポートされています。
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、作成された関数に [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) フラグが設定されます。**デフォルト:** `false`。
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、作成された関数に [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) フラグが設定されます。**デフォルト:** `false`。
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`function` への整数の引数は `BigInt` に変換されます。 `false` の場合、整数の引数は JavaScript の数値として渡されます。**デフォルト:** `false`。
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`function` は可変数の引数を受け入れることができます。 `false` の場合、`function` は正確に `function.length` 引数で呼び出す必要があります。**デフォルト:** `false`。
  
 
- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) SQLite 関数が呼び出されたときに呼び出す JavaScript 関数。

このメソッドは、SQLite ユーザー定義関数を作成するために使用されます。このメソッドは、[`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function) のラッパーです。


### `database.open()` {#databaseopen}

**追加:** v22.5.0

`DatabaseSync`コンストラクターの`location`引数で指定されたデータベースを開きます。このメソッドは、データベースがコンストラクター経由で開かれていない場合にのみ使用する必要があります。データベースがすでに開いている場合、例外がスローされます。

### `database.prepare(sql)` {#databasepreparesql}

**追加:** v22.5.0

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) プリペアドステートメントにコンパイルするSQL文字列。
- 戻り値: [\<StatementSync\>](/ja/nodejs/api/sqlite#class-statementsync) プリペアドステートメント。

SQLステートメントを[プリペアドステートメント](https://www.sqlite.org/c3ref/stmt)にコンパイルします。このメソッドは、[`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare)のラッパーです。

### `database.createSession([options])` {#databasecreatesessionoptions}

**追加:** v23.3.0

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) セッションの構成オプション。
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 変更を追跡する特定のテーブル。デフォルトでは、すべてのテーブルへの変更が追跡されます。
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 追跡するデータベースの名前。これは、[`ATTACH DATABASE`](https://www.sqlite.org/lang_attach)を使用して複数のデータベースが追加された場合に役立ちます。**デフォルト**: `'main'`。

- 戻り値: [\<Session\>](/ja/nodejs/api/sqlite#class-session) セッションハンドル。

データベースにセッションを作成してアタッチします。このメソッドは、[`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create)と[`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach)のラッパーです。

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**追加:** v23.3.0

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) バイナリのチェンジセットまたはパッチセット。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 変更の適用方法に関する構成オプション。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 対象のテーブル名がこの関数に提供されたときに、真の値を返す変更をスキップします。デフォルトでは、すべての変更が試行されます。
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 競合の処理方法を決定します。**デフォルト**: `SQLITE_CHANGESET_ABORT`。
    - `SQLITE_CHANGESET_OMIT`: 競合する変更は省略されます。
    - `SQLITE_CHANGESET_REPLACE`: 競合する変更は既存の値を置き換えます。
    - `SQLITE_CHANGESET_ABORT`: 競合時に中止し、データベースをロールバックします。

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) チェンジセットが中止されることなく正常に適用されたかどうか。

データベースが開いていない場合、例外がスローされます。このメソッドは、[`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply)のラッパーです。

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
// これでチェンジセットが適用されたので、targetDbにはsourceDbと同じデータが含まれています。
```

## Class: `Session` {#class-session}

**Added in: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Added in: v23.3.0**

- Returns: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 他のデータベースに適用できるバイナリチェンジセット。

チェンジセットが作成されてからのすべての変更を含むチェンジセットを取得します。複数回呼び出すことができます。データベースまたはセッションが開かれていない場合、例外がスローされます。このメソッドは、[`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset) のラッパーです。

### `session.patchset()` {#sessionpatchset}

**Added in: v23.3.0**

- Returns: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 他のデータベースに適用できるバイナリパッチセット。

上記のメソッドと同様ですが、よりコンパクトなパッチセットを生成します。SQLite のドキュメントの [チェンジセットとパッチセット](https://www.sqlite.org/sessionintro#changesets_and_patchsets) を参照してください。データベースまたはセッションが開かれていない場合、例外がスローされます。このメソッドは、[`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset) のラッパーです。

### `session.close()` {#sessionclose}

セッションを閉じます。データベースまたはセッションが開かれていない場合、例外がスローされます。このメソッドは、[`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete) のラッパーです。

## Class: `StatementSync` {#class-statementsync}

**Added in: v22.5.0**

このクラスは、単一の [プリペアドステートメント](https://www.sqlite.org/c3ref/stmt) を表します。このクラスは、コンストラクタを介してインスタンス化することはできません。代わりに、インスタンスは `database.prepare()` メソッドを介して作成されます。このクラスによって公開されるすべての API は、同期的に実行されます。

プリペアドステートメントは、それを作成するために使用される SQL の効率的なバイナリ表現です。プリペアドステートメントはパラメータ化可能であり、異なるバインド値で複数回呼び出すことができます。パラメータは、[SQLインジェクション](https://en.wikipedia.org/wiki/SQL_injection)攻撃に対する保護も提供します。これらの理由から、ユーザー入力を処理する際には、手作りの SQL 文字列よりもプリペアドステートメントが推奨されます。


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Added in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 名前付きパラメーターをバインドするために使用されるオプションのオブジェクト。このオブジェクトのキーは、マッピングの構成に使用されます。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 匿名パラメーターにバインドするゼロ個以上の値。
- 戻り値: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) オブジェクトの配列。各オブジェクトは、プリペアドステートメントを実行して返された行に対応します。各オブジェクトのキーと値は、行の列名と値に対応します。

このメソッドは、プリペアドステートメントを実行し、すべての結果をオブジェクトの配列として返します。プリペアドステートメントが結果を返さない場合、このメソッドは空の配列を返します。プリペアドステートメントの[パラメーターは、`namedParameters`と`anonymousParameters`の値を使用してバインドされます](https://www.sqlite.org/c3ref/bind_blob)。

### `statement.expandedSQL` {#statementexpandedsql}

**Added in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パラメーター値を含むように拡張されたソースSQL。

プリペアドステートメントのソースSQLテキスト。パラメータープレースホルダーは、このプリペアドステートメントの最新の実行時に使用された値に置き換えられます。このプロパティは、[`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql)のラッパーです。


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Added in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 名前付きパラメータをバインドするために使用されるオプションのオブジェクト。 このオブジェクトのキーは、マッピングの構成に使用されます。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 匿名パラメータにバインドするゼロ個以上の値。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) プリペアドステートメントを実行して返された最初の行に対応するオブジェクト。 オブジェクトのキーと値は、行の列名と値に対応します。 データベースから行が返されなかった場合、このメソッドは `undefined` を返します。

このメソッドは、プリペアドステートメントを実行し、最初の結果をオブジェクトとして返します。 プリペアドステートメントが結果を返さない場合、このメソッドは `undefined` を返します。 プリペアドステートメントの[パラメータは、`namedParameters` と `anonymousParameters` の値を使用してバインドされます](https://www.sqlite.org/c3ref/bind_blob)。

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Added in: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 名前付きパラメータをバインドするために使用されるオプションのオブジェクト。 このオブジェクトのキーは、マッピングの構成に使用されます。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 匿名パラメータにバインドするゼロ個以上の値。
- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) オブジェクトの反復可能イテレータ。 各オブジェクトは、プリペアドステートメントを実行して返された行に対応します。 各オブジェクトのキーと値は、行の列名と値に対応します。

このメソッドは、プリペアドステートメントを実行し、オブジェクトのイテレータを返します。 プリペアドステートメントが結果を返さない場合、このメソッドは空のイテレータを返します。 プリペアドステートメントの[パラメータは、`namedParameters` と `anonymousParameters` の値を使用してバインドされます](https://www.sqlite.org/c3ref/bind_blob)。


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Added in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 名前付きパラメータをバインドするために使用されるオプションのオブジェクト。このオブジェクトのキーは、マッピングを構成するために使用されます。
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 匿名パラメータにバインドするゼロ個以上の値。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 最近完了した`INSERT`、`UPDATE`、または`DELETE`ステートメントによって変更、挿入、または削除された行の数。このフィールドは、準備されたステートメントの構成に応じて、数値または`BigInt`のいずれかです。このプロパティは、[`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes)の結果です。
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 最近挿入された rowid。このフィールドは、準備されたステートメントの構成に応じて、数値または`BigInt`のいずれかです。このプロパティは、[`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid)の結果です。

このメソッドは、準備されたステートメントを実行し、結果として生じた変更をまとめたオブジェクトを返します。準備されたステートメント[パラメータは、`namedParameters`と`anonymousParameters`の値を使用してバインドされます](https://www.sqlite.org/c3ref/bind_blob)。


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**追加:** v22.5.0

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 接頭辞文字なしで名前付きパラメータのバインドのサポートを有効または無効にします。

SQLiteパラメータの名前は接頭辞文字で始まります。デフォルトでは、`node:sqlite`はパラメータをバインドするときにこの接頭辞文字が存在することを要求します。ただし、ドル記号を除いて、これらの接頭辞文字はオブジェクトキーで使用する場合にも追加の引用符が必要です。

人間工学を向上させるために、このメソッドを使用して、JavaScriptコードで接頭辞文字を必要としない、生の（bare）名前付きパラメータも許可できます。生の（bare）名前付きパラメータを有効にする場合は、注意すべき点がいくつかあります。

- 接頭辞文字はSQLで依然として必要です。
- 接頭辞文字はJavaScriptでも依然として許可されます。実際、接頭辞付きの名前の方がバインドのパフォーマンスがわずかに向上します。
- 同じプリペアドステートメントで`$k`や`@k`のようなあいまいな名前付きパラメータを使用すると、生の（bare）名前をどのようにバインドするかを判別できないため、例外が発生します。

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**追加:** v22.5.0

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) データベースから`INTEGER`フィールドを読み取るときに`BigInt`の使用を有効または無効にします。

データベースからの読み取り時、SQLiteの`INTEGER`はデフォルトでJavaScriptの数値にマッピングされます。ただし、SQLiteの`INTEGER`はJavaScriptの数値が表現できるよりも大きな値を格納できます。このような場合、このメソッドを使用して、JavaScriptの`BigInt`を使用して`INTEGER`データを読み取ることができます。このメソッドは、数値と`BigInt`の両方が常にサポートされているデータベースの書き込み操作には影響を与えません。

### `statement.sourceSQL` {#statementsourcesql}

**追加:** v22.5.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このプリペアドステートメントの作成に使用されたソースSQL。

プリペアドステートメントのソースSQLテキスト。このプロパティは、[`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql)のラッパーです。


### JavaScriptとSQLite間の型変換 {#type-conversion-between-javascript-and-sqlite}

Node.jsがSQLiteに書き込みまたは読み込みを行う場合、JavaScriptのデータ型とSQLiteの[データ型](https://www.sqlite.org/datatype3)の間で変換を行う必要があります。JavaScriptはSQLiteよりも多くのデータ型をサポートしているため、JavaScript型のサブセットのみがサポートされています。サポートされていないデータ型をSQLiteに書き込もうとすると、例外が発生します。

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   または   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**追加:** v23.5.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

SQLite操作で一般的に使用される定数を含むオブジェクト。

### SQLite定数 {#sqlite-constants}

次の定数は、`sqlite.constants`オブジェクトによってエクスポートされます。

#### 競合解決定数 {#conflict-resolution-constants}

次の定数は、[`database.applyChangeset()`](/ja/nodejs/api/sqlite#databaseapplychangesetchangeset-options)で使用することを目的としています。

| 定数 | 説明 |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | 競合する変更は省略されます。 |
| `SQLITE_CHANGESET_REPLACE` | 競合する変更は既存の値を置き換えます。 |
| `SQLITE_CHANGESET_ABORT` | 変更が競合に遭遇し、データベースをロールバックしたときに中止します。 |

