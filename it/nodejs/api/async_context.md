---
title: Documentazione Node.js - Tracciamento del Contesto Asincrono
description: Scopri come tracciare le operazioni asincrone in Node.js con il modulo async_hooks, che offre un modo per registrare callback per vari eventi asincroni.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Tracciamento del Contesto Asincrono | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come tracciare le operazioni asincrone in Node.js con il modulo async_hooks, che offre un modo per registrare callback per vari eventi asincroni.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Tracciamento del Contesto Asincrono | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come tracciare le operazioni asincrone in Node.js con il modulo async_hooks, che offre un modo per registrare callback per vari eventi asincroni.
---


# Tracciamento del contesto asincrono {#asynchronous-context-tracking}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## Introduzione {#introduction}

Queste classi vengono utilizzate per associare lo stato e propagarlo attraverso callback e catene di promise. Permettono di memorizzare dati per tutta la durata di una richiesta web o di qualsiasi altra durata asincrona. È simile alla memorizzazione locale dei thread in altri linguaggi.

Le classi `AsyncLocalStorage` e `AsyncResource` fanno parte del modulo `node:async_hooks`:

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Classe: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0 | AsyncLocalStorage è ora Stabile. In precedenza, era Sperimentale. |
| v13.10.0, v12.17.0 | Aggiunto in: v13.10.0, v12.17.0 |
:::

Questa classe crea archivi che rimangono coerenti attraverso operazioni asincrone.

Anche se puoi creare la tua implementazione sopra il modulo `node:async_hooks`, `AsyncLocalStorage` dovrebbe essere preferito in quanto è un'implementazione performante e sicura per la memoria che coinvolge ottimizzazioni significative che non sono ovvie da implementare.

L'esempio seguente utilizza `AsyncLocalStorage` per costruire un semplice logger che assegna ID alle richieste HTTP in entrata e li include nei messaggi registrati all'interno di ogni richiesta.

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
    // Immagina qualsiasi catena di operazioni asincrone qui
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
    // Immagina qualsiasi catena di operazioni asincrone qui
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

Ogni istanza di `AsyncLocalStorage` mantiene un contesto di archiviazione indipendente. Più istanze possono esistere simultaneamente in modo sicuro senza il rischio di interferire con i dati l'una dell'altra.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.7.0, v18.16.0 | Rimossa l'opzione sperimentale onPropagate. |
| v19.2.0, v18.13.0 | Aggiunta l'opzione onPropagate. |
| v13.10.0, v12.17.0 | Aggiunta in: v13.10.0, v12.17.0 |
:::

Crea una nuova istanza di `AsyncLocalStorage`. Lo store viene fornito solo all'interno di una chiamata `run()` o dopo una chiamata `enterWith()`.

### Metodo statico: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Aggiunta in: v19.8.0, v18.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da associare al contesto di esecuzione corrente.
- Restituisce: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una nuova funzione che chiama `fn` all'interno del contesto di esecuzione acquisito.

Associa la funzione fornita al contesto di esecuzione corrente.

### Metodo statico: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Aggiunta in: v19.8.0, v18.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- Restituisce: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una nuova funzione con la firma `(fn: (...args) : R, ...args) : R`.

Acquisisce il contesto di esecuzione corrente e restituisce una funzione che accetta una funzione come argomento. Ogni volta che viene chiamata la funzione restituita, chiama la funzione passata al suo interno nel contesto acquisito.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // restituisce 123
```
AsyncLocalStorage.snapshot() può sostituire l'uso di AsyncResource per semplici scopi di tracciamento del contesto asincrono, ad esempio:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // restituisce 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Aggiunto in: v13.10.0, v12.17.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Disabilita l'istanza di `AsyncLocalStorage`. Tutte le chiamate successive a `asyncLocalStorage.getStore()` restituiranno `undefined` fino a quando non viene richiamato di nuovo `asyncLocalStorage.run()` o `asyncLocalStorage.enterWith()`.

Quando si chiama `asyncLocalStorage.disable()`, tutti i contesti correnti collegati all'istanza verranno chiusi.

La chiamata a `asyncLocalStorage.disable()` è richiesta prima che l'`asyncLocalStorage` possa essere sottoposto a garbage collection. Ciò non si applica agli store forniti da `asyncLocalStorage`, poiché questi oggetti vengono sottoposti a garbage collection insieme alle risorse asincrone corrispondenti.

Utilizza questo metodo quando l'`asyncLocalStorage` non è più in uso nel processo corrente.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Aggiunto in: v13.10.0, v12.17.0**

- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Restituisce lo store corrente. Se chiamato al di fuori di un contesto asincrono inizializzato chiamando `asyncLocalStorage.run()` o `asyncLocalStorage.enterWith()`, restituisce `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Aggiunto in: v13.11.0, v12.17.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Esegue la transizione nel contesto per il resto dell'esecuzione sincrona corrente e quindi persiste lo store attraverso qualsiasi chiamata asincrona successiva.

