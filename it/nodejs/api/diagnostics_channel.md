---
title: Canale di Diagnostica di Node.js
description: Il modulo Canale di Diagnostica in Node.js fornisce un'API per creare, pubblicare e sottoscrivere canali di informazioni diagnostiche nominati, consentendo un migliore monitoraggio e debug delle applicazioni.
head:
  - - meta
    - name: og:title
      content: Canale di Diagnostica di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Canale di Diagnostica in Node.js fornisce un'API per creare, pubblicare e sottoscrivere canali di informazioni diagnostiche nominati, consentendo un migliore monitoraggio e debug delle applicazioni.
  - - meta
    - name: twitter:title
      content: Canale di Diagnostica di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Canale di Diagnostica in Node.js fornisce un'API per creare, pubblicare e sottoscrivere canali di informazioni diagnostiche nominati, consentendo un migliore monitoraggio e debug delle applicazioni.
---


# Canale di diagnostica {#diagnostics-channel}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel è ora Stabile. |
| v15.1.0, v14.17.0 | Aggiunto in: v15.1.0, v14.17.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

Il modulo `node:diagnostics_channel` fornisce un'API per creare canali denominati per segnalare dati di messaggi arbitrari a scopo diagnostico.

È possibile accedervi tramite:

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

È inteso che uno sviluppatore di moduli che desidera segnalare messaggi di diagnostica creerà uno o più canali di livello superiore per segnalare i messaggi. I canali possono anche essere acquisiti in fase di runtime, ma non è incoraggiato a causa del sovraccarico aggiuntivo. I canali possono essere esportati per comodità, ma finché il nome è noto, può essere acquisito ovunque.

Se intendi che il tuo modulo produca dati di diagnostica che altri possano utilizzare, si consiglia di includere la documentazione di quali canali denominati vengono utilizzati insieme alla forma dei dati dei messaggi. I nomi dei canali dovrebbero generalmente includere il nome del modulo per evitare collisioni con i dati provenienti da altri moduli.

## API pubblica {#public-api}

### Panoramica {#overview}

Di seguito è riportata una semplice panoramica dell'API pubblica.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Ottieni un oggetto canale riutilizzabile
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Dati ricevuti
}

// Iscriviti al canale
diagnostics_channel.subscribe('my-channel', onMessage);

// Controlla se il canale ha un abbonato attivo
if (channel.hasSubscribers) {
  // Pubblica i dati sul canale
  channel.publish({
    some: 'data',
  });
}

// Annulla l'iscrizione al canale
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Ottieni un oggetto canale riutilizzabile
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Dati ricevuti
}

// Iscriviti al canale
diagnostics_channel.subscribe('my-channel', onMessage);

// Controlla se il canale ha un abbonato attivo
if (channel.hasSubscribers) {
  // Pubblica i dati sul canale
  channel.publish({
    some: 'data',
  });
}

// Annulla l'iscrizione al canale
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Aggiunto in: v15.1.0, v14.17.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome del canale
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se ci sono sottoscrittori attivi

Verifica se ci sono sottoscrittori attivi al canale specificato. Questo è utile se il messaggio che si desidera inviare potrebbe essere costoso da preparare.

