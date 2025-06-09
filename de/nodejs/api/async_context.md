---
title: Node.js Dokumentation - Asynchroner Kontextverfolgung
description: Erfahren Sie, wie Sie asynchrone Operationen in Node.js mit dem async_hooks-Modul verfolgen können, das eine Möglichkeit bietet, Rückrufe für verschiedene asynchrone Ereignisse zu registrieren.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Asynchroner Kontextverfolgung | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie asynchrone Operationen in Node.js mit dem async_hooks-Modul verfolgen können, das eine Möglichkeit bietet, Rückrufe für verschiedene asynchrone Ereignisse zu registrieren.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Asynchroner Kontextverfolgung | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie asynchrone Operationen in Node.js mit dem async_hooks-Modul verfolgen können, das eine Möglichkeit bietet, Rückrufe für verschiedene asynchrone Ereignisse zu registrieren.
---


# Asynchrone Kontextverfolgung {#asynchronous-context-tracking}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## Einführung {#introduction}

Diese Klassen werden verwendet, um Zustände zu verknüpfen und sie über Callbacks und Promise-Ketten hinweg zu propagieren. Sie ermöglichen das Speichern von Daten während der gesamten Lebensdauer einer Webanfrage oder einer anderen asynchronen Dauer. Es ähnelt dem Thread-lokalen Speicher in anderen Sprachen.

Die Klassen `AsyncLocalStorage` und `AsyncResource` sind Teil des Moduls `node:async_hooks`:

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Klasse: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.4.0 | AsyncLocalStorage ist jetzt stabil. Zuvor war es experimentell. |
| v13.10.0, v12.17.0 | Hinzugefügt in: v13.10.0, v12.17.0 |
:::

Diese Klasse erstellt Speicher, die über asynchrone Operationen hinweg zusammenhängend bleiben.

Obwohl Sie Ihre eigene Implementierung auf Basis des Moduls `node:async_hooks` erstellen können, sollte `AsyncLocalStorage` bevorzugt werden, da es sich um eine performante und speichersichere Implementierung handelt, die erhebliche Optimierungen beinhaltet, deren Implementierung nicht offensichtlich ist.

Das folgende Beispiel verwendet `AsyncLocalStorage`, um einen einfachen Logger zu erstellen, der eingehenden HTTP-Anfragen IDs zuweist und diese in innerhalb jeder Anfrage protokollierten Nachrichten einbezieht.

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

Jede Instanz von `AsyncLocalStorage` verwaltet einen unabhängigen Speicherkontext. Mehrere Instanzen können sicher gleichzeitig existieren, ohne das Risiko, die Daten der anderen zu beeinträchtigen.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v19.7.0, v18.16.0 | Experimentelle Option onPropagate entfernt. |
| v19.2.0, v18.13.0 | Option onPropagate hinzugefügt. |
| v13.10.0, v12.17.0 | Hinzugefügt in: v13.10.0, v12.17.0 |
:::

Erstellt eine neue Instanz von `AsyncLocalStorage`. Der Speicher wird nur innerhalb eines `run()`-Aufrufs oder nach einem `enterWith()`-Aufruf bereitgestellt.

### Statische Methode: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Hinzugefügt in: v19.8.0, v18.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die an den aktuellen Ausführungskontext gebunden werden soll.
- Gibt zurück: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine neue Funktion, die `fn` innerhalb des erfassten Ausführungskontexts aufruft.

Bindet die gegebene Funktion an den aktuellen Ausführungskontext.

### Statische Methode: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Hinzugefügt in: v19.8.0, v18.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- Gibt zurück: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine neue Funktion mit der Signatur `(fn: (...args) : R, ...args) : R`.

