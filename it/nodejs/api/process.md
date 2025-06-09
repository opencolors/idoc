---
title: Documentazione dell'API di Processo di Node.js
description: Documentazione dettagliata sul modulo di processo di Node.js, che copre la gestione dei processi, le variabili d'ambiente, i segnali e altro ancora.
head:
  - - meta
    - name: og:title
      content: Documentazione dell'API di Processo di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentazione dettagliata sul modulo di processo di Node.js, che copre la gestione dei processi, le variabili d'ambiente, i segnali e altro ancora.
  - - meta
    - name: twitter:title
      content: Documentazione dell'API di Processo di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentazione dettagliata sul modulo di processo di Node.js, che copre la gestione dei processi, le variabili d'ambiente, i segnali e altro ancora.
---


# Processo {#process}

**Codice Sorgente:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

L'oggetto `process` fornisce informazioni e controllo sul processo Node.js corrente.



::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## Eventi del Processo {#process-events}

L'oggetto `process` è un'istanza di [`EventEmitter`](/it/nodejs/api/events#class-eventemitter).

### Evento: `'beforeExit'` {#event-beforeexit}

**Aggiunto in: v0.11.12**

L'evento `'beforeExit'` viene emesso quando Node.js svuota il suo event loop e non ha ulteriore lavoro da pianificare. Normalmente, il processo Node.js si chiuderà quando non c'è lavoro pianificato, ma un listener registrato sull'evento `'beforeExit'` può effettuare chiamate asincrone, e quindi far sì che il processo Node.js continui.

La funzione di callback del listener viene invocata con il valore di [`process.exitCode`](/it/nodejs/api/process#processexitcode_1) passato come unico argomento.

L'evento `'beforeExit'` *non* viene emesso per le condizioni che causano la terminazione esplicita, come la chiamata a [`process.exit()`](/it/nodejs/api/process#processexitcode) o le eccezioni non gestite.

L'evento `'beforeExit'` *non* deve essere utilizzato come alternativa all'evento `'exit'` a meno che l'intenzione non sia quella di pianificare ulteriore lavoro.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```
:::


### Evento: `'disconnect'` {#event-disconnect}

**Aggiunto in: v0.7.7**

Se il processo Node.js viene generato con un canale IPC (vedi la documentazione di [Child Process](/it/nodejs/api/child_process) e [Cluster](/it/nodejs/api/cluster)), l'evento `'disconnect'` verrà emesso quando il canale IPC viene chiuso.

### Evento: `'exit'` {#event-exit}

**Aggiunto in: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'evento `'exit'` viene emesso quando il processo Node.js sta per terminare a seguito di:

- Il metodo `process.exit()` viene chiamato esplicitamente;
- Il ciclo di eventi Node.js non ha più alcun lavoro aggiuntivo da svolgere.

Non c'è modo di impedire l'uscita dal ciclo di eventi a questo punto, e una volta che tutti i listener di `'exit'` hanno terminato l'esecuzione, il processo Node.js terminerà.

La funzione di callback del listener viene invocata con il codice di uscita specificato dalla proprietà [`process.exitCode`](/it/nodejs/api/process#processexitcode_1), o dall'argomento `exitCode` passato al metodo [`process.exit()`](/it/nodejs/api/process#processexitcode).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

Le funzioni listener **devono** eseguire solo operazioni **sincrone**. Il processo Node.js terminerà immediatamente dopo aver chiamato i listener dell'evento `'exit'`, causando l'abbandono di qualsiasi lavoro aggiuntivo ancora in coda nel ciclo di eventi. Nell'esempio seguente, ad esempio, il timeout non si verificherà mai:

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Evento: `'message'` {#event-message}

**Aggiunto in: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) un oggetto JSON analizzato o un valore primitivo serializzabile.
- `sendHandle` [\<net.Server\>](/it/nodejs/api/net#class-netserver) | [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) un oggetto [`net.Server`](/it/nodejs/api/net#class-netserver) o [`net.Socket`](/it/nodejs/api/net#class-netsocket), o undefined.

Se il processo Node.js viene generato con un canale IPC (vedere la documentazione di [Processo figlio](/it/nodejs/api/child_process) e [Cluster](/it/nodejs/api/cluster)), l'evento `'message'` viene emesso ogni volta che un messaggio inviato da un processo padre utilizzando [`childprocess.send()`](/it/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) viene ricevuto dal processo figlio.

Il messaggio passa attraverso la serializzazione e l'analisi. Il messaggio risultante potrebbe non essere lo stesso di quello inviato originariamente.

Se l'opzione `serialization` è stata impostata su `advanced` quando si genera il processo, l'argomento `message` può contenere dati che JSON non è in grado di rappresentare. Vedere [Serializzazione avanzata per `child_process`](/it/nodejs/api/child_process#advanced-serialization) per maggiori dettagli.

### Evento: `'multipleResolves'` {#event-multipleresolves}

**Aggiunto in: v10.12.0**

**Deprecato a partire da: v17.6.0, v16.15.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di risoluzione. Uno tra `'resolve'` o `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promise che si è risolta o rifiutata più di una volta.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore con cui la promise è stata risolta o rifiutata dopo la risoluzione originale.

L'evento `'multipleResolves'` viene emesso ogni volta che una `Promise` è stata:

- Risolta più di una volta.
- Rifiutata più di una volta.
- Rifiutata dopo la risoluzione.
- Risolta dopo il rifiuto.

Questo è utile per tracciare potenziali errori in un'applicazione durante l'utilizzo del costruttore `Promise`, poiché le risoluzioni multiple vengono silenziate. Tuttavia, l'occorrenza di questo evento non indica necessariamente un errore. Ad esempio, [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) può attivare un evento `'multipleResolves'`.

A causa della inaffidabilità dell'evento in casi come l'esempio di [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) sopra, è stato deprecato.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### Evento: `'rejectionHandled'` {#event-rejectionhandled}

**Aggiunto in: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promise gestita in ritardo.

L'evento `'rejectionHandled'` viene emesso ogni volta che una `Promise` è stata rifiutata ed è stato allegato un gestore di errori (utilizzando [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), ad esempio) più tardi di un turno del ciclo di eventi di Node.js.

L'oggetto `Promise` sarebbe stato precedentemente emesso in un evento `'unhandledRejection'`, ma durante il corso dell'elaborazione ha acquisito un gestore di rifiuto.

Non esiste una nozione di livello superiore per una catena `Promise` in cui i rifiuti possono essere sempre gestiti. Essendo intrinsecamente asincrono in natura, un rifiuto di `Promise` può essere gestito in un momento futuro, possibilmente molto più tardi del turno del ciclo di eventi necessario per l'emissione dell'evento `'unhandledRejection'`.

Un altro modo per dirlo è che, a differenza del codice sincrono in cui esiste un elenco sempre crescente di eccezioni non gestite, con le Promise può esserci un elenco in crescita e contrazione di rifiuti non gestiti.

Nel codice sincrono, l'evento `'uncaughtException'` viene emesso quando l'elenco delle eccezioni non gestite cresce.

Nel codice asincrono, l'evento `'unhandledRejection'` viene emesso quando l'elenco dei rifiuti non gestiti cresce e l'evento `'rejectionHandled'` viene emesso quando l'elenco dei rifiuti non gestiti si riduce.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

In questo esempio, la `Map` `unhandledRejections` crescerà e si ridurrà nel tempo, riflettendo i rifiuti che iniziano non gestiti e poi vengono gestiti. È possibile registrare tali errori in un log degli errori, periodicamente (il che è probabilmente la cosa migliore per le applicazioni a lunga esecuzione) o all'uscita dal processo (il che è probabilmente più conveniente per gli script).


### Evento: `'workerMessage'` {#event-workermessage}

**Aggiunto in: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valore trasmesso utilizzando [`postMessageToThread()`](/it/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del thread worker trasmittente o `0` per il thread principale.

L'evento `'workerMessage'` viene emesso per qualsiasi messaggio in entrata inviato dall'altra parte utilizzando [`postMessageToThread()`](/it/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### Evento: `'uncaughtException'` {#event-uncaughtexception}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0, v10.17.0 | Aggiunto l'argomento `origin`. |
| v0.1.18 | Aggiunto in: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'eccezione non gestita.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indica se l'eccezione proviene da un rifiuto non gestito o da un errore sincrono. Può essere `'uncaughtException'` o `'unhandledRejection'`. Quest'ultimo viene utilizzato quando si verifica un'eccezione in un contesto asincrono basato su `Promise` (o se una `Promise` viene rifiutata) e il flag [`--unhandled-rejections`](/it/nodejs/api/cli#--unhandled-rejectionsmode) è impostato su `strict` o `throw` (che è l'impostazione predefinita) e il rifiuto non viene gestito, oppure quando si verifica un rifiuto durante la fase di caricamento statico del modulo ES del punto di ingresso della riga di comando.

L'evento `'uncaughtException'` viene emesso quando un'eccezione JavaScript non gestita risale fino al ciclo di eventi. Per impostazione predefinita, Node.js gestisce tali eccezioni stampando la traccia dello stack su `stderr` e uscendo con codice 1, sovrascrivendo qualsiasi [`process.exitCode`](/it/nodejs/api/process#processexitcode_1) impostato in precedenza. L'aggiunta di un gestore per l'evento `'uncaughtException'` sovrascrive questo comportamento predefinito. In alternativa, modificare il [`process.exitCode`](/it/nodejs/api/process#processexitcode_1) nel gestore `'uncaughtException'` che comporterà l'uscita del processo con il codice di uscita fornito. Altrimenti, in presenza di tale gestore, il processo uscirà con 0.



::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

È possibile monitorare gli eventi `'uncaughtException'` senza sovrascrivere il comportamento predefinito di uscita dal processo installando un listener `'uncaughtExceptionMonitor'`.


#### Avviso: Usare `'uncaughtException'` correttamente {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` è un meccanismo grossolano per la gestione delle eccezioni inteso per essere utilizzato solo come ultima risorsa. L'evento *non deve* essere usato come equivalente di `On Error Resume Next`. Le eccezioni non gestite significano intrinsecamente che un'applicazione si trova in uno stato indefinito. Tentare di riprendere il codice dell'applicazione senza un corretto ripristino dall'eccezione può causare ulteriori problemi imprevisti e imprevedibili.

Le eccezioni lanciate dall'interno del gestore dell'evento non verranno intercettate. Invece il processo si concluderà con un codice di uscita diverso da zero e verrà stampato lo stack trace. Questo per evitare una ricorsione infinita.

Tentare di riprendere normalmente dopo un'eccezione non intercettata può essere simile a staccare il cavo di alimentazione durante l'aggiornamento di un computer. Nove volte su dieci, non succede nulla. Ma la decima volta, il sistema viene corrotto.

L'uso corretto di `'uncaughtException'` è eseguire la pulizia sincrona delle risorse allocate (ad esempio, descrittori di file, handle, ecc.) prima di arrestare il processo. **Non è sicuro riprendere il normale funzionamento dopo
<code>'uncaughtException'</code>.**

Per riavviare un'applicazione arrestata in modo più affidabile, sia che `'uncaughtException'` venga emesso o meno, un monitor esterno deve essere impiegato in un processo separato per rilevare i guasti dell'applicazione e ripristinare o riavviare secondo necessità.

### Evento: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**Aggiunto in: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'eccezione non intercettata.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indica se l'eccezione ha origine da un rifiuto non gestito o da errori sincroni. Può essere `'uncaughtException'` o `'unhandledRejection'`. Quest'ultimo viene utilizzato quando si verifica un'eccezione in un contesto asincrono basato su `Promise` (o se una `Promise` viene rifiutata) e il flag [`--unhandled-rejections`](/it/nodejs/api/cli#--unhandled-rejectionsmode) è impostato su `strict` o `throw` (che è l'impostazione predefinita) e il rifiuto non viene gestito, oppure quando si verifica un rifiuto durante la fase di caricamento statico del modulo ES del punto di ingresso della riga di comando.

L'evento `'uncaughtExceptionMonitor'` viene emesso prima che venga emesso un evento `'uncaughtException'` o venga chiamato un hook installato tramite [`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

L'installazione di un listener `'uncaughtExceptionMonitor'` non cambia il comportamento una volta emesso un evento `'uncaughtException'`. Il processo si bloccherà ancora se non è installato alcun listener `'uncaughtException'`.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```
:::


### Evento: `'unhandledRejection'` {#event-unhandledrejection}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.0.0 | La mancata gestione dei rejections di `Promise` è deprecata. |
| v6.6.0 | I rejections di `Promise` non gestiti ora emetteranno un warning del processo. |
| v1.4.1 | Aggiunto in: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'oggetto con cui la promise è stata rifiutata (tipicamente un oggetto [`Error`](/it/nodejs/api/errors#class-error)).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promise rifiutata.

L'evento `'unhandledRejection'` viene emesso ogni volta che una `Promise` viene rifiutata e nessun gestore di errori è collegato alla promise entro un ciclo dell'event loop. Quando si programma con le Promise, le eccezioni vengono incapsulate come "promise rifiutate". I rejections possono essere intercettati e gestiti usando [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) e vengono propagati attraverso una catena di `Promise`. L'evento `'unhandledRejection'` è utile per rilevare e tenere traccia delle promise che sono state rifiutate i cui rejections non sono ancora stati gestiti.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Registrazione specifica dell'applicazione, lancio di un errore o altra logica qui
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Nota l'errore di battitura (`pasre`)
}); // Nessun `.catch()` o `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Registrazione specifica dell'applicazione, lancio di un errore o altra logica qui
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Nota l'errore di battitura (`pasre`)
}); // Nessun `.catch()` o `.then()`
```
:::

Anche quanto segue attiverà l'emissione dell'evento `'unhandledRejection'`:

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // Inizialmente imposta lo stato caricato su una promise rifiutata
  this.loaded = Promise.reject(new Error('Risorsa non ancora caricata!'));
}

const resource = new SomeResource();
// nessun .catch o .then su resource.loaded per almeno un ciclo
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // Inizialmente imposta lo stato caricato su una promise rifiutata
  this.loaded = Promise.reject(new Error('Risorsa non ancora caricata!'));
}

const resource = new SomeResource();
// nessun .catch o .then su resource.loaded per almeno un ciclo
```
:::

In questo esempio, è possibile tracciare il rejection come un errore dello sviluppatore, come sarebbe tipicamente il caso per altri eventi `'unhandledRejection'`. Per risolvere tali errori, un gestore [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) non operativo può essere allegato a `resource.loaded`, il che impedirebbe l'emissione dell'evento `'unhandledRejection'`.


### Evento: `'warning'` {#event-warning}

**Aggiunto in: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Le proprietà chiave dell'avviso sono:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome dell'avviso. **Predefinito:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una descrizione dell'avviso fornita dal sistema.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una traccia dello stack che indica la posizione nel codice in cui è stato emesso l'avviso.

L'evento `'warning'` viene emesso ogni volta che Node.js emette un avviso di processo.

Un avviso di processo è simile a un errore in quanto descrive condizioni eccezionali che vengono portate all'attenzione dell'utente. Tuttavia, gli avvisi non fanno parte del normale flusso di gestione degli errori di Node.js e JavaScript. Node.js può emettere avvisi ogni volta che rileva pratiche di codifica errate che potrebbero portare a prestazioni dell'applicazione non ottimali, bug o vulnerabilità di sicurezza.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Stampa il nome dell'avviso
  console.warn(warning.message); // Stampa il messaggio dell'avviso
  console.warn(warning.stack);   // Stampa la traccia dello stack
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Stampa il nome dell'avviso
  console.warn(warning.message); // Stampa il messaggio dell'avviso
  console.warn(warning.stack);   // Stampa la traccia dello stack
});
```
:::

Per impostazione predefinita, Node.js stamperà gli avvisi di processo su `stderr`. L'opzione della riga di comando `--no-warnings` può essere utilizzata per sopprimere l'output predefinito della console, ma l'evento `'warning'` verrà comunque emesso dall'oggetto `process`. Attualmente, non è possibile sopprimere tipi di avviso specifici diversi dagli avvisi di deprecazione. Per sopprimere gli avvisi di deprecazione, consulta il flag [`--no-deprecation`](/it/nodejs/api/cli#--no-deprecation).

L'esempio seguente illustra l'avviso che viene stampato su `stderr` quando sono stati aggiunti troppi listener a un evento:

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
Al contrario, l'esempio seguente disattiva l'output di avviso predefinito e aggiunge un gestore personalizzato all'evento `'warning'`:

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
L'opzione della riga di comando `--trace-warnings` può essere utilizzata per fare in modo che l'output della console predefinito per gli avvisi includa la traccia dello stack completa dell'avviso.

Avviare Node.js utilizzando il flag della riga di comando `--throw-deprecation` farà sì che gli avvisi di deprecazione personalizzati vengano generati come eccezioni.

L'utilizzo del flag della riga di comando `--trace-deprecation` farà sì che la deprecazione personalizzata venga stampata su `stderr` insieme alla traccia dello stack.

L'utilizzo del flag della riga di comando `--no-deprecation` sopprimerà tutti i report della deprecazione personalizzata.

I flag della riga di comando `*-deprecation` influiscono solo sugli avvisi che utilizzano il nome `'DeprecationWarning'`.


#### Emissione di avvisi personalizzati {#emitting-custom-warnings}

Vedi il metodo [`process.emitWarning()`](/it/nodejs/api/process#processemitwarningwarning-type-code-ctor) per l'emissione di avvisi personalizzati o specifici dell'applicazione.

#### Nomi di avvisi di Node.js {#nodejs-warning-names}

Non ci sono linee guida rigide per i tipi di avviso (come identificati dalla proprietà `name`) emessi da Node.js. Nuovi tipi di avvisi possono essere aggiunti in qualsiasi momento. Alcuni dei tipi di avviso più comuni includono:

- `'DeprecationWarning'` - Indica l'uso di un'API o funzionalità di Node.js deprecata. Tali avvisi devono includere una proprietà `'code'` che identifica il [codice di deprecazione](/it/nodejs/api/deprecations).
- `'ExperimentalWarning'` - Indica l'uso di un'API o funzionalità sperimentale di Node.js. Tali funzionalità devono essere utilizzate con cautela poiché potrebbero cambiare in qualsiasi momento e non sono soggette alle stesse rigorose politiche di versioning semantico e supporto a lungo termine delle funzionalità supportate.
- `'MaxListenersExceededWarning'` - Indica che sono stati registrati troppi listener per un determinato evento su un `EventEmitter` o `EventTarget`. Questo è spesso un'indicazione di una perdita di memoria.
- `'TimeoutOverflowWarning'` - Indica che è stato fornito un valore numerico che non può rientrare in un intero con segno a 32 bit alle funzioni `setTimeout()` o `setInterval()`.
- `'TimeoutNegativeWarning'` - Indica che è stato fornito un numero negativo alle funzioni `setTimeout()` o `setInterval()`.
- `'TimeoutNaNWarning'` - Indica che è stato fornito un valore che non è un numero alle funzioni `setTimeout()` o `setInterval()`.
- `'UnsupportedWarning'` - Indica l'uso di un'opzione o funzionalità non supportata che verrà ignorata anziché trattata come un errore. Un esempio è l'uso del messaggio di stato della risposta HTTP quando si utilizza l'API di compatibilità HTTP/2.

### Evento: `'worker'` {#event-worker}

**Aggiunto in: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/it/nodejs/api/worker_threads#class-worker) Il [\<Worker\>](/it/nodejs/api/worker_threads#class-worker) che è stato creato.

L'evento `'worker'` viene emesso dopo che è stato creato un nuovo thread [\<Worker\>](/it/nodejs/api/worker_threads#class-worker).


### Eventi di Segnale {#signal-events}

Gli eventi di segnale verranno emessi quando il processo Node.js riceve un segnale. Si prega di fare riferimento a [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) per un elenco di nomi di segnali POSIX standard come `'SIGINT'`, `'SIGHUP'`, ecc.

I segnali non sono disponibili nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).

Il gestore del segnale riceverà il nome del segnale (`'SIGINT'`, `'SIGTERM'`, ecc.) come primo argomento.

Il nome di ogni evento sarà il nome comune in maiuscolo per il segnale (ad es. `'SIGINT'` per i segnali `SIGINT`).



::: code-group
```js [ESM]
import process from 'node:process';

