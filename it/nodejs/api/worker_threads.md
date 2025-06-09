---
title: Thread di lavoro di Node.js
description: Documentazione su come utilizzare i thread di lavoro in Node.js per sfruttare il multithreading per compiti intensivi di CPU, con una panoramica della classe Worker, la comunicazione tra thread ed esempi di utilizzo.
head:
  - - meta
    - name: og:title
      content: Thread di lavoro di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentazione su come utilizzare i thread di lavoro in Node.js per sfruttare il multithreading per compiti intensivi di CPU, con una panoramica della classe Worker, la comunicazione tra thread ed esempi di utilizzo.
  - - meta
    - name: twitter:title
      content: Thread di lavoro di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentazione su come utilizzare i thread di lavoro in Node.js per sfruttare il multithreading per compiti intensivi di CPU, con una panoramica della classe Worker, la comunicazione tra thread ed esempi di utilizzo.
---


# Thread di lavoro {#worker-threads}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

Il modulo `node:worker_threads` abilita l'uso di thread che eseguono JavaScript in parallelo. Per accedervi:

```js [ESM]
const worker = require('node:worker_threads');
```
I worker (thread) sono utili per eseguire operazioni JavaScript ad alta intensità di CPU. Non aiutano molto con il lavoro ad alta intensità di I/O. Le operazioni di I/O asincrone integrate di Node.js sono più efficienti di quanto possano esserlo i worker.

A differenza di `child_process` o `cluster`, `worker_threads` possono condividere la memoria. Lo fanno trasferendo istanze di `ArrayBuffer` o condividendo istanze di `SharedArrayBuffer`.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker si è fermato con codice di uscita ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```
L'esempio precedente genera un thread Worker per ogni chiamata `parseJSAsync()`. In pratica, utilizza un pool di worker per questo tipo di attività. Altrimenti, il sovraccarico della creazione di worker probabilmente supererebbe i loro vantaggi.

Quando implementi un pool di worker, utilizza l'API [`AsyncResource`](/it/nodejs/api/async_hooks#class-asyncresource) per informare gli strumenti di diagnostica (ad es. per fornire stack trace asincroni) sulla correlazione tra le attività e i loro risultati. Consulta ["Utilizzo di `AsyncResource` per un pool di thread `Worker`"](/it/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) nella documentazione di `async_hooks` per un esempio di implementazione.

I thread di lavoro ereditano le opzioni non specifiche del processo per impostazione predefinita. Fai riferimento a [`Opzioni del costruttore Worker`](/it/nodejs/api/worker_threads#new-workerfilename-options) per sapere come personalizzare le opzioni dei thread di lavoro, in particolare le opzioni `argv` e `execArgv`.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.5.0, v16.15.0 | Non è più sperimentale. |
| v15.12.0, v14.18.0 | Aggiunto in: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript arbitrario e clonabile che può essere utilizzato come chiave di [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

All'interno di un thread worker, `worker.getEnvironmentData()` restituisce un clone dei dati passati a `worker.setEnvironmentData()` del thread di generazione. Ogni nuovo `Worker` riceve automaticamente la propria copia dei dati ambientali.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Stampa 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**Aggiunto in: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se questo codice non è in esecuzione all'interno di un thread [`Worker`](/it/nodejs/api/worker_threads#class-worker).

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // Questo ricarica il file corrente all'interno di un'istanza Worker.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Stampa 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**Aggiunto in: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript arbitrario.

Contrassegna un oggetto come non trasferibile. Se `object` si verifica nell'elenco di trasferimento di una chiamata [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist), viene generato un errore. Questa è una no-op se `object` è un valore primitivo.

In particolare, questo ha senso per gli oggetti che possono essere clonati, piuttosto che trasferiti, e che sono utilizzati da altri oggetti sul lato mittente. Ad esempio, Node.js contrassegna gli `ArrayBuffer` che utilizza per il suo [`Buffer` pool](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) con questo.

Questa operazione non può essere annullata.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // Questo genererà un errore, perché pooledBuffer non è trasferibile.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// La seguente riga stampa il contenuto di typedArray1 -- possiede ancora
// la sua memoria e non è stato trasferito. Senza
// `markAsUntransferable()`, questo stamperebbe un Uint8Array vuoto e la
// chiamata postMessage sarebbe andata a buon fine.
// Anche typedArray2 è intatto.
console.log(typedArray1);
console.log(typedArray2);
```
Non esiste un equivalente di questa API nei browser.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Aggiunto in: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se un oggetto è contrassegnato come non trasferibile con [`markAsUntransferable()`](/it/nodejs/api/worker_threads#workermarkasuntransferableobject).

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Restituisce true.
```
Non esiste un equivalente a questa API nei browser.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Aggiunto in: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript arbitrario.

Contrassegna un oggetto come non clonabile. Se `object` viene utilizzato come [`message`](/it/nodejs/api/worker_threads#event-message) in una chiamata a [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist), viene generato un errore. Questa è un'operazione no-op se `object` è un valore primitivo.

Questo non ha alcun effetto su `ArrayBuffer` o su qualsiasi oggetto simile a `Buffer`.

Questa operazione non può essere annullata.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // Questo genererà un errore, perché anyObject non è clonabile.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
Non esiste un equivalente a questa API nei browser.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Aggiunto in: v11.13.0**

-  `port` [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport) La porta del messaggio da trasferire.
-  `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) come restituito dal metodo `vm.createContext()`.
-  Restituisce: [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport)