Erfasst den aktuellen Ausführungskontext und gibt eine Funktion zurück, die eine Funktion als Argument akzeptiert. Wenn die zurückgegebene Funktion aufgerufen wird, ruft sie die an sie übergebene Funktion innerhalb des erfassten Kontexts auf.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // gibt 123 zurück
```
AsyncLocalStorage.snapshot() kann die Verwendung von AsyncResource für einfache Zwecke der Async-Kontextverfolgung ersetzen, zum Beispiel:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // gibt 123 zurück
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Hinzugefügt in: v13.10.0, v12.17.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Deaktiviert die Instanz von `AsyncLocalStorage`. Alle nachfolgenden Aufrufe von `asyncLocalStorage.getStore()` geben `undefined` zurück, bis `asyncLocalStorage.run()` oder `asyncLocalStorage.enterWith()` erneut aufgerufen werden.

Beim Aufruf von `asyncLocalStorage.disable()` werden alle aktuellen Kontexte, die mit der Instanz verknüpft sind, beendet.

Der Aufruf von `asyncLocalStorage.disable()` ist erforderlich, bevor der `asyncLocalStorage` garbage-collectet werden kann. Dies gilt nicht für von `asyncLocalStorage` bereitgestellte Speicher, da diese Objekte zusammen mit den entsprechenden asynchronen Ressourcen garbage-collectet werden.

Verwenden Sie diese Methode, wenn `asyncLocalStorage` im aktuellen Prozess nicht mehr verwendet wird.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Hinzugefügt in: v13.10.0, v12.17.0**

- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Gibt den aktuellen Store zurück. Wenn er außerhalb eines asynchronen Kontextes aufgerufen wird, der durch den Aufruf von `asyncLocalStorage.run()` oder `asyncLocalStorage.enterWith()` initialisiert wurde, gibt er `undefined` zurück.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Hinzugefügt in: v13.11.0, v12.17.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Wechselt für den Rest der aktuellen synchronen Ausführung in den Kontext und speichert dann den Store durch alle folgenden asynchronen Aufrufe.

Beispiel:

```js [ESM]
const store = { id: 1 };
// Ersetzt vorherigen Store mit dem angegebenen Store-Objekt
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Gibt das Store-Objekt zurück
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Gibt dasselbe Objekt zurück
});
```

Dieser Übergang wird für die *gesamte* synchrone Ausführung fortgesetzt. Das bedeutet, dass wenn der Kontext beispielsweise innerhalb eines Ereignishandlers eingegeben wird, auch nachfolgende Ereignishandler innerhalb dieses Kontextes ausgeführt werden, es sei denn, sie werden explizit mit einer `AsyncResource` an einen anderen Kontext gebunden. Aus diesem Grund sollte `run()` gegenüber `enterWith()` bevorzugt werden, es sei denn, es gibt triftige Gründe, die letztere Methode zu verwenden.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Gibt dasselbe Objekt zurück
});

asyncLocalStorage.getStore(); // Gibt undefined zurück
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Gibt dasselbe Objekt zurück
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Hinzugefügt in: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Führt eine Funktion synchron innerhalb eines Kontexts aus und gibt ihren Rückgabewert zurück. Der Store ist außerhalb der Callback-Funktion nicht zugänglich. Der Store ist für alle asynchronen Operationen zugänglich, die innerhalb des Callbacks erstellt werden.

Die optionalen `args` werden an die Callback-Funktion übergeben.

Wenn die Callback-Funktion einen Fehler auslöst, wird der Fehler auch von `run()` ausgelöst. Der Stacktrace wird von diesem Aufruf nicht beeinflusst und der Kontext wird verlassen.

Beispiel:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Gibt das Store-Objekt zurück
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Gibt das Store-Objekt zurück
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Gibt undefined zurück
  // Der Fehler wird hier abgefangen
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Hinzugefügt in: v13.10.0, v12.17.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Führt eine Funktion synchron außerhalb eines Kontexts aus und gibt ihren Rückgabewert zurück. Der Store ist weder innerhalb der Callback-Funktion noch für die asynchronen Operationen zugänglich, die innerhalb des Callbacks erstellt werden. Jeder `getStore()`-Aufruf, der innerhalb der Callback-Funktion durchgeführt wird, gibt immer `undefined` zurück.

Die optionalen `args` werden an die Callback-Funktion übergeben.

Wenn die Callback-Funktion einen Fehler auslöst, wird der Fehler auch von `exit()` ausgelöst. Der Stacktrace wird von diesem Aufruf nicht beeinflusst und der Kontext wird wieder betreten.

Beispiel:

```js [ESM]
// Innerhalb eines Aufrufs von run
try {
  asyncLocalStorage.getStore(); // Gibt das Store-Objekt oder den Wert zurück
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Gibt undefined zurück
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Gibt dasselbe Objekt oder denselben Wert zurück
  // Der Fehler wird hier abgefangen
}
```

### Verwendung mit `async/await` {#usage-with-async/await}

Wenn innerhalb einer Async-Funktion nur ein `await`-Aufruf in einem Kontext ausgeführt werden soll, sollte folgendes Muster verwendet werden:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // Der Rückgabewert von foo wird erwartet (awaited)
  });
}
```
In diesem Beispiel ist der Store nur in der Callback-Funktion und den von `foo` aufgerufenen Funktionen verfügbar. Außerhalb von `run` gibt der Aufruf von `getStore` `undefined` zurück.

