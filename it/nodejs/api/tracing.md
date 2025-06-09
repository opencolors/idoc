---
title: Eventi di traccia di Node.js
description: Documentazione su come utilizzare l'API degli eventi di traccia di Node.js per il profiling delle prestazioni e il debugging.
head:
  - - meta
    - name: og:title
      content: Eventi di traccia di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentazione su come utilizzare l'API degli eventi di traccia di Node.js per il profiling delle prestazioni e il debugging.
  - - meta
    - name: twitter:title
      content: Eventi di traccia di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentazione su come utilizzare l'API degli eventi di traccia di Node.js per il profiling delle prestazioni e il debugging.
---


# Eventi di Traccia {#trace-events}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

**Codice Sorgente:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

Il modulo `node:trace_events` fornisce un meccanismo per centralizzare le informazioni di tracciamento generate da V8, dal core di Node.js e dal codice userspace.

Il tracciamento può essere abilitato con il flag da riga di comando `--trace-event-categories` o utilizzando il modulo `node:trace_events`. Il flag `--trace-event-categories` accetta un elenco di nomi di categorie separati da virgole.

Le categorie disponibili sono:

- `node`: Un segnaposto vuoto.
- `node.async_hooks`: Abilita l'acquisizione di dati di traccia dettagliati di [`async_hooks`](/it/nodejs/api/async_hooks). Gli eventi [`async_hooks`](/it/nodejs/api/async_hooks) hanno un `asyncId` univoco e una speciale proprietà `triggerId` `triggerAsyncId`.
- `node.bootstrap`: Abilita l'acquisizione delle milestone di bootstrap di Node.js.
- `node.console`: Abilita l'acquisizione dell'output di `console.time()` e `console.count()`.
- `node.threadpoolwork.sync`: Abilita l'acquisizione di dati di traccia per le operazioni sincrone del threadpool, come `blob`, `zlib`, `crypto` e `node_api`.
- `node.threadpoolwork.async`: Abilita l'acquisizione di dati di traccia per le operazioni asincrone del threadpool, come `blob`, `zlib`, `crypto` e `node_api`.
- `node.dns.native`: Abilita l'acquisizione di dati di traccia per le query DNS.
- `node.net.native`: Abilita l'acquisizione di dati di traccia per la rete.
- `node.environment`: Abilita l'acquisizione delle milestone dell'Environment di Node.js.
- `node.fs.sync`: Abilita l'acquisizione di dati di traccia per i metodi sync del file system.
- `node.fs_dir.sync`: Abilita l'acquisizione di dati di traccia per i metodi sync della directory del file system.
- `node.fs.async`: Abilita l'acquisizione di dati di traccia per i metodi async del file system.
- `node.fs_dir.async`: Abilita l'acquisizione di dati di traccia per i metodi async della directory del file system.
- `node.perf`: Abilita l'acquisizione di misurazioni dell'[API Performance](/it/nodejs/api/perf_hooks).
    - `node.perf.usertiming`: Abilita l'acquisizione solo delle misure e dei contrassegni di User Timing dell'API Performance.
    - `node.perf.timerify`: Abilita l'acquisizione solo delle misurazioni timerify dell'API Performance.


- `node.promises.rejections`: Abilita l'acquisizione di dati di traccia che tengono traccia del numero di rejection di Promise non gestite e gestite dopo la rejection.
- `node.vm.script`: Abilita l'acquisizione di dati di traccia per i metodi `runInNewContext()`, `runInContext()` e `runInThisContext()` del modulo `node:vm`.
- `v8`: Gli eventi [V8](/it/nodejs/api/v8) sono relativi a GC, compilazione ed esecuzione.
- `node.http`: Abilita l'acquisizione di dati di traccia per richieste/risposte http.
- `node.module_timer`: Abilita l'acquisizione di dati di traccia per il caricamento del modulo CJS.

Per impostazione predefinita, le categorie `node`, `node.async_hooks` e `v8` sono abilitate.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Le versioni precedenti di Node.js richiedevano l'uso del flag `--trace-events-enabled` per abilitare gli eventi di traccia. Questo requisito è stato rimosso. Tuttavia, il flag `--trace-events-enabled` *può* ancora essere utilizzato e abiliterà le categorie di eventi di traccia `node`, `node.async_hooks` e `v8` per impostazione predefinita.