Questa API è opzionale ma utile quando si cerca di pubblicare messaggi da codice molto sensibile alle prestazioni.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Ci sono sottoscrittori, prepara e pubblica il messaggio
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Ci sono sottoscrittori, prepara e pubblica il messaggio
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Aggiunto in: v15.1.0, v14.17.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome del canale
- Restituisce: [\<Channel\>](/it/nodejs/api/diagnostics_channel#class-channel) L'oggetto canale con il nome specificato

Questo è il punto di ingresso principale per chiunque voglia pubblicare su un canale con nome. Produce un oggetto canale che è ottimizzato per ridurre il più possibile l'overhead al momento della pubblicazione.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Aggiunto in: v18.7.0, v16.17.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome del canale
- `onMessage` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il gestore per ricevere i messaggi del canale
    - `message` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) I dati del messaggio
    - `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome del canale
  
 

Registra un gestore di messaggi per sottoscriversi a questo canale. Questo gestore di messaggi verrà eseguito in modo sincrono ogni volta che un messaggio viene pubblicato sul canale. Qualsiasi errore generato nel gestore di messaggi attiverà un [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Dati ricevuti
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Dati ricevuti
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Aggiunto in: v18.7.0, v16.17.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome del canale
- `onMessage` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il gestore precedentemente sottoscritto da rimuovere
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il gestore è stato trovato, `false` altrimenti.

Rimuove un gestore di messaggi precedentemente registrato su questo canale con [`diagnostics_channel.subscribe(name, onMessage)`](/it/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `nameOrChannels` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/it/nodejs/api/diagnostics_channel#class-tracingchannel) Nome del canale o oggetto contenente tutti i [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels)
- Restituisce: [\<TracingChannel\>](/it/nodejs/api/diagnostics_channel#class-tracingchannel) Raccolta di canali da tracciare con

Crea un wrapper [`TracingChannel`](/it/nodejs/api/diagnostics_channel#class-tracingchannel) per i dati [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels). Se viene fornito un nome, i canali di tracciamento corrispondenti verranno creati nella forma `tracing:${name}:${eventType}` dove `eventType` corrisponde ai tipi di [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### Classe: `Channel` {#class-channel}

**Aggiunto in: v15.1.0, v14.17.0**

La classe `Channel` rappresenta un singolo canale denominato all'interno della pipeline di dati. Viene utilizzata per tenere traccia degli iscritti e per pubblicare messaggi quando sono presenti iscritti. Esiste come oggetto separato per evitare ricerche di canali al momento della pubblicazione, consentendo velocità di pubblicazione molto elevate e consentendo un uso intenso con un costo minimo. I canali vengono creati con [`diagnostics_channel.channel(name)`](/it/nodejs/api/diagnostics_channel#diagnostics_channelchannelname), la costruzione di un canale direttamente con `new Channel(name)` non è supportata.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Aggiunto in: v15.1.0, v14.17.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se ci sono iscritti attivi

Verifica se ci sono iscritti attivi a questo canale. Questo è utile se il messaggio che si desidera inviare potrebbe essere costoso da preparare.

Questa API è facoltativa ma utile quando si cerca di pubblicare messaggi da codice molto sensibile alle prestazioni.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Aggiunto in: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il messaggio da inviare agli iscritti al canale

Pubblica un messaggio a tutti gli iscritti al canale. Questo attiverà i gestori di messaggi in modo sincrono in modo che vengano eseguiti nello stesso contesto.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Aggiunto in: v15.1.0, v14.17.0**

**Deprecato a partire da: v18.7.0, v16.17.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa [`diagnostics_channel.subscribe(name, onMessage)`](/it/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il gestore per ricevere i messaggi del canale
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) I dati del messaggio
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome del canale
  
 

Registra un gestore di messaggi per iscriversi a questo canale. Questo gestore di messaggi verrà eseguito in modo sincrono ogni volta che un messaggio viene pubblicato sul canale. Eventuali errori generati nel gestore di messaggi attiveranno un [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Dati ricevuti
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Dati ricevuti
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.7.0, v16.17.0 | Deprecato a partire da: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Aggiunto il valore di ritorno. Aggiunto ai canali senza iscritti. |
| v15.1.0, v14.17.0 | Aggiunto in: v15.1.0, v14.17.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa [`diagnostics_channel.unsubscribe(name, onMessage)`](/it/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il gestore precedentemente sottoscritto da rimuovere
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il gestore è stato trovato, `false` altrimenti.

Rimuove un gestore di messaggi precedentemente registrato a questo canale con [`channel.subscribe(onMessage)`](/it/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Dati ricevuti
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Dati ricevuti
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `store` [\<AsyncLocalStorage\>](/it/nodejs/api/async_context#class-asynclocalstorage) Lo store a cui associare i dati di contesto
- `transform` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Trasforma i dati di contesto prima di impostare il contesto dello store

Quando viene chiamato [`channel.runStores(context, ...)`](/it/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args), i dati di contesto forniti verranno applicati a qualsiasi store associato al canale. Se lo store è già stato associato, la precedente funzione `transform` verrà sostituita con quella nuova. La funzione `transform` può essere omessa per impostare direttamente i dati di contesto forniti come contesto.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `store` [\<AsyncLocalStorage\>](/it/nodejs/api/async_context#class-asynclocalstorage) Lo store da scollegare dal canale.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se lo store è stato trovato, `false` altrimenti.

Rimuove un gestore di messaggi precedentemente registrato a questo canale con [`channel.bindStore(store)`](/it/nodejs/api/diagnostics_channel#channelbindstorestore-transform).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Messaggio da inviare ai sottoscrittori e da associare agli store
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Gestore da eseguire all'interno del contesto di archiviazione inserito
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il ricevitore da utilizzare per la chiamata di funzione.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare alla funzione.

Applica i dati forniti a qualsiasi istanza di AsyncLocalStorage associata al canale per la durata della funzione specificata, quindi pubblica sul canale nell'ambito di tali dati applicati agli store.

Se è stata fornita una funzione di trasformazione a [`channel.bindStore(store)`](/it/nodejs/api/diagnostics_channel#channelbindstorestore-transform) verrà applicata per trasformare i dati del messaggio prima che diventino il valore di contesto per lo store. Il contesto di archiviazione precedente è accessibile dall'interno della funzione di trasformazione nei casi in cui è richiesto il collegamento del contesto.

Il contesto applicato allo store dovrebbe essere accessibile in qualsiasi codice asincrono che continua dall'esecuzione iniziata durante la funzione specificata, tuttavia ci sono alcune situazioni in cui può verificarsi [perdita di contesto](/it/nodejs/api/async_context#troubleshooting-context-loss).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### Classe: `TracingChannel` {#class-tracingchannel}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

La classe `TracingChannel` è una raccolta di [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels) che insieme esprimono una singola azione tracciabile. Viene utilizzata per formalizzare e semplificare il processo di produzione di eventi per la tracciatura del flusso dell'applicazione. [`diagnostics_channel.tracingChannel()`](/it/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) viene utilizzato per costruire un `TracingChannel`. Come con `Channel` si consiglia di creare e riutilizzare un singolo `TracingChannel` al livello superiore del file piuttosto che crearli dinamicamente.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Insieme di abbonati [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abbonato all'[`evento start`](/it/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abbonato all'[`evento end`](/it/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abbonato all'[`evento asyncStart`](/it/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abbonato all'[`evento asyncEnd`](/it/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abbonato all'[`evento error`](/it/nodejs/api/diagnostics_channel#errorevent)
  
 

Helper per abbonare una raccolta di funzioni ai canali corrispondenti. Questo equivale a chiamare [`channel.subscribe(onMessage)`](/it/nodejs/api/diagnostics_channel#channelsubscribeonmessage) su ciascun canale individualmente.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Gestisci il messaggio di inizio
  },
  end(message) {
    // Gestisci il messaggio di fine
  },
  asyncStart(message) {
    // Gestisci il messaggio asyncStart
  },
  asyncEnd(message) {
    // Gestisci il messaggio asyncEnd
  },
  error(message) {
    // Gestisci il messaggio di errore
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Gestisci il messaggio di inizio
  },
  end(message) {
    // Gestisci il messaggio di fine
  },
  asyncStart(message) {
    // Gestisci il messaggio asyncStart
  },
  asyncEnd(message) {
    // Gestisci il messaggio asyncEnd
  },
  error(message) {
    // Gestisci il messaggio di errore
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Set di sottoscrittori dei [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il sottoscrittore dell'[`evento start`](/it/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il sottoscrittore dell'[`evento end`](/it/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il sottoscrittore dell'[`evento asyncStart`](/it/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il sottoscrittore dell'[`evento asyncEnd`](/it/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Il sottoscrittore dell'[`evento error`](/it/nodejs/api/diagnostics_channel#errorevent)
  
 
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se tutti gli handler sono stati disiscritti correttamente e `false` altrimenti.

Helper per disiscrivere una raccolta di funzioni dai canali corrispondenti. Questo è lo stesso di chiamare [`channel.unsubscribe(onMessage)`](/it/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) su ogni canale individualmente.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per avvolgere una traccia
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Oggetto condiviso per correlare gli eventi
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il ricevitore da utilizzare per la chiamata di funzione
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare alla funzione
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore di ritorno della funzione data

Traccia una chiamata di funzione sincrona. Questo produrrà sempre un evento [`start` event](/it/nodejs/api/diagnostics_channel#startevent) e un evento [`end` event](/it/nodejs/api/diagnostics_channel#endevent) attorno all'esecuzione e potrebbe produrre un evento [`error` event](/it/nodejs/api/diagnostics_channel#errorevent) se la funzione data genera un errore. Questo eseguirà la funzione data utilizzando [`channel.runStores(context, ...)`](/it/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) sul canale `start` il quale assicura che tutti gli eventi debbano avere tutti gli store associati impostati per corrispondere a questo contesto di traccia.

Per garantire che vengano formati solo grafici di traccia corretti, gli eventi verranno pubblicati solo se sono presenti sottoscrittori prima di avviare la traccia. Le sottoscrizioni che vengono aggiunte dopo l'inizio della traccia non riceveranno eventi futuri da quella traccia, verranno visualizzate solo le tracce future.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione che restituisce una Promise da racchiudere in una traccia
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Oggetto condiviso per correlare gli eventi di traccia
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il ricevitore da utilizzare per la chiamata alla funzione
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare alla funzione
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Concatenata dalla promise restituita dalla funzione data

Traccia una chiamata di funzione che restituisce una promise. Questo produrrà sempre un evento [`start` event](/it/nodejs/api/diagnostics_channel#startevent) e [`end` event](/it/nodejs/api/diagnostics_channel#endevent) attorno alla porzione sincrona dell'esecuzione della funzione, e produrrà un evento [`asyncStart` event](/it/nodejs/api/diagnostics_channel#asyncstartevent) e [`asyncEnd` event](/it/nodejs/api/diagnostics_channel#asyncendevent) quando viene raggiunta una continuazione della promise. Può anche produrre un evento [`error` event](/it/nodejs/api/diagnostics_channel#errorevent) se la funzione data genera un errore o la promise restituita viene rifiutata. Questo eseguirà la funzione data usando [`channel.runStores(context, ...)`](/it/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) sul canale `start` il che garantisce che tutti gli eventi debbano avere tutti gli store vincolati impostati in modo da corrispondere a questo contesto di traccia.

Per garantire che vengano formati solo grafi di traccia corretti, gli eventi verranno pubblicati solo se gli iscritti sono presenti prima di iniziare la traccia. Le iscrizioni che vengono aggiunte dopo l'inizio della traccia non riceveranno eventi futuri da quella traccia, verranno visualizzate solo le tracce future.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Aggiunto in: v19.9.0, v18.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) callback che utilizza una funzione per avvolgere una traccia
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Posizione dell'argomento con indice zero del callback previsto (impostato di default all'ultimo argomento se viene passato `undefined`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Oggetto condiviso per correlare gli eventi di traccia (impostato di default a `{}` se viene passato `undefined`)
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il ricevitore da utilizzare per la chiamata di funzione
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) argomenti da passare alla funzione (deve includere il callback)
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore di ritorno della funzione specificata

Traccia una chiamata di funzione che riceve un callback. Si prevede che il callback segua la convenzione dell'errore come primo argomento tipicamente utilizzata. Questo produrrà sempre un evento [`start` event](/it/nodejs/api/diagnostics_channel#startevent) e [`end` event](/it/nodejs/api/diagnostics_channel#endevent) attorno alla porzione sincrona dell'esecuzione della funzione e produrrà un evento [`asyncStart` event](/it/nodejs/api/diagnostics_channel#asyncstartevent) e [`asyncEnd` event](/it/nodejs/api/diagnostics_channel#asyncendevent) attorno all'esecuzione del callback. Potrebbe anche produrre un evento [`error` event](/it/nodejs/api/diagnostics_channel#errorevent) se la funzione specificata genera un'eccezione o se viene impostato il primo argomento passato al callback. Questo eseguirà la funzione specificata utilizzando [`channel.runStores(context, ...)`](/it/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) sul canale `start` che garantisce che tutti gli eventi debbano avere tutti gli store vincolati impostati in modo da corrispondere a questo contesto di traccia.

Per garantire che vengano formati solo grafici di traccia corretti, gli eventi verranno pubblicati solo se gli iscritti sono presenti prima di iniziare la traccia. Le iscrizioni che vengono aggiunte dopo l'inizio della traccia non riceveranno eventi futuri da quella traccia, verranno visualizzate solo le tracce future.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

Il callback verrà anche eseguito con [`channel.runStores(context, ...)`](/it/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) che abilita il ripristino della perdita di contesto in alcuni casi.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Aggiunto in: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se uno qualsiasi dei singoli canali ha un sottoscrittore, `false` in caso contrario.

Questo è un metodo helper disponibile su un'istanza di [`TracingChannel`](/it/nodejs/api/diagnostics_channel#class-tracingchannel) per verificare se uno qualsiasi dei [Canali TracingChannel](/it/nodejs/api/diagnostics_channel#tracingchannel-channels) ha sottoscrittori. Viene restituito `true` se uno qualsiasi di essi ha almeno un sottoscrittore, `false` altrimenti.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Fai qualcosa
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Fai qualcosa
}
```
:::

