---
title: Documentazione del Modulo Inspector di Node.js
description: Il modulo Inspector di Node.js fornisce un'API per interagire con l'ispettore V8, permettendo agli sviluppatori di debuggare applicazioni Node.js collegandosi al protocollo dell'ispettore.
head:
  - - meta
    - name: og:title
      content: Documentazione del Modulo Inspector di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Inspector di Node.js fornisce un'API per interagire con l'ispettore V8, permettendo agli sviluppatori di debuggare applicazioni Node.js collegandosi al protocollo dell'ispettore.
  - - meta
    - name: twitter:title
      content: Documentazione del Modulo Inspector di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Inspector di Node.js fornisce un'API per interagire con l'ispettore V8, permettendo agli sviluppatori di debuggare applicazioni Node.js collegandosi al protocollo dell'ispettore.
---


# Inspector {#inspector}

::: tip [Stable: 2 - Stabile]
[Stable: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

Il modulo `node:inspector` fornisce un'API per interagire con l'inspector V8.

È accessibile tramite:

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

oppure

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## API Promises {#promises-api}

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

**Aggiunto in: v19.0.0**

### Classe: `inspector.Session` {#class-inspectorsession}

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

La `inspector.Session` viene utilizzata per inviare messaggi al back-end dell'inspector V8 e ricevere risposte e notifiche ai messaggi.

#### `new inspector.Session()` {#new-inspectorsession}

**Aggiunto in: v8.0.0**

Crea una nuova istanza della classe `inspector.Session`. La sessione dell'inspector deve essere connessa tramite [`session.connect()`](/it/nodejs/api/inspector#sessionconnect) prima che i messaggi possano essere inviati al back-end dell'inspector.

Quando si utilizza `Session`, l'oggetto emesso dall'API console non verrà rilasciato, a meno che non venga eseguito manualmente il comando `Runtime.DiscardConsoleEntries`.

#### Evento: `'inspectorNotification'` {#event-inspectornotification}

**Aggiunto in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto del messaggio di notifica

Emesso quando viene ricevuta una notifica dall'Inspector V8.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
È anche possibile sottoscrivere solo le notifiche con un metodo specifico:


#### Evento: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**Aggiunto in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto del messaggio di notifica

Emesso quando viene ricevuta una notifica dell'inspector il cui campo method è impostato sul valore `\<inspector-protocol-method\>`.

Il seguente snippet installa un listener sull'evento [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) e stampa il motivo della sospensione del programma ogni volta che l'esecuzione del programma viene sospesa (ad esempio, tramite punti di interruzione):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**Aggiunto in: v8.0.0**

Connette una sessione al back-end dell'inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**Aggiunto in: v12.11.0**

Connette una sessione al back-end dell'inspector del thread principale. Verrà generata un'eccezione se questa API non è stata chiamata su un thread Worker.

#### `session.disconnect()` {#sessiondisconnect}

**Aggiunto in: v8.0.0**

Chiude immediatamente la sessione. Tutti i callback dei messaggi in sospeso verranno chiamati con un errore. [`session.connect()`](/it/nodejs/api/inspector#sessionconnect) dovrà essere chiamato per poter inviare nuovamente i messaggi. La sessione riconnessa perderà tutto lo stato dell'inspector, come gli agenti abilitati o i punti di interruzione configurati.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**Aggiunto in: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Invia un messaggio al back-end dell'inspector.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
L'ultima versione del protocollo dell'inspector V8 è pubblicata su [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

L'inspector di Node.js supporta tutti i domini del protocollo Chrome DevTools dichiarati da V8. Il dominio del protocollo Chrome DevTools fornisce un'interfaccia per interagire con uno degli agenti di runtime utilizzati per ispezionare lo stato dell'applicazione e ascoltare gli eventi di runtime.


#### Esempio di utilizzo {#example-usage}

Oltre al debugger, sono disponibili vari V8 Profiler tramite il protocollo DevTools.

##### Profilatore CPU {#cpu-profiler}

Ecco un esempio che mostra come utilizzare il [Profilatore CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Richiama la logica di business sotto misurazione qui...

// qualche tempo dopo...
const { profile } = await session.post('Profiler.stop');

// Scrivi il profilo su disco, carica, ecc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### Profilatore Heap {#heap-profiler}

Ecco un esempio che mostra come utilizzare il [Profilatore Heap](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot fatto:', result);
session.disconnect();
fs.closeSync(fd);
```
## API Callback {#callback-api}

### Classe: `inspector.Session` {#class-inspectorsession_1}

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

La `inspector.Session` viene utilizzata per inviare messaggi al back-end dell'ispettore V8 e ricevere risposte e notifiche ai messaggi.

#### `new inspector.Session()` {#new-inspectorsession_1}

**Aggiunto in: v8.0.0**

Crea una nuova istanza della classe `inspector.Session`. La sessione dell'ispettore deve essere connessa tramite [`session.connect()`](/it/nodejs/api/inspector#sessionconnect) prima che i messaggi possano essere inviati al back-end dell'ispettore.

Quando si utilizza `Session`, l'oggetto prodotto dall'API della console non verrà rilasciato, a meno che non eseguiamo manualmente il comando `Runtime.DiscardConsoleEntries`.


#### Evento: `'inspectorNotification'` {#event-inspectornotification_1}

**Aggiunto in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto del messaggio di notifica

Emesso quando viene ricevuta qualsiasi notifica dall'V8 Inspector.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
È anche possibile sottoscriversi solo alle notifiche con un metodo specifico:

#### Evento: `&lt;inspector-protocol-method&gt;` {#event-&lt;inspector-protocol-method&gt;;_1}

**Aggiunto in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto del messaggio di notifica

Emesso quando viene ricevuta una notifica dell'inspector che ha il suo campo metodo impostato sul valore `\<inspector-protocol-method\>`.

Il seguente snippet installa un listener sull'evento [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) e stampa il motivo della sospensione del programma ogni volta che l'esecuzione del programma viene sospesa (tramite punti di interruzione, ad esempio):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Aggiunto in: v8.0.0**

Connette una sessione al back-end dell'inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Aggiunto in: v12.11.0**

Connette una sessione al back-end dell'inspector del thread principale. Verrà generata un'eccezione se questa API non è stata chiamata su un thread Worker.

#### `session.disconnect()` {#sessiondisconnect_1}

**Aggiunto in: v8.0.0**

Chiude immediatamente la sessione. Tutti i callback dei messaggi in sospeso verranno richiamati con un errore. Sarà necessario chiamare [`session.connect()`](/it/nodejs/api/inspector#sessionconnect) per poter inviare nuovamente i messaggi. La sessione riconnessa perderà tutto lo stato dell'inspector, come agenti abilitati o punti di interruzione configurati.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `method` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Invia un messaggio al back-end dell'inspector. `callback` verrà notificato quando viene ricevuta una risposta. `callback` è una funzione che accetta due argomenti opzionali: errore e risultato specifico del messaggio.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
L'ultima versione del protocollo V8 inspector è pubblicata sul [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

L'inspector di Node.js supporta tutti i domini del protocollo Chrome DevTools dichiarati da V8. Il dominio del protocollo Chrome DevTools fornisce un'interfaccia per interagire con uno degli agenti di runtime utilizzati per ispezionare lo stato dell'applicazione e ascoltare gli eventi di runtime.

Non è possibile impostare `reportProgress` su `true` quando si invia un comando `HeapProfiler.takeHeapSnapshot` o `HeapProfiler.stopTrackingHeapObjects` a V8.


#### Esempio di utilizzo {#example-usage_1}

Oltre al debugger, sono disponibili vari profiler V8 tramite il protocollo DevTools.

##### Profiler CPU {#cpu-profiler_1}

Ecco un esempio che mostra come utilizzare il [Profiler CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Richiama la logica di business sotto misurazione qui...

    // qualche tempo dopo...
    session.post('Profiler.stop', (err, { profile }) => {
      // Scrivi il profilo su disco, caricalo, ecc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### Profiler Heap {#heap-profiler_1}

Ecco un esempio che mostra come utilizzare il [Profiler Heap](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Oggetti comuni {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.10.0 | L'API è esposta nei thread di worker. |
| v9.0.0 | Aggiunto in: v9.0.0 |
:::

Tenta di chiudere tutte le connessioni rimanenti, bloccando il ciclo di eventi finché non sono tutte chiuse. Una volta chiuse tutte le connessioni, disattiva l'inspector.

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto per inviare messaggi alla console dell'inspector remoto.

```js [ESM]
require('node:inspector').console.log('a message');
```
La console dell'inspector non ha la parità API con la console di Node.js.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0 | inspector.open() ora restituisce un oggetto `Disposable`. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta su cui ascoltare le connessioni dell'inspector. Opzionale. **Predefinito:** quello specificato nella CLI.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host su cui ascoltare le connessioni dell'inspector. Opzionale. **Predefinito:** quello specificato nella CLI.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blocca fino a quando un client non si è connesso. Opzionale. **Predefinito:** `false`.
- Restituisce: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Un Disposable che chiama [`inspector.close()`](/it/nodejs/api/inspector#inspectorclose).

Attiva l'inspector su host e porta. Equivalente a `node --inspect=[[host:]port]`, ma può essere fatto programmaticamente dopo che node è stato avviato.

Se wait è `true`, si bloccherà fino a quando un client non si sarà connesso alla porta di ispezione e il controllo del flusso non sarà stato passato al client del debugger.

Vedi l'[avviso di sicurezza](/it/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) riguardante l'utilizzo del parametro `host`.

### `inspector.url()` {#inspectorurl}

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Restituisce l'URL dell'inspector attivo, o `undefined` se non ce n'è nessuno.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger in ascolto su ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
Per aiuto, vedi: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger in ascolto su ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
Per aiuto, vedi: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**Aggiunto in: v12.7.0**

Blocca fino a quando un client (esistente o connesso successivamente) ha inviato il comando `Runtime.runIfWaitingForDebugger`.

Verrà lanciata un'eccezione se non è presente un inspector attivo.

## Integrazione con DevTools {#integration-with-devtools}

Il modulo `node:inspector` fornisce un'API per l'integrazione con i devtool che supportano il protocollo Chrome DevTools. I frontend DevTools connessi a un'istanza Node.js in esecuzione possono acquisire gli eventi del protocollo emessi dall'istanza e visualizzarli di conseguenza per facilitare il debug. I seguenti metodi trasmettono un evento del protocollo a tutti i frontend connessi. I `params` passati ai metodi possono essere facoltativi, a seconda del protocollo.

```js [ESM]
// Verrà attivato l'evento `Network.requestWillBeSent`.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**Aggiunto in: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questa funzionalità è disponibile solo con il flag `--experimental-network-inspection` abilitato.

Trasmette l'evento `Network.requestWillBeSent` ai frontend connessi. Questo evento indica che l'applicazione sta per inviare una richiesta HTTP.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**Aggiunto in: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questa funzionalità è disponibile solo con il flag `--experimental-network-inspection` abilitato.

Trasmette l'evento `Network.responseReceived` ai frontend connessi. Questo evento indica che la risposta HTTP è disponibile.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Aggiunto in: v22.6.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questa funzionalità è disponibile solo con il flag `--experimental-network-inspection` abilitato.

Trasmette l'evento `Network.loadingFinished` ai frontend connessi. Questo evento indica che il caricamento della richiesta HTTP è terminato.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Aggiunto in: v22.7.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questa funzionalità è disponibile solo con il flag `--experimental-network-inspection` abilitato.

Trasmette l'evento `Network.loadingFailed` ai frontend connessi. Questo evento indica che il caricamento della richiesta HTTP non è riuscito.

## Supporto dei punti di interruzione {#support-of-breakpoints}

Il [`Debugger` domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) del protocollo Chrome DevTools consente a una `inspector.Session` di collegarsi a un programma e impostare punti di interruzione per scorrere i codici.

Tuttavia, l'impostazione di punti di interruzione con una `inspector.Session` a thread singolo, che è connessa da [`session.connect()`](/it/nodejs/api/inspector#sessionconnect), dovrebbe essere evitata poiché il programma a cui ci si collega e che viene messo in pausa è esattamente il debugger stesso. Invece, prova a connetterti al thread principale tramite [`session.connectToMainThread()`](/it/nodejs/api/inspector#sessionconnecttomainthread) e imposta i punti di interruzione in un thread worker, oppure connettiti con un programma [Debugger](/it/nodejs/api/debugger) tramite connessione WebSocket.