Trasferisce una `MessagePort` a un [`vm`](/it/nodejs/api/vm) Context diverso. L'oggetto `port` originale viene reso inutilizzabile e l'istanza `MessagePort` restituita prende il suo posto.

La `MessagePort` restituita è un oggetto nel contesto di destinazione ed eredita dalla sua classe globale `Object`. Gli oggetti passati al listener [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) vengono anch'essi creati nel contesto di destinazione ed ereditano dalla sua classe globale `Object`.

Tuttavia, la `MessagePort` creata non eredita più da [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) e solo [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) può essere utilizzata per ricevere eventi utilizzando essa.


## `worker.parentPort` {#workerparentport}

**Aggiunto in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport)

Se questo thread è un [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo è un [`MessagePort`](/it/nodejs/api/worker_threads#class-messageport) che consente la comunicazione con il thread padre. I messaggi inviati usando `parentPort.postMessage()` sono disponibili nel thread padre usando `worker.on('message')` e i messaggi inviati dal thread padre usando `worker.postMessage()` sono disponibili in questo thread usando `parentPort.on('message')`.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Stampa 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // Quando viene ricevuto un messaggio dal thread padre, lo rimanda indietro:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del thread di destinazione. Se l'ID del thread non è valido, verrà generato un errore [`ERR_WORKER_MESSAGING_FAILED`](/it/nodejs/api/errors#err_worker_messaging_failed). Se l'ID del thread di destinazione è l'ID del thread corrente, verrà generato un errore [`ERR_WORKER_MESSAGING_SAME_THREAD`](/it/nodejs/api/errors#err_worker_messaging_same_thread).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore da inviare.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se uno o più oggetti simili a `MessagePort` vengono passati in `value`, è necessario un `transferList` per tali elementi oppure viene generato [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/it/nodejs/api/errors#err_missing_message_port_in_transfer_list). Vedere [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist) per maggiori informazioni.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tempo di attesa in millisecondi per la consegna del messaggio. Per impostazione predefinita è `undefined`, il che significa attendere per sempre. Se l'operazione scade, viene generato un errore [`ERR_WORKER_MESSAGING_TIMEOUT`](/it/nodejs/api/errors#err_worker_messaging_timeout).
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Una promise che viene risolta se il messaggio è stato elaborato correttamente dal thread di destinazione.

Invia un valore a un altro worker, identificato dal suo ID thread.

Se il thread di destinazione non ha alcun listener per l'evento `workerMessage`, l'operazione genererà un errore [`ERR_WORKER_MESSAGING_FAILED`](/it/nodejs/api/errors#err_worker_messaging_failed).

Se il thread di destinazione ha generato un errore durante l'elaborazione dell'evento `workerMessage`, l'operazione genererà un errore [`ERR_WORKER_MESSAGING_ERRORED`](/it/nodejs/api/errors#err_worker_messaging_errored).

Questo metodo deve essere utilizzato quando il thread di destinazione non è il genitore o il figlio diretto del thread corrente. Se i due thread sono padre-figlio, utilizzare [`require('node:worker_threads').parentPort.postMessage()`](/it/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) e [`worker.postMessage()`](/it/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) per consentire ai thread di comunicare.

L'esempio seguente mostra l'uso di `postMessageToThread`: crea 10 thread nidificati, l'ultimo dei quali tenterà di comunicare con il thread principale.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.12.0 | L'argomento port può anche fare riferimento ora a un `BroadcastChannel`. |
| v12.3.0 | Aggiunto in: v12.3.0 |
:::

-  `port` [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/it/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) 
-  Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 

Riceve un singolo messaggio da una data `MessagePort`. Se nessun messaggio è disponibile, viene restituito `undefined`, altrimenti un oggetto con una singola proprietà `message` che contiene il payload del messaggio, corrispondente al messaggio più vecchio nella coda della `MessagePort`.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Stampa: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Stampa: undefined
```
Quando viene utilizzata questa funzione, nessun evento `'message'` viene emesso e il listener `onmessage` non viene invocato.

## `worker.resourceLimits` {#workerresourcelimits}

**Aggiunto in: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Fornisce l'insieme di vincoli delle risorse del motore JS all'interno di questo thread Worker. Se l'opzione `resourceLimits` è stata passata al costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo corrisponde ai suoi valori.

Se questo viene utilizzato nel thread principale, il suo valore è un oggetto vuoto.


## `worker.SHARE_ENV` {#workershare_env}

**Aggiunto in: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Un valore speciale che può essere passato come opzione `env` del costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker), per indicare che il thread corrente e il thread Worker devono condividere l'accesso in lettura e scrittura allo stesso insieme di variabili d'ambiente.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Stampa 'foo'.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.5.0, v16.15.0 | Non più sperimentale. |
| v15.12.0, v14.18.0 | Aggiunto in: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript arbitrario e clonabile che può essere utilizzato come chiave [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript arbitrario e clonabile che verrà clonato e passato automaticamente a tutte le nuove istanze `Worker`. Se `value` viene passato come `undefined`, qualsiasi valore impostato precedentemente per la `key` verrà eliminato.

L'API `worker.setEnvironmentData()` imposta il contenuto di `worker.getEnvironmentData()` nel thread corrente e in tutte le nuove istanze `Worker` generate dal contesto corrente.

## `worker.threadId` {#workerthreadid}

**Aggiunto in: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un identificatore intero per il thread corrente. Sull'oggetto worker corrispondente (se presente), è disponibile come [`worker.threadId`](/it/nodejs/api/worker_threads#workerthreadid_1). Questo valore è univoco per ciascuna istanza [`Worker`](/it/nodejs/api/worker_threads#class-worker) all'interno di un singolo processo.


## `worker.workerData` {#workerworkerdata}

**Aggiunto in: v10.5.0**

Un valore JavaScript arbitrario che contiene un clone dei dati passati al costruttore `Worker` di questo thread.

I dati vengono clonati come se si utilizzasse [`postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist), secondo l'[algoritmo di clonazione strutturata HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Stampa 'Hello, world!'.
}
```
## Classe: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Non più sperimentale. |
| v15.4.0 | Aggiunto in: v15.4.0 |
:::

Le istanze di `BroadcastChannel` consentono la comunicazione asincrona uno-a-molti con tutte le altre istanze di `BroadcastChannel` associate allo stesso nome di canale.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Aggiunto in: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il nome del canale a cui connettersi. È consentito qualsiasi valore JavaScript che può essere convertito in una stringa usando ``${name}``.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Aggiunto in: v15.4.0**

Chiude la connessione `BroadcastChannel`.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Aggiunto in: v15.4.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocato con un singolo argomento `MessageEvent` quando viene ricevuto un messaggio.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**Aggiunto in: v15.4.0**

- Tipo: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocata quando un messaggio ricevuto non può essere deserializzato.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**Aggiunto in: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript clonabile.

### `broadcastChannel.ref()` {#broadcastchannelref}

**Aggiunto in: v15.4.0**

Opposto di `unref()`. Chiamare `ref()` su un BroadcastChannel precedentemente `unref()`ed *non* permette al programma di terminare se è l'unico handle attivo rimasto (il comportamento predefinito). Se la porta è `ref()`ed, chiamare `ref()` di nuovo non ha alcun effetto.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**Aggiunto in: v15.4.0**

Chiamare `unref()` su un BroadcastChannel permette al thread di terminare se questo è l'unico handle attivo nel sistema di eventi. Se il BroadcastChannel è già `unref()`ed, chiamare `unref()` di nuovo non ha alcun effetto.

## Classe: `MessageChannel` {#class-messagechannel}

**Aggiunto in: v10.5.0**

Le istanze della classe `worker.MessageChannel` rappresentano un canale di comunicazione asincrono a due vie. `MessageChannel` non ha metodi propri. `new MessageChannel()` restituisce un oggetto con proprietà `port1` e `port2`, che si riferiscono a istanze [`MessagePort`](/it/nodejs/api/worker_threads#class-messageport) collegate.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('ricevuto', message));
port2.postMessage({ foo: 'bar' });
// Stampa: ricevuto { foo: 'bar' } dall'ascoltatore `port1.on('message')`
```
## Classe: `MessagePort` {#class-messageport}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.7.0 | Questa classe ora eredita da `EventTarget` anziché da `EventEmitter`. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

- Estende: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget)

