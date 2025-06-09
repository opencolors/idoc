---
title: Документация API SQLite для Node.js
description: Документация API SQLite для Node.js предоставляет подробные сведения о том, как взаимодействовать с базами данных SQLite в приложениях Node.js. Она охватывает управление подключениями к базе данных, выполнение SQL-запросов, обработку транзакций и управление ошибками.
head:
  - - meta
    - name: og:title
      content: Документация API SQLite для Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация API SQLite для Node.js предоставляет подробные сведения о том, как взаимодействовать с базами данных SQLite в приложениях Node.js. Она охватывает управление подключениями к базе данных, выполнение SQL-запросов, обработку транзакций и управление ошибками.
  - - meta
    - name: twitter:title
      content: Документация API SQLite для Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация API SQLite для Node.js предоставляет подробные сведения о том, как взаимодействовать с базами данных SQLite в приложениях Node.js. Она охватывает управление подключениями к базе данных, выполнение SQL-запросов, обработку транзакций и управление ошибками.
---


# SQLite {#sqlite}

**Добавлено в версии: v22.5.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка.
:::

**Исходный код:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

Модуль `node:sqlite` облегчает работу с базами данных SQLite. Чтобы получить к нему доступ:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

Этот модуль доступен только по схеме `node:`.

В следующем примере показано основное использование модуля `node:sqlite` для открытия базы данных в памяти, записи данных в базу данных и последующего чтения данных обратно.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Выполнение SQL-запросов из строк.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Создание подготовленного запроса для вставки данных в базу данных.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Выполнение подготовленного запроса со связанными значениями.
insert.run(1, 'hello');
insert.run(2, 'world');
// Создание подготовленного запроса для чтения данных из базы данных.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Выполнение подготовленного запроса и вывод результирующего набора.
console.log(query.all());
// Выводит: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Выполнение SQL-запросов из строк.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Создание подготовленного запроса для вставки данных в базу данных.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Выполнение подготовленного запроса со связанными значениями.
insert.run(1, 'hello');
insert.run(2, 'world');
// Создание подготовленного запроса для чтения данных из базы данных.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Выполнение подготовленного запроса и вывод результирующего набора.
console.log(query.all());
// Выводит: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## Класс: `DatabaseSync` {#class-databasesync}

**Добавлено в версии: v22.5.0**