// Inizia a leggere da stdin in modo che il processo non termini.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Ricevuto SIGINT. Premi Control-D per uscire.');
});

// Utilizzo di una singola funzione per gestire più segnali
function handle(signal) {
  console.log(`Ricevuto ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// Inizia a leggere da stdin in modo che il processo non termini.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Ricevuto SIGINT. Premi Control-D per uscire.');
});

// Utilizzo di una singola funzione per gestire più segnali
function handle(signal) {
  console.log(`Ricevuto ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` è riservato da Node.js per avviare il [debugger](/it/nodejs/api/debugger). È possibile installare un listener, ma farlo potrebbe interferire con il debugger.
- `'SIGTERM'` e `'SIGINT'` hanno gestori predefiniti su piattaforme non Windows che reimpostano la modalità terminale prima di uscire con il codice `128 + numero del segnale`. Se uno di questi segnali ha un listener installato, il suo comportamento predefinito verrà rimosso (Node.js non uscirà più).
- `'SIGPIPE'` viene ignorato per impostazione predefinita. Può avere un listener installato.
- `'SIGHUP'` viene generato su Windows quando la finestra della console viene chiusa e su altre piattaforme in varie condizioni simili. Vedere [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). Può avere un listener installato, tuttavia Node.js verrà terminato incondizionatamente da Windows circa 10 secondi dopo. Sulle piattaforme non Windows, il comportamento predefinito di `SIGHUP` è quello di terminare Node.js, ma una volta installato un listener, il suo comportamento predefinito verrà rimosso.
- `'SIGTERM'` non è supportato su Windows, ma può essere ascoltato.
- `'SIGINT'` dal terminale è supportato su tutte le piattaforme e di solito può essere generato con + (anche se questo potrebbe essere configurabile). Non viene generato quando la [modalità raw del terminale](/it/nodejs/api/tty#readstreamsetrawmodemode) è abilitata e viene utilizzato +.
- `'SIGBREAK'` viene inviato su Windows quando viene premuto + . Sulle piattaforme non Windows, può essere ascoltato, ma non c'è modo di inviarlo o generarlo.
- `'SIGWINCH'` viene inviato quando la console è stata ridimensionata. Su Windows, questo accadrà solo durante la scrittura sulla console quando il cursore viene spostato o quando viene utilizzato un tty leggibile in modalità raw.
- `'SIGKILL'` non può avere un listener installato, terminerà incondizionatamente Node.js su tutte le piattaforme.
- `'SIGSTOP'` non può avere un listener installato.
- `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` e `'SIGILL'`, quando non sollevati artificialmente utilizzando [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2), lasciano intrinsecamente il processo in uno stato dal quale non è sicuro chiamare i listener JS. Farlo potrebbe far smettere di rispondere al processo.
- `0` può essere inviato per verificare l'esistenza di un processo, non ha alcun effetto se il processo esiste, ma genererà un errore se il processo non esiste.

Windows non supporta i segnali, quindi non ha equivalenti alla terminazione tramite segnale, ma Node.js offre una certa emulazione con [`process.kill()`](/it/nodejs/api/process#processkillpid-signal) e [`subprocess.kill()`](/it/nodejs/api/child_process#subprocesskillsignal):

- L'invio di `SIGINT`, `SIGTERM` e `SIGKILL` causerà la terminazione incondizionata del processo di destinazione e, successivamente, il sottoprocesso segnalerà che il processo è stato terminato dal segnale.
- L'invio del segnale `0` può essere utilizzato come un modo indipendente dalla piattaforma per verificare l'esistenza di un processo.


## `process.abort()` {#processabort}

**Aggiunto in: v0.7.0**

Il metodo `process.abort()` fa sì che il processo Node.js termini immediatamente e generi un file core.

Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Aggiunto in: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

La proprietà `process.allowedNodeEnvironmentFlags` è uno speciale `Set` di flag, di sola lettura, ammissibili all'interno della variabile d'ambiente [`NODE_OPTIONS`](/it/nodejs/api/cli#node_optionsoptions).

`process.allowedNodeEnvironmentFlags` estende `Set`, ma sovrascrive `Set.prototype.has` per riconoscere diverse possibili rappresentazioni dei flag. `process.allowedNodeEnvironmentFlags.has()` restituirà `true` nei seguenti casi:

- I flag possono omettere i trattini singoli (`-`) o doppi (`--`) iniziali; ad esempio, `inspect-brk` per `--inspect-brk`, o `r` per `-r`.
- I flag passati a V8 (come elencato in `--v8-options`) possono sostituire uno o più trattini *non iniziali* con un carattere di sottolineatura, o viceversa; ad esempio, `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof`, ecc.
- I flag possono contenere uno o più caratteri di uguale (`=`); tutti i caratteri dopo e incluso il primo uguale verranno ignorati; ad esempio, `--stack-trace-limit=100`.
- I flag *devono* essere ammissibili all'interno di [`NODE_OPTIONS`](/it/nodejs/api/cli#node_optionsoptions).

Quando si itera su `process.allowedNodeEnvironmentFlags`, i flag appariranno solo *una volta*; ognuno inizierà con uno o più trattini. I flag passati a V8 conterranno caratteri di sottolineatura al posto dei trattini non iniziali:

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

I metodi `add()`, `clear()` e `delete()` di `process.allowedNodeEnvironmentFlags` non fanno nulla e falliranno silenziosamente.

Se Node.js è stato compilato *senza* il supporto [`NODE_OPTIONS`](/it/nodejs/api/cli#node_optionsoptions) (mostrato in [`process.config`](/it/nodejs/api/process#processconfig)), `process.allowedNodeEnvironmentFlags` conterrà ciò che *sarebbe stato* ammissibile.


## `process.arch` {#processarch}

**Aggiunto in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'architettura della CPU del sistema operativo per la quale è stato compilato il binario di Node.js. I valori possibili sono: `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` e `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`L'architettura di questo processore è ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`L'architettura di questo processore è ${arch}`);
```
:::

## `process.argv` {#processargv}

**Aggiunto in: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.argv` restituisce un array contenente gli argomenti della riga di comando passati all'avvio del processo Node.js. Il primo elemento sarà [`process.execPath`](/it/nodejs/api/process#processexecpath). Vedere `process.argv0` se è necessario l'accesso al valore originale di `argv[0]`. Il secondo elemento sarà il percorso del file JavaScript in esecuzione. Gli elementi rimanenti saranno eventuali argomenti aggiuntivi della riga di comando.

Ad esempio, supponendo il seguente script per `process-args.js`:

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Avviando il processo Node.js come:

```bash [BASH]
node process-args.js one two=three four
```
Genererebbe l'output:

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Aggiunto in: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.argv0` memorizza una copia di sola lettura del valore originale di `argv[0]` passato all'avvio di Node.js.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | L'oggetto non espone più accidentalmente i binding nativi C++. |
| v7.1.0 | Aggiunto in: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se il processo Node.js è stato generato con un canale IPC (vedi la documentazione di [Processo Figlio](/it/nodejs/api/child_process)), la proprietà `process.channel` è un riferimento al canale IPC. Se non esiste alcun canale IPC, questa proprietà è `undefined`.

### `process.channel.ref()` {#processchannelref}

**Aggiunto in: v7.1.0**

Questo metodo fa sì che il canale IPC mantenga in esecuzione il ciclo di eventi del processo se `.unref()` è stato chiamato in precedenza.

Tipicamente, questo viene gestito attraverso il numero di listener di `'disconnect'` e `'message'` sull'oggetto `process`. Tuttavia, questo metodo può essere utilizzato per richiedere esplicitamente un comportamento specifico.

### `process.channel.unref()` {#processchannelunref}

**Aggiunto in: v7.1.0**

Questo metodo fa sì che il canale IPC non mantenga in esecuzione il ciclo di eventi del processo e gli permette di terminare anche mentre il canale è aperto.

Tipicamente, questo viene gestito attraverso il numero di listener di `'disconnect'` e `'message'` sull'oggetto `process`. Tuttavia, questo metodo può essere utilizzato per richiedere esplicitamente un comportamento specifico.

## `process.chdir(directory)` {#processchdirdirectory}

**Aggiunto in: v0.1.17**

- `directory` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `process.chdir()` cambia la directory di lavoro corrente del processo Node.js o genera un'eccezione se l'operazione fallisce (ad esempio, se la `directory` specificata non esiste).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Directory di partenza: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Nuova directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Directory di partenza: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Nuova directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).


## `process.config` {#processconfig}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | L'oggetto `process.config` ora è bloccato. |
| v16.0.0 | La modifica di process.config è stata deprecata. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `process.config` restituisce un `Oggetto` bloccato contenente la rappresentazione JavaScript delle opzioni di configurazione utilizzate per compilare l'eseguibile Node.js corrente. Questo è lo stesso del file `config.gypi` prodotto durante l'esecuzione dello script `./configure`.

Un esempio del possibile output è simile a:

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**Aggiunto in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se il processo Node.js viene generato con un canale IPC (vedi la documentazione [Child Process](/it/nodejs/api/child_process) e [Cluster](/it/nodejs/api/cluster)), la proprietà `process.connected` restituirà `true` fintanto che il canale IPC è connesso e restituirà `false` dopo che viene chiamato `process.disconnect()`.

Una volta che `process.connected` è `false`, non è più possibile inviare messaggi tramite il canale IPC utilizzando `process.send()`.

## `process.constrainedMemory()` {#processconstrainedmemory}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | Valore di ritorno allineato con `uv_get_constrained_memory`. |
| v19.6.0, v18.15.0 | Aggiunto in: v19.6.0, v18.15.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ottiene la quantità di memoria disponibile per il processo (in byte) in base ai limiti imposti dal sistema operativo. Se non esiste tale vincolo, o il vincolo è sconosciuto, viene restituito `0`.

Vedi [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) per maggiori informazioni.


## `process.availableMemory()` {#processavailablememory}

**Aggiunto in: v22.0.0, v20.13.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ottiene la quantità di memoria libera ancora disponibile per il processo (in byte).

Vedere [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory) per maggiori informazioni.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Aggiunto in: v6.1.0**

- `previousValue` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un valore di ritorno precedente dalla chiamata a `process.cpuUsage()`
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Il metodo `process.cpuUsage()` restituisce l'utilizzo di tempo della CPU utente e di sistema del processo corrente, in un oggetto con le proprietà `user` e `system`, i cui valori sono valori in microsecondi (milionesimi di secondo). Questi valori misurano il tempo trascorso nel codice utente e di sistema, rispettivamente, e potrebbero finire per essere superiori al tempo trascorso effettivo se più core della CPU stanno eseguendo il lavoro per questo processo.

Il risultato di una chiamata precedente a `process.cpuUsage()` può essere passato come argomento alla funzione, per ottenere una lettura differenziale.



::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// manda la CPU in spin per 500 millisecondi
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// manda la CPU in spin per 500 millisecondi
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Aggiunto in: v0.1.8**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `process.cwd()` restituisce la directory di lavoro corrente del processo Node.js.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Directory corrente: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Directory corrente: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Aggiunto in: v0.7.2**

- [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La porta utilizzata dal debugger di Node.js quando è abilitato.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Aggiunto in: v0.7.2**

Se il processo Node.js viene generato con un canale IPC (vedere la documentazione su [Child Process](/it/nodejs/api/child_process) e [Cluster](/it/nodejs/api/cluster)), il metodo `process.disconnect()` chiuderà il canale IPC al processo padre, consentendo al processo figlio di uscire normalmente una volta che non ci sono altre connessioni che lo mantengono attivo.

L'effetto della chiamata a `process.disconnect()` è lo stesso della chiamata a [`ChildProcess.disconnect()`](/it/nodejs/api/child_process#subprocessdisconnect) dal processo padre.

Se il processo Node.js non è stato generato con un canale IPC, `process.disconnect()` sarà `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Aggiunto il supporto per l'argomento `flags`. |
| v0.1.16 | Aggiunto in: v0.1.16 |
:::

- `module` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/it/nodejs/api/os#dlopen-constants) **Predefinito:** `os.constants.dlopen.RTLD_LAZY`

Il metodo `process.dlopen()` consente di caricare dinamicamente oggetti condivisi. Viene utilizzato principalmente da `require()` per caricare Addon C++ e non deve essere utilizzato direttamente, tranne in casi speciali. In altre parole, [`require()`](/it/nodejs/api/globals#require) dovrebbe essere preferito a `process.dlopen()` a meno che non ci siano motivi specifici come flag dlopen personalizzati o caricamento da moduli ES.

L'argomento `flags` è un numero intero che consente di specificare il comportamento dlopen. Vedere la documentazione di [`os.constants.dlopen`](/it/nodejs/api/os#dlopen-constants) per i dettagli.

Un requisito importante quando si chiama `process.dlopen()` è che deve essere passata l'istanza `module`. Le funzioni esportate dall'Addon C++ sono quindi accessibili tramite `module.exports`.

L'esempio seguente mostra come caricare un Addon C++, denominato `local.node`, che esporta una funzione `foo`. Tutti i simboli vengono caricati prima che la chiamata ritorni, passando la costante `RTLD_NOW`. In questo esempio si presume che la costante sia disponibile.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**Aggiunto in: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'avviso da emettere.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `warning` è una `String`, `type` è il nome da utilizzare per il *tipo* di avviso emesso. **Predefinito:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un identificatore univoco per l'istanza di avviso emessa.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Quando `warning` è una `String`, `ctor` è una funzione opzionale utilizzata per limitare la traccia dello stack generata. **Predefinito:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Testo aggiuntivo da includere con l'errore.

Il metodo `process.emitWarning()` può essere utilizzato per emettere avvisi di processo personalizzati o specifici dell'applicazione. Questi possono essere ascoltati aggiungendo un gestore all'evento [`'warning'`](/it/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emetti un avviso con un codice e dettagli aggiuntivi.
emitWarning('È successo qualcosa!', {
  code: 'MY_WARNING',
  detail: 'Queste sono alcune informazioni aggiuntive',
});
// Emette:
// (node:56338) [MY_WARNING] Warning: È successo qualcosa!
// Queste sono alcune informazioni aggiuntive
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emetti un avviso con un codice e dettagli aggiuntivi.
emitWarning('È successo qualcosa!', {
  code: 'MY_WARNING',
  detail: 'Queste sono alcune informazioni aggiuntive',
});
// Emette:
// (node:56338) [MY_WARNING] Warning: È successo qualcosa!
// Queste sono alcune informazioni aggiuntive
```
:::

In questo esempio, un oggetto `Error` viene generato internamente da `process.emitWarning()` e passato al gestore [`'warning'`](/it/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'È successo qualcosa!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Traccia dello stack
  console.warn(warning.detail);  // 'Queste sono alcune informazioni aggiuntive'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'È successo qualcosa!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Traccia dello stack
  console.warn(warning.detail);  // 'Queste sono alcune informazioni aggiuntive'
});
```
:::

Se `warning` viene passato come un oggetto `Error`, l'argomento `options` viene ignorato.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Aggiunto in: v6.0.0**

- `warning` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'avviso da emettere.
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `warning` è una `String`, `type` è il nome da utilizzare per il *tipo* di avviso che viene emesso. **Predefinito:** `'Warning'`.
- `code` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un identificatore univoco per l'istanza dell'avviso che viene emessa.
- `ctor` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Quando `warning` è una `String`, `ctor` è una funzione opzionale utilizzata per limitare la traccia dello stack generata. **Predefinito:** `process.emitWarning`.

Il metodo `process.emitWarning()` può essere utilizzato per emettere avvisi di processo personalizzati o specifici dell'applicazione. Questi possono essere ascoltati aggiungendo un gestore all'evento [`'warning'`](/it/nodejs/api/process#event-warning).



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emetti un avviso utilizzando una stringa.
emitWarning('Qualcosa è successo!');
// Emette: (node: 56338) Warning: Qualcosa è successo!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emetti un avviso utilizzando una stringa.
emitWarning('Qualcosa è successo!');
// Emette: (node: 56338) Warning: Qualcosa è successo!
```
:::



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emetti un avviso utilizzando una stringa e un tipo.
emitWarning('Qualcosa è successo!', 'CustomWarning');
// Emette: (node:56338) CustomWarning: Qualcosa è successo!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emetti un avviso utilizzando una stringa e un tipo.
emitWarning('Qualcosa è successo!', 'CustomWarning');
// Emette: (node:56338) CustomWarning: Qualcosa è successo!
```
:::



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Qualcosa è successo!', 'CustomWarning', 'WARN001');
// Emette: (node:56338) [WARN001] CustomWarning: Qualcosa è successo!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Qualcosa è successo!', 'CustomWarning', 'WARN001');
// Emette: (node:56338) [WARN001] CustomWarning: Qualcosa è successo!
```
:::

In ciascuno degli esempi precedenti, un oggetto `Error` viene generato internamente da `process.emitWarning()` e passato al gestore [`'warning'`](/it/nodejs/api/process#event-warning).



::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

Se `warning` viene passato come un oggetto `Error`, verrà passato al gestore dell'evento `'warning'` senza modifiche (e gli argomenti opzionali `type`, `code` e `ctor` verranno ignorati):



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emetti un avviso utilizzando un oggetto Error.
const myWarning = new Error('Qualcosa è successo!');
// Usa la proprietà name di Error per specificare il nome del tipo
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emette: (node:56338) [WARN001] CustomWarning: Qualcosa è successo!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emetti un avviso utilizzando un oggetto Error.
const myWarning = new Error('Qualcosa è successo!');
// Usa la proprietà name di Error per specificare il nome del tipo
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emette: (node:56338) [WARN001] CustomWarning: Qualcosa è successo!
```
:::

Viene generato un `TypeError` se `warning` è qualcosa di diverso da una stringa o un oggetto `Error`.

Sebbene gli avvisi di processo utilizzino oggetti `Error`, il meccanismo di avviso di processo **non** sostituisce i normali meccanismi di gestione degli errori.

La seguente gestione aggiuntiva viene implementata se il `type` di avviso è `'DeprecationWarning'`:

- Se viene utilizzata la flag da riga di comando `--throw-deprecation`, l'avviso di deprecazione viene generato come un'eccezione anziché essere emesso come un evento.
- Se viene utilizzata la flag da riga di comando `--no-deprecation`, l'avviso di deprecazione viene soppresso.
- Se viene utilizzata la flag da riga di comando `--trace-deprecation`, l'avviso di deprecazione viene stampato su `stderr` insieme alla traccia dello stack completa.


### Evitare avvisi duplicati {#avoiding-duplicate-warnings}

Come buona pratica, gli avvisi dovrebbero essere emessi solo una volta per processo. Per fare ciò, posiziona `emitWarning()` dietro un booleano.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.14.0 | I thread worker ora useranno una copia di `process.env` del thread padre per impostazione predefinita, configurabile tramite l'opzione `env` del costruttore `Worker`. |
| v10.0.0 | La conversione implicita del valore della variabile in stringa è deprecata. |
| v0.1.27 | Aggiunto in: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `process.env` restituisce un oggetto contenente l'ambiente utente. Vedi [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

Un esempio di questo oggetto è simile a:

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
È possibile modificare questo oggetto, ma tali modifiche non si rifletteranno al di fuori del processo Node.js, né (a meno che non sia esplicitamente richiesto) su altri thread [`Worker`](/it/nodejs/api/worker_threads#class-worker). In altre parole, il seguente esempio non funzionerebbe:

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
Mentre il seguente lo farà:

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

L'assegnazione di una proprietà su `process.env` convertirà implicitamente il valore in una stringa. **Questo comportamento è deprecato.** Le versioni future di Node.js potrebbero generare un errore quando il valore non è una stringa, un numero o un booleano.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

Usa `delete` per eliminare una proprietà da `process.env`.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

Sui sistemi operativi Windows, le variabili d'ambiente non fanno distinzione tra maiuscole e minuscole.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

A meno che non sia specificato esplicitamente durante la creazione di un'istanza [`Worker`](/it/nodejs/api/worker_threads#class-worker), ogni thread [`Worker`](/it/nodejs/api/worker_threads#class-worker) ha una propria copia di `process.env`, basata su `process.env` del thread padre o su qualunque cosa sia stata specificata come opzione `env` per il costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker). Le modifiche a `process.env` non saranno visibili tra i thread [`Worker`](/it/nodejs/api/worker_threads#class-worker) e solo il thread principale può apportare modifiche visibili al sistema operativo o ai componenti aggiuntivi nativi. Su Windows, una copia di `process.env` su un'istanza [`Worker`](/it/nodejs/api/worker_threads#class-worker) opera in modo da distinguere tra maiuscole e minuscole, a differenza del thread principale.


## `process.execArgv` {#processexecargv}

**Aggiunto in: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.execArgv` restituisce l'insieme delle opzioni della riga di comando specifiche di Node.js passate all'avvio del processo Node.js. Queste opzioni non compaiono nell'array restituito dalla proprietà [`process.argv`](/it/nodejs/api/process#processargv) e non includono l'eseguibile Node.js, il nome dello script o qualsiasi opzione successiva al nome dello script. Queste opzioni sono utili per generare processi figlio con lo stesso ambiente di esecuzione del genitore.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
Risultati in `process.execArgv`:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
E `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
Fare riferimento al costruttore [`Worker`](/it/nodejs/api/worker_threads#new-workerfilename-options) per il comportamento dettagliato dei thread worker con questa proprietà.

## `process.execPath` {#processexecpath}

**Aggiunto in: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.execPath` restituisce il percorso assoluto dell'eseguibile che ha avviato il processo Node.js. Eventuali collegamenti simbolici vengono risolti.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [Cronologia]
| Versione | Cambiamenti |
| --- | --- |
| v20.0.0 | Accetta solo un codice di tipo number, o di tipo string se rappresenta un numero intero. |
| v0.1.13 | Aggiunto in: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il codice di uscita. Per il tipo string, sono consentite solo stringhe intere (es., '1'). **Predefinito:** `0`.

Il metodo `process.exit()` indica a Node.js di terminare il processo in modo sincrono con uno stato di uscita `code`. Se `code` viene omesso, exit utilizza il codice 'success' `0` o il valore di `process.exitCode` se è stato impostato. Node.js non si interromperà finché non saranno stati chiamati tutti i listener dell'evento [`'exit'`](/it/nodejs/api/process#event-exit).

Per uscire con un codice di 'fallimento':



::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

La shell che ha eseguito Node.js dovrebbe vedere il codice di uscita come `1`.

Chiamare `process.exit()` forzerà il processo a uscire il più rapidamente possibile anche se sono ancora in sospeso operazioni asincrone che non sono ancora state completate del tutto, incluse le operazioni I/O su `process.stdout` e `process.stderr`.

Nella maggior parte delle situazioni, non è effettivamente necessario chiamare `process.exit()` esplicitamente. Il processo Node.js uscirà da solo *se non c'è ulteriore lavoro in sospeso* nel ciclo di eventi. La proprietà `process.exitCode` può essere impostata per indicare al processo quale codice di uscita utilizzare quando il processo si chiude normalmente.

Ad esempio, il seguente esempio illustra un *uso improprio* del metodo `process.exit()` che potrebbe portare a dati stampati su stdout troncati e persi:



::: code-group
```js [ESM]
import { exit } from 'node:process';

// Questo è un esempio di cosa *non* fare:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// Questo è un esempio di cosa *non* fare:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

La ragione per cui questo è problematico è che le scritture su `process.stdout` in Node.js sono a volte *asincrone* e possono verificarsi su più tick del ciclo di eventi Node.js. Chiamare `process.exit()`, tuttavia, forza il processo a uscire *prima* che possano essere eseguite quelle ulteriori scritture su `stdout`.

Invece di chiamare `process.exit()` direttamente, il codice *dovrebbe* impostare il `process.exitCode` e consentire al processo di uscire naturalmente evitando di programmare ulteriore lavoro per il ciclo di eventi:



::: code-group
```js [ESM]
import process from 'node:process';

// Come impostare correttamente il codice di uscita lasciando
// che il processo esca normalmente.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// Come impostare correttamente il codice di uscita lasciando
// che il processo esca normalmente.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

Se è necessario terminare il processo Node.js a causa di una condizione di errore, lanciare un errore *non intercettato* e consentire al processo di terminare di conseguenza è più sicuro che chiamare `process.exit()`.

Nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), questa funzione arresta il thread corrente anziché il processo corrente.


## `process.exitCode` {#processexitcode_1}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Accetta solo un codice di tipo numero o di tipo stringa se rappresenta un numero intero. |
| v0.11.8 | Aggiunto in: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il codice di uscita. Per il tipo stringa, sono consentite solo stringhe intere (ad esempio, '1'). **Predefinito:** `undefined`.

Un numero che sarà il codice di uscita del processo, quando il processo termina normalmente o viene terminato tramite [`process.exit()`](/it/nodejs/api/process#processexitcode) senza specificare un codice.

Specificare un codice a [`process.exit(code)`](/it/nodejs/api/process#processexitcode) sovrascriverà qualsiasi impostazione precedente di `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**Aggiunto in: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js sta memorizzando nella cache i moduli integrati.

## `process.features.debug` {#processfeaturesdebug}

**Aggiunto in: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js è una build di debug.

## `process.features.inspector` {#processfeaturesinspector}

**Aggiunto in: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include l'inspector.

## `process.features.ipv6` {#processfeaturesipv6}

**Aggiunto in: v0.5.3**

**Deprecato a partire da: v23.4.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Questa proprietà è sempre true e qualsiasi controllo basato su di essa è ridondante.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include il supporto per IPv6.

Poiché tutte le build di Node.js hanno il supporto IPv6, questo valore è sempre `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**Aggiunto in: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js supporta [il caricamento di moduli ECMAScript tramite `require()`](/it/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**Aggiunto in: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include il supporto per TLS.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Aggiunto in: v4.8.0**

**Deprecato a partire da: v23.4.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare invece `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include il supporto per ALPN in TLS.

Nelle versioni 11.0.0 e successive di Node.js, le dipendenze di OpenSSL offrono il supporto ALPN incondizionato. Questo valore è quindi identico a quello di `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Aggiunto in: v0.11.13**

**Deprecato a partire da: v23.4.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare invece `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include il supporto per OCSP in TLS.

Nelle versioni 11.0.0 e successive di Node.js, le dipendenze di OpenSSL offrono il supporto OCSP incondizionato. Questo valore è quindi identico a quello di `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**Aggiunto in: v0.5.3**

**Deprecato a partire da: v23.4.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare invece `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include il supporto per SNI in TLS.

Nelle versioni 11.0.0 e successive di Node.js, le dipendenze di OpenSSL offrono il supporto SNI incondizionato. Questo valore è quindi identico a quello di `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un valore che è `"strip"` se Node.js viene eseguito con `--experimental-strip-types`, `"transform"` se Node.js viene eseguito con `--experimental-transform-types` e `false` altrimenti.

## `process.features.uv` {#processfeaturesuv}

**Aggiunto in: v0.5.3**

**Deprecato dal: v23.4.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Questa proprietà è sempre true e qualsiasi controllo basato su di essa è ridondante.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valore booleano che è `true` se la build corrente di Node.js include il supporto per libuv.

Poiché non è possibile compilare Node.js senza libuv, questo valore è sempre `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il riferimento alla risorsa che viene tracciata.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback da chiamare quando la risorsa viene finalizzata.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il riferimento alla risorsa che viene tracciata.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'evento che ha attivato la finalizzazione. Il valore predefinito è 'exit'.



Questa funzione registra una callback da chiamare quando il processo emette l'evento `exit` se l'oggetto `ref` non è stato sottoposto a garbage collection. Se l'oggetto `ref` è stato sottoposto a garbage collection prima che venga emesso l'evento `exit`, la callback verrà rimossa dal registro di finalizzazione e non verrà chiamata all'uscita del processo.

All'interno della callback puoi rilasciare le risorse allocate dall'oggetto `ref`. Tieni presente che tutte le limitazioni applicate all'evento `beforeExit` si applicano anche alla funzione `callback`, il che significa che esiste la possibilità che la callback non venga chiamata in circostanze speciali.

L'idea di questa funzione è quella di aiutarti a liberare risorse quando il processo inizia a uscire, ma anche di consentire all'oggetto di essere sottoposto a garbage collection se non viene più utilizzato.

Ad esempio: puoi registrare un oggetto che contiene un buffer, vuoi assicurarti che il buffer venga rilasciato quando il processo esce, ma se l'oggetto viene sottoposto a garbage collection prima che il processo esca, non è più necessario rilasciare il buffer, quindi in questo caso rimuoviamo semplicemente la callback dal registro di finalizzazione.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Assicurati che la funzione passata a finalization.register()
// non crei una closure attorno a oggetti non necessari.
function onFinalize(obj, event) {
  // Puoi fare quello che vuoi con l'oggetto
  obj.dispose();
}

function setup() {
  // Questo oggetto può essere tranquillamente sottoposto a garbage collection,
  // e la funzione di arresto risultante non verrà chiamata.
  // Non ci sono perdite.
  const myDisposableObject = {
    dispose() {
      // Libera le tue risorse in modo sincrono
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Assicurati che la funzione passata a finalization.register()
// non crei una closure attorno a oggetti non necessari.
function onFinalize(obj, event) {
  // Puoi fare quello che vuoi con l'oggetto
  obj.dispose();
}

function setup() {
  // Questo oggetto può essere tranquillamente sottoposto a garbage collection,
  // e la funzione di arresto risultante non verrà chiamata.
  // Non ci sono perdite.
  const myDisposableObject = {
    dispose() {
      // Libera le tue risorse in modo sincrono
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

Il codice sopra si basa sulle seguenti ipotesi:

- le arrow function sono evitate
- le funzioni regolari sono raccomandate all'interno del contesto globale (radice)

Le funzioni regolari *potrebbero* fare riferimento al contesto in cui vive `obj`, rendendo `obj` non sottoponibile a garbage collection.

Le arrow function manterranno il contesto precedente. Considera, ad esempio:

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Anche qualcosa del genere è fortemente sconsigliato
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
È molto improbabile (non impossibile) che questo oggetto venga sottoposto a garbage collection, ma se non lo è, `dispose` verrà chiamato quando viene chiamato `process.exit`.

Fai attenzione ed evita di fare affidamento su questa funzionalità per lo smaltimento di risorse critiche, poiché non è garantito che la callback venga chiamata in tutte le circostanze.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il riferimento alla risorsa che viene tracciata.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback da chiamare quando la risorsa viene finalizzata.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il riferimento alla risorsa che viene tracciata.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'evento che ha attivato la finalizzazione. Il valore predefinito è 'beforeExit'.

Questa funzione si comporta esattamente come `register`, tranne per il fatto che la callback verrà chiamata quando il processo emette l'evento `beforeExit` se l'oggetto `ref` non è stato raccolto dal garbage collector.

Tenere presente che tutte le limitazioni applicate all'evento `beforeExit` vengono applicate anche alla funzione `callback`, il che significa che esiste la possibilità che la callback non venga chiamata in circostanze speciali.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il riferimento alla risorsa che è stata registrata in precedenza.

Questa funzione rimuove la registrazione dell'oggetto dal registro di finalizzazione, quindi la callback non verrà più chiamata.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Do something

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  // Please make sure that the function passed to finalization.register()
  // does not create a closure around unnecessary objects.
  function onFinalize(obj, event) {
    // You can do whatever you want with the object
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Do something

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Aggiunto in: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stability: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `process.getActiveResourcesInfo()` restituisce un array di stringhe contenente i tipi di risorse attive che stanno attualmente mantenendo attivo il ciclo degli eventi.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Prima:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Dopo:', getActiveResourcesInfo());
// Stampa:
//   Prima: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Dopo: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Prima:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Dopo:', getActiveResourcesInfo());
// Stampa:
//   Prima: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Dopo: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Aggiunto in: v22.3.0, v20.16.0**

- `id` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ID del modulo incorporato richiesto.
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` fornisce un modo per caricare i moduli incorporati in una funzione disponibile globalmente. I moduli ES che devono supportare altri ambienti possono usarlo per caricare condizionalmente un modulo incorporato di Node.js quando viene eseguito in Node.js, senza dover gestire l'errore di risoluzione che può essere generato da `import` in un ambiente non-Node.js o dover usare `import()` dinamico che trasforma il modulo in un modulo asincrono oppure trasforma un'API sincrona in una asincrona.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Esegui in Node.js, usa il modulo fs di Node.js.
  const fs = globalThis.process.getBuiltinModule('fs');
  // Se `require()` è necessario per caricare i moduli utente, usa createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
Se `id` specifica un modulo incorporato disponibile nel processo Node.js corrente, il metodo `process.getBuiltinModule(id)` restituisce il modulo incorporato corrispondente. Se `id` non corrisponde a nessun modulo incorporato, viene restituito `undefined`.

`process.getBuiltinModule(id)` accetta ID di moduli incorporati riconosciuti da [`module.isBuiltin(id)`](/it/nodejs/api/module#moduleisbuiltinmodulename). Alcuni moduli incorporati devono essere caricati con il prefisso `node:`, vedi [moduli incorporati con prefisso `node:` obbligatorio](/it/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). I riferimenti restituiti da `process.getBuiltinModule(id)` puntano sempre al modulo incorporato corrispondente a `id` anche se gli utenti modificano [`require.cache`](/it/nodejs/api/modules#requirecache) in modo che `require(id)` restituisca qualcos'altro.


## `process.getegid()` {#processgetegid}

**Aggiunto in: v2.0.0**

Il metodo `process.getegid()` restituisce l'identità numerica del gruppo effettivo del processo Node.js. (Vedi [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero, non Windows o Android).

## `process.geteuid()` {#processgeteuid}

**Aggiunto in: v2.0.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Il metodo `process.geteuid()` restituisce l'identità numerica dell'utente effettivo del processo. (Vedi [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero, non Windows o Android).

## `process.getgid()` {#processgetgid}

**Aggiunto in: v0.1.31**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Il metodo `process.getgid()` restituisce l'identità numerica del gruppo del processo. (Vedi [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero, non Windows o Android).

## `process.getgroups()` {#processgetgroups}

**Aggiunto in: v0.9.4**

- Restituisce: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `process.getgroups()` restituisce un array con gli ID di gruppo supplementari. POSIX lascia non specificato se l'ID del gruppo effettivo è incluso, ma Node.js assicura che lo sia sempre.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero, non Windows o Android).


## `process.getuid()` {#processgetuid}

**Aggiunto in: v0.1.28**

- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `process.getuid()` restituisce l'identità numerica dell'utente del processo. (Vedi [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`UID attuale: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`UID attuale: ${process.getuid()}`);
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero, non Windows o Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Aggiunto in: v9.3.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica se è stata impostata una callback utilizzando [`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

## `process.hrtime([time])` {#processhrtimetime}

**Aggiunto in: v0.7.6**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy. Invece, usa [`process.hrtime.bigint()`](/it/nodejs/api/process#processhrtimebigint).
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il risultato di una precedente chiamata a `process.hrtime()`
- Restituisce: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa è la versione legacy di [`process.hrtime.bigint()`](/it/nodejs/api/process#processhrtimebigint) prima che `bigint` fosse introdotto in JavaScript.

Il metodo `process.hrtime()` restituisce l'attuale tempo reale ad alta risoluzione in una `Array` di tuple `[secondi, nanosecondi]`, dove `nanosecondi` è la parte rimanente del tempo reale che non può essere rappresentata in precisione di secondi.

`time` è un parametro opzionale che deve essere il risultato di una precedente chiamata a `process.hrtime()` per differenziarlo con l'ora corrente. Se il parametro passato non è una `Array` di tuple, verrà generato un `TypeError`. Passare un array definito dall'utente invece del risultato di una precedente chiamata a `process.hrtime()` porterà a un comportamento indefinito.

Questi tempi sono relativi a un tempo arbitrario nel passato e non sono correlati all'ora del giorno e quindi non sono soggetti alla deriva dell'orologio. L'uso principale è per misurare le prestazioni tra gli intervalli:

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Il benchmark ha impiegato ${diff[0] * NS_PER_SEC + diff[1]} nanosecondi`);
  // Il benchmark ha impiegato 1000000552 nanosecondi
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Il benchmark ha impiegato ${diff[0] * NS_PER_SEC + diff[1]} nanosecondi`);
  // Il benchmark ha impiegato 1000000552 nanosecondi
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Aggiunto in: v10.7.0**

- Restituisce: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La versione `bigint` del metodo [`process.hrtime()`](/it/nodejs/api/process#processhrtimetime) che restituisce l'attuale tempo reale ad alta risoluzione in nanosecondi come `bigint`.

A differenza di [`process.hrtime()`](/it/nodejs/api/process#processhrtimetime), non supporta un argomento `time` aggiuntivo poiché la differenza può essere calcolata direttamente sottraendo i due `bigint`.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Aggiunto in: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il nome utente o l'identificatore numerico.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nome di gruppo o un identificatore numerico.

Il metodo `process.initgroups()` legge il file `/etc/group` e inizializza la lista di accesso al gruppo, utilizzando tutti i gruppi di cui l'utente è membro. Questa è un'operazione privilegiata che richiede che il processo Node.js abbia accesso `root` o la capability `CAP_SETGID`.

Prestare attenzione quando si rilasciano i privilegi:

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (cioè non Windows o Android). Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Aggiunto in: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ID di processo
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il segnale da inviare, come stringa o numero. **Predefinito:** `'SIGTERM'`.

Il metodo `process.kill()` invia il `signal` al processo identificato da `pid`.

I nomi dei segnali sono stringhe come `'SIGINT'` o `'SIGHUP'`. Vedere [Eventi di Segnale](/it/nodejs/api/process#signal-events) e [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) per maggiori informazioni.

Questo metodo genererà un errore se il `pid` di destinazione non esiste. Come caso speciale, è possibile utilizzare un segnale di `0` per verificare l'esistenza di un processo. Le piattaforme Windows genereranno un errore se il `pid` viene utilizzato per terminare un gruppo di processi.

Anche se il nome di questa funzione è `process.kill()`, in realtà è solo un mittente di segnali, come la chiamata di sistema `kill`. Il segnale inviato può fare qualcosa di diverso dall'uccidere il processo di destinazione.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Ricevuto segnale SIGHUP.');
});

setTimeout(() => {
  console.log('Uscita.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Ricevuto segnale SIGHUP.');
});

setTimeout(() => {
  console.log('Uscita.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Quando `SIGUSR1` viene ricevuto da un processo Node.js, Node.js avvierà il debugger. Vedere [Eventi di Segnale](/it/nodejs/api/process#signal-events).

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Aggiunto in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **Predefinito:** `'./.env'`

Carica il file `.env` in `process.env`. L'utilizzo di `NODE_OPTIONS` nel file `.env` non avrà alcun effetto su Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Aggiunto in: v0.1.17**

**Deprecato da: v14.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`require.main`](/it/nodejs/api/modules#accessing-the-main-module).
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `process.mainModule` fornisce un modo alternativo per recuperare [`require.main`](/it/nodejs/api/modules#accessing-the-main-module). La differenza è che se il modulo principale cambia in fase di runtime, [`require.main`](/it/nodejs/api/modules#accessing-the-main-module) potrebbe ancora fare riferimento al modulo principale originale nei moduli che sono stati richiesti prima che si verificasse la modifica. Generalmente, è sicuro presumere che i due facciano riferimento allo stesso modulo.

Come con [`require.main`](/it/nodejs/api/modules#accessing-the-main-module), `process.mainModule` sarà `undefined` se non è presente alcuno script di ingresso.

## `process.memoryUsage()` {#processmemoryusage}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.9.0, v12.17.0 | Aggiunto `arrayBuffers` all'oggetto restituito. |
| v7.2.0 | Aggiunto `external` all'oggetto restituito. |
| v0.1.16 | Aggiunto in: v0.1.16 |
:::

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Restituisce un oggetto che descrive l'utilizzo della memoria del processo Node.js misurato in byte.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` e `heapUsed` si riferiscono all'utilizzo della memoria di V8.
- `external` si riferisce all'utilizzo della memoria degli oggetti C++ collegati agli oggetti JavaScript gestiti da V8.
- `rss`, Resident Set Size, è la quantità di spazio occupato nella memoria principale (ovvero un sottoinsieme della memoria totale allocata) per il processo, inclusi tutti gli oggetti e il codice C++ e JavaScript.
- `arrayBuffers` si riferisce alla memoria allocata per `ArrayBuffer` e `SharedArrayBuffer`, inclusi tutti i [`Buffer`](/it/nodejs/api/buffer) di Node.js. Questo è incluso anche nel valore `external`. Quando Node.js viene utilizzato come libreria incorporata, questo valore può essere `0` perché le allocazioni per `ArrayBuffer` potrebbero non essere tracciate in quel caso.

Quando si utilizzano i thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), `rss` sarà un valore valido per l'intero processo, mentre gli altri campi si riferiranno solo al thread corrente.

Il metodo `process.memoryUsage()` itera su ogni pagina per raccogliere informazioni sull'utilizzo della memoria, il che potrebbe essere lento a seconda delle allocazioni di memoria del programma.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Aggiunto in: v15.6.0, v14.18.0**

- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `process.memoryUsage.rss()` restituisce un numero intero che rappresenta la Resident Set Size (RSS) in byte.

La Resident Set Size, è la quantità di spazio occupata nella memoria principale (che è un sottoinsieme della memoria totale allocata) per il processo, inclusi tutti gli oggetti e il codice C++ e JavaScript.

Questo è lo stesso valore della proprietà `rss` fornita da `process.memoryUsage()` ma `process.memoryUsage.rss()` è più veloce.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [Storia]
| Versione | Modifiche |
|---|---|
| v22.7.0, v20.18.0 | Stabilità modificata in Legacy. |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v1.8.1 | Sono ora supportati argomenti aggiuntivi dopo `callback`. |
| v0.1.26 | Aggiunto in: v0.1.26 |
:::

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Usa [`queueMicrotask()`](/it/nodejs/api/globals#queuemicrotaskcallback) invece.
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti aggiuntivi da passare quando si invoca `callback`

`process.nextTick()` aggiunge `callback` alla "coda del next tick". Questa coda viene completamente svuotata dopo che l'operazione corrente sullo stack JavaScript è stata eseguita completamente e prima che il ciclo di eventi possa continuare. È possibile creare un ciclo infinito se si chiamasse ricorsivamente `process.nextTick()`. Vedi la guida [Ciclo di eventi](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) per maggiori informazioni.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

Questo è importante quando si sviluppano API al fine di dare agli utenti l'opportunità di assegnare gestori di eventi *dopo* che un oggetto è stato costruito ma prima che si sia verificato qualsiasi I/O:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() viene chiamato ora, non prima.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() viene chiamato ora, non prima.
```
:::

È molto importante che le API siano o 100% sincrone o 100% asincrone. Considera questo esempio:

```js [ESM]
// ATTENZIONE! NON USARE! PERICOLO CATTIVO NON SICURO!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
Questa API è pericolosa perché nel seguente caso:

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
Non è chiaro se `foo()` o `bar()` verrà chiamato per primo.

Il seguente approccio è molto meglio:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### Quando usare `queueMicrotask()` vs. `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

L'API [`queueMicrotask()`](/it/nodejs/api/globals#queuemicrotaskcallback) è un'alternativa a `process.nextTick()` che differisce anche l'esecuzione di una funzione utilizzando la stessa coda di microtask utilizzata per eseguire i gestori then, catch e finally delle promesse risolte. All'interno di Node.js, ogni volta che la "coda del prossimo tick" viene svuotata, la coda di microtask viene svuotata immediatamente dopo.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

Per *la maggior parte* dei casi d'uso userland, l'API `queueMicrotask()` fornisce un meccanismo portatile e affidabile per differire l'esecuzione che funziona su più ambienti di piattaforme JavaScript e dovrebbe essere preferito a `process.nextTick()`. In scenari semplici, `queueMicrotask()` può essere un sostituto diretto di `process.nextTick()`.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
Una differenza degna di nota tra le due API è che `process.nextTick()` consente di specificare valori aggiuntivi che verranno passati come argomenti alla funzione differita quando viene chiamata. Ottenere lo stesso risultato con `queueMicrotask()` richiede l'uso di una closure o di una funzione associata:

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
Ci sono piccole differenze nel modo in cui vengono gestiti gli errori sollevati all'interno della coda del prossimo tick e della coda di microtask. Gli errori generati all'interno di un callback di microtask in coda devono essere gestiti all'interno del callback in coda quando possibile. In caso contrario, l'event handler `process.on('uncaughtException')` può essere utilizzato per acquisire e gestire gli errori.

In caso di dubbio, a meno che non siano necessarie le capacità specifiche di `process.nextTick()`, utilizzare `queueMicrotask()`.


## `process.noDeprecation` {#processnodeprecation}

**Aggiunto in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `process.noDeprecation` indica se il flag `--no-deprecation` è impostato nel processo Node.js corrente. Vedere la documentazione per l'[evento `'warning'` ](/it/nodejs/api/process#event-warning) e il [metodo `emitWarning()` ](/it/nodejs/api/process#processemitwarningwarning-type-code-ctor) per ulteriori informazioni sul comportamento di questo flag.

## `process.permission` {#processpermission}

**Aggiunto in: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questa API è disponibile tramite il flag [`--permission`](/it/nodejs/api/cli#--permission).

`process.permission` è un oggetto i cui metodi vengono utilizzati per gestire le autorizzazioni per il processo corrente. Ulteriori informazioni sono disponibili nel [Modello di autorizzazioni](/it/nodejs/api/permissions#permission-model).

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Aggiunto in: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica che il processo sia in grado di accedere all'ambito e al riferimento specificati. Se non viene fornito alcun riferimento, si presume un ambito globale, ad esempio, `process.permission.has('fs.read')` verificherà se il processo ha TUTTE le autorizzazioni di lettura del file system.

Il riferimento ha un significato basato sull'ambito fornito. Ad esempio, il riferimento quando l'ambito è File System significa file e cartelle.

Gli ambiti disponibili sono:

- `fs` - Tutto il file system
- `fs.read` - Operazioni di lettura del file system
- `fs.write` - Operazioni di scrittura del file system
- `child` - Operazioni di generazione di processi figlio
- `worker` - Operazione di generazione di thread worker

```js [ESM]
// Verifica se il processo ha l'autorizzazione per leggere il file README
process.permission.has('fs.read', './README.md');
// Verifica se il processo ha operazioni di autorizzazione di lettura
process.permission.has('fs.read');
```


## `process.pid` {#processpid}

**Aggiunto in: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `process.pid` restituisce il PID del processo.



::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`Questo processo è pid ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`Questo processo è pid ${pid}`);
```
:::

## `process.platform` {#processplatform}

**Aggiunto in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.platform` restituisce una stringa che identifica la piattaforma del sistema operativo per cui il binario di Node.js è stato compilato.

I valori attualmente possibili sono:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`



::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`Questa piattaforma è ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`Questa piattaforma è ${platform}`);
```
:::

Il valore `'android'` può anche essere restituito se Node.js è costruito sul sistema operativo Android. Tuttavia, il supporto di Android in Node.js [è sperimentale](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**Aggiunto in: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `process.ppid` restituisce il PID del processo padre del processo corrente.



::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`Il processo padre è pid ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`Il processo padre è pid ${ppid}`);
```
:::

## `process.release` {#processrelease}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v4.2.0 | La proprietà `lts` è ora supportata. |
| v3.0.0 | Aggiunto in: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `process.release` restituisce un `Object` contenente metadati relativi alla release corrente, inclusi gli URL per l'archivio tar della sorgente e l'archivio tar dei soli header.

`process.release` contiene le seguenti proprietà:

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un valore che sarà sempre `'node'`.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) un URL assoluto che punta a un file *<code>.tar.gz</code>* contenente il codice sorgente della release corrente.
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) un URL assoluto che punta a un file *<code>.tar.gz</code>* contenente solo i file di header sorgente per la release corrente. Questo file è significativamente più piccolo del file sorgente completo e può essere utilizzato per la compilazione di componenti aggiuntivi nativi di Node.js.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) un URL assoluto che punta a un file *<code>node.lib</code>* corrispondente all'architettura e alla versione della release corrente. Questo file viene utilizzato per la compilazione di componenti aggiuntivi nativi di Node.js. *Questa proprietà è presente solo nelle build di Windows di Node.js e sarà assente su tutte le altre piattaforme.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) un'etichetta stringa che identifica l'etichetta [LTS](https://github.com/nodejs/Release) per questa release. Questa proprietà esiste solo per le release LTS ed è `undefined` per tutti gli altri tipi di release, incluse le release *Correnti*. I valori validi includono i nomi in codice della release LTS (inclusi quelli che non sono più supportati).
    - `'Fermium'` per la linea LTS 14.x a partire dalla 14.15.0.
    - `'Gallium'` per la linea LTS 16.x a partire dalla 16.13.0.
    - `'Hydrogen'` per la linea LTS 18.x a partire dalla 18.12.0. Per altri nomi in codice della release LTS, vedi [Archivio dei changelog di Node.js](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)
  
 

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
Nelle build personalizzate da versioni non di release dell'albero dei sorgenti, potrebbe essere presente solo la proprietà `name`. Non ci si dovrebbe fare affidamento sull'esistenza delle proprietà aggiuntive.


## `process.report` {#processreport}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` è un oggetto i cui metodi vengono utilizzati per generare report diagnostici per il processo corrente. Ulteriore documentazione è disponibile nella [documentazione sui report](/it/nodejs/api/report).

### `process.report.compact` {#processreportcompact}

**Aggiunto in: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Scrive i report in un formato compatto, JSON a riga singola, più facilmente utilizzabile dai sistemi di elaborazione dei log rispetto al formato predefinito multilinea progettato per il consumo umano.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`I report sono compatti? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`I report sono compatti? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.12.0 | Aggiunto in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Directory in cui viene scritto il report. Il valore predefinito è la stringa vuota, che indica che i report vengono scritti nella directory di lavoro corrente del processo Node.js.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`La directory dei report è ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`La directory dei report è ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.12.0 | Aggiunto in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Nome file in cui viene scritto il report. Se impostato sulla stringa vuota, il nome del file di output sarà composto da un timestamp, PID e numero di sequenza. Il valore predefinito è la stringa vuota.

Se il valore di `process.report.filename` è impostato su `'stdout'` o `'stderr'`, il report viene scritto rispettivamente su stdout o stderr del processo.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Il nome del file di report è ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Il nome del file di report è ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un errore personalizzato utilizzato per segnalare lo stack JavaScript.
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce una rappresentazione JavaScript Object di un report diagnostico per il processo in esecuzione. La traccia dello stack JavaScript del report viene prelevata da `err`, se presente.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Simile a process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Simile a process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

Ulteriore documentazione è disponibile nella [documentazione del report](/it/nodejs/api/report).

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0, v14.17.0 | Questa API non è più sperimentale. |
| v11.12.0 | Aggiunto in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, viene generato un report diagnostico su errori irreversibili, come errori di memoria insufficiente o asserzioni C++ non riuscite.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.12.0 | Aggiunta in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, viene generato un rapporto diagnostico quando il processo riceve il segnale specificato da `process.report.signal`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report sul segnale: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report sul segnale: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.12.0 | Aggiunta in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, viene generato un rapporto diagnostico su un'eccezione non gestita.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report sull'eccezione: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report sull'eccezione: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**Aggiunta in: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, viene generato un rapporto diagnostico senza le variabili d'ambiente.

### `process.report.signal` {#processreportsignal}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.12.0 | Aggiunta in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il segnale utilizzato per attivare la creazione di un rapporto diagnostico. Il valore predefinito è `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Segnale del report: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Segnale del report: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa API non è più sperimentale. |
| v11.8.0 | Aggiunta in: v11.8.0 |
:::

-  `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del file in cui viene scritto il report. Questo dovrebbe essere un percorso relativo, che verrà aggiunto alla directory specificata in `process.report.directory`, o alla directory di lavoro corrente del processo Node.js, se non specificato.
-  `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un errore personalizzato utilizzato per la segnalazione dello stack JavaScript.
-  Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Restituisce il nome file del report generato.

Scrive un report diagnostico in un file. Se `filename` non viene fornito, il nome file predefinito include la data, l'ora, il PID e un numero di sequenza. La traccia dello stack JavaScript del report viene presa da `err`, se presente.

Se il valore di `filename` è impostato su `'stdout'` o `'stderr'`, il report viene scritto rispettivamente sullo stdout o sullo stderr del processo.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

Ulteriore documentazione è disponibile nella [documentazione del report](/it/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**Aggiunto in: v12.6.0**

- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) l'utilizzo delle risorse per il processo corrente. Tutti questi valori provengono dalla chiamata `uv_getrusage` che restituisce una [`uv_rusage_t struct`](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t).
    - `userCPUTime` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_utime` calcolato in microsecondi. È lo stesso valore di [`process.cpuUsage().user`](/it/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_stime` calcolato in microsecondi. È lo stesso valore di [`process.cpuUsage().system`](/it/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_maxrss` che è la dimensione massima del set residente utilizzata in kilobyte.
    - `sharedMemorySize` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_ixrss` ma non è supportato da alcuna piattaforma.
    - `unsharedDataSize` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_idrss` ma non è supportato da alcuna piattaforma.
    - `unsharedStackSize` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_isrss` ma non è supportato da alcuna piattaforma.
    - `minorPageFault` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_minflt` che è il numero di errori di pagina minori per il processo, vedere [questo articolo per maggiori dettagli](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_majflt` che è il numero di errori di pagina maggiori per il processo, vedere [questo articolo per maggiori dettagli](https://en.wikipedia.org/wiki/Page_fault#Major). Questo campo non è supportato su Windows.
    - `swappedOut` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_nswap` ma non è supportato da alcuna piattaforma.
    - `fsRead` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_inblock` che è il numero di volte in cui il file system ha dovuto eseguire l'input.
    - `fsWrite` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_oublock` che è il numero di volte in cui il file system ha dovuto eseguire l'output.
    - `ipcSent` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_msgsnd` ma non è supportato da alcuna piattaforma.
    - `ipcReceived` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_msgrcv` ma non è supportato da alcuna piattaforma.
    - `signalsCount` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_nsignals` ma non è supportato da alcuna piattaforma.
    - `voluntaryContextSwitches` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_nvcsw` che è il numero di volte in cui un cambio di contesto della CPU è risultato dal fatto che un processo ha volontariamente rinunciato al processore prima che la sua porzione di tempo fosse completata (di solito per attendere la disponibilità di una risorsa). Questo campo non è supportato su Windows.
    - `involuntaryContextSwitches` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mappa a `ru_nivcsw` che è il numero di volte in cui un cambio di contesto della CPU è risultato dal fatto che un processo con priorità più alta è diventato eseguibile o perché il processo corrente ha superato la sua porzione di tempo. Questo campo non è supportato su Windows.
  
 

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::


## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Aggiunto in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/it/nodejs/api/net#class-netserver) | [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) utilizzato per parametrizzare l'invio di determinati tipi di handle. `options` supporta le seguenti proprietà:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un valore che può essere utilizzato quando si passano istanze di `net.Socket`. Quando `true`, il socket viene mantenuto aperto nel processo di invio. **Predefinito:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se Node.js viene generato con un canale IPC, il metodo `process.send()` può essere utilizzato per inviare messaggi al processo padre. I messaggi verranno ricevuti come evento [`'message'`](/it/nodejs/api/child_process#event-message) sull'oggetto [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess) del padre.

Se Node.js non è stato generato con un canale IPC, `process.send` sarà `undefined`.

Il messaggio passa attraverso la serializzazione e l'analisi. Il messaggio risultante potrebbe non essere lo stesso di quello inviato originariamente.

## `process.setegid(id)` {#processsetegidid}

**Aggiunto in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nome o ID di gruppo

Il metodo `process.setegid()` imposta l'identità di gruppo efficace del processo. (Vedi [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) L'`id` può essere passato come ID numerico o come stringa del nome del gruppo. Se viene specificato un nome di gruppo, questo metodo si blocca durante la risoluzione dell'ID numerico associato.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero, non Windows o Android). Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).


## `process.seteuid(id)` {#processseteuidid}

**Aggiunto in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nome utente o un ID

Il metodo `process.seteuid()` imposta l'identità utente effettiva del processo. (Vedi [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) L'`id` può essere passato come ID numerico o come stringa del nome utente. Se viene specificato un nome utente, il metodo si blocca durante la risoluzione dell'ID numerico associato.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero non Windows o Android). Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).

## `process.setgid(id)` {#processsetgidid}

**Aggiunto in: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il nome o l'ID del gruppo

Il metodo `process.setgid()` imposta l'identità del gruppo del processo. (Vedi [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) L'`id` può essere passato come ID numerico o come stringa del nome del gruppo. Se viene specificato un nome di gruppo, questo metodo si blocca durante la risoluzione dell'ID numerico associato.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero non Windows o Android). Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Aggiunto in: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `process.setgroups()` imposta gli ID di gruppo supplementari per il processo Node.js. Questa è un'operazione privilegiata che richiede che il processo Node.js abbia `root` o la capability `CAP_SETGID`.

L'array `groups` può contenere ID di gruppo numerici, nomi di gruppo o entrambi.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero non Windows o Android). Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).

## `process.setuid(id)` {#processsetuidid}

**Aggiunto in: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `process.setuid(id)` imposta l'identità utente del processo. (Vedi [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) L'`id` può essere passato come ID numerico o come stringa username. Se viene specificato un username, il metodo si blocca durante la risoluzione dell'ID numerico associato.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Questa funzione è disponibile solo su piattaforme POSIX (ovvero non Windows o Android). Questa funzionalità non è disponibile nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Aggiunto in: v16.6.0, v14.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa funzione abilita o disabilita il supporto [Source Map v3](https://sourcemaps.info/spec) per le stack trace.

Fornisce le stesse funzionalità dell'avvio del processo Node.js con le opzioni della riga di comando `--enable-source-maps`.

Verranno analizzate e caricate solo le source map nei file JavaScript che vengono caricati dopo che le source map sono state abilitate.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Aggiunto in: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

La funzione `process.setUncaughtExceptionCaptureCallback()` imposta una funzione che verrà invocata quando si verifica un'eccezione non intercettata, che riceverà il valore dell'eccezione stessa come primo argomento.

Se viene impostata una tale funzione, l'evento [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception) non verrà emesso. Se `--abort-on-uncaught-exception` è stato passato dalla riga di comando o impostato tramite [`v8.setFlagsFromString()`](/it/nodejs/api/v8#v8setflagsfromstringflags), il processo non verrà interrotto. Anche le azioni configurate per essere eseguite sulle eccezioni, come la generazione di report, ne saranno influenzate.

Per annullare l'impostazione della funzione di acquisizione, è possibile utilizzare `process.setUncaughtExceptionCaptureCallback(null)`. La chiamata di questo metodo con un argomento non `null` mentre è impostata un'altra funzione di acquisizione genererà un errore.

L'utilizzo di questa funzione si esclude a vicenda con l'utilizzo del modulo integrato [`domain`](/it/nodejs/api/domain) deprecato.

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Aggiunto in: v20.7.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `process.sourceMapsEnabled` restituisce se il supporto [Source Map v3](https://sourcemaps.info/spec) per le stack trace è abilitato.


## `process.stderr` {#processstderr}

- [\<Stream\>](/it/nodejs/api/stream#stream)

La proprietà `process.stderr` restituisce uno stream connesso a `stderr` (fd `2`). È un [`net.Socket`](/it/nodejs/api/net#class-netsocket) (che è uno stream [Duplex](/it/nodejs/api/stream#duplex-and-transform-streams)) a meno che fd `2` non si riferisca a un file, nel qual caso è uno stream [Writable](/it/nodejs/api/stream#writable-streams).

`process.stderr` differisce dagli altri stream di Node.js in modi importanti. Per maggiori informazioni, consultare [nota sull'I/O del processo](/it/nodejs/api/process#a-note-on-process-io).

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà si riferisce al valore del descrittore di file sottostante di `process.stderr`. Il valore è fisso a `2`. Nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo campo non esiste.

## `process.stdin` {#processstdin}

- [\<Stream\>](/it/nodejs/api/stream#stream)

La proprietà `process.stdin` restituisce uno stream connesso a `stdin` (fd `0`). È un [`net.Socket`](/it/nodejs/api/net#class-netsocket) (che è uno stream [Duplex](/it/nodejs/api/stream#duplex-and-transform-streams)) a meno che fd `0` non si riferisca a un file, nel qual caso è uno stream [Readable](/it/nodejs/api/stream#readable-streams).

Per i dettagli su come leggere da `stdin` vedere [`readable.read()`](/it/nodejs/api/stream#readablereadsize).

Come stream [Duplex](/it/nodejs/api/stream#duplex-and-transform-streams), `process.stdin` può anche essere utilizzato in modalità "vecchia" che è compatibile con gli script scritti per Node.js prima della v0.10. Per maggiori informazioni vedere [Compatibilità con le versioni precedenti di Node.js](/it/nodejs/api/stream#compatibility-with-older-nodejs-versions).

In modalità stream "vecchia", lo stream `stdin` è in pausa per impostazione predefinita, quindi è necessario chiamare `process.stdin.resume()` per leggerlo. Si noti inoltre che chiamare `process.stdin.resume()` commuterebbe lo stream in modalità "vecchia".

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà si riferisce al valore del descrittore di file sottostante di `process.stdin`. Il valore è fisso a `0`. Nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo campo non esiste.


## `process.stdout` {#processstdout}

- [\<Stream\>](/it/nodejs/api/stream#stream)

La proprietà `process.stdout` restituisce uno stream connesso a `stdout` (fd `1`). È un [`net.Socket`](/it/nodejs/api/net#class-netsocket) (che è uno stream [Duplex](/it/nodejs/api/stream#duplex-and-transform-streams)) a meno che fd `1` non si riferisca a un file, nel qual caso è uno stream [Writable](/it/nodejs/api/stream#writable-streams).

Ad esempio, per copiare `process.stdin` in `process.stdout`:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` differisce dagli altri stream Node.js in modi importanti. Vedi [nota su I/O del processo](/it/nodejs/api/process#a-note-on-process-io) per maggiori informazioni.

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà si riferisce al valore del descrittore di file sottostante di `process.stdout`. Il valore è fisso a `1`. Nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo campo non esiste.

### Una nota sull'I/O del processo {#a-note-on-process-i/o}

`process.stdout` e `process.stderr` differiscono dagli altri stream Node.js in modi importanti:

Questi comportamenti sono in parte per ragioni storiche, in quanto modificarli creerebbe incompatibilità con le versioni precedenti, ma sono anche attesi da alcuni utenti.

Le scritture sincrone evitano problemi come l'output scritto con `console.log()` o `console.error()` che viene inaspettatamente interlacciato o non scritto affatto se `process.exit()` viene chiamato prima che una scrittura asincrona sia completata. Vedi [`process.exit()`](/it/nodejs/api/process#processexitcode) per maggiori informazioni.

*<strong>Avviso</strong>*: Le scritture sincrone bloccano l'event loop finché la scrittura non è stata completata. Questo può essere quasi istantaneo nel caso di output su un file, ma sotto carico elevato del sistema, pipe che non vengono lette all'estremità ricevente, o con terminali o file system lenti, è possibile che l'event loop venga bloccato abbastanza spesso e abbastanza a lungo da avere gravi impatti negativi sulle prestazioni. Questo potrebbe non essere un problema quando si scrive su una sessione di terminale interattiva, ma considerare questo con particolare attenzione quando si esegue la registrazione di produzione negli stream di output del processo.

Per verificare se uno stream è connesso a un contesto [TTY](/it/nodejs/api/tty#tty), controlla la proprietà `isTTY`.

Per esempio:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
Vedi la documentazione [TTY](/it/nodejs/api/tty#tty) per maggiori informazioni.


## `process.throwDeprecation` {#processthrowdeprecation}

**Aggiunto in: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il valore iniziale di `process.throwDeprecation` indica se il flag `--throw-deprecation` è impostato sul processo Node.js corrente. `process.throwDeprecation` è mutabile, quindi se gli avvisi di deprecazione risultino o meno in errori può essere alterato in fase di esecuzione. Vedere la documentazione per l'evento [`'warning'`](/it/nodejs/api/process#event-warning) e il metodo [`emitWarning()`](/it/nodejs/api/process#processemitwarningwarning-type-code-ctor) per maggiori informazioni.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Aggiunto in: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.title` restituisce il titolo del processo corrente (ovvero, restituisce il valore corrente di `ps`). Assegnare un nuovo valore a `process.title` modifica il valore corrente di `ps`.

Quando viene assegnato un nuovo valore, diverse piattaforme imporranno diverse restrizioni sulla lunghezza massima del titolo. Di solito tali restrizioni sono piuttosto limitate. Ad esempio, su Linux e macOS, `process.title` è limitato alla dimensione del nome binario più la lunghezza degli argomenti della riga di comando perché l'impostazione di `process.title` sovrascrive la memoria `argv` del processo. Node.js v0.8 consentiva stringhe di titolo di processo più lunghe anche sovrascrivendo la memoria `environ`, ma ciò era potenzialmente non sicuro e confuso in alcuni casi (piuttosto oscuri).

L'assegnazione di un valore a `process.title` potrebbe non comportare un'etichetta accurata all'interno di applicazioni di gestione dei processi come macOS Activity Monitor o Windows Services Manager.


## `process.traceDeprecation` {#processtracedeprecation}

**Aggiunto in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `process.traceDeprecation` indica se il flag `--trace-deprecation` è impostato sul processo Node.js corrente. Fare riferimento alla documentazione per l' [`'warning'` event](/it/nodejs/api/process#event-warning) e per il metodo [`emitWarning()` method](/it/nodejs/api/process#processemitwarningwarning-type-code-ctor) per maggiori informazioni sul comportamento di questo flag.

## `process.umask()` {#processumask}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0, v12.19.0 | Chiamare `process.umask()` senza argomenti è deprecato. |
| v0.1.19 | Aggiunto in: v0.1.19 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Chiamare `process.umask()` senza argomenti causa la scrittura due volte della umask a livello di processo. Questo introduce una race condition tra i thread, ed è una potenziale vulnerabilità di sicurezza. Non esiste una API alternativa sicura e multipiattaforma.
:::

`process.umask()` restituisce la maschera di creazione della modalità file del processo Node.js. I processi figlio ereditano la maschera dal processo padre.

## `process.umask(mask)` {#processumaskmask}

**Aggiunto in: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` imposta la maschera di creazione della modalità file del processo Node.js. I processi figlio ereditano la maschera dal processo padre. Restituisce la maschera precedente.



::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

Nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), `process.umask(mask)` lancerà un'eccezione.


## `process.uptime()` {#processuptime}

**Aggiunto in: v0.5.0**

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `process.uptime()` restituisce il numero di secondi durante i quali il processo Node.js corrente è stato in esecuzione.

Il valore restituito include frazioni di secondo. Usa `Math.floor()` per ottenere i secondi interi.

## `process.version` {#processversion}

**Aggiunto in: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `process.version` contiene la stringa della versione di Node.js.



::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

Per ottenere la stringa della versione senza la *v* anteposta, usa `process.versions.node`.

## `process.versions` {#processversions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | La proprietà `v8` ora include un suffisso specifico per Node.js. |
| v4.2.0 | La proprietà `icu` è ora supportata. |
| v0.2.0 | Aggiunto in: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `process.versions` restituisce un oggetto che elenca le stringhe della versione di Node.js e delle sue dipendenze. `process.versions.modules` indica la versione ABI corrente, che viene incrementata ogni volta che un'API C++ cambia. Node.js si rifiuterà di caricare moduli compilati rispetto a una versione ABI del modulo diversa.



::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

Genererà un oggetto simile a:

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## Codici di uscita {#exit-codes}

Node.js normalmente termina con un codice di stato `0` quando non ci sono più operazioni asincrone in sospeso. I seguenti codici di stato vengono utilizzati in altri casi:

- `1` **Eccezione Fatale Non Gestita**: C'è stata un'eccezione non gestita e non è stata gestita da un dominio o da un gestore di eventi [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception).
- `2`: Inutilizzato (riservato da Bash per uso improprio integrato)
- `3` **Errore di Parsing JavaScript Interno**: Il codice sorgente JavaScript interno al processo di bootstrap di Node.js ha causato un errore di parsing. Questo è estremamente raro e generalmente può accadere solo durante lo sviluppo di Node.js stesso.
- `4` **Errore di Valutazione JavaScript Interno**: Il codice sorgente JavaScript interno al processo di bootstrap di Node.js non è riuscito a restituire un valore di funzione quando è stato valutato. Questo è estremamente raro e generalmente può accadere solo durante lo sviluppo di Node.js stesso.
- `5` **Errore Fatale**: Si è verificato un errore fatale irrecuperabile in V8. Tipicamente verrà stampato un messaggio su stderr con il prefisso `FATAL ERROR`.
- `6` **Gestore di Eccezione Interno Non-funzione**: C'è stata un'eccezione non gestita, ma la funzione interna del gestore di eccezioni fatali è stata in qualche modo impostata su una non-funzione e non poteva essere chiamata.
- `7` **Errore di Runtime del Gestore di Eccezione Interno**: C'è stata un'eccezione non gestita e la funzione interna del gestore di eccezioni fatali ha generato un errore mentre tentava di gestirla. Questo può accadere, ad esempio, se un gestore [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception) o `domain.on('error')` genera un errore.
- `8`: Inutilizzato. Nelle versioni precedenti di Node.js, il codice di uscita 8 a volte indicava un'eccezione non gestita.
- `9` **Argomento Non Valido**: È stata specificata un'opzione sconosciuta oppure è stata fornita un'opzione che richiedeva un valore senza un valore.
- `10` **Errore di Runtime JavaScript Interno**: Il codice sorgente JavaScript interno al processo di bootstrap di Node.js ha generato un errore quando è stata chiamata la funzione di bootstrap. Questo è estremamente raro e generalmente può accadere solo durante lo sviluppo di Node.js stesso.
- `12` **Argomento di Debug Non Valido**: Le opzioni `--inspect` e/o `--inspect-brk` sono state impostate, ma il numero di porta scelto non era valido o non disponibile.
- `13` **Await di Livello Superiore Non Risolto**: `await` è stato utilizzato al di fuori di una funzione nel codice di livello superiore, ma la `Promise` passata non si è mai risolta.
- `14` **Errore di Snapshot**: Node.js è stato avviato per costruire uno snapshot di avvio V8 ed è fallito perché alcuni requisiti dello stato dell'applicazione non sono stati soddisfatti.
- `\>128` **Uscite da Segnale**: Se Node.js riceve un segnale fatale come `SIGKILL` o `SIGHUP`, allora il suo codice di uscita sarà `128` più il valore del codice del segnale. Questa è una pratica POSIX standard, poiché i codici di uscita sono definiti come interi a 7 bit e le uscite da segnale impostano il bit più significativo e quindi contengono il valore del codice del segnale. Ad esempio, il segnale `SIGABRT` ha valore `6`, quindi il codice di uscita previsto sarà `128` + `6`, o `134`.

