---
title: Documentazione Node.js - Ganci di Performance
description: Esplora l'API dei ganci di performance in Node.js, che fornisce accesso alle metriche di performance e agli strumenti per misurare le prestazioni delle applicazioni Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Ganci di Performance | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora l'API dei ganci di performance in Node.js, che fornisce accesso alle metriche di performance e agli strumenti per misurare le prestazioni delle applicazioni Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Ganci di Performance | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora l'API dei ganci di performance in Node.js, che fornisce accesso alle metriche di performance e agli strumenti per misurare le prestazioni delle applicazioni Node.js.
---


# API per la misurazione delle prestazioni {#performance-measurement-apis}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

Questo modulo fornisce un'implementazione di un sottoinsieme delle [API Web Performance](https://w3c.github.io/perf-timing-primer/) del W3C, nonché API aggiuntive per misurazioni delle prestazioni specifiche di Node.js.

Node.js supporta le seguenti [API Web Performance](https://w3c.github.io/perf-timing-primer/):

- [Tempo ad alta risoluzione](https://www.w3.org/TR/hr-time-2)
- [Sequenza temporale delle prestazioni](https://w3c.github.io/performance-timeline/)
- [Tempistica utente](https://www.w3.org/TR/user-timing/)
- [Tempistica delle risorse](https://www.w3.org/TR/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**Aggiunto in: v8.5.0**

Un oggetto che può essere utilizzato per raccogliere metriche sulle prestazioni dall'istanza corrente di Node.js. È simile a [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) nei browser.


### `performance.clearMarks([name])` {#performanceclearmarksname}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `name` non viene fornito, rimuove tutti gli oggetti `PerformanceMark` dalla sequenza temporale delle prestazioni. Se `name` viene fornito, rimuove solo il mark denominato.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v16.7.0 | Aggiunto in: v16.7.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `name` non viene fornito, rimuove tutti gli oggetti `PerformanceMeasure` dalla sequenza temporale delle prestazioni. Se `name` viene fornito, rimuove solo la misurazione denominata.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `name` non viene fornito, rimuove tutti gli oggetti `PerformanceResourceTiming` dalla sequenza temporale delle risorse. Se `name` viene fornito, rimuove solo la risorsa denominata.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Aggiunto in: v14.10.0, v12.19.0**

- `utilization1` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il risultato di una precedente chiamata a `eventLoopUtilization()`.
- `utilization2` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il risultato di una precedente chiamata a `eventLoopUtilization()` precedente a `utilization1`.
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `eventLoopUtilization()` restituisce un oggetto che contiene la durata cumulativa del tempo in cui il ciclo di eventi è stato sia inattivo sia attivo come un timer di millisecondi ad alta risoluzione. Il valore di `utilization` è l'Event Loop Utilization (ELU) calcolato.

Se il bootstrapping non è ancora terminato sul thread principale, le proprietà hanno il valore di `0`. L'ELU è immediatamente disponibile sui [thread Worker](/it/nodejs/api/worker_threads#worker-threads) poiché il bootstrap avviene all'interno del ciclo di eventi.

Sia `utilization1` che `utilization2` sono parametri opzionali.

Se viene passato `utilization1`, viene calcolato e restituito il delta tra i tempi `active` e `idle` della chiamata corrente, nonché il corrispondente valore di `utilization` (simile a [`process.hrtime()`](/it/nodejs/api/process#processhrtimetime)).

Se vengono passati sia `utilization1` che `utilization2`, il delta viene calcolato tra i due argomenti. Questa è un'opzione di convenienza perché, a differenza di [`process.hrtime()`](/it/nodejs/api/process#processhrtimetime), il calcolo dell'ELU è più complesso di una singola sottrazione.

L'ELU è simile all'utilizzo della CPU, tranne per il fatto che misura solo le statistiche del ciclo di eventi e non l'utilizzo della CPU. Rappresenta la percentuale di tempo in cui il ciclo di eventi ha trascorso al di fuori del provider di eventi del ciclo di eventi (ad es. `epoll_wait`). Non viene preso in considerazione nessun altro tempo di inattività della CPU. Il seguente è un esempio di come un processo per lo più inattivo avrà un ELU elevato.



::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

Sebbene la CPU sia per lo più inattiva durante l'esecuzione di questo script, il valore di `utilization` è `1`. Questo perché la chiamata a [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options) impedisce al ciclo di eventi di procedere.

Passare un oggetto definito dall'utente invece del risultato di una precedente chiamata a `eventLoopUtilization()` porterà a un comportamento indefinito. Non è garantito che i valori restituiti riflettano un corretto stato del ciclo di eventi.


### `performance.getEntries()` {#performancegetentries}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v16.7.0 | Aggiunto in: v16.7.0 |
:::

- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Restituisce un elenco di oggetti `PerformanceEntry` in ordine cronologico rispetto a `performanceEntry.startTime`. Se sei interessato solo alle voci di prestazioni di determinati tipi o che hanno determinati nomi, consulta `performance.getEntriesByType()` e `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v16.7.0 | Aggiunto in: v16.7.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Restituisce un elenco di oggetti `PerformanceEntry` in ordine cronologico rispetto a `performanceEntry.startTime` il cui `performanceEntry.name` è uguale a `name` e, facoltativamente, il cui `performanceEntry.entryType` è uguale a `type`.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v16.7.0 | Aggiunto in: v16.7.0 |
:::

- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Restituisce un elenco di oggetti `PerformanceEntry` in ordine cronologico rispetto a `performanceEntry.startTime` il cui `performanceEntry.entryType` è uguale a `type`.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. L'argomento name non è più opzionale. |
| v16.0.0 | Aggiornato per essere conforme alla specifica User Timing Level 3. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ulteriori dettagli opzionali da includere con il contrassegno.
    - `startTime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un timestamp opzionale da utilizzare come tempo di contrassegno. **Predefinito**: `performance.now()`.

Crea una nuova voce `PerformanceMark` nella Performance Timeline. Un `PerformanceMark` è una sottoclasse di `PerformanceEntry` il cui `performanceEntry.entryType` è sempre `'mark'` e il cui `performanceEntry.duration` è sempre `0`. I contrassegni di prestazioni vengono utilizzati per contrassegnare specifici momenti significativi nella Performance Timeline.

La voce `PerformanceMark` creata viene inserita nella Performance Timeline globale e può essere interrogata con `performance.getEntries`, `performance.getEntriesByName` e `performance.getEntriesByType`. Quando viene eseguita l'osservazione, le voci devono essere cancellate manualmente dalla Performance Timeline globale con `performance.clearMarks`.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.2.0 | Aggiunti gli argomenti bodyInfo, responseStatus e deliveryType. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Timing Info](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL della risorsa
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome dell'iniziatore, ad esempio: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La modalità cache deve essere una stringa vuota ('') o 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Response Body Info](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di stato della risposta
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di consegna. **Predefinito:** `''`.

*Questa proprietà è un'estensione di Node.js. Non è disponibile nei browser Web.*

Crea una nuova voce `PerformanceResourceTiming` nella Timeline delle Risorse. Un `PerformanceResourceTiming` è una sottoclasse di `PerformanceEntry` la cui `performanceEntry.entryType` è sempre `'resource'`. Le risorse di performance vengono utilizzate per contrassegnare i momenti nella Timeline delle Risorse.

La voce `PerformanceMark` creata viene inserita nella Timeline delle Risorse globale e può essere interrogata con `performance.getEntries`, `performance.getEntriesByName` e `performance.getEntriesByType`. Quando viene eseguita l'osservazione, le voci devono essere cancellate manualmente dalla Timeline delle Performance globale con `performance.clearResourceTimings`.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v16.0.0 | Aggiornato per conformarsi alla specifica User Timing Level 3. |
| v13.13.0, v12.16.3 | Rendi i parametri `startMark` e `endMark` opzionali. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzionale.
    - `detail` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Dettaglio aggiuntivo opzionale da includere con la misurazione.
    - `duration` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Durata tra l'ora di inizio e di fine.
    - `end` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Timestamp da utilizzare come ora di fine, o una stringa che identifica un segno precedentemente registrato.
    - `start` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Timestamp da utilizzare come ora di inizio, o una stringa che identifica un segno precedentemente registrato.

- `endMark` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opzionale. Deve essere omesso se `startMarkOrOptions` è un [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Crea una nuova voce `PerformanceMeasure` nella Performance Timeline. Una `PerformanceMeasure` è una sottoclasse di `PerformanceEntry` il cui `performanceEntry.entryType` è sempre `'measure'` e la cui `performanceEntry.duration` misura il numero di millisecondi trascorsi tra `startMark` e `endMark`.

L'argomento `startMark` può identificare qualsiasi `PerformanceMark` *esistente* nella Performance Timeline, oppure *può* identificare qualsiasi proprietà di timestamp fornita dalla classe `PerformanceNodeTiming`. Se il `startMark` nominato non esiste, viene generato un errore.

L'argomento opzionale `endMark` deve identificare qualsiasi `PerformanceMark` *esistente* nella Performance Timeline o qualsiasi proprietà di timestamp fornita dalla classe `PerformanceNodeTiming`. `endMark` sarà `performance.now()` se non viene passato alcun parametro, altrimenti se il `endMark` nominato non esiste, verrà generato un errore.

La voce `PerformanceMeasure` creata viene inserita nella Performance Timeline globale e può essere interrogata con `performance.getEntries`, `performance.getEntriesByName` e `performance.getEntriesByType`. Quando viene eseguita l'osservazione, le voci devono essere cancellate manualmente dalla Performance Timeline globale con `performance.clearMeasures`.


### `performance.nodeTiming` {#performancenodetiming}

**Aggiunto in: v8.5.0**

- [\<PerformanceNodeTiming\>](/it/nodejs/api/perf_hooks#class-performancenodetiming)

*Questa proprietà è un'estensione di Node.js. Non è disponibile nei browser web.*

Un'istanza della classe `PerformanceNodeTiming` che fornisce metriche di performance per specifiche milestone operative di Node.js.

### `performance.now()` {#performancenow}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il timestamp corrente ad alta risoluzione in millisecondi, dove 0 rappresenta l'inizio del processo `node` corrente.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v18.8.0 | Aggiunto in: v18.8.0 |
:::

Imposta la dimensione globale del buffer di performance resource timing al numero specificato di oggetti di entry di performance di tipo "resource".

Per impostazione predefinita, la dimensione massima del buffer è impostata su 250.

### `performance.timeOrigin` {#performancetimeorigin}

**Aggiunto in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'[`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) specifica il timestamp ad alta risoluzione in millisecondi in cui è iniziato il processo `node` corrente, misurato in tempo Unix.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Aggiunta l'opzione histogram. |
| v16.0.0 | Reimplementato per utilizzare JavaScript puro e la capacità di cronometrare funzioni async. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `histogram` [\<RecordableHistogram\>](/it/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) Un oggetto istogramma creato utilizzando `perf_hooks.createHistogram()` che registrerà le durate di runtime in nanosecondi.

*Questa proprietà è un'estensione di Node.js. Non è disponibile nei browser web.*

Avvolge una funzione all'interno di una nuova funzione che misura il tempo di esecuzione della funzione avvolta. Un `PerformanceObserver` deve essere sottoscritto al tipo di evento `'function'` affinché i dettagli temporali siano accessibili.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// Verrà creata una entry della timeline delle performance
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// Verrà creata una entry della timeline delle performance
wrapped();
```
:::

Se la funzione avvolta restituisce una promise, un gestore finally verrà allegato alla promise e la durata verrà segnalata una volta che il gestore finally verrà invocato.


### `performance.toJSON()` {#performancetojson}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `performance` come ricevitore. |
| v16.1.0 | Aggiunto in: v16.1.0 |
:::

Un oggetto che è una rappresentazione JSON dell'oggetto `performance`. È simile a [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) nei browser.

#### Evento: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**Aggiunto in: v18.8.0**

L'evento `'resourcetimingbufferfull'` viene attivato quando il buffer temporale delle risorse delle prestazioni globali è pieno. Regola la dimensione del buffer temporale delle risorse con `performance.setResourceTimingBufferSize()` o svuota il buffer con `performance.clearResourceTimings()` nel listener dell'evento per consentire l'aggiunta di più voci al buffer della timeline delle prestazioni.

## Classe: `PerformanceEntry` {#class-performanceentry}

**Aggiunto in: v8.5.0**

Il costruttore di questa classe non è esposto direttamente agli utenti.

### `performanceEntry.duration` {#performanceentryduration}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceEntry` come ricevitore. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero totale di millisecondi trascorsi per questa voce. Questo valore non sarà significativo per tutti i tipi di Performance Entry.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceEntry` come ricevitore. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il tipo della voce di performance. Può essere uno tra:

- `'dns'` (solo Node.js)
- `'function'` (solo Node.js)
- `'gc'` (solo Node.js)
- `'http2'` (solo Node.js)
- `'http'` (solo Node.js)
- `'mark'` (disponibile sul Web)
- `'measure'` (disponibile sul Web)
- `'net'` (solo Node.js)
- `'node'` (solo Node.js)
- `'resource'` (disponibile sul Web)


### `performanceEntry.name` {#performanceentryname}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Il getter di questa proprietà deve essere chiamato con l'oggetto `PerformanceEntry` come ricevitore. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome della voce di performance.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Il getter di questa proprietà deve essere chiamato con l'oggetto `PerformanceEntry` come ricevitore. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che indica l'ora di inizio della Voce di Performance.

## Classe: `PerformanceMark` {#class-performancemark}

**Aggiunto in: v18.2.0, v16.17.0**

- Estende: [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Espone i mark creati tramite il metodo `Performance.mark()`.

### `performanceMark.detail` {#performancemarkdetail}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Il getter di questa proprietà deve essere chiamato con l'oggetto `PerformanceMark` come ricevitore. |
| v16.0.0 | Aggiunto in: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Dettagli aggiuntivi specificati durante la creazione con il metodo `Performance.mark()`.

## Classe: `PerformanceMeasure` {#class-performancemeasure}

**Aggiunto in: v18.2.0, v16.17.0**

- Estende: [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Espone le measure create tramite il metodo `Performance.measure()`.

Il costruttore di questa classe non è esposto direttamente agli utenti.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Il getter di questa proprietà deve essere chiamato con l'oggetto `PerformanceMeasure` come ricevitore. |
| v16.0.0 | Aggiunto in: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Dettagli aggiuntivi specificati durante la creazione con il metodo `Performance.measure()`.


## Classe: `PerformanceNodeEntry` {#class-performancenodeentry}

**Aggiunto in: v19.0.0**

- Estende: [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry)

*Questa classe è un'estensione di Node.js. Non è disponibile nei browser Web.*

Fornisce dati di temporizzazione dettagliati di Node.js.

Il costruttore di questa classe non è esposto direttamente agli utenti.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceNodeEntry` come ricevitore. |
| v16.0.0 | Aggiunto in: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Dettagli aggiuntivi specifici per l'`entryType`.

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Obsoleto in fase di esecuzione. Ora spostato nella proprietà detail quando entryType è 'gc'. |
| v13.9.0, v12.17.0 | Aggiunto in: v13.9.0, v12.17.0 |
:::

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Obsoleto: utilizzare invece `performanceNodeEntry.detail`.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando `performanceEntry.entryType` è uguale a `'gc'`, la proprietà `performance.flags` contiene informazioni aggiuntive sull'operazione di garbage collection. Il valore può essere uno tra:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Obsoleto in fase di esecuzione. Ora spostato nella proprietà detail quando entryType è 'gc'. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Obsoleto: utilizzare invece `performanceNodeEntry.detail`.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando `performanceEntry.entryType` è uguale a `'gc'`, la proprietà `performance.kind` identifica il tipo di operazione di garbage collection che si è verificata. Il valore può essere uno tra:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Dettagli del Garbage Collection ('gc') {#garbage-collection-gc-details}

Quando `performanceEntry.type` è uguale a `'gc'`, la proprietà `performanceNodeEntry.detail` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) con due proprietà:

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno tra:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno tra:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### Dettagli HTTP ('http') {#http-http-details}

Quando `performanceEntry.type` è uguale a `'http'`, la proprietà `performanceNodeEntry.detail` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente informazioni aggiuntive.

Se `performanceEntry.name` è uguale a `HttpClient`, il `detail` conterrà le seguenti proprietà: `req`, `res`. E la proprietà `req` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente `method`, `url`, `headers`, la proprietà `res` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente `statusCode`, `statusMessage`, `headers`.

Se `performanceEntry.name` è uguale a `HttpRequest`, il `detail` conterrà le seguenti proprietà: `req`, `res`. E la proprietà `req` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente `method`, `url`, `headers`, la proprietà `res` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente `statusCode`, `statusMessage`, `headers`.

Questo potrebbe aggiungere un overhead di memoria aggiuntivo e dovrebbe essere utilizzato solo per scopi diagnostici, non lasciato attivo in produzione di default.


### Dettagli HTTP/2 ('http2') {#http/2-http2-details}

Quando `performanceEntry.type` è uguale a `'http2'`, la proprietà `performanceNodeEntry.detail` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente ulteriori informazioni sulle prestazioni.

Se `performanceEntry.name` è uguale a `Http2Stream`, `detail` conterrà le seguenti proprietà:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte dei frame `DATA` ricevuti per questo `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte dei frame `DATA` inviati per questo `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'identificatore dell'`Http2Stream` associato.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra `startTime` di `PerformanceEntry` e la ricezione del primo frame `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra `startTime` di `PerformanceEntry` e l'invio del primo frame `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra `startTime` di `PerformanceEntry` e la ricezione del primo header.

Se `performanceEntry.name` è uguale a `Http2Session`, `detail` conterrà le seguenti proprietà:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte ricevuti per questa `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte inviati per questa `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di frame HTTP/2 ricevuti dall'`Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di frame HTTP/2 inviati dall'`Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero massimo di stream aperti contemporaneamente durante la durata dell'`Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra la trasmissione di un frame `PING` e la ricezione del suo acknowledgment. Presente solo se un frame `PING` è stato inviato sull'`Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata media (in millisecondi) per tutte le istanze `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di istanze `Http2Stream` elaborate dall'`Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'server'` o `'client'` per identificare il tipo di `Http2Session`.


### Dettagli Timerify ('function') {#timerify-function-details}

Quando `performanceEntry.type` è uguale a `'function'`, la proprietà `performanceNodeEntry.detail` sarà un [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) che elenca gli argomenti di input alla funzione temporizzata.

### Dettagli Net ('net') {#net-net-details}

Quando `performanceEntry.type` è uguale a `'net'`, la proprietà `performanceNodeEntry.detail` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente informazioni aggiuntive.

Se `performanceEntry.name` è uguale a `connect`, il `detail` conterrà le seguenti proprietà: `host`, `port`.

### Dettagli DNS ('dns') {#dns-dns-details}

Quando `performanceEntry.type` è uguale a `'dns'`, la proprietà `performanceNodeEntry.detail` sarà un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente informazioni aggiuntive.

Se `performanceEntry.name` è uguale a `lookup`, il `detail` conterrà le seguenti proprietà: `hostname`, `family`, `hints`, `verbatim`, `addresses`.

Se `performanceEntry.name` è uguale a `lookupService`, il `detail` conterrà le seguenti proprietà: `host`, `port`, `hostname`, `service`.

Se `performanceEntry.name` è uguale a `queryxxx` o `getHostByAddr`, il `detail` conterrà le seguenti proprietà: `host`, `ttl`, `result`. Il valore di `result` è lo stesso del risultato di `queryxxx` o `getHostByAddr`.

## Classe: `PerformanceNodeTiming` {#class-performancenodetiming}

**Aggiunta in: v8.5.0**

- Estende: [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry)

*Questa proprietà è un'estensione di Node.js. Non è disponibile nei browser Web.*

Fornisce dettagli di temporizzazione per Node.js stesso. Il costruttore di questa classe non è esposto agli utenti.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Aggiunta in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione in cui il processo Node.js ha completato il bootstrapping. Se il bootstrapping non è ancora terminato, la proprietà ha il valore di -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Aggiunto in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione in cui l'ambiente Node.js è stato inizializzato.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Aggiunto in: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione della quantità di tempo in cui il ciclo di eventi è rimasto inattivo all'interno del provider di eventi del ciclo di eventi (ad es. `epoll_wait`). Questo non tiene conto dell'utilizzo della CPU. Se il ciclo di eventi non è ancora iniziato (ad es., nel primo tick dello script principale), la proprietà ha il valore di 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Aggiunto in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione in cui il ciclo di eventi di Node.js è uscito. Se il ciclo di eventi non è ancora uscito, la proprietà ha il valore di -1. Può avere un valore diverso da -1 solo in un gestore dell'evento [`'exit'`](/it/nodejs/api/process#event-exit).

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Aggiunto in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione in cui è iniziato il ciclo di eventi di Node.js. Se il ciclo di eventi non è ancora iniziato (ad es., nel primo tick dello script principale), la proprietà ha il valore di -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Aggiunto in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione in cui è stato inizializzato il processo Node.js.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Aggiunto in: v22.8.0, v20.18.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di iterazioni del ciclo di eventi.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di eventi che sono stati elaborati dal gestore di eventi.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di eventi che erano in attesa di essere elaborati quando è stato chiamato il provider di eventi.

Questo è un wrapper per la funzione `uv_metrics_info`. Restituisce l'insieme corrente di metriche del ciclo di eventi.

Si consiglia di utilizzare questa proprietà all'interno di una funzione la cui esecuzione è stata programmata utilizzando `setImmediate` per evitare di raccogliere metriche prima di terminare tutte le operazioni programmate durante l'iterazione corrente del ciclo.

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Aggiunto in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp ad alta risoluzione in millisecondi in cui è stata inizializzata la piattaforma V8.

## Classe: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Aggiunto in: v18.2.0, v16.17.0**

- Estende: [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Fornisce dati di tempistica di rete dettagliati relativi al caricamento delle risorse di un'applicazione.

Il costruttore di questa classe non è esposto direttamente agli utenti.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp ad alta risoluzione in millisecondi immediatamente prima dell'invio della richiesta `fetch`. Se la risorsa non viene intercettata da un worker, la proprietà restituirà sempre 0.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp ad alta risoluzione in millisecondi che rappresenta l'ora di inizio del fetch che avvia il reindirizzamento.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp ad alta risoluzione in millisecondi che verrà creato immediatamente dopo aver ricevuto l'ultimo byte della risposta dell'ultimo reindirizzamento.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione immediatamente prima che Node.js inizi a recuperare la risorsa.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione immediatamente prima che Node.js inizi la ricerca del nome di dominio per la risorsa.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che rappresenta il momento immediatamente successivo alla fine della ricerca del nome di dominio per la risorsa da parte di Node.js.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che rappresenta il momento immediatamente prima che Node.js inizi a stabilire la connessione al server per recuperare la risorsa.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che rappresenta il momento immediatamente successivo al completamento da parte di Node.js della connessione al server per recuperare la risorsa.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che rappresenta il momento immediatamente precedente all'avvio da parte di Node.js del processo di handshake per proteggere la connessione corrente.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che rappresenta il momento immediatamente precedente alla ricezione da parte di Node.js del primo byte della risposta dal server.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi ad alta risoluzione che rappresenta il momento immediatamente successivo alla ricezione da parte di Node.js dell'ultimo byte della risorsa o immediatamente precedente alla chiusura della connessione di trasporto, a seconda di quale evento si verifica per primo.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un numero che rappresenta la dimensione (in ottetti) della risorsa recuperata. La dimensione include i campi dell'intestazione di risposta più il corpo del payload di risposta.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un numero che rappresenta la dimensione (in ottetti) ricevuta dal recupero (HTTP o cache), del corpo del payload, prima di rimuovere qualsiasi codifica del contenuto applicata.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo getter di proprietà deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un numero che rappresenta la dimensione (in ottetti) ricevuta dal recupero (HTTP o cache), del corpo del messaggio, dopo aver rimosso qualsiasi codifica del contenuto applicata.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo metodo deve essere chiamato con l'oggetto `PerformanceResourceTiming` come ricevitore. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

Restituisce un `object` che è la rappresentazione JSON dell'oggetto `PerformanceResourceTiming`

## Classe: `PerformanceObserver` {#class-performanceobserver}

**Aggiunto in: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**Aggiunto in: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottieni i tipi supportati.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `list` [\<PerformanceObserverEntryList\>](/it/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/it/nodejs/api/perf_hooks#class-performanceobserver)


Gli oggetti `PerformanceObserver` forniscono notifiche quando nuove istanze di `PerformanceEntry` sono state aggiunte alla Performance Timeline.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

Poiché le istanze di `PerformanceObserver` introducono un sovraccarico di performance aggiuntivo, le istanze non devono essere lasciate sottoscritte alle notifiche a tempo indeterminato. Gli utenti devono disconnettere gli observer non appena non sono più necessari.

La `callback` viene invocata quando un `PerformanceObserver` viene notificato di nuove istanze di `PerformanceEntry`. La callback riceve un'istanza di `PerformanceObserverEntryList` e un riferimento al `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**Aggiunto in: v8.5.0**

Disconnette l'istanza di `PerformanceObserver` da tutte le notifiche.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.7.0 | Aggiornato per conformarsi a Performance Timeline Level 2. L'opzione buffered è stata riaggiunta. |
| v16.0.0 | Aggiornato per conformarsi a User Timing Level 3. L'opzione buffered è stata rimossa. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un singolo tipo di [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry). Non deve essere fornito se `entryTypes` è già specificato.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array di stringhe che identificano i tipi di istanze [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry) a cui l'observer è interessato. Se non viene fornito, verrà generato un errore.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se true, il callback dell'observer viene chiamato con un elenco di voci globali `PerformanceEntry` memorizzate nel buffer. Se false, solo le `PerformanceEntry` create dopo il punto temporale vengono inviate al callback dell'observer. **Predefinito:** `false`.

Iscrive l'istanza [\<PerformanceObserver\>](/it/nodejs/api/perf_hooks#class-performanceobserver) alle notifiche di nuove istanze [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry) identificate da `options.entryTypes` o `options.type`:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Chiamato una volta in modo asincrono. `list` contiene tre elementi.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Chiamato una volta in modo asincrono. `list` contiene tre elementi.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**Aggiunto in: v16.0.0**

- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry) Elenco attuale delle voci memorizzate nel performance observer, svuotandolo.

## Classe: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**Aggiunto in: v8.5.0**

La classe `PerformanceObserverEntryList` viene utilizzata per fornire l'accesso alle istanze `PerformanceEntry` passate a un `PerformanceObserver`. Il costruttore di questa classe non è esposto agli utenti.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**Aggiunto in: v8.5.0**

- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Restituisce un elenco di oggetti `PerformanceEntry` in ordine cronologico rispetto a `performanceEntry.startTime`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Aggiunto in: v8.5.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Restituisce un elenco di oggetti `PerformanceEntry` in ordine cronologico rispetto a `performanceEntry.startTime` il cui `performanceEntry.name` è uguale a `name` e, facoltativamente, il cui `performanceEntry.entryType` è uguale a `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**Aggiunto in: v8.5.0**

- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<PerformanceEntry[]\>](/it/nodejs/api/perf_hooks#class-performanceentry)

Restituisce un elenco di oggetti `PerformanceEntry` in ordine cronologico rispetto a `performanceEntry.startTime` il cui `performanceEntry.entryType` è uguale a `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**Aggiunto in: v15.9.0, v14.18.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Il valore discernibile più basso. Deve essere un valore intero maggiore di 0. **Predefinito:** `1`.
    - `highest` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Il valore registrabile più alto. Deve essere un valore intero uguale o maggiore di due volte `lowest`. **Predefinito:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di cifre di accuratezza. Deve essere un numero compreso tra `1` e `5`. **Predefinito:** `3`.

- Restituisce: [\<RecordableHistogram\>](/it/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Restituisce un [\<RecordableHistogram\>](/it/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram).


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Aggiunto in: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La frequenza di campionamento in millisecondi. Deve essere maggiore di zero. **Predefinito:** `10`.
  
 
- Restituisce: [\<IntervalHistogram\>](/it/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*Questa proprietà è un'estensione di Node.js. Non è disponibile nei browser Web.*

Crea un oggetto `IntervalHistogram` che campiona e riporta il ritardo del ciclo di eventi nel tempo. I ritardi saranno riportati in nanosecondi.

L'utilizzo di un timer per rilevare il ritardo approssimativo del ciclo di eventi funziona perché l'esecuzione dei timer è legata specificamente al ciclo di vita del ciclo di eventi libuv. Cioè, un ritardo nel ciclo causerà un ritardo nell'esecuzione del timer, e questi ritardi sono specificamente ciò che questa API ha lo scopo di rilevare.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Classe: `Histogram` {#class-histogram}

**Aggiunto in: v11.10.0**

### `histogram.count` {#histogramcount}

**Aggiunto in: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di campioni registrati dall'istogramma.

### `histogram.countBigInt` {#histogramcountbigint}

**Aggiunto in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il numero di campioni registrati dall'istogramma.


### `histogram.exceeds` {#histogramexceeds}

**Aggiunto in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di volte in cui il ritardo del ciclo di eventi ha superato la soglia massima di ritardo del ciclo di eventi di 1 ora.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Aggiunto in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il numero di volte in cui il ritardo del ciclo di eventi ha superato la soglia massima di ritardo del ciclo di eventi di 1 ora.

### `histogram.max` {#histogrammax}

**Aggiunto in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il ritardo massimo registrato del ciclo di eventi.

### `histogram.maxBigInt` {#histogrammaxbigint}

**Aggiunto in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il ritardo massimo registrato del ciclo di eventi.

### `histogram.mean` {#histogrammean}

**Aggiunto in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La media dei ritardi registrati del ciclo di eventi.

### `histogram.min` {#histogrammin}

**Aggiunto in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il ritardo minimo registrato del ciclo di eventi.

### `histogram.minBigInt` {#histogramminbigint}

**Aggiunto in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il ritardo minimo registrato del ciclo di eventi.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Aggiunto in: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valore di percentile nell'intervallo (0, 100].
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il valore al percentile indicato.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Aggiunto in: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valore di percentile nell'intervallo (0, 100].
- Restituisce: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Restituisce il valore al percentile indicato.


### `histogram.percentiles` {#histogrampercentiles}

**Aggiunto in: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Restituisce un oggetto `Map` che dettaglia la distribuzione percentile accumulata.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Aggiunto in: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Restituisce un oggetto `Map` che dettaglia la distribuzione percentile accumulata.

### `histogram.reset()` {#histogramreset}

**Aggiunto in: v11.10.0**

Reimposta i dati dell'istogramma raccolti.

### `histogram.stddev` {#histogramstddev}

**Aggiunto in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La deviazione standard dei ritardi del ciclo di eventi registrati.

## Classe: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

Un `Histogram` che viene aggiornato periodicamente a un dato intervallo.

### `histogram.disable()` {#histogramdisable}

**Aggiunto in: v11.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Disabilita il timer dell'intervallo di aggiornamento. Restituisce `true` se il timer è stato fermato, `false` se era già fermo.

### `histogram.enable()` {#histogramenable}

**Aggiunto in: v11.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Abilita il timer dell'intervallo di aggiornamento. Restituisce `true` se il timer è stato avviato, `false` se era già avviato.

### Clonazione di un `IntervalHistogram` {#cloning-an-intervalhistogram}

Le istanze di [\<IntervalHistogram\>](/it/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) possono essere clonate tramite [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport). Sul lato ricevente, l'istogramma viene clonato come un semplice oggetto [\<Histogram\>](/it/nodejs/api/perf_hooks#class-histogram) che non implementa i metodi `enable()` e `disable()`.

## Classe: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Aggiunto in: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Aggiunto in: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/it/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Aggiunge i valori da `other` a questo istogramma.


### `histogram.record(val)` {#histogramrecordval}

**Aggiunto in: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) L'ammontare da registrare nell'istogramma.

### `histogram.recordDelta()` {#histogramrecorddelta}

**Aggiunto in: v15.9.0, v14.18.0**

Calcola la quantità di tempo (in nanosecondi) trascorsa dall'ultima chiamata a `recordDelta()` e registra tale quantità nell'istogramma.

## Esempi {#examples}

### Misurazione della durata delle operazioni async {#measuring-the-duration-of-async-operations}

Il seguente esempio utilizza le API [Async Hooks](/it/nodejs/api/async_hooks) e Performance per misurare la durata effettiva di un'operazione Timeout (incluso il tempo necessario per eseguire il callback).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### Misurare quanto tempo impiega il caricamento delle dipendenze {#measuring-how-long-it-takes-to-load-dependencies}

L'esempio seguente misura la durata delle operazioni `require()` per caricare le dipendenze:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Attiva l'observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch la funzione require
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Attiva l'observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### Misurare quanto tempo impiega un round-trip HTTP {#measuring-how-long-one-http-round-trip-takes}

L'esempio seguente viene utilizzato per tracciare il tempo speso dal client HTTP (`OutgoingMessage`) e dalla richiesta HTTP (`IncomingMessage`). Per il client HTTP, significa l'intervallo di tempo tra l'avvio della richiesta e la ricezione della risposta, e per la richiesta HTTP, significa l'intervallo di tempo tra la ricezione della richiesta e l'invio della risposta:

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### Misurazione del tempo impiegato da `net.connect` (solo per TCP) quando la connessione ha successo {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### Misurazione del tempo impiegato dal DNS quando la richiesta ha successo {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