Esempio:

```js [ESM]
const store = { id: 1 };
// Sostituisce lo store precedente con l'oggetto store fornito
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Restituisce l'oggetto store
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Restituisce lo stesso oggetto
});
```
Questa transizione continuerà per l'*intera* esecuzione sincrona. Ciò significa che se, ad esempio, si entra nel contesto all'interno di un gestore di eventi, anche i successivi gestori di eventi verranno eseguiti all'interno di quel contesto a meno che non siano specificamente associati a un altro contesto con un `AsyncResource`. Questo è il motivo per cui `run()` dovrebbe essere preferito a `enterWith()` a meno che non ci siano forti ragioni per utilizzare quest'ultimo metodo.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Restituisce lo stesso oggetto
});

asyncLocalStorage.getStore(); // Restituisce undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Restituisce lo stesso oggetto
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Aggiunto in: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Esegue una funzione in modo sincrono all'interno di un contesto e ne restituisce il valore di ritorno. Lo store non è accessibile al di fuori della funzione di callback. Lo store è accessibile a qualsiasi operazione asincrona creata all'interno della callback.

Gli `args` opzionali vengono passati alla funzione di callback.

Se la funzione di callback genera un errore, l'errore viene generato anche da `run()`. Lo stacktrace non è influenzato da questa chiamata e si esce dal contesto.

Esempio:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Restituisce l'oggetto store
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Restituisce l'oggetto store
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Restituisce undefined
  // L'errore verrà catturato qui
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Aggiunto in: v13.10.0, v12.17.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Esegue una funzione in modo sincrono al di fuori di un contesto e ne restituisce il valore di ritorno. Lo store non è accessibile all'interno della funzione di callback o delle operazioni asincrone create all'interno della callback. Qualsiasi chiamata `getStore()` eseguita all'interno della funzione di callback restituirà sempre `undefined`.

Gli `args` opzionali vengono passati alla funzione di callback.

Se la funzione di callback genera un errore, l'errore viene generato anche da `exit()`. Lo stacktrace non è influenzato da questa chiamata e si rientra nel contesto.

Esempio:

```js [ESM]
// All'interno di una chiamata a run
try {
  asyncLocalStorage.getStore(); // Restituisce l'oggetto o il valore dello store
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Restituisce undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Restituisce lo stesso oggetto o valore
  // L'errore verrà catturato qui
}
```

### Utilizzo con `async/await` {#usage-with-async/await}

