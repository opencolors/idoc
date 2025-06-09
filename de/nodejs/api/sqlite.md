---
title: Node.js SQLite API-Dokumentation
description: Die Node.js SQLite API-Dokumentation bietet umfassende Informationen darüber, wie man in Node.js-Anwendungen mit SQLite-Datenbanken interagiert. Sie umfasst die Verwaltung von Datenbankverbindungen, die Ausführung von SQL-Abfragen, die Transaktionsbehandlung und das Fehlerhandling.
head:
  - - meta
    - name: og:title
      content: Node.js SQLite API-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js SQLite API-Dokumentation bietet umfassende Informationen darüber, wie man in Node.js-Anwendungen mit SQLite-Datenbanken interagiert. Sie umfasst die Verwaltung von Datenbankverbindungen, die Ausführung von SQL-Abfragen, die Transaktionsbehandlung und das Fehlerhandling.
  - - meta
    - name: twitter:title
      content: Node.js SQLite API-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js SQLite API-Dokumentation bietet umfassende Informationen darüber, wie man in Node.js-Anwendungen mit SQLite-Datenbanken interagiert. Sie umfasst die Verwaltung von Datenbankverbindungen, die Ausführung von SQL-Abfragen, die Transaktionsbehandlung und das Fehlerhandling.
---


# SQLite {#sqlite}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung.
:::

**Quellcode:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

Das Modul `node:sqlite` erleichtert die Arbeit mit SQLite-Datenbanken. Um darauf zuzugreifen:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

Dieses Modul ist nur unter dem `node:`-Schema verfügbar.

Das folgende Beispiel zeigt die grundlegende Verwendung des Moduls `node:sqlite`, um eine In-Memory-Datenbank zu öffnen, Daten in die Datenbank zu schreiben und die Daten dann wieder auszulesen.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// SQL-Anweisungen aus Strings ausführen.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Eine vorbereitete Anweisung erstellen, um Daten in die Datenbank einzufügen.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Die vorbereitete Anweisung mit gebundenen Werten ausführen.
insert.run(1, 'hello');
insert.run(2, 'world');
// Eine vorbereitete Anweisung erstellen, um Daten aus der Datenbank zu lesen.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Die vorbereitete Anweisung ausführen und das Resultset protokollieren.
console.log(query.all());
// Gibt aus: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// SQL-Anweisungen aus Strings ausführen.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Eine vorbereitete Anweisung erstellen, um Daten in die Datenbank einzufügen.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Die vorbereitete Anweisung mit gebundenen Werten ausführen.
insert.run(1, 'hello');
insert.run(2, 'world');
// Eine vorbereitete Anweisung erstellen, um Daten aus der Datenbank zu lesen.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Die vorbereitete Anweisung ausführen und das Resultset protokollieren.
console.log(query.all());
// Gibt aus: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## Klasse: `DatabaseSync` {#class-databasesync}

**Hinzugefügt in: v22.5.0**