### Canali TracingChannel {#tracingchannel-channels}

Un TracingChannel è una raccolta di diversi diagnostics_channels che rappresentano punti specifici nel ciclo di vita dell'esecuzione di una singola azione tracciabile. Il comportamento è suddiviso in cinque diagnostics_channels costituiti da `start`, `end`, `asyncStart`, `asyncEnd` ed `error`. Una singola azione tracciabile condividerà lo stesso oggetto evento tra tutti gli eventi, questo può essere utile per la gestione della correlazione tramite una weakmap.

Questi oggetti evento saranno estesi con valori `result` o `error` quando l'attività è "completa". Nel caso di un'attività sincrona, il `result` sarà il valore di ritorno e l'`error` sarà qualsiasi cosa generata dalla funzione. Con le funzioni asincrone basate su callback, il `result` sarà il secondo argomento del callback mentre l'`error` sarà un errore generato visibile nell'evento `end` o il primo argomento del callback in uno degli eventi `asyncStart` o `asyncEnd`.

Per garantire che vengano formati solo grafici di traccia corretti, gli eventi devono essere pubblicati solo se i sottoscrittori sono presenti prima di avviare la traccia. Le sottoscrizioni aggiunte dopo l'inizio della traccia non devono ricevere eventi futuri da tale traccia, verranno visualizzate solo le tracce future.