Этот класс представляет собой единое [соединение](https://www.sqlite.org/c3ref/sqlite3) с базой данных SQLite. Все API, предоставляемые этим классом, выполняются синхронно.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Добавлено в версии: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Расположение базы данных. База данных SQLite может храниться в файле или полностью [в памяти](https://www.sqlite.org/inmemorydb). Чтобы использовать базу данных, хранящуюся в файле, местоположение должно быть путем к файлу. Чтобы использовать базу данных в памяти, местоположение должно быть специальным именем `':memory:'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для подключения к базе данных. Поддерживаются следующие параметры:
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, база данных открывается конструктором. Когда это значение равно `false`, база данных должна быть открыта с помощью метода `open()`. **По умолчанию:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, база данных открывается в режиме только для чтения. Если база данных не существует, ее открытие завершится неудачей. **По умолчанию:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, включаются ограничения внешнего ключа. Это рекомендуется, но может быть отключено для совместимости с устаревшими схемами баз данных. Принудительное применение ограничений внешнего ключа можно включить и отключить после открытия базы данных с помощью [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **По умолчанию:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, SQLite будет принимать [строковые литералы в двойных кавычках](https://www.sqlite.org/quirks#dblquote). Это не рекомендуется, но может быть включено для совместимости с устаревшими схемами баз данных. **По умолчанию:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, функция SQL `loadExtension` и метод `loadExtension()` включены. Вы можете вызвать `enableLoadExtension(false)` позже, чтобы отключить эту функцию. **По умолчанию:** `false`.

Создает новый экземпляр `DatabaseSync`.


### `database.close()` {#databaseclose}

**Добавлено в: v22.5.0**

Закрывает соединение с базой данных. Если база данных не открыта, выбрасывается исключение. Этот метод является оберткой для [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Добавлено в: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь к разделяемой библиотеке для загрузки.

Загружает разделяемую библиотеку в соединение с базой данных. Этот метод является оберткой для [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). Необходимо включить опцию `allowExtension` при создании экземпляра `DatabaseSync`.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Добавлено в: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Определяет, разрешена ли загрузка расширений.

Включает или отключает SQL-функцию `loadExtension` и метод `loadExtension()`. Если при создании `allowExtension` имеет значение `false`, вы не можете включить загрузку расширений по соображениям безопасности.

### `database.exec(sql)` {#databaseexecsql}

**Добавлено в: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SQL-строка для выполнения.

Этот метод позволяет выполнять один или несколько SQL-запросов без возврата каких-либо результатов. Этот метод полезен при выполнении SQL-запросов, считанных из файла. Этот метод является оберткой для [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Добавлено в: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя создаваемой SQLite-функции.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательные параметры конфигурации для функции. Поддерживаются следующие свойства:
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, флаг [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) устанавливается для созданной функции. **По умолчанию:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, флаг [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) устанавливается для созданной функции. **По умолчанию:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, целочисленные аргументы для `function` преобразуются в `BigInt`s. Если `false`, целочисленные аргументы передаются как числа JavaScript. **По умолчанию:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `function` может принимать переменное количество аргументов. Если `false`, `function` должна вызываться ровно с `function.length` аргументами. **По умолчанию:** `false`.
  
 
- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) JavaScript-функция, вызываемая при вызове SQLite-функции.

Этот метод используется для создания пользовательских функций SQLite. Этот метод является оберткой для [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**Добавлено в: v22.5.0**

Открывает базу данных, указанную в аргументе `location` конструктора `DatabaseSync`. Этот метод следует использовать только в том случае, если база данных не открыта через конструктор. Если база данных уже открыта, выбрасывается исключение.

### `database.prepare(sql)` {#databasepreparesql}

**Добавлено в: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SQL-строка для компиляции в подготовленное выражение.
- Возвращает: [\<StatementSync\>](/ru/nodejs/api/sqlite#class-statementsync) Подготовленное выражение.

Компилирует SQL-выражение в [подготовленное выражение](https://www.sqlite.org/c3ref/stmt). Этот метод является оберткой вокруг [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Добавлено в: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для сеанса.
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Определенная таблица для отслеживания изменений. По умолчанию отслеживаются изменения во всех таблицах.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя базы данных для отслеживания. Это полезно, когда несколько баз данных были добавлены с помощью [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **По умолчанию**: `'main'`.
  
 
- Возвращает: [\<Session\>](/ru/nodejs/api/sqlite#class-session) Дескриптор сеанса.

Создает и присоединяет сеанс к базе данных. Этот метод является оберткой вокруг [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) и [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Добавлено в: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Бинарный набор изменений или патчсет.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конфигурации для применения изменений.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Пропускает изменения, которые, когда имя целевой таблицы передается в эту функцию, возвращают истинное значение. По умолчанию предпринимаются все изменения.
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Определяет, как обрабатываются конфликты. **По умолчанию**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: конфликтующие изменения опускаются.
    - `SQLITE_CHANGESET_REPLACE`: конфликтующие изменения заменяют существующие значения.
    - `SQLITE_CHANGESET_ABORT`: прерывает работу при конфликте и откатывает базу данных.
  
 
  
 
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Успешно ли был применен набор изменений без прерывания.

Если база данных не открыта, выбрасывается исключение. Этот метод является оберткой вокруг [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

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
// Теперь, когда набор изменений был применен, targetDb содержит те же данные, что и sourceDb.
```

## Class: `Session` {#class-session}

**Добавлено в версии: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Добавлено в версии: v23.3.0**

- Возвращает: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Бинарный набор изменений, который может быть применен к другим базам данных.

Извлекает набор изменений, содержащий все изменения с момента создания набора изменений. Может вызываться несколько раз. Исключение выбрасывается, если база данных или сессия не открыты. Этот метод является оберткой вокруг [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Добавлено в версии: v23.3.0**

- Возвращает: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Бинарный набор патчей, который может быть применен к другим базам данных.

Аналогичен методу выше, но генерирует более компактный набор патчей. См. [Changesets and Patchsets](https://www.sqlite.org/sessionintro#changesets_and_patchsets) в документации SQLite. Исключение выбрасывается, если база данных или сессия не открыты. Этот метод является оберткой вокруг [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Закрывает сессию. Исключение выбрасывается, если база данных или сессия не открыты. Этот метод является оберткой вокруг [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Class: `StatementSync` {#class-statementsync}

**Добавлено в версии: v22.5.0**

Этот класс представляет собой отдельное [подготовленное выражение](https://www.sqlite.org/c3ref/stmt). Этот класс нельзя создать через его конструктор. Вместо этого экземпляры создаются с помощью метода `database.prepare()`. Все API, предоставляемые этим классом, выполняются синхронно.

Подготовленное выражение — это эффективное бинарное представление SQL, используемого для его создания. Подготовленные выражения можно параметризовать и вызывать несколько раз с разными связанными значениями. Параметры также предлагают защиту от [SQL-инъекций](https://en.wikipedia.org/wiki/SQL_injection). По этим причинам подготовленные выражения предпочтительнее строковых SQL-запросов, созданных вручную, при обработке пользовательского ввода.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Добавлено в версии: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный объект, используемый для привязки именованных параметров. Ключи этого объекта используются для настройки отображения.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ноль или более значений для привязки к анонимным параметрам.
- Возвращает: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив объектов. Каждый объект соответствует строке, возвращенной в результате выполнения подготовленного оператора. Ключи и значения каждого объекта соответствуют именам столбцов и значениям строки.

Этот метод выполняет подготовленный оператор и возвращает все результаты в виде массива объектов. Если подготовленный оператор не возвращает никаких результатов, этот метод возвращает пустой массив. [Параметры подготовленного оператора привязываются](https://www.sqlite.org/c3ref/bind_blob) с использованием значений в `namedParameters` и `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Добавлено в версии: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Исходный SQL, расширенный для включения значений параметров.

Исходный SQL-текст подготовленного оператора с заполнителями параметров, замененными значениями, которые использовались во время последнего выполнения этого подготовленного оператора. Это свойство является оболочкой для [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([именованныеПараметры][, ...анонимныеПараметры])` {#statementgetnamedparameters-anonymousparameters}

**Добавлено в версии: v22.5.0**

- `именованныеПараметры` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный объект, используемый для привязки именованных параметров. Ключи этого объекта используются для настройки сопоставления.
- `...анонимныеПараметры` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ноль или более значений для привязки к анонимным параметрам.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Объект, соответствующий первой строке, возвращенной в результате выполнения подготовленного выражения. Ключи и значения объекта соответствуют именам и значениям столбцов строки. Если из базы данных не было возвращено ни одной строки, этот метод возвращает `undefined`.

Этот метод выполняет подготовленное выражение и возвращает первый результат в виде объекта. Если подготовленное выражение не возвращает никаких результатов, этот метод возвращает `undefined`. [Параметры подготовленного выражения привязываются](https://www.sqlite.org/c3ref/bind_blob) с использованием значений в `именованныеПараметры` и `анонимныеПараметры`.

### `statement.iterate([именованныеПараметры][, ...анонимныеПараметры])` {#statementiteratenamedparameters-anonymousparameters}

**Добавлено в версии: v23.4.0**

- `именованныеПараметры` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный объект, используемый для привязки именованных параметров. Ключи этого объекта используются для настройки сопоставления.
- `...анонимныеПараметры` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ноль или более значений для привязки к анонимным параметрам.
- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) Итерируемый итератор объектов. Каждый объект соответствует строке, возвращенной в результате выполнения подготовленного выражения. Ключи и значения каждого объекта соответствуют именам и значениям столбцов строки.

Этот метод выполняет подготовленное выражение и возвращает итератор объектов. Если подготовленное выражение не возвращает никаких результатов, этот метод возвращает пустой итератор. [Параметры подготовленного выражения привязываются](https://www.sqlite.org/c3ref/bind_blob) с использованием значений в `именованныеПараметры` и `анонимныеПараметры`.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Добавлено в: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный объект, используемый для привязки именованных параметров. Ключи этого объекта используются для настройки сопоставления.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ноль или более значений для привязки к анонимным параметрам.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Количество строк, измененных, вставленных или удаленных последней выполненной инструкцией `INSERT`, `UPDATE` или `DELETE`. Это поле является либо числом, либо `BigInt` в зависимости от конфигурации подготовленного запроса. Это свойство является результатом [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Последний вставленный rowid. Это поле является либо числом, либо `BigInt` в зависимости от конфигурации подготовленного запроса. Это свойство является результатом [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).
  
 

Этот метод выполняет подготовленный запрос и возвращает объект, суммирующий результирующие изменения. Подготовленные параметры запроса [связываются](https://www.sqlite.org/c3ref/bind_blob) с использованием значений в `namedParameters` и `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Добавлено в версии: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Включает или отключает поддержку привязки именованных параметров без префиксного символа.

Имена параметров SQLite начинаются с префиксного символа. По умолчанию `node:sqlite` требует, чтобы этот префиксный символ присутствовал при привязке параметров. Однако, за исключением символа доллара, эти префиксные символы также требуют дополнительного экранирования при использовании в ключах объектов.

Для улучшения эргономики этот метод можно использовать для разрешения "голых" именованных параметров, которые не требуют префиксного символа в коде JavaScript. Следует учитывать несколько предостережений при включении "голых" именованных параметров:

- Префиксный символ по-прежнему требуется в SQL.
- Префиксный символ по-прежнему разрешен в JavaScript. Фактически, имена с префиксами будут иметь немного лучшую производительность привязки.
- Использование неоднозначных именованных параметров, таких как `$k` и `@k`, в одном и том же подготовленном операторе приведет к исключению, поскольку невозможно определить, как привязать "голое" имя.

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Добавлено в версии: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Включает или отключает использование `BigInt` при чтении полей `INTEGER` из базы данных.

При чтении из базы данных SQLite `INTEGER` по умолчанию сопоставляются с числами JavaScript. Однако SQLite `INTEGER` может хранить значения, превышающие возможности представления чисел JavaScript. В таких случаях этот метод можно использовать для чтения данных `INTEGER` с использованием JavaScript `BigInt`. Этот метод не влияет на операции записи в базу данных, где числа и `BigInt` поддерживаются постоянно.

### `statement.sourceSQL` {#statementsourcesql}

**Добавлено в версии: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Исходный SQL, используемый для создания этого подготовленного оператора.

Исходный SQL-текст подготовленного оператора. Это свойство является оберткой вокруг [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### Преобразование типов между JavaScript и SQLite {#type-conversion-between-javascript-and-sqlite}

Когда Node.js записывает данные в SQLite или считывает их из нее, необходимо преобразовывать типы данных между JavaScript и [типами данных](https://www.sqlite.org/datatype3) SQLite. Поскольку JavaScript поддерживает больше типов данных, чем SQLite, поддерживается только подмножество типов JavaScript. Попытка записать неподдерживаемый тип данных в SQLite приведет к исключению.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   или   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**Добавлено в: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект, содержащий часто используемые константы для операций SQLite.

### Константы SQLite {#sqlite-constants}

Следующие константы экспортируются объектом `sqlite.constants`.

#### Константы разрешения конфликтов {#conflict-resolution-constants}

Следующие константы предназначены для использования с [`database.applyChangeset()`](/ru/nodejs/api/sqlite#databaseapplychangesetchangeset-options).

| Константа | Описание |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Конфликтующие изменения игнорируются. |
| `SQLITE_CHANGESET_REPLACE` | Конфликтующие изменения заменяют существующие значения. |
| `SQLITE_CHANGESET_ABORT` | Прервать работу при возникновении конфликта и откатить базу данных. |