Diese Klasse repräsentiert eine einzelne [Verbindung](https://www.sqlite.org/c3ref/sqlite3) zu einer SQLite-Datenbank. Alle von dieser Klasse bereitgestellten APIs werden synchron ausgeführt.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Hinzugefügt in: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Speicherort der Datenbank. Eine SQLite-Datenbank kann in einer Datei oder vollständig [im Speicher](https://www.sqlite.org/inmemorydb) gespeichert werden. Um eine dateibasierte Datenbank zu verwenden, sollte der Speicherort ein Dateipfad sein. Um eine In-Memory-Datenbank zu verwenden, sollte der Speicherort der spezielle Name `':memory:'` sein.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für die Datenbankverbindung. Die folgenden Optionen werden unterstützt:
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Datenbank vom Konstruktor geöffnet. Wenn dieser Wert `false` ist, muss die Datenbank über die Methode `open()` geöffnet werden. **Standard:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Datenbank im schreibgeschützten Modus geöffnet. Wenn die Datenbank nicht existiert, schlägt das Öffnen fehl. **Standard:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Fremdschlüsselbeschränkungen aktiviert. Dies wird empfohlen, kann aber zur Kompatibilität mit Legacy-Datenbankschemata deaktiviert werden. Die Durchsetzung von Fremdschlüsselbeschränkungen kann nach dem Öffnen der Datenbank mit [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys) aktiviert und deaktiviert werden. **Standard:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, akzeptiert SQLite [doppelt gequotete String-Literale](https://www.sqlite.org/quirks#dblquote). Dies wird nicht empfohlen, kann aber zur Kompatibilität mit Legacy-Datenbankschemata aktiviert werden. **Standard:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden die SQL-Funktion `loadExtension` und die Methode `loadExtension()` aktiviert. Sie können `enableLoadExtension(false)` später aufrufen, um diese Funktion zu deaktivieren. **Standard:** `false`.

Erstellt eine neue `DatabaseSync`-Instanz.


### `database.close()` {#databaseclose}

**Hinzugefügt in: v22.5.0**

Schließt die Datenbankverbindung. Es wird eine Ausnahme ausgelöst, wenn die Datenbank nicht geöffnet ist. Diese Methode ist ein Wrapper um [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Hinzugefügt in: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfad zur gemeinsam genutzten Bibliothek, die geladen werden soll.

Lädt eine gemeinsam genutzte Bibliothek in die Datenbankverbindung. Diese Methode ist ein Wrapper um [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). Es ist erforderlich, die Option `allowExtension` beim Erstellen der `DatabaseSync`-Instanz zu aktivieren.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Hinzugefügt in: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob das Laden von Erweiterungen zulässig sein soll.

Aktiviert oder deaktiviert die SQL-Funktion `loadExtension` und die Methode `loadExtension()`. Wenn `allowExtension` beim Erstellen `false` ist, können Sie das Laden von Erweiterungen aus Sicherheitsgründen nicht aktivieren.

### `database.exec(sql)` {#databaseexecsql}

**Hinzugefügt in: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine auszuführende SQL-Zeichenfolge.

Mit dieser Methode können ein oder mehrere SQL-Anweisungen ausgeführt werden, ohne Ergebnisse zurückzugeben. Diese Methode ist nützlich, wenn SQL-Anweisungen aus einer Datei gelesen und ausgeführt werden. Diese Methode ist ein Wrapper um [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Hinzugefügt in: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name der zu erstellenden SQLite-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationseinstellungen für die Funktion. Die folgenden Eigenschaften werden unterstützt:
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird das Flag [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) für die erstellte Funktion gesetzt. **Standard:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird das Flag [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) für die erstellte Funktion gesetzt. **Standard:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Integer-Argumente für `function` in `BigInt`s konvertiert. Wenn `false`, werden Integer-Argumente als JavaScript-Zahlen übergeben. **Standard:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, kann `function` eine variable Anzahl von Argumenten akzeptieren. Wenn `false`, muss `function` mit genau `function.length` Argumenten aufgerufen werden. **Standard:** `false`.


- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die JavaScript-Funktion, die aufgerufen werden soll, wenn die SQLite-Funktion aufgerufen wird.

Diese Methode wird verwendet, um benutzerdefinierte SQLite-Funktionen zu erstellen. Diese Methode ist ein Wrapper um [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**Hinzugefügt in: v22.5.0**

Öffnet die im `location`-Argument des `DatabaseSync`-Konstruktors angegebene Datenbank. Diese Methode sollte nur verwendet werden, wenn die Datenbank nicht über den Konstruktor geöffnet wird. Es wird eine Ausnahme ausgelöst, wenn die Datenbank bereits geöffnet ist.

### `database.prepare(sql)` {#databasepreparesql}

**Hinzugefügt in: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine SQL-Zeichenkette, die in eine vorbereitete Anweisung kompiliert werden soll.
- Gibt zurück: [\<StatementSync\>](/de/nodejs/api/sqlite#class-statementsync) Die vorbereitete Anweisung.

Kompiliert eine SQL-Anweisung in eine [vorbereitete Anweisung](https://www.sqlite.org/c3ref/stmt). Diese Methode ist ein Wrapper um [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Hinzugefügt in: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die Konfigurationsoptionen für die Sitzung.
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine bestimmte Tabelle, für die Änderungen verfolgt werden sollen. Standardmäßig werden Änderungen an allen Tabellen verfolgt.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name der Datenbank, die verfolgt werden soll. Dies ist nützlich, wenn mehrere Datenbanken mit [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach) hinzugefügt wurden. **Standard**: `'main'`.


- Gibt zurück: [\<Session\>](/de/nodejs/api/sqlite#class-session) Ein Sitzungs-Handle.

Erstellt und fügt eine Sitzung an die Datenbank an. Diese Methode ist ein Wrapper um [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) und [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Hinzugefügt in: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ein binäres Changeset oder Patchset.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die Konfigurationsoptionen für die Art und Weise, wie die Änderungen angewendet werden.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Überspringt Änderungen, die bei Übergabe des Zieltabelle-Namens an diese Funktion einen Wahrheitswert zurückgeben. Standardmäßig werden alle Änderungen versucht.
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Bestimmt, wie Konflikte behandelt werden. **Standard**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: Konfliktierende Änderungen werden ausgelassen.
    - `SQLITE_CHANGESET_REPLACE`: Konfliktierende Änderungen ersetzen bestehende Werte.
    - `SQLITE_CHANGESET_ABORT`: Bricht bei Konflikten ab und setzt die Datenbank zurück.



- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob das Changeset erfolgreich angewendet wurde, ohne abgebrochen zu werden.

Es wird eine Ausnahme ausgelöst, wenn die Datenbank nicht geöffnet ist. Diese Methode ist ein Wrapper um [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

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
// Nachdem das Changeset angewendet wurde, enthält targetDb die gleichen Daten wie sourceDb.
```

## Klasse: `Session` {#class-session}

**Hinzugefügt in: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Hinzugefügt in: v23.3.0**

- Gibt zurück: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Binäres Changeset, das auf andere Datenbanken angewendet werden kann.

Ruft ein Changeset ab, das alle Änderungen seit der Erstellung des Changesets enthält. Kann mehrmals aufgerufen werden. Es wird eine Ausnahme ausgelöst, wenn die Datenbank oder die Sitzung nicht geöffnet ist. Diese Methode ist ein Wrapper um [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Hinzugefügt in: v23.3.0**

- Gibt zurück: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Binäres Patchset, das auf andere Datenbanken angewendet werden kann.

Ähnlich der obigen Methode, erzeugt aber ein kompakteres Patchset. Siehe [Changesets und Patchsets](https://www.sqlite.org/sessionintro#changesets_and_patchsets) in der Dokumentation von SQLite. Es wird eine Ausnahme ausgelöst, wenn die Datenbank oder die Sitzung nicht geöffnet ist. Diese Methode ist ein Wrapper um [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Schließt die Sitzung. Es wird eine Ausnahme ausgelöst, wenn die Datenbank oder die Sitzung nicht geöffnet ist. Diese Methode ist ein Wrapper um [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Klasse: `StatementSync` {#class-statementsync}

**Hinzugefügt in: v22.5.0**

Diese Klasse repräsentiert eine einzelne [vorbereitete Anweisung](https://www.sqlite.org/c3ref/stmt). Diese Klasse kann nicht über ihren Konstruktor instanziiert werden. Stattdessen werden Instanzen über die Methode `database.prepare()` erstellt. Alle von dieser Klasse bereitgestellten APIs werden synchron ausgeführt.

Eine vorbereitete Anweisung ist eine effiziente binäre Darstellung des SQL, das zum Erstellen verwendet wurde. Vorbereitete Anweisungen sind parametrisierbar und können mit verschiedenen gebundenen Werten mehrmals aufgerufen werden. Parameter bieten auch Schutz vor [SQL-Injection](https://en.wikipedia.org/wiki/SQL_injection) Angriffen. Aus diesen Gründen werden vorbereitete Anweisungen gegenüber handgefertigten SQL-Strings bevorzugt, wenn Benutzereingaben verarbeitet werden.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Hinzugefügt in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein optionales Objekt, das verwendet wird, um benannte Parameter zu binden. Die Schlüssel dieses Objekts werden verwendet, um die Zuordnung zu konfigurieren.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Null oder mehr Werte, die an anonyme Parameter gebunden werden sollen.
- Rückgabe: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Objekten. Jedes Objekt entspricht einer Zeile, die durch die Ausführung der vorbereiteten Anweisung zurückgegeben wird. Die Schlüssel und Werte jedes Objekts entsprechen den Spaltennamen und -werten der Zeile.

Diese Methode führt eine vorbereitete Anweisung aus und gibt alle Ergebnisse als Array von Objekten zurück. Wenn die vorbereitete Anweisung keine Ergebnisse zurückgibt, gibt diese Methode ein leeres Array zurück. Die [Parameter der vorbereiteten Anweisung werden gebunden](https://www.sqlite.org/c3ref/bind_blob) unter Verwendung der Werte in `namedParameters` und `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Hinzugefügt in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Quell-SQL-Code, der erweitert wurde, um Parameterwerte einzuschließen.

Der Quell-SQL-Text der vorbereiteten Anweisung, bei dem Parameterplatzhalter durch die Werte ersetzt wurden, die während der letzten Ausführung dieser vorbereiteten Anweisung verwendet wurden. Diese Eigenschaft ist ein Wrapper um [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Hinzugefügt in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein optionales Objekt, das verwendet wird, um benannte Parameter zu binden. Die Schlüssel dieses Objekts werden verwendet, um die Zuordnung zu konfigurieren.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Null oder mehr Werte, die an anonyme Parameter gebunden werden sollen.
- Rückgabe: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ein Objekt, das der ersten Zeile entspricht, die durch die Ausführung der vorbereiteten Anweisung zurückgegeben wird. Die Schlüssel und Werte des Objekts entsprechen den Spaltennamen und Werten der Zeile. Wenn keine Zeilen von der Datenbank zurückgegeben wurden, gibt diese Methode `undefined` zurück.

Diese Methode führt eine vorbereitete Anweisung aus und gibt das erste Ergebnis als Objekt zurück. Wenn die vorbereitete Anweisung keine Ergebnisse zurückgibt, gibt diese Methode `undefined` zurück. Die [Parameter der vorbereiteten Anweisung werden gebunden](https://www.sqlite.org/c3ref/bind_blob), indem die Werte in `namedParameters` und `anonymousParameters` verwendet werden.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Hinzugefügt in: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein optionales Objekt, das verwendet wird, um benannte Parameter zu binden. Die Schlüssel dieses Objekts werden verwendet, um die Zuordnung zu konfigurieren.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Null oder mehr Werte, die an anonyme Parameter gebunden werden sollen.
- Rückgabe: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) Ein iterierbarer Iterator von Objekten. Jedes Objekt entspricht einer Zeile, die durch die Ausführung der vorbereiteten Anweisung zurückgegeben wird. Die Schlüssel und Werte jedes Objekts entsprechen den Spaltennamen und Werten der Zeile.

Diese Methode führt eine vorbereitete Anweisung aus und gibt einen Iterator von Objekten zurück. Wenn die vorbereitete Anweisung keine Ergebnisse zurückgibt, gibt diese Methode einen leeren Iterator zurück. Die [Parameter der vorbereiteten Anweisung werden gebunden](https://www.sqlite.org/c3ref/bind_blob), indem die Werte in `namedParameters` und `anonymousParameters` verwendet werden.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Hinzugefügt in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein optionales Objekt, das zum Binden benannter Parameter verwendet wird. Die Schlüssel dieses Objekts werden verwendet, um die Zuordnung zu konfigurieren.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Null oder mehr Werte, die an anonyme Parameter gebunden werden sollen.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Die Anzahl der Zeilen, die durch die zuletzt abgeschlossene `INSERT`-, `UPDATE`- oder `DELETE`-Anweisung geändert, eingefügt oder gelöscht wurden. Dieses Feld ist entweder eine Zahl oder ein `BigInt`, abhängig von der Konfiguration der vorbereiteten Anweisung. Diese Eigenschaft ist das Ergebnis von [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Die zuletzt eingefügte Rowid. Dieses Feld ist entweder eine Zahl oder ein `BigInt`, abhängig von der Konfiguration der vorbereiteten Anweisung. Diese Eigenschaft ist das Ergebnis von [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).
  
 

Diese Methode führt eine vorbereitete Anweisung aus und gibt ein Objekt zurück, das die resultierenden Änderungen zusammenfasst. Die [Parameter der vorbereiteten Anweisung werden gebunden](https://www.sqlite.org/c3ref/bind_blob) mit den Werten in `namedParameters` und `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Hinzugefügt in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aktiviert oder deaktiviert die Unterstützung für das Binden von benannten Parametern ohne das Präfixzeichen.

Die Namen von SQLite-Parametern beginnen mit einem Präfixzeichen. Standardmäßig erfordert `node:sqlite`, dass dieses Präfixzeichen beim Binden von Parametern vorhanden ist. Mit Ausnahme des Dollarzeichens erfordern diese Präfixzeichen jedoch auch zusätzliche Anführungszeichen, wenn sie in Objektschlüsseln verwendet werden.

Um die Ergonomie zu verbessern, kann diese Methode verwendet werden, um auch "bare" benannte Parameter zu erlauben, die das Präfixzeichen in JavaScript-Code nicht erfordern. Es gibt mehrere Einschränkungen, die beachtet werden müssen, wenn "bare" benannte Parameter aktiviert werden:

- Das Präfixzeichen ist weiterhin in SQL erforderlich.
- Das Präfixzeichen ist in JavaScript weiterhin zulässig. Tatsächlich haben Namen mit Präfix eine etwas bessere Bindungsleistung.
- Die Verwendung von mehrdeutigen benannten Parametern, wie z. B. `$k` und `@k`, in derselben vorbereiteten Anweisung führt zu einer Ausnahme, da nicht bestimmt werden kann, wie ein "barer" Name gebunden werden soll.

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Hinzugefügt in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aktiviert oder deaktiviert die Verwendung von `BigInt`s beim Lesen von `INTEGER`-Feldern aus der Datenbank.

Beim Lesen aus der Datenbank werden SQLite `INTEGER`s standardmäßig JavaScript-Zahlen zugeordnet. SQLite `INTEGER`s können jedoch Werte speichern, die größer sind als JavaScript-Zahlen darstellen können. In solchen Fällen kann diese Methode verwendet werden, um `INTEGER`-Daten mit JavaScript `BigInt`s zu lesen. Diese Methode hat keinen Einfluss auf Datenbank-Schreibvorgänge, bei denen Zahlen und `BigInt`s jederzeit unterstützt werden.

### `statement.sourceSQL` {#statementsourcesql}

**Hinzugefügt in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Quell-SQL-Code, der zum Erstellen dieser vorbereiteten Anweisung verwendet wurde.

Der Quell-SQL-Text der vorbereiteten Anweisung. Diese Eigenschaft ist ein Wrapper um [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### Typkonvertierung zwischen JavaScript und SQLite {#type-conversion-between-javascript-and-sqlite}

Wenn Node.js in SQLite schreibt oder daraus liest, ist es notwendig, zwischen JavaScript-Datentypen und den [Datentypen](https://www.sqlite.org/datatype3) von SQLite zu konvertieren. Da JavaScript mehr Datentypen unterstützt als SQLite, wird nur eine Teilmenge der JavaScript-Typen unterstützt. Der Versuch, einen nicht unterstützten Datentyp in SQLite zu schreiben, führt zu einer Ausnahme.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   oder   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**Hinzugefügt in: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ein Objekt, das häufig verwendete Konstanten für SQLite-Operationen enthält.

### SQLite-Konstanten {#sqlite-constants}

Die folgenden Konstanten werden vom `sqlite.constants`-Objekt exportiert.

#### Konfliktlösungs-Konstanten {#conflict-resolution-constants}

Die folgenden Konstanten sind für die Verwendung mit [`database.applyChangeset()`](/de/nodejs/api/sqlite#databaseapplychangesetchangeset-options) vorgesehen.

| Konstante | Beschreibung |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Konfliktierende Änderungen werden ausgelassen. |
| `SQLITE_CHANGESET_REPLACE` | Konfliktierende Änderungen ersetzen bestehende Werte. |
| `SQLITE_CHANGESET_ABORT` | Abbruch, wenn eine Änderung auf einen Konflikt stößt und die Datenbank zurückgesetzt wird. |