I canali di tracciamento devono seguire uno schema di denominazione di:

- `tracing:module.class.method:start` o `tracing:module.function:start`
- `tracing:module.class.method:end` o `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` o `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` o `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` o `tracing:module.function:error`


#### `start(event)` {#startevent}

- Nome: `tracing:${name}:start`

L'evento `start` rappresenta il punto in cui una funzione viene chiamata. A questo punto, i dati dell'evento possono contenere gli argomenti della funzione o qualsiasi altra cosa disponibile all'inizio dell'esecuzione della funzione.

#### `end(event)` {#endevent}

- Nome: `tracing:${name}:end`

L'evento `end` rappresenta il punto in cui una chiamata di funzione restituisce un valore. Nel caso di una funzione asincrona, questo è quando la promise viene restituita, non quando la funzione stessa esegue internamente un'istruzione di ritorno. A questo punto, se la funzione tracciata era sincrona, il campo `result` sarà impostato sul valore di ritorno della funzione. In alternativa, il campo `error` può essere presente per rappresentare eventuali errori generati.

Si consiglia di ascoltare specificamente l'evento `error` per tenere traccia degli errori, poiché è possibile che un'azione tracciabile produca più errori. Ad esempio, un'attività asincrona che non riesce può essere avviata internamente prima della parte sincrona dell'attività e quindi generare un errore.