Se, all'interno di una funzione asincrona, deve essere eseguita una sola chiamata `await` all'interno di un contesto, è necessario utilizzare il seguente schema:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // Il valore di ritorno di foo sarà atteso
  });
}
```
In questo esempio, lo store è disponibile solo nella funzione di callback e nelle funzioni chiamate da `foo`. Al di fuori di `run`, chiamare `getStore` restituirà `undefined`.

### Risoluzione dei problemi: perdita di contesto {#troubleshooting-context-loss}

Nella maggior parte dei casi, `AsyncLocalStorage` funziona senza problemi. In rare situazioni, lo store corrente viene perso in una delle operazioni asincrone.

Se il codice è basato su callback, è sufficiente promessearlo con [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal) in modo che inizi a funzionare con le promise native.

Se è necessario utilizzare un'API basata su callback o il codice presuppone un'implementazione thenable personalizzata, utilizzare la classe [`AsyncResource`](/it/nodejs/api/async_context#class-asyncresource) per associare l'operazione asincrona al contesto di esecuzione corretto. Individuare la chiamata di funzione responsabile della perdita di contesto registrando il contenuto di `asyncLocalStorage.getStore()` dopo le chiamate che si sospetta siano responsabili della perdita. Quando il codice registra `undefined`, l'ultima callback chiamata è probabilmente responsabile della perdita di contesto.

## Classe: `AsyncResource` {#class-asyncresource}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0 | AsyncResource è ora Stabile. In precedenza era Sperimentale. |
:::

La classe `AsyncResource` è progettata per essere estesa dalle risorse asincrone dell'embedder. Utilizzando questa, gli utenti possono facilmente attivare gli eventi di durata delle proprie risorse.

L'hook `init` verrà attivato quando viene istanziato un `AsyncResource`.

Di seguito è riportata una panoramica dell'API `AsyncResource`.

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() è pensato per essere esteso. L'istanziamento di un
// nuovo AsyncResource() attiva anche init. Se triggerAsyncId viene omesso, allora
// viene utilizzato async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Esegui una funzione nel contesto di esecuzione della risorsa. Questo
// * stabilirà il contesto della risorsa
// * attiverà le callback before di AsyncHooks
// * chiamerà la funzione fornita `fn` con gli argomenti forniti
// * attiverà le callback after di AsyncHooks
// * ripristinerà il contesto di esecuzione originale
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Chiama le callback destroy di AsyncHooks.
asyncResource.emitDestroy();

// Restituisce l'ID univoco assegnato all'istanza AsyncResource.
asyncResource.asyncId();

// Restituisce l'ID trigger per l'istanza AsyncResource.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() è pensato per essere esteso. L'istanziamento di un
// nuovo AsyncResource() attiva anche init. Se triggerAsyncId viene omesso, allora
// viene utilizzato async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Esegui una funzione nel contesto di esecuzione della risorsa. Questo
// * stabilirà il contesto della risorsa
// * attiverà le callback before di AsyncHooks
// * chiamerà la funzione fornita `fn` con gli argomenti forniti
// * attiverà le callback after di AsyncHooks
// * ripristinerà il contesto di esecuzione originale
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Chiama le callback destroy di AsyncHooks.
asyncResource.emitDestroy();

// Restituisce l'ID univoco assegnato all'istanza AsyncResource.
asyncResource.asyncId();

// Restituisce l'ID trigger per l'istanza AsyncResource.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di evento asincrono.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del contesto di esecuzione che ha creato questo evento asincrono. **Predefinito:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, disabilita `emitDestroy` quando l'oggetto viene raccolto dalla garbage collection. Normalmente non è necessario impostarlo (anche se `emitDestroy` viene chiamato manualmente), a meno che l'`asyncId` della risorsa non venga recuperato e l'`emitDestroy` dell'API sensibile venga chiamato con esso. Quando impostato su `false`, la chiamata `emitDestroy` sulla garbage collection avverrà solo se c'è almeno un hook `destroy` attivo. **Predefinito:** `false`.

Esempio di utilizzo:

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
### Metodo statico: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | La proprietà `asyncResource` aggiunta alla funzione vincolata è stata deprecata e verrà rimossa in una versione futura. |
| v17.8.0, v16.15.0 | Modificato il valore predefinito quando `thisArg` è indefinito per utilizzare `this` dal chiamante. |
| v16.0.0 | Aggiunto thisArg opzionale. |
| v14.8.0, v12.19.0 | Aggiunto in: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da associare al contesto di esecuzione corrente.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nome opzionale da associare all'`AsyncResource` sottostante.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Associa la funzione fornita al contesto di esecuzione corrente.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | La proprietà `asyncResource` aggiunta alla funzione associata è stata deprecata e verrà rimossa in una versione futura. |
| v17.8.0, v16.15.0 | Modificato il valore predefinito quando `thisArg` è indefinito per utilizzare `this` dal chiamante. |
| v16.0.0 | Aggiunto thisArg opzionale. |
| v14.8.0, v12.19.0 | Aggiunto in: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da associare all'ambito corrente di `AsyncResource`.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Associa la funzione data per essere eseguita nell'ambito di questo `AsyncResource`.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Aggiunto in: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da chiamare nel contesto di esecuzione di questa risorsa asincrona.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il ricevitore da utilizzare per la chiamata di funzione.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare alla funzione.

Chiama la funzione fornita con gli argomenti forniti nel contesto di esecuzione della risorsa asincrona. Questo stabilirà il contesto, attiverà i callback AsyncHooks before, chiamerà la funzione, attiverà i callback AsyncHooks after e quindi ripristinerà il contesto di esecuzione originale.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Restituisce: [\<AsyncResource\>](/it/nodejs/api/async_hooks#class-asyncresource) Un riferimento ad `asyncResource`.

Chiama tutti gli hook `destroy`. Questo dovrebbe essere chiamato solo una volta. Verrà generato un errore se viene chiamato più di una volta. Questo **deve** essere chiamato manualmente. Se la risorsa viene lasciata raccogliere dal GC, gli hook `destroy` non verranno mai chiamati.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'`asyncId` univoco assegnato alla risorsa.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lo stesso `triggerAsyncId` passato al costruttore `AsyncResource`.

### Utilizzo di `AsyncResource` per un pool di thread `Worker` {#using-asyncresource-for-a-worker-thread-pool}

L'esempio seguente mostra come utilizzare la classe `AsyncResource` per fornire correttamente il tracciamento asincrono per un pool di [`Worker`](/it/nodejs/api/worker_threads#class-worker). Altri pool di risorse, come i pool di connessioni al database, possono seguire un modello simile.

Supponendo che l'attività sia l'aggiunta di due numeri, utilizzando un file denominato `task_processor.js` con il seguente contenuto:

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

Un pool di Worker attorno ad esso potrebbe utilizzare la seguente struttura:

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
    this.emitDestroy();  // `TaskInfo` vengono utilizzate solo una volta.
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

    // Ogni volta che viene emesso l'evento kWorkerFreedEvent, invia
    // la prossima task in sospeso nella coda, se presente.
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
      // In caso di successo: Chiama la callback che è stata passata a `runTask`,
      // rimuovi la `TaskInfo` associata al Worker e contrassegnala di nuovo come libera.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In caso di eccezione non rilevata: Chiama la callback che è stata passata a
      // `runTask` con l'errore.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Rimuovi il worker dalla lista e avvia un nuovo Worker per sostituire quello
      // corrente.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Nessun thread libero, aspetta che un thread worker diventi libero.
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
    this.emitDestroy();  // `TaskInfo` vengono utilizzate solo una volta.
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

    // Ogni volta che viene emesso l'evento kWorkerFreedEvent, invia
    // la prossima task in sospeso nella coda, se presente.
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
      // In caso di successo: Chiama la callback che è stata passata a `runTask`,
      // rimuovi la `TaskInfo` associata al Worker e contrassegnala di nuovo come libera.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In caso di eccezione non rilevata: Chiama la callback che è stata passata a
      // `runTask` con l'errore.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Rimuovi il worker dalla lista e avvia un nuovo Worker per sostituire quello
      // corrente.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Nessun thread libero, aspetta che un thread worker diventi libero.
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

Senza il tracciamento esplicito aggiunto dagli oggetti `WorkerPoolTaskInfo`, sembrerebbe che le callback siano associate ai singoli oggetti `Worker`. Tuttavia, la creazione dei `Worker` non è associata alla creazione delle task e non fornisce informazioni su quando le task sono state pianificate.

Questo pool potrebbe essere utilizzato come segue:

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


### Integrazione di `AsyncResource` con `EventEmitter` {#integrating-asyncresource-with-eventemitter}

I listener di eventi attivati da un [`EventEmitter`](/it/nodejs/api/events#class-eventemitter) potrebbero essere eseguiti in un contesto di esecuzione diverso da quello attivo quando è stato chiamato `eventEmitter.on()`.

L'esempio seguente mostra come utilizzare la classe `AsyncResource` per associare correttamente un listener di eventi al contesto di esecuzione corretto. Lo stesso approccio può essere applicato a un [`Stream`](/it/nodejs/api/stream#stream) o a una classe simile guidata dagli eventi.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Il contesto di esecuzione è legato all'ambito esterno corrente.
  }));
  req.on('close', () => {
    // Il contesto di esecuzione è legato all'ambito che ha causato l'emissione di 'close'.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Il contesto di esecuzione è legato all'ambito esterno corrente.
  }));
  req.on('close', () => {
    // Il contesto di esecuzione è legato all'ambito che ha causato l'emissione di 'close'.
  });
  res.end();
}).listen(3000);
```
:::

