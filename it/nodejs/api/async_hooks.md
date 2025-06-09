---
title: Documentazione Node.js - Ganci Asincroni
description: Esplora l'API dei Ganci Asincroni in Node.js, che offre un modo per tracciare la durata delle risorse asincrone nelle applicazioni Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Ganci Asincroni | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora l'API dei Ganci Asincroni in Node.js, che offre un modo per tracciare la durata delle risorse asincrone nelle applicazioni Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Ganci Asincroni | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora l'API dei Ganci Asincroni in Node.js, che offre un modo per tracciare la durata delle risorse asincrone nelle applicazioni Node.js.
---


# Hook asincroni {#async-hooks}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale. Si prega di migrare da questa API, se possibile. Non raccomandiamo di utilizzare le API [`createHook`](/it/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/it/nodejs/api/async_hooks#class-asynchook) e [`executionAsyncResource`](/it/nodejs/api/async_hooks#async_hooksexecutionasyncresource) in quanto presentano problemi di usabilità, rischi per la sicurezza e implicazioni sulle prestazioni. I casi d'uso di tracciamento del contesto asincrono sono meglio gestiti dall'API stabile [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage). Se hai un caso d'uso per `createHook`, `AsyncHook` o `executionAsyncResource` al di là della necessità di tracciamento del contesto risolta da [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage) o dai dati diagnostici attualmente forniti da [Diagnostics Channel](/it/nodejs/api/diagnostics_channel), apri un problema all'indirizzo [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) descrivendo il tuo caso d'uso in modo che possiamo creare un'API più mirata allo scopo.
:::

**Codice sorgente:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

Sconsigliamo vivamente l'uso dell'API `async_hooks`. Altre API che possono coprire la maggior parte dei suoi casi d'uso includono:

- [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage) traccia il contesto asincrono
- [`process.getActiveResourcesInfo()`](/it/nodejs/api/process#processgetactiveresourcesinfo) traccia le risorse attive

Il modulo `node:async_hooks` fornisce un'API per tracciare le risorse asincrone. È possibile accedervi utilizzando:

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## Terminologia {#terminology}

Una risorsa asincrona rappresenta un oggetto con una callback associata. Questa callback può essere chiamata più volte, come l'evento `'connection'` in `net.createServer()`, o solo una volta come in `fs.open()`. Una risorsa può anche essere chiusa prima che la callback venga chiamata. `AsyncHook` non distingue esplicitamente tra questi diversi casi, ma li rappresenterà come il concetto astratto che è una risorsa.

Se vengono utilizzati [`Worker`](/it/nodejs/api/worker_threads#class-worker), ogni thread ha un'interfaccia `async_hooks` indipendente e ogni thread utilizzerà un nuovo set di ID asincroni.


## Panoramica {#overview}

Di seguito è riportata una semplice panoramica dell'API pubblica.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// Restituisce l'ID del contesto di esecuzione corrente.
const eid = async_hooks.executionAsyncId();

// Restituisce l'ID dell'handle responsabile dell'attivazione della callback
// dell'ambito di esecuzione corrente da chiamare.
const tid = async_hooks.triggerAsyncId();

// Crea una nuova istanza di AsyncHook. Tutte queste callback sono opzionali.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Consente alle callback di questa istanza di AsyncHook di chiamare. Questa non è un'azione implicita
// dopo l'esecuzione del costruttore e deve essere eseguita esplicitamente per iniziare
// l'esecuzione delle callback.
asyncHook.enable();

// Disabilita l'ascolto di nuovi eventi asincroni.
asyncHook.disable();

//
// Le seguenti sono le callback che possono essere passate a createHook().
//

// init() viene chiamato durante la costruzione dell'oggetto. La risorsa potrebbe non aver
// completato la costruzione quando viene eseguita questa callback. Pertanto, tutti i campi della
// risorsa a cui fa riferimento "asyncId" potrebbero non essere stati popolati.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() viene chiamato appena prima della chiamata alla callback della risorsa. Può essere
// chiamato 0-N volte per gli handle (come TCPWrap) e verrà chiamato esattamente 1
// volta per le richieste (come FSReqCallback).
function before(asyncId) { }

// after() viene chiamato subito dopo che la callback della risorsa è terminata.
function after(asyncId) { }

// destroy() viene chiamato quando la risorsa viene distrutta.
function destroy(asyncId) { }

// promiseResolve() viene chiamato solo per le risorse promise, quando la
// funzione resolve() passata al costruttore Promise viene invocata
// (direttamente o tramite altri mezzi per risolvere una promise).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// Restituisce l'ID del contesto di esecuzione corrente.
const eid = async_hooks.executionAsyncId();

// Restituisce l'ID dell'handle responsabile dell'attivazione della callback
// dell'ambito di esecuzione corrente da chiamare.
const tid = async_hooks.triggerAsyncId();

// Crea una nuova istanza di AsyncHook. Tutte queste callback sono opzionali.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Consente alle callback di questa istanza di AsyncHook di chiamare. Questa non è un'azione implicita
// dopo l'esecuzione del costruttore e deve essere eseguita esplicitamente per iniziare
// l'esecuzione delle callback.
asyncHook.enable();

// Disabilita l'ascolto di nuovi eventi asincroni.
asyncHook.disable();

//
// Le seguenti sono le callback che possono essere passate a createHook().
//

// init() viene chiamato durante la costruzione dell'oggetto. La risorsa potrebbe non aver
// completato la costruzione quando viene eseguita questa callback. Pertanto, tutti i campi della
// risorsa a cui fa riferimento "asyncId" potrebbero non essere stati popolati.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() viene chiamato appena prima della chiamata alla callback della risorsa. Può essere
// chiamato 0-N volte per gli handle (come TCPWrap) e verrà chiamato esattamente 1
// volta per le richieste (come FSReqCallback).
function before(asyncId) { }

// after() viene chiamato subito dopo che la callback della risorsa è terminata.
function after(asyncId) { }

// destroy() viene chiamato quando la risorsa viene distrutta.
function destroy(asyncId) { }

// promiseResolve() viene chiamato solo per le risorse promise, quando la
// funzione resolve() passata al costruttore Promise viene invocata
// (direttamente o tramite altri mezzi per risolvere una promise).
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Aggiunto in: v8.1.0**

- `callbacks` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le [Hook Callbacks](/it/nodejs/api/async_hooks#hook-callbacks) da registrare
    - `init` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La [`init` callback](/it/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La [`before` callback](/it/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La [`after` callback](/it/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La [`destroy` callback](/it/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La [`promiseResolve` callback](/it/nodejs/api/async_hooks#promiseresolveasyncid).


- Restituisce: [\<AsyncHook\>](/it/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Istanza utilizzata per disabilitare e abilitare gli hook

Registra le funzioni da chiamare per i diversi eventi del ciclo di vita di ogni operazione async.

Le callback `init()`/`before()`/`after()`/`destroy()` vengono chiamate per il rispettivo evento asincrono durante il ciclo di vita di una risorsa.

Tutte le callback sono opzionali. Ad esempio, se è necessario tracciare solo la pulizia delle risorse, allora è necessario passare solo la callback `destroy`. I dettagli di tutte le funzioni che possono essere passate a `callbacks` si trovano nella sezione [Hook Callbacks](/it/nodejs/api/async_hooks#hook-callbacks).



::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

Le callback verranno ereditate tramite la catena prototipale:

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Poiché le promise sono risorse asincrone il cui ciclo di vita viene tracciato tramite il meccanismo degli hook async, le callback `init()`, `before()`, `after()` e `destroy()` *non devono* essere funzioni async che restituiscono promise.


### Gestione degli errori {#error-handling}

Se un qualsiasi callback di `AsyncHook` genera un'eccezione, l'applicazione stamperà la traccia dello stack e si chiuderà. Il percorso di uscita segue quello di un'eccezione non gestita, ma tutti i listener `'uncaughtException'` vengono rimossi, forzando così il processo a terminare. I callback `'exit'` verranno comunque chiamati a meno che l'applicazione non venga eseguita con `--abort-on-uncaught-exception`, nel qual caso verrà stampata una traccia dello stack e l'applicazione si chiuderà, lasciando un file core.

La ragione di questo comportamento di gestione degli errori è che questi callback vengono eseguiti in punti potenzialmente volatili nel ciclo di vita di un oggetto, ad esempio durante la costruzione e la distruzione della classe. Per questo motivo, si ritiene necessario interrompere rapidamente il processo per evitare un'interruzione involontaria in futuro. Questo è soggetto a modifiche in futuro se viene eseguita un'analisi completa per garantire che un'eccezione possa seguire il normale flusso di controllo senza effetti collaterali involontari.

### Stampa nei callback `AsyncHook` {#printing-in-asynchook-callbacks}

Poiché la stampa sulla console è un'operazione asincrona, `console.log()` farà sì che vengano chiamati i callback `AsyncHook`. L'uso di `console.log()` o operazioni asincrone simili all'interno di una funzione di callback `AsyncHook` causerà una ricorsione infinita. Una soluzione semplice a questo problema durante il debug è utilizzare un'operazione di registrazione sincrona come `fs.writeFileSync(file, msg, flag)`. Questo stamperà sul file e non invocherà `AsyncHook` ricorsivamente perché è sincrono.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Usa una funzione come questa quando esegui il debug all'interno di un callback AsyncHook
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Usa una funzione come questa quando esegui il debug all'interno di un callback AsyncHook
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

Se è necessaria un'operazione asincrona per la registrazione, è possibile tenere traccia di ciò che ha causato l'operazione asincrona utilizzando le informazioni fornite dallo stesso `AsyncHook`. La registrazione dovrebbe quindi essere saltata quando è stata la registrazione stessa a causare la chiamata del callback `AsyncHook`. In questo modo, la ricorsione altrimenti infinita viene interrotta.


## Classe: `AsyncHook` {#class-asynchook}

La classe `AsyncHook` espone un'interfaccia per tracciare gli eventi del ciclo di vita delle operazioni asincrone.

### `asyncHook.enable()` {#asynchookenable}

- Restituisce: [\<AsyncHook\>](/it/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Un riferimento a `asyncHook`.

Abilita i callback per una data istanza di `AsyncHook`. Se non vengono forniti callback, l'abilitazione è un'operazione no-op.

L'istanza `AsyncHook` è disabilitata per impostazione predefinita. Se l'istanza `AsyncHook` deve essere abilitata immediatamente dopo la creazione, è possibile utilizzare il seguente schema.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- Restituisce: [\<AsyncHook\>](/it/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Un riferimento a `asyncHook`.

Disabilita i callback per una data istanza di `AsyncHook` dal pool globale di callback `AsyncHook` da eseguire. Una volta che un hook è stato disabilitato, non verrà più chiamato fino a quando non verrà abilitato.

Per coerenza dell'API, `disable()` restituisce anche l'istanza `AsyncHook`.

### Callback Hook {#hook-callbacks}

Gli eventi chiave nel ciclo di vita degli eventi asincroni sono stati classificati in quattro aree: instanziazione, prima/dopo la chiamata del callback e quando l'istanza viene distrutta.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ID univoco per la risorsa asincrona.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di risorsa asincrona.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID univoco della risorsa asincrona nel cui contesto di esecuzione è stata creata questa risorsa asincrona.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Riferimento alla risorsa che rappresenta l'operazione asincrona, deve essere rilasciata durante la *distruzione*.

Chiamato quando viene costruita una classe che ha la *possibilità* di emettere un evento asincrono. Ciò *non* significa che l'istanza debba chiamare `before`/`after` prima che venga chiamato `destroy`, ma solo che esiste la possibilità.

Questo comportamento può essere osservato facendo qualcosa come aprire una risorsa e quindi chiuderla prima che la risorsa possa essere utilizzata. Il seguente frammento lo dimostra.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

A ogni nuova risorsa viene assegnato un ID univoco nell'ambito dell'istanza corrente di Node.js.


##### `type` {#type}

Il `type` è una stringa che identifica il tipo di risorsa che ha causato la chiamata a `init`. Generalmente, corrisponderà al nome del costruttore della risorsa.

Il `type` delle risorse create da Node.js stesso può cambiare in qualsiasi release di Node.js. I valori validi includono `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` e `Timeout`. Ispeziona il codice sorgente della versione di Node.js utilizzata per ottenere l'elenco completo.

Inoltre, gli utenti di [`AsyncResource`](/it/nodejs/api/async_context#class-asyncresource) creano risorse asincrone indipendenti da Node.js stesso.

Esiste anche il tipo di risorsa `PROMISE`, che viene utilizzato per tracciare le istanze `Promise` e il lavoro asincrono pianificato da esse.

Gli utenti sono in grado di definire il proprio `type` quando utilizzano l'API embedder pubblica.

È possibile avere collisioni di nomi di tipo. Gli embedder sono incoraggiati a utilizzare prefissi univoci, come il nome del pacchetto npm, per prevenire collisioni quando si ascoltano gli hook.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` è l'`asyncId` della risorsa che ha causato (o "attivato") l'inizializzazione della nuova risorsa e che ha causato la chiamata a `init`. Questo è diverso da `async_hooks.executionAsyncId()` che mostra solo *quando* una risorsa è stata creata, mentre `triggerAsyncId` mostra *perché* una risorsa è stata creata.

Di seguito è riportata una semplice dimostrazione di `triggerAsyncId`:

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

Output quando si colpisce il server con `nc localhost 8080`:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
Il `TCPSERVERWRAP` è il server che riceve le connessioni.

Il `TCPWRAP` è la nuova connessione dal client. Quando viene effettuata una nuova connessione, l'istanza `TCPWrap` viene immediatamente costruita. Questo accade al di fuori di qualsiasi stack JavaScript. (Un `executionAsyncId()` di `0` significa che viene eseguito da C++ senza alcuno stack JavaScript sopra di esso.) Con solo queste informazioni, sarebbe impossibile collegare le risorse in termini di ciò che ha causato la loro creazione, quindi a `triggerAsyncId` viene dato il compito di propagare quale risorsa è responsabile dell'esistenza della nuova risorsa.


##### `resource` {#resource}

`resource` è un oggetto che rappresenta la risorsa asincrona effettiva che è stata inizializzata. L'API per accedere all'oggetto può essere specificata dal creatore della risorsa. Le risorse create da Node.js stesso sono interne e possono cambiare in qualsiasi momento. Pertanto, non è specificata alcuna API per queste.

In alcuni casi, l'oggetto risorsa viene riutilizzato per motivi di prestazioni, quindi non è sicuro utilizzarlo come chiave in una `WeakMap` o aggiungervi proprietà.

##### Esempio di contesto asincrono {#asynchronous-context-example}

Il caso d'uso del tracciamento del contesto è coperto dall'API stabile [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage). Questo esempio illustra solo l'operazione degli hook asincroni, ma [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage) si adatta meglio a questo caso d'uso.

Quello che segue è un esempio con ulteriori informazioni sulle chiamate a `init` tra le chiamate `before` e `after`, in particolare come apparirà il callback a `listen()`. La formattazione dell'output è leggermente più elaborata per rendere più facile la visualizzazione del contesto di chiamata.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

Output dall'avvio del solo server:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
Come illustrato nell'esempio, `executionAsyncId()` ed `execution` specificano ciascuno il valore del contesto di esecuzione corrente, che è delimitato dalle chiamate a `before` e `after`.

L'utilizzo di solo `execution` per rappresentare graficamente i risultati dell'allocazione delle risorse si traduce in quanto segue:

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
`TCPSERVERWRAP` non fa parte di questo grafico, anche se è stata la ragione per cui è stato chiamato `console.log()`. Questo perché il binding a una porta senza un nome host è un'operazione *sincrona*, ma per mantenere un'API completamente asincrona, il callback dell'utente viene inserito in un `process.nextTick()`. Questo è il motivo per cui `TickObject` è presente nell'output ed è un "genitore" per il callback `.listen()`.

Il grafico mostra solo *quando* è stata creata una risorsa, non *perché*, quindi per tracciare il *perché* utilizzare `triggerAsyncId`. Che può essere rappresentato con il seguente grafico:

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando un'operazione asincrona viene avviata (come un server TCP che riceve una nuova connessione) o completata (come la scrittura di dati su disco) viene chiamata una callback per notificare l'utente. La callback `before` viene chiamata immediatamente prima che venga eseguita tale callback. `asyncId` è l'identificatore univoco assegnato alla risorsa che sta per eseguire la callback.

La callback `before` verrà chiamata da 0 a N volte. La callback `before` verrà tipicamente chiamata 0 volte se l'operazione asincrona è stata annullata o, ad esempio, se nessun connessione viene ricevuta da un server TCP. Le risorse asincrone persistenti come un server TCP chiameranno tipicamente la callback `before` più volte, mentre altre operazioni come `fs.open()` la chiameranno solo una volta.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chiamata immediatamente dopo il completamento della callback specificata in `before`.

Se si verifica un'eccezione non gestita durante l'esecuzione della callback, allora `after` verrà eseguita *dopo* che viene emesso l'evento `'uncaughtException'` o viene eseguito un gestore di `domain`.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chiamata dopo che la risorsa corrispondente a `asyncId` viene distrutta. Viene anche chiamata in modo asincrono dall'API embedder `emitDestroy()`.

Alcune risorse dipendono dalla garbage collection per la pulizia, quindi se viene fatto un riferimento all'oggetto `resource` passato a `init` è possibile che `destroy` non venga mai chiamata, causando una perdita di memoria nell'applicazione. Se la risorsa non dipende dalla garbage collection, allora questo non sarà un problema.

L'utilizzo dell'hook destroy comporta un sovraccarico aggiuntivo perché abilita il tracciamento delle istanze `Promise` tramite il garbage collector.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Aggiunto in: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chiamato quando viene invocata la funzione `resolve` passata al costruttore `Promise` (direttamente o tramite altri mezzi per risolvere una promise).

`resolve()` non esegue alcun lavoro sincrono osservabile.

La `Promise` non è necessariamente soddisfatta o rifiutata a questo punto se la `Promise` è stata risolta assumendo lo stato di un'altra `Promise`.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
chiama le seguenti callback:

```text [TEXT]
init per PROMISE con id 5, trigger id: 1
  promise resolve 5      # corrisponde a resolve(true)
init per PROMISE con id 6, trigger id: 5  # la Promise restituita da then()
  before 6               # viene inserita la callback then()
  promise resolve 6      # la callback then() risolve la promise restituendo
  after 6
```


### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**Aggiunto in: v13.9.0, v12.17.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) La risorsa che rappresenta l'esecuzione corrente. Utile per memorizzare i dati all'interno della risorsa.

Gli oggetti risorsa restituiti da `executionAsyncResource()` sono molto spesso oggetti handle interni di Node.js con API non documentate. L'utilizzo di qualsiasi funzione o proprietà sull'oggetto potrebbe causare l'arresto anomalo dell'applicazione e dovrebbe essere evitato.

L'utilizzo di `executionAsyncResource()` nel contesto di esecuzione di livello superiore restituirà un oggetto vuoto poiché non ci sono handle o oggetti richiesta da utilizzare, ma avere un oggetto che rappresenta il livello superiore può essere utile.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

Questo può essere utilizzato per implementare l'archiviazione locale di continuazione senza l'uso di una `Map` di tracciamento per memorizzare i metadati:

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Simbolo privato per evitare l'inquinamento

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Simbolo privato per evitare l'inquinamento

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.2.0 | Rinominato da `currentId`. |
| v8.1.0 | Aggiunto in: v8.1.0 |
:::

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'`asyncId` del contesto di esecuzione corrente. Utile per tracciare quando qualcosa chiama.



::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

L'ID restituito da `executionAsyncId()` è correlato ai tempi di esecuzione, non alla causalità (che è coperta da `triggerAsyncId()`):

```js [ESM]
const server = net.createServer((conn) => {
  // Restituisce l'ID del server, non della nuova connessione, perché la
  // callback viene eseguita nell'ambito di esecuzione del MakeCallback() del server.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Restituisce l'ID di un TickObject (process.nextTick()) perché tutte le
  // callback passate a .listen() sono racchiuse in un nextTick().
  async_hooks.executionAsyncId();
});
```
I contesti Promise potrebbero non ottenere `executionAsyncId` precisi per impostazione predefinita. Vedi la sezione sul [tracciamento dell'esecuzione delle promise](/it/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID della risorsa responsabile della chiamata alla callback che è attualmente in esecuzione.

```js [ESM]
const server = net.createServer((conn) => {
  // La risorsa che ha causato (o attivato) la chiamata a questa callback
  // era quella della nuova connessione. Quindi il valore di ritorno di triggerAsyncId()
  // è l'asyncId di "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Anche se tutte le callback passate a .listen() sono racchiuse in un nextTick()
  // la callback stessa esiste perché è stata effettuata la chiamata a .listen() del server.
  // Quindi il valore di ritorno sarebbe l'ID del server.
  async_hooks.triggerAsyncId();
});
```
I contesti Promise potrebbero non ottenere `triggerAsyncId` validi per impostazione predefinita. Vedi la sezione sul [tracciamento dell'esecuzione delle promise](/it/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**Aggiunto in: v17.2.0, v16.14.0**

- Restituisce: Una mappa dei tipi di provider all'ID numerico corrispondente. Questa mappa contiene tutti i tipi di evento che potrebbero essere emessi dall'evento `async_hooks.init()`.

Questa funzionalità sopprime l'utilizzo deprecato di `process.binding('async_wrap').Providers`. Vedi: [DEP0111](/it/nodejs/api/deprecations#dep0111-processbinding)

## Monitoraggio dell'esecuzione delle Promise {#promise-execution-tracking}

Per impostazione predefinita, alle esecuzioni delle promise non vengono assegnati `asyncId` a causa della natura relativamente costosa dell'[API di introspezione delle promise](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) fornita da V8. Ciò significa che i programmi che utilizzano promise o `async`/`await` non otterranno ID di esecuzione e trigger corretti per i contesti di callback delle promise per impostazione predefinita.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

Si osservi che la callback `then()` afferma di essere stata eseguita nel contesto dell'ambito esterno anche se era coinvolto un hop asincrono. Inoltre, il valore `triggerAsyncId` è `0`, il che significa che mancano informazioni sul contesto della risorsa che ha causato (attivato) l'esecuzione della callback `then()`.

L'installazione di hook asincroni tramite `async_hooks.createHook` abilita il tracciamento dell'esecuzione delle promise:

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forza l'abilitazione di PromiseHooks.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forza l'abilitazione di PromiseHooks.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

In questo esempio, l'aggiunta di qualsiasi funzione hook effettiva ha abilitato il tracciamento delle promise. Ci sono due promise nell'esempio sopra; la promise creata da `Promise.resolve()` e la promise restituita dalla chiamata a `then()`. Nell'esempio sopra, la prima promise ha ottenuto l'`asyncId` `6` e la seconda ha ottenuto l'`asyncId` `7`. Durante l'esecuzione della callback `then()`, stiamo eseguendo nel contesto della promise con `asyncId` `7`. Questa promise è stata attivata dalla risorsa asincrona `6`.

Un'altra sottigliezza con le promise è che le callback `before` e `after` vengono eseguite solo su promise concatenate. Ciò significa che le promise non create da `then()`/`catch()` non avranno le callback `before` e `after` attivate su di esse. Per maggiori dettagli, consulta i dettagli dell'API V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit).


## API di incorporamento JavaScript {#javascript-embedder-api}

Gli sviluppatori di librerie che gestiscono le proprie risorse asincrone eseguendo compiti come I/O, connection pooling o gestione delle code di callback possono utilizzare l'API JavaScript `AsyncResource` in modo che vengano richiamati tutti i callback appropriati.

### Classe: `AsyncResource` {#class-asyncresource}

La documentazione per questa classe è stata spostata su [`AsyncResource`](/it/nodejs/api/async_context#class-asyncresource).

## Classe: `AsyncLocalStorage` {#class-asynclocalstorage}

La documentazione per questa classe è stata spostata su [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage).