#### `asyncStart(event)` {#asyncstartevent}

- Nome: `tracing:${name}:asyncStart`

L'evento `asyncStart` rappresenta il callback o la continuazione di una funzione tracciabile che viene raggiunta. A questo punto, potrebbero essere disponibili elementi come gli argomenti del callback o qualsiasi altra cosa che esprima il "risultato" dell'azione.

Per le funzioni basate su callback, il primo argomento del callback verrà assegnato al campo `error`, se non `undefined` o `null`, e il secondo argomento verrà assegnato al campo `result`.

Per le promise, l'argomento al percorso `resolve` verrà assegnato a `result` o l'argomento al percorso `reject` verrà assegnato a `error`.

Si consiglia di ascoltare specificamente l'evento `error` per tenere traccia degli errori, poiché è possibile che un'azione tracciabile produca più errori. Ad esempio, un'attività asincrona che non riesce può essere avviata internamente prima della parte sincrona dell'attività e quindi generare un errore.

#### `asyncEnd(event)` {#asyncendevent}

- Nome: `tracing:${name}:asyncEnd`

L'evento `asyncEnd` rappresenta il callback di una funzione asincrona che restituisce. È improbabile che i dati dell'evento cambino dopo l'evento `asyncStart`, tuttavia può essere utile vedere il punto in cui il callback viene completato.


#### `error(event)` {#errorevent}

