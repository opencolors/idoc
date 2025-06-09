---
title: Documentazione dell'API SQLite per Node.js
description: La documentazione dell'API SQLite per Node.js fornisce dettagli completi su come interagire con i database SQLite nelle applicazioni Node.js. Copre la gestione delle connessioni al database, l'esecuzione di query SQL, la gestione delle transazioni e la gestione degli errori.
head:
  - - meta
    - name: og:title
      content: Documentazione dell'API SQLite per Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione dell'API SQLite per Node.js fornisce dettagli completi su come interagire con i database SQLite nelle applicazioni Node.js. Copre la gestione delle connessioni al database, l'esecuzione di query SQL, la gestione delle transazioni e la gestione degli errori.
  - - meta
    - name: twitter:title
      content: Documentazione dell'API SQLite per Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione dell'API SQLite per Node.js fornisce dettagli completi su come interagire con i database SQLite nelle applicazioni Node.js. Copre la gestione delle connessioni al database, l'esecuzione di query SQL, la gestione delle transazioni e la gestione degli errori.
---


# SQLite {#sqlite}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo.
:::

**Codice sorgente:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

Il modulo `node:sqlite` facilita il lavoro con i database SQLite. Per accedervi:



::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

Questo modulo è disponibile solo sotto lo schema `node:`.

L'esempio seguente mostra l'utilizzo di base del modulo `node:sqlite` per aprire un database in memoria, scrivere dati nel database e quindi rileggere i dati.



::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Esegui istruzioni SQL da stringhe.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Crea un'istruzione preparata per inserire dati nel database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Esegui l'istruzione preparata con valori associati.
insert.run(1, 'hello');
insert.run(2, 'world');
// Crea un'istruzione preparata per leggere dati dal database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Esegui l'istruzione preparata e registra il set di risultati.
console.log(query.all());
// Stampa: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Esegui istruzioni SQL da stringhe.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Crea un'istruzione preparata per inserire dati nel database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Esegui l'istruzione preparata con valori associati.
insert.run(1, 'hello');
insert.run(2, 'world');
// Crea un'istruzione preparata per leggere dati dal database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Esegui l'istruzione preparata e registra il set di risultati.
console.log(query.all());
// Stampa: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## Classe: `DatabaseSync` {#class-databasesync}

**Aggiunto in: v22.5.0**

