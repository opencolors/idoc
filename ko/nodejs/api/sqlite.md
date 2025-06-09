---
title: Node.js SQLite API 문서
description: Node.js SQLite API 문서는 Node.js 애플리케이션에서 SQLite 데이터베이스와 상호작용하는 방법에 대한 포괄적인 세부 정보를 제공합니다. 데이터베이스 연결 관리, SQL 쿼리 실행, 트랜잭션 처리 및 오류 관리를 다룹니다.
head:
  - - meta
    - name: og:title
      content: Node.js SQLite API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js SQLite API 문서는 Node.js 애플리케이션에서 SQLite 데이터베이스와 상호작용하는 방법에 대한 포괄적인 세부 정보를 제공합니다. 데이터베이스 연결 관리, SQL 쿼리 실행, 트랜잭션 처리 및 오류 관리를 다룹니다.
  - - meta
    - name: twitter:title
      content: Node.js SQLite API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js SQLite API 문서는 Node.js 애플리케이션에서 SQLite 데이터베이스와 상호작용하는 방법에 대한 포괄적인 세부 정보를 제공합니다. 데이터베이스 연결 관리, SQL 쿼리 실행, 트랜잭션 처리 및 오류 관리를 다룹니다.
---


# SQLite {#sqlite}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중.
:::

**소스 코드:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

`node:sqlite` 모듈은 SQLite 데이터베이스 작업을 용이하게 합니다. 액세스하려면:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

이 모듈은 `node:` 스키마에서만 사용할 수 있습니다.

다음 예제는 `node:sqlite` 모듈의 기본적인 사용법을 보여줍니다. 메모리 내 데이터베이스를 열고, 데이터베이스에 데이터를 쓰고, 데이터를 다시 읽습니다.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// 문자열에서 SQL 문을 실행합니다.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// 데이터베이스에 데이터를 삽입하기 위한 준비된 문을 만듭니다.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// 바인딩된 값으로 준비된 문을 실행합니다.
insert.run(1, 'hello');
insert.run(2, 'world');
// 데이터베이스에서 데이터를 읽기 위한 준비된 문을 만듭니다.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// 준비된 문을 실행하고 결과 집합을 기록합니다.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// 문자열에서 SQL 문을 실행합니다.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// 데이터베이스에 데이터를 삽입하기 위한 준비된 문을 만듭니다.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// 바인딩된 값으로 준비된 문을 실행합니다.
insert.run(1, 'hello');
insert.run(2, 'world');
// 데이터베이스에서 데이터를 읽기 위한 준비된 문을 만듭니다.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// 준비된 문을 실행하고 결과 집합을 기록합니다.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## 클래스: `DatabaseSync` {#class-databasesync}

**추가된 버전: v22.5.0**