Le istanze della classe `worker.MessagePort` rappresentano un'estremità di un canale di comunicazione asincrono a due vie. Può essere utilizzato per trasferire dati strutturati, regioni di memoria e altri `MessagePort` tra diversi [`Worker`](/it/nodejs/api/worker_threads#class-worker)s.

Questa implementazione corrisponde a [`MessagePort` del browser](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort).


### Evento: `'close'` {#event-close}

**Aggiunto in: v10.5.0**

L'evento `'close'` viene emesso quando uno dei due lati del canale è stato disconnesso.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Stampa:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### Evento: `'message'` {#event-message}

**Aggiunto in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore trasmesso

L'evento `'message'` viene emesso per ogni messaggio in arrivo, contenente l'input clonato di [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist).

I listener su questo evento ricevono un clone del parametro `value` come passato a `postMessage()` e nessun altro argomento.

### Evento: `'messageerror'` {#event-messageerror}

**Aggiunto in: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un oggetto Error

L'evento `'messageerror'` viene emesso quando la deserializzazione di un messaggio non è riuscita.

Attualmente, questo evento viene emesso quando si verifica un errore durante la creazione di un'istanza dell'oggetto JS inviato all'estremità ricevente. Tali situazioni sono rare, ma possono verificarsi, ad esempio, quando determinati oggetti API di Node.js vengono ricevuti in un `vm.Context` (dove le API di Node.js non sono attualmente disponibili).

### `port.close()` {#portclose}

**Aggiunto in: v10.5.0**

Disabilita l'ulteriore invio di messaggi su entrambi i lati della connessione. Questo metodo può essere chiamato quando non si verificherà un'ulteriore comunicazione su questa `MessagePort`.