Questa classe rappresenta una singola [connessione](https://www.sqlite.org/c3ref/sqlite3) a un database SQLite. Tutte le API esposte da questa classe vengono eseguite in modo sincrono.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Aggiunto in: v22.5.0**

- `location` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La posizione del database. Un database SQLite può essere memorizzato in un file o completamente [in memoria](https://www.sqlite.org/inmemorydb). Per utilizzare un database basato su file, la posizione deve essere un percorso di file. Per utilizzare un database in memoria, la posizione deve essere il nome speciale `':memory:'`.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per la connessione al database. Sono supportate le seguenti opzioni:
    - `open` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il database viene aperto dal costruttore. Quando questo valore è `false`, il database deve essere aperto tramite il metodo `open()`. **Predefinito:** `true`.
    - `readOnly` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il database viene aperto in modalità di sola lettura. Se il database non esiste, l'apertura fallirà. **Predefinito:** `false`.
    - `enableForeignKeyConstraints` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, i vincoli di chiave esterna sono abilitati. Ciò è consigliato, ma può essere disabilitato per la compatibilità con schemi di database legacy. L'applicazione dei vincoli di chiave esterna può essere abilitata e disabilitata dopo l'apertura del database utilizzando [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **Predefinito:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, SQLite accetterà [letterali stringa tra virgolette doppie](https://www.sqlite.org/quirks#dblquote). Questo non è raccomandato, ma può essere abilitato per la compatibilità con schemi di database legacy. **Predefinito:** `false`.
    - `allowExtension` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la funzione SQL `loadExtension` e il metodo `loadExtension()` sono abilitati. È possibile chiamare `enableLoadExtension(false)` in seguito per disabilitare questa funzionalità. **Predefinito:** `false`.

Costruisce una nuova istanza di `DatabaseSync`.


### `database.close()` {#databaseclose}

**Aggiunto in: v22.5.0**

Chiude la connessione al database. Viene generata un'eccezione se il database non è aperto. Questo metodo è un wrapper attorno a [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Aggiunto in: v23.5.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso della libreria condivisa da caricare.

Carica una libreria condivisa nella connessione al database. Questo metodo è un wrapper attorno a [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). È necessario abilitare l'opzione `allowExtension` quando si costruisce l'istanza `DatabaseSync`.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Aggiunto in: v23.5.0**

- `allow` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se consentire il caricamento di estensioni.

Abilita o disabilita la funzione SQL `loadExtension` e il metodo `loadExtension()`. Quando `allowExtension` è `false` durante la costruzione, non è possibile abilitare il caricamento di estensioni per motivi di sicurezza.

### `database.exec(sql)` {#databaseexecsql}

**Aggiunto in: v22.5.0**

- `sql` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa SQL da eseguire.

Questo metodo consente l'esecuzione di una o più istruzioni SQL senza restituire alcun risultato. Questo metodo è utile quando si eseguono istruzioni SQL lette da un file. Questo metodo è un wrapper attorno a [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Aggiunto in: v23.5.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della funzione SQLite da creare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Impostazioni di configurazione opzionali per la funzione. Sono supportate le seguenti proprietà:
    - `deterministic` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il flag [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) viene impostato sulla funzione creata. **Predefinito:** `false`.
    - `directOnly` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il flag [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) viene impostato sulla funzione creata. **Predefinito:** `false`.
    - `useBigIntArguments` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, gli argomenti interi a `function` vengono convertiti in `BigInt`. Se `false`, gli argomenti interi vengono passati come numeri JavaScript. **Predefinito:** `false`.
    - `varargs` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, `function` può accettare un numero variabile di argomenti. Se `false`, `function` deve essere invocata esattamente con `function.length` argomenti. **Predefinito:** `false`.


- `function` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione JavaScript da chiamare quando viene invocata la funzione SQLite.

Questo metodo viene utilizzato per creare funzioni definite dall'utente SQLite. Questo metodo è un wrapper attorno a [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**Aggiunto in: v22.5.0**

Apre il database specificato nell'argomento `location` del costruttore `DatabaseSync`. Questo metodo deve essere utilizzato solo quando il database non viene aperto tramite il costruttore. Viene generata un'eccezione se il database è già aperto.

### `database.prepare(sql)` {#databasepreparesql}

**Aggiunto in: v22.5.0**

- `sql` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa SQL da compilare in un'istruzione preparata.
- Restituisce: [\<StatementSync\>](/it/nodejs/api/sqlite#class-statementsync) L'istruzione preparata.

Compila un'istruzione SQL in una [istruzione preparata](https://www.sqlite.org/c3ref/stmt). Questo metodo è un wrapper attorno a [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Aggiunto in: v23.3.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le opzioni di configurazione per la sessione.
    - `table` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una tabella specifica per tenere traccia delle modifiche. Per impostazione predefinita, vengono tracciate le modifiche a tutte le tabelle.
    - `db` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del database da tracciare. Questo è utile quando sono stati aggiunti più database utilizzando [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **Predefinito**: `'main'`.


- Restituisce: [\<Sessione\>](/it/nodejs/api/sqlite#class-session) Un handle di sessione.

Crea e collega una sessione al database. Questo metodo è un wrapper attorno a [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) e [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Aggiunto in: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un changeset binario o patchset.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le opzioni di configurazione per la modalità di applicazione delle modifiche.
    - `filter` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ignora le modifiche che, quando il nome della tabella di destinazione viene fornito a questa funzione, restituiscono un valore truthy. Per impostazione predefinita, vengono tentate tutte le modifiche.
    - `onConflict` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Determina come vengono gestiti i conflitti. **Predefinito**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: le modifiche in conflitto vengono omesse.
    - `SQLITE_CHANGESET_REPLACE`: le modifiche in conflitto sostituiscono i valori esistenti.
    - `SQLITE_CHANGESET_ABORT`: interrompi in caso di conflitto ed esegui il rollback del database.



- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il changeset è stato applicato correttamente senza essere interrotto.

Viene generata un'eccezione se il database non è aperto. Questo metodo è un wrapper attorno a [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

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
// Ora che il changeset è stato applicato, targetDb contiene gli stessi dati di sourceDb.
```

## Classe: `Session` {#class-session}

**Aggiunto in: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Aggiunto in: v23.3.0**

- Restituisce: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Changeset binario che può essere applicato ad altri database.

Recupera un changeset contenente tutte le modifiche dall'ultimo changeset creato. Può essere chiamato più volte. Viene generata un'eccezione se il database o la sessione non sono aperti. Questo metodo è un wrapper attorno a [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Aggiunto in: v23.3.0**

- Restituisce: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Patchset binario che può essere applicato ad altri database.

Simile al metodo sopra, ma genera un patchset più compatto. Vedere [Changesets and Patchsets](https://www.sqlite.org/sessionintro#changesets_and_patchsets) nella documentazione di SQLite. Viene generata un'eccezione se il database o la sessione non sono aperti. Questo metodo è un wrapper attorno a [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Chiude la sessione. Viene generata un'eccezione se il database o la sessione non sono aperti. Questo metodo è un wrapper attorno a [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Classe: `StatementSync` {#class-statementsync}

**Aggiunto in: v22.5.0**

Questa classe rappresenta una singola [prepared statement](https://www.sqlite.org/c3ref/stmt). Questa classe non può essere istanziata tramite il suo costruttore. Invece, le istanze vengono create tramite il metodo `database.prepare()`. Tutte le API esposte da questa classe vengono eseguite in modo sincrono.

Una prepared statement è una rappresentazione binaria efficiente dell'SQL utilizzato per crearlo. Le prepared statement sono parametrizzabili e possono essere invocate più volte con valori associati diversi. I parametri offrono anche protezione contro gli attacchi di [SQL injection](https://en.wikipedia.org/wiki/SQL_injection). Per questi motivi, le prepared statement sono preferibili alle stringhe SQL create manualmente quando si gestisce l'input dell'utente.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Aggiunto in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto opzionale utilizzato per associare parametri denominati. Le chiavi di questo oggetto vengono utilizzate per configurare la mappatura.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero o più valori da associare a parametri anonimi.
- Restituisce: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di oggetti. Ogni oggetto corrisponde a una riga restituita dall'esecuzione dell'istruzione preparata. Le chiavi e i valori di ciascun oggetto corrispondono ai nomi delle colonne e ai valori della riga.

Questo metodo esegue un'istruzione preparata e restituisce tutti i risultati come un array di oggetti. Se l'istruzione preparata non restituisce alcun risultato, questo metodo restituisce un array vuoto. I [parametri sono associati](https://www.sqlite.org/c3ref/bind_blob) utilizzando i valori in `namedParameters` e `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Aggiunto in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'SQL sorgente espanso per includere i valori dei parametri.

Il testo SQL sorgente dell'istruzione preparata con i segnaposto dei parametri sostituiti dai valori che sono stati utilizzati durante l'esecuzione più recente di questa istruzione preparata. Questa proprietà è un wrapper attorno a [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Aggiunto in: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto opzionale utilizzato per associare parametri con nome. Le chiavi di questo oggetto vengono utilizzate per configurare la mappatura.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero o più valori da associare a parametri anonimi.
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un oggetto corrispondente alla prima riga restituita dall'esecuzione dell'istruzione preparata. Le chiavi e i valori dell'oggetto corrispondono ai nomi delle colonne e ai valori della riga. Se non sono state restituite righe dal database, questo metodo restituisce `undefined`.

Questo metodo esegue un'istruzione preparata e restituisce il primo risultato come oggetto. Se l'istruzione preparata non restituisce alcun risultato, questo metodo restituisce `undefined`. I [parametri vengono associati](https://www.sqlite.org/c3ref/bind_blob) utilizzando i valori in `namedParameters` e `anonymousParameters`.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Aggiunto in: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto opzionale utilizzato per associare parametri con nome. Le chiavi di questo oggetto vengono utilizzate per configurare la mappatura.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero o più valori da associare a parametri anonimi.
- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) Un iteratore iterabile di oggetti. Ogni oggetto corrisponde a una riga restituita dall'esecuzione dell'istruzione preparata. Le chiavi e i valori di ogni oggetto corrispondono ai nomi delle colonne e ai valori della riga.

Questo metodo esegue un'istruzione preparata e restituisce un iteratore di oggetti. Se l'istruzione preparata non restituisce alcun risultato, questo metodo restituisce un iteratore vuoto. I [parametri vengono associati](https://www.sqlite.org/c3ref/bind_blob) utilizzando i valori in `namedParameters` e `anonymousParameters`.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Aggiunto in: v22.5.0**

- `namedParameters` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto opzionale utilizzato per associare i parametri denominati. Le chiavi di questo oggetto vengono utilizzate per configurare la mappatura.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero o più valori da associare ai parametri anonimi.
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Il numero di righe modificate, inserite o eliminate dall'istruzione `INSERT`, `UPDATE` o `DELETE` completata più di recente. Questo campo è un numero o un `BigInt` a seconda della configurazione dell'istruzione preparata. Questa proprietà è il risultato di [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) L'ultimo rowid inserito più di recente. Questo campo è un numero o un `BigInt` a seconda della configurazione dell'istruzione preparata. Questa proprietà è il risultato di [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).

Questo metodo esegue un'istruzione preparata e restituisce un oggetto che riassume le modifiche risultanti. I [parametri](https://www.sqlite.org/c3ref/bind_blob) dell'istruzione preparata vengono associati utilizzando i valori in `namedParameters` e `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Aggiunto in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Abilita o disabilita il supporto per il binding di parametri denominati senza il carattere prefisso.

I nomi dei parametri SQLite iniziano con un carattere prefisso. Per impostazione predefinita, `node:sqlite` richiede che questo carattere prefisso sia presente durante il binding dei parametri. Tuttavia, ad eccezione del carattere del segno del dollaro, questi caratteri prefisso richiedono anche virgolette aggiuntive quando utilizzati nelle chiavi degli oggetti.

Per migliorare l'ergonomia, questo metodo può essere utilizzato anche per consentire parametri denominati "nudi", che non richiedono il carattere prefisso nel codice JavaScript. Ci sono diverse avvertenze da tenere a mente quando si abilitano i parametri denominati "nudi":

- Il carattere prefisso è ancora richiesto in SQL.
- Il carattere prefisso è ancora consentito in JavaScript. In realtà, i nomi con prefisso avranno prestazioni di binding leggermente migliori.
- L'utilizzo di parametri denominati ambigui, come `$k` e `@k`, nella stessa istruzione preparata comporterà un'eccezione in quanto non è possibile determinare come collegare un nome "nudo".

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Aggiunto in: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Abilita o disabilita l'uso di `BigInt` durante la lettura dei campi `INTEGER` dal database.

Quando si legge dal database, gli `INTEGER` SQLite vengono mappati ai numeri JavaScript per impostazione predefinita. Tuttavia, gli `INTEGER` SQLite possono memorizzare valori maggiori di quelli che i numeri JavaScript sono in grado di rappresentare. In tali casi, questo metodo può essere utilizzato per leggere i dati `INTEGER` utilizzando `BigInt` JavaScript. Questo metodo non ha alcun impatto sulle operazioni di scrittura del database in cui i numeri e i `BigInt` sono supportati in ogni momento.

### `statement.sourceSQL` {#statementsourcesql}

**Aggiunto in: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'SQL di origine utilizzato per creare questa istruzione preparata.

Il testo SQL di origine dell'istruzione preparata. Questa proprietà è un wrapper attorno a [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### Conversione del tipo di dati tra JavaScript e SQLite {#type-conversion-between-javascript-and-sqlite}

Quando Node.js scrive o legge da SQLite è necessario convertire tra i tipi di dati JavaScript e i [tipi di dati](https://www.sqlite.org/datatype3) di SQLite. Poiché JavaScript supporta più tipi di dati di SQLite, è supportato solo un sottoinsieme dei tipi JavaScript. Tentare di scrivere un tipo di dati non supportato in SQLite genererà un'eccezione.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   o   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**Aggiunto in: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un oggetto contenente costanti comunemente usate per le operazioni SQLite.

### Costanti SQLite {#sqlite-constants}

Le seguenti costanti sono esportate dall'oggetto `sqlite.constants`.

#### Costanti per la risoluzione dei conflitti {#conflict-resolution-constants}

Le seguenti costanti sono pensate per essere usate con [`database.applyChangeset()`](/it/nodejs/api/sqlite#databaseapplychangesetchangeset-options).

| Costante | Descrizione |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Le modifiche in conflitto vengono omesse. |
| `SQLITE_CHANGESET_REPLACE` | Le modifiche in conflitto sostituiscono i valori esistenti. |
| `SQLITE_CHANGESET_ABORT` | Interrompi quando una modifica incontra un conflitto e ripristina il database. |