### Fehlerbehebung: Kontextverlust {#troubleshooting-context-loss}

In den meisten Fällen funktioniert `AsyncLocalStorage` problemlos. In seltenen Situationen geht der aktuelle Store bei einer der asynchronen Operationen verloren.

Wenn Ihr Code Callback-basiert ist, reicht es aus, ihn mit [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal) zu promisifizieren, damit er mit nativen Promises funktioniert.

Wenn Sie eine Callback-basierte API verwenden müssen oder Ihr Code eine benutzerdefinierte Thenable-Implementierung voraussetzt, verwenden Sie die Klasse [`AsyncResource`](/de/nodejs/api/async_context#class-asyncresource), um die asynchrone Operation dem richtigen Ausführungskontext zuzuordnen. Finden Sie den Funktionsaufruf, der für den Kontextverlust verantwortlich ist, indem Sie den Inhalt von `asyncLocalStorage.getStore()` nach den Aufrufen protokollieren, von denen Sie vermuten, dass sie für den Verlust verantwortlich sind. Wenn der Code `undefined` protokolliert, ist wahrscheinlich der zuletzt aufgerufene Callback für den Kontextverlust verantwortlich.

## Klasse: `AsyncResource` {#class-asyncresource}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.4.0 | AsyncResource ist jetzt Stable. Zuvor war sie Experimental. |
:::

Die Klasse `AsyncResource` wurde entwickelt, um von den asynchronen Ressourcen des Embedders erweitert zu werden. Auf diese Weise können Benutzer auf einfache Weise die Lebensdauerereignisse ihrer eigenen Ressourcen auslösen.

Der `init`-Hook wird ausgelöst, wenn eine `AsyncResource` instanziiert wird.

Das Folgende ist eine Übersicht über die `AsyncResource`-API.

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() ist dazu gedacht, erweitert zu werden. Das Instanziieren einer
// neuen AsyncResource() löst auch init aus. Wenn triggerAsyncId weggelassen wird, dann
// wird async_hook.executionAsyncId() verwendet.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Führt eine Funktion im Ausführungskontext der Ressource aus. Dies wird
// * den Kontext der Ressource herstellen
// * die AsyncHooks before-Callbacks auslösen
// * die bereitgestellte Funktion `fn` mit den angegebenen Argumenten aufrufen
// * die AsyncHooks after-Callbacks auslösen
// * den ursprünglichen Ausführungskontext wiederherstellen
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Ruft AsyncHooks destroy-Callbacks auf.
asyncResource.emitDestroy();

// Gibt die eindeutige ID zurück, die der AsyncResource-Instanz zugewiesen wurde.
asyncResource.asyncId();

// Gibt die Trigger-ID für die AsyncResource-Instanz zurück.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() ist dazu gedacht, erweitert zu werden. Das Instanziieren einer
// neuen AsyncResource() löst auch init aus. Wenn triggerAsyncId weggelassen wird, dann
// wird async_hook.executionAsyncId() verwendet.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Führt eine Funktion im Ausführungskontext der Ressource aus. Dies wird
// * den Kontext der Ressource herstellen
// * die AsyncHooks before-Callbacks auslösen
// * die bereitgestellte Funktion `fn` mit den angegebenen Argumenten aufrufen
// * die AsyncHooks after-Callbacks auslösen
// * den ursprünglichen Ausführungskontext wiederherstellen
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Ruft AsyncHooks destroy-Callbacks auf.
asyncResource.emitDestroy();

// Gibt die eindeutige ID zurück, die der AsyncResource-Instanz zugewiesen wurde.
asyncResource.asyncId();

// Gibt die Trigger-ID für die AsyncResource-Instanz zurück.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Typ des asynchronen Ereignisses.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die ID des Ausführungskontexts, der dieses asynchrone Ereignis erstellt hat. **Standard:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, wird `emitDestroy` deaktiviert, wenn das Objekt per Garbage Collection bereinigt wird. Dies muss normalerweise nicht gesetzt werden (auch wenn `emitDestroy` manuell aufgerufen wird), es sei denn, die `asyncId` der Ressource wird abgerufen und die sensible API `emitDestroy` wird damit aufgerufen. Wenn auf `false` gesetzt, erfolgt der `emitDestroy`-Aufruf bei der Garbage Collection nur, wenn mindestens ein aktiver `destroy`-Hook vorhanden ist. **Standard:** `false`.

Beispiel für die Verwendung:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### Statische Methode: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Die Eigenschaft `asyncResource`, die der gebundenen Funktion hinzugefügt wurde, ist veraltet und wird in einer zukünftigen Version entfernt. |
| v17.8.0, v16.15.0 | Das Standardverhalten wurde geändert, wenn `thisArg` undefiniert ist, sodass `this` vom Aufrufer verwendet wird. |
| v16.0.0 | Optionales thisArg hinzugefügt. |
| v14.8.0, v12.19.0 | Hinzugefügt in: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die an den aktuellen Ausführungskontext gebunden werden soll.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein optionaler Name, der der zugrunde liegenden `AsyncResource` zugeordnet werden soll.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Bindet die gegebene Funktion an den aktuellen Ausführungskontext.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Die Eigenschaft `asyncResource`, die der gebundenen Funktion hinzugefügt wurde, ist veraltet und wird in einer zukünftigen Version entfernt. |
| v17.8.0, v16.15.0 | Der Standardwert bei undefiniertem `thisArg` wurde geändert, sodass `this` vom Aufrufer verwendet wird. |
| v16.0.0 | Optionales thisArg hinzugefügt. |
| v14.8.0, v12.19.0 | Hinzugefügt in: v14.8.0, v12.19.0 |
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die an die aktuelle `AsyncResource` gebunden werden soll.
- `thisArg` [\<beliebig\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Bindet die gegebene Funktion zur Ausführung an den Bereich dieser `AsyncResource`.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Hinzugefügt in: v9.6.0**

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die im Ausführungskontext dieser asynchronen Ressource aufgerufen werden soll.
- `thisArg` [\<beliebig\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Empfänger, der für den Funktionsaufruf verwendet werden soll.
- `...args` [\<beliebig\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die an die Funktion übergeben werden sollen.

Ruft die bereitgestellte Funktion mit den bereitgestellten Argumenten im Ausführungskontext der asynchronen Ressource auf. Dies stellt den Kontext her, löst die AsyncHooks-Before-Callbacks aus, ruft die Funktion auf, löst die AsyncHooks-After-Callbacks aus und stellt dann den ursprünglichen Ausführungskontext wieder her.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Gibt zurück: [\<AsyncResource\>](/de/nodejs/api/async_hooks#class-asyncresource) Eine Referenz auf `asyncResource`.

Ruft alle `destroy`-Hooks auf. Dies sollte nur einmal aufgerufen werden. Es wird ein Fehler ausgegeben, wenn es mehr als einmal aufgerufen wird. Dies **muss** manuell aufgerufen werden. Wenn die Ressource vom GC erfasst wird, werden die `destroy`-Hooks niemals aufgerufen.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die eindeutige `asyncId`, die der Ressource zugewiesen wurde.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dieselbe `triggerAsyncId`, die an den `AsyncResource`-Konstruktor übergeben wird.

### Verwenden von `AsyncResource` für einen `Worker`-Thread-Pool {#using-asyncresource-for-a-worker-thread-pool}

Das folgende Beispiel zeigt, wie die Klasse `AsyncResource` verwendet wird, um eine korrekte asynchrone Verfolgung für einen [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Pool bereitzustellen. Andere Ressourcen-Pools, wie z. B. Datenbankverbindungspools, können einem ähnlichen Modell folgen.

Angenommen, die Aufgabe besteht darin, zwei Zahlen zu addieren, wobei eine Datei namens `task_processor.js` mit folgendem Inhalt verwendet wird:

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

Ein Worker-Pool darum herum könnte die folgende Struktur verwenden:

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s werden nur einmal verwendet.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Jedes Mal, wenn das kWorkerFreedEvent ausgelöst wird, wird die nächste
    // in der Warteschlange ausstehende Aufgabe verarbeitet, falls vorhanden.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // Im Erfolgsfall: Rufe den Callback auf, der an `runTask` übergeben wurde,
      // entferne die mit dem Worker verknüpfte `TaskInfo` und markiere sie wieder
      // als frei.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // Im Falle einer unbehandelten Ausnahme: Rufe den Callback auf, der an
      // `runTask` mit dem Fehler übergeben wurde.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Entferne den Worker aus der Liste und starte einen neuen Worker, um den
      // aktuellen zu ersetzen.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Keine freien Threads, warte bis ein Worker-Thread frei wird.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s werden nur einmal verwendet.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Jedes Mal, wenn das kWorkerFreedEvent ausgelöst wird, wird die nächste
    // in der Warteschlange ausstehende Aufgabe verarbeitet, falls vorhanden.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // Im Erfolgsfall: Rufe den Callback auf, der an `runTask` übergeben wurde,
      // entferne die mit dem Worker verknüpfte `TaskInfo` und markiere sie wieder
      // als frei.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // Im Falle einer unbehandelten Ausnahme: Rufe den Callback auf, der an
      // `runTask` mit dem Fehler übergeben wurde.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Entferne den Worker aus der Liste und starte einen neuen Worker, um den
      // aktuellen zu ersetzen.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Keine freien Threads, warte bis ein Worker-Thread frei wird.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

Ohne die explizite Verfolgung, die von den `WorkerPoolTaskInfo`-Objekten hinzugefügt wird, würde es so aussehen, als ob die Callbacks den einzelnen `Worker`-Objekten zugeordnet sind. Die Erstellung der `Worker` ist jedoch nicht mit der Erstellung der Aufgaben verbunden und liefert keine Informationen darüber, wann Aufgaben geplant wurden.

Dieser Pool könnte wie folgt verwendet werden:

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### Integration von `AsyncResource` mit `EventEmitter` {#integrating-asyncresource-with-eventemitter}

Event-Listener, die durch einen [`EventEmitter`](/de/nodejs/api/events#class-eventemitter) ausgelöst werden, können in einem anderen Ausführungskontext ausgeführt werden als dem, der aktiv war, als `eventEmitter.on()` aufgerufen wurde.

Das folgende Beispiel zeigt, wie die `AsyncResource`-Klasse verwendet wird, um einen Event-Listener korrekt dem richtigen Ausführungskontext zuzuordnen. Der gleiche Ansatz kann auf einen [`Stream`](/de/nodejs/api/stream#stream) oder eine ähnliche ereignisgesteuerte Klasse angewendet werden.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```
:::