- Nome: `tracing:${name}:error`

L'evento `error` rappresenta qualsiasi errore prodotto dalla funzione tracciabile, sia in modo sincrono che asincrono. Se un errore viene generato nella porzione sincrona della funzione tracciata, l'errore verrà assegnato al campo `error` dell'evento e verrà attivato l'evento `error`. Se un errore viene ricevuto in modo asincrono tramite un callback o un rifiuto di una promise, verrà anch'esso assegnato al campo `error` dell'evento e attiverà l'evento `error`.

È possibile che una singola chiamata di funzione tracciabile produca errori più volte, quindi è necessario tenerne conto quando si utilizza questo evento. Ad esempio, se internamente viene attivata un'altra attività asincrona che fallisce e quindi la parte sincrona della funzione genera un errore, verranno emessi due eventi `error`, uno per l'errore sincrono e uno per l'errore asincrono.

### Canali integrati {#built-in-channels}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Sebbene l'API diagnostics_channel sia ora considerata stabile, i canali integrati attualmente disponibili non lo sono. Ogni canale deve essere dichiarato stabile indipendentemente.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Emesso quando il client crea un oggetto richiesta. A differenza di `http.client.request.start`, questo evento viene emesso prima che la richiesta sia stata inviata.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Emesso quando il client avvia una richiesta.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando si verifica un errore durante una richiesta del client.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)

Emesso quando il client riceve una risposta.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/it/nodejs/api/http#class-httpserver)

Emesso quando il server riceve una richiesta.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Emesso quando il server crea una risposta. L'evento viene emesso prima che la risposta venga inviata.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/it/nodejs/api/http#class-httpserver)

Emesso quando il server invia una risposta.


#### Moduli {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente le seguenti proprietà
    - `id` - Argomento passato a `require()`. Nome del modulo.
    - `parentFilename` - Nome del modulo che ha tentato di require(id).
  
 

Emesso quando viene eseguito `require()`. Vedi l'evento [`start`](/it/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente le seguenti proprietà
    - `id` - Argomento passato a `require()`. Nome del modulo.
    - `parentFilename` - Nome del modulo che ha tentato di require(id).
  
 

Emesso quando una chiamata a `require()` restituisce un valore. Vedi l'evento [`end`](/it/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente le seguenti proprietà
    - `id` - Argomento passato a `require()`. Nome del modulo.
    - `parentFilename` - Nome del modulo che ha tentato di require(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando `require()` genera un errore. Vedi l'evento [`error`](/it/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente le seguenti proprietà
    - `id` - Argomento passato a `import()`. Nome del modulo.
    - `parentURL` - Oggetto URL del modulo che ha tentato di import(id).
  
 

Emesso quando viene invocato `import()`. Vedi l'evento [`asyncStart`](/it/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente le seguenti proprietà
    - `id` - Argomento passato a `import()`. Nome del modulo.
    - `parentURL` - Oggetto URL del modulo che ha tentato di import(id).
  
 

Emesso quando `import()` è stato completato. Vedi l'evento [`asyncEnd`](/it/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenente le seguenti proprietà
    - `id` - Argomento passato a `import()`. Nome del modulo.
    - `parentURL` - Oggetto URL del modulo che ha tentato di import(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando `import()` genera un errore. Vedi l'evento [`error`](/it/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Emesso quando viene creato un nuovo socket client TCP o pipe.

`net.server.socket`

- `socket` [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Emesso quando viene ricevuta una nuova connessione TCP o pipe.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/it/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emesso quando viene invocato [`net.Server.listen()`](/it/nodejs/api/net#serverlisten), prima che la porta o la pipe siano effettivamente impostate.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Emesso quando [`net.Server.listen()`](/it/nodejs/api/net#serverlisten) è stato completato e quindi il server è pronto ad accettare connessioni.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/it/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando [`net.Server.listen()`](/it/nodejs/api/net#serverlisten) restituisce un errore.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/it/nodejs/api/dgram#class-dgramsocket)

Emesso quando viene creato un nuovo socket UDP.

#### Process {#process}

**Aggiunto in: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/it/nodejs/api/child_process#class-childprocess)

Emesso quando viene creato un nuovo processo.

#### Worker Thread {#worker-thread}

**Aggiunto in: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/it/nodejs/api/worker_threads#class-worker)

Emesso quando viene creato un nuovo thread.