```bash [BASH]
node --trace-events-enabled

# è equivalente a {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
In alternativa, gli eventi di traccia possono essere abilitati utilizzando il modulo `node:trace_events`:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // Abilita l'acquisizione di eventi di traccia per la categoria 'node.perf'

// esegui il lavoro

tracing.disable();  // Disabilita l'acquisizione di eventi di traccia per la categoria 'node.perf'
```
L'esecuzione di Node.js con il tracciamento abilitato produrrà file di log che possono essere aperti nella scheda [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) di Chrome.

Il file di log si chiama per impostazione predefinita `node_trace.${rotation}.log`, dove `${rotation}` è un id di rotazione del log incrementale. Il modello del percorso del file può essere specificato con `--trace-event-file-pattern` che accetta una stringa di modello che supporta `${rotation}` e `${pid}`:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
Per garantire che il file di log venga generato correttamente dopo eventi di segnale come `SIGINT`, `SIGTERM` o `SIGBREAK`, assicurati di avere i gestori appropriati nel tuo codice, come ad esempio:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // Oppure codice di uscita applicabile a seconda del sistema operativo e del segnale
});
```
Il sistema di tracciamento utilizza la stessa origine temporale utilizzata da `process.hrtime()`. Tuttavia, i timestamp degli eventi di traccia sono espressi in microsecondi, a differenza di `process.hrtime()` che restituisce nanosecondi.

Le funzionalità di questo modulo non sono disponibili nei thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).


## Il modulo `node:trace_events` {#the-nodetrace_events-module}

**Aggiunto in: v10.0.0**

### Oggetto `Tracing` {#tracing-object}

**Aggiunto in: v10.0.0**

L'oggetto `Tracing` viene utilizzato per abilitare o disabilitare la tracciatura per insiemi di categorie. Le istanze vengono create utilizzando il metodo `trace_events.createTracing()`.

Quando viene creato, l'oggetto `Tracing` è disabilitato. La chiamata al metodo `tracing.enable()` aggiunge le categorie all'insieme di categorie di eventi di traccia abilitate. La chiamata a `tracing.disable()` rimuoverà le categorie dall'insieme di categorie di eventi di traccia abilitate.

#### `tracing.categories` {#tracingcategories}

**Aggiunto in: v10.0.0**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un elenco separato da virgole delle categorie di eventi di traccia coperte da questo oggetto `Tracing`.

#### `tracing.disable()` {#tracingdisable}

**Aggiunto in: v10.0.0**

Disabilita questo oggetto `Tracing`.

Saranno disabilitate solo le categorie di eventi di traccia *non* coperte da altri oggetti `Tracing` abilitati e *non* specificate dal flag `--trace-event-categories`.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Stampa 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // Disabiliterà solo l'emissione della categoria 'node.perf'

// Stampa 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**Aggiunto in: v10.0.0**

Abilita questo oggetto `Tracing` per l'insieme di categorie coperte dall'oggetto `Tracing`.

#### `tracing.enabled` {#tracingenabled}

**Aggiunto in: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` solo se l'oggetto `Tracing` è stato abilitato.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**Aggiunto in: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array di nomi di categorie di traccia. I valori inclusi nell'array vengono convertiti in stringa quando possibile. Verrà generato un errore se il valore non può essere convertito.


- Restituisce: [\<Tracing\>](/it/nodejs/api/tracing#tracing-object).

Crea e restituisce un oggetto `Tracing` per l'insieme di `categories` specificato.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// fai qualcosa
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Aggiunto in: v10.0.0**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un elenco separato da virgole di tutte le categorie di eventi di traccia attualmente abilitate. L'insieme corrente di categorie di eventi di traccia abilitate è determinato dall'*unione* di tutti gli oggetti `Tracing` attualmente abilitati e di tutte le categorie abilitate utilizzando il flag `--trace-event-categories`.

Dato il file `test.js` di seguito, il comando `node --trace-event-categories node.perf test.js` stamperà `'node.async_hooks,node.perf'` nella console.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## Esempi {#examples}

### Raccogli i dati degli eventi di traccia tramite l'inspector {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // fatto
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // fare qualcosa
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
