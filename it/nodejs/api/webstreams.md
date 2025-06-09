---
title: API Web Streams di Node.js
description: Documentazione dell'API Web Streams in Node.js, che dettaglia come lavorare con i flussi per una gestione efficiente dei dati, inclusi flussi leggibili, scrivibili e di trasformazione.
head:
  - - meta
    - name: og:title
      content: API Web Streams di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentazione dell'API Web Streams in Node.js, che dettaglia come lavorare con i flussi per una gestione efficiente dei dati, inclusi flussi leggibili, scrivibili e di trasformazione.
  - - meta
    - name: twitter:title
      content: API Web Streams di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentazione dell'API Web Streams in Node.js, che dettaglia come lavorare con i flussi per una gestione efficiente dei dati, inclusi flussi leggibili, scrivibili e di trasformazione.
---


# API Web Streams {#web-streams-api}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Non è più sperimentale. |
| v18.0.0 | L'uso di questa API non emette più un avviso di runtime. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione dello [Standard WHATWG Streams](https://streams.spec.whatwg.org/).

## Panoramica {#overview}

Lo [Standard WHATWG Streams](https://streams.spec.whatwg.org/) (o "web streams") definisce un'API per la gestione dei dati in streaming. È simile all'API [Streams](/it/nodejs/api/stream) di Node.js ma è emersa in seguito ed è diventata l'API "standard" per lo streaming di dati in molti ambienti JavaScript.

Ci sono tre tipi principali di oggetti:

- `ReadableStream` - Rappresenta una sorgente di dati in streaming.
- `WritableStream` - Rappresenta una destinazione per i dati in streaming.
- `TransformStream` - Rappresenta un algoritmo per la trasformazione dei dati in streaming.

### Esempio `ReadableStream` {#example-readablestream}

Questo esempio crea un semplice `ReadableStream` che invia il timestamp corrente di `performance.now()` una volta al secondo per sempre. Un iterable asincrono viene utilizzato per leggere i dati dallo stream.



::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### Classe: `ReadableStream` {#class-readablestream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunta in: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Aggiunta in: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene invocata immediatamente quando viene creato il `ReadableStream`.
    - `controller` [\<ReadableStreamDefaultController\>](/it/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/it/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Restituisce: `undefined` o una promise risolta con `undefined`.
  
 
    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene chiamata ripetutamente quando la coda interna `ReadableStream` non è piena. L'operazione può essere sincrona o asincrona. Se asincrona, la funzione non verrà chiamata di nuovo finché la promise restituita in precedenza non sarà stata risolta.
    - `controller` [\<ReadableStreamDefaultController\>](/it/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/it/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Restituisce: Una promise risolta con `undefined`.
  
 
    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene chiamata quando il `ReadableStream` viene annullato.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: Una promise risolta con `undefined`.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'bytes'` o `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Utilizzato solo quando `type` è uguale a `'bytes'`. Quando è impostato su un valore diverso da zero, viene allocato automaticamente un buffer di visualizzazione a `ReadableByteStreamController.byobRequest`. Quando non è impostato, è necessario utilizzare le code interne dello stream per trasferire i dati tramite il lettore predefinito `ReadableStreamDefaultReader`.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima della coda interna prima che venga applicata la contropressione.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente utilizzata per identificare la dimensione di ogni blocco di dati.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `readableStream.locked` {#readablestreamlocked}

**Aggiunto in: v16.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Impostato su `true` se c'è un lettore attivo per questo [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

La proprietà `readableStream.locked` è `false` per impostazione predefinita e viene impostata su `true` quando c'è un lettore attivo che consuma i dati dello stream.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Aggiunto in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: Una promise risolta con `undefined` una volta completata l'annullamento.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Aggiunto in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` o `undefined`
  
 
- Restituisce: [\<ReadableStreamDefaultReader\>](/it/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/it/nodejs/api/webstreams#class-readablestreambyobreader)



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

Fa sì che `readableStream.locked` sia `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Aggiunto in: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) Il `ReadableStream` a cui `transform.writable` invierà i dati potenzialmente modificati che riceve da questo `ReadableStream`.
    - `writable` [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) Il `WritableStream` a cui verranno scritti i dati di questo `ReadableStream`.
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, gli errori in questo `ReadableStream` non causeranno l'interruzione di `transform.writable`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, gli errori nella destinazione `transform.writable` non causano l'annullamento di questo `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la chiusura di questo `ReadableStream` non causa la chiusura di `transform.writable`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di annullare il trasferimento dei dati utilizzando un [\<AbortController\>](/it/nodejs/api/globals#class-abortcontroller).
  
 
- Restituisce: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) Da `transform.readable`.

Collega questo [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) alla coppia di [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) e [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) fornita nell'argomento `transform` in modo tale che i dati di questo [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) vengano scritti in `transform.writable`, possibilmente trasformati, quindi inviati a `transform.readable`. Una volta configurata la pipeline, viene restituito `transform.readable`.

Fa sì che `readableStream.locked` sia `true` mentre l'operazione di pipe è attiva.



::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::


#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**Aggiunto in: v16.5.0**

- `destination` [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) Uno [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) in cui verranno scritti i dati di questo `ReadableStream`.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, gli errori in questo `ReadableStream` non causeranno l'interruzione di `destination`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, gli errori in `destination` non causeranno l'annullamento di questo `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la chiusura di questo `ReadableStream` non causa la chiusura di `destination`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Permette di annullare il trasferimento di dati utilizzando un [\<AbortController\>](/it/nodejs/api/globals#class-abortcontroller).
  
 
- Restituisce: Una promise risolta con `undefined`

Fa sì che `readableStream.locked` sia `true` mentre l'operazione di pipe è attiva.

#### `readableStream.tee()` {#readablestreamtee}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.10.0, v16.18.0 | Supporto per la divisione di uno stream di byte leggibile. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

- Restituisce: [\<ReadableStream[]\>](/it/nodejs/api/webstreams#class-readablestream)

Restituisce una coppia di nuove istanze di [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) a cui verranno inoltrati i dati di questo `ReadableStream`. Ognuna riceverà gli stessi dati.

Fa sì che `readableStream.locked` sia `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Aggiunto in: v16.5.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, impedisce la chiusura del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) quando l'iteratore asincrono termina bruscamente. **Predefinito**: `false`.
  
 

Crea e restituisce un iteratore asincrono utilizzabile per consumare i dati di questo `ReadableStream`.

Fa sì che `readableStream.locked` sia `true` mentre l'iteratore asincrono è attivo.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Iterazione Asincrona {#async-iteration}

L'oggetto [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) supporta il protocollo di iterazione asincrona utilizzando la sintassi `for await`.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
L'iteratore asincrono consumerà [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) fino a quando non termina.

Per impostazione predefinita, se l'iteratore asincrono si chiude anticipatamente (tramite `break`, `return` o `throw`), il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) verrà chiuso. Per impedire la chiusura automatica di [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream), usa il metodo `readableStream.values()` per acquisire l'iteratore asincrono e imposta l'opzione `preventCancel` su `true`.

Il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) non deve essere bloccato (ovvero, non deve avere un lettore attivo esistente). Durante l'iterazione asincrona, il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) verrà bloccato.

#### Trasferimento con `postMessage()` {#transferring-with-postmessage}

Un'istanza [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) può essere trasferita utilizzando un [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**Aggiunto in: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Oggetto che implementa il protocollo iterabile `Symbol.asyncIterator` o `Symbol.iterator`.

Un metodo di utilità che crea un nuovo [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) da un iterabile.



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### Classe: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Per impostazione predefinita, la chiamata a `readableStream.getReader()` senza argomenti restituirà un'istanza di `ReadableStreamDefaultReader`. Il reader predefinito tratta i chunk di dati passati attraverso lo stream come valori opachi, il che consente a [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) di funzionare generalmente con qualsiasi valore JavaScript.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Aggiunto in: v16.5.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

Crea un nuovo [\<ReadableStreamDefaultReader\>](/it/nodejs/api/webstreams#class-readablestreamdefaultreader) che è bloccato al dato [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Aggiunto in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: Una promise risolta con `undefined`.

Annulla il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) e restituisce una promise che viene risolta quando lo stream sottostante è stato annullato.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Aggiunto in: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Risolta con `undefined` quando il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) associato è chiuso o rifiutata se lo stream genera errori o il blocco del reader viene rilasciato prima che lo stream finisca di chiudersi.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Aggiunto in: v16.5.0**

- Restituisce: Una promise risolta con un oggetto: 
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Richiede il prossimo chunk di dati dal sottostante [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) e restituisce una promise che viene risolta con i dati una volta che sono disponibili.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Aggiunto in: v16.5.0**

Rilascia il blocco di questo reader sul sottostante [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

### Classe: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Il `ReadableStreamBYOBReader` è un consumatore alternativo per [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) orientati ai byte (quelli creati con `underlyingSource.type` impostato su `'bytes'` quando è stato creato il `ReadableStream`).

`BYOB` è l'abbreviazione di "bring your own buffer" (porta il tuo buffer). Questo è un modello che consente una lettura più efficiente dei dati orientati ai byte che evita copie estranee.

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**Aggiunto in: v16.5.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

Crea un nuovo `ReadableStreamBYOBReader` bloccato al dato [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Aggiunto in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: Una promise risolta con `undefined`.

Annulla il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) e restituisce una promise che viene risolta quando lo stream sottostante è stato annullato.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Aggiunto in: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Risolta con `undefined` quando il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) associato è chiuso o rifiutata se lo stream genera errori o il blocco del reader viene rilasciato prima che lo stream finisca di chiudersi.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.7.0, v20.17.0 | Aggiunta l'opzione `min`. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

- `view` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Quando impostato, la promise restituita verrà risolta solo quando sarà disponibile il numero `min` di elementi. Quando non impostato, la promise si risolve quando è disponibile almeno un elemento.
  
 
- Restituisce: Una promise risolta con un oggetto: 
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Richiede il prossimo blocco di dati dal [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) sottostante e restituisce una promise che viene risolta con i dati una volta che sono disponibili.

Non passare un'istanza di oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) in pool a questo metodo. Gli oggetti `Buffer` in pool vengono creati usando `Buffer.allocUnsafe()`, o `Buffer.from()`, o vengono spesso restituiti da vari callback del modulo `node:fs`. Questi tipi di `Buffer` utilizzano un oggetto sottostante condiviso [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) che contiene tutti i dati da tutte le istanze `Buffer` in pool. Quando un `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) viene passato a `readableStreamBYOBReader.read()`, l'`ArrayBuffer` sottostante della view viene *scollegato*, invalidando tutte le view esistenti che potrebbero esistere su quell'`ArrayBuffer`. Questo può avere conseguenze disastrose per la tua applicazione.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Aggiunto in: v16.5.0**

Rilascia il blocco di questo reader sul sottostante [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

### Classe: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Aggiunto in: v16.5.0**

Ogni [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) ha un controller che è responsabile dello stato interno e della gestione della coda dello stream. Il `ReadableStreamDefaultController` è l'implementazione del controller predefinita per i `ReadableStream` che non sono orientati ai byte.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Aggiunto in: v16.5.0**

Chiude il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) a cui questo controller è associato.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Aggiunto in: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la quantità di dati rimanenti per riempire la coda del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Aggiunto in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Aggiunge un nuovo blocco di dati alla coda del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Aggiunto in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Segnala un errore che causa l'errore e la chiusura del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

### Classe: `ReadableByteStreamController` {#class-readablebytestreamcontroller}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.10.0 | Supporta la gestione di una richiesta pull BYOB da un reader rilasciato. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Ogni [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) ha un controller che è responsabile dello stato interno e della gestione della coda dello stream. Il `ReadableByteStreamController` è per i `ReadableStream` orientati ai byte.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Aggiunto in: v16.5.0**

- Tipo: [\<ReadableStreamBYOBRequest\>](/it/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Aggiunto in: v16.5.0**

Chiude il [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) a cui questo controller è associato.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Aggiunto in: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la quantità di dati rimanenti per riempire la coda del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Aggiunto in: v16.5.0**

- `chunk`: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Aggiunge un nuovo blocco di dati alla coda del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Aggiunto in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Segnala un errore che causa l'errore e la chiusura del [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

### Classe: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Quando si utilizza `ReadableByteStreamController` in flussi orientati ai byte e quando si utilizza `ReadableStreamBYOBReader`, la proprietà `readableByteStreamController.byobRequest` fornisce l'accesso a un'istanza `ReadableStreamBYOBRequest` che rappresenta la richiesta di lettura corrente. L'oggetto viene utilizzato per ottenere l'accesso a `ArrayBuffer`/`TypedArray` fornito per la richiesta di lettura da riempire e fornisce metodi per segnalare che i dati sono stati forniti.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Aggiunto in: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Segnala che un numero `bytesWritten` di byte è stato scritto in `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Aggiunto in: v16.5.0**

- `view` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Segnala che la richiesta è stata soddisfatta con byte scritti in un nuovo `Buffer`, `TypedArray` o `DataView`.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Aggiunto in: v16.5.0**

- Type: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Classe: `WritableStream` {#class-writablestream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

`WritableStream` è una destinazione a cui vengono inviati i dati di flusso.

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**Aggiunto in: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene invocata immediatamente quando viene creato il `WritableStream`. 
    - `controller` [\<WritableStreamDefaultController\>](/it/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Returns: `undefined` o una promise risolta con `undefined`.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene invocata quando un blocco di dati è stato scritto nel `WritableStream`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/it/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Returns: Una promise risolta con `undefined`.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene chiamata quando il `WritableStream` viene chiuso. 
    - Returns: Una promise risolta con `undefined`.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene chiamata per chiudere bruscamente il `WritableStream`. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: Una promise risolta con `undefined`.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'opzione `type` è riservata per un uso futuro e *deve* essere undefined.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima della coda interna prima che venga applicata la contropressione.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente utilizzata per identificare la dimensione di ciascun blocco di dati. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Aggiunto in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: Una promise risolta con `undefined`.

Termina bruscamente il `WritableStream`. Tutte le scritture in coda verranno annullate con le relative promise rifiutate.

#### `writableStream.close()` {#writablestreamclose}

**Aggiunto in: v16.5.0**

- Restituisce: Una promise risolta con `undefined`.

Chiude il `WritableStream` quando non sono previste ulteriori scritture.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Aggiunto in: v16.5.0**

- Restituisce: [\<WritableStreamDefaultWriter\>](/it/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Crea e restituisce una nuova istanza writer che può essere utilizzata per scrivere dati nel `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**Aggiunto in: v16.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `writableStream.locked` è `false` per impostazione predefinita e viene impostata su `true` quando è presente un writer attivo collegato a questo `WritableStream`.

#### Trasferimento con postMessage() {#transferring-with-postmessage_1}

Un'istanza [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) può essere trasferita utilizzando un [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Classe: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Aggiunto in: v16.5.0**

- `stream` [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

Crea un nuovo `WritableStreamDefaultWriter` bloccato sul `WritableStream` specificato.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Aggiunto in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: Una promise risolta con `undefined`.

Termina bruscamente il `WritableStream`. Tutte le scritture in coda verranno annullate con le relative promise rifiutate.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Aggiunto in: v16.5.0**

- Restituisce: Una promise risolta con `undefined`.

Chiude il `WritableStream` quando non sono previste ulteriori scritture.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Aggiunto in: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Risolto con `undefined` quando l'associato [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) è chiuso o rifiutato se lo stream genera errori o il blocco dello writer viene rilasciato prima che lo stream termini la chiusura.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Aggiunto in: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantità di dati necessari per riempire la coda del [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Aggiunto in: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Risolto con `undefined` quando lo writer è pronto per essere utilizzato.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Aggiunto in: v16.5.0**

Rilascia il blocco di questo writer sul sottostante [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream).

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Aggiunto in: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: Una promise risolta con `undefined`.

Aggiunge un nuovo blocco di dati alla coda del [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream).

### Classe: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Il `WritableStreamDefaultController` gestisce lo stato interno del [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Aggiunto in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Chiamato dal codice utente per segnalare che si è verificato un errore durante l'elaborazione dei dati `WritableStream`. Quando viene chiamato, il [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) verrà interrotto, con le scritture attualmente in sospeso annullate.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Tipo: [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un `AbortSignal` che può essere utilizzato per annullare operazioni di scrittura o chiusura in sospeso quando un [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) viene interrotto.

### Classe: `TransformStream` {#class-transformstream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Un `TransformStream` è costituito da un [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) e un [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) che sono collegati in modo tale che i dati scritti nel `WritableStream` vengano ricevuti e potenzialmente trasformati, prima di essere inseriti nella coda del `ReadableStream`.

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**Aggiunto in: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene invocata immediatamente quando viene creato il `TransformStream`.
    - `controller` [\<TransformStreamDefaultController\>](/it/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Restituisce: `undefined` o una promise risolta con `undefined`
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che riceve e potenzialmente modifica un blocco di dati scritto in `transformStream.writable`, prima di inoltrarlo a `transformStream.readable`.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/it/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Restituisce: Una promise risolta con `undefined`.
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente che viene chiamata immediatamente prima che il lato scrivibile del `TransformStream` venga chiuso, segnalando la fine del processo di trasformazione.
    - `controller` [\<TransformStreamDefaultController\>](/it/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Restituisce: Una promise risolta con `undefined`.
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) l'opzione `readableType` è riservata per un uso futuro e *deve* essere `undefined`.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) l'opzione `writableType` è riservata per un uso futuro e *deve* essere `undefined`.
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima della coda interna prima che venga applicata la contropressione.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente utilizzata per identificare la dimensione di ogni blocco di dati.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima della coda interna prima che venga applicata la contropressione.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione definita dall'utente utilizzata per identificare la dimensione di ogni blocco di dati.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `transformStream.readable` {#transformstreamreadable}

**Aggiunto in: v16.5.0**

- Tipo: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Aggiunto in: v16.5.0**

- Tipo: [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

#### Trasferimento con postMessage() {#transferring-with-postmessage_2}

Un'istanza di [\<TransformStream\>](/it/nodejs/api/webstreams#class-transformstream) può essere trasferita usando un [\<MessagePort\>](/it/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Classe: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

Il `TransformStreamDefaultController` gestisce lo stato interno del `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Aggiunto in: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantità di dati richiesta per riempire la coda del lato leggibile.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Aggiunto in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Accoda un blocco di dati alla coda del lato leggibile.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Aggiunto in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Segnala a entrambi i lati, leggibile e scrivibile, che si è verificato un errore durante l'elaborazione dei dati di trasformazione, causando la chiusura improvvisa di entrambi i lati.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Aggiunto in: v16.5.0**

Chiude il lato leggibile del trasporto e fa sì che il lato scrivibile venga chiuso improvvisamente con un errore.

### Classe: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Aggiunto in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Aggiunto in: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Aggiunto in: v16.5.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Classe: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.5.0 | Aggiunto in: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Aggiunto in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Aggiunto in: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Aggiunto in: v16.5.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Classe: `TextEncoderStream` {#class-textencoderstream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.6.0 | Aggiunto in: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Aggiunto in: v16.6.0**

Crea una nuova istanza di `TextEncoderStream`.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Aggiunto in: v16.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codifica supportata dall'istanza di `TextEncoderStream`.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Aggiunto in: v16.6.0**

- Tipo: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Aggiunto in: v16.6.0**

- Tipo: [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

### Classe: `TextDecoderStream` {#class-textdecoderstream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v16.6.0 | Aggiunto in: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Aggiunto in: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifica la `encoding` supportata da questa istanza di `TextDecoder`. **Predefinito:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se i fallimenti di decodifica sono fatali.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, `TextDecoderStream` includerà il byte order mark nel risultato decodificato. Quando `false`, il byte order mark verrà rimosso dall'output. Questa opzione viene utilizzata solo quando `encoding` è `'utf-8'`, `'utf-16be'` o `'utf-16le'`. **Predefinito:** `false`.
  
 

Crea una nuova istanza di `TextDecoderStream`.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Aggiunto in: v16.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codifica supportata dall'istanza di `TextDecoderStream`.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Aggiunto in: v16.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il valore sarà `true` se gli errori di decodifica comportano il lancio di un `TypeError`.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Aggiunto in: v16.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il valore sarà `true` se il risultato della decodifica includerà il byte order mark.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Aggiunto in: v16.6.0**

- Tipo: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Aggiunto in: v16.6.0**

- Tipo: [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

### Classe: `CompressionStream` {#class-compressionstream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v17.0.0 | Aggiunto in: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.2.0, v20.12.0 | format ora accetta il valore `deflate-raw`. |
| v17.0.0 | Aggiunto in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra `'deflate'`, `'deflate-raw'` o `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Aggiunto in: v17.0.0**

- Tipo: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Aggiunto in: v17.0.0**

- Tipo: [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

### Classe: `DecompressionStream` {#class-decompressionstream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Questa classe è ora esposta sull'oggetto globale. |
| v17.0.0 | Aggiunto in: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.2.0, v20.12.0 | format ora accetta il valore `deflate-raw`. |
| v17.0.0 | Aggiunto in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra `'deflate'`, `'deflate-raw'` o `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Aggiunto in: v17.0.0**

- Tipo: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Aggiunto in: v17.0.0**

- Tipo: [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)


### Utilità Consumer {#utility-consumers}

**Aggiunto in: v16.7.0**

Le funzioni consumer di utilità forniscono opzioni comuni per l'utilizzo di flussi.

Vi si accede usando:

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**Aggiunto in: v16.7.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un `ArrayBuffer` contenente l'intero contenuto del flusso.

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**Aggiunto in: v16.7.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un [\<Blob\>](/it/nodejs/api/buffer#class-blob) contenente l'intero contenuto del flusso.

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**Aggiunto in: v16.7.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) contenente l'intero contenuto dello stream.

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Aggiunto in: v16.7.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con il contenuto dello stream analizzato come stringa codificata in UTF-8 che viene poi passata attraverso `JSON.parse()`.

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**Aggiunto in: v16.7.0**

- `stream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con il contenuto dello stream analizzato come una stringa con codifica UTF-8.

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