이 클래스는 SQLite 데이터베이스에 대한 단일 [연결](https://www.sqlite.org/c3ref/sqlite3)을 나타냅니다. 이 클래스에 의해 노출된 모든 API는 동기적으로 실행됩니다.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**추가된 버전: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 데이터베이스의 위치. SQLite 데이터베이스는 파일에 저장하거나 완전히 [메모리 내](https://www.sqlite.org/inmemorydb)에 저장할 수 있습니다. 파일 기반 데이터베이스를 사용하려면 위치는 파일 경로여야 합니다. 메모리 내 데이터베이스를 사용하려면 위치는 특수 이름인 `':memory:'`여야 합니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 데이터베이스 연결을 위한 구성 옵션. 다음 옵션이 지원됩니다.
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 생성자에 의해 데이터베이스가 열립니다. 이 값이 `false`인 경우 `open()` 메서드를 통해 데이터베이스를 열어야 합니다. **기본값:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 데이터베이스는 읽기 전용 모드로 열립니다. 데이터베이스가 존재하지 않으면 열기가 실패합니다. **기본값:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 외래 키 제약 조건이 활성화됩니다. 이것은 권장되지만 레거시 데이터베이스 스키마와의 호환성을 위해 비활성화할 수 있습니다. 외래 키 제약 조건의 적용은 [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys)를 사용하여 데이터베이스를 연 후 활성화 및 비활성화할 수 있습니다. **기본값:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 SQLite는 [큰따옴표로 묶인 문자열 리터럴](https://www.sqlite.org/quirks#dblquote)을 허용합니다. 이것은 권장되지 않지만 레거시 데이터베이스 스키마와의 호환성을 위해 활성화할 수 있습니다. **기본값:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `loadExtension` SQL 함수와 `loadExtension()` 메서드가 활성화됩니다. 나중에 `enableLoadExtension(false)`를 호출하여 이 기능을 비활성화할 수 있습니다. **기본값:** `false`.

새로운 `DatabaseSync` 인스턴스를 생성합니다.


### `database.close()` {#databaseclose}

**추가된 버전: v22.5.0**

데이터베이스 연결을 닫습니다. 데이터베이스가 열려 있지 않으면 예외가 발생합니다. 이 메서드는 [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close)를 래핑합니다.

### `database.loadExtension(path)` {#databaseloadextensionpath}

**추가된 버전: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 로드할 공유 라이브러리의 경로입니다.

공유 라이브러리를 데이터베이스 연결에 로드합니다. 이 메서드는 [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension)를 래핑합니다. `DatabaseSync` 인스턴스를 생성할 때 `allowExtension` 옵션을 활성화해야 합니다.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**추가된 버전: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) 확장 로드를 허용할지 여부입니다.

`loadExtension` SQL 함수와 `loadExtension()` 메서드를 활성화 또는 비활성화합니다. 생성 시 `allowExtension`이 `false`이면 보안상의 이유로 확장 로드를 활성화할 수 없습니다.

### `database.exec(sql)` {#databaseexecsql}

**추가된 버전: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 실행할 SQL 문자열입니다.

이 메서드를 사용하면 결과를 반환하지 않고 하나 이상의 SQL 문을 실행할 수 있습니다. 이 메서드는 파일에서 읽은 SQL 문을 실행할 때 유용합니다. 이 메서드는 [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec)를 래핑합니다.

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**추가된 버전: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 생성할 SQLite 함수의 이름입니다.
- `options` [\<Object\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object) 함수의 선택적 구성 설정입니다. 다음 속성이 지원됩니다.
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 생성된 함수에 [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) 플래그가 설정됩니다. **기본값:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 생성된 함수에 [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) 플래그가 설정됩니다. **기본값:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `function`에 대한 정수 인수가 `BigInt`로 변환됩니다. `false`이면 정수 인수가 JavaScript 숫자로 전달됩니다. **기본값:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `function`이 가변 개수의 인수를 허용할 수 있습니다. `false`이면 `function`을 정확히 `function.length` 개의 인수로 호출해야 합니다.

- `function` [\<Function\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function) SQLite 함수가 호출될 때 호출할 JavaScript 함수입니다.

이 메서드는 SQLite 사용자 정의 함수를 만드는 데 사용됩니다. 이 메서드는 [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function)를 래핑합니다.


### `database.open()` {#databaseopen}

**Added in: v22.5.0**

`DatabaseSync` 생성자의 `location` 인수에 지정된 데이터베이스를 엽니다. 이 메서드는 생성자를 통해 데이터베이스가 열리지 않은 경우에만 사용해야 합니다. 데이터베이스가 이미 열려 있으면 예외가 발생합니다.

### `database.prepare(sql)` {#databasepreparesql}

**Added in: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 준비된 명령문으로 컴파일할 SQL 문자열입니다.
- 반환: [\<StatementSync\>](/ko/nodejs/api/sqlite#class-statementsync) 준비된 명령문입니다.

SQL 명령문을 [준비된 명령문](https://www.sqlite.org/c3ref/stmt)으로 컴파일합니다. 이 메서드는 [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare)를 래핑합니다.

### `database.createSession([options])` {#databasecreatesessionoptions}

**Added in: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 세션의 구성 옵션입니다.
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 변경 사항을 추적할 특정 테이블입니다. 기본적으로 모든 테이블의 변경 사항이 추적됩니다.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 추적할 데이터베이스의 이름입니다. 이는 [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach)를 사용하여 여러 데이터베이스가 추가된 경우에 유용합니다. **기본값**: `'main'`.
  
 
- 반환: [\<Session\>](/ko/nodejs/api/sqlite#class-session) 세션 핸들입니다.

데이터베이스에 세션을 생성하고 연결합니다. 이 메서드는 [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) 및 [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach)를 래핑합니다.

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Added in: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 바이너리 변경 세트 또는 패치 세트입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 변경 사항을 적용하는 방법에 대한 구성 옵션입니다.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 대상 테이블 이름이 이 함수에 제공될 때 참 값을 반환하는 변경 사항을 건너뜁니다. 기본적으로 모든 변경 사항이 시도됩니다.
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 충돌 처리 방법을 결정합니다. **기본값**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: 충돌하는 변경 사항은 생략됩니다.
    - `SQLITE_CHANGESET_REPLACE`: 충돌하는 변경 사항은 기존 값을 대체합니다.
    - `SQLITE_CHANGESET_ABORT`: 충돌 시 중단하고 데이터베이스를 롤백합니다.
  
 
  
 
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 변경 세트가 중단되지 않고 성공적으로 적용되었는지 여부입니다.

데이터베이스가 열려 있지 않으면 예외가 발생합니다. 이 메서드는 [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply)를 래핑합니다.

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
// 이제 변경 세트가 적용되었으므로 targetDb는 sourceDb와 동일한 데이터를 포함합니다.
```

## Class: `Session` {#class-session}

**Added in: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Added in: v23.3.0**

- Returns: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 다른 데이터베이스에 적용할 수 있는 바이너리 변경 세트를 반환합니다.

변경 세트가 생성된 이후의 모든 변경 사항을 포함하는 변경 세트를 검색합니다. 여러 번 호출할 수 있습니다. 데이터베이스 또는 세션이 열려 있지 않으면 예외가 발생합니다. 이 메서드는 [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset)을 래핑합니다.

### `session.patchset()` {#sessionpatchset}

**Added in: v23.3.0**

- Returns: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 다른 데이터베이스에 적용할 수 있는 바이너리 패치 세트를 반환합니다.

위의 메서드와 유사하지만 더 컴팩트한 패치 세트를 생성합니다. SQLite 설명서의 [변경 세트 및 패치 세트](https://www.sqlite.org/sessionintro#changesets_and_patchsets)를 참조하십시오. 데이터베이스 또는 세션이 열려 있지 않으면 예외가 발생합니다. 이 메서드는 [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset)을 래핑합니다.

### `session.close()`. {#sessionclose}

세션을 닫습니다. 데이터베이스 또는 세션이 열려 있지 않으면 예외가 발생합니다. 이 메서드는 [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete)를 래핑합니다.

## Class: `StatementSync` {#class-statementsync}

**Added in: v22.5.0**

이 클래스는 단일 [준비된 명령문](https://www.sqlite.org/c3ref/stmt)을 나타냅니다. 이 클래스는 생성자를 통해 인스턴스화할 수 없습니다. 대신 인스턴스는 `database.prepare()` 메서드를 통해 생성됩니다. 이 클래스에서 노출하는 모든 API는 동기적으로 실행됩니다.

준비된 명령문은 이를 생성하는 데 사용된 SQL의 효율적인 바이너리 표현입니다. 준비된 명령문은 매개변수화할 수 있으며 바인딩된 다른 값으로 여러 번 호출할 수 있습니다. 매개변수는 [SQL 주입](https://en.wikipedia.org/wiki/SQL_injection) 공격으로부터 보호 기능도 제공합니다. 이러한 이유로 사용자 입력을 처리할 때는 수작업으로 만든 SQL 문자열보다 준비된 명령문을 선호합니다.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Added in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 명명된 매개변수를 바인딩하는 데 사용되는 선택적 객체입니다. 이 객체의 키는 매핑을 구성하는 데 사용됩니다.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 익명 매개변수에 바인딩할 0개 이상의 값입니다.
- 반환: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 객체의 배열입니다. 각 객체는 준비된 명령문을 실행하여 반환된 행에 해당합니다. 각 객체의 키와 값은 행의 열 이름과 값에 해당합니다.

이 메서드는 준비된 명령문을 실행하고 모든 결과를 객체 배열로 반환합니다. 준비된 명령문이 결과를 반환하지 않으면 이 메서드는 빈 배열을 반환합니다. 준비된 명령문 [매개변수는](https://www.sqlite.org/c3ref/bind_blob) `namedParameters` 및 `anonymousParameters`의 값을 사용하여 바인딩됩니다.

### `statement.expandedSQL` {#statementexpandedsql}

**Added in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 매개변수 값을 포함하도록 확장된 소스 SQL입니다.

준비된 명령문의 소스 SQL 텍스트는 매개변수 자리 표시자가 이 준비된 명령문의 가장 최근 실행 중에 사용된 값으로 대체된 것입니다. 이 속성은 [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql)의 래퍼입니다.


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Added in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 명명된 매개변수를 바인딩하는 데 사용되는 선택적 객체입니다. 이 객체의 키는 매핑을 구성하는 데 사용됩니다.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 익명 매개변수에 바인딩할 0개 이상의 값입니다.
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 준비된 명령문을 실행하여 반환된 첫 번째 행에 해당하는 객체입니다. 객체의 키와 값은 행의 열 이름 및 값에 해당합니다. 데이터베이스에서 반환된 행이 없으면 이 메서드는 `undefined`를 반환합니다.

이 메서드는 준비된 명령문을 실행하고 첫 번째 결과를 객체로 반환합니다. 준비된 명령문이 결과를 반환하지 않으면 이 메서드는 `undefined`를 반환합니다. 준비된 명령문 [매개변수는](https://www.sqlite.org/c3ref/bind_blob) `namedParameters` 및 `anonymousParameters`의 값을 사용하여 바인딩됩니다.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Added in: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 명명된 매개변수를 바인딩하는 데 사용되는 선택적 객체입니다. 이 객체의 키는 매핑을 구성하는 데 사용됩니다.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 익명 매개변수에 바인딩할 0개 이상의 값입니다.
- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) 객체의 반복 가능한 반복자입니다. 각 객체는 준비된 명령문을 실행하여 반환된 행에 해당합니다. 각 객체의 키와 값은 행의 열 이름 및 값에 해당합니다.

이 메서드는 준비된 명령문을 실행하고 객체의 반복자를 반환합니다. 준비된 명령문이 결과를 반환하지 않으면 이 메서드는 빈 반복자를 반환합니다. 준비된 명령문 [매개변수는](https://www.sqlite.org/c3ref/bind_blob) `namedParameters` 및 `anonymousParameters`의 값을 사용하여 바인딩됩니다.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**추가된 버전: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 명명된 매개변수를 바인딩하는 데 사용되는 선택적 객체입니다. 이 객체의 키는 매핑을 구성하는 데 사용됩니다.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 익명 매개변수에 바인딩할 하나 이상의 값입니다.
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 가장 최근에 완료된 `INSERT`, `UPDATE` 또는 `DELETE` 문에 의해 수정, 삽입 또는 삭제된 행의 수입니다. 이 필드는 준비된 문의 구성에 따라 숫자 또는 `BigInt`입니다. 이 속성은 [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes)의 결과입니다.
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 가장 최근에 삽입된 rowid입니다. 이 필드는 준비된 문의 구성에 따라 숫자 또는 `BigInt`입니다. 이 속성은 [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid)의 결과입니다.
  
 

이 메서드는 준비된 문을 실행하고 결과 변경 사항을 요약하는 객체를 반환합니다. 준비된 문 [매개변수는](https://www.sqlite.org/c3ref/bind_blob) `namedParameters` 및 `anonymousParameters`의 값을 사용하여 바인딩됩니다.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Added in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 접두사 문자 없이 명명된 매개변수를 바인딩하는 지원을 활성화하거나 비활성화합니다.

SQLite 매개변수의 이름은 접두사 문자로 시작합니다. 기본적으로 `node:sqlite`은 매개변수를 바인딩할 때 이 접두사 문자가 있어야 합니다. 그러나 달러 기호 문자를 제외하고 이러한 접두사 문자는 객체 키에 사용할 때 추가 인용 부호가 필요합니다.

인체 공학을 개선하기 위해 이 메서드를 사용하여 JavaScript 코드에서 접두사 문자가 필요 없는 일반 명명된 매개변수를 허용할 수도 있습니다. 일반 명명된 매개변수를 활성화할 때 주의해야 할 몇 가지 주의 사항이 있습니다.

- 접두사 문자는 SQL에서 여전히 필요합니다.
- 접두사 문자는 JavaScript에서 여전히 허용됩니다. 실제로 접두사가 붙은 이름은 바인딩 성능이 약간 더 좋습니다.
- 동일한 준비된 명령문에서 `$k` 및 `@k`와 같이 모호한 명명된 매개변수를 사용하면 일반 이름을 바인딩하는 방법을 결정할 수 없으므로 예외가 발생합니다.

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Added in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 데이터베이스에서 `INTEGER` 필드를 읽을 때 `BigInt` 사용을 활성화하거나 비활성화합니다.

데이터베이스에서 읽을 때 SQLite `INTEGER`는 기본적으로 JavaScript 숫자에 매핑됩니다. 그러나 SQLite `INTEGER`는 JavaScript 숫자가 나타낼 수 있는 것보다 더 큰 값을 저장할 수 있습니다. 이 경우 이 메서드를 사용하여 JavaScript `BigInt`를 사용하여 `INTEGER` 데이터를 읽을 수 있습니다. 이 메서드는 숫자와 `BigInt`가 항상 지원되는 데이터베이스 쓰기 작업에는 영향을 미치지 않습니다.

### `statement.sourceSQL` {#statementsourcesql}

**Added in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 준비된 명령문을 만드는 데 사용된 소스 SQL입니다.

준비된 명령문의 소스 SQL 텍스트입니다. 이 속성은 [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql)에 대한 래퍼입니다.


### JavaScript와 SQLite 간의 타입 변환 {#type-conversion-between-javascript-and-sqlite}

Node.js가 SQLite에 쓰거나 읽을 때 JavaScript 데이터 타입과 SQLite의 [데이터 타입](https://www.sqlite.org/datatype3) 간에 변환이 필요합니다. JavaScript는 SQLite보다 더 많은 데이터 타입을 지원하므로 JavaScript 타입의 하위 집합만 지원됩니다. 지원되지 않는 데이터 타입을 SQLite에 쓰려고 하면 예외가 발생합니다.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   또는   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**v23.5.0에 추가됨**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

SQLite 작업에 일반적으로 사용되는 상수를 포함하는 객체입니다.

### SQLite 상수 {#sqlite-constants}

다음 상수는 `sqlite.constants` 객체에 의해 내보내집니다.

#### 충돌 해결 상수 {#conflict-resolution-constants}

다음 상수는 [`database.applyChangeset()`](/ko/nodejs/api/sqlite#databaseapplychangesetchangeset-options)과 함께 사용하기 위한 것입니다.

| 상수 | 설명 |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | 충돌하는 변경 사항은 생략됩니다. |
| `SQLITE_CHANGESET_REPLACE` | 충돌하는 변경 사항은 기존 값을 대체합니다. |
| `SQLITE_CHANGESET_ABORT` | 변경 사항이 충돌과 마주치면 중단하고 데이터베이스를 롤백합니다. |