L'[`evento 'close'`](/it/nodejs/api/worker_threads#event-close) viene emesso su entrambe le istanze `MessagePort` che fanno parte del canale.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Viene generato un errore quando un oggetto non trasferibile si trova nell'elenco di trasferimento. |
| v15.6.0 | Aggiunto `X509Certificate` all'elenco dei tipi clonabili. |
| v15.0.0 | Aggiunto `CryptoKey` all'elenco dei tipi clonabili. |
| v15.14.0, v14.18.0 | Aggiunto 'BlockList' all'elenco dei tipi clonabili. |
| v15.9.0, v14.18.0 | Aggiunto tipi 'Histogram' all'elenco dei tipi clonabili. |
| v14.5.0, v12.19.0 | Aggiunto `KeyObject` all'elenco dei tipi clonabili. |
| v14.5.0, v12.19.0 | Aggiunto `FileHandle` all'elenco dei tipi trasferibili. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Invia un valore JavaScript al lato ricevente di questo canale. `value` viene trasferito in un modo compatibile con l'[algoritmo di clonazione strutturata HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

In particolare, le differenze significative rispetto a `JSON` sono:

- `value` può contenere riferimenti circolari.
- `value` può contenere istanze di tipi JS integrati come `RegExp`, `BigInt`, `Map`, `Set`, ecc.
- `value` può contenere array tipizzati, utilizzando sia `ArrayBuffer` che `SharedArrayBuffer`.
- `value` può contenere istanze di [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module).
- `value` non può contenere oggetti nativi (supportati da C++) diversi da:
    - [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey),
    - [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle),
    - [\<Histogram\>](/it/nodejs/api/perf_hooks#class-histogram),
    - [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject),
    - [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport),
    - [\<net.BlockList\>](/it/nodejs/api/net#class-netblocklist),
    - [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress),
    - [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate).

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Prints: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` può essere un elenco di oggetti [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`MessagePort`](/it/nodejs/api/worker_threads#class-messageport) e [`FileHandle`](/it/nodejs/api/fs#class-filehandle). Dopo il trasferimento, non sono più utilizzabili sul lato mittente del canale (anche se non sono contenuti in `value`). A differenza dei [processi figlio](/it/nodejs/api/child_process), il trasferimento di handle come i socket di rete non è attualmente supportato.

Se `value` contiene istanze di [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), queste sono accessibili da entrambi i thread. Non possono essere elencati in `transferList`.

`value` può ancora contenere istanze di `ArrayBuffer` che non sono in `transferList`; in tal caso, la memoria sottostante viene copiata anziché spostata.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// Questo invia una copia di `uint8Array`:
port2.postMessage(uint8Array);
// Questo non copia i dati, ma rende `uint8Array` inutilizzabile:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// La memoria per `sharedUint8Array` è accessibile sia dall'originale
// che dalla copia ricevuta da `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// Questo trasferisce una message port appena creata al ricevitore.
// Questo può essere utilizzato, ad esempio, per creare canali di comunicazione tra
// più thread `Worker` che sono figli dello stesso thread padre.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
L'oggetto messaggio viene clonato immediatamente e può essere modificato dopo la pubblicazione senza avere effetti collaterali.

Per ulteriori informazioni sui meccanismi di serializzazione e deserializzazione alla base di questa API, consulta l'[API di serializzazione del modulo `node:v8`](/it/nodejs/api/v8#serialization-api).


#### Considerazioni durante il trasferimento di TypedArray e Buffer {#considerations-when-transferring-typedarrays-and-buffers}

Tutte le istanze `TypedArray` e `Buffer` sono viste su un `ArrayBuffer` sottostante. Cioè, è l'`ArrayBuffer` che effettivamente memorizza i dati grezzi mentre gli oggetti `TypedArray` e `Buffer` forniscono un modo per visualizzare e manipolare i dati. È possibile e comune creare più viste sulla stessa istanza `ArrayBuffer`. È necessario prestare molta attenzione quando si utilizza un elenco di trasferimento per trasferire un `ArrayBuffer` poiché ciò rende inutilizzabili tutte le istanze `TypedArray` e `Buffer` che condividono lo stesso `ArrayBuffer`.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // stampa 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // stampa 0
```
Per le istanze `Buffer`, in particolare, se l'`ArrayBuffer` sottostante può essere trasferito o clonato dipende interamente da come sono state create le istanze, il che spesso non può essere determinato in modo affidabile.

Un `ArrayBuffer` può essere contrassegnato con [`markAsUntransferable()`](/it/nodejs/api/worker_threads#workermarkasuntransferableobject) per indicare che dovrebbe sempre essere clonato e mai trasferito.

A seconda di come è stata creata un'istanza `Buffer`, potrebbe o meno possedere il suo `ArrayBuffer` sottostante. Un `ArrayBuffer` non deve essere trasferito a meno che non sia noto che l'istanza `Buffer` lo possiede. In particolare, per i `Buffer` creati dal pool `Buffer` interno (utilizzando, ad esempio, `Buffer.from()` o `Buffer.allocUnsafe()`), il loro trasferimento non è possibile e vengono sempre clonati, il che invia una copia dell'intero pool `Buffer`. Questo comportamento può comportare un utilizzo di memoria più elevato non intenzionale e possibili problemi di sicurezza.

Vedere [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) per maggiori dettagli sul pooling di `Buffer`.

Gli `ArrayBuffer` per le istanze `Buffer` create utilizzando `Buffer.alloc()` o `Buffer.allocUnsafeSlow()` possono sempre essere trasferiti, ma ciò rende inutilizzabili tutte le altre viste esistenti di tali `ArrayBuffer`.


#### Considerazioni durante la clonazione di oggetti con prototipi, classi e accessorie {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

Poiché la clonazione di oggetti utilizza l'[algoritmo di clonazione strutturata HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), le proprietà non enumerabili, le accessorie di proprietà e i prototipi di oggetti non vengono preservati. In particolare, gli oggetti [`Buffer`](/it/nodejs/api/buffer) verranno letti come semplici [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) sul lato ricevente e le istanze di classi JavaScript verranno clonate come semplici oggetti JavaScript.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
Questa limitazione si estende a molti oggetti integrati, come l'oggetto globale `URL`:

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**Aggiunto in: v18.1.0, v16.17.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se vero, l'oggetto `MessagePort` manterrà attivo il ciclo di eventi di Node.js.

### `port.ref()` {#portref}

**Aggiunto in: v10.5.0**

Opposto di `unref()`. Chiamare `ref()` su una porta precedentemente `unref()`ed *non* consente al programma di uscire se è l'unico handle attivo rimasto (il comportamento predefinito). Se la porta è `ref()`ed, chiamare di nuovo `ref()` non ha alcun effetto.

Se i listener vengono allegati o rimossi utilizzando `.on('message')`, la porta viene `ref()`ed e `unref()`ed automaticamente a seconda che esistano listener per l'evento.


### `port.start()` {#portstart}

**Aggiunto in: v10.5.0**

Inizia a ricevere messaggi su questa `MessagePort`. Quando si utilizza questa porta come un emettitore di eventi, questo metodo viene chiamato automaticamente una volta che i listener `'message'` sono collegati.

Questo metodo esiste per parità con l'API Web `MessagePort`. In Node.js, è utile solo per ignorare i messaggi quando non è presente alcun listener di eventi. Node.js diverge anche nella sua gestione di `.onmessage`. Impostandolo chiama automaticamente `.start()`, ma disattivandolo permette ai messaggi di mettersi in coda fino a quando non viene impostato un nuovo gestore o la porta viene scartata.

### `port.unref()` {#portunref}

**Aggiunto in: v10.5.0**

Chiamare `unref()` su una porta permette al thread di terminare se questo è l'unico handle attivo nel sistema di eventi. Se la porta è già `unref()`ed chiamare `unref()` di nuovo non ha alcun effetto.

Se i listener sono collegati o rimossi usando `.on('message')`, la porta è `ref()`ed e `unref()`ed automaticamente a seconda che i listener per l'evento esistano.

## Classe: `Worker` {#class-worker}

**Aggiunto in: v10.5.0**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

La classe `Worker` rappresenta un thread di esecuzione JavaScript indipendente. La maggior parte delle API di Node.js sono disponibili al suo interno.

Le differenze notevoli all'interno di un ambiente Worker sono:

- Gli stream [`process.stdin`](/it/nodejs/api/process#processstdin), [`process.stdout`](/it/nodejs/api/process#processstdout) e [`process.stderr`](/it/nodejs/api/process#processstderr) possono essere reindirizzati dal thread padre.
- La proprietà [`require('node:worker_threads').isMainThread`](/it/nodejs/api/worker_threads#workerismainthread) è impostata su `false`.
- La porta dei messaggi [`require('node:worker_threads').parentPort`](/it/nodejs/api/worker_threads#workerparentport) è disponibile.
- [`process.exit()`](/it/nodejs/api/process#processexitcode) non ferma l'intero programma, solo il singolo thread, e [`process.abort()`](/it/nodejs/api/process#processabort) non è disponibile.
- [`process.chdir()`](/it/nodejs/api/process#processchdirdirectory) e i metodi `process` che impostano ID di gruppo o utente non sono disponibili.
- [`process.env`](/it/nodejs/api/process#processenv) è una copia delle variabili d'ambiente del thread padre, a meno che non sia specificato diversamente. Le modifiche a una copia non sono visibili in altri thread e non sono visibili ai componenti aggiuntivi nativi (a meno che [`worker.SHARE_ENV`](/it/nodejs/api/worker_threads#workershare_env) non venga passato come opzione `env` al costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker)). Su Windows, a differenza del thread principale, una copia delle variabili d'ambiente opera in modo case-sensitive.
- [`process.title`](/it/nodejs/api/process#processtitle) non può essere modificato.
- I segnali non vengono inviati tramite [`process.on('...')`](/it/nodejs/api/process#signal-events).
- L'esecuzione può fermarsi in qualsiasi momento a seguito dell'invocazione di [`worker.terminate()`](/it/nodejs/api/worker_threads#workerterminate).
- I canali IPC dai processi padre non sono accessibili.
- Il modulo [`trace_events`](/it/nodejs/api/tracing) non è supportato.
- I componenti aggiuntivi nativi possono essere caricati da più thread solo se soddisfano [determinate condizioni](/it/nodejs/api/addons#worker-support).

È possibile creare istanze `Worker` all'interno di altri `Worker`.

Come i [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) e il modulo [`node:cluster`](/it/nodejs/api/cluster), la comunicazione bidirezionale può essere ottenuta tramite il passaggio di messaggi tra thread. Internamente, un `Worker` ha una coppia incorporata di [`MessagePort`](/it/nodejs/api/worker_threads#class-messageport) che sono già associate l'una all'altra quando viene creato il `Worker`. Mentre l'oggetto `MessagePort` sul lato padre non è direttamente esposto, le sue funzionalità sono esposte tramite [`worker.postMessage()`](/it/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) e l'evento [`worker.on('message')`](/it/nodejs/api/worker_threads#event-message_1) sull'oggetto `Worker` per il thread padre.

Per creare canali di messaggistica personalizzati (che è incoraggiato rispetto all'utilizzo del canale globale predefinito perché facilita la separazione delle preoccupazioni), gli utenti possono creare un oggetto `MessageChannel` su uno dei due thread e passare una delle `MessagePort` su quel `MessageChannel` all'altro thread attraverso un canale preesistente, come quello globale.

Vedere [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist) per maggiori informazioni su come i messaggi vengono passati e che tipo di valori JavaScript possono essere trasportati con successo attraverso la barriera del thread.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.8.0, v18.16.0 | Aggiunto il supporto per un'opzione `name`, che consente di aggiungere un nome al titolo del worker per il debug. |
| v14.9.0 | Il parametro `filename` può essere un oggetto `URL` WHATWG che utilizza il protocollo `data:`. |
| v14.9.0 | L'opzione `trackUnmanagedFds` è stata impostata su `true` per impostazione predefinita. |
| v14.6.0, v12.19.0 | È stata introdotta l'opzione `trackUnmanagedFds`. |
| v13.13.0, v12.17.0 | È stata introdotta l'opzione `transferList`. |
| v13.12.0, v12.17.0 | Il parametro `filename` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v13.4.0, v12.16.0 | È stata introdotta l'opzione `argv`. |
| v13.2.0, v12.16.0 | È stata introdotta l'opzione `resourceLimits`. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Il percorso dello script principale o del modulo del Worker. Deve essere un percorso assoluto o un percorso relativo (ovvero, relativo alla directory di lavoro corrente) che inizia con `./` o `../`, oppure un oggetto `URL` WHATWG che utilizza il protocollo `file:` o `data:`. Quando si utilizza un [`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), i dati vengono interpretati in base al tipo MIME utilizzando il [caricatore di moduli ECMAScript](/it/nodejs/api/esm#data-imports). Se `options.eval` è `true`, questo è una stringa contenente codice JavaScript anziché un percorso.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Elenco di argomenti che verrebbero convertiti in stringa e aggiunti a `process.argv` nel worker. Questo è per lo più simile a `workerData`, ma i valori sono disponibili su `process.argv` globale come se fossero stati passati come opzioni CLI allo script.
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se impostato, specifica il valore iniziale di `process.env` all'interno del thread Worker. Come valore speciale, è possibile utilizzare [`worker.SHARE_ENV`](/it/nodejs/api/worker_threads#workershare_env) per specificare che il thread padre e il thread figlio devono condividere le loro variabili di ambiente; in tal caso, le modifiche all'oggetto `process.env` di un thread influiscono anche sull'altro thread. **Predefinito:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true` e il primo argomento è una `stringa`, interpreta il primo argomento del costruttore come uno script che viene eseguito una volta che il worker è online.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco delle opzioni CLI di node passate al worker. Le opzioni V8 (come `--max-old-space-size`) e le opzioni che influiscono sul processo (come `--title`) non sono supportate. Se impostato, questo viene fornito come [`process.execArgv`](/it/nodejs/api/process#processexecargv) all'interno del worker. Per impostazione predefinita, le opzioni vengono ereditate dal thread padre.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se questo è impostato su `true`, allora `worker.stdin` fornisce un flusso scrivibile il cui contenuto appare come `process.stdin` all'interno del Worker. Per impostazione predefinita, non vengono forniti dati.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se questo è impostato su `true`, allora `worker.stdout` non viene automaticamente inviato tramite pipe a `process.stdout` nel padre.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se questo è impostato su `true`, allora `worker.stderr` non viene automaticamente inviato tramite pipe a `process.stderr` nel padre.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript che viene clonato e reso disponibile come [`require('node:worker_threads').workerData`](/it/nodejs/api/worker_threads#workerworkerdata). La clonazione avviene come descritto nell'[algoritmo di clonazione strutturata HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), e viene generato un errore se l'oggetto non può essere clonato (ad esempio, perché contiene `function`).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se questo è impostato su `true`, allora il Worker tiene traccia dei descrittori di file raw gestiti tramite [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) e [`fs.close()`](/it/nodejs/api/fs#fsclosefd-callback), e li chiude quando il Worker esce, in modo simile ad altre risorse come i socket di rete o i descrittori di file gestiti tramite l'API [`FileHandle`](/it/nodejs/api/fs#class-filehandle). Questa opzione viene ereditata automaticamente da tutti i `Worker` nidificati. **Predefinito:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se uno o più oggetti simili a `MessagePort` vengono passati in `workerData`, è richiesto un `transferList` per quegli elementi oppure viene generato [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/it/nodejs/api/errors#err_missing_message_port_in_transfer_list). Vedi [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist) per maggiori informazioni.
    - `resourceLimits` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un insieme opzionale di limiti di risorse per la nuova istanza del motore JS. Il raggiungimento di questi limiti porta alla terminazione dell'istanza `Worker`. Questi limiti influiscono solo sul motore JS e su nessun dato esterno, inclusi gli `ArrayBuffer`. Anche se questi limiti sono impostati, il processo potrebbe comunque interrompersi se si verifica una situazione globale di esaurimento della memoria.
    - `maxOldGenerationSizeMb` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima dell'heap principale in MB. Se l'argomento della riga di comando [`--max-old-space-size`](/it/nodejs/api/cli#--max-old-space-sizesize-in-mib) è impostato, sovrascrive questa impostazione.
    - `maxYoungGenerationSizeMb` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima di uno spazio heap per oggetti creati di recente. Se l'argomento della riga di comando [`--max-semi-space-size`](/it/nodejs/api/cli#--max-semi-space-sizesize-in-mib) è impostato, sovrascrive questa impostazione.
    - `codeRangeSizeMb` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione di un intervallo di memoria pre-allocato utilizzato per il codice generato.
    - `stackSizeMb` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima predefinita dello stack per il thread. Valori piccoli possono portare a istanze Worker inutilizzabili. **Predefinito:** `4`.

    - `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un `name` opzionale da aggiungere al titolo del worker per scopi di debug/identificazione, rendendo il titolo finale come `[worker ${id}] ${name}`. **Predefinito:** `''`.


### Evento: `'error'` {#event-error}

**Aggiunto in: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'evento `'error'` viene emesso se il thread worker genera un'eccezione non catturata. In tal caso, il worker viene terminato.

### Evento: `'exit'` {#event-exit}

**Aggiunto in: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'evento `'exit'` viene emesso una volta che il worker si è fermato. Se il worker è uscito chiamando [`process.exit()`](/it/nodejs/api/process#processexitcode), il parametro `exitCode` è il codice di uscita passato. Se il worker è stato terminato, il parametro `exitCode` è `1`.

Questo è l'evento finale emesso da qualsiasi istanza `Worker`.

### Evento: `'message'` {#event-message_1}

**Aggiunto in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore trasmesso

L'evento `'message'` viene emesso quando il thread worker ha invocato [`require('node:worker_threads').parentPort.postMessage()`](/it/nodejs/api/worker_threads#workerpostmessagevalue-transferlist). Vedi l'evento [`port.on('message')`](/it/nodejs/api/worker_threads#event-message) per maggiori dettagli.

Tutti i messaggi inviati dal thread worker vengono emessi prima che l'[`'exit'` event](/it/nodejs/api/worker_threads#event-exit) venga emesso sull'oggetto `Worker`.

### Evento: `'messageerror'` {#event-messageerror_1}

**Aggiunto in: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un oggetto Error

L'evento `'messageerror'` viene emesso quando la deserializzazione di un messaggio non è andata a buon fine.

### Evento: `'online'` {#event-online}

**Aggiunto in: v10.5.0**

L'evento `'online'` viene emesso quando il thread worker ha iniziato a eseguire codice JavaScript.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.1.0 | Supporto delle opzioni per configurare lo snapshot dell'heap. |
| v13.9.0, v12.17.0 | Aggiunto in: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se vero, espone gli interni nello snapshot dell'heap. **Predefinito:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se vero, espone i valori numerici in campi artificiali. **Predefinito:** `false`.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Una promise per uno Stream leggibile contenente uno snapshot dell'heap V8

Restituisce uno stream leggibile per uno snapshot V8 dello stato corrente del Worker. Vedere [`v8.getHeapSnapshot()`](/it/nodejs/api/v8#v8getheapsnapshotoptions) per maggiori dettagli.

Se il thread Worker non è più in esecuzione, il che può verificarsi prima che l'evento [`'exit'` event](/it/nodejs/api/worker_threads#event-exit) venga emesso, la `Promise` restituita viene rifiutata immediatamente con un errore [`ERR_WORKER_NOT_RUNNING`](/it/nodejs/api/errors#err_worker_not_running).


### `worker.performance` {#workerperformance}

**Aggiunto in: v15.1.0, v14.17.0, v12.22.0**

Un oggetto che può essere utilizzato per interrogare le informazioni sulle prestazioni da un'istanza di worker. Simile a [`perf_hooks.performance`](/it/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Aggiunto in: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il risultato di una precedente chiamata a `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il risultato di una precedente chiamata a `eventLoopUtilization()` prima di `utilization1`.
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

La stessa chiamata di [`perf_hooks` `eventLoopUtilization()`](/it/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2), tranne per il fatto che vengono restituiti i valori dell'istanza del worker.

Una differenza è che, a differenza del thread principale, il bootstrapping all'interno di un worker viene eseguito all'interno del ciclo di eventi. Quindi l'utilizzo del ciclo di eventi è immediatamente disponibile una volta che lo script del worker inizia l'esecuzione.

Un tempo `idle` che non aumenta non indica che il worker è bloccato nel bootstrap. I seguenti esempi mostrano come l'intera durata del worker non accumuli mai alcun tempo `idle`, ma sia comunque in grado di elaborare i messaggi.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
L'utilizzo del ciclo di eventi di un worker è disponibile solo dopo l'emissione dell'evento [`'online'` event](/it/nodejs/api/worker_threads#event-online) e, se chiamato prima di questo, o dopo l'evento [`'exit'` event](/it/nodejs/api/worker_threads#event-exit), tutte le proprietà hanno il valore di `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Aggiunto in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Invia un messaggio al worker che viene ricevuto tramite [`require('node:worker_threads').parentPort.on('message')`](/it/nodejs/api/worker_threads#event-message). Vedi [`port.postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist) per maggiori dettagli.

### `worker.ref()` {#workerref}

**Aggiunto in: v10.5.0**

L'opposto di `unref()`, chiamare `ref()` su un worker precedentemente `unref()`ed *non* permette al programma di uscire se è l'unico handle attivo rimasto (il comportamento predefinito). Se il worker è `ref()`ed, chiamare `ref()` di nuovo non ha alcun effetto.

### `worker.resourceLimits` {#workerresourcelimits_1}

**Aggiunto in: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Fornisce l'insieme dei vincoli delle risorse del motore JS per questo thread Worker. Se l'opzione `resourceLimits` è stata passata al costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo corrisponde ai suoi valori.

Se il worker si è fermato, il valore di ritorno è un oggetto vuoto.

### `worker.stderr` {#workerstderr}

**Aggiunto in: v10.5.0**

- [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)

Questo è un flusso leggibile che contiene i dati scritti in [`process.stderr`](/it/nodejs/api/process#processstderr) all'interno del thread worker. Se `stderr: true` non è stato passato al costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker), allora i dati vengono indirizzati al flusso [`process.stderr`](/it/nodejs/api/process#processstderr) del thread principale.


### `worker.stdin` {#workerstdin}

**Aggiunto in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)

Se è stato passato `stdin: true` al costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker), questo è un flusso scrivibile. I dati scritti in questo flusso saranno resi disponibili nel thread worker come [`process.stdin`](/it/nodejs/api/process#processstdin).

### `worker.stdout` {#workerstdout}

**Aggiunto in: v10.5.0**

- [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)

Questo è un flusso leggibile che contiene i dati scritti in [`process.stdout`](/it/nodejs/api/process#processstdout) all'interno del thread worker. Se `stdout: true` non è stato passato al costruttore [`Worker`](/it/nodejs/api/worker_threads#class-worker), allora i dati vengono indirizzati al flusso [`process.stdout`](/it/nodejs/api/process#processstdout) del thread padre.

### `worker.terminate()` {#workerterminate}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.5.0 | Questa funzione ora restituisce una Promise. Passare un callback è deprecato ed è stato inutile fino a questa versione, poiché il Worker veniva effettivamente terminato in modo sincrono. La terminazione è ora un'operazione completamente asincrona. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Interrompe l'esecuzione di tutti i JavaScript nel thread worker il prima possibile. Restituisce una Promise per il codice di uscita che viene soddisfatta quando viene emesso l' [`'exit'` event](/it/nodejs/api/worker_threads#event-exit).

### `worker.threadId` {#workerthreadid_1}

**Aggiunto in: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un identificatore intero per il thread referenziato. All'interno del thread worker, è disponibile come [`require('node:worker_threads').threadId`](/it/nodejs/api/worker_threads#workerthreadid). Questo valore è univoco per ogni istanza `Worker` all'interno di un singolo processo.

### `worker.unref()` {#workerunref}

**Aggiunto in: v10.5.0**

Chiamare `unref()` su un worker consente al thread di uscire se questo è l'unico handle attivo nel sistema di eventi. Se il worker è già `unref()`ed chiamare `unref()` di nuovo non ha effetto.


## Note {#notes}

### Blocco sincrono di stdio {#synchronous-blocking-of-stdio}

I `Worker` utilizzano il passaggio di messaggi tramite [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport) per implementare le interazioni con `stdio`. Ciò significa che l'output `stdio` proveniente da un `Worker` può essere bloccato da codice sincrono all'estremità ricevente che sta bloccando l'event loop di Node.js.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Ciclo per simulare il lavoro.
  }
} else {
  // Questo output sarà bloccato dal ciclo for nel thread principale.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Ciclo per simulare il lavoro.
  }
} else {
  // Questo output sarà bloccato dal ciclo for nel thread principale.
  console.log('foo');
}
```
:::

### Avvio di thread worker da script di precaricamento {#launching-worker-threads-from-preload-scripts}

Prestare attenzione quando si avviano thread worker da script di precaricamento (script caricati ed eseguiti utilizzando il flag della riga di comando `-r`). A meno che l'opzione `execArgv` non sia impostata esplicitamente, i nuovi thread Worker ereditano automaticamente i flag della riga di comando dal processo in esecuzione e precaricheranno gli stessi script di precaricamento del thread principale. Se lo script di precaricamento avvia incondizionatamente un thread worker, ogni thread generato ne genererà un altro fino a quando l'applicazione non si arresta in modo anomalo.

